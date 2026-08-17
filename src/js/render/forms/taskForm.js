import { h, icon } from '../dom.js'
import { openModal } from '../modal.js'
import { Priorities } from '../../priorities.js'

function toDateInputValue(date) {
  const d = new Date(date)
  return d.toISOString().slice(0, 10)
}

function buildSubtaskRow(subtask, onRemove) {
  return h('li', { class: 'task-form__subtask' }, [
    h('input', {
      class: 'form-control form-control--medium task-form__subtask-input',
      type: 'text',
      value: subtask.title,
      'data-subtask-input': ''
    }),
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small',
      'aria-label': `Remove subtask: ${subtask.title}`,
      onclick: onRemove
    }, icon('x'))
  ])
}

export function openTaskForm({ task, projects, projectId, onSubmit }) {
  const isEdit = Boolean(task)
  const subtasks = (task?.allSubTasks || []).map(st => ({ id: st.id, title: st.title }))

  const titleInput = h('input', {
    class: 'form-control form-control--large',
    type: 'text',
    id: 'task-title',
    value: task?.title || '',
    required: true,
    minlength: 3,
    maxlength: 120
  })

  const descInput = h('textarea', {
    class: 'form-control',
    id: 'task-description',
    rows: 3,
    text: task?.description || ''
  })

  const dueDateInput = h('input', {
    class: 'form-control',
    type: 'date',
    id: 'task-due-date',
    value: toDateInputValue(task?.dueDate || new Date())
  })

  const prioritySelect = h('select', { class: 'form-control', id: 'task-priority' },
    Priorities.all().map(p => h('option', {
      value: p.value,
      text: p.name,
      selected: task?.priority?.value === p.value ? true : null
    }))
  )

  const projectSelect = h('select', { class: 'form-control', id: 'task-project' },
    projects.map(p => h('option', {
      value: p.id,
      text: p.name,
      selected: p.id === projectId ? true : null
    }))
  )

  const subtaskList = h('ul', { class: 'task-form__subtasks' })

  function renderSubtasks() {
    subtaskList.replaceChildren(...subtasks.map((st, idx) =>
      buildSubtaskRow(st, () => {
        subtasks.splice(idx, 1)
        renderSubtasks()
      })
    ))
  }
  renderSubtasks()

  const addSubtaskInput = h('input', {
    class: 'form-control form-control--medium',
    type: 'text',
    placeholder: 'New subtask...'
  })

  const addSubtaskBtn = h('button', {
    type: 'button',
    class: 'btn btn--no-border btn--small',
    onclick: () => {
      const title = addSubtaskInput.value.trim()
      if (!title) return
      subtasks.push({ id: null, title })
      addSubtaskInput.value = ''
      renderSubtasks()
    }
  }, [icon('plus'), ' Add Subtask'])

  const errorEl = h('p', { class: 'form-error' })

  const form = h('form', { id: 'task-form' }, [
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'task-title', text: 'Title' }),
      titleInput
    ]),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'task-description', text: 'Description' }),
      descInput
    ]),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'task-due-date', text: 'Due Date' }),
      dueDateInput
    ]),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'task-priority', text: 'Weight' }),
      prioritySelect
    ]),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'task-project', text: 'Realm' }),
      projectSelect
    ]),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', text: 'Subtasks' }),
      subtaskList,
      h('div', { class: 'task-form__add-subtask' }, [addSubtaskInput, addSubtaskBtn])
    ]),
    errorEl
  ])

  const dialog = openModal({
    title: isEdit ? 'Alter Burden' : 'Take on a Burden',
    body: form,
    footer: [
      h('button', { type: 'button', class: 'btn btn--no-border', text: 'Cancel', onclick: () => dialog.close() }),
      h('button', { type: 'submit', form: 'task-form', class: 'btn btn--primary', text: isEdit ? 'Save' : 'Take On' })
    ]
  })

  form.addEventListener('submit', event => {
    event.preventDefault()
    errorEl.textContent = ''

    const inputs = subtaskList.querySelectorAll('[data-subtask-input]')
    const finalSubtasks = subtasks.map((st, idx) => ({ id: st.id, title: inputs[idx].value }))

    try {
      onSubmit({
        title: titleInput.value,
        description: descInput.value,
        dueDate: dueDateInput.value,
        priority: Number(prioritySelect.value),
        projectId: projectSelect.value,
        subtasks: finalSubtasks
      })
      dialog.close()
    } catch (err) {
      errorEl.textContent = err.message
    }
  })

  return dialog
}
