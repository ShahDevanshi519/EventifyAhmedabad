import React, { useState,useEffect } from "react";
import { User, Mail, Phone, MapPin, Hash, Camera, UserCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditProfile() {
  const [profileData, setProfileData] = useState({
    adminName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    zip: "",
    profileImage: null,
  });


  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({ ...profileData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
  const id = localStorage.getItem("AdminId");
  if(!id){
    navigate('/login');
    return;
  }

  axios.get(`http://127.0.0.1:3000/admin/display/${id}`)
    .then((res) => {
      setProfileData(res.data)
      setPreview("http://127.0.0.1:3000/images/Admin/" + res.data.profileImage);
      console.log(res.data)
    })
    .catch((err) => console.log(err))
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = localStorage.getItem("AdminId");

    if(!id){
      navigate('/login');
      return;
    }

    const formdata = new FormData();
    formdata.append("adminName",profileData.adminName);
    formdata.append("lastName",profileData.lastName);
    formdata.append("email",profileData.email);
    formdata.append("mobile",profileData.mobile);
    formdata.append("address",profileData.address);
    formdata.append("city",profileData.city);
    formdata.append("zip",profileData.zip);
    if(profileData.profileImage){
      formdata.append("profileImage",profileData.profileImage);
    }
  
    axios.post(`http://127.0.0.1:3000/admin/editprofile/${id}`,formdata)
    .then((res) => {
      if(res.data.flag === 1){
        alert(res.data.msg);
        navigate('/admin/dashboard');
      }else{
        alert(res.data.msg);
      }
    }).catch((err) => console.log(err))
  };

  // Common class for inputs to ensure they are white and clean
  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-sm autofill:bg-white";

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      
      {/* Autofill Fix Style */}
      <style>
        {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus,
          textarea:-webkit-autofill,
          textarea:-webkit-autofill:hover,
          textarea:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>

      {/* Page Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        <UserCircle size={28} className="text-purple-600" />
        Edit Profile
      </h2>

      {/* Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100 shadow-md bg-white">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <User size={64} className="text-gray-300" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full text-white cursor-pointer hover:bg-pink-500 transition-colors shadow-lg">
                <Camera size={20} />
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2 font-medium">Update Profile Picture</p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="relative">
              <User className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type="text"
                name="adminName"
                placeholder="First Name"
                value={profileData.adminName || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={profileData.lastName || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="relative md:col-span-2">
              <Mail className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={profileData.email || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={profileData.mobile || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Hash className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type="text"
                name="zip"
                placeholder="Zip Code"
                value={profileData.zip || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="relative md:col-span-2">
              <MapPin className="absolute left-3 top-3 text-purple-500" size={18} />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={profileData.city || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="relative md:col-span-2">
              <MapPin className="absolute left-3 top-3 text-purple-500" size={18} />
              <textarea
                name="address"
                placeholder="Full Address"
                value={profileData.address || ""}
                onChange={handleChange}
                rows="3"
                className={inputClass}
              ></textarea>
            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold shadow-lg hover:scale-[1.02] hover:shadow-pink-300 transition-all duration-300 uppercase tracking-wider"
          >
            Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
}