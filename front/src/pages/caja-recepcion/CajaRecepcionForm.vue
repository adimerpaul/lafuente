<template>
  <q-page class="q-pa-sm">
    <q-card flat bordered>
      <q-card-section class="row items-center bg-primary text-white">
        <div>
          <div class="text-h6">{{ isEdit ? 'Editar caja de recepcion' : 'Nueva caja de recepcion' }}</div>
          <div class="text-caption">Registro rapido y ordenado para atencion de recepcion</div>
        </div>
        <q-space />
        <q-btn
          v-if="isEdit && !form.is_anulado"
          flat
          no-caps
          icon="cancel"
          label="Anular"
          color="white"
          class="q-mr-sm"
          :loading="anulando"
          @click="anularDialog = true"
        />
        <q-btn flat round dense icon="arrow_back" color="white" @click="$router.push({ name: 'caja-recepciones' })" />
      </q-card-section>

      <q-banner v-if="form.is_anulado" class="bg-negative text-white text-center text-weight-bold">
        <q-icon name="cancel" class="q-mr-xs" /> Este registro fue ANULADO y no puede editarse.
      </q-banner>

      <q-card-section class="q-pa-sm">
        <q-form @submit="save" :disable="form.is_anulado">
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
                input-debounce="600"
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

          <div class="text-right q-mb-sm">
            <q-btn color="negative" label="Cancelar" no-caps @click="$router.push({ name: 'caja-recepciones' })" :loading="saving" />
            <q-btn color="primary" label="Guardar" type="submit" no-caps class="q-ml-sm" :loading="saving" />
          </div>

          <q-tabs v-model="tab" dense align="left" active-color="primary" indicator-color="primary" class="text-grey-8">
            <q-tab name="datos" icon="assignment" label="Datos" no-caps />
            <q-tab name="costos" icon="payments" label="Costos" no-caps />
            <q-tab name="formulario" icon="assignment_turned_in" label="Formulario" no-caps />
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
              <div v-if="loadingCostos" class="flex flex-center q-py-lg">
                <q-spinner color="teal" size="40px" />
              </div>
              <div v-else-if="!costosCatalogo.length" class="text-center text-grey-6 q-py-lg">
                No hay costos configurados. Ve a <strong>Financiera → Costos</strong> para crearlos.
              </div>
              <div v-else class="row q-col-gutter-sm">
                <div
                  v-for="costo in costosCatalogo"
                  :key="costo.id"
                  class="col-12 col-sm-6 col-md-4 col-xl-3"
                >
                  <q-card flat bordered class="costo-item-card">
                    <q-card-section class="q-pa-sm">
                      <div class="row items-center no-wrap q-mb-sm">
                        <div class="costo-item-icon q-mr-sm" :style="{ background: costo._hex }">
                          <q-icon :name="costo.icono || 'payments'" color="white" size="xs" />
                        </div>
                        <div class="col text-caption text-weight-bold ellipsis">{{ costo.nombre }}</div>
                        <q-btn
                          dense
                          no-caps
                          unelevated
                          icon="fact_check"
                          label=""
                          color="teal-7"
                          class="q-ml-xs"
                          @click.stop="openArancelDialog(costo)"
                        >
                          <q-tooltip>{{ costo.aranceles && costo.aranceles.length ? 'Marcar aranceles' : 'Sin aranceles configurados' }}</q-tooltip>
                          <q-badge
                            v-if="costoArancelCount(costo.id) > 0"
                            floating rounded color="positive"
                            :label="String(costoArancelCount(costo.id))"
                          />
                        </q-btn>
                      </div>
                      <q-input
                        :model-value="costoValueDisplay(costo.id)"
                        dense
                        outlined
                        type="number"
                        min="0"
                        step="0.5"
                        label="Monto (Bs)"
                        @update:model-value="setCostoMonto(costo.id, $event)"
                      >
                        <template #prepend>
                          <span class="text-caption text-grey-7">Bs</span>
                        </template>
                      </q-input>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.laboratorio_nombre" dense outlined label="A qué laboratorio se lo llevó" />
                </div>
                <div class="col-12 col-md-6">
                  <q-input v-model="form.medico_ecografia" dense outlined label="Quién hizo la ecografía" />
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
                <div class="col-12 col-md-4">
                  <q-toggle
                    v-model="form.estado_cobro"
                    true-value="Pagado"
                    false-value="Pendiente"
                    checked-icon="payments"
                    unchecked-icon="schedule"
                    :color="form.estado_cobro === 'Pagado' ? 'positive' : 'grey-5'"
                    keep-color
                    :label="form.estado_cobro === 'Pagado' ? 'Paga ahora' : 'Paga luego'"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-card flat bordered class="q-pa-sm bg-grey-1">
                    <div class="text-caption text-weight-medium q-mb-xs">Pago del doctor</div>
                    <q-option-group
                      v-model="doctorPagoPorcentaje"
                      :options="doctorPagoPorcentajeOptions"
                      type="radio"
                      inline
                      dense
                      color="negative"
                      class="doctor-percent-options"
                    />
                    <div class="row items-center justify-between q-mt-xs">
                      <div class="text-caption">Egreso doctor</div>
                      <div class="text-weight-bold text-negative">{{ money(form.egreso) }}</div>
                    </div>
                    <q-input
                      v-model.number="form.egreso"
                      dense
                      outlined
                      type="number"
                      min="0"
                      step="1"
                      label="Editar egreso doctor"
                      class="q-mt-sm"
                      @update:model-value="setDoctorEgresoManual"
                    />
                    <div class="text-caption text-grey-7">
                      {{ doctorPagoPorcentaje }}% de {{ money(recaudadoTotal) }} = {{ money(doctorEgresoCalculado) }}
                    </div>
                  </q-card>
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

    <q-dialog v-model="observacionDialog" persistent>
      <q-card style="min-width: 680px; max-width: 96vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-medium">
            Observaciones de {{ selectedCostFieldLabel }}
          </div>
          <q-space />
          <q-btn flat round dense icon="close" @click="closeObservacionDialog" />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveObservacion">
            <q-input
              v-model="observacionForm.observacion"
              dense
              outlined
              autogrow
              type="textarea"
              label="Observacion / detalle"
              :disable="savingObservacion || form.is_anulado"
            />

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-auto">
                <q-btn
                  no-caps
                  color="primary"
                  icon="photo_camera"
                  label="Tomar foto"
                  :disable="savingObservacion || form.is_anulado"
                  @click="openObservacionCamera"
                />
              </div>
              <div class="col-auto">
                <q-btn
                  no-caps
                  color="secondary"
                  icon="upload"
                  label="Subir imagen"
                  :disable="savingObservacion || form.is_anulado"
                  @click="openObservacionGallery"
                />
              </div>
              <div class="col">
                <div class="text-caption text-grey-8">
                  Registrado por: {{ currentUserName }} | Hora actual: {{ nowLabel }}
                </div>
                <div class="text-caption text-grey-6">
                  Puedes guardar solo texto o texto + imagen.
                </div>
              </div>
            </div>

            <input
              ref="observacionCameraInput"
              type="file"
              accept="image/*"
              capture="environment"
              style="display:none"
              @change="onObservacionFileSelected"
            />
            <input
              ref="observacionGalleryInput"
              type="file"
              accept="image/*"
              style="display:none"
              @change="onObservacionFileSelected"
            />

            <q-card v-if="observacionForm.fotoPreview" flat bordered class="q-mt-sm">
              <q-card-section class="q-pa-sm">
                <div class="text-caption text-grey-8 q-mb-xs">Imagen seleccionada</div>
                <q-img :src="observacionForm.fotoPreview" style="max-height: 220px" fit="contain" />
                <div class="text-right q-mt-sm">
                  <q-btn
                    flat
                    no-caps
                    color="negative"
                    icon="delete"
                    label="Quitar imagen"
                    :disable="savingObservacion || form.is_anulado"
                    @click="clearObservacionPhoto"
                  />
                </div>
              </q-card-section>
            </q-card>

            <div class="text-right q-mt-md">
              <q-btn flat no-caps label="Cancelar" :disable="savingObservacion" @click="closeObservacionDialog" />
              <q-btn
                class="q-ml-sm"
                color="primary"
                no-caps
                label="Guardar observacion"
                type="submit"
                :loading="savingObservacion"
                :disable="form.is_anulado"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Historial</div>
          <q-inner-loading :showing="loadingObservaciones" />
          <div v-if="!loadingObservaciones && !selectedCostObservaciones.length" class="text-grey-7 text-caption">
            Sin observaciones para este costo.
          </div>
          <div v-else class="column q-gutter-sm">
            <q-card v-for="item in selectedCostObservaciones" :key="item.uid" flat bordered>
              <q-card-section class="q-pa-sm">
                <div class="row items-start">
                  <div class="col">
                    <div class="text-caption text-grey-8">
                      {{ item.user_name || '-' }} | {{ formatObservacionDate(item.created_at) }}
                      <span v-if="item.is_pending" class="text-orange-8"> | Pendiente de guardar</span>
                    </div>
                    <div v-if="item.observacion" class="q-mt-xs">{{ item.observacion }}</div>
                    <q-img
                      v-if="item.foto_url || item.fotoPreview"
                      :src="item.foto_url || item.fotoPreview"
                      class="q-mt-sm"
                      style="max-height: 220px"
                      fit="contain"
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      flat
                      round
                      dense
                      color="negative"
                      icon="delete"
                      :disable="deletingObservacion || form.is_anulado"
                      @click="deleteObservacion(item)"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
    <q-dialog v-model="arancelDialog" persistent>
      <q-card style="min-width: 420px; max-width: 92vw;">
        <q-card-section class="row items-center q-pb-none" :style="{ background: arancelDialogCosto?._hex || '#009688' }">
          <q-icon :name="arancelDialogCosto?.icono || 'payments'" color="white" class="q-mr-sm" />
          <div class="text-subtitle1 text-white text-weight-bold">{{ arancelDialogCosto?.nombre }}</div>
          <q-space />
          <q-btn flat round dense icon="close" color="white" @click="arancelDialog = false" />
        </q-card-section>
        <q-card-section>
          <div class="text-caption text-grey-7 q-mb-sm">Selecciona los aranceles aplicados para calcular el monto:</div>
          <div v-if="!(arancelDialogCosto?.aranceles || []).length" class="text-grey-6 text-center q-py-md">
            Este costo todavia no tiene aranceles relacionados.
          </div>
          <div class="column q-gutter-xs">
            <q-card
              v-for="ar in (arancelDialogCosto?.aranceles || [])"
              :key="ar.id"
              flat bordered
              class="arancel-check-row cursor-pointer"
              :class="{ 'arancel-check-row--selected': isArancelSelected(ar.id) }"
              @click="toggleArancel(ar.id)"
            >
              <q-card-section class="q-pa-sm row items-center">
                <q-checkbox
                  :model-value="isArancelSelected(ar.id)"
                  @update:model-value="toggleArancel(ar.id)"
                  dense color="teal-7"
                  @click.stop
                />
                <div class="col q-ml-sm">
                  <div class="text-body2 text-weight-medium">{{ ar.nombre }}</div>
                  <div v-if="ar.presentacion" class="text-caption text-grey-6">{{ ar.presentacion }}</div>
                </div>
                <div class="text-body2 text-weight-bold text-teal-8">{{ ar.precio }} Bs</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="row items-center justify-between q-mt-md">
            <div class="text-caption text-grey-7">
              Total seleccionado: <strong class="text-teal-8">{{ arancelSelectionTotal }} Bs</strong>
            </div>
            <div>
              <q-btn flat label="Cancelar" no-caps @click="arancelDialog = false" />
              <q-btn color="teal-7" label="Aplicar" no-caps icon="check" class="q-ml-sm" @click="applyArancelSelection" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="anularDialog" persistent>
      <q-card style="min-width: 320px; max-width: 95vw">
        <q-card-section class="row items-center">
          <q-avatar icon="cancel" color="negative" text-color="white" />
          <span class="q-ml-sm text-h6">Anular registro</span>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-8">
          Esta acción <strong>no se puede deshacer</strong>. El registro quedará marcado como anulado y no podrá editarse.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" no-caps @click="anularDialog = false" :disable="anulando" />
          <q-btn color="negative" label="Sí, anular" no-caps icon="cancel" :loading="anulando" @click="anular" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import moment from 'moment'
import {
  controlCatalog,
  controlOptions,
  createEmptyDetail,
  getControlArancelCodes
} from '../formularios-control/controlCatalog'

const QUASAR_HEX = {
  'indigo': '#3f51b5', 'pink-6': '#e91e63', 'teal-7': '#00796b',
  'blue-7': '#1976d2', 'purple-6': '#9c27b0', 'brown-6': '#795548',
  'green-7': '#388e3c', 'deep-purple-6': '#673ab7', 'orange-7': '#f57c00',
  'cyan-7': '#0097a7', 'red-6': '#e53935', 'grey-7': '#616161',
  'pink-7': '#c2185b', 'brown-7': '#5d4037', 'purple-8': '#6a1b9a',
  'deep-purple-7': '#512da8', 'orange-9': '#e65100', 'blue-9': '#1565c0',
  'light-green-8': '#558b2f', 'grey-8': '#424242',
  'primary': '#1976d2', 'teal-8': '#00695c',
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
  estado_cobro: 'Pagado',
})

const createEmptyObservacionForm = () => ({
  observacion: '',
  foto: null,
  fotoPreview: ''
})

export default {
  name: 'CajaRecepcionFormPage',
  data () {
    return {
      tab: 'datos',
      loading: false,
      saving: false,
      anulando: false,
      anularDialog: false,
      savingPatient: false,
      savingDoctor: false,
      savingObservacion: false,
      deletingObservacion: false,
      loadingObservaciones: false,
      observacionesLoaded: false,
      patientSearchTimer: null,
      patientSearchSeq: 0,
      arancelPrecioPorCodigo: {},
      recognition: null,
      costosCatalogo: [],
      loadingCostos: false,
      costosValues: {},
      arancelDialog: false,
      arancelDialogCosto: null,
      arancelDialogSelection: {},
      activeRecognitionTarget: null,
      activeQuickPatientField: null,
      observacionDialog: false,
      selectedCostField: null,
      observacionForm: createEmptyObservacionForm(),
      observacionesByTipo: {},
      pendingObservaciones: [],
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
      doctorPagoPorcentaje: 15,
      doctorPagoPorcentajeOptions: [15, 20, 25, 30, 35].map(value => ({
        label: `${value}%`,
        value
      })),
    }
  },
  computed: {
    isEdit () {
      return !!this.$route.params.id
    },
    recaudadoTotal () {
      return Object.values(this.costosValues).reduce((sum, v) => sum + Number(v.monto || 0), 0)
    },
    arancelSelectionTotal () {
      if (!this.arancelDialogCosto) return 0
      return (this.arancelDialogCosto.aranceles || [])
        .filter(ar => this.arancelDialogSelection[ar.id])
        .reduce((sum, ar) => sum + Number(ar.precio || 0), 0)
    },
    pagadoAhora () {
      return Number(this.form.qr || 0) + Number(this.form.efectivo || 0)
    },
    doctorEgresoCalculado () {
      const base = this.recaudadoTotal
      const porcentaje = Number(this.doctorPagoPorcentaje || 0)
      return Math.round(Math.max((base * porcentaje) / 100, 0))
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
    },
    selectedCostFieldLabel () {
      return this.selectedCostField || 'costo'
    },
    selectedCostObservaciones () {
      if (!this.selectedCostField) return []
      const saved = this.observacionesByTipo[this.selectedCostField] || []
      const pending = this.pendingObservaciones.filter(item => item.tipo === this.selectedCostField)
      return [...pending, ...saved]
    },
    currentUserName () {
      return this.$store?.user?.name || 'Usuario actual'
    },
    nowLabel () {
      return moment().format('DD/MM/YYYY HH:mm')
    }
  },
  watch: {
    recaudadoTotal () {
      this.syncPaymentAmounts()
    },
    doctorPagoPorcentaje () {
      this.syncDoctorEgreso()
    },
    metodoPago () {
      this.syncPaymentAmounts()
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
  beforeUnmount () {
    this.revokePreviewUrl(this.observacionForm.fotoPreview)
    this.pendingObservaciones.forEach(item => this.revokePreviewUrl(item.fotoPreview))
  },
  methods: {
    required (value) {
      return !!value || 'Campo requerido'
    },
    money (value) {
      return `${Number(value || 0).toFixed(2)} Bs`
    },
    setCostosCatalogo (costos) {
      this.costosCatalogo = costos.map(c => ({
        ...c,
        _hex: QUASAR_HEX[c.color] || c.color || '#009688',
      }))
      const newValues = {}
      costos.forEach(c => {
        newValues[c.id] = this.costosValues[c.id] || { monto: 0, arancel_ids: [] }
      })
      this.costosValues = newValues
    },
    loadCostosValues (costoItems) {
      const values = {}
      ;(costoItems || []).forEach(item => {
        if (item.costo_id) {
          values[item.costo_id] = { monto: item.monto || 0, arancel_ids: item.arancel_ids || [] }
        }
      })
      this.costosCatalogo.forEach(c => {
        if (!values[c.id]) values[c.id] = { monto: 0, arancel_ids: [] }
      })
      this.costosValues = values
    },
    costoValueDisplay (costoId) {
      const v = this.costosValues[costoId]
      const n = Number(v?.monto || 0)
      return n === 0 ? '' : n
    },
    setCostoMonto (costoId, value) {
      const current = this.costosValues[costoId] || { monto: 0, arancel_ids: [] }
      this.costosValues = {
        ...this.costosValues,
        [costoId]: { ...current, monto: value === '' || value === null ? 0 : Number(value) }
      }
    },
    costoArancelCount (costoId) {
      return (this.costosValues[costoId]?.arancel_ids || []).length
    },
    openArancelDialog (costo) {
      this.arancelDialogCosto = costo
      const current = this.costosValues[costo.id]?.arancel_ids || []
      const sel = {}
      ;(costo.aranceles || []).forEach(ar => {
        sel[ar.id] = current.includes(ar.id)
      })
      this.arancelDialogSelection = sel
      this.arancelDialog = true
    },
    isArancelSelected (arId) {
      return !!this.arancelDialogSelection[arId]
    },
    toggleArancel (arId) {
      this.arancelDialogSelection = {
        ...this.arancelDialogSelection,
        [arId]: !this.arancelDialogSelection[arId]
      }
    },
    applyArancelSelection () {
      if (!this.arancelDialogCosto) return
      const costoId = this.arancelDialogCosto.id
      const selectedIds = Object.entries(this.arancelDialogSelection)
        .filter(([, v]) => v)
        .map(([id]) => parseInt(id))
      const total = (this.arancelDialogCosto.aranceles || [])
        .filter(ar => this.arancelDialogSelection[ar.id])
        .reduce((sum, ar) => sum + Number(ar.precio || 0), 0)
      this.costosValues = {
        ...this.costosValues,
        [costoId]: { monto: total, arancel_ids: selectedIds }
      }
      this.arancelDialog = false
    },
    getObservacionCount (tipo) {
      const savedCount = (this.observacionesByTipo[tipo] || []).length
      const pendingCount = this.pendingObservaciones.filter(item => item.tipo === tipo).length
      return savedCount + pendingCount
    },
    revokePreviewUrl (url) {
      if (!url || typeof url !== 'string' || !url.startsWith('blob:')) return
      URL.revokeObjectURL(url)
    },
    resetObservacionForm () {
      this.revokePreviewUrl(this.observacionForm.fotoPreview)
      this.observacionForm = createEmptyObservacionForm()
      if (this.$refs.observacionCameraInput) this.$refs.observacionCameraInput.value = ''
      if (this.$refs.observacionGalleryInput) this.$refs.observacionGalleryInput.value = ''
    },
    openObservacionDialog (costField) {
      this.selectedCostField = costField
      this.resetObservacionForm()
      this.observacionDialog = true
      if (this.isEdit && !this.observacionesLoaded) {
        this.loadObservaciones()
      }
    },
    closeObservacionDialog () {
      this.observacionDialog = false
      this.selectedCostField = null
      this.resetObservacionForm()
    },
    openObservacionCamera () {
      if (!this.$refs.observacionCameraInput) return
      this.$refs.observacionCameraInput.value = ''
      this.$refs.observacionCameraInput.click()
    },
    openObservacionGallery () {
      if (!this.$refs.observacionGalleryInput) return
      this.$refs.observacionGalleryInput.value = ''
      this.$refs.observacionGalleryInput.click()
    },
    onObservacionFileSelected (event) {
      const file = event?.target?.files?.[0]
      if (!file) return
      this.revokePreviewUrl(this.observacionForm.fotoPreview)
      this.observacionForm.foto = file
      this.observacionForm.fotoPreview = URL.createObjectURL(file)
    },
    clearObservacionPhoto () {
      this.revokePreviewUrl(this.observacionForm.fotoPreview)
      this.observacionForm.foto = null
      this.observacionForm.fotoPreview = ''
    },
    formatObservacionDate (value) {
      if (!value) return '-'
      return moment(value).format('DD/MM/YYYY HH:mm:ss')
    },
    normalizeObservacionesByTipo (items = []) {
      return (items || []).reduce((acc, item) => {
        const tipo = item.tipo
        if (!tipo) return acc
        if (!acc[tipo]) acc[tipo] = []
        acc[tipo].push({
          ...item,
          uid: `db-${item.id}`
        })
        return acc
      }, {})
    },
    async loadObservaciones () {
      if (!this.isEdit || !this.$route.params.id) return
      this.loadingObservaciones = true
      try {
        const res = await this.$axios.get(`caja-recepciones/${this.$route.params.id}/observaciones`)
        this.observacionesByTipo = this.normalizeObservacionesByTipo(res.data || [])
        this.observacionesLoaded = true
      } catch (err) {
        this.$alert.error(err.response?.data?.message || 'No se pudieron cargar las observaciones')
      } finally {
        this.loadingObservaciones = false
      }
    },
    buildObservacionFormData (item) {
      const formData = new FormData()
      formData.append('tipo', item.tipo)
      if (item.observacion) {
        formData.append('observacion', item.observacion)
      }
      if (item.foto) {
        formData.append('foto', item.foto)
      }
      return formData
    },
    async saveObservacion () {
      if (!this.selectedCostField) return
      const observacion = (this.observacionForm.observacion || '').trim()
      const foto = this.observacionForm.foto
      if (!observacion && !foto) {
        this.$alert.error('Registra una observacion o una imagen')
        return
      }

      const payload = {
        tipo: this.selectedCostField,
        observacion,
        foto
      }

      this.savingObservacion = true
      try {
        if (this.isEdit) {
          const formData = this.buildObservacionFormData(payload)
          const res = await this.$axios.post(
            `caja-recepciones/${this.$route.params.id}/observaciones`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          const tipo = res.data?.tipo || this.selectedCostField
          const current = this.observacionesByTipo[tipo] || []
          this.observacionesByTipo = {
            ...this.observacionesByTipo,
            [tipo]: [{ ...res.data, uid: `db-${res.data.id}` }, ...current]
          }
        } else {
          const tempId = `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`
          this.pendingObservaciones.unshift({
            uid: tempId,
            id: tempId,
            tipo: this.selectedCostField,
            observacion,
            foto,
            fotoPreview: this.observacionForm.fotoPreview || '',
            user_name: this.currentUserName,
            created_at: moment().toISOString(),
            is_pending: true
          })
        }

        if (this.isEdit) {
          this.resetObservacionForm()
        } else {
          this.observacionForm = createEmptyObservacionForm()
        }
        this.$alert.success('Observacion registrada')
      } catch (err) {
        this.$alert.error(err.response?.data?.message || 'No se pudo registrar la observacion')
      } finally {
        this.savingObservacion = false
      }
    },
    async deleteObservacion (item) {
      if (!item) return
      if (item.is_pending || String(item.id || '').startsWith('tmp-')) {
        this.pendingObservaciones = this.pendingObservaciones.filter(obs => obs.uid !== item.uid)
        this.revokePreviewUrl(item.fotoPreview)
        return
      }

      if (!this.isEdit || !this.$route.params.id || !item.id) return

      this.deletingObservacion = true
      try {
        await this.$axios.delete(`caja-recepciones/${this.$route.params.id}/observaciones/${item.id}`)
        const tipo = item.tipo
        const current = this.observacionesByTipo[tipo] || []
        this.observacionesByTipo = {
          ...this.observacionesByTipo,
          [tipo]: current.filter(obs => obs.id !== item.id)
        }
        this.$alert.success('Observacion eliminada')
      } catch (err) {
        this.$alert.error(err.response?.data?.message || 'No se pudo eliminar la observacion')
      } finally {
        this.deletingObservacion = false
      }
    },
    async persistPendingObservaciones (cajaId) {
      if (!cajaId || !this.pendingObservaciones.length) return
      const failed = []

      for (const item of this.pendingObservaciones) {
        const formData = this.buildObservacionFormData(item)
        try {
          await this.$axios.post(
            `caja-recepciones/${cajaId}/observaciones`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          this.revokePreviewUrl(item.fotoPreview)
        } catch (error) {
          failed.push(item)
        }
      }

      this.pendingObservaciones = failed
      this.observacionesByTipo = {}
      this.observacionesLoaded = false

      if (failed.length) {
        throw new Error(`Se guardo la caja, pero ${failed.length} observacion(es) no se pudieron subir`)
      }
    },
    closestDoctorPercentage (egreso) {
      const base = this.recaudadoTotal
      if (base <= 0) return 15

      const percent = Math.round((Number(egreso || 0) / base) * 100)
      return this.doctorPagoPorcentajeOptions.reduce((closest, option) => {
        return Math.abs(option.value - percent) < Math.abs(closest - percent)
          ? option.value
          : closest
      }, 15)
    },
    setDoctorEgresoManual (value) {
      const nextValue = Math.max(Math.round(Number(value || 0)), 0)
      if (Number(this.form.egreso || 0) !== nextValue) {
        this.form.egreso = nextValue
      }
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
    syncDoctorEgreso () {
      const allowed = this.doctorPagoPorcentajeOptions.map(option => option.value)
      const safePercent = allowed.includes(Number(this.doctorPagoPorcentaje))
        ? Number(this.doctorPagoPorcentaje)
        : 15
      if (safePercent !== Number(this.doctorPagoPorcentaje || 0)) {
        this.doctorPagoPorcentaje = safePercent
        return
      }
      const nextValue = Math.round(Math.max((this.recaudadoTotal * safePercent) / 100, 0))
      if (Number(this.form.egreso || 0) !== nextValue) {
        this.form.egreso = nextValue
      }
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
    getArancelPrice (key, option) {
      const codes = getControlArancelCodes(key, option)
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
      this.loadingCostos = true
      Promise.all([
        this.$axios.get('doctores'),
        this.$axios.get('pacientes', { params: { search: '', page: 1 } }),
        this.$axios.get('aranceles'),
        this.$axios.get('costos', { params: { activo: true } }),
        this.isEdit ? this.$axios.get(`caja-recepciones/${this.$route.params.id}`) : Promise.resolve(null)
      ]).then(([doctoresRes, pacientesRes, arancelesRes, costosRes, itemRes]) => {
        this.doctores = doctoresRes.data || []
        this.doctorOptions = this.doctores.map(this.mapDoctorOption)
        this.pacienteOptions = (pacientesRes.data.data || []).map(this.mapPacienteOption)
        this.setAranceles(arancelesRes.data || [])
        this.setCostosCatalogo(costosRes.data || [])

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
          this.loadCostosValues(itemRes.data.costo_items || [])
          this.form.egreso = Math.round(Number(this.form.egreso || 0))
          this.doctorPagoPorcentaje = this.closestDoctorPercentage(this.form.egreso)
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
          this.doctorPagoPorcentaje = 15
          this.syncDoctorEgreso()
          this.syncPaymentAmounts()
        }
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'No se pudo cargar la pantalla de caja')
      }).finally(() => {
        this.loading = false
        this.loadingCostos = false
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
      payload.egreso = Number(this.form.egreso || 0)
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
      payload.costos_detalle = Object.entries(this.costosValues)
        .filter(([, v]) => Number(v.monto || 0) > 0)
        .map(([costo_id, v]) => {
          const costo = this.costosCatalogo.find(c => String(c.id) === String(costo_id))
          return {
            costo_id: parseInt(costo_id),
            nombre: costo?.nombre || '',
            monto: Number(v.monto || 0),
            arancel_ids: v.arancel_ids || [],
          }
        })
      return payload
    },
    anular () {
      this.anulando = true
      this.$axios.put(`caja-recepciones/${this.$route.params.id}/anular`)
        .then(res => {
          this.form = { ...this.form, ...res.data }
          this.anularDialog = false
          this.$alert.success('Registro anulado correctamente')
        })
        .catch(err => {
          this.$alert.error(err.response?.data?.message || 'No se pudo anular el registro')
        })
        .finally(() => { this.anulando = false })
    },
    async save () {
      this.saving = true
      const payload = this.buildPayload()
      let cajaId = this.isEdit ? this.$route.params.id : null

      try {
        const res = this.isEdit
          ? await this.$axios.put(`caja-recepciones/${this.$route.params.id}`, payload)
          : await this.$axios.post('caja-recepciones', payload)

        if (!this.isEdit) {
          cajaId = res?.data?.id
        }

        await this.persistPendingObservaciones(cajaId)
        this.$alert.success(this.isEdit ? 'Caja de recepcion actualizada' : 'Caja de recepcion creada')
        this.$router.push({ name: 'caja-recepciones' })
      } catch (err) {
        if (cajaId && !this.isEdit) {
          this.$router.replace({ name: 'caja-recepciones-editar', params: { id: cajaId } })
        }
        this.$alert.error(err.response?.data?.message || err.message || 'No se pudo guardar la caja de recepcion')
      } finally {
        this.saving = false
      }
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

.costo-item-card { border-radius: 10px; height: 100%; }
.costo-item-card :deep(.q-field__control) { background: transparent; }
.costo-item-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.arancel-check-row { border-radius: 8px; transition: background 0.15s; }
.arancel-check-row:hover { background: #f0fdfa; }
.arancel-check-row--selected { background: #e0f2f1; border-color: #4db6ac !important; }
.doctor-percent-options {
  gap: 6px 10px;
}
.doctor-percent-options :deep(.q-radio) {
  margin-right: 0;
}
.doctor-percent-options :deep(.q-radio__label) {
  font-size: 12px;
  font-weight: 600;
}
</style>
