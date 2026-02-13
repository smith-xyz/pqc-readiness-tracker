import { GITHUB_SOURCES, PQC_KEYWORDS } from './source-config.mjs';

const GITHUB_API = 'https://api.github.com';

function compareSemver(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

export async function checkGitHubReleases(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'pqc-readiness-scraper'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const results = await Promise.allSettled(
    Object.entries(GITHUB_SOURCES).map(([key, config]) => {
      if (config.useGoApi) return fetchGoRelease(config);
      if (config.useTags) return fetchLatestTag(key, config, headers);
      return fetchLatestRelease(key, config, headers);
    })
  );

  const updates = {};
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const { nodeId, data } = result.value;
      updates[nodeId] = data;
    } else if (result.status === 'rejected') {
      console.warn(`  [WARN] GitHub fetch failed: ${result.reason.message}`);
    }
  }

  return updates;
}

async function fetchLatestRelease(key, config, headers) {
  const { owner, repo, tagPattern, nodeId, versionTransform, minMajor } = config;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/releases?per_page=30`;

  const response = await fetch(url, { headers });

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining === '0') {
      throw new Error(`Rate limited for ${owner}/${repo}`);
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${owner}/${repo}`);
  }

  const releases = await response.json();

  let best = null;
  let bestVersion = null;

  for (const release of releases) {
    if (release.draft || release.prerelease) continue;

    const match = release.tag_name.match(tagPattern);
    if (!match) continue;

    let version = match[1];
    if (versionTransform) {
      version = versionTransform(version);
    }

    if (minMajor != null) {
      const major = parseInt(version.split('.')[0], 10);
      if (major < minMajor) continue;
    }

    if (!bestVersion || compareSemver(version, bestVersion) > 0) {
      bestVersion = version;

      const date = release.published_at
        ? release.published_at.split('T')[0]
        : null;

      const body = (release.body || '').toLowerCase();
      const name = (release.name || '').toLowerCase();
      const hasPqcMention = PQC_KEYWORDS.some(
        kw => body.includes(kw) || name.includes(kw)
      );

      best = {
        nodeId,
        data: {
          version,
          date,
          releaseUrl: release.html_url,
          hasPqcMention,
          tagName: release.tag_name
        }
      };
    }
  }

  return best;
}

async function fetchLatestTag(key, config, headers) {
  const { owner, repo, tagPattern, nodeId, versionTransform, minMajor } = config;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/tags?per_page=100`;

  const response = await fetch(url, { headers });

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    if (remaining === '0') {
      throw new Error(`Rate limited for ${owner}/${repo}`);
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${owner}/${repo}`);
  }

  const tags = await response.json();

  let best = null;
  let bestVersion = null;

  for (const tag of tags) {
    const match = tag.name.match(tagPattern);
    if (!match) continue;

    let version = match[1];
    if (versionTransform) {
      version = versionTransform(version);
    }

    if (minMajor != null) {
      const major = parseInt(version.split('.')[0], 10);
      if (major < minMajor) continue;
    }

    if (version.includes('alpha') || version.includes('beta') || version.includes('rc') || version.includes('dev')) {
      continue;
    }

    if (!bestVersion || compareSemver(version, bestVersion) > 0) {
      bestVersion = version;
      best = {
        nodeId,
        data: {
          version,
          date: null,
          releaseUrl: `https://github.com/${owner}/${repo}/releases/tag/${tag.name}`,
          hasPqcMention: false,
          tagName: tag.name
        }
      };
    }
  }

  return best;
}

async function fetchGoRelease(config) {
  const response = await fetch('https://go.dev/dl/?mode=json', {
    headers: { 'User-Agent': 'pqc-readiness-scraper' }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for go.dev/dl`);
  }

  const releases = await response.json();
  if (!releases.length) return null;

  const latest = releases[0];
  const versionMatch = latest.version.match(/^go(\d+\.\d+\.?\d*)$/);
  if (!versionMatch) return null;

  return {
    nodeId: config.nodeId,
    data: {
      version: versionMatch[1],
      date: null,
      releaseUrl: `https://go.dev/doc/go${versionMatch[1]}`,
      hasPqcMention: false,
      tagName: latest.version
    }
  };
}
