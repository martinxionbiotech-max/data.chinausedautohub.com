# ChinaUsedAutoHub Data Infrastructure Phase 1 — 完整审计报告（STEP 1–2）

> 审计对象：`data.chinausedautohub.com`（data 子站仓库）
> 审计性质：**只读审计，未修改任何现有数据/代码文件**（本报告为唯一新增产出）
> 审计日期：2026-10-06
> 基线：Brand→Model→Generation→Trim 嵌套（实测 16 品牌 / 20 车型 / 20 generations / 26 trims）

---

## 0. 实测数据规模总览

| 实体 | 实测数 | 备注 |
|---|---|---|
| Brands | **16** | 10 中国品牌 + 6 外资品牌 |
| Models | **20** | 14 中国车型 + 6 外资车型 |
| Generations | **20** | 每车型恰 1 代（无多代际分离） |
| Trims | **26** | 26/20 车型有 trim，全部车型 ≥1 trim |
| 页面总数（build） | **47** | sitemap 实测 47 条 URL |

品牌清单：`byd / geely / chery / changan / gac / saic / great-wall / li-auto / nio / xpeng`（中国 10）+ `toyota / volkswagen / bmw / mercedes-benz / honda / hyundai`（外资 6）。

---

## 1. 当前数据库结构实况

### 1.1 嵌套关系（实测）

```
Brand (brands.json: 16)
 └─ Model (models.json: 20)           ← brand_id 关联
     └─ Generation (models.json 内嵌: 20)   ← 无独立 generation 字段源，直接嵌在 model.generations[]
         └─ Trim (内嵌: 26)                ← 直接嵌在 generation.trims[]
             └─ specs (扁平对象)            ← 规格全部嵌在 trim.specs{}
```

**关键结论**：Generation 与 Trim **没有独立建模**，均为 `models.json` 内的嵌套数组；没有 `generations.json` / `trims.json` 独立文件。Brand 与 Model 是独立文件（`brands.json` / `models.json`），Model 通过 `brand_id` 关联 Brand。

### 1.2 逐层字段清单（全部字段，实测）

**Brand（16 条，`shared/data/brands.json`）** — 11 字段：
`brand_id` · `name` · `name_zh` · `origin_country`(CN/JP/DE/KR) · `founded` · `powertrains[]` · `vehicle_types[]` · `source` · `source_url` · `source_date` · `confidence`

**Model（20 条，`shared/data/models.json`）** — 11 字段：
`model_id` · `brand_id` · `name` · `name_zh` · `body_type`(suv/sedan) · `status`(active) · `generations[]` · `source` · `source_url` · `source_date` · `confidence`

**Generation（20 条，内嵌）** — 3 字段：
`generation_id` · `name` · `production_years[]` · `trims[]`

**Trim（26 条，内嵌）** — 7 字段：
`trim_id` · `name` · `powertrain`(ev/phev/ice) · `production_years[]` · `specs{}` · `spec_source` · `spec_source_url` · `spec_source_date` · `confidence`

**Trim.specs（扁平对象，17 个已知 key，实测仅用到 15 个）**：
`length_mm` · `width_mm` · `height_mm` · `wheelbase_mm` · `engine` · `engine_displacement_cc` · `motor_power_kw` · `battery_capacity_kwh` · `range_km` · `transmission` · `drive_type` · `seats` · `fuel_consumption_l100km` · `max_speed_kmh` · `acceleration_0_100_s`
（schema 声明但**数据从未填充**：`curb_weight_kg` / `cargo_l` / `charging`，填充率 0/26）

### 1.3 Powertrain / Specification / Market / Source 建模现状

| 概念 | 是否独立建模 | 实况 |
|---|---|---|
| **Powertrain** | ❌ 否 | trim 上的字符串枚举 `powertrain`（ev/phev/ice）+ brand 上的 `powertrains[]` 数组。无独立 powertrain 实体/表。**`hev` 从未被任何 trim 使用**。 |
| **Specification** | ❌ 否 | 嵌在 `trim.specs{}` 扁平对象内，无独立 spec 实体/字段引用表（渲染层 `SPEC_ORDER`/`SPEC_LABELS` 硬编码在 `helpers.ts`）。 |
| **Market** | ❌ 否（data 仓内） | data 仓**无任何 Market 数据文件**。市场关系靠硬编码 TS 常量：`src/lib/model-links.ts`（`MODEL_MARKETS` 映射）、`src/lib/ecosystem.ts`（`LINKS` 映射）、`src/lib/model-notes.ts`（目的地注意事项文案）。无 Vehicle↔Market 关系数据文件。 |
| **Source** | ⚠️ 半独立 | 每个实体内嵌 4 元组 `source/source_url/source_date/confidence`（Brand/Model/Trim 三级），但**无规范化 Source 实体/表**，同一来源字符串（"Manufacturer published specifications"）被重复 46 次内联。 |

### 1.4 数据文件清单与引用关系

| 文件 | 所有权 | 本仓角色 |
|---|---|---|
| `shared/data/brands.json` | DATA | 本仓维护（写） |
| `shared/data/models.json` | DATA | 本仓维护（写） |
| `shared/data/countries.json` / `importrules.json` / `taxrules.json` / `ports.json` / `routes.json` | MARKET | 本仓只读（实际未 import） |
| `shared/data/companies.json` | COMPANIES | 本仓只读（实际未 import） |
| `shared/data/fx.json` | TOOLS | 本仓只读（实际未 import） |
| `shared/data/SCHEMA.md` / `README.md` | 契约 | 数据契约文档 |

**渲染层读取方式**：`src/lib/helpers.ts` 通过 `import brandsData from "../../shared/data/brands.json"` 与 `import modelsData from "../../shared/data/models.json"` 静态 import 两个 JSON，导出 `brands` / `models` 常量 + 聚合函数（`getBrand` / `getModelsByBrand` / `countTrims` / `modelPowertrains` / `specRows` 等）。页面模板（`.astro`）通过 `getStaticPaths()` 逐实体生成静态页。

**shared 层一致性（实测 md5）**：`shared/config/config.ts`、`shared/data/models.json`、`shared/data/brands.json` 在 data/market/tools/companies 四仓 **md5 完全一致**（`d032b2d0...` / `15d1d8ea...` / `739d8da4...`）——符合"四仓 shared 同步"约束。

**数据/展示分离现状**：结构化车辆数据（brands/models JSON）已与展示分离 ✅；但**编辑性内容硬编码在 TS 源文件**（`market-position.ts` 20 条定位文案、`model-notes.ts` 11 车型注记、`reference.ts` 术语/规格说明），未数据化——属"半分离"。

---

## 2. 检查清单逐项（§2 清单）

§2「检查」清单共 24 项 = 6 数据实体项（已在 §1 覆盖）+ 18 项技术/SEO 检查（下表逐项）。

| # | 检查项 | 结论 | 证据 |
|---|---|---|---|
| 1 | Navigation | ✅ OK | `Header.astro` 生态导航 5 站（Vehicles/Data/Companies/Tools/Markets）+ `currentSection` 高亮；`config.ts` 五域名常量 |
| 2 | Internal links | ⚠️ 1 条陈旧 | 品牌↔车型↔相关车型/市场/指南/工具内链完整；但 `ecosystem.ts:16` 仍硬编码 `/countries/kenya/byd-song-plus/`（该机械组合页已在 prelaunch-P1 删除，market 仓 `_redirects` 有 301，非硬 404，但属陈旧死链） |
| 3 | Canonical | ✅ OK | 所有页面显式传 `canonical`；`BaseLayout` 兜底 `siteUrl + pathname`；实测 47 页均有 canonical |
| 4 | Sitemap | ✅ OK | `dist/sitemap-index.xml` → `sitemap-0.xml`，47 条 URL 全量收录；404 正确排除 |
| 5 | robots.txt | ✅ OK | `public/robots.txt` 声明 `Sitemap: https://data.chinausedautohub.com/sitemap-index.xml` |
| 6 | Schema.org | ⚠️ 缺 2 类 | 已用 Vehicle/Brand/Dataset/CollectionPage/FAQPage/DefinedTermSet/BreadcrumbList；**缺 Organization + WebSite**（§13 清单要求） |
| 7 | Breadcrumb | ✅ OK | 所有页面传 `breadcrumbs` + `breadcrumbJsonLd`（BreadcrumbList）；模型页 4 级（Home>Brands>品牌>车型） |
| 8 | Metadata | ⚠️ 缺 image | charset/viewport/robots meta 齐；**缺 og:image 与 twitter 卡** |
| 9 | OpenGraph | ⚠️ 部分 | og:title/type/url/description 有；**无 og:image** |
| 10 | Page titles | ✅ OK | 47 页 title 全唯一（含品牌/车型名） |
| 11 | Description | ✅ OK | 47 页均有 meta description |
| 12 | Heading hierarchy | ✅ OK | 每页单一 H1；模型页 H1→H2(节)→H3(trim)；品牌页 H1→H2→H3(模型) |
| 13 | Duplicate content | ✅ OK | model_id/trim_id/generation_id/brand_id 实测零重复 |
| 14 | Thin pages | ⚠️ 边界 | `body-types` / `powertrains` / `vehicle-types/{ev,hybrid,suv,sedan}` 为聚合 listing 页（卡片列表），独立可读内容少，属导航 hub 性质，非独立 SEO 目标 |
| 15 | Orphan pages | ✅ OK | 全部页面可由首页→索引→详情链达；无孤立页 |
| 16 | URL structure | ✅ OK | `/brands/{id}` `/models/{id}`（单段）/`body-types/` `/powertrains/` `/vehicle-types/{type}/` 干净 |
| 17 | source 字段 | ⚠️ 大缺口 | 三级均带 `source/source_url/source_date/confidence`，但 **source_url 全部 null**（16 品牌 + 20 车型 + 26 trim = 62 条全 null）；**无 source_type 字段** |
| 18 | last-updated | ⚠️ 部分 | 三级有 `source_date`（=2026-10-04）作 last-checked；但**页脚 "Last updated" 未被任何页面传值**（`BaseLayout.lastUpdated` 恒空）；sitemap 无 `<lastmod>` |

**异常项汇总**：18 项中 ✅ 12 项、⚠️ 6 项（Internal links / Schema.org / Metadata / OG / Thin / source 字段 / last-updated 共 7 处标记，其中 source 字段为最重缺口）。

---

## 3. 与目标模型差距矩阵（§4 统一 schema + §5 provenance + §9 export）

### 3.1 Brand 层

| 目标字段(§4) | 现状字段 | 状态 |
|---|---|---|
| id | brand_id | ✅ 已支持（命名差异） |
| name | name | ✅ |
| country | origin_country | ✅（命名差异） |
| founded | founded | ✅ |
| official_website | — | ❌ 缺失 |
| source | source | ✅ |
| status | — | ❌ 缺失 |
| （额外） | name_zh / powertrains[] / vehicle_types[] / source_url / source_date / confidence | ✅ 超额，保留 |

### 3.2 Model 层

| 目标字段(§4) | 现状字段 | 状态 |
|---|---|---|
| id | model_id | ✅（命名差异） |
| brand_id | brand_id | ✅ |
| name | name | ✅ |
| aliases | — | ❌ 缺失（Monjaro/Xingyue L、Atto 3/Yuan Plus 等别名未结构化） |
| vehicle_type | — | ❌ 缺失（仅 body_type） |
| body_style | body_type | ✅（语义近似） |
| powertrain_types | —（可派生） | ⚠️ 未落字段，可从 trims 派生（`modelPowertrains()`） |
| production_status | status(active) | ⚠️ 有 status 但枚举仅 active（无 discontinued 实例），且未区分"生产状态"与"中国在售状态" |
| china_market_status | —（仅硬编码 `market-position.ts` 文案） | ❌ 未结构化 |
| export_relevance | — | ❌ 缺失 |
| source | source | ✅ |
| last_verified | source_date | ⚠️ 有 source_date 但无 last_verified 语义字段 |

### 3.3 Generation 层

| 目标字段(§4) | 现状字段 | 状态 |
|---|---|---|
| id | generation_id | ✅（命名差异） |
| model_id | （内嵌于 model，无显式） | ⚠️ 由父级隐含，无显式 model_id |
| generation_name | name | ✅ |
| production_year_start / end | production_years[] | ⚠️ 数组形式（无显式 start/end），语义近似 |
| platform | — | ❌ 缺失 |
| facelift | — | ❌ 缺失 |
| source | — | ❌ **Generation 级完全无 source 字段** |
| last_verified | — | ❌ 缺失 |

### 3.4 Trim 层

| 目标字段(§4) | 现状字段 | 状态 |
|---|---|---|
| id | trim_id | ✅（命名差异） |
| generation_id | （内嵌，无显式） | ⚠️ 隐含 |
| trim_name | name | ✅ |
| model_year | — | ❌ 缺失（仅 production_years[]） |
| drivetrain | specs.drive_type | ⚠️ 嵌在 specs，非顶层 |
| transmission / engine / motor / battery / range / dimensions / weight | specs.* | ⚠️ 全部嵌 specs（transmission/engine/motor_power_kw/battery_capacity_kwh/range_km/length/width/height/wheelbase）；**weight(curb_weight_kg) 0 填充** |
| source | spec_source | ✅（命名差异） |
| last_verified | — | ❌ 缺失 |

### 3.5 Provenance 五元组（§5）差距

| 目标五元组 | 现状 | 差距 |
|---|---|---|
| source_name | `source` / `spec_source` | ⚠️ 命名差异（映射即可） |
| source_url | `source_url` / `spec_source_url` | ⚠️ 字段存在但**全 null（62/62）** |
| source_type | — | ❌ **完全缺失**（§5 十值枚举 official/manufacturer/government/regulatory/industry/reputable_media/database/market_observation/calculated/estimated 未落地） |
| checked_date | `source_date` / `spec_source_date` | ⚠️ 命名差异（映射）；但全站统一 "2026-10-04"，疑似批量盖章而非逐条核验 |
| confidence | `confidence` | ⚠️ 现状四值 high/medium/low/unknown；目标三值 high/medium/low（多出 unknown） |

**现状 source 值 → 目标 source_type 映射建议**：
- `"Manufacturer published specifications"`（model+trim）→ `manufacturer`
- `"Official brand history"`（brand）→ `official`
- `"Public market knowledge"`（market-position.ts）→ `market_observation`

### 3.6 Export Intelligence（§9）差距 — **最大结构性缺口**

§9 目标字段（model 级）：`export_relevance` / `common_export_regions` / `powertrain_export_relevance` / `right_hand_drive_relevance` / `left_hand_drive_relevance` / `market_considerations` / `parts_availability_notes` / `charging_standard_notes` / `homologation_notes`

**现状：全部缺失（9/9）**。出口信息仅以两种非结构化形式存在：
1. 模板硬编码通用文案（`models/[model].astro` 的 "Export Considerations" 区块 — 通用 LHD 声明 + 硬编码 Kenya 链接）；
2. `model-notes.ts` 11 个车型的 `destination[]` 注记（TS 常量，非数据）。

**字段差距总数**：Brand 缺 2 / Model 缺 5（+3 未结构化）/ Generation 缺 5 / Trim 缺 2（+1 未落位）/ Provenance 缺 1（source_type）+ 全 null 1（source_url）/ Export 缺 9。

---

## 4. 问题清单（P0 / P1 / P2）

### P0（阻断级 / 事实错误）— **0 项**

实测未发现会导致 build 失败、服务错误数据或硬 404 的问题。无重复 ID、无坏关系、无非法年份、无坏内链。

### P1（关键缺口，本阶段必补）— **5 项**

| # | 问题 | 证据 |
|---|---|---|
| P1-1 | **source_url 全量 null（62/62）**：所有品牌/车型/trim 的 source 都只有字符串无 URL，"Manufacturer published specifications" 无法溯源验证 | `models.json` 20 条 + `brands.json` 16 条 source_url 均 null；trim 级 spec_source_url 26/26 null（实测脚本） |
| P1-2 | **source_type 字段缺失**：无法区分 official/manufacturer/calculated/estimated，§5 十值枚举未落地 | SCHEMA.md 无 source_type；helpers.ts 无对应字段 |
| P1-3 | **Generation 级 source 完全缺失**：代际（platform/facelift/来源）无法溯源，与 model/trim 三级溯源不一致 | generation 对象仅 3 字段（generation_id/name/production_years/trims），无 source |
| P1-4 | **Export Intelligence 九字段全缺**：§9 核心差异化数据层（出口相关性/RHD-LHD/市场考量/充电/认证）零落地 | 全仓无 export_relevance 等任何字段；仅 `model-notes.ts` 11 车型硬编码文案 |
| P1-5 | **品牌 powertrain 与实际车型不一致**：li-auto 品牌标 `["ev"]` 但 L7 trim 是 `phev`（EREV 被误标 phev，glossary 有 "erev" 定义但 powertrain 枚举无此值）；great-wall 标含 `ev` 但无 EV 车型；chery 标含 `phev/ev` 但仅 ICE 车型 | `brands.json` li-auto.powertrains=["ev"] vs `models.json` li-auto-l7 trim.powertrain="phev"；EREV 语义缺失 |

### P2（优化项）— **7 项**

| # | 问题 | 证据 |
|---|---|---|
| P2-1 | 陈旧跨站链接：`ecosystem.ts:16` 仍指向已删除的 `/countries/kenya/byd-song-plus/`（market 仓有 301 兜底，非硬 404，但应改指 `#ev-rules` 或 Kenya 国家页） | `ecosystem.ts` 第 16 行 |
| P2-2 | 缺 Organization + WebSite JSON-LD（§13 清单要求） | 全仓 grep 无 `"Organization"`/`"WebSite"` |
| P2-3 | 无 og:image / twitter 卡（社交分享卡缺） | 全仓 grep 无 `og:image`/`twitter:` |
| P2-4 | source_date 全站统一 "2026-10-04"，疑批量盖章非逐条核验（伪实时） | 62 条 source_date 全同 |
| P2-5 | 页脚 "Last updated" 未落地：`BaseLayout.lastUpdated` 无任何页面传值 | grep `lastUpdated=` 仅 BaseLayout 内部出现，页面层零传值 |
| P2-6 | sitemap 无 `<lastmod>` | `dist/sitemap-0.xml` 47 条 URL 均无 lastmod |
| P2-7 | 代际未分离：20 车型各仅 1 代，多代际车型（如 Tiggo 8 2018 起、MG ZS 2017 起）跨代合并，与 SCHEMA"代际必须分开"约定冲突 | 全 20 模型 generation 数 = 1；chery-tiggo-8-g1 production_years 2018–2025 跨越 7 年 |

### P0/P1/P2 计数汇总

**P0 = 0 · P1 = 5 · P2 = 7**（合计 12 项）

---

## 5. 迁移方案输入（STEP 3–5 用）

### 5.1 数据文件重组建议（保持 URL 不变前提）

**现状已具备的好基础**：URL 架构（`/brands/{id}` `/models/{id}` 单段）与数据文件（`brands.json` + `models.json` 独立 JSON）已达标，**无需改 URL、无需大改文件结构**。schema 迁移路径：

1. **原地扩展，不拆文件**：保持 `brands.json` / `models.json` 两个文件，新增字段直接在 JSON 内加键（Generation/Trim 继续内嵌）。理由：URL 不变、渲染层 `helpers.ts` 改动最小、四仓 shared 同步成本最低。
2. **Provenance 字段重命名映射**：`source→source_name`、`source_date→checked_date` 建议**兼容式**（新增新键、旧键保留一阶段或一次性迁移 + 渲染层同步改），不强行删除旧字段以免四仓漂移。核心新增 `source_type`。
3. **Export Intelligence 落位**：新增到 **Model 级**（§9 定义为 model 级字段），以 `export` 子对象或平铺字段落位；未核实项写 `"Not yet verified"` 或 null。
4. **Generation 补 source**：给 generation 加 `source/source_url/source_date/confidence`（或复用 model 级），补 platform/facelift 可空字段。
5. **编辑性内容数据化（可选后续）**：`market-position.ts` → `model.china_market_status` 结构化字段；`model-notes.ts` → 结构化 `used_market_notes[]` / `destination_notes[]`。本阶段可先只做 schema，内容迁移延后。

### 5.2 渲染层与数据层分离现状核实

- **结构化数据**：已分离 ✅（JSON 静态 import，无硬编码在组件中）。
- **编辑/叙述内容**：未分离 ⚠️（`market-position.ts` / `model-notes.ts` / `reference.ts` 硬编码在 TS）。
- **跨站关系**：硬编码在 TS 常量（`model-links.ts` / `ecosystem.ts`），非数据文件。
- **结论**：数据/展示分离**部分达成**；Vehicle 规格数据已达标，但"Market 关系 + 编辑叙述"仍属代码层，未来接 Vehicle×Market 关系数据时需把 `MODEL_MARKETS` 映射迁为数据文件（`vehicle-market.json`，参照 P3.8 文档 `docs/vehicle-market-model.md`）。

### 5.3 新增字段落位建议

| 新增字段 | 落位 | 说明 |
|---|---|---|
| source_type | Brand / Model / Generation / Trim 四级 | 十值枚举，映射现有 source 字符串 |
| checked_date | 同四级 | 由 source_date 迁移/映射 |
| official_website / status | Brand | 官网 + 状态 |
| aliases / vehicle_type / powertrain_types / china_market_status / export_relevance / last_verified | Model | 别名/类型/动力/中国定位/出口相关性/核验 |
| platform / facelift / source / last_verified | Generation | 平台/改款/来源/核验 |
| model_year / last_verified | Trim | 年款/核验 |
| export 九字段 | Model | §9 Export Intelligence |

---

## 6. STEP 8 首批车型候选评估（只评估，不写入）

### 6.1 品牌缺口（§7 目标 20 品牌 vs 现有）

**现有中国品牌（10）**：BYD、Geely、Chery、Changan、Great Wall、SAIC、GAC、NIO、XPeng、Li Auto。

**缺失中国品牌（10）**：Jetour、Exeed、FAW、Dongfeng、JAC、BAIC、Zeekr、Leapmotor、IM Motors、Xiaomi Auto。

**子品牌未独立建模**（挂在父品牌下）：Haval/Tank/Wey/Ora（GWM）、MG/Roewe/Maxus（SAIC）、Galaxy（Geely）、Deepal（Changan）。当前 MG 以 `saic-mg-zs`、Haval 以 `great-wall-haval-h6` 形式扁平化在父品牌下。

### 6.2 车型缺口（§7 高价值清单 vs 现有 20 车型）

**现有中国车型（14）**：BYD Song Plus / Qin Plus / Atto 3(Yuan Plus) / Han / Seal，Geely Monjaro(Xingyue L)，Chery Tiggo 8，Haval H6，Changan CS75 Plus，Li Auto L7，NIO ES6，XPeng G6，GAC GS4，MG ZS。

**缺失高价值车型（§7 点名，按出口价值 + 数据可得性双排序）**：

| 优先级 | 车型 | 品牌 | 出口价值 | 数据可得性 | 理由 |
|---|---|---|---|---|---|
| ⭐⭐⭐ 高 | Song Pro / Song L | BYD | 高 | 高 | Song 家族出口主力，与现有 Song Plus 数据同源 |
| ⭐⭐⭐ 高 | Sealion 6 / Sealion 07 | BYD | 高 | 高 | 全球热销 SUV，出口澳大利亚/欧洲/东南亚 |
| ⭐⭐⭐ 高 | Dolphin | BYD | 高 | 高 | 全球紧凑 EV 主力 |
| ⭐⭐⭐ 高 | Yuan Pro / Yuan Plus 海外版 | BYD | 高 | 高 | Atto 3 已存在，补 Yuan 家族 |
| ⭐⭐⭐ 高 | Coolray(Binyue) / Emgrand | Geely | 高 | 高 | 主站已有 coolray dataModelId:null，出口沙特/中东 |
| ⭐⭐⭐ 高 | Tiggo 7 / Tiggo 5X / Arrizo 8 | Chery | 高 | 高 | 主站已有 tiggo-8-pro/arrizo-8 dataModelId:null，Chery 出口量中国第一 |
| ⭐⭐⭐ 高 | CS35 Plus / CS55 Plus | Changan | 高 | 高 | 主站已有 uni-v dataModelId:null |
| ⭐⭐⭐ 高 | Tank 300 / Tank 500 | GWM | 高 | 中 | 越野 SUV 出口俄罗斯/中东/澳新 |
| ⭐⭐⭐ 高 | Galaxy L7 / Galaxy E5 | Geely | 中高 | 中 | 新能源子品牌，出口增长快 |
| ⭐⭐⭐ 高 | Deepal S07 / S05 | Changan | 中高 | 中 | 新能源子品牌 |
| ⭐⭐ 中 | MG4 / MG5 / Roewe | SAIC | 高 | 中 | 现有 MG ZS，扩 MG 家族 |
| ⭐⭐ 中 | Zeekr 001 / 007 | Zeekr(缺失品牌) | 高 | 中 | 需先建品牌 |
| ⭐⭐ 中 | Xiaomi SU7 | Xiaomi(缺失品牌) | 高 | 中 | 需先建品牌，热度极高 |
| ⭐⭐ 中 | Jetour X70 / Dashing | Jetour(缺失品牌) | 高 | 中 | 非洲/中东出口主力，需先建品牌 |
| ⭐ 低 | Leapmotor C10 / IM LS6 / NIO ET5 / XPeng P7 | 各 | 中 | 中 | 二次迭代候选 |

**缺口结论**：品牌缺 10/20，车型缺约 30+ 个 §7 点名高价值车型。**建议 STEP 8 首批 20–30 车型**：优先补全 BYD（Song Pro/Song L/Sealion/Dolphin/Frigate/Destroyer）、Geely（Coolray/Emgrand/Galaxy）、Chery（Tiggo 7/5X/Arrizo 8）、Changan（CS35/55/UNI-T/K/Deepal）、GWM（Tank）——均为"出口量靠前 + 主站已有 dataModelId 映射或官方数据易得"的组合。**每个新增车型必须满足 §7 三条件**（有来源 + 有出口价值 + 能成页），宁缺毋滥，不机械填满。

---

## 7. 数据质量检查机制现状（§15）

### 7.1 现状：**本仓无任何 QA 脚本**

- `data.chinausedautohub.com` 仓库**无 `scripts/` 目录**，无 `.py` / `.mjs` / `validate` / `qa` 脚本（实测 `find` 确认）。
- 无 CI 配置，无 `package.json` 的 test/lint 脚本（仅 dev/build/preview）。
- 主站 `chinausedautohub.com/scripts/`（`update-vehicle.mjs` 等）是**车辆库存门禁**，不覆盖 data 子站的结构化车型数据。

### 7.2 可参考的兄弟仓 QA 脚本（非本仓）

| 仓库 | 脚本 | 覆盖 |
|---|---|---|
| CNEVhub | `scripts/qa_data.py` + `scripts/validate-data.mjs` | 数据校验 |
| LanDeng | `scripts/validate-schema.mjs` | schema 校验 |
| data-landeng | `scripts/check-consistency.py` | 计数一致性 |
| china-ai-hub | `scripts/check-entity-counts.py` | 实体计数 |

### 7.3 覆盖项 vs §15 五类要求差距

| §15 要求类别 | 现状覆盖 | 差距 |
|---|---|---|
| Duplicate（品牌/车型/trim 重复） | ❌ 无自动化 | 本审计手工核验（零重复），但无脚本持续保障 |
| Missing（缺关系） | ❌ 无自动化 | 本审计手工核验（零缺关系） |
| Invalid（年份/尺寸/动力一致性） | ❌ 无自动化 | 已发现 li-auto EREV 误标 phev、brand powertrain 不一致，无脚本拦截 |
| SEO（重复 title/缺 description/canonical/orphan/坏链） | ❌ 无自动化 | 无脚本；发现 1 条陈旧跨站链接 |
| Source（缺 source/陈旧 source/非法 URL） | ❌ 无自动化 | 发现 source_url 全 null、source_type 缺失，无脚本拦截 |

**结论**：§15 五类检查 **0/5 自动化**。**STEP 9 需新增 `scripts/qa_data.py`（或 `.mjs`）**，覆盖 duplicate/missing/invalid/SEO/source 五类，作为本阶段硬性交付项。

---

## 8. 审计结论摘要（紧凑）

- **结构实况**：Brand→Model→Generation→Trim 嵌套；Brand/Model 独立 JSON，Generation/Trim 内嵌；Powertrain/Specification 嵌入、Market 无数据（硬编码 TS）、Source 半独立（内联四元组）。
- **字段数**：Brand 11 · Model 11 · Generation 4 · Trim 8（+specs 15 个实测 key）。
- **§2 清单异常**：18 项技术/SEO 检查中 ✅12 / ⚠️6（最重 = source_url 全 null + 无 source_type）。
- **字段差距**：Brand 缺 2、Model 缺 5(+3 未结构化)、Generation 缺 5、Trim 缺 2(+1 未落位)、Provenance 缺 source_type、**Export Intelligence 九字段全缺**。
- **问题清单**：**P0=0 · P1=5 · P2=7**。
- **迁移路径要点**：URL 不变、原地扩展 JSON、新增 source_type + export 九字段 + generation/trim 补 source 与 last_verified；编辑内容（market-position/model-notes）数据化延后。
- **车型缺口**：品牌缺 **10/20**、车型缺 **30+**；首批优先 BYD/Geely/Chery/Changan/GWM 高出口车型。
- **QA 机制**：**本仓 0 脚本**，§15 五类覆盖 0/5，STEP 9 需新建 `qa_data.py`。
- **审计文档路径**：`docs/data-infra-audit.md`（本文件）。

---

*本报告为只读审计，未修改任何数据/代码文件。*
