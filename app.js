/* ============================================================
   Cape Town Painting Experts — app.js
   ============================================================ */

/* ============================================================
   Google Ads Conversion Tracking – AW-18123515810
   Tracks: phone calls, WhatsApp clicks, form submissions
   ============================================================ */

function gtagConversion() {
  if (typeof gtag === 'function') {
    gtag('event', 'conversion', {
      'send_to': 'AW-18123515810'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Track all phone call clicks ── */
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      gtagConversion();
      gtag('event', 'click', { 'event_category': 'Phone Call', 'event_label': link.href });
    });
  });

  /* ── Track all WhatsApp clicks ── */
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(function(link) {
    link.addEventListener('click', function() {
      gtagConversion();
      gtag('event', 'click', { 'event_category': 'WhatsApp', 'event_label': 'WhatsApp Click' });
    });
  });


  /* ── 1. Sticky nav shadow ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ── 2. Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-cte').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active-link');
    }
  });

  /* ── 3. Fade-up on scroll (IntersectionObserver) ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => io.observe(el));
  }

  /* ── 4. Counter animation ── */
  const counters = document.querySelectorAll('.count-up');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + (el.dataset.suffix || '');
          if (current >= target) clearInterval(timer);
        }, 16);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }


  
  /* ── 7. Gallery filter (projects page) ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-filter-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });
  }

  /* ── 8. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

(function () {

  /* ── Toast helpers ── */
  function showToast() {
    var t = document.getElementById('formToast');
    t.style.opacity = '1';
    t.style.transform = 'translateX(-50%) translateY(0)';
    t.style.pointerEvents = 'auto';
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(hideToast, 5000);
  }

  window.hideToast = function () {
    var t = document.getElementById('formToast');
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(120%)';
    t.style.pointerEvents = 'none';
  };

  /* ── Form submit handler ── */
  var form = document.getElementById('universalContactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // stop default navigation

    /* — Client-side validation — */
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        valid = false;
      } else {
        field.classList.remove('is-invalid');
      }
    });
    if (!valid) return;

    /* — Button loading state — */
    var btn     = document.getElementById('universalSubmitBtn');
    var btnText = document.getElementById('universalBtnText');
    btn.disabled       = true;
    btn.style.opacity  = '.7';
    btnText.textContent = 'Sending…';

    /* — Submit to Formspree via fetch (no redirect) — */
    var data = new FormData(form);

    fetch(form.action, {
      method:  'POST',
      body:    data,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        /* ✅ Success */
        gtagConversion();
        gtag('event', 'submit', { 'event_category': 'Form', 'event_label': 'Contact Form Submitted' });
        showToast();
        form.reset();
        form.querySelectorAll('.is-invalid').forEach(function (f) {
          f.classList.remove('is-invalid');
        });
      } else {
        /* ⚠️ Formspree returned an error */
        return res.json().then(function (data) {
          var msg = (data && data.errors)
            ? data.errors.map(function (e) { return e.message; }).join(', ')
            : 'Something went wrong. Please try again.';
          alert(msg);
        });
      }
    })
    .catch(function () {
      alert('Network error. Please check your connection and try again.');
    })
    .finally(function () {
      btn.disabled       = false;
      btn.style.opacity  = '1';
      btnText.textContent = 'Send Message';
    });
  });

  /* — Remove invalid state on input — */
  form.querySelectorAll('input, textarea, select').forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.value.trim()) field.classList.remove('is-invalid');
    });
  });

})();