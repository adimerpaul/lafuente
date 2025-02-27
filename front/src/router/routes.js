const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') , meta: { requiresAuth: true } },
      { path: 'usuarios', component: () => import('pages/usuarios/Usuarios.vue'), meta: { requiresAuth: true } },
      { path: 'pacientes', name: 'pacientes', component: () => import('pages/pacientes/Paciente.vue'), meta: { requiresAuth: true } },
      { path: 'productos', name: 'productos', component: () => import('pages/productos/Productos.vue'), meta: { requiresAuth: true } },
      { path: 'venta', name: 'venta', component: () => import('pages/ventas/Ventas.vue'), meta: { requiresAuth: true } },
      { path: 'pacienteNew', name: 'pacienteNew', component: () => import('pages/pacientes/PacienteNew.vue'), meta: { requiresAuth: true } },
      { path: 'ventaNuevo', name: 'ventaNuevo', component: () => import('pages/ventas/VentaNew.vue'), meta: { requiresAuth: true } },
      { path: 'paciente/:id', name: 'paciente', component: () => import('pages/pacientes/PacienteShow.vue'), meta: { requiresAuth: true } },
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
