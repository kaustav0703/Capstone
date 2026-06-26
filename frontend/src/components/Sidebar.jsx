import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Sidebar = ({ isCollapsed }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Helper check function to highlight active navigation route links visually
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`navigation-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <nav className="sidebar-nav-list">
        <Link to="/" className={`sidebar-link-item ${isActive('/') ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          {!isCollapsed && <span className="nav-label">Home</span>}
        </Link>

        {user && (
          <>
            <hr className="sidebar-divider" />
            <div className="sidebar-section-heading">{!isCollapsed && "Creator Tools"}</div>
            
            <Link 
              to={`/channel/${user._id}`} 
              className={`sidebar-link-item ${isActive(`/channel/${user._id}`) ? 'active' : ''}`}
            >
              <span className="nav-icon">🛠️</span>
              {!isCollapsed && <span className="nav-label">My Studio</span>}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
