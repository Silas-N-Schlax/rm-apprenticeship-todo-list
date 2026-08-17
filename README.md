# rm-apprenticeship-todo-list

Atlas — a myth-themed todo list app. Every ordinary todo-app concept is reframed through the Greek myth of the Titan condemned to bear the weight of the heavens: tasks are **Burdens**, projects are **Realms**, due dates are **Fates**, priority is **Weight**, and completing a task is **casting it off**.

Built with plain JavaScript (ES modules, no framework) on top of [Optics](https://github.com/RoleModel/optics), RoleModel's design system, and bundled with Webpack. All data lives in the browser's `localStorage` — there is no backend.

## Install

```bash
git clone git@github.com:Silas-N-Schlax/rm-apprenticeship-todo-list.git
cd rm-apprenticeship-todo-list
npm install
```

## Use

```bash
npm run dev
```

This starts the Webpack dev server and prints a local URL (typically `http://localhost:8080` or the next free port) — open it in your browser.

To build a static production bundle instead:

```bash
npm run build
```

The output lands in `dist/`.

### The basics

- **Forge a Realm** (sidebar) creates a new project.
- **Take on a Burden** (sidebar) creates a new task — pick which Realm it belongs to from the form.
- Click a Realm in the sidebar to see just that Realm's Burdens, split into Active and Cast-Off. Click **Today** to see everything due today or overdue, across every Realm.
- Each Burden card has a checkbox to cast it off (complete it), a pencil to alter it, and a trash icon to abandon (delete) it. Hover a Realm in the sidebar for the same alter/abandon actions, plus a quick add-a-burden-here shortcut.
- A Burden with a description or subtasks expands in place to show them — click its title/chevron to open it.
- Click your name at the bottom of the sidebar to open your Profile page, where you can rename yourself.

## Seeding test data

The Profile page (click your name in the sidebar) has a **Seed Test Data** button. Clicking it wipes out whatever Realms and Burdens are currently in `localStorage` and replaces them with a fixed set of sample data — several Realms, each with a handful of Burdens, some with descriptions and subtasks, some overdue, some already cast off — so you have something realistic to look at without creating it all by hand.

It does **not** touch your display name. Your name is a randomly generated `TitanNNN` the first time the app ever loads (see `src/js/user.js`), and seeding leaves it exactly as-is — only the Realms/Burdens are reset.

The seed data itself lives in `src/js/seedData.js` (`SEED_PROJECTS`) if you want to add to it or change what a fresh seed looks like.
