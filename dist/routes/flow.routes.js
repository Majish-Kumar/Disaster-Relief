"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = flowRoutes;
const dinic_1 = require("../core/dinic");
const graph_schema_1 = require("../schemas/graph.schema");
async function flowRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.post('/api/v1/flow/compute', {
        schema: {
            body: graph_schema_1.FlowRequestSchema,
            response: {
                200: graph_schema_1.FlowResponseSchema,
            },
        },
    }, async (request, reply) => {
        const { source, sink, edges } = request.body;
        const dinic = new dinic_1.Dinic();
        for (const edge of edges) {
            dinic.addEdge(edge.from, edge.to, edge.capacity);
        }
        const maxFlow = dinic.computeMaxFlow(source, sink);
        const bottlenecks = dinic.getMinCut(source);
        return reply.status(200).send({
            maxFlow,
            bottlenecks,
        });
    });
}
