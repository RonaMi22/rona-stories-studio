import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStory,templates,validStory} from '../src/model.js';
test('every template produces a valid editable story',()=>{templates.forEach((_,i)=>{const s=createStory(i);assert.ok(validStory(s));assert.ok(s.elements[0].text.includes('\n'));});});
test('new drafts do not share layer state',()=>{const a=createStory(),b=createStory();a.elements[0].text='changed';assert.notEqual(a.elements[0].text,b.elements[0].text);});
test('rejects corrupt saved drafts and unsafe image sources',()=>{for(const s of [null,{}, {...createStory(),photo:'https://example.com/image.jpg'},{...createStory(),overlay:Infinity},{...createStory(),elements:[{...createStory().elements[0],size:-1}]}])assert.equal(validStory(s),false);});
