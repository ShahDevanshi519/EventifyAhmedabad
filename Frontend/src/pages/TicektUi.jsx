import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function App() {
  const [downloading, setDownloading] = useState(false);
  const [ticketData, setTicketData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:3000/ticketdisplay/${id}`)
      .then((res) => setTicketData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const downloadTicket = () => {
    setDownloading(true);
    const pdfEl = document.getElementById("visual-ticket");
    
    html2canvas(pdfEl, {
      scale: 3, 
      useCORS: true, // Crucial for loading external event images
      backgroundColor: "#ffffff",
      logging: false,
    })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", [125, 210]); // Slightly taller to accommodate image
      pdf.addImage(imgData, "PNG", 0, 0, 125, 210);
      pdf.save(`Ticket_${ticketData?._id?.substring(0,6)}.pdf`);
    })
    .finally(() => setDownloading(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .page-container {
          min-height: 100vh;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Inter', sans-serif;
        }

        .ticket-border-wrapper {
          padding: 10px;
          border: 2px dashed #e2e8f0;
          border-radius: 36px;
          background: #ffffff;
        }

        .ticket-card {
          width: 450px; 
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
          border: 1px solid #f1f5f9;
          position: relative;
        }

        .ticket-header {
          background: #ffffff;
          padding: 40px 40px 20px;
          text-align: left;
          position: relative;
        }

        .brand-logo {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 4px;
          color: #c060f0;
          text-transform: uppercase;
          margin-bottom: 15px;
          display: block;
        }

        .event-name {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.8px;
          color: #0f172a;
          margin: 10px 0;
          line-height: 1.1;
        }

        .ticket-status {
          position: absolute;
          top: 40px;
          right: 40px;
          font-size: 10px;
          font-weight: 700;
          background: linear-gradient(135deg, #c060f0, #ec4899);
          color: white;
          padding: 6px 16px;
          border-radius: 100px;
          text-transform: uppercase;
        }

        /* Perforation */
        .perforation-row {
          display: flex;
          align-items: center;
          height: 40px;
          position: relative;
        }

        .notch {
          width: 40px;
          height: 40px;
          background: #f8fafc; 
          border: 2px dashed #e2e8f0;
          border-radius: 50%;
          position: absolute;
          z-index: 2;
        }
        .notch-left { left: -22px; }
        .notch-right { right: -22px; }

        .dash-line {
          flex: 1;
          border-top: 2px dashed #cbd5e1;
          margin: 0 35px;
          z-index: 1;
        }

        .ticket-body {
          padding: 0 40px 40px;
        }

        /* New Image Box Styling */
        .event-image-container {
          width: 100%;
          height: 180px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 25px;
          border: 1px solid #f1f5f9;
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .value {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
        }

        .user-section {
          background: #f8fafc;
          border-radius: 20px;
          padding: 20px 24px;
          border: 1px solid #f1f5f9;
          margin-bottom: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-ref {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #f1f5f9;
        }

        .download-btn {
          margin-top: 40px;
          background: linear-gradient(135deg, #c060f0, #ec4899);
          color: white;
          border: none;
          padding: 20px 60px;
          border-radius: 18px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 25px -5px rgba(192, 96, 240, 0.4);
        }

        .download-btn:hover {
          transform: translateY(-3px);
          opacity: 0.9;
        }
      `}</style>

      <div className="page-container">
        <div className="ticket-border-wrapper" id="visual-ticket">
          <div className="ticket-card">
            <div className="ticket-header">
              <span className="brand-logo">Eventify</span>
              <span className="ticket-status">{ticketData.bookingStatus || 'Confirmed'}</span>
              <h1 className="event-name">{ticketData?.eventId?.title || 'Loading Event...'}</h1>
              <p style={{fontSize: '13px', color: '#64748b'}}>Official Entrance E-Pass</p>
            </div>

            <div className="perforation-row">
              <div className="notch notch-left"></div>
              <div className="dash-line"></div>
              <div className="notch notch-right"></div>
            </div>

            <div className="ticket-body">
              {/* Event Image Box */}
              <div className="event-image-container">
                <img 
                  src={`http://127.0.0.1:3000/${ticketData?.eventId?.eventImage}`} 
                  alt="Event" 
                  className="event-image"
                  crossOrigin="anonymous" 
                />
              </div>

              <div className="info-grid">
                <div>
                  <p className="label">Venue</p>
                  <p className="value">{ticketData?.eventId?.venue}</p>
                  <p style={{fontSize: '13px', color: '#64748b'}}>{ticketData?.eventId?.area}</p>
                </div>
                <div>
                  <p className="label">Schedule</p>
                  <p className="value">{ticketData?.eventId?.date}</p>
                  <p className="value">{ticketData?.eventId?.time}</p>
                </div>
              </div>

              <div className="user-section">
                <div>
                  <p className="label">Attendee</p>
                  <p className="value">{ticketData?.userId?.fullName || 'Guest'}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p className="label">Amount Paid</p>
                  <p className="value" style={{color: '#c060f0', fontSize: '18px', fontWeight: '800'}}>₹{ticketData.totalAmount}</p>
                </div>
              </div>

              <div className="footer-ref">
                <p className="label" style={{marginBottom: '2px'}}>Booking Reference</p>
                <p style={{fontSize: '14px', fontWeight: '700', color: '#1e293b', letterSpacing: '2px'}}>
                  {ticketData._id?.toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button className="download-btn" onClick={downloadTicket} disabled={downloading}>
          {downloading ? "Generating PDF..." : "Download Ticket"}
        </button>
      </div>
    </>
  );
}