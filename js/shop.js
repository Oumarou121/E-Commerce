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
    const filterClass = isDesktop ? '.filtre-item.price' : '.filtre-item.price';
    const selectedFiltersClass = isDesktop ? '.selectedFilters-desktop' : '.selectedFilters';

    let priceFilterItem = document.querySelector(filterClass);

    if (!priceFilterItem) {
        // Si l'élément n'existe pas encore, créer un nouvel élément filtr-item
        priceFilterItem = document.createElement('div');
        priceFilterItem.classList.add(isDesktop ? 'filtre-item' : 'filtre-item', 'price');

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

// Fonction générique pour mettre à jour la partie visuelle du slider
function ClearUpdatePriceSlider(isDesktop = false) {
    const rangeInputs = document.querySelectorAll(isDesktop ? ".range-input-desktop input" : ".range-input input");
    const priceInputs = document.querySelectorAll(isDesktop ? ".price-input-desktop input" : ".price-input input");
    const range = document.querySelector(isDesktop ? ".slider-desktop .progress" : ".slider .progress");

    
    rangeInputs[0].value = rangeInputs[0].min;
    rangeInputs[1].value = rangeInputs[1].max;
    priceInputs[0].value = rangeInputs[0].min;
    priceInputs[1].value = rangeInputs[1].max;
    updatePriceSlider(isDesktop);  // Mise à jour visuelle du slider

    // Mettre à jour l'élément filtr-item de prix
    updatePriceFilter(rangeInputs[0].min, rangeInputs[1].max, isDesktop);
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

// Fonction pour gérer l'affichage des éléments selon les cases à cocher
function handleCheckboxChange(checkbox, elementsToHide) {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            elementsToHide.forEach(element => {
                element.style.display = 'none';
            });
        } else {
            elementsToHide.forEach(element => {
                element.style.display = 'block';
            });
        }
    });
}

// Fonction pour gérer l'affichage des éléments selon les cases à cocher
function handleCheckboxChangeAll(checkboxAll, elementsToHide) {
    checkboxAll.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                elementsToHide.forEach(element => {
                    element.style.display = 'none';
                });
            } else {
                elementsToHide.forEach(element => {
                    element.style.display = 'block';
                });
            }
        });
    });
}

// Fonction pour gérer l'affichage en fonction de l'état des deux cases à cocher
function handleDualCheckboxChange(checkboxA, checkboxB, elementsA, elementsB) {
    [checkboxA, checkboxB].forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const isCheckedA = checkboxA.checked;
            const isCheckedB = checkboxB.checked;

            if (isCheckedA && !isCheckedB) {
                elementsA.forEach(element => element.style.display = 'block');
                elementsB.forEach(element => element.style.display = 'none');
            } else if (!isCheckedA && isCheckedB) {
                elementsA.forEach(element => element.style.display = 'none');
                elementsB.forEach(element => element.style.display = 'block');
            } else {
                elementsA.forEach(element => element.style.display = 'block');
                elementsB.forEach(element => element.style.display = 'block');
            }
        });
    });
}

const contentsInformatique = [
    "Processeur",
    "Ecran Tactile",
    "Carte Graphique",
    "Système d'exploitation",
    "Taille Ecran",
    "Type Ecran"
];

let nbrInformatique = [
    0,
    0,
    0,
    0,
    0,
    0
];

const contentsPhone = [
    "Stockage",
    "Taille de l'écran",
    "Type processeur",
    "Double SIM",
    "RAM"        
];

let nbrPhone = [
    0,
    0,
    0,
    0,
    0        
];

const contentsInformatique_desktop = [
    "Processeur",
    "Ecran Tactile",
    "Carte Graphique",
    "Système d'exploitation",
    "Taille Ecran",
    "Type Ecran"
];

let nbrInformatique_desktop = [
    0,
    0,
    0,
    0,
    0,
    0
];

const contentsPhone_desktop = [
    "Stockage",
    "Taille de l'écran",
    "Type processeur",
    "Double SIM",
    "RAM"        
];

let nbrPhone_desktop = [
    0,
    0,
    0,
    0,
    0        
];

// Fonction pour créer et gérer un filtre
function createFilterItem(name, checkbox, labelText, container, isDesktop) {
    const filterItem = document.createElement('div');
    filterItem.classList.add('filtre-item');
    filterItem.textContent = labelText;

    const removeBtn = document.createElement('i');
    removeBtn.classList.add('uil', 'uil-times');
    removeBtn.addEventListener('click', () => {
        filterItem.remove();
        checkbox.checked = false;
        // Afficher tous les éléments si le filtre est retiré
        const relatedElements = document.querySelectorAll(`[data-type="${checkbox.getAttribute('data-type')}"]`);
        relatedElements.forEach(element => element.style.display = 'block');
        if (isDesktop) {
            if (contentsPhone_desktop.includes(name)) {            
                console.log(name);
                const index = contentsPhone_desktop.indexOf(name);
                nbrPhone_desktop[index] -= 1;
                console.log(nbrPhone_desktop[index])
                if(nbrPhone_desktop[index] == 0){
                    const pho = document.querySelectorAll(`[data-type="informatique-desktop"]`);
                    pho.forEach(element => element.style.display = 'block');
                }
            } else if (contentsInformatique_desktop.includes(name)){
                console.log(name);
                const index = contentsInformatique_desktop.indexOf(name);
                nbrInformatique_desktop[index] -= 1;
                console.log(nbrInformatique_desktop[index]);
                if(nbrInformatique_desktop[index] == 0){
                    const info = document.querySelectorAll(`[data-type="phone-desktop"]`);
                    info.forEach(element => element.style.display = 'block');
                }
            }
        } else {
            if (contentsPhone.includes(name)) {            
                console.log(name);
                const index = contentsPhone.indexOf(name);
                nbrPhone[index] -= 1;
                console.log(nbrPhone[index])
                if(nbrPhone[index] == 0){
                    const pho = document.querySelectorAll(`[data-type="informatique"]`);
                    pho.forEach(element => element.style.display = 'block');
                }
            } else if (contentsInformatique.includes(name)){
                console.log(name);
                const index = contentsInformatique.indexOf(name);
                nbrInformatique[index] -= 1;
                console.log(nbrInformatique[index]);
                if(nbrInformatique[index] == 0){
                    const info = document.querySelectorAll(`[data-type="phone"]`);
                    info.forEach(element => element.style.display = 'block');
                }
            }
        }
    });


    if (isDesktop) {
        if (contentsPhone_desktop.includes(name)) {
            console.log(name);
            const index = contentsPhone_desktop.indexOf(name);
            nbrPhone_desktop[index] += 1;
            console.log(nbrPhone_desktop[index])
            const pho = document.querySelectorAll(`[data-type="informatique-desktop"]`);
            pho.forEach(element => element.style.display = 'none');
        } else if (contentsInformatique_desktop.includes(name)){
            console.log(name);
            const index = contentsInformatique_desktop.indexOf(name);
            nbrInformatique_desktop[index] += 1;
            console.log(nbrInformatique_desktop[index]);
            const info = document.querySelectorAll(`[data-type="phone-desktop"]`);
            info.forEach(element => element.style.display = 'none');
        }
    } else {
        if (contentsPhone.includes(name)) {
            console.log(name);
            const index = contentsPhone.indexOf(name);
            nbrPhone[index] += 1;
            console.log(nbrPhone[index])
            const pho = document.querySelectorAll(`[data-type="informatique"]`);
            pho.forEach(element => element.style.display = 'none');
        } else if (contentsInformatique.includes(name)){
            console.log(name);
            const index = contentsInformatique.indexOf(name);
            nbrInformatique[index] += 1;
            console.log(nbrInformatique[index]);
            const info = document.querySelectorAll(`[data-type="phone"]`);
            info.forEach(element => element.style.display = 'none');
        }
    }

    filterItem.appendChild(removeBtn);
    container.appendChild(filterItem);
    checkbox.filterItem = filterItem; // Lien entre la case à cocher et l'élément filtre

}

// Fonction pour créer et gérer un filtre
function createFilterItemSelect(select, labelText, container) {
    const filterItem = document.createElement('div');
    filterItem.classList.add('filtre-item');
    filterItem.textContent = labelText;

    const removeBtn = document.createElement('i');
    removeBtn.classList.add('uil', 'uil-times');
    removeBtn.addEventListener('click', () => {
        select.selectedIndex = 0; // Sélectionner la première option (--)
        select.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
        filterItem.remove();
    });

    filterItem.appendChild(removeBtn);
    container.appendChild(filterItem);
    select.filterItem = filterItem; // Lien entre la case à cocher et l'élément filtre
}


// Fonction pour gérer les cases à cocher et créer des filtres
function handleCheckboxes(checkboxes, container, isDesktop) {
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const labelText = `${this.getAttribute('name')} - ${this.nextSibling.textContent.trim()}`;
            if (this.checked) {
                createFilterItem(this.getAttribute('name'), this, labelText, container, isDesktop);
            } else {
                if (this.filterItem) {
                    this.filterItem.remove();
                    this.filterItem = null; // Réinitialiser la référence

                    if (isDesktop) {
                        if (contentsPhone_desktop.includes(this.getAttribute('name'))) {            
                            console.log(this.getAttribute('name'));
                            const index = contentsPhone_desktop.indexOf(this.getAttribute('name'));
                            nbrPhone_desktop[index] -= 1;
                            console.log(nbrPhone_desktop[index])
                            if(nbrPhone_desktop[index] == 0){
                                const pho = document.querySelectorAll(`[data-type="informatique-desktop"]`);
                                pho.forEach(element => element.style.display = 'block');
                            }
                        } else if (contentsInformatique_desktop.includes(this.getAttribute('name'))){
                            console.log(this.getAttribute('name'));
                            const index = contentsInformatique_desktop.indexOf(this.getAttribute('name'));
                            nbrInformatique_desktop[index] -= 1;
                            console.log(nbrInformatique_desktop[index]);
                            if(nbrInformatique_desktop[index] == 0){
                                const info = document.querySelectorAll(`[data-type="phone-desktop"]`);
                                info.forEach(element => element.style.display = 'block');
                            }
                        }
                    } else {
                        if (contentsPhone.includes(this.getAttribute('name'))) {            
                            console.log(this.getAttribute('name'));
                            const index = contentsPhone.indexOf(this.getAttribute('name'));
                            nbrPhone[index] -= 1;
                            console.log(nbrPhone[index])
                            if(nbrPhone[index] == 0){
                                const pho = document.querySelectorAll(`[data-type="informatique"]`);
                                pho.forEach(element => element.style.display = 'block');
                            }
                        } else if (contentsInformatique.includes(this.getAttribute('name'))){
                            console.log(this.getAttribute('name'));
                            const index = contentsInformatique.indexOf(this.getAttribute('name'));
                            nbrInformatique[index] -= 1;
                            console.log(nbrInformatique[index]);
                            if(nbrInformatique[index] == 0){
                                const info = document.querySelectorAll(`[data-type="phone"]`);
                                info.forEach(element => element.style.display = 'block');
                            }
                        }
                    }
                }
            }
        });
    });
}

// Événement pour gérer les changements sur les selects (Fabricants ici)
document.querySelectorAll('select').forEach(selectElement => {
    selectElement.addEventListener('change', function() {
        const selectedValue1 = this.options[this.selectedIndex].text; // Texte sélectionné
        const selectedValue = `Fabricants - ${selectedValue1}`;
        const filterName = this.getAttribute('name'); // Nom du filtre (ici, "text-fab")

        if (this.selectedIndex === 0) {
            this.filterItem.remove();
            this.filterItem = null; // Réinitialiser la référence 
            
        } else {

            if(this.filterItem != null){
                this.filterItem.remove();
                this.filterItem = null; // Réinitialiser la référence 
            }
            
            if (filterName === 'text-fab') {
                console.log('mobile');
                createFilterItemSelect(this, selectedValue, mobileSelectedFilters);
            } else {
                console.log('desktop');
                createFilterItemSelect(this, selectedValue, desktopSelectedFilters);
            }
        }
        
    });
});
// Fonction pour effacer tous les filtres
function clearAllFilters(checkboxes, container) {
    const clearAllBtn = document.getElementById('clearAllFilters');
    clearAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            if (checkbox.filterItem) {
                checkbox.filterItem.remove();
                checkbox.filterItem = null; // Réinitialiser la référence
            }
        });
        // Réinitialiser les sliders et les inputs
        const rangeInputs = document.querySelectorAll(".range-input input");
        const priceInputs = document.querySelectorAll(".price-input input");
        rangeInputs[0].value = rangeInputs[0].min;
        rangeInputs[1].value = rangeInputs[1].max;
        priceInputs[0].value = rangeInputs[0].min;
        priceInputs[1].value = rangeInputs[1].max;
        updatePriceSlider();  // Mise à jour visuelle du slider
        const selectElement = document.querySelector(`select[name="text-fab"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0; // Sélectionner la première option (--)
            selectElement.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
        }
        container.querySelectorAll('.filtre-item').forEach(item => item.remove()); // Supprimer les éléments de filtre
        // Réinitialiser l'affichage des éléments
        const allElements = document.querySelectorAll('[data-type]');
        allElements.forEach(element => element.style.display = 'block');

        nbrInformatique = [
            0,
            0,
            0,
            0,
            0,
            0
        ];

        nbrPhone = [
            0,
            0,
            0,
            0,
            0
        ];
    });
}

// Fonction pour effacer tous les filtres
function clearAllFilters1(checkboxes, container) {
    const clearAllBtn = document.getElementById('clearAllFilters-desktop');
    clearAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            if (checkbox.filterItem) {
                checkbox.filterItem.remove();
                checkbox.filterItem = null; // Réinitialiser la référence
            }
        });
        // Réinitialiser les sliders et les inputs
        const rangeInputs = document.querySelectorAll(".range-input-desktop input");
        const priceInputs = document.querySelectorAll(".price-input-desktop input");
        rangeInputs[0].value = rangeInputs[0].min;
        rangeInputs[1].value = rangeInputs[1].max;
        priceInputs[0].value = rangeInputs[0].min;
        priceInputs[1].value = rangeInputs[1].max;
        updatePriceSlider(true);  // Mise à jour visuelle du slider
        const selectElement = document.querySelector(`select[name="text-fab1"]`);
        if (selectElement) {
            selectElement.selectedIndex = 0; // Sélectionner la première option (--)
            selectElement.dispatchEvent(new Event('change')); // Déclencher l'événement de changement
        }
        container.querySelectorAll('.filtre-item').forEach(item => item.remove()); // Supprimer les éléments de filtre
        // Réinitialiser l'affichage des éléments
        const allElements = document.querySelectorAll('[data-type]');
        allElements.forEach(element => element.style.display = 'block');

        nbrInformatique_desktop = [
            0,
            0,
            0,
            0,
            0,
            0
        ];

        nbrPhone_desktop = [
            0,
            0,
            0,
            0,
            0
        ];
    });
}

// Gérer les sections mobile et desktop
const mobileCheckboxes = document.querySelectorAll('.filter-container-mobile input[type="checkbox"]');
const mobileSelectedFilters = document.querySelector('.selectedFilters');
const mobileCheckboxA = document.getElementById('informatique');
// const mobileCheckbox4 = document.getElementById('informatique1');
// const mobileCheckbox5 = document.getElementById('informatique2');
// const mobileCheckbox6 = document.getElementById('informatique3');
// const mobileCheckbox7 = document.getElementById('informatique4');
// const mobileCheckbox8 = document.getElementById('informatique5');
// const mobileCheckbox9 = document.getElementById('informatique6');
// const mobileCheckbox10 = document.getElementById('informatique7');
// const mobileCheckbox11 = document.getElementById('informatique8');
const mobileCheckboxB = document.getElementById('phone');
// const mobileCheckbox1 = document.getElementById('phone1');
// const mobileCheckbox2 = document.getElementById('phone2');
// const mobileCheckbox3 = document.getElementById('phone3');
const mobileElementsA = document.querySelectorAll('[data-type="informatique"]');
const mobileElementsB = document.querySelectorAll('[data-type="phone"]');

const desktopCheckboxes = document.querySelectorAll('.filter-container-desktop input[type="checkbox"]');
const desktopSelectedFilters = document.querySelector('.selectedFilters-desktop');
const desktopCheckboxA = document.getElementById('informatique-desktop');
const desktopCheckboxB = document.getElementById('phone-desktop');
const desktopElementsA = document.querySelectorAll('[data-type="informatique-desktop"]');
const desktopElementsB = document.querySelectorAll('[data-type="phone-desktop"]');

// Initialisation pour mobile
handleCheckboxChange(mobileCheckboxA, mobileElementsB);
// handleCheckboxChange(mobileCheckbox4, mobileElementsB);
// handleCheckboxChange(mobileCheckbox5, mobileElementsB);
// handleCheckboxChange(mobileCheckbox6, mobileElementsB);
// handleCheckboxChange(mobileCheckbox7, mobileElementsB);
// handleCheckboxChange(mobileCheckbox8, mobileElementsB);
// handleCheckboxChange(mobileCheckbox9, mobileElementsB);
// handleCheckboxChange(mobileCheckbox10, mobileElementsB);
// handleCheckboxChange(mobileCheckbox11, mobileElementsB);
handleCheckboxChange(mobileCheckboxB, mobileElementsA);
// handleCheckboxChange(mobileCheckbox1, mobileElementsA);
// handleCheckboxChange(mobileCheckbox2, mobileElementsA);
// handleCheckboxChange(mobileCheckbox3, mobileElementsA);
handleDualCheckboxChange(mobileCheckboxA, mobileCheckboxB, mobileElementsA, mobileElementsB);
handleCheckboxes(mobileCheckboxes, mobileSelectedFilters, false);
clearAllFilters(mobileCheckboxes, mobileSelectedFilters);


// Initialisation pour desktop
handleCheckboxChange(desktopCheckboxA, desktopElementsB);
handleCheckboxChange(desktopCheckboxB, desktopElementsA);
handleDualCheckboxChange(desktopCheckboxA, desktopCheckboxB, desktopElementsA, desktopElementsB);
handleCheckboxes(desktopCheckboxes, desktopSelectedFilters, true);
clearAllFilters1(desktopCheckboxes, desktopSelectedFilters);


// ================================================================



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

document.getElementById('sidebar-active').addEventListener('change', function () {
    const body = document.body;
    if (this.checked) {
        body.classList.add('no-scroll'); // Désactive le défilement
    }else{
        body.classList.remove('no-scroll'); // Réactive le défilement
    }
} )