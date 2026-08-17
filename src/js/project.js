import { nanoid } from 'nanoid';
import { AppError } from './error.js'
import { Task } from './task.js'

export class Project {
  #id; #color; #name; #created_at; #updated_at; #tasks

  constructor(args) {
    const name = args['name']
    if (!this.validColor(args['color'])) AppError.throw('Invalid Color')
    if (!name || name.length > 20 || name.length < 3) AppError.throw('Name is too short or to long. Name must be between 3-20 characters')
    this.#name = name
    this.#color = args['color']
    this.#created_at = args['created_at'] || Date()
    this.#updated_at = args['updated_at'] || Date()
    this.#tasks = this.loadTasks(args['tasks']) || [] // * Load tasks
    this.#id = args['id'] || nanoid()
  }

  get id() { return this.#id }
  get name() { return this.#name }
  get color() { return this.#color }
  get allTasks() { return this.#tasks }
  get taskCount() { return this.#tasks.length }
  get overDueTasks() { return this.#tasks.map(task => task.overdue == true) }
  get tasksDueToday() { return this.#tasks.map(task => task.dueToday == true) }

  get to_json() {
    return {
      id: this.#id,
      name: this.#name,
      color: this.#color,
      tasks: this.#tasks.map(task => task.to_json),
      created_at: this.#created_at,
      updated_at: this.#updated_at
    }
  }

  set update(args) {
    // write this and ensure to update the updated_at
  }

  addTask(args) {
    let task = args instanceof Task ? args : new Task(args)
    this.#tasks.push(task)
    return task
  }

  findTask(id) {
    return this.#tasks.find(task => task.id == id)
  }

  deleteTask(id) {
    const index = this.#tasks.findIndex(task => task.id == id)
    if (index !== -1) {
      this.#tasks.splice(index, 1)
    }
  }

  removeTask(id) {
    const index = this.#tasks.findIndex(task => task.id == id)
    if (index === -1) return null
    return this.#tasks.splice(index, 1)[0]
  }

  validColor(color) {
    const hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3}|[a-fA-F0-9]{8})$/
    return hexRegex.test(color)
  }

  loadTasks(tasks) {
    if (!tasks) return
    return tasks.map(task => new Task(task))
  }
}
