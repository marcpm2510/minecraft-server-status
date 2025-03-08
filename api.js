// API pour vérifier le statut des serveurs Minecraft
const http = require('http');
const url = require('url');
const util = require('minecraft-server-util');

const PORT = 8092;

// Options pour la requête Minecraft
const options = {
    timeout: 5000, // Timeout en millisecondes
    enableSRV: true // Activer la résolution SRV
};

// Fonction pour vérifier le statut d'un serveur Minecraft
async function checkServerStatus(host, port) {
    try {
        const result = await util.status(host, port, options);
        return {
            online: true,
            address: `${host}:${port}`,
            hostname: result.srvRecord ? result.srvRecord.host : host,
            ip: result.srvRecord ? result.srvRecord.host : host,
            port: result.srvRecord ? result.srvRecord.port : port,
            version: result.version.name,
            protocol: result.version.protocol,
            players: {
                online: result.players.online,
                max: result.players.max,
                sample: result.players.sample || []
            },
            motd: {
                raw: result.motd.raw,
                clean: result.motd.clean,
                html: result.motd.html
            },
            favicon: result.favicon,
            roundTripLatency: result.roundTripLatency
        };
    } catch (error) {
        return {
            online: false,
            address: `${host}:${port}`,
            error: error.message
        };
    }
}

// Créer le serveur HTTP
const server = http.createServer(async (req, res) => {
    // Configurer les en-têtes CORS pour permettre les requêtes depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Gérer les requêtes OPTIONS (pré-vol CORS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Analyser l'URL de la requête
    const parsedUrl = url.parse(req.url, true);
    
    // Route pour vérifier le statut d'un serveur
    if (parsedUrl.pathname === '/status' && req.method === 'GET') {
        const { server: serverAddress } = parsedUrl.query;
        
        if (!serverAddress) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Paramètre "server" manquant' }));
            return;
        }
        
        // Extraire l'hôte et le port
        let host, port;
        if (serverAddress.includes(':')) {
            [host, port] = serverAddress.split(':');
            port = parseInt(port, 10);
        } else {
            host = serverAddress;
            port = 25565; // Port Minecraft par défaut
        }
        
        try {
            const result = await checkServerStatus(host, port);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    } 
    // Route pour vérifier plusieurs serveurs à la fois
    else if (parsedUrl.pathname === '/batch-status' && req.method === 'GET') {
        const { servers } = parsedUrl.query;
        
        if (!servers) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Paramètre "servers" manquant' }));
            return;
        }
        
        // Diviser la chaîne de serveurs en tableau
        const serverList = servers.split(',');
        
        try {
            const results = {};
            
            // Vérifier chaque serveur
            for (const serverAddress of serverList) {
                let host, port;
                if (serverAddress.includes(':')) {
                    [host, port] = serverAddress.split(':');
                    port = parseInt(port, 10);
                } else {
                    host = serverAddress;
                    port = 25565; // Port Minecraft par défaut
                }
                
                results[serverAddress] = await checkServerStatus(host, port);
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    } 
    // Route par défaut
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Route non trouvée',
            routes: {
                '/status': 'Vérifier le statut d\'un serveur (paramètre: server)',
                '/batch-status': 'Vérifier le statut de plusieurs serveurs (paramètre: servers, séparés par des virgules)'
            }
        }));
    }
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`API de statut Minecraft en cours d'exécution sur http://localhost:${PORT}/`);
    console.log(`Routes disponibles:`);
    console.log(`  - GET /status?server=host:port`);
    console.log(`  - GET /batch-status?servers=host1:port1,host2:port2,...`);
}); 