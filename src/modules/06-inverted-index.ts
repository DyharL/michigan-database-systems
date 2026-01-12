/**
 * Module 06: Full-Text Inverted Index Search Engine
 * Implements tokenization, stop-word elimination, stemming, and inverted document indexation
 * simulating PostgreSQL GIN / GiST full-text indexing mechanisms (to_tsvector / to_tsquery).
 */

const STOP_WORDS = new Set([
  'a', 'about', 'an', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with'
]);

export interface IndexedDocument {
  id: number;
  title: string;
  body: string;
}

export interface SearchResult {
  docId: number;
  title: string;
  score: number;
  matchedTokens: string[];
}

export class InvertedIndexEngine {
  private documents: Map<number, IndexedDocument> = new Map();
  private index: Map<string, Map<number, number>> = new Map(); // token -> (docId -> frequency)
  private nextDocId = 1;

  public addDocument(title: string, body: string): number {
    const docId = this.nextDocId++;
    this.documents.set(docId, { id: docId, title, body });

    const tokens = this.tokenize(`${title} ${body}`);
    for (const token of tokens) {
      if (!this.index.has(token)) {
        this.index.set(token, new Map());
      }
      const postings = this.index.get(token)!;
      postings.set(docId, (postings.get(docId) || 0) + 1);
    }

    return docId;
  }

  public search(query: string): SearchResult[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const docScores: Map<number, { score: number; matched: Set<string> }> = new Map();

    for (const token of queryTokens) {
      const postings = this.index.get(token);
      if (!postings) continue;

      for (const [docId, freq] of postings.entries()) {
        if (!docScores.has(docId)) {
          docScores.set(docId, { score: 0, matched: new Set() });
        }
        const entry = docScores.get(docId)!;
        entry.score += freq;
        entry.matched.add(token);
      }
    }

    return Array.from(docScores.entries())
      .map(([docId, data]) => ({
        docId,
        title: this.documents.get(docId)?.title || 'Untitled',
        score: data.score,
        matchedTokens: Array.from(data.matched)
      }))
      .sort((a, b) => b.score - a.score);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  }
}
