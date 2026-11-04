"""Build four approved stories as editable designs for the existing Rona editor."""
from pathlib import Path
import json,base64
root=Path(__file__).resolve().parents[1];dest=root/'stories/red-tent'
cream='#F3E7DA';ink='#46392F';sand='#D8BEA7';terra='#A45F45'
def txt(i,s,x,y,size=45,color=ink,font='Assistant',anim='none',delay=0):
 return dict(id=i,type='text',text=s,x=x,y=y,size=size,color=color,font=font,align='right',opacity=1,animation=anim,delay=delay,fadeDuration=1.1)
def rect(i,x,y,w,h,color,opacity=1):return dict(id=i,type='rect',label='משטח צבע',x=x,y=y,width=w,height=h,color=color,opacity=opacity,animation='none')
def photo(file,x,y,w,h,focus=50,anim='none'):
 return dict(id=1,type='photo',label='צילום ברישיון Pexels',src='data:image/jpeg;base64,'+base64.b64encode((dest/'assets'/file).read_bytes()).decode(),x=x,y=y,width=w,height=h,zoom=1,focusX=50,focusY=focus,opacity=1,tint=0,tintColor=cream,animation=anim,placeholderText='התצלום שלך כאן',placeholderColor=sand,placeholderInk=ink,placeholderY=.5)
def base(i,title,bg,duration,motion):return dict(version=3,title=title,scene=f'red-tent-personal-{i}',bg=bg,accent=ink if bg!=ink else cream,photo=None,overlay=0,duration=duration,motion=motion,elements=[],series='האוהל האדום שלי',interaction=None)
stories=[]
s=base(1,'האוהל שהייתי צריכה',cream,15,1)
s['interaction']={'type':'poll','question':'מה את מכירה?','options':['את הספר','מעגלי נשים','מסורת עתיקה','לא מכירה'],'nativeStickerRequired':True}
s['elements']=[photo('keen-879486.jpg',540,310,1080,620,85,'zoom'),txt(3,'rona',940,150,54,cream,'Heebo'),txt(4,'01 / 04',270,150,26,cream),
 txt(5,'אחרי הלידה הראשונה שלי',940,725,56,ink,'Heebo','fade',.15),
 txt(6,'הייתי ביוהנסבורג.\nכמעט לא הכרתי נשים,\nוהמשפחה הייתה רחוקה ממני.\nהייתי מאוד לבד.',940,920,47,ink,anim='fade',delay=.35),
 txt(7,'רציתי מישהי שתבין מה אני עוברת,\nבכל מובן. שתיקח ממני את התינוק\nותיתן לי קצת שקט.',940,1200,47,ink,anim='fade',delay=.65),
 txt(8,'הייתי שמחה שיהיה לי אז\nאיזה ״אוהל אדום״.',940,1420,49,terra,'Heebo','fade',.9),
 txt(9,'מה את מכירה?',940,1570,40,ink,'Heebo','fade',1.2),
 rect(10,735,1660,410,62,'#E2CCB8'),rect(11,305,1660,410,62,'#E2CCB8'),rect(12,735,1744,410,62,'#E2CCB8'),rect(13,305,1744,410,62,'#E2CCB8'),
 txt(14,'את הספר',900,1660,33),txt(15,'מעגלי נשים',470,1660,33),txt(16,'מסורת עתיקה',900,1744,33),txt(17,'לא מכירה',470,1744,33)]
stories.append(s)
s=base(2,'למה הרעיון מושך אותי',cream,15,0)
s['elements']=[photo('8070371.jpg',540,415,1080,830,88),txt(2,'rona',940,150,54,ink,'Heebo'),txt(3,'02 / 04',270,150,26,ink),
 txt(4,'כשאני חושבת על מה\nשהיה חסר לי אז,',940,950,58,ink,'Heebo'),
 txt(5,'אני מבינה למה הרעיון\nשל האוהל האדום מושך אותי.',940,1125,46),
 txt(6,'בספר של אניטה דיאמנט יש מרחב נשי\nשל מפגש והעברת ידע.\nזה רומן, לא תיעוד היסטורי.',940,1350,45),
 rect(7,890,1510,100,3,terra),txt(8,'אני לא יודעת אם היה מקום\nכמו זה שבספר.\nאני יודעת שהייתי צריכה\nמקום להיתמך בו.',940,1660,46,terra,'Heebo')]
stories.append(s)
s=base(3,'מה שלא נכנס לספרים',ink,15,0)
s['elements']=[photo('11624807.jpg',540,1450,1080,940,100),rect(2,540,960,1080,100,ink),txt(3,'rona',940,150,54,cream,'Heebo'),txt(4,'03 / 04',270,150,26,cream),
 txt(5,'ומה עם כל מה\nשלא נכנס לספרים?',940,355,66,cream,'Heebo'),
 txt(6,'לנשים רבות לא הייתה אפשרות\nלכתוב את מה שידעו וחוו.\nידע עבר בשיחה ובעשייה משותפת,\nוחלקו אולי אבד.',940,620,44,cream),
 txt(7,'זה לא מוכיח שהיה אוהל אדום.',940,825,44,sand,'Heebo'),
 rect(8,540,1415,940,180,cream,.95),
 txt(9,'אבל ההיסטוריה שאנחנו מכירות\nהיא גם מה שמישהו בחר לתעד,\nומה שהצליח לשרוד.',940,1415,45,ink,'Heebo')]
stories.append(s)
s=base(4,'האוהל האדום שלך',cream,13,1)
s['interaction']={'type':'question','question':'מה היית צריכה באותו רגע?','nativeStickerRequired':True}
s['elements']=[photo('keen-879486.jpg',540,470,1080,940,100,'zoom'),txt(3,'rona',940,150,54,cream,'Heebo'),txt(4,'04 / 04',270,150,26,cream),
 txt(5,'לפעמים אנחנו מוצאות תמיכה גם\nבקבוצת ווטסאפ או בשיחה ברשת.\nמישהי שמבינה, שאפשר לשאול\nאותה ולשתף.',940,1090,46,ink,anim='fade',delay=.2),
 txt(6,'ולפעמים צריך גם מישהי\nשתהיה שם בגוף.\nשתיקח את התינוק\nותיתן קצת שקט.',940,1370,48,terra,'Heebo','fade',.7),
 txt(7,'מתי לאחרונה הרגשת שאת זקוקה\nלאוהל האדום שלך?',940,1620,47,ink,'Heebo','slide',1.3),
 rect(8,540,1750,800,95,'#E2CCB8'),txt(9,'מה היית צריכה באותו רגע?',900,1750,36,ink,anim='fade',delay=1.7)]
stories.append(s)
manifest=[]
for i,s in enumerate(stories,1):
 (dest/'designs'/f'{i:02}.json').write_text(json.dumps(s,ensure_ascii=False,separators=(',',':')))
 manifest.append(dict(id=i,title=s['title'],design=f'designs/{i:02}.json',poster=f'exports/{i:02}.png',video=f'exports/{i:02}.mp4',animated=s['motion']>0,interaction=s['interaction']))
(dest/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Built four fully populated editable designs')
