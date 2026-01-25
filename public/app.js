// Interactive Demo Handler for University of Michigan Database & Data Systems Suite

async function callApi(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    const data = await res.json();
    return JSON.stringify(data, null, 2);
  } catch (err) {
    return JSON.stringify({ error: err.message }, null, 2);
  }
}

// 11. Mail Analytics
async function testMail() {
  const output = document.getElementById('output-mail');
  output.textContent = 'Parsing mbox stream and computing sender histogram...';
  const res = await fetch('/api/mail-analytics', { method: 'POST' });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// 12. Crawler & Geo
async function testCrawler() {
  const output = document.getElementById('output-crawler');
  output.textContent = 'Extracting DOM links and coordinates...';
  const res = await fetch('/api/crawler', { method: 'POST' });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// 13. Music Schema
async function testMusic() {
  const output = document.getElementById('output-music');
  output.textContent = 'Executing 4-table relational SQL JOIN...';
  const res = await fetch('/api/music-catalog');
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// 14. PageRank & D3 Graph
async function testPageRank() {
  const output = document.getElementById('output-pagerank');
  output.textContent = 'Running 25 Markov iterations across directed graph...';
  const res = await fetch('/api/pagerank');
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
  renderD3Graph(data);
}

function renderD3Graph(data) {
  const container = document.getElementById('graph-container');
  if (!container || !window.d3) return;

  container.innerHTML = '';
  const width = container.clientWidth || 340;
  const height = 220;

  const svg = d3.select('#graph-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links).id(d => d.id).distance(60))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = svg.append('g')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('stroke', '#3f3f46')
    .attr('stroke-width', 1.5);

  const node = svg.append('g')
    .selectAll('circle')
    .data(data.nodes)
    .join('circle')
    .attr('r', d => Math.max(8, d.score * 40))
    .attr('fill', '#38bdf8')
    .attr('stroke', '#0284c7')
    .attr('stroke-width', 1.5);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  });
}

// 15. 3NF Cascade
async function testCascade() {
  const output = document.getElementById('output-cascade');
  output.textContent = 'Triggering ON DELETE CASCADE constraint...';
  const res = await fetch('/api/cascade', { method: 'POST' });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// 16. Inverted Index
async function testIndex() {
  const query = document.getElementById('input-index').value.trim() || 'postgresql indexing';
  const output = document.getElementById('output-index');
  output.textContent = 'Scanning inverted postings list...';
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// 17. JSONB Store
async function testJsonb() {
  const output = document.getElementById('output-jsonb');
  output.textContent = 'Querying JSONB containment (@>)...';
  const res = await fetch('/api/jsonb-query', { method: 'POST' });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// 18. TF-IDF
async function testTfidf() {
  const output = document.getElementById('output-tfidf');
  output.textContent = 'Computing TF-IDF analytical window metrics...';
  const res = await fetch('/api/tfidf', { method: 'POST' });
  const data = await res.json();
  output.textContent = JSON.stringify(data, null, 2);
}

// Auto-run PageRank on load
window.addEventListener('DOMContentLoaded', () => {
  testPageRank();
});
