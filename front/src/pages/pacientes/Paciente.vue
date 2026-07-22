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
      row-key="id"
      selection="multiple"
      v-model:selected="selectedPacientes"
      @rowClick="pacienteEdit"
      hide-bottom
      :title="pageTitle"
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
                :disable="isEstadoInternacionFixed"
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
                <q-btn-dropdown color="secondary" label="Reporte" no-caps icon="assessment" :loading="reportLoading || exportLoading">
                  <q-list>
                    <q-item clickable v-close-popup @click="generarReporte">
                      <q-item-section avatar>
                        <q-icon name="picture_as_pdf" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Reporte PDF</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="exportarInternoAltaExcel">
                      <q-item-section avatar>
                        <q-icon name="fa-solid fa-file-excel" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Exportar Interno Alta (Excel)</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
          </div>
          <div class="flex flex-center q-mt-sm">
            <div class="row q-col-gutter-sm items-center">
              <div class="col-auto" v-if="selectedPacientes.length">
                <q-btn-dropdown
                  color="primary"
                  no-caps
                  icon="published_with_changes"
                  :label="`Cambiar tipo (${selectedPacientes.length})`"
                  :loading="bulkLoading"
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="cambiarTipoSeleccionados('Interno')">
                      <q-item-section avatar>
                        <q-icon name="hotel" color="indigo" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Interno</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="cambiarTipoSeleccionados('Externo')">
                      <q-item-section avatar>
                        <q-icon name="person" color="orange" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Externo</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="cambiarTipoSeleccionados('Seguro')">
                      <q-item-section avatar>
                        <q-icon name="health_and_safety" color="teal" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Seguro</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="cambiarTipoSeleccionados('Recepción')">
                      <q-item-section avatar>
                        <q-icon name="point_of_sale" color="brown" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Recepción</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
              <div class="col-auto">
                <q-select
                  v-model="per_page"
                  :options="perPageOptions"
                  label="Por página"
                  dense
                  outlined
                  emit-value
                  map-options
                  style="min-width: 120px"
                  @update:modelValue="onPerPageChange"
                />
              </div>
              <div class="col-auto">
                <q-pagination v-model="current_page" :max="totalPages" @update:modelValue="pacientesGet" :max-pages="5" />
              </div>
            </div>
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
import { Excel } from 'src/addons/Excel'

export default {
  name: 'PacientesPage',
  data() {
    return {
      pacientes: [],
      loading: false,
      reportLoading: false,
      exportLoading: false,
      bulkLoading: false,
      filter: '',
      estadoInternacion: '',
      fechaAltaInicio: '',
      fechaAltaFin: '',
      current_page: 1,
      total: 0,
      per_page: 10,
      selectedPacientes: [],
      perPageOptions: [
        { label: '10', value: 10 },
        { label: '20', value: 20 },
        { label: '50', value: 50 },
        { label: '100', value: 100 },
      ],
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
    this.applyRouteFilters()
    this.pacientesGet()
  },
  watch: {
    '$route.fullPath' () {
      this.applyRouteFilters()
      this.onFilterChange()
    }
  },
  computed: {
    pageTitle() {
      return this.$route.meta?.title || 'Pacientes'
    },
    isEstadoInternacionFixed() {
      return !!this.$route.meta?.fixedEstadoInternacion
    },
    routeTipoPaciente() {
      return this.$route.meta?.tipoPaciente || ''
    },
    routeEstadoInternacion() {
      return this.$route.meta?.estadoInternacion || ''
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.total / this.per_page))
    }
  },
  methods: {
    applyRouteFilters() {
      if (this.isEstadoInternacionFixed) {
        this.estadoInternacion = this.routeEstadoInternacion
        return
      }
      this.estadoInternacion = ''
    },
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
    onPerPageChange() {
      this.current_page = 1
      this.pacientesGet()
    },
    pacientesGet() {
      this.loading = true
      this.$axios.get('pacientes', {
        params: {
          search: this.filter,
          page: this.current_page,
          per_page: this.per_page,
          tipo_paciente: this.routeTipoPaciente,
          estado_internacion: this.estadoInternacion,
          fecha_alta_inicio: this.fechaAltaInicio,
          fecha_alta_fin: this.fechaAltaFin,
        }
      }).then(res => {
        this.pacientes = res.data.data
        this.total = res.data.total
        this.per_page = res.data.per_page
        this.current_page = res.data.current_page
        this.selectedPacientes = this.selectedPacientes.filter(selected => {
          return this.pacientes.some(paciente => paciente.id === selected.id)
        })
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
    cambiarTipoSeleccionados(tipoPaciente) {
      if (!this.selectedPacientes.length) return

      this.$alert.dialog(`¿Desea cambiar a ${tipoPaciente} a ${this.selectedPacientes.length} paciente(s) seleccionado(s)?`).onOk(() => {
        this.bulkLoading = true
        this.$axios.post('pacientes/tipo-paciente', {
          paciente_ids: this.selectedPacientes.map(paciente => paciente.id),
          tipo_paciente: tipoPaciente,
        }).then(res => {
          this.$alert.success(res.data?.message || 'Tipo de paciente actualizado')
          this.selectedPacientes = []
          this.pacientesGet()
        }).catch(error => {
          this.$alert.error(error.response?.data?.message || 'No se pudo cambiar el tipo de paciente')
        }).finally(() => {
          this.bulkLoading = false
        })
      })
    },
    exportarInternoAltaExcel() {
      this.exportLoading = true
      this.$axios.get('pacientes/exportar/interno-alta').then(res => {
        const rows = res.data.map(p => ({
          nombre_completo: `${p.nombre} ${p.apellido}`,
          identificacion: p.identificacion || '',
          edad: p.edad || '',
          sexo: p.sexo || '',
          estado_civil: p.estado_civil || '',
          direccion: p.direccion || '',
          telefono: p.telefono || '',
          fecha_alta: p.fecha_alta ? p.fecha_alta.substring(0, 16).replace('T', ' ') : '',
          alta_por: p.alta_user?.name || '',
        }))
        Excel.export([{
          sheet: 'Interno Alta',
          columns: [
            { label: 'Nombre completo', value: 'nombre_completo' },
            { label: 'Identificación', value: 'identificacion' },
            { label: 'Edad', value: 'edad' },
            { label: 'Sexo', value: 'sexo' },
            { label: 'Estado civil', value: 'estado_civil' },
            { label: 'Dirección', value: 'direccion' },
            { label: 'Teléfono', value: 'telefono' },
            { label: 'Fecha alta', value: 'fecha_alta' },
            { label: 'Alta por', value: 'alta_por' },
          ],
          content: rows,
        }], 'pacientes_interno_alta')
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'No se pudo exportar')
      }).finally(() => {
        this.exportLoading = false
      })
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
