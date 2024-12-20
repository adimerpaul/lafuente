<template>
  <div class="row items-center">
    <div class="text-h6">
      Signo vitales
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addHistorial" :loading="$store.loading" />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(signo, index) in paciente.signos_vitales" :key="index">
          <q-item-section avatar>
            <q-avatar>
              <q-btn :label="index + 1" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">Referido de: </span>
                <span>{{ signo.referido_de }}</span>
              </div>
              <div>
                <span class="text-bold">Motivo de consulta: </span>
                <span>{{ signo.motivo_consulta }}</span>
              </div>
              <div>
                <span class="text-bold">Enfermedad actual: </span>
                <span>{{ signo.enfermedad_actual }}</span>
              </div>
              <div>
                <span class="text-bold">Alergias conocidas: </span>
                <span>{{ signo.alergias_conocidas }}</span>
              </div>
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ signo.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ historial.user?.name }}</span>
            <q-btn icon="print" flat @click="printHistorial(historial)" />
          </q-item-section>
        </q-item>
      </q-list>
<!--      "signos_vitales": [-->
<!--      {-->
<!--      "id": 1,-->
<!--      "paciente_id": 1,-->
<!--      "estado_general": "Enim distinctio molestiae quo qui vitae nam blanditiis.",-->
<!--      "fc": 90,-->
<!--      "fr": 16,-->
<!--      "pa": 95,-->
<!--      "temperatura": "35.03",-->
<!--      "peso": "119.78",-->
<!--      "talla": "2.09",-->
<!--      "imc": "16.57",-->
<!--      "spo2": 93,-->
<!--      "glasgow": 5-->
<!--      }-->
<!--      ],-->
    </div>
  </div>
  <q-dialog v-model="historialDialog" persistent>
    <q-card flat bordered style="min-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Historial médico</div>
        <q-space />
        <q-btn icon="close" flat @click="historialDialog = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitHistorial">
        <q-input v-model="historial.referido_de" filled clearable label="Referido de" hint="">
          <template v-slot:append>
            <q-btn flat round dense icon="mic" @click="startRecognition('referido_de')" />
          </template>
        </q-input>
        <q-input v-model="historial.motivo_consulta" filled clearable type="textarea" label="Motivo de consulta" hint="">
          <template v-slot:append>
            <q-btn flat round dense icon="mic" @click="startRecognition('motivo_consulta')" />
          </template>
        </q-input>
        <q-input v-model="historial.enfermedad_actual" filled clearable type="textarea" label="Enfermedad actual" hint="">
          <template v-slot:append>
            <q-btn flat round dense icon="mic" @click="startRecognition('enfermedad_actual')" />
          </template>
        </q-input>
        <q-input v-model="historial.alergias_conocidas" filled clearable type="textarea" label="Alergias conocidas" hint="">
          <template v-slot:append>
            <q-btn flat round dense icon="mic" @click="startRecognition('alergias_conocidas')" />
          </template>
        </q-input>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="historialDialog = false" />
          <q-btn label="Guardar" color="primary" type="submit" />
        </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "SignosTab",
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  emits: ["pacienteGet"],
  data() {
    return {
      historialDialog: false,
      historial: {
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
          this.historial[this.activeField] += text; // Agrega texto al campo activo
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
    submitHistorial() {
      this.$store.loading = true;
      this.$axios.post("historial_medicos",{
        ...this.historial,
        paciente_id: this.paciente.id,
      }).then((res) => {
        this.historialDialog = false;
        this.$store.loading = false;
        this.$emit("pacienteGet");
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    addHistorial() {
      this.historial = {
        referido_de: "",
        motivo_consulta: "",
        enfermedad_actual: "",
        alergias_conocidas: "",
      };
      this.historialDialog = true;
    },
    printHistorial(historial) {
      const pdfUrl = `${this.$url}/../historial_medicos/${historial.id}/pdf`;
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
