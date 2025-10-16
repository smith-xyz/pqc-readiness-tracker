import { UI_LABELS } from '../constants/labels';

function Info({ lastUpdated }) {
  return (
    <section className="info">
      <h2>{UI_LABELS.ABOUT}</h2>
      <p>
        This dashboard visualizes the dependency graph for Post-Quantum Cryptography (PQC)
        adoption across programming languages and cryptographic libraries.
      </p>
      
      <div className="pqc-readiness-criteria">
        <h3>PQC Readiness Status</h3>
        <p>
          <strong>Available (Green):</strong> Component has both ML-KEM and ML-DSA algorithms 
          implemented in critical protocols (TLS, SSH, or QUIC). This indicates full PQC readiness 
          for real-world deployment.
        </p>
        <p>
          <strong>Partial (Yellow):</strong> Component has some PQC capabilities - either API access 
          to algorithms or protocol support for one algorithm type. Shows progress toward PQC readiness.
        </p>
        <p>
          <strong>Not Available (Red):</strong> Component lacks PQC algorithm support or protocol integration.
        </p>
        <p className="protocol-note">
          <em>Note: We focus on critical protocols (TLS, SSH, QUIC) for status calculation, 
          but node details show all supported protocols including DTLS, IPSec, and others.</em>
        </p>
      </div>
      
      <p>
        <strong>Click</strong> any node to see details. Runtime nodes will expand to show applications and frameworks that depend on them. Use filters to focus on specific layers or status.
      </p>
      {lastUpdated && (
        <p className="last-updated">
          <strong>{UI_LABELS.LAST_UPDATED}</strong> {lastUpdated}
        </p>
      )}
    </section>
  );
}

export default Info;

