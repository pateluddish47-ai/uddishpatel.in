// Per-page scripts: hero typewriter (home only) + certificate lightbox (certifications only).
// Nav/footer injection lives in partials.js, ambient background in background.js.

const phrases = [
  "Computer Science Engineering Student",
  "Cybersecurity Enthusiast",
  "Python Developer",
  "Web Developer"
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

// Contact form — client-side validation, then hands off to the visitor's
// email app via mailto: (no backend on this static site). Swap this for a
// fetch() to a form-handling service (e.g. Formspree) if async sending
// without leaving the page is needed later.
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const fields = {
    name: { el: document.getElementById("name"), error: document.getElementById("nameError") },
    email: { el: document.getElementById("email"), error: document.getElementById("emailError") },
    subject: { el: document.getElementById("subject"), error: document.getElementById("subjectError") },
    message: { el: document.getElementById("message"), error: document.getElementById("messageError") },
  };
  const status = document.getElementById("formStatus");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, msg) {
    fields[field].error.textContent = msg;
  }

  function validate() {
    let valid = true;
    Object.keys(fields).forEach(key => setError(key, ""));

    if (!fields.name.el.value.trim()) { setError("name", "Please enter your name."); valid = false; }
    if (!EMAIL_RE.test(fields.email.el.value.trim())) { setError("email", "Enter a valid email address."); valid = false; }
    if (!fields.subject.el.value.trim()) { setError("subject", "Please add a subject."); valid = false; }
    if (fields.message.el.value.trim().length < 10) { setError("message", "Message should be at least 10 characters."); valid = false; }

    return valid;
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) {
      status.classList.remove("show");
      return;
    }

    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const subject = fields.subject.el.value.trim();
    const message = fields.message.el.value.trim();

    const body = `${message}\n\n— ${name} (${email})`;
    const mailto = `mailto:pateluddish47@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.classList.add("show");
    window.location.href = mailto;

    setTimeout(() => {
      contactForm.reset();
      status.classList.remove("show");
    }, 4000);
  });
}
