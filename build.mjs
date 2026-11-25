import { mkdir, writeFile, cp } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import config from './config.mjs';
import { pages, escape } from './pages.mjs';

export function resolveConfig(input, production) {
  const c = { ...input };
  if (!/^\d{10}$/.test(c.phone) || !/^\d{1,3}$/.test(c.countryCode)) throw new Error('Configure a 10-digit phone and numeric country code.');
  c.location = [c.city,c.region,c.country].join(', ');
  c.tel = 'tel:+' + c.countryCode + c.phone;
  c.whatsapp = 'https://wa.me/' + c.countryCode + c.phone;
  c.base = '';
  c.demoMode = !production || c.demoMode;
  if (production) {
    if (c.demoMode || c.phone === '1234567890' || c.allowIndexing !== true) throw new Error('Production requires an active phone, demoMode=false and allowIndexing=true.');
    const url = new URL(c.siteUrl);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || !url.hostname.includes('.') || /(?:^|\.)(?:localhost|test|invalid|example|local)$|^example\.(com|net|org)$|^\d+\./i.test(url.hostname)) throw new Error('Set siteUrl to your public HTTPS domain origin.');
    c.base = url.origin;
  }
  c.tracking = Boolean(production && c.analytics.enabled && c.analytics.containerId);
  if (c.tracking && (c.analytics.strategy !== 'gtm' || !/^GTM-[A-Z0-9]+$/.test(c.analytics.containerId))) throw new Error('Set a genuine GTM container ID before enabling analytics.');
  return c;
}
const json = value => JSON.stringify(value).replace(/</g,'\\u003c');
export async function build(production = false, input = config, output = new URL('./dist/', import.meta.url)) {
  const c = resolveConfig(input, production);
  await mkdir(output,{recursive:true});
  await cp(new URL('./assets/',import.meta.url),new URL('assets/',output),{recursive:true});
  const urls = [];
  for (const [file,title,description,body] of pages(c)) {
    const url = c.base ? c.base + '/' + (file === 'index.html' ? '' : file) : '';
    const imageUrl = c.base ? c.base + '/assets/images/hero-palace.webp' : '';
    if (url) urls.push(url);
    const org = {'@type':'Organization',name:c.brand,areaServed:{'@type':'City',name:c.city}};
    const website = {'@type':'WebSite',name:c.brand};
    if (c.base) {
      org.url = website.url = c.base + '/';
      org.telephone = c.tel.slice(4);
    }
    const graph = [org,website,...c.services.map(([,name,description])=>({'@type':'Service',name,description,provider:org,areaServed:org.areaServed}))];
    const runtime = {brand:c.brand,phone:c.phone,whatsapp:c.whatsapp,demoMode:c.demoMode,trips:c.trips,vehicles:Object.fromEntries(c.vehicles),analytics:c.tracking?c.analytics:null};
    await writeFile(new URL(file,output),`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
<meta name="robots" content="${production?'index,follow':'noindex,nofollow'}">
<meta name="referrer" content="no-referrer"><meta name="theme-color" content="#f1f5f6">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:type" content="website">${imageUrl?`<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${escape(imageUrl)}">`:'<meta name="twitter:card" content="summary">'}
${url?`<link rel="canonical" href="${escape(url)}"><meta property="og:url" content="${escape(url)}"><meta property="og:image" content="${escape(imageUrl)}"><meta property="og:image:alt" content="Mysore Palace and Mysore Cabs taxi">`:''}
<link rel="icon" href="./assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./assets/style.css?v=8">
${file==='index.html'?`<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>`:''}
<script type="application/json" id="site-config">${json(runtime)}</script><script type="module" src="./assets/site.js?v=3"></script>
<noscript><style>@media(max-width:1000px){.header-inner{flex-wrap:wrap}.header nav{display:flex;position:static;order:3;flex:0 0 100%;max-height:none;flex-direction:column;align-items:stretch;box-shadow:none}.menu{display:none}}</style></noscript></head><body>${body}</body></html>`);
  }
  await writeFile(new URL('robots.txt',output),'User-agent: *\nDisallow:\n'+(c.base?'\nSitemap: '+c.base+'/sitemap.xml\n':''));
  await writeFile(new URL('sitemap.xml',output),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+escape(url)+'</loc></url>').join('')+'</urlset>\n');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await build(process.argv.includes('--production'));
}
