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
    const { placeId, robuxAmount } = req.query;
    
    // Validate required parameters
    if (!placeId || !robuxAmount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: placeId, robuxAmount'
      });
    }

    // Convert parameters to appropriate types
    const gameId = parseInt(placeId);
    const robux = parseInt(robuxAmount);
    
    if (isNaN(gameId) || isNaN(robux)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameter types. All parameters must be numbers.'
      });
    }

    // Calculate the expected gamepass price (accounting for Roblox's 30% cut)
    // Formula: gamepassPrice = robuxAmount / 0.7 (since developer only gets 70%)
    const expectedGamepassPrice = Math.round(robux / 0.7);
    
    // Allow for a larger margin of error (±20 Robux or 15% of expected price, whichever is greater)
    const percentageMargin = Math.round(expectedGamepassPrice * 0.15); // 15% margin
    const fixedMargin = 20; // 20 Robux fixed margin
    const margin = Math.max(percentageMargin, fixedMargin);
    
    const minPrice = expectedGamepassPrice - margin;
    const maxPrice = expectedGamepassPrice + margin;
    
    console.log(`Checking for gamepass with price around ${expectedGamepassPrice} Robux (${minPrice}-${maxPrice}) for game ${gameId}`);
    
    // Step 1: Get all gamepasses for the game using Roblox API
    const gamepassesUrl = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100`;
    console.log(`Fetching gamepasses from: ${gamepassesUrl}`);
    
    const gamepassesResponse = await fetch(gamepassesUrl);
    
    if (!gamepassesResponse.ok) {
      const errorText = await gamepassesResponse.text();
      console.error(`Failed to fetch gamepasses: ${errorText}`);
      return res.status(404).json({
        success: false,
        error: `Failed to fetch gamepasses: ${errorText}`,
        errorCode: 'GAMEPASS_FETCH_FAILED'
      });
    }
    
    const gamepassesData = await gamepassesResponse.json();
    console.log(`Found ${gamepassesData.data ? gamepassesData.data.length : 0} gamepasses`);
    
    if (!gamepassesData.data || gamepassesData.data.length === 0) {
      return res.status(200).json({
        success: true,
        isValid: false,
        message: `⚠️ Gamepass tidak ditemukan. Silakan buat Gamepass dengan harga sekitar ${expectedGamepassPrice} Robux (±${Math.max(Math.round(expectedGamepassPrice * 0.15), 20)} Robux) sebelum melanjutkan!`,
        expectedPrice: expectedGamepassPrice,
        robuxAmount: robux,
        errorCode: 'NO_GAMEPASSES_FOUND'
      });
    }
    
    // Step 2: Find a gamepass with a price in the expected range
    let validGamepass = null;
    let closestGamepass = null;
    let smallestPriceDifference = Infinity;
    
    for (const gamepass of gamepassesData.data) {
      // Check if this gamepass is in the acceptable price range
      if (gamepass.price >= minPrice && gamepass.price <= maxPrice) {
        validGamepass = gamepass;
        break;
      }
      
      // Track the closest gamepass by price difference
      const priceDifference = Math.abs(gamepass.price - expectedGamepassPrice);
      if (priceDifference < smallestPriceDifference) {
        smallestPriceDifference = priceDifference;
        closestGamepass = gamepass;
      }
    }
    
    if (!validGamepass) {
      return res.status(200).json({
        success: true,
        isValid: false,
        message: `⚠️ Gamepass tidak ditemukan atau harganya tidak sesuai. Silakan buat Gamepass dengan harga sekitar ${expectedGamepassPrice} Robux (±${margin} Robux) sebelum melanjutkan!`,
        expectedPrice: expectedGamepassPrice,
        robuxAmount: robux,
        closestGamepass: closestGamepass ? {
          id: closestGamepass.id,
          name: closestGamepass.name,
          price: closestGamepass.price,
          priceDifference: smallestPriceDifference
        } : null,
        availableGamepasses: gamepassesData.data.map(gp => ({
          id: gp.id,
          name: gp.name,
          price: gp.price
        })),
        errorCode: 'NO_MATCHING_GAMEPASS'
      });
    }
    
    // Return the valid gamepass
    return res.status(200).json({
      success: true,
      isValid: true,
      gamepass: validGamepass,
      expectedPrice: expectedGamepassPrice,
      robuxAmount: robux,
      message: `✅ Gamepass valid ditemukan: "${validGamepass.name}" dengan harga ${validGamepass.price} Robux`
    });
    
  } catch (error) {
    console.error('Error checking gamepass:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'Error checking gamepass',
      errorCode: 'SERVER_ERROR'
    });
  }
};