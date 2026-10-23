import assert from 'node:assert/strict';
import { translations, church } from '../content.js';
import { sermons } from '../sermon-data.js';
import { verses, chooseVerse } from '../verses.js';
for(let previous=0;previous<verses.length;previous++)for(const r of [0,.2,.5,.999]){const next=chooseVerse(previous,()=>r);assert.notEqual(next,previous);assert.ok(verses[next]);}
for(const verse of verses){assert.equal(verse.ref.length,3);assert.equal(verse.text.length,3);}
for(const sermon of sermons){assert.match(sermon.date,/^\d{4}-\d{2}-\d{2}$/);assert.match(sermon.id,/^[\w-]{11}$/);assert.ok(sermon.title.en);}
const keys = Object.keys(translations.en).sort();
for(const [language, values] of Object.entries(translations)) {
  assert.deepEqual(Object.keys(values).sort(),keys,`${language} translation keys`);
  for(const [key,value] of Object.entries(values)) assert.ok(typeof value==='string'?value.length:Array.isArray(value)&&value.every(v=>typeof v==='string'&&v.length),`${language}.${key}`);
  assert.equal(values.nav.length,5);
  assert.equal(values.faqs.length,values.answers.length);
  assert.equal(values.groups.length,values.groupSchedules.length);
  assert.equal(values.groups.length,values.groupBodies.length);
}
for(const field of ['mapUrl','donationUrl','sermonChannelUrl']) if(church[field]) assert.equal(new URL(church[field]).protocol,'https:');
for(const sermon of church.sermons) {if(sermon.date)assert.match(sermon.date,/^\d{4}-\d{2}-\d{2}$/);assert.equal(new URL(sermon.url).protocol,'https:');for(const lang of Object.keys(translations))assert.ok(sermon.title[lang]);}
console.log('Three-language content structure and configured links verified.');
