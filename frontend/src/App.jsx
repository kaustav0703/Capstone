import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AuthPage from './pages/AuthPage.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Channel from './pages/Channel.jsx';
import Header from './components/Header.jsx';     // <-- Import Header Anchor
import Sidebar from './components/Sidebar.jsx';   // <-- Import Sidebar Anchor

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Render Header globally across all interface views */}
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="main-layout">
          {/* Render Sidebar context wrapper alongside main page targets */}
          <Sidebar isCollapsed={isSidebarCollapsed} />
          
          <main className={`content-area ${isSidebarCollapsed ? 'expanded-width' : 'normal-width'}`}>
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
