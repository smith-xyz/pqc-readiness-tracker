function StatusBar({ lastUpdated, nodeCount, edgeCount }) {
  return (
    <div className="hud-panel status-bar">
      <span className="status-item">
        <span className="status-label">Last Updated</span>
        <span className="status-value">{lastUpdated || 'Unknown'}</span>
      </span>
      <span className="status-divider" />
      <span className="status-item">
        <span className="status-label">Entities</span>
        <span className="status-value">{nodeCount}</span>
      </span>
      <span className="status-divider" />
      <span className="status-item">
        <span className="status-label">Connections</span>
        <span className="status-value">{edgeCount}</span>
      </span>
    </div>
  );
}

export default StatusBar;
