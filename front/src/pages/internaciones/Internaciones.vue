<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="row items-center q-col-gutter-sm">
        <div class="col-12 col-md">
          <div class="text-h6">Internaciones</div>
          <div class="text-caption text-grey-7">Seleccione un paciente para abrir su ficha de internación.</div>
        </div>
        <div class="col-12 col-md-5">
          <q-input v-model="search" dense outlined clearable debounce="400"
                   label="Buscar por nombre o identificación" @update:model-value="buscar">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
      </q-card-section>

      <q-table
        flat dense wrap-cells row-key="id"
        :rows="pacientes" :columns="columns" :loading="loading"
        :rows-per-page-options="[10, 20, 50]"
        v-model:pagination="pagination"
        @request="cargarPacientes"
      >
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn color="primary" dense flat no-caps icon="visibility" label="Ver ficha"
                   @click="abrirPaciente(props.row)" />
          </q-td>
        </template>
        <template #body-cell-internacion="props">
          <q-td :props="props">
            <q-chip dense text-color="white"
                    :color="props.row.internacion_activa ? 'deep-orange' : 'grey-7'"
                    :label="props.row.internacion_activa
                      ? `Internado · Cama ${props.row.internacion_activa.cama}`
                      : 'Sin internación activa'" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'InternacionesPage',
  data () {
    return {
      pacientes: [],
      search: '',
      loading: false,
      pagination: { page: 1, rowsPerPage: 10, rowsNumber: 0, sortBy: null, descending: false },
      columns: [
        { name: 'acciones', label: 'Opciones', align: 'left' },
        { name: 'nombre', label: 'Paciente', field: 'nombre_completo', align: 'left' },
        { name: 'identificacion', label: 'Identificación', field: 'identificacion', align: 'left' },
        { name: 'edad', label: 'Edad', field: 'edad', align: 'center' },
        { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' },
        { name: 'internacion', label: 'Estado', field: 'internacion_activa', align: 'left' },
      ],
    }
  },
  mounted () {
    this.cargarPacientes({ pagination: this.pagination })
  },
  methods: {
    buscar () {
      this.pagination.page = 1
      this.cargarPacientes({ pagination: this.pagination })
    },
    cargarPacientes ({ pagination }) {
      this.loading = true
      this.$axios.get('internaciones/pacientes', {
        params: { search: this.search, page: pagination.page, per_page: pagination.rowsPerPage }
      }).then(({ data }) => {
        this.pacientes = data.data
        this.pagination = {
          ...pagination,
          page: data.current_page,
          rowsPerPage: data.per_page,
          rowsNumber: data.total,
        }
      }).catch(error => {
        this.$alert.error(error.response?.data?.message || 'No se pudo cargar la lista de pacientes')
      }).finally(() => {
        this.loading = false
      })
    },
    abrirPaciente (paciente) {
      this.$router.push({ name: 'internacion-paciente', params: { id: paciente.id } })
    },
  }
}
</script>
