import { supabase } from './supabaseClient';
import { GenerationResult } from '../types';

export const historyService = {
    /**
     * Uploads a base64 image to Supabase Storage and returns the public URL
     */
    uploadImage: async (userId: string, imageId: string, base64Data: string): Promise<string | null> => {
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

            // 2. Prepare metadata (store other images as base64 in metadata for now, or upload them too if needed)
            // For a robust solution, we should ideally upload all images, but to save bandwidth/storage, 
            // we might just store the main one in the cloud for the history view.
            // Let's store the main image URL in the row, and keep the rest in metadata if they fit, 
            // or just omit them for the history list view (which usually only needs the result).

            const metadata = {
                originalImage: generation.originalImage ? 'stored_in_idb' : null, // Don't bloat DB with base64
                siteImage: generation.siteImage ? 'stored_in_idb' : null,
                referenceImage: generation.referenceImage ? 'stored_in_idb' : null,
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
                generatedImage: row.image_url, // This is now a URL, not base64
                originalImage: '', // We don't fetch the inputs for the history list view to save data
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
