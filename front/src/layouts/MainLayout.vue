<template>
  <q-layout view="hHh Lpr lFf">
    <q-header
      class="bg-white text-primary"
      bordered
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-btn no-caps flat dense round icon="o_search" />
<!--          {{ rutaActual }}-->
        </q-toolbar-title>
        <div>
<!--          Quasar v{{ $q.version }}-->
          <q-btn-group flat>
            <q-btn no-caps icon="o_notifications" />
            <q-btn no-caps icon="o_account_circle" >
              <q-menu>
                <q-list>
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-icon name="account_circle" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ $store.user.name }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ $store.user.role }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="logout" v-close-popup>
                    <q-item-section avatar>
                      <q-icon name="exit_to_app" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Salir</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-btn-group>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="200"
      :breakpoint="500"
      class="bg-primary text-white"
    >
      <q-list dense>
        <q-item dense>
          <q-item-section avatar>
            <q-icon name="account_circle" />
          </q-item-section>
          <q-item-section>
<!--            <pre>-->
<!--              {{ $store.user}}-->
<!--            </pre>-->
            <q-item-label >
              {{ $store.user.name }}
<!--              <q-chip color="white" text-color="primary" dense>-->
<!--              <span class="text-bold">-->
<!--                {{ $store.user.role }}-->
<!--              </span>-->
<!--              </q-chip>-->
            </q-item-label>
            <q-item-label caption>
              <q-chip :color="$store.user.color" text-color="white" dense>
                {{ $store.user.role }}
              </q-chip>
            </q-item-label>
          </q-item-section>
        </q-item>
<!--        <q-separator  class="bg-white" inset />-->
        <div class="text-white text-center text-bold">
          Opciones
        </div>
        <template v-for="link in linksList" :key="link.title">
          <q-item
            clickable
            :to="link.link"
            exact
            class="text-grey"
            active-class="menu"
            v-if="link && $store.user && (link.can.includes($store.user.role) || link.can.includes('Todos'))"
          >
            <q-item-section avatar>
              <q-icon
                :name="$route.path === link.link ? 'o_' + link.icon : link.icon"
                :class="$route.path === link.link ? 'text-white' : ''"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label :class="$route.path === link.link ? 'text-white text-bold' : ''">
                {{ link.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <q-item clickable class="text-red" @click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Salir</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      linksList: [
        {title: 'Principal', icon: 'home', link: '/', can: ['Todos']},
        {title: 'Usuarios', icon: 'account_circle', link: '/usuarios', can: ['Administrador']},
        {title: 'Pacientes', icon: 'people', link: '/pacientes', can: ['Todos']},
        {title: 'Productos', icon: 'shopping_cart', link: '/productos', can: ['Farmacia', 'Administrador']},
        {title: 'Venta', icon: 'point_of_sale', link: '/venta' , can: ['Todos']},
        {title: 'Proveedores', icon: 'local_shipping', link: '/proveedores', can: ['Farmacia', 'Administrador']},
        {title: 'Compras', icon: 'shopping_basket', link: '/compras', can: ['Farmacia', 'Administrador']},
        {title: 'Reportes', icon: 'assessment', link: '/reportes', can: ['Todos']},
      ]
    }
  },
  methods: {
    logout () {
      this.$alert.dialog('¿Desea salir del sistema?')
        .onOk(() => {
          this.$store.isLogged = false
          this.$store.user = {}
          localStorage.removeItem('tokenEducation')
          this.$router.push('/login')
        })
    },
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  },
  computed: {
    rutaActual () {
      return this.$route.path
    }
  }
}
</script>
<style>
.menu{
  background-color: #1976D2;
  border-radius: 10px;
  margin: 5px;
  padding: 5px
}
</style>
