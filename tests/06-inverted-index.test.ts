import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InvertedIndexEngine } from '../src/modules/06-inverted-index.js';

describe('Module 06: Full-Text Inverted Index Search', () => {
  it('indexes documents, eliminates stop-words, and ranks multi-word queries', () => {
    const engine = new InvertedIndexEngine();

    engine.addDocument(
      'PostgreSQL Storage Architecture',
      'PostgreSQL uses multi-version concurrency control MVCC and write ahead logging WAL for durability.'
    );

    engine.addDocument(
      'Cloudflare Edge Caching',
      'Cloudflare provides edge caching, DNS routing, and global serverless functions.'
    );

    engine.addDocument(
      'High-Performance Indexing Architecture',
      'B-tree and GIN indexing in PostgreSQL indexing dramatically accelerates analytical query indexing execution.'
    );

    // Search for PostgreSQL indexing
    const results = engine.search('postgresql indexing');
    assert(results.length >= 2);
    // Highest ranked document contains multiple occurrences of indexing and postgresql
    assert.equal(results[0].title, 'High-Performance Indexing Architecture');
    assert(results[0].matchedTokens.includes('postgresql'));
    assert(results[0].matchedTokens.includes('indexing'));
  });
});
