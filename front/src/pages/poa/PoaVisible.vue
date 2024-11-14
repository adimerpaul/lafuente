<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-3">
            <span class="text-bold">Area: </span>
            <span>{{poa.area?.nombre}}</span>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-bold">Periodo: </span>
            <span>{{poa.periodo?.periodo}}</span>
          </div>
          <div class="col-6 col-md-3">
            <span class="text-bold">Estado: </span>
            <q-chip :color="poa.estado === 'Abierto' ? 'positive' : 'negative'" dense text-color="white">
              {{poa.estado}}
            </q-chip>
          </div>
          <div class="col-12 col-md-3">
            <span class="text-bold">Fecha: </span>
            <span>{{poa.fecha}}</span>
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="buscar" label="Buscar" dense outlined>
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-markup-table dense flat bordered wrap-cells>
              <thead class="bg-primary text-white">
              <tr>
                <th>Material</th>
                <th>Partida</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Opcion</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="material in materialsFiltered" :key="material.id">
                <td>
                  <div style="width: 150px; line-height: 1; word-wrap: break-word; white-space: normal;">
                    {{ material.descripcion }}
                  </div>
                </td>
                <td>{{material.partida}}</td>
                <td>{{material.unidad}}</td>
                <td>{{material.cantidad}}</td>
                <td>{{material.precio}}</td>
                <td>
<!--                  btn agragar-->
                  <q-btn @click="materialAdd(material)" color="positive" dense icon="add" size="10px" :loading="loading" />
                </td>
              </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-right">
              <q-btn color="primary" label="Imprimir"  icon="print" no-caps @click="imprimir" />
            </div>
<!--            <pre>{{poa}}</pre>-->
            <q-markup-table dense flat bordered wrap-cells>
              <thead class="bg-primary text-white">
              <tr>
                <th>Material</th>
                <th>Partida</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th>Opcion</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="detalle in poa.detalles" :key="detalle.id">
                <td>
                  <div style="width: 150px; line-height: 1; word-wrap: break-word; white-space: normal;">
                    {{ detalle.material.descripcion }}
                  </div>
                </td>
                <td>{{detalle.material.partida}}</td>
                <td>{{detalle.material.unidad}}</td>
                <td>
<!--                  {{detalle.cantidad}}-->
                  <q-input v-model="detalle.cantidad" dense outlined type="number" min="1" @update:modelValue="updateCantidad(detalle)" :debounce="500" />
                </td>
                <td>{{detalle.material.precio}}</td>
                <td>{{(detalle.cantidad * detalle.material.precio).toFixed(2)}}</td>
                <td>
                  <q-btn color="negative" dense icon="delete" size="10px" @click="materialDelete(detalle)" :loading="loading" />
                </td>
              </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
<!--    <pre>{{materials}}</pre>-->
<!--    {-->
<!--    "id": 2,-->
<!--    "area_id": 1,-->
<!--    "periodo_id": 1,-->
<!--    "user_id": 1,-->
<!--    "fecha": "2024-11-07 04:21:52",-->
<!--    "estado": "Abierto",-->
<!--    "area": {-->
<!--    "id": 1,-->
<!--    "nombre": "Unidad de Asuntos Administrativos"-->
<!--    },-->
<!--    "periodo": {-->
<!--    "id": 1,-->
<!--    "periodo": 2024,-->
<!--    "fecha_inicio": "2024-01-01",-->
<!--    "fecha_fin": "2024-05-05",-->
<!--    "estado": "Finalizado"-->
<!--    },-->
<!--    "user": {-->
<!--    "id": 1,-->
<!--    "name": "Adminsitrador",-->
<!--    "username": "admin",-->
<!--    "role": "Jefatura",-->
<!--    "cargo": "Empleado",-->
<!--    "email": null,-->
<!--    "area_id": 1-->
<!--    },-->
<!--    "detalles": []-->
<!--    }-->
  </q-page>
</template>
<script>
export default {
  name: 'PoaVisible',
  data() {
    return {
      poa_id: this.$route.params.id,
      poa: {},
      materials: [],
      buscar: '',
      loading: false
    }
  },
  mounted() {
    this.poaGet()
    this.materialsGet()
  },
  methods: {
    imprimir() {
      const url = `poaPrint/${this.poa_id}`
      window.open(this.$url+url, '_blank')
    },
    materialDelete(detalle) {
      this.$axios.delete(`materialDelete/${detalle.id}`).then(res => {
        this.$alert.success('Material eliminado')
        this.poa.detalles = this.poa.detalles.filter(item => item.id !== detalle.id)
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
    updateCantidad(detalle) {
      this.$axios.put(`materialUpdate/${detalle.id}`, {
        cantidad: detalle.cantidad
      }).then(res => {
        this.$alert.success('Cantidad actualizada')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
    materialAdd(material) {
      // verificar si existe el material en el poa
      if (this.poa.detalles.find(detalle => detalle.material_id === material.id)) {
        this.$alert.error('Material ya agregado')
        return false
      }
      this.loading = true
      this.$axios.post(`materialAdd`, {
        material_id: material.id,
        poa_id: this.poa_id,
        cantidad: 1
      }).then(res => {
        this.$alert.success('Material agregado')
        this.poa.detalles.push(res.data)
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    materialsGet() {
      this.$axios.get(`materials`).then(res => {
        this.materials = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
    poaGet() {
      this.$axios.get(`poas/${this.poa_id}`).then(res => {
        this.poa = res.data
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      })
    },
  },
  computed: {
    materialsFiltered() {
      return this.materials.filter(material => {
        return material.descripcion.toLowerCase().includes(this.buscar.toLowerCase()) ||
          material.partida.toString().toLowerCase().includes(this.buscar.toLowerCase());
      });
    }
  }
}
</script>
