"use client";

import { useState } from "react";

export default function SubmitTicketPage() {
    const [title, setTitle] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [message, setMessage] = useState("");
    const [publicId, setPublicId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!title || !customerEmail || !message) {
            alert("Please fill in all fields.");
            return;
        }
        setSubmitting(true);

        const res = await fetch("http://localhost:3000/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, message,customerEmail,customerName }),
        });

        if (res.ok) {
            const data = await res.json();
            setPublicId(data.ticket.publicId);
            setSubmitted(true);
        } else {
            alert("Failed to submit ticket. Please try again.");
        }
        setSubmitting(false);
    }

    if (submitted) {
        return (
            <div>
                <h1>Ticket Submitted Successfully!</h1>
                <p>Your ticket ID is: <strong>{publicId}</strong></p>
                <p>Please save this ID for future reference.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Submit a Support Ticket</h1>
            <label>
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>
            <br />
            <label>
                Your Name
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
            </label>
            <br />
            <label>
                Your Email:
                <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
            </label>
            <br />
            <label>
                Message:
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    cols={50}
                />
            </label>
            <br />
            <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
        </form>
    );  
}