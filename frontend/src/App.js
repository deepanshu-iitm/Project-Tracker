import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import CreateProject from './components/CreateProject';
import ProjectDetail from './components/ProjectDetail';
import TeamProgress from './components/TeamProgress';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <main> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup-login" element={<AuthPage />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project-detail/:projectId" element={<ProjectDetail />} />
          <Route path="/team-progress/:teamId" element={<TeamProgress />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
