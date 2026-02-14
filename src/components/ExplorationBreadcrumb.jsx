import { useState, useEffect } from 'react';
import { LAYER_LABELS, LAYERS } from '../constants/labels';
import { LAYER_COLORS } from '../constants/colors';

const LAYER_KEYS = [
  LAYERS.STANDARDS,
  LAYERS.PROTOCOLS,
  LAYERS.CRYPTO_LIBRARIES,
  LAYERS.OS_DISTRIBUTIONS,
  LAYERS.COMPILED_LANGUAGES,
  LAYERS.MANAGED_RUNTIMES,
  LAYERS.DYNAMIC_LANGUAGES,
  LAYERS.INFRASTRUCTURE,
  LAYERS.PLATFORMS,
  LAYERS.SERVICES
];

const COLLAPSE_THRESHOLD = 4;

function ExplorationBreadcrumb({ chain, revealedDepth, onBreadcrumbClick, onReset }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [chain.length, revealedDepth]);

  if (chain.length === 0 && revealedDepth === 0) return null;

  const visibleEntries = [];
  LAYER_KEYS.forEach((layerKey, idx) => {
    const isRevealed = idx <= revealedDepth;
    const isFrontier = idx === revealedDepth;
    if (isRevealed || isFrontier) {
      const chainNode = chain.find(n => n.layer === idx);
      visibleEntries.push({ layerKey, idx, isRevealed, isFrontier, chainNode });
    }
  });

  const shouldCollapse = !expanded && visibleEntries.length > COLLAPSE_THRESHOLD;

  let displayEntries = visibleEntries;
  let collapsedCount = 0;
  if (shouldCollapse) {
    const first = visibleEntries[0];
    const tail = visibleEntries.slice(-2);
    collapsedCount = visibleEntries.length - 3;
    displayEntries = [first, null, ...tail];
  }

  return (
    <div className="exploration-breadcrumb">
      <button className="breadcrumb-reset" onClick={onReset} aria-label="Reset exploration">
        Reset
      </button>

      <div className="breadcrumb-trail">
        {displayEntries.map((entry, i) => {
          if (entry === null) {
            return (
              <span key="ellipsis" className="breadcrumb-segment">
                <span className="breadcrumb-separator">/</span>
                <button
                  className="breadcrumb-ellipsis"
                  onClick={() => setExpanded(true)}
                  title={`Show ${collapsedCount} hidden layers`}
                >
                  +{collapsedCount} more
                </button>
              </span>
            );
          }

          const { layerKey, idx, isRevealed, isFrontier, chainNode } = entry;
          const layerColor = LAYER_COLORS[idx];

          return (
            <span key={idx} className="breadcrumb-segment">
              {i > 0 && <span className="breadcrumb-separator">/</span>}
              <button
                className={`breadcrumb-layer ${isFrontier ? 'frontier' : ''}`}
                style={{ color: isRevealed ? layerColor : undefined }}
                onClick={() => onBreadcrumbClick(idx)}
              >
                {LAYER_LABELS[layerKey]}
              </button>
              {chainNode && (
                <>
                  <span className="breadcrumb-separator">:</span>
                  <span className="breadcrumb-node" style={{ color: layerColor }}>
                    {chainNode.name}
                  </span>
                </>
              )}
            </span>
          );
        })}
        {expanded && visibleEntries.length > COLLAPSE_THRESHOLD && (
          <span className="breadcrumb-segment">
            <button
              className="breadcrumb-ellipsis"
              onClick={() => setExpanded(false)}
              title="Collapse breadcrumb"
            >
              less
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default ExplorationBreadcrumb;
