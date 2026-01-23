import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseMailLogs } from './modules/01-mail-analytics.js';
import { extractLinksFromHtml, parseGeoResponse } from './modules/02-web-crawler.js';
import { MusicDatabase } from './modules/03-music-database.js';
import { PageRankEngine } from './modules/04-pagerank-engine.js';
import { Relational3NFStore } from './modules/05-schema-3nf.js';
import { InvertedIndexEngine } from './modules/06-inverted-index.js';
import { JsonbDocumentStore } from './modules/07-jsonb-documents.js';
import { SqlTfIdfEngine } from './modules/08-sql-tfidf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Initialize persistent service instances
const musicDb = new MusicDatabase();
musicDb.insertTrack({
  title: 'Thunderstruck',
  artist: 'AC/DC',
  album: 'The Razors Edge',
  genre: 'Hard Rock',
  durationMs: 292000,
  rating: 5
});
musicDb.insertTrack({
  title: 'Moneytalks',
  artist: 'AC/DC',
  album: 'The Razors Edge',
  genre: 'Hard Rock',
  durationMs: 225000,
  rating: 4
});
musicDb.insertTrack({
  title: 'Smells Like Teen Spirit',
  artist: 'Nirvana',
  album: 'Nevermind',
  genre: 'Grunge',
  durationMs: 301000,
  rating: 5
});

const pageRank = new PageRankEngine();
pageRank.addLink('https://engine.dev', 'https://data.dev');
pageRank.addLink('https://engine.dev', 'https://cloud.dev');
pageRank.addLink('https://data.dev', 'https://cloud.dev');
pageRank.addLink('https://cloud.dev', 'https://engine.dev');
pageRank.addLink('https://edge.dev', 'https://cloud.dev');

const invertedIndex = new InvertedIndexEngine();
invertedIndex.addDocument(
  'PostgreSQL Storage Architecture',
  'PostgreSQL uses multi-version concurrency control MVCC and write ahead logging WAL for durability.'
);
invertedIndex.addDocument(
  'Cloudflare Edge Caching',
  'Cloudflare provides edge caching, DNS routing, and global serverless functions.'
);
invertedIndex.addDocument(
  'High-Performance Indexing Architecture',
  'B-tree and GIN indexing in PostgreSQL dramatically accelerates analytical query execution.'
);

const jsonbStore = new JsonbDocumentStore();
jsonbStore.insert({
  customer: 'Acme Corp',
  tier: 'enterprise',
  settings: { theme: 'dark', telemetry: true },
  tags: ['fintech', 'infrastructure']
});
jsonbStore.insert({
  customer: 'Beta Systems',
  tier: 'standard',
  settings: { theme: 'light', telemetry: false },
  tags: ['retail']
});

const tfidfEngine = new SqlTfIdfEngine();
tfidfEngine.addDocument(1, 'PostgreSQL database indexing architecture and relational storage tables.');
tfidfEngine.addDocument(2, 'Modern responsive user interface design with components and layouts.');
tfidfEngine.addDocument(3, 'ACID transaction isolation levels in relational database systems.');

export function createServer() {
  return http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method?.toUpperCase() || 'GET';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const sendJson = (statusCode: number, data: unknown) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(data, null, 2));
    };

    const readBody = async (): Promise<string> => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk as Buffer);
      }
      return Buffer.concat(chunks).toString('utf-8');
    };

    try {
      if (pathname === '/api/mail-analytics' && method === 'POST') {
        const sampleLog = `
From stephen.marquard@uct.ac.za Sat Jan  5 09:14:16 2008
From louis@media.berkeley.edu Fri Jan  4 18:10:48 2008
From stephen.marquard@uct.ac.za Fri Jan  4 09:12:18 2008
From zqian@umich.edu Thu Jan  3 16:34:40 2008
From rjlowe@iupui.edu Thu Jan  3 15:46:24 2008
        `;
        sendJson(200, parseMailLogs(sampleLog));
        return;
      }

      if (pathname === '/api/crawler' && method === 'POST') {
        const sampleHtml = `
          <html>
            <head><title>University Data Infrastructure</title></head>
            <body>
              <a href="/schema/3nf">Relational Schemas</a>
              <a href="/indexes/gin">GIN Fulltext Indexes</a>
              <a href="https://postgres.org">PostgreSQL Documentation</a>
            </body>
          </html>
        `;
        const crawl = extractLinksFromHtml(sampleHtml, 'https://data.dev');
        const geo = parseGeoResponse(JSON.stringify({
          results: [{
            formatted_address: 'Ann Arbor, MI 48109, United States',
            geometry: { location: { lat: 42.2780, lng: -83.7382 } }
          }]
        }));
        sendJson(200, { crawl, geo });
        return;
      }

      if (pathname === '/api/music-catalog') {
        sendJson(200, musicDb.queryCatalogWithJoins());
        return;
      }

      if (pathname === '/api/pagerank') {
        sendJson(200, pageRank.exportD3Data(30));
        return;
      }

      if (pathname === '/api/cascade' && method === 'POST') {
        const store = new Relational3NFStore();
        const dept = store.createDepartment('Engineering & Infrastructure');
        const emp1 = store.createEmployee('Distributed Systems Lead', dept.id);
        const emp2 = store.createEmployee('Database Architect', dept.id);
        store.assignProject(emp1.id, 'PostgreSQL 17 Migration', 35);
        store.assignProject(emp2.id, 'GIN Indexing Benchmarks', 40);

        const before = {
          departments: store.departments.size,
          employees: store.employees.size,
          assignments: store.assignments.size
        };

        const cascadeResult = store.deleteDepartmentCascade(dept.id);
        const after = {
          departments: store.departments.size,
          employees: store.employees.size,
          assignments: store.assignments.size
        };

        sendJson(200, { before, cascadeResult, after });
        return;
      }

      if (pathname === '/api/search' && method === 'POST') {
        const rawBody = await readBody();
        let query = 'postgresql indexing';
        try {
          const parsed = JSON.parse(rawBody);
          if (parsed.query) query = parsed.query;
        } catch {
          // ignore
        }
        sendJson(200, invertedIndex.search(query));
        return;
      }

      if (pathname === '/api/jsonb-query' && method === 'POST') {
        sendJson(200, jsonbStore.queryByContains({ tier: 'enterprise' }));
        return;
      }

      if (pathname === '/api/tfidf' && method === 'POST') {
        sendJson(200, tfidfEngine.computeTfIdf(1));
        return;
      }

      // Serve static files
      let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes: Record<string, string> = {
          '.html': 'text/html; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8',
          '.json': 'application/json; charset=utf-8',
          '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
        res.end(content);
        return;
      } catch {
        const indexHtml = await fs.readFile(path.join(PUBLIC_DIR, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexHtml);
        return;
      }
    } catch (err: any) {
      sendJson(500, { error: err?.message || 'Internal Server Error' });
    }
  });
}

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`[michigan-database-systems] Live server running on http://localhost:${PORT}`);
  });
}
