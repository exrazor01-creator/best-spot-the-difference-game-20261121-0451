// Screenshot scenes for ?shot=<name>. Each one stages a real game state — a
// level in progress with some differences already circled and some still
// hidden, or a finished level — then freezes the clock so the frame is the
// same every time it is taken. Nothing here edits the game: it only plays it
// forward to a chosen moment.
import { SCREEN_LEVEL_DONE } from './game.js';
import { SCENES } from './scenes.js';

/**
 * Stage the named shot on `game` and return true, or false for an unknown name.
 * The caller sets window.__shotReady once the frame has rendered.
 */
export function stageShot(name, game) {
  if (name === 'cover') {
    // Sunny Harbor, three differences found, four still to hunt.
    game.startLevel(0, { found: [0, 2, 4], timeLeft: 107, hintsLeft: 3, frozen: true });
    return true;
  }
  if (name === 'garden') {
    // Moonlit Garden, two found, five still hidden.
    game.startLevel(1, { found: [1, 5], timeLeft: 118, hintsLeft: 2, frozen: true });
    return true;
  }
  if (name === 'cabin') {
    // Cozy Cabin, five found, two still hidden, the clock nearly out.
    game.startLevel(2, { found: [0, 1, 3, 4, 6], timeLeft: 41, hintsLeft: 1, frozen: true });
    return true;
  }
  if (name === 'win') {
    // Sunny Harbor cleared with three stars and a time bonus.
    game.startLevel(0, { found: [0, 1, 2, 3, 4, 5, 6], timeLeft: 95, hintsLeft: 3, frozen: true });
    game.finishLevel();
    return true;
  }
  return false;
}

/** The shots the entry ships, in the order screenshots/ lists them. */
export const SHOTS = [
  { name: '1-cover.jpg', query: '?shot=cover' },
  { name: '2-garden.jpg', query: '?shot=garden' },
  { name: '3-cabin.jpg', query: '?shot=cabin' },
  { name: '4-win.jpg', query: '?shot=win' },
];

export { SCENES, SCREEN_LEVEL_DONE };
