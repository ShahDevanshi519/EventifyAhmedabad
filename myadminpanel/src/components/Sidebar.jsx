import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Settings, ChevronDown,Contact } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [eventOpen, setEventOpen] = useState(false);

  // Base link style
  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl";

  // Dropdown link style
  const dropdownLinkStyle =
    "px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg";

  return (
    <div className="w-72 bg-white shadow-2xl border-r border-gray-200 p-6 flex flex-col h-screen">

      {/* Logo */}
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-10">
        Eventifyahmedabad
      </h1>

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

          {/* Dropdown Menu */}
          <div
            className={`overflow-hidden transition-all duration-500 ${eventOpen ? "max-h-40 mt-2" : "max-h-0"}`}
          >
            <div className="flex flex-col gap-2 ml-4 mt-2 bg-white rounded-2xl shadow-lg p-3">
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

        {/* Settings */}
        <NavLink
          to="/admin/settings/change-password"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive ? "bg-purple-50 text-purple-700 shadow-lg scale-105" : "text-gray-600"
            }`
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} Eventifyahmedabad
      </div>
    </div>
  );
}