import { LAYERS } from '../constants/labels';
import { LAYER_RADII } from '../constants/colors';

function seedHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}

function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49311;
  return x - Math.floor(x);
}

export function buildGraphData(nodesData, edgesData) {
  const layerCounts = {};
  const layerIndexes = {};

  Object.values(nodesData.nodes).forEach(node => {
    layerCounts[node.layer] = (layerCounts[node.layer] || 0) + 1;
    layerIndexes[node.layer] = 0;
  });

  const nodes = Object.values(nodesData.nodes).map(node => {
    const radius = LAYER_RADII[node.layer] || 500;
    const count = layerCounts[node.layer] || 1;
    const idx = layerIndexes[node.layer]++;
    const hash = seedHash(node.id);

    const angleJitter = (seededRandom(hash) - 0.5) * (1.4 / Math.max(count, 3));
    const radiusJitter = 0;
    const yJitter = 0;

    const angle = (idx / count) * Math.PI * 2 + (node.layer * 0.4) + angleJitter;
    const r = radius + radiusJitter;

    const px = r * Math.cos(angle);
    const py = yJitter;
    const pz = r * Math.sin(angle);

    return {
      ...node,
      x: px, y: py, z: pz,
      fx: px, fy: py, fz: pz
    };
  });

  const nodeIds = new Set(nodes.map(n => n.id));
  const links = edgesData.edges
    .filter(e => nodeIds.has(e.from) && nodeIds.has(e.to))
    .map((edge, idx) => ({
      id: `edge-${idx}`,
      source: edge.from,
      target: edge.to,
      type: edge.type,
      status: edge.status,
      approach: edge.approach,
      metadata: edge.metadata
    }));

  return { nodes, links };
}

export function getNodeEdges(nodeId, links) {
  return {
    outgoing: links.filter(l => {
      const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
      return sourceId === nodeId;
    }),
    incoming: links.filter(l => {
      const targetId = typeof l.target === 'object' ? l.target.id : l.target;
      return targetId === nodeId;
    })
  };
}

export function getConnectedNodeIds(nodeId, links) {
  const ids = new Set([nodeId]);
  links.forEach(l => {
    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
    if (sourceId === nodeId) ids.add(targetId);
    if (targetId === nodeId) ids.add(sourceId);
  });
  return ids;
}

export function getConnectedIdsInLayer(nodeId, links, targetLayer, nodeMap) {
  const ids = new Set();
  for (const link of links) {
    const srcId = typeof link.source === 'object' ? link.source.id : link.source;
    const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
    let otherId = null;
    if (srcId === nodeId) otherId = tgtId;
    else if (tgtId === nodeId) otherId = srcId;
    if (otherId) {
      const otherNode = nodeMap.get(otherId);
      if (otherNode && otherNode.layer === targetLayer) {
        ids.add(otherId);
      }
    }
  }
  return ids;
}

export function buildNodeMap(nodes) {
  return new Map(nodes.map(n => [n.id, n]));
}

export function isNodeVisible(node, layerFilter, statusFilter) {
  if (layerFilter !== LAYERS.ALL && node.layer !== parseInt(layerFilter)) {
    return false;
  }
  if (statusFilter !== LAYERS.ALL && node.status !== statusFilter) {
    return false;
  }
  return true;
}

export function configureForces(fg) {
  if (!fg) return;

  fg.d3Force('charge').strength(-400).distanceMax(1200);

  fg.d3Force('link')
    .distance(link => {
      const srcLayer = typeof link.source === 'object' ? link.source.layer : 0;
      const tgtLayer = typeof link.target === 'object' ? link.target.layer : 0;
      const diff = Math.abs(srcLayer - tgtLayer);
      return 80 + diff * 80;
    })
    .strength(link => {
      const srcLayer = typeof link.source === 'object' ? link.source.layer : 0;
      const tgtLayer = typeof link.target === 'object' ? link.target.layer : 0;
      return srcLayer === tgtLayer ? 0.08 : 0.01;
    });

  fg.d3Force('center').strength(0.01);

  const radialForce = (alpha) => {
    const nodes = fg.graphData().nodes;
    if (!nodes || nodes.length === 0) return;

    for (const node of nodes) {
      const targetR = LAYER_RADII[node.layer] || 500;
      const x = node.x || 0;
      const z = node.z || 0;
      const r = Math.sqrt(x * x + z * z) || 0.001;
      const dr = targetR - r;

      const radialStrength = 0.6 * alpha;
      const nx = x / r;
      const nz = z / r;
      node.vx = (node.vx || 0) + nx * dr * radialStrength;
      node.vz = (node.vz || 0) + nz * dr * radialStrength;

      const yDamp = 0.15 * alpha;
      node.vy = (node.vy || 0) - (node.y || 0) * yDamp;
    }
  };

  fg.d3Force('radial', radialForce);
}

export function computeFipsSet(nodes, links, mode = 'pqc') {
  const fipsLibIds = new Set();
  const neutralIds = new Set();

  for (const node of nodes) {
    if (node.layer <= 1) {
      neutralIds.add(node.id);
      continue;
    }
    const fips = node.metadata?.fips;
    if (!fips) continue;

    if (mode === 'pqc') {
      if (fips.status === 'validated' && fips.includes_pqc) {
        fipsLibIds.add(node.id);
      }
    } else if (mode === 'classical') {
      if (fips.status === 'validated') {
        fipsLibIds.add(node.id);
      }
    }
  }

  const fipsReachable = new Set(fipsLibIds);

  let changed = true;
  while (changed) {
    changed = false;
    for (const link of links) {
      const srcId = typeof link.source === 'object' ? link.source.id : link.source;
      const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
      if ((link.type === 'depends_on' || link.type === 'ships') && fipsReachable.has(tgtId) && !fipsReachable.has(srcId)) {
        fipsReachable.add(srcId);
        changed = true;
      }
    }
  }

  return { fipsReachable, neutralIds };
}

export function getCameraPositionForNode(node, distance = 800) {
  if (!node || node.x == null) return OVERVIEW_CAMERA;
  return {
    x: node.x + distance * 0.1,
    y: node.y + distance * 0.35,
    z: node.z + distance
  };
}

export const OVERVIEW_CAMERA = { x: 10, y: 400, z: 600 };
