import { useEffect, useState } from "react";
import { createTicket } from "../services/ticketService";

function CreateTicketForm({
  onTicketCreated,
  onCancel,
  onBusyChange,
  embedded = false,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    onBusyChange?.(creating);
  }, [creating, onBusyChange]);

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
      setError("Failed to create ticket. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={`create-ticket-form${embedded ? " is-embedded" : ""}`}>
      {error ? (
        <div className="form-error" role="alert">
          <p>{error}</p>
          <div className="form-actions">
            {onCancel && (
              <button
                type="button"
                className="secondary-button"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              className="secondary-button"
              onClick={() => setError("")}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {!embedded && (
            <>
              <h2>Create Ticket</h2>
              <p className="section-subtitle">
                Create a new customer support request
              </p>
            </>
          )}

          <form onSubmit={handleSubmit}>
            {validationError && (
              <div className="validation-error" role="alert">
                {validationError}
              </div>
            )}
            <div className="form-row">
              <div className="field">
                <label htmlFor="customer-name">Customer Name</label>
                <input
                  id="customer-name"
                  className="form-input"
                  type="text"
                  placeholder="Jane Doe"
                  value={customerName}
                  onChange={(event) => {
                    setCustomerName(event.target.value);
                    setValidationError("");
                  }}
                />
              </div>

              <div className="field">
                <label htmlFor="customer-email">Customer Email</label>
                <input
                  id="customer-email"
                  className="form-input"
                  type="email"
                  placeholder="jane@company.com"
                  value={customerEmail}
                  onChange={(event) => {
                    setCustomerEmail(event.target.value);
                    setValidationError("");
                  }}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="ticket-subject">Subject</label>
              <input
                id="ticket-subject"
                className="form-input"
                type="text"
                placeholder="Brief summary of the issue"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setValidationError("");
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="ticket-description">Description</label>
              <textarea
                id="ticket-description"
                className="form-input description-input"
                placeholder="Describe the customer issue"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setValidationError("");
                }}
              />
            </div>

            <div className="form-actions">
              {onCancel && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onCancel}
                  disabled={creating}
                >
                  Cancel
                </button>
              )}
              <button
                className="primary-button"
                type="submit"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default CreateTicketForm;
