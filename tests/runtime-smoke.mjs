import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

class Element {
  constructor(id = '') {
    this.id = id;
    this.children = [];
    this.listeners = new Map();
    this.hidden = false;
    this.textContent = '';
    this.value = '';
    this.clientWidth = 1440;
    this.clientHeight = 900;
    this.style = { setProperty() {} };
    this.classList = { toggle() {} };
  }
  appendChild(child) { this.children.push(child); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  querySelector(selector) {
    if (!this.parts) this.parts = { span: new Element(), small: new Element() };
    return this.parts[selector.slice(0, 5) === 'small' ? 'small' : 'span'];
  }
  matches() { return false; }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight }; }
  setPointerCapture() {}
  releasePointerCapture() {}
  getContext() {
    return {
      fillStyle: '', strokeStyle: '', lineWidth: 1, font: '', textAlign: '', globalAlpha: 1,
      fillRect() {}, beginPath() {}, arc() {}, stroke() {}, fill() {}, fillText() {}, drawImage() {},
      getImageData() { return { data: new Uint8ClampedArray(36 * 36 * 4) }; },
      createLinearGradient() { return { addColorStop() {} }; },
    };
  }
}

class Renderer {
  constructor() { this.outputEncoding = 0; }
  setPixelRatio() {}
  setSize() {}
  render() {}
}

class TextureLoader {
  setCrossOrigin() {}
  load(_url, _success, _progress, failure) { failure?.(); }
}

const elements = new Map();
const getElement = selector => {
  if (!elements.has(selector)) elements.set(selector, new Element(selector));
  return elements.get(selector);
};
const documentElement = new Element('html');
documentElement.dataset = {};
const document = {
  documentElement,
  activeElement: null,
  querySelector: getElement,
  createElement: () => new Element(),
};

const songs = Array.from({ length: 1000 }, (_, index) => ({ id: index + 1, title: `Song ${index + 1}`, artist: 'Runtime Test' }));
const state = { queue: songs.slice(0, 12), current_index: 0, current_song: songs[0], is_playing: true, play_mode: 'loop', volume: 70 };
const stateListeners = [];
const emit = () => stateListeners.forEach(listener => listener(structuredClone(state)));
let toggles = 0;
const player = {
  getState: async () => structuredClone(state),
  onStateChange: listener => stateListeners.push(listener),
  togglePlay: async () => { toggles += 1; state.is_playing = !state.is_playing; emit(); },
  next: async () => { state.current_index = (state.current_index + 1) % state.queue.length; state.current_song = state.queue[state.current_index]; state.is_playing = true; emit(); },
  prev: async () => {},
  play: async id => { state.current_index = songs.findIndex(song => song.id === id); state.current_song = songs[state.current_index]; emit(); },
  setPlayMode: async mode => { state.play_mode = mode; emit(); },
  setVolume: async () => {},
};

const windowListeners = new Map();
const localStorage = new Map();
const context = vm.createContext({
  console,
  document,
  location: { search: '', origin: 'http://localhost' },
  localStorage: { getItem: key => localStorage.get(key) ?? null, setItem: (key, value) => localStorage.set(key, value) },
  SongloftPlugin: undefined,
  URL,
  URLSearchParams,
  structuredClone,
  Uint8ClampedArray,
  Math,
  Date,
  Promise,
  setTimeout,
  clearTimeout,
  performance,
  devicePixelRatio: 1,
  requestAnimationFrame() {},
  fetch: async () => ({ ok: true, text: async () => JSON.stringify({ items: [] }) }),
});
context.window = context;
context.parent = context;
context.addEventListener = (type, listener) => windowListeners.set(type, listener);
context.SongloftPlugin = { getTheme: () => 'dark', player };

const threeSource = await readFile(new URL('../static/vendor/three.min.js', import.meta.url), 'utf8');
vm.runInContext(threeSource, context);
context.THREE.WebGLRenderer = Renderer;
context.THREE.TextureLoader = TextureLoader;
const source = await readFile(new URL('../static/app.js', import.meta.url), 'utf8');
vm.runInContext(`${source}\nglobalThis.__deckTest={cards:()=>cards,current:()=>current,mode:()=>playMode,playing:()=>displayPlaying(),render,cycleMode,toggleCurrent,cardBoundsHit};`, context);
await new Promise(resolve => setTimeout(resolve, 0));
await new Promise(resolve => setTimeout(resolve, 0));

const deck = context.__deckTest;
assert.equal(deck.mode(), 'loop');
assert.equal(deck.current(), 0);
assert.ok(deck.cards().filter(Boolean).length >= 10);

await deck.cycleMode();
assert.equal(deck.mode(), 'random');
for (const card of deck.cards().filter(Boolean).filter(card => card.index !== deck.current())) {
  assert.ok(Math.abs(card.scatterRot.y) < 0.08);
  assert.ok(Math.abs(card.mesh.rotation.y - card.scatterRot.y) < 0.001, `card ${card.index}: mesh=${card.mesh.rotation.y}, scatter=${card.scatterRot.y}`);
}

const stableCards = new Map(deck.cards().filter(Boolean).map(card => [card.song.id, {
  card,
  scatter: [card.scatter.x, card.scatter.y, card.scatter.z],
}]));
for (const size of [40, 120, 500, 1000]) {
  state.queue = songs.slice(0, size);
  state.current_song = state.queue[state.current_index];
  emit();
  const visible = deck.cards().filter(Boolean);
  assert.ok(visible.length <= 50, `random card limit exceeded at queue size ${size}: ${visible.length}`);
  for (const [id, snapshot] of stableCards) {
    const card = visible.find(item => item.song.id === id);
    assert.equal(card, snapshot.card, `song ${id} card object was rebuilt at queue size ${size}`);
    assert.deepEqual([card.scatter.x, card.scatter.y, card.scatter.z], snapshot.scatter, `song ${id} moved at queue size ${size}`);
  }
}
assert.equal(deck.cards().filter(Boolean).length, 50);
assert.equal(deck.cardBoundsHit({ clientX: 720, clientY: 441 }, deck.cards()[deck.current()]), true);
assert.equal(deck.cardBoundsHit({ clientX: 380, clientY: 441 }, deck.cards()[deck.current()]), false);

await deck.toggleCurrent();
for (let frame = 0; frame < 30; frame += 1) deck.render(frame * 16);
assert.equal(deck.cards()[0].flipTarget, 1);
assert.ok(deck.cards()[0].flip > 0.95);

await player.next();
assert.equal(deck.current(), 1);
assert.equal(deck.playing(), true);
const retained = deck.cards().find(card => card && card.index !== deck.current());
assert.ok(retained);
const oldScatterY = retained.scatterRot.y;
for (let frame = 0; frame < 60; frame += 1) deck.render(frame * 16);
assert.equal(retained.scatterRot.y, oldScatterY);

await deck.toggleCurrent();
for (let frame = 0; frame < 30; frame += 1) deck.render(frame * 16);
assert.equal(deck.cards()[1].flipTarget, 1);
assert.ok(deck.cards()[1].flip > 0.95);
assert.equal(deck.playing(), false);
assert.equal(toggles, 2);

console.log(JSON.stringify({ mode: deck.mode(), current: deck.current(), playing: deck.playing(), flip: deck.cards()[1].flip, toggles }));
