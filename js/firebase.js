import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCyBg_6Ju9sAFLfM2W33RWsIxUm2_8SFWE",
    authDomain: "nigernet-a4de9.firebaseapp.com",
    projectId: "nigernet-a4de9",
    storageBucket: "nigernet-a4de9.appspot.com",
    messagingSenderId: "570045723310",
    appId: "1:570045723310:web:1edbc28df9f107430bf33f",
    measurementId: "G-QSCGQDNZ59"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

export async function signUp(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            return {
                status: 400,
                message: 'Utilisateur non créé'
            };
        }

        // Sauvegarder les informations utilisateur dans Firestore
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            email: email,
            nom: '',
            prenom: name,
            phone1: '',
            phone2: '',
            genre: '',
            adresse: '',
            adresse_sup: '',
            region: '' 
            
        });

        // Retourne un statut de succès
        return {
            status: 200,
            message: 'Inscription réussie'
        };
    } catch (error) {
        // Retourne un statut d'erreur avec le message
        return {
            status: 400, // Statut d'erreur personnalisée, par exemple 400 pour mauvaise requête
            message: error.message
        };
    }
}

export async function signIn(email, password) {
    try {
        // Tente de connecter l'utilisateur avec email et mot de passe
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            return {
                status: 400,
                message: 'Connexion échouée : utilisateur non trouvé'
            };
        }

        // Si la connexion réussit, retourne un statut 200 (succès)
        return {
            status: 200,
            message: 'Connexion réussie'
        };
    } catch (error) {
        // Capture l'erreur et retourne un statut 400 avec un message d'erreur
        return {
            status: 400,
            message: error.message
        };
    }
}

export async function resetPassword(email) {
    try {
        // Envoie un email de réinitialisation de mot de passe
        await sendPasswordResetEmail(auth, email);
        return {
            status: 200,
            message: 'Email de réinitialisation envoyé avec succès'
        };
    } catch (error) {
        let errorMessage = '';

        // Gestion des erreurs possibles
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'Aucun utilisateur trouvé avec cet email';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Adresse email invalide';
                break;
            default:
                errorMessage = error.message;
                break;
        }

        return {
            status: 400,
            message: errorMessage
        };
    }
}

// Fonction pour afficher l'utilisateur courant
export function getUser() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // L'utilisateur est connecté, affiche ses informations
            return user.uid;
        } else {
            // Aucun utilisateur connecté
            return null;
        }
    });
}


// Fonction pour afficher l'utilisateur courant et modifier le texte de connexion
export function getUserChange(displayElementId) {
    onAuthStateChanged(auth, async (user) => {
        const displayElement = document.getElementById(displayElementId);

        if (user) {
            // L'utilisateur est connecté, récupère son nom depuis Firestore
            const userName = await getUserName(user.uid);
            const formattedName = capitalizeFirstLetter(userName || user.email); // Capitalise la première lettre
            displayElement.innerHTML = `
                <a class="bbb text-black uil fs-150" href="/profil.html">
                    <i class="uil fs-150 uil-user"></i>${formattedName}
                </a>`;
            // Ajoute un gestionnaire d'événements pour la déconnexion
            // displayElement.querySelector('a').addEventListener('click', async (e) => {
            //     e.preventDefault(); // Empêche le comportement par défaut du lien
            //     const result = await logout(); // Appelle la fonction de déconnexion
            //     if (result.status === 200) {
            //         getUser(displayElementId); // Met à jour l'affichage après déconnexion
            //     }
            // });
        } else {
            // Aucun utilisateur connecté, reste sur "Se connecter"
            displayElement.innerHTML = '<a class="bbb text-black uil fs-150" href="/login.html"><i class="uil fs-150 uil-user"></i>Se connecter</a>';
        }
    });
}

// Fonction pour déconnecter l'utilisateur
export async function logout() {
    try {
        await signOut(auth); // Déconnexion de l'utilisateur
        console.log('Déconnexion réussie');
        window.location.href = 'index.html';
        return {
            status: 200,
            message: 'Déconnexion réussie'
        };
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        return {
            status: 400,
            message: error.message
        };
    }
}

// Fonction pour récupérer le nom de l'utilisateur depuis Firestore
async function getUserName(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        // console.log(userDoc.data());
        return `${userDoc.data().nom} ${userDoc.data().prenom}`; // Retourne le nom de l'utilisateur
    } else {
        console.log("Aucun document trouvé pour cet utilisateur");
        return null;
    }
}

function capitalizeFirstLetter(string) {
    if (!string) return string; // Vérifie si la chaîne n'est pas vide
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Fonction pour récupérer les données de l'utilisateur
export async function getUserDataValue() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        resolve(userDoc.data()); // Retourne les données utilisateur
                    } else {
                        console.log("Aucun document trouvé pour cet utilisateur");
                        resolve(null); // Aucune donnée trouvée
                    }
                } catch (error) {
                    reject(error); // Gère les erreurs
                }
            } else {
                resolve(null); // Aucun utilisateur connecté
            }
        });
    });
}

// Fonction pour sauvegarder les données modifiées de l'utilisateur
export async function updateUserData(userId, updatedData) {
    try {
        // Référence du document utilisateur dans Firestore
        const userRef = doc(db, "users", userId);
        
        // Mise à jour des champs avec les nouvelles données
        await updateDoc(userRef, updatedData);
        
        console.log("Les données utilisateur ont été mises à jour avec succès.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des données utilisateur :", error);
        throw error; // Relancer l'erreur pour la gérer dans le fichier `edit.js`
    }
}