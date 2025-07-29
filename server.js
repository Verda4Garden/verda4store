const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('./'));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// API endpoint for Roblox user
app.post('/api/roblox-user', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }
    
    // Make request to Roblox API
    const response = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernames: [username]
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user data from Roblox');
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
      details: 'Error fetching data from Roblox API'
    });
  }
});

// API endpoint for Roblox profile
app.get('/api/roblox-profile', async (req, res) => {
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
});

// API endpoint for Roblox avatar
app.get('/api/roblox-avatar', async (req, res) => {
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
});

// API endpoint for checking Roblox gamepass
app.get('/api/check-gamepass', async (req, res) => {
  try {
    const { id, expectedGameId, expectedUserId, expectedPrice } = req.query;
    
    // Validate required parameters
    if (!id || !expectedGameId || !expectedUserId || !expectedPrice) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: id, expectedGameId, expectedUserId, expectedPrice'
      });
    }

    // Convert parameters to appropriate types
    const gamepassId = parseInt(id);
    const gameId = parseInt(expectedGameId);
    const userId = parseInt(expectedUserId);
    const price = parseInt(expectedPrice);
    
    if (isNaN(gamepassId) || isNaN(gameId) || isNaN(userId) || isNaN(price)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameter types. All parameters must be numbers.'
      });
    }

    // Step 1: Get gamepass details to check creator and game
    const gamepassResponse = await fetch(`https://apis.roblox.com/game-passes/v1/game-passes/${gamepassId}`);
    
    if (!gamepassResponse.ok) {
      return res.status(404).json({
        success: false,
        error: `Gamepass not found: ${await gamepassResponse.text()}`
      });
    }
    
    const gamepassData = await gamepassResponse.json();
    const creatorId = gamepassData.creatorId;
    const actualGameId = gamepassData.gameId;
    
    // Step 2: Get product info to check price
    const productResponse = await fetch(`https://economy.roblox.com/v1/game-passes/${gamepassId}/product-info`);
    
    if (!productResponse.ok) {
      return res.status(404).json({
        success: false,
        error: `Product info not found: ${await productResponse.text()}`
      });
    }
    
    const productData = await productResponse.json();
    const actualPrice = productData.PriceInRobux || 0;
    
    // Step 3: Validate all conditions
    const validations = {
      creator: {
        valid: creatorId === userId,
        expected: userId,
        actual: creatorId
      },
      game: {
        valid: actualGameId === gameId,
        expected: gameId,
        actual: actualGameId
      },
      price: {
        valid: actualPrice === price,
        expected: price,
        actual: actualPrice
      }
    };
    
    const isValid = validations.creator.valid &&
                    validations.game.valid &&
                    validations.price.valid;
    
    // Return validation results
    return res.status(200).json({
      success: true,
      isValid: isValid,
      gamepassId: gamepassId,
      validations: validations,
      message: isValid
        ? 'Gamepass is valid'
        : 'Gamepass validation failed. Please check the details below.'
    });
    
  } catch (error) {
    console.error('Error checking gamepass:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Error checking gamepass'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`API endpoints available at:`);
  console.log(`- POST /api/roblox-user`);
  console.log(`- GET /api/roblox-profile?username=<username>`);
  console.log(`- GET /api/roblox-avatar?userId=<userId>`);
  console.log(`- GET /api/check-gamepass?id=<gamepassId>&expectedGameId=<gameId>&expectedUserId=<userId>&expectedPrice=<price>`);
});