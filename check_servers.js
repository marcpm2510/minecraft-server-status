// Script pour vérifier le statut des serveurs Minecraft
const servers = [
    '141.145.205.83:25570',
    '141.145.205.83:25565',
    '141.145.199.182:25575'
];

async function checkServerStatus(serverAddress) {
    console.log(`Vérification du serveur: ${serverAddress}...`);
    try {
        const response = await fetch(`https://api.mcsrvstat.us/2/${serverAddress}`);
        const data = await response.json();
        
        console.log(`\nRésultats pour ${serverAddress}:`);
        console.log(`Statut: ${data.online ? 'En ligne ✅' : 'Hors ligne ❌'}`);
        
        if (data.online) {
            console.log(`Joueurs: ${data.players.online}/${data.players.max}`);
            console.log(`Version: ${data.version || 'Non disponible'}`);
            
            if (data.motd && data.motd.clean) {
                console.log(`Description: ${data.motd.clean.join('\n')}`);
            }
            
            if (data.software) {
                console.log(`Logiciel: ${data.software}`);
            }
        }
        
        console.log('-'.repeat(50));
        return data;
    } catch (error) {
        console.error(`Erreur lors de la vérification de ${serverAddress}:`, error);
        console.log('-'.repeat(50));
        return { online: false, error: error.message };
    }
}

async function checkAllServers() {
    console.log('Vérification du statut des serveurs Minecraft...\n');
    console.log('-'.repeat(50));
    
    const results = {};
    
    for (const server of servers) {
        const result = await checkServerStatus(server);
        results[server] = result;
    }
    
    console.log('\nRésumé:');
    for (const [server, data] of Object.entries(results)) {
        console.log(`${server}: ${data.online ? 'En ligne ✅' : 'Hors ligne ❌'}`);
    }
}

// Exécuter la vérification
checkAllServers(); 