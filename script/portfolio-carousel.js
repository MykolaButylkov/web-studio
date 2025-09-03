// js/portfolio-carousel.js
// Minimal Web – Portfolio Carousel controller
(function(){
  const carousel = document.getElementById('portfolioCarousel');
  if(!carousel) return;

  const viewport = carousel.querySelector('.carousel__viewport');
  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(track.children);
  const prev = carousel.querySelector('.carousel__arrow.prev');
  const next = carousel.querySelector('.carousel__arrow.next');
  const dotsWrap = carousel.querySelector('.carousel__dots');

  const perView = () => window.innerWidth >= 1100 ? 3 : (window.innerWidth >= 780 ? 2 : 1);
  let page = 0, positions = [];

  function computePositions(){
    const pv = perView();
    positions = [];
    for(let i = 0; i < slides.length; i += pv){
      positions.push(slides[i].offsetLeft);
    }
  }

  function updateDots(){
    const pages = positions.length;
    dotsWrap.innerHTML = '';
    for(let i=0;i<pages;i++){
      const b = document.createElement('button');
      b.className = 'dot' + (i===page ? ' is-active' : '');
      b.type = 'button';
      b.setAttribute('aria-label', `Показать группу слайдов ${i+1}`);
      b.addEventListener('click', ()=> go(i));
      dotsWrap.appendChild(b);
    }
    prev.disabled = (page === 0);
    next.disabled = (page === pages-1);
  }

  function go(i){
    page = Math.max(0, Math.min(i, positions.length - 1));
    viewport.scrollTo({left: positions[page], behavior: 'smooth'});
    updateDots();
  }

  prev.addEventListener('click', ()=> go(page - 1));
  next.addEventListener('click', ()=> go(page + 1));
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') go(page + 1);
    if(e.key === 'ArrowLeft') go(page - 1);
  });

  // Keep dots in sync while user scrolls/swipes
  let raf = 0;
  viewport.addEventListener('scroll', ()=>{
    if(raf) return;
    raf = requestAnimationFrame(()=>{
      raf = 0;
      const nearest = positions.reduce((acc, x, idx)=>{
        const d = Math.abs(viewport.scrollLeft - x);
        return d < acc.d ? {d, idx} : acc;
      }, {d: 1e9, idx: page}).idx;
      if(nearest !== page){ page = nearest; updateDots(); }
    });
  }, {passive:true});

  window.addEventListener('resize', ()=>{ computePositions(); updateDots(); });

  // Init
  // Wait a frame to ensure layout/offsetLeft are final (fonts etc.)
  requestAnimationFrame(()=>{
    computePositions();
    updateDots();
  });
})();