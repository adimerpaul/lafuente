import{u as R}from"./index.91340ddf.js";import{h as De}from"./moment.40bc58bf.js";var M={},Oe=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},te={},S={};let Ct;const Ue=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];S.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};S.getSymbolTotalCodewords=function(t){return Ue[t]};S.getBCHDigit=function(n){let t=0;for(;n!==0;)t++,n>>>=1;return t};S.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');Ct=t};S.isKanjiModeEnabled=function(){return typeof Ct!="undefined"};S.toSJIS=function(t){return Ct(t)};var it={};(function(n){n.L={bit:1},n.M={bit:0},n.Q={bit:3},n.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return n.L;case"m":case"medium":return n.M;case"q":case"quartile":return n.Q;case"h":case"high":return n.H;default:throw new Error("Unknown EC Level: "+e)}}n.isValid=function(r){return r&&typeof r.bit!="undefined"&&r.bit>=0&&r.bit<4},n.from=function(r,o){if(n.isValid(r))return r;try{return t(r)}catch{return o}}})(it);function ee(){this.buffer=[],this.length=0}ee.prototype={get:function(n){const t=Math.floor(n/8);return(this.buffer[t]>>>7-n%8&1)===1},put:function(n,t){for(let e=0;e<t;e++)this.putBit((n>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(n){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),n&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var ze=ee;function Q(n){if(!n||n<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=n,this.data=new Uint8Array(n*n),this.reservedBit=new Uint8Array(n*n)}Q.prototype.set=function(n,t,e,r){const o=n*this.size+t;this.data[o]=e,r&&(this.reservedBit[o]=!0)};Q.prototype.get=function(n,t){return this.data[n*this.size+t]};Q.prototype.xor=function(n,t,e){this.data[n*this.size+t]^=e};Q.prototype.isReserved=function(n,t){return this.reservedBit[n*this.size+t]};var _e=Q,ne={};(function(n){const t=S.getSymbolSize;n.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,i=t(r),s=i===145?26:Math.ceil((i-13)/(2*o-2))*2,l=[i-7];for(let a=1;a<o-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},n.getPositions=function(r){const o=[],i=n.getRowColCoords(r),s=i.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||o.push([i[l],i[a]]);return o}})(ne);var oe={};const ke=S.getSymbolSize,Gt=7;oe.getPositions=function(t){const e=ke(t);return[[0,0],[e-Gt,0],[0,e-Gt]]};var re={};(function(n){n.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};n.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},n.from=function(o){return n.isValid(o)?parseInt(o,10):void 0},n.getPenaltyN1=function(o){const i=o.size;let s=0,l=0,a=0,d=null,c=null;for(let f=0;f<i;f++){l=a=0,d=c=null;for(let u=0;u<i;u++){let h=o.get(f,u);h===d?l++:(l>=5&&(s+=t.N1+(l-5)),d=h,l=1),h=o.get(u,f),h===c?a++:(a>=5&&(s+=t.N1+(a-5)),c=h,a=1)}l>=5&&(s+=t.N1+(l-5)),a>=5&&(s+=t.N1+(a-5))}return s},n.getPenaltyN2=function(o){const i=o.size;let s=0;for(let l=0;l<i-1;l++)for(let a=0;a<i-1;a++){const d=o.get(l,a)+o.get(l,a+1)+o.get(l+1,a)+o.get(l+1,a+1);(d===4||d===0)&&s++}return s*t.N2},n.getPenaltyN3=function(o){const i=o.size;let s=0,l=0,a=0;for(let d=0;d<i;d++){l=a=0;for(let c=0;c<i;c++)l=l<<1&2047|o.get(d,c),c>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|o.get(c,d),c>=10&&(a===1488||a===93)&&s++}return s*t.N3},n.getPenaltyN4=function(o){let i=0;const s=o.data.length;for(let a=0;a<s;a++)i+=o.data[a];return Math.abs(Math.ceil(i*100/s/5)-10)*t.N4};function e(r,o,i){switch(r){case n.Patterns.PATTERN000:return(o+i)%2===0;case n.Patterns.PATTERN001:return o%2===0;case n.Patterns.PATTERN010:return i%3===0;case n.Patterns.PATTERN011:return(o+i)%3===0;case n.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(i/3))%2===0;case n.Patterns.PATTERN101:return o*i%2+o*i%3===0;case n.Patterns.PATTERN110:return(o*i%2+o*i%3)%2===0;case n.Patterns.PATTERN111:return(o*i%3+(o+i)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}n.applyMask=function(o,i){const s=i.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)i.isReserved(a,l)||i.xor(a,l,e(o,a,l))},n.getBestMask=function(o,i){const s=Object.keys(n.Patterns).length;let l=0,a=1/0;for(let d=0;d<s;d++){i(d),n.applyMask(d,o);const c=n.getPenaltyN1(o)+n.getPenaltyN2(o)+n.getPenaltyN3(o)+n.getPenaltyN4(o);n.applyMask(d,o),c<a&&(a=c,l=d)}return l}})(re);var st={};const _=it,tt=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],et=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];st.getBlocksCount=function(t,e){switch(e){case _.L:return tt[(t-1)*4+0];case _.M:return tt[(t-1)*4+1];case _.Q:return tt[(t-1)*4+2];case _.H:return tt[(t-1)*4+3];default:return}};st.getTotalCodewordsCount=function(t,e){switch(e){case _.L:return et[(t-1)*4+0];case _.M:return et[(t-1)*4+1];case _.Q:return et[(t-1)*4+2];case _.H:return et[(t-1)*4+3];default:return}};var ie={},at={};const G=new Uint8Array(512),ot=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)G[e]=t,ot[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)G[e]=G[e-255]})();at.log=function(t){if(t<1)throw new Error("log("+t+")");return ot[t]};at.exp=function(t){return G[t]};at.mul=function(t,e){return t===0||e===0?0:G[ot[t]+ot[e]]};(function(n){const t=at;n.mul=function(r,o){const i=new Uint8Array(r.length+o.length-1);for(let s=0;s<r.length;s++)for(let l=0;l<o.length;l++)i[s+l]^=t.mul(r[s],o[l]);return i},n.mod=function(r,o){let i=new Uint8Array(r);for(;i.length-o.length>=0;){const s=i[0];for(let a=0;a<o.length;a++)i[a]^=t.mul(o[a],s);let l=0;for(;l<i.length&&i[l]===0;)l++;i=i.slice(l)}return i},n.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let i=0;i<r;i++)o=n.mul(o,new Uint8Array([1,t.exp(i)]));return o}})(ie);const se=ie;function wt(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}wt.prototype.initialize=function(t){this.degree=t,this.genPoly=se.generateECPolynomial(this.degree)};wt.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const e=new Uint8Array(t.length+this.degree);e.set(t);const r=se.mod(e,this.genPoly),o=this.degree-r.length;if(o>0){const i=new Uint8Array(this.degree);return i.set(r,o),i}return r};var Ve=wt,ae={},k={},At={};At.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var O={};const le="[0-9]+",He="[A-Z $%*+\\-./:]+";let Z="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Z=Z.replace(/u/g,"\\u");const je="(?:(?![A-Z0-9 $%*+\\-./:]|"+Z+`)(?:.|[\r
]))+`;O.KANJI=new RegExp(Z,"g");O.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");O.BYTE=new RegExp(je,"g");O.NUMERIC=new RegExp(le,"g");O.ALPHANUMERIC=new RegExp(He,"g");const Je=new RegExp("^"+Z+"$"),Ye=new RegExp("^"+le+"$"),qe=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");O.testKanji=function(t){return Je.test(t)};O.testNumeric=function(t){return Ye.test(t)};O.testAlphanumeric=function(t){return qe.test(t)};(function(n){const t=At,e=O;n.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},n.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},n.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},n.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},n.MIXED={bit:-1},n.getCharCountIndicator=function(i,s){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?i.ccBits[0]:s<27?i.ccBits[1]:i.ccBits[2]},n.getBestModeForData=function(i){return e.testNumeric(i)?n.NUMERIC:e.testAlphanumeric(i)?n.ALPHANUMERIC:e.testKanji(i)?n.KANJI:n.BYTE},n.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},n.isValid=function(i){return i&&i.bit&&i.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return n.NUMERIC;case"alphanumeric":return n.ALPHANUMERIC;case"kanji":return n.KANJI;case"byte":return n.BYTE;default:throw new Error("Unknown mode: "+o)}}n.from=function(i,s){if(n.isValid(i))return i;try{return r(i)}catch{return s}}})(k);(function(n){const t=S,e=st,r=it,o=k,i=At,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,l=t.getBCHDigit(s);function a(u,h,p){for(let m=1;m<=40;m++)if(h<=n.getCapacity(m,p,u))return m}function d(u,h){return o.getCharCountIndicator(u,h)+4}function c(u,h){let p=0;return u.forEach(function(m){p+=d(m.mode,h)+m.getBitsLength()}),p}function f(u,h){for(let p=1;p<=40;p++)if(c(u,p)<=n.getCapacity(p,h,o.MIXED))return p}n.from=function(h,p){return i.isValid(h)?parseInt(h,10):p},n.getCapacity=function(h,p,m){if(!i.isValid(h))throw new Error("Invalid QR Code version");typeof m=="undefined"&&(m=o.BYTE);const b=t.getSymbolTotalCodewords(h),g=e.getTotalCodewordsCount(h,p),E=(b-g)*8;if(m===o.MIXED)return E;const v=E-d(m,h);switch(m){case o.NUMERIC:return Math.floor(v/10*3);case o.ALPHANUMERIC:return Math.floor(v/11*2);case o.KANJI:return Math.floor(v/13);case o.BYTE:default:return Math.floor(v/8)}},n.getBestVersionForData=function(h,p){let m;const b=r.from(p,r.M);if(Array.isArray(h)){if(h.length>1)return f(h,b);if(h.length===0)return 1;m=h[0]}else m=h;return a(m.mode,m.getLength(),b)},n.getEncodedBits=function(h){if(!i.isValid(h)||h<7)throw new Error("Invalid QR Code version");let p=h<<12;for(;t.getBCHDigit(p)-l>=0;)p^=s<<t.getBCHDigit(p)-l;return h<<12|p}})(ae);var de={};const yt=S,ce=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Ke=1<<14|1<<12|1<<10|1<<4|1<<1,Zt=yt.getBCHDigit(ce);de.getEncodedBits=function(t,e){const r=t.bit<<3|e;let o=r<<10;for(;yt.getBCHDigit(o)-Zt>=0;)o^=ce<<yt.getBCHDigit(o)-Zt;return(r<<10|o)^Ke};var ue={};const Ge=k;function H(n){this.mode=Ge.NUMERIC,this.data=n.toString()}H.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};H.prototype.getLength=function(){return this.data.length};H.prototype.getBitsLength=function(){return H.getBitsLength(this.data.length)};H.prototype.write=function(t){let e,r,o;for(e=0;e+3<=this.data.length;e+=3)r=this.data.substr(e,3),o=parseInt(r,10),t.put(o,10);const i=this.data.length-e;i>0&&(r=this.data.substr(e),o=parseInt(r,10),t.put(o,i*3+1))};var Ze=H;const Qe=k,ht=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function j(n){this.mode=Qe.ALPHANUMERIC,this.data=n}j.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};j.prototype.getLength=function(){return this.data.length};j.prototype.getBitsLength=function(){return j.getBitsLength(this.data.length)};j.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let r=ht.indexOf(this.data[e])*45;r+=ht.indexOf(this.data[e+1]),t.put(r,11)}this.data.length%2&&t.put(ht.indexOf(this.data[e]),6)};var Xe=j;const We=k;function J(n){this.mode=We.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}J.getBitsLength=function(t){return t*8};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(n){for(let t=0,e=this.data.length;t<e;t++)n.put(this.data[t],8)};var tn=J;const en=k,nn=S;function Y(n){this.mode=en.KANJI,this.data=n}Y.getBitsLength=function(t){return t*13};Y.prototype.getLength=function(){return this.data.length};Y.prototype.getBitsLength=function(){return Y.getBitsLength(this.data.length)};Y.prototype.write=function(n){let t;for(t=0;t<this.data.length;t++){let e=nn.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),n.put(e,13)}};var on=Y,he={exports:{}};(function(n){var t={single_source_shortest_paths:function(e,r,o){var i={},s={};s[r]=0;var l=t.PriorityQueue.make();l.push(r,0);for(var a,d,c,f,u,h,p,m,b;!l.empty();){a=l.pop(),d=a.value,f=a.cost,u=e[d]||{};for(c in u)u.hasOwnProperty(c)&&(h=u[c],p=f+h,m=s[c],b=typeof s[c]=="undefined",(b||m>p)&&(s[c]=p,l.push(c,p),i[c]=d))}if(typeof o!="undefined"&&typeof s[o]=="undefined"){var g=["Could not find a path from ",r," to ",o,"."].join("");throw new Error(g)}return i},extract_shortest_path_from_predecessor_list:function(e,r){for(var o=[],i=r;i;)o.push(i),e[i],i=e[i];return o.reverse(),o},find_path:function(e,r,o){var i=t.single_source_shortest_paths(e,r,o);return t.extract_shortest_path_from_predecessor_list(i,o)},PriorityQueue:{make:function(e){var r=t.PriorityQueue,o={},i;e=e||{};for(i in r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=e.sorter||r.default_sorter,o},default_sorter:function(e,r){return e.cost-r.cost},push:function(e,r){var o={value:e,cost:r};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};n.exports=t})(he);(function(n){const t=k,e=Ze,r=Xe,o=tn,i=on,s=O,l=S,a=he.exports;function d(g){return unescape(encodeURIComponent(g)).length}function c(g,E,v){const y=[];let C;for(;(C=g.exec(v))!==null;)y.push({data:C[0],index:C.index,mode:E,length:C[0].length});return y}function f(g){const E=c(s.NUMERIC,t.NUMERIC,g),v=c(s.ALPHANUMERIC,t.ALPHANUMERIC,g);let y,C;return l.isKanjiModeEnabled()?(y=c(s.BYTE,t.BYTE,g),C=c(s.KANJI,t.KANJI,g)):(y=c(s.BYTE_KANJI,t.BYTE,g),C=[]),E.concat(v,y,C).sort(function($,L){return $.index-L.index}).map(function($){return{data:$.data,mode:$.mode,length:$.length}})}function u(g,E){switch(E){case t.NUMERIC:return e.getBitsLength(g);case t.ALPHANUMERIC:return r.getBitsLength(g);case t.KANJI:return i.getBitsLength(g);case t.BYTE:return o.getBitsLength(g)}}function h(g){return g.reduce(function(E,v){const y=E.length-1>=0?E[E.length-1]:null;return y&&y.mode===v.mode?(E[E.length-1].data+=v.data,E):(E.push(v),E)},[])}function p(g){const E=[];for(let v=0;v<g.length;v++){const y=g[v];switch(y.mode){case t.NUMERIC:E.push([y,{data:y.data,mode:t.ALPHANUMERIC,length:y.length},{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.ALPHANUMERIC:E.push([y,{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.KANJI:E.push([y,{data:y.data,mode:t.BYTE,length:d(y.data)}]);break;case t.BYTE:E.push([{data:y.data,mode:t.BYTE,length:d(y.data)}])}}return E}function m(g,E){const v={},y={start:{}};let C=["start"];for(let w=0;w<g.length;w++){const $=g[w],L=[];for(let B=0;B<$.length;B++){const F=$[B],N=""+w+B;L.push(N),v[N]={node:F,lastCount:0},y[N]={};for(let I=0;I<C.length;I++){const T=C[I];v[T]&&v[T].node.mode===F.mode?(y[T][N]=u(v[T].lastCount+F.length,F.mode)-u(v[T].lastCount,F.mode),v[T].lastCount+=F.length):(v[T]&&(v[T].lastCount=F.length),y[T][N]=u(F.length,F.mode)+4+t.getCharCountIndicator(F.mode,E))}}C=L}for(let w=0;w<C.length;w++)y[C[w]].end=0;return{map:y,table:v}}function b(g,E){let v;const y=t.getBestModeForData(g);if(v=t.from(E,y),v!==t.BYTE&&v.bit<y.bit)throw new Error('"'+g+'" cannot be encoded with mode '+t.toString(v)+`.
 Suggested mode is: `+t.toString(y));switch(v===t.KANJI&&!l.isKanjiModeEnabled()&&(v=t.BYTE),v){case t.NUMERIC:return new e(g);case t.ALPHANUMERIC:return new r(g);case t.KANJI:return new i(g);case t.BYTE:return new o(g)}}n.fromArray=function(E){return E.reduce(function(v,y){return typeof y=="string"?v.push(b(y,null)):y.data&&v.push(b(y.data,y.mode)),v},[])},n.fromString=function(E,v){const y=f(E,l.isKanjiModeEnabled()),C=p(y),w=m(C,v),$=a.find_path(w.map,"start","end"),L=[];for(let B=1;B<$.length-1;B++)L.push(w.table[$[B]].node);return n.fromArray(h(L))},n.rawSplit=function(E){return n.fromArray(f(E,l.isKanjiModeEnabled()))}})(ue);const lt=S,ft=it,rn=ze,sn=_e,an=ne,ln=oe,vt=re,Et=st,dn=Ve,rt=ae,cn=de,un=k,gt=ue;function hn(n,t){const e=n.size,r=ln.getPositions(t);for(let o=0;o<r.length;o++){const i=r[o][0],s=r[o][1];for(let l=-1;l<=7;l++)if(!(i+l<=-1||e<=i+l))for(let a=-1;a<=7;a++)s+a<=-1||e<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?n.set(i+l,s+a,!0,!0):n.set(i+l,s+a,!1,!0))}}function fn(n){const t=n.size;for(let e=8;e<t-8;e++){const r=e%2===0;n.set(e,6,r,!0),n.set(6,e,r,!0)}}function gn(n,t){const e=an.getPositions(t);for(let r=0;r<e.length;r++){const o=e[r][0],i=e[r][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?n.set(o+s,i+l,!0,!0):n.set(o+s,i+l,!1,!0)}}function pn(n,t){const e=n.size,r=rt.getEncodedBits(t);let o,i,s;for(let l=0;l<18;l++)o=Math.floor(l/3),i=l%3+e-8-3,s=(r>>l&1)===1,n.set(o,i,s,!0),n.set(i,o,s,!0)}function pt(n,t,e){const r=n.size,o=cn.getEncodedBits(t,e);let i,s;for(i=0;i<15;i++)s=(o>>i&1)===1,i<6?n.set(i,8,s,!0):i<8?n.set(i+1,8,s,!0):n.set(r-15+i,8,s,!0),i<8?n.set(8,r-i-1,s,!0):i<9?n.set(8,15-i-1+1,s,!0):n.set(8,15-i-1,s,!0);n.set(r-8,8,1,!0)}function mn(n,t){const e=n.size;let r=-1,o=e-1,i=7,s=0;for(let l=e-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!n.isReserved(o,l-a)){let d=!1;s<t.length&&(d=(t[s]>>>i&1)===1),n.set(o,l-a,d),i--,i===-1&&(s++,i=7)}if(o+=r,o<0||e<=o){o-=r,r=-r;break}}}function yn(n,t,e){const r=new rn;e.forEach(function(a){r.put(a.mode.bit,4),r.put(a.getLength(),un.getCharCountIndicator(a.mode,n)),a.write(r)});const o=lt.getSymbolTotalCodewords(n),i=Et.getTotalCodewordsCount(n,t),s=(o-i)*8;for(r.getLengthInBits()+4<=s&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const l=(s-r.getLengthInBits())/8;for(let a=0;a<l;a++)r.put(a%2?17:236,8);return vn(r,n,t)}function vn(n,t,e){const r=lt.getSymbolTotalCodewords(t),o=Et.getTotalCodewordsCount(t,e),i=r-o,s=Et.getBlocksCount(t,e),l=r%s,a=s-l,d=Math.floor(r/s),c=Math.floor(i/s),f=c+1,u=d-c,h=new dn(u);let p=0;const m=new Array(s),b=new Array(s);let g=0;const E=new Uint8Array(n.buffer);for(let $=0;$<s;$++){const L=$<a?c:f;m[$]=E.slice(p,p+L),b[$]=h.encode(m[$]),p+=L,g=Math.max(g,L)}const v=new Uint8Array(r);let y=0,C,w;for(C=0;C<g;C++)for(w=0;w<s;w++)C<m[w].length&&(v[y++]=m[w][C]);for(C=0;C<u;C++)for(w=0;w<s;w++)v[y++]=b[w][C];return v}function En(n,t,e,r){let o;if(Array.isArray(n))o=gt.fromArray(n);else if(typeof n=="string"){let d=t;if(!d){const c=gt.rawSplit(n);d=rt.getBestVersionForData(c,e)}o=gt.fromString(n,d||40)}else throw new Error("Invalid data");const i=rt.getBestVersionForData(o,e);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);const s=yn(t,e,o),l=lt.getSymbolSize(t),a=new sn(l);return hn(a,t),fn(a),gn(a,t),pt(a,e,0),t>=7&&pn(a,t),mn(a,s),isNaN(r)&&(r=vt.getBestMask(a,pt.bind(null,a,e))),vt.applyMask(r,a),pt(a,e,r),{modules:a,version:t,errorCorrectionLevel:e,maskPattern:r,segments:o}}te.create=function(t,e){if(typeof t=="undefined"||t==="")throw new Error("No input text");let r=ft.M,o,i;return typeof e!="undefined"&&(r=ft.from(e.errorCorrectionLevel,ft.M),o=rt.from(e.version),i=vt.from(e.maskPattern),e.toSJISFunc&&lt.setToSJISFunction(e.toSJISFunc)),En(t,o,r,i)};var fe={},Tt={};(function(n){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let r=e.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+e);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(i){return[i,i]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}n.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin=="undefined"||r.margin===null||r.margin<0?4:r.margin,i=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:i,scale:i?4:s,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},n.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},n.getImageWidth=function(r,o){const i=n.getScale(r,o);return Math.floor((r+o.margin*2)*i)},n.qrToImageData=function(r,o,i){const s=o.modules.size,l=o.modules.data,a=n.getScale(s,i),d=Math.floor((s+i.margin*2)*a),c=i.margin*a,f=[i.color.light,i.color.dark];for(let u=0;u<d;u++)for(let h=0;h<d;h++){let p=(u*d+h)*4,m=i.color.light;if(u>=c&&h>=c&&u<d-c&&h<d-c){const b=Math.floor((u-c)/a),g=Math.floor((h-c)/a);m=f[l[b*s+g]?1:0]}r[p++]=m.r,r[p++]=m.g,r[p++]=m.b,r[p]=m.a}}})(Tt);(function(n){const t=Tt;function e(o,i,s){o.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=s,i.width=s,i.style.height=s+"px",i.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}n.render=function(i,s,l){let a=l,d=s;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(d=r()),a=t.getOptions(a);const c=t.getImageWidth(i.modules.size,a),f=d.getContext("2d"),u=f.createImageData(c,c);return t.qrToImageData(u.data,i,a),e(f,d,c),f.putImageData(u,0,0),d},n.renderToDataURL=function(i,s,l){let a=l;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const d=n.render(i,s,a),c=a.type||"image/png",f=a.rendererOpts||{};return d.toDataURL(c,f.quality)}})(fe);var ge={};const bn=Tt;function Qt(n,t){const e=n.a/255,r=t+'="'+n.hex+'"';return e<1?r+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':r}function mt(n,t,e){let r=n+t;return typeof e!="undefined"&&(r+=" "+e),r}function Cn(n,t,e){let r="",o=0,i=!1,s=0;for(let l=0;l<n.length;l++){const a=Math.floor(l%t),d=Math.floor(l/t);!a&&!i&&(i=!0),n[l]?(s++,l>0&&a>0&&n[l-1]||(r+=i?mt("M",a+e,.5+d+e):mt("m",o,0),o=0,i=!1),a+1<t&&n[l+1]||(r+=mt("h",s),s=0)):o++}return r}ge.render=function(t,e,r){const o=bn.getOptions(e),i=t.modules.size,s=t.modules.data,l=i+o.margin*2,a=o.color.light.a?"<path "+Qt(o.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",d="<path "+Qt(o.color.dark,"stroke")+' d="'+Cn(s,i,o.margin)+'"/>',c='viewBox="0 0 '+l+" "+l+'"',f=o.width?'width="'+o.width+'" height="'+o.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+f+c+' shape-rendering="crispEdges">'+a+d+`</svg>
`;return typeof r=="function"&&r(null,u),u};const wn=Oe,bt=te,pe=fe,An=ge;function $t(n,t,e,r,o){const i=[].slice.call(arguments,1),s=i.length,l=typeof i[s-1]=="function";if(!l&&!wn())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(o=e,e=t,t=r=void 0):s===3&&(t.getContext&&typeof o=="undefined"?(o=r,r=void 0):(o=r,r=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=r=void 0):s===2&&!t.getContext&&(r=e,e=t,t=void 0),new Promise(function(a,d){try{const c=bt.create(e,r);a(n(c,t,r))}catch(c){d(c)}})}try{const a=bt.create(e,r);o(null,n(a,t,r))}catch(a){o(a)}}M.create=bt.create;M.toCanvas=$t.bind(null,pe.render);M.toDataURL=$t.bind(null,pe.renderToDataURL);M.toString=$t.bind(null,function(n,t,e){return An.render(n,e)});var D={};Object.defineProperty(D,"__esModule",{value:!0});var x=D.Printd=D.createIFrame=D.createLinkStyle=D.createStyle=void 0,Tn=/^(((http[s]?)|file):)?(\/\/)+([0-9a-zA-Z-_.=?&].+)$/,$n=/^((\.|\.\.)?\/)([0-9a-zA-Z-_.=?&]+\/)*([0-9a-zA-Z-_.=?&]+)$/,Xt=function(n){return Tn.test(n)||$n.test(n)};function me(n,t){var e=n.createElement("style");return e.appendChild(n.createTextNode(t)),e}D.createStyle=me;function ye(n,t){var e=n.createElement("link");return e.type="text/css",e.rel="stylesheet",e.href=t,e}D.createLinkStyle=ye;function ve(n){var t=window.document.createElement("iframe");return t.setAttribute("src","about:blank"),t.setAttribute("style","visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;"),t.setAttribute("width","0"),t.setAttribute("height","0"),t.setAttribute("wmode","opaque"),n.appendChild(t),t}D.createIFrame=ve;var Nn={parent:window.document.body,headElements:[],bodyElements:[]},Ee=function(){function n(t){this.isLoading=!1,this.hasEvents=!1,this.opts=[Nn,t||{}].reduce(function(e,r){return Object.keys(r).forEach(function(o){return e[o]=r[o]}),e},{}),this.iframe=ve(this.opts.parent)}return n.prototype.getIFrame=function(){return this.iframe},n.prototype.print=function(t,e,r,o){if(!this.isLoading){var i=this.iframe,s=i.contentDocument,l=i.contentWindow;if(!(!s||!l)&&(this.iframe.src="about:blank",this.elCopy=t.cloneNode(!0),!!this.elCopy)){this.isLoading=!0,this.callback=o;var a=l.document;a.open(),a.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>'),this.addEvents();var d=this.opts,c=d.headElements,f=d.bodyElements;Array.isArray(c)&&c.forEach(function(u){return a.head.appendChild(u)}),Array.isArray(f)&&f.forEach(function(u){return a.body.appendChild(u)}),Array.isArray(e)&&e.forEach(function(u){u&&a.head.appendChild(Xt(u)?ye(a,u):me(a,u))}),a.body.appendChild(this.elCopy),Array.isArray(r)&&r.forEach(function(u){if(u){var h=a.createElement("script");Xt(u)?h.src=u:h.innerText=u,a.body.appendChild(h)}}),a.close()}}},n.prototype.printURL=function(t,e){this.isLoading||(this.addEvents(),this.isLoading=!0,this.callback=e,this.iframe.src=t)},n.prototype.onBeforePrint=function(t){this.onbeforeprint=t},n.prototype.onAfterPrint=function(t){this.onafterprint=t},n.prototype.launchPrint=function(t){this.isLoading||t.print()},n.prototype.addEvents=function(){var t=this;if(!this.hasEvents){this.hasEvents=!0,this.iframe.addEventListener("load",function(){return t.onLoad()},!1);var e=this.iframe.contentWindow;e&&(this.onbeforeprint&&e.addEventListener("beforeprint",this.onbeforeprint),this.onafterprint&&e.addEventListener("afterprint",this.onafterprint))}},n.prototype.onLoad=function(){var t=this;if(this.iframe){this.isLoading=!1;var e=this.iframe,r=e.contentDocument,o=e.contentWindow;if(!r||!o)return;typeof this.callback=="function"?this.callback({iframe:this.iframe,element:this.elCopy,launchPrint:function(){return t.launchPrint(o)}}):this.launchPrint(o)}},n}();x=D.Printd=Ee;D.default=Ee;class Ln{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,r=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){r=!1;break}return r?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let r=this.tens[t.charAt(0)-3];return e>0&&(r+=" y "+this.getUnits(e)),r}getHundreds(t){let e="",r=t.charAt(0),o=t.substr(1);if(t==100)return"cien";switch(r){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(r)+"cientos"),o>0&&(e+=" "+this.getName(o)),e}getThousands(t){let e="mil",r=t.length-3,o=t.substr(0,r),i=t.substr(r);return o>1&&(e=this.getName(o).replace("uno","un")+" mil"),i>0&&(e+=" "+this.getName(i)),e}getPeriod(t,e,r){let o="un "+r,i=t.length-e,s=t.substr(0,i),l=t.substr(i);return s>1&&(o=this.getName(s).replace("uno","un")+" "+r.replace("\xF3","o")+"es"),l>0&&(o+=" "+this.getName(l)),o}}var z={conversorNumerosALetras:Ln},be={};Object.defineProperty(be,"__esModule",{value:!0});function nt(n){switch(n){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function V(n,t){return t>0?n+" y "+nt(t):n}function P(n){var t=Math.floor(n/10),e=n-t*10;switch(t){case 1:switch(e){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+nt(e).toLowerCase()}case 2:switch(e){case 0:return"Veinte";default:return"Veinti"+nt(e).toLowerCase()}case 3:return V("Treinta",e);case 4:return V("Cuarenta",e);case 5:return V("Cincuenta",e);case 6:return V("Sesenta",e);case 7:return V("Setenta",e);case 8:return V("Ochenta",e);case 9:return V("Noventa",e);case 0:return nt(e);default:return""}}function Ce(n){var t=Math.floor(n/100),e=n-t*100;switch(t){case 1:return e>0?"Ciento "+P(e):"Cien";case 2:return"Doscientos "+P(e);case 3:return"Trescientos "+P(e);case 4:return"Cuatrocientos "+P(e);case 5:return"Quinientos "+P(e);case 6:return"Seiscientos "+P(e);case 7:return"Setecientos "+P(e);case 8:return"Ochocientos "+P(e);case 9:return"Novecientos "+P(e);default:return P(e)}}function we(n,t,e,r){var o=Math.floor(n/t),i=n-o*t,s="";return o>0&&(o>1?s=Ce(o)+" "+r:s=e),i>0&&(s+=""),s}function Bn(n){var t=1e3,e=Math.floor(n/t),r=n-e*t,o=we(n,t,"Un Mil","Mil"),i=Ce(r);return o===""?i:(o+" "+i).trim()}function Wt(n){var t=1e6,e=Math.floor(n/t),r=n-e*t,o=we(n,t,"Un Mill\xF3n de","Millones de"),i=Bn(r);return o===""?i:(o+" "+i).trim()}function Fn(n){var t={numero:n,enteros:Math.floor(n),centavos:Math.round(n*100)-Math.floor(n)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(Wt(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(Wt(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}be.NumerosALetras=Fn;class xn{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],r=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],o={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},i=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function s(f){if(f<10)return e[f];if(f>=10&&f<20)return o[f];if(f<100){const h=f%10;return`${r[Math.floor(f/10)]}${h>0?" y "+e[h]:""}`}if(f===100)return"cien";const u=f%100;return`${i[Math.floor(f/100)]}${u>0?" "+s(u):""}`}if(t===1e6)return"un mill\xF3n";let l=Math.floor(t/1e3),a=t%1e3,d=l>0?l===1?"mil":`${s(l)} mil`:"",c=a>0?s(a):"";return(d+" "+c).trim()}static imprimirCaja(t){}static async factura(t){return new Promise(async(e,r)=>{var o,i,s,l,a,d,c,f,u,h,p,m,b,g,E,v,y,C,w,$,L;try{const B=z.conversorNumerosALetras,F=new B,N=R().env,I=A=>Number(A||0).toFixed(2),T=A=>(A!=null?A:"").toString(),U=Number((i=(o=t.total)!=null?o:t.montoTotal)!=null?i:0),q=(a=(l=(s=t.numeroFactura)!=null?s:t.numero_factura)!=null?l:t.id)!=null?a:"\u2014",X=(d=t.fechaEmision)!=null?d:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",Ae=(u=(f=t.nombre)!=null?f:(c=t==null?void 0:t.cliente)==null?void 0:c.nombre)!=null?u:"SN",Nt=(m=(p=t.complemento)!=null?p:(h=t==null?void 0:t.cliente)==null?void 0:h.complemento)!=null?m:"",Te=(E=(g=t.ci)!=null?g:(b=t==null?void 0:t.cliente)==null?void 0:b.ci)!=null?E:"0",$e=(C=(y=t.cliente_id)!=null?y:(v=t==null?void 0:t.cliente)==null?void 0:v.id)!=null?C:"\u2014",Ne=(w=N==null?void 0:N.puntoVenta)!=null?w:0,dt=($=t.cuf)!=null?$:null,K=dt?dt.match(/.{1,20}/g).join("<br>"):null,Le=dt?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",Be=(L=t.leyenda)!=null?L:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",Fe=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],Lt=Math.floor(U),Ie=Math.round((U-Lt)*100).toString().padStart(2,"0"),Me=`Son ${F.convertToText(Lt)} ${Ie}/100 Bolivianos`;let W=null;K&&(W=await M.toDataURL(`${N.url2}consulta/QR?nit=${N.nit}&cuf=${K}&numero=${q}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let ct=`${this.head()}
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
  <div class="title fs12 center">${Le}</div>

  <div class="center small">
    ${T(N.razon)}<br>
    Casa Matriz<br>
    No. Punto de Venta ${Ne}<br>
    ${T(N.direccion)}<br>
    Tel. ${T(N.telefono)}<br>
    Oruro
  </div>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NIT</td><td class="val">${T(N.nit)}</td></tr>
    <tr><td class="lbl">FACTURA N\xB0</td><td class="val">${q}</td></tr>
    <tr><td class="lbl">C\xD3D. AUTORIZACI\xD3N</td><td class="val">${K!=null?K:"\u2014"}</td></tr>
  </table>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NOMBRE/RAZ\xD3N SOCIAL</td><td class="val">${T(Ae)}</td></tr>
    <tr><td class="lbl">NIT/CI/CEX</td><td class="val">${T(Te)}${T(Nt?"-"+Nt:"")}</td></tr>
    <tr><td class="lbl">NRO. CLIENTE</td><td class="val">${T($e)}</td></tr>
    <tr><td class="lbl">FECHA DE EMISI\xD3N</td><td class="val">${T(X)}</td></tr>
  </table>

  <hr>
  <div class="det-header center">DETALLE</div>`;Fe.forEach(A=>{var Mt,St,xt,Rt,Pt,Dt,Ot,Ut,zt,_t,kt,Vt,Ht,jt,Jt,Yt,qt,Kt;const Se=(Rt=(xt=(Mt=A.producto_id)!=null?Mt:A.product_id)!=null?xt:(St=A==null?void 0:A.producto)==null?void 0:St.id)!=null?Rt:"\u2014",xe=T((Ut=(Ot=(Pt=A.nombre)!=null?Pt:A.descripcion)!=null?Ot:(Dt=A==null?void 0:A.producto)==null?void 0:Dt.nombre)!=null?Ut:""),Re=T((kt=(_t=A.unidad)!=null?_t:(zt=A==null?void 0:A.producto)==null?void 0:zt.unidad)!=null?kt:""),Bt=Number((Ht=(Vt=A.cantidad)!=null?Vt:A.qty)!=null?Ht:0),Ft=Number((Jt=(jt=A.precio)!=null?jt:A.precioUnitario)!=null?Jt:0),It=Number((qt=(Yt=A.descuento)!=null?Yt:A.montoDescuento)!=null?qt:0),Pe=(Kt=A.subTotal)!=null?Kt:Bt*Ft-It;ct+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${Se} - ${xe}</td>
          <td class="right item-desc">${I(Pe)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Re||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${I(Bt)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${I(Ft)} - ${I(It)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),ct+=`
  <hr>
  <table class="tbl tot fs10">
    <tr><td class="l left strong">TOTAL Bs</td><td class="r strong">${I(U)}</td></tr>
    <tr><td class="l left">(-) DESCUENTO Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">SUBTOTAL A PAGAR Bs</td><td class="r strong">${I(U)}</td></tr>
    <tr><td class="l left">(-) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">MONTO TOTAL A PAGAR Bs</td><td class="r strong">${I(U)}</td></tr>
    <tr><td class="l left">(-) TASAS Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(-) OTROS PAGOS NO SUJETO IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(+) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">IMPORTE BASE CR\xC9DITO FISCAL</td><td class="r strong">${I(U)}</td></tr>
  </table>

  <div class="fs10" style="margin-top:6px;">${Me}</div>

  <hr>
  <div class="center small">
    ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY
  </div>
  <div class="center small" style="margin-top:4px;">${T(Be)}</div>
  <div class="center small" style="margin-top:4px;">\u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n en l\xEDnea\u201D</div>
  ${W?`<div class="qr"><img src="${W}" alt="QR"></div>`:""}
</div>`;const ut=document.getElementById("myElement");ut&&(ut.innerHTML=ct),new x().print(ut),e(W)}catch(B){r(B)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((r,o)=>{const i=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};R().env,M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(l=>{let a="",d="";t.producto&&(a="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(d="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let c=`${this.head()}
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
          <img  src="${l}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=c,e&&new x().print(document.getElementById("myElement")),r(l)}).catch(l=>{o(l)})})}static cotizacion(t,e,r,o,i=!0){return(o==null||o==="")&&(o=0),new Promise((s,l)=>{const a=z.conversorNumerosALetras,c=new a().convertToText(parseInt(r)),f=De().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=R().env;M.toDataURL(`Fecha: ${f} Monto: ${parseFloat(r).toFixed(2)}`,u).then(p=>{let m=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(b=>{m+=`<div style='font-size: 12px'><b> ${b.nombre} </b></div>`,m+=`<div><span style='font-size: 18px;font-weight: bold'>${b.cantidadVenta}</span> ${parseFloat(b.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(b.precioVenta*b.cantidadVenta).toFixed(2)}</span></div>`}),m+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(o).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(r-o).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${c} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${p}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=m,i&&new x().print(document.getElementById("myElement")),s(p)}).catch(p=>{l(p)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,r)=>{const o=z.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=R().env;M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(async d=>{let c=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=c,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{r(d)})})}static reportTotal(t,e){const r=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,l)=>s+l.montoTotal,0),o=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,l)=>s+l.montoTotal,0),i=r-o;return console.log("montoTotal",i),new Promise((s,l)=>{const a=z.conversorNumerosALetras,d=new a,c=Math.abs(i),f=d.convertToText(parseInt(c)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=R().env;M.toDataURL(` Monto: ${parseFloat(i).toFixed(2)}`,u).then(p=>{let m=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(g=>{m+=`<div style='font-size: 12px'><b> ${g.user.name} </b></div>`,m+=`<div> ${parseFloat(g.montoTotal).toFixed(2)} ${g.tipoVenta}
          <span style='float:right'> ${g.tipoVenta==="Egreso"?"-":""} ${parseFloat(g.montoTotal).toFixed(2)}</span></div>`}),m+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(i).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${f} ${((parseFloat(i)-Math.floor(parseFloat(i)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${p}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=m,new x().print(document.getElementById("myElement")),s(p)}).catch(p=>{l(p)})})}static reciboCompra(t){return console.log("reciboCompra",t),new Promise((e,r)=>{const o=z.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=R().env;M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(d=>{let c=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE COMPRA</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${a.direccion}<br>
    Tel. ${a.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(u=>{c+=`<div style='font-size: 12px'><b>${u.nombre} </b></div>`,c+=`<div>${u.cantidad} ${parseFloat(u.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(u.total).toFixed(2)}</span></div>`}),c+=`<hr>
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
    </html>`,document.getElementById("myElement").innerHTML=c,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{r(d)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,r)=>{const o=z.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=R().env;M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(d=>{let c=`${this.head()}
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
    </html>`,document.getElementById("myElement").innerHTML=c,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{r(d)})})}static reciboTranferencia(t,e,r,o){return console.log("producto",t,"de",e,"ha",r,"cantidad",o),new Promise((i,s)=>{const l=z.conversorNumerosALetras,d=new l().convertToText(parseInt(o)),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=R().env;M.toDataURL(`de: ${e} A: ${r}`,c).then(u=>{let h=`${this.head()}
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
    </html>`,document.getElementById("myElement").innerHTML=h,new x().print(document.getElementById("myElement")),i(u)}).catch(u=>{s(u)})})}static head(){return`<html>
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
<div style="width: 300px;">`}static async printFactura(t){var f,u;const e=z.conversorNumerosALetras,o=new e().convertToText(parseInt(t.total)),i=R().env,s=await M.toDataURL(`${i.url2}consulta/QR?nit=${i.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),l=t.online?"en":"fuera de";let a=`<style>
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
    <div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(h=>{a+=`<div style='font-size: 12px'><b>${h.id} - ${h.nombre}</b></div>
             <div>${h.cantidad} ${parseFloat(h.precio).toFixed(2)} 0.00
             <span style='float:right'>${parseFloat(h.cantidad*h.precio).toFixed(2)}</span></div>`}),a+=`<hr>
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
    \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n ${l} l\xEDnea\u201D</div>
    <div style='display: flex; justify-content: center;'>
      <img src="${s}" />
    </div>
  </div>`;const d=document.getElementById("myElement");d&&(d.innerHTML=a),new x().print(d)}static async reciboVentaSimple(t,e=!0){var r,o;try{const i=R().env||{},s=z.conversorNumerosALetras,l=new s,a=g=>Number(g||0).toFixed(2),d=(g,E="\u2014")=>(g!=null?g:E).toString(),c=Number((r=t.total)!=null?r:0),f=Math.floor(c),u=Math.round((c-f)*100).toString().padStart(2,"0"),h=`Son ${l.convertToText(f)} ${u}/100 Bolivianos`,p=Array.isArray(t.venta_detalles)?t.venta_detalles:[];let m=`
<style>
  .ticket { width:300px; margin:0 auto; font-family: "Courier New", Courier, monospace; font-size:10px; }
  .center{ text-align:center; } .right{ text-align:right; } .left{ text-align:left; }
  .bold{ font-weight:700; } .mt4{ margin-top:4px; } .mt6{ margin-top:6px; }
  hr{ border:0; border-top:1px dashed #000; margin:6px 0; }
  table{ width:100%; border-collapse:collapse; }
  td{ vertical-align:top; padding:1px 0; }
  .row { display:flex; justify-content:space-between; }
  .small{ font-size:9px; line-height:1.2; }
  @page { margin: 6mm; }
</style>

<div class="ticket">
  <div class="center bold" style="font-size:12px;">RECIBO DE VENTA</div>
  <div class="center small">
    ${d(i.razon,"\u2014")}<br>
    ${d(i.direccion,"")}<br>
    Tel. ${d(i.telefono,"")} \xB7 Oruro
  </div>

  <hr>

  <table>
    <tr><td class="bold">Nro:</td><td>${d(t.id)}</td></tr>
    <tr><td class="bold">Fecha/Hora:</td><td>${d(t.fecha)} ${d(t.hora,"")}</td></tr>
    <tr><td class="bold">Usuario:</td><td>${d((o=t.user)==null?void 0:o.name,"")}</td></tr>
    <tr><td class="bold">Tipo venta:</td><td>${d(t.tipo_venta,"")}</td></tr>
    <tr><td class="bold">Pago:</td><td>${d(t.tipo_pago,"")}</td></tr>
  </table>

  <hr>

  <table>
    <tr class="bold"><td>Detalle</td><td class="right">Subt.</td></tr>`;p.forEach(g=>{var L,B,F,N,I,T,U,q,X;const E=d((F=(B=(L=g.producto)==null?void 0:L.nombre)!=null?B:g.nombre)!=null?F:""),v=Number(g.cantidad||0),y=Number(g.precio||0),C=v*y,w=d((T=(I=g.unidad)!=null?I:(N=g.producto)==null?void 0:N.unidad)!=null?T:""),$=d((X=(q=g.producto_id)!=null?q:(U=g.producto)==null?void 0:U.id)!=null?X:"");m+=`
    <tr>
      <td>
        <div class="bold">${$?$+" - ":""}${E}</div>
        <div class="small">${w?"UM: "+w+" \xB7 ":""}${a(v)} x ${a(y)}</div>
      </td>
      <td class="right bold">${a(C)}</td>
    </tr>`}),m+=`
  </table>

  <hr>

  <table>
    <tr><td class="bold">TOTAL (Bs)</td><td class="right bold">${a(c)}</td></tr>
  </table>

  <div class="mt6">${h}</div>

  <hr>

  <div class="center small">
    \xA1Gracias por su compra!
  </div>
</div>`;const b=document.getElementById("myElement");return b&&(b.innerHTML=m),e&&new x().print(b),!0}catch(i){throw console.error("reciboVentaSimple error:",i),i}}}export{xn as I};
