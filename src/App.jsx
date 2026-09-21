import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import TicketCard from './components/TicketCard'

function App() {
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

  const [name, setName] = useState("Alok")

  return (
    <div>
      <h1>Support CRM</h1>

      {/* {ticket.map((ticket) => (
        <TicketCard
          key={ticket.ticket_id}
          ticket={ticket}
        />
      ))} */}
      <h2>Hello, {name}</h2>
      <button onClick={()=> setName("Rahul")}>
        ChangeName
      </button>
    </div>
  )
}

export default App
