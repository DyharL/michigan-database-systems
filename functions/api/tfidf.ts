import { SqlTfIdfEngine } from '../_lib/modules/08-sql-tfidf.ts';

export const onRequest: PagesFunction = async () => {
  const engine = new SqlTfIdfEngine();
  engine.addDocument(1, 'PostgreSQL database indexing architecture and relational storage tables.');
  engine.addDocument(2, 'Modern responsive user interface design with components and layouts.');
  engine.addDocument(3, 'ACID transaction isolation levels in relational database systems.');

  return new Response(JSON.stringify(engine.computeTfIdf(1)), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
