import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";

export default function ChangePassword() {

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    console.log(passwordData);
    alert("Password updated successfully!");
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

          {/* New Password */}
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

          {/* Confirm Password */}
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