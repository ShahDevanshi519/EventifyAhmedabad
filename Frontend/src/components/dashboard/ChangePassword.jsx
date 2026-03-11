import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(formData.confirmPassword !== formData.newPassword){
      alert("Password and confirm password must be matched");
      return;
    }

    const accessToken = localStorage.getItem("AccessToken");

    axios.post("http://127.0.0.1:3000/changepassword",{oldpassword:formData.oldPassword,newpassword:formData.newPassword},{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    }).then((res) => {
      if(res.data.flag === 1){
        alert(res.data.msg);
        navigate('/dashboard');
      }else{
        alert(res.data.msg);
      }
    }).catch((err) => {
          if(err.response?.status === 401){
            const refreshToken = localStorage.getItem("RefreshToken");
    
            if(!refreshToken){
              alert("Your Session Is Expired,Please Do Logout and Login Again");
              localStorage.clear();
              navigate('/signin');
              return;
            }
    
            axios.post("http://127.0.0.1:3000/refreshToken",{refreshToken})
            .then((res) => {
              const newAccessToken = res.data.access_token;
    
              localStorage.setItem("AccessToken",newAccessToken);
              return axios.post("http://127.0.0.1:3000/changepassword",{oldpassword:formData.oldPassword,newpassword:formData.newPassword},{
                headers:{
                  Authorization:`Bearer ${newAccessToken}`
                }
              });
            }).then((res) => {
              if(res.data.flag === 1){
                alert(res.data.msg);
                navigate('/dashboard');
              }else{
                alert(res.data.msg);
              }
            })
            .catch((err) => {
              console.log(err);
              alert("Your Session Is Expired,Please Do Logout and Login Again")
              localStorage.clear();
              navigate('/signin');
            })
          }
        })
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type={showOldPassword ? 'text' : 'password'}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600"
              >
                {showOldPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600"
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold mt-6 text-white bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
                        bg-[length:200%_200%] bg-left hover:bg-right transition-all duration-500 hover:shadow-xl"
            >
            Update Password
        </button>
        </form>
      </div>
    </div>
  );
}