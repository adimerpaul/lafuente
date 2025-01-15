import{_ as c,O as m,P as f,Q as t,R as i,aD as x,T as o,aB as d,ba as r,S as p,aC as V}from"./index.29d6101c.js";import{h as u,Q as b}from"./moment.a7e44122.js";import{Q as v}from"./QForm.0bbe3823.js";import{Q as q}from"./QPage.cf80d10e.js";import"./format.f478ffcc.js";const g={name:"PacienteNewPage",data(){return{paciente:{nombre:"",apellido:"",fecha_nacimiento:"",identificacion:"",edad:"",sexo:"",estado_civil:"",direccion:"",telefono:""},estados_civiles:["Soltero","Casado","Divorciado","Viudo","Otro"],loading:!1}},methods:{calculateEdad(){let s=u().diff(this.paciente.fecha_nacimiento,"years");if(isNaN(s)){this.paciente.edad="";return}this.paciente.edad=s},pacienteSave(){this.loading=!0,this.$axios.post("pacientes",this.paciente).then(s=>{this.$alert.success(s.data.message),this.$router.push({name:"paciente",params:{id:s.data.id}})}).catch(s=>{this.$alert.error(s.response.data.message)}).finally(()=>{this.loading=!1})}},computed:{edad(){let s=u().diff(this.paciente.fecha_nacimiento,"years");return isNaN(s)?"":s}}},Q={class:"row"},C={class:"col-12 col-md-3 q-pa-xs"},N={class:"col-12 col-md-3 q-pa-xs"},U={class:"col-12 col-md-3 q-pa-xs"},S={class:"col-12 col-md-3 q-pa-xs"},h={class:"col-12 col-md-3 q-pa-xs"},y={class:"col-12 col-md-3 q-pa-xs"},E={class:"col-12 col-md-3 q-pa-xs"},B={class:"col-12 col-md-3 q-pa-xs"},F={class:"col-12 col-md-6 q-pa-xs"},P={class:"col-12 q-pa-xs"},k={class:"text-center"};function w(s,e,D,_,a,n){return m(),f(q,{class:"q-pa-md"},{default:t(()=>[i(V,{flat:"",bordered:""},{default:t(()=>[i(x,null,{default:t(()=>[i(v,{onSubmit:n.pacienteSave},{default:t(()=>[o("div",Q,[e[20]||(e[20]=o("div",{class:"col-12"},[o("div",{class:"text-h6 text-center"},"Nuevo paciente")],-1)),o("div",C,[e[11]||(e[11]=o("label",{class:"text-bold"},"Nombre:",-1)),i(d,{modelValue:a.paciente.nombre,"onUpdate:modelValue":e[0]||(e[0]=l=>a.paciente.nombre=l),dense:"",outlined:"",placeholder:"Nombre",rules:[l=>!!l||"Campo requerido"]},null,8,["modelValue","rules"])]),o("div",N,[e[12]||(e[12]=o("label",{class:"text-bold"},"Apellido:",-1)),i(d,{modelValue:a.paciente.apellido,"onUpdate:modelValue":e[1]||(e[1]=l=>a.paciente.apellido=l),dense:"",outlined:"",placeholder:"Apellido",rules:[l=>!!l||"Campo requerido"]},null,8,["modelValue","rules"])]),o("div",U,[e[13]||(e[13]=o("label",{class:"text-bold"},"Fecha de nacimiento:",-1)),i(d,{modelValue:a.paciente.fecha_nacimiento,"onUpdate:modelValue":[e[2]||(e[2]=l=>a.paciente.fecha_nacimiento=l),n.calculateEdad],dense:"",outlined:"",placeholder:"Fecha de nacimiento",type:"date"},null,8,["modelValue","onUpdate:modelValue"])]),o("div",S,[e[14]||(e[14]=o("label",{class:"text-bold"},"Identificaci\xF3n:",-1)),i(d,{modelValue:a.paciente.identificacion,"onUpdate:modelValue":e[3]||(e[3]=l=>a.paciente.identificacion=l),dense:"",outlined:"",placeholder:"Identificaci\xF3n"},null,8,["modelValue"])]),o("div",h,[e[15]||(e[15]=o("label",{class:"text-bold"},"Edad:",-1)),i(d,{modelValue:a.paciente.edad,"onUpdate:modelValue":e[4]||(e[4]=l=>a.paciente.edad=l),dense:"",outlined:"",placeholder:"Edad"},null,8,["modelValue"])]),o("div",y,[e[16]||(e[16]=o("label",{class:"text-bold"},"Sexo:",-1)),o("div",null,[i(r,{modelValue:a.paciente.sexo,"onUpdate:modelValue":e[5]||(e[5]=l=>a.paciente.sexo=l),val:"M",label:"Masculino",rules:[l=>!!l||"Campo requerido"],name:"sexo"},null,8,["modelValue","rules"]),i(r,{modelValue:a.paciente.sexo,"onUpdate:modelValue":e[6]||(e[6]=l=>a.paciente.sexo=l),val:"F",label:"Femenino",rules:[l=>!!l||"Campo requerido"],name:"sexo"},null,8,["modelValue","rules"])])]),o("div",E,[e[17]||(e[17]=o("label",{class:"text-bold"},"Estado civil:",-1)),i(b,{modelValue:a.paciente.estado_civil,"onUpdate:modelValue":e[7]||(e[7]=l=>a.paciente.estado_civil=l),dense:"",outlined:"",options:a.estados_civiles,placeholder:"Estado civil",clearable:""},null,8,["modelValue","options"])]),o("div",B,[e[18]||(e[18]=o("label",{class:"text-bold"},"Tel\xE9fono:",-1)),i(d,{modelValue:a.paciente.telefono,"onUpdate:modelValue":e[8]||(e[8]=l=>a.paciente.telefono=l),dense:"",outlined:"",placeholder:"Tel\xE9fono"},null,8,["modelValue"])]),o("div",F,[e[19]||(e[19]=o("label",{class:"text-bold"},"Direcci\xF3n:",-1)),i(d,{modelValue:a.paciente.direccion,"onUpdate:modelValue":e[9]||(e[9]=l=>a.paciente.direccion=l),dense:"",outlined:"",placeholder:"Direcci\xF3n"},null,8,["modelValue"])]),o("div",P,[o("div",k,[i(p,{color:"negative",label:"Cancelar",onClick:e[10]||(e[10]=l=>s.$router.push({name:"pacientes"})),"no-caps":"",loading:a.loading},null,8,["loading"]),i(p,{color:"primary",label:"Guardar",type:"submit","no-caps":"",loading:a.loading,class:"q-ml-sm"},null,8,["loading"])])])])]),_:1},8,["onSubmit"])]),_:1})]),_:1})]),_:1})}var R=c(g,[["render",w]]);export{R as default};
