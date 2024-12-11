document.addEventListener("DOMContentLoaded", () => {
  const show = document.getElementById("showNavBar");
  const nav = document.getElementById("navbar");

  if (show && nav) {
    show.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  } else {
    console.error("Navbar or toggle button not found in the DOM.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slider img");
  const prevArrow = document.querySelector(".arrow-left");
  const nextArrow = document.querySelector(".arrow-right");
  const indicators = document.querySelectorAll(".indicators button");

  let currentIndex = 0;

  // Met à jour la visibilité des slides
  const updateSlider = () => {
    // Réinitialise toutes les images et indicateurs
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });

    indicators.forEach((button, index) => {
      button.classList.toggle("active", index === currentIndex);
    });
  };

  // Montre la slide précédente
  const showPrevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  };

  // Montre la slide suivante
  const showNextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  };

  // Ajout des événements aux flèches
  prevArrow.addEventListener("click", showPrevSlide);
  nextArrow.addEventListener("click", showNextSlide);

  // Ajout des événements aux indicateurs
  indicators.forEach((button, index) => {
    button.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
  });

  // Défilement automatique toutes les 5 secondes
  setInterval(showNextSlide, 5000);

  // Détection du défilement de la souris
  const sliderContainer = document.querySelector(".slider-container");
  sliderContainer.addEventListener("wheel", (event) => {
    if (event.deltaY > 0) {
      showNextSlide(); // Défilement vers le bas (slide suivante)
    } else {
      showPrevSlide(); // Défilement vers le haut (slide précédente)
    }
  });

  // Initialisation
  updateSlider();
});

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slider img");
  const prevArrow = document.querySelector(".arrow-left");
  const nextArrow = document.querySelector(".arrow-right");
  const indicators = document.querySelectorAll(".indicators button");

  let currentIndex = 0;
  let touchStartX = 0; // Position de départ du touch
  let touchEndX = 0; // Position de fin du touch

  // Met à jour la visibilité des slides
  const updateSlider = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });

    indicators.forEach((button, index) => {
      button.classList.toggle("active", index === currentIndex);
    });
  };

  // Montre la slide précédente
  const showPrevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  };

  // Montre la slide suivante
  const showNextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  };

  // Ajout des événements aux flèches
  prevArrow.addEventListener("click", showPrevSlide);
  nextArrow.addEventListener("click", showNextSlide);

  // Ajout des événements aux indicateurs
  indicators.forEach((button, index) => {
    button.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
  });

  // Défilement automatique toutes les 5 secondes
  setInterval(showNextSlide, 5000);

  // Gestion du swipe pour les appareils mobiles
  const sliderContainer = document.querySelector(".slider-container");

  sliderContainer.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX; // Position initiale du touch
  });

  sliderContainer.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX; // Position finale du touch

    // Vérifier la direction du swipe
    if (touchStartX - touchEndX > 50) {
      showNextSlide(); // Swipe à gauche (slide suivante)
    } else if (touchEndX - touchStartX > 50) {
      showPrevSlide(); // Swipe à droite (slide précédente)
    }
  });

  // Initialisation
  updateSlider();
});

document.addEventListener("DOMContentLoaded", () => {
  const slider1 = document.getElementById("slider1");

  if (slider1) {
    // Dupliquer les logos pour une transition infinie fluide
    const duplicateContent = slider1.innerHTML;
    slider1.innerHTML += duplicateContent;
  } else {
    console.error("Element #slider1 not found!");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Fonction pour gérer le changement de position du header au scroll
  window.onscroll = function () {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
      header.classList.add("fixed"); // Ajouter la classe 'fixed' au scroll
    } else {
      header.classList.remove("fixed"); // Retirer la classe quand on revient tout en haut
    }
  };

  // const slider = document.getElementById("slider1");
  // const prevBtn = document.querySelector(".prev-btn");
  // const nextBtn = document.querySelector(".next-btn");

  // prevBtn.addEventListener("click", () => {
  //   slider.scrollLeft -= 150; // Défiler vers la gauche
  // });

  // nextBtn.addEventListener("click", () => {
  //   slider.scrollLeft += 150; // Défiler vers la droite
  // });
});

$(document).ready(function () {
  $("#slider1").slick({
    slidesToShow: 5, // Nombre d'éléments visibles
    slidesToScroll: 1, // Nombre d'éléments à faire défiler
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false, // Supprime les flèches
    dots: false, // Pas de pagination
    infinite: true, // Boucle infinie
  });
});
