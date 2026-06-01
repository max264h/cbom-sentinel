// data.jsx — mock data for the BOM/Crypto Asset platform

const NOW = new Date("2026-05-28T14:32:00").getTime();

/* ---------- Scan history ---------- */
const SCAN_HISTORY = [
  {
    id: "scn-2026-0528-0432",
    name: "Production API weekly scan",
    types: ["source", "network", "container", "sbom"],
    targets: 14,
    artifactsOk: 47,
    artifactsFail: 1,
    startedAt: NOW - 1000*60*32,
    duration: 1486,
    status: "running",
    progress: 0.62,
    validated: null,
    artifacts: ["full.cbom.json","full.sbom.json","accuracy_report.json","scan_summary.json"],
    scope: "git@github.corp/payments/* + 10.4.0.0/16 + registry.corp/payments/*",
    triggeredBy: "scheduler",
    risk: "high",
  },
  {
    id: "scn-2026-0528-0312",
    name: "edge-gateway nightly",
    types: ["network", "sbom"],
    targets: 8,
    artifactsOk: 22,
    artifactsFail: 0,
    startedAt: NOW - 1000*60*60*11,
    duration: 824,
    status: "success",
    validated: true,
    artifacts: ["full.cbom.json","full.sbom.json","accuracy_report.json","scan_summary.json","pipeline_report.json"],
    scope: "edge-gateway.prod.corp + edge.corp.io",
    triggeredBy: "scheduler",
    risk: "warn",
  },
  {
    id: "scn-2026-0527-2241",
    name: "payments-svc release v3.18.2",
    types: ["source", "container", "sbom"],
    targets: 4,
    artifactsOk: 12,
    artifactsFail: 0,
    startedAt: NOW - 1000*60*60*16,
    duration: 412,
    status: "success",
    validated: true,
    artifacts: ["full.cbom.json","full.sbom.json","accuracy_report.json","scan_summary.json"],
    scope: "~/src/payments-svc + payments-svc:3.18.2",
    triggeredBy: "ci@payments-svc",
    risk: "ok",
  },
  {
    id: "scn-2026-0527-1908",
    name: "TLS audit · *.corp.io",
    types: ["network"],
    targets: 142,
    artifactsOk: 138,
    artifactsFail: 4,
    startedAt: NOW - 1000*60*60*19,
    duration: 2710,
    status: "partial",
    validated: true,
    artifacts: ["full.cbom.json","accuracy_report.json","scan_summary.json"],
    scope: "*.corp.io (142 hosts)",
    triggeredBy: "secops@corp",
    risk: "high",
  },
  {
    id: "scn-2026-0527-1142",
    name: "registry-images weekly · prod",
    types: ["container", "sbom"],
    targets: 38,
    artifactsOk: 71,
    artifactsFail: 5,
    startedAt: NOW - 1000*60*60*27,
    duration: 4318,
    status: "partial",
    validated: true,
    artifacts: ["full.cbom.json","full.sbom.json","accuracy_report.json","scan_summary.json"],
    scope: "registry.corp/prod/* (38 images)",
    triggeredBy: "scheduler",
    risk: "warn",
  },
  {
    id: "scn-2026-0526-2330",
    name: "internal-tools repo sweep",
    types: ["source", "sbom"],
    targets: 26,
    artifactsOk: 48,
    artifactsFail: 0,
    startedAt: NOW - 1000*60*60*39,
    duration: 1142,
    status: "success",
    validated: true,
    artifacts: ["full.sbom.json","accuracy_report.json","scan_summary.json"],
    scope: "~/src/internal-tools/**",
    triggeredBy: "kim.l@corp",
    risk: "ok",
  },
  {
    id: "scn-2026-0526-1654",
    name: "checkout-svc ad-hoc TLS check",
    types: ["network"],
    targets: 1,
    artifactsOk: 0,
    artifactsFail: 1,
    startedAt: NOW - 1000*60*60*46,
    duration: 38,
    status: "failed",
    validated: false,
    artifacts: ["scan_summary.json"],
    scope: "checkout-svc.internal:443",
    triggeredBy: "j.huang@corp",
    risk: "high",
    error: "TLS handshake timeout · openssl: connection reset (peer closed)",
  },
  {
    id: "scn-2026-0526-0900",
    name: "Container drift · staging",
    types: ["container"],
    targets: 22,
    artifactsOk: 44,
    artifactsFail: 0,
    startedAt: NOW - 1000*60*60*53,
    duration: 2204,
    status: "success",
    validated: true,
    artifacts: ["full.cbom.json","scan_summary.json","accuracy_report.json"],
    scope: "registry.corp/staging/* (22 images)",
    triggeredBy: "scheduler",
    risk: "warn",
  },
  {
    id: "scn-2026-0525-2317",
    name: "auth-svc release v2.7.0",
    types: ["source", "container", "sbom"],
    targets: 3,
    artifactsOk: 9,
    artifactsFail: 0,
    startedAt: NOW - 1000*60*60*63,
    duration: 318,
    status: "success",
    validated: true,
    artifacts: ["full.cbom.json","full.sbom.json","accuracy_report.json","scan_summary.json"],
    scope: "~/src/auth-svc + auth-svc:2.7.0",
    triggeredBy: "ci@auth-svc",
    risk: "ok",
  },
  {
    id: "scn-2026-0525-1500",
    name: "Quarterly external attack surface",
    types: ["network"],
    targets: 412,
    artifactsOk: 398,
    artifactsFail: 14,
    startedAt: NOW - 1000*60*60*71,
    duration: 8932,
    status: "partial",
    validated: true,
    artifacts: ["full.cbom.json","accuracy_report.json","scan_summary.json"],
    scope: "external · 412 endpoints",
    triggeredBy: "secops@corp",
    risk: "high",
  },
  {
    id: "scn-2026-0525-1212",
    name: "ml-platform repo sweep",
    types: ["source", "sbom"],
    targets: 18,
    artifactsOk: 36,
    artifactsFail: 0,
    startedAt: NOW - 1000*60*60*74,
    duration: 944,
    status: "success",
    validated: true,
    artifacts: ["full.sbom.json","accuracy_report.json","scan_summary.json"],
    scope: "~/src/ml-platform/**",
    triggeredBy: "scheduler",
    risk: "ok",
  },
  {
    id: "scn-2026-0524-2200",
    name: "data-warehouse-svc release v1.9.0",
    types: ["container", "sbom"],
    targets: 1,
    artifactsOk: 0,
    artifactsFail: 2,
    startedAt: NOW - 1000*60*60*88,
    duration: 96,
    status: "failed",
    validated: false,
    artifacts: ["scan_summary.json","pipeline_report.json"],
    scope: "dw-svc:1.9.0",
    triggeredBy: "ci@dw-svc",
    risk: "high",
    error: "syft: unable to read image manifest — registry returned 401",
  },
];

/* ---------- KPI snapshot ---------- */
const KPI_DATA = {
  totalScans: 1284,
  totalScansDelta: "+38 this week",
  lastScanAt: NOW - 1000*60*32,
  successRate: 0.946,
  highRiskCerts: 47,
  highRiskCertsDelta: "+5 vs last week",
  expiredCerts: 18,
  expiringSoon: { d30: 23, d60: 41, d90: 67 },
  weakAlgos: 31,
  weakAlgosBreakdown: { "RSA<2048": 14, "SHA-1": 9, "TLS 1.0/1.1": 8 },
  cbomCount: 312,
  sbomCount: 318,
  validationFailed: 7,
  componentsTracked: 18472,
};

/* ---------- Charts data ---------- */
const SCAN_TREND = {
  labels: ["05-15","05-16","05-17","05-18","05-19","05-20","05-21","05-22","05-23","05-24","05-25","05-26","05-27","05-28"],
  success: [22, 18, 26, 31, 28, 24, 19, 32, 35, 29, 41, 38, 44, 28],
  failed:  [ 1,  2,  1,  0,  3,  1,  2,  1,  4,  2,  1,  3,  2,  1],
};

const SCAN_TYPE_DIST = [
  { label: "Source Code",   value: 412, color: "#2a257f" },
  { label: "Network Based", value: 318, color: "#5462a0" },
  { label: "Container",     value: 297, color: "#aacddf" },
  { label: "SBOM",          value: 257, color: "#6b7db3" },
];

const CERT_RISK_DIST = [
  { label: "Valid",         value: 1842, color: "#2a8f5a" },
  { label: "Expiring soon", value: 131,  color: "#b87211" },
  { label: "Expired",       value: 18,   color: "#c93b3b" },
  { label: "Weak algo",     value: 31,   color: "#c47a4f" },
  { label: "Self-signed",   value: 24,   color: "#aacddf" },
  { label: "Unparseable",   value: 6,    color: "#6e6a67" },
];

const EXPIRY_BUCKETS = [
  { label: "0–30d",   value: 23, tone: "high" },
  { label: "30–60d",  value: 18, tone: "warn" },
  { label: "60–90d",  value: 26, tone: "warn" },
  { label: "90–180d", value: 64, tone: "ok" },
];

const ALGO_DIST = [
  { label: "RSA-2048",     value: 712, color: "#2a257f" },
  { label: "RSA-4096",     value: 281, color: "#5462a0" },
  { label: "ECDSA P-256",  value: 408, color: "#aacddf" },
  { label: "ECDSA P-384",  value: 162, color: "#6b7db3" },
  { label: "Ed25519",      value: 94,  color: "#8fa8bf" },
  { label: "RSA-1024 (weak)", value: 14, color: "#c93b3b" },
];

const SBOM_ECOSYSTEM = [
  { label: "npm",          value: 6184, color: "#2a257f" },
  { label: "PyPI",         value: 4271, color: "#5462a0" },
  { label: "Go module",    value: 3018, color: "#aacddf" },
  { label: "Maven",        value: 2104, color: "#6b7db3" },
  { label: "OS / deb",     value: 1842, color: "#8fa8bf" },
  { label: "RubyGems",     value: 421,  color: "#3b3781" },
  { label: "Other",        value: 632,  color: "#7e8fc2" },
];

const TOP_RISK_ASSETS = [
  { label: "edge-gateway.prod.corp", value: 14, color: "#c93b3b", muted:false, sub: "Network · 14 high-risk certs" },
  { label: "payments-svc:3.18.2",    value: 9,  color: "#c93b3b", sub: "Container · expired + weak" },
  { label: "*.corp.io (external)",   value: 8,  color: "#b87211", sub: "Network · weak algo · 8 hosts" },
  { label: "ml-platform/airflow",    value: 6,  color: "#b87211", sub: "Source · 6 weak algos" },
  { label: "checkout-svc.internal",  value: 5,  color: "#b87211", sub: "Network · TLS 1.0 detected" },
  { label: "auth-svc:2.7.0",         value: 3,  color: "#aacddf", sub: "Container · 3 self-signed" },
];

const SCAN_DURATION = [
  { label: "Source Code",   value: 184, color: "#2a257f" },
  { label: "Network Based", value: 312, color: "#5462a0" },
  { label: "Container",     value: 482, color: "#aacddf" },
  { label: "SBOM",          value: 96,  color: "#6b7db3" },
];

/* ---------- Asset data ---------- */
const CERTIFICATES = [
  { cn:"edge-gateway.prod.corp", issuer:"Internal CA G3", serial:"4D:21:9F:0E", source:"Network", origin:"edge-gateway.prod.corp:443", validFrom:"2024-09-12", validTo:"2026-06-04", daysLeft:7, sigAlgo:"SHA-256 RSA", keyType:"RSA", keySize:2048, risk:"high", selfSigned:false, dup:3 },
  { cn:"api.payments.corp", issuer:"DigiCert Global Root G2", serial:"08:1C:3D:7A", source:"Network", origin:"api.payments.corp:443", validFrom:"2025-03-01", validTo:"2026-06-19", daysLeft:22, sigAlgo:"SHA-256 RSA", keyType:"RSA", keySize:2048, risk:"warn", selfSigned:false, dup:1 },
  { cn:"legacy-billing.corp", issuer:"Self-signed", serial:"01:12:F4:88", source:"Network", origin:"legacy-billing.internal:443", validFrom:"2021-01-15", validTo:"2026-01-15", daysLeft:-133, sigAlgo:"SHA-1 RSA", keyType:"RSA", keySize:1024, risk:"high", selfSigned:true, dup:1 },
  { cn:"checkout-svc", issuer:"Internal CA G3", serial:"7E:0A:31:DD", source:"Container", origin:"checkout-svc:2.4.1 /etc/ssl/cert.pem", validFrom:"2025-06-22", validTo:"2027-06-22", daysLeft:390, sigAlgo:"SHA-256 ECDSA", keyType:"ECDSA P-256", keySize:256, risk:"ok", selfSigned:false, dup:8 },
  { cn:"auth.corp", issuer:"Let's Encrypt R3", serial:"03:9F:11:42", source:"Network", origin:"auth.corp:443", validFrom:"2026-03-04", validTo:"2026-06-02", daysLeft:5, sigAlgo:"SHA-256 ECDSA", keyType:"ECDSA P-256", keySize:256, risk:"high", selfSigned:false, dup:1 },
  { cn:"ml-runtime", issuer:"Internal CA G2", serial:"5A:B2:11:99", source:"Source Code", origin:"~/src/ml-platform/k8s/secrets/", validFrom:"2025-01-04", validTo:"2026-07-21", daysLeft:54, sigAlgo:"SHA-256 RSA", keyType:"RSA", keySize:4096, risk:"warn", selfSigned:false, dup:2 },
  { cn:"telemetry-relay", issuer:"Internal CA G3", serial:"2C:0D:5A:31", source:"Container", origin:"telemetry-relay:1.6 /etc/relay/cert.pem", validFrom:"2025-11-12", validTo:"2027-11-12", daysLeft:533, sigAlgo:"SHA-256 ECDSA", keyType:"ECDSA P-384", keySize:384, risk:"ok", selfSigned:false, dup:4 },
  { cn:"data-warehouse", issuer:"Self-signed", serial:"99:11:00:21", source:"Container", origin:"dw-svc:1.8 /opt/dw/tls/", validFrom:"2024-04-01", validTo:"2026-08-30", daysLeft:94, sigAlgo:"SHA-256 RSA", keyType:"RSA", keySize:2048, risk:"warn", selfSigned:true, dup:1 },
];

const COMPONENTS = [
  { name:"openssl",   version:"3.0.11",   type:"library", purl:"pkg:deb/debian/[email protected]", target:"payments-svc:3.18.2", ecosystem:"debian", deps:42, dup:14, tier:"HIGH", sources:["scn-2026-0527-2241","scn-2026-0526-0900"] },
  { name:"express",   version:"4.18.2",   type:"library", purl:"pkg:npm/[email protected]",       target:"checkout-svc:2.4.1", ecosystem:"npm",    deps:31, dup:8,  tier:"HIGH", sources:["scn-2026-0527-2241"] },
  { name:"cryptography", version:"42.0.2", type:"library", purl:"pkg:pypi/[email protected]", target:"ml-platform", ecosystem:"pypi", deps:14, dup:6, tier:"HIGH", sources:["scn-2026-0525-1212","scn-2026-0526-2330"] },
  { name:"go-jose",   version:"3.0.1",    type:"library", purl:"pkg:golang/gopkg.in/[email protected]", target:"auth-svc:2.7.0", ecosystem:"golang", deps:8, dup:2, tier:"HIGH", sources:["scn-2026-0525-2317"] },
  { name:"log4j-core", version:"2.20.0",  type:"library", purl:"pkg:maven/org.apache.logging.log4j/[email protected]", target:"data-warehouse-svc", ecosystem:"maven", deps:11, dup:3, tier:"MEDIUM", sources:["scn-2026-0524-2200"] },
  { name:"systemd",   version:"252.22-1~deb12u1", type:"package", purl:"pkg:deb/debian/[email protected]", target:"edge-gateway", ecosystem:"debian", deps:62, dup:18, tier:"HIGH", sources:["scn-2026-0528-0312"] },
  { name:"requests",  version:"2.31.0",   type:"library", purl:"pkg:pypi/[email protected]", target:"ml-platform/airflow", ecosystem:"pypi", deps:6, dup:11, tier:"HIGH", sources:["scn-2026-0525-1212"] },
  { name:"webpack",   version:"5.89.0",   type:"library", purl:"pkg:npm/[email protected]", target:"checkout-svc", ecosystem:"npm", deps:42, dup:5, tier:"MEDIUM", sources:["scn-2026-0526-2330"] },
];

/* ---------- Tools / env ---------- */
const TOOLS = [
  { name:"syft",     status:"ok",     version:"v1.13.0", path:"/usr/local/bin/syft",     lastUsed: NOW - 1000*60*32, role:"SBOM generator" },
  { name:"trivy",    status:"ok",     version:"v0.56.2", path:"/usr/local/bin/trivy",    lastUsed: NOW - 1000*60*32, role:"Vulnerability scan" },
  { name:"openssl",  status:"ok",     version:"3.2.1",   path:"/usr/bin/openssl",        lastUsed: NOW - 1000*60*32, role:"TLS · cert parsing" },
  { name:"docker",   status:"ok",     version:"24.0.7",  path:"/usr/bin/docker",         lastUsed: NOW - 1000*60*60*16, role:"Container runtime" },
  { name:"semgrep",  status:"warn",   version:"v1.62.0", path:"/usr/local/bin/semgrep",  lastUsed: NOW - 1000*60*60*39, role:"Source code lint", note:"version drift detected — recommended 1.64.0+" },
  { name:"cyclonedx-cli", status:"ok", version:"0.27.1", path:"/usr/local/bin/cyclonedx", lastUsed: NOW - 1000*60*60*11, role:"CycloneDX validator" },
  { name:"nmap",     status:"missing", version:"—",      path:"—",                       lastUsed: null, role:"Network discovery", note:"binary not found in PATH (apt install nmap)" },
];

/* ---------- Dependency graphs (CBOM / SBOM) ---------- */
// kind: root | target | library | package | cert | key | algo
const DEP_GRAPHS = {
  // CBOM: scan → targets → certs/keys → crypto algorithms
  cbom: {
    nodes: [
      { id: "scan",  label: "payments-prod",   sub: "CBOM aggregate", kind: "root" },
      { id: "t-net", label: "edge-gateway:443", sub: "network",        kind: "target" },
      { id: "t-ctr", label: "payments-svc:3.18.2", sub: "container",   kind: "target" },
      { id: "t-src", label: "~/src/payments-svc", sub: "source",       kind: "target" },

      { id: "cert-edge", label: "edge-gateway.prod", sub: "expires 7d", kind: "cert", risk: "high" },
      { id: "cert-api",  label: "api.payments.corp", sub: "expires 22d", kind: "cert", risk: "warn" },
      { id: "cert-chk",  label: "checkout-svc",      sub: "valid",       kind: "cert", risk: "ok" },
      { id: "key-jwt",   label: "jwt.key",           sub: "RSA private", kind: "key",  risk: "warn" },
      { id: "key-tls",   label: "tls-edge.key",      sub: "ECDSA",       kind: "key",  risk: "ok" },

      { id: "a-rsa2048", label: "RSA-2048",      kind: "algo" },
      { id: "a-rsa1024", label: "RSA-1024",      sub: "weak", kind: "algo", risk: "high" },
      { id: "a-ecdsa",   label: "ECDSA P-256",   kind: "algo", risk: "ok" },
      { id: "a-sha256",  label: "SHA-256",       kind: "algo", risk: "ok" },
      { id: "a-sha1",    label: "SHA-1",         sub: "deprecated", kind: "algo", risk: "high" },
    ],
    edges: [
      { from: "scan", to: "t-net" }, { from: "scan", to: "t-ctr" }, { from: "scan", to: "t-src" },
      { from: "t-net", to: "cert-edge" }, { from: "t-net", to: "cert-api" }, { from: "t-net", to: "key-tls" },
      { from: "t-ctr", to: "cert-chk" }, { from: "t-ctr", to: "key-jwt" },
      { from: "t-src", to: "key-jwt" }, { from: "t-src", to: "cert-chk" },
      { from: "cert-edge", to: "a-rsa2048" }, { from: "cert-edge", to: "a-sha256" },
      { from: "cert-api", to: "a-rsa2048" }, { from: "cert-api", to: "a-sha256" },
      { from: "cert-chk", to: "a-ecdsa" }, { from: "cert-chk", to: "a-sha256" },
      { from: "key-jwt", to: "a-rsa1024" }, { from: "key-jwt", to: "a-sha1" },
      { from: "key-tls", to: "a-ecdsa" },
    ],
  },

  // SBOM: target → direct deps → transitive deps
  sbom: {
    nodes: [
      { id: "root",   label: "payments-svc",  sub: "3.18.2",  kind: "root" },
      { id: "express",label: "express",       sub: "4.18.2",  kind: "package" },
      { id: "pg",     label: "pg",            sub: "8.11.3",  kind: "package" },
      { id: "jsonwebtoken", label: "jsonwebtoken", sub: "9.0.2", kind: "package" },
      { id: "openssl",label: "openssl",       sub: "3.0.11",  kind: "library", risk: "warn" },

      { id: "body-parser", label: "body-parser", sub: "1.20.1", kind: "package" },
      { id: "qs",     label: "qs",            sub: "6.11.0",  kind: "package" },
      { id: "pg-pool",label: "pg-pool",       sub: "3.6.1",   kind: "package" },
      { id: "jws",    label: "jws",           sub: "3.2.2",   kind: "package" },
      { id: "semver", label: "semver",        sub: "7.5.4",   kind: "package" },

      { id: "raw-body", label: "raw-body",    sub: "2.5.1",   kind: "package" },
      { id: "ecdsa-sig",label: "ecdsa-sig-formatter", sub: "1.0.11", kind: "package" },
      { id: "lodash", label: "lodash",        sub: "4.17.21", kind: "package", risk: "warn" },
    ],
    edges: [
      { from: "root", to: "express" }, { from: "root", to: "pg" },
      { from: "root", to: "jsonwebtoken" }, { from: "root", to: "openssl" },
      { from: "express", to: "body-parser" }, { from: "express", to: "qs" },
      { from: "body-parser", to: "raw-body" },
      { from: "pg", to: "pg-pool" }, { from: "pg", to: "semver" },
      { from: "jsonwebtoken", to: "jws" }, { from: "jsonwebtoken", to: "semver" },
      { from: "jsonwebtoken", to: "lodash" },
      { from: "jws", to: "ecdsa-sig" },
      { from: "pg-pool", to: "lodash" },
    ],
  },
};

// Pick the right graph(s) a given scan can show, based on its artifacts
function getDepGraph(scan, kind) {
  return DEP_GRAPHS[kind] || null;
}

Object.assign(window, {
  NOW, SCAN_HISTORY, KPI_DATA, SCAN_TREND, SCAN_TYPE_DIST, CERT_RISK_DIST,
  EXPIRY_BUCKETS, ALGO_DIST, SBOM_ECOSYSTEM, TOP_RISK_ASSETS, SCAN_DURATION,
  CERTIFICATES, COMPONENTS, TOOLS,
  DEP_GRAPHS, getDepGraph,
});
