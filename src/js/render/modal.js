import { h, icon } from './dom.js'

export function openModal({ title, body, footer }) {
  const dialog = h('dialog', { class: 'modal' })

  const closeBtn = h('button', {
    type: 'button',
    class: 'btn btn--icon btn--no-border btn--small',
    'aria-label': 'Close',
    onclick: () => dialog.close()
  }, icon('x'))

  dialog.append(
    h('div', { class: 'modal__header' }, [h('span', { text: title }), closeBtn]),
    h('div', { class: 'modal__body' }, body),
    h('div', { class: 'modal__footer' }, footer)
  )

  document.body.append(dialog)
  dialog.addEventListener('close', () => dialog.remove())
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close()
  })

  dialog.showModal()
  return dialog
}
