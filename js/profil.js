// import { getUserDataValue } from './firebase.js';

// const exit = document.getElementById('exit');
// const edit = document.getElementById('edit');
// // const name = document.getElementById('data-name');
// // const email = document.getElementById('data-email');

// exit.addEventListener('click', ()=>{
//     // Rediriger vers la page cart.html
//     window.location.href = 'index.html';
// })

// edit.addEventListener('click', ()=>{
//     // Rediriger vers la page cart.html
//     window.location.href = 'edit.html';
// })

// async function displayUserData() {
//     // Affiche le spinner
//     document.getElementById('loading-spinner').style.display = 'block';

//     const displayElement1 = document.getElementById('data-name');
//     const displayElement2 = document.getElementById('data-email');
//     const displayElement3 = document.getElementById('data-name1');
//     const displayElement4 = document.getElementById('data-adresse');
//     const displayElement5 = document.getElementById('data-ville');
//     const displayElement6 = document.getElementById('data-phone');
//     try {
//         const userData = await getUserDataValue();
//         if (userData) {
//             console.log('Données utilisateur :', userData);
//             displayElement1.innerHTML = `${userData.nom} ${userData.prenom}`;
//             displayElement2.innerHTML = userData.email;
//             displayElement3.innerHTML = `${userData.nom} ${userData.prenom}`;
//             displayElement4.innerHTML = `${userData.adresse} , ${userData.adresse_sup}`;
//             displayElement5.innerHTML = `${userData.region} , Niger`;
//             displayElement6.innerHTML = `+227 ${userData.phone1} / +227 ${userData.phone2}`;
//         } else {
//             console.log('Aucun utilisateur connecté ou document introuvable');
//         }
//     } catch (error) {
//         console.error('Erreur lors de la récupération des données utilisateur:', error);
//     }finally{
//          // Masque le spinner après la requête
//          document.getElementById('loading-spinner').style.display = 'none';
//     }

// }

// displayUserData();

import { getAllAddresses } from './firebase.js';

// Fonction pour récupérer les adresses et les afficher
async function displayAddresses() {

    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';

    const adresseContentDiv = document.getElementById('content'); // Conteneur où les adresses seront ajoutées

    try {
        const addresses = await getAllAddresses(); // Récupère les adresses depuis Firestore

        if (addresses.length > 0) {
            addresses.forEach((address, index) => {
                // Créer un élément div pour chaque adresse
                const adresseDiv = document.createElement('div');
                adresseDiv.classList.add('adresse'); // Ajoute la classe 'methode'
                
                // Insérer le contenu HTML de l'adresse
                adresseDiv.innerHTML = `
                <div id="edit" class="title-content">
                    <div class="title-adresse">Adresse ${index + 1}</div>
                    <i class="uil fs-200 text-green uil-edit"></i>
                </div>
                <div>
                    <hr class="custom-hr1">
                </div>
                <div class="adresse-content">
                    <div class="methode">
                        <h3 class="select">Adresse par défaut :</h3>
                        <p>${address.nom} ${address.prenom}</p>
                        <p>${address.adresse} , ${address.adresse_sup}</p>
                        <p>${address.region} , Niger</p>
                        <p>+227 ${address.phone1} / +227 ${address.phone2}</p>
                    </div>
                </div>
                `;
                
                // Ajouter chaque div à l'intérieur du conteneur adresse-content
                adresseContentDiv.appendChild(adresseDiv);
            });
        } else {
            adresseContentDiv.innerHTML = `<p>Aucune adresse trouvée</p>`;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des adresses :", error);
        adresseContentDiv.innerHTML = `<p>Erreur lors de la récupération des adresses</p>`;
    }finally{
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Appel de la fonction pour afficher les adresses après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    displayAddresses();
});
