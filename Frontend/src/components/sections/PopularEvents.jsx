import React from "react"
import EventCard from "../events/EventCard"
import axios from 'axios';
import {useState,useEffect} from 'react';

export default function PopularEvents() {

  
  const [popularEvents,setPopularEvents] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/display-popularEvents")
    .then((res) => setPopularEvents(res.data))
    .catch((err) => console.log(err))

  },[])

  return (
    <section className="py-14 w-full overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-purple-200/30 blur-3xl opacity-60"></div>

      {/* Glass Title */}
      <div className="relative flex items-center gap-3 mb-8 px-4 animate-slide-in-left">

        <span className="text-3xl animate-bounce">🎭</span>

        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Popular Events
        </h2>
      </div>

      {/* Cards Row */}
      <div className="relative flex w-full px-2">

        {popularEvents.map((event, index) => (

          <div
            key={event._id}
            style={{ animationDelay: `${index * 150}ms` }}
            className="w-1/4 px-3 animate-card-enter"
          >

            {/* Glass Border */}
            <div className="group relative rounded-2xl p-[1.5px] bg-gradient-to-br from-purple-400/50 via-pink-400/50 to-purple-400/50">

              {/* Inner Glass */}
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:shadow-2xl hover:shadow-pink-300/40">

                {/* Glow Overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>

                <EventCard
                  event={event}
                  onAddToWishlist={()=>{}}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  )
}
