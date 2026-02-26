import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:3000/admin-login",formData)
    .then((res) => {
      alert(res.data.msg)
      if(res.data.flag === 1){
        navigate('/admin/dashboard')
      }
    }).catch((err) => {
      console.log(err)
      alert("Login Failed")})
    
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">

      {/* Login Card */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-12 w-full max-w-md border border-gray-100 transform transition-all duration-500 hover:scale-105">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Eventifyahmedabad
          </h1>
          <p className="text-gray-500 text-sm mt-2">Admin Panel Login</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

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

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-purple-500" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm"
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-purple-600 hover:text-pink-500 bg-white px-3 py-1 rounded-full shadow-sm transition"
            >
                Forgot Password?
            </button>
            </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Eventifyahmedabad. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}