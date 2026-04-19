<template>
  <q-page class="q-pa-md">
    <q-table
      :rows="pacientes"
      :columns="columns"
      dense
      wrap-cells
      flat
      bordered
      :rows-per-page-options="[0]"
      title="Pacientes"
      @rowClick="pacienteEdit"
      hide-bottom
    >
      <template v-slot:top>
        <div class="full-width">
          <div class="row q-col-gutter-sm items-end">
            <div class="col-12 col-md-4">
              <q-input v-model="filter" label="Buscar" dense outlined @update:modelValue="onSearchChange" :debounce="500" clearable>
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
                <template v-slot:before>
                  <q-btn color="positive" label="Nuevo" @click="pacienteNew" no-caps icon="add_circle_outline" :loading="loading" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="estadoInternacion"
                :options="estadoInternacionOptions"
                label="Estado internación"
                dense
                outlined
                emit-value
                map-options
                clearable
                @update:modelValue="onFilterChange"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-input v-model="fechaAltaInicio" label="Alta desde" dense outlined type="date" />
            </div>
            <div class="col-12 col-md-2">
              <q-input v-model="fechaAltaFin" label="Alta hasta" dense outlined type="date" />
            </div>
            <div class="col-12 col-md-2">
              <div class="row q-gutter-sm justify-end">
                <q-btn color="primary" label="Filtrar" no-caps icon="filter_alt" :loading="loading" @click="onFilterChange" />
                <q-btn color="secondary" label="Reporte" no-caps icon="picture_as_pdf" :loading="reportLoading" @click="generarReporte" />
              </div>
            </div>
          </div>
          <div class="flex flex-center q-mt-sm">
            <q-pagination v-model="current_page" :max="Math.ceil(total / per_page)" @update:modelValue="pacientesGet" :max-pages="5" />
          </div>
        </div>
      </template>

      <template v-slot:body-cell-tipo_paciente="props">
        <q-td :props="props">
          <q-chip
            :label="props.row.tipo_paciente"
            :color="props.row.tipo_paciente === 'Interno' ? 'indigo' : 'orange'"
            dense
            class="text-white"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-estado_internacion="props">
        <q-td :props="props">
          <q-chip
            :label="props.row.estado_internacion || 'No internado'"
            :color="chipEstadoColor(props.row.estado_internacion)"
            dense
            class="text-white"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-registro_user="props">
        <q-td :props="props">
          {{ props.row.registro_user?.name || '-' }}
        </q-td>
      </template>

      <template v-slot:body-cell-fecha_alta="props">
        <q-td :props="props">
          {{ formatDateTime(props.row.fecha_alta) }}
        </q-td>
      </template>

      <template v-slot:body-cell-alta_user="props">
        <q-td :props="props">
          {{ props.row.alta_user?.name || '-' }}
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import moment from 'moment'

export default {
  name: 'PacientesPage',
  data() {
    return {
      pacientes: [],
      loading: false,
      reportLoading: false,
      filter: '',
      estadoInternacion: '',
      fechaAltaInicio: '',
      fechaAltaFin: '',
      current_page: 1,
      total: 0,
      per_page: 10,
      estadoInternacionOptions: [
        { label: 'Todos', value: '' },
        { label: 'Internado', value: 'Internado' },
        { label: 'Alta', value: 'Alta' },
        { label: 'No internado', value: 'No internado' },
      ],
      columns: [
        { name: 'nombre_completo', label: 'Nombre', align: 'left', field: 'nombre_completo' },
        { name: 'tipo_paciente', label: 'Tipo paciente', align: 'left', field: 'tipo_paciente' },
        { name: 'estado_internacion', label: 'Estado internación', align: 'left', field: 'estado_internacion' },
        { name: 'identificacion', label: 'Identificación', align: 'left', field: 'identificacion' },
        { name: 'edad', label: 'Edad', align: 'left', field: 'edad' },
        { name: 'sexo', label: 'Sexo', align: 'left', field: 'sexo' },
        { name: 'registro_user', label: 'Registrado por', align: 'left', field: row => row.registro_user?.name || '' },
        { name: 'fecha_alta', label: 'Fecha alta', align: 'left', field: 'fecha_alta' },
        { name: 'alta_user', label: 'Alta por', align: 'left', field: row => row.alta_user?.name || '' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
      ]
    }
  },
  mounted() {
    this.pacientesGet()
  },
  methods: {
    pacienteNew() {
      this.$router.push({ name: 'pacienteNew' })
    },
    pacienteEdit(_evt, paciente) {
      this.$router.push({ name: 'paciente', params: { id: paciente.id } })
    },
    onSearchChange() {
      this.current_page = 1
      this.pacientesGet()
    },
    onFilterChange() {
      this.current_page = 1
      this.pacientesGet()
    },
    pacientesGet() {
      this.loading = true
      this.$axios.get('pacientes', {
        params: {
          search: this.filter,
          page: this.current_page,
          estado_internacion: this.estadoInternacion,
          fecha_alta_inicio: this.fechaAltaInicio,
          fecha_alta_fin: this.fechaAltaFin,
        }
      }).then(res => {
        this.pacientes = res.data.data
        this.total = res.data.total
        this.per_page = res.data.per_page
        this.current_page = res.data.current_page
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'No se pudo cargar pacientes')
      }).finally(() => {
        this.loading = false
      })
    },
    formatDateTime(value) {
      if (!value) return '-'
      return moment(value).format('YYYY-MM-DD HH:mm')
    },
    chipEstadoColor(estado) {
      if (estado === 'Internado') return 'indigo'
      if (estado === 'Alta') return 'positive'
      return 'grey-7'
    },
    generarReporte() {
      this.reportLoading = true
      this.$axios.get('pacientes-reporte/pdf', {
        params: {
          fecha_alta_inicio: this.fechaAltaInicio,
          fecha_alta_fin: this.fechaAltaFin,
        },
        responseType: 'blob',
      }).then(res => {
        const file = new Blob([res.data], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        window.open(fileURL, '_blank')
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'No se pudo generar el reporte')
      }).finally(() => {
        this.reportLoading = false
      })
    },
  }
}
</script>
