export const runtime = 'nodejs';
export const preferredRegion = 'fra1';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/db/supabase';
import type { Event, Rule } from '@/lib/types';
import { evaluateRule } from '@/lib/rules/engine';

const EventSchema = z.object({
  id: z.string(),
  idemp_key: z.string().optional(),
  type: z.string(),
  ts: z.number(),
  source: z.string(),
  org_id: z.string().optional(),           // env fallback
  payload: z.any(),
  keys: z.record(z.union([z.string(), z.number()])).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ev = EventSchema.parse(body) as unknown as Event;
    const org = (ev as any).org_id ?? (process.env.MANAGAI_ORG_ID as string);
    const idemp = ev.idemp_key || ev.id;

    // 1) Persist (idempotent)
    const { error: evErr } = await supabaseAdmin
      .from('events')
      .upsert({
        org_id: org,
        type: ev.type,
        ts: new Date(ev.ts * 1000).toISOString(),
        source: ev.source,
        idemp_key: idemp,
        payload: ev.payload,
        keys: ev.keys || {}
      }, { onConflict: 'org_id,idemp_key' });
    if (evErr) console.warn('[events] upsert error', evErr);

    // 2) Load active rules
    const { data: rulesRows, error: rErr } = await supabaseAdmin
      .from('rules')
      .select('json, enabled')
      .eq('org_id', org)
      .eq('enabled', true);
    if (rErr) console.warn('[events] rules fetch error', rErr);

    const actions: any[] = [];
    for (const row of rulesRows || []) {
      const rule = row.json as Rule;
      const res = await evaluateRule(rule, ev, { org_id: org });
      if (res.matched) actions.push(...res.actions);
    }

    // 3) Queue messages
    for (const a of actions) {
      await supabaseAdmin.from('messages').insert({
        org_id: org,
        channel: a.type?.startsWith('email') ? 'email' : 'system',
        status: 'queued',
        meta: { action: a, from_event: idemp, keys: ev.keys || {} }
      });
    }

    return NextResponse.json({ ok: true, received: ev.id, queued: actions.length });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e.message }, { status: 400 });
  }
}
