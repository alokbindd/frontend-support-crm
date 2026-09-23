import API_BASE_URL from "../config/api";

export async function getTickets() {
    const response = await fetch(`${API_BASE_URL}/api/tickets`)

    if (!response.ok) {
        throw new Error("Failed to fetch tickets")
    }

    return response.json()

}

export async function getTicket(ticketId) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`)

    if (!response.ok) {
        throw new Error("Failed to fetch ticket")
    }

    return response.json()
}

export async function createTicket(ticketData) {
    const response = await fetch(`${API_BASE_URL}/api/tickets`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketData)
        }
    )

    if (!response.ok) {
        throw new Error("Failed to create ticket")
    }

    return response.json()
}

export async function updateTicket(ticketId, updateData) {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData)
        }
    )

    if (!response.ok) {
        throw new Error("Failed to update ticket")
    }

    return response.json()
}