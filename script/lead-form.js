document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('leadForm');
    if (!form) return;

    const WEB_URL = 'https://web-studio-iota.vercel.app/api/telegram';
    const hp = form.querySelector('input[name="company"]');
    const btn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (hp && hp.value.trim() !== '') return;

        const payload = {
            name: form.name.value.trim(),
            contact: form.contact.value.trim(),
            about: form.about.value.trim(),
            page: location.href,
            utm: Object.fromEntries(new URLSearchParams(location.search)),
            // secret: 'mweb_6c3e1a2'
        };

        try {
            btn.disabled = true;
            btn.textContent = 'Отправляю…';

            const res = await fetch(WEB_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Send failed');

            if (typeof gtag_report_conversion === 'function') {
                gtag_report_conversion();
            }

            form.reset();
            alert('Спасибо! Заявка отправлена ✅');
        } catch (err) {
            console.error(err);
            alert('Не удалось отправить. Напишите, пожалуйста, в WhatsApp 🙏');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Отправить';
        }
    });
});