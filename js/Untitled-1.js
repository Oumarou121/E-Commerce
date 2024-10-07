








// ==============================================


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

    ClearUpdatePriceSlider();
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

    ClearUpdatePriceSlider(true);
    updatePriceSlider(true);  //Mise à jour visuelle du slider

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