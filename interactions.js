// Shared micro-interactions used across every page: scroll-reveal fade-ins
// and animated stat counters. Kept intentionally minimal — no ripple or
// magnetic-hover effects, per a simpler "less motion" direction.
// All guarded so pages without a given element simply skip that feature.

document.addEventListener("DOMContentLoaded", () => {
  // ---- scroll reveal --------------------------------------------------
  const revealTargets = document.querySelectorAll(
    ".card, .section-title, .hero-inner, .profile-card, .resume-card, .resume-preview"
  );
  revealTargets.forEach(el => el.classList.add("reveal"));

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
