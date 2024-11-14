<template>
  <q-page class="q-pa-md">
    <q-table :rows="materials" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
             title="Almacen" :filter="filter">
      <template v-slot:top-right>
        <q-btn color="primary" label="Nuevo" @click="materialNew" outline no-caps  icon="add_circle_outline" :loading="loading" />
        <q-input v-model="filter" label="Buscar" dense outlined >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
            <q-list>
              <q-item clickable @click="materialEdit(props.row)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Editar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="materialDelete(props.row.id)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-td>
      </template>
      <template v-slot:body-cell-role="props">
        <q-td :props="props">
          <q-chip :label="props.row.role"
                  :color="props.row.role === 'Jefatura' ? 'primary' : 'positive'"
                  text-color="white" dense  size="14px"/>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="materialDialog" persistent>
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} material
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="materialDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="material.id ? materialPut() : materialPost()">
            <q-input v-model="material.partida" label="Partida" outlined dense type="number" :rules="[val => val > 0 || 'Partida es requerida']" />
            <q-input v-model="material.descripcion" label="Descripción" outlined dense :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="material.cantidad" label="Cantidad" outlined dense type="number" :rules="[val => val > 0 || 'Cantidad es requerida']" />
            <q-select v-model="material.unidad" label="Unidad" outlined dense :options="unidades" :rules="[val => !!val || 'Unidad es requerida']" />
            <q-input v-model="material.precio" label="Precio" outlined dense type="number" :step="0.01" :rules="[val => val > 0 || 'Precio es requerido']" />
            <div class="text-right" >
              <q-btn color="negative" label="Cancelar" @click="materialDialog = false" no-caps :loading="loading" />
              <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import moment from 'moment'
export default {
  name: 'AlmacenPage',
  data() {
    return {
      materials: [],
      material: {},
      materialDialog: false,
      loading: false,
      actionPeriodo: '',
      gestiones: [],
      filter: '',
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        { name: 'partida', label: 'Partida', align: 'left', field: 'partida', sortable: true },
        { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion', sortable: true },
        { name: 'cantidad', label: 'Cantidad', align: 'left', field: 'cantidad', sortable: true },
        { name: 'unidad', label: 'Unidad', align: 'left', field: 'unidad', sortable: true },
        { name: 'precio', label: 'Precio', align: 'left', field: 'precio', sortable: true },
      ],
      unidades: [
        'Unidad',
        'Metro',
        'Kilogramo',
        'Litro',
        'Pieza',
        'Paquete',
      ],
    }
  },
  mounted() {
    this.materialsGet()
  },
  methods: {
    materialNew() {
      this.material = {
        // 'partida',
        // 'descripcion',
        // 'cantidad',
        // 'unidad',
        // 'precio',
        partida: '',
        descripcion: '',
        cantidad: '',
        unidad: '',
        precio: '',
      }
      this.actionPeriodo = 'Nuevo'
      this.materialDialog = true
    },
    materialsGet() {
      this.loading = true
      this.$axios.get('materials').then(res => {
        this.materials = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    materialPost() {
      this.loading = true
      this.$axios.post('materials', this.material).then(res => {
        this.materialsGet()
        this.materialDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    materialPut() {
      this.loading = true
      this.$axios.put('materials/' + this.material.id, this.material).then(res => {
        this.materialsGet()
        this.materialDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    materialEdit(material) {
      this.material = { ...material }
      this.actionPeriodo = 'Editar'
      this.materialDialog = true
    },
    materialDelete(id) {
      this.$alert.dialog('¿Desea eliminar el material?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('materials/' + id).then(res => {
            this.materialsGet()
            this.$alert.success('Periodo eliminado')
          }).catch(error => {
            this.$alert.error(error.response.data.message)
          }).finally(() => {
            this.loading = false
          })
        })
    }
  }
}
</script>
