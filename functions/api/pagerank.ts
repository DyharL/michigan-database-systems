import { PageRankEngine } from '../_lib/modules/04-pagerank-engine.ts';

export const onRequest: PagesFunction = async () => {
  const pageRank = new PageRankEngine();
  pageRank.addLink('https://engine.dev', 'https://data.dev');
  pageRank.addLink('https://engine.dev', 'https://cloud.dev');
  pageRank.addLink('https://data.dev', 'https://cloud.dev');
  pageRank.addLink('https://cloud.dev', 'https://engine.dev');
  pageRank.addLink('https://edge.dev', 'https://cloud.dev');
  return new Response(JSON.stringify(pageRank.exportD3Data(30)), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
