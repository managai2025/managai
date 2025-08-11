import SignupForm from '../components/SignupForm';  
import './globals.css';

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

        <section className="mt-20 grid gap-8 md:grid-cols-2 md:items-center">
  <div>
    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
      AI, ami elvégzi a webshopod <span className="text-emerald-400">manuális</span> munkáit.
    </h1>

    <p className="mt-4 text-neutral-300">
    {"Akciók időzítése, SEO, Analytics, chatbot és vásárlói ajánlások — egy platformon."}
    </p>

    <div className="mt-6 space-y-4">
      <SignupForm />

      {/* Meghagyjuk a Demo/Pitch linket külön */}
      <div>
        <a
          href="https://managai-iota.vercel.app"
          target="_blank"
          className="inline-block rounded-md border border-neutral-700 px-5 py-3 hover:bg-neutral-800"
        >
          Demo / Pitch
        </a>
      </div>
    </div>

    <p className="mt-3 text-sm text-neutral-400">
      {"Első 100 ügyfél: bevezető ár az első évben."}
    </p>
  </div>

  {/* jobb oldali doboz / videó / bármi */}
  <div className="rounded-xl border border-neutral-800 p-6">
    {/* ide mehet később kép vagy videó */}
  </div>
</section>

        <footer className="mt-16 border-t border-neutral-900 pt-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} ManagAI — Tulajdonos & Alapító: Gafouroglou Richard
        </footer>
      </div>
    </main>
  );
}
