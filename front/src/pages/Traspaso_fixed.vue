<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h5 class="q-ma-none">🔄 Traspaso de Productos</h5>
        <p class="text-caption text-grey q-ma-none">Transferir productos entre Farmacia y Farmacia Institucional</p>
      </div>
      <q-btn
        color="primary"
        label="Ver historial"
        icon="history"
        @click="mostrarHistorial = !mostrarHistorial"
        outline
        no-caps
      />
    </div>

    <!-- Selección de Farmacias -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="formulario.farmacia_origen"
              :options="['Farmacia', 'Farmacia institucional']"
              label="Farmacia de origen"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="onCambiarOrigen"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="formulario.farmacia_destino"
              :options="farmaciaDestinoOptions"
              label="Farmacia de destino"
              outlined
              dense
              emit-value
              map-options
              :disable="!formulario.farmacia_origen"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de Productos -->
    <q-card class="q-mb-lg" v-if="!mostrarHistorial">
      <q-card-section class="q-pb-none">
        <h6 class="q-ma-none q-mb-md">📦 Seleccionar Productos</h6>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="filtroProducto"
          placeholder="Buscar producto..."
          outlined
          dense
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-table
          :rows="productosFiltrados"
          :columns="columnasProductos"
          row-key="id"
          dense
          flat
          bordered
          selection="multiple"
          v-model:selected="productosSeleccionados"
          :pagination.sync="paginacionProductos"
          :rows-per-page-options="[10, 20, 50]"
          no-data-label="No hay productos disponibles"
          @update:selected="onProductosSeleccionados"
        >
          <template v-slot:body-cell-stock="props">
            <q-td :props="props">
              <q-badge :label="`${props.row.stock} ${props.row.unidad}`" color="info" text-color="white" />
            </q-td>
          </template>
          <template v-slot:body-cell-precio="props">
            <q-td :props="props">
              <span class="text-weight-bold">{{ props.row.precio }}</span>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Detalles del Traspaso -->
    <q-card v-if="productosSeleccionados.length > 0 && !mostrarHistorial" class="q-mb-lg">
      <q-card-section class="q-pb-none">
        <h6 class="q-ma-none q-mb-md">📋 Detalles del Traspaso ({{ productosSeleccionados.length }} productos)</h6>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md items-start q-mb-lg" v-for="(item, idx) in items" :key="idx">
          <!-- Nombre del Producto -->
          <div class="col-12 col-md-2">
            <div class="text-weight-bold">{{ productosSeleccionados[idx]?.nombre }}</div>
            <span class="text-caption text-grey">{{ productosSeleccionados[idx]?.unidad }}</span>
          </div>

          <!-- Selector de Lote -->
          <div class="col-12 col-md-2">
            <q-select
              v-model="item.lote_id"
              :options="getLotesDisponibles(productosSeleccionados[idx]?.id)"
              label="Lote"
              outlined
              dense
              emit-value
              option-value="id"
              option-label="numero_lote"
              @update:model-value="() => cargarDetallesLote(idx)"
            />
          </div>

          <!-- Fecha de Vencimiento (readonly) -->
          <div class="col-12 col-md-2">
            <q-input
              :model-value="item.fecha_vencimiento || '-'"
              label="Vencimiento"
              outlined
              dense
              readonly
            />
          </div>

          <!-- Stock disponible del lote -->
          <div class="col-12 col-md-1">
            <q-input
              :model-value="item.stock_lote || 0"
              label="Stock lote"
              outlined
              dense
              readonly
              type="number"
            />
          </div>

          <!-- Cantidad a traspasar -->
          <div class="col-12 col-md-2">
            <q-input
              v-model.number="item.cantidad"
              label="Cantidad"
              type="number"
              outlined
              dense
              :max="item.stock_lote"
              min="1"
              :rules="[val => val > 0 && val <= (item.stock_lote || 0) || `Máx: ${item.stock_lote}`]"
            />
          </div>

          <!-- Botón quitar -->
          <div class="col-12 col-md-1">
            <q-btn
              color="negative"
              label="Quitar"
              size="sm"
              outline
              no-caps
              @click="quitarProducto(idx)"
              class="full-width"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="formulario.observaciones"
          label="Observaciones (opcional)"
          outlined
          dense
          type="textarea"
          rows="3"
        />
      </q-card-section>

      <q-card-section class="text-right">
        <q-btn
          label="Cancelar"
          color="negative"
          outline
          no-caps
          @click="limpiarFormulario"
          class="q-mr-sm"
        />
        <q-btn
          label="Realizar traspaso"
          color="primary"
          no-caps
          @click="realizarTraspaso"
          :loading="cargando"
          :disable="!puedeEnviar"
        />
      </q-card-section>
    </q-card>

    <!-- Historial de Traspasos -->
    <q-card v-if="mostrarHistorial">
      <q-card-section class="q-pb-none">
        <h6 class="q-ma-none q-mb-md">📜 Historial de Traspasos</h6>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="traspasos"
          :columns="columnasHistorial"
          row-key="venta_id"
          dense
          flat
          bordered
          :pagination.sync="paginacionHistorial"
          :rows-per-page-options="[10, 20, 50]"
          :loading="cargando"
        >
          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              {{ formatearFecha(props.row.fecha) }}
            </q-td>
          </template>
          <template v-slot:body-cell-total="props">
            <q-td :props="props">
              <span class="text-weight-bold text-positive">{{ props.row.total }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-origen="props">
            <q-td :props="props">
              <q-chip
                :label="props.row.farmacia_origen"
                size="sm"
                color="blue-1"
                text-color="blue"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-destino="props">
            <q-td :props="props">
              <q-chip
                :label="props.row.farmacia_destino"
                size="sm"
                color="green-1"
                text-color="green"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'TraspasoPage',
  data() {
    return {
      formulario: {
        farmacia_origen: 'Farmacia',
        farmacia_destino: 'Farmacia institucional',
        observaciones: ''
      },
      productos: [],
      productosSeleccionados: [],
      items: [],
      filtroProducto: '',
      traspasos: [],
      mostrarHistorial: false,
      cargando: false,
      lotes: {},
      paginacionProductos: {
        sortBy: 'nombre',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      paginacionHistorial: {
        sortBy: 'fecha',
        descending: true,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      columnasProductos: [
        { name: 'nombre', label: 'Producto', align: 'left', field: 'nombre', sortable: true },
        { name: 'stock', label: 'Stock', align: 'center', field: 'stock', sortable: true },
        { name: 'precio', label: 'Precio', align: 'center', field: 'precio' },
        { name: 'unidad', label: 'Unidad', align: 'center', field: 'unidad' }
      ],
      columnasHistorial: [
        { name: 'fecha', label: 'Fecha', align: 'left', field: 'fecha', sortable: true },
        { name: 'origen', label: 'Origen', align: 'center', field: 'farmacia_origen' },
        { name: 'destino', label: 'Destino', align: 'center', field: 'farmacia_destino' },
        { name: 'total', label: 'Total', align: 'center', field: 'total' }
      ]
    }
  },
  computed: {
    farmaciaDestinoOptions() {
      return this.formulario.farmacia_origen === 'Farmacia'
        ? ['Farmacia institucional']
        : ['Farmacia']
    },
    productosFiltrados() {
      return this.productos.filter(p =>
        p.nombre.toLowerCase().includes(this.filtroProducto.toLowerCase())
      )
    },
    puedeEnviar() {
      return (
        this.productosSeleccionados.length > 0 &&
        this.items.every(item => item.lote_id && item.cantidad > 0 && item.cantidad <= (item.stock_lote || 0))
      )
    }
  },
  mounted() {
    this.cargarProductos()
    this.cargarTraspasos()
  },
  methods: {
    onCambiarOrigen() {
      // Cambiar automáticamente el destino
      this.formulario.farmacia_destino = this.farmaciaDestinoOptions[0]
      this.productosSeleccionados = []
      this.items = []
      this.lotes = {}
      this.cargarProductos()
    },
    onProductosSeleccionados(selectedRows) {
      this.productosSeleccionados = selectedRows
      this.items = selectedRows.map(() => ({
        lote_id: null,
        cantidad: 1,
        fecha_vencimiento: null,
        stock_lote: 0
      }))
      // Cargar lotes de todos los productos seleccionados
      this.cargarLotesProductos()
    },
    cargarLotesProductos() {
      this.productosSeleccionados.forEach(producto => {
        if (!this.lotes[producto.id]) {
          this.$axios
            .get('traspasos/lotes', {
              params: {
                producto_id: producto.id,
                farmacia_tipo: this.formulario.farmacia_origen
              }
            })
            .then(res => {
              this.$set(this.lotes, producto.id, res.data)
            })
            .catch(() => {
              this.$set(this.lotes, producto.id, [])
            })
        }
      })
    },
    cargarDetallesLote(idx) {
      const item = this.items[idx]
      const producto = this.productosSeleccionados[idx]

      if (!item.lote_id) {
        item.fecha_vencimiento = null
        item.stock_lote = 0
        return
      }

      const lote = this.getLotesDisponibles(producto.id).find(
        l => l.id === item.lote_id
      )

      if (lote) {
        item.fecha_vencimiento = lote.fecha_vencimiento
        item.stock_lote = lote.cantidad
        item.cantidad = Math.min(item.cantidad, lote.cantidad)
      }
    },
    getLotesDisponibles(producto_id) {
      if (!this.lotes[producto_id]) return []
      return this.lotes[producto_id]
    },
    quitarProducto(idx) {
      this.productosSeleccionados.splice(idx, 1)
      this.items.splice(idx, 1)
    },
    cargarProductos() {
      this.cargando = true
      this.$axios
        .get('traspasos/productos', {
          params: { farmacia_tipo: this.formulario.farmacia_origen }
        })
        .then(res => {
          this.productos = res.data || []
          this.paginacionProductos.rowsNumber = this.productos.length
        })
        .catch(err => {
          this.$alert.error(err.response?.data?.message || 'Error al cargar productos')
          this.productos = []
        })
        .finally(() => {
          this.cargando = false
        })
    },
    cargarTraspasos() {
      this.cargando = true
      this.$axios
        .get('traspasos', {
          params: { farmacia_tipo: this.formulario.farmacia_origen }
        })
        .then(res => {
          this.traspasos = res.data.data || res.data || []
          this.paginacionHistorial.rowsNumber = this.traspasos.length
        })
        .catch(() => {
          this.traspasos = []
        })
        .finally(() => {
          this.cargando = false
        })
    },
    realizarTraspaso() {
      if (!this.puedeEnviar) {
        this.$alert.warning('Completa todos los detalles requeridos')
        return
      }

      const payload = {
        farmacia_origen: this.formulario.farmacia_origen,
        farmacia_destino: this.formulario.farmacia_destino,
        items: this.items.map(item => ({
          compra_detalle_id: item.lote_id,
          cantidad: item.cantidad
        })),
        observaciones: this.formulario.observaciones
      }

      this.cargando = true
      this.$axios
        .post('traspasos', payload)
        .then(res => {
          this.$alert.success('Traspaso realizado exitosamente')
          this.limpiarFormulario()
          this.cargarTraspasos()
        })
        .catch(err => {
          this.$alert.error(err.response?.data?.message || 'Error al realizar traspaso')
        })
        .finally(() => {
          this.cargando = false
        })
    },
    limpiarFormulario() {
      this.productosSeleccionados = []
      this.items = []
      this.filtroProducto = ''
      this.formulario.observaciones = ''
    },
    formatearFecha(fecha) {
      if (!fecha) return '-'
      try {
        return new Date(fecha).toLocaleDateString('es-ES')
      } catch {
        return fecha
      }
    }
  }
}
</script>

<style scoped>
h5 {
  color: #1976d2;
}
</style>
