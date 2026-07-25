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
              <div class="col-6"><div class="summary-box"><small>Caja recepción</small><strong>Bs {{ money(totalCajaRecepcion) }}</strong></div></div>
              <div class="col-6"><div class="summary-box"><small>Ventas</small><strong>Bs {{ money(totalVentas) }}</strong></div></div>
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">Totales sin registros anulados.</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-8">
        <q-card flat bordered>
          <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary">
            <q-tab no-caps name="internaciones" icon="hotel" label="Internaciones" />
            <q-tab no-caps name="caja" icon="point_of_sale" :label="`Caja recepción (${cajasRecepcion.length})`" />
            <q-tab no-caps name="ventas" icon="shopping_cart" label="Ventas" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="internaciones" class="q-pa-sm">
              <q-banner v-if="internacionActiva" dense rounded class="bg-orange-1 text-orange-10 q-mb-sm">
                Internación activa desde {{ fecha(internacionActiva.fecha_inicio) }}, cama
                <strong>{{ internacionActiva.cama }}</strong>.
                <template #action>
                  <q-btn flat color="primary" no-caps icon="add_card" label="Agregar arancel" @click="abrirArancel(internacionActiva)" />
                  <q-btn color="negative" no-caps label="Finalizar internación" @click="abrirFinalizacion" />
                </template>
              </q-banner>

              <div v-else class="q-mb-sm">
                <q-btn color="positive" icon="add" label="Crear internación"
                       no-caps @click="abrirNuevaInternacion" />
              </div>

              <q-table flat bordered dense wrap-cells row-key="id" title="Historial de internaciones"
                       :rows="paciente.internaciones || []" :columns="internacionColumns"
                       :rows-per-page-options="[10, 20, 50]"
                       @row-click="seleccionarInternacion">
                <template #body-cell-fecha_inicio="props"><q-td :props="props">{{ fecha(props.row.fecha_inicio) }}</q-td></template>
                <template #body-cell-fecha_finalizacion="props"><q-td :props="props">{{ fecha(props.row.fecha_finalizacion) }}</q-td></template>
                <template #body-cell-created_at="props"><q-td :props="props">{{ fecha(props.row.created_at) }}</q-td></template>
                <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.estado === 'Activa' ? 'deep-orange' : 'positive'" :label="props.row.estado" /></q-td></template>
              </q-table>

              <div v-if="internacionActual" class="row items-center q-mt-sm q-mb-xs">
                <div class="text-caption text-weight-bold">
                  Internación seleccionada: cama {{ internacionActual.cama }} · {{ fecha(internacionActual.fecha_inicio) }}
                </div>
                <q-space />
                <q-btn-dropdown dense flat no-caps color="primary" icon="more_vert" label="Opciones">
                  <q-list dense>
                    <q-item clickable v-close-popup @click="abrirEditarInternacion">
                      <q-item-section avatar><q-icon name="edit" color="primary" /></q-item-section>
                      <q-item-section>Editar internación</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="eliminarInternacion">
                      <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                      <q-item-section class="text-negative">Eliminar internación</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn-dropdown dense flat no-caps color="secondary" icon="download" label="Exportar">
                  <q-list dense>
                    <q-item clickable v-close-popup @click="exportarPdf">
                      <q-item-section avatar><q-icon name="picture_as_pdf" color="negative" /></q-item-section>
                      <q-item-section>PDF</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="exportarExcel">
                      <q-item-section avatar><q-icon name="fa-solid fa-file-excel" color="positive" /></q-item-section>
                      <q-item-section>Excel</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
                <q-btn dense color="positive" no-caps icon="add_card" label="Agregar ítem" @click="abrirArancel(internacionActual)" />
              </div>
              <q-table v-if="internacionActual" flat bordered dense wrap-cells row-key="id"
                       :title="`Aranceles aplicados · Total Bs ${money(totalAranceles)}`"
                       :rows="internacionActual.aranceles_aplicados || []" :columns="aplicadoColumns"
                       :rows-per-page-options="[10, 20, 50]">
                <template #body-cell-fecha="props"><q-td :props="props">{{ fecha(props.row.fecha_hora) }}</q-td></template>
                <template #body-cell-precio="props"><q-td :props="props">Bs {{ money(props.row.precio_unitario) }}</q-td></template>
                <template #body-cell-total="props"><q-td :props="props">Bs {{ money(props.row.total) }}</q-td></template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="caja" class="q-pa-sm">
              <q-table flat bordered dense wrap-cells row-key="id" :rows="cajasRecepcion"
                       :columns="cajaColumns" :rows-per-page-options="[10, 20, 50]">
                <template #body-cell-fecha="props"><q-td :props="props">{{ fechaCaja(props.row) }}</q-td></template>
                <template #body-cell-pago="props">
                  <q-td :props="props">
                    <q-chip v-if="Number(props.row.efectivo) > 0" dense color="green-1" text-color="green-9">
                      Efectivo Bs {{ money(props.row.efectivo) }}
                    </q-chip>
                    <q-chip v-if="Number(props.row.qr) > 0" dense color="indigo-1" text-color="indigo-9">
                      QR Bs {{ money(props.row.qr) }}
                    </q-chip>
                  </q-td>
                </template>
                <template #body-cell-total="props"><q-td :props="props">Bs {{ money(props.row.recaudado_total) }}</q-td></template>
                <template #body-cell-estado="props"><q-td :props="props"><q-badge :color="props.row.is_anulado ? 'negative' : 'positive'" :label="props.row.estado_label" /></q-td></template>
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

    <q-dialog v-model="dialogoNueva" persistent>
      <q-card style="width: 520px; max-width: 95vw">
        <q-form @submit="crearInternacion">
          <q-card-section class="row items-center q-pb-sm">
            <div>
              <div class="text-subtitle1 text-weight-bold">Crear internación</div>
              <div class="text-caption text-grey-7">{{ paciente?.nombre_completo }}</div>
            </div>
            <q-space />
            <q-btn flat round dense icon="close" @click="dialogoNueva = false" />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-sm">
            <q-input v-model="form.fecha_inicio" outlined dense type="datetime-local"
                     label="Fecha y hora de inicio *" :rules="[required]" />
            <q-input v-model.trim="form.cama" outlined dense label="Cama *"
                     maxlength="100" :rules="[required]" />
            <q-input v-model="form.observacion" outlined dense type="textarea" autogrow
                     label="Observación" maxlength="1000" />
          </q-card-section>
          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps label="Cancelar" @click="dialogoNueva = false" />
            <q-btn type="submit" color="positive" no-caps icon="save"
                   label="Guardar internación" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogoArancel" persistent>
      <q-card style="width: 560px; max-width: 95vw">
        <q-form @submit="aplicarArancel">
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-bold">Agregar arancel</div>
            <q-space /><q-btn flat round dense icon="close" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="q-gutter-sm">
            <q-select v-model="arancelForm.arancel" :options="arancelOptions" outlined dense use-input
                      input-debounce="200" label="Arancel *" @filter="filtrarAranceles"
                      :rules="[required]" @update:model-value="seleccionarArancel">
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.tipo }} · {{ scope.opt.precio === null ? 'Precio manual' : `Bs ${money(scope.opt.precio)}` }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div class="row q-col-gutter-sm">
              <div class="col-6"><q-input v-model.number="arancelForm.cantidad" outlined dense type="number" min="0.01" step="0.01" label="Cantidad *" :rules="[required]" /></div>
              <div class="col-6"><q-input v-model.number="arancelForm.precio_unitario" outlined dense type="number" min="0" step="0.01" label="Precio unitario Bs *" :rules="[required]" /></div>
            </div>
            <q-input v-model="arancelForm.observacion" outlined dense label="Observación" />
            <q-banner dense class="bg-blue-1 text-blue-9">
              Total: <strong>Bs {{ money(Number(arancelForm.cantidad || 0) * Number(arancelForm.precio_unitario || 0)) }}</strong>
            </q-banner>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat no-caps label="Cancelar" v-close-popup />
            <q-btn type="submit" color="primary" no-caps icon="save" label="Aplicar arancel" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogoEditar" persistent>
      <q-card style="width: 540px; max-width: 95vw">
        <q-form @submit="guardarInternacion">
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-bold">Editar internación</div>
            <q-space /><q-btn flat round dense icon="close" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6"><q-input v-model="editForm.fecha_inicio" outlined dense type="datetime-local" label="Fecha y hora de inicio *" :rules="[required]" /></div>
            <div class="col-12 col-sm-6"><q-input v-model="editForm.fecha_finalizacion" outlined dense type="datetime-local" label="Fecha y hora de finalización" /></div>
            <div class="col-12"><q-input v-model.trim="editForm.cama" outlined dense label="Cama *" :rules="[required]" /></div>
            <div class="col-12"><q-input v-model="editForm.observacion" outlined dense type="textarea" autogrow label="Observación" /></div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat no-caps label="Cancelar" v-close-popup />
            <q-btn type="submit" color="primary" no-caps icon="save" label="Guardar cambios" :loading="saving" />
          </q-card-actions>
        </q-form>
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
      dialogoNueva: false,
      dialogoArancel: false,
      dialogoEditar: false,
      dialogoFinalizar: false,
      selectedInternacionId: null,
      tab: 'internaciones',
      fechaFinalizacion: '',
      form: { fecha_inicio: '', cama: '', observacion: '' },
      aranceles: [],
      arancelOptions: [],
      arancelForm: { arancel: null, cantidad: 1, precio_unitario: null, observacion: '' },
      arancelTargetId: null,
      editForm: {},
      internacionColumns: [
        { name: 'fecha_inicio', label: 'Inicio', field: 'fecha_inicio', align: 'left' },
        { name: 'fecha_finalizacion', label: 'Finalización', field: 'fecha_finalizacion', align: 'left' },
        { name: 'cama', label: 'Cama', field: 'cama', align: 'left' },
        { name: 'dias', label: 'Días internado', field: 'dias_internado', align: 'center' },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
        { name: 'created_at', label: 'Registrada', field: 'created_at', align: 'left' },
        { name: 'usuario', label: 'Registrado por', field: row => row.user?.name || '-', align: 'left' },
        { name: 'finalizado', label: 'Finalizada por', field: row => row.finalizado_por?.name || '-', align: 'left' },
      ],
      cajaColumns: [
        { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' },
        { name: 'documento', label: 'Documento', field: 'documento_label', align: 'left' },
        { name: 'atencion', label: 'Atención', field: row => row.tipo_atencion || '-', align: 'left' },
        { name: 'pago', label: 'Forma de pago', align: 'left' },
        { name: 'total', label: 'Total', field: 'recaudado_total', align: 'right' },
        { name: 'estado', label: 'Estado', field: 'estado_label', align: 'center' },
        { name: 'usuario', label: 'Registrado por', field: row => row.user?.name || '-', align: 'left' },
      ],
      ventaColumns: [
        { name: 'fecha', label: 'Fecha', align: 'left' },
        { name: 'farmacia', label: 'Farmacia', field: row => row.venta?.farmacia_tipo || 'Farmacia', align: 'left' },
        { name: 'tipo', label: 'Tipo', field: row => row.venta?.tipo_venta || '-', align: 'left' },
        { name: 'detalle', label: 'Detalle', field: row => row.venta?.detailsText || '-', align: 'left' },
        { name: 'tipo_pago', label: 'Tipo de pago', field: row => row.venta?.tipo_pago || '-', align: 'left' },
        { name: 'total', label: 'Total', align: 'right' },
        { name: 'estado', label: 'Estado', align: 'center' },
      ],
      aplicadoColumns: [
        { name: 'fecha', label: 'Fecha y hora', field: 'fecha_hora', align: 'left' },
        { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
        { name: 'nombre', label: 'Arancel', field: 'nombre', align: 'left' },
        { name: 'tipo', label: 'Tipo', field: 'tipo_precio', align: 'left' },
        { name: 'precio', label: 'Precio', field: 'precio_unitario', align: 'right' },
        { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'right' },
        { name: 'total', label: 'Total', field: 'total', align: 'right' },
        { name: 'usuario', label: 'Usuario', field: row => row.user?.name || '-', align: 'left' },
      ],
    }
  },
  computed: {
    internacionActiva () {
      return this.paciente?.internaciones?.find(item => item.estado === 'Activa') || null
    },
    internacionActual () {
      return this.paciente?.internaciones?.find(item => item.id === this.selectedInternacionId)
        || this.internacionActiva
        || this.paciente?.internaciones?.[0]
        || null
    },
    totalAranceles () {
      return (this.internacionActual?.aranceles_aplicados || []).reduce((sum, item) => sum + Number(item.total || 0), 0)
    },
    ventas () {
      return this.paciente?.paciente_ventas || []
    },
    cajasRecepcion () {
      return this.paciente?.caja_recepciones || []
    },
    totalCajaRecepcion () {
      return this.cajasRecepcion.reduce((sum, item) => item.is_anulado ? sum : sum + Number(item.recaudado_total || 0), 0)
    },
    totalVentas () {
      return this.ventas.reduce((sum, item) => item.venta?.estado === 'Anulado' ? sum : sum + Number(item.venta?.total || 0), 0)
    },
  },
  mounted () {
    this.cargarResumen()
    this.cargarAranceles()
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
        if (!data.internaciones?.some(item => item.id === this.selectedInternacionId)) {
          this.selectedInternacionId = data.internaciones?.find(item => item.estado === 'Activa')?.id
            || data.internaciones?.[0]?.id
            || null
        }
        this.form = { fecha_inicio: this.ahoraLocal(), cama: '', observacion: '' }
      }).catch(error => this.error(error, 'No se pudo cargar la ficha del paciente'))
        .finally(() => { this.loading = false })
    },
    crearInternacion () {
      this.saving = true
      this.$axios.post('internaciones', { ...this.form, paciente_id: this.paciente.id })
        .then(() => {
          this.$alert.success('Internación creada correctamente')
          this.dialogoNueva = false
          return this.cargarResumen()
        }).catch(error => this.error(error, 'No se pudo crear la internación'))
        .finally(() => { this.saving = false })
    },
    abrirNuevaInternacion () {
      this.form = { fecha_inicio: this.ahoraLocal(), cama: '', observacion: '' }
      this.dialogoNueva = true
    },
    cargarAranceles () {
      this.$axios.get('aranceles-internacion', { params: { solo_activos: 1 } }).then(({ data }) => {
        this.aranceles = data
        this.arancelOptions = this.mapAranceles(data)
      })
    },
    mapAranceles (rows) {
      return rows.map(item => ({
        label: `${item.categoria} · ${item.nombre}`,
        value: item.id,
        precio: item.precio,
        manual: item.permite_precio_manual,
        tipo: item.tipo_precio,
      }))
    },
    filtrarAranceles (value, update) {
      update(() => {
        const text = (value || '').toLowerCase()
        this.arancelOptions = this.mapAranceles(this.aranceles.filter(item =>
          `${item.categoria} ${item.grupo || ''} ${item.nombre}`.toLowerCase().includes(text)
        ))
      })
    },
    seleccionarArancel (option) {
      this.arancelForm.precio_unitario = option?.precio
    },
    abrirArancel (internacion) {
      this.selectedInternacionId = internacion.id
      this.arancelTargetId = internacion.id
      this.arancelForm = { arancel: null, cantidad: 1, precio_unitario: null, observacion: '' }
      this.arancelOptions = this.mapAranceles(this.aranceles)
      this.dialogoArancel = true
    },
    seleccionarInternacion (_event, internacion) {
      this.selectedInternacionId = internacion.id
    },
    abrirEditarInternacion () {
      this.editForm = {
        fecha_inicio: moment(this.internacionActual.fecha_inicio).format('YYYY-MM-DDTHH:mm'),
        fecha_finalizacion: this.internacionActual.fecha_finalizacion
          ? moment(this.internacionActual.fecha_finalizacion).format('YYYY-MM-DDTHH:mm')
          : '',
        cama: this.internacionActual.cama,
        observacion: this.internacionActual.observacion || '',
      }
      this.dialogoEditar = true
    },
    guardarInternacion () {
      this.saving = true
      this.$axios.put(`internaciones/${this.internacionActual.id}`, this.editForm).then(() => {
        this.$alert.success('Internación actualizada correctamente')
        this.dialogoEditar = false
        return this.cargarResumen()
      }).catch(error => this.error(error, 'No se pudo actualizar la internación'))
        .finally(() => { this.saving = false })
    },
    aplicarArancel () {
      this.saving = true
      this.$axios.post(`internaciones/${this.arancelTargetId}/aranceles`, {
        arancel_internacion_id: this.arancelForm.arancel.value,
        cantidad: this.arancelForm.cantidad,
        precio_unitario: this.arancelForm.precio_unitario,
        observacion: this.arancelForm.observacion,
      }).then(() => {
        this.$alert.success('Arancel aplicado correctamente')
        this.dialogoArancel = false
        return this.cargarResumen()
      }).catch(error => this.error(error, 'No se pudo aplicar el arancel'))
        .finally(() => { this.saving = false })
    },
    exportarExcel () {
      this.loading = true
      this.$axios.get(`internaciones/${this.internacionActual.id}/aranceles/excel`, {
        responseType: 'blob',
      }).then(({ data }) => {
        const url = URL.createObjectURL(new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }))
        const link = document.createElement('a')
        link.href = url
        link.download = `Internacion_${this.internacionActual.id}_Aranceles.xlsx`
        link.click()
        URL.revokeObjectURL(url)
      }).catch(error => this.error(error, 'No se pudo generar el Excel'))
        .finally(() => { this.loading = false })
    },
    exportarPdf () {
      this.loading = true
      this.$axios.get(`internaciones/${this.internacionActual.id}/aranceles/pdf`, {
        responseType: 'blob',
      }).then(({ data }) => {
        const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 60000)
      }).catch(error => this.error(error, 'No se pudo generar el PDF'))
        .finally(() => { this.loading = false })
    },
    eliminarInternacion () {
      const internacion = this.internacionActual
      this.$alert.dialog(`¿Desea eliminar la internación de cama ${internacion.cama}? Esta acción conservará el historial.`).onOk(() => {
        this.loading = true
        this.$axios.delete(`internaciones/${internacion.id}`).then(({ data }) => {
          this.$alert.success(data.message || 'Internación eliminada correctamente')
          this.selectedInternacionId = null
          return this.cargarResumen()
        }).catch(error => this.error(error, 'No se pudo eliminar la internación'))
          .finally(() => { this.loading = false })
      })
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
    fechaCaja (item) {
      if (!item.fecha) return '-'
      return moment(`${item.fecha} ${item.hora || '00:00'}`).format('DD/MM/YYYY HH:mm')
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
