const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const revealItems = document.querySelectorAll('[data-reveal]');
const heroSlider = document.querySelector('[data-hero-slider]');
const serviceCarousel = document.querySelector('[data-service-carousel]');
const articleCarousel = document.querySelector('[data-article-carousel]');
const testimonialCarousel = document.querySelector('[data-testimonial-carousel]');
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

function setupArticleCarousel() {
  if (!articleCarousel) return;

  const track = articleCarousel.querySelector('[data-article-track]');
  const previousButton = articleCarousel.querySelector('[data-article-prev]');
  const nextButton = articleCarousel.querySelector('[data-article-next]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!track) return;

  const originalCards = [...track.querySelectorAll('.article-card')];

  if (originalCards.length < 2) return;

  function cloneCard(card) {
    const clone = card.cloneNode(true);

    clone.removeAttribute('data-reveal');
    clone.classList.add('is-visible');

    return clone;
  }

  originalCards.forEach((card) => {
    track.append(cloneCard(card));
  });

  [...originalCards].reverse().forEach((card) => {
    track.prepend(cloneCard(card));
  });

  const originalCount = originalCards.length;
  let activeIndex = originalCount;
  let intervalId;

  function getStepSize() {
    const firstCard = track.querySelector('.article-card');
    const secondCard = firstCard?.nextElementSibling;

    if (!firstCard) return 0;
    if (!secondCard) return firstCard.getBoundingClientRect().width;

    return secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left;
  }

  function moveTo(index, animate = true) {
    activeIndex = index;
    track.classList.toggle('is-jumping', !animate);
    track.style.transform = `translateX(${-getStepSize() * activeIndex}px)`;
  }

  function normalizeLoop() {
    if (activeIndex >= originalCount * 2) {
      moveTo(originalCount, false);
    }

    if (activeIndex < originalCount) {
      moveTo(originalCount * 2 - 1, false);
    }
  }

  function stopAutoplay() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion || intervalId) return;

    intervalId = window.setInterval(() => moveTo(activeIndex + 1), 4500);
  }

  track.addEventListener('transitionend', normalizeLoop);
  window.addEventListener('resize', () => moveTo(activeIndex, false));

  previousButton?.addEventListener('click', () => {
    stopAutoplay();
    moveTo(activeIndex - 1);
  });

  nextButton?.addEventListener('click', () => {
    stopAutoplay();
    moveTo(activeIndex + 1);
  });

  articleCarousel.addEventListener('pointerenter', stopAutoplay);
  articleCarousel.addEventListener('pointerleave', startAutoplay);
  articleCarousel.addEventListener('focusin', stopAutoplay);
  articleCarousel.addEventListener('focusout', startAutoplay);

  moveTo(activeIndex, false);
  startAutoplay();
}

function setupServiceCarousel() {
  if (!serviceCarousel) return;

  const track = serviceCarousel.querySelector('[data-service-track]');
  const dots = [...serviceCarousel.querySelectorAll('[data-service-dot]')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!track) return;

  const originalCards = [...track.querySelectorAll('.service-card')];

  if (originalCards.length < 2) return;

  function cloneCard(card) {
    const clone = card.cloneNode(true);

    clone.removeAttribute('data-reveal');
    clone.classList.add('is-visible');

    return clone;
  }

  originalCards.forEach((card) => {
    track.append(cloneCard(card));
  });

  [...originalCards].reverse().forEach((card) => {
    track.prepend(cloneCard(card));
  });

  const originalCount = originalCards.length;
  let activeIndex = originalCount;
  let intervalId;

  function getStepSize() {
    const firstCard = track.querySelector('.service-card');
    const secondCard = firstCard?.nextElementSibling;

    if (!firstCard) return 0;
    if (!secondCard) return firstCard.getBoundingClientRect().width;

    return secondCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left;
  }

  function updateDots() {
    const normalizedIndex = ((activeIndex - originalCount) % originalCount + originalCount) % originalCount;

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === normalizedIndex;

      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  function moveTo(index, animate = true) {
    activeIndex = index;
    track.classList.toggle('is-jumping', !animate);
    track.style.transform = `translateX(${-getStepSize() * activeIndex}px)`;
    updateDots();
  }

  function normalizeLoop() {
    if (activeIndex >= originalCount * 2) {
      moveTo(originalCount, false);
    }

    if (activeIndex < originalCount) {
      moveTo(originalCount * 2 - 1, false);
    }
  }

  function stopAutoplay() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion || intervalId) return;

    intervalId = window.setInterval(() => moveTo(activeIndex + 1), 4600);
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      moveTo(originalCount + dotIndex);
    });
  });

  track.addEventListener('transitionend', normalizeLoop);
  window.addEventListener('resize', () => moveTo(activeIndex, false));

  serviceCarousel.addEventListener('pointerenter', stopAutoplay);
  serviceCarousel.addEventListener('pointerleave', startAutoplay);
  serviceCarousel.addEventListener('focusin', stopAutoplay);
  serviceCarousel.addEventListener('focusout', startAutoplay);

  moveTo(activeIndex, false);
  startAutoplay();
}

function setupTestimonialCarousel() {
  if (!testimonialCarousel) return;

  const slides = [...testimonialCarousel.querySelectorAll('[data-testimonial-slide]')];
  const dots = [...testimonialCarousel.querySelectorAll('[data-testimonial-dot]')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let intervalId;

  if (slides.length < 2) return;

  function showTestimonial(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;

      slide.hidden = !isActive;
      slide.classList.toggle('is-active', isActive);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;

      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', String(isActive));
    });
  }

  function stopAutoplay() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion || intervalId) return;

    intervalId = window.setInterval(() => showTestimonial(activeIndex + 1), 5600);
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showTestimonial(dotIndex);
    });
  });

  testimonialCarousel.addEventListener('pointerenter', stopAutoplay);
  testimonialCarousel.addEventListener('pointerleave', startAutoplay);
  testimonialCarousel.addEventListener('focusin', stopAutoplay);
  testimonialCarousel.addEventListener('focusout', startAutoplay);

  showTestimonial(0);
  startAutoplay();
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
setupServiceCarousel();
setupArticleCarousel();
setupTestimonialCarousel();
setupFeatureCountdown();
