import { useState } from "react";
import { createTicket } from "../services/ticketService";

function CreateTicketForm({ onTicketCreated }) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ticketData = {
      customer_name: customerName,
      customer_email: customerEmail,
      subject: subject,
      description: description,
    };

    try {
      const data = await createTicket(ticketData);

      console.log(data);

      setCustomerName("");
      setCustomerEmail("");
      setSubject("");
      setDescription("");

      onTicketCreated();
    } catch (error) {
      console.error(error);
      setError("Failed to create ticket. pls try again.");
    }
  };

  return (
    <div>
      {error ? (
        <div>
          <p>{error}</p>
          <button onClick={() => setError("")}>Fill again</button>
        </div>
      ) : (
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
          </form>{" "}
        </div>
      )}
    </div>
  );
}

export default CreateTicketForm;
