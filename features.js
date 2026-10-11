// Optional ways to inspect the data already loaded by app.js.
let topicSimulation = null;
const baseGraph = graph;

function showEdgeEvidence(edge) {
  const from = edgeId(edge.source), to = edgeId(edge.target);
  const left = seeds.find(a => a.id === from) || people.find(a => a.id === from);
  const right = seeds.find(a => a.id === to) || people.find(a => a.id === to);
  const papers = (people.find(a => a.id === to)?.evidence?.[from]
    || people.find(a => a.id === from)?.evidence?.[to] || [])
    .slice().sort((a, b) => (b.year || 0) - (a.year || 0));
  const names = (left?.display_name || left?.name || 'Researcher') + ' ↔ '
    + (right?.display_name || right?.name || 'Researcher');
  $('selected').innerHTML = '<b>' + esc(names) + '</b><br>'
    + esc(edge.count) + ' shared papers in the retrieved works'
    + (papers.length ? '<ul class="edge-papers">' + papers.slice(0, 5).map(w =>
      '<li><a href="' + esc(w.doi || w.id) + '" target="_blank" rel="noopener">'
      + esc(w.title || 'Untitled') + '</a> (' + esc(w.year || 'year unknown') + ')</li>'
    ).join('') + '</ul>' : '<p>Publication details unavailable for this edge.</p>');
}

function drawTopicGraph(selected) {
  if (topicSimulation) { topicSimulation.stop(); topicSimulation = null; }
  const svg = d3.select('#graph'), w = svg.node().clientWidth || 800;
  const h = svg.node().clientHeight || 600;
  svg.attr('viewBox', [0, 0, w, h]).selectAll('*').remove();
  const authors = [
    ...seeds.map(s => ({id: s.id, name: s.display_name, seed: true, topics: topicLabels(s)})),
    ...selected.map(p => ({id: p.id, name: p.name, person: p, topics: topicLabels(p)}))
  ];
  const counts = new Map();
  for (const author of authors) for (const topic of new Set(author.topics))
    counts.set(topic, (counts.get(topic) || 0) + 1);
  const chosen = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 12).map(x => x[0]);
  const chosenSet = new Set(chosen);
  const visible = authors.filter(a => a.topics.some(t => chosenSet.has(t)));
  if (!chosen.length) {
    svg.append('text').attr('x', 24).attr('y', 40).attr('fill', '#e5e7eb')
      .text('No OpenAlex topics are available for the displayed researchers.');
    $('selected').textContent = 'Topics unavailable for this selection.';
    return;
  }
  const topics = chosen.map((name, i) => ({
    id: 'topic:' + i, name, type: 'topic', count: counts.get(name), index: i,
    fx: w * (i % (w < 650 ? 2 : 3) + .5) / (w < 650 ? 2 : 3),
    fy: h * (Math.floor(i / (w < 650 ? 2 : 3)) + .5)
      / Math.ceil(chosen.length / (w < 650 ? 2 : 3))
  }));
  const topicIds = new Map(topics.map(t => [t.name, t.id]));
  const nodes = [...topics, ...visible];
  const links = visible.flatMap(a => a.topics.filter(t => chosenSet.has(t))
    .map(t => ({source: a.id, target: topicIds.get(t)})));
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(n => n.id).distance(w < 650 ? 65 : 100).strength(.55))
    .force('charge', d3.forceManyBody().strength(-65))
    .force('collision', d3.forceCollide(n => n.type === 'topic' ? 55 : 11))
    .force('center', d3.forceCenter(w / 2, h / 2));
  topicSimulation = sim;
  const lines = svg.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', '#64748b').attr('stroke-opacity', .29).attr('stroke-width', 1.5);
  const dots = svg.append('g').selectAll('circle').data(nodes).join('circle')
    .attr('r', n => n.type === 'topic' ? 17 : n.seed ? 10 : 6)
    .attr('fill', n => n.type === 'topic' ? '#fbbf24' : n.seed ? '#fff' : '#38bdf8')
    .attr('stroke', '#0b1220').attr('stroke-width', 1).style('cursor', 'pointer')
    .on('click', (event, n) => {
      if (n.type === 'topic') {
        const members = visible.filter(a => a.topics.includes(n.name));
        $('selected').innerHTML = '<b>' + esc(n.name) + '</b><br>'
          + members.length + ' displayed researchers in this OpenAlex topic: '
          + esc(members.map(a => a.name).join(', '));
      } else if (n.person) {
        details(n.person);
        $('selected').innerHTML = '<b>' + esc(n.name) + '</b><br>Topics: '
          + esc(n.topics.join(' · ') || 'Unavailable');
      } else {
        $('selected').innerHTML = '<b>' + esc(n.name) + '</b><br>Topics: '
          + esc(n.topics.join(' · ') || 'Unavailable');
      }
    });
  dots.append('title').text(n => n.type === 'topic'
    ? n.name + ' · ' + n.count + ' researchers' : n.name + ' · ' + n.topics.join(', '));
  const labels = svg.append('g').selectAll('text').data(nodes.filter(n => n.type === 'topic' || n.seed))
    .join('text').text(n => n.name.length > 32 ? n.name.slice(0, 29) + '…' : n.name)
    .attr('fill', '#e5e7eb').attr('font-size', 11).attr('dx', 12)
    .style('pointer-events', 'none');
  sim.on('tick', () => {
    lines.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    dots.attr('cx', d => Math.max(18, Math.min(w - 18, d.x)))
      .attr('cy', d => Math.max(18, Math.min(h - 18, d.y)));
    labels.attr('x', d => Math.max(18, Math.min(w - 140, d.x + 13)))
      .attr('y', d => Math.max(22, Math.min(h - 12, d.y - 9)));
  });
  if ($('coverage')) $('coverage').textContent = 'Topic view: top 12 OpenAlex topics by researcher count among displayed authors. Lines represent topic membership, not coauthorship. Authors without these topics are hidden.';
  if ($('legend')) $('legend').textContent = 'Gold: broad topic · White: network seed · Blue: displayed researcher';
  $('selected').textContent = 'Select a topic to see its researchers. Select a researcher to see their topics. Topic membership is not a coauthorship link.';
}

graph = function(selected) {
  if (($('layout')?.value || 'network') === 'topic') {
    drawTopicGraph(selected);
    enableGraphZoom('graph');
    return;
  }
  if (topicSimulation) { topicSimulation.stop(); topicSimulation = null; }
  baseGraph(selected);
  d3.select('#graph').selectAll('line')
    .attr('stroke-width', d => Math.max(6, Math.min(8, Math.sqrt(d.count))))
    .style('cursor', 'pointer')
    .on('click', (event, d) => { event.stopPropagation(); showEdgeEvidence(d); });
  enableGraphZoom('graph');
};

// Wrap every graph render in a transformable group. Existing node drag and
// link click handlers remain attached to the SVG elements inside the group.
const zoomBehaviors = new Map();
function graphStage(id) {
  const svg = $(id), stage = document.createElement('div');
  stage.className = 'graph-stage' + (id === 'path-graph' ? ' path-graph-stage' : '');
  if (id === 'path-graph') stage.hidden = true;
  svg.parentNode.insertBefore(stage, svg);
  stage.appendChild(svg);
  const toolbar = document.createElement('div');
  toolbar.className = 'graph-zoom-controls';
  toolbar.setAttribute('aria-label', 'Graph zoom controls');
  for (const [label, action, title] of [
    ['+', 'in', 'Zoom in'], ['−', 'out', 'Zoom out'], ['↺', 'reset', 'Reset zoom']
  ]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.title = title;
    button.setAttribute('aria-label', title);
    button.addEventListener('click', () => {
      const zoom = zoomBehaviors.get(id);
      if (!zoom) return;
      const selection = d3.select(svg).transition().duration(200);
      if (action === 'reset') selection.call(zoom.transform, d3.zoomIdentity);
      else selection.call(zoom.scaleBy, action === 'in' ? 1.5 : 1 / 1.5);
    });
    toolbar.appendChild(button);
  }
  stage.appendChild(toolbar);
  return stage;
}
const networkStage = graphStage('graph');
const pathStage = graphStage('path-graph');
const zoomStyle = document.createElement('style');
zoomStyle.textContent = '.graph-stage{position:relative;min-width:0;min-height:0;overflow:hidden}'
  + '.graph-stage[hidden]{display:none}'
  + '.graph-stage #graph,.graph-stage #path-graph{display:block;width:100%;height:100%}'
  + '.path-graph-stage{height:330px}'
  + '.graph-zoom-controls{position:absolute;right:12px;top:12px;display:flex;gap:4px;z-index:2}'
  + '.graph-zoom-controls button{width:34px;height:34px;margin:0;padding:0;font-size:19px;background:#26384e;border:1px solid #64748b}'
  + '.graph-zoom-controls button:hover{background:#34557a}'
  + '@media(max-width:800px){.graph-stage:not(.path-graph-stage){height:60vh}}';
document.head.appendChild(zoomStyle);

function enableGraphZoom(id) {
  const svg = d3.select('#' + id);
  const layer = svg.append('g').attr('class', 'zoom-layer');
  const parent = layer.node();
  for (const child of [...svg.node().children])
    if (child !== parent) parent.appendChild(child);
  const zoom = d3.zoom().scaleExtent([0.4, 5])
    .on('zoom', event => layer.attr('transform', event.transform));
  zoomBehaviors.set(id, zoom);
  svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}
const baseShowPathGraph = showPathGraph;
showPathGraph = function(...args) {
  pathStage.hidden = false;
  baseShowPathGraph(...args);
  enableGraphZoom('path-graph');
};
