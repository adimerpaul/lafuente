<template>
  <q-page class="q-pa-md">
    <q-table :rows="ventas" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
              title="Ventas" :filter="filter">
      <template v-slot:top-right>
          <q-btn color="positive" label="Nueva venta"  no-caps  icon="add_circle_outline" :loading="loading" :to="'/ventaNuevo'" />
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
                <q-item clickable @click="ventaEdit(props.row)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="ventaDelete(props.row.id)" v-close-popup>
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
<!--    <pre>{{ ventas }}</pre>-->
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
    <q-dialog v-model="ventaDialog" persistent>
      <q-card style="width: 400px;margin: 0 auto">
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} venta
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="ventaDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="venta.id ? ventaPut() : ventaPost()">
            <q-input v-model="venta.nombre" label="Nombre" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="venta.descripcion" label="Descripción" dense outlined hint="" />
            <q-input v-model="venta.unidad" label="Unidad" dense outlined hint="" />
            <q-input v-model="venta.precio" label="Precio" dense outlined hint="" type="number" step="0.01" />
            <q-input v-model="venta.stock" label="Stock" dense outlined hint="" />
            <q-input v-model="venta.stock_minimo" label="Stock mínimo" dense outlined hint="" />
            <q-input v-model="venta.stock_maximo" label="Stock máximo" dense outlined hint="" />
            <div class="text-right" >
              <q-btn color="negative" label="Cancelar" @click="ventaDialog = false" no-caps :loading="loading" />
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
  name: 'Ventas',
  data() {
    return {
      ventas: [],
      venta: {},
      ventaDialog: false,
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
    this.ventasGet()
  },
  methods: {
    ventaNew() {
      this.venta = {
        name: '',
        email: '',
        password: '',
        area_id: 1,
        ventaname: '',
        cargo: '',
        role: 'Area',
      }
      this.actionPeriodo = 'Nuevo'
      this.ventaDialog = true
    },
    ventasGet() {
      this.loading = true
      this.$axios.get('ventas').then(res => {
        this.ventas = res.data.data
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
    ventaPost() {
      this.loading = true
      this.$axios.post('ventas', this.venta).then(res => {
        this.ventasGet()
        this.ventaDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    ventaPut() {
      this.loading = true
      this.$axios.put('ventas/' + this.venta.id, this.venta).then(res => {
        this.ventasGet()
        this.ventaDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    ventaEdit(venta) {
      this.venta = { ...venta }
      this.actionPeriodo = 'Editar'
      this.ventaDialog = true
    },
    ventaDelete(id) {
      this.$alert.dialog('¿Desea eliminar el venta?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('ventas/' + id).then(res => {
            this.ventasGet()
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
