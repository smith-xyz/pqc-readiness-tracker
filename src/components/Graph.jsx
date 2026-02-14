import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { createNodeObject, createStarField, createSun, createOrbitalRings } from '../utils/sceneUtils';
import {
  buildNodeMap,
  getConnectedIdsInLayer,
  getConnectedNodeIds,
  getCameraPositionForNode,
  isNodeVisible,
  OVERVIEW_CAMERA
} from '../utils/graphUtils';
import { EDGE_COLORS } from '../constants/colors';
import { LAYERS } from '../constants/labels';

function setNodeBrightness(obj, opacity, _unused, glowOp, labelOp) {
  const sphere = obj.children[0];
  const glow = obj.children[1];
  const label = obj.children[3];
  if (!sphere?.material) return;
  sphere.material.opacity = opacity;
  if (glow?.material) glow.material.opacity = glowOp;
  if (label?.material) label.material.opacity = labelOp;
}

function applyNodeVisual(obj, nodeId, node, revDepth, cIds, frontier, chainLen, neighbors, fipsOn, fipsReachable, fipsNeutral, stackOn, stackChainSet) {
  if (!obj?.children) return;
  if (!obj.children[0]?.material) return;

  if (stackOn && stackChainSet.size > 0) {
    if (stackChainSet.has(nodeId)) {
      setNodeBrightness(obj, 1.0, 1.2, 0.2, 1.0);
    } else {
      setNodeBrightness(obj, 0.06, 0.02, 0.0, 0.05);
    }
    return;
  }

  if (fipsOn) {
    if (fipsNeutral.has(nodeId)) {
      setNodeBrightness(obj, 0.5, 0.3, 0.03, 0.4);
    } else if (fipsReachable.has(nodeId)) {
      setNodeBrightness(obj, 1.0, 1.2, 0.2, 1.0);
    } else {
      setNodeBrightness(obj, 0.06, 0.02, 0.0, 0.05);
    }
    return;
  }

  if (node.layer > revDepth) {
    setNodeBrightness(obj, 0.04, 0.02, 0.0, 0.03);
    return;
  }

  if (cIds.has(nodeId)) {
    setNodeBrightness(obj, 1.0, 1.4, 0.25, 1.0);
    return;
  }

  if (node.layer === revDepth && frontier.has(nodeId)) {
    setNodeBrightness(obj, 0.9, 0.8, 0.15, 0.9);
    return;
  }

  if (neighbors.has(nodeId) && node.layer <= revDepth) {
    setNodeBrightness(obj, 0.75, 0.55, 0.1, 0.7);
    return;
  }

  if (node.layer === 0 && chainLen === 0) {
    setNodeBrightness(obj, 0.92, 0.6, 0.08, 0.85);
    return;
  }

  setNodeBrightness(obj, 0.15, 0.08, 0.01, 0.12);
}

function Graph({ graphData, statusFilter, revealedDepth, chain, onExplore, onGoBack, fipsOverlay, fipsSets, stackOverlay, stackChain, showLabels }) {
  const fgRef = useRef();
  const initDone = useRef(false);
  const nodeObjects = useRef(new Map());
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const revealedDepthRef = useRef(revealedDepth);
  const chainIdsRef = useRef(new Set());
  const connectedAtFrontierRef = useRef(new Set());
  const chainNeighborsRef = useRef(new Set());
  const chainLenRef = useRef(0);
  const nodeMapRef = useRef(new Map());
  const fipsOverlayRef = useRef(false);
  const fipsReachableRef = useRef(new Set());
  const fipsNeutralRef = useRef(new Set());
  const stackOverlayRef = useRef(false);
  const stackChainRef = useRef(new Set());

  const filteredData = useMemo(() => {
    const visibleNodes = graphData.nodes.filter(n => isNodeVisible(n, LAYERS.ALL, statusFilter));
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    const visibleLinks = graphData.links.filter(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      return visibleIds.has(srcId) && visibleIds.has(tgtId);
    });
    return { nodes: visibleNodes, links: visibleLinks };
  }, [graphData, statusFilter]);

  const nodeMap = useMemo(() => {
    const m = buildNodeMap(graphData.nodes);
    nodeMapRef.current = m;
    return m;
  }, [graphData.nodes]);

  const chainIds = useMemo(() => {
    const s = new Set(chain.map(n => n.id));
    chainIdsRef.current = s;
    chainLenRef.current = chain.length;
    return s;
  }, [chain]);

  const connectedAtFrontier = useMemo(() => {
    if (chain.length === 0) {
      connectedAtFrontierRef.current = new Set();
      return connectedAtFrontierRef.current;
    }
    const lastNode = chain[chain.length - 1];
    const s = getConnectedIdsInLayer(lastNode.id, graphData.links, revealedDepth, nodeMap);
    connectedAtFrontierRef.current = s;
    return s;
  }, [chain, revealedDepth, graphData.links, nodeMap]);

  const chainNeighbors = useMemo(() => {
    if (chain.length === 0) {
      chainNeighborsRef.current = new Set();
      return chainNeighborsRef.current;
    }
    const s = new Set();
    for (const chainNode of chain) {
      const neighbors = getConnectedNodeIds(chainNode.id, graphData.links);
      for (const id of neighbors) {
        if (!chainIds.has(id)) s.add(id);
      }
    }
    chainNeighborsRef.current = s;
    return s;
  }, [chain, graphData.links, chainIds]);

  useEffect(() => {
    revealedDepthRef.current = revealedDepth;
  }, [revealedDepth]);

  useEffect(() => {
    fipsOverlayRef.current = fipsOverlay;
    fipsReachableRef.current = fipsSets.fipsReachable;
    fipsNeutralRef.current = fipsSets.neutralIds;
  }, [fipsOverlay, fipsSets]);

  useEffect(() => {
    stackOverlayRef.current = stackOverlay;
    stackChainRef.current = stackChain;
  }, [stackOverlay, stackChain]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (initDone.current) return;

    const tryInit = () => {
      const fg = fgRef.current;
      if (!fg) return false;

      try {
        fg.d3Force('charge', null);
        fg.d3Force('center', null);
        fg.d3Force('link').strength(0);
      } catch (e) {
        console.warn('Force config deferred:', e.message);
        return false;
      }

      try {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(dimensions.width, dimensions.height),
          0.35, 0.25, 0.35
        );
        fg.postProcessingComposer().addPass(bloomPass);
      } catch (e) {
        console.warn('Bloom pass skipped:', e.message);
      }

      try {
        fg.scene().add(createSun());
        fg.scene().add(createOrbitalRings());
        fg.scene().add(createStarField(3000));
        fg.scene().fog = null;
        fg.renderer().setClearColor(new THREE.Color('#000005'), 1);
      } catch (e) {
        console.warn('Scene setup issue:', e.message);
      }

      fg.cameraPosition(OVERVIEW_CAMERA, { x: 0, y: 0, z: 0 }, 0);
      initDone.current = true;
      return true;
    };

    if (!tryInit()) {
      const interval = setInterval(() => {
        if (tryInit()) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [filteredData, dimensions]);

  useEffect(() => {
    const lastChainNode = chain.length > 0 ? chain[chain.length - 1] : null;
    const fg = fgRef.current;
    if (!fg) return;

    if (!lastChainNode) {
      fg.cameraPosition(OVERVIEW_CAMERA, { x: 0, y: 0, z: 0 }, 2000);
      return;
    }

    const node = graphData.nodes.find(n => n.id === lastChainNode.id);
    if (!node || node.x == null) return;

    const pos = getCameraPositionForNode(node);
    fg.cameraPosition(pos, { x: node.x, y: node.y, z: node.z }, 2000);
  }, [chain, graphData.nodes]);

  useEffect(() => {
    nodeObjects.current.forEach((obj, nodeId) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;
      applyNodeVisual(obj, nodeId, node, revealedDepth, chainIds, connectedAtFrontier, chain.length,
        chainNeighbors, fipsOverlay, fipsSets.fipsReachable, fipsSets.neutralIds, stackOverlay, stackChain);
    });
  }, [chain, chainIds, revealedDepth, connectedAtFrontier, chainNeighbors, nodeMap, fipsOverlay, fipsSets, stackOverlay, stackChain]);

  useEffect(() => {
    nodeObjects.current.forEach((obj) => {
      const label = obj.children[3];
      if (label) label.visible = showLabels;
    });
  }, [showLabels]);

  const handleNodeClick = useCallback((node) => {
    onExplore(node);
  }, [onExplore]);

  const handleBackgroundClick = useCallback(() => {
    onGoBack();
  }, [onGoBack]);

  const nodeThreeObject = useCallback((node) => {
    const obj = createNodeObject(node);
    nodeObjects.current.set(node.id, obj);
    const nm = nodeMapRef.current;
    const nd = nm.get(node.id);
    if (nd) {
      applyNodeVisual(
        obj, node.id, nd,
        revealedDepthRef.current,
        chainIdsRef.current,
        connectedAtFrontierRef.current,
        chainLenRef.current,
        chainNeighborsRef.current,
        fipsOverlayRef.current,
        fipsReachableRef.current,
        fipsNeutralRef.current,
        stackOverlayRef.current,
        stackChainRef.current
      );
    }
    return obj;
  }, []);

  const linkColor = useCallback((link) => {
    const srcId = typeof link.source === 'object' ? link.source.id : link.source;
    const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
    const srcNode = nodeMapRef.current.get(srcId);
    const tgtNode = nodeMapRef.current.get(tgtId);
    const fr = fipsSets.fipsReachable;
    const fn = fipsSets.neutralIds;

    if (!srcNode || !tgtNode) return '#080810';

    if (stackOverlay && stackChain.size > 0) {
      if (stackChain.has(srcId) && stackChain.has(tgtId)) {
        return EDGE_COLORS[link.type] || '#333344';
      }
      return 'rgba(8,8,16,0.02)';
    }

    if (fipsOverlay) {
      const srcFips = fr.has(srcId) || fn.has(srcId);
      const tgtFips = fr.has(tgtId) || fn.has(tgtId);
      if (srcFips && tgtFips && fr.has(srcId) || fr.has(tgtId)) {
        return EDGE_COLORS[link.type] || '#333344';
      }
      return 'rgba(8,8,16,0.02)';
    }

    if (srcNode.layer > revealedDepth || tgtNode.layer > revealedDepth) return 'rgba(8,8,16,0.02)';

    const baseColor = EDGE_COLORS[link.type] || '#333344';

    if (chainIds.has(srcId) && chainIds.has(tgtId)) return baseColor;

    if ((chainIds.has(srcId) && connectedAtFrontier.has(tgtId)) ||
        (chainIds.has(tgtId) && connectedAtFrontier.has(srcId))) {
      return baseColor;
    }

    if ((chainIds.has(srcId) && chainNeighbors.has(tgtId)) ||
        (chainIds.has(tgtId) && chainNeighbors.has(srcId))) {
      return baseColor;
    }

    return '#12121a';
  }, [chainIds, connectedAtFrontier, chainNeighbors, revealedDepth, fipsOverlay, fipsSets, stackOverlay, stackChain]);

  const linkWidth = useCallback((link) => {
    const srcId = typeof link.source === 'object' ? link.source.id : link.source;
    const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
    const fr = fipsSets.fipsReachable;

    if (stackOverlay && stackChain.size > 0) {
      return (stackChain.has(srcId) && stackChain.has(tgtId)) ? 1.5 : 0.1;
    }

    if (fipsOverlay) {
      return (fr.has(srcId) || fr.has(tgtId)) ? 1.5 : 0.1;
    }

    if (chainIds.has(srcId) && chainIds.has(tgtId)) return 1.8;

    if ((chainIds.has(srcId) && connectedAtFrontier.has(tgtId)) ||
        (chainIds.has(tgtId) && connectedAtFrontier.has(srcId))) {
      return 1.8;
    }

    if ((chainIds.has(srcId) && chainNeighbors.has(tgtId)) ||
        (chainIds.has(tgtId) && chainNeighbors.has(srcId))) {
      return 1.4;
    }

    return 0.3;
  }, [chainIds, connectedAtFrontier, chainNeighbors, fipsOverlay, fipsSets, stackOverlay, stackChain]);

  const linkParticles = useCallback((link) => {
    const srcId = typeof link.source === 'object' ? link.source.id : link.source;
    const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
    const fr = fipsSets.fipsReachable;

    if (stackOverlay && stackChain.size > 0) {
      return (stackChain.has(srcId) && stackChain.has(tgtId)) ? 2 : 0;
    }

    if (fipsOverlay) {
      return (fr.has(srcId) && fr.has(tgtId)) ? 2 : 0;
    }

    if ((chainIds.has(srcId) && connectedAtFrontier.has(tgtId)) ||
        (chainIds.has(tgtId) && connectedAtFrontier.has(srcId))) {
      return 3;
    }

    if ((chainIds.has(srcId) && chainNeighbors.has(tgtId)) ||
        (chainIds.has(tgtId) && chainNeighbors.has(srcId))) {
      return 2;
    }

    return 0;
  }, [chainIds, connectedAtFrontier, chainNeighbors, fipsOverlay, fipsSets, stackOverlay, stackChain]);

  const [camPos, setCamPos] = useState(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let raf;
    const tick = () => {
      const fg = fgRef.current;
      if (fg) {
        const cam = fg.camera();
        if (cam) {
          setCamPos({ x: Math.round(cam.position.x), y: Math.round(cam.position.y), z: Math.round(cam.position.z) });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={filteredData}
        nodeId="id"
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkColor={linkColor}
        linkOpacity={0.35}
        linkWidth={linkWidth}
        linkDirectionalParticles={linkParticles}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleColor={linkColor}
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        enableNodeDrag={false}
        warmupTicks={1}
        cooldownTicks={1}
        showNavInfo={false}
        backgroundColor="#000005"
      />
      {import.meta.env.DEV && camPos && (
        <div className="dev-cam-tracker">
          CAM x:{camPos.x} y:{camPos.y} z:{camPos.z}
        </div>
      )}
    </>
  );
}

export default Graph;
