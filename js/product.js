const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "";
const product = products[productId];

function updateQuantity(change) {
  const input = document.querySelector(".quantity input");
  let value = parseInt(input.value) + change;
  value = Math.max(1, Math.min(product.qty, value));
  input.value = value;
}

document.addEventListener("DOMContentLoaded", function () {
  const productPhoto = document.getElementById("ProductPhoto");
  const scrollContainer = document.querySelector(".carousel-container");
  const scrollLeft = document.getElementById("scroll-left");
  const scrollRight = document.getElementById("scroll-right");
  const thumbnailList = document.getElementById("thumbnail-list");
  document.getElementById(
    "qty-left"
  ).innerText = `${product.qty} left in stock`;
  document.querySelector(".stock_progress_bar").style.width =
    (product.qty / (product.sales + product.qty)) * 100 + "%";
  document.querySelector(".product-ref").innerText = product.reference;
  document.getElementById("productPrice").innerText = `${formatPrice(
    product.getPrice()
  )} FCFA`;
  document.getElementById("lastProductPrice").innerText = `${formatPrice(
    product.price
  )} FCFA`;
  document.getElementById("previewPrice").innerText =
    product.reductionType === "percentage"
      ? `-${product.priceReduction}%`
      : product.priceReduction > 0
      ? `-${formatPrice(product.priceReduction)} FCFA`
      : "";

  function hiddenArrow() {
    scrollLeft.style.display = "none";
    scrollRight.style.display = "none";
  }

  if (window.innerWidth <= 576) {
    product.images.length <= 1 ? hiddenArrow() : null;
  } else if (window.innerWidth <= 992) {
    product.images.length <= 2 ? hiddenArrow() : null;
  } else {
    product.images.length <= 3 ? hiddenArrow() : null;
  }

  document.getElementById("productName").innerText = product.name;
  document.getElementById("productName1").innerText = product.name;
  document.getElementById("title").innerText = `${product.name} - Niger.net`;
  productPhoto.src = product.images[0];

  product.images.forEach((image, index) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = image;
    img.classList.add("thumbnail");
    index === 0 ? img.classList.add("active") : null;
    li.appendChild(img);
    thumbnailList.appendChild(li);

    img.addEventListener("click", changeImage);
  });

  const thumbnails = document.querySelectorAll(".thumbnail");
  const thumbnailWidth = thumbnails[0].offsetWidth + 10;

  function changeImage(event) {
    const newSrc = event.target.src;

    productPhoto.style.opacity = "0";
    setTimeout(() => {
      productPhoto.src = newSrc;
      productPhoto.setAttribute("data-zoom-image", newSrc);
      productPhoto.style.opacity = "1";
    }, 300);

    thumbnails.forEach((thumb) => thumb.classList.remove("active"));
    event.target.classList.add("active");
  }

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", changeImage);
  });

  scrollLeft.addEventListener("click", function () {
    scrollContainer.scrollBy({ left: -thumbnailWidth, behavior: "smooth" });
  });

  scrollRight.addEventListener("click", function () {
    scrollContainer.scrollBy({ left: thumbnailWidth, behavior: "smooth" });
  });

  const navLinks = document.querySelectorAll(".bar-nav li");
  const tabContents = document.querySelectorAll(".tab-content");

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", async function () {
      if (!this.classList.contains("active")) {
        navLinks.forEach((nav) => nav.classList.remove("active"));

        tabContents.forEach((content) => (content.style.opacity = 0));
        await delay(250);

        tabContents.forEach((content) => (content.style.display = "none"));

        this.classList.add("active");

        const contentId = this.getAttribute("data-tab");
        const targetContent = document.getElementById(contentId);

        if (targetContent) {
          targetContent.style.display = "block";
          await delay(50);
          targetContent.style.opacity = 1;
        }
      }
    });
  });

  const specsTable = document.getElementById("specs-table");
  specsTable.innerHTML = "";
  for (const [key, value] of Object.entries(product.specs || {})) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${key}</td><td>${value}</td>`;
    specsTable.appendChild(row);
  }

  const reviewsSection = document.getElementById("reviews-section");
  const stars = document.querySelectorAll(".star");
  const submitReview = document.getElementById("submit-review");

  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      selectedRating = parseInt(this.getAttribute("data-value"));
      stars.forEach((s, index) => {
        s.classList.toggle("active", index < selectedRating);
      });
    });
  });

  submitReview.addEventListener("click", function () {
    const review = {
      name: document.getElementById("user-name").value,
      rating: selectedRating,
      date: new Date().toLocaleDateString(),
      content: document.getElementById("user-review").value,
    };

    if (!review.name || !review.rating || !review.date || !review.content) {
      document.getElementById("error-content").style.opacity = 1;
      return;
    }

    console.log(review);
    alert(review.name + review.rating + review.date + review.content);

    displayReviews();
    selectedRating = 0;
    stars.forEach((s) => s.classList.remove("active"));
  });

  function displayReviews() {
    if (!product || !product.reviews) {
      console.error("Les avis du produit sont introuvables.");
      return;
    }

    let reviews = [...product.reviews];
    const progress = document.querySelectorAll(".rating-bars progress");
    reviews = reviews.sort((a, b) => b.rating - a.rating);
    progress.forEach((progressBar, index) => {
      let nbr = 0;
      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].rating === 5 - index) {
          nbr++;
        }
      }
      progressBar.value = nbr === 0 ? "0" : (nbr / reviews.length) * 100;
    });

    let totalReviews = reviews.length;
    let averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : "0";

    const averageRatingContent = document.getElementById(
      "average-rating-stars"
    );

    let fullStars = Math.floor(averageRating);
    let partialStar1 = averageRating - fullStars;
    let emptyStars = Math.floor(5 - fullStars - partialStar1);
    let partialStar2 = 1 - partialStar1;

    averageRatingContent.innerHTML = `
  ${'<span class="star-bars active">★</span>'.repeat(fullStars)}
  ${partialStar1 > 0 ? '<span class="star-bars active partial">★</span>' : ""}
  ${'<span class="star-bars">★</span>'.repeat(emptyStars)}
`;

    if (partialStar1 > 0) {
      document.querySelector(
        ".star-bars.active.partial"
      ).style.background = `linear-gradient(to right, gold ${
        partialStar1 * 100
      }%, #ccc ${partialStar2 * 100}%)`;
    }

    document.getElementById("average-rating").textContent = averageRating;
    document.getElementById(
      "total-reviews"
    ).textContent = `${totalReviews} review(s)`;

    if (totalReviews === 0) {
      reviewsSection.innerHTML = `<p class="no-reviews">Aucun avis pour le moment.</p>`;
      return;
    }

    reviewsSection.innerHTML = reviews
      .map((review) => {
        let rating = Math.max(0, Math.min(5, review.rating));

        return `
        <div class="review">
          <div class="review-header">
            <div class="header-left">
              <span class="user-name">${review.name}</span>
              <span class="date">${review.date}</span>
            </div>
            <div class="header-right">
              ${'<span class="star-bars active">★</span>'.repeat(rating)}
              ${'<span class="star-bars">★</span>'.repeat(5 - rating)}
            </div>
          </div>
          <p>${review.comment}</p>
        </div>
      `;
      })
      .join("");
  }

  displayReviews();

  const similarsProductsContent = document.getElementById("similars-products");
  const similarProducts = productManager.findMostSimilarProducts(product);
  console.log(similarProducts);

  similarsProductsContent.innerHTML = "";

  similarProducts.forEach((product) => {
    similarsProductsContent.innerHTML += creationProduct(product);
  });
});
