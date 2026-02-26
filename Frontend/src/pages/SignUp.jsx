import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, Phone } from 'lucide-react';
import axios from 'axios';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileno: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

const validateField = (name, value, updatedFormData) => {
    let errorMsg = "";

    if (name === "name") {
      let nameregex = /^[A-Za-z]{2,}$/;
      if (!value.trim()) {
        errorMsg = "Name Is Required";
      } else if (!nameregex.test(value.trim())) {
        errorMsg = "Name Only Consist Letters";
      }
    }

    if (name === "email") {
      let emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!value.trim()) {
        errorMsg = "Email Is Required";
      } else if (!emailregex.test(value.trim())) {
        errorMsg = "Enter a valid email address";
      }
    }

    if (name === "mobileno") {
      let mobileregex = /^[6-9]\d{9}$/;
      if (!value.trim()) {
        errorMsg = "Mobile Number Is Required";
      } else if (!mobileregex.test(value.trim())) {
        errorMsg = "Enter a valid 10-digit mobile number";
      }
    }

    if (name === "password") {
      let passwordregex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

      if (!value) {
        errorMsg = "Password Is Required";
      } else if (!passwordregex.test(value)) {
        errorMsg =
          "Password must contain letter, number & special character (min 6)";
      }
    }

    if (name === "confirmPassword") {
      if (!value.trim()) {
        errorMsg = "Confirm Password Is Required";
      } else if (value !== updatedFormData.password) {
        errorMsg = "Password And Confirm Password Must Be Same";
      }
    }

    return errorMsg;
  };

const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    const errorMsg = validateField(name, value, updatedFormData);

    setError((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    if (name === "password" && updatedFormData.confirmPassword) {
      const confirmError =
        updatedFormData.confirmPassword !== value
          ? "Password And Confirm Password Must Be Same"
          : "";

      setError((prevErrors) => ({
        ...prevErrors,
        confirmPassword: confirmError,
      }));
    }
  };

const doValidation = () => {
    let tempError = {};

    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field], formData);
      if (errorMsg) {
        tempError[field] = errorMsg;
      }
    });

    setError(tempError);
    return Object.keys(tempError).length === 0;
  };

const handleSignUp = (e) => {
    e.preventDefault();

    const isFormValid = doValidation();

    if (!isFormValid) return;

    let myobj = {
      fullName: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.mobileno,
      // confirmpassword: formData.confirmPassword
    };


  axios.post("http://127.0.0.1:3000/register-api", myobj)
  .then((res) => {
    console.log(res);

    if (res.data.flag === 1) {
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } else {
      alert(res.data.msg);
    }
  })
  .catch((err) => console.log(err));    
};

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Account Created! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. Redirecting to Sign In...
          </p>
          <p className="text-sm text-purple-600 font-bold">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Join Us
          </h1>
          <p className="text-gray-600">
            Create your EventifyAhmedabad account
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                // ref = {nameref}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}
        </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                // ref = {emailref}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                // ref = {mobileref}
                type="text"
                name="mobileno"
                value={formData.mobileno}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.mobileno && <p className="text-red-500 text-sm mt-1">{error.mobileno}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                // ref = {passwordref}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
                />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-purple-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                // ref = {confirmpasswordref}
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-purple-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.confirmPassword && (<p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>)}
          </div>

          {/* Terms */}
          {/* <div className="flex items-start gap-2">
            <input type="checkbox" required />
            <span className="text-sm text-gray-600">
              I agree to the Terms & Conditions
            </span>
          </div> */}

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-bold rounded-lg 
                       bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                       bg-[length:200%_200%] hover:bg-right transition-all duration-500"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-purple-600 font-bold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}
