const toggle = document.getElementById('theme-toggle');
const body = document.body;
const bear = document.getElementById('bear-widget');
const bearSprite = document.getElementById('bear-sprite');
const backToTop = document.getElementById('back-to-top');
const title = document.querySelector('body > header h1');
const navViewport = document.querySelector('.nav-viewport');
const navTrack = navViewport?.querySelector('.nav-track');
const nav = navTrack?.querySelector('.nav-group-original');
const navGroups = navTrack ? [...navTrack.querySelectorAll('.nav-group')] : [];
const navShifts = [...document.querySelectorAll('.nav-shift')];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const headerVisualizer = document.querySelector('.header-visualizer-grid');
let allNavLinks = [];
let navCycleWidth = 0;
let navMiddleStart = 0;
let navScaleFrame = 0;
const sprites = {
    happy: 'happy.png',
    love: 'love.png',
    surprised: 'surprised.png',
    sleepy: 'sleepy.png',
    starry: 'starry.png',
    sad: 'sad.png',
    winkLove: 'wink-love.png',
    silly: 'silly.png',
    censored: 'censored.png',
    sweaty: 'sweaty.png',
    shocked: 'shocked.png',
    angry: 'angry.png',
    wink: 'wink.png',
    worried: 'worried.png',
    grin: 'grin.png'
};

const reactionPools = {
    idle: ['happy', 'sad', 'worried', 'grin'],
    hover: ['love', 'starry', 'winkLove', 'silly'],
    click: ['surprised', 'censored', 'shocked', 'angry'],
    openPage: ['surprised', 'shocked', 'grin'],
    theme: ['starry', 'grin', 'silly', 'love']
};

let lastMood = '';
const chooseReaction = (pool) => {
    const available = pool.filter((mood) => mood !== lastMood);
    const mood = available[Math.floor(Math.random() * available.length)] || pool[0];
    lastMood = mood;
    return mood;
};

const setBearMood = (mood) => {
    if (!bear || !bearSprite || !sprites[mood]) return;
    bear.dataset.mood = mood;
    bearSprite.classList.remove('is-changing');
    void bearSprite.offsetWidth;
    bearSprite.src = `/static/images/bear/${sprites[mood]}`;
    bearSprite.classList.add('is-changing');
};

const showReaction = (trigger) => setBearMood(chooseReaction(reactionPools[trigger]));

bear?.addEventListener('mouseenter', () => setBearMood('censored'));
bear?.addEventListener('mouseleave', () => showReaction('idle'));

const createHeaderVisualizer = () => {
    if (!headerVisualizer) return;
    const columns = 64;
    const levels = 10;
    const tileColors = ['45 108 223', '74 144 245', '93 158 255', '126 177 255'];
    const fragment = document.createDocumentFragment();

    for (let column = 0; column < columns; column += 1) {
        const peak = 2 + Math.floor(Math.random() * (levels - 2));
        for (let level = 0; level < peak; level += 1) {
            if (level > 2 && Math.random() < (level / levels) * 0.24) continue;

            const tile = document.createElement('span');
            tile.className = 'header-tile';
            tile.style.setProperty('--cube-left', `${((column + 0.5) / columns) * 100}%`);
            tile.style.setProperty('--cube-bottom', `${level * 6 + 5}px`);
            tile.style.setProperty('--cube-size', `${3 + Math.random() * 2.5}px`);
            tile.style.setProperty('--cube-color', tileColors[Math.floor(Math.random() * tileColors.length)]);
            tile.style.setProperty('--cube-alpha', `${0.18 + Math.random() * 0.42}`);
            tile.style.setProperty('--cube-delay', prefersReducedMotion.matches ? '0ms' : `${Math.random() * 480}ms`);
            fragment.appendChild(tile);
        }
    }

    headerVisualizer.appendChild(fragment);
};

const cloneNavLinks = () => {
    if (!nav || navGroups.length !== 3 || navGroups[0].children.length) return;
    navGroups[0].innerHTML = nav.innerHTML;
    navGroups[2].innerHTML = nav.innerHTML;
    navGroups.forEach((group, index) => {
        if (index === 1) return;
        group.querySelectorAll('a').forEach((link) => {
            if (link.hasAttribute('aria-current')) link.classList.add('is-current');
            link.removeAttribute('aria-current');
            link.tabIndex = -1;
        });
    });
    allNavLinks = [...navTrack.querySelectorAll('a')];
};

const updateNavMetrics = () => {
    if (!nav || !navGroups[0]) return;
    navMiddleStart = nav.offsetLeft;
    navCycleWidth = navMiddleStart - navGroups[0].offsetLeft;
};

let isNormalizingNav = false;
const normalizeNavScroll = () => {
    if (!navViewport || !nav || isNormalizingNav) return;
    if (!navCycleWidth) return;

    let nextScrollLeft = navViewport.scrollLeft;
    const middleEnd = navMiddleStart + navCycleWidth;
    while (nextScrollLeft < navMiddleStart) nextScrollLeft += navCycleWidth;
    while (nextScrollLeft >= middleEnd) nextScrollLeft -= navCycleWidth;
    if (nextScrollLeft === navViewport.scrollLeft) return;

    isNormalizingNav = true;
    const previousBehavior = navViewport.style.scrollBehavior;
    navViewport.style.scrollBehavior = 'auto';
    navViewport.scrollLeft = nextScrollLeft;
    navViewport.style.scrollBehavior = previousBehavior;
    isNormalizingNav = false;
};

const centerCurrentNavLink = () => {
    const current = nav?.querySelector('[aria-current="page"]');
    if (!navViewport || !nav) return;
    const previousBehavior = navViewport.style.scrollBehavior;
    navViewport.style.scrollBehavior = 'auto';
    if (current) {
        current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    } else {
        navViewport.scrollLeft = navMiddleStart;
    }
    navViewport.style.scrollBehavior = previousBehavior;
    normalizeNavScroll();
    updateNavLinkScale();
};

const updateNavLinkScale = () => {
    if (!navViewport || !allNavLinks.length || navScaleFrame) return;
    navScaleFrame = requestAnimationFrame(() => {
        navScaleFrame = 0;
        const viewportRect = navViewport.getBoundingClientRect();
        const viewportCenter = viewportRect.left + viewportRect.width / 2;
        const scaleRange = Math.max(viewportRect.width * 0.55, 1);

        allNavLinks.forEach((link) => {
            const linkRect = link.getBoundingClientRect();
            const distance = Math.min(Math.abs(linkRect.left + linkRect.width / 2 - viewportCenter) / scaleRange, 1);
            link.style.setProperty('--nav-scale', (1.1 - distance * 0.2).toFixed(3));
        });
    });
};

const moveNavOneButton = (direction) => {
    if (!navViewport || !allNavLinks.length) return;
    normalizeNavScroll();
    const viewportCenter = navViewport.scrollLeft + navViewport.clientWidth / 2;
    const viewportLeft = navViewport.getBoundingClientRect().left;
    const linkCenters = allNavLinks.map((link) => {
        const linkRect = link.getBoundingClientRect();
        return navViewport.scrollLeft + linkRect.left - viewportLeft + linkRect.width / 2;
    });
    const targetIndex = direction > 0
        ? linkCenters.findIndex((center) => center > viewportCenter + 4)
        : linkCenters.findLastIndex
            ? linkCenters.findLastIndex((center) => center < viewportCenter - 4)
            : linkCenters.reduce((last, center, index) => center < viewportCenter - 4 ? index : last, -1);
    const target = allNavLinks[targetIndex < 0 ? (direction > 0 ? allNavLinks.length - 1 : 0) : targetIndex];
    if (!target) return;
    const targetCenter = linkCenters[targetIndex < 0 ? (direction > 0 ? allNavLinks.length - 1 : 0) : targetIndex];
    navViewport.scrollTo({
        left: targetCenter - navViewport.clientWidth / 2,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
    });
};

createHeaderVisualizer();
cloneNavLinks();
updateNavMetrics();
navViewport?.addEventListener('scroll', normalizeNavScroll, { passive: true });
navViewport?.addEventListener('scroll', updateNavLinkScale, { passive: true });
window.addEventListener('resize', () => {
    updateNavMetrics();
    updateNavLinkScale();
}, { passive: true });
navShifts.forEach((control) => {
    const direction = control.classList.contains('nav-shift-right') ? 1 : -1;
    control.addEventListener('mouseenter', () => moveNavOneButton(direction));
    control.addEventListener('click', () => moveNavOneButton(direction));
});

requestAnimationFrame(centerCurrentNavLink);

if (title) {
    const titleText = title.textContent.trim();
    title.textContent = '';
    [...titleText].forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = letter === ' ' ? 'title-letter title-space' : 'title-letter';
        span.textContent = letter === ' ' ? '\u00a0' : letter;
        span.style.setProperty('--letter-index', index);
        title.appendChild(span);
    });
}

const saved = localStorage.getItem('theme');
if (saved === 'dark') body.classList.add('dark');
const updateThemeIcon = () => {
    const dark = body.classList.contains('dark');
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
};
updateThemeIcon();
const nextPageReaction = sessionStorage.getItem('bear-next-reaction');
if (nextPageReaction) {
    sessionStorage.removeItem('bear-next-reaction');
    showReaction('openPage');
} else {
    showReaction('idle');
}

toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
    showReaction('theme');
});

document.querySelectorAll('button, nav a, main a').forEach((control) => {
    control.addEventListener('mouseenter', () => showReaction('hover'));
    control.addEventListener('mouseleave', () => showReaction('idle'));
    control.addEventListener('click', () => showReaction('click'));
});

document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
        sessionStorage.setItem('bear-next-reaction', 'openPage');
        showReaction('click');
    });
});

const updateBackToTop = () => {
    const visible = window.scrollY > 320;
    backToTop.classList.toggle('is-visible', visible);
    body.classList.toggle('back-to-top-visible', visible);
    backToTop.setAttribute('aria-hidden', String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
};

window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

setInterval(() => showReaction('idle'), 6500);
