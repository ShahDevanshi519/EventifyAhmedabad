import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { MapPin, Calendar, Clock, Heart, ArrowLeft, Share2 } from 'lucide-react';
import BookingModal from '../components/booking/BookingModal';
import EventCard from '../components/events/EventCard';

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  // const [seatCount, setSeatCount] = useState(1);
  const [relatedevent, setRelatedEvent] = useState([]);
  const [upcomingEvent, setUpcomingEvent] = useState([]);
  const navigate = useNavigate();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReview, setUserReview] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:3000/event/${eventId}`)
      .then((res) => {
        setEvent(res.data);
        setIsFavorite(res.data.isLoved || false);
      })
      .catch((err) => console.log(err.data?.msg));

    axios.get(`http://127.0.0.1:3000/related-event/${eventId}`)
      .then((res) => setRelatedEvent(res.data))
      .catch((err) => console.log(err));

    axios.get("http://127.0.0.1:3000/upcoming-event")
      .then((res) => setUpcomingEvent(res.data))
      .catch((err) => console.log(err));
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - IMAGE & TITLES */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden h-96 sm:h-[500px] shadow-lg">
              <img
                src={`http://127.0.0.1:3000/${event.eventImage}`}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {event.isLive && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                  🔴 LIVE
                </div>
              )}
            </div>

            {/* Title & Badges */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-bold">
                      ⭐ {event.rating} ({event.reviews} reviews)
                    </span>
                    {event.isTrending && (
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-bold">
                        🔥 Trending
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Heart
                    size={24}
                    className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>
            </div>

            {/* About Event */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">About This Event</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {event.description}
              </p>

              <p className="text-gray-600 leading-relaxed">
                Join us for an unforgettable experience! This is one of the most anticipated
                events in Ahmedabad. Secure your seats now and be part of this amazing event.
              </p>

              {event.whatToExpect && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-2xl font-bold text-gray-800">What to Expect</h2>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {event.whatToExpect.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.note && (
                <div className="glass rounded-xl p-4 border-l-4 border-yellow-400 bg-amber-50">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Note</h3>
                  <p className="text-gray-600">{event.note}</p>
                </div>
              )}

              <div className="glass rounded-xl p-5 border-l-4 border-red-500 bg-red-50 mt-6">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Refund Policy</h2>
                <ul className="list-disc pl-6 text-black-700 space-y-1 text-sm">
                  <li><strong>No Refund</strong> once the ticket is booked.</li>
                  <li>If the event gets cancelled due to <strong>natural or political reasons</strong>, no refund will be provided.</li>
                  <li>If there is a <strong>no-show</strong>.</li>
                  <li>If you cannot make it to the event.</li>
                </ul>
              </div>
            </div>

            {/* Upcoming Events Table */}
            <div className="space-y-6 pt-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                📅 Upcoming Events
              </h2>
              <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white">
                      <th className="px-6 py-4 text-left font-semibold tracking-wide">Date</th>
                      <th className="px-6 py-4 text-left font-semibold tracking-wide">Event</th>
                      <th className="px-6 py-4 text-left font-semibold tracking-wide">Venue</th>
                      <th className="px-6 py-4 text-right font-semibold tracking-wide">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingEvent.map((item, index) => (
                      <tr key={index} className={`border-b border-purple-50 ${index % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'} hover:bg-purple-100 transition-colors`}>
                        <td className="px-6 py-4 font-medium text-gray-800">{new Date(item.date).toLocaleDateString('en-IN')}</td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">{item.title}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">📍 {item.venue}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">₹{item.price}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-bold text-gray-800">Reviews & Ratings</h2>
              <div className="space-y-3">
                {[
                  { name: 'Priya Sharma', rating: 5, comment: 'Amazing event! Worth every penny.' },
                  { name: 'Rajesh Kumar', rating: 5, comment: 'Best experience ever!' },
                  { name: 'Sneha Patel', rating: 4, comment: 'Great event with good organization.' },
                ].map((review, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-gray-800">{review.name}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowReviewModal(true)}
                className="w-[220px] py-3 mt-4 text-white font-bold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all"
              >
                Add Review & Rating
              </button>
            </div>

            {/* Related Events */}
            <div className="space-y-4 pt-8">
              <h2 className="text-2xl font-bold text-gray-800">Related Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedevent.length > 0 && relatedevent.slice(0, 2).map((e) => (
                  <EventCard key={e._id} event={e} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR INFO (BOOKING CARD) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-xl border border-gray-100 space-y-6">
              
              {/* Event Date */}
              <div className="flex items-start gap-4">
                <Calendar className="text-purple-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-gray-400 font-medium">Date</p>
                  <p className="text-lg font-bold text-gray-800">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Event Time */}
              <div className="flex items-start gap-4">
                <Clock className="text-purple-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-gray-400 font-medium">Time</p>
                  <p className="text-lg font-bold text-gray-800">{event.time}</p>
                </div>
              </div>

              {/* Event Venue */}
              <div className="flex items-start gap-4">
                <MapPin className="text-purple-600 mt-1" size={24} />
                <div>
                  <p className="text-sm text-gray-400 font-medium">Venue</p>
                  <p className="text-lg font-bold text-gray-800">{event.venue}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              

              {/* Price */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Tickets starting from</p>
                <p className="text-4xl font-bold text-purple-600">₹{event.price}</p>
              </div>
              
              {/* Book Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-4 text-white font-bold rounded-xl 
                       bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                       hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-purple-100"
              >
                Proceed to Book
              </button>

              <button className="w-full flex items-center justify-center gap-2 border-2 border-gray-100 text-gray-500 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                <Share2 size={18} />
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && (
        <BookingModal event={event} onClose={() => setShowBookingModal(false)} />
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Review & Rating</h2>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl cursor-pointer transition ${star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              rows="4"
              placeholder="Write your review here..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReviewModal(false)} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-100">Cancel</button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setUserRating(0);
                  setUserReview('');
                }}
                className="px-6 py-2 text-white font-bold rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}