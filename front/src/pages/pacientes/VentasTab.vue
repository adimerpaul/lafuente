<template>
  <div class="row items-center">
    <div class="text-h6">
      Ventas
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addVenta" :loading="$store.loading" />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(diagnostico, index) in paciente.diagnosticos" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="index + 1" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">Venta: </span>
                <span>
                  {{ diagnostico.diagnostico }}
                </span>
              </div>
              <div>
                <span class="text-bold">Tratamiento: </span>
                <span>
                  {{ diagnostico.tratamiento }}
                </span>
              </div>
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ diagnostico.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ diagnostico.user?.name }}</span>
            <!--            <q-btn icon="print" flat @click="printVenta(diagnostico)" />-->
          </q-item-section>
        </q-item>
      </q-list>
      <!--      "diagnosticos": [-->
      <!--      {-->
      <!--      "id": 1,-->
      <!--      "paciente_id": 1,-->
      <!--      "user_id": 7,-->
      <!--      "diagnostico": "Voluptatem eligendi amet quidem ipsum. Deserunt fuga aut placeat. Animi ut quia quibusdam aut.",-->
      <!--      "tratamiento": "A suscipit cumque perferendis omnis quod blanditiis itaque. Qui ea sit quas maiores rerum. Nulla quia laboriosam eligendi corporis sit a officiis. Vel in accusamus quis ratione ea ducimus alias non.",-->
      <!--      "fecha": "1970-06-20 00:00:00",-->
      <!--      "user": {-->
      <!--      "id": 7,-->
      <!--      "name": "Dario Saiz",-->
      <!--      "username": "rosa.cervantez",-->
      <!--      "email": "pizarro.lucas@example.com",-->
      <!--      "role": "Doctor",-->
      <!--      "color": "orange"-->
      <!--      }-->
      <!--      }-->
      <!--      ]-->
    </div>
  </div>
  <q-dialog v-model="diagnosticoDialog" persistent>
    <q-card flat bordered style="width: 600px;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Venta</div>
        <q-space />
        <q-btn icon="close" flat @click="diagnosticoDialog = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitVenta">
          <div class="row">
            <div class="col-12 col-md-12">
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="negative" @click="diagnosticoDialog = false" :loading="$store.loading" />
            <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "VentasTab",
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  emits: ["pacienteGet"],
  data() {
    return {
      diagnosticoDialog: false,
      diagnostico: {
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
          this.diagnostico[this.activeField] += text; // Agrega texto al campo activo
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
    submitVenta() {
      this.$store.loading = true;
      this.$axios.post("diagnosticos", {
        ...this.diagnostico,
        paciente_id: this.paciente.id,
      }).then((res) => {
        this.diagnosticoDialog = false;
        this.$store.loading = false;
        this.$emit("pacienteGet");
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    addVenta() {
      this.diagnostico = {
        diagnostico: "",
        tratamiento: "",
      };
      this.diagnosticoDialog = true;
    },
    printVenta(diagnostico) {
      const pdfUrl = `${this.$url}/../diagnostico_medicos/${diagnostico.id}/pdf`;
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
