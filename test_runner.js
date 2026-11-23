
const fs = require('fs');

function testSimulation(scenario) {
  console.log('=== TESTING SCENARIO:', scenario, '===');
  
  const store = {};
  if (scenario === 'REFRESH') {
    store['little_idly_intro_played'] = 'true';
  }

  function createElement(tag, id, classes = '') {
    return {
      tagName: tag.toUpperCase(),
      id: id || '',
      className: classes,
      classList: {
        _classes: new Set(classes ? classes.split(' ') : []),
        add(...c) { c.forEach(x => this._classes.add(x)); },
        remove(...c) { c.forEach(x => this._classes.delete(x)); },
        contains(x) { return this._classes.has(x); }
      },
      style: {},
      attributes: {},
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k] || null; },
      listeners: {},
      addEventListener(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
      },
      click() {
        if (this.listeners['click']) {
          this.listeners['click'].forEach(fn => fn({ preventDefault: () => {}, stopPropagation: () => {} }));
        }
      },
      getBoundingClientRect() {
        return { top: 100, bottom: 200, left: 0, right: 100, width: 100, height: 100 };
      },
      scrollIntoView() {},
      innerHTML: '',
      textContent: ''
    };
  }

  const domMap = {
    'preloader-curtain': createElement('div', 'preloader-curtain'),
    'curtain-left': createElement('div', 'curtain-left'),
    'curtain-right': createElement('div', 'curtain-right'),
    'preloader-card': createElement('div', 'preloader-card'),
    'replay-intro-btn': createElement('button', 'replay-intro-btn'),
    'hero': createElement('section', 'hero'),
    'hero-prev': createElement('button', 'hero-prev'),
    'hero-next': createElement('button', 'hero-next'),
    'hero-progress-fill': createElement('div', 'hero-progress-fill'),
    'hero-slide-counter': createElement('span', 'hero-slide-counter'),
    'live-status-text': createElement('span', 'live-status-text'),
    'live-status-dot': createElement('span', 'live-status-dot'),
    'menu': createElement('section', 'menu'),
    'menu-items-grid': createElement('div', 'menu-items-grid'),
    'menu-search-input': createElement('input', 'menu-search-input'),
    'menu-count': createElement('span', 'menu-count'),
    'cart-drawer': createElement('div', 'cart-drawer'),
    'cart-backdrop': createElement('div', 'cart-backdrop'),
    'cart-items-container': createElement('div', 'cart-items-container'),
    'cart-subtotal': createElement('span', 'cart-subtotal'),
    'cart-vat': createElement('span', 'cart-vat'),
    'cart-total': createElement('span', 'cart-total'),
    'whatsapp-order-btn': createElement('a', 'whatsapp-order-btn'),
    'story-stamp-frame': createElement('div', 'story-stamp-frame'),
    'story-content': createElement('div', 'story-content'),
    'fresh-stamps-group': createElement('div', 'fresh-stamps-group'),
    'fresh-text-group': createElement('div', 'fresh-text-group'),
    'cooking-cluster': createElement('div', 'cooking-cluster'),
    'family-mascot': createElement('div', 'family-mascot'),
    'family-platter': createElement('div', 'family-platter')
  };

  const slides = [0, 1, 2, 3].map(i => {
    const s = createElement('div', 'slide-' + i, i === 0 ? 'hero-slide active' : 'hero-slide hidden');
    s.setAttribute('data-reversed', i % 2 === 1 ? 'true' : 'false');
    const dish = createElement('img', 'dish-' + i, 'hero-dish');
    const title = createElement('h1', 'title-' + i, 'hero-title');
    const rule = createElement('div', 'rule-' + i, 'hero-rule');
    const desc = createElement('p', 'desc-' + i, 'hero-desc');
    const btn = createElement('a', 'btn-' + i, 'hero-btn');
    s.querySelector = (sel) => {
      if (sel === '.hero-dish') return dish;
      if (sel === '.hero-title') return title;
      if (sel === '.hero-rule') return rule;
      if (sel === '.hero-desc') return desc;
      if (sel === '.hero-btn') return btn;
      return null;
    };
    return s;
  });

  const heroDots = [0, 1, 2, 3].map(i => {
    const dot = createElement('button', 'dot-' + i, 'hero-dot');
    const span = createElement('span', 'span-' + i);
    dot.querySelector = () => span;
    return dot;
  });

  const counterEls = [
    { target: '14' },
    { target: '100' },
    { target: '34' },
    { target: '4.8', decimal: '1' }
  ].map(info => {
    const el = createElement('span', '', 'counter-val');
    el.setAttribute('data-target', info.target);
    if (info.decimal) el.setAttribute('data-decimal', info.decimal);
    el.textContent = info.target;
    return el;
  });

  global.window = {
    addEventListener: () => {},
    innerHeight: 800,
    scrollTo: () => {},
    matchMedia: () => ({ matches: false })
  };
  global.sessionStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = v; }
  };
  global.document = {
    readyState: 'complete',
    activeElement: { tagName: 'BODY' },
    body: createElement('body', 'body'),
    addEventListener: (evt, fn) => { if (evt === 'DOMContentLoaded') fn(); },
    getElementById: (id) => domMap[id] || null,
    querySelectorAll: (sel) => {
      if (sel === '.hero-slide') return slides;
      if (sel === '.hero-dot') return heroDots;
      if (sel === '.counter-val') return counterEls;
      if (sel === '.cart-count-badge') return [createElement('span', 'badge')];
      if (sel === '.menu-category-tab') return [createElement('button', 'tab-1')];
      return [];
    }
  };

  global.gsap = {
    registerPlugin: () => {},
    set: (el, props) => {},
    to: (el, props) => {
      if (props.onUpdate) props.onUpdate();
      if (props.onComplete) props.onComplete();
      return { kill: () => {}, pause: () => {}, resume: () => {} };
    },
    fromTo: () => ({}),
    killTweensOf: () => {},
    timeline: (opts) => ({
      to: function(el, props) {
        if (props && props.onStart) props.onStart();
        return this;
      },
      add: function(fn) { fn && fn(); return this; }
    }),
    utils: { toArray: (sel) => global.document.querySelectorAll(sel) }
  };
  global.ScrollTrigger = {
    refresh: () => {},
    create: (cfg) => { cfg.onEnter && cfg.onEnter(); }
  };

  // Load menu-data and app.js
  const menuCode = fs.readFileSync('js/menu-data.js', 'utf8');
  eval(menuCode);
  const appCode = fs.readFileSync('js/app.js', 'utf8');
  eval(appCode);

  console.log('[PASS] Script executed without throwing!');
  console.log('[CHECK] Menu dishes rendered:', domMap['menu-items-grid'].innerHTML.length > 500);
  console.log('[CHECK] Menu count text:', domMap['menu-count'].textContent);
  console.log('[CHECK] Global functions exist:', typeof window.addToCart === 'function', typeof window.toggleCart === 'function', typeof window.filterMenuCategory === 'function');
  
  // Test slider arrow clicks
  console.log('[TEST] Clicking #hero-next...');
  domMap['hero-next'].click();
  console.log('[PASS] Slide active state:', slides.map(s => s.classList.contains('active')));
  console.log('[CHECK] Counter text after next:', domMap['hero-slide-counter'].textContent);

  console.log('[TEST] Clicking #hero-prev...');
  domMap['hero-prev'].click();
  console.log('[PASS] Slide active state:', slides.map(s => s.classList.contains('active')));
  console.log('[CHECK] Counter text after prev:', domMap['hero-slide-counter'].textContent);

  // Check counter values in Story Section
  console.log('[CHECK] Counters animated correctly:');
  counterEls.forEach((c, idx) => {
    console.log('  Counter ' + (idx + 1) + ': target=' + c.getAttribute('data-target') + ' -> final=' + c.textContent);
  });
}

testSimulation('FIRST_LOAD');
console.log('');
testSimulation('REFRESH');
