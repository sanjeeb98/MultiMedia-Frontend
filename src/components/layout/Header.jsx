import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import {
  toggleSidebarCollapsed,
  toggleMobileSidebar,
} from '../../store/uiSlice';
import {
  IconMenu,
  IconSearch,
  IconClose,
  IconBell,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconUpload,
  IconFiles,
} from '../ui/Icons';
import { getInitials } from '../../utils/formatters';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myFiles } = useSelector((state) => state.files);

  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 960) {
      dispatch(toggleMobileSidebar());
    } else {
      dispatch(toggleSidebarCollapsed());
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    dispatch(logout());
  };

  const initials = getInitials(user?.username || 'User');
  const recentUploads = myFiles.slice(0, 4);

  return (
    <header className="app-header">
      <div className="app-header__left">
        <button
          type="button"
          className="app-header__toggle-btn"
          onClick={handleSidebarToggle}
          aria-label="Toggle navigation menu"
        >
          <IconMenu size={18} />
        </button>

        <form className="app-header__search-bar" onSubmit={handleSearchSubmit}>
          <IconSearch size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Quick search media & tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <IconClose size={14} />
            </button>
          )}
        </form>
      </div>

      <div className="app-header__right">
        {/* Notifications */}
        <div className="app-header__notifications" ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="app-header__icon-btn"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setUserMenuOpen(false);
            }}
            aria-label="View notifications"
          >
            <IconBell size={18} />
            {recentUploads.length > 0 && <span className="badge-dot" />}
          </button>

          {notifOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-dropdown__header">
                <h4>Activity & Alerts</h4>
                <span>{recentUploads.length} Recent</span>
              </div>
              <div className="notifications-dropdown__body">
                {recentUploads.length === 0 ? (
                  <div className="notifications-dropdown__empty">
                    No recent activity.
                  </div>
                ) : (
                  recentUploads.map((file) => (
                    <div key={file._id} className="notifications-dropdown__item">
                      <div className="notif-icon">
                        <IconUpload size={14} />
                      </div>
                      <div className="notif-content">
                        <p>
                          Uploaded <strong>{file.originalName}</strong>
                        </p>
                        <time>{new Date(file.createdAt).toLocaleDateString()}</time>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="app-header__user-menu" ref={userMenuRef}>
          <button
            type="button"
            className="app-header__user-trigger"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotifOpen(false);
            }}
            aria-expanded={userMenuOpen}
          >
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name">{user?.username || 'Account'}</span>
              <span className="user-role">{user?.email || 'User'}</span>
            </div>
            <IconChevronDown size={14} className="chevron-icon" />
          </button>

          {userMenuOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-menu__header">
                <div className="dropdown-user-name">{user?.username}</div>
                <div className="dropdown-user-email">{user?.email}</div>
              </div>

              <Link
                to="/profile"
                className="dropdown-menu__item"
                onClick={() => setUserMenuOpen(false)}
              >
                <IconUser size={16} />
                <span>My Profile</span>
              </Link>

              <Link
                to="/files"
                className="dropdown-menu__item"
                onClick={() => setUserMenuOpen(false)}
              >
                <IconFiles size={16} />
                <span>My Library</span>
              </Link>

              <Link
                to="/profile#security"
                className="dropdown-menu__item"
                onClick={() => setUserMenuOpen(false)}
              >
                <IconSettings size={16} />
                <span>Account Settings</span>
              </Link>

              <div className="dropdown-menu__divider" />

              <button
                type="button"
                className="dropdown-menu__item dropdown-menu__item--danger"
                onClick={handleLogout}
              >
                <IconLogout size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
