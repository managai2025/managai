'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'landing' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.error || 'Hiba történt');
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Valami elromlott, próbáld újra.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Lágy grid & fény effekt hátterek */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-[80rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Fejléc */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* /public/logo.svg esetén ez jelenik meg */}
            <Image src="/logo.svg" alt="ManagAI" width={36} height={36} className="rounded-lg" />
            <span className="text-xl font-semibold tracking-tight text-emerald-300">ManagAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
            <Link href="/events" className="hover:text-white">Események</Link>
            <Link href="/messages" className="hover:text-white">Üzenetek</Link>
            <Link href="/connectors" className="hover:text-white">Csatlakozások</Link>
            <Link href="/dashboard" className="rounded-xl bg-white text-black px-3 py-1.5 font-medium hover:opacity-90">
              Belépés
            </Link>
          </nav>
        </header>

        {/* Hero blokk */}
        <section className="mt-16 grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-tr from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                Intelligens webshop automatizáció
              </span>
              <span className="block mt-3">egy platformon, egy aggyal.</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-300">
              Events → Rules → Messages. Elhagyott kosár, price-drop, back-in-stock,
              KPI csempék és ütemezett kiküldés – mindez no-code szabályokkal.
            </p>

            {/* E-mail feliratkozás / köszönjük állapot */}
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 backdrop-blur">
              {!done ? (
                <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Add meg az e-mail címedet"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-black/60 px-4 py-3 outline-none ring-emerald-400/30 focus:ring"
                  />
                  <button
                    disabled={loading}
                    className="whitespace-nowrap rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-black hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? 'Küldés…' : 'Érdekel a demo'}
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-400/20 grid place-items-center">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400">
                      <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                  </div>
                  <p className="text-emerald-300">
                    Köszönjük! Hamarosan jelentkezünk a demóval. 🎉
                  </p>
                </div>
              )}
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              <p className="mt-3 text-xs text-zinc-500">
                A "Küldés" gombbal hozzájárulsz, hogy kapcsolatba lépjünk veled a ManagAI demóval kapcsolatban.
                <span className="hidden md:inline"> Bármikor leiratkozhatsz.</span>
              </p>
            </div>

            {/* Gyors linkek */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/events" className="rounded-xl px-4 py-2 border border-zinc-800 hover:border-zinc-600">
                Élő események
              </Link>
              <Link href="/messages" className="rounded-xl px-4 py-2 border border-zinc-800 hover:border-zinc-600">
                Üzenetsor
              </Link>
              <Link href="/connectors" className="rounded-xl px-4 py-2 border border-zinc-800 hover:border-zinc-600">
                Integrációk
              </Link>
            </div>
          </div>

          {/* Vizuál / mock KPI kártya */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-emerald-500/20 to-lime-400/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur">
              <div className="text-sm text-zinc-400">KPI összefoglaló (demo)</div>
              <div className="mt-3 grid grid-cols-2 gap-4">
                {[
                  { k: 'Bevétel', v: '12.4M Ft' },
                  { k: 'CR', v: '3.2%' },
                  { k: 'AOV', v: '17 990 Ft' },
                  { k: 'Cart recovery', v: '+8.1%' },
                ].map((x) => (
                  <div key={x.k} className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                    <div className="text-xs text-zinc-400">{x.k}</div>
                    <div className="mt-1 text-xl font-semibold">{x.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-zinc-800 bg-black/40 p-4">
                <div className="text-xs text-zinc-400">Utolsó automatizáció</div>
                <div className="mt-1 text-sm">
                  <span className="text-emerald-300 font-medium">Cart Recovery 2.0</span> → 23 e-mail elküldve
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature rács */}
        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { t: 'Event Layer', d: 'Egységes események: order_created, price_changed, cart_abandoned…' },
            { t: 'Rule Engine', d: 'WHEN / IF / THEN no-code, A/B, limitálás, throttling.' },
            { t: 'Dispatcher', d: 'Üzenetsor, e-mail/Slack kiküldés, 5 percenkénti cron.' },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur">
              <div className="text-emerald-300 font-semibold">{f.t}</div>
              <p className="mt-2 text-zinc-300">{f.d}</p>
            </div>
          ))}
        </section>

        {/* Lábléc */}
        <footer className="mt-20 border-t border-zinc-800 pt-6 text-sm text-zinc-500">
          © {new Date().getFullYear()} ManagAI — MVP demo
        </footer>
      </div>
    </main>
  );
}
