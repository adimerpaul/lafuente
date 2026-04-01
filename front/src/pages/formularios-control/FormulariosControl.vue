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
        fechaInicio: '',
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
