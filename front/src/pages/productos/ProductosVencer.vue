<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <div class="text-h6">Productos por Vencer en {{ dias }} días</div>
        <div class="row">
          <div class="col-12 col-md-10 q-pa-xs">
            <q-slider
              v-model="dias"
              :min="1"
              :max="365"
              label-always
              :label-value="`${dias} días`"
              color="primary"
              class="q-mt-md"
              @change="consultar"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn label="Consultar" color="green" icon="search" class="q-mt-md" @click="consultar" :loading="loading" no-caps />
          </div>
        </div>

        <q-markup-table dense class="q-mt-md" flat bordered>
          <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Lote</th>
            <th>Fecha de Vencimiento</th>
            <th>Estado</th>
            <th>Días restantes</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(p,i) in productos" :key="p.id">
            <td>{{ i + 1 }}</td>
            <td>{{ p.producto?.nombre }}</td>
            <td>{{ p.cantidad }}</td>
            <td>{{ p.lote }}</td>
            <td>{{ p.fecha_vencimiento }}</td>
            <td>
              <q-badge :color="p.estado === 'Activo' ? 'green' : 'red'" class="q-pa-xs">
                {{ p.estado }}
              </q-badge>
            </td>
            <td>
              <q-badge :color="diasRestantesColor(p.fecha_vencimiento).color" class="q-pa-xs">
                {{ diasRestantesColor(p.fecha_vencimiento).dias }} días
              </q-badge>
            </td>
          </tr>
          </tbody>
        </q-markup-table>

      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import moment from "moment";

export default {
  name: "ProductosPorVencer",
  data() {
    return {
      dias: 30,
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
    },
    diasRestantesColor(fechaVencimiento) {
      const hoy = moment();
      const vencimiento = moment(fechaVencimiento);
      const diasRestantes = vencimiento.diff(hoy, 'days');

      const tercio = Math.ceil(this.dias / 3);

      if (diasRestantes <= tercio) {
        return { color: 'red', dias: diasRestantes };
      } else if (diasRestantes <= tercio * 2) {
        return { color: 'orange', dias: diasRestantes };
      } else {
        return { color: 'green', dias: diasRestantes };
      }
    }
  }

}
</script>
