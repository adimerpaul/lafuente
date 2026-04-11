<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <div class="text-h6">Productos Vencidos</div>

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
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Lote</th>
            <th>Fecha de vencimiento</th>
            <th>Estado</th>
            <th>Días vencido</th>
            <th class="text-right">Opciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(p, i) in productos" :key="p.id">
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
                {{ diasVencido(p.fecha_vencimiento) }} días
              </q-badge>
            </td>
            <td class="text-right">
              <q-btn-dropdown color="primary" label="Opciones" no-caps dense>
                <q-item clickable v-close-popup @click="verDetalle(p)">
                  <q-item-section avatar>
                    <q-icon name="visibility" />
                  </q-item-section>
                  <q-item-section>Detalle de compra</q-item-section>
                </q-item>
              </q-btn-dropdown>
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
            <div><b>Compró:</b> {{ detalleActual.compra?.user?.name || '-' }}</div>
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
  </q-page>
</template>

<script>
import moment from "moment";

export default {
  name: "ProductosVencidos",
  data() {
    return {
      productos: [],
      loading: false,
      pagina: 1,
      porPagina: 10,
      total: 0,
      detalleDialog: false,
      detalleActual: {}
    };
  },
  mounted() {
    this.consultar();
  },
  methods: {
    consultar() {
      this.loading = true;
      this.$axios.get('/productosVencidos', {
        params: {
          page: this.pagina,
          per_page: this.porPagina
        }
      }).then(res => {
        this.productos = res.data.data;
        this.total = res.data.total;
      }).catch(() => {
        this.$alert.error("Error al consultar productos vencidos");
      }).finally(() => {
        this.loading = false;
      });
    },
    diasVencido(fechaVencimiento) {
      const vencimiento = moment(fechaVencimiento);
      const hoy = moment();
      const dias = hoy.diff(vencimiento, 'days');
      return dias < 0 ? 0 : dias;
    },
    verDetalle(producto) {
      this.detalleActual = producto;
      this.detalleDialog = true;
    },
    cambiarPorPagina() {
      this.pagina = 1;
      this.consultar();
    }
  },
  computed: {
    desde() {
      if (this.total === 0) return 0;
      return (this.pagina - 1) * this.porPagina + 1;
    },
    hasta() {
      return Math.min(this.pagina * this.porPagina, this.total);
    }
  }
}
</script>
