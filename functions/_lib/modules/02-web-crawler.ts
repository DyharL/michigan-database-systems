/**
 * Module 02: Multi-Protocol Web Scraper & Geographical Data Ingestion
 * Extracts hyperlinked anchors, parses structured schema elements, and transforms geographical entities.
 */

export interface GeoLocation {
  query: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

export interface CrawlResult {
  url: string;
  title: string;
  outboundLinks: string[];
}

export function extractLinksFromHtml(html: string, baseUrl: string): CrawlResult {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  const outboundLinks: string[] = [];
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = hrefRegex.exec(html)) !== null) {
    const rawHref = match[1].trim();
    if (rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('#')) {
      continue;
    }

    try {
      const resolved = new URL(rawHref, baseUrl).href;
      if (!outboundLinks.includes(resolved)) {
        outboundLinks.push(resolved);
      }
    } catch {
      // Ignore malformed URLs
    }
  }

  return {
    url: baseUrl,
    title,
    outboundLinks
  };
}

export function parseGeoResponse(rawJsonText: string): GeoLocation | null {
  try {
    const parsed = JSON.parse(rawJsonText);
    const results = parsed.results || (Array.isArray(parsed) ? parsed : [parsed]);
    if (!results || results.length === 0) return null;

    const first = results[0];
    const lat = first.geometry?.location?.lat ?? parseFloat(first.lat);
    const lng = first.geometry?.location?.lng ?? parseFloat(first.lon);
    const address = first.formatted_address ?? first.display_name ?? 'Unknown Location';

    if (isNaN(lat) || isNaN(lng)) return null;

    return {
      query: parsed.query || address,
      formattedAddress: address,
      latitude: lat,
      longitude: lng
    };
  } catch {
    return null;
  }
}
