<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header + Filtros -->
    <q-card class="q-pa-md q-mb-md shadow-1" bordered>
      <div class="row items-center q-col-gutter-md">
        <div class="col-12 col-md">
          <div class="text-h6 text-weight-bold">Dashboard · La Fuente</div>
          <div class="text-caption text-grey-7">Resumen de ventas, compras y rendimiento por usuario</div>
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

          <div class="text-caption text-grey-7 q-mt-sm">
            Rango: <span class="text-weight-medium">{{ rangoLegible }}</span>
          </div>
        </div>
      </div>
    </q-card>

    <!-- KPIs -->
    <div class="row q-col-gutter-md q-mb-md">
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

    <!-- Charts -->
    <div class="row q-col-gutter-md">
      <!-- Ventas diarias -->
      <div class="col-12 col-md-6">
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
              height="300"
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
      <div class="col-12 col-md-6">
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
              height="300"
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
      <div class="col-12">
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
              height="320"
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

              <tr v-for="v in ventas" :key="v.id">
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
.kpi { border-radius: 18px; }
.kpi-blue   { background: linear-gradient(135deg, #3f51b5, #283593); }
.kpi-orange { background: linear-gradient(135deg, #fb8c00, #ef6c00); }
.kpi-green  { background: linear-gradient(135deg, #43a047, #2e7d32); }
.kpi-teal   { background: linear-gradient(135deg, #00897b, #00695c); }
</style>
