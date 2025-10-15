import { NODE_TYPES, NODE_TYPE_LABELS, STATUS, STATUS_LABELS } from '../constants/labels';
import { getNodeStatus } from './graphUtils';

export function formatType(type) {
  return NODE_TYPE_LABELS[type] || type;
}

export function formatStatus(status) {
  return STATUS_LABELS[status] || status;
}

export function getNodeStatusDisplay(node) {
  const overallStatus = getNodeStatus(node);
  
  if (node.type === NODE_TYPES.STANDARD) {
    const isFinal = node.status.specification === STATUS.FINAL;
    return {
      statusClass: overallStatus,
      statusText: STATUS_LABELS[isFinal ? STATUS.FINAL : STATUS.DRAFT]
    };
  }

  const hasKemApi = node.status.ml_kem_api === STATUS.AVAILABLE;
  const hasKemTls = node.status.ml_kem_tls === STATUS.AVAILABLE;
  const hasDsaApi = node.status.ml_dsa_api === STATUS.AVAILABLE;
  const hasDsaTls = node.status.ml_dsa_tls === STATUS.AVAILABLE;

  let statusText = STATUS_LABELS[overallStatus];
  
  if (overallStatus === STATUS.PARTIAL) {
    const available = [];
    if (hasKemTls) available.push('ML-KEM TLS');
    else if (hasKemApi) available.push('ML-KEM API');
    if (hasDsaTls) available.push('ML-DSA TLS');
    else if (hasDsaApi) available.push('ML-DSA API');
    
    if (available.length > 0) {
      statusText = `${STATUS_LABELS[STATUS.PARTIAL]} (${available.join(', ')})`;
    }
  }

  return {
    statusClass: overallStatus,
    statusText: statusText
  };
}

