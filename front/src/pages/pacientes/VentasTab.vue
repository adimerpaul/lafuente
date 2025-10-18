<template>
  <div>
    <!-- Encabezado y totales -->
    <div class="row items-center q-mb-sm">
      <div class="text-h6">
        Ventas
        <template v-if="paciente.paciente_ventas?.length">
          <span class="text-caption">
            ({{ paciente.paciente_ventas.length }})
          </span>
          <span class="text-h5 text-bold">
            {{
              paciente.paciente_ventas.reduce(
                (total, pv) => total + parseFloat(pv.venta.total || 0), 0
              ).toFixed(2)
            }} Bs.
          </span>
        </template>
      </div>
      <q-space />
      <q-btn
        icon="print"
        :loading="$store.loading || loading"
        unelevated
        color="primary"
        label="Imprimir proforma"
        no-caps
        class="q-ml-sm"
        @click="imprimirProforma"
      />

      <q-btn
        icon="add_shopping_cart"
        :loading="$store.loading || loading"
        unelevated
        color="positive"
        label="Nueva venta"
        no-caps
        @click="initNuevaVenta"
      />
    </div>

    <!-- Listado de ventas del paciente -->
    <q-list bordered>
      <q-item v-for="(pv, index) in paciente.paciente_ventas" :key="index">
        <q-item-section avatar>
          <q-avatar>
            <q-btn :label="pv.id" color="primary" flat />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <div>
              <span class="text-bold">Total: </span>
              <span>{{ Number(pv.venta.total || 0).toFixed(2) }}</span>
              <span class="text-bold"> Bs.</span>
            </div>
            <div>
              <span class="text-bold">Tipo de venta: </span>
              <span>{{ pv.venta.tipo_venta }}</span>
            </div>
            <div>
              <span class="text-bold">Productos: </span>
              <span>{{ pv.venta.detailsText }}</span>
            </div>
          </q-item-label>
          <q-item-label caption>
            <div>
              <span class="text-bold">Fecha de creación: </span>
              <span>{{ pv.fecha }}</span>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section side class="items-end">
          <span class="text-bold q-mb-xs">{{ pv.user?.name }}</span>
          <q-toggle
            v-model="pv.venta.pagado_interno"
            label="Pagado Interno"
            color="positive"
            :true-value="1"
            :false-value="0"
            @update:model-value="updateVenta(pv)"
            :loading="$store.loading"
          />
          <q-btn
            icon="delete"
            color="negative"
            class="q-mt-xs"
            size="10px"
            no-caps
            label="Quitar"
            :loading="$store.loading"
            @click="deleteVenta(pv)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- === SECCIÓN DE VENTA DIRECTA (BUSCAR PRODUCTOS + CARRITO) === -->
    <q-separator class="q-my-md" />
    <div class="text-subtitle1 q-mb-sm">Crear venta</div>

    <div class="row">
      <!-- LISTA PRODUCTOS -->
      <div class="col-12 col-md-7 q-pa-xs">
        <q-input
          ref="inputBuscarProducto"
          v-model="productosSearch"
          outlined
          clearable
          label="Buscar producto"
          dense
          debounce="300"
          @update:model-value="productosGet"
        >
          <template #append>
            <q-btn flat round dense icon="search" />
          </template>
        </q-input>

        <div class="flex flex-center">
          <q-pagination
            size="xs"
            v-model="pagination.page"
            :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage) || 1"
            color="primary"
            @update:model-value="productosGet"
            boundary-numbers
            max-pages="5"
          />
        </div>

        <div class="row">
          <template v-for="producto in productos" :key="producto.id">
            <div class="col-6 col-md-3">
              <q-card
                flat
                bordered
                class="cursor-pointer q-mb-sm"
                @click="openLoteDialog(producto)"
              >
                <q-img
                  :src="`${$url}../images/${producto.imagen}`"
                  style="height: 120px;"
                >
                  <div class="absolute-bottom text-center">
                    <div style="max-width: 190px;line-height: 0.9;">
                      {{ $filters.textUpper(producto.nombre) }}
                    </div>
                    <div class="row no-wrap items-center justify-between">
                      <span>{{ producto.cantidad }}</span>
                      <span class="text-bold bg-orange text-black border q-px-xs">
                        {{ Number(producto.precio || 0).toFixed(2) }} Bs
                      </span>
                    </div>
                  </div>
                </q-img>
              </q-card>
            </div>
          </template>
        </div>
      </div>

      <!-- CARRITO / DETALLE -->
      <div class="col-12 col-md-5 q-pa-xs">
        <div class="row items-center">
          <div class="col-12 col-md-7 q-pa-xs">
            <q-select
              v-model="venta.doctor_id"
              :options="doctores.map(d => ({ label: `${d.nombre} — ${d.especialidad || 'SN'}`, value: d.id }))"
              outlined dense clearable use-input input-debounce="0"
              label="Doctor (opcional)"
              emit-value map-options
            />
          </div>
          <div class="col-12 col-md-5 q-pa-xs text-right">
            <q-btn
              icon="delete"
              size="10px"
              color="red"
              dense flat no-caps
              label="Limpiar"
              @click="productosVentas = []"
            />
          </div>
        </div>

        <q-markup-table dense wrap-cells flat bordered>
          <thead>
          <tr>
            <th>Producto</th>
            <th>Lote</th>
            <th>Vence</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subt.</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in productosVentas" :key="index">
            <td style="padding:0;margin:0;display:flex;align-items:center;">
              <q-img
                :src="`${$url}../images/${item.producto?.imagen}`"
                style="height: 35px;width: 35px;"
                class="q-mr-sm"
              />
              <div style="max-width:190px;overflow:hidden;text-overflow:ellipsis;line-height:.9;">
                <q-icon
                  name="delete"
                  color="red"
                  class="cursor-pointer q-mr-xs"
                  @click="productosVentas.splice(index, 1)"
                />
                {{ $filters.textUpper(item.producto?.nombre) }}
              </div>
            </td>
            <td>{{ item.lote || '—' }}</td>
            <td>{{ item.fecha_vencimiento || '—' }}</td>
            <td style="padding:0;margin:0;">
              <input v-model.number="item.cantidad" type="number" style="width:60px;" min="1" />
            </td>
            <td style="padding:0;margin:0;">
              <input v-model.number="item.precio" type="number" style="width:70px;" step="0.01" />
            </td>
            <td class="text-right">
              {{ (Number(item.cantidad) * Number(item.precio)).toFixed(2) }} Bs
            </td>
          </tr>
          <tr v-if="!productosVentas.length">
            <td colspan="6" class="text-center text-grey">Sin productos en el carrito</td>
          </tr>
          </tbody>
          <tfoot>
          <tr>
            <td colspan="5" class="text-right text-bold">Total</td>
            <td class="text-right text-bold">
              {{ totalVenta.toFixed(2) }} Bs
            </td>
          </tr>
          </tfoot>
        </q-markup-table>

        <q-btn
          label="Realizar venta"
          color="positive"
          class="full-width q-mt-sm"
          no-caps
          :loading="loading"
          @click="clickDialogVenta"
          icon="check_circle"
        />
      </div>
    </div>

    <!-- Confirmación / Datos del cliente -->
    <q-dialog v-model="ventaDialog">
      <q-card style="max-width: 780px; width: 95vw">
        <q-card-section class="q-pb-none row items-center">
          <div class="text-h6">Confirmar venta</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="ventaDialog = false" />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="submitVenta">
            <div class="row">
              <div class="col-12 col-md-3 q-pa-xs">
                <q-input v-model="venta.nit" outlined dense label="CI/NIT" @update:model-value="searchCliente" :debounce="500"/>
              </div>
              <div class="col-12 col-md-3 q-pa-xs">
                <q-input v-model="venta.nombre" outlined dense label="Nombre" />
              </div>
              <div class="col-12 col-md-3 q-pa-xs">
                <q-input v-model="venta.email" outlined dense label="Email" />
              </div>
              <div class="col-12 col-md-3 q-pa-xs">
                <q-select v-model="venta.tipo_venta" outlined dense label="Tipo de venta" :options="['Internado', 'Externo']" />
              </div>

              <div class="col-12 col-md-6 q-pa-xs">
                <q-select
                  v-model="venta.doctor_id"
                  :options="doctores.map(d => ({ label: `${d.nombre} — ${d.especialidad || 'SN'}`, value: d.id }))"
                  outlined dense
                  label="Doctor (opcional)"
                  clearable
                  emit-value
                  map-options
                />
              </div>

              <div class="col-12 col-md-3 q-pa-xs">
                <q-input v-model="venta.complemento" outlined dense label="Complemento" />
              </div>
              <div class="col-12 col-md-3 q-pa-xs">
                <q-select v-model="venta.tipo_pago" outlined dense label="Tipo de pago" :options="['Efectivo', 'QR']"/>
              </div>
              <div class="col-12 col-md-6 q-pa-xs">
                <q-select
                  v-model="venta.codigoTipoDocumentoIdentidad"
                  outlined dense label="Tipo de documento"
                  :options="codigoTipoDocumentoIdentidades"
                  emit-value
                  map-options
                />
              </div>

              <div class="col-12 q-pa-xs">
                <q-markup-table dense wrap-cells flat bordered>
                  <thead>
                  <tr>
                    <th>ID</th><th>Producto</th><th>Lote</th><th>Vence</th><th>Cant.</th><th>Precio</th><th>Subtotal</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, i) in productosVentas" :key="'prev-'+i">
                    <td>{{ item.producto_id }}</td>
                    <td style="padding:0;margin:0;">
                      <div style="max-width:190px;overflow:hidden;text-overflow:ellipsis;line-height:.9;">
                        {{ $filters.textUpper(item.producto?.nombre || '') }}
                      </div>
                    </td>
                    <td>{{ item.lote || '—' }}</td>
                    <td>{{ item.fecha_vencimiento || '—' }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>{{ Number(item.precio).toFixed(2) }} Bs</td>
                    <td class="text-right">{{ (Number(item.cantidad) * Number(item.precio)).toFixed(2) }} Bs</td>
                  </tr>
                  </tbody>
                  <tfoot>
                  <tr>
                    <td colspan="6" class="text-right text-bold">Total</td>
                    <td class="text-right text-bold">{{ totalVenta.toFixed(2) }} Bs</td>
                  </tr>
                  <tr>
                    <td colspan="6" class="text-right text-bold">Efectivo</td>
                    <td class="text-right">
                      <input v-model.number="efectivo" type="number" step="0.01" style="width: 110px" />
                    </td>
                  </tr>
                  <tr>
                    <td colspan="6" class="text-right text-bold">Cambio</td>
                    <td class="text-right">{{ cambio }}</td>
                  </tr>
                  </tfoot>
                </q-markup-table>
              </div>

              <div class="col-12 q-pa-xs">
                <q-btn label="Confirmar y guardar" color="positive" class="full-width" no-caps :loading="loading" type="submit" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- DIALOGO SELECCIONAR LOTE -->
    <q-dialog v-model="loteDialog" persistent>
      <q-card style="max-width: 720px; width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Seleccionar lote</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="loteDialog = false" />
        </q-card-section>

        <q-card-section>
          <div class="q-mb-sm text-subtitle2">
            Producto: <b>{{ $filters.textUpper(loteProducto?.nombre || '') }}</b>
          </div>

          <q-markup-table dense flat bordered wrap-cells>
            <thead>
            <tr>
              <th>#</th><th>Lote</th><th>Vencimiento</th><th>Disponible</th><th>Elegir</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="lotesLoading">
              <td colspan="5" class="text-center">Cargando…</td>
            </tr>
            <tr v-for="(l, i) in lotes" :key="l.id">
              <td>{{ i+1 }}</td>
              <td>{{ l.lote || '—' }}</td>
              <td>{{ l.fecha_vencimiento || '—' }}</td>
              <td class="text-right">{{ l.disponible }}</td>
              <td><q-btn size="xs" color="primary" flat no-caps label="Elegir" @click="onPickLote(l)" /></td>
            </tr>
            <tr v-if="!lotesLoading && lotes.length === 0">
              <td colspan="5" class="text-center text-negative">Sin lotes disponibles</td>
            </tr>
            </tbody>
          </q-markup-table>

          <div v-if="loteSelected" class="row q-col-gutter-sm q-mt-sm">
            <div class="col-12 col-md-4">
              <q-input
                v-model.number="loteCantidad"
                type="number"
                dense outlined
                label="Cantidad a vender"
                :min="1"
                :max="Number(loteSelected.disponible || 0)"
              />
            </div>
            <div class="col-12 col-md-5">
              <div><b>Lote:</b> {{ loteSelected.lote || '—' }}</div>
              <div><b>Vence:</b> {{ loteSelected.fecha_vencimiento || '—' }}</div>
            </div>
            <div class="col-12 col-md-3 flex items-end">
              <q-btn
                color="primary"
                icon="add"
                label="Agregar"
                no-caps
                @click="confirmarLote"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Imprimir } from "src/addons/Imprimir";

export default {
  name: "VentasTab",
  props: {
    paciente: { type: Object, required: true }
  },
  emits: ["pacienteGet"],
  data () {
    return {
      // catálogo
      codigoTipoDocumentoIdentidades: [
        {value: 1, label: 'CI - CEDULA DE IDENTIDAD'},
        {value: 2, label: 'CEX - CED ULA DE IDENTIDAD DE EXTRANJERO'},
        {value: 5, label: 'NIT - NÚMERO DE IDENTIFICACIÓN TRIBUTARIA'},
        {value: 3, label: 'PAS - PASAPORTE'},
        {value: 4, label: 'OD - OTRO DOCUMENTO DE IDENTIDAD'},
      ],
      productos: [],
      productosSearch: "",
      pagination: { page: 1, rowsPerPage: 24, rowsNumber: 0 },

      // carrito
      productosVentas: [],

      // doctores
      doctores: [],

      // venta
      ventaDialog: false,
      loading: false,
      efectivo: '',
      venta: {
        nit: "0",
        nombre: "SN",
        email: "",
        codigoTipoDocumentoIdentidad: 1,
        tipo_venta: "Externo",
        tipo_pago: "Efectivo",
        complemento: "",
        doctor_id: null
      },

      // lotes
      loteDialog: false,
      lotesLoading: false,
      lotes: [],
      loteSelected: null,
      loteCantidad: 1,
      loteProducto: null
    }
  },
  mounted () {
    this.prefillClienteDesdePaciente();
    this.productosGet();
    this.doctoresGet();
    this.$nextTick(() => this.$refs.inputBuscarProducto?.focus());
  },
  methods: {
    prefillClienteDesdePaciente () {
      // Rellenar con datos del paciente cuando existan
      const p = this.paciente || {};
      this.venta.nit = (p.identificacion || p.ci || "0").toString();
      this.venta.nombre = (p.nombre_completo || [p.nombre, p.apellido].filter(Boolean).join(' ') || 'SN');
      // email si lo tuvieras en el modelo de paciente
    },

    // === Catálogo ===
    productosGet () {
      this.loading = true;
      this.$axios.get("productosCantidad", {
        params: {
          search: this.productosSearch,
          page: this.pagination.page,
          per_page: this.pagination.rowsPerPage
        }
      }).then(res => {
        this.productos = res.data.data || [];
        this.pagination.rowsNumber = res.data.total || 0;
        this.pagination.page = res.data.current_page || 1;

        // escáner por código de barras (si coincide exacto)
        if (this.productos.length === 1 && this.productos[0].barra === this.productosSearch) {
          this.openLoteDialog(this.productos[0]);
          this.productosSearch = "";
        }
      }).catch(err => {
        console.error(err);
        this.$q.notify({ type: 'negative', message: 'No se pudieron cargar productos' });
      }).finally(() => { this.loading = false; });
    },

    doctoresGet () {
      this.$axios.get('doctores')
        .then(res => { this.doctores = res.data || []; })
        .catch(() => this.$q.notify({ type: 'negative', message: 'No se pudieron cargar los doctores' }));
    },

    // === Lotes ===
    async openLoteDialog (producto) {
      this.loteProducto = producto;
      this.loteDialog = true;
      this.lotes = [];
      this.lotesLoading = true;
      try {
        const res = await this.$axios.get(`productos/${producto.id}/historial-compras-ventas`);
        this.lotes = res.data || [];
        if (this.lotes.length === 1) this.onPickLote(this.lotes[0]);
      } catch (e) {
        console.error(e);
        this.$q.notify({ type: 'negative', message: 'No se pudieron cargar los lotes' });
        this.loteDialog = false;
      } finally {
        this.lotesLoading = false;
      }
    },
    onPickLote (lote) {
      this.loteSelected = lote;
      this.loteCantidad = 1;
    },
    confirmarLote () {
      if (!this.loteSelected) {
        this.$q.notify({ type: 'negative', message: 'Selecciona un lote' });
        return;
      }
      const disp = Number(this.loteSelected.disponible || 0);
      const cant = Number(this.loteCantidad || 0);
      if (cant <= 0 || cant > disp) {
        this.$q.notify({ type: 'negative', message: 'Cantidad inválida para el lote' });
        return;
      }

      // Agregar al carrito con el precio actual del producto (editable en la tabla)
      this.productosVentas.push({
        producto_id: this.loteProducto.id,
        cantidad: cant,
        precio: Number(this.loteProducto.precio || 0),
        producto: this.loteProducto,
        compra_detalle_id: this.loteSelected.id,
        lote: this.loteSelected.lote,
        fecha_vencimiento: this.loteSelected.fecha_vencimiento
      });

      // limpiar selección
      this.loteDialog = false;
      this.loteSelected = null;
      this.loteProducto = null;
      this.loteCantidad = 1;
    },

    // === Cliente ===
    searchCliente () {
      this.loading = true;
      this.$axios.post("searchCliente", { nit: this.venta.nit })
        .then(res => {
          this.venta.nombre = res.data?.nombre || this.venta.nombre || 'SN';
          this.venta.email = res.data?.email || '';
          this.venta.codigoTipoDocumentoIdentidad = parseInt(res.data?.codigoTipoDocumentoIdentidad || 1);
          this.venta.complemento = res.data?.complemento || '';
        })
        .catch(() => {})
        .finally(() => { this.loading = false; });
    },

    // === Venta ===
    initNuevaVenta () {
      // abre el flujo dejando el cursor en buscar producto
      this.$nextTick(() => this.$refs.inputBuscarProducto?.focus());
    },
    imprimirProforma () {
      if (!this.paciente?.id) {
        this.$q.notify({ type: 'negative', message: 'Paciente inválido' });
        return;
      }
      // Si tu backend sirve el API en la misma base de $url:
      const url = `${this.$url}/../pacientes/${this.paciente.id}/proforma-pdf`;
      window.open(url, '_blank'); // abre el PDF en otra pestaña
    },
    clickDialogVenta () {
      if (this.productosVentas.length === 0) {
        this.$q.notify({ type: 'negative', message: 'Debe agregar al menos un producto' });
        return;
      }
      // por defecto a Externo, puedes ajustar según clínica
      if (!this.venta.tipo_venta) this.venta.tipo_venta = 'Externo';
      this.efectivo = '';
      this.ventaDialog = true;
    },

    async submitVenta () {
      try {
        this.loading = true;

        // 1) Crear venta
        const res = await this.$axios.post("ventas", {
          ci: this.venta.nit,
          nombre: this.venta.nombre,
          email: this.venta.email,
          codigoTipoDocumentoIdentidad: this.venta.codigoTipoDocumentoIdentidad,
          complemento: this.venta.complemento,
          productos: this.productosVentas,
          tipo_venta: this.venta.tipo_venta,
          tipo_pago: this.venta.tipo_pago,
          receta_id: null,
          doctor_id: this.venta.doctor_id
        });

        const ventaCreada = res.data;

        // 2) Vincular a paciente (paciente_ventas)
        await this.$axios.post("paciente_ventas", {
          venta_id: ventaCreada.id,
          paciente_id: this.paciente.id
        });

        // 3) Feedback, imprimir, limpiar, refrescar
        this.$alert?.success?.("Venta realizada con éxito") || this.$q.notify({ type: 'positive', message: 'Venta realizada con éxito' });
        Imprimir.reciboVentaSimple(ventaCreada);

        this.productosVentas = [];
        this.ventaDialog = false;
        // reset mínimos (conservar doctor si quieres)
        this.venta = {
          ...this.venta,
          nit: this.venta.nit, // conserva nit del paciente
          nombre: this.venta.nombre, // conserva nombre
          email: '',
          complemento: '',
          tipo_venta: 'Externo',
          tipo_pago: 'Efectivo'
        };

        this.$emit("pacienteGet");
        this.$nextTick(() => this.$refs.inputBuscarProducto?.focus());
        this.productosGet();
      } catch (error) {
        console.error(error);
        this.$alert?.error?.(error?.response?.data?.message || "No se pudo realizar la venta")
        || this.$q.notify({ type:'negative', message: error?.response?.data?.message || 'No se pudo realizar la venta' });
      } finally {
        this.loading = false;
      }
    },

    // === Acciones sobre ventas ya vinculadas ===
    updateVenta (pv) {
      this.$store.loading = true;
      this.$axios.put("paciente_ventas/" + pv.id, {
        pagado_interno: pv.venta.pagado_interno
      }).then(() => {
        this.$emit("pacienteGet");
        this.$alert?.success?.("Venta actualizada correctamente");
      }).catch(error => {
        this.$alert?.error?.(error?.response?.data?.message || 'No se pudo actualizar la venta');
      }).finally(() => { this.$store.loading = false; });
    },
    deleteVenta (pv) {
      this.$alert.dialog("¿Está seguro de quitar la venta?").onOk(() => {
        this.$store.loading = true;
        this.$axios.delete("paciente_ventas/" + pv.id)
          .then(() => {
            this.$emit("pacienteGet");
            this.$alert?.success?.("Venta quitada correctamente");
          })
          .catch(error => this.$alert?.error?.(error?.response?.data?.message || 'No se pudo quitar la venta'))
          .finally(() => { this.$store.loading = false; });
      });
    }
  },
  computed: {
    totalVenta () {
      return this.productosVentas.reduce(
        (acc, it) => acc + (Number(it.cantidad) * Number(it.precio)), 0
      );
    },
    cambio () {
      let c = Number(this.efectivo || 0) - this.totalVenta;
      if (c < 0) c = 0;
      return c.toFixed(2);
    }
  }
}
</script>
