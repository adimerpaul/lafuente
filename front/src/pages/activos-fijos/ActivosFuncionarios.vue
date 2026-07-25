<template>
  <q-page class="q-pa-sm bg-grey-2">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-indigo-9 text-white q-py-sm">
        <q-icon name="badge" size="sm" class="q-mr-sm" />
        <div>
          <div class="text-h6">Funcionarios y activos</div>
          <div class="text-caption text-indigo-1">Responsables de los activos fijos</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="refresh" :loading="loading" @click="loadStaff" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-input v-model="search" dense outlined clearable label="Buscar funcionario o activo" class="q-mb-sm">
          <template #prepend><q-icon name="search" /></template>
        </q-input>

        <div class="row q-col-gutter-sm">
          <div v-for="person in filteredStaff" :key="person.id" class="col-12 col-md-6 col-lg-4">
            <q-card flat bordered class="full-height cursor-pointer" @click="openPerson(person)">
              <q-card-section class="row items-center q-pa-sm bg-indigo-1">
                <q-avatar color="indigo-9" text-color="white" icon="person" class="q-mr-sm" />
                <div class="col">
                  <div class="text-weight-bold">{{ person.name }}</div>
                  <div class="text-caption text-grey-7">{{ person.role || 'Funcionario' }}</div>
                </div>
                <q-badge color="indigo-8" :label="`${person.activos_asignados_count} activos`" />
              </q-card-section>

              <q-list separator>
                <q-item v-for="item in person.asignaciones_activos" :key="item.id" clickable @click.stop="openAsset(item.activo_fijo)">
                  <q-item-section avatar>
                    <q-img
                      :src="item.activo_fijo?.foto ? photoUrl(item.activo_fijo.foto) : '/activo-fijo-default.svg'"
                      width="52px"
                      height="44px"
                      fit="cover"
                      class="rounded-borders"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ item.activo_fijo?.nombre }}</q-item-label>
                    <q-item-label caption>
                      {{ item.activo_fijo?.codigo || 'Sin código' }} · Asignado {{ formatDate(item.fecha_asignacion) }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="positive" label="Asignado" />
                  </q-item-section>
                </q-item>
                <q-item v-if="!person.asignaciones_activos?.length">
                  <q-item-section class="text-center text-grey-6 q-py-md">
                    No tiene activos bajo su responsabilidad.
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>

        <div v-if="!loading && !filteredStaff.length" class="text-center text-grey-6 q-pa-xl">
          <q-icon name="person_search" size="42px" />
          <div>No se encontraron funcionarios</div>
        </div>
      </q-card-section>
      <q-inner-loading :showing="loading" />
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'ActivosFuncionarios',

  data () {
    return {
      loading: false,
      search: '',
      staff: []
    }
  },

  computed: {
    filteredStaff () {
      const term = this.search.trim().toLowerCase()
      if (!term) return this.staff
      return this.staff.filter(person => {
        const assets = (person.asignaciones_activos || [])
          .map(item => `${item.activo_fijo?.nombre || ''} ${item.activo_fijo?.codigo || ''}`)
          .join(' ')
        return `${person.name} ${person.role || ''} ${assets}`.toLowerCase().includes(term)
      })
    }
  },

  mounted () {
    this.loadStaff()
  },

  methods: {
    async loadStaff () {
      this.loading = true
      try {
        const { data } = await this.$axios.get('activos-fijos/funcionarios')
        this.staff = data
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudieron cargar los funcionarios')
      } finally {
        this.loading = false
      }
    },
    photoUrl (fileName) {
      return `${this.$url}../images/activos-fijos/${fileName}`
    },
    formatDate (value) {
      if (!value) return '-'
      const date = new Date(String(value).replace(' ', 'T'))
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('es-BO')
    },
    openPerson (person) {
      this.$router.push(`/activos-fijos/funcionarios/${person.id}`)
    },
    openAsset (asset) {
      if (asset?.id) this.$router.push(`/activos-fijos/detalle/${asset.id}`)
    }
  }
}
</script>
