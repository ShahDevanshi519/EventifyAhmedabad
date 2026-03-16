import { Table, Eye } from "lucide-react";
import axios from 'axios';
import React , { useState , useEffect} from "react";

export default function ViewWishlist() {
  const [wishlist,setWishlist] = useState([]);

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
                <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition">
                <Eye size={16}/>
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}