(function () {
  // ===== PRELOADER: altijd weg na load =====
  function hidePreloader() {
    const preloader = document.querySelector(".preloader");
    if (!preloader) return;

    // class voor fade-out
    preloader.classList.add("preloader--hide");

    // safety: ook echt uit de layout na korte delay
    setTimeout(function () {
      preloader.style.display = "none";
    }, 700); // timing mag je tweaken
  }

  // Als alles geladen is (incl. images, fonts)
  window.addEventListener("load", hidePreloader);

  // Extra safety: als om wat voor reden dan ook 'load' niet triggert,
  // dan in ieder geval na 5 seconden weg.
  setTimeout(hidePreloader, 5000);

  // ===== DOMContentLoaded: scroll fade-in + burger menu =====
  document.addEventListener("DOMContentLoaded", function () {
    // --- SCROLL FADE-IN ---
    const elements = document.querySelectorAll(".reveal-on-scroll");

    if (elements.length) {
      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.15, // ~15% in beeld
          }
        );

        elements.forEach(function (el) {
          observer.observe(el);
        });
      } else {
        // Fallback voor oudere browsers
        elements.forEach(function (el) {
          el.classList.add("is-visible");
        });
      }
    }

    // --- BURGER MENU ---
    const burger = document.querySelector(".burger");
    const body = document.body;
    const navLinks = document.querySelectorAll(".main-nav a");

    if (burger) {
      burger.addEventListener("click", function () {
        const isOpen = body.classList.toggle("nav-open");
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // Menu sluiten wanneer je op een link klikt (fijn op mobiel)
      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          if (body.classList.contains("nav-open")) {
            body.classList.remove("nav-open");
            burger.setAttribute("aria-expanded", "false");
          }
        });
      });
    }
  });
})();
