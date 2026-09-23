import { useState } from "react";
import API_BASE_URL from "../config/api";

function CreateTicketForm({ onTicketCreated }) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ticketData = {
      customer_name: customerName,
      customer_email: customerEmail,
      subject: subject,
      description: description,
    };

    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      return;
    }

    const data = await response.json();

    console.log(data);

    setCustomerName("");
    setCustomerEmail("");
    setSubject("");
    setDescription("");

    onTicketCreated()
  };

  return (
    <div>
      <h2>Create Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
        />

        <input
          type="email"
          placeholder="Customer Email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
        />

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button>Create Ticket</button>
      </form>
    </div>
  );
}

export default CreateTicketForm;
