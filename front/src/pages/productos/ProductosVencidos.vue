<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <div class="text-h6">Productos Vencidos - {{ farmaciaNombre }}</div>

        <div class="row q-col-gutter-sm items-end">
          <div class="col-12 col-md-3">
            <q-btn label="Actualizar" color="red" icon="refresh" @click="consultar" :loading="loading" no-caps />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="porPagina"
              :options="[10, 20, 30, 50, 100]"
              label="Mostrar"
              outlined
              dense
              @update:model-value="cambiarPorPagina"
            />
          </div>
          <div class="col-12 col-md-6 text-right">
            <div class="text-caption q-mb-xs">
              Mostrando {{ desde }} a {{ hasta }} de {{ total }} registros
            </div>
            <q-pagination
              v-model="pagina"
              :max="Math.max(1, Math.ceil(total / porPagina))"
              max-pages="10"
              size="md"
              boundary-numbers
              @update:model-value="consultar"
              direction-links
              color="red"
            />
          </div>
        </div>

        <q-markup-table dense class="q-mt-md" flat bordered>
          <thead>
          <tr>
            <th class="text-right">Opciones</th>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Lote</th>
            <th>Fecha de vencimiento</th>
            <th>Estado</th>
            <th>Dias vencido</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(p, i) in productos" :key="p.id">
            <td class="text-right">
              <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
                <q-item clickable v-close-popup @click="verDetalle(p)">
                  <q-item-section avatar>
                    <q-icon name="visibility" />
                  </q-item-section>
                  <q-item-section>Detalle de compra</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="imprimirDetalle(p)">
                  <q-item-section avatar>
                    <q-icon name="print" />
                  </q-item-section>
                  <q-item-section>Imprimir pequeno</q-item-section>
                </q-item>
              </q-btn-dropdown>
            </td>
            <td>{{ (pagina - 1) * porPagina + i + 1 }}</td>
            <td>{{ p.producto?.nombre }}</td>
            <td>{{ p.cantidad_venta }}</td>
            <td>{{ p.lote }}</td>
            <td>{{ p.fecha_vencimiento }}</td>
            <td>
              <q-badge :color="p.estado === 'Activo' ? 'green' : 'red'" class="q-pa-xs">
                {{ p.estado }}
              </q-badge>
            </td>
            <td>
              <q-badge color="negative" class="q-pa-xs">
                {{ diasVencido(p.fecha_vencimiento) }} dias
              </q-badge>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="detalleDialog" persistent>
      <q-card style="max-width: 720px; width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalle de compra</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="detalleDialog = false" />
        </q-card-section>

        <q-card-section class="row q-col-gutter-sm">
          <div class="col-12 col-md-6">
            <div><b>Producto:</b> {{ detalleActual.producto?.nombre || '-' }}</div>
            <div><b>Lote:</b> {{ detalleActual.lote || '-' }}</div>
            <div><b>Fecha de vencimiento:</b> {{ detalleActual.fecha_vencimiento || '-' }}</div>
            <div><b>Cantidad vencida:</b> {{ detalleActual.cantidad_venta || 0 }}</div>
            <div><b>Cantidad comprada:</b> {{ detalleActual.cantidad || 0 }}</div>
          </div>
          <div class="col-12 col-md-6">
            <div><b>ID compra:</b> {{ detalleActual.compra?.id || '-' }}</div>
            <div><b>Compro:</b> {{ detalleActual.compra?.user?.name || '-' }}</div>
            <div><b>Proveedor:</b> {{ detalleActual.compra?.proveedor?.nombre || detalleActual.compra?.nombre || '-' }}</div>
            <div><b>Fecha:</b> {{ detalleActual.compra?.fecha || '-' }}</div>
            <div><b>Hora:</b> {{ detalleActual.compra?.hora || '-' }}</div>
            <div><b>Nro factura compra:</b> {{ detalleActual.compra?.nro_factura || detalleActual.nro_factura || '-' }}</div>
          </div>
          <div class="col-12">
            <div><b>Estado:</b> {{ detalleActual.estado || '-' }}</div>
            <div><b>Precio compra:</b> {{ Number(detalleActual.precio || 0).toFixed(2) }}</div>
            <div><b>Precio venta:</b> {{ Number(detalleActual.precio_venta || 0).toFixed(2) }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div id="printProductoVencido" class="hidden"></div>
  </q-page>
</template>

<script>
import moment from 'moment'
import { Printd } from 'printd'

export default {
  name: 'ProductosVencidos',
  data () {
    return {
      productos: [],
      loading: false,
      pagina: 1,
      porPagina: 10,
      total: 0,
      detalleDialog: false,
      detalleActual: {}
    }
  },
  computed: {
    farmaciaTipo () {
      return this.$route.meta?.farmaciaTipo || 'Farmacia'
    },
    farmaciaNombre () {
      return this.$route.meta?.farmaciaNombre || this.farmaciaTipo
    },
    desde () {
      if (this.total === 0) return 0
      return (this.pagina - 1) * this.porPagina + 1
    },
    hasta () {
      return Math.min(this.pagina * this.porPagina, this.total)
    }
  },
  mounted () {
    this.consultar()
  },
  methods: {
    consultar () {
      this.loading = true
      this.$axios.get('/productosVencidos', {
        params: {
          page: this.pagina,
          per_page: this.porPagina,
          farmacia_tipo: this.farmaciaTipo
        }
      }).then(res => {
        this.productos = res.data.data
        this.total = res.data.total
      }).catch(() => {
        this.$alert.error('Error al consultar productos vencidos')
      }).finally(() => {
        this.loading = false
      })
    },
    diasVencido (fechaVencimiento) {
      const vencimiento = moment(fechaVencimiento)
      const hoy = moment()
      const dias = hoy.diff(vencimiento, 'days')
      return dias < 0 ? 0 : dias
    },
    verDetalle (producto) {
      this.detalleActual = producto
      this.detalleDialog = true
    },
    imprimirDetalle (producto) {
      const compra = producto.compra || {}
      const proveedor = compra.proveedor?.nombre || compra.nombre || '-'
      const comprador = compra.user?.name || '-'
      const styles = `
        @page { size: 80mm auto; margin: 6mm; }
        .imprimir-scope { font-family: "Courier New", Courier, monospace; color: #111; }
        .imprimir-scope .ticket { width: 290px; margin: 0 auto; font-size: 11px; }
        .imprimir-scope .center { text-align: center; }
        .imprimir-scope .row { margin: 4px 0; }
        .imprimir-scope .label { font-weight: 700; }
        .imprimir-scope hr { border: 0; border-top: 1px dashed #000; margin: 8px 0; }
        .imprimir-scope .title { font-size: 14px; font-weight: 700; }
      `
      const html = `
        <div class="imprimir-scope">
          <div class="ticket">
            <div class="center title">CLINICA LA FUENTE</div>
            <div class="center">PRODUCTO VENCIDO - ${this.farmaciaNombre}</div>
            <hr>
            <div class="row"><span class="label">Producto:</span> ${producto.producto?.nombre || '-'}</div>
            <div class="row"><span class="label">Lote:</span> ${producto.lote || '-'}</div>
            <div class="row"><span class="label">Vencimiento:</span> ${producto.fecha_vencimiento || '-'}</div>
            <div class="row"><span class="label">Dias vencido:</span> ${this.diasVencido(producto.fecha_vencimiento)} dias</div>
            <div class="row"><span class="label">Cantidad vencida:</span> ${producto.cantidad_venta || 0}</div>
            <div class="row"><span class="label">Cantidad comprada:</span> ${producto.cantidad || 0}</div>
            <hr>
            <div class="row"><span class="label">Compra ID:</span> ${compra.id || '-'}</div>
            <div class="row"><span class="label">Compro:</span> ${comprador}</div>
            <div class="row"><span class="label">Proveedor:</span> ${proveedor}</div>
            <div class="row"><span class="label">Fecha:</span> ${compra.fecha || '-'}</div>
            <div class="row"><span class="label">Hora:</span> ${compra.hora || '-'}</div>
            <div class="row"><span class="label">Nro factura:</span> ${compra.nro_factura || producto.nro_factura || '-'}</div>
            <hr>
            <div class="row"><span class="label">Precio compra:</span> ${Number(producto.precio || 0).toFixed(2)}</div>
            <div class="row"><span class="label">Precio venta:</span> ${Number(producto.precio_venta || 0).toFixed(2)}</div>
          </div>
        </div>
      `
      const mount = document.getElementById('printProductoVencido')

      if (!mount) {
        this.$alert.error('No se pudo preparar la impresion')
        return
      }

      mount.innerHTML = html
      const node = mount.querySelector('.imprimir-scope')

      if (!node) {
        this.$alert.error('No se pudo preparar la impresion')
        return
      }

      const d = new Printd()
      d.print(node, styles)
    },
    cambiarPorPagina () {
      this.pagina = 1
      this.consultar()
    }
  }
}
</script>
