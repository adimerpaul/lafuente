import { defineStore } from 'pinia'

const STORAGE_KEY = 'lafuente_compras_create_drafts'

function loadDrafts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch (error) {
    console.warn('No se pudo cargar el borrador de compras', error)
    return {}
  }
}

function saveDrafts(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export const useComprasCreateStore = defineStore('comprasCreate', {
  state: () => ({
    drafts: loadDrafts(),
  }),
  actions: {
    getDraft(key) {
      return this.drafts[key] ? clone(this.drafts[key]) : null
    },
    setDraft(key, draft) {
      this.drafts = {
        ...this.drafts,
        [key]: clone(draft),
      }
      saveDrafts(this.drafts)
    },
    clearDraft(key) {
      const drafts = { ...this.drafts }
      delete drafts[key]
      this.drafts = drafts
      saveDrafts(this.drafts)
    },
  },
})
