export const runtime = 'nodejs';
export const preferredRegion = 'fra1';

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

const ORG = '4a174cd5-3dd8-405b-9f5c-077f90ba2526'; // Helyes org_id
const BASE = 'http://127.0.0.1:3000'; // Helyi fejlesztés

function buildEvents() {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      id: 'evt_' + uuid(),
      idemp_key: 'cart_' + uuid(),
      type: 'cart_abandoned',
      ts: now,
      source: 'demo',
      org_id: ORG,
      payload: { cart: { total: 18990, currency: 'HUF', items: 3 }, customer: { email: 'anna@example.com' } },
      keys: { customer_email: 'anna@example.com' }
    },
    {
      id: 'evt_' + uuid(),
      idemp_key: 'price_' + uuid(),
      type: 'price_changed',
      ts: now,
      source: 'demo',
      org_id: ORG,
      payload: { product: { sku: 'SKU-123', old_price: 9990, new_price: 7990 } },
      keys: { sku: 'SKU-12' }
    }
  ];
}

async function ingestAll(evts: any[]) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), 3000);
  try {
    const res = await Promise.allSettled(
      evts.map(e =>
        fetch(`${BASE}/api/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(e),
          cache: 'no-store',
          signal: controller.signal
        }).then(r => r.json())
      )
    );
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(_req: NextRequest) {
  const events = buildEvents();
  const results = await ingestAll(events);
  return NextResponse.json({ ok: true, events: events.length, results });
}

export async function GET() {
  const events = buildEvents();
  const results = await ingestAll(events);
  return NextResponse.json({ ok: true, events: events.length, results });
}
