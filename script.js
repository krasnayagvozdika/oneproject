const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const backToTopButton = document.querySelector(".back-to-top");
const portfolioGrid = document.querySelector("#portfolio-grid");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
const lightboxCounter = document.querySelector(".lightbox-counter");
const hero = document.querySelector(".hero");
const heroMediaImage = document.querySelector(".hero-media img");
const telegramForm = document.querySelector("#telegram-form");
const scrollProgress = document.querySelector(".scroll-progress");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
const trackedSections = document.querySelectorAll("main section[id]");
const staticRevealElements = document.querySelectorAll(
  ".section-head, .direction-card, .pricing-row, .process-card, .contact-banner, .footer-layout"
);
let activeImageIndex = 0;
let portfolioImages = [];
let revealObserver = null;
let lightboxBindingsReady = false;

const registerRevealElements = (elements) => {
  elements.forEach((element) => {
    if (!element) {
      return;
    }

    element.classList.add("reveal");

    if (revealObserver) {
      revealObserver.observe(element);
    } else {
      element.classList.add("is-visible");
    }
  });
};

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

if ("IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );
}

registerRevealElements([...staticRevealElements]);

if (backToTopButton) {
  window.addEventListener(
    "scroll",
    () => {
      const isVisible = window.scrollY > 700;
      backToTopButton.classList.toggle("is-visible", isVisible);
    },
    { passive: true }
  );

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (scrollProgress) {
  window.addEventListener(
    "scroll",
    () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
    },
    { passive: true }
  );
}

if (navLinks.length && trackedSections.length) {
  const updateActiveNav = () => {
    const checkpoint = window.scrollY + window.innerHeight * 0.22;
    let currentId = "";

    trackedSections.forEach((section) => {
      if (checkpoint >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("is-active", isActive);
    });
  };

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("resize", updateActiveNav);
}

if (hero && heroMediaImage) {
  window.addEventListener(
    "scroll",
    () => {
      const offset = Math.min(window.scrollY * 0.18, 90);
      heroMediaImage.style.transform = `scale(1.05) translateY(${offset}px)`;
    },
    { passive: true }
  );
}

const setupLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxClose || !lightboxPrev || !lightboxNext || !lightboxCounter) {
    return;
  }

  const updateLightbox = (index) => {
    const image = portfolioImages[index];
    if (!image) {
      return;
    }

    activeImageIndex = index;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCounter.textContent = `${index + 1} / ${portfolioImages.length}`;
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
  };

  const openLightbox = (index) => {
    updateLightbox(index);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
  };

  const showNextImage = () => {
    updateLightbox((activeImageIndex + 1) % portfolioImages.length);
  };

  const showPreviousImage = () => {
    updateLightbox((activeImageIndex - 1 + portfolioImages.length) % portfolioImages.length);
  };

  portfolioImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  if (!lightboxBindingsReady) {
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxNext.addEventListener("click", showNextImage);
    lightboxPrev.addEventListener("click", showPreviousImage);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
      }

      if (event.key === "ArrowRight" && !lightbox.hidden) {
        showNextImage();
      }

      if (event.key === "ArrowLeft" && !lightbox.hidden) {
        showPreviousImage();
      }
    });

    lightboxBindingsReady = true;
  }
};

const renderPortfolio = async () => {
  if (!portfolioGrid) {
    return;
  }

  const items = Array.isArray(window.portfolioItems) ? window.portfolioItems : [];

  try {
    if (!Array.isArray(items)) {
      throw new Error("Portfolio data must be an array");
    }

    portfolioGrid.innerHTML = "";
    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = `portfolio-item portfolio-item--${item.orientation || "square"}`;
      article.dataset.orientation = item.orientation || "square";

      const image = document.createElement("img");
      image.src = `assets/images/portfolio/${item.file}`;
      image.alt = item.alt || `Реализованный проект ${index + 1}`;
      image.loading = "lazy";

      if (item.width && item.height) {
        image.width = item.width;
        image.height = item.height;
      }

      article.append(image);
      fragment.append(article);
    });

    portfolioGrid.append(fragment);
    portfolioImages = Array.from(portfolioGrid.querySelectorAll(".portfolio-item img"));
    registerRevealElements(Array.from(portfolioGrid.querySelectorAll(".portfolio-item")));
    setupLightbox();
  } catch (error) {
    console.error(error);
    portfolioGrid.innerHTML = '<p class="portfolio-status">Не удалось загрузить портфолио.</p>';
  }
};

renderPortfolio();

if (telegramForm) {
  telegramForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(telegramForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const project = String(formData.get("project") || "").trim();
    const greeting = name ? `Здравствуйте. Меня зовут ${name}. ` : "Здравствуйте. ";

    const message = `${greeting}Контакт: ${contact}. Проект: ${project}`;

    const encodedMessage = encodeURIComponent(message);
    const appUrl = `tg://resolve?domain=work_ivan_3d&text=${encodedMessage}`;
    const fallbackUrl = "https://t.me/work_ivan_3d";

    window.location.href = appUrl;
    window.setTimeout(() => {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    }, 500);
  });
}
