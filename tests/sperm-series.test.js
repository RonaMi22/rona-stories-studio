import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validStory,templates} from '../src/model.js';
const get=async id=>JSON.parse(await readFile(new URL(`../stories/sperm-survival/designs/${id}.json`,import.meta.url),'utf8'));
test('four approved short Stories preserve prior collections and include native Instagram interactions',async()=>{
 assert.equal(templates.length,9);
 const prior=JSON.parse(await readFile(new URL('../stories/red-tent/manifest.json',import.meta.url),'utf8'));assert.equal(prior.length,4);
 const entries=JSON.parse(await readFile(new URL('../stories/sperm-survival/manifest.json',import.meta.url),'utf8'));assert.equal(entries.length,4);
 for(const entry of entries){
  const story=await get(String(entry.id).padStart(2,'0'));assert.ok(validStory(story));assert.equal(story.scene,'sperm-survival-'+entry.id);assert.equal(story.interaction.nativeStickerRequired,true);
  const text=story.elements.filter(e=>e.type==='text').map(e=>e.text).join(' ');
  assert.ok(!/https?:|www\.|[-–—־]/.test(text));assert.ok(!text.includes('חמישה'));assert.ok(!text.includes('ריר'));assert.ok(story.elements.some(e=>e.type==='photo'&&e.src));
  const area=story.interaction.stickerArea;assert.ok(area.width>=700);assert.ok(area.height>=200);assert.ok(area.y+area.height<=1830);
 }
});
test('research copy remains observational, has no unverified numbers, and requests a manual private message',async()=>{
 const story=await get('02'),text=story.elements.filter(e=>e.type==='text').map(e=>e.text).join(' ');
 assert.ok(text.includes('במחקר תצפיתי'));assert.ok(text.includes('סוגי מיקרופלסטיק'));assert.ok(text.includes('תנועתיות מתקדמת'));assert.ok(text.includes('לא הוכחה לסיבה'));assert.ok(!/8\.3|25\.67|45\.64/.test(text));assert.equal(story.interaction.fulfillment,'manual_dm');
});
test('chart is a fixed sanitized raster without added highlight overlays',async()=>{
 const story=await get('03'),image=story.elements.find(e=>e.type==='photo'),chart=await readFile(new URL('../stories/sperm-survival/assets/chart-detail.png',import.meta.url));
 assert.equal(chart.readUInt32BE(16),463);assert.equal(chart.readUInt32BE(20),552);assert.deepEqual(Buffer.from(image.src.split(',')[1],'base64'),chart);
 assert.equal(image.animation,'none');assert.equal(story.motion,0);
 assert.equal(story.elements.filter(e=>e.type==='rect').length,0);
 assert.ok(story.interaction.options.includes('אי אפשר לדעת מהטבלה'));assert.ok(!('correctAnswer' in story.interaction));
});

test('captions and sticker areas leave room above Instagram bottom controls',async()=>{for(const id of ['01','02','03','04']){const story=await get(id);for(const e of story.elements.filter(e=>e.type==='text'&&e.id>3)){const bottom=e.y+(e.text.split('\n').length-1)*e.size*1.35/2+e.size*.55;assert.ok(bottom<=1650,`${id} layer ${e.id} too low`);}const area=story.interaction.stickerArea;assert.ok(area.y+area.height<=1750);}const research=await get('02');assert.ok(research.elements.some(e=>e.text==='אם תרצי שאשלח לך את המחקר,\nכתבי לי בפרטי.'));});
