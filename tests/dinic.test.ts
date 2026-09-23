import { describe, it, expect } from 'vitest';
import { Dinic } from '../src/core/dinic';

describe('Dinic Max Flow and Min-Cut', () => {
  it('should compute correct max flow for a simple graph', () => {
    const dinic = new Dinic();
    dinic.addEdge('S', 'A', 10);
    dinic.addEdge('S', 'B', 10);
    dinic.addEdge('A', 'B', 2);
    dinic.addEdge('A', 'T', 4);
    dinic.addEdge('B', 'T', 8);
    dinic.addEdge('A', 'C', 8);
    dinic.addEdge('C', 'T', 9);

    const flow = dinic.computeMaxFlow('S', 'T');
    expect(flow).toBe(18);
  });

  it('should identify the min-cut bottlenecks correctly', () => {
    const dinic = new Dinic();
    
    // A linear graph where middle edge is a bottleneck
    dinic.addEdge('S', 'A', 100);
    dinic.addEdge('A', 'B', 50); // This should be the bottleneck
    dinic.addEdge('B', 'T', 100);

    const flow = dinic.computeMaxFlow('S', 'T');
    expect(flow).toBe(50);

    const minCut = dinic.getMinCut('S');
    expect(minCut).toHaveLength(1);
    expect(minCut[0].from).toBe('A');
    expect(minCut[0].to).toBe('B');
    expect(minCut[0].isBottleneck).toBe(true);
    expect(minCut[0].utilizationPct).toBe(100);
  });

  it('should return 0 flow if source or sink is disconnected', () => {
    const dinic = new Dinic();
    dinic.addEdge('S', 'A', 10);
    dinic.addEdge('B', 'T', 10);

    const flow = dinic.computeMaxFlow('S', 'T');
    expect(flow).toBe(0);
  });
});
