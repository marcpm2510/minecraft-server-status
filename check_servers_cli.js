// Script Node.js pour vérifier le statut des serveurs Minecraft depuis la ligne de commande
const https = require('https');

// Liste des serveurs à vérifier
const servers = [
    '141.145.205.83:25570',
    '141.145.205.83:25565',
    '141.145.199.182:25575'
];

// Fonction pour vérifier le statut d'un serveur
function checkServerStatus(serverAddress) {
    return new Promise((resolve, reject) => {
        console.log(`\nVérification du serveur: ${serverAddress}...`);
        
        const url = `https://api.mcsrvstat.us/2/${serverAddress}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const serverData = JSON.parse(data);
                    displayServerInfo(serverAddress, serverData);
                    resolve(serverData);
                } catch (error) {
                    console.error(`Erreur lors de l'analyse des données pour ${serverAddress}:`, error.message);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error(`Erreur lors de la requête pour ${serverAddress}:`, error.message);
            reject(error);
        });
    });
}

// Fonction pour afficher les informations du serveur
function displayServerInfo(serverAddress, data) {
    console.log(`\n=== Résultats pour ${serverAddress} ===`);
    
    if (data.online) {
        console.log(`Statut: En ligne ✅`);
        
        // Informations des joueurs
        const playersInfo = data.players ? 
            `${data.players.online}/${data.players.max}` : 
            'Information non disponible';
        console.log(`Joueurs: ${playersInfo}`);
        
        // Version du serveur
        console.log(`Version: ${data.version || 'Information non disponible'}`);
        
        // MOTD (Message of the Day)
        if (data.motd && data.motd.clean) {
            console.log(`Description: ${data.motd.clean.join('\n')}`);
        }
        
        // Logiciel
        if (data.software) {
            console.log(`Logiciel: ${data.software}`);
        }
        
        // Plugins
        if (data.plugins && data.plugins.names) {
            console.log(`Plugins: ${data.plugins.names.length} installés`);
        }
        
        // Mods
        if (data.mods && data.mods.names) {
            console.log(`Mods: ${data.mods.names.length} installés`);
        }
    } else {
        console.log(`Statut: Hors ligne ❌`);
        console.log(`Le serveur est actuellement hors ligne ou inaccessible`);
    }
    
    console.log('='.repeat(40));
}

// Fonction principale pour vérifier tous les serveurs
async function checkAllServers() {
    console.log('Vérification du statut des serveurs Minecraft...');
    
    const results = {};
    
    for (const server of servers) {
        try {
            const result = await checkServerStatus(server);
            results[server] = result;
        } catch (error) {
            results[server] = { online: false, error: error.message };
        }
    }
    
    // Afficher un résumé
    console.log('\n=== Résumé ===');
    for (const [server, data] of Object.entries(results)) {
        console.log(`${server}: ${data.online ? 'En ligne ✅' : 'Hors ligne ❌'}`);
    }
}

// Exécuter la vérification
checkAllServers(); 