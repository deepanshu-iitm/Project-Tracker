import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCalendarAlt, FaUsers, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './InstructorDashboard.css';
import API from './api';
import EditProjectPopup from './EditProjectPopup';

function InstructorDashboard() {
    const navigate = useNavigate();
    const [instructorName, setInstructorName] = useState("Instructor");
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await API.get('/instructor/projects');
                if (response.data && Array.isArray(response.data)) {
                    setProjects(response.data); 
                } else {
                    console.warn("Unexpected data format from API:", response.data);
                    setProjects([]); 
                }
            } catch (error) {
                console.error('Error fetching projects:', error.response?.data || error.message);
                setProjects([]); 
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = () => {
        navigate('/create-project');
    };

    const handleProjectClick = (projectId) => {
        navigate(`/project-detail/${projectId}`);
    };

    const handleDeleteProject = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await API.delete(`/instructor/projects/${projectId}`);
                setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
                alert('Project deleted successfully.');
            } catch (error) {
                console.error('Error deleting project:', error.response?.data || error.message);
                alert('Failed to delete project.');
            }
        }
    };

    if (projects === null) {
        return <div>Loading projects...</div>;
    }

    const handleEditProject = (project) => {
        setEditingProject(project);
    };

    const handleProjectUpdated = (updatedProject) => {
        setProjects((prev) =>
            prev.map((project) => 
                project.id === updatedProject.id ? updatedProject : project
            )
        );
    };

    return (
        <div className="instructor-dashboard">
            <header className="dashboard-header-instructor">
                <h1>Welcome, {instructorName}</h1>
                <a href="create-project"><button className="create-project-button">
                    <FaPlus /> New Project
                </button></a>
            </header>

            <section className="projects-section">
                <h2>Projects</h2>
                <div className="project-grid-instructor">
                    {projects.map((project) => (
                        <div className="project-card-instructor" key={project.id}>
                            <h3 onClick={() => handleProjectClick(project.id)} className="project-title-instructor">
                                {project.title || "Project Title"}
                            </h3>
                            <p className="project-description-instructor">{project.description || "Description goes here."}</p>
                            <div className="project-meta">
                                <span><FaCalendarAlt /> {project.due_date ? `Next Milestone: ${new Date(project.due_date).toLocaleDateString()}` : "No upcoming milestone"}</span>
                            </div>

                            <div className="project-actions">
                                <FaEdit className="action-icon-instructor" title="Edit Project" onClick={() => handleEditProject(project)}/>
                                <FaTrashAlt className="action-icon-instructor" title="Delete Project" onClick={() => handleDeleteProject(project.id)}/>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {editingProject && (
                <EditProjectPopup
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSave={handleProjectUpdated}
                />
            )}
        </div>
    );
}

export default InstructorDashboard;
