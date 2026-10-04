// 生态全局配置 — 真实域名：chinausedautohub.com
export const BASE_DOMAIN = process.env.BASE_DOMAIN || 'chinausedautohub.com';
export const MAIN_SITE_URL = process.env.MAIN_SITE_URL || `https://${BASE_DOMAIN}`;
export const DATA_SITE_URL = process.env.DATA_SITE_URL || `https://data.${BASE_DOMAIN}`;
export const COMPANIES_SITE_URL = process.env.COMPANIES_SITE_URL || `https://company.${BASE_DOMAIN}`;
export const TOOLS_SITE_URL = process.env.TOOLS_SITE_URL || `https://tool.${BASE_DOMAIN}`;
export const MARKET_SITE_URL = process.env.MARKET_SITE_URL || `https://market.${BASE_DOMAIN}`;
