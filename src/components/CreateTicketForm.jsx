import { useState } from "react";

function CreateTicketForm() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div>
      <h2>Create Ticket</h2>
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
    </div>
  );
}

export default CreateTicketForm;
