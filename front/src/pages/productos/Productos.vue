<template>
  <q-page class="q-pa-md">
    <q-table :rows="productos" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
              title="Productos" :filter="filter">
      <template v-slot:top-right>
          <q-btn color="primary" label="Nuevo" @click="productoNew" outline no-caps  icon="add_circle_outline" :loading="loading" />
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
                <q-item clickable @click="productoEdit(props.row)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="productoDelete(props.row.id)" v-close-popup>
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
                  :color="props.row.color"
                  text-color="white" dense  size="14px"/>
        </q-td>
      </template>
    </q-table>
    <pre>{{ productos }}</pre>
<!--    [-->
<!--    {-->
<!--    "id": 3284,-->
<!--    "nombre": "3-A OFTENO 0,1 % 5 ML",-->
<!--    "descripcion": "Antiinflamatorio no esteroideo",-->
<!--    "unidad": "SOLUCION OFTALMICA",-->
<!--    "precio": 1,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    },-->
    <q-dialog v-model="productoDialog" persistent>
      <q-card style="width: 400px;margin: 0 auto">
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} producto
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="productoDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="producto.id ? productoPut() : productoPost()">
            <q-input v-model="producto.nombre" label="Nombre" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="producto.descripcion" label="Descripción" dense outlined hint="" />
            <q-input v-model="producto.unidad" label="Unidad" dense outlined hint="" />
            <q-input v-model="producto.precio" label="Precio" dense outlined hint="" type="number" step="0.01" />
            <q-input v-model="producto.stock" label="Stock" dense outlined hint="" />
            <q-input v-model="producto.stock_minimo" label="Stock mínimo" dense outlined hint="" />
            <q-input v-model="producto.stock_maximo" label="Stock máximo" dense outlined hint="" />
            <div class="text-right" >
              <q-btn color="negative" label="Cancelar" @click="productoDialog = false" no-caps :loading="loading" />
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
  name: 'ProductosPage',
  data() {
    return {
      productos: [],
      producto: {},
      productoDialog: false,
      loading: false,
      actionPeriodo: '',
      gestiones: [],
      filter: '',
      roles: ['Doctor', 'Enfermera', 'Administrativo', 'Secretaria'],
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion' },
        { name: 'unidad', label: 'Unidad', align: 'left', field: 'unidad' },
        { name: 'precio', label: 'Precio', align: 'left', field: 'precio' },
        { name: 'stock', label: 'Stock', align: 'left', field: 'stock' },
        { name: 'stock_minimo', label: 'Stock mínimo', align: 'left', field: 'stock_minimo' },
        { name: 'stock_maximo', label: 'Stock máximo', align: 'left', field: 'stock_maximo' },
      ]
    }
  },
  mounted() {
    this.productosGet()
  },
  methods: {
    productoNew() {
      this.producto = {
        name: '',
        email: '',
        password: '',
        area_id: 1,
        productoname: '',
        cargo: '',
        role: 'Area',
      }
      this.actionPeriodo = 'Nuevo'
      this.productoDialog = true
    },
    productosGet() {
      this.loading = true
      this.$axios.get('productos').then(res => {
        this.productos = res.data.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    gestionGet() {
      this.loading = true
      this.$axios.get('gestiones').then(res => {
        this.gestiones = res.data
        this.loading = false
      }).catch(error => {
        this.$alert.error(error.response.data.message)
        this.loading = false
      })
    },
    productoPost() {
      this.loading = true
      this.$axios.post('productos', this.producto).then(res => {
        this.productosGet()
        this.productoDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    productoPut() {
      this.loading = true
      this.$axios.put('productos/' + this.producto.id, this.producto).then(res => {
        this.productosGet()
        this.productoDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    productoEdit(producto) {
      this.producto = { ...producto }
      this.actionPeriodo = 'Editar'
      this.productoDialog = true
    },
    productoDelete(id) {
      this.$alert.dialog('¿Desea eliminar el producto?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('productos/' + id).then(res => {
            this.productosGet()
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
