import React, { useState, useEffect } from "react"

export default function LovedByMillions() {

  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    bookings: 0,
    cities: 0,
  })

  useEffect(() => {

    const targets = {
      users: 500000,
      events: 5000,
      bookings: 1000000,
      cities: 15,
    }

    const duration = 2000
    const steps = 60
    let current = 0

    const timer = setInterval(() => {

      current++
      const progress = current / steps

      setStats({
        users: Math.floor(targets.users * progress),
        events: Math.floor(targets.events * progress),
        bookings: Math.floor(targets.bookings * progress),
        cities: Math.floor(targets.cities * progress),
      })

      if (current >= steps) clearInterval(timer)

    }, duration / steps)

    return () => clearInterval(timer)

  }, [])

  return (

    <section className="relative py-20 px-4 max-w-7xl mx-auto">

      {/* Glow Background */}
      <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"></div>

      {/* Glass Container */}
      <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-10 border border-white/30 shadow-2xl">

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">

          <span className="text-4xl animate-pulse">❤️</span>

          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
            Loved By Millions
          </h2>

        </div>

        {/* Glow Line */}
        {/* <div className="h-[3px] w-48 mb-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div> */}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {[
            { value: `${(stats.users/1000).toFixed(0)}K+`, label: "Active Users" },
            { value: `${(stats.events/1000).toFixed(1)}K+`, label: "Events" },
            { value: `${(stats.bookings/1000).toFixed(0)}K+`, label: "Bookings" },
            { value: `${stats.cities}+`, label: "Areas" },
          ].map((item, i) => (

            <div
              key={i}
              className="group text-center p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:-translate-y-2 hover:scale-105 transition-all duration-500 hover:shadow-xl hover:shadow-purple-300/40"
            >

              {/* Number */}
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                {item.value}
              </div>

              {/* Label */}
              <p className="text-purple-600 font-medium tracking-wide">
                {item.label}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  )
}
