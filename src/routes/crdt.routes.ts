import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';
import { LWWElementSet } from '../core/crdt';
import { SyncRequestSchema, SyncResponseSchema } from '../schemas/state.schema';

// Global server state for the CRDT ledger
export const globalLedger = new LWWElementSet();

export default async function crdtRoutes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  server.post(
    '/api/v1/crdt/sync',
    {
      schema: {
        body: SyncRequestSchema,
        response: {
          200: SyncResponseSchema,
          400: Type.Any(),
          500: Type.Any(),
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
    },
    async (request, reply) => {
      const incomingState = request.body;
      
      // Handle the array format from the frontend payload fix
      if (Array.isArray(incomingState.addSet)) {
        const formattedAddSet: Record<string, number> = {};
        incomingState.addSet.forEach((op: any) => {
          formattedAddSet[JSON.stringify(op)] = op.ts;
        });
        incomingState.addSet = formattedAddSet;
      }
      
      if (Array.isArray(incomingState.removeSet)) {
        incomingState.removeSet = {};
      }
      
      const remoteCRDT = LWWElementSet.fromJSON(incomingState as any);
      
      // Merge deterministic conflict-free resolution
      globalLedger.merge(remoteCRDT);

      // Return updated global state
      return reply.status(200).send({
        status: 'synced',
        currentState: globalLedger.toJSON(),
      });
    }
  );
}
