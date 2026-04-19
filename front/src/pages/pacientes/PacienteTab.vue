<template>
  <div class="row items-center">
    <div class="text-h6">Paciente</div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="refresh" @click="refresh" :loading="$store.loading" />
      <q-btn
        v-if="puedeDarAlta"
        icon="assignment_turned_in"
        color="positive"
        @click="darAlta"
        :loading="$store.loading"
      />
      <q-btn icon="edit" @click="pacienteDialog = true" :loading="$store.loading" />
      <q-btn icon="delete" @click="deletePaciente" :loading="$store.loading" />
    </q-btn-group>
  </div>

  <div class="row">
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Nombre:</label>
      <div>{{ paciente.nombre }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Apellido:</label>
      <div>{{ paciente.apellido }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Identificación:</label>
      <div>{{ paciente.identificacion }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Sexo:</label>
      <div>{{ paciente.sexo }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Fecha de nacimiento:</label>
      <div v-if="paciente.fecha_nacimiento">
        {{ paciente.fecha_nacimiento.substring(0, 10) }}
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Edad:</label>
      <div>{{ paciente.edad }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Estado civil:</label>
      <div>{{ paciente.estado_civil }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Dirección:</label>
      <div>{{ paciente.direccion }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Teléfono:</label>
      <div>{{ paciente.telefono }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Tipo paciente:</label>
      <div>
        <q-chip :label="paciente.tipo_paciente" :color="paciente.tipo_paciente === 'Interno' ? 'indigo' : 'orange'" dense class="text-white" />
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Estado internación:</label>
      <div>
        <q-chip :label="paciente.estado_internacion || 'No internado'" :color="estadoColor" dense class="text-white" />
      </div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Registrado por:</label>
      <div>{{ paciente.registro_user?.name || '-' }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Fecha de alta:</label>
      <div>{{ formatDateTime(paciente.fecha_alta) }}</div>
    </div>
    <div class="col-12 col-md-6 q-pa-xs">
      <label class="text-bold">Dado de alta por:</label>
      <div>{{ paciente.alta_user?.name || '-' }}</div>
    </div>
  </div>

  <q-dialog v-model="pacienteDialog" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="row items-center">
          <div class="text-h6">Editar paciente</div>
          <q-space />
          <q-btn icon="close" flat @click="pacienteDialog = false" />
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitPaciente">
          <q-input v-model="paciente.nombre" label="Nombre" dense filled />
          <q-input v-model="paciente.apellido" label="Apellido" dense filled />
          <q-input v-model="paciente.identificacion" label="Identificación" dense filled />
          <q-input v-model="paciente.sexo" label="Sexo" dense filled />
          <q-input v-model="paciente.fecha_nacimiento" label="Fecha de nacimiento" type="date" dense filled @update:modelValue="calculateEdad" />
          <q-input v-model="paciente.edad" label="Edad" dense filled />
          <q-input v-model="paciente.estado_civil" label="Estado civil" dense filled />
          <q-input v-model="paciente.direccion" label="Dirección" dense filled />
          <q-input v-model="paciente.telefono" label="Teléfono" dense filled />
          <q-select v-model="paciente.tipo_paciente" label="Tipo paciente" dense filled :options="['Interno', 'Externo', 'Seguro', 'Recepción']" />
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="primary" flat @click="pacienteDialog = false" :loading="$store.loading" />
            <q-btn label="Guardar" color="primary" flat type="submit" :loading="$store.loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import moment from 'moment'

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
      pacienteDialog: false,
    }
  },
  computed: {
    puedeDarAlta() {
      return this.paciente.tipo_paciente === 'Interno' && this.paciente.estado_internacion !== 'Alta'
    },
    estadoColor() {
      if (this.paciente.estado_internacion === 'Internado') return 'indigo'
      if (this.paciente.estado_internacion === 'Alta') return 'positive'
      return 'grey-7'
    }
  },
  methods: {
    refresh() {
      this.$emit('pacienteGet')
    },
    calculateEdad() {
      const edad = moment().diff(this.paciente.fecha_nacimiento, 'years')
      this.paciente.edad = isNaN(edad) ? '' : edad
    },
    formatDateTime(value) {
      if (!value) return '-'
      return moment(value).format('YYYY-MM-DD HH:mm')
    },
    deletePaciente() {
      this.$alert.dialog('¿Está seguro de eliminar el paciente?').onOk(() => {
        this.$store.loading = true
        this.$axios.delete('pacientes/' + this.paciente.id).then(() => {
          this.$alert.success('Paciente eliminado')
          this.$router.push({ name: 'pacientes' })
        }).catch(error => {
          this.$alert.error(error.response?.data?.message || 'No se pudo eliminar el paciente')
        }).finally(() => {
          this.$store.loading = false
        })
      })
    },
    darAlta() {
      this.$alert.dialog('¿Desea dar de alta a este paciente?').onOk(() => {
        this.$store.loading = true
        this.$axios.put(`pacientes/${this.paciente.id}/alta`).then(() => {
          this.$alert.success('Paciente dado de alta')
          this.$emit('pacienteGet')
        }).catch(error => {
          this.$alert.error(error.response?.data?.message || 'No se pudo dar de alta al paciente')
        }).finally(() => {
          this.$store.loading = false
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
        this.$alert.error(error.response?.data?.message || 'No se pudo actualizar el paciente')
      }).finally(() => {
        this.$store.loading = false
      })
    }
  }
}
</script>
