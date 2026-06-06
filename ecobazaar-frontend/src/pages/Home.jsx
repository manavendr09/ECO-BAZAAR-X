import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Leaf, 
  ChevronRight, 
  ChevronLeft, 
  TrendingUp,
  ShoppingBag,
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

/* Image fallback component */
const ImageWithFallback = ({
  src,
  alt,
  className,
  fallback = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"
}) => {
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

/* Product Card Component */
const ProductCard = ({ product, onProductClick }) => {
  const primaryColor = '#234DB8';
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => onProductClick(product.id)}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="relative overflow-hidden">
        <div className="absolute top-3 left-3 z-10">
          {product.isEcoFriendly && (
            <span 
              className="text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Leaf size={12} /> Eco-Friendly
            </span>
          )}
        </div>
        
        {product.discount && (
          <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            -{product.discount}%
          </div>
        )}
        
        <div className="aspect-square overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm md:text-base">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.floor(product.rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            {product.deliveryTime}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* Category Card Component */
const CategoryCard = ({ category, onClick }) => {
  const primaryColor = '#234DB8';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl cursor-pointer border border-gray-100 text-center group"
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${primaryColor}15` }}
      >
        <div className="text-3xl">{category.icon}</div>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
      <p className="text-sm text-gray-500">{category.count}+ items</p>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const primaryColor = '#234DB8';
  const gradientFrom = primaryColor;
  const gradientTo = '#3B82F6';

  /* HERO SLIDER DATA - Smaller Height */
  const heroSlides = [
    {
      id: 1,
      title: "Sustainable Shopping Redefined",
      subtitle: "Discover eco-friendly products that care for our planet",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920",
      cta: "Explore Collection"
    },
    {
      id: 2,
      title: "Smart Green Living",
      subtitle: "Innovative solutions for an eco-conscious lifestyle",
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1920",
      cta: "Shop Now"
    },
    {
      id: 3,
      title: "Premium Sustainable Brands",
      subtitle: "Curated selection of environmentally responsible products",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1920",
      cta: "View Brands"
    }
  ];

  const handleProductClick = (productId) => {
    const isAuthenticated = authAPI.isAuthenticated();
    if (!isAuthenticated) {
      navigate('/auth', { state: { returnPath: `/product/${productId}` } });
      return;
    }
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryId) => navigate(`/products?category=${categoryId}`);
  const handleShopNow = () => navigate('/products');
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    setProducts([
      {
        id: 1,
        name: "Organic Cotton T-Shirt",
        price: 29.99,
        originalPrice: 35.99,
        rating: 4.5,
        reviews: 128,
        discount: 15,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        isEcoFriendly: true,
        deliveryTime: "2-4 days"
      },
      {
        id: 2,
        name: "Bamboo Water Bottle",
        price: 24.99,
        originalPrice: 29.99,
        rating: 4.8,
        reviews: 89,
        discount: 20,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
        isEcoFriendly: true,
        deliveryTime: "1-3 days"
      },
      {
        id: 3,
        name: "Solar Power Bank 10000mAh",
        price: 49.99,
        originalPrice: 59.99,
        rating: 4.3,
        reviews: 156,
        discount: 10,
        image: "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=400",
        isEcoFriendly: true,
        deliveryTime: "3-5 days"
      },
      {
        id: 4,
        name: "Recycled Paper Notebook Set",
        price: 12.99,
        originalPrice: 15.99,
        rating: 4.6,
        reviews: 203,
        discount: 25,
        image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400",
        isEcoFriendly: true,
        deliveryTime: "2-4 days"
      },
      {
        id: 5,
        name: "Biodegradable Phone Case",
        price: 18.99,
        originalPrice: 24.99,
        rating: 4.7,
        reviews: 94,
        discount: 15,
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
        isEcoFriendly: true,
        deliveryTime: "1-2 days"
      },
      {
        id: 6,
        name: "Natural Bamboo Toothbrush Set",
        price: 9.99,
        originalPrice: 14.99,
        rating: 4.4,
        reviews: 167,
        discount: 30,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
        isEcoFriendly: true,
        deliveryTime: "2-3 days"
      },
      {
        id: 7,
        name: "Eco-Friendly Laundry Detergent",
        price: 22.99,
        originalPrice: 27.99,
        rating: 4.8,
        reviews: 211,
        discount: 18,
        image: "https://images.unsplash.com/photo-1583845110435-4c0e475c4b40?w=400",
        isEcoFriendly: true,
        deliveryTime: "3-6 days"
      },
      {
        id: 8,
        name: "Sustainable Coffee Maker",
        price: 89.99,
        originalPrice: 109.99,
        rating: 4.9,
        reviews: 78,
        discount: 20,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        isEcoFriendly: true,
        deliveryTime: "5-7 days"
      }
    ]);

    setCategories([
      { id: 1, name: "Electronics", icon: "🔌", count: 156 },
      { id: 2, name: "Home & Garden", icon: "🏡", count: 89 },
      { id: 3, name: "Fashion", icon: "👕", count: 234 },
      { id: 4, name: "Beauty & Care", icon: "💄", count: 67 },
      { id: 5, name: "Sports", icon: "⚽", count: 45 },
      { id: 6, name: "Office", icon: "📚", count: 123 },
      { id: 7, name: "Kids", icon: "🧸", count: 92 },
      { id: 8, name: "Pet Care", icon: "🐾", count: 34 }
    ]);

    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div 
            className="w-16 h-16 rounded-full animate-spin border-4 border-t-transparent"
            style={{ borderColor: `${primaryColor}20`, borderTopColor: primaryColor }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* SMALLER HERO SLIDER (Less than half screen) */}
      <section className="relative h-[40vh] md:h-[45vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent" />
                </div>
                
                <div className="relative h-full flex items-center">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-xl"
                    >
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-white text-sm font-medium">Sustainable Choice</span>
                      </div>
                      
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      
                      <p className="text-lg text-gray-200 mb-6">
                        {slide.subtitle}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleShopNow}
                          className="px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2"
                          style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`, color: 'white' }}
                        >
                          <ShoppingBag size={18} />
                          {slide.cta}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/categories')}
                          className="px-6 py-3 rounded-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all"
                        >
                          Browse Categories
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide 
                  ? "scale-125" 
                  : "scale-100"
              }`}
              style={{
                backgroundColor: i === currentSlide ? 'white' : 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* QUICK STATS BAR */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold" style={{ color: primaryColor }}>500+</div>
              <div className="text-xs md:text-sm text-gray-600">Eco Brands</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold" style={{ color: primaryColor }}>10K+</div>
              <div className="text-xs md:text-sm text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold" style={{ color: primaryColor }}>50K+</div>
              <div className="text-xs md:text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold" style={{ color: primaryColor }}>100%</div>
              <div className="text-xs md:text-sm text-gray-600">Carbon Neutral</div>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION - Now right after hero */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
              <p className="text-gray-600">Browse our sustainable categories</p>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center gap-1 font-semibold hover:gap-2 transition-all text-sm md:text-base"
              style={{ color: primaryColor }}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <CategoryCard 
                  category={category} 
                  onClick={() => handleCategoryClick(category.id)} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Curated sustainable products</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-1 font-semibold hover:gap-2 transition-all text-sm md:text-base"
              style={{ color: primaryColor }}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard 
                  product={product} 
                  onProductClick={handleProductClick} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING DEALS */}
      <section className="py-12" style={{ backgroundColor: `${primaryColor}05` }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <TrendingUp size={18} style={{ color: primaryColor }} />
                <span className="font-semibold" style={{ color: primaryColor }}>Trending Now</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Today's Hot Deals</h2>
            </div>
            <div className="text-sm text-gray-600">Limited time offers</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      Limited Time
                    </span>
                  </div>
                  <div className="aspect-square">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleProductClick(product.id)}
                      className="px-3 py-1.5 rounded-lg font-semibold text-sm hover:scale-105 transition-transform"
                      style={{ 
                        backgroundColor: primaryColor,
                        color: 'white'
                      }}
                    >
                      Grab Deal
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920"
            className="w-full h-full object-cover"
            alt="Join the movement"
          />
          <div className="absolute inset-0" style={{ backgroundColor: primaryColor, opacity: 0.9 }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Make Every Purchase Count
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of eco-conscious shoppers making a difference
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShopNow}
                className="px-8 py-3 rounded-lg font-semibold bg-white shadow-lg flex items-center justify-center gap-2"
                style={{ color: primaryColor }}
              >
                <ShoppingBag size={18} />
                Start Shopping
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;