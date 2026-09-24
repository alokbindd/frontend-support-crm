function TicketCard({ ticket, onClick }) {
  return (
    <div className="ticket-card" onClick={onClick}>
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
        {ticket.customer_name} . {ticket.customer_email}
      </p>

      <p className="ticket-date">
        {new Date(ticket.created_at).toLocaleString()}
      </p>
    </div>
  );
}

export default TicketCard;
