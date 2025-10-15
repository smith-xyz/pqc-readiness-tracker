import { NODE_TYPES, STATUS, LAYERS } from '../constants/labels';

export function createGraphElements(nodesData, edgesData) {
  return {
    nodes: Object.values(nodesData.nodes).map(node => ({
      data: {
        id: node.id,
        label: node.name,
        ...node
      }
    })),
    edges: edgesData.edges.map((edge, idx) => ({
      data: {
        id: `edge-${idx}`,
        source: edge.from,
        target: edge.to,
        type: edge.type,
        description: edge.description
      }
    }))
  };
}

export function getNodeStatus(nodeData) {
  // checking the standards status
  if (nodeData.type === NODE_TYPES.STANDARD) {
    return nodeData.status.specification === STATUS.FINAL ? STATUS.AVAILABLE : STATUS.PARTIAL;
  }

  const features = [
    ['ml_kem_api', 'ml_kem_tls'],
    ['ml_dsa_api', 'ml_dsa_tls']
  ];
  
  if (features.every(([api, tls]) => 
    nodeData.status[api] === STATUS.AVAILABLE && 
    nodeData.status[tls] === STATUS.AVAILABLE)) {
    return STATUS.AVAILABLE;
  }
  
  if (Object.values(nodeData.status).includes(STATUS.AVAILABLE)) {
    return STATUS.PARTIAL;
  }
  
  return STATUS.NOT_AVAILABLE;
}

export function applyFilters(cy, layerFilter, statusFilter) {
  if (layerFilter === LAYERS.ALL && statusFilter === LAYERS.ALL) {
    cy.elements().style('display', 'element');
    return;
  }

  cy.nodes().forEach(node => {
    let show = true;

    if (layerFilter !== LAYERS.ALL) {
      show = show && node.data('layer') === parseInt(layerFilter);
    }

    if (statusFilter !== LAYERS.ALL && show) {
      const nodeStatus = getNodeStatus(node.data());
      show = show && nodeStatus === statusFilter;
    }

    node.style('display', show ? 'element' : 'none');
  });

  cy.edges().forEach(edge => {
    const sourceVisible = edge.source().style('display') !== 'none';
    const targetVisible = edge.target().style('display') !== 'none';
    edge.style('display', sourceVisible && targetVisible ? 'element' : 'none');
  });
}

export function highlightPath(cy, nodeId) {
  clearHighlights(cy);

  const node = cy.getElementById(nodeId);
  node.addClass('highlighted');

  const predecessors = node.predecessors();
  predecessors.addClass('highlighted');
  predecessors.filter('edge').addClass('path-edge');
}

export function clearHighlights(cy) {
  cy.elements().removeClass('highlighted path-edge');
}

export function expandRuntimeNode(cy, runtimeNode, applications) {
  if (!applications || applications.length === 0) return;

  const otherNodes = cy.nodes().not(runtimeNode).not(runtimeNode.predecessors());
  otherNodes.animate({
    style: { opacity: 0.15 }
  }, {
    duration: 200
  });

  const otherEdges = cy.edges().not(runtimeNode.predecessors().filter('edge'));
  otherEdges.animate({
    style: { opacity: 0.1 }
  }, {
    duration: 200
  });

  const baseX = runtimeNode.position('x');
  const baseY = runtimeNode.position('y');
  const spacing = 150;
  const startAngle = -Math.PI / 2;
  const angleStep = (Math.PI * 1.5) / Math.max(applications.length - 1, 1);

  applications.forEach((app, index) => {
    const angle = startAngle + (angleStep * index);
    const x = baseX + Math.cos(angle) * spacing;
    const y = baseY + Math.sin(angle) * spacing;

    const appNode = {
      group: 'nodes',
      data: {
        id: `app-${runtimeNode.id()}-${app.id}`,
        label: app.name,
        name: app.name,
        type: 'application',
        layer: 3,
        description: app.description,
        category: app.category,
        parentRuntime: runtimeNode.id()
      },
      position: { x: baseX, y: baseY },
      classes: 'expanded-app'
    };

    const appEdge = {
      group: 'edges',
      data: {
        id: `edge-${runtimeNode.id()}-${app.id}`,
        source: `app-${runtimeNode.id()}-${app.id}`,
        target: runtimeNode.id()
      },
      classes: 'expanded-edge'
    };

    cy.add([appNode, appEdge]);

    const addedNode = cy.getElementById(`app-${runtimeNode.id()}-${app.id}`);
    addedNode.animate({
      position: { x, y },
      style: { opacity: 1 }
    }, {
      duration: 300,
      easing: 'ease-out'
    });
  });

  runtimeNode.addClass('expanded');
}

export function collapseRuntimeNode(cy, runtimeNodeId) {
  const appNodes = cy.nodes(`[parentRuntime = "${runtimeNodeId}"]`);
  const appEdges = cy.edges().filter(edge => {
    return appNodes.contains(edge.source()) || appNodes.contains(edge.target());
  });

  const otherNodes = cy.nodes().not(appNodes);
  const otherEdges = cy.edges().not(appEdges);

  otherNodes.stop().animate({
    style: { opacity: 1 }
  }, {
    duration: 250
  });

  otherEdges.stop().animate({
    style: { opacity: 1 }
  }, {
    duration: 250
  });

  appNodes.animate({
    style: { opacity: 0 }
  }, {
    duration: 150,
    complete: function() {
      cy.remove(appNodes);
      cy.remove(appEdges);
    }
  });

  cy.getElementById(runtimeNodeId).removeClass('expanded');
}

export function isRuntimeExpanded(cy, runtimeNodeId) {
  return cy.getElementById(runtimeNodeId).hasClass('expanded');
}

