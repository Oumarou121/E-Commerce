import { signUp, signIn, resetPassword } from './firebase.js';

var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("password");
var k = document.getElementById("forgot-password");
const focus1 = document.querySelector('.login__segmented-btn');
const focus2 = document.querySelector('.login__segmented-btn1');
const title = document.querySelector('.title');


function forgot_password(){
        x.style.left = "-400px";
        y.style.left = "-400px";
        z.style.left = "-400px";
        k.style.left = "20px";
        // console.log("mobile");
}

function password(){
        x.style.left = "-400px";
        y.style.left = "-400px";
        k.style.left = "-400px";
        z.style.left = "20px";
        // console.log("mobile");
}

function register(){
        focus1.setAttribute('aria-selected', false);
        focus2.setAttribute('aria-selected1', true);
        x.style.left = "-400px";
        y.style.left = "20px";
        z.style.left = "800px";
        k.style.left = "800px";
        title.textContent = 'Create an Account';
}

function login(){
        focus1.setAttribute('aria-selected', true);
        focus2.setAttribute('aria-selected1', false);
        x.style.left = "20px";
        y.style.left = "450px";
        z.style.left = "800px";
        k.style.left = "800px";
        title.textContent = 'Welcome Back';  
}
document.getElementById('login-btn1').addEventListener('click', login);
document.getElementById('login-btn2').addEventListener('click', register);
document.getElementById('forgot-password-btn').addEventListener('click', forgot_password);
document.getElementById('back-login-btn').addEventListener('click', login);
document.getElementById('back-register-btn').addEventListener('click', register);



const eyeButton = document.querySelector('.login__eye');
const eyeIconOff = document.querySelector('[data-icon="eye-off"]');
const eyeIconOn = document.querySelector('[data-icon="eye-on"]');
const passwordInput = document.querySelector('#user-password'); // Assure-toi que cet ID correspond au champ de mot de passe

// Initialisation : on cache l'icône 'eye-on' (l'œil ouvert) et on montre 'eye-off'
eyeIconOff.classList.add('show');
eyeIconOn.classList.add('hide');

eyeButton.addEventListener('click', function() {
    // Bascule la visibilité du mot de passe
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Bascule les icônes en fonction du type de mot de passe
    if (type === 'password') {
        eyeIconOff.classList.add('show');
        eyeIconOff.classList.remove('hide');
        eyeIconOn.classList.add('hide');
        eyeIconOn.classList.remove('show');
    } else {
        eyeIconOff.classList.add('hide');
        eyeIconOff.classList.remove('show');
        eyeIconOn.classList.add('show');
        eyeIconOn.classList.remove('hide');
    }
});

const eyeButton1 = document.querySelectorAll('.login__eye')[1];
const eyeIconOff1 = document.querySelector('[data-icon="eye-off1"]');
const eyeIconOn1 = document.querySelector('[data-icon="eye-on1"]');
const passwordInput1 = document.querySelector('#pf-user-password1'); // Assure-toi que cet ID correspond au champ de mot de passe

// Initialisation : on cache l'icône 'eye-on' (l'œil ouvert) et on montre 'eye-off'
eyeIconOff1.classList.add('show');
eyeIconOn1.classList.add('hide');

eyeButton1.addEventListener('click', function() {
    // Bascule la visibilité du mot de passe
    const type = passwordInput1.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput1.setAttribute('type', type);

    // Bascule les icônes en fonction du type de mot de passe
    if (type === 'password') {
        eyeIconOff1.classList.add('show');
        eyeIconOff1.classList.remove('hide');
        eyeIconOn1.classList.add('hide');
        eyeIconOn1.classList.remove('show');
    } else {
        eyeIconOff1.classList.add('hide');
        eyeIconOff1.classList.remove('show');
        eyeIconOn1.classList.add('show');
        eyeIconOn1.classList.remove('hide');
    }
});


const eyeButton2 = document.querySelectorAll('.login__eye')[2];
const eyeIconOff2 = document.querySelector('[data-icon="eye-off2"]');
const eyeIconOn2 = document.querySelector('[data-icon="eye-on2"]');
const passwordInput2 = document.querySelector('#pf-user-password2'); // Assure-toi que cet ID correspond au champ de mot de passe

// Initialisation : on cache l'icône 'eye-on' (l'œil ouvert) et on montre 'eye-off'
eyeIconOff2.classList.add('show');
eyeIconOn2.classList.add('hide');

eyeButton2.addEventListener('click', function() {
    // Bascule la visibilité du mot de passe
    const type = passwordInput2.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput2.setAttribute('type', type);

    // Bascule les icônes en fonction du type de mot de passe
    if (type === 'password') {
        eyeIconOff2.classList.add('show');
        eyeIconOff2.classList.remove('hide');
        eyeIconOn2.classList.add('hide');
        eyeIconOn2.classList.remove('show');
    } else {
        eyeIconOff2.classList.add('hide');
        eyeIconOff2.classList.remove('show');
        eyeIconOn2.classList.add('show');
        eyeIconOn2.classList.remove('hide');
    }
});


document.getElementById('password').addEventListener('submit', async(e) => {
    e.preventDefault(); // Empêche la soumission du formulaire avant la validation

    const password1 = document.querySelector('#pf-user-password1');
    const password2 = document.querySelector('#pf-user-password2');
    const error1 = document.getElementById('pf-password-error1');
    const error2 = document.getElementById('pf-password-error2');

    // Réinitialiser les messages d'erreur
    error1.textContent = '';
    error2.textContent = '';
    password1.classList.remove('error');
    password2.classList.remove('error');

    if (password1.value.trim() === '' && password2.value.trim() === '') {
        error1.textContent = 'Required';
        password1.classList.add('error');
        error2.textContent = 'Required';
        password2.classList.add('error');
        return;
    }

    // Vérification si les champs sont vides
    if (password1.value.trim() === '') {
        error1.textContent = 'Veuillez entrer un mot de passe.';
        password1.classList.add('error');
        return;
    }
    
    if (password2.value.trim() === '') {
        error2.textContent = 'Veuillez confirmer votre mot de passe.';
        password2.classList.add('error');
        return;
    }

    // Vérification de la longueur du mot de passe
    if (password1.value.length < 8) {
        error1.textContent = 'Le mot de passe doit contenir au moins 8 caractères.';
        password1.classList.add('error');
        return;
    }


    // Vérification de la correspondance des mots de passe
    if (password1.value !== password2.value) {
        error2.textContent = 'Les mots de passe ne correspondent pas.';
        password2.classList.add('error');
        return;
    }
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('register-user-email').value;
    const password = document.querySelector('#pf-user-password1').value;

    const result = await signUp(name,email,password);

    if (result.status === 200) {
        // console.log('Inscription réussie:', result.message);
        // Rediriger ou afficher un message de succès
        // error2.textContent = result.message;
        window.location.href = 'index.html';

    } else if (result.status === 400) {
        console.log('Erreur lors de l\'inscription:', result.message);
        // Afficher le message d'erreur à l'utilisateur
        error2.textContent = result.message;
    }
});


// Sélectionner le bouton avec data-action="continue"
document.querySelector('[data-action="register_continue"]').addEventListener('click', function(e) {
    // Empêcher la soumission par défaut
    e.preventDefault();

    // Sélection des champs à valider
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('register-user-email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('register-email-error');

    // Réinitialiser les messages d'erreur
    nameError.textContent = '';
    emailError.textContent = '';
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');

    if (nameInput.value.trim().length < 4 && !emailPattern.test(emailInput.value)) {
        nameError.textContent = 'Required';
        nameInput.classList.add('error');
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        return;
    }

    // Vérification du champ Name (au moins 4 caractères)
    if (nameInput.value.trim().length < 4) {
        nameError.textContent = 'Le nom doit contenir au moins 4 lettres.';
        nameInput.classList.add('error');
        return;
    }

    // Vérification de l'email (utilisation d'une regex pour vérifier la validité)
    if (emailInput.value === '') {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        return;
    }

    // Vérification de l'email (utilisation d'une regex pour vérifier la validité)
    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
        return;
    }

    // Si toutes les validations sont correctes, soumettre le formulaire
    password(); // Soumission du formulaire
});


document.querySelector('[data-action="fg_continue"]').addEventListener('click', async(e) => {
    // Empêcher la soumission du formulaire par défaut
    e.preventDefault();

    // Sélectionner l'input et l'élément d'erreur
    const emailInput = document.getElementById('fg-user-email');
    const emailError = document.getElementById('fg-email-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Réinitialiser le message d'erreur
    emailError.textContent = '';
    emailInput.classList.remove('error');

    // Vérification de l'email (utilisation d'une regex pour vérifier la validité)
    if (emailInput.value === '') {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        return;
    }

    // Vérification du format de l'email
    if (!emailPattern.test(emailInput.value)) {
        // Afficher un message d'erreur si l'email n'est pas valide
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
        return; // Arrêter la soumission du formulaire
    }

    const result = await resetPassword(emailInput.value);

    if (result.status === 200) {
        console.log(result.message);
        // Afficher un message de succès à l'utilisateur
        // document.getElementById('fg-email-error').innerText = result.message;
        // Si l'email est valide, soumettre le formulaire
        alert('Un lien de réinitialisation du mot de passe a été envoyé !');
    } else if (result.status === 400) {
        console.log('Erreur de réinitialisation:', result.message);
        // Afficher le message d'erreur à l'utilisateur
        document.getElementById('fg-email-error').innerText = result.message;
    }
});


document.querySelector('[data-action="continue"]').addEventListener('click', async(e) => {
    // Empêcher la soumission du formulaire par défaut
    e.preventDefault();

    // Sélectionner l'input et l'élément d'erreur
    const emailInput = document.getElementById('user-email');
    const emailError = document.getElementById('email-error');
    const passwordInput = document.getElementById('user-password');
    const passwordError = document.getElementById('password-error');
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Réinitialiser le message d'erreur
    emailError.textContent = '';
    emailInput.classList.remove('error');
    passwordError.textContent = '';
    passwordInput.classList.remove('error');

    if (passwordInput.value.trim() === '' && emailInput.value === '') {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        passwordError.textContent = 'Required';
        passwordInput.classList.add('error');
        return;
    }

    // Vérification si les champs sont vides
    if (passwordInput.value.trim() === '') {
        passwordError.textContent = 'Required';
        passwordInput.classList.add('error');
        return;
    }

    // Vérification de l'email (utilisation d'une regex pour vérifier la validité)
    if (emailInput.value === '') {
        emailError.textContent = 'Required';
        emailInput.classList.add('error');
        return;
    }

    // Vérification du format de l'email
    if (!emailPattern.test(emailInput.value)) {
        // Afficher un message d'erreur si l'email n'est pas valide
        emailError.textContent = 'Veuillez entrer une adresse email valide.';
        emailInput.classList.add('error');
        return; // Arrêter la soumission du formulaire
    }

    // Si l'email est valide, soumettre le formulaire
    const result = await signIn(emailInput.value, passwordInput.value);

    if (result.status === 200) {
        // console.log('Connexion réussie:', result.message);
        // Redirige l'utilisateur vers la page d'accueil ou affiche un message de succès
        window.location.href = 'index.html';
    } else if (result.status === 400) {
        console.log('Erreur de connexion:', result.message);
        // Affiche un message d'erreur à l'utilisateur
        document.getElementById('password-error').innerText = result.message;
    }
});


// ========================================================

const log_btn_close = document.querySelector('.close-modal')

log_btn_close.addEventListener('click', ()=>{
    window.location.href = 'index.html';
})

// ==========================================================

