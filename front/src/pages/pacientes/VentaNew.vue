<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Ventas</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="submitReceta">
          <div class="row">
            <div class="col-12 col-md-7 q-pa-xs">
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
                  <th>Precio</th>
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
                  <td class="cursor-pointer">
                    <div style="max-width: 190px;overflow: hidden;text-overflow: ellipsis;line-height: 0.9;" class="text-right">
                      {{( producto.precio ) }} Bs
                    </div>
                  </td>
                </tr>
                </tbody>
              </q-markup-table>
              <pre>{{productos}}</pre>
            </div>
            <div class="col-12 col-md-5 q-pa-xs">
              <div class="text-right flex items-center">
                <q-btn icon="add_circle_outline" size="10px" @click="addProductoName" color="green" dense no-caps label="Recuperar receta" />
                <q-space />
                <q-btn icon="delete" size="10px" color="red" dense flat no-caps label="limpiar" @click="productosRecetas = []" />
              </div>
              <q-markup-table dense wrap-cells flat bordered>
                <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
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
                    <input v-model="producto.precio" type="number" style="width: 50px;" />
                  </td>
                  <td  class="text-right">
                    {{ (producto.cantidad * producto.precio) }} Bs
                  </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3" class="text-right">Total</td>
                  <td class="text-right text-bold">{{ productosRecetas.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0) }} Bs</td>
                </tr>
                </tfoot>
              </q-markup-table>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "RecetasTab",
  props: {
  },
  emits: ["pacienteGet"],
  data() {
    return {
      paciente: {},
      recetaDialog: false,
      receta: {
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
      unidades: ['', 'capsulas', 'comprimidos', 'pastillas', 'ml', 'mg', 'otro'],
      vias: ['', 'oral', 'intramuscular', 'intravenosa', 'subcutánea', 'tópica', 'oftálmica', 'ótica', 'nasal', 'rectal', 'vaginal'],
      frecuencias: ['', 'cada 8 horas', 'cada 12 horas', 'cada 24 horas', 'cada 48 horas', 'cada 72 horas', 'cada 96 horas', 'cada 120 horas', 'cada 144 horas', 'cada 168 horas'],
      duraciones: ['', '3 dias', '5 dias', '7 dias', '10 dias', '14 dias', '21 dias', '28 dias', '30 dias', '60 dias', '90 dias', '120 dias', '180 dias', '240 dias', '365 dias'],
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
          this.receta[this.activeField] += text; // Agrega texto al campo activo
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
    addProductoName() {
      this.$alert.dialogPrompt('Nombre del producto', {
        title: 'Agregar producto',
        cancel: true,
        persistent: true,
      }).onOk((nombre) => {
        this.productosRecetas.push({
          producto_id: null,
          cantidad: 1,
          unidad: 'capsulas',
          via: "oral",
          frecuencia: "cada 8 horas",
          duracion: "3 dias",
          indicaciones: "",
          producto: {
            nombre,
          },
        });
      });
    },
    addProducto(producto) {
      const find = this.productosRecetas.find((p) => p.producto_id === producto.id);
      if (find) {
        find.cantidad += 1;
        return;
      }
      this.productosRecetas.push({
        producto_id: producto.id,
        cantidad: 1,
        precio: producto.precio,
        producto,
      });
    },
    productosGet() {
      this.$store.loading = true;
      this.$axios.get("productos", {
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
      if (this.productosRecetas.length === 0) {
        this.$alert.error("Debe agregar al menos un producto a la receta");
        return;
      }
      this.$store.loading = true;
      this.$axios.post("recetas", {
        ...this.receta,
        paciente_id: this.paciente.id,
        productos: this.productosRecetas,
      }).then((res) => {
        this.recetaDialog = false;
        this.$store.loading = false;
        this.$emit("pacienteGet");
      }).catch((error) => {
        this.$store.loading = false;
        console.error(error);
      });
    },
    addReceta() {
      this.receta = {
        indicaciones: "",
        observaciones: "",
      };
      this.recetaDialog = true;
      this.productosRecetas = [];
    },
    sendWhatsapp(receta) {
      const pdfUrl = `${this.$url}/../receta/${receta.id}/pdf`;
      const url = `https://api.whatsapp.com/send?phone=${this.paciente.telefono}&text=Hola ${this.paciente.nombre}, aquí tienes tu receta: ${pdfUrl}`;
      window
        .open(url, "_blank")
        .focus(); // Abre la conversación de WhatsApp en una nueva pestaña
    },
    printReceta(receta) {
      const pdfUrl = `${this.$url}/../receta/${receta.id}/pdf`;
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
