import { church, translations } from './content.js';
import { verses, chooseVerse } from './verses.js';
let verseIndex;
try { const stored = localStorage.getItem('good-shepherd-verse'); verseIndex = stored === null ? -1 : Number(stored); } catch { verseIndex = -1; }
function rotateVerse(){verseIndex=chooseVerse(verseIndex);try{localStorage.setItem('good-shepherd-verse',String(verseIndex));}catch{}}
rotateVerse();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let activeRoute = '';
let renderVersion = 0;

const routes = ['home', 'about', 'fellowship', 'sermons', 'giving'];
export function detectLanguage(languages = []) {
  for (const language of languages) {
    if (/^zh/i.test(language)) return /Hant|TW|HK|MO/i.test(language) ? 'zh-Hant' : 'zh-Hans';
    if (/^en/i.test(language)) return 'en';
  }
  return 'en';
}
let saved;
try { saved = localStorage.getItem('good-shepherd-language'); } catch {}
let lang = translations[saved] ? saved : detectLanguage(navigator.languages || [navigator.language]);
let t = translations[lang];
const main = document.querySelector('main');
const arrow = '<span aria-hidden="true">↗</span>';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = value => { try { const u = new URL(value); return u.protocol === 'https:' ? escape(u.href) : ''; } catch { return ''; } };
const photo = (id, width = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const images = {
  hero: photo('photo-1511632765486-a01980e01a18', 1800),
  gathering: photo('photo-1529156069898-49953e39b3ac', 1000),
  family: photo('photo-1511895426328-dc8714191300', 800),
  youth: photo('photo-1523240795612-9a054b0db644', 800),
  bible: photo('photo-1504052434569-70ad5836ab65', 800),
};
const link = (label, href, style = 'text-link') => `<a class="${style}" href="${href}">${label}${arrow}</a>`;
const external = (label, url, style = 'button primary') => safeUrl(url) ? `<a class="${style}" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${label}${arrow}</a>` : '';
const kicker = text => `<p class="eyebrow">${text}</p>`;
function groups(limit = 6) {
  return `<div class="group-grid">${t.groups.slice(0,limit).map((name,i) => `<article class="group-card reveal"><div class="image-wrap"><img src="${[images.family,images.youth,images.bible,images.bible,images.gathering,images.family][i]}" alt="" loading="lazy" width="800" height="600"><span class="image-number">0${i+1}</span></div><h3>${name}</h3><p class="group-schedule">${t.groupSchedules[i]}</p><p>${t.groupBodies[i]}</p></article>`).join('')}</div>`;
}
function visit() {
  return `<section class="visit-strip"><div><span class="line-icon" aria-hidden="true">☼</span><div><h3>${t.sunday}</h3><p>${escape(church.serviceTime[lang] || t.timePending)}</p></div></div><div><span class="line-icon" aria-hidden="true">⌖</span><div><h3>${t.location}</h3><p>${escape(church.address || t.addressPending)}</p>${external(t.directions,church.mapUrl,'text-link')}</div></div><div><span class="line-icon" aria-hidden="true">♡</span><div><h3>${t.first}</h3><p>${t.firstText}</p>${link(t.visitAction,'#about/visit')}</div></div></section>`;
}
function home() {
  return `<section class="hero"><img class="hero-image" src="${images.hero}" alt="" fetchpriority="high" width="1800" height="1200"><div class="hero-shade"></div><div class="hero-content">${kicker(t.heroLabel)}<h1 class="church-title"><span class="church-denomination">${t.heroName}</span><span class="church-name">${t.heroChurch}</span></h1><p class="hero-intro">${t.heroDescription}</p><div class="hero-actions">${link(t.worship,'#about/visit','button cream')}${link(t.visit,'#about','button outline')}</div></div><div class="hero-bottom"><span>${t.heroTagline}</span><a href="#home/story">${t.scroll}<span aria-hidden="true">↓</span></a></div><span class="hero-side" aria-hidden="true">FAITH · HOPE · LOVE</span></section>
  ${visit()}<section class="story section" id="story"><div class="story-photo reveal"><img src="${images.gathering}" alt="" loading="lazy" width="1000" height="1100"><span class="photo-stamp" aria-hidden="true">together<br><i>in His love.</i></span><p>${t.photoCaption}</p></div><div class="story-copy reveal">${kicker(t.homeKicker)}<h2>${t.homeTitle}</h2><p>${t.homeShort}</p><p>${t.homeShort2}</p>${link(t.more,'#about')}</div></section>
  <section class="community section"><div class="section-heading reveal"><div>${kicker(t.community)}<h2>${t.communityTitle}</h2></div>${link(t.explore,'#fellowship')}</div>${groups(3)}<p class="editorial-note">${t.groupNote}</p></section>${verse()}${neighbourhood()}`;
}
function verse() {const column=['zh-Hans','zh-Hant','en'].indexOf(lang);return `<section class="verse reveal"><span class="verse-cross" aria-hidden="true">✝</span><blockquote>“${verses[verseIndex].text[column]}”</blockquote><p>${verses[verseIndex].ref[column]}</p><div class="verse-line"></div></section>`;}
function pageHero(prefix, image) {
  return `<section class="page-hero"><div>${kicker(t[prefix+'Kicker'])}<h1>${t[prefix+'Title']}</h1><p>${t[prefix+'Intro']}</p></div><img src="${image}" alt="" width="900" height="800" fetchpriority="high"></section>`;
}
function about() {return `${pageHero('about',images.gathering)}${history()}${minister()}<section class="section belief reveal">${kicker('FAITH · HOPE · LOVE')}<h2>${t.belief}</h2><p>${t.beliefBody}</p><div class="values">${t.values.map((v,i)=>`<article><span>0${i+1}</span><h3>${v}</h3><p>${t.valuesBody[i]}</p></article>`).join('')}</div></section>${visit()}<section class="section newcomer" id="visit"><div>${kicker(t.newcomer)}<h2>${t.newcomerTitle}</h2></div><div class="faq">${t.faqs.map((q,i)=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${t.answers[i]}</p></details>`).join('')}</div></section>${neighbourhood()}`;}
function fellowship() { return `${pageHero('group',images.youth)}<section class="section"><div class="section-heading"><div>${kicker(t.community)}<h2>${t.communityTitle}</h2><p>${t.communityIntro}</p></div></div>${groups()}<p class="editorial-note">${t.groupNote}</p></section>${verse()}`; }
function sermonList(query = '') {
  const items = [...church.sermons].sort((a,b)=>b.date.localeCompare(a.date)).filter(s=>`${s.title[lang] || s.title['zh-Hant'] || s.title.en} ${s.scripture}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return items.length ? items.map(s=>`<article class="sermon-row">${s.thumbnail ? `<a class="sermon-thumbnail" href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(s.title[lang] || s.title['zh-Hant'] || s.title.en)}"><img src="${safeUrl(s.thumbnail)}" alt="" loading="lazy" width="480" height="360"><span aria-hidden="true">▶</span></a>` : ''}<div>${s.date ? `<time datetime="${escape(s.date)}">${escape(s.date)}</time>` : `<span class="sermon-archive">${t.archiveLabel}</span>`}<h3>${escape(s.title[lang] || s.title.en)}</h3>${s.scripture?`<p>${escape(s.scripture)}</p>`:''}</div>${external(t.listen,s.url,'text-link')}</article>`).join('') : `<p>${t.noResults}</p>`;
}
function sermons() { return `${pageHero('sermon',images.bible)}<section class="section sermon-section"><p class="sermon-sync-note">${t.sermonNotice}</p>${church.sermons.length ? `<label class="search-label" for="sermon-search">${t.search}</label><input id="sermon-search" type="search" placeholder="${t.search}"><div id="sermon-results" aria-live="polite">${sermonList()}</div>` : `<div class="empty-state"><span aria-hidden="true">♧</span><h2>${t.emptyTitle}</h2><p>${t.emptyBody}</p></div>`}${external(t.channel,church.sermonChannelUrl)}</section>${verse()}`; }
function giving() {return `${pageHero('give',images.family)}<section class="section giving-layout"><div class="giving-panel reveal"><span class="giving-symbol" aria-hidden="true">♡</span><h2>${t.giveHeading}</h2><p>${t.giveBody}</p>${safeUrl(church.donationUrl) ? external(t.giveButton,church.donationUrl) : `<div class="pending"><p>${t.givePending}</p><strong class="donation-email">${escape(church.donationEmail)}</strong></div>`}<small>${t.giveNote}</small></div><div class="giving-aside reveal">${kicker('GRACE · GRATITUDE · GENEROSITY')}<h2>${t.giveQuestions}</h2><p>${t.giveAnswers}</p>${contactLink()}</div></section>${verse()}`; }
function contactLink() { return church.email ? `<a class="button primary" href="mailto:${escape(church.email)}">${t.contact}${arrow}</a>` : `<span class="contact-pending">${t.contactPending}</span>`; }
function neighbourhood(){return `<section class="neighbourhood section" id="location"><div class="map-art reveal"><img src="./assets/neighbourhood.svg" width="800" height="620" alt="${t.mapNote}"><span class="map-label">✝ ${t.mapPin}</span><span class="map-coordinate">53° N / EDMONTON</span></div><div class="map-copy reveal">${kicker(t.mapKicker)}<h2>${t.mapTitle}</h2><p>${t.mapBody}</p><address>${escape(church.address)}</address>${external(t.mapAction,church.mapUrl,'button primary')}<small>${t.mapNote}</small></div></section>`;}
function minister(){return `<section class="minister section" id="minister"><div class="minister-profile reveal"><div class="minister-portrait"><img src="./assets/sander-huang.png" alt="${t.ministerName} / Sander Huang" width="1024" height="1024" loading="lazy"></div><p class="eyebrow">${t.ministerKicker}</p><h2>${t.ministerName}</h2><p>${t.ministerRole}</p><blockquote>${t.ministerVerse}<cite>${t.ministerRef}</cite></blockquote></div><div class="minister-biography reveal">${kicker('CALLED TO SERVE')}<h2>${t.ministerTitle}</h2><p>${t.ministerBio[0]}</p><p>${t.ministerBio[1]}</p><blockquote>${t.callingVerse}<cite>${t.callingRef}</cite></blockquote><p>${t.ministerBio[2]}</p></div></section>`;}
function history(){return `<section class="history-block section"><div class="history-year reveal" aria-hidden="true">19<br><span>85</span><i>✝</i></div><div class="history-copy reveal">${kicker(t.historyLabel)}<h2>${t.historyTitle}</h2><p>${t.homeBody}</p><p>${t.homeBody2}</p></div></section>`;}
function footer(){return `<div class="footer-invitation"><div>${kicker(t.footerEyebrow)}<h2>${t.footerInvitation}</h2><p>${t.footerSmall}</p></div>${link(t.visitAction,'#about/visit','button footer-cta')}</div><div class="footer-grid"><div class="footer-identity"><a href="#home"><img class="footer-logo" src="./assets/logo.svg" alt="${t.name}" width="3680" height="674"></a><p>${t.footerLine}</p><span class="footer-symbol" aria-hidden="true">✳</span></div><nav aria-label="Footer"><h3>${t.footerExplore}</h3>${routes.map((r,i)=>`<a href="#${r}"><span class="footer-index">0${i+1}</span><span>${t.nav[i]}</span>${arrow}</a>`).join('')}</nav><div class="footer-details"><h3>${t.footerVisit}</h3><p class="footer-service">${escape(church.serviceTime[lang])}</p><address>${escape(church.address)}</address>${external(t.directions,church.mapUrl,'footer-action')}<h3>${t.footerContact}</h3><a class="footer-action" href="mailto:${escape(church.email)}">${t.footerEmail}${arrow}</a><p class="footer-email">${escape(church.email)}</p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} ${t.name}. ${t.rights}</span><span>${t.photoNote}</span></div><p class="footer-notice">${t.updated}</p>`;}
const observer = new IntersectionObserver(entries=>entries.forEach(entry=> {if(entry.isIntersecting){entry.target.classList.add('visible'); observer.unobserve(entry.target);}}), {threshold:0.08});
async function render(moveFocus = false) {
  const version = ++renderVersion;
  const [requested, anchor] = location.hash.slice(1).split('/');
  const route = routes.includes(requested) ? requested : 'home';
  if(moveFocus && route===activeRoute && anchor){document.getElementById(anchor)?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});return;}
  if(main.children.length && !reducedMotion.matches){await main.animate([{opacity:1},{opacity:0}],{duration:140,easing:'ease-out'}).finished.catch(()=>{});}
  if(version!==renderVersion)return;
  observer.disconnect();
  if(moveFocus && route!==activeRoute)rotateVerse();
  activeRoute=route;
  t = translations[lang];
  document.documentElement.lang = lang;
  document.title = `${t.nav[routes.indexOf(route)]} | ${t.name}`;
  document.querySelector('meta[name="description"]').content = `${t.name} — ${t.footerLine}`;
  document.querySelector('.brand-logo').alt = t.name;
  document.querySelector('.brand').setAttribute('aria-label',t.name);
  document.querySelector('#brand-small').textContent=t.brandSmall;
  document.querySelector('#brand-main').textContent=t.brandMain;
  document.querySelectorAll('[data-language]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===lang)));
  document.querySelector('#navigation').innerHTML = routes.map((r,i)=>`<a href="#${r}" ${r===route?'aria-current="page"':''}>${t.nav[i]}</a>`).join('');
  main.innerHTML = ({home, about, fellowship, sermons, giving})[route]();
  document.querySelector('#footer').innerHTML = footer();
  closeMenu();
  main.querySelectorAll('.page-hero>div, .page-hero>img, .visit-strip>div, .values article, .faq details, .newcomer>div, .sermon-row').forEach((el,i)=>{el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${i%3*75}ms`);});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  if(!reducedMotion.matches)main.animate([{opacity:0},{opacity:1}],{duration:450,easing:'ease-out'});
  document.querySelector('#sermon-search')?.addEventListener('input',e=>document.querySelector('#sermon-results').innerHTML=sermonList(e.target.value));
  if(moveFocus) main.focus({preventScroll:true});
  requestAnimationFrame(()=> { if(anchor) document.getElementById(anchor)?.scrollIntoView({behavior:'instant'}); else window.scrollTo({top:0,behavior:'instant'}); });
}
function closeMenu(){document.querySelector('#navigation').classList.remove('open'); document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>{if(lang===button.dataset.language)return;lang=button.dataset.language;try{localStorage.setItem('good-shepherd-language',lang);}catch{}render();}));
document.querySelector('#menu-toggle').addEventListener('click',()=>{const open=document.querySelector('#navigation').classList.toggle('open');document.querySelector('#menu-toggle').setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.querySelector('.skip-link').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView();});
window.addEventListener('hashchange',()=>render(true));
render();
let scrollQueued=false;
function updateScroll(){
  scrollQueued=false;
  const distance=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  document.documentElement.style.setProperty('--scroll-progress',String(scrollY/distance));
  document.querySelector('.site-header').classList.toggle('scrolled',scrollY>30);
  const hero=main.querySelector('.hero-image');
  if(hero&&!reducedMotion.matches)hero.style.translate=`0 ${Math.min(scrollY*.09,45)}px`;
}
addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
