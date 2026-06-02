(function () {
  "use strict";

  /* ===== Scroll reveal ===== */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ===== Active section highlight in nav ===== */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-link")
  );
  var sections = navLinks
    .map(function (link) {
      return document.getElementById(link.dataset.section);
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.dataset.section === id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ===== Smooth scroll (closes mobile menu) ===== */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  /* ===== Mobile menu toggle ===== */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function closeMenu() {
    nav.classList.remove("is-open");
    if (burger) burger.setAttribute("aria-expanded", "false");
  }

  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ===== Custom cursor: follows pointer, swaps still <-> move ===== */
  var fine =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine) {
    var cursorEl = document.createElement("div");
    cursorEl.className = "cursor";
    cursorEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursorEl);

    var HOTSPOT_X = 29;
    var HOTSPOT_Y = 6;
    var moveTimer;
    var active = false;

    window.addEventListener(
      "mousemove",
      function (e) {
        if (!active) {
          active = true;
          document.documentElement.classList.add("has-custom-cursor");
        }
        cursorEl.style.transform =
          "translate(" +
          (e.clientX - HOTSPOT_X) +
          "px," +
          (e.clientY - HOTSPOT_Y) +
          "px)";
        cursorEl.classList.add("is-visible", "is-moving");
        clearTimeout(moveTimer);
        moveTimer = setTimeout(function () {
          cursorEl.classList.remove("is-moving");
        }, 120);
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      cursorEl.classList.remove("is-visible");
    });
    document.addEventListener("mouseenter", function () {
      cursorEl.classList.add("is-visible");
    });
  }

  /* ===== Hide nav background until scrolled past hero a touch ===== */
  var lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    function () {
      var y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 40);
      lastY = y;
    },
    { passive: true }
  );
})();
