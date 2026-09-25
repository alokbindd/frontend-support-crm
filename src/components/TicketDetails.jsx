import { useState, useEffect, useRef } from "react";
import { getTicket, updateTicket } from "../services/ticketService";

const UPDATE_STATUS_OPTIONS = [
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed", label: "Closed" },
];

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 3.5 5.5 8 10 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TicketDetails({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const statusFieldRef = useRef(null);

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

  useEffect(() => {
    if (!statusMenuOpen) {
      return;
    }

    const onPointerDown = (event) => {
      if (!statusFieldRef.current?.contains(event.target)) {
        setStatusMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setStatusMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [statusMenuOpen]);

  if (loading) {
    return (
      <main className="ticket-details-page">
        <button type="button" className="back-button" onClick={onBack}>
          <BackIcon />
          Back to Tickets
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
          <BackIcon />
          Back to Tickets
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

  const selectedStatusLabel =
    UPDATE_STATUS_OPTIONS.find((option) => option.value === newStatus)
      ?.label || newStatus;

  return (
    <main className="ticket-details-page">
      <button type="button" className="back-button" onClick={onBack}>
        <BackIcon />
        Back to Tickets
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

            <div className="filter-field update-status-field" ref={statusFieldRef}>
              <button
                type="button"
                id="update-status"
                className="status-select"
                aria-haspopup="listbox"
                aria-expanded={statusMenuOpen}
                aria-label="Update ticket status"
                onClick={() => setStatusMenuOpen((open) => !open)}
              >
                <span className="status-select-label">{selectedStatusLabel}</span>
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {statusMenuOpen && (
                <ul className="status-menu" role="listbox" aria-label="Statuses">
                  {UPDATE_STATUS_OPTIONS.map((option) => (
                    <li key={option.value} role="none">
                      <button
                        type="button"
                        role="option"
                        aria-selected={newStatus === option.value}
                        className={`status-option${
                          newStatus === option.value ? " is-active" : ""
                        }`}
                        onClick={() => {
                          setNewStatus(option.value);
                          setStatusMenuOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
              <BackIcon />
              Back to update
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default TicketDetails;
