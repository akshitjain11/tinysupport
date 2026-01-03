import Link from "next/link";


export default async function InboxPage() {
    const res = await fetch('/api/tickets', { cache: 'no-store' });
    const data = await res.json();
    

    return (
        <div>
            <h1>Inbox</h1>
            <ul>
                {data.tickets.map((ticket: { id: string; title: string; customerEmail: string }) => (
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