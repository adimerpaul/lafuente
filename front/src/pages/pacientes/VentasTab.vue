<template>
  <div class="row items-center">
    <div class="text-h6">
      Ventas
      <template v-if="paciente.paciente_ventas.length">
        <span class="text-caption">
          ({{ paciente.paciente_ventas.length }})
        </span>
        <span class="text-h5 text-bold">
          {{ paciente.paciente_ventas.reduce((total, venta) => total + parseFloat(venta.venta.total), 0) }} Bs.
        </span>
      </template>
    </div>
    <q-space />
    <q-btn-group flat>
<!--      <q-btn icon="add_circle_outline" @click="addVenta" :loading="$store.loading" />-->
      <q-btn icon="add_circle_outline" @click="addVenta" :loading="$store.loading" unelevated color="positive" label="Vincular venta" no-caps />
    </q-btn-group>
  </div>
  <div class="row">
    <div class="col-12">
      <q-list bordered>
        <q-item v-for="(venta, index) in paciente.paciente_ventas" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="venta.id" color="primary" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
<!--              <div>-->
<!--                <span class="text-bold">Venta: </span>-->
<!--                <span>{{ venta.venta.nombre }}</span>-->
<!--              </div>-->
              <div>
                <span class="text-bold">Total: </span>
                <span>{{ venta.venta.total }}</span>
                <span class="text-bold"> Bs.</span>
              </div>
              <div>
                <span class="text-bold">Tipo de venta: </span>
                <span>{{ venta.venta.tipo_venta }}</span>
              </div>
<!--              <div>-->
<!--                <span class="text-bold">Tipo de comprobante: </span>-->
<!--                <span>{{ venta.venta.tipo_comprobante }}</span>-->
<!--              </div>-->
<!--              <div>-->
<!--                <span class="text-bold">Tipo de pago: </span>-->
<!--                <span>{{ venta.venta.tipo_pago }}</span>-->
<!--              </div>-->
              <div>
                <span class="text-bold">Productos: </span>
                <span>{{ venta.venta.detailsText }}</span>
              </div>
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ venta.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ venta.user?.name }}</span>
            <q-btn icon="delete" color="negative" @click="deleteVenta(venta)" size="10px" no-caps label="Quitar" :loading="$store.loading" />
<!--            <pre>{{venta}}</pre>-->
            <q-toggle v-model="venta.venta.pagado_interno" label="Pagado Interno" color="positive"
                      :trueValue="1" :falseValue="0" @update:modelValue="updateVenta(venta)" :loading="$store.loading"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
<!--    <pre>-->
<!--      {{ paciente.paciente_ventas }}-->
<!--    </pre>-->
<!--    "paciente_ventas": [-->
<!--    {-->
<!--    "id": 1,-->
<!--    "paciente_id": 247,-->
<!--    "venta_id": 1,-->
<!--    "user_id": 1,-->
<!--    "fecha": "2025-02-11 05:24:37",-->
<!--    "hora": "05:24",-->
<!--    "nombre_completo": "Administrador",-->
<!--    "user": {-->
<!--    "id": 1,-->
<!--    "name": "Administrador",-->
<!--    "username": "admin",-->
<!--    "email": "admin@test.com",-->
<!--    "role": "Administrador",-->
<!--    "color": "red"-->
<!--    },-->
<!--    "venta": {-->
<!--    "id": 1,-->
<!--    "user_id": 1,-->
<!--    "cliente_id": 1,-->
<!--    "fecha": "2025-02-11",-->
<!--    "hora": null,-->
<!--    "tipo_venta": "Interno",-->
<!--    "ci": "0",-->
<!--    "nombre": "SN",-->
<!--    "estado": "Activo",-->
<!--    "tipo_comprobante": "Venta",-->
<!--    "total": "57.00",-->
<!--    "tipo_pago": "Efectivo",-->
<!--    "detailsText": "1 4 DERM X 20 GR,1 ABIRATRAL 250 MG. COMPRIMIDOS",-->
<!--    "venta_detalles": [-->
<!--    {-->
<!--    "id": 1,-->
<!--    "venta_id": 1,-->
<!--    "producto_id": 4454,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 56,-->
<!--    "producto": {-->
<!--    "id": 4454,-->
<!--    "nombre": "4 DERM X 20 GR",-->
<!--    "descripcion": "Antimicótico y antiinflamatorio",-->
<!--    "unidad": "TUBOS",-->
<!--    "precio": 56,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    },-->
<!--    {-->
<!--    "id": 2,-->
<!--    "venta_id": 1,-->
<!--    "producto_id": 3410,-->
<!--    "cantidad": 1,-->
<!--    "unidad": null,-->
<!--    "precio": 1,-->
<!--    "producto": {-->
<!--    "id": 3410,-->
<!--    "nombre": "ABIRATRAL 250 MG. COMPRIMIDOS",-->
<!--    "descripcion": "Antineoplásico",-->
<!--    "unidad": "COMPRIMIDOS",-->
<!--    "precio": 1,-->
<!--    "stock": null,-->
<!--    "stock_minimo": null,-->
<!--    "stock_maximo": null-->
<!--    }-->
<!--    }-->
<!--    ]-->
<!--    }-->
<!--    },-->
  </div>
<!--  <q-dialog v-model="diagnosticoDialog" persistent>-->
<!--    <q-card flat bordered style="width: 600px;max-width: 100%">-->
<!--      <q-card-section class="row items-center q-pb-none">-->
<!--        <div class="text-h6">Venta</div>-->
<!--        <q-space />-->
<!--        <q-btn icon="close" flat @click="diagnosticoDialog = false" />-->
<!--      </q-card-section>-->
<!--      <q-card-section>-->
<!--        <q-form @submit="submitVenta">-->
<!--          <div class="row">-->
<!--            <div class="col-12 col-md-12">-->
<!--            </div>-->
<!--          </div>-->
<!--          <q-card-actions align="right">-->
<!--            <q-btn label="Cancelar" color="negative" @click="diagnosticoDialog = false" :loading="$store.loading" />-->
<!--            <q-btn label="Guardar" color="primary" type="submit" :loading="$store.loading" />-->
<!--          </q-card-actions>-->
<!--        </q-form>-->
<!--      </q-card-section>-->
<!--    </q-card>-->
<!--  </q-dialog>-->
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
    updateVenta(venta) {
      this.$store.loading = true;
      this.$axios.put("paciente_ventas/" + venta.id, {
        pagado_interno: venta.venta.pagado_interno,
      }).then((res) => {
        this.$emit("pacienteGet");
        this.$alert.success("Venta actualizada correctamente");
      }).catch((error) => {
        this.$alert.error(error.response.data.message);
      }).finally(() => {
        this.$store.loading = false;
      });
    },
    deleteVenta(venta) {
      this.$alert.dialog("¿Está seguro de quitar la venta?").onOk(() => {
        this.$store.loading = true;
        this.$axios.delete("paciente_ventas/" + venta.id).then((res) => {
          this.$emit("pacienteGet");
          this.$alert.success("Venta quitada correctamente");
        }).catch((error) => {
          this.$alert.error(error.response.data.message);
        }).finally(() => {
          this.$store.loading = false;
        });
      });
    },
    // submitVenta() {
    //   this.$store.loading = true;
    //   this.$axios.post("diagnosticos", {
    //     ...this.diagnostico,
    //     paciente_id: this.paciente.id,
    //   }).then((res) => {
    //     this.diagnosticoDialog = false;
    //     this.$store.loading = false;
    //     this.$emit("pacienteGet");
    //   }).catch((error) => {
    //     this.$store.loading = false;
    //     console.error(error);
    //   });
    // },
    addVenta() {
      // this.diagnostico = {
      //   diagnostico: "",
      //   tratamiento: "",
      // };
      // this.diagnosticoDialog = true;
      this.$alert.dialogPrompt('Ingrese Id venta').onOk((id) => {
        this.$store.loading = true;
        this.$axios.post("paciente_ventas", {
          venta_id: id,
          paciente_id: this.paciente.id,
        }).then((res) => {
          this.$emit("pacienteGet");
          this.$alert.success("Venta vinculada correctamente");
        }).catch((error) => {
          this.$alert.error(error.response.data.message);
        }).finally(() => {
          this.$store.loading = false;
        });
      });
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
