// src/app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">ManagAI Dashboard</h1>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4"><h2 className="font-semibold">Recovered Revenue</h2><p className="text-3xl">0 Ft</p></div>
        <div className="rounded-xl border p-4"><h2 className="font-semibold">AOV</h2><p className="text-3xl">—</p></div>
        <div className="rounded-xl border p-4"><h2 className="font-semibold">Playbooks Active</h2><p className="text-3xl">0</p></div>
      </section>
      <section className="rounded-xl border p-4">
        <h2 className="font-semibold mb-2">Next Actions</h2>
        <ul className="list-disc ml-6">
          <li>Activate Cart Recovery 2.0</li>
          <li>Enable Free‑Shipping Nudger</li>
          <li>Run SEO Copilot check</li>
        </ul>
      </section>
    </main>
  );
}
