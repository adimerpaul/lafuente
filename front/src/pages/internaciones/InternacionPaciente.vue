<template>
  <q-page class="q-pa-sm bg-grey-2 compact-page">
    <div class="row items-center q-gutter-xs q-mb-sm">
      <q-btn flat round dense size="sm" color="primary" icon="arrow_back" @click="$router.push({ name: 'internaciones' })" />
      <div>
        <div class="text-subtitle1 text-weight-bold">Ficha de internación</div>
        <div class="text-caption text-grey-7">{{ paciente?.nombre_completo || 'Cargando paciente...' }}</div>
      </div>
      <q-space />
      <q-chip v-if="internacionActiva" color="deep-orange" text-color="white" icon="hotel">
        Cama {{ internacionActiva.cama }} · {{ internacionActiva.dias_internado }} día(s)
      </q-chip>
    </div>

    <q-inner-loading :showing="loading" label="Cargando ficha..." />

    <div v-if="paciente" class="row q-col-gutter-sm">
      <div class="col-12 col-lg-4">
        <q-card flat bordered>
          <q-card-section class="q-pa-sm">
            <div class="text-subtitle2 text-weight-bold q-mb-xs">{{ paciente.nombre_completo }}</div>
            <div class="patient-grid">
              <div class="patient-field">
                <span>Identificación</span>
                <strong>{{ paciente.identificacion || '-' }}</strong>
              </div>
              <div class="patient-field">
                <span>Edad</span>
                <strong>{{ paciente.edad || '-' }}</strong>
              </div>
              <div class="patient-field">
                <span>Sexo</span>
                <strong>{{ paciente.sexo || '-' }}</strong>
              </div>
              <div class="patient-field">
                <span>Teléfono</span>
                <strong>{{ paciente.telefono || '-' }}</strong>
              </div>
              <div class="patient-field patient-field--wide">
                <span>Dirección</span>
                <strong>{{ paciente.direccion || '-' }}</strong>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-sm">
          <q-card-section class="q-pa-sm">
            <div class="text-caption text-weight-bold">Resumen financiero</div>
            <div class="row q-col-gutter-xs q-mt-xs">
              <div class="col-6"><div class="summary-box"><small>Cobros</small><strong>Bs {{ money(totalCobros) }}</strong></div></div>
              <div class="col-6"><div class="summary-box"><small>Ventas</small><strong>Bs {{ money(totalVentas) }}</strong></div></div>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">Totales sin registros anulados.</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-8">
        <q-card flat bordered>
          <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary">
            <q-tab name="internaciones" icon="hotel" label="Internaciones" />
            <q-tab name="cobros" icon="payments" label="Cobros" />
            <q-tab name="ventas" icon="shopping_cart" label="Ventas" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="internaciones" class="q-pa-sm">
              <q-banner v-if="internacionActiva" dense rounded class="bg-orange-1 text-orange-10 q-mb-sm">
                Internación activa desde {{ fecha(internacionActiva.fecha_inicio) }}, cama
                <strong>{{ internacionActiva.cama }}</strong>.
                <template #action>
                  <q-btn color="negative" no-caps label="Finalizar internación" @click="abrirFinalizacion" />
                </template>
              </q-banner>

              <q-form v-else class="row q-col-gutter-xs q-mb-sm items-start" @submit="crearInternacion">
                <div class="col-12 text-subtitle2">Nueva internación</div>
                <div class="col-12 col-md-4">
                  <q-input v-model="form.fecha_inicio" outlined dense type="datetime-local"
                           label="Fecha y hora de inicio *" :rules="[required]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model.trim="form.cama" outlined dense label="Cama *"
                           maxlength="100" :rules="[required]" />
                </div>
                <div class="col-12 col-md">
                  <q-input v-model="form.observacion" outlined dense label="Observación" maxlength="1000" />
                </div>
                <div class="col-12 col-md-auto">
                  <q-btn type="submit" color="positive" icon="add" label="Crear internación"
                         no-caps :loading="saving" />
                </div>
              </q-form>

              <q-table flat bordered dense wrap-cells row-key="id" title="Historial de internaciones"
                       :rows="paciente.internaciones || []" :columns="internacionColumns"
                       :rows-per-page-options="[10, 20, 50]">
                <template #body-cell-fecha_inicio="props"><q-td :props="props">{{ fecha(props.row.fecha_inicio) }}</q-td></template>
                <template #body-cell-fecha_finalizacion="props"><q-td :props="props">{{ fecha(props.row.fecha_finalizacion) }}</q-td></template>
                <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.estado === 'Activa' ? 'deep-orange' : 'positive'" :label="props.row.estado" /></q-td></template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="cobros" class="q-pa-sm">
              <q-table flat bordered dense wrap-cells row-key="id" :rows="paciente.cobros || []"
                       :columns="cobroColumns" :rows-per-page-options="[10, 20, 50]">
                <template #body-cell-fecha="props"><q-td :props="props">{{ fecha(props.row.fecha) }}</q-td></template>
                <template #body-cell-total="props"><q-td :props="props">Bs {{ money(props.row.total) }}</q-td></template>
                <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.anulado ? 'negative' : props.row.pagado ? 'positive' : 'warning'" :label="props.row.anulado ? 'Anulado' : props.row.pagado ? 'Pagado' : 'Pendiente'" /></q-td></template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="ventas" class="q-pa-sm">
              <q-table flat bordered dense wrap-cells row-key="id" :rows="ventas"
                       :columns="ventaColumns" :rows-per-page-options="[10, 20, 50]">
                <template #body-cell-fecha="props"><q-td :props="props">{{ fechaVenta(props.row) }}</q-td></template>
                <template #body-cell-total="props"><q-td :props="props">Bs {{ money(props.row.venta?.total) }}</q-td></template>
                <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.venta?.estado === 'Anulado' ? 'negative' : 'positive'" :label="props.row.venta?.estado || '-'" /></q-td></template>
              </q-table>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialogoFinalizar" persistent>
      <q-card style="min-width: 360px">
        <q-card-section class="text-h6">Finalizar internación</q-card-section>
        <q-card-section>
          <q-input v-model="fechaFinalizacion" outlined type="datetime-local"
                   label="Fecha y hora de finalización" />
          <div class="text-caption text-grey-7 q-mt-sm">Esta acción dará de alta al paciente y conservará el historial.</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="negative" label="Finalizar" :loading="saving" @click="finalizarInternacion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment'

export default {
  name: 'InternacionPacientePage',
  data () {
    return {
      paciente: null,
      loading: false,
      saving: false,
      dialogoFinalizar: false,
      tab: 'internaciones',
      fechaFinalizacion: '',
      form: { fecha_inicio: '', cama: '', observacion: '' },
      internacionColumns: [
        { name: 'fecha_inicio', label: 'Inicio', field: 'fecha_inicio', align: 'left' },
        { name: 'fecha_finalizacion', label: 'Finalización', field: 'fecha_finalizacion', align: 'left' },
        { name: 'cama', label: 'Cama', field: 'cama', align: 'left' },
        { name: 'dias', label: 'Días internado', field: 'dias_internado', align: 'center' },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
        { name: 'usuario', label: 'Registrado por', field: row => row.user?.name || '-', align: 'left' },
      ],
      cobroColumns: [
        { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' },
        { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
        { name: 'observacion', label: 'Observación', field: 'observacion', align: 'left' },
        { name: 'total', label: 'Total', field: 'total', align: 'right' },
        { name: 'estado', label: 'Estado', align: 'center' },
        { name: 'usuario', label: 'Usuario', field: row => row.user?.name || '-', align: 'left' },
      ],
      ventaColumns: [
        { name: 'fecha', label: 'Fecha', align: 'left' },
        { name: 'tipo', label: 'Tipo', field: row => row.venta?.tipo_venta || '-', align: 'left' },
        { name: 'detalle', label: 'Detalle', field: row => row.venta?.detailsText || '-', align: 'left' },
        { name: 'tipo_pago', label: 'Tipo de pago', field: row => row.venta?.tipo_pago || '-', align: 'left' },
        { name: 'total', label: 'Total', align: 'right' },
        { name: 'estado', label: 'Estado', align: 'center' },
      ],
    }
  },
  computed: {
    internacionActiva () {
      return this.paciente?.internaciones?.find(item => item.estado === 'Activa') || null
    },
    ventas () {
      return this.paciente?.paciente_ventas || []
    },
    totalCobros () {
      return (this.paciente?.cobros || []).reduce((sum, item) => item.anulado ? sum : sum + Number(item.total || 0), 0)
    },
    totalVentas () {
      return this.ventas.reduce((sum, item) => item.venta?.estado === 'Anulado' ? sum : sum + Number(item.venta?.total || 0), 0)
    },
  },
  mounted () {
    this.cargarResumen()
  },
  methods: {
    required: value => !!value || 'Campo requerido',
    ahoraLocal () {
      return moment().format('YYYY-MM-DDTHH:mm')
    },
    cargarResumen () {
      this.loading = true
      return this.$axios.get(`internaciones/pacientes/${this.$route.params.id}`).then(({ data }) => {
        this.paciente = data
        this.form = { fecha_inicio: this.ahoraLocal(), cama: '', observacion: '' }
      }).catch(error => this.error(error, 'No se pudo cargar la ficha del paciente'))
        .finally(() => { this.loading = false })
    },
    crearInternacion () {
      this.saving = true
      this.$axios.post('internaciones', { ...this.form, paciente_id: this.paciente.id })
        .then(() => {
          this.$alert.success('Internación creada correctamente')
          return this.cargarResumen()
        }).catch(error => this.error(error, 'No se pudo crear la internación'))
        .finally(() => { this.saving = false })
    },
    abrirFinalizacion () {
      this.fechaFinalizacion = this.ahoraLocal()
      this.dialogoFinalizar = true
    },
    finalizarInternacion () {
      if (!this.fechaFinalizacion) return this.$alert.error('Ingrese la fecha de finalización')
      this.saving = true
      this.$axios.put(`internaciones/${this.internacionActiva.id}/finalizar`, {
        fecha_finalizacion: this.fechaFinalizacion
      }).then(() => {
        this.$alert.success('Internación finalizada correctamente')
        this.dialogoFinalizar = false
        return this.cargarResumen()
      }).catch(error => this.error(error, 'No se pudo finalizar la internación'))
        .finally(() => { this.saving = false })
    },
    error (error, fallback) {
      const validation = error.response?.data?.errors
      const message = validation ? Object.values(validation).flat()[0] : error.response?.data?.message
      this.$alert.error(message || fallback)
    },
    fecha (value) {
      return value ? moment(value).format('DD/MM/YYYY HH:mm') : '-'
    },
    fechaVenta (item) {
      if (!item.venta?.fecha) return '-'
      return moment(`${item.venta.fecha} ${item.venta.hora || '00:00'}`).format('DD/MM/YYYY HH:mm')
    },
    money (value) {
      return Number(value || 0).toFixed(2)
    },
  }
}
</script>

<style scoped>
.summary-box {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #eef5fb;
  color: #174b74;
}

.patient-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px;
}

.patient-field {
  min-width: 0;
  padding: 4px 6px;
  border-radius: 5px;
  background: #f5f7f9;
  line-height: 1.15;
}

.patient-field span {
  display: block;
  color: #6b7280;
  font-size: 10px;
}

.patient-field strong {
  display: block;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.patient-field--wide {
  grid-column: 1 / -1;
}

.compact-page :deep(.q-table th),
.compact-page :deep(.q-table td) {
  height: 26px;
  padding: 2px 5px;
  font-size: 11px;
}

.compact-page :deep(.q-table__top) {
  min-height: 34px;
  padding: 4px 8px;
}

.compact-page :deep(.q-table__title) {
  font-size: 13px;
}

.compact-page :deep(.q-tab) {
  min-height: 34px;
}

@media (min-width: 600px) and (max-width: 1439px) {
  .patient-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .patient-field--wide {
    grid-column: span 2;
  }
}
</style>
