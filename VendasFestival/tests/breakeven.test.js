// Testes da matemática do simulador. Correr: node --test tests/breakeven.test.js (dentro de VendasFestival)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Funciona na pasta do portfólio (assets/js/main.js) e na cópia plana (script.js).
const candidates = ['../assets/js/main.js', '../script.js'].map(p => path.join(__dirname, p));
const m = require(candidates.find(fs.existsSync));

// Valores por omissão do index.html
const base = {
  barrelCost: 95, barrelL: 50, copoCL: 28, sinRate: 0.05, nBarrels: 15, nReturned: 0,
  nTunas: 6, avgPessoas: 25, nSenhas: 3, ownCup: 0.5,
  aFino: 1, aCopo: 1, bFino: 0.5, bCopo: 2, bRet: 0.3,
  packFinos: 12, packPrice: 10, packCups: 0, cupCost: 0.36, packRate: 0.25,
  packActiveA: true, packActiveB: false, hhActiveA: false, hhActiveB: false, hhFinos: 100, hhPrice: 0.5,
};

test('parseNum: 0 é válido, só inválido usa fallback', () => {
  assert.equal(m.parseNum('0', 1), 0);
  assert.equal(m.parseNum('', 1), 1);
  assert.equal(m.parseNum('abc', 1), 1);
  assert.equal(m.parseNum('2.5', 1), 2.5);
  assert.equal(m.parsePos('0', 10), 10);
  assert.equal(m.parsePos('-3', 10), 10);
  assert.equal(m.parseNonNeg('-3', 10), 0);
  assert.equal(m.parseNonNeg('0', 10), 0);
});

test('cupsPerBarrel: sem erro de vírgula flutuante', () => {
  assert.equal(Math.floor(56 / 0.28), 199); // o bug original
  assert.equal(m.cupsPerBarrel(56, 28, 0), 200);
  assert.equal(m.cupsPerBarrel(50, 28, 0.05), 169); // 4750 / 28 = 169.6
  assert.equal(m.cupsPerBarrel(50, 25, 0), 200);
  assert.equal(m.cupsPerBarrel(30, 30, 0), 100);
});

test('totais do evento (valores por omissão)', () => {
  const t = m.eventTotals(base);
  assert.equal(t.perBarrel, 169);
  assert.equal(t.finosOferecidos, 450);
  assert.equal(t.totalFinosEvento, 169 * 15 - 450); // 2085
  assert.equal(t.totalCost, 1425);
  assert.ok(Math.abs(t.rpfPack - 10 / 12) < 1e-12);
});

test('breakeven dos planos A e B (valores por omissão)', () => {
  const { res } = m.computeModel(base);
  // A: 0.75*1.5 + 0.25*(10/12) = 4/3 → ceil(1425 / (4/3)) = 1069
  assert.equal(res.A.be, 1069);
  // B: fino 0.5 + caução retida 1.4 * 0.5 = 1.2 → ceil(1425 / 1.2) = 1188
  assert.equal(res.B.be, 1188);
});

test('barris devolvidos reduzem custo e finos', () => {
  const t = m.eventTotals({ ...base, nReturned: 3 });
  assert.equal(t.nUsed, 12);
  assert.equal(t.totalCost, 1140);
  assert.equal(t.totalFinosEvento, 169 * 12 - 450);
  // nunca devolve todos
  assert.equal(m.eventTotals({ ...base, nReturned: 99 }).nUsed, 1);
});

test('packCups = 0 não vira 1 (custo de copo do pack é zero)', () => {
  const t = m.eventTotals({ ...base, packCups: 0 });
  assert.ok(Math.abs(t.rpfPack - 10 / 12) < 1e-12);
  const t1 = m.eventTotals({ ...base, packCups: 1 });
  assert.ok(Math.abs(t1.rpfPack - (10 - 0.36) / 12) < 1e-12);
});

test('sensibilidade coincide com calc() no valor atual (barris devolvidos + happy hour + pack)', () => {
  const inp = { ...base, nReturned: 2, hhActiveA: true, hhActiveB: true, packActiveB: true, ownCup: 0.5, bRet: 0.3, packRate: 0.3 };
  const { res } = m.computeModel(inp);
  const s = m.sensitivityTables(inp);
  assert.equal(s.own.a[s.own.steps.indexOf(0.5)], res.A.be);
  assert.equal(s.own.b[s.own.steps.indexOf(0.5)], res.B.be);
  assert.equal(s.ret.b[s.ret.steps.indexOf(0.3)], res.B.be);
  assert.equal(s.pack.a[s.pack.steps.indexOf(0.3)], res.A.be);
  assert.equal(s.pack.b[s.pack.steps.indexOf(0.3)], res.B.be);
});

test('happy hour baixa a receita/fino quando preço HH < preço médio', () => {
  const off = m.computeModel(base).res.A;
  const on = m.computeModel({ ...base, hhActiveA: true }).res.A;
  assert.ok(on.hhRate > 0);
  assert.ok(on.be > off.be);
  assert.ok(Math.abs(on.effIndivRate + on.effPackRate + on.hhRate - 1) < 1e-12);
});

test('receita/fino zero → breakeven infinito', () => {
  const { res } = m.computeModel({ ...base, aFino: 0, aCopo: 0, packActiveA: false });
  assert.equal(res.A.be, Infinity);
});
