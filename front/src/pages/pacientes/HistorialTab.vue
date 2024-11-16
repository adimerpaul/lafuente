<template>

</template>
<script>
export default {
  name: 'HistorialTab',
  props: {
    paciente: {
      type: Object,
      required: true
    }
  },
  emits: ['pacienteGet'],
  data() {
    return {
      historial: [],
      historialDialog: false,
      historialForm: {
        fecha: '',
        motivo: '',
        diagnostico: '',
        tratamiento: '',
        observaciones: ''
      }
    }
  },
  methods: {
    getHistorial() {
      this.$store.loading = true
      this.$axios.get('pacientes/' + this.paciente.id + '/historial').then(response => {
        this.historial = response.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.$store.loading = false
      })
    },
    addHistorial() {
      this.historialForm.fecha = new Date().toISOString().substr(0, 10)
      this.historialDialog = true
    },
    submitHistorial() {
      this.$store.loading = true
      this.$axios.post('pacientes/' + this.paciente.id + '/historial', this.historialForm).then(() => {
        this.$alert.success('Historial agregado')
        this.historialDialog = false
        this.getHistorial()
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.$store.loading = false
      })
    },
    deleteHistorial(historial) {
      this.$alert.dialog('¿Está seguro de eliminar el historial?').onOk(() => {
        this.$store.loading = true
        this.$axios.delete('pacientes/' + this.paciente.id + '/historial/' + historial.id).then(() => {
          this.$alert.success('Historial eliminado')
          this.getHistorial()
        }).catch(error => {
          this.$alert.error(error.response.data.message)
        }).finally(() => {
          this.$store.loading = false
        })
      })
    }
  },
}
</script>
