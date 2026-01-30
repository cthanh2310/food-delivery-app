const net = require('net');

const startPort = parseInt(process.env.PORT || 3000, 10);

function findPort(port) {
    const server = net.createServer();

    server.listen(port, () => {
        server.close(() => {
            console.log(port);
            process.exit(0);
        });
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            findPort(port + 1);
        } else {
            console.error(err);
            process.exit(1);
        }
    });
}

findPort(startPort);
