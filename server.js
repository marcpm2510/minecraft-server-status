// Serveur HTTP simple avec Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8091;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './monitor.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Page non trouvée
                fs.readFile('./404.html', (error, content) => {
                    if (error) {
                        // Si même la page 404 n'est pas trouvée
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<html><body><h1>404: Page non trouvée</h1></body></html>', 'utf-8');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // Erreur serveur
                res.writeHead(500);
                res.end(`Erreur serveur: ${error.code}`);
            }
        } else {
            // Succès
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}/`);
    console.log(`Ouvrez votre navigateur et accédez à cette adresse pour surveiller vos serveurs Minecraft.`);
}); 