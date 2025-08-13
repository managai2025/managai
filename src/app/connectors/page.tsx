// src/app/connectors/page.tsx
'use client';
import { useState } from 'react';

export default function Connectors() {
  const [shopifyToken, setShopifyToken] = useState('');
  const [wooKey, setWooKey] = useState('');
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Connectors</h1>
      <div className="rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold">Shopify</h2>
        <input className="border p-2 rounded w-full" placeholder="Access Token..." value={shopifyToken} onChange={e=>setShopifyToken(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white">Connect</button>
      </div>
      <div className="rounded-xl border p-4 space-y-4">
        <h2 className="font-semibold">WooCommerce</h2>
        <input className="border p-2 rounded w-full" placeholder="Consumer Key..." value={wooKey} onChange={e=>setWooKey(e.target.value)} />
        <button className="px-4 py-2 rounded bg-black text-white">Connect</button>
      </div>
    </main>
  );
}
