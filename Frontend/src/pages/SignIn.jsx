import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error,setError] = useState({});
  
  const navigate = useNavigate();

  const doValidation = () => {
    let tempError = {};
    // let local_email;
    // let local_password;
    // let myalldata = JSON.parse(localStorage.getItem("AllData"));

    // if (!myalldata) {
    // tempError.email = "No account found. Please Sign Up first.";
    // setError(tempError);
    // return false;
    // }else{
    //   local_email = myalldata.email;
    //   local_password = myalldata.password;
    // }

    let emailvalid = email.trim();
    let emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if(!emailvalid){
      tempError.email = "Email Is Required";
    }
    else if(!emailregex.test(emailvalid)){
      tempError.email = "Enter a valid email address";
    }
    

    let passwordvalid = password;
    // let passwordregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if(!passwordvalid){
      tempError.password = "password is required";
    }
    setError(tempError);

    return Object.keys(tempError).length === 0;
    
  }

  const handleLogin = (e) => {
    e.preventDefault();

    console.log('Login attempt with email:', email);

    const isFormValid = doValidation();

    if(!isFormValid){
      return;
    }
    
    axios.post("http://127.0.0.1:3000/login-api",{email,password})
    .then(res => {
      if(res.data.flag == 1){
        localStorage.setItem("userName",res.data.fullName);
        console.log("data",res.data);
        setLoginSuccess(true);
         setTimeout(() => {
          navigate('/dashboard');
          }, 1500);
      }else{
        alert(res.data.msg);
        console.log(res.data.err)
      }
    })
    .catch(err => {
      console.log(err);
      alert("Login Failed")
    })   
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 mb-6">
            You've successfully signed in. Redirecting to dashboard...
          </p>
          <p className="text-sm text-purple-600 font-bold">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your EventifyAhmedabad account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-bold rounded-lg 
                       bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                       bg-[length:200%_200%] hover:bg-right transition-all duration-500"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
            🔵 <span className="text-sm">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
            🟦 <span className="text-sm">Facebook</span>
          </button>
        </div>

        {/* Sign Up */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-600 font-bold">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
