import { LAYER_FILTERS, STATUS_FILTERS, UI_LABELS } from '../constants/labels';

function Controls({ layerFilter, setLayerFilter, statusFilter, setStatusFilter }) {
  return (
    <section className="controls">
      <div className="filter-group">
        <label>{UI_LABELS.SHOW_LAYER}</label>
        {LAYER_FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`filter-btn ${layerFilter === filter.value ? 'active' : ''}`}
            onClick={() => setLayerFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <label>{UI_LABELS.STATUS}</label>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`status-btn ${statusFilter === filter.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Controls;

