import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {removeChartHighlights} from '../src/restore-chart-captions.js';
const original=JSON.parse(await readFile(new URL('../stories/sperm-survival/designs/03.json',import.meta.url),'utf8'));
test('removes only old day highlight layers, preserving chart, captions and other edits',()=>{
 const draft=structuredClone(original);draft.elements.push({id:5,type:'rect',label:'הדגשת יום'},{id:6,type:'rect',label:'הדגשת יום'},{id:99,type:'rect',label:'משטח אישי'});
 const before=structuredClone(draft),result=removeChartHighlights(draft);
 assert.deepEqual(result.elements,draft.elements.filter(e=>![5,6].includes(e.id)));assert.deepEqual(draft,before);assert.ok(result.elements.some(e=>e.id===99));
 draft.scene='other-series';assert.deepEqual(removeChartHighlights(draft),draft);
});
