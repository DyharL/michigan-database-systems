/**
 * Module 08: Pure SQL TF-IDF Natural Language Processing Engine
 * Computes Term Frequency - Inverse Document Frequency (TF-IDF) across document corpora
 * replicating database-level analytical window functions.
 */

export interface TfIdfDocument {
  id: number;
  text: string;
}

export interface TermScore {
  term: string;
  tf: number;
  idf: number;
  tfidf: number;
}

export class SqlTfIdfEngine {
  private documents: Map<number, string[]> = new Map(); // docId -> words[]
  private docCount = 0;

  public addDocument(id: number, text: string): void {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    this.documents.set(id, words);
    this.docCount++;
  }

  public computeTfIdf(docId: number): TermScore[] {
    const words = this.documents.get(docId);
    if (!words || words.length === 0) return [];

    const totalWordsInDoc = words.length;
    const termFreqs: Record<string, number> = {};

    for (const w of words) {
      termFreqs[w] = (termFreqs[w] || 0) + 1;
    }

    const scores: TermScore[] = [];

    for (const [term, count] of Object.entries(termFreqs)) {
      const tf = count / totalWordsInDoc;

      // Count in how many documents the term appears
      let docsWithTerm = 0;
      for (const otherDocWords of this.documents.values()) {
        if (otherDocWords.includes(term)) {
          docsWithTerm++;
        }
      }

      // Standard smooth IDF: ln(N / (1 + df)) + 1
      const idf = Math.log(this.docCount / (1 + docsWithTerm)) + 1;
      const tfidf = tf * idf;

      scores.push({
        term,
        tf: parseFloat(tf.toFixed(4)),
        idf: parseFloat(idf.toFixed(4)),
        tfidf: parseFloat(tfidf.toFixed(4))
      });
    }

    return scores.sort((a, b) => b.tfidf - a.tfidf);
  }
}
