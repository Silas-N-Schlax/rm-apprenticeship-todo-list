import { AppError } from "./error.js";
import { nanoid } from "nanoid";

export class SubTask {
  #id; #title; #description; #completed_at; #created_at; #updated_at

  constructor(args) {
    if (!args['title'] || args['title'].length > 120 || args['title'].length < 3) AppError.throw('Title is too short or to long. Name must be between 3-120 characters')

    this.#title = args['title']
    this.#description = args['description'] || ''
    this.#created_at = args['created_at'] || Date()
    this.#updated_at = args['updated_at'] || Date()
    this.#completed_at = args['completed_at'] || null
    this.#id = args['id'] || nanoid()
  }

  get id() { return this.#id }
  get title() { return this.#title }
  get description() { return this.#description }
  get completed() { return this.#completed_at ? true : false }

  toggleComplete() {
    if (this.#completed_at) {
      this.#completed_at = null
      return false
    } else {
      this.#completed_at = Date()
      return true
    }
  }

  set update(args) {
    if (args['title']) {
      if (args['title'].length > 120 || args['title'].length < 3) AppError.throw('Title is too short or to long. Name must be between 3-120 characters')
      this.#title = args['title']
    }
    if (args['description']) this.#description = args['description']
    this.#updated_at = Date()
  }

  get to_json() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
      completed_at: this.#completed_at
    }
  }
}
