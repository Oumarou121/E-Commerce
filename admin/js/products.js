// Fonction de "debounce" pour retarder la recherche
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Filtrer les commandes en fonction de la recherche avec le "debounce"
document.getElementById('search').addEventListener('input', debounce(function () {
    const searchValue = this.value.toLowerCase();
    const orderRows = document.querySelectorAll('#productTable tbody tr');
    
    orderRows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchValue)) {
            row.style.display = ''; // Afficher la ligne
        } else {
            row.style.display = 'none'; // Masquer la ligne
        }
    });
}, 300)); // Délai de 300 ms pour le "debounce"


// Function to add a new product
function addProductData(productId, productName, productCategory, productPrice, productStock) {
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const newRow = productTable.insertRow();

    newRow.innerHTML = `
        <td>${productId}</td>
        <td>${productName}</td>
        <td>${productCategory}</td>
        <td>${formatPrice(productPrice)} FCFA</td>
        <td>${productStock}</td>
        <td>
            <button onclick="editProduct(${productId})">Edit</button>
        </td>
    `;
}

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Function to edit a product
function editProduct(productId) {
    alert(`Edit product with ID: ${productId}`);
    // Here you would open a modal or form to edit the product details
}

// Function to delete a product
function deleteProduct(productId) {
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    for (let i = 0; i < productTable.rows.length; i++) {
        if (parseInt(productTable.rows[i].cells[0].innerText) === productId) {
            productTable.deleteRow(i);
            break;
        }
    }
}

import { getProductsList, addProduct, uploadImageToStorage } from './../../js/firebase.js';


function isNumber(value) {
    return Number.isFinite(value);
}

async function LoadListProducts() {
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    try {
        const ProductsList = await getProductsList();

        if (ProductsList.length > 0) {
            productTable.innerHTML = '';


            ProductsList.forEach(async product => {                
                if (isNumber(product.productId)) {
                    const cat = (product.category["sous-category"].id === "") ? product.category.name : product.category["sous-category"].name;
                    addProductData(product.productId, product.name, cat, product.price, product.stock)
                }
            });
        } else {
            productTable.innerHTML = `
            <div class="cart vide bold-800 flex" id="emptyCartMessage3" style="display: flex;">
                <i class="uil uil-box"></i>
                <p>Products Is Empty</p>
            </div>
            `;
        }
    } catch (error) {
        console.log('Erreur lors de la récupération des produits', error);
        productTable.innerHTML = '<p>Erreur lors du chargement des produits.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await LoadListProducts();
});

// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement
}

// Fonction pour fermer l'alerte et réactiver les interactions
function closeCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'none'; // Cache l'alerte
    pageContent.classList.remove('no-interaction'); // Réactive les interactions sur la page
    body.classList.remove('no-scroll'); // Réactive le défilement
}

// Fermer l'alerte sans suppression lors du clic sur la croix
document.getElementById('closeAlert').addEventListener('click', closeCustomAlert);

// Ouvrir l'alerte lors du clic sur un bouton spécifique
document.getElementById('add').addEventListener('click', openCustomAlert);

 // Les options de sous-catégorie pour chaque catégorie
 const sousCategories = {
    "Téléphonie & Tablette": [
        { value: "Smartphone", text: "Smartphone" },
        { value: "SmartWatch", text: "SmartWatch" },
        { value: "Accessoires", text: "Accessoires" }
    ],
    "Informatique": [
        { value: "Ordinateur de Bureau", text: "Ordinateur de Bureau" },
        { value: "Ordinateur Portable", text: "Ordinateur Portable" },
        { value: "Accessoires", text: "Accessoires" }
    ]
};

// Références des éléments
const categorySelect = document.getElementById('category-select');
const sousCategorySelect = document.getElementById('sous-category-select');

// Fonction pour mettre à jour les sous-catégories en fonction de la catégorie sélectionnée
function updateSousCategories() {
    const selectedCategory = categorySelect.value;

    // Vider les options actuelles de la sous-catégorie
    sousCategorySelect.innerHTML = '<option value="" disabled selected hidden>Sélectionnez une sous-catégorie</option>';

    // Ajouter les nouvelles options basées sur la catégorie sélectionnée
    if (sousCategories[selectedCategory]) {
        sousCategories[selectedCategory].forEach(sousCategory => {
            const option = document.createElement('option');
            option.value = sousCategory.value;
            option.text = sousCategory.text;
            sousCategorySelect.appendChild(option);
        });
    }
}

// Ajouter un écouteur d'événement pour le changement de la catégorie
categorySelect.addEventListener('change', updateSousCategories);

// Fonction pour configurer les événements d'affichage des images
function setupImageUpload(chooseBtnId, fileInputId, previewId, chooseTextId) {
    const chooseBtn = document.getElementById(chooseBtnId);
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewId);

    // Ouvrir le sélecteur de fichier en cliquant sur le bouton de sélection
    chooseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Afficher l'aperçu de l'image sélectionnée
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block'; // Afficher l'aperçu
                chooseBtn.style.display = 'none'; // Masquer le bouton de sélection
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none'; // Masquer l'aperçu si aucune image n'est choisie
            chooseBtn.style.display = 'flex'; // Réafficher le bouton de sélection
        }
    });

    // Permettre de changer l'image en cliquant sur l'aperçu
    preview.addEventListener('click', () => {
        fileInput.click(); // Ouvrir le sélecteur de fichier
    });
}

// Configuration pour l'image principale
setupImageUpload('chooseMainImage', 'mainImage', 'mainImagePreview');

// Configuration pour l'image de la marque
// setupImageUpload('chooseMainImageMarque', 'mainImageMarque', 'mainImagePreviewMarque', 'marqueContent');


// Ajouter un événement pour le bouton d'ajout d'image secondaire
document.getElementById('addSecondaryImage').addEventListener('click', function () {
    const container = document.getElementById('secondaryImagesContainer');
    const div = document.createElement('div');
    div.classList.add('contentSecondImg');

    // Création du champ input de type file pour les images
    const input = document.createElement('input');
    input.classList.add('inputImage');
    input.type = 'file';
    input.accept = 'image/*';

    // Afficher le nom du fichier sélectionné lorsqu'un fichier est choisi
    input.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            input.value = file.name;
        }
    });

    // Création de l'icône de suppression
    const removeIcon = document.createElement('i');
    removeIcon.classList.add('uil', 'uil-trash');

    // Ajouter un événement au clic sur l'icône de suppression pour supprimer la div correspondante
    removeIcon.addEventListener('click', function () {
        container.removeChild(div);
    });

    // Ajouter les éléments créés (icône de téléchargement, champ input et icône de suppression) à la div
    // div.appendChild(uploadIcon);
    div.appendChild(input);
    div.appendChild(removeIcon);
    container.appendChild(div);
});

// Ajouter un événement pour le bouton d'ajout d'image secondaire
document.getElementById('specsAdd').addEventListener('click', function () {
    const container = document.getElementById('specsContent');
    const div = document.createElement('div');
    div.classList.add('column');

    // Création du contenu HTML pour le champ de saisie et l'icône de suppression
    div.innerHTML = `
        <div class="input-box1">
            <input type="text" placeholder="Entrez le nom" required />
        </div>
        <div class="input-box1 specs">
            <input type="text" placeholder="Entrez la valeur" required />
            <i class="uil uil-trash"></i>
        </div>
    `;

    // Sélection de l'icône de suppression
    const removeIcon = div.querySelector('.uil-trash');

    // Ajouter un événement au clic sur l'icône de suppression pour supprimer la div correspondante
    removeIcon.addEventListener('click', function () {
        container.removeChild(div);
    });

    // Ajouter la div créée au conteneur
    container.appendChild(div);
});

// Fonction pour récupérer les spécifications sous forme de mappage pour Firebase
function getAllSpecsMapping() {
    const specsMapping = {};
    const container = document.getElementById('specsContent');
    
    // Récupérer toutes les divs qui contiennent les champs de spécifications
    const columns = container.querySelectorAll('.column');

    // Parcourir chaque colonne pour extraire les noms et les valeurs
    columns.forEach(column => {
        const nameInput = column.querySelector('input[placeholder="Entrez le nom"]');
        const valueInput = column.querySelector('input[placeholder="Entrez la valeur"]');

        if (nameInput && valueInput) {
            const name = nameInput.value.trim();
            const value = valueInput.value.trim();

            // Ajouter au mappage si les champs ne sont pas vides
            if (name && value) {
                specsMapping[name] = value;
            }
        }
    });

    return specsMapping;
}

// Fonction pour collecter les données du produit
async function getProductData() {
    const name = document.querySelector('input[placeholder="Entrez le nom du produit"]').value;
    const descp = document.getElementById('motif').value.trim();
    const ref = document.querySelector('input[placeholder="Entrez la réfrence du produit"]').value;
    const prix = document.querySelector('input[placeholder="Entrez le prix du produit"]').value;
    const qty = document.querySelector('input[placeholder="Entrez la quandtité en stock"]').value;
    const marque = document.querySelector('input[placeholder="Entrez la marque du produit"]').value;
    const category = document.getElementById('category-select').value;
    const sous_category = document.getElementById('sous-category-select').value;
    const mainImageFile = document.getElementById('mainImage').files[0];
    const specs = getAllSpecsMapping();

    const secondaryImageElements = document.querySelectorAll('.inputImage');
    const secondaryImageFiles = Array.from(secondaryImageElements).map(input => input.files[0]);

    // Télécharger l'image principale et les images secondaires
    const mainImageUrl = mainImageFile ? await uploadImageToStorage(mainImageFile, `products/${name}/mainImage`) : '';
    const secondaryImageUrls = await Promise.all(
        secondaryImageFiles.map((file, index) => uploadImageToStorage(file, `products/${name}/secondaryImage${index}`))
    );

    return {
        name : name,
        reference : ref,
        price : prix,
        stock : qty,
        marque : marque,
        category : category,
        sous_category : sous_category,
        description : descp,
        images : 
        [
            mainImageUrl,
            ...secondaryImageUrls
        ],
        specs : specs
    };
}

// Ajouter l'événement de confirmation pour ajouter le produit
document.getElementById('confirmer').addEventListener('click', async () => {
    try {
        const productData = await getProductData();
        await addProduct(productData); // Sauvegarder les données du produit dans Firestore
        alert('Produit ajouté avec succès!');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        alert('Échec de l\'ajout du produit.');
    }
});