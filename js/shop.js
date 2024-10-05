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
        icon.classList.toggle('span-plus');
        icon.classList.toggle('span-minus');
    }

    const contents = [
        '.second-content1',
        '.second-content2',
        '.third-content1',
        '.third-content2'
    ];

    const index = parseInt(spanId) - 1; // Soustraire 1 car les indices commencent à 0
    const content = document.querySelector(contents[index]);

    if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
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
        icon.classList.toggle('rotated-plus');
        icon.classList.toggle('rotated-minus');
    }

    const contents = [
        '.first-content',
        '.price-content',
        '.fabricants-content',
        '.processeur-content',
        '.memoire-content',
        '.stockage-content',
        '.taille-de-ecran-content',
        '.garantie-content',
        '.type-processeur-content',
        '.ecran-tactile-content',
        '.carte-graphique-content',
        '.se-content',
        '.taille-ecran-content',
        '.type-ecran-content',
        '.sim-content',
        '.ram-content'
    ];

    const index = parseInt(filtreId) - 1; // Soustraire 1 car les indices commencent à 0
    const content = document.querySelector(contents[index]);

    if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }
}

// ===============================================================================================


// Fonction générique pour ajouter ou mettre à jour le filtre de prix
function updatePriceFilter(min, max, isDesktop = false) {
    const filterClass = isDesktop ? '.filtre-item-desktop.price' : '.filtre-item.price';
    const selectedFiltersClass = isDesktop ? '.selectedFilters-desktop' : '.selectedFilters';

    let priceFilterItem = document.querySelector(filterClass);

    if (!priceFilterItem) {
        // Si l'élément n'existe pas encore, créer un nouvel élément filtr-item
        priceFilterItem = document.createElement('div');
        priceFilterItem.classList.add(isDesktop ? 'filtre-item-desktop' : 'filtre-item', 'price');

        // Ajouter un conteneur pour le texte et le bouton
        const filterContent = document.createElement('span');
        filterContent.classList.add(isDesktop ? 'filter-content-desktop' : 'filter-content');

        // Ajouter le bouton de suppression (croix)
        const removeBtn = document.createElement('i');
        removeBtn.classList.add('uil', 'uil-times');
        removeBtn.style.cursor = 'pointer'; // Indiquer que le bouton est cliquable
        removeBtn.addEventListener('click', () => {
            // Réinitialiser les sliders et les inputs
            const rangeInputs = document.querySelectorAll(isDesktop ? ".range-input-desktop input" : ".range-input input");
            const priceInputs = document.querySelectorAll(isDesktop ? ".price-input-desktop input" : ".price-input input");
            rangeInputs[0].value = rangeInputs[0].min;
            rangeInputs[1].value = rangeInputs[1].max;
            priceInputs[0].value = rangeInputs[0].min;
            priceInputs[1].value = rangeInputs[1].max;
            updatePriceSlider(isDesktop);  // Mise à jour visuelle du slider
            priceFilterItem.remove(); // Supprimer l'élément de filtre
        });

        // Ajouter le contenu et le bouton à l'élément filtr-item
        priceFilterItem.appendChild(filterContent);
        priceFilterItem.appendChild(removeBtn);

        // Ajouter l'élément de filtre au conteneur des filtres sélectionnés
        document.querySelector(selectedFiltersClass).appendChild(priceFilterItem);
    }

    // Mettre à jour le texte de l'élément avec les nouvelles valeurs
    const filterContent = priceFilterItem.querySelector(isDesktop ? '.filter-content-desktop' : '.filter-content');
    filterContent.textContent = `Prix - ${min} - ${max} FCFA`;
}

// Fonction générique pour mettre à jour la partie visuelle du slider
function updatePriceSlider(isDesktop = false) {
    const rangeInputs = document.querySelectorAll(isDesktop ? ".range-input-desktop input" : ".range-input input");
    const priceInputs = document.querySelectorAll(isDesktop ? ".price-input-desktop input" : ".price-input input");
    const range = document.querySelector(isDesktop ? ".slider-desktop .progress" : ".slider .progress");

    let minVal = parseInt(rangeInputs[0].value);
    let maxVal = parseInt(rangeInputs[1].value);
    priceInputs[0].value = minVal;
    priceInputs[1].value = maxVal;

    range.style.left = ((minVal / rangeInputs[0].max) * 100) + "%";
    range.style.right = 100 - (maxVal / rangeInputs[1].max) * 100 + "%";

    // Mettre à jour l'élément filtr-item de prix
    updatePriceFilter(minVal, maxVal, isDesktop);
}

// Prix et écouteurs d'événements
const priceGap = 5000;

// Gérer les entrées et les sliders pour mobile
function setupPriceInputsAndSliders(isDesktop = false) {
    const rangeInputs = document.querySelectorAll(isDesktop ? ".range-input-desktop input" : ".range-input input");
    const priceInputs = document.querySelectorAll(isDesktop ? ".price-input-desktop input" : ".price-input input");

    priceInputs.forEach(input => {
        input.addEventListener("input", e => {
            let minPrice = parseInt(priceInputs[0].value),
                maxPrice = parseInt(priceInputs[1].value);

            if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInputs[1].max) {
                if (e.target.className === (isDesktop ? "input-min" : "input-min")) {
                    rangeInputs[0].value = minPrice;
                } else {
                    rangeInputs[1].value = maxPrice;
                }
                updatePriceSlider(isDesktop); // Mise à jour visuelle et de l'élément filtr-item
            }
        });
    });

    rangeInputs.forEach(input => {
        input.addEventListener("input", e => {
            let minVal = parseInt(rangeInputs[0].value),
                maxVal = parseInt(rangeInputs[1].value);

            if ((maxVal - minVal) < priceGap) {
                if (e.target.className === (isDesktop ? "range-min" : "range-min")) {
                    rangeInputs[0].value = maxVal - priceGap;
                } else {
                    rangeInputs[1].value = minVal + priceGap;
                }
            }
            updatePriceSlider(isDesktop); // Mise à jour visuelle et de l'élément filtr-item
        });
    });
}

// Initialiser les écouteurs pour mobile et desktop
setupPriceInputsAndSliders();
setupPriceInputsAndSliders(true); // true pour desktop
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
        icon.classList.toggle('span-plus');
        icon.classList.toggle('span-minus');
    }

    const contents = [
        '.second-content-desktop1',
        '.second-content-desktop2',
        '.third-content-desktop1',
        '.third-content-desktop2'
    ];

    const index = parseInt(spanId) - 1; // Soustraire 1 car les indices commencent à 0
    const content = document.querySelector(contents[index]);

    if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
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
        icon.classList.toggle('rotated-plus', icon.classList.contains('rotated-minus'));
        icon.classList.toggle('rotated-minus', !icon.classList.contains('rotated-minus'));
    }

    const contents = [
        '.first-content-desktop',
        '.price-content-desktop',
        '.fabricants-content-desktop',
        '.processeur-content-desktop',
        '.memoire-content-desktop',
        '.stockage-content-desktop',
        '.taille-de-ecran-content-desktop',
        '.garantie-content-desktop',
        '.type-processeur-content-desktop',
        '.ecran-tactile-content-desktop',
        '.carte-graphique-content-desktop',
        '.se-content-desktop',
        '.taille-ecran-content-desktop',
        '.type-ecran-content-desktop',
        '.sim-content-desktop',
        '.ram-content-desktop'
    ];

    const index = parseInt(filtreId) - 1; // Soustraire 1 car les indices commencent à 0
    const content = document.querySelector(contents[index]);

    if (content) {
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
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

// ================================================================

// import { getProductsList } from './firebase.js';

// async function LoadListProducts() {
//     // Affiche le spinner
//     document.getElementById('loading-spinner').style.display = 'block';

    
//     try {
//         const ProductsList = await getProductsList();
//         if (ProductsList) {
//             console.log(ProductsList);
//         } else {
//             console.log('Aucun Produits disponible');
//         }
//     } catch (error) {
//         console.log('Erreur lors de la récupération des produits', error);
//     }finally{
//          // Masque le spinner après la requête
//          document.getElementById('loading-spinner').style.display = 'none';
//     }

// }

// LoadListProducts();

import { getProductsList, addToFavorites, removeFromFavorites, isFavorite, addToCart, removeFromCart, isInCart } from './firebase.js';

async function LoadListProducts() {
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        const ProductsList = await getProductsList();
        const productsContainer = document.querySelector('.shop-product');

        if (ProductsList.length > 0) {
            productsContainer.innerHTML = '';

            const formatPrice = (price) => {
                return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            };


            ProductsList.forEach(async product => {
                const productElement = document.createElement('div');
                productElement.classList.add('sim-product');

                productElement.innerHTML = `
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div class="product-info">
                        <p class="fs-poppins fs-50 bold-500 text-blue">${product.name}</p>
                        <p class="fs-montserrat fs-5 text-des">
                            <strong>Référence : ${product.reference}</strong><br>
                            ${product.description}
                        </p>
                    </div>
                    <div class="detail">
                        <div class="detail-image"><img src="${product.marque}" alt="Product Icon"></div>
                        <div class="detail-text">
                            <div class="detail-prix text-red fs-100 bold-700">
                                <span class="price">${formatPrice(product.price)}</span> FCFA
                            </div>
                            <div class="detail-dispo">
                                <span class="${(product.stock > 0) ? 'text-green' : 'text-red'} fs-50">
                                    ${(product.stock > 0) ? 'En stock' : 'Indisponible'}
                                </span>
                            </div>
                            <div class="detail-el">
                                <i class="uil uil-shopping-cart-alt text-white add-to-cart" data-id="${product.id}"></i>
                                <i class="bi bi-heart icon-heart text-white" data-id="${product.id}"></i>
                            </div>
                        </div>
                    </div>
                `;

                // Redirection vers la page de détails lors du clic sur le produit
                productElement.addEventListener('click', () => {
                    window.location.href = `product.html?id=${product.id}`;
                });

                productsContainer.appendChild(productElement);

                const cartIcon = productElement.querySelector('.add-to-cart');
                const isCart = await isInCart(product.id);
                            
                if (isCart) {
                    cartIcon.classList.add('in-cart');
                }
                
                cartIcon.addEventListener('click', async (event) => {
                    event.stopPropagation();
                
                    if (cartIcon.classList.contains('in-cart')) {
                        // Si le produit est déjà dans le panier, on le retire
                        await removeFromCart(product.id);
                        cartIcon.classList.remove('in-cart');
                        showAlert('Le produit a été retiré de votre panier!');
                    } else {
                        // Si le produit n'est pas dans le panier, on l'ajoute avec une quantité par défaut (1)
                        await addToCart(product.id, 1); // Quantité par défaut de 1
                        cartIcon.classList.add('in-cart');
                        showAlert('Le produit a été ajouté à votre panier!');
                    }
                });

                const heartIcon = productElement.querySelector('.icon-heart');
                const isFav = await isFavorite(product.id);

                if (isFav) {
                    heartIcon.classList.add('favorited');
                }

                heartIcon.addEventListener('click', async (event) => {
                    event.stopPropagation();

                    if (heartIcon.classList.contains('favorited')) {
                        await removeFromFavorites(product.id);
                        heartIcon.classList.remove('favorited');
                        showFavoriteAlert('Le produit a été retiré de votre liste.');
                    } else {
                        await addToFavorites(product.id);
                        heartIcon.classList.add('favorited');
                        showFavoriteAlert('Le produit a été ajouté à votre liste.');
                    }
                });
            });
        } else {
            productsContainer.innerHTML = '<p>Aucun produit disponible.</p>';
        }
    } catch (error) {
        console.log('Erreur lors de la récupération des produits', error);
        productsContainer.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Fonction pour afficher l'alerte au centre de l'écran
function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
    <span class="text-black">${message}<a href="/cart.html"> Voir votre panier.</a></span>
    <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alertBox);

    alertBox.querySelector('.close-btn').addEventListener('click', () => {
        alertBox.classList.add('hide');
    });

    setTimeout(() => {
        alertBox.classList.add('hide');
    }, 5000);

    setTimeout(() => {
        alertBox.remove();
    }, 5500);
}

// Fonction pour afficher l'alerte de favoris
function showFavoriteAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
        <span class="text-black">${message}<a href="/favoris.html"> Voir votre liste.</a></span>
        <span class="close-btn">&times;</span>
    `;
    
    document.body.appendChild(alertBox);

    alertBox.querySelector('.close-btn').addEventListener('click', () => {
        alertBox.classList.add('hide');
    });

    setTimeout(() => {
        alertBox.classList.add('hide');
    }, 5000);

    setTimeout(() => {
        alertBox.remove();
    }, 5500);
}



LoadListProducts();