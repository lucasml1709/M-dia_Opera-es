IMPL.sort((a,b)=>b.k-a.k);
const nf=new Intl.NumberFormat('pt-BR'),n2=new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const M=D.meses,L=M.length-1,sum=a=>a.reduce((s,v)=>s+(v||0),0);
const views=['Geral',...D.ops,'Comparar todas'];let sel='Geral';
const idx=o=>D.ops.indexOf(o);
const lbl={id:'lbl',afterDatasetsDraw(ch){const c=ch.ctx;ch.data.datasets.forEach((ds,i)=>{if(!ds.showLbl)return;ch.getDatasetMeta(i).data.forEach((p,j)=>{const v=ds.data[j];if(v==null)return;c.save();c.font='600 12px Barlow,sans-serif';c.fillStyle=ds.borderColor;c.textAlign='center';c.fillText(n2.format(v),p.x,p.y+(ds.lblBelow?18:-9));c.restore();});});}};
const GRP=['GRANELEIRO - SR RODOTREM','GRANELEIRO BOBINEIRA - SR BITREM','GRANELEIRO GRANEL - SR BITREM'];
const GRP_NAME='GRANELEIRO RODOTREM + BITREM';
let juntar=false;
function rows(){
 if(!juntar)return IMPL.map(r=>({...r}));
 const mem=IMPL.filter(r=>GRP.includes(r.n));
 const k=mem.reduce((s,r)=>s+r.k,0),lit=mem.reduce((s,r)=>s+r.k/r.m,0);
 const out=IMPL.filter(r=>!GRP.includes(r.n)).map(r=>({...r}));
 out.push({n:GRP_NAME,m:k/lit,k:k,grp:mem});
 return out.sort((x,y)=>y.k-x.k);
}
function showDet(){
 const d=document.getElementById('det');
 const st=r=>`<tr class="g"><td>${r.t}</td><td>${nf.format(Math.round(r.k))}</td><td>${n2.format(r.m)}</td><td></td></tr>`;
 const sumOf=(a,t)=>{const k=a.reduce((s,r)=>s+r.k,0),l=a.reduce((s,r)=>s+r.k/r.m,0);return{t,k,m:k/l,n:a.length}};
 const line=(r,mx,cor)=>`<tr><td>${r.n}</td><td>${nf.format(Math.round(r.k))}</td><td>${n2.format(r.m)}</td><td class="bar"><i style="width:${r.k/mx*100}%${cor?';background:'+cor:''}"></i></td></tr>`;
 const head='<div class="tw" style="margin-top:10px"><table><thead><tr><th>Implemento</th><th>Km rodado</th><th>Média (km/l)</th><th></th></tr></thead><tbody>';
 const btn=`<div style="display:flex;gap:8px;flex-wrap:wrap"><button id="fj" aria-pressed="${juntar}" style="${juntar?'background:var(--ink);color:var(--bg);border-color:var(--ink)':''}">${juntar?'✓ ':''}Segmentar Rodotrem/Bitrem</button><button id="fx">Fechar</button></div>`;
 const title=`<h2>Carga Seca – ${M[L]}: detalhe por implemento</h2>`;
 const ord=IMPL.slice().sort((x,y)=>y.k-x.k),mx=Math.max(...ord.map(r=>r.k));
 if(!juntar){
  const T=sumOf(ord,'Total');
  d.innerHTML=`<div class="hd2"><div>${title}<p class="hint">${nf.format(Math.round(T.k))} km · média ${n2.format(T.m)} km/l · ${ord.length} implementos</p></div>${btn}</div>${head}${ord.map(r=>line(r,mx)).join('')}${st(T)}</tbody></table></div>`;
 }else{
  const G=ord.filter(r=>GRP.includes(r.n)),O=ord.filter(r=>!GRP.includes(r.n));
  const sg=sumOf(G,'Rodotrem + Bitrem'),so=sumOf(O,'Demais implementos');
  const rw=r=>`<tr><td>${r.n}</td><td>${nf.format(Math.round(r.k))}</td><td>${n2.format(r.m)}</td></tr>`;
  const panel=(x,c,list)=>`<div style="border:1px solid var(--line);border-top:4px solid ${c};border-radius:6px;padding:14px 16px;margin-top:12px">
   <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
    <div><h2 style="margin:0">${x.t}</h2><p class="hint">${x.n} implementos</p></div>
    <div style="display:flex;gap:12px;text-align:right"><div style="border:1px solid var(--line);border-radius:6px;padding:6px 14px"><b style="display:block;font:700 30px/1.1 'Barlow Condensed',sans-serif">${nf.format(Math.round(x.k))}</b><span class="hint">km rodado</span></div><div style="border:1px solid var(--line);border-radius:6px;padding:6px 14px"><b style="display:block;font:700 30px/1.1 'Barlow Condensed',sans-serif;color:${c}">${n2.format(x.m)}</b><span class="hint">média km/l</span></div></div>
   </div>
   <div class="tw" style="margin-top:8px"><table><thead><tr><th>Implemento</th><th>Km rodado</th><th>Média (km/l)</th></tr></thead><tbody>${list.map(rw).join('')}</tbody></table></div></div>`;
  d.innerHTML=`<div class="hd2"><div>${title}<p class="hint">Médias separadas: Rodotrem + Bitrem × demais implementos</p></div>${btn}</div>
  ${panel(sg,'var(--c1)',G)}${panel(so,'var(--c0)',O)}`;
 }
 d.classList.add('on');
 document.getElementById('fx').onclick=()=>d.classList.remove('on');
 document.getElementById('fj').onclick=()=>{juntar=!juntar;showDet();};
 d.scrollIntoView({behavior:'smooth',block:'nearest'});
}
const isCS=(ch,e)=>{const h=ch.getElementsAtEventForMode(e,'nearest',{intersect:true},false)[0];return h&&ch.data.datasets[h.datasetIndex].label==='Carga Seca'&&h.index===L};
function kpis(){
 const o=D.km[sel]?sel:'Geral',km=D.km[o],md=D.med[o];
 const lit=sum(km.map((k,j)=>k?k/md[j]:0));
 let j=L;while(j>0&&km[j]==null)j--;
 document.getElementById('kpis').innerHTML=[[nf.format(sum(km)),'Km no período'],[n2.format(sum(km)/lit),'Média do período (km/l)'],[nf.format(D.veic[o][j]),'Veículos em '+M[j]]]
 .map(k=>`<div class="card kpi"><b>${k[0]}</b><span>${k[1]}</span></div>`).join('');
}
function render(){
 Chart.defaults.color=css('--mut');Chart.defaults.borderColor=css('--line');Chart.defaults.font.family="Barlow,system-ui,sans-serif";
 Object.values(Chart.instances).forEach(c=>c.destroy());
 const all=sel==='Geral'||sel==='Comparar todas';
 const stackOps=all?D.ops:[sel];
 const base={responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom'}}};
 new Chart('km',{type:'bar',data:{labels:M,datasets:stackOps.map(o=>({label:o,data:D.km[o],backgroundColor:css('--c'+idx(o)),stack:'a'}))},
  options:{...base,onClick:(e,a,ch)=>{if(isCS(ch,e.native))showDet();},onHover:(e,a,ch)=>{e.native.target.style.cursor=isCS(ch,e.native)?'pointer':'default';},scales:{x:{stacked:true},y:{stacked:true,ticks:{callback:v=>nf.format(v)}}},
  plugins:{legend:{display:stackOps.length>1,position:'bottom'},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${nf.format(c.parsed.y||0)} km`}}}}});
 const lines=(sel==='Geral'||sel==='Comparar todas')?[{label:'Geral',o:'Geral',c:css('--geral'),w:4}]:[];
 if(sel==='Comparar todas')D.ops.forEach(o=>lines.push({label:o,o,c:css('--c'+idx(o)),w:2}));
 else if(sel!=='Geral')lines.push({label:sel,o:sel,c:css('--c'+idx(sel)),w:4});
 new Chart('med',{type:'line',data:{labels:M,datasets:lines.map(l=>({label:l.label,data:D.med[l.o],borderColor:l.c,backgroundColor:l.c,borderWidth:l.w,pointRadius:3,tension:.25,showLbl:sel==='Comparar todas'?l.label==='Geral':true,lblBelow:false}))},
  plugins:[lbl],
  options:{...base,layout:{padding:{top:22,bottom:6}},scales:{y:{beginAtZero:true,ticks:{callback:v=>n2.format(v)}}},plugins:{legend:{display:lines.length>1,position:'bottom'},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${n2.format(c.parsed.y)} km/l`}}}}});
 kpis();
 document.getElementById('chips').innerHTML=views.map(v=>`<button class="chip" aria-pressed="${v===sel}" data-v="${v}">${v}</button>`).join('');
}
document.getElementById('chips').addEventListener('click',e=>{const b=e.target.closest('button');if(b){sel=b.dataset.v;render();}});
render();
