// Themed animated backdrops — one distinct motif per page, all sharing the same
// green/dark cyberpunk palette so the site reads as one system. Pure canvas,
// no external assets, pauses when the tab is hidden.

(function () {
  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let w, h;
  const GREEN = "75, 159, 227";
  const page = document.body.dataset.page || "home";

  // ---- shared helpers -----------------------------------------------------

  function spawnParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.7,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * Math.PI * 2,
    };
  }

  function stepParticle(p) {
    p.x += p.vx;
    p.y += p.vy;
    p.pulse += 0.012;
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    if (p.y > h + 10) p.y = -10;
  }

  function drawParticle(p, glow) {
    const flicker = Math.max(p.alpha + Math.sin(p.pulse) * 0.15, 0);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${GREEN}, ${flicker})`;
    if (glow) {
      ctx.shadowColor = `rgba(${GREEN}, 0.8)`;
      ctx.shadowBlur = 6;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function linkParticles(list, maxDist, alphaMul) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${GREEN}, ${alphaMul * (1 - dist / maxDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function fadeTrail(alpha) {
    ctx.fillStyle = `rgba(6, 8, 7, ${alpha})`;
    ctx.fillRect(0, 0, w, h);
  }

  // ---- per-page state -------------------------------------------------

  let state = {};

  function init() {
    switch (page) {
      case "home": {
        // Flagship: code rain + glowing particle network + drifting light bloom.
        const FONT_SIZE = 16;
        const glyphs = "01{}<>/=+;#SEC";
        const columns = Math.floor(w / FONT_SIZE);
        const drops = Array.from({ length: columns }, () => ({
          y: Math.random() * -h,
          speed: 0.6 + Math.random() * 1.4,
          trail: 6 + Math.floor(Math.random() * 10),
        }));
        const particles = Array.from({ length: Math.max(30, Math.floor((w * h) / 18000)) }, spawnParticle);
        const bloom = { x: w * 0.5, y: h * 0.3, r: Math.max(w, h) * 0.35, vx: 0.15, vy: 0.08 };
        state = { FONT_SIZE, glyphs, drops, particles, bloom };
        break;
      }
      case "about": {
        // Calm drifting constellation — About is text-heavy, keep it legible.
        const particles = Array.from({ length: Math.max(24, Math.floor((w * h) / 26000)) }, spawnParticle);
        state = { particles };
        break;
      }
      case "experience": {
        // Vertical radar-style scan sweep over a faint grid — fits the timeline.
        const particles = Array.from({ length: Math.max(16, Math.floor((w * h) / 34000)) }, spawnParticle);
        state = { particles, scanY: 0, scanDir: 1 };
        break;
      }
      case "projects": {
        // Circuit board: fixed node grid with right-angle traces and traveling pulses.
        const cols = Math.max(5, Math.floor(w / 160));
        const rows = Math.max(4, Math.floor(h / 140));
        const nodes = [];
        for (let i = 0; i <= cols; i++) {
          for (let j = 0; j <= rows; j++) {
            nodes.push({
              x: (i / cols) * w + (Math.random() - 0.5) * 40,
              y: (j / rows) * h + (Math.random() - 0.5) * 40,
            });
          }
        }
        // Build short edges between nearby nodes (circuit traces)
        const edges = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 190) edges.push({ a: nodes[i], b: nodes[j], dist });
          }
        }
        const pulses = Array.from({ length: Math.min(14, edges.length) }, () => ({
          edge: edges[Math.floor(Math.random() * edges.length)],
          t: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
        }));
        state = { nodes, edges, pulses };
        break;
      }
      case "skills": {
        // Fast code rain — skills = raw building blocks, moving at speed.
        const FONT_SIZE = 15;
        const glyphs = "01{}<>/=+-;#";
        const columns = Math.floor(w / FONT_SIZE);
        const drops = Array.from({ length: columns }, () => ({
          y: Math.random() * -h,
          speed: 2.2 + Math.random() * 2.6,
          trail: 5 + Math.floor(Math.random() * 7),
        }));
        state = { FONT_SIZE, glyphs, drops };
        break;
      }
      case "certifications": {
        // Calm glow + a handful of slow particles — content-heavy page, cards need contrast.
        const particles = Array.from({ length: Math.max(14, Math.floor((w * h) / 40000)) }, spawnParticle);
        const bloom = { x: w * 0.5, y: h * 0.4, r: Math.max(w, h) * 0.4, vx: 0.06, vy: 0.04 };
        state = { particles, bloom };
        break;
      }
      case "contact": {
        // Radar pings expanding from center — "reaching out" motif.
        state = { rings: [], frame: 0 };
        break;
      }
      default: {
        const particles = Array.from({ length: 30 }, spawnParticle);
        state = { particles };
      }
    }
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    init();
  }

  // ---- per-page frame renderers -----------------------------------------

  function frameHome() {
    fadeTrail(0.16);
    const { bloom, drops, particles, FONT_SIZE, glyphs } = state;

    bloom.x += bloom.vx; bloom.y += bloom.vy;
    if (bloom.x < 0 || bloom.x > w) bloom.vx *= -1;
    if (bloom.y < 0 || bloom.y > h) bloom.vy *= -1;
    const grad = ctx.createRadialGradient(bloom.x, bloom.y, 0, bloom.x, bloom.y, bloom.r);
    grad.addColorStop(0, `rgba(${GREEN}, 0.07)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

    ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "top";
    for (let d = 0; d < drops.length; d++) {
      const drop = drops[d];
      const x = d * FONT_SIZE;
      for (let i = 0; i < drop.trail; i++) {
        const cy = drop.y - i * FONT_SIZE;
        if (cy < -FONT_SIZE || cy > h) continue;
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        const fade = 1 - i / drop.trail;
        const alpha = i === 0 ? 0.9 : fade * 0.35;
        ctx.fillStyle = i === 0 ? `rgba(200, 255, 225, ${alpha})` : `rgba(${GREEN}, ${alpha})`;
        ctx.fillText(char, x, cy);
      }
      drop.y += drop.speed * FONT_SIZE * 0.06;
      if (drop.y - drop.trail * FONT_SIZE > h) {
        drop.y = Math.random() * -h * 0.5;
        drop.speed = 0.6 + Math.random() * 1.4;
      }
    }

    particles.forEach(p => { stepParticle(p); drawParticle(p, true); });
    linkParticles(particles, 150, 0.18);
  }

  function frameAbout() {
    fadeTrail(0.1);
    const { particles } = state;
    particles.forEach(p => { stepParticle(p); drawParticle(p, false); });
    linkParticles(particles, 170, 0.12);
  }

  function frameExperience() {
    fadeTrail(0.14);

    // faint static grid
    ctx.strokeStyle = `rgba(${GREEN}, 0.05)`;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    state.scanY += state.scanDir * 1.6;
    if (state.scanY > h || state.scanY < 0) state.scanDir *= -1;

    const grad = ctx.createLinearGradient(0, state.scanY - 60, 0, state.scanY + 60);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, `rgba(${GREEN}, 0.1)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, state.scanY - 60, w, 120);

    ctx.strokeStyle = `rgba(${GREEN}, 0.35)`;
    ctx.beginPath(); ctx.moveTo(0, state.scanY); ctx.lineTo(w, state.scanY); ctx.stroke();

    state.particles.forEach(p => { stepParticle(p); drawParticle(p, false); });
  }

  function frameProjects() {
    fadeTrail(0.22);
    const { edges, pulses } = state;

    ctx.strokeStyle = `rgba(${GREEN}, 0.08)`;
    ctx.lineWidth = 1;
    edges.forEach(e => {
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    });
    edges.forEach(e => {
      ctx.beginPath(); ctx.arc(e.a.x, e.a.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN}, 0.25)`; ctx.fill();
    });

    pulses.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) { p.t = 0; p.edge = edges[Math.floor(Math.random() * edges.length)]; }
      const x = p.edge.a.x + (p.edge.b.x - p.edge.a.x) * p.t;
      const y = p.edge.a.y + (p.edge.b.y - p.edge.a.y) * p.t;
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GREEN}, 0.9)`;
      ctx.shadowColor = `rgba(${GREEN}, 0.9)`; ctx.shadowBlur = 8;
      ctx.fill(); ctx.shadowBlur = 0;
    });
  }

  function frameSkills() {
    fadeTrail(0.2);
    ctx.font = `${state.FONT_SIZE}px "JetBrains Mono", monospace`;
    ctx.textBaseline = "top";
    state.drops.forEach((drop, d) => {
      const x = d * state.FONT_SIZE;
      for (let i = 0; i < drop.trail; i++) {
        const cy = drop.y - i * state.FONT_SIZE;
        if (cy < -state.FONT_SIZE || cy > h) continue;
        const char = state.glyphs[Math.floor(Math.random() * state.glyphs.length)];
        const fade = 1 - i / drop.trail;
        const alpha = i === 0 ? 0.75 : fade * 0.3;
        ctx.fillStyle = i === 0 ? `rgba(200, 255, 225, ${alpha})` : `rgba(${GREEN}, ${alpha})`;
        ctx.fillText(char, x, cy);
      }
      drop.y += drop.speed * state.FONT_SIZE * 0.22;
      if (drop.y - drop.trail * state.FONT_SIZE > h) {
        drop.y = Math.random() * -h * 0.5;
        drop.speed = 2.2 + Math.random() * 2.6;
      }
    });
  }

  function frameCertifications() {
    fadeTrail(0.09);
    const { bloom, particles } = state;
    bloom.x += bloom.vx; bloom.y += bloom.vy;
    if (bloom.x < 0 || bloom.x > w) bloom.vx *= -1;
    if (bloom.y < 0 || bloom.y > h) bloom.vy *= -1;
    const grad = ctx.createRadialGradient(bloom.x, bloom.y, 0, bloom.x, bloom.y, bloom.r);
    grad.addColorStop(0, `rgba(${GREEN}, 0.05)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

    particles.forEach(p => { stepParticle(p); drawParticle(p, false); });
  }

  function frameContact() {
    fadeTrail(0.1);
    state.frame++;
    if (state.frame % 70 === 0) {
      state.rings.push({ x: w / 2, y: h / 2, r: 0, alpha: 0.35 });
    }
    state.rings.forEach(r => {
      r.r += 2.2;
      r.alpha *= 0.99;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${GREEN}, ${Math.max(r.alpha - r.r / (Math.max(w, h)), 0)})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });
    state.rings = state.rings.filter(r => r.r < Math.max(w, h) * 0.8);

    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${GREEN}, 0.8)`;
    ctx.shadowColor = `rgba(${GREEN}, 0.9)`; ctx.shadowBlur = 10;
    ctx.fill(); ctx.shadowBlur = 0;
  }

  const RENDERERS = {
    home: frameHome,
    about: frameAbout,
    experience: frameExperience,
    projects: frameProjects,
    skills: frameSkills,
    certifications: frameCertifications,
    contact: frameContact,
  };

  function frame() {
    (RENDERERS[page] || frameAbout)();
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
