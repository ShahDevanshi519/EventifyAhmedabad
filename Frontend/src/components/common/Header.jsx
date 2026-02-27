import React, { useState, useEffect } from "react"
import { Link,useNavigate } from "react-router-dom"
import { Search, MapPin, ChevronDown, Menu, X } from "lucide-react"
import LocationModal from "./LocationModal"


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("Ahmedabad")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categories = ["Music","Comedy","Workshops","Sports","Festivals"]

 const areas = [
  "Ahmedabad",
  "AshramRoad",
  "Bapunagr",
  "Bodakdev",
  "Bopal",
  "Chandkheda",
  "Gota",
  "Law Garden",
  "Maninagar",
  "Naroda",
  "Navrangpura",
  "Nikol",
  "Prahladnagar",
  "SBR",
  "SG Highway",
  "Satellite",
  "Thaltej",
  "University",
  "Vastrapur"
];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-dark" : "glass"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex gap-2 items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>

              <span
                className={`font-extrabold text-xl tracking-wide transition-all duration-300
                ${
                  isScrolled
                    ? "text-white"
                    : "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
                }`}
              >
                EventifyAhmedabad
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">

              {/* Location */}
              <button
                onClick={() => setShowLocationModal(true)}
                className={`flex items-center gap-2 font-semibold transition-all duration-300
                ${
                  isScrolled
                    ? "text-white hover:text-pink-300"
                    : "text-purple-700 hover:text-pink-600"
                }`}
              >
                <MapPin size={18} />
                {selectedLocation}
                <ChevronDown size={16} />
              </button>

              {/* All Events */}
              <Link
                to="/all-events"
                className={`relative font-semibold transition-all duration-300
                ${
                  isScrolled
                    ? "text-white hover:text-pink-300 after:bg-pink-300"
                    : "text-purple-700 hover:text-pink-600 after:bg-pink-500"
                }
                after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                after:w-0 hover:after:w-full`}
              >
                All Events
              </Link>

              {/* Categories */}
              <div className="relative group">
                <button
                  className={`flex items-center gap-1 font-semibold transition-all duration-300
                  ${
                    isScrolled
                      ? "text-white hover:text-pink-300"
                      : "text-purple-700 hover:text-pink-600"
                  }`}
                >
                  Categories <ChevronDown size={16} />
                </button>

                <div className="absolute pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition">
                  <div className="glass rounded-xl shadow p-3">
                    {categories.map(cat => (
                      <Link
                        key={cat}
                        to={`/category/${cat.toLowerCase()}`}
                        className="block px-4 py-2 rounded font-semibold
                                   text-purple-700 hover:bg-purple-100 transition"
                      >
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
                  className={`px-4 py-2 rounded-full outline-none transition-all duration-300
                  ${
                    isScrolled
                      ? "bg-white/20 text-white placeholder-white focus:bg-white/30"
                      : "bg-purple-100 text-purple-800 focus:bg-purple-200"
                  }`}
                />
                <Search
                  size={18}
                  className={`absolute right-3 top-2.5
                  ${isScrolled ? "text-white" : "text-purple-600"}`}
                />
              </div>

              {/* Account */}
              <div className="relative group">
                <button
                  className={`px-5 py-2 rounded-full font-semibold transition-all duration-300
                  ${
                    isScrolled
                      ? "bg-white/20 text-white hover:bg-white/30"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105"
                  }`}
                >
                  Account
                </button>

                <div className="absolute right-0 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition">
                  <div className="glass rounded-xl shadow p-3">
                    <Link to="/signin" className="block px-4 py-1 hover:bg-purple-100 rounded">Sign In</Link>
                    <Link to="/signup" className="block px-3 py-1 hover:bg-purple-100 rounded">Sign Up</Link>
                    <Link to="/contact" className="block px-4 py-1 hover:bg-purple-100 rounded">Contact</Link>
                    <Link to="/about" className="block px-4 py-1 hover:bg-purple-100 rounded">About</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden">
              {showMobileMenu ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden space-y-3 pb-4 font-semibold text-purple-700">
              <button onClick={() => setShowLocationModal(true)} className="hover:text-pink-600 transition">
                {selectedLocation}
              </button>
              <Link to="/all-events" className="block hover:text-pink-600 transition">All Events</Link>
              {categories.map(cat => (
                <Link key={cat} className="block hover:text-pink-600 transition">
                  {cat}
                </Link>
              ))}
              <Link to="/signin" className="block hover:text-pink-600 transition">Sign In</Link>
            </div>
          )}
        </div>
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          areas={areas}
          selectedArea={selectedLocation}
          onSelect={(a) => {
            setSelectedLocation(a)
            setShowLocationModal(false)
            if (a === "Ahmedabad") {
                navigate("/all-events");
            } else {
                navigate(`/events/${a.toLowerCase()}`);
            }

          }}
          onClose={() => setShowLocationModal(false)}
        />
      )}
    </>
  )
}
