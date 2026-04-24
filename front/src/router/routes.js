const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') , meta: { requiresAuth: true } },
      { path: 'usuarios', component: () => import('pages/usuarios/Usuarios.vue'), meta: { requiresAuth: true } },
      { path: 'pacientes', name: 'pacientes', component: () => import('pages/pacientes/Paciente.vue'), meta: { requiresAuth: true } },
      { path: 'productos', name: 'productos', component: () => import('pages/productos/Productos.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'venta', name: 'venta', component: () => import('pages/ventas/Ventas.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'pacienteNew', name: 'pacienteNew', component: () => import('pages/pacientes/PacienteNew.vue'), meta: { requiresAuth: true } },
      { path: 'ventaNuevo', name: 'ventaNuevo', component: () => import('pages/ventas/VentaNew.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'paciente/:id', name: 'paciente', component: () => import('pages/pacientes/PacienteShow.vue'), meta: { requiresAuth: true } },
      { path: 'proveedores', name: 'proveedores', component: () => import('pages/proveedores/Proveedores.vue'), meta: { requiresAuth: true } },
      { path: 'compras', name: 'compras', component: () => import('pages/compras/Compras.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'compras-create', name: 'compras-create', component: () => import('pages/compras/ComprasCreate.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'productos-vencer', name: 'productos-vencer', component: () => import('pages/productos/ProductosVencer.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'productos-vencidos', name: 'productos-vencidos', component: () => import('pages/productos/ProductosVencidos.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'reportes/farmacia', name: 'reportes-farmacia', component: () => import('pages/reportes/ReporteFarmacia.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' } },
      { path: 'institucional/productos', name: 'productos-institucional', component: () => import('pages/productos/Productos.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/venta', name: 'venta-institucional', component: () => import('pages/ventas/Ventas.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/ventaNuevo', name: 'ventaNuevo-institucional', component: () => import('pages/ventas/VentaNew.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/compras', name: 'compras-institucional', component: () => import('pages/compras/Compras.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/compras-create', name: 'compras-create-institucional', component: () => import('pages/compras/ComprasCreate.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/productos-vencer', name: 'productos-vencer-institucional', component: () => import('pages/productos/ProductosVencer.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/productos-vencidos', name: 'productos-vencidos-institucional', component: () => import('pages/productos/ProductosVencidos.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      { path: 'institucional/reportes/farmacia', name: 'reportes-farmacia-institucional', component: () => import('pages/reportes/ReporteFarmacia.vue'), meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' } },
      // doctores
      { path: 'doctores', name: 'doctores', component: () => import('pages/doctores/Doctores.vue'), meta: { requiresAuth: true } },
      { path: 'aranceles', name: 'aranceles', component: () => import('pages/aranceles/Aranceles.vue'), meta: { requiresAuth: true } },
      { path: 'formularios-control', name: 'formularios-control', component: () => import('pages/formularios-control/FormulariosControl.vue'), meta: { requiresAuth: true } },
      { path: 'formularios-control/nuevo', name: 'formularios-control-nuevo', component: () => import('pages/formularios-control/FormularioControlForm.vue'), meta: { requiresAuth: true } },
      { path: 'formularios-control/:id', name: 'formularios-control-editar', component: () => import('pages/formularios-control/FormularioControlForm.vue'), meta: { requiresAuth: true } },
      { path: 'caja-recepciones', name: 'caja-recepciones', component: () => import('pages/caja-recepcion/CajaRecepcionList.vue'), meta: { requiresAuth: true } },
      { path: 'caja-recepciones/nuevo', name: 'caja-recepciones-nuevo', component: () => import('pages/caja-recepcion/CajaRecepcionForm.vue'), meta: { requiresAuth: true } },
      { path: 'caja-recepciones/:id', name: 'caja-recepciones-editar', component: () => import('pages/caja-recepcion/CajaRecepcionForm.vue'), meta: { requiresAuth: true } },
      { path: 'traspaso', name: 'traspaso', component: () => import('pages/Traspaso.vue'), meta: { requiresAuth: true } },
      { path: 'historial-traspasos', name: 'historial-traspasos', component: () => import('pages/HistorialTraspasos.vue'), meta: { requiresAuth: true } },
      {
        path: '/productos-precios',
        component: () => import('pages/productos/ProductosPreciosPage.vue'),
        meta: { requiresAuth: true, farmaciaTipo: 'Farmacia', farmaciaNombre: 'Farmacia' }
      },
      {
        path: '/institucional/productos-precios',
        component: () => import('pages/productos/ProductosPreciosPage.vue'),
        meta: { requiresAuth: true, farmaciaTipo: 'Farmacia institucional', farmaciaNombre: 'Farmacia institucional' }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/login/Login.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
