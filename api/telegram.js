export default async function handler(req, res) {
  // Hanya terima request POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatId } = req.body;
    
    // Gunakan token bot dari environment variable
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    // Jika chatId tidak disediakan, gunakan default dari environment variable
    const telegramChatId = chatId || process.env.TELEGRAM_CHAT_ID;
    
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
    
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Telegram API error:', error);
    return res.status(500).json({ error: error.message });
  }
}