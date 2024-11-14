<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section class="">
        <div class="row">
          <div class="col-12 col-md-6">
            <span class="text-bold">Gestiones Activas:</span>
            <q-chip v-for="periodo in peridosActivos" :key="periodo.id" :label="periodo.periodo" color="positive" dense  size="14px" text-color="white"/>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-table :rows="poas" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
             title="Almacen" :filter="filter">
      <template v-slot:top-right>
        <q-btn color="primary" label="Crear poa" @click="poaNew"  no-caps  icon="add_circle_outline" :loading="loading" />
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
<!--              <q-item clickable @click="poaEdit(props.row)" v-close-popup>-->
<!--                <q-item-section avatar>-->
<!--                  <q-icon name="edit" />-->
<!--                </q-item-section>-->
<!--                <q-item-section>-->
<!--                  <q-item-label>Editar</q-item-label>-->
<!--                </q-item-section>-->
<!--              </q-item>-->
<!--              btn administrar-->
              <q-item clickable @click="poaVisible(props.row)" v-close-popup>
                <q-item-section avatar>
                  <q-icon name="visibility" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Administrar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable @click="poaDelete(props.row.id)" v-close-popup>
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
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-chip :label="props.row.estado"
                  :color="props.row.estado === 'Abierto' ? 'positive' : 'red'"
                  text-color="white" dense  size="14px"/>
        </q-td>
      </template>
    </q-table>
<!--    <pre>{{ poas }}</pre>-->
    <q-dialog v-model="poaDialog" persistent>
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} poa
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="poaDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="poa.id ? poaPut() : poaPost()">
            <q-select v-model="poa.periodo_id" label="Periodo" outlined dense :options="peridosActivos" :rules="[val => !!val || 'Seleccione un periodo']"
                      emit-value map-options :option-label="opt => opt.periodo" :option-value="opt => opt.id" />
            <div class="text-right" >
              <q-btn color="negative" label="Cancelar" @click="poaDialog = false" no-caps :loading="loading" />
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
  name: 'AlmacenPage',
  data() {
    return {
      poas: [],
      poa: {},
      poaDialog: false,
      loading: false,
      actionPeriodo: '',
      peridosActivos: [],
      filter: '',
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        { name: 'fecha', label: 'Fecha', align: 'center', field: row => moment(row.fecha).format('DD/MM/YYYY') },
        { name: 'estado', label: 'Estado', align: 'center', field: row => row.estado },
        { name: 'periodo', label: 'Periodo', align: 'center', field: row => row.periodo.periodo },
        { name: 'area', label: 'Area', align: 'center', field: row => row.area?.nombre },
        { name: 'user', label: 'Usuario', align: 'center', field: row => row.user?.name },
      ],
    }
  },
  mounted() {
    this.poasGet()
    this.periodosActivos()
  },
  methods: {
    periodosActivos() {
      this.$axios.get('periodos/activos').then(res => {
        this.peridosActivos = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
    poaNew() {
      this.poa = {
        periodo_id: '',
      }
      this.actionPeriodo = 'Nuevo'
      this.poaDialog = true
    },
    poasGet() {
      this.loading = true
      this.$axios.get('poas').then(res => {
        this.poas = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    poaPost() {
      this.loading = true
      this.$axios.post('poas', this.poa).then(res => {
        this.poasGet()
        this.poaDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    poaPut() {
      this.loading = true
      this.$axios.put('poas/' + this.poa.id, this.poa).then(res => {
        this.poasGet()
        this.poaDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    poaEdit(poa) {
      this.poa = { ...poa }
      this.actionPeriodo = 'Editar'
      this.poaDialog = true
    },
    poaVisible(poa) {
      this.$router.push({ name: 'poaVisible', params: { id: poa.id } })
    },
    poaDelete(id) {
      this.$alert.dialog('¿Desea eliminar el poa?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('poas/' + id).then(res => {
            this.poasGet()
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
