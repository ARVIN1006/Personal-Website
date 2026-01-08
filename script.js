/* === CINEMATIC INTERACTION ENGINE === */

document.addEventListener("DOMContentLoaded", () => {
  const loadContent = async () => {
    const container = document.getElementById("project-list-container");
    if (!container) return;

    try {
      const response = await fetch("data/content.json");
      if (!response.ok) throw new Error("Failed to load content");
      const data = await response.json();
      if (data.projects) container.innerHTML = renderProjects(data.projects);
    } catch (error) {
      console.warn("Using fallback data.");
      const fallbackData = [
        {
          number: "01",
          title: "Smart WMS",
          subtitle: "Enterprise Warehouse Management System",
          tech_stack: ["Next.js", "React", "Dashboard"],
          live_link: "https://wms-project-4dtd.vercel.app/",
          btn_text: "Live Demo",
          image_url: "media/cuplikan-layar-2026-01-07-142925.png",
        },
        {
          number: "02",
          title: "Web Crave",
          subtitle: "Creative Digital Agency Platform",
          tech_stack: ["Netlify", "UI/UX", "Modern Web"],
          live_link: "https://web-crave.netlify.app/",
          btn_text: "Visit Site",
          image_url: "media/cuplikan-layar-2026-01-07-122353.png",
        },
        {
          number: "03",
          title: "Portfolio v2",
          subtitle: "Cinematic Personal Branding",
          tech_stack: ["Cinematic CSS", "Micro-Interactions"],
          live_link: "#",
          btn_text: "You Are Here",
          image_url: "media/cuplikan-layar-2026-01-07-132111.png",
        },
      ];
      container.innerHTML = renderProjects(fallbackData);
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

  // Cursor Logic (Hanya untuk device dengan kursor presisi)
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
      // Small lag for the circle, instant for the dot
      dotX = mouseX;
      dotY = mouseY;
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;

      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animate);
    };
    animate();

    // Hover effect for interactive elements
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
