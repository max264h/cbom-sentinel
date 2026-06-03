// pages-misc.jsx — Reports, Tools, Settings

/* ---------- CBOM / SBOM Reports ---------- */
const Reports = () => {
  const t = useT();
  const [tab, setTab] = useState("cbom");
  return (
    <div className="page">
      <div className="row" style={{marginBottom:14}}>
        <div>
          <h1>{t("CBOM / SBOM 報表","CBOM / SBOM Reports")}</h1>
          <div className="hint" style={{marginTop:4}}>
            {t("產生、合併與下載 BOM 報表 · CycloneDX 1.6 schema","Generate, merge and download BOM reports · CycloneDX 1.6 schema")} · {fmt.n(KPI_DATA.cbomCount)} CBOMs · {fmt.n(KPI_DATA.sbomCount)} SBOMs
          </div>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="upload" size={13}/> {t("匯入 BOM","Import BOM")}</button>
        <button className="btn primary"><Icon name="plus" size={13}/> {t("產生報表","Generate report")}</button>
      </div>

      <div className="grid cols-4" style={{marginBottom:14}}>
        <KPI label={t("CBOM 產出","CBOM artifacts")} value={KPI_DATA.cbomCount} foot="CycloneDX 1.6 · crypto"/>
        <KPI label={t("SBOM 產出","SBOM artifacts")} value={KPI_DATA.sbomCount} foot="CycloneDX 1.6 · components"/>
        <KPI label={t("統整報表","Merged reports")} value={42} foot="multi-scan aggregates"/>
        <KPI label={t("驗證失敗","Validation failed")} value={KPI_DATA.validationFailed} tone="risk-warn" foot="schemas 1.5 / 1.6"/>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { value:"cbom", label:t("CBOM 報表","CBOM Reports"), count: KPI_DATA.cbomCount, icon:"shield" },
        { value:"sbom", label:t("SBOM 報表","SBOM Reports"), count: KPI_DATA.sbomCount, icon:"package" },
        { value:"merged", label:t("統整","Merged"),     count: 42,                  icon:"layers" },
      ]}/>

      <Card flush>
        <div className="filters">
          <div className="topbar-search" style={{width:280}}>
            <Icon name="search" size={13}/>
            <input placeholder={t("搜尋 report name / scope...","Search report name / scope...")}/>
          </div>
          <FilterPicker label="Schema" value="all" onChange={()=>{}} options={[
            {value:"all", label:"All"}, {value:"16", label:"CycloneDX 1.6"}, {value:"15", label:"CycloneDX 1.5"}
          ]}/>
          <FilterPicker label="Validation" value="all" onChange={()=>{}} options={[
            {value:"all", label:"All"}, {value:"pass", label:"Passed"}, {value:"fail", label:"Failed"}
          ]}/>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{width:32}}><Checkbox checked={false} onChange={()=>{}}/></th>
              <th>{t("報表","Report")}</th>
              <th>{t("類型","Type")}</th>
              <th>Schema</th>
              <th>{t("來源掃描","Source scans")}</th>
              <th className="num">{t("元件","Components")}</th>
              <th className="num">Crypto</th>
              <th>{t("驗證","Validation")}</th>
              <th>{t("大小","Size")}</th>
              <th>{t("產生時間","Generated")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[
              { name:"payments-prod · full.cbom.json", type:"CBOM", schema:"1.6", scans:6, comp:284, crypto:42, val:true, size:"284 KB", at:"32m ago"},
              { name:"payments-prod · full.sbom.json", type:"SBOM", schema:"1.6", scans:6, comp:1842, crypto:0, val:true, size:"1.2 MB", at:"32m ago"},
              { name:"edge-gateway · full.cbom.json", type:"CBOM", schema:"1.6", scans:2, comp:198, crypto:18, val:true, size:"212 KB", at:"11h ago"},
              { name:"payments-svc · v3.18.2", type:"CBOM", schema:"1.6", scans:1, comp:284, crypto:14, val:true, size:"196 KB", at:"16h ago"},
              { name:"TLS audit · *.corp.io", type:"CBOM", schema:"1.6", scans:1, comp:0, crypto:312, val:true, size:"840 KB", at:"19h ago"},
              { name:"registry weekly · prod", type:"SBOM", schema:"1.6", scans:1, comp:6428, crypto:0, val:true, size:"4.8 MB", at:"27h ago"},
              { name:"internal-tools sweep", type:"SBOM", schema:"1.5", scans:1, comp:1864, crypto:0, val:false, size:"2.1 MB", at:"39h ago"},
              { name:"auth-svc · v2.7.0", type:"CBOM", schema:"1.6", scans:1, comp:142, crypto:8, val:true, size:"112 KB", at:"63h ago"},
            ].map((r, i) => (
              <tr key={i}>
                <td><Checkbox checked={false} onChange={()=>{}}/></td>
                <td style={{fontFamily:"var(--font-mono)"}}>{r.name}</td>
                <td><Badge tone="brand" sq>{r.type}</Badge></td>
                <td className="mono">CycloneDX {r.schema}</td>
                <td>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:5,
                    background:"var(--bg-panel-3)", padding:"2px 8px", borderRadius:3, fontSize:12.5
                  }}>
                    {r.scans} {t("次掃描","scan")}{r.scans>1?"s":""}
                    <Icon name="chevronRight" size={11}/>
                  </span>
                </td>
                <td className="num">{r.comp ? fmt.n(r.comp) : "—"}</td>
                <td className="num">{r.crypto || "—"}</td>
                <td>{r.val ? <Badge tone="ok" sq>✓ PASS</Badge> : <Badge tone="high" sq>✗ FAIL</Badge>}</td>
                <td className="mono muted">{r.size}</td>
                <td className="muted">{r.at}</td>
                <td>
                  <div style={{display:"flex", gap:3}}>
                    <button className="icon-btn"><Icon name="eye" size={13}/></button>
                    <button className="icon-btn"><Icon name="download" size={13}/></button>
                    <button className="icon-btn"><Icon name="dots" size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ---------- Tools & Env ---------- */
const ToolsPage = () => {
  const t = useT();
  return (
    <div className="page">
      <div className="row" style={{marginBottom:14}}>
        <div>
          <h1>{t("工具與環境狀態","Tools & Environment")}</h1>
          <div className="hint" style={{marginTop:4}}>
            {t("掃描相依的外部工具 · 版本 · 上次成功使用時間 · 環境健康度","External tools required for scanning · version · last used · health")}
          </div>
        </div>
        <div className="spacer"/>
        <button className="btn"><Icon name="refresh" size={13}/> {t("重新偵測","Re-detect")}</button>
        <button className="btn primary"><Icon name="download" size={13}/> {t("安裝缺失工具","Install missing")}</button>
      </div>

      <div className="grid cols-4" style={{marginBottom:14}}>
        <MiniHealth label={t("正常","Healthy")} value={TOOLS.filter(t=>t.status==="ok").length} total={TOOLS.length} tone="ok"/>
        <MiniHealth label={t("版本偏舊","Drift")} value={TOOLS.filter(t=>t.status==="warn").length} total={TOOLS.length} tone="warn"/>
        <MiniHealth label={t("缺失","Missing")} value={TOOLS.filter(t=>t.status==="missing").length} total={TOOLS.length} tone="high"/>
        <MiniHealth label={t("最後偵測","Last detected")} value="2h ago" tone="info" raw/>
      </div>

      <div className="grid" style={{gridTemplateColumns:"2fr 1fr", gap:16}}>
        <Card title="External tool dependencies" meta="loaded via $PATH and --tools-dir" flush>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>{t("工具","Tool")}</th>
                <th>{t("角色","Role")}</th>
                <th>{t("版本","Version")}</th>
                <th>{t("路徑","Path")}</th>
                <th>{t("上次使用","Last used")}</th>
                <th>{t("狀態","Status")}</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((tool, i) => (
                <tr key={i}>
                  <td style={{width:38}}>
                    <div style={{
                      width:26, height:26, borderRadius:5,
                      background: tool.status === "ok" ? "var(--risk-ok-soft)" : tool.status === "warn" ? "var(--risk-warn-soft)" : "var(--risk-high-soft)",
                      color: tool.status === "ok" ? "var(--risk-ok)" : tool.status === "warn" ? "var(--risk-warn)" : "var(--risk-high)",
                      display:"grid", placeItems:"center"
                    }}>
                      <Icon name={tool.status === "ok" ? "check" : tool.status === "warn" ? "alert" : "x"} size={13}/>
                    </div>
                  </td>
                  <td style={{fontWeight:500, fontFamily:"var(--font-mono)"}}>{tool.name}</td>
                  <td className="muted">{tool.role}</td>
                  <td className="mono">{tool.version}</td>
                  <td className="mono muted">{tool.path}</td>
                  <td className="muted">{tool.lastUsed ? fmt.rel(tool.lastUsed) : "—"}</td>
                  <td>
                    {tool.status === "ok" && <Badge tone="ok" sq>READY</Badge>}
                    {tool.status === "warn" && (
                      <div className="tip" data-tip={tool.note}>
                        <Badge tone="warn" sq>DRIFT</Badge>
                      </div>
                    )}
                    {tool.status === "missing" && (
                      <div className="tip" data-tip={tool.note}>
                        <Badge tone="high" sq>MISSING</Badge>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title={t("環境","Environment")} meta={t("主機執行環境","host runtime")}>
          <div style={{display:"flex", flexDirection:"column", gap:0}}>
            {[
              { k:"Hostname", v:"cbom-runner-01.corp"},
              { k:"OS", v:"Debian 12.5 (bookworm)"},
              { k:"Kernel", v:"6.1.0-21-amd64"},
              { k:"CPU", v:"16 × Xeon Gold 5318"},
              { k:"RAM (used)", v:"6.4 / 32 GB"},
              { k:"Disk (free)", v:"482 / 1024 GB"},
              { k:"Worker pool", v:"8 / 16 max"},
              { k:"Uptime", v:"14d 6h"},
              { k:"Platform version", v:"cbom-sentinel 1.4.2"},
              { k:"License", v:"enterprise · seat 16/50"},
            ].map((row, i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"100px 1fr", gap:8,
                padding:"6px 0", borderBottom: i < 9 ? "1px solid var(--line-subtle)" : "none",
                fontSize:13
              }}>
                <span style={{color:"var(--fg-3)", fontSize:11.5, textTransform:"uppercase", letterSpacing:"0.06em"}}>{row.k}</span>
                <span style={{fontFamily:"var(--font-mono)"}}>{row.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{marginTop:16}}>
        <Card title={t("Worker 活動","Worker activity")} meta={t("最近 60 分鐘 · 佇列 + 活躍 workers","last 60 min · queue + active workers")}>
          <LineChart
            height={140}
            yTicks={3}
            series={[
              { name:t("活躍 workers","Active workers"), labels: ["−60m","−50m","−40m","−30m","−20m","−10m","now"], data:[2,3,5,6,8,7,8], color:"#5462a0", fillOpacity:0.16 },
              { name:t("佇列深度","Queue depth"), data:[0,1,2,3,1,2,1], color:"var(--brand-2)", fillOpacity:0.10 },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

const MiniHealth = ({ label, value, total, tone, raw }) => {
  const color = tone === "ok" ? "var(--risk-ok)" : tone === "warn" ? "var(--risk-warn)" : tone === "high" ? "var(--risk-high)" : "#aacddf";
  return (
    <div className="card" style={{padding:"12px 14px", flexDirection:"column", gap:6}}>
      <div style={{fontSize:11.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em"}}>{label}</div>
      <div style={{fontSize:24, fontWeight:600, color, fontVariantNumeric:"tabular-nums"}}>
        {value}{!raw && total != null && <span style={{color:"var(--fg-3)", fontSize:15, fontWeight:500}}> / {total}</span>}
      </div>
    </div>
  );
};

/* ---------- Settings ---------- */
const Settings = () => {
  const t = useT();
  const [section, setSection] = useState("general");
  const sections = [
    { value:"general",  label:t("一般","General") },
    { value:"sched",    label:t("排程","Schedules") },
    { value:"validation", label:t("驗證","Validation") },
    { value:"notify",   label:t("通知","Notifications") },
    { value:"access",   label:t("存取","Access") },
    { value:"api",      label:t("API 金鑰","API tokens") },
  ];

  return (
    <div className="page">
      <div className="row" style={{marginBottom:14}}>
        <div>
          <h1>{t("設定","Settings")}</h1>
          <div className="hint" style={{marginTop:4}}>
            {t("平台行為、整合與權限 · 對應設定檔","Platform behaviour, integrations & permissions · config file")} <span style={{fontFamily:"var(--font-mono)"}}>/etc/cbom/sentinel.yml</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:"180px 1fr", gap:18, alignItems:"flex-start"}}>
        <div style={{display:"flex", flexDirection:"column", gap:1, position:"sticky", top:68}}>
          {sections.map(s => (
            <div key={s.value}
              className={"nav-item" + (section === s.value ? " active" : "")}
              onClick={()=>setSection(s.value)}
              style={{paddingLeft:12}}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="col">
          {section === "general" && (
            <>
              <Card title={t("工作空間","Workspace")}>
                <div className="grid cols-2" style={{gap:14}}>
                  <div className="field">
                    <label className="field-label">Workspace name</label>
                    <input className="input" defaultValue="corp · production"/>
                  </div>
                  <div className="field">
                    <label className="field-label">Default output directory</label>
                    <input className="input mono" defaultValue="/var/lib/cbom/scans/"/>
                  </div>
                  <div className="field">
                    <label className="field-label">Timezone</label>
                    <select className="select" defaultValue="Asia/Taipei">
                      <option>Asia/Taipei</option><option>UTC</option><option>America/Los_Angeles</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Date format</label>
                    <select className="select" defaultValue="iso">
                      <option value="iso">2026-05-28 14:32</option>
                      <option value="us">May 28, 2026 2:32 PM</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card title={t("新掃描預設值","Defaults · new scans")}>
                <div className="grid cols-2" style={{gap:14}}>
                  <div className="field">
                    <label className="field-label">--max-workers</label>
                    <input className="input mono" defaultValue="8"/>
                  </div>
                  <div className="field">
                    <label className="field-label">--timeout (s)</label>
                    <input className="input mono" defaultValue="900"/>
                  </div>
                  <div className="field">
                    <label className="field-label">--recursive-depth</label>
                    <input className="input mono" defaultValue="8"/>
                  </div>
                  <div className="field">
                    <label className="field-label">--tools-dir</label>
                    <input className="input mono" defaultValue="/usr/local/bin"/>
                  </div>
                </div>
                <div style={{marginTop:14, display:"flex", flexDirection:"column", gap:0}}>
                  {[
                    { label:"--validate · CycloneDX 1.6 schema validation", on:true},
                    { label:"--keep-artifacts · retain per-target outputs", on:true},
                    { label:"--fail-fast · abort batch on first target failure", on:false},
                    { label:"--no-docker · skip Docker probes by default", on:false},
                  ].map((r,i) => (
                    <div key={i} style={{
                      display:"flex", alignItems:"center", gap:10,
                      padding:"8px 0", borderBottom: i < 3 ? "1px solid var(--line-subtle)" : "none"
                    }}>
                      <Switch on={r.on} onChange={()=>{}}/>
                      <span style={{fontSize:13, fontFamily:"var(--font-mono)", color:"var(--fg-2)"}}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {section === "sched" && (
            <Card title={t("排程掃描","Scheduled scans")} actions={<button className="btn primary sm"><Icon name="plus" size={11}/> New schedule</button>}>
              <table className="table">
                <thead>
                  <tr><th>{t("名稱","Name")}</th><th>Cron</th><th>{t("下次執行","Next run")}</th><th>{t("類型","Type")}</th><th>{t("狀態","Status")}</th><th></th></tr>
                </thead>
                <tbody>
                  {[
                    { n:"Production API weekly", c:"0 4 * * 1", next:"Mon 04:00", t:"all", on:true},
                    { n:"edge-gateway nightly", c:"0 3 * * *", next:"Tomorrow 03:00", t:"NET · SBM", on:true},
                    { n:"Registry weekly · prod", c:"0 2 * * 0", next:"Sun 02:00", t:"CTR · SBM", on:true},
                    { n:"Quarterly external surface", c:"0 1 1 */3 *", next:"2026-08-01 01:00", t:"NET", on:false},
                  ].map((r,i) => (
                    <tr key={i}>
                      <td>{r.n}</td>
                      <td className="mono">{r.c}</td>
                      <td className="muted">{r.next}</td>
                      <td><Badge tone="brand" sq>{r.t}</Badge></td>
                      <td><Switch on={r.on} onChange={()=>{}}/></td>
                      <td><button className="icon-btn"><Icon name="dots" size={13}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {section === "validation" && (
            <Card title={t("CycloneDX 驗證","CycloneDX validation")}>
              <div className="grid cols-2" style={{gap:14}}>
                <div className="field">
                  <label className="field-label">Default schema version</label>
                  <select className="select" defaultValue="1.6">
                    <option>1.6</option><option>1.5</option><option>1.4</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Validator binary</label>
                  <input className="input mono" defaultValue="/usr/local/bin/cyclonedx"/>
                </div>
              </div>
              <div style={{marginTop:14, display:"flex", flexDirection:"column", gap:0}}>
                {[
                  { l:"Fail scan if validation fails", on:true},
                  { l:"Auto-retry validation on transient errors", on:true},
                  { l:"Strict mode · reject unknown fields", on:false},
                ].map((r,i) => (
                  <div key={i} style={{padding:"8px 0", borderBottom:i<2?"1px solid var(--line-subtle)":"none", display:"flex", alignItems:"center", gap:10}}>
                    <Switch on={r.on} onChange={()=>{}}/>
                    <span style={{fontSize:13.5}}>{r.l}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {section === "notify" && (
            <Card title={t("通知頻道","Notification channels")}>
              <div style={{display:"flex", flexDirection:"column", gap:1}}>
                {[
                  { ch:"Slack · #sec-ops", events:"scan failed · cert expiring · validation failed", on:true},
                  { ch:"Slack · #release-payments", events:"release scan completed", on:true},
                  { ch:"PagerDuty · sec-oncall", events:"high-risk findings · expired cert in prod", on:true},
                  { ch:"Email · [email protected]", events:"weekly digest", on:false},
                  { ch:"Webhook · jira.corp", events:"new HIGH finding", on:true},
                ].map((r,i) => (
                  <div key={i} style={{
                    display:"grid", gridTemplateColumns:"1fr 2fr auto", gap:14, alignItems:"center",
                    padding:"10px 0", borderBottom: i < 4 ? "1px solid var(--line-subtle)" : "none"
                  }}>
                    <span style={{fontFamily:"var(--font-mono)", fontSize:13.5}}>{r.ch}</span>
                    <span style={{color:"var(--fg-3)", fontSize:12.5}}>{r.events}</span>
                    <Switch on={r.on} onChange={()=>{}}/>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {section === "access" && (
            <Card title={t("團隊成員","Team members")} actions={<button className="btn primary sm"><Icon name="plus" size={11}/> Invite</button>}>
              <table className="table">
                <thead>
                  <tr><th>{t("使用者","User")}</th><th>Email</th><th>{t("角色","Role")}</th><th>{t("最後活躍","Last active")}</th><th>{t("狀態","Status")}</th></tr>
                </thead>
                <tbody>
                  {[
                    { n:"James Huang", e:"j.huang@corp", r:"Admin", la:"now", s:"active"},
                    { n:"Kim Lin", e:"kim.l@corp", r:"Editor", la:"2h ago", s:"active"},
                    { n:"SecOps Bot", e:"secops@corp", r:"Editor", la:"32m ago", s:"system"},
                    { n:"Anita Tang", e:"a.tang@corp", r:"Viewer", la:"1d ago", s:"active"},
                    { n:"CI · payments-svc", e:"ci@payments-svc", r:"Editor", la:"16h ago", s:"system"},
                  ].map((u,i) => (
                    <tr key={i}>
                      <td>{u.n}</td>
                      <td className="muted">{u.e}</td>
                      <td><Badge sq tone={u.r === "Admin" ? "brand" : u.r === "Editor" ? "info" : ""}>{u.r}</Badge></td>
                      <td className="muted">{u.la}</td>
                      <td><Badge tone={u.s==="active"?"ok":""} sq>{u.s}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {section === "api" && (
            <Card title={t("API 金鑰","API tokens")} actions={<button className="btn primary sm"><Icon name="plus" size={11}/> New token</button>}>
              <table className="table">
                <thead>
                  <tr><th>{t("名稱","Name")}</th><th>Token</th><th>{t("權限範圍","Scope")}</th><th>{t("建立時間","Created")}</th><th>{t("上次使用","Last used")}</th><th></th></tr>
                </thead>
                <tbody>
                  {[
                    { n:"ci-payments-svc", t:"cbom_5Yh…HZ4q", s:"scan:write · report:read", c:"2025-09-12", lu:"16h ago"},
                    { n:"ci-auth-svc", t:"cbom_8w8…uV9k", s:"scan:write", c:"2025-09-22", lu:"63h ago"},
                    { n:"grafana-datasource", t:"cbom_x21…GFa1", s:"report:read", c:"2025-11-01", lu:"32m ago"},
                  ].map((r,i) => (
                    <tr key={i}>
                      <td>{r.n}</td>
                      <td className="mono">{r.t}</td>
                      <td className="muted">{r.s}</td>
                      <td className="muted">{r.c}</td>
                      <td className="muted">{r.lu}</td>
                      <td>
                        <div style={{display:"flex", gap:3}}>
                          <button className="icon-btn"><Icon name="refresh" size={13}/></button>
                          <button className="icon-btn"><Icon name="trash" size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

window.Reports = Reports;
window.ToolsPage = ToolsPage;
window.Settings = Settings;
