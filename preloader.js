// PRELOADER SCRIPT — reusable across all pages
(function () {
  // Run only after full page load
  window.addEventListener("load", function () {
    const preloader = document.querySelector(".preloader");
    if (!preloader) return;

    // Add hide class (CSS should fade it out)
    preloader.classList.add("preloader--hide");

    // Remove from DOM after transition ends
    preloader.addEventListener(
      "transitionend",
      function () {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      },
      { once: true }
    );
  });
})();
