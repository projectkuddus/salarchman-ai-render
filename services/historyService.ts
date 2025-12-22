import { supabase } from './supabaseClient';
import { GenerationResult } from '../types';

export const historyService = {
    /**
     * Uploads a base64 image to Supabase Storage and returns the public URL
     */
    /**
     * Uploads a base64 image to Supabase Storage and returns the public URL
     */
    uploadImage: async (userId: string, imageId: string, base64Data: string): Promise<string | null> => {
        if (!base64Data || !base64Data.startsWith('data:image')) return null;

        try {
            // Convert base64 to Blob
            const base64Response = await fetch(base64Data);
            const blob = await base64Response.blob();

            const filePath = `${userId}/${imageId}.png`;

            const { error: uploadError } = await supabase.storage
                .from('generations')
                .upload(filePath, blob, {
                    contentType: 'image/png',
                    upsert: true
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from('generations')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error processing image upload:', error);
            return null;
        }
    },

    /**
     * Saves a generation record to the database
     */
    saveGeneration: async (userId: string, generation: GenerationResult) => {
        try {
            // 1. Upload the main generated image
            const imageUrl = await historyService.uploadImage(userId, generation.id, generation.generatedImage);

            if (!imageUrl) {
                throw new Error('Failed to upload generated image');
            }

            // 2. Upload input images if they exist
            // We use a suffix for the ID to distinguish them
            const originalImageUrl = generation.originalImage
                ? await historyService.uploadImage(userId, `${generation.id}_original`, generation.originalImage)
                : null;

            const siteImageUrl = generation.siteImage
                ? await historyService.uploadImage(userId, `${generation.id}_site`, generation.siteImage)
                : null;

            const referenceImageUrl = generation.referenceImage
                ? await historyService.uploadImage(userId, `${generation.id}_reference`, generation.referenceImage)
                : null;

            const metadata = {
                // Store the URLs in metadata if we have them, otherwise null
                originalImage: originalImageUrl,
                siteImage: siteImageUrl,
                referenceImage: referenceImageUrl,
                timestamp: generation.timestamp,
                selectedVerbs: generation.selectedVerbs,
                ideationConfig: generation.ideationConfig,
                createMode: generation.createMode,
                atmospheres: generation.atmospheres,
                elevationSide: generation.elevationSide
            };

            // 3. Insert into table
            const { error } = await supabase
                .from('generations')
                .insert({
                    user_id: userId,
                    image_url: imageUrl,
                    prompt: generation.prompt,
                    style: generation.style,
                    view_type: generation.viewType,
                    aspect_ratio: generation.aspectRatio,
                    metadata: metadata
                });

            if (error) {
                console.error('Error saving generation to DB:', error);
                throw error;
            }

            return imageUrl;
        } catch (error) {
            console.error('Error in saveGeneration:', error);
            throw error;
        }
    },

    /**
     * Fetches user history from Supabase
     */
    getUserHistory: async (userId: string): Promise<GenerationResult[]> => {
        try {
            const { data, error } = await supabase
                .from('generations')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map(row => ({
                id: row.id,
                generatedImage: row.image_url, // Main image URL
                // If metadata has the URL, use it. Otherwise empty string (fallback)
                originalImage: row.metadata?.originalImage || '',
                siteImage: row.metadata?.siteImage || null,
                referenceImage: row.metadata?.referenceImage || null,
                prompt: row.prompt,
                style: row.style,
                viewType: row.view_type,
                aspectRatio: row.aspect_ratio,
                timestamp: new Date(row.created_at).getTime(),
                ...row.metadata
            }));
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    }
};
