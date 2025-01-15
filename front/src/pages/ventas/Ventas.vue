<template>
  <q-page class="q-pa-xs">
    <div class="row">
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-green">
              <q-item-section avatar>
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Ventas</q-item-label>
                <q-item-label  class="text-white text-h4">22.04 Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-pa-xs"></div>
      <div class="col-12 col-md-4 q-pa-xs"></div>
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <div class="row">
              <div class="col-12 col-md-3">
                <q-input v-model="fechaInicio" label="Fecha inicio" dense outlined type="date" />
              </div>
              <div class="col-12 col-md-3">
                <q-input v-model="fechaFin" label="Fecha fin" dense outlined type="date" />
              </div>
              <div class="col-12 col-md-3">
                <q-btn color="primary" label="Buscar"  no-caps  icon="search" :loading="loading" @click="ventasGet()" />
              </div>
              <div class="col-12 col-md-3 text-right">
                <q-btn color="positive" label="Nueva venta"  no-caps  icon="add_circle_outline" :loading="loading" :to="'/ventaNuevo'" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-markup-table dense wrap-cells>
      <thead>
        <tr class="bg-primary text-white">
          <th>Acciones</th>
          <th>#</th>
<!--          opciones deatlle fecha hora estado total-->
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Usuario</th>
          <th>Estado</th>
          <th>Total</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(venta, index) in ventas" :key="venta.id">
          <td>
            <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
              <q-item clickable v-ripple @click="imprimir(venta)">
                <q-item-section avatar>
                  <q-icon name="print" />
                </q-item-section>
                <q-item-section>Imprimir</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="Anular(venta.id)">
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>Anular</q-item-section>
              </q-item>
            </q-btn-dropdown>
          </td>
          <td>{{ index + 1 }}</td>
          <td>{{ venta.fecha }}</td>
          <td>{{ venta.cliente.nombre }}</td>
          <td>{{ venta.user.name }}</td>
          <td>
<!--            {{ venta.estado }} q-chip activo verde -->
            <q-chip :color="venta.estado === 'Activo' ? 'positive' : 'negative'" class="text-white" dense>{{ venta.estado }}</q-chip>
          </td>
          <td>{{ venta.total }}</td>
          <td>
            <div style="max-width: 200px;wrap-option: wrap;line-height: 0.9;">
              {{ venta.detailsText }}
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <pre>{{ ventas }}</pre>
<!--    [-->
<!--    {-->
<!--    "id": 22,-->
<!--    "user_id": 1,-->
<!--    "cliente_id": 1,-->
<!--    "fecha": "2025-01-15",-->
<!--    "ci": "0",-->
<!--    "nombre": "SN",-->
<!--    "estado": "Activo",-->
<!--    "tipo_comprobante": "Venta",-->
<!--    "total": "58.00",-->
<!--    "detailsText": "1 A -  MINA 10000  U.I. CAPSULAS,1 4 DERM X 20 GR,1 A VIMIN 10 000 U.I. X TABLETA",-->
<!--    "user": {-->
<!--    "id": 1,-->
<!--    "name": "Adminstrador",-->
<!--    "username": "admin",-->
<!--    "email": "admin@test.com",-->
<!--    "role": "Doctor",-->
<!--    "color": "orange"-->
<!--    },-->
<!--    "cliente": {-->
<!--    "id": 1,-->
<!--    "nombre": "SN",-->
<!--    "ci": "0",-->
<!--    "telefono": null,-->
<!--    "direccion": null-->
<!--    },-->
<!--    "venta_detalles": [-->
<!--    {-->
<!--    "id": 38,-->
<!--    "venta_id": 22,-->
<!--    "producto_id": 3299,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 1,-->
<!--    "producto": {-->
<!--    "id": 3299,-->
<!--    "nombre": "A -  MINA 10000  U.I. CAPSULAS",-->
<!--    "descripcion": "Tratamiento de la deficiencia de vitamina A",-->
<!--    "unidad": "CAPSULAS  BLANDA",-->
<!--    "precio": 1,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 39,-->
<!--    "venta_id": 22,-->
<!--    "producto_id": 4454,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 56,-->
<!--    "producto": {-->
<!--    "id": 4454,-->
<!--    "nombre": "4 DERM X 20 GR",-->
<!--    "descripcion": "Antimicótico y antiinflamatorio",-->
<!--    "unidad": "TUBOS",-->
<!--    "precio": 56,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 40,-->
<!--    "venta_id": 22,-->
<!--    "producto_id": 2099,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 1,-->
<!--    "producto": {-->
<!--    "id": 2099,-->
<!--    "nombre": "A VIMIN 10 000 U.I. X TABLETA",-->
<!--    "descripcion": "Avitaminosis A",-->
<!--    "unidad": "TABLETAS RECUBIERTAS",-->
<!--    "precio": 1,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    }-->
<!--    ]-->
<!--    },-->
<!--    {-->
<!--    "id": 23,-->
<!--    "user_id": 1,-->
<!--    "cliente_id": 1,-->
<!--    "fecha": "2025-01-15",-->
<!--    "ci": "0",-->
<!--    "nombre": "SN",-->
<!--    "estado": "Activo",-->
<!--    "tipo_comprobante": "Venta",-->
<!--    "total": "76.00",-->
<!--    "detailsText": "1 ABRILAR EA 575 MENTOLADO JARABE X 100 ML,1 ABZ  200  MG/5 ML SUSPENSION",-->
<!--    "user": {-->
<!--    "id": 1,-->
<!--    "name": "Adminstrador",-->
<!--    "username": "admin",-->
<!--    "email": "admin@test.com",-->
<!--    "role": "Doctor",-->
<!--    "color": "orange"-->
<!--    },-->
<!--    "cliente": {-->
<!--    "id": 1,-->
<!--    "nombre": "SN",-->
<!--    "ci": "0",-->
<!--    "telefono": null,-->
<!--    "direccion": null-->
<!--    },-->
<!--    "venta_detalles": [-->
<!--    {-->
<!--    "id": 41,-->
<!--    "venta_id": 23,-->
<!--    "producto_id": 2625,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 75,-->
<!--    "producto": {-->
<!--    "id": 2625,-->
<!--    "nombre": "ABRILAR EA 575 MENTOLADO JARABE X 100 ML",-->
<!--    "descripcion": "Espectorante Natural Broncodilatador y Antitusivo",-->
<!--    "unidad": "FRASCO",-->
<!--    "precio": 75,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 42,-->
<!--    "venta_id": 23,-->
<!--    "producto_id": 3149,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 1,-->
<!--    "producto": {-->
<!--    "id": 3149,-->
<!--    "nombre": "ABZ  200  MG/5 ML SUSPENSION",-->
<!--    "descripcion": "Antiparasitario",-->
<!--    "unidad": "FRASCOS SUSPENSION",-->
<!--    "precio": 1,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    }-->
<!--    ]-->
<!--    },-->
<!--    {-->
<!--    "id": 24,-->
<!--    "user_id": 1,-->
<!--    "cliente_id": 1,-->
<!--    "fecha": "2025-01-15",-->
<!--    "ci": "0",-->
<!--    "nombre": "SN",-->
<!--    "estado": "Activo",-->
<!--    "tipo_comprobante": "Venta",-->
<!--    "total": "61.00",-->
<!--    "detailsText": "1 A -  MINA 10000  U.I. CAPSULAS,1 4 DERM X 20 GR",-->
<!--    "user": {-->
<!--    "id": 1,-->
<!--    "name": "Adminstrador",-->
<!--    "username": "admin",-->
<!--    "email": "admin@test.com",-->
<!--    "role": "Doctor",-->
<!--    "color": "orange"-->
<!--    },-->
<!--    "cliente": {-->
<!--    "id": 1,-->
<!--    "nombre": "SN",-->
<!--    "ci": "0",-->
<!--    "telefono": null,-->
<!--    "direccion": null-->
<!--    },-->
<!--    "venta_detalles": [-->
<!--    {-->
<!--    "id": 43,-->
<!--    "venta_id": 24,-->
<!--    "producto_id": 3299,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 4,-->
<!--    "producto": {-->
<!--    "id": 3299,-->
<!--    "nombre": "A -  MINA 10000  U.I. CAPSULAS",-->
<!--    "descripcion": "Tratamiento de la deficiencia de vitamina A",-->
<!--    "unidad": "CAPSULAS  BLANDA",-->
<!--    "precio": 1,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 44,-->
<!--    "venta_id": 24,-->
<!--    "producto_id": 4454,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 57,-->
<!--    "producto": {-->
<!--    "id": 4454,-->
<!--    "nombre": "4 DERM X 20 GR",-->
<!--    "descripcion": "Antimicótico y antiinflamatorio",-->
<!--    "unidad": "TUBOS",-->
<!--    "precio": 56,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    }-->
<!--    ]-->
<!--    }-->
<!--    ]-->
  </q-page>
  <div id="myElement" class="hidden"></div>
</template>
<script>
import moment from 'moment'
import {Imprimir} from "src/addons/Imprimir";
export default {
  name: 'Ventas',
  data() {
    return {
      ventas: [],
      venta: {},
      ventaDialog: false,
      fechaInicio: moment().format('YYYY-MM-DD'),
      fechaFin: moment().format('YYYY-MM-DD'),
      loading: false,
      actionPeriodo: '',
      gestiones: [],
      filter: '',
      roles: ['Doctor', 'Enfermera', 'Administrativo', 'Secretaria'],
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion' },
        { name: 'unidad', label: 'Unidad', align: 'left', field: 'unidad' },
        { name: 'precio', label: 'Precio', align: 'left', field: 'precio' },
        { name: 'stock', label: 'Stock', align: 'left', field: 'stock' },
        { name: 'stock_minimo', label: 'Stock mínimo', align: 'left', field: 'stock_minimo' },
        { name: 'stock_maximo', label: 'Stock máximo', align: 'left', field: 'stock_maximo' },
      ]
    }
  },
  mounted() {
    this.ventasGet()
  },
  methods: {
    imprimir(venta) {
      Imprimir.nota(venta)
    },
    ventasGet() {
      this.loading = true
      this.$axios.get('ventas',{
        params: {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin
        }
      }).then(res => {
        this.ventas = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>
