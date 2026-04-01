<template>
  <q-page class="q-pa-md">
    <q-table
      title="Formularios de control"
      :rows="rows"
      :columns="columns"
      row-key="id"
      dense
      flat
      bordered
      :rows-per-page-options="[0]"
      :loading="loading"
    >
      <template #top>
        <div class="full-width">
          <div class="row q-col-gutter-sm items-center">
            <div class="col-12 col-md-2">
              <q-btn color="primary" icon="add_circle_outline" label="Nuevo" no-caps outline class="full-width" @click="$router.push({ name: 'formularios-control-nuevo' })" />
            </div>
            <div class="col-12 col-md-2">
              <q-btn color="primary" icon="refresh" label="Actualizar" no-caps outline class="full-width" :loading="loading" @click="loadRows" />
            </div>
            <div class="col-6 col-md-1">
              <q-btn color="secondary" icon="picture_as_pdf" label="PDF" no-caps outline class="full-width" :disable="rows.length === 0" @click="exportPdf" />
            </div>
            <div class="col-6 col-md-1">
              <q-btn color="positive" icon="file_download" label="Excel" no-caps outline class="full-width" :disable="rows.length === 0" @click="exportExcel" />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="filters.user_id"
                :options="userOptions"
                label="Usuario"
                dense
                outlined
                emit-value
                map-options
                clearable
                @update:model-value="loadRows"
              />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="filters.fechaInicio" label="Desde" type="date" dense outlined @update:model-value="loadRows" />
            </div>
            <div class="col-6 col-md-2">
              <q-input v-model="filters.fechaFin" label="Hasta" type="date" dense outlined @update:model-value="loadRows" />
            </div>
            <div class="col-12 col-md-3">
              <q-input v-model="filters.search" label="Buscar" dense outlined clearable @update:model-value="debouncedLoadRows">
                <template #append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-mt-sm">
            <div class="col-12">
              <q-chip dense color="blue-1" text-color="primary">
                Total referencial listado: {{ money(totalListado) }}
              </q-chip>
            </div>
          </div>
        </div>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
            <q-list>
              <q-item clickable v-close-popup @click="editItem(props.row)">
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Editar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="reprintItem(props.row.id)">
                <q-item-section avatar>
                  <q-icon name="print" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Reimprimir</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="deleteItem(props.row.id)">
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
      </template>

      <template #body-cell-fecha="props">
        <q-td :props="props">
          {{ formatDate(props.row.fecha) }}
        </q-td>
      </template>

      <template #body-cell-paciente="props">
        <q-td :props="props">
          {{ props.row.paciente?.nombre_completo }}
        </q-td>
      </template>

      <template #body-cell-user="props">
        <q-td :props="props">
          {{ props.row.user?.name }}
        </q-td>
      </template>

      <template #body-cell-detalle="props">
        <q-td :props="props">
          <div class="selected-items">
            <q-chip
              v-for="item in selectedLabels(props.row.detalle)"
              :key="`${props.row.id}-${item.key}`"
              dense
              size="11px"
              color="blue-1"
              text-color="primary"
            >
              {{ item.label }} {{ item.value }} - {{ money(item.amount) }}
            </q-chip>
            <q-chip dense size="11px" color="positive" text-color="white">
              Total: {{ money(getTotal(props.row.detalle)) }}
            </q-chip>
          </div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import moment from 'moment'
import { Excel } from 'src/addons/Excel'
import { getControlTotal, getSelectedControlItems } from './controlCatalog'

export default {
  name: 'FormulariosControlPage',
  data () {
    return {
      loading: false,
      rows: [],
      users: [],
      searchTimer: null,
      filters: {
        search: '',
        user_id: null,
        fechaInicio: moment().format('YYYY-MM-DD'),
        fechaFin: moment().format('YYYY-MM-DD')
      },
      columns: [
        { name: 'actions', label: 'Acciones', align: 'left' },
        { name: 'fecha', label: 'Fecha', align: 'left', field: 'fecha', sortable: true },
        { name: 'paciente', label: 'Paciente', align: 'left', field: row => row.paciente?.nombre_completo || '', sortable: true },
        { name: 'diagnostico', label: 'Diagnostico', align: 'left', field: 'diagnostico', sortable: true },
        { name: 'detalle', label: 'Control marcado', align: 'left', field: 'detalle' },
        { name: 'user', label: 'Enfermera/o', align: 'left', field: row => row.user?.name || '', sortable: true }
      ]
    }
  },
  mounted () {
    this.loadUsers()
    this.loadRows()
  },
  computed: {
    userOptions () {
      return (this.users || []).map(user => ({
        label: user.name,
        value: user.id
      }))
    },
    totalListado () {
      return this.rows.reduce((sum, row) => sum + this.getTotal(row.detalle), 0)
    }
  },
  methods: {
    formatDate (value) {
      return value ? moment(value).format('DD/MM/YYYY HH:mm') : ''
    },
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    getTotal (detalle) {
      return getControlTotal(detalle)
    },
    selectedLabels (detalle) {
      return getSelectedControlItems(detalle)
    },
    debouncedLoadRows () {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.loadRows()
      }, 350)
    },
    loadUsers () {
      this.$axios.get('users').then(res => {
        this.users = res.data || []
      }).catch(() => {
        this.users = []
      })
    },
    exportExcel () {
      Excel.export([{
        sheet: 'Formularios control',
        columns: [
          { label: 'Fecha', value: row => this.formatDate(row.fecha) },
          { label: 'Paciente', value: row => row.paciente?.nombre_completo || '' },
          { label: 'Diagnostico', value: row => row.diagnostico || '' },
          { label: 'Usuario', value: row => row.user?.name || '' },
          { label: 'Control marcado', value: row => this.selectedLabels(row.detalle).map(item => `${item.label} ${item.value}`).join(', ') },
          { label: 'Total referencial', value: row => Number(this.getTotal(row.detalle)).toFixed(2) }
        ],
        content: this.rows
      }], 'Formularios_Control_Clinica_La_Fuente')
    },
    exportPdf () {
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        this.$alert.error('El navegador bloqueo la ventana emergente del PDF')
        return
      }

      const rowsHtml = this.rows.map((row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${this.formatDate(row.fecha)}</td>
          <td>${row.paciente?.nombre_completo || ''}</td>
          <td>${row.user?.name || ''}</td>
          <td>${row.diagnostico || ''}</td>
          <td>${this.selectedLabels(row.detalle).map(item => `${item.label} ${item.value}`).join(', ')}</td>
          <td style="text-align:right">${Number(this.getTotal(row.detalle)).toFixed(2)}</td>
        </tr>
      `).join('')

      const usuario = this.userOptions.find(item => item.value === this.filters.user_id)?.label || 'Todos'
      printWindow.document.write(`
        <html lang="es">
          <head>
            <title>Formularios de control</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
              h1 { margin: 0 0 6px; font-size: 22px; color: #0369a1; }
              p { margin: 0 0 8px; color: #4b5563; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 16px; }
              th, td { border: 1px solid #d1d5db; padding: 6px; vertical-align: top; text-align: left; }
              th { background: #f3f4f6; }
              .total { margin-top: 12px; text-align: right; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Formularios de control - Clinica La Fuente</h1>
            <p><b>Desde:</b> ${this.filters.fechaInicio || 'Todos'} <b>Hasta:</b> ${this.filters.fechaFin || 'Todos'}</p>
            <p><b>Usuario:</b> ${usuario}</p>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Usuario</th>
                  <th>Diagnostico</th>
                  <th>Control marcado</th>
                  <th>Total ref.</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
            <div class="total">Total referencial listado: ${Number(this.totalListado).toFixed(2)} Bs</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    },
    loadRows () {
      this.loading = true
      this.$axios.get('formularios-control', {
        params: {
          search: this.filters.search || undefined,
          user_id: this.filters.user_id || undefined,
          fechaInicio: this.filters.fechaInicio || undefined,
          fechaFin: this.filters.fechaFin || undefined
        }
      }).then(res => {
        this.rows = res.data || []
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudieron cargar los formularios de control')
      }).finally(() => {
        this.loading = false
      })
    },
    editItem (row) {
      this.$router.push({ name: 'formularios-control-editar', params: { id: row.id } })
    },
    reprintItem (id) {
      window.open(`${this.$url}/../formularios-control/${id}/pdf`, '_blank')
    },
    deleteItem (id) {
      this.$alert.dialog('Desea eliminar el formulario de control?').onOk(() => {
        this.loading = true
        this.$axios.delete(`formularios-control/${id}`).then(() => {
          this.$alert.success('Formulario de control eliminado')
          this.loadRows()
        }).catch(err => {
          this.$alert.error(err.response?.data?.message || 'No se pudo eliminar el formulario de control')
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style scoped>
.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 4px;
  max-width: 420px;
  line-height: 1.05;
}

.selected-items :deep(.q-chip) {
  margin: 0;
  min-height: 18px;
  line-height: 1;
}
</style>
