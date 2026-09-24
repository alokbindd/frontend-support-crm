import { useState } from "react";
import { createTicket } from "../services/ticketService";

function CreateTicketForm({ onTicketCreated }) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError("");

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
      setError("Failed to create ticket. please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      {error ? (
        <div>
          <p>{error}</p>
          <button onClick={() => setError("")}>Try again</button>
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

            <button type='submit' disabled={creating}>
              {creating? "Creating" : "Create Ticket"}
            </button>
          </form>{" "}
        </div>
      )}
    </div>
  );
}

export default CreateTicketForm;
