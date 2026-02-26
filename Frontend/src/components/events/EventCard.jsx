import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Star } from "lucide-react";

export default function EventCard({ event, onAddToWishlist }) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <Link to={`/event/${event._id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow hover:scale-[1.03] transition cursor-pointer group w-[354px] flex-shrink-0">
        {/* Image */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200">
          {!imageError ? (
            <img
              src={`http://localhost:3000${event.eventImage}`}
              alt={event.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🎵
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToWishlist(event._id);
            }}
            className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow"
          >
            <Heart size={16} />
          </button>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{event.title}</h3>

          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{event.rating || "0"}</span>
          </div>

          <div className="text-xs text-gray-600 space-y-1 mb-2">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(event.date).toLocaleDateString("en-IN")}
            </div>

            <div className="flex items-center gap-1">
              <MapPin size={12} />
              {event.area}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-purple-600">₹{event.price}</span>
            <button className="bg-purple-600 text-white text-xs px-3 py-1 rounded-md">
              Book
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
