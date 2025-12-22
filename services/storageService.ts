
import { CustomStyle, GenerationResult, User, UserCredits, ViewType } from '../types';
import { indexedDBService } from './indexedDBService';

interface UserData {
  history: GenerationResult[];
  customStyles: CustomStyle[];
  user?: Partial<User>; // Store updated user details
  credits?: UserCredits;
}

const STORAGE_PREFIX = 'salarchman_user_data_';

export const storageService = {
  /**
   * Loads data specific to a user email
   */
  loadUserData: (email: string): UserData => {
    try {
      const key = `${STORAGE_PREFIX}${email}`;
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Failed to load user data", error);
    }
    return { history: [], customStyles: [] };
  },

  /**
   * Loads user data and resolves any offloaded images from IndexedDB
   */
  loadHistoryWithImages: async (email: string): Promise<GenerationResult[]> => {
    const userData = storageService.loadUserData(email);
    const history = userData.history || [];

    if (history.length === 0) return [];

    // Resolve images
    const resolvedHistory = await Promise.all(history.map(async (item) => {
      const newItem = { ...item };

      const resolveField = async (field: keyof GenerationResult) => {
        const value = newItem[field];
        if (typeof value === 'string' && value.startsWith('indexeddb:')) {
          const imageId = value.replace('indexeddb:', '');
          const data = await indexedDBService.getImage(imageId);
          if (data) {
            (newItem as any)[field] = data;
          }
        }
      };

      await resolveField('generatedImage');
      await resolveField('originalImage');
      if (newItem.siteImage) await resolveField('siteImage');
      if (newItem.referenceImage) await resolveField('referenceImage');

      return newItem;
    }));

    return resolvedHistory;
  },

  /**
   * Recovers lost history by scanning IndexedDB for orphaned images
   */
  recoverLostHistory: async (email: string): Promise<GenerationResult[]> => {
    try {
      const keys = await indexedDBService.getAllKeys();
      const userData = storageService.loadUserData(email);
      const existingIds = new Set(userData.history.map(h => h.id));

      // Group keys by UUID (format: uuid_field)
      const orphanedGroups = new Map<string, Set<string>>();

      keys.forEach(key => {
        // Assuming UUID is the first part before the last underscore
        // But our format is ${item.id}_${field}
        // UUIDs are usually 36 chars. Let's try to extract the ID.
        // Or simpler: split by last underscore
        const lastUnderscoreIndex = key.lastIndexOf('_');
        if (lastUnderscoreIndex > 0) {
          const id = key.substring(0, lastUnderscoreIndex);
          const field = key.substring(lastUnderscoreIndex + 1);

          if (!existingIds.has(id)) {
            if (!orphanedGroups.has(id)) {
              orphanedGroups.set(id, new Set());
            }
            orphanedGroups.get(id)?.add(field);
          }
        }
      });

      const recoveredItems: GenerationResult[] = [];

      for (const [id, fields] of orphanedGroups) {
        // We need at least a generatedImage to consider it valid
        if (fields.has('generatedImage')) {
          // Reconstruct item
          const generatedImage = await indexedDBService.getImage(`${id}_generatedImage`);

          if (generatedImage) {
            const item: GenerationResult = {
              id: id,
              generatedImage: generatedImage,
              originalImage: fields.has('originalImage') ? (await indexedDBService.getImage(`${id}_originalImage`)) || '' : '',
              prompt: 'Restored from History',
              style: 'Restored',
              viewType: ViewType.PERSPECTIVE, // Default
              aspectRatio: '16:9', // Default
              timestamp: Date.now(), // We don't have the real timestamp easily unless we stored it in IDB value
              // We could try to get timestamp from IDB value if we updated getImage to return full object
            };
            recoveredItems.push(item);
          }
        }
      }

      if (recoveredItems.length > 0) {
        console.log(`Recovered ${recoveredItems.length} lost history items.`);
        // Merge and save
        const mergedHistory = [...recoveredItems, ...userData.history];
        // Sort by timestamp if possible, but we don't have accurate timestamps for recovered ones
        // So maybe put recovered at the end or beginning? 
        // Let's put them at the end (older)

        const newData = { ...userData, history: mergedHistory };
        await storageService.saveUserData(email, newData);
        return mergedHistory;
      }

      return userData.history;

    } catch (error) {
      console.error("Error recovering history:", error);
      return [];
    }
  },

  /**
   * Saves data specific to a user email with Quota Exceeded handling
   * Offloads large images to IndexedDB
   */
  saveUserData: async (email: string, data: UserData) => {
    const key = `${STORAGE_PREFIX}${email}`;

    // Deep copy to avoid mutating the state directly
    const dataToSave = JSON.parse(JSON.stringify(data)) as UserData;

    // Process history to offload images
    if (dataToSave.history && dataToSave.history.length > 0) {
      for (const item of dataToSave.history) {
        // Helper to offload a specific image field
        const offloadImage = async (field: keyof GenerationResult) => {
          const value = item[field];
          if (typeof value === 'string' && value.startsWith('data:image')) {
            // Create a unique ID for the image if not already present (using item.id + field suffix)
            const imageId = `${item.id}_${field}`;
            await indexedDBService.saveImage(imageId, value);
            // Replace with reference
            (item as any)[field] = `indexeddb:${imageId}`;
          }
        };

        await offloadImage('generatedImage');
        await offloadImage('originalImage');
        if (item.siteImage) await offloadImage('siteImage');
        if (item.referenceImage) await offloadImage('referenceImage');
      }
    }

    try {
      localStorage.setItem(key, JSON.stringify(dataToSave));
    } catch (error: any) {
      // Check for QuotaExceededError
      if (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.warn("LocalStorage quota exceeded even with IndexedDB offloading. Attempting to trim history.");

        // If history exists, try to trim it from the end (oldest items)
        if (dataToSave.history && dataToSave.history.length > 0) {
          const originalHistory = [...dataToSave.history];

          // Iteratively remove the oldest item until it fits
          while (originalHistory.length > 0) {
            originalHistory.pop(); // Remove the last (oldest) item
            dataToSave.history = originalHistory;

            try {
              localStorage.setItem(key, JSON.stringify(dataToSave));
              // If successful, break the loop
              console.log(`Recovered from quota error. History trimmed to ${originalHistory.length} items.`);
              return;
            } catch (e) {
              // If still failing, loop continues to pop another item
              continue;
            }
          }
        }
      } else {
        console.error("Failed to save user data", error);
      }
    }
  },

  /**
   * Simulates a Google Login process
   */
  mockGoogleLogin: async (): Promise<{ email: string; name: string; avatar: string; id: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if we have saved profile data for the demo user
        const key = `${STORAGE_PREFIX}architect@studio.com`;
        const data = localStorage.getItem(key);
        let savedProfile = {};
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (parsed.userProfile) savedProfile = parsed.userProfile;
          } catch (e) {
            console.error("Error parsing saved user data during login", e);
          }
        }

        resolve({
          id: 'usr_' + Math.random().toString(36).substr(2, 9),
          email: 'architect@studio.com',
          name: 'Demo Architect',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          ...savedProfile // Override with saved data if exists
        });
      }, 1500); // Simulate network delay
    });
  },

  /**
   * Merges local and cloud history, preferring cloud for metadata but keeping local images if available
   */
  mergeHistory: (localHistory: GenerationResult[], cloudHistory: GenerationResult[]): GenerationResult[] => {
    const mergedMap = new Map<string, GenerationResult>();

    // 1. Add all local items first
    localHistory.forEach(item => {
      mergedMap.set(item.id, item);
    });

    // 2. Merge cloud items
    cloudHistory.forEach(cloudItem => {
      if (mergedMap.has(cloudItem.id)) {
        // If exists locally, we might want to keep the local one if it has base64 images (faster)
        // But cloud might have better metadata. 
        // For now, let's assume local is "better" because it might have the full base64 data immediately available
        // without needing a network fetch.
        // However, if local is missing something, we could fill it in.
        const localItem = mergedMap.get(cloudItem.id)!;

        // If local item is missing images (e.g. it was just a stub), use cloud
        if (!localItem.generatedImage && cloudItem.generatedImage) {
          mergedMap.set(cloudItem.id, { ...localItem, ...cloudItem });
        }
      } else {
        // If not in local, add it
        mergedMap.set(cloudItem.id, cloudItem);
      }
    });

    // Convert to array and sort by timestamp (newest first)
    return Array.from(mergedMap.values()).sort((a, b) => {
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  }
};
