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
      .then((res) => {
        console.log(res.data); // ← verify ticketTypes is coming
        setTicketData(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const downloadTicket = () => {
    setDownloading(true);
    const pdfEl = document.getElementById("visual-ticket");

    html2canvas(pdfEl, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    })
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", [125, 210]);
      pdf.addImage(imgData, "PNG", 0, 0, 125, 210);
      pdf.save(`Ticket_${ticketData?._id?.substring(0, 6)}.pdf`);
    })
    .finally(() => setDownloading(false));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .page-container {
          min-height: 100vh;
          background: #f0eff4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'DM Sans', sans-serif;
        }

        .ticket-border-wrapper {
          padding: 10px;
          border: 2px dashed #c8c4db;
          border-radius: 32px;
          background: #ffffff;
        }

        .ticket-card {
          width: 460px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #ede9f6;
        }

        .ticket-header {
          padding: 28px 32px 20px;
          background: #ffffff;
          border-bottom: 1px solid #ede9f6;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-left { flex: 1; }

        .brand-logo {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 4px;
          color: #7c4dbc;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .event-name {
          font-size: 22px;
          font-weight: 700;
          color: #1a1523;
          line-height: 1.2;
          margin: 0 0 4px;
        }

        .event-sub {
          font-size: 12px;
          color: #8a85a0;
          margin: 0;
        }

        .ticket-status {
          font-size: 10px;
          font-weight: 600;
          background: #f0e8fc;
          color: #7c4dbc;
          padding: 5px 14px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;
          align-self: flex-start;
          margin-top: 2px;
        }

        .perforation-row {
          display: flex;
          align-items: center;
          height: 36px;
          position: relative;
          background: #ffffff;
        }

        .notch {
          width: 36px;
          height: 36px;
          background: #f0eff4;
          border: 2px dashed #c8c4db;
          border-radius: 50%;
          position: absolute;
          z-index: 2;
          flex-shrink: 0;
        }
        .notch-left  { left: -20px; }
        .notch-right { right: -20px; }

        .dash-line {
          flex: 1;
          border-top: 2px dashed #ddd8ef;
          margin: 0 30px;
          z-index: 1;
        }

        .ticket-body {
          padding: 0 32px 32px;
        }

        .event-image-container {
          width: 100%;
          height: 165px;
          border-radius: 14px;
          overflow: hidden;
          margin-bottom: 22px;
          border: 1px solid #ede9f6;
          background: #f5f3fb;
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .section-label {
          font-size: 10px;
          font-weight: 600;
          color: #a89ec4;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 18px 0 8px;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .info-table tr {
          border-bottom: 1px solid #f0edf8;
        }

        .info-table tr:last-child {
          border-bottom: none;
        }

        .info-table td {
          padding: 9px 0;
          vertical-align: middle;
        }

        .info-table td.td-label {
          color: #8a85a0;
          font-size: 12px;
          width: 40%;
        }

        .info-table td.td-value {
          color: #1a1523;
          font-weight: 500;
          text-align: right;
        }

        .info-table td.td-amount {
          color: #7c4dbc;
          font-weight: 700;
          font-size: 16px;
          text-align: right;
        }

        /* ← NEW: ticket type badge */
        .ticket-type-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge-general {
          background: #f0e8fc;
          color: #7c4dbc;
        }

        .badge-vip {
          background: #fef9e7;
          color: #b7860b;
        }

        .divider {
          border: none;
          border-top: 1px dashed #ddd8ef;
          margin: 20px 0 16px;
        }

        .footer-ref {
          text-align: center;
        }

        .ref-label {
          font-size: 10px;
          font-weight: 600;
          color: #a89ec4;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 5px;
        }

        .ref-id {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #1a1523;
          letter-spacing: 2px;
        }

        .download-btn {
          margin-top: 32px;
          background: #7c4dbc;
          color: #ffffff;
          border: none;
          padding: 16px 56px;
          border-radius: 16px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
        }

        .download-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .download-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="page-container">
        <div className="ticket-border-wrapper" id="visual-ticket">
          <div className="ticket-card">

            {/* Header */}
            <div className="ticket-header">
              <div className="header-left">
                <span className="brand-logo">Eventify</span>
                <h1 className="event-name">{ticketData?.eventId?.title || 'Loading Event...'}</h1>
                <p className="event-sub">Official Entrance E-Pass</p>
              </div>
              <span className="ticket-status">{ticketData.bookingStatus || 'Confirmed'}</span>
            </div>

            {/* Perforation */}
            <div className="perforation-row">
              <div className="notch notch-left"></div>
              <div className="dash-line"></div>
              <div className="notch notch-right"></div>
            </div>

            {/* Body */}
            <div className="ticket-body">

              {/* Event Image */}
              <div className="event-image-container">
                <img
                  src={`http://127.0.0.1:3000/${ticketData?.eventId?.eventImage}`}
                  alt="Event"
                  className="event-image"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Event Details */}
              <p className="section-label">Event Details</p>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="td-label">Venue</td>
                    <td className="td-value">{ticketData?.eventId?.venue || '—'}</td>
                  </tr>
                  <tr>
                    <td className="td-label">Area</td>
                    <td className="td-value">{ticketData?.eventId?.area || '—'}</td>
                  </tr>
                  <tr>
                    <td className="td-label">Date</td>
                    <td className="td-value">
                      {ticketData?.eventId?.date
                        ? new Date(ticketData.eventId.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })
                        : '—'}
                    </td>
                  </tr>
                  <tr>
                    <td className="td-label">Time</td>
                    <td className="td-value">{ticketData?.eventId?.time || '—'}</td>
                  </tr>
                </tbody>
              </table>

              {/* ← NEW: Ticket Types Section */}
              {ticketData?.ticketTypes && ticketData.ticketTypes.length > 0 && (
                <>
                  <p className="section-label">Ticket Breakdown</p>
                  <table className="info-table">
                    <tbody>
                      {ticketData.ticketTypes.map((t, index) => (
                        <tr key={index}>
                          <td className="td-label">
                            <span className={`ticket-type-badge ${t.type === 'VIP' ? 'badge-vip' : 'badge-general'}`}>
                              {t.type}
                            </span>
                          </td>
                          <td className="td-value">
                            {t.quantity} × ₹{t.pricePerTicket} = ₹{t.quantity * t.pricePerTicket}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Attendee Details */}
              <p className="section-label">Attendee Details</p>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="td-label">Attendee</td>
                    <td className="td-value">{ticketData?.userId?.fullName || 'Guest'}</td>
                  </tr>
                  <tr>
                    <td className="td-label">Total Tickets</td>
                    <td className="td-value">{ticketData?.numberOfTickets || '—'}</td>
                  </tr>
                  <tr>
                    <td className="td-label">Amount Paid</td>
                    <td className="td-amount">₹{ticketData.totalAmount}</td>
                  </tr>
                </tbody>
              </table>

              {/* Booking Reference */}
              <hr className="divider" />
              <div className="footer-ref">
                <p className="ref-label">Booking Reference</p>
                <p className="ref-id">{ticketData._id?.toUpperCase()}</p>
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