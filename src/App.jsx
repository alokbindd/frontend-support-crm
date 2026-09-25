import "./App.css";
import { useEffect, useState } from "react";
import TicketCard from "./components/TicketCard";
import CreateTicketForm from "./components/CreateTicketForm";
import TicketDetails from "./components/TicketDetails";
import { getTickets } from "./services/ticketService";

function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 8.5A2.5 2.5 0 0 1 7 6h10a2.5 2.5 0 0 1 2.5 2.5v1.2a1.8 1.8 0 0 0 0 3.6v1.2A2.5 2.5 0 0 1 17 17H7a2.5 2.5 0 0 1-2.5-2.5v-1.2a1.8 1.8 0 1 0 0-3.6V8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 9.5h6M9 14.5h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon">
              <TicketIcon />
            </div>
            <div>
              <h1>Support CRM</h1>
              <p className="header-subtitle">Manage customer support tickets</p>
            </div>
          </div>
          <div className="header-user">
            <span>Support Agent</span>
            <span className="avatar" aria-hidden="true">
              SA
            </span>
          </div>
        </div>
      </header>

      {selectedTicketId ? (
        <TicketDetails
          ticketId={selectedTicketId}
          onBack={() => setSelectedTicketId(null)}
        />
      ) : (
        <main className="dashboard">
          <section className="stats-grid" aria-label="Ticket statistics">
            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-label">Total Tickets</span>
                <span className="stat-icon stat-icon-total">
                  <TicketIcon />
                </span>
              </div>
              <strong>{totalTickets}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-label">
                  <span className="stat-dot stat-dot-open" aria-hidden="true" />
                  Open
                </span>
                <span className="stat-icon stat-icon-open">
                  <TicketIcon />
                </span>
              </div>
              <strong>{openTickets}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-label">
                  <span
                    className="stat-dot stat-dot-progress"
                    aria-hidden="true"
                  />
                  In Progress
                </span>
                <span className="stat-icon stat-icon-progress">
                  <TicketIcon />
                </span>
              </div>
              <strong>{inProgressTickets}</strong>
            </div>

            <div className="stat-card">
              <div className="stat-card-top">
                <span className="stat-label">
                  <span
                    className="stat-dot stat-dot-closed"
                    aria-hidden="true"
                  />
                  Closed
                </span>
                <span className="stat-icon stat-icon-closed">
                  <TicketIcon />
                </span>
              </div>
              <strong>{closedTickets}</strong>
            </div>
          </section>

          <section className="create-section">
            <CreateTicketForm onTicketCreated={fetchTickets} />
          </section>

          <section className="ticket-section">
            <div className="ticket-toolbar">
              <div className="search-field">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M16 16.5 20 20.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <label htmlFor="ticket-search" className="sr-only">
                  Search tickets
                </label>
                <input
                  id="ticket-search"
                  type="text"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="filter-field">
                <label htmlFor="status-filter" className="sr-only">
                  Filter by status
                </label>
                <select
                  id="status-filter"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-state" role="status">
                <div className="skeleton-list" aria-hidden="true">
                  <div className="skeleton-card" />
                  <div className="skeleton-card" />
                  <div className="skeleton-card" />
                </div>
                <p>Loading tickets...</p>
              </div>
            ) : error ? (
              <p className="error-message" role="alert">
                {error}
              </p>
            ) : filteredTicket.length === 0 ? (
              <div className="empty-state">
                {tickets.length === 0 ? (
                  <>
                    <div className="empty-icon">
                      <TicketIcon />
                    </div>
                    <h3>No tickets yet</h3>
                    <p>Create your first support ticket to get started.</p>
                  </>
                ) : (
                  <>
                    <div className="empty-icon">
                      <TicketIcon />
                    </div>
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
      )}
    </div>
  );
}

export default App;
