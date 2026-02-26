import { Users, Calendar, ClipboardList } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Users", value: 320, icon: Users, color: "from-purple-600 to-pink-500" },
    { title: "Total Events", value: 48, icon: Calendar, color: "from-pink-500 to-purple-600" },
    { title: "Total Bookings", value: 125, icon: ClipboardList, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Welcome Header */}
      <h2 className="text-4xl font-extrabold mb-12 text-gray-800 animate-fadeIn">
        Welcome Back 👋
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-start justify-between transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Floating Icon */}
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl mb-6 bg-gradient-to-tr ${stat.color} text-white shadow-lg animate-bounce`}>
                <Icon size={28} />
              </div>

              {/* Title */}
              <h3 className="text-gray-500 text-lg">{stat.title}</h3>

              {/* Value */}
              <p className={`text-5xl font-extrabold mt-3 bg-clip-text text-transparent bg-gradient-to-r ${stat.color} animate-textGradient`}>
                {stat.value}
              </p>

              {/* 3D Glow Effect */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-300 to-pink-300 opacity-30 blur-3xl animate-pulse"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}