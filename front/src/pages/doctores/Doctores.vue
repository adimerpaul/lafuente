<template>
  <q-page class="q-pa-md">

    <!-- Botón superior -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">Lista de Doctores</div>
      <q-btn
        color="primary"
        icon="add_circle"
        label="Nuevo Doctor"
        no-caps
        @click="doctorNew"
        :loading="loading"
      />
    </div>

    <!-- Tabla -->
    <q-markup-table flat bordered wrap-cells dense >
      <thead>
      <tr>
        <th class="text-center">#</th>
        <th class="text-center">Acciones</th>
        <th>Nombre</th>
        <th>Especialidad</th>
        <th>Teléfono</th>
        <th>Email</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(doctor, index) in doctores" :key="doctor.id">
        <td class="text-center">{{ index + 1 }}</td>
        <td class="text-center">
<!--          <q-btn dense flat color="primary" icon="edit" @click="doctorEdit(doctor)" />-->
<!--          <q-btn dense flat color="negative" icon="delete" @click="doctorDelete(doctor.id)" />-->
          <q-btn-dropdown dense color="primary" label="Opciones" no-caps size="10px">
            <q-list>
              <q-item clickable @click="doctorEdit(doctor)" v-close-popup >
                <q-item-section avatar>
                  <q-icon name="edit" />
                </q-item-section>
                <q-item-section>Editar</q-item-section>
              </q-item>
              <q-item clickable @click="doctorDelete(doctor.id)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="delete" />
                </q-item-section>
                <q-item-section>Eliminar</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </td>
        <td>{{ doctor.nombre }}</td>
        <td>{{ doctor.especialidad }}</td>
        <td>{{ doctor.telefono }}</td>
        <td>{{ doctor.email }}</td>
      </tr>
      <tr v-if="!doctores.length">
        <td colspan="6" class="text-center text-grey">No hay doctores registrados</td>
      </tr>
      </tbody>
    </q-markup-table>

    <!-- Diálogo Crear/Editar -->
    <q-dialog v-model="doctorDialog" persistent>
      <q-card style="min-width:400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ actionLabel }} Doctor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="doctor.id ? doctorPut() : doctorPost()">
            <q-input
              v-model="doctor.nombre"
              label="Nombre"
              dense outlined
              :rules="[val => !!val || 'Campo requerido']"
              class="q-mb-sm"
            />
            <q-input
              v-model="doctor.especialidad"
              label="Especialidad"
              dense outlined
              class="q-mb-sm"
            />
            <q-input
              v-model="doctor.telefono"
              label="Teléfono"
              dense outlined
              mask="###############"
              class="q-mb-sm"
            />
            <q-input
              v-model="doctor.email"
              label="Email"
              type="email"
              dense outlined
            />

            <div class="text-right q-mt-md">
              <q-btn flat label="Cancelar" color="negative" v-close-popup :loading="loading"/>
              <q-btn label="Guardar" color="primary" type="submit" class="q-ml-sm" :loading="loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'DoctoresPage',
  data () {
    return {
      doctores: [],
      doctor: {},
      doctorDialog: false,
      actionLabel: 'Nuevo',
      loading: false
    }
  },
  mounted () {
    this.doctoresGet()
  },
  methods: {
    // Obtener lista
    doctoresGet () {
      this.loading = true
      this.$axios.get('doctores')
        .then(res => { this.doctores = res.data })
        .catch(err => this.$q.notify({ type: 'negative', message: err.message }))
        .finally(() => { this.loading = false })
    },

    // Nuevo doctor
    doctorNew () {
      this.doctor = { nombre: '', especialidad: '', telefono: '', email: '' }
      this.actionLabel = 'Nuevo'
      this.doctorDialog = true
    },

    // Editar
    doctorEdit (doctor) {
      this.doctor = { ...doctor }
      this.actionLabel = 'Editar'
      this.doctorDialog = true
    },

    // Crear
    doctorPost () {
      this.loading = true
      this.$axios.post('doctores', this.doctor)
        .then(() => {
          this.$q.notify({ type: 'positive', message: 'Doctor creado con éxito' })
          this.doctoresGet()
          this.doctorDialog = false
        })
        .catch(err => this.$q.notify({ type: 'negative', message: err.message }))
    },

    // Actualizar
    doctorPut () {
      this.loading = true
      this.$axios.put(`doctores/${this.doctor.id}`, this.doctor)
        .then(() => {
          this.$q.notify({ type: 'positive', message: 'Doctor actualizado' })
          this.doctoresGet()
          this.doctorDialog = false
        })
        .catch(err => this.$q.notify({ type: 'negative', message: err.message }))
    },

    // Eliminar
    doctorDelete (id) {
      this.$q.dialog({
        title: 'Confirmar',
        message: '¿Eliminar este doctor?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$axios.delete(`doctores/${id}`)
          .then(() => {
            this.$q.notify({ type: 'positive', message: 'Doctor eliminado' })
            this.doctoresGet()
          })
          .catch(err => this.$q.notify({ type: 'negative', message: err.message }))
      })
    }
  }
}
</script>
