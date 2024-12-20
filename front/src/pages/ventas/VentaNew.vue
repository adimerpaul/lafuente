<template>
  <q-page class="q-pa-md">
    sdsd
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
        estado_civil: '',
        direccion: '',
        telefono: ''
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
