import { extractLinksFromHtml, parseGeoResponse } from '../_lib/modules/02-web-crawler.ts';

export const onRequest: PagesFunction = async () => {
  const sampleHtml = `
    <html>
      <head><title>University Data Infrastructure</title></head>
      <body>
        <a href=/schema/3nf>Relational Schemas</a>
        <a href=/indexes/gin>GIN Fulltext Indexes</a>
        <a href=https://postgres.org>PostgreSQL Documentation</a>
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
  return new Response(JSON.stringify({ crawl, geo }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
