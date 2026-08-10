/**
 * MAIN INVITATION APPLICATION ENGINE
 * 
 * Dynamically ingests WEDDING_CONFIG from js/config.js, handles DOM binding,
 * envelope unboxing, audio playback, lightbox gallery, bank account copy toast,
 * scroll reveals, and PWA registration.
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. DYNAMIC DATA BINDING FROM CONFIG
  bindWeddingConfig();

  // 2. ENVELOPE UNBOXING TRANSITION
  initEnvelopeUnboxing();

  // 3. AUDIO PLAYER SETUP
  initAudioPlayer();

  // 4. GALLERY & LIGHTBOX MODAL
  initGalleryAndLightbox();

  // 5. BANK COPY TOAST NOTIFICATION
  initBankCopy();

  // 6. SCROLL REVEAL OBSERVER
  initScrollReveal();

  // 7. SCROLL PROGRESS BAR
  initScrollProgress();

  // 8. MAGNETIC HOVER BUTTONS
  initMagnetic();

  // 9. CURSOR GLOW TRAIL
  initCursorGlow();

  // 10. WORD-BY-WORD SPLIT TEXT REVEAL
  initSplitText();

  // 11. GOLD SHIMMER SECTION TITLES
  initGoldShine();

  // 12. PWA SERVICE WORKER & INSTALL PROMPT
  initPWA();

  // 13. TOUCH PRESS FEEDBACK (mobile: no hover)
  initTouchFeedback();

  // 14. GIFT QR ZOOM MODAL
  initQRModal();

  // 15. ATTIRE GUIDE ZOOM MODAL
  initAttireZoom();

  // 16. SHARE INVITATION
  initShare();

  // 17. ADD TO CALENDAR CHOOSER
  initCalendarChooser();

  // 18. STICKY NAVIGATION
  initNav();
});

/* ==========================================
   1. BIND WEDDING CONFIG TO DOM
   ========================================== */
function bindWeddingConfig() {
  if (typeof WEDDING_CONFIG === 'undefined') return;

  const cfg = WEDDING_CONFIG;

  // Cover & Hero Couple Names & Dates
  const coupleText = `${cfg.couple.groom.shortName} & ${cfg.couple.bride.shortName}`;
  const fullCoupleText = `${cfg.couple.groom.name} & ${cfg.couple.bride.name}`;

  setText("cover-couple-names", coupleText);
  setText("cover-date", cfg.displayDate);
  setText("hero-couple-names", coupleText);
  setText("hero-date", cfg.displayDate);

  // Groom Details
  setText("groom-name", cfg.couple.groom.name);
  setText("groom-parents", cfg.couple.groom.parents);
  bindSocialLink("groom", cfg.couple.groom);
  if (cfg.couple.groom.image) setAttr("groom-img", "src", cfg.couple.groom.image);

  // Bride Details
  setText("bride-name", cfg.couple.bride.name);
  setText("bride-parents", cfg.couple.bride.parents);
  bindSocialLink("bride", cfg.couple.bride);
  if (cfg.couple.bride.image) setAttr("bride-img", "src", cfg.couple.bride.image);

  // Ceremony Event
  if (cfg.events && cfg.events.ceremony) {
    const c = cfg.events.ceremony;
    setText("ceremony-title", c.title);
    setHTML("ceremony-time", `<i class="fa-regular fa-clock mr-2"></i>${c.time}`);
    setText("ceremony-venue", c.venue);
    setText("ceremony-address", c.address);
    setAttr("ceremony-maps-btn", "href", c.googleMapsUrl);
    setAttr("ceremony-cal-btn", "href", c.googleCalendarUrl);
  }

  // Reception Event
  if (cfg.events && cfg.events.reception) {
    const r = cfg.events.reception;
    setText("reception-title", r.title);
    setHTML("reception-time", `<i class="fa-regular fa-clock mr-2"></i>${r.time}`);
    setText("reception-venue", r.venue);
    setText("reception-address", r.address);
    setAttr("reception-maps-btn", "href", r.googleMapsUrl);
    setAttr("reception-cal-btn", "href", r.googleCalendarUrl);
  }

  // RSVP Google Form Link
  if (cfg.rsvp) {
    setAttr("rsvp-google-form-btn", "href", cfg.rsvp.googleFormUrl);
    if (cfg.rsvp.message) setText("rsvp-message", cfg.rsvp.message);
  }

  // Gift Title & Description
  if (cfg.gift) {
    if (cfg.gift.title) setText("gift-title", cfg.gift.title);
    if (cfg.gift.description) setText("gift-description", cfg.gift.description);
    renderBankCards(cfg.gift.banks);
    if (cfg.gift.qrCodeImage) setAttr("gift-guide-img", "src", cfg.gift.qrCodeImage);
  }

  // Entourage / Wedding Party
  if (cfg.entourage) renderEntourage(cfg.entourage);

  // Footer
  setText("footer-couple-names", cfg.couple.thankYou || fullCoupleText);
}

// Helper utilities for DOM updating
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.innerText = value;
}
function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.innerHTML = value;
}
function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute(attr, value);
}

// Bind a groom/bride social link (facebook or instagram) from config social config
function bindSocialLink(role, person) {
  const social = person.social || {
    platform: "instagram",
    handle: person.instagram
  };
  const icon = document.getElementById(`${role}-ig-icon`);
  const handleEl = document.getElementById(`${role}-ig-handle`);
  const link = document.getElementById(`${role}-ig`);
  if (!link || !social || !social.handle) return;

  const base = social.platform === "facebook" ? "https://facebook.com/" : "https://instagram.com/";
  link.setAttribute("href", base + social.handle.replace("@", ""));
  if (handleEl) handleEl.innerText = social.handle;
  if (icon) {
    const brand = social.platform === "facebook" ? "fa-facebook" : "fa-instagram";
    icon.className = `fa-brands ${brand} text-base`;
  }
}

/* Render Bank Account Cards */
function renderBankCards(banks) {
  const container = document.getElementById("banks-container");
  if (!container || !banks) return;

  container.innerHTML = banks.map(b => `
    <div class="glass-card card-sheen p-6 text-center border border-orange-300/40 relative group hover:border-orange-400 transition">
      <div class="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto text-orange-700 text-xl mb-3">
        <i class="fa-solid fa-building-columns"></i>
      </div>
      <h4 class="font-serif text-lg font-bold text-gray-800">${b.bankName}</h4>
      <p class="font-sans text-xl font-semibold tracking-wider text-orange-700 my-2 select-all">${b.accountNumber}</p>
      <p class="font-sans text-xs text-gray-500 uppercase tracking-widest mb-4">a.n ${b.accountHolder}</p>
      <button class="copy-bank-btn px-4 py-2 rounded-full bg-gray-900 hover:bg-orange-600 text-white font-sans text-xs tracking-wider uppercase transition inline-flex items-center gap-2" data-account="${b.accountNumber}">
        <i class="fa-regular fa-copy"></i> Copy Account
      </button>
    </div>
  `).join('');
}

/* Render Wedding Entourage */
function renderEntourage(e) {
  const container = document.getElementById("entourage-container");
  if (!container || !e) return;

  // Split an "A & B" string into two elegant serif lines (no ampersand)
  const splitCouple = (str) => {
    const parts = String(str).split("&").map(s => s.trim());
    if (parts.length < 2) return `<span class="person">${str}</span>`;
    return parts.map(p => `<span class="person">${p}</span>`).join("");
  };

  const inlineCouple = (wife, husband) =>
    `<span class="entourage-couple-inline"><span class="person">${wife}</span><span class="person">${husband}</span></span>`;

  const blockTitle = (label) => `
    <div class="entourage-block-title">
      <span class="title-line"></span>
      <h3>${label}</h3>
      <span class="title-line"></span>
    </div>`;

  const roleCard = (icon, label, name) => `
    <div class="entourage-card">
      <div class="entourage-role-icon"><i class="fa-solid ${icon}"></i></div>
      <span class="entourage-eyebrow">${label}</span>
      <p class="font-serif text-lg sm:text-xl text-gray-800 mt-1">${name}</p>
    </div>`;

  const nameListCard = (title, names) => `
    <div class="entourage-card">
      <span class="entourage-eyebrow">${title}</span>
      ${names.map(n => `<p class="entourage-name">${n}</p>`).join("")}
    </div>`;

  container.innerHTML = `
    <div class="space-y-4">
      <!-- Parents -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="entourage-card entourage-card--featured">
          <span class="entourage-eyebrow">Groom's Parents</span>
          <div class="entourage-couple">${splitCouple(e.parents.groom)}</div>
        </div>
        <div class="entourage-card entourage-card--featured">
          <span class="entourage-eyebrow">Bride's Parents</span>
          <div class="entourage-couple">${splitCouple(e.parents.bride)}</div>
        </div>
      </div>

      <!-- Principal Sponsors -->
      <div class="reveal">
        ${blockTitle("Principal Sponsors")}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="entourage-card">
            ${e.principalSponsors.map(p => `<p class="entourage-name">${p.wife}</p>`).join("")}
          </div>
          <div class="entourage-card">
            ${e.principalSponsors.map(p => `<p class="entourage-name">${p.husband}</p>`).join("")}
          </div>
        </div>
      </div>

      <!-- Best Man & Maid of Honor -->
      <div class="reveal">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${roleCard("fa-crown", "Best Man", e.bestMan)}
          ${roleCard("fa-gem", "Maid of Honor", e.maidOfHonor)}
        </div>
      </div>

      <!-- Secondary Sponsors -->
      <div class="reveal">
        ${blockTitle("Secondary Sponsors")}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${Object.entries(e.secondarySponsors).map(([kind, s]) => `
            <div class="entourage-card">
              <span class="entourage-eyebrow">${kind.charAt(0).toUpperCase() + kind.slice(1)}</span>
              ${inlineCouple(s.wife, s.husband)}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Groomsmen & Bridesmaids -->
      <div class="reveal grid grid-cols-1 md:grid-cols-2 gap-6">
        ${nameListCard("Groomsmen", e.groomsmen)}
        ${nameListCard("Bridesmaids", e.bridesmaids)}
      </div>

      <!-- Flower Girls -->
      <div class="reveal">
        <div class="entourage-card max-w-md mx-auto">
          <span class="entourage-eyebrow">Flower Girls</span>
          ${e.flowerGirls.map(n => `<p class="entourage-name entourage-name--center">${n}</p>`).join("")}
        </div>
      </div>

      <!-- Bible Bearer & Ring Bearer -->
      <div class="reveal">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${roleCard("fa-book-bible", "Bible Bearer", e.bibleBearer)}
          ${roleCard("fa-ring", "Ring Bearer", e.ringBearer)}
        </div>
      </div>
    </div>
  `;
}

/* ==========================================
   2. ENVELOPE UNBOXING TRANSITION
   ========================================== */
function initEnvelopeUnboxing() {
  const openBtn = document.getElementById("open-invitation-btn");
  const coverScreen = document.getElementById("cover-screen");
  const bgAudio = document.getElementById("bg-audio");

  if (!openBtn || !coverScreen) return;

  // Check if returning from gallery - skip envelope
  if (localStorage.getItem('fromGallery') === 'true') {
    localStorage.removeItem('fromGallery');
    const savedY = parseInt(localStorage.getItem('galleryScrollY') || '0', 10);
    localStorage.removeItem('galleryScrollY');
    coverScreen.classList.add("opened");
    setTimeout(() => {
      const heroReveal = document.querySelector("#hero .reveal");
      if (heroReveal) heroReveal.classList.add("active");
      const siteNav = document.getElementById("site-nav");
      if (siteNav) siteNav.classList.add("visible");
      window.scrollTo(0, savedY);
    }, 100);
    return;
  }

  // Normal reload - scroll to top
  window.scrollTo(0, 0);

  let proceeding = false;

  const startAudio = () => {
    if (bgAudio && bgAudio.src) {
      bgAudio.play().then(() => {
        const musicBtn = document.getElementById("music-toggle-btn");
        if (musicBtn) musicBtn.classList.add("playing");
      }).catch(err => {
        console.log("Audio play deferred or blocked by browser:", err);
      });
    }
  };

  const proceed = () => {
    if (proceeding) return;
    proceeding = true;
    coverScreen.classList.add("opened");

    setTimeout(() => {
      const heroReveal = document.querySelector("#hero .reveal");
      if (heroReveal) heroReveal.classList.add("active");
      const siteNav = document.getElementById("site-nav");
      if (siteNav) siteNav.classList.add("visible");
    }, 400);
  };

  const open = () => {
    if (coverScreen.classList.contains("flap-open")) { proceed(); return; }

    coverScreen.classList.add("flap-open");
    startAudio();

    // Lift the cover to reveal the main site after the flap opens
    setTimeout(proceed, 1150);
  };

  openBtn.addEventListener("click", open);
}

/* ==========================================
   3. AUDIO PLAYER CONTROLS
   ========================================== */
function initAudioPlayer() {
  const bgAudio = document.getElementById("bg-audio");
  const musicBtn = document.getElementById("music-toggle-btn");

  if (!bgAudio || !musicBtn) return;

  if (typeof WEDDING_CONFIG !== 'undefined' && WEDDING_CONFIG.audio && WEDDING_CONFIG.audio.src) {
    bgAudio.src = WEDDING_CONFIG.audio.src;
  }

  musicBtn.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        musicBtn.classList.add("playing");
      }).catch(() => { });
    } else {
      bgAudio.pause();
      musicBtn.classList.remove("playing");
    }
  });
}

/* ==========================================
   4. GALLERY & LIGHTBOX MODAL
   ========================================== */
function initGalleryAndLightbox() {
  const container = document.getElementById("gallery-container");
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const modalCaption = document.getElementById("lightbox-caption");
  const modalClose = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!container || typeof WEDDING_CONFIG === 'undefined' || !WEDDING_CONFIG.gallery) return;

  // Render gallery photos into a horizontal snap rail
  const delays = ['delay-100', 'delay-200', 'delay-300', 'delay-400'];
  container.innerHTML = WEDDING_CONFIG.gallery.map((g, idx) => `
    <div class="gallery-item glass-card overflow-hidden shadow-lg reveal-zoom ${delays[idx % delays.length]}" data-url="${g.url}" data-caption="${g.caption}" data-index="${idx}">
      <img src="${g.url}" alt="${g.caption}" loading="lazy" decoding="async" class="w-full h-64 object-cover">
      <div class="gallery-overlay">
        <p class="font-serif text-sm text-orange-200 font-medium">${g.caption}</p>
      </div>
    </div>
  `).join('');

  const items = Array.from(container.querySelectorAll(".gallery-item"));
  let currentIndex = 0;

  // Enable drag-to-scroll on pointer (desktop)
  initGalleryRailDrag(container);

  // Bind click handlers to gallery items
  items.forEach(item => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "Open image in viewer");
    item.addEventListener("click", () => {
      if (container._dragMoved) {
        container._dragMoved = false;
        return;
      }
      currentIndex = parseInt(item.getAttribute("data-index"), 10) || 0;
      openLightbox(item);
    });
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  // Add "See More" / "Show Less" button on desktop when there are 7+ gallery items
  if (items.length > 6 && window.matchMedia && window.matchMedia("(min-width: 768px)").matches) {
    const seeMoreBtn = document.createElement("button");
    seeMoreBtn.className = "gallery-see-more";
    seeMoreBtn.innerHTML = '<i class="fa-solid fa-images"></i> See More';
    container.parentElement.insertBefore(seeMoreBtn, container.nextSibling);

    seeMoreBtn.addEventListener("click", () => {
      const expanded = container.classList.toggle("expanded");
      seeMoreBtn.innerHTML = expanded
        ? '<i class="fa-solid fa-chevron-up"></i> Show Less'
        : '<i class="fa-solid fa-images"></i> See More';
    });
  }

  // View All Photos button - navigate to gallery page
  const viewAllBtn = document.getElementById("view-all-btn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      localStorage.setItem('galleryScrollY', window.scrollY);
      localStorage.setItem('fromGallery', 'true');
      window.location.href = "gallery";
    });
  }

  let _imageTransitioning = false;

  function showImage(index) {
    if (!items.length || _imageTransitioning) return;
    const newIndex = (index + items.length) % items.length;

    const direction = newIndex > currentIndex || (currentIndex === items.length - 1 && newIndex === 0) ? 1 : -1;
    _imageTransitioning = true;

    // Fade out + slide current image
    modalImg.style.opacity = "0";
    modalImg.style.transform = `translateX(${-direction * 30}px)`;

    setTimeout(() => {
      currentIndex = newIndex;
      const item = items[currentIndex];
      modalImg.src = item.getAttribute("data-url");
      if (modalCaption) modalCaption.innerText = item.getAttribute("data-caption") || "";

      // Preload adjacent images
      const prevItem = items[(currentIndex - 1 + items.length) % items.length];
      const nextItem = items[(currentIndex + 1) % items.length];
      if (prevItem) { const p = new Image(); p.src = prevItem.getAttribute("data-url"); }
      if (nextItem) { const p = new Image(); p.src = nextItem.getAttribute("data-url"); }

      // Position off-screen opposite side, then slide in
      modalImg.style.transform = `translateX(${direction * 30}px)`;
      requestAnimationFrame(() => {
        modalImg.style.opacity = "1";
        modalImg.style.transform = "translateX(0)";
      });

      // Re-enable transitions after animation completes
      const onDone = () => { _imageTransitioning = false; };
      modalImg.addEventListener("transitionend", onDone, { once: true });
      setTimeout(onDone, 400);

      if (prevBtn) prevBtn.style.display = items.length > 1 ? "" : "none";
      if (nextBtn) nextBtn.style.display = items.length > 1 ? "" : "none";
    }, 300);
  }

  function openLightbox(item) {
    if (modal && modalImg) {
      showImage(currentIndex);
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      if (modalClose) modalClose.focus();
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (prevBtn) prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

  if (modalClose && modal) {
    modalClose.addEventListener("click", closeLightbox);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeLightbox();
    });
  }

  // Touch swipe to navigate
  let touchStartX = 0;
  if (modal) {
    modal.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    modal.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) showImage(currentIndex + 1);
        else showImage(currentIndex - 1);
      }
    }, { passive: true });
  }

  // Keyboard navigation + close
  document.addEventListener("keydown", (e) => {
    if (!modal || !modal.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  });
}

/* ==========================================
   5. BANK ACCOUNT COPY TOAST
   ========================================== */
function initBankCopy() {
  const toast = document.getElementById("toast-notification");

  document.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".copy-bank-btn");
    if (!copyBtn) return;

    const account = copyBtn.getAttribute("data-account");
    if (!account) return;

    navigator.clipboard.writeText(account).then(() => {
      showToast("Account details copied to clipboard!");
    }).catch(() => {
      showToast(`Copied: ${account}`);
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast-notification");
  const msgEl = document.getElementById("toast-message");
  if (!toast) return;

  if (msgEl) msgEl.innerHTML = `<i class="fa-solid fa-check-circle text-orange-400 mr-2"></i> ${msg}`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ==========================================
   6. SCROLL REVEAL OBSERVER & PARALLAX ENGINE
   ========================================== */
function initScrollReveal() {
  const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-zoom";
  const reveals = document.querySelectorAll(selectors);
  if (!reveals.length) return;

  let lastScrollY = window.scrollY || 0;

  function fullyOut(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return r.bottom < 0 || r.top > vh;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      const goingDown = window.scrollY >= lastScrollY;
      lastScrollY = window.scrollY;

      if (entry.isIntersecting && !fullyOut(el)) {
        el.classList.remove("active", "from-top", "from-bottom");
        void el.offsetWidth; // force reflow so the transition re-plays
        el.classList.add(goingDown ? "from-bottom" : "from-top", "active");
      } else if (fullyOut(el)) {
        el.classList.remove("active", "from-bottom");
        el.classList.add("from-top");
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(r => observer.observe(r));

  // Parallax Scroll Effect on Hero Background wrapper
  const heroBg = document.getElementById("hero-bg");
  if (heroBg) {
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
      }
    });
  }

  // Parallax Scroll Effect on Full-Bleed Photo Breaks
  const fullBleedImgs = document.querySelectorAll(".full-bleed img");
  if (fullBleedImgs.length) {
    window.addEventListener("scroll", () => {
      const viewportHeight = window.innerHeight;
      fullBleedImgs.forEach(img => {
        const rect = img.parentElement.getBoundingClientRect();
        if (rect.top < viewportHeight + 100 && rect.bottom > -100) {
          const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
          const yOffset = (progress - 0.5) * 60; // Subtle 0.2x speed effect
          img.style.transform = `translateY(${yOffset}px)`;
        }
      });
    }, { passive: true });
  }
}


/* ==========================================
   7. PWA SERVICE WORKER & INSTALL PROMPT
   ========================================== */
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  }

  let deferredPrompt;
  const pwaBtn = document.getElementById("pwa-install-btn");

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBtn) pwaBtn.classList.remove('hidden');
  });

  if (pwaBtn) {
    pwaBtn.addEventListener('click', () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA prompt');
        }
        deferredPrompt = null;
        pwaBtn.classList.add('hidden');
      });
    });
  }
}

/* ==========================================
   8. SCROLL PROGRESS BAR
   ========================================== */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  function update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    bar.style.width = p + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* ==========================================
   9. MAGNETIC HOVER BUTTONS
   ========================================== */
function initMagnetic() {
  const items = document.querySelectorAll("[data-magnetic]");
  if (!items.length || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) return;

  items.forEach(item => {
    const strength = (parseFloat(item.getAttribute("data-magnetic")) || 18) * 0.01;
    let targetX = 0, targetY = 0, curX = 0, curY = 0, raf = null;

    function animate() {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      item.style.transform = `translate3d(${(curX * strength).toFixed(2)}px, ${(curY * strength).toFixed(2)}px, 0)`;
      if (targetX === 0 && targetY === 0 && Math.abs(curX) < 0.1 && Math.abs(curY) < 0.1) {
        item.style.transform = "";
        raf = null;
        return;
      }
      raf = requestAnimationFrame(animate);
    }

    function track(e) {
      const r = item.getBoundingClientRect();
      targetX = e.clientX - (r.left + r.width / 2);
      targetY = e.clientY - (r.top + r.height / 2);
      if (!raf) raf = requestAnimationFrame(animate);
    }

    item.addEventListener("pointerenter", track);
    item.addEventListener("pointermove", track);
    item.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(animate);
    });
  });
}

/* ==========================================
   10. CURSOR GLOW TRAIL (pointer, rAF lerp)
   ========================================== */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function loop() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
    glow.style.opacity = "1";
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });
}

/* ==========================================
   11. WORD-BY-WORD SPLIT TEXT REVEAL
   ========================================== */
function initSplitText() {
  const els = document.querySelectorAll("[data-split]");
  if (!els.length) return;

  els.forEach(el => {
    const text = el.textContent.trim();
    if (!text) return;

    el.setAttribute("aria-label", text);
    el.textContent = "";
    el.classList.add("split-reveal");

    const words = text.split(/\s+/);
    words.forEach((w, i) => {
      const span = document.createElement("span");
      span.className = "split-word";
      span.style.setProperty("--i", i);
      span.textContent = w;
      span.setAttribute("aria-hidden", "true");
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode("\u00A0"));
    });
  });

  let lastScrollY = window.scrollY || 0;

  const observer = new IntersectionObserver((entries) => {
    const vh = () => window.innerHeight;

    entries.forEach(entry => {
      const el = entry.target;
      const goingDown = window.scrollY >= lastScrollY;
      lastScrollY = window.scrollY;
      const r = el.getBoundingClientRect();
      const out = r.bottom < 0 || r.top > vh();

      if (entry.isIntersecting && !out) {
        el.classList.remove("active", "from-top", "from-bottom");
        void el.offsetWidth;
        el.classList.add(goingDown ? "from-bottom" : "from-top", "active");
      } else if (out) {
        el.classList.remove("active");
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => observer.observe(el));
}

/* ==========================================
   12. GOLD SHIMMER SECTION TITLES
   ========================================== */
function initGoldShine() {
  const titles = document.querySelectorAll(".gold-shimmer");
  if (!titles.length) return;

  let lastScrollY = window.scrollY || 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      lastScrollY = window.scrollY;
      const r = el.getBoundingClientRect();
      const out = r.bottom < 0 || r.top > window.innerHeight;

      if (entry.isIntersecting && !out) {
        el.classList.remove("shine");
        void el.offsetWidth;
        el.classList.add("shine");
      }
    });
  }, { threshold: 0 });

  titles.forEach(t => observer.observe(t));
}

/* ==========================================
   13. TOUCH PRESS FEEDBACK (no-hover devices)
   ========================================== */
function initTouchFeedback() {
  if (window.matchMedia && window.matchMedia("(hover: hover)").matches) return;

  const sweepEls = ".btn-sheen, .card-sheen";

  function toggleSweep(e, adding) {
    const el = e.target && e.target.closest ? e.target.closest(sweepEls) : null;
    if (el) el.classList.toggle("tapped", adding);
  }

  document.addEventListener("pointerdown", (e) => {
    toggleSweep(e, true);
  }, { passive: true });

  document.addEventListener("pointerup", (e) => {
    toggleSweep(e, false);
  }, { passive: true });

  document.addEventListener("pointercancel", (e) => {
    toggleSweep(e, false);
  }, { passive: true });
}

/* ==========================================
   14. GIFT QR ZOOM MODAL
   ========================================== */
function initQRModal() {
  const trigger = document.getElementById("gift-guide-trigger");
  const modal = document.getElementById("qr-modal");
  const modalImg = document.getElementById("qr-modal-img");
  const close = document.getElementById("qr-close");

  if (!trigger || !modal) return;

  const open = () => {
    if (modalImg) {
      const srcImg = document.getElementById("gift-guide-img");
      if (srcImg && srcImg.getAttribute("src")) modalImg.src = srcImg.getAttribute("src");
    }
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    if (close) close.focus();
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (trigger && trigger.focus) trigger.focus();
  };

  trigger.addEventListener("click", open);
  if (close) close.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

/* ==========================================
   15. ATTIRE GUIDE ZOOM
   ========================================== */
function initAttireZoom() {
  const trigger = document.querySelector(".attire-image img");
  const modal = document.getElementById("attire-modal");
  const modalImg = document.getElementById("attire-modal-img");
  const close = document.getElementById("attire-close");

  if (!trigger || !modal) return;

  const open = () => {
    if (modalImg) modalImg.src = trigger.currentSrc || trigger.src;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    if (close) close.focus();
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (trigger && trigger.focus) trigger.focus();
  };

  trigger.addEventListener("click", open);
  if (close) close.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

/* ==========================================
   16. SHARE INVITATION
   ========================================== */
function initShare() {
  const btn = document.getElementById("share-btn");
  if (!btn) return;

  const shareData = () => ({
    title: document.title,
    text: `Join us for the wedding of ${document.getElementById("hero-couple-names").innerText} — ${document.getElementById("hero-date").innerText}`,
    url: window.location.href
  });

  btn.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData());
      } catch (e) { /* user cancelled */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Invitation link copied!");
    } catch (e) {
      showToast(window.location.href);
    }
  });
}

/* ==========================================
   17. ADD TO CALENDAR CHOOSER
   ========================================== */
function initCalendarChooser() {
  const modal = document.getElementById("calendar-modal");
  const closeBtn = document.getElementById("calendar-close");
  const optionsEl = document.getElementById("calendar-options");
  const titleEl = document.getElementById("calendar-modal-title");

  if (!modal || !optionsEl) return;

  const detectDevice = () => {
    const ua = navigator.userAgent || "";
    const pf = navigator.platform || "";
    if (/iPad|iPhone|iPod/.test(ua) || (pf === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    if (/Android/.test(ua)) return "android";
    if (/Windows/.test(ua)) return "windows";
    return "other";
  };

  const recommendedFor = (device) => device === "ios" ? "apple" : device === "windows" ? "outlook" : "google";

  const fmtIso = (val) => {
    if (!val) return "";
    const s = String(val).replace(/T(\d{6})Z$/, "T$1");
    return s.length === 15 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(9, 11)}:${s.slice(11, 13)}:${s.slice(13, 15)}Z` : val;
  };

  const parseEvent = (kind) => {
    const ev = WEDDING_CONFIG.events[kind];
    if (!ev || !ev.googleCalendarUrl) return null;
    let u;
    try { u = new URL(ev.googleCalendarUrl); } catch (e) { return null; }
    const dates = (u.searchParams.get("dates") || "").split("/");
    const summary = u.searchParams.get("text") || "";
    const location = u.searchParams.get("location") || "";
    const details = u.searchParams.get("details") || "";
    const startUtc = dates[0] || "";
    const endUtc = dates[1] || "";
    return { kind, title: ev.title, summary, startUtc, endUtc, location, details, venue: ev.venue, address: ev.address };
  };

  const icsEscape = (val) => (val || "").replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\r?\n/g, "\\n");

  const buildIcs = (ev) => {
    const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WeddingInvitation//AddToCalendar//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${ev.kind}-${ev.startUtc}@wedding-invite`,
      `DTSTAMP:${now}`,
      `DTSTART:${ev.startUtc}`,
      `DTEND:${ev.endUtc}`,
      `SUMMARY:${icsEscape(ev.summary)}`,
      ev.details ? `DESCRIPTION:${icsEscape(ev.details)}` : "",
      ev.location ? `LOCATION:${icsEscape(ev.location)}` : "",
      "END:VEVENT",
      "END:VCALENDAR"
    ].filter(Boolean).join("\r\n");
  };

  const downloadIcs = (ev) => {
    const blob = new Blob([buildIcs(ev)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-${ev.kind}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const openIcsOnDevice = (ev) => {
    window.open("data:text/calendar;charset=utf-8," + encodeURIComponent(buildIcs(ev)), "_blank");
  };

  let current = null;

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    optionsEl.innerHTML = "";
  };

  const openModal = (kind) => {
    const ev = parseEvent(kind);
    if (!ev) { showToast("Calendar details not available yet."); return; }
    current = ev;

    const device = detectDevice();
    const recommended = recommendedFor(device);
    const googleUrl = WEDDING_CONFIG.events[kind].googleCalendarUrl;
    const outlook = "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent"
      + `&subject=${encodeURIComponent(ev.summary)}`
      + `&body=${encodeURIComponent(ev.details || ev.summary)}`
      + `&location=${encodeURIComponent(ev.location)}`
      + `&startdt=${encodeURIComponent(fmtIso(ev.startUtc))}`
      + `&enddt=${encodeURIComponent(fmtIso(ev.endUtc))}`
      + "&allday=false";
    const yahoo = "https://calendar.yahoo.com/?v=60"
      + `&title=${encodeURIComponent(ev.summary)}`
      + `&st=${encodeURIComponent(ev.startUtc)}`
      + `&et=${encodeURIComponent(ev.endUtc)}`
      + `&in_loc=${encodeURIComponent(ev.location)}`
      + `&desc=${encodeURIComponent(ev.details || "")}`;

    const opts = [
      { key: "google", label: "Google Calendar", icon: "fa-brands fa-google", href: googleUrl },
      { key: "apple", label: "Apple Calendar", icon: "fa-brands fa-apple", href: "" },
      { key: "outlook", label: "Outlook", icon: "fa-brands fa-microsoft", href: outlook },
      { key: "yahoo", label: "Yahoo Calendar", icon: "fa-brands fa-yahoo", href: yahoo },
      { key: "ics", label: "Download .ics", icon: "fa-regular fa-file", href: "" }
    ];
    const ordered = [
      opts.find(o => o.key === recommended),
      ...opts.filter(o => o.key !== recommended)
    ];

    const badge = (rec) => rec ? `<span class="cal-recommended">Recommended</span>` : "";
    optionsEl.innerHTML = ordered.map((o) => {
      const rec = o.key === recommended;
      const openTag = o.href
        ? `<a class="calendar-option" href="${o.href}" target="_blank" rel="noopener">`
        : `<button type="button" class="calendar-option" data-action="${o.key}">`;
      const closeTag = o.href ? "</a>" : "</button>";
      return openTag
        + `<i class="${o.icon} icon"></i>`
        + `<span class="cal-label">${o.label}</span>`
        + badge(rec)
        + `<i class="fa-solid fa-chevron-right" style="font-size:0.8rem;opacity:0.6;"></i>`
        + closeTag;
    }).join("");

    titleEl.textContent = `${ev.title} · Add to Calendar`;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  };

  optionsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn || !current) return;
    e.preventDefault();
    const action = btn.getAttribute("data-action");
    if (action === "apple") {
      const ua = navigator.userAgent || "";
      if (/iPad|iPhone|iPod|Mac/i.test(ua)) openIcsOnDevice(current);
      else downloadIcs(current);
    } else if (action === "ics") {
      downloadIcs(current);
    }
  });

  document.querySelectorAll("[data-event]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-event")));
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

/* ==========================================
   18. STICKY NAVIGATION
   ========================================== */
function initNav() {
  const nav = document.getElementById("site-nav");
  const burger = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-menu");

  if (!nav || !burger) return;

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close menu after picking a section (mobile)
  if (panel) {
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Scrollspy: highlight the section currently in view
  const links = nav.querySelectorAll("a[href^='#']");
  const map = {};
  links.forEach(a => {
    const id = a.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) map[id] = a;
  });

  const sectionIds = Object.keys(map);
  if (!sectionIds.length) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove("active"));
        const id = entry.target.id;
        if (map[id]) map[id].classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sectionIds.forEach(id => {
    const sec = document.getElementById(id);
    if (sec) spy.observe(sec);
  });
}

/* ==========================================
   14. GALLERY RAIL DRAG-TO-SCROLL
   ========================================== */
function initGalleryRailDrag(container) {
  if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia && window.matchMedia("(min-width: 768px)").matches) return;

  let isDown = false, startX = 0, scrollLeft = 0;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("dragging");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("dragging");
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.6;
    if (Math.abs(walk) > 6) container._dragMoved = true;
    container.scrollLeft = scrollLeft - walk;
  });
}
