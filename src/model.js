import {illustrationLabels} from './illustrations.js';
export const palette=['#A5093C','#FFE6BD','#3F3D32','#9BAF87'];
const [red,cream,ink,sage]=palette;
const copy=[
 ['האוהל האדום','מסורות וסת · 1 מתוך 3','מקום לנוח.\nמקום להיות.','האוהל האדום הוא מרחב עכשווי\nלמפגש, לשיתוף ולהקשבה לגוף.','איזה מרחב את צריכה היום?','red-tent',red,cream],
 ['לא סיפור אחד','מסורות וסת · 2 מתוך 3','מחזור אחד.\nמסורות רבות.','בתרבויות שונות נוצרו מנהגים שונים\nסביב הווסת — ממנוחה ועד הגבלות.\nאין מסורת אחת שמייצגת את כולן.','להקשיב לסיפורים. להשאיר מקום למורכבות.','traditions',cream,red],
 ['המעגל שלנו','מסורות וסת · 3 מתוך 3','את בוחרת\nמה נכון לך.','אפשר ליצור היום מעגל של תמיכה,\nבלי להציג אותו כמנהג עתיק אוניברסלי.','מנוחה · שיחה · בחירה','circle',sage,ink],
 ['כאב ראוי להקשבה','כאב ואנדומטריוזיס · 1 מתוך 3','כאב שמשבית\nראוי לבירור.','אם כאב הווסת פוגע בשגרה שלך,\nמגיע לך שיקשיבו לך ויציעו טיפול.','לא צריך לחכות כדי לבקש עזרה.','pain',cream,red],
 ['מה זה אנדומטריוזיס?','כאב ואנדומטריוזיס · 2 מתוך 3','לתת שם.\nלהתחיל להבין.','באנדומטריוזיס, רקמה דמוית רירית\nהרחם נמצאת מחוץ לרחם. היא עלולה\nלגרום לכאב — אך לא כל כאב הוא אנדו.','התסמינים משתנים מאחת לאחת.','endo',red,cream],
 ['לקראת הבירור','כאב ואנדומטריוזיס · 3 מתוך 3','הסיפור שלך\nחשוב בבירור.','תעדי מתי כואב ואיך זה משפיע עלייך.\nשתפי רופאת נשים, גם אם אולטרסאונד\nתקין — הוא לא שולל אנדומטריוזיס.','כאב פתאומי וחזק או עילפון? פני בדחיפות.','care',ink,cream],
 ['פרוגסטרון והמוח','פרוגסטרון והמוח · 1 מתוך 3','מעבר\nלמערכת הרבייה.','פרוגסטרון פועל גם במערכת העצבים.\nהסקירה מתארת את תפקידיו במוח\nואת הפוטנציאל שלו להגנה ולתיקון.','מה המחקר מציע — ומה עדיין פתוח?','brain',ink,cream],
 ['מסלול נוסף במוח','פרוגסטרון והמוח · 2 מתוך 3','הורמון אחד.\nכמה מסלולים.','אלופרגננולון, תוצר פירוק של פרוגסטרון,\nמווסת קולטני GABA-A המעורבים\nבעיכוב פעילות עצבית.','מנגנון ביולוגי אינו הבטחה לרוגע.','neuro',cream,red],
 ['מחקר, לא הבטחה','פרוגסטרון והמוח · 3 מתוך 3','פוטנציאל\nאינו הבטחה.','הסקירה דנה בהגנה עצבית ובמיאלין —\nהמעטפת המבודדת של סיבי עצב.\nחלק ניכר מהראיות מגיע ממחקרי מעבדה.','אין כאן המלצה לטיפול הורמונלי.','research',sage,ink]
];
export const photoSuggestions=['גב וכתף באור חם','ידיים במנוחה','כתף באור שמש','רגע של מנוחה','עור, אור וצל','מגע עדין','גב באור וצל','ידיים ומרקם טבעי','כתף ובד טבעי'];
function text(id,value,x,y,size,color,font='Assistant',align='right'){
 return {id,type:'text',text:value,x,y,size,color,font,align,opacity:1,animation:'fade'};
}
function panel(id,x,y,width,height,color,opacity=1){return {id,type:'rect',label:'משטח צבע',x,y,width,height,color,opacity,animation:'none'};}
function photograph(index,x,y,width,height){return {id:1,type:'photo',label:photoSuggestions[index],src:null,x,y,width,height,zoom:1,focusX:50,focusY:50,opacity:1,tint:0,tintColor:cream,animation:'zoom',placeholderText:'התצלום שלך כאן',placeholderColor:index%3===0?ink:sage,placeholderInk:index%3===0?cream:ink,placeholderY:index%3===0?.77:.5};}
export const templates=copy.map(([name,tag,title,body,cta,scene,bg,fg],i)=>({name,tag,text:title,bg,ink:fg,accent:fg,scene,index:i}));
export function createStory(index=0){
 const [name,tag,title,body,cta,scene,bg,fg]=copy[index];
 const layout=index%3;
 const s={version:3,title:name,scene,bg,accent:fg,photo:null,overlay:0,duration:8,motion:1,elements:[]};
 // Three editorial compositions recur across the three research series.
 // Image frames, color fields, rules, and every word are independent layers.
 if(layout===0){
  s.elements=[photograph(index,540,645,1080,1290),panel(2,540,1605,1080,630,bg),panel(3,540,285,1080,570,bg,.24),
   text(5,'rona',940,155,64,cream,'Heebo'),text(6,tag,940,260,30,cream),
   text(7,title,940,470,99,cream,'Heebo'),text(8,body,940,1440,42,fg),
   panel(9,540,1602,800,2,fg,.45),text(10,cta,940,1670,31,fg),
   text(11,index>=6?'Schumacher et al. · 2012 | doi: 10.3389/fnins.2012.00010':index>=3?'מידע כללי · אינו תחליף לייעוץ רפואי':'מרחב לשיחה על הגוף, התרבות והבחירה',940,1785,index>=6?23:26,fg),
   text(12,String(index+1).padStart(2,'0')+' / 09',140,155,27,cream,'Assistant','left')];
 }else if(layout===1){
  s.elements=[photograph(index,540,950,1080,1920),panel(2,540,370,1080,740,bg,.96),panel(3,540,1590,1080,660,bg,.96),
   text(5,'rona',940,150,64,fg,'Heebo'),text(6,tag,940,265,30,fg),
   text(7,title,940,475,96,fg,'Heebo'),text(8,body,940,1415,41,fg),
   panel(9,540,1595,800,2,fg,.45),text(10,cta,940,1675,30,fg),
   text(11,index>=6?'Schumacher et al. · 2012 | doi: 10.3389/fnins.2012.00010':index>=3?'מידע כללי · אינו תחליף לייעוץ רפואי':'מרחב לשיחה על הגוף, התרבות והבחירה',940,1785,index>=6?23:26,fg),
   text(12,String(index+1).padStart(2,'0')+' / 09',140,150,27,fg,'Assistant','left')];
 }else{
  s.elements=[photograph(index,500,925,920,710),panel(2,1010,925,140,710,red),
   text(5,'rona',940,150,64,fg,'Heebo'),text(6,tag,940,255,30,fg),
   text(7,title,940,435,94,fg,'Heebo'),text(8,body,940,1435,41,fg),
   panel(9,540,1595,800,2,fg,.45),text(10,cta,940,1670,30,fg),
   text(11,index>=6?'Schumacher et al. · 2012 | doi: 10.3389/fnins.2012.00010':index>=3?'מידע כללי · אינו תחליף לייעוץ רפואי':'מרחב לשיחה על הגוף, התרבות והבחירה',940,1785,index>=6?23:26,fg),
   text(12,String(index+1).padStart(2,'0')+' / 09',140,150,27,fg,'Assistant','left')];
 }
 return s;
}
const color=v=>typeof v==='string'&&/^#[\da-f]{6}$/i.test(v);
const number=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
export const safePhoto=src=>src===null||typeof src==='string'&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(src);
export function validStory(s){
 if(s?.sound&&!(s.sound.kind==='soft-ticks'&&number(s.sound.volume,0,.1)&&Array.isArray(s.sound.times)&&s.sound.times.length<=20&&s.sound.times.every(t=>number(t,0,s.duration))))return false;
 if(!s||s.version!==3||!color(s.bg)||!color(s.accent)||!number(s.duration,3,30)||!number(s.motion,0,2)||!Array.isArray(s.elements)||s.elements.length>50||new Set(s.elements.map(e=>e?.id)).size!==s.elements.length)return false;
 return s.elements.every(e=>e&&Number.isFinite(e.id)&&['text','photo','rect','illustration'].includes(e.type)&&number(e.x,-2160,3240)&&number(e.y,-3840,5760)&&number(e.opacity,0,1)&&(e.delay===undefined||number(e.delay,0,30))&&(e.fadeDuration===undefined||number(e.fadeDuration,.1,5))&&['none','fade','slide','zoom','pan','float','roll','attenuate'].includes(e.animation)&&(e.type==='text'?typeof e.text==='string'&&e.text.length<=2000&&number(e.size,20,200)&&color(e.color)&&['Heebo','Assistant','serif','sans-serif'].includes(e.font)&&['center','left','right'].includes(e.align):number(e.width,2,3240)&&number(e.height,2,5760)&&(e.type==='rect'?color(e.color):e.type==='illustration'?Object.hasOwn(illustrationLabels,e.motif)&&color(e.color)&&color(e.accentColor):safePhoto(e.src)&&typeof e.label==='string'&&e.label.length<=120&&number(e.zoom,1,3)&&number(e.focusX,0,100)&&number(e.focusY,0,100)&&number(e.tint,0,1)&&color(e.tintColor)&&typeof e.placeholderText==='string'&&e.placeholderText.length<=120&&color(e.placeholderColor)&&color(e.placeholderInk)&&number(e.placeholderY,0,1))));
}
// Preserve words and uploaded photographs from the previous editor, never its illustrations.
export function migrateStory(old){
 if(validStory(old)){
  const next=structuredClone(old);
  if(['pills-informed-1','pills-informed-2'].includes(next.scene)&&(next.pillContrastVersion??0)<1){
   for(const e of next.elements)if(e.type==='illustration'&&e.motif==='pill'&&e.animation==='roll'&&e.color.toUpperCase()==='#A5093C'&&e.accentColor.toUpperCase()==='#FFE6BD')e.accentColor='#3F3D32';
   next.pillContrastVersion=1;
  }
  return next;
 }

 // Upgrade earlier photo drafts without requesting missing stock assets.
 if(old?.version===3&&Array.isArray(old.elements)){
  const upgraded=structuredClone(old),defaults=photograph(0,540,960,1080,1920);
  upgraded.elements=upgraded.elements.map(e=>e?.type==='photo'?{...defaults,...e,src:safePhoto(e.src)?e.src:null}:e);
  if(validStory(upgraded))return upgraded;
 }

 if(!old||!Array.isArray(old.elements))return null;
 const index=templates.findIndex(t=>t.scene===old.scene);
 const next=createStory(Math.max(0,index));
 for(const e of old.elements){if(e&&(!e.type||e.type==='text')&&typeof e.text==='string'&&e.text.length<=2000){const target=next.elements.find(n=>n.id===e.id&&n.type==='text');if(target)target.text=e.text;else if(next.elements.length<50&&color(e.color)&&number(e.size,20,200)&&Number.isFinite(e.x)&&Number.isFinite(e.y))next.elements.push({...text(Date.now()+next.elements.length,e.text,e.x,e.y,e.size,e.color),font:['Heebo','Assistant','serif','sans-serif'].includes(e.font)?e.font:'Assistant'});}}
 if(old.photo&&safePhoto(old.photo))next.elements.find(e=>e.type==='photo').src=old.photo;
 return validStory(next)?next:null;
}
