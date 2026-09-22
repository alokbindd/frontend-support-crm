import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import TicketCard from './components/TicketCard'

function App() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("All")

  const ticket = [
    {
      ticket_id: "TKT-001",
      customer_name: "Rahul Sharma",
      subject: "Unable to login",
      status: "Open",
    },
    {
      ticket_id: "TKT-002",
      customer_name: "Priya Patel",
      subject: "Payment failed",
      status: "In Progress",
    },
    {
      ticket_id: "TKT-003",
      customer_name: "Amit Shah",
      subject: "Unable to reset password",
      status: "Closed",
    },
  ]

  const filteredTicket = ticket.filter((ticket) => {
    const matchesSearch = ticket.subject
    .toLowerCase()
    .includes(search.toLowerCase())

    const matchesStatus = 
      status === "All" || ticket.status === status
    
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <h1>Support CRM</h1>

      <input
        type="text"
        placeholder='Search Ticket...'
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

      {filteredTicket.map((ticket) => (
        <TicketCard
          key={ticket.ticket_id}
          ticket={ticket}
        />
      ))}

    </div>
  )
}

export default App
