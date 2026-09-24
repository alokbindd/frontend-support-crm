import "./App.css";
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

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open",
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress",
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "Closed",
  ).length;

  return (
    <div className="app">
      {selectedTicketId ? (
        <TicketDetails
          ticketId={selectedTicketId}
          onBack={() => setSelectedTicketId(null)}
        />
      ) : (
        <>
          <header className="app-header">
            <div>
              <h1>Support CRM</h1>
              <p>Manage customer support tickets</p>
            </div>
          </header>
          <main className="dashboard">
            <section className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Tickets</span>
                <strong>{totalTickets}</strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">Open</span>
                <strong>{openTickets}</strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">In Progress</span>
                <strong>{inProgressTickets}</strong>
              </div>

              <div className="stat-card">
                <span className="stat-label">Closed</span>
                <strong>{closedTickets}</strong>
              </div>
            </section>
            <section className="create-section">
              <CreateTicketForm onTicketCreated={fetchTickets} />
            </section>

            <section className="ticket-section">
              <div className="ticket-toolbar">
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
              </div>

              {loading ? (
                <p className="loading-message">Loading tickets...</p>
              ) : error ? (
                <p className="error-message">{error}</p>
              ) : filteredTicket.length === 0 ? (
                <div className="empty-state">
                  {tickets.length === 0 ? (
                    <>
                      <h3>No tickets yet</h3>
                      <p>Create your first support ticket to get started.</p>
                    </>
                  ) : (
                    <>
                      <h3>No tickets found</h3>
                      <p>Try changing your search or status filter.</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="ticket-list">
                  {filteredTicket.map((ticket) => (
                    <TicketCard
                      key={ticket.ticket_id}
                      ticket={ticket}
                      onClick={() => setSelectedTicketId(ticket.ticket_id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
