<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <div class="text-h6">Productos por Vencer en {{ dias }} días</div>
        <div class="row">
          <div class="col-10 q-pa-xs">
            <q-slider
              v-model="dias"
              :min="1"
              :max="30"
              label-always
              :label-value="`${dias} días`"
              color="primary"
              class="q-mt-md"
            />
          </div>
          <div class="col-2">
            <q-btn label="Consultar" color="green" icon="search" class="q-mt-md" @click="consultar" :loading="loading" no-caps />
          </div>
        </div>

        <q-markup-table dense class="q-mt-md" flat bordered>
          <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Lote</th>
            <th>Fecha de Vencimiento</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in productos" :key="p.id">
            <td>{{ p.producto?.nombre }}</td>
            <td>{{ p.cantidad }}</td>
            <td>{{ p.lote }}</td>
            <td>{{ p.fecha_vencimiento }}</td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "ProductosPorVencer",
  data() {
    return {
      dias: 5,
      productos: [],
      loading: false
    };
  },
  mounted() {
    this.consultar();
  },
  methods: {
    consultar() {
      this.loading = true;
      this.$axios.get('/productosPorVencer', { params: { dias: this.dias } })
        .then(res => {
          this.productos = res.data
        })
        .catch(() => {
          this.$alert.error("Error al consultar productos por vencer");
        }).finally(() => {
          this.loading = false;
        });
    }
  }
}
</script>
