import{u as x}from"./index.e7cecd5a.js";import{P as R}from"./index.aa4d44c1.js";import{h as Ie}from"./moment.40bc58bf.js";var S={},Se=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},Wt={},L={};let wt;const Le=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];L.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};L.getSymbolTotalCodewords=function(t){return Le[t]};L.getBCHDigit=function(n){let t=0;for(;n!==0;)t++,n>>>=1;return t};L.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');wt=t};L.isKanjiModeEnabled=function(){return typeof wt!="undefined"};L.toSJIS=function(t){return wt(t)};var it={};(function(n){n.L={bit:1},n.M={bit:0},n.Q={bit:3},n.H={bit:2};function t(e){if(typeof e!="string")throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return n.L;case"m":case"medium":return n.M;case"q":case"quartile":return n.Q;case"h":case"high":return n.H;default:throw new Error("Unknown EC Level: "+e)}}n.isValid=function(r){return r&&typeof r.bit!="undefined"&&r.bit>=0&&r.bit<4},n.from=function(r,o){if(n.isValid(r))return r;try{return t(r)}catch{return o}}})(it);function te(){this.buffer=[],this.length=0}te.prototype={get:function(n){const t=Math.floor(n/8);return(this.buffer[t]>>>7-n%8&1)===1},put:function(n,t){for(let e=0;e<t;e++)this.putBit((n>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(n){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),n&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var xe=te;function Z(n){if(!n||n<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=n,this.data=new Uint8Array(n*n),this.reservedBit=new Uint8Array(n*n)}Z.prototype.set=function(n,t,e,r){const o=n*this.size+t;this.data[o]=e,r&&(this.reservedBit[o]=!0)};Z.prototype.get=function(n,t){return this.data[n*this.size+t]};Z.prototype.xor=function(n,t,e){this.data[n*this.size+t]^=e};Z.prototype.isReserved=function(n,t){return this.reservedBit[n*this.size+t]};var Re=Z,ee={};(function(n){const t=L.getSymbolSize;n.getRowColCoords=function(r){if(r===1)return[];const o=Math.floor(r/7)+2,i=t(r),s=i===145?26:Math.ceil((i-13)/(2*o-2))*2,l=[i-7];for(let a=1;a<o-1;a++)l[a]=l[a-1]-s;return l.push(6),l.reverse()},n.getPositions=function(r){const o=[],i=n.getRowColCoords(r),s=i.length;for(let l=0;l<s;l++)for(let a=0;a<s;a++)l===0&&a===0||l===0&&a===s-1||l===s-1&&a===0||o.push([i[l],i[a]]);return o}})(ee);var ne={};const Pe=L.getSymbolSize,Gt=7;ne.getPositions=function(t){const e=Pe(t);return[[0,0],[e-Gt,0],[0,e-Gt]]};var oe={};(function(n){n.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const t={N1:3,N2:3,N3:40,N4:10};n.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},n.from=function(o){return n.isValid(o)?parseInt(o,10):void 0},n.getPenaltyN1=function(o){const i=o.size;let s=0,l=0,a=0,c=null,d=null;for(let f=0;f<i;f++){l=a=0,c=d=null;for(let u=0;u<i;u++){let h=o.get(f,u);h===c?l++:(l>=5&&(s+=t.N1+(l-5)),c=h,l=1),h=o.get(u,f),h===d?a++:(a>=5&&(s+=t.N1+(a-5)),d=h,a=1)}l>=5&&(s+=t.N1+(l-5)),a>=5&&(s+=t.N1+(a-5))}return s},n.getPenaltyN2=function(o){const i=o.size;let s=0;for(let l=0;l<i-1;l++)for(let a=0;a<i-1;a++){const c=o.get(l,a)+o.get(l,a+1)+o.get(l+1,a)+o.get(l+1,a+1);(c===4||c===0)&&s++}return s*t.N2},n.getPenaltyN3=function(o){const i=o.size;let s=0,l=0,a=0;for(let c=0;c<i;c++){l=a=0;for(let d=0;d<i;d++)l=l<<1&2047|o.get(c,d),d>=10&&(l===1488||l===93)&&s++,a=a<<1&2047|o.get(d,c),d>=10&&(a===1488||a===93)&&s++}return s*t.N3},n.getPenaltyN4=function(o){let i=0;const s=o.data.length;for(let a=0;a<s;a++)i+=o.data[a];return Math.abs(Math.ceil(i*100/s/5)-10)*t.N4};function e(r,o,i){switch(r){case n.Patterns.PATTERN000:return(o+i)%2===0;case n.Patterns.PATTERN001:return o%2===0;case n.Patterns.PATTERN010:return i%3===0;case n.Patterns.PATTERN011:return(o+i)%3===0;case n.Patterns.PATTERN100:return(Math.floor(o/2)+Math.floor(i/3))%2===0;case n.Patterns.PATTERN101:return o*i%2+o*i%3===0;case n.Patterns.PATTERN110:return(o*i%2+o*i%3)%2===0;case n.Patterns.PATTERN111:return(o*i%3+(o+i)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}n.applyMask=function(o,i){const s=i.size;for(let l=0;l<s;l++)for(let a=0;a<s;a++)i.isReserved(a,l)||i.xor(a,l,e(o,a,l))},n.getBestMask=function(o,i){const s=Object.keys(n.Patterns).length;let l=0,a=1/0;for(let c=0;c<s;c++){i(c),n.applyMask(c,o);const d=n.getPenaltyN1(o)+n.getPenaltyN2(o)+n.getPenaltyN3(o)+n.getPenaltyN4(o);n.applyMask(c,o),d<a&&(a=d,l=c)}return l}})(oe);var st={};const z=it,tt=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],et=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];st.getBlocksCount=function(t,e){switch(e){case z.L:return tt[(t-1)*4+0];case z.M:return tt[(t-1)*4+1];case z.Q:return tt[(t-1)*4+2];case z.H:return tt[(t-1)*4+3];default:return}};st.getTotalCodewordsCount=function(t,e){switch(e){case z.L:return et[(t-1)*4+0];case z.M:return et[(t-1)*4+1];case z.Q:return et[(t-1)*4+2];case z.H:return et[(t-1)*4+3];default:return}};var re={},at={};const K=new Uint8Array(512),ot=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)K[e]=t,ot[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)K[e]=K[e-255]})();at.log=function(t){if(t<1)throw new Error("log("+t+")");return ot[t]};at.exp=function(t){return K[t]};at.mul=function(t,e){return t===0||e===0?0:K[ot[t]+ot[e]]};(function(n){const t=at;n.mul=function(r,o){const i=new Uint8Array(r.length+o.length-1);for(let s=0;s<r.length;s++)for(let l=0;l<o.length;l++)i[s+l]^=t.mul(r[s],o[l]);return i},n.mod=function(r,o){let i=new Uint8Array(r);for(;i.length-o.length>=0;){const s=i[0];for(let a=0;a<o.length;a++)i[a]^=t.mul(o[a],s);let l=0;for(;l<i.length&&i[l]===0;)l++;i=i.slice(l)}return i},n.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let i=0;i<r;i++)o=n.mul(o,new Uint8Array([1,t.exp(i)]));return o}})(re);const ie=re;function bt(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}bt.prototype.initialize=function(t){this.degree=t,this.genPoly=ie.generateECPolynomial(this.degree)};bt.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const e=new Uint8Array(t.length+this.degree);e.set(t);const r=ie.mod(e,this.genPoly),o=this.degree-r.length;if(o>0){const i=new Uint8Array(this.degree);return i.set(r,o),i}return r};var De=bt,se={},_={},Tt={};Tt.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40};var D={};const ae="[0-9]+",Oe="[A-Z $%*+\\-./:]+";let G="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";G=G.replace(/u/g,"\\u");const Ue="(?:(?![A-Z0-9 $%*+\\-./:]|"+G+`)(?:.|[\r
]))+`;D.KANJI=new RegExp(G,"g");D.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");D.BYTE=new RegExp(Ue,"g");D.NUMERIC=new RegExp(ae,"g");D.ALPHANUMERIC=new RegExp(Oe,"g");const ze=new RegExp("^"+G+"$"),_e=new RegExp("^"+ae+"$"),ke=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");D.testKanji=function(t){return ze.test(t)};D.testNumeric=function(t){return _e.test(t)};D.testAlphanumeric=function(t){return ke.test(t)};(function(n){const t=Tt,e=D;n.NUMERIC={id:"Numeric",bit:1<<0,ccBits:[10,12,14]},n.ALPHANUMERIC={id:"Alphanumeric",bit:1<<1,ccBits:[9,11,13]},n.BYTE={id:"Byte",bit:1<<2,ccBits:[8,16,16]},n.KANJI={id:"Kanji",bit:1<<3,ccBits:[8,10,12]},n.MIXED={bit:-1},n.getCharCountIndicator=function(i,s){if(!i.ccBits)throw new Error("Invalid mode: "+i);if(!t.isValid(s))throw new Error("Invalid version: "+s);return s>=1&&s<10?i.ccBits[0]:s<27?i.ccBits[1]:i.ccBits[2]},n.getBestModeForData=function(i){return e.testNumeric(i)?n.NUMERIC:e.testAlphanumeric(i)?n.ALPHANUMERIC:e.testKanji(i)?n.KANJI:n.BYTE},n.toString=function(i){if(i&&i.id)return i.id;throw new Error("Invalid mode")},n.isValid=function(i){return i&&i.bit&&i.ccBits};function r(o){if(typeof o!="string")throw new Error("Param is not a string");switch(o.toLowerCase()){case"numeric":return n.NUMERIC;case"alphanumeric":return n.ALPHANUMERIC;case"kanji":return n.KANJI;case"byte":return n.BYTE;default:throw new Error("Unknown mode: "+o)}}n.from=function(i,s){if(n.isValid(i))return i;try{return r(i)}catch{return s}}})(_);(function(n){const t=L,e=st,r=it,o=_,i=Tt,s=1<<12|1<<11|1<<10|1<<9|1<<8|1<<5|1<<2|1<<0,l=t.getBCHDigit(s);function a(u,h,p){for(let E=1;E<=40;E++)if(h<=n.getCapacity(E,p,u))return E}function c(u,h){return o.getCharCountIndicator(u,h)+4}function d(u,h){let p=0;return u.forEach(function(E){p+=c(E.mode,h)+E.getBitsLength()}),p}function f(u,h){for(let p=1;p<=40;p++)if(d(u,p)<=n.getCapacity(p,h,o.MIXED))return p}n.from=function(h,p){return i.isValid(h)?parseInt(h,10):p},n.getCapacity=function(h,p,E){if(!i.isValid(h))throw new Error("Invalid QR Code version");typeof E=="undefined"&&(E=o.BYTE);const w=t.getSymbolTotalCodewords(h),g=e.getTotalCodewordsCount(h,p),m=(w-g)*8;if(E===o.MIXED)return m;const y=m-c(E,h);switch(E){case o.NUMERIC:return Math.floor(y/10*3);case o.ALPHANUMERIC:return Math.floor(y/11*2);case o.KANJI:return Math.floor(y/13);case o.BYTE:default:return Math.floor(y/8)}},n.getBestVersionForData=function(h,p){let E;const w=r.from(p,r.M);if(Array.isArray(h)){if(h.length>1)return f(h,w);if(h.length===0)return 1;E=h[0]}else E=h;return a(E.mode,E.getLength(),w)},n.getEncodedBits=function(h){if(!i.isValid(h)||h<7)throw new Error("Invalid QR Code version");let p=h<<12;for(;t.getBCHDigit(p)-l>=0;)p^=s<<t.getBCHDigit(p)-l;return h<<12|p}})(se);var le={};const yt=L,ce=1<<10|1<<8|1<<5|1<<4|1<<2|1<<1|1<<0,Ve=1<<14|1<<12|1<<10|1<<4|1<<1,Zt=yt.getBCHDigit(ce);le.getEncodedBits=function(t,e){const r=t.bit<<3|e;let o=r<<10;for(;yt.getBCHDigit(o)-Zt>=0;)o^=ce<<yt.getBCHDigit(o)-Zt;return(r<<10|o)^Ve};var de={};const He=_;function V(n){this.mode=He.NUMERIC,this.data=n.toString()}V.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};V.prototype.getLength=function(){return this.data.length};V.prototype.getBitsLength=function(){return V.getBitsLength(this.data.length)};V.prototype.write=function(t){let e,r,o;for(e=0;e+3<=this.data.length;e+=3)r=this.data.substr(e,3),o=parseInt(r,10),t.put(o,10);const i=this.data.length-e;i>0&&(r=this.data.substr(e),o=parseInt(r,10),t.put(o,i*3+1))};var Je=V;const je=_,ht=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function H(n){this.mode=je.ALPHANUMERIC,this.data=n}H.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};H.prototype.getLength=function(){return this.data.length};H.prototype.getBitsLength=function(){return H.getBitsLength(this.data.length)};H.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let r=ht.indexOf(this.data[e])*45;r+=ht.indexOf(this.data[e+1]),t.put(r,11)}this.data.length%2&&t.put(ht.indexOf(this.data[e]),6)};var Ye=H;const qe=_;function J(n){this.mode=qe.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}J.getBitsLength=function(t){return t*8};J.prototype.getLength=function(){return this.data.length};J.prototype.getBitsLength=function(){return J.getBitsLength(this.data.length)};J.prototype.write=function(n){for(let t=0,e=this.data.length;t<e;t++)n.put(this.data[t],8)};var Ke=J;const Ge=_,Ze=L;function j(n){this.mode=Ge.KANJI,this.data=n}j.getBitsLength=function(t){return t*13};j.prototype.getLength=function(){return this.data.length};j.prototype.getBitsLength=function(){return j.getBitsLength(this.data.length)};j.prototype.write=function(n){let t;for(t=0;t<this.data.length;t++){let e=Ze.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),n.put(e,13)}};var Qe=j,ue={exports:{}};(function(n){var t={single_source_shortest_paths:function(e,r,o){var i={},s={};s[r]=0;var l=t.PriorityQueue.make();l.push(r,0);for(var a,c,d,f,u,h,p,E,w;!l.empty();){a=l.pop(),c=a.value,f=a.cost,u=e[c]||{};for(d in u)u.hasOwnProperty(d)&&(h=u[d],p=f+h,E=s[d],w=typeof s[d]=="undefined",(w||E>p)&&(s[d]=p,l.push(d,p),i[d]=c))}if(typeof o!="undefined"&&typeof s[o]=="undefined"){var g=["Could not find a path from ",r," to ",o,"."].join("");throw new Error(g)}return i},extract_shortest_path_from_predecessor_list:function(e,r){for(var o=[],i=r;i;)o.push(i),e[i],i=e[i];return o.reverse(),o},find_path:function(e,r,o){var i=t.single_source_shortest_paths(e,r,o);return t.extract_shortest_path_from_predecessor_list(i,o)},PriorityQueue:{make:function(e){var r=t.PriorityQueue,o={},i;e=e||{};for(i in r)r.hasOwnProperty(i)&&(o[i]=r[i]);return o.queue=[],o.sorter=e.sorter||r.default_sorter,o},default_sorter:function(e,r){return e.cost-r.cost},push:function(e,r){var o={value:e,cost:r};this.queue.push(o),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};n.exports=t})(ue);(function(n){const t=_,e=Je,r=Ye,o=Ke,i=Qe,s=D,l=L,a=ue.exports;function c(g){return unescape(encodeURIComponent(g)).length}function d(g,m,y){const v=[];let C;for(;(C=g.exec(y))!==null;)v.push({data:C[0],index:C.index,mode:m,length:C[0].length});return v}function f(g){const m=d(s.NUMERIC,t.NUMERIC,g),y=d(s.ALPHANUMERIC,t.ALPHANUMERIC,g);let v,C;return l.isKanjiModeEnabled()?(v=d(s.BYTE,t.BYTE,g),C=d(s.KANJI,t.KANJI,g)):(v=d(s.BYTE_KANJI,t.BYTE,g),C=[]),m.concat(y,v,C).sort(function($,B){return $.index-B.index}).map(function($){return{data:$.data,mode:$.mode,length:$.length}})}function u(g,m){switch(m){case t.NUMERIC:return e.getBitsLength(g);case t.ALPHANUMERIC:return r.getBitsLength(g);case t.KANJI:return i.getBitsLength(g);case t.BYTE:return o.getBitsLength(g)}}function h(g){return g.reduce(function(m,y){const v=m.length-1>=0?m[m.length-1]:null;return v&&v.mode===y.mode?(m[m.length-1].data+=y.data,m):(m.push(y),m)},[])}function p(g){const m=[];for(let y=0;y<g.length;y++){const v=g[y];switch(v.mode){case t.NUMERIC:m.push([v,{data:v.data,mode:t.ALPHANUMERIC,length:v.length},{data:v.data,mode:t.BYTE,length:v.length}]);break;case t.ALPHANUMERIC:m.push([v,{data:v.data,mode:t.BYTE,length:v.length}]);break;case t.KANJI:m.push([v,{data:v.data,mode:t.BYTE,length:c(v.data)}]);break;case t.BYTE:m.push([{data:v.data,mode:t.BYTE,length:c(v.data)}])}}return m}function E(g,m){const y={},v={start:{}};let C=["start"];for(let b=0;b<g.length;b++){const $=g[b],B=[];for(let M=0;M<$.length;M++){const F=$[M],N=""+b+M;B.push(N),y[N]={node:F,lastCount:0},v[N]={};for(let I=0;I<C.length;I++){const A=C[I];y[A]&&y[A].node.mode===F.mode?(v[A][N]=u(y[A].lastCount+F.length,F.mode)-u(y[A].lastCount,F.mode),y[A].lastCount+=F.length):(y[A]&&(y[A].lastCount=F.length),v[A][N]=u(F.length,F.mode)+4+t.getCharCountIndicator(F.mode,m))}}C=B}for(let b=0;b<C.length;b++)v[C[b]].end=0;return{map:v,table:y}}function w(g,m){let y;const v=t.getBestModeForData(g);if(y=t.from(m,v),y!==t.BYTE&&y.bit<v.bit)throw new Error('"'+g+'" cannot be encoded with mode '+t.toString(y)+`.
 Suggested mode is: `+t.toString(v));switch(y===t.KANJI&&!l.isKanjiModeEnabled()&&(y=t.BYTE),y){case t.NUMERIC:return new e(g);case t.ALPHANUMERIC:return new r(g);case t.KANJI:return new i(g);case t.BYTE:return new o(g)}}n.fromArray=function(m){return m.reduce(function(y,v){return typeof v=="string"?y.push(w(v,null)):v.data&&y.push(w(v.data,v.mode)),y},[])},n.fromString=function(m,y){const v=f(m,l.isKanjiModeEnabled()),C=p(v),b=E(C,y),$=a.find_path(b.map,"start","end"),B=[];for(let M=1;M<$.length-1;M++)B.push(b.table[$[M]].node);return n.fromArray(h(B))},n.rawSplit=function(m){return n.fromArray(f(m,l.isKanjiModeEnabled()))}})(de);const lt=L,ft=it,Xe=xe,We=Re,tn=ee,en=ne,vt=oe,Et=st,nn=De,rt=se,on=le,rn=_,gt=de;function sn(n,t){const e=n.size,r=en.getPositions(t);for(let o=0;o<r.length;o++){const i=r[o][0],s=r[o][1];for(let l=-1;l<=7;l++)if(!(i+l<=-1||e<=i+l))for(let a=-1;a<=7;a++)s+a<=-1||e<=s+a||(l>=0&&l<=6&&(a===0||a===6)||a>=0&&a<=6&&(l===0||l===6)||l>=2&&l<=4&&a>=2&&a<=4?n.set(i+l,s+a,!0,!0):n.set(i+l,s+a,!1,!0))}}function an(n){const t=n.size;for(let e=8;e<t-8;e++){const r=e%2===0;n.set(e,6,r,!0),n.set(6,e,r,!0)}}function ln(n,t){const e=tn.getPositions(t);for(let r=0;r<e.length;r++){const o=e[r][0],i=e[r][1];for(let s=-2;s<=2;s++)for(let l=-2;l<=2;l++)s===-2||s===2||l===-2||l===2||s===0&&l===0?n.set(o+s,i+l,!0,!0):n.set(o+s,i+l,!1,!0)}}function cn(n,t){const e=n.size,r=rt.getEncodedBits(t);let o,i,s;for(let l=0;l<18;l++)o=Math.floor(l/3),i=l%3+e-8-3,s=(r>>l&1)===1,n.set(o,i,s,!0),n.set(i,o,s,!0)}function mt(n,t,e){const r=n.size,o=on.getEncodedBits(t,e);let i,s;for(i=0;i<15;i++)s=(o>>i&1)===1,i<6?n.set(i,8,s,!0):i<8?n.set(i+1,8,s,!0):n.set(r-15+i,8,s,!0),i<8?n.set(8,r-i-1,s,!0):i<9?n.set(8,15-i-1+1,s,!0):n.set(8,15-i-1,s,!0);n.set(r-8,8,1,!0)}function dn(n,t){const e=n.size;let r=-1,o=e-1,i=7,s=0;for(let l=e-1;l>0;l-=2)for(l===6&&l--;;){for(let a=0;a<2;a++)if(!n.isReserved(o,l-a)){let c=!1;s<t.length&&(c=(t[s]>>>i&1)===1),n.set(o,l-a,c),i--,i===-1&&(s++,i=7)}if(o+=r,o<0||e<=o){o-=r,r=-r;break}}}function un(n,t,e){const r=new Xe;e.forEach(function(a){r.put(a.mode.bit,4),r.put(a.getLength(),rn.getCharCountIndicator(a.mode,n)),a.write(r)});const o=lt.getSymbolTotalCodewords(n),i=Et.getTotalCodewordsCount(n,t),s=(o-i)*8;for(r.getLengthInBits()+4<=s&&r.put(0,4);r.getLengthInBits()%8!==0;)r.putBit(0);const l=(s-r.getLengthInBits())/8;for(let a=0;a<l;a++)r.put(a%2?17:236,8);return hn(r,n,t)}function hn(n,t,e){const r=lt.getSymbolTotalCodewords(t),o=Et.getTotalCodewordsCount(t,e),i=r-o,s=Et.getBlocksCount(t,e),l=r%s,a=s-l,c=Math.floor(r/s),d=Math.floor(i/s),f=d+1,u=c-d,h=new nn(u);let p=0;const E=new Array(s),w=new Array(s);let g=0;const m=new Uint8Array(n.buffer);for(let $=0;$<s;$++){const B=$<a?d:f;E[$]=m.slice(p,p+B),w[$]=h.encode(E[$]),p+=B,g=Math.max(g,B)}const y=new Uint8Array(r);let v=0,C,b;for(C=0;C<g;C++)for(b=0;b<s;b++)C<E[b].length&&(y[v++]=E[b][C]);for(C=0;C<u;C++)for(b=0;b<s;b++)y[v++]=w[b][C];return y}function fn(n,t,e,r){let o;if(Array.isArray(n))o=gt.fromArray(n);else if(typeof n=="string"){let c=t;if(!c){const d=gt.rawSplit(n);c=rt.getBestVersionForData(d,e)}o=gt.fromString(n,c||40)}else throw new Error("Invalid data");const i=rt.getBestVersionForData(o,e);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);const s=un(t,e,o),l=lt.getSymbolSize(t),a=new We(l);return sn(a,t),an(a),ln(a,t),mt(a,e,0),t>=7&&cn(a,t),dn(a,s),isNaN(r)&&(r=vt.getBestMask(a,mt.bind(null,a,e))),vt.applyMask(r,a),mt(a,e,r),{modules:a,version:t,errorCorrectionLevel:e,maskPattern:r,segments:o}}Wt.create=function(t,e){if(typeof t=="undefined"||t==="")throw new Error("No input text");let r=ft.M,o,i;return typeof e!="undefined"&&(r=ft.from(e.errorCorrectionLevel,ft.M),o=rt.from(e.version),i=vt.from(e.maskPattern),e.toSJISFunc&&lt.setToSJISFunction(e.toSJISFunc)),fn(t,o,r,i)};var he={},At={};(function(n){function t(e){if(typeof e=="number"&&(e=e.toString()),typeof e!="string")throw new Error("Color should be defined as hex string");let r=e.slice().replace("#","").split("");if(r.length<3||r.length===5||r.length>8)throw new Error("Invalid hex color: "+e);(r.length===3||r.length===4)&&(r=Array.prototype.concat.apply([],r.map(function(i){return[i,i]}))),r.length===6&&r.push("F","F");const o=parseInt(r.join(""),16);return{r:o>>24&255,g:o>>16&255,b:o>>8&255,a:o&255,hex:"#"+r.slice(0,6).join("")}}n.getOptions=function(r){r||(r={}),r.color||(r.color={});const o=typeof r.margin=="undefined"||r.margin===null||r.margin<0?4:r.margin,i=r.width&&r.width>=21?r.width:void 0,s=r.scale||4;return{width:i,scale:i?4:s,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},n.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},n.getImageWidth=function(r,o){const i=n.getScale(r,o);return Math.floor((r+o.margin*2)*i)},n.qrToImageData=function(r,o,i){const s=o.modules.size,l=o.modules.data,a=n.getScale(s,i),c=Math.floor((s+i.margin*2)*a),d=i.margin*a,f=[i.color.light,i.color.dark];for(let u=0;u<c;u++)for(let h=0;h<c;h++){let p=(u*c+h)*4,E=i.color.light;if(u>=d&&h>=d&&u<c-d&&h<c-d){const w=Math.floor((u-d)/a),g=Math.floor((h-d)/a);E=f[l[w*s+g]?1:0]}r[p++]=E.r,r[p++]=E.g,r[p++]=E.b,r[p]=E.a}}})(At);(function(n){const t=At;function e(o,i,s){o.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=s,i.width=s,i.style.height=s+"px",i.style.width=s+"px"}function r(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}n.render=function(i,s,l){let a=l,c=s;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),s||(c=r()),a=t.getOptions(a);const d=t.getImageWidth(i.modules.size,a),f=c.getContext("2d"),u=f.createImageData(d,d);return t.qrToImageData(u.data,i,a),e(f,c,d),f.putImageData(u,0,0),c},n.renderToDataURL=function(i,s,l){let a=l;typeof a=="undefined"&&(!s||!s.getContext)&&(a=s,s=void 0),a||(a={});const c=n.render(i,s,a),d=a.type||"image/png",f=a.rendererOpts||{};return c.toDataURL(d,f.quality)}})(he);var fe={};const gn=At;function Qt(n,t){const e=n.a/255,r=t+'="'+n.hex+'"';return e<1?r+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':r}function pt(n,t,e){let r=n+t;return typeof e!="undefined"&&(r+=" "+e),r}function mn(n,t,e){let r="",o=0,i=!1,s=0;for(let l=0;l<n.length;l++){const a=Math.floor(l%t),c=Math.floor(l/t);!a&&!i&&(i=!0),n[l]?(s++,l>0&&a>0&&n[l-1]||(r+=i?pt("M",a+e,.5+c+e):pt("m",o,0),o=0,i=!1),a+1<t&&n[l+1]||(r+=pt("h",s),s=0)):o++}return r}fe.render=function(t,e,r){const o=gn.getOptions(e),i=t.modules.size,s=t.modules.data,l=i+o.margin*2,a=o.color.light.a?"<path "+Qt(o.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",c="<path "+Qt(o.color.dark,"stroke")+' d="'+mn(s,i,o.margin)+'"/>',d='viewBox="0 0 '+l+" "+l+'"',f=o.width?'width="'+o.width+'" height="'+o.width+'" ':"",u='<svg xmlns="http://www.w3.org/2000/svg" '+f+d+' shape-rendering="crispEdges">'+a+c+`</svg>
`;return typeof r=="function"&&r(null,u),u};const pn=Se,Ct=Wt,ge=he,yn=fe;function $t(n,t,e,r,o){const i=[].slice.call(arguments,1),s=i.length,l=typeof i[s-1]=="function";if(!l&&!pn())throw new Error("Callback required as last argument");if(l){if(s<2)throw new Error("Too few arguments provided");s===2?(o=e,e=t,t=r=void 0):s===3&&(t.getContext&&typeof o=="undefined"?(o=r,r=void 0):(o=r,r=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=r=void 0):s===2&&!t.getContext&&(r=e,e=t,t=void 0),new Promise(function(a,c){try{const d=Ct.create(e,r);a(n(d,t,r))}catch(d){c(d)}})}try{const a=Ct.create(e,r);o(null,n(a,t,r))}catch(a){o(a)}}S.create=Ct.create;S.toCanvas=$t.bind(null,ge.render);S.toDataURL=$t.bind(null,ge.renderToDataURL);S.toString=$t.bind(null,function(n,t,e){return yn.render(n,e)});class vn{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,r=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){r=!1;break}return r?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let r=this.tens[t.charAt(0)-3];return e>0&&(r+=" y "+this.getUnits(e)),r}getHundreds(t){let e="",r=t.charAt(0),o=t.substr(1);if(t==100)return"cien";switch(r){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(r)+"cientos"),o>0&&(e+=" "+this.getName(o)),e}getThousands(t){let e="mil",r=t.length-3,o=t.substr(0,r),i=t.substr(r);return o>1&&(e=this.getName(o).replace("uno","un")+" mil"),i>0&&(e+=" "+this.getName(i)),e}getPeriod(t,e,r){let o="un "+r,i=t.length-e,s=t.substr(0,i),l=t.substr(i);return s>1&&(o=this.getName(s).replace("uno","un")+" "+r.replace("\xF3","o")+"es"),l>0&&(o+=" "+this.getName(l)),o}}var U={conversorNumerosALetras:vn},me={};Object.defineProperty(me,"__esModule",{value:!0});function nt(n){switch(n){case 1:return"Un";case 2:return"Dos";case 3:return"Tres";case 4:return"Cuatro";case 5:return"Cinco";case 6:return"Seis";case 7:return"Siete";case 8:return"Ocho";case 9:return"Nueve";default:return""}}function k(n,t){return t>0?n+" y "+nt(t):n}function P(n){var t=Math.floor(n/10),e=n-t*10;switch(t){case 1:switch(e){case 0:return"Diez";case 1:return"Once";case 2:return"Doce";case 3:return"Trece";case 4:return"Catorce";case 5:return"Quince";default:return"Dieci"+nt(e).toLowerCase()}case 2:switch(e){case 0:return"Veinte";default:return"Veinti"+nt(e).toLowerCase()}case 3:return k("Treinta",e);case 4:return k("Cuarenta",e);case 5:return k("Cincuenta",e);case 6:return k("Sesenta",e);case 7:return k("Setenta",e);case 8:return k("Ochenta",e);case 9:return k("Noventa",e);case 0:return nt(e);default:return""}}function pe(n){var t=Math.floor(n/100),e=n-t*100;switch(t){case 1:return e>0?"Ciento "+P(e):"Cien";case 2:return"Doscientos "+P(e);case 3:return"Trescientos "+P(e);case 4:return"Cuatrocientos "+P(e);case 5:return"Quinientos "+P(e);case 6:return"Seiscientos "+P(e);case 7:return"Setecientos "+P(e);case 8:return"Ochocientos "+P(e);case 9:return"Novecientos "+P(e);default:return P(e)}}function ye(n,t,e,r){var o=Math.floor(n/t),i=n-o*t,s="";return o>0&&(o>1?s=pe(o)+" "+r:s=e),i>0&&(s+=""),s}function En(n){var t=1e3,e=Math.floor(n/t),r=n-e*t,o=ye(n,t,"Un Mil","Mil"),i=pe(r);return o===""?i:(o+" "+i).trim()}function Xt(n){var t=1e6,e=Math.floor(n/t),r=n-e*t,o=ye(n,t,"Un Mill\xF3n de","Millones de"),i=En(r);return o===""?i:(o+" "+i).trim()}function Cn(n){var t={numero:n,enteros:Math.floor(n),centavos:Math.round(n*100)-Math.floor(n)*100,letrasCentavos:"",letrasMonedaPlural:"Pesos",letrasMonedaSingular:"Peso",letrasMonedaCentavoPlural:"/100 M.N.",letrasMonedaCentavoSingular:"/100 M.N."};return t.centavos>=0&&(t.letrasCentavos=function(){return t.centavos>=1&t.centavos<=9?"0"+t.centavos+t.letrasMonedaCentavoSingular:t.centavos===0?"00"+t.letrasMonedaCentavoSingular:t.centavos+t.letrasMonedaCentavoPlural}()),t.enteros===0?("Cero "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim():t.enteros===1?(Xt(t.enteros)+" "+t.letrasMonedaSingular+" "+t.letrasCentavos).trim():(Xt(t.enteros)+" "+t.letrasMonedaPlural+" "+t.letrasCentavos).trim()}me.NumerosALetras=Cn;class $n{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],r=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],o={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},i=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function s(f){if(f<10)return e[f];if(f>=10&&f<20)return o[f];if(f<100){const h=f%10;return`${r[Math.floor(f/10)]}${h>0?" y "+e[h]:""}`}if(f===100)return"cien";const u=f%100;return`${i[Math.floor(f/100)]}${u>0?" "+s(u):""}`}if(t===1e6)return"un mill\xF3n";let l=Math.floor(t/1e3),a=t%1e3,c=l>0?l===1?"mil":`${s(l)} mil`:"",d=a>0?s(a):"";return(c+" "+d).trim()}static imprimirCaja(t){}static async factura(t){return new Promise(async(e,r)=>{var o,i,s,l,a,c,d,f,u,h,p,E,w,g,m,y,v,C,b,$,B;try{const M=U.conversorNumerosALetras,F=new M,N=x().env,I=T=>Number(T||0).toFixed(2),A=T=>(T!=null?T:"").toString(),O=Number((i=(o=t.total)!=null?o:t.montoTotal)!=null?i:0),Y=(a=(l=(s=t.numeroFactura)!=null?s:t.numero_factura)!=null?l:t.id)!=null?a:"\u2014",Q=(c=t.fechaEmision)!=null?c:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",X=(u=(f=t.nombre)!=null?f:(d=t==null?void 0:t.cliente)==null?void 0:d.nombre)!=null?u:"SN",Nt=(E=(p=t.complemento)!=null?p:(h=t==null?void 0:t.cliente)==null?void 0:h.complemento)!=null?E:"",ve=(m=(g=t.ci)!=null?g:(w=t==null?void 0:t.cliente)==null?void 0:w.ci)!=null?m:"0",Ee=(C=(v=t.cliente_id)!=null?v:(y=t==null?void 0:t.cliente)==null?void 0:y.id)!=null?C:"\u2014",Ce=(b=N==null?void 0:N.puntoVenta)!=null?b:0,ct=($=t.cuf)!=null?$:null,q=ct?ct.match(/.{1,20}/g).join("<br>"):null,we=ct?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",be=(B=t.leyenda)!=null?B:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",Te=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],Bt=Math.floor(O),Ae=Math.round((O-Bt)*100).toString().padStart(2,"0"),$e=`Son ${F.convertToText(Bt)} ${Ae}/100 Bolivianos`;let W=null;q&&(W=await S.toDataURL(`${N.url2}consulta/QR?nit=${N.nit}&cuf=${q}&numero=${Y}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let dt=`${this.head()}
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
    <tr><td class="lbl">C\xD3D. AUTORIZACI\xD3N</td><td class="val">${q!=null?q:"\u2014"}</td></tr>
  </table>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NOMBRE/RAZ\xD3N SOCIAL</td><td class="val">${A(X)}</td></tr>
    <tr><td class="lbl">NIT/CI/CEX</td><td class="val">${A(ve)}${A(Nt?"-"+Nt:"")}</td></tr>
    <tr><td class="lbl">NRO. CLIENTE</td><td class="val">${A(Ee)}</td></tr>
    <tr><td class="lbl">FECHA DE EMISI\xD3N</td><td class="val">${A(Q)}</td></tr>
  </table>

  <hr>
  <div class="det-header center">DETALLE</div>`;Te.forEach(T=>{var St,Lt,xt,Rt,Pt,Dt,Ot,Ut,zt,_t,kt,Vt,Ht,Jt,jt,Yt,qt,Kt;const Ne=(Rt=(xt=(St=T.producto_id)!=null?St:T.product_id)!=null?xt:(Lt=T==null?void 0:T.producto)==null?void 0:Lt.id)!=null?Rt:"\u2014",Be=A((Ut=(Ot=(Pt=T.nombre)!=null?Pt:T.descripcion)!=null?Ot:(Dt=T==null?void 0:T.producto)==null?void 0:Dt.nombre)!=null?Ut:""),Me=A((kt=(_t=T.unidad)!=null?_t:(zt=T==null?void 0:T.producto)==null?void 0:zt.unidad)!=null?kt:""),Mt=Number((Ht=(Vt=T.cantidad)!=null?Vt:T.qty)!=null?Ht:0),Ft=Number((jt=(Jt=T.precio)!=null?Jt:T.precioUnitario)!=null?jt:0),It=Number((qt=(Yt=T.descuento)!=null?Yt:T.montoDescuento)!=null?qt:0),Fe=(Kt=T.subTotal)!=null?Kt:Mt*Ft-It;dt+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${Ne} - ${Be}</td>
          <td class="right item-desc">${I(Fe)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Me||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${I(Mt)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${I(Ft)} - ${I(It)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),dt+=`
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
  ${W?`<div class="qr"><img src="${W}" alt="QR"></div>`:""}
</div>`;const ut=document.getElementById("myElement");ut&&(ut.innerHTML=dt),new R().print(ut),e(W)}catch(M){r(M)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((r,o)=>{const i=this.numeroALetras(123),s={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};x().env,S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,s).then(l=>{let a="",c="";t.producto&&(a="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(c="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let d=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(f=>{var u;console.log("r",f),d+=`<div style='font-size: 12px'><b> ${(u=f.producto)==null?void 0:u.nombre} </b></div>`,f.visible===1?d+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${f.cantidad}
                    </span>
                    <span>
                    ${parseFloat(f.precio).toFixed(2)}
                    </span>

                    <span style='float:right'>
                        ${parseFloat(f.precio*f.cantidad).toFixed(2)}
                    </span>
                    </div>`:d+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${f.cantidad}
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
</html>`,document.getElementById("myElement").innerHTML=d,e&&new R().print(document.getElementById("myElement")),r(l)}).catch(l=>{o(l)})})}static cotizacion(t,e,r,o,i=!0){return(o==null||o==="")&&(o=0),new Promise((s,l)=>{const a=U.conversorNumerosALetras,d=new a().convertToText(parseInt(r)),f=Ie().format("YYYY-MM-DD"),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=x().env;S.toDataURL(`Fecha: ${f} Monto: ${parseFloat(r).toFixed(2)}`,u).then(p=>{let E=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(w=>{E+=`<div style='font-size: 12px'><b> ${w.nombre} </b></div>`,E+=`<div><span style='font-size: 18px;font-weight: bold'>${w.cantidadVenta}</span> ${parseFloat(w.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(w.precioVenta*w.cantidadVenta).toFixed(2)}</span></div>`}),E+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(r).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(o).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(r-o).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${d} ${((parseFloat(r)-Math.floor(parseFloat(r)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${p}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=E,i&&new R().print(document.getElementById("myElement")),s(p)}).catch(p=>{l(p)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,r)=>{const o=U.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;S.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(async c=>{let d=`${this.head()}
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
</html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{r(c)})})}static reportTotal(t,e){const r=t.filter(s=>s.tipoVenta==="Ingreso").reduce((s,l)=>s+l.montoTotal,0),o=t.filter(s=>s.tipoVenta==="Egreso").reduce((s,l)=>s+l.montoTotal,0),i=r-o;return console.log("montoTotal",i),new Promise((s,l)=>{const a=U.conversorNumerosALetras,c=new a,d=Math.abs(i),f=c.convertToText(parseInt(d)),u={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=x().env;S.toDataURL(` Monto: ${parseFloat(i).toFixed(2)}`,u).then(p=>{let E=`${this.head()}
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
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(g=>{E+=`<div style='font-size: 12px'><b> ${g.user.name} </b></div>`,E+=`<div> ${parseFloat(g.montoTotal).toFixed(2)} ${g.tipoVenta}
          <span style='float:right'> ${g.tipoVenta==="Egreso"?"-":""} ${parseFloat(g.montoTotal).toFixed(2)}</span></div>`}),E+=`<hr>
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
</html>`,document.getElementById("myElement").innerHTML=E,new R().print(document.getElementById("myElement")),s(p)}).catch(p=>{l(p)})})}static reciboCompra(t){return console.log("reciboCompra",t),new Promise((e,r)=>{const o=U.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(c=>{let d=`${this.head()}
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
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(u=>{d+=`<div style='font-size: 12px'><b>${u.nombre} </b></div>`,d+=`<div>${u.cantidad} ${parseFloat(u.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(u.total).toFixed(2)}</span></div>`}),d+=`<hr>
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
    </html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{r(c)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,r)=>{const o=U.conversorNumerosALetras,s=new o().convertToText(parseInt(t.total)),l={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},a=x().env;S.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,l).then(c=>{let d=`${this.head()}
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
    <div class='titulo'>DETALLE</div>`;t.detalles.forEach(u=>{var h;d+=`<div style='font-size: 12px'><b>${(h=u.producto)==null?void 0:h.nombre} </b></div>`,d+=`<div>${u.cantidad} ${parseFloat(u.cantidad).toFixed(2)} 0.00
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
    </html>`,document.getElementById("myElement").innerHTML=d,new R().print(document.getElementById("myElement")),e(c)}).catch(c=>{r(c)})})}static reciboTranferencia(t,e,r,o){return console.log("producto",t,"de",e,"ha",r,"cantidad",o),new Promise((i,s)=>{const l=U.conversorNumerosALetras,c=new l().convertToText(parseInt(o)),d={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},f=x().env;S.toDataURL(`de: ${e} A: ${r}`,d).then(u=>{let h=`${this.head()}
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
      <div>Son ${c+""} ${o+""} unidades</div><hr>
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
<div style="width: 300px;">`}static async printFactura(t){var f,u;const e=U.conversorNumerosALetras,o=new e().convertToText(parseInt(t.total)),i=x().env,s=await S.toDataURL(`${i.url2}consulta/QR?nit=${i.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),l=t.online?"en":"fuera de";let a=`<style>
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
  </div>`;const c=document.getElementById("myElement");c&&(c.innerHTML=a),new R().print(c)}static async reciboVentaSimple(t,e=!0){var r,o;try{const i=x().env||{},s=U.conversorNumerosALetras,l=new s,a=m=>Number(m||0).toFixed(2),c=(m,y="\u2014")=>(m!=null?m:y).toString(),d=Number((r=t.total)!=null?r:0),f=Math.floor(d),u=Math.round((d-f)*100).toString().padStart(2,"0"),h=`Son ${l.convertToText(f)} ${u}/100 Bolivianos`,p=Array.isArray(t.venta_detalles)?t.venta_detalles:[],E=`
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
    `;let w=`
      <div class="imprimir-scope">
        <div class="ticket">
          <div class="center bold" style="font-size:12px;">RECIBO DE VENTA</div>
          <div class="center small">
            ${c(i.razon,"\u2014")}<br>
            ${c(i.direccion,"")}<br>
            Tel. ${c(i.telefono,"")} \xB7 Oruro
          </div>

          <hr>

          <table>
            <tr><td class="bold">Nro:</td><td>${c(t.id)}</td></tr>
            <tr><td class="bold">Fecha/Hora:</td><td>${c(t.fecha)} ${c(t.hora,"")}</td></tr>
            <tr><td class="bold">Usuario:</td><td>${c((o=t.user)==null?void 0:o.name,"")}</td></tr>
            <tr><td class="bold">Tipo venta:</td><td>${c(t.tipo_venta,"")}</td></tr>
            <tr><td class="bold">Pago:</td><td>${c(t.tipo_pago,"")}</td></tr>
          </table>

          <hr>

          <table>
            <tr class="bold"><td>Detalle</td><td class="right">Subt.</td></tr>
            ${p.map(m=>{var M,F,N,I,A,O,Y,Q,X;const y=c((N=(F=(M=m.producto)==null?void 0:M.nombre)!=null?F:m.nombre)!=null?N:""),v=Number(m.cantidad||0),C=Number(m.precio||0),b=v*C,$=c((O=(A=m.unidad)!=null?A:(I=m.producto)==null?void 0:I.unidad)!=null?O:""),B=c((X=(Q=m.producto_id)!=null?Q:(Y=m.producto)==null?void 0:Y.id)!=null?X:"");return`
                <tr>
                  <td>
                    <div class="bold">${B?B+" - ":""}${y}</div>
                    <div class="small">${$?"UM: "+$+" \xB7 ":""}${a(v)} x ${a(C)}</div>
                  </td>
                  <td class="right bold">${a(b)}</td>
                </tr>
              `}).join("")}
          </table>

          <hr>

          <table>
            <tr><td class="bold">TOTAL (Bs)</td><td class="right bold">${a(d)}</td></tr>
          </table>

          <div class="mt6">${h}</div>

          <hr>

          <div class="center small">
            \xA1Gracias por su compra!
          </div>
        </div>
      </div>
    `;const g=document.getElementById("myElement");if(g){g.innerHTML=w;const m=g.querySelector(".imprimir-scope");e&&new R().print(m,E)}return!0}catch(i){throw console.error("reciboVentaSimple error:",i),i}}}export{$n as I};
