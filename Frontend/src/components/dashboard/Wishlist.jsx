import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Wishlist() {
  const navigate = useNavigate();

  const [wishlistItems,setWishlistItem] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("AccessToken");

    if(!token){
        navigate('/signin');
        return;
    }

    axios.get("http://127.0.0.1:3000/fetch/wishlist",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    }).then((res) => setWishlistItem(res.data))
    .catch((err) => console.log(err))

  },[])

  const handelDelete = (id) => {
    const confirmDelete = window.confirm("Are You Sure You Want To Remove This Event From The Wishlist!");

    if(!confirmDelete){
        return;
    }

    axios.delete(`http://127.0.0.1:3000/event/wishlist/delete/${id}`)
    .then((res) => {
        if(res.data.flag === 1){
            alert(res.data.msg);
            setWishlistItem(wishlistItems.filter(wishlist => wishlist._id !== id))
        }
    }).catch((err) => console.log(err))
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
          {wishlistItems.length} Items
        </span>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {wishlistItems.map((item) => (
            <div key={item._id} className="glass rounded-2xl overflow-hidden border border-white/20 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row">
                
                {/* Event Image */}
                <div className="md:w-56 h-40 md:h-auto overflow-hidden">
                  <img 
                    src={`http://localhost:3000${item.eventId.eventImage}`} 
                    alt={item.eventId.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Event Details */}
                <div className="flex-grow p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.eventId.title}</h3>
                      <p className="text-xl font-bold text-green-600">₹{item.eventId.price}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-2">
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-semibold mr-2">Date:</span> 
                        {new Date(item.eventId.date).toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span className="font-semibold mr-2">Time:</span> {item.eventId.time}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:col-span-2">
                        <span className="font-semibold mr-2">Venue:</span> {item.eventId.venue}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button 
                      onClick={() => navigate(`/event/${item.eventId._id}`)}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {handelDelete(item._id)}}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <div className="text-5xl mb-4">❤️</div>
          <p className="text-xl font-medium text-gray-600">Your wishlist is empty</p>
          <p className="text-gray-400 mt-2">Browse events and save your favorites here!</p>
          <button 
            onClick={() => navigate('/events')}
            className="mt-6 px-8 py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all"
          >
            Explore Events
          </button>
        </div>
      )}
    </div>
  );
}