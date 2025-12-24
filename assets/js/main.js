(function () {
  // ===== PRELOADER =====
  function hidePreloader() {
    var preloader = document.querySelector(".preloader");
    if (!preloader) return;

    preloader.classList.add("preloader--hide");

    setTimeout(function () {
      preloader.style.display = "none";
    }, 700);
  }

  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 5000);

  // ===== DOM READY =====
  document.addEventListener("DOMContentLoaded", function () {
    // --- SCROLL FADE-IN ---
    var elements = document.querySelectorAll(".reveal-on-scroll");

    if (elements.length && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
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

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    // --- BURGER MENU ---
    var burger = document.querySelector(".burger");
    var body = document.body;
    var navLinks = document.querySelectorAll(".main-nav a");

    if (burger) {
      burger.addEventListener("click", function () {
        var isOpen = body.classList.toggle("nav-open");
        burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          if (body.classList.contains("nav-open")) {
            body.classList.remove("nav-open");
            burger.setAttribute("aria-expanded", "false");
          }
        });
      });
    }

    // ===== LOGO SLIDER (ENDLESS RIGHT → LEFT) =====
    var track = document.getElementById("logoTrack");
    if (track) {
      // Duplicate for seamless loop
      track.innerHTML = track.innerHTML + track.innerHTML;

      var position = 0;
      var speed = 0.5; // px per frame

      function animate() {
        position -= speed;

        if (Math.abs(position) >= track.scrollWidth / 2) {
          position = 0;
        }

        // SAFE: no template literals
        track.style.transform = "translateX(" + position + "px)";
        requestAnimationFrame(animate);
      }

      animate();
    }
  });
})();

// ===== CONTACT FORM =====
document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(form);

    fetch("contact.php", {
      method: "POST",
      body: formData
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.success) {
          alert("Message sent successfully!");
          form.reset();
        } else {
          alert(data.message || "Failed to send message");
        }
      })
      .catch(function () {
        alert("Network error");
      });
  });
});
// UNIT SECTION PARALLAX (smooth + safe)
document.addEventListener("DOMContentLoaded", function () {
  var section = document.getElementById("unitSection");
  var bg = document.getElementById("unitBg");
  if (!section || !bg) return;

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bg.style.transform = "translate3d(0,0,0)";
    return;
  }

  var ticking = false;
  var strength = 0.18; // parallax intensity (0.10 subtle, 0.25 stronger)

  function update() {
    ticking = false;

    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;

    // progress through viewport (-1..1 approx)
    var center = rect.top + rect.height / 2;
    var progress = (center - vh / 2) / (vh / 2);

    // move bg slightly up/down (clamped)
    var y = Math.max(-80, Math.min(80, progress * rect.height * strength));

    bg.style.transform = "translate3d(0," + y.toFixed(2) + "px,0)";
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
});