import {NextResponse} from "next/server";
import {pool} from "@/lib/db";

export async function GET(request: Request, {params}: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  const client = await pool.connect();

    try {
        const ticketResult = await client.query(
        `
        SELECT id, public_id, title, customer_email, customer_name, status, created_at
        FROM tickets
        WHERE id = $1
        `,
        [id]
        );

        if (ticketResult.rowCount === 0) {
        return NextResponse.json(
            { error: "Ticket not found" },
            { status: 404 }
        );
        }

        const row = ticketResult.rows[0];
        
        const ticket = {
        id: row.id,
        publicId: row.public_id,

        customerEmail: row.customer_email,
        customerName: row.customer_name,
        status: row.status,
        createdAt: row.created_at,
        };

        const messagesResult = await client.query(
        `
        SELECT id, author_type, body, created_at
        FROM messages
        WHERE ticket_id = $1
        ORDER BY created_at ASC
        `,
        [id]
        );

        const messages = messagesResult.rows.map((msgRow) => ({
        id: msgRow.id,
        authorType: msgRow.author_type,
        body: msgRow.body,
        createdAt: msgRow.created_at,
        }));

        return NextResponse.json({ ticket, messages }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
        const { id } = await params;
        const client = await pool.connect();

        try {
            const ticketResult = await client.query(
                `
                SELECT id FROM tickets WHERE id = $1
                `,
                [id]
            );

            if (ticketResult.rowCount === 0) {
                return NextResponse.json(
                    { error: "Ticket not found" },
                    { status: 404 }
                );
            }

            if (ticketResult.rows[0].status === 'closed') {
                return NextResponse.json(
                    { error: "Ticket is already closed" },
                    { status: 400 }
                );
            }

            await client.query(
                `
                UPDATE tickets
                SET status = 'closed'
                WHERE id = $1
                `,
                [id]
            );

            return NextResponse.json({ ok: true }, { status: 200 });
        } catch {
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 }
            );
        } finally {
            client.release();
        }
}   
