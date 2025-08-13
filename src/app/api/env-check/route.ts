import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || 'https';

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    `${proto}://${host}`;

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseRef = supabaseUrl.split('//')[1]?.split('.')[0] || null;

  return NextResponse.json({
    ok: true,
    env: process.env.NODE_ENV,
    base,
    hasUrl: Boolean(process.env.SUPABASE_URL),
    hasRole: Boolean(process.env.SUPABASE_SERVICE_ROLE),
    hasOrg: Boolean(process.env.MANAGAI_ORG_ID),
    supabaseRef,
  });
}
