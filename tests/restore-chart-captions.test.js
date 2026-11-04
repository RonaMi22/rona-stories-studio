import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {restoreChartCaptions} from '../src/restore-chart-captions.js';
import {validStory,createStory} from '../src/model.js';
const original=JSON.parse(await readFile(new URL('../stories/sperm-survival/designs/03.json',import.meta.url),'utf8'));
test('restores missing chart captions without touching chart, highlights or removed branding',()=>{
 const draft=structuredClone(original);draft.elements=draft.elements.filter(e=>![2,3,4,7,8].includes(e.id));draft.elements[0].focusX=25;
 const before=structuredClone(draft),result=restoreChartCaptions(draft,original);
 assert.ok(validStory(result));assert.deepEqual(result.elements.filter(e=>![4,7,8].includes(e.id)),draft.elements);
 assert.ok(!result.elements.some(e=>[2,3].includes(e.id)));assert.deepEqual(result.elements.slice(-3).map(e=>e.id),[4,7,8]);assert.deepEqual(draft,before);
});
test('recovers hidden, off-canvas or covered captions and retains personalized words',()=>{
 const draft=structuredClone(original),caption=draft.elements.find(e=>e.id===4);caption.text='כותרת אישית';caption.opacity=0;caption.y=5000;caption.animation='fade';caption.delay=15;draft.elements.reverse();
 const result=restoreChartCaptions(draft,original),restored=result.elements.find(e=>e.id===4);
 assert.equal(restored.text,'כותרת אישית');assert.equal(restored.opacity,1);assert.equal(restored.y,270);assert.equal(restored.animation,'none');assert.deepEqual(result.elements.slice(-3).map(e=>e.id),[4,7,8]);
 draft.elements.find(e=>e.id===7).text=' ';assert.equal(restoreChartCaptions(draft,original).elements.find(e=>e.id===7).text,'מאיזה מהם לדעתך?');
});
test('does not add chart captions to any other story',()=>{const story=createStory();assert.deepEqual(restoreChartCaptions(story,original),story);});

test('explicit full-copy recovery replaces truncated old words and restores every approved answer option',()=>{const draft=structuredClone(original);draft.elements=draft.elements.filter(e=>![2,3,8].includes(e.id));draft.elements.find(e=>e.id===4).text='ההיריון התחיל מיחסים באחד הימים האלה.';const result=restoreChartCaptions(draft,original,{useOriginalText:true});assert.equal(result.elements.find(e=>e.id===4).text,'ההיריון התחיל מיחסים ביום 11\nאו ביום 15 למחזור.');assert.equal(result.elements.find(e=>e.id===8).text,'יום 11   ·   יום 15\nאי אפשר לדעת מהטבלה');assert.ok(!result.elements.some(e=>[2,3].includes(e.id)));assert.deepEqual(result.elements.find(e=>e.type==='photo'),draft.elements.find(e=>e.type==='photo'));});

test('older saved drafts recover the heading automatically once while retaining later edits',async()=>{
 const {upgradeChartCaptionDraft}=await import('../src/restore-chart-captions.js');
 const old=structuredClone(original);delete old.chartCopyVersion;old.elements=old.elements.filter(e=>![2,3,4].includes(e.id));old.elements.find(e=>e.id===1).focusX=22;
 const fixed=upgradeChartCaptionDraft(old,original);assert.equal(fixed.chartCopyVersion,2);assert.equal(fixed.elements.find(e=>e.id===4).text,original.elements.find(e=>e.id===4).text);assert.deepEqual(fixed.elements.find(e=>e.id===1),old.elements.find(e=>e.id===1));assert.ok(!fixed.elements.some(e=>[2,3].includes(e.id)));
 fixed.elements.find(e=>e.id===4).text='עריכה אישית חדשה';assert.deepEqual(upgradeChartCaptionDraft(fixed,original),fixed);
 const partial=structuredClone(old);partial.elements.push({...original.elements.find(e=>e.id===4),text:'ההיריון התחיל מיחסים\nבאחד הימים האלה.'});assert.equal(upgradeChartCaptionDraft(partial,original).elements.find(e=>e.id===4).text,original.elements.find(e=>e.id===4).text);
});
