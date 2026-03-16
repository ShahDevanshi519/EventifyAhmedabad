import { Table, Trash2 } from "lucide-react";
import axios from 'axios';
import React , { useState , useEffect} from "react";

export default function ViewFeedback() {
  const [feedback,setFeedback] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/admin/event/feedback")
    .then(res => setFeedback(res.data))
    .catch(err => console.log(err))
  },[])

  const handelDelete = (id) =>{

    const confirmData = window.confirm("Are You Sure You Want To Delete This Feedback?.");

    if(!confirmData){
        return;
    }
    
    axios.delete(`http://127.0.0.1:3000/admin/event/feedbackdelete/${id}`)
    .then((res) => {
        if(res.data.flag === 1){
            alert(res.data.msg);
            setFeedback(feedback.filter(feed => feed._id !== id))
        }else{
            alert(res.data.msg);
        }
    }).catch((err) => console.log(err))
  }

  return (
    <div>
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <Table size={28} className="text-purple-600" />
        Feedback & Rating Table
      </h2>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-50 text-purple-700">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User Name</th>
              <th className="p-4">Event Name</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Feedback</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {feedback.map((feed,index) => (
              <tr key={feed._id} className="border-t hover:bg-pink-50 transition">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{feed.userId?.fullName}</td>
                <td className="p-4">{feed.eventId?.title}</td>
                <td className="p-4">{feed.rating}</td>
                <td className="p-4">{feed.feedback}</td>
                {/* <td className="p-4">{book.bookingStatus}</td> */}
                <td className="p-4">{feed.feedbackDate}</td>
                <td className="p-4 flex gap-2">
                {/* <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">
                  <Edit size={16} />
                  </button> */}
                <button onClick={() => handelDelete(feed._id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
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