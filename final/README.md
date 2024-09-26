# React + TypeScript + Vite

Welcome to the Calendar App! I have been working on this project for weeks as a final for my exam on course careers, specialization front end. This is a simple, React-based calendar application where you can view months, select specific days, and manage your events in an easy-to-use interface. It’s built with dayjs for handling dates and uses React Context to keep everything in sync across the app.

Some of my features are:

    *Monthly View: See the entire month laid out as a grid, with each day clickable for adding or editing events.

    *Event Management: Easily create, edit, and delete events. Events can have labels to help keep things organized.

    *Event Modal: A popup for managing events, which includes form validation.

    *Global State: The app uses React Context to handle state across different components, like which month you’re viewing or whether the event modal is open.

    *Label Filtering: View only the events that matter to you by filtering with labels.

Tools I used:

    *React: The core of the application’s UI.

    *TypeScript: Helps make the app more predictable and easier to maintain with type safety.

    *Day.js: A lightweight library for managing and formatting dates.

    *React Context: Global state management without the need for extra libraries like Redux.

    *React Transition Group: Smooth animations for modals and transitions.

    *Tailwind CSS: i used tailwind to style the project

src/
│
├── components/
│ ├── CalendarHeader.tsx # Header with navigation controls (like moving between months)
│ ├── Month.tsx # Displays the month as a grid of days
│ ├── Day.tsx # Handles rendering each individual day in the grid
│ ├── EventModal.tsx # The modal for creating/editing events
│ └── OverflowModal.tsx # Displays overflow events when there are too many in one day
│
├── context/
│ ├── GlobalContext.tsx # Defines and provides the app's global state
│ ├── ContextWrapper.tsx # Wraps the app with the global context provider
│
├── util/
│ ├── index.ts # Utility functions, like the one that generates the current month
│
├── App.tsx # Main app component that pulls everything together
└── App.css # Styles for the app

Prerequisites!!!!!
Before you dive in, make sure you’ve got the following installed on your machine:

Node.js (v12 or higher)
npm for managing dependencies

clone the repository with this :
git clone https://github.com/andreayasmine/Final.git

cd final

install dependencies:
npm install
npm install -D tailwindcss
npx tailwindcss init
npm add dayjs
npm add react-transition-group

then run-----
npm start
or
npm run dev

How to Use
\*Navigating: Use the buttons in the header to move between months or jump back to the current date.

\*Adding/Editing Events: Click on a day to open a modal where you can add a new event or edit existing ones.

\*Filtering Events: You can use labels to filter and display only the events you care about.

                             MAIN COMPONENTS

*App.tsx
1.The main file that ties everything together.
2.Uses useContext to tap into the global state (like monthIndex and showEventModal).
3.Handles rendering the header, the month grid, and the event modal if needed.
*CalendarHeader.tsx 1. navigation control to switch months 2. has today button to bring you to current month and day
*Month.tsx
1.display of month into rows and weeks 2. you are able to click each day
*Day.tsx 1. renders individual days displays the number of events on that specifi day 2. if u click on day, opens event modal
*EventModal.tsx 1. when clicked a day or event allows you to create or edit events 2. start end time validation
*GlobalContext.tsx 1. apps global state which has selected month, slected day, and saved events 2. provides add, update, delete 3. showing and hiding of event modal

feel free to add change and edit any of my code as you see fit! (after my exam is graded lol so, about a week or two after i post this)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
