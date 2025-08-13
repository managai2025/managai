// src/lib/rules/engine.ts
import { Event, Rule } from '@/lib/types';

export type EvalContext = {
  org_id: string;
  // TODO: inject stores for segments, throttling, messaging, adapters, metrics
};

function checkCondition(ev: Event, c: any): boolean {
  // Extremely simplified evaluator – replace with JSONLogic/Zod later
  const val = c.field.split('.').reduce((acc:any, k:string)=> acc?.[k], ev.payload as any);
  switch (c.op) {
    case '>': return val > c.value;
    case '>=': return val >= c.value;
    case '<': return val < c.value;
    case '<=': return val <= c.value;
    case '==': return val == c.value;
    case '!=': return val != c.value;
    case 'exists': return val !== undefined && val !== null;
    case 'not_exists': return val === undefined || val === null;
    default: return false;
  }
}

export async function evaluateRule(rule: Rule, ev: Event, ctx: EvalContext) {
  if (!rule.enabled) return { matched: false, actions: [] as any[] };
  if (rule.when.event !== ev.type) return { matched: false, actions: [] };
  if (rule.if && !rule.if.every(c => checkCondition(ev, c))) return { matched: false, actions: [] };
  // TODO throttling, ab_test allocation
  return { matched: true, actions: rule.then };
}
