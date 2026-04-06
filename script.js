/* ===========================
   CDG SHUTTLE - MAIN SCRIPTS
   =========================== */

// ── NAVBAR ──
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
}

// Close menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    navMenu && navMenu.classList.remove('open');
  });
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => observer.observe(el));

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-question.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
    });

    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// ── BOOKING MODAL ──
const modalOverlay = document.getElementById('bookingModal');
const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-overlay-close');

function openModal() {
  if (modalOverlay) {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-book]').forEach(btn => {
  btn.addEventListener('click', openModal);
});

modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── CHECK PRICE ──
const checkPriceBtn = document.getElementById('checkPriceBtn');
const priceResult = document.getElementById('priceResult');

const rates = {
  'sedan': { base: 65, perKm: 1.8 },
  'Toyota RAV-4 Hybrid or similar': { base: 65, perKm: 1.8 },
  'minivan': { base: 85, perKm: 2.2 },
  'Renault Trafic 3 Long or similar': { base: 85, perKm: 2.2 },
  'minibus': { base: 120, perKm: 2.8 },
  'van': { base: 95, perKm: 2.4 },
  'Renault Trafic 3 Small or similar': { base: 95, perKm: 2.4 }
};

const distances = {
  'cdg-paris': 38, 'cdg-disney': 50, 'cdg-orly': 62, 'cdg-versailles': 65,
  'orly-paris': 24, 'orly-disney': 42, 'paris-disney': 35,
  'cdg-london': 390, 'orly-london': 380,
};

if (checkPriceBtn) {
  checkPriceBtn.addEventListener('click', () => {
    const vehicle = document.getElementById('bookVehicle')?.value || 'sedan';
    const pickup = document.getElementById('bookPickup')?.value;
    const dropoff = document.getElementById('bookDropoff')?.value;

    if (!pickup || !dropoff) {
      priceResult.innerHTML = '<strong style="color:#c0392b">Please select pickup and drop-off locations</strong>';
      priceResult.classList.add('show');
      return;
    }

    const key = `${pickup}-${dropoff}`;
    const reverseKey = `${dropoff}-${pickup}`;
    const dist = distances[key] || distances[reverseKey] || 40;
    const rate = rates[vehicle] || rates['sedan'];
    const price = Math.round(rate.base + dist * rate.perKm * 0.3);

    priceResult.innerHTML = `
      <strong>Estimated Price: €${price}</strong>
      <span>Fixed price — no surge charges. Includes all taxes & tolls. Distance: ~${dist} km.</span>
      <br><br>
      <button class="check-price-btn" onclick="confirmBooking(${price})">Confirm & Book — €${price}</button>
    `;
    priceResult.classList.add('show');
  });
}

function confirmBooking(price) {
  const name = document.getElementById('bookName')?.value;
  const email = document.getElementById('bookEmail')?.value;
  const phone = document.getElementById('bookPhone')?.value;
  if (!name || !email || !phone) {
    alert('Please fill in your contact details to complete the booking.');
    return;
  }
  alert(`Thank you, ${name}! Your booking for €${price} has been received. We will confirm via ${email} shortly.\n\nFor immediate assistance: +33 (0)1 43 32 70 81`);
  closeModal();
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.background = '#27ae60';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}
