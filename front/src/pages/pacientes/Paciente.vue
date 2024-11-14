<template>
  <q-page class="q-pa-md">
    <q-table :rows="pacientes" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
             title="Usuarios" >
      <template v-slot:top>
        <div style="width: 100%">
          <div>
<!--            <q-btn color="primary" label="Nuevo" @click="pacienteNew" outline no-caps  icon="add_circle_outline" :loading="loading" />-->
            <q-input v-model="filter" label="Buscar" dense outlined @update:modelValue="pacientesGet" :debounce="500" clearable>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
              <template v-slot:before>
                <q-btn color="primary" label="Nuevo" @click="pacienteNew" outline no-caps  icon="add_circle_outline" :loading="loading" />
              </template>
            </q-input>
          </div>
          <div class="flex flex-center">
            <q-pagination v-model="current_page" :max="Math.ceil(total / per_page)" @update:modelValue="pacientesGet" :max-pages="5" />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
            <q-list>
              <q-item clickable @click="pacienteEdit(props.row)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Editar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="pacienteDelete(props.row.id)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
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
    </q-table>
    <pre>
      {{ pacientes }}
    </pre>
    <q-dialog v-model="pacienteDialog" persistent>
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} paciente
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="pacienteDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="paciente.id ? pacientePut() : pacientePost()">
            <q-input v-model="paciente.name" label="Nombre" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="paciente.pacientename" label="Usuario" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="paciente.email" label="Email" dense outlined hint="" />
            <q-input v-model="paciente.password" label="Contraseña" dense outlined :rules="[val => !!val || 'Campo requerido']" v-if="!paciente.id" />
            <q-select v-model="paciente.role" label="Rol" dense outlined :options="roles" :rules="[val => !!val || 'Campo requerido']" />
            <div class="text-right" >
              <q-btn color="negative" label="Cancelar" @click="pacienteDialog = false" no-caps :loading="loading" />
              <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />
            </div>
          </q-form>
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
      pacientes: [],
      paciente: {},
      pacienteDialog: false,
      loading: false,
      filter: '',
      current_page: 1,
      total: 0,
      per_page: 10,
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        { name: 'nombre_completo', label: 'Nombre', align: 'left', field: 'nombre_completo' },
        { name: 'identificacion', label: 'Identificación', align: 'left', field: 'identificacion' },
        { name: 'edad', label: 'Edad', align: 'left', field: 'edad' },
        { name: 'sexo', label: 'Sexo', align: 'left', field: 'sexo' },
        { name: 'estado_civil', label: 'Estado civil', align: 'left', field: 'estado_civil' },
        { name: 'direccion', label: 'Dirección', align: 'left', field: 'direccion' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' }
      ]
    }
  },
  mounted() {
    this.pacientesGet()
  },
  methods: {
    pacienteNew() {
      this.$router.push({ name: 'pacienteNew' })
    },
    pacientesGet() {
      this.loading = true
      this.$axios.get('pacientes',{
        params: {
          search: this.filter,
          page: this.current_page
        }
      }).then(res => {
        this.pacientes = res.data.data
        this.total = res.data.total
        this.per_page = res.data.per_page
        this.current_page = res.data.current_page
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
    pacientePost() {
      this.loading = true
      this.$axios.post('pacientes', this.paciente).then(res => {
        this.pacientesGet()
        this.pacienteDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    pacientePut() {
      this.loading = true
      this.$axios.put('pacientes/' + this.paciente.id, this.paciente).then(res => {
        this.pacientesGet()
        this.pacienteDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    pacienteEditPassword(paciente) {
      this.paciente = { ...paciente }
      this.$alert.dialogPrompt('Nueva contraseña', 'Ingrese la nueva contraseña', 'password')
        .onOk(password => {
          this.$axios.put('updatePassword/' + paciente.id, { password }).then(res => {
            this.pacientesGet()
            this.$alert.success('Contraseña actualizada')
          }).catch(error => {
            this.$alert.error(error.response.data.message)
          })
        })
    },
    pacienteEdit(paciente) {
      this.paciente = { ...paciente }
      this.actionPeriodo = 'Editar'
      this.pacienteDialog = true
    },
    pacienteDelete(id) {
      this.$alert.dialog('¿Desea eliminar el paciente?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('pacientes/' + id).then(res => {
            this.pacientesGet()
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
