import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Upload from './components/Upload';
import Download from './components/Download';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="nav">
      <Link 
        to="/" 
        className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
      >
        📤 Share
      </Link>
      <Link 
        to="/download" 
        className={`nav-button ${location.pathname === '/download' ? 'active' : ''}`}
      >
        📥 Receive
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <div className="header">
          <h1>⚡ APShare</h1>
          <p>Share files and text instantly with a 4-digit code</p>
        </div>
        
        <div className="container">
          <Navigation />
          
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/download" element={<Download />} />
          </Routes>
          
          <div style={{ textAlign: 'center', color: 'white', marginTop: '40px', opacity: 0.8 }}>
            <p>Built with React, Express, MongoDB & Docker</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              Secure • Fast • Simple
            </p>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
