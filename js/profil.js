import { getUserDataValue, deleteAddressByIndex, updateAddressByIndex } from './firebase.js';

// Fonction pour récupérer les adresses et les afficher
async function displayAddresses() {
    document.getElementById('loading-spinner').style.display = 'block';

    const adresseContentDiv = document.getElementById('content'); // Conteneur où les adresses seront ajoutées

    // Supprimer uniquement les éléments contenant les adresses
    const existingAddresses = adresseContentDiv.querySelectorAll('.adresse');
    existingAddresses.forEach((element) => element.remove());

    try {
        const userData = await getUserDataValue(); // Récupère les adresses depuis Firestore
        const addresses = userData.addresses;

        if (addresses.length > 0) {
            addresses.forEach((address, index) => {
                const adresseDiv = document.createElement('div');
                adresseDiv.classList.add('adresse'); // Ajoute la classe 'methode'

                const ads = (address.adresse_sup == "") ? address.adresse : `${address.adresse} , ${address.adresse_sup}`;
                const phone = (address.phone1 == "" && address.phone2 == "") ? `........` :  (address.phone2 == "") ? `+227 ${address.phone1}` : `+227 ${address.phone1} / +227 ${address.phone2}`;
                const region = (address.region == "") ? `........` : `${address.region} , Niger` ;

                adresseDiv.innerHTML = `
                <div id="edit" class="title-content">
                    <div class="title-adresse">Adresse ${index + 1}</div>
                    <div class="iconss">
                        <i class="uil fs-200 text-green uil-edit" title="Edit"></i>
                        <i class="uil fs-200 text-red uil-trash-alt" title="Delete"></i>
                        <i class="uil fs-200 text-blue uil-exchange" title="Selectionner"></i>
                    </div>
                </div>
                <div>
                    <hr class="custom-hr1">
                </div>
                <div class="adresse-content">
                    <div class="methode">
                        <h3 class="select">Adresse par défaut :</h3>
                        <p>${address.prenom} ${address.nom}</p>
                        <p>${ads}</p>
                        <p>${region}</p>
                        <p>${phone}</p>
                    </div>
                </div>
                `;

                const select = adresseDiv.querySelector(".select");
                const exchange = adresseDiv.querySelector(".uil-exchange");
                if (select) {
                    if (address.select) {
                        select.style.display = "block";
                        exchange.style.display = "none";
                        const displayElement1 = document.getElementById('data-name');
                        const displayElement2 = document.getElementById('data-email');
                        displayElement1.innerHTML = `${address.prenom} ${address.nom}`;
                        displayElement2.innerHTML = userData.email;
                    } else {
                        select.style.display = "none";
                    }
                }

                const editIcon = adresseDiv.querySelector('.uil-edit');
                editIcon.addEventListener('click', () => {
                    window.location.href = `edit.html?id=${index}`;
                });

                const deleteIcon = adresseDiv.querySelector('.uil-trash-alt');
                deleteIcon.addEventListener('click', () => {
                    openCustomAlertDelete(index); // Passe l'index de l'adresse à supprimer
                });

                exchange.addEventListener('click', async() => {
                    await changeCurrent(index);
                });

                // Ajouter chaque div à l'intérieur du conteneur adresse-content
                adresseContentDiv.appendChild(adresseDiv);
            });
        } else {
            adresseContentDiv.innerHTML += `<p>Aucune adresse trouvée</p>`; // Utilise "+=" pour ne pas effacer d'autres éléments
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des adresses :", error);
        adresseContentDiv.innerHTML += `<p>Erreur lors de la récupération des adresses</p>`;
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Fonction pour ouvrir l'alerte et désactiver les interactions
function openCustomAlertDelete(index) {
    const customAlert = document.getElementById('customAlertDelete');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'flex'; // Affiche l'alerte
    pageContent.classList.add('no-interaction'); // Désactive les interactions sur le reste de la page
    body.classList.add('no-scroll'); // Désactive le défilement

    // Attacher l'événement au bouton de confirmation avec l'index actuel
    document.getElementById('confirmBtnDelete').onclick = async () => {
        document.getElementById('loading-spinner').style.display = 'block';

        try {
            await deleteAddressByIndex(index); // Supprimer l'adresse à l'index spécifié
        } catch (error) {
            console.error("Erreur lors de la suppression de l'adresse :", error);
        } finally {
            closeCustomAlertDelete(); // Ferme l'alerte après suppression
            document.getElementById('loading-spinner').style.display = 'none';
            displayAddresses(); // Actualise la liste des adresses après suppression
        }
    };
}

// Fonction pour fermer l'alerte et réactiver les interactions
function closeCustomAlertDelete() {
    const customAlert = document.getElementById('customAlertDelete');
    const pageContent = document.getElementById('main');
    const body = document.body;

    customAlert.style.display = 'none'; // Cache l'alerte
    pageContent.classList.remove('no-interaction'); // Réactive les interactions sur la page
    body.classList.remove('no-scroll'); // Réactive le défilement
}

// Fermer l'alerte sans suppression lors du clic sur la croix
document.getElementById('closeAlertDelete').addEventListener('click', closeCustomAlertDelete);

// Appel de la fonction pour afficher les adresses après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    displayAddresses();
});

async function changeCurrent(pageIndex) {
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        const userData = await getUserDataValue(); // Récupère les données utilisateur
        const addresses = userData.addresses;

        if (userData) {
            // Utiliser une boucle for...of pour gérer async/await dans la boucle
            for (const [index, address] of addresses.entries()) {
                if (index == pageIndex) {
                    console.log(`page : ${index}`);
                    const updatedData = {
                        prenom: address.prenom,
                        nom: address.nom,
                        phone1: address.phone1,
                        phone2: address.phone2,
                        adresse: address.adresse,
                        adresse_sup: address.adresse_sup,
                        region: address.region,
                        genre: address.genre,
                        select: true // Cette adresse devient l'adresse sélectionnée
                    };
                    await updateAddressByIndex(index, updatedData);
                } else if (address.select) {
                    console.log(`Désélectionner : ${index}`);
                    const updatedData1 = {
                        prenom: address.prenom,
                        nom: address.nom,
                        phone1: address.phone1,
                        phone2: address.phone2,
                        adresse: address.adresse,
                        adresse_sup: address.adresse_sup,
                        region: address.region,
                        genre: address.genre,
                        select: false // Désélectionner cette adresse
                    };
                    await updateAddressByIndex(index, updatedData1);
                }
            }
        }

    } catch (error) {
        console.error("Erreur lors de la mise à jour des adresses :", error);
    } finally {
        // Cacher le spinner après la fin de toutes les opérations ou en cas d'erreur
        displayAddresses(); // Actualise la liste des adresses après suppression
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

document.getElementById('add').addEventListener('click', ()=> {
    window.location.href = 'edit.html'
})

document.getElementById('deleteAccount').addEventListener('click', ()=> {
    window.location.href = 'account.html'
})