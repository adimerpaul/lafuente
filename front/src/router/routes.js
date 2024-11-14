const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') , meta: { requiresAuth: true } },
      { path: 'almacen', component: () => import('pages/almacen/Almacen.vue'), meta: { requiresAuth: true } },
      { path: 'gestion', component: () => import('pages/gestion/Gestion.vue'), meta: { requiresAuth: true } },
      { path: 'usuarios', component: () => import('pages/usuarios/Usuarios.vue'), meta: { requiresAuth: true } },
      { path: 'poa', component: () => import('pages/poa/Poa.vue'), meta: { requiresAuth: true } },
      { path: 'poa/:id', name: 'poaVisible', component: () => import('pages/poa/PoaVisible.vue'), meta: { requiresAuth: true } },
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
