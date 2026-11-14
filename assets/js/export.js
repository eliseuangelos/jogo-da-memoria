/* Exportação: cartas em PDF (vetorial, A4) e desenhos em ZIP de SVGs. Expõe Memoria.openPdf. */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const {DR,CATS,svg}=window.Memoria;

/* ===== Cartas em PDF: só a frente, A4, 3×3 (6,2 × 7,5 cm). Desenhos em VETOR: o SVG é convertido em operadores PDF, no navegador ===== */
const PU='https://eliseuangelos.github.io/jogo-da-memoria/',CMf=28.3465,CWp=6.2*CMf,CHp=7.5*CMf,al=new Map();
let cvx;const tw=(b,z,t)=>{cvx=cvx||document.createElement('canvas').getContext('2d');cvx.font=`${b?'bold ':''}${z}px Helvetica,Arial,sans-serif`;return cvx.measureText(t).width};
const f3=v=>+(+v).toFixed(3),gs=v=>{v=f3(v);if(!al.has(v))al.set(v,'A'+al.size);return al.get(v)};
const HEX=c=>{c=(c||'').trim();if(c=='currentColor')c='#4a3b5c';if(c[0]!='#')return null;if(c.length==4)c='#'+[...c.slice(1)].map(h=>h+h).join('');return[1,3,5].map(i=>f3(parseInt(c.substr(i,2),16)/255))};
const mm=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
const tf=t=>{let m=[1,0,0,1,0,0];for(const[,k,a]of t.matchAll(/(\w+)\(([^)]*)\)/g)){const v=a.trim().split(/[\s,]+/).map(Number);
 if(k=='translate')m=mm(m,[1,0,0,1,v[0],v[1]||0]);
 else if(k=='scale')m=mm(m,[v[0],0,0,v.length>1?v[1]:v[0],0,0]);
 else if(k=='rotate'){const r=v[0]*Math.PI/180,c=Math.cos(r),s=Math.sin(r),x=v[1]||0,y=v[2]||0;m=mm(mm(mm(m,[1,0,0,1,x,y]),[c,s,-s,c,0,0]),[1,0,0,1,-x,-y])}}
 return m.map(v=>+v.toFixed(5)).join(' ')};
const ell=(x,y,a,b)=>{const u=a*.5523,v=b*.5523;return `${x+a} ${y} m ${x+a} ${y+v} ${x+u} ${y+b} ${x} ${y+b} c ${x-u} ${y+b} ${x-a} ${y+v} ${x-a} ${y} c ${x-a} ${y-v} ${x-u} ${y-b} ${x} ${y-b} c ${x+u} ${y-b} ${x+a} ${y-v} ${x+a} ${y} c h\n`};
const rect=(x,y,w,h,r)=>{r=Math.min(r||0,w/2,h/2);if(!r)return `${x} ${y} ${w} ${h} re\n`;const k=r*.5523,X=x+w,Y=y+h;return `${x+r} ${y} m ${X-r} ${y} l ${X-r+k} ${y} ${X} ${y+r-k} ${X} ${y+r} c ${X} ${Y-r} l ${X} ${Y-r+k} ${X-r+k} ${Y} ${X-r} ${Y} c ${x+r} ${Y} l ${x+r-k} ${Y} ${x} ${Y-r+k} ${x} ${Y-r} c ${x} ${y+r} l ${x} ${y+r-k} ${x+r-k} ${y} ${x+r} ${y} c h\n`};
function arc(x1,y1,rx,ry,ph,fa,fs,x2,y2){ // arco SVG → curvas de Bézier cúbicas
 if(!rx||!ry)return[[x1,y1,x2,y2,x2,y2]];
 rx=Math.abs(rx);ry=Math.abs(ry);const p=ph*Math.PI/180,cp=Math.cos(p),sp=Math.sin(p),dx=(x1-x2)/2,dy=(y1-y2)/2,xp=cp*dx+sp*dy,yp=-sp*dx+cp*dy,l=xp*xp/(rx*rx)+yp*yp/(ry*ry);
 if(l>1){const q=Math.sqrt(l);rx*=q;ry*=q}
 const k=(fa==fs?-1:1)*Math.sqrt(Math.max(0,(rx*rx*ry*ry-rx*rx*yp*yp-ry*ry*xp*xp)/(rx*rx*yp*yp+ry*ry*xp*xp))),cxp=k*rx*yp/ry,cyp=-k*ry*xp/rx,cx=cp*cxp-sp*cyp+(x1+x2)/2,cy=sp*cxp+cp*cyp+(y1+y2)/2;
 const an=(ux,uy,vx,vy)=>Math.atan2(ux*vy-uy*vx,ux*vx+uy*vy),t1=an(1,0,(xp-cxp)/rx,(yp-cyp)/ry);
 let dt=an((xp-cxp)/rx,(yp-cyp)/ry,(-xp-cxp)/rx,(-yp-cyp)/ry);
 if(!fs&&dt>0)dt-=2*Math.PI;else if(fs&&dt<0)dt+=2*Math.PI;
 const N=Math.max(1,Math.ceil(Math.abs(dt)/(Math.PI/2)-1e-9)),d=dt/N,t=4/3*Math.tan(d/4),out=[],P=(u,v)=>[cp*rx*u-sp*ry*v+cx,sp*rx*u+cp*ry*v+cy];
 for(let i=0;i<N;i++){const a1=t1+i*d,a2=a1+d,c1=Math.cos(a1),s1=Math.sin(a1),c2=Math.cos(a2),s2=Math.sin(a2);out.push([...P(c1-t*s1,s1+t*c1),...P(c2+t*s2,s2-t*c2),...P(c2,s2)])}
 return out}
function pd(d){ // dados de caminho SVG → m, l, c, h do PDF
 const T=d.match(/[a-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);let i=0,o='',c='M',x=0,y=0,X=0,Y=0,cx=0,cy=0,pk='';
 const n=()=>+T[i++],cu=(a,b,p,q,r,s)=>{o+=`${f3(a)} ${f3(b)} ${f3(p)} ${f3(q)} ${f3(r)} ${f3(s)} c\n`;cx=p;cy=q;x=r;y=s};
 while(i<T.length){
  if(/[a-z]/i.test(T[i]))c=T[i++];
  const rl=c>'Z',C=c.toUpperCase(),ox=rl?x:0,oy=rl?y:0;
  if(C=='M'){x=n()+ox;y=n()+oy;X=x;Y=y;o+=`${f3(x)} ${f3(y)} m\n`;c=rl?'l':'L'}
  else if(C=='L'){x=n()+ox;y=n()+oy;o+=`${f3(x)} ${f3(y)} l\n`}
  else if(C=='H'){x=n()+ox;o+=`${f3(x)} ${f3(y)} l\n`}
  else if(C=='V'){y=n()+oy;o+=`${f3(x)} ${f3(y)} l\n`}
  else if(C=='C')cu(n()+ox,n()+oy,n()+ox,n()+oy,n()+ox,n()+oy);
  else if(C=='S'){const a=/[CS]/.test(pk)?2*x-cx:x,b=/[CS]/.test(pk)?2*y-cy:y;cu(a,b,n()+ox,n()+oy,n()+ox,n()+oy)}
  else if(C=='Q'||C=='T'){let a,b;if(C=='Q'){a=n()+ox;b=n()+oy}else{a=/[QT]/.test(pk)?2*x-cx:x;b=/[QT]/.test(pk)?2*y-cy:y}
   const r=n()+ox,s=n()+oy,x0=x,y0=y;cu(x0+2/3*(a-x0),y0+2/3*(b-y0),r+2/3*(a-r),s+2/3*(b-s),r,s);cx=a;cy=b}
  else if(C=='A'){const rx=n(),ry=n(),ph=n(),fa=n(),fs=n(),r=n()+ox,s=n()+oy;for(const e of arc(x,y,rx,ry,ph,fa,fs,r,s))cu(...e);x=r;y=s}
  else if(C=='Z'){o+='h\n';x=X;y=Y}
  pk=C}
 return o}
const pesc=t=>t.replace(/[\\()]/g,'\\$&');
function walk(n,S){ // percorre o SVG herdando fill/stroke/opacity e gera os operadores
 const g=a=>n.getAttribute(a),t=n.localName,s={...S};
 for(const k of['fill','stroke','stroke-width'])if(g(k)!=null)s[k]=g(k);
 if(g('opacity')!=null)s.op=S.op*+g('opacity');
 if(t=='svg'||t=='g'){const o=[...n.children].map(c=>walk(c,s)).join(''),tr=g('transform');return tr?`q ${tf(tr)} cm\n${o}Q\n`:o}
 const fc=HEX(s.fill),sc=HEX(s.stroke);if(!fc&&!sc)return'';
 const pre=`q\n${s.op<1?`/${gs(s.op)} gs\n`:''}`,ln=sc?`${sc.join(' ')} RG\n${s['stroke-width']} w 1 J 1 j\n`:'';
 if(t=='text'){ // contorno atrás e preenchimento na frente (paint-order: stroke), em Helvetica-Bold
  const z=+g('font-size'),x=+g('x'),y=+g('y'),tx=n.textContent,w=tw(1,z,tx),x0=g('text-anchor')=='middle'?x-w/2:x,
   T=m=>`BT /F2 ${z} Tf ${m} Tr 1 0 0 -1 ${f3(x0)} ${y} Tm (${pesc(tx)}) Tj ET\n`;
  return pre+(sc?ln+T(1):'')+(fc?`${fc.join(' ')} rg\n`+T(0):'')+'Q\n'}
 const p=t=='path'?pd(g('d')):t=='circle'?ell(+g('cx'),+g('cy'),+g('r'),+g('r')):t=='ellipse'?ell(+g('cx'),+g('cy'),+g('rx'),+g('ry')):t=='rect'?rect(+g('x'),+g('y'),+g('width'),+g('height'),+g('rx')||0):'';
 return p?pre+(fc?`${fc.join(' ')} rg\n`:'')+ln+p+(fc&&sc?'B':fc?'f':'S')+'\nQ\n':''}
function cardForm(k){ // uma carta (moldura, desenho vetorial e nome) em pontos PDF
 const root=new DOMParser().parseFromString(svg(DR[k][1]).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '),'image/svg+xml').documentElement,lb=DR[k][0],sc=5.3*CMf/120;
 let z=18.7;while(tw(1,z,lb)>5.4*CMf&&z>8)z-=.5;
 return `q\n0.29 0.231 0.361 RG 2 w 1 J 1 j\n${rect(1.2,1.2,CWp-2.4,CHp-2.4,11.3)}S\nQ\n`
  +`q ${f3(sc)} 0 0 ${f3(-sc)} ${f3(.45*CMf)} ${f3(CHp-.5*CMf)} cm\n${walk(root,{fill:'#000',stroke:'none','stroke-width':'3',op:1})}Q\n`
  +`q 0.231 0.184 0.29 rg BT /F2 ${z} Tf ${f3((CWp-tw(1,z,lb))/2)} 22 Td (${pesc(lb)}) Tj ET Q\n`}
function openPdf(){$('#pfl').innerHTML=CATS.slice(1).map((c,i)=>`<label><input type="checkbox" value="${i+1}" checked>${c[0]} (${c[2]-c[1]})</label>`).join('');$('#pfs').textContent='';$('#pf').hidden=false}
async function makePdf(){
 const sel=[...$$('#pfl input:checked')].map(i=>CATS[+i.value]),ms=$('#pfs'),bt=$('#pfg');
 if(!sel.length){ms.textContent='Escolha ao menos uma categoria.';return}
 bt.disabled=true;al.clear();
 try{
  const sec=[['Desenhos',[]],['Letras',[]],['Números',[]]],dup=$('#pfp').checked?2:1; // letras e números em páginas próprias
  sel.forEach(([,a,b])=>{for(let k=a;k<b;k++)sec[a>=82?2:a>=56?1:0][1].push(k)});
  const ks=[...new Set(sec.flatMap(q=>q[1]))],fm=[];
  for(const k of ks){fm.push(cardForm(k));ms.textContent=`Preparando cartas… ${fm.length}/${ks.length}`;await new Promise(r=>setTimeout(r))}
  const PW=595.28,PH=841.89,GX=.4*CMf,GY=.4*CMf,X0=(PW-3*CWp-2*GX)/2,Y0=PH-2.75*CMf,P=[];
  sec.forEach(([nm,it])=>{const L=it.flatMap(k=>Array(dup).fill(k));for(let i=0;i<L.length;i+=9)P.push([nm,L.slice(i,i+9)])});
  const parts=[],off=[],NP=P.length,B=6,G0=B+ks.length,base=G0+al.size,total=base+2*NP;let len=0;
  const put=d=>{const b=typeof d=='string'?Uint8Array.from(d,ch=>ch.charCodeAt(0)&255):d;parts.push(b);len+=b.length};
  const obj=(id,dic,bin)=>{off[id]=len;put(`${id} 0 obj\n${dic}\n`);if(bin){put('stream\n');put(bin);put('\nendstream\n')}put('endobj\n')};
  const tx=(f,z,t,x,y)=>`BT /F${f} ${z} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${pesc(t)}) Tj ET\n`,fr='<</F1 3 0 R/F2 4 0 R>>',gsR=[...al].map(([,nm],i)=>`/${nm} ${G0+i} 0 R`).join('');
  const l1='Gerado a partir do site: '+PU,l2='DISTRIBUIÇÃO GRATUITA';
  put('%PDF-1.4\n%âãÏÓ\n');
  obj(1,'<</Type/Catalog/Pages 2 0 R>>');
  obj(2,`<</Type/Pages/Count ${NP}/Kids[${P.map((_,i)=>`${base+2*i} 0 R`).join(' ')}]>>`);
  obj(3,'<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>');
  obj(4,'<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>');
  obj(5,'<</Title(Jogo da Memoria Educativo - Cartas para imprimir)/Author(Eliseu Fernandes Laurindo)/Creator('+PU+')>>');
  ks.forEach((k,i)=>{const b=Uint8Array.from(fm[i],ch=>ch.charCodeAt(0)&255);obj(B+i,`<</Type/XObject/Subtype/Form/BBox[0 0 ${CWp.toFixed(2)} ${CHp.toFixed(2)}]/Resources<</Font${fr}/ExtGState<<${gsR}>>>>/Length ${b.length}>>`,b)});
  [...al.keys()].forEach((v,i)=>obj(G0+i,`<</Type/ExtGState/ca ${v}/CA ${v}>>`));
  P.forEach(([nm,cs],i)=>{
   let c='0.3 g\n'+tx(1,8,`Jogo da Memória Educativo · ${nm} · página ${i+1} de ${NP}`,X0,PH-1.3*CMf);
   cs.forEach((k,j)=>{const r=(j/3)|0,x=X0+(j%3)*(CWp+GX),y=Y0-(r+1)*CHp-r*GY;c+=`q 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} cm /C${k} Do Q\n`});
   c+='0.2 g\n'+tx(1,8,l1,(PW-tw(0,8,l1))/2,1.7*CMf)+tx(2,9,l2,(PW-tw(1,9,l2))/2,1.15*CMf);
   const b=Uint8Array.from(c,ch=>ch.charCodeAt(0)&255),pid=base+2*i;
   obj(pid,`<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${PW} ${PH}]/Contents ${pid+1} 0 R/Resources<</Font${fr}/XObject<<${[...new Set(cs)].map(k=>`/C${k} ${B+ks.indexOf(k)} 0 R`).join('')}>>>>>>`);
   obj(pid+1,`<</Length ${b.length}>>`,b)});
  const xo=len;put(`xref\n0 ${total}\n0000000000 65535 f \n`);
  for(let i=1;i<total;i++)put(String(off[i]).padStart(10,'0')+' 00000 n \n');
  put(`trailer\n<</Size ${total}/Root 1 0 R/Info 5 0 R>>\nstartxref\n${xo}\n%%EOF\n`);
  const u=URL.createObjectURL(new Blob(parts,{type:'application/pdf'})),a=document.createElement('a');
  a.href=u;a.download='jogo-da-memoria-cartas.pdf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),6e4);
  ms.textContent=`PDF pronto: ${NP} páginas com ${ks.length} cartas diferentes, desenhos em vetor.`
 }catch(e){ms.textContent='Não foi possível gerar o PDF neste navegador.'}
 bt.disabled=false}
$('#pfg').onclick=makePdf;

/* ===== Desenhos em SVG num arquivo .zip (formato aberto; .rar é proprietário e não dá para gerar no navegador) ===== */
const CRCT=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc32=b=>{let c=-1;for(let i=0;i<b.length;i++)c=CRCT[(c^b[i])&255]^(c>>>8);return(c^-1)>>>0},u8=t=>new TextEncoder().encode(t);
async function deflate(b){ // deflate bruto (método 8 do ZIP); sem suporte no navegador, grava sem compressão
 try{return new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer())}catch(e){return null}}
async function makeZip(files){
 const parts=[],cd=[],w16=(a,v)=>a.push(v&255,v>>8&255),w32=(a,v)=>a.push(v&255,v>>8&255,v>>16&255,v>>>24&255),d=new Date(),
  dt=(d.getFullYear()-1980)<<9|(d.getMonth()+1)<<5|d.getDate(),tm=d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1;let off=0;
 for(const[nm,b]of files){
  const n=u8(nm),z=await deflate(b),m=z?8:0,data=z||b,crc=crc32(b),h=[],c=[];
  w32(h,0x04034b50);w16(h,20);w16(h,0x0800);w16(h,m);w16(h,tm);w16(h,dt);w32(h,crc);w32(h,data.length);w32(h,b.length);w16(h,n.length);w16(h,0);
  parts.push(new Uint8Array(h),n,data);
  w32(c,0x02014b50);w16(c,20);w16(c,20);w16(c,0x0800);w16(c,m);w16(c,tm);w16(c,dt);w32(c,crc);w32(c,data.length);w32(c,b.length);w16(c,n.length);w16(c,0);w16(c,0);w16(c,0);w16(c,0);w32(c,0);w32(c,off);
  cd.push(new Uint8Array(c),n);off+=h.length+n.length+data.length}
 let cl=0;cd.forEach(x=>cl+=x.length);const e=[];
 w32(e,0x06054b50);w16(e,0);w16(e,0);w16(e,files.length);w16(e,files.length);w32(e,cl);w32(e,off);w16(e,0);
 return new Blob([...parts,...cd,new Uint8Array(e)],{type:'application/zip'})}
async function zipSvg(){
 const sel=[...$$('#pfl input:checked')].map(i=>CATS[+i.value]),ms=$('#pfs'),b1=$('#pfg'),b2=$('#pfz');
 if(!sel.length){ms.textContent='Escolha ao menos uma categoria.';return}
 b1.disabled=b2.disabled=true;
 try{
  const X=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;'),fl=[];
  for(const[nm,a,b]of sel)for(let k=a;k<b;k++){
   const lb=DR[k][0],i=k-82,fn=k>=82?`${i<10?i:(i-9)*10} - ${lb}`:lb;
   fl.push([`${nm}/${fn}.svg`,u8('<?xml version="1.0" encoding="UTF-8"?>\n'+svg(DR[k][1]).replace(' aria-hidden="true"','').replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" color="#4a3b5c" ').replace('>',`><title>${X(lb)}</title>`))])}
  const n=fl.length;
  fl.push(['LEIA-ME.txt',u8(`Desenhos do Jogo da Memória Educativo (SVG)\r\nGerado a partir do site: ${PU}\r\nDISTRIBUIÇÃO GRATUITA\r\n© 2026 Eliseu Fernandes Laurindo. Todos os direitos reservados.\r\n`)]);
  ms.textContent=`Compactando ${n} desenhos…`;
  const u=URL.createObjectURL(await makeZip(fl)),a=document.createElement('a');
  a.href=u;a.download='jogo-da-memoria-desenhos-svg.zip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),6e4);
  ms.textContent=`ZIP pronto: ${n} desenhos em SVG.`
 }catch(e){ms.textContent='Não foi possível gerar o ZIP neste navegador.'}
 b1.disabled=b2.disabled=false}
$('#pfz').onclick=zipSvg;
window.Memoria.openPdf=openPdf;
})();
