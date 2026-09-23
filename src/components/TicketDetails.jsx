import { useState, useEffect } from "react";
import { getTicket, updateTicket } from "../services/ticketService";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getTicket(ticketId).then((data) => {
      setTicket(data);
      setNewStatus(data.status);
      setLoading(false);
    });
  }, [ticketId]);

  if (loading) {
    return <p>Loading ticket detail....</p>;
  }

  const handleUpdate = async () => {
    setUpdating(true);

    const statusMap = {
      Open: "open",
      "In Progress": "in_progress",
      Closed: "closed",
    };

    const updateData = {
      status: statusMap[newStatus],
      notes: notes,
    };

    try {
      await updateTicket(ticketId, updateData);
      setNotes("");
      
      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

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
          <div key={note.id}>
            <p>{note.note_text}</p>
          </div>
        ))
      )}

      <h3>Update Ticket</h3>
      <select
        value={newStatus}
        onChange={(event) => setNewStatus(event.target.value)}
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <button onClick={handleUpdate} disabled={updating}>
        {updating ? "Updating..." : "Update Ticket"}
      </button>
    </div>
  );
}

export default TicketDetails;
