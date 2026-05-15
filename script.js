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
let touchEndX = 0;

galleryTrack.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

galleryTrack.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) galleryNext.click();
        else galleryPrev.click();
    }
}, { passive: true });

// ===== Lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryImages = document.querySelectorAll('.gallery-img');
let currentLightboxIndex = 0;

galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentLightboxIndex = index;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

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
