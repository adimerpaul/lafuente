<template>
  <q-page class="dashboard-page q-pa-sm">
    <!-- Header + Filtros -->
    <q-card class="dashboard-header q-pa-sm q-mb-sm text-white">
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="text-h5 text-weight-bold">Clínica La Fuente</div>
          <div class="text-body2 header-subtitle">Resumen de ventas, compras y rendimiento</div>
        </div>

        <div class="col-12 col-md-7">
          <div class="row items-end q-col-gutter-sm">
            <div class="col-12 col-sm-3">
              <q-input v-model="f.desde" type="date" label="Desde" dense outlined @update:model-value="cargarDashboard" />
            </div>
            <div class="col-12 col-sm-3">
              <q-input v-model="f.hasta" type="date" label="Hasta" dense outlined @update:model-value="cargarDashboard" />
            </div>

            <div class="col-12 col-sm-6">
              <div class="row q-col-gutter-sm">
                <div class="col">
                  <q-btn outline color="primary" label="HOY" class="full-width" @click="preset('hoy')" />
                </div>
                <div class="col">
                  <q-btn outline color="primary" label="ESTA SEMANA" class="full-width" @click="preset('semana')" />
                </div>
                <div class="col">
                  <q-btn outline color="primary" label="ESTE MES" class="full-width" @click="preset('mes')" />
                </div>
                <div class="col">
                  <q-btn color="primary" label="APLICAR" class="full-width" :loading="loading" @click="cargarDashboard" />
                </div>
              </div>
            </div>
          </div>

          <div class="text-caption header-subtitle q-mt-sm">
            Rango: <span class="text-weight-medium">{{ rangoLegible }}</span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- KPIs -->
    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-md-3">
        <q-card class="kpi kpi-blue text-white shadow-2">
          <q-card-section class="row items-center">
            <q-icon name="local_hospital" size="28px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle2">Ventas Internado</div>
              <div class="text-h5 text-weight-bold">{{ fmt(totalInternado) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="kpi kpi-orange text-white shadow-2">
          <q-card-section class="row items-center">
            <q-icon name="public" size="28px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle2">Ventas Externo</div>
              <div class="text-h5 text-weight-bold">{{ fmt(totalExterno) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="kpi kpi-green text-white shadow-2">
          <q-card-section class="row items-center">
            <q-icon name="attach_money" size="28px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle2">Total Ventas</div>
              <div class="text-h5 text-weight-bold">{{ fmt(totalGeneral) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="kpi kpi-teal text-white shadow-2">
          <q-card-section class="row items-center">
            <q-icon name="trending_up" size="28px" class="q-mr-sm" />
            <div>
              <div class="text-subtitle2">Utilidad (Ventas - Compras)</div>
              <div class="text-h5 text-weight-bold">{{ fmt(utilidad) }} Bs</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Productos destacados -->
    <div class="row q-col-gutter-sm q-mb-sm">
      <div
        v-for="grupo in gruposProductos"
        :key="grupo.key"
        class="col-12 col-lg-6"
      >
        <q-card class="product-panel shadow-2">
          <q-card-section class="row items-center justify-between q-pa-sm">
            <div>
              <div class="text-h6 text-weight-bold text-grey-9">{{ grupo.titulo }}</div>
              <div class="text-caption text-grey-7">{{ grupo.descripcion }}</div>
            </div>
            <q-avatar :color="grupo.avatarColor" :text-color="grupo.color" :icon="grupo.icono" />
          </q-card-section>
          <q-separator />

          <q-card-section class="q-pa-sm">
            <div v-if="loading" class="product-grid">
              <q-skeleton
                v-for="n in 5"
                :key="`${grupo.key}-${n}`"
                type="rect"
                height="108px"
                class="rounded-borders"
              />
            </div>

            <div v-else-if="grupo.productos.length" class="product-grid">
              <div
                v-for="(producto, index) in grupo.productos"
                :key="producto.id"
                class="product-card"
              >
                <q-badge
                  v-if="grupo.key === 'mas'"
                  color="positive"
                  rounded
                  floating
                >
                  Top {{ index + 1 }}
                </q-badge>
                <q-img
                  :src="productoImagen(producto)"
                  class="product-image"
                  fit="cover"
                >
                  <template #error>
                    <div class="absolute-full flex flex-center bg-grey-2 text-grey-6">
                      <q-icon name="medication" size="42px" />
                    </div>
                  </template>
                </q-img>
                <div class="q-pa-sm">
                  <div class="product-name ellipsis-2-lines">{{ producto.nombre }}</div>
                  <div class="row items-center justify-between q-mt-xs no-wrap">
                    <span class="text-caption text-grey-7">Vendidos</span>
                    <q-chip
                      dense
                      :color="grupo.avatarColor"
                      :text-color="grupo.color"
                      class="text-weight-bold q-ma-none"
                    >
                      {{ fmtCantidad(producto.cantidad_vendida) }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-products">
              <q-icon name="inventory_2" size="40px" />
              <div>No hay productos para mostrar</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Charts -->
    <div class="row q-col-gutter-sm">
      <!-- Ventas diarias -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-grey-8">Ventas diarias</div>
              <div class="text-caption text-grey-7">Suma total por día</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-sm" style="position: relative;">
            <apexchart
              type="bar"
              height="180"
              :options="chartOptions"
              :series="chartSeries"
            />
            <q-inner-loading :showing="loading">
              <q-spinner size="32px" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <!-- Compras vs Ventas -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-grey-8">Compras vs Ventas</div>
              <div class="text-caption text-grey-7">Serie mensual del año actual</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-sm" style="position: relative;">
            <apexchart
              type="line"
              height="180"
              :options="chartLineOptions"
              :series="chartLineSeries"
            />
            <q-inner-loading :showing="loading">
              <q-spinner size="32px" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <!-- Ventas por usuario -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle2 text-grey-8">Ventas por usuario</div>
              <div class="text-caption text-grey-7">Top usuarios por total vendido (rango seleccionado)</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-sm" style="position: relative;">
            <apexchart
              type="bar"
              height="180"
              :options="chartUserOptions"
              :series="chartUserSeries"
            />
            <q-inner-loading :showing="loading">
              <q-spinner size="32px" />
            </q-inner-loading>
          </q-card-section>
        </q-card>
      </div>

      <!-- Últimas ventas -->
      <div class="col-12">
        <q-card class="shadow-2">
          <q-card-section class="row items-center justify-between">
            <div class="text-subtitle1 text-weight-bold text-grey-8">Últimas Ventas</div>
            <div class="text-caption text-grey-7">{{ rangoLegible }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
            <q-markup-table dense wrap-cells>
              <thead>
              <tr class="bg-primary text-white">
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Doctor</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Tipo</th>
              </tr>
              </thead>

              <tbody>
              <tr v-if="loading">
                <td colspan="7" class="q-pa-md">
                  <q-skeleton type="text" width="100%" height="26px" />
                  <q-skeleton type="text" width="100%" height="26px" />
                  <q-skeleton type="text" width="100%" height="26px" />
                </td>
              </tr>

              <tr v-for="v in ventas.slice(0, 5)" :key="v.id">
                <td>{{ v.id }}</td>
                <td>{{ v.fecha }}</td>
                <td>{{ v.nombre }}</td>
                <td>{{ v.doctor ? (v.doctor?.nombre || '-') : '-' }}</td>
                <td>{{ v.user ? (v.user?.name || '-') : '-' }}</td>
                <td class="text-weight-bold">{{ fmt(v.total) }} Bs</td>
                <td>
                  <q-chip
                    :color="(v.tipo_venta === 'Internado' || v.tipo_venta === 'Interno') ? 'indigo' : 'orange'"
                    text-color="white"
                    dense
                  >
                    {{ (v.tipo_venta === 'Interno') ? 'Internado' : v.tipo_venta }}
                  </q-chip>
                </td>
              </tr>

              <tr v-if="!loading && ventas.length === 0">
                <td colspan="7" class="text-center text-grey q-pa-md">Sin ventas en el rango seleccionado</td>
              </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'DashboardPrincipal',
  components: { apexchart: VueApexCharts },

  data () {
    const hoy = new Date()
    const y = hoy.getFullYear()
    const m = String(hoy.getMonth() + 1).padStart(2, '0')
    const d = String(hoy.getDate()).padStart(2, '0')

    return {
      loading: false,
      f: {
        desde: `${y}-${m}-01`,
        hasta: `${y}-${m}-${d}`
      },

      ventas: [],
      totalInternado: 0,
      totalExterno: 0,
      utilidad: 0,
      productosMasVendidos: [],
      productosMenosVendidos: [],

      // Ventas diarias
      chartSeries: [{ name: 'Ventas', data: [] }],
      chartOptions: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: [] },
        dataLabels: { enabled: false },
        plotOptions: { bar: { columnWidth: '55%', borderRadius: 6 } },
        tooltip: { y: { formatter: (v) => Number(v || 0).toFixed(2) } },
        yaxis: { labels: { formatter: v => Number(v).toFixed(2) } },
        noData: { text: 'Sin datos' }
      },

      // Compras vs Ventas
      chartLineSeries: [
        { name: 'Ventas', data: [] },
        { name: 'Compras', data: [] }
      ],
      chartLineOptions: {
        chart: { toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: [] },
        dataLabels: { enabled: false },
        legend: { position: 'bottom' },
        tooltip: { y: { formatter: (v) => Number(v || 0).toFixed(2) } },
        yaxis: { labels: { formatter: v => Number(v).toFixed(2) } },
        noData: { text: 'Sin datos' }
      },

      // Ventas por usuario
      chartUserSeries: [{ name: 'Ventas', data: [] }],
      chartUserOptions: {
        chart: { toolbar: { show: false } },
        plotOptions: {
          bar: { horizontal: true, borderRadius: 6, barHeight: '70%' }
        },
        dataLabels: { enabled: false },
        xaxis: { categories: [] },
        tooltip: { y: { formatter: (v) => Number(v || 0).toFixed(2) } },
        noData: { text: 'Sin datos' }
      }
    }
  },

  computed: {
    totalGeneral () {
      return Number(this.totalInternado) + Number(this.totalExterno)
    },
    gruposProductos () {
      return [
        {
          key: 'mas',
          titulo: 'Más vendidos',
          descripcion: 'Productos con mayor rotación en el rango',
          icono: 'trending_up',
          avatarColor: 'green-1',
          color: 'positive',
          productos: this.productosMasVendidos
        },
        {
          key: 'menos',
          titulo: 'Menos vendidos',
          descripcion: 'Productos que necesitan mayor atención',
          icono: 'trending_down',
          avatarColor: 'orange-1',
          color: 'orange-9',
          productos: this.productosMenosVendidos
        }
      ]
    },
    rangoLegible () {
      return `${this.f.desde} → ${this.f.hasta}`
    }
  },

  mounted () {
    this.cargarDashboard()
  },

  methods: {
    fmt (n) {
      return Number(n || 0).toFixed(2)
    },
    fmtCantidad (n) {
      return Number(n || 0).toLocaleString('es-BO', { maximumFractionDigits: 2 })
    },
    productoImagen (producto) {
      if (!producto?.imagen) return '/icons/icon-128x128.png'
      return `${this.$url}../images/${producto.imagen}`
    },

    preset (tipo) {
      const hoy = new Date()
      const toISO = (d) => [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
      ].join('-')

      if (tipo === 'hoy') {
        const s = toISO(hoy)
        this.f.desde = s
        this.f.hasta = s
      }

      if (tipo === 'semana') {
        const dia = hoy.getDay() || 7 // Lunes=1 ... Domingo=7
        const inicio = new Date(hoy)
        inicio.setDate(hoy.getDate() - (dia - 1))
        this.f.desde = toISO(inicio)
        this.f.hasta = toISO(hoy)
      }

      if (tipo === 'mes') {
        const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        this.f.desde = toISO(inicio)
        this.f.hasta = toISO(hoy)
      }

      this.cargarDashboard()
    },

    async cargarDashboard () {
      this.loading = true
      try {
        const { data } = await this.$axios.get('dashboard', {
          params: { desde: this.f.desde, hasta: this.f.hasta }
        })

        // KPIs
        this.totalInternado = data.totales?.internado || 0
        this.totalExterno   = data.totales?.externo || 0
        this.utilidad       = data.utilidad || 0

        // tabla
        this.ventas = data.ventas || []
        this.productosMasVendidos = data.productosMasVendidos || []
        this.productosMenosVendidos = data.productosMenosVendidos || []

        // charts: ventas diarias
        this.chartOptions = {
          ...this.chartOptions,
          xaxis: { ...this.chartOptions.xaxis, categories: data.dias || [] }
        }
        this.chartSeries = [{ name: 'Ventas', data: data.ventasDiarias || [] }]

        // charts: compras vs ventas
        this.chartLineOptions = {
          ...this.chartLineOptions,
          xaxis: { ...this.chartLineOptions.xaxis, categories: data.meses || [] }
        }
        this.chartLineSeries = [
          { name: 'Ventas', data: data.ventasMes || [] },
          { name: 'Compras', data: data.comprasMes || [] }
        ]

        // charts: ventas por usuario
        this.chartUserOptions = {
          ...this.chartUserOptions,
          xaxis: { ...this.chartUserOptions.xaxis, categories: data.usuarios || [] }
        }
        this.chartUserSeries = [{ name: 'Ventas', data: data.ventasUsuarios || [] }]
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'Error al cargar dashboard' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
  background:
    radial-gradient(circle at top right, rgba(25, 118, 210, .10), transparent 32rem),
    #f5f7fb;
}
.dashboard-header {
  border: 0;
  border-radius: 20px;
  background: linear-gradient(120deg, #0d47a1, #1976d2 58%, #26a69a);
  box-shadow: 0 12px 30px rgba(13, 71, 161, .18);
}
.header-subtitle { color: rgba(255, 255, 255, .82); }
.kpi { border-radius: 12px; }
.kpi :deep(.q-card__section) { padding: 7px 10px; }
.kpi :deep(.q-icon) { font-size: 21px !important; }
.kpi .text-h5 { font-size: 1.15rem; line-height: 1.25rem; }
.kpi .text-subtitle2 { font-size: .76rem; line-height: 1rem; }
.kpi-blue   { background: linear-gradient(135deg, #3f51b5, #283593); }
.kpi-orange { background: linear-gradient(135deg, #fb8c00, #ef6c00); }
.kpi-green  { background: linear-gradient(135deg, #43a047, #2e7d32); }
.kpi-teal   { background: linear-gradient(135deg, #00897b, #00695c); }
.product-panel {
  height: 100%;
  overflow: hidden;
  border-radius: 18px;
}
.product-panel :deep(.q-card__section:first-child) { min-height: 48px; }
.product-panel .text-h6 { font-size: 1rem; line-height: 1.15rem; }
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}
.product-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #e7ebf1;
  border-radius: 14px;
  background: #fff;
  transition: transform .2s ease, box-shadow .2s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(30, 50, 80, .12);
}
.product-image {
  height: 58px;
  background: #f1f3f6;
}
.product-name {
  min-height: 30px;
  color: #263238;
  font-size: 11px;
  font-weight: 600;
  line-height: 15px;
}
.product-card .q-pa-sm { padding: 5px; }
.product-card :deep(.q-chip) {
  min-height: 20px;
  padding: 0 5px;
  font-size: 10px;
}
.empty-products {
  display: grid;
  min-height: 108px;
  place-items: center;
  color: #9e9e9e;
}
.dashboard-page :deep(.apexcharts-canvas) { margin: 0 auto; }
.dashboard-page :deep(th),
.dashboard-page :deep(td) {
  height: 27px;
  padding: 2px 8px;
  font-size: 11px;
}
@media (max-width: 700px) {
  .product-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
