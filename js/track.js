import { getUserOrderById, compareAndAdjustTimestamps } from './firebase.js'

const exitBtn = document.getElementById('exit');
const exitBtnArrow = document.querySelector('.uil-arrow-left');

function isMobile() {
    return window.matchMedia("(max-width: 35em)").matches;
}

if (isMobile()) {
    exitBtnArrow.style.visibility = "visible";
    exitBtn.addEventListener('click', ()=>{
        window.history.back();
    })
} else {
    exitBtn.style.cursor = "default";
    exitBtnArrow.style.visibility = "hidden";
}



const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const iThree = document.querySelector(".ithree");
const iFour = document.querySelector(".ifour");
const iFive = document.querySelector(".ifive");
const iFive2 = document.querySelector(".ifive2");
const iSix = document.querySelector(".isix");
const iSeven = document.querySelector(".iseven");
const iEight = document.querySelector(".ieight");
const four = document.querySelector(".four");
const five = document.querySelector(".five");
const five2 = document.querySelector(".five2");
const six = document.querySelector(".six");
const seven = document.querySelector(".seven");
const eight = document.querySelector(".eight");
const liOne = document.getElementById('one');
const liTwo = document.getElementById('two');
const liThree = document.getElementById('three');
const liFour = document.getElementById('four');
const liFive = document.getElementById('five');
const liFive2 = document.getElementById('five2');
const liSix = document.getElementById('six');
const liSeven = document.getElementById('seven');
const liEight = document.getElementById('eight');
const threeI = document.querySelector(".three i");
const fourI = document.querySelector(".four i");
const fiveI = document.querySelector(".five i");
const fiveI2 = document.querySelector(".five2 i");
const sixI = document.querySelector(".six i");
const sevenI = document.querySelector(".seven i");
const eightI = document.querySelector(".eight i");
const fourText = document.querySelector(".fourText");
const sixText = document.querySelector(".sixText");
const eightText = document.querySelector(".eightText");
const eightIcon = document.querySelector("#eight i");
const sixIcon = document.querySelector("#six i");
const fourIcon = document.querySelector("#four i");
const reportText = document.querySelector('.report-text');
const reportDate = document.querySelector('.report-date');
reportText.style.display = "none";

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
    liFive2.style.display = "none";
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
    liFive2.style.display = "none";
    liSix.style.display = "none";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iFour.classList.remove("uil-check");
    iFour.classList.add("uil-circle");
    fourI.classList.add('custom-style');
    fourText.textContent = content;
    if (content == "COMMANDE ANNULÉE" || content == "COMMANDE REJETÉE") {
        fourIcon.classList.remove("uil-exchange");
        fourIcon.classList.add("uil-x");
    }
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
    liFive2.style.display = "none";
    liSix.style.display = "none";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iFive.classList.remove("uil-check");
    iFive.classList.add("uil-circle");
    fiveI.classList.add('custom-style');
}

function Fsix(content = "Commande livrée", newIcon) {
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
    liFive2.style.display = "none";
    liSix.style.display = "flex";
    liSeven.style.display = "none";
    liEight.style.display = "none";
    iSix.classList.remove("uil-check");
    iSix.classList.add("uil-circle");
    sixI.classList.add('custom-style');
    sixText.textContent = content;
    if (content != "Commande livrée") {
        sixIcon.classList.remove("uil-map-marker");
        sixIcon.classList.add(newIcon);
    }
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
    liFive2.style.display = "none";
    liSix.style.display = "flex";
    liSeven.style.display = "flex";
    liEight.style.display = "none";
    iSeven.classList.remove("uil-check");
    iSeven.classList.add("uil-circle");
    sevenI.classList.add('custom-style');
    AfterDelevered();
}

function Ffive2() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    five2.classList.add("active");
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
    liFive2.style.display = "flex";
    iFive2.classList.remove("uil-check");
    iFive2.classList.add("uil-circle");
    fiveI2.classList.add('custom-style');
    AfterDelevered();
}

function Feight(content = "Commande retournée", newIcon = "") {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    five2.classList.add("active");
    six.classList.add("active");
    seven.classList.add("active");
    eight.classList.add("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "flex";
    liFive2.style.display = "flex";
    liSix.style.display = "flex";
    liSeven.style.display = "flex";
    liEight.style.display = "flex";
    iEight.classList.remove("uil-check");
    iEight.classList.add("uil-circle");
    eightI.classList.add('custom-style');
    eightText.textContent = content;
    AfterDelevered();
    if (content != "Commande retournée") {
        eightIcon.classList.remove("uil-redo");
        eightIcon.classList.add(newIcon);
    }
}

function Feight2(content = "Commande retournée", newIcon = "") {
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
    liFive2.style.display = "none";
    liSix.style.display = "flex";
    liSeven.style.display = "flex";
    liEight.style.display = "flex";
    iEight.classList.remove("uil-check");
    iEight.classList.add("uil-circle");
    eightI.classList.add('custom-style');
    eightText.textContent = content;
    AfterDelevered();
    if (content != "Commande retournée") {
        eightIcon.classList.remove("uil-redo");
        eightIcon.classList.add(newIcon);
    }
}

function Feight3(content = "Commande retournée", newIcon = "") {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
    five.classList.add("active");
    five2.classList.add("active");
    six.classList.add("active");
    seven.classList.add("active");
    eight.classList.add("active");
    liOne.style.display = "flex";
    liTwo.style.display = "flex";
    liThree.style.display = "flex";
    liFour.style.display = "flex";
    liFive.style.display = "flex";
    liFive2.style.display = "flex";
    liSix.style.display = "flex";
    liSeven.style.display = "flex";
    liEight.style.display = "flex";
    iEight.classList.remove("uil-check");
    iEight.classList.add("uil-circle");
    eightI.classList.add('custom-style');
    eightText.textContent = content;
    AfterDelevered();
    if (content != "Commande retournée") {
        eightIcon.classList.remove("uil-redo");
        eightIcon.classList.add(newIcon);
    }
}

function AfterDelevered() {
    liOne.style.display = "none";
    liTwo.style.display = "none";
    liThree.style.display = "none";
    liFour.style.display = "none";
    liFive.style.display = "none";
    six.classList.add("masque");
}

// Récupération de l'URL complète
const fullUrl = window.location.href;

// Extraction de la partie après le '?'
const queryString = fullUrl.split('?')[1];

// Utilisation de URLSearchParams pour traiter les paramètres
const urlParams = new URLSearchParams(queryString);

// Récupération des valeurs
let orderId = urlParams.get('id');
const index = urlParams.get('index');

function formatDate(timestamp, formatType = "standard") {
    // Si l'entrée est un Timestamp de Firebase, la convertir en objet Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    // Récupération du jour, du mois et de l'année
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Choisir le format en fonction du type spécifié
    if (formatType === "standard") {
        return `Le ${day}-${month}-${year}`;
    } else if (formatType === "detailed") {
        return `Effectuée le ${day}-${month}-${year}`;
    } else {
        // Si le formatType n'est pas reconnu, utiliser le format standard par défaut
        return `Le ${day}-${month}-${year}`;
    }
}

const delayAvantExp = 1;

document.addEventListener('DOMContentLoaded', async () => {

    // Récupérer les données de commande pour l'utilisateur
    let orderData = await getUserOrderById(orderId);
    const item = orderData.items[index];
    const status = item.status;
    const time = item.updatedAt;
    
    // Sélection des éléments DOM pour afficher les dates
    const timeElements = document.querySelectorAll('.time1');
    const [oneTime1, oneTime2, oneTime3, oneTime4, oneTime5, oneTime6, oneTime7, oneTime5_2, oneTime8] = timeElements;

    // Récupération des dates
    const createTime = orderData.createdAt;
    const now = Date.now(); // Obtenir le timestamp actuel
    const updataTime = item.updatedAt; // Récupérer le timestamp de `updatedAt`
    const updatedAtDate = updataTime.toDate ? updataTime.toDate() : new Date(updataTime); // Convertir le Timestamp Firebase en Date
    
    // Calculer les dates d'expiration
    const Edate = new Date(updatedAtDate);
    Edate.setDate(updatedAtDate.getDate() + delayAvantExp); // Ajouter 1 jour pour l'expédition

    // Gérer les différents statuts de la commande
    if (status === "pending") {
        
        oneTime1.textContent = formatDate(item.updatedAt);
        oneTime2.textContent = formatDate(item.updatedAt);
        oneTime3.textContent = formatDate(item.updatedAt);

        if (now <= Edate.getTime()) {
            Fthree(); // Action à prendre si la commande est toujours en attente
        } else if (now >= Edate) {
            oneTime4.textContent = formatDate(Edate);
            Ffour("Commande expédiée"); // Action à prendre si la commande a été expédiée
        }
        
    } else if (status === "cancelled") {
        oneTime1.textContent = formatDate(createTime);
        oneTime2.textContent = formatDate(createTime);
        oneTime3.textContent = formatDate(createTime);
        oneTime4.textContent = formatDate(updataTime);
        Ffour("COMMANDE ANNULÉE"); // Action à prendre si la commande a été annulée
    } else if (status === "checking"){
        const historyAll = item.history;
        if (historyAll.length >= 2) { // Vérifie qu'il y a au moins deux éléments
            const avantDernier = historyAll[historyAll.length - 2];
            if (avantDernier.status === "delivered") {
                oneTime6.textContent = formatDate(avantDernier.updatedAt);
            } 
        } 
        oneTime7.textContent = formatDate(updataTime);
        Fseven();
    } else if (status === "dismiss-delivered") {
        const historyAll = item.history;
        const lastPendingIndex = historyAll.map((entry, index) => entry.status === 'pending' ? index : -1).filter(index => index !== -1).pop();
        oneTime1.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime2.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime3.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime4.textContent = formatDate(updataTime);        
        Ffour("COMMANDE REJETÉE"); // Action à prendre si la commande a été annulée
    } else if (status === "progress"){
        const historyAll = item.history;
        const lastPendingIndex = historyAll.map((entry, index) => entry.status === 'pending' ? index : -1).filter(index => index !== -1).pop();
        oneTime1.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime2.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime3.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime5.textContent = formatDate(updataTime);
        if (historyAll.length >= 2) { // Vérifie qu'il y a au moins deux éléments
            const avantDernier = historyAll[historyAll.length - 2];
            if (avantDernier.status === "checking") {
                // Trouver l'index de la dernière occurrence où le statut est "delivered"
                const lastDeliveredIndex = historyAll.map((entry, index) => entry.status === 'delivered' ? index : -1).filter(index => index !== -1).pop();
                oneTime6.textContent = formatDate(historyAll[lastDeliveredIndex].updatedAt);
                oneTime7.textContent = formatDate(avantDernier.updatedAt);
                oneTime5_2.textContent = formatDate(updataTime);
                Ffive2();
            }else if(avantDernier.status === "report-returned" || avantDernier.status === "report-delivered"){
                reportText.style.display = "block";
                reportDate.textContent = formatDate(avantDernier.updatedAt);
                oneTime4.textContent = formatDate(compareAndAdjustTimestamps(historyAll[lastPendingIndex].updatedAt, updataTime));
                Ffive();
            } else{
                oneTime4.textContent = formatDate(compareAndAdjustTimestamps(historyAll[lastPendingIndex].updatedAt, updataTime));
                Ffive();
            }
        } 
    }else if (status === "returned") {
        const historyAll = item.history;
        const lastDeliveredIndex = historyAll.map((entry, index) => entry.status === 'delivered' ? index : -1).filter(index => index !== -1).pop();
        oneTime6.textContent = formatDate(historyAll[lastDeliveredIndex].updatedAt);
        const lastCheckingIndex = historyAll.map((entry, index) => entry.status === 'checking' ? index : -1).filter(index => index !== -1).pop();
        oneTime7.textContent = formatDate(historyAll[lastCheckingIndex].updatedAt);
        oneTime8.textContent = formatDate(item.updatedAt);
        oneTime5_2.textContent = formatDate(updataTime);
        Feight();
    }else if(status === "delivered"){
        const historyAll = item.history;
        const lastPendingIndex = historyAll.map((entry, index) => entry.status === 'pending' ? index : -1).filter(index => index !== -1).pop();
        oneTime1.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime2.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime3.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        const lastProgressIndex = historyAll.map((entry, index) => entry.status === 'progress' ? index : -1).filter(index => index !== -1).pop();
        oneTime5.textContent = formatDate(historyAll[lastProgressIndex].updatedAt);
        oneTime6.textContent = formatDate(item.updatedAt);
        oneTime4.textContent = formatDate(compareAndAdjustTimestamps(historyAll[lastPendingIndex].updatedAt, historyAll[lastProgressIndex].updatedAt));
        Fsix();
    }else if(status === "dismiss-returned"){
        const historyAll = item.history;
        const lastDeleveredIndex = historyAll.map((entry, index) => entry.status === 'delivered' ? index : -1).filter(index => index !== -1).pop();
        oneTime6.textContent = formatDate(historyAll[lastDeleveredIndex].updatedAt);
        const lastCheckingIndex = historyAll.map((entry, index) => entry.status === 'checking' ? index : -1).filter(index => index !== -1).pop();
        oneTime7.textContent = formatDate(historyAll[lastCheckingIndex].updatedAt);
        oneTime8.textContent = formatDate(item.updatedAt);
        Feight2("Retour de commande rejetée", "uil-x");
    } else if(status === "report-delivered"){
        const historyAll = item.history;
        const lastPendingIndex = historyAll.map((entry, index) => entry.status === 'pending' ? index : -1).filter(index => index !== -1).pop();
        oneTime1.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime2.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        oneTime3.textContent = formatDate(historyAll[lastPendingIndex].updatedAt);
        const lastProgressIndex = historyAll.map((entry, index) => entry.status === 'progress' ? index : -1).filter(index => index !== -1).pop();
        oneTime5.textContent = formatDate(historyAll[lastProgressIndex].updatedAt);
        oneTime4.textContent = formatDate(compareAndAdjustTimestamps(historyAll[lastPendingIndex].updatedAt, historyAll[lastProgressIndex].updatedAt));
        oneTime6.textContent = formatDate(item.updatedAt);
        Fsix("Livraison reportée", "uil-step-forward");
    } else if(status === "report-returned"){
        const historyAll = item.history;
        const lastDeleveredIndex = historyAll.map((entry, index) => entry.status === 'delivered' ? index : -1).filter(index => index !== -1).pop();
        oneTime6.textContent = formatDate(historyAll[lastDeleveredIndex].updatedAt);
        const lastCheckingIndex = historyAll.map((entry, index) => entry.status === 'checking' ? index : -1).filter(index => index !== -1).pop();
        oneTime7.textContent = formatDate(historyAll[lastCheckingIndex].updatedAt);
        const lastProgressIndex = historyAll.map((entry, index) => entry.status === 'progress' ? index : -1).filter(index => index !== -1).pop();
        oneTime5_2.textContent = formatDate(historyAll[lastProgressIndex].updatedAt);
        oneTime8.textContent = formatDate(item.updatedAt);
        Feight3("Retour de commande reportée", "uil-step-forward")
    }
});
