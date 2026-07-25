<template>
  <q-page class="q-pa-sm bg-grey-2">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-blue-grey-9 text-white q-py-sm">
        <q-icon name="domain" size="sm" class="q-mr-sm" />
        <div>
          <div class="text-h6">Activos fijos</div>
          <div class="text-caption text-blue-grey-2">Control patrimonial y depreciación</div>
        </div>
        <q-space />
        <q-btn
          flat dense no-caps icon="playlist_add_check"
          :label="`Asignar seleccionados (${selectedAssets.length})`"
          :disable="!selectedAssets.length"
          @click="openBulkAssignment"
        />
        <q-btn flat dense no-caps icon="groups" label="Por funcionario" @click="openStaffList" />
        <q-btn flat dense no-caps icon="add" label="Nuevo activo" @click="openNew" />
        <q-btn flat round dense icon="refresh" @click="loadAssets" :loading="loading" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-input
          v-model="search"
          dense
          outlined
          clearable
          debounce="350"
          label="Buscar por nombre, código o descripción"
          class="q-mb-sm"
          @update:model-value="searchAssets"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>

        <q-table
          flat
          bordered
          dense
          row-key="id"
          :rows="assets"
          :columns="columns"
          :loading="loading"
          selection="multiple"
          v-model:selected="selectedAssets"
          v-model:pagination="pagination"
          :rows-per-page-options="[20, 40, 60]"
          @request="onRequest"
        >
          <template #body-cell-acciones="props">
            <q-td :props="props">
              <q-btn-dropdown dense no-caps color="primary" label="Opciones" size="sm">
                <q-list dense style="min-width: 190px">
                  <q-item clickable v-close-popup @click="openAssignments(props.row)">
                    <q-item-section avatar><q-icon name="assignment_ind" color="teal" /></q-item-section>
                    <q-item-section>{{ props.row.asignacion_actual ? 'Responsable y asignación' : 'Asignar a funcionario' }}</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openAssetDetail(props.row)">
                    <q-item-section avatar><q-icon name="history" color="indigo" /></q-item-section>
                    <q-item-section>Ver historial del activo</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openEdit(props.row)">
                    <q-item-section avatar><q-icon name="edit" color="primary" /></q-item-section>
                    <q-item-section>Editar activo</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="removeAsset(props.row)">
                    <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                    <q-item-section class="text-negative">Eliminar activo</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </template>

          <template #body-cell-foto="props">
            <q-td :props="props">
              <q-img
                :src="props.row.foto ? photoUrl(props.row.foto) : '/activo-fijo-default.svg'"
                width="52px"
                height="42px"
                fit="cover"
                class="rounded-borders cursor-pointer"
                @click="props.row.foto && showPhoto(props.row)"
              />
            </q-td>
          </template>

          <template #body-cell-nombre="props">
            <q-td :props="props">
              <div class="text-weight-medium text-primary cursor-pointer" @click="openAssetDetail(props.row)">
                {{ props.row.nombre }}
              </div>
              <div class="text-caption text-grey-7">{{ props.row.codigo || 'Sin código' }}</div>
            </q-td>
          </template>

          <template #body-cell-valor="props">
            <q-td :props="props" class="text-weight-medium">
              {{ money(props.row.valor) }} Bs
            </q-td>
          </template>

          <template #body-cell-depreciacion_mensual="props">
            <q-td :props="props">{{ money(props.row.depreciacion_mensual) }} Bs</q-td>
          </template>

          <template #body-cell-depreciacion_acumulada="props">
            <q-td :props="props">
              <div>{{ money(props.row.depreciacion_acumulada) }} Bs</div>
              <div class="text-caption text-grey-7">{{ props.row.meses_depreciados }} meses</div>
            </q-td>
          </template>

          <template #body-cell-valor_actual="props">
            <q-td :props="props" class="text-weight-bold text-primary">
              {{ money(props.row.valor_actual) }} Bs
            </q-td>
          </template>

          <template #body-cell-estado="props">
            <q-td :props="props">
              <q-chip dense :color="stateColor(props.row.estado)" text-color="white">
                {{ props.row.estado }}
              </q-chip>
            </q-td>
          </template>

          <template #body-cell-responsable="props">
            <q-td :props="props">
              <q-chip
                v-if="props.row.asignacion_actual?.funcionario"
                clickable
                dense
                color="teal-1"
                text-color="teal-9"
                icon="person"
                @click="showStaff(props.row.asignacion_actual.funcionario.id)"
              >
                {{ props.row.asignacion_actual.funcionario.name }}
              </q-chip>
              <q-badge v-else color="grey-5" label="Sin asignar" />
            </q-td>
          </template>

          <template #no-data>
            <div class="full-width text-center text-grey-6 q-py-xl">
              <q-icon name="domain_disabled" size="42px" />
              <div>No hay activos fijos registrados</div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog" persistent>
      <q-card style="width: 92vw; max-width: 900px">
        <q-card-section class="row items-center bg-blue-grey-9 text-white q-py-sm">
          <q-icon name="domain" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">
            {{ form.id ? 'Editar activo fijo' : 'Nuevo activo fijo' }}
          </div>
          <q-space />
          <q-btn flat round dense icon="close" @click="dialog = false" :disable="saving" />
        </q-card-section>

        <q-card-section>
          <q-form ref="assetForm" @submit="saveAsset">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-8">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-sm-4">
                    <q-input v-model="form.codigo" dense outlined label="Código patrimonial" />
                  </div>
                  <div class="col-12 col-sm-8">
                    <q-input
                      v-model="form.nombre"
                      dense
                      outlined
                      label="Nombre del activo *"
                      :rules="[required]"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model.number="form.valor"
                      dense
                      outlined
                      type="number"
                      min="0"
                      step="0.01"
                      label="Valor de compra *"
                      suffix="Bs"
                      :rules="[nonNegative]"
                      @update:model-value="calculateDepreciation"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="form.estado"
                      dense
                      outlined
                      label="Estado *"
                      :options="stateOptions"
                      :rules="[required]"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model="form.fecha_compra"
                      dense
                      outlined
                      type="date"
                      label="Fecha de compra *"
                      :rules="[required]"
                      @update:model-value="calculateDepreciation"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model="form.fecha_fin"
                      dense
                      outlined
                      type="date"
                      label="Fin de vida útil *"
                      :rules="[required, validEndDate]"
                      @update:model-value="calculateDepreciation"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="form.depreciacion_mensual"
                      dense
                      outlined
                      type="number"
                      min="0"
                      step="0.01"
                      label="Depreciación mensual *"
                      suffix="Bs"
                      :rules="[nonNegative]"
                    />
                  </div>
                  <div class="col-12">
                    <q-input
                      v-model="form.descripcion"
                      dense
                      outlined
                      autogrow
                      label="Descripción u observaciones"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-4">
                <q-card flat bordered class="q-pa-sm">
                  <div class="text-subtitle2 q-mb-sm">Fotografía del activo</div>
                  <q-img
                    v-if="photoPreview"
                    :src="photoPreview"
                    height="175px"
                    fit="contain"
                    class="bg-grey-2 rounded-borders q-mb-sm"
                  />
                  <div v-else class="photo-placeholder q-mb-sm">
                    <q-icon name="add_a_photo" size="44px" />
                    <span>Sin fotografía</span>
                  </div>
                  <q-file
                    v-model="photoFile"
                    dense
                    outlined
                    clearable
                    accept=".jpg,.jpeg,.png,.webp,image/*"
                    label="Seleccionar fotografía"
                    max-file-size="4194304"
                    @rejected="photoRejected"
                  >
                    <template #prepend><q-icon name="photo_camera" /></template>
                  </q-file>
                  <div class="text-caption text-grey-7 q-mt-xs">Máximo 4 MB.</div>
                </q-card>
              </div>
            </div>

            <q-banner v-if="estimatedMonths > 0" dense class="bg-blue-1 text-blue-10 q-mt-sm rounded-borders">
              Vida útil estimada: <b>{{ estimatedMonths }} meses</b>.
              Depreciación mensual sugerida: <b>{{ money(suggestedDepreciation) }} Bs</b>.
            </q-banner>

            <div class="text-right q-mt-md">
              <q-btn flat no-caps label="Cancelar" @click="dialog = false" :disable="saving" />
              <q-btn
                type="submit"
                color="blue-grey-9"
                no-caps
                icon="save"
                label="Guardar"
                class="q-ml-sm"
                :loading="saving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="assignmentDialog" persistent>
      <q-card style="width: 94vw; max-width: 900px">
        <q-card-section class="row items-center bg-teal-9 text-white q-py-sm">
          <q-icon name="assignment_ind" class="q-mr-sm" />
          <div>
            <div class="text-subtitle1 text-weight-bold">Responsable del activo</div>
            <div class="text-caption">{{ assignmentAsset?.nombre }}</div>
          </div>
          <q-space />
          <q-btn flat round dense icon="close" @click="assignmentDialog = false" />
        </q-card-section>

        <q-card-section v-if="currentAssignment" class="q-pa-sm">
          <q-banner class="bg-teal-1 text-teal-10 rounded-borders">
            <template #avatar><q-icon name="person" color="teal-8" /></template>
            <div class="text-weight-bold">{{ currentAssignment.funcionario?.name }}</div>
            <div class="text-caption">
              {{ currentAssignment.funcionario?.role }} · Desde {{ formatDateTime(currentAssignment.fecha_asignacion) }}
            </div>
            <div v-if="currentAssignment.observacion" class="q-mt-xs">{{ currentAssignment.observacion }}</div>
          </q-banner>

          <q-expansion-item dense icon="assignment_return" label="Registrar devolución" class="q-mt-sm">
            <q-card flat bordered class="q-pa-sm">
              <q-input v-model="returnForm.fecha_devolucion" dense outlined type="datetime-local"
                       label="Fecha y hora de devolución *" class="q-mb-sm" />
              <q-input v-model="returnForm.observacion_devolucion" dense outlined autogrow
                       label="Estado u observación de devolución" />
              <div class="text-right q-mt-sm">
                <q-btn color="orange-9" no-caps icon="assignment_return" label="Confirmar devolución"
                       :loading="assignmentSaving" @click="returnAsset" />
              </div>
            </q-card>
          </q-expansion-item>
        </q-card-section>

        <q-card-section v-else class="q-pa-sm">
          <div class="text-subtitle2 q-mb-sm">Asignar a un funcionario</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-md-6">
              <q-select
                v-model="assignmentForm.user_id"
                :options="filteredStaffOptions"
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filterStaff"
                emit-value
                map-options
                label="Funcionario *"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="assignmentForm.fecha_asignacion" dense outlined type="datetime-local"
                       label="Fecha y hora de entrega *" />
            </div>
            <div class="col-12">
              <q-input v-model="assignmentForm.observacion" dense outlined autogrow
                       label="Observación o estado de entrega" />
            </div>
          </div>
          <div class="text-right q-mt-sm">
            <q-btn color="teal-9" no-caps icon="person_add" label="Asignar activo"
                   :loading="assignmentSaving" @click="assignAsset" />
          </div>
        </q-card-section>

        <q-separator />
        <q-card-section class="q-pa-sm">
          <div class="text-subtitle2 q-mb-xs">Historial de responsables</div>
          <q-markup-table flat bordered dense wrap-cells>
            <thead>
            <tr class="bg-blue-grey-8 text-white">
              <th>Funcionario</th>
              <th>Entrega</th>
              <th>Devolución</th>
              <th>Estado</th>
              <th>Observaciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in assignmentHistory" :key="item.id">
              <td>
                <a href="#" class="text-primary text-weight-medium" @click.prevent="showStaff(item.funcionario?.id)">
                  {{ item.funcionario?.name || 'Usuario no disponible' }}
                </a>
              </td>
              <td>{{ formatDateTime(item.fecha_asignacion) }}</td>
              <td>{{ item.fecha_devolucion ? formatDateTime(item.fecha_devolucion) : '-' }}</td>
              <td><q-badge :color="item.estado === 'Asignado' ? 'positive' : 'blue-grey'" :label="item.estado" /></td>
              <td>{{ item.observacion || '-' }}</td>
            </tr>
            <tr v-if="!assignmentHistory.length">
              <td colspan="5" class="text-center text-grey-6 q-pa-md">Sin asignaciones anteriores</td>
            </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="bulkDialog" persistent>
      <q-card style="width: 92vw; max-width: 650px">
        <q-card-section class="row items-center bg-indigo-9 text-white q-py-sm">
          <q-icon name="playlist_add_check" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">Asignar varios activos</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup :disable="assignmentSaving" />
        </q-card-section>
        <q-card-section>
          <q-banner dense class="bg-indigo-1 text-indigo-10 rounded-borders q-mb-sm">
            Se asignarán <b>{{ selectedAssets.length }} activos</b> al funcionario seleccionado.
          </q-banner>
          <q-select
            v-model="bulkForm.user_id"
            :options="filteredStaffOptions"
            dense outlined emit-value map-options use-input input-debounce="0"
            @filter="filterStaff"
            label="Funcionario responsable *"
            class="q-mb-sm"
          />
          <q-input
            v-model="bulkForm.fecha_asignacion"
            dense outlined type="datetime-local"
            label="Fecha y hora *"
            class="q-mb-sm"
          />
          <q-input v-model="bulkForm.observacion" dense outlined autogrow label="Observación de entrega" />
          <q-banner dense class="bg-orange-1 text-orange-10 rounded-borders q-mt-sm">
            Si un activo ya tiene responsable, se registrará su transferencia y se conservará el historial anterior.
          </q-banner>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancelar" v-close-popup :disable="assignmentSaving" />
          <q-btn color="indigo-9" no-caps icon="assignment_ind" label="Confirmar asignación"
                 :loading="assignmentSaving" @click="assignSelectedAssets" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="staffDialog">
      <q-card style="width: 94vw; max-width: 850px">
        <q-card-section class="row items-center bg-indigo-9 text-white q-py-sm">
          <q-icon name="groups" class="q-mr-sm" />
          <div class="text-subtitle1 text-weight-bold">
            {{ selectedStaff ? 'Activos a cargo' : 'Activos por funcionario' }}
          </div>
          <q-space />
          <q-btn v-if="selectedStaff" flat dense no-caps icon="arrow_back" label="Todos" @click="selectedStaff = null" />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section v-if="!selectedStaff" class="q-pa-sm">
          <q-list bordered separator>
            <q-item v-for="person in staff" :key="person.id" clickable @click="selectedStaff = person">
              <q-item-section avatar><q-avatar color="indigo-1" text-color="indigo-9" icon="person" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ person.name }}</q-item-label>
                <q-item-label caption>{{ person.role }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip dense color="indigo-1" text-color="indigo-9">
                  {{ person.activos_asignados_count }} activos
                </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-section v-else class="q-pa-sm">
          <div class="row items-center q-mb-sm">
            <q-avatar color="indigo-9" text-color="white" icon="person" class="q-mr-sm" />
            <div>
              <div class="text-h6">{{ selectedStaff.name }}</div>
              <div class="text-caption text-grey-7">{{ selectedStaff.role }}</div>
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div
              v-for="item in selectedStaff.asignaciones_activos"
              :key="item.id"
              class="col-12 col-sm-6"
            >
              <q-card flat bordered>
                <q-card-section class="row items-center q-pa-sm">
                  <q-img
                    :src="item.activo_fijo?.foto ? photoUrl(item.activo_fijo.foto) : '/activo-fijo-default.svg'"
                    width="64px"
                    height="52px"
                    fit="cover"
                    class="rounded-borders q-mr-sm"
                  />
                  <div class="col">
                    <div class="text-weight-bold">{{ item.activo_fijo?.nombre }}</div>
                    <div class="text-caption text-grey-7">{{ item.activo_fijo?.codigo || 'Sin código' }}</div>
                    <div class="text-caption">Desde {{ formatDateTime(item.fecha_asignacion) }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div v-if="!selectedStaff.asignaciones_activos?.length" class="col-12 text-center text-grey-6 q-pa-xl">
              Este funcionario no tiene activos bajo su cargo.
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="photoDialog">
      <q-card style="width: 90vw; max-width: 800px">
        <q-card-section class="row items-center q-py-sm">
          <div class="text-subtitle1 text-weight-bold">{{ photoAsset?.nombre }}</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>
        <q-img v-if="photoAsset?.foto" :src="photoUrl(photoAsset.foto)" fit="contain" style="max-height: 75vh" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'ActivosFijos',

  data () {
    return {
      loading: false,
      saving: false,
      dialog: false,
      photoDialog: false,
      photoAsset: null,
      assignmentDialog: false,
      assignmentSaving: false,
      assignmentAsset: null,
      assignmentHistory: [],
      selectedAssets: [],
      bulkDialog: false,
      bulkForm: {
        user_id: null,
        fecha_asignacion: '',
        observacion: ''
      },
      assignmentForm: { user_id: null, fecha_asignacion: '', observacion: '' },
      returnForm: { fecha_devolucion: '', observacion_devolucion: '' },
      staffDialog: false,
      staffLoading: false,
      staff: [],
      filteredStaffOptions: [],
      selectedStaff: null,
      search: '',
      assets: [],
      photoFile: null,
      form: this.emptyForm(),
      pagination: {
        page: 1,
        rowsPerPage: 20,
        rowsNumber: 0,
        sortBy: null,
        descending: false
      },
      stateOptions: ['Activo', 'En mantenimiento', 'Dado de baja'],
      columns: [
        { name: 'acciones', label: 'Acciones', align: 'left' },
        { name: 'foto', label: 'Foto', field: 'foto', align: 'left' },
        { name: 'nombre', label: 'Activo / código', field: 'nombre', align: 'left' },
        { name: 'responsable', label: 'Responsable', field: 'asignacion_actual', align: 'left' },
        { name: 'valor', label: 'Valor compra', field: 'valor', align: 'right' },
        { name: 'fecha_compra', label: 'Compra', field: 'fecha_compra', align: 'center' },
        { name: 'fecha_fin', label: 'Fin vida útil', field: 'fecha_fin', align: 'center' },
        { name: 'depreciacion_mensual', label: 'Deprec. mensual', field: 'depreciacion_mensual', align: 'right' },
        { name: 'depreciacion_acumulada', label: 'Deprec. acumulada', field: 'depreciacion_acumulada', align: 'right' },
        { name: 'valor_actual', label: 'Valor actual', field: 'valor_actual', align: 'right' },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'center' }
      ]
    }
  },

  computed: {
    estimatedMonths () {
      if (!this.form.fecha_compra || !this.form.fecha_fin) return 0
      const start = new Date(`${this.form.fecha_compra}T00:00:00`)
      const end = new Date(`${this.form.fecha_fin}T00:00:00`)
      if (end <= start) return 0
      return Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth())
    },
    suggestedDepreciation () {
      if (!this.estimatedMonths) return 0
      return Number(this.form.valor || 0) / this.estimatedMonths
    },
    photoPreview () {
      if (this.photoFile) return URL.createObjectURL(this.photoFile)
      if (this.form.foto) return this.photoUrl(this.form.foto)
      return '/activo-fijo-default.svg'
    },
    currentAssignment () {
      return this.assignmentHistory.find(item => item.estado === 'Asignado') || null
    },
    staffOptions () {
      return this.staff.map(person => ({
        label: `${person.name}${person.role ? ` · ${person.role}` : ''}`,
        value: person.id
      }))
    }
  },

  mounted () {
    this.loadAssets()
  },

  methods: {
    emptyForm () {
      return {
        id: null,
        codigo: '',
        nombre: '',
        descripcion: '',
        valor: null,
        fecha_compra: '',
        fecha_fin: '',
        depreciacion_mensual: null,
        estado: 'Activo',
        foto: null
      }
    },
    required (value) {
      return (value !== null && value !== undefined && String(value).trim() !== '') || 'Campo requerido'
    },
    nonNegative (value) {
      return (value !== null && value !== '' && Number(value) >= 0) || 'Ingrese un valor válido'
    },
    validEndDate (value) {
      return (!this.form.fecha_compra || !value || value > this.form.fecha_compra) || 'Debe ser posterior a la compra'
    },
    money (value) {
      return Number(value || 0).toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },
    stateColor (state) {
      if (state === 'Activo') return 'positive'
      if (state === 'En mantenimiento') return 'orange'
      return 'blue-grey'
    },
    photoUrl (fileName) {
      return `${this.$url}../images/activos-fijos/${fileName}`
    },
    nowLocalDateTime () {
      const now = new Date()
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
      return now.toISOString().slice(0, 16)
    },
    formatDateTime (value) {
      if (!value) return '-'
      const parsed = new Date(String(value).replace(' ', 'T'))
      return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString('es-BO')
    },
    calculateDepreciation () {
      this.$nextTick(() => {
        if (this.estimatedMonths > 0 && Number(this.form.valor) >= 0) {
          this.form.depreciacion_mensual = Number(this.suggestedDepreciation.toFixed(2))
        }
      })
    },
    searchAssets () {
      this.pagination.page = 1
      this.loadAssets()
    },
    onRequest ({ pagination }) {
      this.pagination = pagination
      this.loadAssets()
    },
    async loadAssets () {
      this.loading = true
      try {
        const { data } = await this.$axios.get('activos-fijos', {
          params: {
            search: this.search,
            page: this.pagination.page,
            per_page: this.pagination.rowsPerPage
          }
        })
        this.assets = data.data || []
        this.pagination.page = data.current_page
        this.pagination.rowsPerPage = data.per_page
        this.pagination.rowsNumber = data.total
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudieron cargar los activos fijos')
      } finally {
        this.loading = false
      }
    },
    async loadStaff () {
      this.staffLoading = true
      try {
        const { data } = await this.$axios.get('activos-fijos/funcionarios')
        this.staff = data
        this.filteredStaffOptions = this.staffOptions
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudieron cargar los funcionarios')
      } finally {
        this.staffLoading = false
      }
    },
    async loadAssignmentHistory (assetId) {
      const { data } = await this.$axios.get(`activos-fijos/${assetId}/asignaciones`)
      this.assignmentHistory = data
    },
    async openAssignments (asset) {
      this.assignmentAsset = asset
      this.assignmentHistory = []
      this.assignmentForm = {
        user_id: null,
        fecha_asignacion: this.nowLocalDateTime(),
        observacion: ''
      }
      this.returnForm = {
        fecha_devolucion: this.nowLocalDateTime(),
        observacion_devolucion: ''
      }
      this.assignmentDialog = true
      try {
        await Promise.all([this.loadStaff(), this.loadAssignmentHistory(asset.id)])
      } catch (error) {
        this.$alert.error(error.response?.data?.message || 'No se pudo cargar el historial del activo')
      }
    },
    async assignAsset () {
      if (!this.assignmentForm.user_id || !this.assignmentForm.fecha_asignacion) {
        this.$alert.error('Seleccione un funcionario y la fecha de entrega')
        return
      }
      this.assignmentSaving = true
      try {
        await this.$axios.post(`activos-fijos/${this.assignmentAsset.id}/asignaciones`, this.assignmentForm)
        this.$q.notify({ type: 'positive', message: 'Activo asignado correctamente' })
        await Promise.all([
          this.loadAssignmentHistory(this.assignmentAsset.id),
          this.loadAssets(),
          this.loadStaff()
        ])
      } catch (error) {
        const validation = error.response?.data?.errors
        const firstError = validation ? Object.values(validation).flat()[0] : null
        this.$alert.error(firstError || error.response?.data?.message || 'No se pudo asignar el activo')
      } finally {
        this.assignmentSaving = false
      }
    },
    async returnAsset () {
      if (!this.currentAssignment || !this.returnForm.fecha_devolucion) {
        this.$alert.error('Ingrese la fecha de devolución')
        return
      }
      this.assignmentSaving = true
      try {
        await this.$axios.put(
          `activos-fijos/asignaciones/${this.currentAssignment.id}/devolver`,
          this.returnForm
        )
        this.$q.notify({ type: 'positive', message: 'Devolución registrada correctamente' })
        await Promise.all([
          this.loadAssignmentHistory(this.assignmentAsset.id),
          this.loadAssets(),
          this.loadStaff()
        ])
      } catch (error) {
        const validation = error.response?.data?.errors
        const firstError = validation ? Object.values(validation).flat()[0] : null
        this.$alert.error(firstError || error.response?.data?.message || 'No se pudo registrar la devolución')
      } finally {
        this.assignmentSaving = false
      }
    },
    async openStaffList () {
      this.selectedStaff = null
      this.staffDialog = true
      await this.loadStaff()
    },
    async openBulkAssignment () {
      if (!this.selectedAssets.length) return
      this.bulkForm = {
        user_id: null,
        fecha_asignacion: this.nowLocalDateTime(),
        observacion: ''
      }
      await this.loadStaff()
      this.filteredStaffOptions = this.staffOptions
      this.bulkDialog = true
    },
    assignSelectedAssets () {
      if (!this.bulkForm.user_id || !this.bulkForm.fecha_asignacion) {
        this.$alert.error('Seleccione el funcionario y la fecha de asignación')
        return
      }
      const target = this.staff.find(person => person.id === this.bulkForm.user_id)
      const sources = [...new Set(
        this.selectedAssets
          .map(asset => asset.asignacion_actual?.funcionario?.name)
          .filter(Boolean)
      )]
      const sourceText = sources.length
        ? ` desde ${sources.join(', ')}`
        : ''
      this.$q.dialog({
        title: 'Confirmar asignación',
        message: `Se pasarán ${this.selectedAssets.length} activo(s)${sourceText} a ${target?.name || 'el funcionario seleccionado'}. Los movimientos quedarán guardados en el historial. ¿Desea continuar?`,
        persistent: true,
        ok: { label: 'Sí, asignar', color: 'indigo-9', noCaps: true },
        cancel: { label: 'Cancelar', flat: true, noCaps: true }
      }).onOk(() => this.performAssignSelectedAssets())
    },
    async performAssignSelectedAssets () {
      this.assignmentSaving = true
      try {
        const payload = {
          ...this.bulkForm,
          activo_ids: this.selectedAssets.map(asset => asset.id)
        }
        const { data } = await this.$axios.post('activos-fijos/asignaciones-multiples', payload)
        this.$q.notify({ type: 'positive', message: data.message })
        this.bulkDialog = false
        this.selectedAssets = []
        await this.loadAssets()
      } catch (error) {
        const validation = error.response?.data?.errors
        const firstError = validation ? Object.values(validation).flat()[0] : null
        this.$alert.error(firstError || error.response?.data?.message || 'No se pudieron asignar los activos')
      } finally {
        this.assignmentSaving = false
      }
    },
    async showStaff (userId) {
      if (!userId) return
      await this.loadStaff()
      this.selectedStaff = this.staff.find(person => person.id === Number(userId)) || null
      this.staffDialog = true
    },
    filterStaff (value, update) {
      update(() => {
        const term = value.trim().toLowerCase()
        this.filteredStaffOptions = !term
          ? this.staffOptions
          : this.staffOptions.filter(option => option.label.toLowerCase().includes(term))
      })
    },
    openNew () {
      this.form = this.emptyForm()
      this.photoFile = null
      this.dialog = true
    },
    openEdit (asset) {
      this.form = {
        id: asset.id,
        codigo: asset.codigo || '',
        nombre: asset.nombre,
        descripcion: asset.descripcion || '',
        valor: Number(asset.valor),
        fecha_compra: asset.fecha_compra,
        fecha_fin: asset.fecha_fin,
        depreciacion_mensual: Number(asset.depreciacion_mensual),
        estado: asset.estado,
        foto: asset.foto
      }
      this.photoFile = null
      this.dialog = true
    },
    async saveAsset () {
      this.saving = true
      try {
        const payload = new FormData()
        const fields = ['codigo', 'nombre', 'descripcion', 'valor', 'fecha_compra', 'fecha_fin', 'depreciacion_mensual', 'estado']
        fields.forEach(field => payload.append(field, this.form[field] ?? ''))
        if (this.photoFile) payload.append('foto', this.photoFile)

        const endpoint = this.form.id
          ? `activos-fijos/${this.form.id}/actualizar`
          : 'activos-fijos'
        await this.$axios.post(endpoint, payload)

        this.dialog = false
        this.$q.notify({ type: 'positive', message: 'Activo fijo guardado correctamente' })
        await this.loadAssets()
      } catch (error) {
        const validation = error.response?.data?.errors
        const firstError = validation ? Object.values(validation).flat()[0] : null
        this.$alert.error(firstError || error.response?.data?.message || 'No se pudo guardar el activo fijo')
      } finally {
        this.saving = false
      }
    },
    removeAsset (asset) {
      this.$q.dialog({
        title: 'Eliminar activo fijo',
        message: `¿Desea eliminar "${asset.nombre}"? El registro dejará de aparecer en el inventario.`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.$axios.delete(`activos-fijos/${asset.id}`)
          this.$q.notify({ type: 'positive', message: 'Activo fijo eliminado' })
          await this.loadAssets()
        } catch (error) {
          this.$alert.error(error.response?.data?.message || 'No se pudo eliminar el activo fijo')
        }
      })
    },
    showPhoto (asset) {
      this.photoAsset = asset
      this.photoDialog = true
    },
    openAssetDetail (asset) {
      this.$router.push(`/activos-fijos/detalle/${asset.id}`)
    },
    photoRejected () {
      this.$q.notify({ type: 'negative', message: 'La fotografía debe ser una imagen de máximo 4 MB' })
    }
  }
}
</script>

<style scoped>
.photo-placeholder {
  display: flex;
  height: 175px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #b0bec5;
  border-radius: 6px;
  background: #eceff1;
  color: #78909c;
}
</style>
