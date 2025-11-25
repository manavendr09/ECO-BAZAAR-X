import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Leaf,
  Award,
  Shield,
  CreditCard,
  Heart,
  Package,
  Settings,
  LogOut,
  Camera,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  BarChart3,
  TreePine,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { customerAPI, authAPI } from '../services/api';
import CarbonScore from '../components/common/CarbonScore';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({});
  const [carbonAnalytics, setCarbonAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);

  const currentUser = authAPI.getCurrentUser();

  useEffect(() => {
    if (currentUser && currentUser.userId && !dataLoaded) {
      loadProfileData();
    }
  }, [currentUser?.userId, dataLoaded]); // Only depend on userId, not the entire object

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      const [profileResponse, analyticsResponse] = await Promise.all([
        customerAPI.getCustomerProfile(currentUser.userId),
        customerAPI.getCarbonAnalytics(currentUser.userId)
      ]);
      
      
      setProfile(profileResponse.data);
      setCarbonAnalytics(analyticsResponse.data);
      setFormData(profileResponse.data);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Failed to load profile data');
      // Set default values to prevent undefined errors
      setProfile({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: null,
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        emailNotifications: true,
        smsNotifications: false,
        newsletter: true,
        ecoTips: true
      });
      setCarbonAnalytics({
        totalCarbonSaved: 0,
        totalCarbonEmitted: 0,
        totalOrders: 0,
        ecoFriendlyOrders: 0,
        averageCarbonPerOrder: 0,
        orderHistory: [],
        monthlyData: [],
        ecoPoints: 0,
        treesEquivalent: 0
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: null,
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
      ecoTips: true
      });
      setDataLoaded(true); // Still mark as loaded to prevent infinite retries
      } finally {
        setLoading(false);
      }
    };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      await customerAPI.updateCustomerProfile(currentUser.userId, formData);
      
      setProfile(formData);
      setEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
    setError('');
  };

  const handleRefresh = async () => {
    setDataLoaded(false);
    await loadProfileData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Don't render if no user or data not loaded
  if (!currentUser || !dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and view your environmental impact</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Carbon Analytics
              </button>
            </nav>
        </div>
      </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                    <button
                        onClick={handleSave}
                      disabled={saving}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </button>
                  </div>
                )}
              </div>

                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Profile updated successfully!</span>
                  </motion.div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-800">{error}</span>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-4">
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {editing ? (
                    <input
                      type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.firstName || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.lastName || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-gray-900">{profile.email || 'Not provided'}</p>
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {editing ? (
                    <input
                      type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{formatDate(profile.dateOfBirth)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  {editing ? (
                    <input
                      type="text"
                            name="streetAddress"
                            value={formData.streetAddress || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.streetAddress || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  {editing ? (
                    <input
                      type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.city || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  {editing ? (
                    <input
                      type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.state || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  {editing ? (
                    <input
                      type="text"
                            name="zipCode"
                            value={formData.zipCode || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.zipCode || 'Not provided'}</p>
                  )}
                </div>
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  {editing ? (
                    <input
                      type="text"
                            name="country"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                          <p className="text-gray-900">{profile.country || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
                </div>

                {/* Notification Preferences */}
                {editing && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={formData.emailNotifications || false}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Email Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={formData.smsNotifications || false}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">SMS Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={formData.newsletter || false}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Newsletter</span>
                      </label>
                      <label className="flex items-center">
                      <input
                        type="checkbox"
                          name="ecoTips"
                          checked={formData.ecoTips || false}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="text-sm text-gray-700">Eco Tips</span>
                      </label>
                      </div>
                  </div>
                )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* User Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-green-600" />
              </div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile.firstName || 'User'} {profile.lastName || ''}</h3>
              <p className="text-gray-600">Customer</p>
                  <p className="text-sm text-gray-500 mt-2">Member since {formatDate(profile.createdAt)}</p>
            </div>
              </div>
              
              {/* Eco Impact */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Eco Impact</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleRefresh}
                      className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </button>
                  </div>
                </div>
              <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{carbonAnalytics?.totalCarbonSaved?.toFixed(1) || 0}kg</div>
                  <div className="text-sm text-gray-600">Carbon Saved</div>
                </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{carbonAnalytics?.ecoPoints || profile?.ecoPoints || 0}</div>
                  <div className="text-sm text-gray-600">Eco Points</div>
                  <div className="text-xs text-gray-500">From analytics: {carbonAnalytics?.ecoPoints || 0} | From profile: {profile?.ecoPoints || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{carbonAnalytics?.treesEquivalent || 0}</div>
                    <div className="text-sm text-gray-600">Trees Equivalent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carbon Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Carbon Saved</p>
                    <p className="text-2xl font-bold text-gray-900">{carbonAnalytics?.totalCarbonSaved?.toFixed(1) || 0}kg</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{carbonAnalytics?.totalOrders || 0}</p>
                  </div>
                </div>
                </div>
                
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Eco Points</p>
                    <p className="text-2xl font-bold text-gray-900">{carbonAnalytics?.ecoPoints || 0}</p>
                  </div>
                </div>
                </div>
                
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TreePine className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Trees Equivalent</p>
                    <p className="text-2xl font-bold text-gray-900">{carbonAnalytics?.treesEquivalent || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            {carbonAnalytics?.orderHistory && carbonAnalytics.orderHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order History</h3>
                <div className="space-y-4">
                  {carbonAnalytics.orderHistory.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                          <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Carbon Score</p>
                            <p className="font-semibold text-gray-900">{order.carbonScore}kg</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Eco Points</p>
                            <p className="font-semibold text-green-600">+{order.ecoPointsEarned}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="font-semibold text-gray-900">₹{order.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monthly Data Chart Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Carbon Impact</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Chart visualization coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;