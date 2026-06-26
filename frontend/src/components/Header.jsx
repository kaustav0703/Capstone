import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Header = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirects user to home grid while attaching the active search string query (Page 11 spec)
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button onClick={toggleSidebar} className="burger-menu-btn" aria-label="Toggle Sidebar">
          ☰
        </button>
        <Link to="/" className="logo-container" onClick={() => setSearchQuery('')}>
          <span className="logo-icon">📹</span>
          <span className="logo-text">ViewTube</span>
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} className="header-search-form">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-submit-btn">🔍</button>
      </form>

      <div className="header-right">
        {user ? (
          <div className="user-profile-menu">
            <Link to={`/channel/${user._id}`} className="avatar-link" title="My Dashboard">
              <img src={user.avatar} alt="User Avatar" className="user-avatar-img" />
            </Link>
            <button onClick={logout} className="logout-action-btn">Sign Out</button>
          </div>
        ) : (
          <Link to="/auth" className="signin-nav-btn">👤 Sign In</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
