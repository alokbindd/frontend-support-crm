import "./App.css";
import { useEffect, useRef, useState } from "react";
import TicketCard from "./components/TicketCard";
import CreateTicketForm from "./components/CreateTicketForm";
import TicketDetails from "./components/TicketDetails";
import { getTickets } from "./services/ticketService";

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed", label: "Closed" },
];

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
  const [allTickets, setAllTickets] = useState([]);
  const [displayedTickets, setDisplayedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [createDrawerMounted, setCreateDrawerMounted] = useState(false);
  const [createBusy, setCreateBusy] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const createBusyRef = useRef(false);
  const filterRef = useRef(null);
  const skipFilterFetchRef = useRef(true);
  const displayedRequestIdRef = useRef(0);
  createBusyRef.current = createBusy;

  const fetchAllTickets = async () => {
    const data = await getTickets();
    setAllTickets(data);
    return data;
  };

  const fetchDisplayedTickets = async (filterStatus, filterSearch) => {
    const requestId = ++displayedRequestIdRef.current;

    try {
      setError("");
      setLoading(true);
      const data = await getTickets({
        status: filterStatus,
        search: filterSearch,
      });
      if (requestId !== displayedRequestIdRef.current) {
        return;
      }
      setDisplayedTickets(data);
    } catch (error) {
      if (requestId !== displayedRequestIdRef.current) {
        return;
      }
      console.error(error);
      setError("Failed to load tickets. Please try again.");
    } finally {
      if (requestId === displayedRequestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const refreshTickets = async () => {
    try {
      setError("");
      const all = await fetchAllTickets();
      if (status === "All" && !debouncedSearch.trim()) {
        setDisplayedTickets(all);
        return;
      }
      await fetchDisplayedTickets(status, debouncedSearch);
    } catch (error) {
      console.error(error);
      setError("Failed to load tickets. Please try again.");
    }
  };

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        setAllTickets(data);
        setDisplayedTickets(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    if (skipFilterFetchRef.current) {
      skipFilterFetchRef.current = false;
      return;
    }

    fetchDisplayedTickets(status, debouncedSearch);
  }, [status, debouncedSearch]);

  const openCreateTicket = () => {
    if (!createDrawerMounted) {
      setCreateDrawerMounted(true);
      requestAnimationFrame(() => setShowCreateTicket(true));
      return;
    }
    setShowCreateTicket(true);
  };

  const closeCreateTicket = () => {
    if (createBusyRef.current) {
      return;
    }
    setShowCreateTicket(false);
  };

  const handleTicketCreated = () => {
    refreshTickets();
    setShowCreateTicket(false);
  };

  useEffect(() => {
    if (!showCreateTicket) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      document.getElementById("customer-name")?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeCreateTicket();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showCreateTicket]);

  useEffect(() => {
    if (!statusMenuOpen) {
      return;
    }

    const onPointerDown = (event) => {
      if (!filterRef.current?.contains(event.target)) {
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

  const totalTickets = allTickets.length;

  const openTickets = allTickets.filter(
    (ticket) => ticket.status === "Open",
  ).length;

  const inProgressTickets = allTickets.filter(
    (ticket) => ticket.status === "In Progress",
  ).length;

  const closedTickets = allTickets.filter(
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
          <div className="header-actions">
            <button
              type="button"
              className="new-ticket-button"
              onClick={openCreateTicket}
              aria-label="New Ticket"
              aria-haspopup="dialog"
              aria-expanded={showCreateTicket}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 3.25v9.5M3.25 8h9.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="new-ticket-label-full">New Ticket</span>
              <span className="new-ticket-label-short">New</span>
            </button>
            <div className="header-user">
              <span className="header-user-name">Support Agent</span>
              <span className="avatar" aria-hidden="true">
                SA
              </span>
            </div>
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
            <button
              type="button"
              className={`stat-card${status === "All" ? " stat-card-active" : ""}`}
              onClick={() => {
                setStatus("All");
                setStatusMenuOpen(false);
              }}
              aria-pressed={status === "All"}
              aria-label="Show all tickets"
            >
              <div className="stat-card-top">
                <span className="stat-label">Total Tickets</span>
                <span className="stat-icon stat-icon-total">
                  <TicketIcon />
                </span>
              </div>
              <strong>{totalTickets}</strong>
            </button>

            <button
              type="button"
              className={`stat-card${status === "Open" ? " stat-card-active" : ""}`}
              onClick={() => {
                setStatus("Open");
                setStatusMenuOpen(false);
              }}
              aria-pressed={status === "Open"}
              aria-label="Show open tickets"
            >
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
            </button>

            <button
              type="button"
              className={`stat-card${status === "In Progress" ? " stat-card-active" : ""}`}
              onClick={() => {
                setStatus("In Progress");
                setStatusMenuOpen(false);
              }}
              aria-pressed={status === "In Progress"}
              aria-label="Show in-progress tickets"
            >
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
            </button>

            <button
              type="button"
              className={`stat-card${status === "Closed" ? " stat-card-active" : ""}`}
              onClick={() => {
                setStatus("Closed");
                setStatusMenuOpen(false);
              }}
              aria-pressed={status === "Closed"}
              aria-label="Show closed tickets"
            >
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
            </button>
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

              <div className="filter-field" ref={filterRef}>
                <button
                  type="button"
                  id="status-filter"
                  className="status-select"
                  aria-haspopup="listbox"
                  aria-expanded={statusMenuOpen}
                  aria-label="Filter by status"
                  onClick={() => setStatusMenuOpen((open) => !open)}
                >
                  <span className="status-select-label">
                    {STATUS_OPTIONS.find((option) => option.value === status)
                      ?.label || "All Statuses"}
                  </span>
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
                    {STATUS_OPTIONS.map((option) => (
                      <li key={option.value} role="none">
                        <button
                          type="button"
                          role="option"
                          aria-selected={status === option.value}
                          className={`status-option${
                            status === option.value ? " is-active" : ""
                          }`}
                          onClick={() => {
                            setStatus(option.value);
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
            ) : displayedTickets.length === 0 ? (
              <div className="empty-state">
                {allTickets.length === 0 ? (
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
                {displayedTickets.map((ticket) => (
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

      {createDrawerMounted && (
        <div
          className={`create-drawer${showCreateTicket ? " is-open" : ""}`}
          aria-hidden={!showCreateTicket}
        >
          <div
            className="create-drawer-overlay"
            onClick={closeCreateTicket}
          />
          <aside
            className="create-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-drawer-title"
            inert={showCreateTicket ? undefined : true}
          >
            <div className="create-drawer-header">
              <div>
                <h2 id="create-drawer-title">Create New Ticket</h2>
                <p>Create a new customer support request</p>
              </div>
              <button
                type="button"
                className="drawer-close-button"
                onClick={closeCreateTicket}
                disabled={createBusy}
                aria-label="Close create ticket"
              >
                ×
              </button>
            </div>
            <div className="create-drawer-body">
              <CreateTicketForm
                embedded
                onCancel={closeCreateTicket}
                onBusyChange={setCreateBusy}
                onTicketCreated={handleTicketCreated}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
