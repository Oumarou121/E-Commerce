const filtresContent = document.getElementById("filter-container");
const filtresContentDesktop = document.getElementById(
  "filter-containerDesktop"
);
const clearAllBtn = document.getElementById("clearAllFilters");
const clearAllBtnDesktop = document.getElementById("clearAllDesktop");
const selectedFilters = document.querySelector(".selectedFilters");
const selectedFiltersDesktop = document.querySelector(
  ".selectedFilters-desktop"
);

const selectedFiltersClass = document.querySelector(".selectedFilters");
const selectedFiltersClassDesktop = document.querySelector(
  ".selectedFilters-desktop"
);

document.addEventListener("DOMContentLoaded", function () {
  const breadcrumbContainer = document.querySelector(
    ".shop-feature .custom-container"
  );

  function updateBreadcrumb(categoryPath) {
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = "";

      const paths = ["Home", "Shop", ...categoryPath.split("/")].filter(
        Boolean
      );

      paths.forEach((path, index) => {
        const isLast = index === paths.length - 1;
        const a = document.createElement("a");
        a.textContent = path;

        if (!isLast) {
          if (index === 0) {
            a.href = "index.html";
          } else if (index === 1) {
            a.href = "shop.html";
          } else {
            a.href = `shop.html?category=${paths
              .slice(2, index + 1)
              .join("/")}`;
          }
        } else {
          a.classList.add("text-red");
        }

        breadcrumbContainer.appendChild(a);
        if (!isLast) breadcrumbContainer.innerHTML += " <span>|</span> ";
      });
    }
  }

  function loadCategory() {
    const params = new URLSearchParams(window.location.search);
    const categoryPath = params.get("category") || "";
    updateBreadcrumb(categoryPath);
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("query");
    if (searchQuery) {
      document.querySelector(".searchInput").value = searchQuery;
      applyFilter(null, categoryPath, true, true, searchQuery);
    } else {
      applyFilter(null, categoryPath, true);
    }
    const categoryPath1 = getCurrentCategoryPath();
    const currentCategory = findCategory(
      filtres.generateFilters(),
      categoryPath1
    );

    parcoursCategory(currentCategory);
  }

  loadCategory();
});

function getCurrentCategoryPath() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") ? params.get("category").split("/") : [];
}

function findCategory(categories, path) {
  let currentCategories = categories;
  let foundCategory = null;

  for (let segment of path) {
    foundCategory = currentCategories.find((cat) => cat.name === segment);
    if (!foundCategory) return null;
    currentCategories = foundCategory.getSubCategory();
  }

  return foundCategory;
}

function parcoursCategory(category) {
  if (category) {
    category.getOptions().forEach((option) => {
      addOptionsToDisplay(option);
    });

    category.getSubCategory().forEach((subCategory) => {
      parcoursCategory(subCategory);
    });
  }
}

function addOptionsToDisplay(option) {
  let isOld = false;
  filtresContent.querySelectorAll(".categories").forEach((category, index) => {
    if (
      category.querySelector(".filtre-top h3").textContent === option.getTitle()
    ) {
      option.getValues().forEach((value) => {
        const listItem = document.createElement("li");
        const listItemDesktop = document.createElement("li");

        const optionCheckbox = document.createElement("input");
        optionCheckbox.type = "checkbox";
        optionCheckbox.name = option.getTitle();
        const optionCheckboxDesktop = document.createElement("input");
        optionCheckboxDesktop.type = "checkbox";
        optionCheckboxDesktop.name = option.getTitle();

        const optionLabel = document.createElement("span");
        optionLabel.textContent = ` ${value}`;
        const optionLabelDesktop = document.createElement("span");
        optionLabelDesktop.textContent = ` ${value}`;
        optionCheckbox.addEventListener("change", () => {
          optionCheckboxDesktop.checked = optionCheckbox.checked;
          createItemy(
            optionCheckbox,
            optionCheckboxDesktop,
            option.getTitle(),
            value
          );
        });

        optionCheckboxDesktop.addEventListener("change", () => {
          optionCheckbox.checked = optionCheckboxDesktop.checked;
          createItemy(
            optionCheckbox,
            optionCheckboxDesktop,
            option.getTitle(),
            value
          );
        });

        listItem.appendChild(optionCheckbox);
        listItem.appendChild(optionLabel);
        listItemDesktop.appendChild(optionCheckboxDesktop);
        listItemDesktop.appendChild(optionLabelDesktop);
        category.querySelector(".filter-content ul").appendChild(listItem);
        filtresContentDesktop
          .querySelectorAll(".categories")
          [index].querySelector(".filter-content ul")
          .appendChild(listItemDesktop);
        isOld = true;
      });
    }
  });

  if (!isOld) {
    const optionSection = document.createElement("div");
    optionSection.classList.add("categories");
    const optionSectionDesktop = document.createElement("div");
    optionSectionDesktop.classList.add("categories");

    const optionTitleDiv = document.createElement("div");
    optionTitleDiv.classList.add("filtre-top");
    const optionTitleDivDesktop = document.createElement("div");
    optionTitleDivDesktop.classList.add("filtre-top");

    const optionTitle = document.createElement("h3");
    optionTitle.textContent = option.getTitle();
    optionTitleDiv.appendChild(optionTitle);
    const optionTitleDesktop = document.createElement("h3");
    optionTitleDesktop.textContent = option.getTitle();
    optionTitleDivDesktop.appendChild(optionTitleDesktop);

    const optionIcon = document.createElement("i");
    optionIcon.classList.add("uil", "icon-arrow", "uil-angle-down");
    optionTitleDiv.appendChild(optionIcon);
    optionTitleDiv.addEventListener("click", () => {
      const contentDiv = optionSection.querySelector(".filter-content");
      contentDiv.classList.toggle("visible");
      optionIcon.classList.toggle("rotated");
    });
    optionSection.appendChild(optionTitleDiv);
    optionSectionDesktop.appendChild(optionTitleDivDesktop);

    const optionContentDiv = document.createElement("div");
    optionContentDiv.classList.add("filter-content");
    const optionContentDivDesktop = document.createElement("div");
    optionContentDivDesktop.classList.add("filter-content");

    const optionList = document.createElement("ul");
    const optionListDesktop = document.createElement("ul");

    option.getValues().forEach((value) => {
      const listItem = document.createElement("li");
      const listItemDesktop = document.createElement("li");

      const optionCheckbox = document.createElement("input");
      optionCheckbox.type = "checkbox";
      optionCheckbox.name = option.getTitle();
      const optionCheckboxDesktop = document.createElement("input");
      optionCheckboxDesktop.type = "checkbox";
      optionCheckboxDesktop.name = option.getTitle();

      const optionLabel = document.createElement("span");
      optionLabel.textContent = ` ${value}`;
      const optionLabelDesktop = document.createElement("span");
      optionLabelDesktop.textContent = ` ${value}`;
      optionCheckbox.addEventListener("change", () => {
        optionCheckboxDesktop.checked = optionCheckbox.checked;
        createItemy(
          optionCheckbox,
          optionCheckboxDesktop,
          option.getTitle(),
          value
        );
      });
      optionCheckboxDesktop.addEventListener("change", () => {
        optionCheckbox.checked = optionCheckboxDesktop.checked;
        createItemy(
          optionCheckbox,
          optionCheckboxDesktop,
          option.getTitle(),
          value
        );
      });

      listItem.appendChild(optionCheckbox);
      listItem.appendChild(optionLabel);
      optionList.appendChild(listItem);
      listItemDesktop.appendChild(optionCheckboxDesktop);
      listItemDesktop.appendChild(optionLabelDesktop);
      optionListDesktop.appendChild(listItemDesktop);
    });

    optionContentDiv.appendChild(optionList);
    optionSection.appendChild(optionContentDiv);
    optionContentDivDesktop.appendChild(optionListDesktop);
    optionSectionDesktop.appendChild(optionContentDivDesktop);

    const hr = document.createElement("hr");
    hr.classList.add("custom-hr");
    optionSection.appendChild(hr);
    const hrDesktop = document.createElement("hr");
    hrDesktop.classList.add("custom-hr");
    optionSectionDesktop.appendChild(hrDesktop);

    filtresContent.appendChild(optionSection);
    filtresContentDesktop.appendChild(optionSectionDesktop);
  }
}

function createItemy(optionCheckbox, optionCheckboxDesktop, title, value) {
  if (optionCheckbox.checked && optionCheckboxDesktop.checked) {
    const filterItem = document.createElement("div");
    const filterItemDesktop = document.createElement("div");

    filterItem.classList.add("filtre-item");
    filterItem.textContent = `${title}  - ${value}`;
    filterItemDesktop.classList.add("filtre-item-desktop");
    filterItemDesktop.textContent = `${title}  - ${value}`;

    const removeBtn = document.createElement("i");
    removeBtn.classList.add("uil", "uil-times");
    const removeBtnDesktop = document.createElement("i");
    removeBtnDesktop.classList.add("uil", "uil-times");

    removeBtn.addEventListener("click", () => {
      filterItem.remove();
      filterItemDesktop.remove();
      optionCheckbox.checked = false;
      optionCheckboxDesktop.checked = false;
      applyFilterOther();
    });
    removeBtnDesktop.addEventListener("click", () => {
      filterItem.remove();
      filterItemDesktop.remove();
      optionCheckbox.checked = false;
      optionCheckboxDesktop.checked = false;
      applyFilterOther();
    });

    filterItem.appendChild(removeBtn);
    filterItemDesktop.appendChild(removeBtnDesktop);

    selectedFiltersClass.appendChild(filterItem);
    selectedFiltersClassDesktop.appendChild(filterItemDesktop);

    optionCheckbox.filterItem = filterItem;
    optionCheckboxDesktop.filterItem = filterItemDesktop;
  } else {
    optionCheckbox.filterItem.remove();
    optionCheckboxDesktop.filterItem.remove();
  }

  applyFilterOther();
}

// ===============================================================================================
const priceGap = 5000;

function syncPriceFilters(min, max) {
  [false, true].forEach((isDesktop) => {
    updatePriceFilter(min, max, isDesktop);
    updateInputsAndSliders(min, max, isDesktop);
    if (min === 2500 && max === 500000) {
      resetFilters();
    }
  });
}

function updateInputsAndSliders(min, max, isDesktop) {
  const rangeInputs = document.querySelectorAll(
    isDesktop ? ".range-input-desktop input" : ".range-input input"
  );
  const priceInputs = document.querySelectorAll(
    isDesktop ? ".price-input-desktop input" : ".price-input input"
  );
  const range = document.querySelector(
    isDesktop ? ".slider-desktop .progress" : ".slider .progress"
  );

  rangeInputs[0].value = min;
  rangeInputs[1].value = max;
  priceInputs[0].value = min;
  priceInputs[1].value = max;

  range.style.left = (min / rangeInputs[0].max) * 100 + "%";
  range.style.right = 100 - (max / rangeInputs[1].max) * 100 + "%";
}

function setupPriceInputsAndSliders(isDesktop = false) {
  const rangeInputs = document.querySelectorAll(
    isDesktop ? ".range-input-desktop input" : ".range-input input"
  );
  const priceInputs = document.querySelectorAll(
    isDesktop ? ".price-input-desktop input" : ".price-input input"
  );

  priceInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      let minPrice = parseInt(priceInputs[0].value),
        maxPrice = parseInt(priceInputs[1].value);

      if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInputs[1].max) {
        rangeInputs[0].value = minPrice;
        rangeInputs[1].value = maxPrice;
        syncPriceFilters(minPrice, maxPrice);
      }
    });
  });

  rangeInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      let minVal = parseInt(rangeInputs[0].value),
        maxVal = parseInt(rangeInputs[1].value);

      if (maxVal - minVal < priceGap) {
        rangeInputs[index].value =
          index === 0 ? maxVal - priceGap : minVal + priceGap;
      }
      syncPriceFilters(rangeInputs[0].value, rangeInputs[1].value);
    });
  });
}

function updatePriceFilter(min, max, isDesktop) {
  const filterClass = isDesktop
    ? ".filtre-item-desktop.price"
    : ".filtre-item.price";
  const selectedFiltersClass = isDesktop
    ? ".selectedFilters-desktop"
    : ".selectedFilters";

  let priceFilterItem = document.querySelector(filterClass);

  if (!priceFilterItem) {
    priceFilterItem = document.createElement("div");
    priceFilterItem.classList.add(
      isDesktop ? "filtre-item-desktop" : "filtre-item",
      "price"
    );

    const filterContent = document.createElement("span");
    filterContent.classList.add(
      isDesktop ? "filter-content-desktop" : "filter-content1"
    );

    const removeBtn = document.createElement("i");
    removeBtn.classList.add("uil", "uil-times");
    removeBtn.style.cursor = "pointer";
    removeBtn.addEventListener("click", () => {
      resetFilters();
    });

    priceFilterItem.appendChild(filterContent);
    priceFilterItem.appendChild(removeBtn);

    isDesktop
      ? selectedFiltersDesktop.appendChild(priceFilterItem)
      : selectedFilters.appendChild(priceFilterItem);
  }

  const filterContent = priceFilterItem.querySelector(
    isDesktop ? ".filter-content-desktop" : ".filter-content1"
  );
  filterContent.textContent = `Prix - ${min} - ${max} FCFA`;
  applyFilterOther();
}

function resetFilters() {
  [false, true].forEach((isDesktop) => {
    const rangeInputs = document.querySelectorAll(
      isDesktop ? ".range-input-desktop input" : ".range-input input"
    );
    const priceInputs = document.querySelectorAll(
      isDesktop ? ".price-input-desktop input" : ".price-input input"
    );
    rangeInputs[0].value = rangeInputs[0].min;
    rangeInputs[1].value = rangeInputs[1].max;
    priceInputs[0].value = rangeInputs[0].min;
    priceInputs[1].value = rangeInputs[1].max;
    updateInputsAndSliders(rangeInputs[0].min, rangeInputs[1].max, isDesktop);

    const filterItem = document.querySelector(
      isDesktop ? ".filtre-item-desktop.price" : ".filtre-item.price"
    );
    if (filterItem) filterItem.remove();
  });
}

// Initialisation pour les deux versions
setupPriceInputsAndSliders(false);
setupPriceInputsAndSliders(true);

// ================================================================================================

function clearAllFilters() {
  resetFilters();
  selectedFilters
    .querySelectorAll(".filtre-item")
    .forEach((item) => item.remove());
  filtresContent.querySelectorAll('[type="checkbox"]').forEach((input) => {
    input.checked ? (input.checked = false) : null;
  });

  selectedFiltersDesktop
    .querySelectorAll(".filtre-item-desktop")
    .forEach((item) => item.remove());
  console.log(filtresContentDesktop);
  filtresContentDesktop
    .querySelectorAll('[type="checkbox"]')
    .forEach((input) => {
      input.checked ? (input.checked = false) : null;
    });
  applyFilterOther();
}

function applyFilterOther() {
  const container = document.querySelector(".selectedFilters-desktop");
  let filters = {};

  container.querySelectorAll(".filtre-item-desktop").forEach((filtre) => {
    let [key, ...values] = filtre.textContent.split(" -").map((v) => v.trim());
    // filters[key] = values.length > 1 ? values : values[0];
    if (!filters[key]) {
      filters[key] = [];
    }
    filters[key].push(...values);
  });

  console.log("Filtres appliqués :", filters);
  applyFilter(filters);
}
