"use client";
import { useState } from "react";

export default function ReplyForm({ticketId}: { ticketId: string }) {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (message.trim() === "") return;
        setSubmitting(true);

        await fetch(`http://localhost:3000/api/tickets/${ticketId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message, authorType: 'admin' }),
        });

        window.location.reload();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Reply to Ticket</h3>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                cols={50}
            />
            <br />
            <button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Reply"}
            </button>
        </form>
    );
}

