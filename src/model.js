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
function text(id,value,x,y,size,color,font='Assistant',align='right'){return {id,type:'text',text:value,x,y,size,color,font,align,opacity:1,animation:'fade'};}
function art(id,shape,x,y,size,color,opacity=1){return {id,type:'art',shape,text:shape,x,y,size,color,font:'Heebo',align:'center',opacity,animation:'breathe'};}
export const templates=copy.map(([name,tag,title,body,cta,scene,bg,fg],i)=>({name,tag,text:title,bg,ink:fg,accent:fg,scene,index:i}));
export function createStory(index=0){
 const [name,tag,title,body,cta,scene,bg,fg]=copy[index];
 const contrasting=bg===red?cream:bg===ink?sage:red;
 return {version:2,title:name,scene,bg,accent:contrasting,photo:null,overlay:25,elements:[
 art(1,'halo',540,1000,800,contrasting,.18),
 art(2,index<3?'drapery':index<6?'orbit':'synapse',540,1000,740,contrasting,.65),
 art(3,index===2?'women':index===3?'seated':index===7?'profile':'woman',540,1000,700,bg===red?ink:bg===ink?red:ink),
 art(4,'moon',index%2?210:840,770,125,bg===ink?cream:red,.9),
 text(5,'rona',930,145,62,fg,'Heebo'),
 text(6,tag,930,250,28,fg),
 text(7,title,930,450,index===1?91:100,fg,'Heebo'),
 text(8,body,930,1460,40,fg),
 art(9,'rule',540,1640,780,fg,.5),
 text(10,cta,930,1710,31,fg,'Assistant'),
 text(11,index>=6?'Schumacher et al. · 2012 | doi: 10.3389/fnins.2012.00010':index>=3?'מידע כללי · אינו תחליף לייעוץ רפואי':'מרחב לשיחה על הגוף, התרבות והבחירה',930,1800,index>=6?23:26,fg),
 text(12,String(index+1).padStart(2,'0')+' / 09',150,150,25,fg,'Assistant','left')
 ]};
}
export const shapes=['halo','drapery','orbit','synapse','woman','women','seated','profile','moon','rule'];
export function validStory(s){return !!s&&/^#[\da-f]{6}$/i.test(s.bg)&&/^#[\da-f]{6}$/i.test(s.accent)&&Number.isFinite(s.overlay)&&s.overlay>=0&&s.overlay<=80&&(s.photo===null||typeof s.photo==='string'&&s.photo.startsWith('data:image/'))&&Array.isArray(s.elements)&&s.elements.length<100&&new Set(s.elements.map(e=>e.id)).size===s.elements.length&&s.elements.every(e=>Number.isFinite(e.id)&&typeof e.text==='string'&&e.text.length<=2000&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.size)&&e.size>=20&&e.size<=(e.type==='art'?1200:200)&&/^#[\da-f]{6}$/i.test(e.color)&&['center','left','right'].includes(e.align)&&['serif','sans-serif','Heebo','Assistant'].includes(e.font)&&(!e.type||['text','art'].includes(e.type))&&(e.type!=='art'||shapes.includes(e.shape))&&(e.opacity===undefined||Number.isFinite(e.opacity)&&e.opacity>=0&&e.opacity<=1)&&(e.animation===undefined||['none','fade','breathe'].includes(e.animation)));}
