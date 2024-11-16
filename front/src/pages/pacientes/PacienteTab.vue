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
  </div>
  <q-dialog v-model="pacienteDialog" persistent>
    <q-card style="min-width: 300px">
      <q-card-section>
            <q-input
              v-model="paciente.nombre"
              label="Nombre"
              dense
              filled
              hint=""
            />
            <q-input
              v-model="paciente.apellido"
              label="Apellido"
              dense
              filled
              hint=""
            />
            <q-input
              v-model="paciente.identificacion"
              label="Identificación"
              dense
              filled
              hint=""
            />
            <q-input
              v-model="paciente.sexo"
              label="Sexo"
              dense
              filled
              hint=""
            />
            <q-input
              v-model="paciente.estado_civil"
              label="Estado civil"
              dense
              filled
              hint=""
            />
            <q-input
              v-model="paciente.direccion"
              label="Dirección"
              dense
              filled
              hint=""
            />
            <q-input
              v-model="paciente.telefono"
              label="Teléfono"
              dense
              filled
              hint=""
            />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancelar" color="primary" flat @click="pacienteDialog = false" />
        <q-btn label="Guardar" color="primary" flat @click="pacienteDialog = false" />
      </q-card-actions>
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
    }
  }
}
</script>
