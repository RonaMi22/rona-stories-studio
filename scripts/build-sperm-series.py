"""Build the four approved short Stories with native Instagram sticker instructions."""
from pathlib import Path
import base64,json
root=Path(__file__).resolve().parents[1];dest=root/'stories/sperm-survival'
cream='#F3E7DA';ink='#46392F';sand='#D8BEA7';terra='#A45F45'
def text(i,s,x,y,size=48,color=ink,font='Assistant',animation='none',delay=0):
 return dict(id=i,type='text',text=s,x=x,y=y,size=size,color=color,font=font,align='right',opacity=1,animation=animation,delay=delay,fadeDuration=.9)
def photo(file,x,y,w,h,focus=50,animation='none',id=1):
 p=root/file;mime='png' if p.suffix=='.png' else 'jpeg'
 return dict(id=id,type='photo',label='טבלת מעקב אנונימית' if mime=='png' else 'צילום ברישיון Pexels',src=f'data:image/{mime};base64,'+base64.b64encode(p.read_bytes()).decode(),x=x,y=y,width=w,height=h,zoom=1,focusX=50,focusY=focus,opacity=1,tint=0,tintColor=cream,animation=animation,placeholderText='התצלום שלך כאן',placeholderColor=sand,placeholderInk=ink,placeholderY=.5)
def panel(i,x,y,w,h,color,opacity=1):return dict(id=i,type='rect',label='הדגשת יום' if opacity<1 else 'משטח צבע',x=x,y=y,width=w,height=h,color=color,opacity=opacity,animation='none')
def base(i,title,bg=cream,duration=12,motion=0):
 return dict(version=3,title=title,scene=f'sperm-survival-{i}',series='זרע, פוריות ומה שביניהם',bg=bg,accent=ink,photo=None,overlay=0,duration=duration,motion=motion,elements=[])
def interaction(kind,question,options=None):
 return dict(type=kind,question=question,options=options or [],nativeStickerRequired=True,stickerArea=dict(x=150,y=1420,width=780,height=250))
stories=[]
s=base(1,'גם כשיש ילד משותף',motion=1)
s['interaction']=interaction('poll','היית חושבת לבדוק גם את הזרע?',['כן','לא בטוח'])
s['elements']=[photo('stories/red-tent/assets/8070371.jpg',540,290,1080,580,90,'zoom'),text(2,'rona',940,150,54,ink,'Heebo'),text(3,'01 / 04',270,150,26),
 text(4,'משיחה עם עוקבת אתמול\nהבנתי משהו שממש חשוב לי\nלדבר עליו.',940,730,50,ink,'Heebo','fade',.1),
 text(5,'יש לכם כבר ילד משותף?\nזה לא אומר שאין סיבה\nלבדוק גם את הזרע.',940,1000,49,ink,animation='fade',delay=.35),
 text(6,'בעיניי, שווה לדבר על הבדיקה\nמוקדם יותר.',940,1220,49,terra,'Heebo','fade',.6),
 text(7,'היית חושבת לבדוק גם את הזרע?',940,1350,40,ink,'Heebo','fade',.8)]
stories.append(s)
s=base(2,'מה המחקר מצא',duration=14)
s['interaction']=interaction('poll','רוצה שאשלח לך את המחקר בפרטי?',['כן, אשמח','לא כרגע'])
s['interaction']['fulfillment']='manual_dm';s['interaction']['stickerArea']['y']=1410
s['elements']=[photo('stories/red-tent/assets/keen-879486.jpg',540,325,1080,650,92),text(2,'rona',940,150,54,cream,'Heebo'),text(3,'02 / 04',270,150,26,cream),
 text(4,'במחקר תצפיתי נמצא קשר בין\nיותר סוגי מיקרופלסטיק בדגימות\nלבין תנועתיות מתקדמת\nנמוכה יותר של הזרע.',940,830,48),
 text(5,'זה קשר,\nלא הוכחה לסיבה.',940,1120,60,terra,'Heebo'),
 text(6,'אם תרצי שאשלח לך את המחקר,\nכתבי לי בפרטי.',940,1310,47,ink,'Heebo')]
stories.append(s)
s=base(3,'מה הטבלה מספרת',bg='#E9F0EB',duration=14)
s['interaction']=interaction('poll','מאיזה מהם לדעתך?',['יום 11','יום 15','אי אפשר לדעת מהטבלה'])
s['interaction']['stickerArea']=dict(x=150,y=1500,width=780,height=240)
s['chartContext']='The reported pregnancy originated from intercourse on cycle day 11 or 15 according to the user; neither encounter nor exact ovulation is determined from this chart.'
w=860;h=552*w/463;top=350
s['elements']=[photo('stories/sperm-survival/assets/chart-detail.png',540,top+h/2,w,h,id=1),
 text(2,'rona',940,150,54,ink,'Heebo'),text(3,'03 / 04',270,150,26),
 text(4,'ההיריון התחיל מיחסים ביום 11\nאו ביום 15 למחזור.',940,270,51,ink,'Heebo'),
 text(7,'מאיזה מהם לדעתך?',940,1440,46,ink,'Heebo'),
 text(8,'יום 11   ·   יום 15\nאי אפשר לדעת מהטבלה',940,1580,38)]
stories.append(s)
s=base(4,'אם את רוצה להימנע מהיריון',motion=1)
s['interaction']=interaction('question','מה הכי מבלבל אותך לגבי הישרדות זרע והסיכוי להיריון?')
s['interaction']['stickerArea']=dict(x=150,y=1260,width=780,height=220)
s['elements']=[photo('stories/red-tent/assets/11624807.jpg',540,350,1080,700,100,'zoom'),
 text(2,'rona',940,150,54,ink,'Heebo'),text(3,'04 / 04',270,150,26),
 text(4,'רוצה להימנע\nמהיריון?',940,840,78,ink,'Heebo','fade',.1),
 text(5,'מה הכי מבלבל אותך לגבי\nהישרדות זרע והסיכוי להיריון?',940,1110,48,terra,'Heebo','slide',.45),
 text(6,'בפוסט של היום אני מסבירה\nכמה זמן זרע יכול לשרוד בגוף,\nובמה זה תלוי.',940,1575,36,ink,animation='fade',delay=.8)]
stories.append(s)
manifest=[]
for i,s in enumerate(stories,1):
 (dest/'designs'/f'{i:02}.json').write_text(json.dumps(s,ensure_ascii=False,separators=(',',':')))
 revision='full-chart-copy' if i==3 else 'raised'
 manifest.append(dict(id=i,title=s['title'],design=f'designs/{i:02}.json?v={revision}',poster=f'exports/{i:02}.png?v={revision}',video=f'exports/{i:02}.mp4?v={revision}',animated=s['motion']>0,interaction=s['interaction']))
(dest/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Built four approved short Stories with no URLs in exported text')
