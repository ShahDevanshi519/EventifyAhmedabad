import React, { useState } from 'react';
import {  useNavigate,useParams } from 'react-router-dom';
import {  Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function ResetPassword() {
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [error,setError] = useState({});
  
  const navigate = useNavigate();
  const {token} = useParams();
 
  const handleResetPassword = (e) => {
    e.preventDefault();

    if(confirmPassword !== newPassword){
        alert("password must be same");
        return;
    }

    axios.post(`http://127.0.0.1:3000/resetpassword/${token}`,{newPassword})
    .then((res) => {
        if(res.data.flag === 1){
            alert(res.data.msg);
            navigate('/signin');
        }else{
            alert(res.data.msg);
        }
    }).catch((err) => console.log(err))
   
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="glass rounded-2xl p-8 sm:p-12 w-full max-w-md shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Reset Your Password Here...
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword || ""}
                onChange={(e) => setnewPassword(e.target.value)}
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
            
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword || ""}
                onChange={(e) => setconfirmPassword(e.target.value)}
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
            
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white font-bold rounded-lg 
                       bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                       bg-[length:200%_200%] hover:bg-right transition-all duration-500"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
