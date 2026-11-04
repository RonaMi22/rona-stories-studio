const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');

(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[];
 async function session(mobile=false){
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1440,height:1050},isMobile:mobile,hasTouch:mobile});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:3000');
  await page.waitForFunction(()=>document.querySelectorAll('.template').length===9&&!document.querySelector('#export').disabled);
  return page;
 }
 const page=await session();
 const colors=[[220,50,70],[40,180,90],[50,100,220]];
 const images=await page.evaluate(colors=>colors.map(rgb=>{const c=document.createElement('canvas');c.width=240;c.height=320;const ctx=c.getContext('2d');ctx.fillStyle=`rgb(${rgb})`;ctx.fillRect(0,0,c.width,c.height);return c.toDataURL('image/png').split(',')[1];}),colors);
 const draft=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('rona-story')));
 const geometry=e=>({id:e.id,x:e.x,y:e.y,width:e.width,height:e.height,animation:e.animation});
 async function upload(p,color){
  // Reuse the same filename deliberately; selecting the same file must trigger change again.
  await p.locator('#photo').setInputFiles({name:'replacement.png',mimeType:'image/png',buffer:Buffer.from(images[color],'base64')});
  await p.waitForFunction(rgb=>{
   const s=JSON.parse(localStorage.getItem('rona-story')),e=s?.elements.find(e=>e.id===Number(document.querySelector('#layers').value)&&e.type==='photo');
   if(!e?.src||document.querySelector('#export').disabled)return false;
   const pixel=document.querySelector('#story').getContext('2d').getImageData(e.x,e.y,1,1).data;
   return rgb.every((v,i)=>Math.abs(v-pixel[i])<12);
  },colors[color]);
 }
 let cycles=0;
 for(let index=0;index<9;index++){
  await page.locator('.template').nth(index).click();
  const original=await draft(page),frame=geometry(original.elements.find(e=>e.type==='photo'));
  for(let cycle=0;cycle<4;cycle++){
   await upload(page,cycle%3);
   const uploaded=await draft(page);assert.deepEqual(geometry(uploaded.elements.find(e=>e.id===frame.id)),frame);
   // Direct replacement also needs to display without reloading or reselecting the design.
   await upload(page,(cycle+1)%3);
   await page.locator(cycle%2?'#delete':'#remove-photo').click();
   const cleared=await draft(page),photo=cleared.elements.find(e=>e.id===frame.id);
   assert.ok(photo,'removal must keep the original photo frame');assert.equal(photo.src,null);assert.deepEqual(geometry(photo),frame);
   assert.deepEqual(cleared.elements.filter(e=>e.type!=='photo'),original.elements.filter(e=>e.type!=='photo'));
   assert.deepEqual(cleared.elements.map(e=>e.id),original.elements.map(e=>e.id));cycles++;
  }
  await upload(page,2);await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.template').length===9&&!document.querySelector('#export').disabled);
  assert.deepEqual(geometry((await draft(page)).elements.find(e=>e.id===frame.id)),frame);
 }
 // Undo removal restores the image in the same frame.
 const previous=(await draft(page)).elements[0].src;await page.locator('#remove-photo').click();await page.locator('#undo').click();await page.waitForFunction(()=>!document.querySelector('#export').disabled);assert.equal((await draft(page)).elements[0].src,previous);
 // Deliberately deleting a frame is still available; uploading reconstructs the correct story layout.
 const expected=geometry((await draft(page)).elements[0]);await page.locator('#delete-photo-frame').click();assert.equal((await draft(page)).elements.filter(e=>e.type==='photo').length,0);await upload(page,0);const recovered=(await draft(page)).elements[0];assert.equal(recovered.type,'photo');assert.deepEqual({...geometry(recovered),id:expected.id},expected);
 // A slow upload cannot overwrite the story selected in the meantime.
 await page.evaluate(()=>{const decode=window.createImageBitmap;window.createImageBitmap=async(...args)=>{await new Promise(resolve=>window.releaseUpload=resolve);return decode(...args);};});
 await page.locator('#photo').setInputFiles({name:'slow.png',mimeType:'image/png',buffer:Buffer.from(images[1],'base64')});await page.waitForFunction(()=>typeof window.releaseUpload==='function');await page.locator('.template').nth(0).click();const switched=await draft(page);await page.evaluate(()=>window.releaseUpload());await page.waitForTimeout(200);assert.deepEqual(await draft(page),switched);
 const mobile=await session(true);await mobile.locator('.template').nth(2).tap();
 for(let i=0;i<4;i++){await upload(mobile,i%3);await mobile.locator('#remove-photo').tap();assert.equal((await draft(mobile)).elements[0].src,null);await upload(mobile,(i+1)%3);await mobile.locator('#delete').tap();assert.equal((await draft(mobile)).elements[0].src,null);}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({desktopRemovalCycles:cycles,mobileRemovalCycles:8,directReplacements:true,immediateCanvasPixels:true,frameGeometryAndOrder:true,textPreserved:true,reload:true,undo:true,deletedFrameRecovery:true,slowUploadStorySwitch:true,consoleErrors:errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
