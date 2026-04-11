import { useState, useRef, useCallback, useEffect } from "react";
import BackBar from "../../components/BackBar";
import { theme } from "../../theme";

const TABS = [
  { id: "sd", label: "Supply & Demand" },
  { id: "cost", label: "Cost Curves" },
  { id: "monopoly", label: "Monopoly" },
  { id: "surplus", label: "Surplus & DWL" },
];

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function useCanvas(draw, deps) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    draw(ctx, rect.width, rect.height);
  }, deps);
  return ref;
}

function toCanvas(q, p, w, h, pad) {
  const x = pad + (q / 100) * (w - 2 * pad);
  const y = (h - pad) - (p / 100) * (h - 2 * pad);
  return [x, y];
}

function fromCanvas(cx, cy, w, h, pad) {
  const q = ((cx - pad) / (w - 2 * pad)) * 100;
  const p = ((h - pad - cy) / (h - 2 * pad)) * 100;
  return [clamp(q, 0, 100), clamp(p, 0, 100)];
}

function drawAxes(ctx, w, h, pad, xLabel = "Quantity", yLabel = "Price") {
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad, pad * 0.4);
  ctx.lineTo(pad, h - pad);
  ctx.lineTo(w - pad * 0.4, h - pad);
  ctx.stroke();

  ctx.fillStyle = "#555";
  ctx.beginPath();
  ctx.moveTo(pad - 4, pad * 0.5);
  ctx.lineTo(pad, pad * 0.25);
  ctx.lineTo(pad + 4, pad * 0.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(w - pad * 0.5, h - pad - 4);
  ctx.lineTo(w - pad * 0.25, h - pad);
  ctx.moveTo(w - pad * 0.5, h - pad + 4);
  ctx.lineTo(w - pad * 0.25, h - pad);
  ctx.stroke();

  ctx.fillStyle = "#888";
  ctx.font = "13px 'Inter', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(xLabel, w / 2, h - 6);
  ctx.save();
  ctx.translate(14, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();
}

function drawLine(ctx, points, w, h, pad, color, width = 2.5, dash = []) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  ctx.beginPath();
  points.forEach(([q, p], i) => {
    const [x, y] = toCanvas(q, p, w, h, pad);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawDot(ctx, q, p, w, h, pad, color, r = 5) {
  const [x, y] = toCanvas(q, p, w, h, pad);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawLabel(ctx, q, p, w, h, pad, text, color, offsetX = 6, offsetY = -8) {
  const [x, y] = toCanvas(q, p, w, h, pad);
  ctx.fillStyle = color;
  ctx.font = "bold 13px 'Inter', system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(text, x + offsetX, y + offsetY);
}

function drawDashed(ctx, q1, p1, q2, p2, w, h, pad, color = "#666") {
  const [x1, y1] = toCanvas(q1, p1, w, h, pad);
  const [x2, y2] = toCanvas(q2, p2, w, h, pad);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function fillArea(ctx, points, w, h, pad, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([q, p], i) => {
    const [x, y] = toCanvas(q, p, w, h, pad);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function drawAxisLabel(ctx, q, p, w, h, pad, text, axis = "x") {
  const [x, y] = toCanvas(q, p, w, h, pad);
  ctx.fillStyle = "#777";
  ctx.font = "12px 'Inter', system-ui, sans-serif";
  ctx.textAlign = "center";
  if (axis === "x") {
    ctx.fillText(text, x, h - pad + 16);
  } else {
    ctx.textAlign = "right";
    ctx.fillText(text, pad - 6, y + 4);
  }
}

function Slider({ label, value, onChange, min, max }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
        <span style={{ color: theme.textMuted }}>{label}</span>
        <span style={{ color: theme.text, fontWeight: "600", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: theme.text }}
      />
    </div>
  );
}

function SupplyDemand() {
  const PAD = 50;
  const [dShift, setDShift] = useState(0);
  const [sShift, setSShift] = useState(0);
  const [taxAmt, setTaxAmt] = useState(0);

  const demandP = (q) => clamp(90 - q + dShift, 0, 100);
  const supplyP = (q) => clamp(10 + q + sShift + taxAmt, 0, 100);
  const supplyPNoTax = (q) => clamp(10 + q + sShift, 0, 100);
  const eqQ = clamp((80 + dShift - sShift - taxAmt) / 2, 0, 95);
  const eqP = demandP(eqQ);
  const sellerP = supplyPNoTax(eqQ);

  const dPoints = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 95; return [q, demandP(q)]; }).filter(([, p]) => p > 0 && p < 100);
  const sPoints = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 95; return [q, supplyP(q)]; }).filter(([, p]) => p > 0 && p < 100);
  const sPointsNoTax = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 95; return [q, supplyPNoTax(q)]; }).filter(([, p]) => p > 0 && p < 100);

  const ref = useCanvas((ctx, w, h) => {
    drawAxes(ctx, w, h, PAD);
    if (taxAmt > 0) {
      drawLine(ctx, sPointsNoTax, w, h, PAD, "#4a9e6e44", 1.5, [6, 4]);
      drawLabel(ctx, sPointsNoTax[sPointsNoTax.length - 1][0], sPointsNoTax[sPointsNoTax.length - 1][1], w, h, PAD, "S₀", "#4a9e6e88", 4, -4);
    }
    drawLine(ctx, dPoints, w, h, PAD, "#c9553a", 2.5);
    drawLine(ctx, sPoints, w, h, PAD, "#4a9e6e", 2.5);
    drawLabel(ctx, dPoints[0][0], dPoints[0][1], w, h, PAD, "D", "#c9553a", -20, -4);
    drawLabel(ctx, sPoints[sPoints.length - 1][0], sPoints[sPoints.length - 1][1], w, h, PAD, taxAmt > 0 ? "S+tax" : "S", "#4a9e6e", 4, -4);
    drawDot(ctx, eqQ, eqP, w, h, PAD, "#1a1a1a", 5);
    drawDashed(ctx, eqQ, 0, eqQ, eqP, w, h, PAD, "#888");
    drawDashed(ctx, 0, eqP, eqQ, eqP, w, h, PAD, "#888");
    drawAxisLabel(ctx, eqQ, 0, w, h, PAD, `Q*=${eqQ.toFixed(0)}`, "x");
    drawAxisLabel(ctx, 0, eqP, w, h, PAD, `P*=${eqP.toFixed(0)}`, "y");
    if (taxAmt > 0) {
      drawDashed(ctx, 0, sellerP, eqQ, sellerP, w, h, PAD, "#4a9e6e88");
      drawAxisLabel(ctx, 0, sellerP, w, h, PAD, `Ps=${sellerP.toFixed(0)}`, "y");
      const [xE, yE] = toCanvas(eqQ, eqP, w, h, PAD);
      const [, yS] = toCanvas(eqQ, sellerP, w, h, PAD);
      ctx.fillStyle = "#c9553a22";
      ctx.fillRect(xE - 12, yE, 24, yS - yE);
      ctx.fillStyle = "#c9553a";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("tax", xE, (yE + yS) / 2 + 4);
    }
  }, [dShift, sShift, taxAmt]);

  return (
    <div>
      <canvas ref={ref} style={{ width: "100%", height: 320, display: "block", marginBottom: "16px" }} />
      <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "12px", textAlign: "center" }}>
        Equilibrium: Q* = {eqQ.toFixed(0)}, P* = {eqP.toFixed(0)}
        {taxAmt > 0 && ` · Tax wedge = ${(eqP - sellerP).toFixed(0)}`}
      </div>
      <Slider label="Shift Demand" value={dShift} onChange={setDShift} min={-40} max={40} />
      <Slider label="Shift Supply" value={sShift} onChange={setSShift} min={-40} max={40} />
      <Slider label="Tax Amount" value={taxAmt} onChange={setTaxAmt} min={0} max={40} />
    </div>
  );
}

function CostCurves() {
  const PAD = 50;
  const [fc, setFc] = useState(200);
  const [mcBase, setMcBase] = useState(8);

  const mc = (q) => q > 0 ? mcBase + 0.4 * q : mcBase;
  const tc = (q) => fc + mcBase * q + 0.2 * q * q;
  const ac = (q) => q > 0 ? tc(q) / q : 100;
  const avc = (q) => q > 0 ? (mcBase * q + 0.2 * q * q) / q : mcBase;
  const afc = (q) => q > 0 ? fc / q : 100;

  const scaleQ = (q) => (q / 80) * 95;
  const scaleP = (p) => (p / 60) * 90;

  const range = Array.from({ length: 79 }, (_, i) => i + 1);
  const mcPts = range.map(q => [scaleQ(q), scaleP(mc(q))]).filter(([, p]) => p < 95);
  const acPts = range.map(q => [scaleQ(q), scaleP(ac(q))]).filter(([, p]) => p < 95 && p > 0);
  const avcPts = range.map(q => [scaleQ(q), scaleP(avc(q))]).filter(([, p]) => p < 95);
  const afcPts = range.map(q => [scaleQ(q), scaleP(afc(q))]).filter(([, p]) => p < 95);

  const minACq = Math.sqrt(fc / 0.2);
  const minACval = ac(minACq);

  const ref = useCanvas((ctx, w, h) => {
    drawAxes(ctx, w, h, PAD, "Quantity", "Cost ($)");
    drawLine(ctx, afcPts, w, h, PAD, "#aaa", 1.5, [4, 4]);
    drawLine(ctx, avcPts, w, h, PAD, "#8b6914", 2);
    drawLine(ctx, acPts, w, h, PAD, "#4a6fa5", 2.5);
    drawLine(ctx, mcPts, w, h, PAD, "#c9553a", 2.5);
    const labelAt = (pts, text, color) => {
      if (pts.length < 2) return;
      drawLabel(ctx, pts[pts.length - 1][0], pts[pts.length - 1][1], w, h, PAD, text, color, 4, -2);
    };
    labelAt(mcPts, "MC", "#c9553a");
    labelAt(acPts, "AC", "#4a6fa5");
    labelAt(avcPts, "AVC", "#8b6914");
    labelAt(afcPts, "AFC", "#aaa");
    if (minACq < 80) {
      const sq = scaleQ(minACq), sp = scaleP(minACval);
      drawDot(ctx, sq, sp, w, h, PAD, "#4a6fa5", 4);
      drawDashed(ctx, sq, 0, sq, sp, w, h, PAD, "#4a6fa588");
      drawDashed(ctx, 0, sp, sq, sp, w, h, PAD, "#4a6fa588");
      ctx.fillStyle = "#4a6fa5";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      const [mx, my] = toCanvas(sq, sp, w, h, PAD);
      ctx.fillText(`min AC = $${minACval.toFixed(1)}`, mx, my - 10);
    }
  }, [fc, mcBase]);

  return (
    <div>
      <canvas ref={ref} style={{ width: "100%", height: 320, display: "block", marginBottom: "16px" }} />
      <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "12px", textAlign: "center" }}>
        MC crosses AC at minimum AC · Firm produces where P = MC
      </div>
      <Slider label="Fixed Cost" value={fc} onChange={setFc} min={50} max={600} />
      <Slider label="MC Base" value={mcBase} onChange={setMcBase} min={2} max={25} />
    </div>
  );
}

function MonopolyDiagram() {
  const PAD = 50;
  const [demIntercept, setDemIntercept] = useState(90);
  const [mcLevel, setMcLevel] = useState(15);

  const demand = (q) => clamp(demIntercept - q, 0, 100);
  const mr = (q) => clamp(demIntercept - 2 * q, 0, 100);
  const qMon = clamp((demIntercept - mcLevel) / 2, 0, 90);
  const pMon = demand(qMon);
  const qComp = clamp(demIntercept - mcLevel, 0, 90);
  const lerner = pMon > 0 ? ((pMon - mcLevel) / pMon).toFixed(2) : 0;

  const scQ = (q) => (q / 100) * 95;
  const scP = (p) => (p / 100) * 95;

  const dPoints = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 100; return [scQ(q), scP(demand(q))]; }).filter(([, p]) => p > 0);
  const mrPoints = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 100; return [scQ(q), scP(mr(q))]; }).filter(([, p]) => p > 0);
  const mcPoints = [[0, scP(mcLevel)], [95, scP(mcLevel)]];

  const ref = useCanvas((ctx, w, h) => {
    drawAxes(ctx, w, h, PAD);
    fillArea(ctx, [[scQ(qMon), scP(pMon)], [scQ(qComp), scP(mcLevel)], [scQ(qMon), scP(mcLevel)]], w, h, PAD, "rgba(201, 85, 58, 0.15)");
    fillArea(ctx, [[0, scP(pMon)], [scQ(qMon), scP(pMon)], [scQ(qMon), scP(mcLevel)], [0, scP(mcLevel)]], w, h, PAD, "rgba(74, 111, 165, 0.1)");
    drawLine(ctx, dPoints, w, h, PAD, "#c9553a", 2.5);
    drawLine(ctx, mrPoints, w, h, PAD, "#c9553a", 2, [6, 4]);
    drawLine(ctx, mcPoints, w, h, PAD, "#4a9e6e", 2.5);
    drawLabel(ctx, dPoints[2][0], dPoints[2][1], w, h, PAD, "D", "#c9553a", -20, -4);
    drawLabel(ctx, mrPoints[Math.min(8, mrPoints.length - 1)][0], mrPoints[Math.min(8, mrPoints.length - 1)][1], w, h, PAD, "MR", "#c9553a", -24, -4);
    drawLabel(ctx, 90, scP(mcLevel), w, h, PAD, "MC", "#4a9e6e", -4, -10);
    drawDot(ctx, scQ(qMon), scP(pMon), w, h, PAD, "#1a1a1a", 5);
    drawDashed(ctx, scQ(qMon), 0, scQ(qMon), scP(pMon), w, h, PAD);
    drawDashed(ctx, 0, scP(pMon), scQ(qMon), scP(pMon), w, h, PAD);
    drawDot(ctx, scQ(qComp), scP(mcLevel), w, h, PAD, "#4a9e6e", 4);
    drawDashed(ctx, scQ(qComp), 0, scQ(qComp), scP(mcLevel), w, h, PAD, "#4a9e6e66");
    drawAxisLabel(ctx, scQ(qMon), 0, w, h, PAD, `Qm=${qMon.toFixed(0)}`, "x");
    drawAxisLabel(ctx, scQ(qComp), 0, w, h, PAD, `Qc=${qComp.toFixed(0)}`, "x");
    drawAxisLabel(ctx, 0, scP(pMon), w, h, PAD, `Pm=${pMon.toFixed(0)}`, "y");
    drawAxisLabel(ctx, 0, scP(mcLevel), w, h, PAD, `MC=${mcLevel}`, "y");
    const [dx, dy] = toCanvas(scQ((qMon + qComp) / 2), scP((pMon + mcLevel) / 2.5), w, h, PAD);
    ctx.fillStyle = "#c9553a";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DWL", dx, dy);
    const [px, py] = toCanvas(scQ(qMon / 2.5), scP((pMon + mcLevel) / 2), w, h, PAD);
    ctx.fillStyle = "#4a6fa5";
    ctx.font = "11px Inter, system-ui, sans-serif";
    ctx.fillText("π", px, py + 4);
  }, [demIntercept, mcLevel]);

  return (
    <div>
      <canvas ref={ref} style={{ width: "100%", height: 320, display: "block", marginBottom: "16px" }} />
      <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "12px", textAlign: "center" }}>
        Qm={qMon.toFixed(0)}, Pm={pMon.toFixed(0)} · Lerner = {lerner} · Competitive: Qc={qComp.toFixed(0)}
      </div>
      <Slider label="Demand Intercept" value={demIntercept} onChange={setDemIntercept} min={40} max={100} />
      <Slider label="Marginal Cost" value={mcLevel} onChange={setMcLevel} min={5} max={50} />
    </div>
  );
}

function SurplusDiagram() {
  const PAD = 50;
  const [pFloor, setPFloor] = useState(0);
  const [pCeiling, setPCeiling] = useState(0);

  const demand = (q) => clamp(85 - q, 0, 100);
  const supply = (q) => clamp(15 + q, 0, 100);
  const eqQ = 35, eqP = 50;
  const effectiveP = pFloor > eqP ? pFloor : pCeiling > 0 && pCeiling < eqP ? pCeiling : eqP;
  const isFloor = pFloor > eqP;
  const isCeiling = pCeiling > 0 && pCeiling < eqP;
  const qd = clamp(85 - effectiveP, 0, 90);
  const qs = clamp(effectiveP - 15, 0, 90);
  const transactedQ = Math.min(qd, qs);
  const scQ = (q) => (q / 90) * 95;
  const scP = (p) => (p / 100) * 95;

  const dPoints = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 85; return [scQ(q), scP(demand(q))]; });
  const sPoints = Array.from({ length: 50 }, (_, i) => { const q = (i / 49) * 85; return [scQ(q), scP(supply(q))]; });

  const ref = useCanvas((ctx, w, h) => {
    drawAxes(ctx, w, h, PAD);
    fillArea(ctx, [[scQ(0), scP(85)], [scQ(transactedQ), scP(demand(transactedQ))], [scQ(transactedQ), scP(effectiveP)], [scQ(0), scP(effectiveP)]], w, h, PAD, "rgba(74, 111, 165, 0.2)");
    fillArea(ctx, [[scQ(0), scP(effectiveP)], [scQ(transactedQ), scP(effectiveP)], [scQ(transactedQ), scP(supply(transactedQ))], [scQ(0), scP(15)]], w, h, PAD, "rgba(74, 158, 110, 0.2)");
    if (isFloor || isCeiling) {
      fillArea(ctx, [[scQ(transactedQ), scP(demand(transactedQ))], [scQ(eqQ), scP(eqP)], [scQ(transactedQ), scP(supply(transactedQ))]], w, h, PAD, "rgba(201, 85, 58, 0.2)");
      const [dx, dy] = toCanvas(scQ((transactedQ + eqQ) / 2), scP(eqP), w, h, PAD);
      ctx.fillStyle = "#c9553a";
      ctx.font = "bold 11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DWL", dx, dy + 4);
    }
    drawLine(ctx, dPoints, w, h, PAD, "#c9553a", 2.5);
    drawLine(ctx, sPoints, w, h, PAD, "#4a9e6e", 2.5);
    drawLabel(ctx, dPoints[0][0], dPoints[0][1], w, h, PAD, "D", "#c9553a", 6, 4);
    drawLabel(ctx, sPoints[sPoints.length - 1][0], sPoints[sPoints.length - 1][1], w, h, PAD, "S", "#4a9e6e", 4, -4);
    if (isFloor || isCeiling) {
      drawLine(ctx, [[0, scP(effectiveP)], [95, scP(effectiveP)]], w, h, PAD, "#555", 2, [8, 4]);
      ctx.fillStyle = "#555";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.textAlign = "right";
      const [, py] = toCanvas(90, scP(effectiveP), w, h, PAD);
      ctx.fillText(isFloor ? "Price Floor" : "Price Ceiling", w - PAD - 4, py - 6);
    }
    drawDot(ctx, scQ(eqQ), scP(eqP), w, h, PAD, "#1a1a1a", 4);
    drawDashed(ctx, scQ(eqQ), 0, scQ(eqQ), scP(eqP), w, h, PAD, "#aaa");
    drawDashed(ctx, 0, scP(eqP), scQ(eqQ), scP(eqP), w, h, PAD, "#aaa");
    const [csx, csy] = toCanvas(scQ(transactedQ / 3), scP((85 + effectiveP) / 2.2), w, h, PAD);
    ctx.fillStyle = "#4a6fa5";
    ctx.font = "bold 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CS", csx, csy);
    const [psx, psy] = toCanvas(scQ(transactedQ / 3), scP((effectiveP + 15) / 2.2), w, h, PAD);
    ctx.fillStyle = "#2d6a4f";
    ctx.fillText("PS", psx, psy);
    drawAxisLabel(ctx, scQ(eqQ), 0, w, h, PAD, `Q*=${eqQ}`, "x");
    drawAxisLabel(ctx, 0, scP(eqP), w, h, PAD, `P*=${eqP}`, "y");
  }, [pFloor, pCeiling]);

  const cs = (0.5 * transactedQ * (85 - effectiveP)).toFixed(0);
  const ps = (0.5 * transactedQ * (effectiveP - 15)).toFixed(0);
  const totalS = (parseFloat(cs) + parseFloat(ps)).toFixed(0);

  return (
    <div>
      <canvas ref={ref} style={{ width: "100%", height: 320, display: "block", marginBottom: "16px" }} />
      <div style={{ fontSize: "13px", color: theme.textMuted, marginBottom: "12px", textAlign: "center" }}>
        CS ≈ {cs} · PS ≈ {ps} · Total ≈ {totalS}
        {(isFloor || isCeiling) && ` · ${isFloor ? "Surplus" : "Shortage"} = ${Math.abs(qd - qs).toFixed(0)}`}
      </div>
      <Slider label="Price Floor" value={pFloor} onChange={(v) => { setPFloor(v); if (v > 0) setPCeiling(0); }} min={0} max={80} />
      <Slider label="Price Ceiling" value={pCeiling} onChange={(v) => { setPCeiling(v); if (v > 0) setPFloor(0); }} min={0} max={80} />
    </div>
  );
}

const NOTES = {
  sd: "Shift demand or supply to see how equilibrium moves. Add a tax to see the wedge between buyer and seller prices. The more inelastic side bears more of the tax burden.",
  cost: "Watch how MC always crosses AC at its minimum. Raising fixed costs shifts AC up but doesn't touch MC. The firm produces where P = MC.",
  monopoly: "The monopolist restricts output to where MR = MC, charging above MC. The gap between Qm and Qc is the deadweight loss. The Lerner index measures market power.",
  surplus: "Consumer surplus is willingness-to-pay minus price paid. Set a price floor or ceiling to see how the surplus shrinks and deadweight loss appears.",
};

export default function PriceTheoryDiagrams() {
  const [tab, setTab] = useState("sd");

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", fontFamily: theme.fontSans, color: theme.text }}>
      <BackBar />
      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: theme.textMuted, marginBottom: "4px" }}>
          McCloskey · Applied Theory of Price
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "500", margin: "0 0 24px", letterSpacing: "-0.01em" }}>Interactive Diagrams</h1>

        <div style={{ display: "flex", gap: 0, marginBottom: "24px", borderBottom: `1px solid ${theme.border}` }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: "10px 4px", fontSize: "12px", fontFamily: theme.fontSans,
                background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${theme.text}` : "2px solid transparent",
                color: tab === t.id ? theme.text : theme.textMuted,
                cursor: "pointer", fontWeight: tab === t.id ? "600" : "400",
                marginBottom: "-1px",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "sd" && <SupplyDemand />}
        {tab === "cost" && <CostCurves />}
        {tab === "monopoly" && <MonopolyDiagram />}
        {tab === "surplus" && <SurplusDiagram />}

        <div style={{
          marginTop: "24px", padding: "16px",
          background: theme.bgSubtle, borderLeft: `2px solid ${theme.border}`,
          fontSize: "14px", lineHeight: "1.6", color: theme.textMuted,
        }}>
          {NOTES[tab]}
        </div>
      </div>
    </div>
  );
}
