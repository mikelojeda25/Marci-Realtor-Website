document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTS ---
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const navbar = document.getElementById("navbar");
  const navContainer = document.getElementById("nav-container");
  const logo = document.getElementById("logo");

  // --- MENU TOGGLE ---
  const toggleMenu = () => {
    menu.classList.toggle("translate-x-full");
    // Nagdagdag ng transition para sa icon rotation
    hamburgerIcon.classList.toggle("rotate-180");
    // I-toggle din ang overlay opacity kung meron man
    if (overlay) {
      overlay.classList.toggle("hidden");
    }
  };

  btn?.addEventListener("click", toggleMenu);
  overlay?.addEventListener("click", toggleMenu);

  // --- SCROLL EFFECTS ---
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // Navbar Background (Desktop)
    if (scrollY > 200) {
      navbar.classList.add("md:bg-slate-900", "md:shadow-md");
      navbar.classList.remove("md:bg-black/20", "md:backdrop-blur-md");
    } else {
      navbar.classList.remove("md:bg-slate-900", "md:shadow-md");
      navbar.classList.add("md:bg-black/20", "md:backdrop-blur-md");
    }

    // Header Shrink & Positions
    if (scrollY > 700) {
      navContainer?.classList.replace("p-6", "p-3");
      navContainer?.classList.add("sm:p-4");
      if (logo) logo.classList.replace("h-20", "h-12");
      btn?.classList.replace("top-[40px]", "top-[20px]");
      menu?.classList.replace("top-[128px]", "top-[70px]");
    } else {
      navContainer?.classList.replace("p-3", "p-6");
      navContainer?.classList.remove("sm:p-4");
      if (logo) logo.classList.replace("h-12", "h-20");
      btn?.classList.replace("top-[20px]", "top-[40px]");
      menu?.classList.replace("top-[70px]", "top-[128px]");
    }
  });

  // --- OBSERVERS (Animations) ---
  const observerCallback = (entries, revealClass, isGroup = false) => {
    entries.forEach((entry) => {
      const section = entry.target.closest("section");
      const sectionId = section ? section.id : "";
      const repeatableSections = ["home", "about", "get-it-sold"];

      if (entry.isIntersecting) {
        const items = isGroup
          ? entry.target.querySelectorAll(".slide-item")
          : [entry.target];

        items.forEach((item, i) => {
          setTimeout(() => {
            if (item.classList.contains("star-item")) {
              item.style.opacity = "1";
              if (item.classList.contains("last-star")) {
                item.classList.add("last-star-animate");
              } else {
                item.classList.add("star-animate");
              }
            } else {
              item.classList.add(revealClass);
            }
          }, i * 100);
        });
      } else {
        if (isGroup && repeatableSections.includes(sectionId)) {
          entry.target.querySelectorAll(".slide-item").forEach((el) => {
            el.classList.remove(
              revealClass,
              "star-animate",
              "last-star-animate"
            );
            if (el.classList.contains("star-item")) el.style.opacity = "0";
          });
        }
      }
    });
  };

  const slideObserver = new IntersectionObserver(
    (e) => observerCallback(e, "reveal", true),
    { threshold: 0.15 }
  );
  document
    .querySelectorAll(".slide-group")
    .forEach((group) => slideObserver.observe(group));

  const starGroupObserver = new IntersectionObserver(
    (e) => observerCallback(e, "star-animate", true),
    { threshold: 0.5 }
  );
  const starContainer = document.querySelector(".star-container");
  if (starContainer) starGroupObserver.observe(starContainer);

  // --- GALLERY LOGIC (FIXED) ---
  const mainImg = document.getElementById("gallery-main-img");
  const thumbs = document.querySelectorAll(".thumb-button");
  const gOverlay = document.getElementById("gallery-overlay");
  const overlayImg = document.getElementById("gallery-overlay-img");

  // Kunin lahat ng image sources mula sa thumbnails
  const sources = Array.from(thumbs).map((btn) => btn.querySelector("img").src);
  let current = 0;
  let autoplay;

  const updateGallery = (index) => {
    current = (index + sources.length) % sources.length;

    // Smooth Fade Transition
    if (mainImg) mainImg.style.opacity = "0";
    if (overlayImg) overlayImg.style.opacity = "0";

    setTimeout(() => {
      if (mainImg) mainImg.src = sources[current];
      if (overlayImg) overlayImg.src = sources[current];
      if (mainImg) mainImg.style.opacity = "1";
      if (overlayImg) overlayImg.style.opacity = "1";
    }, 200);

    // Update Thumbnail Borders
    thumbs.forEach((btn, i) => {
      btn.classList.toggle("border-amber-500", i === current);
      btn.classList.toggle("border-transparent", i !== current);
    });
  };

  // Click event para sa bawat thumbnail
  thumbs.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      updateGallery(index);
      resetAutoplay();
    });
  });

  // Autoplay Logic
  const startAutoplay = () => {
    if (!autoplay)
      autoplay = setInterval(() => updateGallery(current + 1), 5000);
  };
  const stopAutoplay = () => {
    clearInterval(autoplay);
    autoplay = null;
  };
  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  // Nav Buttons (Desktop & Overlay)
  document.querySelector(".next")?.addEventListener("click", (e) => {
    e.stopPropagation();
    updateGallery(current + 1);
    resetAutoplay();
  });
  document.querySelector(".prev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    updateGallery(current - 1);
    resetAutoplay();
  });

  // Overlay Navigation Buttons
  document.getElementById("overlay-next")?.addEventListener("click", (e) => {
    e.stopPropagation();
    updateGallery(current + 1);
  });
  document.getElementById("overlay-prev")?.addEventListener("click", (e) => {
    e.stopPropagation();
    updateGallery(current - 1);
  });

  // Open Overlay
  mainImg?.addEventListener("click", () => {
    gOverlay?.classList.remove("hidden");
    gOverlay?.classList.add("flex");
    setTimeout(() => gOverlay?.classList.add("opacity-100"), 10);
    stopAutoplay();
  });

  // Close Overlay
  const closeGallery = () => {
    gOverlay?.classList.replace("opacity-100", "opacity-0");
    setTimeout(() => {
      gOverlay?.classList.replace("flex", "hidden");
      startAutoplay();
    }, 300);
  };

  gOverlay?.addEventListener("click", (e) => {
    if (
      e.target.id === "gallery-overlay" ||
      e.target.id === "gallery-overlay-close"
    ) {
      closeGallery();
    }
  });

  startAutoplay();
});
