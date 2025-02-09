<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <q-form @submit="pacienteSave">
          <div class="row">
            <div class="col-12">
              <div class="text-h6 text-center">Nuevo paciente</div>
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Nombre:</label>
              <q-input v-model="paciente.nombre" dense outlined placeholder="Nombre" :rules="[val => !!val || 'Campo requerido']" />
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Apellido:</label>
              <q-input v-model="paciente.apellido" dense outlined placeholder="Apellido" :rules="[val => !!val || 'Campo requerido']" />
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Fecha de nacimiento:</label>
              <q-input v-model="paciente.fecha_nacimiento" dense outlined placeholder="Fecha de nacimiento"  type="date"
                       @update:modelValue="calculateEdad"
              />
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Identificación:</label>
              <q-input v-model="paciente.identificacion" dense outlined placeholder="Identificación" />
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Edad:</label>
              <q-input v-model="paciente.edad" dense outlined placeholder="Edad" />
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Sexo:</label>
              <div>
                <q-radio v-model="paciente.sexo" val="M" label="Masculino" :rules="[val => !!val || 'Campo requerido']" name="sexo" />
                <q-radio v-model="paciente.sexo" val="F" label="Femenino" :rules="[val => !!val || 'Campo requerido']" name="sexo" />
              </div>
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Estado civil:</label>
              <q-select v-model="paciente.estado_civil" dense outlined :options="estados_civiles" placeholder="Estado civil"/>
            </div>
            <div class="col-12 col-md-3 q-pa-xs">
              <label class="text-bold">Teléfono:</label>
              <q-input v-model="paciente.telefono" dense outlined placeholder="Teléfono" />
            </div>
            <div class="col-12 col-md-6 q-pa-xs">
              <label class="text-bold">Dirección:</label>
              <q-input v-model="paciente.direccion" dense outlined placeholder="Dirección" />
            </div>
            <div class="col-12 col-md-6 q-pa-xs">
              <label class="text-bold">Dirección:</label>
<!--              <q-input v-model="paciente.direccion" dense outlined placeholder="Dirección" />-->
              <q-radio v-model="paciente.tipo_paciente" val="Interno" label="Interno" :rules="[val => !!val || 'Campo requerido']" name="tipo_paciente" />
              <q-radio v-model="paciente.tipo_paciente" val="Externo" label="Externo" :rules="[val => !!val || 'Campo requerido']" name="tipo_paciente" />
            </div>
            <div class="col-12 q-pa-xs">
              <div class="text-center">
                <q-btn color="negative" label="Cancelar" @click="$router.push({ name: 'pacientes' })" no-caps :loading="loading" />
                <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />
              </div>
            </div>
          </div>
<!--          <q-input v-model="paciente.nombre" label="Nombre" dense outlined />-->
<!--          <q-input v-model="paciente.apellido" label="Apellido" dense outlined />-->
<!--          <q-input v-model="paciente.fecha_nacimiento" label="Fecha de nacimiento" dense outlined />-->
<!--          <q-input v-model="paciente.identificacion" label="Identificación" dense outlined />-->
<!--          <q-input v-model="paciente.edad" label="Edad" dense outlined />-->
<!--          <q-input v-model="paciente.sexo" label="Sexo" dense outlined />-->
<!--          <q-input v-model="paciente.estado_civil" label="Estado civil" dense outlined />-->
<!--          <q-input v-model="paciente.direccion" label="Dirección" dense outlined />-->
<!--          <q-input v-model="paciente.telefono" label="Teléfono" dense outlined />-->
<!--          <div class="text-right">-->
<!--            <q-btn color="negative" label="Cancelar" @click="$router.push({ name: 'pacientes' })" no-caps :loading="loading" />-->
<!--            <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />-->
<!--          </div>-->
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import moment from 'moment'
export default {
  name: 'PacienteNewPage',
  data() {
    return {
      paciente: {
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        identificacion: '',
        edad: '',
        sexo: '',
        estado_civil: 'Soltero',
        direccion: '',
        telefono: '',
        tipo_paciente: 'Externo'
      },
      estados_civiles: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Otro'],
      loading: false
    }
  },
  methods: {
    calculateEdad() {
      let edad = moment().diff(this.paciente.fecha_nacimiento, 'years')
      if (isNaN(edad)) {
        this.paciente.edad = ''
        return
      }
      this.paciente.edad = edad
    },
    pacienteSave() {
      this.loading = true
      this.$axios.post('pacientes', this.paciente).then(res => {
        this.$alert.success(res.data.message)
        this.$router.push({ name: 'paciente', params: { id: res.data.id } })
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    }
  },
  computed: {
    edad() {
      let edad = moment().diff(this.paciente.fecha_nacimiento, 'years')
      if (isNaN(edad)) {
        return ''
      }
      return edad
    }
  }
}
</script>
