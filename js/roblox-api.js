/**
 * Roblox API Helper Functions
 * This file contains functions to interact with the Roblox API through our server
 */

/**
 * Fetch Roblox user ID from username
 * @param {string} username - Roblox username
 * @returns {Promise<number|null>} - User ID or null if not found
 */
async function fetchRobloxUserId(username) {
    try {
        console.log('API Helper: Fetching user ID for', username);
        
        // Make request to our Vercel API
        const response = await fetch('/api/get-user-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username
            })
        });
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        // Parse response
        const result = await response.json();
        
        // Check if user was found
        if (result.success && result.data) {
            console.log('API Helper: User ID found:', result.data.id);
            return result.data.id;
        } else {
            console.warn('API Helper: User not found');
            return null;
        }
    } catch (error) {
        console.error('API Helper: Error fetching user ID:', error);
        return null;
    }
}

/**
 * Fetch Roblox avatar URL using user ID
 * @param {number} userId - Roblox user ID
 * @returns {Promise<string|null>} - Avatar URL or null if not found
 */
async function fetchRobloxAvatar(userId) {
    try {
        console.log('API Helper: Fetching avatar for user ID', userId);
        
        // Make request to our Vercel API
        const response = await fetch(`/api/get-avatar?userId=${userId}`);
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        // Parse response
        const result = await response.json();
        
        // Check if avatar was found
        if (result.success && result.data) {
            console.log('API Helper: Avatar URL found:', result.data.imageUrl);
            return result.data.imageUrl;
        } else {
            console.warn('API Helper: Avatar not found');
            return null;
        }
    } catch (error) {
        console.error('API Helper: Error fetching avatar:', error);
        return null;
    }
}

/**
 * Fetch Roblox profile using username
 * @param {string} username - Roblox username
 * @returns {Promise<Object|null>} - Profile data or null if not found
 */
async function fetchRobloxProfile(username) {
    try {
        console.log('API Helper: Fetching profile for', username);
        
        // Make request to our Vercel API
        const response = await fetch(`/api/get-user-id?username=${encodeURIComponent(username)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username
            })
        });
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        // Parse response
        const result = await response.json();
        
        // Check if profile was found
        if (result.success && result.data) {
            console.log('API Helper: Profile found:', result.data);
            return result.data;
        } else {
            console.warn('API Helper: Profile not found');
            return null;
        }
    } catch (error) {
        console.error('API Helper: Error fetching profile:', error);
        return null;
    }
}

// Export functions
window.RobloxAPI = {
    fetchUserId: fetchRobloxUserId,
    fetchAvatar: fetchRobloxAvatar,
    fetchProfile: fetchRobloxProfile
};