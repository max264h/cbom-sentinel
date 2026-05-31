// scan.jsx — New Scan configuration page

const NewScan = ({ onNavigate }) => {
  const t = useT();
  const [name, setName] = useState("Production API weekly scan");
  const [triggeredBy, setTriggeredBy] = useState("");
  const [enabled, setEnabled] = useState({ source: true, network: true, container: false, sbom: true });
  const [advanced, setAdvanced] = useState(false);

  // Source code
  const [sourcePath, setSourcePath] = useState("~/src/payments-svc");
  const [recursiveDepth, setRecursiveDepth] = useState(8);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [detectCrypto, setDetectCrypto] = useState(true);

  // Network
  const [netTargets, setNetTargets] = useState("api.payments.corp\n10.4.0.0/16\nedge-gateway.prod.corp:443");
  const [portRange, setPortRange] = useState("443,8443,9443,3306,5432");
  const [tlsHandshake, setTlsHandshake] = useState(true);
  const [tlsChain, setTlsChain] = useState(true);

  // Container
  const [containerImages, setContainerImages] = useState("registry.corp/payments/*");
  const [scanLocalDocker, setScanLocalDocker] = useState(false);

  // SBOM
  const [sbomTarget, setSbomTarget] = useState("payments-prod-cluster");
  const [depGraph, setDepGraph] = useState(true);

  // Advanced
  const [maxWorkers, setMaxWorkers] = useState(8);
  const [timeout, setTimeout] = useState(900);
  const [failFast, setFailFast] = useState(false);
  const [outputDir, setOutputDir] = useState("/var/lib/cbom/scans/");
  const [validate, setValidate] = useState(true);
  const [keepArtifacts, setKeepArtifacts] = useState(true);
  const [noDocker, setNoDocker] = useState(false);
  const [manifestOnly, setManifestOnly] = useState(false);

  const enabledCount = Object.values(enabled).filter(Boolean).length;
  const estimatedTargets =
    (enabled.source ? sourcePath.split("\n").filter(Boolean).length : 0) +
    (enabled.network ? netTargets.split("\n").filter(Boolean).length : 0) +
    (enabled.container ? containerImages.split(",").filter(Boolean).length : 0) +
    (enabled.sbom ? 1 : 0);

  return (
    <div className="page">
      <div className="row" style={{marginBottom:16}}>
        <div>
          <h1>{t("開始掃描", "New Scan")}</h1>
          <div className="hint" style={{marginTop:4}}>
            {t("設定掃描範圍與啟用功能 · 進階參數對應 CLI 旗標", "Configure scan scope & enabled functions · advanced params map to CLI flags")}
            <span className="dot-sep"/>
            <span style={{fontFamily:"var(--font-mono)"}}>cbom scan</span>
          </div>
        </div>
        <div className="spacer"/>
        <button className="btn ghost" onClick={()=>onNavigate("history")}>
          <Icon name="x" size={13}/> {t("取消","Cancel")}
        </button>
        <button className="btn">
          <Icon name="file" size={13}/> {t("存為範本","Save as template")}
        </button>
        <button className="btn primary lg" disabled={enabledCount === 0 || !name.trim() || !triggeredBy.trim()}>
          <Icon name="play" size={13}/> {t("執行掃描","Run scan")}
        </button>
      </div>

      {/* Two-column: form + summary panel */}
      <div className="grid" style={{gridTemplateColumns:"1fr 320px", gap:16, alignItems:"flex-start"}}>
        <div className="col" style={{gap:16}}>
          {/* 1. Name + functions */}
          <Card title={t("1 · 命名 & 啟用功能","1 · Name & Enable Functions")} meta={t("必填","required")}>
            <div className="grid cols-2" style={{gap:14, marginBottom:18}}>
              <div className="field">
                <label className="field-label">
                  {t("掃描名稱","Scan name")}
                  <span style={{color:"var(--risk-high)", marginLeft:2}}>*</span>
                </label>
                <input
                  className="input"
                  value={name}
                  onChange={e=>setName(e.target.value)}
                  placeholder={t("例如：Production API weekly scan","e.g. Production API weekly scan")}
                />
                <div className="field-help">{t("建議標明環境、頻率或目的，便於後續追蹤","Include env, frequency, or purpose for better tracking")}</div>
              </div>
              <div className="field">
                <label className="field-label">
                  {t("觸發者","Triggered by")}
                  <span style={{color:"var(--risk-high)", marginLeft:2}}>*</span>
                </label>
                <input
                  className="input mono"
                  value={triggeredBy}
                  onChange={e=>setTriggeredBy(e.target.value)}
                  placeholder={t("例如：j.huang@corp","e.g. j.huang@corp")}
                />
                <div className="field-help">{t("填入你的 email、帳號或 CI 名稱作為這次掃描的負責來源","Email, username, or CI name responsible for this scan")}</div>
              </div>
            </div>

            <div className="grid cols-2" style={{gap:10}}>
              <FunctionToggle
                title={t("Source Code 掃描","Source Code Scan")}
                desc={t("本機或指定路徑原始碼 · 偵測 Python / Node / Go / Java","Local or specified-path source · detects Python / Node / Go / Java")}
                icon="code"
                badge="CBOM"
                on={enabled.source}
                onChange={v => setEnabled({...enabled, source: v})}
              />
              <FunctionToggle
                title={t("Network Based 掃描","Network Based Scan")}
                desc={t("IP / 網段 / Domain / Port · TLS 憑證鏈、cipher、協定版本","IP / CIDR / Domain / Port · TLS cert chain, cipher, protocol version")}
                icon="network"
                badge="CBOM"
                on={enabled.network}
                onChange={v => setEnabled({...enabled, network: v})}
              />
              <FunctionToggle
                title={t("Container 掃描","Container Scan")}
                desc={t("Docker image · filesystem · registry image","Docker image · filesystem · registry image")}
                icon="container"
                badge="CBOM + SBOM"
                on={enabled.container}
                onChange={v => setEnabled({...enabled, container: v})}
              />
              <FunctionToggle
                title={t("SBOM 掃描","SBOM Scan")}
                desc={t("完整軟體元件 · purl · dependency graph (Syft → CycloneDX)","Full software components · purl · dependency graph (Syft → CycloneDX)")}
                icon="layers"
                badge="SBOM"
                on={enabled.sbom}
                onChange={v => setEnabled({...enabled, sbom: v})}
              />
            </div>
          </Card>

          {/* 2. Scope */}
          <Card title="2 · 掃描範圍" meta={`${enabledCount} 個功能已啟用`}>
            {enabledCount === 0 && (
              <div style={{padding:"18px 14px", textAlign:"center", color:"var(--fg-3)", fontSize:13}}>
                請先在上方啟用至少一個掃描功能
              </div>
            )}

            {enabled.source && (
              <ScopeSection icon="code" title="Source Code" tag="SRC">
                <div className="field" style={{flex:2}}>
                  <label className="field-label">本機路徑 · 可多行</label>
                  <textarea className="textarea mono" value={sourcePath} onChange={e=>setSourcePath(e.target.value)} style={{minHeight:52}}/>
                </div>
                <div className="grid cols-3" style={{gap:10, flex:1.4}}>
                  <div className="field">
                    <label className="field-label">遞迴深度</label>
                    <input className="input mono" type="number" value={recursiveDepth} onChange={e=>setRecursiveDepth(+e.target.value)}/>
                  </div>
                  <div className="field" style={{justifyContent:"space-between"}}>
                    <label className="field-label">隱藏目錄</label>
                    <div style={{display:"flex", alignItems:"center", gap:8, marginTop:5}}>
                      <Switch on={includeHidden} onChange={setIncludeHidden}/>
                      <span style={{fontSize:12, color:"var(--fg-3)"}}>{includeHidden ? "include" : "skip"}</span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">偵測 crypto</label>
                    <div style={{display:"flex", alignItems:"center", gap:8, marginTop:5}}>
                      <Switch on={detectCrypto} onChange={setDetectCrypto}/>
                      <span style={{fontSize:12, color:"var(--fg-3)"}}>keys / certs / config</span>
                    </div>
                  </div>
                </div>
              </ScopeSection>
            )}

            {enabled.network && (
              <ScopeSection icon="network" title="Network Based" tag="NET">
                <div className="field" style={{flex:2}}>
                  <label className="field-label">目標 · IP / CIDR / Domain · 一行一筆</label>
                  <textarea className="textarea mono" value={netTargets} onChange={e=>setNetTargets(e.target.value)} style={{minHeight:80}}/>
                </div>
                <div className="grid" style={{gridTemplateColumns:"1fr", gap:10, flex:1.4}}>
                  <div className="field">
                    <label className="field-label">Port range</label>
                    <input className="input mono" value={portRange} onChange={e=>setPortRange(e.target.value)}/>
                    <div className="field-help">逗號分隔或範圍 (443, 8000-8443)</div>
                  </div>
                  <div className="row" style={{gap:14}}>
                    <label style={{display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--fg-2)"}}>
                      <Checkbox checked={tlsHandshake} onChange={setTlsHandshake}/>
                      TLS handshake probe
                    </label>
                    <label style={{display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--fg-2)"}}>
                      <Checkbox checked={tlsChain} onChange={setTlsChain}/>
                      Cert chain capture
                    </label>
                  </div>
                </div>
              </ScopeSection>
            )}

            {enabled.container && (
              <ScopeSection icon="container" title="Container" tag="CTR">
                <div className="field" style={{flex:2}}>
                  <label className="field-label">Image / Registry · 支援 wildcard</label>
                  <input className="input mono" value={containerImages} onChange={e=>setContainerImages(e.target.value)} placeholder="registry.corp/payments/*"/>
                  <div className="field-help">image:tag, image@sha256, or full registry path with glob</div>
                </div>
                <div className="field" style={{flex:1}}>
                  <label className="field-label">本機 Docker</label>
                  <div style={{display:"flex", alignItems:"center", gap:8, marginTop:5}}>
                    <Switch on={scanLocalDocker} onChange={setScanLocalDocker}/>
                    <span style={{fontSize:12, color:"var(--fg-3)"}}>{scanLocalDocker ? "include local images" : "registry only"}</span>
                  </div>
                </div>
              </ScopeSection>
            )}

            {enabled.sbom && (
              <ScopeSection icon="layers" title="SBOM" tag="SBM" noBorder>
                <div className="field" style={{flex:2}}>
                  <label className="field-label">目標 · 設備 / 環境 / 專案</label>
                  <input className="input mono" value={sbomTarget} onChange={e=>setSbomTarget(e.target.value)}/>
                  <div className="field-help">套用至此 scan 中已選擇的所有來源以產生統整 SBOM</div>
                </div>
                <div className="field" style={{flex:1}}>
                  <label className="field-label">Dependency graph</label>
                  <div style={{display:"flex", alignItems:"center", gap:8, marginTop:5}}>
                    <Switch on={depGraph} onChange={setDepGraph}/>
                    <span style={{fontSize:12, color:"var(--fg-3)"}}>{depGraph ? "full graph" : "manifest only"}</span>
                  </div>
                </div>
              </ScopeSection>
            )}
          </Card>

          {/* 3. Advanced */}
          <Card
            title="3 · 進階設定"
            meta={advanced ? "expanded" : "collapsed"}
            actions={
              <button className="btn ghost sm" onClick={()=>setAdvanced(!advanced)}>
                {advanced ? "Hide" : "Show"}
                <Icon name={advanced ? "chevronDown" : "chevronRight"} size={12}/>
              </button>
            }
          >
            {!advanced ? (
              <div style={{display:"flex", gap:12, flexWrap:"wrap", fontSize:12.5}}>
                <KV k="--max-workers" v={maxWorkers}/>
                <KV k="--timeout" v={timeout + "s"}/>
                <KV k="--recursive-depth" v={recursiveDepth}/>
                <KV k="--output-dir" v={outputDir}/>
                <KV k="--validate" v={validate ? "on" : "off"}/>
                <KV k="--fail-fast" v={failFast ? "on" : "off"}/>
              </div>
            ) : (
              <div className="grid cols-2" style={{gap:14}}>
                <div className="field">
                  <label className="field-label">--max-workers · 並行掃描數</label>
                  <input className="input mono" type="number" value={maxWorkers} onChange={e=>setMaxWorkers(+e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">--timeout · 秒</label>
                  <input className="input mono" type="number" value={timeout} onChange={e=>setTimeout(+e.target.value)}/>
                </div>
                <div className="field" style={{gridColumn:"1/-1"}}>
                  <label className="field-label">--output-dir · 輸出目錄</label>
                  <input className="input mono" value={outputDir} onChange={e=>setOutputDir(e.target.value)}/>
                </div>

                <ToggleRow label="--fail-fast · 任一 target 失敗即終止" on={failFast} onChange={setFailFast}/>
                <ToggleRow label="--validate · CycloneDX schema 驗證" on={validate} onChange={setValidate}/>
                <ToggleRow label="--keep-artifacts · 保留 per-target artifacts" on={keepArtifacts} onChange={setKeepArtifacts}/>
                <ToggleRow label="--no-docker · 略過 Docker probes" on={noDocker} onChange={setNoDocker}/>
                <ToggleRow label="--manifest-only · 僅產生 manifest" on={manifestOnly} onChange={setManifestOnly}/>
                <div className="field">
                  <label className="field-label">--tools-dir</label>
                  <input className="input mono" defaultValue="/usr/local/bin"/>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right panel: summary */}
        <div style={{position:"sticky", top:68}}>
          <Card title="Run summary" meta="dry-run preview">
            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              <SummaryRow label="Name" value={name || "—"} mono/>
              <SummaryRow label="Functions">
                <div style={{display:"flex", gap:4, flexWrap:"wrap"}}>
                  {enabled.source && <Badge tone="brand" sq>SRC</Badge>}
                  {enabled.network && <Badge tone="brand" sq>NET</Badge>}
                  {enabled.container && <Badge tone="brand" sq>CTR</Badge>}
                  {enabled.sbom && <Badge tone="brand" sq>SBM</Badge>}
                  {enabledCount === 0 && <span style={{color:"var(--fg-3)", fontSize:12}}>—</span>}
                </div>
              </SummaryRow>
              <SummaryRow label="Targets (est.)" value={estimatedTargets} mono/>
              <SummaryRow label="Concurrency" value={maxWorkers + " workers"} mono/>
              <SummaryRow label="Timeout / target" value={timeout + "s"} mono/>
              <SummaryRow label="Validate" value={validate ? "CycloneDX 1.6" : "off"} mono/>
              <SummaryRow label="Output">
                <span className="target-chip">{outputDir}</span>
              </SummaryRow>

              <div style={{borderTop:"1px solid var(--line-subtle)", marginTop:6, paddingTop:10}}>
                <div style={{fontSize:12, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6}}>
                  CLI equivalent
                </div>
                <pre style={{
                  background:"var(--bg-code)", padding:"10px 12px", borderRadius:4,
                  fontFamily:"var(--font-mono)", fontSize:12, color:"#aacddf",
                  margin:0, lineHeight:1.6, whiteSpace:"pre-wrap"
                }}>
{`cbom scan \\
  --name "${name}" \\${enabled.source ? `\n  --path ${sourcePath.split("\n")[0]} \\` : ""}${enabled.network ? `\n  --net ${netTargets.split("\n")[0]} \\` : ""}${enabled.container ? `\n  --image "${containerImages}" \\` : ""}${enabled.sbom ? `\n  --sbom-target ${sbomTarget} \\` : ""}
  --max-workers ${maxWorkers} \\
  --timeout ${timeout} \\
  --output-dir ${outputDir}${validate ? " \\\n  --validate" : ""}${failFast ? " \\\n  --fail-fast" : ""}`}
                </pre>
              </div>

              <div style={{
                padding:"8px 10px", marginTop:4,
                background:"var(--risk-info-soft)",
                borderLeft:"2px solid #aacddf",
                borderRadius:3, fontSize:12.5, color:"var(--fg-2)"
              }}>
                Estimated runtime <strong style={{fontFamily:"var(--font-mono)"}}>~6m 12s</strong> based on similar past scans.
              </div>
            </div>
          </Card>

          <div style={{marginTop:14}}>
            <Card title="Templates" meta="reusable presets" dense>
              <div style={{display:"flex", flexDirection:"column", gap:1}}>
                {["Production API weekly", "TLS audit · external", "Container registry sweep", "Release: payments-svc"].map((t,i) => (
                  <div key={i} style={{
                    display:"flex", alignItems:"center", gap:8, padding:"7px 4px",
                    fontSize:13, color:"var(--fg-2)", cursor:"pointer", borderRadius:3
                  }} onMouseEnter={e=>e.currentTarget.style.background="var(--overlay-2)"}
                     onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <Icon name="file" size={12}/>
                    <span style={{flex:1}}>{t}</span>
                    <Icon name="arrowRight" size={11}/>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const FunctionToggle = ({ title, desc, icon, badge, on, onChange }) => (
  <div
    onClick={() => onChange(!on)}
    style={{
      cursor:"pointer", padding:"12px 14px",
      background: on ? "rgba(42,37,127,0.06)" : "var(--bg-panel-2)",
      border: "1px solid " + (on ? "rgba(42,37,127,0.25)" : "var(--line)"),
      borderRadius: 6,
      display:"flex", gap:12, alignItems:"flex-start",
      transition:"all 0.12s"
    }}
  >
    <div style={{
      width:32, height:32, borderRadius:6,
      background: on ? "var(--brand-soft)" : "var(--bg-panel)",
      display:"grid", placeItems:"center", flexShrink:0,
      color: on ? "var(--brand)" : "var(--fg-3)"
    }}>
      <Icon name={icon} size={16}/>
    </div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:"flex", alignItems:"center", gap:8}}>
        <span style={{fontWeight:500, fontSize:14}}>{title}</span>
        <Badge tone="brand" sq>{badge}</Badge>
      </div>
      <div style={{fontSize:12.5, color:"var(--fg-3)", marginTop:2}}>{desc}</div>
    </div>
    <Switch on={on} onChange={onChange}/>
  </div>
);

const ScopeSection = ({ icon, title, tag, children, noBorder }) => (
  <div style={{
    display:"flex", gap:14, alignItems:"flex-start",
    padding:"12px 0",
    borderBottom: noBorder ? "none" : "1px solid var(--line-subtle)"
  }}>
    <div style={{width:80, flexShrink:0, paddingTop:18}}>
      <Badge tone="brand" sq>{tag}</Badge>
      <div style={{display:"flex", alignItems:"center", gap:6, marginTop:6, fontSize:13, color:"var(--fg-2)"}}>
        <Icon name={icon} size={13}/>
        {title}
      </div>
    </div>
    <div style={{display:"flex", gap:14, flex:1}}>{children}</div>
  </div>
);

const ToggleRow = ({ label, on, onChange }) => (
  <div style={{
    display:"flex", alignItems:"center", gap:10,
    padding:"8px 10px", borderRadius:4,
    background:"var(--bg-panel)"
  }}>
    <Switch on={on} onChange={onChange}/>
    <span style={{fontSize:13, color:"var(--fg-2)", fontFamily:"var(--font-mono)"}}>{label}</span>
  </div>
);

const KV = ({ k, v }) => (
  <div style={{
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"4px 8px",
    background:"var(--bg-panel-3)",
    border:"1px solid var(--line-subtle)",
    borderRadius:3, fontFamily:"var(--font-mono)"
  }}>
    <span style={{color:"var(--fg-3)"}}>{k}</span>
    <span style={{color:"var(--brand-2)"}}>{v}</span>
  </div>
);

const SummaryRow = ({ label, value, children, mono }) => (
  <div style={{display:"grid", gridTemplateColumns:"110px 1fr", gap:10, fontSize:13, alignItems:"baseline"}}>
    <div style={{fontSize:11.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em"}}>{label}</div>
    <div style={{
      color:"var(--fg)",
      fontFamily: mono ? "var(--font-mono)" : "inherit",
      fontSize: mono ? 12 : 12,
      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
    }}>{value || children}</div>
  </div>
);

window.NewScan = NewScan;
