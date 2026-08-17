import { h } from './dom.js'

export function buildProfilePage({ user, onUpdateName, onSeed }) {
  const header = h('div', { class: 'op-page__main-header' },
    h('div', { class: 'content-header' },
      h('div', { class: 'content-header__details' }, [
        h('h1', { class: 'content-header__title', text: 'Profile' }),
        h('p', { class: 'content-header__subline', text: 'Manage who you are in Atlas' })
      ])
    )
  )

  const nameInput = h('input', {
    class: 'form-control form-control--large',
    type: 'text',
    id: 'profile-name-input',
    value: user.name,
    required: true,
    minlength: 3,
    maxlength: 20
  })

  const nameErrorEl = h('p', { class: 'form-error' })

  const nameForm = h('form', { id: 'profile-form', class: 'card card--padded profile-page__section', novalidate: true }, [
    h('h2', { class: 'profile-page__section-title', text: 'Name' }),
    h('div', { class: 'form-group' }, [
      h('label', { class: 'form-label', for: 'profile-name-input', text: 'Name' }),
      nameInput
    ]),
    nameErrorEl,
    h('button', { type: 'submit', class: 'btn btn--primary', text: 'Save' })
  ])

  nameForm.addEventListener('submit', event => {
    event.preventDefault()
    nameErrorEl.textContent = ''
    try {
      onUpdateName(nameInput.value)
    } catch (err) {
      nameErrorEl.textContent = err.message
    }
  })

  const seedSection = h('div', { class: 'card card--padded profile-page__section' }, [
    h('h2', { class: 'profile-page__section-title', text: 'Testing' }),
    h('p', { class: 'profile-page__section-message', text: 'Replace everything in storage with sample realms, burdens, and subtasks.' }),
    h('button', { type: 'button', class: 'btn btn--no-border', onclick: onSeed }, 'Seed Test Data')
  ])

  const mainContent = h('div', { class: 'op-page__main-content profile-page' }, [nameForm, seedSection])

  return [header, mainContent]
}
