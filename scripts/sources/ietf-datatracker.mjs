import { IETF_SOURCES } from './source-config.mjs';

const DATATRACKER_API = 'https://datatracker.ietf.org/api/v1/doc/document/';

export async function checkIETFDrafts() {
  const allDrafts = [];
  for (const [nodeId, drafts] of Object.entries(IETF_SOURCES)) {
    for (const draft of drafts) {
      allDrafts.push({ nodeId, document: draft.document });
    }
  }

  const results = await Promise.allSettled(
    allDrafts.map(({ nodeId, document }) =>
      fetchDocumentStatus(nodeId, document)
    )
  );

  const updates = {};
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const { nodeId, document, data } = result.value;
      if (!updates[nodeId]) {
        updates[nodeId] = { drafts: [] };
      }
      updates[nodeId].drafts.push({ document, ...data });
    } else if (result.status === 'rejected') {
      console.warn(`IETF fetch failed: ${result.reason.message}`);
    }
  }

  return updates;
}

async function fetchDocumentStatus(nodeId, documentName) {
  const url = `${DATATRACKER_API}?name=${documentName}&format=json`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${documentName}`);
  }

  const json = await response.json();
  const objects = json.objects || [];

  if (objects.length === 0) {
    return {
      nodeId,
      document: documentName,
      data: { status: 'unknown', title: documentName }
    };
  }

  const doc = objects[0];
  const state = doc.states || [];

  let status = 'draft';
  if (doc.type === '/api/v1/name/doctypename/rfc/') {
    status = 'rfc';
  } else {
    const stateNames = state.map(s => {
      if (typeof s === 'string') return s;
      return s.name || '';
    });

    if (stateNames.some(s => s.includes('rfc'))) {
      status = 'rfc';
    } else if (stateNames.some(s => s.includes('iesg'))) {
      status = 'draft';
    }
  }

  return {
    nodeId,
    document: documentName,
    data: {
      status,
      title: doc.title || documentName,
      rev: doc.rev || null,
      lastUpdated: doc.time ? doc.time.split('T')[0] : null,
      rfcNumber: doc.rfc_number || null
    }
  };
}
