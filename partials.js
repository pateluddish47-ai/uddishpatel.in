// Shared header/nav + footer, injected on every page so markup isn't duplicated
// across seven separate HTML files. Active nav link is driven by data-page on <body>.

const NAV_ITEMS = [
  { page: "home", label: "Home", href: "index.html" },
  { page: "about", label: "About", href: "about.html" },
  { page: "experience", label: "Experience", href: "experience.html" },
  { page: "projects", label: "Projects", href: "projects.html" },
  { page: "skills", label: "Skills", href: "skills.html" },
  { page: "certifications", label: "Certifications", href: "certifications.html" },
  { page: "resume", label: "Resume", href: "resume.html" },
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
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
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

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }
}

function renderFooter() {
  const root = document.getElementById("footer-root");
  if (!root) return;
  const year = new Date().getFullYear();
  root.innerHTML = `
    <footer class="footer">
      <div class="logo">Uddish</div>
      <div>© ${year} Uddish Patel — All rights reserved.</div>
      <div class="footer-links">
        <a href="https://linkedin.com/in/uddish-patel-1b9895393" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/pateluddish47-ai" target="_blank" rel="noopener">GitHub</a>
        <a href="mailto:pateluddish47@gmail.com">Email</a>
      </div>
    </footer>
  `;
}

renderNav();
renderFooter();
