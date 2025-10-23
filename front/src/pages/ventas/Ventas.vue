<template>
  <q-page class="q-pa-xs">
    <div class="row">
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-indigo">
              <q-item-section avatar>
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Ventas Interno</q-item-label>
                <q-item-label  class="text-white text-h4">{{totalInternos}} Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4 q-pa-xs">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <q-item class="bg-orange">
              <q-item-section avatar>
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Ventas Externo</q-item-label>
                <q-item-label  class="text-white text-h4">{{totalExternos}} Bs</q-item-label>
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
                <q-icon name="monetization_on" size="50px" color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption class="text-white">Ventas Total</q-item-label>
                <q-item-label  class="text-white text-h4">{{totalInternos + totalExternos}} Bs</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="q-pa-none">
            <div class="row">
              <div class="col-12 col-md-2">
                <q-input v-model="fechaInicio" label="Fecha inicio" dense outlined type="date" />
              </div>
              <div class="col-12 col-md-2">
                <q-input v-model="fechaFin" label="Fecha fin" dense outlined type="date" />
              </div>
              <div class="col-12 col-md-2">
                <q-select v-model="user" :options="usersTodos" label="Usuario" dense outlined  emit-value map-options/>
              </div>
              <div class="col-12 col-md-2">
                <q-btn color="primary" label="Buscar"  no-caps  icon="search" :loading="loading" @click="ventasGet()" />
              </div>
              <div class="col-12 col-md-2 text-right">
                <q-btn-dropdown color="primary" label="Exportar" no-caps  >
                  <q-item clickable v-ripple @click="exportExcel" v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="file_download" />
                    </q-item-section>
                    <q-item-section>Excel</q-item-section>
                  </q-item>
                </q-btn-dropdown>
              </div>
              <div class="col-12 col-md-2 text-right">
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
          <th>ID</th>
<!--          opciones deatlle fecha hora estado total-->
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Usuario</th>
          <th>Estado</th>
          <th>Total</th>
          <th>Detalle</th>
          <th>Tipo venta</th>
        </tr>
      </thead>
      <tbody>
      <template v-if="ventas.length != 0">
        <tr v-for="(venta, index) in ventas" :key="venta.id">
          <td>
            <q-btn-dropdown color="primary" label="Opciones" no-caps dense size="10px">
              <q-item clickable v-ripple @click="imprimir(venta)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="print" />
                </q-item-section>
                <q-item-section>Imprimir</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="anular(venta.id)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>Anular</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="tipoVentasChange(venta.id)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="swap_horiz" />
                </q-item-section>
                <q-item-section>Cambiar a {{ venta.tipo_venta === 'Interno' ? 'Externo' : 'Interno' }}</q-item-section>
              </q-item>
              <q-item clickable v-ripple v-if="venta.estado==='Activo'" @click="openDevolver(venta)" v-close-popup>
                <q-item-section avatar><q-icon name="undo" /></q-item-section>
                <q-item-section>Devolver productos</q-item-section>
              </q-item>
            </q-btn-dropdown>
          </td>
          <td>{{ venta.id }}</td>
          <td>
            {{ venta.fecha }}
            {{ venta.hora }}
          </td>
          <td>{{ venta.nombre }}</td>
          <td>{{ venta.user.name }}</td>
          <td>
            <!--            {{ venta.estado }} q-chip activo verde -->
            <q-chip :color="venta.estado === 'Activo' ? 'positive' : 'negative'" class="text-white" dense>{{ venta.estado }}</q-chip>
          </td>
          <td class="text-bold">
            {{ venta.total }}
            <q-chip size="10px" :color="venta.tipo_pago === 'Efectivo' ? 'green' : 'blue'" class="text-white" dense>{{ venta.tipo_pago.charAt(0) }}</q-chip>
          </td>
          <td>
            <div style="max-width: 200px;wrap-option: wrap;line-height: 0.9;">
              {{ venta.detailsText }}
            </div>
          </td>
          <td>
            <q-chip :color="venta.tipo_venta === 'Internado' ? 'indigo' : 'orange'" class="text-white" dense>{{ venta.tipo_venta }}</q-chip>
          </td>
        </tr>
      </template>
      <template v-else>
<!--        <tr>-->
<!--          <td colspan="8" class="text-center">-->
<!--&lt;!&ndash;            <q-icon name="warning" size="50px" color="red" />&ndash;&gt;-->
<!--            <div class="text-h6">No hay ventas registradas</div>-->
<!--          </td>-->
<!--        </tr>-->
      </template>
      </tbody>
    </q-markup-table>
<!--    <pre>{{ ventas }}</pre>-->
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
    <!-- Dialog devolución -->
    <q-dialog v-model="devDialog" persistent>
      <q-card style="max-width: 860px; width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Devolver productos</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="devDialog=false" />
        </q-card-section>

        <q-card-section>
          <q-markup-table dense wrap-cells flat bordered>
            <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Lote</th>
              <th>Vencimiento</th>
              <th style="width:100px;">Vendido</th>
              <th style="width:140px;">Devolver</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(d,i) in venta.venta_detalles" :key="d.id">
              <td class="text-center">{{ i+1 }}</td>
              <td style="max-width:360px;overflow:hidden;text-overflow:ellipsis;">
                {{ d.nombre || d.producto?.nombre || '—' }}
              </td>
              <td class="text-center">{{ d.lote || '—' }}</td>
              <td class="text-center">{{ d.fecha_vencimiento || '—' }}</td>
              <td class="text-center">{{ d.cantidad }}</td>
              <td>
<!--                devolver btn-->
                <q-btn size="sm" color="negative" label="Devolver" no-caps @click="devolverProducto(venta.id, d.id, d.cantidad)"
                       icon="undo"
                />
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
<!--        <pre>{{ venta }}</pre>-->
<!--        {-->
<!--        "id": 357,-->
<!--        "user_id": 1,-->
<!--        "doctor_id": null,-->
<!--        "cliente_id": 1,-->
<!--        "paciente_id_ref": null,-->
<!--        "fecha": "2025-10-18",-->
<!--        "hora": "03:05:48",-->
<!--        "tipo_venta": "Externo",-->
<!--        "ci": "0",-->
<!--        "nombre": "SN",-->
<!--        "estado": "Activo",-->
<!--        "tipo_comprobante": "Venta",-->
<!--        "total": "641.00",-->
<!--        "tipo_pago": "Efectivo",-->
<!--        "pagado_interno": 0,-->
<!--        "detailsText": "1 0 ES 3 COMPRIMIDO,1 4 DERM 10 GR,1 A-MINA FORTE,1 ABRILAR EA 575 FCO. X 100 ML JARABE,1 ABRILAR EA 575 FCO. X 100 ML JARABE,1 ABRILAR EA 575 MENTOLADO JARABE X 100 ML,1 ACD VIMIN GOTAS X 30 ML,1 ACTIFEM COMPRESA CALIENTE X 1,1 ACD VIMIN GOTAS X 30 ML,1 AFUNGIL 166.66MG/33.33MG X CAPSULA,1 ADRENALINA 1 MG AMPOLLA X 1 ML PHARMADINA",-->
<!--        "user": {-->
<!--        "id": 1,-->
<!--        "name": "Administrador",-->
<!--        "username": "admin",-->
<!--        "email": "admin@test.com",-->
<!--        "role": "Administrador",-->
<!--        "color": "red"-->
<!--        },-->
<!--        "cliente": {-->
<!--        "id": 1,-->
<!--        "nombre": "SN",-->
<!--        "ci": "0",-->
<!--        "telefono": null,-->
<!--        "direccion": null-->
<!--        },-->
<!--        "venta_detalles": [-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 8147,-->
<!--        "compra_detalle_id": 501,-->
<!--        "nombre": "0 ES 3 COMPRIMIDO",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "49205",-->
<!--        "fecha_vencimiento": "2026-05-01",-->
<!--        "precio": 4,-->
<!--        "producto": {-->
<!--        "id": 8147,-->
<!--        "nombre": "0 ES 3 COMPRIMIDO",-->
<!--        "imagen": "1760708360.jpeg",-->
<!--        "descripcion": "RELAJANTE SEDANTE NATURAL",-->
<!--        "unidad": null,-->
<!--        "precio": "3.50",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "22"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 4452,-->
<!--        "compra_detalle_id": 1607,-->
<!--        "nombre": "4 DERM 10 GR",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "2e2434",-->
<!--        "fecha_vencimiento": "2027-06-01",-->
<!--        "precio": 47,-->
<!--        "producto": {-->
<!--        "id": 4452,-->
<!--        "nombre": "4 DERM 10 GR",-->
<!--        "imagen": "17063795654 DERM 10 GR.jpg",-->
<!--        "descripcion": "Antimicótico y antiinflamatorio",-->
<!--        "unidad": "CREMA DERMICA",-->
<!--        "precio": "47.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "1"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 8084,-->
<!--        "compra_detalle_id": 152,-->
<!--        "nombre": "A-MINA FORTE",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "PA2301",-->
<!--        "fecha_vencimiento": "2026-08-01",-->
<!--        "precio": 1,-->
<!--        "producto": {-->
<!--        "id": 8084,-->
<!--        "nombre": "A-MINA FORTE",-->
<!--        "imagen": "1760708324.jpeg",-->
<!--        "descripcion": "SUPLEMENTO DE VITAMINA A",-->
<!--        "unidad": "CAPSULAS DE GELATINA BLANDA",-->
<!--        "precio": "1.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "10"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 2627,-->
<!--        "compra_detalle_id": 1647,-->
<!--        "nombre": "ABRILAR EA 575 FCO. X 100 ML JARABE",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "23M135A",-->
<!--        "fecha_vencimiento": "2026-10-30",-->
<!--        "precio": 117,-->
<!--        "producto": {-->
<!--        "id": 2627,-->
<!--        "nombre": "ABRILAR EA 575 FCO. X 100 ML JARABE",-->
<!--        "imagen": "1727539433Jarabe-Abrilar.jpg",-->
<!--        "descripcion": "Espectorante Natural Broncodilatador y Antitusivo",-->
<!--        "unidad": "JARABES",-->
<!--        "precio": "117.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "1"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 2627,-->
<!--        "compra_detalle_id": 1647,-->
<!--        "nombre": "ABRILAR EA 575 FCO. X 100 ML JARABE",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "23M135A",-->
<!--        "fecha_vencimiento": "2026-10-30",-->
<!--        "precio": 117,-->
<!--        "producto": {-->
<!--        "id": 2627,-->
<!--        "nombre": "ABRILAR EA 575 FCO. X 100 ML JARABE",-->
<!--        "imagen": "1727539433Jarabe-Abrilar.jpg",-->
<!--        "descripcion": "Espectorante Natural Broncodilatador y Antitusivo",-->
<!--        "unidad": "JARABES",-->
<!--        "precio": "117.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "1"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 2625,-->
<!--        "compra_detalle_id": 1648,-->
<!--        "nombre": "ABRILAR EA 575 MENTOLADO JARABE X 100 ML",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "24A100B",-->
<!--        "fecha_vencimiento": "2026-12-30",-->
<!--        "precio": 117,-->
<!--        "producto": {-->
<!--        "id": 2625,-->
<!--        "nombre": "ABRILAR EA 575 MENTOLADO JARABE X 100 ML",-->
<!--        "imagen": "1727539375ABRILAR-MENTOLADO-JARABE-100ML-768x768.jpg",-->
<!--        "descripcion": "Espectorante Natural Broncodilatador y Antitusivo",-->
<!--        "unidad": "FRASCO",-->
<!--        "precio": "117.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "2"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 2101,-->
<!--        "compra_detalle_id": 969,-->
<!--        "nombre": "ACD VIMIN GOTAS X 30 ML",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "32468",-->
<!--        "fecha_vencimiento": "2027-03-01",-->
<!--        "precio": 84,-->
<!--        "producto": {-->
<!--        "id": 2101,-->
<!--        "nombre": "ACD VIMIN GOTAS X 30 ML",-->
<!--        "imagen": "1712071180Captura de pantalla 2024-04-02 111927.png",-->
<!--        "descripcion": "Avitaminosis A-C-D",-->
<!--        "unidad": "FRASCOS",-->
<!--        "precio": "84.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": 0-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 1129,-->
<!--        "compra_detalle_id": 1545,-->
<!--        "nombre": "ACTIFEM COMPRESA CALIENTE X 1",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "BW23065",-->
<!--        "fecha_vencimiento": "2026-11-01",-->
<!--        "precio": 42,-->
<!--        "producto": {-->
<!--        "id": 1129,-->
<!--        "nombre": "ACTIFEM COMPRESA CALIENTE X 1",-->
<!--        "imagen": "1705101651ACTIFEM COMPRESA CALIENTE X 1.jpg",-->
<!--        "descripcion": "Alivio de los dolores menstruales, dispositivo de calor",-->
<!--        "unidad": "UNIDAD",-->
<!--        "precio": "42.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": 0-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 2101,-->
<!--        "compra_detalle_id": 969,-->
<!--        "nombre": "ACD VIMIN GOTAS X 30 ML",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "32468",-->
<!--        "fecha_vencimiento": "2027-03-01",-->
<!--        "precio": 84,-->
<!--        "producto": {-->
<!--        "id": 2101,-->
<!--        "nombre": "ACD VIMIN GOTAS X 30 ML",-->
<!--        "imagen": "1712071180Captura de pantalla 2024-04-02 111927.png",-->
<!--        "descripcion": "Avitaminosis A-C-D",-->
<!--        "unidad": "FRASCOS",-->
<!--        "precio": "84.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": 0-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 1579,-->
<!--        "compra_detalle_id": 171,-->
<!--        "nombre": "AFUNGIL 166.66MG/33.33MG X CAPSULA",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "624101",-->
<!--        "fecha_vencimiento": "2026-06-01",-->
<!--        "precio": 13,-->
<!--        "producto": {-->
<!--        "id": 1579,-->
<!--        "nombre": "AFUNGIL 166.66MG/33.33MG X CAPSULA",-->
<!--        "imagen": "1705422438afungil.jpg",-->
<!--        "descripcion": "Antiinfeccioso ginecológico.",-->
<!--        "unidad": "CAPSULAS",-->
<!--        "precio": "12.50",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "7"-->
<!--        }-->
<!--        },-->
<!--        {-->
<!--        "venta_id": 357,-->
<!--        "producto_id": 4089,-->
<!--        "compra_detalle_id": 1180,-->
<!--        "nombre": "ADRENALINA 1 MG AMPOLLA X 1 ML PHARMADINA",-->
<!--        "cantidad": 1,-->
<!--        "unidad": null,-->
<!--        "lote": "30788",-->
<!--        "fecha_vencimiento": "2026-11-01",-->
<!--        "precio": 16,-->
<!--        "producto": {-->
<!--        "id": 4089,-->
<!--        "nombre": "ADRENALINA 1 MG AMPOLLA X 1 ML PHARMADINA",-->
<!--        "imagen": "1707432183ADRENALINA (PHA) AMP.png",-->
<!--        "descripcion": "Catecolamina simpaticomimética",-->
<!--        "unidad": "AMPOLLAS",-->
<!--        "precio": "16.00",-->
<!--        "stock": null,-->
<!--        "stock_minimo": null,-->
<!--        "stock_maximo": null,-->
<!--        "cantidad": "56"-->
<!--        }-->
<!--        }-->
<!--        ]-->
<!--        }-->
      </q-card>
    </q-dialog>
    <div id="myElement" class="hidden"></div>
  </q-page>
</template>
<script>
import moment from 'moment'
import {Imprimir} from "src/addons/Imprimir";
import {Excel} from "src/addons/Excel";
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
      users: [],
      user: '',
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
      ],
      devDialog: false,
      devVentaId: null,
      devItems: [],  // { id, producto_id, nombre, cantidad, _devolver }
    }
  },
  mounted() {
    this.ventasGet()
    this.usersGet()
  },
  methods: {
    devolverProducto(ventaId, ventaDetalleId, cantidadVendido) {
      // const cantidadDevolver = prompt(`Ingrese la cantidad a devolver (vendido: ${cantidadVendido}):`, '1');
      // const cantidadNum = Number(cantidadDevolver);
      this.$q.dialog({
        title: 'Devolver producto',
        message: `Ingrese la cantidad a devolver (vendido: ${cantidadVendido}):`,
        prompt: {
          model: cantidadVendido,
          type: 'number',
          isValid: val => {
            const num = Number(val);
            return !isNaN(num) && num > 0 && num <= cantidadVendido;
          },
          label: 'Cantidad a devolver',
          hint: `Debe ser un número entre 1 y ${cantidadVendido}`,
          mask: '##########'
        },
        cancel: true,
        persistent: true
      }).onOk(cantidadDevolver => {
        const cantidadNum = Number(cantidadDevolver);

        if (isNaN(cantidadNum) || cantidadNum <= 0 || cantidadNum > cantidadVendido) {
          this.$alert.error('Cantidad inválida');
          return;
        }

        this.$axios.post('ventasDevolverProducto', {
          venta_id: ventaId,
          venta_detalle_id: ventaDetalleId,
          cantidad: cantidadNum
        }).then(res => {
          this.$alert.success('Producto devuelto correctamente');
          this.devDialog = false;
          this.ventasGet();
        }).catch(error => {
          this.$alert.error(error.response.data.message);
        });
      });
    },
    openDevolver(venta) {
      this.venta = venta;
      this.devDialog = true;
    },
    exportExcel() {
      // 1) Filtrar solo ventas activas
      const ventasActivas = (this.ventas || []).filter(v => String(v.estado).toLowerCase() === 'activo');

      if (ventasActivas.length === 0) {
        this.$q.notify({ type: 'warning', message: 'No hay ventas ACTIVAS para exportar' });
        return;
      }

      // 2) Exportar
      const data = [{
        columns: [
          { label: "ID",        value: "id" },
          { label: "Fecha",     value: "fecha" },
          { label: "Cliente",   value: "cliente.nombre" },
          { label: "Usuario",   value: "user.name" },
          { label: "Estado",    value: "estado" },          // seguirá apareciendo "Activo"
          { label: "Total",     value: "total" },
          { label: "Detalle",   value: "detailsText" },
          { label: "Tipo venta",value: "tipo_venta" },
        ],
        content: ventasActivas
      }];

      Excel.export(data, 'Ventas_Activas');
    },
    usersGet() {
      this.$axios.get('users').then(res => {
        this.users = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
    imprimir(venta) {
      // Imprimir.nota(venta)
      Imprimir.reciboVentaSimple(venta);
    },
    tipoVentasChange(id) {
      this.$axios.put(`tipoVentasChange/${id}`).then(res => {
        this.$alert.success('Tipo de venta cambiado')
        this.ventasGet()
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
    anular(id) {
      this.$alert.dialog('¿Está seguro de anular la venta?').onOk(() => {
        this.$axios.put(`ventasAnular/${id}`).then(res => {
          this.$alert.success('Venta anulada')
          this.ventasGet()
        }).catch(error => {
          this.$alert.error(error.response.data.message)
        })
      })
    },
    ventasGet() {
      this.loading = true
      this.$axios.get('ventas',{
        params: {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          user: this.user
        }
      }).then(res => {
        this.ventas = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
  },
  computed: {
    usersTodos() {
      // colocar a user todos
      return [{label: 'Todos', value: ''}, ...this.users.map(user => ({label: user.name, value: user.id}))]
    },
    totalInternos() {
      return this.ventas.reduce((acc, venta) => venta.tipo_venta === 'Internado' && venta.estado === 'Activo' ? acc + parseFloat(venta.total) : acc, 0)
    },
    totalExternos() {
      return this.ventas.reduce((acc, venta) => venta.tipo_venta === 'Externo' && venta.estado === 'Activo' ? acc + parseFloat(venta.total) : acc, 0)
    }
  }
}
</script>
