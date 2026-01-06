"use client";

export default function CloseTicketButton({ ticketId }: { ticketId: string }) {
  async function handleClick() {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
    });

    window.location.reload();
  }

  return (
    <button onClick={handleClick}>
      Close Ticket
    </button>
  );
}