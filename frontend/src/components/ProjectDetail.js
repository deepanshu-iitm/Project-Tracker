import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';
import './ProjectDetail.css';
import API from './api';

function ProjectDetail() {
    const { projectId } = useParams();
    const [projectDetails, setProjectDetails] = useState({
        title: "",
        description: "",
        milestones: [],
        assignedTeams: [],
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMilestone, setEditingMilestone] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await API.get(`/instructor/projects/${projectId}`);
                console.log("Project details:", response.data);
                setProjectDetails(response.data);
            } catch (error) {
                console.error("Error fetching project details:", error.response?.data || error.message);
            }
        };
        fetchProjectDetails();
    }, [projectId]);

    const handleDeleteMilestone = async (milestoneId) => {
        try {
            await API.delete(`/instructor/projects/${projectId}/milestones/${milestoneId}`);
            setProjectDetails((prevDetails) => ({
                ...prevDetails,
                milestones: prevDetails.milestones.filter(milestone => milestone.id !== milestoneId)
            }));
        } catch (error) {
            console.error("Error deleting milestone:", error.response?.data || error.message);
        }
    };

    const handleEditMilestone = (milestone) => {
        setEditingMilestone(milestone);
        setIsModalOpen(true);
    };

 
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const updatedMilestone = {
            title: e.target.title.value,
            description: e.target.description.value,
            due_date: e.target.due_date.value,
        };
        try {
            await API.put(`/instructor/projects/${projectId}/milestones/${editingMilestone.id}`, updatedMilestone);
            setProjectDetails((prevDetails) => ({
                ...prevDetails,
                milestones: prevDetails.milestones.map((milestone) =>
                    milestone.id === editingMilestone.id ? { ...milestone, ...updatedMilestone } : milestone
                ),
            }));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating milestone:", error.response?.data || error.message);
        }
    };

    const renderEditModal = () => {
        if (!editingMilestone) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Edit Milestone</h3>
                    <form onSubmit={handleSubmitEdit}>
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                defaultValue={editingMilestone.title}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                defaultValue={editingMilestone.description}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="due_date">Due Date</label>
                            <input
                                type="date"
                                id="due_date"
                                defaultValue={editingMilestone.due_date}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="project-detail">
            <header className="dashboard-header">
                <h1 className="project-title">{projectDetails.title}</h1>
                <p className="project-description">{projectDetails.description}</p>
            </header>

            <section className="milestones-section">
                <h2>Milestones</h2>
                <div className="project-grid">
                    {projectDetails.milestones && projectDetails.milestones.length > 0 ? (
                        projectDetails.milestones.map((milestone) => (
                            <div key={milestone.id} className="project-card">
                                <div className="project-card-header">
                                    <h3>{milestone.title}</h3>
                                    <div className="project-card-actions">
                                        <FaEdit
                                            className="action-icon"
                                            title="Edit Milestone"
                                            onClick={() => handleEditMilestone(milestone)}
                                        />
                                        <FaTrashAlt
                                            className="action-icon"
                                            title="Delete Milestone"
                                            onClick={() => handleDeleteMilestone(milestone.id)}
                                        />
                                    </div>
                                </div>
                                <p className="project-card-description">{milestone.description}</p>
                                <p className="project-card-meta"><FaCalendarAlt /> &nbsp; Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No milestones available.</p>
                    )}
                </div>
            </section>

            <section className="teams-section">
    <h2>Assigned Teams</h2>
    <div className="teams-list assigned-teams">
        {projectDetails.assignedTeams && projectDetails.assignedTeams.length > 0 ? (
            projectDetails.assignedTeams.map((team) => (
                <Link key={team.id} to={`/team-progress/${team.id}`} className="team-name">
                    <FaCheckCircle className="assigned-icon" /> {team.name}
                </Link>
            ))
        ) : (
            <p>No teams assigned yet.</p>
        )}
    </div>
</section>

            {isModalOpen && renderEditModal()}
        </div>
    );
}

export default ProjectDetail;
