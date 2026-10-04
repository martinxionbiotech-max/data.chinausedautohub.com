# 共享数据模型（Single Source of Truth）

所有 JSON 位于本目录。四个子站只读消费；文件所有权如下：
- brands.json / models.json      → DATA 子站维护
- countries.json / importrules.json / taxrules.json / ports.json / routes.json → MARKET 子站维护
- companies.json                 → COMPANIES 子站维护
- fx.json                        → TOOLS 子站维护

## 通用规则
- 所有实体必须有唯一 ID（brand_id / model_id / generation_id / trim_id / company_id / country_id / rule_id / port_id / route_id / taxrule_id）
- 任何数字、规则、价格必须带 source / source_url / source_date / confidence
- confidence 取值：high | medium | low | unknown
- 无法确认的字段省略或写 null，禁止编造
- 时效数据（税率/汇率/法规）必须带 effective_date + last_checked，可选 expires_at / needs_review
