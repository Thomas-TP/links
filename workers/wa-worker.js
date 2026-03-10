/**
 * Cloudflare Worker — WhatsApp redirect protégé par Cloudflare Turnstile
 *
 * Déploiement :
 *   1. Installe Wrangler : npm install -g wrangler
 *   2. Authentifie-toi   : wrangler login
 *   3. Déploie           : wrangler deploy
 *   4. Ajoute les secrets (phone number et clés Turnstile ne sont JAMAIS dans le code) :
 *        wrangler secret put TURNSTILE_SITE_KEY   <- clé publique  (Cloudflare > Turnstile)
 *        wrangler secret put TURNSTILE_SECRET     <- clé secrète   (Cloudflare > Turnstile)
 *        wrangler secret put WA_NUMBER            <- ex: 41763764551 (sans + ni espaces)
 *   5. (Optionnel) Ajoute le domaine personnalisé: wa.thomastp.ch dans le dashboard Cloudflare Workers
 */

function htmlPage(siteKey) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vérification · Thomas Prud'homme</title>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      background: #09090b;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 24px;
      text-align: center;
    }
    h1 { font-size: 1.25rem; font-weight: 600; color: #e4e4e7; }
    p  { font-size: 0.9rem; color: #71717a; max-width: 320px; }
    form { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    button {
      padding: 10px 28px;
      background: #25d366;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity .2s;
    }
    button:disabled { opacity: 0.4; cursor: default; }
  </style>
</head>
<body>
  <h1>Vérification requise</h1>
  <p>Complète la vérification ci-dessous pour accéder à WhatsApp.</p>
  <form method="POST">
    <div
      class="cf-turnstile"
      data-sitekey="${siteKey}"
      data-callback="onVerified"
    ></div>
    <button id="btn" type="submit" disabled>Continuer vers WhatsApp</button>
  </form>
  <script>
    function onVerified() {
      document.getElementById('btn').disabled = false;
    }
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      return new Response(htmlPage(env.TURNSTILE_SITE_KEY), {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    if (request.method === 'POST') {
      const body = await request.formData();
      const token = body.get('cf-turnstile-response');

      if (!token) {
        return new Response('Token manquant.', { status: 400 });
      }

      const verification = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: env.TURNSTILE_SECRET,
            response: token,
            remoteip: request.headers.get('CF-Connecting-IP'),
          }),
        }
      );

      const result = await verification.json();

      if (result.success) {
        return Response.redirect(`https://wa.me/${env.WA_NUMBER}`, 302);
      }

      return new Response('Vérification échouée. Réessaie.', { status: 403 });
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
};
