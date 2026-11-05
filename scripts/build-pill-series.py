"""Four approved Stories. Research facts supplied by the user; see RESEARCH.md."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1];dest=root/'stories/pills'
red='#A5093C';cream='#FFE6BD';ink='#3F3D32';sage='#9BAF87'
def t(i,s,x,y,size=44,color=ink,font='Assistant',animation='none',delay=0):return dict(id=i,type='text',text=s,x=x,y=y,size=size,color=color,font=font,align='right',opacity=1,animation=animation,delay=delay,fadeDuration=1)
def a(i,motif,x,y,w,h,color=red,accent=cream,animation='float',delay=0):return dict(id=i,type='illustration',label=motif,motif=motif,x=x,y=y,width=w,height=h,color=color,accentColor=accent,opacity=1,animation=animation,delay=delay,fadeDuration=1)
def base(i,title,bg,duration,interactive):return dict(version=3,title=title,scene=f'pills-informed-{i}',series='גלולות והסכמה מדעת',bg=bg,accent=ink if bg==cream else cream,photo=None,overlay=0,duration=duration,motion=1,lockInteractiveText=interactive,elements=[],interaction=None)
def poll(q,opts,y=1450,h=240):return dict(type='poll',question=q,options=opts,nativeStickerRequired=True,stickerArea=dict(x=150,y=y,width=780,height=h))
stories=[]
s=base(1,'מי כאן לקחה גלולות?',cream,16,True)
s['interaction']=poll('מה הניסיון שלך עם גלולות?',['לוקחת היום','לקחתי בעבר','מעולם לא לקחתי','שוקלת לקחת'],1420,300)
s['elements']=[a(1,'blister',210,790,170,300,sage,ink),a(2,'pill',285,670,74,74,red,cream,'roll'),t(3,'מי כאן לקחה גלולות\nלמניעת היריון?',940,290,66,red,'Heebo'),t(4,'אני לקחתי גלולות',940,510,49),t(5,'מגיל 16 ועד גיל 33.',940,635,76,red,'Heebo'),t(6,'במשך שנים זה היה\nחלק מהשגרה שלי.',940,930,47),t(7,'רק מאוחר יותר התחלתי להבין\nעד כמה הגלולות משפיעות על\nהמערכת ההורמונלית שלנו.',940,1150,46),t(8,'מה הניסיון שלך עם גלולות?',940,1350,42,ink,'Heebo')]
stories.append(s)
s=base(2,'גלולות ואכילה רגשית',cream,22,True)
s['interaction']=poll('הרגשת שינוי בתיאבון או באכילה עם גלולות?',['כן!','לא שמתי לב'],1490,225)
s['sound']=dict(kind='soft-ticks',volume=.018,times=[.9,1.8])
s['research']=dict(title='Combined Oral Contraceptive Use and Binge Eating',authors='Klump KL et al.',doi='10.1001/jamanetworkopen.2026.19047',source='https://pmc.ncbi.nlm.nih.gov/articles/PMC13276626/',verification='Detailed study data supplied and marked verified by user; direct full-text access was blocked in this environment.',participants=422,days=49,design='observational',population='monophasic combined oral contraceptive users')
s['elements']=[t(1,'גלולות ואכילה רגשית.\nיש קשר?',940,285,67,red,'Heebo'),t(2,'מחקר שפורסם ביוני 2026 עקב אחרי\n422 נשים במשך 49 ימים.',940,515,43),t(3,'בימים עם גלולות משולבות פעילות,\nציוני האכילה הרגשית היו גבוהים יותר\nלעומת ימים עם גלולות ללא הורמונים.',940,740,42),t(4,'והחלק המעניין?',940,920,43,red,'Heebo'),t(5,'הקשר נשאר גם לאחר התחשבות\nברגשות שליליים.',940,1035,43),t(6,'מחקר תצפיתי. נמצא קשר,\nלא הוכחה לסיבתיות.',940,1165,32),a(7,'chocolate',185,1270,75,100,ink,cream),a(8,'pill',425,1270,100,100,red,cream,'roll'),a(9,'pill',725,1270,100,100,sage,ink,'float'),t(10,'פעילה',475,1330,27),t(11,'ללא הורמונים',820,1330,27),t(12,'הרגשת שינוי בתיאבון\nאו באכילה עם גלולות?',940,1410,40,red,'Heebo'),t(13,'Klump et al., JAMA Network Open, 2026',940,1770,25)]
stories.append(s)
s=base(3,'מה הגלולות עושות למחזור?',ink,24,False)
s['elements']=[t(1,'הגלולות לא ״מסדרות״\nאת המחזור.',940,285,64,cream,'Heebo'),a(2,'signal',520,530,320,90,sage,cream,'attenuate'),a(3,'brain',250,515,150,150,cream,sage,'float'),a(4,'ovaries',790,515,170,150,cream,sage,'float'),a(5,'blister',520,530,85,145,red,cream,'slide',.4),t(6,'מוח',300,640,27,cream),t(7,'ביוץ בהפסקה',900,640,27,cream),t(8,'גלולות משולבות מדכאות את הביוץ\nדרך השפעה על התקשורת ההורמונלית\nבין המוח לשחלות.',940,830,42,cream,animation='fade',delay=.15),t(9,'הדימום בהפסקה הוא בדרך כלל\nדימום נסיגה, לא וסת בעקבות ביוץ.',940,1050,42,cream,animation='fade',delay=.5),t(10,'הן יכולות להפחית כאבי וסת ודימומים.\nהקלה בתסמינים לא בהכרח אומרת\nשהגורם שיצר אותם נפתר.',940,1275,42,cream,animation='fade',delay=.8),t(11,'פחות כאב זה חשוב.\nלהבין למה היה כאב, חשוב לא פחות.',940,1510,44,cream,'Heebo','fade',1.1),t(12,'גלולות הן טיפול מועיל גם במצבים גינקולוגיים מסוימים.\nלא כל כאב וסת מעיד על מחלה.',940,1725,29,cream)]
stories.append(s)
s=base(4,'אני בעד לדעת',cream,24,True)
s['interaction']=dict(type='question',question='מה היית רוצה שיסבירו לך לפני שנתנו לך גלולות?',options=[],nativeStickerRequired=True,stickerArea=dict(x=150,y=1380,width=780,height=245))
s['elements']=[a(1,'blister',220,145,80,130,red,cream),a(2,'signal',425,145,100,65,sage,red),a(3,'book',625,145,90,95,ink,cream),a(4,'heart',825,145,55,55,red,cream),t(5,'אני לא נגד גלולות.\nאני בעד לדעת.',940,335,65,red,'Heebo'),t(6,'אני בעד שנשים יוכלו לבחור\nמה מתאים להן.\nאבל בחירה אמיתית דורשת מידע.',940,570,43),t(7,'לדעת מה הגלולות עושות לביוץ,\nלדימום, לכאבים, למצב הרוח\nואולי גם להתנהגות האכילה.',940,790,43),t(8,'לדעת מה היתרונות, מה הסיכונים\nומה האפשרויות האחרות.',940,990,43),t(9,'כי הגוף שלנו ראוי ליותר מאשר\n״קחי גלולות והכול יסתדר״.',940,1160,43,red,'Heebo'),t(10,'מה היית רוצה שיסבירו לך\nלפני שנתנו לך גלולות?',940,1315,40,ink,'Heebo'),t(11,'רונה מריאמי | מודעות לפוריות',940,1710,29)]
stories.append(s)
manifest=[]
for i,s in enumerate(stories,1):
 assert len(s['elements'])<=50
 (dest/'designs'/f'{i:02}.json').write_text(json.dumps(s,ensure_ascii=False,indent=2))
 manifest.append(dict(id=i,title=s['title'],design=f'designs/{i:02}.json',poster=f'exports/{i:02}.png',video=f'exports/{i:02}.mp4',animated=True,interaction=s['interaction']))
(dest/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Built exactly four complete editable pill Stories')
