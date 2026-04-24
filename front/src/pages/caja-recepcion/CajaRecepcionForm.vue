<template>
  <q-page class="q-pa-sm">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-primary text-white">
        <div>
          <div class="text-h6">{{ isEdit ? 'Editar caja de recepcion' : 'Nueva caja de recepcion' }}</div>
          <div class="text-caption">Registro rapido y ordenado para atencion de recepcion</div>
        </div>
        <q-space />
        <q-btn flat round dense icon="arrow_back" color="white" @click="$router.push({ name: 'caja-recepciones' })" />
      </q-card-section>

      <q-card-section class="q-pa-sm">
        <q-form @submit="save">
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Recaudado total</div>
                  <div class="text-h6 text-primary">{{ money(recaudadoTotal) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">QR</div>
                  <div class="text-h6 text-cyan">{{ money(form.qr) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Farmacia</div>
                  <div class="text-h6 text-orange">{{ money(form.costo_farmacia) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Egreso doctor</div>
                  <div class="text-h6 text-negative">{{ money(form.egreso) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Efectivo</div>
                  <div class="text-h6 text-positive">{{ money(form.efectivo) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-2">
              <q-card flat bordered>
                <q-card-section class="q-pa-sm">
                  <div class="text-caption">Saldo final caja</div>
                  <div class="text-h6 text-indigo">{{ money(saldoFinal) }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-12">
              <q-select
                v-model="form.paciente_id"
                use-input
                fill-input
                hide-selected
                dense
                outlined
                emit-value
                map-options
                clearable
                input-debounce="300"
                :options="pacienteOptions"
                label="Paciente"
                :rules="[required]"
                @filter="filterPacientes"
              >
                <template #append>
                  <q-btn flat round dense icon="person_add" @click.stop="patientDialog = true" />
                </template>
              </q-select>
            </div>
          </div>

          <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary" class="text-grey-8">
            <q-tab name="datos" icon="assignment" label="Datos" no-caps />
            <q-tab name="formulario" icon="assignment_turned_in" label="Formulario" no-caps />
            <q-tab name="costos" icon="payments" label="Costos" no-caps />
            <q-tab name="pagos" icon="point_of_sale" label="Pago y cierre" no-caps />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="datos" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-3">
                  <q-input v-model="form.fecha" dense outlined type="date" label="Fecha" :rules="[required]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-input v-model="form.hora" dense outlined type="time" label="Hora" :rules="[required]" />
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="form.tipo_atencion"
                    :options="['Externo', 'Especialidad']"
                    dense
                    outlined
                    clearable
                    label="Tipo de atencion"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-select
                    v-model="form.punto"
                    :options="puntoOptions"
                    dense
                    outlined
                    emit-value
                    map-options
                    label="Punto"
                  />
                </div>
                <div class="col-12 col-md-3">
                  <q-input
                    v-model="form.nombre_factura"
                    dense
                    outlined
                    :disable="Number(form.punto) !== 1"
                    :label="Number(form.punto) === 1 ? 'Numero de factura' : 'Recibo automatico'"
                    :hint="Number(form.punto) === 1 ? '' : 'El backend lo registrara como recibo'"
                  />
                </div>

                <div class="col-12 col-md-3">
                  <q-input v-model="form.numero_ficha" dense outlined label="Numero de ficha" />
                </div>
                <div class="col-12 col-md-3">
                  <q-toggle
                    v-model="pagoAhoraToggle"
                    checked-icon="payments"
                    unchecked-icon="schedule"
                    color="positive"
                    keep-color
                    :label="pagoAhoraToggle ? 'Paga ahora' : 'Paga luego'"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="form.doctor_id"
                    use-input
                    fill-input
                    hide-selected
                    dense
                    outlined
                    emit-value
                    map-options
                    clearable
                    input-debounce="300"
                    :options="doctorOptions"
                    label="Medico"
                    @filter="filterDoctores"
                  >
                    <template #append>
                      <q-btn flat round dense icon="person_add" @click.stop="doctorDialog = true" />
                    </template>
                  </q-select>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="formulario" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-3">
                  <q-card flat bordered class="bg-blue-1">
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption">Total referencial</div>
                      <div class="text-h6 text-primary">{{ money(formularioTotalReferencial) }}</div>
                      <div class="text-caption">Seleccionados: {{ formularioSelectedItems.length }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-9">
                  <q-input
                    v-model="form.formulario_diagnostico"
                    dense
                    outlined
                    clearable
                    type="textarea"
                    autogrow
                    label="Diagnostico"
                  >
                    <template #append>
                      <q-btn flat round dense icon="mic" @click="startFormRecognition('formulario_diagnostico')" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-card flat bordered>
                    <q-card-section class="bg-grey-2 text-weight-bold q-py-sm">
                      Registro compacto y rapido
                    </q-card-section>
                    <q-card-section class="q-pa-xs">
                      <div class="row q-col-gutter-sm">
                        <div v-for="item in controlItems" :key="item.key" class="col-12 col-sm-6 col-lg-4">
                          <div class="control-row">
                            <div class="control-label">
                              <div class="text-caption text-weight-medium">{{ item.label }}</div>
                              <div class="text-grey-7 control-price">
                                {{ money(getFormularioAmount(item.key, form.formulario_detalle[item.key])) }}
                              </div>
                            </div>
                            <div class="control-actions">
                              <q-option-group
                                :model-value="getFormularioSelection(item.key)"
                                :options="item.options"
                                type="checkbox"
                                inline
                                dense
                                color="primary"
                                @update:model-value="setFormularioSelection(item.key, $event)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12">
                  <q-input
                    v-model="form.formulario_observaciones"
                    dense
                    outlined
                    clearable
                    type="textarea"
                    autogrow
                    label="Observaciones del formulario"
                  >
                    <template #append>
                      <q-btn flat round dense icon="mic" @click="startFormRecognition('formulario_observaciones')" />
                    </template>
                  </q-input>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="costos" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div v-for="field in costFields" :key="field.key" class="col-12 col-sm-6 col-md-3 col-xl-2">
                  <q-card flat bordered class="cost-card" :class="field.cardClass">
                    <q-card-section class="q-pa-sm">
                      <q-input
                        :model-value="displayCostValue(field.key)"
                        dense
                        outlined
                        type="number"
                        min="0"
                        step="0.01"
                        :label="field.label"
                        @update:model-value="updateCostValue(field.key, $event)"
                      >
                        <template #prepend>
                          <q-icon :name="field.icon" :color="field.iconColor" />
                        </template>
                      </q-input>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.laboratorio_nombre" dense outlined label="A que laboratorio se lo llevo" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.medico_ecografia" dense outlined label="Quien hizo la ecografia" />
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="pagos" class="q-pa-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="metodoPago"
                    :options="metodoPagoOptions"
                    dense
                    outlined
                    emit-value
                    map-options
                    label="Metodo de pago"
                  />
                </div>
                <div v-if="showQr" class="col-12 col-md-4">
                  <q-input v-model.number="form.qr" dense outlined type="number" min="0" step="0.01" label="Monto QR" />
                </div>
                <div v-if="showEfectivo" class="col-12 col-md-4">
                  <q-input v-model.number="form.efectivo" dense outlined type="number" min="0" step="0.01" label="Monto efectivo" />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    v-model.number="form.egreso"
                    dense
                    outlined
                    type="number"
                    min="0"
                    step="0.01"
                    label="Egreso doctor"
                    hint="Monto descontado o pagado al doctor"
                  />
                </div>
                <div class="col-12">
                  <q-input v-model="form.observaciones" dense outlined type="textarea" autogrow label="Observaciones" />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <q-separator class="q-my-sm" />

          <div class="text-right">
            <q-btn color="negative" label="Cancelar" no-caps @click="$router.push({ name: 'caja-recepciones' })" :loading="saving" />
            <q-btn color="primary" label="Guardar" type="submit" no-caps class="q-ml-sm" :loading="saving" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-dialog v-model="patientDialog" persistent>
      <q-card style="min-width: 420px; max-width: 95vw;">
        <q-card-section class="q-pb-none row items-center">
          <div>Nuevo paciente rapido</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="patientDialog = false" />
        </q-card-section>
        <q-card-section>
          <q-form @submit="saveQuickPatient">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.nombre" clearable dense outlined label="Nombre" :rules="[required]">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('nombre')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.apellido" clearable dense outlined label="Apellido" :rules="[required]">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('apellido')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="quickPatient.identificacion" clearable dense outlined label="Identificacion">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('identificacion')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-4">
                <q-input v-model="quickPatient.edad" clearable dense outlined label="Edad" />
              </div>
              <div class="col-12 col-md-4">
                <q-select v-model="quickPatient.sexo" :options="['M', 'F']" dense outlined label="Sexo" />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="quickPatient.fecha_nacimiento"
                  clearable
                  dense
                  outlined
                  type="date"
                  label="Fecha de nacimiento"
                  @update:model-value="updateQuickPatientAge"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickPatient.telefono" clearable dense outlined label="Telefono">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('telefono')" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-select v-model="quickPatient.tipo_paciente" :options="['Externo', 'Interno', 'Seguro', 'Recepción']" dense outlined label="Tipo paciente" />
              </div>
              <div class="col-12">
                <q-input v-model="quickPatient.direccion" clearable dense outlined label="Direccion">
                  <template #append>
                    <q-btn flat round dense icon="mic" @click="startQuickPatientRecognition('direccion')" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="text-right q-mt-md">
              <q-btn color="negative" label="Cancelar" no-caps @click="patientDialog = false" :loading="savingPatient" />
              <q-btn color="primary" label="Crear paciente" type="submit" no-caps class="q-ml-sm" :loading="savingPatient" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="doctorDialog" persistent>
      <q-card style="min-width: 420px; max-width: 95vw;">
        <q-card-section class="q-pb-none row items-center">
          <div>Nuevo medico rapido</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="doctorDialog = false" />
        </q-card-section>
        <q-card-section>
          <q-form @submit="saveQuickDoctor">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.nombre" clearable dense outlined label="Nombre" :rules="[required]" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.especialidad" clearable dense outlined label="Especialidad" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.telefono" clearable dense outlined label="Telefono" />
              </div>
              <div class="col-12 col-md-6">
                <q-input v-model="quickDoctor.email" clearable dense outlined type="email" label="Email" />
              </div>
            </div>
            <div class="text-right q-mt-md">
              <q-btn color="negative" label="Cancelar" no-caps @click="doctorDialog = false" :loading="savingDoctor" />
              <q-btn color="primary" label="Crear medico" type="submit" no-caps class="q-ml-sm" :loading="savingDoctor" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment'
import {
  controlCatalog,
  controlOptions,
  createEmptyDetail
} from '../formularios-control/controlCatalog'

const controlArancelCodeMap = {
  caja_vaselina: {
    P: ['caja_vaselinada_p', 'caja_vaselina_p'],
    M: ['caja_vaselinada_m', 'caja_vaselina_m'],
    G: ['caja_vaselinada_g', 'caja_vaselina_g']
  },
  caja_curacion: {
    P: 'caja_curacion_p',
    M: 'caja_curacion_m',
    G: 'caja_curacion_g'
  },
  caja_sutura: {
    P: 'caja_sutura_p',
    M: 'caja_sutura_m',
    G: 'caja_sutura_g'
  },
  caja_retiro_uterino: {
    P: ['caja_retiro_uretero_p', 'caja_retiro_uterino_p'],
    M: ['caja_retiro_uretero_m', 'caja_retiro_uterino_m'],
    G: ['caja_retiro_uretero_g', 'caja_retiro_uterino_g']
  },
  caja_retiro_puntos: {
    P: 'caja_retiro_puntos_p',
    M: 'caja_retiro_puntos_m',
    G: 'caja_retiro_puntos_g'
  },
  sutura: {
    P: 'sutura_p',
    M: 'sutura_m',
    G: 'sutura_g'
  },
  uso_tela_adhesiva: {
    P: 'uso_tela_adhesiva',
    M: 'uso_tela_adhesiva',
    G: 'uso_tela_adhesiva'
  },
  uso_micropor: 'uso_micropor',
  nebulizacion: 'nebulizacion',
  glicemia: 'glicemia',
  inyectable: {
    IM: 'inyectable_im',
    EV: 'inyectable_ev',
    SC: 'inyectable_sc'
  },
  guantes_dediles: 'guantes_dediles',
  campo_fenestrado: 'campo_fenestrado',
  colocado_stopper: 'colocado_stopper',
  monitor_desfibrilador: 'monitor_desfibrilador',
  antisepticos: 'antisepticos',
  apositos_extras: 'apositos_extras',
  torundas_gasa_extras: 'torundas_gasa_extras',
  gases_extra: ['gasas_extra', 'gases_extra'],
  venda_quemado: 'venda_quemado',
  curacion: {
    P: 'curacion_p',
    M: 'curacion_m',
    G: 'curacion_g'
  },
  suero: 'suero',
  aspiracion: 'aspiracion',
  sonda: {
    SNG: 'sonda_sng',
    SOG: 'sonda_sog',
    SV: 'sonda_sv'
  },
  compresas: {
    P: 'compresas',
    M: 'compresas',
    G: 'compresas'
  },
  yeso: {
    SI: ['yeso_p', 'yeso_m', 'yeso_g', 'yeso']
  },
  oxigeno: 'oxigeno',
  enema: 'enema',
  corbatas: 'corbatas',
  algodon: 'algodon'
}

const emptyForm = () => ({
  fecha: moment().format('YYYY-MM-DD'),
  hora: moment().format('HH:mm'),
  paciente_id: null,
  doctor_id: null,
  tipo_atencion: 'Externo',
  punto: 0,
  nombre_factura: '',
  numero_ficha: '',
  formulario_diagnostico: '',
  formulario_detalle: createEmptyDetail(),
  formulario_observaciones: '',
  estado_pago: 'Ahora',
  laboratorio_nombre: '',
  medico_ecografia: '',
  observaciones: '',
  qr: 0,
  efectivo: 0,
  egreso: 0,
  costo_atencion_medica: 0,
  costo_curacion: 0,
  costo_inyectable: 0,
  costo_toma_presion: 0,
  costo_ambulancia: 0,
  costo_laboratorio: 0,
  costo_ecografia: 0,
  costo_uso_consultorio: 0,
  costo_glicemia: 0,
  costo_certificado_medico: 0,
  costo_sutura: 0,
  costo_antisepticos: 0,
  costo_cama: 0,
  costo_compania_noche: 0,
  costo_uso_ecografia: 0,
  costo_flebotomia: 0,
  costo_sonda: 0,
  costo_farmacia: 0,
  otros_costos: 0
})

export default {
  name: 'CajaRecepcionFormPage',
  data () {
    return {
      tab: 'datos',
      loading: false,
      saving: false,
      savingPatient: false,
      savingDoctor: false,
      patientSearchTimer: null,
      patientSearchSeq: 0,
      arancelPrecioPorCodigo: {},
      atencionMedicaAdjustment: 0,
      syncingAtencionMedica: false,
      recognition: null,
      activeRecognitionTarget: null,
      activeQuickPatientField: null,
      form: emptyForm(),
      doctores: [],
      pacienteOptions: [],
      doctorOptions: [],
      metodoPago: 'efectivo',
      patientDialog: false,
      doctorDialog: false,
      quickPatient: {
        nombre: '',
        apellido: '',
        identificacion: '',
        edad: '',
        sexo: 'M',
        fecha_nacimiento: '',
        telefono: '',
        direccion: '',
        tipo_paciente: 'Externo'
      },
      quickDoctor: {
        nombre: '',
        especialidad: '',
        telefono: '',
        email: ''
      },
      puntoOptions: [
        { label: '0', value: 0 },
        { label: '1', value: 1 }
      ],
      metodoPagoOptions: [
        { label: 'Efectivo', value: 'efectivo' },
        { label: 'QR', value: 'qr' },
        { label: 'Mixto', value: 'mixto' },
        { label: 'Pendiente', value: 'pendiente' }
      ],
      costFields: [
        { key: 'costo_atencion_medica', label: 'Atencion medica', icon: 'medical_services', iconColor: 'light-blue-7', cardClass: 'cost-card--sky' },
        { key: 'costo_curacion', label: 'Curacion', icon: 'healing', iconColor: 'green-6', cardClass: 'cost-card--mint' },
        { key: 'costo_inyectable', label: 'Inyectables', icon: 'vaccines', iconColor: 'pink-5', cardClass: 'cost-card--rose' },
        { key: 'costo_toma_presion', label: 'Toma de presion', icon: 'monitor_heart', iconColor: 'deep-purple-4', cardClass: 'cost-card--violet' },
        { key: 'costo_ambulancia', label: 'Ambulancia', icon: 'emergency', iconColor: 'orange-6', cardClass: 'cost-card--amber' },
        { key: 'costo_laboratorio', label: 'Laboratorio', icon: 'science', iconColor: 'blue-6', cardClass: 'cost-card--blue' },
        { key: 'costo_ecografia', label: 'Ecografia', icon: 'pregnant_woman', iconColor: 'purple-5', cardClass: 'cost-card--purple' },
        { key: 'costo_uso_consultorio', label: 'Uso consultorio', icon: 'door_front', iconColor: 'brown-5', cardClass: 'cost-card--sand' },
        { key: 'costo_glicemia', label: 'Glicemia', icon: 'water_drop', iconColor: 'cyan-6', cardClass: 'cost-card--aqua' },
        { key: 'costo_certificado_medico', label: 'Certificado medico', icon: 'description', iconColor: 'blue-grey-5', cardClass: 'cost-card--silver' },
        { key: 'costo_sutura', label: 'Sutura', icon: 'content_cut', iconColor: 'red-5', cardClass: 'cost-card--rose' },
        { key: 'costo_antisepticos', label: 'Antisepticos', icon: 'sanitizer', iconColor: 'teal-5', cardClass: 'cost-card--mint' },
        { key: 'costo_cama', label: 'Cama', icon: 'bed', iconColor: 'indigo-5', cardClass: 'cost-card--sky' },
        { key: 'costo_compania_noche', label: 'Compania noche', icon: 'night_shelter', iconColor: 'deep-purple-5', cardClass: 'cost-card--violet' },
        { key: 'costo_uso_ecografia', label: 'Uso ecografia', icon: 'devices', iconColor: 'light-blue-7', cardClass: 'cost-card--blue' },
        { key: 'costo_flebotomia', label: 'Flebotomia', icon: 'bloodtype', iconColor: 'red-4', cardClass: 'cost-card--aqua' },
        { key: 'costo_sonda', label: 'Sonda', icon: 'medication_liquid', iconColor: 'amber-7', cardClass: 'cost-card--sand' },
        { key: 'costo_farmacia', label: 'Farmacia', icon: 'local_pharmacy', iconColor: 'light-green-6', cardClass: 'cost-card--mint' },
        { key: 'otros_costos', label: 'Otros costos', icon: 'add_card', iconColor: 'grey-7', cardClass: 'cost-card--silver' }
      ]
    }
  },
  computed: {
    isEdit () {
      return !!this.$route.params.id
    },
    recaudadoTotal () {
      return this.costFields.reduce((sum, field) => sum + Number(this.form[field.key] || 0), 0)
    },
    pagadoAhora () {
      return Number(this.form.qr || 0) + Number(this.form.efectivo || 0)
    },
    saldoFinal () {
      return Number(this.form.efectivo || 0) - Number(this.form.egreso || 0)
    },
    pagoAhoraToggle: {
      get () {
        return this.form.estado_pago === 'Ahora'
      },
      set (value) {
        this.form.estado_pago = value ? 'Ahora' : 'Luego'
      }
    },
    showQr () {
      return this.metodoPago === 'qr' || this.metodoPago === 'mixto'
    },
    showEfectivo () {
      return this.metodoPago === 'efectivo' || this.metodoPago === 'mixto'
    },
    controlItems () {
      return controlCatalog.map(item => ({
        ...item,
        prices: this.resolveControlPrices(item),
        options: controlOptions[item.type] || []
      }))
    },
    controlItemsByKey () {
      return this.controlItems.reduce((acc, item) => {
        acc[item.key] = item
        return acc
      }, {})
    },
    formularioSelectedItems () {
      return this.controlItems
        .map(item => {
          const value = this.form.formulario_detalle[item.key]
          const amount = this.getFormularioAmount(item.key, value)
          const selectedValues = this.normalizeFormularioValue(value).filter(current => current && current !== 'NO')
          return selectedValues.length
            ? { key: item.key, label: item.label, value: selectedValues.join(', '), amount }
            : null
        })
        .filter(Boolean)
    },
    formularioTotalReferencial () {
      return this.formularioSelectedItems.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    }
  },
  watch: {
    recaudadoTotal () {
      this.syncPaymentAmounts()
    },
    formularioTotalReferencial () {
      this.syncAtencionMedicaCost()
    },
    metodoPago () {
      this.syncPaymentAmounts()
    },
    'form.costo_atencion_medica' (value) {
      if (this.syncingAtencionMedica) return
      this.atencionMedicaAdjustment = Number(value || 0) - Number(this.formularioTotalReferencial || 0)
    },
    'form.qr' () {
      if (this.metodoPago === 'mixto' || this.metodoPago === 'qr') {
        this.syncPaymentAmounts()
      }
    }
  },
  mounted () {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'es-ES'
      this.recognition.interimResults = false
      this.recognition.continuous = false
      this.recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim()
        if (!transcript) return

        if (this.activeRecognitionTarget === 'quickPatient' && this.activeQuickPatientField) {
          const currentValue = this.quickPatient[this.activeQuickPatientField] || ''
          this.quickPatient[this.activeQuickPatientField] = `${currentValue}${currentValue ? ' ' : ''}${transcript}`.trim()
        }

        if (this.activeRecognitionTarget === 'form' && this.activeQuickPatientField) {
          const currentValue = this.form[this.activeQuickPatientField] || ''
          this.form[this.activeQuickPatientField] = `${currentValue}${currentValue ? ' ' : ''}${transcript}`.trim()
        }
      }
      this.recognition.onerror = () => {
        this.$q.notify({
          color: 'negative',
          message: 'No se pudo reconocer la voz'
        })
      }
      this.recognition.onend = () => {
        this.activeRecognitionTarget = null
        this.activeQuickPatientField = null
      }
    }

    this.loadFormData()
  },
  methods: {
    required (value) {
      return !!value || 'Campo requerido'
    },
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    displayCostValue (key) {
      const value = this.form[key]
      return Number(value || 0) === 0 ? '' : value
    },
    updateCostValue (key, value) {
      this.form[key] = value === '' || value === null ? '' : Number(value)
    },
    syncAtencionMedicaCost () {
      this.syncingAtencionMedica = true
      const nextValue = Number(this.formularioTotalReferencial || 0) + Number(this.atencionMedicaAdjustment || 0)
      this.form.costo_atencion_medica = Math.max(nextValue, 0)
      this.$nextTick(() => {
        this.syncingAtencionMedica = false
      })
    },
    syncPaymentAmounts () {
      const total = Number(this.recaudadoTotal || 0)
      const qr = Number(this.form.qr || 0)

      if (this.metodoPago === 'pendiente') {
        this.form.qr = 0
        this.form.efectivo = 0
        return
      }

      if (this.metodoPago === 'qr') {
        this.form.qr = total
        this.form.efectivo = 0
        return
      }

      if (this.metodoPago === 'mixto') {
        const safeQr = Math.min(Math.max(qr, 0), total)
        if (safeQr !== qr) {
          this.form.qr = safeQr
        }
        this.form.efectivo = Math.max(total - safeQr, 0)
        return
      }

      this.form.qr = 0
      this.form.efectivo = total
    },
    normalizeFormularioValue (value) {
      if (Array.isArray(value)) return value
      if (!value || value === 'NO') return []
      return [value]
    },
    getFormularioSelection (key) {
      return this.normalizeFormularioValue(this.form.formulario_detalle[key])
    },
    setFormularioSelection (key, values) {
      const uniqueValues = [...new Set((values || []).filter(Boolean))]
      this.form.formulario_detalle = {
        ...this.form.formulario_detalle,
        [key]: uniqueValues.length ? uniqueValues : null
      }
    },
    updateQuickPatientAge (value) {
      if (!value) {
        this.quickPatient.edad = ''
        return
      }

      const birthDate = moment(value, 'YYYY-MM-DD', true)
      if (!birthDate.isValid()) return

      const age = moment().diff(birthDate, 'years')
      this.quickPatient.edad = age >= 0 ? String(age) : ''
    },
    setAranceles (aranceles = []) {
      this.arancelPrecioPorCodigo = aranceles.reduce((acc, arancel) => {
        const code = (arancel?.codigo || '').trim()
        if (!code) return acc
        acc[code] = Number(arancel.precio || 0)
        return acc
      }, {})
    },
    getControlArancelCodes (key, option) {
      const config = controlArancelCodeMap[key]
      if (!config) return []

      if (typeof config === 'string') return [config]
      if (Array.isArray(config)) return config

      const byOption = config?.[option] ?? config?.default
      if (!byOption) return []
      return Array.isArray(byOption) ? byOption : [byOption]
    },
    getArancelPrice (key, option) {
      const codes = this.getControlArancelCodes(key, option)
      for (const code of codes) {
        if (Object.prototype.hasOwnProperty.call(this.arancelPrecioPorCodigo, code)) {
          return Number(this.arancelPrecioPorCodigo[code] || 0)
        }
      }
      return null
    },
    resolveControlPrices (item) {
      const prices = { ...(item.prices || {}) }
      Object.keys(prices).forEach(option => {
        const arancelPrice = this.getArancelPrice(item.key, option)
        if (arancelPrice !== null) {
          prices[option] = arancelPrice
        }
      })
      return prices
    },
    getFormularioAmount (key, value) {
      const selectedValues = this.normalizeFormularioValue(value).filter(current => current && current !== 'NO')
      if (!selectedValues.length) return 0
      const prices = this.controlItemsByKey[key]?.prices || {}
      return selectedValues.reduce((sum, current) => sum + Number(prices[current] || 0), 0)
    },
    loadFormData () {
      this.loading = true
      Promise.all([
        this.$axios.get('doctores'),
        this.$axios.get('pacientes', { params: { search: '', page: 1 } }),
        this.$axios.get('aranceles'),
        this.isEdit ? this.$axios.get(`caja-recepciones/${this.$route.params.id}`) : Promise.resolve(null)
      ]).then(([doctoresRes, pacientesRes, arancelesRes, itemRes]) => {
        this.doctores = doctoresRes.data || []
        this.doctorOptions = this.doctores.map(this.mapDoctorOption)
        this.pacienteOptions = (pacientesRes.data.data || []).map(this.mapPacienteOption)
        this.setAranceles(arancelesRes.data || [])
        if (itemRes && itemRes.data) {
          this.form = {
            ...emptyForm(),
            ...itemRes.data,
            fecha: itemRes.data.fecha ? itemRes.data.fecha.substring(0, 10) : moment().format('YYYY-MM-DD'),
            hora: itemRes.data.hora ? itemRes.data.hora.substring(0, 5) : moment().format('HH:mm'),
            formulario_detalle: {
              ...createEmptyDetail(),
              ...(itemRes.data.formulario_detalle || {})
            }
          }
          this.atencionMedicaAdjustment = Number(this.form.costo_atencion_medica || 0) - Number(this.formularioTotalReferencial || 0)
          this.syncAtencionMedicaCost()
          this.metodoPago = this.detectMetodoPago()
          this.syncPaymentAmounts()
          const paciente = itemRes.data.paciente
          if (paciente) {
            const option = this.mapPacienteOption(paciente)
            if (!this.pacienteOptions.some(item => item.value === option.value)) {
              this.pacienteOptions.unshift(option)
            }
          }
        } else {
          this.atencionMedicaAdjustment = 0
          this.syncAtencionMedicaCost()
          this.syncPaymentAmounts()
        }
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo cargar la pantalla de caja')
      }).finally(() => {
        this.loading = false
      })
    },
    detectMetodoPago () {
      if (Number(this.form.qr || 0) > 0 && Number(this.form.efectivo || 0) > 0) return 'mixto'
      if (Number(this.form.qr || 0) > 0) return 'qr'
      if (Number(this.form.efectivo || 0) > 0) return 'efectivo'
      return 'pendiente'
    },
    mapPacienteOption (paciente) {
      const nombre = paciente.nombre_completo || `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim()
      const doc = paciente.identificacion ? ` - ${paciente.identificacion}` : ''
      return {
        label: `${nombre}${doc}`,
        value: paciente.id
      }
    },
    mapDoctorOption (doctor) {
      return {
        label: `${doctor.nombre}${doctor.especialidad ? ' - ' + doctor.especialidad : ''}`,
        value: doctor.id
      }
    },
    filterPacientes (val, update, abort) {
      const search = (val || '').trim()

      clearTimeout(this.patientSearchTimer)

      if (search === '') {
        update(() => {
          this.pacienteOptions = [...this.pacienteOptions]
        })
        return
      }

      const seq = ++this.patientSearchSeq

      this.patientSearchTimer = setTimeout(() => {
        this.$axios.get('pacientes', { params: { search, page: 1 } }).then(res => {
          if (seq !== this.patientSearchSeq) return
          update(() => {
            this.pacienteOptions = (res.data.data || []).map(this.mapPacienteOption)
          })
        }).catch(() => {
          if (seq !== this.patientSearchSeq) return
          update(() => {
            this.pacienteOptions = []
          })
        })
      }, 350)
    },
    filterDoctores (val, update) {
      update(() => {
        const needle = (val || '').toLowerCase()
        this.doctorOptions = this.doctores
          .filter(doctor => {
            const text = `${doctor.nombre || ''} ${doctor.especialidad || ''}`.toLowerCase()
            return text.includes(needle)
          })
          .map(this.mapDoctorOption)
      })
    },
    startQuickPatientRecognition (field) {
      if (!this.recognition) {
        this.$q.notify({
          color: 'negative',
          message: 'El reconocimiento de voz no esta soportado en este navegador'
        })
        return
      }

      this.activeRecognitionTarget = 'quickPatient'
      this.activeQuickPatientField = field

      try {
        this.recognition.start()
      } catch (error) {
        this.$q.notify({
          color: 'warning',
          message: 'El microfono ya esta en uso'
        })
      }
    },
    startFormRecognition (field) {
      if (!this.recognition) {
        this.$q.notify({
          color: 'negative',
          message: 'El reconocimiento de voz no esta soportado en este navegador'
        })
        return
      }

      this.activeRecognitionTarget = 'form'
      this.activeQuickPatientField = field

      try {
        this.recognition.start()
      } catch (error) {
        this.$q.notify({
          color: 'warning',
          message: 'El microfono ya esta en uso'
        })
      }
    },
    saveQuickPatient () {
      this.savingPatient = true
      this.$axios.post('pacientes', this.quickPatient).then(res => {
        const option = this.mapPacienteOption(res.data)
        this.pacienteOptions.unshift(option)
        this.form.paciente_id = res.data.id
        this.patientDialog = false
        this.quickPatient = {
          nombre: '',
          apellido: '',
          identificacion: '',
          edad: '',
          sexo: 'M',
          fecha_nacimiento: '',
          telefono: '',
          direccion: '',
          tipo_paciente: 'Externo'
        }
        this.$alert.success('Paciente creado')
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo crear el paciente')
      }).finally(() => {
        this.savingPatient = false
      })
    },
    saveQuickDoctor () {
      this.savingDoctor = true
      this.$axios.post('doctores', this.quickDoctor).then(res => {
        const option = this.mapDoctorOption(res.data)
        this.doctores.unshift(res.data)
        this.doctorOptions.unshift(option)
        this.form.doctor_id = res.data.id
        this.doctorDialog = false
        this.quickDoctor = {
          nombre: '',
          especialidad: '',
          telefono: '',
          email: ''
        }
        this.$alert.success('Medico creado')
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo crear el medico')
      }).finally(() => {
        this.savingDoctor = false
      })
    },
    buildPayload () {
      const payload = { ...this.form }
      this.costFields.forEach(field => {
        payload[field.key] = Number(payload[field.key] || 0)
      })
      if (this.metodoPago === 'pendiente') {
        payload.qr = 0
        payload.efectivo = 0
      } else if (this.metodoPago === 'qr') {
        payload.efectivo = 0
      } else if (this.metodoPago === 'efectivo') {
        payload.qr = 0
      }
      if (Number(payload.punto) !== 1) {
        payload.nombre_factura = null
      }
      return payload
    },
    save () {
      this.saving = true
      const payload = this.buildPayload()
      const request = this.isEdit
        ? this.$axios.put(`caja-recepciones/${this.$route.params.id}`, payload)
        : this.$axios.post('caja-recepciones', payload)

      request.then(() => {
        this.$alert.success(this.isEdit ? 'Caja de recepcion actualizada' : 'Caja de recepcion creada')
        this.$router.push({ name: 'caja-recepciones' })
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo guardar la caja de recepcion')
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style scoped>
.cost-card {
  height: 100%;
  border-radius: 10px;
}

.cost-card--sky {
  background: linear-gradient(180deg, #f2f9ff 0%, #ffffff 100%);
}

.cost-card--mint {
  background: linear-gradient(180deg, #f2fff7 0%, #ffffff 100%);
}

.cost-card--rose {
  background: linear-gradient(180deg, #fff4f7 0%, #ffffff 100%);
}

.cost-card--violet {
  background: linear-gradient(180deg, #f6f2ff 0%, #ffffff 100%);
}

.cost-card--amber {
  background: linear-gradient(180deg, #fff8ec 0%, #ffffff 100%);
}

.cost-card--blue {
  background: linear-gradient(180deg, #f1f7ff 0%, #ffffff 100%);
}

.cost-card--purple {
  background: linear-gradient(180deg, #faf1ff 0%, #ffffff 100%);
}

.cost-card--sand {
  background: linear-gradient(180deg, #fbf6ef 0%, #ffffff 100%);
}

.cost-card--aqua {
  background: linear-gradient(180deg, #effdff 0%, #ffffff 100%);
}

.cost-card--silver {
  background: linear-gradient(180deg, #f5f7f9 0%, #ffffff 100%);
}

.cost-card :deep(.q-field__control) {
  background: transparent;
}

.control-row {
  display: grid;
  grid-template-columns: minmax(120px, 150px) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  padding: 8px;
  min-height: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
}

.control-label {
  min-width: 0;
}

.control-price {
  font-size: 11px;
}

.control-actions :deep(.q-option-group) {
  gap: 6px 10px;
}

.control-actions :deep(.q-checkbox) {
  margin-right: 0;
}

.control-actions :deep(.q-checkbox__label) {
  font-size: 11px;
}

@media (max-width: 600px) {
  .control-row {
    grid-template-columns: 112px minmax(0, 1fr);
    gap: 6px;
  }

  .control-actions :deep(.q-checkbox__label) {
    font-size: 10px;
  }
}
</style>
