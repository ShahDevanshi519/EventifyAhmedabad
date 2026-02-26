import React, { useState } from "react"
import { X, Search } from "lucide-react"

export default function LocationModal({ areas, selectedArea, onSelect, onClose }) {

  const [search, setSearch] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filtered = areas.filter(a =>
    a.toLowerCase().includes(search.toLowerCase())
  )

  const visible = showAll ? filtered : filtered.slice(0,5)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-scale-in">

        {/* BIG CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white shadow-lg rounded-full p-2 hover:bg-purple-600 hover:text-white transition"
        >
          <X size={20}/>
        </button>

        {/* Search */}
        <div className="relative mb-4">
          <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search area..."
            className="w-full border rounded-xl px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <Search className="absolute right-3 top-2.5 text-purple-600" size={18}/>
        </div>

        {/* Areas */}
        <div className="space-y-2 max-h-60 overflow-auto">

          {visible.map(area => (
            <button
              key={area}
              onClick={()=>onSelect(area)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedArea === area
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-100 text-purple-700"
              }`}
            >
              {area}
            </button>
          ))}

        </div>

        {/* View More */}
        {!showAll && filtered.length > 5 && (
          <button
            onClick={()=>setShowAll(true)}
            className="mt-4 w-full border border-purple-600 text-purple-600 rounded-lg py-2 hover:bg-purple-600 hover:text-white transition"
          >
            View More
          </button>
        )}

      </div>

    </div>
  )
}
