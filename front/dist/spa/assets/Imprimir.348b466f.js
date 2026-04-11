import{u as x}from"./index.3eb6dc09.js";import{P as R}from"./index.aa4d44c1.js";import{h as Ie}from"./moment.40bc58bf.js";var S={},Se=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},te={},L={};let Tt;const Le=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];L.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};L.getSymbolTotalCodewords=function(t){return Le[t]};L.getBCHDigit=function(n){let t=0;for(;n!==0;)t++,n>>>=1;return t};L.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');Tt=t};L.isKanjiModeEnabled=function(){return typeof Tt!="undefined"};L.toSJIS=function(t){return Tt(t)};var at={};(function(n){n.L={bit:1},n.M={bit:0},n.Q={bit:3},n.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return n.L;case"m":case"medium":return n.M;case"q":case"quartile":return n.Q;case"h":case"high":return n.H;default:throw new Error("Unknown EC Level: "+e)}}n.isValid=function(r){return r&&typeof r.bit!="undefined"&&r.bit>=0&&r.bit<4},n.from=function(r,o){if(n.isValid(r))return r;try{return t(r)}catch{return o}}})(at);function ee(){this.buffer=[],this.length=0}ee.prototype={get:function(n){const t=Math.floor(n/8);return(this.buffer[t]>>>7-n%8&1)===1},put:function(n,t){for(let e=0;e<t;e++)this.putBit((n>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(n){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),n&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var xe=ee;function Q(n){if(!n||n<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=n,this.data=new Uint8Array(n*n),this.reservedBit=new Uint8Array(n*n)}Q.prototype.set=function(n,t,e,r){const o=n*this.size+t;this.data[o]=e,r&&(this.reservedBit[o]=!0)};Q.prototype.get=function(n,t){return this.data[n*this.size+t]};Q.prototype.xor=function(n,t,e){this.data[n*this.size+t]^=e};Q.prototype.isReserved=function(n,t){return this.reservedBit[n*this.size+t]};var Re=Q,ne={};(function(n){const t=L.getSymbolSize;n.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,i=t(r),s=i===145?26:Math.ceil((i-13)/(2*o-2))*2,a=[i-7];for(let l=1;l<o-1;l++)a[l]=a[l-1]-s;return a.push(6),a.reverse()},n.getPositions=function(r){const o=[],i=n.getRowColCoords(r),s=i.length;for(let a=0;a<s;a++)for(let l=0;l<s;l++)a===0&&l===0||a===0&&l===s-1||a===s-1&&l===0||o.push([i[a],i[l]]);return o}})(ne);var oe={};const Pe=L.getSymbolSize,Zt=7;oe.getPositions=function(t){const e=Pe(t);return[[0,0],[e-Zt,0],[0,e-Zt]]};var re={};(function(n){n.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};n.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},n.from=function(o){return n.isValid(o)?parseInt(o,10):void 0},n.getPenaltyN1=function(o){const i=o.size;let s=0,a=0,l=0,d=null,c=null;for(let f=0;f<i;f++){a=l=0,d=c=null;for(let u=0;u<i;u++){let h=o.get(f,u);h===d?a++:(a>=5&&(s+=t.N1+(a-5)),d=h,a=1),h=o.get(u,f),h===c?l++:(l>=5&&(s+=t.N1+(l-5)),c=h,l=1)}a>=5&&(s+=t.N1+(a-5)),l>=5&&(s+=t.N1+(l-5))}return s},n.getPenaltyN2=function(o){const i=o.size;let s=0;for(let a=0;a<i-1;a++)for(let l=0;l<i-1;l++){const d=o.get(a,l)+o.get(a,l+1)+o.get(a+1,l)+o.get(a+1,l+1);(d===4||d===0)&&s++}return s*t.N2},n.getPenaltyN3=function(o){const i=o.size;let s=0,a=0,l=0;for(let d=0;d<i;d++){a=l=0;for(let c=0;c<i;c++)a=a<<1&2047|o.get(d,c),c>=10&&(a===1488||a===93)&&s++,l=l<<1&2047|o.get(c,d),c>=10&&(l===1488||l===93)&&s++}return s*t.N3},n.getPenaltyN4=function(o){let i=0;const s=o.data.length;for(let l=0;l<s;l++)i+=o.data[l];return Math.abs(Math.ceil(i*100/s/5)-10)*t.N4};function e(r,o,i){switch(r){case n.Patterns.PATTERN000:return(o+i)%2===0;case n.Patterns.PATTERN001:return o%2===0;case n.Patterns.PATTERN010:return i%3===0;case n.Patterns.PATTERN011:return(o+i)%3===0;case n.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(i/3))%2===0;case n.Patterns.PATTERN101:return o*i%2+o*i%3===0;case n.Patterns.PATTERN110:return(o*i%2+o*i%3)%2===0;case n.Patterns.PATTERN111:return(o*i%3+(o+i)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}n.applyMask=function(o,i){const s=i.size;for(let a=0;a<s;a++)for(let l=0;l<s;l++)i.isReserved(l,a)||i.xor(l,a,e(o,l,a))},n.getBestMask=function(o,i){const s=Object.keys(n.Patterns).length;let a=0,l=1/0;for(let d=0;d<s;d++){i(d),n.applyMask(d,o);const c=n.getPenaltyN1(o)+n.getPenaltyN2(o)+n.getPenaltyN3(o)+n.getPenaltyN4(o);n.applyMask(d,o),c<l&&(l=c,a=d)}return a}})(re);var lt={};const z=at,nt=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],ot=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];lt.getBlocksCount=function(t,e){switch(e){case z.L:return nt[(t-1)*4+0];case z.M:return nt[(t-1)*4+1];case z.Q:return nt[(t-1)*4+2];case z.H:return nt[(t-1)*4+3];default:return}};lt.getTotalCodewordsCount=function(t,e){switch(e){case z.L:return ot[(t-1)*4+0];case z.M:return ot[(t-1)*4+1];case z.Q:return ot[(t-1)*4+2];case z.H:return ot[(t-1)*4+3];default:return}};var ie={},ct={};const G=new Uint8Array(512),it=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)G[e]=t,it[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)G[e]=G[e-255]})();ct.log=function(t){if(t<1)throw new Error("log("+t+")");return it[t]};ct.exp=function(t){return G[t]};ct.mul=function(t,e){return t===0||e===0?0:G[it[t]+it[e]]};(function(n){const t=ct;n.mul=function(r,o){const i=new Uint8Array(r.length+o.length-1);for(let s=0;s<r.length;s++)for(let a=0;a<o.length;a++)i[s+a]^=t.mul(r[s],o[a]);return i},n.mod=function(r,o){let i=new Uint8Array(r);for(;i.length-o.length>=0;){const s=i[0];for(let l=0;l<o.length;l++)i[l]^=t.mul(o[l],s);let a=0;for(;a<i.length&&i[a]===0;)a++;i=i.slice(a)}return i},n.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let i=0;i<r;i++)o=n.mul(o,new Uint8Array([1,t.exp(i)]));return o}})(ie);const se=ie;function At(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}At.prototype.initialize=function(t){this.degree=t,this.genPoly=se.generateECPolynomial(this.degree)};At.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const e=new Uint8Array(t.length+this.degree);e.set(t);const r=se.mod(e,this.genPoly),o=this.degree-r.length;if(o>0){const i=new Uint8Array(this.degree);return i.set(r,o),i}return r};var De=At,ae={},_={},$t={};$t.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var D={};const le="[0-9]+",Oe="[A-Z $%*+\\-./:]+";let Z="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Z=Z.replace(/u/g,"\\u");const Ue="(?:(?![A-Z0-9 $%*+\\-./:]|"+Z+`)(?:.|[\r
]))+`;D.KANJI=new RegExp(Z,"g");D.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");D.BYTE=new RegExp(Ue,"g");D.NUMERIC=new RegExp(le,"g");D.ALPHANUMERIC=new RegExp(Oe,"g");const ze=new RegExp("^"+Z+"$"),_e=new RegExp("^"+le+"$"),ke=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");D.testKanji=function(t){return ze.test(t)};D.testNumeric=function(t){return _e.test(t)};D.testAlphanumeric=function(t){return ke.test(t)};(function(n){const t=$t,e=D;n.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},n.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},n.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},n.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},n.MIXED={bit:-1},n.getCharCountIndicator=function(i,s){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?i.ccBits[0]:s<27?i.ccBits[1]:i.ccBits[2]},n.getBestModeForData=function(i){return e.testNumeric(i)?n.NUMERIC:e.testAlphanumeric(i)?n.ALPHANUMERIC:e.testKanji(i)?n.KANJI:n.BYTE},n.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},n.isValid=function(i){return i&&i.bit&&i.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return n.NUMERIC;case"alphanumeric":return n.ALPHANUMERIC;case"kanji":return n.KANJI;case"byte":return n.BYTE;default:throw new Error("Unknown mode: "+o)}}n.from=function(i,s){if(n.isValid(i))return i;try{return r(i)}catch{return s}}})(_);(function(n){const t=L,e=lt,r=at,o=_,i=$t,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,a=t.getBCHDigit(s);function l(u,h,m){for(let y=1;y<=40;y++)if(h<=n.getCapacity(y,m,u))return y}function d(u,h){return o.getCharCountIndicator(u,h)+4}function c(u,h){let m=0;return u.forEach(function(y){m+=d(y.mode,h)+y.getBitsLength()}),m}function f(u,h){for(let m=1;m<=40;m++)if(c(u,m)<=n.getCapacity(m,h,o.MIXED))return m}n.from=function(h,m){return i.isValid(h)?parseInt(h,10):m},n.getCapacity=function(h,m,y){if(!i.isValid(h))throw new Error("Invalid QR Code version");typeof y=="undefined"&&(y=o.BYTE);const w=t.getSymbolTotalCodewords(h),p=e.getTotalCodewordsCount(h,m),E=(w-p)*8;if(y===o.MIXED)return E;const v=E-d(y,h);switch(y){case o.NUMERIC:return Math.floor(v/10*3);case o.ALPHANUMERIC:return Math.floor(v/11*2);case o.KANJI:return Math.floor(v/13);case o.BYTE:default:return Math.floor(v/8)}},n.getBestVersionForData=function(h,m){let y;const w=r.from(m,r.M);if(Array.isArray(h)){if(h.length>1)return f(h,w);if(h.length===0)return 1;y=h[0]}else y=h;return l(y.mode,y.getLength(),w)},n.getEncodedBits=function(h){if(!i.isValid(h)||h<7)throw new Error("Invalid QR Code version");let m=h<<12;for(;t.getBCHDigit(m)-a>=0;)m^=s<<t.getBCHDigit(m)-a;return h<<12|m}})(ae);var ce={};const Et=L,de=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Ve=1<<14|1<<12|1<<10|1<<4|1<<1,Qt=Et.getBCHDigit(de);ce.getEncodedBits=function(t,e){const r=t.bit<<3|e;let o=r<<10;for(;Et.getBCHDigit(o)-Qt>=0;)o^=de<<Et.getBCHDigit(o)-Qt;return(r<<10|o)^Ve};var ue={};const He=_;function V(n){this.mode=He.NUMERIC,this.data=n.toString()}V.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};V.prototype.getLength=function(){return this.data.length};V.prototype.getBitsLength=function(){return V.getBitsLength(this.data.length)};V.prototype.write=function(t){let e,r,o;for(e=0;e+3<=this.data.length;e+=3)r=this.data.substr(e,3),o=parseInt(r,10),t.put(o,10);const i=this.data.length-e;i>0&&(r=this.data.substr(e),o=parseInt(r,10),t.put(o,i*3+1))};var Je=V;const je=_,gt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function H(n){this.mode=je.ALPHANUMERIC,this.data=n}H.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};H.prototype.getLength=function(){return this.data.length};H.prototype.getBitsLength=function(){return H.getBitsLength(this.data.length)};H.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let r=gt.indexOf(this.data[e])*45;r+=gt.indexOf(this.data[e+1]),t.put(r,11)}this.data.length%2&&t.put(gt.indexOf(this.data[e]),6)};var Ye=H;const qe=_;function J(n){this.mode=qe.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}J.getBitsLength=function(t){return t*8};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(n){for(let t=0,e=this.data.length;t<e;t++)n.put(this.data[t],8)};var Ke=J;const Ge=_,Ze=L;function j(n){this.mode=Ge.KANJI,this.data=n}j.getBitsLength=function(t){return t*13};j.prototype.getLength=function(){return this.data.length};j.prototype.getBitsLength=function(){return j.getBitsLength(this.data.length)};j.prototype.write=function(n){let t;for(t=0;t<this.data.length;t++){let e=Ze.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),n.put(e,13)}};var Qe=j,he={exports:{}};(function(n){var t={single_source_shortest_paths:function(e,r,o){var i={},s={};s[r]=0;var a=t.PriorityQueue.make();a.push(r,0);for(var l,d,c,f,u,h,m,y,w;!a.empty();){l=a.pop(),d=l.value,f=l.cost,u=e[d]||{};for(c in u)u.hasOwnProperty(c)&&(h=u[c],m=f+h,y=s[c],w=typeof s[c]=="undefined",(w||y>m)&&(s[c]=m,a.push(c,m),i[c]=d))}if(typeof o!="undefined"&&typeof s[o]=="undefined"){var p=["Could not find a path from ",r," to ",o,"."].join("");throw new Error(p)}return i},extract_shortest_path_from_predecessor_list:function(e,r){for(var o=[],i=r;i;)o.push(i),e[i],i=e[i];return o.reverse(),o},find_path:function(e,r,o){var i=t.single_source_shortest_paths(e,r,o);return t.extract_shortest_path_from_predecessor_list(i,o)},PriorityQueue:{make:function(e){var r=t.PriorityQueue,o={},i;e=e||{};for(i in r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=e.sorter||r.default_sorter,o},default_sorter:function(e,r){return e.cost-r.cost},push:function(e,r){var o={value:e,cost:r};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};n.exports=t})(he);(function(n){const t=_,e=Je,r=Ye,o=Ke,i=Qe,s=D,a=L,l=he.exports;function d(p){return unescape(encodeURIComponent(p)).length}function c(p,E,v){const g=[];let C;for(;(C=p.exec(v))!==null;)g.push({data:C[0],index:C.index,mode:E,length:C[0].length});return g}function f(p){const E=c(s.NUMERIC,t.NUMERIC,p),v=c(s.ALPHANUMERIC,t.ALPHANUMERIC,p);let g,C;return a.isKanjiModeEnabled()?(g=c(s.BYTE,t.BYTE,p),C=c(s.KANJI,t.KANJI,p)):(g=c(s.BYTE_KANJI,t.BYTE,p),C=[]),E.concat(v,g,C).sort(function($,B){return $.index-B.index}).map(function($){return{data:$.data,mode:$.mode,length:$.length}})}function u(p,E){switch(E){case t.NUMERIC:return e.getBitsLength(p);case t.ALPHANUMERIC:return r.getBitsLength(p);case t.KANJI:return i.getBitsLength(p);case t.BYTE:return o.getBitsLength(p)}}function h(p){return p.reduce(function(E,v){const g=E.length-1>=0?E[E.length-1]:null;return g&&g.mode===v.mode?(E[E.length-1].data+=v.data,E):(E.push(v),E)},[])}function m(p){const E=[];for(let v=0;v<p.length;v++){const g=p[v];switch(g.mode){case t.NUMERIC:E.push([g,{data:g.data,mode:t.ALPHANUMERIC,length:g.length},{data:g.data,mode:t.BYTE,length:g.length}]);break;case t.ALPHANUMERIC:E.push([g,{data:g.data,mode:t.BYTE,length:g.length}]);break;case t.KANJI:E.push([g,{data:g.data,mode:t.BYTE,length:d(g.data)}]);break;case t.BYTE:E.push([{data:g.data,mode:t.BYTE,length:d(g.data)}])}}return E}function y(p,E){const v={},g={start:{}};let C=["start"];for(let b=0;b<p.length;b++){const $=p[b],B=[];for(let M=0;M<$.length;M++){const F=$[M],N=""+b+M;B.push(N),v[N]={node:F,lastCount:0},g[N]={};for(let I=0;I<C.length;I++){const A=C[I];v[A]&&v[A].node.mode===F.mode?(g[A][N]=u(v[A].lastCount+F.length,F.mode)-u(v[A].lastCount,F.mode),v[A].lastCount+=F.length):(v[A]&&(v[A].lastCount=F.length),g[A][N]=u(F.length,F.mode)+4+t.getCharCountIndicator(F.mode,E))}}C=B}for(let b=0;b<C.length;b++)g[C[b]].end=0;return{map:g,table:v}}function w(p,E){let v;const g=t.getBestModeForData(p);if(v=t.from(E,g),v!==t.BYTE&&v.bit<g.bit)throw new Error('"'+p+'" cannot be encoded with mode '+t.toString(v)+`.
 Suggested mode is: `+t.toString(g));switch(v===t.KANJI&&!a.isKanjiModeEnabled()&&(v=t.BYTE),v){case t.NUMERIC:return new e(p);case t.ALPHANUMERIC:return new r(p);case t.KANJI:return new i(p);case t.BYTE:return new o(p)}}n.fromArray=function(E){return E.reduce(function(v,g){return typeof g=="string"?v.push(w(g,null)):g.data&&v.push(w(g.data,g.mode)),v},[])},n.fromString=function(E,v){const g=f(E,a.isKanjiModeEnabled()),C=m(g),b=y(C,v),$=l.find_path(b.map,"start","end"),B=[];for(let M=1;M<$.length-1;M++)B.push(b.table[$[M]].node);return n.fromArray(h(B))},n.rawSplit=function(E){return n.fromArray(f(E,a.isKanjiModeEnabled()))}})(ue);const dt=L,mt=at,Xe=xe,We=Re,tn=ne,en=oe,Ct=re,wt=lt,nn=De,st=ae,on=ce,rn=_,pt=ue;function sn(n,t){const e=n.size,r=en.getPositions(t);for(let o=0;o<r.length;o++){const i=r[o][0],s=r[o][1];for(let a=-1;a<=7;a++)if(!(i+a<=-1||e<=i+a))for(let l=-1;l<=7;l++)s+l<=-1||e<=s+l||(a>=0&&a<=6&&(l===0||l===6)||l>=0&&l<=6&&(a===0||a===6)||a>=2&&a<=4&&l>=2&&l<=4?n.set(i+a,s+l,!0,!0):n.set(i+a,s+l,!1,!0))}}function an(n){const t=n.size;for(let e=8;e<t-8;e++){const r=e%2===0;n.set(e,6,r,!0),n.set(6,e,r,!0)}}function ln(n,t){const e=tn.getPositions(t);for(let r=0;r<e.length;r++){const o=e[r][0],i=e[r][1];for(let s=-2;s<=2;s++)for(let a=-2;a<=2;a++)s===-2||s===2||a===-2||a===2||s===0&&a===0?n.set(o+s,i+a,!0,!0):n.set(o+s,i+a,!1,!0)}}function cn(n,t){const e=n.size,r=st.getEncodedBits(t);let o,i,s;for(let a=0;a<18;a++)o=Math.floor(a/3),i=a%3+e-8-3,s=(r>>a&1)===1,n.set(o,i,s,!0),n.set(i,o,s,!0)}function yt(n,t,e){const r=n.size,o=on.getEncodedBits(t,e);let i,s;for(i=0;i<15;i++)s=(o>>i&1)===1,i<6?n.set(i,8,s,!0):i<8?n.set(i+1,8,s,!0):n.set(r-15+i,8,s,!0),i<8?n.set(8,r-i-1,s,!0):i<9?n.set(8,15-i-1+1,s,!0):n.set(8,15-i-1,s,!0);n.set(r-8,8,1,!0)}function dn(n,t){const e=n.size;let r=-1,o=e-1,i=7,s=0;for(let a=e-1;a>0;a-=2)for(a===6&&a--;;){for(let l=0;l<2;l++)if(!n.isReserved(o,a-l)){let d=!1;s<t.length&&(d=(t[s]>>>i&1)===1),n.set(o,a-l,d),i--,i===-1&&(s++,i=7)}if(o+=r,o<0||e<=o){o-=r,r=-r;break}}}function un(n,t,e){const r=new Xe;e.forEach(function(l){r.put(l.mode.bit,4),r.put(l.getLength(),rn.getCharCountIndicator(l.mode,n)),l.write(r)});const o=dt.getSymbolTotalCodewords(n),i=wt.getTotalCodewordsCount(n,t),s=(o-i)*8;for(r.getLengthInBits()+4<=s&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const a=(s-r.getLengthInBits())/8;for(let l=0;l<a;l++)r.put(l%2?17:236,8);return hn(r,n,t)}function hn(n,t,e){const r=dt.getSymbolTotalCodewords(t),o=wt.getTotalCodewordsCount(t,e),i=r-o,s=wt.getBlocksCount(t,e),a=r%s,l=s-a,d=Math.floor(r/s),c=Math.floor(i/s),f=c+1,u=d-c,h=new nn(u);let m=0;const y=new Array(s),w=new Array(s);let p=0;const E=new Uint8Array(n.buffer);for(let $=0;$<s;$++){const B=$<l?c:f;y[$]=E.slice(m,m+B),w[$]=h.encode(y[$]),m+=B,p=Math.max(p,B)}const v=new Uint8Array(r);let g=0,C,b;for(C=0;C<p;C++)for(b=0;b<s;b++)C<y[b].length&&(v[g++]=y[b][C]);for(C=0;C<u;C++)for(b=0;b<s;b++)v[g++]=w[b][C];return v}function fn(n,t,e,r){let o;if(Array.isArray(n))o=pt.fromArray(n);else if(typeof n=="string"){let d=t;if(!d){const c=pt.rawSplit(n);d=st.getBestVersionForData(c,e)}o=pt.fromString(n,d||40)}else throw new Error("Invalid data");const i=st.getBestVersionForData(o,e);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);const s=un(t,e,o),a=dt.getSymbolSize(t),l=new We(a);return sn(l,t),an(l),ln(l,t),yt(l,e,0),t>=7&&cn(l,t),dn(l,s),isNaN(r)&&(r=Ct.getBestMask(l,yt.bind(null,l,e))),Ct.applyMask(r,l),yt(l,e,r),{modules:l,version:t,errorCorrectionLevel:e,maskPattern:r,segments:o}}te.create=function(t,e){if(typeof t=="undefined"||t==="")throw new Error("No input text");let r=mt.M,o,i;return typeof e!="undefined"&&(r=mt.from(e.errorCorrectionLevel,mt.M),o=st.from(e.version),i=Ct.from(e.maskPattern),e.toSJISFunc&&dt.setToSJISFunction(e.toSJISFunc)),fn(t,o,r,i)};var fe={},Nt={};(function(n){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let r=e.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+e);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(i){return[i,i]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}n.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin=="undefined"||r.margin===null||r.margin<0?4:r.margin,i=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:i,scale:i?4:s,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},n.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},n.getImageWidth=function(r,o){const i=n.getScale(r,o);return Math.floor((r+o.margin*2)*i)},n.qrToImageData=function(r,o,i){const s=o.modules.size,a=o.modules.data,l=n.getScale(s,i),d=Math.floor((s+i.margin*2)*l),c=i.margin*l,f=[i.color.light,i.color.dark];for(let u=0;u<d;u++)for(let h=0;h<d;h++){let m=(u*d+h)*4,y=i.color.light;if(u>=c&&h>=c&&u<d-c&&h<d-c){const w=Math.floor((u-c)/l),p=Math.floor((h-c)/l);y=f[a[w*s+p]?1:0]}r[m++]=y.r,r[m++]=y.g,r[m++]=y.b,r[m]=y.a}}})(Nt);(function(n){const t=Nt;function e(o,i,s){o.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=s,i.width=s,i.style.height=s+"px",i.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}n.render=function(i,s,a){let l=a,d=s;typeof l=="undefined"&&(!s||!s.getContext)&&(l=s,s=void 0),s||(d=r()),l=t.getOptions(l);const c=t.getImageWidth(i.modules.size,l),f=d.getContext("2d"),u=f.createImageData(c,c);return t.qrToImageData(u.data,i,l),e(f,d,c),f.putImageData(u,0,0),d},n.renderToDataURL=function(i,s,a){let l=a;typeof l=="undefined"&&(!s||!s.getContext)&&(l=s,s=void 0),l||(l={});const d=n.render(i,s,l),c=l.type||"image/png",f=l.rendererOpts||{};return d.toDataURL(c,f.quality)}})(fe);var ge={};const gn=Nt;function Xt(n,t){const e=n.a/255,r=t+'="'+n.hex+'"';return e<1?r+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':r}function vt(n,t,e){let r=n+t;return typeof e!="undefined"&&(r+=" "+e),r}function mn(n,t,e){let r="",o=0,i=!1,s=0;for(let a=0;a<n.length;a++){const l=Math.floor(a%t),d=Math.floor(a/t);!l&&!i&&(i=!0),n[a]?(s++,a>0&&l>0&&n[a-1]||(r+=i?vt("M",l+e,.5+d+e):vt("m",o,0),o=0,i=!1),l+1<t&&n[a+1]||(r+=vt("h",s),s=0)):o++}return r}ge.render=function(t,e,r){const o=gn.getOptions(e),i=t.modules.size,s=t.modules.data,a=i+o.margin*2,l=o.color.light.a?"<path "+Xt(o.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",d="<path "+Xt(o.color.dark,"stroke")+' d="'+mn(s,i,o.margin)+'"/>',c='viewBox="0 0 '+a+" "+a+'"',f=o.width?'width="'+o.width+'" height="'+o.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+f+c+' shape-rendering="crispEdges">'+l+d+`</svg>
`;return typeof r=="function"&&r(null,u),u};const pn=Se,bt=te,me=fe,yn=ge;function Bt(n,t,e,r,o){const i=[].slice.call(arguments,1),s=i.length,a=typeof i[s-1]=="function";if(!a&&!pn())throw new Error("Callback required as last argument");if(a){if(s<2)throw new Error("Too few arguments provided");s===2?(o=e,e=t,t=r=void 0):s===3&&(t.getContext&&typeof o=="undefined"?(o=r,r=void 0):(o=r,r=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=r=void 0):s===2&&!t.getContext&&(r=e,e=t,t=void 0),new Promise(function(l,d){try{const c=bt.create(e,r);l(n(c,t,r))}catch(c){d(c)}})}try{const l=bt.create(e,r);o(null,n(l,t,r))}catch(l){o(l)}}S.create=bt.create;S.toCanvas=Bt.bind(null,me.render);S.toDataURL=Bt.bind(null,me.renderToDataURL);S.toString=Bt.bind(null,function(n,t,e){return yn.render(n,e)});class vn{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,r=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){r=!1;break}return r?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let r=this.tens[t.charAt(0)-3];return e>0&&(r+=" y "+this.getUnits(e)),r}getHundreds(t){let e="",r=t.charAt(0),o=t.substr(1);if(t==100)return"cien";switch(r){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(r)+"cientos"),o>0&&(e+=" "+this.getName(o)),e}getThousands(t){let e="mil",r=t.length-3,o=t.substr(0,r),i=t.substr(r);return o>1&&(e=this.getName(o).replace("uno","un")+" mil"),i>0&&(e+=" "+this.getName(i)),e}getPeriod(t,e,r){let o="un "+r,i=t.length-e,s=t.substr(0,i),a=t.substr(i);return s>1&&(o=this.getName(s).replace("uno","un")+" "+r.replace("\xF3","o")+"es"),a>0&&(o+=" "+this.getName(a)),o}}var U={conversorNumerosALetras:vn},pe={};Object.defineProperty(pe,"__esModule",{value:!0});function rt(n){switch(n){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function k(n,t){return t>0?n+" y "+rt(t):n}function P(n){var t=Math.floor(n/10),e=n-t*10;switch(t){case 1:switch(e){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+rt(e).toLowerCase()}case 2:switch(e){case 0:return"Veinte";default:return"Veinti"+rt(e).toLowerCase()}case 3:return k("Treinta",e);case 4:return k("Cuarenta",e);case 5:return k("Cincuenta",e);case 6:return k("Sesenta",e);case 7:return k("Setenta",e);case 8:return k("Ochenta",e);case 9:return k("Noventa",e);case 0:return rt(e);default:return""}}function ye(n){var t=Math.floor(n/100),e=n-t*100;switch(t){case 1:return e>0?"Ciento "+P(e):"Cien";case 2:return"Doscientos "+P(e);case 3:return"Trescientos "+P(e);case 4:return"Cuatrocientos "+P(e);case 5:return"Quinientos "+P(e);case 6:return"Seiscientos "+P(e);case 7:return"Setecientos "+P(e);case 8:return"Ochocientos "+P(e);case 9:return"Novecientos "+P(e);default:return P(e)}}function ve(n,t,e,r){var o=Math.floor(n/t),i=n-o*t,s="";return o>0&&(o>1?s=ye(o)+" "+r:s=e),i>0&&(s+=""),s}function En(n){var t=1e3,e=Math.floor(n/t),r=n-e*t,o=ve(n,t,"Un Mil","Mil"),i=ye(r);return o===""?i:(o+" "+i).trim()}function Wt(n){var t=1e6,e=Math.floor(n/t),r=n-e*t,o=ve(n,t,"Un Mill\xF3n de","Millones de"),i=En(r);return o===""?i:(o+" "+i).trim()}function Cn(n){var t={numero:n,enteros:Math.floor(n),centavos:Math.round(n*100)-Math.floor(n)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(Wt(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(Wt(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}pe.NumerosALetras=Cn;class $n{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],r=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],o={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},i=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function s(f){if(f<10)return e[f];if(f>=10&&f<20)return o[f];if(f<100){const h=f%10;return`${r[Math.floor(f/10)]}${h>0?" y "+e[h]:""}`}if(f===100)return"cien";const u=f%100;return`${i[Math.floor(f/100)]}${u>0?" "+s(u):""}`}if(t===1e6)return"un mill\xF3n";let a=Math.floor(t/1e3),l=t%1e3,d=a>0?a===1?"mil":`${s(a)} mil`:"",c=l>0?s(l):"";return(d+" "+c).trim()}static imprimirCaja(t){}static async factura(t){return new Promise(async(e,r)=>{var o,i,s,a,l,d,c,f,u,h,m,y,w,p,E,v,g,C,b,$,B;try{const M=U.conversorNumerosALetras,F=new M,N=x().env,I=T=>Number(T||0).toFixed(2),A=T=>(T!=null?T:"").toString(),O=Number((i=(o=t.total)!=null?o:t.montoTotal)!=null?i:0),Y=(l=(a=(s=t.numeroFactura)!=null?s:t.numero_factura)!=null?a:t.id)!=null?l:"\u2014",X=(d=t.fechaEmision)!=null?d:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",W=(u=(f=t.nombre)!=null?f:(c=t==null?void 0:t.cliente)==null?void 0:c.nombre)!=null?u:"SN",q=(y=(m=t.complemento)!=null?m:(h=t==null?void 0:t.cliente)==null?void 0:h.complemento)!=null?y:"",tt=(E=(p=t.ci)!=null?p:(w=t==null?void 0:t.cliente)==null?void 0:w.ci)!=null?E:"0",Ee=(C=(g=t.cliente_id)!=null?g:(v=t==null?void 0:t.cliente)==null?void 0:v.id)!=null?C:"\u2014",Ce=(b=N==null?void 0:N.puntoVenta)!=null?b:0,ut=($=t.cuf)!=null?$:null,K=ut?ut.match(/.{1,20}/g).join("<br>"):null,we=ut?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",be=(B=t.leyenda)!=null?B:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",Te=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],Mt=Math.floor(O),Ae=Math.round((O-Mt)*100).toString().padStart(2,"0"),$e=`Son ${F.convertToText(Mt)} ${Ae}/100 Bolivianos`;let et=null;K&&(et=await S.toDataURL(`${N.url2}consulta/QR?nit=${N.nit}&cuf=${K}&numero=${Y}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let ht=`${this.head()}
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
  <div class="title fs12 center">${we}</div>

  <div class="center small">
    ${A(N.razon)}<br>
    Casa Matriz<br>
    No. Punto de Venta ${Ce}<br>
    ${A(N.direccion)}<br>
    Tel. ${A(N.telefono)}<br>
    Oruro
  </div>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NIT</td><td class="val">${A(N.nit)}</td></tr>
    <tr><td class="lbl">FACTURA N\xB0</td><td class="val">${Y}</td></tr>
    <tr><td class="lbl">C\xD3D. AUTORIZACI\xD3N</td><td class="val">${K!=null?K:"\u2014"}</td></tr>
  </table>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NOMBRE/RAZ\xD3N SOCIAL</td><td class="val">${A(W)}</td></tr>
    <tr><td class="lbl">NIT/CI/CEX</td><td class="val">${A(tt)}${A(q?"-"+q:"")}</td></tr>
    <tr><td class="lbl">NRO. CLIENTE</td><td class="val">${A(Ee)}</td></tr>
    <tr><td class="lbl">FECHA DE EMISI\xD3N</td><td class="val">${A(X)}</td></tr>
  </table>

  <hr>
  <div class="det-header center">DETALLE</div>`;Te.forEach(T=>{var Lt,xt,Rt,Pt,Dt,Ot,Ut,zt,_t,kt,Vt,Ht,Jt,jt,Yt,qt,Kt,Gt;const Ne=(Pt=(Rt=(Lt=T.producto_id)!=null?Lt:T.product_id)!=null?Rt:(xt=T==null?void 0:T.producto)==null?void 0:xt.id)!=null?Pt:"\u2014",Be=A((zt=(Ut=(Dt=T.nombre)!=null?Dt:T.descripcion)!=null?Ut:(Ot=T==null?void 0:T.producto)==null?void 0:Ot.nombre)!=null?zt:""),Me=A((Vt=(kt=T.unidad)!=null?kt:(_t=T==null?void 0:T.producto)==null?void 0:_t.unidad)!=null?Vt:""),Ft=Number((Jt=(Ht=T.cantidad)!=null?Ht:T.qty)!=null?Jt:0),It=Number((Yt=(jt=T.precio)!=null?jt:T.precioUnitario)!=null?Yt:0),St=Number((Kt=(qt=T.descuento)!=null?qt:T.montoDescuento)!=null?Kt:0),Fe=(Gt=T.subTotal)!=null?Gt:Ft*It-St;ht+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${Ne} - ${Be}</td>
          <td class="right item-desc">${I(Fe)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Me||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${I(Ft)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${I(It)} - ${I(St)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),ht+=`
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

  <div class="fs10" style="margin-top:6px;">${$e}</div>

  <hr>
  <div class="center small">
    ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY
  </div>
  <div class="center small" style="margin-top:4px;">${A(be)}</div>
  <div class="center small" style="margin-top:4px;">\u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n en l\xEDnea\u201D</div>
  ${et?`<div class="qr"><img src="${et}" alt="QR"></div>`:""}
</div>`;const ft=document.getElementById("myElement");ft&&(ft.innerHTML=ht),new R().print(ft),e(et)}catch(M){r(M)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((r,o)=>{const i=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};x().env,S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(a=>{let l="",d="";t.producto&&(l="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(d="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let c=`${this.head()}
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
${l}
${d}
</table><hr><div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(f=>{var u;console.log("r",f),c+=`<div style='font-size: 12px'><b> ${(u=f.producto)==null?void 0:u.nombre} </b></div>`,f.visible===1?c+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${f.cantidad}
                    </span>
                    <span>
                    ${parseFloat(f.precio).toFixed(2)}
                    </span>

                    <span style='float:right'>
                        ${parseFloat(f.precio*f.cantidad).toFixed(2)}
                    </span>
                    </div>`:c+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${f.cantidad}
                    </span>
                    <span>

                    </span>

                    <span style='float:right'>

                    </span>`}),c+=`<hr>
<div>${t.comentario===""||t.comentario===null||t.comentario===void 0?"":"Comentario: "+t.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='titder'>${parseFloat(t.total).toFixed(2)}</td></tr>
<!--      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='titder'>${parseFloat(t.descuento).toFixed(2)}</td></tr>-->
<!--      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='titder'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>-->
      </table>
      <br>
      <div>Son ${i} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
        <!--div style='display: flex;justify-content: center;'>
          <img  src="${a}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=c,e&&new R().print(document.getElementById("myElement")),r(a)}).catch(a=>{o(a)})})}static cotizacion(t,e,r,o,i=!0){return(o==null||o==="")&&(o=0),new Promise((s,a)=>{const l=U.conversorNumerosALetras,c=new l().convertToText(parseInt(r)),f=Ie().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=x().env;S.toDataURL(`Fecha: ${f} Monto: ${parseFloat(r).toFixed(2)}`,u).then(m=>{let y=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>COTIZACION</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${h.direccion}<br>
Tel. ${h.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${e.nombre}</td>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${f}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(w=>{y+=`<div style='font-size: 12px'><b> ${w.nombre} </b></div>`,y+=`<div><span style='font-size: 18px;font-weight: bold'>${w.cantidadVenta}</span> ${parseFloat(w.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(w.precioVenta*w.cantidadVenta).toFixed(2)}</span></div>`}),y+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(o).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(r-o).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${c} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${m}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=y,i&&new R().print(document.getElementById("myElement")),s(m)}).catch(m=>{a(m)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,r)=>{const o=U.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),a={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},l=x().env;S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,a).then(async d=>{let c=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE COMPRA"}</div>
      <div class='titulo2'>${l.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${l.direccion}<br>
Tel. ${l.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.client?t.client.nombre:""}</td>
</tr><tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td></tr>
<!--<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha_emision}</td></tr>-->
</table><hr><div class='titulo'>DETALLE</div>`;t.buy_details.forEach(u=>{c+=`<div style='font-size: 12px'><b>${u.nombre} </b></div>`,c+=`<div><span style='font-size: 14px;font-weight: bold'>${u.cantidad}</span> ${parseFloat(u.precio).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(u.subtotal).toFixed(2)}</span></div>`}),c+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(t.descuento).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=c,new R().print(document.getElementById("myElement")),e(d)}).catch(d=>{r(d)})})}static reportTotal(t,e){const r=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,a)=>s+a.montoTotal,0),o=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,a)=>s+a.montoTotal,0),i=r-o;return console.log("montoTotal",i),new Promise((s,a)=>{const l=U.conversorNumerosALetras,d=new l,c=Math.abs(i),f=d.convertToText(parseInt(c)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=x().env;S.toDataURL(` Monto: ${parseFloat(i).toFixed(2)}`,u).then(m=>{let y=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>title</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${h.direccion}<br>
Tel. ${h.telefono}<br>
Oruro</div>
<hr>
<table>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(p=>{y+=`<div style='font-size: 12px'><b> ${p.user.name} </b></div>`,y+=`<div> ${parseFloat(p.montoTotal).toFixed(2)} ${p.tipoVenta}
          <span style='float:right'> ${p.tipoVenta==="Egreso"?"-":""} ${parseFloat(p.montoTotal).toFixed(2)}</span></div>`}),y+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(i).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${f} ${((parseFloat(i)-Math.floor(parseFloat(i)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${m}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=y,new R().print(document.getElementById("myElement")),s(m)}).catch(m=>{a(m)})})}static reciboCompra(t){return console.log("reciboCompra",t),new Promise((e,r)=>{var c;const o=U.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),a=((c=t.comentario)!=null?c:"").toString().trim(),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},d=x().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(f=>{let u=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE COMPRA</div>
      <div class='titulo2'>${d.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${d.direccion}<br>
    Tel. ${d.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(m=>{u+=`<div style='font-size: 12px'><b>${m.nombre} </b></div>`,u+=`<div>${m.cantidad} ${parseFloat(m.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(m.total).toFixed(2)}</span></div>`}),u+=`<hr>
      <div>${a?"Comentario: "+a:""}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${f}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=u,new R().print(document.getElementById("myElement")),e(f)}).catch(f=>{r(f)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,r)=>{const o=U.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),a={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},l=x().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,a).then(d=>{let c=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE PEDIDO</div>
      <div class='titulo2'>${l.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${l.direccion}<br>
    Tel. ${l.telefono}<br>
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
    <div class='titulo'>DETALLE</div>`;t.detalles.forEach(u=>{var h;c+=`<div style='font-size: 12px'><b>${(h=u.producto)==null?void 0:h.nombre} </b></div>`,c+=`<div>${u.cantidad} ${parseFloat(u.cantidad).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(u.cantidad).toFixed(2)}</span></div>`}),c+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=c,new R().print(document.getElementById("myElement")),e(d)}).catch(d=>{r(d)})})}static reciboTranferencia(t,e,r,o){return console.log("producto",t,"de",e,"ha",r,"cantidad",o),new Promise((i,s)=>{const a=U.conversorNumerosALetras,d=new a().convertToText(parseInt(o)),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=x().env;S.toDataURL(`de: ${e} A: ${r}`,c).then(u=>{let h=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE TRANSFERENCIA</div>
      <div class='titulo2'>${f.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${f.direccion}<br>
    Tel. ${f.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;h+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${e} a ${r} </b></div>`,h+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>CANTIDAD </td><td class='conte2'>${o+""}</td></tr>
      </table>
      <br>
      <div>Son ${d+""} ${o+""} unidades</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${u}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=h,new R().print(document.getElementById("myElement")),i(u)}).catch(u=>{s(u)})})}static head(){return`<html>
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
<div style="width: 300px;">`}static async printFactura(t){var f,u;const e=U.conversorNumerosALetras,o=new e().convertToText(parseInt(t.total)),i=x().env,s=await S.toDataURL(`${i.url2}consulta/QR?nit=${i.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),a=t.online?"en":"fuera de";let l=`<style>
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
      <tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.ci}${(f=t.cliente)!=null&&f.complemento?"-"+((u=t.cliente)==null?void 0:u.complemento):""}</td></tr>
      <tr><td class='titder'>COD. CLIENTE:</td><td class='contenido'>${t.cliente.id}</td></tr>
      <tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
    </table>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(h=>{l+=`<div style='font-size: 12px'><b>${h.id} - ${h.nombre}</b></div>
             <div>${h.cantidad} ${parseFloat(h.precio).toFixed(2)} 0.00
             <span style='float:right'>${parseFloat(h.cantidad*h.precio).toFixed(2)}</span></div>`}),l+=`<hr>
    <table style='font-size: 8px;'>
      <tr><td class='titder'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>DESCUENTO Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>MONTO GIFT CARD Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>MONTO A PAGAR Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>IMPORTE BASE CR\xC9DITO FISCAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
    </table><br>
    <div>Son ${o} ${((parseFloat(t.total)-Math.floor(t.total))*100).toFixed(0)}/100 Bolivianos</div>
    <hr>
    <div class='titulo2' style='font-size: 9px'>ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY<br><br>
    ${t.leyenda}<br><br>
    \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n ${a} l\xEDnea\u201D</div>
    <div style='display: flex; justify-content: center;'>
      <img src="${s}" />
    </div>
  </div>`;const d=document.getElementById("myElement");d&&(d.innerHTML=l),new R().print(d)}static async reciboVentaSimple(t,e=!0){var r,o,i;try{const s=x().env||{},a=U.conversorNumerosALetras,l=new a,d=g=>Number(g||0).toFixed(2),c=(g,C="\u2014")=>(g!=null?g:C).toString(),f=Number((r=t.total)!=null?r:0),u=Math.floor(f),h=Math.round((f-u)*100).toString().padStart(2,"0"),m=`Son ${l.convertToText(u)} ${h}/100 Bolivianos`,y=((o=t.comentario)!=null?o:"").toString().trim(),w=Array.isArray(t.venta_detalles)?t.venta_detalles:[],p=`
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
    `;let E=`
      <div class="imprimir-scope">
        <div class="ticket">
          <div class="center bold" style="font-size:12px;">RECIBO DE VENTA</div>
          <div class="center small">
            ${c(s.razon,"\u2014")}<br>
            ${c(s.direccion,"")}<br>
            Tel. ${c(s.telefono,"")} \xB7 Oruro
          </div>

          <hr>

          <table>
            <tr><td class="bold">Nro:</td><td>${c(t.id)}</td></tr>
            <tr><td class="bold">Fecha/Hora:</td><td>${c(t.fecha)} ${c(t.hora,"")}</td></tr>
            <tr><td class="bold">Usuario:</td><td>${c((i=t.user)==null?void 0:i.name,"")}</td></tr>
            <tr><td class="bold">Tipo venta:</td><td>${c(t.tipo_venta,"")}</td></tr>
            <tr><td class="bold">Pago:</td><td>${c(t.tipo_pago,"")}</td></tr>
          </table>

          <hr>

          <table>
            <tr class="bold"><td>Detalle</td><td class="right">Subt.</td></tr>
            ${w.map(g=>{var N,I,A,O,Y,X,W,q,tt;const C=c((A=(I=(N=g.producto)==null?void 0:N.nombre)!=null?I:g.nombre)!=null?A:""),b=Number(g.cantidad||0),$=Number(g.precio||0),B=b*$,M=c((X=(Y=g.unidad)!=null?Y:(O=g.producto)==null?void 0:O.unidad)!=null?X:""),F=c((tt=(q=g.producto_id)!=null?q:(W=g.producto)==null?void 0:W.id)!=null?tt:"");return`
                <tr>
                  <td>
                    <div class="bold">${F?F+" - ":""}${C}</div>
                    <div class="small">${M?"UM: "+M+" \xB7 ":""}${d(b)} x ${d($)}</div>
                  </td>
                  <td class="right bold">${d(B)}</td>
                </tr>
              `}).join("")}
          </table>

          <hr>

          <table>
            <tr><td class="bold">TOTAL (Bs)</td><td class="right bold">${d(f)}</td></tr>
          </table>

          ${y?`<div class="mt6"><span class="bold">Comentario:</span> ${y}</div>`:""}

          <div class="mt6">${m}</div>

          <hr>

          <div class="center small">
            \xA1Gracias por su compra!
          </div>
        </div>
      </div>
    `;const v=document.getElementById("myElement");if(v){v.innerHTML=E;const g=v.querySelector(".imprimir-scope");e&&new R().print(g,p)}return!0}catch(s){throw console.error("reciboVentaSimple error:",s),s}}}export{$n as I};
