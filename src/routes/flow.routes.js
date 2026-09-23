import { Dinic } from '../core/dinic';
import { FlowRequestSchema, FlowResponseSchema } from '../schemas/graph.schema';
export default async function flowRoutes(fastify) {
    const server = fastify.withTypeProvider();
    server.post('/api/v1/flow/compute', {
        schema: {
            body: FlowRequestSchema,
            response: {
                200: FlowResponseSchema,
            },
        },
    }, async (request, reply) => {
        const { source, sink, edges } = request.body;
        const dinic = new Dinic();
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
