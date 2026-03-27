import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value, updatedFormData) => {
    let errorMsg = "";
    const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    if (name === "oldPassword") {
      if (!value.trim()) errorMsg = "Current Password Is Required";
    }

    if (name === "newPassword") {
      if (!value) {
        errorMsg = "New Password Is Required";
      } else if (!passwordregex.test(value)) {
        errorMsg = "Password must contain letter, number & special character (min 6)";
      }
    }

    if (name === "confirmPassword") {
      if (!value.trim()) {
        errorMsg = "Confirm Password Is Required";
      } else if (value !== updatedFormData.newPassword) {
        errorMsg = "Password And Confirm Password Must Be Same";
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const errorMsg = validateField(name, value, updatedFormData);
    setError((prev) => ({ ...prev, [name]: errorMsg }));

    // Re-validate confirmPassword when newPassword changes
    if (name === "newPassword" && updatedFormData.confirmPassword) {
      const confirmError = updatedFormData.confirmPassword !== value
        ? "Password And Confirm Password Must Be Same"
        : "";
      setError((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const doValidation = () => {
    let tempError = {};
    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field], formData);
      if (errorMsg) tempError[field] = errorMsg;
    });
    setError(tempError);
    return Object.keys(tempError).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!doValidation()) return;

    const accessToken = localStorage.getItem("AccessToken");

    axios.post("http://127.0.0.1:3000/changepassword", {
      oldpassword: formData.oldPassword,
      newpassword: formData.newPassword
    }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then((res) => {
      if (res.data.flag === 1) {
        alert(res.data.msg);
        navigate('/dashboard');
      } else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        const refreshToken = localStorage.getItem("RefreshToken");
        if (!refreshToken) {
          alert("Your Session Is Expired, Please Login Again");
          localStorage.clear();
          navigate('/signin');
          return;
        }
        axios.post("http://127.0.0.1:3000/refreshToken", { refreshToken })
        .then((res) => {
          const newAccessToken = res.data.access_token;
          localStorage.setItem("AccessToken", newAccessToken);
          return axios.post("http://127.0.0.1:3000/changepassword", {
            oldpassword: formData.oldPassword,
            newpassword: formData.newPassword
          }, {
            headers: { Authorization: `Bearer ${newAccessToken}` }
          });
        })
        .then((res) => {
          if (res.data.flag === 1) {
            alert(res.data.msg);
            navigate('/dashboard');
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Your Session Is Expired, Please Login Again");
          localStorage.clear();
          navigate('/signin');
        });
      }
    });
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
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600">
                {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.oldPassword && <p className="text-red-500 text-sm mt-1">{error.oldPassword}</p>}
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
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600">
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.newPassword && <p className="text-red-500 text-sm mt-1">{error.newPassword}</p>}
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
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-purple-600">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
          </div>

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