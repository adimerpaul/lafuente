<template>
  <div class="row items-center">
    <div class="text-h6">
      Habitos personales
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addHabito" :loading="$store.loading" />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(abitos, index) in paciente.habitos_personales" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="index + 1" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">Fuma: </span>
                <span>
                  <q-chip :label="abitos.fuma ? 'Sí' : 'No'"
                          :color="abitos.fuma ? 'positive' : 'negative'"
                          text-color="white" dense  size="10px"/>
                </span>
                <span class="text-bold">Alcohol: </span>
                <span>
                  <q-chip :label="abitos.alcohol ? 'Sí' : 'No'"
                          :color="abitos.alcohol ? 'positive' : 'negative'"
                          text-color="white" dense  size="10px"/>
                </span>
                <span class="text-bold">Drogas: </span>
                <span>
                  <q-chip :label="abitos.drogas ? 'Sí' : 'No'"
                          :color="abitos.drogas ? 'positive' : 'negative'"
                          text-color="white" dense  size="10px"/>
                </span>
                <span class="text-bold">Zoonosis: </span>
                <span>
                  <q-chip :label="abitos.zoonosis ? 'Sí' : 'No'"
                          :color="abitos.zoonosis ? 'positive' : 'negative'"
                          text-color="white" dense  size="10px"/>
                </span>
                <span class="text-bold">Deportes: </span>
                <span>
                  <q-chip :label="abitos.deportes ? 'Sí' : 'No'"
                          :color="abitos.deportes ? 'positive' : 'negative'"
                          text-color="white" dense  size="10px"/>
                </span>
                <span class="text-bold">Vacunas: </span>
                <span>
                  <q-chip :label="abitos.vacunas ? 'Sí' : 'No'"
                          :color="abitos.vacunas ? 'positive' : 'negative'"
                          text-color="white" dense  size="10px"/>
                </span>
              </div>
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ abitos.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ abitos.user?.name }}</span>
<!--            <q-btn icon="print" flat @click="printHabito(abitos)" />-->
          </q-item-section>
        </q-item>
      </q-list>
<!--      "habitos_personales": [-->
<!--      {-->
<!--      "id": 1,-->
<!--      "paciente_id": 1,-->
<!--      "user_id": 5,-->
<!--      "fuma": 1,-->
<!--      "alcohol": 1,-->
<!--      "drogas": 1,-->
<!--      "zoonosis": 0,-->
<!--      "deportes": 0,-->
<!--      "vacunas": 0,-->
<!--      "fecha": "2024-12-20 06:44:20",-->
<!--      "user": {-->
<!--      "id": 5,-->
<!--      "name": "Dr. Sonia Urrutia",-->
<!--      "username": "lguerra",-->
<!--      "email": "pagan.lidia@example.net",-->
<!--      "role": "Doctor",-->
<!--      "color": "orange"-->
<!--      }-->
<!--      }-->
<!--      ],-->
    </div>
  </div>
  <q-dialog v-model="abitosDialog" persistent>
    <q-card flat bordered style="width: 600px;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Habito personales</div>
        <q-space />
        <q-btn icon="close" flat @click="abitosDialog = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitHabito">
          <div class="row">
            <div class="col-12 col-md-6">
              <q-checkbox v-model="abitos.fuma" label="Fuma" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="abitos.alcohol" label="Alcohol" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="abitos.drogas" label="Drogas" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="abitos.zoonosis" label="Zoonosis" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="abitos.deportes" label="Deportes" />
            </div>
            <div class="col-12 col-md-6">
              <q-checkbox v-model="abitos.vacunas" label="Vacunas" />
            </div>
          </div>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="abitosDialog = false" :loading="$store.loading" />
          <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />
        </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "HabitosTab",
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  emits: ["pacienteGet"],
  data() {
    return {
      abitosDialog: false,
      abitos: {
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
          this.abitos[this.activeField] += text; // Agrega texto al campo activo
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
    submitHabito() {
      this.$store.loading = true;
      this.$axios.post("habitos_personales",{
        ...this.abitos,
        paciente_id: this.paciente.id,
      }).then((res) => {
        this.abitosDialog = false;
        this.$store.loading = false;
        this.$emit("pacienteGet");
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    addHabito() {
      this.abitos = {
        fuma: false,
        alcohol: false,
        drogas: false,
        zoonosis: false,
        deportes: false,
        vacunas: false,
      };
      this.abitosDialog = true;
    },
    printHabito(abitos) {
      const pdfUrl = `${this.$url}/../abitos_medicos/${abitos.id}/pdf`;
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
