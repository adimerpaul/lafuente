<template>
  <q-page class="q-pa-xs">
    <q-card flat bordered>
      <q-card-section class="q-pa-xs">
        <div class="text-right actions-bar">
          <q-btn-dropdown
            color="primary"
            label="Reportes"
            no-caps
            icon="assessment"
            :loading="loading"
          >
            <q-list>
              <q-item clickable v-close-popup @click="exportPdf('all')">
                <q-item-section avatar>
                  <q-icon name="picture_as_pdf" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Exportar PDF</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportPdf('existing')">
                <q-item-section avatar>
                  <q-icon name="inventory_2" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Exportar PDF existencia</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportExcel('all')">
                <q-item-section avatar>
                  <q-icon name="fa-solid fa-file-excel" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Exportar Excel todo</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="exportExcel('existing')">
                <q-item-section avatar>
                  <q-icon name="inventory_2" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Exportar Excel existencia</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="openExistenciaFechaDialog">
                <q-item-section avatar>
                  <q-icon name="event" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Existencia en una fecha</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <q-btn
            color="green"
            :label="`Nuevo ${farmaciaNombre}`"
            @click="productoNew"
            no-caps
            icon="add_circle_outline"
            :loading="loading"
          />

          <q-input
            v-model="filter"
            label="Buscar"
            dense
            outlined
            debounce="300"
            @update:modelValue="productosGet"
          >
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="flex flex-center">
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
            :rows-per-page-options="[10, 25, 50, 100]"
            :rows-per-page="pagination.rowsPerPage"
            :rows-number="pagination.rowsNumber"
            color="primary"
            @update:modelValue="productosGet"
            boundary-numbers
            max-pages="5"
          />
        </div>

        <div class="totales-bar q-mb-xs">
          <div class="totales-item totales-compra">
            <div class="totales-label">Costo total</div>
            <div class="totales-valor">Bs {{ formatMonto(totales.total_compra) }}</div>
          </div>
          <div class="totales-item totales-venta">
            <div class="totales-label">Venta total</div>
            <div class="totales-valor">Bs {{ formatMonto(totales.total_venta) }}</div>
          </div>
          <div class="totales-item totales-ganancia">
            <div class="totales-label">Ganancia</div>
            <div class="totales-valor">Bs {{ formatMonto(totales.ganancia) }}</div>
          </div>
        </div>

        <q-markup-table dense wrap-cells>
          <thead>
            <tr>
              <th>Opciones</th>
              <th>Imagen</th>
              <th v-for="column in columns" :key="column.name" :class="column.align">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productos" :key="producto.id">
              <td>
                <q-btn-dropdown label="Opciones" no-caps size="10px" dense color="primary">
                  <q-list>
                    <q-item clickable @click="productoEdit(producto)" v-close-popup>
                      <q-item-section avatar>
                        <q-icon name="edit" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Editar</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable @click="productoDelete(producto.id)" v-close-popup>
                      <q-item-section avatar>
                        <q-icon name="delete" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Eliminar</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable @click="verHistorial(producto)" v-close-popup>
                      <q-item-section avatar>
                        <q-icon name="history" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Historial de compras</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="productoEditFoto(producto)">
                      <q-item-section avatar>
                        <q-icon name="photo" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Ver foto</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </td>
              <td>
                <q-img
                  :src="`${$url}../images/${producto.imagen}`"
                  style="width: 50px; height: 50px"
                  class="q-mr-sm"
                />
              </td>
              <td>
                <div style="max-width: 150px; wrap-option: wrap; line-height: 0.9;">
                  {{ producto.nombre }}
                </div>
              </td>
              <td>
                <div style="max-width: 200px; wrap-option: wrap; line-height: 0.9;">
                  {{ producto.descripcion }}
                </div>
              </td>
              <td>
                <div style="max-width: 80px; wrap-option: wrap; line-height: 0.9;">
                  {{ producto.unidad }}
                </div>
              </td>
              <td>{{ producto.precio_compra }}</td>
              <td>
                <input
                  v-model.number="producto.precio"
                  type="number"
                  step="0.01"
                  min="0"
                  style="width: 60px; text-align: right"
                  @keyup="debouncedCambioPrecio(producto)"
                />
              </td>
              <td>{{ producto.cantidad }}</td>
              <td>{{ producto.stock_minimo }}</td>
              <td>{{ producto.stock_maximo }}</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="productoDialog" persistent>
      <q-card style="width: 400px; margin: 0 auto">
        <q-card-section class="q-pb-none row items-center">
          <div>{{ actionPeriodo }} producto</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="productoDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit="producto.id ? productoPut() : productoPost()">
            <q-input v-model="producto.nombre" label="Nombre" dense outlined :rules="[val => !!val || 'Campo requerido']" />
            <q-input v-model="producto.descripcion" label="Descripcion" dense outlined hint="" />
            <q-input v-model="producto.unidad" label="Unidad" dense outlined hint="" />
            <q-input v-model="producto.precio" label="Precio" dense outlined hint="" type="number" step="0.01" />
            <q-input v-model="producto.stock" label="Stock" dense outlined hint="" />
            <q-input v-model="producto.stock_minimo" label="Stock minimo" dense outlined hint="" />
            <q-input v-model="producto.stock_maximo" label="Stock maximo" dense outlined hint="" />
            <div class="text-right">
              <q-btn color="negative" label="Cancelar" @click="productoDialog = false" no-caps :loading="loading" />
              <q-btn color="primary" label="Guardar" type="submit" no-caps :loading="loading" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="historialDialog" persistent>
      <q-card style="width: 800px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Historial de Compras: {{ productoHistorialNombre }} - {{ farmaciaNombre }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="historialDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-markup-table dense wrap-cells flat bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Lote</th>
                <th>Vencimiento</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in historialCompras" :key="item.id">
                <td>{{ i + 1 }}</td>
                <td>{{ item.compra?.fecha }}</td>
                <td>{{ item.lote }}</td>
                <td>{{ item.fecha_vencimiento }}</td>
                <td>{{ item.cantidad }}</td>
                <td>{{ item.precio }}</td>
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogFoto">
      <q-card style="width: 400px">
        <q-card-section class="q-pb-none text-bold row items-center">
          Cambiar foto de producto
          {{ producto.nombre }}
          <q-space />
          <q-btn icon="close" flat round dense @click="dialogFoto = false" />
        </q-card-section>
        <q-card-section class="row items-center q-pb-none">
          <q-btn
            label="Subir foto"
            color="primary"
            @click="$refs.fileInput.click()"
            class="q-mr-sm"
            no-caps
            dense
            icon="cloud_upload"
            :loading="loading"
          />
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="onFileChange"
            style="display: none"
          >
          <img :src="`${$url}../images/${producto.imagen}`" style="width: 350px; height: 350px" class="q-mr-sm" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="existenciaFechaDialog" persistent>
      <q-card style="width: 520px; max-width: 95vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Existencia en una fecha</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="existenciaFechaDialog = false" />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="existenciaFecha"
            type="date"
            label="Fecha"
            outlined
            dense
            :min="fechaInicioExistencias"
            :max="fechaHoy"
          />
          <div class="text-caption text-grey-7">
            El cálculo histórico se reconstruye desde el 2025-10-01 usando compras activas menos ventas activas registradas hasta la fecha seleccionada.
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-btn
                class="full-width"
                color="secondary"
                label="Exportar PDF"
                no-caps
                icon="picture_as_pdf"
                :loading="loading"
                @click="exportExistenciaFechaPdf('all')"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                class="full-width"
                color="secondary"
                outline
                label="Exportar PDF existencia"
                no-caps
                icon="inventory_2"
                :loading="loading"
                @click="exportExistenciaFechaPdf('existing')"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                class="full-width"
                color="positive"
                label="Exportar Excel todo"
                no-caps
                icon="fa-solid fa-file-excel"
                :loading="loading"
                @click="exportExistenciaFechaExcel('all')"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-btn
                class="full-width"
                color="positive"
                outline
                label="Exportar Excel existencia"
                no-caps
                icon="inventory_2"
                :loading="loading"
                @click="exportExistenciaFechaExcel('existing')"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { debounce } from 'quasar'

export default {
  name: 'ProductosPage',
  data () {
    return {
      productos: [],
      producto: {},
      productoDialog: false,
      loading: false,
      actionPeriodo: '',
      filter: '',
      pagination: {
        page: 1,
        rowsPerPage: 15,
        rowsNumber: 0,
      },
      columns: [
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        { name: 'descripcion', label: 'Descripcion', align: 'left', field: 'descripcion' },
        { name: 'unidad', label: 'Unidad', align: 'left', field: 'unidad' },
        { name: 'precio_compra', label: 'P. Compra', align: 'left', field: 'precio_compra' },
        { name: 'precio', label: 'Precio', align: 'left', field: 'precio' },
        { name: 'stock', label: 'Stock', align: 'left', field: 'stock' },
        { name: 'stock_minimo', label: 'Stock minimo', align: 'left', field: 'stock_minimo' },
        { name: 'stock_maximo', label: 'Stock maximo', align: 'left', field: 'stock_maximo' },
      ],
      historialDialog: false,
      historialCompras: [],
      productoHistorialNombre: '',
      dialogFoto: false,
      existenciaFechaDialog: false,
      existenciaFecha: '',
      fechaInicioExistencias: '2025-10-01',
      fechaHoy: new Date().toISOString().slice(0, 10),
      totales: { total_compra: 0, total_venta: 0, ganancia: 0 },
    }
  },
  mounted () {
    this.productosGet()
    this.debouncedCambioPrecio = debounce(this.cambioPrecio, 500)
    this.existenciaFecha = this.fechaHoy
  },
  computed: {
    farmaciaTipo () {
      return this.$route.meta?.farmaciaTipo || 'Farmacia'
    },
    farmaciaNombre () {
      return this.$route.meta?.farmaciaNombre || this.farmaciaTipo
    }
  },
  watch: {
    farmaciaTipo (nuevo, anterior) {
      if (nuevo === anterior) return
      this.productosGet()
    }
  },
  methods: {
    formatMonto (value) {
      return Number(value || 0).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    totalesGet () {
      this.$axios.get('productos-totales', {
        params: { search: this.filter, farmacia_tipo: this.farmaciaTipo }
      }).then((res) => {
        this.totales = res.data
      }).catch(() => {})
    },
    getExportMeta (mode) {
      const existing = mode === 'existing'

      return {
        existing,
        title: existing ? 'Inventario de productos existentes' : 'Inventario completo de productos',
        fileName: existing ? 'inventario_productos_existentes' : 'inventario_productos_todo',
      }
    },
    formatDecimal (value, digits = 2) {
      return Number(value || 0).toLocaleString('es-BO', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    },
    escapeHtml (value) {
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
    },
    async streamProductosExport (existingOnly, onChunk) {
      let page = 1
      let lastPage = 1
      const perPage = 4000

      while (page <= lastPage) {
        const { data } = await this.$axios.get('productos-export', {
          params: {
            page,
            per_page: perPage,
            existentes: existingOnly,
            farmacia_tipo: this.farmaciaTipo,
          }
        })

        const items = data.data || []
        lastPage = data.last_page || 1

        if (items.length) {
          await onChunk(items, {
            page,
            total: data.total || 0,
            lastPage,
          })
        }

        page += 1
      }
    },
    async streamProductosExistenciaFechaExport (fecha, existingOnly, onChunk) {
      let page = 1
      let lastPage = 1
      const perPage = 4000

      while (page <= lastPage) {
        const { data } = await this.$axios.get('productos-existencia-fecha-export', {
          params: {
            fecha,
            page,
            per_page: perPage,
            existentes: existingOnly,
            farmacia_tipo: this.farmaciaTipo,
          }
        })

        const items = data.data || []
        lastPage = data.last_page || 1

        if (items.length) {
          await onChunk(items, {
            page,
            total: data.total || 0,
            lastPage,
          })
        }

        page += 1
      }
    },
    getExistenciaFechaMeta (mode, fecha) {
      const existing = mode === 'existing'

      return {
        existing,
        title: existing
          ? `Inventario de productos existentes al ${fecha}`
          : `Inventario completo de productos al ${fecha}`,
        fileName: existing
          ? `inventario_productos_existencia_${fecha}_existentes`
          : `inventario_productos_existencia_${fecha}_todo`,
      }
    },
    getExistenciaFechaSeleccionada () {
      if (!this.existenciaFecha) {
        this.$alert.error('Debe seleccionar una fecha')
        return null
      }

      if (this.existenciaFecha < this.fechaInicioExistencias) {
        this.$alert.error(`Solo se puede consultar existencia desde ${this.fechaInicioExistencias}`)
        return null
      }

      if (this.existenciaFecha > this.fechaHoy) {
        this.$alert.error(`La fecha no puede ser mayor a ${this.fechaHoy}`)
        return null
      }

      return this.existenciaFecha
    },
    openExistenciaFechaDialog () {
      this.existenciaFechaDialog = true
      if (!this.existenciaFecha) {
        this.existenciaFecha = this.fechaHoy
      }
    },
    triggerBlobDownload (blob, fileName) {
      const url = window.URL.createObjectURL(new Blob([blob]))
      const a   = document.createElement('a')
      a.href    = url
      a.setAttribute('download', fileName)
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    },
    async exportExcel (mode) {
      const existing = mode === 'existing'
      this.loading = true
      try {
        const res = await this.$axios.get('productos-excel', {
          params: { existentes: existing, farmacia_tipo: this.farmaciaTipo },
          responseType: 'blob',
        })
        const name = existing ? 'inventario_existencias.xlsx' : 'inventario_completo.xlsx'
        this.triggerBlobDownload(res.data, name)
      } catch (error) {
        this.$alert.error('No se pudo exportar el Excel')
      } finally {
        this.loading = false
      }
    },
    async exportExistenciaFechaExcel (mode) {
      const fecha = this.getExistenciaFechaSeleccionada()
      if (!fecha) return

      const existing = mode === 'existing'
      this.loading = true
      try {
        const res = await this.$axios.get('productos-existencia-fecha-excel', {
          params: { fecha, existentes: existing, farmacia_tipo: this.farmaciaTipo },
          responseType: 'blob',
        })
        const suffix = existing ? 'con_stock' : 'todo'
        this.triggerBlobDownload(res.data, `existencia_${fecha}_${suffix}.xlsx`)
      } catch (error) {
        this.$alert.error('No se pudo exportar el Excel')
      } finally {
        this.loading = false
      }
    },
    renderPdfRows (items, startIndex) {
      return items.map((item, index) => `
        <tr>
          <td>${startIndex + index + 1}</td>
          <td>${this.escapeHtml(item.nombre)}</td>
          <td>${this.escapeHtml(item.descripcion)}</td>
          <td>${this.escapeHtml(item.unidad)}</td>
          <td class="text-right">${this.formatDecimal(item.precio)}</td>
          <td class="text-right">${this.formatDecimal(item.cantidad)}</td>
          <td class="text-right">${this.escapeHtml(item.stock_minimo)}</td>
          <td class="text-right">${this.escapeHtml(item.stock_maximo)}</td>
        </tr>
      `).join('')
    },
    buildPdfHtml (title, rowsHtml, totalRows) {
      const generatedAt = new Date().toLocaleString('es-BO')

      return `
        <!doctype html>
        <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${this.escapeHtml(title)}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #1f2937; margin: 20px; }
            h1 { margin: 0 0 6px; font-size: 20px; }
            .meta { margin-bottom: 16px; font-size: 12px; color: #4b5563; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th, td { border: 1px solid #d1d5db; padding: 6px 8px; font-size: 11px; word-break: break-word; }
            th { background: #1d4ed8; color: #fff; text-align: left; }
            .text-right { text-align: right; }
            .col-num { width: 44px; }
            .col-name { width: 24%; }
            .col-desc { width: 28%; }
            .col-unit { width: 12%; }
            .col-price, .col-qty, .col-min, .col-max { width: 9%; }
            @page { size: landscape; margin: 12mm; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <h1>${this.escapeHtml(title)}</h1>
          <div class="meta">Generado: ${this.escapeHtml(generatedAt)} | Total de productos: ${totalRows}</div>
          <table>
            <thead>
              <tr>
                <th class="col-num">#</th>
                <th class="col-name">Nombre</th>
                <th class="col-desc">Descripcion</th>
                <th class="col-unit">Unidad</th>
                <th class="col-price text-right">Precio</th>
                <th class="col-qty text-right">Existencia</th>
                <th class="col-min text-right">Min.</th>
                <th class="col-max text-right">Max.</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
        </html>
      `
    },
    async exportPdf (mode) {
      const meta = this.getExportMeta(mode)
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        this.$alert.error('El navegador bloqueo la ventana emergente del PDF')
        return
      }

      this.loading = true
      printWindow.document.write('<html><body><p>Generando PDF...</p></body></html>')
      printWindow.document.close()

      try {
        let rowsHtml = ''
        let totalRows = 0

        await this.streamProductosExport(meta.existing, async (items) => {
          rowsHtml += this.renderPdfRows(items, totalRows)
          totalRows += items.length
        })

        printWindow.document.open()
        printWindow.document.write(this.buildPdfHtml(meta.title, rowsHtml, totalRows))
        printWindow.document.close()

        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 250)
      } catch (error) {
        printWindow.close()
        this.$alert.error(error.response?.data?.message || 'No se pudo generar el PDF')
      } finally {
        this.loading = false
      }
    },
    async exportExistenciaFechaPdf (mode) {
      const fecha = this.getExistenciaFechaSeleccionada()
      if (!fecha) return

      const meta = this.getExistenciaFechaMeta(mode, fecha)
      const printWindow = window.open('', '_blank')

      if (!printWindow) {
        this.$alert.error('El navegador bloqueo la ventana emergente del PDF')
        return
      }

      this.loading = true
      printWindow.document.write('<html><body><p>Generando PDF...</p></body></html>')
      printWindow.document.close()

      try {
        let rowsHtml = ''
        let totalRows = 0

        await this.streamProductosExistenciaFechaExport(fecha, meta.existing, async (items) => {
          rowsHtml += this.renderPdfRows(items, totalRows)
          totalRows += items.length
        })

        printWindow.document.open()
        printWindow.document.write(this.buildPdfHtml(meta.title, rowsHtml, totalRows))
        printWindow.document.close()

        setTimeout(() => {
          printWindow.focus()
          printWindow.print()
        }, 250)
      } catch (error) {
        printWindow.close()
        this.$alert.error(error.response?.data?.message || 'No se pudo generar el PDF')
      } finally {
        this.loading = false
      }
    },
    onFileChange (event) {
      const file = event.target.files[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        this.loading = true
        this.$axios.post(`productos/${this.producto.id}/foto`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.productosGet()
          this.$alert.success('Foto actualizada')
          this.dialogFoto = false
        }).catch((error) => {
          this.$alert.error(error.response.data.message)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    productoEditFoto (producto) {
      this.dialogFoto = true
      this.producto = { ...producto }
    },
    verHistorial (producto) {
      this.loading = true
      this.productoHistorialNombre = producto.nombre
      this.$axios.get(`productos/${producto.id}/historial-compras`, {
        params: {
          farmacia_tipo: this.farmaciaTipo,
        }
      })
        .then((res) => {
          this.historialCompras = res.data
          this.historialDialog = true
        }).catch(() => {
          this.$alert.error('Error al obtener historial')
        }).finally(() => {
          this.loading = false
        })
    },
    cambioStock (producto) {
      this.loading = true
      this.$axios.put(`productos/${producto.id}`, { stock: producto.stock, farmacia_tipo: this.farmaciaTipo }).then(() => {
        this.productosGet()
        this.$alert.success('Stock actualizado')
      }).catch((error) => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    cambioPrecio (producto) {
      this.loading = true
      this.$axios.put(`productos/${producto.id}`, { precio: producto.precio, farmacia_tipo: this.farmaciaTipo }).then(() => {
        this.productosGet()
        this.$alert.success('Precio actualizado')
      }).catch((error) => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    productoNew () {
      this.producto = {
        name: '',
        email: '',
        password: '',
        area_id: 1,
        productoname: '',
        cargo: '',
        role: 'Area',
      }
      this.actionPeriodo = 'Nuevo'
      this.productoDialog = true
    },
    productosGet () {
      this.loading = true
      this.$axios.get('productos', {
        params: {
          search: this.filter,
          page: this.pagination.page,
          per_page: this.pagination.rowsPerPage,
          farmacia_tipo: this.farmaciaTipo,
        }
      }).then((res) => {
        this.productos = res.data.data
        this.pagination.rowsNumber = res.data.total
        this.totalesGet()
      }).catch((error) => {
        this.$alert.error(error.response?.data?.message || 'Error al cargar productos')
      }).finally(() => {
        this.loading = false
      })
    },
    gestionGet () {
      this.loading = true
      this.$axios.get('gestiones').then((res) => {
        this.gestiones = res.data
        this.loading = false
      }).catch((error) => {
        this.$alert.error(error.response.data.message)
        this.loading = false
      })
    },
    productoPost () {
      this.loading = true
      this.$axios.post('productos', {
        ...this.producto,
        farmacia_tipo: this.farmaciaTipo,
      }).then(() => {
        this.productosGet()
        this.productoDialog = false
        this.$alert.success('Periodo creado')
      }).catch((error) => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    productoPut () {
      this.loading = true
      this.$axios.put(`productos/${this.producto.id}`, {
        ...this.producto,
        farmacia_tipo: this.farmaciaTipo,
      }).then(() => {
        this.productosGet()
        this.productoDialog = false
        this.$alert.success('Periodo actualizado')
      }).catch((error) => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    },
    productoEdit (producto) {
      this.producto = { ...producto }
      this.actionPeriodo = 'Editar'
      this.productoDialog = true
    },
    productoDelete (id) {
      this.$alert.dialog('Desea eliminar el producto?')
        .onOk(() => {
          this.loading = true
          this.$axios.delete(`productos/${id}`).then(() => {
            this.productosGet()
            this.$alert.success('Periodo eliminado')
          }).catch((error) => {
            this.$alert.error(error.response.data.message)
          }).finally(() => {
            this.loading = false
          })
        })
    }
  }
}
</script>

<style scoped>
.actions-bar {
  display: grid;
  gap: 8px;
  align-items: start;
}

@media (min-width: 768px) {
  .actions-bar {
    grid-template-columns: auto auto auto minmax(240px, 320px);
    justify-content: end;
  }
}

.totales-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.totales-item {
  flex: 1 1 140px;
  border-radius: 8px;
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.totales-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.75;
}

.totales-valor {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.totales-compra {
  background: #dbeafe;
  color: #1e3a5f;
}

.totales-venta {
  background: #d1fae5;
  color: #064e3b;
}

.totales-ganancia {
  background: #fef9c3;
  color: #713f12;
}
</style>
