const blogsContent = document.getElementById("blogs-list");
const blogsPerPage = 4;
let currentPage = 1;
const paginationContainer = document.querySelector(".blogs-pagi ul");
const tagsContent = document.querySelector("#tags-list ul");
let filteredBlogs = [];
const tags = getUniqueTags(blogs);

function displayBlogs(page, blogsToDisplay = blogs) {
  if (!blogsContent) return;
  blogsContent.classList.remove("show");
  setTimeout(() => {
    blogsContent.innerHTML = "";

    let start = (page - 1) * blogsPerPage;
    let end = start + blogsPerPage;
    let paginatedItems = blogsToDisplay.slice(start, end);

    if (paginatedItems.length === 0) {
      blogsContent.innerHTML = `
        <div class="no-results-container">
          <i class="uil uil-search-alt"></i>
          <p>Aucun Article ne correspond aux critères recherchés.</p>
        </div>
      `;
    } else {
      const fragment = document.createDocumentFragment();
      paginatedItems.forEach((blog) => {
        const blogElement = document.createElement("div");
        blogElement.innerHTML = creationBlog(blog);
        fragment.appendChild(blogElement);
      });
      blogsContent.appendChild(fragment);
    }

    blogsContent.classList.add("show");
    window.scrollTo({ top: 0, behavior: "smooth" });

    updatePaginationBlog(page, blogsToDisplay);
  }, 300);
}

function updatePaginationBlog(currentPage, blogsToDisplay) {
  paginationContainer.innerHTML = "";
  let totalPages = Math.ceil(blogsToDisplay.length / blogsPerPage);
  if (totalPages <= 0) return;

  paginationContainer.innerHTML += `
    <li class="${currentPage === 1 ? "disabled" : "prev"}" data-page="${
    currentPage - 1
  }">
      <span><i class="uil uil-angle-double-left"></i></span>
    </li>
  `;

  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.innerHTML += `
        <li class="page-item ${
          i === currentPage ? "active" : ""
        }" data-page="${i}">
          <span>${i}</span>
        </li>
      `;
    }
  } else {
    paginationContainer.innerHTML += `<li class="page-item ${
      currentPage === 1 ? "active" : ""
    }" data-page="1"><span>1</span></li>`;
    if (currentPage > 3)
      paginationContainer.innerHTML += `<li class="dots"><span>...</span></li>`;

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(currentPage + 1, totalPages - 1);
    for (let i = start; i <= end; i++) {
      paginationContainer.innerHTML += `<li class="page-item ${
        i === currentPage ? "active" : ""
      }" data-page="${i}"><span>${i}</span></li>`;
    }

    if (currentPage < totalPages - 2)
      paginationContainer.innerHTML += `<li class="dots"><span>...</span></li>`;
    paginationContainer.innerHTML += `<li class="page-item" data-page="${totalPages}"><span>${totalPages}</span></li>`;
  }

  paginationContainer.innerHTML += `
    <li class="${
      currentPage === totalPages ? "disabled" : "next"
    }" data-page="${currentPage + 1}">
      <span><i class="uil uil-angle-double-right"></i></span>
    </li>
  `;
}

paginationContainer.addEventListener("click", (e) => {
  const item = e.target.closest("li");
  if (!item || item.classList.contains("disabled")) return;

  let newPage = parseInt(item.getAttribute("data-page"));
  if (!isNaN(newPage)) {
    currentPage = newPage;
    displayBlogs(currentPage, filteredBlogs.length ? filteredBlogs : blogs);
  }
});

function applyFilterBlog(value = "", tag = "", isTag = false) {
  const searchValue =
    value && typeof value === "string" ? value.trim().toLowerCase() : null;
  const searchTag =
    tag && typeof tag === "string" ? tag.trim().toLowerCase() : null;

  filteredBlogs = blogs.filter((blog) => {
    const blogName = blog.name ? blog.name.trim().toLowerCase() : "";
    const blogTag = blog.tag ? blog.tag.trim().toLowerCase() : "";

    return isTag
      ? blogTag === searchTag
      : searchValue
      ? blogName.includes(searchValue)
      : true;
  });

  currentPage = 1;
  displayBlogs(currentPage, filteredBlogs);
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

document.getElementById("search-btn").addEventListener("click", () => {
  let valueSearch = document.getElementById("searchBlog").value;
  applyFilterBlog(valueSearch, "", false);
});

document.getElementById("searchBlog").addEventListener(
  "keyup",
  debounce(() => {
    console.log("error");
    let valueSearch = document.getElementById("searchBlog").value;
    applyFilterBlog(valueSearch, "", false);
  }, 300)
);

tags.forEach((tag) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = tag;
  li.appendChild(span);

  li.addEventListener("click", () => {
    tagsContent.querySelectorAll("li span").forEach((otherSpan) => {
      if (span !== otherSpan) {
        otherSpan.classList.remove("active");
      }
    });

    console.log(span.classList.contains("active"));
    if (span.classList.contains("active")) {
      span.classList.remove("active");
      displayBlogs(currentPage);
      console.log("oui");
    } else {
      span.classList.add("active");
      applyFilterBlog("", tag, true);
      console.log("non");
    }
  });

  tagsContent.appendChild(li);
});

displayBlogs(currentPage);
