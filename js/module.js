// Fonction pour afficher ou masquer le spinner
export function toggleLoadingSpinner(show) {
    // Vérifie si le conteneur du spinner existe déjà dans le DOM
    let spinnerContainer = document.getElementById('loading-spinner-container');

    if (!spinnerContainer) {
        // Si le conteneur n'existe pas, le créer
        spinnerContainer = document.createElement('div');
        spinnerContainer.id = 'loading-spinner-container';
        spinnerContainer.innerHTML = `
            <div id="loading-spinner">
                <div class="spinner"></div>
            </div>
        `;
        document.body.appendChild(spinnerContainer);

        // Ajoute les styles CSS pour le spinner directement via JavaScript
        const style = document.createElement('style');
        style.textContent = `
            /* Style du conteneur du spinner */
            #loading-spinner-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5); /* Fond semi-transparent */
                z-index: 999999999999; /* Devant tous les autres éléments */
                display: none; /* Par défaut masqué */
            }
            /* Style du spinner */
            .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: #000;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            /* Animation de rotation */
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
            /* Centrer le spinner à l'écran */
            #loading-spinner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        `;
        document.head.appendChild(style);
    }

    // Affiche ou masque le spinner selon la valeur du paramètre "show"
    spinnerContainer.style.display = show ? 'block' : 'none';

    // Bloque ou débloque les clics en fonction de la visibilité du spinner
    if (show) {
        document.body.style.pointerEvents = 'none'; // Bloque les clics
    } else {
        document.body.style.pointerEvents = ''; // Réactive les clics
    }
}
