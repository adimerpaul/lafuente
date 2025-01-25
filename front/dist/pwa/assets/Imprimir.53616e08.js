import{u as x}from"./index.529007dd.js";import{h as Yt}from"./moment.d090e81d.js";var M={},Kt=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},wt={},A={};let ut;const jt=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];A.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};A.getSymbolTotalCodewords=function(t){return jt[t]};A.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t};A.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');ut=t};A.isKanjiModeEnabled=function(){return typeof ut!="undefined"};A.toSJIS=function(t){return ut(t)};var Z={};(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+n)}}e.isValid=function(r){return r&&typeof r.bit!="undefined"&&r.bit>=0&&r.bit<4},e.from=function(r,o){if(e.isValid(r))return r;try{return t(r)}catch{return o}}})(Z);function bt(){this.buffer=[],this.length=0}bt.prototype={get:function(e){const t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)===1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var Jt=bt;function K(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}K.prototype.set=function(e,t,n,r){const o=e*this.size+t;this.data[o]=n,r&&(this.reservedBit[o]=!0)};K.prototype.get=function(e,t){return this.data[e*this.size+t]};K.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n};K.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]};var Gt=K,Tt={};(function(e){const t=A.getSymbolSize;e.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,i=t(r),s=i===145?26:Math.ceil((i-13)/(2*o-2))*2,l=[i-7];for(let a=1;a<o-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},e.getPositions=function(r){const o=[],i=e.getRowColCoords(r),s=i.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||o.push([i[l],i[a]]);return o}})(Tt);var At={};const qt=A.getSymbolSize,pt=7;At.getPositions=function(t){const n=qt(t);return[[0,0],[n-pt,0],[0,n-pt]]};var Bt={};(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},e.from=function(o){return e.isValid(o)?parseInt(o,10):void 0},e.getPenaltyN1=function(o){const i=o.size;let s=0,l=0,a=0,c=null,d=null;for(let h=0;h<i;h++){l=a=0,c=d=null;for(let u=0;u<i;u++){let f=o.get(h,u);f===c?l++:(l>=5&&(s+=t.N1+(l-5)),c=f,l=1),f=o.get(u,h),f===d?a++:(a>=5&&(s+=t.N1+(a-5)),d=f,a=1)}l>=5&&(s+=t.N1+(l-5)),a>=5&&(s+=t.N1+(a-5))}return s},e.getPenaltyN2=function(o){const i=o.size;let s=0;for(let l=0;l<i-1;l++)for(let a=0;a<i-1;a++){const c=o.get(l,a)+o.get(l,a+1)+o.get(l+1,a)+o.get(l+1,a+1);(c===4||c===0)&&s++}return s*t.N2},e.getPenaltyN3=function(o){const i=o.size;let s=0,l=0,a=0;for(let c=0;c<i;c++){l=a=0;for(let d=0;d<i;d++)l=l<<1&2047|o.get(c,d),d>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|o.get(d,c),d>=10&&(a===1488||a===93)&&s++}return s*t.N3},e.getPenaltyN4=function(o){let i=0;const s=o.data.length;for(let a=0;a<s;a++)i+=o.data[a];return Math.abs(Math.ceil(i*100/s/5)-10)*t.N4};function n(r,o,i){switch(r){case e.Patterns.PATTERN000:return(o+i)%2===0;case e.Patterns.PATTERN001:return o%2===0;case e.Patterns.PATTERN010:return i%3===0;case e.Patterns.PATTERN011:return(o+i)%3===0;case e.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(i/3))%2===0;case e.Patterns.PATTERN101:return o*i%2+o*i%3===0;case e.Patterns.PATTERN110:return(o*i%2+o*i%3)%2===0;case e.Patterns.PATTERN111:return(o*i%3+(o+i)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}e.applyMask=function(o,i){const s=i.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)i.isReserved(a,l)||i.xor(a,l,n(o,a,l))},e.getBestMask=function(o,i){const s=Object.keys(e.Patterns).length;let l=0,a=1/0;for(let c=0;c<s;c++){i(c),e.applyMask(c,o);const d=e.getPenaltyN1(o)+e.getPenaltyN2(o)+e.getPenaltyN3(o)+e.getPenaltyN4(o);e.applyMask(c,o),d<a&&(a=d,l=c)}return l}})(Bt);var X={};const R=Z,j=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],J=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];X.getBlocksCount=function(t,n){switch(n){case R.L:return j[(t-1)*4+0];case R.M:return j[(t-1)*4+1];case R.Q:return j[(t-1)*4+2];case R.H:return j[(t-1)*4+3];default:return}};X.getTotalCodewordsCount=function(t,n){switch(n){case R.L:return J[(t-1)*4+0];case R.M:return J[(t-1)*4+1];case R.Q:return J[(t-1)*4+2];case R.H:return J[(t-1)*4+3];default:return}};var Mt={},W={};const H=new Uint8Array(512),q=new Uint8Array(256);(function(){let t=1;for(let n=0;n<255;n++)H[n]=t,q[t]=n,t<<=1,t&256&&(t^=285);for(let n=255;n<512;n++)H[n]=H[n-255]})();W.log=function(t){if(t<1)throw new Error("log("+t+")");return q[t]};W.exp=function(t){return H[t]};W.mul=function(t,n){return t===0||n===0?0:H[q[t]+q[n]]};(function(e){const t=W;e.mul=function(r,o){const i=new Uint8Array(r.length+o.length-1);for(let s=0;s<r.length;s++)for(let l=0;l<o.length;l++)i[s+l]^=t.mul(r[s],o[l]);return i},e.mod=function(r,o){let i=new Uint8Array(r);for(;i.length-o.length>=0;){const s=i[0];for(let a=0;a<o.length;a++)i[a]^=t.mul(o[a],s);let l=0;for(;l<i.length&&i[l]===0;)l++;i=i.slice(l)}return i},e.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let i=0;i<r;i++)o=e.mul(o,new Uint8Array([1,t.exp(i)]));return o}})(Mt);const Ft=Mt;function ft(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}ft.prototype.initialize=function(t){this.degree=t,this.genPoly=Ft.generateECPolynomial(this.degree)};ft.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(t.length+this.degree);n.set(t);const r=Ft.mod(n,this.genPoly),o=this.degree-r.length;if(o>0){const i=new Uint8Array(this.degree);return i.set(r,o),i}return r};var Qt=ft,It={},D={},ht={};ht.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var N={};const Lt="[0-9]+",Zt="[A-Z $%*+\\-./:]+";let Y="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Y=Y.replace(/u/g,"\\u");const Xt="(?:(?![A-Z0-9 $%*+\\-./:]|"+Y+`)(?:.|[\r
]))+`;N.KANJI=new RegExp(Y,"g");N.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");N.BYTE=new RegExp(Xt,"g");N.NUMERIC=new RegExp(Lt,"g");N.ALPHANUMERIC=new RegExp(Zt,"g");const Wt=new RegExp("^"+Y+"$"),te=new RegExp("^"+Lt+"$"),ee=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");N.testKanji=function(t){return Wt.test(t)};N.testNumeric=function(t){return te.test(t)};N.testAlphanumeric=function(t){return ee.test(t)};(function(e){const t=ht,n=N;e.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(i,s){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?i.ccBits[0]:s<27?i.ccBits[1]:i.ccBits[2]},e.getBestModeForData=function(i){return n.testNumeric(i)?e.NUMERIC:n.testAlphanumeric(i)?e.ALPHANUMERIC:n.testKanji(i)?e.KANJI:e.BYTE},e.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},e.isValid=function(i){return i&&i.bit&&i.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+o)}}e.from=function(i,s){if(e.isValid(i))return i;try{return r(i)}catch{return s}}})(D);(function(e){const t=A,n=X,r=Z,o=D,i=ht,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,l=t.getBCHDigit(s);function a(u,f,g){for(let p=1;p<=40;p++)if(f<=e.getCapacity(p,g,u))return p}function c(u,f){return o.getCharCountIndicator(u,f)+4}function d(u,f){let g=0;return u.forEach(function(p){g+=c(p.mode,f)+p.getBitsLength()}),g}function h(u,f){for(let g=1;g<=40;g++)if(d(u,g)<=e.getCapacity(g,f,o.MIXED))return g}e.from=function(f,g){return i.isValid(f)?parseInt(f,10):g},e.getCapacity=function(f,g,p){if(!i.isValid(f))throw new Error("Invalid QR Code version");typeof p=="undefined"&&(p=o.BYTE);const w=t.getSymbolTotalCodewords(f),m=n.getTotalCodewordsCount(f,g),E=(w-m)*8;if(p===o.MIXED)return E;const v=E-c(p,f);switch(p){case o.NUMERIC:return Math.floor(v/10*3);case o.ALPHANUMERIC:return Math.floor(v/11*2);case o.KANJI:return Math.floor(v/13);case o.BYTE:default:return Math.floor(v/8)}},e.getBestVersionForData=function(f,g){let p;const w=r.from(g,r.M);if(Array.isArray(f)){if(f.length>1)return h(f,w);if(f.length===0)return 1;p=f[0]}else p=f;return a(p.mode,p.getLength(),w)},e.getEncodedBits=function(f){if(!i.isValid(f)||f<7)throw new Error("Invalid QR Code version");let g=f<<12;for(;t.getBCHDigit(g)-l>=0;)g^=s<<t.getBCHDigit(g)-l;return f<<12|g}})(It);var Nt={};const at=A,$t=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,ne=1<<14|1<<12|1<<10|1<<4|1<<1,yt=at.getBCHDigit($t);Nt.getEncodedBits=function(t,n){const r=t.bit<<3|n;let o=r<<10;for(;at.getBCHDigit(o)-yt>=0;)o^=$t<<at.getBCHDigit(o)-yt;return(r<<10|o)^ne};var St={};const oe=D;function U(e){this.mode=oe.NUMERIC,this.data=e.toString()}U.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};U.prototype.getLength=function(){return this.data.length};U.prototype.getBitsLength=function(){return U.getBitsLength(this.data.length)};U.prototype.write=function(t){let n,r,o;for(n=0;n+3<=this.data.length;n+=3)r=this.data.substr(n,3),o=parseInt(r,10),t.put(o,10);const i=this.data.length-n;i>0&&(r=this.data.substr(n),o=parseInt(r,10),t.put(o,i*3+1))};var re=U;const ie=D,nt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function z(e){this.mode=ie.ALPHANUMERIC,this.data=e}z.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};z.prototype.getLength=function(){return this.data.length};z.prototype.getBitsLength=function(){return z.getBitsLength(this.data.length)};z.prototype.write=function(t){let n;for(n=0;n+2<=this.data.length;n+=2){let r=nt.indexOf(this.data[n])*45;r+=nt.indexOf(this.data[n+1]),t.put(r,11)}this.data.length%2&&t.put(nt.indexOf(this.data[n]),6)};var se=z;const ae=D;function _(e){this.mode=ae.BYTE,typeof e=="string"?this.data=new TextEncoder().encode(e):this.data=new Uint8Array(e)}_.getBitsLength=function(t){return t*8};_.prototype.getLength=function(){return this.data.length};_.prototype.getBitsLength=function(){return _.getBitsLength(this.data.length)};_.prototype.write=function(e){for(let t=0,n=this.data.length;t<n;t++)e.put(this.data[t],8)};var le=_;const de=D,ce=A;function k(e){this.mode=de.KANJI,this.data=e}k.getBitsLength=function(t){return t*13};k.prototype.getLength=function(){return this.data.length};k.prototype.getBitsLength=function(){return k.getBitsLength(this.data.length)};k.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let n=ce.toSJIS(this.data[t]);if(n>=33088&&n<=40956)n-=33088;else if(n>=57408&&n<=60351)n-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);n=(n>>>8&255)*192+(n&255),e.put(n,13)}};var ue=k,Pt={exports:{}};(function(e){var t={single_source_shortest_paths:function(n,r,o){var i={},s={};s[r]=0;var l=t.PriorityQueue.make();l.push(r,0);for(var a,c,d,h,u,f,g,p,w;!l.empty();){a=l.pop(),c=a.value,h=a.cost,u=n[c]||{};for(d in u)u.hasOwnProperty(d)&&(f=u[d],g=h+f,p=s[d],w=typeof s[d]=="undefined",(w||p>g)&&(s[d]=g,l.push(d,g),i[d]=c))}if(typeof o!="undefined"&&typeof s[o]=="undefined"){var m=["Could not find a path from ",r," to ",o,"."].join("");throw new Error(m)}return i},extract_shortest_path_from_predecessor_list:function(n,r){for(var o=[],i=r;i;)o.push(i),n[i],i=n[i];return o.reverse(),o},find_path:function(n,r,o){var i=t.single_source_shortest_paths(n,r,o);return t.extract_shortest_path_from_predecessor_list(i,o)},PriorityQueue:{make:function(n){var r=t.PriorityQueue,o={},i;n=n||{};for(i in r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=n.sorter||r.default_sorter,o},default_sorter:function(n,r){return n.cost-r.cost},push:function(n,r){var o={value:n,cost:r};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(Pt);(function(e){const t=D,n=re,r=se,o=le,i=ue,s=N,l=A,a=Pt.exports;function c(m){return unescape(encodeURIComponent(m)).length}function d(m,E,v){const y=[];let C;for(;(C=m.exec(v))!==null;)y.push({data:C[0],index:C.index,mode:E,length:C[0].length});return y}function h(m){const E=d(s.NUMERIC,t.NUMERIC,m),v=d(s.ALPHANUMERIC,t.ALPHANUMERIC,m);let y,C;return l.isKanjiModeEnabled()?(y=d(s.BYTE,t.BYTE,m),C=d(s.KANJI,t.KANJI,m)):(y=d(s.BYTE_KANJI,t.BYTE,m),C=[]),E.concat(v,y,C).sort(function(T,B){return T.index-B.index}).map(function(T){return{data:T.data,mode:T.mode,length:T.length}})}function u(m,E){switch(E){case t.NUMERIC:return n.getBitsLength(m);case t.ALPHANUMERIC:return r.getBitsLength(m);case t.KANJI:return i.getBitsLength(m);case t.BYTE:return o.getBitsLength(m)}}function f(m){return m.reduce(function(E,v){const y=E.length-1>=0?E[E.length-1]:null;return y&&y.mode===v.mode?(E[E.length-1].data+=v.data,E):(E.push(v),E)},[])}function g(m){const E=[];for(let v=0;v<m.length;v++){const y=m[v];switch(y.mode){case t.NUMERIC:E.push([y,{data:y.data,mode:t.ALPHANUMERIC,length:y.length},{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.ALPHANUMERIC:E.push([y,{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.KANJI:E.push([y,{data:y.data,mode:t.BYTE,length:c(y.data)}]);break;case t.BYTE:E.push([{data:y.data,mode:t.BYTE,length:c(y.data)}])}}return E}function p(m,E){const v={},y={start:{}};let C=["start"];for(let b=0;b<m.length;b++){const T=m[b],B=[];for(let S=0;S<T.length;S++){const F=T[S],V=""+b+S;B.push(V),v[V]={node:F,lastCount:0},y[V]={};for(let et=0;et<C.length;et++){const $=C[et];v[$]&&v[$].node.mode===F.mode?(y[$][V]=u(v[$].lastCount+F.length,F.mode)-u(v[$].lastCount,F.mode),v[$].lastCount+=F.length):(v[$]&&(v[$].lastCount=F.length),y[$][V]=u(F.length,F.mode)+4+t.getCharCountIndicator(F.mode,E))}}C=B}for(let b=0;b<C.length;b++)y[C[b]].end=0;return{map:y,table:v}}function w(m,E){let v;const y=t.getBestModeForData(m);if(v=t.from(E,y),v!==t.BYTE&&v.bit<y.bit)throw new Error('"'+m+'" cannot be encoded with mode '+t.toString(v)+`.
 Suggested mode is: `+t.toString(y));switch(v===t.KANJI&&!l.isKanjiModeEnabled()&&(v=t.BYTE),v){case t.NUMERIC:return new n(m);case t.ALPHANUMERIC:return new r(m);case t.KANJI:return new i(m);case t.BYTE:return new o(m)}}e.fromArray=function(E){return E.reduce(function(v,y){return typeof y=="string"?v.push(w(y,null)):y.data&&v.push(w(y.data,y.mode)),v},[])},e.fromString=function(E,v){const y=h(E,l.isKanjiModeEnabled()),C=g(y),b=p(C,v),T=a.find_path(b.map,"start","end"),B=[];for(let S=1;S<T.length-1;S++)B.push(b.table[T[S]].node);return e.fromArray(f(B))},e.rawSplit=function(E){return e.fromArray(h(E,l.isKanjiModeEnabled()))}})(St);const tt=A,ot=Z,fe=Jt,he=Gt,ge=Tt,me=At,lt=Bt,dt=X,pe=Qt,Q=It,ye=Nt,ve=D,rt=St;function Ee(e,t){const n=e.size,r=me.getPositions(t);for(let o=0;o<r.length;o++){const i=r[o][0],s=r[o][1];for(let l=-1;l<=7;l++)if(!(i+l<=-1||n<=i+l))for(let a=-1;a<=7;a++)s+a<=-1||n<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?e.set(i+l,s+a,!0,!0):e.set(i+l,s+a,!1,!0))}}function Ce(e){const t=e.size;for(let n=8;n<t-8;n++){const r=n%2===0;e.set(n,6,r,!0),e.set(6,n,r,!0)}}function we(e,t){const n=ge.getPositions(t);for(let r=0;r<n.length;r++){const o=n[r][0],i=n[r][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?e.set(o+s,i+l,!0,!0):e.set(o+s,i+l,!1,!0)}}function be(e,t){const n=e.size,r=Q.getEncodedBits(t);let o,i,s;for(let l=0;l<18;l++)o=Math.floor(l/3),i=l%3+n-8-3,s=(r>>l&1)===1,e.set(o,i,s,!0),e.set(i,o,s,!0)}function it(e,t,n){const r=e.size,o=ye.getEncodedBits(t,n);let i,s;for(i=0;i<15;i++)s=(o>>i&1)===1,i<6?e.set(i,8,s,!0):i<8?e.set(i+1,8,s,!0):e.set(r-15+i,8,s,!0),i<8?e.set(8,r-i-1,s,!0):i<9?e.set(8,15-i-1+1,s,!0):e.set(8,15-i-1,s,!0);e.set(r-8,8,1,!0)}function Te(e,t){const n=e.size;let r=-1,o=n-1,i=7,s=0;for(let l=n-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!e.isReserved(o,l-a)){let c=!1;s<t.length&&(c=(t[s]>>>i&1)===1),e.set(o,l-a,c),i--,i===-1&&(s++,i=7)}if(o+=r,o<0||n<=o){o-=r,r=-r;break}}}function Ae(e,t,n){const r=new fe;n.forEach(function(a){r.put(a.mode.bit,4),r.put(a.getLength(),ve.getCharCountIndicator(a.mode,e)),a.write(r)});const o=tt.getSymbolTotalCodewords(e),i=dt.getTotalCodewordsCount(e,t),s=(o-i)*8;for(r.getLengthInBits()+4<=s&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const l=(s-r.getLengthInBits())/8;for(let a=0;a<l;a++)r.put(a%2?17:236,8);return Be(r,e,t)}function Be(e,t,n){const r=tt.getSymbolTotalCodewords(t),o=dt.getTotalCodewordsCount(t,n),i=r-o,s=dt.getBlocksCount(t,n),l=r%s,a=s-l,c=Math.floor(r/s),d=Math.floor(i/s),h=d+1,u=c-d,f=new pe(u);let g=0;const p=new Array(s),w=new Array(s);let m=0;const E=new Uint8Array(e.buffer);for(let T=0;T<s;T++){const B=T<a?d:h;p[T]=E.slice(g,g+B),w[T]=f.encode(p[T]),g+=B,m=Math.max(m,B)}const v=new Uint8Array(r);let y=0,C,b;for(C=0;C<m;C++)for(b=0;b<s;b++)C<p[b].length&&(v[y++]=p[b][C]);for(C=0;C<u;C++)for(b=0;b<s;b++)v[y++]=w[b][C];return v}function Me(e,t,n,r){let o;if(Array.isArray(e))o=rt.fromArray(e);else if(typeof e=="string"){let c=t;if(!c){const d=rt.rawSplit(e);c=Q.getBestVersionForData(d,n)}o=rt.fromString(e,c||40)}else throw new Error("Invalid data");const i=Q.getBestVersionForData(o,n);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);const s=Ae(t,n,o),l=tt.getSymbolSize(t),a=new he(l);return Ee(a,t),Ce(a),we(a,t),it(a,n,0),t>=7&&be(a,t),Te(a,s),isNaN(r)&&(r=lt.getBestMask(a,it.bind(null,a,n))),lt.applyMask(r,a),it(a,n,r),{modules:a,version:t,errorCorrectionLevel:n,maskPattern:r,segments:o}}wt.create=function(t,n){if(typeof t=="undefined"||t==="")throw new Error("No input text");let r=ot.M,o,i;return typeof n!="undefined"&&(r=ot.from(n.errorCorrectionLevel,ot.M),o=Q.from(n.version),i=lt.from(n.maskPattern),n.toSJISFunc&&tt.setToSJISFunction(n.toSJISFunc)),Me(t,o,r,i)};var Rt={},gt={};(function(e){function t(n){if(typeof n=="number"&&(n=n.toString()),typeof n!="string")throw new Error("Color should be defined as hex string");let r=n.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+n);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(i){return[i,i]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}e.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin=="undefined"||r.margin===null||r.margin<0?4:r.margin,i=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:i,scale:i?4:s,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},e.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},e.getImageWidth=function(r,o){const i=e.getScale(r,o);return Math.floor((r+o.margin*2)*i)},e.qrToImageData=function(r,o,i){const s=o.modules.size,l=o.modules.data,a=e.getScale(s,i),c=Math.floor((s+i.margin*2)*a),d=i.margin*a,h=[i.color.light,i.color.dark];for(let u=0;u<c;u++)for(let f=0;f<c;f++){let g=(u*c+f)*4,p=i.color.light;if(u>=d&&f>=d&&u<c-d&&f<c-d){const w=Math.floor((u-d)/a),m=Math.floor((f-d)/a);p=h[l[w*s+m]?1:0]}r[g++]=p.r,r[g++]=p.g,r[g++]=p.b,r[g]=p.a}}})(gt);(function(e){const t=gt;function n(o,i,s){o.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=s,i.width=s,i.style.height=s+"px",i.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(i,s,l){let a=l,c=s;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(c=r()),a=t.getOptions(a);const d=t.getImageWidth(i.modules.size,a),h=c.getContext("2d"),u=h.createImageData(d,d);return t.qrToImageData(u.data,i,a),n(h,c,d),h.putImageData(u,0,0),c},e.renderToDataURL=function(i,s,l){let a=l;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const c=e.render(i,s,a),d=a.type||"image/png",h=a.rendererOpts||{};return c.toDataURL(d,h.quality)}})(Rt);var Dt={};const Fe=gt;function vt(e,t){const n=e.a/255,r=t+'="'+e.hex+'"';return n<1?r+" "+t+'-opacity="'+n.toFixed(2).slice(1)+'"':r}function st(e,t,n){let r=e+t;return typeof n!="undefined"&&(r+=" "+n),r}function Ie(e,t,n){let r="",o=0,i=!1,s=0;for(let l=0;l<e.length;l++){const a=Math.floor(l%t),c=Math.floor(l/t);!a&&!i&&(i=!0),e[l]?(s++,l>0&&a>0&&e[l-1]||(r+=i?st("M",a+n,.5+c+n):st("m",o,0),o=0,i=!1),a+1<t&&e[l+1]||(r+=st("h",s),s=0)):o++}return r}Dt.render=function(t,n,r){const o=Fe.getOptions(n),i=t.modules.size,s=t.modules.data,l=i+o.margin*2,a=o.color.light.a?"<path "+vt(o.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",c="<path "+vt(o.color.dark,"stroke")+' d="'+Ie(s,i,o.margin)+'"/>',d='viewBox="0 0 '+l+" "+l+'"',h=o.width?'width="'+o.width+'" height="'+o.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+h+d+' shape-rendering="crispEdges">'+a+c+`</svg>
`;return typeof r=="function"&&r(null,u),u};const Le=Kt,ct=wt,xt=Rt,Ne=Dt;function mt(e,t,n,r,o){const i=[].slice.call(arguments,1),s=i.length,l=typeof i[s-1]=="function";if(!l&&!Le())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(o=n,n=t,t=r=void 0):s===3&&(t.getContext&&typeof o=="undefined"?(o=r,r=void 0):(o=r,r=n,n=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(n=t,t=r=void 0):s===2&&!t.getContext&&(r=n,n=t,t=void 0),new Promise(function(a,c){try{const d=ct.create(n,r);a(e(d,t,r))}catch(d){c(d)}})}try{const a=ct.create(n,r);o(null,e(a,t,r))}catch(a){o(a)}}M.create=ct.create;M.toCanvas=mt.bind(null,xt.render);M.toDataURL=mt.bind(null,xt.renderToDataURL);M.toString=mt.bind(null,function(e,t,n){return Ne.render(e,n)});var L={};Object.defineProperty(L,"__esModule",{value:!0});var P=L.Printd=L.createIFrame=L.createLinkStyle=L.createStyle=void 0,$e=/^(((http[s]?)|file):)?(\/\/)+([0-9a-zA-Z-_.=?&].+)$/,Se=/^((\.|\.\.)?\/)([0-9a-zA-Z-_.=?&]+\/)*([0-9a-zA-Z-_.=?&]+)$/,Et=function(e){return $e.test(e)||Se.test(e)};function Ot(e,t){var n=e.createElement("style");return n.appendChild(e.createTextNode(t)),n}L.createStyle=Ot;function Ut(e,t){var n=e.createElement("link");return n.type="text/css",n.rel="stylesheet",n.href=t,n}L.createLinkStyle=Ut;function zt(e){var t=window.document.createElement("iframe");return t.setAttribute("src","about:blank"),t.setAttribute("style","visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;"),t.setAttribute("width","0"),t.setAttribute("height","0"),t.setAttribute("wmode","opaque"),e.appendChild(t),t}L.createIFrame=zt;var Pe={parent:window.document.body,headElements:[],bodyElements:[]},_t=function(){function e(t){this.isLoading=!1,this.hasEvents=!1,this.opts=[Pe,t||{}].reduce(function(n,r){return Object.keys(r).forEach(function(o){return n[o]=r[o]}),n},{}),this.iframe=zt(this.opts.parent)}return e.prototype.getIFrame=function(){return this.iframe},e.prototype.print=function(t,n,r,o){if(!this.isLoading){var i=this.iframe,s=i.contentDocument,l=i.contentWindow;if(!(!s||!l)&&(this.iframe.src="about:blank",this.elCopy=t.cloneNode(!0),!!this.elCopy)){this.isLoading=!0,this.callback=o;var a=l.document;a.open(),a.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>'),this.addEvents();var c=this.opts,d=c.headElements,h=c.bodyElements;Array.isArray(d)&&d.forEach(function(u){return a.head.appendChild(u)}),Array.isArray(h)&&h.forEach(function(u){return a.body.appendChild(u)}),Array.isArray(n)&&n.forEach(function(u){u&&a.head.appendChild(Et(u)?Ut(a,u):Ot(a,u))}),a.body.appendChild(this.elCopy),Array.isArray(r)&&r.forEach(function(u){if(u){var f=a.createElement("script");Et(u)?f.src=u:f.innerText=u,a.body.appendChild(f)}}),a.close()}}},e.prototype.printURL=function(t,n){this.isLoading||(this.addEvents(),this.isLoading=!0,this.callback=n,this.iframe.src=t)},e.prototype.onBeforePrint=function(t){this.onbeforeprint=t},e.prototype.onAfterPrint=function(t){this.onafterprint=t},e.prototype.launchPrint=function(t){this.isLoading||t.print()},e.prototype.addEvents=function(){var t=this;if(!this.hasEvents){this.hasEvents=!0,this.iframe.addEventListener("load",function(){return t.onLoad()},!1);var n=this.iframe.contentWindow;n&&(this.onbeforeprint&&n.addEventListener("beforeprint",this.onbeforeprint),this.onafterprint&&n.addEventListener("afterprint",this.onafterprint))}},e.prototype.onLoad=function(){var t=this;if(this.iframe){this.isLoading=!1;var n=this.iframe,r=n.contentDocument,o=n.contentWindow;if(!r||!o)return;typeof this.callback=="function"?this.callback({iframe:this.iframe,element:this.elCopy,launchPrint:function(){return t.launchPrint(o)}}):this.launchPrint(o)}},e}();P=L.Printd=_t;L.default=_t;var kt={};Object.defineProperty(kt,"__esModule",{value:!0});function G(e){switch(e){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function O(e,t){return t>0?e+" y "+G(t):e}function I(e){var t=Math.floor(e/10),n=e-t*10;switch(t){case 1:switch(n){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+G(n).toLowerCase()}case 2:switch(n){case 0:return"Veinte";default:return"Veinti"+G(n).toLowerCase()}case 3:return O("Treinta",n);case 4:return O("Cuarenta",n);case 5:return O("Cincuenta",n);case 6:return O("Sesenta",n);case 7:return O("Setenta",n);case 8:return O("Ochenta",n);case 9:return O("Noventa",n);case 0:return G(n);default:return""}}function Vt(e){var t=Math.floor(e/100),n=e-t*100;switch(t){case 1:return n>0?"Ciento "+I(n):"Cien";case 2:return"Doscientos "+I(n);case 3:return"Trescientos "+I(n);case 4:return"Cuatrocientos "+I(n);case 5:return"Quinientos "+I(n);case 6:return"Seiscientos "+I(n);case 7:return"Setecientos "+I(n);case 8:return"Ochocientos "+I(n);case 9:return"Novecientos "+I(n);default:return I(n)}}function Ht(e,t,n,r){var o=Math.floor(e/t),i=e-o*t,s="";return o>0&&(o>1?s=Vt(o)+" "+r:s=n),i>0&&(s+=""),s}function Re(e){var t=1e3,n=Math.floor(e/t),r=e-n*t,o=Ht(e,t,"Un Mil","Mil"),i=Vt(r);return o===""?i:(o+" "+i).trim()}function Ct(e){var t=1e6,n=Math.floor(e/t),r=e-n*t,o=Ht(e,t,"Un Mill\xF3n de","Millones de"),i=Re(r);return o===""?i:(o+" "+i).trim()}function De(e){var t={numero:e,enteros:Math.floor(e),centavos:Math.round(e*100)-Math.floor(e)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(Ct(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(Ct(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}kt.NumerosALetras=De;class Ue{static numeroALetras(t){const n=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],r=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],o={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"};if(t<10)return n[t];if(t>=10&&t<20)return o[t];if(t<100){const i=t%10;return`${r[Math.floor(t/10)]}${i>0?" y "+n[i]:""}`}return"N\xFAmero muy grande"}static factura(t){return new Promise((n,r)=>{const o=conversor.conversorNumerosALetras,s=new o().convertToText(parseInt(t.montoTotal)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;M.toDataURL(a.url2+"consulta/QR?nit="+a.nit+"&cuf="+t.cuf+"&numero="+t.numeroFactura+"&t=2",l).then(c=>{let d=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
      <div class='titulo'>FACTURA <br>CON DERECHO A CREDITO FISCAL</div>
      <div class='titulo2'>${a.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${a.direccion}<br>
Tel. ${a.telefono}<br>
Oruro</div>
<hr>
<div class='titulo'>NIT</div>
<div class='titulo2'>${a.nit}</div>
<div class='titulo'>FACTURA N\xB0</div>
<div class='titulo2'>${t.numeroFactura}</div>
<div class='titulo'>C\xD3D. AUTORIZACI\xD3N</div>
<div class='titulo2'>${t.cuf}</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.client.nombreRazonSocial}</td>
</tr><tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client.numeroDocumento}</td></tr>
<tr><td class='titder'>COD. CLIENTE:</td ><td class='contenido'>${t.client.id}</td></tr>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fechaEmision}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.details.forEach(u=>{d+=`<div style='font-size: 12px'><b>${u.product_id} ${u.descripcion} </b></div>`,d+=`<div>${u.cantidad} ${parseFloat(u.precioUnitario).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(u.subTotal).toFixed(2)}</span></div>`}),d+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.montoTotal).toFixed(2)}</td></tr>
      <tr><td class='titder'>DESCUENTO Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.montoTotal).toFixed(2)}</td></tr>
      <tr><td class='titder'>MONTO GIFT CARD Bs</td ><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>MONTO A PAGAR Bs</td><td class='conte2'>${parseFloat(t.montoTotal).toFixed(2)}</td></tr>
      <tr><td class='titder' style='font-size: 8px'>IMPORTE BASE CR\xC9DITO FISCAL Bs</td>
      <td class='conte2'>${parseFloat(t.montoTotal).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(t.montoTotal)-Math.floor(parseFloat(t.montoTotal)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div class='titulo2' style='font-size: 9px'>
      ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
      EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE<br>
      ACUERDO A LEY<br><br>
      ${t.leyenda} <br><br>
      \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>
      Documento Fiscal Digital emitido en una modalidad de<br>
      facturaci\xF3n en l\xEDnea\u201D</div><br>
      <div style='display: flex;justify-content: center;'> <img  src="${c}" ></div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=d,new P().print(document.getElementById("myElement")),n(c)}).catch(c=>{r(c)})})}static nota(t,n=!0){return console.log("factura",t),new Promise((r,o)=>{const i=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};x().env,M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(l=>{let a="",c="";t.producto&&(a="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(c="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let d=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=d,n&&new P().print(document.getElementById("myElement")),r(l)}).catch(l=>{o(l)})})}static cotizacion(t,n,r,o,i=!0){return(o==null||o==="")&&(o=0),new Promise((s,l)=>{const a=conversor.conversorNumerosALetras,d=new a().convertToText(parseInt(r)),h=Yt().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=x().env;M.toDataURL(`Fecha: ${h} Monto: ${parseFloat(r).toFixed(2)}`,u).then(g=>{let p=`${this.head()}
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
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${n.nombre}</td>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${h}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(w=>{p+=`<div style='font-size: 12px'><b> ${w.nombre} </b></div>`,p+=`<div><span style='font-size: 18px;font-weight: bold'>${w.cantidadVenta}</span> ${parseFloat(w.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(w.precioVenta*w.cantidadVenta).toFixed(2)}</span></div>`}),p+=`<hr>
<div>${n.comentario===""||n.comentario===null||n.comentario===void 0?"":"Comentario: "+n.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(o).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(r-o).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${d} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${g}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=p,i&&new P().print(document.getElementById("myElement")),s(g)}).catch(g=>{l(g)})})}static notaCompra(t){return console.log("factura",t),new Promise((n,r)=>{const o=conversor.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;M.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(async c=>{let d=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=d,new P().print(document.getElementById("myElement")),n(c)}).catch(c=>{r(c)})})}static reportTotal(t,n){const r=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,l)=>s+l.montoTotal,0),o=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,l)=>s+l.montoTotal,0),i=r-o;return console.log("montoTotal",i),new Promise((s,l)=>{const a=conversor.conversorNumerosALetras,c=new a,d=Math.abs(i),h=c.convertToText(parseInt(d)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=x().env;M.toDataURL(` Monto: ${parseFloat(i).toFixed(2)}`,u).then(g=>{let p=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(m=>{p+=`<div style='font-size: 12px'><b> ${m.user.name} </b></div>`,p+=`<div> ${parseFloat(m.montoTotal).toFixed(2)} ${m.tipoVenta}
          <span style='float:right'> ${m.tipoVenta==="Egreso"?"-":""} ${parseFloat(m.montoTotal).toFixed(2)}</span></div>`}),p+=`<hr>
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
</html>`,document.getElementById("myElement").innerHTML=p,new P().print(document.getElementById("myElement")),s(g)}).catch(g=>{l(g)})})}static reciboCompra(t){return new Promise((n,r)=>{const o=conversor.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;M.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(c=>{let d=`${this.head()}
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
    </table><hr><div class='titulo'>DETALLE</div>`;d+=`<div style='font-size: 12px'><b>${t.product_id} ${t.product.descripcion} </b></div>`,d+=`<div>${t.quantity} ${parseFloat(t.price).toFixed(2)} 0.00
          //           <span style='float:right'>${parseFloat(t.total).toFixed(2)}</span></div>`,d+=`<hr>
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
    </html>`,document.getElementById("myElement").innerHTML=d,new P().print(document.getElementById("myElement")),n(c)}).catch(c=>{r(c)})})}static reciboTranferencia(t,n,r,o){return console.log("producto",t,"de",n,"ha",r,"cantidad",o),new Promise((i,s)=>{const l=conversor.conversorNumerosALetras,c=new l().convertToText(parseInt(o)),d={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=x().env;M.toDataURL(`de: ${n} A: ${r}`,d).then(u=>{let f=`${this.head()}
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
    </table><hr><div class='titulo'>DETALLE</div>`;f+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${n} a ${r} </b></div>`,f+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>CANTIDAD </td><td class='conte2'>${o+""}</td></tr>
      </table>
      <br>
      <div>Son ${c+""} ${o+""} unidades</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${u}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=f,new P().print(document.getElementById("myElement")),i(u)}).catch(u=>{s(u)})})}static head(){return`<html>
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
<div style="width: 300px;">`}}export{Ue as I};
