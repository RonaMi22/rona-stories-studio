// Original vector artwork. All motifs are independent editable canvas layers.
export const illustrationLabels={blister:'חפיסת גלולות',pill:'גלולה',chocolate:'שוקולד',brain:'מוח',ovaries:'שחלות',signal:'אות הורמונלי',book:'ספר פתוח',heart:'לב'};
export function drawIllustration(ctx,e){
 ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.width/200,e.height/200);ctx.fillStyle=e.color;ctx.strokeStyle=e.accentColor;ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';
 const layerAlpha=ctx.globalAlpha;
 const round=(x,y,w,h,r,fill=true)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);fill?ctx.fill():ctx.stroke();};
 const line=(points)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
 const path=(d,fill=false)=>{const p=new Path2D(d);fill?ctx.fill(p):ctx.stroke(p);};
 switch(e.motif){
 case 'blister':
  round(-79,-96,158,192,18);ctx.globalAlpha*=.3;round(-70,-86,140,172,12,false);ctx.globalAlpha=layerAlpha;
  for(let row=0;row<4;row++)for(let col=0;col<3;col++){ctx.fillStyle=e.accentColor;ctx.globalAlpha=layerAlpha*.18;round(-54+col*40,-67+row*42,27,30,13);ctx.globalAlpha=layerAlpha;ctx.strokeStyle=e.accentColor;ctx.lineWidth=1.4;round(-54+col*40,-67+row*42,27,30,13,false);}break;
 case 'pill':round(-76,-33,152,66,33);ctx.save();ctx.beginPath();ctx.rect(0,-35,80,70);ctx.clip();ctx.fillStyle=e.accentColor;round(-76,-33,152,66,33);ctx.restore();ctx.strokeStyle=e.accentColor;round(-76,-33,152,66,33,false);line([[0,-31],[0,31]]);break;
 case 'chocolate':round(-65,-86,130,172,10);ctx.strokeStyle=e.accentColor;for(let row=0;row<3;row++)for(let col=0;col<2;col++)round(-51+col*57,-70+row*49,44,37,4,false);break;
 case 'brain':path('M 0 -72 C -28 -99 -65 -78 -65 -53 C -94 -47 -94 -5 -77 7 C -97 38 -69 73 -41 67 C -35 97 -3 89 0 72 C 17 94 46 83 49 66 C 81 72 99 40 76 14 C 98 -10 84 -42 64 -48 C 64 -80 27 -96 0 -72 Z',true);ctx.strokeStyle=e.accentColor;path('M 0 -69 L 0 70 M -49 -51 Q -13 -53 -23 -23 Q -63 -25 -53 10 Q -20 0 -22 42 M 38 -57 Q 16 -36 43 -21 Q 68 1 37 15 Q 13 35 40 57');break;
 case 'ovaries':path('M -26 -37 Q 0 -11 26 -37 L 34 10 Q 23 32 9 55 L 8 80 L -8 80 L -9 55 Q -23 31 -34 10 Z',true);ctx.strokeStyle=e.accentColor;ctx.lineWidth=7;path('M -27 -32 C -44 -86 -84 -90 -84 -33 M 27 -32 C 44 -86 84 -90 84 -33');ctx.fillStyle=e.accentColor;ctx.beginPath();ctx.ellipse(-80,-18,19,27,-.5,0,7);ctx.ellipse(80,-18,19,27,.5,0,7);ctx.fill();break;
 case 'signal':ctx.strokeStyle=e.color;ctx.lineWidth=3;ctx.setLineDash([9,11]);path('M -92 0 Q -40 -45 0 0 T 92 0');ctx.setLineDash([]);ctx.fillStyle=e.accentColor;for(const x of [-66,0,66]){ctx.beginPath();ctx.arc(x,0,6,0,7);ctx.fill();}break;
 case 'book':path('M 0 -65 Q -47 -91 -86 -64 L -86 74 Q -38 55 0 80 Q 38 55 86 74 L 86 -64 Q 47 -91 0 -65 Z',true);ctx.strokeStyle=e.accentColor;line([[0,-61],[0,75]]);for(const y of [-30,0,30]){line([[-65,y],[-20,y+8]]);line([[20,y+8],[65,y]]);}break;
 case 'heart':path('M 0 78 C -17 58 -87 10 -87 -28 C -87 -85 -20 -98 0 -51 C 20 -98 87 -85 87 -28 C 87 10 17 58 0 78 Z',true);break;
 }
 ctx.restore();
}
