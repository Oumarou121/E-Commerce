const params = new URLSearchParams(window.location.search);
const newsId = params.get("id") || 0;
const news = blogs[newsId];

document.addEventListener("DOMContentLoaded", function () {
  const errorMessage = document.getElementById("error-content");
  document.getElementById("title").innerText = `${news.name} - Niger.net`;
  document.getElementById("news-name").innerText = news.name;
  document.querySelector(".tag").innerText = news.tag;
  document.querySelector(".article-title").innerText = news.name;
  document.querySelector(
    "#date"
  ).innerHTML = `<i class="far fa-calendar"></i> ${news.date}`;
  document.querySelector(
    "#nbr-comment"
  ).innerHTML = `<i class="uil uil-comment-alt-lines"></i> ${news.reviews.length} comment(s)`;
  document.querySelector(
    ".comment-title"
  ).innerText = `${news.reviews.length} comment(s)`;
  document.querySelector("#p1-image").src = news.paragraphs[0].images[0];
  document.querySelector("#p1-image").alt = news.name;
  document.querySelector("#p1-des").innerText = news.paragraphs[0].description;
  document.querySelector(".importent-title h4").innerText = news.important;

  const articlesList = document.getElementById("article-list");
  for (let index = 1; index < news.paragraphs.length; index++) {
    const article = news.paragraphs[index];
    const articleItem = document.createElement("div");
    articleItem.classList.add("article");
    const imagesContent = document.createElement("div");
    imagesContent.classList.add("images-content");
    article.images.forEach((img) => {
      const image = document.createElement("div");
      image.classList.add("image");
      const imgItem = document.createElement("img");
      imgItem.src = img;
      image.appendChild(imgItem);
      imagesContent.appendChild(image);
      if (article.images.length === 1) {
        image.classList.add("only-one-image");
      }
    });
    const articleContent = document.createElement("p");
    articleContent.innerText = article.description;
    articleItem.appendChild(imagesContent);
    articleItem.appendChild(articleContent);
    articlesList.appendChild(articleItem);
  }

  const reviewsList = document.getElementById("reviews-list");
  news.reviews.forEach((review) => {
    reviewsList.innerHTML += `
    <li>
        <div class="comment-icon">
          <img
            src="//drou-electronics-store.myshopify.com/cdn/shop/t/42/assets/default-user-image_small.png?v=148888795198729825501689877174"
            alt="author"
          />
        </div>
        <div class="comment-content">
          <div class="comnt-author">
            <span class="auth_name">${review.name}</span>
            <span>${review.date}</span>
          </div>
          <p>${review.comment}</p>
        </div>
    </li>  
    `;
  });

  document
    .getElementById("submit-comment")
    .addEventListener("click", function () {
      errorMessage.style.opacity = 0;
      const comment = {
        name: document.getElementById("user-name").value,
        date: new Date().toLocaleDateString(),
        content: document.getElementById("user-comment").value,
      };

      if (!comment.name || !comment.date || !comment.content) {
        errorMessage.style.opacity = 1;
        return;
      }

      errorMessage.style.opacity = 0;
      console.log(comment);
    });
});
