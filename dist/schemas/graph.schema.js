"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowResponseSchema = exports.CutEdgeSchema = exports.FlowRequestSchema = exports.EdgeSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.EdgeSchema = typebox_1.Type.Object({
    from: typebox_1.Type.String(),
    to: typebox_1.Type.String(),
    capacity: typebox_1.Type.Number({ minimum: 0 })
});
exports.FlowRequestSchema = typebox_1.Type.Object({
    source: typebox_1.Type.String(),
    sink: typebox_1.Type.String(),
    edges: typebox_1.Type.Array(exports.EdgeSchema)
});
exports.CutEdgeSchema = typebox_1.Type.Object({
    from: typebox_1.Type.String(),
    to: typebox_1.Type.String(),
    capacity: typebox_1.Type.Number(),
    flow: typebox_1.Type.Number(),
    utilizationPct: typebox_1.Type.Number(),
    isBottleneck: typebox_1.Type.Boolean()
});
exports.FlowResponseSchema = typebox_1.Type.Object({
    maxFlow: typebox_1.Type.Number(),
    bottlenecks: typebox_1.Type.Array(exports.CutEdgeSchema)
});
