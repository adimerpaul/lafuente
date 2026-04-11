<template>
  <q-page class="q-pa-sm">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-primary text-white">
        <div>
          <div class="text-h6">{{ isEdit ? 'Editar caja de recepcion' : 'Nueva caja de recepcion' }}</div>
          <div class="text-caption">Registro rapido y ordenado para atencion de recepcion</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="arrow_back" color="white" @click="$router.push({ name: 'caja-recepciones' })" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-form @submit="save">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Recaudado total</div>
                  <div class="text-h6 text-primary">{{ money(recaudadoTotal) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">QR</div>
                  <div class="text-h6 text-cyan">{{ money(form.qr) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Farmacia</div>
                  <div class="text-h6 text-orange">{{ money(form.costo_farmacia) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Egreso doctor</div>
                  <div class="text-h6 text-negative">{{ money(form.egreso) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Efectivo</div>
                  <div class="text-h6 text-positive">{{ money(form.efectivo) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Saldo final caja</div>
                  <div class="text-h6 text-indigo">{{ money(saldoFinal) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12">
              <q-select
                v-model="form.paciente_id"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                emit-value
                map-options
                clearable
                input-debounce="300"
                :options="pacienteOptions"
                label="Paciente"
                :rules="[required]"
                @filter="filterPacientes"
              >
                <template #append>
                  <q-btn flat round dense icon="person_add" @click.stop="patientDialog = true" />
                </template>
              </q-select>
            </div>
          </div>

          <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary" class="text-grey-8">
            <q-tab name="datos" icon="assignment" label="Datos" no-caps />
            <q-tab name="formulario" icon="assignment_turned_in" label="Formulario" no-caps />
            <q-tab name="costos" icon="payments" label="Costos" no-caps />
            <q-tab name="pagos" icon="point_of_sale" label="Pago y cierre" no-caps />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="datos" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-3">
                  <q-input v-model="form.fecha" dense outlined type="date" label="Fecha" :rules="[required]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="form.tipo_atencion"
                    :options="['Externo', 'Especialidad']"
                    dense
                    outlined
                    clearable
                    label="Tipo de atencion"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="form.punto"
                    :options="puntoOptions"
                    dense
                    outlined
                    emit-value
                    map-options
                    label="Punto"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="form.nombre_factura"
                    dense
                    outlined
                    :disable="Number(form.punto) !== 1"
                    :label="Number(form.punto) === 1 ? 'Numero de factura' : 'Recibo automatico'"
                    :hint="Number(form.punto) === 1 ? '' : 'El backend lo registrara como recibo'"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <q-input v-model="form.numero_ficha" dense outlined label="Numero de ficha" />
                </div>
                <div class="col-12 col-md-3">
                  <q-toggle
                    v-model="pagoAhoraToggle"
                    checked-icon="payments"
                    unchecked-icon="schedule"
                    color="positive"
                    keep-color
                    :label="pagoAhoraToggle ? 'Paga ahora' : 'Paga luego'"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.doctor_id"
                    use-input
                    fill-input
                    hide-selected
                    dense
                    outlined
                    emit-value
                    map-options
                    clearable
                    input-debounce="300"
                    :options="doctorOptions"
                    label="Medico"
                    @filter="filterDoctores"
                  >
                    <template #append>
                      <q-btn flat round dense icon="person_add" @click.stop="doctorDialog = true" />
                    </template>
                  </q-select>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="formulario" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-3">
                  <q-card flat bordered class="bg-blue-1">
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption">Total referencial</div>
                      <div class="text-h6 text-primary">{{ money(formularioTotalReferencial) }}</div>
                      <div class="text-caption">Seleccionados: {{ formularioSelectedItems.length }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-9">
                  <q-input
                    v-model="form.formulario_diagnostico"
                    dense
                    outlined
                    clearable
                    type="textarea"
                    autogrow
                    label="Diagnostico"
                  >
                    <template #append>
                      <q-btn flat round dense icon="mic" @click="startFormRecognition('formulario_diagnostico')" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section class="bg-grey-2 text-weight-bold q-py-sm">
                      Registro compacto y rapido
                    </q-card-section>
                    <q-card-section class="q-pa-xs">
                      <div class="row q-col-gutter-sm">
                        <div v-for="item in controlItems" :key="item.key" class="col-12 col-sm-6 col-lg-4">
                          <div class="control-row">
                            <div class="control-label">
                              <div class="text-caption text-weight-medium">{{ item.label }}</div>
                              <div class="text-grey-7 control-price">
                                {{ money(getFormularioAmount(item.key, form.formulario_detalle[item.key])) }}
                              </div>
                            </div>
                            <div class="control-actions">
                              <q-option-group
                                :model-value="getFormularioSelection(item.key)"
                                :options="item.options"
                                type="checkbox"
                                inline
                                dense
                                color="primary"
                                @update:model-value="setFormularioSelection(item.key, $event)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.formulario_observaciones"
                    dense
                    outlined
                    clearable
                    type="textarea"
                    autogrow
                    label="Observaciones del formulario"
                  >
                    <template #append>
                      <q-btn flat round dense icon="mic" @click="startFormRecognition('formulario_observaciones')" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="costos" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div v-for="field in costFields" :key="field.key" class="col-12 col-sm-6 col-md-3">
                  <q-input
                    v-model.number="form[field.key]"
                    dense
                    outlined
                    type="number"
                    min="0"
                    step="0.01"
                    :label="field.label"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.laboratorio_nombre" dense outlined label="A que laboratorio se lo llevo" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.medico_ecografia" dense outlined label="Quien hizo la ecografia" />
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="pagos" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="metodoPago"
                    :options="metodoPagoOptions"
                    dense
                    outlined
                    emit-value
                    map-options
                    label="Metodo de pago"
                  />
                </div>
                <div v-if="showQr" class="col-12 col-md-4">
                  <q-input v-model.number="form.qr" dense outlined type="number" min="0" step="0.01" label="Monto QR" />
                </div>
                <div v-if="showEfectivo" class="col-12 col-md-4">
                  <q-input v-model.number="form.efectivo" dense outlined type="number" min="0" step="0.01" label="Monto efectivo" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.egreso"
                    dense
                    outlined
                    type="number"
                    min="0"
                    step="0.01"
                    label="Egreso doctor"
                    hint="Monto descontado o pagado al doctor"
                  />
                </div>
                <div class="col-12">
                  <q-input v-model="form.observaciones" dense outlined type="textarea" autogrow label="Observaciones" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator class="q-my-sm" />

          <div class="text-right">
            <q-btn color="negative" label="Cancelar" no-caps @click="$router.push({ name: 'caja-recepciones' })" :loading="saving" />
            <q-btn color="primary" label="Guardar" type="submit" no-caps class="q-ml-sm" :loading="saving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="patientDialog" persistent>
      <q-card style="min-width: 420px; max-width: 95vw;">
        <q-card-section class="q-pb-none row items-center">
          <div>Nuevo paciente rapido</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="patientDialog = false" />
        </q-card-section>
        <q-card-section>
          <q-form @submit="saveQuickPatient">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.nombre" clearable dense outlined label="Nombre" :rules="[required]">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('nombre')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.apellido" clearable dense outlined label="Apellido" :rules="[required]">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('apellido')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="quickPatient.identificacion" clearable dense outlined label="Identificacion">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('identificacion')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="quickPatient.edad" clearable dense outlined label="Edad" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="quickPatient.sexo" :options="['M', 'F']" dense outlined label="Sexo" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="quickPatient.fecha_nacimiento"
                  clearable
                  dense
                  outlined
                  type="date"
                  label="Fecha de nacimiento"
                  @update:model-value="updateQuickPatientAge"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.telefono" clearable dense outlined label="Telefono">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('telefono')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="quickPatient.tipo_paciente" :options="['Externo', 'Interno']" dense outlined label="Tipo paciente" />
              </div>
              <div class="col-12">
                <q-input v-model="quickPatient.direccion" clearable dense outlined label="Direccion">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('direccion')" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="text-right q-mt-md">
              <q-btn color="negative" label="Cancelar" no-caps @click="patientDialog = false" :loading="savingPatient" />
              <q-btn color="primary" label="Crear paciente" type="submit" no-caps class="q-ml-sm" :loading="savingPatient" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="doctorDialog" persistent>
      <q-card style="min-width: 420px; max-width: 95vw;">
        <q-card-section class="q-pb-none row items-center">
          <div>Nuevo medico rapido</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="doctorDialog = false" />
        </q-card-section>
        <q-card-section>
          <q-form @submit="saveQuickDoctor">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.nombre" clearable dense outlined label="Nombre" :rules="[required]" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.especialidad" clearable dense outlined label="Especialidad" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.telefono" clearable dense outlined label="Telefono" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.email" clearable dense outlined type="email" label="Email" />
              </div>
            </div>
            <div class="text-right q-mt-md">
              <q-btn color="negative" label="Cancelar" no-caps @click="doctorDialog = false" :loading="savingDoctor" />
              <q-btn color="primary" label="Crear medico" type="submit" no-caps class="q-ml-sm" :loading="savingDoctor" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment'
import {
  controlCatalog,
  controlOptions,
  createEmptyDetail,
  getControlAmount,
  getControlTotal,
  getSelectedControlItems
} from '../formularios-control/controlCatalog'

const emptyForm = () => ({
  fecha: moment().format('YYYY-MM-DD'),
  paciente_id: null,
  doctor_id: null,
  tipo_atencion: 'Externo',
  punto: 0,
  nombre_factura: '',
  numero_ficha: '',
  formulario_diagnostico: '',
  formulario_detalle: createEmptyDetail(),
  formulario_observaciones: '',
  estado_pago: 'Ahora',
  laboratorio_nombre: '',
  medico_ecografia: '',
  observaciones: '',
  qr: 0,
  efectivo: 0,
  egreso: 0,
  costo_atencion_medica: 0,
  costo_curacion: 0,
  costo_inyectable: 0,
  costo_toma_presion: 0,
  costo_ambulancia: 0,
  costo_laboratorio: 0,
  costo_ecografia: 0,
  costo_uso_consultorio: 0,
  costo_glicemia: 0,
  costo_certificado_medico: 0,
  costo_sutura: 0,
  costo_antisepticos: 0,
  costo_cama: 0,
  costo_compania_noche: 0,
  costo_uso_ecografia: 0,
  costo_flebotomia: 0,
  costo_sonda: 0,
  costo_farmacia: 0,
  otros_costos: 0
})

export default {
  name: 'CajaRecepcionFormPage',
  data () {
    return {
      tab: 'datos',
      loading: false,
      saving: false,
      savingPatient: false,
      savingDoctor: false,
      patientSearchTimer: null,
      patientSearchSeq: 0,
      atencionMedicaAdjustment: 0,
      syncingAtencionMedica: false,
      recognition: null,
      activeRecognitionTarget: null,
      activeQuickPatientField: null,
      form: emptyForm(),
      doctores: [],
      pacienteOptions: [],
      doctorOptions: [],
      metodoPago: 'efectivo',
      patientDialog: false,
      doctorDialog: false,
      quickPatient: {
        nombre: '',
        apellido: '',
        identificacion: '',
        edad: '',
        sexo: 'M',
        fecha_nacimiento: '',
        telefono: '',
        direccion: '',
        tipo_paciente: 'Externo'
      },
      quickDoctor: {
        nombre: '',
        especialidad: '',
        telefono: '',
        email: ''
      },
      puntoOptions: [
        { label: '0', value: 0 },
        { label: '1', value: 1 }
      ],
      metodoPagoOptions: [
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'QR', value: 'qr' },
        { label: 'Mixto', value: 'mixto' },
        { label: 'Pendiente', value: 'pendiente' }
      ],
      costFields: [
        { key: 'costo_atencion_medica', label: 'Atencion medica' },
        { key: 'costo_curacion', label: 'Curacion' },
        { key: 'costo_inyectable', label: 'Inyectables' },
        { key: 'costo_toma_presion', label: 'Toma de presion' },
        { key: 'costo_ambulancia', label: 'Ambulancia' },
        { key: 'costo_laboratorio', label: 'Laboratorio' },
        { key: 'costo_ecografia', label: 'Ecografia' },
        { key: 'costo_uso_consultorio', label: 'Uso consultorio' },
        { key: 'costo_glicemia', label: 'Glicemia' },
        { key: 'costo_certificado_medico', label: 'Certificado medico' },
        { key: 'costo_sutura', label: 'Sutura' },
        { key: 'costo_antisepticos', label: 'Antisepticos' },
        { key: 'costo_cama', label: 'Cama' },
        { key: 'costo_compania_noche', label: 'Compania noche' },
        { key: 'costo_uso_ecografia', label: 'Uso ecografia' },
        { key: 'costo_flebotomia', label: 'Flebotomia' },
        { key: 'costo_sonda', label: 'Sonda' },
        { key: 'costo_farmacia', label: 'Farmacia' },
        { key: 'otros_costos', label: 'Otros costos' }
      ]
    }
  },
  computed: {
    isEdit () {
      return !!this.$route.params.id
    },
    recaudadoTotal () {
      return this.costFields.reduce((sum, field) => sum + Number(this.form[field.key] || 0), 0)
    },
    pagadoAhora () {
      return Number(this.form.qr || 0) + Number(this.form.efectivo || 0)
    },
    saldoFinal () {
      return this.recaudadoTotal - Number(this.form.egreso || 0)
    },
    pagoAhoraToggle: {
      get () {
        return this.form.estado_pago === 'Ahora'
      },
      set (value) {
        this.form.estado_pago = value ? 'Ahora' : 'Luego'
      }
    },
    showQr () {
      return this.metodoPago === 'qr' || this.metodoPago === 'mixto'
    },
    showEfectivo () {
      return this.metodoPago === 'efectivo' || this.metodoPago === 'mixto'
    },
    controlItems () {
      return controlCatalog.map(item => ({
        ...item,
        options: controlOptions[item.type] || []
      }))
    },
    formularioSelectedItems () {
      return getSelectedControlItems(this.form.formulario_detalle)
    },
    formularioTotalReferencial () {
      return getControlTotal(this.form.formulario_detalle)
    }
  },
  watch: {
    recaudadoTotal () {
      this.syncPaymentAmounts()
    },
    formularioTotalReferencial () {
      this.syncAtencionMedicaCost()
    },
    metodoPago () {
      this.syncPaymentAmounts()
    },
    'form.costo_atencion_medica' (value) {
      if (this.syncingAtencionMedica) return
      this.atencionMedicaAdjustment = Number(value || 0) - Number(this.formularioTotalReferencial || 0)
    },
    'form.qr' () {
      if (this.metodoPago === 'mixto' || this.metodoPago === 'qr') {
        this.syncPaymentAmounts()
      }
    }
  },
  mounted () {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'es-ES'
      this.recognition.interimResults = false
      this.recognition.continuous = false
      this.recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim()
        if (!transcript) return

        if (this.activeRecognitionTarget === 'quickPatient' && this.activeQuickPatientField) {
          const currentValue = this.quickPatient[this.activeQuickPatientField] || ''
          this.quickPatient[this.activeQuickPatientField] = `${currentValue}${currentValue ? ' ' : ''}${transcript}`.trim()
        }

        if (this.activeRecognitionTarget === 'form' && this.activeQuickPatientField) {
          const currentValue = this.form[this.activeQuickPatientField] || ''
          this.form[this.activeQuickPatientField] = `${currentValue}${currentValue ? ' ' : ''}${transcript}`.trim()
        }
      }
      this.recognition.onerror = () => {
        this.$q.notify({
          color: 'negative',
          message: 'No se pudo reconocer la voz'
        })
      }
      this.recognition.onend = () => {
        this.activeRecognitionTarget = null
        this.activeQuickPatientField = null
      }
    }

    this.loadFormData()
  },
  methods: {
    required (value) {
      return !!value || 'Campo requerido'
    },
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    syncAtencionMedicaCost () {
      this.syncingAtencionMedica = true
      const nextValue = Number(this.formularioTotalReferencial || 0) + Number(this.atencionMedicaAdjustment || 0)
      this.form.costo_atencion_medica = Math.max(nextValue, 0)
      this.$nextTick(() => {
        this.syncingAtencionMedica = false
      })
    },
    syncPaymentAmounts () {
      const total = Number(this.recaudadoTotal || 0)
      const qr = Number(this.form.qr || 0)

      if (this.metodoPago === 'pendiente') {
        this.form.qr = 0
        this.form.efectivo = 0
        return
      }

      if (this.metodoPago === 'qr') {
        this.form.qr = total
        this.form.efectivo = 0
        return
      }

      if (this.metodoPago === 'mixto') {
        const safeQr = Math.min(Math.max(qr, 0), total)
        if (safeQr !== qr) {
          this.form.qr = safeQr
        }
        this.form.efectivo = Math.max(total - safeQr, 0)
        return
      }

      this.form.qr = 0
      this.form.efectivo = total
    },
    normalizeFormularioValue (value) {
      if (Array.isArray(value)) return value
      if (!value || value === 'NO') return []
      return [value]
    },
    getFormularioSelection (key) {
      return this.normalizeFormularioValue(this.form.formulario_detalle[key])
    },
    setFormularioSelection (key, values) {
      const uniqueValues = [...new Set((values || []).filter(Boolean))]
      this.form.formulario_detalle = {
        ...this.form.formulario_detalle,
        [key]: uniqueValues.length ? uniqueValues : null
      }
    },
    updateQuickPatientAge (value) {
      if (!value) {
        this.quickPatient.edad = ''
        return
      }

      const birthDate = moment(value, 'YYYY-MM-DD', true)
      if (!birthDate.isValid()) return

      const age = moment().diff(birthDate, 'years')
      this.quickPatient.edad = age >= 0 ? String(age) : ''
    },
    getFormularioAmount (key, value) {
      return getControlAmount(key, this.normalizeFormularioValue(value))
    },
    loadFormData () {
      this.loading = true
      Promise.all([
        this.$axios.get('doctores'),
        this.$axios.get('pacientes', { params: { search: '', page: 1 } }),
        this.isEdit ? this.$axios.get(`caja-recepciones/${this.$route.params.id}`) : Promise.resolve(null)
      ]).then(([doctoresRes, pacientesRes, itemRes]) => {
        this.doctores = doctoresRes.data || []
        this.doctorOptions = this.doctores.map(this.mapDoctorOption)
        this.pacienteOptions = (pacientesRes.data.data || []).map(this.mapPacienteOption)
          if (itemRes && itemRes.data) {
          this.form = {
            ...emptyForm(),
            ...itemRes.data,
            fecha: itemRes.data.fecha ? itemRes.data.fecha.substring(0, 10) : moment().format('YYYY-MM-DD'),
            formulario_detalle: {
              ...createEmptyDetail(),
              ...(itemRes.data.formulario_detalle || {})
            }
          }
          this.atencionMedicaAdjustment = Number(this.form.costo_atencion_medica || 0) - Number(this.formularioTotalReferencial || 0)
          this.syncAtencionMedicaCost()
          this.metodoPago = this.detectMetodoPago()
          this.syncPaymentAmounts()
          const paciente = itemRes.data.paciente
          if (paciente) {
            const option = this.mapPacienteOption(paciente)
            if (!this.pacienteOptions.some(item => item.value === option.value)) {
              this.pacienteOptions.unshift(option)
            }
          }
        } else {
          this.atencionMedicaAdjustment = 0
          this.syncAtencionMedicaCost()
          this.syncPaymentAmounts()
        }
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo cargar la pantalla de caja')
      }).finally(() => {
        this.loading = false
      })
    },
    detectMetodoPago () {
      if (Number(this.form.qr || 0) > 0 && Number(this.form.efectivo || 0) > 0) return 'mixto'
      if (Number(this.form.qr || 0) > 0) return 'qr'
      if (Number(this.form.efectivo || 0) > 0) return 'efectivo'
      return 'pendiente'
    },
    mapPacienteOption (paciente) {
      const nombre = paciente.nombre_completo || `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim()
      const doc = paciente.identificacion ? ` - ${paciente.identificacion}` : ''
      return {
        label: `${nombre}${doc}`,
        value: paciente.id
      }
    },
    mapDoctorOption (doctor) {
      return {
        label: `${doctor.nombre}${doctor.especialidad ? ' - ' + doctor.especialidad : ''}`,
        value: doctor.id
      }
    },
    filterPacientes (val, update, abort) {
      const search = (val || '').trim()

      clearTimeout(this.patientSearchTimer)

      if (search === '') {
        update(() => {
          this.pacienteOptions = [...this.pacienteOptions]
        })
        return
      }

      const seq = ++this.patientSearchSeq

      this.patientSearchTimer = setTimeout(() => {
        this.$axios.get('pacientes', { params: { search, page: 1 } }).then(res => {
          if (seq !== this.patientSearchSeq) return
          update(() => {
            this.pacienteOptions = (res.data.data || []).map(this.mapPacienteOption)
          })
        }).catch(() => {
          if (seq !== this.patientSearchSeq) return
          update(() => {
            this.pacienteOptions = []
          })
        })
      }, 350)
    },
    filterDoctores (val, update) {
      update(() => {
        const needle = (val || '').toLowerCase()
        this.doctorOptions = this.doctores
          .filter(doctor => {
            const text = `${doctor.nombre || ''} ${doctor.especialidad || ''}`.toLowerCase()
            return text.includes(needle)
          })
          .map(this.mapDoctorOption)
      })
    },
    startQuickPatientRecognition (field) {
      if (!this.recognition) {
        this.$q.notify({
          color: 'negative',
          message: 'El reconocimiento de voz no esta soportado en este navegador'
        })
        return
      }

      this.activeRecognitionTarget = 'quickPatient'
      this.activeQuickPatientField = field

      try {
        this.recognition.start()
      } catch (error) {
        this.$q.notify({
          color: 'warning',
          message: 'El microfono ya esta en uso'
        })
      }
    },
    startFormRecognition (field) {
      if (!this.recognition) {
        this.$q.notify({
          color: 'negative',
          message: 'El reconocimiento de voz no esta soportado en este navegador'
        })
        return
      }

      this.activeRecognitionTarget = 'form'
      this.activeQuickPatientField = field

      try {
        this.recognition.start()
      } catch (error) {
        this.$q.notify({
          color: 'warning',
          message: 'El microfono ya esta en uso'
        })
      }
    },
    saveQuickPatient () {
      this.savingPatient = true
      this.$axios.post('pacientes', this.quickPatient).then(res => {
        const option = this.mapPacienteOption(res.data)
        this.pacienteOptions.unshift(option)
        this.form.paciente_id = res.data.id
        this.patientDialog = false
        this.quickPatient = {
          nombre: '',
          apellido: '',
          identificacion: '',
          edad: '',
          sexo: 'M',
          fecha_nacimiento: '',
          telefono: '',
          direccion: '',
          tipo_paciente: 'Externo'
        }
        this.$alert.success('Paciente creado')
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo crear el paciente')
      }).finally(() => {
        this.savingPatient = false
      })
    },
    saveQuickDoctor () {
      this.savingDoctor = true
      this.$axios.post('doctores', this.quickDoctor).then(res => {
        const option = this.mapDoctorOption(res.data)
        this.doctores.unshift(res.data)
        this.doctorOptions.unshift(option)
        this.form.doctor_id = res.data.id
        this.doctorDialog = false
        this.quickDoctor = {
          nombre: '',
          especialidad: '',
          telefono: '',
          email: ''
        }
        this.$alert.success('Medico creado')
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo crear el medico')
      }).finally(() => {
        this.savingDoctor = false
      })
    },
    buildPayload () {
      const payload = { ...this.form }
      if (this.metodoPago === 'pendiente') {
        payload.qr = 0
        payload.efectivo = 0
      } else if (this.metodoPago === 'qr') {
        payload.efectivo = 0
      } else if (this.metodoPago === 'efectivo') {
        payload.qr = 0
      }
      if (Number(payload.punto) !== 1) {
        payload.nombre_factura = null
      }
      return payload
    },
    save () {
      this.saving = true
      const payload = this.buildPayload()
      const request = this.isEdit
        ? this.$axios.put(`caja-recepciones/${this.$route.params.id}`, payload)
        : this.$axios.post('caja-recepciones', payload)

      request.then(() => {
        this.$alert.success(this.isEdit ? 'Caja de recepcion actualizada' : 'Caja de recepcion creada')
        this.$router.push({ name: 'caja-recepciones' })
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo guardar la caja de recepcion')
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style scoped>
.control-row {
  display: grid;
  grid-template-columns: minmax(120px, 150px) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  padding: 8px;
  min-height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.control-label {
  min-width: 0;
}

.control-price {
  font-size: 11px;
}

.control-actions :deep(.q-option-group) {
  gap: 6px 10px;
}

.control-actions :deep(.q-checkbox) {
  margin-right: 0;
}

.control-actions :deep(.q-checkbox__label) {
  font-size: 11px;
}

@media (max-width: 600px) {
  .control-row {
    grid-template-columns: 112px minmax(0, 1fr);
    gap: 6px;
  }

  .control-actions :deep(.q-checkbox__label) {
    font-size: 10px;
  }
}
</style>
