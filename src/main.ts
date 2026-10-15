import "./style.css";

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navigation = document.querySelector<HTMLElement>("#navigation");
const navigationLinks = document.querySelectorAll<HTMLAnchorElement>(".navigation a");
const pageSections = document.querySelectorAll<HTMLElement>("main section[id]");
const yearElements = document.querySelectorAll<HTMLElement>("#header-year");
const contactGlobe = document.querySelector<HTMLElement>(".contact-globe");
const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const themeColorMeta = document.querySelector<HTMLMetaElement>("#theme-color");
const themeStorageKey = "portfolio-theme";

const applyTheme = (theme: "dark" | "light"): void => {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "light"));
  themeToggle?.setAttribute(
    "aria-label",
    theme === "light" ? "Ativar tema escuro" : "Ativar tema claro",
  );

  const icon = themeToggle?.querySelector<HTMLElement>(".theme-icon");
  if (icon) {
    icon.textContent = theme === "light" ? "☾" : "☼";
  }

  themeColorMeta?.setAttribute("content", theme === "light" ? "#f3f7fa" : "#080b10");
};

let savedTheme: string | null = null;
try {
  savedTheme = window.localStorage.getItem(themeStorageKey);
} catch (error) {
  console.error("Não foi possível ler a preferência de tema salva.", error);
}

applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);

  try {
    window.localStorage.setItem(themeStorageKey, nextTheme);
  } catch (error) {
    console.error("Não foi possível salvar a preferência de tema.", error);
  }
});

const updateYear = (): void => {
  const currentYear = new Date().getFullYear().toString();
  for (const element of yearElements) {
    element.textContent = currentYear;
  }
};

const scheduleYearUpdate = (): void => {
  const now = new Date();
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);
  window.setTimeout(() => {
    updateYear();
    scheduleYearUpdate();
  }, nextYear.getTime() - now.getTime() + 100);
};

updateYear();
scheduleYearUpdate();
window.addEventListener("focus", updateYear);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    updateYear();
  }
});

if (
  contactGlobe &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  contactGlobe.addEventListener("pointermove", (event: PointerEvent) => {
    const bounds = contactGlobe.getBoundingClientRect();
    const horizontal = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const vertical = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    contactGlobe.style.setProperty("--globe-rotate-y", `${horizontal * 12}deg`);
    contactGlobe.style.setProperty("--globe-rotate-x", `${vertical * -12}deg`);
  });

  contactGlobe.addEventListener("pointerleave", () => {
    contactGlobe.style.removeProperty("--globe-rotate-x");
    contactGlobe.style.removeProperty("--globe-rotate-y");
  });
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
    ".hero-content, " +
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