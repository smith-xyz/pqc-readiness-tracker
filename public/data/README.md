# Data Files

This directory contains structured data about PQC readiness as a **dependency graph**.

## Graph Model

PQC readiness is modeled as a dependency graph from standards up to runtimes.

### nodes.json

All components in the graph:

- **Standards** (Layer 0): NIST FIPS, IETF drafts
- **Crypto Libraries** (Layer 1): OpenSSL, Go stdlib, BoringSSL
- **Runtimes** (Layer 2): Node.js, Python, Go, etc.

### edges.json

Relationships between components:

- `implements`: Implements a standard
- `depends_on`: Direct dependency
- `blocks_on`: Blocked by missing feature
- `uses`: Uses a component

## Data Schema

Each file follows a consistent schema with:

- **status**: available, experimental, in_progress, not_available, planned
- **version**: Specific version with feature
- **date**: When status last changed
- **est_date**: Estimated future availability
- **depends_on**: Dependencies (by ID)
- **sources**: Links to documentation/announcements
- **notes**: Additional context

## Status Values

- ✅ **available**: Production-ready, stable
- 🧪 **experimental**: Available but not recommended for production
- 🟡 **in_progress**: Actively being developed
- ⏳ **planned**: On roadmap with timeline
- ❌ **not_available**: Not available, no timeline

## Updating Data

1. Find reliable source (release notes, official docs, etc.)
2. Update JSON file
3. Add source link
4. Update `last_updated` timestamp
5. Submit PR with source citation

## Data Validation

Before committing, validate JSON:

```bash
# Check JSON syntax
cat standards.json | jq .

# Run validation script (TODO)
npm run validate
```
