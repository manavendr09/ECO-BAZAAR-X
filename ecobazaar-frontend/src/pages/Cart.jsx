import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Leaf,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { customerAPI } from '../services/api';
import GreenerAlternative from '../components/cart/GreenerAlternative';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await customerAPI.getCart();
        setCartItems(response.data || []);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
    
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      loadCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await customerAPI.updateCartItem(id, { quantity: newQuantity });
      const response = await customerAPI.getCart();
      setCartItems(response.data || []);
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id) => {
    try {
      await customerAPI.removeFromCart(id);
      const response = await customerAPI.getCart();
      setCartItems(response.data || []);
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleReplaceItem = async (newItem) => {
    // Reload cart after replacement
    const response = await customerAPI.getCart();
    setCartItems(response.data || []);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 size={64} className="mx-auto text-gray-400 mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading your cart...</h2>
            <p className="text-gray-600">Please wait while we fetch your cart items.</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/"
              className="btn-primary inline-flex items-center"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || item.imageUrl || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      {item.ecoScore && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="eco-badge">
                            <Leaf size={12} className="inline mr-1" />
                            {item.ecoScore}% Eco
                          </span>
                        </div>
                      )}
                      <div className="text-lg font-bold text-gray-900">
                        ₹{Number(item.price).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Greener Alternative Suggestion */}
                  <GreenerAlternative
                    productId={item.productId || item.id}
                    currentProduct={item}
                    onReplace={handleReplaceItem}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                
                {/* Carbon Impact Summary */}
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Environmental Impact</h3>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Carbon Impact</span>
                        <span className="text-sm font-semibold text-green-600">
                          {cartItems.reduce((sum, item) => sum + ((item.carbonScore || 2.5) * item.quantity), 0).toFixed(1)} kg CO₂
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-green-600">
                        <Leaf size={12} className="mr-1" />
                        <span>Eco-friendly purchase! You're helping the planet.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 text-center block"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Free shipping on orders over ₹2000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
