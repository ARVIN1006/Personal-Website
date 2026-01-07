/* === CINEMATIC INTERACTION ENGINE === */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Robust Async Data Loading
  const loadContent = async () => {
    const container = document.getElementById("project-list-container");
    if (!container) return;

    try {
      const response = await fetch("data/content.json");
      if (!response.ok) throw new Error("Failed to load content");

      const data = await response.json();

      if (data.projects && data.projects.length > 0) {
        // Build HTML
        const projectHTML = data.projects
          .map(
            (project) => `
            <article class="project-item fade-in" data-aos="fade-up">
                <div class="project-info">
                    <span class="project-number">${project.number}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.subtitle}</p>
                    <ul class="tech-stack">
                        ${(project.tech_stack || [])
                          .map((tech) => `<li>${tech}</li>`)
                          .join("")}
                    </ul>
                    <a href="${
                      project.live_link || "#"
                    }" target="_blank" class="btn-link">
                        ${
                          project.btn_text || "View Project"
                        } <i class="bi bi-arrow-right"></i>
                    </a>
                </div>
                <div class="project-visual">
                    <div class="project-img-wrapper">
                        <img 
                            src="${project.image_url}" 
                            alt="${project.title} Preview" 
                            loading="lazy" 
                            onerror="this.src='profile.jpg'"
                        >
                    </div>
                </div>
            </article>
        `
          )
          .join("");

        // Inject and Animate
        container.innerHTML = projectHTML;
      }
    } catch (error) {
      console.warn(
        "Content load failed (likely CORS or missing file). Using fallback data for preview.",
        error
      );

      // Fallback Data for Local Preview
      const fallbackData = [
        {
          number: "01",
          title: "Smart WMS",
          subtitle: "Enterprise Warehouse Management System",
          tech_stack: ["Next.js", "React", "Dashboard"],
          live_link: "https://wms-project-4dtd.vercel.app/",
          btn_text: "Live Demo",
          image_url:
            "https://image.thum.io/get/width/1200/crop/800/noanimate/https://wms-project-4dtd.vercel.app/",
        },
        {
          number: "02",
          title: "Web Crave",
          subtitle: "Creative Digital Agency Platform",
          tech_stack: ["Netlify", "UI/UX", "Modern Web"],
          live_link: "https://web-crave.netlify.app/",
          btn_text: "Visit Site",
          image_url:
            "https://image.thum.io/get/width/1200/crop/800/noanimate/https://web-crave.netlify.app/",
        },
        {
          number: "03",
          title: "Portfolio v2",
          subtitle: "Cinematic Personal Branding",
          tech_stack: ["Cinematic CSS", "Micro-Interactions"],
          live_link: "#",
          btn_text: "You Are Here",
          image_url:
            "https://image.thum.io/get/width/1200/crop/800/noanimate/https://arvin-portfolio-preview.vercel.app/",
        },
      ];

      const container = document.getElementById("project-list-container");
      if (container) {
        container.innerHTML = fallbackData
          .map(
            (project) => `
            <article class="project-item fade-in" data-aos="fade-up">
                <div class="project-info">
                    <span class="project-number">${project.number}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.subtitle}</p>
                    <ul class="tech-stack">
                        ${(project.tech_stack || [])
                          .map((tech) => `<li>${tech}</li>`)
                          .join("")}
                    </ul>
                    <a href="${
                      project.live_link
                    }" target="_blank" class="btn-link">
                        ${project.btn_text} <i class="bi bi-arrow-right"></i>
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
    } finally {
      // 2. Always Init AOS (even if fetch fails, to animate other parts)
      // Small delay to ensure DOM is painted
      requestAnimationFrame(() => {
        AOS.init({
          duration: 1200,
          easing: "cubic-bezier(0.2, 1, 0.3, 1)",
          once: true,
          offset: 80,
        });
        // Check for parallax refresh
        setTimeout(() => AOS.refresh(), 500);
      });
    }
  };

  loadContent();

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
