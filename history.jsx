// history.jsx — Scan history page with filters / batch ops / detail drawer

const ScanHistory = ({ onNavigate }) => {
  const t = useT();
  const [selected, setSelected] = useState(new Set());
  const [drawerScan, setDrawerScan] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = SCAN_HISTORY.filter(s => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (typeFilter !== "all" && !s.types.includes(typeFilter)) return false;
    if (search && !(s.name + " " + s.id + " " + s.scope).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));
  const someSelected = filtered.some(s => selected.has(s.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(filtered.map(s => s.id)));
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  return (
    <div className="page">
      <div className="row" style={{marginBottom:16}}>
        <div>
          <h1>{t("掃描紀錄","Scan History")}</h1>
          <div className="hint" style={{marginTop:4}}>
            {fmt.n(SCAN_HISTORY.length)} {t("筆紀錄","records")} · {t("顯示","showing")} {fmt.n(filtered.length)} {t("筆","")} · {t("統整後可下載 / 比較 / 重新掃描","merge, compare or re-run")}
          </div>
        </div>
        <div className="spacer"/>
        <button className="btn">
          <Icon name="download" size={13}/> Export
        </button>
        <button className="btn primary" onClick={()=>onNavigate("scan")}>
          <Icon name="plus" size={13}/> New scan
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid cols-5" style={{marginBottom:14}}>
        <MiniStat label={t("執行中","Running")} value={SCAN_HISTORY.filter(s=>s.status==="running").length} tone="info" status="running"/>
        <MiniStat label={t("成功 (7d)","Success (7d)")} value={SCAN_HISTORY.filter(s=>s.status==="success").length} tone="ok" status="success"/>
        <MiniStat label={t("部分失敗","Partial")} value={SCAN_HISTORY.filter(s=>s.status==="partial").length} tone="warn" status="partial"/>
        <MiniStat label={t("失敗","Failed")} value={SCAN_HISTORY.filter(s=>s.status==="failed").length} tone="high" status="failed"/>
        <MiniStat label={t("驗證通過","Validation OK")} value={SCAN_HISTORY.filter(s=>s.validated).length + " / " + SCAN_HISTORY.filter(s=>s.validated!==null).length} status="success"/>
      </div>

      <Card flush>
        {/* Filter bar */}
        <div className="filters">
          <div className="topbar-search" style={{width:280}}>
            <Icon name="search" size={13}/>
            <input
              placeholder={t("搜尋掃描名稱 / scope / id...","Search scan name / scope / id...")}
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <FilterPicker
            label={t("狀態","Status")}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              {value:"all",     label:"All"},
              {value:"running", label:t("執行中","Running")},
              {value:"success", label:"Success"},
              {value:"partial", label:t("部分失敗","Partial")},
              {value:"failed",  label:t("失敗","Failed")},
            ]}
          />
          <FilterPicker
            label={t("類型","Type")}
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              {value:"all",       label:"All"},
              {value:"source",    label:"Source code"},
              {value:"network",   label:"Network"},
              {value:"container", label:"Container"},
              {value:"sbom",      label:"SBOM"},
            ]}
          />
          <FilterPicker
            label={t("已驗證","Validated")}
            value="all"
            onChange={()=>{}}
            options={[
              {value:"all", label:"All"},
              {value:"yes", label:"Passed"},
              {value:"no",  label:t("失敗","Failed")},
            ]}
          />
          <div className="spacer"/>
          <span className="hint" style={{fontFamily:"var(--font-mono)"}}>
            sort: started ↓
          </span>
          <button className="icon-btn"><Icon name="sliders" size={14}/></button>
        </div>

        {/* Batch ops bar (slides when selected) */}
        {selected.size > 0 && (
          <div style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"10px 14px",
            background:"rgba(84,98,160,0.18)",
            borderBottom:"1px solid rgba(84,98,160,0.4)",
            fontSize:13.5
          }}>
            <Checkbox checked={true} onChange={()=>setSelected(new Set())}/>
            <span><strong>{selected.size}</strong> {t("已選擇","selected")}</span>
            <div className="spacer"/>
            <button className="btn sm"><Icon name="layers" size={12}/> {t("統整 CBOM","Merge CBOM")}</button>
            <button className="btn sm"><Icon name="layers" size={12}/> {t("統整 SBOM","Merge SBOM")}</button>
            <button className="btn sm"><Icon name="diff" size={12}/> Compare</button>
            <button className="btn sm"><Icon name="download" size={12}/> Export</button>
            <button className="btn sm danger"><Icon name="trash" size={12}/> Delete</button>
          </div>
        )}

        <div style={{overflowX:"auto"}}>
          <table className="table">
            <thead>
              <tr>
                <th style={{width:34}}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>{t("掃描名稱","Scan name")}</th>
                <th>{t("類型","Type")}</th>
                <th>{t("狀態","Status")}</th>
                <th>{t("範圍",t("掃描範圍","Scope"))}</th>
                <th className="num">{t("目標",t("目標","Targets"))}</th>
                <th className="num">{t("產出",t("產出","Artifacts"))}</th>
                <th>{t("時長",t("時長","Duration"))}</th>
                <th>CycloneDX</th>
                <th>{t("觸發","Triggered by")}</th>
                <th>{t("開始時間","Started at")}</th>
                <th style={{width:80}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <ScanRow
                  key={s.id}
                  scan={s}
                  selected={selected.has(s.id)}
                  onToggle={() => toggleOne(s.id)}
                  onOpen={() => setDrawerScan(s)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding:"10px 14px", display:"flex", alignItems:"center",
          fontSize:12.5, color:"var(--fg-3)", borderTop:"1px solid var(--line-subtle)"
        }}>
          {t("顯示","Showing")} 1 - {filtered.length} {t("of","")} {fmt.n(SCAN_HISTORY.length)} {t("筆","records")}
          <div className="spacer"/>
          <div className="row" style={{gap:4}}>
            <button className="btn ghost sm" disabled><Icon name="chevronLeft" size={11}/></button>
            <span style={{padding:"0 8px"}}>1</span>
            <button className="btn ghost sm" disabled><Icon name="chevronRight" size={11}/></button>
          </div>
        </div>
      </Card>

      {drawerScan && <ScanDetailDrawer scan={drawerScan} onClose={()=>setDrawerScan(null)}/>}
    </div>
  );
};

const ScanRow = ({ scan, selected, onToggle, onOpen }) => {
  const t = useT();
  const statusLabel = {
    running: t("執行中","Running"),
    success: "Success",
    partial: t("部分失敗","Partial"),
    failed: t("失敗","Failed"),
    queued: "Queued",
    cancelled: "Cancelled",
  }[scan.status];
  const statusTone = {
    running: "info", success: "ok", partial: "warn", failed: "high"
  }[scan.status];

  return (
    <tr className={selected ? "selected" : ""}>
      <td><Checkbox checked={selected} onChange={onToggle}/></td>
      <td>
        <div style={{display:"flex", flexDirection:"column", gap:1, minWidth:0}} onClick={onOpen} role="button">
          <a style={{color:"var(--fg)", cursor:"pointer", fontWeight:500}} onClick={onOpen}>{scan.name}</a>
          <span style={{fontFamily:"var(--font-mono)", fontSize:11.5, color:"var(--fg-3)"}}>{scan.id}</span>
        </div>
      </td>
      <td>
        <div style={{display:"flex", gap:3}}>
          {scan.types.map(t => (
            <Badge key={t} tone="brand" sq>{
              t === "source" ? "SRC" : t === "network" ? "NET" : t === "container" ? "CTR" : "SBM"
            }</Badge>
          ))}
        </div>
      </td>
      <td>
        {scan.status === "running" ? (
          <div style={{display:"flex", flexDirection:"column", gap:3, width:120}}>
            <Badge tone="info" dot>Running {Math.round(scan.progress*100)}%</Badge>
            <div className="bar" style={{width:"100%"}}>
              <span style={{width:(scan.progress*100)+"%", background:"var(--brand-2)"}}/>
            </div>
          </div>
        ) : (
          <Badge tone={statusTone} dot>{statusLabel}</Badge>
        )}
      </td>
      <td>
        <span className="target-chip" title={scan.scope}>{scan.scope}</span>
      </td>
      <td className="num">{scan.targets}</td>
      <td className="num">
        <span style={{color:"var(--risk-ok)"}}>{scan.artifactsOk}</span>
        {scan.artifactsFail > 0 && <>
          <span style={{color:"var(--fg-3)", margin:"0 3px"}}>/</span>
          <span style={{color:"var(--risk-high)"}}>{scan.artifactsFail}</span>
        </>}
      </td>
      <td className="mono">{scan.status === "running" ? "—" : fmt.dur(scan.duration)}</td>
      <td>
        {scan.validated === true && <Badge tone="ok" sq>✓ PASS</Badge>}
        {scan.validated === false && <Badge tone="high" sq>✗ FAIL</Badge>}
        {scan.validated === null && <span style={{color:"var(--fg-3)"}}>—</span>}
      </td>
      <td className="muted" style={{fontFamily:"var(--font-mono)", fontSize:12}}>{scan.triggeredBy}</td>
      <td>
        <div style={{display:"flex", flexDirection:"column", lineHeight:1.3}}>
          <span style={{fontFamily:"var(--font-mono)", fontSize:12}}>{fmt.dateTime(scan.startedAt)}</span>
          <span style={{fontSize:11.5, color:"var(--fg-3)"}}>{fmt.rel(scan.startedAt)}</span>
        </div>
      </td>
      <td>
        <div className="row-actions">
          <button className="icon-btn" onClick={onOpen} title="View"><Icon name="eye" size={13}/></button>
          <button className="icon-btn" title="Re-run"><Icon name="refresh" size={13}/></button>
          <button className="icon-btn" title="Download"><Icon name="download" size={13}/></button>
          <button className="icon-btn" title="More"><Icon name="dots" size={13}/></button>
        </div>
      </td>
    </tr>
  );
};

const MiniStat = ({ label, value, status }) => (
  <div className="card" style={{padding:"10px 12px", flexDirection:"row", alignItems:"center", gap:12}}>
    <StatusDot status={status}/>
    <div style={{display:"flex", flexDirection:"column", gap:2}}>
      <span style={{fontSize:11.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em"}}>{label}</span>
      <span style={{fontSize:20, fontWeight:600, fontVariantNumeric:"tabular-nums"}}>{value}</span>
    </div>
  </div>
);

const FilterPicker = ({ label, value, onChange, options }) => (
  <div style={{display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--fg-3)"}}>
    <span style={{fontSize:11.5, textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--fg-3)"}}>{label}</span>
    <select
      className="select"
      value={value}
      onChange={e=>onChange(e.target.value)}
      style={{height:26, padding:"2px 26px 2px 8px", fontSize:13, width:"auto", minWidth:110}}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const ScanDetailDrawer = ({ scan, onClose }) => {
  const t = useT();
  const hasCbom = scan.artifacts.includes("full.cbom.json");
  const hasSbom = scan.artifacts.includes("full.sbom.json");
  const [graphKind, setGraphKind] = useState(hasCbom ? "cbom" : hasSbom ? "sbom" : null);
  const graph = graphKind ? getDepGraph(scan, graphKind) : null;
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <div className="drawer">
        {/* Head */}
        <div style={{padding:"14px 18px", borderBottom:"1px solid var(--line-subtle)"}}>
          <div className="row" style={{marginBottom:6}}>
            <h2 style={{flex:1}}>{scan.name}</h2>
            <button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
          <div style={{display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", fontSize:12.5, color:"var(--fg-3)"}}>
            <span style={{fontFamily:"var(--font-mono)"}}>{scan.id}</span>
            <span>·</span>
            <span>{fmt.dateTime(scan.startedAt)}</span>
            <span>·</span>
            <span>{fmt.rel(scan.startedAt)}</span>
            <span>·</span>
            <span style={{fontFamily:"var(--font-mono)"}}>triggered by {scan.triggeredBy}</span>
          </div>
        </div>

        <div style={{overflowY:"auto", flex:1, padding:"16px 18px"}}>
          {/* Status banner */}
          <div style={{
            padding:"10px 12px", borderRadius:4, marginBottom:14,
            background: scan.status === "failed" ? "var(--risk-high-soft)"
                      : scan.status === "partial" ? "var(--risk-warn-soft)"
                      : scan.status === "running" ? "var(--risk-info-soft)"
                      : "var(--risk-ok-soft)",
            borderLeft: "2px solid " + (
              scan.status === "failed" ? "var(--risk-high)"
              : scan.status === "partial" ? "var(--risk-warn)"
              : scan.status === "running" ? "var(--brand-2)" : "var(--risk-ok)"
            ),
            display:"flex", alignItems:"center", gap:10, fontSize:13.5
          }}>
            <StatusDot status={scan.status}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:500, color:"var(--fg)"}}>
                {scan.status === "running" ? `${t("執行中","Running")} · ${Math.round(scan.progress*100)}% ${t("完成","complete")}`
                  : scan.status === "success" ? t("掃描成功完成","Scan completed successfully")
                  : scan.status === "partial" ? `${scan.artifactsFail} ${t("of","")} ${scan.artifactsOk + scan.artifactsFail} ${t("個產出失敗","artifacts failed")}`
                  : scan.status === "failed" ? t("掃描失敗","Scan failed before completion")
                  : "Unknown"}
              </div>
              {scan.error && <div style={{color:"var(--risk-high)", fontFamily:"var(--font-mono)", fontSize:12, marginTop:2}}>{scan.error}</div>}
            </div>
          </div>

          {/* Summary metrics */}
          <div className="grid cols-2" style={{gap:10, marginBottom:18}}>
            <MetricBox label={t("時長","Duration")} value={scan.status === "running" ? "—" : fmt.dur(scan.duration)} mono/>
            <MetricBox label={t("目標","Targets")} value={scan.targets} mono/>
            <MetricBox label={t("產出","Artifacts")} value={`${scan.artifactsOk} / ${scan.artifactsOk + scan.artifactsFail}`} mono tone={scan.artifactsFail > 0 ? "warn" : "ok"}/>
            <MetricBox label="CycloneDX" value={scan.validated === true ? "PASS" : scan.validated === false ? "FAIL" : "—"} mono tone={scan.validated === true ? "ok" : scan.validated === false ? "high" : ""}/>
          </div>

          {/* Pipeline stages */}
          <h3 style={{marginBottom:8}}>Pipeline stages</h3>
          <div style={{display:"flex", flexDirection:"column", gap:0, marginBottom:18}}>
            {[
              { name:"detect",    status:"ok" },
              { name:"scan",      status: scan.status === "running" ? "running" : "ok" },
              { name:"aggregate", status: scan.status === "running" ? "queued" : scan.artifactsFail > 0 ? "warn" : "ok" },
              { name:"validate",  status: scan.status === "running" ? "queued" : scan.validated === false ? "fail" : "ok" },
              { name:"export",    status: scan.status === "running" || scan.status === "failed" ? "queued" : "ok" },
            ].map((stg,i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"24px 1fr auto", gap:10, alignItems:"center",
                padding:"8px 0", borderBottom: i < 4 ? "1px solid var(--line-subtle)" : "none"
              }}>
                <div style={{
                  width:18, height:18, borderRadius:"50%",
                  display:"grid", placeItems:"center", fontSize:11,
                  background: stg.status === "ok" ? "rgba(76,175,125,0.18)"
                            : stg.status === "warn" ? "var(--risk-warn-soft)"
                            : stg.status === "fail" ? "var(--risk-high-soft)"
                            : stg.status === "running" ? "var(--risk-info-soft)"
                            : "var(--overlay-3)",
                  color: stg.status === "ok" ? "var(--risk-ok)"
                       : stg.status === "warn" ? "var(--risk-warn)"
                       : stg.status === "fail" ? "var(--risk-high)"
                       : stg.status === "running" ? "var(--brand-2)"
                       : "var(--fg-4)"
                }}>
                  {stg.status === "ok" ? "✓" : stg.status === "fail" ? "✗" : stg.status === "running" ? "•" : i+1}
                </div>
                <span style={{fontFamily:"var(--font-mono)", fontSize:13.5}}>{stg.name}</span>
                <Badge tone={
                  stg.status === "ok" ? "ok"
                  : stg.status === "warn" ? "warn"
                  : stg.status === "fail" ? "high"
                  : stg.status === "running" ? "info"
                  : ""
                } sq>{stg.status === "queued" ? "WAIT" : stg.status.toUpperCase()}</Badge>
              </div>
            ))}
          </div>

          {/* Scope */}
          <h3 style={{marginBottom:8}}>Scope</h3>
          <pre style={{
            background:"var(--bg-panel-3)", border:"1px solid var(--line-subtle)",
            padding:"10px 12px", borderRadius:4, fontFamily:"var(--font-mono)", fontSize:12.5,
            color:"var(--brand-2)", margin:0, marginBottom:18, whiteSpace:"pre-wrap"
          }}>{scan.scope}</pre>

          {/* Dependency graph */}
          <div style={{display:"flex", alignItems:"center", marginBottom:8}}>
            <h3 style={{flex:1}}>Dependency graph</h3>
            {(hasCbom || hasSbom) && (
              <Segmented
                value={graphKind}
                onChange={setGraphKind}
                options={[
                  ...(hasCbom ? [{value:"cbom", label:"CBOM · crypto"}] : []),
                  ...(hasSbom ? [{value:"sbom", label:"SBOM · components"}] : []),
                ]}
              />
            )}
          </div>
          {graph ? (
            <div style={{marginBottom:18}}>
              <div style={{
                display:"flex", alignItems:"center", gap:8, marginBottom:8,
                fontSize:12, color:"var(--fg-3)"
              }}>
                <Icon name={graphKind === "cbom" ? "shield" : "package"} size={13}/>
                <span style={{fontFamily:"var(--font-mono)"}}>
                  {graphKind === "cbom" ? "full.cbom.json" : "full.sbom.json"}
                </span>
                <span>·</span>
                <span>{graph.nodes.length} nodes · {graph.edges.length} edges</span>
                <div className="spacer"/>
                <span className="hint">hover a node to trace</span>
              </div>
              <DependencyGraph
                graph={graph}
                height={graphKind === "cbom" ? 380 : 360}
              />
              <DepGraphLegend kinds={graphKind === "cbom" ? ["root","target","cert","key","algo"] : ["root","package","library"]}/>
            </div>
          ) : (
            <div style={{
              padding:"18px", marginBottom:18, textAlign:"center",
              border:"1px dashed var(--line)", borderRadius:"var(--r)",
              color:"var(--fg-4)", fontSize:12.5
            }}>
              No CBOM / SBOM produced for this scan — dependency graph unavailable.
            </div>
          )}

          {/* Artifacts */}
          <h3 style={{marginBottom:8}}>Output artifacts</h3>
          <div style={{display:"flex", flexDirection:"column", gap:1, marginBottom:14}}>
            {["full.cbom.json","full.sbom.json","asset_manifest.json","scan_summary.json","accuracy_report.json","pipeline_report.json"].map(f => {
              const present = scan.artifacts.includes(f);
              return (
                <div key={f} style={{
                  display:"grid", gridTemplateColumns:"auto 1fr auto auto", gap:10, alignItems:"center",
                  padding:"7px 4px", borderBottom:"1px solid var(--line-subtle)",
                  opacity: present ? 1 : 0.45
                }}>
                  <Icon name="file" size={13}/>
                  <span style={{fontFamily:"var(--font-mono)", fontSize:12.5}}>{f}</span>
                  <span style={{fontSize:11.5, color:"var(--fg-3)", fontFamily:"var(--font-mono)"}}>
                    {present ? (f.includes("cbom") ? "284 KB" : f.includes("sbom") ? "1.2 MB" : "12 KB") : "—"}
                  </span>
                  {present ? (
                    <button className="icon-btn"><Icon name="download" size={12}/></button>
                  ) : (
                    <Badge sq>SKIPPED</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{padding:"12px 18px", borderTop:"1px solid var(--line-subtle)", display:"flex", gap:8, background:"var(--bg-panel)"}}>
          <button className="btn"><Icon name="diff" size={13}/> {t("比較","Compare")}</button>
          <button className="btn"><Icon name="refresh" size={13}/> {t("重新執行","Re-run")}</button>
          <div className="spacer"/>
          <button className="btn"><Icon name="download" size={13}/> {t("下載全部","Download all")}</button>
          <button className="btn primary"><Icon name="layers" size={13}/> {t("加入報表","Add to report")}</button>
        </div>
      </div>
    </>
  );
};

const MetricBox = ({ label, value, mono, tone }) => (
  <div style={{
    padding:"10px 12px",
    background:"var(--bg-panel)",
    borderRadius:4,
    border:"1px solid var(--line-subtle)"
  }}>
    <div style={{fontSize:11.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3}}>{label}</div>
    <div style={{
      fontSize:18, fontWeight:600,
      fontFamily: mono ? "var(--font-mono)" : "inherit",
      fontVariantNumeric:"tabular-nums",
      color: tone === "high" ? "var(--risk-high)" : tone === "warn" ? "var(--risk-warn)" : tone === "ok" ? "var(--risk-ok)" : "var(--fg)"
    }}>{value}</div>
  </div>
);

window.ScanHistory = ScanHistory;
