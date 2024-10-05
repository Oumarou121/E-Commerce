let qty = document.querySelector("#qtyInput");

function decrement(){
    if (qty.value <= 1) {
        qty.value = 1;
    } else {
        qty.value = parseInt(qty.value) - 1;
    }
}

function increment(){
    if (qty.value >= 10) {
        qty.value = 10;
    } else {
        qty.value = parseInt(qty.value) + 1;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// // Affichez le contenu de l'onglet actif au chargement de la page
// document.getElementById('description').style.display = 'block';

// Sélectionnez tous les liens de navigation
const navLinks = document.querySelectorAll('.bar-nav li a');
const tabContents = document.querySelectorAll('.tab-content');

// Ajoutez un écouteur d'événements pour chaque lien
navLinks.forEach(link => {
    link.addEventListener('click', async function() {
        // Retirez la classe "active" de tous les liens
        navLinks.forEach(nav => nav.classList.remove('active'));

        // Cacher tout le contenu des onglets
        tabContents.forEach(content => content.style.display = 'none');
        await delay(250);  // Pause de 2 secondes
        tabContents.forEach(content => content.style.transform = 'scaleX(0)');
        
        // Ajoutez la classe "active" au lien cliqué
        this.classList.add('active');

        // Afficher le contenu de l'onglet cliqué
        const contentId = link.getAttribute('data-tab');
        document.getElementById(contentId).style.display = 'block';
        await delay(250);  // Pause de 2 secondes
        document.getElementById(contentId).style.transform = 'scaleX(1)';
    });
});


// Sélectionner toutes les vignettes
const thumbnails = document.querySelectorAll('.thumb-container img');

// Sélectionner l'image principale
const mainImage = document.getElementById('main-image');

// Vérifier que l'image principale et les vignettes existent
if (mainImage && thumbnails.length > 0) {
    // Ajouter un écouteur d'événement pour chaque vignette
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Récupérer la source de la vignette cliquée
            const newSrc = this.getAttribute('data-large');
            
            // Vérifier si l'image principale est déjà la même
            if (mainImage.getAttribute('src') === newSrc) {
                return; // Si c'est la même, ne rien faire
            }

            // Transition de fondu en sortie (fade-out)
            mainImage.style.transition = 'opacity 0.5s';
            mainImage.style.opacity = 0;

            // Changer l'image après la transition de fondu en sortie
            setTimeout(() => {
                mainImage.setAttribute('src', newSrc);
                
                // Transition de fondu en entrée (fade-in)
                mainImage.style.opacity = 1;
            }, 500); // Délai de 500ms pour laisser le temps au fade-out
        });
    });
} else {
    console.warn('L\'image principale ou les vignettes sont manquantes.');
}

// Sélectionner les éléments pour le défilement
const scrollContainer = document.getElementById('webizoom');
const scrollLeft = document.getElementById('scroll-left');
const scrollRight = document.getElementById('scroll-right');

// Définit la largeur de défilement à chaque clic (vous pouvez ajuster la valeur)
const scrollAmount = 150;

// Ajouter un événement au clic pour la flèche gauche
scrollLeft.addEventListener('click', () => {
    scrollContainer.scrollBy({
        left: -scrollAmount, // Défiler vers la gauche
        behavior: 'smooth'   // Défilement fluide
    });
});

// Ajouter un événement au clic pour la flèche droite
scrollRight.addEventListener('click', () => {
    scrollContainer.scrollBy({
        left: scrollAmount,  // Défiler vers la droite
        behavior: 'smooth'   // Défilement fluide
    });
});

// ====================================================================

import { getProductById,  addToFavorites, removeFromFavorites, isFavorite, addToCart, isInCart, getCartItems} from './firebase.js'; // Assurez-vous d'avoir cette fonction

function formatPrice(price) {
    // Assurez-vous que le prix est un nombre
    if (isNaN(price)) return price; // Retourne le prix tel quel s'il n'est pas un nombre

    // Convertit le prix en chaîne et remplace les virgules par des points
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

async function loadProductDetails() {
    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';    
    await delay(250);

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error('Aucun ID de produit trouvé dans l\'URL.');
        return;
    }

    try {
        const product = await getProductById(productId);

        if (!product) {
            console.error('Produit non trouvé.');
            return;
        }

        // Mettre à jour l'image principale
        const mainImage = document.getElementById('main-image');
        mainImage.src = product.images[0];

        // Mettre à jour l'image principale
        const marqueImage = document.getElementById('marque-icon');
        marqueImage.src = product.marque;

        // Mettre à jour le name
        document.getElementById('name').innerText = product.name;

        // Mettre à jour la référence, la description, le prix, et la disponibilité
        document.getElementById('product-reference').innerText = `Référence : ${product.reference}`;
        document.getElementById('product-description').innerText = product.description;
        document.getElementById('product-price').innerText = formatPrice(product.price) + ' FCFA';
        document.getElementById('product-stock').innerText = product.stock > 0 ? 'En stock' : 'Indisponible';

        // Remplir les vignettes d'images
        const thumbnailList = document.getElementById('thumbnail-list');
        thumbnailList.innerHTML = '';

        product.images.forEach((img, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('thumb-container');
            listItem.innerHTML = `<img src="${img}" alt="Vignette ${index + 1}" data-large="${img}">`;
            thumbnailList.appendChild(listItem);
        });

        // Ajout d'écouteurs d'événements aux vignettes pour changer l'image principale
        const thumbnails = thumbnailList.querySelectorAll('.thumb-container img');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const newSrc = this.getAttribute('data-large');
                
                // Transition de fondu en sortie
                mainImage.style.transition = 'opacity 0.5s';
                mainImage.style.opacity = 0;

                // Changer l'image après la transition de fondu en sortie
                setTimeout(() => {
                    mainImage.setAttribute('src', newSrc);
                    // Transition de fondu en entrée
                    mainImage.style.opacity = 1;
                }, 500); // Délai de 500ms pour laisser le temps au fade-out
            });
        });

        // Remplir les spécifications
        const specsTable = document.getElementById('specs-table');
        specsTable.innerHTML = '';
        for (const [key, value] of Object.entries(product.specs || {})) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${key}</td><td>${value}</td>`;
            specsTable.appendChild(row);
        }

        // Exemple d'utilisation de la section des avis
        const reviewsSection = document.getElementById('reviews-section');
        reviewsSection.innerHTML = ''; // Réinitialise le contenu précédent

        // Vérifier si product.review est un objet
if (typeof product.review === 'object' && !Array.isArray(product.review)) {
    // Convertir l'objet en tableau
    const reviewsArray = Object.values(product.review);
    
    reviewsArray.forEach(item => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');

        // Si timestamp est un code temporel Firebase, convertir en objet Date
        const timestamp = item.timestamp; // Assumer que c'est un Firebase Timestamp
        const date = timestamp.toDate(); // Convertir en objet Date
        
        // Formater la date en français
        const formattedDate = date.toLocaleString('fr-FR', {
            timeZone: 'UTC',
            hour12: false
        });

         // Créer une chaîne d'étoiles en fonction du rating
         const starRating = '★'.repeat(item.rating); // Génère autant d'étoiles que la note
         const emptyStars = '☆'.repeat(5 - item.rating); // Ajoute des étoiles vides pour compléter jusqu'à 5

        // Créer le contenu de l'avis
        reviewDiv.innerHTML = `
            <strong>Utilisateur : ${item.userName}</strong> <br>
            <span>Évaluation: ${starRating}${emptyStars}</span> <br>
            <p>${item.comment}</p>
            <small>${formattedDate}</small>
        `;

        // Ajouter l'avis à la section des avis
        reviewsSection.appendChild(reviewDiv);
    });
} else {
    console.error('Les avis ne sont pas au format attendu.');
}
    } catch (error) {
        console.error('Erreur lors du chargement du produit :', error);
    }finally {
        // Masque le spinner après la requête
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

loadProductDetails();

document.getElementById('increment').addEventListener('click', () => {
   increment();
});

document.getElementById('decrement').addEventListener('click', () => {
    decrement();
});

document.addEventListener("DOMContentLoaded", async function () {
    const favoriBtn = document.getElementById("add-favori");
    const cartBtn = document.getElementById("add-cart");

    // Supposons que le productId soit déjà disponible dans ton code
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    try {
        // Vérification initiale si le produit est dans les favoris
        const isFavori = await isFavorite(productId);

        // Mise à jour du bouton Favori en fonction de l'état actuel
        if (isFavori) {
            favoriBtn.classList.add("favorited");
        } else {
            favoriBtn.classList.remove("favorited");
        }

        // Gestion des favoris au clic
        favoriBtn.addEventListener("click", async function () {
            const isFavori = await isFavorite(productId);

            if (isFavori) {
                await removeFromFavorites(productId);
                favoriBtn.classList.remove("favorited");
                showFavoriteAlert('Le produit a été retiré de votre liste.');
            } else {
                await addToFavorites(productId);
                favoriBtn.classList.add("favorited");
                showFavoriteAlert('Le produit a été ajouté à votre liste.');
            }
        });

        cartBtn.addEventListener("click", async function () {
            const isInCartFlag = await isInCart(productId); // Vérifie si le produit est déjà dans le panier
        
            // Récupère la quantité entrée par l'utilisateur
            const nbr = parseInt(qty.value); // Assure-toi que `qty` est l'élément input pour la quantité
        
            if (!isInCartFlag) {
                // Si le produit n'est pas dans le panier, on l'ajoute avec la quantité spécifiée
                await addToCart(productId, nbr);
                console.log("Produit ajouté au panier avec une quantité de", nbr);
                showAlert("Produit ajouté au panier avec une quantité de", nbr);
            } else {
                // Si le produit est déjà dans le panier, on récupère la quantité actuelle
                const currentItem = await getCartItems(); // Récupère les articles du panier
                const currentProduct = currentItem.find(item => item.id === productId);
        
                if (currentProduct) {
                    const newQuantity = currentProduct.qty + nbr; // Incrémente la quantité
                    await addToCart(productId, newQuantity); // Met à jour la quantité dans le panier
                    console.log("Quantité du produit mise à jour à", newQuantity);
                    showAlert("Quantité du produit mise à jour à", newQuantity);
                }
            }
        });
    } catch (error) {
        console.error("Erreur:", error);
    }
});

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