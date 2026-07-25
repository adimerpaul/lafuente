<template>
  <q-page class="q-pa-sm bg-grey-2">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-blue-grey-9 text-white q-py-sm">
        <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="$router.back()" />
        <q-icon name="inventory_2" size="sm" class="q-mr-sm" />
        <div v-if="asset">
          <div class="text-h6">{{ asset.nombre }}</div>
          <div class="text-caption text-blue-grey-1">{{ asset.codigo || 'Sin código patrimonial' }}</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="refresh" :loading="loading" @click="loadAsset" />
      </q-card-section>

      <q-card-section v-if="asset" class="q-pa-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12 col-md-4">
            <q-card flat bordered class="full-height">
              <q-img :src="assetPhoto" height="210px" fit="contain" class="bg-grey-2" />
              <q-card-section class="q-pa-sm">
                <div class="text-h6">{{ asset.nombre }}</div>
                <div class="text-caption text-grey-7">{{ asset.descripcion || 'Sin descripción' }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="full-height q-pa-sm">
              <div class="text-subtitle2 text-blue-grey-9 q-mb-sm">Información del activo</div>
              <q-list dense>
                <q-item><q-item-section><q-item-label caption>Valor de compra</q-item-label><q-item-label>{{ money(asset.valor) }} Bs</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Fecha de compra</q-item-label><q-item-label>{{ formatDate(asset.fecha_compra) }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Fin de vida útil</q-item-label><q-item-label>{{ formatDate(asset.fecha_fin) }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Depreciación mensual</q-item-label><q-item-label>{{ money(asset.depreciacion_mensual) }} Bs</q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Estado</q-item-label><q-item-label><q-badge color="positive" :label="asset.estado" /></q-item-label></q-item-section></q-item>
                <q-item><q-item-section><q-item-label caption>Registrado por</q-item-label><q-item-label>{{ asset.user?.name || 'Sistema/migración' }}</q-item-label></q-item-section></q-item>
              </q-list>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="full-height">
              <q-card-section class="bg-teal-1 q-py-sm">
                <div class="text-subtitle2 text-teal-9">Responsable actual</div>
              </q-card-section>
              <q-card-section v-if="currentAssignment" class="text-center">
                <q-avatar color="teal-9" text-color="white" icon="person" size="58px" />
                <div class="text-h6 text-primary cursor-pointer q-mt-sm" @click="openPerson(currentAssignment.funcionario)">
                  {{ currentAssignment.funcionario?.name }}
                </div>
                <div class="text-caption">{{ currentAssignment.funcionario?.role }}</div>
                <div class="q-mt-sm">Desde {{ formatDateTime(currentAssignment.fecha_asignacion) }}</div>
                <div class="text-caption">Asignado por {{ currentAssignment.asignador?.name || 'Sistema/migración' }}</div>
              </q-card-section>
              <q-card-section v-else class="text-center text-grey-6 q-py-xl">
                <q-icon name="person_off" size="42px" />
                <div>Activo sin responsable actual</div>
              </q-card-section>
              <q-separator v-if="canManage" />
              <q-card-section v-if="canManage" class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">
                  {{ currentAssignment ? 'Cambiar responsable' : 'Asignar responsable' }}
                </div>
                <q-select
                  v-model="changeForm.user_id"
                  :options="filteredStaffOptions"
                  dense outlined emit-value map-options use-input input-debounce="0"
                  @filter="filterStaff"
                  label="Nuevo funcionario"
                  class="q-mb-xs"
                />
                <q-checkbox
                  v-model="changeForm.confirmed"
                  color="orange-9"
                  :label="currentAssignment
                    ? 'Confirmo la devolución y el cambio de responsable'
                    : 'Confirmo esta asignación'"
                />
                <q-btn
                  color="orange-9" no-caps class="full-width q-mt-xs"
                  icon="swap_horiz"
                  :label="currentAssignment ? 'Cambiar funcionario' : 'Asignar funcionario'"
                  :disable="!changeForm.user_id || !changeForm.confirmed"
                  :loading="saving"
                  @click="changeResponsible"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card flat bordered>
          <q-card-section class="row items-center bg-indigo-9 text-white q-py-sm">
            <q-icon name="history" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Historial de responsables</div>
          </q-card-section>
          <q-markup-table flat dense wrap-cells>
            <thead>
              <tr>
                <th class="text-left">Funcionario</th>
                <th class="text-left">Asignado por</th>
                <th class="text-left">Entrega</th>
                <th class="text-left">Devolución recibida por</th>
                <th class="text-left">Devolución</th>
                <th class="text-center">Estado</th>
                <th class="text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in asset.asignaciones" :key="item.id">
                <td class="text-primary cursor-pointer" @click="openPerson(item.funcionario)">
                  <div class="text-weight-medium">{{ item.funcionario?.name || '-' }}</div>
                  <div class="text-caption text-grey-7">{{ item.funcionario?.role }}</div>
                </td>
                <td>{{ item.asignador?.name || 'Sistema/migración' }}</td>
                <td>{{ formatDateTime(item.fecha_asignacion) }}</td>
                <td>{{ item.receptor_devolucion?.name || '-' }}</td>
                <td>{{ formatDateTime(item.fecha_devolucion) }}</td>
                <td class="text-center"><q-badge :color="item.estado === 'Asignado' ? 'positive' : 'blue-grey'" :label="item.estado" /></td>
                <td>{{ item.observacion || '-' }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </q-card-section>
      <q-inner-loading :showing="loading" />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'ActivoDetalle',
  data () {
    return {
      loading: false,
      saving: false,
      asset: null,
      staff: [],
      filteredStaffOptions: [],
      changeForm: { user_id: null, confirmed: false }
    }
  },
  computed: {
    currentAssignment () {
      return this.asset?.asignaciones?.find(item => item.estado === 'Asignado') || null
    },
    assetPhoto () {
      return this.asset?.foto ? `${this.$url}../images/activos-fijos/${this.asset.foto}` : '/activo-fijo-default.svg'
    },
    staffOptions () {
      return this.staff
        .filter(person => person.id !== this.currentAssignment?.funcionario?.id)
        .map(person => ({ label: `${person.name} · ${person.role || 'Funcionario'}`, value: person.id }))
    },
    canManage () {
      return (this.$store.permissions || []).some(permission => permission.name === 'Activos fijos')
    }
  },
  mounted () {
    this.loadAsset()
    this.loadStaff()
  },
  methods: {
    async loadAsset () {
      this.loading = true
      try {
        const { data } = await this.$axios.get(`activos-fijos/detalle/${this.$route.params.id}`)
        this.asset = data
        this.filteredStaffOptions = this.staffOptions
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudo cargar el activo')
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
    changeResponsible () {
      if (!this.changeForm.user_id || !this.changeForm.confirmed) return
      const target = this.staff.find(person => person.id === this.changeForm.user_id)
      const source = this.currentAssignment?.funcionario?.name || 'Sin responsable'
      this.$q.dialog({
        title: 'Confirmar cambio de responsable',
        message: `Se pasará el activo "${this.asset.nombre}" de ${source} a ${target?.name || 'otro funcionario'}. El movimiento quedará guardado en el historial. ¿Desea continuar?`,
        cancel: true,
        persistent: true,
        ok: { label: 'Sí, cambiar', color: 'orange-9', noCaps: true },
        cancel: { label: 'Cancelar', flat: true, noCaps: true }
      }).onOk(() => this.performChangeResponsible())
    },
    async performChangeResponsible () {
      this.saving = true
      try {
        await this.$axios.post('activos-fijos/asignaciones-multiples', {
          activo_ids: [this.asset.id],
          user_id: this.changeForm.user_id,
          fecha_asignacion: this.nowLocalDateTime(),
          observacion: 'Cambio de responsable desde la ficha del activo.',
          reasignar: Boolean(this.currentAssignment)
        })
        this.$q.notify({ type: 'positive', message: 'Responsable actualizado correctamente' })
        this.changeForm = { user_id: null, confirmed: false }
        await Promise.all([this.loadAsset(), this.loadStaff()])
      } catch (error) {
        const validation = error.response?.data?.errors
        const firstError = validation ? Object.values(validation).flat()[0] : null
        this.$alert.error(firstError || error.response?.data?.message || 'No se pudo cambiar el responsable')
      } finally {
        this.saving = false
      }
    },
    filterStaff (value, update) {
      update(() => {
        const term = value.trim().toLowerCase()
        this.filteredStaffOptions = !term
          ? this.staffOptions
          : this.staffOptions.filter(option => option.label.toLowerCase().includes(term))
      })
    },
    nowLocalDateTime () {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      return now.toISOString().slice(0, 16)
    },
    openPerson (person) {
      if (person?.id) this.$router.push(`/activos-fijos/funcionarios/${person.id}`)
    },
    money (value) {
      return Number(value || 0).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    formatDate (value) {
      return value ? new Date(`${value}T00:00:00`).toLocaleDateString('es-BO') : '-'
    },
    formatDateTime (value) {
      if (!value) return '-'
      const date = new Date(String(value).replace(' ', 'T'))
      return Number.isNaN(date.getTime()) ? value : date.toLocaleString('es-BO')
    }
  }
}
</script>
