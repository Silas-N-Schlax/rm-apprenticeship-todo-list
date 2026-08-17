import { format } from 'date-fns'
import { h, icon } from './dom.js'
import { buildBurdenCard } from './burdenCard.js'

function buildGroup({ title, tasks, neglected = false }) {
  const classes = ['burden-list__group']
  if (neglected) classes.push('burden-list__group--neglected')
  const titleId = `${title.toLowerCase().replace(/\s+/g, '-')}-title`

  return h('section', { class: classes.join(' '), 'aria-labelledby': titleId }, [
    h('div', { class: 'burden-list__group-header' }, [
      h('h3', { class: 'burden-list__group-title', id: titleId, text: title }),
      h('span', { class: 'burden-list__group-count', text: String(tasks.length) })
    ]),
    h('ul', { class: 'burden-list__items' }, tasks.map(buildBurdenCard))
  ])
}

export function buildEmptyState() {
  return h('div', { class: 'empty-state' }, [
    icon('sun', 'empty-state__icon'),
    h('h2', { class: 'empty-state__title', text: 'Not a single burden today' }),
    h('p', { class: 'empty-state__message', text: 'The heavens are calm and your shoulders are free. Take on a burden whenever fate calls for one.' })
  ])
}

export function buildHomePage({ todoList }) {
  const neglected = todoList.neglectedTasks
  const dueToday = todoList.tasksDueToday
  const totalCount = neglected.length + dueToday.length

  const header = h('div', { class: 'op-page__main-header' },
    h('div', { class: 'content-header' }, [
      h('div', { class: 'content-header__details' }, [
        h('h1', { class: 'content-header__title', text: 'Today' }),
        h('p', { class: 'content-header__subline', text: format(new Date(), 'EEEE, MMMM d, yyyy') })
      ]),
      h('div', { class: 'content-header__aside' },
        h('span', { class: 'badge badge--pill', text: `${totalCount} burdens` })
      )
    ])
  )

  const body = totalCount === 0
    ? buildEmptyState()
    : h('div', { class: 'burden-list' }, [
        neglected.length ? buildGroup({ title: 'Neglected Burdens', tasks: neglected, neglected: true }) : null,
        dueToday.length ? buildGroup({ title: 'Burdens to Bear', tasks: dueToday }) : null
      ].filter(Boolean))

  const mainContent = h('div', { class: 'op-page__main-content' }, body)

  return [header, mainContent]
}
