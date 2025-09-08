// js/portfolio-carousel.js
// Minimal Web – Portfolio Carousel controller (autoplay + infinite loop)
(function(){
  const carousel = document.getElementById('portfolioCarousel');
  if(!carousel) return;

  const viewport = carousel.querySelector('.carousel__viewport');
  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(track.children);
  const prev = carousel.querySelector('.carousel__arrow.prev');
  const next = carousel.querySelector('.carousel__arrow.next');
  const dotsWrap = carousel.querySelector('.carousel__dots');

  // ====== CONFIG ======
  const AUTOPLAY_MS = 3000;     // интервал автопрокрутки
  const INFINITE = true;        // бесконечный цикл
  const PAUSE_ON_HOVER = true;  // пауза при наведении
  const PAUSE_ON_INTERACT = true; // пауза при кликах/тачах/клавиатуре

  const perView = () => window.innerWidth >= 1100 ? 3 : (window.innerWidth >= 780 ? 2 : 1);
  let page = 0, positions = [];
  let autoplayTimer = 0;
  let raf = 0;

  // ---- helpers ----
  const clamp = (n, min, max)=> Math.max(min, Math.min(n, max));
  const mod = (n, m) => ((n % m) + m) % m; // true modulo

  function computePositions(){
    const pv = perView();
    positions = [];
    // Позиции рассчитываем по первому слайду каждой "страницы"
    for(let i = 0; i < slides.length; i += pv){
      positions.push(slides[i].offsetLeft);
    }
  }

  function updateDots(){
    const pages = positions.length;
    if (!pages) return;
    dotsWrap.innerHTML = '';
    // Текущую страницу нормализуем для бесконечного режима
    const current = INFINITE ? mod(page, pages) : clamp(page, 0, pages-1);
    for(let i=0;i<pages;i++){
      const b = document.createElement('button');
      b.className = 'dot' + (i===current ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('aria-label', `Показать группу слайдов ${i+1}`);
      b.addEventListener('click', ()=> {
        stopAutoplay();
        go(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(b);
    }
    // В бесконечном режиме стрелки не дизейблим
    if (!INFINITE) {
      prev.disabled = (page === 0);
      next.disabled = (page === pages-1);
    } else {
      prev.disabled = false;
      next.disabled = false;
    }
  }

  function scrollToPage(p, smooth = true){
    const pages = positions.length;
    if (!pages) return;
    const target = clamp(p, 0, pages-1);
    viewport.scrollTo({ left: positions[target], behavior: smooth ? 'smooth' : 'auto' });
    page = target;
    updateDots();
  }

  function go(i, opts = {}){
    const pages = positions.length;
    if (!pages) return;
    const smooth = opts.smooth !== false; // по умолчанию плавно
    if (INFINITE) {
      // Заворачиваем индекс по кругу
      const normalized = mod(i, pages);
      // Если был переход с последней страницы на первую (или наоборот)
      // — делаем мгновенный прыжок (без анимации), чтобы сохранить бесконечность.
      const wrappingForward = (page === pages - 1) && (normalized === 0);
      const wrappingBackward = (page === 0) && (normalized === pages - 1);

      if (wrappingForward || wrappingBackward) {
        scrollToPage(normalized, false); // резко
      } else {
        scrollToPage(normalized, smooth);
      }
    } else {
      scrollToPage(clamp(i, 0, pages-1), smooth);
    }
  }

  // ---- autoplay ----
  function startAutoplay(){
    if (autoplayTimer || AUTOPLAY_MS <= 0) return;
    autoplayTimer = setInterval(()=> go(page + 1), AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if (!autoplayTimer) return;
    clearInterval(autoplayTimer);
    autoplayTimer = 0;
  }
  function restartAutoplay(){
    stopAutoplay();
    startAutoplay();
  }

  // ---- events ----
  prev.addEventListener('click', ()=>{
    if (PAUSE_ON_INTERACT) stopAutoplay();
    go(page - 1);
    if (PAUSE_ON_INTERACT) restartAutoplay();
  });
  next.addEventListener('click', ()=>{
    if (PAUSE_ON_INTERACT) stopAutoplay();
    go(page + 1);
    if (PAUSE_ON_INTERACT) restartAutoplay();
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (PAUSE_ON_INTERACT) stopAutoplay();
      if (e.key === 'ArrowRight') go(page + 1);
      if (e.key === 'ArrowLeft') go(page - 1);
      if (PAUSE_ON_INTERACT) restartAutoplay();
    }
  });

  // Пауза при наведении/фокусе/таче
  if (PAUSE_ON_HOVER) {
    const pauseEvents = ['mouseenter', 'focusin', 'touchstart', 'pointerdown'];
    const resumeEvents = ['mouseleave', 'focusout', 'touchend', 'pointerup'];
    pauseEvents.forEach(evt => carousel.addEventListener(evt, stopAutoplay, {passive:true}));
    resumeEvents.forEach(evt => carousel.addEventListener(evt, startAutoplay, {passive:true}));
  }

  // Пауза при скрытии вкладки
  document.addEventListener('visibilitychange', ()=>{
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  // Keep dots in sync while user scrolls/swipes
  viewport.addEventListener('scroll', ()=>{
    if(raf) return;
    raf = requestAnimationFrame(()=>{
      raf = 0;
      if (!positions.length) return;
      const nearest = positions.reduce((acc, x, idx)=>{
        const d = Math.abs(viewport.scrollLeft - x);
        return d < acc.d ? {d, idx} : acc;
      }, {d: 1e9, idx: page}).idx;
      if(nearest !== page){ page = nearest; updateDots(); }
    });
  }, {passive:true});

  // На ресайз пересчёт позиций и возврат к текущей странице
  window.addEventListener('resize', ()=>{
    const current = page; // запомним текущую «страницу»
    computePositions();
    const pages = positions.length;
    page = clamp(current, 0, Math.max(0, pages - 1));
    // мгновенно вернуть вид к актуальной позиции после пересчёта
    scrollToPage(page, false);
    updateDots();
  });

  // Init (ждём кадр, чтобы оффсеты были финальными)
  requestAnimationFrame(()=>{
    computePositions();
    updateDots();
    startAutoplay();
  });
})();
