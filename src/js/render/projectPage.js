import { h } from './dom.js'
import { buildBurdenCard } from './burdenCard.js'
import { buildEmptyState } from './homePage.js'

function buildGroup({ title, tasks }) {
  const titleId = `${title.toLowerCase().replace(/\s+/g, '-')}-title`

  return h('section', { class: 'burden-list__group', 'aria-labelledby': titleId }, [
    h('div', { class: 'burden-list__group-header' }, [
      h('h3', { class: 'burden-list__group-title', id: titleId, text: title }),
      h('span', { class: 'burden-list__group-count', text: String(tasks.length) })
    ]),
    h('ul', { class: 'burden-list__items' }, tasks.map(buildBurdenCard))
  ])
}

export function buildProjectPage({ project }) {
  const tasks = project.allTasks
  const active = tasks.filter(task => !task.completed)
  const completed = tasks.filter(task => task.completed)

  const header = h('div', { class: 'op-page__main-header' },
    h('div', { class: 'content-header' }, [
      h('div', { class: 'content-header__details' }, [
        h('h1', { class: 'content-header__title', text: project.name }),
        h('p', { class: 'content-header__subline', text: `${tasks.length} burdens in this realm` })
      ])
    ])
  )

  const body = tasks.length === 0
    ? buildEmptyState()
    : h('div', { class: 'burden-list' }, [
        active.length ? buildGroup({ title: 'Active Burdens', tasks: active }) : null,
        completed.length ? buildGroup({ title: 'Cast-Off Burdens', tasks: completed }) : null
      ].filter(Boolean))

  const mainContent = h('div', { class: 'op-page__main-content' }, body)

  return [header, mainContent]
}
