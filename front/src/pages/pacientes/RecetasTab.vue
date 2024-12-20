<template>
  <div class="row items-center">
    <div class="text-h6">
      Recetas
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addReceta" :loading="$store.loading" />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(antecedente, index) in paciente.antecedentes_familiares" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="index + 1" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">Tuberculosis: </span>
                <span>
                    <q-chip :label="antecedente.tuberculosis ? 'Sí' : 'No'"
                            :color="antecedente.tuberculosis ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Diabetes: </span>
                <span>
                    <q-chip :label="antecedente.diabetes ? 'Sí' : 'No'"
                            :color="antecedente.diabetes ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Hipertensión: </span>
                <span>
                    <q-chip :label="antecedente.hipertension ? 'Sí' : 'No'"
                            :color="antecedente.hipertension ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Cardiopatía: </span>
                <span>
                    <q-chip :label="antecedente.cardiopatia ? 'Sí' : 'No'"
                            :color="antecedente.cardiopatia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Neumopatía: </span>
                <span>
                    <q-chip :label="antecedente.neumopatia ? 'Sí' : 'No'"
                            :color="antecedente.neumopatia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Hepatopatía: </span>
                <span>
                    <q-chip :label="antecedente.hepatopatia ? 'Sí' : 'No'"
                            :color="antecedente.hepatopatia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Nefropatía: </span>
                <span>
                    <q-chip :label="antecedente.nefropatia ? 'Sí' : 'No'"
                            :color="antecedente.nefropatia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Endocrinopatía: </span>
                <span>
                    <q-chip :label="antecedente.endocrinopatia ? 'Sí' : 'No'"
                            :color="antecedente.endocrinopatia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Epilepsia: </span>
                <span>
                    <q-chip :label="antecedente.epilepsia ? 'Sí' : 'No'"
                            :color="antecedente.epilepsia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Asma: </span>
                <span>
                    <q-chip :label="antecedente.asma ? 'Sí' : 'No'"
                            :color="antecedente.asma ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Enfermedades hematológicas: </span>
                <span>
                    <q-chip :label="antecedente.enfermedades_hematologicas ? 'Sí' : 'No'"
                            :color="antecedente.enfermedades_hematologicas ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Neoplasias: </span>
                <span>
                    <q-chip :label="antecedente.neoplasias ? 'Sí' : 'No'"
                            :color="antecedente.neoplasias ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Enfermedades congénitas: </span>
                <span>
                    <q-chip :label="antecedente.enfermedades_congenitas ? 'Sí' : 'No'"
                            :color="antecedente.enfermedades_congenitas ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Enfermedades mentales: </span>
                <span>
                    <q-chip :label="antecedente.enfermedades_mentales ? 'Sí' : 'No'"
                            :color="antecedente.enfermedades_mentales ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">VIH: </span>
                <span>
                    <q-chip :label="antecedente.vih ? 'Sí' : 'No'"
                            :color="antecedente.vih ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>

                <span class="text-bold">Violencia: </span>
                <span>
                    <q-chip :label="antecedente.violencia ? 'Sí' : 'No'"
                            :color="antecedente.violencia ? 'positive' : 'negative'"
                            text-color="white" dense  size="10px"/>
                </span>
              </div>
              <div>
                <span class="text-bold">Otros: </span>
                <span>{{ antecedente.otros }}</span>
              </div>
              <div>
                <span class="text-bold">Observaciones: </span>
                <span>{{ antecedente.observaciones }}</span>
              </div>
              <div>
                <span class="text-bold">Parentesco: </span>
                <span>{{ antecedente.parentesco }}</span>
              </div>
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ antecedente.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ antecedente.user?.name }}</span>
<!--            <q-btn icon="print" flat @click="printReceta(antecedente)" />-->
          </q-item-section>
        </q-item>
      </q-list>
<!--      "recetas": [-->
<!--      {-->
<!--      "id": 1,-->
<!--      "paciente_id": 1,-->
<!--      "user_id": 8,-->
<!--      "indicaciones": "Tomar con agua",-->
<!--      "observaciones": "No tomar con el estomago vacio",-->
<!--      "fecha": "2024-12-20 08:25:17",-->
<!--      "user": {-->
<!--      "id": 8,-->
<!--      "name": "Arnau Cuenca",-->
<!--      "username": "cervantes.blanca",-->
<!--      "email": "saul.saldana@example.com",-->
<!--      "role": "Doctor",-->
<!--      "color": "orange"-->
<!--      },-->
<!--      "receta_detalles": [-->
<!--      {-->
<!--      "id": 1,-->
<!--      "receta_id": 1,-->
<!--      "producto_id": 942,-->
<!--      "cantidad": 1,-->
<!--      "unidad": "pastilla",-->
<!--      "via": "oral",-->
<!--      "frecuencia": "cada 8 horas",-->
<!--      "duracion": "3 dias",-->
<!--      "indicaciones": "Tomar con agua",-->
<!--      "producto": {-->
<!--      "id": 942,-->
<!--      "nombre": "VIDIZOLIN GOTAS OFTALMICAS X 5ML",-->
<!--      "descripcion": "Antibiótico, Antiinflamatorio, Descongestionante oftálmico",-->
<!--      "unidad": "FRASCOS",-->
<!--      "precio": 175,-->
<!--      "stock": null,-->
<!--      "stock_minimo": null,-->
<!--      "stock_maximo": null-->
<!--      }-->
<!--      },-->
<!--      {-->
<!--      "id": 2,-->
<!--      "receta_id": 1,-->
<!--      "producto_id": 340,-->
<!--      "cantidad": 1,-->
<!--      "unidad": "pastilla",-->
<!--      "via": "oral",-->
<!--      "frecuencia": "cada 8 horas",-->
<!--      "duracion": "3 dias",-->
<!--      "indicaciones": "Tomar con agua",-->
<!--      "producto": {-->
<!--      "id": 340,-->
<!--      "nombre": "FLEXICAM 15 MG X COMPRIMIDO SL",-->
<!--      "descripcion": "Antiinflamatorio, Analgésico de acción preferencial",-->
<!--      "unidad": "COMPRIMIDO SUBLINGUAL",-->
<!--      "precio": 6,-->
<!--      "stock": null,-->
<!--      "stock_minimo": null,-->
<!--      "stock_maximo": null-->
<!--      }-->
<!--      },-->
<!--      {-->
<!--      "id": 3,-->
<!--      "receta_id": 1,-->
<!--      "producto_id": 100,-->
<!--      "cantidad": 1,-->
<!--      "unidad": "pastilla",-->
<!--      "via": "oral",-->
<!--      "frecuencia": "cada 8 horas",-->
<!--      "duracion": "3 dias",-->
<!--      "indicaciones": "Tomar con agua",-->
<!--      "producto": {-->
<!--      "id": 100,-->
<!--      "nombre": "CLOFENAC 75 MG X AMPOLLA",-->
<!--      "descripcion": "Analgésico - Antiinflamatorio",-->
<!--      "unidad": "AMPOLLAS",-->
<!--      "precio": 14,-->
<!--      "stock": null,-->
<!--      "stock_minimo": null,-->
<!--      "stock_maximo": null-->
<!--      }-->
<!--      }-->
<!--      ]-->
<!--      }-->
<!--      ],-->
    </div>
  </div>
  <q-dialog v-model="antecedenteDialog" persistent>
    <q-card flat bordered style="width: 80%;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Receta Vital</div>
        <q-space />
        <q-btn icon="close" flat @click="antecedenteDialog = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitReceta">
          <div class="row">
            <div class="col-12 col-md-4 q-pa-xs">
              <q-input v-model="productosSearch" outlined clearable label="Buscar producto" dense debounce="300" @update:modelValue="productosGet">
                <template v-slot:append>
                  <q-btn flat round dense icon="search" />
                </template>
              </q-input>
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                  <tr>
                    <th>Nombres</th>
                    <th>Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(producto, index) in productos" :key="index" @click="addProducto(producto)">
                    <td style="padding: 0;margin: 0;" class="cursor-pointer">
                      <div style="max-width: 190px;overflow: hidden;text-overflow: ellipsis;line-height: 0.9;">
                        {{ $filters.textUpper( producto.nombre ) }}
                      </div>
                    </td>
                    <td style="padding: 0;margin: 0;" class="cursor-pointer">
                      <div style="max-width: 190px;overflow: hidden;text-overflow: ellipsis;line-height: 0.9;">
                        {{ $filters.textUpper( producto.unidad ) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
<!--              [-->
<!--              {-->
<!--              "id": 3284,-->
<!--              "nombre": "3-A OFTENO 0,1 % 5 ML",-->
<!--              "descripcion": "Antiinflamatorio no esteroideo",-->
<!--              "unidad": "SOLUCION OFTALMICA",-->
<!--              "precio": 1,-->
<!--              "stock": null,-->
<!--              "stock_minimo": null,-->
<!--              "stock_maximo": null-->
<!--              },-->
            </div>
            <div class="col-12 col-md-8 q-pa-xs">
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Vía</th>
                    <th>Frecuencia</th>
                    <th>Duración</th>
                    <th>Indicaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(producto, index) in productosRecetas" :key="index">
                    <td style="padding: 0;margin: 0;">
                      <div style="max-width: 190px;overflow: hidden;text-overflow: ellipsis;line-height: 0.9;">
                        <q-icon name="delete" color="red" class="cursor-pointer" @click="productosRecetas.splice(index, 1)" />
                        {{ $filters.textUpper( producto.producto.nombre ) }}
                      </div>
                    </td>
                    <td style="padding: 0;margin: 0;">
                      <input v-model="producto.cantidad" type="number" style="width: 50px;" />
                    </td>
                    <td style="padding: 0;margin: 0;">
                      <select v-model="producto.unidad" style="width: 80px;">
                        <option v-for="unidad in unidades" :key="unidad" :value="unidad">{{ unidad }}</option>
                      </select>
                    </td>
                    <td style="padding: 0;margin: 0;">
                      <select v-model="producto.via" style="width: 80px;">
                        <option v-for="via in vias" :key="via" :value="via">{{ via }}</option>
                      </select>
                    </td>
                    <td style="padding: 0;margin: 0;">
                      <select v-model="producto.frecuencia" style="width: 80px;">
                        <option v-for="frecuencia in frecuencias" :key="frecuencia" :value="frecuencia">{{ frecuencia }}</option>
                      </select>
                    </td>
                    <td style="padding: 0;margin: 0;">
                      <select v-model="producto.duracion" style="width: 80px;">
                        <option v-for="duracion in duraciones" :key="duracion" :value="duracion">{{ duracion }}</option>
                      </select>
                    </td>
                    <td style="padding: 0;margin: 0;">
                      <input v-model="producto.indicaciones" type="text" style="width: 100px;" />
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.tuberculosis" label="Tuberculosis" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.diabetes" label="Diabetes" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.hipertension" label="Hipertensión" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.cardiopatia" label="Cardiopatía" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.neumopatia" label="Neumopatía" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.hepatopatia" label="Hepatopatía" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.nefropatia" label="Nefropatía" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.endocrinopatia" label="Endocrinopatía" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.epilepsia" label="Epilepsia" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.asma" label="Asma" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.enfermedades_hematologicas" label="Enfermedades hematológicas" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.neoplasias" label="Neoplasias" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.enfermedades_congenitas" label="Enfermedades congénitas" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.enfermedades_mentales" label="Enfermedades mentales" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.vih" label="VIH" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="antecedente.violencia" label="Violencia" />
            </div>
            <div class="col-12">
              <q-input v-model="antecedente.otros" outlined clearable label="Otros" >
                <template v-slot:append>
                  <q-btn flat round dense icon="mic" @click="startRecognition('otros')" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input v-model="antecedente.observaciones" outlined clearable label="Observaciones" >
                <template v-slot:append>
                  <q-btn flat round dense icon="mic" @click="startRecognition('observaciones')" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-select v-model="antecedente.parentesco" outlined clearable label="Parentesco" :options="['Padre', 'Madre', 'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Tío', 'Tía', 'Primo', 'Prima', 'Otro']" />
            </div>
          </div>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="antecedenteDialog = false" :loading="$store.loading" />
          <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />
        </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "RecetasTab",
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  emits: ["pacienteGet"],
  data() {
    return {
      antecedenteDialog: false,
      antecedente: {
        referido_de: "",
        motivo_consulta: "",
        enfermedad_actual: "",
        alergias_conocidas: "",
      },
      recognition: null,
      activeField: null,
      productos: [],
      productosSearch: "",
      productosRecetas: [],
      unidades : ['capsulas', 'comprimidos', 'pastillas', 'ml', 'mg', 'otro'],
      vias : ['oral', 'intramuscular', 'intravenosa', 'subcutánea', 'tópica', 'oftálmica', 'ótica', 'nasal', 'rectal', 'vaginal'],
      frecuencias : ['cada 8 horas', 'cada 12 horas', 'cada 24 horas', 'cada 48 horas', 'cada 72 horas', 'cada 96 horas', 'cada 120 horas', 'cada 144 horas', 'cada 168 horas'],
      duraciones : ['3 dias', '5 dias', '7 dias', '10 dias', '14 dias', '21 dias', '28 dias', '30 dias', '60 dias', '90 dias', '120 dias', '180 dias', '240 dias', '365 dias'],
    };
  },
  mounted() {
    this.productosGet();
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "es-ES"; // Idioma español
      this.recognition.interimResults = false;
      this.recognition.continuous = false;

      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (this.activeField) {
          this.antecedente[this.activeField] += text; // Agrega texto al campo activo
        }
      };

      this.recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error);
      };
    } else {
      console.error("El reconocimiento de voz no está soportado en este navegador");
    }
  },
  methods: {
    addProducto(producto) {
      this.productosRecetas.push({
        producto_id: producto.id,
        cantidad: 1,
        unidad: 'capsulas',
        via: "oral",
        frecuencia: "cada 8 horas",
        duracion: "3 dias",
        indicaciones: "Tomar con agua",
        producto,
      });
    },
    productosGet() {
      this.$store.loading = true;
      this.$axios.get("productos",{
        params: {
          search: this.productosSearch,
        },
      }).then((res) => {
        this.productos = res.data.data;
        this.$store.loading = false;
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    submitReceta() {
      this.$store.loading = true;
      this.$axios.post("antecedentes_familiares",{
        ...this.antecedente,
        paciente_id: this.paciente.id,
      }).then((res) => {
        this.antecedenteDialog = false;
        this.$store.loading = false;
        this.$emit("pacienteGet");
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    addReceta() {
      this.antecedente = {
        tuberculosis: false,
        diabetes: false,
        hipertension: false,
        cardiopatia: false,
        neumopatia: false,
        hepatopatia: false,
        nefropatia: false,
        endocrinopatia: false,
        epilepsia: false,
        asma: false,
        enfermedades_hematologicas: false,
        neoplasias: false,
        enfermedades_congenitas: false,
        enfermedades_mentales: false,
        vih: false,
        violencia: false,
        otros: "",
        observaciones: "",
        parentesco: "",
      };
      this.antecedenteDialog = true;
    },
    printReceta(antecedente) {
      const pdfUrl = `${this.$url}/../antecedente_medicos/${antecedente.id}/pdf`;
      window.open(pdfUrl, '_blank'); // Abre el archivo PDF en una nueva pestaña
    },
    startRecognition(field) {
      if (this.recognition) {
        this.activeField = field; // Guarda el campo activo
        this.recognition.start(); // Inicia el reconocimiento de voz
      } else {
        this.$q.notify({
          color: "negative",
          message: "El reconocimiento de voz no está soportado en este navegador",
        });
      }
    },
  },
};
</script>
