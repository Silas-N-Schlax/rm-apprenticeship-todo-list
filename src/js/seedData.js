import { TodoList } from './todoList.js'
import { User } from './user.js'

function daysFromNow(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

const SEED_PROJECTS = [
  {
    name: "Labors of Home",
    color: "#307fa6",
    tasks: [
      {
        title: "Clean the Augean Stables",
        description: "Shovel out a river's worth of neglect.",
        dueDate: daysFromNow(0),
        priority: 1,
        subTasks: [
          { title: "Sweep the hay", completed_at: Date() },
          { title: "Refill the water troughs" }
        ]
      },
      {
        title: "Slay the Nemean Lion",
        description: "It was due yesterday. It is still not slain.",
        dueDate: daysFromNow(-2),
        priority: 1
      },
      {
        title: "Water the garden",
        dueDate: daysFromNow(-1),
        priority: 4,
        completed_at: Date()
      }
    ]
  },
  {
    name: "Errands for Olympus",
    color: "#8a5a44",
    tasks: [
      {
        title: "Catch the Ceryneian Hind",
        dueDate: daysFromNow(0),
        priority: 2
      },
      {
        title: "Capture Cerberus",
        dueDate: daysFromNow(3),
        priority: 3,
        subTasks: [
          { title: "Bring a very large treat", completed_at: Date() },
          { title: "Do not die" }
        ]
      }
    ]
  },
  {
    name: "Someday Burdens",
    color: "#4a7c59",
    tasks: [
      {
        title: "Retrieve the Apples of the Hesperides",
        dueDate: daysFromNow(5),
        priority: 4
      }
    ]
  }
]

export function seedStorage(storage) {
  const todoList = new TodoList({ projects: SEED_PROJECTS })
  const user = new User({ name: 'Atlas' })

  storage.saveList(todoList.to_json)
  storage.saveUser(user.to_json)

  return { todoList, user }
}
