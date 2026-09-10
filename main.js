/*==================================================
    Loventa Anyango — Geospatial Portfolio
    main.js
==================================================*/

document.addEventListener('DOMContentLoaded', () => {

    initHeaderScroll();
    initEarthFacts();
    initProjectMap();
    initResearch();
    initFieldStrip();
    initTimelineToggles();
    initScrollReveal(); // runs after dynamic content is in the DOM so it can observe it
    initGuessGame();

});

/*==================================================
    EXPERIENCE: collapse/expand extra bullets per role
==================================================*/

function initTimelineToggles(){

    document.querySelectorAll('.timeline-toggle').forEach(btn => {

        const more = btn.previousElementSibling;
        if(!more || !more.classList.contains('timeline-more')) return;

        btn.addEventListener('click', () => {

            const isHidden = more.hasAttribute('hidden');

            if(isHidden){
                more.removeAttribute('hidden');
                btn.textContent = 'Show less';
                btn.setAttribute('aria-expanded', 'true');
            } else {
                more.setAttribute('hidden', '');
                btn.textContent = 'Show more';
                btn.setAttribute('aria-expanded', 'false');
            }

        });

    });

}

/*==================================================
    HEADER: shrink + shadow on scroll, active link
==================================================*/

function initHeaderScroll(){

    const header = document.querySelector('header');
    if(!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    const links = document.querySelectorAll('.nav-links a');
    const sections = [...links]
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if('IntersectionObserver' in window && sections.length){

        const spy = new IntersectionObserver((entries) => {

            entries.forEach(entry => {
                if(!entry.isIntersecting) return;
                const id = '#' + entry.target.id;
                links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
            });

        }, { rootMargin:'-45% 0px -45% 0px' });

        sections.forEach(s => spy.observe(s));
    }
}

/*==================================================
    SCROLL REVEAL ANIMATIONS
==================================================*/

function initScrollReveal(){

    const items = document.querySelectorAll('.reveal');
    if(!items.length) return;

    if(!('IntersectionObserver' in window)){
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });

    }, { threshold:0.15 });

    items.forEach(el => observer.observe(el));
}

/*==================================================
    RANDOM EARTH FACTS
==================================================*/

const EARTH_FACTS = [
    "Earth is the only planet not named after a Greek or Roman god.",
    "About 71% of Earth's surface is covered in water, yet less than 1% of it is accessible fresh water.",
    "The Global Positioning System relies on relativity: satellite clocks run faster than clocks on the ground and must be corrected daily.",
    "Earth's magnetic north pole drifts roughly 40-50 km per year, which is why GIS coordinate systems need periodic updates.",
    "A geoid, not a sphere or ellipsoid, is the true 'shape' surveyors use to model mean sea level.",
    "Landsat, launched in 1972, is the longest continuously running Earth observation programme in history.",
    "The Amazon rainforest produces about 20% of the world's oxygen and is a key focus of vegetation-recovery remote sensing.",
    "Mount Everest's summit is measured using satellite-based GNSS, giving an official height of 8,848.86 metres.",
    "The Mariana Trench is deeper than Everest is tall, plunging nearly 11,000 metres below sea level.",
    "LiDAR can map forest floors hidden beneath dense canopy by measuring the last laser return to reach the ground.",
    "A single Sentinel-2 satellite image can cover 290 km of the Earth's surface in one pass.",
    "The equator is not a fixed line: Earth's slightly ellipsoidal shape means it bulges about 21 km more at the equator than at the poles.",
    "The Great Rift Valley, running through Kenya, is slowly splitting the African continent into two separate plates.",
    "There are more possible map projections than there are ways to perfectly flatten a sphere — every one distorts something.",
    "Soil, not rock, covers most dry land, and just a thin layer of it supports nearly all terrestrial food production."
];

function initEarthFacts(){

    const textEl = document.getElementById('earth-fact-text');
    const btn = document.getElementById('new-fact-btn');
    if(!textEl || !btn) return;

    let lastIndex = -1;

    const showFact = () => {
        let idx = Math.floor(Math.random() * EARTH_FACTS.length);
        if(idx === lastIndex){
            idx = (idx + 1) % EARTH_FACTS.length;
        }
        lastIndex = idx;

        textEl.style.opacity = 0;
        setTimeout(() => {
            textEl.textContent = EARTH_FACTS[idx];
            textEl.style.transition = 'opacity .3s ease';
            textEl.style.opacity = 1;
        }, 150);
    };

    btn.addEventListener('click', showFact);
    showFact();
}

/*==================================================
    IN THE FIELD — action photo strip
    Add real photos to /images/ and update src paths below.
    Until a real file loads, each card falls back to a
    branded placeholder so nothing looks broken.
==================================================*/

const FIELD_PHOTOS = [
    {
        src: "field-01.jpeg",
        caption: "Setting up Total Station",
        meta: "Nairobi River protection, restoration, reconstruction & beautification project (Phase II), 2026"
    },
    {
        src: "field-02.jpeg",
        caption: "Topographic detail picking using Total Station",
        meta: "Nairobi River protection, restoration, reconstruction & beautification project (Phase II), 2026"
    },
    {
        src: "field-03.jpeg",
        caption: "Coordinate picking of newly monumented control point using RTK GNSS",
        meta: "Affordable Housing Program (AHP), 2026"
    },
    {
        src: "field-04.jpeg",
        caption: "Topographic detail picking using RTK GNSS",
        meta: "Nairobi River protection, restoration, reconstruction & beautification project (Phase II), 2026"
    }
];

function initFieldStrip(){

    const strip = document.getElementById('field-strip');
    if(!strip) return;

    FIELD_PHOTOS.forEach((photo, i) => {

        const card = document.createElement('figure');
        card.className = `field-photo no-image reveal${i ? ` reveal-delay-${Math.min(i,3)}` : ''}`;

        card.innerHTML = `
            <img src="${photo.src}" alt="${photo.caption}">
            <figcaption class="field-caption">
                <strong>${photo.caption}</strong>
                <span>${photo.meta}</span>
            </figcaption>
        `;

        const img = card.querySelector('img');
        img.addEventListener('error', () => { img.style.display = 'none'; });
        img.addEventListener('load', () => { card.classList.remove('no-image'); });

        strip.appendChild(card);
    });
}

/*==================================================
    FEATURED PROJECTS -> INTERACTIVE MAP
    Replace coordinates / copy below with real project details.
==================================================*/

// Fill in your real project material here. Fields left as "[...]" are
// placeholders — remove any field you don't have rather than leaving it blank.

// Approximate coordinates (nearest known town/landmark) for the 24 AHP sites
// you delivered Control Survey Extension reports for. These are approximate —
// adjust any pin if you know the precise site location.
const AHP_SITES = [
    { name: "Alego Usonga",        lat: 0.1500,  lng: 34.2833 },
    { name: "Kanduyi, Bungoma",    lat: 0.5692,  lng: 34.5581 },
    { name: "Homabay",             lat: -0.5273, lng: 34.4571 },
    { name: "Nyaribari, Kisii",    lat: -0.6773, lng: 34.7796 },
    { name: "Eldoret Railway City",lat: 0.5143,  lng: 35.2698 },
    { name: "Maralal",             lat: 1.0968,  lng: 36.6989 },
    { name: "Kwa Ngendu, Kitui",   lat: -1.3667, lng: 38.0106 },
    { name: "Ol Kalou",            lat: -0.2833, lng: 36.3667 },
    { name: "Marigat",             lat: 0.4667,  lng: 35.9833 },
    { name: "Limuru",              lat: -1.1136, lng: 36.6417 },
    { name: "Thika",               lat: -1.0332, lng: 37.0692 },
    { name: "Shauri Moyo",         lat: -1.2833, lng: 36.8333 },
    { name: "Kibera",              lat: -1.3133, lng: 36.7820 },
    { name: "Imara Daima",         lat: -1.3390, lng: 36.8850 },
    { name: "Mavoko",              lat: -1.4574, lng: 37.0122 },
    { name: "Kamiti",              lat: -1.1667, lng: 36.9000 },
    { name: "Mukurwe-ini",         lat: -0.5833, lng: 37.0667 },
    { name: "Galole-Hola",         lat: -1.5000, lng: 40.0333 },
    { name: "Diani",               lat: -4.3167, lng: 39.5833 },
    { name: "Kilifi Bofa Rd",      lat: -3.5667, lng: 39.8667 },
    { name: "Kilifi Tezo",         lat: -3.5833, lng: 39.8333 },
    { name: "Voi",                 lat: -3.3961, lng: 38.5561 },
    { name: "Voi Poolhouse",       lat: -3.3980, lng: 38.5600 },
    { name: "Survey Camp Kwale",   lat: -4.1747, lng: 39.4522 }
];

const PROJECTS = [
    {
        title: "Post-Fire Vegetation Recovery Monitoring",
        description: "Tracking regrowth after wildfire by intergrating machine learning, satellite imagery and environmental drivers.",
        role: "Project author",
        tools: ["Google Earth Engine", "Landsat 7/8", "QGIS", "Python"],
        results: "Built a model that explains 90.1% of the variance in post-fire vegetation recovery",
        color: "var(--primary)",
        links: {
            live: "https://loventaanyango.github.io/post-fire-vegetation-recovery-mt-kenya/",
            code: "https://github.com/loventaanyango/post-fire-vegetation-recovery-mt-kenya"
        },
        lat: -0.1522, lng: 37.3084 // Mt Kenya, Kenya 
    },    
    {
        title: "Affordable Housing Program (AHP)",
        description: "Control Survey Extension & RTK GPS static surveys for planning.",
        role: "Survey Team Member",
        tools: ["RTK GPS", "QGIS", "AutoCAD Civil 3D"],
        results: "Part of a large survey team delivering Control Survey Extension across 24 AHP sites nationwide; personally present for monumentation at 4 sites and conducted static survey at 1. I was also responsible for making the location maps and the compilation of the final Control Survey Extension reports for each AHP site.",
        color: "var(--accent)",
        links: {
            // live: "[https://your-storymap-or-report-link]",
        },
        sites: AHP_SITES, // rendered as a marker cluster instead of a single pin
        lat: -1.2921, lng: 36.8219 // fallback center (Nairobi) — unused when `sites` is present
    },
    {
        title: "Nairobi River protection, restoration, reconstruction & beautification project (Phase II)",
        description: "RTK GPS and total station surveys for topographic detailing and infrastructure planning.",
        role: "Survey Team Member",
        tools: ["RTK GPS", "Total Station", "AutoCAD Civil 3D"],
        results: "Part of a large team that delivered topographic survey for select road corridors all around Nairobi, supporting detailed mapping and infrastructure planning.",
        color: "var(--route)",
        links: {
            // live: "[https://your-storymap-or-report-link]",
        },
        lat: -1.2921, lng: 36.8219 // Nairobi, Kenya
    },
    // {
    //     title: "Land Administration & GIS",
    //     description: "Parcel mapping and cadastral data management for land administration.",
    //     role: "[Your role, e.g. GIS Assistant]",
    //     tools: ["ArcGIS Pro", "PostGIS", "QGIS"],
    //     results: "[Quantified outcome, e.g. Digitised and validated 500+ cadastral parcels]",
    //     links: {
    //         live: "[https://your-storymap-or-arcgis-online-link]",
    //         code: ""
    //     },
    //     lat: -4.0435, lng: 39.6682 // Mombasa, Kenya (placeholder — replace with real project location)
    // },
    // {
    //     title: "Machine Learning Applications",
    //     description: "Classification models applied to satellite imagery for land-cover mapping.",
    //     role: "[Your role, e.g. Developer]",
    //     tools: ["Python", "scikit-learn", "rasterio", "Sentinel-2"],
    //     results: "[Quantified outcome, e.g. Achieved 89% overall accuracy on a 6-class land-cover model]",
    //     links: {
    //         live: "",
    //         code: "[https://github.com/your-username/your-repo]"
    //     },
    //     lat: 0.5143, lng: 35.2698 // Eldoret, Kenya (placeholder — replace with real project location)
    // }
];

function initProjectMap(){

    const mapEl = document.getElementById('project-map');
    const listEl = document.getElementById('project-list');
    if(!mapEl || !listEl || typeof L === 'undefined') return;

    const map = L.map(mapEl, { scrollWheelZoom:false }).setView([-1.0, 36.5], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    const tagsHtml = (project) => (project.tools && project.tools.length)
        ? `<div class="tag-row">${project.tools.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
        : '';

    const linksHtml = (project) => {
        if(!project.links) return '';
        const items = [];
        if(project.links.live) items.push(`<a href="${project.links.live}" target="_blank" rel="noopener">View live</a>`);
        if(project.links.code) items.push(`<a href="${project.links.code}" target="_blank" rel="noopener">View code</a>`);
        return items.length ? `<div class="project-links">${items.join('')}</div>` : '';
    };

    // Resolve a CSS variable (e.g. "var(--primary)") to its actual color value
    // so it can be baked into a Leaflet divIcon's inline style.
    const resolveColor = (cssColor) => {
        const match = /var\((--[\w-]+)\)/.exec(cssColor || '');
        return match
            ? getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || cssColor
            : (cssColor || 'var(--accent)');
    };

    // A colored circular pin, matching the legend dot / sidebar dot for the
    // same project — this is how the map stays readable with several
    // projects plotted at once.
    const coloredIcon = (color) => L.divIcon({
        html: `<span style="background:${resolveColor(color)}"></span>`,
        className: 'project-marker-icon',
        iconSize: [18, 18],
        popupAnchor: [0, -8]
    });

    // Cluster icon themed to match its project's color rather than the
    // default Leaflet.markercluster blue/orange.
    const clusterIcon = (color) => (cluster) => L.divIcon({
        html: `<div style="background:${resolveColor(color)}55;border-color:${resolveColor(color)}">${cluster.getChildCount()}</div>`,
        className: 'ahp-cluster-icon',
        iconSize: L.point(38, 38)
    });

    // Legend: one swatch per project, so it's clear which color is which
    // even with several projects visible on the map at the same time.
    const legendEl = document.getElementById('project-legend');
    if(legendEl){
        legendEl.innerHTML = PROJECTS.map(project => `
            <span class="legend-item">
                <span class="legend-dot" style="background:${resolveColor(project.color)}"></span>
                ${project.title}
            </span>
        `).join('');
    }

    PROJECTS.forEach((project, i) => {

        // Build the sidebar pin — this carries the FULL detail (description,
        // role, results, tools, links). The map only ever shows a light
        // preview so nothing is duplicated between the two panels.
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'project-pin';
        pin.innerHTML = `
            <span class="pin-dot" style="background:${resolveColor(project.color)}"></span>
            <span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.role ? `<span class="project-role">${project.role}</span>` : ''}
                ${project.results ? `<span class="project-result">${project.results}</span>` : ''}
                ${tagsHtml(project)}
                ${linksHtml(project)}
            </span>
        `;

        if(project.sites && project.sites.length){

            // Multi-site project (AHP): render as a marker cluster instead
            // of a single pin. Each site marker's popup is intentionally
            // just its name — the story/role/results live in the sidebar.
            const clusterGroup = L.markerClusterGroup({ iconCreateFunction: clusterIcon(project.color) });

            project.sites.forEach(site => {
                L.marker([site.lat, site.lng], { icon: coloredIcon(project.color) })
                    .bindPopup(`<strong>${site.name}</strong>`)
                    .addTo(clusterGroup);
            });

            map.addLayer(clusterGroup);

            const bounds = clusterGroup.getBounds();

            pin.addEventListener('click', () => {
                document.querySelectorAll('.project-pin').forEach(p => p.classList.remove('active'));
                pin.classList.add('active');
                map.flyToBounds(bounds, { duration:0.8, padding:[40,40] });
            });

        } else {

            // Single-site project: lightweight popup (title + description
            // only) — the sidebar pin already carries the rest.
            const popupHtml = `<strong>${project.title}</strong><br>${project.description}`;

            const marker = L.marker([project.lat, project.lng], { icon: coloredIcon(project.color) }).addTo(map)
                .bindPopup(popupHtml);

            pin.addEventListener('click', () => {
                document.querySelectorAll('.project-pin').forEach(p => p.classList.remove('active'));
                pin.classList.add('active');
                map.flyTo([project.lat, project.lng], 9, { duration:0.8 });
                marker.openPopup();
            });
        }

        listEl.appendChild(pin);

        if(i === 0){
            pin.classList.add('active');
        }
    });

    // keep Leaflet happy inside a scroll-revealed, initially-hidden layout
    setTimeout(() => map.invalidateSize(), 400);
    window.addEventListener('resize', () => map.invalidateSize());
}

/*==================================================
    RESEARCH & PUBLICATIONS
    Fill in your real material — never paste the full article text here,
    just a plain-language summary plus a link out (see publisher policy).
==================================================*/

const RESEARCH = [
    {
        title: "Modeling climate change impacts and predicting future vulnerability in the Mount Kenya forest ecosystem using remote sensing and machine learning",
        journal: "Environmental Monitoring and Assessment",
        citation: "Otieno, T. A., Otieno, L. A., Rotich, B., Löhr, K., & Kipkulei, H. K. (2025). Modeling climate change impacts and predicting future vulnerability in the Mount Kenya forest ecosystem using remote sensing and machine learning. Environmental Monitoring and Assessment, 197(6), 631.",
        role: "Co-author",
        summary: "This study combined satellite remote sensing with machine learning models to project how climate change is likely to affect the Mount Kenya forest ecosystem, mapping where the forest is most vulnerable under future climate scenarios.",
        takeaway: "Projected future climate-vulnerability hotspots across the Mount Kenya forest",
        link: "https://doi.org/10.1007/s10661-025-14089-0"
    },
    {
        title: "Integrating remote sensing and machine learning to evaluate environmental drivers of post-fire vegetation recovery in the Mount Kenya forest",
        journal: "Discover Geoscience",
        citation: "Otieno, L. A., Otieno, T. A., Rotich, B., Löhr, K., & Kipkulei, H. K. (2025). Integrating remote sensing and machine learning to evaluate environmental drivers of post-fire vegetation recovery in the Mount Kenya forest. Discover Geoscience, 3(1), 81.",
        role: "Lead author",
        summary: "Using multi-temporal satellite imagery and machine learning, this research identified the key environmental factors that shape how vegetation recovers after wildfire in the Mount Kenya forest.",
        takeaway: "Identified the key environmental drivers behind post-fire vegetation recovery",
        link: "https://doi.org/10.1007/s44288-025-00196-5"
    }
];

function initResearch(){

    const grid = document.getElementById('research-grid');
    if(!grid) return;

    RESEARCH.forEach((paper, i) => {

        const card = document.createElement('article');
        card.className = `research-card glass reveal${i ? ` reveal-delay-${Math.min(i,3)}` : ''}`;

        card.innerHTML = `
            <span class="eyebrow">${paper.journal}</span>
            <h3>${paper.title}</h3>
            <p class="citation">${paper.citation}</p>
            ${paper.role ? `<p class="role">${paper.role}</p>` : ''}
            <p>${paper.summary}</p>
            ${paper.takeaway ? `<span class="takeaway">${paper.takeaway}</span><br>` : ''}
            ${paper.link ? `<a class="research-link" href="${paper.link}" target="_blank" rel="noopener">Read the paper →</a>` : ''}
        `;

        grid.appendChild(card);
    });
}

/*==================================================
    GUESS THE LOCATION GAME
==================================================*/

const GAME_LOCATIONS = [
    { name: "Nairobi, Kenya", clue: "East Africa's tech and safari hub, nicknamed 'The Green City in the Sun'.", lat: -1.2921, lng: 36.8219 },
    { name: "Cairo, Egypt", clue: "Sits beside the Nile, close to the Giza pyramid complex.", lat: 30.0444, lng: 31.2357 },
    { name: "Tokyo, Japan", clue: "One of the most densely mapped megacities on Earth, on Honshu island.", lat: 35.6762, lng: 139.6503 },
    { name: "Rio de Janeiro, Brazil", clue: "Coastal city overlooked by a mountain-top statue of Christ the Redeemer.", lat: -22.9068, lng: -43.1729 },
    { name: "London, United Kingdom", clue: "Straddles the River Thames; home to the Prime Meridian at Greenwich.", lat: 51.5074, lng: -0.1278 },
    { name: "Sydney, Australia", clue: "Harbour city famous for its sail-shaped opera house.", lat: -33.8688, lng: 151.2093 },
    { name: "New York City, USA", clue: "Island-heavy metropolis where five boroughs meet the Atlantic.", lat: 40.7128, lng: -74.0060 },
    { name: "Cape Town, South Africa", clue: "Sits where two oceans nearly meet, beneath a flat-topped mountain.", lat: -33.9249, lng: 18.4241 },
    { name: "Reykjavik, Iceland", clue: "The world's northernmost capital of a sovereign state, built on volcanic rock.", lat: 64.1466, lng: -21.9426 },
    { name: "Mumbai, India", clue: "Financial capital on India's western coast, facing the Arabian Sea.", lat: 19.0760, lng: 72.8777 }
];

function initGuessGame(){

    const mapEl = document.getElementById('game-map');
    if(!mapEl || typeof L === 'undefined') return;

    const clueEl = document.getElementById('game-clue');
    const roundLabel = document.getElementById('game-round-label');
    const scoreEl = document.getElementById('game-score');
    const roundCountEl = document.getElementById('game-round-count');
    const lastDistanceEl = document.getElementById('game-last-distance');
    const feedbackEl = document.getElementById('game-feedback');
    const revealBtn = document.getElementById('game-reveal-btn');
    const nextBtn = document.getElementById('game-next-btn');

    const TOTAL_ROUNDS = 8;
    const order = shuffle([...GAME_LOCATIONS]).slice(0, TOTAL_ROUNDS);

    const state = {
        round: 0,
        score: 0,
        guessed: false,
        guessMarker: null,
        answerMarker: null,
        line: null
    };

    const map = L.map(mapEl, { worldCopyJump:true }).setView([10, 20], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    function shuffle(arr){
        for(let i = arr.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function haversineKm(lat1, lng1, lat2, lng2){
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function scoreForDistance(km){
        if(km < 50) return 1000;
        if(km > 8000) return 0;
        return Math.round(1000 * (1 - km / 8000));
    }

    function clearRoundLayers(){
        [state.guessMarker, state.answerMarker, state.line].forEach(layer => {
            if(layer) map.removeLayer(layer);
        });
        state.guessMarker = state.answerMarker = state.line = null;
    }

    function startRound(){

        if(state.round >= order.length){
            clueEl.textContent = `Game over! Final score: ${state.score} / ${order.length * 1000}.`;
            roundLabel.textContent = 'Finished';
            revealBtn.disabled = true;
            nextBtn.textContent = 'Play Again';
            nextBtn.onclick = () => location.reload();
            return;
        }

        clearRoundLayers();
        state.guessed = false;
        feedbackEl.textContent = '';
        feedbackEl.className = 'game-feedback';
        revealBtn.disabled = false;

        const loc = order[state.round];
        roundLabel.textContent = `Round ${state.round + 1}`;
        roundCountEl.textContent = `${state.round + 1} / ${order.length}`;
        clueEl.textContent = loc.clue;
    }

    function handleGuess(lat, lng){

        if(state.guessed || state.round >= order.length) return;

        state.guessed = true;
        const loc = order[state.round];

        if(state.guessMarker) map.removeLayer(state.guessMarker);
        state.guessMarker = L.circleMarker([lat, lng], {
            radius: 7, color:'#C9A227', fillColor:'#C9A227', fillOpacity:0.9
        }).addTo(map);

        state.answerMarker = L.marker([loc.lat, loc.lng]).addTo(map)
            .bindPopup(`<strong>${loc.name}</strong>`).openPopup();

        state.line = L.polyline([[lat, lng], [loc.lat, loc.lng]], {
            color:'#2F6F4E', dashArray:'6 8'
        }).addTo(map);

        const km = haversineKm(lat, lng, loc.lat, loc.lng);
        const gained = scoreForDistance(km);
        state.score += gained;

        scoreEl.textContent = state.score;
        lastDistanceEl.textContent = `${Math.round(km)} km`;

        feedbackEl.textContent = `That's ${loc.name} — off by ${Math.round(km)} km (+${gained} pts).`;
        feedbackEl.className = 'game-feedback ' + (gained >= 500 ? 'good' : 'bad');

        const bounds = L.latLngBounds([[lat, lng], [loc.lat, loc.lng]]);
        map.fitBounds(bounds, { padding:[60,60], maxZoom:6 });
    }

    map.on('click', (e) => handleGuess(e.latlng.lat, e.latlng.lng));

    revealBtn.addEventListener('click', () => {
        if(state.guessed) return;
        const loc = order[state.round];
        handleGuess(loc.lat, loc.lng); // treated as a max-distance guess of 0, but flagged as revealed
        feedbackEl.textContent = `Revealed: ${loc.name}.`;
        feedbackEl.className = 'game-feedback bad';
    });

    nextBtn.addEventListener('click', () => {
        if(!state.guessed) return;
        state.round += 1;
        startRound();
    });

    setTimeout(() => map.invalidateSize(), 400);
    window.addEventListener('resize', () => map.invalidateSize());

    startRound();
}
