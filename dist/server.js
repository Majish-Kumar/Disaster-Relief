"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const flow_routes_1 = __importDefault(require("./routes/flow.routes"));
const crdt_routes_1 = __importDefault(require("./routes/crdt.routes"));
const ws_routes_1 = __importDefault(require("./routes/ws.routes"));
const path_1 = __importDefault(require("path"));
const server = (0, fastify_1.default)({
    logger: true,
});
async function main() {
    await server.register(cors_1.default, {
        origin: '*', // For development purposes
    });
    await server.register(websocket_1.default);
    // Serve static UI dashboard
    await server.register(require('@fastify/static'), {
        root: path_1.default.join(__dirname, '../public'),
        prefix: '/',
    });
    // Register REST & WS routes
    await server.register(flow_routes_1.default);
    await server.register(crdt_routes_1.default);
    await server.register(ws_routes_1.default);
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
        await server.listen({ port, host });
        console.log(`Server listening on port ${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
main();
