// sidebar.jsx — fixed sidebar nav

const Sidebar = ({ active, onChange, collapsed, onToggle, runningCount }) => {
  const t = useT();

  const items = [
    { key: "summary",  label: t("摘要總覽",   "Overview"),       icon: "dashboard" },
    { key: "scan",     label: t("開始掃描",   "New Scan"),       icon: "play" },
    { key: "history",  label: t("掃描紀錄",   "Scan History"),   icon: "history", count: runningCount },
    { key: "assets",   label: t("資產資料",   "Asset Inventory"),icon: "box" },
    { key: "reports",  label: t("CBOM / SBOM 報表","CBOM / SBOM Reports"),    icon: "chart" },
    { key: "tools",    label: t("工具狀態",   "Tools & Env"),    icon: "tool" },
    { key: "settings", label: t("設定",       "Settings"),       icon: "cog" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="sidebar-logo"/>
        {!collapsed && (
          <div className="sidebar-title">
            <span>cbom · sentinel</span>
            <small>scan platform</small>
          </div>
        )}
        <div className="spacer"/>
        {!collapsed && (
          <button className="icon-btn" onClick={onToggle} title="Collapse sidebar">
            <Icon name="chevronLeft" size={14}/>
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-label">PLATFORM</div>}
        {items.slice(0, 1).map(it => (
          <NavItem key={it.key} it={it} active={active} onChange={onChange} collapsed={collapsed}/>
        ))}

        {!collapsed && <div className="sidebar-section-label">SCAN</div>}
        {items.slice(1, 3).map(it => (
          <NavItem key={it.key} it={it} active={active} onChange={onChange} collapsed={collapsed}/>
        ))}

        {!collapsed && <div className="sidebar-section-label">INVENTORY</div>}
        {items.slice(3, 5).map(it => (
          <NavItem key={it.key} it={it} active={active} onChange={onChange} collapsed={collapsed}/>
        ))}

        {!collapsed && <div className="sidebar-section-label">SYSTEM</div>}
        {items.slice(5).map(it => (
          <NavItem key={it.key} it={it} active={active} onChange={onChange} collapsed={collapsed}/>
        ))}
      </nav>

      <div className="sidebar-foot">
        {collapsed ? (
          <button className="icon-btn" onClick={onToggle} title="Expand sidebar">
            <Icon name="chevronRight" size={14}/>
          </button>
        ) : (
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", gap:8}}>
            <div style={{display:"flex", alignItems:"center", gap:10, minWidth:0, flex:1}}>
              <div style={{
                width:22, height:22, borderRadius:6,
                background:"var(--brand-soft)", color:"var(--brand-2)",
                display:"grid", placeItems:"center", flexShrink:0
              }}>
                <Icon name="server" size={13}/>
              </div>
              <div style={{display:"flex", flexDirection:"column", minWidth:0}}>
                <div style={{fontSize:12, color:"var(--fg-2)", fontFamily:"var(--font-mono)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                  cbom-runner-01
                </div>
                <div style={{fontSize:10.5, color:"var(--fg-4)", display:"flex", alignItems:"center", gap:4}}>
                  <span style={{width:5, height:5, borderRadius:"50%", background:"var(--risk-ok)", display:"inline-block"}}/>
                  v1.4.2 · online
                </div>
              </div>
            </div>
            <button className="icon-btn" title="System" style={{width:28, height:28}}>
              <Icon name="cog" size={13}/>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

const NavItem = ({ it, active, onChange, collapsed }) => {
  const t = useT();
  return (
    <div
      className={"nav-item" + (active === it.key ? " active" : "")}
      onClick={() => onChange(it.key)}
      title={collapsed ? it.label : undefined}
    >
      <Icon name={it.icon} className="icon" size={17}/>
      {!collapsed && (
        <>
          <span>{it.label}</span>
          {it.count > 0 && <span className="count">{it.count} {t("執行中", "running")}</span>}
        </>
      )}
    </div>
  );
};

window.Sidebar = Sidebar;
