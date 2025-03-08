// Script pour démarrer à la fois le serveur web et l'API
const { spawn } = require('child_process');
const path = require('path');

// Fonction pour démarrer un processus Node.js
function startNodeProcess(scriptPath, name) {
    console.log(`Démarrage de ${name}...`);
    
    const process = spawn('node', [scriptPath], {
        stdio: 'pipe',
        shell: true
    });
    
    process.stdout.on('data', (data) => {
        console.log(`[${name}] ${data.toString().trim()}`);
    });
    
    process.stderr.on('data', (data) => {
        console.error(`[${name}] ERREUR: ${data.toString().trim()}`);
    });
    
    process.on('close', (code) => {
        console.log(`[${name}] Le processus s'est arrêté avec le code ${code}`);
    });
    
    return process;
}

// Démarrer le serveur web
const webServer = startNodeProcess(path.join(__dirname, 'server.js'), 'Serveur Web');

// Démarrer l'API
const apiServer = startNodeProcess(path.join(__dirname, 'api.js'), 'API');

// Gérer l'arrêt propre des processus
process.on('SIGINT', () => {
    console.log('\nArrêt des serveurs...');
    webServer.kill();
    apiServer.kill();
    process.exit(0);
});

console.log('\nPour arrêter les serveurs, appuyez sur Ctrl+C\n');
console.log('Accédez à l\'interface web à l\'adresse: http://localhost:8091/');
console.log('L\'API est disponible à l\'adresse: http://localhost:8092/'); 