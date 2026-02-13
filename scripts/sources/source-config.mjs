export const GITHUB_SOURCES = {
  openssl: {
    owner: 'openssl',
    repo: 'openssl',
    tagPattern: /^openssl-(\d+\.\d+\.\d+)$/,
    nodeId: 'openssl'
  },
  nodejs: {
    owner: 'nodejs',
    repo: 'node',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'nodejs',
    minMajor: 22
  },
  go: {
    nodeId: 'go',
    useGoApi: true
  },
  rustLang: {
    owner: 'rust-lang',
    repo: 'rust',
    tagPattern: /^(\d+\.\d+\.\d+)$/,
    nodeId: 'rust-lang'
  },
  rustls: {
    owner: 'rustls',
    repo: 'rustls',
    tagPattern: /^v\/(\d+\.\d+\.\d+)$/,
    nodeId: 'rustls'
  },
  wolfssl: {
    owner: 'wolfSSL',
    repo: 'wolfssl',
    tagPattern: /^v(\d+\.\d+\.\d+)-stable$/,
    nodeId: 'wolfssl'
  },
  curl: {
    owner: 'curl',
    repo: 'curl',
    tagPattern: /^curl-(\d+_\d+_\d+)$/,
    nodeId: 'curl',
    versionTransform: (v) => v.replace(/_/g, '.')
  },
  openssh: {
    owner: 'openssh',
    repo: 'openssh-portable',
    tagPattern: /^V_(\d+_\d+_P\d+)$/,
    nodeId: 'openssh',
    versionTransform: (v) => v.replace(/_/g, '.').replace('.P', 'p'),
    useTags: true
  },
  dotnet: {
    owner: 'dotnet',
    repo: 'runtime',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'dotnet',
    minMajor: 10
  },
  python: {
    owner: 'python',
    repo: 'cpython',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'python-3',
    useTags: true,
    minMajor: 3
  },
  ruby: {
    owner: 'ruby',
    repo: 'ruby',
    tagPattern: /^v(\d+_\d+_\d+)$/,
    nodeId: 'ruby',
    versionTransform: (v) => v.replace(/_/g, '.'),
    minMajor: 3
  },
  php: {
    owner: 'php',
    repo: 'php-src',
    tagPattern: /^php-(\d+\.\d+\.\d+)$/,
    nodeId: 'php'
  },
  deno: {
    owner: 'denoland',
    repo: 'deno',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'deno'
  },
  bun: {
    owner: 'oven-sh',
    repo: 'bun',
    tagPattern: /^bun-v(\d+\.\d+\.\d+)$/,
    nodeId: 'bun'
  },
  symcrypt: {
    owner: 'microsoft',
    repo: 'SymCrypt',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'symcrypt'
  },
  haproxy: {
    owner: 'haproxy',
    repo: 'haproxy',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'haproxy',
    useTags: true
  },
  kubernetes: {
    owner: 'kubernetes',
    repo: 'kubernetes',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'kubernetes',
    minMajor: 1
  },
  vault: {
    owner: 'hashicorp',
    repo: 'vault',
    tagPattern: /^v(\d+\.\d+\.\d+)$/,
    nodeId: 'vault'
  },
  istio: {
    owner: 'istio',
    repo: 'istio',
    tagPattern: /^(\d+\.\d+\.\d+)$/,
    nodeId: 'istio'
  },
  keycloak: {
    owner: 'keycloak',
    repo: 'keycloak',
    tagPattern: /^(\d+\.\d+\.\d+)$/,
    nodeId: 'keycloak'
  },
  kafka: {
    owner: 'apache',
    repo: 'kafka',
    tagPattern: /^(\d+\.\d+\.\d+)$/,
    nodeId: 'kafka'
  }
};

export const IETF_SOURCES = {
  'proto-tls-pqc': [
    { document: 'draft-ietf-tls-ecdhe-mlkem' },
    { document: 'draft-ietf-tls-mlkem' }
  ],
  'proto-ssh-pqc': [
    { document: 'draft-ietf-sshm-mlkem-hybrid-kex' },
    { document: 'draft-ietf-sshm-ntruprime-ssh' }
  ],
  'proto-x509-pqc': [
    { document: 'draft-ietf-lamps-dilithium-certificates' },
    { document: 'draft-ietf-lamps-x509-slhdsa' },
    { document: 'draft-ietf-lamps-pq-composite-sigs' }
  ]
};

export const PQC_KEYWORDS = [
  'ml-kem', 'ml-dsa', 'slh-dsa', 'kyber', 'dilithium', 'sphincs',
  'post-quantum', 'pqc', 'hybrid key exchange', 'mlkem', 'mldsa',
  'fips 203', 'fips 204', 'fips 205', 'quantum', 'fn-dsa', 'falcon'
];
