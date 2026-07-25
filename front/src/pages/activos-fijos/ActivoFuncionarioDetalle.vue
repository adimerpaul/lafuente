<template>
  <q-page class="q-pa-sm bg-grey-2">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-indigo-9 text-white q-py-sm">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="$router.push('/activos-fijos/funcionarios')" />
        <q-avatar color="white" text-color="indigo-9" icon="person" class="q-mr-sm" />
        <div v-if="person">
          <div class="text-h6">{{ person.name }}</div>
          <div class="text-caption text-indigo-1">{{ person.role || 'Funcionario' }}</div>
        </div>
        <q-space />
        <q-btn flat dense no-caps icon="picture_as_pdf" label="PDF" :loading="exportingPdf" @click="exportFile('pdf')" />
        <q-btn flat dense no-caps icon="table_view" label="Excel" :loading="exportingExcel" @click="exportFile('excel')" />
        <q-btn flat round dense icon="refresh" :loading="loading" @click="loadPerson" />
      </q-card-section>

      <q-card-section v-if="person" class="q-pa-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-pa-sm full-height">
              <div class="text-subtitle2 text-indigo-9 q-mb-sm">Información del funcionario</div>
              <q-list dense>
                <q-item>
                  <q-item-section avatar><q-icon name="badge" /></q-item-section>
                  <q-item-section><q-item-label caption>Nombre</q-item-label><q-item-label>{{ person.name }}</q-item-label></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="account_circle" /></q-item-section>
                  <q-item-section><q-item-label caption>Usuario</q-item-label><q-item-label>{{ person.username || '-' }}</q-item-label></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="work" /></q-item-section>
                  <q-item-section><q-item-label caption>Cargo</q-item-label><q-item-label>{{ person.role || '-' }}</q-item-label></q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar><q-icon name="email" /></q-item-section>
                  <q-item-section><q-item-label caption>Correo</q-item-label><q-item-label>{{ person.email || '-' }}</q-item-label></q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <div class="col-12 col-md-8">
            <q-card flat bordered class="full-height">
              <q-card-section class="row items-center q-py-sm bg-teal-1">
                <q-icon name="inventory_2" color="teal-9" class="q-mr-sm" />
                <div class="text-subtitle1 text-weight-bold">Activos actualmente a su cargo</div>
                <q-space />
                <q-btn
                  v-if="canManage"
                  dense flat no-caps color="teal-9" icon="swap_horiz"
                  :label="`Transferir (${selectedAssignmentIds.length})`"
                  :disable="!selectedAssignmentIds.length"
                  @click="openTransfer"
                />
                <q-badge color="teal-9" :label="person.activos_actuales.length" />
              </q-card-section>
              <q-list separator>
                <q-item v-for="item in person.activos_actuales" :key="item.id" clickable @click="openAsset(item.activo_fijo)">
                  <q-item-section v-if="canManage" side>
                    <q-checkbox
                      :model-value="selectedAssignmentIds.includes(item.id)"
                      color="teal-9"
                      @click.stop
                      @update:model-value="toggleAssignment(item.id, $event)"
                    />
                  </q-item-section>
                  <q-item-section avatar>
                    <q-img :src="assetPhoto(item.activo_fijo)" width="58px" height="48px" fit="cover" class="rounded-borders" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ item.activo_fijo?.nombre }}</q-item-label>
                    <q-item-label caption>{{ item.activo_fijo?.codigo || 'Sin código' }}</q-item-label>
                    <q-item-label caption>Asignado por <b>{{ item.asignador?.name || 'Sistema/migración' }}</b></q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label>{{ formatDateTime(item.fecha_asignacion) }}</q-item-label>
                    <q-badge color="positive" label="Asignado" />
                  </q-item-section>
                </q-item>
                <q-item v-if="!person.activos_actuales.length">
                  <q-item-section class="text-center text-grey-6 q-py-lg">No tiene activos asignados actualmente.</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>

        <q-card flat bordered>
          <q-card-section class="row items-center q-py-sm bg-blue-grey-8 text-white">
            <q-icon name="history" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Historial de asignaciones</div>
          </q-card-section>
          <q-markup-table flat dense wrap-cells>
            <thead>
              <tr>
                <th class="text-left">Activo</th>
                <th class="text-left">Asignado por</th>
                <th class="text-left">Fecha de entrega</th>
                <th class="text-left">Devolución recibida por</th>
                <th class="text-left">Fecha devolución</th>
                <th class="text-center">Estado</th>
                <th class="text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in person.historial" :key="item.id">
                <td class="cursor-pointer text-primary" @click="openAsset(item.activo_fijo)">
                  <div class="text-weight-medium">{{ item.activo_fijo?.nombre }}</div>
                  <div class="text-caption text-grey-7">{{ item.activo_fijo?.codigo || 'Sin código' }}</div>
                </td>
                <td>{{ item.asignador?.name || 'Sistema/migración' }}</td>
                <td>{{ formatDateTime(item.fecha_asignacion) }}</td>
                <td>{{ item.receptor_devolucion?.name || '-' }}</td>
                <td>{{ formatDateTime(item.fecha_devolucion) }}</td>
                <td class="text-center">
                  <q-badge :color="item.estado === 'Asignado' ? 'positive' : 'blue-grey'" :label="item.estado" />
                </td>
                <td>{{ item.observacion || '-' }}</td>
              </tr>
              <tr v-if="!person.historial.length">
                <td colspan="7" class="text-center text-grey-6 q-pa-lg">Todavía no existen asignaciones.</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </q-card-section>
      <q-inner-loading :showing="loading" />
    </q-card>

    <q-dialog v-model="transferDialog" persistent>
      <q-card style="width: 92vw; max-width: 620px">
        <q-card-section class="row items-center bg-orange-9 text-white q-py-sm">
          <q-icon name="swap_horiz" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">Transferir activos</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup :disable="saving" />
        </q-card-section>
        <q-card-section>
          <q-banner dense class="bg-orange-1 text-orange-10 rounded-borders q-mb-sm">
            Se transferirán <b>{{ selectedAssignmentIds.length }} activos</b> de
            <b>{{ person?.name }}</b> al nuevo responsable.
          </q-banner>
          <q-select
            v-model="transferForm.user_id"
            :options="filteredStaffOptions"
            dense outlined emit-value map-options use-input input-debounce="0"
            @filter="filterStaff"
            label="Nuevo funcionario *"
            class="q-mb-sm"
          />
          <q-input
            v-model="transferForm.fecha_asignacion"
            dense outlined type="datetime-local"
            label="Fecha y hora del cambio *"
            class="q-mb-sm"
          />
          <q-input v-model="transferForm.observacion" dense outlined autogrow label="Motivo u observación" />
          <q-checkbox
            v-model="transferForm.confirmed"
            color="orange-9"
            label="Confirmo la devolución y transferencia de los activos seleccionados"
            class="q-mt-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup :disable="saving" />
          <q-btn
            color="orange-9" no-caps icon="swap_horiz" label="Transferir activos"
            :disable="!transferForm.user_id || !transferForm.confirmed"
            :loading="saving"
            @click="transferAssets"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'ActivoFuncionarioDetalle',

  data () {
    return {
      loading: false,
      saving: false,
      exportingPdf: false,
      exportingExcel: false,
      person: null,
      staff: [],
      filteredStaffOptions: [],
      selectedAssignmentIds: [],
      transferDialog: false,
      transferForm: {
        user_id: null,
        fecha_asignacion: '',
        observacion: '',
        confirmed: false
      }
    }
  },

  computed: {
    canManage () {
      return (this.$store.permissions || []).some(permission => permission.name === 'Activos fijos')
    },
    staffOptions () {
      return this.staff
        .filter(person => person.id !== this.person?.id)
        .map(person => ({ label: `${person.name} · ${person.role || 'Funcionario'}`, value: person.id }))
    }
  },

  mounted () {
    this.loadPerson()
    this.loadStaff()
  },

  methods: {
    async loadPerson () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`activos-fijos/funcionarios/${this.$route.params.id}`)
        this.person = data
        const currentIds = new Set(data.activos_actuales.map(item => item.id))
        this.selectedAssignmentIds = this.selectedAssignmentIds.filter(id => currentIds.has(id))
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudo cargar la información del funcionario')
      } finally {
        this.loading = false
      }
    },
    async loadStaff () {
      try {
        const { data } = await this.$axios.get('activos-fijos/funcionarios')
        this.staff = data
        this.filteredStaffOptions = this.staffOptions
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudieron cargar los funcionarios')
      }
    },
    toggleAssignment (assignmentId, checked) {
      if (checked) {
        if (!this.selectedAssignmentIds.includes(assignmentId)) this.selectedAssignmentIds.push(assignmentId)
        return
      }
      this.selectedAssignmentIds = this.selectedAssignmentIds.filter(id => id !== assignmentId)
    },
    filterStaff (value, update) {
      update(() => {
        const term = value.trim().toLowerCase()
        this.filteredStaffOptions = !term
          ? this.staffOptions
          : this.staffOptions.filter(option => option.label.toLowerCase().includes(term))
      })
    },
    openTransfer () {
      this.filteredStaffOptions = this.staffOptions
      this.transferForm = {
        user_id: null,
        fecha_asignacion: this.nowLocalDateTime(),
        observacion: '',
        confirmed: false
      }
      this.transferDialog = true
    },
    transferAssets () {
      if (!this.transferForm.user_id || !this.transferForm.confirmed) return
      const target = this.staff.find(person => person.id === this.transferForm.user_id)
      this.$q.dialog({
        title: 'Confirmar transferencia',
        message: `Se pasarán ${this.selectedAssignmentIds.length} activo(s) de ${this.person.name} a ${target?.name || 'otro funcionario'}. El movimiento quedará guardado en el historial. ¿Desea continuar?`,
        cancel: true,
        persistent: true,
        ok: { label: 'Sí, transferir', color: 'orange-9', noCaps: true },
        cancel: { label: 'Cancelar', flat: true, noCaps: true }
      }).onOk(() => this.performTransferAssets())
    },
    async performTransferAssets () {
      const selected = this.person.activos_actuales
        .filter(item => this.selectedAssignmentIds.includes(item.id))
        .map(item => item.activo_fijo.id)
      if (!selected.length) return

      this.saving = true
      try {
        const { data } = await this.$axios.post('activos-fijos/asignaciones-multiples', {
          activo_ids: selected,
          user_id: this.transferForm.user_id,
          fecha_asignacion: this.transferForm.fecha_asignacion,
          observacion: this.transferForm.observacion || `Transferido desde ${this.person.name}.`,
          reasignar: true
        })
        this.$q.notify({ type: 'positive', message: data.message })
        this.transferDialog = false
        this.selectedAssignmentIds = []
        await Promise.all([this.loadPerson(), this.loadStaff()])
      } catch (error) {
        const validation = error.response?.data?.errors
        const firstError = validation ? Object.values(validation).flat()[0] : null
        this.$alert.error(firstError || error.response?.data?.message || 'No se pudieron transferir los activos')
      } finally {
        this.saving = false
      }
    },
    async exportFile (type) {
      const loadingKey = type === 'pdf' ? 'exportingPdf' : 'exportingExcel'
      this[loadingKey] = true
      try {
        const response = await this.$axios.get(
          `activos-fijos/funcionarios/${this.$route.params.id}/${type}`,
          { responseType: 'blob' }
        )
        const disposition = response.headers['content-disposition'] || ''
        const match = disposition.match(/filename="?([^";]+)"?/i)
        const extension = type === 'pdf' ? 'pdf' : 'xlsx'
        const fileName = match ? decodeURIComponent(match[1]) : `activos_${this.person.id}.${extension}`
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        this.$alert.error(error.response?.data?.message || `No se pudo generar el ${type.toUpperCase()}`)
      } finally {
        this[loadingKey] = false
      }
    },
    nowLocalDateTime () {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      return now.toISOString().slice(0, 16)
    },
    assetPhoto (asset) {
      return asset?.foto ? `${this.$url}../images/activos-fijos/${asset.foto}` : '/activo-fijo-default.svg'
    },
    openAsset (asset) {
      if (asset?.id) this.$router.push(`/activos-fijos/detalle/${asset.id}`)
    },
    formatDateTime (value) {
      if (!value) return '-'
      const date = new Date(String(value).replace(' ', 'T'))
      return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-BO')
    }
  }
}
</script>
