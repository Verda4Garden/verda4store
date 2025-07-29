export default async function handler(req, res) {
  // Hanya terima request POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatId, botToken: requestBotToken } = req.body;
    
    // Gunakan token bot dari request atau environment variable
    const botToken = requestBotToken || process.env.TELEGRAM_BOT_TOKEN;
    
    // Jika chatId tidak disediakan, gunakan default dari environment variable
    const telegramChatId = chatId || process.env.TELEGRAM_CHAT_ID;
    
    // Validasi token dan chat ID
    if (!botToken) {
      return res.status(400).json({
        success: false,
        error: 'Bot token is required. Please provide it in the request or set the TELEGRAM_BOT_TOKEN environment variable.'
      });
    }
    
    if (!telegramChatId) {
      return res.status(400).json({
        success: false,
        error: 'Chat ID is required. Please provide it in the request or set the TELEGRAM_CHAT_ID environment variable.'
      });
    }
    
    // Kirim pesan ke Telegram
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'Failed to send message to Telegram');
    }
    
    console.log('Telegram message sent successfully:', data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Telegram API error:', error);
    
    // Log more detailed error information
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || 'No additional error details available'
    });
  }
}