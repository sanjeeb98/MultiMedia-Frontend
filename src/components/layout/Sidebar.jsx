import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { setMobileSidebarOpen } from '../../store/uiSlice';
import {
  IconDashboard,
  IconFiles,
  IconUpload,
  IconSearch,
  IconUser,
  IconSettings,
  IconLogout,
} from '../ui/Icons';

function Sidebar() {
  const dispatch = useDispatch();
  const { total } = useSelector((state) => state.files);
  const { sidebarCollapsed, mobileSidebarOpen } = useSelector((state) => state.ui);

  const handleLinkClick = () => {
    dispatch(setMobileSidebarOpen(false));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => dispatch(setMobileSidebarOpen(false))}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${sidebarCollapsed ? 'app-sidebar--collapsed' : ''} ${
          mobileSidebarOpen ? 'app-sidebar--mobile-open' : ''
        }`}
      >
        <NavLink to="/dashboard" className="sidebar__brand" onClick={handleLinkClick}>
          <div className="sidebar__brand-logo">M</div>
          <div className="sidebar__brand-text">
            Media<span>Vault</span>
          </div>
        </NavLink>

        <div className="sidebar__content">
          <span className="sidebar__section-title">Main Navigation</span>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <IconDashboard size={18} />
            <span className="sidebar__link-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/files"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <IconFiles size={18} />
            <span className="sidebar__link-text">My Files</span>
            {total > 0 && <span className="sidebar__badge">{total}</span>}
          </NavLink>

          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <IconUpload size={18} />
            <span className="sidebar__link-text">Upload Media</span>
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <IconSearch size={18} />
            <span className="sidebar__link-text">Search & Rank</span>
          </NavLink>

          <span className="sidebar__section-title" style={{ marginTop: '0.75rem' }}>
            Account
          </span>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <IconUser size={18} />
            <span className="sidebar__link-text">Profile</span>
          </NavLink>

          <NavLink
            to="/profile#security"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <IconSettings size={18} />
            <span className="sidebar__link-text">Settings</span>
          </NavLink>
        </div>

        <div className="sidebar__footer">
          <button
            type="button"
            className="sidebar__link"
            style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            onClick={handleLogout}
          >
            <IconLogout size={18} />
            <span className="sidebar__link-text">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
