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
    autoplaySpeed: 10000,
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
    const scrollUp = document.getElementById("scrollUp");
    const headerTop = document.getElementById("headerTop");
    const mediaQuery = window.matchMedia("(min-width: 59rem)");
    if (window.scrollY > 20) {
      header.classList.add("fixed");
      scrollUp.classList.add("show");
      if (mediaQuery.matches) {
        headerTop.style.display = "none";
      }
    } else {
      header.classList.remove("fixed");
      scrollUp.classList.remove("show");
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

$(document).ready(function () {
  $(".events-slider").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    dots: false,
    prevArrow: $(".custom-events-prev"),
    nextArrow: $(".custom-events-next"),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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

$(document).ready(function () {
  $(".products-slider").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    dots: false,
    prevArrow: $(".custom-prev"),
    nextArrow: $(".custom-next"),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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

  // Ajuster uniquement les slides de .products-slider
  $(".products-slider .slick-slide").css("display", "flex");

  // Fonction pour ajuster les hauteurs
  function equalizeHeights() {
    let maxHeight = 0;

    // Réinitialiser la hauteur pour recalculer
    $(".products-slider .product-plr-1").css("height", "auto");

    // Trouver la hauteur maximale
    $(".products-slider .product-plr-1").each(function () {
      const currentHeight = $(this).outerHeight();
      if (currentHeight > maxHeight) {
        maxHeight = currentHeight;
      }
    });

    // Appliquer la hauteur maximale
    $(".products-slider .product-plr-1").css("height", maxHeight + "px");
  }

  // Synchroniser les hauteurs après initialisation
  $(".products-slider").on("setPosition", function () {
    equalizeHeights();
  });

  // Appel initial
  equalizeHeights();
});

function AddToCart() {
  const AddCart = document.getElementById("modalAddToCart");
  if (AddCart.classList.contains("show")) {
    AddCart.classList.remove("show");
    document.body.classList.remove("modal-open");
  } else {
    AddCart.classList.add("show");
    document.body.classList.add("modal-open");
  }
}

function AddToWish(button) {
  const icon = button.querySelector("i");
  if (icon.classList.contains("uil-heart")) {
    // Change l'icône en spinner
    icon.classList.remove("uil-heart");
    icon.classList.add("uil-spinner-alt", "rotateIn");

    // Simule un chargement avant de restaurer l'icône
    setTimeout(() => {
      icon.classList.remove("uil-spinner-alt", "rotateIn");
      icon.classList.add("uil-heart");
    }, 2000); // 2 secondes
  }
}

function Compare() {
  const compare = document.getElementById("modalCompare");
  compare.classList.toggle("show");
}

function updateCountdown(finalDate) {
  // Récupérer la date actuelle
  const now = new Date();

  // Convertir la date finale en objet Date
  const endDate = new Date(finalDate);

  // Calculer la différence entre la date finale et la date actuelle
  const timeDiff = endDate - now;

  // Vérifier si la date finale est dans le futur
  if (timeDiff <= 0) {
    document.getElementById("countdown-timer").innerHTML =
      "The event has ended!";
    return;
  }

  // Calculer le temps restant en jours, heures, minutes et secondes
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  // Mettre à jour les éléments HTML avec les valeurs calculées
  document.getElementById("days").textContent = days
    .toString()
    .padStart(2, "0");
  document.getElementById("hours").textContent = hours
    .toString()
    .padStart(2, "0");
  document.getElementById("minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

// Exemple d'utilisation avec la date finale
const finalDate = "2025-01-30T00:00:00"; // Exemple de date finale

// Mettre à jour le compte à rebours toutes les secondes
setInterval(function () {
  updateCountdown(finalDate);
}, 1000);
