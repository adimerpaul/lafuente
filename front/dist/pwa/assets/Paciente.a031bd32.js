import{c as le,A as te,b7 as ne,C as ie,a as r,r as oe,w as se,b8 as O,b9 as ue,a3 as re,h as x,aB as v,g as de,S,_ as ce,O as Q,P as B,Q as s,R as i,T as C,U as q,J as G,V as L,aC as me,aD as M,W as ge,aE as fe,aF as pe}from"./index.29d6101c.js";import{b as ve,a as z,d as _,e as j,f as be}from"./format.f478ffcc.js";import{Q as he}from"./QList.272b2b14.js";import{Q as ye}from"./QBtnDropdown.9204262c.js";import{Q as A,a as Ve}from"./QTable.b4a49350.js";import{Q as xe}from"./QSpace.2b23443e.js";import{Q as Ce}from"./moment.a7e44122.js";import{Q as Se}from"./QForm.0bbe3823.js";import{Q as Pe}from"./QPage.cf80d10e.js";import{C as R}from"./ClosePopup.051478b5.js";import"./QBtnGroup.30afd810.js";import"./QMarkupTable.fb150080.js";function D(e,l){return[!0,!1].includes(e)?e:l}var ke=le({name:"QPagination",props:{...te,modelValue:{type:Number,required:!0},min:{type:[Number,String],default:1},max:{type:[Number,String],required:!0},maxPages:{type:[Number,String],default:0,validator:e=>(typeof e=="string"?parseInt(e,10):e)>=0},inputStyle:[Array,String,Object],inputClass:[Array,String,Object],size:String,disable:Boolean,input:Boolean,iconPrev:String,iconNext:String,iconFirst:String,iconLast:String,toFn:Function,boundaryLinks:{type:Boolean,default:null},boundaryNumbers:{type:Boolean,default:null},directionLinks:{type:Boolean,default:null},ellipses:{type:Boolean,default:null},ripple:{type:[Boolean,Object],default:null},round:Boolean,rounded:Boolean,flat:Boolean,outline:Boolean,unelevated:Boolean,push:Boolean,glossy:Boolean,color:{type:String,default:"primary"},textColor:String,activeDesign:{type:String,default:"",values:e=>e===""||ne.includes(e)},activeColor:String,activeTextColor:String,gutter:String,padding:{type:String,default:"3px 2px"}},emits:["update:modelValue"],setup(e,{emit:l}){const{proxy:f}=de(),{$q:m}=f,o=ie(e,m),u=r(()=>parseInt(e.min,10)),a=r(()=>parseInt(e.max,10)),P=r(()=>parseInt(e.maxPages,10)),F=r(()=>p.value+" / "+a.value),$=r(()=>D(e.boundaryLinks,e.input)),b=r(()=>D(e.boundaryNumbers,!e.input)),K=r(()=>D(e.directionLinks,e.input)),N=r(()=>D(e.ellipses,!e.input)),k=oe(null),p=r({get:()=>e.modelValue,set:t=>{if(t=parseInt(t,10),e.disable||isNaN(t))return;const n=ve(t,u.value,a.value);e.modelValue!==n&&l("update:modelValue",n)}});se(()=>`${u.value}|${a.value}`,()=>{p.value=e.modelValue});const W=r(()=>"q-pagination row no-wrap items-center"+(e.disable===!0?" disabled":"")),E=r(()=>e.gutter in O?`${O[e.gutter]}px`:e.gutter||null),J=r(()=>E.value!==null?`--q-pagination-gutter-parent:-${E.value};--q-pagination-gutter-child:${E.value}`:null),w=r(()=>{const t=[e.iconFirst||m.iconSet.pagination.first,e.iconPrev||m.iconSet.pagination.prev,e.iconNext||m.iconSet.pagination.next,e.iconLast||m.iconSet.pagination.last];return m.lang.rtl===!0?t.reverse():t}),H=r(()=>({"aria-disabled":e.disable===!0?"true":"false",role:"navigation"})),U=r(()=>ue(e,"flat")),X=r(()=>({[U.value]:!0,round:e.round,rounded:e.rounded,padding:e.padding,color:e.color,textColor:e.textColor,size:e.size,ripple:e.ripple!==null?e.ripple:!0})),Y=r(()=>{const t={[U.value]:!1};return e.activeDesign!==""&&(t[e.activeDesign]=!0),t}),Z=r(()=>({...Y.value,color:e.activeColor||e.color,textColor:e.activeTextColor||e.textColor})),h=r(()=>{let t=Math.max(P.value,1+(N.value?2:0)+(b.value?2:0));const n={pgFrom:u.value,pgTo:a.value,ellipsesStart:!1,ellipsesEnd:!1,boundaryStart:!1,boundaryEnd:!1,marginalStyle:{minWidth:`${Math.max(2,String(a.value).length)}em`}};return P.value&&t<a.value-u.value+1&&(t=1+Math.floor(t/2)*2,n.pgFrom=Math.max(u.value,Math.min(a.value-t+1,e.modelValue-Math.floor(t/2))),n.pgTo=Math.min(a.value,n.pgFrom+t-1),b.value&&(n.boundaryStart=!0,n.pgFrom++),N.value&&n.pgFrom>u.value+(b.value?1:0)&&(n.ellipsesStart=!0,n.pgFrom++),b.value&&(n.boundaryEnd=!0,n.pgTo--),N.value&&n.pgTo<a.value-(b.value?1:0)&&(n.ellipsesEnd=!0,n.pgTo--)),n});function I(t){p.value=t}function ee(t){p.value=p.value+t}const ae=r(()=>{function t(){p.value=k.value,k.value=null}return{"onUpdate:modelValue":n=>{k.value=n},onKeyup:n=>{re(n,13)===!0&&t()},onBlur:t}});function c(t,n,y){const g={"aria-label":n,"aria-current":"false",...X.value,...t};return y===!0&&Object.assign(g,{"aria-current":"true",...Z.value}),n!==void 0&&(e.toFn!==void 0?g.to=e.toFn(n):g.onClick=()=>{I(n)}),x(S,g)}return Object.assign(f,{set:I,setByOffset:ee}),()=>{const t=[],n=[];let y;if($.value===!0&&(t.push(c({key:"bls",disable:e.disable||e.modelValue<=u.value,icon:w.value[0]},u.value)),n.unshift(c({key:"ble",disable:e.disable||e.modelValue>=a.value,icon:w.value[3]},a.value))),K.value===!0&&(t.push(c({key:"bdp",disable:e.disable||e.modelValue<=u.value,icon:w.value[1]},e.modelValue-1)),n.unshift(c({key:"bdn",disable:e.disable||e.modelValue>=a.value,icon:w.value[2]},e.modelValue+1))),e.input!==!0){y=[];const{pgFrom:g,pgTo:T,marginalStyle:V}=h.value;if(h.value.boundaryStart===!0){const d=u.value===e.modelValue;t.push(c({key:"bns",style:V,disable:e.disable,label:u.value},u.value,d))}if(h.value.boundaryEnd===!0){const d=a.value===e.modelValue;n.unshift(c({key:"bne",style:V,disable:e.disable,label:a.value},a.value,d))}h.value.ellipsesStart===!0&&t.push(c({key:"bes",style:V,disable:e.disable,label:"\u2026",ripple:!1},g-1)),h.value.ellipsesEnd===!0&&n.unshift(c({key:"bee",style:V,disable:e.disable,label:"\u2026",ripple:!1},T+1));for(let d=g;d<=T;d++)y.push(c({key:`bpg${d}`,style:V,disable:e.disable,label:d},d,d===e.modelValue))}return x("div",{class:W.value,...H.value},[x("div",{class:"q-pagination__content row no-wrap items-center",style:J.value},[...t,e.input===!0?x(v,{class:"inline",style:{width:`${F.value.length/1.5}em`},type:"number",dense:!0,value:k.value,disable:e.disable,dark:o.value,borderless:!0,inputClass:e.inputClass,inputStyle:e.inputStyle,placeholder:F.value,min:u.value,max:a.value,...ae.value}):x("div",{class:"q-pagination__middle row justify-center"},y),...n])])}}});const we={name:"ProductosPage",data(){return{pacientes:[],paciente:{},pacienteDialog:!1,loading:!1,filter:"",current_page:1,total:0,per_page:10,columns:[{name:"nombre_completo",label:"Nombre",align:"left",field:"nombre_completo"},{name:"identificacion",label:"Identificaci\xF3n",align:"left",field:"identificacion"},{name:"edad",label:"Edad",align:"left",field:"edad"},{name:"sexo",label:"Sexo",align:"left",field:"sexo"},{name:"estado_civil",label:"Estado civil",align:"left",field:"estado_civil"},{name:"direccion",label:"Direcci\xF3n",align:"left",field:"direccion"},{name:"telefono",label:"Tel\xE9fono",align:"left",field:"telefono"}]}},mounted(){this.pacientesGet()},methods:{pacienteNew(){this.$router.push({name:"pacienteNew"})},pacientesGet(){this.loading=!0,this.$axios.get("pacientes",{params:{search:this.filter,page:this.current_page}}).then(e=>{this.pacientes=e.data.data,this.total=e.data.total,this.per_page=e.data.per_page,this.current_page=e.data.current_page}).catch(e=>{this.$alert.error(e.response.data.message)}).finally(()=>{this.loading=!1})},gestionGet(){this.loading=!0,this.$axios.get("gestiones").then(e=>{this.gestiones=e.data,this.loading=!1}).catch(e=>{this.$alert.error(e.response.data.message),this.loading=!1})},pacientePost(){this.loading=!0,this.$axios.post("pacientes",this.paciente).then(e=>{this.pacientesGet(),this.pacienteDialog=!1,this.$alert.success("Periodo creado")}).catch(e=>{this.$alert.error(e.response.data.message)}).finally(()=>{this.loading=!1})},pacientePut(){this.loading=!0,this.$axios.put("pacientes/"+this.paciente.id,this.paciente).then(e=>{this.pacientesGet(),this.pacienteDialog=!1,this.$alert.success("Periodo actualizado")}).catch(e=>{this.$alert.error(e.response.data.message)}).finally(()=>{this.loading=!1})},pacienteEditPassword(e){this.paciente={...e},this.$alert.dialogPrompt("Nueva contrase\xF1a","Ingrese la nueva contrase\xF1a","password").onOk(l=>{this.$axios.put("updatePassword/"+e.id,{password:l}).then(f=>{this.pacientesGet(),this.$alert.success("Contrase\xF1a actualizada")}).catch(f=>{this.$alert.error(f.response.data.message)})})},pacienteEdit(e,l){console.log(l),this.$router.push({name:"paciente",params:{id:l.id}})},pacienteDelete(e){this.$alert.dialog("\xBFDesea eliminar el paciente?").onOk(()=>{this.loading=!0,this.$axios.delete("pacientes/"+e).then(l=>{this.pacientesGet(),this.$alert.success("Periodo eliminado")}).catch(l=>{this.$alert.error(l.response.data.message)}).finally(()=>{this.loading=!1})})}}},Qe={style:{width:"100%"}},Be={class:"flex flex-center"},_e={class:"text-right"};function De(e,l,f,m,o,u){return Q(),B(Pe,{class:"q-pa-md"},{default:s(()=>[i(Ve,{rows:o.pacientes,columns:o.columns,dense:"","wrap-cells":"",flat:"",bordered:"","rows-per-page-options":[0],title:"Usuarios",onRowClick:u.pacienteEdit,"hide-bottom":""},{top:s(()=>[C("div",Qe,[C("div",null,[i(v,{modelValue:o.filter,"onUpdate:modelValue":[l[0]||(l[0]=a=>o.filter=a),u.pacientesGet],label:"Buscar",dense:"",outlined:"",debounce:500,clearable:""},{append:s(()=>[i(q,{name:"search"})]),before:s(()=>[i(S,{color:"primary",label:"Nuevo",onClick:u.pacienteNew,outline:"","no-caps":"",icon:"add_circle_outline",loading:o.loading},null,8,["onClick","loading"])]),_:1},8,["modelValue","onUpdate:modelValue"])]),C("div",Be,[i(ke,{modelValue:o.current_page,"onUpdate:modelValue":[l[1]||(l[1]=a=>o.current_page=a),u.pacientesGet],max:Math.ceil(o.total/o.per_page),"max-pages":5},null,8,["modelValue","max","onUpdate:modelValue"])])])]),"body-cell-actions":s(a=>[i(A,{props:a},{default:s(()=>[i(ye,{label:"Opciones","no-caps":"",size:"10px",dense:"",color:"primary"},{default:s(()=>[i(he,null,{default:s(()=>[G((Q(),B(z,{clickable:"",onClick:P=>u.pacienteEdit(a.row)},{default:s(()=>[i(_,{avatar:""},{default:s(()=>[i(q,{name:"edit"})]),_:1}),i(_,null,{default:s(()=>[i(j,null,{default:s(()=>l[11]||(l[11]=[L("Editar")])),_:1})]),_:1})]),_:2},1032,["onClick"])),[[R]]),G((Q(),B(z,{clickable:"",onClick:P=>u.pacienteDelete(a.row.id)},{default:s(()=>[i(_,{avatar:""},{default:s(()=>[i(q,{name:"delete"})]),_:1}),i(_,null,{default:s(()=>[i(j,null,{default:s(()=>l[12]||(l[12]=[L("Eliminar")])),_:1})]),_:1})]),_:2},1032,["onClick"])),[[R]])]),_:2},1024)]),_:2},1024)]),_:2},1032,["props"])]),"body-cell-role":s(a=>[i(A,{props:a},{default:s(()=>[i(be,{label:a.row.role,color:a.row.color,"text-color":"white",dense:"",size:"14px"},null,8,["label","color"])]),_:2},1032,["props"])]),_:1},8,["rows","columns","onRowClick"]),i(pe,{modelValue:o.pacienteDialog,"onUpdate:modelValue":l[10]||(l[10]=a=>o.pacienteDialog=a),persistent:""},{default:s(()=>[i(me,null,{default:s(()=>[i(M,{class:"q-pb-none row items-center"},{default:s(()=>[C("div",null,ge(e.actionPeriodo)+" paciente ",1),i(xe),i(S,{icon:"close",flat:"",round:"",dense:"",onClick:l[2]||(l[2]=a=>o.pacienteDialog=!1)})]),_:1}),i(M,{class:"q-pt-none"},{default:s(()=>[i(Se,{onSubmit:l[9]||(l[9]=a=>o.paciente.id?u.pacientePut():u.pacientePost())},{default:s(()=>[i(v,{modelValue:o.paciente.name,"onUpdate:modelValue":l[3]||(l[3]=a=>o.paciente.name=a),label:"Nombre",dense:"",outlined:"",rules:[a=>!!a||"Campo requerido"]},null,8,["modelValue","rules"]),i(v,{modelValue:o.paciente.pacientename,"onUpdate:modelValue":l[4]||(l[4]=a=>o.paciente.pacientename=a),label:"Usuario",dense:"",outlined:"",rules:[a=>!!a||"Campo requerido"]},null,8,["modelValue","rules"]),i(v,{modelValue:o.paciente.email,"onUpdate:modelValue":l[5]||(l[5]=a=>o.paciente.email=a),label:"Email",dense:"",outlined:"",hint:""},null,8,["modelValue"]),o.paciente.id?fe("",!0):(Q(),B(v,{key:0,modelValue:o.paciente.password,"onUpdate:modelValue":l[6]||(l[6]=a=>o.paciente.password=a),label:"Contrase\xF1a",dense:"",outlined:"",rules:[a=>!!a||"Campo requerido"]},null,8,["modelValue","rules"])),i(Ce,{modelValue:o.paciente.role,"onUpdate:modelValue":l[7]||(l[7]=a=>o.paciente.role=a),label:"Rol",dense:"",outlined:"",options:e.roles,rules:[a=>!!a||"Campo requerido"]},null,8,["modelValue","options","rules"]),C("div",_e,[i(S,{color:"negative",label:"Cancelar",onClick:l[8]||(l[8]=a=>o.pacienteDialog=!1),"no-caps":"",loading:o.loading},null,8,["loading"]),i(S,{color:"primary",label:"Guardar",type:"submit","no-caps":"",loading:o.loading,class:"q-ml-sm"},null,8,["loading"])])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}var je=ce(we,[["render",De]]);export{je as default};
