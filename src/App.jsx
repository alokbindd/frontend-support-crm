import "./App.css";
import API_BASE_URL from "./config/api";
import { useEffect, useState } from "react";
import TicketCard from "./components/TicketCard";
import CreateTicketForm from "./components/CreateTicketForm";

function App() {
  const [tickets, SetTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const fetchTickets = async () => {
    const response = await fetch(`${API_BASE_URL}/api/tickets`);
    const data = await response.json();
    SetTickets(data);
    setLoading(false);
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
      ) : (
        filteredTicket.map((ticket) => (
          <TicketCard key={ticket.ticket_id} ticket={ticket} />
        ))
      )}
    </div>
  );
}

export default App;
