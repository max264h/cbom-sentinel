# CBOM Sentinel — 前端開發引導文件

> **版本**：v1.0 · 2026-05-29  
> **定位**：BOM 與加密資產掃描管理平台（scan platform for crypto assets, CBOM, SBOM）  
> **技術棧**：HTML + React 18 (Babel inline JSX) + 純 SVG 自繪圖表，無外部 UI 套件

---

## 目錄

1. [技術架構](#1-技術架構)
2. [檔案結構](#2-檔案結構)
3. [設計系統 — 色彩](#3-設計系統--色彩)
4. [設計系統 — 排版與間距](#4-設計系統--排版與間距)
5. [設計系統 — 元件](#5-設計系統--元件)
6. [圖表系統](#6-圖表系統)
7. [頁面結構與功能說明](#7-頁面結構與功能說明)
8. [資料模型 (Mock Data)](#8-資料模型-mock-data)
9. [i18n — 中英文切換](#9-i18n--中英文切換)
10. [主題切換 (Light / Dark)](#10-主題切換-light--dark)
11. [開發注意事項](#11-開發注意事項)

---

## 1. 技術架構

```
CBOM Sentinel.html
  └─ 載入 styles.css              ← 所有 CSS tokens + 元件樣式
  └─ shared.jsx   (text/babel)    ← Icons、primitive 元件、i18n hooks
  └─ charts.jsx   (text/babel)    ← 純 SVG 圖表元件
  └─ data.jsx     (text/babel)    ← Mock 資料（全域變數）
  └─ sidebar.jsx  (text/babel)    ← 側邊欄導航
  └─ summary.jsx  (text/babel)    ← 摘要總覽頁
  └─ scan.jsx     (text/babel)    ← 開始掃描頁
  └─ history.jsx  (text/babel)    ← 掃描紀錄頁
  └─ assets.jsx   (text/babel)    ← 資產資料頁（7 個 tab）
  └─ pages-misc.jsx (text/babel)  ← Reports / Tools / Settings
  └─ app.jsx      (text/babel)    ← 根元件、路由、LangContext、主題切換
```

**跨檔案共用**：每個 Babel script 透過 `Object.assign(window, {...})` 把元件暴露到全域，後面的 script 直接使用。  
**不使用** `type="module"`（Babel sandbox 不支援 ES Module import）。

---

## 2. 檔案結構

| 檔案 | 職責 | 行數（約） |
|---|---|---|
| `styles.css` | CSS custom properties + 所有基礎元件樣式 | 900 |
| `shared.jsx` | `Icon`、`Card`、`Badge`、`KPI`、`Switch`、`Tabs`、`useT` | 210 |
| `charts.jsx` | `LineChart`、`Donut`、`HBar`、`StackedBar`、`Sparkline`、`ExpiryTimeline`、`Heatmap` | 300 |
| `data.jsx` | `SCAN_HISTORY`、`KPI_DATA`、`CERTIFICATES`、`COMPONENTS`、`TOOLS`、圖表資料集 | 326 |
| `sidebar.jsx` | `<Sidebar>` / `<NavItem>` | 90 |
| `summary.jsx` | `<Summary>` + `<RecentActivity>` | 350 |
| `scan.jsx` | `<NewScan>` + `<FunctionToggle>`、`<ScopeSection>` | 425 |
| `history.jsx` | `<ScanHistory>`、`<ScanRow>`、`<ScanDetailDrawer>` | 480 |
| `assets.jsx` | `<AssetInventory>` + 7 個 tab 元件 + `<CertDetailDrawer>` | 665 |
| `pages-misc.jsx` | `<Reports>`、`<ToolsPage>`、`<Settings>` | 600 |
| `app.jsx` | `<App>`、`<LangToggle>`、路由、主題 state | 90 |

---

## 3. 設計系統 — 色彩

所有顏色都透過 CSS custom properties 管理。**禁止在 JSX 內直接硬編碼非 brand 的十六進位色碼**，請用 `var(--*)` token。

### 3.1 Brand（主題不變）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--brand` | `#2a257f` | `#2a257f` | 主按鈕、active 狀態、tab 底線 |
| `--brand-2` | `#5462a0` | `#5462a0` | Hover、secondary badge、chart 色 2 |
| `--brand-tint` | `#aacddf` | `#aacddf` | 淺藍輔色（深色主題時 badge/tab 使用） |
| `--brand-soft` | `rgba(42,37,127,0.08)` | `rgba(84,98,160,0.18)` | Active 背景、Brand badge 背景 |

### 3.2 背景層次（Surface）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--bg-app` | `#ffffff` | `#383635` | 主背景、page 容器 |
| `--bg-sidebar` | `#f6f8fb` | `#2f2d2c` | 側邊欄 |
| `--bg-card` | `#ffffff` | `#4a4846` | 卡片、Drawer、Modal |
| `--bg-card-2` | `#f4f6f9` | `#524f4d` | Segmented 背景、nested 容器 |
| `--bg-input` | `#ffffff` | `#3d3a39` | 所有表單輸入框 |
| `--bg-panel` | `#f4f6f9` | `#3a3837` | 內嵌面板、KV 列 |
| `--bg-panel-2` | `#fafbfc` | `#423f3e` | Modal footer、thead |
| `--bg-thead` | `#fafbfc` | `#3a3837` | Table 表頭 |
| `--bg-row-hover` | `#f7f9fc` | `#423f3e` | Table row hover |
| `--bg-code` | `#1a1d24` | `#1a1d24` | CLI code block（永遠深色） |
| `--bg-tooltip` | `#1a1d24` | `#1a1d24` | Tooltip（永遠深色） |

### 3.3 風險語意色

> ⚠️ Light / Dark 使用不同色值，以確保對比度。請用 token，不要直接寫 hex。

| Token | Light | Dark | 語意 |
|---|---|---|---|
| `--risk-high` | `#c93b3b` | `#e05c5c` | 高風險、錯誤、過期憑證 |
| `--risk-warn` | `#b87211` | `#e8a23a` | 警告、即將過期、drift |
| `--risk-ok` | `#2a8f5a` | `#4caf7d` | 正常、通過、success |
| `--risk-info` | `#4b7da0` | `#aacddf` | 資訊、running、略過 |
| `--risk-*-soft` | `rgba(...,0.10~0.12)` | `rgba(...,0.14)` | 對應的背景半透明版 |

### 3.4 文字層次

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--fg` | `#1a1d24` | `#ffffff` | 主要文字 |
| `--fg-2` | `#3d4148` | `#d4d3d1` | 次要文字、table cell |
| `--fg-3` | `#6a6f78` | `#b0b0b0` | label、hint、muted |
| `--fg-4` | `#8a8f98` | `#8a8785` | placeholder、icon |

### 3.5 線條

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--line` | `#e1e4e8` | `#5a5755` | 邊框、table 分隔 |
| `--line-strong` | `#c8ccd1` | `#6e6a67` | 輸入框 hover 邊框 |
| `--line-subtle` | `#ecf0f3` | `#423f3e` | 卡片邊框、區塊分隔 |

### 3.6 Overlay（hover 背景）

不要直接寫 `rgba(20,25,35,0.04)`，用 token：

| Token | 深度 | 用途 |
|---|---|---|
| `--overlay-1` | 極淺 | 最輕微 hover |
| `--overlay-2` | 淺 | nav-item hover |
| `--overlay-3` | 中 | segmented active、tab count bg |
| `--overlay-4` | 較深 | 明顯 hover |

### 3.7 圖表顏色序列

固定用以下序列，不要自行發明圖表顏色：

```
#2a257f → #5462a0 → #aacddf → #6b7db3 → #8fa8bf → #3b3781 → #7e8fc2
```

對應 token：`--c1`、`--c2`、`--c3`、`--c4`、`--c5`

---

## 4. 設計系統 — 排版與間距

### 字型

```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

- **Inter**：所有 UI 文字
- **JetBrains Mono**：程式碼、Serial number、fingerprint、IP、purl、duration、數量（tabular nums）

### 字級對照

| 用途 | 大小 | 字重 |
|---|---|---|
| Page title (`<h1>`) | 22px | 700 |
| Card title (`<h2>`) | 17px | 600 |
| Section label (`<h3>`) | 13px | 600, uppercase |
| KPI 數值 | 28px | 600 |
| KPI label | 12px | 500, uppercase |
| Table thead | 11.5px | 500, uppercase |
| Table cell / body | 13.5–14px | 400 |
| Badge / tag | 12px (sq: 10.5px) | 500–600 |
| Hint / caption | 13px | 400 |
| Button | 13px | 500 |

### 圓角

| Token | 值 | 用途 |
|---|---|---|
| `--r-sm` | `5px` | 按鈕、輸入框、小 badge |
| `--r` | `7px` | 卡片、modal |
| `--r-lg` | `10px` | 大 modal、Drawer |

### 佈局固定值

| 項目 | 值 |
|---|---|
| `--sidebar-w` | `240px`（展開） / `60px`（收合） |
| `--topbar-h` | `58px` |
| 頁面最大寬度 | `1480px` |
| 頁面 padding | `28px 32px` |
| Grid gap | `18px` |

---

## 5. 設計系統 — 元件

### 來源

所有元件都自定義在 `shared.jsx` 和 `styles.css`，無外部套件。

### 主要元件清單

#### `<Icon name="..." size={16} strokeWidth={1.6}/>`

outline 風格。可用 name：

`dashboard` `play` `history` `box` `chart` `tool` `cog` `code` `globe` `container` `layers` `search` `bell` `plus` `download` `refresh` `trash` `eye` `edit` `check` `x` `chevronDown/Right/Left` `filter` `sort` `sliders` `upload` `folder` `file` `key` `shield` `alert` `info` `clock` `server` `network` `git` `menu` `dots` `arrowUp/Down/Right` `external` `diff` `cert` `package` `sun` `moon`

#### `<Card title="" meta="" actions={...} flush dense>`

標準資訊卡片，`flush` 移除 body padding（用於 Table），`dense` 縮小 padding。

#### `<Badge tone="high|warn|ok|info|brand" dot sq>`

- 預設：圓角膠囊
- `sq`：方形、monospace font、uppercase（用於 SRC/NET/CTR/SBM 等類型標籤）
- `dot`：左側加色點（用於狀態）
- `tone` 對應 risk 語意色

#### `<KPI label="" value="" unit="" delta="" deltaDir="up|down|flat" foot="" tone="risk-high|risk-warn|risk-ok">`

儀表板指標卡片。

#### `<StatusDot status="running|success|failed|partial|queued|cancelled"/>`

內嵌狀態點，`running` 有 glow 效果。

#### `<Switch on={bool} onChange={fn}/>`

Toggle 開關。

#### `<Segmented value="" onChange={fn} options={[{value, label}]}/>`

分組選擇器（例如 24h / 7d / 30d / 90d）。

#### `<Tabs value="" onChange={fn} tabs={[{value, label, count, icon}]}/>`

下底線 tab 列。

#### `<Checkbox checked indeterminate onChange/>`

支援半選（indeterminate）狀態。

#### `<Card flush>` + `<table className="table">`

表格必須放在 `Card flush` 內。thead sticky，row hover 用 `--bg-row-hover`，選中 row 用 `.selected`。

---

## 6. 圖表系統

所有圖表都是**純 SVG 自繪**，定義在 `charts.jsx`，不依賴任何圖表庫。

### 6.1 `<LineChart>`

**用於**：摘要頁「掃描趨勢 · 14 days」

```js
<LineChart
  height={210}
  series={[
    { name:"Successful", data: [...], labels: [...], color: "#5462a0", fillOpacity: 0.18 },
    { name:"Failed",     data: [...], color: "var(--risk-high)", fillOpacity: 0.08 },
  ]}
/>
```

- `data`：每個點的數值陣列
- `labels`：X 軸標籤（日期字串）
- 滑鼠 hover 顯示垂直指示線 + 浮動數值
- 每條 series 都有填色 area + 線段

**未來接入真實資料**：從 `scan_summary.json` 的時間戳聚合。

---

### 6.2 `<Donut>`

**用於**：
1. 摘要頁「掃描類型分布」 — 資料來源 `SCAN_TYPE_DIST`
2. 摘要頁「憑證風險分布」 — 資料來源 `CERT_RISK_DIST`

```js
<Donut
  data={[{ label, value, color }]}
  size={170}
  centerLabel="1284"
  centerSub="SCANS"
/>
```

- 中心可顯示總數 + 副標
- 右側自動生成圖例，含數量與百分比

---

### 6.3 `<HBar>`

**用於**：
1. 摘要頁「加密演算法分布」 — 資料來源 `ALGO_DIST`
2. 摘要頁「SBOM 元件生態分布」 — 資料來源 `SBOM_ECOSYSTEM`

```js
<HBar
  data={[{ label, value, color }]}
  valueFmt={v => v.toLocaleString()}
/>
```

- 橫向長條圖，label 左對齊 160px 固定欄，數值右對齊

---

### 6.4 `<ExpiryTimeline>`

**用於**：摘要頁「憑證到期時間軸」 — 資料來源 `EXPIRY_BUCKETS`

```js
<ExpiryTimeline buckets={[
  { label: "0–30d", value: 23, tone: "high" },
  { label: "30–60d", value: 18, tone: "warn" },
  { label: "60–90d", value: 26, tone: "warn" },
  { label: "90–180d", value: 64, tone: "ok" },
]}/>
```

- 4 欄方塊，左側 `tone` 對應的邊框顏色
- 底部各顯示相對比例進度條

**未來接入真實資料**：解析 `full.cbom.json` 的 `components[].certificateProperties.validUntil`，按天數分桶。

---

### 6.5 `<Heatmap>`

**用於**：資產資料頁 > 加密演算法 tab — algorithm × ecosystem 使用熱圖

```js
<Heatmap
  rows={["RSA-2048", "ECDSA P-256", ...]}
  cols={["npm", "pypi", "go", ...]}
  cells={{ "RSA-2048|npm": 42, ... }}
/>
```

- 顏色深淺代表該組合的出現次數
- hover 顯示 tooltip：`RSA-2048 · npm: 42`

---

### 6.6 `<DependencyGraph>` + `<DepGraphLegend>`

**用於**：掃描紀錄頁 Detail Drawer 中的「Dependency graph」區塊

```js
<DependencyGraph
  graph={{
    nodes: [
      { id, label, sub?, kind, risk? }
    ],
    edges: [
      { from, to }
    ]
  }}
  height={380}
/>
<DepGraphLegend kinds={["root","target","cert","key","algo"]}/>
```

#### 節點欄位

| 欄位 | 說明 |
|---|---|
| `id` | 節點唯一識別字串 |
| `label` | 主要顯示文字（超過 19 字自動截斷 + …） |
| `sub` | 副標題（12px、淺色），例如 `"expires 7d"`、版本號 |
| `kind` | 節點類型，決定左側色條顏色（見下表） |
| `risk` | `"high"` / `"warn"` / `"ok"`；設定後覆蓋 kind 顏色，用於標示有風險的節點 |

#### `kind` 對應色條

| kind | 顏色 token | 語意 |
|---|---|---|
| `root` | `--brand` | 整包 CBOM/SBOM 或掃描根節點 |
| `target` | `--brand-2` | 掃描目標（network endpoint、container、source path）|
| `library` | `--c4` | 系統/C 層共用函式庫 |
| `package` | `--c4` | npm / PyPI / Go 等套件 |
| `cert` | `--risk-info` | X.509 憑證 |
| `key` | `--brand-2` | 私鑰 / 公鑰 / 對稱金鑰 |
| `algo` | `--c3` | 加密演算法（RSA / ECDSA / SHA 等）|

> `risk` 會完全覆蓋 `kind` 的色條顏色：`high → --risk-high`、`warn → --risk-warn`、`ok → --risk-ok`。

#### 版面配置演算法

1. **Layer assignment**：以「最長路徑」（longest-path from roots）決定每個節點所屬的欄（column），確保 DAG 方向一致、不反向。
2. **縱向排列**：同一欄的節點垂直均勻分佈，整欄居中（以最高欄為準）。
3. **邊（Edge）**：cubic bezier 曲線，從源節點右中心 → 目標節點左中心，中間控制點水平對齊，自然弧度。
4. **SVG 尺寸**：自動依節點數計算寬高（nodeW=158px、nodeH=38px、hGap=64px、vGap=16px），容器加 `overflow:auto` 支援水平捲動。
5. **底圖**：點狀網格（`radial-gradient`）配合 `--bg-panel-2`，深淺主題都適用。

#### Hover 互動

- hover 任一節點 → 計算其直接鄰居集合（前後方向）
- 非鄰居的節點 opacity 降為 0.28，非相關的邊 opacity 降為 0.18
- 相關的邊變為 `--brand-2` 色 + 加粗（1.8px）、換用高亮箭頭 marker
- 離開節點後完全恢復

#### DepGraphLegend

底部圖例列，傳入目前圖中出現的 `kind` 陣列，自動生成對應色塊 + 文字，最右側固定顯示 `high risk` 範例（空心邊框方塊）。

```js
<DepGraphLegend kinds={["root","target","cert","key","algo"]}/> // CBOM 圖
<DepGraphLegend kinds={["root","package","library"]}/>          // SBOM 圖
```

#### 在 Drawer 中的整合邏輯

```jsx
// history.jsx — ScanDetailDrawer
const hasCbom = scan.artifacts.includes("full.cbom.json");
const hasSbom = scan.artifacts.includes("full.sbom.json");
const [graphKind, setGraphKind] = useState(hasCbom ? "cbom" : hasSbom ? "sbom" : null);
const graph = graphKind ? getDepGraph(scan, graphKind) : null;
```

- 有 CBOM 且有 SBOM → segmented 顯示兩個選項，預設選 CBOM
- 只有其中一種 → segmented 只顯示一個選項
- 兩者都沒有（如失敗掃描）→ 顯示空狀態訊息

#### 資料來源（目前為 Mock）

資料定義在 `data.jsx`：

```js
const DEP_GRAPHS = {
  cbom: { nodes: [...], edges: [...] },  // Scan → Targets → Certs/Keys → Algorithms
  sbom: { nodes: [...], edges: [...] },  // Root package → Direct deps → Transitive deps
};

function getDepGraph(scan, kind) {
  return DEP_GRAPHS[kind] || null;
}
```

**未來接入真實資料**：
- **CBOM 圖**：解析 `full.cbom.json` 的 `dependencies[]` 陣列（CycloneDX 格式，`ref` + `dependsOn`），搭配 `components[]` 的 `type`（`cryptographic-asset`）和 `cryptoProperties` 建立節點
- **SBOM 圖**：解析 `full.sbom.json` 的 `dependencies[]`，`components[]` 的 `purl` 與 `type` 對應節點 kind
- 建議在超過 200 個節點時做分層截斷，只展示距離 root ≤ 3 跳的節點，並加「展開更多」按鈕

---

### 6.7 `<StackedBar>`

**元件已定義，目前未掛載到任何頁面**（預留給未來「掃描趨勢 stacked by type」使用）

---

### 6.8 `<Sparkline>`

**元件已定義，目前未掛載**（預留給資產表格內嵌小趨勢線）

---

### 6.9 摘要頁「掃描耗時分析」（非獨立元件）

用 inline div 實作的水平進度條 + grid，不是獨立圖表元件。  
資料來源：`SCAN_DURATION`（每個掃描類型的平均耗時秒數）。

---

### 6.10 摘要頁「Top Risk Assets」

用 `<div>` + `<div className="bar">` 實作的橫條排名，不是獨立圖表元件。  
資料來源：`TOP_RISK_ASSETS`（每個資產的最高風險 findings 數）。

---

## 7. 頁面結構與功能說明

### 7.1 摘要總覽（`summary.jsx`）

**核心問題**：現在系統掌握了什麼風險？

| 區塊 | 說明 |
|---|---|
| KPI Row 1（5格）| 總掃描次數、最近掃描、成功率、CycloneDX 驗證失敗、CBOM/SBOM 數 |
| KPI Row 2（5格）| 高風險憑證、過期憑證、30天內到期、弱演算法、TLS 1.0/1.1 暴露 |
| 掃描趨勢圖 | `LineChart` · 14天成功/失敗次數，可切換 Daily/Weekly |
| 掃描類型分布 | `Donut` · Source/Network/Container/SBOM 比例 |
| 憑證到期時間軸 | `ExpiryTimeline` · 0–30d / 30–60d / 60–90d / 90–180d |
| 憑證風險分布 | `Donut` · Valid/Expiring/Expired/Weak/Self-signed/Unparseable |
| 加密演算法分布 | `HBar` · RSA-2048/4096/ECDSA/Ed25519/RSA-1024(weak) |
| SBOM 生態分布 | `HBar` · npm/PyPI/Go/Maven/deb/RubyGems |
| Top Risk Assets | 排名條 · 6個風險最高資產 |
| 掃描耗時分析 | 4 種掃描類型平均耗時 + P95 / 最長 / 失敗率 |
| 最近活動 | 最新 6 筆掃描 + 點擊跳到掃描紀錄 |
| 工具與環境 | 5 個工具健康狀態縮圖 + 點擊跳到工具頁 |

**當前 todo**：Summary 頁的文字尚未套用 `useT()`，中英切換在此頁無效，需逐步補上。

---

### 7.2 開始掃描（`scan.jsx`）

**核心問題**：我要掃哪裡、啟用哪些功能？

3 個 card 區段，漸進式展開：

1. **命名 & 啟用功能**
   - 掃描名稱（必填）
   - 觸發者（必填，對應掃描紀錄的 `triggeredBy` 欄位）
   - 4 個功能 toggle card（Source / Network / Container / SBOM）

2. **掃描範圍**
   - 依啟用功能動態展開對應欄位
   - Source：路徑、遞迴深度、隱藏目錄、crypto 偵測
   - Network：目標（一行一筆）、Port range、TLS handshake、cert chain
   - Container：image/registry、local Docker toggle
   - SBOM：環境名稱、dependency graph toggle

3. **進階設定**（預設收合）
   - `--max-workers`、`--timeout`、`--output-dir`
   - 5 個 toggle：`--fail-fast`、`--validate`、`--keep-artifacts`、`--no-docker`、`--manifest-only`

右側 sticky panel：dry-run 預覽 + CLI 等效指令 + 範本選擇器。

**Run scan 按鈕停用條件**：掃描名稱或觸發者為空、或沒有啟用任何功能。

---

### 7.3 掃描紀錄（`history.jsx`）

**核心問題**：哪次掃描成功、失敗、產出了什麼？

| 功能 | 說明 |
|---|---|
| 頂部 5 個 mini stat | Running / Success / Partial / Failed / Validation OK 快速計數 |
| 搜尋 | 名稱 + scope + id 全文模糊搜尋 |
| 篩選 | Status / Type / Validated 三個下拉 |
| 表格欄位 | 名稱、類型 badge、狀態（running 含 progress bar）、scope、目標數、產出數、時長、CycloneDX、觸發者、開始時間 |
| Row actions | View（眼睛）/ Re-run（刷新）/ Download / More（三點） |
| 批次操作 | 勾選後出現：統整 CBOM / 統整 SBOM / Compare / Export / Delete |
| Detail Drawer | 點擊任一列開啟：狀態 banner + pipeline stages + scope + **dependency graph** + artifact 列表 |

#### Detail Drawer — Dependency graph 區塊

Drawer 中 Scope 區塊與 Output artifacts 之間，新增依賴圖展示：

| 元素 | 說明 |
|---|---|
| 標題列 | `DEPENDENCY GRAPH` 標題 + 右側 CBOM / SBOM segmented 切換 |
| 資訊列 | 對應 artifact 檔名（`full.cbom.json` / `full.sbom.json`）、節點數、邊數、`hover a node to trace` 提示 |
| 圖形區 | `<DependencyGraph>` SVG，點狀網格底板，支援橫向捲動 |
| 圖例列 | `<DepGraphLegend>`，顯示該圖用到的節點 kind 對應色塊 |
| 空狀態 | 若掃描沒有 CBOM / SBOM artifact（如失敗掃描），顯示虛線框 + 說明文字 |

**CBOM 圖的層級結構**（左 → 右）：
```
Scan root  →  掃描目標（net / container / source）  →  憑證 / 金鑰  →  加密演算法
```

**SBOM 圖的層級結構**（左 → 右）：
```
Root package  →  Direct dependencies  →  Transitive dependencies（第 2 層）
```

**掃描狀態**：`running`（藍點+進度條）/ `success`（綠）/ `partial`（橙，部分失敗）/ `failed`（紅，含錯誤訊息）

---

### 7.4 資產資料（`assets.jsx`）

**核心問題**：哪些憑證、金鑰、元件需要處理？

7 個 Tab，每個 tab 都是獨立的表格 + 篩選器：

| Tab | 說明 | 主要欄位 |
|---|---|---|
| 憑證資產 | 最核心的 tab，含 4 個 stat strip | CN、Issuer、Source、到期日、剩餘天數（紅/橙/綠色）、Sig algo、Key type/size、Risk、出現次數 |
| 金鑰資產 | 私鑰/公鑰/對稱金鑰清單 | Fingerprint、Type、Algorithm、Origin、Usage、First/Last seen、Risk |
| 加密演算法 | 演算法分布 + heatmap + 弱演算法列表 | 為什麼弱、建議替代方案、受影響資產數 |
| 軟體元件 | SBOM 元件清單 | name、version、purl、target、ecosystem、依賴數、重複次數、accuracy tier |
| 掃描目標 | 按 target 整合視角 | target 路徑、type badge、accuracy（HIGH/MEDIUM/LOW/FAILED）、certs/keys/components 數 |
| 網路服務 | TLS 服務端點 | endpoint、port、service、TLS version、cipher、HSTS、OCSP、Risk |
| Container | Docker image 清單 | image、tag、digest、size、layers、pkgs/certs/keys 數、Risk |

**憑證詳細 Drawer**：點擊任一憑證列，右側滑出 Drawer 顯示：
- Lifecycle（有效期）
- Crypto profile（所有欄位）
- Findings（自動標記：SHA-1、RSA<2048、self-signed、過期）
- 觀察到此憑證的掃描列表

---

### 7.5 CBOM / SBOM 報表（`pages-misc.jsx`）

**核心問題**：有哪些 BOM 報表、驗證是否通過？

- 3 個 tab：CBOM / SBOM / Merged
- 表格欄位：報表名稱、schema 版本、來源掃描數、元件數、crypto 數、驗證結果、檔案大小、產生時間
- 操作：View（眼睛）/ Download / More

---

### 7.6 工具與環境（`pages-misc.jsx`）

- 7 個外部工具狀態（syft / trivy / openssl / docker / semgrep / cyclonedx-cli / nmap）
- 狀態：`READY`（綠）/ `DRIFT`（橙，版本過舊）/ `MISSING`（紅，找不到 binary）
- Host 環境資訊（OS、kernel、CPU、RAM、磁碟、worker pool、平台版本）
- Worker 活動 `LineChart`（最近 60 分鐘的 active workers + queue depth）

---

### 7.7 設定（`pages-misc.jsx`）

6 個子分頁（左側 nav 列表）：

| 子頁面 | 說明 |
|---|---|
| General | Workspace 名稱、時區、掃描預設值（max-workers、timeout 等） |
| Schedules | 排程掃描管理（cron 表達式、啟用/停用） |
| Validation | CycloneDX schema 版本、驗證開關 |
| Notifications | Slack / PagerDuty / Email / Webhook 通知頻道 |
| Access | 團隊成員（email、角色、狀態） |
| API Tokens | CI/CD 用 API token 管理 |

---

## 8. 資料模型 (Mock Data)

所有 mock 資料定義在 `data.jsx`，掛到 `window` 全域。未來接入 API 時，只需把這些全域變數的賦值改為 `fetch` 結果即可。

### 關鍵資料結構

```js
// 掃描紀錄
{
  id: "scn-2026-0528-0432",       // 唯一 ID
  name: "Production API weekly",  // 人類可讀名稱
  types: ["source","network","container","sbom"],  // 啟用的掃描類型
  targets: 14,                    // 掃描目標數
  artifactsOk: 47,                // 成功的 artifact 數
  artifactsFail: 1,               // 失敗的 artifact 數
  startedAt: <timestamp>,         // Unix ms
  duration: 1486,                 // 秒
  status: "running",              // running / success / partial / failed / queued / cancelled
  progress: 0.62,                 // 0–1（僅 running 時有效）
  validated: null,                // true / false / null
  artifacts: ["full.cbom.json"],  // 產出的 artifact 檔名
  scope: "...",                   // 人類可讀的掃描範圍
  triggeredBy: "scheduler",       // 觸發者（email 或系統名稱）
  risk: "high",                   // 整體風險等級 high / warn / ok
  error: "...",                   // 僅 failed / partial 時有
}
```

```js
// 憑證
{
  cn: "edge-gateway.prod.corp",   // Common Name
  issuer: "Internal CA G3",
  serial: "4D:21:9F:0E",
  source: "Network",              // Network / Source Code / Container
  origin: "edge-gateway:443",     // 在哪裡找到的
  validFrom: "2024-09-12",
  validTo: "2026-06-04",
  daysLeft: 7,                    // 負數 = 已過期
  sigAlgo: "SHA-256 RSA",
  keyType: "RSA",
  keySize: 2048,
  risk: "high",                   // high / warn / ok
  selfSigned: false,
  dup: 3,                         // 在幾次掃描中出現
}
```

```js
// KPI 快照（從 scan_summary.json 聚合）
KPI_DATA = {
  totalScans: 1284,
  highRiskCerts: 47,
  expiredCerts: 18,
  expiringSoon: { d30: 23, d60: 41, d90: 67 },
  weakAlgos: 31,
  cbomCount: 312,
  sbomCount: 318,
  validationFailed: 7,
  componentsTracked: 18472,
}
```

---

## 9. i18n — 中英文切換

### 架構

```jsx
// app.jsx — 頂層 Provider
const [lang, setLang] = useState("zh");  // "zh" | "en"
<LangContext.Provider value={lang}>
  ...
</LangContext.Provider>
```

### 使用方式

```jsx
// 在任何元件中
const t = useT();
// t(中文, 英文) 若 lang === "en" 且有英文則顯示英文，否則顯示中文
<h1>{t("掃描紀錄", "Scan History")}</h1>
<div>{t("已過期", "Expired")}</div>
```

### 現況

- `sidebar.jsx`、`app.jsx`、`scan.jsx` 已套用 `useT()`
- `summary.jsx`、`history.jsx`、`assets.jsx`、`pages-misc.jsx` **尚未套用**，是下一步要補的
- 建議：每個元件第一行加 `const t = useT();`，所有中文字串包進 `t("中", "英")`

### topbar 切換按鈕

- 顯示的是「切換後的目標語言」：中文模式顯示「英」，英文模式顯示「中」
- 偏好存入 `localStorage("cbom-lang")`

---

## 10. 主題切換 (Light / Dark)

### 機制

```jsx
// app.jsx
const [theme, setTheme] = useState("light");  // "light" | "dark"

useEffect(() => {
  const root = document.documentElement;
  root.classList.add("theme-changing");        // 暫停所有 transition
  root.setAttribute("data-theme", theme);      // 切換 CSS token
  void root.offsetWidth;                       // 強制 reflow
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      root.classList.remove("theme-changing")  // 恢復 transition
    )
  );
  localStorage.setItem("cbom-theme", theme);
}, [theme]);
```

**為什麼需要 `theme-changing` class？**  
CSS `transition: background-color` 在 `var()` 值更換時，有些 browser 會保持舊的 computed value 直到 transition 結束，造成閃爍。加 class 暫停所有 transition 可解決。

### CSS 結構

```css
:root { /* Light 預設 */ }
:root[data-theme="dark"] { /* Dark override */ }
```

所有顏色都用 `var(--*)` token，自動響應主題切換。

### topbar 按鈕

- Light → 顯示月亮（moon icon）
- Dark → 顯示太陽（sun icon）

---

## 11. 開發注意事項

### 新增圖表

1. 在 `charts.jsx` 定義新元件
2. 最後 `Object.assign(window, { YourChart });` 暴露全域
3. 在頁面 JSX 直接使用

### 新增頁面 / 路由

1. 在對應 `.jsx` 檔寫頁面元件
2. 在 `app.jsx` 的 `titleByKey` 加入新 key
3. 在 `sidebar.jsx` 的 `items` 加入新導航項目
4. 在 `app.jsx` 的 render 區段加 `{active === "xxx" && <YourPage/>}`

### 新增 API 接入

目前所有資料都是 `data.jsx` 的靜態 mock。接入真實 API 時：
- 移除 `data.jsx` 中對應的靜態常數
- 在頁面元件加 `useEffect` + `fetch`
- 建議保留 `data.jsx` 的資料結構作為型別參考

### 顏色使用守則

| ✅ 應該 | ❌ 不應該 |
|---|---|
| `color: "var(--risk-high)"` | `color: "#e05c5c"` |
| `background: "var(--bg-panel)"` | `background: "#f4f6f9"` |
| `border: "1px solid var(--line)"` | `border: "1px solid #e1e4e8"` |
| 圖表色用 `CHART_COLORS[]` 陣列 | 自行挑選圖表顏色 |

唯一的例外：`--bg-code` 和 `--bg-tooltip` 永遠是深色（`#1a1d24`），code block 內的文字顏色 `#aacddf` 是硬編碼的（因為它不隨主題改變）。

### 批次操作 UX 規範

- 勾選任一列後，Table 上方出現 batch action bar（藍色背景）
- Batch bar 消失時機：所有勾選取消，或操作完成
- 批次操作包含：統整 CBOM、統整 SBOM、Compare、Export、Delete

### 風險視覺規範

- **不要讓整頁充滿警告色**：只有數值本身和 badge 使用風險色，背景用 `*-soft` 半透明版本
- 「高風險」優先顯示在列表最上方（未來需加排序邏輯）
- `daysLeft < 0` = 已過期，顯示 `−Nd`（負數）並強制 risk-high 色

### 已知待補事項

- [ ] Summary / History / Assets / Reports / Tools / Settings 頁面補上 `useT()` 中英翻譯
- [ ] Summary 頁的 Segmented（24h/7d/30d/90d）切換目前無實際邏輯，僅 UI
- [ ] Scan History 的「Compare」功能（diff view）尚未實作
- [ ] CBOM / SBOM 報表頁的 tab 切換沒有真實篩選邏輯
- [ ] 掃描頁「Run scan」按鈕點擊後無真實 API 呼叫（需接後端）
- [ ] `StackedBar` 和 `Sparkline` 元件已定義但尚未掛載到任何頁面
- [ ] Dependency graph 目前使用靜態 mock 資料（`DEP_GRAPHS` in `data.jsx`）；接入真實後端時需解析 `full.cbom.json` / `full.sbom.json` 的 `dependencies[]` 陣列
- [ ] 依賴圖大節點數處理（> 200 節點時應加截斷 + 展開按鈕）
- [ ] Dependency graph 可考慮擴展至資產資料頁（憑證 tab 的 Drawer 也放 CBOM 依賴圖）
