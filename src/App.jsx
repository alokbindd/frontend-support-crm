import "./App.css";
import API_BASE_URL from "./config/api";
import { useEffect, useState } from "react";
import TicketCard from "./components/TicketCard";
import CreateTicketForm from "./components/CreateTicketForm";
import TicketDetails from "./components/TicketDetails";
import { getTickets } from "./services/ticketService";

function App() {
  const [tickets, SetTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchTickets = async () => {
    try {
      const data = await getTickets();
      SetTickets(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTicket = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = status === "All" || ticket.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      {selectedTicketId ? (
        <TicketDetails
          ticketId={selectedTicketId}
          onBack={() => setSelectedTicketId(null)}
        />
      ) : (
        <>
          <h1>Support CRM</h1>

          <CreateTicketForm onTicketCreated={fetchTickets} />

          <input
            type="text"
            placeholder="Search Ticket..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>

          {loading ? (
            <p>Loading tickets...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            filteredTicket.map((ticket) => (
              <TicketCard
                key={ticket.ticket_id}
                ticket={ticket}
                onClick={() => setSelectedTicketId(ticket.ticket_id)}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;
