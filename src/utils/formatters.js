import { NODE_TYPE_LABELS, STATUS_LABELS, EDGE_TYPE_LABELS, APPROACH_LABELS } from '../constants/labels';

export function formatType(type) {
  return NODE_TYPE_LABELS[type] || type;
}

export function formatStatus(status) {
  return STATUS_LABELS[status] || status;
}

export function formatEdgeType(type) {
  return EDGE_TYPE_LABELS[type] || type;
}

export function formatApproach(approach) {
  return APPROACH_LABELS[approach] || approach;
}

export function getNodeStatusDisplay(node) {
  return {
    statusClass: node.status,
    statusText: STATUS_LABELS[node.status] || node.status
  };
}
