/**
 * Roblox Gamepass Helper Functions
 * This file contains functions to interact with the Roblox Gamepass API through our server
 */

// Map/Location data with gamepass information
// These are games created by the website owner, not public games
const ROBLOX_MAPS = [
    {
        id: 1,
        name: "Verda Tycoon",
        gameId: 12345678, // Replace with actual game ID owned by website owner
        price: 25,
        imageUrl: "https://tr.rbxcdn.com/e22f1985d5bb5e9a2ddb51ad6a2b0bd5/768/432/Image/Png",
        description: "Build and manage your own business empire in this exciting tycoon game!"
    },
    {
        id: 2,
        name: "Verda Obby",
        gameId: 23456789, // Replace with actual game ID owned by website owner
        price: 50,
        imageUrl: "https://tr.rbxcdn.com/0e0d070a0926563bfb3d0f5531a240c0/768/432/Image/Png",
        description: "Challenge yourself with increasingly difficult obstacle courses!"
    },
    {
        id: 3,
        name: "Verda Simulator",
        gameId: 34567890, // Replace with actual game ID owned by website owner
        price: 75,
        imageUrl: "https://tr.rbxcdn.com/33b0c9c75f1b9dc5e8d2b337f6e4e21f/768/432/Image/Png",
        description: "Collect coins, upgrade your character, and become the strongest player!"
    },
    {
        id: 4,
        name: "Verda RPG",
        gameId: 45678901, // Replace with actual game ID owned by website owner
        price: 100,
        imageUrl: "https://tr.rbxcdn.com/5d7c25e9c8b0dfa3c5e406695c8e8c25/768/432/Image/Png",
        description: "Embark on an epic adventure in this role-playing game!"
    }
];

/**
 * Extract gamepass ID from a Roblox gamepass URL
 * @param {string} url - Roblox gamepass URL
 * @returns {number|null} - Gamepass ID or null if invalid URL
 */
function extractGamepassId(url) {
    try {
        // Check if URL is valid
        if (!url || typeof url !== 'string') {
            return null;
        }
        
        // Try to extract ID using regex
        // Matches patterns like:
        // - https://www.roblox.com/game-pass/12345/Name
        // - https://web.roblox.com/game-pass/12345/Name
        // - https://roblox.com/game-pass/12345
        const regex = /roblox\.com\/game-pass\/(\d+)/i;
        const match = url.match(regex);
        
        if (match && match[1]) {
            const id = parseInt(match[1]);
            return isNaN(id) ? null : id;
        }
        
        // If no match found, check if the input is just a number
        const directId = parseInt(url);
        if (!isNaN(directId) && directId.toString() === url.trim()) {
            return directId;
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting gamepass ID:', error);
        return null;
    }
}

/**
 * Check if a game has a valid gamepass for the specified Robux amount
 * @param {number} placeId - Roblox place/game ID
 * @param {number} robuxAmount - Amount of Robux being purchased
 * @returns {Promise<Object>} - Validation result
 */
async function validateGamepass(placeId, robuxAmount) {
    try {
        console.log('Gamepass Helper: Checking for valid gamepass', {
            placeId, robuxAmount
        });
        
        // Show loading message in UI if available
        const validationResult = document.getElementById('gamepass-validation-result');
        if (validationResult) {
            validationResult.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
                    <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px;"></div>
                    <span>Memeriksa gamepass yang tersedia...</span>
                </div>
            `;
            validationResult.style.display = 'block';
            validationResult.style.backgroundColor = '#D1ECF1';
            validationResult.style.color = '#0C5460';
            validationResult.style.border = '1px solid #BEE5EB';
            validationResult.style.borderRadius = '10px';
        }
        
        // Make request to our API
        const response = await fetch(`/api/check-gamepass?placeId=${placeId}&robuxAmount=${robuxAmount}`);
        
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        // Parse response
        const result = await response.json();
        
        console.log('Gamepass Helper: Validation result', result);
        
        return result;
    } catch (error) {
        console.error('Gamepass Helper: Error checking for valid gamepass:', error);
        return {
            success: false,
            isValid: false,
            error: error.message,
            message: 'Error checking for valid gamepass: ' + error.message,
            errorCode: 'API_ERROR'
        };
    }
}

/**
 * Get game URL for a specific game ID
 * @param {number} gameId - Roblox game ID
 * @returns {string} - Game URL
 */
function getGameUrl(gameId) {
    return `https://www.roblox.com/games/${gameId}`;
}

/**
 * Get URL to create a gamepass for a specific game
 * @param {number} gameId - Roblox game ID
 * @returns {string} - URL to create gamepass
 */
function getCreateGamepassUrl(gameId) {
    // Direct link to the game's gamepass creation page if possible
    // Otherwise, general gamepass creation page
    return `https://create.roblox.com/dashboard/creations?activeTab=GamePass`;
}

/**
 * Get map by ID
 * @param {number} mapId - Map ID
 * @returns {Object|null} - Map data or null if not found
 */
function getMapById(mapId) {
    return ROBLOX_MAPS.find(map => map.id === parseInt(mapId)) || null;
}

/**
 * Get all available maps
 * @returns {Array} - Array of map data
 */
function getAllMaps() {
    return ROBLOX_MAPS;
}

/**
 * Calculate the expected gamepass price for a given Robux amount
 * @param {number} robuxAmount - Amount of Robux being purchased
 * @returns {number} - Expected gamepass price (accounting for Roblox's 30% cut)
 */
function calculateExpectedGamepassPrice(robuxAmount) {
    // Formula: gamepassPrice = robuxAmount / 0.7 (since developer only gets 70%)
    return Math.round(robuxAmount / 0.7);
}

/**
 * Format a validation result for display
 * @param {Object} result - Validation result from API
 * @param {number} robuxAmount - Amount of Robux being purchased
 * @returns {Object} - Formatted result with HTML and styling
 */
function formatValidationResult(result, robuxAmount) {
    const expectedPrice = result.expectedPrice || calculateExpectedGamepassPrice(robuxAmount);
    
    let html = '';
    let backgroundColor = '';
    let textColor = '';
    let borderColor = '';
    
    if (!result.success) {
        // API error
        html = `
            <div style="text-align: center; padding: 15px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #856404; margin-bottom: 10px;"></i>
                <h4 style="margin-bottom: 10px;">Terjadi Kesalahan</h4>
                <p>${result.message || result.error || 'Tidak dapat memeriksa gamepass. Silakan coba lagi.'}</p>
                <button id="retry-validation-btn" class="btn btn-warning" style="margin-top: 15px; padding: 8px 15px; background-color: #ffc107; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-sync-alt"></i> Coba Lagi
                </button>
            </div>
        `;
        backgroundColor = '#FFF3CD';
        textColor = '#856404';
        borderColor = '#FFEEBA';
    } else if (result.isValid) {
        // Valid gamepass found
        html = `
            <div style="text-align: center; padding: 15px;">
                <i class="fas fa-check-circle" style="font-size: 24px; color: #155724; margin-bottom: 10px;"></i>
                <h4 style="margin-bottom: 10px;">Gamepass Valid</h4>
                <p>${result.message || `Gamepass valid ditemukan dengan harga ${result.gamepass.price} Robux.`}</p>
                <div style="margin-top: 15px; padding: 10px; background-color: rgba(0,0,0,0.05); border-radius: 8px;">
                    <p style="margin-bottom: 5px;"><strong>Nama:</strong> ${result.gamepass.name}</p>
                    <p style="margin-bottom: 5px;"><strong>Harga:</strong> ${result.gamepass.price} Robux</p>
                    <p style="margin-bottom: 0;"><strong>ID:</strong> ${result.gamepass.id}</p>
                </div>
                <p style="margin-top: 15px;">Anda dapat melanjutkan ke pembayaran.</p>
            </div>
        `;
        backgroundColor = '#D4EDDA';
        textColor = '#155724';
        borderColor = '#C3E6CB';
    } else {
        // No valid gamepass found
        let gamepassesHtml = '';
        
        if (result.availableGamepasses && result.availableGamepasses.length > 0) {
            gamepassesHtml = `
                <div style="margin-top: 15px; padding: 10px; background-color: rgba(0,0,0,0.05); border-radius: 8px; text-align: left;">
                    <p style="margin-bottom: 10px;"><strong>Gamepass yang tersedia:</strong></p>
                    <ul style="padding-left: 20px; margin-bottom: 0;">
                        ${result.availableGamepasses.map(gp => `<li>${gp.name} - ${gp.price} Robux</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        html = `
            <div style="text-align: center; padding: 15px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #856404; margin-bottom: 10px;"></i>
                <h4 style="margin-bottom: 10px;">Gamepass Tidak Ditemukan</h4>
                <p>${result.message || `Tidak ditemukan gamepass dengan harga sekitar ${expectedPrice} Robux.`}</p>
                <p style="margin-top: 10px;">Untuk pembelian ${robuxAmount} Robux, Anda perlu membuat gamepass dengan harga sekitar ${expectedPrice} Robux (±${Math.max(Math.round(expectedPrice * 0.15), 20)} Robux) karena potongan dari Roblox 30%.</p>
                ${gamepassesHtml}
                <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                    <a href="${getCreateGamepassUrl(result.placeId)}" target="_blank" class="btn btn-primary" style="padding: 8px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                        <i class="fas fa-plus-circle"></i> Buat Gamepass
                    </a>
                    <button id="retry-validation-btn" class="btn btn-warning" style="padding: 8px 15px; background-color: #ffc107; border: none; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-sync-alt"></i> Coba Lagi
                    </button>
                </div>
            </div>
        `;
        backgroundColor = '#FFF3CD';
        textColor = '#856404';
        borderColor = '#FFEEBA';
    }
    
    return {
        html,
        style: {
            backgroundColor,
            textColor,
            borderColor
        }
    };
}

// Export functions
window.RobloxGamepass = {
    extractGamepassId,
    validateGamepass,
    getGameUrl,
    getCreateGamepassUrl,
    getMapById,
    getAllMaps,
    calculateExpectedGamepassPrice,
    formatValidationResult
};

// Add keyframes for animations if they don't exist
(function() {
    if (!document.getElementById('gamepass-keyframes')) {
        const style = document.createElement('style');
        style.id = 'gamepass-keyframes';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
})();