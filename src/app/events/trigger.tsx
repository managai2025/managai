'use client';

import { useState } from 'react';

export default function DemoTrigger() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/demo/simulate', { method: 'POST' });
      const json = await res.json();
      setMsg(`OK – ${json.events} event generálva.`);
      setTimeout(() => window.location.reload(), 300);
    } catch (e:any) {
      setMsg('Hiba: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={run} disabled={loading}
      className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
      title="Generate demo events">
      {loading ? 'Fut…' : 'Run demo'}
    </button>
  );
}

