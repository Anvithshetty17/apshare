import React, { useState } from 'react';
import { uploadFile, shareText } from '../services/api';

const Upload = () => {
  const [activeTab, setActiveTab] = useState('file');
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setError('');
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setCode('');

    try {
      const response = await uploadFile(file);
      setCode(response.code);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleTextShare = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to share');
      return;
    }

    setLoading(true);
    setError('');
    setCode('');

    try {
      const response = await shareText(text);
      setCode(response.code);
      setText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share text');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setCode('');
    setFile(null);
    setText('');
    setError('');
  };

  return (
    <div className="card">
      {!code ? (
        <>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Share Files or Text</h2>
          
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'file' ? 'active' : ''}`}
              onClick={() => setActiveTab('file')}
            >
              📁 Upload File
            </button>
            <button
              className={`tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              📝 Share Text
            </button>
          </div>

          {error && <div className="error">{error}</div>}

          {activeTab === 'file' ? (
            <form onSubmit={handleFileUpload}>
              <div className="form-group">
                <label htmlFor="file">Select a file to upload:</label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  disabled={loading}
                />
                {file && (
                  <p style={{ marginTop: '10px', color: '#666' }}>
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <button type="submit" className="button" disabled={loading || !file}>
                {loading ? '⏳ Uploading...' : '📤 Upload & Get Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTextShare}>
              <div className="form-group">
                <label htmlFor="text">Enter text to share:</label>
                <textarea
                  id="text"
                  value={text}
                  onChange={handleTextChange}
                  className="textarea"
                  placeholder="Type or paste your text here..."
                  disabled={loading}
                  maxLength={10000}
                />
                <p style={{ textAlign: 'right', color: '#666', fontSize: '14px', marginTop: '5px' }}>
                  {text.length} / 10000 characters
                </p>
              </div>
              <button type="submit" className="button" disabled={loading || !text.trim()}>
                {loading ? '⏳ Sharing...' : '🚀 Share & Get Code'}
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="code-display">
          <h2>✅ Success! Your {activeTab === 'file' ? 'file' : 'text'} is ready to share</h2>
          <div className="code">{code}</div>
          <p className="info-text">
            Share this 4-digit code with anyone to let them access your {activeTab === 'file' ? 'file' : 'text'}.
          </p>
          <p className="info-text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>
            ⏰ This code will expire in 24 hours
          </p>
          <button 
            onClick={resetUpload} 
            className="button button-secondary"
            style={{ marginTop: '30px', maxWidth: '300px', margin: '30px auto 0' }}
          >
            Share Another
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
