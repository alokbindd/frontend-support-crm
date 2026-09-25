function TicketCard({ ticket, onClick }) {
  const createdAt = new Date(ticket.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="ticket-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="ticket-card-header">
        <span className="ticket-id">{ticket.ticket_id}</span>

        <span
          className={`status-badge status-${ticket.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {ticket.status}
        </span>
      </div>

      <h3>{ticket.subject}</h3>

      <p className="ticket-customer">
        {ticket.customer_name}
        {ticket.customer_email ? ` · ${ticket.customer_email}` : ""}
      </p>

      <p className="ticket-date">{createdAt}</p>
    </div>
  );
}

export default TicketCard;
