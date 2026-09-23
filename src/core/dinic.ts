export interface Edge {
  from: string;
  to: string;
  capacity: number;
  flow: number;
  rev: number; // Index of the reverse edge in the adjacency list of the 'to' node
  isOriginal: boolean; // True if this is an original edge, false if it's a residual/reverse edge
}

export interface CutEdge {
  from: string;
  to: string;
  capacity: number;
  flow: number;
  utilizationPct: number;
  isBottleneck: boolean;
}

export class Dinic {
  private adj: Map<string, Edge[]>;
  private level: Map<string, number>;
  private ptr: Map<string, number>; // Keeps track of the next edge to explore in DFS

  constructor() {
    this.adj = new Map();
    this.level = new Map();
    this.ptr = new Map();
  }

  public addEdge(from: string, to: string, capacity: number): void {
    if (!this.adj.has(from)) this.adj.set(from, []);
    if (!this.adj.has(to)) this.adj.set(to, []);

    const adjFrom = this.adj.get(from)!;
    const adjTo = this.adj.get(to)!;

    const edge: Edge = { from, to, capacity, flow: 0, rev: adjTo.length, isOriginal: true };
    const revEdge: Edge = { from: to, to: from, capacity: 0, flow: 0, rev: adjFrom.length, isOriginal: false };

    adjFrom.push(edge);
    adjTo.push(revEdge);
  }

  private bfs(source: string, sink: string): boolean {
    this.level.clear();
    for (const node of this.adj.keys()) {
      this.level.set(node, -1);
    }
    
    this.level.set(source, 0);
    const queue: string[] = [source];
    let head = 0;

    while (head < queue.length) {
      const v = queue[head++];
      const edges = this.adj.get(v) || [];

      for (const edge of edges) {
        if (edge.capacity - edge.flow > 0 && this.level.get(edge.to) === -1) {
          this.level.set(edge.to, this.level.get(v)! + 1);
          queue.push(edge.to);
        }
      }
    }

    return this.level.get(sink) !== -1;
  }

  private dfs(v: string, sink: string, pushed: number): number {
    if (pushed === 0) return 0;
    if (v === sink) return pushed;

    const edges = this.adj.get(v) || [];
    const startIdx = this.ptr.get(v) || 0;

    for (let cid = startIdx; cid < edges.length; cid++) {
      this.ptr.set(v, cid);
      const edge = edges[cid];
      const tr = edge.to;

      if (this.level.get(v)! + 1 !== this.level.get(tr) || edge.capacity - edge.flow === 0) {
        continue;
      }

      const push = this.dfs(tr, sink, Math.min(pushed, edge.capacity - edge.flow));
      if (push === 0) continue;

      edge.flow += push;
      const revEdge = this.adj.get(tr)![edge.rev];
      revEdge.flow -= push;
      
      return push;
    }

    return 0;
  }

  public computeMaxFlow(source: string, sink: string): number {
    let flow = 0;
    
    // Ensure source and sink exist in graph, if not return 0
    if (!this.adj.has(source) || !this.adj.has(sink)) {
      return 0;
    }

    while (this.bfs(source, sink)) {
      this.ptr.clear();
      for (const node of this.adj.keys()) {
        this.ptr.set(node, 0);
      }
      while (true) {
        const pushed = this.dfs(source, sink, Infinity);
        if (pushed === 0) break;
        flow += pushed;
      }
    }
    return flow;
  }

  public getMinCut(source: string): CutEdge[] {
    const reachable = new Set<string>();
    const queue: string[] = [source];
    reachable.add(source);
    let head = 0;

    // BFS to find all nodes reachable from source in residual graph
    while (head < queue.length) {
      const v = queue[head++];
      const edges = this.adj.get(v) || [];
      for (const edge of edges) {
        if (edge.capacity - edge.flow > 0 && !reachable.has(edge.to)) {
          reachable.add(edge.to);
          queue.push(edge.to);
        }
      }
    }

    const cutEdges: CutEdge[] = [];
    
    for (const [u, edges] of this.adj.entries()) {
      if (reachable.has(u)) {
        for (const edge of edges) {
          if (edge.isOriginal && !reachable.has(edge.to)) {
            const utilizationPct = edge.capacity > 0 ? (edge.flow / edge.capacity) * 100 : 0;
            cutEdges.push({
              from: edge.from,
              to: edge.to,
              capacity: edge.capacity,
              flow: edge.flow,
              utilizationPct,
              isBottleneck: true
            });
          }
        }
      }
    }

    return cutEdges;
  }
}
