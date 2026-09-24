import { useState } from "react";
import { createTicket } from "../services/ticketService";

function CreateTicketForm({ onTicketCreated }) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setValidationError("Customer name is required.");
      return;
    }

    if (!customerEmail.trim()) {
      setValidationError("Customer email is required.");
      return;
    }

    if (!subject.trim()) {
      setValidationError("Subject is required.");
      return;
    }

    if (!description.trim()) {
      setValidationError("Description is required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customerEmail.trim())) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    setCreating(true);

    const ticketData = {
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      subject: subject.trim(),
      description: description.trim(),
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
    <div className="create-ticket-form">
      {error ? (
        <div className="form-error">
          <p>{error}</p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setError("")}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <h2>Create Ticket</h2>

          <form onSubmit={handleSubmit}>
            {validationError && (
              <div className="validation-error">{validationError}</div>
            )}
            <div className="form-row">
              <input
                className="form-input"
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setValidationError("");
                }}
              />

              <input
                className="form-input"
                type="email"
                placeholder="Customer Email"
                value={customerEmail}
                onChange={(event) => {
                  setCustomerEmail(event.target.value);
                  setValidationError("");
                }}
              />
            </div>

            <input
              className="form-input"
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setValidationError("");
              }}
            />

            <textarea
              className="form-input description-input"
              placeholder="Description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setValidationError("");
              }}
            />

            <button
              className="primary-button"
              type="submit"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Ticket"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default CreateTicketForm;
