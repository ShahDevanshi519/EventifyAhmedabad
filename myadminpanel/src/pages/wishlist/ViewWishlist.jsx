import { Table, Eye, X } from "lucide-react";
import axios from 'axios';
import React , { useState , useEffect} from "react";

export default function ViewWishlist() {
  const [wishlist,setWishlist] = useState([]);
  const [selectedwishlist,setSelectedWishlist] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/admin/wishlist")
    .then(res => setWishlist(res.data))
    .catch(err => console.log(err))
  },[])

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Table size={28} className="text-purple-600" />
        Wishlist Table
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User Name</th>
              <th className="p-4">Event Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {wishlist.map((wish,index) => (
              <tr key={wish._id} className="border-t hover:bg-pink-50 transition">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{wish.userId?.fullName}</td>
                <td className="p-4">{wish.eventId?.title}</td>
                <td className="p-4">{wish.wishlistDate}</td>
                <td className="p-4 flex gap-2">
                {/* <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                  <Edit size={16} />
                  </button> */}
                <button onClick={() => setSelectedWishlist(wish)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition">
                <Eye size={16}/>
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* POPUP MODAL */}
      
              {selectedwishlist && (
      
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      
              <div className="bg-white rounded-2xl w-[650px] max-h-[80vh] overflow-y-auto relative shadow-xl p-8">
      
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                  onClick={() => setSelectedWishlist(null)}
                >
                  <X size={22}/>
                </button>
      
                <h2 className="text-2xl font-bold mb-6 text-purple-700">
                 Wishlist
                </h2>
      
                {/* Event Image */}
                <img
                  src={`http://localhost:3000${selectedwishlist.eventId?.eventImage}`}
                  className="w-full h-60 object-cover rounded-xl mb-6"
                  alt={selectedwishlist.eventId?.title}
                />
      
                <div className="grid grid-cols-2 gap-4 text-gray-700">
      
                  <p><b>User Name:</b> {selectedwishlist.userId?.fullName}</p>
                  <p><b>Title:</b> {selectedwishlist.eventId?.title}</p>
                  
                  <p><b>Date:</b> {selectedwishlist.eventId?.date}</p>
                  <p><b>Time:</b> {selectedwishlist.eventId?.time}</p>
      
                  <p><b>Venue:</b> {selectedwishlist.eventId?.venue}</p>
                  <p><b>Area:</b> {selectedwishlist.eventId?.area}</p>
      
                  <p><b>Price:</b> ₹{selectedwishlist.eventId?.price}</p>
                </div>
      
              </div>
      
            </div>
      
            )}
    </div>
  );
}