export default async function handler(req, res) {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }
    
    // Make request to Roblox profile page
    const response = await fetch(`https://www.roblox.com/users/profile?username=${encodeURIComponent(username)}`, {
      redirect: 'manual' // Don't follow redirects, we want to see the redirect URL
    });
    
    // Check if we got a redirect (302 Found)
    if (response.status === 302) {
      const location = response.headers.get('location');
      
      // Try to extract user ID from the redirect URL
      if (location && location.includes('/users/')) {
        const urlParts = location.split('/');
        const userIdIndex = urlParts.indexOf('users') + 1;
        
        if (userIdIndex < urlParts.length) {
          const possibleId = parseInt(urlParts[userIdIndex]);
          
          if (!isNaN(possibleId)) {
            return res.status(200).json({
              success: true,
              data: {
                id: possibleId,
                name: username
              }
            });
          }
        }
      }
      
      // If we couldn't extract the ID, return the redirect URL
      return res.status(200).json({
        success: true,
        redirect: location,
        message: 'Redirect URL returned, but could not extract user ID'
      });
    }
    
    // If not a redirect, try to parse the response
    const text = await response.text();
    
    // Return error as we expected a redirect
    return res.status(200).json({
      success: false,
      status: response.status,
      message: 'Expected a redirect but got a different response'
    });
  } catch (error) {
    console.error('Roblox profile API error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Error fetching profile data from Roblox'
    });
  }
}