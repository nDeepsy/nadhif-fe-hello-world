const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function createContext() {
  const storage = new Map();

  const app = {
    innerHTML: "",
    focus() {},
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
  };

  const context = {
    console,
    localStorage: {
      getItem(key) {
        return storage.has(key) ? storage.get(key) : null;
      },
      setItem(key, value) {
        storage.set(key, String(value));
      },
      removeItem(key) {
        storage.delete(key);
      },
    },
    window: {
      location: { hash: "" },
      addEventListener() {},
    },
    document: {
      querySelector(selector) {
        return selector === "#app" ? app : null;
      },
      querySelectorAll() {
        return [];
      },
    },
  };

  context.window.localStorage = context.localStorage;
  return context;
}

function loadApp() {
  const code = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const context = createContext();

  vm.createContext(context);
  vm.runInContext(code, context);

  return context.window.Informatika3D;
}

const api = loadApp();

assert.ok(api, "App should expose quiz helpers");

assert.strictEqual(api.normalizeName("  dimas   saputra  "), "Dimas Saputra");
assert.strictEqual(api.normalizeName(""), "Siswa Tanpa Nama");

api.savePermanentScore({ name: "Dimas Saputra", score: 80, total: 100 });
api.savePermanentScore({ name: "Siti Nurhaliza", score: 70, total: 100 });
api.savePermanentScore({ name: "Dimas Saputra", score: 90, total: 100 });

const leaderboard = api.getLeaderboard();

assert.strictEqual(leaderboard.length, 2);
assert.strictEqual(
  JSON.stringify(leaderboard.map((entry) => `${entry.name}:${entry.score}`)),
  JSON.stringify(["Dimas Saputra:90", "Siti Nurhaliza:70"])
);

const filteredLessons = api.filterLessons(
  [
    { title: "Input", desc: "Keyboard dan mouse", items: ["Keyboard"] },
    { title: "Storage", desc: "SSD dan hard disk", items: ["SSD"] },
  ],
  "ssd"
);

assert.strictEqual(filteredLessons.length, 1);
assert.strictEqual(filteredLessons[0].title, "Storage");

assert.strictEqual(api.getViewerTransform({ rotation: -15, zoom: 1.2 }), "rotateY(-15deg) scale(1.2)");

console.log("quiz tests passed");
