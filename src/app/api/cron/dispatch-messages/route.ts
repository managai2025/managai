export const runtime = 'nodejs';
export const preferredRegion = 'fra1';

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/db/supabase';
import { sendEmail } from '@/lib/rules/actions/email';

function ensureCronAuthorized() {
  const auth = headers().get('authorization') || '';
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  return null;
}

export async function POST() {
  const unauthorized = ensureCronAuthorized();
  if (unauthorized) return unauthorized;

  const { data: rows, error } = await supabaseAdmin
    .from('messages').select('id, org_id, status, meta').eq('status', 'queued').limit(25);

  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 });
  if (!rows?.length) return NextResponse.json({ ok:true, sent: 0 });

  let sent = 0, failed = 0;

  for (const m of rows) {
    try {
      const meta = (m as any).meta || {};
      const action = meta.action || {};
      if (action.type?.startsWith('email.send')) {
        const to = meta?.to || meta?.keys?.customer_email || 'test@managai.hu';
        const template = action.template || 'cart_nudge_A';
        const msgId = await sendEmail(to, template, meta?.params || {});
        await supabaseAdmin.from('messages')
          .update({ status: 'sent', meta: { ...meta, message_id: msgId } })
          .eq('id', (m as any).id);
        sent++;
      } else {
        await supabaseAdmin.from('messages').update({ status: 'sent' }).eq('id', (m as any).id);
      }
    } catch (e:any) {
      failed++;
      await supabaseAdmin.from('messages')
        .update({ status: 'failed', meta: { ...(m as any).meta, error: e.message } })
        .eq('id', (m as any).id);
    }
  }

  return NextResponse.json({ ok:true, sent, failed });
}

// opcionális: a vercel cron GET-tel is hívhatja -> irányítsuk a POST-ra
export async function GET() {
  return POST();
}
