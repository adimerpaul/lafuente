<template>
  <q-page class="q-pa-xs">

    <!-- Cards resumen -->
    <div class="row q-col-gutter-xs q-mb-xs">
      <div class="col-6 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-deep-orange text-white">
            <div class="text-caption">Total registros</div>
            <div class="text-h6">{{ activos.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-warning text-white">
            <div class="text-caption">Pendientes</div>
            <div class="text-h6">{{ pendientes.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-positive text-white">
            <div class="text-caption">Cobrados tarde</div>
            <div class="text-h6">{{ cobradosTarde.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-primary text-white">
            <div class="text-caption">Total recaudado</div>
            <div class="text-h6">{{ money(totalRecaudado) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-orange text-white">
            <div class="text-caption">Monto pendiente</div>
            <div class="text-h6">{{ money(totalMontoPendiente) }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-6 col-md-2">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm bg-teal text-white">
            <div class="text-caption">Cobrado tarde</div>
            <div class="text-h6">{{ money(totalMontoCobradoTarde) }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Filtros -->
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
              v-model="filters.cobrado_por_user_id"
              :options="usersOptions"
              dense outlined emit-value map-options clearable
              label="Cobrado por"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="filters.search" dense outlined clearable label="Buscar paciente / ficha" />
          </div>
          <div class="col-12 col-md-3 text-right">
            <q-btn color="primary" label="Buscar" no-caps icon="search" :loading="loading" @click="fetchItems" />
          </div>
        </div>
        <div class="row q-col-gutter-sm q-mt-xs">
          <div class="col-auto">
            <q-chip dense color="warning" text-color="white" icon="schedule">
              Pendiente: {{ money(totalMontoPendiente) }} ({{ pendientes.length }})
            </q-chip>
          </div>
          <div class="col-auto">
            <q-chip dense color="teal" text-color="white" icon="check_circle">
              Cobrado tarde: {{ money(totalMontoCobradoTarde) }} ({{ cobradosTarde.length }})
            </q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla -->
    <q-markup-table dense wrap-cells flat bordered>
      <thead>
        <tr class="bg-deep-orange text-white">
          <th>Acciones</th>
          <th>Estado</th>
          <th>Cobro</th>
          <th>Fecha registro</th>
          <th>Fecha cobro</th>
          <th>Cobrado por</th>
          <th>Paciente</th>
          <th>Ficha</th>
          <th>Registrado por</th>
          <th>Atencion</th>
          <th>Efectivo</th>
          <th>QR</th>
          <th>Egreso</th>
          <th>Recaudado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          :class="{ 'bg-red-1 text-grey-8': item.is_anulado }"
        >
          <td>
            <q-btn-dropdown dense color="primary" label="Opciones" no-caps size="10px">
              <q-list>
                <q-item
                  v-if="!item.fecha_cobro && !item.is_anulado"
                  clickable v-close-popup
                  @click="abrirDialogCobro(item)"
                >
                  <q-item-section avatar><q-icon name="payments" color="positive" /></q-item-section>
                  <q-item-section>Cobrar ahora</q-item-section>
                </q-item>
                <q-item
                  clickable v-close-popup
                  :to="{ name: 'caja-recepciones-editar', params: { id: item.id } }"
                  :disable="item.is_anulado"
                >
                  <q-item-section avatar><q-icon name="edit" /></q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </td>
          <td>
            <q-chip dense :color="item.is_anulado ? 'negative' : 'positive'" text-color="white">
              {{ item.estado_label }}
            </q-chip>
          </td>
          <td>
            <q-chip
              dense
              :color="item.fecha_cobro ? 'teal' : 'warning'"
              text-color="white"
              :icon="item.fecha_cobro ? 'check_circle' : 'schedule'"
            >
              {{ item.fecha_cobro ? 'Cobrado tarde' : 'Pendiente' }}
            </q-chip>
          </td>
          <td>
            <div>{{ item.fecha }}</div>
            <div class="text-caption text-grey-7">{{ item.hora || '-' }}</div>
          </td>
          <td>
            <template v-if="item.fecha_cobro">
              <div class="text-positive text-weight-medium">{{ formatFecha(item.fecha_cobro) }}</div>
            </template>
            <span v-else class="text-grey-5">—</span>
          </td>
          <td>{{ item.cobrado_por?.name || '—' }}</td>
          <td>
            <div class="text-weight-medium">{{ item.paciente?.nombre_completo || '-' }}</div>
            <div class="text-caption text-grey-7">{{ item.nombre_factura || '' }}</div>
          </td>
          <td>{{ item.numero_ficha || '-' }}</td>
          <td>{{ item.user?.name || '-' }}</td>
          <td>{{ item.tipo_atencion || '-' }}</td>
          <td class="text-right">{{ money(item.efectivo) }}</td>
          <td class="text-right">{{ money(item.qr) }}</td>
          <td class="text-right">{{ money(item.egreso) }}</td>
          <td class="text-right text-weight-bold">{{ money(item.recaudado_total) }}</td>
        </tr>
        <tr v-if="!loading && !items.length">
          <td colspan="14" class="text-center text-grey q-py-md">Sin registros para los filtros seleccionados</td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-inner-loading :showing="loading" />

    <!-- Dialog cobrar -->
    <q-dialog v-model="cobroDialog" persistent>
      <q-card style="min-width: 340px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Registrar cobro</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="cobroDialog = false" />
        </q-card-section>
        <q-card-section>
          <div class="text-body2 q-mb-xs">
            Paciente: <strong>{{ cobrandoItem?.paciente?.nombre_completo }}</strong>
          </div>
          <div class="text-body2 q-mb-sm">
            Total: <strong class="text-primary">{{ money(cobrandoItem?.recaudado_total) }}</strong>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input v-model="cobroFecha" dense outlined type="date" label="Fecha de cobro" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="cobroHora" dense outlined type="time" label="Hora de cobro" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" color="negative" @click="cobroDialog = false" :loading="cobrandoLoading" />
          <q-btn no-caps label="Confirmar cobro" color="positive" icon="check" @click="confirmarCobro" :loading="cobrandoLoading" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CobrosRetrasadosPage',
  data () {
    return {
      items: [],
      users: [],
      loading: false,
      filters: {
        fechaInicio: moment().format('YYYY-MM-DD'),
        fechaFin: moment().format('YYYY-MM-DD'),
        cobrado_por_user_id: null,
        search: ''
      },
      cobroDialog: false,
      cobrandoItem: null,
      cobrandoLoading: false,
      cobroFecha: moment().format('YYYY-MM-DD'),
      cobroHora: moment().format('HH:mm')
    }
  },
  mounted () {
    this.fetchUsers()
    this.fetchItems()
  },
  computed: {
    usersOptions () {
      return [
        { label: 'Todos', value: null },
        ...this.users.map(u => ({ label: u.name, value: u.id }))
      ]
    },
    activos () {
      return this.items.filter(i => !i.is_anulado)
    },
    pendientes () {
      return this.activos.filter(i => !i.fecha_cobro)
    },
    cobradosTarde () {
      return this.activos.filter(i => i.fecha_cobro)
    },
    totalRecaudado () {
      return this.activos.reduce((s, i) => s + Number(i.recaudado_total || 0), 0)
    },
    totalMontoPendiente () {
      return this.pendientes.reduce((s, i) => s + Number(i.recaudado_total || 0), 0)
    },
    totalMontoCobradoTarde () {
      return this.cobradosTarde.reduce((s, i) => s + Number(i.recaudado_total || 0), 0)
    }
  },
  methods: {
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    formatFecha (fecha) {
      return moment(fecha).format('DD/MM/YYYY HH:mm')
    },
    fetchUsers () {
      this.$axios.get('users').then(res => {
        this.users = res.data || []
      }).catch(() => {})
    },
    fetchItems () {
      this.loading = true
      this.$axios.get('caja-recepciones', {
        params: {
          cobros_retrasados: true,
          fechaInicio: this.filters.fechaInicio || undefined,
          fechaFin: this.filters.fechaFin || undefined,
          cobrado_por_user_id: this.filters.cobrado_por_user_id || undefined,
          search: this.filters.search || undefined
        }
      }).then(res => {
        this.items = res.data.data || []
      }).catch(() => {
        this.$q.notify({ type: 'negative', message: 'No se pudieron cargar los cobros retrasados' })
      }).finally(() => {
        this.loading = false
      })
    },
    abrirDialogCobro (item) {
      this.cobrandoItem = item
      this.cobroFecha = moment().format('YYYY-MM-DD')
      this.cobroHora = moment().format('HH:mm')
      this.cobroDialog = true
    },
    confirmarCobro () {
      if (!this.cobrandoItem) return
      this.cobrandoLoading = true
      this.$axios.post(`caja-recepciones/${this.cobrandoItem.id}/cobrar`, {
        fecha_cobro: `${this.cobroFecha} ${this.cobroHora}:00`,
        cobrado_por_user_id: this.$store.user.id
      }).then(() => {
        this.$alert.success('Cobro registrado correctamente')
        this.cobroDialog = false
        this.cobrandoItem = null
        this.fetchItems()
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo registrar el cobro')
      }).finally(() => {
        this.cobrandoLoading = false
      })
    }
  }
}
</script>

<style scoped>
.row-anulado td {
  opacity: 0.82;
}
</style>
