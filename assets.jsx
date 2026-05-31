// assets.jsx — Asset Inventory page with tabs

const AssetInventory = () => {
  const [tab, setTab] = useState("certs");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [detail, setDetail] = useState(null);

  const tabs = [
    { value: "certs",      label: "憑證資產",     count: 2052, icon: "cert" },
    { value: "keys",       label: "金鑰資產",     count: 487,  icon: "key" },
    { value: "algos",      label: "加密演算法",   count: 31,   icon: "shield" },
    { value: "components", label: "軟體元件",     count: 18472, icon: "package" },
    { value: "targets",    label: "掃描目標",     count: 124,  icon: "server" },
    { value: "network",    label: "網路服務",     count: 142,  icon: "globe" },
    { value: "containers", label: "Container",    count: 38,   icon: "container" },
  ];

  return (
    <div className="page">
      <div className="row" style={{marginBottom:14}}>
        <div>
          <h1>資產資料</h1>
          <div className="hint" style={{marginTop:4}}>
            多次掃描整合後的資產狀態 · 點任一筆深入檢視來源、依賴與風險脈絡
          </div>
        </div>
        <div className="spacer"/>
        <button className="btn">
          <Icon name="diff" size={13}/> Diff snapshots
        </button>
        <button className="btn">
          <Icon name="download" size={13}/> Export CSV
        </button>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={tabs}/>

      {tab === "certs" && (
        <CertificatesTab
          search={search} setSearch={setSearch}
          riskFilter={riskFilter} setRiskFilter={setRiskFilter}
          sourceFilter={sourceFilter} setSourceFilter={setSourceFilter}
          selected={selected} setSelected={setSelected}
          detail={detail} setDetail={setDetail}
        />
      )}
      {tab === "components" && (
        <ComponentsTab
          search={search} setSearch={setSearch}
          selected={selected} setSelected={setSelected}
        />
      )}
      {tab === "algos" && <AlgorithmsTab/>}
      {tab === "keys" && <KeysTab/>}
      {tab === "targets" && <TargetsTab/>}
      {tab === "network" && <NetworkServicesTab/>}
      {tab === "containers" && <ContainersTab/>}
    </div>
  );
};

/* ---------- Certificates ---------- */
const CertificatesTab = ({ search, setSearch, riskFilter, setRiskFilter, sourceFilter, setSourceFilter, selected, setSelected, detail, setDetail }) => {

  const filtered = CERTIFICATES.filter(c => {
    if (riskFilter !== "all" && c.risk !== riskFilter) return false;
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
    if (search && !(c.cn + " " + c.issuer + " " + c.origin).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggle = (i) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i); else next.add(i);
    setSelected(next);
  };

  // top summary
  const high = CERTIFICATES.filter(c => c.risk === "high").length;
  const warn = CERTIFICATES.filter(c => c.risk === "warn").length;
  const ok = CERTIFICATES.filter(c => c.risk === "ok").length;
  const expired = CERTIFICATES.filter(c => c.daysLeft < 0).length;

  return (
    <>
      {/* summary strip */}
      <div className="grid cols-4" style={{marginBottom:14}}>
        <StatStrip icon="alert" tone="high" label="High risk" value={high} sub="needs immediate action"/>
        <StatStrip icon="clock" tone="warn" label="Expiring < 90d" value={warn} sub="rotate during next window"/>
        <StatStrip icon="check" tone="ok" label="Healthy" value={ok} sub="no concerns"/>
        <StatStrip icon="x"     tone="high" label="Expired (in use)" value={expired} sub="still in production"/>
      </div>

      <Card flush>
        <div className="filters">
          <div className="topbar-search" style={{width:280}}>
            <Icon name="search" size={13}/>
            <input placeholder="搜尋 CN / issuer / serial..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <FilterPicker label="Risk" value={riskFilter} onChange={setRiskFilter} options={[
            {value:"all", label:"All"}, {value:"high", label:"High"}, {value:"warn", label:"Warn"}, {value:"ok", label:"OK"}
          ]}/>
          <FilterPicker label="Source" value={sourceFilter} onChange={setSourceFilter} options={[
            {value:"all", label:"All"}, {value:"Source Code", label:"Source code"}, {value:"Network", label:"Network"}, {value:"Container", label:"Container"}
          ]}/>
          <FilterPicker label="Key type" value="all" onChange={()=>{}} options={[
            {value:"all", label:"All"}, {value:"RSA", label:"RSA"}, {value:"ECDSA", label:"ECDSA"}, {value:"Ed25519", label:"Ed25519"}
          ]}/>
          <div className="spacer"/>
          <button className="btn ghost sm"><Icon name="filter" size={11}/> Add filter</button>
        </div>

        {selected.size > 0 && (
          <div style={{
            padding:"8px 14px", background:"rgba(84,98,160,0.18)",
            borderBottom:"1px solid rgba(84,98,160,0.4)",
            display:"flex", alignItems:"center", gap:10, fontSize:13.5
          }}>
            <strong>{selected.size}</strong> selected
            <div className="spacer"/>
            <button className="btn sm"><Icon name="bell" size={12}/> Subscribe to rotation alerts</button>
            <button className="btn sm"><Icon name="download" size={12}/> Export</button>
            <button className="btn sm">Add to CBOM report</button>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table className="table">
            <thead>
              <tr>
                <th style={{width:32}}><Checkbox checked={false} onChange={()=>{}}/></th>
                <th>Common Name / Subject</th>
                <th>Issuer</th>
                <th>Source</th>
                <th>Origin</th>
                <th className="num">Expires in</th>
                <th>Valid until</th>
                <th>Sig algo</th>
                <th>Key</th>
                <th>Risk</th>
                <th>Seen in</th>
                <th style={{width:60}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className={selected.has(i) ? "selected" : ""} onClick={()=>setDetail(c)} style={{cursor:"pointer"}}>
                  <td onClick={e=>e.stopPropagation()}><Checkbox checked={selected.has(i)} onChange={()=>toggle(i)}/></td>
                  <td>
                    <div style={{display:"flex", flexDirection:"column", gap:1}}>
                      <span style={{fontWeight:500}}>{c.cn}</span>
                      <span style={{fontFamily:"var(--font-mono)", fontSize:11.5, color:"var(--fg-3)"}}>SN {c.serial}</span>
                    </div>
                  </td>
                  <td style={{maxWidth:180}}>
                    <span style={{display:"inline-flex", alignItems:"center", gap:5}}>
                      {c.issuer}
                      {c.selfSigned && <Badge sq tone="warn">SELF</Badge>}
                    </span>
                  </td>
                  <td><Badge tone="brand" sq>{c.source === "Source Code" ? "SRC" : c.source === "Network" ? "NET" : "CTR"}</Badge></td>
                  <td><span className="target-chip" style={{maxWidth:220}}>{c.origin}</span></td>
                  <td className="num">
                    <span style={{color: c.daysLeft < 0 ? "var(--risk-high)" : c.daysLeft < 30 ? "var(--risk-high)" : c.daysLeft < 90 ? "var(--risk-warn)" : "var(--risk-ok)"}}>
                      {c.daysLeft < 0 ? `−${Math.abs(c.daysLeft)}d` : `${c.daysLeft}d`}
                    </span>
                  </td>
                  <td className="mono muted">{c.validTo}</td>
                  <td>
                    <span style={{
                      fontFamily:"var(--font-mono)", fontSize:12,
                      color: c.sigAlgo.includes("SHA-1") ? "var(--risk-high)" : "var(--fg-2)"
                    }}>{c.sigAlgo}</span>
                  </td>
                  <td>
                    <span style={{
                      fontFamily:"var(--font-mono)", fontSize:12,
                      color: c.keyType === "RSA" && c.keySize < 2048 ? "var(--risk-high)" : "var(--fg-2)"
                    }}>
                      {c.keyType} {c.keySize}
                    </span>
                  </td>
                  <td>
                    <RiskBadge risk={c.risk}/>
                  </td>
                  <td className="num muted">
                    {c.dup}<span style={{color:"var(--fg-3)", marginLeft:3, fontSize:11.5}}>scan{c.dup>1?"s":""}</span>
                  </td>
                  <td onClick={e=>e.stopPropagation()}>
                    <button className="icon-btn"><Icon name="dots" size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{padding:"10px 14px", display:"flex", alignItems:"center", fontSize:12.5, color:"var(--fg-3)", borderTop:"1px solid var(--line-subtle)"}}>
          顯示 {filtered.length} of {CERTIFICATES.length} certs
          <div className="spacer"/>
          <span>page 1 / 1</span>
        </div>
      </Card>

      {detail && <CertDetailDrawer cert={detail} onClose={()=>setDetail(null)}/>}
    </>
  );
};

const RiskBadge = ({ risk }) => {
  if (risk === "high") return <Badge tone="high" dot>High</Badge>;
  if (risk === "warn") return <Badge tone="warn" dot>Warn</Badge>;
  if (risk === "ok")   return <Badge tone="ok" dot>OK</Badge>;
  return <Badge>—</Badge>;
};

const StatStrip = ({ icon, tone, label, value, sub }) => {
  const color = tone === "high" ? "#c93b3b" : tone === "warn" ? "#b87211" : tone === "ok" ? "#2a8f5a" : "#4b7da0";
  const bg    = tone === "high" ? "rgba(201,59,59,0.10)" : tone === "warn" ? "rgba(184,114,17,0.12)" : tone === "ok" ? "rgba(42,143,90,0.12)" : "rgba(75,125,160,0.12)";
  return (
    <div className="card" style={{padding:"12px 14px", flexDirection:"row", gap:12, alignItems:"center"}}>
      <div style={{
        width:36, height:36, borderRadius:6,
        background: bg, color, display:"grid", placeItems:"center", flexShrink:0
      }}>
        <Icon name={icon} size={18}/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:11.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em"}}>{label}</div>
        <div style={{fontSize:24, fontWeight:600, color, fontVariantNumeric:"tabular-nums", lineHeight:1.1}}>{value}</div>
        <div style={{fontSize:12, color:"var(--fg-3)", marginTop:2}}>{sub}</div>
      </div>
    </div>
  );
};

const CertDetailDrawer = ({ cert, onClose }) => (
  <>
    <div className="drawer-backdrop" onClick={onClose}/>
    <div className="drawer">
      <div style={{padding:"14px 18px", borderBottom:"1px solid var(--line-subtle)"}}>
        <div className="row" style={{marginBottom:6}}>
          <Icon name="cert" size={20} />
          <h2 style={{flex:1, marginLeft:6}}>{cert.cn}</h2>
          <RiskBadge risk={cert.risk}/>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div style={{display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", fontSize:12.5, color:"var(--fg-3)"}}>
          <Badge sq tone="brand">{cert.source === "Source Code" ? "SRC" : cert.source === "Network" ? "NET" : "CTR"}</Badge>
          <span className="target-chip">{cert.origin}</span>
        </div>
      </div>

      <div style={{overflowY:"auto", flex:1, padding:"16px 18px"}}>
        <h3 style={{marginBottom:8}}>Lifecycle</h3>
        <div className="grid cols-3" style={{gap:10, marginBottom:18}}>
          <MetricBox label="Valid from" value={cert.validFrom} mono/>
          <MetricBox label="Valid until" value={cert.validTo} mono tone={cert.daysLeft < 30 ? "high" : cert.daysLeft < 90 ? "warn" : "ok"}/>
          <MetricBox label="Days left" value={cert.daysLeft < 0 ? `−${Math.abs(cert.daysLeft)}` : cert.daysLeft} mono tone={cert.daysLeft < 30 ? "high" : cert.daysLeft < 90 ? "warn" : "ok"}/>
        </div>

        <h3 style={{marginBottom:8}}>Crypto profile</h3>
        <div style={{display:"flex", flexDirection:"column", gap:2, marginBottom:18}}>
          <KVRow k="Subject"    v={cert.cn} mono/>
          <KVRow k="Issuer"     v={cert.issuer} mono/>
          <KVRow k="Serial"     v={cert.serial} mono/>
          <KVRow k="Sig algo"   v={cert.sigAlgo} mono tone={cert.sigAlgo.includes("SHA-1") ? "high" : null}/>
          <KVRow k="Key type"   v={cert.keyType} mono/>
          <KVRow k="Key size"   v={cert.keySize + " bit"} mono tone={cert.keyType==="RSA"&&cert.keySize<2048 ? "high" : null}/>
          <KVRow k="Self-signed" v={cert.selfSigned ? "Yes" : "No"} mono tone={cert.selfSigned ? "warn" : null}/>
          <KVRow k="Duplicates" v={`${cert.dup} occurrences`} mono/>
        </div>

        <h3 style={{marginBottom:8}}>Findings</h3>
        <div style={{display:"flex", flexDirection:"column", gap:6, marginBottom:18}}>
          {cert.daysLeft < 0 && <Finding tone="high" icon="alert" title="Certificate is expired and still observed" desc={`Expired ${Math.abs(cert.daysLeft)} days ago. Replace immediately and re-deploy.`}/>}
          {cert.daysLeft >= 0 && cert.daysLeft < 30 && <Finding tone="high" icon="clock" title={`Expires in ${cert.daysLeft} days`} desc="Schedule rotation. Affected services should be notified."/>}
          {cert.sigAlgo.includes("SHA-1") && <Finding tone="high" icon="shield" title="Weak signature algorithm: SHA-1" desc="SHA-1 is broken for collision resistance. Re-issue with SHA-256 or stronger."/>}
          {cert.keyType === "RSA" && cert.keySize < 2048 && <Finding tone="high" icon="key" title={`RSA-${cert.keySize} below minimum`} desc="RSA keys must be ≥ 2048 bits per current policy (NIST SP 800-131A)."/>}
          {cert.selfSigned && <Finding tone="warn" icon="alert" title="Self-signed certificate" desc="Outside trust chain. Acceptable internally; flag if exposed externally."/>}
        </div>

        <h3 style={{marginBottom:8}}>Observed in scans</h3>
        <div style={{display:"flex", flexDirection:"column", gap:1}}>
          {SCAN_HISTORY.slice(0, cert.dup || 1).map(s => (
            <div key={s.id} style={{
              display:"grid", gridTemplateColumns:"auto 1fr auto auto", gap:10, alignItems:"center",
              padding:"6px 0", borderBottom:"1px solid var(--line-subtle)", fontSize:13
            }}>
              <StatusDot status={s.status}/>
              <div style={{minWidth:0}}>
                <div style={{overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{s.name}</div>
                <div style={{fontSize:11.5, color:"var(--fg-3)", fontFamily:"var(--font-mono)"}}>{s.id}</div>
              </div>
              <span style={{fontSize:12, color:"var(--fg-3)"}}>{fmt.rel(s.startedAt)}</span>
              <button className="icon-btn"><Icon name="external" size={12}/></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 18px", borderTop:"1px solid var(--line-subtle)", display:"flex", gap:8}}>
        <button className="btn"><Icon name="bell" size={13}/> Alert on rotation</button>
        <button className="btn"><Icon name="external" size={13}/> Linked CBOM</button>
        <div className="spacer"/>
        <button className="btn primary">Mark for rotation</button>
      </div>
    </div>
  </>
);

const KVRow = ({ k, v, mono, tone }) => (
  <div style={{
    display:"grid", gridTemplateColumns:"120px 1fr", gap:10,
    padding:"6px 0", borderBottom:"1px solid var(--line-subtle)",
    alignItems:"baseline", fontSize:13.5
  }}>
    <div style={{fontSize:11.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em"}}>{k}</div>
    <div style={{
      fontFamily: mono ? "var(--font-mono)" : "inherit",
      color: tone === "high" ? "var(--risk-high)" : tone === "warn" ? "var(--risk-warn)" : "var(--fg)"
    }}>{v}</div>
  </div>
);

const Finding = ({ tone, icon, title, desc }) => {
  const color = tone === "high" ? "#c93b3b" : tone === "warn" ? "#b87211" : "#4b7da0";
  const bg    = tone === "high" ? "rgba(201,59,59,0.08)" : tone === "warn" ? "rgba(184,114,17,0.10)" : "rgba(75,125,160,0.10)";
  return (
    <div style={{
      padding:"10px 12px", background: bg, borderLeft:`2px solid ${color}`,
      borderRadius:3, display:"flex", gap:10
    }}>
      <Icon name={icon} size={15} className="icon" style={{color, flexShrink:0, marginTop:1}}/>
      <div>
        <div style={{fontWeight:500, color, fontSize:13.5}}>{title}</div>
        <div style={{fontSize:12.5, color:"var(--fg-2)", marginTop:2}}>{desc}</div>
      </div>
    </div>
  );
};

/* ---------- Components tab ---------- */
const ComponentsTab = ({ search, setSearch, selected, setSelected }) => {
  const filtered = COMPONENTS.filter(c =>
    !search || (c.name + " " + c.version + " " + c.purl).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card flush>
      <div className="filters">
        <div className="topbar-search" style={{width:280}}>
          <Icon name="search" size={13}/>
          <input placeholder="搜尋 name / purl / target..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <FilterPicker label="Ecosystem" value="all" onChange={()=>{}} options={[
          {value:"all", label:"All"}, {value:"npm", label:"npm"}, {value:"pypi", label:"PyPI"}, {value:"golang", label:"Go"}, {value:"maven", label:"Maven"}, {value:"debian", label:"deb"}
        ]}/>
        <FilterPicker label="Tier" value="all" onChange={()=>{}} options={[
          {value:"all", label:"All"}, {value:"HIGH", label:"High"}, {value:"MEDIUM", label:"Medium"}, {value:"LOW", label:"Low"}
        ]}/>
        <div className="spacer"/>
        <span className="hint">accuracy from <span style={{fontFamily:"var(--font-mono)"}}>accuracy_report.json</span></span>
      </div>

      <div style={{overflowX:"auto"}}>
        <table className="table">
          <thead>
            <tr>
              <th style={{width:32}}><Checkbox checked={false} onChange={()=>{}}/></th>
              <th>Component</th>
              <th>Version</th>
              <th>Type</th>
              <th>Package URL</th>
              <th>Target</th>
              <th>Ecosystem</th>
              <th className="num">Deps</th>
              <th className="num">Dup</th>
              <th>Accuracy</th>
              <th>Sources</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={i}>
                <td><Checkbox checked={false} onChange={()=>{}}/></td>
                <td style={{fontWeight:500}}>{c.name}</td>
                <td className="mono">{c.version}</td>
                <td><Badge sq>{c.type}</Badge></td>
                <td><span className="target-chip" style={{maxWidth:280}}>{c.purl}</span></td>
                <td className="mono muted">{c.target}</td>
                <td><Badge tone="brand" sq>{c.ecosystem}</Badge></td>
                <td className="num">{c.deps}</td>
                <td className="num muted">{c.dup}×</td>
                <td>
                  <Badge tone={c.tier === "HIGH" ? "ok" : c.tier === "MEDIUM" ? "warn" : "high"} sq>{c.tier}</Badge>
                </td>
                <td className="muted">
                  {c.sources.length} scan{c.sources.length>1?"s":""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{padding:"10px 14px", display:"flex", alignItems:"center", fontSize:12.5, color:"var(--fg-3)", borderTop:"1px solid var(--line-subtle)"}}>
        顯示 {filtered.length} of <strong>{fmt.n(18472)}</strong> components (mock filtered)
        <div className="spacer"/>
        <button className="btn ghost sm" disabled><Icon name="chevronLeft" size={11}/></button>
        <span style={{padding:"0 8px"}}>1 / 312</span>
        <button className="btn ghost sm"><Icon name="chevronRight" size={11}/></button>
      </div>
    </Card>
  );
};

/* ---------- Algorithms tab ---------- */
const AlgorithmsTab = () => (
  <div className="grid" style={{gridTemplateColumns:"1fr 1fr"}}>
    <Card title="演算法分布" meta="public-key + signature">
      <HBar data={ALGO_DIST}/>
    </Card>
    <Card title="Algorithm × Ecosystem" meta="usage heatmap">
      <Heatmap
        rows={["RSA-2048","RSA-4096","ECDSA P-256","ECDSA P-384","Ed25519","SHA-256","SHA-1"]}
        cols={["npm","pypi","go","mvn","deb","ctr"]}
        cells={{
          "RSA-2048|npm":42, "RSA-2048|pypi":61, "RSA-2048|go":18, "RSA-2048|mvn":29, "RSA-2048|deb":48, "RSA-2048|ctr":54,
          "RSA-4096|npm":12, "RSA-4096|pypi":18, "RSA-4096|go":8,  "RSA-4096|mvn":9,  "RSA-4096|deb":21, "RSA-4096|ctr":24,
          "ECDSA P-256|npm":31,"ECDSA P-256|pypi":24,"ECDSA P-256|go":42,"ECDSA P-256|mvn":16,"ECDSA P-256|deb":18,"ECDSA P-256|ctr":31,
          "ECDSA P-384|npm":8, "ECDSA P-384|pypi":11,"ECDSA P-384|go":18,"ECDSA P-384|mvn":6, "ECDSA P-384|deb":9, "ECDSA P-384|ctr":12,
          "Ed25519|npm":11, "Ed25519|pypi":8,  "Ed25519|go":24, "Ed25519|mvn":3, "Ed25519|deb":4, "Ed25519|ctr":14,
          "SHA-256|npm":98, "SHA-256|pypi":121, "SHA-256|go":81, "SHA-256|mvn":76, "SHA-256|deb":142, "SHA-256|ctr":156,
          "SHA-1|npm":2,  "SHA-1|pypi":3,  "SHA-1|go":0,  "SHA-1|mvn":4,  "SHA-1|deb":1,  "SHA-1|ctr":3,
        }}
      />
    </Card>
    <Card title="弱演算法" meta="needs migration" style={{gridColumn:"1 / -1"}}>
      <table className="table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Why</th>
            <th>Recommended</th>
            <th className="num">Assets</th>
            <th className="num">Targets</th>
            <th>Severity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[
            { algo:"RSA-1024", why:"Below NIST SP 800-131A minimum (2048).", rec:"RSA-2048 / ECDSA P-256", assets:14, targets:8, sev:"high"},
            { algo:"SHA-1",    why:"Collision-broken since SHAttered (2017).", rec:"SHA-256+", assets:9, targets:6, sev:"high"},
            { algo:"TLS 1.0/1.1", why:"Deprecated by IETF · removed from browsers.", rec:"TLS 1.2 baseline · 1.3 preferred", assets:8, targets:5, sev:"high"},
            { algo:"3DES (TripleDES)", why:"Sweet32 attack against 64-bit block ciphers.", rec:"AES-GCM / ChaCha20-Poly1305", assets:3, targets:2, sev:"warn"},
            { algo:"MD5",      why:"Long broken for collision resistance.", rec:"SHA-256+", assets:2, targets:2, sev:"warn"},
          ].map((r, i) => (
            <tr key={i}>
              <td><span style={{fontFamily:"var(--font-mono)", color: r.sev === "high" ? "var(--risk-high)" : "var(--risk-warn)"}}>{r.algo}</span></td>
              <td className="muted" style={{maxWidth:300}}>{r.why}</td>
              <td className="mono muted">{r.rec}</td>
              <td className="num">{r.assets}</td>
              <td className="num">{r.targets}</td>
              <td><Badge tone={r.sev === "high" ? "high" : "warn"} dot>{r.sev === "high" ? "High" : "Warn"}</Badge></td>
              <td><button className="btn ghost sm">View affected</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

/* ---------- Keys tab ---------- */
const KeysTab = () => (
  <Card flush>
    <div className="filters">
      <div className="topbar-search" style={{width:280}}>
        <Icon name="search" size={13}/>
        <input placeholder="搜尋 fingerprint / origin..."/>
      </div>
      <FilterPicker label="Type" value="all" onChange={()=>{}} options={[
        {value:"all", label:"All"}, {value:"private", label:"Private"}, {value:"public", label:"Public"}, {value:"symmetric", label:"Symmetric"}
      ]}/>
      <FilterPicker label="Usage" value="all" onChange={()=>{}} options={[
        {value:"all", label:"All"}, {value:"sign", label:"Sign"}, {value:"encrypt", label:"Encrypt"}, {value:"jwt", label:"JWT"}
      ]}/>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Fingerprint</th><th>Type</th><th>Algorithm</th><th>Origin</th><th>Usage</th><th>First seen</th><th>Last seen</th><th>Risk</th>
        </tr>
      </thead>
      <tbody>
        {[
          { fp:"SHA256:7Z9q…3aG1", t:"private", algo:"RSA-2048", origin:"payments-svc:3.18.2 /etc/jwt.key", usage:"JWT sign", first:"2024-04-12", last:"3h ago", risk:"warn"},
          { fp:"SHA256:KaM2…11pP", t:"public",  algo:"ECDSA P-256", origin:"edge-gateway.prod.corp:443", usage:"TLS", first:"2024-09-12", last:"32m ago", risk:"high"},
          { fp:"SHA256:9bM7…0fGq", t:"private", algo:"Ed25519", origin:"~/src/auth-svc/keys/jwt-ed.pem", usage:"JWT sign", first:"2025-01-10", last:"16h ago", risk:"ok"},
          { fp:"SHA256:p4R0…lL12", t:"private", algo:"RSA-1024", origin:"legacy-billing:1.4 /etc/ssl/key.pem", usage:"TLS", first:"2021-01-15", last:"19h ago", risk:"high"},
          { fp:"SHA256:Gg7C…xZ08", t:"symmetric", algo:"AES-256-GCM", origin:"ml-platform/configs/encryption.yml", usage:"Data encrypt", first:"2024-08-01", last:"74h ago", risk:"ok"},
          { fp:"SHA256:wO31…8Mn4", t:"public",  algo:"ECDSA P-384", origin:"telemetry-relay:1.6", usage:"TLS", first:"2025-11-12", last:"11h ago", risk:"ok"},
        ].map((k, i) => (
          <tr key={i}>
            <td className="mono">{k.fp}</td>
            <td><Badge sq>{k.t}</Badge></td>
            <td className="mono muted">{k.algo}</td>
            <td><span className="target-chip">{k.origin}</span></td>
            <td className="muted">{k.usage}</td>
            <td className="mono muted">{k.first}</td>
            <td className="mono muted">{k.last}</td>
            <td><RiskBadge risk={k.risk}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

/* ---------- Targets tab ---------- */
const TargetsTab = () => (
  <Card flush>
    <div className="filters">
      <div className="topbar-search" style={{width:280}}>
        <Icon name="search" size={13}/>
        <input placeholder="搜尋 target..."/>
      </div>
      <FilterPicker label="Type" value="all" onChange={()=>{}} options={[
        {value:"all", label:"All"}, {value:"src", label:"Source"}, {value:"net", label:"Network"}, {value:"ctr", label:"Container"}
      ]}/>
      <FilterPicker label="Accuracy" value="all" onChange={()=>{}} options={[
        {value:"all", label:"All"}, {value:"HIGH", label:"HIGH"}, {value:"MEDIUM", label:"MEDIUM"}, {value:"LOW", label:"LOW"}, {value:"FAILED", label:"FAILED"}
      ]}/>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Target</th><th>Type</th><th>Source</th><th>Accuracy</th><th className="num">Certs</th><th className="num">Keys</th><th className="num">Components</th><th className="num">Warnings</th><th>Last scan</th>
        </tr>
      </thead>
      <tbody>
        {[
          { t:"edge-gateway.prod.corp", ty:"NET", src:"Network", acc:"HIGH", certs:18, keys:6, comp:0, warn:3, last:"11h ago"},
          { t:"payments-svc:3.18.2", ty:"CTR", src:"Container", acc:"HIGH", certs:8, keys:4, comp:284, warn:1, last:"16h ago"},
          { t:"~/src/payments-svc", ty:"SRC", src:"Source Code", acc:"HIGH", certs:4, keys:3, comp:194, warn:0, last:"16h ago"},
          { t:"checkout-svc:2.4.1", ty:"CTR", src:"Container", acc:"MEDIUM", certs:6, keys:2, comp:341, warn:4, last:"39h ago"},
          { t:"~/src/ml-platform", ty:"SRC", src:"Source Code", acc:"HIGH", certs:6, keys:8, comp:498, warn:2, last:"74h ago"},
          { t:"checkout-svc.internal:443", ty:"NET", src:"Network", acc:"FAILED", certs:0, keys:0, comp:0, warn:1, last:"46h ago"},
          { t:"dw-svc:1.9.0", ty:"CTR", src:"Container", acc:"FAILED", certs:0, keys:0, comp:0, warn:2, last:"88h ago"},
        ].map((r, i) => (
          <tr key={i}>
            <td className="mono">{r.t}</td>
            <td><Badge tone="brand" sq>{r.ty}</Badge></td>
            <td className="muted">{r.src}</td>
            <td><Badge tone={r.acc === "HIGH" ? "ok" : r.acc === "MEDIUM" ? "warn" : r.acc === "FAILED" ? "high" : "info"} sq>{r.acc}</Badge></td>
            <td className="num">{r.certs}</td>
            <td className="num">{r.keys}</td>
            <td className="num">{r.comp || "—"}</td>
            <td className="num">
              {r.warn > 0 ? <span style={{color:"var(--risk-warn)"}}>{r.warn}</span> : <span className="muted">0</span>}
            </td>
            <td className="muted">{r.last}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

const NetworkServicesTab = () => (
  <Card flush>
    <div className="filters">
      <div className="topbar-search" style={{width:280}}>
        <Icon name="search" size={13}/>
        <input placeholder="搜尋 endpoint..."/>
      </div>
      <FilterPicker label="TLS" value="all" onChange={()=>{}} options={[
        {value:"all", label:"All"}, {value:"13", label:"TLS 1.3"}, {value:"12", label:"TLS 1.2"}, {value:"old", label:"≤ TLS 1.1"}
      ]}/>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Endpoint</th><th>Port</th><th>Service</th><th>TLS</th><th>Cipher</th><th>Cert</th><th>HSTS</th><th>OCSP</th><th>Risk</th>
        </tr>
      </thead>
      <tbody>
        {[
          { ep:"edge-gateway.prod.corp", port:443, svc:"https · h2", tls:"1.3", cipher:"TLS_AES_256_GCM_SHA384", cert:"valid · 7d", hsts:"max-age=31536000", ocsp:"good", risk:"high"},
          { ep:"api.payments.corp", port:443, svc:"https", tls:"1.3", cipher:"TLS_CHACHA20_POLY1305_SHA256", cert:"valid · 22d", hsts:"max-age=63072000", ocsp:"good", risk:"warn"},
          { ep:"legacy-billing.internal", port:443, svc:"https", tls:"1.0/1.1", cipher:"AES128-SHA", cert:"self · expired", hsts:"—", ocsp:"none", risk:"high"},
          { ep:"checkout-svc.internal", port:443, svc:"https", tls:"1.2", cipher:"ECDHE-RSA-AES256-GCM-SHA384", cert:"valid · 5d", hsts:"max-age=86400", ocsp:"good", risk:"high"},
          { ep:"auth.corp", port:443, svc:"https · h2", tls:"1.3", cipher:"TLS_AES_128_GCM_SHA256", cert:"valid · 5d", hsts:"max-age=31536000", ocsp:"good", risk:"high"},
          { ep:"db-internal.corp", port:5432, svc:"postgres", tls:"1.2", cipher:"ECDHE-ECDSA-AES256-GCM-SHA384", cert:"valid · 142d", hsts:"—", ocsp:"good", risk:"ok"},
        ].map((r, i) => (
          <tr key={i}>
            <td className="mono">{r.ep}</td>
            <td className="num mono">{r.port}</td>
            <td className="muted">{r.svc}</td>
            <td><span style={{
              fontFamily:"var(--font-mono)",
              color: r.tls.includes("1.0") || r.tls.includes("1.1") ? "var(--risk-high)" : "var(--fg-2)"
            }}>{r.tls}</span></td>
            <td className="mono muted" style={{maxWidth:240, overflow:"hidden", textOverflow:"ellipsis"}}>{r.cipher}</td>
            <td className="mono muted">{r.cert}</td>
            <td className="mono muted">{r.hsts}</td>
            <td><Badge tone={r.ocsp === "good" ? "ok" : "warn"} sq>{r.ocsp}</Badge></td>
            <td><RiskBadge risk={r.risk}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

const ContainersTab = () => (
  <Card flush>
    <div className="filters">
      <div className="topbar-search" style={{width:280}}>
        <Icon name="search" size={13}/>
        <input placeholder="搜尋 image..."/>
      </div>
      <FilterPicker label="Registry" value="all" onChange={()=>{}} options={[
        {value:"all", label:"All"}, {value:"prod", label:"prod"}, {value:"staging", label:"staging"}
      ]}/>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Image</th><th>Tag</th><th>Digest</th><th>Size</th><th className="num">Layers</th><th className="num">Pkgs</th><th className="num">Certs</th><th className="num">Keys</th><th>Last scan</th><th>Risk</th>
        </tr>
      </thead>
      <tbody>
        {[
          { img:"registry.corp/payments/payments-svc", tag:"3.18.2", digest:"sha256:a1b2c3…", size:"284 MB", layers:12, pkgs:284, certs:8, keys:4, last:"16h", risk:"warn"},
          { img:"registry.corp/payments/checkout-svc", tag:"2.4.1", digest:"sha256:7c1f9b…", size:"311 MB", layers:14, pkgs:341, certs:6, keys:2, last:"39h", risk:"high"},
          { img:"registry.corp/edge/edge-gateway", tag:"v3.6.0", digest:"sha256:002a18…", size:"182 MB", layers:10, pkgs:198, certs:18, keys:6, last:"11h", risk:"high"},
          { img:"registry.corp/auth/auth-svc", tag:"2.7.0", digest:"sha256:f3a91c…", size:"96 MB", layers:8, pkgs:142, certs:4, keys:3, last:"63h", risk:"ok"},
          { img:"registry.corp/data/dw-svc", tag:"1.8", digest:"sha256:11ad7e…", size:"512 MB", layers:18, pkgs:481, certs:2, keys:1, last:"53h", risk:"warn"},
        ].map((r, i) => (
          <tr key={i}>
            <td className="mono">{r.img}</td>
            <td className="mono"><Badge tone="brand" sq>{r.tag}</Badge></td>
            <td className="mono muted">{r.digest}</td>
            <td className="num mono">{r.size}</td>
            <td className="num">{r.layers}</td>
            <td className="num">{r.pkgs}</td>
            <td className="num">{r.certs}</td>
            <td className="num">{r.keys}</td>
            <td className="muted">{r.last} ago</td>
            <td><RiskBadge risk={r.risk}/></td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

window.AssetInventory = AssetInventory;
