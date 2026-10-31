/* ── Custom cursor ── */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Só com rato/trackpad (o CSS esconde o cursor e repõe o nativo nos restantes casos)
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    if (reduceMotion) { ring.style.left = mx + 'px'; ring.style.top = my + 'px'; }
  });
  // Sem prefers-reduced-motion o anel segue com atraso suave; com ele, segue sem animação
  if (!reduceMotion) {
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
  }
  document.querySelectorAll('a, button, .model-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '50px'; ring.style.height = '50px';
      ring.style.borderColor = 'rgba(255,128,0,.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '32px'; ring.style.height = '32px';
      ring.style.borderColor = 'rgba(255,128,0,.5)';
    });
  });
}

/* ── Expandable model cards ── */
const cards = document.querySelectorAll('.model-card');
function activateCard(card) {
  cards.forEach(c => c.classList.remove('active'));
  card.classList.add('active');
}
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    if (window.matchMedia('(hover:hover)').matches) activateCard(card);
  });
  card.addEventListener('click', () => activateCard(card));
});
if (cards.length) activateCard(cards[0]);

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navDrawer = document.getElementById('navDrawer');
hamburger.addEventListener('click', () => {
  const open = navDrawer.classList.toggle('open');
  hamburger.classList.toggle('active');
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeNav() {
  navDrawer.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── Scroll reveal ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => {
  if (reduceMotion) el.classList.add('visible'); else observer.observe(el);
});
