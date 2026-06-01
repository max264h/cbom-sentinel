// charts.jsx — lightweight SVG charts (no external deps)

const CHART_COLORS = ["#2a257f", "#5462a0", "#aacddf", "#6b7db3", "#8fa8bf", "#3b3781", "#7e8fc2"];
const RISK_COLORS = {
  ok: "var(--risk-ok)",
  warn: "var(--risk-warn)",
  high: "var(--risk-high)",
  info: "#aacddf",
  muted: "var(--fg-4)",
};

/* Line + Area chart */
const LineChart = ({ series, height = 180, yTicks = 4, showLegend = true, stacked = false }) => {
  const [hover, setHover] = useState(null);
  const W = 800, H = height, pad = { t: 12, r: 16, b: 22, l: 36 };
  const n = series[0]?.data.length || 0;
  const xStep = (W - pad.l - pad.r) / Math.max(1, n - 1);

  const maxRaw = Math.max(1, ...series.flatMap(s => s.data));
  const max = Math.ceil(maxRaw * 1.15);
  const y = v => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const x = i => pad.l + i * xStep;

  const path = (data) => data.map((v, i) => (i ? "L" : "M") + x(i) + " " + y(v)).join(" ");
  const area = (data) => path(data) + ` L ${x(data.length-1)} ${y(0)} L ${x(0)} ${y(0)} Z`;

  const ticks = Array.from({length: yTicks+1}, (_,i) => Math.round(max * i / yTicks));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%", height: H, display:"block"}} onMouseLeave={()=>setHover(null)}>
        {/* grid */}
        {ticks.map(t => (
          <g key={t}>
            <line x1={pad.l} x2={W-pad.r} y1={y(t)} y2={y(t)} stroke="#d4d7dc" strokeOpacity={0.35} strokeDasharray="2 4" />
            <text x={pad.l-6} y={y(t)+3} textAnchor="end" fontSize="11" fill="#8a8f98" fontFamily="var(--font-mono)">{t}</text>
          </g>
        ))}
        {/* x labels */}
        {Array.from({length: n}).map((_, i) => (
          i % Math.ceil(n/8) === 0 || i === n-1 ? (
            <text key={i} x={x(i)} y={H-6} textAnchor="middle" fontSize="11" fill="#8a8f98">
              {series[0].labels?.[i] || i}
            </text>
          ) : null
        ))}
        {/* hover line */}
        {hover != null && (
          <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H-pad.b} stroke="#aacddf" strokeOpacity="0.4" />
        )}
        {/* areas/lines */}
        {series.map((s, si) => (
          <g key={si}>
            <path d={area(s.data)} fill={s.color || CHART_COLORS[si]} fillOpacity={s.fillOpacity ?? 0.12}/>
            <path d={path(s.data)} fill="none" stroke={s.color || CHART_COLORS[si]} strokeWidth={1.6}/>
          </g>
        ))}
        {/* hover dots */}
        {hover != null && series.map((s, si) => (
          <circle key={si} cx={x(hover)} cy={y(s.data[hover])} r={3} fill={s.color || CHART_COLORS[si]} stroke="#ffffff" strokeWidth={1.5}/>
        ))}
        {/* invisible hit areas */}
        {Array.from({length: n}).map((_, i) => (
          <rect key={i} x={x(i)-xStep/2} y={0} width={xStep} height={H}
            fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
      </svg>
      {hover != null && (
        <div style={{
          fontSize:12, color:"var(--fg-2)", display:"flex", gap:14, padding:"4px 8px",
          background:"var(--bg-panel-3)", borderRadius:4, marginTop:6, alignItems:"center"
        }}>
          <span style={{color:"var(--fg-3)"}}>{series[0].labels?.[hover]}</span>
          {series.map((s, si) => (
            <span key={si} style={{display:"inline-flex", alignItems:"center", gap:5}}>
              <span style={{width:8,height:8,borderRadius:2,background:s.color || CHART_COLORS[si]}}/>
              {s.name} <strong style={{fontFamily:"var(--font-mono)"}}>{s.data[hover]}</strong>
            </span>
          ))}
        </div>
      )}
      {showLegend && (
        <div className="legend" style={{marginTop:8}}>
          {series.map((s, si) => (
            <span key={si} className="legend-item">
              <span className="legend-swatch" style={{background: s.color || CHART_COLORS[si]}}/>
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* Donut / arc chart */
const Donut = ({ data, size = 160, total: totalProp, centerLabel, centerSub }) => {
  const total = totalProp ?? data.reduce((s,d) => s + d.value, 0);
  const r = size/2 - 16;
  const c = size/2;
  let acc = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const start = acc;
    acc += frac;
    return { ...d, start, end: acc, color: d.color || CHART_COLORS[i % CHART_COLORS.length], frac };
  });
  const arc = (start, end) => {
    const a0 = start * 2 * Math.PI - Math.PI/2;
    const a1 = end   * 2 * Math.PI - Math.PI/2;
    const x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0);
    const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  return (
    <div style={{display:"flex", gap:18, alignItems:"center"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#d4d7dc" strokeOpacity={0.3} strokeWidth={14}/>
        {segs.map((s,i) => (
          <path key={i} d={arc(s.start, s.end)} fill="none" stroke={s.color} strokeWidth={14} strokeLinecap="butt"/>
        ))}
        {centerLabel && (
          <>
            <text x={c} y={c-2} textAnchor="middle" fontSize="24" fill="#1a1d24" fontWeight="600">{centerLabel}</text>
            {centerSub && <text x={c} y={c+15} textAnchor="middle" fontSize="11" fill="#6a6f78" letterSpacing="0.08em">{centerSub}</text>}
          </>
        )}
      </svg>
      <div style={{display:"flex", flexDirection:"column", gap:6, flex:1, minWidth:0}}>
        {segs.map((s,i) => (
          <div key={i} style={{display:"flex", alignItems:"center", gap:8, fontSize:13}}>
            <span style={{width:8, height:8, background:s.color, borderRadius:2, flexShrink:0}}/>
            <span style={{flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{s.label}</span>
            <span style={{fontFamily:"var(--font-mono)", color:"var(--fg-2)"}}>{s.value}</span>
            <span style={{fontFamily:"var(--font-mono)", color:"var(--fg-3)", width:42, textAlign:"right"}}>{(s.frac*100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Horizontal bar chart */
const HBar = ({ data, max: maxProp, valueFmt = v => v, height = 12, color = "#5462a0", striped = false }) => {
  const max = maxProp ?? Math.max(1, ...data.map(d => d.value));
  return (
    <div style={{display:"flex", flexDirection:"column", gap:8}}>
      {data.map((d,i) => (
        <div key={i} style={{display:"grid", gridTemplateColumns:"160px 1fr 60px", alignItems:"center", gap:10, fontSize:13}}>
          <div style={{
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
            color: d.muted ? "var(--fg-3)" : "var(--fg)"
          }} title={d.label}>{d.label}</div>
          <div style={{position:"relative", background:"var(--overlay-2)", height, borderRadius:2}}>
            <div style={{
              position:"absolute", left:0, top:0, bottom:0,
              width: (d.value/max*100) + "%",
              background: d.color || color,
              borderRadius:2,
            }}/>
          </div>
          <div style={{textAlign:"right", fontFamily:"var(--font-mono)", color:"var(--fg-2)"}}>
            {valueFmt(d.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

/* Stacked bar (per-bucket time / categories) */
const StackedBar = ({ buckets, categories, height = 180 }) => {
  // buckets: [{ label, values: { [catKey]: number } }]
  // categories: [{ key, label, color }]
  const W = 800, H = height, pad = { t: 14, r: 16, b: 22, l: 36 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const bw = innerW / buckets.length * 0.72;
  const gap = innerW / buckets.length * 0.28;
  const max = Math.ceil(Math.max(1, ...buckets.map(b => categories.reduce((s,c) => s + (b.values[c.key] || 0), 0))) * 1.1);
  const ticks = [0, max/2, max].map(t => Math.round(t));
  const y = v => pad.t + innerH * (1 - v / max);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%", display:"block", height: H}}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={pad.l} x2={W-pad.r} y1={y(t)} y2={y(t)} stroke="#d4d7dc" strokeOpacity={0.3} strokeDasharray="2 4"/>
            <text x={pad.l-6} y={y(t)+3} fontSize="11" fill="#8a8f98" textAnchor="end" fontFamily="var(--font-mono)">{t}</text>
          </g>
        ))}
        {buckets.map((b, bi) => {
          let cum = 0;
          const x = pad.l + bi * (bw + gap) + gap/2;
          return (
            <g key={bi}>
              {categories.map((c, ci) => {
                const v = b.values[c.key] || 0;
                if (!v) return null;
                const h = innerH * (v / max);
                const yy = y(cum + v);
                cum += v;
                return <rect key={ci} x={x} y={yy} width={bw} height={h} fill={c.color} />;
              })}
              <text x={x + bw/2} y={H-6} fontSize="11" fill="#6a6f78" textAnchor="middle">{b.label}</text>
            </g>
          );
        })}
      </svg>
      <div className="legend" style={{marginTop:6}}>
        {categories.map(c => (
          <span key={c.key} className="legend-item">
            <span className="legend-swatch" style={{background:c.color}}/>{c.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* Sparkline (inline) */
const Sparkline = ({ data, width = 80, height = 24, color = "#aacddf", area = true }) => {
  const max = Math.max(...data, 1);
  const min = 0;
  const step = width / Math.max(1, data.length - 1);
  const y = v => height - ((v - min) / (max - min)) * height;
  const path = data.map((v,i) => (i?"L":"M") + (i*step) + " " + y(v)).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:"block"}}>
      {area && <path d={path + ` L ${width} ${height} L 0 ${height} Z`} fill={color} fillOpacity={0.18}/>}
      <path d={path} fill="none" stroke={color} strokeWidth={1.4}/>
    </svg>
  );
};

/* Expiry timeline buckets */
const ExpiryTimeline = ({ buckets }) => {
  // buckets: [{ label: "0-30d", value, tone }]
  const max = Math.max(...buckets.map(b => b.value), 1);
  return (
    <div style={{display:"grid", gridTemplateColumns:`repeat(${buckets.length}, 1fr)`, gap:10}}>
      {buckets.map((b,i) => {
        const c = b.tone === "high" ? "var(--risk-high)"
                : b.tone === "warn" ? "var(--risk-warn)"
                : b.tone === "ok"   ? "var(--risk-ok)"
                : "#aacddf";
        return (
          <div key={i} style={{
            background:"var(--bg-panel-3)", borderRadius:4,
            padding:"10px 12px", display:"flex", flexDirection:"column", gap:6,
            borderLeft: `2px solid ${c}`
          }}>
            <div style={{fontSize:11, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.08em"}}>{b.label}</div>
            <div style={{fontSize:22, fontWeight:600, fontVariantNumeric:"tabular-nums", color:c}}>{b.value}</div>
            <div style={{height:3, background:"var(--overlay-3)", borderRadius:2, overflow:"hidden"}}>
              <div style={{height:"100%", width:(b.value/max*100)+"%", background:c}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* Heatmap (algorithm × ecosystem) — small */
const Heatmap = ({ rows, cols, cells, max }) => {
  // cells: { [row+"|"+col]: value }
  const m = max ?? Math.max(1, ...Object.values(cells));
  return (
    <div style={{display:"grid", gridTemplateColumns:`110px repeat(${cols.length}, 1fr)`, gap:2, fontSize:12}}>
      <div></div>
      {cols.map(c => <div key={c} style={{padding:"4px 6px", color:"var(--fg-3)", textAlign:"center", fontFamily:"var(--font-mono)", fontSize:11}}>{c}</div>)}
      {rows.map(r => (
        <React.Fragment key={r}>
          <div style={{padding:"6px 8px", color:"var(--fg-2)", fontFamily:"var(--font-mono)", fontSize:11}}>{r}</div>
          {cols.map(c => {
            const v = cells[r+"|"+c] || 0;
            const a = v ? 0.15 + 0.85 * (v/m) : 0;
            return (
              <div key={c} className="tip" data-tip={`${r} · ${c}: ${v}`}
                style={{
                  background:`rgba(84,98,160,${a})`,
                  height:24, display:"grid", placeItems:"center",
                  borderRadius:2, color: a > 0.5 ? "#ffffff" : "var(--fg-2)",
                  fontFamily:"var(--font-mono)", fontSize:11
                }}>
                {v || "—"}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ============================================================
   DependencyGraph — mermaid-style layered DAG (left→right)
   graph = {
     nodes: [{ id, label, sub?, kind, risk? }],
     edges: [{ from, to, label? }]
   }
   kind: root | target | library | package | cert | key | algo
   risk: high | warn | ok   (overrides kind color for border)
   ============================================================ */
const DEP_NODE_KIND = {
  root:    { c: "var(--brand)",     label: "Scan" },
  target:  { c: "var(--brand-2)",   label: "Target" },
  library: { c: "var(--c4)",        label: "Library" },
  package: { c: "var(--c4)",        label: "Package" },
  cert:    { c: "var(--risk-info)", label: "Certificate" },
  key:     { c: "var(--brand-2)",   label: "Key" },
  algo:    { c: "var(--c3)",        label: "Algorithm" },
};

const DependencyGraph = ({ graph, height = 360 }) => {
  const [hover, setHover] = useState(null);
  const { nodes, edges } = graph;

  // ---- layer assignment (longest path from roots) ----
  const layer = {};
  nodes.forEach(n => { layer[n.id] = 0; });
  for (let iter = 0; iter < nodes.length; iter++) {
    let changed = false;
    edges.forEach(e => {
      if (layer[e.to] < layer[e.from] + 1) { layer[e.to] = layer[e.from] + 1; changed = true; }
    });
    if (!changed) break;
  }

  const layers = {};
  nodes.forEach(n => { (layers[layer[n.id]] = layers[layer[n.id]] || []).push(n); });
  const colCount = Math.max(...Object.keys(layers).map(Number)) + 1;
  const maxRows = Math.max(...Object.values(layers).map(a => a.length));

  // ---- geometry ----
  const nodeW = 158, nodeH = 38, hGap = 64, vGap = 16, padX = 14, padY = 16;
  const W = padX * 2 + colCount * nodeW + (colCount - 1) * hGap;
  const H = Math.max(height, padY * 2 + maxRows * (nodeH + vGap) - vGap);

  const pos = {};
  Object.entries(layers).forEach(([l, ns]) => {
    const x = padX + Number(l) * (nodeW + hGap);
    const colH = ns.length * (nodeH + vGap) - vGap;
    const startY = (H - colH) / 2;
    ns.forEach((n, i) => { pos[n.id] = { x, y: startY + i * (nodeH + vGap) }; });
  });

  // ---- adjacency for hover highlight ----
  const neighbors = (id) => {
    const set = new Set([id]);
    edges.forEach(e => { if (e.from === id) set.add(e.to); if (e.to === id) set.add(e.from); });
    return set;
  };
  const active = hover ? neighbors(hover) : null;
  const edgeActive = (e) => !hover || e.from === hover || e.to === hover;
  const nodeActive = (id) => !hover || active.has(id);

  const colorOf = (n) =>
    n.risk === "high" ? "var(--risk-high)"
    : n.risk === "warn" ? "var(--risk-warn)"
    : n.risk === "ok" ? "var(--risk-ok)"
    : (DEP_NODE_KIND[n.kind]?.c || "var(--brand-2)");

  const edgePath = (e) => {
    const a = pos[e.from], b = pos[e.to];
    if (!a || !b) return "";
    const x1 = a.x + nodeW, y1 = a.y + nodeH / 2;
    const x2 = b.x,         y2 = b.y + nodeH / 2;
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div style={{
      overflow: "auto", border: "1px solid var(--line-subtle)", borderRadius: "var(--r)",
      background: "var(--bg-panel-2)",
      backgroundImage: "radial-gradient(var(--line-subtle) 1px, transparent 1px)",
      backgroundSize: "18px 18px"
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block", minWidth: "100%" }}
        onMouseLeave={() => setHover(null)}>
        <defs>
          <marker id="dg-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--line-strong)" />
          </marker>
          <marker id="dg-arrow-hi" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0,0 L8,4 L0,8 z" fill="var(--brand-2)" />
          </marker>
        </defs>

        {/* edges */}
        {edges.map((e, i) => {
          const on = edgeActive(e);
          const hot = hover && (e.from === hover || e.to === hover);
          return (
            <path key={i} d={edgePath(e)} fill="none"
              stroke={hot ? "var(--brand-2)" : "var(--line-strong)"}
              strokeWidth={hot ? 1.8 : 1.2}
              opacity={on ? 1 : 0.18}
              markerEnd={hot ? "url(#dg-arrow-hi)" : "url(#dg-arrow)"} />
          );
        })}

        {/* nodes */}
        {nodes.map(n => {
          const p = pos[n.id];
          const c = colorOf(n);
          const on = nodeActive(n.id);
          return (
            <g key={n.id} transform={`translate(${p.x},${p.y})`}
              opacity={on ? 1 : 0.28}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHover(n.id)}>
              <rect width={nodeW} height={nodeH} rx={6}
                fill="var(--bg-card)" stroke={c}
                strokeWidth={hover === n.id ? 2 : 1.2} />
              <rect width={4} height={nodeH} rx={2} fill={c} />
              <text x={12} y={n.sub ? 15 : 23} fontSize="12" fontFamily="var(--font-mono)"
                fill="var(--fg)" fontWeight="500">
                {n.label.length > 19 ? n.label.slice(0, 18) + "…" : n.label}
              </text>
              {n.sub && (
                <text x={12} y={29} fontSize="10" fill="var(--fg-3)" fontFamily="var(--font-mono)">
                  {n.sub.length > 22 ? n.sub.slice(0, 21) + "…" : n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const DepGraphLegend = ({ kinds }) => (
  <div className="legend" style={{ marginTop: 10 }}>
    {kinds.map(k => (
      <span key={k} className="legend-item">
        <span className="legend-swatch" style={{ background: DEP_NODE_KIND[k]?.c, borderRadius: 2 }} />
        {DEP_NODE_KIND[k]?.label || k}
      </span>
    ))}
    <span className="legend-item" style={{ marginLeft: "auto" }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, border: "1.5px solid var(--risk-high)", display: "inline-block" }} />
      high risk
    </span>
  </div>
);

Object.assign(window, { LineChart, Donut, HBar, StackedBar, Sparkline, ExpiryTimeline, Heatmap, DependencyGraph, DepGraphLegend, DEP_NODE_KIND, CHART_COLORS, RISK_COLORS });
