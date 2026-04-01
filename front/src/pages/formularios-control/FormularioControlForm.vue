<template>
  <q-page class="q-pa-sm">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-primary text-white">
        <div>
          <div class="text-h6">{{ isEdit ? 'Editar formulario de control' : 'Nuevo formulario de control' }}</div>
          <div class="text-caption">Registro de insumos y atencion de enfermeria</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="arrow_back" color="white" @click="$router.push({ name: 'formularios-control' })" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-form @submit="save">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-3">
              <q-input v-model="form.fecha" dense outlined type="datetime-local" label="Fecha y hora" :rules="[required]" />
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
            <div class="col-12 col-md-3">
              <q-card flat bordered class="bg-blue-1">
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Total referencial</div>
                  <div class="text-h6 text-primary">{{ money(totalReferencial) }}</div>
                  <div class="text-caption">Seleccionados: {{ selectedItems.length }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12">
              <q-input v-model="form.diagnostico" dense outlined type="textarea" autogrow label="Diagnostico" />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12">
              <q-card flat bordered>
                <q-card-section class="bg-grey-2 text-weight-bold q-py-sm">
                  Registro compacto para celular
                </q-card-section>
                <q-card-section class="q-pa-xs">
                  <div v-for="item in controlItems" :key="item.key" class="control-row">
                    <div class="control-label">
                      <div class="text-caption text-weight-medium">{{ item.label }}</div>
                      <div class="text-grey-7 control-price">{{ money(getAmount(item.key, form.detalle[item.key])) }}</div>
                    </div>
                    <div class="control-actions">
                      <q-btn-toggle
                        v-model="form.detalle[item.key]"
                        :options="item.options"
                        dense
                        no-caps
                        unelevated
                        toggle-color="primary"
                        color="grey-3"
                        text-color="dark"
                        spread
                        clearable
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12">
              <q-input v-model="form.observaciones" dense outlined type="textarea" autogrow label="Observaciones" />
            </div>
          </div>

          <div class="text-right q-mt-md">
            <q-btn color="negative" label="Cancelar" no-caps @click="$router.push({ name: 'formularios-control' })" :loading="saving" />
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
import {
  controlCatalog,
  controlOptions,
  createEmptyDetail,
  getControlAmount,
  getControlTotal,
  getSelectedControlItems
} from './controlCatalog'

const emptyForm = () => ({
  fecha: moment().format('YYYY-MM-DDTHH:mm'),
  paciente_id: null,
  diagnostico: '',
  observaciones: '',
  detalle: createEmptyDetail()
})

export default {
  name: 'FormularioControlFormPage',
  data () {
    return {
      loading: false,
      saving: false,
      savingPatient: false,
      patientDialog: false,
      pacienteOptions: [],
      form: emptyForm(),
      quickPatient: {
        nombre: '',
        apellido: '',
        identificacion: '',
        edad: '',
        sexo: 'M',
        telefono: '',
        direccion: '',
        tipo_paciente: 'Externo'
      }
    }
  },
  computed: {
    isEdit () {
      return !!this.$route.params.id
    },
    controlItems () {
      return controlCatalog.map(item => ({
        ...item,
        options: controlOptions[item.type] || []
      }))
    },
    selectedItems () {
      return getSelectedControlItems(this.form.detalle)
    },
    totalReferencial () {
      return getControlTotal(this.form.detalle)
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
    getAmount (key, value) {
      return getControlAmount(key, value)
    },
    mapPacienteOption (paciente) {
      const nombre = paciente.nombre_completo || `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim()
      const doc = paciente.identificacion ? ` - ${paciente.identificacion}` : ''
      return {
        label: `${nombre}${doc}`,
        value: paciente.id
      }
    },
    loadFormData () {
      this.loading = true
      Promise.all([
        this.$axios.get('pacientes', { params: { search: '', page: 1 } }),
        this.isEdit ? this.$axios.get(`formularios-control/${this.$route.params.id}`) : Promise.resolve(null)
      ]).then(([pacientesRes, itemRes]) => {
        this.pacienteOptions = (pacientesRes.data.data || []).map(this.mapPacienteOption)
        if (itemRes && itemRes.data) {
          this.form = {
            ...emptyForm(),
            ...itemRes.data,
            fecha: itemRes.data.fecha ? moment(itemRes.data.fecha).format('YYYY-MM-DDTHH:mm') : moment().format('YYYY-MM-DDTHH:mm'),
            detalle: {
              ...createEmptyDetail(),
              ...(itemRes.data.detalle || {})
            }
          }
          if (itemRes.data.paciente) {
            const option = this.mapPacienteOption(itemRes.data.paciente)
            if (!this.pacienteOptions.some(item => item.value === option.value)) {
              this.pacienteOptions.unshift(option)
            }
          }
        }
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo cargar el formulario de control')
      }).finally(() => {
        this.loading = false
      })
    },
    filterPacientes (val, update) {
      update(() => {})
      this.$axios.get('pacientes', { params: { search: val || '', page: 1 } }).then(res => {
        this.pacienteOptions = (res.data.data || []).map(this.mapPacienteOption)
      }).catch(() => {
        this.pacienteOptions = []
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
      return {
        ...this.form,
        fecha: this.form.fecha ? moment(this.form.fecha).format('YYYY-MM-DD HH:mm:ss') : null
      }
    },
    save () {
      const printWindow = window.open('', '_blank')
      this.saving = true
      const payload = this.buildPayload()
      const request = this.isEdit
        ? this.$axios.put(`formularios-control/${this.$route.params.id}`, payload)
        : this.$axios.post('formularios-control', payload)

      request.then((res) => {
        const id = res.data?.id || this.$route.params.id
        if (printWindow && id) {
          printWindow.location.href = `${this.$url}/../formularios-control/${id}/pdf`
        } else if (printWindow) {
          printWindow.close()
        }
        this.$alert.success(this.isEdit ? 'Formulario de control actualizado' : 'Formulario de control creado')
        this.$router.push({ name: 'formularios-control' })
      }).catch(err => {
        if (printWindow) {
          printWindow.close()
        }
        this.$alert.error(err.response?.data?.message || 'No se pudo guardar el formulario de control')
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
  grid-template-columns: minmax(130px, 180px) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  padding: 6px 4px;
  border-bottom: 1px solid #e0e0e0;
}

.control-label {
  min-width: 0;
}

.control-price {
  font-size: 11px;
}

.control-actions :deep(.q-btn-toggle) {
  width: 100%;
}

.control-actions :deep(.q-btn) {
  min-height: 28px;
  font-size: 11px;
  padding: 0 6px;
}

@media (max-width: 600px) {
  .control-row {
    grid-template-columns: 112px minmax(0, 1fr);
    gap: 6px;
  }

  .control-actions :deep(.q-btn) {
    min-height: 26px;
    font-size: 10px;
    padding: 0 4px;
  }
}
</style>
