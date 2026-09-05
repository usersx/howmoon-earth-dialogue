(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{
1943:(e,t,n)=>{
"use strict";
n.d(t,{
GlobeExperience:()=>W}
);
var r=n(5155),a=n(2115),l=n(9762),i=n(1767);
function o(e,t,n){
return Math.min(n,Math.max(t,e))}
function s(e,t){
let n=new RegExp('"'.concat(t,'"\\s*:\\s*')).exec(e);
if(!n||n.index<0)return"";
let r=n.index+n[0].length;
return'"'!==e[r]?"":function(e,t){
let n="",r=!1;
for(let a=t;
a<e.length;
a+=1){
let t=e[a];
if(!r){
if('"'===t)return{
text:n,complete:!0}
;
"\\"===t?r=!0:n+=t;
continue}
if("u"===t){
let t=e.slice(a+1,a+5);
if(!/^[0-9a-f]{
4}
$/i.test(t))return{
text:n,complete:!1}
;
n+=String.fromCharCode(Number.parseInt(t,16)),a+=4}
else{
let e={
'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"	"}
[t];
n+=null!=e?e:t}
r=!1}
return{
text:n,complete:!1}
}
(e,r+1).text}
let c=null;
function u(){
if(c)return c;
let e=window.AudioContext||window.webkitAudioContext;
return e?c=new e:null}
async function d(e,t){
try{
var n;
return(null==(n=(await e.json()).error)?void 0:n.trim())||t}
catch(e){
return t}
}
async function h(e){
var t,n,r,a;
let l,i=AbortSignal.timeout(8e4);
try{
l=await fetch("/api/dialogue",{
method:"POST",headers:{
accept:"text/event-stream","content-type":"application/json"}
,body:JSON.stringify({
sessionId:e.sessionId,promptVersion:"3.3",messages:e.messages.map(e=>{
let{
role:t,content:n}
=e;
return{
role:t,content:n}
}
)}
),signal:e.signal?AbortSignal.any([e.signal,i]):i}
)}
catch(t){
if(null==(n=e.signal)?void 0:n.aborted)throw t;
if(!(null==(r=e.signal)?void 0:r.aborted)&&i.aborted)throw Error("这轮内容生成超时了。你的回答没有丢失，可以立即重试。");
throw Error("暂时无法连接对话服务，请检查网络后重试。",{
cause:t}
)}
if(!l.ok)throw Error(await d(l,"地球暂时没有听清，请再试一次。"));
if(!(null==(t=l.headers.get("content-type"))?void 0:t.includes("text/event-stream")))return await l.json();
if(!l.body)throw Error("对话服务没有返回可读取的数据流。");
let o=l.body.getReader(),c=new TextDecoder,u="",h=null,m=null,g="",p=t=>{
var n,r,a;
let l=t.split("\n").filter(e=>e.startsWith("data:")).map(e=>e.slice(5).trimStart()).join("\n");
if(!l)return;
let i=JSON.parse(l);
if("model-text"===i.type){
let t="string"!=typeof(a=i.text)||0===a.length?"":[s(a,"acknowledgement").trim(),s(a,"question").trim()].filter(Boolean).join("\n\n");
t!==g&&(g=t,null==(n=e.onVisibleText)||n.call(e,g))}
else"reset"===i.type?(g="",null==(r=e.onVisibleText)||r.call(e,"")):"final"===i.type?h=i.response:m=i.error}
;
for(;
;
){
let{
done:e,value:t}
=await o.read();
if(e)break;
let n=(u="".concat(u).concat(c.decode(t,{
stream:!0}
)).replace(/\r\n/g,"\n")).indexOf("\n\n");
for(;
n>=0;
)p(u.slice(0,n)),n=(u=u.slice(n+2)).indexOf("\n\n")}
if((u+=c.decode()).trim()&&p(u),m)throw Error(m);
let f=h;
if(!f)throw Error("对话数据流在完成前中断了，请重试。");
return"question"===f.turn.kind&&(null==(a=e.onVisibleText)||a.call(e,"".concat(f.turn.acknowledgement,"\n\n").concat(f.turn.question))),f}
async function m(e){
let t=AbortSignal.timeout("city"===e.scope?16e3:65e3),n=await fetch("/api/geography",{
method:"POST",headers:{
"content-type":"application/json"}
,body:JSON.stringify({
turn:e.turn,scope:e.scope}
),signal:e.signal?AbortSignal.any([e.signal,t]):t}
);
if(!n.ok)throw Error(await d(n,"城市定位暂时没有完成，请重试。"));
return await n.json()}
async function g(e){
let t=new FormData,n=e.audio.type.includes("mp4")?"m4a":"webm";
t.append("audio",e.audio,"earth-answer.".concat(n)),t.append("localeHint","zh-CN");
let r=await fetch("/api/transcribe",{
method:"POST",body:t,signal:e.signal}
);
if(!r.ok)throw Error(await d(r,"这段声音暂时没能转成文字。"));
return await r.json()}
async function p(){
let e=u();
if(!e)return!1;
try{
return"suspended"===e.state&&await e.resume(),"running"===e.state}
catch(e){
return!1}
}
let f=["audio/webm;
codecs=opus","audio/webm","audio/mp4"];
async function y(){
var e,t,n;
let r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{
}
;
if(!(null==(e=navigator.mediaDevices)?void 0:e.getUserMedia)||"undefined"==typeof MediaRecorder)throw Error("当前浏览器不能录音，请先使用文字回答。 ");
let a=await navigator.mediaDevices.getUserMedia({
audio:{
channelCount:1,echoCancellation:!0,noiseSuppression:!0}
}
),l=f.find(e=>MediaRecorder.isTypeSupported(e)),i=new MediaRecorder(a,l?{
mimeType:l}
:void 0),o=[],s=window.AudioContext||window.webkitAudioContext,c=s?new s:null,u=null!=(t=null==c?void 0:c.createAnalyser())?t:null;
u&&(u.fftSize=1024,u.smoothingTimeConstant=.72);
let d=u&&c?c.createMediaStreamSource(a):null,h=u?new Float32Array(u.fftSize):null,m=0,g=!1,p=!1,y=!1,v=null,b=.006,x=0,w=0,j=performance.now(),k=j+650,M=null!=(n=r.silenceDurationMs)?n:1250;
if(u&&d&&h){
d.connect(u);
let e=t=>{
var n,a,l;
u.getFloatTimeDomainData(h);
let i=0;
for(let e=0;
e<h.length;
e+=1)i+=h[e]*h[e];
let o=Math.sqrt(i/h.length),s=Math.min(80,Math.max(8,t-j));
j=t,!p&&(t<k||o<b+.009)&&(b=Math.min(.018,.86*b+.14*o));
let c=Math.max(.024,b+.014,2.25*b),d=Math.min(1,Math.max(0,(o-b)/.11));
null==(n=r.onLevel)||n.call(r,d),p?o>.78*c?v=null:(null!=v||(v=t),!y&&t-v>=M&&(y=!0,null==(l=r.onSpeechEnd)||l.call(r))):(w=Math.max(o,.985*w),x=o>c?Math.min(420,x+s):Math.max(0,x-1.35*s),(t>=k||w>=.055)&&x>=260&&w>=1.08*c&&(p=!0,null==(a=r.onSpeechStart)||a.call(r))),g||(m=window.requestAnimationFrame(e))}
;
m=window.requestAnimationFrame(e)}
i.addEventListener("dataavailable",e=>{
e.data.size>0&&o.push(e.data)}
),i.start();
let S=()=>{
var e;
g||(g=!0,window.cancelAnimationFrame(m),null==d||d.disconnect(),null==(e=r.onLevel)||e.call(r,0),a.getTracks().forEach(e=>e.stop()),null==c||c.close().catch(()=>void 0))}
;
return{
stop:()=>new Promise((e,t)=>{
i.addEventListener("stop",()=>{
S();
let n=new Blob(o,{
type:i.mimeType||l||"audio/webm"}
);
if(0===n.size)return void t(Error("没有录到声音，请重试或改用文字回答。"));
e(n)}
,{
once:!0}
),i.addEventListener("error",()=>{
S(),t(Error("录音暂时中断，请重试或改用文字回答。"))}
,{
once:!0}
),i.stop()}
),cancel:()=>{
"inactive"!==i.state&&i.stop(),S()}
,hasDetectedSpeech:()=>p}
}
var v=n(7403),b=n(3142),x=n(2506);
let w=[/* ATLAS_ROUTES_START */{"path":"/city/hangzhou","aliases":["杭州","杭州市","HANGZHOU","hangzhou","中国杭州"]},{"path":"/city/nanjing","aliases":["南京","南京市","NANJING","nanjing","中国南京"]},{"path":"/city/harbin","aliases":["哈尔滨","哈尔滨市","HARBIN","harbin","中国哈尔滨"]},{"path":"/city/sanya","aliases":["三亚","三亚市","SANYA","sanya","中国三亚"]},{"path":"/city/guangzhou","aliases":["广州","广州市","GUANGZHOU","guangzhou","中国广州","廣州","Canton"]},{"path":"/city/shenzhen","aliases":["深圳","深圳市","SHENZHEN","shenzhen","中国深圳"]},{"path":"/city/singapore","aliases":["新加坡","新加坡市","SINGAPORE","singapore","新加坡新加坡","狮城"]},{"path":"/city/xiamen","aliases":["厦门","厦门市","XIAMEN","xiamen","中国厦门","廈門","Amoy"]},{"path":"/city/florence","aliases":["佛罗伦萨","佛罗伦萨市","FLORENCE","florence","意大利佛罗伦萨","佛罗伦斯","翡冷翠","Firenze"]},{"path":"/city/paris","aliases":["巴黎","巴黎市","PARIS","paris","法国巴黎","Paris France"]},{"path":"/city/london","aliases":["伦敦","伦敦市","LONDON","london","英国伦敦","London UK"]},{"path":"/city/new-york","aliases":["纽约","纽约市","NEW YORK","new-york","美国纽约","紐約","New York City","NYC"]},{"path":"/city/berlin","aliases":["柏林","柏林市","BERLIN","berlin","德国柏林","Berlin Germany"]},/* ATLAS_ROUTES_END */{"path":"/city/tokyo","aliases":["东京","東京都","东京市","東京","東京都","日本东京","Tokyo","Tokyo Japan"]},{"path":"/city/xian","aliases":["西安","西安市","陕西西安","中国西安","Xi'an","Xian","Xi’an"]},{
path:"/city/beijing",aliases:["北京","北京市","中国北京","中国北京市","北京中国","beijing","beijingchina","chinabeijing"]}
,{
path:"/city/rome",aliases:["罗马","意大利罗马","罗马意大利","rome","roma","romeitaly","italyrome","romaitalia","italiaroma"]}
];
function j(e){
return String(null!=e?e:"").normalize("NFKC").toLocaleLowerCase("en").replace(RegExp("[\\s\\p{
P}
\\p{
S}
]+","gu"),"")}
function k(e){
var t;
let n=j(e);
if(!n)return null;
let r=w.find(e=>{
let{
aliases:t}
=e;
return t.some(e=>j(e)===n)}
);
return null!=(t=null==r?void 0:r.path)?t:null}
let M=[{
slug:"dali",name:"大理",englishName:"DALI",region:"中国 \xb7 云南",airport:"DLU",lat:25.6065,lon:100.2676,reason:"你想恢复精力，但仍希望每天有一点自然与城市的变化。大理的节奏足够慢，也不需要做复杂计划。",tags:["慢节奏","国内低摩擦","自然与城市"],flight:"约 4 小时 \xb7 可直飞",budget:"\xa54,000–7,000 / 人",season:"秋季清爽 \xb7 昼夜温差明显",entry:"境内出行",notice:"集中假期的住宿价格波动较大，时间灵活的话可以错峰出发。",whisper:"把日程留白，风会替你安排一部分。"}
,{
slug:"fukuoka",name:"福冈",englishName:"FUKUOKA",region:"日本 \xb7 九州",airport:"FUK",lat:33.5904,lon:130.4017,reason:"你想离开熟悉的日常，又不想把体力消耗在长距离交通上。福冈有足够的异国感，城市尺度也不压迫。",tags:["近程出境","步行友好","城市松弛感"],flight:"约 5 小时 \xb7 以实际航班为准",budget:"\xa56,000–10,000 / 人",season:"秋季温和 \xb7 适合步行",entry:"需提前确认签证",notice:"当前为概念数据，签证和航班信息需在出发前重新核验。",whisper:"有时候，异国不必很远，只需要换一种日常。"}
,{
slug:"ljubljana",name:"卢布尔雅那",englishName:"LJUBLJANA",region:"斯洛文尼亚",airport:"LJU",lat:46.0569,lon:14.5058,reason:"你要的可能不是纯粹休息，而是一段不用费力安排、每天又有小发现的旅行。",tags:["小城节奏","不意外的欧洲","低规划压力"],flight:"约 15 小时 \xb7 通常需中转",budget:"\xa510,000–16,000 / 人",season:"秋色明显 \xb7 气温逐渐转凉",entry:"需提前确认入境文件",notice:"长途出行通常需要中转，如果只有三天，交通时间占比会过高。",whisper:"我想让你看看，一座不大的城，也可以装下很多漫游。"}
];
function S(e){
let t=M.findIndex(t=>e.includes(t.name)||t.name.includes(e));
return t>=0?t:null}
let E={/* ATLAS_QUICK_START */"hangzhou":{"result":{"destination":{"placeType":"city","city":"杭州","cityEnglishName":"Hangzhou","country":"中国","countryCode":"CN","adminRegion":"杭州","iataCode":"HGH","candidateCoordinates":{"latitude":30.2741,"longitude":120.1551},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["把脚步交给湖岸，把心事留给山风","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"沿西湖的水光走向古寺与湿地，在六段风景里读杭州的留白。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-hangzhou","displayName":"杭州","coordinates":{"latitude":30.2741,"longitude":120.1551},"boundary":null,"landmarks":[]}},"nanjing":{"result":{"destination":{"placeType":"city","city":"南京","cityEnglishName":"Nanjing","country":"中国","countryCode":"CN","adminRegion":"南京","iataCode":"NKG","candidateCoordinates":{"latitude":32.0603,"longitude":118.7969},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["城墙留住秋色，秦淮照见金陵","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从钟山的石阶到秦淮的水影，把南京的六段历史铺成一卷。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-nanjing","displayName":"南京","coordinates":{"latitude":32.0603,"longitude":118.7969},"boundary":null,"landmarks":[]}},"harbin":{"result":{"destination":{"placeType":"city","city":"哈尔滨","cityEnglishName":"Harbin","country":"中国","countryCode":"CN","adminRegion":"哈尔滨","iataCode":"HRB","candidateCoordinates":{"latitude":45.8038,"longitude":126.535},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["沿着江风，走进穹顶与长街的北方","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从红砖穹顶到松花江上的钢桥，六处坐标讲述哈尔滨的不同面孔。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-harbin","displayName":"哈尔滨","coordinates":{"latitude":45.8038,"longitude":126.535},"boundary":null,"landmarks":[]}},"sanya":{"result":{"destination":{"placeType":"city","city":"三亚","cityEnglishName":"Sanya","country":"中国","countryCode":"CN","adminRegion":"三亚","iataCode":"SYX","candidateCoordinates":{"latitude":18.2528,"longitude":109.5119},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["去海风里，把日子过得轻一点","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从亚龙湾的弧线到海岛的渔船，六段海岸风景把三亚慢慢展开。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-sanya","displayName":"三亚","coordinates":{"latitude":18.2528,"longitude":109.5119},"boundary":null,"landmarks":[]}},"guangzhou":{"result":{"destination":{"placeType":"city","city":"广州","cityEnglishName":"Guangzhou","country":"中国","countryCode":"CN","adminRegion":"广州","iataCode":"CAN","candidateCoordinates":{"latitude":23.1291,"longitude":113.2644},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["珠江入夜，岭南灯火正暖","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从西关的花窗走到江边的钢塔，六处景观把广州的新与旧放在同一卷里。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-guangzhou","displayName":"广州","coordinates":{"latitude":23.1291,"longitude":113.2644},"boundary":null,"landmarks":[]}},"shenzhen":{"result":{"destination":{"placeType":"city","city":"深圳","cityEnglishName":"Shenzhen","country":"中国","countryCode":"CN","adminRegion":"深圳","iataCode":"SZX","candidateCoordinates":{"latitude":22.5431,"longitude":114.0579},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["城市向上生长，山海就在身旁","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从福田的天际线走到古城石巷，再把脚步交给海湾的风。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-shenzhen","displayName":"深圳","coordinates":{"latitude":22.5431,"longitude":114.0579},"boundary":null,"landmarks":[]}},"singapore":{"result":{"destination":{"placeType":"city","city":"新加坡","cityEnglishName":"Singapore","country":"新加坡","countryCode":"SG","adminRegion":"新加坡","iataCode":"SIN","candidateCoordinates":{"latitude":1.3521,"longitude":103.8198},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["花园长在天际线里，海风穿过旧街","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从鱼尾狮的水弧到机场里的雨林，在六处坐标看见狮城的过去与想象力。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-singapore","displayName":"新加坡","coordinates":{"latitude":1.3521,"longitude":103.8198},"boundary":null,"landmarks":[]}},"xiamen":{"result":{"destination":{"placeType":"city","city":"厦门","cityEnglishName":"Xiamen","country":"中国","countryCode":"CN","adminRegion":"厦门","iataCode":"XMN","candidateCoordinates":{"latitude":24.4798,"longitude":118.0894},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["把海风，收进一页红砖的日常","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从鼓浪屿的岩石与园林，到学村屋脊和海边双帆，沿着厦门的海岸慢慢展开。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-xiamen","displayName":"厦门","coordinates":{"latitude":24.4798,"longitude":118.0894},"boundary":null,"landmarks":[]}},"florence":{"result":{"destination":{"placeType":"city","city":"佛罗伦萨","cityEnglishName":"Florence","country":"意大利","countryCode":"IT","adminRegion":"佛罗伦萨","iataCode":"FLR","candidateCoordinates":{"latitude":43.7696,"longitude":11.2558},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["沿着阿诺河，走进文艺复兴的光","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从红瓦穹顶到河上老桥，把佛罗伦萨的艺术、街巷与宫殿展开成一页温暖的长卷。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-florence","displayName":"佛罗伦萨","coordinates":{"latitude":43.7696,"longitude":11.2558},"boundary":null,"landmarks":[]}},"paris":{"result":{"destination":{"placeType":"city","city":"巴黎","cityEnglishName":"Paris","country":"法国","countryCode":"FR","adminRegion":"巴黎","iataCode":"PAR","candidateCoordinates":{"latitude":48.8566,"longitude":2.3522},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["沿塞纳河，收藏一座城的光","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从铁塔的细密骨架到教堂的玫瑰窗，在河岸、广场与博物馆之间慢慢读巴黎。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-paris","displayName":"巴黎","coordinates":{"latitude":48.8566,"longitude":2.3522},"boundary":null,"landmarks":[]}},"london":{"result":{"destination":{"placeType":"city","city":"伦敦","cityEnglishName":"London","country":"英国","countryCode":"GB","adminRegion":"伦敦","iataCode":"LON","candidateCoordinates":{"latitude":51.5074,"longitude":-0.1278},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["沿泰晤士河，听见时间的回声","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从钟塔与开合桥梁到博物馆柱廊，把伦敦不同时代的公共生活放在同一条长卷上。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-london","displayName":"伦敦","coordinates":{"latitude":51.5074,"longitude":-0.1278},"boundary":null,"landmarks":[]}},"new-york":{"result":{"destination":{"placeType":"city","city":"纽约","cityEnglishName":"New York","country":"美国","countryCode":"US","adminRegion":"纽约","iataCode":"NYC","candidateCoordinates":{"latitude":40.7128,"longitude":-74.006},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["在天际线之下，找到自己的步速","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从港湾里的自由女神到公园与车站，在纽约的高低、快慢之间，寻找六个可以停留的坐标。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-new-york","displayName":"纽约","coordinates":{"latitude":40.7128,"longitude":-74.006},"boundary":null,"landmarks":[]}},"berlin":{"result":{"destination":{"placeType":"city","city":"柏林","cityEnglishName":"Berlin","country":"德国","countryCode":"DE","adminRegion":"柏林","iataCode":"BER","candidateCoordinates":{"latitude":52.52,"longitude":13.405},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["走过历史的缝隙，看城市重新生长","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"从古典城门到透明穹顶，再到河岸墙面上的艺术，在柏林的街道上读时间留下的层次。","atmosphere":"城市艺术名片"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-berlin","displayName":"柏林","coordinates":{"latitude":52.52,"longitude":13.405},"boundary":null,"landmarks":[]}},/* ATLAS_QUICK_END */"tokyo":{"result":{"destination":{"placeType":"city","city":"东京","cityEnglishName":"Tokyo","country":"日本","countryCode":"JP","adminRegion":"东京都","iataCode":"TYO","candidateCoordinates":{"latitude":35.6762,"longitude":139.6503},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["东京塔下的暮色与浅草寺的朱红屋檐","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"东京塔下的暮色与浅草寺的朱红屋檐","atmosphere":"城市暮色"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-tokyo","displayName":"东京","coordinates":{"latitude":35.6762,"longitude":139.6503},"boundary":null,"landmarks":[]}},"xian":{"result":{"destination":{"placeType":"city","city":"西安","cityEnglishName":"Xi'an","country":"中国","countryCode":"CN","adminRegion":"陕西省","iataCode":"SIA","candidateCoordinates":{"latitude":34.3416,"longitude":108.9398},"confidence":"high","confidenceMessage":null},"display":{"revealNarrative":["永宁门的晚灯、大雁塔与长安的街巷","沿着城市长卷，选择一处想停留的地方。"],"predictionNote":"这是一次直接点亮的快捷旅程。"},"evidenceAnchors":[],"landmarks":[],"visualBrief":{"primaryScene":"永宁门的晚灯、大雁塔与长安的街巷","atmosphere":"城市暮色"}},"geography":{"status":"estimated","provider":"fixed","placeId":"quick-journey-xian","displayName":"西安","coordinates":{"latitude":34.3416,"longitude":108.9398},"boundary":null,"landmarks":[]}},
beijing:{
result:{
destination:{
placeType:"city",city:"北京",cityEnglishName:"Beijing",country:"中国",countryCode:"CN",adminRegion:"北京市",candidateCoordinates:{
latitude:39.9042,longitude:116.4074}
,confidence:"high",confidenceMessage:null}
,display:{
revealNarrative:["不必远行，北京已经替你收好了这些十分钟。","故宫的红墙、钟鼓楼的暮色、天坛回音壁前的安静，都在等你。"],predictionNote:"这是一次直接点亮的快捷旅程。"}
,evidenceAnchors:[],landmarks:[{
name:"故宫",activity:"沿中轴线慢慢走",reason:"红墙与琉璃瓦的层叠，是北京最完整的仪式感。"}
,{
name:"天坛",activity:"在回音壁前说一句话",reason:"圜丘的空旷会把声音还给你。"}
,{
name:"钟鼓楼",activity:"傍晚登楼看暮色",reason:"钟声与鼓声之间，是老城的时间感。"}
],visualBrief:{
coreNeed:"在熟悉的城市里重新获得一段完整的时间",desiredState:"放松而满足",atmosphere:"秋日午后的暖光",primaryScene:"红墙下缓慢移动的树影与远处鸽群",importantElements:["红墙","琉璃瓦","鸽群"],avoidElements:["拥挤人潮","商业招牌"]}
}
,geography:{
status:"verified",provider:"fixed",placeId:"quick-journey-beijing",displayName:"北京",coordinates:{
latitude:39.9042,longitude:116.4074}
,boundary:null,landmarks:[]}
}
,rome:{
result:{
destination:{
placeType:"city",city:"罗马",cityEnglishName:"Rome",country:"意大利",countryCode:"IT",adminRegion:"拉齐奥",candidateCoordinates:{
latitude:41.9028,longitude:12.4964}
,confidence:"high",confidenceMessage:null}
,display:{
revealNarrative:["罗马不需要行程表，街道本身就是展览。","万神殿的光、许愿池的水声、斗兽场的黄昏，都值得你慢慢走过。"],predictionNote:"这是一次直接点亮的快捷旅程。"}
,evidenceAnchors:[],landmarks:[{
name:"万神殿",activity:"抬头看穹顶的光孔",reason:"一束光从穹顶落下，两千年没有变过。"}
,{
name:"特雷维喷泉",activity:"背对喷泉许愿",reason:"水声与石像的巴洛克戏剧性。"}
,{
name:"斗兽场",activity:"黄昏绕外圈走一圈",reason:"夕阳把拱门染成金色的时候最美。"}
],visualBrief:{
coreNeed:"在充满历史感的街道里获得松弛的漫游",desiredState:"好奇而自在",atmosphere:"黄昏金色的暖光",primaryScene:"石板街道尽头的穹顶与鸽群",importantElements:["穹顶","石板街","喷泉"],avoidElements:["车流","现代招牌"]}
}
,geography:{
status:"verified",provider:"fixed",placeId:"quick-journey-rome",displayName:"罗马",coordinates:{
latitude:41.9028,longitude:12.4964}
,boundary:null,landmarks:[]}
}
}
,N=[{
code:"PEK",lat:40.0799,lon:116.6031}
,{
code:"PKX",lat:39.5098,lon:116.4105}
,{
code:"DLU",lat:25.6494,lon:100.3194}
,{
code:"FUK",lat:33.5859,lon:130.4507}
,{
code:"LJU",lat:46.2237,lon:14.4576}
,{
code:"SIN",lat:1.3644,lon:103.9915}
,{
code:"BKK",lat:13.69,lon:100.7501}
,{
code:"DXB",lat:25.2532,lon:55.3657}
,{
code:"LHR",lat:51.47,lon:-.4543}
,{
code:"CDG",lat:49.0097,lon:2.5479}
,{
code:"JFK",lat:40.6413,lon:-73.7781}
,{
code:"SFO",lat:37.6213,lon:-122.379}
,{
code:"SYD",lat:-33.9399,lon:151.1753}
,{
code:"CPT",lat:-33.97,lon:18.5972}
,{
code:"GRU",lat:-23.4356,lon:-46.4731}
],C=[{
name:"中国",kind:"country",lat:36,lon:103}
,{
name:"蒙古",kind:"country",lat:47,lon:104}
,{
name:"俄罗斯",kind:"country",lat:61,lon:89}
,{
name:"印度",kind:"country",lat:22,lon:79}
,{
name:"日本",kind:"country",lat:38,lon:138}
,{
name:"印度尼西亚",kind:"country",lat:-3,lon:118}
,{
name:"澳大利亚",kind:"country",lat:-25,lon:134}
,{
name:"加拿大",kind:"country",lat:57,lon:-106}
,{
name:"美国",kind:"country",lat:38,lon:-99}
,{
name:"墨西哥",kind:"country",lat:23,lon:-102}
,{
name:"巴西",kind:"country",lat:-11,lon:-52}
,{
name:"阿根廷",kind:"country",lat:-38,lon:-64}
,{
name:"南非",kind:"country",lat:-29,lon:24}
,{
name:"埃及",kind:"country",lat:27,lon:30}
,{
name:"沙特阿拉伯",kind:"country",lat:24,lon:45}
,{
name:"伊朗",kind:"country",lat:32,lon:53}
,{
name:"英国",kind:"country",lat:54,lon:-2}
,{
name:"法国",kind:"country",lat:46,lon:2}
,{
name:"德国",kind:"country",lat:51,lon:10}
,{
name:"西班牙",kind:"country",lat:40,lon:-4}
,{
name:"意大利",kind:"country",lat:42,lon:12}
,{
name:"北冰洋",kind:"ocean",lat:76,lon:5}
,{
name:"大西洋",kind:"ocean",lat:8,lon:-32}
,{
name:"印度洋",kind:"ocean",lat:-20,lon:76}
,{
name:"太平洋",kind:"ocean",lat:4,lon:-155}
,{
name:"太平洋",kind:"ocean",lat:5,lon:165}
,{
name:"南冰洋",kind:"ocean",lat:-61,lon:35}
];
function R(e){
return e*Math.PI/180}
function I(e,t,n){
return Math.min(n,Math.max(t,e))}
function P(e,t){
let n=R(e),r=R(t),a=Math.cos(n);
return[a*Math.cos(r),Math.sin(n),a*Math.sin(r)]}
let A=i.objects.countries;
function T(e){
return e.map(e=>e.map(e=>{
let[t,n]=e;
return P(n,t)}
))}
let L=T((0,l.A)(i,A,(e,t)=>e===t).coordinates),B=T((0,l.A)(i,A,(e,t)=>e!==t).coordinates),D=[...Array.from({
length:7}
,(e,t)=>-60+20*t).map(e=>Array.from({
length:121}
,(e,t)=>-180+3*t).map(t=>P(e,t))),...Array.from({
length:18}
,(e,t)=>-180+20*t).map(e=>Array.from({
length:89}
,(e,t)=>-88+2*t).map(t=>P(t,e)))],O={
lat:35,lon:104}
,F=[{
lat:48.8566,lon:2.3522}
,{
lat:25.2048,lon:55.2708}
,{
lat:35.6762,lon:139.6503}
,{
lat:1.3521,lon:103.8198}
,{
lat:-33.8688,lon:151.2093}
].map(e=>(function(e,t){
let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:112,r=P(e.lat,e.lon),a=P(t.lat,t.lon),l=Math.acos(I(r[0]*a[0]+r[1]*a[1]+r[2]*a[2],-1,1)),i=Math.sin(l);
if(l<1e-4||1e-4>Math.abs(i))return[r,a];
let o=R(e.lat),s=R(e.lon),c=[-Math.sin(o)*Math.cos(s),Math.cos(o),-Math.sin(o)*Math.sin(s)],u=.15+.06*Math.min(l/Math.PI,.7)+.12*Math.max(0,-(a[0]*c[0]+a[1]*c[1]+a[2]*c[2])),d=.15+.15*Math.min(l/Math.PI,.7);
return Array.from({
length:n+1}
,(e,t)=>{
let o=t/n,s=Math.sin((1-o)*l)/i,h=Math.sin(o*l)/i,m=Math.sin(Math.PI*o),g=[r[0]*s+a[0]*h,r[1]*s+a[1]*h,r[2]*s+a[2]*h],p=[g[0]+c[0]*u*m,g[1]+c[1]*u*m,g[2]+c[2]*u*m],f=Math.hypot(...p),y=1+m*d;
return[p[0]/f*y,p[1]/f*y,p[2]/f*y]}
)}
)(O,e));
function U(e){
let t=I(e,0,1);
return t*t*t*(t*(6*t-15)+10)}
function z(e,t,n,r,a){
return Array.from({
length:r}
,(l,i)=>{
let o=(i+2)/(r+2);
return Array.from({
length:121}
,(r,l)=>{
let i=l/120*Math.PI*2,s=1+.075*Math.sin(3*i+a)+.035*Math.sin(7*i-.7*a);
return P(e.lat+Math.sin(i)*t*o*s,e.lon+Math.cos(i)*n*o*s)}
)}
)}
let q=[...z({
lat:31,lon:84}
,9,31,19,.6),...z({
lat:43,lon:79}
,5.5,20,11,1.9),...z({
lat:48,lon:91}
,7,16,10,3.1),...z({
lat:59,lon:106}
,12,28,12,4.2),...z({
lat:37,lon:138}
,8,7,9,5.4),...z({
lat:18,lon:104}
,13,10,11,6.3),...z({
lat:33,lon:50}
,7,17,9,7.1),...z({
lat:46,lon:10}
,4,12,9,8.2),...z({
lat:1,lon:37}
,13,8,9,9.4),...z({
lat:-25,lon:135}
,11,22,10,10.6),...z({
lat:47,lon:-114}
,22,8,13,11.8)];
function X(e){
let{
focus:t,resultTarget:n,resultBoundary:l,resultLabel:i,revealResult:s,snapToFocus:c,motionMode:u,viewMode:d,autoRotate:h,canDrag:m,introContentBottom:g,dialoguePanelLeft:p,topbarBottom:f,onResultClick:y}
=e,v=(0,a.useRef)(null),b=(0,a.useRef)(null),x=(0,a.useRef)(null),w=(0,a.useRef)(null),j=(0,a.useRef)(d),k=(0,a.useRef)(+("main"===d)),M=(0,a.useRef)(0),S=(0,a.useMemo)(()=>{
var e;
return null!=(e=null==l?void 0:l.rings.map(e=>e.map(e=>P(e.lat,e.lon))))?e:[]}
,[l]),E=(0,a.useRef)(t.lon),A=(0,a.useRef)(t.lon),T=(0,a.useRef)(I(t.lat,-58,58)),z=(0,a.useRef)(I(t.lat,-58,58));
return(0,a.useEffect)(()=>{
E.current=t.lon,T.current=I(t.lat,-58,58),c&&(A.current=t.lon,z.current=I(t.lat,-58,58))}
,[t.lat,t.lon,c]),(0,a.useEffect)(()=>{
!h&&m&&(E.current=A.current,T.current=z.current)}
,[h,m]),(0,a.useEffect)(()=>{
"transition"===d&&"transition"!==j.current?M.current=performance.now():"main"===d?k.current=1:"intro"===d&&(k.current=0),j.current=d}
,[d]),(0,a.useEffect)(()=>{
let e=v.current;
if(!e)return;
let t=e.getContext("2d");
if(!t)return;
let r=window.matchMedia("(prefers-reduced-motion: reduce)").matches,a=0,l=0,i=0,c=1,d=!1,y=-1,X=0,J=0,V=0,W=0,Y=0,K=0,G=1,H=0,_=1,$=()=>{
let n=e.getBoundingClientRect();
c=Math.min(window.devicePixelRatio||1,2),l=n.width,i=n.height,e.width=Math.max(1,Math.floor(l*c)),e.height=Math.max(1,Math.floor(i*c)),t.setTransform(c,0,0,c,0,0)}
,Q=new ResizeObserver($);
Q.observe(e),$();
let Z=(e,t,n,r,a)=>{
let[l,i,o]=e,s=l*G+o*K,c=H*i+_*s;
return{
x:r+t*(o*G-l*K),y:a-n*(_*i-H*s),visible:c>0,depth:c}
}
,ee=function(e,n,r,a,l){
let i=arguments.length>5&&void 0!==arguments[5]&&arguments[5],o=!1;
t.beginPath(),e.forEach(e=>{
let s=Z(e,n,r,a,l),c=((s.x-a)/n)**2+((s.y-l)/r)**2>1.002;
if(!s.visible&&!(i&&c)){
o=!1;
return}
o?t.lineTo(s.x,s.y):(t.moveTo(s.x,s.y),o=!0)}
)}
,et=e=>{
let c=Y>0?Math.min(e-Y,40):16;
Y=e,h&&!d&&(E.current+=.0024*c,T.current=0);
let m=(E.current-A.current+540)%360-180,y=T.current-z.current,v=d?.34:.035,X=d?.34:.045;
A.current+=m*v,z.current+=y*X;
let J="locked"===u?function(e){
let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];
return t?{
longitude:0,latitude:0}
:{
longitude:.12*Math.sin(e/2400),latitude:.055*Math.sin(e/3100+.7)}
}
(e,r):{
longitude:0,latitude:0}
,V=R(A.current+J.longitude),W=R(z.current+J.latitude);
K=Math.sin(V),G=Math.cos(V),H=Math.sin(W),_=Math.cos(W),t.clearRect(0,0,l,i);
let $=l<760;
"transition"===j.current&&(k.current=I((e-M.current)/1700,0,1));
let Q=k.current,en=U(Q),er=1-U(I(Q/.72,0,1)),ea=U(I((Q-.34)/.66,0,1)),el=function(e,t){
let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:0,a=e<760,l=Math.min(e*(a?.4:.3),.4*t),i=e*(a?.5:.365),s=t*(a?.38:.48);
if(e<901)return{
radius:l,centerX:i,centerY:s}
;
let c=Number.isFinite(n)&&n>0,u=Number.isFinite(r)&&r>0,d=o(.025*e,28,44),h=o(.04*e,36,80),m=o(.02*t,14,20),g=o(.025*t,16,28),p=u?r+m:0,f=Math.min(l,c?Math.max(0,n-d-h)/2:1/0,u?Math.max(0,t-g-p)/2:1/0),y=c?o(i,h+f,n-d-f):i,v=u?o(s,p+f,t-g-f):s;
return{
radius:f,centerX:y,centerY:v}
}
(l,i,p,f),ei=el.radius,eo=el.centerX,es=el.centerY,ec=function(e,t){
let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,r=e<760;
if(e<901)return{
radiusX:e*(r?.97:.606),radiusY:t*(r?.38:.454),centerX:.5*e,centerY:t*(r?.9:.873)}
;
let a=o(.83+(t-640)/280*.17,.83,1),l=o(.035*t,20,34),i=(Number.isFinite(n)&&n>0?n:.52*t)+l,s=Math.min(.454*t*a,Math.max(0,t-66-i));
return{
radiusX:.606*e*a,radiusY:s,centerX:.5*e,centerY:i+s}
}
(l,i,g),eu=ec.radiusX,ed=ec.radiusY,eh=ec.centerX,em=ec.centerY,eg=eu+(ei-eu)*en,ep=ed+(ei-ed)*en,ef=eh+(eo-eh)*en,ey=em+(es-em)*en,ev=Z(P(O.lat,O.lon),eg,ep,ef,ey),eb=1-U(I(Q/.42,0,1));
x.current&&(x.current.style.left="".concat(ev.x,"px"),x.current.style.top="".concat(ev.y,"px"),x.current.style.opacity="".concat(eb)),w.current&&(w.current.style.left="".concat(ev.x+26,"px"),w.current.style.top="".concat(ev.y+50,"px"),w.current.style.opacity="".concat(eb)),t.save(),t.shadowColor="rgba(37, 38, 36, 0.08)",t.shadowBlur=34,t.beginPath(),t.ellipse(ef,ey,1.01*eg,1.01*ep,0,0,2*Math.PI),t.fillStyle="rgba(37, 38, 36, 0.018)",t.fill(),t.restore(),t.beginPath(),t.ellipse(ef,ey,eg,ep,0,0,2*Math.PI),t.fillStyle="#f3f1ea",t.fill();
let ex=Math.max(eg,ep),ew=t.createRadialGradient(ef-.38*eg,ey-.4*ep,.05*ex,ef,ey,ex);
if(ew.addColorStop(0,"rgba(37, 38, 36, 0.002)"),ew.addColorStop(.48,"rgba(37, 38, 36, 0.006)"),ew.addColorStop(.82,"rgba(37, 38, 36, 0.014)"),ew.addColorStop(1,"rgba(37, 38, 36, 0.026)"),t.beginPath(),t.ellipse(ef,ey,eg,ep,0,0,2*Math.PI),t.fillStyle=ew,t.fill(),t.save(),t.beginPath(),t.ellipse(ef,ey,eg,ep,0,0,2*Math.PI),t.clip(),t.strokeStyle="rgba(37, 38, 36, 0.085)",t.lineWidth=.55,D.forEach(e=>{
ee(e,eg,ep,ef,ey),t.stroke()}
),er>0&&(t.save(),t.globalAlpha=er,t.strokeStyle="rgba(37, 38, 36, 0.105)",t.lineWidth=.48,q.forEach(e=>{
ee(e,eg,ep,ef,ey),t.stroke()}
),t.restore()),B.forEach(e=>{
ee(e,eg,ep,ef,ey),t.strokeStyle="rgba(37, 38, 36, 0.52)",t.lineWidth=.62,t.stroke()}
),L.forEach(e=>{
ee(e,eg,ep,ef,ey),t.strokeStyle="rgba(37, 38, 36, 0.82)",t.lineWidth=.92,t.stroke()}
),t.save(),t.globalAlpha=ea,C.forEach(e=>{
let n=Z(P(e.lat,e.lon),eg,ep,ef,ey);
if(!n.visible||n.depth<.18)return;
let r=I((n.depth-.18)/.5,0,1);
t.save(),t.textAlign="center",t.textBaseline="middle",t.font="ocean"===e.kind?"400 ".concat($?9:11,'px "Songti SC", "STSong", serif'):"500 ".concat($?8:9.5,'px "PingFang SC", "Microsoft YaHei", sans-serif'),t.fillStyle="ocean"===e.kind?"rgba(37, 38, 36, ".concat(.28*r,")"):"rgba(37, 38, 36, ".concat(.48*r,")"),t.fillText(e.name,n.x,n.y),t.restore()}
),N.forEach(e=>{
let n=Z(P(e.lat,e.lon),eg,ep,ef,ey);
n.visible&&(t.beginPath(),t.arc(n.x,n.y,1.1,0,2*Math.PI),t.fillStyle="rgba(37, 38, 36, 0.3)",t.fill())}
),t.restore(),n&&s){
let r=Z(P(n.lat,n.lon),eg,ep,ef,ey);
if(r.visible){
S.length>0&&(t.save(),t.strokeStyle="rgba(1, 86, 151, 0.96)",t.lineWidth=2.2,t.shadowColor="rgba(1, 86, 151, 0.36)",t.shadowBlur=12,S.forEach(e=>{
ee(e,eg,ep,ef,ey),t.stroke()}
),t.restore());
for(let n=0;
n<3;
n+=1){
let a=((e/2100+n/3)%1+1)%1,l=13+27*a;
t.beginPath(),t.arc(r.x,r.y,l,0,2*Math.PI),t.strokeStyle="rgba(1, 86, 151, ".concat(.62*(1-a),")"),t.lineWidth=1.5,t.stroke()}
t.beginPath(),t.arc(r.x,r.y,5.2,0,2*Math.PI),t.fillStyle="#015697",t.shadowColor="rgba(1, 86, 151, 0.58)",t.shadowBlur=18,t.fill(),t.shadowBlur=0,b.current&&(b.current.style.left="".concat(r.x,"px"),b.current.style.top="".concat(r.y,"px"),b.current.style.opacity="1",b.current.style.pointerEvents="auto")}
else b.current&&(b.current.style.opacity="0",b.current.style.pointerEvents="none")}
else b.current&&(b.current.style.opacity="0",b.current.style.pointerEvents="none");
t.restore(),er>0&&(t.save(),t.globalAlpha=er,t.lineCap="round",t.lineJoin="round",F.forEach((n,r)=>{
ee(n,eg,ep,ef,ey,!0),t.strokeStyle="rgba(1, 86, 151, 0.1)",t.lineWidth=5,t.shadowColor="rgba(1, 86, 151, 0.14)",t.shadowBlur=8,t.stroke(),t.shadowBlur=0,t.setLineDash([3,7]),t.lineDashOffset=-(e/38+4.5*r),ee(n,eg,ep,ef,ey,!0),t.strokeStyle="rgba(1, 86, 151, 0.7)",t.lineWidth=1.35,t.stroke(),t.setLineDash([]);
let a=Z(n[n.length-1],eg,ep,ef,ey);
a.visible&&(t.beginPath(),t.arc(a.x,a.y,2.4,0,2*Math.PI),t.fillStyle="#015697",t.fill(),t.beginPath(),t.arc(a.x,a.y,6.2,0,2*Math.PI),t.strokeStyle="rgba(1, 86, 151, 0.16)",t.lineWidth=1,t.stroke());
let l=((e/3300+.17*r)%1+1)%1,i=Math.min(n.length-1,Math.floor(l*n.length)),o=Z(n[i],eg,ep,ef,ey);
o.visible&&(t.beginPath(),t.arc(o.x,o.y,2.4,0,2*Math.PI),t.fillStyle="#015697",t.shadowColor="rgba(1, 86, 151, 0.55)",t.shadowBlur=10,t.fill(),t.shadowBlur=0)}
),t.restore());
let ej=t.createLinearGradient(ef-eg,ey-ep,ef+eg,ey+ep);
ej.addColorStop(0,"rgba(37, 38, 36, 0.12)"),ej.addColorStop(.42,"rgba(37, 38, 36, 0.22)"),ej.addColorStop(1,"rgba(37, 38, 36, 0.46)"),t.beginPath(),t.ellipse(ef,ey,eg+.6,ep+.6,0,0,2*Math.PI),t.strokeStyle=ej,t.lineWidth=1.6,t.stroke(),a=window.requestAnimationFrame(et)}
,en=t=>{
d&&t.pointerId===y&&(d=!1,e.classList.remove("is-dragging"),h?(E.current+=2.2*V,T.current=I(T.current+1.4*W,-58,58)):(E.current=A.current,T.current=z.current),e.hasPointerCapture(t.pointerId)&&e.releasePointerCapture(t.pointerId))}
,er=t=>{
0===t.button&&m&&(d=!0,y=t.pointerId,X=t.clientX,J=t.clientY,V=0,W=0,e.classList.add("is-dragging"),e.setPointerCapture(t.pointerId))}
,ea=e=>{
if(!d||e.pointerId!==y)return;
let t=e.clientX-X,n=e.clientY-J;
X=e.clientX,J=e.clientY,V=-(.23*t),W=.16*n,E.current+=V,T.current=I(T.current+W,-58,58)}
;
return e.addEventListener("pointerdown",er),e.addEventListener("pointermove",ea),e.addEventListener("pointerup",en),e.addEventListener("pointercancel",en),a=window.requestAnimationFrame(et),()=>{
Q.disconnect(),e.removeEventListener("pointerdown",er),e.removeEventListener("pointermove",ea),e.removeEventListener("pointerup",en),e.removeEventListener("pointercancel",en),window.cancelAnimationFrame(a)}
}
,[h,m,p,g,u,S,n,s,f]),(0,r.jsxs)(r.Fragment,{
children:[(0,r.jsx)("canvas",{
ref:v,className:"globe-canvas is-".concat(u),role:"img","aria-label":m&&h?"正在匀速旋转、可拖动查看的互动地球":m?"已暂停自动旋转、仍可拖动查看的互动地球":"locked"===u?"已锁定推荐地点的地球":"互动地球"}
),"main"!==d&&(0,r.jsxs)(r.Fragment,{
children:[(0,r.jsxs)("div",{
ref:x,className:"start-traveler","aria-hidden":"true",children:[(0,r.jsx)("span",{
className:"start-traveler-head"}
),(0,r.jsx)("span",{
className:"start-traveler-body"}
),(0,r.jsx)("span",{
className:"start-traveler-shadow"}
),(0,r.jsx)("span",{
className:"start-traveler-pulse"}
)]}
),(0,r.jsx)("span",{
ref:w,className:"start-world-caption","aria-hidden":"true",children:"YOU ARE HERE"}
)]}
),n&&(0,r.jsxs)("button",{
ref:b,className:"destination-hotspot",type:"button",onClick:y,"aria-label":i?"进入地球为你点亮的".concat(i.country,"-").concat(i.city):"进入地球为你点亮的地方",children:[(0,r.jsx)("span",{
className:"destination-hotspot-core","aria-hidden":!0}
),i&&(0,r.jsxs)("span",{
className:"destination-hotspot-card",children:[i.country," - ",i.city]}
)]}
)]}
)}
function J(e){
let{
leaving:t,onStart:n,onContentBottomChange:l}
=e,i=(0,a.useRef)(null);
return(0,a.useEffect)(()=>{
let e=i.current;
if(!e)return;
let t=()=>{
l(Math.round(e.getBoundingClientRect().bottom))}
,n=new ResizeObserver(t);
return n.observe(e),window.addEventListener("resize",t),t(),()=>{
n.disconnect(),window.removeEventListener("resize",t)}
}
,[l]),(0,r.jsxs)("main",{
className:"start-page".concat(t?" is-leaving":""),children:[(0,r.jsxs)("header",{
className:"start-header",children:[(0,r.jsx)("div",{
className:"start-brand","aria-label":"云中客",children:(0,r.jsx)("span",{
className:"start-brand-cn",children:"云中客"}
)}
),(0,r.jsx)("span",{
className:"start-edition",children:"YOUR PLACE \xb7 THE WORLD"}
)]}
),(0,r.jsxs)("section",{
ref:i,className:"start-copy","aria-labelledby":"start-title",children:[(0,r.jsx)("div",{
className:"start-orbit-mark","aria-hidden":"true",children:(0,r.jsx)("span",{
}
)}
),(0,r.jsxs)("h1",{
id:"start-title",children:["从你所在的地方",(0,r.jsx)("br",{
}
),"走向世界"]}
),(0,r.jsxs)("div",{
className:"start-mode-choices","aria-label":"选择交流方式",children:[(0,r.jsxs)("button",{
className:"start-mode-choice is-primary",type:"button",onClick:()=>n("voice"),disabled:t,children:[(0,r.jsx)("span",{
className:"start-mode-icon is-voice","aria-hidden":"true",children:(0,r.jsxs)("svg",{
className:"start-voice-icon",viewBox:"0 0 24 24",fill:"none",focusable:"false",children:[(0,r.jsx)("rect",{
x:"9",y:"3",width:"6",height:"11",rx:"3"}
),(0,r.jsx)("path",{
d:"M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4M9 21h6"}
)]}
)}
),(0,r.jsxs)("span",{
children:[(0,r.jsx)("strong",{
children:"我更喜欢语音交流"}
),(0,r.jsx)("small",{
children:"听地球说，也直接说出回答"}
)]}
),(0,r.jsx)("i",{
"aria-hidden":"true",children:"↗"}
)]}
),(0,r.jsxs)("button",{
className:"start-mode-choice is-primary",type:"button",onClick:()=>n("text"),disabled:t,children:[(0,r.jsx)("span",{
className:"start-mode-icon is-text","aria-hidden":"true",children:"文"}
),(0,r.jsxs)("span",{
children:[(0,r.jsx)("strong",{
children:"我更喜欢文字交流"}
),(0,r.jsx)("small",{
children:"阅读问题，用文字慢慢回答"}
)]}
),(0,r.jsx)("i",{
"aria-hidden":"true",children:"↗"}
)]}
)]}
)]}
)]}
)}
function V(e){
let{
status:t,message:n,onBegin:a,onUseText:l}
=e;
return(0,r.jsx)("section",{
className:"voice-journey-gate",role:"dialog","aria-modal":"true","aria-labelledby":"voice-journey-title","aria-describedby":"voice-journey-description",children:(0,r.jsxs)("div",{
className:"voice-journey-card",children:[(0,r.jsx)("span",{
className:"voice-journey-kicker",children:"VOICE JOURNEY"}
),(0,r.jsx)("div",{
className:"voice-journey-orbit","aria-hidden":"true",children:(0,r.jsx)("i",{
}
)}
),(0,r.jsx)("h2",{
id:"voice-journey-title",children:"准备好，让地球先开口。"}
),(0,r.jsx)("p",{
id:"voice-journey-description",children:"地球会与你进行一段旅行咨询。开始后会播放声音，并在轮到你时聆听回答。"}
),(0,r.jsxs)("ul",{
children:[(0,r.jsxs)("li",{
children:[(0,r.jsx)("span",{
"aria-hidden":"true",children:"01"}
),"开启地球的声音"]}
),(0,r.jsxs)("li",{
children:[(0,r.jsx)("span",{
"aria-hidden":"true",children:"02"}
),"允许使用麦克风"]}
)]}
),n&&(0,r.jsx)("p",{
className:"voice-journey-message",role:"alert",children:n}
),(0,r.jsxs)("div",{
className:"voice-journey-actions",children:[(0,r.jsx)("button",{
type:"button",className:"is-primary",onClick:a,disabled:"requesting"===t,children:"requesting"===t?"正在准备声音与麦克风……":"error"===t?"重新允许并开始":"开始这段历程"}
),(0,r.jsx)("button",{
type:"button",onClick:l,disabled:"requesting"===t,children:"改用文字"}
)]}
),(0,r.jsx)("small",{
children:"权限仅用于本次对话，可随时暂停。"}
)]}
)}
)}
function W(){
var e,t,n;
let[l]=(0,a.useState)(()=>({
sessionId:(0,b.GH)(),messages:[(0,b.Cx)()],result:null,geography:null,ready:!0,returningFromCity:!1}
)),[i,o]=(0,a.useState)(l.returningFromCity),[s,c]=(0,a.useState)(!1),[f,w]=(0,a.useState)(0),[j,N]=(0,a.useState)(0),[C,R]=(0,a.useState)(0),[I,P]=(0,a.useState)(l.returningFromCity?"result-idle":"intro"),[A,T]=(0,a.useState)(()=>l.result?S(l.result.destination.city):null),[L,B]=(0,a.useState)(l.messages),[D,F]=(0,a.useState)(l.sessionId),[U,z]=(0,a.useState)(l.result),[q,W]=(0,a.useState)(l.geography),[Y,K]=(0,a.useState)(""),[G,H]=(0,a.useState)("text"),[_,$]=(0,a.useState)(null),[Q]=(0,a.useState)(l.ready),[Z,ee]=(0,a.useState)("text"),[et,en]=(0,a.useState)(!1),[er,ea]=(0,a.useState)(!!l.result),[el,ei]=(0,a.useState)(!1),[eo,es]=(0,a.useState)("我已经收到了你的回答"),[,ec]=(0,a.useState)(""),[eu,ed]=(0,a.useState)(0),[eh,em]=(0,a.useState)(!1),[eg,ep]=(0,a.useState)(null),[ef,ey]=(0,a.useState)(!1),[ev,eb]=(0,a.useState)("idle"),[ex,ew]=(0,a.useState)(null),ej=(0,a.useRef)(!1);
(0,a.useLayoutEffect)(()=>{
if(ej.current)return;
let e=new URLSearchParams(window.location.search),t="1"===e.get("restart"),n="1"===e.get("return"),r=e.get("fly");
if(!t&&!n&&!r)return;
ej.current=!0,window.history.replaceState(null,"","/");
let a=r?E[r]:void 0;
if(a){
F((0,b.GH)()),B([(0,b.Cx)()]),z(a.result),W(a.geography),T(null),ea(!0),o(!0),P("result-reveal");
let e=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
eM.current.push(window.setTimeout(()=>P(e=>"result-reveal"===e?"result-idle":e),e?80:900));
return}
let l=n&&!t?(0,b.hs)():null;
if((null==l?void 0:l.result)&&l.geography){
F(l.sessionId),B(l.messages),z(l.result),W(l.geography),T(S(l.result.destination.city)),ea(!0),o(!0),P("result-idle");
return}
(0,b.a2)()}
,[]);
let ek=(0,a.useRef)(0),eM=(0,a.useRef)([]),eS=(0,a.useRef)(null),eE=(0,a.useRef)(null),eN=(0,a.useRef)(null),eC=(0,a.useRef)(null),eR=(0,a.useRef)("dialogue-ready"),eI=(0,a.useRef)("dialogue-ready"),eP=(0,a.useRef)("text"),eA=(0,a.useRef)(!1),eT=(0,a.useRef)(!1),eL=(0,a.useRef)(()=>void 0),eB=(0,a.useRef)(()=>void 0),eD=(0,a.useRef)(null),eO=(0,a.useRef)(null),eF=null===A?null:M[A],eU=U?null!=(e=k(U.destination.city))?e:k(U.destination.cityEnglishName):null,ez=U?(0,x.y)(U.destination.city,U.destination.cityEnglishName):null,eq=(0,a.useMemo)(()=>q?{
lat:q.coordinates.latitude,lon:q.coordinates.longitude}
:null,[q]),eX=(0,a.useMemo)(()=>(null==q?void 0:q.boundary)?{
sourceId:q.boundary.sourceId,rings:q.boundary.rings.map(e=>e.map(e=>({
lat:e.latitude,lon:e.longitude}
)))}
:null,[q]),eJ=null!=eq?eq:eF,eV="result-reveal"===I||"result-idle"===I||"routing"===I,eW="result-reveal"===I||"result-idle"===I||"routing"===I,eY="thinking"===I||"validating-location"===I,eK=i?"main":s?"transition":"intro",eG=i&&eV&&eJ?eJ:O,eH=!i||el?"still":eV?"locked":"dialogue",e_=(0,a.useMemo)(()=>{
var e;
return null!=(e=[...L].reverse().find(e=>"assistant"===e.role))?e:null}
,[L]),e$=el?null!=(t=null==e_?void 0:e_.content)?t:"对话已经暂停。":eY?eo:null!=(n=null==e_?void 0:e_.content)?n:"正在准备第一道问题……",eQ=()=>{
eM.current.forEach(e=>window.clearTimeout(e)),eM.current=[]}
;
(0,a.useEffect)(()=>()=>{
var e,t,n,r;
ek.current+=1,eQ(),null==(e=eS.current)||e.cancel(),null==(t=eE.current)||t.abort(),null==(n=eN.current)||n.abort(),null==(r=eC.current)||r.call(eC)}
,[]),(0,a.useEffect)(()=>{
if("thinking"!==I)return;
let e=window.setTimeout(()=>es("正在理解你的回答"),1600),t=window.setTimeout(()=>es("思考中..."),3800);
return()=>{
window.clearTimeout(e),window.clearTimeout(t)}
}
,[I]),(0,a.useEffect)(()=>{
Q&&er&&D&&0!==L.length&&(0,b.iX)({
sessionId:D,messages:L,result:U,geography:q}
)}
,[q,U,er,L,D,Q]),(0,a.useLayoutEffect)(()=>{
if(!i||!er||eV)return;
let e=eD.current;
if(!e)return;
let t=()=>{
let t=Math.round(e.getBoundingClientRect().left);
N(e=>e===t?e:t)}
,n=new ResizeObserver(t);
return n.observe(e),window.addEventListener("resize",t),t(),()=>{
n.disconnect(),window.removeEventListener("resize",t)}
}
,[er,Z,eV,i]),(0,a.useLayoutEffect)(()=>{
let e=eO.current;
if(!e)return;
let t=()=>{
let t=Math.round(e.getBoundingClientRect().bottom);
R(e=>e===t?e:t)}
,n=new ResizeObserver(t);
return n.observe(e),window.addEventListener("resize",t),t(),()=>{
n.disconnect(),window.removeEventListener("resize",t)}
}
,[]);
let eZ=(0,a.useCallback)(function(e){
var t;
let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"dialogue-ready",r=ek.current;
if(null==(t=eC.current)||t.call(eC),eR.current=n,ep(null),!eA.current){
ed(0),P(n);
return}
let a=!1;
eC.current=function(e){
let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{
}
,n=new AbortController,r=new Set,a=new Set,l=null,i=null,o=!1,s=!1,c=!1,h=!1,m=!1,g=!1,f=()=>{
var e,n;
o||g||!m||r.size>0||(g=!0,null==(e=t.onLevel)||e.call(t,0),null==(n=t.onEnd)||n.call(t))}
;
(async()=>{
var y,v,b,x;
try{
let g=await fetch("/api/tts",{
method:"POST",headers:{
"Content-Type":"application/json"}
,body:JSON.stringify({
text:e}
),signal:n.signal}
);
if(!g.ok)throw Error(await d(g,"正式语音暂时不可用。"));
if(!g.body)throw Error("正式语音没有返回可播放的音频流。");
let v=Number(g.headers.get("X-Audio-Sample-Rate")),b=g.headers.get("X-Audio-Sample-Format"),x=Number(g.headers.get("X-Audio-Channels"));
if(!Number.isInteger(v)||v<8e3||v>48e3||"s16le"!==b||1!==x)throw Error("正式语音返回了当前播放器不支持的 PCM 参数。");
let w=u();
if(!w||!await p())throw Error("当前浏览器无法启动流式语音播放器。");
i=w,h&&"running"===w.state&&await w.suspend(),l=g.body.getReader();
let j=null,k=w.currentTime+.12;
for(;
!o;
){
let{
done:e,value:n}
=await l.read();
if(e)break;
let i=function(e){
let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=e instanceof Uint8Array?e:new Uint8Array(e),r=+(null!==t),a=new Uint8Array(r+n.length);
null!==t&&(a[0]=t),a.set(n,r);
let l=a.length-a.length%2,i=new Float32Array(l/2);
for(let e=0;
e<l;
e+=2){
let t=a[e]|a[e+1]<<8,n=t>=32768?t-65536:t;
i[e/2]=n<0?n/32768:n/32767}
return{
samples:i,trailingByte:l<a.length?a[a.length-1]:null}
}
(n,j);
if(j=i.trailingByte,0===i.samples.length)continue;
let u=w.createBuffer(1,i.samples.length,v);
u.copyToChannel(i.samples,0);
let d=w.createBufferSource();
d.buffer=u,d.connect(w.destination),d.onended=()=>{
r.delete(d),d.disconnect(),f()}
,r.add(d);
let m=Math.max(w.currentTime+.06,k);
k=m+u.duration;
let g=0;
for(let e=0;
e<i.samples.length;
e+=8)g+=i.samples[e]*i.samples[e];
let p=Math.max(1,Math.ceil(i.samples.length/8)),b=Math.min(1,3.1*Math.sqrt(g/p)),x=window.setTimeout(()=>{
var e;
a.delete(x),o||h||null==(e=t.onLevel)||e.call(t,b)}
,Math.max(0,(m-w.currentTime)*1e3));
a.add(x),d.start(m),s||(s=!0),c||h||(c=!0,null==(y=t.onStart)||y.call(t))}
if(m=!0,!s)throw Error("正式语音返回了空音频流。");
f()}
catch(e){
if(o)return;
if(null==(v=t.onError)||v.call(t,e instanceof Error?e.message:"正式语音暂时不可用。"),m=!0,!s){
g=!0,null==(b=t.onLevel)||b.call(t,0),null==(x=t.onEnd)||x.call(t);
return}
f()}
}
)();
let y=()=>{
var e;
o=!0,n.abort(),null==l||l.cancel().catch(()=>void 0),r.forEach(e=>{
e.onended=null;
try{
e.stop()}
catch(e){
}
e.disconnect()}
),r.clear(),a.forEach(e=>window.clearTimeout(e)),a.clear(),null==(e=t.onLevel)||e.call(t,0)}
;
return y.pause=()=>{
o||g||(h=!0,(null==i?void 0:i.state)==="running"&&i.suspend().catch(()=>void 0))}
,y.resume=()=>{
o||g||(h=!1,(async()=>{
if((null==i?void 0:i.state)==="suspended"&&await i.resume().catch(()=>void 0),s&&!c){
var e;
c=!0,null==(e=t.onStart)||e.call(t)}
}
)())}
,y}
(e,{
onStart:()=>{
r===ek.current&&(ep(null),ed(e=>Math.max(.22,e)),P("speaking"))}
,onLevel:e=>{
r===ek.current&&ed(e)}
,onError:e=>{
r===ek.current&&(a=!0,ep("".concat(e," 没有切换到浏览器音色。")))}
,onEnd:()=>{
r===ek.current&&(eC.current=null,ed(0),P(a?"recoverable-error":n))}
}
)}
,[]),e0=e=>{
if(s)return;
let t=ek.current;
eP.current=e,eA.current="voice"===e,ee(e),en("voice"===e),"voice"===e&&p(),c(!0);
let n=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
eM.current.push(window.setTimeout(()=>{
t===ek.current&&(o(!0),ea(!0),ei(!1),U&&q?P("result-idle"):"voice"===e&&e_?(P("assistant-turn"),eZ(e_.content)):P("dialogue-ready"))}
,n?60:1700))}
,e1=async()=>{
if("requesting"!==ev){
eb("requesting"),ew(null);
try{
var e;
if(!(null==(e=navigator.mediaDevices)?void 0:e.getUserMedia))throw Error("当前浏览器无法使用麦克风，请改用文字模式。");
let t=p(),n=navigator.mediaDevices.getUserMedia({
audio:!0}
),[r,a]=await Promise.all([t,n]);
if(a.getTracks().forEach(e=>e.stop()),!r)throw Error("当前浏览器没有成功开启声音，请检查网页声音设置后重试。");
ey(!1),eb("idle"),e0("voice")}
catch(e){
eb("error"),ew(e instanceof Error&&e.message.startsWith("当前浏览器")?e.message:"还没有获得麦克风权限。你可以重新允许，或先改用文字模式。")}
}
}
,e2=e=>{
var t,n;
e!==Z&&(null==(t=eS.current)||t.cancel(),eS.current=null,null==(n=eC.current)||n.call(eC),eC.current=null,ed(0),em(!1),ep(null),ey(!1),eb("idle"),ew(null),eP.current=e,eA.current="voice"===e,ee(e),en("voice"===e),"voice"===e?(p(),el?eT.current=!!e_:eY||eV||!e_?el||eY||eV||P("dialogue-ready"):(P("assistant-turn"),eZ(e_.content))):(eT.current=!1,el||eY||eV||P("dialogue-ready")))}
,e3=async(e,t)=>{
var n,r,a;
let l=e.trim();
if(!l||!D||!er||el||eY)return;
let i=ek.current;
et&&p(),null==(n=eC.current)||n.call(eC),null==(r=eE.current)||r.abort();
let o=new AbortController;
eE.current=o;
let s={
id:crypto.randomUUID(),role:"user",inputMode:t,createdAt:new Date().toISOString(),content:l}
,c=[...L,s];
B(c),K(""),H("text"),$(null),ec(""),es("我已经收到了你的回答"),P("thinking");
try{
let e=await h({
sessionId:D,messages:c,signal:o.signal,onVisibleText:e=>{
i===ek.current&&ec(e)}
}
);
if(i!==ek.current)return;
if("question"===e.turn.kind){
let t="".concat(e.turn.acknowledgement,"\n\n").concat(e.turn.question),n={
id:crypto.randomUUID(),role:"assistant",inputMode:"system",createdAt:new Date().toISOString(),content:t}
;
B(e=>[...e,n]),ec(t),P("assistant-turn"),eZ(t);
return}
es("我正在整合你的回答并给出推荐..."),P("validating-location");
let t=await m({
turn:e.turn,scope:"city",signal:o.signal}
);
if(i!==ek.current)return;
z(e.turn.result),W(t.geography);
let n=e.turn.result.destination.city,r=S(n);
T(r),null==(a=eN.current)||a.abort();
let l=new AbortController;
eN.current=l,m({
turn:e.turn,scope:"full",signal:l.signal}
).then(e=>{
i===ek.current&&W(e.geography)}
).catch(()=>void 0).finally(()=>{
eN.current===l&&(eN.current=null)}
),P("result-reveal");
let s=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
eM.current.push(window.setTimeout(()=>P(e=>"result-reveal"===e?"result-idle":e),s?80:900))}
catch(e){
if(o.signal.aborted||i!==ek.current)return;
B(e=>e.filter(e=>e.id!==s.id)),$(e instanceof Error?e.message:"这次连接没有完成，请再试一次。"),ec(""),K(l),P("recoverable-error")}
finally{
eE.current===o&&(eE.current=null)}
}
,e5=async()=>{
var e,t;
if(!er||"voice"!==Z||el||eY||"transcribing"===I||"speaking"===I)return;
let n=ek.current;
null==(e=eC.current)||e.call(eC),null==(t=eS.current)||t.cancel(),K(""),H("voice"),ed(0),em(!1),ep(null);
try{
let e=await y({
silenceDurationMs:1050,onLevel:e=>{
n===ek.current&&ed(e)}
,onSpeechStart:()=>{
n===ek.current&&(em(!0),ep(null))}
,onSpeechEnd:()=>{
n===ek.current&&eL.current()}
}
);
if(n!==ek.current)return void e.cancel();
eS.current=e,$(null),P("listening")}
catch(e){
if(n!==ek.current)return;
$(e instanceof Error?e.message:"无法启动麦克风，请检查浏览器权限后重试。"),P("recoverable-error")}
}
,e8=async()=>{
if("listening"!==I)return;
let e=eS.current;
if(!e){
$("录音没有正常开始，请重试或改用文字回答。"),P("recoverable-error");
return}
if(!e.hasDetectedSpeech())return void ep("还没有听到清晰声音，可以直接开始说。不会发送空白内容。");
let t=ek.current;
eS.current=null,ed(0),em(!1),ep(null),P("transcribing");
try{
let n=await e.stop();
if(t!==ek.current)return;
let r=await g({
audio:n}
);
if(t!==ek.current)return;
if(!r.text.trim()){
ep("这段声音里没有识别出内容，请再说一次。"),P("recoverable-error");
return}
$(null),await e3(r.text,"voice")}
catch(e){
if(t!==ek.current)return;
$(e instanceof Error?e.message:"这段声音暂时没能转成文字。"),P("recoverable-error")}
}
;
(0,a.useEffect)(()=>{
eL.current=()=>void e8(),eB.current=()=>void e5()}
),(0,a.useEffect)(()=>{
if("voice"!==Z||!er||el||"dialogue-ready"!==I||eV)return;
let e=window.setTimeout(()=>eB.current(),360);
return()=>window.clearTimeout(e)}
,[el,er,Z,I,eV]);
let e6=(0,a.useCallback)(()=>{
eW&&eJ&&(P("routing"),eM.current.push(window.setTimeout(()=>{
var e;
return window.location.assign(null!=(e=null!=eU?eU:null==ez?void 0:ez.route)?e:eF?"/city/".concat(eF.slug):"/city/personalized")}
,220)))}
,[ez,eJ,eF,eU,eW]);
return(0,r.jsxs)(r.Fragment,{
children:[(0,r.jsxs)("main",{
className:"experience-shell".concat(!i?" is-start-view":"").concat(!i&&s?" is-entering":""),children:[(0,r.jsx)("div",{
className:"star-field","aria-hidden":!0}
),(0,r.jsxs)("header",{
ref:eO,className:"topbar",children:[(0,r.jsxs)("button",{
type:"button",className:"brand",onClick:()=>window.location.assign("/"),"aria-label":"云中客首页",children:[(0,r.jsx)("span",{
className:"brand-mark","aria-hidden":!0,children:(0,r.jsx)("i",{
}
)}
),(0,r.jsx)("span",{
children:(0,r.jsx)("b",{
children:"云中客"}
)}
)]}
),(0,r.jsx)("a",{className:"topbar-journey-link city-directory-link",href:"/cities/",children:"城市图鉴 ↗"}
),(0,r.jsx)("div",{
className:"topbar-actions",children:i&&(0,r.jsxs)(r.Fragment,{
children:[(0,r.jsxs)("div",{
className:"interaction-mode-switch","aria-label":"切换交流方式",children:[(0,r.jsx)("button",{
type:"button",className:"voice"===Z?"is-active":void 0,"aria-pressed":"voice"===Z,onClick:()=>e2("voice"),disabled:eY||"transcribing"===I,children:"语音"}
),(0,r.jsx)("button",{
type:"button",className:"text"===Z?"is-active":void 0,"aria-pressed":"text"===Z,onClick:()=>e2("text"),disabled:eY||"transcribing"===I,children:"文字"}
)]}
),(0,r.jsx)("button",{
type:"button",className:"restart-experience",onClick:()=>{
var e,t,n,r;
ek.current+=1,eQ(),null==(e=eS.current)||e.cancel(),eS.current=null,null==(t=eE.current)||t.abort(),eE.current=null,null==(n=eN.current)||n.abort(),eN.current=null,null==(r=eC.current)||r.call(eC),eC.current=null,(0,b.a2)(),eT.current=!1,eR.current="dialogue-ready",eI.current="dialogue-ready",eP.current="text",eA.current=!1,F((0,b.GH)()),B([(0,b.Cx)()]),z(null),W(null),T(null),K(""),H("text"),$(null),es("我已经收到了你的回答"),ec(""),ed(0),em(!1),ep(null),ey(!1),eb("idle"),ew(null),ee("text"),en(!1),ea(!1),ei(!1),o(!1),c(!1),P("intro"),window.history.replaceState(null,"","/")}
,children:"从头开始"}
)]}
)}
)]}
),(0,r.jsxs)("section",{
className:"world-stage","aria-label":"地球探索界面",children:[(0,r.jsx)(X,{
focus:eG,resultTarget:eV?eJ:null,resultBoundary:eX,resultLabel:U?{
country:U.destination.country,city:U.destination.city}
:null,revealResult:eW,snapToFocus:eW,motionMode:eH,viewMode:eK,autoRotate:i&&!el&&!eV,canDrag:i&&!eV,introContentBottom:f,dialoguePanelLeft:eV?0:j,topbarBottom:i?C:0,onResultClick:e6}
),er&&!eV&&(0,r.jsxs)("section",{
ref:eD,className:"intro-card dialogue-focus mode-".concat(Z),"aria-label":"与地球对话",children:["voice"===Z?(0,r.jsxs)("div",{
className:"voice-conversation-state is-".concat(I),children:[(0,r.jsx)(v.O,{
level:eu,active:"speaking"===I||"assistant-turn"===I||"listening"===I||"transcribing"===I||eY,variant:eY?"radial":"horizontal",paused:el}
),(0,r.jsxs)("div",{
className:"voice-state-footer",children:[(0,r.jsx)("span",{
children:null!=eg?eg:"listening"===I?eh?"自然停顿后会自动发送":"直接说出你的回答":"speaking"===I?"地球说完后会自动聆听":"assistant-turn"===I?"正在连接地球的声音":"transcribing"===I?"正在交给语音模型理解":eY?"你的回答已经保存":el?"点击继续后再接着说":"recoverable-error"===I?"对话内容没有丢失":"麦克风将自动开启"}
),(0,r.jsxs)("div",{
className:"voice-state-actions",children:["listening"===I&&!el&&(0,r.jsx)("button",{
type:"button",onClick:()=>void e8(),children:"说完了"}
),"recoverable-error"===I&&!el&&(0,r.jsx)("button",{
type:"button",onClick:()=>{
eg&&e_?(P("assistant-turn"),eZ(e_.content)):e5()}
,children:eg?"重试朗读":"重新说一次"}
),(0,r.jsxs)("button",{
type:"button",className:"voice-pause-control",onClick:el?()=>{
if(!el)return;
if(ei(!1),eT.current&&"voice"===eP.current&&e_){
eT.current=!1,P("assistant-turn"),eZ(e_.content);
return}
let e=eI.current,t=eC.current;
null==t||t.resume(),P("speaking"!==e||t?e:eR.current)}
:()=>{
var e,t;
!er||el||"transcribing"===I||eY||"intro"===I||("listening"===I?(null==(t=eS.current)||t.cancel(),eS.current=null,ed(0),em(!1),eI.current="dialogue-ready"):eI.current=I,null==(e=eC.current)||e.pause(),ei(!0),P("paused"))}
,disabled:!el&&(eY||"transcribing"===I||"recoverable-error"===I),children:[(0,r.jsx)("i",{
"aria-hidden":"true"}
),el?"继续":"暂停"]}
)]}
)]}
)]}
):(0,r.jsxs)("div",{
className:"text-voice-state".concat(et?" is-on":""),children:[(0,r.jsxs)("div",{
className:"text-speech-setting".concat(et?" is-on":""),children:[(0,r.jsx)("div",{
className:"text-speech-symbol","aria-hidden":"true",children:(0,r.jsxs)("svg",{
className:"text-speech-microphone",viewBox:"0 0 24 24",fill:"none",focusable:"false",children:[(0,r.jsx)("rect",{
x:"9",y:"3",width:"6",height:"11",rx:"3"}
),(0,r.jsx)("path",{
d:"M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4M9 21h6"}
)]}
)}
),(0,r.jsxs)("div",{
children:[(0,r.jsx)("strong",{
children:"让地球说话"}
),(0,r.jsx)("small",{
children:eg||(et?"文字回答，地球会朗读回应":"只显示文字，不主动播放声音")}
)]}
),(0,r.jsx)("button",{
type:"button",role:"switch","aria-checked":et,"aria-label":"让地球说话",onClick:()=>{
let e=!et;
if(eA.current=e,e)p(),!e_||eY||eV||(P("assistant-turn"),eZ(e_.content));
else{
var t;
null==(t=eC.current)||t.call(eC),eC.current=null,ed(0),ep(null),("speaking"===I||"recoverable-error"===I&&eg)&&P(eR.current)}
en(e)}
,disabled:el,children:(0,r.jsx)("span",{
}
)}
)]}
),(et||eY)&&(0,r.jsx)(v.O,{
level:eu,active:"speaking"===I||"assistant-turn"===I||eY,variant:eY?"radial":"horizontal",paused:el,className:"is-text-mode"}
)]}
),(0,r.jsx)("p",{
className:"earth-question".concat(eY?" is-thinking":""),"aria-live":"polite",children:e$}
),"recoverable-error"===I&&_&&(0,r.jsxs)("div",{
className:"dialogue-feedback",role:"alert",children:[(0,r.jsx)("span",{
children:_}
),"text"===Z&&Y.trim()&&(0,r.jsx)("button",{
type:"button",onClick:()=>void e3(Y,G),children:"重新发送"}
)]}
)]}
),eV&&(0,r.jsxs)("aside",{
className:"result-motion-copy phase-".concat(I),"aria-live":"polite",children:[(0,r.jsx)("span",{
className:"result-motion-orbit","aria-hidden":!0}
),(0,r.jsx)("small",{
children:"routing"===I?"正在进入":"已经点亮"}
),(0,r.jsx)("h1",{
children:"routing"===I?"正在打开下一段空间。":"有一座城市被点亮了。"}
),(0,r.jsx)("p",{
children:"点击地球上持续呼吸的光，进入这座城市。"}
)]}
)]}
),i&&er&&"text"===Z&&!eV&&(0,r.jsxs)("section",{
className:"voice-dock is-text-mode phase-".concat(I),"aria-live":"polite",children:[(0,r.jsx)("div",{
className:"dialogue-composer",children:(0,r.jsx)("textarea",{
value:Y,onChange:e=>{
K(e.target.value),H("text"),("dialogue-ready"===I||"recoverable-error"===I)&&P("composing")}
,onKeyDown:e=>{
"Enter"!==e.key||e.shiftKey||(e.preventDefault(),e3(Y,G))}
,placeholder:"写下你的回答……",rows:1,disabled:!er||el||"listening"===I||"transcribing"===I||eY||"speaking"===I,"aria-label":"输入给地球的回答"}
)}
),(0,r.jsx)("button",{
className:"send-answer",type:"button",onClick:()=>void e3(Y,G),disabled:!er||el||!Y.trim()||"listening"===I||"transcribing"===I||eY||"speaking"===I,children:"发送"}
)]}
)]}
),!i&&(0,r.jsx)(J,{
leaving:s,onStart:e=>{
if("voice"===e){
eb("idle"),ew(null),ey(!0);
return}
e0("text")}
,onContentBottomChange:w}
),!i&&ef&&(0,r.jsx)(V,{
status:ev,message:ex,onBegin:()=>void e1(),onUseText:()=>{
ey(!1),eb("idle"),ew(null),e0("text")}
}
)]}
)}
}
,2506:(e,t,n)=>{
"use strict";
n.d(t,{
y:()=>l}
);
let r=[/* ATLAS_REGISTRY_START */{"key":"hangzhou","aliases":["杭州","杭州市","HANGZHOU","hangzhou","中国杭州"],"image":"/assets/hangzhou/hero.jpg","imageVersion":"hangzhou-atlas-v1","route":"/city/hangzhou/","sourceReferences":[]},{"key":"nanjing","aliases":["南京","南京市","NANJING","nanjing","中国南京"],"image":"/assets/nanjing/hero.jpg","imageVersion":"nanjing-atlas-v1","route":"/city/nanjing/","sourceReferences":[]},{"key":"harbin","aliases":["哈尔滨","哈尔滨市","HARBIN","harbin","中国哈尔滨"],"image":"/assets/harbin/hero.jpg","imageVersion":"harbin-atlas-v1","route":"/city/harbin/","sourceReferences":[]},{"key":"sanya","aliases":["三亚","三亚市","SANYA","sanya","中国三亚"],"image":"/assets/sanya/hero.jpg","imageVersion":"sanya-atlas-v1","route":"/city/sanya/","sourceReferences":[]},{"key":"guangzhou","aliases":["广州","广州市","GUANGZHOU","guangzhou","中国广州","廣州","Canton"],"image":"/assets/guangzhou/hero.jpg","imageVersion":"guangzhou-atlas-v1","route":"/city/guangzhou/","sourceReferences":[]},{"key":"shenzhen","aliases":["深圳","深圳市","SHENZHEN","shenzhen","中国深圳"],"image":"/assets/shenzhen/hero.jpg","imageVersion":"shenzhen-atlas-v1","route":"/city/shenzhen/","sourceReferences":[]},{"key":"singapore","aliases":["新加坡","新加坡市","SINGAPORE","singapore","新加坡新加坡","狮城"],"image":"/assets/singapore/hero.jpg","imageVersion":"singapore-atlas-v1","route":"/city/singapore/","sourceReferences":[]},{"key":"xiamen","aliases":["厦门","厦门市","XIAMEN","xiamen","中国厦门","廈門","Amoy"],"image":"/assets/xiamen/hero.jpg","imageVersion":"xiamen-atlas-v1","route":"/city/xiamen/","sourceReferences":[]},{"key":"florence","aliases":["佛罗伦萨","佛罗伦萨市","FLORENCE","florence","意大利佛罗伦萨","佛罗伦斯","翡冷翠","Firenze"],"image":"/assets/florence/hero.jpg","imageVersion":"florence-atlas-v1","route":"/city/florence/","sourceReferences":[]},{"key":"paris","aliases":["巴黎","巴黎市","PARIS","paris","法国巴黎","Paris France"],"image":"/assets/paris/hero.jpg","imageVersion":"paris-atlas-v1","route":"/city/paris/","sourceReferences":[]},{"key":"london","aliases":["伦敦","伦敦市","LONDON","london","英国伦敦","London UK"],"image":"/assets/london/hero.jpg","imageVersion":"london-atlas-v1","route":"/city/london/","sourceReferences":[]},{"key":"new-york","aliases":["纽约","纽约市","NEW YORK","new-york","美国纽约","紐約","New York City","NYC"],"image":"/assets/new-york/hero.jpg","imageVersion":"new-york-atlas-v1","route":"/city/new-york/","sourceReferences":[]},{"key":"berlin","aliases":["柏林","柏林市","BERLIN","berlin","德国柏林","Berlin Germany"],"image":"/assets/berlin/hero.jpg","imageVersion":"berlin-atlas-v1","route":"/city/berlin/","sourceReferences":[]},/* ATLAS_REGISTRY_END */{"key":"tokyo","aliases":["东京","東京都","东京市","東京","東京都","日本东京","Tokyo","Tokyo Japan"],"image":"/assets/tokyo/hero.png","imageVersion":"tokyo-hero-v1","route":"/city/tokyo/","sourceReferences":[]},{"key":"xian","aliases":["西安","西安市","陕西西安","中国西安","Xi'an","Xian","Xi’an"],"image":"/assets/xian/hero.png","imageVersion":"xian-hero-v1","route":"/city/xian/","sourceReferences":[]},{
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
function a(e){
return String(null!=e?e:"").normalize("NFKC").toLocaleLowerCase("en").replace(RegExp("[\\s\\p{
P}
\\p{
S}
]+","gu"),"")}
function l(){
for(var e,t=arguments.length,n=Array(t),l=0;
l<t;
l++)n[l]=arguments[l];
let i=n.map(a).filter(Boolean);
return 0===i.length?null:null!=(e=r.find(e=>{
let{
aliases:t}
=e;
return t.some(e=>i.includes(a(e)))}
))?e:null}
}
,3142:(e,t,n)=>{
"use strict";
n.d(t,{
Cx:()=>o,GH:()=>i,a2:()=>u,hs:()=>c,iX:()=>s}
);
let r="earth-dialogue.session.v3",a=["earth-dialogue.session.v2","earth-dialogue.session.v1"];
function l(e){
return!!e&&"object"==typeof e&&"string"==typeof e.id&&("user"===e.role||"assistant"===e.role)&&"string"==typeof e.content&&("text"===e.inputMode||"voice"===e.inputMode||"system"===e.inputMode)&&"string"==typeof e.createdAt}
function i(){
return crypto.randomUUID()}
function o(){
return{
id:crypto.randomUUID(),role:"assistant",inputMode:"system",createdAt:new Date().toISOString(),content:"如果现在可以回到某次旅行里的十分钟，你最想回到哪十分钟？不用解释它为什么重要，只告诉我当时在哪里、正在做什么。"}
}
function s(e){
let t=Date.now(),n={
version:3,promptVersion:"3.3",sessionId:e.sessionId,messages:e.messages,result:e.result,geography:e.geography,updatedAt:new Date(t).toISOString(),expiresAt:new Date(t+6048e5).toISOString()}
;
localStorage.setItem(r,JSON.stringify(n))}
function c(){
let e=localStorage.getItem(r);
if(!e)return a.forEach(e=>localStorage.removeItem(e)),null;
try{
let t=JSON.parse(e);
if(3!==t.version||"3.1"!==t.promptVersion&&"3.2"!==t.promptVersion&&"3.3"!==t.promptVersion||"string"!=typeof t.sessionId||!Array.isArray(t.messages)||!t.messages.every(l)||!Object.prototype.hasOwnProperty.call(t,"geography")||null!==t.result&&!t.geography||null===t.result&&null!==t.geography||"string"!=typeof t.expiresAt||Date.parse(t.expiresAt)<=Date.now())return localStorage.removeItem(r),a.forEach(e=>localStorage.removeItem(e)),null;
return t}
catch(e){
return localStorage.removeItem(r),a.forEach(e=>localStorage.removeItem(e)),null}
}
function u(){
localStorage.removeItem(r),a.forEach(e=>localStorage.removeItem(e))}
}
,5845:(e,t,n)=>{
Promise.resolve().then(n.bind(n,1943))}
,7403:(e,t,n)=>{
"use strict";
n.d(t,{
O:()=>l}
);
var r=n(5155),a=n(2115);
function l(e){
let{
level:t,active:n,variant:l,paused:i=!1,className:o=""}
=e,s=(0,a.useRef)(null),c=(0,a.useRef)(t),u=(0,a.useRef)(n),d=(0,a.useRef)(i);
return(0,a.useEffect)(()=>{
c.current=t}
,[t]),(0,a.useEffect)(()=>{
u.current=n}
,[n]),(0,a.useEffect)(()=>{
d.current=i}
,[i]),(0,a.useEffect)(()=>{
let e=s.current;
if(!e)return;
let t=e.getContext("2d");
if(!t)return;
let n=window.matchMedia("(prefers-reduced-motion: reduce)").matches,r=0,a=0,i=0,o=()=>{
let n=e.getBoundingClientRect(),l=Math.min(2,window.devicePixelRatio||1);
r=Math.max(1,n.width),a=Math.max(1,n.height),e.width=Math.round(r*l),e.height=Math.round(a*l),t.setTransform(l,0,0,l,0,0)}
,h=e=>{
t.clearRect(0,0,r,a);
let o="radial"===l?.28:.24,s=u.current?Math.max(o,Math.min(1,1.5*c.current)):.08,m=d.current?.045:s,g=d.current||n?0:e;
"horizontal"===l?((e,n)=>{
let l=a/2,i=.025*r,o=.95*r;
t.lineCap="round",t.lineJoin="round";
for(let r=0;
r<5;
r+=1){
t.beginPath();
for(let a=0;
a<=180;
a+=1){
let s=a/180,c=i+s*o,u=Math.pow(Math.sin(s*Math.PI),1.28),d=l+(.66*Math.sin(12.5*s+.0034*e+1.18*r)+.27*Math.sin(23*s-.0022*e+.74*r)+.1*Math.sin(37*s+.0013*e-.39*r))*u*((9+48*n)*(1-.09*r));
0===a?t.moveTo(c,d):t.lineTo(c,d)}
t.strokeStyle="rgba(1, 86, 151, ".concat(.12+n*(.33-.035*r),")"),t.lineWidth=1.3-.12*r,t.shadowColor="rgba(1, 86, 151, 0.24)",t.shadowBlur=7+9*n,t.stroke()}
t.shadowBlur=0,t.beginPath(),t.moveTo(i,l),t.lineTo(i+o,l),t.strokeStyle="rgba(1, 86, 151, 0.11)",t.lineWidth=.8,t.stroke()}
)(g,m):((e,n)=>{
let l=r/2,i=a/2,o=.285*Math.min(r,a),s=Math.sin(58e-5*e)*(2.2+3.4*n)*1.55;
t.lineCap="round",t.lineJoin="round";
for(let r=0;
r<5;
r+=1){
t.beginPath();
for(let a=0;
a<=220;
a+=1){
let c=a/220*Math.PI*2,u=(Math.sin(2*c+32e-5*e+.72*r)*(4.1+7.1*n)+Math.sin(5*c-21e-5*e+1.08*r)*(2.1+3.7*n)+1.1*Math.sin(9*c+13e-5*e-.44*r))*1.55,d=o+s+2.8*r+u,h=l+Math.cos(c)*d,m=i+Math.sin(c)*d;
0===a?t.moveTo(h,m):t.lineTo(h,m)}
t.closePath(),t.strokeStyle="rgba(1, 86, 151, ".concat(.11+n*(.22-.018*r),")"),t.lineWidth=1.35-.12*r,t.shadowColor="rgba(1, 86, 151, 0.14)",t.shadowBlur=7+7*n,t.stroke()}
t.shadowBlur=0;
let c=t.createRadialGradient(l,i,.32*o,l,i,1.55*o);
c.addColorStop(0,"rgba(1, 86, 151, 0.025)"),c.addColorStop(.62,"rgba(1, 86, 151, ".concat(.035+.035*n,")")),c.addColorStop(1,"rgba(1, 86, 151, 0)"),t.fillStyle=c,t.fillRect(0,0,r,a)}
)(g,m),n||d.current||(i=window.requestAnimationFrame(h))}
,m=new ResizeObserver(()=>{
o(),(n||d.current)&&h(0)}
);
return m.observe(e),o(),h(0),()=>{
m.disconnect(),window.cancelAnimationFrame(i)}
}
,[i,l]),(0,r.jsx)("span",{
className:"dialogue-signal is-".concat(l).concat(n?" is-active":"").concat(i?" is-paused":"").concat(o?" ".concat(o):""),"aria-hidden":"true",children:(0,r.jsx)("canvas",{
ref:s}
)}
)}
}
}
,e=>{
e.O(0,[524,441,255,358],()=>e(e.s=5845)),_N_E=e.O()}
]);
