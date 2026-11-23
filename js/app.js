/**
 * LITTLE IDLY - FRONT-END LOGIC & GSAP CHOREOGRAPHY
 * Pure-vegetarian South Indian Restaurant - Al Karama, Dubai
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Register GSAP ScrollTrigger if available
  // ---------------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---------------------------------------------------------------------------
  // 1. ORDER BAG / CART STATE & GLOBAL INTERFACE (Exposed immediately)
  // ---------------------------------------------------------------------------
  let cart = [];

  function getCartElements() {
    return {
      cartDrawer: document.getElementById('cart-drawer'),
      cartBackdrop: document.getElementById('cart-backdrop'),
      cartItemsContainer: document.getElementById('cart-items-container'),
      cartSubtotalEl: document.getElementById('cart-subtotal'),
      cartVatEl: document.getElementById('cart-vat'),
      cartTotalEl: document.getElementById('cart-total'),
      cartCountBadges: document.querySelectorAll('.cart-count-badge'),
      whatsappOrderBtn: document.getElementById('whatsapp-order-btn')
    };
  }

  function openCart() {
    const { cartDrawer, cartBackdrop } = getCartElements();
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('open');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeCart() {
    const { cartDrawer, cartBackdrop } = getCartElements();
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('open');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function toggleCart() {
    const { cartDrawer } = getCartElements();
    if (cartDrawer && cartDrawer.classList.contains('open')) {
      closeCart();
    } else {
      openCart();
    }
  }

  function renderCart() {
    const {
      cartItemsContainer,
      cartSubtotalEl,
      cartVatEl,
      cartTotalEl,
      cartCountBadges,
      whatsappOrderBtn
    } = getCartElements();

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(b => {
      b.textContent = totalCount;
      if (totalCount > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="py-16 text-center">
          <img src="assets/branding/mascot_idly.png" alt="Mascot" class="w-24 h-24 mx-auto mb-4 opacity-80 animate-bounce">
          <p class="font-display font-bold text-lg text-stone-800 mb-1">Your order bag is empty</p>
          <p class="text-stone-500 text-xs max-w-xs mx-auto mb-6">Explore our authentic South Indian tiffins, dosas, and idlis to begin your feast.</p>
          <button onclick="window.closeCart(); var m = document.getElementById('menu'); if(m) m.scrollIntoView({behavior:'smooth'});" class="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors">
            Explore Menu
          </button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '0.00 AED';
      if (cartVatEl) cartVatEl.textContent = '0.00 AED';
      if (cartTotalEl) cartTotalEl.textContent = '0.00 AED';
      if (whatsappOrderBtn) {
        whatsappOrderBtn.classList.add('opacity-50', 'pointer-events-none');
      }
      return;
    }

    if (whatsappOrderBtn) {
      whatsappOrderBtn.classList.remove('opacity-50', 'pointer-events-none');
    }

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg flex-shrink-0">
        <div class="flex-1 min-w-0">
          <h4 class="font-display font-bold text-xs text-stone-900 truncate">${item.name}</h4>
          <p class="text-amber-700 font-bold text-xs">${(item.price * item.quantity).toFixed(2)} AED <span class="text-[10px] text-stone-400 font-normal">(${item.price} each)</span></p>
        </div>
        <div class="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden">
          <button onclick="window.updateCartQty('${item.id}', -1)" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200" aria-label="Decrease quantity">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
          </button>
          <span class="w-7 text-center text-xs font-bold text-stone-800">${item.quantity}</span>
          <button onclick="window.updateCartQty('${item.id}', 1)" class="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200" aria-label="Increase quantity">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.05; // 5% UAE VAT
    const grandTotal = subtotal + vat;

    if (cartSubtotalEl) cartSubtotalEl.textContent = `${subtotal.toFixed(2)} AED`;
    if (cartVatEl) cartVatEl.textContent = `${vat.toFixed(2)} AED`;
    if (cartTotalEl) cartTotalEl.textContent = `${grandTotal.toFixed(2)} AED`;

    if (whatsappOrderBtn) {
      let msg = `Namaskaram Little Idly!%0A%0AI would like to place an order:%0A`;
      cart.forEach(item => {
        msg += `• ${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)} AED%0A`;
      });
      msg += `%0ASubtotal: ${subtotal.toFixed(2)} AED`;
      msg += `%0AVAT (5%): ${vat.toFixed(2)} AED`;
      msg += `%0ATotal Order: ${grandTotal.toFixed(2)} AED%0A`;
      msg += `%0APlease confirm availability and delivery / takeaway details. Nandri!`;

      whatsappOrderBtn.href = `https://wa.me/97142444359?text=${msg}`;
    }
  }

  function addToCart(id) {
    const items = (typeof window !== 'undefined' && window.MENU_ITEMS) || (typeof MENU_ITEMS !== 'undefined' ? MENU_ITEMS : []);
    const item = items.find(m => m.id === id);
    if (!item) return;

    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    renderCart();
    openCart();

    const { cartCountBadges } = getCartElements();
    if (typeof gsap !== 'undefined') {
      cartCountBadges.forEach(b => {
        gsap.fromTo(b, { scale: 1.4 }, { scale: 1, duration: 0.3 });
      });
    }
  }

  function updateCartQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
    renderCart();
  }

  // Bind to window immediately
  window.toggleCart = toggleCart;
  window.closeCart = closeCart;
  window.addToCart = addToCart;
  window.updateCartQty = updateCartQty;

  // ---------------------------------------------------------------------------
  // 2. SEARCHABLE MENU & CATEGORY FILTERING (State & Functions)
  // ---------------------------------------------------------------------------
  let activeCategory = 'all';
  let searchQuery = '';

  function renderMenu() {
    const menuContainer = document.getElementById('menu-items-grid');
    const menuCountEl = document.getElementById('menu-count');
    const items = (typeof window !== 'undefined' && window.MENU_ITEMS) || (typeof MENU_ITEMS !== 'undefined' ? MENU_ITEMS : []);

    if (!menuContainer || !items.length) return;

    const filtered = items.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = !searchQuery ||
                          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (menuCountEl) {
      menuCountEl.textContent = `${filtered.length} Dishes`;
    }

    if (filtered.length === 0) {
      menuContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 text-stone-400 mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="font-display text-xl text-stone-700 font-bold mb-1">No dishes found</p>
          <p class="text-stone-500 text-sm">Try searching for idly, dosa, sambar or vada, or clear your search.</p>
          <button onclick="window.clearSearch()" class="mt-4 px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold">Clear Search</button>
        </div>
      `;
      return;
    }

    menuContainer.innerHTML = filtered.map(item => `
      <div class="group bg-white rounded-xl p-4 border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="relative w-full h-44 rounded-lg overflow-hidden bg-stone-100 mb-3.5">
            <img src="${item.image}" alt="${item.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            ${item.tag ? `<span class="absolute top-2.5 left-2.5 bg-stone-900/85 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-md tracking-wide">${item.tag}</span>` : ''}
            <div class="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur p-1 rounded shadow-sm">
              <div class="veg-mark" title="100% Pure Vegetarian"><span class="veg-mark-dot"></span></div>
            </div>
          </div>
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h3 class="font-display font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors leading-snug">${item.name}</h3>
            <span class="font-display font-bold text-amber-700 text-lg whitespace-nowrap">${item.price} <span class="text-xs font-sans text-stone-500 font-normal">AED</span></span>
          </div>
          <p class="text-stone-600 text-xs leading-relaxed line-clamp-2 mb-4">${item.description}</p>
        </div>
        <button onclick="window.addToCart('${item.id}')" class="w-full py-2.5 px-3 bg-stone-900 hover:bg-amber-600 active:scale-95 text-white font-medium text-xs tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Add to Order
        </button>
      </div>
    `).join('');
  }

  function clearSearch() {
    searchQuery = '';
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) searchInput.value = '';
    renderMenu();
  }

  function filterMenuCategory(cat) {
    activeCategory = cat;
    searchQuery = '';
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) searchInput.value = '';

    const categoryTabs = document.querySelectorAll('.menu-category-tab');
    categoryTabs.forEach(tab => {
      if (tab.getAttribute('data-category') === cat) {
        tab.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');
        tab.classList.add('bg-amber-600', 'text-white', 'border-amber-600');
      } else {
        tab.classList.remove('bg-amber-600', 'text-white', 'border-amber-600');
        tab.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
      }
    });

    renderMenu();
    const menuEl = document.getElementById('menu');
    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
  }

  window.clearSearch = clearSearch;
  window.filterMenuCategory = filterMenuCategory;

  // ---------------------------------------------------------------------------
  // 3. ESSENTIALS STRIP - DUBAI LIVE OPEN/CLOSED HOURS
  // ---------------------------------------------------------------------------
  function updateLiveHours() {
    const statusText = document.getElementById('live-status-text');
    const statusDot = document.getElementById('live-status-dot');
    if (!statusText || !statusDot) return;

    // Dubai Time (UTC + 4)
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const dubaiTime = new Date(utc + (3600000 * 4));

    const hours = dubaiTime.getHours();
    const minutes = dubaiTime.getMinutes();
    const currentDecimal = hours + (minutes / 60);

    // Verified Restaurant Hours: 7:00 AM - 11:30 PM (7.0 to 23.5)
    const isOpen = currentDecimal >= 7.0 && currentDecimal < 23.5;

    if (isOpen) {
      statusText.textContent = "Open Now · Closes 11:30 PM";
      statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
    } else {
      statusText.textContent = "Closed Now · Opens 7:00 AM";
      statusDot.className = "w-2.5 h-2.5 rounded-full bg-amber-500";
    }
  }

  // ---------------------------------------------------------------------------
  // 4. HERO SLIDER STATE & CHOREOGRAPHY
  // ---------------------------------------------------------------------------
  let currentSlide = 0;
  let slideInterval = null;
  const SLIDE_DURATION = 5500;
  let heroInitialized = false;
  let progressTween = null;

  function updateProgress() {
    if (progressTween) progressTween.kill();
    const progressFill = document.getElementById('hero-progress-fill');
    if (progressFill && typeof gsap !== 'undefined') {
      gsap.set(progressFill, { width: '0%' });
      progressTween = gsap.to(progressFill, {
        width: '100%',
        duration: SLIDE_DURATION / 1000,
        ease: 'none'
      });
    }
  }

  function updateDots(index) {
    const heroDots = document.querySelectorAll('.hero-dot');
    const slideCounterEl = document.getElementById('hero-slide-counter');

    heroDots.forEach((dot, idx) => {
      const dotSpan = dot.querySelector('span');
      if (idx === index) {
        dot.classList.add('active', 'text-gold');
        dot.classList.remove('text-stone-400');
        if (dotSpan) dotSpan.className = 'w-1.5 h-1.5 rounded-full bg-gold';
      } else {
        dot.classList.remove('active', 'text-gold');
        dot.classList.add('text-stone-400');
        if (dotSpan) dotSpan.className = 'w-1.5 h-1.5 rounded-full bg-stone-500';
      }
    });

    if (slideCounterEl) {
      slideCounterEl.textContent = `0${index + 1}`;
    }
  }

  function animateSlide(index, direction = 1) {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    slides.forEach((slide, i) => {
      const isReversed = slide.getAttribute('data-reversed') === 'true';
      const dish = slide.querySelector('.hero-dish');
      const title = slide.querySelector('.hero-title');
      const rule = slide.querySelector('.hero-rule');
      const desc = slide.querySelector('.hero-desc');
      const btn = slide.querySelector('.hero-btn');

      if (i === index) {
        slide.classList.remove('hidden');
        slide.classList.add('active');

        if (typeof gsap !== 'undefined') {
          // Kill active tweens on this slide's elements
          gsap.killTweensOf([dish, title, rule, desc, btn].filter(Boolean));

          // Reset positions according to slide direction
          const startX = direction > 0 ? (isReversed ? -70 : 70) : (isReversed ? 70 : -70);
          gsap.set(dish, { opacity: 0, x: startX, scale: 0.95 });
          gsap.set(title, { opacity: 0, y: -25 });
          gsap.set(rule, { scaleX: 0, transformOrigin: isReversed ? 'right center' : 'left center' });
          gsap.set([desc, btn].filter(Boolean), { opacity: 0, y: 25 });

          // Choreography
          const stl = gsap.timeline();
          stl.to(dish, { opacity: 1, x: 0, scale: 1, duration: 0.75, ease: 'power3.out' })
             .to(title, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.5')
             .to(rule, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.3')
             .to([desc, btn].filter(Boolean), { opacity: 1, y: 0, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, '-=0.25');
        }
      } else {
        slide.classList.add('hidden');
        slide.classList.remove('active');
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf([dish, title, rule, desc, btn].filter(Boolean));
        }
      }
    });

    updateDots(index);
    updateProgress();
  }

  function nextSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    currentSlide = (currentSlide + 1) % slides.length;
    animateSlide(currentSlide, 1);
  }

  function prevSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    animateSlide(currentSlide, -1);
  }

  function goToSlide(index) {
    if (index === currentSlide) return;
    const dir = index > currentSlide ? 1 : -1;
    currentSlide = index;
    animateSlide(currentSlide, dir);
    startAutoplay();
  }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
    if (progressTween) progressTween.pause();
  }

  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (heroInitialized || !slides.length) return;
    heroInitialized = true;

    animateSlide(0);
    startAutoplay();

    const nextBtn = document.getElementById('hero-next');
    const prevBtn = document.getElementById('hero-prev');

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAutoplay();
      });
    }

    const heroDots = document.querySelectorAll('.hero-dot');
    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    const heroStage = document.getElementById('hero');
    if (heroStage) {
      heroStage.addEventListener('mouseenter', stopAutoplay);
      heroStage.addEventListener('mouseleave', () => {
        if (progressTween) progressTween.resume();
        startAutoplay();
      });
    }

    // Keyboard navigation (Left / Right arrow keys)
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. GSAP SCROLLTRIGGERS & ANIMATIONS
  // ---------------------------------------------------------------------------
  let scrollTriggersInitialized = false;

  function initScrollTriggers() {
    if (scrollTriggersInitialized) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    scrollTriggersInitialized = true;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Reduced motion: ensure metric numbers are rendered directly
      document.querySelectorAll('.counter-val').forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0');
        const isDecimal = counter.getAttribute('data-decimal') === '1';
        counter.textContent = isDecimal ? target.toFixed(1) : target;
      });
      return;
    }

    // Story stamp frame reveal
    const storyFrame = document.getElementById('story-stamp-frame');
    if (storyFrame) {
      gsap.fromTo(storyFrame,
        { rotate: -10, scale: 0.9, opacity: 0 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#story',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Story content reveal
    const storyContent = document.getElementById('story-content');
    if (storyContent) {
      gsap.fromTo(storyContent,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#story',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Made fresh group reveals
    const freshStamps = document.getElementById('fresh-stamps-group');
    if (freshStamps) {
      gsap.fromTo(freshStamps,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#made-fresh',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    const freshText = document.getElementById('fresh-text-group');
    if (freshText) {
      gsap.fromTo(freshText,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#made-fresh',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Cooking cluster & cards
    const cookingCluster = document.getElementById('cooking-cluster');
    if (cookingCluster) {
      gsap.fromTo(cookingCluster,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#see-whats-cooking',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    const cookingLeft = document.querySelectorAll('.cooking-left-card');
    if (cookingLeft.length) {
      gsap.fromTo(cookingLeft,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#see-whats-cooking',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    const cookingRight = document.querySelectorAll('.cooking-right-card');
    if (cookingRight.length) {
      gsap.fromTo(cookingRight,
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#see-whats-cooking',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Family time section
    const familyMascot = document.getElementById('family-mascot');
    if (familyMascot) {
      gsap.fromTo(familyMascot,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#family-time',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    const familyPlatter = document.getElementById('family-platter');
    if (familyPlatter) {
      gsap.fromTo(familyPlatter,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#family-time',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Updates cards
    const updateArticles = document.querySelectorAll('#updates article');
    if (updateArticles.length) {
      gsap.fromTo(updateArticles,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.18,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#updates',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // Polaroid cards
    const polaroids = document.querySelectorAll('.polaroid-card');
    if (polaroids.length) {
      gsap.fromTo(polaroids,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: polaroids[0],
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // -------------------------------------------------------------------------
    // ANIMATED METRIC NUMBER COUNTERS (Authentic South Indian Flavours Highlights)
    // -------------------------------------------------------------------------
    document.querySelectorAll('.counter-val').forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      const isDecimal = counter.getAttribute('data-decimal') === '1';
      let hasRun = false;

      function startCounting() {
        if (hasRun) return;
        hasRun = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            counter.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val);
          },
          onComplete: () => {
            counter.textContent = isDecimal ? target.toFixed(1) : target;
          }
        });
      }

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 92%',
        once: true,
        onEnter: startCounting
      });

      // Reliable viewport check: If counter is already visible on page load or refresh
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startCounting();
      }
    });

    // 3D Tilt cards
    const tiltCards = document.querySelectorAll('.polaroid-card, .postage-stamp-frame, .pinned-paper-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Refresh triggers to ensure exact alignment
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 250);
  }

  // ---------------------------------------------------------------------------
  // 6. PRELOADER CURTAIN SEQUENCE
  // ---------------------------------------------------------------------------
  function runPreloader(force = false) {
    const preloader = document.getElementById('preloader-curtain');
    const curtainLeft = document.getElementById('curtain-left');
    const curtainRight = document.getElementById('curtain-right');
    const preloaderCard = document.getElementById('preloader-card');

    if (!preloader || !curtainLeft || !curtainRight) {
      initHeroSlider();
      initScrollTriggers();
      return;
    }

    const hasPlayed = sessionStorage.getItem('little_idly_intro_played');
    if (hasPlayed && !force) {
      preloader.style.display = 'none';
      preloader.style.pointerEvents = 'none';
      initHeroSlider();
      initScrollTriggers();
      return;
    }

    // Prepare curtain elements
    preloader.style.display = 'flex';
    preloader.style.pointerEvents = 'auto';

    if (typeof gsap === 'undefined') {
      preloader.style.display = 'none';
      preloader.style.pointerEvents = 'none';
      initHeroSlider();
      initScrollTriggers();
      return;
    }

    gsap.set([curtainLeft, curtainRight], { xPercent: 0 });
    gsap.set(preloaderCard, { opacity: 0, scale: 0.94, y: 15 });

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        preloader.style.pointerEvents = 'none';
        sessionStorage.setItem('little_idly_intro_played', 'true');
        initScrollTriggers();
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 150);
        }
      }
    });

    tl.to(preloaderCard, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .to('.steaming-icon', {
      y: -4,
      repeat: 1,
      yoyo: true,
      stagger: 0.1,
      duration: 0.25,
      ease: 'sine.inOut'
    }, '-=0.2')
    .to({}, { duration: 0.35 })
    .to(preloaderCard, {
      opacity: 0,
      scale: 1.06,
      duration: 0.35,
      ease: 'power2.in'
    })
    .to(curtainLeft, {
      xPercent: -100,
      duration: 0.85,
      ease: 'power3.inOut',
      onStart: () => {
        // As soon as curtain begins opening, unblock clicks to slider arrows!
        preloader.style.pointerEvents = 'none';
      }
    }, '-=0.15')
    .to(curtainRight, {
      xPercent: 100,
      duration: 0.85,
      ease: 'power3.inOut'
    }, '<')
    .add(() => {
      initHeroSlider();
    }, '-=0.5');
  }

  // ---------------------------------------------------------------------------
  // 7. MAIN INITIALIZATION
  // ---------------------------------------------------------------------------
  function initApp() {
    // 1. Initial live hours
    updateLiveHours();
    setInterval(updateLiveHours, 60000);

    // 2. Render menu dishes immediately
    renderMenu();

    // 3. Search and category tab listeners
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderMenu();
      });
    }

    const categoryTabs = document.querySelectorAll('.menu-category-tab');
    if (categoryTabs.length) {
      categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          categoryTabs.forEach(t => {
            t.classList.remove('bg-amber-600', 'text-white', 'border-amber-600');
            t.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
          });
          tab.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');
          tab.classList.add('bg-amber-600', 'text-white', 'border-amber-600');
          activeCategory = tab.getAttribute('data-category') || 'all';
          renderMenu();
        });
      });
    }

    // 4. Cart close on backdrop click
    const cartBackdrop = document.getElementById('cart-backdrop');
    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', closeCart);
    }

    // 5. Replay intro button
    const replayBtn = document.getElementById('replay-intro-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => runPreloader(true), 350);
      });
    }

    // 6. Preloader check & hero/triggers init
    runPreloader();

    // 7. Ensure ScrollTrigger refreshes when all assets/fonts/images are loaded
    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  }

  // Run on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
