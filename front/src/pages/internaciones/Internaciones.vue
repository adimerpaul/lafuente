<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md">
          <div class="text-h6">Internaciones</div>
          <div class="text-caption text-grey-7">Busque un paciente para consultar sus movimientos y registrar una internación.</div>
        </div>
        <div class="col-12 col-md-5">
          <q-input
            v-model="search"
            dense
            outlined
            clearable
            debounce="400"
            label="Buscar por nombre o identificación"
            @update:model-value="buscar"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
      </q-card-section>

      <q-table
        flat
        dense
        wrap-cells
        row-key="id"
        :rows="pacientes"
        :columns="columns"
        :loading="loading"
        :rows-per-page-options="[10, 20, 50]"
        v-model:pagination="pagination"
        @request="cargarPacientes"
      >
        <template #body-cell-internacion="props">
          <q-td :props="props">
            <q-chip
              dense
              text-color="white"
              :color="props.row.internacion_activa ? 'deep-orange' : 'grey-7'"
              :label="props.row.internacion_activa ? `Internado · Cama ${props.row.internacion_activa.cama}` : 'Sin internación activa'"
            />
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              color="primary"
              dense
              flat
              no-caps
              icon="open_in_new"
              label="Abrir"
              @click="abrirPaciente(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogo" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-2">
        <q-toolbar class="bg-primary text-white">
          <q-btn flat round dense icon="close" v-close-popup />
          <q-toolbar-title>Ficha de internación · {{ paciente?.nombre_completo }}</q-toolbar-title>
          <q-chip v-if="internacionActiva" color="deep-orange" text-color="white" icon="hotel">
            Cama {{ internacionActiva.cama }} · {{ internacionActiva.dias_internado }} día(s)
          </q-chip>
        </q-toolbar>

        <q-inner-loading :showing="detalleLoading" label="Cargando ficha..." />

        <div v-if="paciente" class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-lg-3">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle1 text-weight-bold">{{ paciente.nombre_completo }}</div>
                  <q-list dense separator class="q-mt-sm">
                    <q-item><q-item-section caption>Identificación</q-item-section><q-item-section side>{{ paciente.identificacion || '-' }}</q-item-section></q-item>
                    <q-item><q-item-section caption>Edad</q-item-section><q-item-section side>{{ paciente.edad || '-' }}</q-item-section></q-item>
                    <q-item><q-item-section caption>Sexo</q-item-section><q-item-section side>{{ paciente.sexo || '-' }}</q-item-section></q-item>
                    <q-item><q-item-section caption>Teléfono</q-item-section><q-item-section side>{{ paciente.telefono || '-' }}</q-item-section></q-item>
                    <q-item><q-item-section caption>Dirección</q-item-section><q-item-section side>{{ paciente.direccion || '-' }}</q-item-section></q-item>
                  </q-list>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="q-mt-md">
                <q-card-section>
                  <div class="text-subtitle2">Resumen financiero</div>
                  <div class="row q-col-gutter-sm q-mt-xs">
                    <div class="col-6"><div class="summary-box"><small>Cobros</small><strong>Bs {{ money(totalCobros) }}</strong></div></div>
                    <div class="col-6"><div class="summary-box"><small>Ventas</small><strong>Bs {{ money(totalVentas) }}</strong></div></div>
                  </div>
                  <div class="text-caption text-grey-7 q-mt-sm">Los totales excluyen registros anulados.</div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-lg-9">
              <q-card flat bordered>
                <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary">
                  <q-tab name="internaciones" icon="hotel" label="Internaciones" />
                  <q-tab name="cobros" icon="payments" label="Cobros" />
                  <q-tab name="ventas" icon="shopping_cart" label="Ventas" />
                </q-tabs>
                <q-separator />

                <q-tab-panels v-model="tab" animated>
                  <q-tab-panel name="internaciones">
                    <q-banner v-if="internacionActiva" rounded class="bg-orange-1 text-orange-10 q-mb-md">
                      Internación activa desde {{ fecha(internacionActiva.fecha_inicio) }}, cama
                      <strong>{{ internacionActiva.cama }}</strong>.
                      <template #action>
                        <q-btn color="negative" no-caps label="Finalizar internación" @click="abrirFinalizacion" />
                      </template>
                    </q-banner>

                    <q-form v-else class="row q-col-gutter-sm q-mb-lg" @submit="crearInternacion">
                      <div class="col-12 text-subtitle2">Nueva internación</div>
                      <div class="col-12 col-md-4">
                        <q-input v-model="form.fecha_inicio" outlined dense type="datetime-local" label="Fecha y hora de inicio *" :rules="[required]" />
                      </div>
                      <div class="col-12 col-md-3">
                        <q-input v-model.trim="form.cama" outlined dense label="Cama *" maxlength="100" :rules="[required]" />
                      </div>
                      <div class="col-12 col-md">
                        <q-input v-model="form.observacion" outlined dense label="Observación" maxlength="1000" />
                      </div>
                      <div class="col-12 col-md-auto">
                        <q-btn type="submit" color="positive" icon="add" label="Crear internación" no-caps :loading="saving" />
                      </div>
                    </q-form>

                    <q-table
                      flat bordered dense wrap-cells
                      row-key="id"
                      title="Historial de internaciones"
                      :rows="paciente.internaciones || []"
                      :columns="internacionColumns"
                      :rows-per-page-options="[10, 20, 50]"
                    >
                      <template #body-cell-fecha_inicio="props"><q-td :props="props">{{ fecha(props.row.fecha_inicio) }}</q-td></template>
                      <template #body-cell-fecha_finalizacion="props"><q-td :props="props">{{ fecha(props.row.fecha_finalizacion) }}</q-td></template>
                      <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.estado === 'Activa' ? 'deep-orange' : 'positive'" :label="props.row.estado" /></q-td></template>
                    </q-table>
                  </q-tab-panel>

                  <q-tab-panel name="cobros">
                    <q-table flat bordered dense wrap-cells row-key="id" :rows="paciente.cobros || []" :columns="cobroColumns" :rows-per-page-options="[10, 20, 50]">
                      <template #body-cell-fecha="props"><q-td :props="props">{{ fecha(props.row.fecha) }}</q-td></template>
                      <template #body-cell-total="props"><q-td :props="props">Bs {{ money(props.row.total) }}</q-td></template>
                      <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.anulado ? 'negative' : props.row.pagado ? 'positive' : 'warning'" :label="props.row.anulado ? 'Anulado' : props.row.pagado ? 'Pagado' : 'Pendiente'" /></q-td></template>
                    </q-table>
                  </q-tab-panel>

                  <q-tab-panel name="ventas">
                    <q-table flat bordered dense wrap-cells row-key="id" :rows="ventas" :columns="ventaColumns" :rows-per-page-options="[10, 20, 50]">
                      <template #body-cell-fecha="props"><q-td :props="props">{{ fechaVenta(props.row) }}</q-td></template>
                      <template #body-cell-total="props"><q-td :props="props">Bs {{ money(props.row.venta?.total) }}</q-td></template>
                      <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.venta?.estado === 'Anulado' ? 'negative' : 'positive'" :label="props.row.venta?.estado || '-'" /></q-td></template>
                    </q-table>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogoFinalizar" persistent>
      <q-card style="min-width: 360px">
        <q-card-section class="text-h6">Finalizar internación</q-card-section>
        <q-card-section>
          <q-input v-model="fechaFinalizacion" outlined type="datetime-local" label="Fecha y hora de finalización" />
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
  name: 'InternacionesPage',
  data () {
    return {
      pacientes: [],
      paciente: null,
      search: '',
      loading: false,
      detalleLoading: false,
      saving: false,
      dialogo: false,
      dialogoFinalizar: false,
      tab: 'internaciones',
      fechaFinalizacion: '',
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: null, descending: false },
      form: { fecha_inicio: '', cama: '', observacion: '' },
      columns: [
        { name: 'nombre', label: 'Paciente', field: 'nombre_completo', align: 'left' },
        { name: 'identificacion', label: 'Identificación', field: 'identificacion', align: 'left' },
        { name: 'edad', label: 'Edad', field: 'edad', align: 'center' },
        { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
        { name: 'internacion', label: 'Estado', field: 'internacion_activa', align: 'left' },
        { name: 'acciones', label: '', align: 'right' },
      ],
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
    this.cargarPacientes({ pagination: this.pagination })
  },
  methods: {
    required: value => !!value || 'Campo requerido',
    ahoraLocal () {
      return moment().format('YYYY-MM-DDTHH:mm')
    },
    buscar () {
      this.pagination.page = 1
      this.cargarPacientes({ pagination: this.pagination })
    },
    cargarPacientes ({ pagination }) {
      this.loading = true
      this.$axios.get('internaciones/pacientes', {
        params: { search: this.search, page: pagination.page, per_page: pagination.rowsPerPage }
      }).then(({ data }) => {
        this.pacientes = data.data
        this.pagination = { ...pagination, page: data.current_page, rowsPerPage: data.per_page, rowsNumber: data.total }
      }).catch(error => this.error(error, 'No se pudo cargar la lista de pacientes'))
        .finally(() => { this.loading = false })
    },
    abrirPaciente (paciente) {
      this.paciente = paciente
      this.dialogo = true
      this.tab = 'internaciones'
      this.cargarResumen(paciente.id)
    },
    cargarResumen (id) {
      this.detalleLoading = true
      return this.$axios.get(`internaciones/pacientes/${id}`).then(({ data }) => {
        this.paciente = data
        this.form = { fecha_inicio: this.ahoraLocal(), cama: '', observacion: '' }
      }).catch(error => this.error(error, 'No se pudo cargar la ficha del paciente'))
        .finally(() => { this.detalleLoading = false })
    },
    crearInternacion () {
      this.saving = true
      this.$axios.post('internaciones', { ...this.form, paciente_id: this.paciente.id })
        .then(() => {
          this.$alert.success('Internación creada correctamente')
          return Promise.all([this.cargarResumen(this.paciente.id), this.cargarPacientes({ pagination: this.pagination })])
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
      this.$axios.put(`internaciones/${this.internacionActiva.id}/finalizar`, { fecha_finalizacion: this.fechaFinalizacion })
        .then(() => {
          this.$alert.success('Internación finalizada correctamente')
          this.dialogoFinalizar = false
          return Promise.all([this.cargarResumen(this.paciente.id), this.cargarPacientes({ pagination: this.pagination })])
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
  gap: 4px;
  padding: 10px;
  border-radius: 8px;
  background: #eef5fb;
  color: #174b74;
}
</style>
