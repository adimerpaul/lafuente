import{an as Tt,r as E,a as h,w as me,v as Z,aW as _t,aL as Bt,aN as Ht,aM as Lt,o as ct,h as w,g as dt,c as ft,aX as Ke,aY as vt,aZ as mt,a_ as St,a$ as Rt,b0 as Dt,b1 as ot,b2 as Ce,b3 as Pt,b4 as Nt,W as Pe,I as $t,b5 as Kt,az as fe,U as jt,b6 as Qt,V as ve,aH as Ut,at as Wt}from"./index.b06572a0.js";import{Q as Xt}from"./QChip.cff6d88d.js";import{Q as Yt,b as Zt,c as Gt,a as Jt}from"./QMenu.c1e63efd.js";import{n as at}from"./format.2cae61da.js";let Te=!1;{const e=document.createElement("div");e.setAttribute("dir","rtl"),Object.assign(e.style,{width:"1px",height:"1px",overflow:"auto"});const r=document.createElement("div");Object.assign(r.style,{width:"1000px",height:"1px"}),document.body.appendChild(e),e.appendChild(r),e.scrollLeft=-1e3,Te=e.scrollLeft>=0,e.remove()}const $=1e3,el=["start","center","end","start-force","center-force","end-force"],gt=Array.prototype.filter,tl=window.getComputedStyle(document.body).overflowAnchor===void 0?Tt:function(e,r){e!==null&&(e._qOverflowAnimationFrame!==void 0&&cancelAnimationFrame(e._qOverflowAnimationFrame),e._qOverflowAnimationFrame=requestAnimationFrame(()=>{if(e===null)return;e._qOverflowAnimationFrame=void 0;const i=e.children||[];gt.call(i,q=>q.dataset&&q.dataset.qVsAnchor!==void 0).forEach(q=>{delete q.dataset.qVsAnchor});const m=i[r];m&&m.dataset&&(m.dataset.qVsAnchor="")}))};function Se(e,r){return e+r}function Ne(e,r,i,m,q,a,T,y){const S=e===window?document.scrollingElement||document.documentElement:e,_=q===!0?"offsetWidth":"offsetHeight",s={scrollStart:0,scrollViewSize:-T-y,scrollMaxSize:0,offsetStart:-T,offsetEnd:-y};if(q===!0?(e===window?(s.scrollStart=window.pageXOffset||window.scrollX||document.body.scrollLeft||0,s.scrollViewSize+=document.documentElement.clientWidth):(s.scrollStart=S.scrollLeft,s.scrollViewSize+=S.clientWidth),s.scrollMaxSize=S.scrollWidth,a===!0&&(s.scrollStart=(Te===!0?s.scrollMaxSize-s.scrollViewSize:0)-s.scrollStart)):(e===window?(s.scrollStart=window.pageYOffset||window.scrollY||document.body.scrollTop||0,s.scrollViewSize+=document.documentElement.clientHeight):(s.scrollStart=S.scrollTop,s.scrollViewSize+=S.clientHeight),s.scrollMaxSize=S.scrollHeight),i!==null)for(let b=i.previousElementSibling;b!==null;b=b.previousElementSibling)b.classList.contains("q-virtual-scroll--skip")===!1&&(s.offsetStart+=b[_]);if(m!==null)for(let b=m.nextElementSibling;b!==null;b=b.nextElementSibling)b.classList.contains("q-virtual-scroll--skip")===!1&&(s.offsetEnd+=b[_]);if(r!==e){const b=S.getBoundingClientRect(),V=r.getBoundingClientRect();q===!0?(s.offsetStart+=V.left-b.left,s.offsetEnd-=V.width):(s.offsetStart+=V.top-b.top,s.offsetEnd-=V.height),e!==window&&(s.offsetStart+=s.scrollStart),s.offsetEnd+=s.scrollMaxSize-s.offsetStart}return s}function it(e,r,i,m){r==="end"&&(r=(e===window?document.body:e)[i===!0?"scrollWidth":"scrollHeight"]),e===window?i===!0?(m===!0&&(r=(Te===!0?document.body.scrollWidth-document.documentElement.clientWidth:0)-r),window.scrollTo(r,window.pageYOffset||window.scrollY||document.body.scrollTop||0)):window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,r):i===!0?(m===!0&&(r=(Te===!0?e.scrollWidth-e.offsetWidth:0)-r),e.scrollLeft=r):e.scrollTop=r}function xe(e,r,i,m){if(i>=m)return 0;const q=r.length,a=Math.floor(i/$),T=Math.floor((m-1)/$)+1;let y=e.slice(a,T).reduce(Se,0);return i%$!==0&&(y-=r.slice(a*$,i).reduce(Se,0)),m%$!==0&&m!==q&&(y-=r.slice(m,T*$).reduce(Se,0)),y}const ht={virtualScrollSliceSize:{type:[Number,String],default:10},virtualScrollSliceRatioBefore:{type:[Number,String],default:1},virtualScrollSliceRatioAfter:{type:[Number,String],default:1},virtualScrollItemSize:{type:[Number,String],default:24},virtualScrollStickySizeStart:{type:[Number,String],default:0},virtualScrollStickySizeEnd:{type:[Number,String],default:0},tableColspan:[Number,String]},cl=Object.keys(ht),rt={virtualScrollHorizontal:Boolean,onVirtualScroll:Function,...ht};function ll({virtualScrollLength:e,getVirtualScrollTarget:r,getVirtualScrollEl:i,virtualScrollItemSizeComputed:m}){const q=dt(),{props:a,emit:T,proxy:y}=q,{$q:S}=y;let _,s,b,V=[],k;const M=E(0),N=E(0),H=E({}),U=E(null),W=E(null),L=E(null),z=E({from:0,to:0}),ke=h(()=>a.tableColspan!==void 0?a.tableColspan:100);m===void 0&&(m=h(()=>a.virtualScrollItemSize));const I=h(()=>m.value+";"+a.virtualScrollHorizontal),X=h(()=>I.value+";"+a.virtualScrollSliceRatioBefore+";"+a.virtualScrollSliceRatioAfter);me(X,()=>{K()}),me(I,G);function G(){ne(s,!0)}function ge(l){ne(l===void 0?s:l)}function J(l,o){const d=r();if(d==null||d.nodeType===8)return;const x=Ne(d,i(),U.value,W.value,a.virtualScrollHorizontal,S.lang.rtl,a.virtualScrollStickySizeStart,a.virtualScrollStickySizeEnd);b!==x.scrollViewSize&&K(x.scrollViewSize),R(d,x,Math.min(e.value-1,Math.max(0,parseInt(l,10)||0)),0,el.indexOf(o)!==-1?o:s!==-1&&l>s?"end":"start")}function Ae(){const l=r();if(l==null||l.nodeType===8)return;const o=Ne(l,i(),U.value,W.value,a.virtualScrollHorizontal,S.lang.rtl,a.virtualScrollStickySizeStart,a.virtualScrollStickySizeEnd),d=e.value-1,x=o.scrollMaxSize-o.offsetStart-o.offsetEnd-N.value;if(_===o.scrollStart)return;if(o.scrollMaxSize<=0){R(l,o,0,0);return}b!==o.scrollViewSize&&K(o.scrollViewSize),he(z.value.from);const O=Math.floor(o.scrollMaxSize-Math.max(o.scrollViewSize,o.offsetEnd)-Math.min(k[d],o.scrollViewSize/2));if(O>0&&Math.ceil(o.scrollStart)>=O){R(l,o,d,o.scrollMaxSize-o.offsetEnd-V.reduce(Se,0));return}let g=0,v=o.scrollStart-o.offsetStart,F=v;if(v<=x&&v+o.scrollViewSize>=M.value)v-=M.value,g=z.value.from,F=v;else for(let f=0;v>=V[f]&&g<d;f++)v-=V[f],g+=$;for(;v>0&&g<d;)v-=k[g],v>-o.scrollViewSize?(g++,F=v):F=k[g]+v;R(l,o,g,F)}function R(l,o,d,x,O){const g=typeof O=="string"&&O.indexOf("-force")!==-1,v=g===!0?O.replace("-force",""):O,F=v!==void 0?v:"start";let f=Math.max(0,d-H.value[F]),D=f+H.value.total;D>e.value&&(D=e.value,f=Math.max(0,D-H.value.total)),_=o.scrollStart;const Y=f!==z.value.from||D!==z.value.to;if(Y===!1&&v===void 0){ye(d);return}const{activeElement:Ie}=document,j=L.value;Y===!0&&j!==null&&j!==Ie&&j.contains(Ie)===!0&&(j.addEventListener("focusout",ze),setTimeout(()=>{j!==null&&j.removeEventListener("focusout",ze)})),tl(j,d-f);const Me=v!==void 0?k.slice(f,d).reduce(Se,0):0;if(Y===!0){const ee=D>=z.value.from&&f<=z.value.to?z.value.to:D;z.value={from:f,to:ee},M.value=xe(V,k,0,f),N.value=xe(V,k,D,e.value),requestAnimationFrame(()=>{z.value.to!==D&&_===o.scrollStart&&(z.value={from:z.value.from,to:D},N.value=xe(V,k,D,e.value))})}requestAnimationFrame(()=>{if(_!==o.scrollStart)return;Y===!0&&he(f);const ee=k.slice(f,d).reduce(Se,0),te=ee+o.offsetStart+M.value,Oe=te+k[d];let we=te+x;if(v!==void 0){const Be=ee-Me,Ve=o.scrollStart+Be;we=g!==!0&&Ve<te&&Oe<Ve+o.scrollViewSize?Ve:v==="end"?Oe-o.scrollViewSize:te-(v==="start"?0:Math.round((o.scrollViewSize-k[d])/2))}_=we,it(l,we,a.virtualScrollHorizontal,S.lang.rtl),ye(d)})}function he(l){const o=L.value;if(o){const d=gt.call(o.children,f=>f.classList&&f.classList.contains("q-virtual-scroll--skip")===!1),x=d.length,O=a.virtualScrollHorizontal===!0?f=>f.getBoundingClientRect().width:f=>f.offsetHeight;let g=l,v,F;for(let f=0;f<x;){for(v=O(d[f]),f++;f<x&&d[f].classList.contains("q-virtual-scroll--with-prev")===!0;)v+=O(d[f]),f++;F=v-k[g],F!==0&&(k[g]+=F,V[Math.floor(g/$)]+=F),g++}}}function ze(){L.value!==null&&L.value!==void 0&&L.value.focus()}function ne(l,o){const d=1*m.value;(o===!0||Array.isArray(k)===!1)&&(k=[]);const x=k.length;k.length=e.value;for(let g=e.value-1;g>=x;g--)k[g]=d;const O=Math.floor((e.value-1)/$);V=[];for(let g=0;g<=O;g++){let v=0;const F=Math.min((g+1)*$,e.value);for(let f=g*$;f<F;f++)v+=k[f];V.push(v)}s=-1,_=void 0,M.value=xe(V,k,0,z.value.from),N.value=xe(V,k,z.value.to,e.value),l>=0?(he(z.value.from),Z(()=>{J(l)})):oe()}function K(l){if(l===void 0&&typeof window!="undefined"){const v=r();v!=null&&v.nodeType!==8&&(l=Ne(v,i(),U.value,W.value,a.virtualScrollHorizontal,S.lang.rtl,a.virtualScrollStickySizeStart,a.virtualScrollStickySizeEnd).scrollViewSize)}b=l;const o=parseFloat(a.virtualScrollSliceRatioBefore)||0,d=parseFloat(a.virtualScrollSliceRatioAfter)||0,x=1+o+d,O=l===void 0||l<=0?1:Math.ceil(l/m.value),g=Math.max(1,O,Math.ceil((a.virtualScrollSliceSize>0?a.virtualScrollSliceSize:10)/x));H.value={total:Math.ceil(g*x),start:Math.ceil(g*o),center:Math.ceil(g*(.5+o)),end:Math.ceil(g*(1+o)),view:O}}function _e(l,o){const d=a.virtualScrollHorizontal===!0?"width":"height",x={["--q-virtual-scroll-item-"+d]:m.value+"px"};return[l==="tbody"?w(l,{class:"q-virtual-scroll__padding",key:"before",ref:U},[w("tr",[w("td",{style:{[d]:`${M.value}px`,...x},colspan:ke.value})])]):w(l,{class:"q-virtual-scroll__padding",key:"before",ref:U,style:{[d]:`${M.value}px`,...x}}),w(l,{class:"q-virtual-scroll__content",key:"content",ref:L,tabindex:-1},o.flat()),l==="tbody"?w(l,{class:"q-virtual-scroll__padding",key:"after",ref:W},[w("tr",[w("td",{style:{[d]:`${N.value}px`,...x},colspan:ke.value})])]):w(l,{class:"q-virtual-scroll__padding",key:"after",ref:W,style:{[d]:`${N.value}px`,...x}})]}function ye(l){s!==l&&(a.onVirtualScroll!==void 0&&T("virtualScroll",{index:l,from:z.value.from,to:z.value.to-1,direction:l<s?"decrease":"increase",ref:y}),s=l)}K();const oe=_t(Ae,S.platform.is.ios===!0?120:35);Bt(()=>{K()});let be=!1;return Ht(()=>{be=!0}),Lt(()=>{if(be!==!0)return;const l=r();_!==void 0&&l!==void 0&&l!==null&&l.nodeType!==8?it(l,_,a.virtualScrollHorizontal,S.lang.rtl):J(s)}),ct(()=>{oe.cancel()}),Object.assign(y,{scrollTo:J,reset:G,refresh:ge}),{virtualScrollSliceRange:z,virtualScrollSliceSizeComputed:H,setVirtualScrollSize:K,onVirtualScrollEvt:oe,localResetVirtualScroll:ne,padVirtualScroll:_e,scrollTo:J,reset:G,refresh:ge}}var ul=ft({name:"QField",inheritAttrs:!1,props:{...Ke,tag:{type:String,default:"label"}},emits:vt,setup(){return mt(St({tagProp:!0}))}});const st=e=>["add","add-unique","toggle"].includes(e),nl=".*+?^${}()|[]\\",ol=Object.keys(Ke);function $e(e,r){if(typeof e=="function")return e;const i=e!==void 0?e:r;return m=>m!==null&&typeof m=="object"&&i in m?m[i]:m}var dl=ft({name:"QSelect",inheritAttrs:!1,props:{...rt,...Rt,...Ke,modelValue:{required:!0},multiple:Boolean,displayValue:[String,Number],displayValueHtml:Boolean,dropdownIcon:String,options:{type:Array,default:()=>[]},optionValue:[Function,String],optionLabel:[Function,String],optionDisable:[Function,String],hideSelected:Boolean,hideDropdownIcon:Boolean,fillInput:Boolean,maxValues:[Number,String],optionsDense:Boolean,optionsDark:{type:Boolean,default:null},optionsSelectedClass:String,optionsHtml:Boolean,optionsCover:Boolean,menuShrink:Boolean,menuAnchor:String,menuSelf:String,menuOffset:Array,popupContentClass:String,popupContentStyle:[String,Array,Object],popupNoRouteDismiss:Boolean,useInput:Boolean,useChips:Boolean,newValueMode:{type:String,validator:st},mapOptions:Boolean,emitValue:Boolean,disableTabSelection:Boolean,inputDebounce:{type:[Number,String],default:500},inputClass:[Array,String,Object],inputStyle:[Array,String,Object],tabindex:{type:[String,Number],default:0},autocomplete:String,transitionShow:{},transitionHide:{},transitionDuration:{},behavior:{type:String,validator:e=>["default","menu","dialog"].includes(e),default:"default"},virtualScrollItemSize:rt.virtualScrollItemSize.type,onNewValue:Function,onFilter:Function},emits:[...vt,"add","remove","inputValue","keyup","keypress","keydown","popupShow","popupHide","filterAbort"],setup(e,{slots:r,emit:i}){const{proxy:m}=dt(),{$q:q}=m,a=E(!1),T=E(!1),y=E(-1),S=E(""),_=E(!1),s=E(!1);let b=null,V=null,k,M,N,H=null,U,W,L,z;const ke=E(null),I=E(null),X=E(null),G=E(null),ge=E(null),J=Dt(e),Ae=Kt(et),R=h(()=>e.options.length),he=h(()=>e.virtualScrollItemSize===void 0?e.optionsDense===!0?24:48:e.virtualScrollItemSize),{virtualScrollSliceRange:ze,virtualScrollSliceSizeComputed:ne,localResetVirtualScroll:K,padVirtualScroll:_e,onVirtualScrollEvt:ye,scrollTo:oe,setVirtualScrollSize:be}=ll({virtualScrollLength:R,getVirtualScrollTarget:Vt,getVirtualScrollEl:Ge,virtualScrollItemSizeComputed:he}),l=St(),o=h(()=>{const t=e.mapOptions===!0&&e.multiple!==!0,u=e.modelValue!==void 0&&(e.modelValue!==null||t===!0)?e.multiple===!0&&Array.isArray(e.modelValue)?e.modelValue:[e.modelValue]:[];if(e.mapOptions===!0){const n=e.mapOptions===!0&&k!==void 0?k:[],c=u.map(C=>wt(C,n));return e.modelValue===null&&t===!0?c.filter(C=>C!==null):c}return u}),d=h(()=>{const t={};return ol.forEach(u=>{const n=e[u];n!==void 0&&(t[u]=n)}),t}),x=h(()=>e.optionsDark===null?l.isDark.value:e.optionsDark),O=h(()=>ot(o.value)),g=h(()=>{let t="q-field__input q-placeholder col";return e.hideSelected===!0||o.value.length===0?[t,e.inputClass]:(t+=" q-field__input--padding",e.inputClass===void 0?t:[t,e.inputClass])}),v=h(()=>(e.virtualScrollHorizontal===!0?"q-virtual-scroll--horizontal":"")+(e.popupContentClass?" "+e.popupContentClass:"")),F=h(()=>R.value===0),f=h(()=>o.value.map(t=>P.value(t)).join(", ")),D=h(()=>e.displayValue!==void 0?e.displayValue:f.value),Y=h(()=>e.optionsHtml===!0?()=>!0:t=>t!=null&&t.html===!0),Ie=h(()=>e.displayValueHtml===!0||e.displayValue===void 0&&(e.optionsHtml===!0||o.value.some(Y.value))),j=h(()=>l.focused.value===!0?e.tabindex:-1),Me=h(()=>{const t={tabindex:e.tabindex,role:"combobox","aria-label":e.label,"aria-readonly":e.readonly===!0?"true":"false","aria-autocomplete":e.useInput===!0?"list":"none","aria-expanded":a.value===!0?"true":"false","aria-controls":`${l.targetUid.value}_lb`};return y.value>=0&&(t["aria-activedescendant"]=`${l.targetUid.value}_${y.value}`),t}),ee=h(()=>({id:`${l.targetUid.value}_lb`,role:"listbox","aria-multiselectable":e.multiple===!0?"true":"false"})),te=h(()=>o.value.map((t,u)=>({index:u,opt:t,html:Y.value(t),selected:!0,removeAtIndex:bt,toggleOption:le,tabindex:j.value}))),Oe=h(()=>{if(R.value===0)return[];const{from:t,to:u}=ze.value;return e.options.slice(t,u).map((n,c)=>{const C=ae.value(n)===!0,p=Le(n)===!0,B=t+c,A={clickable:!0,active:p,activeClass:Ve.value,manualFocus:!0,focused:!1,disable:C,tabindex:-1,dense:e.optionsDense,dark:x.value,role:"option","aria-selected":p===!0?"true":"false",id:`${l.targetUid.value}_${B}`,onClick:()=>{le(n)}};return C!==!0&&(y.value===B&&(A.focused=!0),q.platform.is.desktop===!0&&(A.onMousemove=()=>{a.value===!0&&ie(B)})),{index:B,opt:n,html:Y.value(n),label:P.value(n),selected:A.active,focused:A.focused,toggleOption:le,setOptionIndex:ie,itemProps:A}})}),we=h(()=>e.dropdownIcon!==void 0?e.dropdownIcon:q.iconSet.arrow.dropdown),Be=h(()=>e.optionsCover===!1&&e.outlined!==!0&&e.standout!==!0&&e.borderless!==!0&&e.rounded!==!0),Ve=h(()=>e.optionsSelectedClass!==void 0?e.optionsSelectedClass:e.color!==void 0?`text-${e.color}`:""),Q=h(()=>$e(e.optionValue,"value")),P=h(()=>$e(e.optionLabel,"label")),ae=h(()=>$e(e.optionDisable,"disable")),Fe=h(()=>o.value.map(Q.value)),yt=h(()=>{const t={onInput:et,onChange:Ae,onKeydown:Ze,onKeyup:Xe,onKeypress:Ye,onFocus:Ue,onClick(u){M===!0&&fe(u)}};return t.onCompositionstart=t.onCompositionupdate=t.onCompositionend=Ae,t});me(o,t=>{k=t,e.useInput===!0&&e.fillInput===!0&&e.multiple!==!0&&l.innerLoading.value!==!0&&(T.value!==!0&&a.value!==!0||O.value!==!0)&&(N!==!0&&de(),(T.value===!0||a.value===!0)&&re(""))},{immediate:!0}),me(()=>e.fillInput,de),me(a,Re),me(R,Et);function je(t){return e.emitValue===!0?Q.value(t):t}function He(t){if(t!==-1&&t<o.value.length)if(e.multiple===!0){const u=e.modelValue.slice();i("remove",{index:t,value:u.splice(t,1)[0]}),i("update:modelValue",u)}else i("update:modelValue",null)}function bt(t){He(t),l.focus()}function Qe(t,u){const n=je(t);if(e.multiple!==!0){e.fillInput===!0&&pe(P.value(t),!0,!0),i("update:modelValue",n);return}if(o.value.length===0){i("add",{index:0,value:n}),i("update:modelValue",e.multiple===!0?[n]:n);return}if(u===!0&&Le(t)===!0||e.maxValues!==void 0&&e.modelValue.length>=e.maxValues)return;const c=e.modelValue.slice();i("add",{index:c.length,value:n}),c.push(n),i("update:modelValue",c)}function le(t,u){if(l.editable.value!==!0||t===void 0||ae.value(t)===!0)return;const n=Q.value(t);if(e.multiple!==!0){u!==!0&&(pe(e.fillInput===!0?P.value(t):"",!0,!0),ue()),I.value!==null&&I.value.focus(),(o.value.length===0||Ce(Q.value(o.value[0]),n)!==!0)&&i("update:modelValue",e.emitValue===!0?n:t);return}if((M!==!0||_.value===!0)&&l.focus(),Ue(),o.value.length===0){const p=e.emitValue===!0?n:t;i("add",{index:0,value:p}),i("update:modelValue",e.multiple===!0?[p]:p);return}const c=e.modelValue.slice(),C=Fe.value.findIndex(p=>Ce(p,n));if(C!==-1)i("remove",{index:C,value:c.splice(C,1)[0]});else{if(e.maxValues!==void 0&&c.length>=e.maxValues)return;const p=e.emitValue===!0?n:t;i("add",{index:c.length,value:p}),c.push(p)}i("update:modelValue",c)}function ie(t){if(q.platform.is.desktop!==!0)return;const u=t!==-1&&t<R.value?t:-1;y.value!==u&&(y.value=u)}function qe(t=1,u){if(a.value===!0){let n=y.value;do n=at(n+t,-1,R.value-1);while(n!==-1&&n!==y.value&&ae.value(e.options[n])===!0);y.value!==n&&(ie(n),oe(n),u!==!0&&e.useInput===!0&&e.fillInput===!0&&Ee(n>=0?P.value(e.options[n]):U,!0))}}function wt(t,u){const n=c=>Ce(Q.value(c),t);return e.options.find(n)||u.find(n)||t}function Le(t){const u=Q.value(t);return Fe.value.find(n=>Ce(n,u))!==void 0}function Ue(t){e.useInput===!0&&I.value!==null&&(t===void 0||I.value===t.target&&t.target.value===f.value)&&I.value.select()}function We(t){jt(t,27)===!0&&a.value===!0&&(fe(t),ue(),de()),i("keyup",t)}function Xe(t){const{value:u}=t.target;if(t.keyCode!==void 0){We(t);return}if(t.target.value="",b!==null&&(clearTimeout(b),b=null),V!==null&&(clearTimeout(V),V=null),de(),typeof u=="string"&&u.length!==0){const n=u.toLocaleLowerCase(),c=p=>{const B=e.options.find(A=>p.value(A).toLocaleLowerCase()===n);return B===void 0?!1:(o.value.indexOf(B)===-1?le(B):ue(),!0)},C=p=>{c(Q)!==!0&&(c(P)===!0||p===!0||re(u,!0,()=>C(!0)))};C()}else l.clearValue(t)}function Ye(t){i("keypress",t)}function Ze(t){if(i("keydown",t),Qt(t)===!0)return;const u=S.value.length!==0&&(e.newValueMode!==void 0||e.onNewValue!==void 0),n=t.shiftKey!==!0&&e.disableTabSelection!==!0&&e.multiple!==!0&&(y.value!==-1||u===!0);if(t.keyCode===27){Pe(t);return}if(t.keyCode===9&&n===!1){se();return}if(t.target===void 0||t.target.id!==l.targetUid.value||l.editable.value!==!0)return;if(t.keyCode===40&&l.innerLoading.value!==!0&&a.value===!1){ve(t),ce();return}if(t.keyCode===8&&(e.useChips===!0||e.clearable===!0)&&e.hideSelected!==!0&&S.value.length===0){e.multiple===!0&&Array.isArray(e.modelValue)===!0?He(e.modelValue.length-1):e.multiple!==!0&&e.modelValue!==null&&i("update:modelValue",null);return}(t.keyCode===35||t.keyCode===36)&&(typeof S.value!="string"||S.value.length===0)&&(ve(t),y.value=-1,qe(t.keyCode===36?1:-1,e.multiple)),(t.keyCode===33||t.keyCode===34)&&ne.value!==void 0&&(ve(t),y.value=Math.max(-1,Math.min(R.value,y.value+(t.keyCode===33?-1:1)*ne.value.view)),qe(t.keyCode===33?1:-1,e.multiple)),(t.keyCode===38||t.keyCode===40)&&(ve(t),qe(t.keyCode===38?-1:1,e.multiple));const c=R.value;if((L===void 0||z<Date.now())&&(L=""),c>0&&e.useInput!==!0&&t.key!==void 0&&t.key.length===1&&t.altKey===!1&&t.ctrlKey===!1&&t.metaKey===!1&&(t.keyCode!==32||L.length!==0)){a.value!==!0&&ce(t);const C=t.key.toLocaleLowerCase(),p=L.length===1&&L[0]===C;z=Date.now()+1500,p===!1&&(ve(t),L+=C);const B=new RegExp("^"+L.split("").map(De=>nl.indexOf(De)!==-1?"\\"+De:De).join(".*"),"i");let A=y.value;if(p===!0||A<0||B.test(P.value(e.options[A]))!==!0)do A=at(A+1,-1,c-1);while(A!==y.value&&(ae.value(e.options[A])===!0||B.test(P.value(e.options[A]))!==!0));y.value!==A&&Z(()=>{ie(A),oe(A),A>=0&&e.useInput===!0&&e.fillInput===!0&&Ee(P.value(e.options[A]),!0)});return}if(!(t.keyCode!==13&&(t.keyCode!==32||e.useInput===!0||L!=="")&&(t.keyCode!==9||n===!1))){if(t.keyCode!==9&&ve(t),y.value!==-1&&y.value<c){le(e.options[y.value]);return}if(u===!0){const C=(p,B)=>{if(B){if(st(B)!==!0)return}else B=e.newValueMode;if(pe("",e.multiple!==!0,!0),p==null)return;(B==="toggle"?le:Qe)(p,B==="add-unique"),e.multiple!==!0&&(I.value!==null&&I.value.focus(),ue())};if(e.onNewValue!==void 0?i("newValue",S.value,C):C(S.value),e.multiple!==!0)return}a.value===!0?se():l.innerLoading.value!==!0&&ce()}}function Ge(){return M===!0?ge.value:X.value!==null&&X.value.contentEl!==null?X.value.contentEl:void 0}function Vt(){return Ge()}function pt(){return e.hideSelected===!0?[]:r["selected-item"]!==void 0?te.value.map(t=>r["selected-item"](t)).slice():r.selected!==void 0?[].concat(r.selected()):e.useChips===!0?te.value.map((t,u)=>w(Xt,{key:"option-"+u,removable:l.editable.value===!0&&ae.value(t.opt)!==!0,dense:!0,textColor:e.color,tabindex:j.value,onRemove(){t.removeAtIndex(u)}},()=>w("span",{class:"ellipsis",[t.html===!0?"innerHTML":"textContent"]:P.value(t.opt)}))):[w("span",{[Ie.value===!0?"innerHTML":"textContent"]:D.value})]}function Je(){if(F.value===!0)return r["no-option"]!==void 0?r["no-option"]({inputValue:S.value}):void 0;const t=r.option!==void 0?r.option:n=>w(Jt,{key:n.index,...n.itemProps},()=>w(Zt,()=>w(Gt,()=>w("span",{[n.html===!0?"innerHTML":"textContent"]:n.label}))));let u=_e("div",Oe.value.map(t));return r["before-options"]!==void 0&&(u=r["before-options"]().concat(u)),Wt(r["after-options"],u)}function Ct(t,u){const n=u===!0?{...Me.value,...l.splitAttrs.attributes.value}:void 0,c={ref:u===!0?I:void 0,key:"i_t",class:g.value,style:e.inputStyle,value:S.value!==void 0?S.value:"",type:"search",...n,id:u===!0?l.targetUid.value:void 0,maxlength:e.maxlength,autocomplete:e.autocomplete,"data-autofocus":t===!0||e.autofocus===!0||void 0,disabled:e.disable===!0,readonly:e.readonly===!0,...yt.value};return t!==!0&&M===!0&&(Array.isArray(c.class)===!0?c.class=[...c.class,"no-pointer-events"]:c.class+=" no-pointer-events"),w("input",c)}function et(t){b!==null&&(clearTimeout(b),b=null),V!==null&&(clearTimeout(V),V=null),!(t&&t.target&&t.target.qComposing===!0)&&(Ee(t.target.value||""),N=!0,U=S.value,l.focused.value!==!0&&(M!==!0||_.value===!0)&&l.focus(),e.onFilter!==void 0&&(b=setTimeout(()=>{b=null,re(S.value)},e.inputDebounce)))}function Ee(t,u){S.value!==t&&(S.value=t,u===!0||e.inputDebounce===0||e.inputDebounce==="0"?i("inputValue",t):V=setTimeout(()=>{V=null,i("inputValue",t)},e.inputDebounce))}function pe(t,u,n){N=n!==!0,e.useInput===!0&&(Ee(t,!0),(u===!0||n!==!0)&&(U=t),u!==!0&&re(t))}function re(t,u,n){if(e.onFilter===void 0||u!==!0&&l.focused.value!==!0)return;l.innerLoading.value===!0?i("filterAbort"):(l.innerLoading.value=!0,s.value=!0),t!==""&&e.multiple!==!0&&o.value.length!==0&&N!==!0&&t===P.value(o.value[0])&&(t="");const c=setTimeout(()=>{a.value===!0&&(a.value=!1)},10);H!==null&&clearTimeout(H),H=c,i("filter",t,(C,p)=>{(u===!0||l.focused.value===!0)&&H===c&&(clearTimeout(H),typeof C=="function"&&C(),s.value=!1,Z(()=>{l.innerLoading.value=!1,l.editable.value===!0&&(u===!0?a.value===!0&&ue():a.value===!0?Re(!0):a.value=!0),typeof p=="function"&&Z(()=>{p(m)}),typeof n=="function"&&Z(()=>{n(m)})}))},()=>{l.focused.value===!0&&H===c&&(clearTimeout(H),l.innerLoading.value=!1,s.value=!1),a.value===!0&&(a.value=!1)})}function xt(){return w(Yt,{ref:X,class:v.value,style:e.popupContentStyle,modelValue:a.value,fit:e.menuShrink!==!0,cover:e.optionsCover===!0&&F.value!==!0&&e.useInput!==!0,anchor:e.menuAnchor,self:e.menuSelf,offset:e.menuOffset,dark:x.value,noParentEvent:!0,noRefocus:!0,noFocus:!0,noRouteDismiss:e.popupNoRouteDismiss,square:Be.value,transitionShow:e.transitionShow,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,separateClosePopup:!0,...ee.value,onScrollPassive:ye,onBeforeShow:lt,onBeforeHide:kt,onShow:At},Je)}function kt(t){ut(t),se()}function At(){be()}function zt(t){fe(t),I.value!==null&&I.value.focus(),_.value=!0,window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,0)}function It(t){fe(t),Z(()=>{_.value=!1})}function Mt(){const t=[w(ul,{class:`col-auto ${l.fieldClass.value}`,...d.value,for:l.targetUid.value,dark:x.value,square:!0,loading:s.value,itemAligned:!1,filled:!0,stackLabel:S.value.length!==0,...l.splitAttrs.listeners.value,onFocus:zt,onBlur:It},{...r,rawControl:()=>l.getControl(!0),before:void 0,after:void 0})];return a.value===!0&&t.push(w("div",{ref:ge,class:v.value+" scroll",style:e.popupContentStyle,...ee.value,onClick:Pe,onScrollPassive:ye},Je())),w(Ut,{ref:G,modelValue:T.value,position:e.useInput===!0?"top":void 0,transitionShow:W,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,noRouteDismiss:e.popupNoRouteDismiss,onBeforeShow:lt,onBeforeHide:Ot,onHide:Ft,onShow:qt},()=>w("div",{class:"q-select__dialog"+(x.value===!0?" q-select__dialog--dark q-dark":"")+(_.value===!0?" q-select__dialog--focused":"")},t))}function Ot(t){ut(t),G.value!==null&&G.value.__updateRefocusTarget(l.rootRef.value.querySelector(".q-field__native > [tabindex]:last-child")),l.focused.value=!1}function Ft(t){ue(),l.focused.value===!1&&i("blur",t),de()}function qt(){const t=document.activeElement;(t===null||t.id!==l.targetUid.value)&&I.value!==null&&I.value!==t&&I.value.focus(),be()}function se(){T.value!==!0&&(y.value=-1,a.value===!0&&(a.value=!1),l.focused.value===!1&&(H!==null&&(clearTimeout(H),H=null),l.innerLoading.value===!0&&(i("filterAbort"),l.innerLoading.value=!1,s.value=!1)))}function ce(t){l.editable.value===!0&&(M===!0?(l.onControlFocusin(t),T.value=!0,Z(()=>{l.focus()})):l.focus(),e.onFilter!==void 0?re(S.value):(F.value!==!0||r["no-option"]!==void 0)&&(a.value=!0))}function ue(){T.value=!1,se()}function de(){e.useInput===!0&&pe(e.multiple!==!0&&e.fillInput===!0&&o.value.length!==0&&P.value(o.value[0])||"",!0,!0)}function Re(t){let u=-1;if(t===!0){if(o.value.length!==0){const n=Q.value(o.value[0]);u=e.options.findIndex(c=>Ce(Q.value(c),n))}K(u)}ie(u)}function Et(t,u){a.value===!0&&l.innerLoading.value===!1&&(K(-1,!0),Z(()=>{a.value===!0&&l.innerLoading.value===!1&&(t>u?K():Re(!0))}))}function tt(){T.value===!1&&X.value!==null&&X.value.updatePosition()}function lt(t){t!==void 0&&fe(t),i("popupShow",t),l.hasPopupOpen=!0,l.onControlFocusin(t)}function ut(t){t!==void 0&&fe(t),i("popupHide",t),l.hasPopupOpen=!1,l.onControlFocusout(t)}function nt(){M=q.platform.is.mobile!==!0&&e.behavior!=="dialog"?!1:e.behavior!=="menu"&&(e.useInput===!0?r["no-option"]!==void 0||e.onFilter!==void 0||F.value===!1:!0),W=q.platform.is.ios===!0&&M===!0&&e.useInput===!0?"fade":e.transitionShow}return Pt(nt),Nt(tt),nt(),ct(()=>{b!==null&&clearTimeout(b),V!==null&&clearTimeout(V)}),Object.assign(m,{showPopup:ce,hidePopup:ue,removeAtIndex:He,add:Qe,toggleOption:le,getOptionIndex:()=>y.value,setOptionIndex:ie,moveOptionSelection:qe,filter:re,updateMenuPosition:tt,updateInputValue:pe,isOptionSelected:Le,getEmittingOptionValue:je,isOptionDisabled:(...t)=>ae.value.apply(null,t)===!0,getOptionValue:(...t)=>Q.value.apply(null,t),getOptionLabel:(...t)=>P.value.apply(null,t)}),Object.assign(l,{innerValue:o,fieldClass:h(()=>`q-select q-field--auto-height q-select--with${e.useInput!==!0?"out":""}-input q-select--with${e.useChips!==!0?"out":""}-chips q-select--${e.multiple===!0?"multiple":"single"}`),inputRef:ke,targetRef:I,hasValue:O,showPopup:ce,floatingLabel:h(()=>e.hideSelected!==!0&&O.value===!0||typeof S.value=="number"||S.value.length!==0||ot(e.displayValue)),getControlChild:()=>{if(l.editable.value!==!1&&(T.value===!0||F.value!==!0||r["no-option"]!==void 0))return M===!0?Mt():xt();l.hasPopupOpen===!0&&(l.hasPopupOpen=!1)},controlEvents:{onFocusin(t){l.onControlFocusin(t)},onFocusout(t){l.onControlFocusout(t,()=>{de(),se()})},onClick(t){if(Pe(t),M!==!0&&a.value===!0){se(),I.value!==null&&I.value.focus();return}ce(t)}},getControl:t=>{const u=pt(),n=t===!0||T.value!==!0||M!==!0;if(e.useInput===!0)u.push(Ct(t,n));else if(l.editable.value===!0){const C=n===!0?Me.value:void 0;u.push(w("input",{ref:n===!0?I:void 0,key:"d_t",class:"q-select__focus-target",id:n===!0?l.targetUid.value:void 0,value:D.value,readonly:!0,"data-autofocus":t===!0||e.autofocus===!0||void 0,...C,onKeydown:Ze,onKeyup:We,onKeypress:Ye})),n===!0&&typeof e.autocomplete=="string"&&e.autocomplete.length!==0&&u.push(w("input",{class:"q-select__autocomplete-input",autocomplete:e.autocomplete,tabindex:-1,onKeyup:Xe}))}if(J.value!==void 0&&e.disable!==!0&&Fe.value.length!==0){const C=Fe.value.map(p=>w("option",{value:p,selected:!0}));u.push(w("select",{class:"hidden",name:J.value,multiple:e.multiple},C))}const c=e.useInput===!0||n!==!0?void 0:l.splitAttrs.attributes.value;return w("div",{class:"q-field__native row items-center",...c,...l.splitAttrs.listeners.value},u)},getInnerAppend:()=>e.loading!==!0&&s.value!==!0&&e.hideDropdownIcon!==!0?[w($t,{class:"q-select__dropdown-icon"+(a.value===!0?" rotate-180":""),name:we.value})]:null}),mt(l)}});export{dl as Q,ll as a,cl as c,Te as r,rt as u};
