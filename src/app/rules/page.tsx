// src/app/rules/page.tsx
export default function Rules() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Rules</h1>
      <p>Coming soon: WHEN/IF/THEN builder with A/B and throttling.</p>
      <pre className="bg-gray-50 p-4 rounded border">
{`{
  "id": "rule_cart_recovery",
  "name": "Cart Recovery 2.0",
  "when": {"event": "cart_abandoned", "within_minutes": 30},
  "if": [{"field":"cart.total","op":">=","value":5000}],
  "then": [{"type":"email.send","template":"cart_nudge_A"}],
  "throttle": {"per_user_per_day": 1},
  "ab_test": {"variants": ["A","B"], "allocation":"bandit"},
  "enabled": true
}`}
      </pre>
    </main>
  );
}
