import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validStory,createStory,templates} from '../src/model.js';
test('approved four-story series is complete, editable and additive',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../stories/red-tent/manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.length,4);assert.equal(templates.length,9);
 for(const [i,entry] of manifest.entries()){
  const story=JSON.parse(await readFile(new URL('../stories/red-tent/'+entry.design,import.meta.url),'utf8'));
  assert.ok(validStory(story));assert.equal(story.scene,'red-tent-personal-'+(i+1));assert.ok(story.elements.some(e=>e.type==='photo'&&e.src.startsWith('data:image/jpeg;base64,')));assert.ok(story.elements.filter(e=>e.type==='text').length>=6);
  const text=story.elements.filter(e=>e.type==='text').map(e=>e.text).join(' ');assert.ok(!/[-–—־]/.test(text));
  if(i===0){assert.ok(text.includes('ביוהנסבורג'));assert.ok(text.includes('שתיקח ממני את התינוק'));assert.equal(story.interaction.options.length,4);}
  if(i===1){assert.ok(text.includes('רומן, לא תיעוד היסטורי'));assert.equal(story.motion,0);}
  if(i===2){assert.ok(text.includes('זה לא מוכיח שהיה אוהל אדום'));assert.equal(story.motion,0);}
  if(i===3){assert.ok(text.includes('מתי לאחרונה הרגשת'));assert.equal(story.interaction.nativeStickerRequired,true);}
 }
});
test('animation timing inputs reject invalid imported values without changing legacy designs',()=>{
 for(const field of ['delay','fadeDuration']){const story=createStory();story.elements[0][field]=Infinity;assert.equal(validStory(story),false);}
 assert.ok(validStory(createStory()));
});
