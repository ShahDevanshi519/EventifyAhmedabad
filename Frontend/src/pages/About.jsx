import React from 'react';
import  { useState, useEffect } from "react"
import { Heart, Zap, Users, Target } from 'lucide-react';

export default function About() {

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6">About EventifyAhmedabad</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your ultimate destination for discovering and booking amazing events in Ahmedabad
          </p>
        </div>

        {/* Story Section */}
        <div className="glass rounded-2xl p-8 sm:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            EventifyAhmedabad was founded with a simple mission: to bring people together through
            amazing events. We believe that every moment of entertainment, learning, or celebration
            deserves to be special and easily accessible.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            From music concerts to comedy shows, workshops to sports events, and festivals to cultural
            celebrations – we're here to connect you with experiences that matter.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Heart,
              title: 'Passion',
              description: 'We love what we do and it shows in every detail',
              color: 'from-red-500 to-pink-500',
            },
            {
              icon: Zap,
              title: 'Innovation',
              description: 'Cutting-edge technology for seamless experience',
              color: 'from-yellow-500 to-orange-500',
            },
            {
              icon: Users,
              title: 'Community',
              description: 'Building connections between event lovers',
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: Target,
              title: 'Excellence',
              description: 'Committed to the highest standards',
              color: 'from-blue-500 to-cyan-500',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white`}>
                <Icon size={32} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="glass rounded-2xl p-8 sm:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'Co-Founder & CEO', avatar: '👩‍💼' },
              { name: 'Rajesh Patel', role: 'Co-Founder & CTO', avatar: '👨‍💻' },
              { name: 'Devanshi Shah', role: 'Developer', avatar: '👩‍🔬' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4 text-center">{member.avatar}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <section className="relative py-20 px-4 max-w-7xl mx-auto">

      {/* Glow Background */}
      <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"></div>

      {/* Glass Container */}
      <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl p-10 border border-white/30 shadow-2xl">

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">

          <span className="text-4xl animate-pulse">❤️</span>

          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-wide">
            By The Number
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
      </div>
    </div>
  );
}