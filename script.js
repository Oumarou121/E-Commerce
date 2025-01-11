window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader_active");
  if (preloader) {
    preloader.style.transition = "opacity 0.6s ease";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 600); // Correspond à la durée de la transition
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const show = document.getElementById("showMenu");
  const hidden = document.getElementById("hiddenLink");
  const fond = document.getElementById("fond");
  const links = document.getElementById("links-container");

  if (show && fond && links) {
    show.addEventListener("click", () => {
      fond.classList.add("show");
      links.classList.add("show");
      document.body.classList.add("modal-open");
    });

    hidden.addEventListener("click", () => {
      fond.classList.remove("show");
      links.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  }

  document.getElementById("hiddenSearch").addEventListener("click", () => {
    document.getElementById("searchBar").classList.remove("active");
  });

  // Pour afficher la barre :
  document.getElementById("showSearch").addEventListener("click", () => {
    document.getElementById("searchBar").classList.add("active");
  });

  //   document.getElementById("showCart").addEventListener("click", () => {
  //     const content = document.getElementById("ht-dropdown");
  //     content.style.opacity = 1;
  //     content.style.visibility = "visible";
  //     content.style.transform = "scaleY(1)";
  //   });
});

$(document).ready(function () {
  // Initialisation de Slick Slider
  $(".hero-slider-active-2").on("init", function (event, slick) {
    // Activer les animations sur la première diapositive
    const firstSlide = $(slick.$slides[0]);
    firstSlide.find(".animate-text").each(function (index) {
      const element = $(this);
      setTimeout(() => {
        element.addClass("active");
      }, index * 300); // Délai pour chaque élément
    });
  });

  $(".hero-slider-active-2").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: false,
    fade: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          autoplaySpeed: 9000, // Change speed for mobile
        },
      },
    ],
  });

  // Ajouter une animation au changement de diapositive
  $(".hero-slider-active-2").on(
    "afterChange",
    function (event, slick, currentSlide) {
      // Sélectionner la diapositive active
      const currentSlideElement = $(slick.$slides[currentSlide]);

      // Supprimer l'animation de toutes les diapositives
      $(".hero-slider-content .animate-text").removeClass("active");

      // Ajouter l'animation uniquement aux éléments de la diapositive active
      currentSlideElement.find(".animate-text").each(function (index) {
        const element = $(this);
        setTimeout(() => {
          element.addClass("active");
        }, index * 300); // Délai pour chaque élément
      });
    }
  );

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  const handleScroll = debounce(() => {
    const header = document.getElementById("header");
    const headerTop = document.getElementById("headerTop");
    const mediaQuery = window.matchMedia("(min-width: 59rem)");
    if (window.scrollY > 20) {
      header.classList.add("fixed");
      if (mediaQuery.matches) {
        headerTop.style.display = "none";
      }
    } else {
      header.classList.remove("fixed");
      if (mediaQuery.matches) {
        headerTop.style.display = "flex";
      }
    }
  }, 100);

  window.addEventListener("scroll", handleScroll);
});

$(document).ready(function () {
  $(".categories-slider-1").slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
});
