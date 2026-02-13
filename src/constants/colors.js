import { STATUS, NODE_TYPES, EDGE_TYPES, FIPS_STATUS } from './labels';

export const STATUS_COLORS = {
  [STATUS.AVAILABLE]: '#00ff88',
  [STATUS.PARTIAL]: '#ffaa00',
  [STATUS.EXPERIMENTAL]: '#6366f1',
  [STATUS.NOT_AVAILABLE]: '#ff4466',
  [STATUS.FINAL]: '#00ff88',
  [STATUS.DRAFT]: '#ffaa00',
  [STATUS.EVALUATION]: '#a855f7',
  [STATUS.RFC]: '#00ff88',
  [STATUS.PROPOSED]: '#6b7280'
};

export const LAYER_COLORS = {
  0: '#00ccff',
  1: '#00aaff',
  2: '#00ff88',
  3: '#ff88ff',
  4: '#ffaa00',
  5: '#ff6644',
  6: '#66ddff',
  7: '#ff4466',
  8: '#ffcc00'
};

export const LAYER_EMISSIVE = {
  0: '#004466',
  1: '#003366',
  2: '#004422',
  3: '#440044',
  4: '#443300',
  5: '#441100',
  6: '#224466',
  7: '#441122',
  8: '#443300'
};

export const EDGE_COLORS = {
  [EDGE_TYPES.SPECIFIES]: '#0088cc',
  [EDGE_TYPES.IMPLEMENTS]: '#00cc66',
  [EDGE_TYPES.SUPPORTS]: '#00aaff',
  [EDGE_TYPES.SHIPS]: '#cc66ff',
  [EDGE_TYPES.DEPENDS_ON]: '#555566'
};

export const LAYER_RADII = {
  0: 180,
  1: 420,
  2: 720,
  3: 1020,
  4: 1280,
  5: 1520,
  6: 1760,
  7: 2020,
  8: 2300
};

export const FIPS_COLORS = {
  [FIPS_STATUS.VALIDATED]: '#00ff88',
  [FIPS_STATUS.SUBMITTED]: '#ffaa00',
  [FIPS_STATUS.IN_PROGRESS]: '#ffaa00',
  [FIPS_STATUS.IN_TEST]: '#6366f1',
  [FIPS_STATUS.NOT_AVAILABLE]: '#ff4466'
};

export const LAYER_NODE_SIZE = {
  0: 20,
  1: 16,
  2: 14,
  3: 12,
  4: 11,
  5: 11,
  6: 10,
  7: 10,
  8: 10
};
