import { formatType, formatStatus, getNodeStatusDisplay } from '../utils/formatters';
import { DETAIL_FIELDS, UI_LABELS } from '../constants/labels';

function DetailRow({ label, children }) {
  if (!children) return null;
  
  return (
    <div className="detail-row">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{children}</div>
    </div>
  );
}

function NodeDetails({ node, nodesData, onClose }) {
  const { statusClass, statusText } = getNodeStatusDisplay(node);

  return (
    <div className="details-panel">
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
      <div className="details-content">
        <h3>{node.name}</h3>
        <div className={`status-badge status-${statusClass}`}>{statusText}</div>

        <DetailRow label={DETAIL_FIELDS.TYPE}>
          {formatType(node.type)}
        </DetailRow>

        <DetailRow label={DETAIL_FIELDS.VERSION}>
          {node.version}
        </DetailRow>

        {node.status.ml_kem_api !== undefined && (
          <DetailRow label={DETAIL_FIELDS.ML_KEM_STATUS}>
            {UI_LABELS.API}: {formatStatus(node.status.ml_kem_api)}
            {node.status.ml_kem_protocols && Object.keys(node.status.ml_kem_protocols).length > 0 && (
              <>
                <br />
                Protocols: {Object.entries(node.status.ml_kem_protocols).map(([protocol, status]) => (
                  <div key={protocol} style={{ marginLeft: '1rem' }}>
                    {protocol.toUpperCase()}: {formatStatus(status)}
                  </div>
                ))}
              </>
            )}
          </DetailRow>
        )}

        {node.status.ml_dsa_api !== undefined && (
          <DetailRow label={DETAIL_FIELDS.ML_DSA_STATUS}>
            {UI_LABELS.API}: {formatStatus(node.status.ml_dsa_api)}
            {node.status.ml_dsa_protocols && Object.keys(node.status.ml_dsa_protocols).length > 0 && (
              <>
                <br />
                Protocols: {Object.entries(node.status.ml_dsa_protocols).map(([protocol, status]) => (
                  <div key={protocol} style={{ marginLeft: '1rem' }}>
                    {protocol.toUpperCase()}: {formatStatus(status)}
                  </div>
                ))}
              </>
            )}
          </DetailRow>
        )}

        {node.depends_on?.length > 0 && (
          <DetailRow label={DETAIL_FIELDS.DEPENDS_ON}>
            {node.depends_on.map(id => nodesData[id]?.name || id).join(', ')}
          </DetailRow>
        )}

        {node.blocks_on?.length > 0 && (
          <DetailRow label={DETAIL_FIELDS.BLOCKED_BY}>
            {node.blocks_on.join(', ')}
          </DetailRow>
        )}

        <DetailRow label={DETAIL_FIELDS.DESCRIPTION}>
          {node.metadata?.description}
        </DetailRow>

        <DetailRow label={DETAIL_FIELDS.NOTES}>
          {node.metadata?.notes}
        </DetailRow>

        {node.metadata?.protocols && (
          <DetailRow label="Protocol Support">
            {Object.entries(node.metadata.protocols).map(([protocol, status]) => (
              <div key={protocol}>
                {protocol}: {formatStatus(status)}
              </div>
            ))}
          </DetailRow>
        )}

        {node.metadata?.sources?.length > 0 && (
          <DetailRow label={DETAIL_FIELDS.SOURCES}>
            {node.metadata.sources.map((source, idx) => (
              <div key={idx}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.label} →
                </a>
              </div>
            ))}
          </DetailRow>
        )}
      </div>
    </div>
  );
}

export default NodeDetails;

