import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AuthPage from './pages/AuthPage.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Channel from './pages/Channel.jsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header navigation element will be injected here later globally */}
        
        <div className="main-layout">
          {/* Sidebar drawer component will sit here globally later */}
          
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="*" element={<div className="page-content">404: Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
