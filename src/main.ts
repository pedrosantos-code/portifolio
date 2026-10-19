import "./style.css";

const initialViewportWidthStorageKey = "portfolio-initial-viewport-width";
let initialViewportWidth = window.innerWidth;
try {
  const savedViewportWidth = window.sessionStorage.getItem(initialViewportWidthStorageKey);
  if (savedViewportWidth === null) {
    window.sessionStorage.setItem(
      initialViewportWidthStorageKey,
      String(initialViewportWidth),
    );
  } else {
    const parsedViewportWidth = Number(savedViewportWidth);
    if (!Number.isFinite(parsedViewportWidth) || parsedViewportWidth <= 0) {
      throw new Error("A largura inicial da janela salva não é válida.");
    }
    initialViewportWidth = parsedViewportWidth;
  }
} catch (error) {
  console.error("Não foi possível preservar a largura inicial da janela.", error);
}

const menuToggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const navigation = document.querySelector<HTMLElement>("#navigation");
const navigationLinks = document.querySelectorAll<HTMLAnchorElement>(".navigation a");
const pageSections = document.querySelectorAll<HTMLElement>("main section[id]");
const yearElements = document.querySelectorAll<HTMLElement>("#header-year");
const contactGlobe = document.querySelector<HTMLElement>(".contact-globe");
const heroTitle = document.querySelector<HTMLElement>(".hero h1");
const themeToggle = document.querySelector<HTMLButtonElement>(".theme-toggle");
const themeColorMeta = document.querySelector<HTMLMetaElement>("#theme-color");
const faviconLink = document.querySelector<HTMLLinkElement>("#favicon");
const readingProgress = document.querySelector<HTMLElement>(".reading-progress");
const readingProgressBar = document.querySelector<HTMLElement>(".reading-progress-bar");
const backToTop = document.querySelector<HTMLButtonElement>(".back-to-top");
const skillDetails = document.querySelector<HTMLElement>(".about-details");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeStorageKey = "portfolio-theme";

window.addEventListener("resize", () => {
  document.documentElement.classList.toggle(
    "is-narrower-than-initial",
    window.innerWidth < initialViewportWidth,
  );
});

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
  faviconLink?.setAttribute(
    "href",
    theme === "light" ? "/favicon-light.svg" : "/favicon.svg",
  );
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

const updateScrollUI = (): void => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress =
    scrollableHeight > 0
      ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
      : 0;

  if (readingProgress && readingProgressBar) {
    readingProgress.setAttribute("aria-valuenow", String(Math.round(progress)));
    readingProgressBar.style.transform = `scaleX(${progress / 100})`;
  }

  if (heroTitle && !prefersReducedMotion.matches) {
    const joinDistance = Math.min(260, window.innerHeight * 0.35);
    const joinProgress = Math.min(1, Math.max(0, window.scrollY / joinDistance));
    const availableSeparation = Math.max(
      0,
      ((window.innerWidth - heroTitle.offsetWidth) / 2 - 16) * 0.7,
    );
    const separation =
      (1 - joinProgress) *
      Math.min(110, window.innerWidth * 0.12, availableSeparation);

    heroTitle.style.setProperty("--title-split-x", `${separation}px`);
    heroTitle.style.setProperty("--title-depth", `${-110 * (1 - joinProgress)}px`);
    heroTitle.style.setProperty("--title-rotation", `${18 * (1 - joinProgress)}deg`);
  }

  backToTop?.toggleAttribute("hidden", window.scrollY < 400);
};

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
  });
});

if (
  heroTitle &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !prefersReducedMotion.matches
) {
  heroTitle.addEventListener("pointermove", (event: PointerEvent) => {
    const bounds = heroTitle.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroTitle.style.setProperty("--title-rotate-y", `${horizontal * 2}deg`);
    heroTitle.style.setProperty("--title-rotate-x", `${vertical * -2}deg`);
  });

  heroTitle.addEventListener("pointerleave", () => {
    heroTitle.style.removeProperty("--title-rotate-x");
    heroTitle.style.removeProperty("--title-rotate-y");
  });
}

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

      const sectionId = entry.target.id;
      if (
        sectionId === "sobre" ||
        sectionId === "projetos" ||
        sectionId === "contato"
      ) {
        const sectionHash = `#${sectionId}`;
        if (window.location.hash !== sectionHash) {
          window.history.replaceState(window.history.state, "", sectionHash);
        }
      } else if (
        sectionId === "inicio" &&
        (window.location.hash === "#sobre" ||
          window.location.hash === "#projetos" ||
          window.location.hash === "#contato")
      ) {
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    }
  },
  { rootMargin: "-35% 0px -55% 0px" },
);

for (const section of pageSections) {
  sectionObserver.observe(section);
}

if (skillDetails && "IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const skillMeters = skillDetails.querySelectorAll<HTMLElement>(".skill-meter");
  skillMeters.forEach((meter, index) => {
    meter.style.setProperty("--skill-delay", `${index * 70}ms`);
  });
  skillDetails.classList.add("skills-animated");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("skills-visible", entry.isIntersecting);
      }
    },
    { threshold: 0.25 },
  );

  skillObserver.observe(skillDetails);
}

if (
  "IntersectionObserver" in window &&
  !prefersReducedMotion.matches
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