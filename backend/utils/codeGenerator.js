const Share = require('../models/Share');

/**
 * Generate a unique 4-digit code
 * @returns {Promise<string>} A unique 4-digit code
 */
const generateUniqueCode = async () => {
  let code;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 100;

  while (exists && attempts < maxAttempts) {
    // Generate random 4-digit code (1000-9999)
    code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Check if code already exists
    const existing = await Share.findOne({ code });
    exists = !!existing;
    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique code. Please try again.');
  }

  return code;
};

module.exports = { generateUniqueCode };
