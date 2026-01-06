import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <h1>TinySupport</h1>

      <p>Minimal support inbox system</p>

      <ul>
        <li><a href="/admin/inbox">Admin Inbox</a></li>
        <li><a href="/submit">Create Support Ticket</a></li>
      </ul>

    </main>
  );
}
