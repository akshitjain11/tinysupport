import CloseTicketButton from "./CloseTicketButton";
import ReplyForm from "./ReplyForm";
export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await fetch(`http://localhost:3000/api/tickets/${id}`, { cache: 'no-store' });
    const data = await res.json();


    return (
        <div>
            <a href="/admin/inbox">Back to inbox</a>
            <h1>Ticket Details</h1>
            <p><strong>Customer Email:</strong> {data.ticket.customerEmail}</p>
            <p><strong>Customer Name:</strong> {data.ticket.customerName || 'N/A'}</p>
            <p><strong>Status:</strong> {data.ticket.status}</p>
            <p><strong>Created At:</strong> {new Date(data.ticket.createdAt).toLocaleString()}</p>

            {data.ticket.status !== 'closed' && (
                <CloseTicketButton ticketId={id} />
            )}

            <h3>Messages</h3>
            <ul>
                {data.messages.map((message: { id: string; authorType: string; body: string; createdAt: string }) => (
                    <li key={message.id}>
                        <p><strong>{message.authorType === 'customer' ? 'Customer' : 'Support'}:</strong> {message.body}</p>
                        <p><em>{new Date(message.createdAt).toLocaleString()}</em></p>
                    </li>
                ))}
            </ul>

            {data.ticket.status !== 'closed' && (
                <ReplyForm ticketId={id} />
            )}
        </div>
    );

}