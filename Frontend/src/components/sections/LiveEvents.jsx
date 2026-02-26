import React, { useState, useEffect } from "react"
import axios from "axios"
import EventCard from "../events/EventCard"

export default function LiveEvents() {

  const [liveEvents, setLiveEvents] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/display-isLive")
      .then((res) => {
        setLiveEvents(res.data)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
  <section className="relative w-full px-4 overflow-hidden py-10">

    {/* Title */}
    <div className="flex items-center gap-3 mb-6 animate-slide-in-left relative z-10">
      <span className="text-3xl animate-bounce">🔴</span>
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
        Live On Events
      </h2>
    </div>

    {liveEvents.length > 0 ? (

      <div className="relative z-10 flex gap-6 overflow-x-auto no-scrollbar">

        {liveEvents.map((event, index) => (

          <div
            key={event._id}
            style={{ animationDelay: `${index * 150}ms` }}
            className="min-w-[320px] animate-card-enter"
          >

            {/* Glass Border */}
            <div className="group relative rounded-2xl p-[1.5px] bg-gradient-to-br from-purple-400/50 via-pink-400/50 to-purple-400/50">

              {/* Inner Glass */}
              <div className="bg-white/30 backdrop-blur-xl rounded-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:shadow-2xl hover:shadow-pink-300/40">

                {/* Glow Overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>

                <EventCard
                  event={event}
                  onAddToWishlist={() => {}}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    ) : (

      <div className="text-center py-6 text-purple-600 relative z-10">
        No live events right now.
      </div>

    )}

  </section>
)
}