// Twin Scenes — Spot the Difference: the hand-in program.
//
// Node 22, standard library only. The grader runs this file twice in a
// sandbox with no network, a read-only copy of the repository and a writable
// output directory, and both runs must write the same bytes. So the program
// is deliberately boring: it copies the two hand-in folders (game/ and
// screenshots/) and writes one dossier.json from them with the vendored
// make.fun library. Nothing here depends on the clock, the environment or
// the order files happen to be read in.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Then out/ holds game/, screenshots/ and dossier.json, ready to be checked.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// The repository root is the directory this file lives in; the output
// directory is the grader's /output, or MAKEFUN_OUTPUT_DIR when run by hand.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const gameDir = join(repoRoot, 'game');
const shotsDir = join(repoRoot, 'screenshots');

function copyTree(source, destination) {
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });
}

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

// The game folder is the entry: refuse to hand in a repository without it.
if (!existsSync(join(gameDir, 'index.html'))) fail('game/index.html is missing');

// The gate wants 3 or 4 screenshots; warn loudly when the count is off so a
// broken hand-in is caught here instead of in the scorer.
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((name) => !name.startsWith('.')) : [];
if (shots.length < 3 || shots.length > 4) {
  fail(`expected 3 or 4 screenshots, found ${shots.length}`);
}

copyTree(gameDir, join(outputDir, 'game'));
copyTree(shotsDir, join(outputDir, 'screenshots'));

// The dossier caps mirror the scorer's own (reference/gate.json): only
// text_max_bytes shapes the bytes; the rest refuse an entry the scorer
// would refuse — more than 4 screenshots or one over 256 KiB, more than
// 993 files in game/ or 48 MiB of game files in all, or a path under game/
// over 1000 bytes.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`Twin Scenes handed in: ${shots.length} screenshots, dossier ${dossier.length} bytes.`);
