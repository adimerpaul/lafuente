<template>
  <q-page class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="row items-center q-gutter-sm">
          <q-btn label="Nuevo Proveedor" color="primary" @click="nuevoProveedor" />
          <q-input v-model="filtro" label="Buscar proveedor" debounce="300" @update:model-value="filtrarProveedores" outlined dense>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <q-markup-table dense class="q-mt-sm">
          <thead>
          <tr>
            <th>Nombre</th>
            <th>CI</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="prov in proveedoresFiltrados" :key="prov.id">
            <td>{{ prov.nombre }}</td>
            <td>{{ prov.ci }}</td>
            <td>{{ prov.telefono }}</td>
            <td>{{ prov.direccion }}</td>
            <td>{{ prov.email }}</td>
            <td>
              <q-btn icon="edit" flat dense @click="editarProveedor(prov)" />
              <q-btn icon="delete" flat dense color="negative" @click="eliminarProveedor(prov.id)" />
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">{{ proveedor.id ? 'Editar' : 'Nuevo' }} Proveedor</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="guardarProveedor">
            <q-input v-model="proveedor.nombre" label="Nombre" outlined dense :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="proveedor.ci" label="CI" outlined dense />
            <q-input v-model="proveedor.telefono" label="Teléfono" outlined dense />
            <q-input v-model="proveedor.direccion" label="Dirección" outlined dense />
            <q-input v-model="proveedor.email" label="Email" outlined dense type="email" />
            <div class="text-right q-mt-sm">
              <q-btn label="Cancelar" flat @click="dialog = false" />
              <q-btn label="Guardar" color="primary" type="submit" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  name: 'ProveedoresPage',
  data() {
    return {
      proveedores: [],
      proveedoresFiltrados: [],
      proveedor: {},
      filtro: '',
      dialog: false
    };
  },
  mounted() {
    this.obtenerProveedores();
  },
  methods: {
    obtenerProveedores() {
      this.$axios.get('proveedores').then(res => {
        this.proveedores = res.data;
        this.filtrarProveedores();
      });
    },
    filtrarProveedores() {
      const f = this.filtro.toLowerCase();
      this.proveedoresFiltrados = this.proveedores.filter(p =>
        p.nombre.toLowerCase().includes(f) ||
        (p.email && p.email.toLowerCase().includes(f))
      );
    },
    nuevoProveedor() {
      this.proveedor = {};
      this.dialog = true;
    },
    editarProveedor(prov) {
      this.proveedor = { ...prov };
      this.dialog = true;
    },
    guardarProveedor() {
      const peticion = this.proveedor.id
        ? this.$axios.put(`proveedores/${this.proveedor.id}`, this.proveedor)
        : this.$axios.post('proveedores', this.proveedor);

      peticion.then(() => {
        this.dialog = false;
        this.obtenerProveedores();
        this.$alert.success('Proveedor guardado');
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error al guardar');
      });
    },
    eliminarProveedor(id) {
      this.$alert.dialog('¿Desea eliminar este proveedor?').onOk(() => {
        this.$axios.delete(`proveedores/${id}`).then(() => {
          this.obtenerProveedores();
          this.$alert.success('Proveedor eliminado');
        }).catch(err => {
          this.$alert.error(err.response?.data?.message || 'Error al eliminar');
        });
      });
    }
  }
};
</script>
