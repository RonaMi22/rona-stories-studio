export const templates=[
 {name:'רגע של השראה',tag:'EDITORIAL',bg:'#e9e3d8',ink:'#263e35',accent:'#bf795c',text:'הדברים הכי יפים\nמתחילים ברגע\nאחד של השראה.'},
 {name:'משהו חדש בדרך',tag:'ANNOUNCEMENT',bg:'#283f36',ink:'#f5ecdb',accent:'#c8a57a',text:'משהו חדש\nומרגש\nבדרך אליכם.'},
 {name:'פשוט להיות',tag:'MINIMAL',bg:'#e4c6bc',ink:'#653e3b',accent:'#b77363',text:'לקחת נשימה.\nלהאט קצת.\nפשוט להיות.'},
 {name:'בוקר של יצירה',tag:'DAILY NOTES',bg:'#e5e5b9',ink:'#42482e',accent:'#97945a',text:'קפה טוב.\nרעיונות חדשים.\nיום של יצירה.'}
];
export function createStory(index=0){const t=templates[index];return {bg:t.bg,accent:t.accent,photo:null,overlay:25,elements:[{id:1,text:t.text,x:540,y:880,size:100,color:t.ink,align:'center',font:'serif'}]};}
export function validStory(s){return !!s&&/^#[\da-f]{6}$/i.test(s.bg)&&/^#[\da-f]{6}$/i.test(s.accent)&&Number.isFinite(s.overlay)&&s.overlay>=0&&s.overlay<=80&&(s.photo===null||typeof s.photo==='string'&&s.photo.startsWith('data:image/'))&&Array.isArray(s.elements)&&s.elements.length<100&&s.elements.every(e=>typeof e.text==='string'&&e.text.length<=2000&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.size)&&e.size>=20&&e.size<=200&&/^#[\da-f]{6}$/i.test(e.color)&&['center','left','right'].includes(e.align)&&['serif','sans-serif'].includes(e.font));}
