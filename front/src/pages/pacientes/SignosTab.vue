<template>
  <div class="row items-center">
    <div class="text-h6">
      Signo vitales
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addSigno" :loading="$store.loading" />
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
                <span class="text-bold">Estado general: </span>
                <span>{{ signo.estado_general }}</span>
              </div>
              <div>
                <span class="text-bold">FC: </span>
                <span>{{ signo.fc }}</span>
              </div>
              <div>
                <span class="text-bold">FR: </span>
                <span>{{ signo.fr }}</span>
              </div>
              <div>
                <span class="text-bold">PA: </span>
                <span>{{ signo.pa }}</span>
              </div>
              <div>
                <span class="text-bold">Temperatura: </span>
                <span>{{ signo.temperatura }}</span>
              </div>
              <div>
                <span class="text-bold">Peso: </span>
                <span>{{ signo.peso }}</span>
              </div>
              <div>
                <span class="text-bold">Talla: </span>
                <span>{{ signo.talla }}</span>
              </div>
              <div>
                <span class="text-bold">IMC: </span>
                <span>{{ signo.imc }}</span>
              </div>
              <div>
                <span class="text-bold">SPO2: </span>
                <span>{{ signo.spo2 }}</span>
              </div>
              <div>
                <span class="text-bold">Glasgow: </span>
                <span>{{ signo.glasgow }}</span>
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
            <span class="text-bold">{{ signo.user?.name }}</span>
<!--            <q-btn icon="print" flat @click="printSigno(signo)" />-->
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
  <q-dialog v-model="signoDialog" persistent>
    <q-card flat bordered style="min-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Signo Vital</div>
        <q-space />
        <q-btn icon="close" flat @click="signoDialog = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitSigno">
          <q-input v-model="signo.estado_general" outlined clearable label="Estado general" hint="">
            <template v-slot:append>
              <q-btn flat round dense icon="mic" @click="startRecognition('estado_general')" />
            </template>
          </q-input>
          <div class="row">
            <div class="col-12 col-md-6">
              <q-input v-model="signo.fc" outlined clearable type="number" label="Frecuencia cardíaca" hint="">
<!--                <template v-slot:append>-->
<!--                  <q-btn flat round dense icon="mic" @click="startRecognition('fc')" />-->
<!--                </template>-->
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.fr" outlined clearable type="number" label="Frecuencia respiratoria" hint="">
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.pa" outlined clearable label="Presión arterial" hint="">
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.temperatura" outlined clearable type="number" label="Temperatura" hint="">
              </q-input>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.peso" outlined clearable type="number" label="Peso" hint=""/>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.talla" outlined clearable type="number" label="Talla" hint=""/>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.imc" outlined clearable type="number" label="IMC" hint=""/>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.spo2" outlined clearable type="number" label="SPO2" hint=""/>
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="signo.glasgow" outlined clearable type="number" label="Glasgow" hint=""/>
            </div>
          </div>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="signoDialog = false" :loading="$store.loading" />
          <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />
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
      signoDialog: false,
      signo: {
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
          this.signo[this.activeField] += text; // Agrega texto al campo activo
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
    submitSigno() {
      this.$store.loading = true;
      this.$axios.post("signos_vitales",{
        ...this.signo,
        paciente_id: this.paciente.id,
      }).then((res) => {
        this.signoDialog = false;
        this.$store.loading = false;
        this.$emit("pacienteGet");
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    addSigno() {
      this.signo = {
        estado_general: "",
        fc: '',
        fr: '',
        pa: '',
        temperatura: '',
        peso: '',
        talla: '',
        imc: '',
        spo2: '',
        glasgow: '',
      };
      this.signoDialog = true;
    },
    printSigno(signo) {
      const pdfUrl = `${this.$url}/../signo_medicos/${signo.id}/pdf`;
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
