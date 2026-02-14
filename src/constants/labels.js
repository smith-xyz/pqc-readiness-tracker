export const NODE_TYPES = {
  STANDARD: 'standard',
  PROTOCOL: 'protocol',
  CRYPTO_LIBRARY: 'crypto_library',
  OS_DISTRIBUTION: 'os_distribution',
  COMPILED_LANGUAGE: 'compiled_language',
  MANAGED_RUNTIME: 'managed_runtime',
  DYNAMIC_LANGUAGE: 'dynamic_language',
  INFRASTRUCTURE: 'infrastructure',
  PLATFORM: 'platform',
  SERVICE: 'service'
};

export const NODE_TYPE_LABELS = {
  [NODE_TYPES.STANDARD]: 'Algorithm Standard',
  [NODE_TYPES.PROTOCOL]: 'Protocol Spec',
  [NODE_TYPES.CRYPTO_LIBRARY]: 'Crypto Library',
  [NODE_TYPES.OS_DISTRIBUTION]: 'OS Distribution',
  [NODE_TYPES.COMPILED_LANGUAGE]: 'Compiled Language',
  [NODE_TYPES.MANAGED_RUNTIME]: 'Managed Runtime',
  [NODE_TYPES.DYNAMIC_LANGUAGE]: 'Dynamic Language',
  [NODE_TYPES.INFRASTRUCTURE]: 'Infrastructure',
  [NODE_TYPES.PLATFORM]: 'Platform',
  [NODE_TYPES.SERVICE]: 'Service'
};

export const EDGE_TYPES = {
  SPECIFIES: 'specifies',
  IMPLEMENTS: 'implements',
  SUPPORTS: 'supports',
  SHIPS: 'ships',
  DEPENDS_ON: 'depends_on'
};

export const EDGE_TYPE_LABELS = {
  [EDGE_TYPES.SPECIFIES]: 'Specifies',
  [EDGE_TYPES.IMPLEMENTS]: 'Implements',
  [EDGE_TYPES.SUPPORTS]: 'Supports',
  [EDGE_TYPES.SHIPS]: 'Ships',
  [EDGE_TYPES.DEPENDS_ON]: 'Depends On'
};

export const STATUS = {
  AVAILABLE: 'available',
  PARTIAL: 'partial',
  EXPERIMENTAL: 'experimental',
  NOT_AVAILABLE: 'not_available',
  FINAL: 'final',
  DRAFT: 'draft',
  EVALUATION: 'evaluation',
  RFC: 'rfc',
  PROPOSED: 'proposed'
};

export const STATUS_LABELS = {
  [STATUS.AVAILABLE]: 'Available',
  [STATUS.PARTIAL]: 'Partial',
  [STATUS.EXPERIMENTAL]: 'Experimental',
  [STATUS.NOT_AVAILABLE]: 'Not Available',
  [STATUS.FINAL]: 'Final',
  [STATUS.DRAFT]: 'Draft',
  [STATUS.EVALUATION]: 'Evaluation',
  [STATUS.RFC]: 'RFC Published',
  [STATUS.PROPOSED]: 'Proposed'
};

export const APPROACH = {
  NATIVE: 'native',
  BINDING: 'binding',
  DELEGATED: 'delegated',
  THIRD_PARTY: 'third_party'
};

export const APPROACH_LABELS = {
  [APPROACH.NATIVE]: 'Native',
  [APPROACH.BINDING]: 'Binding',
  [APPROACH.THIRD_PARTY]: 'Third Party',
  [APPROACH.DELEGATED]: 'Delegated'
};

export const FIPS_STATUS = {
  VALIDATED: 'validated',
  SUBMITTED: 'submitted',
  IN_PROGRESS: 'in_progress',
  IN_TEST: 'in_test',
  NOT_AVAILABLE: 'not_available'
};

export const FIPS_STATUS_LABELS = {
  [FIPS_STATUS.VALIDATED]: 'FIPS Validated',
  [FIPS_STATUS.SUBMITTED]: 'FIPS Submitted',
  [FIPS_STATUS.IN_PROGRESS]: 'FIPS In Progress',
  [FIPS_STATUS.IN_TEST]: 'FIPS In Test',
  [FIPS_STATUS.NOT_AVAILABLE]: 'No FIPS'
};

export const LAYERS = {
  ALL: 'all',
  STANDARDS: '0',
  PROTOCOLS: '1',
  CRYPTO_LIBRARIES: '2',
  OS_DISTRIBUTIONS: '3',
  COMPILED_LANGUAGES: '4',
  MANAGED_RUNTIMES: '5',
  DYNAMIC_LANGUAGES: '6',
  INFRASTRUCTURE: '7',
  PLATFORMS: '8',
  SERVICES: '9'
};

export const LAYER_LABELS = {
  [LAYERS.ALL]: 'All Layers',
  [LAYERS.STANDARDS]: 'Standards',
  [LAYERS.PROTOCOLS]: 'Protocols',
  [LAYERS.CRYPTO_LIBRARIES]: 'Crypto Libraries',
  [LAYERS.OS_DISTRIBUTIONS]: 'OS Distributions',
  [LAYERS.COMPILED_LANGUAGES]: 'Compiled Languages',
  [LAYERS.MANAGED_RUNTIMES]: 'Managed Runtimes',
  [LAYERS.DYNAMIC_LANGUAGES]: 'Dynamic Languages',
  [LAYERS.INFRASTRUCTURE]: 'Infrastructure',
  [LAYERS.PLATFORMS]: 'Platforms',
  [LAYERS.SERVICES]: 'Services'
};

export const LAYER_FILTERS = [
  { value: LAYERS.ALL, label: LAYER_LABELS[LAYERS.ALL] },
  { value: LAYERS.STANDARDS, label: LAYER_LABELS[LAYERS.STANDARDS] },
  { value: LAYERS.PROTOCOLS, label: LAYER_LABELS[LAYERS.PROTOCOLS] },
  { value: LAYERS.CRYPTO_LIBRARIES, label: LAYER_LABELS[LAYERS.CRYPTO_LIBRARIES] },
  { value: LAYERS.OS_DISTRIBUTIONS, label: LAYER_LABELS[LAYERS.OS_DISTRIBUTIONS] },
  { value: LAYERS.COMPILED_LANGUAGES, label: LAYER_LABELS[LAYERS.COMPILED_LANGUAGES] },
  { value: LAYERS.MANAGED_RUNTIMES, label: LAYER_LABELS[LAYERS.MANAGED_RUNTIMES] },
  { value: LAYERS.DYNAMIC_LANGUAGES, label: LAYER_LABELS[LAYERS.DYNAMIC_LANGUAGES] },
  { value: LAYERS.INFRASTRUCTURE, label: LAYER_LABELS[LAYERS.INFRASTRUCTURE] },
  { value: LAYERS.PLATFORMS, label: LAYER_LABELS[LAYERS.PLATFORMS] },
  { value: LAYERS.SERVICES, label: LAYER_LABELS[LAYERS.SERVICES] }
];

export const STATUS_FILTERS = [
  { value: LAYERS.ALL, label: 'All Statuses' },
  { value: STATUS.AVAILABLE, label: STATUS_LABELS[STATUS.AVAILABLE] },
  { value: STATUS.PARTIAL, label: STATUS_LABELS[STATUS.PARTIAL] },
  { value: STATUS.EXPERIMENTAL, label: STATUS_LABELS[STATUS.EXPERIMENTAL] },
  { value: STATUS.NOT_AVAILABLE, label: STATUS_LABELS[STATUS.NOT_AVAILABLE] }
];
