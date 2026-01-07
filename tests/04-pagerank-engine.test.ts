import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PageRankEngine } from '../src/modules/04-pagerank-engine.js';

describe('Module 04: PageRank Engine & D3 Graph Exporter', () => {
  it('computes authority scores and exports D3 force layout nodes', () => {
    const engine = new PageRankEngine();

    // Node A points to B and C
    // Node B points to C
    // Node C points to A
    engine.addLink('https://site-a.com', 'https://site-b.com');
    engine.addLink('https://site-a.com', 'https://site-c.com');
    engine.addLink('https://site-b.com', 'https://site-c.com');
    engine.addLink('https://site-c.com', 'https://site-a.com');

    const ranks = engine.computeRanks(30, 0.85);

    // Node C receives links from both A and B, so its authority score must be highest
    const scoreA = ranks.get('https://site-a.com')!;
    const scoreB = ranks.get('https://site-b.com')!;
    const scoreC = ranks.get('https://site-c.com')!;

    assert(scoreC > scoreB);
    assert(scoreC > scoreA);

    const d3Data = engine.exportD3Data();
    assert.equal(d3Data.nodes.length, 3);
    assert.equal(d3Data.links.length, 4);
  });
});
