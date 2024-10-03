import { getUserDataValue, updateUserData } from './firebase.js';


const exit_btn = document.getElementById('exit');

exit_btn.addEventListener('click', ()=> {

    window.location.href = 'profil.html';

});

// async function displayUserData() {
//     try {
//         const userData = await getUserDataValue();
//         if (userData) {
//             console.log('Données utilisateur :', userData);
//         } else {
//             console.log('Aucun utilisateur connecté ou document introuvable');
//         }
//     } catch (error) {
//         console.error('Erreur lors de la récupération des données utilisateur:', error);
//     }
// }

// displayUserData();

// Assurez-vous que ce script est exécuté après que le DOM est chargé
document.addEventListener("DOMContentLoaded", async () => {
     // Masque le spinner après la requête
     document.getElementById('loading-spinner').style.display = 'block';
    try {
        const userData = await getUserDataValue(); // Récupère les données utilisateur

        if (userData) {
            // Remplir le formulaire avec les données récupérées (comme vu précédemment)
            document.querySelector('input[placeholder="Entrez votre prénom"]').value = userData.prenom || '';
            document.querySelector('input[placeholder="Entrez votre nom"]').value = userData.nom || '';
            document.querySelector('input[placeholder="Entrez votre numéro de téléphone"]').value = userData.phone1 || '';
            document.querySelector('input[placeholder="Entrez votre numéro de téléphone supplémentaire"]').value = userData.phone2 || '';
            document.querySelector('input[placeholder="Entrez votre Adresse"]').value = userData.adresse || '';
            document.querySelector('input[placeholder="Insérer les informations supplémentaires"]').value = userData.adresse_sup || '';
            document.querySelector('select').value = userData.region || 'Country';

            // Gestion des radios pour le genre
            const gender = userData.genre || '';
            if (gender === "Homme") {
                document.getElementById('check-male').checked = true;
            } else if (gender === "Femme") {
                document.getElementById('check-female').checked = true;
            } else {
                document.getElementById('check-other').checked = true;
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
    }finally {
        // Masque le spinner après la requête
        document.getElementById('loading-spinner').style.display = 'none';
    }
});

// Sauvegarder les données utilisateur lorsque le formulaire est soumis
document.querySelector('.form').addEventListener('submit', async (event) => {
    const selectRegion = document.getElementById('region-select');
    
    // Vérifier si une option valide a été choisie
    if (selectRegion.value === "") {
        alert("Veuillez sélectionner une région.");
        event.preventDefault(); // Empêche la soumission du formulaire si la région n'est pas sélectionnée
    }

    const updatedData = {
        prenom: document.querySelector('input[placeholder="Entrez votre prénom"]').value,
        nom: document.querySelector('input[placeholder="Entrez votre nom"]').value,
        phone1: document.querySelector('input[placeholder="Entrez votre numéro de téléphone"]').value,
        phone2: document.querySelector('input[placeholder="Entrez votre numéro de téléphone supplémentaire"]').value,
        adresse: document.querySelector('input[placeholder="Entrez votre Adresse"]').value,
        adresse_sup: document.querySelector('input[placeholder="Insérer les informations supplémentaires"]').value,
        region: document.querySelector('select').value,
        genre: document.querySelector('input[name="gender"]:checked').nextElementSibling.textContent
    };

    try {
        // Récupérer l'ID de l'utilisateur connecté
        const userData = await getUserDataValue();
        const userId = userData.id;
        console.log(userId);

        // Appeler la fonction pour mettre à jour les données utilisateur
        await updateUserData(userId, updatedData);

        // Afficher un message de succès ou rediriger l'utilisateur
        // alert('Les données utilisateur ont été mises à jour avec succès.');
    } catch (error) {
        console.error("Erreur lors de la mise à jour des données :", error);
        alert("Une erreur est survenue lors de la mise à jour des données.");
    }
});