/* === CINEMATIC INTERACTION ENGINE === */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Fetch & Render Data First
  fetch("data/content.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("project-list-container");
      if (data.projects && container) {
        container.innerHTML = data.projects
          .map(
            (project) => `
                <article class="project-item" data-aos="fade-up">
                    <div class="project-info">
                        <span class="project-number">${project.number}</span>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-desc">${project.subtitle}</p>
                        <ul class="tech-stack">
                            ${project.tech_stack
                              .map((tech) => `<li>${tech}</li>`)
                              .join("")}
                        </ul>
                        <a href="${
                          project.live_link
                        }" target="_blank" class="btn-link">
                            ${
                              project.btn_text
                            } <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                    <div class="project-visual">
                        <div class="project-img-wrapper">
                            <img src="${project.image_url}" alt="${
              project.title
            } Preview" loading="lazy" onerror="this.src='profile.jpg'">
                        </div>
                    </div>
                </article>
            `
          )
          .join("");
      }

      // 2. Init AOS *After* Content is Loaded
      setTimeout(() => {
        AOS.init({
          duration: 1200,
          easing: "cubic-bezier(0.2, 1, 0.3, 1)",
          once: true,
          offset: 80,
        });
      }, 100);
    })
    .catch((err) => {
      console.error("Error loading content:", err);
      // Fallback or keep loading state
      AOS.init({
        duration: 1200,
        easing: "cubic-bezier(0.2, 1, 0.3, 1)",
        once: true,
      });
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
