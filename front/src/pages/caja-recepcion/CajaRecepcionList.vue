<template>
  <q-page class="q-pa-xs">
    <div class="row q-col-gutter-xs q-mb-xs">
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-cyan text-white">
            <div class="text-caption">QR</div>
            <div class="text-h6">{{ money(summary.total_qr) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-primary text-white">
            <div class="text-caption">Recaudado</div>
            <div class="text-h6">{{ money(summary.total_recaudado) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-positive text-white">
            <div class="text-caption">Ingresos</div>
            <div class="text-h6">{{ money(summary.total_ingresos) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-negative text-white">
            <div class="text-caption">Egresos</div>
            <div class="text-h6">{{ money(summary.total_egresos) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-orange text-white">
            <div class="text-caption">Farmacia</div>
            <div class="text-h6">{{ money(summary.total_farmacia) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-indigo text-white">
            <div class="text-caption">Final</div>
            <div class="text-h6">{{ money(summary.total_final) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mb-xs">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-md-2">
            <q-input v-model="filters.fechaInicio" dense outlined type="date" label="Fecha inicio" />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filters.fechaFin" dense outlined type="date" label="Fecha fin" />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="filters.user_id"
              :options="usersOptions"
              dense
              outlined
              emit-value
              map-options
              label="Encargado"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="filters.search" dense outlined clearable label="Buscar paciente/ficha" />
          </div>
          <div class="col-12 col-md-4 text-right">
            <q-btn color="primary" label="Buscar" no-caps icon="search" class="q-mr-sm" :loading="loading" @click="fetchItems" />
            <q-btn color="positive" label="Nueva caja" no-caps icon="add_circle_outline" class="q-mr-sm" :to="{ name: 'caja-recepciones-nuevo' }" />
            <q-btn-dropdown color="secondary" label="Reportes" no-caps icon="assessment">
              <q-list dense>
                <q-item clickable v-close-popup @click="exportExcel">
                  <q-item-section avatar><q-icon name="table_view" /></q-item-section>
                  <q-item-section>Excel</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-12 col-md-3">
            <q-chip dense color="green-1" text-color="positive">Efectivo cobrado: {{ money(summary.total_efectivo) }}</q-chip>
          </div>
          <div class="col-12 col-md-3">
            <q-chip dense color="indigo-1" text-color="indigo-9">Efectivo en caja: {{ money(summary.total_efectivo_caja) }}</q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-markup-table dense wrap-cells flat bordered>
      <thead>
      <tr class="bg-primary text-white">
        <th>Acciones</th>
        <th>Estado</th>
        <th>Fecha y hora</th>
        <th>Paciente</th>
        <th>Ficha</th>
        <th>Encargado</th>
        <th>Movimiento</th>
        <th>Documento</th>
        <th>Atencion</th>
        <th>QR</th>
        <th>Efectivo</th>
        <th>Egreso</th>
        <th>Recaudado</th>
        <th>Farmacia</th>
        <th>Final</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item.id" :class="{ 'row-anulado bg-red-1 text-grey-8': item.is_anulado }">
        <td>
          <q-btn-dropdown dense color="primary" label="Opciones" no-caps size="10px">
            <q-item v-if="!item.is_anulado" clickable v-close-popup :to="{ name: 'caja-recepciones-editar', params: { id: item.id } }">
              <q-item-section avatar><q-icon name="edit" /></q-item-section>
              <q-item-section>Editar</q-item-section>
            </q-item>
            <q-item v-if="!item.is_anulado" clickable v-close-popup @click="anularItem(item.id)">
              <q-item-section avatar><q-icon name="block" /></q-item-section>
              <q-item-section>Anular</q-item-section>
            </q-item>
            <q-item v-if="item.is_anulado" dense>
              <q-item-section avatar><q-icon name="info" /></q-item-section>
              <q-item-section>Registro anulado</q-item-section>
            </q-item>
          </q-btn-dropdown>
        </td>
        <td>
          <q-chip dense :color="item.is_anulado ? 'negative' : 'positive'" text-color="white">
            {{ item.estado_label }}
          </q-chip>
        </td>
        <td>
          <div>{{ item.fecha }}</div>
          <div class="text-caption">{{ item.hora || '-' }}</div>
        </td>
        <td>
          <div class="text-weight-medium">{{ item.paciente?.nombre_completo || '-' }}</div>
          <div class="text-caption">{{ item.nombre_factura || '-' }}</div>
        </td>
        <td>{{ item.numero_ficha || '-' }}</td>
        <td>{{ item.user?.name || '-' }}</td>
        <td>
          <q-chip dense :color="item.tipo_movimiento === 'Ingreso' ? 'positive' : 'negative'" text-color="white">
            {{ item.tipo_movimiento }}
          </q-chip>
        </td>
        <td>{{ item.documento_label }}</td>
        <td>{{ item.tipo_atencion || '-' }}</td>
        <td class="text-right">{{ money(item.qr) }}</td>
        <td class="text-right">{{ money(item.efectivo) }}</td>
        <td class="text-right">{{ money(item.egreso) }}</td>
        <td class="text-right text-weight-bold">{{ money(item.recaudado_total) }}</td>
        <td class="text-right">{{ money(item.costo_farmacia) }}</td>
        <td class="text-right text-weight-bold">{{ money(item.saldo_final) }}</td>
      </tr>
      <tr v-if="!items.length">
        <td colspan="15" class="text-center text-grey">No hay registros para el rango seleccionado</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
import moment from 'moment'
import { Excel } from 'src/addons/Excel'

export default {
  name: 'CajaRecepcionListPage',
  data () {
    return {
      loading: false,
      items: [],
      users: [],
      summary: {
        total_recaudado: 0,
        total_ingresos: 0,
        total_egresos: 0,
        total_qr: 0,
        total_efectivo: 0,
        total_efectivo_caja: 0,
        total_farmacia: 0,
        total_final: 0
      },
      filters: {
        fechaInicio: moment().format('YYYY-MM-DD'),
        fechaFin: moment().format('YYYY-MM-DD'),
        user_id: '',
        search: ''
      }
    }
  },
  computed: {
    usersOptions () {
      return [{ label: 'Todos', value: '' }, ...this.users.map(user => ({ label: user.name, value: user.id }))]
    },
    activeItems () {
      return this.items.filter(item => !item.is_anulado)
    }
  },
  mounted () {
    this.fetchUsers()
    this.fetchItems()
  },
  methods: {
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    fetchUsers () {
      this.$axios.get('users').then(res => {
        this.users = res.data || []
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudieron cargar usuarios')
      })
    },
    fetchItems () {
      this.loading = true
      this.$axios.get('caja-recepciones', { params: this.filters }).then(res => {
        this.items = res.data.data || []
        this.summary = res.data.summary || this.summary
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo cargar caja de recepcion')
      }).finally(() => {
        this.loading = false
      })
    },
    anularItem (id) {
      this.$alert.dialog('Desea anular el registro de caja de recepcion?').onOk(() => {
        this.loading = true
        this.$axios.delete(`caja-recepciones/${id}`).then(() => {
          this.$alert.success('Registro anulado')
          this.fetchItems()
        }).catch(err => {
          this.$alert.error(err.response?.data?.message || 'No se pudo anular el registro')
        }).finally(() => {
          this.loading = false
        })
      })
    },
    exportExcel () {
      const data = [{
        sheet: 'Caja recepcion',
        columns: [
          { label: 'Estado', value: row => row.estado_label || '' },
          { label: 'Fecha y hora', value: row => `${row.fecha || ''} ${row.hora || ''}`.trim() },
          { label: 'Paciente', value: row => row.paciente?.nombre_completo || '' },
          { label: 'Ficha', value: 'numero_ficha' },
          { label: 'Encargado', value: row => row.user?.name || '' },
          { label: 'Movimiento', value: 'tipo_movimiento' },
          { label: 'Documento', value: 'documento_label' },
          { label: 'Atencion', value: 'tipo_atencion' },
          { label: 'QR', value: row => Number(row.qr || 0) },
          { label: 'Efectivo', value: row => Number(row.efectivo || 0) },
          { label: 'Egreso', value: row => Number(row.egreso || 0) },
          { label: 'Recaudado', value: row => Number(row.recaudado_total || 0) },
          { label: 'Farmacia', value: row => Number(row.costo_farmacia || 0) },
          { label: 'Final', value: row => Number(row.saldo_final || 0) }
        ],
        content: this.activeItems
      }]
      Excel.export(data, 'Caja_Recepcion_Activos')
    }
  }
}
</script>

<style scoped>
.row-anulado td {
  opacity: 0.82;
}
</style>
