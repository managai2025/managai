import Link from 'next/link';

export default function Home() {
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">ManagAI Platform</h1>
      <p className="text-gray-600">Production fut a managai.hu-n ✅</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><Link className="underline" href="/events">Events</Link></li>
        <li><Link className="underline" href="/messages">Messages</Link></li>
        <li><Link className="underline" href="/connectors">Connectors</Link></li>
      </ul>
    </main>
  );
}
