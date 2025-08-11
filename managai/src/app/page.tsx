'use client';

import { useEffect, useMemo, useState } from 'react';

type Campaign = {
  id: string;
  product: string;
  discount: number; // %
  start: string; // ISO
  end: string;   // ISO
};

type SeoItem = {
  id: string;
  product: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
};

type Faq = {
  id: string;
  question: string;
  answer: string;
};

function Card(props: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${props.className ?? ''}`}>
      <header className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">{props.title}</h2>
      </header>
      <div className="p-4">{props.children}</div>
    </section>
  );
}

function sectionTitle(text: string) {
  return <h3 className="text-sm font-medium text-slate-600 mb-2">{text}</h3>;
}

// --- LocalStorage helpers
const LS_KEYS = {
  campaigns: 'managai.campaigns',
  seo: 'managai.seo',
  faqs: 'managai.faqs',
} as const;

export default function Page() {
  // state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [seo, setSeo] = useState<SeoItem[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);

  // load / persist
  useEffect(() => {
    try {
      setCampaigns(JSON.parse(localStorage.getItem(LS_KEYS.campaigns) || '[]'));
      setSeo(JSON.parse(localStorage.getItem(LS_KEYS.seo) || '[]'));
      setFaqs(JSON.parse(localStorage.getItem(LS_KEYS.faqs) || '[]'));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.campaigns, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.seo, JSON.stringify(seo));
  }, [seo]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.faqs, JSON.stringify(faqs));
  }, [faqs]);

  // derived
  const now = new Date();
  const campaignWithStatus = useMemo(
    () =>
      campaigns.map((c) => {
        const s = new Date(c.start);
        const e = new Date(c.end);
        const status = now < s ? 'upcoming' : now > e ? 'expired' : 'live';
        return { ...c, status };
      }),
    [campaigns, now]
  );

  // form handlers
  function addCampaign(form: FormData) {
    const product = String(form.get('product') || '').trim();
    const discount = Number(form.get('discount') || 0);
    const start = String(form.get('start') || '');
    const end = String(form.get('end') || '');
    if (!product || !start || !end || discount <= 0) return alert('Tölts ki minden mezőt helyesen!');
    setCampaigns((arr) => [
      ...arr,
      { id: crypto.randomUUID(), product, discount, start, end },
    ]);
  }

  function genSeo(product: string) {
    if (!product) return alert('Add meg a termék nevét!');
    const base = product.trim();
    const metaTitle = `${base} – Akció és gyors szállítás | ManagAI SEO`;
    const metaDescription = `Fedezd fel a(z) ${base} terméket. Kiváló ár, gyors szállítás, biztonságos vásárlás. Automatán generált SEO tartalom – induláshoz ideális.`;
    const keywords = `${base.toLowerCase()}, akció, webáruház, vásárlás, gyors szállítás`;
    setSeo((arr) => [
      ...arr,
      { id: crypto.randomUUID(), product: base, metaTitle, metaDescription, keywords },
    ]);
  }

  function addFaq(form: FormData) {
    const q = String(form.get('q') || '').trim();
    const a = String(form.get('a') || '').trim();
    if (!q || !a) return alert('Kérdés és válasz szükséges.');
    setFaqs((arr) => [...arr, { id: crypto.randomUUID(), question: q, answer: a }]);
  }

  function remove<T extends { id: string }>(id: string, setter: (updater: (arr: T[]) => T[]) => void) {
    setter((arr) => arr.filter((x) => x.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-600 shadow ring-1 ring-red-700/20" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">ManagAI – MVP Dashboard</h1>
            </div>
            <span className="text-sm text-slate-500">Local demo • no sign-in</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Campaign Scheduler */}
        <Card title="Akció időzítés" className="lg:col-span-2">
          {sectionTitle('Új akció')}
          <form
            className="grid grid-cols-1 gap-3 md:grid-cols-5"
            action={(formData) => addCampaign(formData)}
          >
            <input name="product" placeholder="Termék neve" className="md:col-span-2 input" />
            <input name="discount" type="number" min={1} max={90} placeholder="% kedvezmény" className="input" />
            <input name="start" type="datetime-local" className="input" />
            <input name="end" type="datetime-local" className="input" />
            <button className="btn-primary md:col-span-5">Hozzáadás</button>
          </form>

          {sectionTitle('Ütemezett akciók')}
          <div className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {campaignWithStatus.length === 0 && (
              <div className="p-4 text-sm text-slate-500">Még nincs akció.</div>
            )}
            {campaignWithStatus.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-slate-900">
                    {c.product} – {c.discount}% 
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(c.start).toLocaleString()} → {new Date(c.end).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      'rounded-full px-2 py-0.5 text-xs font-medium ' +
                      (c.status === 'live'
                        ? 'bg-green-100 text-green-700'
                        : c.status === 'upcoming'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600')
                    }
                  >
                    {c.status}
                  </span>
                  <button className="btn-ghost" onClick={() => remove<Campaign>(c.id, setCampaigns)}>
                    Törlés
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Analytics Snapshot */}
        <Card title="Pillanatkép (Analytics)">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Mai látogatók</span>
              <strong className="text-slate-900">1 248</strong>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Konverzió</span>
              <strong className="text-slate-900">2.3%</strong>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Top termék</span>
              <strong className="text-slate-900">„Basic Hoodie”</strong>
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            (Dummy adatok. GA4 / Shoprenter / WooCommerce API később.)
          </p>
        </Card>

        {/* SEO Assistant */}
        <Card title="SEO asszisztens" className="lg:col-span-2">
          {sectionTitle('Meta generálás (lokális demo)')}
          <SeoForm onGenerate={genSeo} />
          <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {seo.length === 0 && <div className="p-4 text-sm text-slate-500">Még nincs SEO tartalom.</div>}
            {seo.map((s) => (
              <div key={s.id} className="p-4">
                <div className="mb-1 text-sm font-semibold text-slate-900">{s.product}</div>
                <div className="text-sm text-slate-700">
                  <strong>Title:</strong> {s.metaTitle}
                </div>
                <div className="text-sm text-slate-700">
                  <strong>Description:</strong> {s.metaDescription}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <strong>Kulcsszavak:</strong> {s.keywords}
                </div>
                <div className="mt-2">
                  <button className="btn-ghost" onClick={() => remove<SeoItem>(s.id, setSeo)}>
                    Törlés
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chatbot FAQ */}
        <Card title="Chatbot – GYIK">
          {sectionTitle('Új kérdés / válasz')}
          <form
            className="space-y-2"
            action={(formData) => addFaq(formData)}
          >
            <input name="q" placeholder="Kérdés (pl. Szállítási idő?)" className="input" />
            <textarea name="a" placeholder="Válasz" className="input h-24" />
            <button className="btn-primary">Hozzáadás</button>
          </form>
          <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {faqs.length === 0 && <div className="p-4 text-sm text-slate-500">Még nincs GYIK bejegyzés.</div>}
            {faqs.map((f) => (
              <div key={f.id} className="p-4">
                <div className="font-medium text-slate-900">{f.question}</div>
                <div className="text-sm text-slate-700">{f.answer}</div>
                <div className="mt-2">
                  <button className="btn-ghost" onClick={() => remove<Faq>(f.id, setFaqs)}>
                    Törlés
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* tiny utility styles */}
      <style jsx global>{`
        .input {
          @apply w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-slate-400;
        }
        .btn-primary {
          @apply inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-red-700 active:bg-red-800;
        }
        .btn-ghost {
          @apply inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100;
        }
      `}</style>
    </main>
  );
}

function SeoForm({ onGenerate }: { onGenerate: (product: string) => void }) {
  const [p, setP] = useState('');
  return (
    <div className="flex gap-2">
      <input
        className="input flex-1"
        placeholder="Termék / kategória neve"
        value={p}
        onChange={(e) => setP(e.target.value)}
      />
      <button type="button" className="btn-primary" onClick={() => onGenerate(p)}>
        Generálás
      </button>
    </div>
  );
}
