document.addEventListener("DOMContentLoaded", function () {
  const wishlistContent = document.getElementById("wishlist-products");
  let wishlist = products.slice(-5);
  wishlistContent.innerHTML = "";

  if (wishlist.length > 0) {
    wishlist.forEach((product) => {
      wishlistContent.innerHTML += creationWishItem(product);
    });
  } else {
    wishlistContent.innerHTML = `
    <div class="no-results-container">
        <i class="uil uil-heart-alt"></i>
        <p>Your wishlist is empty. <a href="shop.html"> continue shopping</a></p>
    </div>
    `;
  }
});
