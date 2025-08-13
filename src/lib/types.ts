// src/lib/types.ts
export type EventType =
  | 'order_created'
  | 'order_updated'
  | 'cart_abandoned'
  | 'price_changed'
  | 'product_back_in_stock'
  | 'customer_created'
  | 'site_view'
  | 'custom';

export interface Event<T = any> {
  id: string;            // evt_xxx
  idemp_key?: string;    // for dedupe
  type: EventType;
  ts: number;            // epoch seconds
  source: 'shopify' | 'woo' | 'demo' | 'api';
  org_id: string;
  payload: T;
  keys?: Record<string, string | number>;
}

export interface Condition {
  field: string;             // e.g. 'cart.total'
  op: '>' | '>=' | '<' | '<=' | '==' | '!=' | 'in' | 'not_in' | 'exists' | 'not_exists';
  value?: any;
}

export interface Action {
  type: 'email.send' | 'widget.show' | 'shopify.discount.publish' | 'slack.alert' | 'noop';
  template?: string;
  params?: Record<string, any>;
  schedule?: { after_minutes?: number; at_ts?: number };
}

export interface Rule {
  id: string;
  name: string;
  when: { event: EventType; within_minutes?: number };
  if?: Condition[];
  then: Action[];
  throttle?: { per_user_per_day?: number };
  ab_test?: { variants: string[]; allocation?: 'fixed' | 'bandit' };
  enabled: boolean;
}

export interface SegmentDef {
  id: string;
  def: Record<string, any>;
}
