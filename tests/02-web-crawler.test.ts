import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractLinksFromHtml, parseGeoResponse } from '../src/modules/02-web-crawler.js';

describe('Module 02: Web Scraper & Geo Ingestion', () => {
  it('extracts anchors and normalizes relative URLs', () => {
    const html = `
      <html>
        <head><title>Engineering Portal</title></head>
        <body>
          <a href="/docs/api">API Reference</a>
          <a href="https://example.com/guide">External Guide</a>
          <a href="#section">Internal Jump</a>
        </body>
      </html>
    `;
    const result = extractLinksFromHtml(html, 'https://example.com');
    assert.equal(result.title, 'Engineering Portal');
    assert.equal(result.outboundLinks.length, 2);
    assert(result.outboundLinks.includes('https://example.com/docs/api'));
    assert(result.outboundLinks.includes('https://example.com/guide'));
  });

  it('parses structured JSON geocoding payloads', () => {
    const rawGeo = JSON.stringify({
      results: [
        {
          formatted_address: 'Ann Arbor, MI, USA',
          geometry: { location: { lat: 42.2808, lng: -83.743 } }
        }
      ]
    });
    const parsed = parseGeoResponse(rawGeo);
    assert(parsed !== null);
    assert.equal(parsed.formattedAddress, 'Ann Arbor, MI, USA');
    assert.equal(parsed.latitude, 42.2808);
    assert.equal(parsed.longitude, -83.743);
  });
});
