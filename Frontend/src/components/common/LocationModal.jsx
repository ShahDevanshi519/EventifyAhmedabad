import React, { useState } from "react"
import { X, Search, MapPin, Navigation } from "lucide-react"

export default function LocationModal({ areas, selectedArea, onSelect, onClose }) {
  const [search, setSearch] = useState("")

  const filtered = areas.filter(a =>
    a.toLowerCase().includes(search.toLowerCase())
  )

  // We can group some as "Popular" or just show the grid
  // const popularCities = ["Ahmedabad", "Mumbai", "Delhi", "Pune", "Bangalore"]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-purple-600" />
              Select Your Areas
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>

          {/* Styled Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your city/area..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-700"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          

          {/* Grid Layout for Areas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.length > 0 ? (
              filtered.map((area) => (
                <button
                  key={area}
                  onClick={() => onSelect(area)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-center
                    ${
                      selectedArea === area
                        ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm"
                        : "border-gray-100 hover:border-purple-300 hover:bg-purple-50/50 text-gray-600"
                    }`}
                >
                  {area}
                </button>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-400">
                No cities found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Optional Footer */}
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            Popular Areas in Ahmedabad
          </p>
        </div>
      </div>
    </div>
  )
}