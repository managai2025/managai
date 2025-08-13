import { supabaseAdmin } from '@/lib/db/supabase';

export default async function MessagesPage() {
  const { data: rows } = await supabaseAdmin
    .from('messages')
    .select('created_at, status, channel, meta')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Messages (latest 20)</h1>
      <div className="rounded-xl border divide-y">
        {(rows || []).map((m:any, i:number) => (
          <div key={i} className="p-4">
            <div className="text-sm text-gray-500">{new Date(m.created_at).toLocaleString()}</div>
            <div className="font-semibold">{m.channel} — <span className="uppercase">{m.status}</span></div>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-auto">{JSON.stringify(m.meta, null, 2)}</pre>
          </div>
        ))}
        {!rows?.length && <div className="p-4 text-gray-500">No messages yet.</div>}
      </div>
    </main>
  );
}
