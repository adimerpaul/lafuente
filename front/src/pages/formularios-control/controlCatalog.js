export const controlCatalog = [
  { key: 'caja_vaselina', label: 'Caja vaselinada', type: 'size', prices: { P: 10, M: 15, G: 20 } },
  { key: 'caja_curacion', label: 'Caja de curacion', type: 'size', prices: { P: 8, M: 12, G: 16 } },
  { key: 'caja_sutura', label: 'Caja de sutura', type: 'size', prices: { P: 18, M: 24, G: 30 } },
  { key: 'caja_retiro_uterino', label: 'Caja de retiro de uterino', type: 'size', prices: { P: 10, M: 14, G: 18 } },
  { key: 'caja_retiro_puntos', label: 'Caja de retiro de puntos', type: 'size', prices: { P: 10, M: 14, G: 18 } },
  { key: 'sutura', label: 'Sutura', type: 'size', prices: { P: 15, M: 20, G: 25 } },
  { key: 'uso_tela_adhesiva', label: 'Uso de tela adhesiva', type: 'size', prices: { P: 5, M: 7, G: 10 } },
  { key: 'uso_micropor', label: 'Uso de micropor', type: 'yesno', prices: { SI: 6 } },
  { key: 'nebulizacion', label: 'Nebulizacion', type: 'yesno', prices: { SI: 20 } },
  { key: 'glicemia', label: 'Glicemia', type: 'yesno', prices: { SI: 15 } },
  { key: 'inyectable', label: 'Inyectable', type: 'injectable', prices: { IM: 10, EV: 15, SC: 8 } },
  { key: 'guantes_dediles', label: 'Guantes (dediles)', type: 'yesno', prices: { SI: 5 } },
  { key: 'campo_fenestrado', label: 'Campo fenestrado', type: 'yesno', prices: { SI: 10 } },
  { key: 'colocado_stopper', label: 'Colocado de stopper', type: 'yesno', prices: { SI: 8 } },
  { key: 'monitor_desfibrilador', label: 'Monitor - desfibrilador', type: 'yesno', prices: { SI: 25 } },
  { key: 'antisepticos', label: 'Antisepticos', type: 'yesno', prices: { SI: 8 } },
  { key: 'apositos_extras', label: 'Apositos extras', type: 'yesno', prices: { SI: 7 } },
  { key: 'torundas_gasa_extras', label: 'Torundas de gasa extras', type: 'yesno', prices: { SI: 7 } },
  { key: 'gases_extra', label: 'Gases extra', type: 'yesno', prices: { SI: 7 } },
  { key: 'venda_quemado', label: 'Venda de quemado', type: 'yesno', prices: { SI: 15 } },
  { key: 'curacion', label: 'Curacion', type: 'size', prices: { P: 15, M: 20, G: 30 } },
  { key: 'suero', label: 'Suero', type: 'yesno', prices: { SI: 25 } },
  { key: 'aspiracion', label: 'Aspiracion', type: 'yesno', prices: { SI: 20 } },
  { key: 'sonda', label: 'Sonda', type: 'sonda', prices: { SNG: 18, SOG: 18, SV: 15 } },
  { key: 'compresas', label: 'Compresas', type: 'size', prices: { P: 10, M: 15, G: 20 } },
  { key: 'yeso', label: 'Yeso', type: 'yesno', prices: { SI: 35 } },
  { key: 'oxigeno', label: 'Oxigeno', type: 'yesno', prices: { SI: 20 } },
  { key: 'enema', label: 'Enema', type: 'yesno', prices: { SI: 18 } },
  { key: 'corbatas', label: 'Corbatas', type: 'yesno', prices: { SI: 10 } },
  { key: 'algodon', label: 'Algodon', type: 'yesno', prices: { SI: 5 } }
]

const controlArancelCodeMap = {
  caja_vaselina: {
    P: ['caja_vaselinada_p', 'caja_vaselina_p'],
    M: ['caja_vaselinada_m', 'caja_vaselina_m'],
    G: ['caja_vaselinada_g', 'caja_vaselina_g']
  },
  caja_curacion: {
    P: 'caja_curacion_p',
    M: 'caja_curacion_m',
    G: 'caja_curacion_g'
  },
  caja_sutura: {
    P: 'caja_sutura_p',
    M: 'caja_sutura_m',
    G: 'caja_sutura_g'
  },
  caja_retiro_uterino: {
    P: ['caja_retiro_uretero_p', 'caja_retiro_uterino_p'],
    M: ['caja_retiro_uretero_m', 'caja_retiro_uterino_m'],
    G: ['caja_retiro_uretero_g', 'caja_retiro_uterino_g']
  },
  caja_retiro_puntos: {
    P: 'caja_retiro_puntos_p',
    M: 'caja_retiro_puntos_m',
    G: 'caja_retiro_puntos_g'
  },
  sutura: {
    P: 'sutura_p',
    M: 'sutura_m',
    G: 'sutura_g'
  },
  uso_tela_adhesiva: {
    P: 'uso_tela_adhesiva',
    M: 'uso_tela_adhesiva',
    G: 'uso_tela_adhesiva'
  },
  uso_micropor: 'uso_micropor',
  nebulizacion: 'nebulizacion',
  glicemia: 'glicemia',
  inyectable: {
    IM: 'inyectable_im',
    EV: 'inyectable_ev',
    SC: 'inyectable_sc'
  },
  guantes_dediles: 'guantes_dediles',
  campo_fenestrado: 'campo_fenestrado',
  colocado_stopper: 'colocado_stopper',
  monitor_desfibrilador: 'monitor_desfibrilador',
  antisepticos: 'antisepticos',
  apositos_extras: 'apositos_extras',
  torundas_gasa_extras: 'torundas_gasa_extras',
  gases_extra: ['gasas_extra', 'gases_extra'],
  venda_quemado: 'venda_quemado',
  curacion: {
    P: 'curacion_p',
    M: 'curacion_m',
    G: 'curacion_g'
  },
  suero: 'suero',
  aspiracion: 'aspiracion',
  sonda: {
    SNG: 'sonda_sng',
    SOG: 'sonda_sog',
    SV: 'sonda_sv'
  },
  compresas: {
    P: 'compresas',
    M: 'compresas',
    G: 'compresas'
  },
  yeso: {
    SI: ['yeso_p', 'yeso_m', 'yeso_g', 'yeso']
  },
  oxigeno: 'oxigeno',
  enema: 'enema',
  corbatas: 'corbatas',
  algodon: 'algodon'
}

export const controlOptions = {
  size: [
    { label: 'P', value: 'P' },
    { label: 'M', value: 'M' },
    { label: 'G', value: 'G' }
  ],
  yesno: [
    { label: 'Si', value: 'SI' },
    { label: 'No', value: 'NO' }
  ],
  injectable: [
    { label: 'I.M.', value: 'IM' },
    { label: 'E.V.', value: 'EV' },
    { label: 'S.C.', value: 'SC' }
  ],
  sonda: [
    { label: 'SNG', value: 'SNG' },
    { label: 'SOG', value: 'SOG' },
    { label: 'SV', value: 'SV' }
  ]
}

export function createEmptyDetail () {
  return controlCatalog.reduce((acc, item) => {
    acc[item.key] = null
    return acc
  }, {})
}

export function getControlArancelCodes (key, option) {
  const config = controlArancelCodeMap[key]
  if (!config) return []

  if (typeof config === 'string') return [config]
  if (Array.isArray(config)) return config

  const byOption = config?.[option] ?? config?.default
  if (!byOption) return []
  return Array.isArray(byOption) ? byOption : [byOption]
}

export function getControlAmount (key, value) {
  const item = controlCatalog.find(entry => entry.key === key)
  if (!item || !value) {
    return 0
  }

  if (Array.isArray(value)) {
    return value.reduce((sum, current) => {
      if (!current || current === 'NO') return sum
      return sum + Number(item.prices?.[current] || 0)
    }, 0)
  }

  if (value === 'NO') {
    return 0
  }

  return Number(item.prices?.[value] || 0)
}

export function getSelectedControlItems (detalle = {}) {
  return controlCatalog
    .map(item => {
      const value = detalle[item.key]
      const amount = getControlAmount(item.key, value)
      if (Array.isArray(value)) {
        const selectedValues = value.filter(current => current && current !== 'NO')
        return selectedValues.length
          ? { key: item.key, label: item.label, value: selectedValues.join(', '), amount }
          : null
      }

      return value && value !== 'NO'
        ? { key: item.key, label: item.label, value, amount }
        : null
    })
    .filter(Boolean)
}

export function getControlTotal (detalle = {}) {
  return getSelectedControlItems(detalle).reduce((sum, item) => sum + item.amount, 0)
}
