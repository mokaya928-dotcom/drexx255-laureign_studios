// ============================================================
// LAUREIGHN EVENTS — INTERACTIVE CLIENT ENGINE
// Styled after Haus of AL Studios Editorial Interactions
// WhatsApp: +254 790 048 905 / 0790 048 905
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. SOLID NAV ON SCROLL
  const nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("solid", window.scrollY > 80);
    }, { passive: true });
    // Run once on load
    nav.classList.toggle("solid", window.scrollY > 80);
  }

  // 2. HERO SLIDESHOW (Smooth Zero-Black-Space Crossfade every 3 Seconds)
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length > 1) {
    let currentSlide = 0;
    const SLIDE_DURATION = 3000; // 3 seconds interval as requested
    const FADE_DURATION = 900;   // 0.9s smooth crossfade

    // Preload & decode all slide images into GPU memory in advance
    slides.forEach(slide => {
      const img = slide.querySelector("img");
      if (img && img.src) {
        const pre = new Image();
        pre.src = img.src;
        if (pre.decode) {
          pre.decode().catch(() => {});
        }
      }
    });

    let slideTimer = null;

    function goToNextSlide() {
      const prevSlide = currentSlide;
      const nextSlide = (currentSlide + 1) % slides.length;

      // 1. Keep previous slide 100% visible underneath at z-index: 1
      slides[prevSlide].classList.remove("active");
      slides[prevSlide].classList.add("prev-active");

      // 2. Fade in next slide ON TOP at z-index: 2
      slides[nextSlide].classList.add("active");

      // 3. Once crossfade finishes, cleanly release prev-active
      setTimeout(() => {
        slides[prevSlide].classList.remove("prev-active");
      }, FADE_DURATION);

      currentSlide = nextSlide;
    }

    function startSlideshow() {
      if (slideTimer) clearInterval(slideTimer);
      slideTimer = setInterval(goToNextSlide, SLIDE_DURATION);
    }

    function stopSlideshow() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    });

    startSlideshow();
  }

  // 3. REVEAL ANIMATIONS ON SCROLL
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // 4. PARALLAX BAND SUBTLE SCROLL
  const bandBg = document.querySelector(".band-bg");
  if (bandBg) {
    window.addEventListener("scroll", () => {
      const rect = bandBg.parentElement.getBoundingClientRect();
      const pct = rect.top / (window.innerHeight + rect.height);
      bandBg.style.transform = `translateY(${pct * 50}px)`;
    }, { passive: true });
  }

  // 5. PORTFOLIO CATEGORY FILTERING & 15-IMAGE VIEW LIMITER
  const filterBtns = document.querySelectorAll(".filterbar .chip-f");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const bookTarget = btn.getAttribute("data-book");
      if (bookTarget) {
        // Open booking modal directly pre-selected for this event
        openBk(bookTarget);
        return;
      }

      filterBtns.forEach(b => b.classList.remove("on"));
      btn.classList.add("on");

      currentCategory = btn.getAttribute("data-cat") || "all";
      // Reset expanded state to false so new category starts clean with 15 photos
      isPortfolioExpanded = false;
      updateGalleryDisplay();

      // Smooth scroll if user was scrolled deep down in gallery
      const gallery = document.getElementById("gallery");
      if (gallery) {
        const rect = gallery.getBoundingClientRect();
        if (rect.top < -150) {
          gallery.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Initial display setup (limits to first 15 photos on page load)
  updateGalleryDisplay();

  // 6. STATS NUMBER COUNT-UP ANIMATION
  function initStats() {
    const statsBand = document.querySelector(".stats-band");
    if (!statsBand) return;

    let animated = false;
    const statsObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          statsBand.querySelectorAll(".stat .n").forEach(node => {
            const raw = node.textContent.trim();
            const targetVal = node.getAttribute("data-target");
            if (!targetVal) return;

            const target = parseInt(targetVal, 10);
            if (isNaN(target)) return;

            const duration = 1600;
            const startTime = performance.now();

            function updateCount(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const ease = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(ease * target);

              if (raw.includes("+")) {
                node.textContent = currentVal + "+";
              } else if (raw.includes("%")) {
                node.textContent = currentVal + "%";
              } else if (raw.includes("h")) {
                node.textContent = currentVal + "h";
              } else {
                node.textContent = currentVal;
              }

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                node.textContent = raw;
              }
            }
            requestAnimationFrame(updateCount);
          });
        }
      });
    }, { threshold: 0.2 });

    statsObs.observe(statsBand);
  }
  initStats();
});

// ============================================================
// GLOBAL FUNCTIONS (Booking Modal, Lightbox, Video Controls)
// ============================================================

// 1. BOOKING MODAL
let bkStep = 1;
const bkData = { session: "", date: "", time: "", name: "", phone: "", location: "" };

function openBk(preselect) {
  bkStep = 1;
  bkData.session = preselect || "";
  bkData.date = "";
  bkData.time = "";
  bkData.name = "";
  bkData.phone = "";
  bkData.location = "";

  const bkDate = document.getElementById("bkDate");
  const bkName = document.getElementById("bkName");
  const bkPhone = document.getElementById("bkPhone");
  const bkLocation = document.getElementById("bkLocation");

  if (bkDate) bkDate.value = "";
  if (bkName) bkName.value = "";
  if (bkPhone) bkPhone.value = "";
  if (bkLocation) bkLocation.value = "";

  // Highlight selected option
  document.querySelectorAll(".bk-opt").forEach(opt => {
    const isSelected = preselect && opt.getAttribute("data-session").toLowerCase() === preselect.toLowerCase();
    opt.classList.toggle("selected", !!isSelected);
  });

  document.querySelectorAll(".bk-pill").forEach(p => p.classList.remove("selected"));

  bkShow(1);
  const overlay = document.getElementById("bkOverlay");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeBk() {
  const overlay = document.getElementById("bkOverlay");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function bkShow(n) {
  bkStep = n;
  document.querySelectorAll(".bk-step").forEach(s => {
    const stepNum = parseInt(s.getAttribute("data-step"), 10);
    s.classList.toggle("active", stepNum <= n);
  });
  document.querySelectorAll(".bk-panel").forEach(p => {
    const panelNum = parseInt(p.getAttribute("data-panel"), 10);
    p.classList.toggle("active", panelNum === n);
  });
}

function bkNext() {
  if (bkStep < 3) bkShow(bkStep + 1);
}

function bkPrev() {
  if (bkStep > 1) bkShow(bkStep - 1);
}

// Option Click Listeners
document.querySelectorAll(".bk-opt").forEach(opt => {
  opt.addEventListener("click", () => {
    document.querySelectorAll(".bk-opt").forEach(x => x.classList.remove("selected"));
    opt.classList.add("selected");
    bkData.session = opt.getAttribute("data-session");
  });
});

// Time Pill Click Listeners
document.querySelectorAll(".bk-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".bk-pill").forEach(x => x.classList.remove("selected"));
    pill.classList.add("selected");
    bkData.time = pill.getAttribute("data-time");
  });
});

// WhatsApp Booking Dispatcher
function bkConfirm() {
  const bkDate = document.getElementById("bkDate");
  const bkName = document.getElementById("bkName");
  const bkPhone = document.getElementById("bkPhone");
  const bkLocation = document.getElementById("bkLocation");

  if (bkDate) bkData.date = bkDate.value;
  if (bkName) bkData.name = bkName.value.trim();
  if (bkPhone) bkData.phone = bkPhone.value.trim();
  if (bkLocation) bkData.location = bkLocation.value.trim();

  let msg = "Hello Laureighn Events! I would like to book a session / inquire about event coverage.";
  if (bkData.session) msg += `\n\n📸 Session Type: ${bkData.session}`;
  if (bkData.date) msg += `\n📅 Preferred Date: ${bkData.date}`;
  if (bkData.time) msg += `\n⏰ Preferred Time: ${bkData.time}`;
  if (bkData.name) msg += `\n👤 Client Name: ${bkData.name}`;
  if (bkData.phone) msg += `\n📱 WhatsApp Contact: ${bkData.phone}`;
  if (bkData.location) msg += `\n📍 Event City / Venue: ${bkData.location}`;
  msg += "\n\nPlease let me know your availability and package details. ✨";

  const waUrl = `https://wa.me/254790048905?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, "_blank");
  closeBk();
}

function openWA() {
  openBk();
}

// ============================================================
// 2. GALLERY ENGINE (15-Photo Initial Limiter, View More & Return Up)
// ============================================================
const GALLERY_INITIAL_LIMIT = 15;
let currentCategory = "all";
let isPortfolioExpanded = false;

function updateGalleryDisplay() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const galleryItems = Array.from(gallery.querySelectorAll(".gitem"));
  const btn = document.getElementById("portMoreBtn");
  const returnBtn = document.getElementById("portReturnBtn");

  // Collect all items matching the active category
  const matching = galleryItems.filter(item => {
    const itemCat = item.getAttribute("data-cat");
    return currentCategory === "all" || itemCat === currentCategory;
  });

  const totalMatching = matching.length;

  // Render items: show first 15 if not expanded, or all matching if expanded
  galleryItems.forEach(item => {
    const itemCat = item.getAttribute("data-cat");
    const isMatch = (currentCategory === "all" || itemCat === currentCategory);

    if (!isMatch) {
      item.style.display = "none";
      return;
    }

    const idx = matching.indexOf(item);
    if (!isPortfolioExpanded && idx >= GALLERY_INITIAL_LIMIT) {
      item.style.display = "none";
    } else {
      item.style.display = "block";
      item.style.opacity = "1";
    }
  });

  // Manage View More & Return Up buttons
  if (totalMatching <= GALLERY_INITIAL_LIMIT) {
    if (btn) btn.style.display = "none";
    if (returnBtn) returnBtn.style.display = "none";
  } else {
    if (btn) {
      btn.style.display = "inline-flex";
      const span = btn.querySelector("span");
      if (isPortfolioExpanded) {
        if (span) span.textContent = `Show Less (First ${GALLERY_INITIAL_LIMIT})`;
        btn.classList.add("is-open");
      } else {
        const remaining = totalMatching - GALLERY_INITIAL_LIMIT;
        if (span) span.textContent = `View More Photos (+${remaining} More)`;
        btn.classList.remove("is-open");
      }
    }
    if (returnBtn) {
      returnBtn.style.display = isPortfolioExpanded ? "inline-flex" : "none";
    }
  }
}

function togglePortfolioMore() {
  isPortfolioExpanded = !isPortfolioExpanded;
  updateGalleryDisplay();

  if (isPortfolioExpanded) {
    // When expanding, smoothly scroll down so new photos glide into view
    const gallery = document.getElementById("gallery");
    if (gallery) {
      const matching = Array.from(gallery.querySelectorAll(".gitem")).filter(item => {
        const itemCat = item.getAttribute("data-cat");
        return currentCategory === "all" || itemCat === currentCategory;
      });
      if (matching[GALLERY_INITIAL_LIMIT]) {
        matching[GALLERY_INITIAL_LIMIT].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  } else {
    // When collapsing, smoothly glide back to the top of the portfolio
    scrollToGalleryTop();
  }
}

// Smoothly scroll back to the top of the entire website
function scrollToPageTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function scrollToGalleryTop() {
  const portSection = document.getElementById("portfolio");
  if (portSection) {
    portSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Global Back-to-Top Button (Applies across the whole website)
window.addEventListener("scroll", () => {
  const bttBtn = document.getElementById("backToTopBtn") || document.getElementById("galleryTopBtn");
  if (!bttBtn) return;

  // Show as soon as user scrolls down past 350px anywhere on the page
  if (window.scrollY > 350) {
    bttBtn.classList.add("visible");
  } else {
    bttBtn.classList.remove("visible");
  }
}, { passive: true });

// ============================================================
// 3. LIGHTBOX VIEWER (Caption, Counter, Touch Swipe & Arrows)
// ============================================================
let currentLbIndex = 0;
let lbImagesList = [];

function openLB(itemEl) {
  // Collect all currently visible items in the current view
  const allVisibleItems = Array.from(document.querySelectorAll("#gallery .gitem")).filter(el => el.style.display !== "none");
  lbImagesList = allVisibleItems.map(el => {
    const img = el.querySelector("img");
    const caption = el.querySelector(".ov span");
    return {
      src: img ? img.src : "",
      alt: img ? img.alt : "",
      caption: caption ? caption.textContent : (img ? img.alt : "Laureighn Events Showcase")
    };
  });

  currentLbIndex = allVisibleItems.indexOf(itemEl);
  if (currentLbIndex === -1) currentLbIndex = 0;

  updateLBView();
  const lb = document.getElementById("lb");
  if (lb) lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

function updateLBView() {
  if (!lbImagesList.length) return;
  const current = lbImagesList[currentLbIndex];
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbCounter = document.getElementById("lbCounter");

  if (lbImg) {
    lbImg.src = current.src;
    lbImg.alt = current.caption || current.alt || "Laureighn Events Showcase";
  }
  if (lbCaption) {
    lbCaption.textContent = current.caption || current.alt || "Laureighn Events";
  }
  if (lbCounter) {
    lbCounter.textContent = `${currentLbIndex + 1} / ${lbImagesList.length}`;
  }
}

function closeLB() {
  const lb = document.getElementById("lb");
  if (lb) lb.classList.remove("open");
  document.body.style.overflow = "";
}

function lbNav(dir) {
  if (!lbImagesList.length) return;
  currentLbIndex = (currentLbIndex + dir + lbImagesList.length) % lbImagesList.length;
  updateLBView();
}

// Touch swipe support for mobile lightbox
let lbTouchStartX = 0;
let lbTouchEndX = 0;
const lbEl = document.getElementById("lb");
if (lbEl) {
  lbEl.addEventListener("touchstart", (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      lbTouchStartX = e.changedTouches[0].screenX;
    }
  }, { passive: true });

  lbEl.addEventListener("touchend", (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      lbTouchEndX = e.changedTouches[0].screenX;
      const diff = lbTouchEndX - lbTouchStartX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) lbNav(-1); // Swipe right -> prev
        else lbNav(1); // Swipe left -> next
      }
    }
  }, { passive: true });
}

// Keyboard Navigation for Lightbox & Modal
window.addEventListener("keydown", (e) => {
  const lb = document.getElementById("lb");
  const bk = document.getElementById("bkOverlay");

  if (lb && lb.classList.contains("open")) {
    if (e.key === "Escape") closeLB();
    if (e.key === "ArrowLeft") lbNav(-1);
    if (e.key === "ArrowRight") lbNav(1);
  }

  if (bk && bk.classList.contains("open")) {
    if (e.key === "Escape") closeBk();
  }
});

// 4. VIDEO REEL MUTE / UNMUTE
function toggleMute(btn, event) {
  event.stopPropagation();
  const cell = btn.closest(".film-cell");
  if (!cell) return;
  const video = cell.querySelector("video");
  if (!video) return;

  video.muted = !video.muted;
  btn.textContent = video.muted ? "🔇" : "🔊";
}
