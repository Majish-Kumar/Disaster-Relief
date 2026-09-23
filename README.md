# Dynamic Civic Disaster Relief & Resource Distribution Ledger

This is the backend implementation for a deterministic resource allocation system designed for urban flood emergencies. It utilizes robust CS principles to achieve highly-available, conflict-free state management and algorithmically sound supply route optimization.

## Core Features

1. **Max Flow & Bottleneck Detection**:
   Uses **Dinic's Algorithm** (via `src/core/dinic.ts`) to compute the maximum capacity of supply routes (boats, trucks, relief materials). It includes a deterministic Min-Cut extraction process to identify critical bottlenecks in the supply chain during disasters.

2. **Decentralized Inventory State**:
   Uses an **LWW-Element-Set CRDT** (`src/core/crdt.ts`) to allow offline field workers to track medical supplies and boats. Once connected to the network, states merge deterministically without requiring database locks or facing synchronization conflicts.

## Project Structure

```
├── src/
│   ├── core/
│   │   ├── dinic.ts          # Dinic's Algorithm implementation
│   │   └── crdt.ts           # Last-Write-Wins Element-Set CRDT
│   ├── routes/
│   │   ├── flow.routes.ts    # POST /api/v1/flow/compute
│   │   ├── crdt.routes.ts    # POST /api/v1/crdt/sync
│   │   └── ws.routes.ts      # WS /ws/telemetry
│   ├── schemas/
│   │   ├── graph.schema.ts   # Input validation schemas for routes
│   │   └── state.schema.ts   # Sync request validation schemas
│   └── server.ts             # Fastify entrypoint
├── tests/
│   ├── dinic.test.ts         # Math verification tests for max flow
│   └── crdt.test.ts          # Distributed systems tests for CRDT merge logic
```

## Setup & Running

### Requirements
- Node.js v20+

### Installation
```bash
npm install
```

### Starting the Server
```bash
npm run dev
```
By default, the Fastify server runs on `http://0.0.0.0:3000`.

### Running Tests
To run the Vitest suites:
```bash
npm test
```

## API Endpoints

### `POST /api/v1/flow/compute`
Accepts a graph structure (source, sink, and edges with capacity) and computes the maximum flow alongside a list of bottleneck edges (Min-Cut).

**Payload**:
```json
{
  "source": "S",
  "sink": "T",
  "edges": [
    { "from": "S", "to": "A", "capacity": 100 },
    { "from": "A", "to": "T", "capacity": 50 }
  ]
}
```

### `POST /api/v1/crdt/sync`
Accepts a local offline state from a field worker, merges it into the global ledger idempotently, and returns the unified state.

**Payload**:
```json
{
  "addSet": { "medical-kit-1": 1718000000000 },
  "removeSet": {}
}
```

### `WS /ws/telemetry`
Connect via WebSocket to receive real-time alerts. Ensure you send a JSON payload with `type: 'capacity_update'` or `type: 'alert'` to broadcast to other clients.
