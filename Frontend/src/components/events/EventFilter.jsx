import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function EventFilter({ onFilterChange }) {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();

  const [price, setPrice] = useState(5000);
  const [date, setDate] = useState("all");
  const [area, setArea] = useState("all");
  const [category, setCategory] = useState("all");

  const categoryList = [
    "music",
    "sports",
    "comedy",
    "workshops",
    "festivals"
  ];

  // Send filter data to parent
  useEffect(() => {
    onFilterChange({
      price,
      date,
      area,
      category,
    });
  }, [price, date, area, category, onFilterChange]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);

    if (cat === "all") {
      navigate("/all-events");
    } else {
      navigate(`/category/${cat}`);
    }
  };

  return (
    <div className="flex flex-col w-64 p-4 bg-white rounded-lg shadow">

      {/* Date */}
      <div className="mb-4">
        <label className="font-bold block mb-1">Date</label>
        <select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1 focus:outline-none focus:border-purple-600"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="week">This Week</option>
          <option value="nextweek">Next Week</option>
          <option value="nextmonth">Next Month</option>
        </select>
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="font-bold block mb-1">Max Price</label>
        <input
          type="range"
          min="0"
          max="5000"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-center font-bold mt-1">₹{price}</p>
      </div>

      {/* Category */}
      <div className="mb-4">
        <label className="font-bold block mb-2">Category</label>
        <div className="space-y-1">
          {categoryList.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={() => handleCategoryChange(cat)}
                className="accent-purple-600"
              />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </label>
          ))}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="category"
              value="all"
              checked={category === "all"}
              onChange={() => handleCategoryChange("all")}
              className="accent-purple-600"
            />
            All
          </label>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setDate("all");
          setPrice(5000);
          setArea("all");
          handleCategoryChange("all");
        }}
        className="w-full border-2 border-purple-600 text-purple-600 py-1 rounded font-bold hover:bg-purple-50"
      >
        Reset
      </button>
    </div>
  );
}