import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SqlTfIdfEngine } from '../src/modules/08-sql-tfidf.js';

describe('Module 08: Pure SQL TF-IDF Engine', () => {
  it('calculates term frequency and inverse document frequency across text corpus', () => {
    const engine = new SqlTfIdfEngine();

    // Document 1 is about PostgreSQL and database internals
    engine.addDocument(1, 'PostgreSQL database indexing architecture and relational storage tables.');

    // Document 2 is about front-end interfaces
    engine.addDocument(2, 'Modern responsive user interface design with components and layouts.');

    // Document 3 is about database transactions
    engine.addDocument(3, 'ACID transaction isolation levels in relational database systems.');

    const scoresDoc1 = engine.computeTfIdf(1);
    assert(scoresDoc1.length > 0);

    // Terms unique to Doc 1 (like 'indexing' or 'storage') have higher TF-IDF than 'database' (which appears in multiple docs)
    const indexingScore = scoresDoc1.find((s) => s.term === 'indexing')?.tfidf || 0;
    const databaseScore = scoresDoc1.find((s) => s.term === 'database')?.tfidf || 0;

    assert(indexingScore > databaseScore);
  });
});
