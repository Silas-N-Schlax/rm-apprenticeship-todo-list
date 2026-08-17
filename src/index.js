import './styles/application.css'
import { StorageManager } from './js/storageManager.js'
import { seedStorage } from './js/seedData.js'
const storage = new StorageManager

let todoList = storage.loadTodoList
let user = storage.loadUser

document.getElementById('seed-btn').addEventListener('click', () => {
  const seeded = seedStorage(storage)
  todoList = seeded.todoList
  user = seeded.user
  console.log('Seeded storage with sample data', todoList.to_json)
})

