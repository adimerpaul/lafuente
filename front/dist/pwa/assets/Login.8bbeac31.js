import{a as m,c as P,r as g,E as C,au as O,H as U,h as d,ai as M,d as A,bj as W,w as Y,b5 as q,g as G,_ as J,O as L,P as K,Q as y,R as l,T as o,Y as X,aE as Z,aB as T,aS as ee,S as te,V as ie}from"./index.31111e77.js";import{Q as oe}from"./QSpace.9dd36978.js";import{Q as ae}from"./QForm.0e6ad86e.js";import{Q as le}from"./QPage.1fc117fb.js";import{Q as se,a as re}from"./QLayout.e191e367.js";import"./QResizeObserver.72bce66b.js";const ne={ratio:[String,Number]};function ue(e,t){return m(()=>{const s=Number(e.ratio||(t!==void 0?t.value:void 0));return isNaN(s)!==!0&&s>0?{paddingBottom:`${100/s}%`}:null})}const de=1.7778;var p=P({name:"QImg",props:{...ne,src:String,srcset:String,sizes:String,alt:String,crossorigin:String,decoding:String,referrerpolicy:String,draggable:Boolean,loading:{type:String,default:"lazy"},loadingShowDelay:{type:[Number,String],default:0},fetchpriority:{type:String,default:"auto"},width:String,height:String,initialRatio:{type:[Number,String],default:de},placeholderSrc:String,errorSrc:String,fit:{type:String,default:"cover"},position:{type:String,default:"50% 50%"},imgClass:String,imgStyle:Object,noSpinner:Boolean,noNativeMenu:Boolean,noTransition:Boolean,spinnerColor:String,spinnerSize:String},emits:["load","error"],setup(e,{slots:t,emit:s}){const b=g(e.initialRatio),r=ue(e,b),f=G(),{registerTimeout:a,removeTimeout:w}=C(),{registerTimeout:V,removeTimeout:k}=C(),_=m(()=>e.placeholderSrc!==void 0?{src:e.placeholderSrc}:null),N=m(()=>e.errorSrc!==void 0?{src:e.errorSrc,__qerror:!0}:null),n=[g(null),g(_.value)],u=g(0),v=g(!1),h=g(!1),I=m(()=>`q-img q-img--${e.noNativeMenu===!0?"no-":""}menu`),z=m(()=>({width:e.width,height:e.height})),E=m(()=>`q-img__image ${e.imgClass!==void 0?e.imgClass+" ":""}q-img__image--with${e.noTransition===!0?"out":""}-transition q-img__image--`),R=m(()=>({...e.imgStyle,objectFit:e.fit,objectPosition:e.position}));function $(){if(k(),e.loadingShowDelay===0){v.value=!0;return}V(()=>{v.value=!0},e.loadingShowDelay)}function x(){k(),v.value=!1}function F({target:i}){q(f)===!1&&(w(),b.value=i.naturalHeight===0?.5:i.naturalWidth/i.naturalHeight,Q(i,1))}function Q(i,c){c===1e3||q(f)===!0||(i.complete===!0?H(i):a(()=>{Q(i,c+1)},50))}function H(i){q(f)!==!0&&(u.value=u.value^1,n[u.value].value=null,x(),i.getAttribute("__qerror")!=="true"&&(h.value=!1),s("load",i.currentSrc||i.src))}function j(i){w(),x(),h.value=!0,n[u.value].value=N.value,n[u.value^1].value=_.value,s("error",i)}function B(i){const c=n[i].value,S={key:"img_"+i,class:E.value,style:R.value,alt:e.alt,crossorigin:e.crossorigin,decoding:e.decoding,referrerpolicy:e.referrerpolicy,height:e.height,width:e.width,loading:e.loading,fetchpriority:e.fetchpriority,"aria-hidden":"true",draggable:e.draggable,...c};return u.value===i?Object.assign(S,{class:S.class+"current",onLoad:F,onError:j}):S.class+="loaded",d("div",{class:"q-img__container absolute-full",key:"img"+i},d("img",S))}function D(){return v.value===!1?d("div",{key:"content",class:"q-img__content absolute-full q-anchor--skip"},A(t[h.value===!0?"error":"default"])):d("div",{key:"loading",class:"q-img__loading absolute-full flex flex-center"},t.loading!==void 0?t.loading():e.noSpinner===!0?void 0:[d(W,{color:e.spinnerColor,size:e.spinnerSize})])}{let i=function(){Y(()=>e.src||e.srcset||e.sizes?{src:e.src,srcset:e.srcset,sizes:e.sizes}:null,c=>{w(),h.value=!1,c===null?(x(),n[u.value^1].value=_.value):$(),n[u.value].value=c},{immediate:!0})};O.value===!0?U(i):i()}return()=>{const i=[];return r.value!==null&&i.push(d("div",{key:"filler",style:r.value})),n[0].value!==null&&i.push(B(0)),n[1].value!==null&&i.push(B(1)),i.push(d(M,{name:"q-transition--fade"},D)),d("div",{key:"main",class:I.value,style:z.value,role:"img","aria-label":e.alt},i)}}});const ce={data(){return{username:"",password:"",remember:!1,loading:!1}},methods:{login(){this.loading=!0,this.$axios.post("login",{username:this.username,password:this.password}).then(e=>{const t=e.data.user,s=e.data.token;this.$axios.defaults.headers.common.Authorization=`Bearer ${s}`,this.$store.isLogged=!0,this.$store.user=t,localStorage.setItem("tokenEducation",s),this.$alert.success("Bienvenido "+t.name),this.$router.push("/")}).catch(e=>{this.$alert.error(e.response.data.message)}).finally(()=>{this.loading=!1})}}},me={class:"row"},ge={key:0,class:"col-12 col-md-8 flex flex-center",style:{background:"#E6EDF9",height:"100vh"}},fe={style:{position:"absolute",top:"25px",left:"40px"}},ve={class:"col-12 col-md-4 flex flex-center"},he={class:"row q-pa-lg"},Se={class:"col-12 flex flex-center"},ye={class:"col-12 q-pt-md"},be={class:"col-12"},we={class:"col-12 row items-center"},_e={class:"col-12 q-mt-md"};function xe(e,t,s,b,r,f){return L(),K(se,{view:"lHh Lpr lFf"},{default:y(()=>[l(re,null,{default:y(()=>[l(le,null,{default:y(()=>[o("div",me,[e.$q.screen.lt.md?Z("",!0):(L(),X("div",ge,[o("div",fe,[l(p,{src:"logoLargo.png",width:"150px"})]),l(p,{src:"login-bg-BprgzFH_.svg",width:"450px"})])),o("div",ve,[l(ae,{onSubmit:f.login,class:"q-gutter-md",style:{"max-width":"400px"}},{default:y(()=>[o("div",he,[o("div",Se,[l(p,{src:"logoLargo.png",width:"150px"})]),t[6]||(t[6]=o("div",{class:"col-12 text-h6 text-bold"},"Bienvenido al sistema",-1)),t[7]||(t[7]=o("div",{class:"col-12 text-subtitle1"},"Inicia sesi\xF3n para continuar",-1)),o("div",ye,[t[3]||(t[3]=o("label",{for:"username",class:"text-bold"},"Usuario",-1)),l(T,{outlined:"",modelValue:r.username,"onUpdate:modelValue":t[0]||(t[0]=a=>r.username=a),rules:[a=>!!a||"Este campo es requerido"]},null,8,["modelValue","rules"])]),o("div",be,[t[4]||(t[4]=o("label",{for:"password",class:"text-bold"},"Contrase\xF1a",-1)),l(T,{outlined:"",modelValue:r.password,"onUpdate:modelValue":t[1]||(t[1]=a=>r.password=a),type:"password",rules:[a=>!!a||"Este campo es requerido"]},null,8,["modelValue","rules"])]),o("div",we,[l(ee,{modelValue:r.remember,"onUpdate:modelValue":t[2]||(t[2]=a=>r.remember=a),label:"Recordar usuario"},null,8,["modelValue"]),l(oe),t[5]||(t[5]=o("a",{href:""},[o("span",{class:"text-caption"},"\xBFOlvidaste tu contrase\xF1a?")],-1))]),o("div",_e,[l(te,{color:"blue",label:"Iniciar sesi\xF3n",class:"full-width","no-caps":"",loading:r.loading,type:"submit"},null,8,["loading"])]),t[8]||(t[8]=o("div",{class:"col-12 q-mt-md"},[ie(" No tienes cuenta? "),o("a",{href:""},"Reg\xEDstrate")],-1))])]),_:1},8,["onSubmit"])])])]),_:1})]),_:1})]),_:1})}var Le=J(ce,[["render",xe]]);export{Le as default};