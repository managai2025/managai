// src/components/SignupForm.tsx
'use client';
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'ok' | 'err';

export default function SignupForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot (botok ellen)
    if ((data.get('_gotcha') as string)?.trim()) {
      setStatus('ok');
      return;
    }

    const res = await fetch('https://formspree.io/f/xvgqdjgl', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      form.reset();
      setStatus('ok');
      // Ha /thanks oldalra akarsz léptetni:
      // window.location.assign('/thanks');
    } else {
      setStatus('err');
    }
  }

  return (
    <div className="signup">
      {status === 'ok' ? (
        <p className="success">Köszönjük! Hamarosan jelentkezünk.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email címed" required />
          <input name="name" type="text" placeholder="Neved (opcionális)" />
          <input name="_gotcha" type="text" className="hp" />
          <button disabled={status === 'loading'}>
            {status === 'loading' ? 'Küldés…' : 'Értesíts induláskor'}
          </button>
        </form>
      )}
      {status === 'err' && (
        <p className="error">Hoppá, valami gond volt. Próbáld újra kicsit később!</p>
      )}
    </div>
  );
}
