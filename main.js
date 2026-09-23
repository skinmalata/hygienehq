/* ============================================================
   HygieneHQ — interactions
   ============================================================ */
(function () {
  "use strict";

  var header = document.getElementById("header");
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  var backTop = document.getElementById("backTop");
  var yearEl = document.getElementById("year");

  var BUSINESS_WA = "2349035776722"; // +234 903 577 6722

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() {
    if (window.scrollY > 30) {
      header.classList.add("scrolled");
      backTop.classList.add("show");
    } else {
      header.classList.remove("scrolled");
      backTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  function closeNav() {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", function (e) {
    if (nav.classList.contains("open") && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  function setActiveLink() {
    var pos = window.scrollY + 120;
    var currentId = "home";
    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop) currentId = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1400;
    var start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      ["name", "phone"].forEach(function (id) {
        var input = document.getElementById(id);
        var bad = !input.value.trim();
        input.classList.toggle("error", bad);
        if (bad) valid = false;
      });

      if (!valid) {
        note.textContent = "Please fill in your name and phone number.";
        note.className = "form-note err";
        return;
      }

      var name = document.getElementById("name").value.trim();
      var phone = document.getElementById("phone").value.trim();

      var msg =
        "Hello HygieneHQ!%0A" +
        "%0A" +
        "New service request:%0A" +
        encodeURIComponent("• Name: ") +
        encodeURIComponent(name) +
        "%0A" +
        encodeURIComponent("• Phone: ") +
        encodeURIComponent(phone);

      var service = document.getElementById("service");
      var area = document.getElementById("area");
      var message = document.getElementById("message");
      if (service && service.value && service.value !== "Other") {
        msg += "%0A" + encodeURIComponent("• Service: " + service.value);
      }
      if (area && area.value.trim()) {
        msg += "%0A" + encodeURIComponent("• Location: " + area.value.trim());
      }
      if (message && message.value.trim()) {
        msg += "%0A" + encodeURIComponent("• Note: " + message.value.trim());
      }

      window.open("https://wa.me/" + BUSINESS_WA + "?text=" + msg, "_blank", "noopener");
      note.textContent = "Opening WhatsApp in a new tab to send your request. Thank you!";
      note.className = "form-note ok";
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();