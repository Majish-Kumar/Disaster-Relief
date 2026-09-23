"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const dinic_1 = require("../src/core/dinic");
(0, vitest_1.describe)('Dinic Max Flow and Min-Cut', () => {
    (0, vitest_1.it)('should compute correct max flow for a simple graph', () => {
        const dinic = new dinic_1.Dinic();
        dinic.addEdge('S', 'A', 10);
        dinic.addEdge('S', 'B', 10);
        dinic.addEdge('A', 'B', 2);
        dinic.addEdge('A', 'T', 4);
        dinic.addEdge('B', 'T', 8);
        dinic.addEdge('A', 'C', 8);
        dinic.addEdge('C', 'T', 9);
        const flow = dinic.computeMaxFlow('S', 'T');
        (0, vitest_1.expect)(flow).toBe(18);
    });
    (0, vitest_1.it)('should identify the min-cut bottlenecks correctly', () => {
        const dinic = new dinic_1.Dinic();
        // A linear graph where middle edge is a bottleneck
        dinic.addEdge('S', 'A', 100);
        dinic.addEdge('A', 'B', 50); // This should be the bottleneck
        dinic.addEdge('B', 'T', 100);
        const flow = dinic.computeMaxFlow('S', 'T');
        (0, vitest_1.expect)(flow).toBe(50);
        const minCut = dinic.getMinCut('S');
        (0, vitest_1.expect)(minCut).toHaveLength(1);
        (0, vitest_1.expect)(minCut[0].from).toBe('A');
        (0, vitest_1.expect)(minCut[0].to).toBe('B');
        (0, vitest_1.expect)(minCut[0].isBottleneck).toBe(true);
        (0, vitest_1.expect)(minCut[0].utilizationPct).toBe(100);
    });
    (0, vitest_1.it)('should return 0 flow if source or sink is disconnected', () => {
        const dinic = new dinic_1.Dinic();
        dinic.addEdge('S', 'A', 10);
        dinic.addEdge('B', 'T', 10);
        const flow = dinic.computeMaxFlow('S', 'T');
        (0, vitest_1.expect)(flow).toBe(0);
    });
});
