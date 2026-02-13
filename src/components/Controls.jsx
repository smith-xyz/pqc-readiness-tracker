import { STATUS_FILTERS, LAYERS } from '../constants/labels';
import { STATUS_COLORS } from '../constants/colors';

function Controls({ statusFilter, setStatusFilter }) {
  return (
    <div className="hud-panel controls-panel">
      <div className="filter-group">
        <span className="filter-label">Status</span>
        <div className="filter-buttons">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              className={`filter-btn ${statusFilter === f.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.value)}
              style={statusFilter === f.value && f.value !== LAYERS.ALL
                ? { borderColor: STATUS_COLORS[f.value], color: STATUS_COLORS[f.value] }
                : undefined
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Controls;
