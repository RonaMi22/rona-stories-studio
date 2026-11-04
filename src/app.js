import {templates,createStory,validStory,migrateStory} from './model.js';
import {render,prepareDesign,hitTest} from './render.js';
import {restoreChartCaptions} from './restore-chart-captions.js';
const $=id=>document.getElementById(id),canvas=$('story'),ctx=canvas.getContext('2d');
const fontsReady=Promise.all(['400 40px Assistant','700 40px Heebo'].map(f=>document.fonts.load(f,'אבג ABC')));
let story=createStory(),selected=7,history=[],drag=null,playing=false,frame,loadVersion=0,assetsReady=false,exporting=false,cancelExport=false,photoUploadVersion=0;
const draftKey=scene=>'rona-editorial-'+scene;
const seriesOriginals=new Map();
try{
 const raw=localStorage.getItem('rona-story'),saved=JSON.parse(raw),migrated=migrateStory(saved);
 if(migrated){story=migrated;if(saved.version!==3&&!localStorage.getItem('rona-before-editorial'))localStorage.setItem('rona-before-editorial',raw);}
}catch{}
function draw(time=null){render(ctx,story,time);}
function toast(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.display='none',4500);}
function checkpoint(){history.push(JSON.stringify(story));if(history.length>40)history.shift();$('undo').disabled=false;}
function persist(){
 try{const value=JSON.stringify(story);localStorage.setItem('rona-story',value);localStorage.setItem(draftKey(story.scene),value);$('save-status').textContent='כל השינויים נשמרו';}
 catch{$('save-status').textContent='הזיכרון מלא — שמרי קובץ עריכה';}
 draw();
}
async function prepare(){
 const version=++loadVersion;assetsReady=false;$('image-status').textContent='טוענת תצלומים…';updateExportButtons();
 try{await Promise.all([fontsReady,prepareDesign(story)]);if(version!==loadVersion)return;assetsReady=true;const empty=story.elements.some(e=>e.type==='photo'&&!e.src);$('image-status').textContent=empty?'מוכן לעריכה ולייצוא · אפשר להוסיף צילום משלך':'התצלומים והגופנים מוכנים';draw();}
 catch{if(version===loadVersion){$('image-status').textContent='טעינת התצלום נכשלה. נסי שוב או החליפי אותו.';toast('התצלום לא נטען — אפשר להחליף תמונה או לנסות שוב');}}
 updateExportButtons();
}
const selectedLayer=()=>story.elements.find(e=>e.id===selected);
function sync(){
 const e=selectedLayer(),text=e?.type==='text',photo=e?.type==='photo';
 $('layers').replaceChildren(...story.elements.map((e,i)=>new Option(`${i+1}. ${e.type==='text'?e.text.slice(0,24):e.type==='photo'?'תצלום · '+e.label:'משטח צבע'}`,e.id)));$('layers').value=selected;
 $('text-controls').hidden=!text;$('frame-controls').hidden=!e||text;$('photo-controls').hidden=!photo;$('color-label').hidden=photo;
 for(const id of ['text','font','align','size','ink','delete','opacity','animation','x','y','forward','backward'])$(id).disabled=!e;
 if(e){
  $('x').value=Math.round(e.x);$('y').value=Math.round(e.y);$('opacity').value=e.opacity*100;$('animation').value=e.animation;$('animation-delay').value=e.delay??story.elements.indexOf(e)*.045;$('animation-duration').value=e.fadeDuration??.7;
  if(text){$('text').value=e.text;$('font').value=e.font;$('align').value=e.align;$('size').value=e.size;$('size-value').value=e.size+' px';}
  if(!photo)$('ink').value=e.color;
  if(!text){$('width').value=e.width;$('height').value=e.height;}
  if(photo){$('zoom').value=e.zoom;$('focusX').value=e.focusX;$('focusY').value=e.focusY;$('tint').value=e.tint*100;$('tintColor').value=e.tintColor;$('placeholderText').value=e.placeholderText;$('photo-label').value=e.label;$('placeholderColor').value=e.placeholderColor;$('placeholderInk').value=e.placeholderInk;$('placeholderY').value=e.placeholderY;}
 }
 $('bg').value=story.bg;$('accent').value=story.accent;$('duration').value=story.duration;$('duration-value').value=story.duration+' שניות';$('motion').value=story.motion;
 $('undo').disabled=!history.length;$('design-name').textContent=story.title??'הסטורי שלי';
 $('restore-chart-captions').hidden=story.scene!=='sperm-survival-3';
 $('interaction-guide').hidden=!story.interaction;if(story.interaction)$('interaction-copy').textContent=story.interaction.question+(story.interaction.options?.length?' · '+story.interaction.options.join(' / '):'');
 document.querySelectorAll('.template').forEach((b,i)=>b.classList.toggle('active',templates[i].scene===story.scene));document.querySelectorAll('.series-design, .sperm-design').forEach(b=>b.classList.toggle('active',b.dataset.scene===story.scene));draw();
}
function stop(){playing=false;cancelAnimationFrame(frame);$('play').textContent='▷ תצוגת אנימציה';$('play').setAttribute('aria-pressed','false');draw();}
async function choose(index,reset=false){
 if(exporting)return;photoUploadVersion++;stop();checkpoint();persist();
 let saved;try{saved=JSON.parse(localStorage.getItem(draftKey(templates[index].scene)));}catch{}
 story=!reset&&validStory(saved)?saved:createStory(index);selected=7;sync();persist();await prepare();
}
async function thumbnails(){
 await fontsReady;
 for(const [i,t] of templates.entries()){
  const button=document.createElement('button');button.className='template';button.dataset.index=i;button.setAttribute('aria-label',t.name);
  const mini=document.createElement('canvas');mini.width=216;mini.height=384;mini.className='mini';const m=mini.getContext('2d');m.scale(.2,.2);const design=createStory(i);
  try{await prepareDesign(design);}catch{button.title='התצלום לא נטען';}
  render(m,design);const title=document.createElement('strong');title.textContent=t.name;const tag=document.createElement('small');tag.textContent=t.tag;
  button.append(mini,title,tag);button.onclick=()=>choose(i);$('templates').append(button);
 }sync();
}
const bindings=[['text','text'],['font','font'],['align','align'],['size','size'],['ink','color'],['opacity','opacity'],['animation','animation'],['x','x'],['y','y'],['width','width'],['height','height'],['zoom','zoom'],['focusX','focusX'],['focusY','focusY'],['tint','tint'],['tintColor','tintColor'],['placeholderText','placeholderText'],['photo-label','label'],['placeholderColor','placeholderColor'],['placeholderInk','placeholderInk'],['placeholderY','placeholderY'],['animation-delay','delay'],['animation-duration','fadeDuration']];
for(const [id,key] of bindings)$(id).addEventListener('input',()=>{
 const e=selectedLayer();if(!e||exporting)return;const input=$(id);let value=input.value;
 if(input.type==='number'||input.type==='range'){value=Number(value);if(!Number.isFinite(value))return;value=Math.max(Number(input.min),Math.min(Number(input.max),value));}
 if(['opacity','tint'].includes(id))value/=100;
 stop();checkpoint();e[key]=value;if(id==='size')$('size-value').value=value+' px';persist();
});
for(const key of ['bg','accent'])$(key).oninput=()=>{if(exporting)return;stop();checkpoint();const old=story[key];story[key]=$(key).value;if(key==='accent')for(const e of story.elements)if(e.color?.toLowerCase()===old.toLowerCase())e.color=story.accent;persist();};
for(const key of ['duration','motion'])$(key).oninput=()=>{if(exporting)return;stop();checkpoint();story[key]=Number($(key).value);$('duration-value').value=story.duration+' שניות';persist();};
$('layers').onchange=()=>{stop();selected=Number($('layers').value);sync();};
function add(type){
 if(story.elements.length>=50)return toast('אפשר להוסיף עד 50 שכבות');stop();checkpoint();selected=Date.now();
 const element=type==='text'?{id:selected,type:'text',text:'המילים שלך כאן',x:940,y:900,size:60,color:story.accent,font:'Assistant',align:'right',opacity:1,animation:'fade'}:type==='rect'?{id:selected,type:'rect',label:'משטח צבע',x:540,y:960,width:700,height:300,color:story.accent,opacity:.8,animation:'none'}:{...createStory().elements[0],id:selected,x:540,y:960,width:750,height:800};
 story.elements.push(element);sync();persist();if(type==='photo')prepare();
}
$('add').onclick=()=>add('text');$('add-panel').onclick=()=>add('rect');$('add-photo').onclick=()=>add('photo');
$('delete').onclick=()=>{if(!selectedLayer())return;if(selectedLayer().type==='photo')return clearPhoto();photoUploadVersion++;stop();checkpoint();story.elements=story.elements.filter(e=>e.id!==selected);selected=story.elements[0]?.id;sync();persist();prepare();};
for(const [id,delta] of [['forward',1],['backward',-1]])$(id).onclick=()=>{const i=story.elements.findIndex(e=>e.id===selected),j=i+delta;if(j<0||j>=story.elements.length)return;stop();checkpoint();[story.elements[i],story.elements[j]]=[story.elements[j],story.elements[i]];sync();persist();};
$('undo').onclick=async()=>{if(!history.length)return;photoUploadVersion++;stop();story=JSON.parse(history.pop());selected=story.elements.find(e=>e.type==='text')?.id;sync();persist();await prepare();};
$('reset').onclick=async()=>{
 if(seriesOriginals.has(story.scene)){
  photoUploadVersion++;stop();checkpoint();story=structuredClone(seriesOriginals.get(story.scene));selected=story.elements.find(e=>e.type==='text')?.id;sync();persist();await prepare();
 }else if((story.scene?.startsWith('red-tent-personal-')||story.scene?.startsWith('sperm-survival-')))toast('הסדרה עדיין נטענת. נסי שוב בעוד רגע.');
 else choose(Math.max(0,templates.findIndex(t=>t.scene===story.scene)),true);
};
$('retry-images').onclick=()=>prepare();
$('restore-chart-captions').onclick=async()=>{
 const original=seriesOriginals.get(story.scene);if(!original||story.scene!=='sperm-survival-3')return;
 photoUploadVersion++;stop();checkpoint();story=restoreChartCaptions(story,original);selected=4;sync();persist();await prepare();
};
function photoTarget(){return selectedLayer()?.type==='photo'?selectedLayer():story.elements.find(e=>e.type==='photo');}
$('select-photo').onclick=()=>{const e=photoTarget();if(e){selected=e.id;sync();}else add('photo');};
async function clearPhoto(){
 const e=photoTarget();if(!e)return;
 photoUploadVersion++;stop();checkpoint();
 e.src=null;e.zoom=1;e.focusX=50;e.focusY=50;
 selected=e.id;sync();persist();await prepare();
}
$('clear-photo').onclick=clearPhoto;
$('remove-photo').onclick=clearPhoto;
// Deleting a photograph clears its contents; frame deletion is a separate explicit action.
$('delete-photo-frame').onclick=()=>{
 const e=photoTarget();if(!e)return;
 photoUploadVersion++;stop();checkpoint();story.elements=story.elements.filter(layer=>layer!==e);
 selected=story.elements.find(layer=>layer.type==='text')?.id;sync();persist();prepare();
};
$('quick-photo').onclick=()=>$('photo').click();
$('photo').onchange=async()=>{
 const file=$('photo').files[0];$('photo').value='';if(!file)return;
 const version=++photoUploadVersion,targetStory=story,targetFrame=photoTarget();
 if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){toast('בחרי JPG, PNG או WEBP עד 10MB');await prepare();return;}
 loadVersion++;assetsReady=false;$('image-status').textContent='טוענת את התצלום החדש…';updateExportButtons();
 const current=()=>version===photoUploadVersion&&story===targetStory&&(!targetFrame||story.elements.includes(targetFrame));
 try{
  const bitmap=await createImageBitmap(file),c=document.createElement('canvas');
  const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height));
  c.width=Math.max(1,Math.round(bitmap.width*scale));c.height=Math.max(1,Math.round(bitmap.height*scale));
  c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);bitmap.close();
  const src=c.toDataURL('image/jpeg',.86);
  // Decode into the renderer cache before replacing the visible source.
  await Promise.all([fontsReady,prepareDesign({elements:[{type:'photo',src}]})]);
  if(!current())return;
  if(!targetFrame&&story.elements.length>=50){toast('אפשר להוסיף עד 50 שכבות');await prepare();return;}
  stop();checkpoint();let e=targetFrame;
  if(!e){
   // Recover a previously deleted frame in its story's original position, below text/panels.
   const index=Math.max(0,templates.findIndex(t=>t.scene===story.scene));
   e={...createStory(index).elements.find(layer=>layer.type==='photo'),id:Date.now()};story.elements.unshift(e);
  }
  e.src=src;e.label='התצלום שלי';e.zoom=1;e.focusX=50;e.focusY=50;
  selected=e.id;sync();persist();await prepare();
 }catch{if(current()){toast('התמונה לא תקינה. נסי תמונה אחרת.');await prepare();}}
};
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1080/r.width,y:(e.clientY-r.top)*1920/r.height};}
canvas.onpointerdown=e=>{if(exporting)return;stop();const p=point(e),current=selectedLayer(),hit=current&&hitTest(ctx,current,p)?current:[...story.elements].reverse().find(t=>hitTest(ctx,t,p));if(hit){checkpoint();selected=hit.id;drag={x:p.x-hit.x,y:p.y-hit.y,startX:p.x,startY:p.y,moved:false};canvas.setPointerCapture(e.pointerId);sync();}};
canvas.onpointermove=e=>{if(!drag)return;const p=point(e),t=selectedLayer();if(Math.hypot(p.x-drag.startX,p.y-drag.startY)>20)drag.moved=true;t.x=Math.round(Math.max(-2160,Math.min(3240,p.x-drag.x)));t.y=Math.round(Math.max(-3840,Math.min(5760,p.y-drag.y)));$('x').value=t.x;$('y').value=t.y;draw();};
canvas.onpointerup=()=>{if(!drag)return;const upload=!drag.moved&&selectedLayer()?.type==='photo'&&!selectedLayer().src;drag=null;persist();if(upload)$('photo').click();};
canvas.onpointercancel=()=>{if(drag){drag=null;persist();}};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=async()=>{if(!assetsReady)return;stop();await fontsReady;draw();canvas.toBlob(blob=>{if(blob){download(blob,'rona-'+story.scene+'.png');toast('הסטורי מוכן ✨');}else toast('הייצוא נכשל');},'image/png');};
$('save-design').onclick=()=>download(new Blob([JSON.stringify(story,null,2)],{type:'application/json'}),'rona-'+story.scene+'-editable.json');
$('load-design').onchange=async()=>{try{const file=$('load-design').files[0];if(!file)return;if(file.size>20*1024*1024)throw Error();const next=migrateStory(JSON.parse(await file.text()));if(!next)throw Error();photoUploadVersion++;stop();checkpoint();story=next;selected=story.elements.find(e=>e.type==='text')?.id;sync();persist();await prepare();}catch{toast('קובץ העיצוב אינו תקין');}finally{$('load-design').value='';}};
$('play').onclick=()=>{if(playing)return stop();if(!assetsReady)return;playing=true;const start=performance.now();$('play').textContent='Ⅱ עצירת אנימציה';$('play').setAttribute('aria-pressed','true');const tick=now=>{const elapsed=now-start;if(elapsed>story.duration*1000)return stop();draw(elapsed);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);};
const mp4Types=['video/mp4;codecs=avc1.42001E','video/mp4'],webmTypes=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'];
const supported=types=>window.MediaRecorder?types.find(t=>MediaRecorder.isTypeSupported(t)):undefined;
const videoTypes={mp4:supported(mp4Types),webm:supported(webmTypes)};
for(const option of $('video-format').options)option.disabled=!videoTypes[option.value];
$('video-format').value=videoTypes.mp4?'mp4':'webm';
$('video-note').textContent=videoTypes.mp4?'MP4 · וידאו אנכי 1080 × 1920, מוכן להעלאה לסטורי. PNG נשמר כתמונה קבועה.':'הדפדפן הזה תומך ב־WebM בלבד. להעלאה לאינסטגרם ייתכן שתידרש המרה ל־MP4.';
function updateExportButtons(){$('export').disabled=!assetsReady||exporting;$('export-video').disabled=!assetsReady||exporting||!canvas.captureStream||!videoTypes[$('video-format').value];$('play').disabled=!assetsReady||exporting;}
$('video-format').onchange=updateExportButtons;
$('cancel-export').onclick=()=>{cancelExport=true;};
$('export-video').onclick=async()=>{
 if(!assetsReady||exporting)return;
 const format=$('video-format').value,type=videoTypes[format];if(!type||!canvas.captureStream)return toast('ייצוא הווידאו אינו נתמך בדפדפן זה');
 stop();const snapshot=structuredClone(story);await Promise.all([fontsReady,prepareDesign(snapshot)]);
 exporting=true;cancelExport=false;document.querySelector('main').inert=true;document.querySelector('header').inert=true;$('export-progress').hidden=false;updateExportButtons();
 const stream=canvas.captureStream(30),chunks=[];
 try{
  const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:8000000});
  const done=new Promise((resolve,reject)=>{recorder.onstop=resolve;recorder.onerror=e=>reject(e.error??new Error('Recording failed'));});
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};render(ctx,snapshot,0);recorder.start();const start=performance.now();
  await new Promise(resolve=>{const tick=now=>{const elapsed=now-start;render(ctx,snapshot,elapsed);$('export-status').textContent=`מייצאת ${Math.min(snapshot.duration,elapsed/1000).toFixed(1)} / ${snapshot.duration} שניות · השאירי את הלשונית פתוחה`;if(!cancelExport&&elapsed<snapshot.duration*1000)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});
  recorder.stop();await done;
  if(!cancelExport){const blob=new Blob(chunks,{type});if(blob.size<1000)throw Error('Empty video');download(blob,'rona-'+snapshot.scene+'.'+format);toast(format==='mp4'?'קובץ ה־MP4 מוכן לאינסטגרם ✨':'קובץ ה־WebM מוכן; ייתכן שתידרש המרה ל־MP4');}
 }catch{toast('ייצוא הווידאו נכשל. נסי שוב או שמרי PNG.');}
 finally{stream.getTracks().forEach(t=>t.stop());exporting=false;document.querySelector('main').inert=false;document.querySelector('header').inert=false;$('export-progress').hidden=true;updateExportButtons();draw();}
};
sync();prepare();thumbnails();

// Add the approved personal series alongside the original nine designs.
async function personalSeries(folder='red-tent',container='red-tent-series',className='series-design'){
 try{
  const entries=await (await fetch('./stories/'+folder+'/manifest.json'+(folder==='sperm-survival'?'?v=caption-fix':''))).json();
  for(const entry of entries){
   const original=await (await fetch('./stories/'+folder+'/'+entry.design+(folder==='sperm-survival'?(entry.design.includes('?')?'&':'?')+'v2=caption-fix':''))).json();if(!validStory(original))throw Error('Invalid series design');
   seriesOriginals.set(original.scene,structuredClone(original));
   const button=document.createElement('button');button.className=className;button.dataset.scene=original.scene;button.setAttribute('aria-label',entry.title);
   const image=document.createElement('img');image.className='mini';image.src='./stories/'+folder+'/'+entry.poster;image.alt=entry.title;
   const label=document.createElement('strong');label.textContent=entry.id+'. '+entry.title;button.append(image,label);
   button.onclick=async()=>{
    if(exporting)return;photoUploadVersion++;stop();checkpoint();persist();
    let saved;try{saved=JSON.parse(localStorage.getItem(draftKey(original.scene)));}catch{}
    story=validStory(saved)?saved:structuredClone(original);
    if(story.scene==='sperm-survival-3'&&new URLSearchParams(location.search).get('repair')==='chart-captions'){
     story=restoreChartCaptions(story,original);const url=new URL(location.href);url.searchParams.delete('repair');window.history.replaceState(null,'',url);
    }
    selected=story.elements.find(e=>e.type==='text')?.id;sync();persist();await prepare();
   };$(container).append(button);sync();if(new URLSearchParams(location.search).get('story')===original.scene)button.click();
  }
 }catch{const notice=document.createElement('p');notice.textContent='הסדרה לא נטענה. אפשר לרענן את הדף ולנסות שוב.';$(container).append(notice);}
}
personalSeries();

personalSeries('sperm-survival','sperm-series','sperm-design');
