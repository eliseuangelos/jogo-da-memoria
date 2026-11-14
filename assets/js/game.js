/* Jogo da Memória: estado, cartas, sons, voz, recordes, placar e interface (menu, ajuda, modais). */
(()=>{'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const {DR,CATS,svg,openPdf}=window.Memoria;

/* ===== Utilidades, estado e recordes (localStorage, sem dados pessoais) ===== */
const pad=v=>String(v).padStart(2,'0'),fmt=s=>pad(s/60|0)+':'+pad(s%60);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a}; // Fisher-Yates
const say=t=>$('#live').textContent=t;
let n=8,cat=0,st=null,sOn=true,AC,prev='',raf=0;
const LS='memoria-pares-v1',Z=()=>({g:0,p:0,mx:0,rv:0,t:{},a:{}});
const rd=()=>{try{return{...Z(),...JSON.parse(localStorage.getItem(LS))}}catch(e){return Z()}};
const wr=r=>{try{localStorage.setItem(LS,JSON.stringify(r))}catch(e){}};

/* ===== Sons sintetizados (Web Audio), iniciados só após um clique ===== */
function tone(f,d=.12,ty='sine',v=.07,at=0){if(!sOn)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();AC.resume();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+at;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
const FX={flip:()=>tone(520,.08,'triangle'),ok:()=>{tone(660,.12);tone(880,.2,'sine',.07,.1)},no:()=>tone(170,.25,'sawtooth',.04),rv:()=>[440,660,990].forEach((f,i)=>tone(f,.15,'sine',.07,i*.1)),win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.28,'triangle',.08,i*.14))};

/* ===== Voz em português do Brasil (Web Speech): fala o nome só ao achar o par ===== */
const SS=window.speechSynthesis,LN='á bê cê dê é éfe gê agá i jóta cá éle ême êne ó pê quê érre ésse tê u vê dáblio xis ípsilon zê'.split(' ');
let vOn=!!SS,vc=null,vu=false;
if(!SS)$('#vz').hidden=true;
const unlockV=()=>{if(vu||!SS)return;vu=true;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;SS.speak(u)}catch(e){}}; // libera a fala no 1º toque (iOS)
function voz(){ // prefere voz pt-BR feminina e natural; senão, a primeira pt-BR
 if(vc)return vc;
 const sc=v=>(/francisca|luciana|maria|vit[oó]ria|fernanda|camila|helo[ií]sa|thalita|giovanna|brenda|leila|google|feminin|\bfemale\b/i.test(v.name)?2:0)+(/natural|neural|online/i.test(v.name)?1:0)-(/daniel|ant[oô]nio|felipe|ricardo|thiago|jorge|masculin|\bmale\b/i.test(v.name)?3:0);
 return vc=SS.getVoices().filter(v=>/pt[-_]BR/i.test(v.lang)).sort((a,b)=>sc(b)-sc(a))[0]||null}
function speak(k){
 if(!SS||!vOn||!sOn)return;
 const u=new SpeechSynthesisUtterance(k>55&&k<82?LN[k-56]:DR[k][0].toLowerCase()),v=voz();
 u.lang='pt-BR';if(v)u.voice=v;u.rate=.9;u.pitch=1.15;
 if(SS.speaking||SS.pending){SS.cancel();setTimeout(()=>SS.speak(u),60)}else SS.speak(u)}

/* ===== Tela de configuração ===== */
$('#cats').innerHTML=CATS.map((c,i)=>`<button data-c="${i}">${c[0]}</button>`).join('');
$('#nums').innerHTML=Array.from({length:56},(_,i)=>`<button data-n="${i+1}">${pad(i+1)}</button>`).join('');
function upd(){
 const pool=CATS[cat][2]-CATS[cat][1],r=rd();
 $$('#cats button').forEach((x,i)=>x.setAttribute('aria-pressed',i==cat));
 $$('#nums button').forEach((x,i)=>{x.setAttribute('aria-pressed',i+1==n);x.style.opacity=i<pool?1:.4});
 $('#pre').textContent=n>pool?`Esta categoria tem só ${pool} opções. Escolha até ${pool} pares.`:`${n} pares = ${2*n} cartas`;
 $('#go').disabled=n>pool;
 $('#rec').textContent=`Partidas: ${r.g} · Pares encontrados: ${r.p} · Maior jogo: ${r.mx} pares · Revelações usadas: ${r.rv} · Recorde de ${n} pares: `+(r.t[n]!=null?`${fmt(r.t[n])} e ${r.a[n]} tentativas`:'sem registro')}
$('#cats').onclick=e=>{const b=e.target.closest('button');if(b){cat=+b.dataset.c;upd()}};
$('#nums').onclick=e=>{const b=e.target.closest('button');if(b){n=+b.dataset.n;upd()}};
$('#clr').onclick=()=>{if(confirm('Apagar todos os recordes?')){wr(Z());upd()}};

/* ===== Partida ===== */
function start(){
 const[,a,b]=CATS[cat];if(n>b-a)return;
 let deck,key;
 do{deck=shuffle(shuffle(Array.from({length:b-a},(_,i)=>a+i)).slice(0,n).flatMap(k=>[k,k]));key=deck.join()}while(key==prev&&n>1);
 prev=key;if(st)clearInterval(st.iv);
 st={deck,n,els:[],open:[],lock:false,found:0,tries:0,t0:0,iv:0,over:false,sec:0,rv:0,saved:false};
 const g=$('#grid');
 g.innerHTML=deck.map((k,i)=>`<button class="card" id="c${i}" data-i="${i}" aria-label="Carta ${i+1} virada para baixo"><span class="in"><span class="f bk">?</span><span class="f fr">${svg(DR[k][1])}<b>${DR[k][0]}</b></span></span></button>`).join('');
 st.els=[...g.children];
 $('#setup').hidden=true;$('#game').hidden=false;document.body.classList.add('ing');$('#win').hidden=true;
 hud();layout();say(`Jogo iniciado: ${n} pares, ${2*n} cartas.`)}
function hud(){const s=st,p=Math.round(s.found/s.n*100);
 $('#tm').textContent=fmt(s.sec);$('#tr').textContent=s.tries;$('#pr').textContent=pad(s.found)+'/'+pad(s.n);$('#rm').textContent=(s.n-s.found)*2;
 $('#rc').textContent=s.rv;$('#pg i').style.width=p+'%';$('#pg').setAttribute('aria-valuenow',p)}
const show=(s,i,on)=>{const e=s.els[i];e.classList.toggle('on',on);e.setAttribute('aria-label',on?DR[s.deck[i]][0]+', carta aberta':`Carta ${i+1} virada para baixo`)};
function flip(i){
 const s=st;if(!s||s.lock||s.over||s.els[i].classList.contains('on'))return;
 if(!s.t0){s.t0=Date.now();s.iv=setInterval(()=>{s.sec=(Date.now()-s.t0)/1000|0;$('#tm').textContent=fmt(s.sec)},250)}
 show(s,i,true);FX.flip();unlockV();s.open.push(i);
 if(s.open.length<2)return;
 const[a,b]=s.open;s.tries++;s.lock=true; // bloqueia novas seleções durante a comparação
 if(s.deck[a]==s.deck[b]){
  s.open=[];s.found++;[a,b].forEach(j=>s.els[j].classList.add('done'));
  setTimeout(()=>{FX.ok();s.lock=false;setTimeout(()=>{if(st===s)speak(s.deck[a])},350)},450);say('Par encontrado: '+DR[s.deck[a]][0]);
  if(s.found==s.n){s.over=true;clearInterval(s.iv);s.sec=(Date.now()-s.t0)/1000|0;setTimeout(()=>win(s),1000)}
 }else{
  [a,b].forEach(j=>s.els[j].classList.add('bad'));setTimeout(FX.no,350);say('Cartas diferentes. Tente de novo!');
  setTimeout(()=>{[a,b].forEach(j=>{s.els[j].classList.remove('bad');show(s,j,false)});s.open=[];s.lock=false},1100)}
 hud()}
$('#grid').onclick=e=>{const b=e.target.closest('.card');if(b)flip(+b.dataset.i)};
$('#rv').onclick=()=>{const s=st;if(!s||s.lock||s.over)return;s.rv++;{const r=rd();r.rv++;wr(r)}hud();
 s.open.forEach(j=>show(s,j,false));s.open=[];
 const left=[...new Set(s.deck.filter((k,i)=>!s.els[i].classList.contains('done')))],k=left[Math.random()*left.length|0],ix=s.deck.flatMap((v,i)=>v==k?[i]:[]);
 s.lock=true;FX.rv();say('Revelando: '+DR[k][0]);
 ix.forEach(j=>{show(s,j,true);s.els[j].classList.add('hint')});
 setTimeout(()=>{ix.forEach(j=>{s.els[j].classList.remove('hint');show(s,j,false)});s.lock=false},2500)};
function win(s){
 if(st!==s)return;
 const r=rd();r.g++;r.p+=s.n;r.mx=Math.max(r.mx,s.n);
 const q=!s.rv,nt=q&&!(r.t[s.n]<=s.sec),na=q&&!(r.a[s.n]<=s.tries);
 if(nt)r.t[s.n]=s.sec;if(na)r.a[s.n]=s.tries;wr(r);
 $('#ws').innerHTML=`Tempo: <b>${fmt(s.sec)}</b> · Tentativas: <b>${s.tries}</b> · Revelações: <b>${s.rv}</b><br>Pares encontrados: <b>${s.n}</b><br>${nt||na?'Novo recorde pessoal!':'Você tem uma ótima memória!'}`;
 $('#nf').hidden=!!s.rv;$('#nm').value='';$('#ns').textContent=s.rv?'Partidas com REVELAR não entram no placar.':'';$('#win').hidden=false;$('#ng2').focus();FX.win();confetti();say('Parabéns! Você encontrou todos os pares.')}
function confetti(){const c=['#2563EB','#0B7E82','#1D4263','#83B4FF','#68CBC2'];
 for(let i=0;i<50;i++){const d=document.createElement('i');d.className='cf';d.style.cssText=`left:${Math.random()*100}vw;background:${c[i%5]};animation-delay:${Math.random()*.8}s;animation-duration:${2+Math.random()*2}s`;document.body.appendChild(d);setTimeout(()=>d.remove(),5000)}}
function menu(){if(st)clearInterval(st.iv);if(SS)SS.cancel();st=null;$('#win').hidden=true;$('#game').hidden=true;$('#setup').hidden=false;document.body.classList.remove('ing');cm();$$('.cf').forEach(x=>x.remove());upd()}
$('#ng').onclick=$('#ng2').onclick=menu;$('#go').onclick=start;

/* ===== Grade adaptativa: testa combinações de colunas × linhas e escolhe a de maior carta legível.
   Se nenhuma atinge o tamanho mínimo, usa o máximo de colunas legíveis e rola na vertical. ===== */
function layout(){
 const s=st,a=$('#area');if(!s||!a.clientWidth)return;
 const N=s.deck.length,g=a.clientWidth>700?12:8,W=a.clientWidth-2*g,H=a.clientHeight-2*g-2,MAX=170,MIN=34;
 let c=0,w=0,K=1.22,sc=0;
 for(const q of[1.22,1.1,1])for(let k=1;k<=N;k++){ // testa colunas e proporções; fica com a maior carta que cabe sem rolar
  const r=Math.ceil(N/k),f=Math.min((W-(k-1)*g)/k,(H-(r-1)*g)/(r*q),MAX);
  if(f<MIN)continue;
  const v=f*(1-.08*(r*k-N)/k)-Math.abs(k-r)*.01-(1.22-q)*8;
  if(v>sc){sc=v;c=k;w=f;K=q}}
 if(!c){c=Math.min(N,Math.max(1,Math.floor((W+g)/(66+g))));w=Math.min(MAX,(W-(c-1)*g)/c);K=1.22} // nem pequena cabe: rola
 w=Math.floor(w);
 const G=$('#grid');G.classList.toggle('mini',w<64);
 G.style.cssText=`--c:${c};--w:${w}px;--h:${Math.floor(w*K)}px;--g:${g}px`} // só CSS: não embaralha nem reinicia nada
new ResizeObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(layout)}).observe($('#area'));

/* ===== Placar: 10 melhores por quantidade de pares; partidas com REVELAR ficam de fora ===== */
const PK='memoria-placar-v1',gp=()=>{try{return JSON.parse(localStorage.getItem(PK))||{}}catch(e){return{}}},
esc=t=>t.replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
function showPl(k){
 const b=gp(),ks=Object.keys(b).filter(x=>b[x].length).map(Number).sort((x,y)=>x-y),sl=$('#ps');
 sl.hidden=!ks.length;
 if(!ks.length){$('#pt').innerHTML='<p>Nenhuma partida registrada ainda. Vença sem usar REVELAR e salve seu nome!</p>';return}
 k=ks.includes(k)?k:ks[0];
 sl.innerHTML=ks.map(x=>`<option value="${x}"${x==k?' selected':''}>${x} pares (${b[x].length})</option>`).join('');
 $('#pt').innerHTML='<table><tr><th>#</th><th>Nome</th><th>Tempo</th><th>Tentativas</th></tr>'+b[k].map((e,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||i+1+'º'}</td><td>${esc(e.n)}</td><td>${fmt(e.t)}</td><td>${e.a}</td></tr>`).join('')+'</table>'}
$('#ps').onchange=e=>showPl(+e.target.value);
$('#pc').onclick=()=>{if(confirm('Limpar todo o placar?')){try{localStorage.removeItem(PK)}catch(e){}showPl()}};
$('#nf').onsubmit=e=>{e.preventDefault();const s=st;if(!s||!s.over||s.saved||s.rv)return;
 const b=gp(),L=b[s.n]=b[s.n]||[];L.push({n:($('#nm').value.trim()||'Jogador').slice(0,16),t:s.sec,a:s.tries});
 L.sort((x,y)=>x.t-y.t||x.a-y.a);L.length=Math.min(L.length,10);
 try{localStorage.setItem(PK,JSON.stringify(b))}catch(e){}
 s.saved=true;$('#nf').hidden=true;$('#ns').textContent='Salvo no placar!'};

/* ===== Temas, som, ajuda, créditos ===== */
function cm(){$('#tb').classList.remove('open');$('#mn').setAttribute('aria-expanded','false')}
$('#tb').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(/^(pb|hp|pdf)$/.test(b.id))cm();
 if(b.id=='snd'){sOn=!sOn;b.setAttribute('aria-pressed',sOn);b.querySelector('.tx').textContent=sOn?'Som: sim':'Som: não'}
 else if(b.id=='vz'){vOn=!vOn;b.setAttribute('aria-pressed',vOn);b.querySelector('.tx').textContent=vOn?'Voz: sim':'Voz: não';if(!vOn&&SS)SS.cancel()}
 else if(b.id=='pdf'){openPdf()}
 else if(b.id=='pb'){$('#pl').hidden=false;showPl(st?st.n:n)}else $('#help').hidden=false};
$('#mn').onclick=()=>$('#mn').setAttribute('aria-expanded',$('#tb').classList.toggle('open'));
document.addEventListener('click',e=>{if(!e.target.closest('#tb,#mn'))cm()});
$$('.ov').forEach(o=>o.addEventListener('click',e=>{if((e.target===o&&o.id!='win')||e.target.dataset.x!=null)o.hidden=true}));
document.addEventListener('selectstart',e=>{const t=e.target.nodeType==3?e.target.parentElement:e.target;if(!t||!t.closest('input'))e.preventDefault()});
document.addEventListener('keydown',e=>{if(e.key=='Escape'){cm();$$('.ov:not(#win)').forEach(o=>o.hidden=true)}});
try{if(!localStorage.getItem('memoria-tut')){localStorage.setItem('memoria-tut',1);$('#help').hidden=false}}catch(e){}
upd();
})();
