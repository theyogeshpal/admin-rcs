import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar glass-card">
      <div className="sidebar-header">
        <h2>Campaign<span>Pro</span></h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <div className="nav-icon">🚀</div>
          Launch Campaign
        </NavLink>
        <NavLink 
          to="/status" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <div className="nav-icon">📊</div>
          Campaign Status
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
