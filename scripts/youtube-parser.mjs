// YouTube currently uses both videoRenderer and lockupViewModel.
export const CHANNEL_ID = 'UCWvCkpm4wJePA34rho_c0_A';
export const CHANNEL_URL = 'https://www.youtube.com/@愛城信義會善牧堂/videos';
const text = value => typeof value === 'string' ? value : value?.simpleText || value?.content || value?.runs?.map(run=>run.text).join('') || '';
export function extractInitialData(html) {
  const match=/(?:var\s+ytInitialData\s*=|window\["ytInitialData"\]\s*=)\s*/.exec(html);
  if(!match)throw new Error('YouTube initial data not found (possible consent or rate-limit page).');
  const start=html.indexOf('{',match.index+match[0].length);
  let depth=0, quoted=false, escaped=false;
  for(let i=start;i<html.length;i++){
    const c=html[i];
    if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue;}
    if(c==='"')quoted=true;
    else if(c==='{')depth++;
    else if(c==='}'&&--depth===0)return JSON.parse(html.slice(start,i+1));
  }
  throw new Error('Incomplete YouTube data.');
}
export function parseTitle(raw) {
  const normalized=raw.normalize('NFKC').replace(/\s+/g,' ').trim();
  const match=normalized.match(/\b(20\d{2})\s*(?:年|[./-])\s*(\d{1,2})\s*(?:月|[./-])\s*(\d{1,2})\s*日?/);
  if(!match)return null;
  const date=`${match[1]}-${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}`;
  const parsed=new Date(`${date}T00:00:00Z`);
  if(!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date)return null;
  // Only dated Sunday worship / sermon entries; do not import testimonies or music as sermons.
  let remainder=normalized.slice(match.index+match[0].length).trim();
  if(!/^(?:中英(?:文)?|國語|国语|聖餐|圣餐|聯合|联合|\s)*(?:主日(?:崇拜|禮拜|礼拜|證道|证道)|證道|证道)/.test(remainder))return null;
  remainder=remainder.replace(/^(?:中英(?:文)?|國語|国语|聖餐|圣餐|聯合|联合|\s)*(?:主日(?:崇拜|禮拜|礼拜|證道|证道)|證道|证道)\s*/,'');
  if(/見證|见证|宣教分享|詩歌|诗歌|獻詩|献诗|受洗|洗禮|洗礼|兒童|儿童|公告/.test(remainder))return null;
  const title=remainder.replace(/^(?:證道主題|证道主题|證道|证道|主題|主题)\s*[:：]?\s*/,'').replace(/^[\s:：|｜—\-【「“]+|[\s】」”]+$/g,'').trim();
  if(title.length<2||title.length>140)return null;
  return {date,title};
}
export function parseChannelPage(html) {
  const root=extractInitialData(html), candidates=[];let verified=false;
  function walk(value){
    if(!value||typeof value!=='object')return;
    if(value.channelMetadataRenderer?.externalId===CHANNEL_ID)verified=true;
    if(value.videoRenderer){const v=value.videoRenderer;candidates.push({id:v.videoId,title:text(v.title)});}
    if(value.lockupViewModel?.contentType==='LOCKUP_CONTENT_TYPE_VIDEO'){const v=value.lockupViewModel;candidates.push({id:v.contentId,title:text(v.metadata?.lockupMetadataViewModel?.title)});}
    for(const child of Object.values(value))if(typeof child==='object')walk(child);
  }
  walk(root);
  if(!verified)throw new Error('Channel identity did not match the configured church channel.');
  return normalizeCandidates(candidates);
}
const decodeXML=s=>s.replace(/&(?:amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);/gi,entity=>{const named={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"};if(named[entity])return named[entity];const hex=entity.startsWith('&#x');return String.fromCodePoint(parseInt(entity.slice(hex?3:2,-1),hex?16:10));});
export function parseFeed(xml){
  if(!xml.includes(`<yt:channelId>${CHANNEL_ID}</yt:channelId>`))throw new Error('RSS channel identity mismatch.');
  const candidates=[...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([,entry])=>({id:entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1],title:decodeXML(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]||'')}));
  return normalizeCandidates(candidates);
}
function normalizeCandidates(candidates){
  const unique=new Map();
  for(const item of candidates){if(!/^[\w-]{11}$/.test(item.id||''))continue;const parsed=parseTitle(item.title);if(parsed)unique.set(item.id,{id:item.id,...parsed,sourceTitle:item.title});}
  return [...unique.values()].sort((a,b)=>b.date.localeCompare(a.date));
}
export function mergeSermons(existing,incoming){
  if(!incoming.length)throw new Error('No qualifying sermons found. Existing data has been preserved.');
  const merged=new Map(existing.map(s=>[s.id,s]));
  for(const item of incoming){
    const old=merged.get(item.id);
    const unchanged=old&&(!old.sourceTitle||old.sourceTitle===item.sourceTitle);
    merged.set(item.id,{id:item.id,date:item.date,title:unchanged?old.title:{'zh-Hans':item.title,'zh-Hant':item.title,en:item.title},scripture:old?.scripture||'',sourceTitle:item.sourceTitle,url:`https://www.youtube.com/watch?v=${item.id}`,thumbnail:`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`});
  }
  return [...merged.values()].sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id)).slice(0,60);
}
