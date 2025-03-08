document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const serverInput = document.getElementById('serverInput');
    const addServerBtn = document.getElementById('addServer');
    const refreshAllBtn = document.getElementById('refreshAll');
    const serverList = document.getElementById('serverList');

    // Liste des serveurs (stockée localement)
    let servers = JSON.parse(localStorage.getItem('minecraftServers')) || [
        'mc.hypixel.net',
        'play.cubecraft.net',
        'mc.mineplex.com'
    ];

    // Initialisation
    init();

    // Fonctions
    function init() {
        // Supprimer le serveur de chargement par défaut
        serverList.innerHTML = '';
        
        // Charger les serveurs sauvegardés
        servers.forEach(server => {
            addServerCard(server);
        });

        // Actualiser tous les serveurs
        refreshAllServers();
    }

    function saveServers() {
        localStorage.setItem('minecraftServers', JSON.stringify(servers));
    }

    function addServerCard(serverAddress) {
        const serverCard = document.createElement('div');
        serverCard.className = 'server-card loading';
        serverCard.dataset.address = serverAddress;

        serverCard.innerHTML = `
            <div class="server-header">
                <h2>${serverAddress}</h2>
                <span class="status">En attente</span>
            </div>
            <div class="server-info">
                <p>Adresse: ${serverAddress}</p>
                <p>Joueurs: Chargement...</p>
                <p>Version: Chargement...</p>
            </div>
            <div class="server-actions">
                <button class="refresh-btn"><i class="fas fa-sync-alt"></i> Actualiser</button>
                <button class="remove-btn"><i class="fas fa-trash"></i> Supprimer</button>
            </div>
        `;

        serverList.appendChild(serverCard);

        // Ajouter les écouteurs d'événements
        const refreshBtn = serverCard.querySelector('.refresh-btn');
        const removeBtn = serverCard.querySelector('.remove-btn');

        refreshBtn.addEventListener('click', () => {
            refreshServer(serverCard, serverAddress);
        });

        removeBtn.addEventListener('click', () => {
            removeServer(serverCard, serverAddress);
        });

        return serverCard;
    }

    async function fetchServerStatus(serverAddress) {
        try {
            // Utiliser une API publique pour obtenir le statut du serveur Minecraft
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
            return await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération du statut du serveur:', error);
            return { online: false, error: error.message };
        }
    }

    async function refreshServer(serverCard, serverAddress) {
        // Mettre la carte en mode chargement
        serverCard.className = 'server-card loading';
        const statusElement = serverCard.querySelector('.status');
        statusElement.textContent = 'Chargement...';
        statusElement.className = 'status';

        // Récupérer les informations du serveur
        const serverData = await fetchServerStatus(serverAddress);

        // Mettre à jour l'interface
        updateServerCard(serverCard, serverData);
    }

    function updateServerCard(serverCard, serverData) {
        const statusElement = serverCard.querySelector('.status');
        const serverInfo = serverCard.querySelector('.server-info');

        serverCard.classList.remove('loading');

        if (serverData.online) {
            // Serveur en ligne
            statusElement.textContent = 'En ligne';
            statusElement.className = 'status online';

            // Informations des joueurs
            const playersInfo = serverData.players ? 
                `${serverData.players.online}/${serverData.players.max}` : 
                'Information non disponible';

            // Version du serveur
            const versionInfo = serverData.version || 'Information non disponible';

            // MOTD (Message of the Day)
            const motd = serverData.motd && serverData.motd.clean ? 
                serverData.motd.clean.join('\n') : 
                'Aucune description';

            // Mettre à jour les informations
            serverInfo.innerHTML = `
                <p>Adresse: ${serverData.hostname || serverData.ip}</p>
                <p>Joueurs: ${playersInfo}</p>
                <p>Version: ${versionInfo}</p>
                <p>Description: ${motd}</p>
            `;

            // Ajouter des informations supplémentaires si disponibles
            if (serverData.software) {
                serverInfo.innerHTML += `<p>Logiciel: ${serverData.software}</p>`;
            }

            if (serverData.plugins && serverData.plugins.names) {
                const pluginsCount = serverData.plugins.names.length;
                serverInfo.innerHTML += `<p>Plugins: ${pluginsCount} installés</p>`;
            }

            if (serverData.mods && serverData.mods.names) {
                const modsCount = serverData.mods.names.length;
                serverInfo.innerHTML += `<p>Mods: ${modsCount} installés</p>`;
            }
        } else {
            // Serveur hors ligne
            statusElement.textContent = 'Hors ligne';
            statusElement.className = 'status offline';

            // Message d'erreur
            serverInfo.innerHTML = `
                <p>Adresse: ${serverData.hostname || serverData.ip || serverCard.dataset.address}</p>
                <p>Statut: Le serveur est actuellement hors ligne ou inaccessible</p>
                <p>Dernière vérification: ${new Date().toLocaleTimeString()}</p>
            `;
        }
    }

    function removeServer(serverCard, serverAddress) {
        // Supprimer de l'interface
        serverCard.remove();
        
        // Supprimer de la liste
        servers = servers.filter(address => address !== serverAddress);
        
        // Sauvegarder
        saveServers();
    }

    function refreshAllServers() {
        const serverCards = document.querySelectorAll('.server-card');
        serverCards.forEach(card => {
            const serverAddress = card.dataset.address;
            refreshServer(card, serverAddress);
        });
    }

    // Événements
    addServerBtn.addEventListener('click', () => {
        const serverAddress = serverInput.value.trim();
        if (serverAddress && !servers.includes(serverAddress)) {
            servers.push(serverAddress);
            saveServers();
            const serverCard = addServerCard(serverAddress);
            refreshServer(serverCard, serverAddress);
            serverInput.value = '';
        } else if (servers.includes(serverAddress)) {
            alert('Ce serveur est déjà dans votre liste!');
        }
    });

    refreshAllBtn.addEventListener('click', refreshAllServers);

    // Permettre l'ajout d'un serveur en appuyant sur Entrée
    serverInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addServerBtn.click();
        }
    });
});