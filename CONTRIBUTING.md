# Contributing to PQC Readiness Tracker

Thank you for helping keep this resource accurate and up-to-date!

## How to Contribute

### Reporting Updates

When you discover changes in PQC support:

1. **Find the source**

   - Official release notes
   - Project documentation
   - GitHub commits/PRs
   - Vendor announcements

2. **Verify the claim**

   - Test if possible
   - Cross-reference multiple sources
   - Check version numbers

3. **Submit an update**
   - Open an issue with source links
   - Or submit a PR with changes

## Update Guidelines

### What to Update

- New version releases with PQC features
- Status changes (experimental → stable, partial → available)
- New crypto libraries, runtimes, or protocols
- Protocol implementations (e.g., TLS via different libraries)
- Test results with proof
- Links to official documentation
- Dependencies and relationships

**DON'T update without sources**:

- Speculation about future features
- Unverified rumors
- Personal opinions
- Timeline predictions without official announcements

### Adding Protocol Support to Libraries

When updating protocol support in crypto libraries:

1. **Add protocols to metadata**

   - Protocol name (TLS, SSH, IPSec, QUIC, DTLS, etc.)
   - Status for each protocol (available, experimental, not_available)
   - Version that added support

2. **Example**
   ```json
   {
     "id": "openssl-3.5",
     "type": "crypto_library",
     "metadata": {
       "protocols": {
         "TLS 1.3": "not_available",
         "SSH": "not_available",
         "IPSec/IKEv2": "not_available"
       }
     }
   }
   ```

### Data File Updates

When updating JSON files:

1. **Update the field**

   ```json
   "ml_kem": {
     "api": "available",  // Changed from "not_available"
     "status_updated": "2025-10-15"  // Add date
   }
   ```

2. **Add source**

   ```json
   "sources": [
     "https://example.com/release-notes"
   ]
   ```

3. **Update last_updated**

   ```json
   "last_updated": "2025-10-15"
   ```

4. **Add notes if needed**
   ```json
   "notes": "API available in v1.2.0, TLS integration coming in v1.3.0"
   ```

### Testing Claims

If you're reporting test results:

1. **Include environment**

   - Exact version numbers
   - OS and architecture
   - Test date

2. **Show reproduction steps**

   ```bash
   node -v  # v24.7.0
   node -e "console.log(typeof crypto.encapsulate)"  # function
   ```

3. **Link to test code**
   - GitHub repo with tests
   - Or inline test snippet

## Pull Request Process

1. **Fork the repository**

2. **Create a branch**

   ```bash
   git checkout -b update-nodejs-ml-kem
   ```

3. **Make your changes**

   - Update JSON files in `public/data/`
   - Add test results if applicable

4. **Test locally**

   ```bash
   npm install
   npm run dev
   # Visit http://localhost:5173/pqc-readiness-tracker/
   ```

5. **Validate JSON**

   ```bash
   cat public/data/nodes.json | jq .
   cat public/data/edges.json | jq .
   ```

6. **Commit with clear message**

   ```bash
   git commit -m "Update Node.js: ML-KEM API available in v24.7.0"
   ```

7. **Push and create PR**

   - Include source links in PR description
   - Explain what changed and why

8. **Address review feedback**

## Source Quality

### Tier 1 Sources (Best)

- Official release notes
- Project documentation
- NIST/IETF publications
- Vendor announcements

### Tier 2 Sources (Good)

- GitHub commits/PRs
- Technical blog posts from maintainers
- Conference talks with slides

### Tier 3 Sources (Use with caution)

- Community forum discussions
- Third-party blog posts
- Social media posts

Always prefer Tier 1 sources when available.

## Code of Conduct

- Be respectful and professional
- Assume good faith
- Focus on facts and sources
- Welcome corrections
- Help newcomers

## Questions?

Open an issue with the "question" label or reach out to maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
