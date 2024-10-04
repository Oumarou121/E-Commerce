import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, getDocs, collection, arrayUnion, arrayRemove} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

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
    // Affiche le spinner avant de commencer la requête
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            return {
                status: 400,
                message: 'Utilisateur non créé'
            };
        }

        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            email: email,
            nom: '',
            prenom: capitalizeFirstLetter(name),
            phone1: '',
            phone2: '',
            genre: '',
            adresse: '',
            adresse_sup: '',
            region: '',
            role: 'client',
            favoris: []
        });

        return {
            status: 200,
            message: 'Inscription réussie'
        };
    } catch (error) {
        return {
            status: 400,
            message: error.message
        };
    } finally {
        // Masque le spinner après que la requête soit terminée (succès ou échec)
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

export async function signIn(email, password) {
    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            return {
                status: 400,
                message: 'Connexion échouée : utilisateur non trouvé'
            };
        }

        return {
            status: 200,
            message: 'Connexion réussie'
        };
    } catch (error) {
        return {
            status: 400,
            message: error.message
        };
    } finally {
        // Masque le spinner après la requête
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

export async function resetPassword(email) {
    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';

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
    } finally {
        // Masque le spinner après la requête
        document.getElementById('loading-spinner').style.display = 'none';
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
    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';    
    await delay(250);

    try {
        await signOut(auth); // Déconnexion de l'utilisateur
        // console.log('Déconnexion réussie');
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
    } finally {
        // Masque le spinner après la requête
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Fonction pour récupérer le nom de l'utilisateur depuis Firestore
export async function getUserName(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        // console.log(userDoc.data());
        return `${userDoc.data().prenom} ${userDoc.data().nom}`; // Retourne le nom de l'utilisateur
    } else {
        console.log("Aucun document trouvé pour cet utilisateur");
        return null;
    }
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
    // Affiche le spinner
    document.getElementById('loading-spinner').style.display = 'block';
    try {
        // Référence du document utilisateur dans Firestore
        const userRef = doc(db, "users", userId);
        
        // Mise à jour des champs avec les nouvelles données
        await updateDoc(userRef, updatedData);
        
        console.log("Les données utilisateur ont été mises à jour avec succès.");
    } catch (error) {
        console.error("Erreur lors de la mise à jour des données utilisateur :", error);
        throw error; // Relancer l'erreur pour la gérer dans le fichier `edit.js`
    } finally {
        // Masque le spinner après la requête
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

function capitalizeFirstLetter(string) {
    if (!string) return string; // Vérifie si la chaîne n'est pas vide
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getProductsList() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const productsSnapshot = await getDocs(collection(db, "products"));
                    if (!productsSnapshot.empty) {
                        const productsList = productsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        resolve(productsList); // Retourne la liste des produits
                    } else {
                        console.log("Aucun produit trouvé");
                        resolve([]); // Aucune donnée trouvée
                    }
                } catch (error) {
                    reject(error); // Gère les erreurs
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    });
}

export async function getProductById(id) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const productRef = doc(db, "products", id); // Remplace 'products' par le nom de ta collection
                    const productSnapshot = await getDoc(productRef);

                    if (productSnapshot.exists()) {
                        resolve({ id: productSnapshot.id, ...productSnapshot.data() }); // Retourne l'ID et les données du produit
                    } else {
                        console.log("Produit non trouvé");
                        resolve(null); // Produit non trouvé
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

// Ajouter un produit aux favoris de l'utilisateur
export async function addToFavorites(productId) {
    const user = auth.currentUser;

    if (!user) {
        console.error('Utilisateur non connecté');
        return;
    }

    const userRef = doc(db, 'users', user.uid);

    try {
        await updateDoc(userRef, {
            favoris: arrayUnion(productId) // Ajoute l'ID du produit dans l'array favoris
        });
        console.log('Produit ajouté aux favoris');
    } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris :', error);
    }
}

// Retirer un produit des favoris de l'utilisateur
export async function removeFromFavorites(productId) {
    const user = auth.currentUser;

    if (!user) {
        console.error('Utilisateur non connecté');
        return;
    }

    const userRef = doc(db, 'users', user.uid);

    try {
        await updateDoc(userRef, {
            favoris: arrayRemove(productId) // Retire l'ID du produit de l'array favoris
        });
        console.log('Produit retiré des favoris');
    } catch (error) {
        console.error('Erreur lors de la suppression des favoris :', error);
    }
}

// Vérifier si un produit est déjà dans les favoris
export async function isFavorite(productId) {
    const user = auth.currentUser;

    if (!user) {
        console.error('Utilisateur non connecté');
        return false;
    }

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.favoris && userData.favoris.includes(productId);
    }

    return false;
}

// Fonction pour ajouter un produit au panier
export const addToCart = async (productId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour ajouter au panier');
        return;
    }
    
    try {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, {
            cart: arrayUnion(productId) // Ajoute le productId à la liste du panier
        }, { merge: true });
        
        console.log(`Produit ${productId} ajouté au panier de l'utilisateur ${userId}`);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit au panier', error);
    }
};

// Fonction pour retirer un produit du panier
export const removeFromCart = async (productId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour retirer du panier');
        return;
    }
    
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            cart: arrayRemove(productId) // Retire le productId de la liste du panier
        });
        
        console.log(`Produit ${productId} retiré du panier de l'utilisateur ${userId}`);
    } catch (error) {
        console.error('Erreur lors du retrait du produit du panier', error);
    }
};

// Fonction pour vérifier si un produit est déjà dans le panier
export const isInCart = async (productId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour vérifier le panier');
        return false;
    }
    
    try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.cart ? data.cart.includes(productId) : false;
        }
        return false; // Si le document n'existe pas, le produit n'est pas dans le panier
    } catch (error) {
        console.error('Erreur lors de la vérification du panier', error);
        return false;
    }
};

// Fonction pour récupérer les données de l'utilisateur
export async function getFavorites() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        resolve(userDoc.data().favoris); // Retourne les données utilisateur
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

// Fonction pour supprimer un produit des favoris de l'utilisateur connecté
export const removeFavorite = async (productId) => {
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    
    if (!userId) {
        console.error('Aucun utilisateur connecté');
        return;
    }

    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            favoris: arrayRemove(productId) // Retire l'ID du produit de la liste des favoris
        });
        console.log(`Produit ${productId} supprimé des favoris de l'utilisateur ${userId}`);
    } catch (error) {
        console.error('Erreur lors de la suppression du favori', error);
    }
};