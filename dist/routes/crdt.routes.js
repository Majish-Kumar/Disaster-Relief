"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLedger = void 0;
exports.default = crdtRoutes;
const typebox_1 = require("@sinclair/typebox");
const crdt_1 = require("../core/crdt");
const state_schema_1 = require("../schemas/state.schema");
// Global server state for the CRDT ledger
exports.globalLedger = new crdt_1.LWWElementSet();
async function crdtRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.post('/api/v1/crdt/sync', {
        schema: {
            body: state_schema_1.SyncRequestSchema,
            response: {
                200: state_schema_1.SyncResponseSchema,
                400: typebox_1.Type.Any(),
                500: typebox_1.Type.Any(),
            },
        },
        errorHandler: (error, request, reply) => {
            if (error.validation) {
                request.log.error(`Schema validation error for CRDT Sync: ${JSON.stringify(error.validation)}`);
                return reply.status(400).send(error);
            }
            request.log.error(`CRDT Sync Error: ${error.message}`);
            return reply.status(500).send(error);
        }
    }, async (request, reply) => {
        const incomingState = request.body;
        // Handle the array format from the frontend payload fix
        if (Array.isArray(incomingState.addSet)) {
            const formattedAddSet = {};
            incomingState.addSet.forEach((op) => {
                formattedAddSet[JSON.stringify(op)] = op.ts;
            });
            incomingState.addSet = formattedAddSet;
        }
        if (Array.isArray(incomingState.removeSet)) {
            incomingState.removeSet = {};
        }
        const remoteCRDT = crdt_1.LWWElementSet.fromJSON(incomingState);
        // Merge deterministic conflict-free resolution
        exports.globalLedger.merge(remoteCRDT);
        // Return updated global state
        return reply.status(200).send({
            status: 'synced',
            currentState: exports.globalLedger.toJSON(),
        });
    });
}
