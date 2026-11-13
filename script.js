
/* =========================================
   LIVE YOUR DREAMS — SCROLL & VFX ENGINE
   ========================================= */

const progressBar = document.getElementById("progressBar");

const heroCar = document.getElementById("heroCar");
const secondCar = document.getElementById("secondCar");

const hero = document.getElementById("hero");
const secondScene = document.getElementById("secondScene");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

/* -----------------------------------------
   SCROLL PROGRESS
----------------------------------------- */

function updateProgress() {
  if (!progressBar) return;

  const pageHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    pageHeight > 0 ? window.scrollY / pageHeight : 0;

  progressBar.style.width = `${progress * 100}%`;
}

/* -----------------------------------------
   SMOOTH SCROLL-BASED CAR MOVEMENT
----------------------------------------- */

function moveCarWithScroll(car, section, startRatio = 0.68) {
  if (!car || !section) return;

  const rect = section.getBoundingClientRect();

  // Works even when a scenic section is exactly one screen tall.
  const sectionProgress = clamp(
    -rect.top / Math.max(section.offsetHeight, window.innerHeight),
    0,
    1
  );

  const carWidth = car.getBoundingClientRect().width;

  // Keep the car inside the visible screen.
  const maxX = Math.max(12, window.innerWidth - carWidth - 18);

  const startX = Math.min(window.innerWidth * startRatio, maxX);
  const endX = maxX;

  const x = startX + (endX - startX) * sectionProgress;

  // Small natural movement as the car travels.
  const gentleBob = Math.sin(sectionProgress * Math.PI * 2) * 2;

  car.style.transform =
    `translate3d(${x}px, ${gentleBob}px, 0)`;
}

/* -----------------------------------------
   MOUNTAIN PARALLAX
----------------------------------------- */

function updateParallax() {
  if (reduceMotion) return;

  const layers = document.querySelectorAll(
    ".mountain, .second-layer"
  );

  layers.forEach(layer => {
    const section = layer.closest(".scene");

    if (!section) return;

    const rect = section.getBoundingClientRect();

    let speed = Number(layer.dataset.speed);

    if (!speed) {
      if (
        layer.classList.contains("mountain-back") ||
        layer.classList.contains("layer-back")
      ) {
        speed = 0.14;
      } else if (
        layer.classList.contains("mountain-middle") ||
        layer.classList.contains("layer-middle")
      ) {
        speed = 0.09;
      } else {
        speed = 0.045;
      }
    }

    const movement = rect.top * speed;

    layer.style.transform =
      `translate3d(0, ${movement}px, 0)`;
  });
}

/* -----------------------------------------
   MAIN VISUAL UPDATE
----------------------------------------- */

function updateScrollEffects() {
  updateProgress();

  if (!reduceMotion) {
    moveCarWithScroll(heroCar, hero, 0.68);
    moveCarWithScroll(secondCar, secondScene, 0.65);

    updateParallax();
  }
}

/* -----------------------------------------
   CONTENT REVEAL
----------------------------------------- */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}

/* -----------------------------------------
   GENERATE SOFT GLOWING STARS
----------------------------------------- */

const starsContainer = document.getElementById("stars");

if (starsContainer && starsContainer.children.length === 0) {
  const starCount = window.innerWidth < 700 ? 35 : 75;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("span");

    star.className = "star";

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 65}%`;

    star.style.animationDelay =
      `${Math.random() * 4}s`;

    star.style.animationDuration =
      `${2 + Math.random() * 3}s`;

    starsContainer.appendChild(star);
  }
}

/* -----------------------------------------
   PERFORMANCE-FRIENDLY SCROLL LISTENER
----------------------------------------- */

let ticking = false;

function requestScrollUpdate() {
  if (ticking) return;

  ticking = true;

  window.requestAnimationFrame(() => {
    updateScrollEffects();
    ticking = false;
  });
}

window.addEventListener(
  "scroll",
  requestScrollUpdate,
  { passive: true }
);

window.addEventListener("resize", requestScrollUpdate);

window.addEventListener("load", updateScrollEffects);

// Initial page setup
updateScrollEffects();
