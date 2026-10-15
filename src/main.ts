import "./style.css";

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navigation = document.querySelector<HTMLElement>("#navigation");
const navigationLinks = document.querySelectorAll<HTMLAnchorElement>(".navigation a");
const pageSections = document.querySelectorAll<HTMLElement>("main section[id]");
const currentYear = new Date().getFullYear().toString();

for (const year of document.querySelectorAll<HTMLElement>("#header-year, #contact-year")) {
  year.textContent = currentYear;
}

if (!menuToggle || !navigation) {
  throw new Error("Não foi possível inicializar a navegação da página.");
}

const closeNavigation = (): void => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir navegação");
  navigation.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir navegação" : "Fechar navegação");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event: MouseEvent) => {
  if (event.target instanceof Element && event.target.closest("a")) {
    closeNavigation();
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue;
      }

      for (const link of navigationLinks) {
        const isCurrent = link.hash === `#${entry.target.id}`;
        link.classList.toggle("is-active", isCurrent);
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    }
  },
  { rootMargin: "-35% 0px -55% 0px" },
);

for (const section of pageSections) {
  sectionObserver.observe(section);
}

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealTargets = document.querySelectorAll<HTMLElement>(
    ".hero-copy, .hero-visual, .hero-insights, .hero-footer, " +
      ".about .section-topline, .about-layout, .projects .section-topline, " +
      ".projects-heading, .project-card, .projects-note, .contact .section-topline, " +
      ".contact-layout, .page-footer",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  for (const target of revealTargets) {
    target.classList.add("scroll-reveal");
    revealObserver.observe(target);
  }
}