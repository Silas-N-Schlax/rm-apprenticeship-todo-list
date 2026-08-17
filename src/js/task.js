import { AppError } from "./error.js";
import { Priorities } from "./priorities.js"
import { customAlphabet, nanoid } from "nanoid";
import { SubTask } from './subTask.js'
import { sub } from "date-fns";

export class Task {
  #id; #title; #description; #dueDate; #priority; #completed_at; #subTasks; #created_at; #updated_at

  constructor(args) {
    if (!args['title'] || args['title'].length > 120 || args['title'].length < 3) AppError.throw('Title is too short or to long. Name must be between 3-120 characters')

    const dueDate = args['dueDate'] ? new Date(args['dueDate']) : new Date(Date.now() + 24 * 60 * 60 * 1000)
    if (!this.validDate(dueDate)) AppError.throw('Invalid Due Date')

    this.#title = args['title']
    this.#description = args['description'] || ''
    this.#dueDate = dueDate
    this.#priority = Priorities.validPriority(args['priority']) ? args['priority'] : 0 // 0 is no priority by default
    this.#subTasks = this.loadSubTasks(args['subTasks']) || []
    this.#created_at = args['created_at'] || Date()
    this.#updated_at = args['updated_at'] || Date()
    this.#completed_at = args['completed_at'] || null
    this.#id = args['id'] || nanoid()
  }

  get id() { return this.#id }
  get completed() { return this.#completed_at ? true : false }
  get overdue() { return this.#dueDate < Date() && !this.completed ? true : false }
  get dueToday() { return this._isSameDay(new Date(this.#dueDate), new Date()) ? true : false }
  get dueDate() { return this.#dueDate }
  get priority() { return Priorities.find(this.#priority) }
  get allSubTasks() { return this.#subTasks }
  get subtaskProgress() {
    return {
      completed: this.#subTasks.filter(subTask => subTask.completed).length,
      total: this.#subTasks.length
    }
  }

  get to_json() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      dueDate: this.#dueDate,
      priority: this.#priority,
      subTasks: this.#subTasks.map(subTask => subTask.to_json),
      created_at: this.#created_at,
      updated_at: this.#updated_at,
      completed_at: this.#completed_at
    }
  }

  set removeSubTask(id) {
    const index = this.#subTasks.findIndex(task => task.id == id)
    if (index !== -1) {
      this.#subTasks.splice(index, 1)
    }
  }

  set update(args) {
    if (args['title']) {
      if (args['title'].length > 120 || args['title'].length < 3) AppError.throw('Title is too short or to long. Name must be between 3-120 characters')
      this.#title = args['title']
    }
    if (args['description']) this.#description = args['description']
    if (args['dueDate']) {
      const dueDate = new Date(args['dueDate'])
      if (!this.validDate(dueDate)) AppError.throw('Invalid Due Date')
      this.#dueDate = dueDate
    }
    if (args['priority'] && Priorities.validPriority(args['priority'])) this.#priority = args['priority']
    this.#updated_at = Date()
  }

  toggleComplete() {
    if (this.#completed_at) {
      this.#completed_at = null
      return false
    } else {
      this.#completed_at = Date()
      return true
    }
  }

  addSubTask(args) {
    let subTask = new SubTask(args)
    this.#subTasks.push(subTask)
    return subTask
  }

  validDate(date) {
    return date instanceof Date && !Number.isNaN(date.getTime())
  }

  loadSubTasks(subTasks) {
    if (!subTasks) return
    return subTasks.map(task => new SubTask(task))
  }

  _isSameDay(day1, day2) {
    return day1.getFullYear() === day2.getFullYear() &&
      day1.getMonth() === day2.getMonth() &&
      day1.getDate() === day2.getDate();
  }

}
