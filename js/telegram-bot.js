/**
 * Telegram Bot Integration
 * This script handles sending order notifications to a Telegram bot
 *
 * === CARA MEMBUAT BOT TELEGRAM ===
 * 1. Buka aplikasi Telegram dan cari @BotFather
 * 2. Kirim pesan /start ke BotFather
 * 3. Kirim pesan /newbot untuk membuat bot baru
 * 4. Ikuti instruksi untuk memberi nama dan username untuk bot Anda
 * 5. BotFather akan memberikan token API bot Anda (contoh: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ)
 * 6. Salin token tersebut dan ganti "YOUR_BOT_TOKEN" di bawah ini
 *
 * === CARA MENDAPATKAN CHAT ID ===
 * 1. Buka bot yang sudah dibuat
 * 2. Kirim pesan ke bot Anda
 * 3. Buka URL: https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates
 *    (ganti [YOUR_BOT_TOKEN] dengan token bot Anda)
 * 4. Cari nilai "chat":{"id": di respons JSON
 * 5. Salin ID tersebut dan ganti "YOUR_CHAT_ID" di bawah ini
 */

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    botToken: "7985620779:AAE7RJ2twsG6r4SgOXQsMFKH5zsOnKwIPMQ", // Bot token
    chatId: "-4696626660"      // Group Chat ID
};

/**
 * Send order notification to Telegram bot
 * @param {Object} orderData - Order data to send
 * @returns {Promise} - Promise that resolves when message is sent
 */
async function sendOrderToTelegram(orderData) {
    try {
        // Format message for Telegram
        const message = formatTelegramMessage(orderData);
        
        // Determine if we're in a local environment or deployed
        const isLocal = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.protocol === 'file:';
        
        let response;
        
        if (isLocal) {
            // If running locally, call Telegram API directly
            console.log('Running in local environment, calling Telegram API directly');
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            return {
                success: data.ok,
                data: data,
                error: data.ok ? null : data.description
            };
        } else {
            // If deployed, use the serverless function
            console.log('Running in deployed environment, using serverless function');
            response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    chatId: TELEGRAM_CONFIG.chatId,
                    botToken: TELEGRAM_CONFIG.botToken // Pass the bot token to the serverless function
                })
            });
        }
        
        let result;
        
        // If we're in a local environment, we've already processed the response
        if (isLocal) {
            result = response;
        } else {
            // Otherwise, parse the response from the serverless function
            try {
                result = await response.json();
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                console.error('Response status:', response.status);
                console.error('Response text:', await response.text());
                
                return false;
            }
        }
        
        if (!result.success) {
            console.error('Failed to send message to Telegram:', result.error);
            console.error('Error details:', result.details || 'No details available');
            
            // Display error in console for debugging
            console.group('Telegram Error Details');
            console.error('Status:', response.status);
            console.error('Error:', result.error);
            console.error('Details:', result.details || 'None');
            console.groupEnd();
            
            return false;
        }
        
        console.log('Message sent to Telegram successfully');
        return true;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        
        // Display more detailed error information
        console.group('Telegram Request Error');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.groupEnd();
        
        return false;
    }
}

/**
 * Format order data for Telegram message
 * @param {Object} orderData - Order data to format
 * @returns {String} - Formatted message
 */
function formatTelegramMessage(orderData) {
    // Get game name from invoice prefix
    let gameName = "Game";
    if (orderData.invoiceId.startsWith("PUBG-")) {
        gameName = "PUBG Mobile";
    } else if (orderData.invoiceId.startsWith("MLBB-")) {
        gameName = "Mobile Legends";
    } else if (orderData.invoiceId.startsWith("FF-")) {
        gameName = "Free Fire";
    } else if (orderData.invoiceId.startsWith("ROBLOX-")) {
        gameName = "Roblox";
    }
    
    // Format message with HTML formatting
    let message = `<b>🎮 New Order: ${gameName}</b>\n\n`;
    message += `<b>📋 Invoice ID:</b> ${orderData.invoiceId}\n`;
    message += `<b>👤 Player ID:</b> ${orderData.buyerName}\n`;
    
    // Add product details
    message += `\n<b>🛒 Order Details:</b>\n`;
    orderData.cart.forEach(item => {
        message += `- ${item.name}: Rp ${item.price.toLocaleString('id-ID')}\n`;
    });
    
    // Add discount if applicable
    if (orderData.discount > 0) {
        message += `\n<b>🏷️ Discount:</b> -Rp ${orderData.discount.toLocaleString('id-ID')}`;
        if (orderData.promoCode) {
            message += ` (${orderData.promoCode})`;
        }
        message += `\n`;
    }
    
    // Add total and payment method
    message += `<b>💰 Total:</b> Rp ${orderData.total.toLocaleString('id-ID')}\n`;
    message += `<b>💳 Payment Method:</b> ${orderData.paymentMethod}\n`;
    message += `<b>🕒 Date:</b> ${orderData.date}\n`;
    
    return message;
}

/**
 * Send payment confirmation to Telegram bot
 * @param {Object} paymentData - Payment confirmation data
 * @returns {Promise} - Promise that resolves when message is sent
 */
async function sendPaymentConfirmationToTelegram(paymentData) {
    try {
        // Format message for Telegram
        const message = formatPaymentConfirmationMessage(paymentData);
        
        // Determine if we're in a local environment or deployed
        const isLocal = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.protocol === 'file:';
        
        let response;
        
        if (isLocal) {
            // If running locally, call Telegram API directly
            console.log('Running in local environment, calling Telegram API directly');
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            return {
                success: data.ok,
                data: data,
                error: data.ok ? null : data.description
            };
        } else {
            // If deployed, use the serverless function
            console.log('Running in deployed environment, using serverless function');
            response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    chatId: TELEGRAM_CONFIG.chatId,
                    botToken: TELEGRAM_CONFIG.botToken // Pass the bot token to the serverless function
                })
            });
        }
        
        let result;
        
        // If we're in a local environment, we've already processed the response
        if (isLocal) {
            result = response;
        } else {
            // Otherwise, parse the response from the serverless function
            try {
                result = await response.json();
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                console.error('Response status:', response.status);
                console.error('Response text:', await response.text());
                
                return false;
            }
        }
        
        if (!result.success) {
            console.error('Failed to send payment confirmation to Telegram:', result.error);
            console.error('Error details:', result.details || 'No details available');
            
            // Display error in console for debugging
            console.group('Telegram Error Details');
            console.error('Status:', response.status);
            console.error('Error:', result.error);
            console.error('Details:', result.details || 'None');
            console.groupEnd();
            
            return false;
        }
        
        console.log('Payment confirmation sent to Telegram successfully');
        return true;
    } catch (error) {
        console.error('Error sending payment confirmation to Telegram:', error);
        
        // Display more detailed error information
        console.group('Telegram Request Error');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.groupEnd();
        
        return false;
    }
}

/**
 * Format payment confirmation data for Telegram message
 * @param {Object} paymentData - Payment confirmation data
 * @returns {String} - Formatted message
 */
function formatPaymentConfirmationMessage(paymentData) {
    // Get game name from invoice prefix
    let gameName = "Game";
    if (paymentData.invoiceId.startsWith("PUBG-")) {
        gameName = "PUBG Mobile";
    } else if (paymentData.invoiceId.startsWith("MLBB-")) {
        gameName = "Mobile Legends";
    } else if (paymentData.invoiceId.startsWith("FF-")) {
        gameName = "Free Fire";
    } else if (paymentData.invoiceId.startsWith("ROBLOX-")) {
        gameName = "Roblox";
    }
    
    // Format message with HTML formatting
    let message = `<b>💰 Konfirmasi Pembayaran: ${gameName}</b>\n\n`;
    message += `<b>📋 Invoice ID:</b> ${paymentData.invoiceId}\n`;
    message += `<b>👤 Player ID:</b> ${paymentData.buyerName}\n`;
    message += `<b>💳 Metode Pembayaran:</b> ${paymentData.paymentMethod}\n`;
    message += `<b>💰 Total:</b> Rp ${paymentData.amount.toLocaleString('id-ID')}\n`;
    message += `<b>🕒 Tanggal Pembayaran:</b> ${paymentData.paymentDate}\n`;
    
    if (paymentData.notes) {
        message += `\n<b>📝 Catatan:</b> ${paymentData.notes}\n`;
    }
    
    return message;
}

/**
 * Send fulfillment notification to Telegram bot
 * @param {Object} fulfillmentData - Fulfillment data
 * @returns {Promise} - Promise that resolves when message is sent
 */
async function sendFulfillmentToTelegram(fulfillmentData) {
    try {
        // Format message for Telegram
        const message = formatFulfillmentMessage(fulfillmentData);
        
        // Determine if we're in a local environment or deployed
        const isLocal = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.protocol === 'file:';
        
        let response;
        
        if (isLocal) {
            // If running locally, call Telegram API directly
            console.log('Running in local environment, calling Telegram API directly');
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            return {
                success: data.ok,
                data: data,
                error: data.ok ? null : data.description
            };
        } else {
            // If deployed, use the serverless function
            console.log('Running in deployed environment, using serverless function');
            response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    chatId: TELEGRAM_CONFIG.chatId,
                    botToken: TELEGRAM_CONFIG.botToken // Pass the bot token to the serverless function
                })
            });
        }
        
        let result;
        
        // If we're in a local environment, we've already processed the response
        if (isLocal) {
            result = response;
        } else {
            // Otherwise, parse the response from the serverless function
            try {
                result = await response.json();
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                console.error('Response status:', response.status);
                console.error('Response text:', await response.text());
                
                return false;
            }
        }
        
        if (!result.success) {
            console.error('Failed to send fulfillment notification to Telegram:', result.error);
            console.error('Error details:', result.details || 'No details available');
            
            // Display error in console for debugging
            console.group('Telegram Error Details');
            console.error('Status:', response.status);
            console.error('Error:', result.error);
            console.error('Details:', result.details || 'None');
            console.groupEnd();
            
            return false;
        }
        
        console.log('Fulfillment notification sent to Telegram successfully');
        return true;
    } catch (error) {
        console.error('Error sending fulfillment notification to Telegram:', error);
        
        // Display more detailed error information
        console.group('Telegram Request Error');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.groupEnd();
        
        return false;
    }
}

/**
 * Format fulfillment data for Telegram message
 * @param {Object} fulfillmentData - Fulfillment data
 * @returns {String} - Formatted message
 */
function formatFulfillmentMessage(fulfillmentData) {
    // Get game name from invoice prefix
    let gameName = "Game";
    if (fulfillmentData.invoiceId.startsWith("PUBG-")) {
        gameName = "PUBG Mobile";
    } else if (fulfillmentData.invoiceId.startsWith("MLBB-")) {
        gameName = "Mobile Legends";
    } else if (fulfillmentData.invoiceId.startsWith("FF-")) {
        gameName = "Free Fire";
    } else if (fulfillmentData.invoiceId.startsWith("ROBLOX-")) {
        gameName = "Roblox";
    }
    
    // Format message with HTML formatting
    let message = `<b>✅ Pesanan Terkirim: ${gameName}</b>\n\n`;
    message += `<b>📋 Invoice ID:</b> ${fulfillmentData.invoiceId}\n`;
    message += `<b>👤 Player ID:</b> ${fulfillmentData.buyerName}\n`;
    message += `<b>💰 Total:</b> Rp ${fulfillmentData.amount.toLocaleString('id-ID')}\n`;
    message += `<b>🕒 Tanggal Pengiriman:</b> ${fulfillmentData.fulfillmentDate}\n`;
    
    if (fulfillmentData.notes) {
        message += `\n<b>📝 Catatan:</b> ${fulfillmentData.notes}\n`;
    }
    
    return message;
}


/**
 * Send diamond status update to Telegram bot
 * @param {Object} statusData - Status data to send
 * @returns {Promise<boolean>} - Whether the message was sent successfully
 */
async function sendDiamondStatusToTelegram(statusData) {
    try {
        // Format message for Telegram
        const message = formatDiamondStatusMessage(statusData);
        
        // Determine if we're in a local environment or deployed
        const isLocal = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.protocol === 'file:';
        
        let response;
        
        if (isLocal) {
            // If running locally, call Telegram API directly
            console.log('Running in local environment, calling Telegram API directly');
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const data = await response.json();
            return {
                success: data.ok,
                data: data,
                error: data.ok ? null : data.description
            };
        } else {
            // If deployed, use the serverless function
            console.log('Running in deployed environment, using serverless function');
            response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    chatId: TELEGRAM_CONFIG.chatId,
                    botToken: TELEGRAM_CONFIG.botToken // Pass the bot token to the serverless function
                })
            });
        }
        
        let result;
        
        // If we're in a local environment, we've already processed the response
        if (isLocal) {
            result = response;
        } else {
            // Otherwise, parse the response from the serverless function
            try {
                result = await response.json();
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                console.error('Response status:', response.status);
                console.error('Response text:', await response.text());
                
                return false;
            }
        }
        
        if (!result.success) {
            console.error('Failed to send diamond status to Telegram:', result.error);
            console.error('Error details:', result.details || 'No details available');
            
            // Display error in console for debugging
            console.group('Telegram Error Details');
            console.error('Status:', response.status);
            console.error('Error:', result.error);
            console.error('Details:', result.details || 'None');
            console.groupEnd();
            
            return false;
        }
        
        console.log('Diamond status sent to Telegram successfully');
        return true;
    } catch (error) {
        console.error('Error sending diamond status to Telegram:', error);
        
        // Display more detailed error information
        console.group('Telegram Request Error');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.groupEnd();
        
        return false;
    }
}

/**
 * Format diamond status data for Telegram message
 * @param {Object} statusData - Status data
 * @returns {String} - Formatted message
 */
function formatDiamondStatusMessage(statusData) {
    // Get game name from invoice prefix
    let gameName = "Game";
    if (statusData.invoiceId.startsWith("PUBG-")) {
        gameName = "PUBG Mobile";
    } else if (statusData.invoiceId.startsWith("MLBB-")) {
        gameName = "Mobile Legends";
    } else if (statusData.invoiceId.startsWith("FF-")) {
        gameName = "Free Fire";
    } else if (statusData.invoiceId.startsWith("ROBLOX-")) {
        gameName = "Roblox";
    }
    
    // Format message with HTML formatting
    let message = '';
    
    if (statusData.status === 'processing') {
        message = `<b>⏳ Diamond Sedang Diproses: ${gameName}</b>\n\n`;
    } else if (statusData.status === 'completed') {
        message = `<b>✅ Diamond Sudah Dikirim: ${gameName}</b>\n\n`;
    }
    
    message += `<b>📋 Invoice ID:</b> ${statusData.invoiceId}\n`;
    message += `<b>👤 Player ID:</b> ${statusData.playerName}\n`;
    message += `<b>💎 Jumlah Diamond:</b> ${statusData.diamondAmount}\n`;
    message += `<b>💰 Total:</b> Rp ${statusData.amount.toLocaleString('id-ID')}\n`;
    message += `<b>🕒 Waktu:</b> ${statusData.timestamp}\n`;
    
    if (statusData.notes) {
        message += `\n<b>📝 Catatan:</b> ${statusData.notes}\n`;
    }
    
    return message;
}

/**
 * Test function to check Telegram bot integration
 * This function can be called from the browser console to test the bot
 */
async function testTelegramBot() {
    try {
        console.log('Testing Telegram bot integration...');
        console.log('Bot Token:', TELEGRAM_CONFIG.botToken);
        console.log('Chat ID:', TELEGRAM_CONFIG.chatId);
        
        // Determine if we're in a local environment or deployed
        const isLocal = window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1' ||
                        window.location.protocol === 'file:';
        
        console.log('Environment:', isLocal ? 'Local' : 'Deployed');
        
        // Create a test message
        const testMessage = `<b>🧪 Test Message</b>\n\nThis is a test message sent at ${new Date().toLocaleString()}`;
        
        let response;
        
        if (isLocal) {
            // If running locally, call Telegram API directly
            console.log('Calling Telegram API directly...');
            response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CONFIG.chatId,
                    text: testMessage,
                    parse_mode: 'HTML'
                })
            });
            
            // Log the raw response
            console.log('Raw response:', response);
            
            // Parse the response
            const data = await response.json();
            console.log('Response JSON:', data);
            
            if (!data.ok) {
                console.error('Test failed:', data.description);
                alert(`Telegram test failed: ${data.description}`);
                return false;
            }
            
            console.log('Test successful!', data);
            alert('Telegram test message sent successfully!');
            return true;
        } else {
            // If deployed, use the serverless function
            console.log('Using serverless function...');
            response = await fetch('/api/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: testMessage,
                    chatId: TELEGRAM_CONFIG.chatId,
                    botToken: TELEGRAM_CONFIG.botToken
                })
            });
            
            // Log the raw response
            console.log('Raw response:', response);
            
            try {
                // Parse the response
                const result = await response.json();
                console.log('Response JSON:', result);
                
                if (!result.success) {
                    console.error('Test failed:', result.error);
                    alert(`Telegram test failed: ${result.error}`);
                    return false;
                }
                
                console.log('Test successful!', result);
                alert('Telegram test message sent successfully!');
                return true;
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                console.error('Response status:', response.status);
                const responseText = await response.text();
                console.error('Response text:', responseText);
                alert(`Error parsing response: ${parseError.message}\nResponse: ${responseText}`);
                return false;
            }
        }
    } catch (error) {
        console.error('Error testing Telegram bot:', error);
        alert(`Error testing Telegram bot: ${error.message}`);
        return false;
    }
}

// Export functions
window.sendOrderToTelegram = sendOrderToTelegram;
window.sendPaymentConfirmationToTelegram = sendPaymentConfirmationToTelegram;
window.sendFulfillmentToTelegram = sendFulfillmentToTelegram;
window.sendDiamondStatusToTelegram = sendDiamondStatusToTelegram; // Export diamond status function
window.testTelegramBot = testTelegramBot; // Export test function