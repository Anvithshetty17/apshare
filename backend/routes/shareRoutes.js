const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const Share = require('../models/Share');
const upload = require('../middleware/upload');
const { generateUniqueCode } = require('../utils/codeGenerator');

/**
 * POST /api/upload
 * Upload a file and get a 4-digit code
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Generate unique code
    const code = await generateUniqueCode();

    // Create share entry
    const share = new Share({
      code,
      type: 'file',
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    await share.save();

    res.status(201).json({
      success: true,
      code,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if database save fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload file',
      error: error.message 
    });
  }
});

/**
 * GET /api/download/:code
 * Download file by 4-digit code
 */
router.get('/download/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!/^\d{4}$/.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid code format. Code must be 4 digits.' 
      });
    }

    // Find share by code
    const share = await Share.findOne({ code, type: 'file' });

    if (!share) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found or code expired' 
      });
    }

    // Check if file exists
    const filePath = path.join(__dirname, '..', 'uploads', share.storedName);
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found on server' 
      });
    }

    // Mark as downloaded
    share.downloaded = true;
    await share.save();

    // Send file
    res.download(filePath, share.originalName, async (err) => {
      if (err) {
        console.error('Download error:', err);
      } else {
        // Optional: Delete file after successful download
        try {
          await fs.unlink(filePath);
          await Share.deleteOne({ _id: share._id });
          console.log(`File ${share.storedName} deleted after download`);
        } catch (deleteError) {
          console.error('Error deleting file after download:', deleteError);
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download file',
      error: error.message 
    });
  }
});

/**
 * POST /api/share-text
 * Share text and get a 4-digit code
 */
router.post('/share-text', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text is required and cannot be empty' 
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Text is too long. Maximum 10000 characters allowed.' 
      });
    }

    // Generate unique code
    const code = await generateUniqueCode();

    // Create share entry
    const share = new Share({
      code,
      type: 'text',
      text: text.trim()
    });

    await share.save();

    res.status(201).json({
      success: true,
      code,
      message: 'Text shared successfully'
    });
  } catch (error) {
    console.error('Share text error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to share text',
      error: error.message 
    });
  }
});

/**
 * GET /api/text/:code
 * Retrieve text by 4-digit code
 */
router.get('/text/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!/^\d{4}$/.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid code format. Code must be 4 digits.' 
      });
    }

    // Find share by code
    const share = await Share.findOne({ code, type: 'text' });

    if (!share) {
      return res.status(404).json({ 
        success: false, 
        message: 'Text not found or code expired' 
      });
    }

    // Mark as downloaded
    share.downloaded = true;
    await share.save();

    res.json({
      success: true,
      text: share.text,
      createdAt: share.createdAt
    });

    // Optional: Delete text after retrieval
    setTimeout(async () => {
      try {
        await Share.deleteOne({ _id: share._id });
        console.log(`Text share ${code} deleted after retrieval`);
      } catch (deleteError) {
        console.error('Error deleting text share:', deleteError);
      }
    }, 1000);
  } catch (error) {
    console.error('Get text error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve text',
      error: error.message 
    });
  }
});

/**
 * GET /api/info/:code
 * Get information about a share without downloading
 */
router.get('/info/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!/^\d{4}$/.test(code)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid code format' 
      });
    }

    const share = await Share.findOne({ code });

    if (!share) {
      return res.status(404).json({ 
        success: false, 
        message: 'Share not found or expired' 
      });
    }

    const info = {
      success: true,
      type: share.type,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt
    };

    if (share.type === 'file') {
      info.fileName = share.originalName;
      info.fileSize = share.size;
      info.mimeType = share.mimeType;
    }

    res.json(info);
  } catch (error) {
    console.error('Get info error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve information',
      error: error.message 
    });
  }
});

module.exports = router;
