<template>
  <div class="row items-center" >
    <div class="text-h6 ">Paciente</div>
    <q-space />
    <q-btn-group flat>
<!--      btn refresh-->
      <q-btn icon="refresh" @click="refresh" :loading="$store.loading"/>
      <q-btn icon="edit" @click="pacienteDialog = true" :loading="$store.loading"/>
      <q-btn icon="delete" @click="deletePaciente" :loading="$store.loading"/>
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Nombre:</label>
      <div>
        {{ paciente.nombre }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Apellido:</label>
      <div>
        {{ paciente.apellido }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Identificación:</label>
      <div>
        {{ paciente.identificacion }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Sexo:</label>
      <div>
        {{ paciente.sexo }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Fecha de nacimiento:</label>
      <div>
        {{ paciente.fecha_nacimiento.substring(0, 10) }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Edad:</label>
      <div>
        {{ paciente.edad }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Estado civil:</label>
      <div>
        {{ paciente.estado_civil }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Dirección:</label>
      <div>
        {{ paciente.direccion }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Teléfono:</label>
      <div>
        {{ paciente.telefono }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Tipo paciente:</label>
      <div>
        <q-chip :label="paciente.tipo_paciente" :color="paciente.tipo_paciente === 'Interno' ? 'indigo' : 'orange'" dense class="text-white"/>
      </div>
    </div>
<!--    <div>-->
<!--      <pre>{{paciente}}</pre>-->
<!--    </div>-->
  </div>
  <q-dialog v-model="pacienteDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div  class="row items-center">
          <div class="text-h6">Editar paciente</div>
          <q-space />
          <q-btn icon="close" flat @click="pacienteDialog = false"/>
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitPaciente">
<!--          "nombre": "Ona",-->
<!--          "apellido": "Riojas",-->
<!--          "fecha_nacimiento": "1993-03-23T04:00:00.000000Z",-->
<!--          "identificacion": "723137902",-->
<!--          "edad": 77,-->
<!--          "sexo": "M",-->
<!--          "estado_civil": "Casado",-->
<!--          "direccion": "asdsdsadas",-->
<!--          "telefono": "+34 987 14 7740",-->
            <q-input v-model="paciente.nombre" label="Nombre" dense filled hint=""/>
            <q-input v-model="paciente.apellido" label="Apellido" dense filled hint=""/>
            <q-input v-model="paciente.identificacion" label="Identificación" dense filled hint=""/>
            <q-input v-model="paciente.sexo" label="Sexo" dense filled hint=""/>
            <q-input v-model="paciente.fecha_nacimiento" label="Fecha de nacimiento" type="date" dense filled hint="" @update:modelValue="calculateEdad"/>
            <q-input v-model="paciente.edad" label="Edad" dense filled hint=""/>
            <q-input v-model="paciente.estado_civil" label="Estado civil" dense filled hint=""/>
            <q-input v-model="paciente.direccion" label="Dirección" dense filled hint=""/>
            <q-input v-model="paciente.telefono" label="Teléfono" dense filled hint=""/>
<!--          select Interno Externo-->
          <q-select v-model="paciente.tipo_paciente" label="Tipo paciente" dense filled hint="" :options="[ 'Interno','Externo'] "/>
            <q-card-actions align="right">
              <q-btn label="Cancelar" color="primary" flat @click="pacienteDialog = false" :loading="$store.loading"/>
              <q-btn label="Guardar" color="primary" flat type="submit" :loading="$store.loading"/>
            </q-card-actions>
          </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import moment from "moment/moment";

export default {
  name: 'PacienteTab',
  props: {
    paciente: {
      type: Object,
      required: true
    }
  },
  emits: ['pacienteGet'],
  data () {
    return {
      edit: false,
      pacienteDialog: false,
    }
  },
  methods: {
    refresh() {
      this.$emit('pacienteGet')
    },
    calculateEdad() {
      let edad = moment().diff(this.paciente.fecha_nacimiento, 'years')
      if (isNaN(edad)) {
        this.paciente.edad = ''
        return
      }
      this.paciente.edad = edad
    },
    deletePaciente() {
      this.$alert.dialog('¿Está seguro de eliminar el paciente?').onOk(() => {
        this.$store.loading = true
        this.$axios.delete('pacientes/' + this.paciente.id).then(() => {
          this.$alert.success('Paciente eliminado')
          this.$router.push({name: 'pacientes'})
        }).catch(error => {
          this.$alert.error(error.response.data.message)
        })
      })
    },
    submitPaciente() {
      this.$store.loading = true
      this.$axios.put('pacientes/' + this.paciente.id, this.paciente).then(() => {
        this.$alert.success('Paciente actualizado')
        this.pacienteDialog = false
        this.$emit('pacienteGet')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.$store.loading = false
      })
    }
  }
}
</script>
