// summary.jsx — Overview dashboard

const Summary = ({ onNavigate }) => {
  const t = useT();
  const expiringTotal = KPI_DATA.expiringSoon.d30 + KPI_DATA.expiringSoon.d60 + KPI_DATA.expiringSoon.d90;
  const lastScanRel = fmt.rel(KPI_DATA.lastScanAt);

  return (
    <div className="page">
      <div className="row" style={{marginBottom:16}}>
        <div>
          <h1>{t("摘要總覽","Overview")}</h1>
          <div className="hint" style={{marginTop:4}}>
            {t("目前系統掌握的加密資產與掃描風險全景","Crypto asset & scan risk landscape")} · {t("最近一次掃描","Last scan")} {lastScanRel}
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
          <Icon name="refresh" size={13}/> {t("重新整理","Refresh")}
        </button>
        <button className="btn primary" onClick={()=>onNavigate("scan")}>
          <Icon name="plus" size={13}/> {t("新增掃描","New scan")}
        </button>
      </div>

      {/* KPI row 1 — operations */}
      <div className="grid cols-5" style={{marginBottom:14}}>
        <KPI
          label={t("總掃描次數","Total scans")}
          value={fmt.n(KPI_DATA.totalScans)}
          delta={KPI_DATA.totalScansDelta.replace(/^\+|this week/g,"").trim()}
          deltaDir="up"
          foot={t("本週","this week")}
        />
        <KPI
          label={t("最近一次掃描","Last scan")}
          value={lastScanRel}
          foot={"scn-2026-0528-0432 · running 62%"}
        />
        <KPI
          label={t("成功率 (7d)","Success rate (7d)")}
          value={(KPI_DATA.successRate*100).toFixed(1)}
          unit="%"
          delta="-0.6"
          deltaDir="down"
          foot={t("vs. 前 7 天","vs. previous 7d")}
          tone="risk-ok"
        />
        <KPI
          label={t("驗證失敗 (CycloneDX)","Validation failed (CDX)")}
          value={KPI_DATA.validationFailed}
          delta="+2"
          deltaDir="up"
          foot="schemas 1.5 / 1.6"
          tone={KPI_DATA.validationFailed > 0 ? "risk-warn" : ""}
        />
        <KPI
          label={t("已產生 CBOM / SBOM","Generated CBOM / SBOM")}
          value={`${KPI_DATA.cbomCount} / ${KPI_DATA.sbomCount}`}
          foot={`${fmt.n(KPI_DATA.componentsTracked)} ${t("元件已追蹤","components tracked")}`}
        />
      </div>

      {/* KPI row 2 — risk */}
      <div className="grid cols-5" style={{marginBottom:18}}>
        <KPI
          label={t("高風險憑證","High-risk certs")}
          value={KPI_DATA.highRiskCerts}
          delta={KPI_DATA.highRiskCertsDelta.replace(/^\+/,"").replace("vs last week","").trim()}
          deltaDir="up"
          foot={t("vs. 上週","vs. last week")}
          tone="risk-high"
        />
        <KPI
          label={t("已過期憑證","Expired certs")}
          value={KPI_DATA.expiredCerts}
          foot={t("需輪換","needs rotation") + ` · ${KPI_DATA.expiredCerts} assets`}
          tone="risk-high"
        />
        <KPI
          label={t("30天內到期","Expiring < 30d")}
          value={KPI_DATA.expiringSoon.d30}
          foot={`60d ${KPI_DATA.expiringSoon.d60} · 90d ${KPI_DATA.expiringSoon.d90}`}
          tone="risk-warn"
        />
        <KPI
          label={t("弱演算法使用","Weak algorithms")}
          value={KPI_DATA.weakAlgos}
          foot={`RSA<2048 · ${KPI_DATA.weakAlgosBreakdown["RSA<2048"]} · SHA-1 · ${KPI_DATA.weakAlgosBreakdown["SHA-1"]}`}
          tone="risk-warn"
        />
        <KPI
          label={t("TLS 1.0 / 1.1 暴露","TLS 1.0/1.1 exposed")}
          value={KPI_DATA.weakAlgosBreakdown["TLS 1.0/1.1"]}
          foot={t("仍在接受連線的主機","hosts still accepting")}
          tone="risk-high"
        />
      </div>

      {/* Row: scan trend + scan type donut */}
      <div className="grid" style={{gridTemplateColumns:"2fr 1fr", marginBottom:16}}>
        <Card
          title={t("掃描趨勢 · 14 天","Scan trend · 14 days")}
          meta={t("成功 / 失敗次數","success / failed runs")}
          actions={
            <Segmented value="daily" onChange={()=>{}} options={[
              {value:"daily",  label:t("每日","Daily")},
              {value:"weekly", label:t("每週","Weekly")},
            ]}/>
          }
        >
          <LineChart
            height={210}
            series={[
              { name:t("成功","Successful"), data: SCAN_TREND.success, labels: SCAN_TREND.labels, color: "#5462a0", fillOpacity: 0.18 },
              { name:t("失敗","Failed"),     data: SCAN_TREND.failed,  labels: SCAN_TREND.labels, color: "var(--risk-high)", fillOpacity: 0.08 },
            ]}
          />
        </Card>

        <Card title={t("掃描類型分布","Scan type distribution")} meta={t("累計","all-time")}>
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
          title={t("憑證到期時間軸","Certificate expiry timeline")}
          meta={t("未來 180 天內","next 180 days")}
          actions={
            <button className="btn ghost sm" onClick={()=>onNavigate("assets")}>
              {t("查看全部","View all")} <Icon name="arrowRight" size={11}/>
            </button>
          }
        >
          <ExpiryTimeline buckets={[
            { label: t("0–30天","0–30d"),   value: EXPIRY_BUCKETS[0].value, tone: "high" },
            { label: t("30–60天","30–60d"), value: EXPIRY_BUCKETS[1].value, tone: "warn" },
            { label: t("60–90天","60–90d"), value: EXPIRY_BUCKETS[2].value, tone: "warn" },
            { label: t("90–180天","90–180d"),value: EXPIRY_BUCKETS[3].value, tone: "ok" },
          ]}/>
          <div style={{
            marginTop:12, padding:"8px 10px",
            background:"var(--risk-high-soft)",
            borderLeft:"2px solid var(--risk-high)",
            borderRadius:3,
            display:"flex", alignItems:"center", gap:8,
            fontSize:13, color:"var(--fg-2)"
          }}>
            <Icon name="alert" size={14}/>
            <span>
              <strong style={{color:"var(--risk-high)"}}>{KPI_DATA.expiredCerts} {t("張憑證","certs")}</strong>
              {" "}{t("已過期且仍在生產環境中被觀察到","have already expired and are still observed in production traffic.")}
            </span>
            <div className="spacer"/>
            <button className="btn sm">{t("處理","Triage")}</button>
          </div>
        </Card>

        <Card title={t("憑證風險分布","Certificate risk distribution")} meta={fmt.n(CERT_RISK_DIST.reduce((s,d)=>s+d.value,0)) + t(" 張憑證觀察中"," certs observed")}>
          <Donut data={CERT_RISK_DIST.map(d => ({
            ...d,
            label: t(
              d.label === "Valid" ? "有效" :
              d.label === "Expiring soon" ? "即將到期" :
              d.label === "Expired" ? "已過期" :
              d.label === "Weak algo" ? "弱演算法" :
              d.label === "Self-signed" ? "自簽憑證" :
              d.label === "Unparseable" ? "無法解析" : d.label,
              d.label
            )
          }))} size={160}/>
        </Card>
      </div>

      {/* Row: algo distribution + SBOM ecosystem */}
      <div className="grid cols-2" style={{marginBottom:16}}>
        <Card title={t("加密演算法分布","Crypto algorithm distribution")} meta={t("公鑰演算法","public-key algos")}>
          <HBar data={ALGO_DIST} valueFmt={v => fmt.n(v)}/>
        </Card>
        <Card title={t("SBOM 元件生態分布","SBOM component ecosystem")} meta={fmt.n(SBOM_ECOSYSTEM.reduce((s,d)=>s+d.value,0)) + " components"}>
          <HBar data={SBOM_ECOSYSTEM} valueFmt={v => fmt.n(v)}/>
        </Card>
      </div>

      {/* Row: top risk assets + scan duration */}
      <div className="grid" style={{gridTemplateColumns:"1.4fr 1fr", marginBottom:16}}>
        <Card
          title={t("高風險資產排行","Top Risk Assets")}
          meta={t("依高風險加密 findings 數量排序","ranked by high-risk crypto findings")}
          actions={
            <button className="btn ghost sm" onClick={()=>onNavigate("assets")}>
              {t("資產資料","Asset inventory")} <Icon name="arrowRight" size={11}/>
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
                <span style={{fontFamily:"var(--font-mono)", fontSize:12, color:"var(--fg-3)", textAlign:"right"}}>#{i+1}</span>
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

        <Card title={t("掃描耗時分析","Scan duration analysis")} meta={t("各類型平均耗時","avg duration per scan type")}>
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
            {[
              { label:"P95",              val:"14m 38s",  color:"var(--fg)" },
              { label:t("最長","Longest"), val:"2h 28m 52s", color:"var(--fg)" },
              { label:t("失敗率","Failure rate"), val:"5.4%", color:"var(--risk-warn)" },
              { label:t("逾時 (7d)","Timeouts (7d)"), val:"3", color:"var(--fg)" },
            ].map((r,i) => (
              <div key={i}>
                <div style={{color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:"0.06em", fontSize:11}}>{r.label}</div>
                <div style={{fontFamily:"var(--font-mono)", color:r.color, fontSize:14}}>{r.val}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row: recent activity + tool status */}
      <div className="grid" style={{gridTemplateColumns:"1.6fr 1fr"}}>
        <Card
          title={t("最近活動","Recent activity")}
          meta={t("掃描 · 驗證 · 輪換","scans · validation · rotations")}
          actions={<button className="btn ghost sm" onClick={()=>onNavigate("history")}>{t("全部活動","All activity")} <Icon name="arrowRight" size={11}/></button>}
        >
          <RecentActivity onNavigate={onNavigate}/>
        </Card>

        <Card
          title={t("工具與環境","Tools & environment")}
          meta={`${TOOLS.filter(t2 => t2.status === "ok").length}/${TOOLS.length} ${t("正常","healthy")}`}
          actions={<button className="btn ghost sm" onClick={()=>onNavigate("tools")}>{t("詳細","Details")} <Icon name="arrowRight" size={11}/></button>}
        >
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {TOOLS.slice(0,5).map((tool,i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"1fr auto auto", gap:10, alignItems:"center", fontSize:13
              }}>
                <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0}}>
                  <StatusDot status={tool.status === "ok" ? "success" : tool.status === "warn" ? "partial" : "failed"}/>
                  <span style={{fontFamily:"var(--font-mono)"}}>{tool.name}</span>
                </div>
                <span style={{color:"var(--fg-3)", fontSize:12, fontFamily:"var(--font-mono)"}}>{tool.version}</span>
                <Badge tone={tool.status === "ok" ? "ok" : tool.status === "warn" ? "warn" : "high"} sq>
                  {tool.status === "ok" ? t("正常","READY") : tool.status === "warn" ? t("版本偏舊","DRIFT") : t("缺失","MISSING")}
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
  const t = useT();
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
              <span>{s.targets} {t("目標","targets")} · {s.artifactsOk}/{s.artifactsOk + s.artifactsFail} {t("產出","artifacts")}</span>
            </div>
          </div>
          <div style={{display:"flex", gap:4}}>
            {s.types.map(ty => (
              <Badge key={ty} tone="brand" sq>{
                ty === "source" ? "SRC" : ty === "network" ? "NET" : ty === "container" ? "CTR" : "SBM"
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
            {s.status === "success" ? t("成功","Success")
              : s.status === "running" ? `${t("執行中","Running")} ${Math.round(s.progress*100)}%`
              : s.status === "partial" ? t("部分失敗","Partial")
              : s.status === "failed" ? t("失敗","Failed")
              : s.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

window.Summary = Summary;
