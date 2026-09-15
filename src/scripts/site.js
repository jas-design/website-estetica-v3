import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const revealItems = document.querySelectorAll('[data-reveal]');
const heroSlider = document.querySelector('[data-hero-slider]');
const servicesSplide = document.querySelector('[data-services-splide]');
const articlesSplide = document.querySelector('[data-articles-splide]');
const testimonialsSplide = document.querySelector('[data-testimonials-splide]');
const featureCountdown = document.querySelector('[data-feature-countdown]');

function closeMenu() {
  navToggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
}

function setupMenu() {
  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

    navToggle.setAttribute('aria-expanded', String(!isOpen));
    nav?.classList.toggle('is-open', !isOpen);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

function showRevealItems() {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

function setupRevealAnimation() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    showRevealItems();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));
}

function setupHeroSlider() {
  if (!heroSlider) return;

  const images = [...heroSlider.querySelectorAll('[data-hero-slide-image]')];
  const contents = [...heroSlider.querySelectorAll('[data-hero-slide-content]')];
  const previousButton = heroSlider.querySelector('[data-hero-prev]');
  const nextButton = heroSlider.querySelector('[data-hero-next]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let intervalId;

  function showSlide(index) {
    activeIndex = (index + images.length) % images.length;

    images.forEach((image, imageIndex) => {
      image.classList.toggle('is-active', imageIndex === activeIndex);
    });

    contents.forEach((content, contentIndex) => {
      const isActive = contentIndex === activeIndex;

      content.hidden = !isActive;
      content.classList.toggle('is-active', isActive);
    });
  }

  function stopAutoplay() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion || intervalId || images.length < 2) return;

    intervalId = window.setInterval(() => showSlide(activeIndex + 1), 6500);
  }

  previousButton?.addEventListener('click', () => {
    stopAutoplay();
    showSlide(activeIndex - 1);
  });

  nextButton?.addEventListener('click', () => {
    stopAutoplay();
    showSlide(activeIndex + 1);
  });

  heroSlider.addEventListener('pointerenter', stopAutoplay);
  heroSlider.addEventListener('pointerleave', startAutoplay);
  heroSlider.addEventListener('focusin', stopAutoplay);
  heroSlider.addEventListener('focusout', startAutoplay);

  showSlide(0);
  startAutoplay();
}

function setupServicesSplide() {
  if (!servicesSplide) return;

  const dots = [...servicesSplide.querySelectorAll('[data-services-dot]')];
  const splide = new Splide(servicesSplide, {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    focus: 0,
    gap: '1.45rem',
    arrows: false,
    pagination: false,
    autoplay: true,
    interval: 4600,
    pauseOnHover: true,
    pauseOnFocus: true,
    breakpoints: {
      980: {
        perPage: 2
      },
      768: {
        perPage: 1
      }
    }
  });

  function updateDots() {
    const activeIndex = ((splide.index % dots.length) + dots.length) % dots.length;

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;

      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      splide.go(dotIndex);
    });
  });

  splide.on('mounted move moved', updateDots);
  splide.mount();
}

function setupArticlesSplide() {
  if (!articlesSplide) return;

  const previousButton = articlesSplide.querySelector('[data-article-prev]');
  const nextButton = articlesSplide.querySelector('[data-article-next]');
  const splide = new Splide(articlesSplide, {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    focus: 0,
    gap: '1.45rem',
    arrows: false,
    pagination: false,
    autoplay: true,
    interval: 4500,
    pauseOnHover: true,
    pauseOnFocus: true,
    breakpoints: {
      980: {
        perPage: 2
      },
      768: {
        perPage: 1
      }
    }
  });

  previousButton?.addEventListener('click', () => splide.go('<'));
  nextButton?.addEventListener('click', () => splide.go('>'));
  splide.mount();
}

function setupTestimonialsSplide() {
  if (!testimonialsSplide) return;

  const dots = [...testimonialsSplide.querySelectorAll('[data-testimonial-dot]')];
  const splide = new Splide(testimonialsSplide, {
    type: 'loop',
    perPage: 1,
    perMove: 1,
    arrows: false,
    pagination: false,
    autoplay: true,
    interval: 5600,
    pauseOnHover: true,
    pauseOnFocus: true
  });

  function updateDots() {
    const activeIndex = ((splide.index % dots.length) + dots.length) % dots.length;

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;

      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      splide.go(dotIndex);
    });
  });

  splide.on('mounted move moved', updateDots);
  splide.mount();
}

function setupFeatureCountdown() {
  if (!featureCountdown) return;

  const units = {
    days: featureCountdown.querySelector('[data-countdown-unit="days"]'),
    hours: featureCountdown.querySelector('[data-countdown-unit="hours"]'),
    minutes: featureCountdown.querySelector('[data-countdown-unit="minutes"]'),
    seconds: featureCountdown.querySelector('[data-countdown-unit="seconds"]')
  };
  const storageKey = 'clinica-essenza-feature-countdown-end';
  const offerDuration = ((35 * 24 + 30) * 60 * 60 + 50 * 60 + 45) * 1000;
  let endTime = Number(window.localStorage.getItem(storageKey));

  function createEndTime() {
    endTime = Date.now() + offerDuration;
    window.localStorage.setItem(storageKey, String(endTime));
  }

  function setText(unit, value) {
    if (!unit) return;

    unit.textContent = String(value).padStart(2, '0');
  }

  function updateCountdown() {
    let remaining = endTime - Date.now();

    if (!Number.isFinite(endTime) || remaining <= 0) {
      createEndTime();
      remaining = endTime - Date.now();
    }

    const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setText(units.days, days);
    setText(units.hours, hours);
    setText(units.minutes, minutes);
    setText(units.seconds, seconds);
  }

  if (!Number.isFinite(endTime) || endTime <= Date.now()) {
    createEndTime();
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

setupMenu();
setupRevealAnimation();
setupHeroSlider();
setupServicesSplide();
setupArticlesSplide();
setupTestimonialsSplide();
setupFeatureCountdown();
