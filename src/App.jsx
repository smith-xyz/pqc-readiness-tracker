import { useState, useMemo, useCallback } from 'react';
import { useGraphData } from './hooks/useGraphData';
import { buildGraphData, computeFipsSet } from './utils/graphUtils';
import { LAYERS } from './constants/labels';
import Graph from './components/Graph';
import Controls from './components/Controls';
import SearchBar from './components/SearchBar';
import Legend from './components/Legend';
import NodeDetails from './components/NodeDetails';
import StatusBar from './components/StatusBar';
import ExplorationBreadcrumb from './components/ExplorationBreadcrumb';

function App() {
  const { nodesData, edgesData, loading, error } = useGraphData();
  const [statusFilter, setStatusFilter] = useState(LAYERS.ALL);
  const [selectedNode, setSelectedNode] = useState(null);
  const [revealedDepth, setRevealedDepth] = useState(0);
  const [chain, setChain] = useState([]);
  const [fipsOverlay, setFipsOverlay] = useState('off');
  const [showLabels, setShowLabels] = useState(true);

  const graphData = useMemo(() => {
    if (!nodesData || !edgesData) return { nodes: [], links: [] };
    return buildGraphData(nodesData, edgesData);
  }, [nodesData, edgesData]);

  const fipsSets = useMemo(() => {
    if (!graphData.nodes.length || fipsOverlay === 'off') return { fipsReachable: new Set(), neutralIds: new Set() };
    return computeFipsSet(graphData.nodes, graphData.links, fipsOverlay);
  }, [graphData, fipsOverlay]);

  const handleExplore = useCallback((node) => {
    const lastNode = chain.length > 0 ? chain[chain.length - 1] : null;
    if (lastNode && lastNode.id === node.id) {
      const newChain = chain.slice(0, -1);
      setChain(newChain);
      setRevealedDepth(newChain.length > 0 ? newChain[newChain.length - 1].layer + 1 : 0);
      setSelectedNode(newChain[newChain.length - 1] || null);
      return;
    }
    const newChain = chain.slice(0, node.layer);
    newChain.push(node);
    setChain(newChain);
    setRevealedDepth(node.layer + 1);
    setSelectedNode(node);
  }, [chain]);

  const handleGoBack = useCallback(() => {
    if (chain.length === 0) return;
    const newChain = chain.slice(0, -1);
    setChain(newChain);
    setRevealedDepth(prev => Math.max(0, prev - 1));
    setSelectedNode(newChain[newChain.length - 1] || null);
  }, [chain]);

  const handleReset = useCallback(() => {
    setChain([]);
    setRevealedDepth(0);
    setSelectedNode(null);
  }, []);

  const handleBreadcrumbClick = useCallback((layerIndex) => {
    const newChain = chain.slice(0, layerIndex);
    setChain(newChain);
    setRevealedDepth(layerIndex);
    setSelectedNode(newChain[newChain.length - 1] || null);
  }, [chain]);

  const handleSearchSelect = useCallback((node) => {
    const newChain = [];
    for (let i = 0; i <= node.layer; i++) {
      if (i === node.layer) {
        newChain.push(node);
      }
    }
    setChain(newChain);
    setRevealedDepth(node.layer + 1);
    setSelectedNode(node);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-pulse" />
        <span className="loading-text">Initializing PQC Readiness Scanner...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-screen">
        <span className="loading-text error-text">System Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="galaxy-app">
      <Graph
        graphData={graphData}
        statusFilter={statusFilter}
        revealedDepth={revealedDepth}
        chain={chain}
        onExplore={handleExplore}
        onGoBack={handleGoBack}
        fipsOverlay={fipsOverlay !== 'off'}
        fipsSets={fipsSets}
        showLabels={showLabels}
      />

      <div className="hud-overlay">
        <div className="hud-top">
          <div className="hud-controls-group">
            <Controls
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
            <button
              className={`fips-toggle ${fipsOverlay !== 'off' ? 'active' : ''}`}
              onClick={() => setFipsOverlay(prev =>
                prev === 'off' ? 'pqc' : prev === 'pqc' ? 'classical' : 'off'
              )}
            >
              {fipsOverlay === 'off' ? 'FIPS 140-3' :
               fipsOverlay === 'pqc' ? 'FIPS + PQC' : 'FIPS Classical'}
            </button>
            <button
              className={`fips-toggle ${showLabels ? 'active' : ''}`}
              onClick={() => setShowLabels(prev => !prev)}
            >
              Labels
            </button>
          </div>
          <div className="hud-title">
            <h1>PQC Readiness Tracker</h1>
            <span className="hud-subtitle">Post-Quantum Cryptography Ecosystem Map</span>
          </div>
          <SearchBar nodes={graphData.nodes} onSelect={handleSearchSelect} />
        </div>

        <ExplorationBreadcrumb
          chain={chain}
          revealedDepth={revealedDepth}
          onBreadcrumbClick={handleBreadcrumbClick}
          onReset={handleReset}
        />

        <div className="hud-bottom">
          <Legend />
          <StatusBar
            lastUpdated={nodesData?.last_updated}
            nodeCount={graphData.nodes.length}
            edgeCount={graphData.links.length}
          />
        </div>

        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            graphData={graphData}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
