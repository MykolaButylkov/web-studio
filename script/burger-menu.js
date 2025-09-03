// Burger toggle
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => { menu.classList.toggle('open') });
// Тема (как было исправлено ранее)
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
toggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});