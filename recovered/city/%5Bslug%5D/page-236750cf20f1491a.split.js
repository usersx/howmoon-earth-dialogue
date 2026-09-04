(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[516],{
2506:(e,t,a)=>{
"use strict";
a.d(t,{
y:()=>n}
);
let r=[{
key:"beijing",aliases:["北京","北京市","中国北京","北京中国","Beijing","Beijing China","China Beijing"],image:"/assets/beijing-city-hero-v1.jpg",imageVersion:"beijing-city-hero-v1",route:"/city/beijing",sourceReferences:[]}
,{
key:"rome",aliases:["罗马","意大利罗马","罗马意大利","Rome","Roma","Rome Italy","Italy Rome"],image:"/assets/rome-city-hero-v1.jpg",imageVersion:"rome-city-hero-v1",route:"/city/rome",sourceReferences:[]}
,{
key:"dali",aliases:["大理","大理市","云南大理","中国大理","Dali","Dali Yunnan","Dali China"],image:"/cities/dali-panorama-v2.png",imageVersion:"dali-panorama-v2",route:"/city/dali",sourceReferences:[]}
,{
key:"fukuoka",aliases:["福冈","福冈市","福岡","福岡市","日本福冈","日本福岡","Fukuoka","Fukuoka Japan"],image:"/cities/fukuoka-panorama-v2.png",imageVersion:"fukuoka-panorama-v2",route:"/city/fukuoka",sourceReferences:[]}
,{
key:"ljubljana",aliases:["卢布尔雅那","盧布爾雅那","斯洛文尼亚卢布尔雅那","Ljubljana","Ljubljana Slovenia"],image:"/cities/ljubljana-panorama-v2.png",imageVersion:"ljubljana-panorama-v2",route:"/city/ljubljana",sourceReferences:[]}
,{
key:"porto",aliases:["波尔图","波爾圖","波圖","葡萄牙波尔图","Porto","Oporto","Porto Portugal"],image:"/cities/porto-personalized-v1.png",imageVersion:"porto-personalized-v1",route:"/city/personalized",sourceReferences:["https://visitporto.travel/pt-PT/poi/5cd04b48f979e000016c560c","https://naturebasedsolutions.porto.pt/nbs/jardim-do-passeio-alegre/"]}
];
function i(e){
return String(null!=e?e:"").normalize("NFKC").toLocaleLowerCase("en").replace(RegExp("[\\s\\p{
P}
\\p{
S}
]+","gu"),"")}
function n(){
for(var e,t=arguments.length,a=Array(t),n=0;
n<t;
n++)a[n]=arguments[n];
let o=a.map(i).filter(Boolean);
return 0===o.length?null:null!=(e=r.find(e=>{
let{
aliases:t}
=e;
return t.some(e=>o.includes(i(e)))}
))?e:null}
}
,2833:(e,t,a)=>{
Promise.resolve().then(a.bind(a,5813)),Promise.resolve().then(a.t.bind(a,3033,23))}
,3033:()=>{
}
,3142:(e,t,a)=>{
"use strict";
a.d(t,{
Cx:()=>l,GH:()=>o,a2:()=>d,hs:()=>c,iX:()=>s}
);
let r="earth-dialogue.session.v3",i=["earth-dialogue.session.v2","earth-dialogue.session.v1"];
function n(e){
return!!e&&"object"==typeof e&&"string"==typeof e.id&&("user"===e.role||"assistant"===e.role)&&"string"==typeof e.content&&("text"===e.inputMode||"voice"===e.inputMode||"system"===e.inputMode)&&"string"==typeof e.createdAt}
function o(){
return crypto.randomUUID()}
function l(){
return{
id:crypto.randomUUID(),role:"assistant",inputMode:"system",createdAt:new Date().toISOString(),content:"如果现在可以回到某次旅行里的十分钟，你最想回到哪十分钟？不用解释它为什么重要，只告诉我当时在哪里、正在做什么。"}
}
function s(e){
let t=Date.now(),a={
version:3,promptVersion:"3.3",sessionId:e.sessionId,messages:e.messages,result:e.result,geography:e.geography,updatedAt:new Date(t).toISOString(),expiresAt:new Date(t+6048e5).toISOString()}
;
localStorage.setItem(r,JSON.stringify(a))}
function c(){
let e=localStorage.getItem(r);
if(!e)return i.forEach(e=>localStorage.removeItem(e)),null;
try{
let t=JSON.parse(e);
if(3!==t.version||"3.1"!==t.promptVersion&&"3.2"!==t.promptVersion&&"3.3"!==t.promptVersion||"string"!=typeof t.sessionId||!Array.isArray(t.messages)||!t.messages.every(n)||!Object.prototype.hasOwnProperty.call(t,"geography")||null!==t.result&&!t.geography||null===t.result&&null!==t.geography||"string"!=typeof t.expiresAt||Date.parse(t.expiresAt)<=Date.now())return localStorage.removeItem(r),i.forEach(e=>localStorage.removeItem(e)),null;
return t}
catch(e){
return localStorage.removeItem(r),i.forEach(e=>localStorage.removeItem(e)),null}
}
function d(){
localStorage.removeItem(r),i.forEach(e=>localStorage.removeItem(e))}
}
,5813:(e,t,a)=>{
"use strict";
a.d(t,{
CityPanorama:()=>v,PersonalizedCityPanorama:()=>w}
);
var r=a(5155),i=a(2619),n=a.n(i),o=a(2115);
let l="earth-dialogue.city-visual.v1";
let tripCityCodes={
beijing:"BJS",rome:"ROM",dali:"DLU",fukuoka:"FUK",ljubljana:"LJU",porto:"OPO",
"北京":"BJS",Beijing:"BJS","罗马":"ROM",Rome:"ROM","大理":"DLU",Dali:"DLU",
"福冈":"FUK",Fukuoka:"FUK","卢布尔雅那":"LJU",Ljubljana:"LJU",
"波尔图":"OPO",Porto:"OPO","松江市":"IZO",Matsue:"IZO","垦丁":"HCN",Kenting:"HCN"}
;
function s(e){
return JSON.stringify({
destination:e.destination,narrative:e.display.revealNarrative,visualBrief:e.visualBrief}
)}
function c(e){
var t,a;
return!!e&&"object"==typeof e&&"string"==typeof e.cacheKey&&"string"==typeof e.image&&e.image.length>20&&"dynamic-v1"===e.imageVersion&&"string"==typeof(null==(t=e.sourceReference)?void 0:t.title)&&"string"==typeof(null==(a=e.sourceReference)?void 0:a.pageUrl)}
async function d(e){
try{
var t;
return(null==(t=(await e.json()).error)?void 0:t.trim())||"本次专属视觉没有生成完成。"}
catch(e){
return"本次专属视觉没有生成完成。"}
}
async function h(e){
let t=AbortSignal.timeout(125e3),a=await fetch("/api/city-visual",{
method:"POST",headers:{
"Content-Type":"application/json"}
,body:JSON.stringify({
result:e.result}
),signal:e.signal?AbortSignal.any([e.signal,t]):t}
);
if(!a.ok)throw Error(await d(a));
let r=await a.json();
if(!c(r))throw Error("专属视觉返回格式无法读取。");
return r}
var u=a(2506);
function m(e){
return 0===e.length?0:(e.sort((e,t)=>e-t),e[Math.floor(e.length/2)])}
function g(e,t,a){
let r=Math.max(1,Math.floor(.2*t)),i=Math.max(1,Math.floor(.2*a)),n=[],o=[],l=[],s=Math.max(1,Math.floor(Math.min(t,a)/180));
for(let a=0;
a<i;
a+=s)for(let i=0;
i<r;
i+=s){
let r=(a*t+i)*4;
e[r+3]<220||(n.push(e[r]),o.push(e[r+1]),l.push(e[r+2]))}
return{
red:m(n),green:m(o),blue:m(l)}
}
function p(e,t,a){
let r=Math.min(1,Math.max(0,(a-e)/(t-e)));
return r*r*(3-2*r)}
async function f(e){
let t=await fetch(e);
if(!t.ok)throw Error("无法读取城市小画。");
let a=await t.blob(),r=await createImageBitmap(a);
try{
let e=Math.min(1,480/Math.max(r.width,r.height)),t=Math.max(2,Math.round(r.width*e)),a=Math.max(2,Math.round(r.height*e)),i=document.createElement("canvas");
i.width=t,i.height=a;
let n=i.getContext("2d",{
willReadFrequently:!0}
);
if(!n)throw Error("无法分析城市小画。");
n.drawImage(r,0,0,t,a);
let o=n.getImageData(0,0,t,a),l=g(o.data,t,a),s=function(e,t,a){
if(!e||t<2||a<2||e.length<t*a*4)return null;
let r=g(e,t,a),i=new Uint8Array(t*a);
for(let n=0;
n<t*a;
n+=1){
let t=4*n;
(function(e,t,a,r,i){
if(r<160)return!1;
let n=e-i.red,o=t-i.green,l=Math.hypot(n,o,a-i.blue),s=(i.red+i.green+i.blue)/3,c=Math.max(e,t,a)-Math.min(e,t,a),d=Math.max(i.red,i.green,i.blue)-Math.min(i.red,i.green,i.blue);
return l>=26||l>=16&&s-(e+t+a)/3>=7||l>=14&&c-d>=9}
)(e[t],e[t+1],e[t+2],e[t+3],r)&&(i[n]=1)}
let n=new Uint8Array(t*a),o=new Int32Array(t*a),l=[];
for(let e=0;
e<i.length;
e+=1){
if(!i[e]||n[e])continue;
let r=0,s=0,c=0,d=t,h=a,u=0,m=0;
for(o[s++]=e,n[e]=1;
r<s;
){
let e=o[r++],l=e%t,g=Math.floor(e/t);
c+=1,d=Math.min(d,l),h=Math.min(h,g),u=Math.max(u,l+1),m=Math.max(m,g+1);
for(let e=-1;
e<=1;
e+=1){
let r=g+e;
if(!(r<0)&&!(r>=a))for(let a=-1;
a<=1;
a+=1){
if(0===a&&0===e)continue;
let c=l+a;
if(c<0||c>=t)continue;
let d=r*t+c;
i[d]&&!n[d]&&(n[d]=1,o[s++]=d)}
}
}
l.push({
size:c,left:d,top:h,right:u,bottom:m}
)}
if(0===l.length)return null;
l.sort((e,t)=>t.size-e.size);
let s=Math.max(12,t*a*8e-5,.015*l[0].size),c=l.filter(e=>{
let{
size:t}
=e;
return t>=s}
).reduce((e,t)=>({
left:Math.min(e.left,t.left),top:Math.min(e.top,t.top),right:Math.max(e.right,t.right),bottom:Math.max(e.bottom,t.bottom)}
),{
left:t,top:a,right:0,bottom:0}
),d=c.right-c.left,h=c.bottom-c.top;
return d<.04*t||h<.04*a||d*h>t*a*.82?null:c}
(o.data,t,a);
if(!s)return null;
let c=r.width/t,d=r.height/a,h={
left:s.left*c,top:s.top*d,right:s.right*c,bottom:s.bottom*d}
,u=function(e,t,a){
let r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1.42,i=e.right-e.left,n=e.bottom-e.top,o=Math.max(0,e.left-.12*i),l=Math.max(0,e.top-.12*n),s=Math.min(t,e.right+.015*i),c=Math.min(a,e.bottom+.015*n),d=s-o,h=c-l;
return d/h<r?(o=Math.max(0,s-h*r),d=s-o):(l=Math.max(0,c-d/r),h=c-l),{
left:Math.floor(o),top:Math.floor(l),width:Math.max(1,Math.ceil(d)),height:Math.max(1,Math.ceil(h))}
}
(h,r.width,r.height),m=Math.min(1,1400/u.width),f=document.createElement("canvas");
f.width=Math.max(1,Math.round(u.width*m)),f.height=Math.max(1,Math.round(u.height*m));
let y=f.getContext("2d");
if(!y)throw Error("无法绘制裁切后的小画。");
y.drawImage(r,u.left,u.top,u.width,u.height,0,0,f.width,f.height);
let x=y.getImageData(0,0,f.width,f.height);
return!function(e,t,a,r){
if(!e||t<1||a<1||e.length<t*a*4)return;
let i=null!=r?r:g(e,t,a),n=(i.red+i.green+i.blue)/3,o=Math.max(i.red,i.green,i.blue)-Math.min(i.red,i.green,i.blue),l=i.blue-i.red;
for(let r=0;
r<t*a;
r+=1){
let t=4*r,a=e[t],s=e[t+1],c=e[t+2],d=e[t+3];
if(0===d)continue;
let h=Math.hypot(a-i.red,s-i.green,c-i.blue),u=n-(a+s+c)/3,m=Math.max(a,s,c)-Math.min(a,s,c),g=c-a-l,f=Math.max(p(6,28,h),p(4,22,u),p(3,20,g),p(6,28,m-o));
e[t+3]=Math.round(d*f)}
}
(x.data,f.width,f.height,l),y.putImageData(x,0,0),await new Promise((e,t)=>{
f.toBlob(a=>{
a?e(a):t(Error("无法生成裁切后的小画。"))}
,"image/png")}
)}
finally{
r.close()}
}
var y=a(3142),x=a(7403);
function j(e){
e.preventDefault(),(0,y.a2)(),window.location.replace("/?restart=1")}
function tripFlightUrl(e){
let t=String(e||"").trim().toLowerCase();
return/^[a-z]{3}$/.test(t)?"https://www.trip.com/flights/?acity=".concat(encodeURIComponent(t),"&locale=zh-CN&curr=CNY"):"https://www.trip.com/flights/?locale=zh-CN&curr=CNY"}
function v(e){
let{
city:t}
=e,a=(0,o.useRef)(null),[i,l]=(0,o.useState)(null);
(0,o.useEffect)(()=>{
if(!i)return;
let e=window.setTimeout(()=>l(null),3600);
return()=>window.clearTimeout(e)}
,[i]);
let s={
"--city-image":"url(".concat(t.image,")")}
;
return(0,r.jsxs)("main",{
ref:a,className:"city-panorama city-panorama--".concat(t.mood),style:s,onPointerMove:e=>{
let t=a.current;
if(!t||"touch"===e.pointerType)return;
let r=(e.clientX/window.innerWidth-.5)*2,i=(e.clientY/window.innerHeight-.5)*2;
t.style.setProperty("--drift-x","".concat(-.45*r,"%")),t.style.setProperty("--drift-y","".concat(-.35*i,"%"))}
,children:[(0,r.jsx)("div",{
className:"city-panorama__image","aria-hidden":"true"}
),(0,r.jsx)("div",{
className:"city-panorama__veil","aria-hidden":"true"}
),(0,r.jsx)("div",{
className:"city-panorama__grain","aria-hidden":"true"}
),(0,r.jsxs)("header",{
className:"city-panorama__header",children:[(0,r.jsxs)(n(),{
className:"city-brand",href:"/","aria-label":"返回云中客",children:[(0,r.jsx)("span",{
className:"city-brand__orbit","aria-hidden":"true",children:(0,r.jsx)("i",{
}
)}
),(0,r.jsx)("span",{
children:(0,r.jsx)("b",{
children:"云中客"}
)}
)]}
),(0,r.jsxs)("div",{
className:"city-panorama__header-actions",children:[(0,r.jsxs)("div",{
className:"city-panorama__coordinates",children:[(0,r.jsx)("span",{
children:"YOU ARE VIEWING"}
),(0,r.jsx)("b",{
children:t.coordinates}
)]}
),(0,r.jsx)(n(),{
className:"city-panorama__restart",href:"/?restart=1",onClick:j,children:"从头开始"}
)]}
)]}
),(0,r.jsx)(n(),{
className:"city-panorama__back",href:"/?return=1","aria-label":"返回城市已被点亮的地球页面",children:(0,r.jsx)("span",{
"aria-hidden":"true",children:"←"}
)}
),(0,r.jsxs)("section",{
className:"city-panorama__copy","aria-labelledby":"city-title",children:[(0,r.jsx)("p",{
children:t.archiveLine}
),(0,r.jsxs)("h1",{
id:"city-title",children:[(0,r.jsx)("span",{
children:t.name}
),t.englishName]}
),(0,r.jsx)("blockquote",{
children:t.tagline}
)]}
),(0,r.jsxs)("section",{
className:"city-panorama__actions","aria-label":"城市体验入口",children:[(0,r.jsxs)("button",{
type:"button",onClick:()=>l("城市深度体验将只为后续选中的少数目的地开放。"),children:[(0,r.jsxs)("span",{
children:[(0,r.jsx)("b",{
children:"沉浸式体验"}
),(0,r.jsx)("small",{
children:"SELECTED CITIES"}
)]}
),(0,r.jsx)("i",{
"aria-hidden":"true",children:"→"}
)]}
),(0,r.jsxs)("a",{
className:"is-secondary",href:tripFlightUrl(t.iataCode||tripCityCodes[t.slug]||tripCityCodes[t.name]||tripCityCodes[t.englishName]),target:"_blank",rel:"noreferrer",children:[(0,r.jsxs)("span",{
children:[(0,r.jsxs)("b",{
children:["直接飞往",t.name]}
),(0,r.jsx)("small",{
children:"TRIP.COM FLIGHTS"}
)]}
),(0,r.jsx)("i",{
"aria-hidden":"true",children:"↗"}
)]}
)]}
),i&&(0,r.jsxs)("div",{
className:"city-panorama__notice",role:"status",children:[(0,r.jsx)("span",{
"aria-hidden":"true"}
),i]}
),(0,r.jsx)("footer",{
className:"city-panorama__footer","aria-hidden":"true"}
)]}
)}
function b(e,t,a){
return"".concat(Math.abs(e).toFixed(4),"\xb0 ").concat(e>=0?t:a)}
function w(){
var e,t;
let a=(0,o.useRef)(null),[i,d]=(0,o.useState)(void 0),[m,g]=(0,o.useState)(null),[p,v]=(0,o.useState)(null),[w,M]=(0,o.useState)("idle"),[N,S]=(0,o.useState)(null),[E,_]=(0,o.useState)(0),[R,k]=(0,o.useState)("idle");
(0,o.useEffect)(()=>{
let e=window.requestAnimationFrame(()=>{
d((0,y.hs)())}
);
return()=>window.cancelAnimationFrame(e)}
,[]);
let I=async()=>{
if(m&&C&&"saving"!==R){
k("saving");
try{
let e=await fetch(m.image);
if(!e.ok)throw Error("图片暂时无法下载。");
let t=await e.blob(),a=t.type.includes("jpeg")?"jpg":"png",r=URL.createObjectURL(t),i=document.createElement("a"),n=C.destination.cityEnglishName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"destination";
i.href=r,i.download="".concat(n,"-earth-dialogue.").concat(a),document.body.appendChild(i),i.click(),i.remove(),window.setTimeout(()=>URL.revokeObjectURL(r),1e3),k("saved"),window.setTimeout(()=>k("idle"),2200)}
catch(e){
k("error"),window.setTimeout(()=>k("idle"),2600)}
}
}
,C=null!=(e=null==i?void 0:i.result)?e:null,A=null!=(t=null==i?void 0:i.geography)?t:null;
if((0,o.useEffect)(()=>{
if(!m||"本地城市素材"===m.generationPromptSummary)return;
let e=!1,t="";
return f(m.image).then(a=>{
a&&!e&&(t=URL.createObjectURL(a),v({
source:m.image,image:t}
))}
).catch(()=>{
}
),()=>{
e=!0,t&&URL.revokeObjectURL(t)}
}
,[m]),(0,o.useEffect)(()=>{
if(!C)return;
let e=(0,u.y)(C.destination.city,C.destination.cityEnglishName);
if(e){
let t=window.requestAnimationFrame(()=>{
g({
cacheKey:"local:".concat(e.imageVersion),image:e.image,imageVersion:e.imageVersion,sourceReference:e.sourceReferences[0]?{
title:"".concat(C.destination.city,"城市图片参考"),pageUrl:e.sourceReferences[0]}
:null,generationPromptSummary:"本地城市素材"}
),M("ready"),S(null)}
);
return()=>window.cancelAnimationFrame(t)}
let t=function(e){
try{
let t=sessionStorage.getItem(l);
if(!t)return null;
let a=JSON.parse(t);
if(a.resultIdentity!==s(e)||!c(a.visual))return sessionStorage.removeItem(l),null;
return a.visual}
catch(e){
return null}
}
(C);
if(t){
let e=window.requestAnimationFrame(()=>{
g(t),M("ready"),S(null)}
);
return()=>window.cancelAnimationFrame(e)}
let a=new AbortController,r=window.requestAnimationFrame(()=>{
g(null),M("generating"),S(null),h({
result:C,signal:a.signal}
).then(e=>{
try{
sessionStorage.setItem(l,JSON.stringify({
resultIdentity:s(C),visual:e}
))}
catch(e){
}
g(e),M("ready")}
).catch(e=>{
a.signal.aborted||(S(e instanceof Error?e.message:"本次专属小画没有生成完成。"),M("error"))}
)}
);
return()=>{
window.cancelAnimationFrame(r),a.abort()}
}
,[C,E]),void 0===i)return(0,r.jsxs)("main",{
className:"personalized-city-state","aria-live":"polite",children:[(0,r.jsx)("span",{
"aria-hidden":!0}
),(0,r.jsx)("p",{
children:"正在打开为你点亮的城市……"}
)]}
);
if(!C||!A)return(0,r.jsxs)("main",{
className:"personalized-city-state","aria-live":"polite",children:[(0,r.jsx)("span",{
"aria-hidden":!0}
),(0,r.jsx)("h1",{
children:"这次城市结果已经不在本机了。"}
),(0,r.jsx)("p",{
children:"重新开始一轮对话，地球会为你保存下一次结果。"}
),(0,r.jsx)(n(),{
href:"/?restart=1",onClick:j,children:"从头开始"}
)]}
);
let P="".concat(b(A.coordinates.latitude,"N","S")," \xb7 ").concat(b(A.coordinates.longitude,"E","W")),z=m&&(null==p?void 0:p.source)===m.image?p.image:null==m?void 0:m.image,O=!!(m&&(null==p?void 0:p.source)===m.image);
return(0,r.jsxs)("main",{
ref:a,className:"city-panorama city-panorama--personalized".concat(m?"":" is-image-pending"),onPointerMove:e=>{
let t=a.current;
if(!t||"touch"===e.pointerType)return;
let r=(e.clientX/window.innerWidth-.5)*2,i=(e.clientY/window.innerHeight-.5)*2;
t.style.setProperty("--drift-x","".concat(-.3*r,"%")),t.style.setProperty("--drift-y","".concat(-.22*i,"%"))}
,children:[(0,r.jsx)("div",{
className:"city-panorama__veil","aria-hidden":"true"}
),(0,r.jsx)("div",{
className:"city-panorama__grain","aria-hidden":"true"}
),(0,r.jsxs)("header",{
className:"city-panorama__header",children:[(0,r.jsxs)(n(),{
className:"city-brand",href:"/","aria-label":"返回云中客",children:[(0,r.jsx)("span",{
className:"city-brand__orbit","aria-hidden":"true",children:(0,r.jsx)("i",{
}
)}
),(0,r.jsx)("span",{
children:(0,r.jsx)("b",{
children:"云中客"}
)}
)]}
),(0,r.jsxs)("div",{
className:"city-panorama__header-actions",children:[(0,r.jsxs)("div",{
className:"city-panorama__coordinates",children:[(0,r.jsx)("span",{
children:"GEOGRAPHY VERIFIED"}
),(0,r.jsx)("b",{
children:P}
)]}
),(0,r.jsx)(n(),{
className:"city-panorama__restart",href:"/?restart=1",onClick:j,children:"从头开始"}
)]}
)]}
),(0,r.jsx)(n(),{
className:"personalized-city-back",href:"/?return=1","aria-label":"返回城市已被点亮的地球页面",children:(0,r.jsx)("span",{
"aria-hidden":"true",children:"←"}
)}
),(0,r.jsxs)("section",{
className:"personalized-city-copy","aria-labelledby":"personalized-city-title",children:[(0,r.jsxs)("p",{
children:[C.destination.country," \xb7 ",C.destination.adminRegion]}
),(0,r.jsxs)("h1",{
id:"personalized-city-title",children:[(0,r.jsx)("span",{
children:C.destination.city}
),C.destination.cityEnglishName]}
),(0,r.jsx)("div",{
className:"personalized-city-narrative",children:C.display.revealNarrative.map(e=>(0,r.jsx)("p",{
children:e}
,e))}
),(0,r.jsx)("a",{
className:"personalized-city-flight",href:tripFlightUrl(C.destination.iataCode||tripCityCodes[C.destination.city]||tripCityCodes[C.destination.cityEnglishName]),target:"_blank",rel:"noreferrer",children:"当前机票信息"}
)]}
),(0,r.jsxs)("section",{
className:"personalized-city-art","aria-label":"城市小画",children:[m?(0,r.jsx)("div",{
className:"personalized-city-visual ".concat("本地城市素材"===m.generationPromptSummary?"is-mapped-image":"is-generated-image").concat(O?" is-content-cropped":""),role:"img","aria-label":"".concat(C.destination.city,"的城市图片"),children:(0,r.jsx)("img",{
src:z,alt:"",draggable:!1}
)}
):(0,r.jsx)("div",{
className:"personalized-city-visual-status",role:"status","aria-live":"polite",children:"error"===w?(0,r.jsxs)(r.Fragment,{
children:[(0,r.jsx)("small",{
children:"IMAGE GENERATION PAUSED"}
),(0,r.jsx)("p",{
children:N}
),(0,r.jsx)("button",{
type:"button",onClick:()=>_(e=>e+1),children:"重新生成"}
)]}
):(0,r.jsxs)(r.Fragment,{
children:[(0,r.jsx)(x.O,{
level:.32,active:!0,variant:"radial",className:"personalized-generation-signal"}
),(0,r.jsx)("small",{
children:"SEARCHING + GENERATING"}
),(0,r.jsx)("p",{
children:"正在搜索地点参考，并生成只属于这次推荐的小画……"}
),(0,r.jsx)("em",{
children:"页面可以继续阅读，通常需要一点时间"}
)]}
)}
),m&&(0,r.jsxs)("div",{
className:"personalized-city-art-actions",children:[m.sourceReference&&(0,r.jsx)("a",{
href:m.sourceReference.pageUrl,target:"_blank",rel:"noreferrer",title:m.sourceReference.title,children:"websearch结果"}
),(0,r.jsx)("button",{
type:"button",className:"personalized-city-download",onClick:()=>void I(),disabled:"saving"===R,children:"saving"===R?"正在保存":"saved"===R?"已保存到下载":"error"===R?"保存失败，重试":"保存小画"}
)]}
)]}
),(0,r.jsx)("footer",{
className:"personalized-city-footer",children:(0,r.jsx)("p",{
children:C.display.predictionNote}
)}
)]}
)}
}
,7403:(e,t,a)=>{
"use strict";
a.d(t,{
O:()=>n}
);
var r=a(5155),i=a(2115);
function n(e){
let{
level:t,active:a,variant:n,paused:o=!1,className:l=""}
=e,s=(0,i.useRef)(null),c=(0,i.useRef)(t),d=(0,i.useRef)(a),h=(0,i.useRef)(o);
return(0,i.useEffect)(()=>{
c.current=t}
,[t]),(0,i.useEffect)(()=>{
d.current=a}
,[a]),(0,i.useEffect)(()=>{
h.current=o}
,[o]),(0,i.useEffect)(()=>{
let e=s.current;
if(!e)return;
let t=e.getContext("2d");
if(!t)return;
let a=window.matchMedia("(prefers-reduced-motion: reduce)").matches,r=0,i=0,o=0,l=()=>{
let a=e.getBoundingClientRect(),n=Math.min(2,window.devicePixelRatio||1);
r=Math.max(1,a.width),i=Math.max(1,a.height),e.width=Math.round(r*n),e.height=Math.round(i*n),t.setTransform(n,0,0,n,0,0)}
,u=e=>{
t.clearRect(0,0,r,i);
let l="radial"===n?.28:.24,s=d.current?Math.max(l,Math.min(1,1.5*c.current)):.08,m=h.current?.045:s,g=h.current||a?0:e;
"horizontal"===n?((e,a)=>{
let n=i/2,o=.025*r,l=.95*r;
t.lineCap="round",t.lineJoin="round";
for(let r=0;
r<5;
r+=1){
t.beginPath();
for(let i=0;
i<=180;
i+=1){
let s=i/180,c=o+s*l,d=Math.pow(Math.sin(s*Math.PI),1.28),h=n+(.66*Math.sin(12.5*s+.0034*e+1.18*r)+.27*Math.sin(23*s-.0022*e+.74*r)+.1*Math.sin(37*s+.0013*e-.39*r))*d*((9+48*a)*(1-.09*r));
0===i?t.moveTo(c,h):t.lineTo(c,h)}
t.strokeStyle="rgba(1, 86, 151, ".concat(.12+a*(.33-.035*r),")"),t.lineWidth=1.3-.12*r,t.shadowColor="rgba(1, 86, 151, 0.24)",t.shadowBlur=7+9*a,t.stroke()}
t.shadowBlur=0,t.beginPath(),t.moveTo(o,n),t.lineTo(o+l,n),t.strokeStyle="rgba(1, 86, 151, 0.11)",t.lineWidth=.8,t.stroke()}
)(g,m):((e,a)=>{
let n=r/2,o=i/2,l=.285*Math.min(r,i),s=Math.sin(58e-5*e)*(2.2+3.4*a)*1.55;
t.lineCap="round",t.lineJoin="round";
for(let r=0;
r<5;
r+=1){
t.beginPath();
for(let i=0;
i<=220;
i+=1){
let c=i/220*Math.PI*2,d=(Math.sin(2*c+32e-5*e+.72*r)*(4.1+7.1*a)+Math.sin(5*c-21e-5*e+1.08*r)*(2.1+3.7*a)+1.1*Math.sin(9*c+13e-5*e-.44*r))*1.55,h=l+s+2.8*r+d,u=n+Math.cos(c)*h,m=o+Math.sin(c)*h;
0===i?t.moveTo(u,m):t.lineTo(u,m)}
t.closePath(),t.strokeStyle="rgba(1, 86, 151, ".concat(.11+a*(.22-.018*r),")"),t.lineWidth=1.35-.12*r,t.shadowColor="rgba(1, 86, 151, 0.14)",t.shadowBlur=7+7*a,t.stroke()}
t.shadowBlur=0;
let c=t.createRadialGradient(n,o,.32*l,n,o,1.55*l);
c.addColorStop(0,"rgba(1, 86, 151, 0.025)"),c.addColorStop(.62,"rgba(1, 86, 151, ".concat(.035+.035*a,")")),c.addColorStop(1,"rgba(1, 86, 151, 0)"),t.fillStyle=c,t.fillRect(0,0,r,i)}
)(g,m),a||h.current||(o=window.requestAnimationFrame(u))}
,m=new ResizeObserver(()=>{
l(),(a||h.current)&&u(0)}
);
return m.observe(e),l(),u(0),()=>{
m.disconnect(),window.cancelAnimationFrame(o)}
}
,[o,n]),(0,r.jsx)("span",{
className:"dialogue-signal is-".concat(n).concat(a?" is-active":"").concat(o?" is-paused":"").concat(l?" ".concat(l):""),"aria-hidden":"true",children:(0,r.jsx)("canvas",{
ref:s}
)}
)}
}
}
,e=>{
e.O(0,[146,619,441,255,358],()=>e(e.s=2833)),_N_E=e.O()}
]);
