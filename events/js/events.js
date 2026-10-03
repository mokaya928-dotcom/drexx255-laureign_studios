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

  // 2. HERO SLIDESHOW (Crossfade with Preload)
  const slides = document.querySelectorAll(".hero-slide");
  let currentSlide = 0;
  if (slides.length > 1) {
    setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.remove("active");
      slides[nextSlide].classList.add("active");
      currentSlide = nextSlide;
    }, 4500);
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

  // 5. PORTFOLIO CATEGORY FILTERING
  const filterBtns = document.querySelectorAll(".filterbar .chip-f");
  const galleryItems = document.querySelectorAll("#gallery .gitem");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("on"));
      btn.classList.add("on");

      const cat = btn.getAttribute("data-cat");
      galleryItems.forEach(item => {
        const itemCat = item.getAttribute("data-cat");
        if (cat === "all" || itemCat === cat) {
          item.style.display = "block";
          // Trigger slight fade-in
          item.style.opacity = "1";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

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

// 2. LIGHTBOX VIEWER
let currentLbIndex = 0;
let lbImagesList = [];

function openLB(itemEl) {
  const allVisibleItems = Array.from(document.querySelectorAll("#gallery .gitem")).filter(el => el.style.display !== "none");
  lbImagesList = allVisibleItems.map(el => {
    const img = el.querySelector("img");
    const caption = el.querySelector(".ov span");
    return {
      src: img ? img.src : "",
      alt: img ? img.alt : "",
      caption: caption ? caption.textContent : ""
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
  if (lbImg) {
    lbImg.src = current.src;
    lbImg.alt = current.caption || current.alt || "Laureighn Events Showcase";
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

// 3. VIDEO REEL MUTE / UNMUTE
function toggleMute(btn, event) {
  event.stopPropagation();
  const cell = btn.closest(".film-cell");
  if (!cell) return;
  const video = cell.querySelector("video");
  if (!video) return;

  video.muted = !video.muted;
  btn.textContent = video.muted ? "🔇" : "🔊";
}

// 4. PORTFOLIO EXPANSION TOGGLE
let isPortfolioExpanded = false;
function togglePortfolioMore() {
  const btn = document.getElementById("portMoreBtn");
  const textSpan = btn ? btn.querySelector("span") : null;

  isPortfolioExpanded = !isPortfolioExpanded;

  if (btn) btn.classList.toggle("is-open", isPortfolioExpanded);

  if (isPortfolioExpanded) {
    if (textSpan) textSpan.textContent = "Show Less";
    // Scroll smoothly to newly exposed items
    const gallery = document.getElementById("gallery");
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  } else {
    if (textSpan) textSpan.textContent = "View More Curated Works";
    const portSection = document.getElementById("portfolio");
    if (portSection) {
      portSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
