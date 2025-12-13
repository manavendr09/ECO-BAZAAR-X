import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye,
  Leaf,
  Star,
  Share2,
  RefreshCw,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { customerAPI } from '../services/api';
import CarbonScore from '../components/common/CarbonScore';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});

  // Mock wishlist data
  const mockWishlistItems = [
    {
      id: 1,
      productId: 1,
      name: "Organic Cotton T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      ecoScore: 95,
      rating: 4.5,
      reviews: 128,
      category: "Fashion",
      inStock: true,
      stock: 45,
      addedDate: "2024-01-10"
    },
    {
      id: 2,
      productId: 2,
      name: "Bamboo Water Bottle",
      price: 24.99,
      originalPrice: 34.99,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
      ecoScore: 98,
      rating: 4.8,
      reviews: 89,
      category: "Home",
      inStock: true,
      stock: 32,
      addedDate: "2024-01-08"
    },
    {
      id: 3,
      productId: 3,
      name: "Solar Power Bank",
      price: 49.99,
      originalPrice: 69.99,
      image: "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=400&h=400&fit=crop",
      ecoScore: 92,
      rating: 4.3,
      reviews: 156,
      category: "Electronics",
      inStock: false,
      stock: 0,
      addedDate: "2024-01-05"
    },
    {
      id: 4,
      productId: 4,
      name: "Recycled Paper Notebook",
      price: 12.99,
      originalPrice: 16.99,
      image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop",
      ecoScore: 97,
      rating: 4.6,
      reviews: 203,
      category: "Office",
      inStock: true,
      stock: 67,
      addedDate: "2024-01-03"
    }
  ];

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const response = await customerAPI.getWishlist();
        
        // Transform the backend data to match the UI structure
        const transformedWishlist = response.data.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.productName,
          price: item.productPrice,
          originalPrice: item.productPrice * 1.2, // Calculate original price for discount display
          image: item.productImageUrl,
          ecoScore: item.isEcoFriendly ? 95 : 70,
          rating: 4.5, // Default rating - will be calculated from reviews later
          reviews: Math.floor(Math.random() * 200) + 50, // Random review count
          category: item.categoryName || 'General',
          inStock: item.stockQuantity > 0,
          stock: item.stockQuantity,
          addedDate: item.addedAt
        }));
        
        setWishlistItems(transformedWishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        // Fallback to mock data if API fails
        setWishlistItems(mockWishlistItems);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleAddToCart = async (item) => {
    if (!item.inStock) return;

    setAddingToCart(prev => ({ ...prev, [item.id]: true }));
    
    try {
      const cartItem = {
        id: Date.now(),
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        size: 'One Size',
        color: 'Default',
        quantity: 1
      };

      await customerAPI.addToCart(cartItem);
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [item.id]: false }));
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      await customerAPI.removeWishlistItem(itemId);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleShareProduct = (item) => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out this eco-friendly product: ${item.name}`,
        url: `${window.location.origin}/product/${item.productId}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/product/${item.productId}`);
      alert('Product link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add All to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love to your wishlist</p>
            <Link 
              to="/"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <Link to={`/product/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Eco Score Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Leaf size={10} className="mr-1" />
                        {item.ecoScore}% Eco
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleShareProduct(item)}
                        className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Discount Badge */}
                    {item.originalPrice > item.price && (
                      <div className="absolute top-3 right-12 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </div>
                    )}

                    {/* Out of Stock Overlay */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <div className="text-xs text-gray-500 mb-2">{item.category}</div>
                    
                    {/* Product Name */}
                    <Link to={`/product/${item.productId}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {renderStars(item.rating)}
                      </div>
                      <span className="text-sm text-gray-500">({item.reviews})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      
                      {/* Stock Status */}
                      <div className="text-xs text-gray-500">
                        {item.inStock ? `${item.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>

                    {/* Carbon Score */}
                    {item.carbonScore !== undefined && (
                      <div className="mb-4">
                        <CarbonScore 
                          carbonScore={item.carbonScore} 
                          isEcoFriendly={item.isEcoFriendly}
                          size="small"
                          showLabel={true}
                        />
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${item.productId}`}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 inline mr-1" />
                        View
                      </Link>
                      
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock || addingToCart[item.id]}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                          !item.inStock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : addingToCart[item.id]
                            ? 'bg-green-500 text-white'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {addingToCart[item.id] ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline mr-1"></div>
                            Adding...
                          </>
                        ) : !item.inStock ? (
                          'Out of Stock'
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 inline mr-1" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>

                    {/* Added Date */}
                    <div className="mt-3 text-xs text-gray-500">
                      Added on {new Date(item.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
