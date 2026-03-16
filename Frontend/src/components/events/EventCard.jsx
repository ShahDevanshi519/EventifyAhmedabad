import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Star } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EventCard({ event, variant = "large" }) {
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(false);

  const cardWidth = variant === "small" ? "w-[280px]" : "w-[354px]";
  const imageHeight = variant === "small" ? "h-32" : "h-36";

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    const token = localStorage.getItem("AccessToken");

    if(!token){
      navigate('/signin');
      return;
    }

    setIsLiked(!isLiked);
    
    axios.post("http://127.0.0.1:3000/event/wishlist",{eventId:event._id},{
      headers:{
        Authorization:`Bearer ${token}`
      }
    }).then((res) => {
      if(res.data.flag === 1){
        alert(res.data.msg);
        navigate('/dashboard?tab=wishlist');
      }else{
        alert(res.data.msg);
      }
    }).catch((err) => {
              if(err.response?.status === 401){
                const refreshToken = localStorage.getItem("RefreshToken");
        
                if(!refreshToken){
                  alert("Your Session Is Expired,Please Do Logout and Login Again");
                  localStorage.clear();
                  navigate('/signin');
                  return;
                }
        
                axios.post("http://127.0.0.1:3000/refreshToken",{refreshToken})
                .then((res) => {
                  const newAccessToken = res.data.access_token;
        
                  localStorage.setItem("AccessToken",newAccessToken);
                  return axios.post("http://127.0.0.1:3000/event/wishlist",{eventId:event._id},{
                  headers:{
                    Authorization:`Bearer ${token}`
                  }
                })
                }).then((res) => {
                  if(res.data.flag === 1){
                    alert(res.data.msg);
                    navigate('/dashboard?tab=wishlist');
                  }else{
                    alert(res.data.msg);
                  }
                })
                .catch((err) => {
                  console.log(err);
                  alert("Your Session Is Expired,Please Do Logout and Login Again")
                  localStorage.clear();
                  navigate('/signin');
                })
              }
            })
  };

  return (
    <Link to={`/event/${event._id}`}>
      <div className={`bg-white rounded-xl overflow-hidden shadow hover:scale-[1.03] transition cursor-pointer group flex-shrink-0 ${cardWidth}`}>
        
        <div className={`relative ${imageHeight} overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200`}>
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
            onClick={handleWishlistClick}
            className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-100 transition group/heart"
          >
            {/* 4. Dynamic styling based on isLiked state */}
            <Heart 
              size={16} 
              className={`transition-colors duration-300 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }`} 
            />
          </button>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10">{event.title}</h3>

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
            <button className="bg-purple-600 text-white text-xs px-3 py-1 rounded-md active:scale-95 transition">
              Book
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}