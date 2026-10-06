// Nav scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Filter
const filterBtns = [...document.querySelectorAll(".filter-btn")];
const cards = [...document.querySelectorAll(".project-card")];
const countEl = document.getElementById("visibleCount");
const countLabel = document.getElementById("countLabel");
const emptyState = document.getElementById("emptyState");
const grid = document.getElementById("projectsGrid");

const matches = (card, filter) =>
  filter === "all" || (card.dataset.category || "").split(" ").includes(filter);

// Per-filter counts shown inside each button
filterBtns.forEach((btn) => {
  const n = cards.filter((c) => matches(c, btn.dataset.filter)).length;
  btn.querySelector("span").textContent = n;
});

function applyFilter(filter) {
  let count = 0;
  cards.forEach((card) => {
    const match = matches(card, filter);
    card.classList.toggle("is-hidden", !match);
    card.classList.remove("is-entering");
    if (match) {
      count++;
      card.classList.add("visible");
      void card.offsetWidth; // restart entry animation
      card.classList.add("is-entering");
    }
  });
  countEl.textContent = count;
  countLabel.textContent = count === 1 ? "projeto" : "projetos";
  grid.classList.toggle("is-filtered", filter !== "all");
  emptyState.hidden = count !== 0;
  grid.hidden = count === 0;
}

function setActive(filter) {
  filterBtns.forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  applyFilter(filter);
}

filterBtns.forEach((btn) => btn.addEventListener("click", () => setActive(btn.dataset.filter)));
document.getElementById("resetFilter").addEventListener("click", () => setActive("all"));

countEl.textContent = cards.length;
