const initAdalyaTouch = () => {
    const cards = document.querySelectorAll('.adalya-card');
    const container = document.querySelector('.adalya-container');

    if (!container || cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('touchstart', function (e) {
            // If already active, don't do anything special (allow link click)
            if (this.classList.contains('active')) return;

            // Otherwise, prevent default to handle activation
            e.preventDefault();

            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            container.classList.add('has-active');
        }, { passive: false });
    });

    // Close when clicking outside
    document.addEventListener('touchstart', (e) => {
        if (!container.contains(e.target)) {
            cards.forEach(c => c.classList.remove('active'));
            container.classList.remove('has-active');
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initAdalyaTouch();
    initMobileMenu();
    initSmoothScroll();
    initRevealAnimations();
    initProductInteractions();
    initCategoryEffects();
    initNewsletter();
    initHeaderScroll();
});

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const warnDiv = document.querySelector('.warn');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        warnDiv.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            warnDiv.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// REVEAL ANIMATIONS (Beautiful Stagger)
// ========================================

function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Stagger children
                const children = entry.target.querySelectorAll('.product-card, .category-card, .adalya-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('revealed');
                    }, index * 80);
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .hero-content').forEach(el => {
        el.classList.add('reveal-trigger');
        observer.observe(el);
    });
}

// ========================================
// PRODUCT CARD INTERACTIONS
// ========================================

function initProductInteractions() {
    // Check if any product cards exist
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length === 0) return;
}

// ========================================
// CATEGORY EFFECTS
// ========================================

function initCategoryEffects() {
    // Check if category cards exist
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length === 0) return;
}

// ========================================
// NEWSLETTER
// ========================================

function initNewsletter() {
    const btn = document.querySelector('.newsletter-btn');
    const input = document.querySelector('.newsletter-input');
    if (!btn || !input) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            input.style.borderColor = '#ef4444';
            setTimeout(() => input.style.borderColor = '', 2000);
            return;
        }
        input.value = '';
        input.placeholder = 'Dziękujemy! ✓';
        btn.textContent = '✓';
        setTimeout(() => {
            input.placeholder = 'Twój email';
            btn.textContent = '→';
        }, 3000);
    });
}

// ========================================
// HEADER SCROLL
// ========================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ========================================
// JNR PRODUCTS SLIDER
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('jnrSlider');
    const prevBtn = document.getElementById('jnrPrev');
    const nextBtn = document.getElementById('jnrNext');
    const wrapper = document.getElementById('jnrWrapper');

    if (!slider || !prevBtn || !nextBtn || !wrapper) return;

    let currentIndex = 0;
    const items = slider.querySelectorAll('.product-card');
    const totalItems = items.length;

    function getItemsPerView() {
        if (window.innerWidth > 1024) return 4;
        if (window.innerWidth > 640) return 2;
        return 1;
    }

    function calculateWidths() {
        const itemsPerView = getItemsPerView();
        const gap = parseFloat(getComputedStyle(slider).gap) || 35;
        const containerWidth = wrapper.offsetWidth;
        const itemWidth = (containerWidth - (gap * (itemsPerView - 1))) / itemsPerView;
        return { itemWidth, gap, itemsPerView };
    }

    function updateSlider() {
        const { itemWidth, gap, itemsPerView } = calculateWidths();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
        const moveDistance = currentIndex * (itemWidth + gap);
        slider.style.transform = `translateX(-${moveDistance}px)`;
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - getItemsPerView()) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    let isDragging = false, startX, startScrollX;
    const start = (e) => {
        isDragging = true;
        startX = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
        startScrollX = currentIndex;
        slider.style.transition = 'none';
        wrapper.style.cursor = 'grabbing';
    };
    const move = (e) => {
        if (!isDragging) return;
        const x = (e.pageX || e.touches[0].pageX) - wrapper.offsetLeft;
        const { itemWidth, gap } = calculateWidths();
        currentIndex = startScrollX + (startX - x) / (itemWidth + gap);
        updateSlider();
    };
    const end = () => {
        if (!isDragging) return;
        isDragging = false;
        wrapper.style.cursor = 'grab';
        slider.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        currentIndex = Math.round(currentIndex);
        updateSlider();
    };

    wrapper.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    wrapper.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', (e) => { if (isDragging) e.preventDefault(); move(e); }, { passive: false });
    window.addEventListener('touchend', end);
    window.addEventListener('resize', updateSlider);
    setTimeout(updateSlider, 100);
});

// ========================================
// FUMOT COLLECTION SLIDER
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('fumotSlider');
    const dotsContainer = document.getElementById('fumotDots');
    const items = track?.querySelectorAll('.fumot-item');
    if (!track || !items?.length) return;

    let currentIndex = 0;
    items.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'fumot-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => { currentIndex = i; updateSlider(); };
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.fumot-dot');
    const pBtn = document.getElementById('fumotPrev'), nBtn = document.getElementById('fumotNext');

    function updateSlider() {
        const itemWidth = items[0].offsetWidth;
        const offset = (track.parentElement.offsetWidth / 2) - (itemWidth / 2) - (currentIndex * itemWidth);
        track.style.transform = `translateX(${offset}px)`;
        items.forEach((it, i) => it.classList.toggle('active', i === currentIndex));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        if (pBtn && nBtn) {
            pBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            pBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            nBtn.style.opacity = currentIndex === items.length - 1 ? '0.3' : '1';
            nBtn.style.pointerEvents = currentIndex === items.length - 1 ? 'none' : 'auto';
        }
    }

    if (pBtn) pBtn.onclick = () => { if (currentIndex > 0) { currentIndex--; updateSlider(); } };
    if (nBtn) nBtn.onclick = () => { if (currentIndex < items.length - 1) { currentIndex++; updateSlider(); } };

    let isD = false, sX;
    const start = (e) => { isD = true; sX = e.pageX || e.touches[0].pageX; track.style.transition = 'none'; };
    const move = (e) => {
        if (!isD) return;
        const walk = (e.pageX || e.touches[0].pageX) - sX;
        const itemWidth = items[0].offsetWidth;
        const base = (track.parentElement.offsetWidth / 2) - (itemWidth / 2) - (currentIndex * itemWidth);
        track.style.transform = `translateX(${base + walk}px)`;
    };
    const end = (e) => {
        if (!isD) return; isD = false;
        track.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
        const walk = (e.pageX || e.changedTouches?.[0].pageX || e.pageX) - sX;
        if (Math.abs(walk) > items[0].offsetWidth / 4) {
            if (walk > 0 && currentIndex > 0) currentIndex--;
            else if (walk < 0 && currentIndex < items.length - 1) currentIndex++;
        }
        updateSlider();
    };

    track.onmousedown = start; window.onmousemove = move; window.onmouseup = end;
    track.ontouchstart = start; window.ontouchmove = (e) => { if (isD) e.preventDefault(); move(e); }; window.ontouchend = end;
    window.onresize = updateSlider;
    setTimeout(updateSlider, 200);
});


// Age verification modal
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
    if (localStorage.getItem("ageConfirmed") != "true") {
        ageModal.style.display = "flex";
    } else {
        ageModal.style.display = "none";
    }
});

yesBtn.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    ageModal.style.display = "none";
});

noBtn.addEventListener("click", () => {
    alert("Acceso denegado. Solo para mayores de 18 años.");
    window.close();
    window.location.href = "https://www.google.com";
});

// Hide the top warning when the page is scrolled
const warn = document.querySelector(".warn");
if (warn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            warn.style.display = "none";
        } else {
            warn.style.display = "";
        }
    });
}

// footer
const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");
city.addEventListener("click", toggleCont);
function toggleCont() {
    city.classList.toggle("active");
    Array.from(cont).forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}

// ========================================
// DESCRIPTION SECTION - SHOW MORE
// ========================================

const initShowMore = () => {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const toggleCards = Array.from(document.querySelectorAll('.description-card.hidden'));

    if (!showMoreBtn || toggleCards.length === 0) return;

    let expanded = false;

    const updateButtonText = () => {
        showMoreBtn.textContent = expanded ? 'Ver menos' : 'Ver más';
        showMoreBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };

    showMoreBtn.addEventListener('click', () => {
        expanded = !expanded;
        toggleCards.forEach(card => card.classList.toggle('hidden', !expanded));
        updateButtonText();
    });

    updateButtonText();
};

// Call on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShowMore);
} else {
    initShowMore();
}
