<template>
  <div class="row items-center">
    <div class="text-h6">
      Factura
      <template v-if="paciente.facturas.length">
        <span class="text-caption">
          ({{ paciente.facturas.length }})
        </span>
        <span class="text-h5 text-bold">
          {{ paciente.facturas.filter(factura => factura.anulado === 0).reduce((total, factura) => total + parseFloat(factura.total), 0).toFixed(2) }} Bs.
        </span>
      </template>
    </div>
    <q-space />
    <q-btn-group flat>
      <q-btn icon="add_circle_outline" @click="addFactura" :loading="$store.loading" unelevated color="positive" label="Registrar factura" no-caps />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(factura, index) in paciente.facturas" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="factura.id" color="primary" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">Total: </span>
                <span>{{ factura.total }}</span>
                <span class="text-bold"> Bs.</span>
              </div>
              <div>
                <span class="text-bold">Tipo: </span>
                <span>{{ factura.tipo }}</span>
              </div>
              <div>
                <span class="text-bold">Observacion: </span>
                <span>{{ factura.observacion }}</span>
              </div>
<!--              <pre>-->
<!--                {{factura}}-->
<!--              </pre>-->
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ factura.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ factura.user?.name }}</span>
            <q-btn icon="warning" @click="anularFactura(factura)" color="negative" size="10px" label="Anular" no-caps
                   v-if="factura.anulado === 0" :loading="$store.loading" />
            <div v-else>
              <q-chip color="red" text-color="white" label="Anulado" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <q-dialog v-model="dialogFactura" persistent>
    <q-card flat bordered style="width: 600px;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Factura</div>
        <q-space />
        <q-btn icon="close" flat @click="dialogFactura = false" />
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitFactura">
          <div class="row">
<!--            <div class="col-12 col-md-6">-->
<!--              <q-select v-model="factura.tipo" label="Tipo de factura" dense outlined :options="optionTipo" />-->
<!--            </div>-->
            <div class="col-12 col-md-12">
              <q-input v-model="factura.total" label="Total" dense outlined type="number" step="0.01"
                       :rules="[val => !!val || 'El total es requerido']" />
            </div>
            <div class="col-12 col-md-12">
              <q-input v-model="factura.observacion" label="Observación" dense outlined />
            </div>
          </div>
          <q-card-actions align="right">
            <q-btn label="Cancelar" color="negative" @click="dialogFactura = false" :loading="$store.loading" />
            <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "FacturasTab",
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  emits: ["pacienteGet"],
  data() {
    return {
      dialogFactura: false,
      factura: {
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
          this.factura[this.activeField] += text; // Agrega texto al campo activo
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
    submitFactura() {
      this.$store.loading = true;
      this.$axios.post("facturas", {
        paciente_id: this.paciente.id,
        ...this.factura,
      }).then((res) => {
        this.$emit("pacienteGet");
        this.$alert.success("Factura registrado correctamente");
        this.dialogFactura = false;
      }).catch((error) => {
        this.$alert.error(error.response.data.message);
      }).finally(() => {
        this.$store.loading = false;
      });
    },
    anularFactura(factura) {
      this.$alert.dialog("¿Está seguro de quitar la factura?").onOk(() => {
        this.$store.loading = true;
        this.$axios.put("facturas/" + factura.id,{
          anulado: 1,
        }).then((res) => {
          this.$emit("pacienteGet");
          this.$alert.success("Factura anulado correctamente");
        }).catch((error) => {
          this.$alert.error(error.response.data.message);
        }).finally(() => {
          this.$store.loading = false;
        });
      });
    },
    addFactura() {
      this.dialogFactura = true;
      this.factura = {
        observacion: "",
        tipo: "",
        total: "",
      };
    },
    printFactura(factura) {
      const pdfUrl = `${this.$url}/../factura_medicos/${factura.id}/pdf`;
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
