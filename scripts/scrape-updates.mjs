#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkGitHubReleases } from './sources/github-releases.mjs';
import { checkIETFDrafts } from './sources/ietf-datatracker.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const NODES_PATH = resolve(__dirname, '../public/data/nodes.json');

async function main() {
  console.log('PQC Readiness Scraper');
  console.log('=====================\n');

  const nodesJson = JSON.parse(await readFile(NODES_PATH, 'utf-8'));
  const changes = [];

  console.log('Checking GitHub releases...');
  const githubUpdates = await checkGitHubReleases(process.env.GITHUB_TOKEN);
  for (const [nodeId, data] of Object.entries(githubUpdates)) {
    const node = nodesJson.nodes[nodeId];
    if (!node) {
      console.log(`  [SKIP] Node ${nodeId} not found in nodes.json`);
      continue;
    }

    if (!node.metadata) node.metadata = {};

    const prev = node.metadata.latestRelease || {};
    const prevVersion = prev.version || '';

    if (data.version && data.version !== prevVersion) {
      node.metadata.latestRelease = {
        version: data.version,
        date: data.date,
        url: data.releaseUrl,
        tag: data.tagName,
        hasPqcMention: data.hasPqcMention
      };

      changes.push({
        nodeId,
        field: 'metadata.latestRelease',
        old: prevVersion || '(none)',
        new: data.version,
        source: 'github'
      });

      console.log(`  [UPDATE] ${node.name}: latest release ${prevVersion || '(none)'} -> ${data.version}`);

      if (data.hasPqcMention) {
        console.log(`  [PQC]   ${node.name} ${data.version} mentions PQC in release notes`);
      }
    }
  }

  console.log('\nChecking IETF drafts...');
  const ietfUpdates = await checkIETFDrafts();
  for (const [nodeId, data] of Object.entries(ietfUpdates)) {
    const node = nodesJson.nodes[nodeId];
    if (!node) {
      console.log(`  [SKIP] Node ${nodeId} not found in nodes.json`);
      continue;
    }

    if (!node.metadata) node.metadata = {};
    if (!node.metadata.ietf_drafts) node.metadata.ietf_drafts = [];

    for (const draftUpdate of data.drafts) {
      const existing = node.metadata.ietf_drafts.find(
        d => d.name === draftUpdate.document
      );

      if (existing) {
        if (draftUpdate.status !== existing.status) {
          changes.push({
            nodeId,
            field: `ietf_draft.${draftUpdate.document}.status`,
            old: existing.status,
            new: draftUpdate.status,
            source: 'ietf'
          });
          existing.status = draftUpdate.status;
          console.log(`  [UPDATE] ${node.name} draft ${draftUpdate.document}: ${existing.status} -> ${draftUpdate.status}`);
        }

        if (draftUpdate.rfcNumber && !existing.rfcNumber) {
          existing.rfcNumber = draftUpdate.rfcNumber;
          changes.push({
            nodeId,
            field: `ietf_draft.${draftUpdate.document}.rfcNumber`,
            old: null,
            new: draftUpdate.rfcNumber,
            source: 'ietf'
          });
          console.log(`  [UPDATE] ${node.name} draft ${draftUpdate.document} published as RFC ${draftUpdate.rfcNumber}`);
        }
      } else {
        node.metadata.ietf_drafts.push({
          name: draftUpdate.document,
          status: draftUpdate.status,
          title: draftUpdate.title,
          rev: draftUpdate.rev,
          lastUpdated: draftUpdate.lastUpdated,
          rfcNumber: draftUpdate.rfcNumber || null
        });
        changes.push({
          nodeId,
          field: `ietf_draft.${draftUpdate.document}`,
          old: '(new)',
          new: draftUpdate.status,
          source: 'ietf'
        });
        console.log(`  [NEW]   ${node.name} now tracking draft ${draftUpdate.document} (${draftUpdate.status})`);
      }

      if (draftUpdate.status === 'rfc' && node.status === 'draft') {
        const allRfc = node.metadata.ietf_drafts.every(d => d.status === 'rfc');
        if (allRfc) {
          changes.push({
            nodeId,
            field: 'status',
            old: node.status,
            new: 'rfc',
            source: 'ietf'
          });
          node.status = 'rfc';
          console.log(`  [UPDATE] ${node.name}: status draft -> rfc (all drafts published)`);
        }
      }
    }
  }

  if (changes.length > 0) {
    nodesJson.last_updated = new Date().toISOString().split('T')[0];
    await writeFile(NODES_PATH, JSON.stringify(nodesJson, null, 4) + '\n', 'utf-8');

    console.log(`\n${changes.length} change(s) written to nodes.json`);
    console.log('\nChangelog:');
    for (const change of changes) {
      console.log(`  - ${change.nodeId}.${change.field}: "${change.old}" -> "${change.new}" (${change.source})`);
    }
  } else {
    console.log('\nNo changes detected.');
  }

  return changes;
}

main().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
