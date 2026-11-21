// The three scenes of Twin Scenes. Each scene draws itself twice, once per
// panel, with plain Canvas 2D shapes: `base` draws everything both panels
// share, and each difference draws its own element differently on the left
// and right panel. A difference is fair when its spot is findable by looking,
// not by guessing: every one sits on a real object with a clear centre and
// radius the game uses as its click target. Panels are 560 x 420.
import { circle, cloud, ellipse, flower, gull, house, pine, roundRect, star, triangle } from './draw.js';

const W = 560;
const H = 420;

/* ------------------------------------------------------------------ */
/* Scene 1 — Sunny Harbor (easy): big shapes, bright colours.          */
/* ------------------------------------------------------------------ */

function harborBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#7ec8f7');
  sky.addColorStop(1, '#dff3ff');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 260);
  const sea = ctx.createLinearGradient(0, 250, 0, H);
  sea.addColorStop(0, '#2fa8d8');
  sea.addColorStop(1, '#0e6ea8');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 250, W, H - 250);
  // Sun disc (its sunglasses are a difference).
  circle(ctx, 80, 70, 34, '#ffd93b');
  circle(ctx, 80, 70, 26, '#ffe98a');
  cloud(ctx, 205, 62, 1, 'rgba(255,255,255,0.95)');
  cloud(ctx, 385, 92, 0.8, 'rgba(255,255,255,0.9)');
  cloud(ctx, 480, 48, 0.65, 'rgba(255,255,255,0.85)');
  // Two gulls both panels share; the third gull is a difference.
  gull(ctx, 150, 110, 1, '#33506b');
  gull(ctx, 330, 72, 0.9, '#33506b');
  // Distant island.
  ellipse(ctx, 440, 252, 70, 14, '#7fb069');
  // Lighthouse tower (its stripes are a difference).
  ctx.fillStyle = '#f5f0e6';
  ctx.fillRect(458, 150, 26, 102);
  ctx.fillStyle = '#33415c';
  ctx.fillRect(454, 138, 34, 14);
  circle(ctx, 471, 132, 10, '#ffe066');
  // Wooden pier, bottom left.
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(0, 308, 190, 12);
  ctx.fillStyle = '#6f4520';
  ctx.fillRect(20, 320, 10, 46);
  ctx.fillRect(160, 320, 10, 46);
  // Sailboat hull and mast (its sail is a difference).
  ctx.fillStyle = '#7c4a21';
  ctx.beginPath();
  ctx.moveTo(238, 300);
  ctx.lineTo(322, 300);
  ctx.lineTo(306, 322);
  ctx.lineTo(254, 322);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(277, 196, 6, 106);
  // Palm tree trunk and fronds (its coconuts are a difference).
  ctx.strokeStyle = '#7c4a21';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(62, 308);
  ctx.quadraticCurveTo(58, 260, 66, 224);
  ctx.stroke();
  ctx.strokeStyle = '#2f9e44';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  for (const [dx, dy] of [[-26, -14], [-8, -26], [14, -24], [28, -10], [30, 6]]) {
    ctx.beginPath();
    ctx.moveTo(66, 222);
    ctx.quadraticCurveTo(66 + dx, 222 + dy, 66 + dx * 1.6, 222 + dy * 1.4);
    ctx.stroke();
  }
  // Sea sparkle.
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 2;
  for (const [x, y, len] of [[120, 360, 34], [210, 392, 44], [380, 372, 38], [470, 398, 30]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.stroke();
  }
}

const harborDifferences = [
  {
    x: 80, y: 70, r: 36, label: 'the sun wears sunglasses',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.fillStyle = '#22223b';
      roundRect(ctx, 56, 60, 20, 12, 5, '#22223b');
      roundRect(ctx, 80, 60, 20, 12, 5, '#22223b');
      ctx.fillRect(76, 64, 4, 3);
    },
  },
  {
    x: 450, y: 120, r: 22, label: 'an extra seagull',
    draw(ctx, side) {
      if (side !== 'right') return;
      gull(ctx, 450, 120, 1, '#33506b');
    },
  },
  {
    x: 280, y: 216, r: 34, label: 'the sail changes colour',
    draw(ctx, side) {
      triangle(ctx, 283, 200, 283, 296, 322, 296, side === 'left' ? '#e63946' : '#4361ee');
      triangle(ctx, 277, 210, 277, 296, 246, 296, side === 'left' ? '#f4a261' : '#4cc9f0');
    },
  },
  {
    x: 471, y: 205, r: 24, label: 'a lighthouse stripe',
    draw(ctx, side) {
      ctx.fillStyle = '#e63946';
      ctx.fillRect(458, 168, 26, 12);
      ctx.fillRect(458, 220, 26, 12);
      if (side === 'left') ctx.fillRect(458, 194, 26, 12);
    },
  },
  {
    x: 180, y: 330, r: 20, label: 'the buoy changes colour',
    draw(ctx, side) {
      circle(ctx, 180, 332, 13, side === 'left' ? '#ff7b00' : '#ffd60a');
      ctx.fillStyle = '#fff';
      ctx.fillRect(177, 312, 6, 10);
    },
  },
  {
    x: 350, y: 280, r: 22, label: 'a jumping fish',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.beginPath();
      ctx.arc(350, 292, 14, Math.PI, 0);
      ctx.fillStyle = '#ff9f1c';
      ctx.fill();
      triangle(ctx, 362, 280, 372, 274, 368, 286, '#ff9f1c');
      circle(ctx, 344, 282, 2, '#22223b');
    },
  },
  {
    x: 62, y: 216, r: 20, label: 'a coconut on the palm',
    draw(ctx, side) {
      const spots = side === 'left' ? [[56, 222], [66, 226], [72, 216]] : [[56, 222], [72, 216]];
      for (const [x, y] of spots) circle(ctx, x, y, 6, '#6f4520');
    },
  },
];

/* ------------------------------------------------------------------ */
/* Scene 2 — Moonlit Garden (medium): smaller marks, night palette.    */
/* ------------------------------------------------------------------ */

function gardenBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#1b1f3b');
  sky.addColorStop(1, '#3d348b');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 300);
  // Stars both panels share (one bright star is a difference).
  for (const [x, y, r] of [[40, 40, 2], [140, 30, 1.6], [200, 90, 2], [260, 40, 1.5], [330, 110, 2], [420, 30, 1.6], [510, 100, 2], [300, 70, 1.4], [180, 140, 1.6], [500, 170, 1.5]]) {
    circle(ctx, x, y, r, '#ffffff');
  }
  // Moon disc (its sleepy face is a difference).
  circle(ctx, 470, 70, 30, '#f4e9c8');
  circle(ctx, 470, 70, 24, '#faf3d9');
  // Garden ground and wall.
  ctx.fillStyle = '#2d6a4f';
  ctx.fillRect(0, 300, W, 120);
  ctx.fillStyle = '#6c584c';
  ctx.fillRect(0, 288, W, 16);
  // Big tree, left.
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(72, 200, 16, 100);
  circle(ctx, 80, 170, 52, '#1b4332');
  circle(ctx, 46, 196, 34, '#1b4332');
  circle(ctx, 116, 196, 34, '#1b4332');
  // Fountain: basin and column (its water arcs are a difference).
  ctx.fillStyle = '#adb5bd';
  ellipse(ctx, 280, 330, 78, 20, '#adb5bd');
  ctx.fillStyle = '#6ea8d8';
  ellipse(ctx, 280, 326, 66, 13, '#6ea8d8');
  ctx.fillStyle = '#adb5bd';
  ctx.fillRect(274, 240, 12, 86);
  circle(ctx, 280, 238, 14, '#adb5bd');
  // Flower beds.
  flower(ctx, 200, 356, '#e63946', '#ffd60a');
  flower(ctx, 240, 372, '#f4a261', '#fff');
  flower(ctx, 330, 360, '#b5179e', '#ffd60a');
  flower(ctx, 370, 376, '#4cc9f0', '#fff');
  flower(ctx, 420, 356, '#ff70a6', '#ffd60a');
  // Mushroom cluster, bottom right (one extra mushroom is a difference).
  ctx.fillStyle = '#f8edeb';
  ctx.fillRect(478, 356, 8, 16);
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.arc(482, 358, 14, Math.PI, 0);
  ctx.fill();
  // Fireflies.
  for (const [x, y] of [[160, 180], [230, 150], [350, 170], [420, 210], [500, 240]]) {
    circle(ctx, x, y, 3, '#d8f65e');
  }
  // Lantern post (its light is a difference).
  ctx.fillStyle = '#3a2e26';
  ctx.fillRect(147, 210, 6, 90);
}

const gardenDifferences = [
  {
    x: 470, y: 70, r: 32, label: 'the moon has a sleepy face',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.strokeStyle = '#8d7d5a';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(460, 66, 5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(480, 66, 5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(470, 76, 6, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    },
  },
  {
    x: 90, y: 60, r: 16, label: 'a bright star',
    draw(ctx, side) {
      if (side !== 'left') return;
      star(ctx, 90, 60, 12, 5, '#fff3b0');
    },
  },
  {
    x: 280, y: 200, r: 26, label: 'a fountain water arc',
    draw(ctx, side) {
      ctx.strokeStyle = '#90e0ef';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const arcs = side === 'left' ? [[-26, -8], [0, -16], [26, -8]] : [[-26, -8], [26, -8]];
      for (const [dx, dy] of arcs) {
        ctx.beginPath();
        ctx.arc(280 + dx, 232 + dy, 12, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }
    },
  },
  {
    x: 430, y: 282, r: 28, label: 'a cat on the wall',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.fillStyle = '#212529';
      ellipse(ctx, 430, 286, 18, 12, '#212529');
      circle(ctx, 444, 272, 9, '#212529');
      triangle(ctx, 438, 266, 440, 256, 446, 264, '#212529');
      triangle(ctx, 448, 264, 452, 256, 454, 266, '#212529');
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(414, 288);
      ctx.quadraticCurveTo(402, 280, 406, 268);
      ctx.stroke();
    },
  },
  {
    x: 200, y: 356, r: 18, label: 'a flower changes colour',
    draw(ctx, side) {
      // Redraw the one flower in the bed with its own colour per side.
      flower(ctx, 200, 356, side === 'left' ? '#e63946' : '#7b2cbf', '#ffd60a');
    },
  },
  {
    x: 150, y: 236, r: 24, label: 'the lantern is lit',
    draw(ctx, side) {
      if (side === 'left') {
        circle(ctx, 150, 236, 26, 'rgba(255, 214, 90, 0.25)');
        roundRect(ctx, 140, 222, 20, 28, 4, '#ffd60a');
        ctx.strokeStyle = '#8d6b00';
        ctx.lineWidth = 2;
        ctx.strokeRect(140, 222, 20, 28);
      } else {
        roundRect(ctx, 140, 222, 20, 28, 4, '#495057');
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 2;
        ctx.strokeRect(140, 222, 20, 28);
      }
    },
  },
  {
    x: 508, y: 362, r: 18, label: 'an extra mushroom',
    draw(ctx, side) {
      if (side !== 'right') return;
      ctx.fillStyle = '#f8edeb';
      ctx.fillRect(504, 360, 7, 14);
      ctx.fillStyle = '#ff70a6';
      ctx.beginPath();
      ctx.arc(507, 362, 11, Math.PI, 0);
      ctx.fill();
    },
  },
];

/* ------------------------------------------------------------------ */
/* Scene 3 — Cozy Cabin (hard): small marks in a busy snowy scene.     */
/* ------------------------------------------------------------------ */

function cabinBase(ctx) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#14213d');
  sky.addColorStop(1, '#415a77');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 300);
  for (const [x, y, r] of [[50, 50, 2], [130, 30, 1.6], [210, 70, 2], [330, 40, 1.5], [430, 90, 2], [510, 40, 1.6], [300, 90, 1.4], [90, 120, 1.6]]) {
    circle(ctx, x, y, r, '#ffffff');
  }
  circle(ctx, 500, 60, 24, '#f4e9c8');
  // Snow ground.
  ctx.fillStyle = '#eef4f7';
  ctx.fillRect(0, 300, W, 120);
  // Pine trees.
  pine(ctx, 90, 290, 120, '#5d3a1a', '#1b4332');
  pine(ctx, 500, 292, 100, '#5d3a1a', '#2d6a4f');
  pine(ctx, 160, 296, 70, '#5d3a1a', '#2d6a4f');
  // Cabin (its windows, wreath bow and icicle are differences).
  house(ctx, 220, 200, 130, 100, '#a9713f', '#7c2d12', '#5d3a1a');
  // Snow on the roof.
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(210, 200);
  ctx.lineTo(285, 145);
  ctx.lineTo(360, 200);
  ctx.lineTo(350, 200);
  ctx.lineTo(285, 158);
  ctx.lineTo(220, 200);
  ctx.closePath();
  ctx.fill();
  // Chimney (its smoke is a difference).
  ctx.fillStyle = '#6c584c';
  ctx.fillRect(322, 138, 22, 52);
  ctx.fillStyle = '#f8edeb';
  ctx.fillRect(318, 132, 30, 8);
  // Wreath ring on the door (its bow is a difference).
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(285, 252, 13, 0, Math.PI * 2);
  ctx.stroke();
  circle(ctx, 285, 239, 3, '#e63946');
  circle(ctx, 298, 252, 3, '#e63946');
  circle(ctx, 272, 252, 3, '#e63946');
  // Snowman body, outlined so it reads against the snow.
  ctx.strokeStyle = '#b8c9d6';
  ctx.lineWidth = 2;
  for (const [x, y, r] of [[450, 356, 26], [450, 318, 19], [450, 290, 13]]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = '#212529';
  circle(ctx, 446, 286, 2, '#212529');
  circle(ctx, 454, 286, 2, '#212529');
  ctx.fillStyle = '#e63946';
  ctx.fillRect(438, 272, 24, 6);
  ctx.fillRect(442, 262, 16, 12);
  // Sled (its gift is a difference).
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(96, 352);
  ctx.lineTo(150, 352);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(100, 352);
  ctx.quadraticCurveTo(96, 368, 108, 368);
  ctx.moveTo(146, 352);
  ctx.quadraticCurveTo(150, 368, 138, 368);
  ctx.stroke();
  // Fence.
  ctx.fillStyle = '#8b5a2b';
  for (const x of [30, 60, 190, 220, 380, 410, 520, 545]) {
    ctx.fillRect(x, 306, 6, 26);
  }
  ctx.fillRect(20, 312, 220, 4);
  ctx.fillRect(370, 312, 180, 4);
  // Footprints in the snow.
  ctx.fillStyle = '#c9d6df';
  for (const [x, y] of [[300, 340], [312, 356], [296, 372], [310, 388]]) {
    ellipse(ctx, x, y, 7, 4, '#c9d6df');
  }
}

const cabinDifferences = [
  {
    x: 333, y: 112, r: 26, label: 'a puff of chimney smoke',
    draw(ctx, side) {
      const puffs = side === 'left'
        ? [[333, 118, 10], [344, 100, 12], [330, 82, 9]]
        : [[333, 118, 10], [344, 100, 12]];
      for (const [x, y, r] of puffs) circle(ctx, x, y, r, 'rgba(220, 225, 230, 0.85)');
    },
  },
  {
    x: 240, y: 222, r: 22, label: 'a window goes dark',
    draw(ctx, side) {
      ctx.fillStyle = side === 'left' ? '#ffd54f' : '#2b3a55';
      ctx.fillRect(230, 212, 20, 20);
      ctx.strokeStyle = '#5d3a1a';
      ctx.lineWidth = 2;
      ctx.strokeRect(230, 212, 20, 20);
      ctx.beginPath();
      ctx.moveTo(240, 212);
      ctx.lineTo(240, 232);
      ctx.moveTo(230, 222);
      ctx.lineTo(250, 222);
      ctx.stroke();
      // The cabin's other window stays lit on both sides.
      ctx.fillStyle = '#ffd54f';
      ctx.fillRect(312, 212, 20, 20);
      ctx.strokeRect(312, 212, 20, 20);
      ctx.beginPath();
      ctx.moveTo(322, 212);
      ctx.lineTo(322, 232);
      ctx.moveTo(312, 222);
      ctx.lineTo(332, 222);
      ctx.stroke();
    },
  },
  {
    x: 285, y: 268, r: 20, label: 'a bow on the wreath',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.fillStyle = '#e63946';
      triangle(ctx, 285, 266, 272, 258, 272, 274, '#e63946');
      triangle(ctx, 285, 266, 298, 258, 298, 274, '#e63946');
      circle(ctx, 285, 266, 4, '#b5179e');
    },
  },
  {
    x: 456, y: 292, r: 18, label: 'the snowman loses his nose',
    draw(ctx, side) {
      if (side !== 'left') return;
      triangle(ctx, 450, 290, 468, 293, 450, 297, '#ff7b00');
    },
  },
  {
    x: 90, y: 152, r: 18, label: 'a star on the pine tree',
    draw(ctx, side) {
      if (side !== 'left') return;
      star(ctx, 90, 152, 11, 4.5, '#ffd60a');
    },
  },
  {
    x: 122, y: 340, r: 24, label: 'a gift on the sled',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.fillStyle = '#4361ee';
      ctx.fillRect(112, 326, 22, 22);
      ctx.fillStyle = '#ffd60a';
      ctx.fillRect(121, 326, 4, 22);
      ctx.fillRect(112, 335, 22, 4);
    },
  },
  {
    x: 372, y: 204, r: 16, label: 'an icicle on the roof',
    draw(ctx, side) {
      if (side !== 'left') return;
      ctx.fillStyle = '#bde0fe';
      triangle(ctx, 372, 200, 366, 200, 369, 222, '#bde0fe');
    },
  },
];

export const PANEL_WIDTH = W;
export const PANEL_HEIGHT = H;

export const SCENES = [
  {
    id: 'harbor',
    name: 'Sunny Harbor',
    tagline: 'A bright day at the pier — 7 differences hide in plain sight.',
    difficulty: 'Easy',
    timeLimit: 150,
    base: harborBase,
    differences: harborDifferences,
  },
  {
    id: 'garden',
    name: 'Moonlit Garden',
    tagline: 'Fireflies and a sleepy moon — 7 differences in the dark.',
    difficulty: 'Medium',
    timeLimit: 150,
    base: gardenBase,
    differences: gardenDifferences,
  },
  {
    id: 'cabin',
    name: 'Cozy Cabin',
    tagline: 'Snow, smoke and a snowman — 7 small differences, look close.',
    difficulty: 'Hard',
    timeLimit: 180,
    base: cabinBase,
    differences: cabinDifferences,
  },
];
