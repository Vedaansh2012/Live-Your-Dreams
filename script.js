
const progressBar = document.getElementById("progressBar");
const heroCar = document.getElementById("heroCar");
const secondCar = document.getElementById("secondCar");

const hero = document.getElementById("hero");
const secondScene = document.getElementById("secondScene");

// Keep track of scroll progress
function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

  progressBar.style.width = `${progress * 100}%`;

  // Move the first car across the screen as the hero scrolls away
  moveCarWithScroll(heroCar, hero, 0.05, 0.85);

  // Move the second car during the second scenic section
  moveCarWithScroll(secondCar, secondScene, 0.05, 0.85);

  // Parallax scenery
  document.querySelectorAll(".mountain, .second-layer").forEach(layer => {
    const speed = Number(layer.dataset.speed || 0.08);
    const section = layer.closest(".scene");
    const rect = section.getBoundingClientRect();
    const distance = -rect.top;

    layer.style.transform = `translate3d(0, ${distance * speed}px, 0)`;
  });
}

function moveCarWithScroll(car, section, startRatio, endRatio) {
  if (!car || !section) return;

  const rect = section.getBoundingClientRect();
  const sectionHeight = section.offsetHeight;

  const travelled = Math.min(
    1,
    Math.max(0, -rect.top / Math.max(1, sectionHeight - window.innerHeight))
  );

  const start = window.innerWidth * startRatio;
  const end = window.innerWidth * endRatio;
  const x = start + (end - start) * travelled;

  car.style.transform = `translate3d(${x}px, 0, 0)`;
}

// Reveal content when it enters the screen
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

// Create subtle glowing stars
const starsContainer = document.getElementById("stars");

if (starsContainer) {
  for (let i = 0; i < 65; i++) {
    const star = document.createElement("span");
    star.className = "star";

    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 65}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${1.5 + Math.random() * 3}s`;

    starsContainer.appendChild(star);
  }
}

// Keep scroll effects smooth without running unnecessary updates
let ticking = false;

function requestScrollUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollEffects();
      ticking = false;
    });

    ticking = true;
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);

updateScrollEffects();
