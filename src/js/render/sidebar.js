import { h, icon } from './dom.js'

function buildRealmNavItem({ name, count, active, dotColor, dotIcon, projectId, editable = false }) {
  const marker = dotIcon
    ? icon(dotIcon, 'realm-nav__icon')
    : h('span', { class: 'realm-nav__dot', style: dotColor ? `background-color: ${dotColor}` : null, 'aria-hidden': 'true' })

  const button = h('button', {
    type: 'button',
    class: `btn btn--no-border realm-nav__item${active ? ' btn--active' : ''}`,
    'aria-current': active ? 'page' : null,
    'data-project-id': projectId ?? '',
    'data-action': 'select-project'
  }, [
    marker,
    h('span', { class: 'realm-nav__name', text: name }),
    h('span', { class: 'realm-nav__count' }, h('span', { class: 'badge badge--pill', text: String(count) }))
  ])

  if (!editable) return h('li', {}, button)

  const rowActions = h('div', { class: 'realm-nav__actions' }, [
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small',
      'aria-label': `Take on a burden in: ${name}`,
      'data-project-id': projectId,
      'data-action': 'add-task'
    }, icon('plus')),
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small',
      'aria-label': `Alter realm: ${name}`,
      'data-project-id': projectId,
      'data-action': 'edit-project'
    }, icon('pencil')),
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small',
      'aria-label': `Abandon realm: ${name}`,
      'data-project-id': projectId,
      'data-action': 'delete-project'
    }, icon('trash-2'))
  ])

  return h('li', { class: 'realm-nav__row' }, [button, rowActions])
}

export function renderSidebar({ todoList, user, activeProjectId = null, showProfile = false }) {
  const items = [
    buildRealmNavItem({ name: 'Today', count: todoList.tasksDueToday.length, active: !showProfile && activeProjectId === null, dotIcon: 'sun', projectId: '' }),
    ...todoList.allProjects.map(project => buildRealmNavItem({
      name: project.name,
      count: project.taskCount,
      active: !showProfile && project.id === activeProjectId,
      dotColor: project.color,
      projectId: project.id,
      editable: true
    }))
  ]

  document.getElementById('realm-nav-list').replaceChildren(...items)
  document.getElementById('profile-name').textContent = user.name
  document.getElementById('profile-btn').classList.toggle('btn--active', showProfile)
}
