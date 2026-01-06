import Link from "next/link";


export default async function InboxPage() {
    const res = await fetch('http://localhost:3000/api/tickets', { cache: 'no-store' });
    const data = await res.json();
    const tickets = data.tickets ?? [];
    

    return (
        <div>
            <h1>Inbox</h1>
            <ul>
                {tickets.map((ticket: { id: string; title: string; customerEmail: string }) => (
                    <li key={ticket.id}>
                        <Link href={`/admin/tickets/${ticket.id}`}>
                            {ticket.title} - {ticket.customerEmail}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )

}  