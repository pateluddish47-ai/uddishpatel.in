// Per-page scripts: hero typewriter (home only) + certificate lightbox (certifications only).
// Nav/footer injection lives in partials.js, ambient background in background.js.

const phrases = [
  "OWASP Top 10 Practitioner",
  "Full-Stack Developer",
  "Cybersecurity Learner",
  "Python & Flask Enthusiast"
];

const typewriterEl = document.getElementById("typewriter");

if (typewriterEl) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const TYPE_SPEED = 65;
  const DELETE_SPEED = 35;
  const HOLD_AFTER_TYPE = 1800;
  const HOLD_AFTER_DELETE = 400;

  function tick() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      typewriterEl.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, HOLD_AFTER_TYPE);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      typewriterEl.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, HOLD_AFTER_DELETE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  tick();
}

// Certificate lightbox — click any .cert-card to view the full image.
const certCards = document.querySelectorAll(".cert-card");

if (certCards.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-box">
      <img class="lightbox-img" src="" alt="">
      <div class="lightbox-foot">
        <div>
          <h3 class="lightbox-title"></h3>
          <div class="card-sub lightbox-issuer"></div>
          <div class="cert-id lightbox-id"></div>
        </div>
        <div class="lightbox-actions">
          <button class="lightbox-close" data-close>Close</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector(".lightbox-img");
  const title = lightbox.querySelector(".lightbox-title");
  const issuer = lightbox.querySelector(".lightbox-issuer");
  const id = lightbox.querySelector(".lightbox-id");

  function openLightbox(card) {
    const src = card.dataset.certImg;
    img.src = src;
    img.alt = card.dataset.certTitle || "";
    title.textContent = card.dataset.certTitle || "";
    issuer.textContent = card.dataset.certIssuer || "";
    id.textContent = card.dataset.certId ? `ID: ${card.dataset.certId}` : "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  certCards.forEach(card => {
    card.addEventListener("click", () => openLightbox(card));
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.hasAttribute("data-close")) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}
