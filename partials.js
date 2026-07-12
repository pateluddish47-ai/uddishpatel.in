// Shared header/nav + footer, injected on every page so markup isn't duplicated
// across seven separate HTML files. Active nav link is driven by data-page on <body>.

const NAV_ITEMS = [
  { page: "home", label: "Home", href: "index.html" },
  { page: "about", label: "About", href: "about.html" },
  { page: "experience", label: "Experience", href: "experience.html" },
  { page: "projects", label: "Projects", href: "projects.html" },
  { page: "skills", label: "Skills", href: "skills.html" },
  { page: "certifications", label: "Certifications", href: "certifications.html" },
  { page: "contact", label: "Contact", href: "contact.html" },
];

function renderNav() {
  const current = document.body.dataset.page;
  const root = document.getElementById("nav-root");
  if (!root) return;

  const links = NAV_ITEMS.map(item => {
    const active = item.page === current ? " active" : "";
    return `<a href="${item.href}" class="nav-link${active}">${item.label}</a>`;
  }).join("");

  root.innerHTML = `
    <header class="navbar">
      <div class="nav-inner">
        <a href="index.html" class="logo">Uddish</a>
        <nav class="nav-links">${links}</nav>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `;

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }
}

function renderFooter() {
  const root = document.getElementById("footer-root");
  if (!root) return;
  root.innerHTML = `
    <footer class="footer">
      <div class="logo">Uddish</div>
      <div>© 2026 Uddish Patel — Full-Stack Dev &amp; Cybersecurity Learner</div>
      <div class="footer-links">
        <a href="https://linkedin.com/in/uddish-patel-1b9895393" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:pateluddish47@gmail.com">Email</a>
      </div>
    </footer>
  `;
}

renderNav();
renderFooter();
