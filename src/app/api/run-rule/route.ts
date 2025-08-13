// src/app/api/run-rule/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { evaluateRule } from '@/lib/rules/engine';

const Schema = z.object({
  rule: z.any(),
  event: z.any(),
  org_id: z.string().default('org_demo')
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rule, event, org_id } = Schema.parse(body);
  const res = await evaluateRule(rule, event, { org_id });
  return NextResponse.json(res);
}
