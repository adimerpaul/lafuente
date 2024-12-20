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
        <q-item v-for="(receta, index) in paciente.recetas" :key="index">
          <q-item-section avatar>
            <q-avatar >
              <q-btn :label="index + 1" flat />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div>
                <span class="text-bold">indicaciones: </span>
                <span>{{ receta.indicaciones }}</span>
              </div>
              <div>
                <span class="text-bold">Observaciones: </span>
                <span>{{ receta.observaciones }}</span>
              </div>
              <div>
                <span class="text-bold">Detalle: </span>
                <span>{{ receta.detalleText }}</span>
              </div>
            </q-item-label>
            <q-item-label caption>
              <div>
                <span class="text-bold">Fecha de creación: </span>
                <span>{{ receta.fecha }}</span>
              </div>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <span class="text-bold">{{ receta.user?.name }}</span>
            <q-btn-group flat >
            <q-btn icon="print" flat dense @click="printReceta(receta)" />
            <q-btn icon="fa-brands fa-whatsapp" flat color="green" @click="sendWhatsapp(receta)" />
            </q-btn-group>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
  <q-dialog v-model="recetaDialog" persistent>
    <q-card flat bordered style="width: 80%;max-width: 100%">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Receta Vital</div>
        <q-space />
        <q-btn icon="close" flat @click="recetaDialog = false" />
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
            </div>
            <div class="col-12 col-md-8 q-pa-xs">
              <div class="text-right">
                <q-btn icon="add_circle_outline" @click="addProductoName" color="green" dense no-caps label="Agregar producto" />
              </div>
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
            <div class="col-12">
              <q-input v-model="receta.indicaciones" dense outlined clearable label="Indicaciones" hint="">
                <template v-slot:append>
                  <q-btn flat round dense icon="mic" @click="startRecognition('indicaciones')" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input v-model="receta.observaciones" dense outlined clearable label="Observaciones" hint="" >
                <template v-slot:append>
                  <q-btn flat round dense icon="mic" @click="startRecognition('observaciones')" />
                </template>
              </q-input>
            </div>
          </div>
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="negative" @click="recetaDialog = false" :loading="$store.loading" />
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
      unidades : ['','capsulas', 'comprimidos', 'pastillas', 'ml', 'mg', 'otro'],
      vias : ['','oral', 'intramuscular', 'intravenosa', 'subcutánea', 'tópica', 'oftálmica', 'ótica', 'nasal', 'rectal', 'vaginal'],
      frecuencias : ['','cada 8 horas', 'cada 12 horas', 'cada 24 horas', 'cada 48 horas', 'cada 72 horas', 'cada 96 horas', 'cada 120 horas', 'cada 144 horas', 'cada 168 horas'],
      duraciones : ['','3 dias', '5 dias', '7 dias', '10 dias', '14 dias', '21 dias', '28 dias', '30 dias', '60 dias', '90 dias', '120 dias', '180 dias', '240 dias', '365 dias'],
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
      this.productosRecetas.push({
        producto_id: producto.id,
        cantidad: 1,
        unidad: 'capsulas',
        via: "oral",
        frecuencia: "cada 8 horas",
        duracion: "3 dias",
        indicaciones: "",
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
      if (this.productosRecetas.length === 0) {
        this.$alert.error("Debe agregar al menos un producto a la receta");
        return;
      }
      this.$store.loading = true;
      this.$axios.post("recetas",{
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
