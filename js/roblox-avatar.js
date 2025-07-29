/**
 * Roblox Avatar Integration
 * This script handles fetching and displaying Roblox avatars
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Roblox Avatar Integration: Initializing...');
    
    // Initialize the avatar functionality
    initRobloxAvatarIntegration();
});

/**
 * Initialize the Roblox avatar integration
 */
function initRobloxAvatarIntegration() {
    // Find the username input
    const usernameInput = document.getElementById('buyerName');
    if (!usernameInput) {
        console.error('Roblox Avatar Integration: Username input not found');
        return;
    }
    
    console.log('Roblox Avatar Integration: Username input found');
    
    // Create the avatar button
    const avatarButton = document.createElement('button');
    avatarButton.type = 'button';
    avatarButton.id = 'viewAvatarBtn';
    avatarButton.className = 'view-avatar-btn';
    avatarButton.innerHTML = '<i class="fas fa-user"></i> Lihat Avatar';
    
    // Find the parent container for the input
    const inputParent = usernameInput.parentNode;
    if (!inputParent) {
        console.error('Roblox Avatar Integration: Username input parent not found');
        return;
    }
    
    // Create a container for the input and button
    const inputContainer = document.createElement('div');
    inputContainer.className = 'username-avatar-container';
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '10px';
    inputContainer.style.marginBottom = '10px';
    inputContainer.style.width = '100%';
    
    // Clone the input to preserve any existing event listeners
    const clonedInput = usernameInput.cloneNode(true);
    
    // Replace the original input with our container
    inputParent.replaceChild(inputContainer, usernameInput);
    
    // Add the cloned input and button to the container
    inputContainer.appendChild(clonedInput);
    inputContainer.appendChild(avatarButton);
    
    // Create or find the avatar container
    let avatarContainer = document.getElementById('roblox-avatar-container');
    if (!avatarContainer) {
        avatarContainer = document.createElement('div');
        avatarContainer.id = 'roblox-avatar-container';
        avatarContainer.className = 'roblox-avatar-container';
        avatarContainer.style.display = 'none'; // Hidden by default
        
        // Add the avatar container after the input container
        inputContainer.parentNode.insertBefore(avatarContainer, inputContainer.nextSibling);
    }
    
    // Add click event to the avatar button
    avatarButton.addEventListener('click', function() {
        const username = clonedInput.value.trim();
        if (username.length < 3) {
            showAvatarMessage('error', 'Username minimal 3 karakter.');
            return;
        }
        
        // Show loading message
        showAvatarMessage('info', 'Mencari pengguna Roblox...');
        
        // Fetch and display the avatar
        fetchAndDisplayAvatar(username);
    });
    
    console.log('Roblox Avatar Integration: Setup complete');
}

/**
 * Fetch and display the Roblox avatar
 * @param {string} username - Roblox username
 */
async function fetchAndDisplayAvatar(username) {
    console.log('Roblox Avatar Integration: Fetching avatar for', username);
    
    try {
        // Step 1: Get userId from username
        const userId = await fetchRobloxUserId(username);
        if (!userId) {
            showAvatarMessage('error', 'Username tidak ditemukan.');
            return;
        }
        
        console.log('Roblox Avatar Integration: User ID found:', userId);
        
        // Step 2: Get avatar URL using userId
        const avatarUrl = await fetchRobloxAvatar(userId);
        if (!avatarUrl) {
            showAvatarMessage('error', 'Tidak dapat mengambil avatar.');
            return;
        }
        
        console.log('Roblox Avatar Integration: Avatar URL found:', avatarUrl);
        
        // Step 3: Display the avatar
        displayAvatar(username, userId, avatarUrl);
        
        // Show success message
        showAvatarMessage('success', 'Avatar berhasil dimuat.');
    } catch (error) {
        console.error('Roblox Avatar Integration: Error fetching avatar:', error);
        showAvatarMessage('error', 'Terjadi kesalahan: ' + error.message);
    }
}

/**
 * Fetch Roblox user ID from username
 * @param {string} username - Roblox username
 * @returns {Promise<number|null>} - User ID or null if not found
 */
async function fetchRobloxUserId(username) {
    try {
        const response = await fetch('https://users.roblox.com/v1/usernames/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usernames: [username]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Roblox Avatar Integration: User data:', data);
        
        if (data.data && data.data.length > 0) {
            return data.data[0].id;
        }
        
        return null;
    } catch (error) {
        console.error('Roblox Avatar Integration: Error fetching user ID:', error);
        throw error;
    }
}

/**
 * Fetch Roblox avatar URL using user ID
 * @param {number} userId - Roblox user ID
 * @returns {Promise<string|null>} - Avatar URL or null if not found
 */
async function fetchRobloxAvatar(userId) {
    try {
        const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Roblox Avatar Integration: Avatar data:', data);
        
        if (data.data && data.data.length > 0) {
            return data.data[0].imageUrl;
        }
        
        return null;
    } catch (error) {
        console.error('Roblox Avatar Integration: Error fetching avatar:', error);
        throw error;
    }
}

/**
 * Display the avatar in the container
 * @param {string} username - Roblox username
 * @param {number} userId - Roblox user ID
 * @param {string} avatarUrl - Avatar image URL
 */
function displayAvatar(username, userId, avatarUrl) {
    const avatarContainer = document.getElementById('roblox-avatar-container');
    if (!avatarContainer) {
        console.error('Roblox Avatar Integration: Avatar container not found');
        return;
    }
    
    // Show the container
    avatarContainer.style.display = 'flex';
    
    // Set the container content
    avatarContainer.innerHTML = `
        <div class="avatar-image-container">
            <img 
                src="${avatarUrl}" 
                alt="${username}'s Avatar" 
                class="roblox-avatar"
                onerror="this.onerror=null; this.src='https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png';"
            />
        </div>
        <div class="roblox-username">${username}</div>
        <div class="roblox-userid">ID: ${userId}</div>
    `;
    
    // Add animation
    const avatarImage = avatarContainer.querySelector('.roblox-avatar');
    if (avatarImage) {
        avatarImage.style.animation = 'fadeIn 0.5s ease-in-out';
    }
    
    console.log('Roblox Avatar Integration: Avatar displayed successfully');
}

/**
 * Show a message in the avatar container
 * @param {string} type - Message type (success, error, info)
 * @param {string} message - Message text
 */
function showAvatarMessage(type, message) {
    const avatarContainer = document.getElementById('roblox-avatar-container');
    if (!avatarContainer) {
        console.error('Roblox Avatar Integration: Avatar container not found');
        return;
    }
    
    // Show the container
    avatarContainer.style.display = 'flex';
    
    // Set message class based on type
    let messageClass = '';
    switch (type) {
        case 'success':
            messageClass = 'success-message';
            break;
        case 'error':
            messageClass = 'warning-message';
            break;
        case 'info':
        default:
            messageClass = 'info-message';
            break;
    }
    
    // Set the container content
    avatarContainer.innerHTML = `
        <div class="${messageClass}" style="width: 100%; text-align: center;">
            ${message}
        </div>
    `;
    
    console.log(`Roblox Avatar Integration: Showing ${type} message: ${message}`);
}

// Add CSS for the avatar button and animations
(function() {
    // Create style element if it doesn't exist
    let style = document.getElementById('roblox-avatar-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'roblox-avatar-styles';
        style.textContent = `
            .view-avatar-btn {
                padding: 8px 15px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
            }
            
            .view-avatar-btn:hover {
                background-color: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .view-avatar-btn:active {
                transform: translateY(0);
            }
            
            .avatar-image-container {
                margin-bottom: 10px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        
        // Add style to document
        document.head.appendChild(style);
        console.log('Roblox Avatar Integration: Added CSS styles');
    }
})();