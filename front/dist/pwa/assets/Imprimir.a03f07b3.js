import{u as L}from"./index.9de443d6.js";import{P as R}from"./index.aa4d44c1.js";import{h as Ie}from"./moment.40bc58bf.js";var M={},Me=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},ne={},S={};let At;const Se=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];S.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};S.getSymbolTotalCodewords=function(t){return Se[t]};S.getBCHDigit=function(o){let t=0;for(;o!==0;)t++,o>>>=1;return t};S.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');At=t};S.isKanjiModeEnabled=function(){return typeof At!="undefined"};S.toSJIS=function(t){return At(t)};var dt={};(function(o){o.L={bit:1},o.M={bit:0},o.Q={bit:3},o.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return o.L;case"m":case"medium":return o.M;case"q":case"quartile":return o.Q;case"h":case"high":return o.H;default:throw new Error("Unknown EC Level: "+e)}}o.isValid=function(i){return i&&typeof i.bit!="undefined"&&i.bit>=0&&i.bit<4},o.from=function(i,n){if(o.isValid(i))return i;try{return t(i)}catch{return n}}})(dt);function oe(){this.buffer=[],this.length=0}oe.prototype={get:function(o){const t=Math.floor(o/8);return(this.buffer[t]>>>7-o%8&1)===1},put:function(o,t){for(let e=0;e<t;e++)this.putBit((o>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(o){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),o&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var Le=oe;function X(o){if(!o||o<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=o,this.data=new Uint8Array(o*o),this.reservedBit=new Uint8Array(o*o)}X.prototype.set=function(o,t,e,i){const n=o*this.size+t;this.data[n]=e,i&&(this.reservedBit[n]=!0)};X.prototype.get=function(o,t){return this.data[o*this.size+t]};X.prototype.xor=function(o,t,e){this.data[o*this.size+t]^=e};X.prototype.isReserved=function(o,t){return this.reservedBit[o*this.size+t]};var Re=X,ie={};(function(o){const t=S.getSymbolSize;o.getRowColCoords=function(i){if(i===1)return[];const n=Math.floor(i/7)+2,r=t(i),s=r===145?26:Math.ceil((r-13)/(2*n-2))*2,a=[r-7];for(let l=1;l<n-1;l++)a[l]=a[l-1]-s;return a.push(6),a.reverse()},o.getPositions=function(i){const n=[],r=o.getRowColCoords(i),s=r.length;for(let a=0;a<s;a++)for(let l=0;l<s;l++)a===0&&l===0||a===0&&l===s-1||a===s-1&&l===0||n.push([r[a],r[l]]);return n}})(ie);var re={};const ke=S.getSymbolSize,Wt=7;re.getPositions=function(t){const e=ke(t);return[[0,0],[e-Wt,0],[0,e-Wt]]};var se={};(function(o){o.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};o.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},o.from=function(n){return o.isValid(n)?parseInt(n,10):void 0},o.getPenaltyN1=function(n){const r=n.size;let s=0,a=0,l=0,c=null,d=null;for(let g=0;g<r;g++){a=l=0,c=d=null;for(let u=0;u<r;u++){let f=n.get(g,u);f===c?a++:(a>=5&&(s+=t.N1+(a-5)),c=f,a=1),f=n.get(u,g),f===d?l++:(l>=5&&(s+=t.N1+(l-5)),d=f,l=1)}a>=5&&(s+=t.N1+(a-5)),l>=5&&(s+=t.N1+(l-5))}return s},o.getPenaltyN2=function(n){const r=n.size;let s=0;for(let a=0;a<r-1;a++)for(let l=0;l<r-1;l++){const c=n.get(a,l)+n.get(a,l+1)+n.get(a+1,l)+n.get(a+1,l+1);(c===4||c===0)&&s++}return s*t.N2},o.getPenaltyN3=function(n){const r=n.size;let s=0,a=0,l=0;for(let c=0;c<r;c++){a=l=0;for(let d=0;d<r;d++)a=a<<1&2047|n.get(c,d),d>=10&&(a===1488||a===93)&&s++,l=l<<1&2047|n.get(d,c),d>=10&&(l===1488||l===93)&&s++}return s*t.N3},o.getPenaltyN4=function(n){let r=0;const s=n.data.length;for(let l=0;l<s;l++)r+=n.data[l];return Math.abs(Math.ceil(r*100/s/5)-10)*t.N4};function e(i,n,r){switch(i){case o.Patterns.PATTERN000:return(n+r)%2===0;case o.Patterns.PATTERN001:return n%2===0;case o.Patterns.PATTERN010:return r%3===0;case o.Patterns.PATTERN011:return(n+r)%3===0;case o.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2===0;case o.Patterns.PATTERN101:return n*r%2+n*r%3===0;case o.Patterns.PATTERN110:return(n*r%2+n*r%3)%2===0;case o.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2===0;default:throw new Error("bad maskPattern:"+i)}}o.applyMask=function(n,r){const s=r.size;for(let a=0;a<s;a++)for(let l=0;l<s;l++)r.isReserved(l,a)||r.xor(l,a,e(n,l,a))},o.getBestMask=function(n,r){const s=Object.keys(o.Patterns).length;let a=0,l=1/0;for(let c=0;c<s;c++){r(c),o.applyMask(c,n);const d=o.getPenaltyN1(n)+o.getPenaltyN2(n)+o.getPenaltyN3(n)+o.getPenaltyN4(n);o.applyMask(c,n),d<l&&(l=d,a=c)}return a}})(se);var ct={};const z=dt,it=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],rt=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];ct.getBlocksCount=function(t,e){switch(e){case z.L:return it[(t-1)*4+0];case z.M:return it[(t-1)*4+1];case z.Q:return it[(t-1)*4+2];case z.H:return it[(t-1)*4+3];default:return}};ct.getTotalCodewordsCount=function(t,e){switch(e){case z.L:return rt[(t-1)*4+0];case z.M:return rt[(t-1)*4+1];case z.Q:return rt[(t-1)*4+2];case z.H:return rt[(t-1)*4+3];default:return}};var ae={},ut={};const Q=new Uint8Array(512),at=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)Q[e]=t,at[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)Q[e]=Q[e-255]})();ut.log=function(t){if(t<1)throw new Error("log("+t+")");return at[t]};ut.exp=function(t){return Q[t]};ut.mul=function(t,e){return t===0||e===0?0:Q[at[t]+at[e]]};(function(o){const t=ut;o.mul=function(i,n){const r=new Uint8Array(i.length+n.length-1);for(let s=0;s<i.length;s++)for(let a=0;a<n.length;a++)r[s+a]^=t.mul(i[s],n[a]);return r},o.mod=function(i,n){let r=new Uint8Array(i);for(;r.length-n.length>=0;){const s=r[0];for(let l=0;l<n.length;l++)r[l]^=t.mul(n[l],s);let a=0;for(;a<r.length&&r[a]===0;)a++;r=r.slice(a)}return r},o.generateECPolynomial=function(i){let n=new Uint8Array([1]);for(let r=0;r<i;r++)n=o.mul(n,new Uint8Array([1,t.exp(r)]));return n}})(ae);const le=ae;function xt(o){this.genPoly=void 0,this.degree=o,this.degree&&this.initialize(this.degree)}xt.prototype.initialize=function(t){this.degree=t,this.genPoly=le.generateECPolynomial(this.degree)};xt.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const e=new Uint8Array(t.length+this.degree);e.set(t);const i=le.mod(e,this.genPoly),n=this.degree-i.length;if(n>0){const r=new Uint8Array(this.degree);return r.set(i,n),r}return i};var Pe=xt,de={},U={},Nt={};Nt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var P={};const ce="[0-9]+",De="[A-Z $%*+\\-./:]+";let Z="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Z=Z.replace(/u/g,"\\u");const Oe="(?:(?![A-Z0-9 $%*+\\-./:]|"+Z+`)(?:.|[\r
]))+`;P.KANJI=new RegExp(Z,"g");P.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");P.BYTE=new RegExp(Oe,"g");P.NUMERIC=new RegExp(ce,"g");P.ALPHANUMERIC=new RegExp(De,"g");const ze=new RegExp("^"+Z+"$"),Ue=new RegExp("^"+ce+"$"),_e=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");P.testKanji=function(t){return ze.test(t)};P.testNumeric=function(t){return Ue.test(t)};P.testAlphanumeric=function(t){return _e.test(t)};(function(o){const t=Nt,e=P;o.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},o.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},o.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},o.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},o.MIXED={bit:-1},o.getCharCountIndicator=function(r,s){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?r.ccBits[0]:s<27?r.ccBits[1]:r.ccBits[2]},o.getBestModeForData=function(r){return e.testNumeric(r)?o.NUMERIC:e.testAlphanumeric(r)?o.ALPHANUMERIC:e.testKanji(r)?o.KANJI:o.BYTE},o.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},o.isValid=function(r){return r&&r.bit&&r.ccBits};function i(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return o.NUMERIC;case"alphanumeric":return o.ALPHANUMERIC;case"kanji":return o.KANJI;case"byte":return o.BYTE;default:throw new Error("Unknown mode: "+n)}}o.from=function(r,s){if(o.isValid(r))return r;try{return i(r)}catch{return s}}})(U);(function(o){const t=S,e=ct,i=dt,n=U,r=Nt,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,a=t.getBCHDigit(s);function l(u,f,p){for(let m=1;m<=40;m++)if(f<=o.getCapacity(m,p,u))return m}function c(u,f){return n.getCharCountIndicator(u,f)+4}function d(u,f){let p=0;return u.forEach(function(m){p+=c(m.mode,f)+m.getBitsLength()}),p}function g(u,f){for(let p=1;p<=40;p++)if(d(u,p)<=o.getCapacity(p,f,n.MIXED))return p}o.from=function(f,p){return r.isValid(f)?parseInt(f,10):p},o.getCapacity=function(f,p,m){if(!r.isValid(f))throw new Error("Invalid QR Code version");typeof m=="undefined"&&(m=n.BYTE);const C=t.getSymbolTotalCodewords(f),h=e.getTotalCodewordsCount(f,p),y=(C-h)*8;if(m===n.MIXED)return y;const b=y-c(m,f);switch(m){case n.NUMERIC:return Math.floor(b/10*3);case n.ALPHANUMERIC:return Math.floor(b/11*2);case n.KANJI:return Math.floor(b/13);case n.BYTE:default:return Math.floor(b/8)}},o.getBestVersionForData=function(f,p){let m;const C=i.from(p,i.M);if(Array.isArray(f)){if(f.length>1)return g(f,C);if(f.length===0)return 1;m=f[0]}else m=f;return l(m.mode,m.getLength(),C)},o.getEncodedBits=function(f){if(!r.isValid(f)||f<7)throw new Error("Invalid QR Code version");let p=f<<12;for(;t.getBCHDigit(p)-a>=0;)p^=s<<t.getBCHDigit(p)-a;return f<<12|p}})(de);var ue={};const Et=S,fe=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Ve=1<<14|1<<12|1<<10|1<<4|1<<1,jt=Et.getBCHDigit(fe);ue.getEncodedBits=function(t,e){const i=t.bit<<3|e;let n=i<<10;for(;Et.getBCHDigit(n)-jt>=0;)n^=fe<<Et.getBCHDigit(n)-jt;return(i<<10|n)^Ve};var ge={};const He=U;function V(o){this.mode=He.NUMERIC,this.data=o.toString()}V.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};V.prototype.getLength=function(){return this.data.length};V.prototype.getBitsLength=function(){return V.getBitsLength(this.data.length)};V.prototype.write=function(t){let e,i,n;for(e=0;e+3<=this.data.length;e+=3)i=this.data.substr(e,3),n=parseInt(i,10),t.put(n,10);const r=this.data.length-e;r>0&&(i=this.data.substr(e),n=parseInt(i,10),t.put(n,r*3+1))};var Je=V;const qe=U,mt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function H(o){this.mode=qe.ALPHANUMERIC,this.data=o}H.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};H.prototype.getLength=function(){return this.data.length};H.prototype.getBitsLength=function(){return H.getBitsLength(this.data.length)};H.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let i=mt.indexOf(this.data[e])*45;i+=mt.indexOf(this.data[e+1]),t.put(i,11)}this.data.length%2&&t.put(mt.indexOf(this.data[e]),6)};var Ye=H;const Ke=U;function J(o){this.mode=Ke.BYTE,typeof o=="string"?this.data=new TextEncoder().encode(o):this.data=new Uint8Array(o)}J.getBitsLength=function(t){return t*8};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(o){for(let t=0,e=this.data.length;t<e;t++)o.put(this.data[t],8)};var Ge=J;const Qe=U,Ze=S;function q(o){this.mode=Qe.KANJI,this.data=o}q.getBitsLength=function(t){return t*13};q.prototype.getLength=function(){return this.data.length};q.prototype.getBitsLength=function(){return q.getBitsLength(this.data.length)};q.prototype.write=function(o){let t;for(t=0;t<this.data.length;t++){let e=Ze.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),o.put(e,13)}};var Xe=q,he={exports:{}};(function(o){var t={single_source_shortest_paths:function(e,i,n){var r={},s={};s[i]=0;var a=t.PriorityQueue.make();a.push(i,0);for(var l,c,d,g,u,f,p,m,C;!a.empty();){l=a.pop(),c=l.value,g=l.cost,u=e[c]||{};for(d in u)u.hasOwnProperty(d)&&(f=u[d],p=g+f,m=s[d],C=typeof s[d]=="undefined",(C||m>p)&&(s[d]=p,a.push(d,p),r[d]=c))}if(typeof n!="undefined"&&typeof s[n]=="undefined"){var h=["Could not find a path from ",i," to ",n,"."].join("");throw new Error(h)}return r},extract_shortest_path_from_predecessor_list:function(e,i){for(var n=[],r=i;r;)n.push(r),e[r],r=e[r];return n.reverse(),n},find_path:function(e,i,n){var r=t.single_source_shortest_paths(e,i,n);return t.extract_shortest_path_from_predecessor_list(r,n)},PriorityQueue:{make:function(e){var i=t.PriorityQueue,n={},r;e=e||{};for(r in i)i.hasOwnProperty(r)&&(n[r]=i[r]);return n.queue=[],n.sorter=e.sorter||i.default_sorter,n},default_sorter:function(e,i){return e.cost-i.cost},push:function(e,i){var n={value:e,cost:i};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};o.exports=t})(he);(function(o){const t=U,e=Je,i=Ye,n=Ge,r=Xe,s=P,a=S,l=he.exports;function c(h){return unescape(encodeURIComponent(h)).length}function d(h,y,b){const v=[];let E;for(;(E=h.exec(b))!==null;)v.push({data:E[0],index:E.index,mode:y,length:E[0].length});return v}function g(h){const y=d(s.NUMERIC,t.NUMERIC,h),b=d(s.ALPHANUMERIC,t.ALPHANUMERIC,h);let v,E;return a.isKanjiModeEnabled()?(v=d(s.BYTE,t.BYTE,h),E=d(s.KANJI,t.KANJI,h)):(v=d(s.BYTE_KANJI,t.BYTE,h),E=[]),y.concat(b,v,E).sort(function(T,N){return T.index-N.index}).map(function(T){return{data:T.data,mode:T.mode,length:T.length}})}function u(h,y){switch(y){case t.NUMERIC:return e.getBitsLength(h);case t.ALPHANUMERIC:return i.getBitsLength(h);case t.KANJI:return r.getBitsLength(h);case t.BYTE:return n.getBitsLength(h)}}function f(h){return h.reduce(function(y,b){const v=y.length-1>=0?y[y.length-1]:null;return v&&v.mode===b.mode?(y[y.length-1].data+=b.data,y):(y.push(b),y)},[])}function p(h){const y=[];for(let b=0;b<h.length;b++){const v=h[b];switch(v.mode){case t.NUMERIC:y.push([v,{data:v.data,mode:t.ALPHANUMERIC,length:v.length},{data:v.data,mode:t.BYTE,length:v.length}]);break;case t.ALPHANUMERIC:y.push([v,{data:v.data,mode:t.BYTE,length:v.length}]);break;case t.KANJI:y.push([v,{data:v.data,mode:t.BYTE,length:c(v.data)}]);break;case t.BYTE:y.push([{data:v.data,mode:t.BYTE,length:c(v.data)}])}}return y}function m(h,y){const b={},v={start:{}};let E=["start"];for(let w=0;w<h.length;w++){const T=h[w],N=[];for(let F=0;F<T.length;F++){const I=T[F],x=""+w+F;N.push(x),b[x]={node:I,lastCount:0},v[x]={};for(let B=0;B<E.length;B++){const A=E[B];b[A]&&b[A].node.mode===I.mode?(v[A][x]=u(b[A].lastCount+I.length,I.mode)-u(b[A].lastCount,I.mode),b[A].lastCount+=I.length):(b[A]&&(b[A].lastCount=I.length),v[A][x]=u(I.length,I.mode)+4+t.getCharCountIndicator(I.mode,y))}}E=N}for(let w=0;w<E.length;w++)v[E[w]].end=0;return{map:v,table:b}}function C(h,y){let b;const v=t.getBestModeForData(h);if(b=t.from(y,v),b!==t.BYTE&&b.bit<v.bit)throw new Error('"'+h+'" cannot be encoded with mode '+t.toString(b)+`.
 Suggested mode is: `+t.toString(v));switch(b===t.KANJI&&!a.isKanjiModeEnabled()&&(b=t.BYTE),b){case t.NUMERIC:return new e(h);case t.ALPHANUMERIC:return new i(h);case t.KANJI:return new r(h);case t.BYTE:return new n(h)}}o.fromArray=function(y){return y.reduce(function(b,v){return typeof v=="string"?b.push(C(v,null)):v.data&&b.push(C(v.data,v.mode)),b},[])},o.fromString=function(y,b){const v=g(y,a.isKanjiModeEnabled()),E=p(v),w=m(E,b),T=l.find_path(w.map,"start","end"),N=[];for(let F=1;F<T.length-1;F++)N.push(w.table[T[F]].node);return o.fromArray(f(N))},o.rawSplit=function(y){return o.fromArray(g(y,a.isKanjiModeEnabled()))}})(ge);const ft=S,vt=dt,We=Le,je=Re,tn=ie,en=re,Ct=se,$t=ct,nn=Pe,lt=de,on=ue,rn=U,bt=ge;function sn(o,t){const e=o.size,i=en.getPositions(t);for(let n=0;n<i.length;n++){const r=i[n][0],s=i[n][1];for(let a=-1;a<=7;a++)if(!(r+a<=-1||e<=r+a))for(let l=-1;l<=7;l++)s+l<=-1||e<=s+l||(a>=0&&a<=6&&(l===0||l===6)||l>=0&&l<=6&&(a===0||a===6)||a>=2&&a<=4&&l>=2&&l<=4?o.set(r+a,s+l,!0,!0):o.set(r+a,s+l,!1,!0))}}function an(o){const t=o.size;for(let e=8;e<t-8;e++){const i=e%2===0;o.set(e,6,i,!0),o.set(6,e,i,!0)}}function ln(o,t){const e=tn.getPositions(t);for(let i=0;i<e.length;i++){const n=e[i][0],r=e[i][1];for(let s=-2;s<=2;s++)for(let a=-2;a<=2;a++)s===-2||s===2||a===-2||a===2||s===0&&a===0?o.set(n+s,r+a,!0,!0):o.set(n+s,r+a,!1,!0)}}function dn(o,t){const e=o.size,i=lt.getEncodedBits(t);let n,r,s;for(let a=0;a<18;a++)n=Math.floor(a/3),r=a%3+e-8-3,s=(i>>a&1)===1,o.set(n,r,s,!0),o.set(r,n,s,!0)}function yt(o,t,e){const i=o.size,n=on.getEncodedBits(t,e);let r,s;for(r=0;r<15;r++)s=(n>>r&1)===1,r<6?o.set(r,8,s,!0):r<8?o.set(r+1,8,s,!0):o.set(i-15+r,8,s,!0),r<8?o.set(8,i-r-1,s,!0):r<9?o.set(8,15-r-1+1,s,!0):o.set(8,15-r-1,s,!0);o.set(i-8,8,1,!0)}function cn(o,t){const e=o.size;let i=-1,n=e-1,r=7,s=0;for(let a=e-1;a>0;a-=2)for(a===6&&a--;;){for(let l=0;l<2;l++)if(!o.isReserved(n,a-l)){let c=!1;s<t.length&&(c=(t[s]>>>r&1)===1),o.set(n,a-l,c),r--,r===-1&&(s++,r=7)}if(n+=i,n<0||e<=n){n-=i,i=-i;break}}}function un(o,t,e){const i=new We;e.forEach(function(l){i.put(l.mode.bit,4),i.put(l.getLength(),rn.getCharCountIndicator(l.mode,o)),l.write(i)});const n=ft.getSymbolTotalCodewords(o),r=$t.getTotalCodewordsCount(o,t),s=(n-r)*8;for(i.getLengthInBits()+4<=s&&i.put(0,4);i.getLengthInBits()%8!==0;)i.putBit(0);const a=(s-i.getLengthInBits())/8;for(let l=0;l<a;l++)i.put(l%2?17:236,8);return fn(i,o,t)}function fn(o,t,e){const i=ft.getSymbolTotalCodewords(t),n=$t.getTotalCodewordsCount(t,e),r=i-n,s=$t.getBlocksCount(t,e),a=i%s,l=s-a,c=Math.floor(i/s),d=Math.floor(r/s),g=d+1,u=c-d,f=new nn(u);let p=0;const m=new Array(s),C=new Array(s);let h=0;const y=new Uint8Array(o.buffer);for(let T=0;T<s;T++){const N=T<l?d:g;m[T]=y.slice(p,p+N),C[T]=f.encode(m[T]),p+=N,h=Math.max(h,N)}const b=new Uint8Array(i);let v=0,E,w;for(E=0;E<h;E++)for(w=0;w<s;w++)E<m[w].length&&(b[v++]=m[w][E]);for(E=0;E<u;E++)for(w=0;w<s;w++)b[v++]=C[w][E];return b}function gn(o,t,e,i){let n;if(Array.isArray(o))n=bt.fromArray(o);else if(typeof o=="string"){let c=t;if(!c){const d=bt.rawSplit(o);c=lt.getBestVersionForData(d,e)}n=bt.fromString(o,c||40)}else throw new Error("Invalid data");const r=lt.getBestVersionForData(n,e);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=r;else if(t<r)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+r+`.
`);const s=un(t,e,n),a=ft.getSymbolSize(t),l=new je(a);return sn(l,t),an(l),ln(l,t),yt(l,e,0),t>=7&&dn(l,t),cn(l,s),isNaN(i)&&(i=Ct.getBestMask(l,yt.bind(null,l,e))),Ct.applyMask(i,l),yt(l,e,i),{modules:l,version:t,errorCorrectionLevel:e,maskPattern:i,segments:n}}ne.create=function(t,e){if(typeof t=="undefined"||t==="")throw new Error("No input text");let i=vt.M,n,r;return typeof e!="undefined"&&(i=vt.from(e.errorCorrectionLevel,vt.M),n=lt.from(e.version),r=Ct.from(e.maskPattern),e.toSJISFunc&&ft.setToSJISFunction(e.toSJISFunc)),gn(t,n,i,r)};var pe={},Ft={};(function(o){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let i=e.slice().replace("#","").split("");if(i.length<3||i.length===5||i.length>8)throw new Error("Invalid hex color: "+e);(i.length===3||i.length===4)&&(i=Array.prototype.concat.apply([],i.map(function(r){return[r,r]}))),i.length===6&&i.push("F","F");const n=parseInt(i.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+i.slice(0,6).join("")}}o.getOptions=function(i){i||(i={}),i.color||(i.color={});const n=typeof i.margin=="undefined"||i.margin===null||i.margin<0?4:i.margin,r=i.width&&i.width>=21?i.width:void 0,s=i.scale||4;return{width:r,scale:r?4:s,margin:n,color:{dark:t(i.color.dark||"#000000ff"),light:t(i.color.light||"#ffffffff")},type:i.type,rendererOpts:i.rendererOpts||{}}},o.getScale=function(i,n){return n.width&&n.width>=i+n.margin*2?n.width/(i+n.margin*2):n.scale},o.getImageWidth=function(i,n){const r=o.getScale(i,n);return Math.floor((i+n.margin*2)*r)},o.qrToImageData=function(i,n,r){const s=n.modules.size,a=n.modules.data,l=o.getScale(s,r),c=Math.floor((s+r.margin*2)*l),d=r.margin*l,g=[r.color.light,r.color.dark];for(let u=0;u<c;u++)for(let f=0;f<c;f++){let p=(u*c+f)*4,m=r.color.light;if(u>=d&&f>=d&&u<c-d&&f<c-d){const C=Math.floor((u-d)/l),h=Math.floor((f-d)/l);m=g[a[C*s+h]?1:0]}i[p++]=m.r,i[p++]=m.g,i[p++]=m.b,i[p]=m.a}}})(Ft);(function(o){const t=Ft;function e(n,r,s){n.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=s,r.width=s,r.style.height=s+"px",r.style.width=s+"px"}function i(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}o.render=function(r,s,a){let l=a,c=s;typeof l=="undefined"&&(!s||!s.getContext)&&(l=s,s=void 0),s||(c=i()),l=t.getOptions(l);const d=t.getImageWidth(r.modules.size,l),g=c.getContext("2d"),u=g.createImageData(d,d);return t.qrToImageData(u.data,r,l),e(g,c,d),g.putImageData(u,0,0),c},o.renderToDataURL=function(r,s,a){let l=a;typeof l=="undefined"&&(!s||!s.getContext)&&(l=s,s=void 0),l||(l={});const c=o.render(r,s,l),d=l.type||"image/png",g=l.rendererOpts||{};return c.toDataURL(d,g.quality)}})(pe);var me={};const hn=Ft;function te(o,t){const e=o.a/255,i=t+'="'+o.hex+'"';return e<1?i+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':i}function wt(o,t,e){let i=o+t;return typeof e!="undefined"&&(i+=" "+e),i}function pn(o,t,e){let i="",n=0,r=!1,s=0;for(let a=0;a<o.length;a++){const l=Math.floor(a%t),c=Math.floor(a/t);!l&&!r&&(r=!0),o[a]?(s++,a>0&&l>0&&o[a-1]||(i+=r?wt("M",l+e,.5+c+e):wt("m",n,0),n=0,r=!1),l+1<t&&o[a+1]||(i+=wt("h",s),s=0)):n++}return i}me.render=function(t,e,i){const n=hn.getOptions(e),r=t.modules.size,s=t.modules.data,a=r+n.margin*2,l=n.color.light.a?"<path "+te(n.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",c="<path "+te(n.color.dark,"stroke")+' d="'+pn(s,r,n.margin)+'"/>',d='viewBox="0 0 '+a+" "+a+'"',g=n.width?'width="'+n.width+'" height="'+n.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+g+d+' shape-rendering="crispEdges">'+l+c+`</svg>
`;return typeof i=="function"&&i(null,u),u};const mn=Me,Tt=ne,ve=pe,vn=me;function Bt(o,t,e,i,n){const r=[].slice.call(arguments,1),s=r.length,a=typeof r[s-1]=="function";if(!a&&!mn())throw new Error("Callback required as last argument");if(a){if(s<2)throw new Error("Too few arguments provided");s===2?(n=e,e=t,t=i=void 0):s===3&&(t.getContext&&typeof n=="undefined"?(n=i,i=void 0):(n=i,i=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=i=void 0):s===2&&!t.getContext&&(i=e,e=t,t=void 0),new Promise(function(l,c){try{const d=Tt.create(e,i);l(o(d,t,i))}catch(d){c(d)}})}try{const l=Tt.create(e,i);n(null,o(l,t,i))}catch(l){n(l)}}M.create=Tt.create;M.toCanvas=Bt.bind(null,ve.render);M.toDataURL=Bt.bind(null,ve.renderToDataURL);M.toString=Bt.bind(null,function(o,t,e){return vn.render(o,e)});class bn{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,i=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){i=!1;break}return i?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let i=this.tens[t.charAt(0)-3];return e>0&&(i+=" y "+this.getUnits(e)),i}getHundreds(t){let e="",i=t.charAt(0),n=t.substr(1);if(t==100)return"cien";switch(i){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(i)+"cientos"),n>0&&(e+=" "+this.getName(n)),e}getThousands(t){let e="mil",i=t.length-3,n=t.substr(0,i),r=t.substr(i);return n>1&&(e=this.getName(n).replace("uno","un")+" mil"),r>0&&(e+=" "+this.getName(r)),e}getPeriod(t,e,i){let n="un "+i,r=t.length-e,s=t.substr(0,r),a=t.substr(r);return s>1&&(n=this.getName(s).replace("uno","un")+" "+i.replace("\xF3","o")+"es"),a>0&&(n+=" "+this.getName(a)),n}}var O={conversorNumerosALetras:bn},be={};Object.defineProperty(be,"__esModule",{value:!0});function st(o){switch(o){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function _(o,t){return t>0?o+" y "+st(t):o}function k(o){var t=Math.floor(o/10),e=o-t*10;switch(t){case 1:switch(e){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+st(e).toLowerCase()}case 2:switch(e){case 0:return"Veinte";default:return"Veinti"+st(e).toLowerCase()}case 3:return _("Treinta",e);case 4:return _("Cuarenta",e);case 5:return _("Cincuenta",e);case 6:return _("Sesenta",e);case 7:return _("Setenta",e);case 8:return _("Ochenta",e);case 9:return _("Noventa",e);case 0:return st(e);default:return""}}function ye(o){var t=Math.floor(o/100),e=o-t*100;switch(t){case 1:return e>0?"Ciento "+k(e):"Cien";case 2:return"Doscientos "+k(e);case 3:return"Trescientos "+k(e);case 4:return"Cuatrocientos "+k(e);case 5:return"Quinientos "+k(e);case 6:return"Seiscientos "+k(e);case 7:return"Setecientos "+k(e);case 8:return"Ochocientos "+k(e);case 9:return"Novecientos "+k(e);default:return k(e)}}function we(o,t,e,i){var n=Math.floor(o/t),r=o-n*t,s="";return n>0&&(n>1?s=ye(n)+" "+i:s=e),r>0&&(s+=""),s}function yn(o){var t=1e3,e=Math.floor(o/t),i=o-e*t,n=we(o,t,"Un Mil","Mil"),r=ye(i);return n===""?r:(n+" "+r).trim()}function ee(o){var t=1e6,e=Math.floor(o/t),i=o-e*t,n=we(o,t,"Un Mill\xF3n de","Millones de"),r=yn(i);return n===""?r:(n+" "+r).trim()}function wn(o){var t={numero:o,enteros:Math.floor(o),centavos:Math.round(o*100)-Math.floor(o)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(ee(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(ee(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}be.NumerosALetras=wn;class An{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],i=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],n={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},r=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function s(g){if(g<10)return e[g];if(g>=10&&g<20)return n[g];if(g<100){const f=g%10;return`${i[Math.floor(g/10)]}${f>0?" y "+e[f]:""}`}if(g===100)return"cien";const u=g%100;return`${r[Math.floor(g/100)]}${u>0?" "+s(u):""}`}if(t===1e6)return"un mill\xF3n";let a=Math.floor(t/1e3),l=t%1e3,c=a>0?a===1?"mil":`${s(a)} mil`:"",d=l>0?s(l):"";return(c+" "+d).trim()}static imprimirCaja(t){var e,i,n;try{const r=L().env||{},s=h=>Number(h||0).toFixed(2),a=(h,y="\u2014")=>(h!=null?h:y).toString(),l=((e=t==null?void 0:t.observaciones)!=null?e:"").toString().trim(),c=(t==null?void 0:t.paciente)||{},d=h=>{if(!h)return"\u2014";try{const y=h.substring(0,10).split("-");return`${y[2]}/${y[1]}/${y[0]}`}catch{return h}},g=`
      @page { margin: 4mm 6mm; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .tk { width: 340px; margin: 0 auto; font-family: "Courier New", Courier, monospace; font-size: 14px; font-weight: 700; color: #111; line-height: 1.05; }
      .tk-header { background: #111; color: #fff; padding: 4px 8px 3px; text-align: center; }
      .tk-header .clinic { font-size: 16px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
      .tk-header .sub { font-size: 12px; color: #ddd; margin-top: 1px; line-height: 1.1; font-weight: 700; }
      .tk-title { background: #333; color: #fff; text-align: center; font-size: 14px; font-weight: 700; padding: 2px 0; letter-spacing: 0.1em; text-transform: uppercase; }
      .tk-sec { padding: 1px 8px; }
      .tk-sep { border: none; border-top: 1px dashed #999; margin: 0; }
      .tk-sep-solid { border: none; border-top: 2px solid #111; margin: 0; }
      .tk-row { display: flex; justify-content: space-between; align-items: baseline; padding: 0; }
      .tk-row .lbl { font-weight: 700; font-size: 13px; color: #333; text-transform: uppercase; min-width: 84px; flex-shrink: 0; }
      .tk-row .val { text-align: right; font-size: 14px; font-weight: 700; }
      .tk-row .val.bold { font-weight: 700; }
      .tk-amt { padding: 1px 8px; }
      .tk-amt-row { display: flex; justify-content: space-between; align-items: baseline; padding: 0; }
      .tk-amt-row .albl { font-size: 13px; color: #333; text-transform: uppercase; font-weight: 700; }
      .tk-amt-row .aval { font-size: 14px; font-weight: 700; }
      .tk-total { display: flex; justify-content: space-between; align-items: baseline; padding: 3px 8px; background: #111; color: #fff; margin-top: 1px; }
      .tk-total .tlbl { font-size: 14px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
      .tk-total .tval { font-size: 16px; font-weight: 700; }
      .tk-obs { padding: 1px 8px; font-size: 14px; color: #111; font-weight: 700; }
      .tk-extra { padding: 1px 8px; }
      .tk-extra .tk-row .lbl { font-size: 12px; }
      .tk-extra .tk-row .val { font-size: 13px; }
      .tk-footer { text-align: center; font-size: 11px; color: #333; font-weight: 700; padding: 2px 8px; border-top: 1px dashed #aaa; margin-top: 1px; }
      .tk-det { padding: 1px 8px; }
      .tk-det-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #333; padding: 2px 0; }
      .tk-det-row { display: flex; justify-content: space-between; align-items: baseline; padding: 0; }
      .tk-det-row .dlbl { font-size: 13px; font-weight: 700; }
      .tk-det-row .dval { font-size: 13px; font-weight: 700; text-align: right; }
      `,u=Array.isArray(t==null?void 0:t.costo_items)?t.costo_items:[],f=`
      <div class="tk">
        <div class="tk-header">
          <div class="clinic">${a(r.razon,"CL\xCDNICA LA FUENTE")}</div>
          <div class="sub">${a(r.direccion,"")} &nbsp;\xB7&nbsp; Tel. ${a(r.telefono,"")}</div>
        </div>
        <div class="tk-title">Recibo Caja Recepci\xF3n</div>

        <div class="tk-sec">
          <div class="tk-row"><span class="lbl">Registro</span><span class="val">#${a(t==null?void 0:t.id)}</span></div>
          <div class="tk-row"><span class="lbl">Fecha/Hora</span><span class="val">${a(t==null?void 0:t.fecha)} ${a(t==null?void 0:t.hora,"")}</span></div>
          <div class="tk-row"><span class="lbl">Ficha</span><span class="val">${a(t==null?void 0:t.numero_ficha,"-")}</span></div>
          <div class="tk-row"><span class="lbl">Documento</span><span class="val">${a(t==null?void 0:t.documento_label,"-")}</span></div>
          ${((t==null?void 0:t.nombre_factura)||"").toString().trim()?`<div class="tk-row"><span class="lbl">N\xB0 Factura</span><span class="val bold">${a(t.nombre_factura)}</span></div>`:""}
          <div class="tk-row"><span class="lbl">Encargado</span><span class="val">${a((i=t==null?void 0:t.user)==null?void 0:i.name,"-")}</span></div>
          ${t!=null&&t.doctor?`<div class="tk-row"><span class="lbl">M\xE9dico</span><span class="val bold">${a((n=t.doctor)==null?void 0:n.nombre,"-")}</span></div>`:""}
        </div>

        <hr class="tk-sep">

        <div class="tk-sec">
          <div class="tk-row"><span class="lbl">Paciente</span><span class="val bold">${a(c.nombre_completo,"SN")}</span></div>
          <div class="tk-row"><span class="lbl">Carnet</span><span class="val">${a(c.identificacion,"-")}</span></div>
          <div class="tk-row"><span class="lbl">Fec. Nac.</span><span class="val">${d(c.fecha_nacimiento)}</span></div>
          <div class="tk-row"><span class="lbl">Celular</span><span class="val">${a(c.telefono,"-")}</span></div>
        </div>

        <hr class="tk-sep-solid">

        <div class="tk-amt">
          <div class="tk-amt-row"><span class="albl">Recaudado</span><span class="aval">${s(t==null?void 0:t.recaudado_total)} Bs</span></div>
          <div class="tk-amt-row"><span class="albl">QR</span><span class="aval">${s(t==null?void 0:t.qr)} Bs</span></div>
          <div class="tk-amt-row"><span class="albl">Efectivo</span><span class="aval">${s(t==null?void 0:t.efectivo)} Bs</span></div>
          <div class="tk-amt-row"><span class="albl">Egreso doctor</span><span class="aval">${s(t==null?void 0:t.egreso)} Bs</span></div>
          <div class="tk-amt-row"><span class="albl">Farmacia</span><span class="aval">${s(t==null?void 0:t.costo_farmacia)} Bs</span></div>
        </div>

        ${u.length?`
        <hr class="tk-sep">
        <div class="tk-det">
          <div class="tk-det-title">Detalle de costos</div>
          ${u.map(h=>`
            <div class="tk-det-row"><span class="dlbl">${a(h.nombre,"Costo")}</span><span class="dval">${s(h.monto)} Bs</span></div>
          `).join("")}
        </div>
        `:""}

        <div class="tk-total">
          <span class="tlbl">Saldo Final</span>
          <span class="tval">${s(t==null?void 0:t.saldo_final)} Bs</span>
        </div>

        ${l?`<div class="tk-obs"><b>Obs:</b> ${l}</div>`:""}

        <div class="tk-extra">
          ${((t==null?void 0:t.laboratorio_nombre)||"").trim()?`<div class="tk-row"><span class="lbl">Laboratorio</span><span class="val">${a(t.laboratorio_nombre)}</span></div>`:""}
          ${((t==null?void 0:t.medico_ecografia)||"").trim()?`<div class="tk-row"><span class="lbl">Ecograf\xEDa</span><span class="val">${a(t.medico_ecografia)}</span></div>`:""}
        </div>

        <div class="tk-footer">${a(r.razon,"Cl\xEDnica La Fuente")} &nbsp;\xB7&nbsp; Gracias por su visita</div>
      </div>`,p=document.getElementById("myElement");if(!p)return;p.innerHTML=f;const m=p.querySelector(".tk");new R().print(m,[g])}catch(r){console.error("imprimirCaja error:",r)}}static async factura(t){return new Promise(async(e,i)=>{var n,r,s,a,l,c,d,g,u,f,p,m,C,h,y,b,v,E,w,T,N;try{const F=O.conversorNumerosALetras,I=new F,x=L().env,B=$=>Number($||0).toFixed(2),A=$=>($!=null?$:"").toString(),D=Number((r=(n=t.total)!=null?n:t.montoTotal)!=null?r:0),Y=(l=(a=(s=t.numeroFactura)!=null?s:t.numero_factura)!=null?a:t.id)!=null?l:"\u2014",W=(c=t.fechaEmision)!=null?c:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",j=(u=(g=t.nombre)!=null?g:(d=t==null?void 0:t.cliente)==null?void 0:d.nombre)!=null?u:"SN",K=(m=(p=t.complemento)!=null?p:(f=t==null?void 0:t.cliente)==null?void 0:f.complemento)!=null?m:"",tt=(y=(h=t.ci)!=null?h:(C=t==null?void 0:t.cliente)==null?void 0:C.ci)!=null?y:"0",et=(E=(v=t.cliente_id)!=null?v:(b=t==null?void 0:t.cliente)==null?void 0:b.id)!=null?E:"\u2014",nt=(w=x==null?void 0:x.puntoVenta)!=null?w:0,gt=(T=t.cuf)!=null?T:null,G=gt?gt.match(/.{1,20}/g).join("<br>"):null,Ee=gt?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",Ce=(N=t.leyenda)!=null?N:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",$e=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],It=Math.floor(D),Te=Math.round((D-It)*100).toString().padStart(2,"0"),Ae=`Son ${I.convertToText(It)} ${Te}/100 Bolivianos`;let ot=null;G&&(ot=await M.toDataURL(`${x.url2}consulta/QR?nit=${x.nit}&cuf=${G}&numero=${Y}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let ht=`${this.head()}
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
  <div class="title fs12 center">${Ee}</div>

  <div class="center small">
    ${A(x.razon)}<br>
    Casa Matriz<br>
    No. Punto de Venta ${nt}<br>
    ${A(x.direccion)}<br>
    Tel. ${A(x.telefono)}<br>
    Oruro
  </div>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NIT</td><td class="val">${A(x.nit)}</td></tr>
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
  <div class="det-header center">DETALLE</div>`;$e.forEach($=>{var Rt,kt,Pt,Dt,Ot,zt,Ut,_t,Vt,Ht,Jt,qt,Yt,Kt,Gt,Qt,Zt,Xt;const xe=(Dt=(Pt=(Rt=$.producto_id)!=null?Rt:$.product_id)!=null?Pt:(kt=$==null?void 0:$.producto)==null?void 0:kt.id)!=null?Dt:"\u2014",Ne=A((_t=(Ut=(Ot=$.nombre)!=null?Ot:$.descripcion)!=null?Ut:(zt=$==null?void 0:$.producto)==null?void 0:zt.nombre)!=null?_t:""),Fe=A((Jt=(Ht=$.unidad)!=null?Ht:(Vt=$==null?void 0:$.producto)==null?void 0:Vt.unidad)!=null?Jt:""),Mt=Number((Yt=(qt=$.cantidad)!=null?qt:$.qty)!=null?Yt:0),St=Number((Gt=(Kt=$.precio)!=null?Kt:$.precioUnitario)!=null?Gt:0),Lt=Number((Zt=(Qt=$.descuento)!=null?Qt:$.montoDescuento)!=null?Zt:0),Be=(Xt=$.subTotal)!=null?Xt:Mt*St-Lt;ht+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${xe} - ${Ne}</td>
          <td class="right item-desc">${B(Be)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Fe||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${B(Mt)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${B(St)} - ${B(Lt)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),ht+=`
  <hr>
  <table class="tbl tot fs10">
    <tr><td class="l left strong">TOTAL Bs</td><td class="r strong">${B(D)}</td></tr>
    <tr><td class="l left">(-) DESCUENTO Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">SUBTOTAL A PAGAR Bs</td><td class="r strong">${B(D)}</td></tr>
    <tr><td class="l left">(-) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">MONTO TOTAL A PAGAR Bs</td><td class="r strong">${B(D)}</td></tr>
    <tr><td class="l left">(-) TASAS Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(-) OTROS PAGOS NO SUJETO IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(+) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">IMPORTE BASE CR\xC9DITO FISCAL</td><td class="r strong">${B(D)}</td></tr>
  </table>

  <div class="fs10" style="margin-top:6px;">${Ae}</div>

  <hr>
  <div class="center small">
    ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY
  </div>
  <div class="center small" style="margin-top:4px;">${A(Ce)}</div>
  <div class="center small" style="margin-top:4px;">\u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n en l\xEDnea\u201D</div>
  ${ot?`<div class="qr"><img src="${ot}" alt="QR"></div>`:""}
</div>`;const pt=document.getElementById("myElement");pt&&(pt.innerHTML=ht),new R().print(pt),e(ot)}catch(F){i(F)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((i,n)=>{const r=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};L().env,M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(a=>{let l="",c="";t.producto&&(l="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(c="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let d=`${this.head()}
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
${c}
</table><hr><div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(g=>{var u;console.log("r",g),d+=`<div style='font-size: 12px'><b> ${(u=g.producto)==null?void 0:u.nombre} </b></div>`,g.visible===1?d+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${g.cantidad}
                    </span>
                    <span>
                    ${parseFloat(g.precio).toFixed(2)}
                    </span>

                    <span style='float:right'>
                        ${parseFloat(g.precio*g.cantidad).toFixed(2)}
                    </span>
                    </div>`:d+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${g.cantidad}
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
      <div>Son ${r} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
        <!--div style='display: flex;justify-content: center;'>
          <img  src="${a}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=d,e&&new R().print(document.getElementById("myElement")),i(a)}).catch(a=>{n(a)})})}static cotizacion(t,e,i,n,r=!0){return(n==null||n==="")&&(n=0),new Promise((s,a)=>{const l=O.conversorNumerosALetras,d=new l().convertToText(parseInt(i)),g=Ie().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=L().env;M.toDataURL(`Fecha: ${g} Monto: ${parseFloat(i).toFixed(2)}`,u).then(p=>{let m=`${this.head()}
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
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${g}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(C=>{m+=`<div style='font-size: 12px'><b> ${C.nombre} </b></div>`,m+=`<div><span style='font-size: 18px;font-weight: bold'>${C.cantidadVenta}</span> ${parseFloat(C.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(C.precioVenta*C.cantidadVenta).toFixed(2)}</span></div>`}),m+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(i).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(n).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(i-n).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${d} ${((parseFloat(i)-Math.floor(parseFloat(i)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${p}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=m,r&&new R().print(document.getElementById("myElement")),s(p)}).catch(p=>{a(p)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,i)=>{const n=O.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),a={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},l=L().env;M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,a).then(async c=>{let d=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{i(c)})})}static reportTotal(t,e){const i=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,a)=>s+a.montoTotal,0),n=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,a)=>s+a.montoTotal,0),r=i-n;return console.log("montoTotal",r),new Promise((s,a)=>{const l=O.conversorNumerosALetras,c=new l,d=Math.abs(r),g=c.convertToText(parseInt(d)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=L().env;M.toDataURL(` Monto: ${parseFloat(r).toFixed(2)}`,u).then(p=>{let m=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(h=>{m+=`<div style='font-size: 12px'><b> ${h.user.name} </b></div>`,m+=`<div> ${parseFloat(h.montoTotal).toFixed(2)} ${h.tipoVenta}
          <span style='float:right'> ${h.tipoVenta==="Egreso"?"-":""} ${parseFloat(h.montoTotal).toFixed(2)}</span></div>`}),m+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${g} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${p}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=m,new R().print(document.getElementById("myElement")),s(p)}).catch(p=>{a(p)})})}static reciboCompra(t){return console.log("reciboCompra",t),new Promise((e,i)=>{var d;const n=O.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),a=((d=t.comentario)!=null?d:"").toString().trim(),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},c=L().env;M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(g=>{let u=`${this.head()}
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
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(p=>{u+=`<div style='font-size: 12px'><b>${p.nombre} </b></div>`,u+=`<div>${p.cantidad} ${parseFloat(p.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(p.total).toFixed(2)}</span></div>`}),u+=`<hr>
      <div>${a?"Comentario: "+a:""}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${g}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=u,new R().print(document.getElementById("myElement")),e(g)}).catch(g=>{i(g)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,i)=>{const n=O.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),a={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},l=L().env;M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,a).then(c=>{let d=`${this.head()}
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
    </html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{i(c)})})}static reciboTranferencia(t,e,i,n){return console.log("producto",t,"de",e,"ha",i,"cantidad",n),new Promise((r,s)=>{const a=O.conversorNumerosALetras,c=new a().convertToText(parseInt(n)),d={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},g=L().env;M.toDataURL(`de: ${e} A: ${i}`,d).then(u=>{let f=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE TRANSFERENCIA</div>
      <div class='titulo2'>${g.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${g.direccion}<br>
    Tel. ${g.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;f+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${e} a ${i} </b></div>`,f+=`<hr>
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
    </html>`,document.getElementById("myElement").innerHTML=f,new R().print(document.getElementById("myElement")),r(u)}).catch(u=>{s(u)})})}static reciboTraspaso(t){return new Promise((e,i)=>{var n,r;try{const s=L().env,a=((n=t.comentario)!=null?n:"").toString().trim();let l=`${this.head()}
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
      <b>Usuario:</b> ${((r=t.user)==null?void 0:r.name)||"-"}
    </div>
    <hr>
    <div class='titulo'>DETALLE</div>`;(t.venta_detalles||[]).forEach(d=>{var g;l+=`<div style='font-size: 12px'><b>${d.nombre||((g=d.producto)==null?void 0:g.nombre)||"Producto"}</b></div>`,l+=`<div>${d.cantidad} u | Lote: ${d.lote||"-"} | Vence: ${d.fecha_vencimiento||"-"}
          <span style='float:right'>${parseFloat(d.precio||0).toFixed(2)} Bs</span></div>`}),l+=`<hr>
      <div>${a?"Comentario: "+a:""}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total||0).toFixed(2)}</td></tr>
      </table>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=l,new R().print(document.getElementById("myElement")),e(!0)}catch(s){i(s)}})}static head(){return`<html>
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
<div style="width: 300px;">`}static async printFactura(t){var g,u;const e=O.conversorNumerosALetras,n=new e().convertToText(parseInt(t.total)),r=L().env,s=await M.toDataURL(`${r.url2}consulta/QR?nit=${r.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),a=t.online?"en":"fuera de";let l=`<style>
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
      ${r.razon}<br>Casa Matriz<br>No. Punto de Venta 0<br>
      ${r.direccion}<br>Tel. ${r.telefono}<br>Oruro
    </div>
    <hr>
    <div class='titulo'>NIT</div><div class='titulo2'>${r.nit}</div>
    <div class='titulo'>FACTURA N\xB0</div><div class='titulo2'>${t.id}</div>
    <div class='titulo'>C\xD3D. AUTORIZACI\xD3N</div><div class='titulo2'>${t.cuf}</div>
    <hr>
    <table>
      <tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.nombre}</td></tr>
      <tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.ci}${(g=t.cliente)!=null&&g.complemento?"-"+((u=t.cliente)==null?void 0:u.complemento):""}</td></tr>
      <tr><td class='titder'>COD. CLIENTE:</td><td class='contenido'>${t.cliente.id}</td></tr>
      <tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
    </table>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(f=>{l+=`<div style='font-size: 12px'><b>${f.id} - ${f.nombre}</b></div>
             <div>${f.cantidad} ${parseFloat(f.precio).toFixed(2)} 0.00
             <span style='float:right'>${parseFloat(f.cantidad*f.precio).toFixed(2)}</span></div>`}),l+=`<hr>
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
    \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n ${a} l\xEDnea\u201D</div>
    <div style='display: flex; justify-content: center;'>
      <img src="${s}" />
    </div>
  </div>`;const c=document.getElementById("myElement");c&&(c.innerHTML=l),new R().print(c)}static async reciboVentaSimple(t,e=!0){var i,n,r;try{const s=L().env||{},a=O.conversorNumerosALetras,l=new a,c=w=>Number(w||0).toFixed(2),d=(w,T="\u2014")=>(w!=null?w:T).toString(),g=Number((i=t.total)!=null?i:0),u=Math.floor(g),f=Math.round((g-u)*100).toString().padStart(2,"0"),p=`Son ${l.convertToText(u)} ${f}/100 Bolivianos`,m=((n=t.comentario)!=null?n:"").toString().trim(),C=d(t.farmacia_tipo||"Farmacia","Farmacia"),h=C==="Farmacia institucional"?"badge-institucional":"badge-farmacia",y=Array.isArray(t.venta_detalles)?t.venta_detalles:[],b=`
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
    `;let v=`
      <div class="imprimir-scope">
        <div class="ticket">
          <div class="center bold" style="font-size:12px;">RECIBO DE VENTA</div>
          <div class="center">
            <span class="farmacia-badge ${h}">${C}</span>
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
            <tr><td class="bold">Usuario:</td><td>${d((r=t.user)==null?void 0:r.name,"")}</td></tr>
            <tr><td class="bold">Tipo venta:</td><td>${d(t.tipo_venta,"")}</td></tr>
            <tr><td class="bold">Pago:</td><td>${d(t.tipo_pago,"")}</td></tr>
          </table>

          <hr>

          <table>
            <tr class="bold"><td>Detalle</td><td class="right">Subt.</td></tr>
            ${y.map(w=>{var A,D,Y,W,j,K,tt,et,nt;const T=d((Y=(D=(A=w.producto)==null?void 0:A.nombre)!=null?D:w.nombre)!=null?Y:""),N=Number(w.cantidad||0),F=Number(w.precio||0),I=N*F,x=d((K=(j=w.unidad)!=null?j:(W=w.producto)==null?void 0:W.unidad)!=null?K:""),B=d((nt=(et=w.producto_id)!=null?et:(tt=w.producto)==null?void 0:tt.id)!=null?nt:"");return`
                <tr>
                  <td>
                    <div class="bold">${B?B+" - ":""}${T}</div>
                    <div class="small">${x?"UM: "+x+" \xB7 ":""}${c(N)} x ${c(F)}</div>
                  </td>
                  <td class="right bold">${c(I)}</td>
                </tr>
              `}).join("")}
          </table>

          <hr>

          <table>
            <tr><td class="bold">TOTAL (Bs)</td><td class="right bold">${c(g)}</td></tr>
          </table>

          ${m?`<div class="mt6"><span class="bold">Comentario:</span> ${m}</div>`:""}

          <div class="mt6">${p}</div>

          <hr>

          <div class="center small">
            \xA1Gracias por su compra!
          </div>
        </div>
      </div>
    `;const E=document.getElementById("myElement");if(E){E.innerHTML=v;const w=E.querySelector(".imprimir-scope");e&&new R().print(w,b)}return!0}catch(s){throw console.error("reciboVentaSimple error:",s),s}}}export{An as I};
