import {Dialog, Notify} from 'quasar'

export class Alert{
  static success(message) {
    Notify.create({
      progress: true,
      color: 'positive',
      position: 'top',
      message,
      // icon: 'check',
      timeout: 1500,
      actions: [{icon: 'close', color: 'white', size: 'sm'}]
    })
  }
  static error(message) {
    Notify.create({
      progress: true,
      color: 'negative',
      position: 'top',
      message,
      // icon: 'close',
      timeout: 1500,
      actions: [{icon: 'close', color: 'white', size: 'sm'}]
    })
  }
  static dialog (message) {
    return Dialog.create({
      title: 'Confirmación',
      message,
      // position: 'top',
      color: 'positive',
      ok: {
        label: 'Aceptar',
        color: 'positive'
      },
      cancel: {
        label: 'Cancelar',
        color: 'negative'
      },
    })
  }
  static dialogPrompt (message) {
    return Dialog.create({
      title: 'Confirmación',
      message,
      // position: 'top',
      color: 'positive',
      ok: {
        label: 'Aceptar',
        color: 'positive'
      },
      cancel: {
        label: 'Cancelar',
        color: 'negative'
      },
      prompt: {
        model: '',
        type: 'text',
        label: 'Ingrese el texto',
        // required: true,
        // rules: [(val) => val !== '']
      }
    })
  }

}
