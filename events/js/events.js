// ============================================================
//  LAUREIGHN EVENTS — Interactive Client Experience Engine
//  Brand: Laureighn Events · Luxury Event Cinema & Photography
//  Official Direct Line & WhatsApp: +254 790 048 905
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentCategory = "all";
  let activeLightboxProject = null;
  let currentPhotoIndex = 0;

  // DOM Elements
  const showcaseGrid = document.getElementById("showcaseGrid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const mobileNavToggle = document.getElementById("mobileNavToggle");
  const mobileNavDrawer = document.getElementById("mobileNavDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");
  const btnFloatTop = document.getElementById("btnFloatTop");
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");

  // Lightbox DOM Elements
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightboxStageImg = document.getElementById("lightboxStageImg");
  const lightboxEventTitle = document.getElementById("lightboxEventTitle");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");
  const lightboxThumbsRail = document.getElementById("lightboxThumbsRail");
  const btnLightboxInquire = document.getElementById("btnLightboxInquire");

  // Concierge Elements
  const conciergeForm = document.getElementById("conciergeForm");
  const conciergeSummaryTitle = document.getElementById("conciergeSummaryTitle");
  const conciergeSummarySub = document.getElementById("conciergeSummarySub");
  const btnLaunchWaInquiry = document.getElementById("btnLaunchWaInquiry");

  // ============================================================
  // 1. SHOWCASE RENDERING & CATEGORY FILTERING
  // ============================================================
  function renderShowcase(category = "all") {
    if (!showcaseGrid) return;

    const filtered = (category === "all")
      ? EVENTS_PROJECTS
      : EVENTS_PROJECTS.filter(p => p.category === category);

    if (filtered.length === 0) {
      showcaseGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <p style="font-size: 18px; color: var(--text-muted); margin-bottom: 12px;">No showcase projects found in this category.</p>
          <button type="button" class="btn-hero-secondary" onclick="window.filterShowcase('all')" style="display:inline-flex;">View All Selected Works</button>
        </div>
      `;
      return;
    }

    showcaseGrid.innerHTML = filtered.map((project, idx) => {
      const coverImg = project.coverThumb || project.cover;
      const photoCount = project.gallery ? project.gallery.length : 1;
      const deliverablesHtml = (project.deliverables || []).slice(0, 3).map(d => `<span class="deliverable-pill">${escapeHtml(d)}</span>`).join("");

      return `
        <article class="work-card" data-category="${project.category}" data-id="${project.id}">
          <div class="work-thumb-wrap" onclick="window.openProjectGallery('${project.id}', 0)">
            <img src="${coverImg}" alt="${escapeHtml(project.title)}" class="work-thumb-img" loading="lazy">
            <div class="work-badge-corner">${escapeHtml(project.badge || project.categoryLabel)}</div>
            <div class="work-count-corner">📸 ${photoCount} Photos</div>
            <div class="work-overlay-actions">
              <span class="btn-open-gallery">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                <span>View Full Gallery</span>
              </span>
            </div>
          </div>
          <div class="work-body">
            <div class="work-meta-row">
              <span class="work-location">📍 ${escapeHtml(project.location)}</span>
              <span>${escapeHtml(project.year || '2026')}</span>
            </div>
            <h3 class="work-title" onclick="window.openProjectGallery('${project.id}', 0)" style="cursor:pointer;">${escapeHtml(project.title)}</h3>
            <p class="work-summary">${escapeHtml(project.summary)}</p>
            <div class="work-deliverables">
              ${deliverablesHtml}
            </div>
            <div class="work-footer">
              <button type="button" class="btn-card-gallery" onclick="window.openProjectGallery('${project.id}', 0)">
                <span>Explore Story &amp; Photos →</span>
              </button>
              <a href="javascript:void(0)" onclick="window.seedInquiryWithProject('${project.id}')" class="work-inquire-link" title="Inquire About This Style">
                <span>Book Similar 💬</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  // Filter Buttons Handler
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      window.filterShowcase(cat);
    });
  });

  window.filterShowcase = function(cat) {
    currentCategory = cat;
    filterButtons.forEach(b => {
      b.classList.toggle("active", b.dataset.category === cat);
    });
    renderShowcase(cat);
  };

  // ============================================================
  // 2. FULL-SCREEN INTERACTIVE CINEMA LIGHTBOX
  // ============================================================
  window.openProjectGallery = function(projectId, photoIndex = 0) {
    const project = EVENTS_PROJECTS.find(p => p.id === projectId);
    if (!project || !project.gallery || project.gallery.length === 0) return;

    activeLightboxProject = project;
    currentPhotoIndex = photoIndex;

    updateLightboxView();
    if (lightboxModal) {
      lightboxModal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  };

  function updateLightboxView() {
    if (!activeLightboxProject) return;

    const photos = activeLightboxProject.gallery;
    const currentPhoto = photos[currentPhotoIndex] || photos[0];

    if (lightboxStageImg) {
      lightboxStageImg.src = currentPhoto.url;
      lightboxStageImg.alt = currentPhoto.caption || activeLightboxProject.title;
    }

    if (lightboxEventTitle) {
      lightboxEventTitle.textContent = activeLightboxProject.title;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentPhotoIndex + 1} of ${photos.length}`;
    }

    if (lightboxCaption) {
      lightboxCaption.textContent = currentPhoto.caption || `${activeLightboxProject.title} · ${activeLightboxProject.location}`;
    }

    // Update WhatsApp inquiry link
    if (btnLightboxInquire) {
      const waMsg = encodeURIComponent(`Hello Laureighn Events! I saw your work on "${activeLightboxProject.title}" (${activeLightboxProject.location}) and I love this photography & cinema style. I'd love to check availability for my upcoming event! ✨`);
      btnLightboxInquire.href = `https://wa.me/254790048905?text=${waMsg}`;
    }

    // Render Thumbnails
    if (lightboxThumbsRail) {
      lightboxThumbsRail.innerHTML = photos.map((p, i) => `
        <div class="lightbox-thumb ${i === currentPhotoIndex ? 'active' : ''}" onclick="window.goToLightboxPhoto(${i})">
          <img src="${p.url}" alt="Thumbnail ${i + 1}" loading="lazy">
        </div>
      `).join("");
    }
  }

  window.goToLightboxPhoto = function(index) {
    if (!activeLightboxProject) return;
    const total = activeLightboxProject.gallery.length;
    currentPhotoIndex = (index + total) % total;
    updateLightboxView();
  };

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove("open");
      document.body.style.overflow = "";
    }
    activeLightboxProject = null;
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", () => window.goToLightboxPhoto(currentPhotoIndex - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", () => window.goToLightboxPhoto(currentPhotoIndex + 1));

  // Keyboard Navigation for Lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") window.goToLightboxPhoto(currentPhotoIndex - 1);
    if (e.key === "ArrowRight") window.goToLightboxPhoto(currentPhotoIndex + 1);
  });

  // Touch Swipe on Mobile for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) window.goToLightboxPhoto(currentPhotoIndex - 1);
      else window.goToLightboxPhoto(currentPhotoIndex + 1);
    }
  }

  // ============================================================
  // 3. CINEMA REELS VIDEO PLAYER CONTROLLER
  // ============================================================
  const reelCards = document.querySelectorAll(".reel-theater-card");
  reelCards.forEach(card => {
    const video = card.querySelector("video");
    const overlay = card.querySelector(".reel-play-overlay");
    const muteBtn = card.querySelector(".btn-reel-mute");
    const fsBtn = card.querySelector(".btn-reel-fs");

    if (overlay && video) {
      overlay.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          overlay.classList.add("playing");
        } else {
          video.pause();
          overlay.classList.remove("playing");
        }
      });

      video.addEventListener("play", () => overlay.classList.add("playing"));
      video.addEventListener("pause", () => overlay.classList.remove("playing"));
    }

    if (muteBtn && video) {
      muteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? "🔇 Unmute" : "🔊 Sound On";
      });
    }

    if (fsBtn && video) {
      fsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      });
    }
  });

  // ============================================================
  // 4. INTERACTIVE EVENT CONCIERGE & INQUIRY GENERATOR
  // ============================================================
  function updateConciergeSummary() {
    const eventType = document.getElementById("conciergeEventType")?.value || "Grand Wedding & Matrimony";
    const eventLocation = document.getElementById("conciergeLocation")?.value || "Nairobi / Western Kenya";
    const guestTier = document.getElementById("conciergeGuests")?.value || "200-400 Guests";

    const isVideo = document.getElementById("chkCinemaReels")?.checked;
    const isDrone = document.getElementById("chkDroneFleet")?.checked;
    const isMounts = document.getElementById("chkPhotoMounts")?.checked;

    let crewCount = "2-3 Crew Members";
    if (guestTier.includes("400") || guestTier.includes("500")) crewCount = "4-5 Dedicated Specialists (Dual Camera, Drone, Sound)";
    else if (guestTier.includes("Under 100")) crewCount = "2 Masters (Lead Portraitist + Cinema Op)";

    if (conciergeSummaryTitle) {
      conciergeSummaryTitle.textContent = `Recommended: ${crewCount} · ${eventType}`;
    }

    if (conciergeSummarySub) {
      let features = ["4K Full-Frame Cinema", "Same-Week 48hr Teaser"];
      if (isVideo) features.push("Cinematic Highlight Film");
      if (isDrone) features.push("4K60 Drone Aerials");
      if (isMounts) features.push("Archival Wood Mount");
      conciergeSummarySub.textContent = `Location: ${eventLocation} · Includes: ${features.join(" + ")}`;
    }
  }

  // Attach change listeners to concierge inputs
  const conciergeInputs = document.querySelectorAll("#conciergeForm input, #conciergeForm select");
  conciergeInputs.forEach(input => {
    input.addEventListener("change", updateConciergeSummary);
  });

  // Launch WhatsApp Event Inquiry
  if (btnLaunchWaInquiry) {
    btnLaunchWaInquiry.addEventListener("click", (e) => {
      e.preventDefault();

      const name = document.getElementById("conciergeName")?.value.trim() || "Event Host";
      const phone = document.getElementById("conciergePhone")?.value.trim() || "";
      const eventType = document.getElementById("conciergeEventType")?.value || "Wedding & Holy Matrimony";
      const eventDate = document.getElementById("conciergeDate")?.value || "Upcoming (TBD)";
      const location = document.getElementById("conciergeLocation")?.value || "Kenya";
      const guests = document.getElementById("conciergeGuests")?.value || "200-400 Guests";
      const notes = document.getElementById("conciergeNotes")?.value.trim() || "Looking for your premier photo & cinema production coverage.";

      const services = [];
      if (document.getElementById("chkPhotography")?.checked) services.push("Masterclass Photography");
      if (document.getElementById("chkCinemaReels")?.checked) services.push("4K Cinematic Highlight Reel");
      if (document.getElementById("chkDroneFleet")?.checked) services.push("4K60 Aerial Drone Footage");
      if (document.getElementById("chkLiveStream")?.checked) services.push("Multi-Cam Live Stream");
      if (document.getElementById("chkPhotoMounts")?.checked) services.push("Archival Wooden Photo Mounts");

      const waText = 
`✨ *NEW EVENT COVERAGE INQUIRY — LAUREIGHN EVENTS* ✨

👤 *Client / Host:* ${name}
📱 *Phone:* ${phone || 'Provided via WhatsApp'}
💍 *Event Type:* ${eventType}
📅 *Event Date:* ${eventDate}
📍 *Venue & Location:* ${location}
👥 *Estimated Attendance:* ${guests}

🎬 *Requested Production Scope:*
${services.map(s => `• ${s}`).join("\n")}

📝 *Special Vision / Notes:*
"${notes}"

_Inquiry dispatched via Laureighn Events Showcase (https://laureignstudios.vercel.app/events)_`;

      const waUrl = `https://wa.me/254790048905?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  window.seedInquiryWithProject = function(projectId) {
    const project = EVENTS_PROJECTS.find(p => p.id === projectId);
    if (!project) return;

    const conciergeSec = document.getElementById("concierge");
    if (conciergeSec) {
      conciergeSec.scrollIntoView({ behavior: "smooth" });
    }

    const eventTypeSelect = document.getElementById("conciergeEventType");
    if (eventTypeSelect) {
      if (project.category === "weddings") eventTypeSelect.value = "Holy Matrimony & Wedding";
      else if (project.category === "traditional") eventTypeSelect.value = "Traditional Ruracio & Dowry Rites";
      else if (project.category === "corporate") eventTypeSelect.value = "Corporate Summit & Gala";
      else if (project.category === "birthdays") eventTypeSelect.value = "Milestone Birthday Gala";
      else if (project.category === "graduations") eventTypeSelect.value = "Doctoral / Academic Convocation";
    }

    const notesInput = document.getElementById("conciergeNotes");
    if (notesInput) {
      notesInput.value = `I loved your coverage of "${project.title}" (${project.location}) and would love similar cinematic quality for my event.`;
    }

    updateConciergeSummary();
  };

  // ============================================================
  // 5. MOBILE DRAWER NAVIGATION
  // ============================================================
  function toggleMobileDrawer(open) {
    if (!mobileNavDrawer || !drawerBackdrop) return;
    const isOpen = (typeof open === "boolean") ? open : !mobileNavDrawer.classList.contains("open");
    mobileNavDrawer.classList.toggle("open", isOpen);
    drawerBackdrop.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (mobileNavToggle) mobileNavToggle.addEventListener("click", () => toggleMobileDrawer(true));
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", () => toggleMobileDrawer(false));
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", () => toggleMobileDrawer(false));

  const drawerNavLinks = document.querySelectorAll(".drawer-link");
  drawerNavLinks.forEach(link => {
    link.addEventListener("click", () => toggleMobileDrawer(false));
  });

  // ============================================================
  // 6. FAQ ACCORDION
  // ============================================================
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const header = item.querySelector(".faq-header");
    if (header) {
      header.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach(i => i.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      });
    }
  });

  // ============================================================
  // 7. SCROLL-TO-TOP & SCROLL REVEALS
  // ============================================================
  window.addEventListener("scroll", () => {
    if (btnFloatTop) {
      if (window.scrollY > 400) btnFloatTop.classList.add("visible");
      else btnFloatTop.classList.remove("visible");
    }
  }, { passive: true });

  if (btnFloatTop) {
    btnFloatTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ============================================================
  // 8. THEME TOGGLE (LUXURY NOIR / LIGHT CONTRAST)
  // ============================================================
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("laureighn_theme", theme);
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = (theme === "light")
        ? `<span>🌙 Dark Noir</span>`
        : `<span>☀️ Light Mode</span>`;
    });
  }

  const savedTheme = localStorage.getItem("laureighn_theme") || "dark";
  setTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = (current === "dark") ? "light" : "dark";
      setTheme(next);
    });
  });

  // Helper Escape HTML
  function escapeHtml(str) {
    if (!str) return "";
    return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initial runs
  renderShowcase("all");
  updateConciergeSummary();
});
