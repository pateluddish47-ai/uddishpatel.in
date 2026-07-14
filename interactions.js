// Shared premium micro-interactions used across every page:
// page fade-in, scroll-reveal, animated counters, skill-bar fill,
// button ripple, and magnetic button hover. All guarded so pages
// without a given element simply skip that feature.

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

  // ---- skill bar fill (width from data-percent) -----------------------
  const skillBars = document.querySelectorAll(".skill-bar-fill");
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pct = entry.target.dataset.percent || "0";
          entry.target.style.width = pct + "%";
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach(el => skillObserver.observe(el));

  // ---- button ripple ----------------------------------------------------
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ---- magnetic hover on primary/secondary buttons ---------------------
  const MAGNET_STRENGTH = 0.25;
  document.querySelectorAll(".btn-primary, .btn-secondary, .social-icon").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * MAGNET_STRENGTH}px, ${y * MAGNET_STRENGTH}px) translateY(-2px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});
