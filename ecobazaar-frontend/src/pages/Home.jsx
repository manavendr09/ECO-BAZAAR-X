import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  ArrowRight,
  Leaf,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle,
  Users,
  ShieldCheck,
  Package,
  Truck
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

// Image fallback component
const ImageWithFallback = ({ src, alt, className, fallback = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400" }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
    />
  );
};

// Product Card Component
const ProductCard = ({ product, onProductClick }) => {
  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
        fill={i < Math.floor(rating) ? "currentColor" : "none"}
      />
    ));

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 cursor-pointer"
      onClick={() => onProductClick(product.id)}
    >
      <div className="relative">
        {product.isEcoFriendly && (
          <div className="absolute top-3 left-3 bg-[#2E8B57] text-white text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Leaf size={12} /> Eco-Friendly
          </div>
        )}
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-56 object-cover" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-2 text-base line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-[#8B4513]">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onProductClick(product.id); }}
          className="w-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white py-3 rounded-xl hover:scale-105 transition-all"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleProductClick = (productId) => {
    const isAuthenticated = authAPI.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/auth', { state: { returnPath: `/product/${productId}` } });
      return;
    }
    navigate(`/product/${productId}`);
  };

  const handleShopNow = () => navigate('/products');
  const handleCategoryClick = (categoryId) => navigate(`/products?category=${categoryId}`);
  const handleSellerRegister = () => navigate('/auth?type=seller&register=true');
  const handleAboutClick = () => navigate('/about');
  const handleViewAll = () => navigate('/products');

  // 🔥  Admin Dashboard navigation
  const handleAdminAccess = () => navigate('/admin');

  useEffect(() => {
    setLoading(true);

    const mockProducts = [
      {
        id: 1,
        name: "Organic Cotton T-Shirt",
        price: 29.99,
        originalPrice: 35.99,
        rating: 4.5,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
        isEcoFriendly: true
      },
      {
        id: 2,
        name: "Bamboo Water Bottle",
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.8,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300",
        isEcoFriendly: true
      },
      {
        id: 3,
        name: "Solar Power Bank",
        price: 49.99,
        originalPrice: 59.99,
        rating: 4.3,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=300",
        isEcoFriendly: true
      },
      {
        id: 4,
        name: "Recycled Paper Notebook",
        price: 12.99,
        originalPrice: 15.99,
        rating: 4.6,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=300",
        isEcoFriendly: true
      }
    ];

    const mockCategories = [
      { id: 1, name: "Fashion", icon: "👕", count: 156 },
      { id: 2, name: "Home & Garden", icon: "🏡", count: 89 },
      { id: 3, name: "Electronics", icon: "📱", count: 234 },
      { id: 4, name: "Beauty", icon: "💄", count: 67 },
      { id: 5, name: "Sports", icon: "⚽", count: 45 },
      { id: 6, name: "Office", icon: "📚", count: 123 }
    ];

    setProducts(mockProducts);
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-t-4 border-b-4 border-green-700 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC]">

      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/90 to-[#8B4513]/70"></div>
        </div>

        <div className="text-center relative z-10 text-white px-4">
          <h1 className="text-6xl font-extrabold mb-6">
            Shop Sustainable,<br />
            <span className="text-[#F5DEB3]">Live Responsibly</span>
          </h1>

          <p className="text-xl mb-6">Eco-friendly verified products!</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={handleShopNow} className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold">
              Start Shopping
            </button>

            <button onClick={handleAboutClick} className="border-2 border-white px-8 py-4 rounded-xl font-bold">
              Learn More
            </button>

            /* {/* ⭐ Admin Dashboard Button */}
            {/* <button
              onClick={handleAdminAccess}
              className="border-2 border-yellow-300 text-yellow-300 px-6 py-3 rounded-xl font-bold"
            >
              Admin Dashboard
            </button> */}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-[#F5F5DC]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 max-w-7xl mx-auto gap-6 px-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl cursor-pointer text-center"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-green-700">{cat.name}</h3>
              <p className="text-sm text-[#8B4513]">{cat.count} items</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-[#E8D5C4]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-green-700">Featured Products</h2>
            <button onClick={handleViewAll} className="text-green-700 font-bold">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onProductClick={handleProductClick} />
            ))}
          </div>
        </div>
      </section>

      {/* HOT DEALS */}
      <section className="py-20 bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-5">Today's Hot Deals</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => handleProductClick(p.id)}
                className="bg-white text-black p-5 rounded-xl shadow-xl cursor-pointer"
              >
                <img src={p.image} className="w-full h-48 object-cover rounded-lg" />

                <h3 className="font-bold text-lg mt-3">{p.name}</h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(p.id);
                  }}
                  className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
                >
                  Grab Deal
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-700 text-center text-white">
        <h2 className="text-5xl font-bold">Ready to Make a Difference?</h2>
        <button
          onClick={handleShopNow}
          className="mt-6 bg-white text-green-700 px-10 py-4 rounded-xl font-bold"
        >
          Start Shopping →
        </button>
      </section>

    </div>
  );
};

export default Home;

