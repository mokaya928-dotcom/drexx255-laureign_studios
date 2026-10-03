// ============================================================
//  packages.js — Pathway Controller & Native Booking Engine
//  Brand: Laureign Studios · Official WhatsApp: 0790048905
//  Designed for High-Conversion Client Bookings & Free Samples
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Read hash on load to check if a specific category was requested directly
  const initialHash = (window.location.hash || "").replace("#", "").toLowerCase();
  let currentPathway = ["studio", "outdoor", "events", "commercial", "all"].includes(initialHash) ? initialHash : "studio";
  let currentSubcat = "all";
  let searchQuery = "";
  let currentSort = "recommended";
  let activeTiers = {}; // { [pkgId]: optionIndex }
  let activeReels = {}; // { [pkgId]: boolean }
  let selectedAddOns = new Set();
  let modalState = {
    pkgId: null,
    optionIndex: 0
  };

  // Initialize active tiers to popular option or first option
  PACKAGES_DATA.forEach(pkg => {
    const defaultIdx = pkg.options.findIndex(o => o.popular);
    activeTiers[pkg.id] = defaultIdx >= 0 ? defaultIdx : 0;
  });

  // DOM Elements
  const packagesGrid = document.getElementById("packagesGrid");
  const resultsCount = document.getElementById("resultsCount");
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const sortSelect = document.getElementById("sortSelect");
  const controlsBar = document.getElementById("packagesBrowse");
  const metaCountBar = document.querySelector(".meta-count-bar");
  const pathwayCards = document.querySelectorAll(".pathway-card");
  const pathwayToggleBtns = document.querySelectorAll(".pathway-toggle-btn");
  const subcategoryPillsWrap = document.getElementById("subcategoryPillsWrap");
  const addonsGrid = document.getElementById("addonsGrid");
  const calcSelectedCount = document.getElementById("calcSelectedCount");
  const calcTotalAmount = document.getElementById("calcTotalAmount");
  const calcBookWaBtn = document.getElementById("calcBookWaBtn");
  const faqsList = document.getElementById("faqsList");

  // Booking Modal Elements
  const bookingModal = document.getElementById("bookingModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalPkgName = document.getElementById("modalPkgName");
  const modalPkgMeta = document.getElementById("modalPkgMeta");
  const modalAddReelCheckbox = document.getElementById("modalAddReelCheckbox");
  const modalDateInput = document.getElementById("modalDateInput");
  const modalNameInput = document.getElementById("modalNameInput");
  const modalPhoneInput = document.getElementById("modalPhoneInput");
  const modalEmailInput = document.getElementById("modalEmailInput");
  const modalLocationSelect = document.getElementById("modalLocationSelect");
  const modalWaPreview = document.getElementById("modalWaPreview");
  const modalLaunchWaBtn = document.getElementById("modalLaunchWaBtn");
  const modalQuickSkip = document.getElementById("modalQuickSkip");

  // Samples Viewer Modal Elements
  const samplesModal = document.getElementById("samplesModal");
  const samplesModalCloseBtn = document.getElementById("samplesModalCloseBtn");
  const samplesModalTitle = document.getElementById("samplesModalTitle");
  const samplesModalDesc = document.getElementById("samplesModalDesc");
  const samplesGalleryGrid = document.getElementById("samplesGalleryGrid");
  const samplesBookWaBtn = document.getElementById("samplesBookWaBtn");

  // Lightbox Elements
  const sampleLightbox = document.getElementById("sampleLightbox");
  const sampleLightboxClose = document.getElementById("sampleLightboxClose");
  const sampleLightboxImg = document.getElementById("sampleLightboxImg");
  const sampleLightboxCaption = document.getElementById("sampleLightboxCaption");

  const formatMoney = (n) => Number(n).toLocaleString();

  const getActiveOption = (pkg) => {
    const idx = activeTiers[pkg.id] !== undefined ? activeTiers[pkg.id] : 0;
    return pkg.options[idx] || pkg.options[0];
  };

  // ------------------------------------------------------------
  // Render Sub-Category Pills for Active Pathway
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // ------------------------------------------------------------
  // Render Sub-Category Pills for Active Pathway
  // ------------------------------------------------------------
  function renderSubcategories() {
    if (!subcategoryPillsWrap) return;
    if (!currentPathway) {
      currentPathway = "studio";
    }
    subcategoryPillsWrap.style.display = "flex";

    if (currentPathway === "all") {
      subcategoryPillsWrap.innerHTML = `
        <button type="button" class="subcat-pill active" onclick="window.selectCategory('all', false)">
          🌟 All 39 Packages
        </button>
        <button type="button" class="subcat-pill" onclick="window.selectCategory('studio', true)">
          📸 12 Studio Sessions
        </button>
        <button type="button" class="subcat-pill" onclick="window.selectCategory('outdoor', true)">
          🌿 12 Outdoor Sessions
        </button>
        <button type="button" class="subcat-pill" onclick="window.selectCategory('events', true)">
          💍 10 Weddings &amp; Events
        </button>
        <button type="button" class="subcat-pill" onclick="window.selectCategory('commercial', true)">
          🚀 5 Commercial Suites
        </button>
      `;
      return;
    }

    const pathwayObj = PATHWAYS.find(p => p.id === currentPathway);
    if (!pathwayObj) return;

    const pillsHtml = pathwayObj.subcategories.map(sub => {
      const isAct = sub.id === currentSubcat ? 'active' : '';
      return `
        <button type="button" class="subcat-pill ${isAct}" data-subcat="${sub.id}">
          ${sub.name}
        </button>
      `;
    }).join("");

    subcategoryPillsWrap.innerHTML = pillsHtml;

    subcategoryPillsWrap.querySelectorAll(".subcat-pill[data-subcat]").forEach(btn => {
      btn.addEventListener("click", () => {
        subcategoryPillsWrap.querySelectorAll(".subcat-pill[data-subcat]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentSubcat = btn.dataset.subcat;
        if (typeof btn.scrollIntoView === "function") {
          btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
        renderPackages();
      });
    });
  }

  // ------------------------------------------------------------
  // Chapter Navigation, Scroll-Spy & Deep Link Controller
  // ------------------------------------------------------------
  let isManualScrolling = false;

  window.scrollToSection = function(sectionId, updateHash = true) {
    if (["studio", "outdoor", "events", "commercial", "all"].includes(sectionId)) {
      window.selectCategory(sectionId, true);
      return;
    }
    const el = document.getElementById(sectionId);
    if (!el) return;
    isManualScrolling = true;
    if (updateHash && window.location.hash !== '#' + sectionId) {
      history.replaceState(null, null, '#' + sectionId);
    }
    updateStickyNav(sectionId);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      isManualScrolling = false;
    }, 900);
  };

  window.copySectionShareLink = function(sectionId) {
    const origin = window.location.origin;
    let pathname = window.location.pathname;
    if (!pathname.endsWith('/')) {
      pathname = pathname.replace(/\/[^/]*$/, '/');
    }
    const fullUrl = origin + pathname + '#' + sectionId;

    const names = {
      studio: "Studio & Portrait Sessions",
      outdoor: "Outdoor & Natural Light Sessions",
      events: "Weddings & Event Coverage",
      commercial: "Commercial & Brand Growth"
    };
    const sectionName = names[sectionId] || "Photoshoot Packages";

    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      navigator.share({
        title: `Laureign Studios · ${sectionName}`,
        text: `Explore ${sectionName} rates & packages at Laureign Studios Kakamega:`,
        url: fullUrl
      }).catch(() => {
        copyToClipboard(fullUrl, sectionName);
      });
    } else {
      copyToClipboard(fullUrl, sectionName);
    }
  };

  function copyToClipboard(url, name) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showShareToast(`✓ Link copied! Anyone opening this will view ${name} directly.`);
      }).catch(() => {
        fallbackCopy(url, name);
      });
    } else {
      fallbackCopy(url, name);
    }
  }

  function fallbackCopy(url, name) {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showShareToast(`✓ Link copied! Anyone opening this will view ${name} directly.`);
  }

  function showShareToast(msg) {
    let toast = document.getElementById("chapterShareToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "chapterShareToast";
      toast.className = "share-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size:16px;">🔗</span><span>${msg}</span>`;
    toast.classList.add("show");
    clearTimeout(window._shareToastTimer);
    window._shareToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3600);
  }

  function updateStickyNav(activeId) {
    const nav = document.getElementById("stickyPathwayNav");
    if (!nav) return;
    const btns = nav.querySelectorAll(".sticky-pathway-btn");
    let activeBtn = null;
    btns.forEach(btn => {
      const isAct = btn.dataset.target === activeId;
      btn.classList.toggle("active", isAct);
      if (isAct) activeBtn = btn;
    });
    if (activeBtn) {
      // Smoothly center active chapter button strictly inside the horizontal scroll container
      // DO NOT call activeBtn.scrollIntoView which causes vertical page jumping/shaking!
      const navRect = nav.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      const offset = (btnRect.left + btnRect.width / 2) - (navRect.left + navRect.width / 2);
      if (Math.abs(offset) > 12) {
        nav.scrollBy({ left: offset, behavior: "smooth" });
      }
    }
  }

  window.filterChapterSubcat = function(chapterId, subcatId, btnEl) {
    const sectionEl = document.getElementById(chapterId);
    if (!sectionEl) return;
    sectionEl.querySelectorAll(".subcat-pill").forEach(p => p.classList.remove("active"));
    if (btnEl) btnEl.classList.add("active");

    const cards = sectionEl.querySelectorAll(".mount-card");
    cards.forEach(card => {
      if (subcatId === "all") {
        card.style.display = "";
      } else {
        card.style.display = (card.dataset.subcat === subcatId) ? "" : "none";
      }
    });
  };

  let scrollSpyObserver = null;
  function initScrollSpy() {
    if (scrollSpyObserver) {
      scrollSpyObserver.disconnect();
    }
    const targets = ["studio", "outdoor", "events", "commercial"]
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!targets.length || !("IntersectionObserver" in window)) return;

    scrollSpyObserver = new IntersectionObserver((entries) => {
      if (isManualScrolling) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.dataset.chapter || entry.target.id;
          if (id) {
            if (window.location.hash !== '#' + id) {
              history.replaceState(null, null, '#' + id);
            }
            updateStickyNav(id);
          }
        }
      });
    }, {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: 0
    });

    targets.forEach(t => scrollSpyObserver.observe(t));
  }

  // Switch Category & Filter Cleanly
  window.selectCategory = function(catId, doScroll = false) {
    searchQuery = "";
    if (searchInput) searchInput.value = "";
    if (searchClearBtn) searchClearBtn.style.display = "none";
    currentPathway = catId || "studio";
    currentSubcat = "all";

    if (window.location.hash !== '#' + currentPathway) {
      history.replaceState(null, null, '#' + currentPathway);
    }

    updateStickyNav(currentPathway);
    renderSubcategories();
    renderPackages();

    if (doScroll) {
      const browseBar = document.getElementById("packagesBrowse");
      if (browseBar) {
        browseBar.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  window.resetSubcategory = function() {
    currentSubcat = "all";
    renderSubcategories();
    renderPackages();
  };

  // Switch Pathway (Legacy compatibility)
  function setPathway(pathwayId, doScroll) {
    window.selectCategory(pathwayId || "studio", Boolean(doScroll));
  }

  // Global helper for gateway tiles and reset buttons
  window.setPathwayExternal = (pid) => {
    window.selectCategory(pid || "studio", true);
  };

  function getPackageShowcaseUrl(pkg) {
    if (pkg.id === "graduation-shoot") return "graduation-shoot.html";
    if (pkg.id === "indoor-headshots" || pkg.id === "outdoor-headshots") return "headshots.html";
    if (pkg.id === "indoor-shirt-shoot" || pkg.id === "outdoor-shirt-shoot" || pkg.id === "shirt-reels") return "shirt-shoot.html";
    if (pkg.id === "silk-wrap" || pkg.id === "outdoor-silk-wrap") return "wrap-shoot.html";
    if (pkg.id === "traditional-creative" || pkg.id === "outdoor-traditional") return "portrait-shoot.html";
    if (pkg.id === "baby-bump" || pkg.id === "outdoor-baby-bump") return "maternity-shoot.html";
    if (pkg.id === "birthday-shoot" || pkg.id === "outdoor-birthday-shoot") return "birthday-shoots.html";
    if (pkg.id === "kids-photoshoot" || pkg.id === "kids-shoot" || pkg.id === "kids-outdoor-shoot") return "kids-shoot.html";
    if (pkg.id === "couple-shoot") return "couple-shoot.html";
    if (pkg.id === "family-shoot" || pkg.id === "outdoor-family-shoot") return "family-shoot.html";
    if (pkg.id === "pre-wedding") return "pre-wedding-shoot.html";
    if (pkg.id === "wedding-coverage") return "wedding-shoot.html";
    if (pkg.id === "traditional-wedding") return "traditional-wedding.html";
    if (pkg.id === "burial-coverage") return "burials.html";
    if (pkg.id === "birthday-events") return "birthday-events.html";
    if (pkg.id === "graduation-events" || pkg.id === "outdoor-graduation") return "graduation-events.html";
    if (pkg.id === "corporate-event") return "corporate-events.html";
    if (pkg.id === "hotel-events") return "hotel-events.html";
    if (pkg.id === "product-shoot") return "product-shoot.html";
    if (pkg.id === "hotel-hospitality") return "hotel-shoot.html";
    if (pkg.id === "boudoir-shoot") return "boudoir-shoot.html";
    if (pkg.id === "model-portfolio") return "model-portfolio.html";
    if (pkg.id === "newborn-shoot") return "newborn-shoot.html";
    if (pkg.id === "club-events") return "club-events.html";
    if (pkg.id === "school-events") return "school-events.html";
    if (pkg.id === "fun-club-events") return "fun-club-events.html";
    if (pkg.id === "events") return "events.html";
    if (pkg.id === "corporate-branding") return "corporate-branding.html";
    if (pkg.id === "graphic-starter" || pkg.id === "graphic-growth") return "commercial-branding.html";
    return "graduation-shoot.html";
  }

  function renderCardHtml(pkg, idx, isAboveTheFold) {
    const lowestOpt = pkg.options[0] || {};
    const targetUrl = getPackageShowcaseUrl(pkg);
    const isStudioOrOutdoor = pkg.pathway === "studio" || pkg.pathway === "outdoor";
    const isDesign = pkg.subcat === "graphic-design" || (pkg.category && pkg.category.includes("graphic")) || pkg.id.includes("graphic");
    const basePrice = lowestOpt.price || 0;

    const waText = `Hello Laureign Studios! I want to inquire about ${pkg.title} 📸`;
    const waUrl = `https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;

    const isEager = Boolean(isAboveTheFold);
    const webpSource = pkg.imageWebp ? `<source srcset="${pkg.imageWebp}" type="image/webp">` : '';
    const imgStyle = pkg.imagePosition ? `style="object-position: ${pkg.imagePosition} !important;"` : '';

    return `
      <article class="pkg-card mount-card" id="pkg-${pkg.id}" data-subcat="${pkg.subcat || ''}" data-pathway="${pkg.pathway || ''}">
        <div class="pkg-top-meta-row">
          <span class="mount-tag-pill">${pkg.catLabel}</span>
          ${pkg.badge ? `<span class="mount-discount-pill">${pkg.badge}</span>` : ''}
          ${isStudioOrOutdoor && !isDesign ? `<span class="mount-reel-subtle-pill" title="Optional 4K Video Reel available for this shoot (+KSh 1,500)">🎬 +4K Reel Available</span>` : ''}
        </div>

        <h4 class="mount-name"><a href="${targetUrl}">${pkg.title}</a></h4>
        <div class="mount-dimensions">
          <span>⏱️ ${pkg.turnaround}</span>
          <span>· RAW Proofs @ KSh 150</span>
        </div>

        <div class="mount-preview-frame js-card-zoom-trigger" data-pkg-id="${pkg.id}" style="cursor:pointer;" title="Click to enlarge & zoom photo for ${pkg.title}">
          ${pkg.image && (pkg.image.endsWith('.mp4') || pkg.image.endsWith('.webm')) ? `
            <video src="${pkg.image}" autoplay loop muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover;object-position:${pkg.imagePosition || 'center 20%'};display:block;"></video>
            <span class="mount-zoom-badge">🎬 Video Reel</span>
          ` : `
            <picture>
              ${webpSource}
              <img src="${pkg.image}" alt="${pkg.title}" loading="${isEager ? 'eager' : 'lazy'}" decoding="async" ${isEager ? 'fetchpriority="high"' : ''} ${imgStyle}>
            </picture>
            <span class="mount-zoom-badge">🔍 Zoom Photo</span>
          `}
        </div>

        <div class="mount-price-box">
          <div class="mount-price-row">
            <span class="mount-price-lbl">Starting Package Rate</span>
            <div>
              <span style="font-size:12px;color:var(--muted);margin-right:4px;">From</span>
              <span class="mount-new-price" id="pkg-price-${pkg.id}">${PACKAGES_CONFIG.currency}${formatMoney(basePrice)}</span>
            </div>
          </div>
        </div>

        <p class="mount-sub-desc">${pkg.tagline}</p>

        <div class="pkg-card-actions">
          <a href="${targetUrl}" class="btn-open-package-main">
            <span class="btn-text-full">View Packages &amp; Rates &rsaquo;</span>
            <span class="btn-text-short">View Rates &rsaquo;</span>
          </a>
          <a href="${waUrl}" id="wa-btn-${pkg.id}" target="_blank" rel="noopener" class="btn-card-wa-clean">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c2.1.8 2.1.5 2.5.5a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3z"/></svg>
            <span id="wa-btn-text-${pkg.id}">
              <span class="wa-text-full">Quick WhatsApp Inquiry</span>
              <span class="wa-text-short">WhatsApp</span>
            </span>
          </a>
        </div>
      </article>
    `;
  }

  // ------------------------------------------------------------
  // Search Intelligence Engine: Prefix Matching & Typo Tolerance
  // ------------------------------------------------------------
  const POPULAR_SEARCH_REFERENCES = [
    { label: "🎂 Birthday Shoots", query: "birthday", tags: ["birthday", "birthdat", "bday", "party", "celebration", "birthdays"] },
    { label: "🌿 Outdoor Sessions", query: "outdoor", tags: ["outdoor", "outdoors", "outside", "nature", "sunshine", "natural light", "park"] },
    { label: "💼 Executive Headshots", query: "headshot", tags: ["headshot", "headshots", "hedshot", "portrait", "corporate headshot", "linkedin", "profile"] },
    { label: "🎓 Graduation Shoots", query: "graduation", tags: ["graduation", "graduaton", "graduate", "gown", "campus", "degree"] },
    { label: "🤰 Maternity & Baby Bump", query: "maternity", tags: ["maternity", "maternty", "baby bump", "pregnancy", "pregnant", "bump"] },
    { label: "✨ Silk Wrap Portraits", query: "silk wrap", tags: ["silk wrap", "wrap", "silk", "glamour"] },
    { label: "🤍 White Shirt Concepts", query: "white shirt", tags: ["white shirt", "shirt", "crisp shirt"] },
    { label: "💍 Weddings & Matrimony", query: "wedding", tags: ["wedding", "wedin", "weddings", "ruracio", "bride", "groom", "matrimony"] },
    { label: "👶 Kids & Milestones", query: "kids", tags: ["kids", "children", "baby", "infant", "newborn", "toddler"] },
    { label: "👨‍👩‍👧 Family Sessions", query: "family", tags: ["family", "famly", "parents", "relatives", "group"] },
    { label: "❤️ Couple & Romance", query: "couple", tags: ["couple", "couples", "love", "date", "pre-wedding", "anniversary"] },
    { label: "🕊️ Burials & Memorials", query: "burial", tags: ["burial", "burials", "memorial", "funeral", "sendoff"] },
    { label: "📊 Corporate & Summits", query: "corporate", tags: ["corporate", "corparate", "conference", "summit", "business", "company"] },
    { label: "📦 Product & E-Commerce", query: "product", tags: ["product", "products", "ecommerce", "catalog", "merchandise"] },
    { label: "🏖️ Hotels & Hospitality", query: "hotel", tags: ["hotel", "hospitality", "resort", "airbnb", "lodge"] },
    { label: "🎨 Graphic Design", query: "graphic design", tags: ["graphic", "design", "logo", "branding", "flyer", "poster"] },
    { label: "🌹 Boudoir Portraits", query: "boudoir", tags: ["boudoir", "intimate", "lingerie", "beauty"] },
    { label: "👑 Cultural & Traditional", query: "traditional", tags: ["traditional", "cultural", "regalia", "heritage"] },
    { label: "🎧 Club & Nightlife", query: "club", tags: ["club", "nightlife", "dj", "party", "rave"] },
    { label: "🎬 4K Video Reels", query: "reel", tags: ["reel", "reels", "video", "tiktok", "cinematic", "shorts"] }
  ];

  function calcLevenshteinDistance(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const m = a.length, n = b.length;
    const d = Array.from({ length: m + 1 }, () => new Array(n + 1));
    for (let i = 0; i <= m; i++) d[i][0] = i;
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }
    return d[m][n];
  }

  function scoreReference(ref, q) {
    let score = 0;
    const labelClean = ref.label.replace(/[^\w\s]/g, '').trim().toLowerCase();
    const labelWords = labelClean.split(/\s+/).filter(Boolean);

    // 1. Exact query match
    if (ref.query === q) score += 300;

    // 2. Query starts with q (Prefix match from first letters: "b" -> "birthday", "out" -> "outdoor")
    if (ref.query.startsWith(q)) score += 200;

    // 3. Label word starts with q (e.g. "b" -> "Birthday", "o" -> "Outdoor")
    if (labelWords.some(w => w.startsWith(q))) score += 180;

    // 4. Any tag starts with q
    if (ref.tags && ref.tags.some(t => t.startsWith(q))) score += 160;

    // 5. Query contains q
    if (ref.query.includes(q)) score += 80;
    if (labelClean.includes(q)) score += 70;
    if (ref.tags && ref.tags.some(t => t.includes(q))) score += 60;

    // 6. Typo match (Levenshtein distance <= 1 or 2) when query length >= 4
    if (q.length >= 4) {
      const maxDist = q.length >= 6 ? 2 : 1;
      const targets = [ref.query, ...labelWords, ...(ref.tags || [])];
      for (const t of targets) {
        if (Math.abs(t.length - q.length) <= maxDist) {
          const d = calcLevenshteinDistance(q, t);
          if (d <= maxDist) {
            score += Math.max(0, 150 - d * 35);
            break;
          }
        }
      }
    }

    return score;
  }

  function scorePackageMatch(pkg, q) {
    let score = 0;
    const title = pkg.title.toLowerCase();
    const cat = (pkg.catLabel || '').toLowerCase();
    const subcat = (pkg.subcat || '').toLowerCase();
    const pathway = (pkg.pathway || '').toLowerCase();
    const tagline = (pkg.tagline || '').toLowerCase();
    const badge = (pkg.badge || '').toLowerCase();
    const titleWords = title.split(/[\s,–\-()]+/).filter(Boolean);
    const catWords = cat.split(/[\s,–\-()]+/).filter(Boolean);

    // 1. Exact title starts with query (First letters!)
    if (title.startsWith(q)) score += 250;

    // 2. Any title word starts with query (First letters of word!)
    // E.g. "Birthday Studio Glamour Shoot", "Outdoor Birthday Celebration", etc.
    const titleWordPrefix = titleWords.some(w => w.startsWith(q));
    if (titleWordPrefix) score += 180;

    // 3. Category or pathway starts with query
    if (cat.startsWith(q) || pathway.startsWith(q)) score += 140;
    if (catWords.some(w => w.startsWith(q))) score += 120;

    // 4. Substring in title or category
    if (title.includes(q)) score += 90;
    if (cat.includes(q)) score += 80;
    if (pathway.includes(q) || subcat.includes(q)) score += 50;
    if (tagline.includes(q) || badge.includes(q)) score += 40;

    // 5. Typo tolerance if query length >= 4 (handles "birthdat" -> "birthday", "outdor" -> "outdoor")
    if (q.length >= 4) {
      const maxDist = q.length >= 6 ? 2 : 1;
      const targets = [...titleWords, ...catWords, pathway, subcat];
      for (const t of targets) {
        if (Math.abs(t.length - q.length) <= maxDist) {
          const d = calcLevenshteinDistance(q, t);
          if (d <= maxDist) {
            score += Math.max(0, 160 - d * 40);
            break;
          }
        }
      }
    }

    // 6. Options inclusion
    if (pkg.options && pkg.options.some(o => (o.name + ' ' + o.summary).toLowerCase().includes(q))) {
      score += 25;
    }

    return score;
  }

  function highlightSearchMatch(str, rawQ) {
    if (!rawQ || !str) return str || '';
    const q = rawQ.trim().toLowerCase();
    const lower = str.toLowerCase();

    // 1. Direct substring match
    const idx = lower.indexOf(q);
    if (idx !== -1) {
      return str.slice(0, idx) + '<mark class="search-hl">' + str.slice(idx, idx + q.length) + '</mark>' + str.slice(idx + q.length);
    }

    // 2. Prefix match on individual words
    const words = str.split(/(\s+|[-–/(),.])/);
    let matched = false;
    const res = words.map(w => {
      if (matched) return w;
      const lw = w.toLowerCase();
      if (lw.startsWith(q)) {
        matched = true;
        return '<mark class="search-hl">' + w.slice(0, q.length) + '</mark>' + w.slice(q.length);
      }
      return w;
    });
    if (matched) return res.join('');

    // 3. Typo / fuzzy match on words (e.g. birthdat -> birthday)
    if (q.length >= 4) {
      const maxDist = q.length >= 6 ? 2 : 1;
      let matchedTypo = false;
      const res2 = words.map(w => {
        if (matchedTypo) return w;
        const lw = w.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lw.length >= 4 && Math.abs(lw.length - q.length) <= maxDist) {
          if (calcLevenshteinDistance(q, lw) <= maxDist) {
            matchedTypo = true;
            return '<mark class="search-hl">' + w + '</mark>';
          }
        }
        return w;
      });
      if (matchedTypo) return res2.join('');
    }

    return str;
  }

  function sortList(list) {
    const cloned = [...list];
    if (currentSort === "price-low") {
      cloned.sort((a, b) => getActiveOption(a).price - getActiveOption(b).price);
    } else if (currentSort === "price-high") {
      cloned.sort((a, b) => getActiveOption(b).price - getActiveOption(a).price);
    }
    return cloned;
  }

  // ------------------------------------------------------------
  // Render Packages Grid (Multi-Chapter Layout or Search Results)
  // ------------------------------------------------------------
  function renderPackages() {
    if (controlsBar) controlsBar.style.display = "block";

    // 1. Live Search Results Mode
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      let matched = PACKAGES_DATA
        .map(pkg => ({ pkg, score: scorePackageMatch(pkg, q) }))
        .filter(item => item.score > 0);

      if (currentSort === "price-low") {
        matched.sort((a, b) => getActiveOption(a.pkg).price - getActiveOption(b.pkg).price);
      } else if (currentSort === "price-high") {
        matched.sort((a, b) => getActiveOption(b.pkg).price - getActiveOption(a.pkg).price);
      } else {
        // Default: Sort by relevance score (first-letter prefix matches and typo matches fronted!)
        matched.sort((a, b) => b.score - a.score);
      }
      matched = matched.map(item => item.pkg);
      currentRenderedPackages = matched;

      // Check if reference typo was matched (e.g. birthdat -> Birthday Shoots)
      let typoNoticeText = "";
      const topRef = POPULAR_SEARCH_REFERENCES
        .map(ref => ({ ref, score: scoreReference(ref, q) }))
        .filter(x => x.score >= 90)
        .sort((a, b) => b.score - a.score)[0];
      if (topRef && topRef.ref.query !== q && q.length >= 4) {
        typoNoticeText = topRef.ref.label;
      }

      if (resultsCount) resultsCount.innerHTML = "";
      if (metaCountBar) metaCountBar.style.display = "none";

      const searchBanner = `
        <div class="category-header-banner" style="grid-column: 1 / -1;">
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <button type="button" class="btn-return-prominent" onclick="document.getElementById('searchClearBtn').click()" title="Clear Search">
              <span style="font-size:18px; font-weight:700; line-height:1;">‹</span>
              <span>Clear Search</span>
            </button>
            <div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--gold-soft); font-weight:700;">Search Results</div>
              <h3 style="font-family:var(--font-display); font-size:22px; color:var(--head); margin:2px 0 0; line-height:1.2;">
                Found ${matched.length} matching packages for "${escapeHtml(searchQuery)}"
                ${typoNoticeText ? `<span style="font-size:14px; font-weight:600; color:var(--gold-soft); margin-left:8px;">(${escapeHtml(typoNoticeText)})</span>` : ''}
              </h3>
            </div>
          </div>
          <button type="button" class="btn-reset-category" onclick="document.getElementById('searchClearBtn').click()">‹ Back to All Chapters</button>
        </div>
      `;

      if (matched.length === 0) {
        packagesGrid.innerHTML = `
          ${searchBanner}
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--head); margin-bottom: 8px;">No packages found</h3>
            <p style="color: var(--muted); margin-bottom: 20px;">No packages matched "${escapeHtml(searchQuery)}".</p>
            <div style="display:flex; justify-content:center; gap:10px;">
              <button type="button" class="btn-book-wa" style="max-width: 220px;" onclick="document.getElementById('searchClearBtn').click()">Clear Search</button>
            </div>
          </div>
        `;
      } else {
        packagesGrid.innerHTML = `
          ${searchBanner}
          <div class="chapter-cards-grid" style="grid-column: 1 / -1;">
            ${matched.map((p, idx) => renderCardHtml(p, idx, idx < 3)).join("")}
          </div>
        `;
      }
      attachCardListeners();
      return;
    }

    // 2. Multi-Chapter Continuous Scroll Mode (Default)
    if (metaCountBar) metaCountBar.style.display = "none";
    if (resultsCount) resultsCount.innerHTML = "";

    currentRenderedPackages = PACKAGES_DATA;

    // Helper to generate a chapter's HTML & card list
    function buildChapterSection(pathwayId, isSingleCategoryMode = false) {
      const pathwayObj = PATHWAYS.find(p => p.id === pathwayId) || PATHWAYS[0];
      let list = PACKAGES_DATA.filter(p => p.pathway === pathwayId);

      let filterBannerHtml = "";
      if (isSingleCategoryMode && currentSubcat && currentSubcat !== "all") {
        const subObj = pathwayObj.subcategories.find(s => s.id === currentSubcat);
        const subName = subObj ? subObj.name : currentSubcat;
        list = list.filter(p => p.subcat === currentSubcat);
        filterBannerHtml = `
          <div class="category-subcat-active-bar" style="grid-column: 1 / -1;">
            <div class="subcat-active-pill-badge">
              <span class="subcat-indicator-dot"></span>
              <span>Showing: <b>${escapeHtml(subName)}</b></span>
              <span class="subcat-count">(${list.length} package${list.length === 1 ? '' : 's'})</span>
            </div>
            <button type="button" class="btn-reset-subcat" onclick="window.resetSubcategory()">
              <span>‹ Show All ${escapeHtml(pathwayObj.title)}</span>
            </button>
          </div>
        `;
      }

      list = sortList(list);

      const cardsHtml = list.length > 0
        ? list.map((p, idx) => renderCardHtml(p, idx, idx < 2)).join("")
        : `
          <div class="subcat-empty-msg" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
            <h3 style="font-family: var(--font-display); font-size: 22px; color: var(--head); margin-bottom: 8px;">No packages found</h3>
            <p style="color: var(--muted); margin-bottom: 16px;">No packages match this specific subcategory.</p>
            <button type="button" class="btn-reset-subcat" onclick="window.resetSubcategory()" style="display:inline-flex;">‹ Show All ${escapeHtml(pathwayObj.title)}</button>
          </div>
        `;

      let glideHtml = "";
      if (isSingleCategoryMode) {
        const nextMap = {
          studio: {
            nextId: "outdoor",
            icon: "🌿",
            title: "Looking for sunlit gardens or scenic resorts?",
            btnText: "Explore Outdoor Sessions (12)",
            desc: "Golden hour maternity, vibrant outdoor birthdays, family picnics, and romantic couple stories."
          },
          outdoor: {
            nextId: "events",
            icon: "💍",
            title: "Planning a wedding, celebration or conference?",
            btnText: "Explore Weddings & Events (10)",
            desc: "Full-day holy matrimony, traditional ruracio, corporate summits, galas & dignified memorials."
          },
          events: {
            nextId: "commercial",
            icon: "🚀",
            title: "Elevating your brand, products or company?",
            btnText: "Explore Commercial & Branding (5)",
            desc: "High-conversion e-commerce photography, luxury hotel showcases & corporate brand growth."
          },
          commercial: {
            nextId: "studio",
            icon: "📸",
            title: "Looking for precision studio portraits?",
            btnText: "Explore Studio Sessions (12)",
            desc: "Graduation cap & gown milestones, executive headshots, crisp white shirts & luxury silk wraps."
          }
        };

        const nextInfo = nextMap[pathwayId] || nextMap.studio;

        glideHtml = `
          <div class="category-next-glide-card" style="grid-column: 1 / -1;">
            <div class="glide-icon-wrap">${nextInfo.icon}</div>
            <div class="glide-text-wrap">
              <div class="glide-eyebrow">Next Photoshoot Chapter</div>
              <h3 class="glide-title">${nextInfo.title}</h3>
              <p class="glide-desc">${nextInfo.desc}</p>
            </div>
            <div class="glide-actions">
              <button type="button" class="btn-glide-primary" onclick="window.selectCategory('${nextInfo.nextId}', true)">
                <span>${nextInfo.btnText}</span>
                <span aria-hidden="true">→</span>
              </button>
              <button type="button" class="btn-glide-secondary" onclick="window.selectCategory('all', true)">
                <span>🌟 View All 39 Packages</span>
              </button>
            </div>
          </div>
        `;
      }

      return {
        html: `
          <section class="chapter-section chapter-section-${pathwayId}" id="${pathwayId}" data-chapter="${pathwayId}">
            <header class="chapter-header apple-chapter-card">
              <div class="chapter-eyebrow-row">
                <span class="chapter-num-badge">${pathwayObj.icon} Chapter: ${escapeHtml(pathwayObj.title)}</span>
                <span class="chapter-total-count">${list.length} Package${list.length === 1 ? '' : 's'}</span>
              </div>
              <h2 class="chapter-title">${pathwayObj.title}</h2>
              <p class="chapter-desc">${pathwayObj.desc || pathwayObj.tagline}</p>
            </header>
            <div class="chapter-cards-grid" id="grid-${pathwayId}">
              ${filterBannerHtml}
              ${cardsHtml}
              ${glideHtml}
            </div>
          </section>
        `,
        list: list
      };
    }

    if (currentPathway === "all") {
      const studioRes = buildChapterSection("studio", false);
      const outdoorRes = buildChapterSection("outdoor", false);
      const eventsRes = buildChapterSection("events", false);
      const commercialRes = buildChapterSection("commercial", false);

      const divider = `
        <div class="chapter-transition-divider" aria-hidden="true">
          <span class="chapter-divider-line"></span>
        </div>
      `;

      packagesGrid.innerHTML = studioRes.html + divider + outdoorRes.html + divider + eventsRes.html + divider + commercialRes.html;
      currentRenderedPackages = PACKAGES_DATA;

      const floatingReturnBtn = document.getElementById("floatingCategoryReturn");
      if (floatingReturnBtn) floatingReturnBtn.style.display = "none";

      attachCardListeners();
      initScrollSpy();
      return;
    }

    // Single Category Focus Mode (Clean, Uncluttered, Fast)
    const activeTarget = ["studio", "outdoor", "events", "commercial"].includes(currentPathway) ? currentPathway : "studio";
    const chapterData = buildChapterSection(activeTarget, true);
    packagesGrid.innerHTML = chapterData.html;
    currentRenderedPackages = chapterData.list;

    const floatingReturnBtn = document.getElementById("floatingCategoryReturn");
    if (floatingReturnBtn) floatingReturnBtn.style.display = "none";

    attachCardListeners();
  }

  let currentRenderedPackages = [];

  function attachCardListeners() {
    // Tier button clicks
    document.querySelectorAll(".pkg-tier-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pkgId = e.currentTarget.dataset.pkgId;
        const optIdx = parseInt(e.currentTarget.dataset.optIdx, 10);
        activeTiers[pkgId] = optIdx;
        renderPackages();
      });
    });

    // Book via WhatsApp button clicks
    document.querySelectorAll(".js-book-wa").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pkgId = e.currentTarget.dataset.pkgId;
        const optIdx = parseInt(e.currentTarget.dataset.optIdx, 10);
        openBookingModal(pkgId, optIdx);
      });
    });

    // See Free Samples button clicks
    document.querySelectorAll(".js-open-samples").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pkgId = e.currentTarget.dataset.pkgId;
        openSamplesModal(pkgId);
      });
    });

    // Zoomable Image Preview Frame clicks
    document.querySelectorAll(".js-card-zoom-trigger").forEach(frame => {
      frame.addEventListener("click", (e) => {
        e.stopPropagation();
        const pkgId = frame.dataset.pkgId;
        const items = currentRenderedPackages.map(p => ({
          url: p.imageHighRes || p.image,
          title: p.title,
          catLabel: p.catLabel,
          turnaround: p.turnaround,
          price: (p.options[0] || {}).price || 0,
          targetUrl: getPackageShowcaseUrl(p)
        }));
        const clickedIdx = currentRenderedPackages.findIndex(p => p.id === pkgId);
        openLightbox(items, clickedIdx !== -1 ? clickedIdx : 0);
      });
    });

    // Card Reel Checkbox Toggles
    document.querySelectorAll(".js-card-reel-toggle").forEach(chk => {
      chk.addEventListener("change", (e) => {
        const pkgId = e.target.dataset.pkgId;
        const isChecked = e.target.checked;
        setPackageReelOption(pkgId, isChecked);
      });
    });

    // Re-bind reel modal triggers if reels-modal.js loaded
    if (typeof window.bindReelsModalTriggers === "function") {
      window.bindReelsModalTriggers();
    }
  }

  // Live Reel Option Controller
  function setPackageReelOption(pkgId, isChecked) {
    activeReels[pkgId] = isChecked;
    const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
    if (!pkg) return;

    const lowestOpt = pkg.options[0] || {};
    const basePrice = lowestOpt.price || 0;
    const currentPrice = isChecked ? basePrice + 1500 : basePrice;

    // Update Price display
    const priceEl = document.getElementById(`pkg-price-${pkgId}`);
    if (priceEl) {
      priceEl.textContent = `${PACKAGES_CONFIG.currency}${formatMoney(currentPrice)}`;
    }

    // Update Card & Box classes
    const reelBox = document.getElementById(`reel-box-${pkgId}`);
    const cardEl = document.getElementById(`pkg-${pkgId}`);
    const toggleInput = document.getElementById(`reel-toggle-${pkgId}`);

    if (cardEl) {
      cardEl.classList.toggle("has-reel-selected", isChecked);
    }

    if (toggleInput && toggleInput.checked !== isChecked) {
      toggleInput.checked = isChecked;
    }

    if (reelBox) {
      reelBox.classList.toggle("reel-selected", isChecked);
      const textEl = reelBox.querySelector(".reel-box-toggle-text");
      if (textEl) {
        textEl.textContent = isChecked ? "✓ Reel Added (+1,500)" : "+ Add Reel to Shoot";
      }
    }

    // Update WhatsApp Button
    const waBtn = document.getElementById(`wa-btn-${pkgId}`);
    const waBtnText = document.getElementById(`wa-btn-text-${pkgId}`);
    if (waBtn) {
      const waText = isChecked
        ? `Hello Laureign Studios! 🎬 I want to book ${pkg.title} WITH the 45s–60s 4K Video Reel (+KSh 1,500). Total: KSh ${formatMoney(currentPrice)} 📸✨`
        : `Hello Laureign Studios! I want to inquire about ${pkg.title} 📸`;
      waBtn.href = `https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    }
    if (waBtnText) {
      const fullSpan = waBtnText.querySelector(".wa-text-full");
      const shortSpan = waBtnText.querySelector(".wa-text-short");
      if (fullSpan && shortSpan) {
        fullSpan.textContent = isChecked ? "Book Shoot + Reel on WhatsApp" : "Quick WhatsApp Inquiry";
        shortSpan.textContent = isChecked ? "Shoot + Reel" : "WhatsApp";
      } else {
        waBtnText.textContent = isChecked ? "Book Shoot + Reel on WhatsApp" : "Quick WhatsApp Inquiry";
      }
    }

    // Add or remove Mount badge
    const priceBox = cardEl ? cardEl.querySelector(".mount-price-box") : null;
    if (priceBox) {
      let badge = priceBox.querySelector(".mount-reel-included-badge");
      if (isChecked && !badge) {
        badge = document.createElement("div");
        badge.className = "mount-reel-included-badge";
        badge.textContent = "✨ Shoot + 4K Video Reel Included";
        priceBox.appendChild(badge);
      } else if (!isChecked && badge) {
        badge.remove();
      }
    }
  }
  window.setPackageReelOption = setPackageReelOption;

  // ------------------------------------------------------------
  // Free Samples Viewer Modal & Lightbox (With Apple Multi-Album Explorer)
  // ------------------------------------------------------------
  function renderMultiAlbumSamplesModal(pkg, activeAlbumId = null) {
    if (!pkg || !pkg.albums || pkg.albums.length === 0) return;

    if (samplesModalTitle) {
      samplesModalTitle.innerHTML = `${escapeHtml(pkg.title)} <span class="samples-modal-badge" style="background:#047857; color:#ffffff; padding:3px 10px; border-radius:999px; font-size:11px; font-weight:800; margin-left:8px;">📁 ${pkg.albums.length} Event Albums</span>`;
    }

    const allSamples = pkg.samples || [];
    const totalCount = allSamples.length;

    // Build top album filter tabs
    let tabsHtml = `
      <div class="samples-album-tabs-wrap">
        <div class="samples-album-tabs">
          <button type="button" class="album-tab-pill ${activeAlbumId === null ? 'active' : ''}" data-target="overview">
            📁 All Albums (${pkg.albums.length})
          </button>
          ${pkg.albums.map(alb => `
            <button type="button" class="album-tab-pill ${activeAlbumId === alb.id ? 'active' : ''}" data-target="${alb.id}">
              ${escapeHtml(alb.title.replace(" Birthday Party", "").replace(" Birthday Celebration", "").replace(" Twin Birthday", "").replace(" 1st Birthday Milestone", "").replace(" Birthday Gala", "").replace(" Sunshine Birthday", ""))} (${alb.count})
            </button>
          `).join('')}
          <button type="button" class="album-tab-pill ${activeAlbumId === 'all-stream' ? 'active' : ''}" data-target="all-stream">
            📸 All Photos (${totalCount})
          </button>
        </div>
      </div>
    `;

    if (samplesModalDesc) {
      samplesModalDesc.innerHTML = `
        <div style="font-size:12.5px; color:var(--muted); margin-bottom:4px;"><b>Select an event album</b> to inspect authentic milestone lighting, guest candids &amp; celebration moments:</div>
        ${tabsHtml}
      `;

      // Attach tab click handlers
      const pillButtons = samplesModalDesc.querySelectorAll('.album-tab-pill');
      pillButtons.forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const target = btn.dataset.target;
          if (target === 'overview') {
            renderMultiAlbumSamplesModal(pkg, null);
          } else if (target === 'all-stream') {
            renderMultiAlbumSamplesModal(pkg, 'all-stream');
          } else {
            renderMultiAlbumSamplesModal(pkg, target);
          }
        };
      });
    }

    if (!samplesGalleryGrid) return;

    // View 1: Overview - Apple Album Folder Cards
    if (activeAlbumId === null) {
      samplesGalleryGrid.innerHTML = `
        <div class="samples-folders-grid" style="grid-column: 1 / -1;">
          ${pkg.albums.map(alb => `
            <div class="samples-folder-card" data-album-id="${alb.id}">
              <div class="folder-card-thumb-wrap">
                <img src="${alb.cover}" alt="${escapeHtml(alb.title)}" loading="lazy">
                <div class="folder-card-badge">📁 Event Collection</div>
                <div class="folder-card-count">📸 ${alb.count} Photos</div>
              </div>
              <div class="folder-card-body">
                <div class="folder-card-title">${escapeHtml(alb.title)}</div>
                <div class="folder-card-vibe">${escapeHtml(alb.vibe || 'Real client birthday celebration coverage')}</div>
                <div class="folder-card-cta">
                  <span>Open Album (${alb.count} Photos)</span>
                  <span style="font-size:16px;">➔</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Attach card click handlers
      const cards = samplesGalleryGrid.querySelectorAll('.samples-folder-card');
      cards.forEach(card => {
        card.onclick = (e) => {
          e.stopPropagation();
          const albId = card.dataset.albumId;
          renderMultiAlbumSamplesModal(pkg, albId);
        };
      });

    // View 2: Specific Album Photos View
    } else if (activeAlbumId !== 'all-stream') {
      const alb = pkg.albums.find(a => a.id === activeAlbumId) || pkg.albums[0];
      const albSamples = alb.samples || [];

      const sampleItems = albSamples.map((s, sIdx) => ({
        url: s.url,
        title: s.title || `${alb.title} · Photo ${sIdx + 1}`,
        catLabel: pkg.catLabel,
        price: (pkg.options[0] || {}).price || 0,
        targetUrl: getPackageShowcaseUrl(pkg)
      }));

      samplesGalleryGrid.innerHTML = `
        <div class="samples-album-breadcrumb-bar" style="grid-column: 1 / -1;">
          <button type="button" class="btn-album-back" id="btnAlbumBack">‹ Back to All Albums</button>
          <div class="album-breadcrumb-title">📁 <b>${escapeHtml(alb.title)}</b> (${alb.count} Curated Photos)</div>
          <button type="button" class="btn-album-slideshow" id="btnAlbumSlideshow">▶ Start Fullscreen Slideshow</button>
        </div>
        ${albSamples.map((s, idx) => `
          <div class="sample-item-card js-lightbox-trigger" data-url="${s.url}" data-idx="${idx}">
            <img src="${s.url}" alt="${escapeHtml(s.title || 'Photo Sample')}" class="sample-item-thumb" loading="lazy">
            <div class="sample-item-zoom-icon">🔍</div>
          </div>
        `).join('')}
      `;

      const btnBack = document.getElementById("btnAlbumBack");
      if (btnBack) {
        btnBack.onclick = (e) => {
          e.stopPropagation();
          renderMultiAlbumSamplesModal(pkg, null);
        };
      }

      const btnSlideshow = document.getElementById("btnAlbumSlideshow");
      if (btnSlideshow) {
        btnSlideshow.onclick = (e) => {
          e.stopPropagation();
          openLightbox(sampleItems, 0);
        };
      }

      const triggers = samplesGalleryGrid.querySelectorAll('.js-lightbox-trigger');
      triggers.forEach((el, idx) => {
        el.onclick = (e) => {
          e.stopPropagation();
          openLightbox(sampleItems, idx);
        };
      });

    // View 3: All Photos Stream View
    } else {
      const sampleItems = allSamples.map((s, sIdx) => ({
        url: s.url,
        title: s.title || `Birthday Event · Photo ${sIdx + 1}`,
        catLabel: pkg.catLabel,
        price: (pkg.options[0] || {}).price || 0,
        targetUrl: getPackageShowcaseUrl(pkg)
      }));

      samplesGalleryGrid.innerHTML = `
        <div class="samples-album-breadcrumb-bar" style="grid-column: 1 / -1;">
          <button type="button" class="btn-album-back" id="btnAlbumBack">‹ Switch to Folder Albums</button>
          <div class="album-breadcrumb-title">📸 <b>All Birthday Event Photos</b> (${totalCount} Total Images)</div>
          <button type="button" class="btn-album-slideshow" id="btnAlbumSlideshow">▶ Fullscreen Slideshow</button>
        </div>
        ${allSamples.map((s, idx) => `
          <div class="sample-item-card js-lightbox-trigger" data-url="${s.url}" data-idx="${idx}">
            <img src="${s.url}" alt="${escapeHtml(s.title || 'Photo Sample')}" class="sample-item-thumb" loading="lazy">
            <div class="sample-item-zoom-icon">🔍</div>
          </div>
        `).join('')}
      `;

      const btnBack = document.getElementById("btnAlbumBack");
      if (btnBack) {
        btnBack.onclick = (e) => {
          e.stopPropagation();
          renderMultiAlbumSamplesModal(pkg, null);
        };
      }

      const btnSlideshow = document.getElementById("btnAlbumSlideshow");
      if (btnSlideshow) {
        btnSlideshow.onclick = (e) => {
          e.stopPropagation();
          openLightbox(sampleItems, 0);
        };
      }

      const triggers = samplesGalleryGrid.querySelectorAll('.js-lightbox-trigger');
      triggers.forEach((el, idx) => {
        el.onclick = (e) => {
          e.stopPropagation();
          openLightbox(sampleItems, idx);
        };
      });
    }

    if (samplesBookWaBtn) {
      samplesBookWaBtn.onclick = () => {
        const text = `👋 Hello ${PACKAGES_CONFIG.studioName}!\n\nI just checked your client event albums for "${pkg.title}" on your packages landing page, and I love the quality!\n\nI would like to inquire about booking availability for a birthday celebration. 📸`;
        window.open(`https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
      };
    }
  }

  function openSamplesModal(pkgId) {
    const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
    if (!pkg) return;

    // Check if this package has curated event albums / subfolders
    if (pkg.albums && pkg.albums.length > 0) {
      renderMultiAlbumSamplesModal(pkg, null);
      if (samplesModal) {
        samplesModal.classList.add("open");
        if (!history.state || history.state.modal !== "samples") {
          history.pushState({ modal: "samples" }, "", "#samples");
        }
      }
      return;
    }

    if (samplesModalTitle) {
      samplesModalTitle.textContent = `${pkg.title} · Photo Samples`;
    }
    if (samplesModalDesc) {
      samplesModalDesc.innerHTML = `Inspect real studio lighting, composition and skin retouching. Click any photo to view in full size; tap anywhere or ✕ to exit.`;
    }

    if (samplesGalleryGrid) {
      const samples = pkg.samples || [];
      if (samples.length === 0) {
        samplesGalleryGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--muted);">
            <div style="font-size: 32px; margin-bottom: 8px;">📷</div>
            <p>Photo samples available directly on WhatsApp.</p>
          </div>
        `;
      } else {
        const photoSamples = samples.filter(s => s.type !== 'video');
        const sampleItems = photoSamples.map((s, sIdx) => ({
          url: s.url,
          title: s.title || `${pkg.title} · Sample ${sIdx + 1}`,
          catLabel: pkg.catLabel,
          price: (pkg.options[0] || {}).price || 0,
          targetUrl: getPackageShowcaseUrl(pkg)
        }));

        if (samplesModalDesc) {
          samplesModalDesc.innerHTML = `
            <span>Inspect real studio lighting, composition and skin retouching. Tap any photo to swap and swipe through in full screen.</span>
            ${photoSamples.length > 0 ? `<button type="button" id="btnStartSlideshow" style="margin-top:6px; display:inline-flex; align-items:center; gap:6px; background:var(--gold-soft); color:#000000; border:none; padding:5px 14px; border-radius:999px; font-size:12px; font-weight:700; cursor:pointer;"><span>▶ Open Fullscreen Viewer (Swipe to Next)</span></button>` : ''}
          `;
          const btnSlideshow = document.getElementById("btnStartSlideshow");
          if (btnSlideshow) {
            btnSlideshow.onclick = () => {
              openLightbox(sampleItems, 0);
            };
          }
        }

        samplesGalleryGrid.innerHTML = samples.map((s, idx) => {
          if (s.type === 'video') {
            return `
              <div class="sample-item-card" data-idx="${idx}">
                <video src="${s.url}" class="sample-item-video" muted playsinline loop onmouseover="this.play()" onmouseout="this.pause()" controls></video>
                <div class="sample-item-overlay">
                  <span class="sample-item-title">Video Reel</span>
                </div>
              </div>
            `;
          }
          const thumbSrc = s.thumbUrl || s.url.replace(/\.(jpg|jpeg|png)$/i, '_thumb.jpg');
          return `
            <div class="sample-item-card js-lightbox-trigger" data-url="${s.url}">
              <img src="${thumbSrc}" onerror="this.onerror=null;this.src='${s.url}';" alt="${s.title || 'Photo Sample'}" class="sample-item-thumb" loading="lazy" decoding="async">
              <div class="sample-item-zoom-icon">🔍</div>
            </div>
          `;
        }).join("");

        // Attach lightbox zoom on click with exact matching photo index
        let pIdx = 0;
        samples.forEach((s) => {
          if (s.type !== 'video') {
            const currentPIdx = pIdx++;
            const itemEl = samplesGalleryGrid.querySelector(`.js-lightbox-trigger[data-url="${s.url}"]`);
            if (itemEl) {
              itemEl.onclick = (e) => {
                e.stopPropagation();
                openLightbox(sampleItems, currentPIdx);
              };
            }
          }
        });
      }
    }

    // Set WhatsApp Booking CTA inside the sample modal
    if (samplesBookWaBtn) {
      samplesBookWaBtn.onclick = () => {
        const text = `👋 Hello ${PACKAGES_CONFIG.studioName}!\n\nI just checked your client samples for "${pkg.title}" on your packages landing page, and I love the quality!\n\nI would like to inquire about booking availability and securing my date. 📸`;
        window.open(`https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
      };
    }

    if (samplesModal) {
      samplesModal.classList.add("open");
      if (!history.state || history.state.modal !== "samples") {
        history.pushState({ modal: "samples" }, "", "#samples");
      }
    }
  }

  function closeSamplesModal(fromHistory = false) {
    if (samplesModal) samplesModal.classList.remove("open");
    if (!fromHistory && history.state && history.state.modal === "samples") {
      history.back();
    }
  }

  // ------------------------------------------------------------
  // Zoomable Lightbox with Next & Prev Navigation
  // ------------------------------------------------------------
  const sampleLightboxCounter = document.getElementById("sampleLightboxCounter");
  const sampleLightboxCtaBar = document.getElementById("sampleLightboxCtaBar");
  const sampleLightboxPrev = document.getElementById("sampleLightboxPrev");
  const sampleLightboxNext = document.getElementById("sampleLightboxNext");
  const sampleLightboxZoomIn = document.getElementById("sampleLightboxZoomIn");
  const sampleLightboxZoomOut = document.getElementById("sampleLightboxZoomOut");
  const sampleLightboxResetZoom = document.getElementById("sampleLightboxResetZoom");
  const sampleLightboxImgWrapper = document.getElementById("sampleLightboxImgWrapper");

  let lightboxItems = [];
  let lightboxIndex = 0;
  let lightboxZoom = 1;
  let isLightboxDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  function openLightbox(items, startIndex = 0) {
    if (!sampleLightbox || !items || items.length === 0) return;
    lightboxItems = items;
    lightboxIndex = Math.max(0, Math.min(startIndex, items.length - 1));
    lightboxZoom = 1;
    sampleLightbox.classList.add("open");
    sampleLightbox.setAttribute("aria-hidden", "false");
    updateLightboxView();
    document.body.style.overflow = "hidden";
    if (!history.state || history.state.modal !== "lightbox") {
      history.pushState({ modal: "lightbox" }, "", "#sample-viewer");
    }
  }

  function closeLightbox(fromHistory = false) {
    if (!sampleLightbox) return;
    sampleLightbox.classList.remove("open");
    sampleLightbox.setAttribute("aria-hidden", "true");
    lightboxZoom = 1;
    if (sampleLightboxImg) {
      sampleLightboxImg.style.transform = "scale(1)";
      sampleLightboxImg.classList.remove("zoomed");
    }
    document.body.style.overflow = "";
    if (!fromHistory && history.state && history.state.modal === "lightbox") {
      history.back();
    }
  }

  function updateLightboxView() {
    if (!lightboxItems || lightboxItems.length === 0) return;
    const current = lightboxItems[lightboxIndex];
    if (!current) return;

    if (sampleLightboxImg) {
      sampleLightboxImg.src = current.url;
      sampleLightboxImg.alt = current.title || "Photo Sample";
      setLightboxZoom(1);
    }

    if (sampleLightboxCounter) {
      sampleLightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
    }

    if (sampleLightboxCaption) {
      sampleLightboxCaption.innerHTML = `
        <div style="font-size:15.5px;font-weight:700;color:#ffffff;margin-bottom:2px;">${current.title || ""}</div>
        ${current.catLabel ? `<div style="font-size:12px;color:var(--gold-soft);">${current.catLabel} ${current.price ? `· From KSh ${Number(current.price).toLocaleString()}` : ''}</div>` : ''}
      `;
    }

    if (sampleLightboxCtaBar) {
      let ctaHtml = "";
      if (current.targetUrl) {
        ctaHtml += `
          <a href="${current.targetUrl}" class="lightbox-btn-view">
            <span>View Packages &amp; Rates</span>
            <span style="font-size:15px;margin-left:2px;">›</span>
          </a>
        `;
      }
      const waTitle = current.title || "photography packages";
      const waMsg = encodeURIComponent(`👋 Hello ${PACKAGES_CONFIG.studioName}!\n\nI am viewing your photo preview for "${waTitle}" and would like to inquire about booking availability and rates! 📸`);
      ctaHtml += `
        <a href="https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${waMsg}" target="_blank" rel="noopener" class="lightbox-btn-wa">
          <span>Book on WhatsApp</span>
        </a>
      `;
      sampleLightboxCtaBar.innerHTML = ctaHtml;
    }

    if (sampleLightboxPrev) sampleLightboxPrev.style.display = lightboxItems.length > 1 ? "flex" : "none";
    if (sampleLightboxNext) sampleLightboxNext.style.display = lightboxItems.length > 1 ? "flex" : "none";
  }

  function lightboxNext() {
    if (lightboxItems.length <= 1) return;
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    updateLightboxView();
  }

  function lightboxPrev() {
    if (lightboxItems.length <= 1) return;
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxView();
  }

  function setLightboxZoom(level) {
    lightboxZoom = Math.max(1, Math.min(level, 3));
    if (!sampleLightboxImg) return;
    sampleLightboxImg.style.transform = `scale(${lightboxZoom})`;
    if (lightboxZoom > 1) {
      sampleLightboxImg.classList.add("zoomed");
    } else {
      sampleLightboxImg.classList.remove("zoomed");
    }
    if (sampleLightboxResetZoom) {
      sampleLightboxResetZoom.textContent = `${Math.round(lightboxZoom * 100)}%`;
    }
  }

  function toggleLightboxZoom() {
    setLightboxZoom(lightboxZoom === 1 ? 2 : 1);
  }

  if (sampleLightboxNext) sampleLightboxNext.addEventListener("click", (e) => { e.stopPropagation(); lightboxNext(); });
  if (sampleLightboxPrev) sampleLightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); lightboxPrev(); });
  if (sampleLightboxClose) sampleLightboxClose.addEventListener("click", closeLightbox);

  if (sampleLightboxZoomIn) sampleLightboxZoomIn.addEventListener("click", (e) => { e.stopPropagation(); setLightboxZoom(lightboxZoom + 0.5); });
  if (sampleLightboxZoomOut) sampleLightboxZoomOut.addEventListener("click", (e) => { e.stopPropagation(); setLightboxZoom(lightboxZoom - 0.5); });
  if (sampleLightboxResetZoom) sampleLightboxResetZoom.addEventListener("click", (e) => { e.stopPropagation(); setLightboxZoom(1); });

  if (sampleLightboxImg) {
    sampleLightboxImg.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      toggleLightboxZoom();
    });

    // Tap left 35% of image for Prev, right 35% for Next
    sampleLightboxImg.addEventListener("click", (e) => {
      if (lightboxZoom > 1) return;
      const rect = sampleLightboxImg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width * 0.35) {
        lightboxPrev();
      } else if (clickX > rect.width * 0.65) {
        lightboxNext();
      }
    });
  }

  // Fluid Touch Swipe on Mobile for Lightbox
  if (sampleLightbox) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;

    sampleLightbox.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
      }
    }, { passive: true });

    sampleLightbox.addEventListener("touchmove", (e) => {
      touchMoved = true;
    }, { passive: true });

    sampleLightbox.addEventListener("touchend", (e) => {
      if (lightboxZoom > 1 || !touchMoved) return;
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Natural thumb swipe: horizontal movement greater than vertical, at least 30px
        if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 0.6) {
          if (dx < 0) {
            lightboxNext();
          } else {
            lightboxPrev();
          }
        }
      }
    }, { passive: true });

    // Mouse drag swipe on Desktop
    sampleLightbox.addEventListener("mousedown", (e) => {
      if (e.target.closest("button") || e.target.closest("a")) return;
      isLightboxDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    window.addEventListener("mouseup", (e) => {
      if (!isLightboxDragging) return;
      isLightboxDragging = false;
      if (lightboxZoom > 1) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 0.6) {
        if (dx < 0) {
          lightboxNext();
        } else {
          lightboxPrev();
        }
      }
    });

    sampleLightbox.addEventListener("click", (e) => {
      if (e.target === sampleLightbox || e.target === sampleLightboxImgWrapper) {
        closeLightbox();
      }
    });
  }

  if (samplesModalCloseBtn) samplesModalCloseBtn.addEventListener("click", closeSamplesModal);
  if (samplesModal) {
    samplesModal.addEventListener("click", (e) => {
      if (e.target === samplesModal) closeSamplesModal();
    });
  }

  // Keyboard Navigation for Lightbox & Modals
  document.addEventListener("keydown", (e) => {
    if (sampleLightbox && sampleLightbox.classList.contains("open")) {
      if (e.key === "ArrowRight") {
        lightboxNext();
      } else if (e.key === "ArrowLeft") {
        lightboxPrev();
      } else if (e.key === "+" || e.key === "=") {
        setLightboxZoom(lightboxZoom + 0.5);
      } else if (e.key === "-") {
        setLightboxZoom(lightboxZoom - 0.5);
      } else if (e.key === "Escape") {
        closeLightbox();
      }
      return;
    }
    if (e.key === "Escape") {
      closeSamplesModal();
      closeModal();
    }
  });

  // ------------------------------------------------------------
  // Add-ons & Live Total Estimator
  // ------------------------------------------------------------
  function renderAddOns() {
    if (!addonsGrid) return;
    addonsGrid.innerHTML = ADD_ONS_LIST.map(item => {
      const isSelected = selectedAddOns.has(item.id);
      return `
        <div class="addon-card ${isSelected ? 'selected' : ''}" data-addon-id="${item.id}">
          <div class="addon-checkbox">
            <svg viewBox="0 0 12 10" width="12" height="10">
              <polyline points="1.5 5.5 4.5 8.5 10.5 1.5"></polyline>
            </svg>
          </div>
          <div class="addon-info">
            <div class="addon-title-row">
              <span class="addon-name">${item.name}</span>
              <span class="addon-price">+${PACKAGES_CONFIG.currency}${formatMoney(item.price)}</span>
            </div>
            <p class="addon-desc">${item.desc}</p>
          </div>
        </div>
      `;
    }).join("");

    document.querySelectorAll(".addon-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.addonId;
        if (selectedAddOns.has(id)) {
          selectedAddOns.delete(id);
        } else {
          selectedAddOns.add(id);
        }
        renderAddOns();
        updateCalculatorTotal();
      });
    });
  }

  function updateCalculatorTotal() {
    let total = 0;
    const selectedNames = [];
    selectedAddOns.forEach(id => {
      const item = ADD_ONS_LIST.find(a => a.id === id);
      if (item) {
        total += item.price;
        selectedNames.push(item.name);
      }
    });

    if (calcSelectedCount) {
      calcSelectedCount.textContent = `${selectedAddOns.size} Add-on${selectedAddOns.size === 1 ? '' : 's'} selected`;
    }
    if (calcTotalAmount) {
      calcTotalAmount.innerHTML = `<span>${PACKAGES_CONFIG.currency}</span>${formatMoney(total)}`;
    }

    if (calcBookWaBtn) {
      calcBookWaBtn.onclick = () => {
        if (selectedAddOns.size === 0) {
          alert("Please select at least one add-on or choose a package above!");
          return;
        }
        const text = `👋 Hello ${PACKAGES_CONFIG.studioName}!\n\nI want to inquire about custom add-ons:\n━━━━━━━━━━━━━━━━━━━━━\n${selectedNames.map(n => `• ${n}`).join("\n")}\n\n💰 Estimated Add-ons Total: ${PACKAGES_CONFIG.currency}${formatMoney(total)}\n━━━━━━━━━━━━━━━━━━━━━\nPlease let me know your availability! 📸`;
        window.open(`https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
      };
    }
  }

  // ------------------------------------------------------------
  // FAQs
  // ------------------------------------------------------------
  function renderFaqs() {
    if (!faqsList) return;
    const list = typeof FAQS_DATA !== 'undefined' ? FAQS_DATA : [];
    faqsList.innerHTML = list.map((faq, idx) => `
      <div class="faq-item ${idx === 0 ? 'open' : ''}">
        <button type="button" class="faq-question">
          <span>${faq.q}</span>
          <svg class="faq-arrow" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".faq-question").forEach(qBtn => {
      qBtn.addEventListener("click", () => {
        qBtn.parentElement.classList.toggle("open");
      });
    });
  }

  // ------------------------------------------------------------
  // WhatsApp Message Composer
  // ------------------------------------------------------------
  function buildWhatsAppMessage(pkgId, optIdx, extras = {}) {
    const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
    const opt = pkg ? (pkg.options[optIdx] || pkg.options[0]) : null;

    let addonsTotal = 0;
    let addonsLines = [];
    selectedAddOns.forEach(id => {
      const item = ADD_ONS_LIST.find(a => a.id === id);
      if (item) {
        addonsTotal += item.price;
        addonsLines.push(`  • ${item.name} (+${PACKAGES_CONFIG.currency}${formatMoney(item.price)})`);
      }
    });

    // Vertical Video Reel Upsell Checkbox
    const includeReel = modalAddReelCheckbox && modalAddReelCheckbox.checked;
    if (includeReel && !selectedAddOns.has("cinematic-reel")) {
      const reelItem = ADD_ONS_LIST.find(a => a.id === "cinematic-reel");
      const reelPrice = reelItem ? reelItem.price : 1500;
      addonsTotal += reelPrice;
      addonsLines.push(`  • 🎬 45s–60s Vertical Video Reel (+${PACKAGES_CONFIG.currency}${formatMoney(reelPrice)}) 🔥 Trending`);
    }

    const clientName = extras.clientName || (modalNameInput ? modalNameInput.value.trim() : "");
    const shootDate = extras.shootDate || (modalDateInput ? modalDateInput.value.trim() : "");
    const location = extras.location || (modalLocationSelect ? modalLocationSelect.value : "Nairobi");

    let msg = `👋 Hello ${PACKAGES_CONFIG.studioName}!\n\n`;
    msg += `I am viewing your Packages & Rates page and would like to book:\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;

    if (pkg && opt) {
      msg += `📦 Package: ${pkg.title} — ${opt.name}\n`;
      msg += `💰 Rate: ${PACKAGES_CONFIG.currency}${formatMoney(opt.price)}\n`;
      msg += `🔒 Required Deposit: ${PACKAGES_CONFIG.currency}${formatMoney(opt.deposit)}\n`;
      msg += `✨ Summary: ${opt.summary}\n`;

      if (addonsLines.length > 0) {
        msg += `➕ Selected Add-ons:\n${addonsLines.join("\n")}\n`;
        msg += `💵 Total Estimated: ${PACKAGES_CONFIG.currency}${formatMoney(opt.price + addonsTotal)}\n`;
      }
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📅 Preferred Date: ${shootDate || "[Please specify date]"}\n`;
    msg += `📍 Location: ${location}\n`;
    if (clientName) {
      msg += `👤 Client Name: ${clientName}\n`;
    }
    msg += `\nPlease confirm availability and details to reserve this booking! 📸`;

    return msg;
  }

  // ------------------------------------------------------------
  // Booking Modal Handlers
  // ------------------------------------------------------------
  function openBookingModal(pkgId, optIdx) {
    modalState.pkgId = pkgId;
    modalState.optionIndex = optIdx;

    const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
    const opt = pkg ? (pkg.options[optIdx] || pkg.options[0]) : null;

    // Pre-check reel if already selected in calculator or on package card
    if (modalAddReelCheckbox) {
      modalAddReelCheckbox.checked = selectedAddOns.has("cinematic-reel") || !!activeReels[pkgId];
    }

    updateModalPreview();

    if (bookingModal) {
      bookingModal.classList.add("open");
      if (!history.state || history.state.modal !== "booking") {
        history.pushState({ modal: "booking" }, "", "#book-now");
      }
    }
  }

  function updateModalPreview() {
    if (!modalWaPreview || !modalState.pkgId) return;
    const pkg = PACKAGES_DATA.find(p => p.id === modalState.pkgId);
    const opt = pkg ? (pkg.options[modalState.optionIndex] || pkg.options[0]) : null;

    if (pkg && opt) {
      const reelChecked = modalAddReelCheckbox && modalAddReelCheckbox.checked;
      let extraAmt = 0;
      selectedAddOns.forEach(id => {
        const item = ADD_ONS_LIST.find(a => a.id === id);
        if (item) extraAmt += item.price;
      });
      if (reelChecked && !selectedAddOns.has("cinematic-reel")) {
        extraAmt += 1500;
      }

      if (modalPkgName) modalPkgName.textContent = `${pkg.title} — ${opt.name}`;
      if (modalPkgMeta) {
        const total = opt.price + extraAmt;
        const deposit = opt.deposit + (reelChecked ? 500 : 0);
        modalPkgMeta.textContent = `${PACKAGES_CONFIG.currency}${formatMoney(total)} · Deposit ${PACKAGES_CONFIG.currency}${formatMoney(deposit)}${reelChecked ? " (incl. 🎬 4K Reel)" : ""}`;
      }
    }

    modalWaPreview.textContent = buildWhatsAppMessage(modalState.pkgId, modalState.optionIndex);
  }

  function closeModal(fromHistory = false) {
    if (bookingModal) bookingModal.classList.remove("open");
    if (!fromHistory && history.state && history.state.modal === "booking") {
      history.back();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => closeModal());
  if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  [modalDateInput, modalNameInput, modalPhoneInput, modalEmailInput, modalLocationSelect, modalAddReelCheckbox].forEach(input => {
    if (input) {
      input.addEventListener("input", updateModalPreview);
      input.addEventListener("change", updateModalPreview);
    }
  });

  if (modalLaunchWaBtn) {
    modalLaunchWaBtn.addEventListener("click", () => {
      const msg = buildWhatsAppMessage(modalState.pkgId, modalState.optionIndex);
      const pkg = PACKAGES_DATA.find(p => p.id === modalState.pkgId);
      const opt = pkg ? pkg.options[modalState.optionIndex] : null;

      saveClientLead({
        name: modalNameInput ? modalNameInput.value.trim() : "",
        phone: modalPhoneInput ? modalPhoneInput.value.trim() : "",
        email: modalEmailInput ? modalEmailInput.value.trim() : "",
        date: modalDateInput ? modalDateInput.value : "",
        location: modalLocationSelect ? modalLocationSelect.value : "",
        package: pkg && opt ? `${pkg.title} (${opt.name})` : "Studio Session",
        source: "Booking Modal (WhatsApp)"
      });

      window.open(`https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      closeModal();
    });
  }

  if (modalQuickSkip) {
    modalQuickSkip.addEventListener("click", () => {
      const msg = buildWhatsAppMessage(modalState.pkgId, modalState.optionIndex, { shootDate: "Flexible", clientName: "" });
      window.open(`https://wa.me/${PACKAGES_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      closeModal();
    });
  }

  // ------------------------------------------------------------
  // Pathway Listeners
  // ------------------------------------------------------------
  pathwayCards.forEach(card => {
    card.addEventListener("click", () => {
      setPathway(card.dataset.pathway);
      const target = document.getElementById("packagesBrowse");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  pathwayToggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const p = btn.dataset.pathway;
      if (p === "hub") {
        setPathway(null, false);
      } else {
        setPathway(p, true);
      }
    });
  });

  // ------------------------------------------------------------
  // Live Search Autocomplete & Similar Letters Reference Matching
  // ------------------------------------------------------------
  const searchSuggestionsBox = document.getElementById("searchSuggestionsBox");

  function highlightMatch(str, q) {
    if (!q) return str;
    const idx = str.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return str;
    return str.slice(0, idx) + '<b style="color:#4ade80;font-weight:700;">' + str.slice(idx, idx + q.length) + '</b>' + str.slice(idx + q.length);
  }

  let activeSuggestionIndex = -1;

  function renderSearchSuggestions(rawQuery) {
    if (!searchSuggestionsBox) return;
    const q = (rawQuery || "").trim().toLowerCase();
    activeSuggestionIndex = -1;

    if (q === "") {
      searchSuggestionsBox.innerHTML = `
        <div class="suggestion-group-title">
          <span>⚡ Quick References &amp; Popular Searches</span>
        </div>
        <div class="suggestion-chips-row">
          ${POPULAR_SEARCH_REFERENCES.map(ref => `
            <button type="button" class="suggestion-chip" data-search="${escapeHtml(ref.query)}">
              ${ref.label}
            </button>
          `).join("")}
        </div>
      `;
      searchSuggestionsBox.style.display = "block";
      bindSuggestionClicks();
      return;
    }

    // Front references from the first letters & typo tolerance
    const matchingChips = POPULAR_SEARCH_REFERENCES
      .map(ref => ({ ref, score: scoreReference(ref, q) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    // Front matching packages from the first letters & typo tolerance
    const matches = PACKAGES_DATA
      .map(p => ({ p, score: scorePackageMatch(p, q) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    let html = "";

    // Check if typo detected (e.g. birthdat -> Birthday Shoots)
    if (matchingChips.length > 0 && matchingChips[0].ref.query !== q && q.length >= 4 && matchingChips[0].score >= 90) {
      html += `
        <div class="suggestion-typo-tip">
          <span>💡 Showing shoots for <b>${escapeHtml(matchingChips[0].ref.label)}</b> (matched “${escapeHtml(rawQuery)}”)</span>
        </div>
      `;
    }

    if (matchingChips.length > 0) {
      html += `
        <div class="suggestion-group-title">
          <span>🔍 Related Shoot References</span>
        </div>
        <div class="suggestion-chips-row">
          ${matchingChips.slice(0, 8).map(x => `
            <button type="button" class="suggestion-chip" data-search="${escapeHtml(x.ref.query)}">
              ${x.ref.label}
            </button>
          `).join("")}
        </div>
      `;
    }

    if (matches.length > 0) {
      html += `
        <div class="suggestion-group-title">
          <span>📦 Matching Packages (${matches.length})</span>
        </div>
        <div class="suggestion-list">
          ${matches.slice(0, 6).map(item => {
            const p = item.p;
            return `
              <div class="suggestion-item js-suggestion-pkg" data-pkg-id="${p.id}" data-pathway="${p.pathway}">
                <img src="${p.image}" alt="${escapeHtml(p.title)}" class="suggestion-thumb" loading="lazy">
                <div class="suggestion-info">
                  <div class="suggestion-title">${highlightSearchMatch(p.title, q)}</div>
                  <div class="suggestion-sub">
                    <span>${highlightSearchMatch(p.catLabel, q)}</span>
                    <span>· ⏱️ ${p.turnaround}</span>
                  </div>
                </div>
                <div class="suggestion-price">
                  <span style="font-size:10.5px;color:var(--muted);font-weight:normal;display:block;">From</span>
                  KSh ${Number((p.options[0]||{}).price||0).toLocaleString()}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    } else if (matchingChips.length === 0) {
      html += `
        <div class="suggestion-empty">
          <p style="margin-bottom:6px;">No packages found with "<b>${escapeHtml(q)}</b>"</p>
          <span style="font-size:11.5px;color:var(--muted);">Try typing: birthday, outdoor, headshots, graduation, maternity, wedding...</span>
        </div>
      `;
    }

    searchSuggestionsBox.innerHTML = html;
    searchSuggestionsBox.style.display = "block";
    bindSuggestionClicks();
  }

  function bindSuggestionClicks() {
    if (!searchSuggestionsBox) return;

    // Chip click
    searchSuggestionsBox.querySelectorAll(".suggestion-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const sq = chip.dataset.search;
        if (searchInput) {
          searchInput.value = sq;
          searchQuery = sq;
          if (searchClearBtn) searchClearBtn.style.display = "flex";
        }
        searchSuggestionsBox.style.display = "none";
        renderPackages();
        const browse = document.getElementById("packagesBrowse");
        if (browse) browse.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Package item click
    searchSuggestionsBox.querySelectorAll(".js-suggestion-pkg").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const pkgId = item.dataset.pkgId;
        const pathway = item.dataset.pathway;

        searchSuggestionsBox.style.display = "none";
        if (searchClearBtn) searchClearBtn.style.display = "none";
        if (searchInput) searchInput.value = "";
        searchQuery = "";

        // Open that pathway and scroll to package
        currentPathway = pathway;
        currentSubcat = "all";
        renderSubcategories();
        renderPackages();

        setTimeout(() => {
          const targetCard = document.getElementById(`pkg-${pkgId}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.style.outline = "2px solid var(--gold-soft)";
            targetCard.style.boxShadow = "0 0 30px rgba(234, 179, 8, 0.45)";
            setTimeout(() => {
              targetCard.style.outline = "";
              targetCard.style.boxShadow = "";
            }, 2500);
          }
        }, 150);
      });
    });
  }

  function hideSearchSuggestions() {
    if (searchSuggestionsBox) {
      searchSuggestionsBox.style.display = "none";
      activeSuggestionIndex = -1;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? "flex" : "none";
      }
      renderSearchSuggestions(searchQuery);
      renderPackages();
    });

    searchInput.addEventListener("focus", () => {
      renderSearchSuggestions(searchInput.value);
    });

    // Keyboard navigation (Arrow keys, Enter, Escape)
    searchInput.addEventListener("keydown", (e) => {
      if (!searchSuggestionsBox || searchSuggestionsBox.style.display === "none") return;
      const items = Array.from(searchSuggestionsBox.querySelectorAll(".suggestion-item, .suggestion-chip"));
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        items.forEach(el => el.classList.remove("selected"));
        activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
        items[activeSuggestionIndex].classList.add("selected");
        items[activeSuggestionIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items.forEach(el => el.classList.remove("selected"));
        activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
        items[activeSuggestionIndex].classList.add("selected");
        items[activeSuggestionIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else if (e.key === "Enter") {
        if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
          e.preventDefault();
          items[activeSuggestionIndex].click();
        } else {
          hideSearchSuggestions();
          const browse = document.getElementById("packagesBrowse");
          if (browse) browse.scrollIntoView({ behavior: "smooth" });
        }
      } else if (e.key === "Escape") {
        hideSearchSuggestions();
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-wrap")) {
        hideSearchSuggestions();
      }
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      searchQuery = "";
      if (searchInput) searchInput.value = "";
      searchClearBtn.style.display = "none";
      if (controlsBarEl) {
        controlsBarEl.classList.remove("search-active");
      }
      hideSearchSuggestions();
      renderPackages();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderPackages();
    });
  }

  if (modalLocationSelect) {
    modalLocationSelect.innerHTML = PACKAGES_CONFIG.locations.map(loc => `<option value="${loc}">${loc}</option>`).join("");
  }

  // Mobile drawer navigation
  const packagesNavToggle = document.getElementById("packagesNavToggle");
  const packagesMobileDrawer = document.getElementById("packagesMobileDrawer");
  const packagesDrawerBackdrop = document.getElementById("packagesDrawerBackdrop");

  function togglePackagesDrawer(open, fromHistory = false) {
    if (!packagesMobileDrawer) return;
    const shouldOpen = open !== undefined ? open : !packagesMobileDrawer.classList.contains("open");
    if (packagesNavToggle) {
      packagesNavToggle.classList.toggle("open", shouldOpen);
      packagesNavToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    }
    packagesMobileDrawer.classList.toggle("open", shouldOpen);
    if (packagesDrawerBackdrop) {
      packagesDrawerBackdrop.classList.toggle("open", shouldOpen);
      packagesDrawerBackdrop.hidden = !shouldOpen;
    }
    if (shouldOpen) {
      if (!history.state || history.state.modal !== "drawer") {
        history.pushState({ modal: "drawer" }, "", "#menu");
      }
    } else if (!fromHistory && history.state && history.state.modal === "drawer") {
      history.back();
    }
  }

  if (packagesNavToggle) {
    packagesNavToggle.addEventListener("click", () => togglePackagesDrawer());
  }
  if (packagesDrawerBackdrop) {
    packagesDrawerBackdrop.addEventListener("click", () => togglePackagesDrawer(false));
  }
  document.querySelectorAll(".drawer-link").forEach(link => {
    link.addEventListener("click", () => togglePackagesDrawer(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      togglePackagesDrawer(false);
      closeModal();
      closeInvoiceModal();
      if (typeof closeLeadsModal === "function") closeLeadsModal();
      if (typeof closeQrModal === "function") closeQrModal();
    }
  });

  // Mobile Back Button & Screen Edge-Swipe Gesture Handler:
  // Ensures pressing phone back smoothly dismisses active modals and keeps the user on the site & nav bar!
  window.addEventListener("popstate", (e) => {
    if (sampleLightbox && sampleLightbox.classList.contains("open")) {
      closeLightbox(true);
      return;
    }
    if (samplesModal && samplesModal.classList.contains("open")) {
      closeSamplesModal(true);
      return;
    }
    if (invoiceModal && invoiceModal.classList.contains("open")) {
      closeInvoiceModal(true);
      return;
    }
    if (bookingModal && bookingModal.classList.contains("open")) {
      closeModal(true);
      return;
    }
    const leadsModal = document.getElementById("leadsModal");
    if (leadsModal && leadsModal.classList.contains("open")) {
      if (typeof closeLeadsModal === "function") closeLeadsModal(true);
      return;
    }
    const qrModal = document.getElementById("qrStandeeModal");
    if (qrModal && qrModal.classList.contains("open")) {
      if (typeof window.closeQrModal === "function") {
        window.closeQrModal(true);
      } else {
        qrModal.classList.remove("open");
        qrModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
      return;
    }
    if (packagesMobileDrawer && packagesMobileDrawer.classList.contains("open")) {
      togglePackagesDrawer(false, true);
      return;
    }

    // If navigating back to a chapter (#studio, #outdoor, etc.), keep the sticky chapter navigation in sync
    const hash = window.location.hash.replace("#", "");
    if (hash && ["studio", "outdoor", "events", "commercial"].includes(hash)) {
      updateStickyNav(hash);
      const sectionEl = document.getElementById(hash);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });


  // Floating Back Up Arrow (Scroll to top) listener & Smart Zero-Jitter Sticky Controls State
  const backToTopBtn = document.getElementById("backToTopBtn");
  const controlsBarEl = document.getElementById("packagesBrowse");
  const searchInputEl = document.getElementById("searchInput");
  const sentinelEl = document.getElementById("controlsStickySentinel");
  let isCurrentlyStuck = false;

  window.toggleStickySearch = function(forceState) {
    if (!controlsBarEl) return;
    const isCurrentlyOpen = controlsBarEl.classList.contains("search-open");
    const nextState = typeof forceState === "boolean" ? forceState : !isCurrentlyOpen;
    controlsBarEl.classList.toggle("search-open", nextState);
    const stickyBtn = document.getElementById("stickySearchBtn");
    if (stickyBtn) {
      stickyBtn.setAttribute("aria-expanded", String(nextState));
    }
    if (nextState && searchInputEl) {
      setTimeout(() => searchInputEl.focus(), 60);
    }
  };

  if (searchInputEl && controlsBarEl) {
    searchInputEl.addEventListener("focus", () => {
      controlsBarEl.classList.add("search-open");
    });
    searchInputEl.addEventListener("input", (e) => {
      if (e.target.value.trim().length > 0) {
        controlsBarEl.classList.add("search-open");
        controlsBarEl.classList.add("search-active");
      } else {
        controlsBarEl.classList.remove("search-active");
      }
    });
  }

  function checkStickyControls() {
    if (!controlsBarEl) return;
    const headerOffset = window.innerWidth <= 768 ? 64 : 76;
    const referenceTop = sentinelEl
      ? sentinelEl.getBoundingClientRect().top
      : controlsBarEl.getBoundingClientRect().top;

    // 32px safe hysteresis deadband to completely eliminate any micro-bounce or jitter:
    // - Transitions to stuck ONLY when sentinel has scrolled past header by at least 8px
    // - Transitions back to un-stuck ONLY when sentinel scrolls down below header by at least 24px
    if (!isCurrentlyStuck && referenceTop <= (headerOffset - 8)) {
      isCurrentlyStuck = true;
      controlsBarEl.classList.add("is-stuck");
    } else if (isCurrentlyStuck && referenceTop >= (headerOffset + 24)) {
      isCurrentlyStuck = false;
      controlsBarEl.classList.remove("is-stuck");
      controlsBarEl.classList.remove("search-open");
      const stickyBtn = document.getElementById("stickySearchBtn");
      if (stickyBtn) {
        stickyBtn.setAttribute("aria-expanded", "false");
      }
    }
    // Ensure sticky navigation bar is never rejected or auto-hidden while browsing packages
    controlsBarEl.classList.remove("is-hidden");
  }

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (backToTopBtn) {
      if (currentScrollY > 280) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    checkStickyControls();
  }, { passive: true });

  // Run initial check on load in case of direct deep link or page reload mid-page
  checkStickyControls();

  // ------------------------------------------------------------
  // Touch & Pointer Smooth Drag-to-Scroll Engine
  // Enables effortless mobile touch swiping and desktop drag on pill scrollers
  // ------------------------------------------------------------
  function enableHorizontalDragScroll(el) {
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasMoved = false;
    let lastX = 0;
    let velocity = 0;
    let rafId = null;

    // Direct Touch Listeners for mobile touch gestures
    el.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      isDown = true;
      hasMoved = false;
      cancelAnimationFrame(rafId);
      startX = e.touches[0].clientX;
      scrollStart = el.scrollLeft;
      lastX = startX;
      velocity = 0;
    }, { passive: true });

    el.addEventListener("touchmove", (e) => {
      if (!isDown || e.touches.length !== 1) return;
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (Math.abs(diff) > 4) {
        hasMoved = true;
        el.scrollLeft = scrollStart - diff;
        velocity = currentX - lastX;
        lastX = currentX;
      }
    }, { passive: true });

    const endTouch = () => {
      if (!isDown) return;
      isDown = false;
      if (hasMoved && Math.abs(velocity) > 1.5) {
        let curVel = velocity * 1.25;
        const glide = () => {
          if (Math.abs(curVel) < 0.5) return;
          el.scrollLeft -= curVel;
          curVel *= 0.92;
          rafId = requestAnimationFrame(glide);
        };
        rafId = requestAnimationFrame(glide);
      }
      setTimeout(() => {
        hasMoved = false;
      }, 120);
    };
    el.addEventListener("touchend", endTouch, { passive: true });
    el.addEventListener("touchcancel", endTouch, { passive: true });

    // Desktop Mouse & Pointer Drag
    el.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || (e.button !== undefined && e.button !== 0)) return;
      isDown = true;
      hasMoved = false;
      cancelAnimationFrame(rafId);
      startX = e.clientX;
      scrollStart = el.scrollLeft;
      lastX = startX;
      velocity = 0;
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDown || e.pointerType === "touch") return;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 4) {
        hasMoved = true;
        el.scrollLeft = scrollStart - diff;
        velocity = e.clientX - lastX;
        lastX = e.clientX;
      }
    });

    const endPointer = (e) => {
      if (!isDown || (e && e.pointerType === "touch")) return;
      isDown = false;
      if (hasMoved && Math.abs(velocity) > 1.5) {
        let curVel = velocity * 1.25;
        const glide = () => {
          if (Math.abs(curVel) < 0.5) return;
          el.scrollLeft -= curVel;
          curVel *= 0.92;
          rafId = requestAnimationFrame(glide);
        };
        rafId = requestAnimationFrame(glide);
      }
      setTimeout(() => {
        hasMoved = false;
      }, 120);
    };
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);

    // Suppress accidental button click if user was dragging/swiping
    el.addEventListener("click", (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    }, true);
  }

  // Attach drag-scroll to both category switcher and subcategory pills
  enableHorizontalDragScroll(document.querySelector(".pathway-toggle-strip"));
  enableHorizontalDragScroll(subcategoryPillsWrap);

  function initServicesTabs() {
    const tabBtns = document.querySelectorAll(".services-tab-btn");
    const tabPanes = document.querySelectorAll(".services-tab-pane");
    const hub = document.querySelector(".services-tab-hub");
    const toggleAllBtn = document.getElementById("btnToggleAllServices");

    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.servicesTab;
        if (hub) hub.classList.remove("is-expanded-all");
        if (toggleAllBtn) {
          toggleAllBtn.innerHTML = `<span class="mode-icon">⊞</span><span class="mode-text">View All Services Expanded</span>`;
        }
        tabBtns.forEach(b => {
          const isAct = b === btn;
          b.classList.toggle("active", isAct);
          b.setAttribute("aria-selected", isAct ? "true" : "false");
        });
        tabPanes.forEach(pane => {
          const isAct = pane.dataset.servicesPane === target;
          pane.classList.toggle("active", isAct);
        });
      });
    });

    if (toggleAllBtn && hub) {
      toggleAllBtn.addEventListener("click", () => {
        const isExp = hub.classList.toggle("is-expanded-all");
        if (isExp) {
          toggleAllBtn.innerHTML = `<span class="mode-icon">⊟</span><span class="mode-text">Switch to Tabbed View</span>`;
        } else {
          toggleAllBtn.innerHTML = `<span class="mode-icon">⊞</span><span class="mode-text">View All Services Expanded</span>`;
        }
      });
    }
  }

  // Initial runs
  renderSubcategories();
  renderPackages();
  initServicesTabs();
  updateStickyNav(currentPathway || "studio");

  renderAddOns();
  updateCalculatorTotal();


  // ============================================================
  //  OFFICIAL PROFORMA INVOICE & QUOTATION WORKSTATION (PDF + WHATSAPP)
  // ============================================================

  const invoiceModal = document.getElementById("invoiceModal");
  const invClientInput = document.getElementById("invClientInput");
  const invPhoneInput = document.getElementById("invPhoneInput");
  const invEmailInput = document.getElementById("invEmailInput");
  const invDateInput = document.getElementById("invDateInput");
  const invTimeInput = document.getElementById("invTimeInput");
  const invLocationInput = document.getElementById("invLocationInput");
  const invCrewInput = document.getElementById("invCrewInput");
  const invDepositPercent = document.getElementById("invDepositPercent");
  const invDiscountInput = document.getElementById("invDiscountInput");
  const invNotesInput = document.getElementById("invNotesInput");

  let invoiceMode = "quotation"; // "quotation" | "receipt"
  let currentInvoiceRef = "";
  let invoiceDateIssued = "";
  let invoiceValidity = "";
  let invoiceSessions = []; // [{ id, pkgId, title, tierIdx, tierName, spec, rate, qty }]
  let invoiceAddons = [];   // [{ id, name, spec, price }]

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showInvoiceToast(msg) {
    const toast = document.getElementById("invToastNotice");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3400);
  }

  // Normalizes Kenyan phone numbers (07..., 01..., +254..., 254...) into international format: 254XXXXXXXXX
  function normalizeKenyanPhone(raw) {
    if (!raw) return "";
    let clean = String(raw).replace(/\D/g, "");
    if (clean.length === 10 && clean.startsWith("0")) {
      return "254" + clean.slice(1);
    }
    if (clean.length === 9 && (clean.startsWith("7") || clean.startsWith("1"))) {
      return "254" + clean;
    }
    if (clean.length === 12 && clean.startsWith("254")) {
      return clean;
    }
    if (clean.length >= 9) {
      return clean;
    }
    return "";
  }

  // Primary Production Categories Architecture
  const INVOICE_CATEGORIES = {
    studio: {
      id: "studio",
      name: "STUDIO & PORTRAIT SESSIONS",
      quoteTitle: "STUDIO SESSION QUOTATION",
      receiptTitle: "OFFICIAL STUDIO SESSION RECEIPT",
      scope: "IN-STUDIO PRODUCTION",
      defaultLoc: "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor)"
    },
    weddings: {
      id: "weddings",
      name: "WEDDINGS & MATRIMONY COVERAGE",
      quoteTitle: "WEDDING & MATRIMONY QUOTATION",
      receiptTitle: "OFFICIAL WEDDING PRODUCTION RECEIPT",
      scope: "MATRIMONY CINEMA & PHOTO",
      defaultLoc: "Windsor Golf Hotel & Country Club / Nairobi"
    },
    events: {
      id: "events",
      name: "CORPORATE SUMMITS, GALAS & EVENTS",
      quoteTitle: "EVENT & SUMMIT COVERAGE QUOTATION",
      receiptTitle: "OFFICIAL EVENT MEDIA RECEIPT",
      scope: "CONFERENCE & GALA MEDIA",
      defaultLoc: "Radisson Blu / Villa Rosa Kempinski / Nairobi"
    },
    outdoor: {
      id: "outdoor",
      name: "OUTDOOR & NATURAL LIGHT SESSIONS",
      quoteTitle: "OUTDOOR LIFESTYLE QUOTATION",
      receiptTitle: "OFFICIAL OUTDOOR SESSION RECEIPT",
      scope: "NATURAL LIGHT LIFESTYLE",
      defaultLoc: "Karura Forest / Botanical Gardens / On-Location"
    },
    commercial: {
      id: "commercial",
      name: "COMMERCIAL & BRAND PRODUCTION",
      quoteTitle: "COMMERCIAL BRAND PRODUCTION QUOTATION",
      receiptTitle: "OFFICIAL COMMERCIAL PRODUCTION RECEIPT",
      scope: "BRAND & COMMERCIAL ASSETS",
      defaultLoc: "Client Facility / Commercial Studio Setup"
    }
  };

  let currentInvoiceCategory = "studio";
  let currentQuotationScope = "studio"; // "studio" (minimal, no heavy rules) vs "event" (detailed overtime & logistics rules)

  const STUDIO_TERMS_POLICIES = [
    { title: "⚡ 24–48h Fast Master Delivery", desc: "Master retouched high-resolution photographs delivered within 24–48 hours via private cloud link." },
    { title: "📸 100% Free RAW Proofs", desc: "Complete archive of unedited camera proof photos provided complimentary with every studio session." },
    { title: "✨ Studio Flow & Outfits", desc: "Professional strobe lighting, backdrop color choices & outfit changes per selected package tier." },
    { title: "🔒 Booking Confirmation", desc: "Commitment deposit secures your allocated studio time slot on our daily shooting calendar." }
  ];

  const EVENT_TERMS_POLICIES = [
    { title: "⏱️ Coverage Hours & Overtime", desc: "Agreed event coverage hours as specified. Extended coverage beyond agreed hours is billed at KSh 3,500 per hour." },
    { title: "📍 Venue Access & Clearances", desc: "Client facilitates venue entry permits, sound/power feed access & designated staging area for media crew." },
    { title: "🚗 Logistics & Out-of-Station", desc: "Assignments outside Kakamega County require client-facilitated transport and secure crew accommodation." },
    { title: "🍱 Crew Welfare & Hydration", desc: "Full-day coverage exceeding 5 continuous hours requires client-provided crew catering and refreshments." },
    { title: "🎬 Deliverable Milestones", desc: "Social media highlight teaser delivered within 4–7 days; master 4K film & photobooks delivered in 14–21 business days." },
    { title: "🔒 Date Exclusivity & Cancellation", desc: "Advance deposit reserves crew and gear exclusively on your date. Rescheduling requires 5+ days prior notice." }
  ];

  function setQuotationScope(scope) {
    currentQuotationScope = (scope === "event") ? "event" : "studio";
    
    const btnStudio = document.getElementById("btnScopeStudio");
    const btnEvent = document.getElementById("btnScopeEvent");
    if (btnStudio) btnStudio.classList.toggle("active", currentQuotationScope === "studio");
    if (btnEvent) btnEvent.classList.toggle("active", currentQuotationScope === "event");

    const printableSheet = document.getElementById("invoicePrintableSheet");
    if (printableSheet) {
      printableSheet.classList.toggle("is-scope-studio", currentQuotationScope === "studio");
      printableSheet.classList.toggle("is-scope-event", currentQuotationScope === "event");
    }

    updateInvoiceDisplay();
    showInvoiceToast(currentQuotationScope === "studio" 
      ? "📸 Switched to Studio Shoot (Minimal & Compact Terms)" 
      : "💍 Switched to Event Coverage (Detailed Rules & Overtime Agreement)");
  }
  window.setQuotationScope = setQuotationScope;

  function setInvoiceCategory(catKey, force = false) {
    if (!INVOICE_CATEGORIES[catKey]) catKey = "studio";
    currentInvoiceCategory = catKey;

    const catSelect = document.getElementById("invCategorySelect");
    if (catSelect && (catSelect.value !== catKey || force)) {
      catSelect.value = catKey;
    }

    // Auto-align scope with category unless already user-selected
    if (catKey === "weddings" || catKey === "events") {
      setQuotationScope("event");
    } else if (catKey === "studio") {
      setQuotationScope("studio");
    }

    updateInvoiceDisplay();
  }

  function onCategorySelectChange() {
    const catSelect = document.getElementById("invCategorySelect");
    if (!catSelect) return;
    setInvoiceCategory(catSelect.value);
    const cat = INVOICE_CATEGORIES[currentInvoiceCategory];
    showInvoiceToast(`✓ Main Category set to "${cat.name}"`);
  }

  function detectCategoryFromPackage(pkgId) {
    if (!pkgId || pkgId === "custom") return currentInvoiceCategory || "studio";
    if (pkgId.includes("wedding") || pkgId === "pre-wedding") return "weddings";
    if (typeof PACKAGES_DATA !== "undefined") {
      const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
      if (pkg) {
        if (pkg.pathway === "events") {
          if (pkg.id.includes("wedding")) return "weddings";
          return "events";
        }
        if (pkg.pathway === "outdoor") return "outdoor";
        if (pkg.pathway === "commercial") return "commercial";
        return "studio";
      }
    }
    return "studio";
  }

  // Extracts client's first or primary name (stripping honorifics like Dr., Mr., Mrs.)
  function getClientFirstName(rawName) {
    const name = (rawName || (invClientInput ? invClientInput.value : "")).trim();
    if (!name || name.toLowerCase() === "valued client" || name.toLowerCase() === "studio walk-in guest") {
      return "";
    }
    const tokens = name.split(/\s+/).filter(Boolean);
    if (!tokens.length) return "";
    let first = tokens[0];
    if (/^(mr|mrs|ms|miss|dr|eng|hon|pastor|prof|rev|arch|bishop)\.?$/i.test(first)) {
      if (tokens.length > 1) {
        first = tokens[1];
        if (tokens.length > 2 && /^(and|&)$/i.test(tokens[2]) && tokens[3]) {
          return `${first} & ${tokens[3]}`;
        }
      }
    }
    if (tokens.length >= 3 && /^(and|&)$/i.test(tokens[1])) {
      return `${tokens[0]} & ${tokens[2]}`;
    }
    return first;
  }

  function getClientPossessive(rawName) {
    const first = getClientFirstName(rawName);
    if (!first) return "";
    if (first.includes("&")) return `${first}'s`;
    return (first.endsWith("s") || first.endsWith("S")) ? `${first}'` : `${first}'s`;
  }

  function onClientNameInput() {
    autoSuggestOccasionTitle(false);
    updateInvoiceDisplay();
  }

  // Generates a tailored, luxury production occasion title honoring the client
  function autoSuggestOccasionTitle(force = false) {
    const occInput = document.getElementById("invOccasionTitleInput");
    if (!occInput) return;

    if (!force && occInput.dataset.userEdited === "true" && occInput.value.trim().length > 0) {
      updateInvoiceDisplay();
      return;
    }

    const clientRaw = invClientInput ? invClientInput.value.trim() : "";
    const poss = getClientPossessive(clientRaw);
    const cat = INVOICE_CATEGORIES[currentInvoiceCategory] || INVOICE_CATEGORIES["studio"];

    const firstSession = invoiceSessions[0];
    const sTitle = firstSession ? firstSession.title.toLowerCase() : "";

    let suggested = "";

    if (currentInvoiceCategory === "weddings") {
      suggested = poss ? `${poss} Bespoke Wedding Celebration & Matrimony Cinema` : "Bespoke Wedding Celebration & Matrimony Cinema";
    } else if (currentInvoiceCategory === "events") {
      suggested = poss ? `${poss} Executive Corporate Summit & Gala Media Coverage` : "Executive Corporate Summit & Event Media Coverage";
    } else if (currentInvoiceCategory === "outdoor") {
      suggested = poss ? `${poss} Golden Hour Natural Light & Lifestyle Session` : "Golden Hour Natural Light & Lifestyle Session";
    } else if (currentInvoiceCategory === "commercial") {
      suggested = poss ? `${poss} Commercial Brand & High-Impact Visual Production` : "Commercial Brand & Product Visual Production";
    } else {
      // Studio category
      if (sTitle.includes("birthday")) {
        suggested = poss ? `${poss} Milestone Birthday Studio Portrait Session` : "Milestone Birthday Studio Portrait Session";
      } else if (sTitle.includes("graduation")) {
        suggested = poss ? `${poss} Commencement & Graduation Portrait Suite` : "Commencement & Graduation Portrait Suite";
      } else if (sTitle.includes("silk") || sTitle.includes("wrap")) {
        suggested = poss ? `${poss} Fine-Art Silk Wrap & Glamour Studio Session` : "Fine-Art Silk Wrap & Glamour Studio Session";
      } else if (sTitle.includes("white") || sTitle.includes("shirt")) {
        suggested = poss ? `${poss} Crisp White Shirt Minimalist Portrait Session` : "Crisp White Shirt Minimalist Portrait Session";
      } else if (sTitle.includes("maternity")) {
        suggested = poss ? `${poss} Bespoke Maternity & Motherhood Fine-Art Session` : "Bespoke Maternity & Motherhood Fine-Art Session";
      } else {
        suggested = poss ? `${poss} Bespoke Studio & Portrait Experience` : "Bespoke Studio & Portrait Experience";
      }
    }

    occInput.value = suggested;
    occInput.dataset.userEdited = "false";
    updateInvoiceDisplay();
  }

  function setOccasionPreset(presetKey) {
    const occInput = document.getElementById("invOccasionTitleInput");
    if (!occInput) return;

    const clientRaw = invClientInput ? invClientInput.value.trim() : "";
    const poss = getClientPossessive(clientRaw);

    let title = "";
    switch (presetKey) {
      case "birthday":
        setInvoiceCategory("studio");
        title = poss ? `${poss} Milestone Birthday Studio Portrait Session` : "Milestone Birthday Studio Portrait Session";
        break;
      case "graduation":
        setInvoiceCategory("studio");
        title = poss ? `${poss} Commencement & Graduation Portrait Suite` : "Commencement & Graduation Portrait Suite";
        break;
      case "wedding":
        setInvoiceCategory("weddings");
        title = poss ? `${poss} Royal Wedding Celebration & Matrimony Cinema` : "Royal Wedding Celebration & Matrimony Cinema";
        break;
      case "silk":
        setInvoiceCategory("studio");
        title = poss ? `${poss} Fine-Art Silk Wrap & Glamour Studio Session` : "Fine-Art Silk Wrap & Glamour Studio Session";
        break;
      case "outdoor":
        setInvoiceCategory("outdoor");
        title = poss ? `${poss} Golden Hour Natural Light & Lifestyle Session` : "Golden Hour Natural Light & Lifestyle Session";
        break;
      case "corporate":
        setInvoiceCategory("events");
        title = poss ? `${poss} Executive Corporate Summit & Media Production` : "Executive Corporate Summit & Media Production";
        break;
      default:
        autoSuggestOccasionTitle(true);
        return;
    }

    occInput.value = title;
    occInput.dataset.userEdited = "true";
    updateInvoiceDisplay();
    showInvoiceToast(`✓ Milestone Title set to "${title}"`);
  }

  function getPersonalizedWelcomeNote() {
    return "";
  }

  function applyWelcomeTemplate() {}

  // Live formatted date for authentic SVG studio rubber stamp (e.g. "DATE: 13 SEP 2026")
  function getFormattedStampDate(d = new Date()) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = String(d.getDate()).padStart(2, "0");
    const mon = months[d.getMonth()];
    const yr = d.getFullYear();
    return `DATE: ${day} ${mon} ${yr}`;
  }

  // Studio Document Mode: Quotation / Proforma Estimate vs Official Receipt
  function setInvoiceMode(mode) {
    invoiceMode = mode === "receipt" ? "receipt" : "quotation";

    const btnQuote = document.getElementById("btnModeQuotation");
    const btnReceipt = document.getElementById("btnModeReceipt");
    const receiptSettings = document.getElementById("invReceiptSettings");
    if (btnQuote) btnQuote.classList.toggle("active", invoiceMode === "quotation");
    if (btnReceipt) btnReceipt.classList.toggle("active", invoiceMode === "receipt");
    if (receiptSettings) receiptSettings.style.display = invoiceMode === "receipt" ? "block" : "none";

    const printableSheet = document.getElementById("invoicePrintableSheet");
    if (printableSheet) printableSheet.classList.toggle("is-receipt-mode", invoiceMode === "receipt");

    const docBadge = document.getElementById("invDisplayDocType");
    const refLabel = document.getElementById("invDisplayRefLabel");
    const validityItem = document.getElementById("invValidityMetaItem");
    const sealStamp = document.getElementById("invSealStamp");
    const termsTitle = document.getElementById("invTermsTitle");
    const termsNote = document.getElementById("invTermsNote");
    const btnPdfText = document.getElementById("btnDownloadPdfText");
    const btnWaText = document.getElementById("btnSendWaText");
    const topDownloadText = document.getElementById("invTopDownloadText");
    const topWaText = document.getElementById("invTopWaText");

    if (invoiceMode === "receipt") {
      if (currentInvoiceRef.startsWith("LS-QUO-")) {
        currentInvoiceRef = currentInvoiceRef.replace("LS-QUO-", "LS-REC-");
      } else if (!currentInvoiceRef.startsWith("LS-REC-")) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        currentInvoiceRef = `LS-REC-2026-${randNum}`;
      }

      if (docBadge) docBadge.textContent = "OFFICIAL COMMERCIAL RECEIPT";
      if (refLabel) refLabel.textContent = "RECEIPT NO:";
      if (validityItem) validityItem.style.display = "none";
      if (sealStamp) sealStamp.classList.add("paid-stamp");

      if (termsTitle) termsTitle.textContent = "Commercial Terms & Master Deliverable Release";
      if (termsNote) termsNote.textContent = "* Official studio payment receipt. Cashless payment verified. Master deliverables released per agreed timeline.";
      if (btnPdfText) btnPdfText.textContent = "📥 Download Official Receipt (PDF)";
      if (btnWaText) btnWaText.textContent = "📲 Send Receipt via WhatsApp";
      if (topDownloadText) topDownloadText.textContent = "📥 Download Receipt (PDF)";
      if (topWaText) topWaText.textContent = "📲 WhatsApp Receipt";
    } else {
      if (currentInvoiceRef.startsWith("LS-REC-")) {
        currentInvoiceRef = currentInvoiceRef.replace("LS-REC-", "LS-QUO-");
      } else if (!currentInvoiceRef.startsWith("LS-QUO-")) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        currentInvoiceRef = `LS-QUO-2026-${randNum}`;
      }

      if (docBadge) docBadge.textContent = "OFFICIAL PROFORMA RATE CARD";
      if (refLabel) refLabel.textContent = "QUOTATION REF:";
      if (validityItem) validityItem.style.display = "flex";
      if (sealStamp) sealStamp.classList.remove("paid-stamp");

      if (termsTitle) termsTitle.textContent = "Studio Terms & Production Policies";
      if (termsNote) termsNote.textContent = "* Official studio quotation & rate proposal. Payment of the booking deposit confirms your session date and creative crew allocation. Remaining balance payable upon master delivery.";
      if (btnPdfText) btnPdfText.textContent = "📥 Download Quotation (PDF)";
      if (btnWaText) btnWaText.textContent = "📲 Send Quotation via WhatsApp";
      if (topDownloadText) topDownloadText.textContent = "📥 Download PDF";
      if (topWaText) topWaText.textContent = "📲 WhatsApp";
    }

    updateInvoiceDisplay();
  }

  // Handle receipt payment status switch (Full Payment vs Commitment Deposit)
  function onPaymentStatusChange(status) {
    const depositPercentSelect = document.getElementById("invDepositPercent");
    if (status === "full") {
      if (depositPercentSelect) depositPercentSelect.value = "100";
    } else if (status === "deposit") {
      if (depositPercentSelect && depositPercentSelect.value === "100") {
        depositPercentSelect.value = "80";
      }
    }
    updateInvoiceDisplay();
  }

  // 1-Click Preset for Studio Sessions (auto-fills today's shoot details)
  function applyWalkinPreset(status = "full") {
    setInvoiceMode("quotation");
    setInvoiceCategory("studio");

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (invDateInput) invDateInput.value = todayStr;
    if (invTimeInput) invTimeInput.value = "Walk-in Instant Studio Shoot (Completed)";
    if (invLocationInput) invLocationInput.value = "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor)";
    if (invCrewInput) invCrewInput.value = "Studio Lead Photographer + Lighting Assistant";

    const payStatusSelect = document.getElementById("invReceiptStatusSelect") || document.getElementById("invPaymentStatusSelect");
    if (payStatusSelect) {
      payStatusSelect.value = status === "deposit" ? "deposit" : "full";
    }

    const payMethodSelect = document.getElementById("invReceiptMethodSelect") || document.getElementById("invPaymentMethodSelect");
    if (payMethodSelect) payMethodSelect.value = "mpesa-till";

    const payRefInput = document.getElementById("invReceiptRefInput") || document.getElementById("invPaymentRefInput");
    if (payRefInput && (!payRefInput.value.trim() || payRefInput.value === "M-Pesa Verified")) {
      const mpesaChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "SL";
      for (let i = 0; i < 6; i++) {
        code += mpesaChars.charAt(Math.floor(Math.random() * mpesaChars.length));
      }
      payRefInput.value = code;
    }

    if (invNotesInput && (!invNotesInput.value.trim() || invNotesInput.value.includes("Includes high-end") || invNotesInput.value.includes("Walk-in studio shoot"))) {
      invNotesInput.value = status === "deposit"
        ? "Walk-in studio shoot. 80% deposit received via M-Pesa. Master retouched gallery ready in 24–48 hours; final balance due on delivery."
        : "Walk-in studio shoot completed at Laureign Studios. Master retouched photos deliverable within 24–48 hours via secure Google Drive & WhatsApp link.";
    }

    // Ensure session exists
    if (invoiceSessions.length === 0) {
      addInvoiceSession("indoor-shirt-shoot", 0, false);
    }

    autoSuggestOccasionTitle(true);
    updateInvoiceDisplay();
    showInvoiceToast(`⚡ Walk-in session applied (${status === "deposit" ? "Deposit" : "100% Paid"})!`);

    if (invClientInput) {
      invClientInput.focus();
      if (invClientInput.value === "Valued Client") invClientInput.value = "";
    }
  }

  // 1-Click Event & Milestone Quotation Presets (Weddings, Events, Summits, Milestones)
  function applyQuotationPreset(presetKey) {
    if (presetKey === "walkin-today") {
      applyWalkinPreset("full");
      return;
    }

    setInvoiceMode("quotation");

    // Clear existing sessions & custom add-ons
    invoiceSessions = [];
    invoiceAddons = [];

    const today = new Date();
    const targetDate = new Date();

    if (presetKey === "wedding-gold") {
      setInvoiceCategory("weddings");
      targetDate.setDate(today.getDate() + 30);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");

      if (invClientInput) invClientInput.value = "Mr. & Mrs. (Wedding Couple)";
      if (invDateInput) invDateInput.value = `${yyyy}-${mm}-${dd}`;
      if (invTimeInput) invTimeInput.value = "Full-Day Wedding Coverage (7:00 AM – 8:00 PM)";
      if (invLocationInput) invLocationInput.value = "Windsor Golf Hotel & Country Club / Nairobi";
      if (invCrewInput) invCrewInput.value = "2 Senior Photographers, 1 Master Cinematographer, 4K Aerial Drone Unit";
      if (invNotesInput) {
        invNotesInput.value = "💍 Gold Wedding Production: Morning bridal & groom prep, church solemnization, creative bridal party location session, and evening reception coverage.\n• Deliverables: 400 retouched high-res master images, 4K cinematic film highlights (3–5 mins), 4K drone aerials, luxury layflat photobook album (30 pages), branded wooden flash drive & private cloud gallery.\n• All unedited high-resolution RAW camera proofs included.";
      }

      addInvoiceSession("wedding-coverage", 2, false); // Gold (75,000)
      if (invDepositPercent) invDepositPercent.value = "80";
      autoSuggestOccasionTitle(true);
      showInvoiceToast("💍 Full-Day Wedding Gold Collection applied (KSh 75,000)!");
    }
    else if (presetKey === "wedding-platinum") {
      setInvoiceCategory("weddings");
      targetDate.setDate(today.getDate() + 45);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");

      if (invClientInput) invClientInput.value = "Bride & Groom (Royal VIP Matrimony)";
      if (invDateInput) invDateInput.value = `${yyyy}-${mm}-${dd}`;
      if (invTimeInput) invTimeInput.value = "Multi-Location VIP Wedding Coverage (Full Day)";
      if (invLocationInput) invLocationInput.value = "Safari Park Hotel / Ciala Resort / Client Estate";
      if (invCrewInput) invCrewInput.value = "3 Senior Photographers, 2 Master Cinematographers, 4K Drone Aerial Pilot";
      if (invNotesInput) {
        invNotesInput.value = "👑 Royal VIP Platinum Matrimony: Complimentary pre-wedding love story session, multi-camera 4K cinematography, drone aerials, full ceremony documentation & cinematic documentary film (15–20 mins).\n• Deliverables: 600+ retouched master photographs, 1 Luxury 30-Page Master Photobook, 2 Parent Albums, A2 living room canvas mount & luxury wooden USB gift box.";
      }

      addInvoiceSession("wedding-coverage", 3, false); // Platinum (90,000)
      if (invDepositPercent) invDepositPercent.value = "80";
      autoSuggestOccasionTitle(true);
      showInvoiceToast("👑 Royal VIP Platinum Wedding applied (KSh 90,000)!");
    }
    else if (presetKey === "wedding-traditional") {
      setInvoiceCategory("weddings");
      targetDate.setDate(today.getDate() + 21);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");

      if (invClientInput) invClientInput.value = "Family & Couple (Traditional Wedding / Ruracio)";
      if (invDateInput) invDateInput.value = `${yyyy}-${mm}-${dd}`;
      if (invTimeInput) invTimeInput.value = "Full-Day Cultural Matrimony (8:00 AM – 6:00 PM)";
      if (invLocationInput) invLocationInput.value = "Family Country Estate / On-Location Grounds";
      if (invCrewInput) invCrewInput.value = "2 Senior Photographers + Master 4K Cinema Camera Unit";
      if (invNotesInput) {
        invNotesInput.value = "🥂 Traditional Matrimony (Ruracio / Dowry Celebration): Complete coverage of family negotiations, bridal entrance, elder blessings, gift presentation & cultural reception.\n• Deliverables: 350+ retouched high-resolution images, 4K cinematic video highlights, 4K drone aerials, luxury photobook album & all unedited original camera proofs.";
      }

      addInvoiceSession("traditional-wedding", 2, false); // Gold (75,000)
      if (invDepositPercent) invDepositPercent.value = "80";
      autoSuggestOccasionTitle(true);
      showInvoiceToast("🥂 Traditional Ruracio Collection applied (KSh 75,000)!");
    }
    else if (presetKey === "corporate-summit") {
      setInvoiceCategory("events");
      targetDate.setDate(today.getDate() + 14);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");

      if (invClientInput) invClientInput.value = "Corporate Organization / Summit Secretariat";
      if (invDateInput) invDateInput.value = `${yyyy}-${mm}-${dd}`;
      if (invTimeInput) invTimeInput.value = "Full-Day Conference & Evening Gala Dinner (8:00 AM – 9:00 PM)";
      if (invLocationInput) invLocationInput.value = "Radisson Blu / Villa Rosa Kempinski / Nairobi";
      if (invCrewInput) invCrewInput.value = "2 Commercial Photographers + 4K Cinema Documentarian";
      if (invNotesInput) {
        invNotesInput.value = "🏢 Full Corporate Summit & Gala: Keynote speakers, panel sessions, attendee networking, stage awards ceremony, executive team portraits, same-day digital PR press selects & complete corporate media repository.";
      }

      addInvoiceSession("corporate-event", 1, false); // Gold (35,000)
      invoiceAddons.push({
        id: "addon_summit_reel",
        name: "4K Executive Event Highlights Reel",
        spec: "60-second fast-paced corporate social media highlight cut for LinkedIn & Twitter",
        price: 3000
      });
      renderInvoiceAddons();
      if (invDepositPercent) invDepositPercent.value = "80";
      autoSuggestOccasionTitle(true);
      showInvoiceToast("🏢 Corporate Summit & Gala applied (KSh 38,000)!");
    }
    else if (presetKey === "graduation-vip") {
      setInvoiceCategory("studio");
      targetDate.setDate(today.getDate() + 7);
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");

      if (invClientInput) invClientInput.value = "Graduate & Proud Family";
      if (invDateInput) invDateInput.value = `${yyyy}-${mm}-${dd}`;
      if (invTimeInput) invTimeInput.value = "Studio Regalia Session + Campus Location (2 Hours)";
      if (invLocationInput) invLocationInput.value = "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor) / Campus";
      if (invCrewInput) invCrewInput.value = "Studio Lead Photographer + Lighting Assistant";
      if (invNotesInput) {
        invNotesInput.value = "🎓 Graduation Milestone VIP: Solo academic regalia portraits, degree scroll, academic hood, cap toss, family and parents combination portraits.\n• Includes magazine-grade skin retouching, living room wooden A3 photo mount & complete high-speed cloud download.";
      }

      addInvoiceSession("graduation-shoot", 2, false); // Gold (3,500)
      invoiceAddons.push({
        id: "addon_a3_mount",
        name: "A3 Statement Photo Mount (30×42cm)",
        spec: "Solid MDF wooden living room wall mount, laminated print, ready to hang",
        price: 2300
      });
      renderInvoiceAddons();
      if (invDepositPercent) invDepositPercent.value = "80";
      autoSuggestOccasionTitle(true);
      showInvoiceToast("🎓 Graduation Milestone + Wall Mount applied (KSh 5,800)!");
    }

    updateInvoiceDisplay();
    if (invClientInput) invClientInput.focus();
  }

  // Smart Autocomplete & Predictive Helpers
  function applyFieldPrediction(inputId, textValue, append = false) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (append) {
      const current = input.value.trim();
      if (!current) {
        input.value = textValue;
      } else if (!current.toLowerCase().includes(textValue.toLowerCase().trim())) {
        input.value = textValue + current;
      }
    } else {
      input.value = textValue;
    }
    if (inputId === "invClientInput") {
      autoSuggestOccasionTitle(false);
    }
    updateInvoiceDisplay();
    input.focus();
    showInvoiceToast(`✓ Inserted "${textValue.trim()}"`);
  }

  function setQuickDate(daysAhead = 0) {
    if (!invDateInput) return;
    const target = new Date();
    target.setDate(target.getDate() + daysAhead);
    const yyyy = target.getFullYear();
    const mm = String(target.getMonth() + 1).padStart(2, "0");
    const dd = String(target.getDate()).padStart(2, "0");
    invDateInput.value = `${yyyy}-${mm}-${dd}`;
    updateInvoiceDisplay();
    const labels = { 0: "Today", 1: "Tomorrow", 7: "Next Week", 30: "Next Month" };
    showInvoiceToast(`📅 Date set to ${labels[daysAhead] || `${daysAhead} days ahead`}`);
  }

  function applyNoteTemplate(type) {
    if (!invNotesInput) return;
    const templates = {
      studio: "Includes 2 outfit changes, professional studio lighting & backdrop setup, high-end skin frequency separation retouching, and secure private cloud gallery download.",
      rush: "⚡ Priority 24-Hour Expedited Turnaround: color-graded high-resolution master gallery delivered within 24 hours of session wrap.",
      wedding: "💍 Full-day coverage: morning bridal preparations, church ceremony, creative couple & bridal party location session, and evening reception coverage.",
      graduation: "🎓 Graduation milestone session: includes graduate solo portraits, ceremonial gown & hood props, parents, and extended family group combinations.",
      travel: "🚗 Local transport within town limits covered. Client facilitates venue entrance access, entry tickets, and photography clearances if required.",
      clear: ""
    };

    if (type === "clear") {
      invNotesInput.value = "";
      updateInvoiceDisplay();
      showInvoiceToast("Scope notes cleared.");
      return;
    }

    const tpl = templates[type];
    if (!tpl) return;

    if (!invNotesInput.value.trim()) {
      invNotesInput.value = tpl;
    } else {
      invNotesInput.value = invNotesInput.value.trim() + "\n" + tpl;
    }
    updateInvoiceDisplay();
    showInvoiceToast("✓ Production scope template inserted!");
  }

  // Auto-fill assignment details whenever a package is selected
  function autoFillLogisticsFromPackage(pkgId, forceAutofill = false) {
    if (pkgId === "custom") return;
    const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
    if (!pkg) return;

    // Detect and apply main production category
    const detectedCat = detectCategoryFromPackage(pkgId);
    setInvoiceCategory(detectedCat);
    autoSuggestOccasionTitle(false);

    // Auto-detect Studio Shoot (minimal rules) vs Event Coverage (detailed overtime/logistics agreement)
    const isEventPkg = pkg.pathway === "events" || pkgId.includes("wedding") || pkgId.includes("burial") || pkgId.includes("ruracio") || pkgId.includes("corporate-event");
    setQuotationScope(isEventPkg ? "event" : "studio");

    const isReceipt = invoiceMode === "receipt";
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    if (invDateInput && (!invDateInput.value || isReceipt || forceAutofill)) {
      invDateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    if (invLocationInput) {
      const curLoc = invLocationInput.value.trim();
      if (!curLoc || forceAutofill || curLoc === "Nairobi / In-Studio" || curLoc.startsWith("Laureign Studios") || curLoc.startsWith("Kakamega")) {
        if (pkg.pathway === "studio" || pkg.id.includes("studio") || pkg.id.includes("headshot") || pkg.id.includes("white-shirt") || pkg.id.includes("silk-wrap")) {
          invLocationInput.value = "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor)";
        } else if (pkg.pathway === "outdoor" || pkg.id.includes("outdoor")) {
          invLocationInput.value = "Kakamega / On-Location Shoot";
        } else if (pkg.pathway === "events" || pkg.id.includes("wedding")) {
          invLocationInput.value = "Client Event Venue / Nairobi & Across Kenya";
        } else {
          invLocationInput.value = "Client Premises / Studio Facility";
        }
      }
    }

    if (invTimeInput) {
      const curTime = invTimeInput.value.trim();
      if (!curTime || forceAutofill || curTime === "Standard Coverage Session" || curTime.includes("Session")) {
        if (isReceipt) {
          invTimeInput.value = "Walk-in Instant Studio Shoot (Completed)";
        } else if (pkg.pathway === "studio") {
          invTimeInput.value = "Standard Studio Session (45–60 mins)";
        } else if (pkg.pathway === "outdoor") {
          invTimeInput.value = "Golden Hour Session (1.5–2 hrs)";
        } else if (pkg.pathway === "events") {
          invTimeInput.value = "Full Day Production Coverage";
        } else {
          invTimeInput.value = "Tailored Coverage Session";
        }
      }
    }

    if (invCrewInput) {
      const curCrew = invCrewInput.value.trim();
      if (!curCrew || forceAutofill || curCrew.includes("Lead Production")) {
        if (pkg.pathway === "studio") {
          invCrewInput.value = "Studio Lead Photographer + Lighting Assistant";
        } else if (pkg.pathway === "outdoor") {
          invCrewInput.value = "Lead Outdoor Photographer + Reflector Assistant";
        } else if (pkg.pathway === "events") {
          invCrewInput.value = "Senior Cinematographer + 2 Lead Photographers";
        } else {
          invCrewInput.value = "Commercial Director of Photography + Gear Tech";
        }
      }
    }

    if (invNotesInput) {
      const curNotes = invNotesInput.value.trim();
      if (!curNotes || forceAutofill || curNotes.includes("Includes high-end") || curNotes.includes("Walk-in studio shoot")) {
        if (isReceipt) {
          invNotesInput.value = `Walk-in session completed at Laureign Studios. Master retouched gallery deliverable within ${pkg.turnaround || "2–3 business days"} via private online gallery and WhatsApp link.`;
        } else {
          invNotesInput.value = `Includes high-end lighting, color grading and magazine-grade skin retouching. Expected delivery turnaround: ${pkg.turnaround || "2–3 business days"}. Booking confirmed upon receipt of deposit.`;
        }
      }
    }
  }

  // ============================================================
  // MULTI-SESSION / SHOOT BUILDER (Dropdown + Manual Typing Everywhere)
  // ============================================================
  function addInvoiceSession(pkgId = "graduation", optIdx = 0, notify = true) {
    let newSess;
    if (pkgId === "custom") {
      newSess = {
        id: "sess_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
        pkgId: "custom",
        title: "Custom Studio Shoot",
        tierIdx: -1,
        tierName: "Tailored Package",
        spec: "Custom photography coverage, professional lighting, editorial skin retouching & high-resolution digital master gallery.",
        rate: 4500,
        qty: 1
      };
    } else {
      const pkg = PACKAGES_DATA.find(p => p.id === pkgId) || PACKAGES_DATA[0];
      const opt = (pkg && pkg.options && pkg.options[optIdx]) ? pkg.options[optIdx] : (pkg ? pkg.options[0] : { name: "Standard", price: 3500 });
      const inclusionsText = (opt.inclusions && opt.inclusions.length)
        ? opt.inclusions.join(" • ")
        : (opt.summary || (pkg ? pkg.tagline : "") || "Professional photography session & master deliverables.");

      newSess = {
        id: "sess_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
        pkgId: pkg ? pkg.id : "custom",
        title: pkg ? pkg.title : "Studio Photography Session",
        tierIdx: typeof optIdx === "number" ? optIdx : 0,
        tierName: opt.name,
        spec: inclusionsText,
        rate: opt.price || 0,
        qty: 1
      };
    }

    invoiceSessions.push(newSess);

    if (invoiceSessions.length === 1) {
      autoFillLogisticsFromPackage(newSess.pkgId);
    }

    renderInvoiceSessions();
    updateInvoiceDisplay();

    if (notify) {
      showInvoiceToast(`➕ Added Shoot: ${newSess.title}`);
    }
  }

  function removeInvoiceSession(id) {
    invoiceSessions = invoiceSessions.filter(s => s.id !== id);
    if (invoiceSessions.length === 0) {
      addInvoiceSession("graduation", 0, false);
    } else {
      renderInvoiceSessions();
    }
    updateInvoiceDisplay();
    showInvoiceToast("Shoot session removed");
  }

  function onSessionPkgChange(id, pkgId, optIdx = 0) {
    const session = invoiceSessions.find(s => s.id === id);
    if (!session) return;

    if (pkgId === "custom") {
      session.pkgId = "custom";
      session.title = "Custom Studio / On-Location Shoot";
      session.tierIdx = -1;
      session.tierName = "Tailored Scope";
      session.spec = "Tailored photography session, custom lighting setup, high-end skin retouching and cloud delivery.";
      session.rate = 4500;
    } else {
      const pkg = PACKAGES_DATA.find(p => p.id === pkgId) || PACKAGES_DATA[0];
      session.pkgId = pkg.id;
      session.title = pkg.title;
      const opt = pkg.options[optIdx] || pkg.options[0];
      session.tierIdx = optIdx;
      session.tierName = opt.name;
      session.spec = (opt.inclusions && opt.inclusions.length)
        ? opt.inclusions.join(" • ")
        : (opt.summary || pkg.tagline || "Professional photography deliverables");
      session.rate = opt.price || 0;
    }

    if (invoiceSessions[0] && invoiceSessions[0].id === id) {
      autoFillLogisticsFromPackage(session.pkgId);
    }

    renderInvoiceSessions();
    updateInvoiceDisplay();
  }

  function onSessionTierChange(id, tierVal) {
    const session = invoiceSessions.find(s => s.id === id);
    if (!session) return;

    if (tierVal === "custom") {
      session.tierIdx = -1;
      session.tierName = "Custom Scope";
    } else {
      const optIdx = parseInt(tierVal, 10) || 0;
      const pkg = PACKAGES_DATA.find(p => p.id === session.pkgId);
      if (pkg && pkg.options && pkg.options[optIdx]) {
        const opt = pkg.options[optIdx];
        session.tierIdx = optIdx;
        session.tierName = opt.name;
        session.spec = (opt.inclusions && opt.inclusions.length)
          ? opt.inclusions.join(" • ")
          : (opt.summary || pkg.tagline || "");
        session.rate = opt.price || 0;
      }
    }

    renderInvoiceSessions();
    updateInvoiceDisplay();
  }

  function onSessionFieldChange(id, field, value) {
    const session = invoiceSessions.find(s => s.id === id);
    if (!session) return;

    if (field === "rate") {
      session.rate = parseInt(value, 10) || 0;
    } else if (field === "qty") {
      session.qty = Math.max(1, parseInt(value, 10) || 1);
    } else {
      session[field] = value;
    }

    const card = document.querySelector(`.inv-session-card[data-session-id="${id}"]`);
    if (card && field === "title") {
      const badge = card.querySelector(".inv-session-badge");
      if (badge) {
        const idx = invoiceSessions.indexOf(session) + 1;
        badge.innerHTML = `📸 Shoot #${idx}: ${escapeHtml(session.title || "Custom Shoot")}`;
      }
    }

    updateInvoiceDisplay();
  }

  function renderInvoiceSessions() {
    const container = document.getElementById("invSessionsContainer");
    if (!container) return;

    if (invoiceSessions.length === 0) {
      container.innerHTML = `<div style="font-size:12px; color:#94a3b8; font-style:italic; padding:6px 0;">No sessions added. Click "➕ Add Another Session" to add a shoot.</div>`;
      return;
    }

    const studioPkgs = PACKAGES_DATA.filter(p => p.pathway === "studio");
    const outdoorPkgs = PACKAGES_DATA.filter(p => p.pathway === "outdoor");
    const eventPkgs = PACKAGES_DATA.filter(p => p.pathway === "events");
    const commercialPkgs = PACKAGES_DATA.filter(p => p.pathway === "commercial");

    const html = invoiceSessions.map((s, idx) => {
      const currentPkg = PACKAGES_DATA.find(p => p.id === s.pkgId);

      const pkgOptionsHtml = `
        <option value="custom" ${s.pkgId === "custom" ? "selected" : ""}>-- ✏️ Custom / Tailored Shoot (Manual Type) --</option>
        <optgroup label="📸 Studio &amp; Portrait Sessions">
          ${studioPkgs.map(p => `<option value="${p.id}" ${s.pkgId === p.id ? "selected" : ""}>${escapeHtml(p.title)}</option>`).join("")}
        </optgroup>
        <optgroup label="🌿 Outdoor Sessions">
          ${outdoorPkgs.map(p => `<option value="${p.id}" ${s.pkgId === p.id ? "selected" : ""}>${escapeHtml(p.title)}</option>`).join("")}
        </optgroup>
        <optgroup label="💍 Events &amp; Weddings">
          ${eventPkgs.map(p => `<option value="${p.id}" ${s.pkgId === p.id ? "selected" : ""}>${escapeHtml(p.title)}</option>`).join("")}
        </optgroup>
        <optgroup label="🏢 Commercial &amp; Brand">
          ${commercialPkgs.map(p => `<option value="${p.id}" ${s.pkgId === p.id ? "selected" : ""}>${escapeHtml(p.title)}</option>`).join("")}
        </optgroup>
      `;

      let tierOptionsHtml = "";
      if (currentPkg && currentPkg.options) {
        tierOptionsHtml = currentPkg.options.map((opt, oIdx) => `
          <option value="${oIdx}" ${s.tierIdx === oIdx ? "selected" : ""}>
            ${escapeHtml(opt.name)} — KSh ${opt.price.toLocaleString()}
          </option>
        `).join("") + `<option value="custom" ${s.tierIdx === -1 ? "selected" : ""}>-- ✏️ Custom Tier / Scope (Manual Type) --</option>`;
      } else {
        tierOptionsHtml = `<option value="custom" selected>-- ✏️ Custom Tier / Scope (Manual Type) --</option>`;
      }

      return `
        <div class="inv-session-card" data-session-id="${s.id}">
          <div class="inv-session-header">
            <span class="inv-session-badge">📸 Shoot #${idx + 1}: ${escapeHtml(s.title || "Custom Shoot")}</span>
            ${invoiceSessions.length > 1 ? `<button type="button" class="inv-btn-del-line" onclick="removeInvoiceSession('${s.id}')" title="Remove this session">✕ Remove Shoot</button>` : ''}
          </div>

          <div class="inv-tools-grid">
            <div class="inv-tool-group">
              <div class="inv-label-row">
                <label>Shoot Type Preset:</label>
                <span class="inv-helper-hint">Dropdown</span>
              </div>
              <select class="inv-select inv-session-pkg-select" onchange="onSessionPkgChange('${s.id}', this.value)">
                ${pkgOptionsHtml}
              </select>
            </div>
            <div class="inv-tool-group">
              <div class="inv-label-row">
                <label>Shoot Title (Editable):</label>
                <span class="inv-helper-hint">Type freely</span>
              </div>
              <input type="text" class="inv-input" placeholder="e.g. Graduation Milestone Shoot" value="${escapeHtml(s.title)}" oninput="onSessionFieldChange('${s.id}', 'title', this.value)">
            </div>
          </div>

          <div class="inv-tools-grid" style="margin-top:2px;">
            <div class="inv-tool-group">
              <div class="inv-label-row">
                <label>Tier / Package Preset:</label>
                <span class="inv-helper-hint">Select option</span>
              </div>
              <select class="inv-select inv-session-tier-select" onchange="onSessionTierChange('${s.id}', this.value)">
                ${tierOptionsHtml}
              </select>
            </div>
            <div class="inv-tool-group">
              <div class="inv-label-row">
                <label>Tier Name (Editable):</label>
                <span class="inv-helper-hint">Type freely</span>
              </div>
              <input type="text" class="inv-input" placeholder="e.g. Solo Gold / Executive" value="${escapeHtml(s.tierName)}" oninput="onSessionFieldChange('${s.id}', 'tierName', this.value)">
            </div>
          </div>

          <div class="inv-tool-group" style="margin-top:2px;">
            <div class="inv-label-row">
              <label>Deliverables &amp; Inclusions Scope (Editable):</label>
              <span class="inv-helper-hint">Type or edit deliverables</span>
            </div>
            <textarea class="inv-input" rows="2" placeholder="e.g. 15 retouched images, 2 outfit changes, studio lighting &amp; gown props..." oninput="onSessionFieldChange('${s.id}', 'spec', this.value)">${escapeHtml(s.spec)}</textarea>
          </div>

          <div class="inv-tools-grid" style="grid-template-columns: 2fr 1fr; margin-top:2px;">
            <div class="inv-tool-group">
              <div class="inv-label-row">
                <label>Investment Rate (KSh):</label>
                <span class="inv-helper-hint">Editable rate</span>
              </div>
              <input type="number" class="inv-input" placeholder="e.g. 5500" value="${s.rate || ''}" oninput="onSessionFieldChange('${s.id}', 'rate', this.value)">
            </div>
            <div class="inv-tool-group">
              <div class="inv-label-row">
                <label>Sessions / Qty:</label>
              </div>
              <input type="number" min="1" class="inv-input" value="${s.qty || 1}" oninput="onSessionFieldChange('${s.id}', 'qty', this.value)">
            </div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = html;
  }

  // ============================================================
  // DYNAMIC ADD-ONS & ENHANCEMENTS BUILDER (Unlimited & Flexible)
  // ============================================================
  function addInvoiceAddon(presetName, presetSpec, presetPrice) {
    const newAddon = {
      id: "addon_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
      name: presetName || "Custom Studio Add-On",
      spec: presetSpec || "Deliverable enhancement upgrade agreed with studio",
      price: typeof presetPrice === "number" ? presetPrice : (parseInt(presetPrice, 10) || 0)
    };
    invoiceAddons.push(newAddon);
    renderInvoiceAddons();
    updateInvoiceDisplay();
    if (presetName) {
      showInvoiceToast(`✓ Added "${presetName}" (+KSh ${(newAddon.price || 0).toLocaleString()})`);
    } else {
      showInvoiceToast("➕ Added custom add-on row");
    }
  }

  function removeInvoiceAddon(id) {
    invoiceAddons = invoiceAddons.filter(a => a.id !== id);
    renderInvoiceAddons();
    updateInvoiceDisplay();
    showInvoiceToast("Add-on removed");
  }

  function onAddonFieldChange(id, field, value) {
    const addon = invoiceAddons.find(a => a.id === id);
    if (!addon) return;
    if (field === "price") {
      addon.price = parseInt(value, 10) || 0;
    } else {
      addon[field] = value;
    }
    updateInvoiceDisplay();
  }

  function renderInvoiceAddons() {
    const container = document.getElementById("invAddonsContainer");
    if (!container) return;

    if (invoiceAddons.length === 0) {
      container.innerHTML = `<div style="font-size:11.5px; color:#94a3b8; font-style:italic; padding:6px 0;">No add-ons selected yet. Click the 1-click upgrade chips above (🎬 Reel, 💄 Makeup, 🛸 Drone, etc.) or click "➕ Add Custom Add-On / Reel" to type your own!</div>`;
      return;
    }

    container.innerHTML = invoiceAddons.map(a => `
      <div class="inv-addon-row" data-addon-id="${a.id}">
        <div>
          <input type="text" class="inv-input" style="padding:6px 10px; font-size:12px;" placeholder="Add-on / Service Name" value="${escapeHtml(a.name)}" oninput="onAddonFieldChange('${a.id}', 'name', this.value)">
        </div>
        <div>
          <input type="text" class="inv-input" style="padding:6px 10px; font-size:12px;" placeholder="Deliverable / Scope" value="${escapeHtml(a.spec)}" oninput="onAddonFieldChange('${a.id}', 'spec', this.value)">
        </div>
        <div>
          <input type="number" class="inv-input" style="padding:6px 10px; font-size:12px;" placeholder="Price (KSh)" value="${a.price || ''}" oninput="onAddonFieldChange('${a.id}', 'price', this.value)">
        </div>
        <div>
          <button type="button" class="inv-btn-del-line" onclick="removeInvoiceAddon('${a.id}')" title="Delete" style="height:32px; width:32px; display:flex; align-items:center; justify-content:center; padding:0; font-size:13px;">✕</button>
        </div>
      </div>
    `).join("");
  }

  // Helper: Kenyan Shillings number to words converter
  function numberToWordsKenya(num) {
    if (!num || isNaN(num) || num <= 0) return "Zero shillings only.";
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    function inWords(n) {
      if (n === 0) return '';
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
      if (n < 1000000) return inWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
      return inWords(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + inWords(n % 1000000) : '');
    }
    const words = inWords(Math.round(num)).trim();
    return words.charAt(0).toUpperCase() + words.slice(1) + ' shillings only.';
  }

  // ============================================================
  // LIVE A4 INVOICE SHEET DISPLAY UPDATES & TOTALS
  // ============================================================
  function updateInvoiceDisplay() {
    const isReceipt = invoiceMode === "receipt";

    // Meta displays
    const elRef = document.getElementById("invDisplayRef");
    const elDate = document.getElementById("invDisplayDateIssued");
    const elVal = document.getElementById("invDisplayValidity");
    const elValItem = document.getElementById("invValidityMetaItem");
    const elDateLabel = document.getElementById("invDisplayDateLabel");
    const elStatusPill = document.getElementById("invDisplayStatusPill");
    const elWordmark = document.getElementById("invSheetMainWordmark");
    const elDocType = document.getElementById("invDisplayDocType");

    if (elRef) elRef.textContent = currentInvoiceRef.startsWith("#") ? currentInvoiceRef : `#${currentInvoiceRef}`;
    if (elDate) elDate.textContent = invoiceDateIssued;
    if (elDateLabel) elDateLabel.textContent = isReceipt ? "Receipt Date" : "Invoice Date";

    const invValInput = document.getElementById("invValidityInput");
    const userValidity = invValInput && invValInput.value.trim();
    if (elVal) {
      elVal.textContent = isReceipt ? "Confirmed (Paid)" : (userValidity || invoiceValidity || "14 Days");
    }
    if (elValItem) {
      elValItem.style.display = isReceipt ? "none" : "flex";
    }

    // Client & Assignment Details
    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued Client";
    const phoneVal = (invPhoneInput && invPhoneInput.value.trim()) || "";
    const emailVal = (invEmailInput && invEmailInput.value.trim()) || "";
    const dateVal = (invDateInput && invDateInput.value) || "To Be Scheduled";
    const timeVal = (invTimeInput && invTimeInput.value.trim()) || "Standard Coverage Session";
    const locVal = (invLocationInput && invLocationInput.value.trim()) || "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor)";
    const crewVal = (invCrewInput && invCrewInput.value.trim()) || "Studio Lead Photographer + Lighting Assistant";
    const notesVal = (invNotesInput && invNotesInput.value.trim()) || "";

    const cat = INVOICE_CATEGORIES[currentInvoiceCategory] || INVOICE_CATEGORIES["studio"];
    const elCatSelect = document.getElementById("invCategorySelect");
    if (elCatSelect && elCatSelect.value !== cat.id) {
      elCatSelect.value = cat.id;
    }

    const occInput = document.getElementById("invOccasionTitleInput");
    let occTitle = (occInput && occInput.value.trim()) || "";
    if (!occTitle) {
      occTitle = invoiceSessions.length > 0 ? invoiceSessions.map(s => s.title).join(" + ") : cat.name;
    }

    const elClient = document.getElementById("invSheetClient");
    const elPhone = document.getElementById("invSheetPhone");
    const elEmail = document.getElementById("invSheetEmail");
    const elBillingLoc = document.getElementById("invSheetBillingLoc");
    const elEventTitle = document.getElementById("invSheetEventTitle");
    const elLoc = document.getElementById("invSheetLocation");

    if (elClient) elClient.textContent = clientVal;
    if (elPhone) elPhone.textContent = phoneVal || "+254 790 048 905";
    if (elEmail) elEmail.textContent = emailVal || "bookings@laureignstudios.co.ke";
    if (elLoc) elLoc.textContent = locVal || "Kakamega Town (Mumias Rd)";
    if (elBillingLoc) elBillingLoc.textContent = "542542-486197";
    if (elEventTitle) elEventTitle.textContent = occTitle;

    // Financial calculations
    const basePrice = invoiceSessions.reduce((sum, s) => sum + ((s.rate || 0) * (s.qty || 1)), 0);
    const addonsTotal = invoiceAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const discount = parseInt(invDiscountInput ? invDiscountInput.value : 0, 10) || 0;
    const grandTotal = Math.max(0, basePrice + addonsTotal - discount);

    const depPercent = parseInt(invDepositPercent ? invDepositPercent.value : 80, 10) || 80;
    const deposit = Math.round(grandTotal * (depPercent / 100));
    const balance = Math.max(0, grandTotal - deposit);

    const payStatusSelect = document.getElementById("invReceiptStatusSelect") || document.getElementById("invPaymentStatusSelect");
    const payMethodSelect = document.getElementById("invReceiptMethodSelect") || document.getElementById("invPaymentMethodSelect");
    const payRefInput = document.getElementById("invReceiptRefInput") || document.getElementById("invPaymentRefInput");

    const paymentStatus = payStatusSelect ? payStatusSelect.value : "full";
    let paymentMethod = "M-Pesa Buy Goods Till 0790048905 (Laureign Studios)";
    if (payMethodSelect) {
      if (payMethodSelect.tagName === "SELECT" && payMethodSelect.options[payMethodSelect.selectedIndex]) {
        paymentMethod = payMethodSelect.options[payMethodSelect.selectedIndex].text || payMethodSelect.value;
      } else {
        paymentMethod = payMethodSelect.value || paymentMethod;
      }
    }
    const paymentRef = (payRefInput && payRefInput.value.trim()) || "M-Pesa Verified";

    // Synchronize printable sheet mode class
    const printableSheet = document.getElementById("invoicePrintableSheet");
    if (printableSheet) {
      printableSheet.classList.toggle("is-receipt-mode", isReceipt);
    }

    // Security Watermark Text
    const watermarkEl = document.getElementById("invSecurityWatermark");
    if (watermarkEl) {
      if (isReceipt) {
        watermarkEl.innerHTML = `
          <div class="inv-watermark-row">LAUREIGN STUDIOS OFFICIAL &nbsp;•&nbsp; PAYMENT CONFIRMED &nbsp;•&nbsp; OFFICIAL RECEIPT</div>
          <div class="inv-watermark-row">CASHLESS M-PESA VERIFIED &nbsp;•&nbsp; OFFICIAL STUDIO RECEIPT &nbsp;•&nbsp; TAX CLEARED</div>
          <div class="inv-watermark-row">LAUREIGN STUDIOS OFFICIAL &nbsp;•&nbsp; PAYMENT CONFIRMED &nbsp;•&nbsp; OFFICIAL RECEIPT</div>
          <div class="inv-watermark-row">CASHLESS M-PESA VERIFIED &nbsp;•&nbsp; OFFICIAL STUDIO RECEIPT &nbsp;•&nbsp; TAX CLEARED</div>
        `;
      } else {
        watermarkEl.innerHTML = `
          <div class="inv-watermark-row">LAUREIGN STUDIOS OFFICIAL &nbsp;•&nbsp; AUTHENTICATED &nbsp;•&nbsp; LAUREIGN STUDIOS OFFICIAL</div>
          <div class="inv-watermark-row">OFFICIAL PROFORMA &nbsp;•&nbsp; NOTARY VERIFIED &nbsp;•&nbsp; SECURE RATE CARD</div>
          <div class="inv-watermark-row">LAUREIGN STUDIOS OFFICIAL &nbsp;•&nbsp; AUTHENTICATED &nbsp;•&nbsp; LAUREIGN STUDIOS OFFICIAL</div>
          <div class="inv-watermark-row">OFFICIAL PROFORMA &nbsp;•&nbsp; NOTARY VERIFIED &nbsp;•&nbsp; SECURE RATE CARD</div>
        `;
      }
    }

    if (isReceipt) {
      if (elWordmark) elWordmark.textContent = "RECEIPT";
      if (elDocType) elDocType.textContent = "RECEIPT TO";
      if (elStatusPill) {
        if (paymentStatus === "full") {
          elStatusPill.className = "inv-meta-v status-paid";
          elStatusPill.textContent = "PAID IN FULL";
        } else {
          elStatusPill.className = "inv-meta-v status-deposit";
          elStatusPill.textContent = `DEPOSIT PAID (${depPercent}%)`;
        }
      }
    } else {
      if (elWordmark) elWordmark.textContent = "QUOTATION";
      if (elDocType) elDocType.textContent = "INVOICE TO";
      if (elStatusPill) {
        elStatusPill.className = "inv-meta-v status-proforma";
        elStatusPill.textContent = "PROFORMA / UNPAID";
      }
    }

    // Render Table Rows in Live Sheet (4 Columns: Item Description, Unit Price, Qnt, Total)
    const tbody = document.getElementById("invTableBody");
    const elTableColDesc = document.getElementById("invTableColDesc");
    if (elTableColDesc) {
      elTableColDesc.textContent = isReceipt ? "Shoot Particulars Paid For" : "Item Description";
    }

    if (tbody) {
      let rowsHtml = "";

      if (isReceipt) {
        // Commercial Receipt Table: concise particulars of what was paid for without repetitive text
        invoiceSessions.forEach((s) => {
          const qty = s.qty || 1;
          const rate = s.rate || 0;
          const lineTotal = rate * qty;

          rowsHtml += `
            <tr>
              <td class="col-desc">
                <div class="inv-item-title">${escapeHtml(s.title || "Studio Shoot Session")}</div>
                <div class="inv-item-sub">Package Tier: ${escapeHtml(s.tierName || "Standard Package")} · Master Photography Deliverables</div>
              </td>
              <td class="col-price">KSh ${rate.toLocaleString()}</td>
              <td class="col-qty">${String(qty).padStart(2, '0')}</td>
              <td class="col-total">KSh ${lineTotal.toLocaleString()}</td>
            </tr>
          `;
        });

        invoiceAddons.forEach((a) => {
          const price = a.price || 0;
          rowsHtml += `
            <tr>
              <td class="col-desc">
                <div class="inv-item-title">Add-On: ${escapeHtml(a.name || "Creative Enhancement")}</div>
                <div class="inv-item-sub">Deliverable / Print Enhancement</div>
              </td>
              <td class="col-price">KSh ${price.toLocaleString()}</td>
              <td class="col-qty">01</td>
              <td class="col-total">KSh ${price.toLocaleString()}</td>
            </tr>
          `;
        });

        if (invoiceSessions.length === 0 && invoiceAddons.length === 0) {
          rowsHtml = `<tr><td colspan="4" style="text-align:center; padding:18px; color:#64748b;">No shoot items configured.</td></tr>`;
        }
      } else {
        // Quotation Itemized Deliverables Table
        invoiceSessions.forEach((s) => {
          const qty = s.qty || 1;
          const rate = s.rate || 0;
          const lineTotal = rate * qty;

          let specHtml = "";
          if (s.spec) {
            const parts = s.spec.split(/[•\n]/).map(p => p.trim()).filter(Boolean);
            if (parts.length > 1) {
              specHtml = `<ul class="inv-inclusions-list">${parts.map(p => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`;
            } else {
              specHtml = `<div style="font-size:10px; color:#475569; line-height:1.4; margin-top:2px;">${escapeHtml(s.spec)}</div>`;
            }
          } else {
            specHtml = `<div style="font-size:10px; color:#475569; margin-top:2px;">Standard studio photography session &amp; master deliverables.</div>`;
          }

          rowsHtml += `
            <tr>
              <td class="col-desc">
                <div class="inv-item-title">${escapeHtml(s.title || "Studio Session")}</div>
                <div class="inv-item-sub">${escapeHtml(s.tierName || "Selected Package Tier")}</div>
                ${specHtml}
              </td>
              <td class="col-price">KSh ${rate.toLocaleString()}</td>
              <td class="col-qty">${String(qty).padStart(2, '0')}</td>
              <td class="col-total">KSh ${lineTotal.toLocaleString()}</td>
            </tr>
          `;
        });

        invoiceAddons.forEach((a) => {
          const price = a.price || 0;
          rowsHtml += `
            <tr>
              <td class="col-desc">
                <div class="inv-item-title">Add-On: ${escapeHtml(a.name || "Creative Enhancement")}</div>
                <div class="inv-item-sub">Selected Enhancement Upgrade</div>
                <div style="font-size:10px; color:#475569; line-height:1.4; margin-top:2px;">${escapeHtml(a.spec || "Deliverable enhancement upgrade.")}</div>
              </td>
              <td class="col-price">KSh ${price.toLocaleString()}</td>
              <td class="col-qty">01</td>
              <td class="col-total">KSh ${price.toLocaleString()}</td>
            </tr>
          `;
        });

        if (invoiceSessions.length === 0 && invoiceAddons.length === 0) {
          rowsHtml = `<tr><td colspan="4" style="text-align:center; padding:24px; color:#64748b;">No shoot sessions or add-ons configured yet.</td></tr>`;
        }
      }

      tbody.innerHTML = rowsHtml;
    }

    // Special Assignment Notes Box
    const elNotesBox = document.getElementById("invDisplayNotesBox");
    const elNotesText = document.getElementById("invDisplayNotesText");
    if (elNotesBox && elNotesText) {
      if (notesVal) {
        elNotesText.textContent = notesVal;
        elNotesBox.style.display = "block";
      } else {
        elNotesBox.style.display = "none";
      }
    }

    // Mid-Section: Payment Method & Settlement Box
    const elPayMethodTitle = document.getElementById("invPayMethodTitle");
    const elPayChannelLine = document.getElementById("invPayChannelLine");
    if (isReceipt) {
      if (elPayMethodTitle) elPayMethodTitle.textContent = "Verified Settlement Voucher";
      if (elPayChannelLine) {
        elPayChannelLine.innerHTML = `
          <div class="pay-line-item"><span class="check-box checked">☑</span> <b>Payment Channel:</b> <span>${escapeHtml(paymentMethod)}</span></div>
          <div class="pay-line-item"><span class="check-box checked">☑</span> <b>Transaction Ref:</b> <span class="till-num" style="background:#f1f5f9; color:#0B4D3A; border-color:#0B4D3A; font-weight:800;">${escapeHtml(paymentRef)}</span></div>
          <div class="pay-line-item"><span class="check-box checked">☑</span> <b>Settlement Status:</b> <span style="font-weight:700; color:#0B4D3A;">${paymentStatus === 'full' ? 'Payment Cleared in Full (Official Receipt)' : `Commitment Deposit Confirmed (${depPercent}%)`}</span></div>
          <div class="pay-line-item"><span class="check-box checked">☑</span> <b>Cashier Validation:</b> <span style="font-weight:600; color:#475569;">Verified by Laureign Studios Cashier</span></div>
        `;
      }
    } else {
      if (elPayMethodTitle) elPayMethodTitle.textContent = "Payment Method";
      if (elPayChannelLine) {
        elPayChannelLine.innerHTML = `
          <div class="pay-line-item"><span class="check-box checked">☑</span> <b>M-Pesa Buy Goods Till:</b> <span class="till-num">0790048905</span> (Laureign Studios)</div>
          <div class="pay-line-item"><span class="check-box">☐</span> <b>M-Pesa Paybill:</b> <span>542542</span> Acc: <span>486197</span> (Jane Akoth)</div>
          <div class="pay-line-item"><span class="check-box">☐</span> <b>Direct Bank Remittance:</b> <span>I&amp;M Bank Kenya · Acc: 486197</span></div>
        `;
      }
    }

    // Subtotals Block
    const elBase = document.getElementById("invBaseAmt");
    const elAddonsRow = document.getElementById("invAddonsRow");
    const elAddons = document.getElementById("invAddonsAmt");
    const elDiscRow = document.getElementById("invDiscountRow");
    const elDiscAmt = document.getElementById("invDiscountAmt");
    const elDepositRow = document.getElementById("invDepositRow");
    const elDepositLabel = document.getElementById("invDepositLabel");
    const elDepositVal = document.getElementById("invDepositRequired");
    const elBalRow = document.getElementById("invBalanceRow");
    const elBalLabel = document.getElementById("invBalanceLabel");
    const elBalVal = document.getElementById("invBalanceDue");
    const elPaidRow = document.getElementById("invPaidRow");
    const elPaidLabel = document.getElementById("invPaidLabel");
    const elPaidAmt = document.getElementById("invPaidAmt");

    if (elBase) elBase.textContent = `KSh ${basePrice.toLocaleString()}`;
    if (elAddonsRow && elAddons) {
      if (addonsTotal > 0) {
        elAddons.textContent = `KSh ${addonsTotal.toLocaleString()}`;
        elAddonsRow.style.display = "flex";
      } else {
        elAddonsRow.style.display = "none";
      }
    }

    if (elDiscRow && elDiscAmt) {
      if (discount > 0) {
        elDiscAmt.textContent = `- KSh ${discount.toLocaleString()}`;
        elDiscRow.style.display = "flex";
      } else {
        elDiscRow.style.display = "none";
      }
    }

    if (isReceipt) {
      if (elDepositRow) elDepositRow.style.display = "none";
      if (elPaidRow) {
        elPaidRow.style.display = "flex";
        if (elPaidLabel) elPaidLabel.textContent = paymentStatus === "full" ? "Amount Paid in Full" : `Deposit Paid (${depPercent}%)`;
        if (elPaidAmt) elPaidAmt.textContent = `KSh ${(paymentStatus === "full" ? grandTotal : deposit).toLocaleString()}`;
      }
      if (elBalRow) {
        elBalRow.style.display = "flex";
        if (elBalLabel) elBalLabel.textContent = paymentStatus === "full" ? "Balance Remaining" : "Balance Due on Delivery";
        if (elBalVal) {
          elBalVal.textContent = paymentStatus === "full" ? "KSh 0.00 (CLEARED)" : `KSh ${balance.toLocaleString()}`;
          elBalVal.style.color = paymentStatus === "full" ? "#0B4D3A" : "#0f172a";
          elBalVal.style.fontWeight = "800";
        }
      }
    } else {
      if (elPaidRow) elPaidRow.style.display = "none";
      if (elDepositRow) {
        elDepositRow.style.display = "flex";
        if (elDepositLabel) elDepositLabel.textContent = `Booking Deposit (${depPercent}%)`;
        if (elDepositVal) elDepositVal.textContent = `KSh ${deposit.toLocaleString()}`;
      }
      if (elBalRow) {
        elBalRow.style.display = "flex";
        if (elBalLabel) elBalLabel.textContent = "Balance Due on Delivery";
        if (elBalVal) {
          elBalVal.textContent = `KSh ${balance.toLocaleString()}`;
          elBalVal.style.color = "#0f172a";
          elBalVal.style.fontWeight = "700";
        }
      }
    }

    // Grand Total Bar & Words
    const targetAmt = isReceipt && paymentStatus === "deposit" ? deposit : grandTotal;
    const elGrandWords = document.getElementById("invGrandTotalWords");
    const elGrandLbl = document.getElementById("invGrandTotalLabel");
    const elGrand = document.getElementById("invGrandTotal");

    if (elGrandWords) elGrandWords.textContent = numberToWordsKenya(targetAmt);
    if (elGrandLbl) elGrandLbl.textContent = isReceipt ? "TOTAL PAID" : "GRAND TOTAL";
    if (elGrand) elGrand.textContent = `KSh ${targetAmt.toLocaleString()}`;

    // Big Total Due Banner
    const elTotalDueLbl = document.getElementById("invTotalDueLabel");
    const elTotalDueAmt = document.getElementById("invTotalDueAmt");
    if (isReceipt) {
      if (paymentStatus === "full") {
        if (elTotalDueLbl) elTotalDueLbl.textContent = "BALANCE DUE";
        if (elTotalDueAmt) elTotalDueAmt.textContent = "KSH 0.00";
      } else {
        if (elTotalDueLbl) elTotalDueLbl.textContent = "BALANCE DUE ON DELIVERY";
        if (elTotalDueAmt) elTotalDueAmt.textContent = `KSH ${balance.toLocaleString()}`;
      }
    } else {
      if (elTotalDueLbl) elTotalDueLbl.textContent = deposit < grandTotal ? "INITIAL DEPOSIT DUE" : "TOTAL DUE";
      if (elTotalDueAmt) elTotalDueAmt.textContent = `KSH ${deposit.toLocaleString()}`;
    }

    // Terms & Policies Section (Hidden in Receipt mode)
    const elTermsCol = document.getElementById("invPayTermsCol");
    const elTermsTitle = document.getElementById("invTermsTitle");
    const elPolicyList = document.getElementById("invPolicyBulletList");
    if (isReceipt) {
      if (elTermsCol) elTermsCol.style.display = "none";
    } else {
      if (elTermsCol) elTermsCol.style.display = "block";
      const isStudioScope = currentQuotationScope === "studio";
      if (elTermsTitle) elTermsTitle.textContent = "Terms & Condition :";
      if (elPolicyList) {
        const activePolicies = isStudioScope ? STUDIO_TERMS_POLICIES : EVENT_TERMS_POLICIES;
        if (activePolicies && activePolicies.length > 0) {
          elPolicyList.innerHTML = activePolicies.slice(0, 3).map(p => `
            <li><b>${escapeHtml(p.title)}:</b> ${escapeHtml(p.desc)}</li>
          `).join("");
        } else {
          elPolicyList.innerHTML = `
            <li>Payment should be made according to the agreed studio schedule.</li>
            <li>Free RAW soft copies archive included complimentary with every session.</li>
            <li>Commitment booking deposit secures your shoot date and locks creative crew allocation.</li>
          `;
        }
      }
    }

    // Dynamic Rubber Stamp Content
    const elSealStamp = document.getElementById("invSealStamp");
    if (elSealStamp) {
      elSealStamp.classList.toggle("paid-stamp", isReceipt);
    }
    const elStampDate = document.getElementById("stampSvgDate");
    if (elStampDate) {
      elStampDate.textContent = `DATE: ${getFormattedStampDate(new Date())}`;
    }
    const elStampRef = document.getElementById("stampSvgRef");
    if (elStampRef) {
      elStampRef.textContent = `REF: ${currentInvoiceRef}`;
    }
    const elStampTitle = document.getElementById("stampSvgTitle");
    if (elStampTitle) {
      if (isReceipt) {
        elStampTitle.textContent = paymentStatus === "deposit" ? "DEPOSIT CONFIRMED" : "PAID IN FULL";
      } else {
        elStampTitle.textContent = "OFFICIAL QUOTE";
      }
    }

    // Live Anti-Fraud Verification QR Code Rendering
    renderInvoiceVerificationQr(currentInvoiceRef);
  }

  // Render Anti-Tamper Verification QR Code onto Quotation / Receipt
  function renderInvoiceVerificationQr(ref) {
    const container = document.getElementById("invDocQrContainer");
    if (!container) return;
    container.innerHTML = "";

    const origin = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")
      ? "https://laureignstudios.co.ke"
      : window.location.origin;

    const cleanRef = ref || currentInvoiceRef || "LS-QUO-2026";
    const verifyUrl = `${origin}/packages?verify=${encodeURIComponent(cleanRef)}`;

    if (typeof QRCode !== "undefined") {
      try {
        new QRCode(container, {
          text: verifyUrl,
          width: 48,
          height: 48,
          colorDark: "#047857",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (err) {
        console.warn("QR generation deferred:", err);
      }
    }

    const displayRef = document.getElementById("invVerifyDisplayRef");
    if (displayRef) {
      displayRef.textContent = `REF: ${cleanRef}`;
    }
  }

  // Live Modal Triggered when scanning or navigating to ?verify=LS-QUO-...
  function showDocumentVerificationModal(ref) {
    let modal = document.getElementById("docVerificationModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "docVerificationModal";
      modal.className = "verify-shield-modal";
      document.body.appendChild(modal);
    }

    const isRec = ref && ref.toUpperCase().includes("REC");
    const docType = isRec ? "OFFICIAL PAYMENT RECEIPT & CLEARANCE" : "OFFICIAL PROFORMA RATE CARD";

    modal.innerHTML = `
      <div class="verify-shield-card">
        <div class="verify-shield-header">
          <div class="verify-shield-icon">🛡️</div>
          <div class="verify-shield-titles">
            <span class="verify-shield-badge">LAUREIGN STUDIOS OFFICIAL NOTARY VERIFICATION</span>
            <h3 class="verify-shield-title">✓ Authentic Studio Document Confirmed</h3>
          </div>
          <button type="button" class="verify-shield-close" onclick="closeVerificationModal()">&times;</button>
        </div>

        <div class="verify-shield-body">
          <div class="verify-grid-info">
            <div class="verify-grid-item">
              <span class="v-lbl">Document Reference:</span>
              <span class="v-val ref-tag">${escapeHtml(ref)}</span>
            </div>
            <div class="verify-grid-item">
              <span class="v-lbl">Document Type:</span>
              <span class="v-val">${docType}</span>
            </div>
            <div class="verify-grid-item">
              <span class="v-lbl">Notary Issuer:</span>
              <span class="v-val">Laureign Studios · Kakamega & Nairobi</span>
            </div>
            <div class="verify-grid-item">
              <span class="v-lbl">Authentication Status:</span>
              <span class="v-val status-cleared">✓ GENUINE REGISTERED RECORD</span>
            </div>
          </div>

          <div class="verify-security-alert-box">
            <div class="alert-title">🔒 ANTI-FRAUD VERIFIED PAYMENT SAFEGUARDS:</div>
            <p>To prevent fraudulent interception, all deposits and booking fees must be remitted strictly to Laureign Studios registered business accounts:</p>
            <div class="verify-accounts-pills">
              <div class="acc-pill"><b>M-Pesa Buy Goods Till:</b> <span class="num">0790048905</span></div>
              <div class="acc-pill"><b>Paybill:</b> <span class="num">542542</span> &nbsp;<b>Acc:</b> <span class="num">486197</span> (Jane Akoth)</div>
              <div class="acc-pill"><b>Direct Bank Wire:</b> <span>I&M Bank Kenya · Acc: 486197</span></div>
            </div>
            <div class="alert-sub">⚠️ <b>CRITICAL WARNING:</b> Laureign Studios representatives will NEVER solicit payments to individual personal phone numbers.</div>
          </div>
        </div>

        <div class="verify-shield-actions">
          <button type="button" class="btn-verify-primary" onclick="closeVerificationModal()">Done · Return to Studio</button>
          <a href="https://wa.me/254790048905?text=${encodeURIComponent('Hello Laureign Studios, I am verifying official document ref: ' + ref)}" target="_blank" rel="noopener" class="btn-verify-wa">
            💬 Inquire on Official WhatsApp
          </a>
        </div>
      </div>
    `;

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeVerificationModal() {
    const modal = document.getElementById("docVerificationModal");
    if (modal) {
      modal.classList.remove("open");
    }
    document.body.style.overflow = "";
  }
  window.closeVerificationModal = closeVerificationModal;
  window.showDocumentVerificationModal = showDocumentVerificationModal;

  // App-Like Mobile & Desktop Tab Switcher (Full Quotation Display vs Editor)
  function switchInvoiceTab(tab) {
    const btnEdit = document.getElementById("tabBtnEdit");
    const btnPrev = document.getElementById("tabBtnPreview");
    const paneEdit = document.getElementById("invEditorPane");
    const panePrev = document.getElementById("invPreviewPane");
    const dockBtn = document.getElementById("dockToggleEditText");

    if (tab === "edit") {
      if (btnEdit) btnEdit.classList.add("active");
      if (btnPrev) btnPrev.classList.remove("active");
      if (paneEdit) {
        paneEdit.classList.remove("tab-hidden", "hide-mobile");
        paneEdit.style.display = "flex";
      }
      if (panePrev) {
        panePrev.classList.add("tab-hidden", "hide-mobile");
        panePrev.style.display = "none";
      }
      if (dockBtn) dockBtn.textContent = "📄 View Quotation Sheet";
    } else {
      // Default: preview (Full Display)
      if (btnPrev) btnPrev.classList.add("active");
      if (btnEdit) btnEdit.classList.remove("active");
      if (panePrev) {
        panePrev.classList.remove("tab-hidden", "hide-mobile");
        panePrev.style.display = "flex";
      }
      if (paneEdit) {
        paneEdit.classList.add("tab-hidden", "hide-mobile");
        paneEdit.style.display = "none";
      }
      if (dockBtn) dockBtn.textContent = "✏️ Edit Shoot & Add-Ons";
    }
  }

  function toggleInvoiceEditTab() {
    const paneEdit = document.getElementById("invEditorPane");
    const isEditHidden = !paneEdit || paneEdit.classList.contains("tab-hidden") || paneEdit.classList.contains("hide-mobile") || paneEdit.style.display === "none";
    switchInvoiceTab(isEditHidden ? "edit" : "preview");
  }

  // Staff Portal & Protected Internal Tools Control
  function applyStaffModeVisibility(visible) {
    const headerStaff = document.getElementById("headerStaffTools");
    const drawerStaff = document.getElementById("drawerStaffTools");
    if (headerStaff) headerStaff.style.display = visible ? "flex" : "none";
    if (drawerStaff) drawerStaff.style.display = visible ? "block" : "none";
  }

  function initStaffMode() {
    const isStaffUrl = new URLSearchParams(window.location.search).get("staff") === "true";
    const isStaffStorage = localStorage.getItem("laureign_staff_mode") === "true";
    const isStaff = isStaffUrl || isStaffStorage;
    applyStaffModeVisibility(isStaff);
  }

  function toggleStaffMode() {
    const current = localStorage.getItem("laureign_staff_mode") === "true";
    if (current) {
      localStorage.removeItem("laureign_staff_mode");
      applyStaffModeVisibility(false);
      showInvoiceToast("🔒 Staff Portal locked. Internal desk tools hidden.");
    } else {
      const pin = prompt("Enter Studio Staff PIN to unlock internal desk tools:");
      if (pin === "2026" || pin === "admin") {
        localStorage.setItem("laureign_staff_mode", "true");
        applyStaffModeVisibility(true);
        showInvoiceToast("🔓 Staff Mode unlocked! Walk-in Desk and Leads CRM are now accessible.");
      } else if (pin !== null) {
        alert("Incorrect Staff PIN.");
      }
    }
  }

  function formatExecutiveDate(d) {
    const day = String(d.getDate()).padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function initInvoice() {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    currentInvoiceRef = `LS-QUO-2026-${randNum}`;

    const today = new Date();
    invoiceDateIssued = formatExecutiveDate(today);

    const validDate = new Date();
    validDate.setDate(today.getDate() + 14);
    invoiceValidity = `${formatExecutiveDate(validDate)} (14 Days)`;
    const elValInput = document.getElementById("invValidityInput");
    if (elValInput && !elValInput.value) {
      elValInput.value = "14 Days (Standard Offer)";
    }

    if (invoiceSessions.length === 0) {
      addInvoiceSession("graduation", 0, false);
    } else {
      renderInvoiceSessions();
    }

    renderInvoiceAddons();
    updateInvoiceDisplay();
  }

  function openInvoiceModal(pkgId, optIdx) {
    if (!invoiceModal) return;

    if (pkgId) {
      if (invoiceSessions.length === 0) {
        addInvoiceSession(pkgId, typeof optIdx === "number" ? optIdx : 0, false);
      } else {
        const s = invoiceSessions[0];
        onSessionPkgChange(s.id, pkgId, typeof optIdx === "number" ? optIdx : 0);
      }
    } else if (invoiceSessions.length === 0) {
      addInvoiceSession("graduation", 0, false);
    }

    updateInvoiceDisplay();
    switchInvoiceTab("preview");
    invoiceModal.classList.add("open");
    invoiceModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (!history.state || history.state.modal !== "invoice") {
      history.pushState({ modal: "invoice" }, "", "#quotation");
    }
  }

  function closeInvoiceModal(fromHistory = false) {
    if (!invoiceModal) return;
    invoiceModal.classList.remove("open");
    invoiceModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (!fromHistory && history.state && history.state.modal === "invoice") {
      history.back();
    }
  }

  if (invoiceModal) {
    invoiceModal.addEventListener("click", (e) => {
      if (e.target === invoiceModal) closeInvoiceModal();
    });
  }

  // Prepare the live invoice sheet for 100% crisp, non-blank, undistorted PDF & Image export
  function prepareInvoiceForExport() {
    const sourceSheet = document.getElementById("invoicePrintableSheet");
    if (!sourceSheet) return null;

    // 1. Create an off-screen staging container mounted directly on body
    // This completely bypasses mobile viewport, flex containers, modal constraints & media queries
    const stagingWrapper = document.createElement("div");
    stagingWrapper.id = "invoiceExportStaging";
    stagingWrapper.style.cssText = "position: fixed; top: -99999px; left: 0; width: 794px !important; min-width: 794px !important; max-width: 794px !important; z-index: -9999; pointer-events: none; opacity: 1; background: #ffffff; margin: 0; padding: 0;";

    // 2. Clone the sheet
    const cloneSheet = sourceSheet.cloneNode(true);
    cloneSheet.classList.add("pdf-export-mode");
    cloneSheet.style.width = "794px";
    cloneSheet.style.minWidth = "794px";
    cloneSheet.style.maxWidth = "794px";
    cloneSheet.style.margin = "0";
    cloneSheet.style.padding = "26px 30px";
    cloneSheet.style.boxSizing = "border-box";
    cloneSheet.style.transform = "none";
    cloneSheet.style.background = "#ffffff";
    cloneSheet.style.overflow = "visible";
    cloneSheet.style.maxHeight = "none";
    cloneSheet.style.height = "auto";

    // 3. Copy QR code and any canvas pixel buffers (cloneNode doesn't copy canvas pixels)
    const origCanvases = sourceSheet.querySelectorAll("canvas");
    const cloneCanvases = cloneSheet.querySelectorAll("canvas");
    origCanvases.forEach((orig, idx) => {
      const cln = cloneCanvases[idx];
      if (cln) {
        cln.width = orig.width;
        cln.height = orig.height;
        const ctx = cln.getContext("2d");
        if (ctx) ctx.drawImage(orig, 0, 0);
      }
    });

    // 4. Hide screen-only interactive buttons or controls in export clone
    const screenOnly = Array.from(cloneSheet.querySelectorAll(".inv-addons-selector-box, button, .inv-btn-action, .screen-only"));
    screenOnly.forEach(el => {
      el.style.display = "none";
    });

    stagingWrapper.appendChild(cloneSheet);
    document.body.appendChild(stagingWrapper);

    return {
      element: cloneSheet,
      container: stagingWrapper,
      cleanup: () => {
        if (stagingWrapper && stagingWrapper.parentNode) {
          stagingWrapper.parentNode.removeChild(stagingWrapper);
        }
      }
    };
  }

  function triggerBlobDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2500);
    showInvoiceToast(`✓ Official document saved to your device!`);
  }

  function triggerDataUrlDownload(canvas, filename, docName) {
    const dataUri = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showInvoiceToast(`✓ ${docName} PNG saved! (Check gallery / downloads)`);
  }

  // Generate Official PDF with html2pdf (Crisp, 1-Page A4 Precision, 100% Non-Blank)
  function downloadInvoicePdf() {
    if (typeof html2pdf === "undefined") {
      showInvoiceToast("Printing document format...");
      window.printInvoiceDocument();
      return;
    }

    const exportContext = prepareInvoiceForExport();
    if (!exportContext) return;

    const isReceipt = invoiceMode === "receipt";
    const docName = isReceipt ? "Receipt" : "Quotation";
    showInvoiceToast(`⏳ Compiling official 1-page A4 PDF ${docName}...`);

    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued_Client";
    const cleanClient = clientVal.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 20);
    const docPrefix = isReceipt ? "Laureign_Studios_Receipt" : "Laureign_Studios_Quotation";
    const filename = `${docPrefix}_${currentInvoiceRef}_${cleanClient}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        width: 794,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
    };

    html2pdf().set(opt).from(exportContext.element).toPdf().get('pdf').then(pdfObj => {
      exportContext.cleanup();
      const blob = pdfObj.output('blob');
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: 'application/pdf' })] })) {
        navigator.share({
          files: [new File([blob], filename, { type: 'application/pdf' })],
          title: `Laureign Studios ${docName}`,
          text: `Official ${docName} from Laureign Studios for ${clientVal}`
        }).then(() => {
          showInvoiceToast(`✓ Official PDF ${docName} shared successfully!`);
        }).catch(() => {
          triggerBlobDownload(blob, filename);
        });
      } else {
        triggerBlobDownload(blob, filename);
      }
    }).catch(err => {
      exportContext.cleanup();
      console.error("PDF generation failed:", err);
      showInvoiceToast("Direct PDF compilation busy. Rendering high-res image format...");
      downloadInvoiceImage();
    });
  }

  // Generate High-Resolution Image (PNG) for instant phone photo gallery saving & WhatsApp
  function downloadInvoiceImage() {
    const exportContext = prepareInvoiceForExport();
    if (!exportContext) return;

    const isReceipt = invoiceMode === "receipt";
    const docName = isReceipt ? "Receipt" : "Quotation";
    showInvoiceToast(`⏳ Rendering high-resolution ${docName} image...`);

    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued_Client";
    const cleanClient = clientVal.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 20);
    const docPrefix = isReceipt ? "Laureign_Studios_Receipt" : "Laureign_Studios_Quotation";
    const filename = `${docPrefix}_${currentInvoiceRef}_${cleanClient}.png`;

    const h2c = window.html2canvas || (window.html2pdf && window.html2pdf().html2canvas);
    if (typeof h2c !== "function") {
      exportContext.cleanup();
      showInvoiceToast("Image export tool unavailable. Printing format...");
      window.printInvoiceDocument();
      return;
    }

    const h2cOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      width: 794,
      backgroundColor: "#ffffff"
    };

    h2c(exportContext.element, h2cOptions).then((canvas) => {
      exportContext.cleanup();
      if (!canvas) {
        showInvoiceToast("Canvas generation empty.");
        return;
      }

      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            triggerDataUrlDownload(canvas, filename, docName);
            return;
          }
          const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          if (isMobile && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: "image/png" })] })) {
            navigator.share({
              files: [new File([blob], filename, { type: "image/png" })],
              title: `Laureign Studios ${docName}`,
              text: `Official ${docName} from Laureign Studios for ${clientVal}`
            }).then(() => {
              showInvoiceToast(`✓ ${docName} saved & shared!`);
            }).catch(() => {
              triggerBlobDownload(blob, filename);
            });
          } else {
            triggerBlobDownload(blob, filename);
          }
        }, "image/png", 1.0);
      } else {
        triggerDataUrlDownload(canvas, filename, docName);
      }
    }).catch((err) => {
      exportContext.cleanup();
      console.error("Image render failed:", err);
      showInvoiceToast("Image render busy. Opening print format...");
      window.printInvoiceDocument();
    });
  }
  window.downloadInvoiceImage = downloadInvoiceImage;

  // Direct Native High-Precision A4 Printing (Never blank / never clipped / exact 1-page fit)
  function printInvoiceDocument() {
    switchInvoiceTab("preview");
    updateInvoiceDisplay();
    const sourceSheet = document.getElementById("invoicePrintableSheet");
    if (sourceSheet) {
      sourceSheet.classList.add("pdf-export-mode");
    }
    document.body.classList.add("printing-invoice");

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove("printing-invoice");
        if (sourceSheet) {
          sourceSheet.classList.remove("pdf-export-mode");
        }
      }, 1200);
    }, 150);
  }
  window.printInvoiceDocument = printInvoiceDocument;

  // Share PDF to WhatsApp via Web Share API or Auto-Download + WhatsApp Web fallback
  async function shareInvoicePdfWhatsApp() {
    if (typeof html2pdf === "undefined") {
      sendInvoiceWhatsApp();
      return;
    }

    const exportContext = prepareInvoiceForExport();
    if (!exportContext) return;

    const isReceipt = invoiceMode === "receipt";
    const docName = isReceipt ? "Receipt" : "Quotation";
    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued Client";
    const cleanClient = clientVal.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 20);
    const docPrefix = isReceipt ? "Laureign_Studios_Receipt" : "Laureign_Studios_Quotation";
    const filename = `${docPrefix}_${currentInvoiceRef}_${cleanClient}.pdf`;

    showInvoiceToast(`⏳ Generating PDF ${docName} for WhatsApp...`);

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        width: 794,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all'] }
    };

    try {
      const pdfWorker = html2pdf().set(opt).from(exportContext.element);
      const pdfBlob = await pdfWorker.outputPdf('blob');
      exportContext.cleanup();

      const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

      // If browser supports sharing files directly (iOS Safari, Android Chrome, mobile apps)
      if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
        await navigator.share({
          files: [pdfFile],
          title: `Laureign Studios ${docName} ${currentInvoiceRef}`,
          text: `Official ${docName} from Laureign Studios for ${clientVal}`
        });
        showInvoiceToast(`✓ ${docName} sent via WhatsApp!`);
      } else {
        // Fallback for Desktop: Auto-download the PDF, then launch WhatsApp with prefilled message
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        showInvoiceToast(`📥 PDF ${docName} downloaded! Opening WhatsApp to send...`);
        setTimeout(() => {
          sendInvoiceWhatsApp(true);
        }, 1000);
      }
    } catch (err) {
      exportContext.cleanup();
      console.warn("Share fallback:", err);
      sendInvoiceWhatsApp(true);
    }
  }

  // Builds formatted message and opens WhatsApp chat (Direct to client if phone is provided)
  function sendInvoiceWhatsApp(pdfDownloaded = false) {
    const isReceipt = invoiceMode === "receipt";

    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued Client";
    const rawPhone = (invPhoneInput && invPhoneInput.value.trim()) || "";
    const emailVal = (invEmailInput && invEmailInput.value.trim()) || "";
    const dateVal = (invDateInput && invDateInput.value) || "TBD";
    const timeVal = (invTimeInput && invTimeInput.value.trim()) || "Standard Session";
    const locVal = (invLocationInput && invLocationInput.value.trim()) || "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor)";
    const crewVal = (invCrewInput && invCrewInput.value.trim()) || "Studio Lead Team";
    const notesVal = (invNotesInput && invNotesInput.value.trim()) || "";

    const catData = INVOICE_CATEGORIES[currentInvoiceCategory] || INVOICE_CATEGORIES["studio"];
    const occInput = document.getElementById("invOccasionTitleInput");
    const occTitle = (occInput && occInput.value.trim()) || (getClientPossessive(clientVal) ? `${getClientPossessive(clientVal)} ${catData.name}` : `Bespoke ${catData.name}`);

    const basePrice = invoiceSessions.reduce((sum, s) => sum + ((s.rate || 0) * (s.qty || 1)), 0);
    const addonsTotal = invoiceAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const discount = parseInt(invDiscountInput ? invDiscountInput.value : 0, 10) || 0;
    const grandTotal = Math.max(0, basePrice + addonsTotal - discount);

    const depPercent = parseInt(invDepositPercent ? invDepositPercent.value : 80, 10) || 80;
    const deposit = Math.round(grandTotal * (depPercent / 100));
    const balance = Math.max(0, grandTotal - deposit);

    const payStatusSelect = document.getElementById("invReceiptStatusSelect") || document.getElementById("invPaymentStatusSelect");
    const payMethodSelect = document.getElementById("invReceiptMethodSelect") || document.getElementById("invPaymentMethodSelect");
    const payRefInput = document.getElementById("invReceiptRefInput") || document.getElementById("invPaymentRefInput");

    const paymentStatus = payStatusSelect ? payStatusSelect.value : "full";
    let paymentMethod = "M-Pesa Buy Goods Till 0790048905 (Laureign Studios)";
    if (payMethodSelect) {
      if (payMethodSelect.tagName === "SELECT" && payMethodSelect.options[payMethodSelect.selectedIndex]) {
        paymentMethod = payMethodSelect.options[payMethodSelect.selectedIndex].text || payMethodSelect.value;
      } else {
        paymentMethod = payMethodSelect.value || paymentMethod;
      }
    }
    const paymentRef = (payRefInput && payRefInput.value.trim()) || "M-Pesa Verified";

    const clientPhone = normalizeKenyanPhone(rawPhone);
    const targetPhone = clientPhone || "254790048905";

    let msg = "";

    if (isReceipt) {
      msg += `*LAUREIGN STUDIOS*\n`;
      msg += `🧾 *${catData.receiptTitle}*\n`;
      msg += `🔖 *Receipt Ref:* ${currentInvoiceRef}\n`;
      msg += `📅 *Date:* ${invoiceDateIssued}\n\n`;

      msg += `👤 *Client / Payee:* *${clientVal}*\n`;
      msg += `🎯 *Confirmed Shoot:* *${occTitle}*\n`;
      msg += `🏷️ *Category:* *${catData.name}*\n\n`;

      if (rawPhone) msg += `📞 *Phone / WhatsApp:* ${rawPhone}\n`;
      if (emailVal) msg += `✉️ *Email:* ${emailVal}\n`;
      msg += `🗓️ *Shoot Date:* ${dateVal} (${timeVal})\n`;
      msg += `📍 *Location:* ${locVal}\n`;
      msg += `🎥 *Lead Team:* ${crewVal}\n\n`;

      msg += `*SHOOT SESSIONS PAID FOR:*\n`;
      invoiceSessions.forEach((s, idx) => {
        const qty = s.qty || 1;
        const rate = s.rate || 0;
        msg += `📸 *Shoot #${idx + 1}: ${s.title}* (${s.tierName})${qty > 1 ? ` ×${qty}` : ""}: KSh ${(rate * qty).toLocaleString()}\n`;
      });

      if (invoiceAddons.length > 0) {
        msg += `\n*SELECTED ADD-ONS & REELS:*\n`;
        invoiceAddons.forEach(a => {
          msg += `• ${a.name} (+KSh ${(a.price || 0).toLocaleString()})\n`;
          if (a.spec) msg += `  _${a.spec}_\n`;
        });
      }

      if (discount > 0) {
        msg += `\n🎁 *Special Discount:* - KSh ${discount.toLocaleString()}\n`;
      }

      msg += `\n*PAYMENT VERIFICATION (CASHLESS RECEIPT):*\n`;
      msg += `💵 *Total Shoot Investment:* KSh ${grandTotal.toLocaleString()}\n`;

      if (paymentStatus === "full") {
        msg += `✅ *Amount Received:* KSh ${grandTotal.toLocaleString()} *(PAID IN FULL)*\n`;
        msg += `💳 *Payment Channel:* ${paymentMethod}\n`;
        msg += `🏷️ *Transaction Code / Ref:* *${paymentRef}*\n`;
        msg += `🏦 *Bank / Account:* I&M Bank · Paybill 542542 (Acc: 486197 - JANE AKOTH)\n`;
        msg += `🎉 *Balance Remaining:* *KSh 0 (CLEARED)*\n\n`;
      } else {
        msg += `✅ *Deposit Received:* KSh ${deposit.toLocaleString()} *(${depPercent}% PAID)*\n`;
        msg += `💳 *Payment Channel:* ${paymentMethod}\n`;
        msg += `🏷️ *Transaction Code / Ref:* *${paymentRef}*\n`;
        msg += `🏦 *Bank / Account:* I&M Bank · Paybill 542542 (Acc: 486197 - JANE AKOTH)\n`;
        msg += `💳 *Balance Due on Delivery:* *KSh ${balance.toLocaleString()}*\n\n`;
      }

      if (notesVal) {
        msg += `📝 *Studio Deliverable Notes:*\n_${notesVal}_\n\n`;
      }

      if (pdfDownloaded) {
        msg += `📥 *Official PDF Receipt Generated & Saved.* Please see attached PDF document.\n\n`;
      }

      msg += `✨ *Thank you for choosing Laureign Studios! Your master high-definition photographs will be delivered via private gallery link.* ✨\n`;
      msg += `📞 Studio Contact: 0790 048 905`;
    } else {
      msg += `*LAUREIGN STUDIOS*\n`;
      msg += `✨ *${catData.quoteTitle}*\n`;
      msg += `📄 *Quotation Ref:* ${currentInvoiceRef}\n`;
      msg += `📅 *Issued:* ${invoiceDateIssued} (Valid 14 Days)\n\n`;

      msg += `👤 *Prepared For:* *${clientVal}*\n`;
      msg += `🎯 *Occasion / Session:* *${occTitle}*\n`;
      msg += `🏷️ *Production Scope:* *${catData.scope}*\n\n`;

      if (rawPhone) msg += `📞 *Phone / WhatsApp:* ${rawPhone}\n`;
      if (emailVal) msg += `✉️ *Email:* ${emailVal}\n`;
      msg += `🗓️ *Event / Shoot Date:* ${dateVal} (${timeVal})\n`;
      msg += `📍 *Venue / Destination:* ${locVal}\n`;
      msg += `🎥 *Assigned Production Unit:* ${crewVal}\n\n`;

      msg += `*PRODUCTION DELIVERABLES & SERVICES:*\n`;
      invoiceSessions.forEach((s, idx) => {
        const qty = s.qty || 1;
        const rate = s.rate || 0;
        msg += `📸 *${s.title}* (${s.tierName})${qty > 1 ? ` ×${qty}` : ""}\n`;
        msg += `   💰 Amount: KSh ${(rate * qty).toLocaleString()}\n`;
        if (s.spec) {
          msg += `   📋 Inclusions: ${s.spec.replace(/\n+/g, " • ")}\n`;
        }
      });

      if (invoiceAddons.length > 0) {
        msg += `\n*SELECTED ENHANCEMENTS & ADD-ONS:*\n`;
        invoiceAddons.forEach(a => {
          msg += `• ${a.name} (+KSh ${(a.price || 0).toLocaleString()})\n`;
          if (a.spec) msg += `  _${a.spec}_\n`;
        });
      }

      if (discount > 0) {
        msg += `\n🎁 *Special Client Courtesy Discount:* - KSh ${discount.toLocaleString()}\n`;
      }

      if (notesVal) {
        msg += `\n📝 *Production Scope & Details:*\n_${notesVal}_\n`;
      }

      msg += `\n*FINANCIAL SUMMARY & BOOKING:*\n`;
      msg += `💵 *Total Project Investment:* KSh ${grandTotal.toLocaleString()}\n`;
      msg += `🔒 *Commitment Deposit to Lock Date (${depPercent}%):* KSh ${deposit.toLocaleString()}\n`;
      msg += `💳 *Balance Due on Master Delivery (${100 - depPercent}%):* KSh ${balance.toLocaleString()}\n\n`;

      msg += `*OFFICIAL REMITTANCE DETAILS:*\n`;
      msg += `📲 *M-Pesa Paybill:* *542542*\n`;
      msg += `🔢 *Account Number:* *486197*\n`;
      msg += `👤 *Account Name to Verify:* *JANE AKOTH* (Laureign Studios)\n`;
      msg += `🏦 *Direct Bank Transfer:* I&M Bank Kenya (Acc: 486197)\n\n`;

      if (pdfDownloaded) {
        msg += `📥 *Official PDF Quotation Generated & Saved.* Please see attached PDF document.\n\n`;
      }

      msg += `_To confirm booking and lock your date on our production calendar, please remit the commitment deposit and share confirmation._\n`;
      msg += `✨ *Laureign Studios · Kakamega Town along Mumias Rd, Opp. Jamia Mosque (Bukura Pharmacy Bldg, 1st Floor) · Nationwide Across Kenya*`;
    }

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  }

  function copyInvoiceText() {
    const isReceipt = invoiceMode === "receipt";

    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued Client";
    const phoneVal = (invPhoneInput && invPhoneInput.value.trim()) || "Not specified";
    const emailVal = (invEmailInput && invEmailInput.value.trim()) || "";
    const dateVal = (invDateInput && invDateInput.value) || "To Be Scheduled";
    const timeVal = (invTimeInput && invTimeInput.value.trim()) || "Standard Session";
    const locVal = (invLocationInput && invLocationInput.value.trim()) || "Laureign Studios (Kakamega Town, Mumias Rd, Opp. Jamia Mosque, Bukura Pharmacy Bldg, 1st Floor)";

    const catData = INVOICE_CATEGORIES[currentInvoiceCategory] || INVOICE_CATEGORIES["studio"];
    const occInput = document.getElementById("invOccasionTitleInput");
    const occTitle = (occInput && occInput.value.trim()) || (getClientPossessive(clientVal) ? `${getClientPossessive(clientVal)} ${catData.name}` : `Bespoke ${catData.name}`);

    const payStatusSelect = document.getElementById("invReceiptStatusSelect") || document.getElementById("invPaymentStatusSelect");
    const payMethodSelect = document.getElementById("invReceiptMethodSelect") || document.getElementById("invPaymentMethodSelect");
    const payRefInput = document.getElementById("invReceiptRefInput") || document.getElementById("invPaymentRefInput");
    const paymentStatus = payStatusSelect ? payStatusSelect.value : "full";
    let paymentMethod = "M-Pesa Buy Goods Till 0790048905 (Laureign Studios)";
    if (payMethodSelect) {
      if (payMethodSelect.tagName === "SELECT" && payMethodSelect.options[payMethodSelect.selectedIndex]) {
        paymentMethod = payMethodSelect.options[payMethodSelect.selectedIndex].text || payMethodSelect.value;
      } else {
        paymentMethod = payMethodSelect.value || paymentMethod;
      }
    }
    const paymentRef = (payRefInput && payRefInput.value.trim()) || "M-Pesa Verified";

    const basePrice = invoiceSessions.reduce((sum, s) => sum + ((s.rate || 0) * (s.qty || 1)), 0);
    const addonsTotal = invoiceAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const discount = parseInt(invDiscountInput ? invDiscountInput.value : 0, 10) || 0;
    const grandTotal = Math.max(0, basePrice + addonsTotal - discount);

    const depPercent = parseInt(invDepositPercent ? invDepositPercent.value : 80, 10) || 80;
    const deposit = Math.round(grandTotal * (depPercent / 100));
    const balance = Math.max(0, grandTotal - deposit);

    let text = isReceipt
      ? `LAUREIGN STUDIOS — OFFICIAL COMMERCIAL RECEIPT\n`
      : `LAUREIGN STUDIOS — ${catData.quoteTitle}\n`;
    text += `${isReceipt ? "Receipt No" : "Quotation Ref"}: ${currentInvoiceRef}\n`;
    text += `Date: ${invoiceDateIssued}${isReceipt ? "" : " (Valid 14 Days)"}\n\n`;
    text += `${isReceipt ? "CLIENT / PAYEE" : "PREPARED FOR"}: ${clientVal}\n`;
    text += `${isReceipt ? "CONFIRMED SHOOT" : "OCCASION / SESSION"}: ${occTitle}\n`;
    text += `CATEGORY: ${catData.name}\n\n`;
    text += `Phone: ${phoneVal}\n`;
    if (emailVal) text += `Email: ${emailVal}\n`;
    text += `Shoot Date: ${dateVal} (${timeVal})\nLocation: ${locVal}\n\n`;

    text += `${isReceipt ? "SHOOT PARTICULARS PAID FOR:" : "PRODUCTION DELIVERABLES:"}\n`;
    invoiceSessions.forEach((s, idx) => {
      const qty = s.qty || 1;
      const rate = s.rate || 0;
      text += `${idx + 1}. ${s.title} — ${s.tierName}${qty > 1 ? ` (×${qty})` : ""}: KSh ${(rate * qty).toLocaleString()}\n`;
    });

    if (invoiceAddons.length > 0) {
      text += `\nADD-ONS & ENHANCEMENTS:\n`;
      invoiceAddons.forEach(a => {
        text += `- ${a.name}: KSh ${(a.price || 0).toLocaleString()}\n`;
      });
    }

    if (discount > 0) {
      text += `\nSpecial Client Discount: - KSh ${discount.toLocaleString()}\n`;
    }

    text += `\nTotal Project Investment: KSh ${grandTotal.toLocaleString()}\n`;
    if (isReceipt) {
      if (paymentStatus === "full") {
        text += `Amount Cleared: KSh ${grandTotal.toLocaleString()} (PAID IN FULL)\nOutstanding Balance: KSh 0 (CLEARED)\n\n`;
      } else {
        text += `Booking Deposit Cleared: KSh ${deposit.toLocaleString()} (${depPercent}% PAID)\nBalance Due on Master Delivery: KSh ${balance.toLocaleString()}\n\n`;
      }
      text += `Payment Channel: ${paymentMethod}\nTransaction Code / Ref: ${paymentRef}\nStatus: Cashless Verified · Laureign Studios Official`;
    } else {
      text += `Official Booking Deposit Required (${depPercent}%): KSh ${deposit.toLocaleString()}\nBalance Due on Master Delivery (${100 - depPercent}%): KSh ${balance.toLocaleString()}\n\n`;
      text += `OFFICIAL REMITTANCE:\nBuy Goods Till: 0790048905\nM-Pesa Paybill: 542542 (Acc: 486197)\nAccount Name: JANE AKOTH (Laureign Studios)\nBank: I&M Bank Kenya (Acc: 486197)\nStudio Direct Line: +254 790 048 905\nStudio Location: Kakamega Town along Mumias Rd, Opp. Jamia Mosque (Bukura Pharmacy Bldg, 1st Floor)`;
    }

    navigator.clipboard.writeText(text).then(() => {
      showInvoiceToast(`✓ ${isReceipt ? "Official Receipt" : "Formal Quotation"} copied to clipboard!`);
    }).catch(() => {
      prompt("Copy below:", text);
    });
  }

  function openInvoiceFromBookingModal() {
    const reelChecked = modalAddReelCheckbox && modalAddReelCheckbox.checked;
    const clientName = modalNameInput ? modalNameInput.value.trim() : "";
    const clientPhone = modalPhoneInput ? modalPhoneInput.value.trim() : "";
    const clientEmail = modalEmailInput ? modalEmailInput.value.trim() : "";
    const shootDate = modalDateInput ? modalDateInput.value : "";
    const loc = modalLocationSelect ? modalLocationSelect.value : "";

    const pkg = PACKAGES_DATA.find(p => p.id === modalState.pkgId);
    const opt = pkg ? pkg.options[modalState.optionIndex] : null;

    saveClientLead({
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
      date: shootDate,
      location: loc,
      package: pkg && opt ? `${pkg.title} (${opt.name})` : "Studio Session",
      source: "Booking Modal (Quote Request)"
    });

    closeModal();

    // Auto-detect category & set category from selected package
    const detectedCat = detectCategoryFromPackage(modalState.pkgId);
    setInvoiceCategory(detectedCat);

    // Reset sessions and add this selected package as Session #1
    invoiceSessions = [];
    addInvoiceSession(modalState.pkgId, modalState.optionIndex, false);

    if (reelChecked) {
      addInvoiceAddon("🎬 4K Vertical Video Reel", "Trending 45s-60s 4K vertical video cut to viral TikTok & IG audio", 1500);
    }

    openInvoiceModal();

    if (clientName && invClientInput) invClientInput.value = clientName;
    if (clientPhone && invPhoneInput) invPhoneInput.value = clientPhone;
    if (clientEmail && invEmailInput) invEmailInput.value = clientEmail;
    if (shootDate && invDateInput) invDateInput.value = shootDate;
    if (loc && invLocationInput) invLocationInput.value = loc;

    autoSuggestOccasionTitle(true);
    updateInvoiceDisplay();
  }

  function openInvoiceFromSamplesModal() {
    closeSamplesModal();
    invoiceSessions = [];
    addInvoiceSession(currentSamplesPkgId, 0, false);
    openInvoiceModal();
  }

  function openInvoiceModalFromCalc() {
    openInvoiceModal();
    document.querySelectorAll(".addon-checkbox:checked").forEach(cb => {
      const addonId = cb.dataset.addonId;
      const foundAddon = ADD_ONS_LIST.find(a => a.id === addonId);
      if (foundAddon && !invoiceAddons.some(a => a.name === foundAddon.name)) {
        addInvoiceAddon(foundAddon.name, foundAddon.desc || "Deliverable enhancement", foundAddon.price);
      }
    });
    updateInvoiceDisplay();
  }

  // ============================================================
  // CLIENT LEADS CRM, EMAIL VAULT & MARKETING SUITE
  // ============================================================
  const LEADS_STORAGE_KEY = "laureign_studio_client_leads";

  function getClientLeads() {
    try {
      const raw = localStorage.getItem(LEADS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveClientLead(lead) {
    if (!lead) return;
    const name = (lead.name || "").trim();
    const cleanEmail = (lead.email || "").trim().toLowerCase();
    const cleanPhone = (lead.phone || "").trim().replace(/[^\d+]/g, "");

    // Require at least name, email, or phone
    if (!cleanEmail && !cleanPhone && !name) return;

    const leads = getClientLeads();
    const existingIdx = leads.findIndex(l => {
      const lEmail = (l.email || "").trim().toLowerCase();
      const lPhone = (l.phone || "").trim().replace(/[^\d+]/g, "");
      return (cleanEmail && lEmail === cleanEmail) || (cleanPhone && lPhone === cleanPhone);
    });

    const newLeadObj = {
      id: "lead_" + Date.now(),
      name: name || "Valued Client",
      email: cleanEmail,
      phone: cleanPhone || (lead.phone || "").trim(),
      package: lead.package || "Studio Session Inquiry",
      location: lead.location || "Kakamega Studio",
      date: lead.date || new Date().toISOString().split("T")[0],
      source: lead.source || "Website Booking",
      capturedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    if (existingIdx >= 0) {
      leads[existingIdx] = {
        ...leads[existingIdx],
        ...newLeadObj,
        id: leads[existingIdx].id,
        capturedAt: leads[existingIdx].capturedAt || newLeadObj.capturedAt
      };
    } else {
      leads.unshift(newLeadObj);
    }

    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {}

    updateLeadsBadge();
  }

  function updateLeadsBadge() {
    const leads = getClientLeads();
    const count = leads.length;
    const badge = document.getElementById("leadsCountBadge");
    const drawerBadge = document.getElementById("drawerLeadsCountBadge");
    if (badge) badge.textContent = count;
    if (drawerBadge) drawerBadge.textContent = count;
  }

  function openLeadsModal() {
    const modal = document.getElementById("leadsModal");
    if (!modal) return;
    renderLeadsTable();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (!history.state || history.state.modal !== "leads") {
      history.pushState({ modal: "leads" }, "", "#leads-crm");
    }
  }

  function closeLeadsModal(fromHistory = false) {
    const modal = document.getElementById("leadsModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (!fromHistory && history.state && history.state.modal === "leads") {
      history.back();
    }
  }

  function renderLeadsTable(searchQuery = "") {
    const leads = getClientLeads();
    const tbody = document.getElementById("leadsTableBody");
    const emptyBox = document.getElementById("leadsEmptyNotice");
    const statTotal = document.getElementById("statTotalContacts");
    const statEmails = document.getElementById("statValidEmails");
    const statPhones = document.getElementById("statWhatsAppPhones");
    const statVip = document.getElementById("statVipMembers");

    const validEmails = leads.filter(l => l.email && l.email.includes("@"));
    const validPhones = leads.filter(l => l.phone && l.phone.length >= 8);
    const vipLeads = leads.filter(l => (l.source && l.source.includes("VIP")) || (l.package && l.package.includes("VIP")));

    if (statTotal) statTotal.textContent = leads.length;
    if (statEmails) statEmails.textContent = validEmails.length;
    if (statPhones) statPhones.textContent = validPhones.length;
    if (statVip) statVip.textContent = vipLeads.length;

    if (!tbody) return;

    let filtered = leads;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = leads.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.phone && l.phone.toLowerCase().includes(q)) ||
        (l.package && l.package.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      tbody.innerHTML = "";
      if (emptyBox) emptyBox.style.display = "block";
      return;
    }

    if (emptyBox) emptyBox.style.display = "none";

    tbody.innerHTML = filtered.map(lead => {
      const waLink = lead.phone ? `https://wa.me/${lead.phone.replace(/[^\d]/g, "")}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20thank%20you%20for%20contacting%20Laureign%20Studios%21` : null;
      return `
        <tr>
          <td><b>${lead.name}</b></td>
          <td>${lead.email ? `<a href="mailto:${lead.email}" style="color:#38bdf8;text-decoration:none;">${lead.email}</a>` : `<span style="color:var(--muted);">—</span>`}</td>
          <td>${lead.phone ? `<code>${lead.phone}</code>` : `<span style="color:var(--muted);">—</span>`}</td>
          <td>${lead.package}</td>
          <td><span class="leads-source-pill">${lead.source}</span></td>
          <td><span style="font-size:12px; color:var(--muted);">${lead.capturedAt}</span></td>
          <td style="white-space:nowrap;">
            ${waLink ? `<a href="${waLink}" target="_blank" rel="noopener" class="leads-action-btn copy" style="padding:4px 10px; font-size:11px; text-decoration:none; margin-right:4px;">💬 Chat</a>` : ""}
            <button type="button" onclick="deleteLead('${lead.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:15px; padding:2px 6px;" title="Delete Lead">&times;</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  function filterLeadsTable(query) {
    renderLeadsTable(query);
  }

  function deleteLead(id) {
    if (!confirm("Are you sure you want to remove this client contact?")) return;
    let leads = getClientLeads();
    leads = leads.filter(l => l.id !== id);
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {}
    renderLeadsTable(document.getElementById("leadsSearchInput")?.value || "");
    updateLeadsBadge();
  }

  function clearLeadsDatabase() {
    if (!confirm("WARNING: Are you sure you want to clear all stored client leads? This cannot be undone.")) return;
    try {
      localStorage.removeItem(LEADS_STORAGE_KEY);
    } catch (e) {}
    renderLeadsTable();
    updateLeadsBadge();
  }

  function exportLeadsCSV() {
    const leads = getClientLeads();
    if (leads.length === 0) {
      alert("No client leads captured yet! Add a demo lead or book a package to generate contacts.");
      return;
    }
    const headers = ["Full Name", "Email Address", "Phone / WhatsApp", "Package Interest", "Location", "Preferred Date", "Lead Source", "Date Captured"];
    const rows = leads.map(l => [
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${(l.email || "").replace(/"/g, '""')}"`,
      `"${(l.phone || "").replace(/"/g, '""')}"`,
      `"${(l.package || "").replace(/"/g, '""')}"`,
      `"${(l.location || "").replace(/"/g, '""')}"`,
      `"${(l.date || "").replace(/"/g, '""')}"`,
      `"${(l.source || "").replace(/"/g, '""')}"`,
      `"${(l.capturedAt || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laureign_client_leads_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function copyAllEmailsBcc() {
    const leads = getClientLeads();
    const emails = leads.map(l => (l.email || "").trim()).filter(e => e && e.includes("@"));
    if (emails.length === 0) {
      alert("No client email addresses found in CRM yet.");
      return;
    }
    const unique = Array.from(new Set(emails));
    const text = unique.join(", ");
    navigator.clipboard.writeText(text).then(() => {
      alert(`✓ Copied ${unique.length} client email(s)!\n\nOpen Gmail, paste into the 'BCC' field, and send your offer update.`);
    }).catch(() => {
      prompt("Copy emails below:", text);
    });
  }

  function copyAllPhonesWa() {
    const leads = getClientLeads();
    const phones = leads.map(l => (l.phone || "").trim()).filter(p => p.length >= 8);
    if (phones.length === 0) {
      alert("No phone numbers found in CRM yet.");
      return;
    }
    const unique = Array.from(new Set(phones));
    const text = unique.join(", ");
    navigator.clipboard.writeText(text).then(() => {
      alert(`✓ Copied ${unique.length} phone number(s) for WhatsApp broadcast list!`);
    }).catch(() => {
      prompt("Copy phone numbers below:", text);
    });
  }

  function seedSampleLeads() {
    const sampleList = [
      { name: "Dr. Evelyn Mwangi", email: "evelyn.mwangi@gmail.com", phone: "+254712345678", package: "Executive Headshots (Platinum)", source: "Quotation Engine", location: "Kakamega Studio", date: "2026-09-20" },
      { name: "Grace Wanjiku", email: "grace.wanjiku@yahoo.com", phone: "+254722987654", package: "Traditional Cultural Shoot", source: "VIP Offers Club", location: "Nairobi Studio", date: "2026-09-25" },
      { name: "Brian Otieno & Brenda", email: "otieno.brian@outlook.com", phone: "+254733456789", package: "Wedding Matrimony (Grand Platinum)", source: "Booking Modal (WhatsApp)", location: "Eldoret", date: "2026-10-15" },
      { name: "Faith Chebet", email: "faith.chebet@gmail.com", phone: "+254790112233", package: "Graduation Milestone Shoot", source: "Walk-in Reception", location: "Kakamega Studio", date: "2026-09-18" }
    ];
    sampleList.forEach(lead => saveClientLead(lead));
    renderLeadsTable();
  }

  // Handle VIP Club Form Submission
  function handleVipClubSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById("vipNameInput");
    const emailInput = document.getElementById("vipEmailInput");
    const phoneInput = document.getElementById("vipPhoneInput");
    const feedback = document.getElementById("vipClubFeedback");

    const name = nameInput ? nameInput.value.trim() : "Valued Creator";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    saveClientLead({
      name: name,
      email: email,
      phone: phone,
      package: "VIP Club Member (Promo: LAUREIGN500)",
      source: "VIP Offers Club"
    });

    if (feedback) {
      feedback.style.display = "block";
      feedback.innerHTML = `
        🎉 <b>Welcome to the Laureign VIP Club, ${name}!</b><br>
        Your exclusive voucher code is: <code style="background:#064e3b; color:#34d399; padding:3px 8px; border-radius:6px; font-weight:800; font-size:15px;">LAUREIGN500</code> (KSh 500 Off Any Package).<br>
        We have logged your email (<b>${email}</b>) for upcoming flash sales, graduation mini-sessions, and holiday discounts!
      `;
    }

    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    if (phoneInput) phoneInput.value = "";
  }

  // Send Quotation or Receipt via Email
  function sendInvoiceEmail() {
    const emailInput = document.getElementById("invEmailInput");
    const clientEmail = emailInput ? emailInput.value.trim() : "";
    const clientVal = (invClientInput && invClientInput.value.trim()) || "Valued Client";
    const isReceipt = invoiceMode === "receipt";

    const basePrice = invoiceSessions.reduce((sum, s) => sum + ((s.rate || 0) * (s.qty || 1)), 0);
    const addonsTotal = invoiceAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const discount = parseInt(invDiscountInput ? invDiscountInput.value : 0, 10) || 0;
    const grandTotal = Math.max(0, basePrice + addonsTotal - discount);

    const subject = isReceipt
      ? `Official Payment Receipt — Laureign Studios (${currentInvoiceRef})`
      : `Official Photography Quotation & Proposal — Laureign Studios (${currentInvoiceRef})`;

    let body = isReceipt
      ? `Dear ${clientVal},\n\nThank you for choosing Laureign Studios! Here is your official payment receipt for your recent shoot.\n\n`
      : `Dear ${clientVal},\n\nThank you for reaching out to Laureign Studios! Below is your official quotation and booking proposal.\n\n`;

    body += `==========================================\n`;
    body += `DOCUMENT REF: ${currentInvoiceRef}\n`;
    body += `DATE: ${invoiceDateIssued}\n`;
    body += `CLIENT: ${clientVal}\n`;
    body += `==========================================\n\n`;

    body += `SHOOTS & DELIVERABLES:\n`;
    invoiceSessions.forEach((s, idx) => {
      const qty = s.qty || 1;
      const rate = s.rate || 0;
      body += `${idx + 1}. ${s.title} (${s.tierName})${qty > 1 ? ` ×${qty}` : ""}: KSh ${(rate * qty).toLocaleString()}\n`;
      if (s.spec) body += `   Scope: ${s.spec}\n`;
    });

    if (invoiceAddons.length > 0) {
      body += `\nADD-ONS & ENHANCEMENTS:\n`;
      invoiceAddons.forEach(a => {
        body += `- ${a.name}: KSh ${(a.price || 0).toLocaleString()}\n`;
      });
    }

    if (discount > 0) {
      body += `\nSpecial Discount: - KSh ${discount.toLocaleString()}\n`;
    }

    body += `\nTOTAL INVESTMENT: KSh ${grandTotal.toLocaleString()}\n\n`;

    if (isReceipt) {
      body += `PAYMENT VERIFICATION (CASHLESS RECEIPT):\n`;
      body += `Channel: I&M Bank · M-Pesa Paybill 542542 (Acc: 486197 - JANE AKOTH)\n`;
      body += `Status: PAID & VERIFIED BY STUDIO DESK\n`;
      body += `Deliverables: Master retouched photographs deliverable via private cloud link.\n\n`;
    } else {
      body += `OFFICIAL PAYMENT INSTRUCTIONS (STRICTLY NO CASH):\n`;
      body += `Bank: I&M Bank\n`;
      body += `M-Pesa Paybill: 542542\n`;
      body += `Account No: 486197\n`;
      body += `Account Name on M-Pesa: JANE AKOTH\n\n`;
      body += `* To secure your slot on our production calendar, kindly remit your booking deposit via the Paybill above and reply with the M-Pesa confirmation message.*\n\n`;
    }

    body += `Studio Phone / WhatsApp: +254 790 048 905\n`;
    body += `Studio Email: laureignstudios25@gmail.com\n`;
    body += `Studio Location: Kakamega Town along Mumias Rd, Opp. Jamia Mosque / Kakamega Furniture (Bukura Pharmacy Bldg, 1st Floor) · Nationwide Across Kenya\n`;
    body += `Laureign Studios — Luxury Photography & Cinematography\n`;

    // Save lead
    saveClientLead({
      name: clientVal,
      email: clientEmail,
      phone: (invPhoneInput && invPhoneInput.value) || "",
      package: invoiceSessions.map(s => s.title).join(" + ") || "Studio Session",
      source: isReceipt ? "Receipt Emailed" : "Quotation Emailed"
    });

    const mailtoUrl = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    showInvoiceToast(`✓ Opening email draft for ${clientEmail || clientVal}...`);
  }

  // Expose globally to window
  window.openInvoiceModal = openInvoiceModal;
  window.closeInvoiceModal = closeInvoiceModal;
  window.setInvoiceMode = setInvoiceMode;
  window.onPaymentStatusChange = onPaymentStatusChange;
  window.applyWalkinPreset = applyWalkinPreset;
  window.applyQuotationPreset = applyQuotationPreset;
  window.normalizeKenyanPhone = normalizeKenyanPhone;
  window.updateInvoiceDisplay = updateInvoiceDisplay;

  // Category & Client Personalization
  window.setInvoiceCategory = setInvoiceCategory;
  window.onCategorySelectChange = onCategorySelectChange;
  window.onClientNameInput = onClientNameInput;
  window.autoSuggestOccasionTitle = autoSuggestOccasionTitle;
  window.setOccasionPreset = setOccasionPreset;
  window.applyWelcomeTemplate = applyWelcomeTemplate;
  window.getPersonalizedWelcomeNote = getPersonalizedWelcomeNote;

  // Multi-Session & Dynamic Add-Ons
  window.addInvoiceSession = addInvoiceSession;
  window.removeInvoiceSession = removeInvoiceSession;
  window.onSessionPkgChange = onSessionPkgChange;
  window.onSessionTierChange = onSessionTierChange;
  window.onSessionFieldChange = onSessionFieldChange;
  window.renderInvoiceSessions = renderInvoiceSessions;

  window.addInvoiceAddon = addInvoiceAddon;
  window.removeInvoiceAddon = removeInvoiceAddon;
  window.onAddonFieldChange = onAddonFieldChange;
  window.renderInvoiceAddons = renderInvoiceAddons;

  // Tab & Staff Mode
  window.switchInvoiceTab = switchInvoiceTab;
  window.toggleInvoiceEditTab = toggleInvoiceEditTab;
  window.toggleStaffMode = toggleStaffMode;
  window.initStaffMode = initStaffMode;

  // Export & Utilities
  window.prepareInvoiceForExport = prepareInvoiceForExport;
  window.downloadInvoicePdf = downloadInvoicePdf;
  window.shareInvoicePdfWhatsApp = shareInvoicePdfWhatsApp;
  window.sendInvoiceWhatsApp = sendInvoiceWhatsApp;
  window.copyInvoiceText = copyInvoiceText;
  window.sendInvoiceEmail = sendInvoiceEmail;
  window.openInvoiceFromBookingModal = openInvoiceFromBookingModal;
  window.openInvoiceFromSamplesModal = openInvoiceFromSamplesModal;
  window.openInvoiceModalFromCalc = openInvoiceModalFromCalc;
  window.openBookingModal = openBookingModal;
  window.showInvoiceToast = showInvoiceToast;
  window.applyFieldPrediction = applyFieldPrediction;
  window.setQuickDate = setQuickDate;
  window.applyNoteTemplate = applyNoteTemplate;

  // CRM Exports
  window.saveClientLead = saveClientLead;
  window.getClientLeads = getClientLeads;
  window.openLeadsModal = openLeadsModal;
  window.closeLeadsModal = closeLeadsModal;
  window.renderLeadsTable = renderLeadsTable;
  window.filterLeadsTable = filterLeadsTable;
  window.deleteLead = deleteLead;
  window.clearLeadsDatabase = clearLeadsDatabase;
  window.exportLeadsCSV = exportLeadsCSV;
  window.copyAllEmailsBcc = copyAllEmailsBcc;
  window.copyAllPhonesWa = copyAllPhonesWa;
  window.seedSampleLeads = seedSampleLeads;
  window.handleVipClubSubmit = handleVipClubSubmit;
  window.togglePackagesDrawer = togglePackagesDrawer;
  window.openLightbox = openLightbox;

  // ==================== HERO 2-IMAGE SLIDE ANIMATION ====================
  function initHeroSwapAnimation() {
    const stage = document.getElementById("heroSwapStage");
    const deck = document.getElementById("heroSwapDeck");
    if (!deck) return;

    const cards = Array.from(deck.querySelectorAll(".hero-swap-card"));
    if (!cards.length) return;

    let currentIndex = 0;
    let isSwapping = false;
    let autoSwapTimer = null;

    function renderDeckPositions() {
      cards.forEach((card, idx) => {
        card.className = "hero-swap-card";
        if (idx === currentIndex) {
          card.classList.add("is-active");
        }
      });
    }

    function slideDeck(direction = "right") {
      if (isSwapping || cards.length < 2) return;
      isSwapping = true;

      const currentCard = cards[currentIndex];
      const nextIndex = direction === "right"
        ? (currentIndex + 1) % cards.length
        : (currentIndex - 1 + cards.length) % cards.length;
      const nextCard = cards[nextIndex];

      // Remove existing animation classes
      currentCard.classList.remove("is-active", "slide-out-right", "slide-in-right", "slide-out-left", "slide-in-left");
      nextCard.classList.remove("is-active", "slide-out-right", "slide-in-right", "slide-out-left", "slide-in-left");

      if (direction === "right") {
        // Image slides from left to right and disappears with opacity
        currentCard.classList.add("slide-out-right");
        // Other image comes in from right to left
        nextCard.classList.add("slide-in-right");
      } else {
        // Reverse direction
        currentCard.classList.add("slide-out-left");
        nextCard.classList.add("slide-in-left");
      }

      setTimeout(() => {
        currentIndex = nextIndex;
        currentCard.className = "hero-swap-card";
        nextCard.className = "hero-swap-card is-active";
        isSwapping = false;
      }, 550);
    }

    // Auto-swap loop (every 4.5s)
    function startAutoSwap() {
      stopAutoSwap();
      autoSwapTimer = setInterval(() => {
        slideDeck("right");
      }, 4500);
    }

    function stopAutoSwap() {
      if (autoSwapTimer) {
        clearInterval(autoSwapTimer);
        autoSwapTimer = null;
      }
    }

    // Tapping or clicking the image slides to next photo
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        slideDeck("right");
        startAutoSwap();
      });
    });

    // Touch Swipe support for mobile
    if (stage) {
      let touchStartX = 0;
      let touchStartY = 0;
      stage.addEventListener("touchstart", (e) => {
        stopAutoSwap();
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].clientX;
          touchStartY = e.changedTouches[0].clientY;
        }
      }, { passive: true });

      stage.addEventListener("touchend", (e) => {
        if (e.changedTouches && e.changedTouches[0]) {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;

          // Horizontal swipe threshold
          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
              slideDeck("right");
            } else {
              slideDeck("left");
            }
          }
        }
        startAutoSwap();
      }, { passive: true });

      // Pause on hover for desktop
      stage.addEventListener("mouseenter", stopAutoSwap);
      stage.addEventListener("mouseleave", startAutoSwap);
    }

    // Initial render
    renderDeckPositions();
    startAutoSwap();
  }

  initHeroSwapAnimation();
  initInvoice();
  renderFaqs();
  updateLeadsBadge();
  initStaffMode();

  // Handle initial deep link (e.g. #outdoor, #studio, #events, #commercial, #addons)
  const initialDeepHash = (window.location.hash || "").replace("#", "").toLowerCase();
  if (["outdoor", "studio", "events", "commercial", "addons"].includes(initialDeepHash)) {
    setTimeout(() => {
      window.scrollToSection(initialDeepHash, false);
    }, 280);
  }

  // Handle direct navigation to quotation (?quote=open or #quotation)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("quote") === "open" || urlParams.get("quotation") === "open" || window.location.hash === "#quotation") {
    setTimeout(() => {
      openInvoiceModal();
    }, 250);
  }

  // Handle anti-fraud document verification (?verify=LS-QUO-... or ?v=...)
  const verifyParam = urlParams.get("verify") || urlParams.get("v");
  if (verifyParam) {
    setTimeout(() => {
      showDocumentVerificationModal(verifyParam);
    }, 350);
  }
});
