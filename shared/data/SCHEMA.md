# 数据契约（Data Contract）— 所有子站必须遵循

本文件定义 shared/data/*.json 的精确 JSON Schema。
**所有权**：DATA 站维护 brands/models；MARKET 站维护 countries/importrules/taxrules/ports/routes；COMPANIES 站维护 companies；TOOLS 站维护 fx。
**通用规则**：实体 ID 全小写连字符；禁止编造数据；无来源数字不得写入；时效数据必须带 last_checked。

## brands.json（DATA 维护）
```json
{
  "brands": [{
    "brand_id": "byd",
    "name": "BYD",
    "name_zh": "比亚迪",
    "origin_country": "CN",
    "founded": 2003,
    "powertrains": ["ev","phev"],
    "vehicle_types": ["suv","sedan","mpv","hatchback"],
    "source": "Official brand history",
    "source_url": null,
    "source_date": null,
    "confidence": "high|medium|low|unknown"
  }]
}
```

## models.json（DATA 维护）— 最重要
```json
{
  "models": [{
    "model_id": "byd-song-plus",
    "brand_id": "byd",
    "name": "Song Plus",
    "name_zh": "宋PLUS",
    "body_type": "suv",
    "status": "active|discontinued",
    "generations": [{
      "generation_id": "byd-song-plus-g1",
      "name": "First Generation",
      "production_years": [2020, 2023],
      "trims": [{
        "trim_id": "byd-song-plus-g1-dmi110",
        "name": "DM-i 110km",
        "powertrain": "ev|phev|hev|ice",
        "production_years": [2021, 2023],
        "specs": {
          "length_mm": 4705, "width_mm": 1890, "height_mm": 1680,
          "wheelbase_mm": 2765, "curb_weight_kg": null,
          "engine": "1.5L", "engine_displacement_cc": null,
          "motor_power_kw": null, "battery_capacity_kwh": 18.3,
          "range_km": 110, "fuel_consumption_l100km": null,
          "transmission": "E-CVT", "drive_type": "fwd|awd|rwd",
          "seats": 5, "cargo_l": null,
          "max_speed_kmh": null, "acceleration_0_100_s": null,
          "charging": "DC fast charging"
        },
        "spec_source": "BYD official spec sheet",
        "spec_source_url": "https://...",
        "spec_source_date": "2026-10-04",
        "confidence": "high|medium|low|unknown"
      }]
    }],
    "source": "...", "source_url": "...", "source_date": "...", "confidence": "high"
  }]
}
```
- 未知参数写 null 或省略；页面渲染为 "Not available"
- 数据冲突：不偷偷选一个，页面标注 "Data may vary by market / trim / source"
- 代际必须分开（不同 production_years 不能混在一个 generation）

## companies.json（COMPANIES 维护）
```json
{
  "companies": [{
    "company_id": "example-auto",
    "name": "Example Auto Export Co., Ltd.",
    "business_type": "automaker|exporter|dealer|supplier|inspection|logistics|shipping|other",
    "province": "Shandong", "city": "Qingdao", "established": null,
    "business_scope": "...",
    "export_markets": ["uae","kenya"],
    "main_brands": ["byd","geely"],
    "vehicle_types": ["suv","sedan"],
    "inspection_capability": null, "warehouse": null,
    "website": null, "email": null, "phone": null, "whatsapp": null,
    "verification_status": "verified|publicly_listed|source-backed|unverified",
    "verification_evidence": "...",
    "source": "...", "source_url": "...", "last_checked": "2026-10-04",
    "status": "active|inactive"
  }]
}
```
- verification_status 只能用上面 4 个词（Phase 2 四级）：verified（绿，需真实独立证据）/ publicly_listed（蓝，上市公司）/ source-backed（青，官方来源可查）/ unverified（灰，含全部 demo 与无证据记录）
- 禁止 Verified/Certified/Trusted/Best 无证据标记；demo/占位记录必须 verification_status=unverified

## countries.json（MARKET 维护，种子已存在）
字段：country_id, name, name_zh, region, drive_side(lhd|rhd), currency, status, source/source_url/source_date/confidence
- 预留 country_id "cn" 用于中国起运港（不是目的地国家页）

## importrules.json（MARKET 维护）
```json
{
  "rules": [{
    "rule_id": "ke-age-limit",
    "country_id": "kenya",
    "category": "vehicle_age|drive_side|ev_policy|registration|emission|import_eligibility|other",
    "title": "Vehicle age limit",
    "rule_text": "…",
    "effective_date": null,
    "last_checked": "2026-10-04",
    "source": "…", "source_url": "…",
    "confidence": "high|medium|low|unknown",
    "needs_review": false,
    "notes": "uncertain / changes frequently, verify before purchase"
  }]
}
```
- 法规是高风险数据：不确定必须 needs_review=true + confidence=low；页面必须显示 source/date 并建议用户确认官方海关
- `notes`（可选）：不确定或频繁变动的数据显式标注，如 "uncertain / changes frequently, verify before purchase"

## taxrules.json（MARKET 维护；种子基线 14 条已存在，全部 needs_review=true，需核实更新）
字段：taxrule_id, country_id, tax_type(import_duty|vat|excise|other), label, rate_pct, basis, effective_date, last_checked, source, source_url, confidence, needs_review, notes
- `notes`（可选）：不确定或频繁变动的税率显式标注

## ports.json（MARKET 维护）
```json
{
  "ports": [{
    "port_id": "cn-tianjin", "name": "Tianjin", "country_id": "cn",
    "type": "origin|destination", "note": null
  }]
}
```

## routes.json（MARKET 维护）
```json
{
  "routes": [{
    "route_id": "cn-tianjin-to-ke-mombasa",
    "origin_port_id": "cn-tianjin", "destination_port_id": "ke-mombasa",
    "est_days_min": 18, "est_days_max": 28,
    "shipping_method": "roro|container",
    "source": "...", "source_url": null, "last_checked": "2026-10-04",
    "confidence": "low|medium"
  }]
}
```

## fx.json（TOOLS 维护）
```json
{
  "base": "USD",
  "rates": {"KES": 129.5, "AED": 3.67},
  "source": "…", "source_url": "…", "source_date": "…",
  "confidence": "medium"
}
```
- 汇率是时效数据，必须带 source_date；工具页面显示该日期

## 跨站读取规则
- 只读其他站维护的文件，绝不写入
- TOOLS 的 Vehicle Comparison 读 models.json；Market Compatibility 读 importrules.json/taxrules.json
- MARKET 的 Country×Vehicle 页读 models.json（只读）
- 所有站通过 shared/config/config.ts 获取生态 URL，链接主站与兄弟站
