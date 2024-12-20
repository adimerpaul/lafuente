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
<!--      "antecedentes_familiares": [-->
<!--      {-->
<!--      "id": 1,-->
<!--      "paciente_id": 1,-->
<!--      "user_id": 9,-->
<!--      "tuberculosis": 0,-->
<!--      "diabetes": 0,-->
<!--      "hipertension": 0,-->
<!--      "cardiopatia": 1,-->
<!--      "neumopatia": 0,-->
<!--      "hepatopatia": 1,-->
<!--      "nefropatia": 1,-->
<!--      "endocrinopatia": 0,-->
<!--      "epilepsia": 1,-->
<!--      "asma": 1,-->
<!--      "enfermedades_hematologicas": 1,-->
<!--      "neoplasias": 0,-->
<!--      "enfermedades_congenitas": 1,-->
<!--      "enfermedades_mentales": 1,-->
<!--      "vih": 0,-->
<!--      "violencia": 1,-->
<!--      "otros": "Blanditiis minima eveniet officiis repudiandae saepe maxime consequatur fugit. Voluptatem omnis dolores reiciendis aperiam iure labore totam. Est enim non ratione nesciunt laboriosam.",-->
<!--      "observaciones": "Dolores in minus veritatis optio vitae ratione. Vel earum id quod illo nesciunt aliquid. Nemo nisi ex et eius cum aut ut odio. Ipsam quae quas dolor rerum quia et est.",-->
<!--      "parentesco": "Asperiores quae maxime atque doloribus quidem. Aspernatur et hic explicabo suscipit optio rerum. In ut animi porro. Fugit numquam possimus consequuntur officia fugit nam officia.",-->
<!--      "fecha": "2024-12-20 06:44:20",-->
<!--      "user": {-->
<!--      "id": 9,-->
<!--      "name": "Marta Luevano",-->
<!--      "username": "cantu.diana",-->
<!--      "email": "martin14@example.net",-->
<!--      "role": "Doctor",-->
<!--      "color": "orange"-->
<!--      }-->
<!--      }-->
<!--      ],-->
    </div>
  </div>
  <q-dialog v-model="antecedenteDialog" persistent>
    <q-card flat bordered style="width: 600px;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Receta Vital</div>
        <q-space />
        <q-btn icon="close" flat @click="antecedenteDialog = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitReceta">
<!--          <q-input v-model="antecedente.estado_general" outlined clearable label="Estado general" hint="">-->
<!--            <template v-slot:append>-->
<!--              <q-btn flat round dense icon="mic" @click="startRecognition('estado_general')" />-->
<!--            </template>-->
<!--          </q-input>-->
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
      activeField: null, // Campo activo para reconocimiento de voz
    };
  },
  mounted() {
    // Inicializar reconocimiento de voz
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "es-ES"; // Idioma español
      this.recognition.interimResults = false;
      this.recognition.continuous = false;

      // Manejo de resultado de voz
      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        if (this.activeField) {
          this.antecedente[this.activeField] += text; // Agrega texto al campo activo
        }
      };

      // Manejo de errores
      this.recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error);
      };
    } else {
      console.error("El reconocimiento de voz no está soportado en este navegador");
    }
  },
  methods: {
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
