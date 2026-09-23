import { Type } from '@sinclair/typebox';

export const EdgeSchema = Type.Object({
  from: Type.String(),
  to: Type.String(),
  capacity: Type.Number({ minimum: 0 })
});

export const FlowRequestSchema = Type.Object({
  source: Type.String(),
  sink: Type.String(),
  edges: Type.Array(EdgeSchema)
});

export const CutEdgeSchema = Type.Object({
  from: Type.String(),
  to: Type.String(),
  capacity: Type.Number(),
  flow: Type.Number(),
  utilizationPct: Type.Number(),
  isBottleneck: Type.Boolean()
});

export const FlowResponseSchema = Type.Object({
  maxFlow: Type.Number(),
  bottlenecks: Type.Array(CutEdgeSchema)
});
