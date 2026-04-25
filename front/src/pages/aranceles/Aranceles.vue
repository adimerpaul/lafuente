<template>
  <q-page class="q-pa-md">
    <q-table
      title="Aranceles medicos"
      :rows="aranceles"
      :columns="columns"
      row-key="id"
      dense
      flat
      bordered
      wrap-cells
      :rows-per-page-options="[0]"
      :loading="loading"
      :filter="search"
    >
      <template #top-right>
        <div class="row items-center q-col-gutter-sm">
          <div class="col-auto" v-if="canModify">
            <q-btn color="primary" icon="add_circle_outline" label="Nuevo" no-caps outline @click="arancelNew" />
          </div>
          <div class="col-auto">
            <q-btn color="primary" icon="print" label="Imprimir" no-caps outline @click="imprimirListado" />
          </div>
          <div class="col-auto">
            <q-btn color="positive" icon="file_download" label="Excel" no-caps outline @click="exportExcel" />
          </div>
          <div class="col-auto">
            <q-btn color="primary" icon="refresh" label="Actualizar" no-caps outline :loading="loading" @click="arancelesGet" />
          </div>
          <div class="col-auto">
            <q-input v-model="search" label="Buscar" dense outlined clearable style="width: 220px;">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="text-left">
          <q-btn-dropdown v-if="canModify" label="Opciones" no-caps size="10px" dense color="primary">
            <q-list>
              <q-item clickable v-close-popup @click="arancelEdit(props.row)">
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Editar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="arancelDelete(props.row.id)">
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <span v-else class="text-grey-7 text-caption">Ver solo</span>
        </q-td>
      </template>

      <template #body-cell-precio="props">
        <q-td :props="props" class="text-right text-weight-bold">
          {{ formatPrice(props.row.precio) }}
        </q-td>
      </template>

      <template #body-cell-activo="props">
        <q-td :props="props" class="text-center">
          <q-chip
            dense
            :color="props.row.activo ? 'positive' : 'negative'"
            text-color="white"
            :label="props.row.activo ? 'Activo' : 'Inactivo'"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="arancelDialog" persistent>
      <q-card style="min-width: 420px; max-width: 95vw;">
        <q-card-section class="q-pb-none row items-center">
          <div>{{ dialogTitle }} arancel</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="arancelDialog = false" />
        </q-card-section>
        <q-card-section>
          <q-form @submit="arancel.id ? arancelPut() : arancelPost()">
            <q-input
              v-model="arancel.categoria"
              label="Categoria"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="arancel.nombre"
              label="Nombre"
              dense
              outlined
              :rules="[val => !!val || 'Campo requerido']"
              class="q-mb-sm"
            />
            <q-input
              v-model="arancel.presentacion"
              label="Presentacion"
              dense
              outlined
              class="q-mb-sm"
            />
            <q-input
              v-model.number="arancel.precio"
              label="Precio"
              dense
              outlined
              type="number"
              min="0"
              step="0.01"
              class="q-mb-sm"
            />
            <q-input
              v-if="!arancel.id"
              v-model="arancel.codigo"
              label="Codigo"
              dense
              outlined
              hint="Identificador unico interno"
              :rules="[val => !!val || 'Campo requerido']"
              class="q-mb-sm"
            />
            <q-toggle v-model="arancel.activo" color="positive" label="Activo" />

            <div class="text-right q-mt-md">
              <q-btn color="negative" label="Cancelar" no-caps @click="arancelDialog = false" :loading="saving" />
              <q-btn color="primary" label="Guardar" no-caps type="submit" class="q-ml-sm" :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div id="myElement" class="hidden"></div>
  </q-page>
</template>

<script>
import { Excel } from 'src/addons/Excel'
import { Printd } from 'printd'

export default {
  name: 'ArancelesPage',
  data () {
    return {
      loading: false,
      saving: false,
      search: '',
      aranceles: [],
      arancelDialog: false,
      dialogTitle: 'Nuevo',
      arancel: {},
      canModify: false,
      columns: [
        { name: 'actions', label: 'Acciones', align: 'left' },
        { name: 'nombre', label: 'Arancel', align: 'left', field: 'nombre', sortable: true },
        { name: 'precio', label: 'Precio', align: 'right', field: 'precio', sortable: true },
        { name: 'activo', label: 'Estado', align: 'center', field: 'activo', sortable: true },
        { name: 'categoria', label: 'Categoria', align: 'left', field: 'categoria', sortable: true },
        { name: 'presentacion', label: 'Presentacion', align: 'left', field: 'presentacion', sortable: true }
      ]
    }
  },
  mounted () {
    this.canModify = this.$store.user?.permissions?.includes('modificar aranceles') || false
    if (!this.canModify) {
      this.columns = this.columns.filter(col => col.name !== 'actions')
    }
    this.arancelesGet()
  },
  methods: {
    formatPrice (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    arancelesGet () {
      this.loading = true
      this.$axios.get('aranceles').then(res => {
        this.aranceles = res.data || []
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudieron cargar los aranceles')
      }).finally(() => {
        this.loading = false
      })
    },
    arancelNew () {
      this.dialogTitle = 'Nuevo'
      this.arancel = {
        codigo: '',
        categoria: '',
        nombre: '',
        presentacion: '',
        precio: 100,
        orden: 0,
        activo: true
      }
      this.arancelDialog = true
    },
    arancelEdit (arancel) {
      this.dialogTitle = 'Editar'
      this.arancel = {
        ...arancel,
        precio: Number(arancel.precio || 0),
        orden: Number(arancel.orden || 0),
        activo: Boolean(arancel.activo)
      }
      this.arancelDialog = true
    },
    arancelPost () {
      this.saving = true
      this.$axios.post('aranceles', this.arancel).then(() => {
        this.$alert.success('Arancel creado')
        this.arancelDialog = false
        this.arancelesGet()
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo crear el arancel')
      }).finally(() => {
        this.saving = false
      })
    },
    arancelPut () {
      this.saving = true
      this.$axios.put(`aranceles/${this.arancel.id}`, {
        categoria: this.arancel.categoria,
        nombre: this.arancel.nombre,
        presentacion: this.arancel.presentacion,
        precio: Number(this.arancel.precio || 0),
        activo: this.arancel.activo
      }).then(() => {
        this.$alert.success('Arancel actualizado')
        this.arancelDialog = false
        this.arancelesGet()
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo actualizar el arancel')
      }).finally(() => {
        this.saving = false
      })
    },
    arancelDelete (id) {
      this.$alert.dialog('Desea eliminar el arancel?').onOk(() => {
        this.loading = true
        this.$axios.delete(`aranceles/${id}`).then(() => {
          this.$alert.success('Arancel eliminado')
          this.arancelesGet()
        }).catch(err => {
          this.$alert.error(err.response?.data?.message || 'No se pudo eliminar el arancel')
        }).finally(() => {
          this.loading = false
        })
      })
    },
    exportExcel () {
      const data = [{
        sheet: 'Aranceles',
        columns: [
          { label: 'Categoria', value: 'categoria' },
          { label: 'Arancel', value: 'nombre' },
          { label: 'Presentacion', value: 'presentacion' },
          { label: 'Precio', value: row => Number(row.precio || 0).toFixed(2) },
          { label: 'Estado', value: row => row.activo ? 'Activo' : 'Inactivo' }
        ],
        content: this.aranceles
      }]
      Excel.export(data, 'Aranceles_Clinica_La_Fuente')
    },
    imprimirListado () {
      const rows = this.aranceles.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.categoria || '-'}</td>
          <td>${item.nombre}</td>
          <td>${item.presentacion || '-'}</td>
          <td style="text-align:right;">${this.formatPrice(item.precio)}</td>
          <td style="text-align:center;">${item.activo ? 'Activo' : 'Inactivo'}</td>
        </tr>
      `).join('')

      const html = `
        <div class="print-wrap">
          <h2>Aranceles medicos - Clinica La Fuente</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Categoria</th>
                <th>Arancel</th>
                <th>Presentacion</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `

      const styles = `
        .print-wrap { font-family: Arial, sans-serif; padding: 16px; }
        .print-wrap h2 { margin: 0 0 12px; font-size: 18px; }
        .print-wrap table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .print-wrap th, .print-wrap td { border: 1px solid #222; padding: 6px; }
        .print-wrap th { background: #f0f0f0; text-align: left; }
      `

      const mount = document.getElementById('myElement')
      mount.innerHTML = html
      const d = new Printd()
      d.print(mount.firstElementChild, styles)
    }
  }
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
