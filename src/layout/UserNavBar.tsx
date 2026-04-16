import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearAuth } from "../redux/slices/authSlice";
import { AuthService } from "../services/shared/auth.service";
import logo from "../assets/logo.jpg";
import NotificationDropdown from "../components/NotificationDropdown";
import "./UserNavbar.css";
import { useNotification } from "../hooks/useNotification";
const UserNavBar = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const { notifications, unreadCount, clearUnread,markAllAsRead,markAsRead } = useNotification();
  const { user, role, accessToken } = useAppSelector((state) => state.auth);
  const handleToggleNotif = () => {
    setShowNotif(!showNotif);
    if (!showNotif) {
      clearUnread();
    }
  };
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout(role || 'user');
    dispatch(clearAuth());
    navigate("/login");
  };


  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Trainers", path: "/trainers" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className={`nav-container ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-content">
        <div className="nav-logo" onClick={() => navigate("/")}>
          <div className="logo-wrapper">
            <img src={logo} alt="Vitalic Logo" />
          </div>
          <span className="brand-name">FitTribe</span>
        </div>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={location.pathname === link.path ? "active-link" : ""}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          <div className="search-pill">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search sessions..." />
          </div>

          <div className="action-icons">
            <div className="notif-trigger" onClick={handleToggleNotif}>
              <FaBell />
              {unreadCount > 0 && (
                <span className="notif-dot animate-bounce">
                </span>
              )}

              <div className="relative">
                {showNotif && (
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAsRead={(id:string)=>markAsRead(id)}
                    onMarkAllAsRead={() => markAllAsRead()}
                    onClose={() => setShowNotif(false)}
                  />
                )}
              </div>
            </div>
            {accessToken && user ? (
              <div
                className="profile-trigger"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <FaChevronDown className={`chevron ${showDropdown ? "rotate" : ""}`} />

                {showDropdown && (
                  <div className="nav-dropdown mt-0">
                    <Link to="/profile">My Account</Link>
                    <Link to="/bookings">My Bookings</Link>
                    <div className="nav-divider"></div>
                    <button onClick={handleLogout}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="nav-login-btn" onClick={() => navigate("/login")}>
                Join Vitalic
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;