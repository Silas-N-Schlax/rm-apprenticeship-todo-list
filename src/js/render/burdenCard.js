import { format } from 'date-fns'
import { h, icon } from './dom.js'

const WEIGHT_BADGE_MODIFIER = { 1: 'badge--danger', 2: 'badge--warning', 3: '', 4: 'badge--notice' }

function buildFate(task) {
  if (task.dueToday) return h('span', { class: 'burden-card__fate', text: 'Fate: Today' })
  if (task.overdue) {
    return h('span', { class: 'burden-card__fate burden-card__fate--neglected', text: `Fate: ${format(new Date(task.dueDate), 'MMM d')} (overdue)` })
  }
  return h('span', { class: 'burden-card__fate', text: `Fate: ${format(new Date(task.dueDate), 'MMM d')}` })
}

function buildWeightBadge(task) {
  const weight = task.priority
  if (!weight) return null
  const modifier = WEIGHT_BADGE_MODIFIER[weight.value]
  return h('span', { class: `badge${modifier ? ` ${modifier}` : ''}`, text: `Weight: ${weight.name}` })
}

function buildSubtaskCount(task) {
  const { completed, total } = task.subtaskProgress
  if (!total) return null
  return h('span', { class: 'burden-card__subtask-count' }, [
    icon('list-checks'),
    `${completed} of ${total}`
  ])
}

function buildSubtaskItem(task, subTask) {
  return h('li', { class: `subtask-item${subTask.completed ? ' subtask-item--complete' : ''}` }, [
    h('button', {
      type: 'button',
      class: `btn btn--icon btn--pill btn--small complete-toggle complete-toggle--subtask${subTask.completed ? ' complete-toggle--complete' : ''}`,
      'aria-pressed': subTask.completed ? 'true' : 'false',
      'data-task-id': task.id,
      'data-subtask-id': subTask.id,
      'data-action': 'toggle-subtask-complete'
    }, [
      icon('check', 'complete-toggle__check'),
      h('span', { class: 'sr-only', text: `Cast off: ${subTask.title}` })
    ]),
    h('span', { class: 'subtask-item__title', text: subTask.title }),
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small subtask-item__delete',
      'aria-label': `Remove subtask: ${subTask.title}`,
      'data-task-id': task.id,
      'data-subtask-id': subTask.id,
      'data-action': 'delete-subtask'
    }, icon('x'))
  ])
}

function stopToggle(event) { event.preventDefault() }

function buildSummary(task, { expandable }) {
  const meta = [buildFate(task), buildWeightBadge(task), buildSubtaskCount(task)].filter(Boolean)

  const completeToggle = h('button', {
    type: 'button',
    class: `btn btn--icon btn--pill btn--small complete-toggle${task.completed ? ' complete-toggle--complete' : ''}`,
    'aria-pressed': task.completed ? 'true' : 'false',
    'data-task-id': task.id,
    'data-action': 'toggle-complete',
    onclick: stopToggle
  }, [
    icon('check', 'complete-toggle__check'),
    h('span', { class: 'sr-only', text: `Cast off: ${task.title}` })
  ])

  const body = h('div', { class: 'burden-card__body' }, [
    h('p', { class: 'burden-card__title', text: task.title }),
    h('div', { class: 'burden-card__meta' }, meta)
  ])

  const marker = expandable ? icon('chevron-right', 'accordion__marker burden-card__marker') : null

  const actions = h('div', { class: 'burden-card__actions' }, [
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small',
      'aria-label': `Alter burden: ${task.title}`,
      'data-task-id': task.id,
      'data-action': 'alter',
      onclick: stopToggle
    }, icon('pencil')),
    h('button', {
      type: 'button',
      class: 'btn btn--icon btn--no-border btn--small',
      'aria-label': `Cast away burden: ${task.title}`,
      'data-task-id': task.id,
      'data-action': 'delete-task',
      onclick: stopToggle
    }, icon('trash-2'))
  ])

  return h(expandable ? 'summary' : 'div', { class: 'burden-card__summary' }, [completeToggle, body, marker, actions].filter(Boolean))
}

export function buildBurdenCard(task) {
  const hasDescription = Boolean(task.description && task.description.trim())
  const hasSubtasks = task.allSubTasks.length > 0
  const expandable = hasDescription || hasSubtasks

  const classes = ['card', 'card--padded', 'burden-card']
  if (task.completed) classes.push('burden-card--cast-off')
  if (task.overdue) classes.push('burden-card--neglected')

  const summary = buildSummary(task, { expandable })

  if (!expandable) {
    return h('li', {}, h('div', { class: classes.join(' ') }, summary))
  }

  const content = h('div', { class: 'burden-card__content' }, [
    hasDescription ? h('p', { class: 'burden-card__description', text: task.description }) : null,
    hasSubtasks
      ? h('ul', { class: 'burden-card__subtasks' }, task.allSubTasks.map(subTask => buildSubtaskItem(task, subTask)))
      : null
  ].filter(Boolean))

  const details = h('details', { class: `${classes.join(' ')} accordion` }, [summary, content])

  return h('li', {}, details)
}
