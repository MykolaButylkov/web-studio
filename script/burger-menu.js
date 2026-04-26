const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

if (burger && menu) {
    burger.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        burger.classList.toggle('is-active', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
    });
}
