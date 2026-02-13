import * as THREE from 'three';
import { STATUS_COLORS, LAYER_COLORS, LAYER_EMISSIVE, LAYER_NODE_SIZE, LAYER_RADII } from '../constants/colors';

export function createNodeObject(node) {
  const group = new THREE.Group();
  const size = LAYER_NODE_SIZE[node.layer] || 4;
  const color = getNodeColor(node);
  const emissive = LAYER_EMISSIVE[node.layer] || '#111111';

  const geometry = new THREE.SphereGeometry(size, 24, 24);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.85
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  const glowSize = size * 1.6;
  const glowGeometry = new THREE.SphereGeometry(glowSize, 16, 16);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.04,
    side: THREE.BackSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  group.add(glow);

  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(size * 4, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  group.add(hitArea);

  const label = createLeaderLabel(node.name, color, size);
  label.position.set(0, size * 2.4, 0);
  group.add(label);

  group.userData = { nodeId: node.id, baseColor: color, emissive, size };
  return group;
}

function getNodeColor(node) {
  const statusColor = STATUS_COLORS[node.status];
  if (statusColor) return statusColor;
  return LAYER_COLORS[node.layer] || '#aaaaaa';
}

function createLeaderLabel(text, color, nodeSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const fontSize = 48;
  const fontStr = `500 ${fontSize}px "JetBrains Mono", "SF Mono", "Fira Code", monospace`;

  ctx.font = fontStr;
  const textWidth = ctx.measureText(text).width;

  const pad = 14;
  const diagLen = 180;
  const lineGap = 6;
  const dotR = 4;

  canvas.width = Math.max(diagLen + textWidth + pad * 3, 300);
  canvas.height = diagLen + fontSize + lineGap + pad * 2;

  ctx.font = fontStr;

  const anchorX = dotR + 2;
  const anchorY = canvas.height - dotR - 2;
  const elbowX = diagLen;
  const elbowY = canvas.height - diagLen;
  const lineEndX = canvas.width - pad;
  const textX = elbowX + pad;
  const textY = elbowY - lineGap;

  const lineColor = '#5a6578';
  const textColor = '#c8d0de';

  ctx.fillStyle = lineColor;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(anchorX, anchorY, dotR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = lineColor;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(anchorX, anchorY);
  ctx.lineTo(elbowX, elbowY);
  ctx.lineTo(lineEndX, elbowY);
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.globalAlpha = 0.9;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText(text, textX, textY);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.center.set(0, 0);

  const scale = Math.max(nodeSize * 14, 80);
  sprite.scale.set(scale, scale * (canvas.height / canvas.width), 1);

  return sprite;
}

export function createOrbitalRings() {
  const group = new THREE.Group();
  const layerKeys = Object.keys(LAYER_RADII).map(Number).sort((a, b) => a - b);
  const segments = 128;

  for (const layer of layerKeys) {
    const radius = LAYER_RADII[layer];
    const color = LAYER_COLORS[layer];
    const points = [];
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.08
    });

    group.add(new THREE.Line(geometry, material));
  }

  return group;
}

export function highlightNode(nodeObj, isHighlighted) {
  if (!nodeObj || !nodeObj.children) return;
  const sphere = nodeObj.children[0];
  const glow = nodeObj.children[1];
  if (!sphere || !glow) return;

  if (isHighlighted) {
    sphere.material.opacity = 1;
    glow.material.opacity = 0.12;
  } else {
    sphere.material.opacity = 0.85;
    glow.material.opacity = 0.04;
  }
}

export function dimNode(nodeObj, isDimmed) {
  if (!nodeObj || !nodeObj.children) return;
  const sphere = nodeObj.children[0];
  const glow = nodeObj.children[1];
  const label = nodeObj.children[3];

  if (isDimmed) {
    sphere.material.opacity = 0.12;
    glow.material.opacity = 0.01;
    if (label) label.material.opacity = 0.1;
  } else {
    sphere.material.opacity = 0.85;
    glow.material.opacity = 0.04;
    if (label) label.material.opacity = 1;
  }
}

export function createSun() {
  const group = new THREE.Group();

  const coreGeo = new THREE.SphereGeometry(20, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff8e7'),
    transparent: true,
    opacity: 1.0
  });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  const innerGlowGeo = new THREE.SphereGeometry(30, 32, 32);
  const innerGlowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ffcc66'),
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });
  group.add(new THREE.Mesh(innerGlowGeo, innerGlowMat));

  const outerGlowGeo = new THREE.SphereGeometry(50, 32, 32);
  const outerGlowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ff8822'),
    transparent: true,
    opacity: 0.05,
    side: THREE.BackSide
  });
  group.add(new THREE.Mesh(outerGlowGeo, outerGlowMat));

  const label = createSunLabel('PQC Initiative');
  label.position.set(0, 38, 0);
  group.add(label);

  return group;
}

function createSunLabel(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const fontSize = 44;
  const fontStr = `300 ${fontSize}px "Inter", -apple-system, sans-serif`;

  ctx.font = fontStr;
  const textWidth = ctx.measureText(text).width;

  canvas.width = textWidth + 40;
  canvas.height = fontSize + 16;

  ctx.font = fontStr;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#d4c8a0';
  ctx.globalAlpha = 0.7;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(50, 50 * (canvas.height / canvas.width), 1);

  return sprite;
}

export function createStarField(count = 2000) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = 2000 + Math.random() * 6000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    const brightness = 0.3 + Math.random() * 0.7;
    const blueShift = Math.random() > 0.7 ? 0.2 : 0;
    colors[i3] = brightness - blueShift * 0.1;
    colors[i3 + 1] = brightness - blueShift * 0.05;
    colors[i3 + 2] = brightness + blueShift;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  return new THREE.Points(geometry, material);
}
