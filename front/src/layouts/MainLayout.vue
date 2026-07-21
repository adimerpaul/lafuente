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
          <span class="text-subtitle2">
            {{ $version }}
          </span>
        </q-toolbar-title>
        <div>
          <q-btn-group flat>
            <q-btn icon="notifications" flat dense>
              <q-badge v-if="notificaciones.length" color="red" floating>{{ notificaciones.length }}</q-badge>
              <q-menu>
                <q-list style="min-width: 250px; max-height: 300px" separator>
                  <q-item v-if="notificaciones.length === 0">
                    <q-item-section>No hay productos por vencer</q-item-section>
                  </q-item>
                  <q-item v-for="(n, index) in notificaciones" :key="index" clickable>
                    <q-item-section avatar>
                      <q-avatar size="36px">
                        <img :src="`${$url}../images/${n.imagen}`" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ n.producto }}</q-item-label>
                      <q-item-label caption>Vence en {{ n.dias_restantes }} dÃ­as</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn no-caps icon="o_account_circle" dense :label="$store.user.name">
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
      :width="250"
      :breakpoint="500"
      class="drawer-shell text-white"
    >
      <div class="drawer-content">
        <div class="drawer-profile">
          <div class="drawer-profile__avatar">
            <q-icon name="account_circle" size="32px" />
          </div>
          <div class="drawer-profile__info">
            <div class="drawer-profile__name">
              {{ $store.user.name }}
            </div>
            <q-chip :color="$store.user.color" text-color="white" dense class="drawer-profile__role">
              {{ $store.user.role }}
            </q-chip>
          </div>
        </div>

        <div class="drawer-section-label">
          Navegación
        </div>

        <q-list dense class="drawer-list">
          <template v-for="section in visibleSections" :key="section.title">
            <q-expansion-item
              dense
              dense-toggle
              expand-separator
              :default-opened="sectionIsActive(section)"
              :icon="section.icon"
              :label="section.title"
              :header-class="sectionIsActive(section) ? 'drawer-group drawer-group--active' : 'drawer-group'"
            >
              <q-list dense class="q-px-xs q-pb-xs">
                <q-item
                  v-for="link in section.links.filter(canAccess)"
                  :key="link.title"
                  clickable
                  :to="link.link"
                  exact
                  class="drawer-link"
                  :active="linkIsActive(link)"
                  active-class="menu"
                >
                  <q-item-section avatar class="drawer-link__avatar">
                    <q-icon
                      :name="linkIsActive(link) ? 'o_' + link.icon : link.icon"
                      :class="linkIsActive(link) ? 'text-white' : 'text-blue-grey-2'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label :class="linkIsActive(link) ? 'text-white text-weight-bold' : 'text-blue-grey-1'">
                      {{ link.title }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </template>
        </q-list>

        <q-item clickable class="drawer-logout" @click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Salir</q-item-label>
          </q-item-section>
        </q-item>
      </div>
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
      menuSections: [
        {
          title: 'General',
          icon: 'space_dashboard',
          links: [
            { title: 'Principal', icon: 'dashboard', link: '/', can: 'Todos' },
          ]
        },
        {
          title: 'Farmacia',
          icon: 'local_pharmacy',
          links: [
            { title: 'Productos', icon: 'inventory_2', link: '/productos', can: ['Productos farmacia', 'Productos'] },
            { title: 'Ventas', icon: 'sell', link: '/venta', can: ['Ventas farmacia', 'Ventas'] },
            { title: 'Venta nueva', icon: 'add_shopping_cart', link: '/ventaNuevo', can: ['Ventas nuevas farmacia', 'Ventas nuevas', 'Nueva venta'] },
            { title: 'Compras', icon: 'shopping_cart_checkout', link: '/compras', can: ['Compras farmacia', 'Compras'] },
            { title: 'Compras nuevas', icon: 'add_business', link: '/compras-create', can: ['Compras nuevas farmacia', 'Compras nuevas'] },
            { title: 'Por vencer', icon: 'hourglass_bottom', link: '/productos-vencer', can: ['Productos por vencer farmacia', 'Productos por vencer'] },
            { title: 'Vencidos', icon: 'report_problem', link: '/productos-vencidos', can: ['Productos vencidos farmacia', 'Productos vencidos'] },
          ]
        },
        {
          title: 'Farmacia Institucional',
          icon: 'medical_services',
          links: [
            { title: 'Pacientes internados', icon: 'personal_injury', link: '/institucional/pacientes-internados', can: 'Pacientes internados farmacia institucional' },
            { title: 'Productos', icon: 'inventory_2', link: '/institucional/productos', can: 'Productos farmacia institucional' },
            { title: 'Ventas', icon: 'sell', link: '/institucional/venta', can: 'Ventas farmacia institucional' },
            { title: 'Venta nueva', icon: 'add_shopping_cart', link: '/institucional/ventaNuevo', can: 'Ventas nuevas farmacia institucional' },
            { title: 'Compras', icon: 'shopping_cart_checkout', link: '/institucional/compras', can: 'Compras farmacia institucional' },
            { title: 'Compras nuevas', icon: 'add_business', link: '/institucional/compras-create', can: 'Compras nuevas farmacia institucional' },
            { title: 'Por vencer', icon: 'hourglass_bottom', link: '/institucional/productos-vencer', can: 'Productos por vencer farmacia institucional' },
            { title: 'Vencidos', icon: 'report_problem', link: '/institucional/productos-vencidos', can: 'Productos vencidos farmacia institucional' },
          ]
        },
        {
          title: 'Reportes',
          icon: 'assessment',
          links: [
            { title: 'Reporte farmacia', icon: 'summarize', link: '/reportes/farmacia', can: 'Reportes farmacia' },
            { title: 'Altas y Bajas pacientes', icon: 'medical_information', link: '/reportes/pacientes', can: 'Pacientes' },
            { title: 'Reporte farmacia institucional', icon: 'summarize', link: '/institucional/reportes/farmacia', can: 'Reportes farmacia institucional' },
          ]
        },
        {
          title: 'Operaciones',
          icon: 'swapHoriz',
          links: [
            { title: 'Traspaso de productos', icon: 'swap_horiz', link: '/traspaso', can: 'Traspaso' },
            { title: 'Listado de traspasos', icon: 'receipt_long', link: '/historial-traspasos', can: 'Traspaso' },
          ]
        },
        {
          title: 'Clínica',
          icon: 'local_hospital',
          links: [
            { title: 'Usuarios', icon: 'supervisor_account', link: '/usuarios', can: 'Usuarios' },
            { title: 'Doctor', icon: 'medical_services', link: '/doctores', can: 'Doctores' },
            { title: 'Pacientes', icon: 'personal_injury', link: '/pacientes', can: 'Pacientes' },
            { title: 'Proveedores', icon: 'local_shipping', link: '/proveedores', can: 'Proveedores' },
            { title: 'Precios productos', icon: 'price_check', link: '/productos-precios', can: 'Precio de ventas productos' },
          ]
        },
        {
          title: 'Financiera',
          icon: 'account_balance_wallet',
          links: [
            { title: 'Aranceles', icon: 'medical_information', link: '/aranceles', can: 'Aranceles' },
            { title: 'Costos', icon: 'receipt_long', link: '/costos', can: 'Costos' },
            // { title: 'Formularios control', icon: 'assignment_turned_in', link: '/formularios-control', can: 'Formularios control' },
            // { title: 'Formulario nuevo', icon: 'post_add', link: '/formularios-control/nuevo', can: ['Formulario control nuevo', 'Formularios control'] },
            { title: 'Caja recepción', icon: 'point_of_sale', link: '/caja-recepciones', can: 'Caja recepcion' },
            { title: 'Crear caja recepción', icon: 'receipt_long', link: '/caja-recepciones/nuevo', can: 'Caja recepcion crear' },
            { title: 'Cobros retrasados', icon: 'schedule', link: '/cobros-retrasados', can: 'Cobros retrasados' },
          ]
        }
      ],
      notificaciones: [],
    }
  },
  mounted () {
    this.getNotificaciones()
  },
  watch: {
    '$route.fullPath' () {
      this.getNotificaciones()
    }
  },
  computed: {
    rutaActual () {
      return this.$route.path
    },
    visibleSections () {
      const order = ['General', 'ClÃ­nica', 'Clínica', 'Farmacia', 'Farmacia Institucional', 'Operaciones', 'Financiera', 'Reportes']
      const orderIndex = (title) => {
        const index = order.indexOf(title)
        return index === -1 ? Number.MAX_SAFE_INTEGER : index
      }
      return this.menuSections
        .filter(section => this.groupHasAccess(section))
        .sort((a, b) => orderIndex(a.title) - orderIndex(b.title))
    }
  },
  methods: {
    getNotificaciones () {
      this.$axios.get('/productos-por-vencer-campana', {
        params: {
          farmacia_tipo: this.$route.meta?.farmaciaTipo || 'Farmacia'
        }
      }).then(res => {
        this.notificaciones = res.data
      }).catch(() => {
        this.notificaciones = []
      })
    },
    canAccess (link) {
      if (!link || !link.can) return false
      if (link.can === 'Todos') return true
      const required = Array.isArray(link.can) ? link.can : [link.can]
      return this.$store.permissions.some(p => required.includes(p.name))
    },
    groupHasAccess (section) {
      return section.links.some(link => this.canAccess(link))
    },
    linkIsActive (link) {
      return this.$route.path === link.link
    },
    sectionIsActive (section) {
      return section.links.some(link => this.linkIsActive(link))
    },
    logout () {
      this.$alert.dialog('Â¿Desea salir del sistema?')
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
  }
}
</script>

<style>
.drawer-shell {
  background: linear-gradient(180deg, #0f4c81 0%, #0a3558 100%);
}

.drawer-content {
  min-height: 100%;
  padding: 8px 6px 10px;
}

.drawer-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 6px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(6px);
}

.drawer-profile__avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
}

.drawer-profile__info {
  min-width: 0;
}

.drawer-profile__name {
  font-weight: 700;
  font-size: 13px;
  line-height: 1.1;
  margin-bottom: 2px;
}

.drawer-profile__role {
  font-size: 10px;
}

.drawer-profile__role {
  margin-left: 0;
}

.drawer-section-label {
  padding: 0 8px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.72);
}

.drawer-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drawer-list .drawer-group {
  margin: 0;
  min-height: 26px;
  padding: 0 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.drawer-group--active {
  background: rgba(255, 255, 255, 0.16);
}

.drawer-list .drawer-link {
  min-height: 24px;
  border-radius: 6px;
  margin: 0;
  padding: 1px 6px;
}

.drawer-list .q-item__label {
  font-size: 12px;
  line-height: 1.2 !important;
}

.drawer-list .q-icon {
  font-size: 16px;
}

.drawer-list .q-item__section--avatar {
  min-width: 22px;
  padding-right: 6px;
}

.drawer-list .q-expansion-item__content > .q-list {
  padding: 0 2px 2px;
}

.menu {
  background-color: #1976D2;
  border-radius: 10px;
}

.drawer-logout {
  margin-top: 8px;
  border-radius: 10px;
  background: rgba(244, 67, 54, 0.14);
  color: #ffd5d2;
}
</style>
