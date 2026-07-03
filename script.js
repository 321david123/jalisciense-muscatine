/* =====================================================
   Taquizas Jalisciense — interactions & motion
   Lenis smooth scroll · GSAP ScrollTrigger · Swiper 11
   Degrades gracefully + respects prefers-reduced-motion
   ===================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = "2026";

  /* ============================================================
     MENU DATA — real items from research (al pastor, cabeza,
     asada, gorditas, tortas, quesadillas, burritos, nachos,
     handmade tortillas, made-to-order guac/queso/horchata,
     vegan options, $1 Taco Tuesday). Prices omitted where not
     verified; the one verified price ($1 taco) is shown.
     ============================================================ */
  var MENU = [
    { section: "Tacos", items: [
      { name: "Taco al Pastor", desc: "Marinated pork off the trompo with a little pineapple, onion & cilantro, on a handmade tortilla.", price: "" },
      { name: "Taco de Cabeza", desc: "Tender slow-cooked cabeza finished with our creamy avocado salsa.", price: "" },
      { name: "Taco de Asada", desc: "Grilled steak, chopped fine, with onion, cilantro & lime.", price: "" },
      { name: "Taco de Chorizo", desc: "Mexican chorizo griddled crisp, with onion & cilantro.", price: "" },
      { name: "Taco de Carnitas", desc: "Slow-cooked pork carnitas, tender and rich.", price: "" },
      { name: "Taco Vegano", desc: "Meat-free filling on the same handmade tortilla — just ask.", price: "" },
      { name: "$1 Taco Tuesday", desc: "Every Tuesday, all day — the neighborhood favorite.", price: "$1" }
    ]},
    { section: "Gorditas & Tortas", items: [
      { name: "Gordita", desc: "Thick handmade masa split and stuffed to order with your choice of filling.", price: "" },
      { name: "Torta al Pastor", desc: "Toasted bread layered high with al pastor and all the fixings.", price: "" },
      { name: "Torta de Chorizo", desc: "Griddled chorizo torta with beans, avocado & crema.", price: "" },
      { name: "Torta de Asada", desc: "Grilled steak torta, stacked and pressed warm.", price: "" }
    ]},
    { section: "Quesadillas & Burritos", items: [
      { name: "Quesadilla Asada", desc: "Grilled steak and cheese folded in a handmade tortilla.", price: "" },
      { name: "Quesadilla Pastor", desc: "Al pastor and melted cheese, griddled crisp.", price: "" },
      { name: "Quesadilla Barbacoa", desc: "Tender barbacoa with cheese and salsa.", price: "" },
      { name: "Burrito al Pastor", desc: "Al pastor, rice, beans and salsa rolled up big.", price: "" },
      { name: "Burrito de Asada", desc: "Grilled steak burrito with all the fillings.", price: "" }
    ]},
    { section: "Plates & More", items: [
      { name: "Tostada", desc: "Crispy tostada piled with your choice of pastor, asada or beans.", price: "" },
      { name: "Steak Nachos", desc: "Tortilla chips loaded with grilled steak, queso and fresh salsas.", price: "" },
      { name: "Rice & Beans", desc: "Mexican rice and refried beans, the classic sides.", price: "" },
      { name: "Guacamole (made to order)", desc: "Fresh-mashed avocado, made when you order it.", price: "" }
    ]},
    { section: "Drinks", items: [
      { name: "Horchata", desc: "House-made cinnamon rice drink, cold and creamy.", price: "" },
      { name: "Aguas Frescas", desc: "Fresh fruit waters that change with the day.", price: "" },
      { name: "Jarritos & Mexican Sodas", desc: "The bottled classics from back home.", price: "" }
    ]}
  ];

  /* ---------- Build menu tabs + panels ---------- */
  var tabsEl = document.getElementById("menuTabs");
  var panelsEl = document.getElementById("menuPanels");
  if (tabsEl && panelsEl) {
    MENU.forEach(function (group, i) {
      var id = "mp-" + i;

      var tab = document.createElement("button");
      tab.className = "menu__tab" + (i === 0 ? " is-active" : "");
      tab.textContent = group.section;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
      tab.setAttribute("aria-controls", id);
      tab.tabIndex = i === 0 ? 0 : -1;
      tabsEl.appendChild(tab);

      var panel = document.createElement("div");
      panel.className = "menu__panel" + (i === 0 ? " is-active" : "");
      panel.id = id;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("tabindex", "0");
      if (i !== 0) panel.hidden = true;

      var list = document.createElement("div");
      list.className = "menu__items";
      group.items.forEach(function (it) {
        var item = document.createElement("div");
        item.className = "menu__item";
        var desc = it.desc ? '<p class="menu__item-desc">' + it.desc + "</p>" : "";
        var price = it.price ? '<span class="menu__item-price">' + it.price + "</span>" : '<span class="menu__item-price">&nbsp;</span>';
        item.innerHTML =
          '<div class="menu__item-head">' +
            '<span class="menu__item-name">' + it.name + "</span>" +
            '<span class="menu__dots" aria-hidden="true"></span>' +
          "</div>" +
          price +
          desc;
        list.appendChild(item);
      });
      panel.appendChild(list);
      panelsEl.appendChild(panel);

      tab.addEventListener("click", function () { activateTab(i); });
    });

    var allTabs = function () { return $$(".menu__tab", tabsEl); };
    function activateTab(idx, focus) {
      var tabs = allTabs();
      var panels = $$(".menu__panel", panelsEl);
      tabs.forEach(function (t, j) {
        var on = j === idx;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, j) {
        var on = j === idx;
        p.classList.toggle("is-active", on);
        p.hidden = !on;
      });
      var active = tabs[idx];
      if (active) {
        active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        if (focus) active.focus();
      }
    }

    tabsEl.addEventListener("keydown", function (e) {
      var tabs = allTabs();
      var current = tabs.indexOf(document.activeElement);
      if (current === -1) return;
      var next = null;
      if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
      else if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); activateTab(next, true); }
    });
  }

  /* ============================================================
     Smooth scroll (Lenis) + GSAP ScrollTrigger sync
     ============================================================ */
  var lenis = null;
  var hasGSAP = typeof gsap !== "undefined";
  if (hasGSAP && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  if (!reduceMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (hasGSAP && typeof ScrollTrigger !== "undefined") lenis.on("scroll", ScrollTrigger.update);
  }

  /* Anchor links → smooth scroll */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id === "#top") {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" });
        closeMenu();
        return;
      }
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else {
        var y = target.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  /* ============================================================
     NAV solidify + overlay
     ============================================================ */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 60) nav.classList.add("is-solid");
      else nav.classList.remove("is-solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var toggle = document.getElementById("navToggle");
  var overlay = document.getElementById("overlayMenu");
  function closeMenu() {
    if (!overlay || !document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (overlay) overlay.setAttribute("aria-hidden", "true");
    if (lenis) lenis.start();
  }
  if (toggle && overlay) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      overlay.setAttribute("aria-hidden", open ? "false" : "true");
      if (lenis) { open ? lenis.stop() : lenis.start(); }
      if (open) {
        var first = overlay.querySelector("a");
        if (first) first.focus();
      }
    });
    $$("a", overlay).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        closeMenu();
        if (toggle) toggle.focus();
      }
    });
  }

  /* ============================================================
     Reveal on scroll (IntersectionObserver, failsafe-safe)
     ============================================================ */
  var revealEls = $$("[data-reveal]");
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    window.addEventListener("load", function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && !el.classList.contains("is-visible")) el.classList.add("is-visible");
        });
      }, 1200);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============================================================
     Hero: Ken-Burns settle + parallax
     ============================================================ */
  var heroImg = document.getElementById("heroImg");
  if (heroImg && !reduceMotion && hasGSAP && typeof ScrollTrigger !== "undefined") {
    gsap.to(heroImg, {
      yPercent: 12, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* Parallax images */
  if (!reduceMotion && hasGSAP && typeof ScrollTrigger !== "undefined") {
    $$("[data-parallax]").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: "none",
        scrollTrigger: { trigger: img.closest("[data-parallax-wrap]") || img, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ============================================================
     Stat counters
     ============================================================ */
  var statsSection = document.getElementById("stats");
  if (statsSection) {
    var runCounters = function () {
      $$("[data-count]", statsSection).forEach(function (el) {
        var target = parseFloat(el.dataset.count);
        var decimals = parseInt(el.dataset.decimals || "0", 10);
        var suffix = el.dataset.suffix || "";
        if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
        var dur = 1500, start = performance.now();
        var tick = function (now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (e) { if (e.isIntersecting) { runCounters(); o.disconnect(); } });
      }, { threshold: 0.4 });
      cio.observe(statsSection);
    } else { runCounters(); }
  }

  /* ============================================================
     Highlight today's row if open now (10:00–20:00 daily)
     Table rows: 0 Mon … 6 Sun
     ============================================================ */
  (function openNow() {
    var rows = $$("#hours tbody tr");
    if (!rows.length) return;
    var now = new Date();
    var jsDay = now.getDay();               // 0 Sun … 6 Sat
    var rowIdx = (jsDay + 6) % 7;            // 0 Mon … 6 Sun
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = mins >= 10 * 60 && mins < 20 * 60;   // 10:00–20:00 every day
    if (!open) return;
    var row = rows[rowIdx];
    if (row) row.classList.add("is-now");
  })();

  /* ============================================================
     Swiper carousels
     ============================================================ */
  if (typeof Swiper !== "undefined") {
    new Swiper(".gallery__swiper", {
      slidesPerView: "auto", spaceBetween: 18, grabCursor: true,
      navigation: { nextEl: ".gallery__swiper .swiper-button-next", prevEl: ".gallery__swiper .swiper-button-prev" },
      pagination: { el: ".gallery__swiper .swiper-pagination", clickable: true },
      breakpoints: { 768: { spaceBetween: 28 } }
    });
  }
})();
