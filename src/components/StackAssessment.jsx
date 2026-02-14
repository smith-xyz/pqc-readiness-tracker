import { useState, useMemo } from 'react';
import { STATUS_COLORS } from '../constants/colors';
import { formatStatus } from '../utils/formatters';

const STATUS_PRIORITY = { not_available: 0, experimental: 1, partial: 2, available: 3, final: 3, rfc: 3 };

function StackAssessment({ graphData, onAssess, onClear, isActive, inline }) {
  const [platform, setPlatform] = useState('');
  const [os, setOs] = useState('');
  const [language, setLanguage] = useState('');
  const [services, setServices] = useState([]);

  const nodesByLayer = useMemo(() => {
    const grouped = { platforms: [], os: [], languages: [], services: [] };
    for (const node of graphData.nodes) {
      if (node.layer === 8) grouped.platforms.push(node);
      else if (node.layer === 3) grouped.os.push(node);
      else if (node.layer >= 4 && node.layer <= 6) grouped.languages.push(node);
      else if (node.layer === 9) grouped.services.push(node);
    }
    grouped.platforms.sort((a, b) => a.name.localeCompare(b.name));
    grouped.os.sort((a, b) => a.name.localeCompare(b.name));
    grouped.languages.sort((a, b) => a.name.localeCompare(b.name));
    grouped.services.sort((a, b) => a.name.localeCompare(b.name));
    return grouped;
  }, [graphData.nodes]);

  const selectedNodes = useMemo(() => {
    const ids = [platform, os, language, ...services].filter(Boolean);
    return graphData.nodes.filter(n => ids.includes(n.id));
  }, [platform, os, language, services, graphData.nodes]);

  const weakestLink = useMemo(() => {
    if (selectedNodes.length === 0) return null;
    return selectedNodes.reduce((worst, node) => {
      const p = STATUS_PRIORITY[node.status] ?? 99;
      const wp = STATUS_PRIORITY[worst.status] ?? 99;
      return p < wp ? node : worst;
    });
  }, [selectedNodes]);

  const toggleService = (id) => {
    setServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAssess = () => {
    const ids = [platform, os, language, ...services].filter(Boolean);
    if (ids.length === 0) return;
    onAssess(ids);
  };

  const handleClear = () => {
    setPlatform('');
    setOs('');
    setLanguage('');
    setServices([]);
    onClear();
  };

  return (
    <div className={inline ? 'stack-panel-inline' : 'hud-panel stack-panel'}>
      {!inline && <h3 className="stack-title">My Stack</h3>}

      <div className="stack-field">
        <label className="stack-label">Platform</label>
        <select
          className="stack-select"
          value={platform}
          onChange={e => setPlatform(e.target.value)}
        >
          <option value="">-- Optional --</option>
          {nodesByLayer.platforms.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div className="stack-field">
        <label className="stack-label">OS</label>
        <select
          className="stack-select"
          value={os}
          onChange={e => setOs(e.target.value)}
        >
          <option value="">-- Optional --</option>
          {nodesByLayer.os.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div className="stack-field">
        <label className="stack-label">Language / Runtime</label>
        <select
          className="stack-select"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="">-- Select --</option>
          {nodesByLayer.languages.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div className="stack-field">
        <label className="stack-label">Services</label>
        <div className="stack-chips">
          {nodesByLayer.services.map(n => (
            <button
              key={n.id}
              className={`stack-chip ${services.includes(n.id) ? 'active' : ''}`}
              onClick={() => toggleService(n.id)}
            >
              {n.name}
            </button>
          ))}
        </div>
      </div>

      <div className="stack-actions">
        <button
          className="stack-assess-btn"
          onClick={handleAssess}
          disabled={!platform && !os && !language && services.length === 0}
        >
          Assess
        </button>
        {isActive && (
          <button className="stack-clear-btn" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {isActive && selectedNodes.length > 0 && (
        <div className="stack-summary">
          <h4 className="stack-summary-title">Readiness Summary</h4>
          {selectedNodes.map(node => (
            <div key={node.id} className="stack-summary-row">
              <span className="stack-summary-name">{node.name}</span>
              <span
                className="stack-summary-status"
                style={{ color: STATUS_COLORS[node.status] || '#888' }}
              >
                {formatStatus(node.status)}
              </span>
            </div>
          ))}

          {selectedNodes.some(n => n.metadata?.pqc_surfaces) && (
            <div className="stack-surfaces">
              {selectedNodes.filter(n => n.metadata?.pqc_surfaces).map(node => (
                <div key={node.id} className="stack-surface-group">
                  <span className="stack-surface-label">{node.name} Surfaces</span>
                  {Object.entries(node.metadata.pqc_surfaces).map(([surface, info]) => (
                    <div key={surface} className="surface-row">
                      <span className="surface-name">{surface}</span>
                      <span
                        className="surface-status"
                        style={{ color: STATUS_COLORS[info.status] || '#888' }}
                      >
                        {info.status === 'n/a' ? 'N/A' : formatStatus(info.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {weakestLink && (
            <div className="stack-weakest">
              <span className="stack-weakest-label">Weakest link</span>
              <span className="stack-weakest-name">{weakestLink.name}</span>
              <span
                className="stack-weakest-status"
                style={{ color: STATUS_COLORS[weakestLink.status] || '#888' }}
              >
                {formatStatus(weakestLink.status)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StackAssessment;
