import{Q as n}from"./QImg.ffa351a0.js";import{_ as p,B as d,C as c,E as a,F as t,G as e,L as f,R as g,aE as u,I as w,aU as h,Q as x,J as v}from"./index.b06572a0.js";import{Q as b}from"./QSpace.d75b8165.js";import{Q}from"./QForm.e993d99a.js";import{Q as V}from"./QPage.a459216a.js";import{Q as _,a as y}from"./QLayout.9160157a.js";import"./QResizeObserver.daf6fab7.js";const k={data(){return{username:"",password:"",remember:!1,loading:!1,showPassword:!1}},methods:{login(){this.loading=!0,this.$axios.post("login",{username:this.username,password:this.password}).then(r=>{const s=r.data.user,i=r.data.token;this.$axios.defaults.headers.common.Authorization=`Bearer ${i}`,this.$store.isLogged=!0,this.$store.user=s,localStorage.setItem("tokenEducation",i),this.$alert.success("Bienvenido "+s.name),this.$router.push("/")}).catch(r=>{this.$alert.error(r.response.data.message)}).finally(()=>{this.loading=!1})}}},B={class:"row"},P={key:0,class:"col-12 col-md-8 flex flex-center",style:{background:"#E6EDF9",height:"100vh"}},q={style:{position:"absolute",top:"25px",left:"40px"}},C={class:"col-12 col-md-4 flex flex-center"},E={class:"row q-pa-lg"},I={class:"col-12 flex flex-center"},L={class:"col-12 q-pt-md"},F={class:"col-12"},N={class:"col-12 row items-center"},U={class:"col-12 q-mt-md"};function S(r,s,i,R,o,m){return d(),c(_,{view:"lHh Lpr lFf"},{default:a(()=>[t(y,null,{default:a(()=>[t(V,null,{default:a(()=>[e("div",B,[r.$q.screen.lt.md?g("",!0):(d(),f("div",P,[e("div",q,[t(n,{src:"logoLargo.png",width:"150px"})]),t(n,{src:"login-bg-BprgzFH_.svg",width:"450px"})])),e("div",C,[t(Q,{onSubmit:m.login,class:"q-gutter-md",style:{"max-width":"400px"}},{default:a(()=>[e("div",E,[e("div",I,[t(n,{src:"logoLargo.png",width:"150px"})]),s[8]||(s[8]=e("div",{class:"col-12 text-h6 text-bold"},"Bienvenido al sistema",-1)),s[9]||(s[9]=e("div",{class:"col-12 text-subtitle1"},"Inicia sesi\xF3n para continuar",-1)),e("div",L,[s[5]||(s[5]=e("label",{for:"username",class:"text-bold"},"Usuario",-1)),t(u,{outlined:"",modelValue:o.username,"onUpdate:modelValue":s[0]||(s[0]=l=>o.username=l),rules:[l=>!!l||"Este campo es requerido"]},null,8,["modelValue","rules"])]),e("div",F,[s[6]||(s[6]=e("label",{for:"password",class:"text-bold"},"Contrase\xF1a",-1)),t(u,{outlined:"",modelValue:o.password,"onUpdate:modelValue":s[2]||(s[2]=l=>o.password=l),type:o.showPassword?"text":"password","onClick:append":s[3]||(s[3]=l=>o.showPassword=!o.showPassword),"append-icon":"visibility",rules:[l=>!!l||"Este campo es requerido"]},{append:a(()=>[t(w,{name:o.showPassword?"visibility_off":"visibility",onClick:s[1]||(s[1]=l=>o.showPassword=!o.showPassword)},null,8,["name"])]),_:1},8,["modelValue","type","rules"])]),e("div",N,[t(h,{modelValue:o.remember,"onUpdate:modelValue":s[4]||(s[4]=l=>o.remember=l),label:"Recordar usuario"},null,8,["modelValue"]),t(b),s[7]||(s[7]=e("a",{href:""},[e("span",{class:"text-caption"},"\xBFOlvidaste tu contrase\xF1a?")],-1))]),e("div",U,[t(x,{color:"blue",label:"Iniciar sesi\xF3n",class:"full-width","no-caps":"",loading:o.loading,type:"submit"},null,8,["loading"])]),s[10]||(s[10]=e("div",{class:"col-12 q-mt-md"},[v(" No tienes cuenta? "),e("a",{href:""},"Reg\xEDstrate")],-1))])]),_:1},8,["onSubmit"])])])]),_:1})]),_:1})]),_:1})}var T=p(k,[["render",S]]);export{T as default};
