import { TodoList } from './todoList.js'

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
      },
      {
        title: "Polish the bronze shield",
        description: "It's gone dull sitting by the door.",
        dueDate: daysFromNow(2),
        priority: 3,
        subTasks: [
          { title: "Find the polish" },
          { title: "Buff out the scratches" }
        ]
      },
      {
        title: "Mend the sandals",
        dueDate: daysFromNow(7),
        priority: 4
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
      },
      {
        title: "Clean the stables of Augeas' cousin",
        description: "A favor owed, not a labor assigned.",
        dueDate: daysFromNow(-3),
        priority: 2
      },
      {
        title: "Deliver a message to the Oracle",
        dueDate: daysFromNow(1),
        priority: 1,
        subTasks: [
          { title: "Write the message" },
          { title: "Find someone brave enough to carry it" },
          { title: "Wait for the reply" }
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
      },
      {
        title: "Learn the language of the Titans",
        description: "For when the small talk with Kronos gets old.",
        dueDate: daysFromNow(30),
        priority: 4
      },
      {
        title: "Build a proper garden on the mountaintop",
        dueDate: daysFromNow(14),
        priority: 3,
        subTasks: [
          { title: "Haul up soil" },
          { title: "Choose what will actually survive the wind" }
        ]
      }
    ]
  },
  {
    name: "Debts to the Gods",
    color: "#b3512e",
    tasks: [
      {
        title: "Return Prometheus' fire-starter",
        description: "Borrowed it three ages ago. Overdue is an understatement.",
        dueDate: daysFromNow(-10),
        priority: 1
      },
      {
        title: "Thank Hermes for the sandals",
        dueDate: daysFromNow(4),
        priority: 4,
        completed_at: Date()
      },
      {
        title: "Settle the wager with Poseidon",
        dueDate: daysFromNow(6),
        priority: 2,
        subTasks: [
          { title: "Count the trident's prongs, again" },
          { title: "Admit defeat gracefully" }
        ]
      }
    ]
  }
]

export function seedStorage(storage) {
  const todoList = new TodoList({ projects: SEED_PROJECTS })
  storage.saveList(todoList.to_json)
  return todoList
}
