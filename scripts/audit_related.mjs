#!/usr/bin/env node
// PHASE 2 template review: audit model pages for related-section entity counts
// (Related Vehicles / Markets / Guides / Tools), empty modules and residue.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = "dist/models";
const files = readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory());

function countListItems(html, heading) {
  const idx = html.indexOf(`>${heading}<`);
  if (idx < 0) return -1; // section absent
  const end = html.indexOf("</section>", idx);
  const block = html.slice(idx, end);
  return (block.match(/<li/g) || []).length;
}

const summary = {
  pages: 0,
  noRelatedVehicles: 0,   // section missing (single-model brand)
  oneRelatedVehicle: 0,   // present but <2 items
  noRelatedMarkets: 0,
  oneRelatedMarket: 0,
  noGuides: 0,
  noTools: 0,
  residue: 0,
};

for (const f of files) {
  summary.pages++;
  const html = readFileSync(join(dir, f, "index.html"), "utf8");

  const rv = countListItems(html, "Related Vehicles");
  if (rv < 0) summary.noRelatedVehicles++;
  else if (rv < 2) summary.oneRelatedVehicle++;

  const rm = countListItems(html, "Related Markets");
  if (rm < 0) summary.noRelatedMarkets++;
  else if (rm < 2) summary.oneRelatedMarket++;

  const rg = countListItems(html, "Related Guides");
  if (rg <= 0) summary.noGuides++;

  const rt = countListItems(html, "Related Tools");
  if (rt <= 0) summary.noTools++;

  if (/\{\{[^}]*\}\}|\{model\.[a-z_]+\}/.test(html)) summary.residue++;
}

console.log("== Model page template review ==");
console.log(`pages: ${summary.pages}`);
console.log(`no Related Vehicles section (single-model brand): ${summary.noRelatedVehicles}`);
console.log(`Related Vehicles <2 items: ${summary.oneRelatedVehicle}`);
console.log(`no Related Markets section: ${summary.noRelatedMarkets}`);
console.log(`Related Markets <2 items: ${summary.oneRelatedMarket}`);
console.log(`no Related Guides: ${summary.noGuides}`);
console.log(`no Related Tools: ${summary.noTools}`);
console.log(`pages with variable residue: ${summary.residue}`);
