/**
 * Module 04: PageRank Graph Traversal & Authority Scoring Engine
 * Iterative Markov chain algorithm computing PageRank scores across directed web node graphs
 * with damping factor (0.85) and D3.js graph format exporter.
 */

export interface GraphNode {
  id: string;
  url: string;
  score: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface D3GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export class PageRankEngine {
  private links: Map<string, Set<string>> = new Map(); // from -> to[]
  private inbound: Map<string, Set<string>> = new Map(); // to -> from[]
  private nodes: Set<string> = new Set();

  public addLink(fromUrl: string, toUrl: string): void {
    this.nodes.add(fromUrl);
    this.nodes.add(toUrl);

    if (!this.links.has(fromUrl)) this.links.set(fromUrl, new Set());
    this.links.get(fromUrl)!.add(toUrl);

    if (!this.inbound.has(toUrl)) this.inbound.set(toUrl, new Set());
    this.inbound.get(toUrl)!.add(fromUrl);
  }

  public computeRanks(iterations: number = 20, damping: number = 0.85): Map<string, number> {
    const N = this.nodes.size;
    if (N === 0) return new Map();

    const ranks: Map<string, number> = new Map();
    for (const node of this.nodes) {
      ranks.set(node, 1.0 / N);
    }

    for (let it = 0; it < iterations; it++) {
      const nextRanks: Map<string, number> = new Map();
      const baseShare = (1 - damping) / N;

      for (const node of this.nodes) {
        let incomingRankSum = 0;
        const incomingSources = this.inbound.get(node) || new Set();

        for (const src of incomingSources) {
          const outCount = this.links.get(src)?.size || 1;
          const srcRank = ranks.get(src) || 0;
          incomingRankSum += srcRank / outCount;
        }

        nextRanks.set(node, baseShare + damping * incomingRankSum);
      }

      // Normalize so sum equals 1.0
      const totalSum = Array.from(nextRanks.values()).reduce((a, b) => a + b, 0);
      for (const [node, val] of nextRanks.entries()) {
        ranks.set(node, totalSum > 0 ? val / totalSum : 1.0 / N);
      }
    }

    return ranks;
  }

  public exportD3Data(iterations: number = 20): D3GraphData {
    const ranks = this.computeRanks(iterations);
    const nodes: GraphNode[] = Array.from(this.nodes).map((url) => ({
      id: url,
      url,
      score: ranks.get(url) || 0
    }));

    const links: GraphLink[] = [];
    for (const [from, toSet] of this.links.entries()) {
      for (const to of toSet) {
        links.push({ source: from, target: to });
      }
    }

    return { nodes, links };
  }
}
