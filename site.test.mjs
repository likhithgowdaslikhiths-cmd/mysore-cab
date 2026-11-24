import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile} from 'node:fs/promises';
import config from './config.mjs';
import {resolveConfig,build} from './build.mjs';
import {pages} from './pages.mjs';
import {indiaNow,timingErrors,prepareMessage,whatsappUrl} from './assets/trip.js';
import {createAnalytics} from './assets/analytics.js';

test('preview forces safe contact and production rejects placeholder details',()=>{
  const preview = resolveConfig({...config,demoMode:false,analytics:{enabled:true}},false);
  assert.equal(preview.demoMode,true);
  assert.equal(preview.tracking,false);
  assert.equal(preview.tel,'tel:+911234567890');
  assert.equal(preview.whatsapp,'https://wa.me/911234567890');
  assert.doesNotMatch(pages(preview).map(p=>p[3]).join(''),/href="(?:tel:|https:\/\/wa\.me)/);
  assert.throws(()=>resolveConfig(config,true),/Production requires/);
  assert.throws(()=>resolveConfig({...config,phone:'0000000000',demoMode:false,allowIndexing:true,siteUrl:'https://example.com'},true),/public HTTPS/);
});

test('date checks use the calendar date in India',()=>{
  const now=indiaNow(new Date('2030-02-02T19:00:00Z'));
  assert.deepEqual(now,{date:'2030-02-03',time:'00:30'});
  assert.ok(timingErrors({departure:'2030-02-02'},now).departure);
  assert.deepEqual(timingErrors({departure:now.date,time:'01:10',trip:'one',returnDate:'2030-01-02'},now),{});
});

test('message omits optional blanks and survives URL encoding',()=>{
  const text=prepareMessage({brand:config.brand,trips:config.trips,vehicles:Object.fromEntries(config.vehicles)},
    {trip:'one',pickup:'A & B',destination:'C + D # Mysuru',departure:'2030-02-03',time:'01:10',notes:'<bags> 🚕'});
  const url=new URL(whatsappUrl('https://wa.me/911234567890',text));
  assert.equal(url.searchParams.get('text'),text);
  assert.doesNotMatch(text,/Passengers:|Return:|Special requirements:|Not provided|01:10|<bags>/);
});

test('analytics gates events, loads one container and excludes trip text',()=>{
  const appended=[];
  const view={document:{createElement:()=>({}),head:{append:tag=>appended.push(tag)}}};
  const adapter=createAnalytics({...config.analytics,containerId:'GTM-QATEST'},view);
  adapter.track('call_click',{cta_location:'hero'});
  assert.equal(view.dataLayer,undefined);
  adapter.allow();
  adapter.allow();
  adapter.track('quote_whatsapp_handoff',{trip_type:'one',vehicle_category:'sedan',pickup:'Exact address',message:'Personal details'});
  adapter.track('generate_lead',{});
  assert.equal(appended.length,1);
  assert.deepEqual(view.dataLayer.slice(1),[{event:'quote_whatsapp_handoff',trip_type:'one',vehicle_category:'sedan'}]);
});

test('generated production metadata uses the supplied origin and active contact',async()=>{
  const folder = await mkdtemp(new URL('./.preview-production-',import.meta.url));
  const {pathToFileURL} = await import('node:url');
  const output = new URL(pathToFileURL(folder).href + '/');
  const origin = 'https://mysore-cabs-fixture.example.net';
  await build(true,{...config,phone:'0000000000',demoMode:false,allowIndexing:true,siteUrl:origin},output);
  const read = file => readFile(new URL(file,output),'utf8');
  const [home,privacy,terms,sitemap,robots] = await Promise.all(['index.html','privacy.html','terms.html','sitemap.xml','robots.txt'].map(read));
  for (const [page,path] of [[home,'/'],[privacy,'/privacy.html'],[terms,'/terms.html']]) {
    assert.ok(page.includes('rel="canonical" href="'+origin+path+'"'));
    assert.ok(page.includes('property="og:url" content="'+origin+path+'"'));
    assert.ok(page.includes('content="index,follow"'));
    assert.ok(sitemap.includes('<loc>'+origin+path+'</loc>'));
    assert.doesNotMatch(page,/1234567890/);
  }
  assert.match(home,/"telephone":"\+910000000000"/);
  assert.match(home,/href="tel:\+910000000000"/);
  assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
  assert.doesNotMatch(robots,/AdsBot|Disallow: \//);
});
