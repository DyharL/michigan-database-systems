# University of Michigan Database & Data Systems Suite

**University of Michigan Specialization (PY4E & PG4E): 2025–2026.**


Implementation of the **University of Michigan Database & Data Systems Specialization** curricula (PY4E & PG4E) in canonical **Python** and **PostgreSQL (SQL)**.

This repository features canonical source implementations in **Python** (`python/`), analytical **SQL** schemas (`sql/`), and an interactive edge developer playground with a live D3.js force network visualizer.

Live Interactive Showcase: [https://michigan-database-systems.pages.dev](https://michigan-database-systems.pages.dev)

---

## 🏛️ Architecture & Project Catalog

| # | Module Name | Path | Core Engineering Focus |
| :--- | :--- | :--- | :--- |
| **11** | **[Mail Log Analytics](src/modules/01-mail-analytics.ts)** | `src/modules/01-mail-analytics.ts` | High-throughput mbox text log parsing via regular expressions with sender frequencies and hourly distributions. |
| **12** | **[Web Scraper & Geo Ingestion](src/modules/02-web-crawler.ts)** | `src/modules/02-web-crawler.ts` | HTML DOM link extraction and structured geocoding JSON payload parser. |
| **13** | **[Relational Music Schema](src/modules/03-music-database.ts)** | `src/modules/03-music-database.ts` | Normalized schema (Artists, Albums, Genres, Tracks) resolving multi-table analytical SQL JOINs. |
| **14** | **[PageRank & D3 Graph](src/modules/04-pagerank-engine.ts)** | `src/modules/04-pagerank-engine.ts` | Directed graph traversal with 0.85 damping factor and live D3.js force network visualization. |
| **15** | **[3NF Schema & Cascading Deletions](src/modules/05-schema-3nf.ts)** | `src/modules/05-schema-3nf.ts` | Third normal form relational store enforcing foreign key constraints and automated `ON DELETE CASCADE`. |
| **16** | **[Full-Text Inverted Index Search](src/modules/06-inverted-index.ts)** | `src/modules/06-inverted-index.ts` | Tokenization, stop-word filtering, and inverted index search ranking simulating PostgreSQL GIN indexation. |
| **17** | **[JSONB Document Modeling](src/modules/07-jsonb-documents.ts)** | `src/modules/07-jsonb-documents.ts` | Semi-structured store with deep attribute extraction operators and JSON subset containment queries (`@>`). |
| **18** | **[Analytical TF-IDF Engine](src/modules/08-sql-tfidf.ts)** | `src/modules/08-sql-tfidf.ts` | In-database Term Frequency - Inverse Document Frequency ranking algorithm isolating distinctive vocabulary. |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `>= 22.0.0`
- npm `>= 10.0.0`

### 2. Installation
```bash
git clone https://github.com/DyharL/michigan-database-systems.git
cd michigan-database-systems
npm install
```

### 3. Running Unit Tests
```bash
npm test
```

### 4. Running the Local Server & Playground
```bash
npm run dev
# or for production:
npm run build && npm start
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🧪 Test Coverage Summary

```text
▶ Module 01: Mail Log Analytics
  ✔ parses mbox text logs and aggregates sender frequencies and hourly distributions
▶ Module 02: Web Scraper & Geo Ingestion
  ✔ extracts anchors and normalizes relative URLs
  ✔ parses structured JSON geocoding payloads
▶ Module 03: Relational Music Schema
  ✔ deduplicates normalized entities and executes multi-table JOINs
▶ Module 04: PageRank Engine & D3 Graph Exporter
  ✔ computes authority scores and exports D3 force layout nodes
▶ Module 05: 3NF Schema & Cascading Deletes
  ✔ enforces foreign key constraints and cascades department deletion to child tables
▶ Module 06: Full-Text Inverted Index Search
  ✔ indexes documents, eliminates stop-words, and ranks multi-word queries
▶ Module 07: JSONB Document Modeling
  ✔ extracts nested properties and performs JSON subset containment queries
▶ Module 08: Pure SQL TF-IDF Engine
  ✔ calculates term frequency and inverse document frequency across text corpus

ℹ tests 9
ℹ suites 8
ℹ pass 9
ℹ fail 0
```

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE).
Architected by DyharL.
