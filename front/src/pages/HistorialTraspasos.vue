<template>
  <q-page class="q-pa-xs">
    <div class="row">
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-indigo">
              <q-item-section avatar>
                <q-icon name="swap_horiz" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Traspasos activos</q-item-label>
                <q-item-label class="text-white text-h4">{{ totalActivos }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-negative">
              <q-item-section avatar>
                <q-icon name="cancel" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Traspasos anulados</q-item-label>
                <q-item-label class="text-white text-h4">{{ totalAnulados }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-green">
              <q-item-section avatar>
                <q-icon name="payments" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Total traspasado</q-item-label>
                <q-item-label class="text-white text-h4">{{ totalMonto }} Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <div class="row q-col-gutter-sm q-pa-sm">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filtroFarmacia"
                  :options="['Farmacia', 'Farmacia institucional']"
                  label="Farmacia origen"
                  dense
                  outlined
                  @update:model-value="cargarTraspasos"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="filtroEstado"
                  :options="['Todos', 'Activo', 'Anulado']"
                  label="Estado"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-2">
                <q-btn color="primary" label="Buscar" icon="search" no-caps :loading="cargando" @click="cargarTraspasos" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-markup-table dense wrap-cells class="q-mt-sm">
      <thead>
      <tr class="bg-primary text-white">
        <th>Acciones</th>
        <th>ID</th>
        <th>Fecha</th>
        <th>Origen</th>
        <th>Destino</th>
        <th>Usuario</th>
        <th>Estado</th>
        <th>Total</th>
        <th>Detalle</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="traspaso in traspasosFiltrados" :key="traspaso.venta_id">
        <td>
          <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
            <q-item clickable v-close-popup @click="imprimir(traspaso)">
              <q-item-section avatar><q-icon name="print" /></q-item-section>
              <q-item-section>Imprimir</q-item-section>
            </q-item>
            <q-item
              v-if="traspaso.estado === 'Activo'"
              clickable
              v-close-popup
              @click="anularTraspaso(traspaso.venta_id)"
            >
              <q-item-section avatar><q-icon name="delete" /></q-item-section>
              <q-item-section>Anular</q-item-section>
            </q-item>
          </q-btn-dropdown>
        </td>
        <td>{{ traspaso.venta_id }}</td>
        <td>{{ traspaso.fecha }} {{ traspaso.hora }}</td>
        <td><q-chip color="blue-1" text-color="blue" dense>{{ traspaso.farmacia_origen }}</q-chip></td>
        <td><q-chip color="green-1" text-color="green" dense>{{ traspaso.farmacia_destino }}</q-chip></td>
        <td>{{ traspaso.user?.name }}</td>
        <td>
          <q-chip :color="traspaso.estado === 'Activo' ? 'positive' : 'negative'" class="text-white" dense>
            {{ traspaso.estado }}
          </q-chip>
        </td>
        <td class="text-bold">{{ traspaso.total }} Bs</td>
        <td>
          <div style="max-width: 220px; line-height: 1.1;">
            {{ traspaso.detailsText }}
          </div>
        </td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
import { Imprimir } from 'src/addons/Imprimir'

export default {
  name: 'HistorialTraspasos',
  data() {
    return {
      traspasos: [],
      filtroFarmacia: 'Farmacia',
      filtroEstado: 'Todos',
      cargando: false,
      traspasoAnulando: null
    }
  },
  computed: {
    traspasosFiltrados() {
      if (this.filtroEstado === 'Todos') return this.traspasos
      return this.traspasos.filter(item => item.estado === this.filtroEstado)
    },
    totalActivos() {
      return this.traspasos.filter(item => item.estado === 'Activo').length
    },
    totalAnulados() {
      return this.traspasos.filter(item => item.estado === 'Anulado').length
    },
    totalMonto() {
      return this.traspasos
        .filter(item => item.estado === 'Activo')
        .reduce((acc, item) => acc + Number(item.total || 0), 0)
        .toFixed(2)
    }
  },
  mounted() {
    this.cargarTraspasos()
  },
  methods: {
    cargarTraspasos() {
      this.cargando = true
      this.$axios
        .get('traspasos', {
          params: { farmacia_tipo: this.filtroFarmacia }
        })
        .then(res => {
          this.traspasos = res.data || []
        })
        .catch(err => {
          this.$alert.error(err.response?.data?.message || 'Error al cargar traspasos')
          this.traspasos = []
        })
        .finally(() => {
          this.cargando = false
        })
    },
    imprimir(traspaso) {
      Imprimir.reciboTraspaso({
        id: traspaso.venta_id,
        fecha: traspaso.fecha,
        hora: traspaso.hora,
        total: traspaso.total,
        farmacia_origen: traspaso.farmacia_origen,
        farmacia_destino: traspaso.farmacia_destino,
        user: traspaso.user,
        venta_detalles: traspaso.venta_detalles,
        comentario: traspaso.comentario
      })
    },
    anularTraspaso(ventaId) {
      this.$q.dialog({
        title: 'Anular traspaso',
        message: '¿Deseas anular este traspaso? Se revertirá el stock.',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.traspasoAnulando = ventaId
        this.$axios
          .post(`traspasos/${ventaId}/anular`)
          .then(() => {
            this.$alert.success('Traspaso anulado exitosamente')
            this.cargarTraspasos()
          })
          .catch(err => {
            this.$alert.error(err.response?.data?.message || 'Error al anular traspaso')
          })
          .finally(() => {
            this.traspasoAnulando = null
          })
      })
    }
  }
}
</script>
