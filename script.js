const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const backToTopButton = document.querySelector(".back-to-top");
const revealElements = document.querySelectorAll(
  ".section-head, .direction-card, .portfolio-item, .pricing-row, .process-card, .contact-banner, .footer-layout"
);
const portfolioImages = document.querySelectorAll(".portfolio-item img");
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
let activeImageIndex = 0;

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

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
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

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

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

if (lightbox && lightboxImage && lightboxClose && lightboxPrev && lightboxNext && lightboxCounter) {
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
}

if (telegramForm) {
  telegramForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(telegramForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const project = String(formData.get("project") || "").trim();

    const message =
      `Здравствуйте. Меня зовут ${name}. ` +
      `Контакт: ${contact}. ` +
      `Проект: ${project}`;

    const encodedMessage = encodeURIComponent(message);
    const appUrl = `tg://resolve?domain=work_ivan_3d&text=${encodedMessage}`;
    const fallbackUrl = "https://t.me/work_ivan_3d";

    window.location.href = appUrl;
    window.setTimeout(() => {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    }, 500);
  });
}
