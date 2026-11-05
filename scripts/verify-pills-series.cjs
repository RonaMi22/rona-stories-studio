const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs/promises'),{execFileSync}=require('node:child_process');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1050},acceptDownloads:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.TEST_URL||'http://127.0.0.1:3000';
 await page.goto(base+'/?story=pills-informed-2');await page.waitForFunction(()=>document.querySelectorAll('.pills-design').length===4&&!document.querySelector('#export').disabled);
 const draft=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('rona-story')));
 assert.equal(await page.locator('.template').count(),9);assert.equal(await page.locator('.series-design').count(),4);assert.equal(await page.locator('.sperm-design').count(),4);
 assert.equal((await draft()).scene,'pills-informed-2');
 const firstText=(await draft()).elements.find(e=>e.type==='text');await page.locator('#layers').selectOption(String(firstText.id));assert.ok(await page.locator('#animation').isDisabled());
 await page.locator('#text').fill(firstText.text+'\nבדיקת עריכה');await page.reload();await page.waitForFunction(()=>!document.querySelector('#export').disabled);assert.match((await draft()).elements.find(e=>e.id===firstText.id).text,/בדיקת עריכה/);
 const illustration=(await draft()).elements.find(e=>e.type==='illustration');await page.locator('#layers').selectOption(String(illustration.id));assert.ok(await page.locator('#illustration-controls').isVisible());await page.locator('#motif').selectOption('heart');await page.locator('#illustration-accent').fill('#9baf87');await page.locator('#animation').selectOption('float');assert.equal((await draft()).elements.find(e=>e.id===illustration.id).motif,'heart');
 await page.locator('#sound-enabled').uncheck();assert.equal((await draft()).sound,undefined);await page.locator('#sound-enabled').check();await page.locator('#sound-volume').fill('0.018');
 await page.locator('#play').click();assert.equal(await page.locator('#play').getAttribute('aria-pressed'),'true');await page.waitForTimeout(400);await page.locator('#play').click();
 await page.locator('#duration').fill('3');await page.locator('#video-format').selectOption('mp4');const download=page.waitForEvent('download',{timeout:20000});await page.locator('#export-video').click();const result=await download;await result.saveAs('/tmp/rona-pills-native.mp4');const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json','/tmp/rona-pills-native.mp4'],{encoding:'utf8'}));assert.ok(info.streams.some(s=>s.codec_name==='h264'&&s.width===1080&&s.height===1920));assert.ok(info.streams.some(s=>s.codec_type==='audio'));assert.ok(Number(info.format.duration)>2.8);
 execFileSync('ffmpeg',['-i','/tmp/rona-pills-native.mp4','-af','volumedetect','-f','null','-'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
 // Compare only text areas: interactive captions must be identical while art moves.
 for(const i of [1,2,4]){await page.goto(base+'/scripts/red-tent-render.html?series=pills&id=0'+i);await page.evaluate(()=>window.ready);const same=await page.evaluate(()=>{const c=document.querySelector('canvas'),x=c.getContext('2d');window.draw(0);const a=x.getImageData(340,210,620,180).data;window.draw(1500);const b=x.getImageData(340,210,620,180).data;return a.every((v,i)=>v===b[i]);});assert.ok(same,'fixed interactive text '+i);}
 const mobile=await browser.newPage({viewport:{width:360,height:800},isMobile:true,hasTouch:true,acceptDownloads:true});await mobile.goto(base+'/stories/pills/index.html');assert.equal(await mobile.locator('article').count(),4);assert.equal(await mobile.locator('video').count(),4);assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await mobile.locator('article').first().getByText('עריכה בסטודיו').tap();await mobile.waitForFunction(()=>document.querySelectorAll('.pills-design').length===4&&!document.querySelector('#export').disabled);assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await mobile.screenshot({path:'/tmp/rona-pills-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 4 new + 17 preserved stories, text/art/audio editing, persistence, MP4 with audio, fixed interactive text, mobile gallery/editor.');
})().catch(e=>{console.error(e);process.exit(1)});
