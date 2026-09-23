"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wsRoutes;
async function wsRoutes(fastify) {
    fastify.get('/ws/telemetry', { websocket: true }, (connection, req) => {
        fastify.log.info('Client connected to telemetry stream');
        // Heartbeat to keep connection alive across firewalls/proxies
        const pingInterval = setInterval(() => {
            if (connection.readyState === 1) { // WebSocket.OPEN is 1
                connection.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
            }
        }, 15000);
        connection.on('message', (message) => {
            const payload = message.toString();
            if (payload === 'pong')
                return; // ignore client pongs
            try {
                const data = JSON.parse(payload);
                // Broadcast bottleneck alerts or capacity updates
                if (data.type === 'alert' || data.type === 'FLOW_RECALCULATED' || data.type === 'capacity_update' || data.type === 'CRDT_STATE_MERGED') {
                    for (const client of fastify.websocketServer.clients) {
                        if (client.readyState === 1) { // WebSocket.OPEN
                            client.send(JSON.stringify(data));
                        }
                    }
                }
            }
            catch (err) {
                fastify.log.warn(`Received non-JSON message: ${payload}`);
            }
        });
        connection.on('close', () => {
            clearInterval(pingInterval);
            fastify.log.info('Client disconnected from telemetry stream');
        });
        connection.on('error', (err) => {
            clearInterval(pingInterval);
            fastify.log.error(`WebSocket Error: ${err.message}`);
        });
    });
}
