export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-emerald-500"></div>
            <span className="text-xl font-semibold tracking-tight">ManagAI</span>
          </div>
          <a
            href="mailto:gricsi12@icloud.com"
            className="rounded-md border border-emerald-500/50 px-4 py-2 text-sm hover:bg-emerald-500/10"
          >
            Kapcsolat
          </a>
        </header>

        <section className="mt-20 grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              AI, ami elvégzi a webshopod <span className="text-emerald-400">manuális</span> munkáit.
            </h1>
            <p className="mt-4 text-neutral-300">
              Akciók időzítése, SEO, Analytics, chatbot és vásárlói ajánlások – egy platformon.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:gricsi12@icloud.com?subject=ManagAI%20-%20Előregisztráció"
                className="rounded-md bg-emerald-500 px-5 py-3 font-medium text-black hover:bg-emerald-400"
              >
                Előregisztráció
              </a>
              <a
                href="https://managai.framer.website"
                target="_blank"
                className="rounded-md border border-neutral-700 px-5 py-3 font-medium hover:border-neutral-500"
              >
                Demo / Pitch
              </a>
            </div>
            <p className="mt-3 text-sm text-neutral-400">
              Első 100 ügyfél: bevezető ár az első évben.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="aspect-video w-full rounded-lg border border-neutral-800 bg-neutral-950" />
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm text-neutral-300">
              <li className="rounded-md bg-neutral-900/60 p-3">✅ Akciók időzítése</li>
              <li className="rounded-md bg-neutral-900/60 p-3">✅ SEO automatizálás</li>
              <li className="rounded-md bg-neutral-900/60 p-3">✅ GA integráció</li>
              <li className="rounded-md bg-neutral-900/60 p-3">✅ AI Chatbot</li>
            </ul>
          </div>
        </section>

        <footer className="mt-16 border-t border-neutral-900 pt-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} ManagAI — Tulajdonos & Alapító: Gricsi
        </footer>
      </div>
    </main>
  );
}
