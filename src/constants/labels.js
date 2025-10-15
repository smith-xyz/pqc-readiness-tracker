// Node Types
export const NODE_TYPES = {
  STANDARD: 'standard',
  CRYPTO_LIBRARY: 'crypto_library',
  RUNTIME: 'runtime',
  INFRASTRUCTURE: 'infrastructure'
};

export const NODE_TYPE_LABELS = {
  [NODE_TYPES.STANDARD]: 'Standard',
  [NODE_TYPES.CRYPTO_LIBRARY]: 'Crypto Library',
  [NODE_TYPES.RUNTIME]: 'Runtime',
  [NODE_TYPES.INFRASTRUCTURE]: 'Infrastructure'
};

// Status Values
export const STATUS = {
  AVAILABLE: 'available',
  PARTIAL: 'partial',
  EXPERIMENTAL: 'experimental',
  NOT_AVAILABLE: 'not_available',
  PLANNED: 'planned',
  FINAL: 'final',
  DRAFT: 'draft',
  EVALUATION: 'evaluation'
};

export const STATUS_LABELS = {
  [STATUS.AVAILABLE]: 'Available',
  [STATUS.PARTIAL]: 'Partial',
  [STATUS.EXPERIMENTAL]: 'Experimental',
  [STATUS.NOT_AVAILABLE]: 'Not Available',
  [STATUS.PLANNED]: 'Planned',
  [STATUS.FINAL]: 'Final',
  [STATUS.DRAFT]: 'Draft',
  [STATUS.EVALUATION]: 'Evaluation'
};

// Layer Filters
export const LAYERS = {
  ALL: 'all',
  STANDARDS: '0',
  CRYPTO_LIBRARIES: '1',
  RUNTIMES: '2',
  INFRASTRUCTURE: '3'
};

export const LAYER_LABELS = {
  [LAYERS.ALL]: 'All',
  [LAYERS.STANDARDS]: 'Standards',
  [LAYERS.CRYPTO_LIBRARIES]: 'Crypto Libraries',
  [LAYERS.RUNTIMES]: 'Runtimes',
  [LAYERS.INFRASTRUCTURE]: 'Infrastructure'
};

// Detail Field Labels
export const DETAIL_FIELDS = {
  TYPE: 'Type',
  VERSION: 'Version',
  ML_KEM_STATUS: 'ML-KEM Status',
  ML_DSA_STATUS: 'ML-DSA Status',
  DEPENDS_ON: 'Depends On',
  BLOCKED_BY: 'Blocked By',
  DESCRIPTION: 'Description',
  NOTES: 'Notes',
  SOURCES: 'Sources'
};

// UI Labels
export const UI_LABELS = {
  SHOW_LAYER: 'Show Layer:',
  STATUS: 'Status:',
  API: 'API',
  TLS: 'TLS',
  DOCUMENTATION: 'Documentation →',
  LAST_UPDATED: 'Last Updated:',
  LOADING_MESSAGE: 'Loading PQC Readiness Data...',
  ERROR_TITLE: 'Error Loading Data',
  LEGEND: 'Legend',
  ABOUT: 'About'
};

// Legend Items (with colors)
export const LEGEND_ITEMS = [
  { label: STATUS_LABELS[STATUS.AVAILABLE], color: '#10b981' },
  { label: STATUS_LABELS[STATUS.PARTIAL], color: '#f59e0b' },
  { label: STATUS_LABELS[STATUS.EXPERIMENTAL], color: '#3b82f6' },
  { label: STATUS_LABELS[STATUS.NOT_AVAILABLE], color: '#ef4444' },
  { label: STATUS_LABELS[STATUS.PLANNED], color: '#6b7280' }
];

// Layer Filters (with values and labels)
export const LAYER_FILTERS = [
  { value: LAYERS.ALL, label: LAYER_LABELS[LAYERS.ALL] },
  { value: LAYERS.STANDARDS, label: LAYER_LABELS[LAYERS.STANDARDS] },
  { value: LAYERS.CRYPTO_LIBRARIES, label: LAYER_LABELS[LAYERS.CRYPTO_LIBRARIES] },
  { value: LAYERS.RUNTIMES, label: LAYER_LABELS[LAYERS.RUNTIMES] },
  { value: LAYERS.INFRASTRUCTURE, label: LAYER_LABELS[LAYERS.INFRASTRUCTURE] }
];

// Status Filters (with values and labels)
export const STATUS_FILTERS = [
  { value: LAYERS.ALL, label: LAYER_LABELS[LAYERS.ALL] },
  { value: STATUS.AVAILABLE, label: STATUS_LABELS[STATUS.AVAILABLE] },
  { value: STATUS.PARTIAL, label: STATUS_LABELS[STATUS.PARTIAL] },
  { value: STATUS.NOT_AVAILABLE, label: STATUS_LABELS[STATUS.NOT_AVAILABLE] }
];

