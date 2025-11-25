import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  LogOut,
  Bell,
  Settings,
  UserCheck,
  ShoppingBag,
  Package,
  Award,
  ChevronDown,
  Home,
  Store,
  Trash2,
  MessageCircle,
  Zap,
  Clock,
  Calendar,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI, adminAPI } from '../../services/api';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Initialize authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      // Only show profile if we have both token and user data
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
          setUserRole(parsedUser.role);
        } catch (error) {
          // If user data is corrupted, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      } else {
        // Clear any partial data
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    };
    
    // Check if this is the first time the app is loaded
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      // First time visiting - clear any existing auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.setItem('hasVisited', 'true');
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } else {
      checkAuth();
    }
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load cart items and listen for cart updates
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(cart);
        setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        setCartCount(0);
      }
    };

    // Load cart on mount
    loadCart();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load notifications when component mounts
  useEffect(() => {
    if (isAuthenticated && user && user.userId) {
      loadNotifications();
    }
  }, [isAuthenticated, user, user?.userId]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.navbar-notifications')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const loadNotifications = async () => {
    if (user && user.userId) {
      try {
        const [notificationsResponse, countResponse] = await Promise.all([
          adminAPI.getUserNotifications(user.userId),
          adminAPI.getUnreadNotificationCount(user.userId)
        ]);
        setNotifications(notificationsResponse.data);
        setUnreadCount(countResponse.data);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // If no notifications exist, try to seed them
        if (error.response?.status === 404 || notifications.length === 0) {
          try {
            await adminAPI.seedNotifications(user.userId);
            // Reload notifications after seeding
            const [notificationsResponse, countResponse] = await Promise.all([
              adminAPI.getUserNotifications(user.userId),
              adminAPI.getUnreadNotificationCount(user.userId)
            ]);
            setNotifications(notificationsResponse.data);
            setUnreadCount(countResponse.data);
          } catch (seedError) {
            console.error('Error seeding notifications:', seedError);
            setNotifications([]);
            setUnreadCount(0);
          }
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
      }
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      loadNotifications();
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await adminAPI.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (user && user.userId) {
      try {
        await adminAPI.markAllNotificationsAsRead(user.userId);
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
        setUnreadCount(0);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await adminAPI.deleteNotification(notificationId);
      // Remove from local state immediately for instant UI update
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
      // Recalculate unread count
      const remainingNotifications = notifications.filter(notif => notif.id !== notificationId);
      const newUnreadCount = remainingNotifications.filter(notif => !notif.isRead).length;
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('❌ Error deleting customer notification:', error);
    }
  };

  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    // Mark as read when opened
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  const closeNotificationModal = () => {
    setSelectedNotification(null);
    setShowNotificationModal(false);
  };

  const formatNotificationTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'WELCOME': return <UserCheck className="notification-type-icon" />;
      case 'ORDER_STATUS': return <Package className="notification-type-icon" />;
      case 'ECO_POINTS': return <Award className="notification-type-icon" />;
      case 'PROMOTION': return <ShoppingBag className="notification-type-icon" />;
      case 'DELIVERY': return <Package className="notification-type-icon" />;
      case 'SELLER_APPROVAL': return <UserCheck className="notification-type-icon" />;
      case 'PRODUCT_STATUS': return <Package className="notification-type-icon" />;
      case 'PRODUCT_APPROVAL': return <UserCheck className="notification-type-icon" />;
      case 'PRODUCT_REJECTION': return <X className="notification-type-icon" />;
      case 'ORDER': return <ShoppingCart className="notification-type-icon" />;
      default: return <Bell className="notification-type-icon" />;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    authAPI.logout();
    
    // Clear session storage to reset the app state
    sessionStorage.removeItem('hasVisited');
    
    // Update state immediately
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    setIsUserDropdownOpen(false);
    
    // Clear notifications
    setNotifications([]);
    setUnreadCount(0);
    
    // Redirect to home
    navigate('/');
  };

  const handleAuthRedirect = () => {
    if (isAuthenticated && userRole) {
      switch (userRole.toUpperCase()) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'SELLER':
          navigate('/seller/dashboard');
          break;
        case 'CUSTOMER':
          navigate('/profile');
          break;
        default:
          navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'ADMIN':
        return 'Admin';
      case 'SELLER':
        return 'Seller';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return 'User';
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'ADMIN':
        return <UserCheck size={16} />;
      case 'SELLER':
        return <Store size={16} />;
      case 'CUSTOMER':
        return <ShoppingBag size={16} />;
      default:
        return <User size={16} />;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/Main Navigator Logo.png" 
              alt="EcoBazaarX Logo" 
              className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-5 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-5 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              About
            </Link>
            <Link 
              to="/products" 
              className="px-5 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              Products
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search eco-friendly products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-sm hover:bg-white"
                />
              </div>
            </form>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-3 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group">
              <ShoppingCart size={22} className="transition-transform duration-200 group-hover:scale-105" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group">
              <Heart size={22} className="transition-transform duration-200 group-hover:scale-105" />
            </Link>

            {/* Notifications */}
            <div className="navbar-notifications relative">
              <button 
                onClick={toggleNotifications}
                className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative group"
              >
                <Bell size={22} className="transition-transform duration-200 group-hover:scale-105" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="green-notification-dropdown">
                  <div className="green-notification-header">
                    <div className="green-notification-title">
                      <Bell className="green-notification-header-icon" />
                      <h3>Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="green-notification-count">{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button 
                        className="green-mark-all-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllNotificationsAsRead();
                        }}
                      >
                        <Check size={16} />
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="green-notification-list">
                    {notifications.length === 0 ? (
                      <div className="green-no-notifications">
                        <div className="green-no-notifications-icon">
                          <Bell />
                        </div>
                        <h4>All caught up!</h4>
                        <p>No new notifications at the moment</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`green-notification-item ${!notification.isRead ? 'unread' : 'read'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openNotificationModal(notification);
                          }}
                        >
                          <div className="green-notification-icon">
                            {getNotificationIcon(notification.notificationType)}
                          </div>
                          <div className="green-notification-content">
                            <div className="green-notification-meta">
                              <h4 className="green-notification-title">{notification.title}</h4>
                              <span className="green-notification-time">
                                <Clock size={12} />
                                {formatNotificationTime(notification.createdAt)}
                              </span>
                            </div>
                            <p className="green-notification-message">
                              {notification.message.length > 80 
                                ? `${notification.message.substring(0, 80)}...` 
                                : notification.message
                              }
                            </p>
                            <div className="green-notification-actions">
                              <button 
                                className="green-read-more-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openNotificationModal(notification);
                                }}
                              >
                                <MessageCircle size={14} />
                                Read More
                              </button>
                              <button 
                                className="green-delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="green-unread-indicator">
                              <Zap size={12} />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="green-notification-footer">
                      <button 
                        className="green-view-all-btn"
                        onClick={() => {
                          // Mark all as read and show success message
                          markAllNotificationsAsRead();
                          setTimeout(() => setShowNotifications(false), 1000);
                        }}
                      >
                        <Eye size={16} />
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Auth/Profile */}
            {isAuthenticated ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-3 p-3 text-gray-700 hover:text-green-600 transition-all duration-200 rounded-lg hover:bg-green-50 border border-gray-200 hover:border-green-300"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-base">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-base font-semibold block text-gray-900">
                      {user.firstName || 'User'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {getRoleDisplayName()}
                    </span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 text-gray-400 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <img 
                            src="/EcobazaarX Icon.ico" 
                            alt="EcoBazaarX Icon" 
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-green-200"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center mt-1">
                              {getRoleIcon()}
                              <span className="text-xs text-gray-500 ml-1">{getRoleDisplayName()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="p-2">
                        <Link
                          to="/"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Home size={18} className="text-gray-500" />
                          <span>Home</span>
                        </Link>

                        {userRole === 'CUSTOMER' && (
                          <>
                            <Link
                              to="/orders"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Package size={18} className="text-gray-500" />
                              <span>My Orders</span>
                            </Link>
                            <Link
                              to="/wishlist"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <Heart size={18} className="text-gray-500" />
                              <span>Wishlist</span>
                            </Link>
                          </>
                        )}

                        {(userRole === 'ADMIN' || userRole === 'SELLER') && (
                          <Link
                            to={userRole === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Store size={18} className="text-gray-500" />
                            <span>Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <User size={18} className="text-gray-500" />
                          <span>Profile</span>
                        </Link>


                      </div>

                      {/* Eco Impact Section */}
                      <div className="p-2 border-t border-gray-100">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-green-800">Your Eco Impact</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-2 bg-white rounded">
                              <div className="font-semibold text-green-600">0kg</div>
                              <div className="text-gray-500">Carbon Saved</div>
                            </div>
                            <div className="text-center p-2 bg-white rounded">
                              <div className="font-semibold text-green-600">0</div>
                              <div className="text-gray-500">Eco Points</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Login / Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for eco-friendly products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-14 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/cart"
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart size={20} />
                <span>Cart</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Heart size={20} />
                <span>Wishlist</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleAuthRedirect}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <User size={20} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User size={20} />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Green Notification Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="green-notification-modal-overlay" onClick={closeNotificationModal}>
          <div className="green-notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="green-modal-header">
              <div className="green-modal-title">
                <div className="green-modal-icon">
                  {getNotificationIcon(selectedNotification.notificationType)}
                </div>
                <div className="green-modal-title-content">
                  <h2>{selectedNotification.title}</h2>
                  <div className="green-modal-meta">
                    <span className="green-modal-type">
                      {selectedNotification.notificationType.replace('_', ' ').toLowerCase()}
                    </span>
                    <span className="green-modal-time">
                      <Calendar size={14} />
                      {new Date(selectedNotification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button className="green-modal-close" onClick={closeNotificationModal}>
                <X size={24} />
              </button>
            </div>
            
            <div className="green-modal-body">
              <div className="green-modal-message">
                <MessageCircle className="green-message-icon" />
                <div className="green-message-content">
                  <h3>Message Details</h3>
                  <p>{selectedNotification.message}</p>
                </div>
              </div>
              
              <div className="green-modal-status">
                <div className={`green-status-indicator ${selectedNotification.isRead ? 'read' : 'unread'}`}>
                  {selectedNotification.isRead ? (
                    <>
                      <Check size={16} />
                      <span>Read</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Unread</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="green-modal-footer">
              <div className="green-modal-actions">
                {!selectedNotification.isRead && (
                  <button 
                    className="green-modal-mark-read"
                    onClick={() => {
                      markNotificationAsRead(selectedNotification.id);
                      setSelectedNotification({...selectedNotification, isRead: true});
                    }}
                  >
                    <Check size={16} />
                    Mark as Read
                  </button>
                )}
                <button 
                  className="green-modal-delete"
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    closeNotificationModal();
                  }}
                >
                  <Trash2 size={16} />
                  Delete Notification
                </button>
                <button className="green-modal-close-btn" onClick={closeNotificationModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-sm"
          >
            <div className="px-6 py-6 space-y-2">
              <Link 
                to="/" 
                className="flex items-center px-5 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-4 text-gray-400" />
                Home
              </Link>
              <Link 
                to="/about" 
                className="flex items-center px-5 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-5 h-5 mr-4 text-gray-400" />
                About
              </Link>
              <Link 
                to="/products" 
                className="flex items-center px-5 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="w-5 h-5 mr-4 text-gray-400" />
                Products
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
