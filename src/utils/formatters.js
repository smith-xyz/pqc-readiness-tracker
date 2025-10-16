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
  const hasDsaApi = node.status.ml_dsa_api === STATUS.AVAILABLE;

  const kemProtocols = node.status.ml_kem_protocols ? 
    Object.entries(node.status.ml_kem_protocols)
      .filter(([_, status]) => status === STATUS.AVAILABLE)
      .map(([protocol, _]) => protocol.toUpperCase()) : [];

  const dsaProtocols = node.status.ml_dsa_protocols ? 
    Object.entries(node.status.ml_dsa_protocols)
      .filter(([_, status]) => status === STATUS.AVAILABLE)
      .map(([protocol, _]) => protocol.toUpperCase()) : [];

  let statusText = STATUS_LABELS[overallStatus];
  
  if (overallStatus === STATUS.PARTIAL) {
    const available = [];
    if (kemProtocols.length > 0) available.push(`ML-KEM (${kemProtocols.join(', ')})`);
    else if (hasKemApi) available.push('ML-KEM API');
    if (dsaProtocols.length > 0) available.push(`ML-DSA (${dsaProtocols.join(', ')})`);
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

