<template>
  <q-page class="q-pa-sm">
    <q-card flat bordered>
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="text-h6">Reporte de farmacia - {{ farmaciaNombre }}</div>
        <q-space />
        <q-btn color="primary" icon="picture_as_pdf" no-caps label="PDF" :disable="loading" @click="openPdfReporte" />
        <q-btn flat round dense icon="refresh" :loading="loading" @click="ventasGet" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-2">
            <q-input v-model="fechaInicio" type="date" outlined dense label="Fecha inicio" />
          </div>
          <div class="col-12 col-md-2">
            <q-input v-model="fechaFin" type="date" outlined dense label="Fecha fin" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="user"
              :options="usersTodos"
              emit-value
              map-options
              outlined
              dense
              label="Usuario"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="tipoVenta"
              :options="tiposVentaOptions"
              emit-value
              map-options
              outlined
              dense
              label="Tipo de venta"
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn color="primary" icon="search" no-caps label="Buscar" class="full-width" :loading="loading" @click="ventasGet" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-sm q-mt-sm">
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Internado</div>
            <div class="text-h6 text-weight-bold">{{ totalInternado.toFixed(2) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Interno</div>
            <div class="text-h6 text-weight-bold">{{ totalInterno.toFixed(2) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Externo</div>
            <div class="text-h6 text-weight-bold">{{ totalExterno.toFixed(2) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Seguro</div>
            <div class="text-h6 text-weight-bold">{{ totalSeguro.toFixed(2) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Egreso</div>
            <div class="text-h6 text-weight-bold text-negative">{{ totalEgreso.toFixed(2) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-2">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-caption text-grey-7">Total ingreso</div>
            <div class="text-h6 text-weight-bold">{{ totalIngreso.toFixed(2) }} Bs</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-markup-table dense flat bordered wrap-cells class="q-mt-sm">
      <thead>
      <tr class="bg-primary text-white">
        <th>ID</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Usuario</th>
        <th>Tipo venta</th>
        <th>Tipo pago</th>
        <th>Estado</th>
        <th class="text-right">Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="venta in ventasFiltradas" :key="venta.id">
        <td>{{ venta.id }}</td>
        <td>{{ venta.fecha }} {{ venta.hora }}</td>
        <td>{{ venta.nombre }}</td>
        <td>{{ venta.user && venta.user.name ? venta.user.name : '-' }}</td>
        <td>{{ venta.tipo_venta }}</td>
        <td>{{ venta.tipo_pago }}</td>
        <td>{{ venta.estado }}</td>
        <td class="text-right">{{ Number(venta.total || 0).toFixed(2) }}</td>
      </tr>
      <tr v-if="!loading && ventasFiltradas.length === 0">
        <td colspan="8" class="text-center text-grey-7">Sin registros para el filtro seleccionado</td>
      </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ReporteFarmaciaPage',
  data () {
    return {
      loading: false,
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaFin: moment().format('YYYY-MM-DD'),
      user: '',
      tipoVenta: '',
      users: [],
      ventas: [],
    }
  },
  computed: {
    farmaciaTipo () {
      const meta = this.$route && this.$route.meta ? this.$route.meta : {}
      return meta.farmaciaTipo || 'Farmacia'
    },
    farmaciaNombre () {
      const meta = this.$route && this.$route.meta ? this.$route.meta : {}
      return meta.farmaciaNombre || this.farmaciaTipo
    },
    usersTodos () {
      return [{ label: 'Todos', value: '' }, ...this.users.map(user => ({ label: user.name, value: user.id }))]
    },
    tiposVentaOptions () {
      return [
        { label: 'Todos', value: '' },
        { label: 'Interno', value: 'Interno' },
        { label: 'Internado', value: 'Internado' },
        { label: 'Externo', value: 'Externo' },
        { label: 'Seguro', value: 'Seguro' },
        { label: 'Egreso', value: 'Egreso' },
      ]
    },
    ventasFiltradas () {
      if (!this.tipoVenta) return this.ventas
      return this.ventas.filter(venta => venta.tipo_venta === this.tipoVenta)
    },
    ventasActivas () {
      return this.ventasFiltradas.filter(venta => venta.estado === 'Activo')
    },
    totalInternado () {
      return this.ventasActivas.reduce((acc, venta) => venta.tipo_venta === 'Internado' ? acc + Number(venta.total || 0) : acc, 0)
    },
    totalInterno () {
      return this.ventasActivas.reduce((acc, venta) => venta.tipo_venta === 'Interno' ? acc + Number(venta.total || 0) : acc, 0)
    },
    totalExterno () {
      return this.ventasActivas.reduce((acc, venta) => venta.tipo_venta === 'Externo' ? acc + Number(venta.total || 0) : acc, 0)
    },
    totalSeguro () {
      return this.ventasActivas.reduce((acc, venta) => venta.tipo_venta === 'Seguro' ? acc + Number(venta.total || 0) : acc, 0)
    },
    totalEgreso () {
      return this.ventasActivas.reduce((acc, venta) => venta.tipo_venta === 'Egreso' ? acc + Number(venta.total || 0) : acc, 0)
    },
    totalIngreso () {
      return this.totalInternado + this.totalInterno + this.totalExterno + this.totalSeguro
    }
  },
  methods: {
    usersGet () {
      return this.$axios.get('users')
        .then(res => {
          this.users = res.data || []
        })
        .catch(error => {
          const message = (error && error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : 'No se pudieron cargar usuarios'
          this.$alert.error(message)
        })
    },
    ventasGet () {
      this.loading = true
      this.$axios.get('ventas', {
        params: {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          user: this.user,
          tipoVenta: this.tipoVenta,
          farmacia_tipo: this.farmaciaTipo
        }
      }).then(res => {
        this.ventas = res.data || []
      }).catch(error => {
        const message = (error && error.response && error.response.data && error.response.data.message)
          ? error.response.data.message
          : 'No se pudieron cargar ventas'
        this.$alert.error(message)
      }).finally(() => {
        this.loading = false
      })
    },
    openPdfReporte () {
      const params = new URLSearchParams({
        fechaInicio: this.fechaInicio || '',
        fechaFin: this.fechaFin || '',
        user: this.user || '',
        tipoVenta: this.tipoVenta || '',
        farmacia_tipo: this.farmaciaTipo
      })
      window.open(`${this.$url}/../reportes/farmacia/pdf?${params.toString()}`, '_blank')
    }
  },
  watch: {
    '$route.fullPath' () {
      this.tipoVenta = ''
      this.user = ''
      this.ventas = []
      this.ventasGet()
    }
  },
  mounted () {
    this.usersGet().then(() => this.ventasGet())
  }
}
</script>
