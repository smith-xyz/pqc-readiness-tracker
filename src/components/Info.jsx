import { UI_LABELS } from '../constants/labels';

function Info({ lastUpdated }) {
  return (
    <section className="info">
      <h2>{UI_LABELS.ABOUT}</h2>
      <p>
        This dashboard visualizes the dependency graph for Post-Quantum Cryptography (PQC)
        adoption across programming languages and cryptographic libraries.
      </p>
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

