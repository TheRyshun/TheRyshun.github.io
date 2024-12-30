// État global du jeu
const gameState = {
    currentPhase: 'home',
    gamePhase: 'clothes',
    currentIntensityLevel: 1,
    usedGages: new Set(),
    usedCustomGages: new Set(),
    players: {
        player1: null,
        player2: null
    },
    currentTurn: {
        activePlayer: 'player1',
        targetPlayer: 'player2',
        targetClothes: null,
        currentGage: null
    },
    clothes: {
        haut: ['T-shirt', 'Pull'],
        bas: ['Pantalon', 'Short', 'Jupe'],
        sousVetements: {
            H: ['Caleçon', 'Slip'],
            F: ['Soutien-gorge et culotte']
        }
    },
    clothesGages: {
        haut: {
            H: [ // Gages pour les hommes retirant le haut d'une femme
                "Retire son haut tout en l'embrassant doucement sa poitrine",
                "Retire son haut tout en l'embrassant doucement sa poitrine"
            ],
            F: [ // Gages pour les femmes retirant le haut d'un homme
                "Retire son haut tout en l'embrassant doucement sur le cou",
                "Retire son haut tout en l'embrassant doucement sur le cou"
            ]
        },
        bas: {
            H: [ // Gages pour les hommes retirant le bas d'une femme
                "Retire lentement son bas tout en caressant ses fesses",
                "Retire lentement son bas tout en caressant ses fesses"
            ],
            F: [ // Gages pour les femmes retirant le bas d'un homme
                "Baisse son pantalon tout en le regardant intensément dans les yeux",
                "Baisse son pantalon tout en le regardant intensément dans les yeux"
            ]
        },
        sousVetements: {
            H: [ // Gages pour les hommes retirant les sous-vêtements d'une femme
                "Enlève ses sous-vêtements et tout en la stimulant avec tes doigts (clitoris)",
                "Enlève ses sous-vêtements et tout en la stimulant avec ta bouche (clitoris)."
            ],
            F: [ // Gages pour les femmes retirant les sous-vêtements d'un homme
                "Enlève ses sous-vêtements en lui fessant des bissous et coup de langue sur son sexe.",
                "Enlève ses sous-vêtements en lui fessant des bissous et coup de langue sur son sexe."
            ]
        }
    },
    defaultGages: {
        H: { // Gages pour les hommes vers les femmes
            1: [ // Niveau 1 : Sensuels et exploratoires
                "Passe tes lèvres sur ses tétons, alternant baisers et légères morsures",
                "Passe tes lèvres sur ses tétons, alternant baisers et légères morsures"
            ],
            2: [ // Niveau 2 : Intimes et suggestifs
                "Stimule son clitoris avec ta langue pendant 1 minute, en alternant les rythmes",
                "Pénètre-la doucement avec un doigt, tout en maintenant un contact visuel"
            ],
            3: [ // Niveau 3 : Audacieux et sexuels
                "Fait la jouir du clitoris",
                "Allonge-la sur le dos et fait un fist pendant 1 minute"
            ],
            4: [ // Niveau 4 : Hardcore et explicite
                "Positionne-la dans une posture intime (par exemple, à genoux ou allongée) et pratique une fellation approfondie",
                "Pratique une pénétration lente, en changeant de rythme pour la surprendre",
                "Simple juste une baise hard oupsy"
            ]
        },
        F: { // Gages pour les femmes vers les hommes
            1: [ // Niveau 1 : Sensuels et exploratoires
                "Masturbe le pendant 1 minute (amuse toi commme tu veux avec lui).",
                "Masturbe le pendant 1 minute (amuse toi commme tu veux avec lui)."
            ],
            2: [ // Niveau 2 : Intimes et suggestifs
                "Utilise ta bouche pour stimuler la longueur de son pénis, en variant bisous et gorge.",
                "Joue avec ses testicules en les massant ou les embrassant délicatement."
            ],
            3: [ // Niveau 3 : Audacieux et sexuels
                "Monte sur lui et simule un mouvement de chevauchement sensuel, avec ou sans contact direct.",
                "Monte sur lui et simule un mouvement de chevauchement sensuel, avec ou sans contact direct."
            ],
            4: [ // Niveau 4 : Hardcore et explicite
                "Monte sur lui en position cowgirl et contrôle les mouvements pendant 1 minute.",
                "Dit lui ce que tu veux faire et il le fait.",
                "Tu dois le faire craquer mentalement par contre après il est libre ^^'."
            ]
        }
    }
};

// Fonctions de navigation
function startGame() {
    console.log("Démarrage du jeu");
    showPage('profile-creation');
    setupGenderListeners();
}

function showPage(pageId) {
    console.log("Affichage de la page:", pageId);
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    gameState.currentPhase = pageId;
}

// Gestion des profils
function setupGenderListeners() {
    ['player1', 'player2'].forEach(player => {
        const genderSelect = document.getElementById(`${player}-gender`);
        genderSelect.addEventListener('change', () => {
            updateUnderwearOptions(player, genderSelect.value);
        });
    });
}

function updateUnderwearOptions(player, gender) {
    const underwearSelect = document.getElementById(`${player}-underwear`);
    underwearSelect.innerHTML = '<option value="">Choisir les sous-vêtements</option>';
    
    if (gender === 'H' || gender === 'F') {
        gameState.clothes.sousVetements[gender].forEach(item => {
            const option = document.createElement('option');
            option.value = item.toLowerCase();
            option.textContent = item;
            underwearSelect.appendChild(option);
        });
    }
}

function validateProfiles() {
    console.log("Validation des profils");
    const player1 = getPlayerData('player1');
    const player2 = getPlayerData('player2');

    if (!validatePlayerData(player1) || !validatePlayerData(player2)) {
        return;
    }

    if (player1.gender === player2.gender) {
        alert('Le jeu nécessite un homme et une femme');
        return;
    }

    gameState.players.player1 = player1;
    gameState.players.player2 = player2;
    startGamePhase();
}

function validatePlayerData(player) {
    if (!player.name) {
        alert('Veuillez entrer un nom');
        return false;
    }
    if (!player.gender) {
        alert('Veuillez sélectionner un genre');
        return false;
    }
    if (!player.clothes.haut || !player.clothes.bas || !player.clothes.sousVetements) {
        alert('Veuillez sélectionner tous les vêtements');
        return false;
    }
    if (player.customGages.length < 3) {
        alert('Veuillez entrer 3 gages personnalisés');
        return false;
    }
    return true;
}

function getPlayerData(playerId) {
    return {
        name: document.getElementById(`${playerId}-name`).value,
        gender: document.getElementById(`${playerId}-gender`).value,
        clothes: {
            haut: document.getElementById(`${playerId}-top`).value,
            bas: document.getElementById(`${playerId}-bottom`).value,
            sousVetements: document.getElementById(`${playerId}-underwear`).value
        },
        customGages: Array.from(document.querySelectorAll(`#${playerId}-gages .gage-input`))
            .map(input => input.value)
            .filter(gage => gage.trim() !== ''),
        score: 0,
        remainingClothes: ['haut', 'bas', 'sousVetements']
    };
}

// Fonction pour obtenir un gage non utilisé
function getUnusedGage(gages) {
    const unusedGages = gages.filter(gage => !gameState.usedGages.has(gage));
    if (unusedGages.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * unusedGages.length);
    return unusedGages[randomIndex];
}

// Phase de jeu
function startGamePhase() {
    console.log("Démarrage de la phase de jeu");
    showPage('game-phase');
    updateGameInterface();
    startNextTurn();
}

function updateGameInterface() {
    const activePlayer = gameState.players[gameState.currentTurn.activePlayer];

    document.getElementById('active-player').textContent = `${activePlayer.name}, c'est ton tour!`;
    
    // Commenter ou supprimer les lignes suivantes pour cacher les scores
    // document.getElementById('player1-score').textContent = gameState.players.player1.score;
    // document.getElementById('player2-score').textContent = gameState.players.player2.score;
}

function startCustomGagesPhase() {
    gameState.gamePhase = 'custom_gages';
    gameState.currentIntensityLevel = 1;
    gameState.usedGages.clear();
    document.querySelector('.phase-indicator').textContent = 
        `Phase 2: Gages personnalisés - Niveau ${gameState.currentIntensityLevel}`;
    // Cacher le bouton "Passer à la Phase 2" après avoir cliqué dessus
    document.getElementById('next-phase-btn').style.display = 'none';
    startNextTurn();
}

function startNextTurn() {
    console.log("Démarrage du prochain tour");
    const activePlayer = gameState.players[gameState.currentTurn.activePlayer];
    const targetPlayer = gameState.players[gameState.currentTurn.targetPlayer];

    if (gameState.gamePhase === 'clothes') {
        // Déterminer le prochain type de vêtement à retirer
        let clothesType;
        if (targetPlayer.remainingClothes.includes('haut')) {
            clothesType = 'haut';
        } else if (targetPlayer.remainingClothes.includes('bas')) {
            clothesType = 'bas';
        } else if (targetPlayer.remainingClothes.includes('sousVetements')) {
            clothesType = 'sousVetements';
        } else {
            // Tous les vêtements ont été retirés, afficher le bouton pour passer à la phase suivante
            document.getElementById('next-phase-btn').style.display = 'block';
            document.getElementById('complete-gage-btn').style.display = 'none';
            document.querySelector('.rating-system').style.display = 'none';
            return;
        }

        gameState.currentTurn.targetClothes = clothesType;
        
        // Sélection d'un gage spécifique au type de vêtement
        const clothesGages = gameState.clothesGages[clothesType][activePlayer.gender];
        const unusedClothesGages = clothesGages.filter(gage => !gameState.usedGages.has(gage));
        
        let selectedGage;
        if (unusedClothesGages.length > 0) {
            selectedGage = unusedClothesGages[Math.floor(Math.random() * unusedClothesGages.length)];
        } else {
            // Si tous les gages spécifiques ont été utilisés, on les réutilise
            selectedGage = clothesGages[Math.floor(Math.random() * clothesGages.length)];
            gameState.usedGages.clear(); // On réinitialise pour le prochain tour
        }
        
        gameState.currentTurn.currentGage = selectedGage;
        gameState.usedGages.add(selectedGage);
        
        document.getElementById('target-clothes').textContent = 
            `Vêtement à retirer: ${targetPlayer.clothes[clothesType]}`;
    } else {
        // Phase des gages personnalisés
        const availableGages = [];
        
        // Ajout des gages prédéfinis du niveau actuel non utilisés
        const defaultGagesForLevel = gameState.defaultGages[activePlayer.gender][gameState.currentIntensityLevel];
        const unusedDefaultGages = defaultGagesForLevel.filter(gage => !gameState.usedGages.has(gage));
        availableGages.push(...unusedDefaultGages);
        
        // Ajout des gages personnalisés jamais utilisés
        if (activePlayer.customGages && activePlayer.customGages.length > 0) {
            const unusedCustomGages = activePlayer.customGages.filter(gage => !gameState.usedCustomGages.has(gage));
            availableGages.push(...unusedCustomGages);
        }

        if (availableGages.length === 0) {
            // Passage au niveau suivant
            gameState.currentIntensityLevel++;
            if (gameState.currentIntensityLevel > 4) {
                // Vérifier s'il reste des gages personnalisés non utilisés
                const remainingCustomGages = [
                    ...gameState.players.player1.customGages.filter(gage => !gameState.usedCustomGages.has(gage)),
                    ...gameState.players.player2.customGages.filter(gage => !gameState.usedCustomGages.has(gage))
                ];
                
                if (remainingCustomGages.length === 0) {
                    endGame();
                    return;
                } else {
                    // Recommencer au niveau 1 s'il reste des gages personnalisés
                    gameState.currentIntensityLevel = 1;
                    gameState.usedGages.clear();
                }
            }
            document.querySelector('.phase-indicator').textContent = 
                `Phase 2: Gages personnalisés - Niveau ${gameState.currentIntensityLevel}`;
            startNextTurn();
            return;
        }

        // Sélection aléatoire d'un gage
        const randomIndex = Math.floor(Math.random() * availableGages.length);
        const selectedGage = availableGages[randomIndex];
        gameState.currentTurn.currentGage = selectedGage;
        
        // Si c'est un gage personnalisé, l'ajouter à usedCustomGages
        if (activePlayer.customGages.includes(selectedGage)) {
            gameState.usedCustomGages.add(selectedGage);
        } else {
            gameState.usedGages.add(selectedGage);
        }

        document.getElementById('target-clothes').textContent = 
            `Niveau d'intensité: ${gameState.currentIntensityLevel}`;
    }

    document.getElementById('current-gage').textContent = gameState.currentTurn.currentGage;
    document.getElementById('complete-gage-btn').style.display = 'block';
    document.querySelector('.rating-system').style.display = 'none';
}

function completeGage() {
    document.getElementById('complete-gage-btn').style.display = 'none';
    document.querySelector('.rating-system').style.display = 'block';
}

function rateGage(rating) {
    const activePlayer = gameState.players[gameState.currentTurn.activePlayer];
    activePlayer.score += rating;

    if (gameState.gamePhase === 'clothes') {
        const targetPlayer = gameState.players[gameState.currentTurn.targetPlayer];
        const clothesIndex = targetPlayer.remainingClothes.indexOf(gameState.currentTurn.targetClothes);
        if (clothesIndex > -1) {
            targetPlayer.remainingClothes.splice(clothesIndex, 1);
        }

        // Vérifier si tous les vêtements ont été retirés après la notation
        if (targetPlayer.remainingClothes.length === 0) {
            document.getElementById('next-phase-btn').style.display = 'block';
            document.getElementById('complete-gage-btn').style.display = 'none';
            document.querySelector('.rating-system').style.display = 'none';
        }
    }

    // Changement de joueur
    [gameState.currentTurn.activePlayer, gameState.currentTurn.targetPlayer] = 
    [gameState.currentTurn.targetPlayer, gameState.currentTurn.activePlayer];

    updateGameInterface();
    startNextTurn();
}

function completeGage() {
    document.getElementById('complete-gage-btn').style.display = 'none';
    document.querySelector('.rating-system').style.display = 'block';
}

function rateGage(rating) {
    const activePlayer = gameState.players[gameState.currentTurn.activePlayer];
    activePlayer.score += rating;

    if (gameState.gamePhase === 'clothes') {
        const targetPlayer = gameState.players[gameState.currentTurn.targetPlayer];
        const clothesIndex = targetPlayer.remainingClothes.indexOf(gameState.currentTurn.targetClothes);
        if (clothesIndex > -1) {
            targetPlayer.remainingClothes.splice(clothesIndex, 1);
        }
    }

    // Changement de joueur
    [gameState.currentTurn.activePlayer, gameState.currentTurn.targetPlayer] = 
    [gameState.currentTurn.targetPlayer, gameState.currentTurn.activePlayer];

    updateGameInterface();
    startNextTurn();
}

function endGame() {
    const player1 = gameState.players.player1;
    const player2 = gameState.players.player2;
    
    document.getElementById('player1-final-score').textContent = player1.name + ': ' + player1.score;
    document.getElementById('player2-final-score').textContent = player2.name + ': ' + player2.score;
    
    const winner = player1.score > player2.score ? player1 : player2;
    const loser = player1.score > player2.score ? player2 : player1;
    
    document.getElementById('end-message').innerHTML = 
        `Bravo ${player1.name} et ${player2.name}! Votre complicité a fait monter la température!<br>
        - ${winner.name} peut choisir une activité intime pour conclure.<br>
        - ${loser.name} devra exécuter un gage supplémentaire choisi par ${winner.name}.`;
    
    showPage('game-end');
}

function startNewGame() {
    gameState.currentPhase = 'home';
    gameState.gamePhase = 'clothes';
    gameState.currentIntensityLevel = 1;
    gameState.usedGages.clear();
    gameState.usedCustomGages.clear(); 
    gameState.players.player1 = null;
    gameState.players.player2 = null;
    gameState.currentTurn.activePlayer = 'player1';
    gameState.currentTurn.targetPlayer = 'player2';
    
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    
    showPage('home');
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});
