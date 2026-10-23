import test from 'node:test';
import assert from 'node:assert/strict';
import { CHANNEL_ID, parseTitle, parseChannelPage, parseFeed, mergeSermons } from './youtube-parser.mjs';
test('extracts the dated sermon while excluding unrelated channel uploads',()=>{
 assert.deepEqual(parseTitle('愛城信義會善牧堂 2026年10月11日 中英聖餐主日崇拜 耶穌是誰'),{date:'2026-10-11',title:'耶穌是誰'});
 assert.equal(parseTitle('愛城 2026年10月11日 主日崇拜 張昕怡姊妹見證'),null);
 assert.equal(parseTitle('2026-10-11 主日崇拜 宣教分享'),null);
 assert.equal(parseTitle('2026年2月30日 主日崇拜 不存在日期'),null);
 assert.equal(parseTitle('2026年10月11日 青年活動'),null);
 assert.equal(parseTitle('主日崇拜 未知日期'),null);
 assert.equal(parseTitle('2026/10/11 主日證道【恩典中的盼望】').title,'恩典中的盼望');
});
test('supports both YouTube layouts, braces in titles and deduplication',()=>{
 const root={metadata:{channelMetadataRenderer:{externalId:CHANNEL_ID}},items:[{videoRenderer:{videoId:'abcdefghijk',title:{runs:[{text:'2026年10月11日 主日崇拜 恩典 {盼望}'}]}}},{lockupViewModel:{contentType:'LOCKUP_CONTENT_TYPE_VIDEO',contentId:'abcdefghijk',metadata:{lockupMetadataViewModel:{title:{content:'2026年10月11日 主日崇拜 恩典 {盼望}'}}}}}]};
 assert.equal(parseChannelPage(`<script>var ytInitialData = ${JSON.stringify(root)};</script>`).length,1);
 assert.throws(()=>parseChannelPage('<html>Consent required</html>'));
 assert.throws(()=>parseChannelPage('var ytInitialData = {"metadata":{}};'));
});
test('RSS fallback decodes titles and preserves existing translations',()=>{
 const feed=`<feed><yt:channelId>${CHANNEL_ID}</yt:channelId><entry><yt:videoId>abcdefghijk</yt:videoId><title>2026年10月11日 主日崇拜 信 &amp; 望</title></entry></feed>`;
 const entries=parseFeed(feed);assert.equal(entries[0].title,'信 & 望');
 const old={id:'abcdefghijk',date:'2026-10-11',title:{'zh-Hans':'信与望','zh-Hant':'信與望',en:'Faith and Hope'}};
 assert.equal(mergeSermons([old],entries)[0].title.en,'Faith and Hope');
 assert.throws(()=>mergeSermons([old],[]));assert.throws(()=>parseFeed('<feed/>'));
});
