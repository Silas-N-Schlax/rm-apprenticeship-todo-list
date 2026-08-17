import { TodoList } from './todoList.js'
import { User } from './user.js'

export class StorageManager {
  get loadTodoList() {
    const raw = this.fetchFromStorage('todo-list')
    const todoList = new TodoList(raw)
    if (!raw) this.saveList(todoList.to_json)
    return todoList
  }

  get loadUser() {
    const raw = this.fetchFromStorage('user')
    const user = new User(raw)
    if (!raw) this.saveUser(user.to_json)
    return user
  }

  saveList(json) { return this.saveToStorage('todo-list', json) }
  saveUser(json) { return this.saveToStorage('user', json) }

  fetchFromStorage(key) {
    let json = localStorage.getItem(key)
    if (!json) return
    return JSON.parse(json)
  }

  saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}
