function TicketCard({ ticket, onClick }) {
    return (
        <div onClick={onClick}>
            <h2>{ticket.subject}</h2>

            <p>Ticket ID: {ticket.ticket_id}</p>
            <p>Customer Name: {ticket.customer_name}</p>
            <p>Status: {ticket.status}</p>
        </div>
    )
}

export default TicketCard