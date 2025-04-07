<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Compras</div>
        <q-btn flat round dense icon="arrow_back" @click="$router.go(-1)" />
      </q-card-section>

      <q-card-section>
        <q-form @submit="clickDialogCompra">
          <div class="row">
            <!-- Buscar productos -->
            <div class="col-12 col-md-7 q-pa-xs">
              <q-input v-model="productosSearch" outlined clearable label="Buscar producto" dense debounce="300" @update:modelValue="productosGet">
                <template v-slot:append>
                  <q-btn flat round dense icon="search" />
                </template>
              </q-input>

              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(producto, index) in productos" :key="index" @click="addProducto(producto)">
                  <td>{{ producto.id }}</td>
                  <td>
                    <div>
                      {{ producto.nombre }}
                    </div>
                  </td>
                  <td>{{ producto.unidad }}</td>
                  <td>{{ producto.precio }} Bs</td>
                </tr>
                </tbody>
              </q-markup-table>
            </div>

            <!-- Lista de productos agregados -->
            <div class="col-12 col-md-5 q-pa-xs">
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(producto, index) in productosCompras" :key="index">
                  <td>
                    <q-icon name="delete" color="red" class="cursor-pointer" @click="productosCompras.splice(index, 1)" />
                    {{ producto.producto?.nombre }}
                  </td>
                  <td><input v-model="producto.cantidad" type="number" style="width: 50px;" /></td>
                  <td><input v-model="producto.precio" type="number" style="width: 50px;" step="0.01" /></td>
                  <td class="text-right">{{ producto.cantidad * producto.precio }} Bs</td>
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
        params: { search: this.productosSearch },
      }).then((res) => {
        this.productos = res.data.data;
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
