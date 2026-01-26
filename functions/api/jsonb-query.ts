import { JsonbDocumentStore } from '../_lib/modules/07-jsonb-documents.ts';

export const onRequest: PagesFunction = async () => {
  const store = new JsonbDocumentStore();
  store.insert({ customer: 'Acme Corp', tier: 'enterprise', settings: { theme: 'dark', telemetry: true }, tags: ['fintech', 'infrastructure'] });
  store.insert({ customer: 'Beta Systems', tier: 'standard', settings: { theme: 'light', telemetry: false }, tags: ['retail'] });

  return new Response(JSON.stringify(store.queryByContains({ tier: 'enterprise' })), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
