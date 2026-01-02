import { NextResponse } from "next/server";
import {pool}  from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { title, message, customerEmail, customerName } = body;

  if (
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof message !== "string" ||
    message.trim() === "" ||
    typeof customerEmail !== "string" ||
    !customerEmail.includes("@")
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (customerName !== undefined && typeof customerName !== "string") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const publicId = Math.random().toString(36).slice(2, 10).toUpperCase();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const ticketResult = await client.query(
      `
      INSERT INTO tickets (public_id, title, customer_email, customer_name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, status, created_at
      `,
      [publicId, title, customerEmail, customerName ?? null]
    );

    const ticket = ticketResult.rows[0];

    await client.query(
      `
      INSERT INTO messages (ticket_id, author_type, body)
      VALUES ($1, 'customer', $2)
      `,
      [ticket.id, message]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      {
        ticket: {
          publicId,
          status: ticket.status,
          createdAt: ticket.created_at,
        },
      },
      { status: 201 }
    );
  } catch {
    await client.query("ROLLBACK");

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
