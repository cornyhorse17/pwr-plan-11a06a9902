(function(){
"use strict";
const DATA=window.APP_DATA, PLOT=window.PLOT;
const $=s=>document.querySelector(s), el=(t,a={},h="")=>{const e=document.createElement(t);for(const k in a)e.setAttribute(k,a[k]);e.innerHTML=h;return e};
const DAY=864e5, D=s=>new Date(s+"T00:00:00Z"), fmt=d=>d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",timeZone:"UTC"});
const TODAY=D("2026-11-10"), TARGET=D("2026-12-01"), SYNC_BASE=D("2026-12-22"), BASE_LV=D("2026-11-30");
const reduced=()=>window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- theme ---------- */
const root=document.documentElement;
try{const t=localStorage.getItem("theme"); if(t==="light"||t==="dark")root.setAttribute("data-theme",t);}catch(e){}
$("#themeBtn").addEventListener("click",()=>{
  const dark=root.getAttribute("data-theme")?root.getAttribute("data-theme")==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  const next=dark?"light":"dark"; root.setAttribute("data-theme",next); try{localStorage.setItem("theme",next)}catch(e){}
});

/* ---------- tabs ---------- */
const secs=[...document.querySelectorAll("main section")], tabs=$("#tabs");
secs.forEach(s=>tabs.append(el("a",{href:"#"+s.id},s.dataset.tab)));
function show(){const id=(location.hash||"#summary").slice(1), cur=secs.find(s=>s.id===id)||secs[0];
  secs.forEach(s=>s.hidden=s!==cur);window.scrollTo(0,0);
  [...tabs.children].forEach(a=>{const on=a.getAttribute("href")==="#"+cur.id; if(on)a.setAttribute("aria-current","true"); else a.removeAttribute("aria-current");});
  if(cur.id!=="route")stopPlay();}
window.addEventListener("hashchange",show);

/* ---------- plan (critical path) ---------- */
const BASE=DATA.PLAN;
let LAST=null;
function compute(){
  const adj={kegoc:+$("#wKegoc").value, sat:+$("#wSat").value, soak:+$("#wSoak").value};
  const T=BASE.map(x=>({...x})), by={};
  T.forEach(x=>{ if(x.w==="kegoc")x.dur=adj.kegoc; if(x.w==="sat")x.dur+=adj.sat; if(x.w==="soak")x.dur=adj.soak; by[x.id]=x;});
  T.forEach(x=>{let s=D(x.es).getTime(); x.pred.forEach(p=>{s=Math.max(s,by[p].end+DAY)}); x.start=s; x.end=s+(x.dur-1)*DAY;});
  const pr=by.B20; /* backward pass to power receiving */
  [...T].reverse().forEach(x=>{ if(x.post){x.slack=null;return;} const succ=T.filter(y=>!y.post&&y.pred.includes(x.id)); x.lf=x.id==="B20"?pr.end:(succ.length?Math.min(...succ.map(y=>y.lf-(y.dur)*DAY)):pr.start-DAY); x.slack=Math.round((x.lf-x.end)/DAY);});
  const syncLate=new Date(Math.max(SYNC_BASE.getTime(),by.B25.end+22*DAY,by.B26.end+DAY));
  return {T,by,syncLate};
}
function opts(sel,vals,all){sel.innerHTML="";sel.append(el("option",{value:""},all));vals.forEach(v=>sel.append(el("option",{},v)));}
opts($("#fArea"),[...new Set(BASE.map(x=>x.area))],"All areas"); opts($("#fOwn"),[...new Set(BASE.map(x=>x.own))],"All owners");
function renderPlan(){
  LAST=compute(); const {T,by,syncLate}=LAST, pr=by.B20, lv=by.B25;
  const slip=Math.round((pr.start-TARGET)/DAY);
  $("#kpiDate").textContent=fmt(new Date(pr.start))+" 2026";
  const lvLag=Math.round((lv.end-BASE_LV)/DAY);
  $("#kpiText").innerHTML=(slip<=0?"By plan logic power receiving reaches 1 December with <b>no float</b> on the test chain. This is a schedule result; the conditions behind it are not yet evidenced.":"By plan logic power receiving slips <b>"+slip+" days</b> past 1 December.")+
   " 0.4 kV boards live "+fmt(new Date(lv.end))+", "+(lvLag>0?lvLag+" days after":"within")+" the baseline date. Earliest GT11 synchronisation under Option B: 22 Dec only if temporary power carries the work until then and KEGOC approves the export route; otherwise about <b>"+fmt(syncLate)+"</b>.";
  const fa=$("#fArea").value, fo=$("#fOwn").value, fc=$("#fCrit").value, wk=D("2026-11-16").getTime();
  const rows=T.filter(x=>(!fa||x.area===fa)&&(!fo||x.own===fo)&&(fc!=="c"||x.slack===0)&&(fc!=="w"||x.start<=wk));
  const t0=TODAY.getTime(), tEnd=Math.max(...T.map(x=>x.end))+2*DAY, n=Math.round((tEnd-t0)/DAY)+1;
  const g=$("#gantt"); g.innerHTML=""; g.style.setProperty("--day",(100/n)+"%");
  const pos=t=>((t-t0)/DAY)/n*100;
  const head=el("div",{class:"gr head"}); head.append(el("div",{class:"gl label"},"Task and owner")); const ht=el("div",{class:"gt"});
  for(let i=0;i<n;i+=Math.ceil(n/12)){ht.append(el("span",{style:"left:"+pos(t0+i*DAY)+"%"},fmt(new Date(t0+i*DAY))));} head.append(ht); g.append(head);
  rows.forEach(x=>{const r=el("div",{class:"gr"}); r.append(el("div",{class:"gl"},x.t.split(":")[0]+"<small>"+x.id+" · "+x.own+" · "+fmt(new Date(x.start))+(x.dur>1?" to "+fmt(new Date(x.end)):"")+"</small>"));
    const tr=el("div",{class:"gt"}); tr.append(el("div",{class:"today",style:"left:"+pos(t0)+"%"})); tr.append(el("div",{class:"target",style:"left:"+pos(TARGET.getTime())+"%"}));
    tr.append(el("div",{class:"bar"+(x.post?" f":x.slack===0?" c":""),style:"left:"+pos(x.start)+"%;width:"+(x.dur/n*100)+"%",title:x.t})); r.append(tr); g.append(r);});
  const tb=$("#planTbl"); tb.innerHTML="<thead><tr><th>No.</th><th>Task</th><th>Owner</th><th>Start</th><th>End</th><th>After</th><th>Float</th></tr></thead>";
  const body=el("tbody"); rows.forEach(x=>{const tr=el("tr",{class:"row",tabindex:"0","aria-expanded":"false"},"<td class='mono'>"+x.id+"</td><td>"+x.t+"</td><td>"+x.own+"</td><td class='mono'>"+fmt(new Date(x.start))+"</td><td class='mono'>"+fmt(new Date(x.end))+"</td><td class='mono'>"+(x.pred.join(", ")||"–")+"</td><td>"+(x.post?"<span class='chip'>follow-on</span>":x.slack===0?"<span class='chip crit'>critical</span>":"<span class='chip ok'>"+x.slack+" d</span>")+"</td>");
    const d=el("tr",{class:"detail",hidden:""},"<td></td><td colspan='6'><b>Basis:</b> "+x.basis+". <b>Duration:</b> "+x.dur+" day"+(x.dur>1?"s":"")+", assumption, confirm with "+x.conf+". <b>Area:</b> "+x.area+".</td>");
    toggler(tr,d); body.append(tr,d);}); tb.append(body);
  renderModeInfo(); renderSteps();
}
function toggler(tr,d){const tog=()=>{d.hidden=!d.hidden;tr.setAttribute("aria-expanded",String(!d.hidden))}; tr.addEventListener("click",tog); tr.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();tog()}});}
["wKegoc","wSat","wSoak","fArea","fOwn","fCrit"].forEach(i=>$("#"+i).addEventListener("change",renderPlan));

/* ---------- generic filterable table ---------- */
function ftable(tbl,cols,data,filters,detail,countEl){
  const draw=()=>{const rows=data.filter(r=>filters.every(([sel,key])=>!$(sel).value||r[key]===$(sel).value));
    tbl.innerHTML="<thead><tr>"+cols.map(c=>"<th>"+c[0]+"</th>").join("")+"</tr></thead>"; const b=el("tbody");
    rows.forEach(r=>{const tr=el("tr",{class:"row",tabindex:"0","aria-expanded":"false"},cols.map(c=>"<td>"+c[1](r)+"</td>").join("")); const d=el("tr",{class:"detail",hidden:""},"<td colspan='"+cols.length+"'>"+detail(r)+"</td>");
      toggler(tr,d); b.append(tr,d);}); tbl.append(b);
    if(countEl)countEl.textContent=rows.length+" of "+data.length+" items";};
  filters.forEach(([sel])=>$(sel).addEventListener("change",draw)); draw();
}
const CHIP={"No record on file":"crit","Stated complete, records to check":"warn","Open with KEGOC":"crit","Shown in design only":"","Not known":"warn","In progress":"ok","Not connected today":"warn","High":"crit","Medium":"warn","Low":"ok"};
const chip=s=>"<span class='chip "+(CHIP[s]||"")+"'>"+s+"</span>";

const REQ=DATA.REQ, RISK=DATA.RISK;
opts($("#rSys"),[...new Set(REQ.map(r=>r.sys))],"All systems"); opts($("#rStage"),DATA.STAGES,"All stages"); opts($("#rStat"),[...new Set(REQ.map(r=>r.st))],"All statuses");
ftable($("#reqTbl"),[["System",r=>r.sys],["What must be proven",r=>r.item],["Lead",r=>r.who],["Test stage",r=>r.stage],["Status",r=>chip(r.st)]],REQ,[["#rSys","sys"],["#rStage","stage"],["#rStat","st"]],r=>"<b>Gap to close:</b> "+r.gap,$("#rCount"));
opts($("#kTopic"),[...new Set(RISK.map(r=>r.topic))],"All topics");
ftable($("#riskTbl"),[["Topic",r=>r.topic],["Difficulty or limit",r=>"<b>"+r.title+"</b><br><span class='note'>"+r.why+"</span>"],["Severity",r=>chip(r.sev)],["Acts",r=>r.who]],RISK,[["#kTopic","topic"],["#kSev","sev"]],r=>"<b>Mitigation:</b> "+r.mit);
$("#cmpTbl").innerHTML="<thead><tr><th>Dimension</th><th>Option A · 500 kV (baseline, unchanged)</th><th>Option B · 220 kV and autotransformer</th></tr></thead><tbody>"+DATA.CMP.map(r=>"<tr><td>"+r[0]+"</td><td>"+r[1]+"</td><td>"+r[2]+"</td></tr>").join("")+"</tbody>";
$("#decTbl").innerHTML="<thead><tr><th>By</th><th>Decision point</th><th>Who decides</th><th>Why it matters</th></tr></thead><tbody>"+DATA.DEC.map(r=>"<tr><td class='mono'>"+r[0]+"</td><td>"+r[1]+"</td><td>"+r[2]+"</td><td>"+r[3]+"</td></tr>").join("")+"</tbody>";
for(const k in DATA.DEP){$("#deps").append(el("div",{class:"panel"},"<h3>Needed from "+k+"</h3><ul>"+DATA.DEP[k].map(x=>"<li>"+x+"</li>").join("")+"</ul>"));}

/* ---------- route on the plot plan ---------- */
const svg=$("#plot"), NS="http://www.w3.org/2000/svg";
const mk=(t,a,txt)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(txt!=null)e.textContent=txt;return e};
const dOf=pts=>pts.map((p,i)=>(i?"L":"M")+p[0]+","+p[1]).join(" ");
const MODES=PLOT.MODES, MODE_COLOR={a:"var(--optA)",b:"var(--optB)",r:"var(--optR)",t:"var(--optT)"};
const blockEl={}, blockDef={}, wireEl={};
let mode="b", stepIdx=null, playTimer=null, selected=null, flowLayer;

function buildPlot(){
  const defs=mk("defs",{}), pat=mk("pattern",{id:"hatch",width:"8",height:"8",patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"});
  pat.append(mk("line",{x1:0,y1:0,x2:0,y2:8,class:"hatchline"})); defs.append(pat); svg.append(defs);
  svg.append(mk("path",{class:"road",d:"M30,600 L897,600"}));
  svg.append(mk("polygon",{class:"fence",points:PLOT.FENCE}));
  const gB=mk("g",{}), gD=mk("g",{class:"dimmable",id:"decor"}), gW=mk("g",{});
  PLOT.BLOCKS.forEach(b=>{
    const g=mk("g",{class:"blk k-"+b.k,"data-id":b.id}); g.append(mk("title",{},b.n));
    (b.r||[]).forEach(r=>g.append(mk("rect",{x:r[0],y:r[1],width:r[2],height:r[3],rx:1.5})));
    (b.c||[]).forEach(c=>g.append(mk("circle",{cx:c[0],cy:c[1],r:c[2]})));
    (b.t||[]).forEach(t=>g.append(mk("text",{x:t[1],y:t[2],"font-size":t[3],"font-weight":t[4]||400,"text-anchor":t[5]||"middle"},t[0])));
    if(b.info){g.classList.add("pick"); g.setAttribute("tabindex","0"); g.setAttribute("role","button"); g.setAttribute("aria-label",b.n+", show details");
      g.addEventListener("click",()=>{if(!dragMoved)selectBlock(b.id)});
      g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selectBlock(b.id)}});}
    blockEl[b.id]=g; blockDef[b.id]=b; gB.append(g);
  });
  PLOT.DECOR.forEach((p,i)=>gD.append(mk("path",{class:"decor"+(i===PLOT.DECOR.length-1?" gas":""),d:dOf(p)})));
  PLOT.DOTS.forEach(p=>gD.append(mk("circle",{class:"dot",cx:p[0],cy:p[1],r:2.2})));
  for(const id in PLOT.SEG){const w=mk("path",{class:"wire dimmable",d:dOf(PLOT.SEG[id])}); wireEl[id]=w; gW.append(w);}
  flowLayer=mk("g",{"aria-hidden":"true"});
  const north=mk("g",{class:"north",transform:"translate(232,668)"}); north.append(mk("path",{d:"M0,14 L0,-10 M-4,-3 L0,-10 L4,-3"})); north.append(mk("text",{x:8,y:4,"font-size":8,"text-anchor":"start"},"N (approx.)"));
  svg.append(gB,gD,gW,flowLayer,north);
}

function arrowsFor(pts){
  const out=[];
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy); if(len<22)continue;
    const n=Math.max(1,Math.round(len/90)), ang=Math.atan2(dy,dx)*180/Math.PI;
    for(let j=0;j<n;j++){const f=(j+.5)/n; out.push(mk("path",{class:"arrow",d:"M-4.5,-5 L5,0 L-4.5,5 Z",transform:"translate("+(a[0]+dx*f)+","+(a[1]+dy*f)+") rotate("+ang+")"}));}}
  return out;
}

function applyRoute(){
  const M=MODES[mode], k=stepIdx, req=new Set(), live=new Set(), cur=new Set(), segOn=new Set();
  $("#route").setAttribute("data-mode",mode);
  M.steps.forEach((s,i)=>s.b.forEach(id=>{req.add(id); if(k===null||i<=k)live.add(id); if(i===k)cur.add(id);}));
  for(const id in blockEl){const c=blockEl[id].classList; c.toggle("dim",!req.has(id)); c.toggle("req",req.has(id)); c.toggle("live",live.has(id)); c.toggle("cur",cur.has(id));}
  flowLayer.textContent="";
  const arrows=[];
  M.steps.forEach((s,i)=>s.s.forEach(tok=>{
    const rev=tok[0]==="-", id=rev?tok.slice(1):tok, pts=rev?[...PLOT.SEG[id]].reverse():PLOT.SEG[id], d=dOf(pts); segOn.add(id);
    if(k===null||i<=k){flowLayer.append(mk("path",{class:"flow",d}),mk("path",{class:"flowdots",d})); arrows.push(...arrowsFor(pts));}
    else flowLayer.append(mk("path",{class:"pend",d}));
  }));
  arrows.forEach(a=>flowLayer.append(a));
  for(const id in wireEl)wireEl[id].classList.toggle("dim",!segOn.has(id));
  $("#decor").classList.add("dim");
  [...$("#modeBtns").children].forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.m===mode)));
  renderModeInfo(); renderSteps(); centreMap(cur.size?cur:req);
}

function modeDates(M){
  if(Array.isArray(M.dates))return M.dates;
  if(!LAST)return [];
  const by=LAST.by, f=t=>fmt(new Date(t));
  if(M.dates==="b")return [[f(by.B20.start),"Power receiving: 220 kV bus section and autotransformer live (target)"],[f(by.B21.start),"500 kV bus live through the autotransformer"],[f(by.B22.end),"End of the hold period for the 500 kV switchyard"],[f(by.B23.start),"GSUT11 with UAT11 energised"],[f(by.B24.start),"Block 1 10 kV boards live"],[f(by.B25.end),"Block 1 0.4 kV boards live"]];
  if(M.dates==="r")return [[f(by.B26.end),"KEGOC approval of the export route, if the 30-day placeholder for its review holds"],["22 Dec","GT11 first synchronisation, only if temporary power carries the work until then and KEGOC approves the export route"],[f(LAST.syncLate.getTime()),"Otherwise the earliest GT11 synchronisation by plan logic"]];
  return [];
}
function renderModeInfo(){
  const M=MODES[mode], dates=modeDates(M);
  $("#modeInfo").innerHTML="<h3>"+M.title+"</h3><p>"+M.text+"</p>"+
    (dates.length?"<h4>Key dates"+(Array.isArray(M.dates)?"":" (plan result at current assumptions)")+"</h4><dl class='dates'>"+dates.map(d=>"<dt>"+d[0]+"</dt><dd>"+d[1]+"</dd>").join("")+"</dl><p class='note'>All dates provisional.</p>":"")+
    "<h4>Conditions</h4><ul>"+M.cond.map(c=>"<li>"+c+"</li>").join("")+"</ul>";
}
function stepDate(s){
  if(!s.task||!LAST)return ""; const by=LAST.by, a=by[s.task], b=by[s.task2||s.task];
  return "Plan date "+fmt(new Date(a.start))+(b.end>a.start?" to "+fmt(new Date(b.end)):"")+", provisional";
}
function renderSteps(){
  const M=MODES[mode], ol=$("#stepList"), n=M.steps.length; ol.innerHTML="";
  M.steps.forEach((s,i)=>{
    const li=el("li",{class:stepIdx===null?"done":i<stepIdx?"done":i===stepIdx?"cur":"todo"});
    const date=stepDate(s);
    const b=el("button",{type:"button"},"<span class='num'>"+(i+1)+"</span><span class='ttl'>"+s.t+"</span><span class='meta'>"+chip(s.st)+(s.lead?"<span>Lead: "+s.lead+"</span>":"")+(date?"<span>"+date+"</span>":"")+"</span><span class='need'><b>Before it is made live:</b> "+s.need+"</span>");
    if(i===stepIdx)b.setAttribute("aria-current","step");
    b.addEventListener("click",()=>{stopPlay();setStep(i)}); li.append(b); ol.append(li);
  });
  $("#stepNow").textContent=stepIdx===null?"Whole route shown, "+n+" steps in sequence. Use Next or select a step to walk through it.":"Step "+(stepIdx+1)+" of "+n+": "+M.steps[stepIdx].t+".";
  $("#stPrev").disabled=stepIdx===null||stepIdx===0; $("#stNext").disabled=stepIdx!==null&&stepIdx>=n-1;
  $("#stAll").setAttribute("aria-pressed",String(stepIdx===null));
}
function setStep(i){stepIdx=i;applyRoute();}
function setMode(m){stopPlay();mode=m;stepIdx=null;applyRoute();}
function stopPlay(){if(playTimer){clearInterval(playTimer);playTimer=null;} const b=$("#stPlay"); if(b){b.setAttribute("aria-pressed","false");b.textContent="Play";}}
function startPlay(){
  const n=MODES[mode].steps.length; if(stepIdx===null||stepIdx>=n-1)setStep(0);
  $("#stPlay").setAttribute("aria-pressed","true"); $("#stPlay").textContent="Pause";
  playTimer=setInterval(()=>{if(stepIdx>=n-1){stopPlay();return;} setStep(stepIdx+1);},2600);
}
$("#stPrev").addEventListener("click",()=>{stopPlay();if(stepIdx>0)setStep(stepIdx-1)});
$("#stNext").addEventListener("click",()=>{stopPlay();setStep(stepIdx===null?0:Math.min(stepIdx+1,MODES[mode].steps.length-1))});
$("#stAll").addEventListener("click",()=>{stopPlay();setStep(null)});
$("#stPlay").addEventListener("click",()=>{playTimer?stopPlay():startPlay()});

function selectBlock(id){
  if(selected&&blockEl[selected])blockEl[selected].classList.remove("sel");
  const box=$("#blockInfo"); selected=id;
  if(!id){box.hidden=true;return;}
  const b=blockDef[id]; blockEl[id].classList.add("sel"); box.hidden=false;
  box.innerHTML="<h3><span>"+b.n+"</span><button type='button' aria-label='Close block details'>Close</button></h3><p>"+b.info+"</p>";
  box.querySelector("button").addEventListener("click",()=>{selectBlock(null);blockEl[id].focus&&blockEl[id].focus()});
}

/* map view: presets, zoom, drag */
const AR=816/655; let view=PLOT.VIEWS.route.slice(), dragMoved=false;
function setView(v,name){view=v; svg.setAttribute("viewBox",v.join(" ")); $("#vRoute").setAttribute("aria-pressed",String(name==="route")); $("#vSite").setAttribute("aria-pressed",String(name==="site"));}
function zoom(f){const w=Math.min(1300,Math.max(220,view[2]*f)), h=w/AR, cx=view[0]+view[2]/2, cy=view[1]+view[3]/2; setView([cx-w/2,cy-h/2,w,h],"");}
$("#vRoute").addEventListener("click",()=>setView(PLOT.VIEWS.route.slice(),"route"));
$("#vSite").addEventListener("click",()=>setView(PLOT.VIEWS.site.slice(),"site"));
$("#vIn").addEventListener("click",()=>zoom(.8)); $("#vOut").addEventListener("click",()=>zoom(1.25));
let drag=null;
svg.addEventListener("pointerdown",e=>{if(e.pointerType==="touch"||e.button!==0)return; drag={x:e.clientX,y:e.clientY,v:view.slice()}; dragMoved=false;});
window.addEventListener("pointermove",e=>{if(!drag)return; const dx=e.clientX-drag.x, dy=e.clientY-drag.y; if(!dragMoved&&Math.hypot(dx,dy)<5)return; dragMoved=true; svg.classList.add("dragging");
  const s=Math.max(drag.v[2]/svg.clientWidth,drag.v[3]/svg.clientHeight); setView([drag.v[0]-dx*s,drag.v[1]-dy*s,drag.v[2],drag.v[3]],"");});
window.addEventListener("pointerup",()=>{if(!drag)return; drag=null; svg.classList.remove("dragging"); setTimeout(()=>{dragMoved=false},0);});
$("#mapScroll").addEventListener("keydown",e=>{const st=view[2]*.12, m={ArrowLeft:[-st,0],ArrowRight:[st,0],ArrowUp:[0,-st],ArrowDown:[0,st]}[e.key];
  if(e.target!==e.currentTarget)return; if(m){e.preventDefault();setView([view[0]+m[0],view[1]+m[1],view[2],view[3]],"");} else if(e.key==="+"||e.key==="="){zoom(.8)} else if(e.key==="-"){zoom(1.25)}});
function centreMap(ids){
  const sc=$("#mapScroll"); if(sc.scrollWidth<=sc.clientWidth+4)return;
  let sx=0,n=0; ids.forEach(id=>{const b=blockDef[id]; (b.r||[]).forEach(r=>{sx+=r[0]+r[2]/2;n++})}); if(!n)return;
  const frac=(sx/n-view[0])/view[2], left=frac*sc.scrollWidth-sc.clientWidth/2;
  sc.scrollTo({left:Math.max(0,left),behavior:reduced()?"auto":"smooth"});
}

/* ---------- start ---------- */
buildPlot();
for(const m in MODES){const b=el("button",{type:"button","data-m":m,style:"--mc:"+MODE_COLOR[m]},"<span>"+MODES[m].label+"</span><small>"+MODES[m].steps.length+" steps</small>"); b.addEventListener("click",()=>setMode(m)); $("#modeBtns").append(b);}
renderPlan(); applyRoute(); show();
})();
