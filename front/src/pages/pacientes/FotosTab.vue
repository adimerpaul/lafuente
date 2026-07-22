<template>
  <div>
    <!-- Cabecera -->
    <div class="row items-center q-mb-md">
      <div class="text-h6">Fotos del paciente</div>
      <q-space />
      <div class="row q-gutter-sm">
        <q-btn
          color="primary"
          icon="photo_camera"
          label="Tomar foto"
          no-caps
          :loading="uploading"
          @click="abrirCamara"
        />
        <q-btn
          color="secondary"
          icon="upload"
          label="Subir imagen"
          no-caps
          :loading="uploading"
          @click="abrirGaleria"
        />
        <q-btn flat round icon="refresh" :loading="loading" @click="fetchFotos" />
      </div>
    </div>

    <!-- Input oculto para cámara -->
    <input
      ref="inputCamara"
      type="file"
      accept="image/*"
      capture="environment"
      style="display:none"
      @change="onFileSelected"
    />
    <!-- Input oculto para galería -->
    <input
      ref="inputGaleria"
      type="file"
      accept="image/*"
      style="display:none"
      @change="onFileSelected"
    />

    <q-inner-loading :showing="loading" />

    <!-- Sin fotos -->
    <div v-if="!loading && !fotos.length" class="text-center text-grey q-py-xl">
      <q-icon name="photo_library" size="64px" color="grey-4" />
      <div class="q-mt-sm text-subtitle2 text-grey-6">No hay fotos registradas</div>
    </div>

    <!-- Galería tipo tarjetas -->
    <div v-else class="row q-col-gutter-sm">
      <div
        v-for="foto in fotos"
        :key="foto.id"
        class="col-6 col-sm-4 col-md-3 col-lg-2"
      >
        <q-card flat bordered class="foto-card cursor-pointer" @click="verFoto(foto)">
          <q-img
            :src="fotoUrl(foto.archivo)"
            :ratio="1"
            fit="cover"
            class="foto-thumb"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="broken_image" size="32px" color="grey-6" />
              </div>
            </template>
          </q-img>
          <q-card-section class="q-pa-xs">
            <div class="text-caption text-grey-8 ellipsis">
              <q-icon name="person" size="xs" />
              {{ foto.user?.name || '-' }}
            </div>
            <div class="text-caption text-grey-6">
              <q-icon name="schedule" size="xs" />
              {{ formatFecha(foto.created_at) }}
            </div>
          </q-card-section>
          <q-card-actions class="q-pa-xs q-pt-none" align="right">
            <q-btn
              flat round dense
              icon="delete"
              color="negative"
              size="sm"
              @click.stop="confirmarEliminar(foto)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Tabla debajo de la galería -->
    <q-card flat bordered class="q-mt-md" v-if="fotos.length">
      <q-card-section class="q-pb-none">
        <div class="text-subtitle2 text-grey-8">Detalle de fotos ({{ fotos.length }})</div>
      </q-card-section>
      <q-table
        :rows="fotos"
        :columns="columns"
        dense
        flat
        :rows-per-page-options="[0]"
        hide-bottom
        row-key="id"
      >
        <template v-slot:body-cell-miniatura="props">
          <q-td :props="props">
            <q-avatar square size="40px" class="cursor-pointer" @click="verFoto(props.row)">
              <img :src="fotoUrl(props.row.archivo)" style="object-fit:cover" />
            </q-avatar>
          </q-td>
        </template>
        <template v-slot:body-cell-usuario="props">
          <q-td :props="props">{{ props.row.user?.name || '-' }}</q-td>
        </template>
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">{{ formatFechaLarga(props.row.created_at) }}</q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense icon="zoom_in" color="primary" size="sm" @click="verFoto(props.row)" />
            <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmarEliminar(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog lightbox -->
    <q-dialog v-model="lightboxOpen">
      <q-card style="max-width: 95vw; max-height: 95vh; background: #111">
        <q-card-section class="q-pa-sm row items-center">
          <div class="text-white text-caption">
            <q-icon name="person" size="xs" class="q-mr-xs" />{{ fotoActiva?.user?.name || '-' }}
            &nbsp;·&nbsp;
            <q-icon name="schedule" size="xs" class="q-mr-xs" />{{ formatFechaLarga(fotoActiva?.created_at) }}
          </div>
          <q-space />
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </q-card-section>
        <q-card-section class="q-pa-none flex flex-center" style="min-height: 200px">
          <img
            v-if="fotoActiva"
            :src="fotoUrl(fotoActiva.archivo)"
            style="max-width: 90vw; max-height: 80vh; display: block"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog confirmación eliminar -->
    <q-dialog v-model="eliminarDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <q-avatar icon="delete_forever" color="negative" text-color="white" />
          <span class="q-ml-sm">¿Eliminar esta foto?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" no-caps @click="eliminarDialog = false" />
          <q-btn color="negative" label="Eliminar" no-caps :loading="eliminando" @click="eliminarFoto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'FotosTab',
  props: {
    paciente: { type: Object, required: true }
  },
  data() {
    return {
      fotos: [],
      loading: false,
      uploading: false,
      lightboxOpen: false,
      fotoActiva: null,
      eliminarDialog: false,
      fotoAEliminar: null,
      eliminando: false,
      columns: [
        { name: 'miniatura', label: '', align: 'center', field: 'archivo' },
        { name: 'usuario', label: 'Subida por', align: 'left', field: row => row.user?.name || '-' },
        { name: 'fecha', label: 'Fecha y hora', align: 'left', field: 'created_at' },
        { name: 'acciones', label: '', align: 'right', field: 'id' },
      ],
    }
  },
  mounted() {
    this.fetchFotos()
  },
  methods: {
    fetchFotos() {
      this.loading = true
      this.$axios.get('paciente-fotos', { params: { paciente_id: this.paciente.id } })
        .then(res => { this.fotos = res.data })
        .catch(() => this.$alert.error('No se pudieron cargar las fotos'))
        .finally(() => { this.loading = false })
    },
    fotoUrl(archivo) {
      return this.$url.replace('/api/', '/fotos-pacientes/') + archivo
    },
    abrirCamara() {
      this.$refs.inputCamara.value = ''
      this.$refs.inputCamara.click()
    },
    abrirGaleria() {
      this.$refs.inputGaleria.value = ''
      this.$refs.inputGaleria.click()
    },
    async onFileSelected(evt) {
      const file = evt.target.files[0]
      if (!file) return

      this.uploading = true
      try {
        const blob = await this.comprimirAWebp(file)
        const formData = new FormData()
        formData.append('file', blob, 'foto.webp')
        formData.append('paciente_id', this.paciente.id)

        const res = await this.$axios.post('paciente-fotos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.fotos.unshift(res.data)
        this.$alert.success('Foto subida correctamente')
      } catch (err) {
        this.$alert.error(err.response?.data?.message || 'No se pudo subir la foto')
      } finally {
        this.uploading = false
      }
    },
    comprimirAWebp(file) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
          const MAX = 1200
          let w = img.naturalWidth
          let h = img.naturalHeight
          if (w > MAX || h > MAX) {
            const ratio = Math.min(MAX / w, MAX / h)
            w = Math.round(w * ratio)
            h = Math.round(h * ratio)
          }
          const canvas = document.createElement('canvas')
          canvas.width = w
          canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          URL.revokeObjectURL(objectUrl)
          canvas.toBlob(
            blob => blob ? resolve(blob) : reject(new Error('Error al comprimir imagen')),
            'image/webp',
            0.72
          )
        }
        img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('No se pudo leer la imagen')) }
        img.src = objectUrl
      })
    },
    verFoto(foto) {
      this.fotoActiva = foto
      this.lightboxOpen = true
    },
    confirmarEliminar(foto) {
      this.fotoAEliminar = foto
      this.eliminarDialog = true
    },
    eliminarFoto() {
      if (!this.fotoAEliminar) return
      this.eliminando = true
      this.$axios.delete('paciente-fotos/' + this.fotoAEliminar.id)
        .then(() => {
          this.fotos = this.fotos.filter(f => f.id !== this.fotoAEliminar.id)
          this.$alert.success('Foto eliminada')
          this.eliminarDialog = false
          this.fotoAEliminar = null
        })
        .catch(err => this.$alert.error(err.response?.data?.message || 'No se pudo eliminar'))
        .finally(() => { this.eliminando = false })
    },
    formatFecha(val) {
      if (!val) return '-'
      return moment(val).format('DD/MM/YY HH:mm')
    },
    formatFechaLarga(val) {
      if (!val) return '-'
      return moment(val).format('DD/MM/YYYY HH:mm:ss')
    },
  }
}
</script>

<style scoped>
.foto-card {
  transition: box-shadow 0.2s;
}
.foto-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}
.foto-thumb {
  border-radius: 4px 4px 0 0;
}
</style>
