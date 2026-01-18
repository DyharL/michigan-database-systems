import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JsonbDocumentStore } from '../src/modules/07-jsonb-documents.js';

describe('Module 07: JSONB Document Modeling', () => {
  it('extracts nested properties and performs JSON subset containment queries', () => {
    const store = new JsonbDocumentStore();

    store.insert({
      customer: 'Acme Corp',
      tier: 'enterprise',
      settings: { theme: 'dark', telemetry: true },
      tags: ['fintech', 'infrastructure']
    });

    const doc2Id = store.insert({
      customer: 'Beta Systems',
      tier: 'standard',
      settings: { theme: 'light', telemetry: false },
      tags: ['retail']
    });

    // Test nested field extraction
    assert.equal(store.extractTextField(doc2Id, 'settings.theme'), 'light');
    assert.equal(store.extractTextField(doc2Id, 'customer'), 'Beta Systems');
    assert.equal(store.extractTextField(doc2Id, 'nonexistent.field'), null);

    // Test containment query (@>)
    const enterpriseDocs = store.queryByContains({ tier: 'enterprise' });
    assert.equal(enterpriseDocs.length, 1);
    assert.equal(enterpriseDocs[0].data.customer, 'Acme Corp');
  });
});
