const express = require('express');
const path = require('path');
const fs = require('fs');
const net = require('net');

const app = express();
const PORT = 3000;

// Middleware para lidar com dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Carregar as ports do arquivo JSON
const portsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'ports.json'), 'utf8'));

// Função para validar entradas de domínio/IP
function isValidTarget(target) {
    // Padrão para domínios válidos (RFC 1035 e RFC 1123)
    const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?:[A-Za-z0-9-]{1,63}(?<!-)\.)*[A-Za-z]{2,}$/i;
    
    // Padrão para IPv4
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    return domainPattern.test(target) || ipPattern.test(target);
}

// Função para verificar se uma port está aberta
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

    // Valida o alvo (domínio ou IP)
    if (!isValidTarget(target)) {
        //console.error(target, '- Por favor, forneça um domínio ou IP válido.');
        res.status(400).json({ error: 'Entrada inválida. Por favor, forneça um domínio ou IP válido.' });
        return;
    }

    //console.log(`Iniciando escaneamento para ${target}...\n`);

    let results = [];
    for (const port of portsData) {
        try {
            const isOpen = await checkPort(target, port.port);
            const status = isOpen ? 'open' : 'closed';
            //console.log(`port ${port.port} (${port.service}): ${status}`);
            results.push({ port: port.port, service: port.service, status });
        } catch (error) {
            console.error(`Erro ao verificar a port ${port.port}:`, error);
            results.push({ port: port.port, service: port.service, status: 'Erro' });
        }
    }

    res.json({ target, results, message: 'Scanning completed.' });
});

// Inicia o servidor HTTP
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
