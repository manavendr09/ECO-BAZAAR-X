import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, Trees, Sun, Cloud, Mountain } from 'lucide-react';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [defaultAccountType, setDefaultAccountType] = useState('CUSTOMER');

  // Check if user just registered or if seller registration was initiated
  useEffect(() => {
    const justRegistered = searchParams.get('registered');
    if (justRegistered === 'true') {
      setIsLogin(true);
    }
    
    // Check if seller registration was initiated from home page
    if (location.state?.accountType === 'SELLER' && location.state?.isRegister) {
      setIsLogin(false);
      setDefaultAccountType('SELLER');
    }
  }, [searchParams, location.state]);

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  const handleRegistrationSuccess = () => {
    // Redirect to login with a flag
    navigate('/auth?registered=true');
  };

  const handleLoginSuccess = () => {
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);
  };

  const handleLogoutAnimation = () => {
    setShowSuccessAnimation(true);
    setTimeout(() => {
      setShowSuccessAnimation(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Leaves */}
        <motion.div
          className="absolute top-20 left-10 text-green-400 opacity-30"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Leaf size={40} />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 text-emerald-400 opacity-40"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Leaf size={30} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20 text-teal-400 opacity-25"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 180]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Leaf size={35} />
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
          className="absolute top-60 left-1/4 text-yellow-400 opacity-60"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={20} />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-1/3 text-amber-400 opacity-50"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <Sparkles size={16} />
        </motion.div>

        {/* Sun */}
        <motion.div
          className="absolute top-10 right-10 text-yellow-400 opacity-80"
          animate={{ 
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Sun size={60} />
        </motion.div>

        {/* Clouds */}
        <motion.div
          className="absolute top-16 left-1/3 text-blue-200 opacity-70"
          animate={{ 
            x: [-50, 50, -50]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Cloud size={40} />
        </motion.div>

        <motion.div
          className="absolute top-8 left-1/2 text-blue-100 opacity-60"
          animate={{ 
            x: [30, -30, 30]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        >
          <Cloud size={30} />
        </motion.div>

        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0">
          <motion.div
            className="text-slate-600 opacity-20"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Mountain size={200} />
          </motion.div>
        </div>

        {/* Trees */}
        <motion.div
          className="absolute bottom-0 left-10 text-green-600 opacity-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <Trees size={80} />
        </motion.div>

        <motion.div
          className="absolute bottom-0 right-20 text-green-700 opacity-25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <Trees size={100} />
        </motion.div>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            className="fixed inset-0 bg-green-500 bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center text-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-4 flex justify-center auth-logo"
              >
                <img 
                  src="/Main Navigator Logo.png" 
                  alt="EcoBazaarX Logo" 
                  className="h-20 w-auto object-contain"
                />
              </motion.div>
              <h2 className="text-3xl font-bold mb-2">Welcome to EcoBazaarX!</h2>
              <p className="text-xl opacity-90">Your sustainable journey begins here</p>
              
              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100],
                    opacity: [1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {isLogin ? (
            // Login Layout - Two Column
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Side - Eco Theme Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mb-6 shadow-lg">
                    <Leaf size={40} className="text-white" />
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
                >
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    EcoBazaarX
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                >
                  Join the sustainable shopping revolution. Discover eco-friendly products that help protect our planet while maintaining quality and style.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="grid grid-cols-3 gap-6 text-center"
                >
                  <div className="p-4 bg-white bg-opacity-80 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-green-600 mb-2">50K+</div>
                    <div className="text-sm text-gray-600">Trees Planted</div>
                  </div>
                  <div className="p-4 bg-white bg-opacity-80 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-green-600 mb-2">100K+</div>
                    <div className="text-sm text-gray-600">CO2 Saved</div>
                  </div>
                  <div className="p-4 bg-white bg-opacity-80 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl font-bold text-green-600 mb-2">25K+</div>
                    <div className="text-sm text-gray-600">Happy Users</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Login Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-md">
                  <Login 
                    onSwitchToRegister={switchToRegister} 
                    onLoginSuccess={handleLoginSuccess}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Register Layout - Full Width, Centered
            <motion.div
              key="register"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl mx-auto"
            >
              <Register 
                onSwitchToLogin={switchToLogin} 
                onRegistrationSuccess={handleRegistrationSuccess}
                defaultAccountType={defaultAccountType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
