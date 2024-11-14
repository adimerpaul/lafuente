<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row">
          <div class="col-10 col-md-3 q-pa-xs">
            <label class="text-bold">Nombre completo:</label>
            <div>
              {{ paciente.nombre_completo }}
            </div>
          </div>
          <div class="col-2 col-md-3 q-pa-xs">
            <label class="text-bold">Edad:</label>
            <div>
              {{ paciente.edad }}
            </div>
          </div>
          <div class="col-6 col-md-3 q-pa-xs">
            <label class="text-bold">Fecha de nacimiento:</label>
            <div>
              {{ paciente.fecha_nacimiento? paciente.fecha_nacimiento.substring(0, 10) : '' }}
            </div>
          </div>
          <div class="col-6 col-md-3 q-pa-xs">
            <label class="text-bold">Fecha de creación:</label>
            <div>
              {{ paciente.fecha_creacion }}
            </div>
          </div>
          <div class="col-12">
            <q-card>
              <q-tabs
                v-model="tab"
                dense
                active-bg-color="primary"
                class="text-grey"
                active-color="white"
                indicator-color="white"
                align="justify"
                narrow-indicator
              >
<!--                paciente-->
<!--                historial_medicos-->
<!--                signos vitales-->
<!--                antecedentes-->
<!--                habitos-->
<!--                diagnosticos-->
<!--                recetas-->
                <q-tab name="paciente" >
                  <q-btn flat dense icon="person" label="Paciente" no-caps/>
                </q-tab>
                <q-tab name="historial_medicos">
                  <q-btn flat dense icon="history" label="Historial médico" no-caps/>
                </q-tab>
                <q-tab name="signos vitales">
                  <q-btn flat dense icon="favorite" label="Signos vitales" no-caps/>
                </q-tab>
                <q-tab name="antecedentes">
                  <q-btn flat dense icon="history" label="Antecedentes" no-caps/>
                </q-tab>
                <q-tab name="habitos">
                  <q-btn flat dense icon="article" label="Hábitos" no-caps/>
                </q-tab>
                <q-tab name="diagnosticos">
                  <q-btn flat dense icon="history" label="Diagnósticos" no-caps/>
                </q-tab>
                <q-tab name="recetas">
                  <q-btn flat dense icon="description" label="Recetas" no-caps/>
                </q-tab>
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="paciente">
                  <div class="text-h6">Paciente</div>
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
                </q-tab-panel>

                <q-tab-panel name="alarms">
                  <div class="text-h6">Alarms</div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </q-tab-panel>

                <q-tab-panel name="movies">
                  <div class="text-h6">Movies</div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
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
      tab: 'paciente',
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
