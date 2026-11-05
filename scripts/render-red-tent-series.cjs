const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs/promises'),path=require('node:path'),{execFileSync}=require('node:child_process');
(async()=>{
 const root=path.resolve(__dirname,'..'),series=['sperm-survival','pills'].includes(process.env.SERIES)?process.env.SERIES:'red-tent',out=path.join(root,'stories',series,'exports');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(let i=1;i<=4;i++){
  const id=String(i).padStart(2,'0');if(process.env.STORY_ID&&id!==process.env.STORY_ID.padStart(2,'0'))continue;await page.goto((process.env.TEST_URL||'http://127.0.0.1:3000')+'/scripts/red-tent-render.html?id='+id+'&series='+series);await page.evaluate(()=>window.ready);
  const bounds=await page.evaluate(async()=>{const {font}=await import('/src/render.js');const ctx=document.querySelector('canvas').getContext('2d');return window.design.elements.filter(e=>e.type==='text').map(e=>{ctx.font=font(e);const w=Math.max(...e.text.split('\n').map(l=>ctx.measureText(l).width));return {id:e.id,left:e.x-w,right:e.x,top:e.y-(e.text.split('\n').length-1)*e.size*1.35/2-e.size*.55,bottom:e.y+(e.text.split('\n').length-1)*e.size*1.35/2+e.size*.55};});});
  const overflow=bounds.filter(e=>e.left<95||e.right>980||e.top<100||e.bottom>1800);if(overflow.length)throw Error(id+' text outside safe bounds '+JSON.stringify(overflow));
  await page.screenshot({path:path.join(out,id+'.png')});console.log('Poster',id);
  if(process.env.POSTERS_ONLY)continue;
  const design=await page.evaluate(()=>({motion:design.motion,duration:design.duration,sound:design.sound}));
  const frames='/tmp/rona-'+series+'-series-'+id;await fs.mkdir(frames,{recursive:true});
  if(design.motion){for(let n=0;n<design.duration*30;n++){await page.evaluate(t=>window.draw(t),n/30*1000);await page.screenshot({path:path.join(frames,String(n).padStart(4,'0')+'.jpg'),type:'jpeg',quality:94});if(n%120===0)console.log('Frame',id,n);}}
  const input=design.motion?['-framerate','30','-i',path.join(frames,'%04d.jpg')]:['-loop','1','-framerate','30','-i',path.join(out,id+'.png')];
  let audioInput=['-f','lavfi','-i','anullsrc=channel_layout=stereo:sample_rate=48000'];
  if(design.sound){
   const rate=48000,count=Math.ceil(design.duration*rate),wav=Buffer.alloc(44+count*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(count*2,40);
   for(let n=0;n<count;n++){const t=n/rate;let value=0;for(const start of design.sound.times){const delta=t-start;if(delta>=0&&delta<.06){const envelope=delta<.004?delta/.004:Math.exp(-(delta-.004)*110);value+=Math.sin(2*Math.PI*760*delta)*envelope*design.sound.volume;}}wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),44+n*2);}
   const audioPath=path.join(frames,'ticks.wav');await fs.writeFile(audioPath,wav);audioInput=['-i',audioPath];
  }
  execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error',...input,...audioInput,'-t',String(design.duration),'-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-threads','4','-preset','medium','-crf','19','-profile:v','high','-level:v','4.1','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-c:a','aac','-b:a','128k','-movflags','+faststart','-shortest',path.join(out,id+'.mp4')],{stdio:'inherit'});
  if(series==='sperm-survival'&&id==='03'){await fs.copyFile(path.join(out,id+'.png'),path.join(out,'03-full-heading.png'));await fs.copyFile(path.join(out,id+'.mp4'),path.join(out,'03-full-heading.mp4'));}
  console.log('MP4',id);
 }
 await browser.close();if(errors.length)throw Error(errors.join('\n'));
})().catch(e=>{console.error(e);process.exit(1);});
