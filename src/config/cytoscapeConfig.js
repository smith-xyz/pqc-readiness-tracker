import { getNodeStatus } from '../utils/graphUtils';
import { COLORS, UI_COLORS } from '../constants/colors';
import { STATUS } from '../constants/labels';
import dagre from 'cytoscape-dagre';

export const cytoscapeStyles = [
  {
    selector: 'node',
    style: {
      'background-color': node => COLORS[getNodeStatus(node.data())],
      'label': 'data(label)',
      'color': UI_COLORS.TEXT,
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '12px',
      'font-weight': 'bold',
      'text-outline-width': 2,
      'text-outline-color': '#0f172a',
      'width': 80,
      'height': 80,
      'border-width': 2,
      'border-color': UI_COLORS.BORDER,
      'cursor': 'pointer'
    }
  },
  {
    selector: 'node:hover',
    style: {
      'border-width': 3,
      'border-color': UI_COLORS.BORDER_HOVER
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 2,
      'line-color': UI_COLORS.EDGE,
      'target-arrow-color': UI_COLORS.EDGE,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'arrow-scale': 1.5
    }
  },
  {
    selector: 'edge[type="blocks_on"]',
    style: {
      'line-color': COLORS[STATUS.NOT_AVAILABLE],
      'target-arrow-color': COLORS[STATUS.NOT_AVAILABLE],
      'line-style': 'dashed'
    }
  },
  {
    selector: '.highlighted',
    style: {
      'border-width': 4,
      'border-color': UI_COLORS.HIGHLIGHT,
      'z-index': 999
    }
  },
  {
    selector: '.path-edge',
    style: {
      'width': 4,
      'line-color': UI_COLORS.HIGHLIGHT,
      'target-arrow-color': UI_COLORS.HIGHLIGHT
    }
  },
  {
    selector: '.expanded-app',
    style: {
      'width': 60,
      'height': 60,
      'background-color': '#3a3f4b',
      'border-width': 2,
      'border-color': '#8b5cf6',
      'font-size': '10px',
      'text-wrap': 'wrap',
      'text-max-width': 55,
      'opacity': 0,
      'cursor': 'default'
    }
  },
  {
    selector: '.expanded-app:hover',
    style: {
      'border-width': 3,
      'border-color': '#a78bfa'
    }
  },
  {
    selector: '.expanded-edge',
    style: {
      'width': 1.5,
      'line-color': '#6366f1',
      'target-arrow-color': '#6366f1',
      'line-style': 'dashed',
      'opacity': 0.7
    }
  },
  {
    selector: 'node[type="runtime"].expanded',
    style: {
      'border-width': 4,
      'border-color': '#8b5cf6',
      'box-shadow': '0 0 20px #8b5cf6'
    }
  }
];

export const cytoscapeExtensions = [dagre];

export const cytoscapeLayout = {
  name: 'dagre',
  rankDir: 'TB',
  nodeSep: 100,
  edgeSep: 50,
  rankSep: 150,
  padding: 50,
  animate: false
};

