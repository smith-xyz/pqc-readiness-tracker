import { useEffect, useRef, useState, useCallback } from 'react';
import { useCytoscape } from '../hooks/useCytoscape';
import { applyFilters, highlightPath, clearHighlights, expandRuntimeNode, collapseRuntimeNode, isRuntimeExpanded } from '../utils/graphUtils';
import NodeDetails from './NodeDetails';

function Graph({ nodesData, edgesData, layerFilter, statusFilter }) {
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [applicationsData, setApplicationsData] = useState(null);
  const cyRef = useRef(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL;
        const response = await fetch(`${baseUrl}data/applications.json`);
        if (response.ok) {
          const data = await response.json();
          setApplicationsData(data.applications);
        }
      } catch (err) {
        console.warn('Could not load applications data:', err);
      }
    };
    loadApplications();
  }, []);

  const handleNodeClick = useCallback((node) => {
    if (node.type === 'application') {
      return;
    }

    if (cyRef.current) {
      cyRef.current.nodes('[parentRuntime]').forEach(appNode => {
        const parentId = appNode.data('parentRuntime');
        if (parentId !== node.id) {
          collapseRuntimeNode(cyRef.current, parentId);
        }
      });
    }

    setSelectedNode(node);
    
    if (cyRef.current) {
      highlightPath(cyRef.current, node.id);
      
      if (node.type === 'runtime' && applicationsData) {
        const runtimeNode = cyRef.current.getElementById(node.id);
        const apps = applicationsData[node.id];
        if (apps) {
          expandRuntimeNode(cyRef.current, runtimeNode, apps);
        }
      }
    }
  }, [applicationsData]);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    if (cyRef.current) {
      clearHighlights(cyRef.current);
      cyRef.current.nodes('[parentRuntime]').forEach(appNode => {
        collapseRuntimeNode(cyRef.current, appNode.data('parentRuntime'));
      });
    }
  }, []);

  useCytoscape(
    containerRef,
    nodesData,
    edgesData,
    cyRef,
    handleNodeClick,
    handleBackgroundClick
  );

  useEffect(() => {
    if (!cyRef.current) return;
    applyFilters(cyRef.current, layerFilter, statusFilter);
  }, [layerFilter, statusFilter]);

  const handleCloseDetails = () => {
    setSelectedNode(null);
    if (cyRef.current) {
      clearHighlights(cyRef.current);
      cyRef.current.nodes('[parentRuntime]').forEach(appNode => {
        collapseRuntimeNode(cyRef.current, appNode.data('parentRuntime'));
      });
    }
  };

  return (
    <section className="graph-container">
      <div ref={containerRef} className="cy-container" />
      {selectedNode && (
        <NodeDetails 
          node={selectedNode} 
          nodesData={nodesData.nodes}
          onClose={handleCloseDetails}
        />
      )}
    </section>
  );
}

export default Graph;

