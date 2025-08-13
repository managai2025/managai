import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/db/supabase'; // nálad már létezik ez a helper
// ha más a helper útvonala, igazítsd

const Body = z.object({
  email: z.string().email(),
  source: z.string().max(100).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, source } = Body.parse(json);

    const orgId = process.env.MANAGAI_ORG_ID || null;
    const lower = email.trim().toLowerCase();

    // upsert: ha már létezik az email, frissítjük a státuszt/forrást
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          email: lower,
          org_id: orgId,
          source: source ?? 'landing',
          status: 'subscribed',
        },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('subscribe error', error);
      return NextResponse.json({ ok: false, error: 'DB hiba' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Invalid payload' },
      { status: 400 }
    );
  }
}
