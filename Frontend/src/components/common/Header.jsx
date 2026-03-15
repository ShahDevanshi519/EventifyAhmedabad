import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, MapPin, ChevronDown, Menu, X } from "lucide-react"
import LocationModal from "./LocationModal"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Ahmedabad")
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const [userName, setUserName] = useState(localStorage.getItem("userName"))
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)

    const checkUser = () => {
      setUserName(localStorage.getItem("userName"))
    }
    checkUser()

    window.addEventListener("storage", checkUser)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", checkUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    // localStorage.clear();
    setUserName(null)
    window.location.href = "/"
  }

  const categories = ["Music", "Comedy", "Workshops", "Sports", "Festivals"]
  const areas = ["All Areas", "AshramRoad", "Bapunagr", "Bodakdev", "Bopal", "Chandkheda", "Gota", "Law Garden", "Maninagar", "Naroda", "Navrangpura", "Nikol", "Prahladnagar", "SBR", "SG Highway", "Satellite", "Thaltej", "University", "Vastrapur"];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-dark bg-purple-900/80 backdrop-blur-md" : "glass"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* --- BRANDED LOGO START --- */}
            <Link to="/" className="flex gap-3 items-center group cursor-pointer">
              <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                <span className="text-white font-black text-xl z-10">E</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-auto-shimmer"></div>
              </div>

              <div className="flex flex-col">
                <span className={`font-black text-2xl tracking-tight transition-all duration-500 ${
                  isScrolled 
                    ? "text-white" 
                    : "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent"
                }`}>
                  Eventify
                </span>
                {/* Underline effect on hover */}
                {!isScrolled && (
                  <div className="h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-500"></div>
                )}
              </div>
            </Link>
            {/* --- BRANDED LOGO END --- */}

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Location */}
              <button
                onClick={() => setShowLocationModal(true)}
                className={`flex items-center gap-2 font-semibold transition-all duration-300 ${
                  isScrolled ? "text-white hover:text-pink-300" : "text-purple-700 hover:text-pink-600"
                }`}
              >
                <MapPin size={18} />
                {selectedLocation}
                <ChevronDown size={16} />
              </button>

              {/* All Events */}
              <Link
                to="/all-events"
                className={`relative font-semibold transition-all duration-300 ${
                  isScrolled ? "text-white hover:text-pink-300 after:bg-pink-300" : "text-purple-700 hover:text-pink-600 after:bg-pink-500"
                } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full`}
              >
                All Events
              </Link>

              {/* Categories */}
              <div className="relative group">
                <button className={`flex items-center gap-1 font-semibold transition-all duration-300 ${
                  isScrolled ? "text-white hover:text-pink-300" : "text-purple-700 hover:text-pink-600"
                }`}>
                  Categories <ChevronDown size={16} />
                </button>
                <div className="absolute pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition">
                  <div className="bg-white rounded-xl shadow-xl p-3 border border-gray-100">
                    {categories.map(cat => (
                      <Link key={cat} to={`/category/${cat.toLowerCase()}`} className="block px-4 py-2 rounded font-semibold text-purple-700 hover:bg-purple-50 transition">
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  placeholder="Search..."
                  className={`px-4 py-2 rounded-full outline-none transition-all duration-300 ${
                    isScrolled ? "bg-white/20 text-white placeholder-white focus:bg-white/30" : "bg-purple-100 text-purple-800 focus:bg-purple-200"
                  }`}
                />
                <Search size={18} className={`absolute right-3 top-2.5 ${isScrolled ? "text-white" : "text-purple-600"}`} />
              </div>

              {/* Account */}
              <div className="relative group">
                <button className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                  isScrolled ? "bg-white/20 text-white hover:bg-white/30" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105"
                }`}>
                  {userName ? userName : "Account"}
                </button>
                <div className="absolute right-0 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition z-50">
                  <div className="bg-white rounded-xl shadow-xl p-3 min-w-[150px] border border-gray-100">
                    {!userName ? (
                      <>
                        <Link to="/signin" className="block px-4 py-2 hover:bg-purple-50 rounded text-purple-700 font-medium transition-colors">Sign In</Link>
                        <Link to="/signup" className="block px-4 py-2 hover:bg-purple-50 rounded text-purple-700 font-medium transition-colors">Sign Up</Link>
                        
                      </>
                    ) : (
                      <>
                        <Link to="/dashboard" className="block px-4 py-2 hover:bg-purple-50 rounded text-purple-700 font-medium transition-colors">Dashboard</Link>
                        <button onClick={handleLogout} className="block px-4 py-2 w-full text-left hover:bg-purple-50 rounded text-purple-700 font-medium transition-colors">Logout</button>
                      </>
                    )}
                    <div className="my-1 border-t border-purple-200"></div>
                    {/* RESTORED: Contact & About Options */}
                    <Link to="/contact" className="block px-4 py-2 hover:bg-purple-100 rounded text-purple-700 font-medium whitespace-nowrap transition-colors">
                      Contact
                    </Link>
                    <Link to="/about" className="block px-4 py-2 hover:bg-purple-100 rounded text-purple-700 font-medium whitespace-nowrap transition-colors">
                      About
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`lg:hidden ${isScrolled ? 'text-white' : 'text-purple-700'}`}>
              {showMobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Animation Styles duplicated from Sidebar for consistency */}
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

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          areas={areas}
          selectedArea={selectedLocation}
          onSelect={(a) => {
            setSelectedLocation(a)
            setShowLocationModal(false)
            a === "All Areas" ? navigate("/all-events") : navigate(`/events/${a.toLowerCase()}`);
          }}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </>
  )
}