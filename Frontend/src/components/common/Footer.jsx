import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-violet-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">EventifyAhmedabad</h3>
            <p className="text-purple-200 text-sm">
              Your ultimate destination for discovering and booking amazing events in Ahmedabad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/all-events" className="hover:text-white transition-colors">All Events</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-purple-200">
              <li><Link to="/category/music" className="hover:text-white transition-colors">Music</Link></li>
              <li><Link to="/category/comedy" className="hover:text-white transition-colors">Comedy</Link></li>
              <li><Link to="/category/workshops" className="hover:text-white transition-colors">Workshops</Link></li>
              <li><Link to="/category/sports" className="hover:text-white transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
            <div className="space-y-3 mb-4 text-purple-200 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>hello@eventify.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 9876543210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Ahmedabad, India</span>
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-purple-300 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-purple-300 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-purple-300 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-purple-300 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-700 pt-8">
          <div className="text-center text-purple-300 text-sm">
            <p>&copy; 2026 EventifyAhmedabad. All rights reserved. | Privacy Policy | Terms & Conditions</p>
          </div>
        </div>
      </div>
    </footer>
  );
}