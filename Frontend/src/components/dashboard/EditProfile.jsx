import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, Camera } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ user }) {

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zip: user?.zip || '',
    profileImage: user?.profileImage || '',
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
  let errorMsg = "";

  const val = typeof value === "string" ? value : String(value || "");

  if (name === "fullName") {
    const nameregex = /^[A-Za-z]{2,}$/;
    if (!val.trim()) {
      errorMsg = "First Name Is Required";
    } else if (!nameregex.test(val.trim())) {
      errorMsg = "Name Only Consists Letters";
    }
  }

  if (name === "lastName") {
    const nameregex = /^[A-Za-z]{2,}$/;
    if (val.trim() && !nameregex.test(val.trim())) {
      errorMsg = "Last Name Only Consists Letters";
    }
  }

  if (name === "email") {
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!val.trim()) {
      errorMsg = "Email Is Required";
    } else if (!emailregex.test(val.trim())) {
      errorMsg = "Enter a valid email address";
    }
  }

  if (name === "phone") {
    const mobileregex = /^[6-9]\d{9}$/;
    if (!val.trim()) {
      errorMsg = "Mobile Number Is Required";
    } else if (!mobileregex.test(val.trim())) {
      errorMsg = "Enter a valid 10-digit mobile number";
    }
  }

  if (name === "city") {
    if (!val.trim()) {
      errorMsg = "City Is Required";
    }
  }

  if (name === "zip") {
    const zipregex = /^\d{6}$/;
    if (val.trim() && !zipregex.test(val.trim())) {
      errorMsg = "Enter a valid 6-digit ZIP code";
    }
  }

  return errorMsg;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setError((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const doValidation = () => {
    let tempError = {};
  
    ["fullName", "lastName", "email", "phone", "city", "zip"].forEach((field) => {
      const errorMsg = validateField(field, formData[field] || "");
      if (errorMsg) tempError[field] = errorMsg;
    });
    setError(tempError);
    return Object.keys(tempError).length === 0;
  };

  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    if (!token) { navigate('/signin'); return; }

    axios.get("http://127.0.0.1:3000/editprofile/fetchdata", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setFormData(res.data))
    .catch((err) => {
      if (err.response?.status === 401) {
        const refreshToken = localStorage.getItem("RefreshToken");
        if (!refreshToken) {
          alert("Your Session Is Expired, Please Login Again");
          localStorage.clear();
          navigate('/signin');
          return;
        }
        axios.post("http://127.0.0.1:3000/refreshToken", { refreshToken })
        .then((res) => {
          localStorage.setItem("AccessToken", res.data.access_token);
          return axios.get("http://127.0.0.1:3000/editprofile/fetchdata", {
            headers: { Authorization: `Bearer ${res.data.access_token}` }
          });
        })
        .then((res) => setFormData(res.data))
        .catch(() => {
          localStorage.clear();
          navigate('/signin');
        });
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!doValidation()) return;

    const token = localStorage.getItem("AccessToken");
    if (!token) { navigate('/signin'); return; }

    const myformData = new FormData();
    myformData.append("fullName", formData.fullName);
    myformData.append("lastName", formData.lastName);
    myformData.append("email", formData.email);
    myformData.append("phone", formData.phone);
    myformData.append("address", formData.address);
    myformData.append("city", formData.city);
    myformData.append("zip", formData.zip);
    myformData.append("profileImage", formData.profileImage);

    axios.post("http://127.0.0.1:3000/editprofile", myformData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => {
      alert(res.data.msg);
    })
    .catch((err) => {
      if (err.response?.status === 401) {
        const refreshToken = localStorage.getItem("RefreshToken");
        if (!refreshToken) {
          alert("Your Session Is Expired, Please Login Again");
          localStorage.clear();
          navigate('/signin');
          return;
        }
        axios.post("http://127.0.0.1:3000/refreshToken", { refreshToken })
        .then((res) => {
          const newAccessToken = res.data.access_token;
          localStorage.setItem("AccessToken", newAccessToken);
          return axios.post("http://127.0.0.1:3000/editprofile/", myformData, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "multipart/form-data"
            }
          });
        })
        .then((res) => alert(res.data.msg))
        .catch(() => {
          localStorage.clear();
          navigate('/signin');
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                formData.profileImage instanceof File
                  ? URL.createObjectURL(formData.profileImage)
                  : formData.profileImage
                  ? `http://127.0.0.1:3000/images/Uploads/${formData.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-300 shadow-lg"
            />
            <label className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700">
              <Camera size={18} className="text-white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">Click camera icon to upload photo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
              {error.fullName && <p className="text-red-500 text-sm mt-1">{error.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
              {error.lastName && <p className="text-red-500 text-sm mt-1">{error.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.phone && <p className="text-red-500 text-sm mt-1">{error.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-purple-400" size={20} />
              <textarea
                name="address"
                rows="3"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
            <div className="relative">
              <Building className="absolute left-3 top-3 text-purple-400" size={20} />
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {error.city && <p className="text-red-500 text-sm mt-1">{error.city}</p>}
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"
            />
            {error.zip && <p className="text-red-500 text-sm mt-1">{error.zip}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white
                       bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                       hover:shadow-xl transition-all"
          >
            Save Profile
          </button>

        </form>
      </div>
    </div>
  );
}