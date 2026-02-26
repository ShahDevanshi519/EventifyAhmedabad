import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Check } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate('/signin');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to {email}. Please check your inbox.
          </p>
          <p className="text-sm text-gray-500">Redirecting to Sign In in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up">
        {/* Header */}
        <Link to="/signin" className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">Enter your email to receive a password reset link</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold mt-6 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
                        bg-[length:200%_200%] bg-left hover:bg-right transition-all duration-500 hover:shadow-xl"
            >
            Send Reset Link
        </button>
        </form>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}