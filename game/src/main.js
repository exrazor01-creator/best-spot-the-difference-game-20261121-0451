// Entry point: wire the canvases, the HUD and the overlays to the game, and
// stage a screenshot scene when the page opens with ?shot=<name>.
import { SCREEN_ALL_DONE, SCREEN_LEVEL_DONE, SCREEN_PLAY, SCREEN_TIME_UP, SCREEN_TITLE, TwinScenesGame } from './game.js';
import { SCENES } from './scenes.js';
import { stageShot } from './shots.js';

const $ = (id) => document.getElementById(id);

const game = new TwinScenesGame($('panel-left'), $('panel-right'), syncHud);
const statusEl = $('status');

function showOverlay(id) {
  for (const overlay of document.querySelectorAll('.overlay')) overlay.classList.add('hidden');
  if (id) $(id).classList.remove('hidden');
}

function syncHud() {
  const scene = game.scene;
  $('hud-scene').textContent = scene.name;
  $('hud-found').textContent = `${game.foundCount} / ${game.totalDifferences}`;
  const timeEl = $('hud-time');
  timeEl.textContent = game.formatTime(game.timeLeft);
  timeEl.classList.toggle('low', game.screen === SCREEN_PLAY && game.timeLeft <= 30);
  $('hud-score').textContent = String(game.score + (game.screen === SCREEN_PLAY ? game.levelScore : 0));
  $('hud-hints').textContent = String(game.hintsLeft);
  $('btn-hint').disabled = game.screen !== SCREEN_PLAY || game.hintsLeft <= 0;

  if (game.screen === SCREEN_TITLE) {
    showOverlay('overlay-title');
    statusEl.textContent = 'Twin Scenes. Choose a scene and start the hunt.';
  } else if (game.screen === SCREEN_LEVEL_DONE) {
    $('done-title').textContent = `${scene.name} cleared!`;
    $('done-stars').textContent = '★'.repeat(game.stars) + '☆'.repeat(3 - game.stars);
    $('done-detail').textContent =
      `You found all ${game.totalDifferences} differences with ${game.formatTime(game.timeLeft)} to spare — ` +
      `scene score ${game.levelScore}, total ${game.score}.`;
    showOverlay('overlay-level-done');
    statusEl.textContent = `${scene.name} cleared with ${game.stars} stars.`;
  } else if (game.screen === SCREEN_ALL_DONE) {
    $('final-detail').textContent =
      `You found all 21 differences across three scenes. Total score: ${game.score}.`;
    const best = Number(localStorage.getItem('twin-scenes-best') ?? 0);
    $('final-best').textContent = best > 0 ? `Best score on this browser: ${best}.` : '';
    showOverlay('overlay-all-done');
    statusEl.textContent = `All scenes cleared. Total score ${game.score}.`;
  } else if (game.screen === SCREEN_TIME_UP) {
    $('timeup-detail').textContent =
      `You found ${game.foundCount} of ${game.totalDifferences} differences in ${scene.name}.`;
    showOverlay('overlay-time-up');
    statusEl.textContent = 'Out of time.';
  } else {
    showOverlay(null);
    statusEl.textContent =
      `${scene.name}: ${game.foundCount} of ${game.totalDifferences} found, ` +
      `${game.formatTime(game.timeLeft)} left.`;
  }
}

game.onChange = syncHud;

$('btn-hint').addEventListener('click', () => {
  game.sound.unlock();
  if (game.useHint()) syncHud();
});
$('btn-sound').addEventListener('click', (event) => {
  game.sound.unlock();
  game.sound.muted = !game.sound.muted;
  event.currentTarget.textContent = game.sound.muted ? '🔇 Muted' : '🔊 Sound';
  game.sound.playClick();
});
$('btn-restart').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.startLevel(game.sceneIndex);
});
$('btn-play').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.startLevel(0);
});
$('btn-next').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.startLevel(Math.min(SCENES.length - 1, game.sceneIndex + 1));
});
$('btn-replay').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.startLevel(game.sceneIndex);
});
$('btn-again').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.levelScores = [0, 0, 0];
  game.score = 0;
  game.startLevel(0);
});
$('btn-retry').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.startLevel(game.sceneIndex);
});
$('btn-menu').addEventListener('click', () => {
  game.sound.unlock();
  game.sound.playClick();
  game.backToTitle();
});
for (const button of document.querySelectorAll('[data-scene]')) {
  button.addEventListener('click', () => {
    game.sound.unlock();
    game.sound.playClick();
    game.startLevel(Number(button.dataset.scene));
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') {
    if (game.useHint()) syncHud();
  } else if (event.key === 'm' || event.key === 'M') {
    $('btn-sound').click();
  } else if (event.key === 'r' || event.key === 'R') {
    if (game.screen === SCREEN_PLAY) game.startLevel(game.sceneIndex);
  } else if (event.key === 'Escape') {
    game.backToTitle();
  } else if (event.key >= '1' && event.key <= '3') {
    game.startLevel(Number(event.key) - 1);
  }
});

// A screenshot scene freezes the clock and stages a mid-game frame.
const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  if (stageShot(shot, game)) {
    syncHud();
    // Let one frame render before the screenshot tool reads the flag.
    requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  }
} else {
  syncHud();
  window.__shotReady = true;
}
