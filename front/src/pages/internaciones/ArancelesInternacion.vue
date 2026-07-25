<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="row items-center q-col-gutter-sm bg-blue-grey-9 text-white">
        <div class="col-12 col-md">
          <div class="text-h6">Aranceles de internación</div>
          <div class="text-caption text-blue-grey-2">Precios configurables para servicios y procedimientos de internación.</div>
        </div>
        <div class="col-12 col-md-4">
          <q-input v-model="search" dense outlined clearable debounce="300" label="Buscar" @update:model-value="cargar">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-auto">
          <q-btn outline color="white" icon="picture_as_pdf" label="PDF" no-caps class="q-mr-xs"
                 :loading="exportingPdf" @click="exportar('pdf')" />
          <q-btn outline color="white" icon="table_view" label="Excel" no-caps class="q-mr-xs"
                 :loading="exportingExcel" @click="exportar('excel')" />
          <q-btn color="positive" icon="add" label="Nuevo" no-caps @click="nuevo" />
        </div>
      </q-card-section>
      <q-table flat dense wrap-cells row-key="id" :rows="rows" :columns="columns"
               :loading="loading" :rows-per-page-options="[10, 20, 50]">
        <template #body-cell-precio="props">
          <q-td :props="props">
            {{ props.row.precio === null ? 'Variable / pendiente' : `Bs ${money(props.row.precio)}` }}
          </q-td>
        </template>
        <template #body-cell-activo="props">
          <q-td :props="props"><q-badge :color="props.row.activo ? 'positive' : 'grey'" :label="props.row.activo ? 'Activo' : 'Inactivo'" /></q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn-dropdown flat dense no-caps color="primary" icon="more_vert" label="Opciones">
              <q-list dense style="min-width: 140px">
                <q-item clickable v-close-popup @click="editar(props.row)">
                  <q-item-section avatar><q-icon name="edit" color="primary" /></q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="eliminar(props.row)">
                  <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                  <q-item-section class="text-negative">Eliminar</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogo" persistent>
      <q-card style="width: 560px; max-width: 95vw">
        <q-form @submit="guardar">
          <q-card-section class="row items-center">
            <div class="text-subtitle1 text-weight-bold">{{ form.id ? 'Editar' : 'Nuevo' }} arancel</div>
            <q-space /><q-btn flat round dense icon="close" v-close-popup />
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6"><q-input v-model.trim="form.categoria" dense outlined label="Categoría *" :rules="[required]" /></div>
            <div class="col-12 col-sm-6"><q-input v-model.trim="form.grupo" dense outlined label="Grupo" /></div>
            <div class="col-12"><q-input v-model.trim="form.nombre" dense outlined label="Nombre *" :rules="[required]" /></div>
            <div class="col-12"><q-input v-model.trim="form.detalle" dense outlined label="Detalle" /></div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.tipo_precio"
                dense
                outlined
                use-input
                new-value-mode="add-unique"
                label="Tipo de precio *"
                :options="tipoPrecioOptions"
                :rules="[required]"
              />
            </div>
            <div class="col-12 col-sm-6"><q-input v-model.number="form.precio" dense outlined type="number" step="0.01" min="0" label="Precio Bs" /></div>
            <div class="col-12">
              <q-checkbox v-model="form.permite_precio_manual" label="Permitir modificar el precio al aplicarlo" />
              <q-checkbox v-model="form.activo" label="Activo" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat no-caps label="Cancelar" v-close-popup />
            <q-btn type="submit" color="primary" no-caps icon="save" label="Guardar" :loading="saving" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'ArancelesInternacionPage',
  data () {
    return {
      rows: [], search: '', loading: false, saving: false, dialogo: false,
      exportingPdf: false, exportingExcel: false,
      tipoPrecioOptions: ['Fijo', 'Por día', 'Por hora', 'Por sesión', 'Por unidad', 'Variable'],
      form: {},
      columns: [
        { name: 'acciones', label: 'Opciones', align: 'left' },
        { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
        { name: 'grupo', label: 'Grupo', field: row => row.grupo || '-', align: 'left' },
        { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
        { name: 'tipo', label: 'Tipo', field: 'tipo_precio', align: 'left' },
        { name: 'precio', label: 'Precio', field: 'precio', align: 'right' },
        { name: 'activo', label: 'Estado', field: 'activo', align: 'center' },
      ],
    }
  },
  mounted () { this.cargar() },
  methods: {
    required: value => !!value || 'Campo requerido',
    cargar () {
      this.loading = true
      this.$axios.get('aranceles-internacion', { params: { search: this.search } })
        .then(({ data }) => { this.rows = data })
        .catch(error => this.$alert.error(error.response?.data?.message || 'No se pudieron cargar los aranceles'))
        .finally(() => { this.loading = false })
    },
    nuevo () {
      this.form = { categoria: '', grupo: '', nombre: '', detalle: '', tipo_precio: '', precio: null, permite_precio_manual: false, activo: true }
      this.dialogo = true
    },
    editar (row) { this.form = { ...row }; this.dialogo = true },
    eliminar (row) {
      this.$alert.dialog(`¿Desea eliminar el arancel "${row.nombre}"?`).onOk(() => {
        this.loading = true
        this.$axios.delete(`aranceles-internacion/${row.id}`).then(({ data }) => {
          this.$alert.success(data.message || 'Arancel eliminado correctamente')
          this.cargar()
        }).catch(error => {
          this.$alert.error(error.response?.data?.message || 'No se pudo eliminar el arancel')
        }).finally(() => {
          this.loading = false
        })
      })
    },
    guardar () {
      this.saving = true
      const request = this.form.id
        ? this.$axios.put(`aranceles-internacion/${this.form.id}`, this.form)
        : this.$axios.post('aranceles-internacion', this.form)
      request.then(() => {
        this.$alert.success('Arancel guardado correctamente')
        this.dialogo = false
        this.cargar()
      }).catch(error => {
        const errors = error.response?.data?.errors
        this.$alert.error(errors ? Object.values(errors).flat()[0] : error.response?.data?.message || 'No se pudo guardar')
      }).finally(() => { this.saving = false })
    },
    async exportar (tipo) {
      const loadingKey = tipo === 'pdf' ? 'exportingPdf' : 'exportingExcel'
      this[loadingKey] = true
      try {
        const response = await this.$axios.get(`aranceles-internacion/${tipo}`, {
          params: { search: this.search },
          responseType: 'blob'
        })
        const contentDisposition = response.headers['content-disposition'] || ''
        const match = contentDisposition.match(/filename="?([^";]+)"?/i)
        const fallback = `aranceles_internacion.${tipo === 'pdf' ? 'pdf' : 'xlsx'}`
        const fileName = match ? decodeURIComponent(match[1]) : fallback
        const url = window.URL.createObjectURL(response.data)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        this.$alert.error(error.response?.data?.message || `No se pudo exportar el ${tipo.toUpperCase()}`)
      } finally {
        this[loadingKey] = false
      }
    },
    money: value => Number(value || 0).toFixed(2),
  }
}
</script>
