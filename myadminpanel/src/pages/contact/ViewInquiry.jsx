import { Table, Trash2 } from "lucide-react";
import axios from 'axios';
import React , { useState , useEffect} from "react";

export default function ViewUsers() {
  const [contact,setContact] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/contact-display")
    .then(res => setContact(res.data))
    .catch(err => console.log(err))
  },[])

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Table size={28} className="text-purple-600" />
        Inquiry Table
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Message</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {contact.map((con,index) => (
              <tr key={con.id} className="border-t hover:bg-pink-50 transition">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{con.name}</td>
                <td className="p-4">{con.email}</td>
                <td className="p-4">{con.subject}</td>
                <td className="p-4">{con.message}</td>
                <td className="p-4 flex gap-2">
                {/* <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                  <Edit size={16} />
                  </button> */}
                <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                  <Trash2 size={16} />
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