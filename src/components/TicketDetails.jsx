import { useState, useEffect } from "react";
import { getTicket, updateTicket } from "../services/ticketService";

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");

    getTicket(ticketId)
      .then((data) => {
        setTicket(data);
        setNewStatus(data.status);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load ticket. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [ticketId]);

  if (loading) {
    return (
      <main className="ticket-details-page">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to Tickets
        </button>
        <div className="loading-state details-loading" role="status">
          <div className="skeleton-card" aria-hidden="true" />
          <p>Loading ticket...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ticket-details-page">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to Tickets
        </button>
        <p className="error-message" role="alert">
          {error}
        </p>
      </main>
    );
  }

  const handleUpdate = async () => {
    setUpdateError("");
    setUpdating(true);

    const statusMap = {
      Open: "open",
      "In Progress": "in_progress",
      Closed: "closed",
    };

    const updateData = {
      status: statusMap[newStatus],
      notes: notes.trim(),
    };

    try {
      await updateTicket(ticketId, updateData);
      setNotes("");

      const updatedTicket = await getTicket(ticketId);
      setTicket(updatedTicket);
    } catch (error) {
      console.error(error);
      setUpdateError("Failed to update ticket. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <main className="ticket-details-page">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back to Tickets
      </button>

      <div className="ticket-details-card">
        <div className="details-header">
          <div>
            <p className="details-ticket-id">{ticket.ticket_id}</p>
            <h2>{ticket.subject}</h2>
          </div>

          <span
            className={`status-badge status-${ticket.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="customer-info">
          <div>
            <span className="info-label">Customer</span>
            <p>{ticket.customer_name}</p>
          </div>

          <div>
            <span className="info-label">Email</span>
            <p>{ticket.customer_email}</p>
          </div>
        </div>

        <div className="details-section">
          <h3>Description</h3>
          <p>{ticket.description}</p>
        </div>

        <div className="details-section">
          <h3>Notes</h3>

          {ticket.notes.length === 0 ? (
            <p className="no-notes">No notes yet</p>
          ) : (
            <div className="notes-list">
              {ticket.notes.map((note) => (
                <div className="note-card" key={note.id}>
                  <p>{note.note_text}</p>
                  <span>{formatDate(note.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!updateError ? (
          <div className="update-section">
            <h3>Update Ticket</h3>

            <label htmlFor="update-status">Status</label>

            <select
              id="update-status"
              className="form-input"
              value={newStatus}
              onChange={(event) => setNewStatus(event.target.value)}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>

            <label htmlFor="update-note">Note</label>

            <textarea
              id="update-note"
              className="form-input"
              placeholder="Add a note..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />

            <button
              type="button"
              className="primary-button"
              onClick={handleUpdate}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Ticket"}
            </button>
          </div>
        ) : (
          <div className="form-error" role="alert">
            <p>{updateError}</p>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setUpdateError("")}
            >
              ← Back to update
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default TicketDetails;
