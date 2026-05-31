// app.jsx — Root App component

const App = () => {
  const [active, setActive] = useState(() => {
    const h = (window.location.hash || "").replace("#","");
    return h && ["summary","scan","history","assets","reports","tools","settings"].includes(h) ? h : "summary";
  });
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("cbom-theme") || "light"; } catch (e) { return "light"; }
  });
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("cbom-lang") || "zh"; } catch (e) { return "zh"; }
  });

  useEffect(() => {
    window.location.hash = active;
  }, [active]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-changing");
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("cbom-theme", theme); } catch (e) {}
    void root.offsetWidth;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove("theme-changing"));
    });
    return () => cancelAnimationFrame(id);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "zh" ? "zh-Hant" : "en");
    try { localStorage.setItem("cbom-lang", lang); } catch (e) {}
  }, [lang]);

  const t = (zh, en) => lang === "en" && en ? en : zh;

  const titleByKey = {
    summary:  [t("平台","Platform"), t("摘要總覽","Overview")],
    scan:     [t("掃描","Scan"),     t("開始掃描","New scan")],
    history:  [t("掃描","Scan"),     t("掃描紀錄","History")],
    assets:   [t("資產","Inventory"),t("資產資料","Asset data")],
    reports:  [t("資產","Inventory"),t("CBOM / SBOM 報表","CBOM / SBOM reports")],
    tools:    [t("系統","System"),   t("工具與環境","Tools & environment")],
    settings: [t("系統","System"),   t("設定","Settings")],
  };
  const [crumb1, crumb2] = titleByKey[active];
  const runningCount = SCAN_HISTORY.filter(s => s.status === "running").length;

  return (
    <LangContext.Provider value={lang}>
      <div className={"app" + (collapsed ? " collapsed" : "")}>
        <Sidebar
          active={active}
          onChange={setActive}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          runningCount={runningCount}
        />
        <main className="main">
          <div className="topbar">
            {collapsed && (
              <button className="icon-btn" onClick={()=>setCollapsed(false)} title="Expand">
                <Icon name="menu" size={14}/>
              </button>
            )}
            <span className="crumb">{crumb1}</span>
            <span className="crumb-sep">/</span>
            <span className="topbar-title">{crumb2}</span>

            <div className="spacer"/>

            {runningCount > 0 && (
              <div className="topbar-env" style={{borderColor:"rgba(84,98,160,0.35)"}}>
                <span className="dot" style={{background:"var(--brand-2)", boxShadow:"0 0 0 2px rgba(84,98,160,0.18)", animation:"pulse 1.6s ease-in-out infinite"}}/>
                <span style={{color:"var(--fg-2)"}}>{runningCount} {t("執行中","running")}</span>
              </div>
            )}

            <div className="topbar-search">
              <Icon name="search" size={14}/>
              <input placeholder={t("搜尋憑證、掃描、元件...", "Search certs, scans, components...")}/>
              <kbd>⌘K</kbd>
            </div>

            <LangToggle lang={lang} onChange={setLang}/>

            <button
              className="icon-btn theme-toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
              aria-label="Toggle theme"
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={16}/>
            </button>

            <button className="icon-btn" title="Activity">
              <Icon name="bell" size={16}/>
            </button>
          </div>

          {active === "summary"  && <Summary  onNavigate={setActive}/>}
          {active === "scan"     && <NewScan  onNavigate={setActive}/>}
          {active === "history"  && <ScanHistory onNavigate={setActive}/>}
          {active === "assets"   && <AssetInventory/>}
          {active === "reports"  && <Reports/>}
          {active === "tools"    && <ToolsPage/>}
          {active === "settings" && <Settings/>}
        </main>
      </div>
    </LangContext.Provider>
  );
};

const LangToggle = ({ lang, onChange }) => {
  const isEn = lang === "en";
  const next = isEn ? "zh" : "en";
  const labelNext = isEn ? "中" : "英";
  return (
    <div
      onClick={() => onChange(next)}
      title={isEn ? "Switch to Chinese" : "切換成英文"}
      style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"4px 10px 4px 8px",
        border:"1px solid var(--line)",
        borderRadius:"var(--r-sm)",
        cursor:"pointer",
        height:32,
        userSelect:"none",
        background:"var(--bg-input)",
      }}
    >
      <Switch on={isEn} onChange={() => onChange(next)}/>
      <span style={{
        fontSize:13, fontWeight:600, color:"var(--fg-2)",
        fontFamily: "var(--font-sans)",
        lineHeight:1,
      }}>{labelNext}</span>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
