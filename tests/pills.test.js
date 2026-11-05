import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validStory,migrateStory,templates} from '../src/model.js';
const read=f=>JSON.parse(readFileSync(new URL('../stories/pills/'+f,import.meta.url),'utf8'));
const manifest=read('manifest.json'),designs=manifest.map(s=>read(s.design));
test('four complete pill stories preserve editable layers, source and native sticker spaces',()=>{
 assert.equal(manifest.length,4);assert.equal(templates.length,9);
 for(const [i,s] of designs.entries()){
  assert.ok(validStory(s),'valid design '+(i+1));assert.deepEqual(migrateStory(s),s);
  assert.ok(s.elements.some(e=>e.type==='illustration'));
  const text=s.elements.filter(e=>e.type==='text').map(e=>e.text).join('\n');
  assert.ok(text.length>180);assert.doesNotMatch(text,/https?:\/\/|[־–—-]/);
  if(i!==2){assert.equal(s.lockInteractiveText,true);assert.ok(manifest[i].interaction.nativeStickerRequired);}
 }
 const t=designs[1].elements.map(e=>e.text||'').join(' ');
 assert.match(t,/422/);assert.match(t,/49/);assert.match(t,/לא הוכחה לסיבתיות/);assert.match(t,/Klump/);
 assert.doesNotMatch(t,/%|β/);
});
test('illustration and sound imports reject invalid motifs, volume, timing and duration',()=>{
 for(const mutate of [s=>s.elements.find(e=>e.type==='illustration').motif='unknown',s=>s.sound.volume=1,s=>s.sound.times=[-1],s=>s.sound.times=[23],s=>s.duration=31]){
  const s=structuredClone(designs[1]);mutate(s);assert.equal(validStory(s),false);
 }
});
test('old cream rolling pills gain contrast without changing words, position or customized colors',()=>{
 for(const design of designs.slice(0,2)){
  const old=structuredClone(design);delete old.pillContrastVersion;
  const pill=old.elements.find(e=>e.motif==='pill'&&e.animation==='roll');pill.accentColor='#FFE6BD';
  const expected=structuredClone(old);expected.pillContrastVersion=1;expected.elements.find(e=>e.id===pill.id).accentColor='#3F3D32';
  assert.deepEqual(migrateStory(old),expected);assert.equal(pill.accentColor,'#FFE6BD');
  pill.accentColor='#9BAF87';assert.equal(migrateStory(old).elements.find(e=>e.id===pill.id).accentColor,'#9BAF87');
 }
});
