// import React, { useState, useRef, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   Search, 
//   ShoppingCart, 
//   Heart, 
//   User, 
//   Menu, 
//   X,
//   LogOut,
//   Bell,
//   Settings,
//   UserCheck,
//   ShoppingBag,
//   Package,
//   Award,
//   ChevronDown,
//   Home,
//   Store,
//   Trash2,
//   MessageCircle,
//   Zap,
//   Clock,
//   Calendar,
//   Check,
//   Eye,
//   Info,
//   Sun,
//   Sparkles
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { authAPI, adminAPI } from '../../services/api';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
  
//   // Notification state
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [showNotificationModal, setShowNotificationModal] = useState(false);
  
//   // Cart state
//   const [cartItems, setCartItems] = useState([]);
//   const [cartCount, setCartCount] = useState(0);
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   // Initialize authentication state
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');
      
//       // Only show profile if we have both token and user data
//       if (token && userData) {
//         try {
//           const parsedUser = JSON.parse(userData);
//           setIsAuthenticated(true);
//           setUser(parsedUser);
//           setUserRole(parsedUser.role);
//         } catch (error) {
//           // If user data is corrupted, clear everything
//           localStorage.removeItem('token');
//           localStorage.removeItem('user');
//           setIsAuthenticated(false);
//           setUser(null);
//           setUserRole(null);
//         }
//       } else {
//         // Clear any partial data
//         setIsAuthenticated(false);
//         setUser(null);
//         setUserRole(null);
//       }
//     };
    
//     // Check if this is the first time the app is loaded
//     const hasVisited = sessionStorage.getItem('hasVisited');
//     if (!hasVisited) {
//       // First time visiting - clear any existing auth data
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       sessionStorage.setItem('hasVisited', 'true');
//       setIsAuthenticated(false);
//       setUser(null);
//       setUserRole(null);
//     } else {
//       checkAuth();
//     }
    
//     // Listen for storage changes (when user logs in/out in another tab)
//     const handleStorageChange = () => {
//       checkAuth();
//     };
    
//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   // Load cart items and listen for cart updates
//   useEffect(() => {
//     const loadCart = () => {
//       try {
//         const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//         setCartItems(cart);
//         setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
//       } catch (error) {
//         console.error('Error loading cart:', error);
//         setCartItems([]);
//         setCartCount(0);
//       }
//     };

//     // Load cart on mount
//     loadCart();

//     // Listen for cart updates
//     const handleCartUpdate = () => {
//       loadCart();
//     };

//     window.addEventListener('cartUpdated', handleCartUpdate);
//     return () => {
//       window.removeEventListener('cartUpdated', handleCartUpdate);
//     };
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsUserDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Load notifications when component mounts
//   useEffect(() => {
//     if (isAuthenticated && user && user.userId) {
//       loadNotifications();
//     }
//   }, [isAuthenticated, user, user?.userId]);

//   // Close notification dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showNotifications && !event.target.closest('.navbar-notifications')) {
//         setShowNotifications(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showNotifications]);

//   const loadNotifications = async () => {
//     if (user && user.userId) {
//       try {
//         const [notificationsResponse, countResponse] = await Promise.all([
//           adminAPI.getUserNotifications(user.userId),
//           adminAPI.getUnreadNotificationCount(user.userId)
//         ]);
//         setNotifications(notificationsResponse.data);
//         setUnreadCount(countResponse.data);
//       } catch (error) {
//         console.error('Error loading notifications:', error);
//         // If no notifications exist, try to seed them
//         if (error.response?.status === 404 || notifications.length === 0) {
//           try {
//             await adminAPI.seedNotifications(user.userId);
//             // Reload notifications after seeding
//             const [notificationsResponse, countResponse] = await Promise.all([
//               adminAPI.getUserNotifications(user.userId),
//               adminAPI.getUnreadNotificationCount(user.userId)
//             ]);
//             setNotifications(notificationsResponse.data);
//             setUnreadCount(countResponse.data);
//           } catch (seedError) {
//             console.error('Error seeding notifications:', seedError);
//             setNotifications([]);
//             setUnreadCount(0);
//           }
//         } else {
//           setNotifications([]);
//           setUnreadCount(0);
//         }
//       }
//     }
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//     if (!showNotifications) {
//       loadNotifications();
//     }
//   };

//   const markNotificationAsRead = async (notificationId) => {
//     try {
//       await adminAPI.markNotificationAsRead(notificationId);
//       setNotifications(notifications.map(notif => 
//         notif.id === notificationId ? { ...notif, isRead: true } : notif
//       ));
//       setUnreadCount(Math.max(0, unreadCount - 1));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const markAllNotificationsAsRead = async () => {
//     if (user && user.userId) {
//       try {
//         await adminAPI.markAllNotificationsAsRead(user.userId);
//         setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
//         setUnreadCount(0);
//       } catch (error) {
//         console.error('Error marking all notifications as read:', error);
//       }
//     }
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       await adminAPI.deleteNotification(notificationId);
//       // Remove from local state immediately for instant UI update
//       setNotifications(notifications.filter(notif => notif.id !== notificationId));
//       // Recalculate unread count
//       const remainingNotifications = notifications.filter(notif => notif.id !== notificationId);
//       const newUnreadCount = remainingNotifications.filter(notif => !notif.isRead).length;
//       setUnreadCount(newUnreadCount);
//     } catch (error) {
//       console.error('❌ Error deleting customer notification:', error);
//     }
//   };

//   const openNotificationModal = (notification) => {
//     setSelectedNotification(notification);
//     setShowNotificationModal(true);
//     // Mark as read when opened
//     if (!notification.isRead) {
//       markNotificationAsRead(notification.id);
//     }
//   };

//   const closeNotificationModal = () => {
//     setSelectedNotification(null);
//     setShowNotificationModal(false);
//   };

//   const formatNotificationTime = (timestamp) => {
//     const now = new Date();
//     const notifTime = new Date(timestamp);
//     const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
//     return `${Math.floor(diffInMinutes / 1440)} days ago`;
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'WELCOME': return <UserCheck className="notification-type-icon" />;
//       case 'ORDER_STATUS': return <Package className="notification-type-icon" />;
//       case 'ECO_POINTS': return <Award className="notification-type-icon" />;
//       case 'PROMOTION': return <ShoppingBag className="notification-type-icon" />;
//       case 'DELIVERY': return <Package className="notification-type-icon" />;
//       case 'SELLER_APPROVAL': return <UserCheck className="notification-type-icon" />;
//       case 'PRODUCT_STATUS': return <Package className="notification-type-icon" />;
//       case 'PRODUCT_APPROVAL': return <UserCheck className="notification-type-icon" />;
//       case 'PRODUCT_REJECTION': return <X className="notification-type-icon" />;
//       case 'ORDER': return <ShoppingCart className="notification-type-icon" />;
//       default: return <Bell className="notification-type-icon" />;
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       // Navigate to search results page
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleLogout = () => {
//     // Clear authentication data
//     authAPI.logout();
    
//     // Clear session storage to reset the app state
//     sessionStorage.removeItem('hasVisited');
    
//     // Update state immediately
//     setIsAuthenticated(false);
//     setUser(null);
//     setUserRole(null);
//     setIsUserDropdownOpen(false);
    
//     // Clear notifications
//     setNotifications([]);
//     setUnreadCount(0);
    
//     // Redirect to home
//     navigate('/');
//   };

//   const handleAuthRedirect = () => {
//     if (isAuthenticated && userRole) {
//       switch (userRole.toUpperCase()) {
//         case 'ADMIN':
//           navigate('/admin/dashboard');
//           break;
//         case 'SELLER':
//           navigate('/seller/dashboard');
//           break;
//         case 'CUSTOMER':
//           navigate('/profile');
//           break;
//         default:
//           navigate('/auth');
//       }
//     } else {
//       navigate('/auth');
//     }
//   };

//   const getRoleDisplayName = () => {
//     switch (userRole) {
//       case 'ADMIN':
//         return 'Admin';
//       case 'SELLER':
//         return 'Seller';
//       case 'CUSTOMER':
//         return 'Customer';
//       default:
//         return 'User';
//     }
//   };

//   const getRoleIcon = () => {
//     switch (userRole) {
//       case 'ADMIN':
//         return <UserCheck size={16} />;
//       case 'SELLER':
//         return <Store size={16} />;
//       case 'CUSTOMER':
//         return <ShoppingBag size={16} />;
//       default:
//         return <User size={16} />;
//     }
//   };

//   return (
//     <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white sticky top-0 z-50 shadow-xl">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="lg:hidden p-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-colors duration-200"
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           {/* Logo */}
//           <Link to="/" className="flex items-center group">
//             <div className="flex items-center space-x-3">
//               <div className="bg-yellow-400 p-2 rounded-full shadow-lg">
//                 <Sun className="w-8 h-8 text-blue-900" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors duration-200">
//                   ECOBazaar
//                 </h1>
//                 <p className="text-xs text-blue-200">Your Green Marketplace</p>
//               </div>
//             </div>
//           </Link>

//           {/* Desktop Navigation Links */}
//           <div className="hidden lg:flex items-center space-x-1">
//             <Link 
//               to="/" 
//               className="px-5 py-3 text-base font-medium text-white hover:text-yellow-300 hover:bg-yellow-600/20 rounded-lg transition-all duration-200"
//             >
//               Home
//             </Link>
//             <Link 
//               to="/about" 
//               className="px-5 py-3 text-base font-medium text-white hover:text-yellow-300 hover:bg-yellow-600/20 rounded-lg transition-all duration-200"
//             >
//               About
//             </Link>
//             <Link 
//               to="/products" 
//               className="px-5 py-3 text-base font-medium text-white hover:text-yellow-300 hover:bg-yellow-600/20 rounded-lg transition-all duration-200"
//             >
//               Products
//             </Link>
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden lg:flex flex-1 max-w-lg mx-8">
//             <form onSubmit={handleSearch} className="w-full">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-yellow-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search for amazing products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 text-base text-blue-900 placeholder-blue-600 bg-yellow-50 border-2 border-yellow-400 rounded-xl transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:shadow-lg hover:bg-white"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Right side items */}
//           <div className="flex items-center space-x-2">
//             {/* Cart */}
//             <Link to="/cart" className="relative p-3 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-all duration-200 group">
//               <ShoppingCart size={22} className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* Wishlist */}
//             <Link to="/wishlist" className="p-3 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-all duration-200 group">
//               <Heart size={22} className="transition-transform duration-200 group-hover:scale-110 group-hover:fill-yellow-300" />
//             </Link>

//             {/* Notifications */}
//             <div className="navbar-notifications relative">
//               <button 
//                 onClick={toggleNotifications}
//                 className="p-3 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-all duration-200 relative group"
//               >
//                 <Bell size={22} className="transition-transform duration-200 group-hover:scale-110 group-hover:animate-ring" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>
              
//               {showNotifications && (
//                 <div className="absolute right-0 mt-2 w-96 bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-yellow-400 rounded-xl shadow-2xl overflow-hidden z-50">
//                   <div className="p-4 border-b border-yellow-600/30">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <Bell className="w-5 h-5 text-yellow-300" />
//                         <h3 className="text-lg font-bold text-white">Notifications</h3>
//                         {unreadCount > 0 && (
//                           <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                             {unreadCount} new
//                           </span>
//                         )}
//                       </div>
//                       {unreadCount > 0 && (
//                         <button 
//                           className="flex items-center space-x-2 text-sm text-yellow-300 hover:text-yellow-100 bg-yellow-600/20 px-3 py-1 rounded-lg"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             markAllNotificationsAsRead();
//                           }}
//                         >
//                           <Check size={16} />
//                           <span>Mark all read</span>
//                         </button>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="max-h-96 overflow-y-auto">
//                     {notifications.length === 0 ? (
//                       <div className="p-8 text-center">
//                         <div className="inline-block p-4 bg-blue-700/50 rounded-full mb-4">
//                           <Bell className="w-8 h-8 text-yellow-300" />
//                         </div>
//                         <h4 className="text-xl font-bold text-white mb-2">All caught up!</h4>
//                         <p className="text-blue-200">No new notifications at the moment</p>
//                       </div>
//                     ) : (
//                       notifications.map((notification) => (
//                         <div 
//                           key={notification.id} 
//                           className={`p-4 border-b border-blue-700/50 hover:bg-blue-700/30 cursor-pointer transition-colors ${
//                             !notification.isRead ? 'bg-blue-700/20' : ''
//                           }`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             openNotificationModal(notification);
//                           }}
//                         >
//                           <div className="flex items-start space-x-3">
//                             <div className={`p-2 rounded-lg ${
//                               notification.isRead ? 'bg-blue-600/50' : 'bg-yellow-500/20'
//                             }`}>
//                               {getNotificationIcon(notification.notificationType)}
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex items-center justify-between mb-1">
//                                 <h4 className="font-semibold text-white">{notification.title}</h4>
//                                 <span className="text-xs text-blue-200 flex items-center">
//                                   <Clock size={12} className="mr-1" />
//                                   {formatNotificationTime(notification.createdAt)}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-blue-200 mb-2">
//                                 {notification.message.length > 80 
//                                   ? `${notification.message.substring(0, 80)}...` 
//                                   : notification.message
//                                 }
//                               </p>
//                               <div className="flex items-center space-x-3">
//                                 <button 
//                                   className="text-xs text-yellow-300 hover:text-yellow-100 flex items-center space-x-1"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     openNotificationModal(notification);
//                                   }}
//                                 >
//                                   <MessageCircle size={12} />
//                                   <span>Read More</span>
//                                 </button>
//                                 <button 
//                                   className="text-xs text-red-300 hover:text-red-100 flex items-center space-x-1"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     deleteNotification(notification.id);
//                                   }}
//                                 >
//                                   <Trash2 size={12} />
//                                   <span>Delete</span>
//                                 </button>
//                               </div>
//                             </div>
//                             {!notification.isRead && (
//                               <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
//                             )}
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
                  
//                   {notifications.length > 0 && (
//                     <div className="p-4 border-t border-blue-700/50">
//                       <button 
//                         className="w-full flex items-center justify-center space-x-2 text-yellow-300 hover:text-yellow-100 bg-yellow-600/20 py-2 rounded-lg"
//                         onClick={() => {
//                           markAllNotificationsAsRead();
//                           setTimeout(() => setShowNotifications(false), 1000);
//                         }}
//                       >
//                         <Eye size={16} />
//                         <span>View all notifications</span>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Auth/Profile */}
//             {isAuthenticated ? (
//               <div className="relative ml-4" ref={dropdownRef}>
//                 <button
//                   onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
//                   className="flex items-center space-x-3 p-3 text-white hover:text-yellow-300 transition-all duration-200 rounded-xl hover:bg-yellow-600/20 border-2 border-yellow-400/50 hover:border-yellow-400"
//                 >
//                   <div className="relative">
//                     <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
//                       <span className="text-blue-900 font-bold text-base">
//                         {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
//                       </span>
//                     </div>
//                     <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-900"></div>
//                   </div>
//                   <div className="hidden sm:block text-left">
//                     <span className="text-base font-bold block text-yellow-300">
//                       {user.firstName || 'User'}
//                     </span>
//                     <span className="text-sm text-blue-200">
//                       {getRoleDisplayName()}
//                     </span>
//                   </div>
//                   <ChevronDown 
//                     size={16} 
//                     className={`transition-transform duration-200 text-yellow-400 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
//                   />
//                 </button>

//                 {/* User Dropdown Menu */}
//                 <AnimatePresence>
//                   {isUserDropdownOpen && (
//                     <motion.div
//                       initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                       transition={{ duration: 0.2 }}
//                       className="absolute right-0 mt-2 w-80 bg-gradient-to-b from-blue-800 to-blue-900 rounded-xl shadow-2xl border-2 border-yellow-400 overflow-hidden"
//                     >
//                       {/* User Info Header */}
//                       <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-blue-900/50 border-b border-yellow-600/30">
//                         <div className="flex items-center space-x-3">
//                           <div className="relative">
//                             <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
//                               <span className="text-blue-900 font-bold text-xl">
//                                 {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
//                               </span>
//                             </div>
//                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-blue-800"></div>
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-bold text-white">
//                               {user.firstName} {user.lastName}
//                             </h3>
//                             <p className="text-sm text-blue-200">{user.email}</p>
//                             <div className="flex items-center mt-1">
//                               {getRoleIcon()}
//                               <span className="text-xs text-yellow-300 ml-1 font-medium">{getRoleDisplayName()}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Navigation Links */}
//                       <div className="p-2">
//                         <Link
//                           to="/"
//                           onClick={() => setIsUserDropdownOpen(false)}
//                           className="flex items-center space-x-3 p-3 text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
//                         >
//                           <Home size={18} className="text-yellow-400" />
//                           <span>Home</span>
//                         </Link>

//                         {userRole === 'CUSTOMER' && (
//                           <>
//                             <Link
//                               to="/orders"
//                               onClick={() => setIsUserDropdownOpen(false)}
//                               className="flex items-center space-x-3 p-3 text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
//                             >
//                               <Package size={18} className="text-yellow-400" />
//                               <span>My Orders</span>
//                             </Link>
//                             <Link
//                               to="/wishlist"
//                               onClick={() => setIsUserDropdownOpen(false)}
//                               className="flex items-center space-x-3 p-3 text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
//                             >
//                               <Heart size={18} className="text-yellow-400" />
//                               <span>Wishlist</span>
//                             </Link>
//                           </>
//                         )}

//                         {(userRole === 'ADMIN' || userRole === 'SELLER') && (
//                           <Link
//                             to={userRole === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}
//                             onClick={() => setIsUserDropdownOpen(false)}
//                             className="flex items-center space-x-3 p-3 text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
//                           >
//                             <Store size={18} className="text-yellow-400" />
//                             <span>Dashboard</span>
//                           </Link>
//                         )}

//                         <Link
//                           to="/profile"
//                           onClick={() => setIsUserDropdownOpen(false)}
//                           className="flex items-center space-x-3 p-3 text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
//                         >
//                           <User size={18} className="text-yellow-400" />
//                           <span>Profile</span>
//                         </Link>
//                       </div>

//                       {/* Eco Impact Section */}
//                       <div className="p-2 border-t border-blue-700/50">
//                         <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-blue-700/30 rounded-lg">
//                           <div className="flex items-center space-x-2 mb-2">
//                             <Award size={16} className="text-yellow-400" />
//                             <span className="text-sm font-bold text-yellow-300">Your Achievements</span>
//                           </div>
//                           <div className="grid grid-cols-2 gap-2 text-xs">
//                             <div className="text-center p-2 bg-blue-700/50 rounded-lg border border-yellow-400/30">
//                               <div className="font-bold text-yellow-300">0kg</div>
//                               <div className="text-blue-200">Carbon Saved</div>
//                             </div>
//                             <div className="text-center p-2 bg-blue-700/50 rounded-lg border border-yellow-400/30">
//                               <div className="font-bold text-yellow-300">0</div>
//                               <div className="text-blue-200">Gold Points</div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Logout Button */}
//                       <div className="p-2 border-t border-blue-700/50">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center space-x-3 p-3 text-red-300 hover:text-red-100 hover:bg-red-600/20 rounded-lg transition-colors border border-red-500/30"
//                         >
//                           <LogOut size={18} />
//                           <span className="font-medium">Logout</span>
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-3 ml-4">
//                 <Link
//                   to="/auth"
//                   className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-yellow-400/50"
//                 >
//                   Login / Register
//                 </Link>
//               </div>
//             )}

//             {/* Mobile menu button */}
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="md:hidden p-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-colors"
//             >
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         <div className="md:hidden pb-4">
//           <form onSubmit={handleSearch}>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search for amazing products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-6 pr-14 py-3 text-blue-900 bg-yellow-50 border-2 border-yellow-400 rounded-xl transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:shadow-lg placeholder-blue-600"
//               />
//               <button
//                 type="submit"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-all duration-200"
//               >
//                 <Search size={20} />
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Notification Modal */}
//       {showNotificationModal && selectedNotification && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeNotificationModal}>
//           <div className="bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-yellow-400 rounded-2xl shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6 border-b border-yellow-600/30">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div className="p-3 bg-yellow-500/20 rounded-xl">
//                     {getNotificationIcon(selectedNotification.notificationType)}
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold text-white">{selectedNotification.title}</h2>
//                     <div className="flex items-center space-x-4 mt-2">
//                       <span className="text-sm text-yellow-300 bg-yellow-600/20 px-3 py-1 rounded-full">
//                         {selectedNotification.notificationType.replace('_', ' ').toLowerCase()}
//                       </span>
//                       <span className="text-sm text-blue-200 flex items-center">
//                         <Calendar size={14} className="mr-2" />
//                         {new Date(selectedNotification.createdAt).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button className="text-yellow-300 hover:text-yellow-100 p-2" onClick={closeNotificationModal}>
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <div className="bg-blue-700/30 p-5 rounded-xl border border-blue-600/50 mb-6">
//                 <div className="flex items-start space-x-3 mb-4">
//                   <MessageCircle className="text-yellow-400 mt-1" size={20} />
//                   <div>
//                     <h3 className="text-lg font-bold text-white mb-2">Message Details</h3>
//                     <p className="text-blue-200">{selectedNotification.message}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
//                   selectedNotification.isRead 
//                     ? 'bg-blue-600/50 text-blue-200' 
//                     : 'bg-yellow-500/20 text-yellow-300'
//                 }`}>
//                   {selectedNotification.isRead ? (
//                     <>
//                       <Check size={16} />
//                       <span className="font-medium">Read</span>
//                     </>
//                   ) : (
//                     <>
//                       <Zap size={16} />
//                       <span className="font-medium">Unread</span>
//                     </>
//                   )}
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   {!selectedNotification.isRead && (
//                     <button 
//                       className="flex items-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg transition-colors"
//                       onClick={() => {
//                         markNotificationAsRead(selectedNotification.id);
//                         setSelectedNotification({...selectedNotification, isRead: true});
//                       }}
//                     >
//                       <Check size={16} />
//                       <span>Mark as Read</span>
//                     </button>
//                   )}
//                   <button 
//                     className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
//                     onClick={() => {
//                       deleteNotification(selectedNotification.id);
//                       closeNotificationModal();
//                     }}
//                   >
//                     <Trash2 size={16} />
//                     <span>Delete</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Navigation Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="lg:hidden bg-gradient-to-b from-blue-800 to-blue-900 border-t border-yellow-600/30 shadow-xl"
//           >
//             <div className="px-6 py-6 space-y-2">
//               <Link 
//                 to="/" 
//                 className="flex items-center px-5 py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-bold text-base"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <Home className="w-5 h-5 mr-4 text-yellow-400" />
//                 Home
//               </Link>
//               <Link 
//                 to="/about" 
//                 className="flex items-center px-5 py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-bold text-base"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <Info className="w-5 h-5 mr-4 text-yellow-400" />
//                 About
//               </Link>
//               <Link 
//                 to="/products" 
//                 className="flex items-center px-5 py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-bold text-base"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 <Package className="w-5 h-5 mr-4 text-yellow-400" />
//                 Products
//               </Link>
              
//               {/* Mobile Auth Section */}
//               <div className="pt-4 border-t border-blue-700/50 mt-4">
//                 {isAuthenticated ? (
//                   <>
//                     <div className="flex items-center px-5 py-4">
//                       <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-4">
//                         <span className="text-blue-900 font-bold">
//                           {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="text-white font-bold">{user.firstName} {user.lastName}</div>
//                         <div className="text-yellow-300 text-sm">{getRoleDisplayName()}</div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         handleAuthRedirect();
//                         setIsMenuOpen(false);
//                       }}
//                       className="w-full flex items-center px-5 py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-bold text-base"
//                     >
//                       <User className="w-5 h-5 mr-4 text-yellow-400" />
//                       Dashboard
//                     </button>
//                     <button
//                       onClick={() => {
//                         handleLogout();
//                         setIsMenuOpen(false);
//                       }}
//                       className="w-full flex items-center px-5 py-4 text-red-300 hover:text-red-100 hover:bg-red-600/20 rounded-xl transition-colors duration-200 font-bold text-base"
//                     >
//                       <LogOut className="w-5 h-5 mr-4" />
//                       Logout
//                     </button>
//                   </>
//                 ) : (
//                   <Link
//                     to="/auth"
//                     className="flex items-center justify-center px-5 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-xl font-bold text-base hover:shadow-lg transition-all duration-200"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     <User className="w-5 h-5 mr-2" />
//                     Login / Register
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;



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
  Info,
  Sun,
  Sparkles
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
  const notificationRef = useRef(null);

  // Initialize authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setIsAuthenticated(true);
          setUser(parsedUser);
          setUserRole(parsedUser.role);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
    };
    
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.setItem('hasVisited', 'true');
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } else {
      checkAuth();
    }
    
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

    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Load notifications when component mounts
  useEffect(() => {
    if (isAuthenticated && user && user.userId) {
      loadNotifications();
    }
  }, [isAuthenticated, user, user?.userId]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [navigate]);

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
        if (error.response?.status === 404 || notifications.length === 0) {
          try {
            await adminAPI.seedNotifications(user.userId);
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
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
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
    setShowNotifications(false);
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
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    sessionStorage.removeItem('hasVisited');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    setIsUserDropdownOpen(false);
    setNotifications([]);
    setUnreadCount(0);
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
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center group ml-2 sm:ml-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-full shadow-lg">
                <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-blue-900" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-yellow-300 group-hover:text-yellow-200 transition-colors duration-200">
                  ECOBazaar
                </h1>
                <p className="text-[10px] xs:text-xs text-blue-200 hidden xs:block">Your Green Marketplace</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className="px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base font-medium text-white hover:text-yellow-300 hover:bg-yellow-600/20 rounded-lg transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base font-medium text-white hover:text-yellow-300 hover:bg-yellow-600/20 rounded-lg transition-all duration-200"
            >
              About
            </Link>
            <Link 
              to="/products" 
              className="px-4 lg:px-5 py-2.5 lg:py-3 text-sm lg:text-base font-medium text-white hover:text-yellow-300 hover:bg-yellow-600/20 rounded-lg transition-all duration-200"
            >
              Products
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-6 xl:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-blue-900 placeholder-blue-600 bg-yellow-50 border-2 border-yellow-400 rounded-xl transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:shadow-lg hover:bg-white"
                />
              </div>
            </form>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 sm:p-3 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-all duration-200 group">
              <ShoppingCart size={20} className="sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] xs:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link to="/wishlist" className="p-2.5 sm:p-3 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-all duration-200 group hidden sm:block">
              <Heart size={20} className="sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110 group-hover:fill-yellow-300" />
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="navbar-notifications relative" ref={notificationRef}>
                <button 
                  onClick={toggleNotifications}
                  className="p-2.5 sm:p-3 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-all duration-200 relative group"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110 group-hover:animate-ring" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] xs:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="fixed sm:absolute right-0 left-0 sm:left-auto top-16 sm:top-full mt-2 w-full sm:w-80 md:w-96 bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-yellow-400 rounded-xl sm:rounded-xl shadow-2xl overflow-hidden z-50 mx-auto sm:mx-0 max-w-sm sm:max-w-none">
                    <div className="p-3 sm:p-4 border-b border-yellow-600/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                          <h3 className="text-base sm:text-lg font-bold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-yellow-300 hover:text-yellow-100 bg-yellow-600/20 px-2 sm:px-3 py-1 rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAllNotificationsAsRead();
                            }}
                          >
                            <Check size={14} className="sm:w-4 sm:h-4" />
                            <span>Mark all</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                          <div className="inline-block p-3 sm:p-4 bg-blue-700/50 rounded-full mb-3 sm:mb-4">
                            <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                          </div>
                          <h4 className="text-lg sm:text-xl font-bold text-white mb-2">All caught up!</h4>
                          <p className="text-sm sm:text-base text-blue-200">No new notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 sm:p-4 border-b border-blue-700/50 hover:bg-blue-700/30 cursor-pointer transition-colors ${
                              !notification.isRead ? 'bg-blue-700/20' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openNotificationModal(notification);
                            }}
                          >
                            <div className="flex items-start space-x-2 sm:space-x-3">
                              <div className={`p-1.5 sm:p-2 rounded-lg ${
                                notification.isRead ? 'bg-blue-600/50' : 'bg-yellow-500/20'
                              }`}>
                                {getNotificationIcon(notification.notificationType)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="text-sm sm:text-base font-semibold text-white truncate">{notification.title}</h4>
                                  <span className="text-[10px] sm:text-xs text-blue-200 flex items-center shrink-0 ml-2">
                                    <Clock size={10} className="sm:w-3 sm:h-3 mr-1" />
                                    {formatNotificationTime(notification.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-blue-200 mb-2 truncate-2-lines">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <button 
                                    className="text-xs text-yellow-300 hover:text-yellow-100 flex items-center space-x-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openNotificationModal(notification);
                                    }}
                                  >
                                    <MessageCircle size={10} className="sm:w-3 sm:h-3" />
                                    <span>Read More</span>
                                  </button>
                                  <button 
                                    className="text-xs text-red-300 hover:text-red-100 flex items-center space-x-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                  >
                                    <Trash2 size={10} className="sm:w-3 sm:h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                              {!notification.isRead && (
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse shrink-0"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 sm:p-4 border-t border-blue-700/50">
                        <button 
                          className="w-full flex items-center justify-center space-x-2 text-sm text-yellow-300 hover:text-yellow-100 bg-yellow-600/20 py-2 rounded-lg"
                          onClick={() => {
                            markAllNotificationsAsRead();
                            setTimeout(() => setShowNotifications(false), 1000);
                          }}
                        >
                          <Eye size={14} className="sm:w-4 sm:h-4" />
                          <span>View all notifications</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Auth/Profile */}
            {isAuthenticated ? (
              <div className="relative ml-1 sm:ml-2 md:ml-4" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-3 text-white hover:text-yellow-300 transition-all duration-200 rounded-xl hover:bg-yellow-600/20 border border-yellow-400/30 hover:border-yellow-400"
                  aria-label="User menu"
                >
                  <div className="relative">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-blue-900 font-bold text-sm sm:text-base">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full border border-blue-900"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-sm sm:text-base font-bold block text-yellow-300 truncate max-w-[80px]">
                      {user.firstName || 'User'}
                    </span>
                    <span className="text-xs sm:text-sm text-blue-200">
                      {getRoleDisplayName()}
                    </span>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={`hidden sm:block transition-transform duration-200 text-yellow-400 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
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
                      className="fixed sm:absolute right-0 left-0 sm:left-auto top-16 sm:top-full mt-2 w-full sm:w-64 md:w-80 bg-gradient-to-b from-blue-800 to-blue-900 rounded-xl sm:rounded-xl shadow-2xl border-2 border-yellow-400 overflow-hidden z-50 mx-auto sm:mx-0 max-w-sm sm:max-w-none"
                    >
                      {/* User Info Header */}
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-500/20 to-blue-900/50 border-b border-yellow-600/30">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                              <span className="text-blue-900 font-bold text-lg sm:text-xl">
                                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full border border-blue-800"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate text-sm sm:text-base">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-200 truncate">{user.email}</p>
                            <div className="flex items-center mt-1">
                              {getRoleIcon()}
                              <span className="text-xs text-yellow-300 ml-1 font-medium">{getRoleDisplayName()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Links */}
                      <div className="p-2">
                        <Link
                          to="/"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-sm sm:text-base text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
                        >
                          <Home size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                          <span>Home</span>
                        </Link>

                        {userRole === 'CUSTOMER' && (
                          <>
                            <Link
                              to="/orders"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-sm sm:text-base text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
                            >
                              <Package size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                              <span>My Orders</span>
                            </Link>
                            <Link
                              to="/wishlist"
                              onClick={() => setIsUserDropdownOpen(false)}
                              className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-sm sm:text-base text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
                            >
                              <Heart size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                              <span>Wishlist</span>
                            </Link>
                          </>
                        )}

                        {(userRole === 'ADMIN' || userRole === 'SELLER') && (
                          <Link
                            to={userRole === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-sm sm:text-base text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
                          >
                            <Store size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                            <span>Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-sm sm:text-base text-white hover:bg-blue-700/50 rounded-lg transition-colors hover:text-yellow-300"
                        >
                          <User size={16} className="sm:w-5 sm:h-5 text-yellow-400" />
                          <span>Profile</span>
                        </Link>
                      </div>

                      {/* Eco Impact Section */}
                      <div className="p-2 border-t border-blue-700/50">
                        <div className="p-2 sm:p-3 bg-gradient-to-r from-yellow-500/20 to-blue-700/30 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award size={14} className="sm:w-4 sm:h-4 text-yellow-400" />
                            <span className="text-xs sm:text-sm font-bold text-yellow-300">Your Achievements</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center p-1.5 sm:p-2 bg-blue-700/50 rounded-lg border border-yellow-400/30">
                              <div className="font-bold text-yellow-300">0kg</div>
                              <div className="text-blue-200 text-[10px] sm:text-xs">Carbon Saved</div>
                            </div>
                            <div className="text-center p-1.5 sm:p-2 bg-blue-700/50 rounded-lg border border-yellow-400/30">
                              <div className="font-bold text-yellow-300">0</div>
                              <div className="text-blue-200 text-[10px] sm:text-xs">Gold Points</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <div className="p-2 border-t border-blue-700/50">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-sm sm:text-base text-red-300 hover:text-red-100 hover:bg-red-600/20 rounded-lg transition-colors border border-red-500/30"
                        >
                          <LogOut size={16} className="sm:w-5 sm:h-5" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-3 ml-1 sm:ml-4">
                <Link
                  to="/auth"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-yellow-400/50 text-sm sm:text-base whitespace-nowrap"
                >
                  Login / Register
                </Link>
              </div>
            )}

            {/* Mobile menu button (alternative) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-600/20 rounded-lg transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden pb-3 sm:pb-4 px-3 sm:px-4`}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for amazing products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 sm:pl-6 sm:pr-14 py-2.5 sm:py-3 text-sm sm:text-base text-blue-900 bg-yellow-50 border-2 border-yellow-400 rounded-xl transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:shadow-lg placeholder-blue-600"
              />
              <button
                type="submit"
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-all duration-200"
              >
                <Search size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4" onClick={closeNotificationModal}>
          <div className="bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-yellow-400 rounded-xl sm:rounded-2xl shadow-2xl max-w-full sm:max-w-lg w-full mx-2" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-yellow-600/30">
              <div className="flex items-start justify-between space-x-2">
                <div className="flex items-start space-x-2 sm:space-x-4 min-w-0">
                  <div className="p-2 sm:p-3 bg-yellow-500/20 rounded-xl flex-shrink-0">
                    {getNotificationIcon(selectedNotification.notificationType)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white truncate">{selectedNotification.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs sm:text-sm text-yellow-300 bg-yellow-600/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                        {selectedNotification.notificationType.replace('_', ' ').toLowerCase()}
                      </span>
                      <span className="text-xs sm:text-sm text-blue-200 flex items-center whitespace-nowrap">
                        <Calendar size={12} className="sm:w-4 sm:h-4 mr-1" />
                        {new Date(selectedNotification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-yellow-300 hover:text-yellow-100 p-1 sm:p-2 flex-shrink-0" onClick={closeNotificationModal}>
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="bg-blue-700/30 p-3 sm:p-5 rounded-xl border border-blue-600/50 mb-4 sm:mb-6">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <MessageCircle className="text-yellow-400 mt-0.5 sm:mt-1 sm:w-5 sm:h-5" size={16} />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">Message Details</h3>
                    <p className="text-sm sm:text-base text-blue-200">{selectedNotification.message}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <div className={`flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
                  selectedNotification.isRead 
                    ? 'bg-blue-600/50 text-blue-200' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {selectedNotification.isRead ? (
                    <>
                      <Check size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-medium text-sm sm:text-base">Read</span>
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="sm:w-4 sm:h-4" />
                      <span className="font-medium text-sm sm:text-base">Unread</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                  {!selectedNotification.isRead && (
                    <button 
                      className="flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
                      onClick={() => {
                        markNotificationAsRead(selectedNotification.id);
                        setSelectedNotification({...selectedNotification, isRead: true});
                      }}
                    >
                      <Check size={14} className="sm:w-4 sm:h-4" />
                      <span>Mark as Read</span>
                    </button>
                  )}
                  <button 
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 sm:space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-sm sm:text-base"
                    onClick={() => {
                      deleteNotification(selectedNotification.id);
                      closeNotificationModal();
                    }}
                  >
                    <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    <span>Delete</span>
                  </button>
                </div>
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
            className="lg:hidden bg-gradient-to-b from-blue-800 to-blue-900 border-t border-yellow-600/30 shadow-xl overflow-hidden"
          >
            <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-1 sm:space-y-2">
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 sm:px-5 sm:py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-medium sm:font-bold text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-yellow-400" />
                Home
              </Link>
              <Link 
                to="/about" 
                className="flex items-center px-4 py-3 sm:px-5 sm:py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-medium sm:font-bold text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-yellow-400" />
                About
              </Link>
              <Link 
                to="/products" 
                className="flex items-center px-4 py-3 sm:px-5 sm:py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-medium sm:font-bold text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-yellow-400" />
                Products
              </Link>
              
              {/* Wishlist (Mobile only) */}
              <Link 
                to="/wishlist" 
                className="flex items-center px-4 py-3 sm:px-5 sm:py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-medium sm:font-bold text-sm sm:text-base sm:hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-yellow-400" />
                Wishlist
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-3 sm:pt-4 border-t border-blue-700/50 mt-3 sm:mt-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center px-4 py-3 sm:px-5 sm:py-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <span className="text-blue-900 font-bold text-sm sm:text-base">
                          {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-bold text-sm sm:text-base truncate">{user.firstName} {user.lastName}</div>
                        <div className="text-yellow-300 text-xs sm:text-sm">{getRoleDisplayName()}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleAuthRedirect();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 sm:px-5 sm:py-4 text-white hover:text-yellow-300 hover:bg-blue-700/50 rounded-xl transition-colors duration-200 font-medium sm:font-bold text-sm sm:text-base"
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-yellow-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 sm:px-5 sm:py-4 text-red-300 hover:text-red-100 hover:bg-red-600/20 rounded-xl transition-colors duration-200 font-medium sm:font-bold text-sm sm:text-base"
                    >
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center justify-center px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 rounded-xl font-bold text-sm sm:text-base hover:shadow-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;