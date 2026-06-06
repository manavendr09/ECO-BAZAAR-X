// // import React, { useState } from 'react';
// // import { authAPI } from '../../services/api';
// // import { useNavigate } from 'react-router-dom';

// // const ResetPassword = () => {
// //   const [email, setEmail] = useState('');
// //   const [otp, setOtp] = useState('');
// //   const [newPassword, setNewPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState('');

// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setMessage('');

// //     try {
// //       await authAPI.post('/auth/reset-password', {
// //         email,
// //         otp,
// //         newPassword
// //       });

// //       // ✅ Redirect to /auth with success message
// //       navigate('/auth', {
// //         state: {
// //           successMessage: 'Password reset successful. Please login with your new password.'
// //         }
// //       });

// //     } catch (err) {
// //       setMessage(err.response?.data || 'Password reset failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
// //       <h2 className="text-xl font-bold mb-4">Reset Password</h2>

// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //           className="w-full p-3 border rounded"
// //         />

// //         <input
// //           type="text"
// //           placeholder="OTP"
// //           value={otp}
// //           onChange={(e) => setOtp(e.target.value)}
// //           required
// //           className="w-full p-3 border rounded"
// //         />

// //         <input
// //           type="password"
// //           placeholder="New Password"
// //           value={newPassword}
// //           onChange={(e) => setNewPassword(e.target.value)}
// //           required
// //           className="w-full p-3 border rounded"
// //         />

// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="w-full bg-green-600 text-white p-3 rounded"
// //         >
// //           {loading ? 'Resetting...' : 'Reset Password'}
// //         </button>
// //       </form>

// //       {message && <p className="mt-4 text-center text-red-600">{message}</p>}
// //     </div>
// //   );
// // };

// // export default ResetPassword;
// import React, { useState } from 'react';
// import { authAPI } from '../../services/api';
// import { useNavigate } from 'react-router-dom';

// const ResetPassword = () => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       await authAPI.post('/auth/reset-password', {
//         email,
//         otp,
//         newPassword
//       });

//       navigate('/auth', {
//         state: {
//           successMessage: 'Password reset successful. Please login with your new password.'
//         }
//       });
//     } catch (err) {
//       setMessage(err.response?.data || 'Password reset failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Reset Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//           />

//           <input
//             type="text"
//             placeholder="OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//           />

//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full p-3 rounded-lg text-white font-semibold transition 
//               ${loading 
//                 ? 'bg-green-400 cursor-not-allowed' 
//                 : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'}`}
//           >
//             {loading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </form>

//         {message && (
//           <p className="mt-5 text-center text-sm font-medium text-red-600">
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Key, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const primaryColor = '#234DB8';
  const gradientFrom = primaryColor;
  const gradientTo = '#3B82F6';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authAPI.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      navigate('/auth', {
        state: {
          successMessage: 'Password reset successful. Please login with your new password.'
        }
      });
    } catch (err) {
      setMessage(err.response?.data || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/30">
          {/* Back Button */}
          <button
            onClick={handleBackToLogin}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">Back to Login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            >
              <Lock size={24} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            
            <p className="text-gray-600">
              Enter your email, OTP, and new password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200"
                  style={{ '--tw-ring-color': primaryColor } }
                />
              </div>
            </div>

            {/* OTP Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                OTP Code
              </label>
              <div className="relative">
                <Key size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 text-center tracking-widest text-lg"
                  style={{ 
                    '--tw-ring-color': primaryColor,
                    letterSpacing: '0.5em'
                  } }
                />
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:outline-none transition-all duration-200"
                  style={{ '--tw-ring-color': primaryColor } }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
              style={{ background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})` }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Reset Password</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-center"
            >
              {message}
            </motion.div>
          )}

          {/* Password Requirements */}
          <div className="mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50">
            <h4 className="font-semibold text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                One uppercase letter (A-Z)
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                One lowercase letter (a-z)
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                One number (0-9)
              </li>
            </ul>
          </div>

          {/* OTP Note */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Check your email for the OTP code. It may take a few minutes to arrive.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;