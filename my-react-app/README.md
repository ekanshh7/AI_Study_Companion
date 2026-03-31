# AI Study Companion 📚🤖

A modern, comprehensive task management and study organization application designed specifically for students. This React-based platform helps learners track their subjects, manage daily academic tasks, schedule revisions, and leverage AI tools to enhance their study workflow. 

The application emphasizes a seamless user experience with robust data persistence, dynamic filtering, and sorting capabilities to keep students organized and on track.

## ✨ Features

* **🎛️ Interactive Dashboard:** Get a bird's-eye view of your overall study progress, upcoming deadlines, and recent activity.
* **📂 Subject & Topic Management:** Organize your curriculum into specific subjects and break them down into manageable topics with varying difficulty levels.
* **✅ Smart Task Tracking:** Manage assignments, readings, and lab reports with priority levels (High, Medium, Low) and statuses (Todo, In Progress, Done).
* **🔄 Revision Scheduler:** Keep track of topics that need reviewing with dedicated revision dates to ensure long-term retention.
* **🧠 AI Tools Integration:** Dedicated workspace to utilize AI-assisted study methods and services.
* **💾 Local Data Persistence:** Never lose your work. Your subjects, topics, and tasks are automatically saved to your browser's local storage.
* **🔔 Toast Notifications:** Real-time, non-intrusive alerts for successful actions, errors, and task updates.

## 🛠️ Tech Stack

* **Frontend Framework:** React 18
* **Build Tool:** Vite
* **Routing:** React Router v6 (`react-router-dom`)
* **State Management:** React Context API (`StudyContext`)
* **Notifications:** React Toastify
* **Styling:** Custom CSS (Modular App Shell architecture)

## 📂 Project Structure

```text
my-react-app/
├── public/                 # Static assets (Favicon, SVG icons)
├── src/
│   ├── assets/             # Images and local SVGs
│   ├── components/         # Reusable UI components (SidebarNav, TaskCard, SubjectCard, etc.)
│   ├── context/            # Global state management (StudyContext.jsx)
│   ├── hooks/              # Custom React hooks (useProgress, useDebounce, useTasks)
│   ├── pages/              # Main route views (Dashboard, Subjects, Tasks, Revision, AITools)
│   ├── services/           # External integrations (aiService.js)
│   ├── utils/              # Helper functions (helpers.js, revisionFilters.js)
│   ├── App.jsx             # Main application layout and routing
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles and CSS variables
├── index.html              # Base HTML template
├── package.json            # Project metadata and dependencies
└── vite.config.js          # Vite configuration
