const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Please use GET.'
    });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    // Make request to Roblox API
    const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch avatar data from Roblox');
    }
    
    return res.status(200).json({ 
      success: true, 
      data: data.data && data.data.length > 0 ? data.data[0] : null 
    });
  } catch (error) {
    console.error('Roblox API error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Error fetching avatar data from Roblox API'
    });
  }
};