// Simple, calm background: a soft field of drifting particles with faint
// connecting lines. Same motif on every page — only density/speed/link
// distance vary slightly per page so it still feels tailored, not identical.
// Pauses when the tab is hidden. Respects prefers-reduced-motion.

(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let w, h, particles;
  const GREEN = "75, 159, 227";
  const page = document.body.dataset.page || "home";

  // Per page: particle spacing (lower = denser), link distance, drift speed.
  const PARAMS = {
    home:            { density: 15000, linkDist: 150, speed: 0.22 },
    about:           { density: 24000, linkDist: 160, speed: 0.15 },
    experience:      { density: 28000, linkDist: 130, speed: 0.13 },
    projects:        { density: 22000, linkDist: 150, speed: 0.17 },
    skills:          { density: 26000, linkDist: 140, speed: 0.15 },
    certifications:  { density: 32000, linkDist: 120, speed: 0.12 },
    resume:          { density: 30000, linkDist: 130, speed: 0.13 },
    contact:         { density: 20000, linkDist: 160, speed: 0.19 },
  };
  const cfg = PARAMS[page] || PARAMS.about;

  function spawn() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * cfg.speed,
      vy: (Math.random() - 0.5) * cfg.speed,
      alpha: Math.random() * 0.35 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.max(20, Math.floor((w * h) / cfg.density));
    particles = Array.from({ length: count }, spawn);
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.008;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const flicker = Math.max(p.alpha + Math.sin(p.pulse) * 0.1, 0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN}, ${flicker})`;
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.linkDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${GREEN}, ${0.1 * (1 - dist / cfg.linkDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  let raf = null;
  function loop() {
    frame();
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });

  window.addEventListener("resize", resize);
  resize();
  loop();
})();
