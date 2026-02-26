import { Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">
      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search events, users..."
          className="bg-transparent outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-3 cursor-pointer group">
        <UserCircle size={26} className="text-purple-600 group-hover:text-pink-500 transition" />
        <span className="font-semibold text-gray-700">Admin</span>
      </div>
    </header>
  );
}