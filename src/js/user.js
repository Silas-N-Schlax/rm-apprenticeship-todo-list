// has a name
// has a created_at
//has a updated_at

export class User {
  #name; #created_at; #updated_at
  constructor(args) {
    if (!args) args = {}
    let name = args['name'] || `Titan${Math.floor(Math.random() * 1000)}`
    if (!this.validName(name)) return

    this.#name = name
    this.#created_at = args['created_at'] || new Date()
    this.#updated_at = args['updated_at'] || new Date()
  }

  get name() { return this.#name }
  set name(newName) {
    if (!this.validName(newName)) return
    this.#name = newName
    this.updated_at = new Date()
  }

  get to_json() {
    return {
      name: this.#name,
      created_at: this.#created_at,
      updated_at: this.#updated_at
    }
  }

  validName(name) {
    if (!name || name.length > 20 || name.length < 3) return AppError.throw('Name is too short or to long. Name must be between 3-20 characters')
    return true
  }
}
