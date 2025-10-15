import { LEGEND_ITEMS, UI_LABELS } from '../constants/labels';

function Legend() {
  return (
    <section className="legend">
      <h3>{UI_LABELS.LEGEND}</h3>
      <div className="legend-items">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="legend-item">
            <span className="legend-color" style={{ background: item.color }}></span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Legend;

