


import { addMessage } from './firebase.js';

document.getElementById('message').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const contentInput = document.getElementById('content');
    const contentError = document.getElementById('content-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Réinitialiser les messages d'erreur
    emailError.textContent = '';
    emailInput.classList.remove('error');
    contentError.textContent = '';
    contentInput.classList.remove('error');

    let isValid = true;

    // Validation de l'e-mail
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        isValid = false;
    } else if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
        isValid = false;
    }

    // Validation du contenu
    if (!contentInput.value.trim()) {
        contentError.textContent = 'Required';
        contentInput.classList.add('error');
        isValid = false;
    }

    // Si le formulaire est valide, exécuter l'action de soumission
    if (isValid) {
        try {
            // Ajouter le message dans Firestore
            await addMessage(emailInput.value.trim(), contentInput.value.trim());
            showAlert1('Votre message a été envoyé avec succès.');
            // Réinitialiser le formulaire après l'envoi
            emailInput.value = '';
            contentInput.value = '';
        } catch (error) {
            showAlert1('Une erreur est survenue lors de l\'envoi de votre message.');
        }
    }
});


// Fonction pour afficher l'alerte au centre de l'écran
function showAlert1(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', 'show');
    alertBox.innerHTML = `
    <span class="text-black">${message}<a href="#"> </a></span>
    <span class="close-btn"></span>
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