<template>
  <q-page class="q-pa-sm bg">
    <div class="row items-center q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-md">
        <div class="text-h6 text-weight-bold title">
          Catalogo de Precios - {{ farmaciaNombre }}
        </div>
        <div class="text-caption text-grey-6">
          Nombre, imagen y precio en bolivianos.
        </div>
      </div>

      <div class="col-12 col-md-5">
        <q-input
          v-model="filters.search"
          dense
          outlined
          rounded
          debounce="350"
          placeholder="Buscar producto..."
          @update:model-value="fetchProductos"
          class="glass compact-input"
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

    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="glass card-soft" flat bordered>
          <q-card-section class="row items-center no-wrap q-pa-sm">
            <q-avatar size="34px" class="bg-primary text-white">
              <q-icon name="inventory_2" />
            </q-avatar>
            <div class="q-ml-sm">
              <div class="text-caption text-grey-6">Total</div>
              <div class="text-subtitle1 text-weight-bold">{{ pagination.rowsNumber }}</div>
            </div>
            <q-space />
            <q-badge color="primary" outline>{{ pagination.page }}/{{ maxPages }}</q-badge>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="glass card-soft" flat bordered>
          <q-card-section class="row items-center no-wrap q-pa-sm">
            <q-avatar size="34px" class="bg-green text-white">
              <q-icon name="sell" />
            </q-avatar>
            <div class="q-ml-sm">
              <div class="text-caption text-grey-6">Vista</div>
              <div class="text-subtitle1 text-weight-bold">{{ productos.length }}</div>
            </div>
            <q-space />
            <q-chip dense color="green" text-color="white" icon="payments" class="q-ma-none mini-chip">
              Bs
            </q-chip>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="glass card-soft" flat bordered>
          <q-card-section class="row items-center q-pa-sm">
            <q-icon name="tips_and_updates" size="20px" class="text-amber" />
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

    <q-card class="glass" flat bordered>
      <q-card-section class="q-pa-sm">
        <div class="row items-center q-mb-xs">
          <div class="text-subtitle1 text-weight-bold">Productos</div>
          <q-space />
          <q-chip dense outline icon="grid_view" class="q-ma-none mini-chip">
            {{ pagination.rowsPerPage }} por pagina
          </q-chip>
        </div>

        <div v-if="loading" class="row q-col-gutter-sm">
          <div v-for="i in 6" :key="i" class="col-12 col-sm-6 col-md-4 col-lg-2">
            <q-card flat bordered class="card-soft">
              <q-skeleton height="110px" />
              <q-card-section class="q-pa-sm">
                <q-skeleton type="text" />
                <q-skeleton type="text" width="60%" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div v-else class="row q-col-gutter-sm">
          <div
            v-for="p in productos"
            :key="p.id"
            class="col-12 col-sm-6 col-md-4 col-lg-2"
          >
            <q-card
              flat
              bordered
              class="card-soft card-hover"
              @click="openPreview(p)"
            >
              <q-img
                :src="imgSrc(p.imagen)"
                ratio="1.5"
                class="rounded-top compact-img"
                spinner-color="primary"
              >
                <template #error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="image_not_supported" size="24px" />
                  </div>
                </template>

                <div class="absolute-top-left q-pa-xs">
                  <q-avatar size="22px" color="primary" text-color="white" icon="photo" class="mini-icon" />
                </div>

                <div class="absolute-bottom q-pa-xs overlay">
                  <div class="text-caption text-weight-bold ellipsis">
                    {{ p.nombre }}
                  </div>
                </div>
              </q-img>

              <q-separator />

              <q-card-section class="q-pa-xs">
                <div class="row items-center">
                  <div class="text-caption text-grey-6">Precio</div>
                  <q-space />
                  <q-chip
                    dense
                    color="green"
                    text-color="white"
                    icon="payments"
                    class="q-ma-none mini-chip"
                  >
                    {{ formatPrice(p.precio) }}
                  </q-chip>
                </div>

                <div class="row q-col-gutter-xs q-mt-xs">
                  <div class="col">
                    <q-btn
                      dense
                      rounded
                      no-caps
                      outline
                      icon="content_copy"
                      label="Copiar"
                      size="sm"
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
                      size="sm"
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
              <q-card-section class="row items-center q-pa-sm">
                <q-icon name="search_off" size="24px" class="text-grey-6" />
                <div class="q-ml-sm">
                  <div class="text-subtitle2 text-weight-bold">Sin resultados</div>
                  <div class="text-caption text-grey-6">Prueba con otro texto de busqueda.</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-xs">
        <div class="row items-center q-col-gutter-sm">
          <div class="col-12 col-md-auto">
            <q-select
              v-model="pagination.rowsPerPage"
              :options="[6, 12, 24, 48, 96]"
              dense
              outlined
              rounded
              label="Por pagina"
              class="glass compact-input"
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

    <q-dialog v-model="preview.open">
      <q-card style="width: 900px; max-width: 96vw;" class="card-soft">
        <q-card-section class="row items-center q-pb-none q-pa-sm">
          <div class="text-subtitle1 text-weight-bold ellipsis">
            {{ preview.item?.nombre }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm q-pa-sm">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-img
                :src="imgSrc(preview.item?.imagen)"
                ratio="1.15"
                class="rounded preview-img"
                spinner-color="primary"
              />
              <div class="row items-center q-mt-sm">
                <q-chip color="green" text-color="white" icon="payments" class="mini-chip">
                  {{ formatPrice(preview.item?.precio) }}
                </q-chip>
                <q-space />
                <q-btn
                  rounded
                  no-caps
                  outline
                  icon="content_copy"
                  label="Copiar precio"
                  size="sm"
                  @click="copyPrice(preview.item)"
                />
              </div>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col-12 col-sm-6">
                  <q-card flat bordered class="glass">
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption text-grey-6">Producto</div>
                      <div class="text-subtitle2 text-weight-bold">{{ preview.item?.nombre || '-' }}</div>
                      <div class="text-caption text-grey-7 q-mt-xs">{{ preview.item?.descripcion || 'Sin descripcion' }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-3">
                  <q-card flat bordered class="glass">
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption text-grey-6">Unidad</div>
                      <div class="text-subtitle2 text-weight-bold">{{ preview.item?.unidad || '-' }}</div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 col-sm-3">
                  <q-card flat bordered class="glass">
                    <q-card-section class="q-pa-sm">
                      <div class="text-caption text-grey-6">ID</div>
                      <div class="text-subtitle2 text-weight-bold">{{ preview.item?.id || '-' }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <div class="row items-center q-mb-xs">
                <div class="text-subtitle2 text-weight-bold">Historial de compras activas</div>
                <q-space />
                <q-spinner v-if="preview.loadingHistorial" color="primary" size="20px" />
              </div>

              <q-markup-table dense flat bordered wrap-cells>
                <thead>
                <tr>
                  <th>ID compra</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Usuario</th>
                  <th>Proveedor</th>
                  <th>Lote</th>
                  <th>Vence</th>
                  <th class="text-right">Cant.</th>
                  <th class="text-right">Disponible</th>
                  <th class="text-right">P/U</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in preview.historial" :key="item.id">
                  <td>{{ item.compra?.id || '-' }}</td>
                  <td>{{ item.compra?.fecha || '-' }}</td>
                  <td>{{ item.compra?.hora || '-' }}</td>
                  <td>{{ item.compra?.user?.name || '-' }}</td>
                  <td>{{ item.compra?.proveedor?.nombre || item.compra?.nombre || '-' }}</td>
                  <td>{{ item.lote || '-' }}</td>
                  <td>{{ item.fecha_vencimiento || '-' }}</td>
                  <td class="text-right">{{ item.cantidad || 0 }}</td>
                  <td class="text-right">{{ item.cantidad_venta || 0 }}</td>
                  <td class="text-right">{{ formatPrice(item.precio) }}</td>
                </tr>
                <tr v-if="!preview.loadingHistorial && !preview.historial.length">
                  <td colspan="10" class="text-center text-grey-6">Sin compras activas para este producto.</td>
                </tr>
                </tbody>
              </q-markup-table>
            </div>
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
        rowsPerPage: 6,
        rowsNumber: 0
      },
      preview: {
        open: false,
        item: null,
        historial: [],
        loadingHistorial: false
      }
    }
  },
  computed: {
    farmaciaTipo () {
      return this.$route.meta?.farmaciaTipo || 'Farmacia'
    },
    farmaciaNombre () {
      return this.$route.meta?.farmaciaNombre || this.farmaciaTipo
    },
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
      return `${n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
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
      this.preview.historial = []
      this.preview.open = true
      this.preview.loadingHistorial = true
      this.$axios.get(`productos/${p.id}/historial-compras`, {
        params: {
          farmacia_tipo: this.farmaciaTipo
        }
      })
        .then(res => {
          this.preview.historial = res.data || []
        }).catch(() => {
          this.$alert.error('No se pudo cargar el historial de compras')
        }).finally(() => {
          this.preview.loadingHistorial = false
        })
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
          per_page: this.pagination.rowsPerPage,
          farmacia_tipo: this.farmaciaTipo
        }
      }).then(res => {
        this.productos = res.data.data || []
        this.pagination.rowsNumber = res.data.total || 0
      }).catch(err => {
        this.$alert.error(err.response?.data?.message || 'Error al cargar catalogo')
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
  background: rgba(255,255,255,.78);
  backdrop-filter: blur(10px);
  border-radius: 14px;
}

.compact-input{
  font-size: 12px;
}

.card-soft{
  border-radius: 16px;
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
  box-shadow: 0 8px 18px rgba(25,118,210,.18);
}

.rounded{
  border-radius: 14px;
  overflow: hidden;
}
.rounded-top{
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
}

.compact-img{
  max-height: 118px;
}

.preview-img{
  max-height: 240px;
}

.mini-chip{
  font-size: 11px;
}

.mini-icon{
  box-shadow: 0 4px 10px rgba(0,0,0,.18);
}

.overlay{
  background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,0));
  color: white;
}
</style>
