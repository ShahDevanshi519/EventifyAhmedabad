import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangePassword() {

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    // Clear error for the field being typed in
    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const validate = () => {
    const newErrors = { oldPassword: "", newPassword: "", confirmPassword: "" };
    let isValid = true;

    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required.";
      isValid = false;
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
      isValid = false;
    } else if (!strongPasswordRegex.test(passwordData.newPassword)) {
      newErrors.newPassword = "Min 8 chars, include uppercase, lowercase, number & special character.";
      isValid = false;
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password.";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "New password and confirm password do not match.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const id = localStorage.getItem("AdminId");

    if (!id) {
      navigate('/login');
      return;
    }

    axios.post(`http://127.0.0.1:3000/admin/changepassword/${id}`, {
      oldpassword: passwordData.oldPassword,
      newpassword: passwordData.newPassword
    }).then((res) => {
      if (res.data.flag === 1) {
        alert(res.data.msg);
        navigate('/admin/dashboard');
      } else {
        alert(res.data.msg);
      }
    }).catch((err) => console.log(err));
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <KeyRound size={28} className="text-purple-600" />
        Change Password
      </h2>

      {/* Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Old Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.oldPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.oldPassword}</p>}
          </div>

          {/* New Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-sm"
              />
              <div
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-pink-300 transition-all duration-300"
          >
            Update Password
          </button>

        </form>

      </div>
    </div>
  );
}