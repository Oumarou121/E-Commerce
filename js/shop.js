// Fonction pour basculer le statut de favori
document.querySelectorAll('.icon-heart').forEach(icon => {
    const productId = icon.dataset.id;

    // Vérifier si le produit est déjà marqué comme favori dans localStorage
    if (localStorage.getItem(`fav-product-${productId}`) === 'true') {
        icon.classList.add('active', 'bi-heart-fill');
        icon.classList.remove('bi-heart');
    }

    icon.addEventListener('click', function() {
        // Basculer entre favori et non-favori
        if (icon.classList.contains('bi-heart')) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'active');
            localStorage.setItem(`fav-product-${productId}`, 'true');
        } else {
            icon.classList.remove('bi-heart-fill', 'active');
            icon.classList.add('bi-heart');
            localStorage.setItem(`fav-product-${productId}`, 'false');
        }
    });
});

// ==================================================================================================================


// Ajouter un événement de clic pour changer le content du span
document.querySelectorAll('.filtre-span').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const spanId = this.getAttribute('span-id');
        spanFonction(spanId);
    });
});

// Fonction pour le span
function spanFonction(spanId) {
    const icon = document.querySelector(`.filtre-span[span-id="${spanId}"]`);
    if (icon) {
        if (icon.classList.contains('span-minus')) {
            icon.classList.remove('span-minus');
            icon.classList.add('span-plus');
        } else if (icon.classList.contains('span-plus')) {
            icon.classList.remove('span-plus');
            icon.classList.add('span-minus');
        } else {
            // Par défaut, on applique la première rotation à -90 degrés
            icon.classList.add('span-minus');
        }
    }

    if(spanId == 1){
        const content1 = document.querySelector('.second-content1');
        if (content1.style.display === 'block') {
            content1.style.display = 'none';
        } else {
            content1.style.display = 'block';
        }
    }

    if(spanId == 2){
        const content2 = document.querySelector('.second-content2');
        if (content2.style.display === 'block') {
            content2.style.display = 'none';
        } else {
            content2.style.display = 'block';
        }
    }

    if(spanId == 3){
        const content3 = document.querySelector('.third-content1');
        if (content3.style.display === 'block') {
            content3.style.display = 'none';
        } else {
            content3.style.display = 'block';
        }
    }

    if(spanId == 4){
        const content4 = document.querySelector('.third-content2');
        if (content4.style.display === 'block') {
            content4.style.display = 'none';
        } else {
            content4.style.display = 'block';
        }
    }
}

// Ajouter un événement de clic pour changer la rotation
document.querySelectorAll('.filtre-top').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const filtreId = this.getAttribute('filtre-id');
        toggleRotation(filtreId);
    });
});

// Fonction pour basculer la rotation entre -90 et 90 degrés
function toggleRotation(filtreId) {
    const icon = document.querySelector(`.icon-arrow[filtre-id="${filtreId}"]`);
    if (icon) {
        if (icon.classList.contains('rotated-minus')) {
            icon.classList.remove('rotated-minus');
            icon.classList.add('rotated-plus');
        } else if (icon.classList.contains('rotated-plus')) {
            icon.classList.remove('rotated-plus');
            icon.classList.add('rotated-minus');
        } else {
            // Par défaut, on applique la première rotation à -90 degrés
            icon.classList.add('rotated-minus');
        }
    }

    if(filtreId == 1){
        const content = document.querySelector('.first-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 2){
        const content = document.querySelector('.price-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 3){
        const content = document.querySelector('.fabricants-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 4){
        const content = document.querySelector('.processeur-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 5){
        const content = document.querySelector('.memoire-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 6){
        const content = document.querySelector('.stockage-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 7){
        const content = document.querySelector('.taille-de-ecran-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 8){
        const content = document.querySelector('.garantie-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 9){
        const content = document.querySelector('.type-processeur-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 10){
        const content = document.querySelector('.ecran-tactile-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 11){
        const content = document.querySelector('.carte-graphique-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 12){
        const content = document.querySelector('.se-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 13){
        const content = document.querySelector('.taille-ecran-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 14){
        const content = document.querySelector('.type-ecran-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 15){
        const content = document.querySelector('.sim-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 16){
        const content = document.querySelector('.ram-content');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }
}

// ===============================================================================================


// Fonction pour ajouter ou mettre à jour le filtr-item de prix
function updatePriceFilter(min, max) {
    let priceFilterItem = document.querySelector('.filtre-item.price');

    if (!priceFilterItem) {
        // Si l'élément n'existe pas encore, créer un nouvel élément filtr-item
        priceFilterItem = document.createElement('div');
        priceFilterItem.classList.add('filtre-item', 'price');
        
        // Ajouter un conteneur pour le texte et le bouton
        const filterContent = document.createElement('span');
        filterContent.classList.add('filter-content');
        
        // Ajouter le bouton de suppression (croix)
        const removeBtn = document.createElement('i');
        removeBtn.classList.add('uil', 'uil-times');
        removeBtn.style.cursor = 'pointer'; // S'assurer que le curseur change pour indiquer la cliquabilité
        removeBtn.addEventListener('click', () => {
            // Réinitialiser les sliders et les inputs
            rangeInput[0].value = rangeInput[0].min;
            rangeInput[1].value = rangeInput[1].max;
            priceInput[0].value = rangeInput[0].min;
            priceInput[1].value = rangeInput[1].max;
            updatePriceSlider();  //Mise à jour visuelle du slider
            priceFilterItem.remove(); // Supprimer l'élément de filtre

        });

        // Ajouter le contenu et le bouton à l'élément filtr-item
        priceFilterItem.appendChild(filterContent);
        priceFilterItem.appendChild(removeBtn);

        // Ajouter l'élément de filtre au conteneur des filtres sélectionnés
        document.querySelector('.selectedFilters').appendChild(priceFilterItem);
    }

    // Mettre à jour le texte de l'élément avec les nouvelles valeurs
    const filterContent = priceFilterItem.querySelector('.filter-content');
    filterContent.textContent = `Prix - ${min} - ${max} FCFA`;
}

// Fonction pour mettre à jour la partie visuelle du slider
function updatePriceSlider() {
    let minVal = parseInt(rangeInput[0].value);
    let maxVal = parseInt(rangeInput[1].value);
    priceInput[0].value = minVal;
    priceInput[1].value = maxVal;
    range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";

    // Mettre à jour l'élément filtr-item de prix
    updatePriceFilter(minVal, maxVal);
}

// Prix
const rangeInput = document.querySelectorAll(".range-input input"),
priceInput = document.querySelectorAll(".price-input input"),
range = document.querySelector(".slider .progress");
let priceGap = 5000;

// Écouter les changements dans les inputs de prix
priceInput.forEach(input => {
    input.addEventListener("input", e => {
        let minPrice = parseInt(priceInput[0].value),
            maxPrice = parseInt(priceInput[1].value);
        
        if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = minPrice;
            } else {
                rangeInput[1].value = maxPrice;
            }
            updatePriceSlider(); // Mise à jour visuelle et de l'élément filtr-item
        }
    });
});

// Écouter les changements dans les sliders de prix
rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < priceGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap;
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        }
        updatePriceSlider(); // Mise à jour visuelle et de l'élément filtr-item
    });
});

// ===================================================================================

// Fonction pour ajouter ou mettre à jour le filtr-item de prix
function updatePriceFilter1(min, max) {
    let priceFilterItem1 = document.querySelector('.filtre-item-desktop.price');

    if (!priceFilterItem1) {
        // Si l'élément n'existe pas encore, créer un nouvel élément filtr-item
        priceFilterItem1 = document.createElement('div');
        priceFilterItem1.classList.add('filtre-item-desktop', 'price');
        
        // Ajouter un conteneur pour le texte et le bouton
        const filterContent1 = document.createElement('span');
        filterContent1.classList.add('filter-content-desktop');
        
        // Ajouter le bouton de suppression (croix)
        const removeBtn1 = document.createElement('i');
        removeBtn1.classList.add('uil', 'uil-times');
        removeBtn1.style.cursor = 'pointer'; // S'assurer que le curseur change pour indiquer la cliquabilité
        removeBtn1.addEventListener('click', () => {
            // Réinitialiser les sliders et les inputs
            rangeInput1[0].value = rangeInput1[0].min;
            rangeInput1[1].value = rangeInput1[1].max;
            priceInput1[0].value = rangeInput1[0].min;
            priceInput1[1].value = rangeInput1[1].max;
            updatePriceSlider1();  //Mise à jour visuelle du slider
            priceFilterItem1.remove(); // Supprimer l'élément de filtre

        });

        // Ajouter le contenu et le bouton à l'élément filtr-item
        priceFilterItem1.appendChild(filterContent1);
        priceFilterItem1.appendChild(removeBtn1);

        // Ajouter l'élément de filtre au conteneur des filtres sélectionnés
        document.querySelector('.selectedFilters-desktop').appendChild(priceFilterItem1);
    }

    // Mettre à jour le texte de l'élément avec les nouvelles valeurs
    const filterContent1 = priceFilterItem1.querySelector('.filter-content-desktop');
    filterContent1.textContent = `Prix - ${min} - ${max} FCFA`;
}

// Fonction pour mettre à jour la partie visuelle du slider
function updatePriceSlider1() {
    let minVal1 = parseInt(rangeInput1[0].value);
    let maxVal1 = parseInt(rangeInput1[1].value);
    priceInput1[0].value = minVal1;
    priceInput1[1].value = maxVal1;
    range1.style.left = ((minVal1 / rangeInput1[0].max) * 100) + "%";
    range1.style.right = 100 - (maxVal1 / rangeInput1[1].max) * 100 + "%";

    // Mettre à jour l'élément filtr-item de prix
    updatePriceFilter1(minVal1, maxVal1);
}

// Prix-Desktop
const rangeInput1 = document.querySelectorAll(".range-input-desktop input"),
priceInput1 = document.querySelectorAll(".price-input-desktop input"),
range1 = document.querySelector(".slider-desktop .progress");
let priceGap1 = 5000;

// Écouter les changements dans les inputs de prix
priceInput1.forEach(input => {
    input.addEventListener("input", e => {
        let minPrice1 = parseInt(priceInput1[0].value),
            maxPrice1 = parseInt(priceInput1[1].value);
        
        if ((maxPrice1 - minPrice1 >= priceGap1) && maxPrice1 <= rangeInput1[1].max) {
            if (e.target.className === "input-min") {
                rangeInput1[0].value = minPrice1;
            } else {
                rangeInput1[1].value = maxPrice1;
            }
            updatePriceSlider1(); // Mise à jour visuelle et de l'élément filtr-item
        }
    });
});

// Écouter les changements dans les sliders de prix
rangeInput1.forEach(input => {
    input.addEventListener("input", e => {
        let minVal1 = parseInt(rangeInput1[0].value),
            maxVal1 = parseInt(rangeInput1[1].value);

        if ((maxVal1 - minVal1) < priceGap1) {
            if (e.target.className === "range-min") {
                rangeInput1[0].value = maxVal1 - priceGap1;
            } else {
                rangeInput1[1].value = minVal1 + priceGap1;
            }
        }
        updatePriceSlider1(); // Mise à jour visuelle et de l'élément filtr-item
    });
});

// ================================================================================================

// Ajouter un événement de clic pour changer le content du span
document.querySelectorAll('.filtre-span').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const spanId = this.getAttribute('span-desktop-id');
        spanFonction1(spanId);
    });
});

// Fonction pour le span
function spanFonction1(spanId) {
    const icon = document.querySelector(`.filtre-span[span-desktop-id="${spanId}"]`);
    if (icon) {
        if (icon.classList.contains('span-minus')) {
            icon.classList.remove('span-minus');
            icon.classList.add('span-plus');
        } else if (icon.classList.contains('span-plus')) {
            icon.classList.remove('span-plus');
            icon.classList.add('span-minus');
        } else {
            // Par défaut, on applique la première rotation à -90 degrés
            icon.classList.add('span-minus');
        }
    }

    if(spanId == 1){
        const content1 = document.querySelector('.second-content-desktop1');
        if (content1.style.display === 'block') {
            content1.style.display = 'none';
        } else {
            content1.style.display = 'block';
        }
    }

    if(spanId == 2){
        const content2 = document.querySelector('.second-content-desktop2');
        if (content2.style.display === 'block') {
            content2.style.display = 'none';
        } else {
            content2.style.display = 'block';
        }
    }

    if(spanId == 3){
        const content3 = document.querySelector('.third-content-desktop1');
        if (content3.style.display === 'block') {
            content3.style.display = 'none';
        } else {
            content3.style.display = 'block';
        }
    }

    if(spanId == 4){
        const content4 = document.querySelector('.third-content-desktop2');
        if (content4.style.display === 'block') {
            content4.style.display = 'none';
        } else {
            content4.style.display = 'block';
        }
    }
}

// Ajouter un événement de clic pour changer la rotation
document.querySelectorAll('.filtre-top').forEach(function(icon) {
    icon.addEventListener('click', function() {
        const filtreId = this.getAttribute('filtre-desktop-id');
        toggleRotation1(filtreId);
    });
});

// Fonction pour basculer la rotation entre -90 et 90 degrés
function toggleRotation1(filtreId) {
    const icon = document.querySelector(`.icon-arrow[filtre-desktop-id="${filtreId}"]`);
    if (icon) {
        if (icon.classList.contains('rotated-minus')) {
            icon.classList.remove('rotated-minus');
            icon.classList.add('rotated-plus');
        } else if (icon.classList.contains('rotated-plus')) {
            icon.classList.remove('rotated-plus');
            icon.classList.add('rotated-minus');
        } else {
            // Par défaut, on applique la première rotation à -90 degrés
            icon.classList.add('rotated-minus');
        }
    }

    if(filtreId == 1){
        const content = document.querySelector('.first-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 2){
        const content = document.querySelector('.price-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 3){
        const content = document.querySelector('.fabricants-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 4){
        const content = document.querySelector('.processeur-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 5){
        const content = document.querySelector('.memoire-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 6){
        const content = document.querySelector('.stockage-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 7){
        const content = document.querySelector('.taille-de-ecran-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 8){
        const content = document.querySelector('.garantie-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 9){
        const content = document.querySelector('.type-processeur-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 10){
        const content = document.querySelector('.ecran-tactile-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 11){
        const content = document.querySelector('.carte-graphique-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 12){
        const content = document.querySelector('.se-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 13){
        const content = document.querySelector('.taille-ecran-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 14){
        const content = document.querySelector('.type-ecran-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 15){
        const content = document.querySelector('.sim-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    if(filtreId == 16){
        const content = document.querySelector('.ram-content-desktop');
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }
}

// ======================================================================================

// Sélectionner la case à cocher
const checkinformatique = document.getElementById('informatique');

// Sélectionner tous les éléments avec data-type="informatique"
const informatiqueElements = document.querySelectorAll('[data-type="informatique"]');

// Sélectionner la case à cocher
const checkphone = document.getElementById('phone');

// Sélectionner tous les éléments avec data-type="informatique"
const phoneElements = document.querySelectorAll('[data-type="phone"]');

checkinformatique.addEventListener('change', function() {
    const labelText = this.nextSibling.textContent.trim(); // Obtenir le texte de l'élément lié à la checkbox
    if (checkinformatique.checked) {
      // Si la case est cochée, masquer tous les éléments
      phoneElements.forEach(element => {
          element.style.display = 'none';
      });
  
    } else {
      // Si la case est décochée, afficher tous les éléments
      phoneElements.forEach(element => {
          element.style.display = 'block';
      });
    }
  });

checkphone.addEventListener('change', function() {
    const labelText = this.nextSibling.textContent.trim(); // Obtenir le texte de l'élément lié à la checkbox
    if (checkphone.checked) {
      // Si la case est cochée, masquer tous les éléments
      informatiqueElements.forEach(element => {
          element.style.display = 'none';
      });
  
    } else {
      // Si la case est décochée, afficher tous les éléments
      informatiqueElements.forEach(element => {
          element.style.display = 'block';
      });
    }
});

// Ajouter un écouteur d'événement pour détecter quand la case est cochée ou décochée
checkinformatique.addEventListener('change', function() {

    checkphone.addEventListener('change', function(){
      if (checkinformatique.checked && !checkphone.checked) {
        // Si la case est cochée, masquer tous les éléments
        informatiqueElements.forEach(element => {
          element.style.display = 'block';
        });

        phoneElements.forEach(element => {
            element.style.display = 'none';
        });

      } else if(!checkinformatique.checked && checkphone.checked){
        // Si la case est décochée, afficher tous les éléments
        informatiqueElements.forEach(element => {
          element.style.display = 'none';
        });

        phoneElements.forEach(element => {
            element.style.display = 'block';
        });
      } else if (!checkinformatique.checked && !checkphone.checked) {
        // Si la case est cochée, masquer tous les éléments
        informatiqueElements.forEach(element => {
          element.style.display = 'block';
        });

        phoneElements.forEach(element => {
            element.style.display = 'block';
        });

      } else if(checkinformatique.checked && checkphone.checked){
        // Si la case est décochée, afficher tous les éléments
        informatiqueElements.forEach(element => {
          element.style.display = 'block';
        });

        phoneElements.forEach(element => {
            element.style.display = 'block';
        });
      }
    });
});


 // Sélectionner toutes les cases à cocher
 const checkboxes = document.querySelectorAll('.filter-container-mobile input[type="checkbox"]');
 const selectedFiltersContainer = document.querySelector('.selectedFilters');

 // Fonction pour créer une nouvelle div filtr-item
 function createFilterItem(checkbox, labelText) {
     // Créer une nouvelle div
     const filterItem = document.createElement('div');
     filterItem.classList.add('filtre-item');
     filterItem.textContent = labelText;

     // Ajouter le bouton de suppression (croix)
     const removeBtn = document.createElement('i');
     removeBtn.classList.add('uil', 'uil-times');
     removeBtn.addEventListener('click', () => {
         filterItem.remove(); // Supprime la div filtr-item
         checkbox.checked = false; // Décoche la case correspondante
         if (checkbox === checkinformatique) {
            phoneElements.forEach(element => {
                element.style.display = 'block';
            });
         } else if (checkbox === checkphone) {
            informatiqueElements.forEach(element => {
                element.style.display = 'block';
            });
         }
     });

     // Ajouter le bouton de suppression à la div
     filterItem.appendChild(removeBtn);

     // Ajouter la nouvelle div à la zone des filtres sélectionnés
     selectedFiltersContainer.appendChild(filterItem);

     // Stocker l'élément dans la case à cocher pour pouvoir le retirer
     checkbox.filterItem = filterItem;
 }

 // Écouteur d'événement pour chaque checkbox
 checkboxes.forEach(checkbox => {
     checkbox.addEventListener('change', function() {
         const labelText1 = this.nextSibling.textContent.trim(); // Obtenir le texte de l'élément lié à la checkbox
         const labelText2 = this.getAttribute('name').trim();
         const labelText = `${labelText2} - ${labelText1}`;

         if (this.checked) {
             // Si la case est cochée, créer un nouvel élément de filtre
             createFilterItem(this, labelText);
         } else {
             // Si la case est décochée, supprimer l'élément de filtre correspondant
             if (this.filterItem) {
                 this.filterItem.remove();
             }
         }
     });
 });

// Fonction pour effacer tous les filtres
const clearAllBtn = document.getElementById('clearAllFilters');
clearAllBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Réinitialiser les sliders et les inputs
    rangeInput[0].value = rangeInput[0].min;
    rangeInput[1].value = rangeInput[1].max;
    priceInput[0].value = rangeInput[0].min;
    priceInput[1].value = rangeInput[1].max;
    updatePriceSlider();  //Mise à jour visuelle du slider

    // Supprimer tous les éléments filtr-item
    const filterItems = document.querySelectorAll('.filtre-item');
    filterItems.forEach(item => {
        item.remove(); // Supprimer chaque élément de filtre
    });

    // Décocher toutes les cases à cocher
    checkboxes.forEach(checkbox => {

        checkbox.checked = false;

        const selectElement = document.querySelector(`select[name="text-fab"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0; // Sélectionner la première option (--)
            selectElement.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
        }

        phoneElements.forEach(element => {
            element.style.display = 'block';
        });

        informatiqueElements.forEach(element => {
            element.style.display = 'block';
        });

        // Supprimer la div associée si elle existe
        if (checkbox.filterItem) {
            checkbox.filterItem.remove();
            checkbox.filterItem = null; // S'assurer que la référence est bien supprimée
        }
    });
});

// Fonction pour ajouter ou mettre à jour le filtr-item basé sur le select
function updateSelectFilter(filterName, selectedValue) {
    // Rechercher un filtre existant avec la même catégorie (filterName)
    let selectFilterItem = document.querySelector(`.filtre-item[data-filter="${filterName}"]`);

    if (!selectFilterItem) {
        // Si l'élément n'existe pas encore, créer un nouvel élément filtr-item
        selectFilterItem = document.createElement('div');
        selectFilterItem.classList.add('filtre-item');
        selectFilterItem.setAttribute('data-filter', filterName);

        // Ajouter un conteneur pour le texte et le bouton
        const filterContent = document.createElement('span');
        filterContent.classList.add('filter-content');

        // Ajouter le bouton de suppression (croix)
        const removeBtn = document.createElement('i');
        removeBtn.classList.add('uil', 'uil-times');
        removeBtn.style.cursor = 'pointer';
        removeBtn.addEventListener('click', () => {
            selectFilterItem.remove(); // Supprimer l'élément de filtre

            // Réinitialiser le select à la première option "--"
            const selectElement = document.querySelector(`select[name="${filterName}"]`);
            if (selectElement) {
                selectElement.selectedIndex = 0; // Sélectionner la première option (--)
                selectElement.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
            }
        });

        const selectElement = document.querySelector(`select[name="${filterName}"]`);
        if (selectElement.selectedIndex != 0) {
            // Ajouter le contenu et le bouton à l'élément filtr-item
            selectFilterItem.appendChild(filterContent);
            selectFilterItem.appendChild(removeBtn);

            // Ajouter l'élément de filtre au conteneur des filtres sélectionnés
            document.querySelector('.selectedFilters').appendChild(selectFilterItem);
        }
    }

    // Mettre à jour le texte de l'élément avec la nouvelle valeur sélectionnée
    const filterContent = selectFilterItem.querySelector('.filter-content');
    if (selectedValue != 'Fabricants - --') {
        filterContent.textContent = selectedValue;
    }
}

// Événement pour gérer les changements sur les selects (Fabricants ici)
document.querySelectorAll('select').forEach(selectElement => {
    selectElement.addEventListener('change', function() {
        const selectedValue1 = this.options[this.selectedIndex].text; // Texte sélectionné
        const selectedValue = `Fabricants - ${selectedValue1}`;
        const filterName = this.getAttribute('name'); // Nom du filtre (ici, "text-fab")

        if (selectedValue && selectedValue !== '--') {
            // Mettre à jour ou créer un nouvel élément filtr-item
            updateSelectFilter(filterName, selectedValue);
        } else {
            // Si aucune option n'est sélectionnée (ou "--"), supprimer l'élément de filtre correspondant
            const selectFilterItem = document.querySelector(`.filtre-item[data-filter="${filterName}"]`);
            if (selectFilterItem) {
                selectFilterItem.remove();
            }
        }
    });
});


// ======================================================================================

// Sélectionner la case à cocher
const checkinformatique1 = document.getElementById('informatique-desktop');

// Sélectionner tous les éléments avec data-type="informatique"
const informatiqueElements1 = document.querySelectorAll('[data-type="informatique-desktop"]');

// Sélectionner la case à cocher
const checkphone1 = document.getElementById('phone-desktop');

// Sélectionner tous les éléments avec data-type="informatique"
const phoneElements1 = document.querySelectorAll('[data-type="phone-desktop"]');

checkinformatique1.addEventListener('change', function() {
    const labelText1 = this.nextSibling.textContent.trim(); // Obtenir le texte de l'élément lié à la checkbox
    if (checkinformatique1.checked) {
      // Si la case est cochée, masquer tous les éléments
      phoneElements1.forEach(element => {
          element.style.display = 'none';
      });
  
    } else {
      // Si la case est décochée, afficher tous les éléments
      phoneElements1.forEach(element => {
          element.style.display = 'block';
      });
    }
  });

checkphone1.addEventListener('change', function() {
    const labelText1 = this.nextSibling.textContent.trim(); // Obtenir le texte de l'élément lié à la checkbox
    if (checkphone1.checked) {
      // Si la case est cochée, masquer tous les éléments
      informatiqueElements1.forEach(element => {
          element.style.display = 'none';
      });
  
    } else {
      // Si la case est décochée, afficher tous les éléments
      informatiqueElements1.forEach(element => {
          element.style.display = 'block';
      });
    }
});

// Ajouter un écouteur d'événement pour détecter quand la case est cochée ou décochée
checkinformatique1.addEventListener('change', function() {

    checkphone1.addEventListener('change', function(){
      if (checkinformatique1.checked && !checkphone1.checked) {
        // Si la case est cochée, masquer tous les éléments
        informatiqueElements1.forEach(element => {
          element.style.display = 'block';
        });

        phoneElements1.forEach(element => {
            element.style.display = 'none';
        });

      } else if(!checkinformatique1.checked && checkphone1.checked){
        // Si la case est décochée, afficher tous les éléments
        informatiqueElements1.forEach(element => {
          element.style.display = 'none';
        });

        phoneElements1.forEach(element => {
            element.style.display = 'block';
        });
      } else if (!checkinformatique1.checked && !checkphone1.checked) {
        // Si la case est cochée, masquer tous les éléments
        informatiqueElements1.forEach(element => {
          element.style.display = 'block';
        });

        phoneElements1.forEach(element => {
            element.style.display = 'block';
        });

      } else if(checkinformatique1.checked && checkphone1.checked){
        // Si la case est décochée, afficher tous les éléments
        informatiqueElements1.forEach(element => {
            element.style.display = 'block';
          });
  
          phoneElements1.forEach(element => {
              element.style.display = 'block';
          });
      }
    });
});


 // Sélectionner toutes les cases à cocher
 const checkboxes1 = document.querySelectorAll('.filter-container-desktop input[type="checkbox"]');
 const selectedFiltersContainer1 = document.querySelector('.selectedFilters-desktop');

 // Fonction pour créer une nouvelle div filtr-item
 function createFilterItem1(checkbox1, labelText1) {
     // Créer une nouvelle div
     const filterItem1 = document.createElement('div');
     filterItem1.classList.add('filtre-item-desktop');
     filterItem1.textContent = labelText1;

     // Ajouter le bouton de suppression (croix)
     const removeBtn1 = document.createElement('i');
     removeBtn1.classList.add('uil', 'uil-times');
     removeBtn1.addEventListener('click', () => {
         filterItem1.remove(); // Supprime la div filtr-item
         checkbox1.checked = false; // Décoche la case correspondante
         if (checkbox1 === checkinformatique1) {
            phoneElements1.forEach(element => {
                element.style.display = 'block';
            });
         } else if (checkbox1 === checkphone1) {
            informatiqueElements1.forEach(element => {
                element.style.display = 'block';
            });
         }
     });

     // Ajouter le bouton de suppression à la div
     filterItem1.appendChild(removeBtn1);

     // Ajouter la nouvelle div à la zone des filtres sélectionnés
     selectedFiltersContainer1.appendChild(filterItem1);

     // Stocker l'élément dans la case à cocher pour pouvoir le retirer
    //  Attention
     checkbox1.filterItem1 = filterItem1;
 }

 // Écouteur d'événement pour chaque checkbox
 checkboxes1.forEach(checkbox1 => {
     checkbox1.addEventListener('change', function() {
         const labelText1 = this.nextSibling.textContent.trim(); // Obtenir le texte de l'élément lié à la checkbox
         const labelText2 = this.getAttribute('name').trim();
         const labelText = `${labelText2} - ${labelText1}`;

         if (this.checked) {
             // Si la case est cochée, créer un nouvel élément de filtre
             createFilterItem1(this, labelText);
         } else {
             // Si la case est décochée, supprimer l'élément de filtre correspondant
             if (this.filterItem1) {
                 this.filterItem1.remove();
             }
         }
     });
 });

// Fonction pour effacer tous les filtres
const clearAllBtn1 = document.getElementById('clearAllFilters-desktop');
clearAllBtn1.addEventListener('click', function(e) {
    e.preventDefault(); // Empêche le rechargement de la page

    // Réinitialiser les sliders et les inputs
    rangeInput1[0].value = rangeInput1[0].min;
    rangeInput1[1].value = rangeInput1[1].max;
    priceInput1[0].value = rangeInput1[0].min;
    priceInput1[1].value = rangeInput1[1].max;
    updatePriceSlider1();  //Mise à jour visuelle du slider

    // Supprimer tous les éléments filtr-item
    const filterItems1 = document.querySelectorAll('.filtre-item-desktop');
    filterItems1.forEach(item => {
        item.remove(); // Supprimer chaque élément de filtre
    });

    // Décocher toutes les cases à cocher
    checkboxes1.forEach(checkbox1 => {

        checkbox1.checked = false;

        const selectElement1 = document.querySelector(`select[name="text-fab1"]`);
        if (selectElement1) {
            selectElement1.selectedIndex = 0; // Sélectionner la première option (--)
            selectElement1.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
        }

        phoneElements1.forEach(element => {
            element.style.display = 'block';
        });

        informatiqueElements1.forEach(element => {
            element.style.display = 'block';
        });

        // Supprimer la div associée si elle existe
        if (checkbox1.filterItem1) {
            checkbox1.filterItem1.remove();
            checkbox1.filterItem1 = null; // S'assurer que la référence est bien supprimée
        }
    });
});

// Fonction pour ajouter ou mettre à jour le filtr-item basé sur le select
function updateSelectFilter1(filterName1, selectedValue1) {
    // Rechercher un filtre existant avec la même catégorie (filterName)
    let selectFilterItem1 = document.querySelector(`.filtre-item-desktop[data-filter-desktop="${filterName1}"]`);

    if (!selectFilterItem1) {
        // Si l'élément n'existe pas encore, créer un nouvel élément filtr-item
        selectFilterItem1 = document.createElement('div');
        selectFilterItem1.classList.add('filtre-item-desktop');
        selectFilterItem1.setAttribute('data-filter-desktop', filterName1);

        // Ajouter un conteneur pour le texte et le bouton
        const filterContent1 = document.createElement('span');
        filterContent1.classList.add('filter-content-desktop');

        // Ajouter le bouton de suppression (croix)
        const removeBtn1 = document.createElement('i');
        removeBtn1.classList.add('uil', 'uil-times');
        removeBtn1.style.cursor = 'pointer';
        removeBtn1.addEventListener('click', () => {
            selectFilterItem1.remove(); // Supprimer l'élément de filtre

            // Réinitialiser le select à la première option "--"
            const selectElement1 = document.querySelector(`select[name="${filterName1}"]`);
            if (selectElement1) {
                selectElement1.selectedIndex = 0; // Sélectionner la première option (--)
                selectElement1.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
            }
        });

        const selectElement1 = document.querySelector(`select[name="${filterName1}"]`);
        if (selectElement1.selectedIndex != 0) {
            // Ajouter le contenu et le bouton à l'élément filtr-item
            selectFilterItem1.appendChild(filterContent1);
            selectFilterItem1.appendChild(removeBtn1);

            // Ajouter l'élément de filtre au conteneur des filtres sélectionnés
            document.querySelector('.selectedFilters-desktop').appendChild(selectFilterItem1);
        }
    }

    // Mettre à jour le texte de l'élément avec la nouvelle valeur sélectionnée
    const filterContent1 = selectFilterItem1.querySelector('.filter-content-desktop');
    if (selectedValue1 != 'Fabricants - --') {
        filterContent1.textContent = selectedValue1;
    }
}

// Événement pour gérer les changements sur les selects (Fabricants ici)
document.querySelectorAll('select').forEach(selectElement1 => {
    selectElement1.addEventListener('change', function() {
        const selectedValue1 = this.options[this.selectedIndex].text; // Texte sélectionné
        const selectedValue = `Fabricants - ${selectedValue1}`;
        const filterName1 = this.getAttribute('name'); // Nom du filtre (ici, "text-fab")

        if (selectedValue && selectedValue !== '--') {
            // Mettre à jour ou créer un nouvel élément filtr-item
            updateSelectFilter1(filterName1, selectedValue);
        } else {
            // Si aucune option n'est sélectionnée (ou "--"), supprimer l'élément de filtre correspondant
            const selectFilterItem1 = document.querySelector(`.filtre-item-desktop[data-filter-desktop="${filterName1}"]`);
            if (selectFilterItem1) {
                selectFilterItem1.remove();
            }
        }
    });
});
