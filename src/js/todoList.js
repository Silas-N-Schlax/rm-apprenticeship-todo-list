import { Project } from './project.js'

const DEFAULT_ARGS = {
  name: "Atlas's Ledger",
  color: "#307fa6"
}

export class TodoList {
  #projects

  constructor(projects = {}) {
    this.#projects = this.loadProjects(projects['projects']) || [new Project(DEFAULT_ARGS)]
  }

  addProject(args) {
    let project = new Project(args)
    this.#projects.push(project)
    return project
  }

  get allProjects() { return this.#projects }
  get tasksDueToday() { return this.#projects.map(project => project.overDueTasks == true) }
  get tasksOverDue() { return this.#projects.map(project => project.tasksOverDue == true) }
  findProject(id) { return this.#projects.find(project => project.id == id) }

  deleteProject(id) {
    const index = this.#projects.findIndex(project => project.id == id)
    if (index !== -1) {
      this.#projects.splice(index, 1)
    }
  }

  get to_json() {
    return {
      projects: this.#projects.map(project => project.to_json)
    }
  }

  loadProjects(projects) {
    if (!projects) return
    return projects.map(project => new Project(project))
  }
}
