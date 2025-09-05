// /api/telegram  — принимает POST с сайта и высылает в Telegram
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const { TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, FORM_SECRET } = process.env;
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'Missing env vars' });
  }

  try {
    const data = req.body || {};
    if (FORM_SECRET && data.secret !== FORM_SECRET) {
      return res.status(403).json({ ok: false, error: 'Bad secret' });
    }

    const esc = s => String(s || '').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
    const text =
`🆕 <b>Заявка с сайта</b>
👤 <b>Имя:</b> ${esc(data.name)}
📞 <b>Контакт:</b> ${esc(data.contact)}
📝 <b>Проект:</b> ${esc(data.about)}
🔗 <b>Страница:</b> ${esc(data.page || '')}
🏷️ <b>UTM:</b> ${esc(JSON.stringify(data.utm || {}))}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: Number(TELEGRAM_CHAT_ID), text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const tg = await tgRes.json();
    if (!tg.ok) return res.status(500).json({ ok: false, error: tg.description || 'Telegram error' });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e.message || e) });
  }
}
