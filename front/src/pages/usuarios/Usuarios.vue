<template>
  <q-page class="q-pa-md">
    <q-table :rows="users" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
              title="Usuarios" :filter="filter">
      <template v-slot:top-right>
          <q-btn color="primary" label="Nuevo" @click="userNew" outline no-caps  icon="add_circle_outline" :loading="loading" />
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
          <ul style="padding: 0;margin: 0;width: 150px;">
            <li v-for="(permiso, index) in props.row.permissions" :key="index" style="list-style: none;padding: 0;margin: 0;">
              {{ permiso.name }}
            </li>
          </ul>
        </q-td>
      </template>
    </q-table>
    <pre>{{ users }}</pre>
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
          <q-option-group
            v-model="user.permissionsSelected"
            :options="permisos.map(p => ({ label: p.name, value: p.name }))"
            type="checkbox"
            color="green"
            dense
          />
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
      roles: ['Farmacia', 'Secretaria', 'Administrador'],
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
        role: 'Area',
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
  }
}
</script>
