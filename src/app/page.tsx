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
            <Image src="/logo.svg" alt="ManagAI" width={48} height={48} className="rounded-lg" />
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

        {/* Hero blokk - bal oldali szövegek + jobb oldali árazási csomagok */}
        <section className="mt-16 grid items-center gap-10 md:grid-cols-2">
          {/* Bal oldal - szövegek + e-mail űrlap */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-tr from-emerald-300 to-lime-200 bg-clip-text text-transparent">
                Az intelligens webshop automatizáció új generációja
              </span>
              <span className="block mt-2 text-2xl md:text-3xl text-white/90">ami elvégzi a webshopod manuális munkáit.</span>
            </h1>
            <p className="mt-4 text-base text-zinc-300 leading-relaxed">
              <span className="text-emerald-300 font-medium">ManagAI segítünk, hogy elérd a céljaid és csökkentsd a kiadásaid, növeld a bevételeid, illetve több időd tudj spórolni.</span>
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
                    {loading ? 'Küldés…' : 'Előregisztrálok'}
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
                    Köszönjük, hamarosan értesítünk! 🎉
                  </p>
                </div>
              )}
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              <p className="mt-3 text-xs text-zinc-500">
                A "Küldés" gombbal hozzájárulsz, hogy kapcsolatba lépjünk veled a ManagAI demóval kapcsolatban.
                <span className="hidden md:inline"> Bármikor leiratkozhatsz.</span>
              </p>
            </div>
          </div>

          {/* Jobb oldal - árazási csomagok (kisebb méretben) */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-emerald-500/20 to-lime-400/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur">
              {/* Promó banner */}
              <div className="mb-5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-lime-400/20 border border-emerald-400/30 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-semibold text-emerald-300">🚀 Korai hozzáférés</span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Az első 100 ügyfél <span className="font-bold text-white">6 hónapig akciós áron</span> használhatja, próbaidő után.
                </p>
              </div>

              {/* Árazási csomagok - kompaktabb */}
              <div className="space-y-3">
                {[
                  { 
                    name: 'Alap csomag', 
                    price: '19.990', 
                    features: [
                      'SEO Copilot: Technikai checklist + auto-fix javaslatok',
                      'AI Support: Válasz-sablonok, ChatBot',
                      'Promo AI: időzített promók, A/B taktika, free-shipping nudger'
                    ] 
                  },
                  { 
                    name: 'Növekedő csomag', 
                    price: '29.990', 
                    features: [
                      'Ops Automations: rendelés/készlet workflow, késés-riasztó, RMA asszisztens',
                      'Cart Recovery 2.0: elhagyott kosár + price-drop + back-in-stock egy motorból'
                    ] 
                  },
                  { 
                    name: 'Prémium csomag', 
                    price: '49.990', 
                    features: [
                      'Feed Health Monitor: Merchant Center hibák + javítási lépések',
                      'Smart Recs: viselkedés-ajánlók, bundle AI, price-drop/back-in-stock',
                      'KPI Dashboard + napi digest: bevétel, AOV, CR, refund, RFM'
                    ] 
                  },
                ].map((pkg, idx) => (
                  <div key={pkg.name} className={`rounded-xl border p-4 transition-all hover:scale-105 ${
                    idx === 1 
                      ? 'border-emerald-400/50 bg-emerald-400/10 shadow-lg shadow-emerald-500/20' 
                      : 'border-zinc-700 bg-black/40 hover:border-zinc-600'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-base font-bold ${
                        idx === 1 ? 'text-emerald-300' : 'text-white'
                      }`}>
                        {pkg.name}
                      </h3>
                      <span className={`text-xl font-bold ${
                        idx === 1 ? 'text-emerald-300' : 'text-zinc-300'
                      }`}>
                        {pkg.price} Ft
                      </span>
                    </div>
                    <ul className="text-xs text-zinc-300 space-y-1.5 leading-relaxed">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            idx === 1 ? 'bg-emerald-300' : 'bg-zinc-400'
                          }`}></div>
                          <span className="text-zinc-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-5 text-center">
                <button className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-lime-400 px-5 py-3 text-base font-bold text-black hover:from-emerald-300 hover:to-lime-300 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25">
                  🚀 Indítsd el ingyenesen
                </button>
                <p className="mt-2 text-xs text-zinc-400">14 nap próba, nincs kötelezettség</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lábléc */}
        <footer className="mt-20 border-t border-zinc-800 pt-6 text-sm text-zinc-500 text-center">
          © {new Date().getFullYear()} ManagAI — MVP demo
        </footer>
      </div>
    </main>
  );
}
