document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navbar = document.querySelector(".navbar");
  const drawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("mobileDrawerOverlay");
  const openBtn = document.getElementById("mobileMenuToggle");
  const closeBtn = document.getElementById("mobileMenuClose");

  const openDrawer = () => {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.add("open");
    drawerOverlay.classList.add("open");
    body.classList.add("no-scroll");
  };

  const closeDrawer = () => {
    if (!drawer || !drawerOverlay) return;
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    body.classList.remove("no-scroll");
  };

  if (openBtn) openBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

  const submenuParents = document.querySelectorAll(".drawer-parent");
  submenuParents.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const submenu = targetId ? document.getElementById(targetId) : null;
      if (!submenu) return;
      submenu.classList.toggle("open");
    });
  });

  const drawerLinks = document.querySelectorAll(".mobile-drawer a");
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("active");
      });
    }, { threshold: 0.15 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const counters = document.querySelectorAll(".counter");
  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target") || 0);
    const step = Math.max(1, Math.ceil(target / 80));
    let value = 0;
    const tick = () => {
      value += step;
      if (value >= target) {
        el.textContent = String(target);
        return;
      }
      el.textContent = String(value);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();
});
