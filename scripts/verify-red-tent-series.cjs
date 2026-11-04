const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path'),{execFileSync}=require('node:child_process');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.TEST_URL||'http://127.0.0.1:3000';await page.goto(base);await page.waitForFunction(()=>document.querySelectorAll('.series-design').length===4&&document.querySelectorAll('.template').length===9);
 const draft=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('rona-story')));
 for(let i=0;i<4;i++){
  await page.locator('.series-design').nth(i).click();await page.waitForFunction(()=>!document.querySelector('#export').disabled);
  let story=await draft();assert.equal(story.scene,'red-tent-personal-'+(i+1));assert.ok(story.elements[0].src.startsWith('data:'));assert.ok((await page.locator('#save-status').textContent()).includes('נשמרו'));
  const text=story.elements.find(e=>e.type==='text'&&e.id!==3&&e.text.includes('\n'));
  await page.locator('#layers').selectOption(String(text.id));await page.locator('#text').fill('בדיקת עריכה אישית');await page.locator('#animation').selectOption('fade');await page.locator('#animation-delay').fill('2.4');await page.locator('#animation-duration').fill('1.8');
  story=await draft();assert.equal(story.elements.find(e=>e.id===text.id).delay,2.4);assert.equal(story.elements.find(e=>e.id===text.id).fadeDuration,1.8);
  await page.locator('.template').nth(0).click();await page.locator('.series-design').nth(i).click();await page.waitForFunction(()=>!document.querySelector('#export').disabled);assert.equal((await draft()).elements.find(e=>e.id===text.id).text,'בדיקת עריכה אישית');
  await page.locator('#reset').click();await page.waitForFunction(()=>!document.querySelector('#export').disabled);assert.equal((await draft()).scene,'red-tent-personal-'+(i+1));assert.notEqual((await draft()).elements.find(e=>e.id===text.id).text,'בדיקת עריכה אישית');
  const id=String(i+1).padStart(2,'0'),file=path.resolve(__dirname,'../stories/red-tent/exports/'+id+'.mp4');
  const meta=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,pix_fmt,r_frame_rate','-show_entries','format=duration','-of','json',file],{encoding:'utf8'}));const v=meta.streams.find(s=>s.codec_name==='h264');assert.equal(v.width,1080);assert.equal(v.height,1920);assert.equal(v.pix_fmt,'yuv420p');assert.equal(v.r_frame_rate,'30/1');assert.equal(Number(meta.format.duration),i===3?13:15);
  const png=await fs.readFile(path.resolve(__dirname,'../stories/red-tent/exports/'+id+'.png'));assert.equal(png.readUInt32BE(16),1080);assert.equal(png.readUInt32BE(20),1920);
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/stories/red-tent/index.html');assert.equal(await page.locator('article').count(),4);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 for(const video of await page.locator('video').all()){
  await video.evaluate(async v=>{v.muted=true;await v.play();});await page.waitForFunction(()=>[...document.querySelectorAll('video')].some(v=>!v.paused&&v.currentTime>.2));assert.equal(await video.evaluate(v=>v.videoWidth),1080);await video.evaluate(v=>v.pause());
 }
 await page.screenshot({path:'/tmp/red-tent-series-mobile.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log(JSON.stringify({newStories:4,originalStories:9,editableTextAndTiming:true,persistence:true,resetPreservesSeries:true,mp4AndPng:4,mobilePlayback:true,errors}));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
