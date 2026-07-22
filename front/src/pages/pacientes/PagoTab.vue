<template>
  <div class="row items-center">
    <div class="text-h6">
      Pago
      <template v-if="paciente.pagos.length">
        <span class="text-caption">
          ({{ paciente.pagos.length }})
        </span>
        <span class="text-h5 text-bold">
          {{ paciente.pagos.filter(pago => pago.anulado === 0).reduce((total, pago) => total + parseFloat(pago.total), 0).toFixed(2) }} Bs.
        </span>
      </template>
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addPago" :loading="$store.loading" unelevated color="positive" label="Registrar pago" no-caps />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(pago, index) in paciente.pagos" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="pago.id" color="primary" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">Total: </span>
                <span>{{ pago.total }}</span>
                <span class="text-bold"> Bs.</span>
              </div>
              <div>
                <span class="text-bold">Tipo: </span>
                <span>{{ pago.tipo }}</span>
              </div>
              <div>
                <span class="text-bold">Observacion: </span>
                <span>{{ pago.observacion }}</span>
              </div>
<!--              <pre>-->
<!--                {{pago}}-->
<!--              </pre>-->
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ pago.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ pago.user?.name }}</span>
            <q-btn icon="warning" @click="anularPago(pago)" color="negative" size="10px" label="Anular" no-caps
                   v-if="pago.anulado === 0" :loading="$store.loading" />
            <div v-else>
              <q-chip color="red" text-color="white" label="Anulado" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <q-dialog v-model="dialogPago" persistent>
    <q-card flat bordered style="width: 600px;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pago</div>
        <q-space />
        <q-btn icon="close" flat @click="dialogPago = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitPago">
          <div class="row">
<!--            <div class="col-12 col-md-6">-->
<!--              <q-select v-model="pago.tipo" label="Tipo de pago" dense outlined :options="optionTipo" />-->
<!--            </div>-->
            <div class="col-12 col-md-12">
              <q-input v-model="pago.total" label="Total" dense outlined type="number" step="0.01"
                       :rules="[val => !!val || 'El total es requerido']" />
            </div>
            <div class="col-12 col-md-12">
              <q-input v-model="pago.observacion" label="Observación" dense outlined />
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="negative" @click="dialogPago = false" :loading="$store.loading" />
            <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "PagosTab",
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  emits: ["pacienteGet"],
  data() {
    return {
      dialogPago: false,
      pago: {
        observacion: "",
        tipo: "",
        total: "",
      },
      optionTipo: ['Consulta', 'Examen', 'Tratamiento'],
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
          this.pago[this.activeField] += text; // Agrega texto al campo activo
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
    submitPago() {
      this.$store.loading = true;
      this.$axios.post("pagos", {
        paciente_id: this.paciente.id,
        ...this.pago,
      }).then((res) => {
        this.$emit("pacienteGet");
        this.$alert.success("Pago registrado correctamente");
        this.dialogPago = false;
      }).catch((error) => {
        this.$alert.error(error.response.data.message);
      }).finally(() => {
        this.$store.loading = false;
      });
    },
    anularPago(pago) {
      this.$alert.dialog("¿Está seguro de quitar la pago?").onOk(() => {
        this.$store.loading = true;
        this.$axios.put("pagos/" + pago.id,{
          anulado: 1,
        }).then((res) => {
          this.$emit("pacienteGet");
          this.$alert.success("Pago anulado correctamente");
        }).catch((error) => {
          this.$alert.error(error.response.data.message);
        }).finally(() => {
          this.$store.loading = false;
        });
      });
    },
    addPago() {
      this.dialogPago = true;
      this.pago = {
        observacion: "",
        tipo: "",
        total: "",
      };
    },
    printPago(pago) {
      const pdfUrl = `${this.$url}/../pago_medicos/${pago.id}/pdf`;
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
