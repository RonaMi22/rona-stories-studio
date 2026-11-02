import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStory,templates,validStory} from '../src/model.js';
test('every template produces a valid editable story',()=>{templates.forEach((_,i)=>{const s=createStory(i);assert.ok(validStory(s));assert.ok(s.elements.some(e=>e.type==='text'&&e.text.includes('\n')));assert.ok(s.elements.some(e=>e.type==='art')); });});
test('new drafts do not share layer state',()=>{const a=createStory(),b=createStory();a.elements[0].text='changed';assert.notEqual(a.elements[0].text,b.elements[0].text);});
test('rejects corrupt saved drafts and unsafe image sources',()=>{for(const s of [null,{}, {...createStory(),photo:'https://example.com/image.jpg'},{...createStory(),overlay:Infinity},{...createStory(),elements:[{...createStory().elements[0],size:-1}]}])assert.equal(validStory(s),false);});

test('collection contains nine independent complete designs and source attribution',()=>{assert.equal(templates.length,9);for(let i=0;i<9;i++){const s=createStory(i);assert.equal(s.elements.length,12);assert.equal(s.elements.filter(e=>e.type==='text').length,7);if(i>=6)assert.ok(s.elements.some(e=>e.text.includes('10.3389/fnins.2012.00010')));const b=createStory(i);s.elements[2].color='#123456';assert.notEqual(s.elements[2].color,b.elements[2].color);}});
test('rejects invalid vector shapes, opacity and duplicate IDs',()=>{for(const change of [{shape:'unknown'},{opacity:NaN},{animation:'bad'}]){const s=createStory();Object.assign(s.elements[0],change);assert.equal(validStory(s),false);}const s=createStory();s.elements[1].id=s.elements[0].id;assert.equal(validStory(s),false);});
test('legacy text-only drafts remain editable',()=>{const s=createStory();s.elements=[{id:1,text:'טיוטה קודמת',x:540,y:880,size:100,color:'#263e35',align:'center',font:'serif'}];assert.ok(validStory(s));});
