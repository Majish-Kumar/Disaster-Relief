import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import flowRoutes from './routes/flow.routes';
import crdtRoutes from './routes/crdt.routes';
import wsRoutes from './routes/ws.routes';
import path from 'path';
const server = Fastify({
    logger: true,
});
async function main() {
    await server.register(cors, {
        origin: '*', // For development purposes
    });
    await server.register(websocket);
    // Serve static UI dashboard
    await server.register(require('@fastify/static'), {
        root: path.join(__dirname, '../public'),
        prefix: '/',
    });
    // Register REST & WS routes
    await server.register(flowRoutes);
    await server.register(crdtRoutes);
    await server.register(wsRoutes);
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
main();
