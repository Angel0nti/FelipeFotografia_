'strict';

class StickyNav {
  constructor(navSelector, headerSelector, navLogo) {
    this.nav = document.querySelector(navSelector);
    this.header = document.querySelector(headerSelector);
    this.navHeight = this.nav.getBoundingClientRect().height;
    this.navLogo = document.querySelector(navLogo);
    this.isSticky = false;

    this._goToTop();
    this._initObserver();
    this._bindResizeEvent();
  }

  _updateMarginTop() {
    this.header.style.marginTop =
      window.innerWidth > 768 && this.isSticky ? `${this.navHeight}px` : null;
  }

  _handleIntersect = ([entry]) => {
    if (!entry.isIntersecting && !this.isSticky) {
      this.nav.classList.add('sticky');
      this.isSticky = true;
      this._updateMarginTop();
    } else {
      this.nav.classList.remove('sticky');
      this.isSticky = false;
      this._updateMarginTop();
    }
  };

  _initObserver() {
    this.observer = new IntersectionObserver(this._handleIntersect, {
      root: null,
      threshold: 0,
      rootMargin: `${this.navHeight}px`,
    });
    this.observer.observe(this.header);
  }

  _bindResizeEvent() {
    window.addEventListener('resize', () => this._updateMarginTop());
  }

  _goToTop() {
    this.navLogo.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  destroy() {
    // Clear observer and event resize when needed
    this.observer.disconnect();
    window.removeEventListener('resize', this._updateMarginTop);
  }
}
new StickyNav('.nav', '.hero', '#logo');
// const stickyNav = new StickyNav('.nav', '.hero');
// stickyNav.destroy();

class SectionRevealer {
  constructor(sectionSelector, threshold = 0.4) {
    this.sections = document.querySelectorAll(sectionSelector);
    this.threshold = threshold;

    this._initObserver();
    this._hideSections();
  }

  _hideSections() {
    this.sections.forEach(section => section.classList.add('section--hidden'));
  }

  _onIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    });
  };

  _initObserver() {
    this.observer = new IntersectionObserver(this._onIntersect, {
      root: null,
      threshold: this.threshold,
    });

    this.sections.forEach(section => this.observer.observe(section));
  }
}
class AboutMeRevealer extends SectionRevealer {
  constructor() {
    super('#about-me');
    this._observeImageForAnimation();
  }

  _observeImageForAnimation() {
    const img = this.sections[0].querySelector('#about-me-img');
    const isMobile = window.innerWidth <= 768;

    const options = {
      root: null,
      threshold: isMobile ? 0.9 : 0.1,
      rootMargin: isMobile ? '0px 0px -10% 0px' : '0px 0px -20% 0px',
    };

    if (!img) return;

    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        console.log('Hi');

        const text = this.sections[0].querySelector('.acerca-de-content');
        if (text) text.classList.add('animate-in');

        observer.unobserve(entry.target);
      });
    }, options);

    imgObserver.observe(img);
  }
}

class EventRevealer extends SectionRevealer {
  constructor() {
    super('#eventos');
    this._observeImageForAnimation();
  }

  _observeImageForAnimation() {
    const img = this.sections[0].querySelector('#slides-event-animation');
    const isMobile = window.innerWidth <= 768;

    const options = {
      root: null,
      threshold: isMobile ? 1 : 0.1,
      rootMargin: isMobile ? '0px 0px -10% 0px' : '0px 0px -20% 0px',
    };

    if (!img) return;

    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const text = this.sections[0].querySelector('.event-text-container');
        if (text) text.classList.add('animate-in');

        observer.unobserve(entry.target);
      });
    }, options);

    imgObserver.observe(img);
  }
}

new SectionRevealer('.section:not(#about-me):not(#eventos)');
new AboutMeRevealer();
new EventRevealer();

class SmoothScroller {
  constructor(linkSelector, navSelector) {
    this.links = document.querySelectorAll(linkSelector);
    this.nav = document.querySelector(navSelector);

    this._addClickListeners();
  }

  _addClickListeners() {
    this.links.forEach(link => {
      link.addEventListener('click', this._handleClick.bind(this));
    });
  }

  _handleClick(e) {
    e.preventDefault();

    const targetId = e.currentTarget.getAttribute('href');
    const targetEl = document.querySelector(targetId);

    if (targetEl) {
      const offsetTop = targetEl.offsetTop - this.nav.offsetHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  }
}
new SmoothScroller('.nav__a', '.nav');

class ScrollReset {
  constructor() {
    this._setScroollRestoration();
    this._resetOnLoad();
  }

  _setScroollRestoration() {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }

  _resetOnLoad() {
    window.addEventListener('load', this._timeOut.bind(this));
  }
  _timeOut() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      history.replaceState(null, '', window.location.pathname);
    }, 0);
  }
}
new ScrollReset();

class ImageSlider {
  constructor({
    containerSelector,
    spinnerSelector,
    buttonsSelector,
    btnLeftSelector,
    btnRightSelector,
    data,
  }) {
    this.container = document.querySelector(containerSelector);
    this.spinner = document.querySelector(spinnerSelector);
    this.buttons = document.querySelectorAll(buttonsSelector);
    this.btnLeft = document.querySelector(btnLeftSelector);
    this.btnRight = document.querySelector(btnRightSelector);
    this.data = data;

    this.currentSlide = 0;
    this.currentImages = [];

    this._bindCategoryButtons();
    this._setupNavButtons();

    const defaultCategory = Object.keys(data)[0];
    if (defaultCategory) {
      this._renderSlides(data[defaultCategory]);
    }
  }

  _renderSlides(images) {
    this.container.innerHTML = '';
    this.currentImages = images;
    this.currentSlide = 0;

    const figure = document.createElement('figure');
    figure.classList.add('slider__images--img1');

    const image = new Image();
    image.dataset.src = images[0];
    image.alt = `slide 1`;
    image.loading = 'lazy';
    image.width = 800;
    image.height = 533;
    image.classList.add('lazy-img');

    figure.appendChild(image);
    this.container.appendChild(figure);

    this._observeImages(); // Lazy load
  }

  _updateSlide(index) {
    const image = this.container.querySelector('img');
    if (!image) return;

    image.dataset.src = this.currentImages[index];
    image.alt = `slide ${index + 1}`;
    image.classList.add('lazy-img');

    this._observeImages();
    this.currentSlide = index;
  }

  _observeImages() {
    const lazyImages = this.container.querySelectorAll('.lazy-img');
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.remove('lazy-img');
            img.classList.add('loaded');
          };
          observer.unobserve(img);
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );
    lazyImages.forEach(img => observer.observe(img));
  }

  _moveToSlide(index) {
    this._updateSlide(index);
  }

  _setupNavButtons() {
    this.btnRight.addEventListener('click', this._moveToRight.bind(this));
    this.btnLeft.addEventListener('click', this._moveToLeft.bind(this));
  }

  _moveToRight() {
    if (this.currentImages.length === 0) return;
    const nextIndex = (this.currentSlide + 1) % this.currentImages.length;
    this._moveToSlide(nextIndex);
  }

  _moveToLeft() {
    if (this.currentImages.length === 0) return;
    const prevIndex =
      (this.currentSlide - 1 + this.currentImages.length) %
      this.currentImages.length;
    this._moveToSlide(prevIndex);
  }

  _bindCategoryButtons() {
    this.buttons.forEach(button => {
      button.addEventListener('click', this._btnToEachCategory.bind(this));
    });
  }

  _btnToEachCategory(event) {
    const button = event.currentTarget;
    const category = button.dataset.category;
    const images = this.data[category];

    if (images) {
      this._renderSlides(images);
    }
  }
}
const slider = new ImageSlider({
  containerSelector: '.slider__images',
  buttonsSelector: '.btn-image-slide',
  btnLeftSelector: '.slider__btn--left',
  btnRightSelector: '.slider__btn--right',

  data: {
    weddings: ['1.avif', '2.avif', '3.avif', '4.avif', '5.avif', '6.avif'].map(
      n => `bodas/boda${n}`
    ),

    exteriores: [
      '1.avif',
      '2.avif',
      '3.avif',
      '4.avif',
      '5.avif',
      '6.avif',
      '7.avif',
      '8.avif',
      '9.avif',
    ].map(n => `ext/ext${n}`),
    graduaciones: [
      '1.avif',
      '2.avif',
      '3.avif',
      '4.avif',
      '5.avif',
      '6.avif',
    ].map(n => `/grad/grad${n}`),
    retratos: [
      '1.avif',
      '2.avif',
      '3.avif',
      '4.avif',
      '5.avif',
      '6.avif',
      '7.avif',
      '8.avif',
      '9.avif',
    ].map(n => `/estudio/est${n}`),
  },
});

class EventSlider {
  constructor({ containerSelector, images, interval = 1500 }) {
    this.container = document.querySelector(containerSelector);
    this.images = images;
    this.interval = interval;
    this.currentIndex = 0;

    if (!this.container || this.images.length === 0) return;

    this._createImageElement();
    this._startAutoplay();
  }

  _createImageElement() {
    const picture = document.createElement('picture');
    picture.classList.add('eventos__images--img');

    this.imgElement = new Image();
    this.imgElement.src = this.images[0];
    this.imgElement.alt = 'Evento 1';
    this.imgElement.id = 'slides-event-animation';
    this.imgElement.loading = 'lazy';
    this.imgElement.width = 800;
    this.imgElement.height = 533;

    picture.appendChild(this.imgElement);
    this.container.appendChild(picture);
  }

  _startAutoplay() {
    this.timer = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this._updateImage();
    }, this.interval);
  }

  _updateImage() {
    const newSrc = this.images[this.currentIndex];
    this.imgElement.classList.add('fade-out');

    setTimeout(() => {
      this.imgElement.src = newSrc;
      this.imgElement.alt = `Evento ${this.currentIndex + 1}`;
      this.imgElement.classList.remove('fade-out');
    }, 200);
  }
}

const eventSlider = new EventSlider({
  containerSelector: '.eventos__images',
  images: [
    '1.avif',
    '2.avif',
    '3.avif',
    '4.avif',
    '5.avif',
    '6.avif',
    '7.avif',
    '8.avif',
  ].map(n => `/eventos/event${n}`),
  interval: 1500,
});
class HamburgerMenu {
  constructor({ hamSelector, menuSelector }) {
    this.hamMenu = document.querySelector(hamSelector);
    this.menu = document.querySelector(menuSelector);

    if (!this.hamMenu || !this.menu) return;

    this._addEventListeners();
  }

  _addEventListeners() {
    this.hamMenu.addEventListener('click', e => {
      e.stopPropagation();
      this.hamMenu.classList.toggle('active');
      this.menu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      if (this.menu.classList.contains('active')) {
        this._closeMenu();
      }
    });

    this.menu.addEventListener('click', e => e.stopPropagation());
  }

  _closeMenu() {
    this.hamMenu.classList.remove('active');
    this.menu.classList.remove('active');
  }
}

// Inicializar
const menu = new HamburgerMenu({
  hamSelector: '.ham-menu',
  menuSelector: '.dropdown-menu',
});
