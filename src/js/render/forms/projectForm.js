import { h } from '../dom.js'
import { openModal } from '../modal.js'

export function openProjectForm({ project, onSubmit }) {
  const isEdit = Boolean(project)

  const nameInput = h('input', {
    class: 'form-control form-control--large',
    type: 'text',
    id: 'project-name',
    value: project?.name || '',
    required: true,
    minlength: 3,
    maxlength: 20
  })

  const colorInput = h('input', {
    class: 'form-control',
    type: 'color',
    id: 'project-color',
    value: project?.color || '#307fa6'
  })

  const errorEl = h('p', { class: 'form-error' })

  const form = h('form', { id: 'project-form' }, [
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'project-name', text: 'Name' }),
      nameInput
    ]),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'project-color', text: 'Color' }),
      colorInput
    ]),
    errorEl
  ])

  const dialog = openModal({
    title: isEdit ? 'Alter Realm' : 'Forge a Realm',
    body: form,
    footer: [
      h('button', { type: 'button', class: 'btn btn--no-border', text: 'Cancel', onclick: () => dialog.close() }),
      h('button', { type: 'submit', form: 'project-form', class: 'btn btn--primary', text: isEdit ? 'Save' : 'Forge' })
    ]
  })

  form.addEventListener('submit', event => {
    event.preventDefault()
    errorEl.textContent = ''
    try {
      onSubmit({ name: nameInput.value, color: colorInput.value })
      dialog.close()
    } catch (err) {
      errorEl.textContent = err.message
    }
  })

  return dialog
}
