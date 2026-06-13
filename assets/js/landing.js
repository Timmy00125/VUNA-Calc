document.addEventListener("DOMContentLoaded", function () {
  initRevealAnimations();
  initNavScroll();
  initMobileNav();
  initTypewriter();
});

function initRevealAnimations() {
  var reveals = document.querySelectorAll(".reveal");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach(function (el) {
    observer.observe(el);
  });
}

function initNavScroll() {
  var nav = document.querySelector(".nav");
  var lastScroll = 0;
  window.addEventListener("scroll", function () {
    var scrollY = window.scrollY;
    if (scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
    lastScroll = scrollY;
  });
}

function initMobileNav() {
  var toggle = document.querySelector(".nav-mobile-toggle");
  var links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", function () {
    links.classList.toggle("open");
    toggle.classList.toggle("active");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("active");
    });
  });
}

function initTypewriter() {
  var el = document.getElementById("typewriter-text");
  if (!el) return;

  var phrases = [
    "Seven multiplied by six equals forty-two",
    "Five plus three equals eight",
    "Twelve divided by four equals three",
    "One hundred plus fifty equals one hundred fifty",
    "Twenty-five times four equals one hundred",
    "Nine minus four equals five",
  ];

  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var speed = 55;
  var deleteSpeed = 30;
  var pauseEnd = 2500;
  var pauseStart = 600;

  function type() {
    var current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, pauseEnd);
        return;
      }
      setTimeout(type, speed + Math.random() * 40);
    } else {
      charIndex--;
      el.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, pauseStart);
        return;
      }
      setTimeout(type, deleteSpeed);
    }
  }

  setTimeout(type, 1200);
}
