// summary.jsx — Overview dashboard

const Summary = ({ onNavigate }) => {
  const expiringTotal = KPI_DATA.expiringSoon.d30 + KPI_DATA.expiringSoon.d60 + KPI_DATA.expiringSoon.d90;
  const lastScanRel = fmt.rel(KPI_DATA.lastScanAt);

  return (
    <div className="page">
      {/* Page header */}
      <div className="row" style={{marginBottom:16}}>
        <div>
          <h1>摘要總覽</h1>
          <div className="hint" style={{marginTop:4}}>
            目前系統掌握的加密資產與掃描風險全景 · 最近一次掃描 {lastScanRel}
          </div>
        </div>
        <div className="spacer"/>
        <Segmented value="7d" onChange={()=>{}} options={[
          {value:"24h", label:"24h"},
          {value:"7d",  label:"7d"},
          {value:"30d", label:"30d"},
          {value:"90d", label:"90d"},
        ]}/>
        <button className="btn">
          <Icon name="refresh" size={13}/> Refresh
        </button>
        <button className="btn primary" onClick={()=>onNavigate("scan")}>
          <Icon name="plus" size={13}/> New scan
        </button>
      </div>

      {/* KPI row 1 — operations */}
      <div className="grid cols-5" style={{marginBottom:14}}>
        <KPI
          label="總掃描次數"
          value={fmt.n(KPI_DATA.totalScans)}
          delta={KPI_DATA.totalScansDelta.replace(/^\+|this week/g,"").trim()}
          deltaDir="up"
          foot="this week"
        />
        <KPI
          label="最近一次掃描"
          value={lastScanRel}
          foot={"scn-2026-0528-0432 · running 62%"}
        />
        <KPI
          label="成功率 (7d)"
          value={(KPI_DATA.successRate*100).toFixed(1)}
          unit="%"
          delta="-0.6"
          deltaDir="down"
          foot="vs. previous 7d"
          tone="risk-ok"
        />
        <KPI
          label="驗證失敗 (CycloneDX)"
          value={KPI_DATA.validationFailed}
          delta="+2"
          deltaDir="up"
          foot="schemas 1.5 / 1.6"
          tone={KPI_DATA.validationFailed > 0 ? "risk-warn" : ""}
        />
        <KPI
          label="已產生 CBOM / SBOM"
          value={`${KPI_DATA.cbomCount} / ${KPI_DATA.sbomCount}`}
          foot={`${fmt.n(KPI_DATA.componentsTracked)} components tracked`}
        />
      </div>

      {/* KPI row 2 — risk */}
      <div className="grid cols-5" style={{marginBottom:18}}>
        <KPI
          label="高風險憑證"
          value={KPI_DATA.highRiskCerts}
          delta={KPI_DATA.highRiskCertsDelta.replace(/^\+/,"").replace("vs last week","").trim()}
          deltaDir="up"
          foot="vs. last week"
          tone="risk-high"
        />
        <KPI
          label="已過期憑證"
          value={KPI_DATA.expiredCerts}
          foot={`needs rotation · ${KPI_DATA.expiredCerts} assets`}
          tone="risk-high"
        />
        <KPI
          label="30天內到期"
          value={KPI_DATA.expiringSoon.d30}
          foot={`60d ${KPI_DATA.expiringSoon.d60} · 90d ${KPI_DATA.expiringSoon.d90}`}
          tone="risk-warn"
        />
        <KPI
          label="弱演算法使用"
          value={KPI_DATA.weakAlgos}
          foot={`RSA<2048 · ${KPI_DATA.weakAlgosBreakdown["RSA<2048"]} · SHA-1 · ${KPI_DATA.weakAlgosBreakdown["SHA-1"]}`}
          tone="risk-warn"
        />
        <KPI
          label="TLS 1.0 / 1.1 暴露"
          value={KPI_DATA.weakAlgosBreakdown["TLS 1.0/1.1"]}
          foot="hosts still accepting"
          tone="risk-high"
        />
      </div>

      {/* Row: scan trend + scan type donut */}
      <div className="grid" style={{gridTemplateColumns:"2fr 1fr", marginBottom:16}}>
        <Card
          title="掃描趨勢 · 14 days"
          meta="success / failed runs"
          actions={
            <Segmented value="daily" onChange={()=>{}} options={[
              {value:"daily", label:"Daily"},
              {value:"weekly", label:"Weekly"},
            ]}/>
          }
        >
          <LineChart
            height={210}
            series={[
              { name:"Successful", data: SCAN_TREND.success, labels: SCAN_TREND.labels, color: "#5462a0", fillOpacity: 0.18 },
              { name:"Failed",     data: SCAN_TREND.failed,  labels: SCAN_TREND.labels, color: "var(--risk-high)", fillOpacity: 0.08 },
            ]}
          />
        </Card>

        <Card title="掃描類型分布" meta="all-time">
          <Donut
            data={SCAN_TYPE_DIST}
            centerLabel={fmt.n(SCAN_TYPE_DIST.reduce((s,d)=>s+d.value,0))}
            centerSub="SCANS"
            size={170}
          />
        </Card>
      </div>

      {/* Row: cert expiry + cert risk */}
      <div className="grid" style={{gridTemplateColumns:"1fr 1fr", marginBottom:16}}>
        <Card
          title="憑證到期時間軸"
          meta="未來 180 天內"
          actions={
            <button className="btn ghost sm" onClick={()=>onNavigate("assets")}>
              View all <Icon name="arrowRight" size={11}/>
            </button>
          }
        >
          <ExpiryTimeline buckets={EXPIRY_BUCKETS}/>
          <div style={{
            marginTop:12, padding:"8px 10px",
            background:"var(--risk-high-soft)",
            borderLeft:"2px solid #e05c5c",
            borderRadius:3,
            display:"flex", alignItems:"center", gap:8,
            fontSize:13, color:"var(--fg-2)"
          }}>
            <Icon name="alert" size={14}/>
            <span><strong style={{color:"var(--risk-high)"}}>{KPI_DATA.expiredCerts} certs</strong> have already expired and are still observed in production traffic.</span>
            <div className="spacer"/>
            <button className="btn sm">Triage</button>
          </div>
        </Card>

        <Card title="憑證風險分布" meta={fmt.n(CERT_RISK_DIST.reduce((s,d)=>s+d.value,0)) + " certs observed"}>
          <Donut data={CERT_RISK_DIST} size={160}/>
        </Card>
      </div>

      {/* Row: algo distribution + SBOM ecosystem */}
      <div className="grid cols-2" style={{marginBottom:16}}>
        <Card title="加密演算法分布" meta="public-key algos">
          <HBar
            data={ALGO_DIST}
            valueFmt={v => fmt.n(v)}
          />
        </Card>
        <Card title="SBOM 元件生態分布" meta={fmt.n(SBOM_ECOSYSTEM.reduce((s,d)=>s+d.value,0)) + " components"}>
          <HBar
            data={SBOM_ECOSYSTEM}
            valueFmt={v => fmt.n(v)}
          />
        </Card>
      </div>

      {/* Row: top risk assets + scan duration */}
      <div className="grid" style={{gridTemplateColumns:"1.4fr 1fr", marginBottom:16}}>
        <Card
          title="Top Risk Assets"
          meta="ranked by high-risk crypto findings"
          actions={
            <button className="btn ghost sm" onClick={()=>onNavigate("assets")}>
              Asset inventory <Icon name="arrowRight" size={11}/>
            </button>
          }
        >
          <div style={{display:"flex", flexDirection:"column"}}>
            {TOP_RISK_ASSETS.map((a, i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"24px 1fr auto auto", gap:12,
                alignItems:"center", padding:"9px 0",
                borderBottom: i < TOP_RISK_ASSETS.length-1 ? "1px solid var(--line-subtle)" : "none"
              }}>
                <span style={{
                  fontFamily:"var(--font-mono)", fontSize:12, color:"var(--fg-3)", textAlign:"right"
                }}>#{i+1}</span>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13.5, fontFamily:"var(--font-mono)", color:"var(--fg)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {a.label}
                  </div>
                  <div style={{fontSize:12, color:"var(--fg-3)"}}>{a.sub}</div>
                </div>
                <div className="bar" style={{width:120}}>
                  <span style={{width: (a.value / TOP_RISK_ASSETS[0].value * 100) + "%", background: a.color}}/>
                </div>
                <div style={{fontFamily:"var(--font-mono)", fontSize:13, color:a.color, minWidth:30, textAlign:"right"}}>
                  {a.value}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="掃描耗時分析" meta="avg duration per scan type">
          <div style={{display:"flex", flexDirection:"column", gap:12}}>
            {SCAN_DURATION.map((d,i) => {
              const max = Math.max(...SCAN_DURATION.map(x=>x.value));
              return (
                <div key={i}>
                  <div style={{display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:13}}>
                    <span>{d.label}</span>
                    <span style={{fontFamily:"var(--font-mono)", color:"var(--fg-2)"}}>{fmt.dur(d.value)}</span>
                  </div>
                  <div style={{height:6, background:"var(--overlay-2)", borderRadius:2, overflow:"hidden"}}>
                    <div style={{height:"100%", width:(d.value/max*100)+"%", background:d.color, borderRadius:2}}/>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop:14, paddingTop:12, borderTop:"1px solid var(--line-subtle)",
            display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, fontSize:12
          }}>
            <div>
              <div style={{color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", fontSize:11}}>P95</div>
              <div style={{fontFamily:"var(--font-mono)", color:"var(--fg)", fontSize:14}}>14m 38s</div>
            </div>
            <div>
              <div style={{color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", fontSize:11}}>Longest</div>
              <div style={{fontFamily:"var(--font-mono)", color:"var(--fg)", fontSize:14}}>2h 28m 52s</div>
            </div>
            <div>
              <div style={{color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", fontSize:11}}>Failure rate</div>
              <div style={{fontFamily:"var(--font-mono)", color:"var(--risk-warn)", fontSize:14}}>5.4%</div>
            </div>
            <div>
              <div style={{color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", fontSize:11}}>Timeouts (7d)</div>
              <div style={{fontFamily:"var(--font-mono)", color:"var(--fg)", fontSize:14}}>3</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row: recent activity + tool status */}
      <div className="grid" style={{gridTemplateColumns:"1.6fr 1fr"}}>
        <Card
          title="最近活動"
          meta="scans · validation · rotations"
          actions={<button className="btn ghost sm" onClick={()=>onNavigate("history")}>All activity <Icon name="arrowRight" size={11}/></button>}
        >
          <RecentActivity onNavigate={onNavigate}/>
        </Card>

        <Card
          title="工具與環境"
          meta={`${TOOLS.filter(t => t.status === "ok").length}/${TOOLS.length} healthy`}
          actions={<button className="btn ghost sm" onClick={()=>onNavigate("tools")}>Details <Icon name="arrowRight" size={11}/></button>}
        >
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {TOOLS.slice(0,5).map((t,i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"1fr auto auto", gap:10, alignItems:"center", fontSize:13
              }}>
                <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
                  <StatusDot status={t.status === "ok" ? "success" : t.status === "warn" ? "partial" : "failed"}/>
                  <span style={{fontFamily:"var(--font-mono)"}}>{t.name}</span>
                </div>
                <span style={{color:"var(--fg-3)", fontSize:12, fontFamily:"var(--font-mono)"}}>{t.version}</span>
                <Badge tone={t.status === "ok" ? "ok" : t.status === "warn" ? "warn" : "high"} sq>
                  {t.status === "ok" ? "READY" : t.status === "warn" ? "DRIFT" : "MISSING"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const RecentActivity = ({ onNavigate }) => {
  const items = SCAN_HISTORY.slice(0, 6);
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
      {items.map((s, i) => (
        <div key={s.id} style={{
          display:"grid", gridTemplateColumns:"auto 1fr auto auto", gap:12, alignItems:"center",
          padding:"9px 0",
          borderBottom: i < items.length-1 ? "1px solid var(--line-subtle)" : "none",
          cursor:"pointer"
        }} onClick={()=>onNavigate("history")}>
          <StatusDot status={s.status}/>
          <div style={{minWidth:0}}>
            <div style={{fontSize:13.5, color:"var(--fg)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
              {s.name}
            </div>
            <div style={{fontSize:12, color:"var(--fg-3)", display:"flex", gap:10, marginTop:1}}>
              <span style={{fontFamily:"var(--font-mono)"}}>{s.id}</span>
              <span>·</span>
              <span>{fmt.rel(s.startedAt)}</span>
              <span>·</span>
              <span>{s.targets} targets · {s.artifactsOk}/{s.artifactsOk + s.artifactsFail} artifacts</span>
            </div>
          </div>
          <div style={{display:"flex", gap:4}}>
            {s.types.map(t => (
              <Badge key={t} tone="brand" sq>{
                t === "source" ? "SRC" : t === "network" ? "NET" : t === "container" ? "CTR" : "SBM"
              }</Badge>
            ))}
          </div>
          <Badge tone={
            s.status === "success" ? "ok"
            : s.status === "running" ? "info"
            : s.status === "partial" ? "warn"
            : s.status === "failed" ? "high"
            : ""
          } dot>
            {s.status === "success" ? "Success"
              : s.status === "running" ? `Running ${Math.round(s.progress*100)}%`
              : s.status === "partial" ? "Partial"
              : s.status === "failed" ? "Failed"
              : s.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

window.Summary = Summary;
