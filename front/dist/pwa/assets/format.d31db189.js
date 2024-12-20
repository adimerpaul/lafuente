import{c as P,a as b,h as q,d as O,A as V,a1 as Ee,C as N,a2 as Te,r as M,g as z,a3 as ve,y as U,f as Be,a4 as _e,s as ne,I as He,p as ae,w as H,H as Me,o as X,x as Le,a5 as j,a6 as ie,k as We,a7 as Pe,z as Re,a8 as Ae,a9 as ze,B as $e,aa as pe,E as Ie,ab as Fe,F as Ke,ac as Qe,ad as je,v as De,ae as Oe,af as oe,ag as Ve,ah as Ne,ai as Ue,aj as Xe,ak as Ye,al as Ge,am as Je,an as Ze,K as et,U as K,ao as tt,ap as lt}from"./index.31111e77.js";var mt=P({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(e,{slots:t}){const n=b(()=>`q-item__section column q-item__section--${e.avatar===!0||e.side===!0||e.thumbnail===!0?"side":"main"}`+(e.top===!0?" q-item__section--top justify-start":" justify-center")+(e.avatar===!0?" q-item__section--avatar":"")+(e.thumbnail===!0?" q-item__section--thumbnail":"")+(e.noWrap===!0?" q-item__section--nowrap":""));return()=>q("div",{class:n.value},O(t.default))}}),gt=P({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(e,{slots:t}){const n=b(()=>parseInt(e.lines,10)),l=b(()=>"q-item__label"+(e.overline===!0?" q-item__label--overline text-overline":"")+(e.caption===!0?" q-item__label--caption text-caption":"")+(e.header===!0?" q-item__label--header":"")+(n.value===1?" ellipsis":"")),a=b(()=>e.lines!==void 0&&n.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":n.value}:null);return()=>q("div",{style:a.value,class:l.value},O(t.default))}}),bt=P({name:"QItem",props:{...V,...Ee,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(e,{slots:t,emit:n}){const{proxy:{$q:l}}=z(),a=N(e,l),{hasLink:f,linkAttrs:o,linkClass:h,linkTag:m,navigateOnClick:s}=Te(),v=M(null),g=M(null),x=b(()=>e.clickable===!0||f.value===!0||e.tag==="label"),i=b(()=>e.disable!==!0&&x.value===!0),r=b(()=>"q-item q-item-type row no-wrap"+(e.dense===!0?" q-item--dense":"")+(a.value===!0?" q-item--dark":"")+(f.value===!0&&e.active===null?h.value:e.active===!0?` q-item--active${e.activeClass!==void 0?` ${e.activeClass}`:""}`:"")+(e.disable===!0?" disabled":"")+(i.value===!0?" q-item--clickable q-link cursor-pointer "+(e.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(e.focused===!0?" q-manual-focusable--focused":""):"")),E=b(()=>{if(e.insetLevel===void 0)return null;const d=l.lang.rtl===!0?"Right":"Left";return{["padding"+d]:16+e.insetLevel*56+"px"}});function c(d){i.value===!0&&(g.value!==null&&(d.qKeyEvent!==!0&&document.activeElement===v.value?g.value.focus():document.activeElement===g.value&&v.value.focus()),s(d))}function w(d){if(i.value===!0&&ve(d,[13,32])===!0){U(d),d.qKeyEvent=!0;const k=new MouseEvent("click",d);k.qKeyEvent=!0,v.value.dispatchEvent(k)}n("keyup",d)}function L(){const d=Be(t.default,[]);return i.value===!0&&d.unshift(q("div",{class:"q-focus-helper",tabindex:-1,ref:g})),d}return()=>{const d={ref:v,class:r.value,style:E.value,role:"listitem",onClick:c,onKeyup:w};return i.value===!0?(d.tabindex=e.tabindex||"0",Object.assign(d,o.value)):x.value===!0&&(d["aria-disabled"]="true"),q(m.value,d,L())}}});function nt(){if(window.getSelection!==void 0){const e=window.getSelection();e.empty!==void 0?e.empty():e.removeAllRanges!==void 0&&(e.removeAllRanges(),_e.is.mobile!==!0&&e.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}const at={target:{type:[Boolean,String,Element],default:!0},noParentEvent:Boolean},it={...at,contextMenu:Boolean};function ot({showing:e,avoidEmit:t,configureAnchorEl:n}){const{props:l,proxy:a,emit:f}=z(),o=M(null);let h=null;function m(i){return o.value===null?!1:i===void 0||i.touches===void 0||i.touches.length<=1}const s={};n===void 0&&(Object.assign(s,{hide(i){a.hide(i)},toggle(i){a.toggle(i),i.qAnchorHandled=!0},toggleKey(i){ve(i,13)===!0&&s.toggle(i)},contextClick(i){a.hide(i),ne(i),He(()=>{a.show(i),i.qAnchorHandled=!0})},prevent:ne,mobileTouch(i){if(s.mobileCleanup(i),m(i)!==!0)return;a.hide(i),o.value.classList.add("non-selectable");const r=i.target;ae(s,"anchor",[[r,"touchmove","mobileCleanup","passive"],[r,"touchend","mobileCleanup","passive"],[r,"touchcancel","mobileCleanup","passive"],[o.value,"contextmenu","prevent","notPassive"]]),h=setTimeout(()=>{h=null,a.show(i),i.qAnchorHandled=!0},300)},mobileCleanup(i){o.value.classList.remove("non-selectable"),h!==null&&(clearTimeout(h),h=null),e.value===!0&&i!==void 0&&nt()}}),n=function(i=l.contextMenu){if(l.noParentEvent===!0||o.value===null)return;let r;i===!0?a.$q.platform.is.mobile===!0?r=[[o.value,"touchstart","mobileTouch","passive"]]:r=[[o.value,"mousedown","hide","passive"],[o.value,"contextmenu","contextClick","notPassive"]]:r=[[o.value,"click","toggle","passive"],[o.value,"keyup","toggleKey","passive"]],ae(s,"anchor",r)});function v(){Le(s,"anchor")}function g(i){for(o.value=i;o.value.classList.contains("q-anchor--skip");)o.value=o.value.parentNode;n()}function x(){if(l.target===!1||l.target===""||a.$el.parentNode===null)o.value=null;else if(l.target===!0)g(a.$el.parentNode);else{let i=l.target;if(typeof l.target=="string")try{i=document.querySelector(l.target)}catch{i=void 0}i!=null?(o.value=i.$el||i,n()):(o.value=null,console.error(`Anchor: target "${l.target}" not found`))}}return H(()=>l.contextMenu,i=>{o.value!==null&&(v(),n(i))}),H(()=>l.target,()=>{o.value!==null&&v(),x()}),H(()=>l.noParentEvent,i=>{o.value!==null&&(i===!0?v():n())}),Me(()=>{x(),t!==!0&&l.modelValue===!0&&o.value===null&&f("update:modelValue",!1)}),X(()=>{h!==null&&clearTimeout(h),v()}),{anchorEl:o,canShow:m,anchorEvents:s}}function ut(e,t){const n=M(null);let l;function a(h,m){const s=`${m!==void 0?"add":"remove"}EventListener`,v=m!==void 0?m:l;h!==window&&h[s]("scroll",v,j.passive),window[s]("scroll",v,j.passive),l=m}function f(){n.value!==null&&(a(n.value),n.value=null)}const o=H(()=>e.noParentEvent,()=>{n.value!==null&&(f(),t())});return X(o),{localScrollTarget:n,unconfigureScrollTarget:f,changeScrollEvent:a}}const{notPassiveCapture:R}=j,B=[];function A(e){const t=e.target;if(t===void 0||t.nodeType===8||t.classList.contains("no-pointer-events")===!0)return;let n=ie.length-1;for(;n>=0;){const l=ie[n].$;if(l.type.name==="QTooltip"){n--;continue}if(l.type.name!=="QDialog")break;if(l.props.seamless!==!0)return;n--}for(let l=B.length-1;l>=0;l--){const a=B[l];if((a.anchorEl.value===null||a.anchorEl.value.contains(t)===!1)&&(t===document.body||a.innerRef.value!==null&&a.innerRef.value.contains(t)===!1))e.qClickOutside=!0,a.onClickOutside(e);else return}}function st(e){B.push(e),B.length===1&&(document.addEventListener("mousedown",A,R),document.addEventListener("touchstart",A,R))}function ue(e){const t=B.findIndex(n=>n===e);t!==-1&&(B.splice(t,1),B.length===0&&(document.removeEventListener("mousedown",A,R),document.removeEventListener("touchstart",A,R)))}let se,re;function ce(e){const t=e.split(" ");return t.length!==2?!1:["top","center","bottom"].includes(t[0])!==!0?(console.error("Anchor/Self position must start with one of top/center/bottom"),!1):["left","middle","right","start","end"].includes(t[1])!==!0?(console.error("Anchor/Self position must end with one of left/middle/right/start/end"),!1):!0}function rt(e){return e?!(e.length!==2||typeof e[0]!="number"||typeof e[1]!="number"):!0}const D={"start#ltr":"left","start#rtl":"right","end#ltr":"right","end#rtl":"left"};["left","middle","right"].forEach(e=>{D[`${e}#ltr`]=e,D[`${e}#rtl`]=e});function de(e,t){const n=e.split(" ");return{vertical:n[0],horizontal:D[`${n[1]}#${t===!0?"rtl":"ltr"}`]}}function ct(e,t){let{top:n,left:l,right:a,bottom:f,width:o,height:h}=e.getBoundingClientRect();return t!==void 0&&(n-=t[1],l-=t[0],f+=t[1],a+=t[0],o+=t[0],h+=t[1]),{top:n,bottom:f,height:h,left:l,right:a,width:o,middle:l+(a-l)/2,center:n+(f-n)/2}}function dt(e,t,n){let{top:l,left:a}=e.getBoundingClientRect();return l+=t.top,a+=t.left,n!==void 0&&(l+=n[1],a+=n[0]),{top:l,bottom:l+1,height:1,left:a,right:a+1,width:1,middle:a,center:l}}function ft(e,t){return{top:0,center:t/2,bottom:t,left:0,middle:e/2,right:e}}function fe(e,t,n,l){return{top:e[n.vertical]-t[l.vertical],left:e[n.horizontal]-t[l.horizontal]}}function he(e,t=0){if(e.targetEl===null||e.anchorEl===null||t>5)return;if(e.targetEl.offsetHeight===0||e.targetEl.offsetWidth===0){setTimeout(()=>{he(e,t+1)},10);return}const{targetEl:n,offset:l,anchorEl:a,anchorOrigin:f,selfOrigin:o,absoluteOffset:h,fit:m,cover:s,maxHeight:v,maxWidth:g}=e;if(We.is.ios===!0&&window.visualViewport!==void 0){const _=document.body.style,{offsetLeft:S,offsetTop:C}=window.visualViewport;S!==se&&(_.setProperty("--q-pe-left",S+"px"),se=S),C!==re&&(_.setProperty("--q-pe-top",C+"px"),re=C)}const{scrollLeft:x,scrollTop:i}=n,r=h===void 0?ct(a,s===!0?[0,0]:l):dt(a,h,l);Object.assign(n.style,{top:0,left:0,minWidth:null,minHeight:null,maxWidth:g,maxHeight:v,visibility:"visible"});const{offsetWidth:E,offsetHeight:c}=n,{elWidth:w,elHeight:L}=m===!0||s===!0?{elWidth:Math.max(r.width,E),elHeight:s===!0?Math.max(r.height,c):c}:{elWidth:E,elHeight:c};let d={maxWidth:g,maxHeight:v};(m===!0||s===!0)&&(d.minWidth=r.width+"px",s===!0&&(d.minHeight=r.height+"px")),Object.assign(n.style,d);const k=ft(w,L);let y=fe(r,k,f,o);if(h===void 0||l===void 0)Q(y,r,k,f,o);else{const{top:_,left:S}=y;Q(y,r,k,f,o);let C=!1;if(y.top!==_){C=!0;const T=2*l[1];r.center=r.top-=T,r.bottom-=T+2}if(y.left!==S){C=!0;const T=2*l[0];r.middle=r.left-=T,r.right-=T+2}C===!0&&(y=fe(r,k,f,o),Q(y,r,k,f,o))}d={top:y.top+"px",left:y.left+"px"},y.maxHeight!==void 0&&(d.maxHeight=y.maxHeight+"px",r.height>y.maxHeight&&(d.minHeight=d.maxHeight)),y.maxWidth!==void 0&&(d.maxWidth=y.maxWidth+"px",r.width>y.maxWidth&&(d.minWidth=d.maxWidth)),Object.assign(n.style,d),n.scrollTop!==i&&(n.scrollTop=i),n.scrollLeft!==x&&(n.scrollLeft=x)}function Q(e,t,n,l,a){const f=n.bottom,o=n.right,h=Pe(),m=window.innerHeight-h,s=document.body.clientWidth;if(e.top<0||e.top+f>m)if(a.vertical==="center")e.top=t[l.vertical]>m/2?Math.max(0,m-f):0,e.maxHeight=Math.min(f,m);else if(t[l.vertical]>m/2){const v=Math.min(m,l.vertical==="center"?t.center:l.vertical===a.vertical?t.bottom:t.top);e.maxHeight=Math.min(f,v),e.top=Math.max(0,v-f)}else e.top=Math.max(0,l.vertical==="center"?t.center:l.vertical===a.vertical?t.top:t.bottom),e.maxHeight=Math.min(f,m-e.top);if(e.left<0||e.left+o>s)if(e.maxWidth=Math.min(o,s),a.horizontal==="middle")e.left=t[l.horizontal]>s/2?Math.max(0,s-o):0;else if(t[l.horizontal]>s/2){const v=Math.min(s,l.horizontal==="middle"?t.middle:l.horizontal===a.horizontal?t.right:t.left);e.maxWidth=Math.min(o,v),e.left=Math.max(0,v-e.maxWidth)}else e.left=Math.max(0,l.horizontal==="middle"?t.middle:l.horizontal===a.horizontal?t.left:t.right),e.maxWidth=Math.min(o,s-e.left)}var xt=P({name:"QMenu",inheritAttrs:!1,props:{...it,...Re,...V,...Ae,persistent:Boolean,autoClose:Boolean,separateClosePopup:Boolean,noRouteDismiss:Boolean,noRefocus:Boolean,noFocus:Boolean,fit:Boolean,cover:Boolean,square:Boolean,anchor:{type:String,validator:ce},self:{type:String,validator:ce},offset:{type:Array,validator:rt},scrollTarget:ze,touchPosition:Boolean,maxHeight:{type:String,default:null},maxWidth:{type:String,default:null}},emits:[...$e,"click","escapeKey"],setup(e,{slots:t,emit:n,attrs:l}){let a=null,f,o,h;const m=z(),{proxy:s}=m,{$q:v}=s,g=M(null),x=M(!1),i=b(()=>e.persistent!==!0&&e.noRouteDismiss!==!0),r=N(e,v),{registerTick:E,removeTick:c}=pe(),{registerTimeout:w}=Ie(),{transitionProps:L,transitionStyle:d}=Fe(e),{localScrollTarget:k,changeScrollEvent:y,unconfigureScrollTarget:_}=ut(e,te),{anchorEl:S,canShow:C}=ot({showing:x}),{hide:T}=Ke({showing:x,canShow:C,handleShow:ye,handleHide:qe,hideOnRouteChange:i,processOnMount:!0}),{showPortal:Y,hidePortal:G,renderPortal:me}=Qe(m,g,Se,"menu"),$={anchorEl:S,innerRef:g,onClickOutside(u){if(e.persistent!==!0&&x.value===!0)return T(u),(u.type==="touchstart"||u.target.classList.contains("q-dialog__backdrop"))&&U(u),!0}},J=b(()=>de(e.anchor||(e.cover===!0?"center middle":"bottom start"),v.lang.rtl)),ge=b(()=>e.cover===!0?J.value:de(e.self||"top start",v.lang.rtl)),be=b(()=>(e.square===!0?" q-menu--square":"")+(r.value===!0?" q-menu--dark q-dark":"")),xe=b(()=>e.autoClose===!0?{onClick:ke}:{}),Z=b(()=>x.value===!0&&e.persistent!==!0);H(Z,u=>{u===!0?(Xe(I),st($)):(oe(I),ue($))});function p(){Ye(()=>{let u=g.value;u&&u.contains(document.activeElement)!==!0&&(u=u.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||u.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||u.querySelector("[autofocus], [data-autofocus]")||u,u.focus({preventScroll:!0}))})}function ye(u){if(a=e.noRefocus===!1?document.activeElement:null,je(le),Y(),te(),f=void 0,u!==void 0&&(e.touchPosition||e.contextMenu)){const F=De(u);if(F.left!==void 0){const{top:we,left:Ce}=S.value.getBoundingClientRect();f={left:F.left-Ce,top:F.top-we}}}o===void 0&&(o=H(()=>v.screen.width+"|"+v.screen.height+"|"+e.self+"|"+e.anchor+"|"+v.lang.rtl,W)),e.noFocus!==!0&&document.activeElement.blur(),E(()=>{W(),e.noFocus!==!0&&p()}),w(()=>{v.platform.is.ios===!0&&(h=e.autoClose,g.value.click()),W(),Y(!0),n("show",u)},e.transitionDuration)}function qe(u){c(),G(),ee(!0),a!==null&&(u===void 0||u.qClickOutside!==!0)&&(((u&&u.type.indexOf("key")===0?a.closest('[tabindex]:not([tabindex^="-"])'):void 0)||a).focus(),a=null),w(()=>{G(!0),n("hide",u)},e.transitionDuration)}function ee(u){f=void 0,o!==void 0&&(o(),o=void 0),(u===!0||x.value===!0)&&(Oe(le),_(),ue($),oe(I)),u!==!0&&(a=null)}function te(){(S.value!==null||e.scrollTarget!==void 0)&&(k.value=Ve(S.value,e.scrollTarget),y(k.value,W))}function ke(u){h!==!0?(Ne(s,u),n("click",u)):h=!1}function le(u){Z.value===!0&&e.noFocus!==!0&&Ge(g.value,u.target)!==!0&&p()}function I(u){n("escapeKey"),T(u)}function W(){he({targetEl:g.value,offset:e.offset,anchorEl:S.value,anchorOrigin:J.value,selfOrigin:ge.value,absoluteOffset:f,fit:e.fit,cover:e.cover,maxHeight:e.maxHeight,maxWidth:e.maxWidth})}function Se(){return q(Ue,L.value,()=>x.value===!0?q("div",{role:"menu",...l,ref:g,tabindex:-1,class:["q-menu q-position-engine scroll"+be.value,l.class],style:[l.style,d.value],...xe.value},O(t.default)):null)}return X(ee),Object.assign(s,{focus:p,updatePosition:W}),me}});const vt={xs:8,sm:10,md:14,lg:20,xl:24};var yt=P({name:"QChip",props:{...V,...Je,dense:Boolean,icon:String,iconRight:String,iconRemove:String,iconSelected:String,label:[String,Number],color:String,textColor:String,modelValue:{type:Boolean,default:!0},selected:{type:Boolean,default:null},square:Boolean,outline:Boolean,clickable:Boolean,removable:Boolean,removeAriaLabel:String,tabindex:[String,Number],disable:Boolean,ripple:{type:[Boolean,Object],default:!0}},emits:["update:modelValue","update:selected","remove","click"],setup(e,{slots:t,emit:n}){const{proxy:{$q:l}}=z(),a=N(e,l),f=Ze(e,vt),o=b(()=>e.selected===!0||e.icon!==void 0),h=b(()=>e.selected===!0?e.iconSelected||l.iconSet.chip.selected:e.icon),m=b(()=>e.iconRemove||l.iconSet.chip.remove),s=b(()=>e.disable===!1&&(e.clickable===!0||e.selected!==null)),v=b(()=>{const c=e.outline===!0&&e.color||e.textColor;return"q-chip row inline no-wrap items-center"+(e.outline===!1&&e.color!==void 0?` bg-${e.color}`:"")+(c?` text-${c} q-chip--colored`:"")+(e.disable===!0?" disabled":"")+(e.dense===!0?" q-chip--dense":"")+(e.outline===!0?" q-chip--outline":"")+(e.selected===!0?" q-chip--selected":"")+(s.value===!0?" q-chip--clickable cursor-pointer non-selectable q-hoverable":"")+(e.square===!0?" q-chip--square":"")+(a.value===!0?" q-chip--dark q-dark":"")}),g=b(()=>{const c=e.disable===!0?{tabindex:-1,"aria-disabled":"true"}:{tabindex:e.tabindex||0},w={...c,role:"button","aria-hidden":"false","aria-label":e.removeAriaLabel||l.lang.label.remove};return{chip:c,remove:w}});function x(c){c.keyCode===13&&i(c)}function i(c){e.disable||(n("update:selected",!e.selected),n("click",c))}function r(c){(c.keyCode===void 0||c.keyCode===13)&&(U(c),e.disable===!1&&(n("update:modelValue",!1),n("remove")))}function E(){const c=[];s.value===!0&&c.push(q("div",{class:"q-focus-helper"})),o.value===!0&&c.push(q(K,{class:"q-chip__icon q-chip__icon--left",name:h.value}));const w=e.label!==void 0?[q("div",{class:"ellipsis"},[e.label])]:void 0;return c.push(q("div",{class:"q-chip__content col row no-wrap items-center q-anchor--skip"},tt(t.default,w))),e.iconRight&&c.push(q(K,{class:"q-chip__icon q-chip__icon--right",name:e.iconRight})),e.removable===!0&&c.push(q(K,{class:"q-chip__icon q-chip__icon--remove cursor-pointer",name:m.value,...g.value.remove,onClick:r,onKeyup:r})),c}return()=>{if(e.modelValue===!1)return;const c={class:v.value,style:f.value};return s.value===!0&&Object.assign(c,g.value.chip,{onClick:i,onKeyup:x}),et("div",c,E(),"ripple",e.ripple!==!1&&e.disable!==!0,()=>[[lt,e.ripple]])}}});function qt(e,t,n){return n<=t?t:Math.min(n,Math.max(t,e))}function kt(e,t,n){if(n<=t)return t;const l=n-t+1;let a=t+(e-t)%l;return a<t&&(a=l+a),a===0?0:a}export{xt as Q,bt as a,qt as b,nt as c,mt as d,gt as e,yt as f,kt as n};