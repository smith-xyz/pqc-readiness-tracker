# PQC Readiness Tracker

Community-maintained dashboard tracking Post-Quantum Cryptography (PQC) implementation status across programming languages, crypto libraries, and standards.

[![Deploy](https://github.com/smith-xyz/pqc-readiness-tracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/smith-xyz/pqc-readiness-tracker/actions/workflows/deploy.yml)

**Live Dashboard:** [https://smith-xyz.github.io/pqc-readiness-tracker/](https://smith-xyz.github.io/pqc-readiness-tracker/)

## Overview

This project visualizes the **dependency tree** of PQC readiness as an interactive graph:

- **Standards** (Layer 0): NIST FIPS & IETF specifications
- **Crypto Libraries** (Layer 1): OpenSSL, BoringSSL, Bouncy Castle, rustls, wolfSSL, NSS (with protocol support info)
- **Language Runtimes** (Layer 2): Node.js, Python, Go, Java, Rust, .NET, Ruby, PHP
- **Infrastructure** (Layer 3): Enterprise-critical software (OpenSSH, nginx, Apache, HAProxy, curl) branching from crypto libraries

## Why This Exists

Understanding PQC adoption requires seeing the full dependency chain from standards through implementations to runtimes. Most languages depend on OpenSSL, which has ML-KEM/ML-DSA algorithms but not yet TLS cipher suites. Go is unique with its independent crypto implementation, offering production-ready PQC TLS today.

**Key Insights**:

- Application-level PQC is available in many runtimes, but protocol-level PQC (TLS, SSH, IPSec) depends on the underlying crypto library implementation
- Different implementations have different PQC readiness (e.g., Go crypto/tls has production TLS, OpenSSL TLS is blocked on IETF standards)
- Click on crypto libraries to see which protocols they support (TLS, SSH, IPSec, QUIC, etc.)

## Tech Stack

- **Frontend**: React 18 + Vite
- **Visualization**: Cytoscape.js for interactive dependency graphs
- **Deployment**: GitHub Pages with automated builds
- **Data**: JSON files (no build required for updates)

## Structure

```
pqc-readiness-tracker/
├── public/                  # Static assets (served as-is)
│   ├── data/                # JSON data files (graph model)
│   │   ├── nodes.json       # All components
│   │   ├── edges.json       # Dependencies
│   │   └── graph-schema.md  # Data model documentation
│   └── shield.svg           # Favicon
├── src/                     # React application
│   ├── components/          # React components
│   ├── App.jsx
│   └── main.jsx
└── .github/workflows/       # GitHub Actions
    └── deploy.yml           # Auto-deploy to Pages
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Automatic deployment via GitHub Actions:

1. **Enable GitHub Pages**: Settings → Pages → Source: "GitHub Actions"
2. **Update Vite config**: Set `base: '/your-repo-name/'` in `vite.config.js`
3. **Push to main**: Auto-deploys to `https://smith-xyz.github.io/pqc-readiness-tracker/`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- **Data updates**: Edit `public/data/nodes.json` or `public/data/edges.json` (no code changes needed!)
- Adding new components
- Updating status
- Providing sources/citations
- Testing claims

## License

MIT

## Acknowledgments

Community-driven project to help organizations understand PQC readiness across technology stacks.
