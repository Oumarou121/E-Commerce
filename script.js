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

// const slider1 = document.querySelector("#glide1");
// if (slider1) {
//   new Glide(slider1, {
//     type: "carousel",
//     startAt: 0,
//     autoplay: 3000,
//     gap: 0,
//     hoverpause: true,
//     perView: 1,
//     animationDuration: 800,
//     animationTimingFunc: "linear", // Correction ici
//   }).mount();
// }

$(document).ready(function () {
  // Initialisation de Slick Slider
  $(".hero-slider-active-2").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
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

  // Activer les animations sur la première diapositive
  $(".hero-slider-active-2").trigger("afterChange", [null, 0]);
});
