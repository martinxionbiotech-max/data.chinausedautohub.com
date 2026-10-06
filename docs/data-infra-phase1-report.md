# ChinaUsedAutoHub — Data Infrastructure Phase 1 最终交付报告（STEP 9–12）

> 仓库：`data.chinausedautohub.com`（data 子站）
> 范围：STEP 9（数据质量自动检查）→ STEP 10（build）→ STEP 11（终检）→ STEP 12（本报告）
> 基线：STEP 1–2 审计为 16 品牌 / 20 车型 / 20 generations / 26 trims；STEP 8 已扩到 53 品牌 / 120 车型。
> 日期：2026-10-06

---

## A. 当前数据规模

| 实体 | 终数 | 相对 STEP 1–2 基线 |
|---|---|---|
| Brands | **53** | +37 |
| Models | **120** | +100 |
| Generations | **120** | +100（每车型 1 代，代际分离仍为已知 P2） |
| Trims | **126** | +100 |

页面总数（build 实测）：**185** 页（sitemap 收录 184 条 + 404 页）。

---

## B. 新增数据清单

### 新增品牌（37，相对基线 16）

**中国品牌（32）**：haval / tank / wey / ora / mg / roewe / maxus / galaxy / deepal / lynk-co / jetour / exeed / faw / hongqi / dongfeng / voyah / jac / baic / arcfox / zeekr / leapmotor / im-motors / xiaomi / denza / yangwang / fangchengbao / avatr / aito / seres / aion / neta / wuling

**外资品牌（5）**：tesla(US) / ford(US) / nissan(JP) / buick(US) / kia(KR)（均为中国在产合资/独资车型）

### 新增车型（100，相对基线 20）

按品牌分布（新品牌每 2–3 车型、重点品牌扩家族）：

- **BYD +10**（song-pro / song-l / sealion-6 / sealion-07 / dolphin / qin-l / frigate-07 / destroyer-05 / denza-d9 / denza-n7 —— 家族深化）
- **Chery +4**（tiggo-4 / tiggo-5x / tiggo-7 / arrizo-8）
- **Changan +4**（cs35-plus / cs55-plus / uni-t / uni-k）
- **GAC +2**（emkoo / gs8）、**Geely +2**（coolray / emgrand）
- **Li Auto +2**（l6 / l9）、**NIO +2**（es8 / et5）、**XPeng +2**（g9 / p7）
- **其余新品牌 37 个 × 平均 2 车型**（含 mg-4/mg-5/mg-hs、zeekr-001/007/x、xiaomi-su7/yu7、tesla-model-3/y、ford-everest/mondeo/territory 等）

每车型均带 generation + ≥1 trim + 溯源五元组（source_name/source_url/source_type/checked_date/confidence），无 AI 猜测数据。

---

## C. 数据模型变化（相对 STEP 1–2）

统一 schema（§4/§5/§9）已落地，字段变化：

| 层级 | 新增/变更字段 | 说明 |
|---|---|---|
| 所有层级 | `source_type`（十值枚举） | §5 溯源：official/manufacturer/government/regulatory/industry/reputable_media/database/market_observation/calculated/estimated |
| 所有层级 | `last_verified` | §16 核心数据核验日期 |
| 所有层级 | `source_name` / `checked_date` | 由旧 `source` / `source_date` 迁移（旧字段已弃用） |
| Brand | `status`（active/inactive） | 状态字段 |
| Model | `aliases` / `vehicle_type` / `powertrain_types` / `production_status` | 别名/类型/动力数组/生产状态 |
| Model | `china_market_status` | 中国市场定位（market_observation / medium） |
| Model | **Export Intelligence 九字段** | `export_relevance` / `common_export_regions` / `powertrain_export_relevance` / `right_hand_drive_relevance` / `left_hand_drive_relevance` / `market_considerations` / `parts_availability_notes` / `charging_standard_notes` / `homologation_notes` |
| Generation | `platform` / `facelift` + 溯源五元组 | 补全代际来源（原完全缺失） |
| Powertrain | 枚举新增 `erev` | 修正 Li Auto L6/L7/L9 等增程式（原误标 phev） |

**字段填充纪律**：无来源字段写 `null` 或「Not yet verified」/「Not available」，不猜测补全。

---

## D. SEO 改动

- **URL**：未改动（`/brands/{id}` `/models/{id}` 单段，保留 URL equity）
- **title**：120 车型页 `{name} {name_zh} — Specifications by Generation & Trim`、53 品牌页 `{name} {name_zh} — Models & Specifications`，全唯一（QA 实测 0 重复）
- **meta description**：全 185 页均有（QA 实测 0 缺失）
- **canonical**：全 185 页显式 `<link rel="canonical">`，全唯一（QA 实测 0 重复 / 0 缺失）
- **sitemap**：`sitemap-index.xml` → `sitemap-0.xml` 184 条全量收录，404 正确排除
- **robots.txt**：声明 `Sitemap: https://data.chinausedautohub.com/sitemap-index.xml`
- **internal links**：0 断链 / 0 orphan / 0 陈旧内链（QA 实测，含已知删除路由 `/countries/kenya/byd-song-plus/`、折叠 market `/ev/` `/suv/` `/regions/` `/import-guides/` `/documents/` 复查 = 0 残留）
- **Schema 补全**：新增 Organization + WebSite JSON-LD（首页，修复审计 P2-2）

---

## E. AIO 改动

- **Quick Facts**：120 车型页开头 10 行结构化速览（Brand / Model / Vehicle type / Powertrain / Production / Battery / Range / Drive / China market status / Export relevance），全部来自结构化字段，非 AI 生成文案
- **structured facts**：Vehicle Overview 20 行规格聚合 + Export Intelligence 9 字段结构化表格；缺值显式「Not available」/「Not yet verified」
- **source attribution**：每车型/品牌/代际/trim 显示 Source / Source type / Last checked / Last verified / Verification level（五元组溯源）
- **entity relationships**：Model↔Brand（Related Vehicles 同品牌车型）、Model↔Market（`MODEL_MARKETS` 映射到真实国家页）、Model↔Guide（主站 7 篇真实 guide）、Model↔Tool（4 真实计算器）、Brand↔Market（`ecosystem.ts` 品牌市场链）

---

## F. Schema 改动（实际使用类型）

| Schema.org 类型 | 使用位置 | 数量 |
|---|---|---|
| Vehicle | 车型页 + 模型索引 hasPart | 240 |
| Brand | 品牌页 + 品牌索引 hasPart + 车型页 brand | 226 |
| BreadcrumbList | 全页面 | 183 |
| ListItem | 面包屑项 | 659 |
| DefinedTerm / DefinedTermSet | Glossary | 20 / 1 |
| FAQPage / Question / Answer | Specification fields 参考页 | 1 / 18 / 18 |
| CollectionPage | 索引/聚合页 | 18 |
| Dataset | 首页 | 1 |
| **Organization**（新增） | 首页 | 1 |
| **WebSite**（新增） | 首页 | 1 |

**适用性说明**：未使用 Car/Product/Offer/AggregateRating/Review/price/availability —— data 站是「模型线知识库」，无具体车辆/价格/库存，强行堆这些类型违反 §13「只有确实适用时才用」。`Vehicle`（模型线）优于 `Car`（具体车辆）语义。Organization + WebSite 带稳定 `@id`（`/#organization` / `/#website`）。

---

## G. 数据质量（STEP 9 QA 五类实测）

QA 脚本 `scripts/qa_data.mjs`（本次补齐 SEO + stale + model/trim 重名子检查）实测：

| 类别 | 结果 |
|---|---|
| **Duplicate**（品牌/车型/代际/trim 重名重 id） | **0** |
| **Missing**（品牌/车型/generation 关系缺失） | **0** |
| **Invalid**（年份/尺寸/powertrain/battery-range 矛盾） | **0** |
| **SEO**（重复 title / 缺 description / 缺 canonical / orphan / 断链 / 陈旧内链） | **0 / 0 / 0 / 0 / 0 / 0** |
| **Source**（source_url 空 / stale / 非法 URL / confidence 非法 / source_type 非法） | **0 / 0 / 0 / 0 / 0** |
| Cross-entity（品牌 powertrain = 车型并集） | **0 漂移** |

**结论：全绿。Errors = 0，Warnings = 0。**

补充（审计 P1 已闭环）：P1-1 source_url 全 null → 已全补；P1-2 source_type 缺失 → 已落地十值枚举；P1-3 generation source 缺失 → 已补；P1-4 export 九字段 → 已落地；P1-5 li-auto EREV 误标 → 已改 `erev`（8 车型使用）。

---

## H. Build 结果 + 下一阶段建议

### Build 结果

```
npm run build → 185 page(s) built in ~2.9s — Complete!（0 build error）
sitemap-index.xml / sitemap-0.xml 已生成（184 条 URL）
```

终检逐项：broken links **0** · duplicate pages **0** · canonical **全唯一** · sitemap **184** · robots **声明 Sitemap** · schema **13 类型齐** · page rendering **185 页正常**（新 100 车型页全量抽查：Quick Facts ✓、canonical ✓、BreadcrumbList ✓、Vehicle schema 适用 ✓）· build errors **0**。

### 下一阶段建议（按总纲纪律）

**停止扩张，不写博客。** 当前 53 品牌 / 120 车型已超总纲「50+ / 100+」目标，且均满足「有来源 + 有出口价值 + 能成页」三条件。下一步应：

1. **Vehicle × Market 连接（核心下一步）**：把 `MODEL_MARKETS`（`model-links.ts` 硬编码 TS）与 `ecosystem.ts` 品牌市场链迁为数据文件（参照 `docs/vehicle-market-model.md` P3.8 六 delta 字段：drive_side_fit / age_rule_fit / ev_charging_compat / import_eligibility / shipping_route / cost_anchors），建立 `vehicle_id ↔ country_id` 关系数据。组合页归属 market 子站，纯机械组合（每车型×每国家）不建页，只做有真实商业意义的关系数据。
2. **代际分离（遗留 P2）**：120 车型各 1 代，多代际车型（Tiggo 8 2018–2025、MG ZS 2017 起等）跨代合并，待有真实分代来源时拆分。
3. **遗留 P2（非阻断）**：og:image / twitter 卡（无图资产，需后续配图）；sitemap `<lastmod>`；页脚 `lastUpdated` 落值。

**明确不做**：不写「10 Reasons / Best Chinese Cars / Top 10」博客、不建薄页、不虚构价格/销量/份额/税费，不触碰主站。

---

*本报告为 STEP 9–12 收官交付，QA 脚本、Schema 补全均已 commit。*
