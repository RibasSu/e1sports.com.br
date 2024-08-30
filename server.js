const express = require('express');
const path = require('path');
const fs = require('fs');
const net = require('net');

const app = express();
const PORT = 3000;

// Middleware for handling form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Load ports from JSON file
const portsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ports.json'), 'utf8'));

// Function to validate domain/IP entries
function isValidTarget(target) {
    // Standard for valid domains
    const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Za-z0-9-]{1,63}(?<!-)\.)*[A-Za-z]{2,}$/i;
    
    // Standard for IPv4
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return domainPattern.test(target) || ipPattern.test(target);
}

// Function to check if a port is open
const checkPort = (host, port, timeout = 2000) => {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(timeout);

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });

        socket.on('error', () => {
            resolve(false);
        });

        socket.connect(port, host);
    });
};

// Rota para escanear ports
app.post('/scan', async (req, res) => {
    const target = req.body.target;

    // Validates the target (domain or IP)
    if (!isValidTarget(target)) {
        res.status(400).json({ error: 'Please provide a valid domain or IP.' });
        return;
    }

    let results = [];
    for (const port of portsData) {
        try {
            const isOpen = await checkPort(target, port.port);
            const status = isOpen ? 'open' : 'closed';
            results.push({ port: port.port, service: port.service, status });
        } catch (error) {
            console.error(`Error checking port ${port.port}:`, error);
            results.push({ port: port.port, service: port.service, status: 'Error' });
        }
    }

    res.json({ target, results, message: 'Scanning completed.' });
});

// Inicia o servidor HTTP
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
