
'use strict';

// WANUHCoded — Portfolio Interactions

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

// THEME SWITCHER

const themeButton = $('#themeToggle');

function applyTheme(theme) {
  document.body.dataset.theme = theme;

  themeButton.textContent =
    theme === 'dark' ? '☀' : '☾';

  themeButton.setAttribute(
    'aria-label',
    `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
  );

  const metaTheme = $('meta[name="theme-color"]');

  if (metaTheme) {
    metaTheme.content =
      theme === 'dark' ? '#090a10' : '#faf9ff';
  }

  try {
    localStorage.setItem('wanuhcoded-theme', theme);
  } catch (error) {}
}

let initialTheme = 'dark';

try {
  initialTheme =
    localStorage.getItem('wanuhcoded-theme') || 'dark';
} catch (error) {}

applyTheme(initialTheme === 'light' ? 'light' : 'dark');

themeButton.addEventListener('click', () => {
  applyTheme(
    document.body.dataset.theme === 'dark'
      ? 'light'
      : 'dark'
  );
});

// MOBILE NAVIGATION

const menuButton = $('#menuToggle');
const navMenu = $('#navMenu');

function closeMenu() {
  navMenu.classList.remove('open');
  menuButton.textContent = '☰';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
}

menuButton.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');

  menuButton.textContent = open ? '✕' : '☰';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute(
    'aria-label',
    open ? 'Close menu' : 'Open menu'
  );
});

$$('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', event => {
  if (!event.target.closest('.nav')) {
    closeMenu();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

// SCROLL PROGRESS BAR

const progressBar = $('#progressBar');
let scrollScheduled = false;

function updateScroll() {
  const scrollable =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const percentage = scrollable > 0
    ? (window.scrollY / scrollable) * 100
    : 0;

  if (progressBar) {
    progressBar.style.width =
      `${Math.min(100, Math.max(0, percentage))}%`;
  }

  scrollScheduled = false;
}

window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateScroll);
  }
}, { passive: true });

updateScroll();

// CURSOR GLOW

const glow = $('#cursorGlow');

if (
  glow &&
  window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches
) {
  document.addEventListener('pointermove', event => {
    glow.style.left = event.clientX + 'px';
    glow.style.top = event.clientY + 'px';
  }, { passive: true });
}

// REVEAL ANIMATIONS

const revealElements = $$('.reveal');

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(element =>
    revealObserver.observe(element)
  );
} else {
  revealElements.forEach(element =>
    element.classList.add('visible')
  );
}

// ACTIVE NAVIGATION

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      $$('.nav-link').forEach(link => {
        link.classList.toggle(
          'active',
          link.hash === '#' + entry.target.id
        );
      });
    });
  }, {
    rootMargin: '-25% 0px -60% 0px'
  });

  $$('main section[id]').forEach(section =>
    sectionObserver.observe(section)
  );
}

// PROJECT FILTERS

const filters = $$('.filter');
const projects = $$('.project-card');
const projectCount = $('#projectCount');

if (projectCount) {
  projectCount.textContent =
    String(projects.length).padStart(2, '0');
}

filters.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;

    filters.forEach(filter => {
      const active = filter === button;

      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });

    projects.forEach(project => {
      const categories =
        (project.dataset.category || '').split(' ');

      project.hidden =
        selected !== 'all' &&
        !categories.includes(selected);
    });
  });
});

// PROJECT DETAILS

const projectData = {
  cpp: {
    category: '01 / C++ DEVELOPMENT',
    title: 'Business Management System',
    description:
      'A planned console-based management system built with object-oriented C++. It will organize product inventory, sales transactions, and customer records.',
    features: [
      'Add, view, update, and delete products',
      'Track inventory quantities',
      'Record customer transactions',
      'Calculate sales and generate receipts',
      'Save and load data using files'
    ],
    status: 'IN DEVELOPMENT'
  },

  game: {
    category: '02 / INTERACTIVE WEB',
    title: 'Interactive Mini Game',
    description:
      'A browser-based game concept designed to make learning JavaScript more fun through interactive challenges and playful visuals.',
    features: [
      'Keyboard and touch controls',
      'Scoring and level progression',
      'Sound effects and animations',
      'Restart and pause controls',
      'Saved high scores'
    ],
    status: 'PLANNED'
  },

  store: {
    category: '03 / E-COMMERCE',
    title: 'Online Thrift Store',
    description:
      'A modern online thrift store concept with curated products, shopping features, and an easy-to-use checkout experience.',
    features: [
      'Product listings and categories',
      'Search and filter products',
      'Shopping cart',
      'Customer checkout information',
      'Order tracking and management'
    ],
    status: 'PLANNED'
  },

  talkthrift: {
    category: '04 / E-COMMERCE',
    title: 'Talk Thrift',
    description:
      'An online thrift shopping platform focused on affordable fashion, smooth browsing, and convenient ordering.',
    features: [
      'User registration and login',
      'Product browsing and categories',
      'Shopping cart and checkout',
      'Delivery and shipping options',
      'Payment method selection',
      'Order management'
    ],
    status: 'IN DEVELOPMENT'
  }
};

const projectDialog = $('#projectDialog');

$$('.project-action').forEach(button => {
  button.addEventListener('click', () => {
    const project = projectData[button.dataset.project];

    if (!project) return;

    $('#dialogCategory').textContent = project.category;
    $('#dialogTitle').textContent = project.title;
    $('#dialogDescription').textContent =
      project.description;
    $('#dialogStatus').textContent = project.status;

    const list = $('#dialogFeatures');
    list.replaceChildren();

    project.features.forEach(feature => {
      const item = document.createElement('li');
      item.textContent = feature;
      list.appendChild(item);
    });

    if (!projectDialog.open) {
      projectDialog.showModal();
    }
  });
});

$('#closeDialog').addEventListener('click', () => {
  projectDialog.close();
});

projectDialog.addEventListener('click', event => {
  if (event.target === projectDialog) {
    projectDialog.close();
  }
});

// QUICK NAVIGATION

const commandDialog = $('#commandDialog');
const commandInput = $('#commandSearch');
const commandButtons = $$('#commandResults button');

function filterCommands(query) {
  const term = query.trim().toLowerCase();

  commandButtons.forEach(button => {
    button.hidden =
      !button.textContent.toLowerCase().includes(term);
  });
}

function openCommand() {
  if (commandDialog.open) return;

  commandDialog.showModal();
  commandInput.value = '';
  filterCommands('');
  commandInput.focus();
}

$('#commandTrigger').addEventListener('click', openCommand);

$('#closeCommand').addEventListener('click', () => {
  commandDialog.close();
});

commandInput.addEventListener('input', () => {
  filterCommands(commandInput.value);
});

commandButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(
      button.dataset.target
    );

    commandDialog.close();

    if (target) {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    }
  });
});

commandInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const firstVisible = commandButtons.find(
      button => !button.hidden
    );

    if (firstVisible) {
      firstVisible.click();
    }
  }
});

document.addEventListener('keydown', event => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === 'k'
  ) {
    event.preventDefault();
    openCommand();
  }

  if (event.key === 'Escape') {
    closeMenu();
  }
});

commandDialog.addEventListener('click', event => {
  if (event.target === commandDialog) {
    commandDialog.close();
  }
});

// FUNCTIONAL CONTACT FORM — NETLIFY

const contactForm = $('#contactForm');
const contactStatus = $('#formStatus');

if (contactForm && contactStatus) {
  const submitButton = contactForm.querySelector(
    'button[type="submit"]'
  );

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (!name || !email || !message) {
      contactStatus.textContent =
        'Please complete all fields.';
      return;
    }

    const formData = new FormData(contactForm);

    formData.set('form-name', 'portfolio-contact');
    formData.set('name', name);
    formData.set('email', email);
    formData.set('message', message);

    const originalButtonHTML =
      submitButton ? submitButton.innerHTML : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    contactStatus.textContent = 'Sending your message...';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error('Submission failed.');
      }

      contactStatus.textContent =
        'Message submitted! Thank you for reaching out.';

      contactForm.reset();
    } catch (error) {
      console.error('Contact form error:', error);

      contactStatus.textContent =
        'Unable to send your message. Please try again later.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
      }
    }
  });
}

// COPYRIGHT YEAR

const year = $('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}
