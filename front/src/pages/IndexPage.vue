<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Filtros -->
    <q-card class="q-pa-md q-mb-md">
      <div class="row items-end q-col-gutter-md">
        <div class="col-12 col-sm-3">
          <q-input v-model="f.desde" type="date" label="Desde" dense outlined @change="cargarDashboard"/>
        </div>
        <div class="col-12 col-sm-3">
          <q-input v-model="f.hasta" type="date" label="Hasta" dense outlined @change="cargarDashboard"/>
        </div>
        <div class="col-12 col-sm-6">
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-btn outline color="primary" label="Hoy" class="full-width" @click="preset('hoy')" />
            </div>
            <div class="col">
              <q-btn outline color="primary" label="Esta semana" class="full-width" @click="preset('semana')" />
            </div>
            <div class="col">
              <q-btn outline color="primary" label="Este mes" class="full-width" @click="preset('mes')" />
            </div>
            <div class="col">
              <q-btn color="primary" label="Aplicar" class="full-width" :loading="loading" @click="cargarDashboard" />
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <div class="row q-col-gutter-md">
      <!-- KPIs -->
      <div class="col-12 col-md-3">
        <q-card class="kpi bg-indigo text-white">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Ventas Interno</div>
            <div class="text-h4 q-mt-sm">{{ fmt(totalInterno) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="kpi bg-orange text-white">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Ventas Externo</div>
            <div class="text-h4 q-mt-sm">{{ fmt(totalExterno) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="kpi bg-green text-white">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Total Ventas</div>
            <div class="text-h4 q-mt-sm">{{ fmt(totalGeneral) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card class="kpi bg-teal text-white">
          <q-card-section class="text-center">
            <div class="text-subtitle2">Utilidad (Ventas - Compras)</div>
            <div class="text-h4 q-mt-sm">{{ fmt(utilidad) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Ventas diarias -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle2 text-grey-8">Ventas diarias</div>
              <div class="text-caption text-grey">{{ rangoLegible }}</div>
            </div>
            <q-skeleton v-if="loading" type="rect" height="300px" class="q-mt-sm" />
            <apexchart v-else type="bar" height="300" :options="chartOptions" :series="chartSeries"/>
          </q-card-section>
        </q-card>
      </div>

      <!-- Compras vs Ventas -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-2">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle2 text-grey-8">Compras vs Ventas</div>
              <div class="text-caption text-grey">{{ rangoLegible }}</div>
            </div>
            <q-skeleton v-if="loading" type="rect" height="300px" class="q-mt-sm" />
            <apexchart v-else type="line" height="300" :options="chartLineOptions" :series="chartLineSeries"/>
          </q-card-section>
        </q-card>
      </div>

      <!-- Últimas ventas -->
      <div class="col-12">
        <q-card class="shadow-2">
          <q-card-section class="text-h6 text-grey-8">Últimas Ventas</q-card-section>
          <q-markup-table dense wrap-cells>
            <thead>
            <tr class="bg-primary text-white">
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Doctor</th>
              <th>Total</th>
              <th>Tipo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loading">
              <td colspan="6">
                <q-skeleton type="text" width="100%" height="24px" />
              </td>
            </tr>
            <tr v-for="v in ventas" :key="v.id">
              <td>{{ v.id }}</td>
              <td>{{ v.fecha }}</td>
              <td>{{ v.nombre }}</td>
              <td>{{ v.doctor ? v.doctor.nombre : '-' }}</td>
              <td class="text-bold">{{ fmt(v.total) }} Bs</td>
              <td>
                <q-chip :color="v.tipo_venta === 'Interno' ? 'indigo' : 'orange'" text-color="white" dense>
                  {{ v.tipo_venta }}
                </q-chip>
              </td>
            </tr>
            <tr v-if="!loading && ventas.length===0">
              <td colspan="6" class="text-center text-grey">Sin ventas en el rango seleccionado</td>
            </tr>
            </tbody>
          </q-markup-table>
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
      totalInterno: 0,
      totalExterno: 0,
      utilidad: 0,

      chartSeries: [{ name: 'Ventas', data: [] }],
      chartOptions: {
        chart: { toolbar: { show: false } },
        xaxis: { categories: [] },
        dataLabels: { enabled: false },
        plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
        tooltip: { theme: 'dark' },
        yaxis: { labels: { formatter: v => Number(v).toFixed(2) } }
      },
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
        yaxis: { labels: { formatter: v => Number(v).toFixed(2) } }
      }
    }
  },
  computed: {
    totalGeneral () {
      return Number(this.totalInterno) + Number(this.totalExterno)
    },
    rangoLegible () {
      return `${this.f.desde} → ${this.f.hasta}`
    }
  },
  mounted () {
    this.cargarDashboard()
  },
  methods: {
    fmt (n) { return Number(n || 0).toFixed(2) },

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
        const inicio = new Date(hoy); inicio.setDate(hoy.getDate() - (dia - 1))
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

    cargarDashboard () {
      this.loading = true
      this.$axios.get('dashboard', { params: { desde: this.f.desde, hasta: this.f.hasta } })
        .then(({ data }) => {
          // KPIs
          this.totalInterno = data.totales?.interno || 0
          this.totalExterno = data.totales?.externo || 0
          this.utilidad     = data.utilidad || 0

          // tablas
          this.ventas = data.ventas || []

          // charts
          this.chartOptions.xaxis.categories   = data.dias || []
          this.chartSeries[0].data             = data.ventasDiarias || []

          this.chartLineOptions.xaxis.categories = data.meses || []
          this.chartLineSeries[0].data           = data.ventasMes || []
          this.chartLineSeries[1].data           = data.comprasMes || []
        })
        .catch(() => this.$q.notify({ type: 'negative', message: 'Error al cargar dashboard' }))
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>
.kpi { border-radius: 16px; }
</style>
