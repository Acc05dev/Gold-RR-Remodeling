#!/usr/bin/env bash
# Runs Lighthouse (mobile + desktop) on four representative pages against a running production
# server and writes HTML + JSON reports to docs/lighthouse/. Needs CHROME_PATH or a local Chrome.
#   pnpm build && pnpm start -p 3105 &   then   bash scripts/lighthouse.sh
BASE="${BASE:-http://localhost:3105}"
OUT=docs/lighthouse
mkdir -p "$OUT"
for entry in "home|" "service|services/bathroom-remodeling" "city|service-areas/vallejo-ca" "contact|contact"; do
  name="${entry%%|*}"; route="${entry#*|}"
  npx -y lighthouse "$BASE/$route" --quiet --chrome-flags="--headless=new --no-sandbox" \
    --output=html --output=json --output-path="$OUT/$name-mobile" >/dev/null 2>&1
  npx -y lighthouse "$BASE/$route" --quiet --preset=desktop --chrome-flags="--headless=new --no-sandbox" \
    --output=html --output=json --output-path="$OUT/$name-desktop" >/dev/null 2>&1
done
node -e '
const fs=require("fs");const dir="docs/lighthouse";const rows=[];
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".report.json")).sort()){const j=JSON.parse(fs.readFileSync(dir+"/"+f));const c=j.categories;const a=j.audits;
rows.push({page:f.replace(".report.json",""),perf:Math.round(c.performance.score*100),a11y:Math.round(c.accessibility.score*100),best:Math.round(c["best-practices"].score*100),seo:Math.round(c.seo.score*100),LCP:a["largest-contentful-paint"].displayValue,CLS:a["cumulative-layout-shift"].displayValue,TBT:a["total-blocking-time"].displayValue});}
console.table(rows);fs.writeFileSync(dir+"/summary.json",JSON.stringify(rows,null,2));'
