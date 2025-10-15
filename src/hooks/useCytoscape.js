import { useEffect } from 'react';
import cytoscape from 'cytoscape';
import { cytoscapeStyles, cytoscapeLayout, cytoscapeExtensions } from '../config/cytoscapeConfig';
import { createGraphElements } from '../utils/graphUtils';

export function useCytoscape(containerRef, nodesData, edgesData, cyRef, onNodeClick, onBackgroundClick) {
  useEffect(() => {
    if (!nodesData || !edgesData || !containerRef.current) return;

    cytoscapeExtensions.forEach(ext => {
      cytoscape.use(ext);
    });

    const elements = createGraphElements(nodesData, edgesData);

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: cytoscapeStyles,
      layout: cytoscapeLayout
    });

    cy.on('tap', 'node', (event) => {
      const node = event.target.data();
      onNodeClick(node);
    });

    cy.on('tap', (event) => {
      if (event.target === cy) {
        onBackgroundClick();
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [nodesData, edgesData, containerRef, cyRef, onNodeClick, onBackgroundClick]);
}

