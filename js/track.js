const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const iThree = document.querySelector(".ithree");
const iFour = document.querySelector(".ifour");
const iFive = document.querySelector(".ifive");
const iSix = document.querySelector(".isix");
const iSeven = document.querySelector(".iseven");
const iEight = document.querySelector(".ieight");
const four = document.querySelector(".four");
const five = document.querySelector(".five");
const six = document.querySelector(".six");
const seven = document.querySelector(".seven");
const eight = document.querySelector(".eight");
const liOne = document.getElementById('one');
const liTwo = document.getElementById('two');
const liThree = document.getElementById('three');
const liFour = document.getElementById('four');
const liFive = document.getElementById('five');
const liSix = document.getElementById('six');
const liSeven = document.getElementById('seven');
const liEight = document.getElementById('eight');
const threeI = document.querySelector(".three i");
const fourI = document.querySelector(".four i");
const fiveI = document.querySelector(".five i");
const sixI = document.querySelector(".six i");
const sevenI = document.querySelector(".seven i");
const eightI = document.querySelector(".eight i");
const fourText = document.querySelector(".fourText");


// function Fone() {
//     one.classList.add("active");
//     two.classList.remove("active");
//     three.classList.remove("active");
//     four.classList.remove("active");
//     five.classList.remove("active");
//     six.classList.remove("active");
//     liOne.style.display = "flex";
//     liTwo.style.display = "none";
//     liThree.style.display = "none";
//     liFour.style.display = "none";
//     liFive.style.display = "none";
//     liSix.style.display = "none";
// }

// function Ftwo() {
//     one.classList.add("active");
//     two.classList.add("active");
//     three.classList.remove("active");
//     four.classList.remove("active");
//     five.classList.remove("active");
//     six.classList.remove("active");
//     liOne.style.display = "flex";
//     liTwo.style.display = "flex";
//     liThree.style.display = "none";
//     liFour.style.display = "none";
//     liFive.style.display = "none";
//     liSix.style.display = "none";
// }
// 

function Fthree() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.remove("active");
    five.classList.remove("active");
    six.classList.remove("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "none";
    liFive.style.display = "none";
    liSix.style.display = "none";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iThree.classList.remove("uil-check");
    iThree.classList.add("uil-circle");
    threeI.classList.add('custom-style');
}
function Ffour(content = "Commande expédiée") {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.remove("active");
    six.classList.remove("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "none";
    liSix.style.display = "none";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iFour.classList.remove("uil-check");
    iFour.classList.add("uil-circle");
    fourI.classList.add('custom-style');
    fourText.textContent = content;
}
function Ffive() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.remove("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "flex";
    liSix.style.display = "none";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iFive.classList.remove("uil-check");
    iFive.classList.add("uil-circle");
    fiveI.classList.add('custom-style');
}

function Fsix() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.add("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "flex";
    liSix.style.display = "flex";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iSix.classList.remove("uil-check");
    iSix.classList.add("uil-circle");
    sixI.classList.add('custom-style');
}

function Fseven() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.add("active");
    seven.classList.add("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "flex";
    liSix.style.display = "flex";
    liSeven.style.display = "flex";
    liEight.style.display = "none";
    iSeven.classList.remove("uil-check");
    iSeven.classList.add("uil-circle");
    sevenI.classList.add('custom-style');
}

function Feight() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    six.classList.add("active");
    seven.classList.add("active");
    eight.classList.add("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "flex";
    liSix.style.display = "flex";
    liSeven.style.display = "flex";
    liEight.style.display = "flex";
    iEight.classList.remove("uil-check");
    iEight.classList.add("uil-circle");
    eightI.classList.add('custom-style');
}

document.getElementById('exit').addEventListener('click', ()=>{
    window.history.back();
})

// Récupération de l'URL complète
const fullUrl = window.location.href;

// Extraction de la partie après le '?'
const queryString = fullUrl.split('?')[1];

// Utilisation de URLSearchParams pour traiter les paramètres
const urlParams = new URLSearchParams(queryString);

// Récupération des valeurs
let orderId = urlParams.get('id');
const index = urlParams.get('index');

function formatDate(timestamp) {
    const date = new Date(timestamp); // Convertir le timestamp en objet Date
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `Le ${day}-${month}-${year}`;
}

function formatDateFirebase(firebaseTimestamp) {
    // Convertir le timestamp Firebase en objet Date
    const date = firebaseTimestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `Le ${day}-${month}-${year}`;
}

import { getUserOrdersById } from './firebase.js';


document.addEventListener('DOMContentLoaded', async () => {
    //document.getElementById('loading-spinner').style.display = 'block';

    // Récupérer les données de commande pour l'utilisateur
    let orderData = await getUserOrdersById(orderId);
    orderData = orderData[0];
    const item = orderData.items[index];
    const status = item.status;
    const time = item.updatedAt;
    
    // Sélection des éléments DOM pour afficher les dates
    const timeElements = document.querySelectorAll('.time1');
    const [oneTime1, oneTime2, oneTime3, oneTime4, oneTime5, oneTime6, oneTime7, oneTime8] = timeElements;

    // Récupération des dates
    const createTime = orderData.createdAt;
    const now = Date.now(); // Obtenir le timestamp actuel
    const Sdate = new Date(time); // Créer un objet Date à partir de `updatedAt`
    const Edate = new Date(Sdate); // Créer une autre date à partir de `updatedAt`
    Edate.setDate(Sdate.getDate() + 1); // Ajouter 1 jour à `updatedAt`
    
    const dateD = createTime.toDate(); // Créer une date à partir de `createdAt`
    dateD.setDate(dateD.getDate() + 1); // Ajouter 1 jour à `createdAt`

    const dateD1 = createTime.toDate(); // Créer une autre date à partir de `createdAt`
    dateD1.setDate(dateD1.getDate() + 2); // Ajouter 2 jours à `createdAt`

    const Edate1 = new Date(Sdate); // Créer une autre date à partir de `updatedAt`
    Edate1.setDate(Sdate.getDate() - 3); // Ajouter 1 jour à `updatedAt`

    // Gérer les différents statuts de la commande
    if (status === "pending") {
        oneTime1.textContent = formatDateFirebase(createTime);
        oneTime2.textContent = formatDateFirebase(createTime);
        oneTime3.textContent = formatDateFirebase(createTime);

        if (now <= Edate) {
            Fthree(); // Action à prendre si la commande est toujours en attente
        } else if (now >= Edate) {
            oneTime4.textContent = formatDate(Edate);
            Ffour("Commande expédiée"); // Action à prendre si la commande a été expédiée
        }
        
        if (now >= dateD1) {
            oneTime4.textContent = formatDate(Edate);
            oneTime5.textContent = formatDate(dateD1);
            Ffive(); // Action à prendre si la commande est en retard
        }
        
    } else if (status === "delivered") {
        oneTime1.textContent = formatDateFirebase(createTime);
        oneTime2.textContent = formatDateFirebase(createTime);
        oneTime3.textContent = formatDateFirebase(createTime);
        oneTime4.textContent = formatDate(dateD);
        oneTime5.textContent = formatDate(time);
        oneTime6.textContent = formatDate(time);
        Fsix(); // Action à prendre si la commande a été livrée
    } else if (status === "cancelled") {
        oneTime1.textContent = formatDateFirebase(createTime);
        oneTime2.textContent = formatDateFirebase(createTime);
        oneTime3.textContent = formatDateFirebase(createTime);
        oneTime4.textContent = formatDate(Sdate);
        Ffour("ANNULÉE"); // Action à prendre si la commande a été annulée
    } else if (status === "returned") {
        oneTime1.textContent = formatDateFirebase(createTime);
        oneTime2.textContent = formatDateFirebase(createTime);
        oneTime3.textContent = formatDateFirebase(createTime);
        oneTime4.textContent = formatDate(dateD);
        oneTime5.textContent = formatDate(dateD1);
        oneTime6.textContent = formatDate(dateD1);
        oneTime7.textContent = formatDate(Edate1);
        oneTime8.textContent = formatDate(Sdate);
        Feight();
    } else if (status === "checking"){
        oneTime1.textContent = formatDateFirebase(createTime);
        oneTime2.textContent = formatDateFirebase(createTime);
        oneTime3.textContent = formatDateFirebase(createTime);
        oneTime4.textContent = formatDate(dateD);
        oneTime5.textContent = formatDate(dateD1);
        oneTime6.textContent = formatDate(dateD1);
        oneTime7.textContent = formatDate(time);
        Fseven();
    }

    //document.getElementById('loading-spinner').style.display = 'none'; // Cacher le spinner de chargement
});
