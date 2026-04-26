document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('is-loading');

    const preloader = document.getElementById('preloader');
    const nav = document.querySelector('.nav');
    const year = document.getElementById('year');

    if (year) year.textContent = new Date().getFullYear();

    const hidePreloader = () => {
        if (!preloader) return;
        preloader.classList.add('is-hidden');
        document.body.classList.remove('is-loading');
        setTimeout(() => preloader.remove(), 900);
    };

    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 550);
    });

    setTimeout(hidePreloader, 2800);

    const setNavState = () => {
        if (!nav) return;
        nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    setNavState();
    window.addEventListener('scroll', setNavState, { passive: true });

    const revealItems = document.querySelectorAll('[data-reveal]');

    revealItems.forEach((item) => {
        const delay = item.getAttribute('data-reveal-delay');
        if (delay) item.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', () => {
            const menu = document.getElementById('menu');
            const burger = document.getElementById('burger');
            if (menu) menu.classList.remove('open');
            if (burger) {
                burger.classList.remove('is-active');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
