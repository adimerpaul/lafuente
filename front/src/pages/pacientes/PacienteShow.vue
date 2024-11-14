<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-3 q-pa-xs">
            <label class="text-bold">Nombre completo:</label>
            <div>
              {{ paciente.nombre_completo }}
            </div>
          </div>
          <div class="col-12 col-md-3 q-pa-xs">
            <label class="text-bold">Fecha de nacimiento:</label>
            <div>
              {{ paciente.fecha_nacimiento? paciente.fecha_nacimiento.substring(0, 10) : '' }}
            </div>
          </div>
          <div class="col-12 col-md-3 q-pa-xs">
            <label class="text-bold">Edad:</label>
            <div>
              {{ paciente.edad }}
            </div>
          </div>
          <div class="col-12 col-md-3 q-pa-xs">
            <label class="text-bold">Fecha de creación:</label>
            <div>
              {{ paciente.fecha_creacion }}
            </div>
          </div>
        </div>
      </q-card-section>
      <pre>{{ paciente }}</pre>
<!--      {-->
<!--      "id": 1005,-->
<!--      "nombre": "aaa",-->
<!--      "apellido": "bbbb",-->
<!--      "fecha_nacimiento": null,-->
<!--      "identificacion": null,-->
<!--      "edad": null,-->
<!--      "sexo": null,-->
<!--      "estado_civil": null,-->
<!--      "direccion": null,-->
<!--      "telefono": null,-->
<!--      "nombre_completo": "aaa bbbb"-->
<!--      }-->
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
        estado_civil: '',
        direccion: '',
        telefono: ''
      },
      estados_civiles: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Otro'],
      loading: false
    }
  },
  mounted() {
    this.pacienteGet();
  },
  methods: {
    pacienteGet() {
      this.$axios.get('pacientes/' + this.$route.params.id).then(res => {
        this.paciente = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
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
