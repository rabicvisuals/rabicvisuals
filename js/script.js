/* RabicVisuals — script.js
   Vanilla JS only: header state, mobile menu, scroll reveals,
   gallery filtering, and an accessible lightbox. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Header: solid background after scroll
     --------------------------------------------------------------------- */
  var header = document.querySelector(".site-header");

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");

  function closeMenu() {
    if (!header) return;
    header.classList.remove("menu-open");
    document.body.classList.remove("no-scroll");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!header) return;
    var isOpen = header.classList.toggle("menu-open");
    document.body.classList.toggle("no-scroll", isOpen);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  if (mainNav) {
    mainNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeMenu();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------------------------------------------------------------------
     Scroll reveal (IntersectionObserver)
     --------------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-img");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Gallery filtering
     --------------------------------------------------------------------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var galleryItems = document.querySelectorAll(".masonry-item");
  var emptyState = document.querySelector(".gallery-empty");

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");

        var category = btn.getAttribute("data-filter");
        var visibleCount = 0;

        galleryItems.forEach(function (item) {
          var matches = category === "all" || item.getAttribute("data-category") === category;
          item.classList.toggle("is-hidden", !matches);
          if (matches) visibleCount++;
        });

        if (emptyState) emptyState.classList.toggle("is-visible", visibleCount === 0);
      });
    });
  }

  /* ---------------------------------------------------------------------
     Lightbox
     --------------------------------------------------------------------- */
  var lightbox = document.querySelector(".lightbox");

  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector(".lightbox-caption");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-prev");
    var lbNext = lightbox.querySelector(".lightbox-next");

    var items = Array.prototype.slice.call(document.querySelectorAll(".masonry-item"));
    var currentIndex = 0;
    var lastFocused = null;

    function visibleItems() {
      return items.filter(function (item) { return !item.classList.contains("is-hidden"); });
    }

    function openLightbox(index) {
      var list = visibleItems();
      if (!list.length) return;
      currentIndex = index;
      showImage(list);
      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
      lbClose.focus();
    }

    function showImage(list) {
      var item = list[currentIndex];
      if (!item) return;
      var fullSrc = item.getAttribute("data-full") || item.querySelector("img").src;
      var caption = item.getAttribute("data-caption") || "";
      lbImg.classList.remove("is-shown");
      var tempImg = new Image();
      tempImg.onload = function () {
        lbImg.src = fullSrc;
        lbImg.alt = caption;
        requestAnimationFrame(function () { lbImg.classList.add("is-shown"); });
      };
      tempImg.src = fullSrc;
      lbCaption.textContent = caption;
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      lbImg.classList.remove("is-shown");
      if (lastFocused) lastFocused.focus();
    }

    function step(delta) {
      var list = visibleItems();
      if (!list.length) return;
      currentIndex = (currentIndex + delta + list.length) % list.length;
      showImage(list);
    }

    items.forEach(function (item, idx) {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      var label = item.getAttribute("data-caption") || "fotografija";
      item.setAttribute("aria-label", "Odpri sliko: " + label);

      function activate() {
        var list = visibleItems();
        var visIdx = list.indexOf(item);
        if (visIdx === -1) return;
        openLightbox(visIdx);
      }

      item.addEventListener("click", activate);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      });
    });

    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lbPrev) lbPrev.addEventListener("click", function () { step(-1); });
    if (lbNext) lbNext.addEventListener("click", function () { step(1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    /* Basic touch swipe support */
    var touchStartX = null;
    lightbox.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) step(dx > 0 ? -1 : 1);
      touchStartX = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     Contact form (front-end only — connect to Formspree / Web3Forms later)
     --------------------------------------------------------------------- */
  var contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = contactForm.querySelector(".form-status");
      if (status) {
        status.textContent = "Obrazec še ni povezan s storitvijo za pošiljanje. Poveži ga s storitvijo kot je Formspree ali Web3Forms, da bodo povpraševanja prihajala na tvoj e-poštni naslov.";
        status.classList.add("is-visible");
      }
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
