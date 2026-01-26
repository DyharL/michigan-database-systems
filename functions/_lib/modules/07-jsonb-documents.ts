/**
 * Module 07: PostgreSQL JSONB Semi-Structured Document Store
 * Simulates PostgreSQL JSONB query operators (->, ->>, @>, ?) with nested attribute extraction
 * and indexed document retrieval.
 */

export interface JsonbRecord {
  id: number;
  data: Record<string, any>;
}

export class JsonbDocumentStore {
  private records: Map<number, JsonbRecord> = new Map();
  private nextId = 1;

  public insert(doc: Record<string, any>): number {
    const id = this.nextId++;
    this.records.set(id, { id, data: JSON.parse(JSON.stringify(doc)) });
    return id;
  }

  /**
   * Simulates PostgreSQL operator: data->>'field'
   */
  public extractTextField(id: number, path: string): string | null {
    const record = this.records.get(id);
    if (!record) return null;

    const parts = path.split('.');
    let current: any = record.data;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    return current !== undefined && current !== null ? String(current) : null;
  }

  /**
   * Simulates PostgreSQL containment operator: data @> '{"status": "active"}'
   */
  public queryByContains(filter: Record<string, any>): JsonbRecord[] {
    const results: JsonbRecord[] = [];

    for (const record of this.records.values()) {
      if (this.isSubset(record.data, filter)) {
        results.push(record);
      }
    }

    return results;
  }

  private isSubset(target: any, filter: any): boolean {
    if (typeof filter !== 'object' || filter === null) {
      return target === filter;
    }

    for (const key of Object.keys(filter)) {
      if (!(key in target)) return false;

      if (typeof filter[key] === 'object' && filter[key] !== null) {
        if (!this.isSubset(target[key], filter[key])) return false;
      } else if (target[key] !== filter[key]) {
        return false;
      }
    }

    return true;
  }
}
