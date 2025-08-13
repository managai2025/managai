import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

export async function GET() {
  const { error } = await supabaseAdmin.from('events').select('id').limit(1);
  return NextResponse.json({ tableExists: !error, error: error?.message || null });
}
