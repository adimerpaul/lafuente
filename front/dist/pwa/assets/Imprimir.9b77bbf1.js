import{u as x}from"./index.4accf73f.js";import{P as R}from"./index.aa4d44c1.js";import{h as Me}from"./moment.40bc58bf.js";var S={},Se=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},ne={},L={};let At;const Le=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];L.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};L.getSymbolTotalCodewords=function(t){return Le[t]};L.getBCHDigit=function(o){let t=0;for(;o!==0;)t++,o>>>=1;return t};L.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');At=t};L.isKanjiModeEnabled=function(){return typeof At!="undefined"};L.toSJIS=function(t){return At(t)};var dt={};(function(o){o.L={bit:1},o.M={bit:0},o.Q={bit:3},o.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return o.L;case"m":case"medium":return o.M;case"q":case"quartile":return o.Q;case"h":case"high":return o.H;default:throw new Error("Unknown EC Level: "+e)}}o.isValid=function(r){return r&&typeof r.bit!="undefined"&&r.bit>=0&&r.bit<4},o.from=function(r,n){if(o.isValid(r))return r;try{return t(r)}catch{return n}}})(dt);function oe(){this.buffer=[],this.length=0}oe.prototype={get:function(o){const t=Math.floor(o/8);return(this.buffer[t]>>>7-o%8&1)===1},put:function(o,t){for(let e=0;e<t;e++)this.putBit((o>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(o){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),o&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var xe=oe;function X(o){if(!o||o<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=o,this.data=new Uint8Array(o*o),this.reservedBit=new Uint8Array(o*o)}X.prototype.set=function(o,t,e,r){const n=o*this.size+t;this.data[n]=e,r&&(this.reservedBit[n]=!0)};X.prototype.get=function(o,t){return this.data[o*this.size+t]};X.prototype.xor=function(o,t,e){this.data[o*this.size+t]^=e};X.prototype.isReserved=function(o,t){return this.reservedBit[o*this.size+t]};var Re=X,re={};(function(o){const t=L.getSymbolSize;o.getRowColCoords=function(r){if(r===1)return[];const n=Math.floor(r/7)+2,i=t(r),s=i===145?26:Math.ceil((i-13)/(2*n-2))*2,l=[i-7];for(let a=1;a<n-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},o.getPositions=function(r){const n=[],i=o.getRowColCoords(r),s=i.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||n.push([i[l],i[a]]);return n}})(re);var ie={};const Pe=L.getSymbolSize,Wt=7;ie.getPositions=function(t){const e=Pe(t);return[[0,0],[e-Wt,0],[0,e-Wt]]};var se={};(function(o){o.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};o.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},o.from=function(n){return o.isValid(n)?parseInt(n,10):void 0},o.getPenaltyN1=function(n){const i=n.size;let s=0,l=0,a=0,c=null,d=null;for(let h=0;h<i;h++){l=a=0,c=d=null;for(let u=0;u<i;u++){let f=n.get(h,u);f===c?l++:(l>=5&&(s+=t.N1+(l-5)),c=f,l=1),f=n.get(u,h),f===d?a++:(a>=5&&(s+=t.N1+(a-5)),d=f,a=1)}l>=5&&(s+=t.N1+(l-5)),a>=5&&(s+=t.N1+(a-5))}return s},o.getPenaltyN2=function(n){const i=n.size;let s=0;for(let l=0;l<i-1;l++)for(let a=0;a<i-1;a++){const c=n.get(l,a)+n.get(l,a+1)+n.get(l+1,a)+n.get(l+1,a+1);(c===4||c===0)&&s++}return s*t.N2},o.getPenaltyN3=function(n){const i=n.size;let s=0,l=0,a=0;for(let c=0;c<i;c++){l=a=0;for(let d=0;d<i;d++)l=l<<1&2047|n.get(c,d),d>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|n.get(d,c),d>=10&&(a===1488||a===93)&&s++}return s*t.N3},o.getPenaltyN4=function(n){let i=0;const s=n.data.length;for(let a=0;a<s;a++)i+=n.data[a];return Math.abs(Math.ceil(i*100/s/5)-10)*t.N4};function e(r,n,i){switch(r){case o.Patterns.PATTERN000:return(n+i)%2===0;case o.Patterns.PATTERN001:return n%2===0;case o.Patterns.PATTERN010:return i%3===0;case o.Patterns.PATTERN011:return(n+i)%3===0;case o.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(i/3))%2===0;case o.Patterns.PATTERN101:return n*i%2+n*i%3===0;case o.Patterns.PATTERN110:return(n*i%2+n*i%3)%2===0;case o.Patterns.PATTERN111:return(n*i%3+(n+i)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}o.applyMask=function(n,i){const s=i.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)i.isReserved(a,l)||i.xor(a,l,e(n,a,l))},o.getBestMask=function(n,i){const s=Object.keys(o.Patterns).length;let l=0,a=1/0;for(let c=0;c<s;c++){i(c),o.applyMask(c,n);const d=o.getPenaltyN1(n)+o.getPenaltyN2(n)+o.getPenaltyN3(n)+o.getPenaltyN4(n);o.applyMask(c,n),d<a&&(a=d,l=c)}return l}})(se);var ct={};const z=dt,rt=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],it=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];ct.getBlocksCount=function(t,e){switch(e){case z.L:return rt[(t-1)*4+0];case z.M:return rt[(t-1)*4+1];case z.Q:return rt[(t-1)*4+2];case z.H:return rt[(t-1)*4+3];default:return}};ct.getTotalCodewordsCount=function(t,e){switch(e){case z.L:return it[(t-1)*4+0];case z.M:return it[(t-1)*4+1];case z.Q:return it[(t-1)*4+2];case z.H:return it[(t-1)*4+3];default:return}};var le={},ut={};const Q=new Uint8Array(512),lt=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)Q[e]=t,lt[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)Q[e]=Q[e-255]})();ut.log=function(t){if(t<1)throw new Error("log("+t+")");return lt[t]};ut.exp=function(t){return Q[t]};ut.mul=function(t,e){return t===0||e===0?0:Q[lt[t]+lt[e]]};(function(o){const t=ut;o.mul=function(r,n){const i=new Uint8Array(r.length+n.length-1);for(let s=0;s<r.length;s++)for(let l=0;l<n.length;l++)i[s+l]^=t.mul(r[s],n[l]);return i},o.mod=function(r,n){let i=new Uint8Array(r);for(;i.length-n.length>=0;){const s=i[0];for(let a=0;a<n.length;a++)i[a]^=t.mul(n[a],s);let l=0;for(;l<i.length&&i[l]===0;)l++;i=i.slice(l)}return i},o.generateECPolynomial=function(r){let n=new Uint8Array([1]);for(let i=0;i<r;i++)n=o.mul(n,new Uint8Array([1,t.exp(i)]));return n}})(le);const ae=le;function Nt(o){this.genPoly=void 0,this.degree=o,this.degree&&this.initialize(this.degree)}Nt.prototype.initialize=function(t){this.degree=t,this.genPoly=ae.generateECPolynomial(this.degree)};Nt.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const e=new Uint8Array(t.length+this.degree);e.set(t);const r=ae.mod(e,this.genPoly),n=this.degree-r.length;if(n>0){const i=new Uint8Array(this.degree);return i.set(r,n),i}return r};var De=Nt,de={},_={},Bt={};Bt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var D={};const ce="[0-9]+",Oe="[A-Z $%*+\\-./:]+";let Z="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Z=Z.replace(/u/g,"\\u");const Ue="(?:(?![A-Z0-9 $%*+\\-./:]|"+Z+`)(?:.|[\r
]))+`;D.KANJI=new RegExp(Z,"g");D.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");D.BYTE=new RegExp(Ue,"g");D.NUMERIC=new RegExp(ce,"g");D.ALPHANUMERIC=new RegExp(Oe,"g");const ze=new RegExp("^"+Z+"$"),_e=new RegExp("^"+ce+"$"),ke=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");D.testKanji=function(t){return ze.test(t)};D.testNumeric=function(t){return _e.test(t)};D.testAlphanumeric=function(t){return ke.test(t)};(function(o){const t=Bt,e=D;o.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},o.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},o.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},o.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},o.MIXED={bit:-1},o.getCharCountIndicator=function(i,s){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?i.ccBits[0]:s<27?i.ccBits[1]:i.ccBits[2]},o.getBestModeForData=function(i){return e.testNumeric(i)?o.NUMERIC:e.testAlphanumeric(i)?o.ALPHANUMERIC:e.testKanji(i)?o.KANJI:o.BYTE},o.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},o.isValid=function(i){return i&&i.bit&&i.ccBits};function r(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return o.NUMERIC;case"alphanumeric":return o.ALPHANUMERIC;case"kanji":return o.KANJI;case"byte":return o.BYTE;default:throw new Error("Unknown mode: "+n)}}o.from=function(i,s){if(o.isValid(i))return i;try{return r(i)}catch{return s}}})(_);(function(o){const t=L,e=ct,r=dt,n=_,i=Bt,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,l=t.getBCHDigit(s);function a(u,f,g){for(let m=1;m<=40;m++)if(f<=o.getCapacity(m,g,u))return m}function c(u,f){return n.getCharCountIndicator(u,f)+4}function d(u,f){let g=0;return u.forEach(function(m){g+=c(m.mode,f)+m.getBitsLength()}),g}function h(u,f){for(let g=1;g<=40;g++)if(d(u,g)<=o.getCapacity(g,f,n.MIXED))return g}o.from=function(f,g){return i.isValid(f)?parseInt(f,10):g},o.getCapacity=function(f,g,m){if(!i.isValid(f))throw new Error("Invalid QR Code version");typeof m=="undefined"&&(m=n.BYTE);const w=t.getSymbolTotalCodewords(f),p=e.getTotalCodewordsCount(f,g),E=(w-p)*8;if(m===n.MIXED)return E;const v=E-c(m,f);switch(m){case n.NUMERIC:return Math.floor(v/10*3);case n.ALPHANUMERIC:return Math.floor(v/11*2);case n.KANJI:return Math.floor(v/13);case n.BYTE:default:return Math.floor(v/8)}},o.getBestVersionForData=function(f,g){let m;const w=r.from(g,r.M);if(Array.isArray(f)){if(f.length>1)return h(f,w);if(f.length===0)return 1;m=f[0]}else m=f;return a(m.mode,m.getLength(),w)},o.getEncodedBits=function(f){if(!i.isValid(f)||f<7)throw new Error("Invalid QR Code version");let g=f<<12;for(;t.getBCHDigit(g)-l>=0;)g^=s<<t.getBCHDigit(g)-l;return f<<12|g}})(de);var ue={};const Ct=L,he=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Ve=1<<14|1<<12|1<<10|1<<4|1<<1,jt=Ct.getBCHDigit(he);ue.getEncodedBits=function(t,e){const r=t.bit<<3|e;let n=r<<10;for(;Ct.getBCHDigit(n)-jt>=0;)n^=he<<Ct.getBCHDigit(n)-jt;return(r<<10|n)^Ve};var fe={};const He=_;function V(o){this.mode=He.NUMERIC,this.data=o.toString()}V.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};V.prototype.getLength=function(){return this.data.length};V.prototype.getBitsLength=function(){return V.getBitsLength(this.data.length)};V.prototype.write=function(t){let e,r,n;for(e=0;e+3<=this.data.length;e+=3)r=this.data.substr(e,3),n=parseInt(r,10),t.put(n,10);const i=this.data.length-e;i>0&&(r=this.data.substr(e),n=parseInt(r,10),t.put(n,i*3+1))};var Je=V;const qe=_,pt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function H(o){this.mode=qe.ALPHANUMERIC,this.data=o}H.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};H.prototype.getLength=function(){return this.data.length};H.prototype.getBitsLength=function(){return H.getBitsLength(this.data.length)};H.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let r=pt.indexOf(this.data[e])*45;r+=pt.indexOf(this.data[e+1]),t.put(r,11)}this.data.length%2&&t.put(pt.indexOf(this.data[e]),6)};var Ye=H;const Ke=_;function J(o){this.mode=Ke.BYTE,typeof o=="string"?this.data=new TextEncoder().encode(o):this.data=new Uint8Array(o)}J.getBitsLength=function(t){return t*8};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(o){for(let t=0,e=this.data.length;t<e;t++)o.put(this.data[t],8)};var Ge=J;const Qe=_,Ze=L;function q(o){this.mode=Qe.KANJI,this.data=o}q.getBitsLength=function(t){return t*13};q.prototype.getLength=function(){return this.data.length};q.prototype.getBitsLength=function(){return q.getBitsLength(this.data.length)};q.prototype.write=function(o){let t;for(t=0;t<this.data.length;t++){let e=Ze.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),o.put(e,13)}};var Xe=q,ge={exports:{}};(function(o){var t={single_source_shortest_paths:function(e,r,n){var i={},s={};s[r]=0;var l=t.PriorityQueue.make();l.push(r,0);for(var a,c,d,h,u,f,g,m,w;!l.empty();){a=l.pop(),c=a.value,h=a.cost,u=e[c]||{};for(d in u)u.hasOwnProperty(d)&&(f=u[d],g=h+f,m=s[d],w=typeof s[d]=="undefined",(w||m>g)&&(s[d]=g,l.push(d,g),i[d]=c))}if(typeof n!="undefined"&&typeof s[n]=="undefined"){var p=["Could not find a path from ",r," to ",n,"."].join("");throw new Error(p)}return i},extract_shortest_path_from_predecessor_list:function(e,r){for(var n=[],i=r;i;)n.push(i),e[i],i=e[i];return n.reverse(),n},find_path:function(e,r,n){var i=t.single_source_shortest_paths(e,r,n);return t.extract_shortest_path_from_predecessor_list(i,n)},PriorityQueue:{make:function(e){var r=t.PriorityQueue,n={},i;e=e||{};for(i in r)r.hasOwnProperty(i)&&(n[i]=r[i]);return n.queue=[],n.sorter=e.sorter||r.default_sorter,n},default_sorter:function(e,r){return e.cost-r.cost},push:function(e,r){var n={value:e,cost:r};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};o.exports=t})(ge);(function(o){const t=_,e=Je,r=Ye,n=Ge,i=Xe,s=D,l=L,a=ge.exports;function c(p){return unescape(encodeURIComponent(p)).length}function d(p,E,v){const y=[];let C;for(;(C=p.exec(v))!==null;)y.push({data:C[0],index:C.index,mode:E,length:C[0].length});return y}function h(p){const E=d(s.NUMERIC,t.NUMERIC,p),v=d(s.ALPHANUMERIC,t.ALPHANUMERIC,p);let y,C;return l.isKanjiModeEnabled()?(y=d(s.BYTE,t.BYTE,p),C=d(s.KANJI,t.KANJI,p)):(y=d(s.BYTE_KANJI,t.BYTE,p),C=[]),E.concat(v,y,C).sort(function($,B){return $.index-B.index}).map(function($){return{data:$.data,mode:$.mode,length:$.length}})}function u(p,E){switch(E){case t.NUMERIC:return e.getBitsLength(p);case t.ALPHANUMERIC:return r.getBitsLength(p);case t.KANJI:return i.getBitsLength(p);case t.BYTE:return n.getBitsLength(p)}}function f(p){return p.reduce(function(E,v){const y=E.length-1>=0?E[E.length-1]:null;return y&&y.mode===v.mode?(E[E.length-1].data+=v.data,E):(E.push(v),E)},[])}function g(p){const E=[];for(let v=0;v<p.length;v++){const y=p[v];switch(y.mode){case t.NUMERIC:E.push([y,{data:y.data,mode:t.ALPHANUMERIC,length:y.length},{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.ALPHANUMERIC:E.push([y,{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.KANJI:E.push([y,{data:y.data,mode:t.BYTE,length:c(y.data)}]);break;case t.BYTE:E.push([{data:y.data,mode:t.BYTE,length:c(y.data)}])}}return E}function m(p,E){const v={},y={start:{}};let C=["start"];for(let b=0;b<p.length;b++){const $=p[b],B=[];for(let F=0;F<$.length;F++){const M=$[F],N=""+b+F;B.push(N),v[N]={node:M,lastCount:0},y[N]={};for(let I=0;I<C.length;I++){const A=C[I];v[A]&&v[A].node.mode===M.mode?(y[A][N]=u(v[A].lastCount+M.length,M.mode)-u(v[A].lastCount,M.mode),v[A].lastCount+=M.length):(v[A]&&(v[A].lastCount=M.length),y[A][N]=u(M.length,M.mode)+4+t.getCharCountIndicator(M.mode,E))}}C=B}for(let b=0;b<C.length;b++)y[C[b]].end=0;return{map:y,table:v}}function w(p,E){let v;const y=t.getBestModeForData(p);if(v=t.from(E,y),v!==t.BYTE&&v.bit<y.bit)throw new Error('"'+p+'" cannot be encoded with mode '+t.toString(v)+`.
 Suggested mode is: `+t.toString(y));switch(v===t.KANJI&&!l.isKanjiModeEnabled()&&(v=t.BYTE),v){case t.NUMERIC:return new e(p);case t.ALPHANUMERIC:return new r(p);case t.KANJI:return new i(p);case t.BYTE:return new n(p)}}o.fromArray=function(E){return E.reduce(function(v,y){return typeof y=="string"?v.push(w(y,null)):y.data&&v.push(w(y.data,y.mode)),v},[])},o.fromString=function(E,v){const y=h(E,l.isKanjiModeEnabled()),C=g(y),b=m(C,v),$=a.find_path(b.map,"start","end"),B=[];for(let F=1;F<$.length-1;F++)B.push(b.table[$[F]].node);return o.fromArray(f(B))},o.rawSplit=function(E){return o.fromArray(h(E,l.isKanjiModeEnabled()))}})(fe);const ht=L,yt=dt,We=xe,je=Re,tn=re,en=ie,wt=se,Tt=ct,nn=De,at=de,on=ue,rn=_,vt=fe;function sn(o,t){const e=o.size,r=en.getPositions(t);for(let n=0;n<r.length;n++){const i=r[n][0],s=r[n][1];for(let l=-1;l<=7;l++)if(!(i+l<=-1||e<=i+l))for(let a=-1;a<=7;a++)s+a<=-1||e<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?o.set(i+l,s+a,!0,!0):o.set(i+l,s+a,!1,!0))}}function ln(o){const t=o.size;for(let e=8;e<t-8;e++){const r=e%2===0;o.set(e,6,r,!0),o.set(6,e,r,!0)}}function an(o,t){const e=tn.getPositions(t);for(let r=0;r<e.length;r++){const n=e[r][0],i=e[r][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?o.set(n+s,i+l,!0,!0):o.set(n+s,i+l,!1,!0)}}function dn(o,t){const e=o.size,r=at.getEncodedBits(t);let n,i,s;for(let l=0;l<18;l++)n=Math.floor(l/3),i=l%3+e-8-3,s=(r>>l&1)===1,o.set(n,i,s,!0),o.set(i,n,s,!0)}function bt(o,t,e){const r=o.size,n=on.getEncodedBits(t,e);let i,s;for(i=0;i<15;i++)s=(n>>i&1)===1,i<6?o.set(i,8,s,!0):i<8?o.set(i+1,8,s,!0):o.set(r-15+i,8,s,!0),i<8?o.set(8,r-i-1,s,!0):i<9?o.set(8,15-i-1+1,s,!0):o.set(8,15-i-1,s,!0);o.set(r-8,8,1,!0)}function cn(o,t){const e=o.size;let r=-1,n=e-1,i=7,s=0;for(let l=e-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!o.isReserved(n,l-a)){let c=!1;s<t.length&&(c=(t[s]>>>i&1)===1),o.set(n,l-a,c),i--,i===-1&&(s++,i=7)}if(n+=r,n<0||e<=n){n-=r,r=-r;break}}}function un(o,t,e){const r=new We;e.forEach(function(a){r.put(a.mode.bit,4),r.put(a.getLength(),rn.getCharCountIndicator(a.mode,o)),a.write(r)});const n=ht.getSymbolTotalCodewords(o),i=Tt.getTotalCodewordsCount(o,t),s=(n-i)*8;for(r.getLengthInBits()+4<=s&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const l=(s-r.getLengthInBits())/8;for(let a=0;a<l;a++)r.put(a%2?17:236,8);return hn(r,o,t)}function hn(o,t,e){const r=ht.getSymbolTotalCodewords(t),n=Tt.getTotalCodewordsCount(t,e),i=r-n,s=Tt.getBlocksCount(t,e),l=r%s,a=s-l,c=Math.floor(r/s),d=Math.floor(i/s),h=d+1,u=c-d,f=new nn(u);let g=0;const m=new Array(s),w=new Array(s);let p=0;const E=new Uint8Array(o.buffer);for(let $=0;$<s;$++){const B=$<a?d:h;m[$]=E.slice(g,g+B),w[$]=f.encode(m[$]),g+=B,p=Math.max(p,B)}const v=new Uint8Array(r);let y=0,C,b;for(C=0;C<p;C++)for(b=0;b<s;b++)C<m[b].length&&(v[y++]=m[b][C]);for(C=0;C<u;C++)for(b=0;b<s;b++)v[y++]=w[b][C];return v}function fn(o,t,e,r){let n;if(Array.isArray(o))n=vt.fromArray(o);else if(typeof o=="string"){let c=t;if(!c){const d=vt.rawSplit(o);c=at.getBestVersionForData(d,e)}n=vt.fromString(o,c||40)}else throw new Error("Invalid data");const i=at.getBestVersionForData(n,e);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);const s=un(t,e,n),l=ht.getSymbolSize(t),a=new je(l);return sn(a,t),ln(a),an(a,t),bt(a,e,0),t>=7&&dn(a,t),cn(a,s),isNaN(r)&&(r=wt.getBestMask(a,bt.bind(null,a,e))),wt.applyMask(r,a),bt(a,e,r),{modules:a,version:t,errorCorrectionLevel:e,maskPattern:r,segments:n}}ne.create=function(t,e){if(typeof t=="undefined"||t==="")throw new Error("No input text");let r=yt.M,n,i;return typeof e!="undefined"&&(r=yt.from(e.errorCorrectionLevel,yt.M),n=at.from(e.version),i=wt.from(e.maskPattern),e.toSJISFunc&&ht.setToSJISFunction(e.toSJISFunc)),fn(t,n,r,i)};var me={},Ft={};(function(o){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let r=e.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+e);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(i){return[i,i]}))),r.length===6&&r.push("F","F");const n=parseInt(r.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+r.slice(0,6).join("")}}o.getOptions=function(r){r||(r={}),r.color||(r.color={});const n=typeof r.margin=="undefined"||r.margin===null||r.margin<0?4:r.margin,i=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:i,scale:i?4:s,margin:n,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},o.getScale=function(r,n){return n.width&&n.width>=r+n.margin*2?n.width/(r+n.margin*2):n.scale},o.getImageWidth=function(r,n){const i=o.getScale(r,n);return Math.floor((r+n.margin*2)*i)},o.qrToImageData=function(r,n,i){const s=n.modules.size,l=n.modules.data,a=o.getScale(s,i),c=Math.floor((s+i.margin*2)*a),d=i.margin*a,h=[i.color.light,i.color.dark];for(let u=0;u<c;u++)for(let f=0;f<c;f++){let g=(u*c+f)*4,m=i.color.light;if(u>=d&&f>=d&&u<c-d&&f<c-d){const w=Math.floor((u-d)/a),p=Math.floor((f-d)/a);m=h[l[w*s+p]?1:0]}r[g++]=m.r,r[g++]=m.g,r[g++]=m.b,r[g]=m.a}}})(Ft);(function(o){const t=Ft;function e(n,i,s){n.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=s,i.width=s,i.style.height=s+"px",i.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}o.render=function(i,s,l){let a=l,c=s;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(c=r()),a=t.getOptions(a);const d=t.getImageWidth(i.modules.size,a),h=c.getContext("2d"),u=h.createImageData(d,d);return t.qrToImageData(u.data,i,a),e(h,c,d),h.putImageData(u,0,0),c},o.renderToDataURL=function(i,s,l){let a=l;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const c=o.render(i,s,a),d=a.type||"image/png",h=a.rendererOpts||{};return c.toDataURL(d,h.quality)}})(me);var pe={};const gn=Ft;function te(o,t){const e=o.a/255,r=t+'="'+o.hex+'"';return e<1?r+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':r}function Et(o,t,e){let r=o+t;return typeof e!="undefined"&&(r+=" "+e),r}function mn(o,t,e){let r="",n=0,i=!1,s=0;for(let l=0;l<o.length;l++){const a=Math.floor(l%t),c=Math.floor(l/t);!a&&!i&&(i=!0),o[l]?(s++,l>0&&a>0&&o[l-1]||(r+=i?Et("M",a+e,.5+c+e):Et("m",n,0),n=0,i=!1),a+1<t&&o[l+1]||(r+=Et("h",s),s=0)):n++}return r}pe.render=function(t,e,r){const n=gn.getOptions(e),i=t.modules.size,s=t.modules.data,l=i+n.margin*2,a=n.color.light.a?"<path "+te(n.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",c="<path "+te(n.color.dark,"stroke")+' d="'+mn(s,i,n.margin)+'"/>',d='viewBox="0 0 '+l+" "+l+'"',h=n.width?'width="'+n.width+'" height="'+n.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+h+d+' shape-rendering="crispEdges">'+a+c+`</svg>
`;return typeof r=="function"&&r(null,u),u};const pn=Se,$t=ne,ye=me,yn=pe;function It(o,t,e,r,n){const i=[].slice.call(arguments,1),s=i.length,l=typeof i[s-1]=="function";if(!l&&!pn())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(n=e,e=t,t=r=void 0):s===3&&(t.getContext&&typeof n=="undefined"?(n=r,r=void 0):(n=r,r=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=r=void 0):s===2&&!t.getContext&&(r=e,e=t,t=void 0),new Promise(function(a,c){try{const d=$t.create(e,r);a(o(d,t,r))}catch(d){c(d)}})}try{const a=$t.create(e,r);n(null,o(a,t,r))}catch(a){n(a)}}S.create=$t.create;S.toCanvas=It.bind(null,ye.render);S.toDataURL=It.bind(null,ye.renderToDataURL);S.toString=It.bind(null,function(o,t,e){return yn.render(o,e)});class vn{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,r=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){r=!1;break}return r?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let r=this.tens[t.charAt(0)-3];return e>0&&(r+=" y "+this.getUnits(e)),r}getHundreds(t){let e="",r=t.charAt(0),n=t.substr(1);if(t==100)return"cien";switch(r){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(r)+"cientos"),n>0&&(e+=" "+this.getName(n)),e}getThousands(t){let e="mil",r=t.length-3,n=t.substr(0,r),i=t.substr(r);return n>1&&(e=this.getName(n).replace("uno","un")+" mil"),i>0&&(e+=" "+this.getName(i)),e}getPeriod(t,e,r){let n="un "+r,i=t.length-e,s=t.substr(0,i),l=t.substr(i);return s>1&&(n=this.getName(s).replace("uno","un")+" "+r.replace("\xF3","o")+"es"),l>0&&(n+=" "+this.getName(l)),n}}var U={conversorNumerosALetras:vn},ve={};Object.defineProperty(ve,"__esModule",{value:!0});function st(o){switch(o){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function k(o,t){return t>0?o+" y "+st(t):o}function P(o){var t=Math.floor(o/10),e=o-t*10;switch(t){case 1:switch(e){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+st(e).toLowerCase()}case 2:switch(e){case 0:return"Veinte";default:return"Veinti"+st(e).toLowerCase()}case 3:return k("Treinta",e);case 4:return k("Cuarenta",e);case 5:return k("Cincuenta",e);case 6:return k("Sesenta",e);case 7:return k("Setenta",e);case 8:return k("Ochenta",e);case 9:return k("Noventa",e);case 0:return st(e);default:return""}}function be(o){var t=Math.floor(o/100),e=o-t*100;switch(t){case 1:return e>0?"Ciento "+P(e):"Cien";case 2:return"Doscientos "+P(e);case 3:return"Trescientos "+P(e);case 4:return"Cuatrocientos "+P(e);case 5:return"Quinientos "+P(e);case 6:return"Seiscientos "+P(e);case 7:return"Setecientos "+P(e);case 8:return"Ochocientos "+P(e);case 9:return"Novecientos "+P(e);default:return P(e)}}function Ee(o,t,e,r){var n=Math.floor(o/t),i=o-n*t,s="";return n>0&&(n>1?s=be(n)+" "+r:s=e),i>0&&(s+=""),s}function bn(o){var t=1e3,e=Math.floor(o/t),r=o-e*t,n=Ee(o,t,"Un Mil","Mil"),i=be(r);return n===""?i:(n+" "+i).trim()}function ee(o){var t=1e6,e=Math.floor(o/t),r=o-e*t,n=Ee(o,t,"Un Mill\xF3n de","Millones de"),i=bn(r);return n===""?i:(n+" "+i).trim()}function En(o){var t={numero:o,enteros:Math.floor(o),centavos:Math.round(o*100)-Math.floor(o)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(ee(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(ee(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}ve.NumerosALetras=En;class An{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],r=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],n={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},i=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function s(h){if(h<10)return e[h];if(h>=10&&h<20)return n[h];if(h<100){const f=h%10;return`${r[Math.floor(h/10)]}${f>0?" y "+e[f]:""}`}if(h===100)return"cien";const u=h%100;return`${i[Math.floor(h/100)]}${u>0?" "+s(u):""}`}if(t===1e6)return"un mill\xF3n";let l=Math.floor(t/1e3),a=t%1e3,c=l>0?l===1?"mil":`${s(l)} mil`:"",d=a>0?s(a):"";return(c+" "+d).trim()}static imprimirCaja(t){var e,r,n;try{const i=x().env||{},s=g=>Number(g||0).toFixed(2),l=(g,m="\u2014")=>(g!=null?g:m).toString(),a=((e=t==null?void 0:t.observaciones)!=null?e:"").toString().trim(),c=`
      @page { margin: 6mm; }
      .imprimir-scope { font-family: "Courier New", Courier, monospace; font-size:10px; }
      .imprimir-scope .ticket { width:300px; margin:0 auto; }
      .imprimir-scope .center { text-align:center; }
      .imprimir-scope .right { text-align:right; }
      .imprimir-scope .bold { font-weight:700; }
      .imprimir-scope .small { font-size:9px; line-height:1.2; }
      .imprimir-scope hr { border:0; border-top:1px dashed #000; margin:6px 0; }
      .imprimir-scope table { width:100%; border-collapse:collapse; }
      .imprimir-scope td { padding:2px 0; vertical-align:top; }
      `,d=`
      <div class="imprimir-scope">
        <div class="ticket">
          <div class="center bold" style="font-size:12px;">RECIBO CAJA RECEPCI\xD3N</div>
          <div class="center small">
            ${l(i.razon,"CL\xCDNICA LA FUENTE")}<br>
            ${l(i.direccion,"")}<br>
            Tel. ${l(i.telefono,"")}
          </div>
          <hr>
          <table>
            <tr><td class="bold">Registro:</td><td>#${l(t==null?void 0:t.id)}</td></tr>
            <tr><td class="bold">Fecha/Hora:</td><td>${l(t==null?void 0:t.fecha)} ${l(t==null?void 0:t.hora,"")}</td></tr>
            <tr><td class="bold">Paciente:</td><td>${l((r=t==null?void 0:t.paciente)==null?void 0:r.nombre_completo,"SN")}</td></tr>
            <tr><td class="bold">Ficha:</td><td>${l(t==null?void 0:t.numero_ficha,"-")}</td></tr>
            <tr><td class="bold">Encargado:</td><td>${l((n=t==null?void 0:t.user)==null?void 0:n.name,"-")}</td></tr>
            <tr><td class="bold">Documento:</td><td>${l(t==null?void 0:t.documento_label,"-")}</td></tr>
          </table>
          <hr>
          <table>
            <tr><td>Recaudado</td><td class="right bold">${s(t==null?void 0:t.recaudado_total)} Bs</td></tr>
            <tr><td>QR</td><td class="right">${s(t==null?void 0:t.qr)} Bs</td></tr>
            <tr><td>Efectivo</td><td class="right">${s(t==null?void 0:t.efectivo)} Bs</td></tr>
            <tr><td>Egreso</td><td class="right">${s(t==null?void 0:t.egreso)} Bs</td></tr>
            <tr><td>Farmacia</td><td class="right">${s(t==null?void 0:t.costo_farmacia)} Bs</td></tr>
            <tr><td class="bold">Saldo final</td><td class="right bold">${s(t==null?void 0:t.saldo_final)} Bs</td></tr>
          </table>
          ${a?`<hr><div><span class="bold">Obs:</span> ${a}</div>`:""}
        </div>
      </div>`,h=document.getElementById("myElement");if(!h)return;h.innerHTML=d;const u=h.querySelector(".imprimir-scope");new R().print(u,c)}catch(i){console.error("imprimirCaja error:",i)}}static async factura(t){return new Promise(async(e,r)=>{var n,i,s,l,a,c,d,h,u,f,g,m,w,p,E,v,y,C,b,$,B;try{const F=U.conversorNumerosALetras,M=new F,N=x().env,I=T=>Number(T||0).toFixed(2),A=T=>(T!=null?T:"").toString(),O=Number((i=(n=t.total)!=null?n:t.montoTotal)!=null?i:0),Y=(a=(l=(s=t.numeroFactura)!=null?s:t.numero_factura)!=null?l:t.id)!=null?a:"\u2014",W=(c=t.fechaEmision)!=null?c:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",j=(u=(h=t.nombre)!=null?h:(d=t==null?void 0:t.cliente)==null?void 0:d.nombre)!=null?u:"SN",K=(m=(g=t.complemento)!=null?g:(f=t==null?void 0:t.cliente)==null?void 0:f.complemento)!=null?m:"",tt=(E=(p=t.ci)!=null?p:(w=t==null?void 0:t.cliente)==null?void 0:w.ci)!=null?E:"0",et=(C=(y=t.cliente_id)!=null?y:(v=t==null?void 0:t.cliente)==null?void 0:v.id)!=null?C:"\u2014",nt=(b=N==null?void 0:N.puntoVenta)!=null?b:0,ft=($=t.cuf)!=null?$:null,G=ft?ft.match(/.{1,20}/g).join("<br>"):null,Ce=ft?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",we=(B=t.leyenda)!=null?B:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",Te=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],Mt=Math.floor(O),$e=Math.round((O-Mt)*100).toString().padStart(2,"0"),Ae=`Son ${M.convertToText(Mt)} ${$e}/100 Bolivianos`;let ot=null;G&&(ot=await S.toDataURL(`${N.url2}consulta/QR?nit=${N.nit}&cuf=${G}&numero=${Y}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let gt=`${this.head()}
<style>
/* Ticket 80mm ~ 300px */
.ticket { width:300px; margin:0 auto; }
.mono { font-family: "Courier New", Courier, monospace; }
.fs9 { font-size:9px; } .fs10{font-size:10px;} .fs11{font-size:11px;} .fs12{font-size:12px;}
.center{ text-align:center; } .right{ text-align:right; } .left{ text-align:left; }
hr{ border:0; border-top:1px dashed #000; margin:6px 0; }
.title{ font-weight:700; text-transform:uppercase; line-height:1.15; }
.small { font-size:8px; line-height:1.25; }

.tbl{ width:100%; border-collapse:collapse; }
.tbl td{ padding:2px 0; vertical-align:top; }

.lbl{ width:135px; font-weight:700; text-transform:uppercase; }
.val{ width:auto; }

.det-header{ font-weight:700; text-transform:uppercase; margin:4px 0; }
.item-desc{ font-weight:700; }
.item-meta{ color:#111; }

.tot td{ padding:1px 0; }
.tot .l{ width:70%; }
.tot .r{ width:30%; text-align:right; }

.qr{ display:flex; justify-content:center; margin-top:6px; }
@page { margin: 6mm; }
</style>

<div class="ticket mono fs10">
  <div class="title fs12 center">${Ce}</div>

  <div class="center small">
    ${A(N.razon)}<br>
    Casa Matriz<br>
    No. Punto de Venta ${nt}<br>
    ${A(N.direccion)}<br>
    Tel. ${A(N.telefono)}<br>
    Oruro
  </div>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NIT</td><td class="val">${A(N.nit)}</td></tr>
    <tr><td class="lbl">FACTURA N\xB0</td><td class="val">${Y}</td></tr>
    <tr><td class="lbl">C\xD3D. AUTORIZACI\xD3N</td><td class="val">${G!=null?G:"\u2014"}</td></tr>
  </table>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NOMBRE/RAZ\xD3N SOCIAL</td><td class="val">${A(j)}</td></tr>
    <tr><td class="lbl">NIT/CI/CEX</td><td class="val">${A(tt)}${A(K?"-"+K:"")}</td></tr>
    <tr><td class="lbl">NRO. CLIENTE</td><td class="val">${A(et)}</td></tr>
    <tr><td class="lbl">FECHA DE EMISI\xD3N</td><td class="val">${A(W)}</td></tr>
  </table>

  <hr>
  <div class="det-header center">DETALLE</div>`;Te.forEach(T=>{var Rt,Pt,Dt,Ot,Ut,zt,_t,kt,Vt,Ht,Jt,qt,Yt,Kt,Gt,Qt,Zt,Xt;const Ne=(Ot=(Dt=(Rt=T.producto_id)!=null?Rt:T.product_id)!=null?Dt:(Pt=T==null?void 0:T.producto)==null?void 0:Pt.id)!=null?Ot:"\u2014",Be=A((kt=(_t=(Ut=T.nombre)!=null?Ut:T.descripcion)!=null?_t:(zt=T==null?void 0:T.producto)==null?void 0:zt.nombre)!=null?kt:""),Fe=A((Jt=(Ht=T.unidad)!=null?Ht:(Vt=T==null?void 0:T.producto)==null?void 0:Vt.unidad)!=null?Jt:""),St=Number((Yt=(qt=T.cantidad)!=null?qt:T.qty)!=null?Yt:0),Lt=Number((Gt=(Kt=T.precio)!=null?Kt:T.precioUnitario)!=null?Gt:0),xt=Number((Zt=(Qt=T.descuento)!=null?Qt:T.montoDescuento)!=null?Zt:0),Ie=(Xt=T.subTotal)!=null?Xt:St*Lt-xt;gt+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${Ne} - ${Be}</td>
          <td class="right item-desc">${I(Ie)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Fe||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${I(St)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${I(Lt)} - ${I(xt)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),gt+=`
  <hr>
  <table class="tbl tot fs10">
    <tr><td class="l left strong">TOTAL Bs</td><td class="r strong">${I(O)}</td></tr>
    <tr><td class="l left">(-) DESCUENTO Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">SUBTOTAL A PAGAR Bs</td><td class="r strong">${I(O)}</td></tr>
    <tr><td class="l left">(-) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">MONTO TOTAL A PAGAR Bs</td><td class="r strong">${I(O)}</td></tr>
    <tr><td class="l left">(-) TASAS Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(-) OTROS PAGOS NO SUJETO IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(+) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">IMPORTE BASE CR\xC9DITO FISCAL</td><td class="r strong">${I(O)}</td></tr>
  </table>

  <div class="fs10" style="margin-top:6px;">${Ae}</div>

  <hr>
  <div class="center small">
    ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY
  </div>
  <div class="center small" style="margin-top:4px;">${A(we)}</div>
  <div class="center small" style="margin-top:4px;">\u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n en l\xEDnea\u201D</div>
  ${ot?`<div class="qr"><img src="${ot}" alt="QR"></div>`:""}
</div>`;const mt=document.getElementById("myElement");mt&&(mt.innerHTML=gt),new R().print(mt),e(ot)}catch(F){r(F)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((r,n)=>{const i=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};x().env,S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(l=>{let a="",c="";t.producto&&(a="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(c="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let d=`${this.head()}
  <!--div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE VENTA"}</div>
      <div class='titulo2'>${t.tipo_comprobante} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
Calle Beni Nro. 60, entre 6 de Octubre y Potos\xED.<br>
Tel. 25247993 - 76148555<br>
Oruro</div!-->
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
   .mono {
    font-family: Monospace,serif !important;
    font-size: 18px !important;
  }
</style>
<title></title>
</head>
<body>
<div class="mono">
<hr>
<table>
<tr><td class='titder'>ID:</td><td class='titder'>${t.id}</td></tr>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='titder'>${t.nombre}</td></tr>
<tr><!-- td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td --></tr>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
${a}
${c}
</table><hr><div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(h=>{var u;console.log("r",h),d+=`<div style='font-size: 12px'><b> ${(u=h.producto)==null?void 0:u.nombre} </b></div>`,h.visible===1?d+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${h.cantidad}
                    </span>
                    <span>
                    ${parseFloat(h.precio).toFixed(2)}
                    </span>

                    <span style='float:right'>
                        ${parseFloat(h.precio*h.cantidad).toFixed(2)}
                    </span>
                    </div>`:d+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${h.cantidad}
                    </span>
                    <span>

                    </span>

                    <span style='float:right'>

                    </span>`}),d+=`<hr>
<div>${t.comentario===""||t.comentario===null||t.comentario===void 0?"":"Comentario: "+t.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='titder'>${parseFloat(t.total).toFixed(2)}</td></tr>
<!--      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='titder'>${parseFloat(t.descuento).toFixed(2)}</td></tr>-->
<!--      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='titder'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>-->
      </table>
      <br>
      <div>Son ${i} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
        <!--div style='display: flex;justify-content: center;'>
          <img  src="${l}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=d,e&&new R().print(document.getElementById("myElement")),r(l)}).catch(l=>{n(l)})})}static cotizacion(t,e,r,n,i=!0){return(n==null||n==="")&&(n=0),new Promise((s,l)=>{const a=U.conversorNumerosALetras,d=new a().convertToText(parseInt(r)),h=Me().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=x().env;S.toDataURL(`Fecha: ${h} Monto: ${parseFloat(r).toFixed(2)}`,u).then(g=>{let m=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>COTIZACION</div>
      <div class='titulo2'>${f.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${f.direccion}<br>
Tel. ${f.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${e.nombre}</td>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${h}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(w=>{m+=`<div style='font-size: 12px'><b> ${w.nombre} </b></div>`,m+=`<div><span style='font-size: 18px;font-weight: bold'>${w.cantidadVenta}</span> ${parseFloat(w.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(w.precioVenta*w.cantidadVenta).toFixed(2)}</span></div>`}),m+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(n).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(r-n).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${d} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${g}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=m,i&&new R().print(document.getElementById("myElement")),s(g)}).catch(g=>{l(g)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,r)=>{const n=U.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(async c=>{let d=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE COMPRA"}</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${a.direccion}<br>
Tel. ${a.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.client?t.client.nombre:""}</td>
</tr><tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td></tr>
<!--<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha_emision}</td></tr>-->
</table><hr><div class='titulo'>DETALLE</div>`;t.buy_details.forEach(u=>{d+=`<div style='font-size: 12px'><b>${u.nombre} </b></div>`,d+=`<div><span style='font-size: 14px;font-weight: bold'>${u.cantidad}</span> ${parseFloat(u.precio).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(u.subtotal).toFixed(2)}</span></div>`}),d+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(t.descuento).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${c}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{r(c)})})}static reportTotal(t,e){const r=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,l)=>s+l.montoTotal,0),n=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,l)=>s+l.montoTotal,0),i=r-n;return console.log("montoTotal",i),new Promise((s,l)=>{const a=U.conversorNumerosALetras,c=new a,d=Math.abs(i),h=c.convertToText(parseInt(d)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=x().env;S.toDataURL(` Monto: ${parseFloat(i).toFixed(2)}`,u).then(g=>{let m=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>title</div>
      <div class='titulo2'>${f.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${f.direccion}<br>
Tel. ${f.telefono}<br>
Oruro</div>
<hr>
<table>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(p=>{m+=`<div style='font-size: 12px'><b> ${p.user.name} </b></div>`,m+=`<div> ${parseFloat(p.montoTotal).toFixed(2)} ${p.tipoVenta}
          <span style='float:right'> ${p.tipoVenta==="Egreso"?"-":""} ${parseFloat(p.montoTotal).toFixed(2)}</span></div>`}),m+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(i).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${h} ${((parseFloat(i)-Math.floor(parseFloat(i)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${g}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=m,new R().print(document.getElementById("myElement")),s(g)}).catch(g=>{l(g)})})}static reciboCompra(t){return console.log("reciboCompra",t),new Promise((e,r)=>{var d;const n=U.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),l=((d=t.comentario)!=null?d:"").toString().trim(),a={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},c=x().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,a).then(h=>{let u=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE COMPRA</div>
      <div class='titulo2'>${c.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${c.direccion}<br>
    Tel. ${c.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(g=>{u+=`<div style='font-size: 12px'><b>${g.nombre} </b></div>`,u+=`<div>${g.cantidad} ${parseFloat(g.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(g.total).toFixed(2)}</span></div>`}),u+=`<hr>
      <div>${l?"Comentario: "+l:""}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${h}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=u,new R().print(document.getElementById("myElement")),e(h)}).catch(h=>{r(h)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,r)=>{const n=U.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(c=>{let d=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE PEDIDO</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${a.direccion}<br>
    Tel. ${a.telefono}<br>
    Oruro</div>
    <hr>
    <div style='display: flex;justify-content: space-between;'>
        <div class='titulo'>FECHA HORA</div>
        <div class='titulo2'>${t.fecha} ${t.hora}</div>
    </div>
    <div style='display: flex;justify-content: space-between;'>
        <div class='titulo'>ID</div>
        <div class='titulo2'>${t.id}</div>
    </div>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.detalles.forEach(u=>{var f;d+=`<div style='font-size: 12px'><b>${(f=u.producto)==null?void 0:f.nombre} </b></div>`,d+=`<div>${u.cantidad} ${parseFloat(u.cantidad).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(u.cantidad).toFixed(2)}</span></div>`}),d+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${c}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{r(c)})})}static reciboTranferencia(t,e,r,n){return console.log("producto",t,"de",e,"ha",r,"cantidad",n),new Promise((i,s)=>{const l=U.conversorNumerosALetras,c=new l().convertToText(parseInt(n)),d={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=x().env;S.toDataURL(`de: ${e} A: ${r}`,d).then(u=>{let f=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE TRANSFERENCIA</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${h.direccion}<br>
    Tel. ${h.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;f+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${e} a ${r} </b></div>`,f+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>CANTIDAD </td><td class='conte2'>${n+""}</td></tr>
      </table>
      <br>
      <div>Son ${c+""} ${n+""} unidades</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${u}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=f,new R().print(document.getElementById("myElement")),i(u)}).catch(u=>{s(u)})})}static reciboTraspaso(t){return new Promise((e,r)=>{var n,i;try{const s=x().env,l=((n=t.comentario)!=null?n:"").toString().trim();let a=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE TRASPASO</div>
      <div class='titulo2'>${s.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${s.direccion}<br>
    Tel. ${s.telefono}<br>
    Oruro</div>
    <hr>
    <div style='display:flex;justify-content:space-between; font-size:10px;'>
      <span><b>ID:</b> ${t.id}</span>
      <span><b>Fecha:</b> ${t.fecha} ${t.hora||""}</span>
    </div>
    <div style='font-size:10px; margin-top:4px;'>
      <b>Origen:</b> ${t.farmacia_origen||"-"}<br>
      <b>Destino:</b> ${t.farmacia_destino||"-"}<br>
      <b>Usuario:</b> ${((i=t.user)==null?void 0:i.name)||"-"}
    </div>
    <hr>
    <div class='titulo'>DETALLE</div>`;(t.venta_detalles||[]).forEach(d=>{var h;a+=`<div style='font-size: 12px'><b>${d.nombre||((h=d.producto)==null?void 0:h.nombre)||"Producto"}</b></div>`,a+=`<div>${d.cantidad} u | Lote: ${d.lote||"-"} | Vence: ${d.fecha_vencimiento||"-"}
          <span style='float:right'>${parseFloat(d.precio||0).toFixed(2)} Bs</span></div>`}),a+=`<hr>
      <div>${l?"Comentario: "+l:""}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total||0).toFixed(2)}</td></tr>
      </table>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=a,new R().print(document.getElementById("myElement")),e(!0)}catch(s){r(s)}})}static head(){return`<html>
<style>
      .titulo{
      font-size: 12px;
      text-align: center;
      font-weight: bold;
      }
      .titulo2{
      font-size: 10px;
      text-align: center;
      }
            .titulo3{
      font-size: 10px;
      text-align: center;
      width:70%;
      }
            .contenido{
      font-size: 10px;
      text-align: left;
      }
      .conte2{
      font-size: 10px;
      text-align: right;
      }
      .titder{
      font-size: 12px;
      text-align: right;
      font-weight: bold;
      }
      hr{
  border-top: 1px dashed   ;
}
  table{
    width:100%
  }
  h1 {
    color: black;
    font-family: sans-serif;
  }
  </style>
<body>
<div style="width: 300px;">`}static async printFactura(t){var h,u;const e=U.conversorNumerosALetras,n=new e().convertToText(parseInt(t.total)),i=x().env,s=await S.toDataURL(`${i.url2}consulta/QR?nit=${i.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),l=t.online?"en":"fuera de";let a=`<style>
    .titulo { font-size: 12px; text-align: center; font-weight: bold; }
    .titulo2 { font-size: 10px; text-align: center; }
    .contenido { font-size: 10px; text-align: left; }
    .conte2 { font-size: 10px; text-align: right; }
    .titder { font-size: 12px; text-align: right; font-weight: bold; }
    hr { border-top: 1px dashed; }
  </style>
  <div style='padding: 0.5cm'>
    <div class='titulo'>FACTURA CON DERECHO A CREDITO FISCAL</div>
    <div class='titulo2'>
      ${i.razon}<br>Casa Matriz<br>No. Punto de Venta 0<br>
      ${i.direccion}<br>Tel. ${i.telefono}<br>Oruro
    </div>
    <hr>
    <div class='titulo'>NIT</div><div class='titulo2'>${i.nit}</div>
    <div class='titulo'>FACTURA N\xB0</div><div class='titulo2'>${t.id}</div>
    <div class='titulo'>C\xD3D. AUTORIZACI\xD3N</div><div class='titulo2'>${t.cuf}</div>
    <hr>
    <table>
      <tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.nombre}</td></tr>
      <tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.ci}${(h=t.cliente)!=null&&h.complemento?"-"+((u=t.cliente)==null?void 0:u.complemento):""}</td></tr>
      <tr><td class='titder'>COD. CLIENTE:</td><td class='contenido'>${t.cliente.id}</td></tr>
      <tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
    </table>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(f=>{a+=`<div style='font-size: 12px'><b>${f.id} - ${f.nombre}</b></div>
             <div>${f.cantidad} ${parseFloat(f.precio).toFixed(2)} 0.00
             <span style='float:right'>${parseFloat(f.cantidad*f.precio).toFixed(2)}</span></div>`}),a+=`<hr>
    <table style='font-size: 8px;'>
      <tr><td class='titder'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>DESCUENTO Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>MONTO GIFT CARD Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>MONTO A PAGAR Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>IMPORTE BASE CR\xC9DITO FISCAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
    </table><br>
    <div>Son ${n} ${((parseFloat(t.total)-Math.floor(t.total))*100).toFixed(0)}/100 Bolivianos</div>
    <hr>
    <div class='titulo2' style='font-size: 9px'>ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY<br><br>
    ${t.leyenda}<br><br>
    \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n ${l} l\xEDnea\u201D</div>
    <div style='display: flex; justify-content: center;'>
      <img src="${s}" />
    </div>
  </div>`;const c=document.getElementById("myElement");c&&(c.innerHTML=a),new R().print(c)}static async reciboVentaSimple(t,e=!0){var r,n,i;try{const s=x().env||{},l=U.conversorNumerosALetras,a=new l,c=b=>Number(b||0).toFixed(2),d=(b,$="\u2014")=>(b!=null?b:$).toString(),h=Number((r=t.total)!=null?r:0),u=Math.floor(h),f=Math.round((h-u)*100).toString().padStart(2,"0"),g=`Son ${a.convertToText(u)} ${f}/100 Bolivianos`,m=((n=t.comentario)!=null?n:"").toString().trim(),w=d(t.farmacia_tipo||"Farmacia","Farmacia"),p=w==="Farmacia institucional"?"badge-institucional":"badge-farmacia",E=Array.isArray(t.venta_detalles)?t.venta_detalles:[],v=`
      @page { margin: 6mm; }
      .imprimir-scope { font-family: "Courier New", Courier, monospace; font-size:10px; }
      .imprimir-scope .ticket { width:300px; margin:0 auto; }
      .imprimir-scope .center{ text-align:center; }
      .imprimir-scope .right{ text-align:right; }
      .imprimir-scope .left{ text-align:left; }
      .imprimir-scope .bold{ font-weight:700; }
      .imprimir-scope .mt4{ margin-top:4px; }
      .imprimir-scope .mt6{ margin-top:6px; }
      .imprimir-scope hr{ border:0; border-top:1px dashed #000; margin:6px 0; }
      .imprimir-scope table{ width:100%; border-collapse:collapse; }
      .imprimir-scope td{ vertical-align:top; padding:1px 0; }
      .imprimir-scope .small{ font-size:9px; line-height:1.2; }
      .imprimir-scope .farmacia-badge{ display:inline-block; color:#fff; font-weight:700; padding:3px 8px; border-radius:4px; margin-top:4px; text-transform:uppercase; letter-spacing:0.03em; }
      .imprimir-scope .badge-farmacia{ background:#16a34a; }
      .imprimir-scope .badge-institucional{ background:#2563eb; }
    `;let y=`
      <div class="imprimir-scope">
        <div class="ticket">
          <div class="center bold" style="font-size:12px;">RECIBO DE VENTA</div>
          <div class="center">
            <span class="farmacia-badge ${p}">${w}</span>
          </div>
          <div class="center small">
            ${d(s.razon,"\u2014")}<br>
            ${d(s.direccion,"")}<br>
            Tel. ${d(s.telefono,"")} \xB7 Oruro
          </div>

          <hr>

          <table>
            <tr><td class="bold">Nro:</td><td>${d(t.id)}</td></tr>
            <tr><td class="bold">Fecha/Hora:</td><td>${d(t.fecha)} ${d(t.hora,"")}</td></tr>
            <tr><td class="bold">Usuario:</td><td>${d((i=t.user)==null?void 0:i.name,"")}</td></tr>
            <tr><td class="bold">Tipo venta:</td><td>${d(t.tipo_venta,"")}</td></tr>
            <tr><td class="bold">Pago:</td><td>${d(t.tipo_pago,"")}</td></tr>
          </table>

          <hr>

          <table>
            <tr class="bold"><td>Detalle</td><td class="right">Subt.</td></tr>
            ${E.map(b=>{var A,O,Y,W,j,K,tt,et,nt;const $=d((Y=(O=(A=b.producto)==null?void 0:A.nombre)!=null?O:b.nombre)!=null?Y:""),B=Number(b.cantidad||0),F=Number(b.precio||0),M=B*F,N=d((K=(j=b.unidad)!=null?j:(W=b.producto)==null?void 0:W.unidad)!=null?K:""),I=d((nt=(et=b.producto_id)!=null?et:(tt=b.producto)==null?void 0:tt.id)!=null?nt:"");return`
                <tr>
                  <td>
                    <div class="bold">${I?I+" - ":""}${$}</div>
                    <div class="small">${N?"UM: "+N+" \xB7 ":""}${c(B)} x ${c(F)}</div>
                  </td>
                  <td class="right bold">${c(M)}</td>
                </tr>
              `}).join("")}
          </table>

          <hr>

          <table>
            <tr><td class="bold">TOTAL (Bs)</td><td class="right bold">${c(h)}</td></tr>
          </table>

          ${m?`<div class="mt6"><span class="bold">Comentario:</span> ${m}</div>`:""}

          <div class="mt6">${g}</div>

          <hr>

          <div class="center small">
            \xA1Gracias por su compra!
          </div>
        </div>
      </div>
    `;const C=document.getElementById("myElement");if(C){C.innerHTML=y;const b=C.querySelector(".imprimir-scope");e&&new R().print(b,v)}return!0}catch(s){throw console.error("reciboVentaSimple error:",s),s}}}export{An as I};
