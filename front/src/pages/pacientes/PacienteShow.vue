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
                class="text-grey"
                indicator-color="white"
                align="justify"
                narrow-indicator
              >
                <q-tab name="paciente" :class="{'bg-blue text-white': tab === 'paciente'}">
                  <q-btn flat dense icon="person" label="Paciente" no-caps />
                </q-tab>
                <q-tab name="recetas" :class="{'bg-teal text-white': tab === 'recetas'}">
                  <q-btn flat dense icon="receipt_long" label="Recetas" no-caps />
                </q-tab>
<!--                ventas-->
<!--                cuentas por cobrar-->
<!--                facturas-->
<!--                pagos-->
                <q-tab name="Ventas" :class="{'bg-green text-white': tab === 'Ventas'}">
                  <q-btn flat dense icon="shopping_cart" label="Ventas" no-caps />
                </q-tab>
                <q-tab name="cuentas por cobrar" :class="{'bg-red text-white': tab === 'cuentas por cobrar'}">
                  <q-btn flat dense icon="account_balance" label="Cobrar" no-caps />
                </q-tab>
                <q-tab name="facturas" :class="{'bg-purple text-white': tab === 'facturas'}">
                  <q-btn flat dense icon="receipt" label="Facturas" no-caps />
                </q-tab>
                <q-tab name="pagos" :class="{'bg-cyan text-white': tab === 'pagos'}">
                  <q-btn flat dense icon="payment" label="Pagos" no-caps />
                </q-tab>
                <q-tab name="historial_medicos" :class="{'bg-green text-white': tab === 'historial_medicos'}">
                  <q-btn flat dense icon="history_edu" label="Historial " no-caps />
                </q-tab>
                <q-tab name="signos vitales" :class="{'bg-red text-white': tab === 'signos vitales'}">
                  <q-btn flat dense icon="monitor_heart" label="Signos" no-caps />
                </q-tab>
                <q-tab name="antecedentes" :class="{'bg-purple text-white': tab === 'antecedentes'}">
                  <q-btn flat dense icon="medical_services" label="Antecedentes" no-caps />
                </q-tab>
                <q-tab name="habitos" :class="{'bg-cyan text-white': tab === 'habitos'}">
                  <q-btn flat dense icon="self_improvement" label="Hábitos" no-caps />
                </q-tab>
                <q-tab name="diagnosticos" :class="{'bg-orange text-white': tab === 'diagnosticos'}">
                  <q-btn flat dense icon="assignment" label="Diagnósticos" no-caps />
                </q-tab>
              </q-tabs>


              <q-separator />
              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="paciente">
                  <PacienteTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="recetas">
                  <RecetasTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="Ventas">
                  <VentasTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="cuentas por cobrar">
                  <CobrosTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="facturas">
                  <FacturasTab :paciente="paciente" @pacienteGet="pacienteGet" />
                </q-tab-panel>
                <q-tab-panel name="pagos">
                  <PagosTab :paciente="paciente" @pacienteGet="pacienteGet" />
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
import VentasTab from "pages/pacientes/VentasTab.vue";
import CobrosTab from "pages/pacientes/CobrosTab.vue";
import FacturasTab from "pages/pacientes/FacturaTab.vue";
import PagosTab from "pages/pacientes/PagoTab.vue";
export default {
  name: 'PacienteNewPage',
  components: {
    PagosTab,
    FacturasTab,
    CobrosTab,
    VentasTab, RecetasTab, DiagnosticosTab, HabitosTab, AntecedentesTab, SignosTab, HistorialTab, PacienteTab},
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
