<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-teal-8 text-white q-py-sm">
        <q-icon name="receipt_long" size="sm" class="q-mr-sm" />
        <div class="text-h6">Costos de atención</div>
        <q-space />
        <q-btn flat round dense icon="add_circle_outline" color="white" @click="openNew" label="Nuevo" no-caps class="q-mr-xs" />
        <q-btn flat round dense icon="refresh" color="white" @click="costosGet" :loading="loading" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12 col-md-4">
            <q-input v-model="search" dense outlined clearable label="Buscar" @update:model-value="costosGet">
              <template #append><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filterCategoria"
              :options="['Todas', ...categorias]"
              dense outlined clearable label="Categoría"
              @update:model-value="costosGet"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <template v-for="grupo in costosAgrupados" :key="grupo.categoria">
            <div class="col-12">
              <div class="categoria-header q-mb-xs" :style="{ borderLeftColor: categoriaColor(grupo.categoria) }">
                <q-icon :name="categoriaIcono(grupo.categoria)" :color="categoriaColorName(grupo.categoria)" size="xs" class="q-mr-xs" />
                <span class="text-weight-bold text-subtitle2">{{ grupo.categoria }}</span>
                <q-badge :color="categoriaColorName(grupo.categoria)" class="q-ml-sm">{{ grupo.items.length }}</q-badge>
              </div>
              <div class="row q-col-gutter-xs">
                <div v-for="costo in grupo.items" :key="costo.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-card flat bordered class="costo-card cursor-pointer" @click="openEdit(costo)">
                    <q-card-section class="q-pa-sm">
                      <div class="row items-center no-wrap">
                        <div class="costo-icon q-mr-sm" :style="{ background: hexColor(costo.color) }">
                          <q-icon :name="costo.icono || 'payments'" color="white" size="xs" />
                        </div>
                        <div class="col">
                          <div class="text-caption text-weight-bold ellipsis" style="max-width:170px">{{ costo.nombre }}</div>
                          <div class="row items-center q-mt-xs" style="gap:4px">
                            <q-badge v-for="ar in costo.aranceles" :key="ar.id" color="blue-grey-3" text-color="blue-grey-9" class="text-caption">
                              {{ ar.nombre }}
                            </q-badge>
                            <span v-if="!costo.aranceles?.length" class="text-grey-5 text-caption">Sin aranceles</span>
                          </div>
                        </div>
                        <div class="col-auto">
                          <q-btn flat round dense icon="delete" color="negative" size="xs" @click.stop="deleteCosto(costo)" />
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
          </template>
          <div v-if="!loading && !costos.length" class="col-12 text-center text-grey-6 q-py-xl">
            No hay costos registrados
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog" persistent>
      <q-card style="min-width: 560px; max-width: 95vw;">
        <q-card-section class="row items-center bg-teal-8 text-white q-py-sm">
          <q-icon name="receipt_long" class="q-mr-sm" />
          <div class="text-subtitle1">{{ editItem ? 'Editar costo' : 'Nuevo costo' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" color="white" @click="closeDialog" />
        </q-card-section>

        <q-card-section>
          <q-form @submit="save" ref="formRef">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="form.nombre" label="Nombre *" dense outlined :rules="[v => !!v || 'Requerido']" />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.categoria"
                  :options="categorias"
                  label="Categoría"
                  dense outlined clearable
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="form.icono" label="Ícono (Material)" dense outlined>
                  <template #prepend>
                    <q-icon :name="form.icono || 'payments'" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.color"
                  :options="colorOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Color"
                  dense outlined
                >
                  <template #selected-item="scope">
                    <div class="row items-center no-wrap">
                      <div class="color-dot q-mr-xs" :style="{ background: hexColor(scope.opt.value) }" />
                      {{ scope.opt.label }}
                    </div>
                  </template>
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <div class="color-dot" :style="{ background: hexColor(scope.opt.value) }" />
                      </q-item-section>
                      <q-item-section>{{ scope.opt.label }}</q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model.number="form.orden" type="number" label="Orden" dense outlined min="0" />
              </div>
              <div class="col-12">
                <div class="text-caption text-weight-medium q-mb-xs">Aranceles relacionados</div>
                <q-card flat bordered class="q-pa-sm">
                  <div class="row q-col-gutter-xs">
                    <div v-for="arancel in aranceles" :key="arancel.id" class="col-12 col-sm-6 col-md-4">
                      <q-checkbox
                        v-model="form.arancel_ids"
                        :val="arancel.id"
                        :label="`${arancel.nombre} (${arancel.precio} Bs)`"
                        dense
                        class="text-caption"
                      />
                    </div>
                  </div>
                  <div v-if="!aranceles.length" class="text-grey-5 text-caption">No hay aranceles disponibles</div>
                </q-card>
              </div>
              <div class="col-12">
                <q-toggle v-model="form.activo" label="Activo" color="positive" />
              </div>
            </div>
            <div class="text-right q-mt-md">
              <q-btn flat label="Cancelar" no-caps @click="closeDialog" :disable="saving" />
              <q-btn color="teal-8" label="Guardar" type="submit" no-caps icon="save" class="q-ml-sm" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
const CATEGORIAS_META = {
  'Atención médica':  { icono: 'medical_services', color: 'indigo',    hex: '#3f51b5' },
  'Enfermería':       { icono: 'vaccines',          color: 'pink-6',   hex: '#e91e63' },
  'Insumos':          { icono: 'sanitizer',          color: 'teal-7',   hex: '#00796b' },
  'Laboratorio':      { icono: 'science',            color: 'blue-7',   hex: '#1976d2' },
  'Ecografía':        { icono: 'pregnant_woman',     color: 'purple-6', hex: '#9c27b0' },
  'Consultorio':      { icono: 'door_front',         color: 'brown-6',  hex: '#795548' },
  'Farmacia':         { icono: 'local_pharmacy',     color: 'green-7',  hex: '#388e3c' },
  'Tomografía':       { icono: 'biotech',            color: 'deep-purple-6', hex: '#673ab7' },
  'Fisioterapia':     { icono: 'directions_run',     color: 'orange-7', hex: '#f57c00' },
  'Odontología':      { icono: 'dentistry',          color: 'cyan-7',   hex: '#0097a7' },
}

const COLOR_OPTIONS = [
  { label: 'Índigo',        value: 'indigo' },
  { label: 'Rosa',          value: 'pink-6' },
  { label: 'Teal',          value: 'teal-7' },
  { label: 'Azul',          value: 'blue-7' },
  { label: 'Morado',        value: 'purple-6' },
  { label: 'Marrón',        value: 'brown-6' },
  { label: 'Verde',         value: 'green-7' },
  { label: 'Lila',          value: 'deep-purple-6' },
  { label: 'Naranja',       value: 'orange-7' },
  { label: 'Cyan',          value: 'cyan-7' },
  { label: 'Rojo',          value: 'red-6' },
  { label: 'Gris',          value: 'grey-7' },
]

const QUASAR_TO_HEX = {
  'indigo': '#3f51b5', 'pink-6': '#e91e63', 'teal-7': '#00796b',
  'blue-7': '#1976d2', 'purple-6': '#9c27b0', 'brown-6': '#795548',
  'green-7': '#388e3c', 'deep-purple-6': '#673ab7', 'orange-7': '#f57c00',
  'cyan-7': '#0097a7', 'red-6': '#e53935', 'grey-7': '#616161',
  'primary': '#1976d2',
}

const emptyForm = () => ({
  nombre: '',
  categoria: null,
  icono: 'payments',
  color: 'indigo',
  activo: true,
  orden: 0,
  arancel_ids: [],
})

export default {
  name: 'CostosPage',
  data () {
    return {
      loading: false,
      saving: false,
      dialog: false,
      editItem: null,
      search: '',
      filterCategoria: null,
      costos: [],
      aranceles: [],
      form: emptyForm(),
      categorias: Object.keys(CATEGORIAS_META),
      colorOptions: COLOR_OPTIONS,
    }
  },
  computed: {
    costosAgrupados () {
      const filtrados = this.costos.filter(c => {
        const matchSearch = !this.search || c.nombre.toLowerCase().includes(this.search.toLowerCase())
        const matchCat = !this.filterCategoria || this.filterCategoria === 'Todas' || c.categoria === this.filterCategoria
        return matchSearch && matchCat
      })
      const grupos = {}
      filtrados.forEach(c => {
        const cat = c.categoria || 'Sin categoría'
        if (!grupos[cat]) grupos[cat] = []
        grupos[cat].push(c)
      })
      return Object.entries(grupos).map(([categoria, items]) => ({ categoria, items }))
    }
  },
  mounted () {
    this.costosGet()
    this.arancelesGet()
  },
  methods: {
    hexColor (color) {
      return QUASAR_TO_HEX[color] || color || '#616161'
    },
    categoriaColor (cat) {
      return CATEGORIAS_META[cat]?.hex || '#616161'
    },
    categoriaColorName (cat) {
      return CATEGORIAS_META[cat]?.color || 'grey-7'
    },
    categoriaIcono (cat) {
      return CATEGORIAS_META[cat]?.icono || 'payments'
    },
    costosGet () {
      this.loading = true
      this.$axios.get('costos').then(res => {
        this.costos = res.data || []
      }).catch(() => {
        this.$alert.error('No se pudieron cargar los costos')
      }).finally(() => {
        this.loading = false
      })
    },
    arancelesGet () {
      this.$axios.get('aranceles').then(res => {
        this.aranceles = res.data || []
      }).catch(() => {})
    },
    openNew () {
      this.editItem = null
      this.form = emptyForm()
      this.dialog = true
    },
    openEdit (costo) {
      this.editItem = costo
      this.form = {
        nombre: costo.nombre,
        categoria: costo.categoria,
        icono: costo.icono || 'payments',
        color: costo.color || 'indigo',
        activo: costo.activo !== false,
        orden: costo.orden || 0,
        arancel_ids: (costo.aranceles || []).map(a => a.id),
      }
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
      this.editItem = null
    },
    save () {
      this.saving = true
      const payload = { ...this.form }
      const req = this.editItem
        ? this.$axios.put(`costos/${this.editItem.id}`, payload)
        : this.$axios.post('costos', payload)

      req.then(res => {
        if (this.editItem) {
          const idx = this.costos.findIndex(c => c.id === this.editItem.id)
          if (idx !== -1) this.costos.splice(idx, 1, res.data)
        } else {
          this.costos.unshift(res.data)
        }
        this.$alert.success(this.editItem ? 'Costo actualizado' : 'Costo creado')
        this.closeDialog()
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo guardar')
      }).finally(() => {
        this.saving = false
      })
    },
    deleteCosto (costo) {
      this.$alert.dialog(`¿Eliminar el costo "${costo.nombre}"?`).onOk(() => {
        this.$axios.delete(`costos/${costo.id}`).then(() => {
          this.costos = this.costos.filter(c => c.id !== costo.id)
          this.$alert.success('Eliminado')
        }).catch(err => {
          this.$alert.error(err.response?.data?.message || 'No se pudo eliminar')
        })
      })
    }
  }
}
</script>

<style scoped>
.categoria-header {
  display: flex;
  align-items: center;
  padding: 4px 0 4px 10px;
  border-left: 4px solid #ccc;
  margin-bottom: 8px;
}
.costo-card { border-radius: 10px; transition: box-shadow 0.15s; }
.costo-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
.costo-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.color-dot { width: 14px; height: 14px; border-radius: 50%; }
</style>
