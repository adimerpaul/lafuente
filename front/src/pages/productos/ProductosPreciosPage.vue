<template>
  <q-page class="q-pa-md bg">
    <!-- TOP BAR -->
    <div class="row items-center q-col-gutter-md q-mb-md">
      <div class="col-12 col-md">
        <div class="text-h5 text-weight-bold title">
          Catálogo de Precios
        </div>
        <div class="text-caption text-grey-6">
          Solo nombre, imagen y precio — rápido y bonito.
        </div>
      </div>

      <div class="col-12 col-md-5">
        <q-input
          v-model="filters.search"
          dense
          outlined
          rounded
          debounce="350"
          placeholder="Buscar producto…"
          @update:model-value="fetchProductos"
          class="glass"
        >
          <template #prepend><q-icon name="search" /></template>
          <template #append>
            <q-btn
              v-if="filters.search"
              flat
              round
              dense
              icon="close"
              @click="clearSearch"
            />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-auto">
        <q-btn
          color="primary"
          rounded
          no-caps
          icon="refresh"
          label="Actualizar"
          :loading="loading"
          @click="fetchProductos"
          class="btn-soft"
        />
      </div>
    </div>

    <!-- STATS -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="glass card-soft" flat bordered>
          <q-card-section class="row items-center no-wrap">
            <q-avatar size="42px" class="bg-primary text-white">
              <q-icon name="inventory_2" />
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-caption text-grey-6">Total</div>
              <div class="text-h6 text-weight-bold">{{ pagination.rowsNumber }}</div>
            </div>
            <q-space />
            <q-badge color="primary" outline>{{ pagination.page }}/{{ maxPages }}</q-badge>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="glass card-soft" flat bordered>
          <q-card-section class="row items-center no-wrap">
            <q-avatar size="42px" class="bg-green text-white">
              <q-icon name="sell" />
            </q-avatar>
            <div class="q-ml-md">
              <div class="text-caption text-grey-6">Vista</div>
              <div class="text-h6 text-weight-bold">{{ productos.length }}</div>
            </div>
            <q-space />
            <q-chip dense color="green" text-color="white" icon="verified" class="q-ma-none">
              Precios
            </q-chip>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="glass card-soft" flat bordered>
          <q-card-section class="row items-center">
            <q-icon name="tips_and_updates" size="24px" class="text-amber" />
            <div class="q-ml-sm">
              <div class="text-subtitle2 text-weight-bold">Tip</div>
              <div class="text-caption text-grey-6">
                Haz click en un producto para ver la imagen grande y copiar el precio.
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- GRID -->
    <q-card class="glass" flat bordered>
      <q-card-section class="q-pa-md">
        <div class="row items-center q-mb-sm">
          <div class="text-subtitle1 text-weight-bold">Productos</div>
          <q-space />
          <q-chip dense outline icon="grid_view" class="q-ma-none">
            {{ pagination.rowsPerPage }} por página
          </q-chip>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="row q-col-gutter-md">
          <div v-for="i in 12" :key="i" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card flat bordered class="card-soft">
              <q-skeleton height="170px" />
              <q-card-section>
                <q-skeleton type="text" />
                <q-skeleton type="text" width="60%" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Items -->
        <div v-else class="row q-col-gutter-md">
          <div
            v-for="p in productos"
            :key="p.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              flat
              bordered
              class="card-soft card-hover"
              @click="openPreview(p)"
            >
              <q-img
                :src="imgSrc(p.imagen)"
                ratio="1"
                class="rounded-top"
                spinner-color="primary"
              >
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="image_not_supported" size="28px" />
                  </div>
                </template>

                <div class="absolute-top-left q-pa-sm">
                  <q-chip dense color="primary" text-color="white" icon="photo" class="q-ma-none">
                    Imagen
                  </q-chip>
                </div>

                <div class="absolute-bottom q-pa-sm overlay">
                  <div class="text-subtitle2 text-weight-bold ellipsis">
                    {{ p.nombre }}
                  </div>
                </div>
              </q-img>

              <q-separator />

              <q-card-section class="q-pa-sm">
                <div class="row items-center">
                  <div class="text-caption text-grey-6">Precio</div>
                  <q-space />
                  <q-chip
                    dense
                    color="green"
                    text-color="white"
                    icon="attach_money"
                    class="q-ma-none"
                  >
                    {{ formatPrice(p.precio) }}
                  </q-chip>
                </div>

                <div class="row q-col-gutter-xs q-mt-sm">
                  <div class="col">
                    <q-btn
                      dense
                      rounded
                      no-caps
                      outline
                      icon="content_copy"
                      label="Copiar"
                      class="full-width"
                      @click.stop="copyPrice(p)"
                    />
                  </div>
                  <div class="col">
                    <q-btn
                      dense
                      rounded
                      no-caps
                      color="primary"
                      icon="visibility"
                      label="Ver"
                      class="full-width btn-soft"
                      @click.stop="openPreview(p)"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div v-if="!productos.length" class="col-12">
            <q-card flat bordered class="card-soft">
              <q-card-section class="row items-center">
                <q-icon name="search_off" size="28px" class="text-grey-6" />
                <div class="q-ml-sm">
                  <div class="text-subtitle2 text-weight-bold">Sin resultados</div>
                  <div class="text-caption text-grey-6">Prueba con otro texto de búsqueda.</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Pagination -->
      <q-card-section class="q-pa-sm">
        <div class="row items-center q-col-gutter-sm">
          <div class="col-12 col-md-auto">
            <q-select
              v-model="pagination.rowsPerPage"
              :options="[12, 24, 48, 96]"
              dense
              outlined
              rounded
              label="Por página"
              class="glass"
              @update:model-value="changePerPage"
            />
          </div>
          <div class="col">
            <div class="flex flex-center">
              <q-pagination
                v-model="pagination.page"
                :max="maxPages"
                color="primary"
                boundary-numbers
                max-pages="8"
                @update:model-value="fetchProductos"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- PREVIEW DIALOG -->
    <q-dialog v-model="preview.open">
      <q-card style="width: 520px; max-width: 92vw;" class="card-soft">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 text-weight-bold ellipsis">
            {{ preview.item?.nombre }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-img
            :src="imgSrc(preview.item?.imagen)"
            ratio="1"
            class="rounded"
            spinner-color="primary"
          />
          <div class="row items-center q-mt-md">
            <q-chip color="green" text-color="white" icon="attach_money">
              {{ formatPrice(preview.item?.precio) }}
            </q-chip>
            <q-space />
            <q-btn
              rounded
              no-caps
              outline
              icon="content_copy"
              label="Copiar precio"
              @click="copyPrice(preview.item)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { copyToClipboard, debounce } from 'quasar'

export default {
  name: 'ProductosPreciosPage',
  data () {
    return {
      loading: false,
      productos: [],
      filters: { search: '' },
      pagination: {
        page: 1,
        rowsPerPage: 24,
        rowsNumber: 0
      },
      preview: {
        open: false,
        item: null
      }
    }
  },
  computed: {
    maxPages () {
      const max = Math.ceil((this.pagination.rowsNumber || 0) / (this.pagination.rowsPerPage || 1))
      return max || 1
    }
  },
  mounted () {
    this.fetchProductos = debounce(this.fetchProductos, 150)
    this.fetchProductos()
  },
  methods: {
    imgSrc (imagen) {
      if (!imagen) return ''
      return `${this.$url}../images/${imagen}`
    },
    formatPrice (v) {
      const n = Number(v || 0)
      return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    clearSearch () {
      this.filters.search = ''
      this.pagination.page = 1
      this.fetchProductos()
    },
    changePerPage () {
      this.pagination.page = 1
      this.fetchProductos()
    },
    openPreview (p) {
      this.preview.item = { ...p }
      this.preview.open = true
    },
    async copyPrice (p) {
      try {
        const text = `${p?.nombre || ''} - ${this.formatPrice(p?.precio)}`
        await copyToClipboard(text)
        this.$alert.success('Copiado: ' + text)
      } catch (e) {
        this.$alert.error('No se pudo copiar')
      }
    },
    fetchProductos () {
      this.loading = true
      this.$axios.get('productos-precios', {
        params: {
          search: this.filters.search,
          page: this.pagination.page,
          per_page: this.pagination.rowsPerPage
        }
      }).then(res => {
        this.productos = res.data.data || []
        this.pagination.rowsNumber = res.data.total || 0
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error al cargar catálogo')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.bg{
  min-height: 100%;
  background:
    radial-gradient(1200px 600px at 10% 0%, rgba(25,118,210,.14), transparent 55%),
    radial-gradient(900px 500px at 90% 10%, rgba(0,150,136,.12), transparent 55%),
    radial-gradient(900px 700px at 30% 90%, rgba(156,39,176,.10), transparent 60%),
    #f6f7fb;
}

.title{
  letter-spacing: .2px;
}

.glass{
  background: rgba(255,255,255,.75);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.card-soft{
  border-radius: 18px;
  overflow: hidden;
}

.card-hover{
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}
.card-hover:hover{
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0,0,0,.08);
}

.btn-soft{
  box-shadow: 0 10px 24px rgba(25,118,210,.18);
}

.rounded{
  border-radius: 16px;
  overflow: hidden;
}
.rounded-top{
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  overflow: hidden;
}

.overlay{
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0));
  color: white;
}
</style>
