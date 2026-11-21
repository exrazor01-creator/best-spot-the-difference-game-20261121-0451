// Shared canvas drawing helpers for Twin Scenes. Every scene is drawn with
// plain Canvas 2D shapes, so the whole game ships as code with no image files
// and no network request.

/** Fill a circle. */
export function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Fill an ellipse. */
export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Fill a rectangle with rounded corners. */
export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Fill a triangle from three points. */
export function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Fill a five-pointed star centred at (x, y). */
export function star(ctx, x, y, outer, inner, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** A soft puffy cloud made of overlapping circles. */
export function cloud(ctx, x, y, scale, fill) {
  circle(ctx, x, y, 18 * scale, fill);
  circle(ctx, x + 18 * scale, y + 4 * scale, 14 * scale, fill);
  circle(ctx, x - 18 * scale, y + 5 * scale, 13 * scale, fill);
  circle(ctx, x + 4 * scale, y - 9 * scale, 13 * scale, fill);
}

/** A small seagull: two arcs like a shallow "m". */
export function gull(ctx, x, y, scale, stroke) {
  ctx.beginPath();
  ctx.arc(x - 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 7 * scale, y, 7 * scale, Math.PI * 1.15, Math.PI * 1.85);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/** A simple pine tree: trunk plus three stacked triangles. */
export function pine(ctx, x, y, height, trunk, green) {
  const w = height * 0.42;
  ctx.fillStyle = trunk;
  ctx.fillRect(x - height * 0.03, y, height * 0.06, height * 0.16);
  triangle(ctx, x - w * 0.5, y - height * 0.28, x, y - height * 0.72, x + w * 0.5, y - height * 0.28, green);
  triangle(ctx, x - w * 0.62, y - height * 0.08, x, y - height * 0.55, x + w * 0.62, y - height * 0.08, green);
  triangle(ctx, x - w * 0.75, y + height * 0.12, x, y - height * 0.38, x + w * 0.75, y + height * 0.12, green);
}

/** A five-petal flower on a stem. */
export function flower(ctx, x, y, petal, centre) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x, y + 34);
  ctx.stroke();
  for (let i = 0; i < 5; i += 1) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    circle(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, petal);
  }
  circle(ctx, x, y, 5.5, centre);
}

/** A little house with a pitched roof, a door and one window. */
export function house(ctx, x, y, w, h, wall, roof, door) {
  ctx.fillStyle = wall;
  ctx.fillRect(x, y, w, h);
  triangle(ctx, x - 10, y, x + w / 2, y - h * 0.55, x + w + 10, y, roof);
  ctx.fillStyle = door;
  ctx.fillRect(x + w / 2 - 11, y + h - 34, 22, 34);
  ctx.fillStyle = '#ffd54f';
  ctx.fillRect(x + 10, y + 12, 20, 20);
}
