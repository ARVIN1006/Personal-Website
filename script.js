/* === CINEMATIC INTERACTION ENGINE === */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Init AOS
  AOS.init({
    duration: 1200,
    easing: "cubic-bezier(0.2, 1, 0.3, 1)",
    once: true,
    offset: 80,
  });

  // 2. Custom Cursor (Double Layer)
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorCircle = document.querySelector(".cursor-circle");

  // Only run if cursor elements exist and non-touch device
  if (
    cursorDot &&
    cursorCircle &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    // Track mouse
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Dot moves instantly
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Circle trails slightly
      cursorCircle.animate(
        {
          left: `${posX}px`,
          top: `${posY}px`,
        },
        { duration: 400, fill: "forwards" }
      );
    });

    // Hover Effect Handlers
    const hoverTargets = document.querySelectorAll("a, button, .project-item");

    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("hover-active")
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("hover-active")
      );
    });
  }

  // 3. Smooth Scroll Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // 4. Parallax / Scroll Triggers (Simple)
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;

    // Hero Parallax
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle && scrolled < 800) {
      heroTitle.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  });
});
