import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.SUPABASE_URL || '';
  const role = !!process.env.SUPABASE_SERVICE_ROLE || !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ref = url?.replace('https://','').split('.')[0];
  const base = process.env.NEXT_PUBLIC_BASE_URL ||
               (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3000');
  return NextResponse.json({
    ok: !!url && role,
    hasUrl: !!url,
    hasRole: role,
    supabaseRef: ref,
    base
  });
}
