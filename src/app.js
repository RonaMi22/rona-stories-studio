import {templates,createStory,validStory,shapes} from './model.js';
import {drawArt,labels} from './art.js';
const $=id=>document.getElementById(id),canvas=$('story'),ctx=canvas.getContext('2d');
const fontsReady=Promise.all(['400 40px Assistant','400 40px Heebo','700 40px Heebo'].map(f=>document.fonts.load(f,'אבג ABC')));
let story=createStory(),selected=7,history=[],photo=null,drag=null,playing=false,startTime=0,frame;
try{const saved=JSON.parse(localStorage.getItem('rona-story'));if(validStory(saved)){story=saved;selected=story.elements[0]?.id;}}catch{}
const isArt=e=>e?.type==='art';
const font=e=>`${e.font==='Heebo'?'700':'400'} ${e.size}px ${['Heebo','Assistant'].includes(e.font)?e.font:e.font==='serif'?'Georgia, serif':'Arial, sans-serif'}`;
function toast(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').style.display='none',3200);}
function checkpoint(){history.push(JSON.stringify(story));if(history.length>40)history.shift();$('undo').disabled=false;}
function persist(){try{localStorage.setItem('rona-story',JSON.stringify(story));$('save-status').textContent='כל השינויים נשמרו';}catch{$('save-status').textContent='אין מקום לשמירת הטיוטה';}render();}
function loadPhoto(){const expected=story.photo;photo=null;if(expected){const img=new Image();img.onload=()=>{if(story.photo===expected){photo=img;render();}};img.onerror=()=>toast('לא ניתן לטעון את התמונה');img.src=expected;}render();}
function render(target=ctx,time=null,design=story){
 target.clearRect(0,0,1080,1920);target.fillStyle=design.bg;target.fillRect(0,0,1080,1920);
 if(photo&&design===story){const scale=Math.max(1080/photo.width,1920/photo.height);target.drawImage(photo,(1080-photo.width*scale)/2,(1920-photo.height*scale)/2,photo.width*scale,photo.height*scale);target.fillStyle=`rgba(0,0,0,${design.overlay/100})`;target.fillRect(0,0,1080,1920);}
 for(const [i,e] of design.elements.entries()){
 target.save();target.globalAlpha=e.opacity??1;
 if(time!==null&&e.animation==='fade')target.globalAlpha*=Math.min(1,Math.max(0,(time-i*35)/650));
 if(time!==null&&e.animation==='breathe'){const s=1+Math.sin(time/1800)*.008;target.translate(e.x,e.y);target.scale(s,s);target.translate(-e.x,-e.y);}
 if(isArt(e))drawArt(target,e);else{target.direction=/[\u0590-\u05ff]/.test(e.text)?'rtl':'ltr';target.font=font(e);target.fillStyle=e.color;target.textAlign=e.align;target.textBaseline='middle';e.text.split('\n').forEach((line,i,lines)=>target.fillText(line,e.x,e.y+(i-(lines.length-1)/2)*e.size*1.35));}
 target.restore();
 }
}
function sync(){
 const e=story.elements.find(e=>e.id===selected),art=isArt(e);
 $('layers').replaceChildren(...story.elements.map((e,i)=>new Option(`${i+1}. ${isArt(e)?labels[e.shape]:e.text.slice(0,24)}`,e.id)));$('layers').value=selected;
 for(const id of ['text','font','align','size','ink','delete','opacity','animation','x','y','forward','backward'])$(id).disabled=!e||(['text','font','align'].includes(id)&&art);
 $('shape-label').hidden=!art;
 if(e){$('text').value=art?'איור וקטורי מקורי — אפשר להזיז, להגדיל ולשנות צבע':e.text;$('font').value=e.font;$('align').value=e.align;$('size').max=art?1200:200;$('size').value=e.size;$('size-value').value=e.size+' px';$('ink').value=e.color;$('opacity').value=(e.opacity??1)*100;$('animation').value=e.animation??'none';$('x').value=Math.round(e.x);$('y').value=Math.round(e.y);if(art)$('shape').value=e.shape;}else $('text').value='';
 $('bg').value=story.bg;$('accent').value=story.accent;$('overlay').value=story.overlay;$('undo').disabled=!history.length;
 $('design-name').textContent=story.title??'הסטורי שלי';
 render();
}
function stop(){playing=false;cancelAnimationFrame(frame);$('play').textContent='▷ תצוגת אנימציה';$('play').setAttribute('aria-pressed','false');render();}
async function thumbnails(){await fontsReady;for(const [i,t] of templates.entries()){
 const button=document.createElement('button');button.className='template';button.dataset.index=i;button.setAttribute('aria-label',t.name);
 const mini=document.createElement('canvas');mini.width=216;mini.height=384;mini.className='mini';const m=mini.getContext('2d');m.scale(.2,.2);render(m,null,createStory(i));
 const title=document.createElement('strong');title.textContent=t.name;const tag=document.createElement('small');tag.textContent=t.tag;button.append(mini,title,tag);
 button.onclick=()=>{stop();checkpoint();story=createStory(i);selected=7;photo=null;document.querySelectorAll('.template').forEach(b=>b.classList.remove('active'));button.classList.add('active');sync();persist();};$('templates').append(button);
 }}
for(const [id,key] of [['text','text'],['font','font'],['align','align'],['size','size'],['ink','color'],['opacity','opacity'],['animation','animation'],['x','x'],['y','y'],['shape','shape']]){
 $(id).addEventListener('input',()=>{const e=story.elements.find(e=>e.id===selected);if(!e)return;stop();checkpoint();e[key]=['size','x','y'].includes(id)?Number($(id).value):id==='opacity'?Number($(id).value)/100:$(id).value;persist();if(['size','shape'].includes(id))sync();});
}
for(const key of ['bg','accent','overlay'])$(key).oninput=()=>{checkpoint();const previous=story[key];story[key]=key==='overlay'?Number($(key).value):$(key).value;if(key==='accent')for(const e of story.elements)if(isArt(e)&&e.color.toLowerCase()===previous.toLowerCase())e.color=story.accent;persist();};
$('layers').onchange=()=>{selected=Number($('layers').value);sync();};
function add(art=false){if(story.elements.length>=50)return toast('אפשר להוסיף עד 50 שכבות');stop();checkpoint();selected=Date.now();story.elements.push({id:selected,type:art?'art':'text',shape:'moon',text:art?'moon':'המילים שלך כאן',x:540,y:1100,size:art?200:65,color:story.accent,font:'Assistant',align:'center',opacity:1,animation:art?'breathe':'fade'});sync();persist();}
$('add').onclick=()=>add();$('add-art').onclick=()=>add(true);
$('delete').onclick=()=>{checkpoint();story.elements=story.elements.filter(e=>e.id!==selected);selected=story.elements[0]?.id;sync();persist();};
for(const [id,delta] of [['forward',1],['backward',-1]])$(id).onclick=()=>{const i=story.elements.findIndex(e=>e.id===selected),j=i+delta;if(j<0||j>=story.elements.length)return;checkpoint();[story.elements[i],story.elements[j]]=[story.elements[j],story.elements[i]];sync();persist();};
$('undo').onclick=()=>{if(!history.length)return;stop();story=JSON.parse(history.pop());selected=story.elements[0]?.id;loadPhoto();sync();persist();};
$('photo').onchange=async()=>{const file=$('photo').files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){toast('בחרו תמונת JPG, PNG או WEBP עד 10MB');return;}try{const bitmap=await createImageBitmap(file);const c=document.createElement('canvas');const scale=Math.min(1,1920/Math.max(bitmap.width,bitmap.height));c.width=bitmap.width*scale;c.height=bitmap.height*scale;c.getContext('2d').drawImage(bitmap,0,0,c.width,c.height);bitmap.close();checkpoint();story.photo=c.toDataURL('image/jpeg',.85);loadPhoto();persist();}catch{toast('התמונה לא תקינה. נסו תמונה אחרת.');}finally{$('photo').value='';}};
$('remove-photo').onclick=()=>{checkpoint();story.photo=null;photo=null;persist();};
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*1080/r.width,y:(e.clientY-r.top)*1920/r.height};}
function hitTest(t,p){if(isArt(t))return Math.abs(p.x-t.x)<t.size/2&&Math.abs(p.y-t.y)<t.size/2;ctx.font=font(t);const width=Math.max(...t.text.split('\n').map(l=>ctx.measureText(l).width),40);const left=t.align==='center'?t.x-width/2:t.align==='right'?t.x-width:t.x;return p.x>=left-20&&p.x<=left+width+20&&Math.abs(p.y-t.y)<t.text.split('\n').length*t.size*.7;}
canvas.onpointerdown=e=>{stop();const p=point(e),current=story.elements.find(t=>t.id===selected);const hit=current&&hitTest(current,p)?current:[...story.elements].reverse().find(t=>hitTest(t,p));if(hit){checkpoint();selected=hit.id;drag={x:p.x-hit.x,y:p.y-hit.y};canvas.setPointerCapture(e.pointerId);sync();}};
canvas.onpointermove=e=>{if(!drag)return;const p=point(e),t=story.elements.find(e=>e.id===selected);t.x=Math.max(0,Math.min(1080,p.x-drag.x));t.y=Math.max(0,Math.min(1920,p.y-drag.y));$('x').value=Math.round(t.x);$('y').value=Math.round(t.y);render();};
canvas.onpointerup=canvas.onpointercancel=()=>{if(drag){drag=null;persist();}};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=async()=>{await fontsReady;stop();render();canvas.toBlob(blob=>{if(!blob)return toast('הייצוא נכשל');download(blob,'rona-story.png');toast('הסטורי שלך מוכן ✨');},'image/png');};
$('save-design').onclick=()=>download(new Blob([JSON.stringify(story,null,2)],{type:'application/json'}),'rona-editable.json');
$('load-design').onchange=async()=>{try{const file=$('load-design').files[0];if(!file)return;if(file.size>15*1024*1024)throw Error();const next=JSON.parse(await file.text());if(!validStory(next))throw Error();stop();checkpoint();story=next;selected=story.elements[0]?.id;loadPhoto();sync();persist();}catch{toast('קובץ העיצוב אינו תקין');}finally{$('load-design').value='';}};
$('play').onclick=()=>{if(playing)return stop();playing=true;startTime=performance.now();$('play').textContent='Ⅱ עצירת אנימציה';$('play').setAttribute('aria-pressed','true');const tick=now=>{render(ctx,now-startTime);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);};
$('export-video').onclick=async()=>{
 if(!canvas.captureStream||!window.MediaRecorder)return toast('הדפדפן אינו תומך בייצוא וידאו');
 await fontsReady;stop();const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));if(!type)return toast('ייצוא וידאו אינו נתמך בדפדפן זה');
 const button=$('export-video');button.disabled=true;button.textContent='מייצאת 6 שניות…';const stream=canvas.captureStream(30),chunks=[];
 try{const recorder=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:6000000});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};const done=new Promise(resolve=>recorder.onstop=resolve);recorder.start();const start=performance.now();await new Promise(resolve=>{const tick=now=>{render(ctx,now-start);if(now-start<6000)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});recorder.stop();await done;download(new Blob(chunks,{type}), 'rona-story.webm');toast('הווידאו מוכן · ייתכן שיידרש המרה ל־MP4 באינסטגרם');}catch{toast('ייצוא הווידאו נכשל');}finally{stream.getTracks().forEach(t=>t.stop());button.disabled=false;button.textContent='וידאו מונפש · WebM';render();}
};
for(const shape of shapes)$('shape').add(new Option(labels[shape],shape));
loadPhoto();sync();fontsReady.then(()=>{render();thumbnails();});
