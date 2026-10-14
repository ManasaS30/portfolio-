const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

// Typing effect
const phrases = ["Web development", "creative interfaces", "JavaScript", "new ideas"];
const typingText = $("#typingText");
let phraseIndex = 0, letterIndex = 0, deleting = false;
function typeLoop() {
  const phrase = phrases[phraseIndex];
  typingText.textContent = phrase.slice(0, letterIndex);
  if (!deleting && letterIndex < phrase.length) {
    letterIndex++;
    setTimeout(typeLoop, 85);
  } else if (deleting && letterIndex > 0) {
    letterIndex--;
    setTimeout(typeLoop, 45);
  } else {
    deleting = !deleting;
    if (!deleting) phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeLoop, deleting ? 1200 : 350);
  }
}
typeLoop();

// Mobile navigation
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "×" : "☰";
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Reveal sections as they enter the screen
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

// Reading progress indicator
const progressBar = $("#progressBar");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Active navigation section
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
$$("main section[id]").forEach(section => sectionObserver.observe(section));

// Project detail dialog
const projectDetails = {
  portfolio: {
    title: "Interactive Portfolio",
    description: "A personal website to introduce yourself, share selected projects, and make it easy for people to contact you. Try adding your own case studies, screenshots, GitHub links, and a downloadable résumé.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive design"]
  },
  student: {
    title: "Focus List",
    description: "A study planner concept. A next step would be to build working add, complete, filter, and delete actions, then save tasks in local storage.",
    tags: ["JavaScript", "DOM", "Local storage"]
  },
  api: {
    title: "API Explorer",
    description: "A beginner-friendly interface for practising Fetch API requests, handling response.ok, and displaying JSON results with loading and error states.",
    tags: ["Fetch API", "JSON", "Async / await"]
  }
};
const dialog = $("#projectDialog");
function openProject(key) {
  const project = projectDetails[key];
  if (!project) return;
  $("#dialogTitle").textContent = project.title;
  $("#dialogDescription").textContent = project.description;
  $("#dialogTags").replaceChildren(...project.tags.map(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    return span;
  }));
  if (typeof dialog.showModal === "function") dialog.showModal();
}
$$("[data-detail]").forEach(button => button.addEventListener("click", event => {
  event.stopPropagation();
  openProject(button.dataset.detail);
}));
$$("[data-project]").forEach(card => {
  card.addEventListener("click", event => {
    if (!event.target.closest("button")) openProject(card.dataset.project);
  });
  card.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target === card) {
      event.preventDefault();
      openProject(card.dataset.project);
    }
  });
});
$("#dialogClose").addEventListener("click", () => dialog.close());
$("#dialogDone").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

// Copy email with fallback-friendly feedback
const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}
$("#copyEmail").addEventListener("click", async () => {
  const email = "mmanasa51511@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email address copied!");
  } catch {
    showToast(`Email: ${email}`);
  }
});

// Subtle cursor glow on devices with a fine pointer
const glow = $(".cursor-glow");
window.addEventListener("pointermove", event => {
  if (event.pointerType === "mouse") {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
}, { passive: true });
