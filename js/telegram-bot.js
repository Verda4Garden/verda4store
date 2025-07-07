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
        
        // Send message to Telegram via our serverless function
        const response = await fetch('/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                chatId: TELEGRAM_CONFIG.chatId
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            console.error('Failed to send message to Telegram:', result.error);
            return false;
        }
        
        console.log('Message sent to Telegram successfully');
        return true;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
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
        
        // Send message to Telegram via our serverless function
        const response = await fetch('/api/telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                chatId: TELEGRAM_CONFIG.chatId
            })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            console.error('Failed to send payment confirmation to Telegram:', result.error);
            return false;
        }
        
        console.log('Payment confirmation sent to Telegram successfully');
        return true;
    } catch (error) {
        console.error('Error sending payment confirmation to Telegram:', error);
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


// Export functions
window.sendOrderToTelegram = sendOrderToTelegram;
window.sendPaymentConfirmationToTelegram = sendPaymentConfirmationToTelegram;