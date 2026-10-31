/* ── Mobile nav hamburger ── */
const navHamburger = document.getElementById('navHamburger');
const mobileNav = document.getElementById('mobileNav');

if (navHamburger && mobileNav) {
  navHamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    navHamburger.classList.toggle('active', isOpen);
    navHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

function closeMobileNav() {
  if (mobileNav) {
    mobileNav.classList.remove('open');
    navHamburger.classList.remove('active');
    navHamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ── Scroll reveal ── */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── Lightbox data ── */
const postsData = [
  {
    title: 'O Recinto Ideal',
    subtitle: 'Post 02 — Conteúdo Técnico · Abril 2026',
    images: ['assets/img/post2.1.webp','assets/img/post2.2.webp','assets/img/post2.3.webp']
  }
];

let currentPost = 0;
let currentImg  = 1;

function openLightbox(postIdx) {
  currentPost = postIdx;
  currentImg  = 1;
  renderLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const post = postsData[currentPost];
  document.getElementById('lightbox-title').textContent    = post.title;
  document.getElementById('lightbox-subtitle').textContent = post.subtitle;

  const carousel = document.getElementById('lightbox-carousel');
  carousel.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'lightbox-nav';
  prevBtn.setAttribute('aria-label', 'Imagem anterior');
  prevBtn.innerHTML = '&#8592;';
  prevBtn.onclick = lightboxPrev;
  carousel.appendChild(prevBtn);

  const imgs = post.images;
  const n = imgs.length;
  const positions = [
    { idx: (currentImg - 1 + n) % n, role: 'side' },
    { idx: currentImg,                role: 'center' },
    { idx: (currentImg + 1) % n,      role: 'side' }
  ];

  positions.forEach(({ idx, role }) => {
    const item = document.createElement('div');
    item.className = 'lightbox-carousel-item ' + role;
    const img = document.createElement('img');
    img.src = imgs[idx];
    img.alt = post.title + ' — imagem ' + (idx + 1);
    if (role === 'side') {
      item.onclick = () => { currentImg = idx; renderLightbox(); };
    }
    item.appendChild(img);
    carousel.appendChild(item);
  });

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'lightbox-nav';
  nextBtn.setAttribute('aria-label', 'Próxima imagem');
  nextBtn.innerHTML = '&#8594;';
  nextBtn.onclick = lightboxNext;
  carousel.appendChild(nextBtn);

  const dotsEl = document.getElementById('lightbox-dots');
  dotsEl.innerHTML = '';
  imgs.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'lightbox-dot' + (i === currentImg ? ' active' : '');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', 'Ver imagem ' + (i + 1));
    dot.onclick = () => { currentImg = i; renderLightbox(); };
    dotsEl.appendChild(dot);
  });
}

function lightboxPrev() {
  const post = postsData[currentPost];
  currentImg = (currentImg - 1 + post.images.length) % post.images.length;
  renderLightbox();
}
function lightboxNext() {
  const post = postsData[currentPost];
  currentImg = (currentImg + 1) % post.images.length;
  renderLightbox();
}

document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
});
