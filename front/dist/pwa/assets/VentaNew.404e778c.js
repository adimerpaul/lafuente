import{u as V,_ as ae,O as k,P as le,Q as F,R as T,aD as X,T as h,aB as ct,S as H,Y as q,Z as ut,$ as ht,W as M,aC as St,J as ft,bb as gt,aF as de,U as ce,V as ue}from"./index.31111e77.js";import{Q as pt}from"./QMarkupTable.8f6b2af9.js";import{Q as Lt}from"./QSpace.9dd36978.js";import{Q as $t}from"./QForm.0e6ad86e.js";import{Q as he}from"./QPage.1fc117fb.js";import{h as fe}from"./moment.40bc58bf.js";var S={},ge=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},Ut={},N={};let Bt;const pe=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];N.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};N.getSymbolTotalCodewords=function(t){return pe[t]};N.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t};N.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');Bt=t};N.isKanjiModeEnabled=function(){return typeof Bt!="undefined"};N.toSJIS=function(t){return Bt(t)};var rt={};(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+o)}}e.isValid=function(i){return i&&typeof i.bit!="undefined"&&i.bit>=0&&i.bit<4},e.from=function(i,n){if(e.isValid(i))return i;try{return t(i)}catch{return n}}})(rt);function Ot(){this.buffer=[],this.length=0}Ot.prototype={get:function(e){const t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)===1},put:function(e,t){for(let o=0;o<t;o++)this.putBit((e>>>t-o-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var me=Ot;function W(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}W.prototype.set=function(e,t,o,i){const n=e*this.size+t;this.data[n]=o,i&&(this.reservedBit[n]=!0)};W.prototype.get=function(e,t){return this.data[e*this.size+t]};W.prototype.xor=function(e,t,o){this.data[e*this.size+t]^=o};W.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]};var ve=W,Vt={};(function(e){const t=N.getSymbolSize;e.getRowColCoords=function(i){if(i===1)return[];const n=Math.floor(i/7)+2,r=t(i),s=r===145?26:Math.ceil((r-13)/(2*n-2))*2,l=[r-7];for(let a=1;a<n-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},e.getPositions=function(i){const n=[],r=e.getRowColCoords(i),s=r.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||n.push([r[l],r[a]]);return n}})(Vt);var kt={};const ye=N.getSymbolSize,xt=7;kt.getPositions=function(t){const o=ye(t);return[[0,0],[o-xt,0],[0,o-xt]]};var zt={};(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},e.from=function(n){return e.isValid(n)?parseInt(n,10):void 0},e.getPenaltyN1=function(n){const r=n.size;let s=0,l=0,a=0,c=null,d=null;for(let g=0;g<r;g++){l=a=0,c=d=null;for(let u=0;u<r;u++){let f=n.get(g,u);f===c?l++:(l>=5&&(s+=t.N1+(l-5)),c=f,l=1),f=n.get(u,g),f===d?a++:(a>=5&&(s+=t.N1+(a-5)),d=f,a=1)}l>=5&&(s+=t.N1+(l-5)),a>=5&&(s+=t.N1+(a-5))}return s},e.getPenaltyN2=function(n){const r=n.size;let s=0;for(let l=0;l<r-1;l++)for(let a=0;a<r-1;a++){const c=n.get(l,a)+n.get(l,a+1)+n.get(l+1,a)+n.get(l+1,a+1);(c===4||c===0)&&s++}return s*t.N2},e.getPenaltyN3=function(n){const r=n.size;let s=0,l=0,a=0;for(let c=0;c<r;c++){l=a=0;for(let d=0;d<r;d++)l=l<<1&2047|n.get(c,d),d>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|n.get(d,c),d>=10&&(a===1488||a===93)&&s++}return s*t.N3},e.getPenaltyN4=function(n){let r=0;const s=n.data.length;for(let a=0;a<s;a++)r+=n.data[a];return Math.abs(Math.ceil(r*100/s/5)-10)*t.N4};function o(i,n,r){switch(i){case e.Patterns.PATTERN000:return(n+r)%2===0;case e.Patterns.PATTERN001:return n%2===0;case e.Patterns.PATTERN010:return r%3===0;case e.Patterns.PATTERN011:return(n+r)%3===0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2===0;case e.Patterns.PATTERN101:return n*r%2+n*r%3===0;case e.Patterns.PATTERN110:return(n*r%2+n*r%3)%2===0;case e.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2===0;default:throw new Error("bad maskPattern:"+i)}}e.applyMask=function(n,r){const s=r.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)r.isReserved(a,l)||r.xor(a,l,o(n,a,l))},e.getBestMask=function(n,r){const s=Object.keys(e.Patterns).length;let l=0,a=1/0;for(let c=0;c<s;c++){r(c),e.applyMask(c,n);const d=e.getPenaltyN1(n)+e.getPenaltyN2(n)+e.getPenaltyN3(n)+e.getPenaltyN4(n);e.applyMask(c,n),d<a&&(a=d,l=c)}return l}})(zt);var st={};const U=rt,tt=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],et=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];st.getBlocksCount=function(t,o){switch(o){case U.L:return tt[(t-1)*4+0];case U.M:return tt[(t-1)*4+1];case U.Q:return tt[(t-1)*4+2];case U.H:return tt[(t-1)*4+3];default:return}};st.getTotalCodewordsCount=function(t,o){switch(o){case U.L:return et[(t-1)*4+0];case U.M:return et[(t-1)*4+1];case U.Q:return et[(t-1)*4+2];case U.H:return et[(t-1)*4+3];default:return}};var Ht={},at={};const G=new Uint8Array(512),ot=new Uint8Array(256);(function(){let t=1;for(let o=0;o<255;o++)G[o]=t,ot[t]=o,t<<=1,t&256&&(t^=285);for(let o=255;o<512;o++)G[o]=G[o-255]})();at.log=function(t){if(t<1)throw new Error("log("+t+")");return ot[t]};at.exp=function(t){return G[t]};at.mul=function(t,o){return t===0||o===0?0:G[ot[t]+ot[o]]};(function(e){const t=at;e.mul=function(i,n){const r=new Uint8Array(i.length+n.length-1);for(let s=0;s<i.length;s++)for(let l=0;l<n.length;l++)r[s+l]^=t.mul(i[s],n[l]);return r},e.mod=function(i,n){let r=new Uint8Array(i);for(;r.length-n.length>=0;){const s=r[0];for(let a=0;a<n.length;a++)r[a]^=t.mul(n[a],s);let l=0;for(;l<r.length&&r[l]===0;)l++;r=r.slice(l)}return r},e.generateECPolynomial=function(i){let n=new Uint8Array([1]);for(let r=0;r<i;r++)n=e.mul(n,new Uint8Array([1,t.exp(r)]));return n}})(Ht);const qt=Ht;function Ft(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}Ft.prototype.initialize=function(t){this.degree=t,this.genPoly=qt.generateECPolynomial(this.degree)};Ft.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const o=new Uint8Array(t.length+this.degree);o.set(t);const i=qt.mod(o,this.genPoly),n=this.degree-i.length;if(n>0){const r=new Uint8Array(this.degree);return r.set(i,n),r}return i};var be=Ft,Yt={},O={},Nt={};Nt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var P={};const Qt="[0-9]+",we="[A-Z $%*+\\-./:]+";let Z="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";Z=Z.replace(/u/g,"\\u");const Ee="(?:(?![A-Z0-9 $%*+\\-./:]|"+Z+`)(?:.|[\r
]))+`;P.KANJI=new RegExp(Z,"g");P.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");P.BYTE=new RegExp(Ee,"g");P.NUMERIC=new RegExp(Qt,"g");P.ALPHANUMERIC=new RegExp(we,"g");const Ce=new RegExp("^"+Z+"$"),Te=new RegExp("^"+Qt+"$"),Ae=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");P.testKanji=function(t){return Ce.test(t)};P.testNumeric=function(t){return Te.test(t)};P.testAlphanumeric=function(t){return Ae.test(t)};(function(e){const t=Nt,o=P;e.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(r,s){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?r.ccBits[0]:s<27?r.ccBits[1]:r.ccBits[2]},e.getBestModeForData=function(r){return o.testNumeric(r)?e.NUMERIC:o.testAlphanumeric(r)?e.ALPHANUMERIC:o.testKanji(r)?e.KANJI:e.BYTE},e.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},e.isValid=function(r){return r&&r.bit&&r.ccBits};function i(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+n)}}e.from=function(r,s){if(e.isValid(r))return r;try{return i(r)}catch{return s}}})(O);(function(e){const t=N,o=st,i=rt,n=O,r=Nt,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,l=t.getBCHDigit(s);function a(u,f,p){for(let v=1;v<=40;v++)if(f<=e.getCapacity(v,p,u))return v}function c(u,f){return n.getCharCountIndicator(u,f)+4}function d(u,f){let p=0;return u.forEach(function(v){p+=c(v.mode,f)+v.getBitsLength()}),p}function g(u,f){for(let p=1;p<=40;p++)if(d(u,p)<=e.getCapacity(p,f,n.MIXED))return p}e.from=function(f,p){return r.isValid(f)?parseInt(f,10):p},e.getCapacity=function(f,p,v){if(!r.isValid(f))throw new Error("Invalid QR Code version");typeof v=="undefined"&&(v=n.BYTE);const C=t.getSymbolTotalCodewords(f),m=o.getTotalCodewordsCount(f,p),w=(C-m)*8;if(v===n.MIXED)return w;const b=w-c(v,f);switch(v){case n.NUMERIC:return Math.floor(b/10*3);case n.ALPHANUMERIC:return Math.floor(b/11*2);case n.KANJI:return Math.floor(b/13);case n.BYTE:default:return Math.floor(b/8)}},e.getBestVersionForData=function(f,p){let v;const C=i.from(p,i.M);if(Array.isArray(f)){if(f.length>1)return g(f,C);if(f.length===0)return 1;v=f[0]}else v=f;return a(v.mode,v.getLength(),C)},e.getEncodedBits=function(f){if(!r.isValid(f)||f<7)throw new Error("Invalid QR Code version");let p=f<<12;for(;t.getBCHDigit(p)-l>=0;)p^=s<<t.getBCHDigit(p)-l;return f<<12|p}})(Yt);var Kt={};const Et=N,Jt=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Be=1<<14|1<<12|1<<10|1<<4|1<<1,Pt=Et.getBCHDigit(Jt);Kt.getEncodedBits=function(t,o){const i=t.bit<<3|o;let n=i<<10;for(;Et.getBCHDigit(n)-Pt>=0;)n^=Jt<<Et.getBCHDigit(n)-Pt;return(i<<10|n)^Be};var jt={};const Fe=O;function Y(e){this.mode=Fe.NUMERIC,this.data=e.toString()}Y.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};Y.prototype.getLength=function(){return this.data.length};Y.prototype.getBitsLength=function(){return Y.getBitsLength(this.data.length)};Y.prototype.write=function(t){let o,i,n;for(o=0;o+3<=this.data.length;o+=3)i=this.data.substr(o,3),n=parseInt(i,10),t.put(n,10);const r=this.data.length-o;r>0&&(i=this.data.substr(o),n=parseInt(i,10),t.put(n,r*3+1))};var Ne=Y;const Me=O,mt=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function Q(e){this.mode=Me.ALPHANUMERIC,this.data=e}Q.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};Q.prototype.getLength=function(){return this.data.length};Q.prototype.getBitsLength=function(){return Q.getBitsLength(this.data.length)};Q.prototype.write=function(t){let o;for(o=0;o+2<=this.data.length;o+=2){let i=mt.indexOf(this.data[o])*45;i+=mt.indexOf(this.data[o+1]),t.put(i,11)}this.data.length%2&&t.put(mt.indexOf(this.data[o]),6)};var Ie=Q;const Se=O;function K(e){this.mode=Se.BYTE,typeof e=="string"?this.data=new TextEncoder().encode(e):this.data=new Uint8Array(e)}K.getBitsLength=function(t){return t*8};K.prototype.getLength=function(){return this.data.length};K.prototype.getBitsLength=function(){return K.getBitsLength(this.data.length)};K.prototype.write=function(e){for(let t=0,o=this.data.length;t<o;t++)e.put(this.data[t],8)};var Le=K;const $e=O,xe=N;function J(e){this.mode=$e.KANJI,this.data=e}J.getBitsLength=function(t){return t*13};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let o=xe.toSJIS(this.data[t]);if(o>=33088&&o<=40956)o-=33088;else if(o>=57408&&o<=60351)o-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);o=(o>>>8&255)*192+(o&255),e.put(o,13)}};var Pe=J,Gt={exports:{}};(function(e){var t={single_source_shortest_paths:function(o,i,n){var r={},s={};s[i]=0;var l=t.PriorityQueue.make();l.push(i,0);for(var a,c,d,g,u,f,p,v,C;!l.empty();){a=l.pop(),c=a.value,g=a.cost,u=o[c]||{};for(d in u)u.hasOwnProperty(d)&&(f=u[d],p=g+f,v=s[d],C=typeof s[d]=="undefined",(C||v>p)&&(s[d]=p,l.push(d,p),r[d]=c))}if(typeof n!="undefined"&&typeof s[n]=="undefined"){var m=["Could not find a path from ",i," to ",n,"."].join("");throw new Error(m)}return r},extract_shortest_path_from_predecessor_list:function(o,i){for(var n=[],r=i;r;)n.push(r),o[r],r=o[r];return n.reverse(),n},find_path:function(o,i,n){var r=t.single_source_shortest_paths(o,i,n);return t.extract_shortest_path_from_predecessor_list(r,n)},PriorityQueue:{make:function(o){var i=t.PriorityQueue,n={},r;o=o||{};for(r in i)i.hasOwnProperty(r)&&(n[r]=i[r]);return n.queue=[],n.sorter=o.sorter||i.default_sorter,n},default_sorter:function(o,i){return o.cost-i.cost},push:function(o,i){var n={value:o,cost:i};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(Gt);(function(e){const t=O,o=Ne,i=Ie,n=Le,r=Pe,s=P,l=N,a=Gt.exports;function c(m){return unescape(encodeURIComponent(m)).length}function d(m,w,b){const y=[];let E;for(;(E=m.exec(b))!==null;)y.push({data:E[0],index:E.index,mode:w,length:E[0].length});return y}function g(m){const w=d(s.NUMERIC,t.NUMERIC,m),b=d(s.ALPHANUMERIC,t.ALPHANUMERIC,m);let y,E;return l.isKanjiModeEnabled()?(y=d(s.BYTE,t.BYTE,m),E=d(s.KANJI,t.KANJI,m)):(y=d(s.BYTE_KANJI,t.BYTE,m),E=[]),w.concat(b,y,E).sort(function(B,I){return B.index-I.index}).map(function(B){return{data:B.data,mode:B.mode,length:B.length}})}function u(m,w){switch(w){case t.NUMERIC:return o.getBitsLength(m);case t.ALPHANUMERIC:return i.getBitsLength(m);case t.KANJI:return r.getBitsLength(m);case t.BYTE:return n.getBitsLength(m)}}function f(m){return m.reduce(function(w,b){const y=w.length-1>=0?w[w.length-1]:null;return y&&y.mode===b.mode?(w[w.length-1].data+=b.data,w):(w.push(b),w)},[])}function p(m){const w=[];for(let b=0;b<m.length;b++){const y=m[b];switch(y.mode){case t.NUMERIC:w.push([y,{data:y.data,mode:t.ALPHANUMERIC,length:y.length},{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.ALPHANUMERIC:w.push([y,{data:y.data,mode:t.BYTE,length:y.length}]);break;case t.KANJI:w.push([y,{data:y.data,mode:t.BYTE,length:c(y.data)}]);break;case t.BYTE:w.push([{data:y.data,mode:t.BYTE,length:c(y.data)}])}}return w}function v(m,w){const b={},y={start:{}};let E=["start"];for(let A=0;A<m.length;A++){const B=m[A],I=[];for(let _=0;_<B.length;_++){const L=B[_],j=""+A+_;I.push(j),b[j]={node:L,lastCount:0},y[j]={};for(let dt=0;dt<E.length;dt++){const R=E[dt];b[R]&&b[R].node.mode===L.mode?(y[R][j]=u(b[R].lastCount+L.length,L.mode)-u(b[R].lastCount,L.mode),b[R].lastCount+=L.length):(b[R]&&(b[R].lastCount=L.length),y[R][j]=u(L.length,L.mode)+4+t.getCharCountIndicator(L.mode,w))}}E=I}for(let A=0;A<E.length;A++)y[E[A]].end=0;return{map:y,table:b}}function C(m,w){let b;const y=t.getBestModeForData(m);if(b=t.from(w,y),b!==t.BYTE&&b.bit<y.bit)throw new Error('"'+m+'" cannot be encoded with mode '+t.toString(b)+`.
 Suggested mode is: `+t.toString(y));switch(b===t.KANJI&&!l.isKanjiModeEnabled()&&(b=t.BYTE),b){case t.NUMERIC:return new o(m);case t.ALPHANUMERIC:return new i(m);case t.KANJI:return new r(m);case t.BYTE:return new n(m)}}e.fromArray=function(w){return w.reduce(function(b,y){return typeof y=="string"?b.push(C(y,null)):y.data&&b.push(C(y.data,y.mode)),b},[])},e.fromString=function(w,b){const y=g(w,l.isKanjiModeEnabled()),E=p(y),A=v(E,b),B=a.find_path(A.map,"start","end"),I=[];for(let _=1;_<B.length-1;_++)I.push(A.table[B[_]].node);return e.fromArray(f(I))},e.rawSplit=function(w){return e.fromArray(g(w,l.isKanjiModeEnabled()))}})(jt);const lt=N,vt=rt,Re=me,_e=ve,De=Vt,Ue=kt,Ct=zt,Tt=st,Oe=be,it=Yt,Ve=Kt,ke=O,yt=jt;function ze(e,t){const o=e.size,i=Ue.getPositions(t);for(let n=0;n<i.length;n++){const r=i[n][0],s=i[n][1];for(let l=-1;l<=7;l++)if(!(r+l<=-1||o<=r+l))for(let a=-1;a<=7;a++)s+a<=-1||o<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?e.set(r+l,s+a,!0,!0):e.set(r+l,s+a,!1,!0))}}function He(e){const t=e.size;for(let o=8;o<t-8;o++){const i=o%2===0;e.set(o,6,i,!0),e.set(6,o,i,!0)}}function qe(e,t){const o=De.getPositions(t);for(let i=0;i<o.length;i++){const n=o[i][0],r=o[i][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?e.set(n+s,r+l,!0,!0):e.set(n+s,r+l,!1,!0)}}function Ye(e,t){const o=e.size,i=it.getEncodedBits(t);let n,r,s;for(let l=0;l<18;l++)n=Math.floor(l/3),r=l%3+o-8-3,s=(i>>l&1)===1,e.set(n,r,s,!0),e.set(r,n,s,!0)}function bt(e,t,o){const i=e.size,n=Ve.getEncodedBits(t,o);let r,s;for(r=0;r<15;r++)s=(n>>r&1)===1,r<6?e.set(r,8,s,!0):r<8?e.set(r+1,8,s,!0):e.set(i-15+r,8,s,!0),r<8?e.set(8,i-r-1,s,!0):r<9?e.set(8,15-r-1+1,s,!0):e.set(8,15-r-1,s,!0);e.set(i-8,8,1,!0)}function Qe(e,t){const o=e.size;let i=-1,n=o-1,r=7,s=0;for(let l=o-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!e.isReserved(n,l-a)){let c=!1;s<t.length&&(c=(t[s]>>>r&1)===1),e.set(n,l-a,c),r--,r===-1&&(s++,r=7)}if(n+=i,n<0||o<=n){n-=i,i=-i;break}}}function Ke(e,t,o){const i=new Re;o.forEach(function(a){i.put(a.mode.bit,4),i.put(a.getLength(),ke.getCharCountIndicator(a.mode,e)),a.write(i)});const n=lt.getSymbolTotalCodewords(e),r=Tt.getTotalCodewordsCount(e,t),s=(n-r)*8;for(i.getLengthInBits()+4<=s&&i.put(0,4);i.getLengthInBits()%8!==0;)i.putBit(0);const l=(s-i.getLengthInBits())/8;for(let a=0;a<l;a++)i.put(a%2?17:236,8);return Je(i,e,t)}function Je(e,t,o){const i=lt.getSymbolTotalCodewords(t),n=Tt.getTotalCodewordsCount(t,o),r=i-n,s=Tt.getBlocksCount(t,o),l=i%s,a=s-l,c=Math.floor(i/s),d=Math.floor(r/s),g=d+1,u=c-d,f=new Oe(u);let p=0;const v=new Array(s),C=new Array(s);let m=0;const w=new Uint8Array(e.buffer);for(let B=0;B<s;B++){const I=B<a?d:g;v[B]=w.slice(p,p+I),C[B]=f.encode(v[B]),p+=I,m=Math.max(m,I)}const b=new Uint8Array(i);let y=0,E,A;for(E=0;E<m;E++)for(A=0;A<s;A++)E<v[A].length&&(b[y++]=v[A][E]);for(E=0;E<u;E++)for(A=0;A<s;A++)b[y++]=C[A][E];return b}function je(e,t,o,i){let n;if(Array.isArray(e))n=yt.fromArray(e);else if(typeof e=="string"){let c=t;if(!c){const d=yt.rawSplit(e);c=it.getBestVersionForData(d,o)}n=yt.fromString(e,c||40)}else throw new Error("Invalid data");const r=it.getBestVersionForData(n,o);if(!r)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=r;else if(t<r)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+r+`.
`);const s=Ke(t,o,n),l=lt.getSymbolSize(t),a=new _e(l);return ze(a,t),He(a),qe(a,t),bt(a,o,0),t>=7&&Ye(a,t),Qe(a,s),isNaN(i)&&(i=Ct.getBestMask(a,bt.bind(null,a,o))),Ct.applyMask(i,a),bt(a,o,i),{modules:a,version:t,errorCorrectionLevel:o,maskPattern:i,segments:n}}Ut.create=function(t,o){if(typeof t=="undefined"||t==="")throw new Error("No input text");let i=vt.M,n,r;return typeof o!="undefined"&&(i=vt.from(o.errorCorrectionLevel,vt.M),n=it.from(o.version),r=Ct.from(o.maskPattern),o.toSJISFunc&&lt.setToSJISFunction(o.toSJISFunc)),je(t,n,i,r)};var Zt={},Mt={};(function(e){function t(o){if(typeof o=="number"&&(o=o.toString()),typeof o!="string")throw new Error("Color should be defined as hex string");let i=o.slice().replace("#","").split("");if(i.length<3||i.length===5||i.length>8)throw new Error("Invalid hex color: "+o);(i.length===3||i.length===4)&&(i=Array.prototype.concat.apply([],i.map(function(r){return[r,r]}))),i.length===6&&i.push("F","F");const n=parseInt(i.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+i.slice(0,6).join("")}}e.getOptions=function(i){i||(i={}),i.color||(i.color={});const n=typeof i.margin=="undefined"||i.margin===null||i.margin<0?4:i.margin,r=i.width&&i.width>=21?i.width:void 0,s=i.scale||4;return{width:r,scale:r?4:s,margin:n,color:{dark:t(i.color.dark||"#000000ff"),light:t(i.color.light||"#ffffffff")},type:i.type,rendererOpts:i.rendererOpts||{}}},e.getScale=function(i,n){return n.width&&n.width>=i+n.margin*2?n.width/(i+n.margin*2):n.scale},e.getImageWidth=function(i,n){const r=e.getScale(i,n);return Math.floor((i+n.margin*2)*r)},e.qrToImageData=function(i,n,r){const s=n.modules.size,l=n.modules.data,a=e.getScale(s,r),c=Math.floor((s+r.margin*2)*a),d=r.margin*a,g=[r.color.light,r.color.dark];for(let u=0;u<c;u++)for(let f=0;f<c;f++){let p=(u*c+f)*4,v=r.color.light;if(u>=d&&f>=d&&u<c-d&&f<c-d){const C=Math.floor((u-d)/a),m=Math.floor((f-d)/a);v=g[l[C*s+m]?1:0]}i[p++]=v.r,i[p++]=v.g,i[p++]=v.b,i[p]=v.a}}})(Mt);(function(e){const t=Mt;function o(n,r,s){n.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=s,r.width=s,r.style.height=s+"px",r.style.width=s+"px"}function i(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(r,s,l){let a=l,c=s;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(c=i()),a=t.getOptions(a);const d=t.getImageWidth(r.modules.size,a),g=c.getContext("2d"),u=g.createImageData(d,d);return t.qrToImageData(u.data,r,a),o(g,c,d),g.putImageData(u,0,0),c},e.renderToDataURL=function(r,s,l){let a=l;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const c=e.render(r,s,a),d=a.type||"image/png",g=a.rendererOpts||{};return c.toDataURL(d,g.quality)}})(Zt);var Wt={};const Ge=Mt;function Rt(e,t){const o=e.a/255,i=t+'="'+e.hex+'"';return o<1?i+" "+t+'-opacity="'+o.toFixed(2).slice(1)+'"':i}function wt(e,t,o){let i=e+t;return typeof o!="undefined"&&(i+=" "+o),i}function Ze(e,t,o){let i="",n=0,r=!1,s=0;for(let l=0;l<e.length;l++){const a=Math.floor(l%t),c=Math.floor(l/t);!a&&!r&&(r=!0),e[l]?(s++,l>0&&a>0&&e[l-1]||(i+=r?wt("M",a+o,.5+c+o):wt("m",n,0),n=0,r=!1),a+1<t&&e[l+1]||(i+=wt("h",s),s=0)):n++}return i}Wt.render=function(t,o,i){const n=Ge.getOptions(o),r=t.modules.size,s=t.modules.data,l=r+n.margin*2,a=n.color.light.a?"<path "+Rt(n.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",c="<path "+Rt(n.color.dark,"stroke")+' d="'+Ze(s,r,n.margin)+'"/>',d='viewBox="0 0 '+l+" "+l+'"',g=n.width?'width="'+n.width+'" height="'+n.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+g+d+' shape-rendering="crispEdges">'+a+c+`</svg>
`;return typeof i=="function"&&i(null,u),u};const We=ge,At=Ut,Xt=Zt,Xe=Wt;function It(e,t,o,i,n){const r=[].slice.call(arguments,1),s=r.length,l=typeof r[s-1]=="function";if(!l&&!We())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(n=o,o=t,t=i=void 0):s===3&&(t.getContext&&typeof n=="undefined"?(n=i,i=void 0):(n=i,i=o,o=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(o=t,t=i=void 0):s===2&&!t.getContext&&(i=o,o=t,t=void 0),new Promise(function(a,c){try{const d=At.create(o,i);a(e(d,t,i))}catch(d){c(d)}})}try{const a=At.create(o,i);n(null,e(a,t,i))}catch(a){n(a)}}S.create=At.create;S.toCanvas=It.bind(null,Xt.render);S.toDataURL=It.bind(null,Xt.renderToDataURL);S.toString=It.bind(null,function(e,t,o){return Xe.render(e,o)});var x={};Object.defineProperty(x,"__esModule",{value:!0});var D=x.Printd=x.createIFrame=x.createLinkStyle=x.createStyle=void 0,tn=/^(((http[s]?)|file):)?(\/\/)+([0-9a-zA-Z-_.=?&].+)$/,en=/^((\.|\.\.)?\/)([0-9a-zA-Z-_.=?&]+\/)*([0-9a-zA-Z-_.=?&]+)$/,_t=function(e){return tn.test(e)||en.test(e)};function te(e,t){var o=e.createElement("style");return o.appendChild(e.createTextNode(t)),o}x.createStyle=te;function ee(e,t){var o=e.createElement("link");return o.type="text/css",o.rel="stylesheet",o.href=t,o}x.createLinkStyle=ee;function ne(e){var t=window.document.createElement("iframe");return t.setAttribute("src","about:blank"),t.setAttribute("style","visibility:hidden;width:0;height:0;position:absolute;z-index:-9999;bottom:0;"),t.setAttribute("width","0"),t.setAttribute("height","0"),t.setAttribute("wmode","opaque"),e.appendChild(t),t}x.createIFrame=ne;var nn={parent:window.document.body,headElements:[],bodyElements:[]},oe=function(){function e(t){this.isLoading=!1,this.hasEvents=!1,this.opts=[nn,t||{}].reduce(function(o,i){return Object.keys(i).forEach(function(n){return o[n]=i[n]}),o},{}),this.iframe=ne(this.opts.parent)}return e.prototype.getIFrame=function(){return this.iframe},e.prototype.print=function(t,o,i,n){if(!this.isLoading){var r=this.iframe,s=r.contentDocument,l=r.contentWindow;if(!(!s||!l)&&(this.iframe.src="about:blank",this.elCopy=t.cloneNode(!0),!!this.elCopy)){this.isLoading=!0,this.callback=n;var a=l.document;a.open(),a.write('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>'),this.addEvents();var c=this.opts,d=c.headElements,g=c.bodyElements;Array.isArray(d)&&d.forEach(function(u){return a.head.appendChild(u)}),Array.isArray(g)&&g.forEach(function(u){return a.body.appendChild(u)}),Array.isArray(o)&&o.forEach(function(u){u&&a.head.appendChild(_t(u)?ee(a,u):te(a,u))}),a.body.appendChild(this.elCopy),Array.isArray(i)&&i.forEach(function(u){if(u){var f=a.createElement("script");_t(u)?f.src=u:f.innerText=u,a.body.appendChild(f)}}),a.close()}}},e.prototype.printURL=function(t,o){this.isLoading||(this.addEvents(),this.isLoading=!0,this.callback=o,this.iframe.src=t)},e.prototype.onBeforePrint=function(t){this.onbeforeprint=t},e.prototype.onAfterPrint=function(t){this.onafterprint=t},e.prototype.launchPrint=function(t){this.isLoading||t.print()},e.prototype.addEvents=function(){var t=this;if(!this.hasEvents){this.hasEvents=!0,this.iframe.addEventListener("load",function(){return t.onLoad()},!1);var o=this.iframe.contentWindow;o&&(this.onbeforeprint&&o.addEventListener("beforeprint",this.onbeforeprint),this.onafterprint&&o.addEventListener("afterprint",this.onafterprint))}},e.prototype.onLoad=function(){var t=this;if(this.iframe){this.isLoading=!1;var o=this.iframe,i=o.contentDocument,n=o.contentWindow;if(!i||!n)return;typeof this.callback=="function"?this.callback({iframe:this.iframe,element:this.elCopy,launchPrint:function(){return t.launchPrint(n)}}):this.launchPrint(n)}},e}();D=x.Printd=oe;x.default=oe;var ie={};Object.defineProperty(ie,"__esModule",{value:!0});function nt(e){switch(e){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function z(e,t){return t>0?e+" y "+nt(t):e}function $(e){var t=Math.floor(e/10),o=e-t*10;switch(t){case 1:switch(o){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+nt(o).toLowerCase()}case 2:switch(o){case 0:return"Veinte";default:return"Veinti"+nt(o).toLowerCase()}case 3:return z("Treinta",o);case 4:return z("Cuarenta",o);case 5:return z("Cincuenta",o);case 6:return z("Sesenta",o);case 7:return z("Setenta",o);case 8:return z("Ochenta",o);case 9:return z("Noventa",o);case 0:return nt(o);default:return""}}function re(e){var t=Math.floor(e/100),o=e-t*100;switch(t){case 1:return o>0?"Ciento "+$(o):"Cien";case 2:return"Doscientos "+$(o);case 3:return"Trescientos "+$(o);case 4:return"Cuatrocientos "+$(o);case 5:return"Quinientos "+$(o);case 6:return"Seiscientos "+$(o);case 7:return"Setecientos "+$(o);case 8:return"Ochocientos "+$(o);case 9:return"Novecientos "+$(o);default:return $(o)}}function se(e,t,o,i){var n=Math.floor(e/t),r=e-n*t,s="";return n>0&&(n>1?s=re(n)+" "+i:s=o),r>0&&(s+=""),s}function on(e){var t=1e3,o=Math.floor(e/t),i=e-o*t,n=se(e,t,"Un Mil","Mil"),r=re(i);return n===""?r:(n+" "+r).trim()}function Dt(e){var t=1e6,o=Math.floor(e/t),i=e-o*t,n=se(e,t,"Un Mill\xF3n de","Millones de"),r=on(i);return n===""?r:(n+" "+r).trim()}function rn(e){var t={numero:e,enteros:Math.floor(e),centavos:Math.round(e*100)-Math.floor(e)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(Dt(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(Dt(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}ie.NumerosALetras=rn;class sn{static numeroALetras(t){const o=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],i=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],n={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"};if(t<10)return o[t];if(t>=10&&t<20)return n[t];if(t<100){const r=t%10;return`${i[Math.floor(t/10)]}${r>0?" y "+o[r]:""}`}return"N\xFAmero muy grande"}static factura(t){return new Promise((o,i)=>{const n=conversor.conversorNumerosALetras,s=new n().convertToText(parseInt(t.montoTotal)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=V().env;S.toDataURL(a.url2+"consulta/QR?nit="+a.nit+"&cuf="+t.cuf+"&numero="+t.numeroFactura+"&t=2",l).then(c=>{let d=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=d,new D().print(document.getElementById("myElement")),o(c)}).catch(c=>{i(c)})})}static nota(t,o=!0){return console.log("factura",t),new Promise((i,n)=>{const r=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};V().env,S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(l=>{let a="",c="";t.producto&&(a="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(c="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let d=`${this.head()}
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
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='titder'>${t.nombre}</td>
</tr><tr><!-- td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td --></tr>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
${a}
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
<div>${t.comentario===""||t.comentario===null?"":"Comentario: "+t.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='titder'>${parseFloat(t.total).toFixed(2)}</td></tr>
<!--      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='titder'>${parseFloat(t.descuento).toFixed(2)}</td></tr>-->
<!--      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='titder'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>-->
      </table>
      <br>
      <div>Son ${r} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
        <!--div style='display: flex;justify-content: center;'>
          <img  src="${l}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=d,o&&new D().print(document.getElementById("myElement")),i(l)}).catch(l=>{n(l)})})}static cotizacion(t,o,i,n,r=!0){return(n==null||n==="")&&(n=0),new Promise((s,l)=>{const a=conversor.conversorNumerosALetras,d=new a().convertToText(parseInt(i)),g=fe().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=V().env;S.toDataURL(`Fecha: ${g} Monto: ${parseFloat(i).toFixed(2)}`,u).then(p=>{let v=`${this.head()}
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
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${o.nombre}</td>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${g}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(C=>{v+=`<div style='font-size: 12px'><b> ${C.nombre} </b></div>`,v+=`<div><span style='font-size: 18px;font-weight: bold'>${C.cantidadVenta}</span> ${parseFloat(C.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(C.precioVenta*C.cantidadVenta).toFixed(2)}</span></div>`}),v+=`<hr>
<div>${o.comentario===""||o.comentario===null||o.comentario===void 0?"":"Comentario: "+o.comentario}</div>
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
</html>`,document.getElementById("myElement").innerHTML=v,r&&new D().print(document.getElementById("myElement")),s(p)}).catch(p=>{l(p)})})}static notaCompra(t){return console.log("factura",t),new Promise((o,i)=>{const n=conversor.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=V().env;S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(async c=>{let d=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=d,new D().print(document.getElementById("myElement")),o(c)}).catch(c=>{i(c)})})}static reportTotal(t,o){const i=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,l)=>s+l.montoTotal,0),n=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,l)=>s+l.montoTotal,0),r=i-n;return console.log("montoTotal",r),new Promise((s,l)=>{const a=conversor.conversorNumerosALetras,c=new a,d=Math.abs(r),g=c.convertToText(parseInt(d)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=V().env;S.toDataURL(` Monto: ${parseFloat(r).toFixed(2)}`,u).then(p=>{let v=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(m=>{v+=`<div style='font-size: 12px'><b> ${m.user.name} </b></div>`,v+=`<div> ${parseFloat(m.montoTotal).toFixed(2)} ${m.tipoVenta}
          <span style='float:right'> ${m.tipoVenta==="Egreso"?"-":""} ${parseFloat(m.montoTotal).toFixed(2)}</span></div>`}),v+=`<hr>
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
</html>`,document.getElementById("myElement").innerHTML=v,new D().print(document.getElementById("myElement")),s(p)}).catch(p=>{l(p)})})}static reciboCompra(t){return new Promise((o,i)=>{const n=conversor.conversorNumerosALetras,s=new n().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=V().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(c=>{let d=`${this.head()}
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
    </html>`,document.getElementById("myElement").innerHTML=d,new D().print(document.getElementById("myElement")),o(c)}).catch(c=>{i(c)})})}static reciboTranferencia(t,o,i,n){return console.log("producto",t,"de",o,"ha",i,"cantidad",n),new Promise((r,s)=>{const l=conversor.conversorNumerosALetras,c=new l().convertToText(parseInt(n)),d={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},g=V().env;S.toDataURL(`de: ${o} A: ${i}`,d).then(u=>{let f=`${this.head()}
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
    </table><hr><div class='titulo'>DETALLE</div>`;f+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${o} a ${i} </b></div>`,f+=`<hr>
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
    </html>`,document.getElementById("myElement").innerHTML=f,new D().print(document.getElementById("myElement")),r(u)}).catch(u=>{s(u)})})}static head(){return`<html>
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
<div style="width: 300px;">`}}const an={name:"VentasTab",props:{},emits:["pacienteGet"],data(){return{loading:!1,paciente:{},ventaDialog:!1,efectivo:"",venta:{nit:"0",nombre:"SN"},recognition:null,activeField:null,productos:[],productosSearch:"",productosVentas:[],unidades:["","capsulas","comprimidos","pastillas","ml","mg","otro"],vias:["","oral","intramuscular","intravenosa","subcut\xE1nea","t\xF3pica","oft\xE1lmica","\xF3tica","nasal","rectal","vaginal"],frecuencias:["","cada 8 horas","cada 12 horas","cada 24 horas","cada 48 horas","cada 72 horas","cada 96 horas","cada 120 horas","cada 144 horas","cada 168 horas"],duraciones:["","3 dias","5 dias","7 dias","10 dias","14 dias","21 dias","28 dias","30 dias","60 dias","90 dias","120 dias","180 dias","240 dias","365 dias"]}},mounted(){if(this.productosGet(),"webkitSpeechRecognition"in window||"SpeechRecognition"in window){const e=window.SpeechRecognition||window.webkitSpeechRecognition;this.recognition=new e,this.recognition.lang="es-ES",this.recognition.interimResults=!1,this.recognition.continuous=!1,this.recognition.onresult=t=>{const o=t.results[0][0].transcript;this.activeField&&(this.venta[this.activeField]+=o)},this.recognition.onerror=t=>{console.error("Error en reconocimiento de voz:",t.error)}}else console.error("El reconocimiento de voz no est\xE1 soportado en este navegador")},methods:{searchCliente(){this.loading=!0,this.$axios.post("searchCliente",{nit:this.venta.nit}).then(e=>{this.loading=!1,e.data.nombre&&(this.venta.nombre=e.data.nombre)}).catch(e=>{this.loading=!1,console.error(e)})},clickDialogVenta(){if(this.productosVentas.length===0){this.$alert.error("Debe agregar al menos un producto a la venta");return}this.ventaDialog=!0,this.venta={nit:"0",nombre:"SN"},this.efectivo=""},addProductoName(){this.$alert.dialogPrompt("Nombre del producto",{title:"Agregar producto",cancel:!0,persistent:!0}).onOk(e=>{this.productosVentas.push({producto_id:null,cantidad:1,unidad:"capsulas",via:"oral",frecuencia:"cada 8 horas",duracion:"3 dias",indicaciones:"",producto:{nombre:e}})})},addProducto(e){const t=this.productosVentas.find(o=>o.producto_id===e.id);if(t){t.cantidad+=1;return}this.productosVentas.push({producto_id:e.id,cantidad:1,precio:e.precio,producto:e})},productosGet(){this.loading=!0,this.$axios.get("productos",{params:{search:this.productosSearch}}).then(e=>{this.productos=e.data.data,this.loading=!1}).catch(e=>{this.loading=!1,console.error(e)})},submitVenta(){this.loading=!0,this.$axios.post("ventas",{ci:this.venta.nit,nombre:this.venta.nombre,productos:this.productosVentas}).then(e=>{this.ventaDialog=!1,this.loading=!1,this.$alert.success("Venta realizada con \xE9xito"),this.productosVentas=[],sn.nota(e.data)}).catch(e=>{this.loading=!1,console.error(e)})},addVenta(){this.venta={indicaciones:"",observaciones:""},this.ventaDialog=!0,this.productosVentas=[]},sendWhatsapp(e){const t=`${this.$url}/../venta/${e.id}/pdf`,o=`https://api.whatsapp.com/send?phone=${this.paciente.telefono}&text=Hola ${this.paciente.nombre}, aqu\xED tienes tu venta: ${t}`;window.open(o,"_blank").focus()},printVenta(e){const t=`${this.$url}/../venta/${e.id}/pdf`;window.open(t,"_blank")},startRecognition(e){this.recognition?(this.activeField=e,this.recognition.start()):this.$q.notify({color:"negative",message:"El reconocimiento de voz no est\xE1 soportado en este navegador"})}},computed:{cambio(){let e=this.efectivo-this.productosVentas.reduce((t,o)=>t+o.cantidad*o.precio,0);return e<0&&(e=0),e}}},ln={class:"row"},dn={class:"col-12 col-md-7 q-pa-xs"},cn=["onClick"],un={style:{padding:"0",margin:"0"},class:"cursor-pointer"},hn={style:{"max-width":"190px",overflow:"hidden","text-overflow":"ellipsis","line-height":"0.9"}},fn={style:{padding:"0",margin:"0"},class:"cursor-pointer"},gn={style:{"max-width":"190px",overflow:"hidden","text-overflow":"ellipsis","line-height":"0.9"}},pn={class:"cursor-pointer"},mn={style:{"max-width":"190px",overflow:"hidden","text-overflow":"ellipsis","line-height":"0.9"},class:"text-right"},vn={class:"col-12 col-md-5 q-pa-xs"},yn={class:"text-right flex items-center"},bn={style:{padding:"0",margin:"0"}},wn={style:{"max-width":"190px",overflow:"hidden","text-overflow":"ellipsis","line-height":"0.9"}},En={style:{padding:"0",margin:"0"}},Cn=["onUpdate:modelValue"],Tn={style:{padding:"0",margin:"0"}},An=["onUpdate:modelValue"],Bn={class:"text-right"},Fn={class:"text-right text-bold"},Nn={class:"row"},Mn={class:"col-12 col-md-3 q-pa-xs"},In={class:"col-12 col-md-3 q-pa-xs"},Sn={class:"col-12 q-pa-xs"},Ln={style:{padding:"0",margin:"0"}},$n={style:{"max-width":"190px",overflow:"hidden","text-overflow":"ellipsis","line-height":"0.9"}},xn={style:{padding:"0",margin:"0"}},Pn={style:{padding:"0",margin:"0"}},Rn={class:"text-right"},_n={class:"text-right text-bold"},Dn={style:{padding:"0",margin:"0"}},Un={class:"text-right"},On={style:{padding:"0",margin:"0"},class:"text-right"},Vn={class:"col-12 q-pa-xs"};function kn(e,t,o,i,n,r){return k(),le(he,{class:"q-pa-xs"},{default:F(()=>[T(St,{flat:"",bordered:""},{default:F(()=>[T(X,{class:"row items-center q-pb-none"},{default:F(()=>t[7]||(t[7]=[h("div",{class:"text-h6"},"Ventas",-1)])),_:1}),T(X,null,{default:F(()=>[T($t,{onSubmit:r.clickDialogVenta},{default:F(()=>[h("div",ln,[h("div",dn,[T(ct,{modelValue:n.productosSearch,"onUpdate:modelValue":[t[0]||(t[0]=s=>n.productosSearch=s),r.productosGet],outlined:"",clearable:"",label:"Buscar producto",dense:"",debounce:"300"},{append:F(()=>[T(H,{flat:"",round:"",dense:"",icon:"search"})]),_:1},8,["modelValue","onUpdate:modelValue"]),T(pt,{dense:"","wrap-cells":"",flat:"",bordered:""},{default:F(()=>[t[8]||(t[8]=h("thead",null,[h("tr",null,[h("th",null,"Nombres"),h("th",null,"Unidad"),h("th",null,"Precio")])],-1)),h("tbody",null,[(k(!0),q(ht,null,ut(n.productos,(s,l)=>(k(),q("tr",{key:l,onClick:a=>r.addProducto(s)},[h("td",un,[h("div",hn,M(e.$filters.textUpper(s.nombre)),1)]),h("td",fn,[h("div",gn,M(e.$filters.textUpper(s.unidad)),1)]),h("td",pn,[h("div",mn,M(s.precio)+" Bs ",1)])],8,cn))),128))])]),_:1})]),h("div",vn,[h("div",yn,[T(H,{icon:"add_circle_outline",size:"10px",onClick:r.addProductoName,color:"green",dense:"","no-caps":"",label:"Recuperar venta"},null,8,["onClick"]),T(Lt),T(H,{icon:"delete",size:"10px",color:"red",dense:"",flat:"","no-caps":"",label:"limpiar",onClick:t[1]||(t[1]=s=>n.productosVentas=[])})]),T(pt,{dense:"","wrap-cells":"",flat:"",bordered:""},{default:F(()=>[t[10]||(t[10]=h("thead",null,[h("tr",null,[h("th",null,"Producto"),h("th",null,"Cantidad"),h("th",null,"Precio"),h("th",null,"Subtotal")])],-1)),h("tbody",null,[(k(!0),q(ht,null,ut(n.productosVentas,(s,l)=>(k(),q("tr",{key:l},[h("td",bn,[h("div",wn,[T(ce,{name:"delete",color:"red",class:"cursor-pointer",onClick:a=>n.productosVentas.splice(l,1)},null,8,["onClick"]),ue(" "+M(e.$filters.textUpper(s.producto.nombre)),1)])]),h("td",En,[ft(h("input",{"onUpdate:modelValue":a=>s.cantidad=a,type:"number",style:{width:"50px"}},null,8,Cn),[[gt,s.cantidad]])]),h("td",Tn,[ft(h("input",{"onUpdate:modelValue":a=>s.precio=a,type:"number",style:{width:"50px"}},null,8,An),[[gt,s.precio]])]),h("td",Bn,M(s.cantidad*s.precio)+" Bs ",1)]))),128))]),h("tfoot",null,[h("tr",null,[t[9]||(t[9]=h("td",{colspan:"3",class:"text-right"},"Total",-1)),h("td",Fn,M(n.productosVentas.reduce((s,l)=>s+l.cantidad*l.precio,0))+" Bs",1)])])]),_:1}),T(H,{label:"Realizar venta",color:"positive",class:"full-width","no-caps":"",loading:n.loading,type:"submit",icon:"add_circle_outline"},null,8,["loading"])])])]),_:1},8,["onSubmit"])]),_:1})]),_:1}),T(de,{modelValue:n.ventaDialog,"onUpdate:modelValue":t[6]||(t[6]=s=>n.ventaDialog=s)},{default:F(()=>[T(St,{style:{width:"650px",margin:"0 auto"}},{default:F(()=>[T(X,{class:"q-pb-none row items-center"},{default:F(()=>[t[11]||(t[11]=h("div",{class:"text-h6"},"Nueva venta",-1)),T(Lt),T(H,{flat:"",round:"",dense:"",icon:"close",onClick:t[2]||(t[2]=s=>n.ventaDialog=!1)})]),_:1}),T(X,null,{default:F(()=>[T($t,{onSubmit:r.submitVenta},{default:F(()=>[h("div",Nn,[h("div",Mn,[T(ct,{modelValue:n.venta.nit,"onUpdate:modelValue":[t[3]||(t[3]=s=>n.venta.nit=s),r.searchCliente],outlined:"",dense:"",label:"CI/NIT"},null,8,["modelValue","onUpdate:modelValue"])]),h("div",In,[T(ct,{modelValue:n.venta.nombre,"onUpdate:modelValue":t[4]||(t[4]=s=>n.venta.nombre=s),outlined:"",dense:"",label:"Nombre"},null,8,["modelValue"])]),h("div",Sn,[T(pt,{dense:"","wrap-cells":"",flat:"",bordered:""},{default:F(()=>[t[15]||(t[15]=h("thead",null,[h("tr",null,[h("th",null,"Producto"),h("th",null,"Cantidad"),h("th",null,"Precio"),h("th",null,"Subtotal")])],-1)),h("tbody",null,[(k(!0),q(ht,null,ut(n.productosVentas,(s,l)=>(k(),q("tr",null,[h("td",Ln,[h("div",$n,M(e.$filters.textUpper(s.producto.nombre)),1)]),h("td",xn,M(s.cantidad),1),h("td",Pn,M(s.precio)+" Bs ",1),h("td",Rn,M(s.cantidad*s.precio)+" Bs ",1)]))),256))]),h("tfoot",null,[h("tr",null,[t[12]||(t[12]=h("td",{colspan:"3",class:"text-right text-bold"},"Total",-1)),h("td",_n,M(n.productosVentas.reduce((s,l)=>s+l.cantidad*l.precio,0))+" Bs",1)]),h("tr",null,[t[13]||(t[13]=h("td",{style:{padding:"0",margin:"0"},colspan:"3",class:"text-right text-bold"},"Efectivo",-1)),h("td",Dn,[h("div",Un,[ft(h("input",{"onUpdate:modelValue":t[5]||(t[5]=s=>n.efectivo=s),outlined:"",dense:"",label:"Efectivo",style:{width:"100px"}},null,512),[[gt,n.efectivo]])])])]),h("tr",null,[t[14]||(t[14]=h("td",{style:{padding:"0",margin:"0"},colspan:"3",class:"text-right text-bold"},"Cambio",-1)),h("td",On,M(r.cambio),1)])])]),_:1})]),h("div",Vn,[T(H,{label:"Realizar venta",color:"positive",class:"full-width","no-caps":"",loading:n.loading,type:"submit"},null,8,["loading"])])])]),_:1},8,["onSubmit"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),t[16]||(t[16]=h("div",{id:"myElement",class:"hidden"},null,-1))]),_:1})}var Jn=ae(an,[["render",kn]]);export{Jn as default};
