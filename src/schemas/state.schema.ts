import { Type } from '@sinclair/typebox';

export const SyncRequestSchema = Type.Object({
  clientId: Type.Optional(Type.String()),
  addSet: Type.Union([
    Type.Record(Type.String(), Type.Number()),
    Type.Array(Type.Object({
      id: Type.String(),
      val: Type.Object({ item: Type.String(), qty: Type.Number() }),
      ts: Type.Number()
    }))
  ]),
  removeSet: Type.Union([
    Type.Record(Type.String(), Type.Number()),
    Type.Array(Type.Any())
  ])
});

export const SyncResponseSchema = Type.Object({
  status: Type.String(),
  currentState: Type.Object({
    addSet: Type.Record(Type.String(), Type.Number()),
    removeSet: Type.Record(Type.String(), Type.Number())
  })
});
