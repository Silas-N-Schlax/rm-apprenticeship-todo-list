import './styles/application.css'
import { StorageManager } from './js/storageManager.js'
import { renderSidebar } from './js/render/sidebar.js'
import { buildHomePage } from './js/render/homePage.js'
import { buildProjectPage } from './js/render/projectPage.js'
import { buildProfilePage } from './js/render/profilePage.js'
import { openProjectForm } from './js/render/forms/projectForm.js'
import { openTaskForm } from './js/render/forms/taskForm.js'
import { seedStorage } from './js/seedData.js'

const storage = new StorageManager

const todoList = storage.loadTodoList
const user = storage.loadUser

let activeProjectId = null
let showProfile = false

const mainMount = document.getElementById('main-mount')

function persist() {
  storage.saveList(todoList.to_json)
}

function render() {
  renderSidebar({ todoList, user, activeProjectId, showProfile })

  if (showProfile) {
    mainMount.replaceChildren(...buildProfilePage({ user, onUpdateName: updateUserName, onSeed: handleSeed }))
    return
  }

  const activeProject = activeProjectId && todoList.findProject(activeProjectId)
  mainMount.replaceChildren(...(activeProject ? buildProjectPage({ project: activeProject }) : buildHomePage({ todoList })))
}

function findTaskOwner(taskId) {
  return todoList.allProjects.find(project => project.findTask(taskId))
}

function reconcileSubtasks(task, submittedSubtasks) {
  const submittedIds = new Set(submittedSubtasks.filter(s => s.id).map(s => s.id))

  task.allSubTasks.slice().forEach(existing => {
    if (!submittedIds.has(existing.id)) task.removeSubTask = existing.id
  })

  submittedSubtasks.forEach(submitted => {
    if (!submitted.id) {
      task.addSubTask({ title: submitted.title })
      return
    }
    const existing = task.allSubTasks.find(st => st.id === submitted.id)
    if (existing && existing.title !== submitted.title) existing.update = { title: submitted.title }
  })
}

function addTask({ title, description, dueDate, priority, projectId, subtasks }) {
  const project = todoList.findProject(projectId)
  const task = project.addTask({ title, description, dueDate, priority })
  subtasks.forEach(subtask => task.addSubTask({ title: subtask.title }))
  persist()
  render()
}

function updateTask(taskId, { title, description, dueDate, priority, projectId, subtasks }) {
  const currentProject = findTaskOwner(taskId)
  const task = currentProject.findTask(taskId)

  task.update = { title, description, dueDate, priority }
  reconcileSubtasks(task, subtasks)

  if (projectId !== currentProject.id) {
    const targetProject = todoList.findProject(projectId)
    currentProject.removeTask(taskId)
    targetProject.addTask(task)
  }

  persist()
  render()
}

function addProject({ name, color }) {
  todoList.addProject({ name, color })
  persist()
  render()
}

function updateProject(projectId, { name, color }) {
  const project = todoList.findProject(projectId)
  project.update = { name, color }
  persist()
  render()
}

function deleteProject(projectId) {
  if (!confirm('Abandon this realm and all its burdens?')) return
  todoList.deleteProject(projectId)
  if (activeProjectId === projectId) activeProjectId = null
  persist()
  render()
}

function deleteTask(taskId) {
  if (!confirm('Cast away this burden for good?')) return
  const project = findTaskOwner(taskId)
  project.deleteTask(taskId)
  persist()
  render()
}

function deleteSubtask(taskId, subtaskId) {
  const project = findTaskOwner(taskId)
  const task = project.findTask(taskId)
  task.removeSubTask = subtaskId
  persist()
  render()
}

function toggleTaskComplete(taskId) {
  const project = findTaskOwner(taskId)
  const task = project.findTask(taskId)
  task.toggleComplete()
  persist()
  render()
}

function toggleSubtaskComplete(taskId, subtaskId) {
  const project = findTaskOwner(taskId)
  const task = project.findTask(taskId)
  const subtask = task.allSubTasks.find(st => st.id === subtaskId)
  subtask.toggleComplete()
  persist()
  render()
}

function updateUserName(name) {
  user.name = name
  storage.saveUser(user.to_json)
  render()
}

function handleSeed() {
  seedStorage(storage)
  location.reload()
}

function handleAddProject() {
  openProjectForm({ onSubmit: addProject })
}

function handleEditProject(projectId) {
  const project = todoList.findProject(projectId)
  openProjectForm({ project, onSubmit: args => updateProject(projectId, args) })
}

function handleAddTask(projectId) {
  if (!todoList.allProjects.length) {
    alert('Forge a realm before you can take on a burden.')
    return
  }
  const targetProjectId = projectId || activeProjectId || todoList.allProjects[0].id
  openTaskForm({ projects: todoList.allProjects, projectId: targetProjectId, onSubmit: addTask })
}

function handleEditTask(taskId) {
  const project = findTaskOwner(taskId)
  const task = project.findTask(taskId)
  openTaskForm({ task, projects: todoList.allProjects, projectId: project.id, onSubmit: args => updateTask(taskId, args) })
}

function selectProject({ projectId }) {
  activeProjectId = projectId || null
  showProfile = false
  render()
}

function goToProfile() {
  showProfile = true
  render()
}

const actionHandlers = {
  'select-project': selectProject,
  'show-profile': goToProfile,
  'add-project': handleAddProject,
  'edit-project': ({ projectId }) => handleEditProject(projectId),
  'delete-project': ({ projectId }) => deleteProject(projectId),
  'add-task': ({ projectId }) => handleAddTask(projectId),
  'alter': ({ taskId }) => handleEditTask(taskId),
  'delete-task': ({ taskId }) => deleteTask(taskId),
  'toggle-complete': ({ taskId }) => toggleTaskComplete(taskId),
  'toggle-subtask-complete': ({ taskId, subtaskId }) => toggleSubtaskComplete(taskId, subtaskId),
  'delete-subtask': ({ taskId, subtaskId }) => deleteSubtask(taskId, subtaskId)
}

document.addEventListener('click', event => {
  const target = event.target.closest('[data-action]')
  if (!target) return

  const handler = actionHandlers[target.dataset.action]
  if (handler) handler(target.dataset)
})

document.getElementById('forge-realm-btn').addEventListener('click', handleAddProject)
document.getElementById('add-task-btn').addEventListener('click', () => handleAddTask())

render()
