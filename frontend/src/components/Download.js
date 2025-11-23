import React, { useState } from 'react';
import { getShareInfo, getText, getDownloadUrl } from '../services/api';

const Download = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareInfo, setShareInfo] = useState(null);
  const [textContent, setTextContent] = useState('');

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      setError('Please enter a valid 4-digit code');
      return;
    }

    setLoading(true);
    setError('');
    setShareInfo(null);
    setTextContent('');

    try {
      const info = await getShareInfo(code);
      setShareInfo(info);

      if (info.type === 'file') {
        // Trigger file download
        window.location.href = getDownloadUrl(code);
      } else if (info.type === 'text') {
        // Fetch text content
        const textData = await getText(code);
        setTextContent(textData.text);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve content. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetDownload = () => {
    setCode('');
    setShareInfo(null);
    setTextContent('');
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Receive Files or Text</h2>
      
      {!shareInfo ? (
        <>
          {error && <div className="error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="code">Enter 4-digit code:</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={handleCodeChange}
                className="input"
                placeholder="XXXX"
                disabled={loading}
                maxLength={4}
                style={{ 
                  fontSize: '2rem', 
                  textAlign: 'center', 
                  letterSpacing: '10px',
                  fontWeight: 'bold'
                }}
              />
            </div>
            <button type="submit" className="button" disabled={loading || code.length !== 4}>
              {loading ? '⏳ Retrieving...' : '🔍 Get Content'}
            </button>
          </form>

          <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '15px', color: '#667eea' }}>ℹ️ How it works</h3>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#666' }}>
              <li>Enter the 4-digit code shared with you</li>
              <li>If it's a file, it will download automatically</li>
              <li>If it's text, it will be displayed below</li>
              <li>Codes expire after 24 hours</li>
            </ol>
          </div>
        </>
      ) : (
        <>
          {shareInfo.type === 'file' && (
            <div className="file-info">
              <h3>📁 File Download Started</h3>
              <div className="file-info-item">
                <span><strong>File Name:</strong></span>
                <span>{shareInfo.fileName}</span>
              </div>
              <div className="file-info-item">
                <span><strong>File Size:</strong></span>
                <span>{formatFileSize(shareInfo.fileSize)}</span>
              </div>
              <div className="file-info-item">
                <span><strong>Type:</strong></span>
                <span>{shareInfo.mimeType}</span>
              </div>
              <div className="file-info-item">
                <span><strong>Shared:</strong></span>
                <span>{formatDate(shareInfo.createdAt)}</span>
              </div>
              <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                Your download should start automatically. If not, <a href={getDownloadUrl(code)} style={{ color: '#667eea' }}>click here</a>.
              </p>
            </div>
          )}

          {shareInfo.type === 'text' && textContent && (
            <div className="text-display">
              <h3>📝 Shared Text</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Shared on: {formatDate(shareInfo.createdAt)}
              </p>
              <div className="text-content">{textContent}</div>
            </div>
          )}

          <button 
            onClick={resetDownload} 
            className="button"
            style={{ marginTop: '20px' }}
          >
            Enter Another Code
          </button>
        </>
      )}
    </div>
  );
};

export default Download;
