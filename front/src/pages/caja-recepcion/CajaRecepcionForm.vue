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
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Recaudado total</div>
                  <div class="text-h6 text-primary">{{ money(recaudadoTotal) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Farmacia</div>
                  <div class="text-h6 text-orange">{{ money(form.costo_farmacia) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Pagado ahora</div>
                  <div class="text-h6 text-positive">{{ money(pagadoAhora) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-3">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Saldo final</div>
                  <div class="text-h6 text-indigo">{{ money(saldoFinal) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary" class="text-grey-8">
            <q-tab name="datos" icon="assignment" label="Datos" no-caps />
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
                  />
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
                <q-input v-model="quickPatient.nombre" dense outlined label="Nombre" :rules="[required]" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.apellido" dense outlined label="Apellido" :rules="[required]" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="quickPatient.identificacion" dense outlined label="Identificacion" />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="quickPatient.edad" dense outlined label="Edad" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="quickPatient.sexo" :options="['M', 'F']" dense outlined label="Sexo" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.telefono" dense outlined label="Telefono" />
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="quickPatient.tipo_paciente" :options="['Externo', 'Interno']" dense outlined label="Tipo paciente" />
              </div>
              <div class="col-12">
                <q-input v-model="quickPatient.direccion" dense outlined label="Direccion" />
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
  </q-page>
</template>

<script>
import moment from 'moment'

const emptyForm = () => ({
  fecha: moment().format('YYYY-MM-DD'),
  paciente_id: null,
  doctor_id: null,
  tipo_atencion: 'Externo',
  punto: 0,
  nombre_factura: '',
  numero_ficha: '',
  estado_pago: 'Ahora',
  laboratorio_nombre: '',
  medico_ecografia: '',
  observaciones: '',
  qr: 0,
  efectivo: 0,
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
      form: emptyForm(),
      doctores: [],
      pacienteOptions: [],
      doctorOptions: [],
      metodoPago: 'efectivo',
      patientDialog: false,
      quickPatient: {
        nombre: '',
        apellido: '',
        identificacion: '',
        edad: '',
        sexo: 'M',
        telefono: '',
        direccion: '',
        tipo_paciente: 'Externo'
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
      return this.recaudadoTotal - Number(this.form.costo_farmacia || 0)
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
    }
  },
  mounted () {
    this.loadFormData()
  },
  methods: {
    required (value) {
      return !!value || 'Campo requerido'
    },
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
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
            fecha: itemRes.data.fecha ? itemRes.data.fecha.substring(0, 10) : moment().format('YYYY-MM-DD')
          }
          this.metodoPago = this.detectMetodoPago()
          const paciente = itemRes.data.paciente
          if (paciente) {
            const option = this.mapPacienteOption(paciente)
            if (!this.pacienteOptions.some(item => item.value === option.value)) {
              this.pacienteOptions.unshift(option)
            }
          }
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
    filterPacientes (val, update) {
      update(() => {})
      this.$axios.get('pacientes', { params: { search: val || '', page: 1 } }).then(res => {
        this.pacienteOptions = (res.data.data || []).map(this.mapPacienteOption)
      }).catch(() => {
        this.pacienteOptions = []
      })
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
