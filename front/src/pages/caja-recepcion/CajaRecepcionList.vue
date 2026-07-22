<template>
  <q-page class="q-pa-xs">
    <div class="row q-col-gutter-xs q-mb-xs">
      <div v-for="card in summaryCards" :key="card.label" class="col-6 col-md">
        <q-card flat class="resumen-card" :style="{ background: card.bg }">
          <q-card-section class="q-pa-sm row items-center no-wrap">
            <div class="resumen-card__icon q-mr-sm">
              <q-icon :name="card.icon" size="20px" />
            </div>
            <div class="col">
              <div class="resumen-card__label">{{ card.label }}</div>
              <div class="resumen-card__value">{{ money(card.value) }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mb-xs">
      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-6 col-md-2">
            <q-input v-model="filters.fechaInicio" dense outlined type="date" label="Fecha inicio" />
          </div>
          <div class="col-6 col-md-2">
            <q-input v-model="filters.fechaFin" dense outlined type="date" label="Fecha fin" />
          </div>
          <div v-if="canVerTodas" class="col-6 col-md-2">
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
          <div class="col-6 col-md-2">
            <q-select
              v-model="filters.doctor_id"
              :options="doctorOptions"
              dense
              outlined
              emit-value
              map-options
              clearable
              label="Doctor"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-select
              v-model="filters.punto"
              :options="puntoOptions"
              dense
              outlined
              emit-value
              map-options
              label="Punto"
            />
          </div>
          <div class="col-6 col-md-2">
            <q-input v-model="filters.search" dense outlined clearable label="Buscar paciente/ficha" />
          </div>
        </div>
        <div class="row justify-end items-center q-gutter-sm q-mt-sm">
          <q-btn color="primary" label="Buscar" no-caps icon="search" :loading="loading" @click="fetchItems" />
          <q-btn color="positive" label="Nueva caja" no-caps icon="add_circle_outline" :to="{ name: 'caja-recepciones-nuevo' }" />
          <q-btn-dropdown color="secondary" label="Reportes" no-caps icon="assessment">
            <q-list dense>
              <q-item clickable v-close-popup @click="exportExcel()">
                <q-item-section avatar><q-icon name="table_view" /></q-item-section>
                <q-item-section>Excel</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportExcel(1)">
                <q-item-section avatar><q-icon name="table_view" /></q-item-section>
                <q-item-section>Excel Punto 1 (Factura)</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportExcel(0)">
                <q-item-section avatar><q-icon name="table_view" /></q-item-section>
                <q-item-section>Excel Punto 0 (Recibo)</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportPdf">
                <q-item-section avatar><q-icon name="picture_as_pdf" /></q-item-section>
                <q-item-section>PDF</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportPdfFarmacia">
                <q-item-section avatar><q-icon name="medication" /></q-item-section>
                <q-item-section>PDF Farmacia</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportPdfHonorarios">
                <q-item-section avatar><q-icon name="local_hospital" /></q-item-section>
                <q-item-section>PDF Honorarios doctor</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="row q-col-gutter-sm q-mt-sm">
          <div class="col-12 col-md-3">
            <q-chip dense color="green-1" text-color="positive">Efectivo cobrado: {{ money(summary.total_efectivo) }}</q-chip>
          </div>
          <div class="col-12 col-md-3">
            <q-chip dense color="indigo-1" text-color="indigo-9">Efectivo en caja: {{ money(summary.total_efectivo_caja) }}</q-chip>
          </div>
          <div class="col-12 col-md-3" v-if="summary.total_pendiente > 0">
            <q-chip dense color="orange-2" text-color="orange-9" icon="schedule">Pendiente de cobro: {{ money(summary.total_pendiente) }}</q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-markup-table dense wrap-cells flat bordered>
      <thead>
      <tr class="bg-primary text-white">
        <th>Acciones</th>
        <th>Estado</th>
        <th>Cobro</th>
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
            <q-item clickable v-close-popup @click="printTicket(item)">
              <q-item-section avatar><q-icon name="print" /></q-item-section>
              <q-item-section>Imprimir ticket</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="printCarta(item)">
              <q-item-section avatar><q-icon name="picture_as_pdf" /></q-item-section>
              <q-item-section>Imprimir carta</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="printFormularioControl(item)">
              <q-item-section avatar><q-icon name="description" /></q-item-section>
              <q-item-section>Formulario de control</q-item-section>
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
          <q-chip
            dense
            :color="item.estado_cobro === 'Pagado' ? 'positive' : 'grey-4'"
            :text-color="item.estado_cobro === 'Pagado' ? 'white' : 'grey-8'"
          >
            {{ item.estado_cobro || 'Pendiente' }}
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
        <td colspan="16" class="text-center text-grey">No hay registros para el rango seleccionado</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
  <div id="myElement" class="hidden"></div>
</template>

<script>
import moment from 'moment'
import { Imprimir } from 'src/addons/Imprimir'

export default {
  name: 'CajaRecepcionListPage',
  data () {
    return {
      loading: false,
      items: [],
      users: [],
      doctores: [],
      summary: {
        total_recaudado: 0,
        total_ingresos: 0,
        total_egresos: 0,
        total_qr: 0,
        total_efectivo: 0,
        total_efectivo_punto1: 0,
        total_efectivo_punto0: 0,
        total_efectivo_caja: 0,
        total_farmacia: 0,
        total_final: 0,
        total_pendiente: 0
      },
      filters: {
        fechaInicio: moment().format('YYYY-MM-DD'),
        fechaFin: moment().format('YYYY-MM-DD'),
        user_id: '',
        doctor_id: '',
        punto: '',
        search: ''
      },
      puntoOptions: [
        { label: 'Todos', value: '' },
        { label: '1', value: 1 },
        { label: '0', value: 0 }
      ]
    }
  },
  computed: {
    summaryCards () {
      return [
        { label: 'QR', icon: 'qr_code_2', value: this.summary.total_qr, bg: 'linear-gradient(135deg, #0e7490, #06b6d4)' },
        { label: 'Efectivo Punto 1', icon: 'payments', value: this.summary.total_efectivo_punto1, bg: 'linear-gradient(135deg, #15803d, #22c55e)' },
        { label: 'Efectivo Punto 0', icon: 'payments', value: this.summary.total_efectivo_punto0, bg: 'linear-gradient(135deg, #0f766e, #14b8a6)' },
        { label: 'Egresos', icon: 'trending_down', value: this.summary.total_egresos, bg: 'linear-gradient(135deg, #b91c1c, #ef4444)' },
        { label: 'Final caja', icon: 'account_balance_wallet', value: this.summary.total_final, bg: 'linear-gradient(135deg, #4338ca, #6366f1)' }
      ]
    },
    canVerTodas () {
      return (this.$store.permissions || []).some(p => p.name === 'Caja recepcion ver todas')
    },
    usersOptions () {
      return [{ label: 'Todos', value: '' }, ...this.users.map(user => ({ label: user.name, value: user.id }))]
    },
    doctorOptions () {
      const ordenados = [...this.doctores].sort((a, b) => (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' }))
      return [{ label: 'Todos', value: '' }, ...ordenados.map(doctor => ({ label: doctor.nombre, value: doctor.id }))]
    },
    activeItems () {
      return this.items.filter(item => !item.is_anulado)
    }
  },
  mounted () {
    this.fetchUsers()
    this.fetchDoctores()
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
    fetchDoctores () {
      this.$axios.get('doctores').then(res => {
        this.doctores = res.data || []
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudieron cargar doctores')
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
    triggerBlobDownload (blob, fileName) {
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a = document.createElement('a')
      a.href = url
      a.setAttribute('download', fileName)
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    },
    async exportExcel (puntoOverride = null) {
      if (!this.items.length) {
        this.$q.notify({ type: 'warning', message: 'No hay registros para exportar en Excel' })
        return
      }

      this.loading = true
      try {
        const params = { ...this.filters }
        if (puntoOverride !== null) {
          params.punto = puntoOverride
        }
        const res = await this.$axios.get('caja-recepciones/excel', {
          params,
          responseType: 'blob'
        })
        const suffix = `${this.filters.fechaInicio || 'inicio'}_a_${this.filters.fechaFin || 'fin'}`
        const puntoSuffix = puntoOverride !== null ? `_Punto${puntoOverride}` : ''
        this.triggerBlobDownload(res.data, `Caja_Recepcion_${suffix}${puntoSuffix}.xlsx`)
      } catch (err) {
        this.$alert.error(err.response?.data?.message || 'No se pudo exportar el Excel')
      } finally {
        this.loading = false
      }
    },
    exportPdf () {
      this.openReportPdf('pdf')
    },
    exportPdfFarmacia () {
      this.openReportPdf('pdf-farmacia')
    },
    exportPdfHonorarios () {
      this.openReportPdf('pdf-honorarios')
    },
    openReportPdf (endpoint) {
      if (!this.items.length) {
        this.$q.notify({ type: 'warning', message: 'No hay registros para exportar en PDF' })
        return
      }

      const params = new URLSearchParams({
        fechaInicio: this.filters.fechaInicio || '',
        fechaFin: this.filters.fechaFin || '',
        user_id: this.filters.user_id || '',
        doctor_id: this.filters.doctor_id || '',
        search: this.filters.search || ''
      })

      const url = `${this.$url}/../caja-recepciones/${endpoint}?${params.toString()}`
      window.open(url, '_blank')
    },
    printTicket (item) {
      Imprimir.imprimirCaja(item)
    },
    printCarta (item) {
      const url = `${this.$url}/../caja-recepciones/${item.id}/pdf-carta`
      window.open(url, '_blank')
    },
    printFormularioControl (item) {
      const url = `${this.$url}/../caja-recepciones/${item.id}/pdf-formulario-control`
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>
.row-anulado td {
  opacity: 0.82;
}

.resumen-card {
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.18);
}

.resumen-card__icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.22);
  flex: 0 0 auto;
}

.resumen-card__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.85;
  line-height: 1.1;
}

.resumen-card__value {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
}
</style>
