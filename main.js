(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, [data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');
        if (el.hasAttribute('data-count')) countUp(el);
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in');
      if (el.hasAttribute('data-count')) el.textContent = el.getAttribute('data-count');
    });
  }

  /* ---------- Counters ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var duration = 1500;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = decimals
        ? val.toFixed(decimals)
        : Math.round(val).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-US');
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Module tabs ---------- */
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      var panel = document.getElementById('panel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- Pricing toggle ---------- */
  var billingBtns = document.querySelectorAll('.toggle button');
  billingBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      billingBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var mode = btn.dataset.billing;

      document.querySelectorAll('.price .amt[data-monthly]').forEach(function (amt) {
        amt.textContent = amt.getAttribute('data-' + mode);
      });
      document.querySelectorAll('[data-billed]').forEach(function (el) {
        el.textContent = mode === 'annual'
          ? 'Billed annually · 25% saved'
          : 'Billed monthly · cancel anytime';
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Recalculate open FAQ height on resize */
  window.addEventListener('resize', function () {
    var open = document.querySelector('.faq-item.open .faq-a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });


  /* ---------- Client photo lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var galBtns = Array.prototype.slice.call(document.querySelectorAll('.gal-btn'));
  if (lightbox && galBtns.length && typeof lightbox.showModal === 'function') {
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var current = 0;
    var show = function (i) {
      current = (i + galBtns.length) % galBtns.length;
      var b = galBtns[current];
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = b.querySelector('img').alt;
      lbCap.textContent = b.getAttribute('data-caption');
    };
    galBtns.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); lightbox.showModal(); });
    });
    lightbox.querySelector('.lb-close').addEventListener('click', function () { lightbox.close(); });
    lightbox.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    lightbox.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();