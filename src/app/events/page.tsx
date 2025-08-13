// src/app/events/page.tsx
import { supabaseAdmin } from '@/lib/db/supabase';
import DemoTrigger from './trigger';

export default async function EventsPage() {
  const { data: rows } = await supabaseAdmin
    .from('events')
    .select('ts, type, source, payload')
    .order('ts', { ascending: false })
    .limit(20);

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events (latest 20)</h1>
        <DemoTrigger />
      </div>
      <div className="rounded-xl border divide-y">
        {(rows || []).map((r:any, i:number) => (
          <div key={i} className="p-4">
            <div className="text-sm text-gray-500">{new Date(r.ts).toLocaleString()}</div>
            <div className="font-semibold">{r.type} <span className="text-xs text-gray-400">[{r.source}]</span></div>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">{JSON.stringify(r.payload, null, 2)}</pre>
          </div>
        ))}
        {!rows?.length && <div className="p-4 text-gray-500">No events yet.</div>}
      </div>
    </main>
  );
}
