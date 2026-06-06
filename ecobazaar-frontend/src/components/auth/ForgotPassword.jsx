// // // import React, { useState } from 'react';
// // // import { authAPI } from '../../services/api';

// // // const ForgotPassword = () => {
// // //   const [email, setEmail] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const [message, setMessage] = useState('');

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setMessage('');

// // //     try {
// // //       await authAPI.post('/auth/forgot-password', { email });
// // //       setMessage('OTP sent to your email');
// // //     } catch (err) {
// // //       setMessage(err.response?.data || 'Failed to send OTP');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
// // //       <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

// // //       <form onSubmit={handleSubmit} className="space-y-4">
// // //         <input
// // //           type="email"
// // //           placeholder="Enter your email"
// // //           value={email}
// // //           onChange={(e) => setEmail(e.target.value)}
// // //           required
// // //           className="w-full p-3 border rounded"
// // //         />

// // //         <button
// // //           type="submit"
// // //           disabled={loading}
// // //           className="w-full bg-green-600 text-white p-3 rounded"
// // //         >
// // //           {loading ? 'Sending OTP...' : 'Send OTP'}
// // //         </button>
// // //       </form>

// // //       {message && <p className="mt-4 text-center">{message}</p>}
// // //     </div>
// // //   );
// // // };

// // // export default ForgotPassword;
// // import React, { useState } from 'react';
// // import { authAPI } from '../../services/api';
// // import { useNavigate } from 'react-router-dom';

// // const ForgotPassword = () => {
// //   const [email, setEmail] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState('');
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setMessage('');

// //     try {
// //       await authAPI.post('/auth/forgot-password', { email });

// //       // Optional success message
// //       setMessage('OTP sent to your email');

// //       // Redirect to Reset Password page with email
// //       navigate('/reset-password', {
// //         state: { email }
// //       });

// //     } catch (err) {
// //       setMessage(err.response?.data || 'Failed to send OTP');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
// //       <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="email"
// //           placeholder="Enter your email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //           className="w-full p-3 border rounded"
// //         />

// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="w-full bg-green-600 text-white p-3 rounded"
// //         >
// //           {loading ? 'Sending OTP...' : 'Send OTP'}
// //         </button>
// //       </form>

// //       {message && <p className="mt-4 text-center">{message}</p>}
// //     </div>
// //   );
// // };

// // export default ForgotPassword;
// import React, { useState } from 'react';
// import { authAPI } from '../../services/api';
// import { useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       await authAPI.post('/auth/forgot-password', { email });

//       setMessage('OTP sent to your email');

//       navigate('/reset-password', {
//         state: { email }
//       });
//     } catch (err) {
//       setMessage(err.response?.data || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Forgot Password
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
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
//             {loading ? 'Sending OTP...' : 'Send OTP'}
//           </button>
//         </form>

//         {message && (
//           <p className="mt-5 text-center text-sm font-medium text-green-600">
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
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
      await authAPI.post('/auth/forgot-password', { email });

      setMessage('OTP sent to your email');

      navigate('/reset-password', {
        state: { email }
      });
    } catch (err) {
      setMessage(err.response?.data || 'Failed to send OTP');
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
            >
              <Mail size={24} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Reset Your Password
            </h2>
            
            <p className="text-gray-600">
              Enter your email to receive a password reset OTP
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  style={{ '--tw-ring-color': primaryColor }}
                />
              </div>
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
                  <span>Sending OTP...</span>
                </>
              ) : (
                'Send OTP'
              )}
            </motion.button>
          </form>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl border text-center ${
                message.includes('sent') 
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Additional Info */}
          <div className="mt-8 p-4 rounded-xl border border-blue-100 bg-blue-50">
            <p className="text-sm text-gray-600 text-center">
              Check your email inbox (and spam folder) for the OTP code. 
              You'll be redirected to reset your password after submission.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;