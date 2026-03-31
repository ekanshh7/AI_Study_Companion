import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SidebarNav from "./components/SidebarNav/SidebarNav.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Subjects from "./pages/Subjects/Subjects.jsx";
import Tasks from "./pages/Tasks/Tasks.jsx";
import Revision from "./pages/Revision/Revision.jsx";
import AITools from "./pages/AITools/AITools.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <SidebarNav />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/ai-tools" element={<AITools />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
