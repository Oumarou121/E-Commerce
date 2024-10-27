import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    sendPasswordResetEmail, onAuthStateChanged, signOut, deleteUser, 
    reauthenticateWithCredential, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteField ,getDocs, collection,
    arrayUnion, arrayRemove, Timestamp, increment, deleteDoc, query, where,
    addDoc } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';

import { toggleLoadingSpinner } from './module.js';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js';


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

// Fonction pour télécharger une image dans Firebase Storage et retourner l'URL
export async function uploadImageToStorage(file, path) {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export async function isUserAdmin() {
    toggleLoadingSpinner(true);
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // L'utilisateur est connecté
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        // Vérifier si le rôle est "admin"
                        resolve(role === "admin");
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    console.error('Erreur lors de la vérification du rôle :', error);
                    resolve(false);
                } finally {
                    toggleLoadingSpinner(false);
                }
            } else {
                // Aucun utilisateur connecté
                toggleLoadingSpinner(false);
                resolve(false);
            }
        });
    });
}


export async function signUp(name, email, password) {
    // Affiche le spinner avant de commencer la requête
    toggleLoadingSpinner(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user) {
            toggleLoadingSpinner(false); // Masque le spinner après la requête
            return {
                status: 400,
                message: 'Utilisateur non créé'
            };
        }

        // Ajout du nouvel utilisateur dans Firestore avec les informations de base
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            email: email,
            addresses: [
                {
                    nom: "",
                    prenom: capitalizeFirstLetter(name),
                    region: "",
                    adresse: "",
                    adresse_sup: "",
                    phone1: "",
                    phone2: "",
                    select: true
                }
            ], // Initialisation d'un tableau d'adresses
            role: 'client',
            favoris: [], // Initialisation des favoris
            cart: {} // Initialisation du panier en tant qu'objet vide
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
        toggleLoadingSpinner(false);
    }
}

export async function signIn(email, password) {
    // Affiche le spinner
    toggleLoadingSpinner(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user) {
            toggleLoadingSpinner(false); // Masque le spinner après la requête
            return {
                status: 400,
                message: 'Connexion échouée : utilisateur non trouvé.'
            };
        }
        
        // Vérifier le rôle de l'utilisateur dans Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            const role = userDoc.data().role;

            if (role === 'admin') {
                return {
                    status: 200,
                    message: 'Connexion réussie.',
                    role: 'admin'
                };
            } else if (role === 'client') {
                return {
                    status: 200,
                    message: 'Connexion réussie.',
                    role: 'client'
                };
            } else {
                return {
                    status: 403,
                    message: 'Accès refusé : rôle utilisateur inconnu.'
                };
            }
        } else {
            return {
                status: 403,
                message: 'Utilisateur introuvable dans la base de données.'
            };
        }

    } catch (error) {
        // Gestion d'erreurs plus précise
        let errorMessage = 'Erreur lors de la connexion.';

        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Adresse e-mail non enregistrée.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Mot de passe incorrect.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard.';
        }

        return {
            status: 400,
            message: errorMessage
        };
    } finally {
        // Masque le spinner après la requête
        toggleLoadingSpinner(false);
    }
}

export async function resetPassword(email) {
    // Affiche le spinner
    toggleLoadingSpinner(true);

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
        toggleLoadingSpinner(false);
    }
}

export async function deleteAccount(email, password) {
    // Affiche le spinner
    toggleLoadingSpinner(true);

    const user = auth.currentUser;

    if (!user) {
        toggleLoadingSpinner(false);
        return {
            status: 401,
            message: "Utilisateur non connecté",
        };
    }

    try {
        // Étape 1 : Réauthentifier l'utilisateur pour des raisons de sécurité
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);

        try {
            // Étape 2 : Supprimer les données utilisateur dans Firestore
            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef);

            // Étape 3 : Supprimer le compte d'authentification de l'utilisateur
            await deleteUser(user);

            return {
                status: 200,
                message: "Compte supprimé avec succès",
            };
        } catch (error) {
            return {
                status: 500,
                message: "Erreur lors de la suppression du compte dans Firestore : " + error.message,
            };
        }
    } catch (error) {
        // Vérification spécifique des erreurs Firebase
        let errorMessage = "Réauthentification échouée : " + error.message;
        if (error.code === 'auth/user-mismatch') {
            errorMessage = "Les informations d'identification ne correspondent pas à l'utilisateur connecté.";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = "Le mot de passe fourni est incorrect.";
        }

        return {
            status: 403,
            message: errorMessage,
        };
    } finally {
        // Masque le spinner après la requête
        toggleLoadingSpinner(false);
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
            const formattedName = userName || user.email; // Capitalise la première lettre
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
    toggleLoadingSpinner(true);    
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
        toggleLoadingSpinner(false);
    }
}

// Function to retrieve user data by user ID (uid)
export async function getUserDataByUid(uid) {
    toggleLoadingSpinner(true); // Show the loading spinner

    try {
        // Fetch the user document from the "users" collection using the provided uid
        const userDoc = await getDoc(doc(db, "users", uid));
        
        if (userDoc.exists()) {
            return userDoc.data(); // Return the user data
        } else {
            console.log("No document found for this user");
            return null; // No data found
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw error; // Handle errors
    } finally {
        toggleLoadingSpinner(false); // Hide the loading spinner after the request
    }
}

// Fonction pour récupérer le nom de l'utilisateur depuis Firestore
export async function getUserNameByUid(uid) {
    toggleLoadingSpinner(true);
    const userData = await getUserDataByUid(uid);
    const addresses = userData.addresses || []; // S'assurer que addresses est un tableau
    let adresse;
    
    if (userData) {        
        // Trouver l'adresse sélectionnée
        for (const address of addresses) {
            if (address.select) {
                adresse = address;
                break; // Sortir de la boucle une fois l'adresse trouvée
            }
        }

        // Vérifier si une adresse a été trouvée
        if (adresse) {
            toggleLoadingSpinner(false);
            return `${capitalizeFirstLetter(adresse.prenom)} ${capitalizeFirstLetter(adresse.nom)}`; // Retourne le nom de l'utilisateur
        } else {
            toggleLoadingSpinner(false);
            console.log("Aucune adresse sélectionnée trouvée pour cet utilisateur");
            return null;
        }
    } else {
        console.log("Aucun document trouvé pour cet utilisateur");
        toggleLoadingSpinner(false);
        return null;
    }
}


// Fonction pour récupérer le nom de l'utilisateur depuis Firestore
export async function getUserName() {
    toggleLoadingSpinner(true);
    const userData = await getUserDataValue();
    const addresses = userData.addresses || []; // S'assurer que addresses est un tableau
    let adresse;
    
    if (userData) {        
        // Trouver l'adresse sélectionnée
        for (const address of addresses) {
            if (address.select) {
                adresse = address;
                break; // Sortir de la boucle une fois l'adresse trouvée
            }
        }

        // Vérifier si une adresse a été trouvée
        if (adresse) {
            toggleLoadingSpinner(false);
            return `${capitalizeFirstLetter(adresse.prenom)} ${capitalizeFirstLetter(adresse.nom)}`; // Retourne le nom de l'utilisateur
        } else {
            toggleLoadingSpinner(false);
            console.log("Aucune adresse sélectionnée trouvée pour cet utilisateur");
            return null;
        }
    } else {
        console.log("Aucun document trouvé pour cet utilisateur");
        toggleLoadingSpinner(false);
        return null;
    }
}


// Fonction pour récupérer les données de l'utilisateur
export async function getUserDataValue() {
    toggleLoadingSpinner(true); // Affiche le spinner
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
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}


// Fonction pour sauvegarder les données modifiées de l'utilisateur
export async function updateUserData(userId, updatedData) {
    // Affiche le spinner
    toggleLoadingSpinner(true); // Affiche le spinner
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
        toggleLoadingSpinner(false); // Masque le spinner après la requête
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
    toggleLoadingSpinner(true); // Affiche le spinner
    try {
        // Récupération des produits même si l'utilisateur n'est pas connecté
        const productsSnapshot = await getDocs(collection(db, "products"));
        
        if (!productsSnapshot.empty) {
            const productsList = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return productsList; // Retourne la liste des produits
        } else {
            console.log("Aucun produit trouvé");
            return []; // Aucune donnée trouvée
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        throw error; // Gère les erreurs
    } finally {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}



export async function getProductById(id) {
    toggleLoadingSpinner(true); // Affiche le spinner
    try {
        // Récupération du produit sans vérifier l'état d'authentification
        const productRef = doc(db, "products", id);
        const productSnapshot = await getDoc(productRef);

        if (productSnapshot.exists()) {
            return { id: productSnapshot.id, ...productSnapshot.data() }; // Retourne l'ID et les données du produit
        } else {
            console.log("Produit non trouvé");
            return null; // Produit non trouvé
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
        throw error; // Gère les erreurs
    } finally {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}

// Fonction pour générer un nouvel orderId
export async function generateProductId() {
    toggleLoadingSpinner(true); // Affiche le spinner
    const orderCounterRef = doc(db, "config", "productCounter");

    try {
        // Lire le compteur actuel
        const orderCounterDoc = await getDoc(orderCounterRef);

        if (!orderCounterDoc.exists()) {
            throw new Error("Le document de compteur de commandes n'existe pas.");
        }

        // Incrémenter le compteur dans Firestore
        const newOrderNumber = orderCounterDoc.data().count + 1;
        await updateDoc(orderCounterRef, {
            count: increment(1)
        });

        // Générer l'identifiant de la commande
        const orderId = newOrderNumber;

        return orderId;
    } catch (error) {
        console.error("Erreur lors de la génération de l'productId :", error);
        throw new Error("Impossible de générer l'identifiant du product.");
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}

// Fonction pour ajouter un produit
export async function addProduct(productData) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Générer le nouvel productId
                    const productId = await generateProductId();
                    
                    // Afficher les données du produit pour le débogage
                    console.log(productData);

                    // Ajouter le produit à la collection "products" en utilisant le productId comme identifiant
                    const docRef = await setDoc(doc(db, "products", productId), {
                        ...productData,
                        productId: productId, // Utiliser le productId personnalisé
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now()
                    });

                    resolve({
                        status: 200,
                        message: "Produit ajouté avec succès",
                        productId: productId
                    });
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}


// Fonction pour mettre à jour un produit
export async function updateProduct(productId, updatedData) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Référence au document du produit à mettre à jour
                    const productRef = doc(db, "products", productId);

                    // Mise à jour des données du produit
                    await updateDoc(productRef, {
                        ...updatedData,
                        updatedAt: Timestamp.now()
                    });

                    resolve({
                        status: 200,
                        message: "Produit mis à jour avec succès",
                        productId: productId
                    });
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour supprimer un produit
export async function deleteProduct(productId) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Référence au document du produit à supprimer
                    const productRef = doc(db, "products", productId);

                    // Suppression du document
                    await deleteDoc(productRef);

                    resolve({
                        status: 200,
                        message: "Produit supprimé avec succès",
                        productId: productId
                    });
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}


// Ajouter un produit aux favoris de l'utilisateur
export async function addToFavorites(productId) {
    toggleLoadingSpinner(true); // Affiche le spinner
    const user = auth.currentUser;

    if (!user) {
        console.error('Utilisateur non connecté');
        toggleLoadingSpinner(false); // Masque le spinner après la requête
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
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}

// Retirer un produit des favoris de l'utilisateur
export async function removeFromFavorites(productId) {
    toggleLoadingSpinner(true); // Affiche le spinner
    const user = auth.currentUser;

    if (!user) {
        console.error('Utilisateur non connecté');
        toggleLoadingSpinner(false); // Masque le spinner après la requête
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
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}

// Vérifier si un produit est déjà dans les favoris
export async function isFavorite(productId) {
    toggleLoadingSpinner(true); // Affiche le spinner
    const user = auth.currentUser;

    if (!user) {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
        console.error('Utilisateur non connecté');
        return false;
    }

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        toggleLoadingSpinner(false); // Masque le spinner après la requête
        return userData.favoris && userData.favoris.includes(productId);
    }
    toggleLoadingSpinner(false); // Masque le spinner après la requête
    return false;
}

// Fonction pour ajouter un produit au panier avec une quantité par défaut (ou mettre à jour la quantité)
export const addToCart = async (productId, quantity = 1) => {
    toggleLoadingSpinner(true); // Affiche le spinner
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour ajouter au panier');
        return;
    }

    try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const cart = data.cart || {}; // Récupérer l'objet cart, ou initialiser un objet vide

            // Si le produit est déjà dans le panier, mettre à jour la quantité
            if (cart[productId]) {
                cart[productId].qty = quantity; // Incrémente la quantité existante
                console.log(`Quantité mise à jour pour le produit ${productId} : ${cart[productId].qty}`);
                await getTotalQuantityInCart();
            } else {
                // Sinon, l'ajouter avec la quantité spécifiée
                cart[productId] = { id: productId, qty: quantity }; // Ajouter le produit avec la quantité spécifiée
                console.log(`Produit ${productId} ajouté au panier avec une quantité de ${quantity}`);
                await getTotalQuantityInCart();
            }

            // Mise à jour du panier dans Firestore
            await setDoc(userDoc, { cart }, { merge: true });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit au panier', error);
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
};
export const removeFromCart = async (productId) => {
    toggleLoadingSpinner(true); // Affiche le spinner
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour retirer du panier');
        return;
    }
    
    try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const cart = data.cart || {}; // Récupérer l'objet cart, ou initialiser un objet vide

            if (cart[productId]) {
                // Supprimer le produit du panier en utilisant deleteField()
                await updateDoc(userDoc, {
                    [`cart.${productId}`]: deleteField()
                });

                console.log(`Produit ${productId} retiré du panier de l'utilisateur ${userId}`);
                await getTotalQuantityInCart();
            } else {
                console.log(`Produit ${productId} non trouvé dans le panier de l'utilisateur ${userId}`);
            }
        } else {
            console.log("Le document utilisateur n'existe pas.");
        }
    } catch (error) {
        console.error('Erreur lors du retrait du produit du panier', error);
    } finally {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
};

// Fonction pour vérifier si un produit est déjà dans le panier
export const isInCart = async (productId) => {
    toggleLoadingSpinner(true); // Affiche le spinner
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
            const cart = data.cart || {}; // Récupérer l'objet cart, ou initialiser un objet vide

            return !!cart[productId]; // Retourne true si le produit est dans le panier
        }
        return false; // Si le document n'existe pas ou que le produit n'est pas dans le panier
    } catch (error) {
        console.error('Erreur lors de la vérification du panier', error);
        return false;
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}

// Fonction pour récupérer les données de l'utilisateur
export async function getFavorites() {
    toggleLoadingSpinner(true); // Affiche le spinner
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
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour supprimer un produit des favoris de l'utilisateur connecté
export const removeFavorite = async (productId) => {
    toggleLoadingSpinner(true); // Affiche le spinner
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
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
};

// Fonction pour récupérer tous les articles du panier
export const getCartItems = () => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userDoc);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const cart = data.cart || {}; // Récupérer l'objet cart ou initialiser un objet vide
                        console.log(cart);
                        // Retourne les articles du panier sous forme de tableau
                        const cartItems = Object.entries(cart).map(([productId, { qty }]) => ({
                            id: productId,
                            qty: qty
                        }));
                        resolve(cartItems); // Résoudre la promesse avec les articles du panier
                    } else {
                        console.log('Aucun panier trouvé pour cet utilisateur');
                        resolve([]); // Aucun panier trouvé
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des articles du panier', error);
                    reject(error); // Rejeter en cas d'erreur
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}
// Fonction pour augmenter la quantité d'un produit dans le panier
export const increaseQuantity = async (productId) => {
    // toggleLoadingSpinner(true); // Affiche le spinner
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour mettre à jour le panier');
        return;
    }

    try {
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            const cart = userSnap.data().cart || {};
            if (cart[productId]) {
                cart[productId].qty += 1; // Augmente la quantité
            } else {
                // Si le produit n'est pas dans le panier, vous pouvez l'ajouter avec une quantité de 1
                cart[productId] = { qty: 1 };
            }
            await updateDoc(userDoc, { cart }); // Met à jour le panier dans Firestore
        }
    } catch (error) {
        console.error('Erreur lors de l\'augmentation de la quantité du produit', error);
    }finally{
        // toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
};


// Fonction pour diminuer la quantité d'un produit dans le panier
export const decreaseQuantity = async (productId) => {
    // toggleLoadingSpinner(true); // Affiche le spinner
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Vérifie si l'utilisateur est connecté
    if (!userId) {
        console.error('Aucun utilisateur connecté pour mettre à jour le panier');
        return;
    }

    try {
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
            const cart = userSnap.data().cart || {};
            if (cart[productId]) {
                if (cart[productId].qty > 1) {
                    cart[productId].qty -= 1; // Diminue la quantité
                } else {
                    delete cart[productId]; // Supprime le produit si la quantité atteint 0
                }
                await updateDoc(userDoc, { cart }); // Met à jour le panier dans Firestore
            }
        }
    } catch (error) {
        console.error('Erreur lors de la diminution de la quantité du produit', error);
    }finally{
        // toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
};

// Fonction pour récupérer la quantité totale dans le panier
export const getTotalQuantityInCart = async () => {
    // toggleLoadingSpinner(true); // Affiche le spinner
    onAuthStateChanged(auth, async (user) => {
    try {
        const bagQuantityElement = document.getElementById('cart-box');
        // if (bagQuantityElement) {
        //     bagQuantityElement.setAttribute('data-quantity', 0); // Mettre à jour l'attribut
        // }
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const cart = data.cart || {}; // Récupérer l'objet cart ou initialiser un objet vide
            
            // Calculer la quantité totale
            const totalQuantity = Object.values(cart).reduce((total, item) => total + (item.qty || 0), 0);
            // Mettre à jour l'affichage de la quantité dans le DOM
            
            if (bagQuantityElement) {
                bagQuantityElement.setAttribute('data-quantity', totalQuantity); // Mettre à jour l'attribut
            }

            // return totalQuantity; // Retourne la quantité totale
        } else {
            console.warn('Aucun panier trouvé pour cet utilisateur');
            // return 0; // Retourne 0 si aucun panier trouvé
            if (bagQuantityElement) {
                bagQuantityElement.setAttribute('data-quantity', 0); // Mettre à jour l'attribut
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la quantité totale dans le panier', error);
        // return 0; // Retourne 0 en cas d'erreur
        if (bagQuantityElement) {
            bagQuantityElement.setAttribute('data-quantity', 0); // Mettre à jour l'attribut
        }
    }finally{
        // toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}
)}

// Fonction pour récupérer la quantité totale dans le panier
export const getNbrorder = async () => {
    toggleLoadingSpinner(true); // Affiche le spinner
    onAuthStateChanged(auth, async (user) => {
    try {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const cart = data.cart || {}; // Récupérer l'objet cart ou initialiser un objet vide
            
            // Calculer la quantité totale
            const totalQuantity = Object.values(cart).reduce((total, item) => total + (item.qty || 0), 0);
            // Mettre à jour l'affichage de la quantité dans le DOM
            const orderNbr =  document.querySelector('.orderNbr');
            
            if (orderNbr) {
                orderNbr.textContent = totalQuantity;
            }

            // return totalQuantity; // Retourne la quantité totale
        } else {
            console.warn('Aucun panier trouvé pour cet utilisateur');
            // return 0; // Retourne 0 si aucun panier trouvé
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la quantité totale dans le panier', error);
        // return 0; // Retourne 0 en cas d'erreur
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}
)}

export async function getAllAddresses() {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        
                        // Vérification si des adresses existent
                        if (userData.addresses && userData.addresses.length > 0) {
                            resolve(userData.addresses); // Retourne le tableau d'adresses
                        } else {
                            console.log("Aucune adresse trouvée");
                            resolve([]); // Aucun produit trouvé
                        }
                    } else {
                        console.log("Utilisateur non trouvé");
                        resolve([]); // Document utilisateur non trouvé
                    }
                } catch (error) {
                    reject(error); // Gère les erreurs
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour modifier une adresse en fonction de son index
export async function updateAddressByIndex(index, newAddress) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);

                try {
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const addresses = userData.addresses || [];

                        if (index < addresses.length) {
                            // Mettre à jour l'adresse à l'index donné
                            addresses[index] = newAddress;

                            // Mettre à jour le document utilisateur avec les nouvelles adresses
                            await updateDoc(userRef, { addresses: addresses });

                            resolve({
                                status: 200,
                                message: "Adresse modifiée avec succès"
                            });
                        } else {
                            resolve({
                                status: 200,
                                message: "Nouveau Index"
                            });
                            addAddress(newAddress);
                        }
                    } else {
                        resolve({
                            status: 404,
                            message: "Utilisateur non trouvé"
                        });
                    }
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

export async function deleteAddressByIndex(index) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);

                try {
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const addresses = userData.addresses || [];

                        if (index < addresses.length) {
                            // Vérifier si l'adresse à supprimer a 'select' à true
                            const isSelected = addresses[index].select === true;

                            // Supprimer l'adresse à l'index donné
                            addresses.splice(index, 1);

                            // Si l'adresse supprimée avait 'select' à true, définir 'select' de l'adresse à l'index 0 à true
                            if (isSelected && addresses.length > 0) {
                                addresses[0].select = true;
                            }

                            // Mettre à jour le document utilisateur avec les nouvelles adresses
                            await updateDoc(userRef, { addresses: addresses });

                            resolve({
                                status: 200,
                                message: "Adresse supprimée avec succès"
                            });
                        } else {
                            resolve({
                                status: 400,
                                message: "Index invalide"
                            });
                        }
                    } else {
                        resolve({
                            status: 404,
                            message: "Utilisateur non trouvé"
                        });
                    }
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}



// Fonction pour récupérer une adresse en fonction de son index
export async function getAddressByIndex(index) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);

                try {
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const addresses = userData.addresses || [];

                        if (index < addresses.length) {
                            // Récupérer l'adresse à l'index donné
                            const selectedAddress = addresses[index];
                            resolve({
                                status: 200,
                                address: selectedAddress
                            });
                        } else {
                            resolve({
                                status: 400,
                                message: "Index invalide"
                            });
                        }
                    } else {
                        resolve({
                            status: 404,
                            message: "Utilisateur non trouvé"
                        });
                    }
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}


// Fonction pour ajouter une adresse
export async function addAddress(newAddress) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);

                try {
                    const userDoc = await getDoc(userRef);
                    console.log(userDoc.exists());
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const addresses = userData.addresses || [];

                        // Ajouter la nouvelle adresse au tableau d'adresses
                        addresses.push(newAddress);

                        // Mettre à jour le document utilisateur avec les nouvelles adresses
                        await updateDoc(userRef, { addresses: addresses });

                        resolve({
                            status: 200,
                            message: "Adresse ajoutée avec succès"
                        });
                    } else {
                        resolve({
                            status: 404,
                            message: "Utilisateur non trouvé-------------"
                        });
                    }
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour générer un nouvel orderId
export async function generateOrderId() {
    toggleLoadingSpinner(true); // Affiche le spinner
    const orderCounterRef = doc(db, "config", "orderCounter");

    try {
        // Lire le compteur actuel
        const orderCounterDoc = await getDoc(orderCounterRef);

        if (!orderCounterDoc.exists()) {
            throw new Error("Le document de compteur de commandes n'existe pas.");
        }

        // Incrémenter le compteur dans Firestore
        const newOrderNumber = orderCounterDoc.data().count + 1;
        await updateDoc(orderCounterRef, {
            count: increment(1)
        });

        // Générer l'identifiant de la commande
        const orderId = `#${newOrderNumber}`;

        return orderId;
    } catch (error) {
        console.error("Erreur lors de la génération de l'orderId :", error);
        throw new Error("Impossible de générer l'identifiant de la commande.");
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}

export async function getOrdersList() {
    toggleLoadingSpinner(true); // Affiche le spinner de chargement
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Récupérer le document de l'utilisateur dans la collection users
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (!userDocSnapshot.exists()) {
                        console.log("Utilisateur non trouvé dans la collection users");
                        resolve([]); // Retourne un tableau vide si l'utilisateur n'est pas trouvé
                        return;
                    }

                    const userData = userDocSnapshot.data();
                    if (userData.role !== "admin") {
                        console.log("L'utilisateur n'est pas un administrateur");
                        resolve([]); // Retourne un tableau vide si l'utilisateur n'est pas administrateur
                        return;
                    }

                    // Si l'utilisateur est un administrateur, récupérer les commandes
                    const ordersSnapshot = await getDocs(collection(db, "orders"));

                    if (!ordersSnapshot.empty) {
                        const ordersList = ordersSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        ordersList.sort((a, b) => {
                            const idA = parseInt(a.orderId.replace('#', ''), 10); // Extraire et convertir en nombre
                            const idB = parseInt(b.orderId.replace('#', ''), 10); // Extraire et convertir en nombre
                            return idB - idA; // Trier dans l'ordre décroissant
                        });
                        resolve(ordersList); // Retourner la liste triée des commandes
                    } else {
                        console.log("Aucune commande trouvée");
                        resolve([]); // Retourne un tableau vide si aucune donnée n'est trouvée
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des commandes :", error);
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                console.log("Utilisateur non connecté");
                resolve([]); // Retourne un tableau vide si aucun utilisateur n'est connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masquer le spinner de chargement après la requête
    });
}

export async function addOrder(orderData) {
    toggleLoadingSpinner(true);
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
                toggleLoadingSpinner(false);
                return;
            }

            try {
                const orderId = await generateOrderId();

                // Ajouter les informations d'historique pour chaque produit
                const itemsWithHistory = orderData.items.map(item => ({
                    ...item,
                    status: item.status || "pending",
                    updatedAt: Timestamp.now(),
                    history: [
                        {
                            status: item.status || "pending",
                            updatedAt: Timestamp.now()
                        }
                    ]
                }));

                // Ajouter la commande avec les items et leur historique
                await setDoc(doc(db, "orders", orderId), {
                    ...orderData,
                    items: itemsWithHistory,
                    orderId: orderId,
                    userId: user.uid,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });

                resolve({
                    status: 200,
                    message: "Commande ajoutée avec succès",
                    orderId: orderId
                });
            } catch (error) {
                reject({
                    status: 500,
                    message: error.message
                });
            } finally {
                toggleLoadingSpinner(false);
            }
        });
    });
}


// Fonction pour récupérer toutes les commandes d'un utilisateur
export  const getUserOrders = () => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    
                    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Trier les commandes par orderId dans l'ordre croissant
                    orders.sort((a, b) => {
                        const idA = parseInt(a.orderId.replace('#', ''), 10); // Extraire et convertir en nombre
                        const idB = parseInt(b.orderId.replace('#', ''), 10); // Extraire et convertir en nombre
                        return idB - idA; // Tri croissant
                    });
                    resolve(orders); // Résoudre la promesse avec toutes les commandes triées
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour récupérer une commande d'un utilisateur
export const getUserOrderById = (orderID) => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (!orderID) {
                    console.error("orderID is required.");
                    reject({
                        status: 400,
                        message: "orderID is required"
                    });
                    toggleLoadingSpinner(false); // Masque le spinner en cas d'erreur
                    return; // Sort de la fonction
                }

                try {
                    // Récupérer le document correspondant à l'orderId
                    const orderDoc = await getDoc(doc(db, "orders", orderID));

                    // Vérifie si une commande a été trouvée
                    if (!orderDoc.exists()) {
                        console.warn("Aucune commande trouvée pour l'orderID :", orderID);
                        resolve(null); // Résoudre avec null si aucune commande n'est trouvée
                    } else {
                        const order = { id: orderDoc.id, ...orderDoc.data() };
                        // Vérifier si l'utilisateur correspond à userId dans la commande
                        if (order.userId === user.uid) {
                            resolve(order); // Résoudre la promesse avec la commande trouvée
                        } else {
                            console.warn("L'utilisateur n'a pas accès à cette commande.");
                            resolve(null); // Résoudre avec null si l'utilisateur n'est pas autorisé
                        }
                    }
                } catch (error) {
                    console.error("Error fetching order:", error);
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve(null); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

export const getAdminOrdersById = (orderID) => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Vérifier si l'utilisateur est administrateur
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (!userDoc.exists() || userDoc.data().role !== 'admin') {
                        console.log("Accès refusé : l'utilisateur n'est pas un administrateur");
                        resolve({
                            status: 403,
                            message: "Accès refusé : l'utilisateur n'est pas un administrateur"
                        });
                        return;
                    }

                    // Récupérer le document correspondant à l'orderId
                    const orderDoc = await getDoc(doc(db, "orders", orderID));

                    if (!orderDoc.exists()) {
                        console.log("Commande non trouvée");
                        resolve({
                            status: 404,
                            message: "Commande non trouvée"
                        });
                        return;
                    }

                    const orderData = { id: orderDoc.id, ...orderDoc.data() };

                    resolve({
                        status: 200,
                        order: orderData
                    });
                } catch (error) {
                    console.error("User ID:", user.uid);
                    console.error("Error details:", error);
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                console.log("Utilisateur non connecté");
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}


// Fonction pour récupérer les commandes en cours ou livrées
export const getPendingOrDeliveredOrders = () => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "orders"),
                        where("userId", "==", user.uid),
                        where("status", "in", ["pending", "progress" ,"delivered", "checking"])
                        // where("status", "in", ["pending", "delivered", "checking", "report-delivered", "dismiss-returned"])
                    );

                    const querySnapshot = await getDocs(q);
                    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Trier les commandes par orderId dans l'ordre croissant
                    orders.sort((a, b) => {
                        const idA = parseInt(a.orderId.replace('#', ''), 10);
                        const idB = parseInt(b.orderId.replace('#', ''), 10);
                        return idB - idA;
                    });
                    resolve(orders); // Résoudre la promesse avec les commandes en cours ou livrées triées
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour récupérer les commandes annulées ou retournées
export const getCancelledOrReturnedOrders = () => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "orders"),
                        where("userId", "==", user.uid),
                        // where("status", "in", ["cancelled", "returned", "report-returned", "dismiss-delivered"])
                        where("status", "in", ["cancelled", "returned"])
                    );

                    const querySnapshot = await getDocs(q);
                    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Trier les commandes par orderId dans l'ordre croissant
                    orders.sort((a, b) => {
                        const idA = parseInt(a.orderId.replace('#', ''), 10);
                        const idB = parseInt(b.orderId.replace('#', ''), 10);
                        return idB - idA;
                    });
                    resolve(orders); // Résoudre la promesse avec les commandes annulées ou retournées triées
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour récupérer les commandes annulées ou retournées
export const getReportOrDismissOrders = () => {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const q = query(
                        collection(db, "orders"),
                        where("userId", "==", user.uid),
                        where("status", "in", ["report-returned", "dismiss-delivered", "report-delivered", "dismiss-returned"])
                    );

                    const querySnapshot = await getDocs(q);
                    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Trier les commandes par orderId dans l'ordre croissant
                    orders.sort((a, b) => {
                        const idA = parseInt(a.orderId.replace('#', ''), 10);
                        const idB = parseInt(b.orderId.replace('#', ''), 10);
                        return idB - idA;
                    });
                    resolve(orders); // Résoudre la promesse avec les commandes annulées ou retournées triées
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve([]); // Aucun utilisateur connecté
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

export async function updateOrderStatus(orderId, newStatus) {
    toggleLoadingSpinner(true);
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("Utilisateur non connecté");
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
                return;
            }

            try {
                // Vérifier si l'utilisateur est administrateur
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists() || userDoc.data().role !== 'admin') {
                    console.log("Accès refusé : l'utilisateur n'est pas un administrateur");
                    resolve({
                        status: 403,
                        message: "Accès refusé : l'utilisateur n'est pas un administrateur"
                    });
                    return;
                }

                // Rechercher le document correspondant à l'orderId
                const orderRef = doc(db, "orders", orderId);
                const orderDoc = await getDoc(orderRef);

                if (!orderDoc.exists()) {
                    console.log("Commande non trouvée");
                    resolve({
                        status: 404,
                        message: "Commande non trouvée"
                    });
                    return;
                }

                const orderData = orderDoc.data();

                // Mettre à jour le statut et le updatedAt des items
                const updatedItems = orderData.items.map(item => {
                    if (item.status !== "cancelled") {
                        const historyEntry = {
                            status: newStatus,
                            updatedAt: Timestamp.now()
                        };
                        
                        const updatedHistory = item.history || [];
                        updatedHistory.push(historyEntry);

                        return { 
                            ...item, 
                            status: newStatus, 
                            updatedAt: Timestamp.now(),
                            history: updatedHistory
                        };
                    }
                    return item;
                });

                // Mettre à jour le document avec le nouveau statut pour la commande et les items
                await updateDoc(orderRef, {
                    status: newStatus,
                    items: updatedItems,
                    updatedAt: Timestamp.now()
                });

                console.log("Mise à jour effectuée avec succès");
                resolve({
                    status: 200,
                    message: "Statut de la commande mis à jour avec succès"
                });

            } catch (error) {
                console.error("Erreur lors de la mise à jour :", error.message);
                reject({
                    status: 500,
                    message: error.message
                });
            } finally {
                toggleLoadingSpinner(false); // Masquer le spinner après la requête
            }
        });
    });
}


export async function updateProductStatusInOrderAdmin(orderId, newStatus, productIndex, verificationNote = "") {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("Utilisateur non connecté");
                resolve({ status: 401, message: "Utilisateur non connecté" });
                toggleLoadingSpinner(false);
                return;
            }

            try {
                // Vérifier si l'utilisateur est administrateur
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists() || userDoc.data().role !== 'admin') {
                    console.log("Accès refusé : l'utilisateur n'est pas un administrateur");
                    resolve({ status: 403, message: "Accès refusé : l'utilisateur n'est pas un administrateur" });
                    toggleLoadingSpinner(false);
                    return;
                }

                // Référence directe au document en utilisant l'orderId
                const orderRef = doc(db, "orders", orderId);
                const orderDoc = await getDoc(orderRef);

                if (!orderDoc.exists()) {
                    console.log("Commande non trouvée");
                    resolve({ status: 404, message: "Commande non trouvée" });
                    toggleLoadingSpinner(false);
                    return;
                }

                // Récupérer les items actuels
                const orderData = orderDoc.data();
                const items = orderData.items;

                // Vérifier si l'index du produit est valide
                if (productIndex < 0 || productIndex >= items.length) {
                    console.log("Index du produit invalide");
                    resolve({ status: 400, message: "Index du produit invalide" });
                    toggleLoadingSpinner(false);
                    return;
                }

                // Mettre à jour le statut et l'historique du produit
                const itemToUpdate = items[productIndex];
                itemToUpdate.status = newStatus;
                itemToUpdate.updatedAt = Timestamp.now();
                itemToUpdate.history = itemToUpdate.history || [];
                itemToUpdate.history.push({ status: newStatus, updatedAt: itemToUpdate.updatedAt });

                // Ajouter une note de vérification si le statut est "checking"
                if (newStatus === "checking") {
                    itemToUpdate.verificationNote = verificationNote || "Aucune note fournie";
                }

                // Vérifier les statuts des autres produits
                const allCancelled = items.every(item => item.status === "cancelled");
                const allSameStatus = items.every(item => item.status === newStatus);

                const updates = {
                    items,
                    updatedAt: Timestamp.now(),
                    // La commande est annulée seulement si tous les produits ont le statut "cancelled"
                    status: allCancelled ? "cancelled" : allSameStatus ? newStatus : orderData.status
                };


                // Mettre à jour la commande dans Firestore
                await updateDoc(orderRef, updates);

                console.log("Mise à jour effectuée avec succès");
                resolve({ status: 200, message: "Statut du produit et de la commande mis à jour avec succès" });
            } catch (error) {
                console.error("Erreur lors de la mise à jour :", error.message);
                reject({ status: 500, message: error.message });
            } finally {
                toggleLoadingSpinner(false); // Masque le spinner après la requête
            }
        });
    });
}

export async function updateProductStatusInOrder(orderId, newStatus, productIndex, verificationNote = "") {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Obtenir la référence du document directement avec l'orderId
                    const orderRef = doc(db, "orders", orderId);

                    // Récupérer les données de la commande
                    const orderDoc = await getDoc(orderRef);
                    if (!orderDoc.exists()) {
                        console.log("Commande non trouvée");
                        resolve({
                            status: 404,
                            message: "Commande non trouvée",
                        });
                        return;
                    }

                    // Vérifier si l'utilisateur a accès à cette commande
                    const orderData = orderDoc.data();
                    if (orderData.userId !== user.uid) {
                        console.log("Utilisateur non autorisé à modifier cette commande");
                        resolve({
                            status: 403,
                            message: "Utilisateur non autorisé à modifier cette commande",
                        });
                        return;
                    }

                    // Récupérer les items actuels
                    const items = orderData.items;

                    // Vérifier si l'index du produit est valide
                    if (productIndex < 0 || productIndex >= items.length) {
                        console.log("Index du produit invalide");
                        resolve({
                            status: 400,
                            message: "Index du produit invalide",
                        });
                        return;
                    }

                    // Mettre à jour le statut et la date de mise à jour du produit
                    items[productIndex].status = newStatus;
                    items[productIndex].updatedAt = Timestamp.now();

                    // Ajouter une entrée à l'historique du produit
                    if (!items[productIndex].history) {
                        items[productIndex].history = [];
                    }
                    items[productIndex].history.push({
                        status: newStatus,
                        updatedAt: items[productIndex].updatedAt,
                    });

                    // Si le statut est "checking", ajouter une note de vérification
                    if (newStatus === "checking") {
                        items[productIndex].verificationNote = verificationNote || "Aucune note fournie";
                    }

                    console.log("Données mises à jour :", items);

                    // Préparer les mises à jour pour Firestore
                    const updates = {
                        items: items,
                        updatedAt: Timestamp.now(),
                    };

                    // Vérifier si tous les produits sauf le courant ont le statut "cancelled"
                    const allCancelled = items.every((item, index) => index === productIndex || item.status === "cancelled");
                    if (allCancelled) {
                        updates.status = "cancelled";
                    } else if (items.length === 1) {
                        // Si la commande ne contient qu'un seul produit, mettre à jour aussi le statut de la commande
                        updates.status = newStatus;
                    } else {
                        // Vérifier si tous les produits ont le même statut que le nouveau statut
                        const allSameStatus = items.every(item => item.status === newStatus);
                        if (allSameStatus) {
                            updates.status = newStatus;
                        }
                    }

                    // Mettre à jour la commande dans Firestore
                    await updateDoc(orderRef, updates);

                    console.log("Mise à jour effectuée avec succès");

                    resolve({
                        status: 200,
                        message: "Statut du produit et de la commande mis à jour avec succès",
                    });
                } catch (error) {
                    console.error("Erreur lors de la mise à jour :", error.message);
                    reject({
                        status: 500,
                        message: error.message,
                    });
                }
            } else {
                console.log("Utilisateur non connecté");
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté",
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}


export async function deleteOrder(orderId) {
    toggleLoadingSpinner(true); // Affiche le spinner
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    await deleteDoc(doc(db, "orders", orderId));

                    resolve({
                        status: 200,
                        message: "Commande supprimée avec succès"
                    });
                } catch (error) {
                    reject({
                        status: 500,
                        message: error.message
                    });
                }
            } else {
                resolve({
                    status: 401,
                    message: "Utilisateur non connecté"
                });
            }
        });
    }).finally(() => {
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    });
}

// Fonction pour ajouter un message
export async function addMessage(email, content) {
    toggleLoadingSpinner(true); // Affiche le spinner
    try {
        const docRef = await addDoc(collection(db, 'messages'), {
            email: email,
            content: content,
            timestamp: Timestamp.now() // Ajout d'un timestamp pour trier les messages si nécessaire
        });
        console.log('Message ajouté avec l\'ID : ', docRef.id);
        return docRef.id; // Retourne l'ID du document ajouté
    } catch (error) {
        console.error('Erreur lors de l\'ajout du message : ', error);
        throw error; // Relance l'erreur pour que l'appelant puisse la gérer
    }finally{
        toggleLoadingSpinner(false); // Masque le spinner après la requête
    }
}