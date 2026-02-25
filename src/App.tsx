import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MembersPage } from './components/MembersPage';
import { FicheDePostePage } from './components/FicheDePostePage';
import { ReglementsPage } from './components/ReglementsPage';
import { MeetingsPage } from './components/MeetingsPage';
import { CategoriesPage } from './components/CategoriesPage';
import { OrganigramPage } from './components/OrganigramPage';
import OrganigramTwoPage from './components/OrganigramTwoPage';
import { TasksViewPage } from './components/TasksViewPage';
import { ResourcesPage } from './components/ResourcesPage';
import { OrganigramProvider } from './contexts/OrganigramContext';
import { DocumentsHomePage } from './pages/DocumentsHomePage';
import { DocumentEditorPage } from './pages/DocumentEditorPage';
import { FicheDePosteEditorPage } from './pages/FicheDePosteEditorPage';

function App() {
  return (
    <Router>
      <OrganigramProvider>
        <div className="flex min-h-screen bg-default-background">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Navigate to="/planification" replace />} />
            <Route path="/planification" element={<MeetingsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/organigram" element={<OrganigramPage />} />
            <Route path="/organigram-two" element={<OrganigramTwoPage />} />
            <Route path="/membres" element={<MembersPage />} />
            <Route path="/fiche-poste" element={<FicheDePostePage />} />
            <Route path="/fiche-de-poste/create" element={<FicheDePosteEditorPage />} />
            <Route path="/gestion-taches" element={<TasksViewPage />} />
            <Route path="/reglements" element={<ReglementsPage />} />
            <Route path="/documents" element={<DocumentsHomePage />} />
            <Route path="/editor/:id" element={<DocumentEditorPage />} />
          </Routes>
        </div>
      </OrganigramProvider>
    </Router>
  );
}

export default App;
