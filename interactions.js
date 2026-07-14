// Shared micro-interactions used across every page: scroll-reveal fade/slide-ins
// (in the spirit of Olynto Technologies' site — alternating fadeLeft/fadeRight
// on cards, fadeUp on headings) and animated stat counters.
// All guarded so pages without a given element simply skip that feature.

document.addEventListener("DOMContentLoaded", () => {
  // ---- scroll reveal --------------------------------------------------
  // Headings/hero: fade up. Cards: alternate left/right per grid for rhythm.
  const fadeUpTargets = document.querySelectorAll(
    ".section-title, .hero-inner, .resume-preview"
  );
  fadeUpTargets.forEach(el => el.classList.add("reveal"));

  const cardGroups = document.querySelectorAll(
    ".skills-grid, .cert-grid, .edu-grid, .project-list, .timeline, .about-cards"
  );
  const seenCards = new Set();
  cardGroups.forEach(group => {
    group.querySelectorAll(".card").forEach((el, i) => {
      el.classList.add(i % 2 === 0 ? "reveal-left" : "reveal-right");
      seenCards.add(el);
    });
  });

  // Any remaining cards not inside a recognized grid (e.g. profile-card) fade up.
  document.querySelectorAll(".card").forEach(el => {
    if (!seenCards.has(el)) el.classList.add("reveal");
  });

  const revealTargets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealTargets.forEach(el => revealObserver.observe(el));

  // ---- animated counters (data-counter="5" on any element) -----------
  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.counterSuffix || "";
        const duration = 1200;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target < 10 && target % 1 !== 0
            ? (target * eased).toFixed(1)
            : Math.round(target * eased);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach(el => counterObserver.observe(el));
});
