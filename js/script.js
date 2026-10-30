/* Visit Salone — shared script. Loaded on all five pages; every
   feature first checks that its elements exist on the current page. */
(function () {
  'use strict';

  var DESTINATIONS = {
    'freetown': {
      title: 'Freetown', tag: 'City & Culture',
      text: 'Sierra Leone\'s capital combines coastline, markets, music and history. It is the usual starting point for visitors.',
      points: ['Walk through the city centre and local markets', 'Relax on the beaches of the Freetown peninsula', 'Visit museums and historic landmarks']
    },
    'turtle-islands': {
      title: 'Turtle Islands', tag: 'Wildlife',
      text: 'A group of small islands off the coast known for marine life and sea turtles, supported by community conservation efforts.',
      points: ['Boat trips between islands', 'Birdwatching and turtle conservation awareness', 'Quiet beaches and fishing communities']
    },
    'bonthe': {
      title: 'Bonthe', tag: 'History',
      text: 'A historic town on Sherbro Island with colonial-era buildings, a slow pace and a strong sense of local heritage.',
      points: ['Explore the old town on foot', 'Learn about the area\'s trading history', 'Enjoy waterfront views']
    },
    'kamberi-hills': {
      title: 'Kamberi Hills', tag: 'Riverside Scenery',
      text: 'Rolling hills and riverside views make this area a good choice for relaxed scenery and photography.',
      points: ['Scenic viewpoints', 'Riverside walks', 'Photography in the early morning or late afternoon']
    },
    'tacugama': {
      title: 'Tacugama', tag: 'Chimpanzee Viewing & Feeding',
      text: 'Tacugama Chimpanzee Sanctuary, near Freetown, cares for rescued chimpanzees and lets visitors see them in forest surroundings.',
      points: ['Chimpanzee viewing', 'Guided visits that explain the sanctuary\'s conservation work', 'Forest setting close to the capital']
    },
    'sumbuya': {
      title: 'Sumbuya', tag: 'Nature and Landscape Exploration',
      text: 'A destination for exploring natural landscapes, with opportunities to meet local communities and enjoy the outdoors.',
      points: ['Landscape and nature walks', 'Community experiences', 'Local food and hospitality']
    }
  };

  var SERVICES = {
    'tour-packages': {
      title: 'Tour Packages', tag: 'Guided destination tours',
      text: 'Packaged itineraries that combine several destinations into one organised trip.',
      points: ['Choose a city, wildlife or heritage focus', 'Group and private options', 'Itineraries can be adjusted to your dates']
    },
    'travel-tips': {
      title: 'Travel Tips', tag: 'Practical advice',
      text: 'Useful guidance for planning your trip to Sierra Leone.',
      points: ['Check visa, health and entry requirements with official sources before travelling', 'Plan around the dry and rainy seasons', 'Carry some cash and respect local customs']
    },
    'transportation': {
      title: 'Transportation', tag: 'Safe and reliable travel',
      text: 'Help arranging how to get between the airport, cities and destinations.',
      points: ['Airport transfers', 'Road transport between towns', 'Boat transfers where destinations are reached by water']
    },
    'accommodation': {
      title: 'Accommodation', tag: 'Stays for every budget',
      text: 'Guidance on finding places to stay that match your budget and travel style.',
      points: ['Budget guesthouses', 'Mid-range hotels', 'Beachside and eco-style stays']
    },
    'guided-tours': {
      title: 'Guided Tours', tag: 'Local guides',
      text: 'Local guides who know the history, wildlife and culture of each place and can plan the day with you.',
      points: ['Half-day and full-day tours', 'Cultural and historical commentary', 'Small-group experiences']
    },
    'support': {
      title: 'Support & Assistance', tag: 'Before and during your trip',
      text: 'Help with questions before you travel and while you are in the country.',
      points: ['Pre-trip planning questions', 'Assistance with bookings and changes', 'A contact point during your stay']
    }
  };

  function qs(s, c) { return (c || document).querySelector(s); }
  function qsa(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(message) {
    var t = qs('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3500);
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = qs('.nav-toggle');
    var nav = qs('#site-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Image fallback (missing / failed URLs) ---------- */
  function initImages() {
    qsa('.image-container img').forEach(function (img) {
      var box = img.closest('.image-container');
      function missing() { box.classList.add('img-missing'); }
      function ok() { box.classList.remove('img-missing'); }
      var src = img.getAttribute('src') || '';
      if (!src || src.indexOf('PASTE_') !== -1) { missing(); return; }
      img.addEventListener('error', missing);
      img.addEventListener('load', function () { if (img.naturalWidth > 0) ok(); });
      if (img.complete && img.naturalWidth === 0) missing();
    });
  }

  /* ---------- Modal ---------- */
  var modal = null, lastFocus = null;

  function openModal(data, opener, ctaLabel) {
    if (!modal || !data) return;
    lastFocus = opener || document.activeElement;
    qs('#modal-title', modal).textContent = data.title;
    qs('#modal-tag', modal).textContent = data.tag;
    qs('#modal-text', modal).textContent = data.text;
    var list = qs('#modal-points', modal);
    list.textContent = '';
    data.points.forEach(function (p) {
      var li = document.createElement('li');
      li.textContent = p;
      list.appendChild(li);
    });
    qs('#modal-cta', modal).textContent = ctaLabel;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    qs('.modal-close', modal).focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    if (location.hash) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { /* ignore */ }
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initModal() {
    modal = qs('#info-modal');
    if (!modal) return;
    qsa('[data-modal-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        var f = qsa('button, a[href]', modal);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  function initDestinations() {
    if (!modal) return;
    var cards = qsa('[data-dest]');
    if (!cards.length) return;
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(DESTINATIONS[card.getAttribute('data-dest')], card, 'Plan a visit');
      });
    });
    function fromHash() {
      var id = location.hash.replace('#', '');
      var card = id && qs('[data-dest="' + id + '"]');
      if (card && DESTINATIONS[id]) {
        card.scrollIntoView();
        openModal(DESTINATIONS[id], card, 'Plan a visit');
      }
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }

  function initServices() {
    if (!modal) return;
    qsa('[data-service]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(SERVICES[btn.getAttribute('data-service')], btn, 'Ask about this service');
      });
    });
  }

  /* ---------- Contact form (front-end demo only) ---------- */
  function initForm() {
    var form = qs('#contact-form');
    if (!form) return;
    var fields = {
      name: qs('#name', form),
      email: qs('#email', form),
      message: qs('#message', form)
    };
    var status = qs('#form-status');

    function setError(key, msg) {
      var input = fields[key], err = qs('#' + key + '-error');
      if (msg) {
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        err.textContent = msg;
      } else {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        err.textContent = '';
      }
      return !msg;
    }
    function validate(key) {
      var v = fields[key].value.trim();
      if (key === 'name') return setError(key, v ? '' : 'Please enter your name.');
      if (key === 'message') return setError(key, v ? '' : 'Please enter a message.');
      if (!v) return setError(key, 'Please enter your email address.');
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      return setError(key, re.test(v) ? '' : 'Please enter a valid email address, e.g. name@example.com.');
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].addEventListener('blur', function () { validate(key); });
      fields[key].addEventListener('input', function () {
        if (fields[key].classList.contains('invalid')) validate(key);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.hidden = true;
      var valid = true, firstBad = null;
      Object.keys(fields).forEach(function (key) {
        if (!validate(key)) { valid = false; if (!firstBad) firstBad = fields[key]; }
      });
      if (!valid) { firstBad.focus(); return; }
      var name = fields.name.value.trim();
      status.textContent = 'Thank you, ' + name + '. Your message passed validation. ' +
        'This is a front-end demonstration, so nothing was actually sent.';
      status.hidden = false;
      form.reset();
    });
  }

  /* ---------- Social placeholder links ---------- */
  function initPlaceholderLinks() {
    qsa('a[href*="PASTE_"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast('This link has not been set yet. Replace the PASTE_ URL in contact.html.');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initImages();
    initModal();
    initDestinations();
    initServices();
    initForm();
    initPlaceholderLinks();
  });
})();

<link rel="stylesheet" href="css/style.css"></link>