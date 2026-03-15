import { Table, Trash2, Eye } from "lucide-react";
import axios from 'axios';
import React , { useState , useEffect} from "react";

export default function ViewUsers() {

  const [users,setUsers] = useState([]);
  const [selectedUser,setSelectedUser] = useState(null);
  const [showModal,setShowModal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:3000/display-api")
    .then(res => setUsers(res.data))
    .catch(err => console.log(err))
  },[])

  const handleView = (user) =>{
    setSelectedUser(user);
    setShowModal(true);
  }

  const handelDelete = (id) => {
    const confirmData = window.confirm("Are You Sure You Want To Delete The User?");

    if(!confirmData){
      return;
    }

    axios.delete(`http://localhost:3000/admin/deleteuser/${id}`)
    .then((res) => {
      if(res.data.flag === 1){
        alert(res.data.msg);
        setUsers(users.filter(user => user._id != id));
      }else{
        alert(res.data.msg);
      }
    }).catch((err) => console.log(err))
  }

  return (
    <div>

      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Table size={28} className="text-purple-600" />
        User Table
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Password</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user,index) => (

              <tr key={user._id} className="border-t hover:bg-pink-50 transition">

                <td className="p-4">{index + 1}</td>
                <td className="p-4">{user.fullName}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.password}</td>
                <td className="p-4">{user.phone}</td>

                <td className="p-4 flex gap-2">

                  {/* VIEW BUTTON */}
                  <button
                    onClick={()=>handleView(user)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                  >
                    <Eye size={16}/>
                  </button>

                  {/* DELETE BUTTON */}
                  <button onClick={() => handelDelete(user._id)} 
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                  <Trash2 size={16}/>
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* ================= POPUP MODAL ================= */}

      {showModal && selectedUser && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-[520px] p-8 relative">

            {/* Close Button */}
            <button
              onClick={()=>setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
              User Profile
            </h2>

            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              {selectedUser.profileImage ? (
                <img
                  src={`http://127.0.0.1:3000/images/Uploads/${selectedUser.profileImage}`}
                  alt="profile"
                  className="w-28 h-28 rounded-full border-4 border-purple-200 object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="grid grid-cols-2 gap-4 text-gray-700">

              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold">{selectedUser.fullName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-semibold">{selectedUser.phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-semibold">{selectedUser.city}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold">{selectedUser.address}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Zip Code</p>
                <p className="font-semibold">{selectedUser.zip}</p>
              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8">
              <button
                onClick={()=>setShowModal(false)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Close
              </button>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}