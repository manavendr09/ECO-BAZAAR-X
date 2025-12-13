import React, { useState, useEffect } from 'react';
import SellerOrders from './SellerOrders';
import CarbonAnalyticsSimple from './CarbonAnalyticsSimple';
import {
  Package,
  TrendingUp,
  ShoppingCart,
  Leaf,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  DollarSign,
  Users,
  Award,
  Target,
  Database,
  Bell,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  TrendingDown,
  Zap,
  Upload,
  Image,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus as PlusIcon,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  TreePine,
  Wind,
  Sun,
  Droplets,
  User,
  Ban,
  MessageCircle,
  X,
  Check
} from 'lucide-react';
import { authAPI, productsAPI, categoriesAPI, sellerAPI, adminAPI } from '../../services/api';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    carbonImpact: 0,
    pendingOrders: 0
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState({
    businessName: '',
    businessDescription: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    website: '',
    businessLicense: '',
    taxId: '',
    ecoCertification: '',
    isVerified: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState({
    imageType: 'upload'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Notification data
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  // Carbon Analytics Data
  const [carbonAnalytics, setCarbonAnalytics] = useState({
    totalCarbonSaved: 1250.5,
    carbonReductionPercentage: 18.2,
    monthlyCarbonTrend: [120, 135, 110, 95, 85, 78, 72, 68, 65, 62, 58, 55],
    categoryBreakdown: [
      { category: 'Clothing', carbonSaved: 320, percentage: 25.6 },
      { category: 'Personal Care', carbonSaved: 280, percentage: 22.4 },
      { category: 'Kitchen & Dining', carbonSaved: 240, percentage: 19.2 },
      { category: 'Bags & Accessories', carbonSaved: 200, percentage: 16.0 },
      { category: 'Electronics', carbonSaved: 160, percentage: 12.8 },
      { category: 'Other', carbonSaved: 50, percentage: 4.0 }
    ],
    environmentalImpact: {
      treesPlanted: 62,
      carsOffRoad: 0.3,
      energySaved: 1250,
      waterSaved: 2500
    }
  });

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    weight: '',
    shippingDistance: '',
    carbonFootprintScore: '',
    ecoFriendly: false,
    image: null,
    imageUrl: '',
    imageType: 'upload' // 'upload' or 'url'
  });

  useEffect(() => {
    loadDashboardData();
    if (currentUser && currentUser.userId) {
      loadNotifications();
    }
    
    // Set fallback categories immediately to ensure they're available
    const fallbackCategories = [
      { id: 1, name: "Electronics", description: "Electronic devices and gadgets", isActive: true },
      { id: 2, name: "Clothing", description: "Fashion and apparel", isActive: true },
      { id: 3, name: "Home & Garden", description: "Home improvement and gardening", isActive: true },
      { id: 4, name: "Books", description: "Books and publications", isActive: true },
      { id: 5, name: "Food & Beverages", description: "Organic and sustainable food products", isActive: true }
    ];
    
    // Set categories immediately as fallback
    setCategories(fallbackCategories);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.seller-notifications')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const statsResponse = await sellerAPI.getDashboardStats();
      setStats(statsResponse.data);

      // Load products
      const productsResponse = await productsAPI.getSellerProducts();
      setProducts(productsResponse.data);

      // Load orders
      const ordersResponse = await sellerAPI.getOrders();
      setOrders(ordersResponse.data);

      // Load categories
      try {
        const categoriesResponse = await categoriesAPI.getAllCategories();
        
        if (categoriesResponse.data && categoriesResponse.data.length > 0) {
          // If API returns categories, use them
          setCategories(categoriesResponse.data);
        } else {
          // If API returns empty or no data, use fallback
          const fallbackCategories = [
            { id: 1, name: "Electronics", description: "Electronic devices and gadgets", isActive: true },
            { id: 2, name: "Clothing", description: "Fashion and apparel", isActive: true },
            { id: 3, name: "Home & Garden", description: "Home improvement and gardening", isActive: true },
            { id: 4, name: "Books", description: "Books and publications", isActive: true },
            { id: 5, name: "Food & Beverages", description: "Organic and sustainable food products", isActive: true }
          ];
          setCategories(fallbackCategories);
        }
      } catch (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        // Use fallback categories if API fails
        const fallbackCategories = [
          { id: 1, name: "Electronics", description: "Electronic devices and gadgets", isActive: true },
          { id: 2, name: "Clothing", description: "Fashion and apparel", isActive: true },
          { id: 3, name: "Home & Garden", description: "Home improvement and gardening", isActive: true },
          { id: 4, name: "Books", description: "Books and publications", isActive: true },
          { id: 5, name: "Food & Beverages", description: "Organic and sustainable food products", isActive: true }
        ];
        setCategories(fallbackCategories);
      }

      // Load profile
      const profileResponse = await sellerAPI.getProfile();
      setProfile(profileResponse.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Get current user
  const currentUser = authAPI.getCurrentUser();
  
  // Helper function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return null;
    }
    // If it's a relative path (uploaded image), prepend backend URL
    if (imageUrl.startsWith('/uploads/')) {
      const fullUrl = `http://localhost:8080${imageUrl}`;
      return fullUrl;
    }
    // If it's already a full URL, return as is
    return imageUrl;
  };

  const loadNotifications = async () => {
    if (currentUser && currentUser.userId) {
      try {
        const [notificationsResponse, countResponse] = await Promise.all([
          adminAPI.getUserNotifications(currentUser.userId),
          adminAPI.getUnreadNotificationCount(currentUser.userId)
        ]);
        setNotifications(notificationsResponse.data);
        setUnreadCount(countResponse.data);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // If no notifications exist, try to seed them
        if (error.response?.status === 404 || notifications.length === 0) {
          try {
            await adminAPI.seedNotifications(currentUser.userId);
            // Reload notifications after seeding
            const [notificationsResponse, countResponse] = await Promise.all([
              adminAPI.getUserNotifications(currentUser.userId),
              adminAPI.getUnreadNotificationCount(currentUser.userId)
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
    if (currentUser && currentUser.userId) {
      try {
        await adminAPI.markAllNotificationsAsRead(currentUser.userId);
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
      console.error('❌ Error deleting seller notification:', error);
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
      case 'SELLER_APPROVAL': return <CheckCircle className="notification-type-icon" />;
      case 'PRODUCT_STATUS': return <Package className="notification-type-icon" />;
      case 'PRODUCT_APPROVAL': return <CheckCircle className="notification-type-icon" />;
      case 'PRODUCT_REJECTION': return <XCircle className="notification-type-icon" />;
      case 'PRODUCT_REMOVAL': return <AlertTriangle className="notification-type-icon" />;
      case 'ORDER': return <ShoppingCart className="notification-type-icon" />;
      case 'ACCOUNT_STATUS': return <User className="notification-type-icon" />;
      case 'ACCOUNT_BLOCKED': return <Ban className="notification-type-icon" />;
      default: return <Bell className="notification-type-icon" />;
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    window.location.href = '/auth';
  };



  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let productData;
      
      if (productForm.imageType === 'upload' && productForm.image) {
        // Handle file upload
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('categoryId', productForm.categoryId);
        formData.append('stockQuantity', productForm.stockQuantity);
        formData.append('weight', productForm.weight);
        formData.append('shippingDistance', productForm.shippingDistance);
        formData.append('carbonFootprintScore', productForm.carbonFootprintScore);
        formData.append('ecoFriendly', productForm.ecoFriendly);
        formData.append('image', productForm.image);
        productData = formData;
      } else {
        // Handle URL-based image
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('categoryId', productForm.categoryId);
        formData.append('stockQuantity', productForm.stockQuantity);
        formData.append('weight', productForm.weight);
        formData.append('shippingDistance', productForm.shippingDistance);
        formData.append('carbonFootprintScore', productForm.carbonFootprintScore);
        formData.append('ecoFriendly', productForm.ecoFriendly);
        if (productForm.imageUrl) {
          formData.append('imageUrl', productForm.imageUrl);
        }
        productData = formData;
      }

      await productsAPI.addSellerProduct(productData);
      
      setShowAddProduct(false);
      setProductForm({
        name: '', description: '', price: '', categoryId: '', 
        stockQuantity: '', weight: '', shippingDistance: '', 
        carbonFootprintScore: '', ecoFriendly: false, image: null,
        imageUrl: '', imageType: 'upload'
      });
      
      // Show success message
      setSuccessMessage('Product added successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      loadDashboardData();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    try {
      let productData;
      
      if (editingProduct.imageType === 'upload' && editingProduct.image) {
        // Handle file upload
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('description', editingProduct.description);
        formData.append('price', editingProduct.price);
        formData.append('categoryId', editingProduct.categoryId);
        formData.append('stockQuantity', editingProduct.stockQuantity);
        formData.append('weight', editingProduct.weight);
        formData.append('shippingDistance', editingProduct.shippingDistance);
        formData.append('carbonFootprintScore', editingProduct.carbonFootprintScore);
        formData.append('ecoFriendly', editingProduct.ecoFriendly);
        formData.append('image', editingProduct.image);
        productData = formData;
      } else {
        // Handle URL-based image
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('description', editingProduct.description);
        formData.append('price', editingProduct.price);
        formData.append('categoryId', editingProduct.categoryId);
        formData.append('stockQuantity', editingProduct.stockQuantity);
        formData.append('weight', editingProduct.weight);
        formData.append('shippingDistance', editingProduct.shippingDistance);
        formData.append('carbonFootprintScore', editingProduct.carbonFootprintScore);
        formData.append('ecoFriendly', editingProduct.ecoFriendly);
        if (editingProduct.imageUrl) {
          formData.append('imageUrl', editingProduct.imageUrl);
        }
        productData = formData;
      }

      await productsAPI.updateSellerProduct(editingProduct.id, productData);
      
      setShowEditProduct(false);
      setEditingProduct({});
      loadDashboardData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const openEditProductModal = (product) => {
    
    const editingData = {
      id: product.id,
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      categoryId: product.category?.id || '',
      stockQuantity: product.stockQuantity?.toString() || '',
      weight: product.weightKg?.toString() || '',
      shippingDistance: product.shippingDistanceKm?.toString() || '',
      carbonFootprintScore: product.carbonScore?.toString() || '',
      ecoFriendly: product.isEcoFriendly === true,
      imageUrl: product.imageUrl || '',
      image: null, // Reset file input
      imageType: product.imageUrl && (product.imageUrl.startsWith('http') || product.imageUrl.startsWith('https')) ? 'url' : 'upload'
    };
    
    setEditingProduct(editingData);
    setShowEditProduct(true);
  };

  const handleDeleteProduct = async () => {
    try {
      await productsAPI.deleteSellerProduct(selectedProduct.id);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };



  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await sellerAPI.updateProfile(updatedProfile);
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      loadDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await sellerAPI.updateOrderStatus(orderId, status);
      
      // Show success message
      setSuccessMessage(`Order status updated to ${status}!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      loadDashboardData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const handleStockUpdate = async (productId, newQuantity) => {
    try {
      await productsAPI.updateProductStock(productId, { stockQuantity: newQuantity });
      
      // Show success message
      setSuccessMessage(`Stock updated successfully!`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      loadDashboardData();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'SUSPENDED': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE':
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'SUSPENDED':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <header className="seller-header">
        <div className="seller-header-left">
          <div className="seller-logo">
            <img 
              src="/Main Navigator Logo.png" 
              alt="EcoBazaarX Logo" 
              className="seller-logo-image"
            />
          </div>
        </div>
        <div className="seller-header-right">
          <div className="seller-notifications" onClick={toggleNotifications}>
            <Bell className="seller-notification-icon" />
            {unreadCount > 0 && (
              <span className="seller-notification-badge">{unreadCount}</span>
            )}
            
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
          <div className="seller-user-info">
            <div className="seller-avatar">
              <img 
                src="/EcobazaarX Icon.ico" 
                alt="EcoBazaarX Icon" 
                className="seller-avatar-image"
              />
            </div>
            <div className="seller-user-details">
              <span className="seller-user-name">{profile.businessName || 'Seller'}</span>
              <span className="seller-user-role">Verified Seller</span>
            </div>
          </div>
          <button className="seller-logout-btn" onClick={handleLogout}>
            <LogOut className="seller-logout-icon" />
            Logout
          </button>
        </div>
      </header>

      <div className="seller-content">
        {/* Sidebar */}
        <aside className="seller-sidebar">
          <nav className="seller-nav">
            <button 
              className={`seller-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <TrendingUp className="seller-nav-icon" />
              Dashboard
            </button>
            <button 
              className={`seller-nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package className="seller-nav-icon" />
              Products
            </button>
            <button 
              className={`seller-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Database className="seller-nav-icon" />
              Inventory
            </button>
            <button 
              className={`seller-nav-item ${activeTab === 'carbon-analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('carbon-analytics')}
            >
              <BarChart3 className="seller-nav-icon" />
              Carbon Analytics
            </button>
            <button 
              className={`seller-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="seller-nav-icon" />
              Orders
            </button>
            <button 
              className={`seller-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <Settings className="seller-nav-icon" />
              Profile
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="seller-main">
          {loading && (
            <div className="seller-loading">
              <RefreshCw className="seller-loading-icon" />
              <span>Loading...</span>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="seller-dashboard-home">
              <div className="seller-page-header">
                <h2>Seller Dashboard</h2>
                <p>Manage your eco-friendly products and track your success</p>
                <button className="seller-refresh-btn" onClick={loadDashboardData}>
                  <RefreshCw className="seller-refresh-icon" />
                  Refresh Data
                </button>
              </div>

              {/* Stats Cards */}
              <div className="seller-stats-grid">
                <div className="seller-stat-card seller-stat-blue">
                  <div className="seller-stat-icon">
                    <Package className="seller-stat-icon-svg" />
                  </div>
                  <div className="seller-stat-content">
                    <h3>Total Products</h3>
                    <p className="seller-stat-value">{stats.totalProducts}</p>
                    <span className="seller-stat-change positive">+5.2%</span>
                  </div>
                </div>

                <div className="seller-stat-card seller-stat-green">
                  <div className="seller-stat-icon">
                    <CheckCircle className="seller-stat-icon-svg" />
                  </div>
                  <div className="seller-stat-content">
                    <h3>Active Products</h3>
                    <p className="seller-stat-value">{stats.activeProducts}</p>
                    <span className="seller-stat-change positive">+8.7%</span>
                  </div>
                </div>

                <div className="seller-stat-card seller-stat-purple">
                  <div className="seller-stat-icon">
                    <ShoppingCart className="seller-stat-icon-svg" />
                  </div>
                  <div className="seller-stat-content">
                    <h3>Total Sales</h3>
                    <p className="seller-stat-value">{stats.totalSales}</p>
                    <span className="seller-stat-change positive">+12.3%</span>
                  </div>
                </div>

                <div className="seller-stat-card seller-stat-emerald">
                  <div className="seller-stat-icon">
                    <DollarSign className="seller-stat-icon-svg" />
                  </div>
                  <div className="seller-stat-content">
                    <h3>Revenue</h3>
                    <p className="seller-stat-value">₹{stats.totalRevenue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <span className="seller-stat-change positive">+15.8%</span>
                  </div>
                </div>

                <div className="seller-stat-card seller-stat-orange">
                  <div className="seller-stat-icon">
                    <Leaf className="seller-stat-icon-svg" />
                  </div>
                  <div className="seller-stat-content">
                    <h3>Carbon Impact</h3>
                    <p className="seller-stat-value">{stats.carbonImpact.toFixed(2)}kg</p>
                    <span className="seller-stat-change negative">-18.2%</span>
                  </div>
                </div>

                <div className="seller-stat-card seller-stat-red">
                  <div className="seller-stat-icon">
                    <Clock className="seller-stat-icon-svg" />
                  </div>
                  <div className="seller-stat-content">
                    <h3>Pending Orders</h3>
                    <p className="seller-stat-value">{stats.pendingOrders}</p>
                    <span className="seller-stat-change neutral">New</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="seller-quick-actions">
                <h3>Quick Actions</h3>
                <div className="seller-actions-grid">
                  <button className="seller-action-btn" onClick={() => setActiveTab('products')}>
                    <Plus className="seller-action-icon" />
                    Add Product
                  </button>
                  <button className="seller-action-btn" onClick={() => setActiveTab('orders')}>
                    <ShoppingCart className="seller-action-icon" />
                    View Orders
                  </button>
                  <button className="seller-action-btn" onClick={() => setActiveTab('profile')}>
                    <Settings className="seller-action-icon" />
                    Update Profile
                  </button>
                  <button className="seller-action-btn" onClick={() => setActiveTab('inventory')}>
                    <Database className="seller-action-icon" />
                    Manage Inventory
                  </button>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="seller-recent-orders">
                <h3>Recent Orders</h3>
                <div className="seller-orders-list">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="seller-order-item">
                      <div className="seller-order-icon">
                        <ShoppingCart className="seller-order-icon-svg" />
                      </div>
                      <div className="seller-order-content">
                        <p>Order #{order.id} - {order.user?.firstName} {order.user?.lastName}</p>
                        <span className="seller-order-time">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`seller-order-status seller-order-status-${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Chart */}
              <div className="seller-sales-chart">
                <h3>Monthly Sales</h3>
                <div className="seller-chart-placeholder">
                  <TrendingUp className="seller-chart-icon" />
                  <span>Sales visualization will be implemented here</span>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="seller-products">
              <div className="seller-page-header">
                <h2>Product Management</h2>
                <p>Manage your product catalog and inventory</p>
                <button className="seller-add-btn" onClick={() => setShowAddProduct(true)}>
                  <Plus className="seller-add-icon" />
                  Add Product
                </button>
              </div>

              {/* Search and Filter */}
              <div className="seller-search-filter">
                <div className="seller-search">
                  <Search className="seller-search-icon" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="seller-search-input"
                  />
                </div>
                <div className="seller-filter">
                  <Filter className="seller-filter-icon" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="seller-filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="seller-table-container">
                <table className="seller-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Carbon Score</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="seller-product-info-cell">
                            <div className="seller-product-image">
                              {product.imageUrl ? (
                                <img src={getImageUrl(product.imageUrl)} alt={product.name} />
                              ) : (
                                <Image className="seller-product-placeholder" />
                              )}
                            </div>
                            <div>
                              <p className="seller-product-name">{product.name}</p>
                              <p className="seller-product-description">{product.description.substring(0, 50)}...</p>
                            </div>
                          </div>
                        </td>
                        <td>{product.category?.name || 'Unknown'}</td>
                        <td>₹{product.price.toLocaleString('en-IN')}</td>
                        <td>
                          <div className="seller-stock-controls">
                            <button 
                              className="seller-stock-btn"
                              onClick={() => handleStockUpdate(product.id, product.stockQuantity - 1)}
                            >
                              <Minus className="seller-stock-icon" />
                            </button>
                            <span className="seller-stock-value">{product.stockQuantity}</span>
                            <button 
                              className="seller-stock-btn"
                              onClick={() => handleStockUpdate(product.id, product.stockQuantity + 1)}
                            >
                              <PlusIcon className="seller-stock-icon" />
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className={`seller-status-badge seller-status-${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            {product.status}
                          </span>
                        </td>
                        <td>
                          <div className="seller-carbon-score">
                            <Leaf className="seller-carbon-icon" />
                            <span>{product.carbonScore}</span>
                            {product.isEcoFriendly && (
                              <span className="seller-eco-badge">Eco</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="seller-actions">
                            <button 
                              className="seller-edit-btn"
                                onClick={() => openEditProductModal(product)}
                            >
                              <Edit className="seller-action-icon" />
                            </button>
                            <button 
                              className="seller-delete-btn"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteModal(true);
                              }}
                            >
                              <Trash2 className="seller-action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Premium Inventory Management */}
          {activeTab === 'inventory' && (
            <div className="seller-inventory">
              <div className="seller-inventory-header">
                <div className="seller-inventory-title">
                  <div className="seller-inventory-icon-wrapper">
                    <div className="seller-inventory-main-icon">
                      <Package className="seller-inventory-main-icon-svg" />
                    </div>
                  </div>
                  <div className="seller-inventory-text">
                    <h2>Inventory Command Center</h2>
                    <p>Advanced inventory management with real-time analytics and smart stock optimization</p>
                  </div>
                </div>
                <div className="seller-inventory-actions">
                  <div className="seller-inventory-stats-mini">
                    <div className="seller-stat-mini">
                      <span className="seller-stat-mini-value">{products.length}</span>
                      <span className="seller-stat-mini-label">Total Products</span>
                    </div>
                    <div className="seller-stat-mini">
                      <span className="seller-stat-mini-value">₹{products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0).toLocaleString('en-IN')}</span>
                      <span className="seller-stat-mini-label">Inventory Value</span>
                    </div>
                    <div className="seller-stat-mini">
                      <span className="seller-stat-mini-value">{products.filter(p => p.stockQuantity < 10).length}</span>
                      <span className="seller-stat-mini-label">Low Stock Items</span>
                    </div>
                  </div>
                  <button className="seller-refresh-premium-btn" onClick={loadDashboardData}>
                    <div className="seller-btn-content">
                      <RefreshCw className="seller-btn-icon" />
                      <span>Refresh Data</span>
                    </div>
                    <div className="seller-btn-glow"></div>
                </button>
                </div>
              </div>

              {/* Premium Overview Cards */}
              <div className="seller-inventory-overview-premium">
                <div className="seller-inventory-card-premium seller-card-total">
                  <div className="seller-card-glow"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container">
                      <div className="seller-card-icon-bg">
                        <Package className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Total Products</h3>
                      <span className="seller-card-badge success">Active</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{products.length}</span>
                      <span className="seller-card-unit">Items</span>
                    </div>
                    <div className="seller-card-trend">
                      <TrendingUp className="seller-trend-icon" />
                      <span className="seller-trend-text">+12% this month</span>
                    </div>
                  </div>
                </div>

                <div className="seller-inventory-card-premium seller-card-warning">
                  <div className="seller-card-glow"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container">
                      <div className="seller-card-icon-bg">
                        <AlertTriangle className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse warning"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Low Stock Alert</h3>
                      <span className="seller-card-badge warning">Attention</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{products.filter(p => p.stockQuantity < 10).length}</span>
                      <span className="seller-card-unit">Items</span>
                    </div>
                    <div className="seller-card-trend warning">
                      <AlertTriangle className="seller-trend-icon" />
                      <span className="seller-trend-text">Need restocking</span>
                    </div>
                  </div>
                </div>

                <div className="seller-inventory-card-premium seller-card-critical">
                  <div className="seller-card-glow"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container">
                      <div className="seller-card-icon-bg">
                        <XCircle className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse critical"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Out of Stock</h3>
                      <span className="seller-card-badge critical">Critical</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{products.filter(p => p.stockQuantity === 0).length}</span>
                      <span className="seller-card-unit">Items</span>
                    </div>
                    <div className="seller-card-trend critical">
                      <TrendingDown className="seller-trend-icon" />
                      <span className="seller-trend-text">Immediate action</span>
                    </div>
                  </div>
                </div>

                <div className="seller-inventory-card-premium seller-card-value">
                  <div className="seller-card-glow"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container">
                      <div className="seller-card-icon-bg">
                        <DollarSign className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse success"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Inventory Value</h3>
                      <span className="seller-card-badge success">Total Worth</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">₹{products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0).toLocaleString('en-IN')}</span>
                      <span className="seller-card-unit">INR</span>
                    </div>
                    <div className="seller-card-trend success">
                      <TrendingUp className="seller-trend-icon" />
                      <span className="seller-trend-text">+8.5% growth</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="seller-low-stock-section">
                <div className="seller-section-header">
                  <h3>Low Stock Alerts</h3>
                  <span className="seller-alert-count">{products.filter(p => p.stockQuantity < 10).length} items need attention</span>
                </div>
                <div className="seller-alerts-grid">
                  {products.filter(p => p.stockQuantity < 10).map((product) => (
                    <div key={product.id} className="seller-alert-card">
                      <div className="seller-alert-header">
                        <div className="seller-alert-icon">
                          <AlertTriangle className="seller-alert-icon-svg" />
                        </div>
                        <div className="seller-alert-priority">
                          {product.stockQuantity === 0 ? 'Critical' : 'Low Stock'}
                        </div>
                      </div>
                      <div className="seller-alert-content">
                        <h4>{product.name}</h4>
                        <p className="seller-alert-category">{product.category?.name}</p>
                        <div className="seller-alert-stock">
                          <span className="seller-stock-level">Stock: {product.stockQuantity}</span>
                          <div className="seller-stock-bar">
                            <div 
                              className="seller-stock-fill" 
                              style={{width: `${Math.min((product.stockQuantity / 10) * 100, 100)}%`}}
                            ></div>
                          </div>
                        </div>
                        <p className="seller-alert-price">Price: ₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="seller-alert-actions">
                        <button 
                          className="seller-restock-btn seller-restock-small"
                          onClick={() => handleStockUpdate(product.id, product.stockQuantity + 10)}
                        >
                          <Plus className="seller-action-icon" />
                          Add 10
                        </button>
                        <button 
                          className="seller-restock-btn seller-restock-medium"
                          onClick={() => handleStockUpdate(product.id, product.stockQuantity + 25)}
                        >
                          <Plus className="seller-action-icon" />
                          Add 25
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.filter(p => p.stockQuantity < 10).length === 0 && (
                    <div className="seller-no-alerts">
                      <CheckCircle className="seller-no-alerts-icon" />
                      <h4>All Good!</h4>
                      <p>No low stock alerts at the moment</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Inventory Table */}
              <div className="seller-inventory-table-section">
                <div className="seller-section-header">
                  <h3>Complete Inventory</h3>
                  <div className="seller-inventory-filters">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="seller-search-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                      className="seller-filter-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Stock Levels</option>
                      <option value="low">Low Stock</option>
                      <option value="out">Out of Stock</option>
                      <option value="good">Good Stock</option>
                    </select>
                  </div>
                </div>
                <div className="seller-inventory-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Stock Level</th>
                        <th>Stock Status</th>
                        <th>Price</th>
                        <th>Value</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(product => {
                          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesFilter = 
                            filterStatus === 'all' ||
                            (filterStatus === 'low' && product.stockQuantity < 10) ||
                            (filterStatus === 'out' && product.stockQuantity === 0) ||
                            (filterStatus === 'good' && product.stockQuantity >= 10);
                          return matchesSearch && matchesFilter;
                        })
                        .map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="seller-product-info">
                              <img src={getImageUrl(product.imageUrl) || '/placeholder-product.jpg'} alt={product.name} className="seller-product-thumb" />
                              <div>
                                <h4>{product.name}</h4>
                                <p>{product.description.substring(0, 50)}...</p>
                              </div>
                            </div>
                          </td>
                          <td>{product.category?.name}</td>
                          <td>
                            <div className="seller-stock-display">
                              <span className="seller-stock-number">{product.stockQuantity}</span>
                              <div className="seller-stock-progress">
                                <div 
                                  className="seller-stock-progress-fill" 
                                  style={{
                                    width: `${Math.min((product.stockQuantity / 50) * 100, 100)}%`,
                                    backgroundColor: product.stockQuantity === 0 ? '#ef4444' : 
                                                   product.stockQuantity < 10 ? '#f59e0b' : '#10b981'
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`seller-stock-status seller-stock-${product.stockQuantity === 0 ? 'out' : product.stockQuantity < 10 ? 'low' : 'good'}`}>
                              {product.stockQuantity === 0 ? 'Out of Stock' : 
                               product.stockQuantity < 10 ? 'Low Stock' : 'Good Stock'}
                            </span>
                          </td>
                          <td>₹{product.price.toLocaleString('en-IN')}</td>
                          <td>₹{(product.price * product.stockQuantity).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td>
                            <div className="seller-inventory-actions">
                              <button 
                                className="seller-stock-btn seller-stock-add"
                                onClick={() => handleStockUpdate(product.id, product.stockQuantity + 5)}
                              >
                                <Plus className="seller-action-icon" />
                              </button>
                              <button 
                                className="seller-stock-btn seller-stock-edit"
                                onClick={() => openEditProductModal(product)}
                              >
                                <Edit className="seller-action-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Carbon Analytics */}
          {activeTab === 'carbon-analytics' && (
            <CarbonAnalyticsSimple 
              sellerId={currentUser?.userId} 
              sellerOrders={orders}
            />
          )}

          {/* Legacy Carbon Analytics - Hidden */}
          {false && activeTab === 'carbon-analytics-legacy' && (
            <div className="seller-carbon-analytics">
              <div className="seller-carbon-header">
                <div className="seller-carbon-title">
                  <div className="seller-carbon-icon-wrapper">
                    <div className="seller-carbon-main-icon">
                      <Leaf className="seller-carbon-main-icon-svg" />
                    </div>
                  </div>
                  <div className="seller-carbon-text">
                    <h2>Environmental Impact Intelligence</h2>
                    <p>Real-time sustainability analytics and carbon footprint optimization dashboard</p>
                  </div>
                </div>
                <div className="seller-carbon-actions">
                  <div className="seller-carbon-stats-mini">
                    <div className="seller-stat-mini eco">
                      <span className="seller-stat-mini-value">{carbonAnalytics.totalCarbonSaved.toFixed(1)}</span>
                      <span className="seller-stat-mini-label">kg CO₂ Saved</span>
                    </div>
                    <div className="seller-stat-mini eco">
                      <span className="seller-stat-mini-value">{carbonAnalytics.environmentalImpact.treesPlanted}</span>
                      <span className="seller-stat-mini-label">Trees Equivalent</span>
                    </div>
                    <div className="seller-stat-mini eco">
                      <span className="seller-stat-mini-value">-{carbonAnalytics.carbonReductionPercentage}%</span>
                      <span className="seller-stat-mini-label">Reduction</span>
                    </div>
                  </div>
                  <button className="seller-refresh-eco-btn" onClick={loadDashboardData}>
                    <div className="seller-btn-content">
                      <RefreshCw className="seller-btn-icon" />
                      <span>Refresh Analytics</span>
                    </div>
                    <div className="seller-btn-glow eco"></div>
                </button>
                </div>
              </div>

              {/* Premium Carbon Impact Cards */}
              <div className="seller-carbon-overview-premium">
                <div className="seller-carbon-card-premium seller-card-carbon-saved">
                  <div className="seller-card-glow eco"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container eco">
                      <div className="seller-card-icon-bg eco">
                        <TreePine className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse eco"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Carbon Eliminated</h3>
                      <span className="seller-card-badge eco">Impact</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{carbonAnalytics.totalCarbonSaved.toFixed(1)}</span>
                      <span className="seller-card-unit">kg CO₂</span>
                    </div>
                    <div className="seller-card-trend eco">
                      <TrendingDown className="seller-trend-icon" />
                      <span className="seller-trend-text">-{carbonAnalytics.carbonReductionPercentage}% reduction</span>
                    </div>
                  </div>
                </div>

                <div className="seller-carbon-card-premium seller-card-trees">
                  <div className="seller-card-glow forest"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container forest">
                      <div className="seller-card-icon-bg forest">
                        <Leaf className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse forest"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Trees Planted</h3>
                      <span className="seller-card-badge forest">Equivalent</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{carbonAnalytics.environmentalImpact.treesPlanted}</span>
                      <span className="seller-card-unit">Trees</span>
                    </div>
                    <div className="seller-card-trend forest">
                      <TreePine className="seller-trend-icon" />
                      <span className="seller-trend-text">Forest impact</span>
                    </div>
                  </div>
                </div>

                <div className="seller-carbon-card-premium seller-card-cars">
                  <div className="seller-card-glow sky"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container sky">
                      <div className="seller-card-icon-bg sky">
                        <Wind className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse sky"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Clean Air Days</h3>
                      <span className="seller-card-badge sky">Vehicle Free</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{carbonAnalytics.environmentalImpact.carsOffRoad}</span>
                      <span className="seller-card-unit">Days</span>
                    </div>
                    <div className="seller-card-trend sky">
                      <Activity className="seller-trend-icon" />
                      <span className="seller-trend-text">Car-free equivalent</span>
                    </div>
                  </div>
                </div>

                <div className="seller-carbon-card-premium seller-card-energy">
                  <div className="seller-card-glow solar"></div>
                  <div className="seller-card-header">
                    <div className="seller-card-icon-container solar">
                      <div className="seller-card-icon-bg solar">
                        <Sun className="seller-card-icon" />
                  </div>
                      <div className="seller-card-pulse solar"></div>
                    </div>
                    <div className="seller-card-meta">
                      <h3 className="seller-card-title">Clean Energy</h3>
                      <span className="seller-card-badge solar">Generated</span>
                    </div>
                  </div>
                  <div className="seller-card-content">
                    <div className="seller-card-value-container">
                      <span className="seller-card-value">{carbonAnalytics.environmentalImpact.energySaved}</span>
                      <span className="seller-card-unit">kWh</span>
                    </div>
                    <div className="seller-card-trend solar">
                      <Zap className="seller-trend-icon" />
                      <span className="seller-trend-text">Renewable power</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carbon Trend Chart */}
              <div className="seller-carbon-trend-section">
                <div className="seller-section-header">
                  <h3>Monthly Carbon Reduction Trend</h3>
                  <p>Track your progress in reducing carbon emissions over time</p>
                </div>
                <div className="seller-carbon-chart">
                  <div className="seller-chart-container">
                    <div className="seller-chart-header">
                      <div className="seller-chart-legend">
                        <div className="seller-legend-item">
                          <div className="seller-legend-color seller-legend-green"></div>
                          <span>Carbon Saved (kg CO₂)</span>
                        </div>
                      </div>
                    </div>
                    <div className="seller-chart-bars">
                      {carbonAnalytics.monthlyCarbonTrend.map((value, index) => (
                        <div key={index} className="seller-chart-bar-container">
                          <div className="seller-chart-bar">
                            <div 
                              className="seller-chart-bar-fill"
                              style={{height: `${(value / 150) * 100}%`}}
                            ></div>
                          </div>
                          <span className="seller-chart-label">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
                          <span className="seller-chart-value">{value} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="seller-carbon-breakdown-section">
                <div className="seller-section-header">
                  <h3>Carbon Savings by Category</h3>
                  <p>See which product categories contribute most to environmental impact</p>
                </div>
                <div className="seller-carbon-breakdown">
                  <div className="seller-pie-chart">
                    <div className="seller-pie-container">
                      {carbonAnalytics.categoryBreakdown.map((item, index) => (
                        <div 
                          key={index}
                          className="seller-pie-segment"
                          style={{
                            transform: `rotate(${index * (360 / carbonAnalytics.categoryBreakdown.length)}deg)`,
                            background: `conic-gradient(from ${index * (360 / carbonAnalytics.categoryBreakdown.length)}deg, 
                                         ${['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index]} 
                                         ${item.percentage}%, transparent ${item.percentage}%)`
                          }}
                        ></div>
                      ))}
                      <div className="seller-pie-center">
                        <span className="seller-pie-total">{carbonAnalytics.totalCarbonSaved.toFixed(0)}</span>
                        <span className="seller-pie-unit">kg CO₂</span>
                      </div>
                    </div>
                  </div>
                  <div className="seller-category-legend">
                    {carbonAnalytics.categoryBreakdown.map((item, index) => (
                      <div key={index} className="seller-category-item">
                        <div 
                          className="seller-category-color"
                          style={{backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index]}}
                        ></div>
                        <div className="seller-category-info">
                          <h4>{item.category}</h4>
                          <p>{item.carbonSaved} kg CO₂ saved ({item.percentage}%)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Environmental Impact Metrics */}
              <div className="seller-environmental-impact">
                <div className="seller-section-header">
                  <h3>Environmental Impact Metrics</h3>
                  <p>Real-world impact of your sustainable business practices</p>
                </div>
                <div className="seller-impact-grid">
                  <div className="seller-impact-card">
                    <div className="seller-impact-icon">
                      <TreePine className="seller-impact-icon-svg" />
                    </div>
                    <div className="seller-impact-content">
                      <h4>Trees Planted Equivalent</h4>
                      <p className="seller-impact-value">{carbonAnalytics.environmentalImpact.treesPlanted}</p>
                      <p className="seller-impact-description">
                        Your carbon savings are equivalent to planting {carbonAnalytics.environmentalImpact.treesPlanted} trees
                      </p>
                    </div>
                  </div>

                  <div className="seller-impact-card">
                    <div className="seller-impact-icon">
                      <Activity className="seller-impact-icon-svg" />
                    </div>
                    <div className="seller-impact-content">
                      <h4>Car Emissions Avoided</h4>
                      <p className="seller-impact-value">{carbonAnalytics.environmentalImpact.carsOffRoad} days</p>
                      <p className="seller-impact-description">
                        Equivalent to taking a car off the road for {carbonAnalytics.environmentalImpact.carsOffRoad} days
                      </p>
                    </div>
                  </div>

                  <div className="seller-impact-card">
                    <div className="seller-impact-icon">
                      <Zap className="seller-impact-icon-svg" />
                    </div>
                    <div className="seller-impact-content">
                      <h4>Energy Saved</h4>
                      <p className="seller-impact-value">{carbonAnalytics.environmentalImpact.energySaved} kWh</p>
                      <p className="seller-impact-description">
                        Clean energy equivalent to power a home for {Math.round(carbonAnalytics.environmentalImpact.energySaved / 30)} days
                      </p>
                    </div>
                  </div>

                  <div className="seller-impact-card">
                    <div className="seller-impact-icon">
                      <Droplets className="seller-impact-icon-svg" />
                    </div>
                    <div className="seller-impact-content">
                      <h4>Water Saved</h4>
                      <p className="seller-impact-value">{carbonAnalytics.environmentalImpact.waterSaved} liters</p>
                      <p className="seller-impact-description">
                        Water conservation through sustainable product choices
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sustainability Goals */}
              <div className="seller-sustainability-goals">
                <div className="seller-section-header">
                  <h3>Sustainability Goals & Achievements</h3>
                  <p>Track your progress towards environmental sustainability targets</p>
                </div>
                <div className="seller-goals-grid">
                  <div className="seller-goal-card">
                    <div className="seller-goal-header">
                      <h4>Carbon Neutral Goal</h4>
                      <span className="seller-goal-progress">75% Complete</span>
                    </div>
                    <div className="seller-goal-progress-bar">
                      <div className="seller-goal-progress-fill" style={{width: '75%'}}></div>
                    </div>
                    <p className="seller-goal-description">
                      Working towards becoming a carbon-neutral business by 2025
                    </p>
                  </div>

                  <div className="seller-goal-card">
                    <div className="seller-goal-header">
                      <h4>100% Eco-Friendly Products</h4>
                      <span className="seller-goal-progress">90% Complete</span>
                    </div>
                    <div className="seller-goal-progress-bar">
                      <div className="seller-goal-progress-fill" style={{width: '90%'}}></div>
                    </div>
                    <p className="seller-goal-description">
                      Converting all products to eco-friendly alternatives
                    </p>
                  </div>

                  <div className="seller-goal-card">
                    <div className="seller-goal-header">
                      <h4>Zero Waste Packaging</h4>
                      <span className="seller-goal-progress">60% Complete</span>
                    </div>
                    <div className="seller-goal-progress-bar">
                      <div className="seller-goal-progress-fill" style={{width: '60%'}}></div>
                    </div>
                    <p className="seller-goal-description">
                      Implementing sustainable packaging solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <SellerOrders />
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="seller-profile">
              <div className="seller-page-header">
                <h2>Seller Profile</h2>
                <p>Manage your business information and settings</p>
              </div>

              <div className="seller-profile-content">
                <div className="seller-profile-section">
                  <h3>Business Information</h3>
                  <div className="seller-profile-form">
                    <div className="seller-form-group">
                      <label>Business Name</label>
                      <input 
                        type="text" 
                        value={profile.businessName || ''} 
                        onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Business Description</label>
                      <textarea 
                        value={profile.businessDescription || ''} 
                        onChange={(e) => setProfile({...profile, businessDescription: e.target.value})}
                        className="seller-form-textarea"
                        rows="4"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Business Email</label>
                      <input 
                        type="email" 
                        value={profile.businessEmail || ''} 
                        onChange={(e) => setProfile({...profile, businessEmail: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Business Phone</label>
                      <input 
                        type="tel" 
                        value={profile.businessPhone || ''} 
                        onChange={(e) => setProfile({...profile, businessPhone: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Business Address</label>
                      <textarea 
                        value={profile.businessAddress || ''} 
                        onChange={(e) => setProfile({...profile, businessAddress: e.target.value})}
                        className="seller-form-textarea"
                        rows="3"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Website</label>
                      <input 
                        type="url" 
                        value={profile.website || ''} 
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Business License</label>
                      <input 
                        type="text" 
                        value={profile.businessLicense || ''} 
                        onChange={(e) => setProfile({...profile, businessLicense: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Tax ID</label>
                      <input 
                        type="text" 
                        value={profile.taxId || ''} 
                        onChange={(e) => setProfile({...profile, taxId: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <div className="seller-form-group">
                      <label>Eco Certification</label>
                      <input 
                        type="text" 
                        value={profile.ecoCertification || ''} 
                        onChange={(e) => setProfile({...profile, ecoCertification: e.target.value})}
                        className="seller-form-input"
                      />
                    </div>
                    <button 
                      className="seller-save-btn"
                      onClick={() => handleProfileUpdate(profile)}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="seller-success-notification">
          <CheckCircle className="seller-success-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="seller-modal-overlay">
          <div className="seller-modal">
            <div className="seller-modal-header">
              <h3>Add New Product</h3>
              <button 
                className="seller-modal-close"
                onClick={() => setShowAddProduct(false)}
              >
                <XCircle className="seller-modal-close-icon" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="seller-modal-form">
              <div className="seller-form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="seller-form-input"
                  required
                />
              </div>
              <div className="seller-form-group">
                <label>Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="seller-form-textarea"
                  rows="3"
                  required
                />
              </div>
              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
                <div className="seller-form-group">
                  <label>Category</label>
                  <select 
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                    className="seller-form-select"
                    required
                  >
                    <option value="">Select Category ({categories ? categories.length : 0} available)</option>
                    {categories && categories.length > 0 ? (
                      categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))
                    ) : (
                      <option value="" disabled>Loading categories...</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Stock Quantity</label>
                  <input 
                    type="number" 
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
                <div className="seller-form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={productForm.weight}
                    onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
              </div>
              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Shipping Distance (km)</label>
                  <input 
                    type="number" 
                    value={productForm.shippingDistance}
                    onChange={(e) => setProductForm({...productForm, shippingDistance: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
                <div className="seller-form-group">
                  <label>Carbon Footprint Score</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={productForm.carbonFootprintScore}
                    onChange={(e) => setProductForm({...productForm, carbonFootprintScore: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
              </div>
              <div className="seller-form-group">
                <label className="seller-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={productForm.ecoFriendly}
                    onChange={(e) => setProductForm({...productForm, ecoFriendly: e.target.checked})}
                    className="seller-checkbox"
                  />
                  Eco-friendly Product
                </label>
              </div>
              <div className="seller-form-group">
                <label>Product Image</label>
                <div className="seller-image-options">
                  <div className="seller-image-type-selector">
                    <label className="seller-radio-label">
                      <input 
                        type="radio" 
                        name="imageType"
                        value="upload"
                        checked={productForm.imageType === 'upload'}
                        onChange={(e) => setProductForm({...productForm, imageType: e.target.value})}
                      />
                      Upload Image
                    </label>
                    <label className="seller-radio-label">
                      <input 
                        type="radio" 
                        name="imageType"
                        value="url"
                        checked={productForm.imageType === 'url'}
                        onChange={(e) => setProductForm({...productForm, imageType: e.target.value})}
                      />
                      Image URL
                    </label>
                  </div>
                  
                  {productForm.imageType === 'upload' ? (
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setProductForm({...productForm, image: e.target.files[0]})}
                      className="seller-form-file"
                    />
                  ) : (
                    <input 
                      type="url" 
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({...productForm, imageUrl: e.target.value})}
                      className="seller-form-input"
                    />
                  )}
                  
                  {/* Image Preview */}
                  {(productForm.image || productForm.imageUrl) && (
                    <div className="seller-image-preview">
                      <img 
                        src={productForm.imageType === 'upload' && productForm.image 
                          ? URL.createObjectURL(productForm.image) 
                          : productForm.imageUrl
                        } 
                        alt="Preview" 
                        className="seller-preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="seller-modal-actions">
                <button type="button" className="seller-cancel-btn" onClick={() => setShowAddProduct(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="seller-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="seller-loading-spinner"></div>
                      Adding Product...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && (
        <div className="seller-modal-overlay">
          <div className="seller-modal">
            <div className="seller-modal-header">
              <h3>Edit Product</h3>
              <button 
                className="seller-modal-close"
                onClick={() => setShowEditProduct(false)}
              >
                <XCircle className="seller-modal-close-icon" />
              </button>
            </div>
            <form onSubmit={handleEditProduct} className="seller-modal-form">
              <div className="seller-form-group">
                <label>Product Name</label>
                <input 
                  type="text" 
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="seller-form-input"
                  required
                />
              </div>
              <div className="seller-form-group">
                <label>Description</label>
                <textarea 
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="seller-form-textarea"
                  rows="3"
                  required
                />
              </div>
              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
                <div className="seller-form-group">
                  <label>Category</label>
                  <select 
                    value={editingProduct.categoryId || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, categoryId: e.target.value})}
                    className="seller-form-select"
                    required
                  >
                    <option value="">Select Category ({categories ? categories.length : 0} available)</option>
                    {categories && categories.length > 0 ? (
                      categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))
                    ) : (
                      <option value="" disabled>Loading categories...</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Stock Quantity</label>
                  <input 
                    type="number" 
                    value={editingProduct.stockQuantity || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, stockQuantity: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
                <div className="seller-form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct.weight || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, weight: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
              </div>
              <div className="seller-form-row">
                <div className="seller-form-group">
                  <label>Shipping Distance (km)</label>
                  <input 
                    type="number" 
                    value={editingProduct.shippingDistance || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, shippingDistance: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
                <div className="seller-form-group">
                  <label>Carbon Footprint Score</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct.carbonFootprintScore || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, carbonFootprintScore: e.target.value})}
                    className="seller-form-input"
                    required
                  />
                </div>
              </div>
              <div className="seller-form-group">
                <label className="seller-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={editingProduct.ecoFriendly || false}
                    onChange={(e) => setEditingProduct({...editingProduct, ecoFriendly: e.target.checked})}
                    className="seller-checkbox"
                  />
                  Eco-friendly Product
                </label>
              </div>
              <div className="seller-form-group">
                <label>Product Image</label>
                <div className="seller-image-options">
                  <div className="seller-image-type-selector">
                    <label className="seller-radio-label">
                      <input 
                        type="radio" 
                        name="editImageType"
                        value="upload"
                        checked={editingProduct.imageType === 'upload'}
                        onChange={(e) => setEditingProduct({...editingProduct, imageType: e.target.value})}
                      />
                      Upload Image
                    </label>
                    <label className="seller-radio-label">
                      <input 
                        type="radio" 
                        name="editImageType"
                        value="url"
                        checked={editingProduct.imageType === 'url'}
                        onChange={(e) => setEditingProduct({...editingProduct, imageType: e.target.value})}
                      />
                      Image URL
                    </label>
                  </div>
                  
                  {editingProduct.imageType === 'upload' ? (
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.files[0]})}
                      className="seller-form-file"
                    />
                  ) : (
                    <input 
                      type="url" 
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                      className="seller-form-input"
                    />
                  )}
                  
                  {/* Image Preview */}
                  {(editingProduct.image || editingProduct.imageUrl) && (
                    <div className="seller-image-preview">
                      <img 
                        src={editingProduct.imageType === 'upload' && editingProduct.image 
                          ? URL.createObjectURL(editingProduct.image) 
                          : editingProduct.imageType === 'url' && editingProduct.imageUrl
                          ? editingProduct.imageUrl
                          : editingProduct.imageUrl
                          ? getImageUrl(editingProduct.imageUrl)
                          : null
                        } 
                        alt="Preview" 
                        className="seller-preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="seller-modal-actions">
                <button type="button" className="seller-cancel-btn" onClick={() => setShowEditProduct(false)}>
                  Cancel
                </button>
                <button type="submit" className="seller-submit-btn">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="seller-modal-overlay">
          <div className="seller-modal seller-delete-modal">
            <div className="seller-modal-header">
              <h3>Delete Product</h3>
              <button 
                className="seller-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <XCircle className="seller-modal-close-icon" />
              </button>
            </div>
            <div className="seller-modal-content">
              <AlertTriangle className="seller-delete-icon" />
              <p>Are you sure you want to delete "{selectedProduct?.name}"?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="seller-modal-actions">
              <button 
                className="seller-cancel-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="seller-delete-confirm-btn" 
                onClick={handleDeleteProduct}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default SellerDashboard;
