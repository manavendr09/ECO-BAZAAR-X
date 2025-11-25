// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   Star,
//   ShoppingCart,
//   Heart,
//   ArrowRight,
//   Leaf,
//   Zap,
//   TrendingUp,
//   Award,
//   Sparkles,
//   CheckCircle,
//   Users,
//   ShieldCheck
// } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { productsAPI, categoriesAPI, authAPI } from '../services/api';
// import ProductCard from '../components/common/ProductCard';
// import CarbonScore from '../components/common/CarbonScore';

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const isAuthenticated = authAPI.isAuthenticated();

//   // Load data from API
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError('');
        
//         // Load products and categories in parallel
//         const [productsResponse, categoriesResponse] = await Promise.all([
//           productsAPI.getAllProducts(),
//           categoriesAPI.getAllCategories()
//         ]);
        
//         // Transform product data to match expected format
//         const transformedProducts = productsResponse.data.map(product => ({
//           id: product.id,
//           name: product.name,
//           description: product.description,
//           price: product.price,
//           originalPrice: product.price * 1.2,
//           rating: 4.5,
//           reviews: Math.floor(Math.random() * 200) + 50,
//           image: product.imageUrl,
//           ecoScore: product.isEcoFriendly ? 95 : 70,
//           category: product.category?.name || 'General',
//           carbonScore: product.carbonScore,
//           isEcoFriendly: product.isEcoFriendly,
//           stockQuantity: product.stockQuantity,
//           sellerId: product.seller?.id
//         }));
        
//         // Transform category data
//         const transformedCategories = categoriesResponse.data.map(category => ({
//           id: category.id,
//           name: category.name,
//           icon: getCategoryIcon(category.name),
//           count: transformedProducts.filter(p => p.category === category.name).length
//         }));
        
//         setProducts(transformedProducts);
//         setCategories(transformedCategories);
//       } catch (err) {
//         console.error('Error loading data:', err);
//         setError('Failed to load products and categories. Please try again later.');
        
//         // Fallback to mock data if API fails
//         setProducts([
//           {
//             id: 1,
//             name: "Organic Cotton T-Shirt",
//             price: 29.99,
//             originalPrice: 39.99,
//             rating: 4.5,
//             reviews: 128,
//             image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
//             ecoScore: 95,
//             category: "Fashion"
//           },
//           {
//             id: 2,
//             name: "Bamboo Water Bottle",
//             price: 24.99,
//             originalPrice: 34.99,
//             rating: 4.8,
//             reviews: 89,
//             image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
//             ecoScore: 98,
//             category: "Home"
//           },
//           {
//             id: 3,
//             name: "Solar Power Bank",
//             price: 49.99,
//             originalPrice: 69.99,
//             rating: 4.3,
//             reviews: 156,
//             image: "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=300&h=300&fit=crop",
//             ecoScore: 92,
//             category: "Electronics"
//           },
//           {
//             id: 4,
//             name: "Recycled Paper Notebook",
//             price: 12.99,
//             originalPrice: 16.99,
//             rating: 4.6,
//             reviews: 203,
//             image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=300&h=300&fit=crop",
//             ecoScore: 97,
//             category: "Office"
//           },
//           {
//             id: 5,
//             name: "Hemp Backpack",
//             price: 39.99,
//             originalPrice: 49.99,
//             rating: 4.7,
//             reviews: 94,
//             image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
//             ecoScore: 96,
//             category: "Fashion"
//           },
//           {
//             id: 6,
//             name: "LED Grow Light",
//             price: 34.99,
//             originalPrice: 44.99,
//             rating: 4.4,
//             reviews: 67,
//             image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop",
//             ecoScore: 88,
//             category: "Home"
//           }
//         ]);

//         setCategories([
//           { id: 1, name: "Fashion", icon: "👕", count: 156 },
//           { id: 2, name: "Home & Garden", icon: "🏡", count: 89 },
//           { id: 3, name: "Electronics", icon: "📱", count: 234 },
//           { id: 4, name: "Beauty", icon: "💄", count: 67 },
//           { id: 5, name: "Sports", icon: "⚽", count: 45 },
//           { id: 6, name: "Books", icon: "📚", count: 123 }
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Helper function to get category icons
//   const getCategoryIcon = (categoryName) => {
//     const iconMap = {
//       'Electronics': '📱',
//       'Clothing': '👕',
//       'Home & Garden': '🏠',
//       'Food & Beverages': '🍽️',
//       'Personal Care': '🧴',
//       'Accessories': '👜',
//       'Sports & Fitness': '⚽',
//       'Beauty': '💄',
//       'Books': '📚',
//       'Eco-Friendly': '🌱'
//     };
//     return iconMap[categoryName] || '🛍️';
//   };

//   // Authentication handlers
//   const handleShopNow = () => {
//     if (!isAuthenticated) {
//       navigate('/auth', { state: { returnPath: '/products' } });
//     } else {
//       navigate('/products');
//     }
//   };

//   const handleCategoryClick = (categoryId) => {
//     if (!isAuthenticated) {
//       navigate('/auth', { state: { returnPath: `/products?category=${categoryId}` } });
//     } else {
//       navigate(`/products?category=${categoryId}`);
//     }
//   };

//   const handleProductClick = (productId) => {
//     if (!isAuthenticated) {
//       navigate('/auth', { state: { returnPath: `/product/${productId}` } });
//     } else {
//       navigate(`/product/${productId}`);
//     }
//   };

//   const handleSellerRegister = () => {
//     navigate('/auth', { state: { accountType: 'SELLER', isRegister: true } });
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={14}
//         className={i < Math.floor(rating) ? "star-filled" : "star-empty"}
//         fill={i < Math.floor(rating) ? "currentColor" : "none"}
//       />
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
//         <div className="loading-spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
//       {/* Modern Hero Section */}
//       <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900">
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//           <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//           <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
//         </div>

//         {/* Background Image Overlay */}
//         <div 
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
//           style={{
//             backgroundImage: `url('/EcobazaarXBackground image.png')`
//           }}
//         ></div>
        
//         {/* Content */}
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             {/* Left Content */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="text-center lg:text-left space-y-8"
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.8, delay: 0.2 }}
//                 className="inline-flex items-center px-4 py-2 bg-emerald-500 bg-opacity-20 backdrop-blur-sm rounded-full border border-emerald-400 border-opacity-30"
//               >
//                 <Sparkles size={18} className="text-emerald-300 mr-2" />
//                 <span className="text-emerald-100 font-medium">Sustainable Shopping Revolution</span>
//               </motion.div>

//               <motion.h1 
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.3 }}
//                 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight"
//               >
//                 Your Green
//                 <br />
//                 <span className="bg-gradient-to-r from-emerald-300 to-teal-300 text-transparent bg-clip-text">
//                   Marketplace
//                 </span>
//               </motion.h1>
              
//               <motion.p 
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.4 }}
//                 className="text-xl md:text-2xl text-emerald-100 max-w-2xl leading-relaxed"
//               >
//                 Transform your shopping habits with our curated collection of eco-conscious products. Every purchase plants a seed for a sustainable future.
//               </motion.p>
              
//               <motion.div 
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.5 }}
//                 className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
//               >
//                 <button
//                   onClick={handleShopNow}
//                   className="group bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center justify-center"
//                 >
//                   Start Shopping
//                   <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
//                 </button>
//                 <Link
//                   to="/about"
//                   className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center backdrop-blur-sm"
//                 >
//                   Our Mission
//                   <Leaf size={20} className="ml-2 group-hover:rotate-12 transition-transform" />
//                 </Link>
//               </motion.div>

//               {/* Trust Badges */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.8, delay: 0.6 }}
//                 className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4"
//               >
//                 <div className="flex items-center text-emerald-200">
//                   <CheckCircle size={20} className="mr-2" />
//                   <span className="text-sm font-medium">100% Eco-Certified</span>
//                 </div>
//                 <div className="flex items-center text-emerald-200">
//                   <ShieldCheck size={20} className="mr-2" />
//                   <span className="text-sm font-medium">Secure Shopping</span>
//                 </div>
//                 <div className="flex items-center text-emerald-200">
//                   <Users size={20} className="mr-2" />
//                   <span className="text-sm font-medium">10K+ Happy Customers</span>
//                 </div>
//               </motion.div>
//             </motion.div>
            
//             {/* Right Content - Feature Cards */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="hidden lg:flex justify-center"
//             >
//               <div className="grid grid-cols-2 gap-6 max-w-lg">
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 0.8 }}
//                   whileHover={{ y: -10 }}
//                   className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl col-span-2"
//                 >
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-4">
//                       <Leaf size={32} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-2xl font-bold text-white mb-2">Carbon Neutral</h3>
//                       <p className="text-emerald-100 text-sm leading-relaxed">Every purchase offsets carbon emissions, helping restore our planet's balance</p>
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 1.0 }}
//                   whileHover={{ y: -10 }}
//                   className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl"
//                 >
//                   <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-3 w-fit mb-4">
//                     <TrendingUp size={28} className="text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-2">Quality First</h3>
//                   <p className="text-emerald-100 text-sm">Premium sustainable products</p>
//                 </motion.div>
                
//                 <motion.div
//                   initial={{ opacity: 0, y: 30 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 1.2 }}
//                   whileHover={{ y: -10 }}
//                   className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-6 border border-white border-opacity-20 shadow-2xl"
//                 >
//                   <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-3 w-fit mb-4">
//                     <Award size={28} className="text-white" />
//                   </div>
//                   <h3 className="text-xl font-bold text-white mb-2">Verified</h3>
//                   <p className="text-emerald-100 text-sm">Certified eco-friendly sellers</p>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section - Modern Grid */}
//       <section className="py-24 bg-white relative overflow-hidden">
//         {/* Decorative Elements */}
//         <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <div className="inline-flex items-center px-4 py-2 bg-emerald-50 rounded-full mb-6">
//               <span className="text-emerald-600 font-semibold">Browse Collections</span>
//             </div>
//             <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text mb-4">
//               Explore by Category
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Discover thoughtfully curated sustainable products for every aspect of your life
//             </p>
//           </motion.div>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {categories.map((category, index) => (
//               <motion.div
//                 key={category.id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: index * 0.05 }}
//                 viewport={{ once: true }}
//                 whileHover={{ scale: 1.05, y: -8 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => handleCategoryClick(category.id)}
//                 className="group cursor-pointer"
//               >
//                 <div className="relative bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-emerald-200 overflow-hidden">
//                   {/* Hover Gradient Overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
//                   <div className="relative z-10 text-center">
//                     <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
//                       <span className="text-3xl">{category.icon}</span>
//                     </div>
                    
//                     <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
//                       {category.name}
//                     </h3>
//                     <p className="text-sm text-gray-500 mb-3">
//                       {category.count} items
//                     </p>
                    
//                     <div className="flex items-center justify-center text-emerald-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
//                       <span>Shop Now</span>
//                       <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products - Modern Cards */}
//       <section className="py-24 bg-gradient-to-b from-emerald-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="flex justify-between items-center mb-12"
//           >
//             <div>
//               <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-4">
//                 <Sparkles size={16} className="text-emerald-600 mr-2" />
//                 <span className="text-emerald-600 font-semibold text-sm">Handpicked</span>
//               </div>
//               <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Featured Products</h2>
//               <p className="text-gray-600 text-lg">Top picks for conscious consumers</p>
//             </div>
//             <button
//               onClick={handleShopNow}
//               className="hidden md:flex items-center text-emerald-600 hover:text-emerald-700 font-bold text-lg group"
//             >
//               View All
//               <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </motion.div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.slice(0, 6).map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Daily Deals - Modern Banner Style */}
//       <section className="py-24 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-center mb-12"
//           >
//             <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mb-6 border border-white border-opacity-30">
//               <Zap size={24} className="text-white mr-3" />
//               <span className="text-white font-bold text-lg">Limited Time Offers</span>
//             </div>
//             <h2 className="text-5xl font-extrabold text-white mb-4">Today's Hot Deals</h2>
//             <p className="text-white text-xl opacity-90">Grab them before they're gone!</p>
//           </motion.div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {products.slice(0, 4).map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: index * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ scale: 1.03, y: -5 }}
//                 className="bg-white rounded-2xl overflow-hidden shadow-2xl"
//               >
//                 <div className="relative">
//                   <div className="absolute top-3 left-3 z-10 flex gap-2">
//                     <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
//                       HOT DEAL
//                     </div>
//                   </div>
                  
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-48 object-cover"
//                   />
//                 </div>
                
//                 <div className="p-5">
//                   <h3 className="font-bold text-gray-900 mb-3 text-base line-clamp-2 h-12">
//                     {product.name}
//                   </h3>
                  
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-2">
//                       <span className="text-2xl font-bold text-red-600">
//                         ₹{product.price.toLocaleString('en-IN')}
//                       </span>
//                       <span className="text-sm text-gray-400 line-through">
//                         ₹{product.originalPrice.toLocaleString('en-IN')}
//                       </span>
//                     </div>
//                     <div className="flex text-yellow-400">
//                       {renderStars(product.rating)}
//                     </div>
//                   </div>
                  
//                   <button 
//                     onClick={() => handleProductClick(product.id)}
//                     className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//                   >
//                     {isAuthenticated ? 'Grab Deal' : 'Login to Buy'}
//                   </button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Seller CTA - Modern Split Design */}
//       <section className="py-24 bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 relative overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
//         </div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             {/* Left Content */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <div className="inline-flex items-center px-4 py-2 bg-emerald-500 bg-opacity-20 backdrop-blur-sm rounded-full border border-emerald-400 border-opacity-30 mb-6">
//                 <Award size={18} className="text-emerald-300 mr-2" />
//                 <span className="text-emerald-100 font-medium">For Eco-Entrepreneurs</span>
//               </div>

//               <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight">
//                 Become a Seller on
//                 <br />
//                 <span className="bg-gradient-to-r from-emerald-300 to-teal-300 text-transparent bg-clip-text">
//                   EcoBazaarX
//                 </span>
//               </h2>

//               <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
//                 Join our thriving community of eco-conscious sellers. Turn your sustainable products into a profitable business while making a positive environmental impact.
//               </p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
//                 <div className="flex items-start space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
//                   <div className="bg-emerald-400 rounded-xl p-2 flex-shrink-0">
//                     <Award size={20} className="text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-white mb-1">Zero Fees</h4>
//                     <p className="text-emerald-200 text-sm">No hidden charges or commissions</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
//                   <div className="bg-teal-400 rounded-xl p-2 flex-shrink-0">
//                     <TrendingUp size={20} className="text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-white mb-1">Grow Fast</h4>
//                     <p className="text-emerald-200 text-sm">Reach millions of buyers</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
//                   <div className="bg-green-400 rounded-xl p-2 flex-shrink-0">
//                     <Leaf size={20} className="text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-white mb-1">Eco Focus</h4>
//                     <p className="text-emerald-200 text-sm">Platform for sustainable goods</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-start space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 border border-white border-opacity-20">
//                   <div className="bg-blue-400 rounded-xl p-2 flex-shrink-0">
//                     <Heart size={20} className="text-white" />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-white mb-1">Full Support</h4>
//                     <p className="text-emerald-200 text-sm">Tools and guidance included</p>
//                   </div>
//                 </div>
//               </div>
              
//               <button
//                 onClick={handleSellerRegister}
//                 className="group bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 shadow-2xl inline-flex items-center transform hover:scale-105"
//               >
//                 Start Selling Today
//                 <ArrowRight size={24} className="ml-3 group-hover:translate-x-1 transition-transform" />
//               </button>
//             </motion.div>
            
//             {/* Right Content - Steps Card */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               viewport={{ once: true }}
//               className="flex justify-center"
//             >
//               <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full">
//                 <div className="text-center mb-8">
//                   <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
//                     <TrendingUp size={40} className="text-white" />
//                   </div>
//                   <h3 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h3>
//                   <p className="text-gray-600">Three simple steps to success</p>
//                 </div>
                
//                 <div className="space-y-6">
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <span className="text-white font-bold text-xl">1</span>
//                     </div>
//                     <div className="flex-1 pt-2">
//                       <h4 className="font-bold text-gray-900 mb-1">Create Account</h4>
//                       <p className="text-gray-600 text-sm">Sign up as a seller in under 2 minutes</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <span className="text-white font-bold text-xl">2</span>
//                     </div>
//                     <div className="flex-1 pt-2">
//                       <h4 className="font-bold text-gray-900 mb-1">List Products</h4>
//                       <p className="text-gray-600 text-sm">Add your eco-friendly items with photos</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-start space-x-4">
//                     <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <span className="text-white font-bold text-xl">3</span>
//                     </div>
//                     <div className="flex-1 pt-2">
//                       <h4 className="font-bold text-gray-900 mb-1">Start Earning</h4>
//                       <p className="text-gray-600 text-sm">Receive orders and grow your business</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-8 pt-8 border-t border-gray-200">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="text-center flex-1">
//                       <div className="text-2xl font-bold text-emerald-600 mb-1">10K+</div>
//                       <div className="text-gray-600">Active Sellers</div>
//                     </div>
//                     <div className="w-px h-12 bg-gray-200"></div>
//                     <div className="text-center flex-1">
//                       <div className="text-2xl font-bold text-emerald-600 mb-1">50K+</div>
//                       <div className="text-gray-600">Products Listed</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;


// import React, { useState, useEffect } from 'react';
// import { 
//   Star,
//   ShoppingCart,
//   Heart,
//   ArrowRight,
//   Leaf,
//   Zap,
//   TrendingUp,
//   Award,
//   Sparkles,
//   CheckCircle,
//   Users,
//   ShieldCheck,
//   Package,
//   Truck
// } from 'lucide-react';

// // Image with fallback component
// const ImageWithFallback = ({ src, alt, className, fallback = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400" }) => {
//   const [imgSrc, setImgSrc] = useState(src);
  
//   return (
//     <img
//       src={imgSrc}
//       alt={alt}
//       className={className}
//       onError={() => setImgSrc(fallback)}
//     />
//   );
// };

// // Product Card Component
// const ProductCard = ({ product, onProductClick }) => {
//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={14}
//         className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
//         fill={i < Math.floor(rating) ? "currentColor" : "none"}
//       />
//     ));
//   };

//   return (
//     <div
//       className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 cursor-pointer"
//       onClick={() => onProductClick(product.id)}
//     >
//       <div className="relative">
//         {product.isEcoFriendly && (
//           <div className="absolute top-3 left-3 z-10 bg-[#2E8B57] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//             <Leaf size={12} />
//             Eco-Friendly
//           </div>
//         )}
//         <ImageWithFallback
//           src={product.image}
//           alt={product.name}
//           className="w-full h-56 object-cover"
//         />
//       </div>
      
//       <div className="p-5">
//         <h3 className="font-bold text-gray-900 mb-2 text-base line-clamp-2 h-12">
//           {product.name}
//         </h3>
        
//         <div className="flex items-center gap-1 mb-3">
//           {renderStars(product.rating)}
//           <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
//         </div>
        
//         <div className="flex items-baseline gap-2 mb-4">
//           <span className="text-2xl font-bold text-[#8B4513]">
//             ₹{product.price.toLocaleString('en-IN')}
//           </span>
//           <span className="text-sm text-gray-400 line-through">
//             ₹{product.originalPrice.toLocaleString('en-IN')}
//           </span>
//           <span className="text-xs text-[#2E8B57] font-semibold">
//             {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
//           </span>
//         </div>
        
//         <button 
//           className="w-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] hover:from-[#1F5E3E] hover:to-[#2E8B57] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
//         >
//           View Details
//         </button>
//       </div>
//     </div>
//   );
// };

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call
//     const loadData = async () => {
//       try {
//         setLoading(true);
        
//         // Mock data
//         const mockProducts = [
//           {
//             id: 1,
//             name: "Organic Cotton T-Shirt",
//             description: "100% organic cotton, sustainable fashion",
//             price: 29.99,
//             originalPrice: 35.99,
//             rating: 4.5,
//             reviews: 128,
//             image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 95,
//             category: "Fashion"
//           },
//           {
//             id: 2,
//             name: "Bamboo Water Bottle",
//             description: "Eco-friendly bamboo exterior",
//             price: 24.99,
//             originalPrice: 29.99,
//             rating: 4.8,
//             reviews: 89,
//             image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 98,
//             category: "Home"
//           },
//           {
//             id: 3,
//             name: "Solar Power Bank",
//             description: "Charge on the go with solar",
//             price: 49.99,
//             originalPrice: 59.99,
//             rating: 4.3,
//             reviews: 156,
//             image: "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 92,
//             category: "Electronics"
//           },
//           {
//             id: 4,
//             name: "Recycled Paper Notebook",
//             description: "Made from 100% recycled paper",
//             price: 12.99,
//             originalPrice: 15.99,
//             rating: 4.6,
//             reviews: 203,
//             image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 97,
//             category: "Office"
//           },
//           {
//             id: 5,
//             name: "Hemp Backpack",
//             description: "Durable and sustainable",
//             price: 39.99,
//             originalPrice: 47.99,
//             rating: 4.7,
//             reviews: 94,
//             image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 96,
//             category: "Fashion"
//           },
//           {
//             id: 6,
//             name: "LED Grow Light",
//             description: "Energy efficient LED technology",
//             price: 34.99,
//             originalPrice: 41.99,
//             rating: 4.4,
//             reviews: 67,
//             image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop",
//             isEcoFriendly: false,
//             carbonScore: 88,
//             category: "Home"
//           }
//         ];

//         const mockCategories = [
//           { id: 1, name: "Fashion", icon: "👕", count: 156 },
//           { id: 2, name: "Home & Garden", icon: "🏡", count: 89 },
//           { id: 3, name: "Electronics", icon: "📱", count: 234 },
//           { id: 4, name: "Beauty", icon: "💄", count: 67 },
//           { id: 5, name: "Sports & Fitness", icon: "⚽", count: 45 },
//           { id: 6, name: "Office", icon: "📚", count: 123 }
//         ];
        
//         setProducts(mockProducts);
//         setCategories(mockCategories);
//       } catch (err) {
//         console.error('Error loading data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Navigation handlers that work with your routing system
//   const handleShopNow = () => {
//     // In your actual app, this uses: navigate('/products');
//     window.location.href = '#/products';
//   };

//   const handleCategoryClick = (categoryId) => {
//     // In your actual app, this uses: navigate(`/products?category=${categoryId}`);
//     window.location.href = `#/products?category=${categoryId}`;
//   };

//   const handleProductClick = (productId) => {
//     // In your actual app, this uses: navigate(`/product/${productId}`);
//     window.location.href = `#/product/${productId}`;
//   };

//   const handleSellerRegister = () => {
//     // In your actual app, this uses: navigate('/auth', { state: { accountType: 'SELLER', isRegister: true } });
//     window.location.href = '#/auth?type=seller';
//   };

//   const handleAboutClick = () => {
//     // In your actual app, this uses: navigate('/about');
//     window.location.href = '#/about';
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={14}
//         className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
//         fill={i < Math.floor(rating) ? "currentColor" : "none"}
//       />
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F5F5DC] to-[#E8D5C4]">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2E8B57]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#E8D5C4] to-[#D2B48C]">
//       {/* Hero Section */}
//       <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0">
//           <ImageWithFallback
//             src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920"
//             alt="Eco-friendly shopping"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/90 via-[#3CB371]/80 to-[#8B4513]/70" />
//         </div>
        
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="animate-fadeIn">
//             <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/30">
//               <Leaf className="w-5 h-5 text-white" />
//               <span className="text-white font-medium">India's First Green Marketplace</span>
//             </div>
            
//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
//               Shop Sustainable,
//               <br />
//               <span className="text-[#F5DEB3]">Live Responsibly</span>
//             </h1>
            
//             <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
//               Discover eco-friendly products from verified sellers. Every purchase contributes to a greener planet.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//               <button
//                 onClick={handleShopNow}
//                 className="group bg-white text-[#2E8B57] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#F5F5DC] transition-all duration-300 shadow-2xl inline-flex items-center justify-center transform hover:scale-105"
//               >
//                 <ShoppingCart className="mr-2" size={22} />
//                 Start Shopping
//                 <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button
//                 onClick={handleAboutClick}
//                 className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
//               >
//                 Learn More
//                 <Leaf size={20} className="ml-2 group-hover:rotate-12 transition-transform" />
//               </button>
//             </div>

//             {/* Trust Indicators */}
//             <div className="flex flex-wrap gap-8 justify-center">
//               <div className="flex items-center text-white">
//                 <CheckCircle size={20} className="mr-2" />
//                 <span className="font-medium">Verified Eco-Products</span>
//               </div>
//               <div className="flex items-center text-white">
//                 <Truck size={20} className="mr-2" />
//                 <span className="font-medium">Free Shipping</span>
//               </div>
//               <div className="flex items-center text-white">
//                 <ShieldCheck size={20} className="mr-2" />
//                 <span className="font-medium">Secure Payments</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="bg-gradient-to-r from-[#2E8B57] to-[#3CB371] py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Users className="w-8 h-8" />
//                 <div className="text-4xl font-bold">50K+</div>
//               </div>
//               <p className="text-white/90">Happy Customers</p>
//             </div>
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Package className="w-8 h-8" />
//                 <div className="text-4xl font-bold">10K+</div>
//               </div>
//               <p className="text-white/90">Eco Products</p>
//             </div>
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Leaf className="w-8 h-8" />
//                 <div className="text-4xl font-bold">100K+</div>
//               </div>
//               <p className="text-white/90">Trees Planted</p>
//             </div>
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <TrendingUp className="w-8 h-8" />
//                 <div className="text-4xl font-bold">5M+</div>
//               </div>
//               <p className="text-white/90">CO₂ Saved (kg)</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-20 bg-[#F5F5DC]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl md:text-5xl font-bold text-[#2E8B57] mb-4">
//               Shop by Category
//             </h2>
//             <p className="text-xl text-[#8B4513] max-w-2xl mx-auto">
//               Browse our curated collection of sustainable products
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//             {categories.map((category, index) => (
//               <div
//                 key={category.id}
//                 onClick={() => handleCategoryClick(category.id)}
//                 className="group cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
//                 style={{ animationDelay: `${index * 50}ms` }}
//               >
//                 <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#DEB887] hover:border-[#2E8B57]">
//                   <div className="w-16 h-16 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
//                     <span className="text-3xl">{category.icon}</span>
//                   </div>
//                   <h3 className="text-center font-bold text-[#2E8B57] mb-1 group-hover:text-[#1F5E3E]">
//                     {category.name}
//                   </h3>
//                   <p className="text-center text-sm text-[#8B4513]">{category.count} items</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-20 bg-[#E8D5C4]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-12">
//             <div>
//               <h2 className="text-4xl font-bold text-[#2E8B57] mb-2">Featured Products</h2>
//               <p className="text-[#8B4513] text-lg">Top eco-friendly picks for you</p>
//             </div>
//             <button
//               onClick={handleShopNow}
//               className="hidden md:flex items-center text-[#2E8B57] hover:text-[#1F5E3E] font-bold text-lg group"
//             >
//               View All
//               <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.slice(0, 6).map((product, index) => (
//               <div
//                 key={product.id}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <ProductCard product={product} onProductClick={handleProductClick} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Daily Deals */}
//       <section className="py-20 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>
//         <div className="absolute inset-0 opacity-20" style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//         }}></div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
//               <Zap size={24} className="text-white mr-3" />
//               <span className="text-white font-bold text-lg">Limited Time Offers</span>
//             </div>
//             <h2 className="text-5xl font-extrabold text-white mb-4">Today's Hot Deals</h2>
//             <p className="text-white text-xl opacity-90">Grab them before they're gone!</p>
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {products.slice(0, 4).map((product, index) => (
//               <div
//                 key={product.id}
//                 onClick={() => handleProductClick(product.id)}
//                 className="bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer transform hover:scale-105 hover:-translate-y-2 transition-all duration-300"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div className="relative">
//                   <div className="absolute top-3 left-3 z-10 flex gap-2">
//                     <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
//                       HOT DEAL
//                     </div>
//                   </div>
                  
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-48 object-cover"
//                   />
//                 </div>
                
//                 <div className="p-5">
//                   <h3 className="font-bold text-gray-900 mb-3 text-base line-clamp-2 h-12">
//                     {product.name}
//                   </h3>
                  
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-2">
//                       <span className="text-2xl font-bold text-red-600">
//                         ₹{product.price.toLocaleString('en-IN')}
//                       </span>
//                       <span className="text-sm text-gray-400 line-through">
//                         ₹{product.originalPrice.toLocaleString('en-IN')}
//                       </span>
//                     </div>
//                     <div className="flex text-yellow-400">
//                       {renderStars(product.rating)}
//                     </div>
//                   </div>
                  
//                   <button 
//                     className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
//                   >
//                     Grab Deal
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Seller CTA */}
//       <section className="py-20 bg-gradient-to-br from-[#2E8B57] via-[#3CB371] to-[#8B4513] relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F5DEB3] rounded-full filter blur-3xl"></div>
//         </div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="text-white">
//               <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
//                 <Award size={18} className="text-white mr-2" />
//                 <span>For Sustainable Sellers</span>
//               </div>

//               <h2 className="text-5xl font-bold mb-6">
//                 Become a Seller on
//                 <br />
//                 <span className="text-[#F5DEB3]">EcoBazaarX</span>
//               </h2>

//               <p className="text-xl text-white/95 mb-8 leading-relaxed">
//                 Join thousands of eco-entrepreneurs. Reach conscious consumers and grow your sustainable business with zero listing fees.
//               </p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
//                 {[
//                   { icon: Award, title: "Zero Fees", desc: "No commission charges" },
//                   { icon: TrendingUp, title: "Grow Fast", desc: "Reach 50K+ buyers" },
//                   { icon: Leaf, title: "Eco Focus", desc: "Green marketplace" },
//                   { icon: ShieldCheck, title: "Full Support", desc: "24/7 assistance" }
//                 ].map((item, idx) => (
//                   <div key={idx} className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//                     <div className="bg-white/20 rounded-lg p-2">
//                       <item.icon size={20} className="text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-white mb-1">{item.title}</h4>
//                       <p className="text-white/80 text-sm">{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <button
//                 onClick={handleSellerRegister}
//                 className="bg-white text-[#2E8B57] px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#F5F5DC] transition-all duration-300 shadow-2xl inline-flex items-center transform hover:scale-105"
//               >
//                 Start Selling Today
//                 <ArrowRight size={24} className="ml-3" />
//               </button>
//             </div>
            
//             <div className="bg-white rounded-3xl p-10 shadow-2xl">
//               <div className="text-center mb-8">
//                 <div className="bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
//                   <TrendingUp size={40} className="text-white" />
//                 </div>
//                 <h3 className="text-3xl font-bold text-[#2E8B57] mb-2">Get Started</h3>
//                 <p className="text-[#8B4513]">Three simple steps</p>
//               </div>
              
//               <div className="space-y-6">
//                 {[
//                   { num: "1", title: "Create Account", desc: "Sign up in 2 minutes" },
//                   { num: "2", title: "List Products", desc: "Add your eco-friendly items" },
//                   { num: "3", title: "Start Earning", desc: "Grow your business" }
//                 ].map((step) => (
//                   <div key={step.num} className="flex items-start space-x-4">
//                     <div className="bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <span className="text-white font-bold text-xl">{step.num}</span>
//                     </div>
//                     <div className="flex-1 pt-2">
//                       <h4 className="font-bold text-[#2E8B57] mb-1">{step.title}</h4>
//                       <p className="text-[#8B4513] text-sm">{step.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 pt-8 border-t border-gray-200">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="text-center flex-1">
//                     <div className="text-2xl font-bold text-[#2E8B57] mb-1">10K+</div>
//                     <div className="text-[#8B4513]">Active Sellers</div>
//                   </div>
//                   <div className="w-px h-12 bg-gray-200"></div>
//                   <div className="text-center flex-1">
//                     <div className="text-2xl font-bold text-[#2E8B57] mb-1">50K+</div>
//                     <div className="text-[#8B4513]">Products Listed</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-20 bg-[#D2B48C]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-[#2E8B57] mb-4">
//               Why Shop With Us?
//             </h2>
//             <p className="text-xl text-[#8B4513] max-w-2xl mx-auto">
//               We're committed to making sustainable shopping easy and rewarding
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Leaf,
//                 title: "100% Eco-Certified",
//                 desc: "Every product meets strict environmental standards",
//                 color: "#2E8B57"
//               },
//               {
//                 icon: ShieldCheck,
//                 title: "Secure Shopping",
//                 desc: "Your data is protected with enterprise-grade security",
//                 color: "#3CB371"
//               },
//               {
//                 icon: Truck,
//                 title: "Fast Delivery",
//                 desc: "Free shipping on orders above ₹499 across India",
//                 color: "#8B4513"
//               }
//             ].map((feature, index) => (
//               <div
//                 key={feature.title}
//                 className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#DEB887] hover:border-[#2E8B57] text-center group transform hover:-translate-y-2"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div
//                   className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg"
//                   style={{ backgroundColor: `${feature.color}20` }}
//                 >
//                   <feature.icon className="w-10 h-10" style={{ color: feature.color }} />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#2E8B57] mb-3">{feature.title}</h3>
//                 <p className="text-[#8B4513]">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20 bg-gradient-to-r from-[#2E8B57] to-[#3CB371]">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               Ready to Make a Difference?
//             </h2>
//             <p className="text-xl text-white/95 mb-8">
//               Join our community of eco-conscious shoppers and start your sustainable journey today.
//             </p>
//             <button
//               onClick={handleShopNow}
//               className="bg-white text-[#2E8B57] px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#F5F5DC] transition-all duration-300 shadow-2xl inline-flex items-center transform hover:scale-105"
//             >
//               <ShoppingCart className="mr-2" size={24} />
//               Start Shopping Now
//               <ArrowRight className="ml-2" size={24} />
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;












// import React, { useState, useEffect } from 'react';
// import { 
//   Star,
//   ShoppingCart,
//   Heart,
//   ArrowRight,
//   Leaf,
//   Zap,
//   TrendingUp,
//   Award,
//   Sparkles,
//   CheckCircle,
//   Users,
//   ShieldCheck,
//   Package,
//   Truck
// } from 'lucide-react';

// // Mock authentication state
// const mockAuth = {
//   isAuthenticated: false
// };

// // Image with fallback component
// const ImageWithFallback = ({ src, alt, className, fallback = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400" }) => {
//   const [imgSrc, setImgSrc] = useState(src);
  
//   return (
//     <img
//       src={imgSrc}
//       alt={alt}
//       className={className}
//       onError={() => setImgSrc(fallback)}
//     />
//   );
// };

// // Product Card Component
// const ProductCard = ({ product, onProductClick }) => {
//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         size={14}
//         className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
//         fill={i < Math.floor(rating) ? "currentColor" : "none"}
//       />
//     ));
//   };

//   return (
//     <div
//       className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 cursor-pointer"
//       onClick={() => onProductClick(product.id)}
//     >
//       <div className="relative">
//         {product.isEcoFriendly && (
//           <div className="absolute top-3 left-3 z-10 bg-[#2E8B57] text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//             <Leaf size={12} />
//             Eco-Friendly
//           </div>
//         )}
//         <ImageWithFallback
//           src={product.image}
//           alt={product.name}
//           className="w-full h-56 object-cover"
//         />
//       </div>
      
//       <div className="p-5">
//         <h3 className="font-bold text-gray-900 mb-2 text-base line-clamp-2 h-12">
//           {product.name}
//         </h3>
        
//         <div className="flex items-center gap-1 mb-3">
//           {renderStars(product.rating)}
//           <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
//         </div>
        
//         <div className="flex items-baseline gap-2 mb-4">
//           <span className="text-2xl font-bold text-[#8B4513]">
//             ₹{product.price.toLocaleString('en-IN')}
//           </span>
//           <span className="text-sm text-gray-400 line-through">
//             ₹{product.originalPrice.toLocaleString('en-IN')}
//           </span>
//           <span className="text-xs text-[#2E8B57] font-semibold">
//             {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
//           </span>
//         </div>
        
//         <button 
//           className="w-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] hover:from-[#1F5E3E] hover:to-[#2E8B57] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
//         >
//           {mockAuth.isAuthenticated ? 'View Details' : 'Login to Buy'}
//         </button>
//       </div>
//     </div>
//   );
// };

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call
//     const loadData = async () => {
//       try {
//         setLoading(true);
        
//         // Mock data
//         const mockProducts = [
//           {
//             id: 1,
//             name: "Organic Cotton T-Shirt",
//             description: "100% organic cotton, sustainable fashion",
//             price: 29.99,
//             originalPrice: 35.99,
//             rating: 4.5,
//             reviews: 128,
//             image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 95,
//             category: "Fashion"
//           },
//           {
//             id: 2,
//             name: "Bamboo Water Bottle",
//             description: "Eco-friendly bamboo exterior",
//             price: 24.99,
//             originalPrice: 29.99,
//             rating: 4.8,
//             reviews: 89,
//             image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 98,
//             category: "Home"
//           },
//           {
//             id: 3,
//             name: "Solar Power Bank",
//             description: "Charge on the go with solar",
//             price: 49.99,
//             originalPrice: 59.99,
//             rating: 4.3,
//             reviews: 156,
//             image: "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 92,
//             category: "Electronics"
//           },
//           {
//             id: 4,
//             name: "Recycled Paper Notebook",
//             description: "Made from 100% recycled paper",
//             price: 12.99,
//             originalPrice: 15.99,
//             rating: 4.6,
//             reviews: 203,
//             image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 97,
//             category: "Office"
//           },
//           {
//             id: 5,
//             name: "Hemp Backpack",
//             description: "Durable and sustainable",
//             price: 39.99,
//             originalPrice: 47.99,
//             rating: 4.7,
//             reviews: 94,
//             image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
//             isEcoFriendly: true,
//             carbonScore: 96,
//             category: "Fashion"
//           },
//           {
//             id: 6,
//             name: "LED Grow Light",
//             description: "Energy efficient LED technology",
//             price: 34.99,
//             originalPrice: 41.99,
//             rating: 4.4,
//             reviews: 67,
//             image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop",
//             isEcoFriendly: false,
//             carbonScore: 88,
//             category: "Home"
//           }
//         ];

//         const mockCategories = [
//           { id: 1, name: "Fashion", icon: "👕", count: 156 },
//           { id: 2, name: "Home & Garden", icon: "🏡", count: 89 },
//           { id: 3, name: "Electronics", icon: "📱", count: 234 },
//           { id: 4, name: "Beauty", icon: "💄", count: 67 },
//           { id: 5, name: "Sports & Fitness", icon: "⚽", count: 45 },
//           { id: 6, name: "Office", icon: "📚", count: 123 }
//         ];
        
//         setProducts(mockProducts);
//         setCategories(mockCategories);
//       } catch (err) {
//         console.error('Error loading data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   const handleShopNow = () => {
//     alert('Navigating to products page...\n(In your app, this would navigate to /products)');
//   };

//   const handleCategoryClick = (categoryId) => {
//     alert(`Navigating to category ${categoryId}...\n(In your app, this would navigate to /products?category=${categoryId})`);
//   };

//   const handleProductClick = (productId) => {
//     alert(`Navigating to product ${productId}...\n(In your app, this would navigate to /product/${productId})`);
//   };

//   const handleSellerRegister = () => {
//     alert('Navigating to seller registration...\n(In your app, this would navigate to /auth with seller registration state)');
//   };

//   const handleAboutClick = () => {
//     alert('Navigating to about page...\n(In your app, this would navigate to /about)');
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#F5F5DC] to-[#E8D5C4]">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2E8B57]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#E8D5C4] to-[#D2B48C]">
//       {/* Hero Section */}
//       <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0">
//           <ImageWithFallback
//             src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920"
//             alt="Eco-friendly shopping"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/90 via-[#3CB371]/80 to-[#8B4513]/70" />
//         </div>
        
//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="animate-fadeIn">
//             <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/30">
//               <Leaf className="w-5 h-5 text-white" />
//               <span className="text-white font-medium">India's First Green Marketplace</span>
//             </div>
            
//             <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
//               Shop Sustainable,
//               <br />
//               <span className="text-[#F5DEB3]">Live Responsibly</span>
//             </h1>
            
//             <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed">
//               Discover eco-friendly products from verified sellers. Every purchase contributes to a greener planet.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//               <button
//                 onClick={handleShopNow}
//                 className="group bg-white text-[#2E8B57] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#F5F5DC] transition-all duration-300 shadow-2xl inline-flex items-center justify-center transform hover:scale-105"
//               >
//                 <ShoppingCart className="mr-2" size={22} />
//                 Start Shopping
//                 <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button
//                 onClick={handleAboutClick}
//                 className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm"
//               >
//                 Learn More
//                 <Leaf size={20} className="ml-2 group-hover:rotate-12 transition-transform" />
//               </button>
//             </div>

//             {/* Trust Indicators */}
//             <div className="flex flex-wrap gap-8 justify-center">
//               <div className="flex items-center text-white">
//                 <CheckCircle size={20} className="mr-2" />
//                 <span className="font-medium">Verified Eco-Products</span>
//               </div>
//               <div className="flex items-center text-white">
//                 <Truck size={20} className="mr-2" />
//                 <span className="font-medium">Free Shipping</span>
//               </div>
//               <div className="flex items-center text-white">
//                 <ShieldCheck size={20} className="mr-2" />
//                 <span className="font-medium">Secure Payments</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="bg-gradient-to-r from-[#2E8B57] to-[#3CB371] py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Users className="w-8 h-8" />
//                 <div className="text-4xl font-bold">50K+</div>
//               </div>
//               <p className="text-white/90">Happy Customers</p>
//             </div>
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Package className="w-8 h-8" />
//                 <div className="text-4xl font-bold">10K+</div>
//               </div>
//               <p className="text-white/90">Eco Products</p>
//             </div>
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <Leaf className="w-8 h-8" />
//                 <div className="text-4xl font-bold">100K+</div>
//               </div>
//               <p className="text-white/90">Trees Planted</p>
//             </div>
//             <div className="text-white">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <TrendingUp className="w-8 h-8" />
//                 <div className="text-4xl font-bold">5M+</div>
//               </div>
//               <p className="text-white/90">CO₂ Saved (kg)</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-20 bg-[#F5F5DC]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl md:text-5xl font-bold text-[#2E8B57] mb-4">
//               Shop by Category
//             </h2>
//             <p className="text-xl text-[#8B4513] max-w-2xl mx-auto">
//               Browse our curated collection of sustainable products
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//             {categories.map((category, index) => (
//               <div
//                 key={category.id}
//                 onClick={() => handleCategoryClick(category.id)}
//                 className="group cursor-pointer transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
//                 style={{ animationDelay: `${index * 50}ms` }}
//               >
//                 <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-[#DEB887] hover:border-[#2E8B57]">
//                   <div className="w-16 h-16 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
//                     <span className="text-3xl">{category.icon}</span>
//                   </div>
//                   <h3 className="text-center font-bold text-[#2E8B57] mb-1 group-hover:text-[#1F5E3E]">
//                     {category.name}
//                   </h3>
//                   <p className="text-center text-sm text-[#8B4513]">{category.count} items</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-20 bg-[#E8D5C4]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-12">
//             <div>
//               <h2 className="text-4xl font-bold text-[#2E8B57] mb-2">Featured Products</h2>
//               <p className="text-[#8B4513] text-lg">Top eco-friendly picks for you</p>
//             </div>
//             <button
//               onClick={handleShopNow}
//               className="hidden md:flex items-center text-[#2E8B57] hover:text-[#1F5E3E] font-bold text-lg group"
//             >
//               View All
//               <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {products.slice(0, 6).map((product, index) => (
//               <div
//                 key={product.id}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <ProductCard product={product} onProductClick={handleProductClick} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Seller CTA */}
//       <section className="py-20 bg-gradient-to-br from-[#2E8B57] via-[#3CB371] to-[#8B4513] relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
//           <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F5DEB3] rounded-full filter blur-3xl"></div>
//         </div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="text-white">
//               <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
//                 <Award size={18} className="text-white mr-2" />
//                 <span>For Sustainable Sellers</span>
//               </div>

//               <h2 className="text-5xl font-bold mb-6">
//                 Become a Seller on
//                 <br />
//                 <span className="text-[#F5DEB3]">EcoBazaarX</span>
//               </h2>

//               <p className="text-xl text-white/95 mb-8 leading-relaxed">
//                 Join thousands of eco-entrepreneurs. Reach conscious consumers and grow your sustainable business with zero listing fees.
//               </p>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
//                 {[
//                   { icon: Award, title: "Zero Fees", desc: "No commission charges" },
//                   { icon: TrendingUp, title: "Grow Fast", desc: "Reach 50K+ buyers" },
//                   { icon: Leaf, title: "Eco Focus", desc: "Green marketplace" },
//                   { icon: ShieldCheck, title: "Full Support", desc: "24/7 assistance" }
//                 ].map((item, idx) => (
//                   <div key={idx} className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
//                     <div className="bg-white/20 rounded-lg p-2">
//                       <item.icon size={20} className="text-white" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-white mb-1">{item.title}</h4>
//                       <p className="text-white/80 text-sm">{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <button
//                 onClick={handleSellerRegister}
//                 className="bg-white text-[#2E8B57] px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#F5F5DC] transition-all duration-300 shadow-2xl inline-flex items-center transform hover:scale-105"
//               >
//                 Start Selling Today
//                 <ArrowRight size={24} className="ml-3" />
//               </button>
//             </div>
            
//             <div className="bg-white rounded-3xl p-10 shadow-2xl">
//               <div className="text-center mb-8">
//                 <div className="bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
//                   <TrendingUp size={40} className="text-white" />
//                 </div>
//                 <h3 className="text-3xl font-bold text-[#2E8B57] mb-2">Get Started</h3>
//                 <p className="text-[#8B4513]">Three simple steps</p>
//               </div>
              
//               <div className="space-y-6">
//                 {[
//                   { num: "1", title: "Create Account", desc: "Sign up in 2 minutes" },
//                   { num: "2", title: "List Products", desc: "Add your eco-friendly items" },
//                   { num: "3", title: "Start Earning", desc: "Grow your business" }
//                 ].map((step) => (
//                   <div key={step.num} className="flex items-start space-x-4">
//                     <div className="bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <span className="text-white font-bold text-xl">{step.num}</span>
//                     </div>
//                     <div className="flex-1 pt-2">
//                       <h4 className="font-bold text-[#2E8B57] mb-1">{step.title}</h4>
//                       <p className="text-[#8B4513] text-sm">{step.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 pt-8 border-t border-gray-200">
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="text-center flex-1">
//                     <div className="text-2xl font-bold text-[#2E8B57] mb-1">10K+</div>
//                     <div className="text-[#8B4513]">Active Sellers</div>
//                   </div>
//                   <div className="w-px h-12 bg-gray-200"></div>
//                   <div className="text-center flex-1">
//                     <div className="text-2xl font-bold text-[#2E8B57] mb-1">50K+</div>
//                     <div className="text-[#8B4513]">Products Listed</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-20 bg-[#D2B48C]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-4xl font-bold text-[#2E8B57] mb-4">
//               Why Shop With Us?
//             </h2>
//             <p className="text-xl text-[#8B4513] max-w-2xl mx-auto">
//               We're committed to making sustainable shopping easy and rewarding
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Leaf,
//                 title: "100% Eco-Certified",
//                 desc: "Every product meets strict environmental standards",
//                 color: "#2E8B57"
//               },
//               {
//                 icon: ShieldCheck,
//                 title: "Secure Shopping",
//                 desc: "Your data is protected with enterprise-grade security",
//                 color: "#3CB371"
//               },
//               {
//                 icon: Truck,
//                 title: "Fast Delivery",
//                 desc: "Free shipping on orders above ₹499 across India",
//                 color: "#8B4513"
//               }
//             ].map((feature, index) => (
//               <div
//                 key={feature.title}
//                 className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#DEB887] hover:border-[#2E8B57] text-center group transform hover:-translate-y-2"
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <div
//                   className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg"
//                   style={{ backgroundColor: `${feature.color}20` }}
//                 >
//                   <feature.icon className="w-10 h-10" style={{ color: feature.color }} />
//                 </div>
//                 <h3 className="text-xl font-bold text-[#2E8B57] mb-3">{feature.title}</h3>
//                 <p className="text-[#8B4513]">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-20 bg-gradient-to-r from-[#2E8B57] to-[#3CB371]">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div>
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               Ready to Make a Difference?
//             </h2>
//             <p className="text-xl text-white/95 mb-8">
//               Join our community of eco-conscious shoppers and start your sustainable journey today.
//             </p>
//             <button
//               onClick={handleShopNow}
//               className="bg-white text-[#2E8B57] px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#F5F5DC] transition-all duration-300 shadow-2xl inline-flex items-center transform hover:scale-105"
//             >
//               <ShoppingCart className="mr-2" size={24} />
//               Start Shopping Now
//               <ArrowRight className="ml-2" size={24} />
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;









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

  // 🔥 Correct Admin Dashboard navigation
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

            {/* ⭐ Admin Dashboard Button */}
            <button
              onClick={handleAdminAccess}
              className="border-2 border-yellow-300 text-yellow-300 px-6 py-3 rounded-xl font-bold"
            >
              Admin Dashboard
            </button>
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

