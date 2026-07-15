// Shared micro-interactions used across every page: scroll-reveal entrance
// animations (a distinct 3D-ish style per section — flip, tilt, spin, skew,
// pop, swing) and animated stat counters.
// All guarded so pages without a given element simply skip that feature.

document.addEventListener("DOMContentLoaded", () => {
  // ---- scroll reveal --------------------------------------------------
  const fadeUpTargets = document.querySelectorAll(
    ".section-title, .hero-inner, .resume-preview"
  );
  fadeUpTargets.forEach(el => el.classList.add("reveal"));

  // One signature entrance animation per page/section.
  const PAGE_CARD_ANIMATIONS = {
    about: "flip-in-y",
    projects: "flip-in-x",
    skills: "spin-in",
    experience: "skew-in",
    certifications: "pop-in",
    contact: "swing-in",
    resume: "fade-rotate-in",
  };
  const page = document.body.dataset.page;
  const cardAnimation = PAGE_CARD_ANIMATIONS[page] || "reveal";

  document.querySelectorAll(".card").forEach((el, i) => {
    el.classList.add(cardAnimation);
    const delay = Math.min(i % 6, 5);
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });

  const revealTargets = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .flip-in-y, .flip-in-x, .spin-in, .skew-in, .pop-in, .swing-in, .fade-rotate-in"
  );
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
