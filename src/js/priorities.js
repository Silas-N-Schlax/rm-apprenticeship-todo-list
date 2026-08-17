const PRIORITIES = [
  {
    name: 'Crushing',
    value: 1,
    color: 'var(--op-color-alerts-danger-base)'
  },
  {
    name: 'Heavy',
    value: 2,
    color: 'var(--op-color-alerts-warning-base)'
  },
  {
    name: 'Moderate',
    value: 3,
    color: 'var(--op-color-alerts-info-base)'
  },
  {
    name: 'Light',
    value: 4,
    color: 'var(--op-color-alerts-notice-base)'
  }
]

import { AppError } from "./error.js"

export class Priorities {
  static validPriority(priorityValue) {
    PRIORITIES.forEach((setPriority) => {
      if (setPriority.value == priorityValue) return true
    })
  }

  static find(priorityValue) {
    return PRIORITIES.find(priority => priority.value == priorityValue)
  }

  static all() {
    return PRIORITIES
  }
}
