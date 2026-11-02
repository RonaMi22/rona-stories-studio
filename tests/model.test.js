import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStory,templates,validStory,migrateStory,safePhoto} from '../src/model.js';

test('all nine editorial designs include independent editable photos and complete Hebrew content',()=>{
 assert.equal(templates.length,9);
 for(let i=0;i<9;i++){
  const s=createStory(i);assert.ok(validStory(s));
  assert.equal(s.elements.filter(e=>e.type==='photo').length,1);
  assert.equal(s.elements.filter(e=>e.type==='text').length,7);
  assert.ok(s.elements.every(e=>['text','photo','rect'].includes(e.type)));
  assert.equal(s.elements.find(e=>e.type==='photo').src,null);assert.ok(s.elements.find(e=>e.type==='photo').placeholderText);
  assert.ok(s.elements.find(e=>e.id===8).text.length>50);
  if(i>=6)assert.ok(s.elements.some(e=>e.text?.includes('10.3389/fnins.2012.00010')));
 }
 const a=createStory(),b=createStory();a.elements[0].focusX=20;a.elements.find(e=>e.id===8).text='עריכה';assert.equal(b.elements[0].focusX,50);assert.notEqual(a.elements.find(e=>e.id===8).text,b.elements.find(e=>e.id===8).text);
});

test('unsafe photo sources cannot be imported into the canvas',()=>{
 for(const value of ['./src/photos/warm-back.jpg','https://example.com/photo.jpg','javascript:alert(1)','data:image/svg+xml;base64,PHN2Zz4=','./src/photos/../../private.jpg','file:///etc/passwd'])assert.equal(safePhoto(value),false);
 assert.ok(safePhoto(null));assert.ok(safePhoto('data:image/png;base64,aGVsbG8='));
});

test('invalid geometry, motion, duplicated ids and malformed layers are rejected',()=>{
 const mutations=[s=>s.duration=Infinity,s=>s.motion=-1,s=>s.elements[0].width=-1,s=>s.elements[0].zoom=0,s=>s.elements[0].focusX=101,s=>s.elements[0].tint=NaN,s=>s.elements[0].src='https://example.com/image.jpg',s=>s.elements[1].id=s.elements[0].id,s=>s.elements[0]=null,s=>s.elements[0].type='art',s=>s.elements.find(e=>e.id===7).size=201];
 for(const mutate of mutations){const s=createStory();mutate(s);assert.equal(validStory(s),false);}
 assert.equal(validStory(null),false);assert.equal(validStory({}),false);
});

test('migration removes every legacy illustration while preserving edited words and uploaded photos',()=>{
 const old={version:2,scene:'brain',photo:'data:image/jpeg;base64,aGVsbG8=',elements:[{id:3,type:'art',shape:'woman'},{id:7,type:'text',text:'כותרת אישית'}]};
 const next=migrateStory(old);assert.ok(validStory(next));assert.equal(next.elements.find(e=>e.id===7).text,'כותרת אישית');assert.equal(next.elements[0].src,old.photo);assert.ok(next.elements.every(e=>e.type!=='art'));assert.equal(old.elements[0].shape,'woman');
 assert.equal(migrateStory(null),null);
});

test('current design JSON round trips preserve all editing and animation controls',()=>{
 const s=createStory(4);s.elements[0].focusX=15;s.elements[0].zoom=1.8;s.elements[0].animation='pan';s.duration=12;
 const restored=migrateStory(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored,s);restored.elements[0].focusX=90;assert.equal(s.elements[0].focusX,15);
});

test('obsolete missing stock-photo references migrate to editable placeholders',()=>{const old=createStory(3);old.elements[0].src='./src/photos/resting-body.jpg';delete old.elements[0].placeholderText;const result=migrateStory(old);assert.ok(validStory(result));assert.equal(result.elements[0].src,null);assert.equal(result.elements.find(e=>e.id===8).text,old.elements.find(e=>e.id===8).text);});
