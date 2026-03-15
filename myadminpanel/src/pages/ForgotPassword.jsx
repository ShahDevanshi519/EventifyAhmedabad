import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail,ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ForgotPassword() {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleForgotpassword = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:3000/admin/forgotpassword",formData)
    .then((res) => {
      if(res.data.flag === 1){
        alert(res.data.msg);
      }else{
        alert(res.data.msg);
      }
    }).catch((err) => console.log(err))
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">

      {/* Login Card */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-12 w-full max-w-md border border-gray-100 transform transition-all duration-500 hover:scale-105">

        <Link 
          to="/login" 
          className="absolute top-6 left-6 flex items-center gap-1 text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Eventify
          </h1>
          <p className="text-gray-500 text-sm mt-2">Admin Panel Forgot Password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleForgotpassword} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-purple-500" size={18} />
            <input
              type="email"
              name="email"
              placeholder="admin email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
            />
          </div>          

          {/* Forgot Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
          >
            Send Reset Link
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Eventify. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}