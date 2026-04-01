<template>
  <q-page class="q-pa-md">
    <q-table :rows="filteredRows" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
              title="Usuarios">
      <template v-slot:top-right>
          <q-btn color="primary" label="Nuevo" @click="userNew" outline no-caps  icon="add_circle_outline" :loading="loading" />
          <q-select
            v-model="roleFilter"
            :options="roleFilterOptions"
            label="Rol"
            dense
            outlined
            emit-value
            map-options
            clearable
            style="min-width: 180px"
          />
          <q-btn color="secondary" label="PDF" @click="exportPdf" outline no-caps icon="picture_as_pdf" :disable="filteredRows.length === 0" />
          <q-btn color="positive" label="Excel" @click="exportExcel" outline no-caps icon="file_download" :disable="filteredRows.length === 0" />
          <q-input v-model="filter" label="Buscar" dense outlined >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
              <q-list>
                <q-item clickable @click="userEdit(props.row)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Editar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="userDelete(props.row.id)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="userEditPassword(props.row)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="edit" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Cambiar contraseña</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable @click="dialogPermisosClick(props.row)" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="lock_open" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Permisos</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
          </q-btn-dropdown>
        </q-td>
      </template>
      <template v-slot:body-cell-role="props">
        <q-td :props="props">
          <q-chip :label="props.row.role"
                  :color="props.row.color"
                  text-color="white" dense  size="14px"/>
        </q-td>
      </template>
      <template v-slot:body-cell-permisos="props">
        <q-td :props="props">
          <div class="permission-chips">
            <q-chip
              v-for="(permiso, index) in props.row.permissions"
              :key="index"
              dense
              size="11px"
              color="blue-1"
              text-color="primary"
            >
              {{ permiso.name }}
            </q-chip>
          </div>
        </q-td>
      </template>
    </q-table>
<!--    <pre>{{ users }}</pre>-->
<!--    {-->
<!--    "id": 2,-->
<!--    "name": "Adimer Paul Chambi Ajata",-->
<!--    "username": "adimer",-->
<!--    "email": null,-->
<!--    "role": "Farmacia",-->
<!--    "color": "green",-->
<!--    "permissions": [-->
<!--    {-->
<!--    "id": 9,-->
<!--    "name": "ver productos",-->
<!--    "guard_name": "web",-->
<!--    "created_at": "2025-05-12T08:19:01.000000Z",-->
<!--    "updated_at": "2025-05-12T08:19:01.000000Z",-->
<!--    "pivot": {-->
<!--    "model_type": "App\\Models\\User",-->
<!--    "model_id": 2,-->
<!--    "permission_id": 9-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 13,-->
<!--    "name": "ver ventas",-->
<!--    "guard_name": "web",-->
<!--    "created_at": "2025-05-12T08:19:01.000000Z",-->
<!--    "updated_at": "2025-05-12T08:19:01.000000Z",-->
<!--    "pivot": {-->
<!--    "model_type": "App\\Models\\User",-->
<!--    "model_id": 2,-->
<!--    "permission_id": 13-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 14,-->
<!--    "name": "crear venta",-->
<!--    "guard_name": "web",-->
<!--    "created_at": "2025-05-12T08:19:01.000000Z",-->
<!--    "updated_at": "2025-05-12T08:19:01.000000Z",-->
<!--    "pivot": {-->
<!--    "model_type": "App\\Models\\User",-->
<!--    "model_id": 2,-->
<!--    "permission_id": 14-->
<!--    }-->
<!--    }-->
<!--    ]-->
<!--    },-->
    <q-dialog v-model="userDialog" persistent>
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} user
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="userDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="user.id ? userPut() : userPost()">
            <q-input v-model="user.name" label="Nombre" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="user.username" label="Usuario" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="user.email" label="Email" dense outlined hint="" />
            <q-input v-model="user.password" label="Contraseña" dense outlined :rules="[val => !!val || 'Campo requerido']" v-if="!user.id" />
            <q-select v-model="user.role" label="Rol" dense outlined :options="roles" :rules="[val => !!val || 'Campo requerido']" />
            <div class="text-right" >
              <q-btn color="negative" label="Cancelar" @click="userDialog = false" no-caps :loading="loading" />
              <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogPermisos">
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div>
            Permisos de {{ user.name }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="dialogPermisos = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
<!--          <q-option-group-->
<!--            v-model="group"-->
<!--            :options="options"-->
<!--            color="green"-->
<!--            type="checkbox"-->
<!--          />-->
          <div class="permission-grid">
            <q-checkbox
              v-for="permiso in permisos"
              :key="permiso.id"
              :model-value="user.permissionsSelected.includes(permiso.name)"
              :label="permiso.name"
              dense
              color="green"
              class="permission-item"
              @update:model-value="togglePermission(permiso.name, $event)"
            />
          </div>
          <div class="text-right q-mt-md">
            <q-btn label="Guardar permisos" color="primary" @click="guardarPermisos" :loading="loading" no-caps />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import moment from 'moment'
import { Excel } from 'src/addons/Excel'
export default {
  name: 'UsuariosPage',
  data() {
    return {
      users: [],
      user: {},
      userDialog: false,
      loading: false,
      actionPeriodo: '',
      gestiones: [],
      filter: '',
      roleFilter: null,
      roles: ['Farmacia', 'Secretaria', 'Administrador', 'Recepcion', 'Enfermer'],
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
        { name: 'username', label: 'Usuario', align: 'left', field: 'username' },
        { name: 'role', label: 'Rol', align: 'left', field: 'role' },
        { name: 'permisos', label: 'Permisos', align: 'left', field: 'permisos' }
      ],
      permisos: [],
      dialogPermisos: false,
    }
  },
  mounted() {
    this.usersGet()
    this.permisosGet()
  },
  methods: {
    guardarPermisos() {
      this.loading = true
      this.$axios.put(`users/${this.user.id}/permisos`, {
        permissions: this.user.permissionsSelected
      }).then(() => {
        this.$alert.success('Permisos actualizados')
        this.dialogPermisos = false
        this.usersGet()
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error al actualizar permisos')
      }).finally(() => {
        this.loading = false
      })
    },
    togglePermission(permissionName, checked) {
      const selected = [...(this.user.permissionsSelected || [])]

      if (checked) {
        if (!selected.includes(permissionName)) {
          selected.push(permissionName)
        }
        this.user.permissionsSelected = selected
        return
      }

      this.user.permissionsSelected = selected.filter(permission => permission !== permissionName)
    },
    exportExcel() {
      Excel.export([{
        sheet: 'Usuarios',
        columns: [
          { label: 'ID', value: 'id' },
          { label: 'Nombre', value: 'name' },
          { label: 'Usuario', value: 'username' },
          { label: 'Email', value: row => row.email || '' },
          { label: 'Rol', value: 'role' },
          { label: 'Permisos', value: row => (row.permissions || []).map(permission => permission.name).join(', ') }
        ],
        content: this.filteredRows
      }], 'Usuarios_Clinica_La_Fuente')
    },
    exportPdf() {
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        this.$alert.error('El navegador bloqueo la ventana emergente del PDF')
        return
      }

      const rows = this.filteredRows.map(user => `
        <tr>
          <td>${user.id}</td>
          <td>${user.name || ''}</td>
          <td>${user.username || ''}</td>
          <td>${user.email || ''}</td>
          <td>${user.role || ''}</td>
          <td>${(user.permissions || []).map(permission => permission.name).join(', ')}</td>
        </tr>
      `).join('')

      printWindow.document.write(`
        <html lang="es">
          <head>
            <title>Usuarios Clinica La Fuente</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #1f2937; }
              h1 { margin: 0 0 6px; font-size: 22px; }
              p { margin: 0 0 16px; color: #4b5563; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; text-align: left; }
              th { background: #f3f4f6; }
            </style>
          </head>
          <body>
            <h1>Usuarios</h1>
            <p>Filtro de rol: ${this.roleFilter || 'Todos'}</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Permisos</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    },
    permisosGet() {
      this.loading = true
      this.$axios.get('permisos').then(res => {
        this.permisos = res.data
        this.loading = false
          // [
          // {
          //   "id": 1,
          //   "name": "ver usuarios",
          //   "guard_name": "web",
          //   "created_at": "2025-05-12T08:19:01.000000Z",
          //   "updated_at": "2025-05-12T08:19:01.000000Z"
          // },
      }).catch(error => {
        this.$alert.error(error.response.data.message)
        this.loading = false
      })
    },
    userNew() {
      this.user = {
        name: '',
        email: '',
        password: '',
        area_id: 1,
        username: '',
        cargo: '',
        role: 'Recepcion',
        permissionsSelected: []
      }
      this.actionPeriodo = 'Nuevo'
      this.userDialog = true
    },
    usersGet() {
      this.loading = true
      this.$axios.get('users').then(res => {
        this.users = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    gestionGet() {
      this.loading = true
      this.$axios.get('gestiones').then(res => {
        this.gestiones = res.data
        this.loading = false
      }).catch(error => {
        this.$alert.error(error.response.data.message)
        this.loading = false
      })
    },
    userPost() {
      this.loading = true
      this.$axios.post('users', this.user).then(res => {
        this.usersGet()
        this.userDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    userPut() {
      this.loading = true
      this.$axios.put('users/' + this.user.id, this.user).then(res => {
        this.usersGet()
        this.userDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    dialogPermisosClick(user) {
      this.dialogPermisos = true
      this.user = {
        ...user,
        permissionsSelected: user.permissions?.map(p => p.name) || []
      }
    },
    userEditPassword(user) {
      this.user = { ...user }
      this.$alert.dialogPrompt('Nueva contraseña', 'Ingrese la nueva contraseña', 'password')
        .onOk(password => {
          this.$axios.put('updatePassword/' + user.id, { password }).then(res => {
            this.usersGet()
            this.$alert.success('Contraseña actualizada')
          }).catch(error => {
            this.$alert.error(error.response.data.message)
          })
        })
    },
    userEdit(user) {
      this.user = { ...user }
      this.actionPeriodo = 'Editar'
      this.userDialog = true
    },
    userDelete(id) {
      this.$alert.dialog('¿Desea eliminar el user?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('users/' + id).then(res => {
            this.usersGet()
            this.$alert.success('Periodo eliminado')
          }).catch(error => {
            this.$alert.error(error.response.data.message)
          }).finally(() => {
            this.loading = false
          })
        })
    }
  },
  computed: {
    roleFilterOptions() {
      return [
        { label: 'Todos', value: null },
        ...this.roles.map(role => ({ label: role, value: role }))
      ]
    },
    filteredRows() {
      const text = (this.filter || '').trim().toLowerCase()

      return this.users.filter(user => {
        const matchesRole = !this.roleFilter || user.role === this.roleFilter

        if (!matchesRole) {
          return false
        }

        if (!text) {
          return true
        }

        const permissions = (user.permissions || []).map(permission => permission.name).join(' ').toLowerCase()
        const haystack = [
          user.name,
          user.username,
          user.email,
          user.role,
          permissions
        ].join(' ').toLowerCase()

        return haystack.includes(text)
      })
    }
  }
}
</script>
<style scoped>
.permission-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 320px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 4px 12px;
  max-height: 52vh;
  overflow-y: auto;
  padding-top: 8px;
}

.permission-item {
  margin: 0;
}
</style>
