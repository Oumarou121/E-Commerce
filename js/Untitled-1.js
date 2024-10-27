const now = Date.now(); // Obtenir le timestamp actuel
            const updataTime = item.updatedAt; // Récupérer le timestamp de `updatedAt`
            const updatedAtDate = updataTime.toDate ? updataTime.toDate() : new Date(updataTime); // Convertir le Timestamp Firebase en Date
            const state1 = cartItemElement.querySelector(".state1");
            const state2 = cartItemElement.querySelector(".state2");
            const time = cartItemElement.querySelector(".time");
            const btn1 = cartItemElement.querySelector(".btn-one");
            const btn2 = cartItemElement.querySelector(".btn-two");
            const foot = cartItemElement.querySelector(".cart-icon-bottom");
            const footContent = cartItemElement.querySelector(".uil-redo");
            const cartIcon = cartItemElement.querySelector('.add-to-cart');
            // Calculer les dates d'expiration
            const Edate = new Date(updatedAtDate);
            Edate.setDate(updatedAtDate.getDate() + delayAvantExp); // Ajouter 1 jour pour l'expédition
                    
            const Edate1 = new Date(updatedAtDate);
            Edate1.setDate(updatedAtDate.getDate() + delayFinRetour); // Ajouter 3 jours pour le retour

            function setCommonButtonActions(btn1, btn2, orderData, index) {
                btn1.addEventListener('click', () => {
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            
                btn2.addEventListener('click', () => {
                    window.location.href = `track.html?id=${orderData.orderId}&index=${index}`;
                });
            }
            
            function updateStateForPending(state1, state2, foot, btn1, btn2, now, Edate) {
                state2.style.visibility = "hidden";
                state1.style.backgroundColor = "hsl(var(--clr-blue))";
                state1.textContent = (now <= Edate.getTime()) 
                    ? "EN ATTENTE D'EXPÉDITION" 
                    : "COMMANDE EN COURS";
                
                foot.style.display = "none";
                btn1.style.display = "block";
                btn1.textContent = "SUIVRE VOTRE COLIS";
                btn2.textContent = "ANNULER VOTRE COMMANDE";
            }
            
            function updateStateForProgress(state1, state2, foot, btn1) {
                state2.style.visibility = "hidden";
                state1.style.backgroundColor = "hsl(var(--clr-green) / .5)";
                state1.textContent = "LIVRAISON EN COURS";
                
                foot.style.display = "none";
                btn1.textContent = "SUIVRE VOTRE COLIS";
                btn2.style.display = "none";
            }
            
            function updateStateForDelivered(state2, foot, now, Edate1) {
                if (now <= Edate1.getTime()) {
                    state2.textContent = "RETOURNABLE";
                    state2.style.backgroundColor = "hsl(var(--clr-blue) / .8)";
                    foot.addEventListener('click', () => {
                        openCustomAlertRetourne(product, item, orderId, "checking", index);
                    });
                } else {
                    state2.textContent = "NON-RETOURNABLE";
                    foot.style.cursor = "default";
                    foot.querySelector(".uil-redo").textContent = `La période de retour s'est terminée ${formatDate(Edate1)}, mais si c'est en rapport avec la garantie, consultez le +227 94464639`;
                }
            }
            
            function updateStateForCancelled(state1, state2, foot, btn1) {
                state2.style.visibility = "hidden";
                state1.textContent = "COMMANDE ANNULÉE";
                state1.style.backgroundColor = "hsl(var(--clr-black) / .8)";
                
                foot.style.display = "none";
                btn1.style.display = "none";
            }
            
            function updateCartActions(cartIcon, productId) {
                cartIcon.addEventListener('click', async () => {
                    const isCart = await isInCart(productId);
                    if (isCart) {
                        await removeFromCart(productId);
                        cartIcon.classList.remove('in-cart');
                        showAlert('Le produit a été retiré de votre panier!');
                    } else {
                        await addToCart(productId, 1); // Quantité par défaut de 1
                        cartIcon.classList.add('in-cart');
                        showAlert('Le produit a été ajouté à votre panier!');
                    }
                });
            }
            
            // Exemple d'utilisation dans le code principal
            switch (item.status) {
                case "pending":
                    time.textContent = formatDateRange(item.updatedAt, 'delivery');
                    updateStateForPending(state1, state2, foot, btn1, btn2, now, Edate);
                    break;
                case "progress":
                    updateStateForProgress(state1, state2, foot, btn1);
                    break;
                case "delivered":
                    time.textContent = formatDateRange(item.updatedAt, 'delivery');
                    updateStateForDelivered(state2, foot, now, Edate1);
                    break;
                case "cancelled":
                    updateStateForCancelled(state1, state2, foot, btn1);
                    break;
                case "checking":
                    state1.style.display = "none"; // Masquer `state1`
                    state2.textContent = "COMMANDE EN EXAMINATION DE RETOUR"; // Texte à afficher
                    state2.style.backgroundColor = "hsl(var(--clr-red) / .5)"; // Couleur de fond pour indiquer l'examen
                    foot.style.display = "none"; // Masquer le pied de l'icône du panier
                    btn1.style.display = "none"; // Masquer le bouton 1
                    btn2.addEventListener('click', () => {
                        window.location.href = `track.html?id=${orderData.orderId}&index=${index}`; // Redirection vers la page de suivi
                    });
                    break;
                // Ajouter d'autres cas de statut ici
                default:
                    state1.style.display = "none";
                    foot.style.display = "none";
                    btn1.style.display = "none";
            }
            
            // Ajouter les actions communes pour les boutons
            setCommonButtonActions(btn1, btn2, orderData, index);
            
            // Ajouter les actions du panier
            updateCartActions(cartIcon, productId);