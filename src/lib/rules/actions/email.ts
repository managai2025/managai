// Robusztus SES adapter: ha nincs AWS env, stub módban fut.
type AnyRec = Record<string, any>;

function renderTemplate(name: string, params: AnyRec = {}) {
  if (name === 'cart_nudge_A') {
    const total = params?.cartTotal ?? '—';
    return {
      subject: 'Még ott a kosarad 🛒',
      html: `<div style="font-family:system-ui">
        <h2>Folytatod a rendelést?</h2>
        <p>A kosarad értéke: <b>${total} Ft</b>.</p>
        <p><a href="${params?.restoreUrl ?? '#'}"
              style="background:#111;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">
          Vissza a kosárhoz
        </a></p>
      </div>`
    };
  }
  return { subject: 'ManagAI üzenet', html: `<pre>${JSON.stringify(params, null, 2)}</pre>` };
}

export async function sendEmail(to: string, template: string, params: AnyRec = {}) {
  const from = process.env.MAIL_SENDER || 'no-reply@managai.hu';

  // Ha nincs minden AWS env, fussunk stub módban – nincs build error, nincs külső hívás.
  if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    const { subject } = renderTemplate(template, params);
    console.log('[email.send STUB]', { to, from, subject });
    return 'stub-' + Date.now();
  }

  // Dinamikus import – csak akkor töltjük be a csomagot, ha tényleg szükséges.
  const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
  const client = new SESClient({ region: process.env.AWS_REGION });

  const { subject, html } = renderTemplate(template, params);
  const cmd = new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Source: from,
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: { Html: { Data: html, Charset: 'UTF-8' } }
    }
  });

  const res = await client.send(cmd);
  return (res as any).MessageId ?? null;
}
