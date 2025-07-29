/**
 * Form Validation for Game ID/Username
 * This script provides validation for game ID/username fields across all game pages
 * and displays attractive notifications when fields are empty
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const checkoutForm = document.getElementById('checkoutForm');
    const buyerNameInput = document.getElementById('buyerName');
    const serverIDInput = document.getElementById('serverID'); // Only exists on some pages (like MLBB)
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Add styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        #notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 350px;
        }
        
        .notification {
            background-color: #fff;
            color: #333;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            transform: translateX(120%);
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: hidden;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification.success {
            border-left: 4px solid #2ecc71;
        }
        
        .notification.warning {
            border-left: 4px solid #f39c12;
        }
        
        .notification-icon {
            margin-right: 15px;
            font-size: 24px;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .notification-message {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 16px;
            padding: 0 5px;
            margin-left: 10px;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: #333;
        }
        
        .notification-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.1);
        }
        
        .notification-progress-bar {
            height: 100%;
            width: 100%;
            transform-origin: left;
            animation: progress 5s linear forwards;
        }
        
        .notification.error .notification-progress-bar {
            background-color: #e74c3c;
        }
        
        .notification.success .notification-progress-bar {
            background-color: #2ecc71;
        }
        
        .notification.warning .notification-progress-bar {
            background-color: #f39c12;
        }
        
        @keyframes progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
        
        /* Dark mode support */
        body.dark-mode .notification {
            background-color: #2d3436;
            color: #f5f6fa;
        }
        
        body.dark-mode .notification-close {
            color: #bbb;
        }
        
        body.dark-mode .notification-close:hover {
            color: #fff;
        }
        
        /* Animation for shake effect */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake-input {
            animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
            border-color: #e74c3c !important;
            box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.25) !important;
        }
    `;
    document.head.appendChild(style);

    // Function to show notification
    function showNotification(type, title, message, duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let iconClass = '';
        switch(type) {
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                break;
            case 'success':
                iconClass = 'fas fa-check-circle';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                break;
            default:
                iconClass = 'fas fa-info-circle';
        }
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
            <div class="notification-progress">
                <div class="notification-progress-bar"></div>
            </div>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Set up close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400);
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 400);
            }
        }, duration);
        
        // Play sound effect
        try {
            const audio = new Audio('add-to-cart.mp3');
            audio.volume = 0.2;
            audio.play().catch(e => console.log('Audio play prevented:', e));
        } catch (e) {
            console.log('Audio play error:', e);
        }
        
        return notification;
    }

    // Function to check if current page is a game page
    function isGamePage() {
        const currentPath = window.location.pathname.toLowerCase();
        return currentPath.includes('pubg.html') ||
               currentPath.includes('mlbb.html') ||
               currentPath.includes('freefire.html') ||
               currentPath.includes('garden.html') ||
               currentPath.includes('roblox.html');
    }

    // Function to scroll to top of page
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Function to validate form fields
    function validateGameIDFields() {
        let isValid = true;
        let errorMessage = '';
        let errorTitle = '';
        
        // Check if buyerName (Game ID) is empty or too short
        if (!buyerNameInput || buyerNameInput.value.trim().length === 0) {
            // If field is completely empty, scroll to top of page only if on a game page
            if (isGamePage()) {
                scrollToTop();
            }
            isValid = false;
            
            // Get the game name from the page title or h1
            let gameName = document.querySelector('h1')?.textContent || 'Game';
            if (document.title) {
                const titleParts = document.title.split('–');
                if (titleParts.length > 0) {
                    gameName = titleParts[0].trim();
                }
            }
            
            errorTitle = `ID ${gameName} Diperlukan`;
            errorMessage = `Silakan masukkan ID ${gameName} Anda untuk melanjutkan pembelian. ID minimal terdiri dari 3 karakter.`;
            
            // Add shake animation to the input
            if (buyerNameInput) {
                buyerNameInput.classList.add('shake-input');
                buyerNameInput.focus();
                setTimeout(() => {
                    buyerNameInput.classList.remove('shake-input');
                }, 600);
            }
        } else if (buyerNameInput && buyerNameInput.value.trim().length < 3) {
            // If field has content but is too short
            isValid = false;
            
            // Get the game name from the page title or h1
            let gameName = document.querySelector('h1')?.textContent || 'Game';
            if (document.title) {
                const titleParts = document.title.split('–');
                if (titleParts.length > 0) {
                    gameName = titleParts[0].trim();
                }
            }
            
            errorTitle = `ID ${gameName} Terlalu Pendek`;
            errorMessage = `ID ${gameName} Anda terlalu pendek. ID minimal terdiri dari 3 karakter.`;
            
            // Add shake animation to the input
            buyerNameInput.classList.add('shake-input');
            buyerNameInput.focus();
            setTimeout(() => {
                buyerNameInput.classList.remove('shake-input');
            }, 600);
        }
        
        // Check if serverID is required and empty (for MLBB)
        if (serverIDInput && serverIDInput.value.trim() === '') {
            isValid = false;
            
            errorTitle = 'Server ID Diperlukan';
            errorMessage = 'Silakan masukkan Server ID Anda untuk melanjutkan pembelian Mobile Legends.';
            
            // Add shake animation to the input
            serverIDInput.classList.add('shake-input');
            if (!buyerNameInput || buyerNameInput.value.trim().length >= 3) {
                serverIDInput.focus();
            }
            setTimeout(() => {
                serverIDInput.classList.remove('shake-input');
            }, 600);
        }
        
        // Show notification if validation fails
        if (!isValid) {
            showNotification('error', errorTitle, errorMessage);
        }
        
        return isValid;
    }

    // Add event listener to checkout form
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            // Validate fields before submission
            if (!validateGameIDFields()) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Add event listeners to input fields for real-time validation
    if (buyerNameInput) {
        buyerNameInput.addEventListener('input', function() {
            if (this.value.trim().length < 3) {
                document.getElementById('buyerNameError').style.display = 'block';
            } else {
                document.getElementById('buyerNameError').style.display = 'none';
            }
            
            // Update checkout button state
            if (typeof updateCheckoutButtonState === 'function') {
                updateCheckoutButtonState();
            }
        });
        
        // Add blur event for validation when user leaves the field
        buyerNameInput.addEventListener('blur', function() {
            if (this.value.trim().length < 3) {
                validateGameIDFields();
            }
        });
    }

    if (serverIDInput) {
        serverIDInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                validateGameIDFields();
            }
        });
    }

    // Add validation check when clicking checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            if (!validateGameIDFields()) {
                e.preventDefault();
                return false;
            }
        });
    }

    // Direct approach for garden.html - wait for page to fully load
    setTimeout(() => {
        if (window.location.pathname.toLowerCase().includes('garden.html')) {
            console.log("Garden page detected, setting up notification");
            
            // Get the checkout button
            const checkoutBtn = document.getElementById('checkoutBtn');
            const buyerNameInput = document.getElementById('buyerName');
            
            if (checkoutBtn && buyerNameInput) {
                console.log("Garden page elements found");
                
                // Add a direct click event listener
                checkoutBtn.addEventListener('click', function(e) {
                    console.log("Garden checkout button clicked");
                    
                    // Check if the username field is empty
                    if (buyerNameInput.value.trim() === '') {
                        console.log("Empty username detected, showing notification");
                        
                        // Scroll to top
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        
                        // Show notification
                        showNotification('error', 'Username Diperlukan', 'Silakan masukkan Username Roblox Anda untuk melanjutkan pembelian.');
                        
                        // Add shake animation to the input
                        buyerNameInput.classList.add('shake-input');
                        buyerNameInput.focus();
                        setTimeout(() => {
                            buyerNameInput.classList.remove('shake-input');
                        }, 600);
                    }
                });
                
                // Also modify the form's submit event
                const gardenForm = document.getElementById('checkoutForm');
                if (gardenForm) {
                    gardenForm.addEventListener('submit', function(e) {
                        console.log("Garden form submitted");
                        
                        // Check if the username field is empty
                        if (buyerNameInput.value.trim() === '') {
                            console.log("Empty username detected on form submit, showing notification");
                            
                            // Scroll to top
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                            
                            // Show notification
                            showNotification('error', 'Username Diperlukan', 'Silakan masukkan Username Roblox Anda untuk melanjutkan pembelian.');
                            
                            // Add shake animation to the input
                            buyerNameInput.classList.add('shake-input');
                            buyerNameInput.focus();
                            setTimeout(() => {
                                buyerNameInput.classList.remove('shake-input');
                            }, 600);
                        }
                    });
                }
            }
        }
    }, 1000); // Wait 1 second for the page to fully load

    // Expose functions globally
    window.showGameNotification = showNotification;
    window.validateGameIDFields = validateGameIDFields;
});