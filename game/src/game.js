// The game itself: state, input, timer, hints, scoring and rendering.
// Two canvases show the same scene twice; the right panel carries the
// differences. A click on either panel that lands inside an unfound
// difference's circle marks it on both panels at once.
import { PANEL_HEIGHT, PANEL_WIDTH, SCENES } from './scenes.js';
import { SoundEngine } from './audio.js';

const MARK_COLOUR = '#22c55e';
const HINT_COLOUR = '#facc15';
const WRONG_COLOUR = '#ef4444';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_LEVEL_DONE = 'level-done';
export const SCREEN_ALL_DONE = 'all-done';
export const SCREEN_TIME_UP = 'time-up';

export class TwinScenesGame {
  constructor(leftCanvas, rightCanvas, hud) {
    this.left = leftCanvas;
    this.right = rightCanvas;
    this.hud = hud;
    this.sound = new SoundEngine();
    this.screen = SCREEN_TITLE;
    this.sceneIndex = 0;
    this.found = new Set();
    this.marks = [];
    this.wrongMarks = [];
    this.hint = null;
    this.hintsLeft = 3;
    this.timeLeft = 0;
    this.score = 0;
    this.levelScore = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.stars = 0;
    this.frozen = false;
    this.lastTick = 0;
    this.onChange = null;
    this.levelScores = [0, 0, 0];

    for (const canvas of [this.left, this.right]) {
      canvas.width = PANEL_WIDTH;
      canvas.height = PANEL_HEIGHT;
    }
    this.left.addEventListener('pointerdown', (event) => this.handleClick(event, this.left));
    this.right.addEventListener('pointerdown', (event) => this.handleClick(event, this.right));
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  get scene() {
    return SCENES[this.sceneIndex];
  }

  get foundCount() {
    return this.found.size;
  }

  get totalDifferences() {
    return this.scene.differences.length;
  }

  /** Start a scene fresh. `preset` lets screenshots stage a mid-game frame. */
  startLevel(index, preset = null) {
    this.sceneIndex = index;
    this.found = new Set(preset?.found ?? []);
    this.marks = [];
    this.wrongMarks = [];
    this.hint = null;
    this.hintsLeft = preset?.hintsLeft ?? 3;
    this.timeLeft = preset?.timeLeft ?? this.scene.timeLimit;
    this.levelScore = preset?.levelScore ?? 0;
    this.combo = 0;
    this.frozen = preset?.frozen ?? false;
    this.screen = SCREEN_PLAY;
    this.lastTick = performance.now();
    for (const i of this.found) this.marks.push({ index: i, born: 0, staged: true });
    this.announce();
  }

  backToTitle() {
    this.screen = SCREEN_TITLE;
    this.announce();
  }

  /** Convert a pointer event on a canvas into panel coordinates. */
  panelPoint(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * PANEL_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * PANEL_HEIGHT,
    };
  }

  handleClick(event, canvas) {
    this.sound.unlock();
    if (this.screen !== SCREEN_PLAY || this.frozen) return;
    const point = this.panelPoint(event, canvas);
    const diffs = this.scene.differences;
    for (let i = 0; i < diffs.length; i += 1) {
      if (this.found.has(i)) continue;
      const d = diffs[i];
      const dx = point.x - d.x;
      const dy = point.y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        this.found.add(i);
        this.combo += 1;
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        const points = 100 + (this.combo - 1) * 25;
        this.levelScore += points;
        this.marks.push({ index: i, born: performance.now(), staged: false });
        this.sound.playFound();
        if (this.found.size === diffs.length) this.finishLevel();
        this.announce();
        return;
      }
    }
    // A miss: a red cross, the combo breaks, five seconds come off the clock.
    this.combo = 0;
    this.timeLeft = Math.max(0, this.timeLeft - 5);
    this.wrongMarks.push({ x: point.x, y: point.y, born: performance.now() });
    this.sound.playWrong();
    this.announce();
  }

  /** Spend one hint: pulse a ring around a random difference still hidden. */
  useHint() {
    if (this.screen !== SCREEN_PLAY || this.frozen) return false;
    if (this.hintsLeft <= 0) return false;
    const remaining = this.scene.differences.map((d, i) => i).filter((i) => !this.found.has(i));
    if (remaining.length === 0) return false;
    this.hintsLeft -= 1;
    this.levelScore = Math.max(0, this.levelScore - 50);
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hint = { index: pick, born: performance.now() };
    this.sound.unlock();
    this.sound.playHint();
    this.announce();
    return true;
  }

  finishLevel() {
    const timeBonus = Math.round(this.timeLeft) * 5;
    this.levelScore += timeBonus;
    this.levelScores[this.sceneIndex] = this.levelScore;
    this.score = this.levelScores.reduce((a, b) => a + b, 0);
    this.stars = this.timeLeft >= 60 && this.hintsLeft >= 2 ? 3 : this.timeLeft >= 20 ? 2 : 1;
    this.screen = this.sceneIndex === SCENES.length - 1 ? SCREEN_ALL_DONE : SCREEN_LEVEL_DONE;
    this.sound.playWin();
    const best = Number(localStorage.getItem('twin-scenes-best') ?? 0);
    if (this.screen === SCREEN_ALL_DONE && this.score > best) {
      localStorage.setItem('twin-scenes-best', String(this.score));
    }
    this.announce();
  }

  timeUp() {
    this.screen = SCREEN_TIME_UP;
    this.sound.playWrong();
    this.announce();
  }

  announce() {
    if (this.onChange) this.onChange();
  }

  formatTime(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  loop(now) {
    const dt = Math.min(0.1, (now - this.lastTick) / 1000);
    this.lastTick = now;
    if (this.screen === SCREEN_PLAY && !this.frozen) {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.timeUp();
      }
      if (this.hint && now - this.hint.born > 2600) this.hint = null;
    }
    this.wrongMarks = this.wrongMarks.filter((m) => now - m.born < 900);
    this.render(now);
    if (this.hud) this.hud(now);
    requestAnimationFrame(this.loop);
  }

  drawScene(ctx, side) {
    const scene = this.scene;
    scene.base(ctx);
    for (const diff of scene.differences) diff.draw(ctx, side);
  }

  drawMarks(ctx, now) {
    for (const mark of this.marks) {
      const d = this.scene.differences[mark.index];
      const age = mark.staged ? 1 : Math.min(1, (now - mark.born) / 250);
      const r = d.r * (0.7 + 0.3 * age);
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = MARK_COLOUR;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(d.x, d.y, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Check mark.
      ctx.strokeStyle = MARK_COLOUR;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x - 8, d.y);
      ctx.lineTo(d.x - 2, d.y + 7);
      ctx.lineTo(d.x + 9, d.y - 7);
      ctx.stroke();
    }
    for (const mark of this.wrongMarks) {
      const age = (now - mark.born) / 900;
      ctx.globalAlpha = 1 - age;
      ctx.strokeStyle = WRONG_COLOUR;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const s = 10;
      ctx.beginPath();
      ctx.moveTo(mark.x - s, mark.y - s);
      ctx.lineTo(mark.x + s, mark.y + s);
      ctx.moveTo(mark.x + s, mark.y - s);
      ctx.lineTo(mark.x - s, mark.y + s);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (this.hint) {
      const d = this.scene.differences[this.hint.index];
      const pulse = 1 + 0.12 * Math.sin((now - this.hint.born) / 130);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse + 6, 0, Math.PI * 2);
      ctx.strokeStyle = HINT_COLOUR;
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  render(now) {
    const leftCtx = this.left.getContext('2d');
    const rightCtx = this.right.getContext('2d');
    this.drawScene(leftCtx, 'left');
    this.drawScene(rightCtx, 'right');
    if (this.screen !== SCREEN_TITLE) {
      this.drawMarks(leftCtx, now);
      this.drawMarks(rightCtx, now);
    }
  }
}
