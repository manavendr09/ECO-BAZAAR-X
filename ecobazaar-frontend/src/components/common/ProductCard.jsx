import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Leaf,
  Eye,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { customerAPI, authAPI } from '../../services/api';
import CarbonScore from './CarbonScore';

const ProductCard = ({ product, showQuickView = true, showAddToCart = true }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();
  
  // Helper function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // If it's a relative path (uploaded image), prepend backend URL
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8080${imageUrl}`;
    }
    // If it's already a full URL, return as is
    return imageUrl;
  };

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (isAuthenticated) {
      checkWishlistStatus();
    }
  }, [product.id, isAuthenticated]);

  const checkWishlistStatus = async () => {
    try {
      setIsCheckingWishlist(true);
      const response = await customerAPI.checkWishlistStatus(product.id);
      setIsWishlisted(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    } finally {
      setIsCheckingWishlist(false);
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

  const getEcoPoints = (carbonScore, price) => {
    // Only eco-friendly products (carbon score <= 3) earn points
    if (carbonScore <= 3) {
      // 10% of product price as eco points (1 point = ₹1)
      return Math.floor(price * 0.10);
    }
    return 0;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/auth', { state: { returnPath: `/product/${product.id}` } });
      return;
    }
    
    setIsAddingToCart(true);
    try {
      const cartItem = {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.sizes?.[0] || 'One Size',
        color: product.colors?.[0] || 'Default',
        quantity: 1
      };

      await customerAPI.addToCart(cartItem);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/auth', { state: { returnPath: `/product/${product.id}` } });
      return;
    }

    try {
      if (isWishlisted) {
        await customerAPI.removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        await customerAPI.addToWishlist(product.id);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={getImageUrl(product.imageUrl) || product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Eco Score Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Leaf size={10} className="mr-1" />
              {product.ecoScore}% Eco
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
            </button>
            
            {showQuickView && (
              <Link
                to={`/product/${product.id}`}
                className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Eye size={14} />
              </Link>
            )}
          </div>

          {/* Discount Badge */}
          {product.originalPrice > product.price && (
            <div className="absolute top-3 right-12 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}

          {/* Stock Status */}
          {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Only {product.stockQuantity} left
              </span>
            </div>
          )}

          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-2">{product.category}</div>
        
        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          
          {/* Shipping Info */}
          <div className="text-xs text-green-600 font-medium">
            {product.shipping}
          </div>
        </div>

        {/* Carbon Score */}
        {product.carbonScore !== undefined && (
          <div className="mb-4">
            <CarbonScore 
              carbonScore={product.carbonScore} 
              isEcoFriendly={product.isEcoFriendly}
              size="small"
              showLabel={true}
            />
          </div>
        )}

        {/* Eco Points */}
        {product.carbonScore !== undefined && (
          <div className="mb-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Eco Points</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  +{getEcoPoints(product.carbonScore, product.price)}
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Earn {getEcoPoints(product.carbonScore, product.price)} points for this eco-friendly purchase
              </p>
            </div>
          </div>
        )}
        
        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stockQuantity === 0}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
              product.stockQuantity === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAddingToCart
                ? 'bg-green-500 text-white'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : product.stockQuantity === 0 ? (
              'Out of Stock'
            ) : !isAuthenticated ? (
              <>
                <ShoppingCart size={16} className="mr-2" />
                Login to Add
              </>
            ) : (
              <>
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </>
            )}
          </button>
        )}

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-center text-sm text-green-600 font-medium"
          >
            ✓ Added to cart!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;

