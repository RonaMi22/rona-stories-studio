// Exact lossless crops only: never redraw a clinical chart or publish its identifying header.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs/promises'),path=require('node:path');
(async()=>{
 if(!process.argv[2])throw Error('Pass the user-supplied chart image path');
 const source=await fs.readFile(process.argv[2]);
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const page=await browser.newPage();
 const crops=await page.evaluate(async base64=>{
  const img=new Image();img.src='data:image/jpeg;base64,'+base64;await img.decode();
  if(img.width!==1280||img.height!==1036)throw Error('Unexpected chart dimensions; inspect crop coordinates again');
  const crop=(x,y,w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,x,y,w,h,0,0,w,h);return c.toDataURL('image/png').split(',')[1];};
  return {overview:crop(0,177,1257,729),detail:crop(228,177,463,552)};
 },source.toString('base64'));
 const dest=path.resolve(__dirname,'../stories/sperm-survival/assets');await fs.mkdir(dest,{recursive:true});
 for(const [name,data] of Object.entries(crops))await fs.writeFile(path.join(dest,'chart-'+name+'.png'),Buffer.from(data,'base64'));
 await browser.close();console.log('Saved lossless chart crops without calendar dates, cycle identifier, header or footer');
})().catch(e=>{console.error(e);process.exit(1)});
