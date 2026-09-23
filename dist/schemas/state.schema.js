"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncResponseSchema = exports.SyncRequestSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.SyncRequestSchema = typebox_1.Type.Object({
    clientId: typebox_1.Type.Optional(typebox_1.Type.String()),
    addSet: typebox_1.Type.Union([
        typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Number()),
        typebox_1.Type.Array(typebox_1.Type.Object({
            id: typebox_1.Type.String(),
            val: typebox_1.Type.Object({ item: typebox_1.Type.String(), qty: typebox_1.Type.Number() }),
            ts: typebox_1.Type.Number()
        }))
    ]),
    removeSet: typebox_1.Type.Union([
        typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Number()),
        typebox_1.Type.Array(typebox_1.Type.Any())
    ])
});
exports.SyncResponseSchema = typebox_1.Type.Object({
    status: typebox_1.Type.String(),
    currentState: typebox_1.Type.Object({
        addSet: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Number()),
        removeSet: typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.Number())
    })
});
