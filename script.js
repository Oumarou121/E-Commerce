$(document).ready(function () {
  $(".slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false,
    arrows: false, // Désactive les flèches Slick par défaut
    fade: true, // Ajoute un effet de fondu au lieu du glissement
    speed: 1000, // Durée de la transition
    pauseOnHover: true, // Pause l'auto-défilement au survol
    swipe: true, // Active le glissement avec la souris
    touchMove: true, // Permet le glissement tactile sur mobile
    swipeToSlide: true, // Permet de glisser directement vers un élément spécifique
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  // Ajout des flèches de navigation manuelles
  $(".prev").click(function () {
    $(".categories-slider").slick("slickPrev");
  });

  $(".next").click(function () {
    $(".categories-slider").slick("slickNext");
  });
});

$(document).ready(function () {
  $("#slider1").slick({
    slidesToShow: 7, // Affiche 7 images sur grand écran
    slidesToScroll: 1, // Défile 1 image à la fois
    autoplay: true, // Active le défilement automatique
    autoplaySpeed: 5000, // Intervalle de défilement (en ms)
    infinite: true, // Rend le défilement infini
    arrows: false, // Désactive les flèches
    dots: false, // Pas de points de navigation
    responsive: [
      {
        breakpoint: 1024, // Pour les écrans < 1024px
        settings: {
          slidesToShow: 4, // Affiche 4 images
        },
      },
      {
        breakpoint: 768, // Pour les écrans < 768px
        settings: {
          slidesToShow: 2, // Affiche 2 images
        },
      },
    ],
  });
});

$(document).ready(function () {
  $(".categories-slider").slick({
    slidesToShow: 4, // 4 images affichées sur desktop
    slidesToScroll: 1, // Défilement de 1 image à la fois
    autoplay: true, // Active le défilement automatique
    autoplaySpeed: 3000, // Intervalle de défilement (en ms)
    dots: false, // Affiche les points de navigation
    arrows: false, // Affiche les flèches de navigation
    responsive: [
      {
        breakpoint: 1024, // Pour les écrans < 1024px (tablette)
        settings: {
          slidesToShow: 2, // Affiche 2 images
        },
      },
      {
        breakpoint: 768, // Pour les écrans < 768px (mobile)
        settings: {
          slidesToShow: 1, // Affiche 1 image
        },
      },
    ],
  });
});

$(document).ready(function () {
  $(".categories-slider2").slick({
    slidesToShow: 4, // 4 images affichées sur desktop
    slidesToScroll: 1, // Défilement de 1 image à la fois
    autoplay: true, // Active le défilement automatique
    autoplaySpeed: 3000, // Intervalle de défilement (en ms)
    dots: false, // Affiche les points de navigation
    arrows: false, // Affiche les flèches de navigation
    responsive: [
      {
        breakpoint: 1024, // Pour les écrans < 1024px (tablette)
        settings: {
          slidesToShow: 2, // Affiche 2 images
        },
      },
      {
        breakpoint: 768, // Pour les écrans < 768px (mobile)
        settings: {
          slidesToShow: 1, // Affiche 1 image
        },
      },
    ],
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const show = document.getElementById("showNavBar");
  const nav = document.getElementById("navbar");
  const cat = document.getElementById("links-container");
  const hid = document.getElementById("hiddenLink");
  const fond = document.getElementById("fond");

  if (show && nav) {
    show.addEventListener("click", () => {
      nav.classList.toggle("show");
    });

    if (window.matchMedia("(max-width: 39rem)").matches) {
      show.addEventListener("click", () => {
        document.body.classList.add("modal-open");
        cat.classList.toggle("show");
        fond.classList.add("show");
      });
    }

    hid.addEventListener("click", () => {
      cat.classList.toggle("show");
      document.body.classList.remove("modal-open");
      fond.classList.remove("show");
    });
  } else {
    console.error("Navbar or toggle button not found in the DOM.");
  }

  // // Fonction pour gérer le changement de position du header au scroll
  // window.onscroll = function () {
  //   const header = document.getElementById("header");
  //   if (window.scrollY > 0) {
  //     header.classList.add("fixed"); // Ajouter la classe 'fixed' au scroll
  //   } else {
  //     header.classList.remove("fixed"); // Retirer la classe quand on revient tout en haut
  //   }
  // };

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
    if (window.scrollY > 50) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }
  }, 100);

  window.addEventListener("scroll", handleScroll);
});
