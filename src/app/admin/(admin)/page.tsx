import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Seite</h1>

      <Link href="/admin/events">Events</Link>
    </div>
  );
}
