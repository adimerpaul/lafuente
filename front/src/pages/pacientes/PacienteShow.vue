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
            <label class="text-bold">Edad:</label>
            <div>
              {{ calculateEdad(paciente.fecha_nacimiento) }}
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
            <q-card flat bordered>
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
                  <PacienteTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="historial_medicos">
                  <HistorialTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="signos vitales">
                  <SignosTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="antecedentes">
                  <AntecedentesTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="habitos">
                  <HabitosTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="diagnosticos">
                  <DiagnosticosTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="recetas">
                  <RecetasTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </q-card-section>
<!--      <pre>{{ paciente }}</pre>-->
    </q-card>
  </q-page>
</template>
<script>
import moment from 'moment'
import PacienteTab from "pages/pacientes/PacienteTab.vue";
import HistorialTab from "pages/pacientes/HistorialTab.vue";
import SignosTab from "pages/pacientes/SignosTab.vue";
import AntecedentesTab from "pages/pacientes/AntecedentesTab.vue";
import HabitosTab from "pages/pacientes/HabitosTab.vue";
import DiagnosticosTab from "pages/pacientes/DiagnosticosTab.vue";
import RecetasTab from "pages/pacientes/RecetasTab.vue";
export default {
  name: 'PacienteNewPage',
  components: {RecetasTab, DiagnosticosTab, HabitosTab, AntecedentesTab, SignosTab, HistorialTab, PacienteTab},
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
    calculateEdad(fecha) {
      if (!fecha) return this.paciente.edad + ' años'
      const anios= moment().diff(fecha, 'years')
      const meses = moment().diff(fecha, 'months') % 12
      const dias = moment().diff(fecha, 'days') % 30
      return `${anios} años ${meses} meses ${dias} días`
    },
    pacienteGet() {
      this.$store.loading = true
      this.$axios.get('pacientes/' + this.$route.params.id).then(res => {
        this.paciente = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.$store.loading = false
      })
    },
  },
  computed: {
  }
}
</script>
