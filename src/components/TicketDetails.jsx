import { useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tickets/${ticketId}`)
      .then((response) => response.json())
      .then((data) => {
        setTicket(data);
        setLoading(false);
      });
  }, [ticketId]);

  if (loading) {
    return <p>Loading ticket detail....</p>;
  }

  return (
    <div>
      <button onClick={onBack}> &larr; Back to Tickets</button>

      <h2>{ticket.subject}</h2>
      <p>Ticket ID: {ticket.ticket_id}</p>
      <p>Customer Name: {ticket.customer_name}</p>
      <p>Customer Email: {ticket.customer_email}</p>
      <p>Status: {ticket.status}</p>

      <h3>Description:</h3>
      <p>{ticket.description}</p>

      <h3>Notes:</h3>
      {ticket.notes.length === 0 ? (
        <p>No notes yet</p>
      ) : (
        ticket.notes.map((note) => (
          <div key={note.ticket_id}>
            <p>{note.note_text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketDetails