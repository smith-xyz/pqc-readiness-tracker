# PQC Readiness Tracker - Copilot Instructions

React dashboard for Post-Quantum Cryptography adoption tracking.

## Data Patterns

### Node Status

```json
{
  "status": {
    "ml_kem_protocols": { "tls": "available", "ssh": "available" },
    "ml_dsa_protocols": { "tls": "not_available" }
  }
}
```

### Sources

```json
{
  "sources": [{ "label": "Descriptive Name", "url": "https://example.com" }]
}
```

## Status Logic

- Available: ML-KEM + ML-DSA in critical protocols (TLS/SSH/QUIC)
- Partial: Some PQC capabilities
- Not Available: No PQC support

## Key Files

- `src/utils/graphUtils.js` - Status calculation
- `src/components/NodeDetails.jsx` - Node display
- `public/data/nodes.json` - Node data
