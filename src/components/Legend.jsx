import { LAYER_COLORS, STATUS_COLORS } from '../constants/colors';
import { LAYER_LABELS, LAYERS, STATUS, STATUS_LABELS } from '../constants/labels';

const LAYER_ITEMS = [
  { layer: 0, label: LAYER_LABELS[LAYERS.STANDARDS] },
  { layer: 1, label: LAYER_LABELS[LAYERS.PROTOCOLS] },
  { layer: 2, label: LAYER_LABELS[LAYERS.CRYPTO_LIBRARIES] },
  { layer: 3, label: LAYER_LABELS[LAYERS.OS_DISTRIBUTIONS] },
  { layer: 4, label: LAYER_LABELS[LAYERS.COMPILED_LANGUAGES] },
  { layer: 5, label: LAYER_LABELS[LAYERS.MANAGED_RUNTIMES] },
  { layer: 6, label: LAYER_LABELS[LAYERS.DYNAMIC_LANGUAGES] },
  { layer: 7, label: LAYER_LABELS[LAYERS.INFRASTRUCTURE] },
  { layer: 8, label: LAYER_LABELS[LAYERS.PLATFORMS] },
  { layer: 9, label: LAYER_LABELS[LAYERS.SERVICES] }
];

const STATUS_ITEMS = [
  { status: STATUS.AVAILABLE, label: STATUS_LABELS[STATUS.AVAILABLE] },
  { status: STATUS.PARTIAL, label: STATUS_LABELS[STATUS.PARTIAL] },
  { status: STATUS.EXPERIMENTAL, label: STATUS_LABELS[STATUS.EXPERIMENTAL] },
  { status: STATUS.NOT_AVAILABLE, label: STATUS_LABELS[STATUS.NOT_AVAILABLE] }
];

function Legend() {
  return (
    <div className="hud-panel legend-panel">
      <div className="legend-section">
        <span className="legend-title">Layers</span>
        {LAYER_ITEMS.map(item => (
          <div key={item.layer} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: LAYER_COLORS[item.layer] }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="legend-section">
        <span className="legend-title">Status</span>
        {STATUS_ITEMS.map(item => (
          <div key={item.status} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: STATUS_COLORS[item.status] }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Legend;
