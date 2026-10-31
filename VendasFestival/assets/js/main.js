// ───────────────────────── Matemática pura (testável em Node) ─────────────────────────
const EPS = 1e-6; // tolerância para erros de vírgula flutuante (ex.: 56 / 0.28 = 199.99999…)

// Converte para número; só usa o fallback quando o valor NÃO é um número finito (0 é válido).
function parseNum(raw, fallback) {
  const n = typeof raw === 'number' ? raw : parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}
// Estritamente positivo (divisores e quantidades mínimas); senão usa o fallback.
function parsePos(raw, fallback) {
  const n = parseNum(raw, NaN);
  return n > 0 ? n : fallback;
}
// Não-negativo: valores negativos ficam a 0; inválido usa o fallback.
function parseNonNeg(raw, fallback) {
  const n = parseNum(raw, NaN);
  return Number.isFinite(n) ? Math.max(n, 0) : fallback;
}
function clamp(n, lo, hi) { return Math.min(Math.max(n, lo), hi); }

// Copos por barril com contas em centilitros (litros → cl) para evitar Math.floor(56/0.28) = 199.
function cupsPerBarrel(barrelL, copoCL, sinRate) {
  return Math.floor((barrelL * 100 * (1 - sinRate)) / copoCL + EPS);
}

// Totais do evento — usados por calc() e pela análise de sensibilidade.
function eventTotals(inp) {
  const nBarrels = Math.max(1, Math.floor(inp.nBarrels + EPS));
  const nReturned = clamp(Math.floor(inp.nReturned + EPS), 0, nBarrels - 1);
  const nUsed = nBarrels - nReturned;
  const perBarrel = cupsPerBarrel(inp.barrelL, inp.copoCL, inp.sinRate);
  const finosOferecidos = Math.round(inp.nTunas * inp.avgPessoas * inp.nSenhas);
  const totalFinosEvento = Math.max(0, perBarrel * nUsed - finosOferecidos);
  const totalCost = inp.barrelCost * nUsed;
  const rpfPack = (inp.packPrice - inp.cupCost * inp.packCups) / inp.packFinos;
  return { nBarrels, nReturned, nUsed, perBarrel, finosOferecidos, totalFinosEvento, totalCost, rpfPack };
}

// Receita média por fino e breakeven de um plano. `o` permite sobrepor ownCup/ret/packRate (sensibilidade).
function planMetrics(inp, t, k, o = {}) {
  const isA = k === 'A';
  const fino = isA ? inp.aFino : inp.bFino;
  const copo = isA ? inp.aCopo : inp.bCopo;
  const ret = o.ret !== undefined ? o.ret : (isA ? 0 : inp.bRet); // A é venda: sem retorno
  const ownCup = o.ownCup !== undefined ? o.ownCup : inp.ownCup;
  const packRate = o.packRate !== undefined ? o.packRate : inp.packRate;
  const packOn = isA ? inp.packActiveA : inp.packActiveB;
  const hhOn = isA ? inp.hhActiveA : inp.hhActiveB;

  const caucaoRetida = copo * (1 - ret);
  // quem traz copo próprio não paga copo
  const rpfIndiv = fino + caucaoRetida * (1 - ownCup);
  const effPackRate = packOn ? packRate : 0;
  const hhRate = hhOn && t.totalFinosEvento > 0 ? Math.min(inp.hhFinos / t.totalFinosEvento, 1 - effPackRate) : 0;
  const effIndivRate = 1 - effPackRate - hhRate;
  const rpf = effIndivRate * rpfIndiv + effPackRate * t.rpfPack + hhRate * inp.hhPrice;
  const be = rpf > 0 ? Math.ceil(t.totalCost / rpf - EPS) : Infinity;
  const beOfPagos = t.totalFinosEvento > 0 ? (be / t.totalFinosEvento) * 100 : 0;
  return { fino, copo, ret, rpf, rpfIndiv, effPackRate, effIndivRate, hhRate, be, caucaoRetida, beOfPagos };
}

function computeModel(inp) {
  const t = eventTotals(inp);
  return { t, res: { A: planMetrics(inp, t, 'A'), B: planMetrics(inp, t, 'B') } };
}

const OWN_STEPS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const RET_STEPS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
const PACK_STEPS = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

// Mesmo modelo que calc() (mesmos totais, barris usados, happy hour, pack) — só varia uma variável.
function sensitivityTables(inp) {
  const t = eventTotals(inp);
  const be = (k, o) => planMetrics(inp, t, k, o).be;
  return {
    own:  { steps: OWN_STEPS,  current: inp.ownCup,  a: OWN_STEPS.map(s => be('A', { ownCup: s })),   b: OWN_STEPS.map(s => be('B', { ownCup: s })) },
    ret:  { steps: RET_STEPS,  current: inp.bRet,    a: RET_STEPS.map(s => be('A', { ret: 0 })),      b: RET_STEPS.map(s => be('B', { ret: s })) },
    pack: { steps: PACK_STEPS, current: inp.packRate, a: PACK_STEPS.map(s => be('A', { packRate: s })), b: PACK_STEPS.map(s => be('B', { packRate: s })) },
  };
}

// ───────────────────────────────── Interface (DOM) ─────────────────────────────────
function el(id) { return document.getElementById(id); }
function fmt(n) { return n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }

// Lê e normaliza os inputs UMA vez; calc() e a sensibilidade partilham o resultado.
function readInputs() {
  const raw = (id) => el(id).value;
  const checked = (id) => !!el(id) && el(id).checked;
  return {
    barrelCost: parsePos(raw('barrelCost'), 95),
    barrelL: parsePos(raw('barrelL'), 50),
    copoCL: parsePos(raw('copoCL'), 28),
    sinRate: clamp(parseNum(raw('sinRate'), 0), 0, 50) / 100,
    nBarrels: parsePos(raw('nBarrels'), 1),
    nReturned: parseNonNeg(raw('nReturned'), 0),
    nTunas: parseNonNeg(raw('nTunas'), 0),
    avgPessoas: parseNonNeg(raw('avgPessoas'), 0),
    nSenhas: parseNonNeg(raw('nSenhas'), 3),
    ownCup: clamp(parseNum(raw('ownCup'), 0), 0, 100) / 100,
    aFino: parseNonNeg(raw('aFino'), 0),
    aCopo: parseNonNeg(raw('aCopo'), 0),
    bFino: parseNonNeg(raw('bFino'), 0),
    bCopo: parseNonNeg(raw('bCopo'), 0),
    bRet: clamp(parseNum(raw('bRet'), 0), 0, 100) / 100,
    packFinos: parsePos(raw('packFinos'), 10),
    packPrice: parseNonNeg(raw('packPrice'), 10),
    packCups: parseNonNeg(raw('packCups'), 1),
    cupCost: parseNonNeg(raw('cupCost'), 0),
    packRate: clamp(parseNum(raw('packRate'), 0), 0, 100) / 100,
    packActiveA: checked('packActiveA'),
    packActiveB: checked('packActiveB'),
    hhActiveA: checked('hhActive'),
    hhActiveB: checked('hhActiveB'),
    hhFinos: parsePos(raw('hhFinos'), 100),
    hhPrice: parsePos(raw('hhPrice'), 0.5),
  };
}

function calc() {
  const slider = el('soldSlider');
  const inp = readInputs();
  const { t, res } = computeModel(inp);
  const { nUsed, nReturned, totalFinosEvento, totalCost, rpfPack, finosOferecidos } = t;
  const ownCupRate = inp.ownCup;

  const sliderMax = Math.max(200, totalFinosEvento + 30);
  slider.max = sliderMax;
  el('sliderMax').textContent = sliderMax;

  // Plan cards
  for (const k of ['A', 'B']) {
    const r = res[k];
    el(`be${k}`).textContent = isFinite(r.be) ? r.be : '∞';
    el(`be${k}Tot`).textContent = '';
    el(`meta${k}`).innerHTML =
      (k === 'A' ? `fino ${fmt(r.fino)} + venda copo ${fmt(r.copo)} · ${Math.round(ownCupRate*100)}% copo próprio<br>` : `fino ${fmt(r.fino)} · caução ${fmt(r.copo)} · devolve ${Math.round(r.ret*100)}% · ${Math.round(ownCupRate*100)}% copo próprio<br>`) +
      `pack ${Math.round(r.effPackRate*100)}% (${fmt(rpfPack)}/fino) · indiv ${Math.round(r.effIndivRate*100)}%<br>` +
      `receita/fino: <strong>${fmt(r.rpf)}</strong>`;
    el(`stats${k}`).innerHTML = `
      <div class="mini-row"><span>Finos disponíveis (evento)</span><span class="v">${totalFinosEvento}</span></div>
      <div class="mini-row"><span>Finos oferecidos</span><span class="v">${finosOferecidos}</span></div>
      <div class="mini-row"><span>BE (${fmt(totalCost)} / ${fmt(r.rpf)})</span><span class="v">${isFinite(r.be) ? r.be + ' finos' : '∞'}</span></div>
      <div class="mini-row"><span>% dos ${totalFinosEvento} disp. para BE</span><span class="v">${isFinite(r.beOfPagos) ? r.beOfPagos.toFixed(1) + '%' : '—'}</span></div>
    `;
  }

  const beA = res.A.be, beB = res.B.be;
  // Quick buttons
  const curSold = parseInt(slider.value) || 0;
  const beMin = Math.min(isFinite(beA) ? beA : Infinity, isFinite(beB) ? beB : Infinity);
  const btns = [25, 50, 75, 100].map(pct => {
    const val = Math.round(totalFinosEvento * pct / 100);
    return `<button class="quick-btn ${curSold===val?'active':''}" onclick="document.getElementById('soldSlider').value=${val};window._sliderTriggered=true;calc();window._sliderTriggered=false;">${pct}%</button>`;
  });
  btns.unshift(`<button class="quick-btn ${curSold===beMin?'active':''}" style="border-color:rgba(92,232,154,0.4);color:var(--green)" onclick="document.getElementById('soldSlider').value=${isFinite(beMin)?beMin:0};window._sliderTriggered=true;calc();window._sliderTriggered=false;">BE mín</button>`);
  el('quickBtns').innerHTML = btns.join('');

  const better = beA < beB ? 'A' : beB < beA ? 'B' : null;
  if (!window._sliderTriggered && isFinite(beMin) && beMin > 0) {
    slider.value = beMin;
  }

  const sold = parseInt(slider.value) || 0;
  el('soldVal').textContent = sold + ' finos';
  el('profitN').textContent = sold;

  for (const k of ['A', 'B']) {
    const badge = el(`badge${k}`);
    if (!better) { badge.textContent = ''; badge.className = 'status-badge'; }
    else if (k === better) { badge.textContent = 'Melhor BE'; badge.className = 'status-badge badge-better'; }
    else { badge.textContent = 'Pior BE'; badge.className = 'status-badge badge-worse'; }
  }

  // Progress bars
  for (const k of ['A', 'B']) {
    const r = res[k];
    const pct = isFinite(r.be) && r.be > 0 ? Math.min((sold / r.be) * 100, 100) : 0;
    el(`bar${k}`).style.width = pct + '%';
    const remaining = isFinite(r.be) ? Math.max(r.be - sold, 0) : '∞';
    const moneyIn = Math.min(sold, totalFinosEvento) * r.rpf;
    const moneyLeft = Math.max(totalCost - moneyIn, 0);
    el(`pLabel${k}`).textContent =
      isFinite(r.be) && sold >= r.be
        ? `✓ BE atingido (+${sold - r.be} finos · +${fmt(moneyIn - totalCost)} lucro)`
        : `faltam ${remaining} finos · ${fmt(moneyLeft)}`;
  }

  // Profit table
  const soldCapped = Math.min(sold, totalFinosEvento);
  const rows = ['A', 'B'].map(k => {
    const r = res[k];
    const soldIndiv = soldCapped * r.effIndivRate;
    const coposPagos = soldIndiv * (1 - ownCupRate);
    return {
      soldIndiv,
      soldPack: soldCapped * r.effPackRate,
      revFino: soldIndiv * r.fino,
      caucaoCobrada: coposPagos * r.copo,
      caucaoDevolvida: coposPagos * r.copo * r.ret,
      revHH: soldCapped * r.hhRate * inp.hhPrice,
      total: soldCapped * r.rpf,
      profit: soldCapped * r.rpf - totalCost,
    };
  });
  const [rA, rB] = rows;

  function pRow(label, vA, vB, neg=false, isTot=false) {
    const colorA = neg ? 'var(--red)' : (isTot ? (vA >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--A)');
    const colorB = neg ? 'var(--red)' : (isTot ? (vB >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--B)');
    const fA = neg ? `−${fmt(Math.abs(vA))}` : (isTot ? (vA >= 0 ? `+${fmt(vA)}` : fmt(vA)) : fmt(vA));
    const fB = neg ? `−${fmt(Math.abs(vB))}` : (isTot ? (vB >= 0 ? `+${fmt(vB)}` : fmt(vB)) : fmt(vB));
    return `<div class="p-row${isTot?' total':''}">
      <span class="k">${label}</span>
      <div class="vals">
        <span style="color:${colorA}">${fA}</span>
        <span style="color:${colorB}">${fB}</span>
      </div>
    </div>`;
  }

  const pagam = 100 - Math.round(ownCupRate * 100);
  const copoLabelA = `Venda copo (${pagam}% pagam)`;
  const copoLabelB = `Caução copo (${pagam}% pagam)`;
  el('profitTable').innerHTML =
    pRow(`Finos individuais`, rA.revFino, rB.revFino) +
    pRow(`Pack @ ${fmt(rpfPack)}/fino (bruto ${fmt(inp.packPrice/inp.packFinos)})`, rA.soldPack * rpfPack, rB.soldPack * rpfPack) +
    (inp.cupCost > 0 && inp.packCups > 0 ? pRow(`Custo copos pack (${inp.packCups}×${fmt(inp.cupCost)})`, -(rA.soldPack / inp.packFinos * inp.packCups * inp.cupCost), -(rB.soldPack / inp.packFinos * inp.packCups * inp.cupCost), true) : '') +
    `<div class="p-row">
      <span class="k">${copoLabelA} / ${copoLabelB}</span>
      <div class="vals">
        <span style="color:var(--A)">${fmt(rA.caucaoCobrada)}</span>
        <span style="color:var(--B)">${fmt(rB.caucaoCobrada)}</span>
      </div>
    </div>` +
    `<div class="p-row">
      <span class="k">Caução devolvida (só B)</span>
      <div class="vals">
        <span style="color:var(--muted)">—</span>
        <span style="color:var(--red)">−${fmt(rB.caucaoDevolvida)}</span>
      </div>
    </div>` +
    pRow('Receita total', rA.total, rB.total) +
    ((inp.hhActiveA || inp.hhActiveB) ? pRow(`HH (${inp.hhFinos} senhas @ ${fmt(inp.hhPrice)})`, rA.revHH, rB.revHH) : '') +
    pRow(`Custo ${nUsed}×barris${nReturned > 0 ? ' ('+nReturned+' devolvidos)' : ''}`, totalCost, totalCost, true) +
    pRow('Lucro / Prejuízo', rA.profit, rB.profit, false, true);

  updateSensitivity(inp);
}

function updateSensitivity(inp = readInputs()) {
  const tables = sensitivityTables(inp);

  function sensRows(elId, { steps, current, a: aVals, b: bVals }) {
    const beValues = steps.map((s, i) => ({ s, a: aVals[i], b: bVals[i] }));

    // Variação marginal %: cada linha vs. a imediatamente anterior
    const marginal = (key) => beValues.map((row, i) => {
      if (i === 0) return null;
      const cur = row[key], prev = beValues[i-1][key];
      if (!isFinite(cur) || !isFinite(prev) || prev === 0) return null;
      return (cur - prev) / prev * 100;
    });
    const margA = marginal('a');
    const margB = marginal('b');

    // Retornos decrescentes: melhoria marginal a encolher vs. passo anterior
    const diminishing = (marg) => marg.map((m, i) => {
      if (i <= 1 || m === null || marg[i-1] === null) return false;
      const impCur = -m, impPrev = -marg[i-1];
      return impCur > 0 && impPrev > 0 && impCur < impPrev;
    });
    const dimA = diminishing(margA);
    const dimB = diminishing(margB);

    const fmtMarg = (m) => {
      if (m === null) return '—';
      const r = Math.round(m * 10) / 10;
      if (Math.abs(r) < 0.05) return '—';
      return (r > 0 ? '+' : '') + r + '%';
    };
    const colorOf = (isActive, isDim, m) =>
      isActive ? 'sens-highlight' : isDim ? 'sens-bad' : (m === null ? 'sens-neut' : m > 0 ? 'sens-bad' : m < 0 ? 'sens-good' : 'sens-neut');

    el(elId).innerHTML = beValues.map(({ s, a, b }, i) => {
      const isActive = Math.abs(s - current) < 0.001;
      const colorA = colorOf(isActive, dimA[i], margA[i]);
      const colorB = colorOf(isActive, dimB[i], margB[i]);
      return `<div class="sens-row">
        <span class="sens-val-label ${isActive ? 'active' : ''}">${Math.round(s * 100)}%</span>
        <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;flex:1">
          <span style="font-size:0.68rem;color:var(--muted);min-width:32px;text-align:right">${isFinite(a)?a:'∞'}</span>
          <span class="sens-num ${colorA}">${isActive ? '●' : fmtMarg(margA[i])}</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:flex-end;gap:6px;flex:1">
          <span style="font-size:0.68rem;color:var(--muted);min-width:32px;text-align:right">${isFinite(b)?b:'∞'}</span>
          <span class="sens-num ${colorB}">${isActive ? '●' : fmtMarg(margB[i])}</span>
        </div>
      </div>`;
    }).join('');
  }

  sensRows('sensCopoProprio', tables.own);   // copo próprio
  sensRows('sensDevolver', tables.ret);      // devolução de copos: só afeta B (A tem ret=0)
  sensRows('sensPack', tables.pack);         // % vendas em pack
}

if (typeof document !== 'undefined') {
  calc();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseNum, parsePos, parseNonNeg, cupsPerBarrel, eventTotals, planMetrics, computeModel, sensitivityTables };
}
