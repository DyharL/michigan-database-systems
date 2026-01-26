import { InvertedIndexEngine } from '../_lib/modules/06-inverted-index.ts';

export const onRequest: PagesFunction = async (context) => {
  const index = new InvertedIndexEngine();
  index.addDocument('PostgreSQL Storage Architecture', 'PostgreSQL uses multi-version concurrency control MVCC and write ahead logging WAL for durability.');
  index.addDocument('Cloudflare Edge Caching', 'Cloudflare provides edge caching, DNS routing, and global serverless functions.');
  index.addDocument('High-Performance Indexing Architecture', 'B-tree and GIN indexing in PostgreSQL dramatically accelerates analytical query execution.');

  const body: any = await context.request.json().catch(() => ({}));
  const query = body.query || 'postgresql indexing';
  return new Response(JSON.stringify(index.search(query)), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
