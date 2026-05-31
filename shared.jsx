// shared.jsx — design primitives and icon set
// Exposed to window so other Babel scripts can use them.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Icons (outline, 16px viewbox 24) ---------- */
const Icon = ({ name, size = 16, className = "icon", strokeWidth = 1.6 }) => {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    play: <polygon points="6,4 20,12 6,20" />,
    history: <><circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 15,14"/><path d="M3 12a9 9 0 0 1 15-6.7"/></>,
    box: <><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>,
    chart: <><path d="M4 20h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/></>,
    tool: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>,
    cog: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.4 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.4 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    code: <><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>,
    container: <><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 6v12M11 6v12M15 6v12"/></>,
    layers: <><polygon points="12,2 22,7 12,12 2,7"/><polyline points="2,12 12,17 22,12"/><polyline points="2,17 12,22 22,17"/></>,
    search: <><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16" y2="16"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    refresh: <><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/></>,
    trash: <><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1.4 14a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    check: <polyline points="4,12 10,18 20,6"/>,
    x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    chevronDown: <polyline points="6,9 12,15 18,9"/>,
    chevronRight: <polyline points="9,6 15,12 9,18"/>,
    chevronLeft: <polyline points="15,6 9,12 15,18"/>,
    filter: <path d="M3 5h18l-7 9v6l-4-2v-4L3 5z"/>,
    sort: <><path d="M7 4v16M3 8l4-4 4 4"/><path d="M17 20V4M13 16l4 4 4-4"/></>,
    sliders: <><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    folder: <path d="M3 5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"/>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></>,
    key: <><circle cx="8" cy="16" r="3"/><line x1="10.5" y1="13.5" x2="21" y2="3"/><line x1="17" y1="7" x2="20" y2="10"/></>,
    shield: <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/>,
    alert: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.5"/></>,
    info: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 15,14"/></>,
    server: <><rect x="3" y="3" width="18" height="7" rx="1.5"/><rect x="3" y="14" width="18" height="7" rx="1.5"/><line x1="7" y1="6.5" x2="7" y2="6.5"/><line x1="7" y1="17.5" x2="7" y2="17.5"/></>,
    network: <><circle cx="12" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/><path d="M12 6v6M12 12L5 18M12 12l7 6"/></>,
    git: <><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6h6a4 4 0 0 1 4 4"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    dots: <><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="6,11 12,5 18,11"/></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="6,13 12,19 18,13"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13,6 19,12 13,18"/></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    star: <polygon points="12,2 15.1,8.6 22,9.3 16.7,14 18.2,21 12,17.3 5.8,21 7.3,14 2,9.3 8.9,8.6"/>,
    diff: <><path d="M12 3v18"/><path d="M5 8h7M5 16h7"/><path d="M19 5l-2 2 2 2"/><path d="M14 19l2-2-2-2"/></>,
    cert: <><rect x="3" y="3" width="18" height="14" rx="1.5"/><circle cx="12" cy="10" r="3"/><path d="M10 13l-1 8 3-2 3 2-1-8"/></>,
    package: <><path d="M16 16V8L8 4 0 8v8l8 4 8-4z" transform="translate(4 0)"/><line x1="12" y1="22" x2="12" y2="12"/><line x1="12" y1="12" x2="4" y2="8"/><line x1="12" y1="12" x2="20" y2="8"/></>,
  };
  if (!paths[name]) return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
};

/* ---------- Primitives ---------- */
const Card = ({ title, meta, actions, children, flush, dense, style }) => (
  <div className="card" style={style}>
    {(title || actions) && (
      <div className="card-head">
        {title && <h2>{title}</h2>}
        {meta && <span className="meta">{meta}</span>}
        {actions && <div className="actions">{actions}</div>}
      </div>
    )}
    <div className={"card-body" + (flush ? " flush" : "") + (dense ? " dense" : "")}>{children}</div>
  </div>
);

const Badge = ({ tone, dot, sq, children }) => (
  <span className={"badge" + (tone ? " " + tone : "") + (dot ? " dot" : "") + (sq ? " sq" : "")}>
    {children}
  </span>
);

const StatusDot = ({ status }) => <span className={"status-dot " + status} />;

const Switch = ({ on, onChange }) => (
  <div className={"switch" + (on ? " on" : "")} onClick={() => onChange && onChange(!on)} role="switch" aria-checked={on} />
);

const Checkbox = ({ checked, indeterminate, onChange }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      className={"checkbox" + (indeterminate ? " indeterminate" : "")}
      checked={!!checked}
      onChange={e => onChange && onChange(e.target.checked)}
    />
  );
};

const Segmented = ({ value, onChange, options }) => (
  <div className="segmented">
    {options.map(o => (
      <button
        key={o.value}
        className={value === o.value ? "active" : ""}
        onClick={() => onChange && onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Tabs = ({ value, onChange, tabs }) => (
  <div className="tabs">
    {tabs.map(t => (
      <button
        key={t.value}
        className={"tab" + (value === t.value ? " active" : "")}
        onClick={() => onChange && onChange(t.value)}
      >
        {t.icon && <Icon name={t.icon} size={14} />}
        <span>{t.label}</span>
        {t.count != null && <span className="count">{t.count.toLocaleString()}</span>}
      </button>
    ))}
  </div>
);

/* ---------- KPI ---------- */
const KPI = ({ label, value, unit, delta, deltaDir, foot, tone, hint }) => (
  <div className={"kpi" + (tone ? " " + tone : "")}>
    <div className="kpi-label">
      {label}
      {hint && <span className="tip" data-tip={hint}><Icon name="info" size={11} /></span>}
    </div>
    <div className="kpi-value">
      {value}
      {unit && <span className="unit">{unit}</span>}
    </div>
    <div className="kpi-foot">
      {delta != null && (
        <span className={"delta " + (deltaDir || "flat")}>
          {deltaDir === "up" ? "▲" : deltaDir === "down" ? "▼" : "•"} {delta}
        </span>
      )}
      {foot && <span>{foot}</span>}
    </div>
  </div>
);

/* ---------- i18n ---------- */
const LangContext = React.createContext("zh");
const useLang = () => React.useContext(LangContext);
const useT = () => {
  const lang = useLang();
  return (zh, en) => lang === "en" && en ? en : zh;
};

/* ---------- Util ---------- */
const fmt = {
  n: x => x.toLocaleString(),
  pct: x => (x * 100).toFixed(1) + "%",
  bytes: b => {
    const u = ["B","KB","MB","GB"];
    let i = 0; while (b >= 1024 && i < u.length-1) { b /= 1024; i++; }
    return b.toFixed(b < 10 ? 1 : 0) + " " + u[i];
  },
  dur: s => {
    if (s < 60) return s + "s";
    if (s < 3600) return Math.floor(s/60) + "m " + (s%60) + "s";
    return Math.floor(s/3600) + "h " + Math.floor((s%3600)/60) + "m";
  },
  date: d => {
    const dt = new Date(d);
    return dt.getFullYear() + "-" + String(dt.getMonth()+1).padStart(2,"0") + "-" + String(dt.getDate()).padStart(2,"0");
  },
  dateTime: d => {
    const dt = new Date(d);
    return fmt.date(d) + " " + String(dt.getHours()).padStart(2,"0") + ":" + String(dt.getMinutes()).padStart(2,"0");
  },
  rel: d => {
    const diff = (Date.now() - new Date(d).getTime()) / 1000;
    if (diff < 60) return Math.floor(diff) + "s ago";
    if (diff < 3600) return Math.floor(diff/60) + "m ago";
    if (diff < 86400) return Math.floor(diff/3600) + "h ago";
    return Math.floor(diff/86400) + "d ago";
  }
};

/* ---------- Expose ---------- */
Object.assign(window, {
  Icon, Card, Badge, StatusDot, Switch, Checkbox, Segmented, Tabs, KPI,
  fmt,
  useState, useEffect, useRef, useMemo, useCallback,
  LangContext, useLang, useT,
});
