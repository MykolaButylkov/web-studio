document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const honeypot = form.querySelector('input[name="company"]');
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (honeypot && honeypot.value.trim() !== '') return;

    const payload = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      about: form.about.value.trim(),
      page: location.href,
      utm: Object.fromEntries(new URLSearchParams(location.search))
    };

    try {
      btn.disabled = true; btn.textContent = 'Отправляю…';

      const res = await fetch('ТВОЙ_WEB_APP_URL_ОТСЮДА', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Ошибка отправки');

      form.reset();
      alert('Спасибо! Заявка отправлена ✅');
    } catch (err) {
      console.error(err);
      alert('Не удалось отправить. Напишите мне в WhatsApp 🙏');
    } finally {
      btn.disabled = false; btn.textContent = 'Отправить';
    }
  });
});
