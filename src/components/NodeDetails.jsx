import { formatType, formatStatus, formatEdgeType, formatApproach, getNodeStatusDisplay } from '../utils/formatters';
import { getNodeEdges } from '../utils/graphUtils';
import { STATUS_COLORS, FIPS_COLORS } from '../constants/colors';
import { FIPS_STATUS_LABELS } from '../constants/labels';

function NodeDetails({ node, graphData, onClose }) {
  if (!node) return null;

  const { statusText } = getNodeStatusDisplay(node);
  const statusColor = STATUS_COLORS[node.status] || '#aaa';
  const edges = getNodeEdges(node.id, graphData.links);

  const findNodeName = (id) => {
    const n = graphData.nodes.find(n => n.id === id);
    return n ? n.name : id;
  };

  const resolveId = (ref) => typeof ref === 'object' ? ref.id : ref;

  return (
    <div className="hud-panel details-panel">
      <button className="close-btn" onClick={onClose} aria-label="Close details">x</button>

      <h3 className="details-title">{node.name}</h3>

      <div className="status-badge" style={{ borderColor: statusColor, color: statusColor }}>
        {statusText}
      </div>

      <div className="details-grid">
        <DetailRow label="Type">{formatType(node.type)}</DetailRow>
        {node.version && <DetailRow label="Version">{node.version}</DetailRow>}
        {node.metadata?.date && <DetailRow label="Date">{node.metadata.date}</DetailRow>}
        {node.metadata?.description && <DetailRow label="Description">{node.metadata.description}</DetailRow>}
        {node.x != null && (
          <DetailRow label="Position">
            x:{Math.round(node.x)} y:{Math.round(node.y)} z:{Math.round(node.z)}
          </DetailRow>
        )}
      </div>

      {node.metadata?.fips && (
        <div className="details-section fips-section">
          <h4>FIPS 140-3</h4>
          <div className="fips-badge" style={{
            borderColor: FIPS_COLORS[node.metadata.fips.status] || '#666',
            color: FIPS_COLORS[node.metadata.fips.status] || '#666'
          }}>
            {FIPS_STATUS_LABELS[node.metadata.fips.status] || node.metadata.fips.status}
          </div>
          {node.metadata.fips.certificate && (
            <DetailRow label="Certificate">{node.metadata.fips.certificate}</DetailRow>
          )}
          <DetailRow label="PQC in FIPS Boundary">
            {node.metadata.fips.includes_pqc ? 'Yes' : 'No'}
          </DetailRow>
          {node.metadata.fips.notes && (
            <p className="details-notes fips-notes">{node.metadata.fips.notes}</p>
          )}
        </div>
      )}

      {node.metadata?.pqc_surfaces && (
        <div className="details-section">
          <h4>PQC Surface Readiness</h4>
          {Object.entries(node.metadata.pqc_surfaces).map(([surface, info]) => (
            <div key={surface} className="surface-row">
              <span className="surface-name">{surface}</span>
              <span
                className="surface-status"
                style={{ color: STATUS_COLORS[info.status] || '#888' }}
              >
                {info.status === 'n/a' ? 'N/A' : formatStatus(info.status)}
              </span>
              {info.note && <span className="surface-note">{info.note}</span>}
            </div>
          ))}
        </div>
      )}

      {edges.outgoing.length > 0 && (
        <div className="details-section">
          <h4>Outgoing Connections</h4>
          {edges.outgoing.map((edge, i) => (
            <div key={i} className="edge-row">
              <span className="edge-type">
                {formatEdgeType(edge.type)}
                {edge.approach && ` (${formatApproach(edge.approach)})`}
              </span>
              <span className="edge-arrow">-&gt;</span>
              <span className="edge-target">{findNodeName(resolveId(edge.target))}</span>
              <span className="edge-status" style={{ color: STATUS_COLORS[edge.status] }}>
                {formatStatus(edge.status)}
              </span>
            </div>
          ))}
        </div>
      )}

      {edges.incoming.length > 0 && (
        <div className="details-section">
          <h4>Incoming Connections</h4>
          {edges.incoming.map((edge, i) => (
            <div key={i} className="edge-row">
              <span className="edge-target">{findNodeName(resolveId(edge.source))}</span>
              <span className="edge-arrow">-&gt;</span>
              <span className="edge-type">
                {formatEdgeType(edge.type)}
                {edge.approach && ` (${formatApproach(edge.approach)})`}
              </span>
              <span className="edge-status" style={{ color: STATUS_COLORS[edge.status] }}>
                {formatStatus(edge.status)}
              </span>
            </div>
          ))}
        </div>
      )}

      {node.metadata?.ietf_drafts?.length > 0 && (
        <div className="details-section">
          <h4>IETF Drafts</h4>
          {node.metadata.ietf_drafts.map((draft, i) => (
            <div key={i} className="source-link">
              <a href={draft.url} target="_blank" rel="noopener noreferrer">
                {draft.name}
              </a>
              <span className="draft-status">{draft.status}</span>
            </div>
          ))}
        </div>
      )}

      {node.metadata?.notes && (
        <div className="details-section">
          <h4>Notes</h4>
          <p className="details-notes">{node.metadata.notes}</p>
        </div>
      )}

      {node.metadata?.sources?.length > 0 && (
        <div className="details-section">
          <h4>Sources</h4>
          {node.metadata.sources.map((source, i) => (
            <div key={i} className="source-link">
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, children }) {
  if (!children) return null;
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{children}</span>
    </div>
  );
}

export default NodeDetails;
