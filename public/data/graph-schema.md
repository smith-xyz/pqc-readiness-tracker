# PQC Readiness Graph Schema

This document defines the graph model for visualizing PQC readiness dependencies.

## Graph Structure

```
nodes: Components at each layer
edges: Dependencies and relationships between components
```

## Node Types

### 1. `standard`

Standards and specifications (NIST, IETF)

- Example: NIST FIPS 203, IETF TLS Hybrid Draft

### 2. `crypto_library`

Cryptographic implementations

- Example: OpenSSL, Go stdlib crypto, BoringSSL, Bouncy Castle, rustls, wolfSSL

### 3. `runtime`

Language runtimes and compilers

- Example: Node.js, Python, Go, Java, Rust, .NET, Ruby, PHP

## Node Properties

```json
{
  "id": "unique-identifier",
  "type": "node_type",
  "name": "Display Name",
  "version": "1.0.0",
  "status": {
    "ml_kem_api": "available|experimental|not_available",
    "ml_kem_tls": "available|experimental|not_available",
    "ml_dsa_api": "available|experimental|not_available",
    "ml_dsa_tls": "available|experimental|not_available"
  },
  "depends_on": ["node-id-1", "node-id-2"],
  "blocks_on": ["feature-name"],
  "metadata": {
    "date": "2024-10-01",
    "sources": ["url"],
    "notes": "Additional info"
  }
}
```

## Edge Types

### `depends_on`

Direct dependency

- Example: Node.js depends on OpenSSL

### `blocks_on`

Blocked by missing feature

- Example: OpenSSL TLS blocked on IETF standards

### `enables`

Enables downstream components

- Example: OpenSSL enables Node.js

## Status Propagation

Status flows UP the graph:

```
Standard (done) → Crypto Lib (partial) → Runtime (blocked)
                       ↑
                   Blocker here!
```

If any dependency is blocked, status is:

- `blocked`: Cannot proceed
- `waiting`: Dependency in progress
- `ready`: All dependencies met

## Example Graph

```
Layer 0 (Standard) → Layer 1 (Crypto Lib) → Layer 2 (Runtime)

nist-fips-203 ─→ openssl-3.5 ─→ nodejs-24.7
    ✅              🟡 partial       🟡 blocked
  [done]         [API only]    [inherits status]
               [TLS: blocked]  [TLS: blocked]

nist-fips-203 ─→ go-stdlib-crypto ─→ go-1.23
    ✅              ✅ available      ✅ ready
  [done]         [API + TLS]      [independent]
               [TLS: production] [TLS: production]

nist-fips-203 ─→ bouncy-castle ─→ java-jdk
    ✅              🟡 partial        🟡 blocked
  [done]         [API only]     [waiting on TLS]
```

**Note**: Protocol support (TLS, SSH, IPSec, QUIC) is shown in crypto library metadata. Click nodes to see protocol details.

## Visualization Goals

1. **Trace paths**: Click a runtime, see its full dependency chain
2. **Find blockers**: Highlight nodes blocking progress
3. **Compare paths**: Show Go vs Node.js side by side
4. **Status colors**:
   - Green: Available
   - Yellow: Partial/Experimental
   - Red: Not available
   - Gray: Not applicable

## Data Files

- `nodes.json`: All nodes with properties
- `edges.json`: All relationships
- Or combined: `graph.json`
