import React, { useEffect, useRef, useState } from "react"
import axios from 'axios'
import EventCard from "../events/EventCard"

export default function MostLovedEvents() {

  const containerRef = useRef(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/display-mostloved")
    .then((res) => setItems(res.data))
    .catch((err) => console.log(err))
  },[])

  useEffect(() => {

    const interval = setInterval(() => {

      setItems(prev => {
        const copy = [...prev]
        const first = copy.shift()
        copy.push(first)
        return copy
      })

    }, 3000)

    return () => clearInterval(interval)

  }, [])

  return (
    <section className="py-10 w-full overflow-hidden">

      {/* Title */}
      <div className="flex items-center gap-3 mb-6 px-4">

        <span className="text-3xl animate-bounce">❤️</span>

        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Ahmedabad Most Loved Events
        </h2>

      </div>

      {/* Cards */}
      <div ref={containerRef} className="flex w-full px-4">

        {items.slice(0,4).map((event, index) => (

          <div
            key={event._id}
            style={{ animationDelay: `${index * 150}ms` }}
            className="w-1/4 px-2 animate-card-enter"
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
