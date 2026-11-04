const imageCache=new Map();
export const font=e=>`${e.font==='Heebo'?'700':'400'} ${e.size}px ${['Heebo','Assistant'].includes(e.font)?e.font:e.font==='serif'?'Georgia, serif':'Arial, sans-serif'}`;
export function loadImage(src){
 if(!imageCache.has(src))imageCache.set(src,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{imageCache.delete(src);reject(new Error('לא ניתן לטעון את התצלום'));};image.src=src;}));
 return imageCache.get(src);
}
const readyImages=new Map();
export async function prepareDesign(design){await Promise.all(design.elements.filter(e=>e.type==='photo'&&e.src).map(async e=>readyImages.set(e.src,await loadImage(e.src))));}
export function render(ctx,design,time=null){
 ctx.clearRect(0,0,1080,1920);ctx.fillStyle=design.bg;ctx.fillRect(0,0,1080,1920);
 const duration=design.duration*1000,progress=time===null?0:Math.min(1,time/duration),motion=design.motion;
 for(const [i,e] of design.elements.entries()){
 ctx.save();ctx.globalAlpha=e.opacity;
 const start=e.delay===undefined?i*45:e.delay*1000,fade=(e.fadeDuration??.7)*1000;
 const entrance=time===null?1:Math.min(1,Math.max(0,(time-start)/fade));
 if(time!==null&&motion>0){
  if(e.animation==='fade'||e.animation==='slide')ctx.globalAlpha*=entrance;
  if(e.animation==='slide')ctx.translate(0,(1-entrance)*30*motion);
 }
 if(e.type==='text'){
  ctx.direction=/[\u0590-\u05ff]/.test(e.text)?'rtl':'ltr';ctx.font=font(e);ctx.fillStyle=e.color;ctx.textAlign=e.align;ctx.textBaseline='middle';
  e.text.split('\n').forEach((line,i,lines)=>ctx.fillText(line,e.x,e.y+(i-(lines.length-1)/2)*e.size*1.35));
 }else if(e.type==='rect'){
  ctx.fillStyle=e.color;ctx.fillRect(e.x-e.width/2,e.y-e.height/2,e.width,e.height);
 }else{
  const img=e.src?readyImages.get(e.src):null;
  if(img){
   ctx.beginPath();ctx.rect(e.x-e.width/2,e.y-e.height/2,e.width,e.height);ctx.clip();
   const animated=time!==null&&e.animation==='zoom'?1+progress*.045*motion:1;
   const scale=Math.max(e.width/img.width,e.height/img.height)*e.zoom*animated;
   const width=img.width*scale,height=img.height*scale;
   const focus=Math.max(0,Math.min(100,e.focusX+(time!==null&&e.animation==='pan'?(progress-.5)*7*motion:0)))/100;
   ctx.drawImage(img,e.x-e.width/2-(width-e.width)*focus,e.y-e.height/2-(height-e.height)*e.focusY/100,width,height);
   ctx.fillStyle=e.tintColor;ctx.globalAlpha*=e.tint;ctx.fillRect(e.x-e.width/2,e.y-e.height/2,e.width,e.height);
  }else if(!e.src){
   // A labeled, editable photo slot; no stock download or drawn subject.
   const left=e.x-e.width/2,top=e.y-e.height/2,layerAlpha=ctx.globalAlpha;
   ctx.beginPath();ctx.rect(left,top,e.width,e.height);ctx.clip();
   ctx.fillStyle=e.placeholderColor;ctx.fillRect(left,top,e.width,e.height);
   ctx.strokeStyle=e.placeholderInk;ctx.lineWidth=2;ctx.setLineDash([12,12]);ctx.globalAlpha*=.3;
   ctx.strokeRect(left+35,top+35,Math.max(0,e.width-70),Math.max(0,e.height-70));
   ctx.globalAlpha=layerAlpha;ctx.fillStyle=e.placeholderInk;ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.font='400 38px Assistant';ctx.fillText(e.placeholderText,e.x,top+e.height*e.placeholderY,Math.max(40,e.width-100));
   ctx.font='400 26px Assistant';ctx.globalAlpha*=.75;
   ctx.fillText(e.label,e.x,top+e.height*e.placeholderY+56,Math.max(40,e.width-100));
  }
 }
 ctx.restore();
 }
}
export function hitTest(ctx,e,p){
 if(e.type!=='text')return Math.abs(p.x-e.x)<=e.width/2&&Math.abs(p.y-e.y)<=e.height/2;
 ctx.font=font(e);const width=Math.max(...e.text.split('\n').map(l=>ctx.measureText(l).width),40);
 const left=e.align==='center'?e.x-width/2:e.align==='right'?e.x-width:e.x;
 return p.x>=left-20&&p.x<=left+width+20&&Math.abs(p.y-e.y)<e.text.split('\n').length*e.size*.7;
}
