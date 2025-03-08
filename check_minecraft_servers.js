// Script pour vérifier le statut des serveurs Minecraft avec minecraft-server-util
const util = require('minecraft-server-util');

// Liste des serveurs à vérifier
const servers = [
    { host: '141.145.205.83', port: 25570 },
    { host: '141.145.205.83', port: 25565 },
    { host: '141.145.199.182', port: 25575 }
];

// Options pour la requête
const options = {
    timeout: 5000, // Timeout en millisecondes
    enableSRV: true // Activer la résolution SRV
};

// Fonction pour vérifier le statut d'un serveur
async function checkServerStatus(host, port) {
    console.log(`\nVérification du serveur: ${host}:${port}...`);
    
    try {
        const result = await util.status(host, port, options);
        displayServerInfo(host, port, result);
        return { online: true, data: result };
    } catch (error) {
        console.log(`\n=== Résultats pour ${host}:${port} ===`);
        console.log(`Statut: Hors ligne ❌`);
        console.log(`Erreur: ${error.message}`);
        console.log('='.repeat(40));
        return { online: false, error: error.message };
    }
}

// Fonction pour afficher les informations du serveur
function displayServerInfo(host, port, data) {
    console.log(`\n=== Résultats pour ${host}:${port} ===`);
    console.log(`Statut: En ligne ✅`);
    console.log(`Version: ${data.version.name}`);
    console.log(`Protocole: ${data.version.protocol}`);
    console.log(`Joueurs: ${data.players.online}/${data.players.max}`);
    
    if (data.motd && data.motd.clean) {
        console.log(`Description: ${data.motd.clean}`);
    }
    
    if (data.players.sample && data.players.sample.length > 0) {
        console.log(`\nJoueurs connectés:`);
        data.players.sample.forEach(player => {
            console.log(`- ${player.name}`);
        });
    }
    
    console.log('='.repeat(40));
}

// Fonction principale pour vérifier tous les serveurs
async function checkAllServers() {
    console.log('Vérification du statut des serveurs Minecraft...');
    
    const results = {};
    
    for (const server of servers) {
        const { host, port } = server;
        const result = await checkServerStatus(host, port);
        results[`${host}:${port}`] = result;
    }
    
    // Afficher un résumé
    console.log('\n=== Résumé ===');
    for (const [server, result] of Object.entries(results)) {
        console.log(`${server}: ${result.online ? 'En ligne ✅' : 'Hors ligne ❌'}`);
    }
}

// Exécuter la vérification
checkAllServers(); 