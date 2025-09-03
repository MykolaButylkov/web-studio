// Переключение темы (light/dark)
const themeToggleBtn = document.getElementById('themeToggle');
const savedToggle = localStorage.getItem('theme');
const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', savedToggle || (prefersDarkTheme ? 'dark' : 'light'));
themeToggleBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});