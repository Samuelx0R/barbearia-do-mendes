document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initActiveMenuLink();
  initScrollAnimations();
  initInfiniteCarousel();
  initCurrentYear();
});

/* MENU HAMBÚRGUER */

function initMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".main-nav");

  if (!menuButton || !menu) return;

  menuButton.setAttribute("aria-expanded", "false");

  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");

    menuButton.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu(menuButton, menu);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu(menuButton, menu);
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      closeMobileMenu(menuButton, menu);
    }
  });
}

function closeMobileMenu(menuButton, menu) {
  menu.classList.remove("is-open");
  menuButton.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

/* LINK ATIVO NO MENU */

function initActiveMenuLink() {
  const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));

  if (links.length === 0) return;

  const sections = links
    .map((link) => {
      const sectionId = link.getAttribute("href");
      const section = document.querySelector(sectionId);

      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  const setActiveLink = (activeLink) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link === activeLink);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleEntries.length === 0) return;

      const activeSection = visibleEntries[0].target;
      const activeItem = sections.find(
        (item) => item.section === activeSection,
      );

      if (activeItem) {
        setActiveLink(activeItem.link);
      }
    },
    {
      root: null,
      threshold: [0.25, 0.4, 0.6],
      rootMargin: "-30% 0px -45% 0px",
    },
  );

  sections.forEach(({ section }) => observer.observe(section));

  setActiveLink(links[0]);
}

/* ANIMAÇÕES SUAVES AO ROLAR */

function initScrollAnimations() {
  const animatedElements = [
    ".hero-content",
    ".about-image-wrapper",
    ".about-content",
    ".service-card",
    ".environment .section-header",
    ".floating-tool",
    ".review-card",
    ".schedule-content",
    ".schedule-card",
    ".brand-logo-image",
    ".location-info",
    ".location-map",
    ".location-cta",
  ];

  const elements = document.querySelectorAll(animatedElements.join(","));

  if (elements.length === 0) return;

  elements.forEach((element, index) => {
    element.classList.add("reveal");

    if (element.classList.contains("service-card")) {
      element.style.transitionDelay = `${(index % 4) * 90}ms`;
    }

    if (element.classList.contains("review-card")) {
      element.style.transitionDelay = `${(index % 4) * 90}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -80px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
}

/* CARROSSEL INFINITO */

function initInfiniteCarousel() {
  const carouselTrack = document.querySelector(".carousel-track");

  if (!carouselTrack) return;

  const slides = Array.from(carouselTrack.children);

  if (slides.length === 0) return;

  const alreadyCloned = carouselTrack.dataset.cloned === "true";

  if (alreadyCloned) return;

  slides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    carouselTrack.appendChild(clone);
  });

  carouselTrack.dataset.cloned = "true";
}

/* ANO AUTOMÁTICO */

function initCurrentYear() {
  const yearElement = document.querySelector("[data-current-year]");

  if (!yearElement) return;

  yearElement.textContent = new Date().getFullYear();
}
