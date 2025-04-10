<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Compras</div>
        <q-btn flat round dense icon="arrow_back" @click="$router.go(-1)" />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-form @submit="clickDialogCompra">
          <div class="row">
            <!-- Buscar productos -->
            <div class="col-12 col-md-6 q-pa-xs">
              <q-input v-model="productosSearch" outlined clearable label="Buscar producto" dense debounce="300" @update:modelValue="productosGet">
                <template v-slot:append>
                  <q-btn flat round dense icon="search" />
                </template>
              </q-input>
              <div class="flex flex-center">
                <q-pagination
                  v-model="pagination.page"
                  :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
                  max-pages="5"
                  size="xs"
                  boundary-numbers
                  @update:model-value="productosGet"
                  class="q-mt-sm"
                />
              </div>
<!--              <q-markup-table dense wrap-cells flat bordered>-->
<!--                <thead>-->
<!--                <tr>-->
<!--                  <th>ID</th>-->
<!--                  <th>Nombre</th>-->
<!--                  <th>Unidad</th>-->
<!--                  <th>Precio</th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                <tr v-for="(producto, index) in productos" :key="index" @click="addProducto(producto)">-->
<!--                  <td>{{ producto.id }}</td>-->
<!--                  <td>-->
<!--                    <div style="max-width: 200px; wrap-option: warp;line-height: 0.9;">-->
<!--                      {{ producto.nombre }}-->
<!--                    </div>-->
<!--                  </td>-->
<!--                  <td>-->
<!--                    <div style="max-width: 100px; wrap-option: warp;line-height: 0.9;">-->
<!--                      {{ producto.unidad }}-->
<!--                    </div>-->
<!--                  </td>-->
<!--                  <td class="text-right">{{ producto.precio }}</td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--              </q-markup-table>-->
              <div class="row">
                <template v-for="producto in productos">
                  <div class="col-6 col-md-2">
                    <q-card flat bordered class="cursor-pointer" @click="addProducto(producto)">
                      <q-img
                        :src="`${$url}../images/${producto.imagen}`"
                        class="q-mb-xs"
                        style="height: 120px;"
                      >
                        <div class="absolute-bottom text-center" style="padding: 0;margin: 0;">
                          <div style="max-width: 190px;line-height: 0.9;">
                            {{ $filters.textUpper( producto.nombre ) }}
                          </div>
                          <div style="display: flex;justify-content: space-between;">
                            <span>{{ producto.stock }}</span>
                            <span class="text-bold bg-orange text-black border">{{ producto.precio }} Bs</span>
                          </div>
                        </div>
                      </q-img>
                    </q-card>
                  </div>
                </template>
              </div>
            </div>

            <!-- Lista de productos agregados -->
            <div class="col-12 col-md-6 q-pa-xs">
              <div>
                <q-btn size="xs" flat round dense icon="delete" color="red" @click="productosCompras = []" class="q-mb-sm" />
                <span class="text-subtitle2">Productos seleccionados</span>
              </div>
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Producto</th>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Cantidad</th>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Precio unitario</th>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Subtotal</th>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Precio unitario 1.3</th>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Subtotal</th>
                  <th class="pm-none" style="max-width: 100px;line-height: 0.9">Precio venta</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(producto, index) in productosCompras" :key="index">
                  <td class="pm-none" style="display: flex;align-items: center;">
                    <q-img :src="`${$url}../images/${producto.producto?.imagen}`" class="q-mb-xs" style="height: 35px;width: 35px;" />
                    <div style="max-width: 120px; wrap-option: warp;line-height: 0.9;">
                      <q-icon name="delete" color="red" class="cursor-pointer" @click="productosCompras.splice(index, 1)" />
<!--                      {{ producto.producto?.nombre }}-->
                        {{ $filters.textUpper( producto.producto?.nombre ) }}
                    </div>
                  </td>
                  <td class="pm-none"><input v-model="producto.cantidad" type="number" style="width: 50px;" /></td>
                  <td class="pm-none"><input v-model="producto.precio" type="number" style="width: 55px;" step="0.01" /></td>
                  <td class="text-right pm-none">{{ producto.cantidad * producto.precio }} Bs</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3" class="text-right">Total</td>
                  <td class="text-right">{{ totalCompra }} Bs</td>
                </tr>
                </tfoot>
              </q-markup-table>
              <q-btn label="Registrar compra" color="primary" class="full-width" no-caps :loading="loading" type="submit" icon="add_circle_outline" />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Diálogo de confirmación de compra -->
    <q-dialog v-model="compraDialog">
      <q-card style="width: 600px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirmar compra</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="compraDialog = false" />
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitCompra">
            <div class="row">
              <div class="col-12 col-md-6 q-pa-xs">
                <q-input v-model="compra.nit" outlined dense label="CI/NIT proveedor" @update:modelValue="buscarProveedor" />
              </div>
              <div class="col-12 col-md-6 q-pa-xs">
                <q-input v-model="compra.nombre" outlined dense label="Nombre proveedor" />
              </div>
              <div class="col-12 col-md-6 q-pa-xs">
                <q-select v-model="compra.tipo_pago" :options="['Efectivo', 'QR']" label="Tipo de pago" dense outlined />
              </div>
            </div>

            <q-btn label="Guardar compra" color="primary" class="full-width q-mt-md" type="submit" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
export default {
  name: "ComprasCreate",
  data() {
    return {
      loading: false,
      compraDialog: false,
      productos: [],
      productosSearch: "",
      productosCompras: [],
      compra: {
        nit: "",
        nombre: "",
        tipo_pago: "Efectivo"
      },
      pagination: {
        page: 1,
        rowsPerPage: 24,
        rowsNumber: 0
      }
    };
  },
  computed: {
    totalCompra() {
      return this.productosCompras.reduce(
        (acc, p) => acc + (p.cantidad * p.precio),
        0
      );
    },
  },
  methods: {
    productosGet() {
      this.loading = true;
      this.$axios.get("productos", {
        params: {
          search: this.productosSearch,
          page: this.pagination.page,
          per_page: this.pagination.rowsPerPage
        },
      }).then((res) => {
        this.productos = res.data.data;
        this.pagination.rowsNumber = res.data.total;
      }).catch((error) => {
        console.error("Error cargando productos:", error);
      }).finally(() => {
        this.loading = false;
      });
    },
    addProducto(producto) {
      const existente = this.productosCompras.find(p => p.producto_id === producto.id);
      if (existente) {
        existente.cantidad += 1;
      } else {
        this.productosCompras.push({
          producto_id: producto.id,
          cantidad: 1,
          precio: producto.precio,
          producto,
        });
      }
    },
    clickDialogCompra() {
      if (this.productosCompras.length === 0) {
        this.$alert.error("Debe agregar al menos un producto");
        return;
      }
      this.compraDialog = true;
    },
    buscarProveedor() {
      if (!this.compra.nit) return;
      this.loading = true;
      this.$axios.post("searchProveedor", { nit: this.compra.nit }).then((res) => {
        if (res.data?.nombre) {
          this.compra.nombre = res.data.nombre;
        }
      }).catch((err) => {
        console.warn("Proveedor no encontrado", err);
      }).finally(() => {
        this.loading = false;
      });
    },
    submitCompra() {
      this.loading = true;
      const data = {
        ci: this.compra.nit,
        nombre: this.compra.nombre,
        tipo_pago: this.compra.tipo_pago,
        productos: this.productosCompras,
      };

      this.$axios.post("compras", data).then((res) => {
        this.$alert.success("Compra registrada correctamente");
        this.compraDialog = false;
        this.productosCompras = [];
      }).catch((err) => {
        console.error("Error registrando compra:", err);
        this.$alert.error("Error al registrar la compra");
      }).finally(() => {
        this.loading = false;
      });
    },
  },
  mounted() {
    this.productosGet();
  }
};
</script>
