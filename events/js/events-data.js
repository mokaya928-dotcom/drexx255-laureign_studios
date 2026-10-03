// ============================================================
//  LAUREIGHN EVENTS — Flagship Event Showcase & Works Database
//  Brand: Laureighn Events · Luxury Event Cinema & Photography
//  Official Direct Line & WhatsApp: +254 790 048 905
//  Pan-Kenya & Destination Event Coverage
// ============================================================

const EVENTS_CATEGORIES = [
  { id: "all", label: "All Selected Works", icon: "✨", countBadge: "30+" },
  { id: "weddings", label: "Holy Matrimony & Weddings", icon: "💍", countBadge: "Weddings" },
  { id: "traditional", label: "Traditional & Cultural Ruracio", icon: "👑", countBadge: "Cultural" },
  { id: "corporate", label: "Corporate Summits & Galas", icon: "🏛️", countBadge: "Corporate" },
  { id: "birthdays", label: "Milestone Birthdays & Bashes", icon: "🎂", countBadge: "Birthdays" },
  { id: "graduations", label: "Graduations & Honors", icon: "🎓", countBadge: "Graduation" },
  { id: "nightlife", label: "VIP Nightlife & Concerts", icon: "🍸", countBadge: "Nightlife" },
  { id: "hospitality", label: "Hospitality & Venue Launches", icon: "🏨", countBadge: "Hospitality" },
  { id: "memorials", label: "Celebration of Life & Legacy", icon: "🕊️", countBadge: "Memorials" }
];

const EVENTS_PROJECTS = [
  {
    id: "holy-matrimony-gala",
    title: "The Regal Holy Matrimony & Evening Reception",
    category: "weddings",
    categoryLabel: "Holy Matrimony",
    location: "Runda & Karen, Nairobi",
    year: "2026",
    badge: "💍 Signature Matrimony",
    summary: "Full-day wedding cinema & high-fashion documentary photography. From intimate dawn bridal preparation and cathedral vow exchange to a breathtaking marquee garden reception with 400 esteemed guests.",
    cover: "../packages/images/work-1.jpg",
    coverThumb: "../packages/images/work-1_thumb.jpg",
    guestCount: "400 Guests",
    duration: "Full-Day (14 Hours)",
    crew: "2 Cinema Operators, 2 Master Photographers, 1 Drone Pilot",
    equipment: "Dual Sony FX3 + A7IV Cinema Bodies, G-Master 24-70 f/2.8 & 85mm f/1.4, DJI Ronin RS3, DJI Air 3 4K60 Drone",
    deliverables: [
      "4K Cinematic Master Highlight Film (7-9 mins)",
      "Full Ceremony & Speeches Documentary Edit",
      "550+ Magazine-Grade Hand-Retouched High-Res Photos",
      "48-Hour Viral Social Sneak Peek Teaser (60s)",
      "Archival Handcrafted Wooden Photo Keepsake Mount"
    ],
    story: "Sharon and Kelvin's matrimony was an ethereal blend of timeless romance and grand family celebration. Our cinema team moved like quiet phantoms across the church aisle and ballroom reception, capturing tender tears during the father-daughter dance and electrifying joy when the live band took the stage.",
    clientReview: {
      quote: "Laureighn Events captured our vows with so much soul and elegance. When we watched the highlight reel, we both burst into tears of absolute joy. They were prompt, unobtrusive, and delivered our teasers in less than 48 hours!",
      author: "Sharon & Kelvin M.",
      role: "Bride & Groom"
    },
    gallery: [
      { url: "../packages/images/work-1.jpg", caption: "The Grand Regal Couple · Golden Hour Cathedral Grounds" },
      { url: "../packages/samples/events/wedding-coverage/work-1.jpg", caption: "The Holy Vows Exchange & Altar Blessing" },
      { url: "../packages/images/work-7.jpg", caption: "Timeless Bridal Portrait · Master Softbox Illumination" },
      { url: "../packages/images/work-4.jpg", caption: "Bridal Party Joy & Champagne Toast" },
      { url: "../packages/images/work-9.jpg", caption: "Evening Reception Elegance & Marquee Lighting" },
      { url: "../packages/samples/events/wedding-coverage/cover.jpg", caption: "First Dance Romance Under The Stars" }
    ]
  },
  {
    id: "royal-traditional-ruracio",
    title: "The Royal Cultural Dowry Rites & Traditional Ruracio",
    category: "traditional",
    categoryLabel: "Traditional Ruracio",
    location: "Western Kenya Circuit",
    year: "2026",
    badge: "👑 Cultural Heritage",
    summary: "A deeply vibrant celebration of ancestral unity, traditional negotiations, elder blessings, colorful kitenge regalia, and exhilarating African rhythm.",
    cover: "../packages/samples/events/traditional-wedding/cover.jpg",
    coverThumb: "../packages/samples/events/traditional-wedding/cover_thumb.jpg",
    guestCount: "350 Guests",
    duration: "Full-Day (10 Hours)",
    crew: "2 Cinematographers, 1 Master Portrait Photographer",
    equipment: "Sony Cinema Line, 35mm f/1.4 GM, 85mm f/1.4 GM, Sennheiser Dual Wireless Lavaliers",
    deliverables: [
      "Cultural Rite & Negotiations Cinema Feature",
      "Elder Blessing Archival Audio & Video",
      "350 Retouched Vibrant Cultural Portraits",
      "Same-Week 48hr Social Teaser",
      "Premium Family Photo Mounts"
    ],
    story: "Documenting authentic cultural heritage demands deep cultural respect and lightning-fast reflexes. From the symbolic arrival of the groom's delegation and traditional songs at the homestead gate to the ceremonial blessing rites with elders, every authentic gesture was preserved in vivid 4K color.",
    clientReview: {
      quote: "They respected every single cultural rite and captured both families uniting with such majestic honor. The colors of our traditional attire look stunning in every single shot!",
      author: "Brenda & Brian O.",
      role: "Couple & Families"
    },
    gallery: [
      { url: "../packages/samples/events/traditional-wedding/cover.jpg", caption: "Regal Cultural Regalia & Ancestral Pride" },
      { url: "../packages/samples/events/traditional-wedding/BRA (2).jpg", caption: "The Joyous Entrance of the Bridal Delegation" },
      { url: "../packages/samples/events/traditional-wedding/BRA (5).jpg", caption: "Traditional Attire Details & Intricate Beadwork" },
      { url: "../packages/samples/events/traditional-wedding/BRA (17).jpg", caption: "Elder Blessings & Ceremonial Libations" },
      { url: "../packages/samples/events/traditional-wedding/BRA (22).jpg", caption: "Generational Family Unity & Celebration" }
    ]
  },
  {
    id: "imani-21st-birthday-gala",
    title: "Imani's 21st Milestone Birthday & Glamour Gala",
    category: "birthdays",
    categoryLabel: "Milestone Celebration",
    location: "Golf Hotel Gardens, Kakamega",
    year: "2026",
    badge: "🎂 21st Milestone Extravaganza",
    summary: "An extravagant 21st milestone celebration featuring couture evening gown portraits, custom golden balloon architecture, champagne tower toast, and electric dance floor.",
    cover: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8315.JPG",
    coverThumb: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8315.JPG",
    guestCount: "120 VIP Guests",
    duration: "6 Hours Coverage",
    crew: "1 Master Fashion Photographer, 1 Cinema Reel Specialist",
    equipment: "Sony A7IV, 50mm f/1.2 GM, Off-Camera Godox V1 Pro with MagMod Octa, 4K Cinema Gimbal",
    deliverables: [
      "Trending 9:16 Instagram & TikTok 4K Reels",
      "180 High-End Magazine Retouched Images",
      "Step-and-Repeat Red Carpet VIP Guest Gallery",
      "Champagne Toast & Cake Ceremony Video Edit"
    ],
    story: "Imani celebrated her 21st milestone in breathtaking couture style. We provided full high-fashion studio-grade lighting on location in the garden pavilion, creating crisp, luminous skin tones that transformed the birthday lawn into a red carpet runway.",
    clientReview: {
      quote: "I felt like a supermodel on my 21st! The lighting was unreal, every single photo looked straight out of Vogue, and my friends are still sharing the reels weeks later!",
      author: "Imani K.",
      role: "Host & Celebrant"
    },
    gallery: [
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8315.JPG", caption: "The Birthday Queen · Golden Gown Glamour" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8387.JPG", caption: "Champagne Toast & Sparkling Cheers" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8399.JPG", caption: "Candids with Best Friends & VIP Guests" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8122.JPG", caption: "Cake Cutting Ceremony & Golden Sparklers" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8316.JPG", caption: "Sunset Glow & Garden Pavilion Elegance" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8423.JPG", caption: "Dance Floor Energy & Celebration Vibe" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8084.JPG", caption: "Chic Decor, Floral Walls & Velvet Accents" },
      { url: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8099.JPG", caption: "Candid Laughter & Memorable Moments" }
    ]
  },
  {
    id: "western-kenya-corporate-summit",
    title: "Western Kenya Corporate Leadership Summit & Gala",
    category: "corporate",
    categoryLabel: "Corporate Summit",
    location: "Acacia Premier Grand Ballroom, Kisumu",
    year: "2026",
    badge: "🏛️ Executive Summit & Gala",
    summary: "High-level 2-day business conference, keynote addresses, fireside panel discussions, executive step-and-repeat headshot lounge, and prestigious corporate awards dinner.",
    cover: "../packages/samples/events/corporate-event/COPORATE EVENT COVERAGE.jpg",
    coverThumb: "../packages/samples/events/corporate-event/COPORATE EVENT COVERAGE_thumb.jpg",
    guestCount: "280 Delegates & CEOs",
    duration: "2-Day Summit (16 Hours)",
    crew: "2 Event Documentarians, 1 Sound Engineer, 1 Quick-Turnaround Media Editor",
    equipment: "Sony FX3 & A7IV, Broadcast Telephoto 70-200mm f/2.8 GM II, XLR Direct Stage Feed, Multi-Room Transmitters",
    deliverables: [
      "Same-Day 4-Hour Press Release Photo Dispatch (50 Photos)",
      "Complete Keynote & Panel Audio/Video Recordings",
      "Executive Step-and-Repeat Digital Lounge (Instant QR Delivery)",
      "Comprehensive Annual Report Photography Asset Library (400+ Photos)",
      "High-Impact 2-Minute Corporate Recap Sizzle Reel"
    ],
    story: "Handling enterprise events requires rigorous precision, discreet movement on stage, and lightning-fast media asset delivery for immediate press and social channels. Our team delivered same-day press photos before the morning keynote even adjourned.",
    clientReview: {
      quote: "Flawless corporate execution. The media team was punctual, dressed immaculately in black suits, and their expedited photo delivery allowed us to beat all regional news desks to the press announcement.",
      author: "Director of Corporate Communications",
      role: "Regional Enterprise Consortium"
    },
    gallery: [
      { url: "../packages/samples/events/corporate-event/COPORATE EVENT COVERAGE.jpg", caption: "Grand Summit Stage & Keynote Presentation" },
      { url: "../packages/samples/events/corporate-event/CORPORATE PORTRAIT SHOOT.jpg", caption: "Executive Leadership Step-and-Repeat Lounge" },
      { url: "../packages/samples/events/corporate-event/DSC02822.jpgj_status.jpg", caption: "Distinguished Panelist Symposium & Audience Q&A" },
      { url: "../packages/samples/events/corporate-event/DSC02830.jpgh_status.jpg", caption: "VIP Bilateral Networking & Corporate Handshakes" },
      { url: "../packages/samples/events/corporate-event/DSC02836.jpgh_status.jpg", caption: "Keynote Address by Industry Managing Director" },
      { url: "../packages/samples/events/corporate-event/DSC02840.jpgh_status.jpg", caption: "Innovation Exhibition Booths & Product Demos" },
      { url: "../packages/samples/events/corporate-event/DSC02856.jpgu.jpgg_status.jpg", caption: "Corporate Awards Banquet & Trophy Presentations" },
      { url: "../packages/samples/events/corporate-event/DSC02891.jpgj_status.jpg", caption: "Gala Dinner Toast & Commemorative Delegates Group Shot" }
    ]
  },
  {
    id: "doctoral-commencement-banquet",
    title: "Dr. Faith's Doctoral Convocation & Honorary Banquet",
    category: "graduations",
    categoryLabel: "Academic Milestone",
    location: "Kakamega & Private Country Estate",
    year: "2026",
    badge: "🎓 Doctoral Convocation",
    summary: "Full academic convocation gown documentation, ceremonial hooding, multi-generational family banquet, honorary speeches, and bespoke wooden wall portrait mounts.",
    cover: "../packages/samples/events/graduation-events/cover.jpg",
    coverThumb: "../packages/samples/events/graduation-events/cover_thumb.jpg",
    guestCount: "150 Family & Dignitaries",
    duration: "Full-Day Coverage (8 Hours)",
    crew: "1 Lead Portraitist, 1 Cinema Operator",
    equipment: "Sony A7IV, 85mm f/1.4 GM, 24-70mm f/2.8 GM, Portable Godox Battery Strobe Kit",
    deliverables: [
      "Convocation Gown & Hooding Honorary Session",
      "Family Generations Commemorative Portrait Suite",
      "Evening Banquet Speeches & Thanksgiving Prayer Video",
      "A2 Wooden Museum-Grade Archival Wall Mount",
      "200 High-Res Gallery Photos"
    ],
    story: "Attaining a doctorate represents years of sacrifice, perseverance, and family pride. We documented Dr. Faith from the morning regalia styling through the university procession, culminating in a deeply emotional family thanksgiving banquet.",
    clientReview: {
      quote: "They made my doctoral milestone feel like a royal coronation. The portraits with my aging parents brought tears to our eyes. Truly the finest event photographers in Western Kenya!",
      author: "Dr. Faith A.",
      role: "PhD Graduate & Honoree"
    },
    gallery: [
      { url: "../packages/samples/events/graduation-events/cover.jpg", caption: "Honorary Convocation Cap & Gown Portrait" },
      { url: "../packages/samples/events/graduation-events/PRI_4998.jpg", caption: "Ceremonial Hooding & Academic Regalia Pride" },
      { url: "../packages/samples/events/graduation-events/PRI_5013.jpg", caption: "Triumphant Convocation Walk Across Campus" },
      { url: "../packages/samples/events/graduation-events/PRI_5363.jpg", caption: "Three Generations of Family Standing in Pride" },
      { url: "../packages/samples/events/graduation-events/PRI_5412.jpg", caption: "Celebratory Toast at the Evening Country Feast" },
      { url: "../packages/samples/events/graduation-events/PRI_5893.jpg", caption: "Candid Smiles & Joyful Hugs from Siblings" },
      { url: "../packages/samples/events/graduation-events/SHE_1757.JPG", caption: "Formal Executive Degree Portrait Session" },
      { url: "../packages/samples/events/graduation-events/SHE_1765.JPG", caption: "Traditional Blessings & Family Prayer Dedication" },
      { url: "../packages/samples/events/graduation-events/SHE_1773.JPG", caption: "Evening Dance & Celebratory Festivities" }
    ]
  },
  {
    id: "ariana-carianah-fairytale-1st",
    title: "Ariana & Carianah's Fairytale 1st Birthday Wonder",
    category: "birthdays",
    categoryLabel: "1st Birthday Milestone",
    location: "Private Garden Estate, Western Kenya",
    year: "2026",
    badge: "🎂 Twin Milestone Fairytale",
    summary: "Pastel wonderland themed 1st birthday party celebrating twin blessings. Balloon architecture, bespoke dual-cake display, joyful baby candids, and playful family portraits.",
    cover: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2460.jpg",
    coverThumb: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2460.jpg",
    guestCount: "80 Guests & Little Ones",
    duration: "5 Hours Coverage",
    crew: "1 Master Event Photographer, 1 Assistant",
    equipment: "Sony A7IV, High-Speed Continuous Shutter, 35mm f/1.4 GM & 50mm f/1.2 GM",
    deliverables: [
      "140 Crisp Action & Candid Baby Portraits",
      "Decor & Theme Master Details Collection",
      "Cake Smash Highlight Sequence",
      "Family Heirloom Print Mount"
    ],
    story: "Photographing toddlers requires endless patience, gentle energy, and rapid reflex timing. We captured precious genuine smiles, curious eyes discovering birthday balloons, and the heartfelt love of their parents.",
    clientReview: {
      quote: "Working with twin one-year-olds is no joke, but Laureighn's crew was so patient, gentle, and caught the most precious smiles! These photos are pure gold to our family.",
      author: "The Naliaka Family",
      role: "Proud Parents"
    },
    gallery: [
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2460.jpg", caption: "Joyful Twin Milestone Celebration & Balloon Fantasy" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2370.jpg", caption: "Bespoke Pastel Decor & Custom Birthday Stage" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2374.jpg", caption: "Sweet Moments With Mom & Dad" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2432.jpg", caption: "Playful Toddler Candids & Joyful Games" }
    ]
  },
  {
    id: "andrew-black-tie-milestone",
    title: "Andrew's Sophisticated Black-Tie Celebration",
    category: "birthdays",
    categoryLabel: "Executive Milestone",
    location: "Grand Ballroom Lounge",
    year: "2026",
    badge: "🎂 Black-Tie Milestone",
    summary: "A distinguished evening gala commemorating an executive's milestone decade. Tuxedo dress code, saxophone performances, heartfelt tributes, and bespoke vintage cocktail bar.",
    cover: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2370.jpg",
    coverThumb: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2370.jpg",
    guestCount: "95 Distinguished Guests",
    duration: "5 Hours Evening Coverage",
    crew: "1 Senior Portraitist, 1 Cinema Reel Producer",
    equipment: "Sony FX3, 24-70mm f/2.8 GM II, Off-Camera Godox Wireless Strobes, Cine Diffusion Filters",
    deliverables: [
      "Cinematic Black-Tie Evening Teaser Film",
      "120 Hand-Retouched Formal & Candid Portraits",
      "VIP Arrival Red Carpet Photo Suite",
      "Keynote Speeches & Toast Video Record"
    ],
    story: "An affair of refined taste and warm brotherhood. Our subtle off-camera flash gave the room a cinematic warmth without interrupting intimate conversations, capturing dignified toasts and memorable brotherhood camaraderie.",
    clientReview: {
      quote: "They delivered pure class. The mood lighting, the candids, and the crisp sound recording of the speeches made this an unforgettable keepsake.",
      author: "Andrew W.",
      role: "Host & Celebrant"
    },
    gallery: [
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2370.jpg", caption: "The Distinguished Host · Black-Tie Arrival" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2374.jpg", caption: "Brotherhood Toasts & Vintage Cocktail Lounge" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2432.jpg", caption: "Live Saxophone Melodies & Ambiance" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2460.jpg", caption: "Tribute Speeches & Heartfelt Laughter" },
      { url: "../packages/samples/events/birthday-events/ANDREW'S BIRTHDAY/IMG_2467.jpg", caption: "Late-Night Celebration & Dance Floor Finale" }
    ]
  },
  {
    id: "kakamega-golf-hotel-hospitality-gala",
    title: "Golf Hotel Luxury Hospitality & Culinary Showcase",
    category: "hospitality",
    categoryLabel: "Luxury Hospitality",
    location: "Kakamega Golf Hotel & Resort",
    year: "2026",
    badge: "🏨 Luxury Hospitality Showcase",
    summary: "Architectural resort photography, twilight swimming pool ambiance, fine-dining gastronomy plating, executive suites, and corporate cocktail launch.",
    cover: "../packages/samples/events/hotel-events/cover.jpg",
    coverThumb: "../packages/samples/events/hotel-events/cover_thumb.jpg",
    guestCount: "180 VIP Invitees",
    duration: "Full-Day & Twilight (10 Hours)",
    crew: "2 Commercial Media Specialists, 1 Aerial Drone Pilot",
    equipment: "Sony A7IV, Ultra-Wide 14mm f/1.8 GM, 90mm f/2.8 Macro, Drone 4K HDR",
    deliverables: [
      "High-Definition Architectural & Interior Photo Suite",
      "Executive Suites & Presidential Villa Showcase",
      "Chef's Culinary Art & Fine-Dining Closeups",
      "Aerial Twilight Drone Overviews",
      "Social Media Hospitality Promotional Cut"
    ],
    story: "Capturing luxury hospitality requires harmonizing natural golden-hour sunlight with ambient architectural fixtures. From the lush greens of the golf course to glistening twilight poolside cocktails, the essence of high hospitality was immortalized.",
    clientReview: {
      quote: "Laureighn's imagery redefined how clients perceive our resort. Their photos directly boosted our holiday suite bookings and corporate retreat inquiries.",
      author: "General Manager",
      role: "Luxury Resort & Golf Club"
    },
    gallery: [
      { url: "../packages/samples/events/hotel-events/cover.jpg", caption: "Lush Resort Landscape & Grand Entrance" },
      { url: "../packages/samples/events/hotel-events/HOTEL AND HOSPITALITY SHOOT.jpg", caption: "Executive Lounge & Cocktail Bar Experience" },
      { url: "../packages/samples/events/hotel-events/work-5.jpg", caption: "Fine-Dining Culinary Plating & Gourmet Artistry" },
      { url: "../packages/images/work-5.jpg", caption: "Twilight Garden Pavilion & Luxury Suite Ambiance" }
    ]
  },
  {
    id: "pulse-vip-nightlife-soundstage",
    title: "The Pulse VIP Nightlife, DJ Sets & Strobe Carnival",
    category: "nightlife",
    categoryLabel: "VIP Nightlife",
    location: "Premier Lounge & Club, Eldoret Circuit",
    year: "2026",
    badge: "🍸 Electric Nightlife & Beats",
    summary: "Dynamic low-light cinema prime lenses, synchronized second-curtain rear flash, laser light trails, VIP bottle service, and pulsating crowd excitement.",
    cover: "../packages/samples/events/club-events/cover.jpg",
    coverThumb: "../packages/samples/events/club-events/cover_thumb.jpg",
    guestCount: "600+ Clubgoers",
    duration: "Late Night (10 PM - 4 AM)",
    crew: "1 Nightlife Visual Specialist",
    equipment: "Sony A7IV, 24mm f/1.4 GM, 35mm f/1.4 GM, On-Camera Diffused Flash with Color Gel",
    deliverables: [
      "24-Hour Express Social Media Photo Drop (70 Photos)",
      "High-Energy 60-Second Bass-Synced TikTok/IG Reel",
      "VIP Booth & Bottle Service Candid Highlights",
      "Guest Crowd Glow & DJ Headliner Action"
    ],
    story: "Nightlife photography is all about catching the energy of the bass drop without washing out the hypnotic colors of club lights. We used second-curtain sync flash techniques to paint ambient neon trails while keeping facial expressions tack-sharp.",
    clientReview: {
      quote: "No other media crew in Western Kenya understands club lighting like Laureighn Events. Their reels blow up our social channels every single weekend!",
      author: "Lead Entertainment Director",
      role: "Premier VIP Lounge"
    },
    gallery: [
      { url: "../packages/samples/events/club-events/cover.jpg", caption: "Headliner DJ on the Decks & Laser Symphony" },
      { url: "../packages/images/work-3.jpg", caption: "VIP Booth Cheers & Bottle Parade" },
      { url: "../packages/images/work-8.jpg", caption: "Electric Crowd Energy & Dance Floor Trance" }
    ]
  },
  {
    id: "western-bikers-expedition-rally",
    title: "Western Kenya Bikers Brotherhood Convoy & Rally",
    category: "nightlife",
    categoryLabel: "Convoy & Expedition",
    location: "Great Western Highway Circuit",
    year: "2026",
    badge: "🏍️ High-Speed Convoy",
    summary: "Adrenaline-fueled rolling vehicle tracking shots, highway convoy formations, heavy engine chrome details, and sunset rider camaraderie.",
    cover: "../packages/samples/events/fun-club-events/cover.jpg",
    coverThumb: "../packages/samples/events/fun-club-events/cover_thumb.jpg",
    guestCount: "60 High-End Motorcycles",
    duration: "Full-Day Expedition (8 Hours)",
    crew: "1 Chase-Vehicle Cinema Operator, 1 Drone Pilot",
    equipment: "Sony FX3 on DJI Ronin Gimbal from Chase Car, High-Shutter Action Prime, DJI 4K60 Drone",
    deliverables: [
      "Cinematic Chase-Car Rolling Shots Video Reel",
      "Dynamic Convoy Drone Flyovers",
      "120 Razor-Sharp Machine & Rider Portraits",
      "Sunset Pitstop Brotherhood Gallery"
    ],
    story: "Capturing motorcycles cruising at highway speeds requires synchronized chase vehicles, gimbal stabilization, and dynamic drone tracking. We gave the rally the aesthetic punch of an adrenaline Hollywood blockbuster.",
    clientReview: {
      quote: "The rolling highway shots look straight out of a Hollywood movie. The sound design on the video reel makes the engines rumble on your phone speakers!",
      author: "Convoy Captain",
      role: "Western Riding Club"
    },
    gallery: [
      { url: "../packages/samples/events/fun-club-events/cover.jpg", caption: "Rolling Highway Convoy & Aerodynamic Formation" },
      { url: "../packages/images/work-2.jpg", caption: "Chrome Details, Beast Engines & Sunset Horizon" },
      { url: "../packages/images/work-6.jpg", caption: "Brotherhood Pitstop & High-Spirited Camaraderie" }
    ]
  },
  {
    id: "celebration-of-life-legacy",
    title: "The Patriarch's Dignified Celebration of Life & Legacy",
    category: "memorials",
    categoryLabel: "Dignified Memorial",
    location: "Cathedral & Ancestral Homestead",
    year: "2026",
    badge: "🕊️ Honor & Heritage",
    summary: "Solemn, deeply respectful, and loving documentation of a revered community elder's life. Cathedral requiem mass, generational family portraits, and archival keepsake drive.",
    cover: "../packages/samples/events/burial-coverage/BURIAL COVERAGE PACKAGES.jpg",
    coverThumb: "../packages/samples/events/burial-coverage/BURIAL COVERAGE PACKAGES_thumb.jpg",
    guestCount: "500+ Community Mourners",
    duration: "2-Day Memorial Service",
    crew: "2 Quiet Unobtrusive Documentarians",
    equipment: "Sony Silent Electronic Shutter Lenses, 70-200mm f/2.8 GM, Clean Ambient Low-Light Rig",
    deliverables: [
      "Respectful Requiem Mass & Eulogy Video Record",
      "Generational Family Keepsake Portraits",
      "Archival Hard Drive of Complete Sacred Memories",
      "Framed Memorial Wall Portrait for the Homestead"
    ],
    story: "In times of family solemnity, our philosophy is radical respect. With zero distracting flash or noise, our operators stood at discreet distances, capturing tearful farewells, heartfelt hymns, and the immense love of descendants.",
    clientReview: {
      quote: "During a deeply vulnerable family moment, Laureighn's crew showed the utmost reverence. The photos of our patriarch and the multi-generational family portrait will live forever on our walls.",
      author: "The Mukasa Family",
      role: "Family Representatives"
    },
    gallery: [
      { url: "../packages/samples/events/burial-coverage/BURIAL COVERAGE PACKAGES.jpg", caption: "Solemn Requiem Mass & Floral Tribute" },
      { url: "../packages/images/work-10.jpg", caption: "Generations Gathered in Lasting Honor and Remembrance" }
    ]
  }
];

const EVENTS_VIDEO_REELS = [
  {
    id: "reel-wedding-motion",
    title: "Cinematic Wedding Highlight · Pure Love in Motion",
    category: "Weddings & Emotion",
    duration: "0:45",
    videoSrc: "../packages/samples/reels/camila.mp4",
    poster: "../packages/images/work-1.jpg",
    badge: "💍 4K Cinema Reel",
    description: "Experience the tenderness, joy, and cinematic color science that makes Laureighn wedding films unforgettable."
  },
  {
    id: "reel-celebration-motion",
    title: "High-Energy Event Sizzle · The Pulse of Celebration",
    category: "Galas & Bashes",
    duration: "0:38",
    videoSrc: "../packages/samples/reels/C1261_1.mp4",
    poster: "../packages/samples/events/birthday-events/IMANI'S BIRTHDAY/_DSC8315.JPG",
    badge: "🔥 Live Atmosphere",
    description: "From champagne corks popping to high-voltage dance floors. See how we turn your party into a cinematic blockbuster."
  }
];

const PRODUCTION_STANDARDS = [
  {
    icon: "🎥",
    title: "Dual Sony FX3 Cinema Cameras",
    desc: "10-bit 4:2:2 full-frame cinema sensors producing rich skin tones, natural highlights, and astonishing low-light clarity without harsh flash."
  },
  {
    icon: "🚁",
    title: "4K60 Drone Aerial Perspectives",
    desc: "Sweeping cinematic flyovers capturing your grand venue, outdoor church procession, marquee tents, and convoy arrivals from the skies."
  },
  {
    icon: "🎙️",
    title: "Studio-Grade Wireless Audio",
    desc: "Sennheiser & Rode wireless lapel microphones capture wedding vows, elder blessings, and keynote speeches with pristine, broadcast-ready audio."
  },
  {
    icon: "⚡",
    title: "48-Hour Sneak Peek Guarantee",
    desc: "Never wait weeks to share your happiness. We deliver 30+ retouched master photos and a viral social teaser reel within 48 hours of your event."
  },
  {
    icon: "🛡️",
    title: "100% Dual-Card Redundancy",
    desc: "Every second of footage and every photo is recorded to dual memory cards simultaneously. Your irreplaceable memories are backed up same-night to cloud storage."
  },
  {
    icon: "✨",
    title: "Unobtrusive Fly-On-Wall Artistry",
    desc: "Our uniformed media crew moves with elegance, capturing authentic tears, genuine laughs, and spontaneous joy without blocking your guests."
  }
];

const CLIENT_TESTIMONIALS = [
  {
    name: "Sharon & Kelvin M.",
    event: "Holy Matrimony & Garden Reception",
    location: "Nairobi",
    stars: 5,
    quote: "Laureighn Events captured our wedding with so much soul. We felt completely relaxed having them around. Watching our 4K film brought back every emotion of the day!",
    avatar: "💍"
  },
  {
    name: "Dr. Faith A.",
    event: "Doctoral Convocation & Family Gala",
    location: "Kakamega",
    stars: 5,
    quote: "They made my doctoral celebration feel like a presidential state banquet. The portraits with my parents are masterworks that will hang in our home forever.",
    avatar: "🎓"
  },
  {
    name: "Imani K.",
    event: "21st Birthday Milestone Party",
    location: "Western Kenya",
    stars: 5,
    quote: "The lighting was straight out of high-fashion magazine editorials! The 48-hour sneak peek had everyone on Instagram and WhatsApp asking who did my event.",
    avatar: "🎂"
  },
  {
    name: "Brenda & Brian O.",
    event: "Traditional Ruracio & Dowry Rites",
    location: "Western Kenya",
    stars: 5,
    quote: "Their team respected our cultural traditions, worked harmoniously with the elders, and delivered colors so rich that our attire literally pops off the screen!",
    avatar: "👑"
  }
];

const FAQS_DATA = [
  {
    q: "How early in advance should we reserve our event date?",
    a: "Peak wedding and gala dates (especially Fridays, Saturdays, and holiday seasons in August and December) book 3 to 9 months in advance. We accept bookings on a strictly first-deposit basis to lock your crew and cinema equipment."
  },
  {
    q: "Do you travel across Kenya for weddings and destination events?",
    a: "Yes! While our primary production hub is in Western Kenya (Kakamega, Kisumu, Eldoret), we regularly travel to Nairobi, Naivasha, Nakuru, the Kenyan Coast, and regional safari locations. Out-of-station travel and crew accommodation are transparently budgeted into your bespoke proposal."
  },
  {
    q: "How fast is your photo and video delivery turnaround?",
    a: "Every event package includes our Signature 48-Hour Sneak Peek (25-40 master retouched photos + a vertical 4K social teaser reel) delivered while the excitement is still fresh! Your complete high-resolution online gallery and documentary cinema edit are finalized within 7 to 14 days."
  },
  {
    q: "How many crew members will document our event?",
    a: "Crew size is tailored to your guest count and production scope. Intimate celebrations (under 100 guests) typically require 2 operators (1 photographer, 1 cinematographer). Grand weddings and corporate summits (250-600+ guests) feature 3 to 5 specialists, including dedicated lead portraitist, roaming candid shooter, cinema gimbal operator, and drone pilot."
  },
  {
    q: "Can we request raw footage or custom wooden photo mounts?",
    a: "Absolutely. We offer complete raw footage delivery on a dedicated high-speed SSD, as well as museum-grade handcrafted wooden wall mounts in A4, A3, and A2 formats, hand-made to last decades."
  },
  {
    q: "How do we lock in our booking?",
    a: "Simply click 'Plan Your Event' or WhatsApp us directly at +254 790 048 905 with your date and venue. We issue a formal date reserve contract, and a commitment deposit secures our media fleet exclusively for your celebration."
  }
];
