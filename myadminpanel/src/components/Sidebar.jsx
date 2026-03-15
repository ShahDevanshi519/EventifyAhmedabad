import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Settings, ChevronDown, Contact } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [eventOpen, setEventOpen] = useState(false);
  const [settingOpen,setSettingOpen] = useState(false);
  const navigate = useNavigate();

  const handelLogout = () => {
    navigate('/login');
  }

  // Base link style
  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl";

  // Dropdown link style
  const dropdownLinkStyle =
    "px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg";

  return (
    <div className="w-72 bg-white shadow-2xl border-r border-gray-200 p-6 flex flex-col h-screen overflow-y-auto">

      {/* --- BRANDED LOGO START --- */}
      <div className="flex gap-3 items-center mb-10 group cursor-pointer">
        {/* Animated Icon */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
          <span className="text-white font-black text-xl z-10">E</span>
          {/* Automatic Shimmer Effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-auto-shimmer"></div>
        </div>

        {/* Branded Text */}
        <div className="flex flex-col">
          <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
            Eventify
          </span>
          <div className="h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>
      {/* --- BRANDED LOGO END --- */}

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-3">
        {/* Dashboard */}
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive ? "bg-purple-50 text-purple-700 shadow-lg scale-105" : "text-gray-600"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* Users */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive ? "bg-purple-50 text-purple-700 shadow-lg scale-105" : "text-gray-600"
            }`
          }
        >
          <Users size={20} />
          Users
        </NavLink>

        {/* Inquiry */}
        <NavLink
          to="/admin/contact"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive ? "bg-purple-50 text-purple-700 shadow-lg scale-105" : "text-gray-600"
            }`
          }
        >
          <Contact size={20} />
          Contact
        </NavLink>

        {/* Events Dropdown */}
        <div className="relative">
          <button
            onClick={() => setEventOpen(!eventOpen)}
            className={`${linkStyle} w-full justify-between text-gray-600`}
          >
            <div className="flex items-center gap-3">
              <Calendar size={20} />
              Events
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${eventOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${eventOpen ? "max-h-40 mt-2" : "max-h-0"}`}
          >
            <div className="flex flex-col gap-2 ml-4 mt-2 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
              <NavLink
                to="/admin/events/add"
                className={({ isActive }) =>
                  `${dropdownLinkStyle} ${
                    isActive ? "bg-purple-50 text-purple-700 shadow-md font-semibold" : "hover:bg-purple-50 hover:text-purple-700"
                  }`
                }
              >
                Add Event
              </NavLink>
              <NavLink
                to="/admin/events/view"
                className={({ isActive }) =>
                  `${dropdownLinkStyle} ${
                    isActive ? "bg-purple-50 text-purple-700 shadow-md font-semibold" : "hover:bg-purple-50 hover:text-purple-700"
                  }`
                }
              >
                View Events
              </NavLink>
            </div>
          </div>
        </div>

        {/* Booking */}
        <NavLink
          to="/admin/booking"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive ? "bg-purple-50 text-purple-700 shadow-lg scale-105" : "text-gray-600"
            }`
          }
        >
          <Users size={20} />
          Booking
        </NavLink>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => setSettingOpen(!settingOpen)}
            className={`${linkStyle} w-full justify-between text-gray-600`}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              Settings
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${settingOpen ? "rotate-180" : "rotate-0"}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${settingOpen ? "max-h-40 mt-2" : "max-h-0"}`}
          >
            <div className="flex flex-col gap-2 ml-4 mt-2 bg-white rounded-2xl shadow-lg p-3 border border-gray-100">
              <NavLink
                to="/admin/settings/edit-profile"
                className={({ isActive }) =>
                  `${dropdownLinkStyle} ${
                    isActive ? "bg-purple-50 text-purple-700 shadow-md font-semibold" : "hover:bg-purple-50 hover:text-purple-700"
                  }`
                }
              >
                Edit Profile
              </NavLink>
              <NavLink
                to="/admin/settings/change-password"
                className={({ isActive }) =>
                  `${dropdownLinkStyle} ${
                    isActive ? "bg-purple-50 text-purple-700 shadow-md font-semibold" : "hover:bg-purple-50 hover:text-purple-700"
                  }`
                }
              >
                Change Password
              </NavLink>
              <button onClick={handelLogout}
                className={`${dropdownLinkStyle} text-left hover:bg-purple-50 hover:text-purple-700`}
                >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-center text-gray-400 text-xs pt-6">
        © {new Date().getFullYear()} Eventify Ahmedabad
      </div>

      {/* Animation Styles */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
          .animate-auto-shimmer {
            animation: shimmer 2s infinite;
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-x {
            animation: gradient-x 3s linear infinite;
          }
        `}
      </style>
    </div>
  );
}