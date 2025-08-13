import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base =
    process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;

  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseRef = supabaseUrl.split('//')[1]?.split('.')[0] || null;

  return NextResponse.json({
    ok: true,
    env: process.env.NODE_ENV,
    base,
    hasUrl: !!process.env.SUPABASE_URL,
    hasRole: !!process.env.SUPABASE_SERVICE_ROLE,
    hasOrg: !!process.env.MANAGAI_ORG_ID,
    supabaseRef,
  });
}
