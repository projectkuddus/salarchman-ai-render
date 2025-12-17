
import { CustomStyle, GenerationResult, User } from '../types';

interface UserData {
  history: GenerationResult[];
  customStyles: CustomStyle[];
  userProfile?: Partial<User>; // Store updated user details
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
   * Saves data specific to a user email with Quota Exceeded handling
   */
  saveUserData: (email: string, data: UserData) => {
    const key = `${STORAGE_PREFIX}${email}`;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error: any) {
      // Check for QuotaExceededError
      if (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      ) {
        console.warn("LocalStorage quota exceeded. Attempting to trim history to save latest data.");
        
        const dataToSave = { ...data };
        
        // If history exists, try to trim it from the end (oldest items)
        // Note: In App.tsx, new items are added to the front ([new, ...old]). 
        // So the end of the array contains the oldest items.
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
            
            // If we are here, we removed all history and it still might have failed 
            // (e.g., if just customStyles + profile are too big, or one massive item currently being added)
             try {
                // Try saving with empty history
                dataToSave.history = [];
                localStorage.setItem(key, JSON.stringify(dataToSave));
            } catch(e) {
                console.error("Critical: Unable to save user data even after clearing history.", e);
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
  }
};
