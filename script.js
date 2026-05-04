/* ============================================================
   TalkPro Solutions BPO — Interactions
   ============================================================ */

(() => {
  // -- Active page highlight
  const current = document.documentElement.dataset.page;
  document.querySelectorAll(".nav-links a[data-page]").forEach(a => {
    if (a.dataset.page === current) a.classList.add("active");
  });

  // -- Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      links.classList.toggle("open");
    });
    // close on link click
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        toggle.classList.remove("active");
        links.classList.remove("open");
      });
    });
  }

  // -- Sticky nav state
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 12) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // -- Reveal on scroll (with stagger from data-attr)
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // -- Smooth page transition (preserves SPA-like feel without breaking links)
  document.querySelectorAll("a[href$='.html']").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank" || e.metaKey || e.ctrlKey) return;
      // skip external anchors
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });

  // -- FAQ accordion
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    if (!q) return;
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      // optional: close siblings
      item.parentElement.querySelectorAll(".faq-item.open").forEach(s => {
        if (s !== item) s.classList.remove("open");
      });
      item.classList.toggle("open", !open);
    });
  });

  // -- Animated counter for stats
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = (target * eased).toFixed(decimals);
          el.textContent = v + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  // -- Parallax-lite on hero floats
  const floats = document.querySelectorAll(".hero-float");
  if (floats.length && window.matchMedia("(min-width:1100px)").matches) {
    document.addEventListener("mousemove", e => {
      const x = (e.clientX / window.innerWidth - .5) * 2;
      const y = (e.clientY / window.innerHeight - .5) * 2;
      floats.forEach((f, i) => {
        const k = (i + 1) * 6;
        f.style.transform = `translate(${x * k}px, ${y * k}px)`;
      });
    });
  }
})();
