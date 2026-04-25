<template>
  <div>
    <div class="row items-center q-mb-sm">
      <div class="text-h6">
        Cajas de recepcion
        <template v-if="items.length">
          <span class="text-caption q-ml-xs">({{ activos.length }})</span>
          <span class="text-h5 text-bold q-ml-sm">{{ totalRecaudado.toFixed(2) }} Bs.</span>
        </template>
      </div>
      <q-space />
      <div class="row q-col-gutter-xs items-center">
        <div class="col-auto">
          <q-btn
            icon="print"
            dense
            no-caps
            color="primary"
            label="Imprimir liquidación"
            @click="abrirDialogImpresion"
          />
        </div>
        <div class="col-auto">
          <q-chip dense :color="totalPagado > 0 ? 'positive' : 'grey-4'" :text-color="totalPagado > 0 ? 'white' : 'grey-8'">
            Pagado: {{ totalPagado.toFixed(2) }} Bs
          </q-chip>
        </div>
        <div class="col-auto">
          <q-chip v-if="totalPendiente > 0" dense color="warning" text-color="white">
            Pendiente: {{ totalPendiente.toFixed(2) }} Bs
          </q-chip>
        </div>
      </div>
    </div>

    <q-inner-loading :showing="loading" />

    <q-list bordered separator>
      <q-item v-for="item in items" :key="item.id" :class="{ 'bg-red-1': item.is_anulado }">
        <q-item-section avatar>
          <q-avatar>
            <q-btn :label="String(item.id)" color="primary" flat dense size="sm" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <div class="row items-center q-gutter-xs q-mb-xs">
              <q-chip
                dense
                :color="item.estado_cobro === 'Pagado' ? 'positive' : 'warning'"
                :text-color="item.estado_cobro === 'Pagado' ? 'white' : 'white'"
                icon="paid"
              >
                {{ item.estado_cobro === 'Pagado' ? 'Paga ahora' : 'Paga luego' }}
              </q-chip>
              <q-chip v-if="item.is_anulado" dense color="negative" text-color="white">Anulado</q-chip>
              <q-chip v-if="item.tipo_atencion" dense color="blue-1" text-color="blue-9">{{ item.tipo_atencion }}</q-chip>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-auto">
                <span class="text-bold">Total: </span>
                <span class="text-weight-medium">{{ Number(item.recaudado_total || 0).toFixed(2) }} Bs</span>
              </div>
              <div class="col-auto" v-if="Number(item.egreso) > 0">
                <span class="text-bold text-negative">Egreso doctor: </span>
                <span>{{ Number(item.egreso).toFixed(2) }} Bs</span>
              </div>
              <div class="col-auto" v-if="Number(item.efectivo) > 0">
                <span class="text-bold text-positive">Efectivo: </span>
                <span>{{ Number(item.efectivo).toFixed(2) }} Bs</span>
              </div>
              <div class="col-auto" v-if="Number(item.qr) > 0">
                <span class="text-bold text-cyan-9">QR: </span>
                <span>{{ Number(item.qr).toFixed(2) }} Bs</span>
              </div>
            </div>

            <div v-if="item.doctor" class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="person" size="xs" /> Dr. {{ item.doctor.nombre }}
            </div>

            <div v-if="item.fecha_cobro" class="text-caption text-positive q-mt-xs">
              <q-icon name="check_circle" size="xs" color="positive" />
              Cobrado el {{ formatFechaCobro(item.fecha_cobro) }}
              <span v-if="item.cobrado_por"> por <strong>{{ item.cobrado_por.name }}</strong></span>
            </div>
          </q-item-label>
          <q-item-label caption>
            {{ item.fecha }} {{ item.hora ? '— ' + item.hora : '' }}
            <span v-if="item.numero_ficha"> · Ficha: {{ item.numero_ficha }}</span>
            <span v-if="item.nombre_factura"> · {{ item.documento_label }}: {{ item.nombre_factura }}</span>
          </q-item-label>
        </q-item-section>

        <q-item-section side class="items-end q-gutter-y-xs">
          <span class="text-caption text-grey-7">{{ item.user?.name }}</span>
          <q-btn
            v-if="item.estado_cobro === 'Pendiente' && !item.fecha_cobro && !item.is_anulado"
            flat dense no-caps
            icon="payments"
            color="positive"
            label="Cobrar ahora"
            size="sm"
            @click="abrirDialogCobro(item)"
          />
          <q-btn
            flat dense round
            icon="edit"
            color="primary"
            size="sm"
            :to="{ name: 'caja-recepciones-editar', params: { id: item.id } }"
            :disable="item.is_anulado"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="!loading && !items.length">
        <q-item-section class="text-center text-grey q-py-md">
          Sin cajas de recepcion registradas
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="cobroDialog" persistent>
      <q-card style="min-width: 340px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Registrar cobro</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="cobroDialog = false" />
        </q-card-section>
        <q-card-section>
          <div class="text-body2 q-mb-sm text-grey-8">
            Total a cobrar:
            <strong class="text-primary">{{ Number(cobrandoItem?.recaudado_total || 0).toFixed(2) }} Bs</strong>
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

    <q-dialog v-model="impresionDialog" persistent>
      <q-card style="min-width: 360px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Imprimir hoja de liquidación</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="impresionDialog = false" />
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input v-model="impresionFechaInicio" dense outlined type="date" label="Fecha inicio" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="impresionFechaFin" dense outlined type="date" label="Fecha fin" />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" color="negative" @click="impresionDialog = false" />
          <q-btn no-caps label="Todo" color="primary" icon="print" @click="imprimirLiquidacion('todo')" />
          <q-btn no-caps label="Paga ahora" color="info" icon="print" @click="imprimirLiquidacion('paga_ahora')" />
          <q-btn no-caps label="Pagado luego" color="secondary" icon="print" @click="imprimirLiquidacion('pagado_luego')" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'CajasRecepcionTab',
  props: {
    paciente: { type: Object, required: true }
  },
  data () {
    return {
      items: [],
      loading: false,
      cobroDialog: false,
      cobrandoItem: null,
      cobrandoLoading: false,
      cobroFecha: moment().format('YYYY-MM-DD'),
      cobroHora: moment().format('HH:mm'),
      impresionDialog: false,
      impresionFechaInicio: moment().format('YYYY-MM-DD'),
      impresionFechaFin: moment().format('YYYY-MM-DD')
    }
  },
  mounted () {
    this.fetchItems()
  },
  computed: {
    activos () {
      return this.items.filter(i => !i.is_anulado)
    },
    totalRecaudado () {
      return this.activos.reduce((sum, i) => sum + Number(i.recaudado_total || 0), 0)
    },
    totalPagado () {
      return this.activos
        .filter(i => i.estado_cobro === 'Pagado')
        .reduce((sum, i) => sum + Number(i.recaudado_total || 0), 0)
    },
    totalPendiente () {
      return this.activos
        .filter(i => i.estado_cobro !== 'Pagado' && !i.fecha_cobro)
        .reduce((sum, i) => sum + Number(i.recaudado_total || 0), 0)
    }
  },
  methods: {
    fetchItems () {
      this.loading = true
      this.$axios.get('caja-recepciones', { params: { paciente_id: this.paciente.id } })
        .then(res => { this.items = res.data.data || [] })
        .catch(() => this.$q.notify({ type: 'negative', message: 'No se pudieron cargar las cajas de recepcion' }))
        .finally(() => { this.loading = false })
    },
    formatFechaCobro (fecha) {
      return moment(fecha).format('DD/MM/YYYY HH:mm')
    },
    abrirDialogCobro (item) {
      this.cobrandoItem = item
      this.cobroFecha = moment().format('YYYY-MM-DD')
      this.cobroHora = moment().format('HH:mm')
      this.cobroDialog = true
    },
    abrirDialogImpresion () {
      this.impresionFechaInicio = moment().format('YYYY-MM-DD')
      this.impresionFechaFin = moment().format('YYYY-MM-DD')
      this.impresionDialog = true
    },
    imprimirLiquidacion (tipo = 'todo') {
      if (!this.paciente?.id) {
        this.$q.notify({ type: 'negative', message: 'Paciente inválido' })
        return
      }
      if (!this.impresionFechaInicio || !this.impresionFechaFin) {
        this.$q.notify({ type: 'warning', message: 'Debe seleccionar fecha inicio y fecha fin' })
        return
      }
      if (this.impresionFechaInicio > this.impresionFechaFin) {
        this.$q.notify({ type: 'warning', message: 'La fecha inicio no puede ser mayor a la fecha fin' })
        return
      }
      const params = new URLSearchParams({
        fechaInicio: this.impresionFechaInicio,
        fechaFin: this.impresionFechaFin,
        tipo_impresion: tipo
      })
      const url = `${this.$url}/../pacientes/${this.paciente.id}/caja-liquidacion-pdf?${params.toString()}`
      this.impresionDialog = false
      window.open(url, '_blank')
    },

    confirmarCobro () {
      if (!this.cobrandoItem) return
      this.cobrandoLoading = true
      const fechaCobro = `${this.cobroFecha} ${this.cobroHora}:00`
      this.$axios.post(`caja-recepciones/${this.cobrandoItem.id}/cobrar`, {
        fecha_cobro: fechaCobro,
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
