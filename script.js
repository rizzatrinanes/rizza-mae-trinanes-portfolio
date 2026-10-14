// reduced motion
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// theme toggle
function setupThemeToggle() {
  const STORAGE_KEY = "portfolio-theme-v2";
  const savedTheme = localStorage.getItem(STORAGE_KEY) || "light";
  applyTheme(savedTheme);

  // theme button
  const nav = document.querySelector(".nav-inner");
  if (!nav) return;

  const button = document.createElement("button");
  button.className = "theme-toggle";
  button.type = "button";
  button.setAttribute("aria-label", "Toggle dark or light theme");
  button.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  nav.appendChild(button);

  // switch theme
  button.addEventListener("click", function () {
    const isDark =
      document.documentElement.getAttribute("data-theme") !== "light";
    const nextTheme = isDark ? "light" : "dark";

    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    button.textContent = nextTheme === "dark" ? "☀️" : "🌙";
  });

  // apply theme
  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }
}

// hero animation
function playHeroEntrance() {
  if (prefersReducedMotion) return;

  const heroItems = document.querySelectorAll(
    ".hero-image, .hero-title, .hero-subtitle, .btn-actions"
  );

  heroItems.forEach(function (item, index) {
    item.style.opacity = "0";
    item.style.transform = "translateY(16px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    setTimeout(function () {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, 120 * index);
  });
}

// scroll reveal
function setupScrollReveal() {
  const items = document.querySelectorAll(
    ".experience-item, .project, .education-item, .skills-inner, .fact-list, .about-inner"
  );

  if (items.length === 0) return;
  if (prefersReducedMotion) return;

  items.forEach(function (item) {
    item.classList.add("reveal");
  });

  // reveal on scroll
  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
}

// active nav link
function setupActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (sections.length === 0 || navLinks.length === 0) return;

  // find section link
  function linkFor(id) {
    return document.querySelector('.nav-links a[href="#' + id + '"]');
  }

  // set active link
  function setActive(link) {
    navLinks.forEach(function (l) {
      l.classList.remove("active");
    });

    if (link) link.classList.add("active");
  }

  // track visible section
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const link = linkFor(entry.target.id);
        if (!link || !entry.isIntersecting) return;
        setActive(link);
      });
    },
    {
      rootMargin: "-40% 0px -50% 0px",
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });

  // contact section
  const lastSection = sections[sections.length - 1];
  const lastLink = linkFor(lastSection.id);

  window.addEventListener("scroll", function () {
    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (scrolledToBottom) {
      setActive(lastLink);
    }
  });
}

// project image modal
function setupImageModal() {
  const projectImages = document.querySelectorAll(".project-image img");
  if (projectImages.length === 0) return;

  // modal elements
  const overlay = document.createElement("div");
  overlay.className = "img-modal-overlay";

  const modalImage = document.createElement("img");
  modalImage.className = "img-modal-content";

  const closeButton = document.createElement("button");
  closeButton.className = "img-modal-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close image");
  closeButton.textContent = "✕";

  overlay.appendChild(modalImage);
  overlay.appendChild(closeButton);
  document.body.appendChild(overlay);

  // open image
  function openModal(src, alt) {
    modalImage.src = src;
    modalImage.alt = alt;
    overlay.classList.add("is-open");
  }

  // close image
  function closeModal() {
    overlay.classList.remove("is-open");
  }

  // click to enlarge
  projectImages.forEach(function (img) {
    img.title = "Click to enlarge";

    img.addEventListener("click", function () {
      openModal(img.src, img.alt);
    });
  });

  closeButton.addEventListener("click", closeModal);

  // close modal on overlay click
  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeModal();
    }
  });

  // close modal on escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

// initialize page
document.addEventListener("DOMContentLoaded", function () {
  setupThemeToggle();
  playHeroEntrance();
  setupScrollReveal();
  setupActiveNavLink();
  setupImageModal();
});