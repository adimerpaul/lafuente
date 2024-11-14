<template>
  <q-page class="q-pa-md">
    <q-table :rows="periodos" :columns="columns" dense wrap-cells flat bordered :rows-per-page-options="[0]"
             title="Gestiones">
      <template v-slot:top-right>
        <q-toolbar>
          <q-space />
          <q-btn color="primary" label="Nuevo" @click="newPeriodo" outline no-caps size="10px" icon="add_circle_outline" :loading="loading" />
        </q-toolbar>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn-group flat>
            <q-btn color="primary" icon="edit" @click="periodoEdit(props.row)" dense size="10px" />
            <q-btn color="negative" icon="delete" @click="periodoDelete(props.row.id)" dense size="10px" />
          </q-btn-group>
        </q-td>
      </template>
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <q-chip :label="props.row.estado"
                  :color="props.row.estado === 'Vigente' ? 'green' : props.row.estado === 'Próximo' ? 'orange' : 'red'"
                  text-color="white" dense  size="14px"/>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="periodoDialog" persistent>
      <q-card>
        <q-card-section class="q-pb-none row items-center">
          <div>
            {{ actionPeriodo }} periodo
          </div>
          <q-space />
          <q-btn icon="close" flat round dense @click="periodoDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="periodo.id ? periodoPut() : periodoPost()">
<!--            <q-input v-model="periodo.periodo" label="Periodo" outlined dense />-->
            <q-select v-model="periodo.periodo" label="Periodo" outlined dense :options="peridosSelect" />
            <q-input v-model="periodo.fecha_inicio" label="Fecha inicio" type="date" outlined dense />
            <q-input v-model="periodo.fecha_fin" label="Fecha fin" type="date" outlined dense />
            <div>
              <q-btn color="negative" label="Cancelar" @click="periodoDialog = false" no-caps :loading="loading" />
              <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
<!--    <pre>{{ periodos }}</pre>-->
  </q-page>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      periodos: [],
      periodo: {},
      periodoDialog: false,
      loading: false,
      actionPeriodo: '',
      gestiones: [],
      columns: [
        { name: 'actions', label: 'Acciones', align: 'center' },
        // { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
        { name: 'periodo', label: 'Periodo', align: 'left', field: 'periodo', sortable: true },
        { name: 'estado', label: 'Estado', align: 'left', field: 'estado', sortable: true },
        { name: 'fecha_inicio', label: 'Fecha inicio', align: 'left', field: 'fecha_inicio', sortable: true },
        { name: 'fecha_fin', label: 'Fecha fin', align: 'left', field: 'fecha_fin', sortable: true },
      ],
      peridosSelect: []
    }
  },
  mounted() {
    this.periodosGet()
    let year = moment().year()
    for (let i = year - 5; i <= year + 5; i++) {
      this.peridosSelect.push(i)
    }
  },
  methods: {
    newPeriodo() {
      this.periodo = {
        periodo: moment().year(),
        fecha_inicio: moment().format('YYYY-MM-DD'),
        fecha_fin: moment().format('YYYY-MM-DD')
      }
      this.actionPeriodo = 'Nuevo'
      this.periodoDialog = true
    },
    periodosGet() {
      this.loading = true
      this.$axios.get('periodos').then(res => {
        this.periodos = res.data
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
    periodoPost() {
      this.loading = true
      this.$axios.post('periodos', this.periodo).then(res => {
        this.periodosGet()
        this.periodoDialog = false
        this.$alert.success('Periodo creado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    periodoPut() {
      this.loading = true
      this.$axios.put('periodos/' + this.periodo.id, this.periodo).then(res => {
        this.periodosGet()
        this.periodoDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    periodoEdit(periodo) {
      this.periodo = { ...periodo }
      this.actionPeriodo = 'Editar'
      this.periodoDialog = true
    },
    periodoDelete(id) {
      this.$alert.dialog('¿Desea eliminar el periodo?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete('periodos/' + id).then(res => {
            this.periodosGet()
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
