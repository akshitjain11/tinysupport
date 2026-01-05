import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
    ) {
    const { id } = params;
    const body = await request.json();
    const { message, authorType } = body;

    if (
      typeof message !== "string" ||
      message.trim() === "" ||''
    ) {
      return new Response("Invalid input", { status: 400 });
    }
    const client = await pool.connect();
    
    try {
      const ticketResult = await client.query(
        `
        SELECT id FROM tickets WHERE id = $1
        `,
        [id]
      );
        if (ticketResult.rowCount === 0) {
        return new Response("Ticket not found", { status: 404 });
        }

        if(ticketResult.rows[0].status === 'closed') {
          return new Response("Cannot add message to a closed ticket", { status: 400 });
        }
        
      await client.query(
        `
        INSERT INTO messages (ticket_id, author_type, body)
        VALUES ($1, 'admin', $2)
        `,
        [id, message]
      );

      await client.query(
        `
        UPDATE tickets
        SET status = 'pending'
        WHERE id = $1
        `,
        [id]
      );
      return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
      return new Response("Internal server error", { status: 500 });
    } finally {
      client.release();
    }
}