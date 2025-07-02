$(document).ready(function () {
  $(".hero-slider").on("init", function (event, slick) {
    const firstSlide = $(slick.$slides[0]);
    firstSlide.find(".animate-text").each(function (index) {
      const element = $(this);
      setTimeout(() => {
        element.addClass("active");
      }, index * 300);
    });
  });

  $(".hero-slider").slick({
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
          autoplaySpeed: 9000,
        },
      },
    ],
  });

  $(".hero-slider").on("afterChange", function (event, slick, currentSlide) {
    const currentSlideElement = $(slick.$slides[currentSlide]);

    $(".hero-slider-content .animate-text").removeClass("active");

    currentSlideElement.find(".animate-text").each(function (index) {
      const element = $(this);
      setTimeout(() => {
        element.addClass("active");
      }, index * 300);
    });
  });
});

$(document).ready(function () {
  $(".categories-slider").slick({
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
});

function updateCountdown(finalDate) {
  const now = new Date();

  const endDate = new Date(finalDate);

  const timeDiff = endDate - now;

  if (timeDiff <= 0) {
    document.getElementById("countdown-timer").innerHTML =
      "The event has ended!";
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

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

const finalDate = "2025-01-30T00:00:00";

setInterval(function () {
  updateCountdown(finalDate);
}, 1000);

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

function formatPrice(price) {
  if (isNaN(price)) return "Invalid price";
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getLastProducts(products) {
  const lastProducts = products.slice(-5);
  return lastProducts;
}

function getMostSoldProducts(products) {
  const sortedProducts = products.sort((a, b) => b.sales - a.sales);
  const mostSoldProducts = sortedProducts.slice(0, 8);
  return mostSoldProducts;
}

const lastProductsContent = document.getElementById("last-products");
const mostSoldProductsContent = document.getElementById("most-sold-products");

const lastProducts = getLastProducts(products);
const mostSoldProducts = getMostSoldProducts(products);

lastProductsContent.innerHTML = "";
mostSoldProductsContent.innerHTML = "";

lastProducts.forEach((product) => {
  lastProductsContent.innerHTML += creationProduct(product);
});

mostSoldProducts.forEach((product) => {
  mostSoldProductsContent.innerHTML += creationProduct(product);
});
