// Original vector illustrations: every motif is an independent editable layer.
export const labels={halo:'הילה',drapery:'בד האוהל',orbit:'קווי הקשבה',synapse:'קשרים עצביים',woman:'אישה מגבה',women:'מעגל נשים',seated:'אישה במנוחה',profile:'צללית אישה',moon:'ירח',rule:'קו מפריד'};
export function drawArt(ctx,e){
 ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.size/800,e.size/800);ctx.fillStyle=e.color;ctx.strokeStyle=e.color;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';
 const path=(d,fill=true)=>{const p=new Path2D(d);fill?ctx.fill(p):ctx.stroke(p);};
 switch(e.shape){
 case 'halo':ctx.beginPath();ctx.ellipse(0,0,340,390,0,0,7);ctx.fill();break;
 case 'moon':path('M 80 -278 A 290 290 0 1 0 80 278 A 310 310 0 0 1 80 -278');break;
 case 'rule':ctx.beginPath();ctx.moveTo(-400,0);ctx.lineTo(400,0);ctx.stroke();break;
 case 'drapery':for(let i=0;i<8;i++)path(`M ${-340+i*97} -390 Q ${-170+i*48} -20 ${-390+i*112} 390`,false);break;
 case 'orbit':for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(0,0,290+i*28,350+i*12,(i-1)*.19,0,7);ctx.stroke();}break;
 case 'synapse':for(let i=0;i<9;i++){const a=i*2.4,x=Math.cos(a)*320,y=Math.sin(a)*340;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(-x/2,y/2,x/2,-y/2,-x,-y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fill();}break;
 case 'women':for(const [x,y,s] of [[-215,25,.7],[215,25,.7],[0,-40,.95]]){ctx.save();ctx.translate(x,y);ctx.scale(s,s);figure(ctx,path);ctx.restore();}break;
 case 'woman':figure(ctx,path);break;
 case 'seated':path('M -95 -235 C -140 -360 90 -370 100 -240 L 90 -145 C 195 -85 200 35 120 100 C 235 105 315 195 320 285 Q 80 350 -220 305 C -320 260 -245 190 -95 170 C -210 90 -180 -50 -105 -115 Z');ctx.save();ctx.strokeStyle='#FFE6BD';path('M -90 -100 Q -125 75 105 130 M -195 230 Q -35 175 175 265',false);ctx.restore();break;
 case 'profile':path('M -180 340 Q -165 170 -70 140 L -55 45 Q -165 20 -150 -110 C -245 -360 165 -420 205 -140 L 245 -40 L 195 -25 Q 205 80 100 85 L 110 145 Q 255 200 290 340 Z');break;
 }ctx.restore();
}
function figure(ctx,path){path('M -100 -180 C -190 -350 170 -385 125 -165 L 110 -100 C 265 -30 235 175 305 360 Q 0 420 -300 360 C -235 160 -260 -40 -115 -100 Z');ctx.save();ctx.strokeStyle='#FFE6BD';ctx.globalAlpha*=.6;path('M -78 -95 Q 0 -30 82 -95 M -100 0 Q -160 180 -195 330 M 100 0 Q 165 180 195 330 M 0 -50 Q -20 140 35 365 M -48 -185 Q -78 -250 -15 -297',false);ctx.restore();}
