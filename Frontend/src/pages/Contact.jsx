import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [error,setError] = useState({});

  const validateForm = () => {
    let tempError = {};
    let isValid = true;

    let nameregex = /^[A-Za-z]{2,}$/
    if(!formData.name.trim()){
      tempError.name = "Name Is Required";
      isValid = false;
    }else if(!nameregex.test(formData.name)){
      tempError.name = "Name must contain only letters and spaces (min 2 characters)"
      isValid = false;
    }

    let emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!formData.email.trim()){
      tempError.email = "Email Is Required";
      isValid = false;
    }else if(!emailregex.test(formData.email)){
      tempError.email = "Invalid email format";
      isValid = false;
    }

    let textRegex = /^[A-Za-z ]+$/;
    if(!formData.subject.trim()){
      tempError.subject = "Subject Is Reuired";
      isValid = false;
    }else if(!textRegex.test(formData.subject)){
      tempError.subject = "Subject Only Contain Characters Not Digits and Special Symbole";
      isValid = false;
    }

    if(!formData.message.trim()){
      tempError.message = "Message Is Reuired";
      isValid = false;
    }else if(!textRegex.test(formData.message)){
      tempError.message = "Message Only Contain Charcters Not Digits And Special Symbole";
      isValid = false;
    }

    setError(tempError)
    return isValid
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateForm();
    if(!validation)
      return 

    axios.post("http://127.0.0.1:3000/contact-api",formData)
    .then((res) => {
      alert(res.data.msg)
      setFormData({
        name:'',
        email:'',
        subject:'',
        message:''
      });
    })
    .catch((err) => console.log(err))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-8">

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Contact Us</h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Mail, title: 'Email', content: 'hello@eventify.com', color: 'from-purple-500 to-pink-500' },
            { icon: Phone, title: 'Phone', content: '+91 9876543210', color: 'from-blue-500 to-cyan-500' },
            { icon: MapPin, title: 'Location', content: 'Ahmedabad, India', color: 'from-green-500 to-emerald-500' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${item.color} rounded-2xl p-8 text-white`}>
                <Icon size={32} className="mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/80">{item.content}</p>
              </div>
            );
          })}
        </div>

        {/* Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Contact Form */}
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="text" name="name" placeholder="Name" value={formData.name}
                onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500" />
                {error.name && (
                  <p className="text-red-500 text-sm">{error.name}</p>
                )}

              <input type="email" name="email" placeholder="Email" value={formData.email}
                onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500" />
                {error.email && (<p className="text-red-500 text-sm">{error.email}</p>)}

              <input type="text" name="subject" placeholder="Subject" value={formData.subject}
                onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500" />
                {error.subject && (<p className="text-red-500 text-sm">{error.subject}</p>)}

              <textarea name="message" rows="5" placeholder="Message" value={formData.message}
                onChange={handleChange} required
                className="w-full px-4 py-3 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500"></textarea>
                {error.message && (<p className="text-red-500 text-sm">{error.message}</p>)}

              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
                bg-[length:200%_200%] bg-left hover:bg-right transition-all duration-500">
                Send Message
              </button>
            </form>
          </div>

          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-[520px]">
            <iframe
              title="Ahmedabad Map"
              src="https://www.google.com/maps?q=Ahmedabad&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>

        </div>
      </div>
    </div>
  );
}
