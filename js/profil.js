import { getUserDataValue } from './firebase.js';

const exit = document.getElementById('exit');
const edit = document.getElementById('edit');
// const name = document.getElementById('data-name');
// const email = document.getElementById('data-email');

exit.addEventListener('click', ()=>{
    // Rediriger vers la page cart.html
    window.location.href = 'index.html';
})

edit.addEventListener('click', ()=>{
    // Rediriger vers la page cart.html
    window.location.href = 'edit.html';
})

async function displayUserData() {
    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';

    const displayElement1 = document.getElementById('data-name');
    const displayElement2 = document.getElementById('data-email');
    const displayElement3 = document.getElementById('data-name1');
    const displayElement4 = document.getElementById('data-adresse');
    const displayElement5 = document.getElementById('data-ville');
    const displayElement6 = document.getElementById('data-phone');
    try {
        const userData = await getUserDataValue();
        if (userData) {
            console.log('Données utilisateur :', userData);
            displayElement1.innerHTML = `${userData.nom} ${userData.prenom}`;
            displayElement2.innerHTML = userData.email;
            displayElement3.innerHTML = `${userData.nom} ${userData.prenom}`;
            displayElement4.innerHTML = `${userData.adresse} , ${userData.adresse_sup}`;
            displayElement5.innerHTML = `${userData.region} , Niger`;
            displayElement6.innerHTML = `+227 ${userData.phone1} / +227 ${userData.phone2}`;
        } else {
            console.log('Aucun utilisateur connecté ou document introuvable');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
    }finally{
         // Masque le spinner après la requête
         document.getElementById('loading-spinner').style.display = 'none';
    }

}

displayUserData();