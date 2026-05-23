// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Close mobile nav on click outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    }
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinksAll = navLinks.querySelectorAll('a');

function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            navLinksAll.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// ===== Menu Tabs =====
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCategories = document.querySelectorAll('.menu-category');
const categoryMap = {
    sweet: 'cat-sweet',
    fruit: 'cat-fruit',
    premium: 'cat-premium',
    savoury: 'cat-savoury',
    breakfast: 'cat-breakfast',
    drinks: 'cat-drinks'
};

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        menuTabs.forEach(t => t.classList.remove('active'));
        menuCategories.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.category;
        document.getElementById(categoryMap[cat]).classList.add('active');
    });
});

// ===== Menu Gallery =====
const galleryTrack = document.getElementById('galleryTrack');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
let currentGalleryIndex = 0;
const galleryImagesCount = document.querySelectorAll('.gallery-img').length;

function updateGalleryPosition() {
    galleryTrack.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
}

galleryNext.addEventListener('click', () => {
    if (currentGalleryIndex < galleryImagesCount - 1) {
        currentGalleryIndex++;
        updateGalleryPosition();
    }
});

galleryPrev.addEventListener('click', () => {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryPosition();
    }
});

// Touch swipe for gallery
let touchStartX = 0;

galleryTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

galleryTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
        if (diff > 0) galleryNext.click();
        else galleryPrev.click();
    }
}, { passive: true });

// Mouse drag for gallery
let mouseDown = false;
let mouseStartX = 0;

galleryTrack.addEventListener('mousedown', e => {
    mouseDown = true;
    mouseStartX = e.clientX;
    galleryTrack.style.cursor = 'grabbing';
});

document.addEventListener('mouseup', e => {
    if (!mouseDown) return;
    mouseDown = false;
    galleryTrack.style.cursor = '';
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 40) {
        if (diff > 0) galleryNext.click();
        else galleryPrev.click();
    }
});

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryImages = document.querySelectorAll('.gallery-img');
let currentLightboxIndex = 0;

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLightboxIndex].src;
    lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentLightboxIndex].src;
    lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
});

// ===== Testimonial Slider =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    testimonialCards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        showTestimonial(parseInt(dot.dataset.index));
        resetAutoSlide();
    });
});

function autoSlide() {
    testimonialInterval = setInterval(() => {
        showTestimonial((currentTestimonial + 1) % testimonialCards.length);
    }, 5000);
}

function resetAutoSlide() {
    clearInterval(testimonialInterval);
    autoSlide();
}

autoSlide();

// ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(num => {
                const target = parseInt(num.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                num.textContent = '0';
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    num.textContent = Math.round(current);
                }, 16);
            });
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// ===== Scroll Reveal =====
function addRevealClasses() {
    const elements = document.querySelectorAll(
        '.section-tag, .section-title, .section-desc, .feature-card, .about-text, .about-images, .menu-gallery, .hours-block, .stat-item, .footer-brand, .footer-links, .footer-contact'
    );
    elements.forEach(el => el.classList.add('reveal'));
}

function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88) {
            el.classList.add('visible');
        }
    });
}

addRevealClasses();
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== Language Detection & Translation =====
const translations = {
    en: {
        nav_home: 'Home',
        nav_about: 'About us',
        nav_why: 'Why us',
        nav_menu: 'Menu',
        nav_hours: 'Working hours',
        nav_reviews: 'Reviews',
        nav_contact: 'Contact',
        hero_title_html: 'Welcome to<br><span>Palačinka Bar Leo</span>',
        hero_desc_html: 'Unique pancake flavours made with love.<br>Visit us and enjoy every bite.',
        hero_btn_menu: 'View Menu',
        hero_btn_find: 'Find us',
        about_tag: 'About us',
        about_title_html: 'We invite you to<br>visit our bar',
        about_p1: 'Palačinka Bar Leo is a place where tradition meets creativity. We prepare our pancakes from the finest ingredients, with love and attention to every detail.',
        about_p2: 'Whether you\'re looking for a sweet treat, a fruity refreshment, or a savoury pancake for a meal — you\'ll find the perfect choice for every taste and occasion.',
        menu_title: 'Our menu',
        features_tag: 'Why us',
        features_title: 'Why do people choose us?',
        features_desc: 'We are dedicated to quality, taste, and your satisfaction.',
        feature1_title: 'Exquisite taste',
        feature1_desc: 'Every pancake is prepared with care so that each bite is an unforgettable experience for your palate.',
        feature2_title: 'Fresh ingredients',
        feature2_desc: 'We use only the freshest and finest ingredients to ensure an authentic and rich flavour.',
        feature3_title: 'Skilled chefs',
        feature3_desc: 'Our team lovingly prepares every pancake, combining traditional recipes with modern techniques.',
        stat1_label: 'Types of pancakes',
        stat2_label: 'Fresh ingredients',
        hours_tag: 'Working hours',
        hours_title: 'Working hours',
        hours_weekdays: 'Monday - Friday',
        hours_saturday: 'Saturday',
        hours_sunday: 'Sunday',
        dress_text_html: 'Please respect our dress code; <strong>Do not come in swimwear</strong>, always wear a shirt or cover your upper body. Also please <strong>do not sit on the cushions while wet</strong>, move them aside. Thank you!',
        dress_no_swimwear: 'No swimwear',
        dress_no_wet: 'Don\'t sit wet',
        reviews_tag: 'Reviews',
        reviews_title: 'What our guests say',
        review1_text: 'Best pancakes in town! The Chocolate Fantasy is incredible — a perfect combination of Nutella and chocolate chips. We\'re definitely coming back!',
        review2_text: 'Great place for breakfast! The omelette with ham and cheese with coffee is a perfect start to the day. The staff is extremely friendly and the service is fast.',
        review3_text: 'The Kinder Bueno pancake is pure perfection! My kids love coming here. The atmosphere is pleasant and the prices are reasonable for the quality offered.',
        footer_brand: 'Pancake & Cafe Bar Leo — a place where every pancake tells its own story.',
        footer_nav: 'Navigation',
        footer_copy_html: '&copy; 2025 Palačinka Bar Leo. All rights reserved.'
    }
};

const hrTexts = {};

function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    if (lang === 'en') {
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (!hrTexts[key]) hrTexts[key] = el.innerHTML;
            if (translations.en[key]) {
                if (key.endsWith('_html')) {
                    el.innerHTML = translations.en[key];
                } else {
                    el.textContent = translations.en[key];
                }
            }
        });
        document.documentElement.lang = 'en';
    } else {
        elements.forEach(function(el) {
            var key = el.getAttribute('data-i18n');
            if (hrTexts[key]) {
                el.innerHTML = hrTexts[key];
            }
        });
        document.documentElement.lang = 'hr';
    }
}

var currentLang = 'hr';
var browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
var savedLang = localStorage.getItem('pbl_lang');

if (savedLang) {
    currentLang = savedLang;
} else if (!browserLang.startsWith('hr')) {
    currentLang = 'en';
}

var langBtn = document.getElementById('langToggle');

if (currentLang === 'en') {
    applyLanguage('en');
    langBtn.textContent = 'EN';
}

langBtn.addEventListener('click', function() {
    if (currentLang === 'hr') {
        currentLang = 'en';
        applyLanguage('en');
        langBtn.textContent = 'EN';
    } else {
        currentLang = 'hr';
        applyLanguage('hr');
        langBtn.textContent = 'HR';
    }
    localStorage.setItem('pbl_lang', currentLang);
});
