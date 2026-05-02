<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-teal-8 text-white q-py-sm">
        <q-icon name="receipt_long" size="sm" class="q-mr-sm" />
        <div class="text-h6">Costos de atención</div>
        <q-space />
        <q-btn flat dense icon="add" color="white" label="Nuevo" no-caps class="q-mr-xs" @click="openNew" />
        <q-btn flat round dense icon="refresh" color="white" @click="costosGet" :loading="loading" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <div class="row q-col-gutter-sm q-mb-sm">
          <div class="col-12 col-md-4">
            <q-input v-model="search" dense outlined clearable label="Buscar costo">
              <template #append><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="filterCategoria"
              :options="['Todas', ...categorias]"
              dense outlined clearable label="Filtrar por categoría"
            />
          </div>
        </div>

        <q-inner-loading :showing="loading" />

        <div class="row q-col-gutter-sm">
          <template v-for="grupo in costosAgrupados" :key="grupo.categoria">
            <div class="col-12">
              <div class="categoria-header q-mb-xs" :style="{ borderLeftColor: categoriaHex(grupo.categoria) }">
                <q-icon :name="categoriaIcono(grupo.categoria)" size="xs" class="q-mr-xs" :style="{ color: categoriaHex(grupo.categoria) }" />
                <span class="text-weight-bold text-subtitle2">{{ grupo.categoria }}</span>
                <q-badge :style="{ background: categoriaHex(grupo.categoria) }" class="q-ml-sm">{{ grupo.items.length }}</q-badge>
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
                          <div class="row items-center q-mt-xs" style="gap:3px;flex-wrap:wrap">
                            <q-badge v-for="ar in (costo.aranceles || []).slice(0,3)" :key="ar.id"
                              color="blue-grey-2" text-color="blue-grey-9" class="text-caption">
                              {{ ar.nombre }}
                            </q-badge>
                            <q-badge v-if="(costo.aranceles||[]).length > 3" color="grey-4" text-color="grey-8" class="text-caption">
                              +{{ costo.aranceles.length - 3 }}
                            </q-badge>
                            <span v-if="!(costo.aranceles||[]).length" class="text-grey-5 text-caption">Sin aranceles</span>
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
          <div v-if="!loading && !costosAgrupados.length" class="col-12 text-center text-grey-6 q-py-xl">
            No hay costos registrados
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Dialog crear/editar -->
    <q-dialog v-model="dialog" persistent maximized>
      <q-card>
        <q-card-section class="row items-center bg-teal-8 text-white q-py-sm">
          <q-icon name="receipt_long" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">{{ editItem ? 'Editar costo' : 'Nuevo costo' }}</div>
          <q-space />
          <q-btn flat round dense icon="close" color="white" @click="closeDialog" />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <q-form @submit="save" ref="formRef">
            <div class="row q-col-gutter-md">

              <!-- Columna izquierda: datos del costo -->
              <div class="col-12 col-md-5">
                <div class="text-subtitle2 text-weight-bold q-mb-sm">Datos del costo</div>

                <q-input v-model="form.nombre" label="Nombre *" dense outlined class="q-mb-sm"
                  :rules="[v => !!v || 'Requerido']" />

                <q-select v-model="form.categoria" :options="categorias" label="Categoría"
                  dense outlined clearable class="q-mb-sm" />

                <q-toggle v-model="form.activo" label="Activo" color="positive" class="q-mb-sm" />
                <q-input v-model.number="form.orden" type="number" label="Orden" dense outlined min="0" class="q-mb-sm" />

                <!-- Selector de color -->
                <div class="text-caption text-weight-medium q-mb-xs">Color</div>
                <div class="row q-gutter-xs q-mb-md">
                  <div
                    v-for="opt in colorOptions" :key="opt.value"
                    class="color-circle cursor-pointer"
                    :style="{ background: opt.hex }"
                    :class="{ 'color-circle--selected': form.color === opt.value }"
                    @click="form.color = opt.value"
                  >
                    <q-icon v-if="form.color === opt.value" name="check" color="white" size="14px" />
                    <q-tooltip>{{ opt.label }}</q-tooltip>
                  </div>
                </div>

                <!-- Selector de ícono -->
                <div class="text-caption text-weight-medium q-mb-xs">
                  Ícono seleccionado:
                  <span class="q-ml-sm">
                    <q-icon :name="form.icono || 'payments'" size="sm" :style="{ color: hexColor(form.color) }" />
                    <span class="text-grey-6 text-caption q-ml-xs">{{ form.icono }}</span>
                  </span>
                </div>
                <div class="icon-grid q-mb-sm">
                  <div
                    v-for="ic in iconOptions" :key="ic.name"
                    class="icon-option cursor-pointer"
                    :class="{ 'icon-option--selected': form.icono === ic.name }"
                    @click="form.icono = ic.name"
                  >
                    <q-icon :name="ic.name" size="20px" />
                    <q-tooltip>{{ ic.label }}</q-tooltip>
                  </div>
                </div>
              </div>

              <!-- Columna derecha: aranceles -->
              <div class="col-12 col-md-7">
                <div class="text-subtitle2 text-weight-bold q-mb-sm">
                  Aranceles relacionados
                  <q-badge color="teal-7" class="q-ml-sm">{{ form.arancel_ids.length }} seleccionados</q-badge>
                </div>

                <q-input v-model="arancelSearch" dense outlined clearable label="Buscar arancel" class="q-mb-sm">
                  <template #prepend><q-icon name="search" /></template>
                </q-input>

                <q-card flat bordered style="max-height: 450px; overflow-y: auto;">
                  <q-list dense separator>
                    <q-item
                      v-for="arancel in arancelesFiltrados" :key="arancel.id"
                      clickable
                      @click="toggleArancelForm(arancel.id)"
                      :class="{ 'bg-teal-1': form.arancel_ids.includes(arancel.id) }"
                    >
                      <q-item-section side>
                        <q-checkbox
                          :model-value="form.arancel_ids.includes(arancel.id)"
                          @update:model-value="toggleArancelForm(arancel.id)"
                          dense color="teal-7"
                          @click.stop
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-caption text-weight-medium">{{ arancel.nombre }}</q-item-label>
                        <q-item-label caption v-if="arancel.presentacion">{{ arancel.presentacion }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-badge color="teal-8" text-color="white">{{ arancel.precio }} Bs</q-badge>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="!arancelesFiltrados.length">
                      <q-item-section class="text-grey-5 text-caption">Sin resultados</q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </div>

            <div class="text-right q-mt-lg">
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
  'Atención médica':    { icono: 'medical_services',   hex: '#3f51b5' },
  'Médico':             { icono: 'person_search',       hex: '#1565c0' },
  'Procedimiento':      { icono: 'content_cut',         hex: '#00897b' },
  'Enfermería':         { icono: 'vaccines',            hex: '#c2185b' },
  'Insumos':            { icono: 'inventory_2',         hex: '#5d4037' },
  'Laboratorio':        { icono: 'science',             hex: '#1976d2' },
  'Ecografía':          { icono: 'pregnant_woman',      hex: '#7b1fa2' },
  'Consultorio':        { icono: 'door_front',          hex: '#6d4c41' },
  'Farmacia':           { icono: 'local_pharmacy',      hex: '#388e3c' },
  'Tomografía':         { icono: 'biotech',             hex: '#512da8' },
  'Fisioterapia':       { icono: 'directions_run',      hex: '#e65100' },
  'Odontología':        { icono: 'dentistry',           hex: '#0097a7' },
}

const COLOR_OPTIONS = [
  { label: 'Índigo',        value: 'indigo',        hex: '#3f51b5' },
  { label: 'Azul oscuro',   value: 'blue-9',        hex: '#1565c0' },
  { label: 'Teal',          value: 'teal-7',        hex: '#00796b' },
  { label: 'Rosa',          value: 'pink-7',        hex: '#c2185b' },
  { label: 'Marrón',        value: 'brown-7',       hex: '#5d4037' },
  { label: 'Azul',          value: 'blue-7',        hex: '#1976d2' },
  { label: 'Morado',        value: 'purple-8',      hex: '#6a1b9a' },
  { label: 'Café',          value: 'brown-6',       hex: '#6d4c41' },
  { label: 'Verde',         value: 'green-7',       hex: '#388e3c' },
  { label: 'Lila',          value: 'deep-purple-7', hex: '#512da8' },
  { label: 'Naranja',       value: 'orange-9',      hex: '#e65100' },
  { label: 'Cyan',          value: 'cyan-7',        hex: '#0097a7' },
  { label: 'Rojo',          value: 'red-7',         hex: '#c62828' },
  { label: 'Verde lima',    value: 'light-green-8', hex: '#558b2f' },
  { label: 'Gris',          value: 'grey-8',        hex: '#424242' },
]

const QUASAR_HEX = {
  'indigo': '#3f51b5', 'blue-9': '#1565c0', 'teal-7': '#00796b',
  'pink-7': '#c2185b', 'brown-7': '#5d4037', 'blue-7': '#1976d2',
  'purple-8': '#6a1b9a', 'brown-6': '#6d4c41', 'green-7': '#388e3c',
  'deep-purple-7': '#512da8', 'orange-9': '#e65100', 'cyan-7': '#0097a7',
  'red-7': '#c62828', 'light-green-8': '#558b2f', 'grey-8': '#424242',
  'primary': '#1976d2',
}

const ICON_OPTIONS = [
  { name: 'medical_services',  label: 'Servicios médicos' },
  { name: 'person_search',     label: 'Consulta médica' },
  { name: 'content_cut',       label: 'Procedimiento / Corte' },
  { name: 'healing',           label: 'Curación' },
  { name: 'vaccines',          label: 'Vacunas / Inyectable' },
  { name: 'monitor_heart',     label: 'Toma de presión' },
  { name: 'science',           label: 'Laboratorio' },
  { name: 'pregnant_woman',    label: 'Ecografía' },
  { name: 'biotech',           label: 'Tomografía' },
  { name: 'local_pharmacy',    label: 'Farmacia' },
  { name: 'sanitizer',         label: 'Antisépticos' },
  { name: 'bloodtype',         label: 'Flebotomía' },
  { name: 'medication_liquid', label: 'Sonda / Líquido' },
  { name: 'inventory_2',       label: 'Insumos / Caja' },
  { name: 'door_front',        label: 'Consultorio' },
  { name: 'directions_run',    label: 'Fisioterapia' },
  { name: 'dentistry',         label: 'Odontología' },
  { name: 'psychology',        label: 'Psicología' },
  { name: 'bed',               label: 'Cama' },
  { name: 'night_shelter',     label: 'Compañía noche' },
  { name: 'emergency',         label: 'Ambulancia' },
  { name: 'description',       label: 'Certificado / Documento' },
  { name: 'device_thermostat', label: 'Temperatura' },
  { name: 'water_drop',        label: 'Glicemia' },
  { name: 'medication',        label: 'Medicamento' },
  { name: 'health_and_safety', label: 'Seguridad / Salud' },
  { name: 'payments',          label: 'Pago / Costo' },
  { name: 'add_card',          label: 'Otros costos' },
]

const emptyForm = () => ({
  nombre: '',
  categoria: null,
  icono: 'payments',
  color: 'teal-7',
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
      arancelSearch: '',
      costos: [],
      aranceles: [],
      form: emptyForm(),
      categorias: Object.keys(CATEGORIAS_META),
      colorOptions: COLOR_OPTIONS,
      iconOptions: ICON_OPTIONS,
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
    },
    arancelesFiltrados () {
      const s = this.arancelSearch.toLowerCase()
      if (!s) return this.aranceles
      return this.aranceles.filter(a =>
        a.nombre.toLowerCase().includes(s) ||
        (a.presentacion || '').toLowerCase().includes(s) ||
        (a.categoria || '').toLowerCase().includes(s)
      )
    }
  },
  mounted () {
    this.costosGet()
    this.arancelesGet()
  },
  methods: {
    hexColor (color) {
      return QUASAR_HEX[color] || color || '#009688'
    },
    categoriaHex (cat) {
      return CATEGORIAS_META[cat]?.hex || '#616161'
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
      this.arancelSearch = ''
      this.dialog = true
    },
    openEdit (costo) {
      this.editItem = costo
      this.form = {
        nombre: costo.nombre,
        categoria: costo.categoria,
        icono: costo.icono || 'payments',
        color: costo.color || 'teal-7',
        activo: costo.activo !== false,
        orden: costo.orden || 0,
        arancel_ids: (costo.aranceles || []).map(a => a.id),
      }
      this.arancelSearch = ''
      this.dialog = true
    },
    closeDialog () {
      this.dialog = false
      this.editItem = null
    },
    toggleArancelForm (id) {
      const idx = this.form.arancel_ids.indexOf(id)
      if (idx === -1) {
        this.form.arancel_ids = [...this.form.arancel_ids, id]
      } else {
        this.form.arancel_ids = this.form.arancel_ids.filter(x => x !== id)
      }
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
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* Color picker circles */
.color-circle {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.1s, box-shadow 0.1s;
  border: 2px solid transparent;
}
.color-circle:hover { transform: scale(1.15); }
.color-circle--selected { border-color: #fff; box-shadow: 0 0 0 3px rgba(0,0,0,0.3); }

/* Icon picker grid */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 6px;
}
.icon-option {
  width: 44px; height: 44px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #e0e0e0;
  background: #fafafa;
  transition: all 0.12s;
}
.icon-option:hover { border-color: #009688; background: #e0f2f1; }
.icon-option--selected { border-color: #009688; background: #b2dfdb; }
</style>
