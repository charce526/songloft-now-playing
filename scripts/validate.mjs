import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const pkg = 'dist/songloft-now-playing.jsplugin.zip';
if (!existsSync(pkg)) throw Error('missing build');

const files = execFileSync('unzip', ['-Z1', pkg], { encoding: 'utf8' });
for (const file of ['plugin.json', 'main.js', 'static/index.html', 'static/app.js', 'static/icon.svg', 'static/visualizer.css']) {
  if (!files.includes(file)) throw Error(`missing ${file}`);
}

const html = execFileSync('unzip', ['-p', pkg, 'static/index.html'], { encoding: 'utf8' });
for (const marker of ['style.css?v=1.0.29', 'readability.css?v=1.0.29', 'visualizer.css?v=1.0.29', 'three.min.js?v=1.0.29', 'app.js?v=1.0.29']) {
  if (!html.includes(marker)) throw Error(`missing 1.0.29 cache key ${marker}`);
}

const app = execFileSync('unzip', ['-p', pkg, 'static/app.js'], { encoding: 'utf8' });
for (const marker of ['randomCardLimit(){return 50;}', 'randomCardLimit()-1', 'randomSlotsBySong', 'reconcileQueue', 'nearestLoopFocus', 'randomStage', 'optimisticPlaying=nextPlaying', 'optimisticSong=id', 'flipTarget=nextPlaying?0:1', 'new THREE.Euler', 'c.scatterRot.clone()', 'function toggleCurrent()', 'function statePlaying', 'resetRandomPose', 'nextMode=', 'tapDistance', 'hitCard', 'cardBoundsHit', 'focus=targetFocus=selected', 'visible=isMobile?a<3.5:a<6', 'dragBase=isMobile?165:185', 'displayPlaying', 'trackIndexes(queueSongs.length,center)', 'stateQueue(state)', 'playerId(card.song)', 'randomSlots', 'trackLayout', 'mobileScale', 'candidates.sort', 'wheel', 'volume-slider', 'setVolume', 'keydown', 'setPlayMode', 'onStateChange', '--visualizer-rgb', 'toggleQueued', 'toastTimer', 'parseLrc', 'lyricSongId', 'posAnchor', 'lyricEnabled', 'lyric-toggle', 'burstHearts', 'stepHearts', 'count=24', 'posAnchor&&playing&&time-posAnchor.t>10000']) {
  if (!app.includes(marker)) throw Error(`missing release marker ${marker}`);
}
if (app.includes('scatterRot:new THREE.Vector3') || app.includes(':c.scatterRot;')) throw Error('random rotation must remain an immutable Euler source');
if (app.includes('centralTap')) throw Error('oversized center click fallback must not return');
if (html.includes('🔊') || !html.includes('speaker-icon')) throw Error('volume icon is not release-ready');

const manifest = JSON.parse(execFileSync('unzip', ['-p', pkg, 'plugin.json'], { encoding: 'utf8' }));
if (manifest.version !== '1.0.29') throw Error('invalid release version');
if (manifest.entryPath !== 'songloft-now-playing') throw Error('invalid entryPath');
if (manifest.description !== '沉浸式3D专辑卡片播放扩展，用3D卡片的方式显示正在播放的歌曲和歌单。') throw Error('invalid description');
if (!manifest.entryHash || !manifest.zipHash) throw Error('missing release hashes');

const main = execFileSync('unzip', ['-p', pkg, 'main.js'], { encoding: 'utf8' });
if (!main.includes('songloft-now-playing 1.0.29 initialized')) throw Error('stale main entry identity');

console.log('songloft-now-playing 1.0.29 package identity, description, cache keys, hashes, structure, and runtime markers are valid.');
