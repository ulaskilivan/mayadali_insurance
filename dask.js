document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80
    });
  }

  if (typeof gsap !== "undefined") {
    gsap.from(".kasko-hero h1", { y: 24, opacity: 0, duration: 0.7, ease: "power2.out" });
    gsap.from(".kasko-hero p", { y: 16, opacity: 0, duration: 0.7, delay: 0.12, ease: "power2.out" });
    gsap.from(".kasko-hero .btn", { y: 14, opacity: 0, duration: 0.65, delay: 0.24, ease: "power2.out" });
    gsap.from(".kasko-hero-img", { scale: 0.94, opacity: 0, duration: 0.85, delay: 0.18, ease: "power2.out" });
  }
});
