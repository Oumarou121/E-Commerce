import { getUserDataValue, updateAddressByIndex, addAddress } from './firebase.js';


const exit_btn = document.getElementById('exit');

exit_btn.addEventListener('click', () => {
    history.back(); // Retourne à la page précédente
});
// Supposons que le productId soit déjà disponible dans ton code
const urlParams = new URLSearchParams(window.location.search);
const pageIndex = urlParams.get('id');


// Assurez-vous que ce script est exécuté après que le DOM est chargé
document.addEventListener("DOMContentLoaded", async () => {

    const form = document.querySelector('.form'); // Remplacer par l'ID de votre formulaire

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le comportement par défaut (rechargement de la page)
        
        // Validation et traitement du formulaire ici
        console.log('Formulaire soumis sans rechargement de la page');

        // Si tout est correct, vous pouvez soumettre le formulaire manuellement, si nécessaire :
        // form.submit();
    });

    if (pageIndex != null) {

     // Masque le spinner après la requête
     //document.getElementById('loading-spinner').style.display = 'block';
    try {
        const userData = await getUserDataValue(); // Récupère les données utilisateur

        if (userData) {
            // Remplir le formulaire avec les données récupérées (comme vu précédemment)
            document.querySelector('input[placeholder="Entrez votre prénom"]').value = userData.addresses[pageIndex].prenom || '';
            document.querySelector('input[placeholder="Entrez votre nom"]').value = userData.addresses[pageIndex].nom || '';
            document.querySelector('input[placeholder="Entrez votre numéro de téléphone"]').value = userData.addresses[pageIndex].phone1 || '';
            document.querySelector('input[placeholder="Entrez votre numéro de téléphone supplémentaire"]').value = userData.addresses[pageIndex].phone2 || '';
            document.querySelector('input[placeholder="Entrez votre Adresse"]').value = userData.addresses[pageIndex].adresse || '';
            document.querySelector('input[placeholder="Insérer les informations supplémentaires"]').value = userData.addresses[pageIndex].adresse_sup || '';
            document.querySelector('select').value = userData.addresses[pageIndex].region || 'Country';

            // Gestion des radios pour le genre
            const gender = userData.addresses[pageIndex].genre || '';
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
        //document.getElementById('loading-spinner').style.display = 'none';
    }
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

    const userData = await getUserDataValue(); // Récupère les données utilisateur

    const updatedData = {
        prenom: document.querySelector('input[placeholder="Entrez votre prénom"]').value,
        nom: document.querySelector('input[placeholder="Entrez votre nom"]').value,
        phone1: document.querySelector('input[placeholder="Entrez votre numéro de téléphone"]').value,
        phone2: document.querySelector('input[placeholder="Entrez votre numéro de téléphone supplémentaire"]').value,
        adresse: document.querySelector('input[placeholder="Entrez votre Adresse"]').value,
        adresse_sup: document.querySelector('input[placeholder="Insérer les informations supplémentaires"]').value,
        region: document.querySelector('select').value,
        genre: document.querySelector('input[name="gender"]:checked').nextElementSibling.textContent,
        select: (pageIndex == null) ? false : userData.addresses[pageIndex].select
    };
    try {
        //document.getElementById('loading-spinner').style.display = 'block';

        // Appeler la fonction pour mettre à jour les données utilisateur
        if (pageIndex != null) {
            await updateAddressByIndex(pageIndex, updatedData);
            console.log(updatedData);
        } else {
            await addAddress(updatedData);
            console.log(updatedData);
        }


        // Afficher un message de succès ou rediriger l'utilisateur
        // alert('Les données utilisateur ont été mises à jour avec succès.');
        //document.getElementById('loading-spinner').style.display = 'none';

    } catch (error) {
        console.error("Erreur lors de la mise à jour des données :", error);
        alert("Une erreur est survenue lors de la mise à jour des données.");
    }finally{
        window.location.href = "profil.html";
    }
});