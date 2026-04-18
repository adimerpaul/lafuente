<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="row items-center q-pb-none">
        <div>
          <div class="text-h6">Traspaso de Productos</div>
          <div class="text-caption text-grey-6">
            Transferencia entre Farmacia y Farmacia institucional.
          </div>
        </div>
        <q-btn flat round dense icon="arrow_back" @click="$router.go(-1)" />
        <q-btn flat round dense icon="refresh" :loading="cargando" @click="recargarDatos" />
        <q-space />
        <q-btn
          color="primary"
          label="Listado"
          icon="receipt_long"
          outline
          no-caps
          @click="$router.push('/historial-traspasos')"
        />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="row">
          <div class="col-12 col-md-7 q-pa-xs">
            <div class="row q-col-gutter-sm q-mb-sm">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.farmacia_origen"
                  :options="farmacias"
                  outlined
                  dense
                  label="Farmacia origen"
                  @update:model-value="onCambiarOrigen"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formulario.farmacia_destino"
                  :options="farmaciaDestinoOptions"
                  outlined
                  dense
                  label="Farmacia destino"
                  :disable="!formulario.farmacia_origen"
                />
              </div>
            </div>

            <q-input
              ref="inputBuscarProducto"
              v-model="productosSearch"
              outlined
              clearable
              dense
              debounce="300"
              label="Buscar producto"
              @update:modelValue="productosGet"
            >
              <template #append>
                <q-btn flat round dense icon="search" />
              </template>
            </q-input>

            <div class="flex flex-center q-mt-sm">
              <q-pagination
                size="xs"
                v-model="pagination.page"
                :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage) || 1"
                color="primary"
                @update:modelValue="productosGet"
                boundary-numbers
                max-pages="5"
              />
            </div>

            <div class="row q-mt-sm">
              <template v-for="producto in productos" :key="producto.id">
                <div class="col-6 col-md-2">
                  <q-card flat bordered class="cursor-pointer" @click="openLoteDialog(producto)">
                    <q-img
                      :src="productoImagen(producto)"
                      class="q-mb-xs"
                      style="height: 120px;"
                    >
                      <template #error>
                        <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                          <q-icon name="image_not_supported" size="26px" />
                        </div>
                      </template>
                      <div class="absolute-bottom text-center card-overlay">
                        <div class="card-title">
                          {{ $filters.textUpper(producto.nombre) }}
                        </div>
                        <div class="card-meta">
                          <span>{{ producto.cantidad }} {{ producto.unidad }}</span>
                          <span class="text-bold bg-orange text-black border q-px-xs">
                            {{ producto.precio }} Bs
                          </span>
                        </div>
                      </div>
                    </q-img>
                  </q-card>
                </div>
              </template>
            </div>
          </div>

          <div class="col-12 col-md-5 q-pa-xs">
            <div class="text-right flex items-center">
              Cantidad de productos: {{ productosTraspaso.length }}
              <q-space />
              <q-btn
                icon="delete"
                size="10px"
                color="red"
                dense
                flat
                no-caps
                label="Limpiar"
                @click="limpiarFormulario"
              />
            </div>

            <q-markup-table dense wrap-cells flat bordered>
              <thead>
              <tr>
                <th>Producto</th>
                <th>Lote</th>
                <th>Vence</th>
                <th>Disponible</th>
                <th>Cantidad</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in productosTraspaso" :key="`${item.compra_detalle_id}-${index}`">
                <td style="padding:0;margin:0;display:flex;align-items:center;">
                  <q-img
                    :src="productoImagen(item.producto)"
                    class="q-mb-xs"
                    style="height: 35px;width: 35px;"
                  >
                    <template #error>
                      <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                        <q-icon name="image_not_supported" size="16px" />
                      </div>
                    </template>
                  </q-img>
                  <div class="detalle-producto">
                    <q-icon
                      name="delete"
                      color="red"
                      class="cursor-pointer"
                      @click="productosTraspaso.splice(index, 1)"
                    />
                    {{ $filters.textUpper(item.producto?.nombre || '') }}
                  </div>
                </td>
                <td>{{ item.lote || '-' }}</td>
                <td>{{ item.fecha_vencimiento || '-' }}</td>
                <td class="text-right">{{ item.disponible }}</td>
                <td style="padding:0;margin:0;">
                  <input
                    v-model.number="item.cantidad"
                    type="number"
                    style="width:60px;"
                    min="1"
                    :max="item.disponible"
                  />
                </td>
              </tr>
              </tbody>
            </q-markup-table>

            <div class="q-mt-sm">
              <q-input
                v-model="formulario.observaciones"
                outlined
                dense
                autogrow
                type="textarea"
                label="Observaciones"
              />
            </div>

            <q-btn
              label="Realizar traspaso"
              color="primary"
              class="full-width q-mt-sm"
              no-caps
              :loading="cargando"
              :disable="!puedeEnviar"
              @click="realizarTraspaso"
            />
          </div>
        </div>
      </q-card-section>

    </q-card>

    <q-dialog v-model="loteDialog">
      <q-card style="max-width: 720px; width: 90vw">
        <q-card-section class="q-pb-none row items-center">
          <div class="text-h6">Seleccionar lote</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="cerrarLoteDialog" />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-img
                :src="productoImagen(loteProducto)"
                style="height: 180px"
                class="rounded-borders"
              >
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="image_not_supported" size="28px" />
                  </div>
                </template>
              </q-img>
              <div class="text-subtitle2 text-weight-bold q-mt-sm">
                {{ loteProducto?.nombre }}
              </div>
            </div>

            <div class="col-12 col-md-8">
              <q-table
                :rows="lotes"
                :columns="columnasLotes"
                row-key="id"
                dense
                flat
                bordered
                :loading="lotesLoading"
                selection="single"
                v-model:selected="loteSeleccionadoRow"
                @update:selected="onSelectedLoteRow"
              >
                <template #body-cell-fecha_vencimiento="props">
                  <q-td :props="props">
                    {{ props.row.fecha_vencimiento || '-' }}
                  </q-td>
                </template>
              </q-table>

              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model.number="loteCantidad"
                    outlined
                    dense
                    type="number"
                    label="Cantidad"
                    min="1"
                    :max="loteSelected?.cantidad || 0"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    :model-value="loteSelected?.cantidad || 0"
                    outlined
                    dense
                    readonly
                    label="Disponible"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" @click="cerrarLoteDialog" />
          <q-btn color="primary" no-caps label="Agregar al traspaso" @click="confirmarLote" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { Imprimir } from 'src/addons/Imprimir'

export default {
  name: 'TraspasoPage',
  data() {
    return {
      farmacias: ['Farmacia', 'Farmacia institucional'],
      formulario: {
        farmacia_origen: 'Farmacia',
        farmacia_destino: 'Farmacia institucional',
        observaciones: ''
      },
      productos: [],
      productosSearch: '',
      pagination: {
        sortBy: 'nombre',
        descending: false,
        page: 1,
        rowsPerPage: 12,
        rowsNumber: 0
      },
      productosTraspaso: [],
      cargando: false,
      loteDialog: false,
      loteProducto: null,
      lotes: [],
      lotesLoading: false,
      loteSelected: null,
      loteSeleccionadoRow: [],
      loteCantidad: 1,
      columnasLotes: [
        { name: 'numero_lote', label: 'Lote', align: 'left', field: 'numero_lote' },
        { name: 'fecha_vencimiento', label: 'Vencimiento', align: 'left', field: 'fecha_vencimiento' },
        { name: 'cantidad', label: 'Disponible', align: 'right', field: 'cantidad' },
        { name: 'precio', label: 'Costo', align: 'right', field: 'precio' }
      ]
    }
  },
  computed: {
    farmaciaDestinoOptions() {
      return this.formulario.farmacia_origen === 'Farmacia'
        ? ['Farmacia institucional']
        : ['Farmacia']
    },
    puedeEnviar() {
      return this.productosTraspaso.length > 0 && this.productosTraspaso.every(item => {
        const cantidad = Number(item.cantidad || 0)
        const disponible = Number(item.disponible || 0)
        return item.compra_detalle_id && cantidad > 0 && cantidad <= disponible
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.inputBuscarProducto?.focus()
    })
    this.productosGet()
  },
  methods: {
    productoImagen(producto) {
      return `${this.$url}../images/${producto?.imagen || ''}`
    },
    recargarDatos() {
      this.productosGet()
    },
    onCambiarOrigen() {
      this.formulario.farmacia_destino = this.farmaciaDestinoOptions[0]
      this.pagination.page = 1
      this.productosSearch = ''
      this.limpiarFormulario()
      this.cerrarLoteDialog()
      this.productosGet()
    },
    productosGet() {
      this.cargando = true
      this.$axios.get('traspasos/productos', {
        params: {
          search: this.productosSearch,
          page: this.pagination.page,
          per_page: this.pagination.rowsPerPage,
          farmacia_tipo: this.formulario.farmacia_origen
        }
      }).then((res) => {
        this.productos = res.data.data || []
        this.pagination.rowsNumber = res.data.total || 0
        this.pagination.page = res.data.current_page || 1
      }).catch((error) => {
        console.error(error)
        this.productos = []
      }).finally(() => {
        this.cargando = false
      })
    },
    async openLoteDialog(producto) {
      this.loteProducto = producto
      this.loteDialog = true
      this.lotes = []
      this.loteSelected = null
      this.loteSeleccionadoRow = []
      this.loteCantidad = 1
      this.lotesLoading = true

      try {
        const res = await this.$axios.get('traspasos/lotes', {
          params: {
            producto_id: producto.id,
            farmacia_tipo: this.formulario.farmacia_origen
          }
        })
        this.lotes = res.data || []

        if (this.lotes.length === 1) {
          this.onPickLote(this.lotes[0])
        }
      } catch (error) {
        console.error(error)
        this.$alert?.error?.('No se pudieron cargar los lotes')
        this.cerrarLoteDialog()
      } finally {
        this.lotesLoading = false
      }
    },
    onSelectedLoteRow(rows) {
      this.onPickLote(rows[0] || null)
    },
    onPickLote(lote) {
      this.loteSelected = lote
      this.loteSeleccionadoRow = lote ? [lote] : []
      this.loteCantidad = 1
    },
    confirmarLote() {
      if (!this.loteSelected || !this.loteProducto) {
        this.$alert?.error?.('Selecciona un lote')
        return
      }

      const cantidad = Number(this.loteCantidad || 0)
      const disponible = Number(this.loteSelected.cantidad || 0)

      if (cantidad <= 0 || cantidad > disponible) {
        this.$alert?.error?.('Cantidad invalida para el lote')
        return
      }

      const existente = this.productosTraspaso.find(item =>
        item.compra_detalle_id === this.loteSelected.id
      )

      if (existente) {
        existente.cantidad = Math.min(Number(existente.cantidad) + cantidad, disponible)
      } else {
        this.productosTraspaso.push({
          producto_id: this.loteProducto.id,
          producto: this.loteProducto,
          compra_detalle_id: this.loteSelected.id,
          lote: this.loteSelected.numero_lote,
          fecha_vencimiento: this.loteSelected.fecha_vencimiento,
          disponible,
          cantidad
        })
      }

      this.cerrarLoteDialog()
    },
    cerrarLoteDialog() {
      this.loteDialog = false
      this.loteProducto = null
      this.lotes = []
      this.loteSelected = null
      this.loteSeleccionadoRow = []
      this.loteCantidad = 1
      this.lotesLoading = false
    },
    realizarTraspaso() {
      if (!this.puedeEnviar) {
        this.$alert?.warning?.('Completa todos los detalles requeridos')
        return
      }

      const payload = {
        farmacia_origen: this.formulario.farmacia_origen,
        farmacia_destino: this.formulario.farmacia_destino,
        items: this.productosTraspaso.map(item => ({
          compra_detalle_id: item.compra_detalle_id,
          cantidad: item.cantidad
        })),
        observaciones: this.formulario.observaciones
      }

      this.cargando = true
      this.$axios.post('traspasos', payload)
        .then((res) => {
          this.$alert?.success?.('Traspaso realizado exitosamente')
          if (res.data?.traspaso) {
            Imprimir.reciboTraspaso(res.data.traspaso)
          }
          this.limpiarFormulario()
          this.productosGet()
        })
        .catch(err => {
          this.$alert?.error?.(err.response?.data?.message || 'Error al realizar traspaso')
        })
        .finally(() => {
          this.cargando = false
        })
    },
    limpiarFormulario() {
      this.productosTraspaso = []
      this.formulario.observaciones = ''
    }
  }
}
</script>

<style scoped>
.card-overlay {
  padding: 0;
  margin: 0;
}

.card-title {
  max-width: 190px;
  line-height: 0.9;
}

.card-meta {
  display: flex;
  justify-content: space-between;
}

.detalle-producto {
  max-width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 0.9;
}
</style>
