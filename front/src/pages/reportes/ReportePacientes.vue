<template>
  <q-page class="q-pa-sm">
    <q-card flat bordered>
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="text-h6">Reporte de Altas y Bajas de Pacientes</div>
        <q-space />
        <q-btn color="primary" icon="picture_as_pdf" no-caps label="Generar PDF" :loading="pdfLoading" @click="generarPdf" />
        <q-btn flat round dense icon="refresh" :loading="loading" @click="datosGet" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm items-end">
          <div class="col-12 col-md-3">
            <q-input v-model="fechaInicio" type="date" outlined dense label="Fecha inicio" />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="fechaFin" type="date" outlined dense label="Fecha fin" />
          </div>
          <div class="col-12 col-md-2">
            <q-btn color="primary" icon="search" no-caps label="Filtrar" class="full-width" :loading="loading" @click="datosGet" />
          </div>
          <div class="col-12 col-md-2">
            <q-btn outline color="grey-7" icon="clear" no-caps label="Limpiar" class="full-width" @click="limpiarFiltros" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-sm q-mt-sm">
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Altas registradas</div>
            <div class="text-h5 text-weight-bold text-positive">{{ altas.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Bajas registradas</div>
            <div class="text-h5 text-weight-bold text-negative">{{ bajas.length }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-sm">
      <q-card-section class="q-pb-none">
        <div class="text-subtitle1 text-weight-bold text-positive">
          <q-icon name="arrow_circle_up" /> Pacientes Dados de Alta
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="altas"
          :columns="columnsAltas"
          dense
          flat
          :rows-per-page-options="[0]"
          hide-bottom
          :loading="loading"
          no-data-label="Sin registros"
        >
          <template v-slot:body-cell-fecha_alta="props">
            <q-td :props="props">{{ formatDate(props.row.fecha_alta) }}</q-td>
          </template>
          <template v-slot:body-cell-alta_user="props">
            <q-td :props="props">{{ props.row.alta_user?.name || '-' }}</q-td>
          </template>
          <template v-slot:body-cell-registro_user="props">
            <q-td :props="props">{{ props.row.registro_user?.name || '-' }}</q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mt-sm">
      <q-card-section class="q-pb-none">
        <div class="text-subtitle1 text-weight-bold text-negative">
          <q-icon name="arrow_circle_down" /> Pacientes Dados de Baja
        </div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="bajas"
          :columns="columnsBajas"
          dense
          flat
          :rows-per-page-options="[0]"
          hide-bottom
          :loading="loading"
          no-data-label="Sin registros"
        >
          <template v-slot:body-cell-deleted_at="props">
            <q-td :props="props">{{ formatDate(props.row.deleted_at) }}</q-td>
          </template>
          <template v-slot:body-cell-registro_user="props">
            <q-td :props="props">{{ props.row.registro_user?.name || '-' }}</q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ReportePacientesPage',
  data() {
    return {
      loading: false,
      pdfLoading: false,
      fechaInicio: '',
      fechaFin: '',
      altas: [],
      bajas: [],
      columnsAltas: [
        { name: 'nombre_completo', label: 'Paciente', align: 'left', field: 'nombre_completo' },
        { name: 'identificacion', label: 'CI', align: 'left', field: 'identificacion' },
        { name: 'edad', label: 'Edad', align: 'center', field: 'edad' },
        { name: 'sexo', label: 'Sexo', align: 'left', field: 'sexo' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
        { name: 'registro_user', label: 'Registrado por', align: 'left', field: row => row.registro_user?.name || '-' },
        { name: 'fecha_alta', label: 'Fecha alta', align: 'left', field: 'fecha_alta' },
        { name: 'alta_user', label: 'Dado de alta por', align: 'left', field: row => row.alta_user?.name || '-' },
      ],
      columnsBajas: [
        { name: 'nombre_completo', label: 'Paciente', align: 'left', field: 'nombre_completo' },
        { name: 'identificacion', label: 'CI', align: 'left', field: 'identificacion' },
        { name: 'edad', label: 'Edad', align: 'center', field: 'edad' },
        { name: 'sexo', label: 'Sexo', align: 'left', field: 'sexo' },
        { name: 'tipo_paciente', label: 'Tipo', align: 'left', field: 'tipo_paciente' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
        { name: 'registro_user', label: 'Registrado por', align: 'left', field: row => row.registro_user?.name || '-' },
        { name: 'deleted_at', label: 'Fecha baja', align: 'left', field: 'deleted_at' },
      ],
    }
  },
  mounted() {
    this.datosGet()
  },
  methods: {
    datosGet() {
      this.loading = true
      this.$axios.get('pacientes-reporte/altas-bajas', {
        params: {
          fecha_inicio: this.fechaInicio,
          fecha_fin: this.fechaFin,
        }
      }).then(res => {
        this.altas = res.data.altas
        this.bajas = res.data.bajas
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'No se pudo cargar los datos')
      }).finally(() => {
        this.loading = false
      })
    },
    generarPdf() {
      this.pdfLoading = true
      this.$axios.get('pacientes-reporte/altas-bajas-pdf', {
        params: {
          fecha_inicio: this.fechaInicio,
          fecha_fin: this.fechaFin,
        },
        responseType: 'blob',
      }).then(res => {
        const file = new Blob([res.data], { type: 'application/pdf' })
        window.open(URL.createObjectURL(file), '_blank')
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'No se pudo generar el PDF')
      }).finally(() => {
        this.pdfLoading = false
      })
    },
    limpiarFiltros() {
      this.fechaInicio = ''
      this.fechaFin = ''
      this.datosGet()
    },
    formatDate(value) {
      if (!value) return '-'
      return moment(value).format('YYYY-MM-DD HH:mm')
    },
  },
}
</script>
