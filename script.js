/* === CINEMATIC INTERACTION ENGINE === */

document.addEventListener("DOMContentLoaded", () => {
  const loadContent = async () => {
    try {
      const response = await fetch("data/content.json");
      if (!response.ok) throw new Error("Failed to load content");
      const data = await response.json();

      // --- 1. HERO SECTION ---
      if (data.hero) {
        setText("hero-title-1", data.hero.title_line_1);
        setText("hero-title-2", data.hero.title_line_2);
        setText("hero-role", data.hero.role_text);
        setHTML("hero-desc", data.hero.description);
      }

      // --- 2. PROJECTS SECTION ---
      const projectContainer = document.getElementById(
        "project-list-container"
      );
      if (projectContainer && data.projects) {
        projectContainer.innerHTML = renderProjects(data.projects);
      }

      // --- 3. ABOUT SECTION ---
      if (data.about) {
        setHTML("about-heading", data.about.heading);
        setImage("about-img-desktop", data.about.image_url);
        setImage("about-img-mobile", data.about.image_url);
        setLink("about-resume", data.about.resume_link);

        const textContainer = document.getElementById("about-text-container");
        if (textContainer) {
          let html = "";
          if (data.about.text_1) html += `<p>${data.about.text_1}</p>`;
          if (data.about.text_2) html += `<p>${data.about.text_2}</p>`;
          if (data.about.text_3) html += `<p>${data.about.text_3}</p>`;
          textContainer.innerHTML = html;
        }
      }

      // --- 4. FOOTER SECTION ---
      if (data.footer) {
        setText("footer-cta", data.footer.cta_text);
        setHTML("footer-copyright", data.footer.copyright);

        const socialsContainer = document.getElementById("footer-socials");
        if (socialsContainer && data.footer.socials) {
          socialsContainer.innerHTML = data.footer.socials
            .map(
              (link) => `
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
                 class="opacity-60 hover:opacity-100 hover:text-studio-accent transition"
                 title="${link.name}">
                 ${link.name}
              </a>
          `
            )
            .join("");
        }
      }
    } catch (error) {
      console.warn("Using fallback data due to error:", error);
      // Fallback only provided for projects as critical content
      const container = document.getElementById("project-list-container");
      if (container) {
        const fallbackData = [
          {
            number: "01",
            title: "Smart WMS",
            subtitle: "Enterprise Warehouse Management System",
            tech_stack: ["Next.js", "React", "Dashboard"],
            live_link: "https://wms-project-4dtd.vercel.app/",
            btn_text: "Live Demo",
            image_url:
              "https://arvindev.netlify.app/media/cuplikan-layar-2026-01-07-142925.png",
          },
        ];
        container.innerHTML = renderProjects(fallbackData);
      }
    } finally {
      requestAnimationFrame(() => {
        AOS.init({
          duration: 1200,
          easing: "cubic-bezier(0.2, 1, 0.3, 1)",
          once: true,
        });
      });
    }
  };

  // Helper Functions
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };
  const setHTML = (id, html) => {
    const el = document.getElementById(id);
    if (el && html) el.innerHTML = html;
  };
  const setImage = (id, src) => {
    const el = document.getElementById(id);
    if (el && src) el.src = src;
  };
  const setLink = (id, href) => {
    const el = document.getElementById(id);
    if (el && href) el.href = href;
  };

  const renderProjects = (projects) => {
    return projects
      .map((project, index) => {
        const isEven = index % 2 !== 0;
        return `
        <article class="group relative flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-center fade-in" data-aos="fade-up">
            <div class="lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}">
                <span class="block font-serif text-3xl lg:text-4xl text-studio-gray opacity-30 mb-4" aria-hidden="true">${
                  project.number
                }</span>
                <h3 class="text-4xl lg:text-5xl font-bold mb-2 tracking-tight">${
                  project.title
                }</h3>
                <p class="text-lg text-studio-gray mb-6">${project.subtitle}</p>

                <div class="block lg:hidden my-10 aspect-video bg-studio-soft border border-white/10 rounded overflow-hidden">
                    <img src="${project.image_url}" alt="Screenshot of ${
          project.title
        }" class="w-full h-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" width="800" height="450">
                </div>
                
                <ul class="flex flex-wrap gap-4 mb-8 text-sm opacity-80" aria-label="Technologies used">
                    ${(project.tech_stack || [])
                      .map(
                        (tech) =>
                          `<li><span class="px-3 py-1 border border-white/20 rounded-full bg-white/5">${tech}</span></li>`
                      )
                      .join("")}
                </ul>
                <a href="${
                  project.live_link || "#"
                }" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 border-b border-white pb-1 font-semibold hover:text-studio-accent transition-all group-hover:gap-4" title="View ${
          project.title
        } Live Demo">
                    ${
                      project.btn_text
                    } <i class="bi bi-arrow-right" aria-hidden="true"></i>
                </a>
            </div>

            <div class="hidden lg:block lg:col-span-7 ${
              isEven ? "lg:order-1" : "lg:order-2"
            }">
                <div class="w-full aspect-video bg-studio-soft border border-white/10 rounded overflow-hidden flex items-center justify-center relative">
                    <img src="${project.image_url}" alt="Screenshot of ${
          project.title
        }" class="w-full h-full object-cover opacity-80 lg:grayscale lg:group-hover:grayscale-0 lg:group-hover:opacity-100 transition duration-700 group-hover:scale-105" loading="lazy" width="800" height="450">
                </div>
            </div>
        </article>`;
      })
      .join("");
  };

  loadContent();

  // Terminal Logic
  const termInput = document.getElementById("terminal-input");
  const termOutput = document.getElementById("terminal-output");
  if (termInput) {
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = termInput.value.toLowerCase().trim();
        let response = `> command not found: ${cmd}. try 'help'`;
        if (cmd === "help") response = "> available: about, skills, clear";
        else if (cmd === "about")
          response = "> Arvin Ramdhan: Web Developer & IT Support Specialist.";
        else if (cmd === "skills")
          response = "> Tech: React, Tailwind, Troubleshooting, Networking.";
        else if (cmd === "clear") {
          termOutput.innerHTML = "";
          termInput.value = "";
          return;
        }

        const line = document.createElement("div");
        line.className = "text-studio-gray mb-1";
        line.textContent = `admin@arvin:~$ ${cmd}`;
        const resLine = document.createElement("div");
        resLine.className = "text-studio-accent mb-3";
        resLine.textContent = response;
        termOutput.appendChild(line);
        termOutput.appendChild(resLine);
        termInput.value = "";
        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });
  }

  // Cursor Logic
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorCircle = document.querySelector(".cursor-circle");
  if (
    cursorDot &&
    cursorCircle &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    let mouseX = 0,
      mouseY = 0;
    let dotX = 0,
      dotY = 0;
    let circleX = 0,
      circleY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      const dx = mouseX - circleX;
      const dy = mouseY - circleY;

      if (
        Math.abs(dx) < 0.1 &&
        Math.abs(dy) < 0.1 &&
        Math.abs(dotX - mouseX) < 0.1 &&
        Math.abs(dotY - mouseY) < 0.1
      ) {
        requestAnimationFrame(animate);
        return;
      }

      dotX = mouseX;
      dotY = mouseY;
      circleX += dx * 0.15;
      circleY += dy * 0.15;

      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll("a, button, input").forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("hover-active")
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("hover-active")
      );
    });
  }
});
